const { Op } = require("sequelize");
const { db } = require('../lib/orm');
const { Agreement, Submission, Account } = require("../models");

exports.findAllUnpaid = (req, res) => {
  Submission.findAll({
    where: {
      paid: { [Op.eq]: 0 }
    },
    include: {
      model: Agreement,
      attributes: ['status'],
      where: {
        status: {[Op.eq]: 'in_progress'},
      },
      include: {
        model: Account,
        as: 'Buyer',
        attributes: ['firstName', 'lastName', 'balance']
      }
    }
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving unpaid agreements."
    });
  })
}; 

exports.paySubmission = async (req, res) => {  
  const submissionId = req.params.submission_id;  
  const transaction = await db.transaction();

  try {
    const submissionFound = await Submission.findOne({ 
      where: {
        id: { [Op.eq]: submissionId }
      },
      include: {
        model: Agreement,
        include: [
          {
            model: Account,
            as: 'Supplier'
          },
          {
            model: Account,
            as: 'Buyer'
          }
        ]
      }
    });
  
    if (!submissionFound) {
      res.status(404).send({
        message: "The submission could not be found"
      });
      return;
    }

    const { Agreement: { Supplier, Buyer}, price: amountToPay } = submissionFound;

    if(amountToPay > Buyer.balance  ) {
      res.status(404).send({
        message: "Buyer balance should be greater than or equal to the amount to pay"
      });
      return;
    }

    submissionFound.paid = true;
    submissionFound.paymentDate = new Date();
    await submissionFound.save({transaction});
    
    Buyer.balance -= amountToPay;
    await Buyer.save({ transaction })    
    
    Supplier.balance += amountToPay;
    await Supplier.save({ transaction }) 

    await transaction.commit()
    res.send({
      message: "The submission has been paid successfuly"
    });

  } catch (error) {

    await transaction.rollback()

    res.status(500).send({
      message:
      error.message || "Some error occurred while paying submission."
    });
  }

};