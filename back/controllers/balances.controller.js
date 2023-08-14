const { Op } = require("sequelize");
const { db } = require('../lib/orm');
const { Agreement, Submission, Account } = require("../models");

exports.depositBalance = async (req, res) => {  
  const accountId = req.params.accountId;  
  const amountToDeposit = req.body.amount;

  if (!amountToDeposit) {
    res.status(404).send({
      message: "Amount to deposit could not be found"
    });
    return;
  }  

  try {
    const totalSubmission = await Submission.sum('price', {
        where: {
          paid: {[Op.eq]: 0}
        },
        include: {
          model: Agreement,
          attributes: [],
          where: {
            BuyerId: {[Op.eq]: parseInt(accountId)},
            status: {[Op.eq]: 'in_progress'}
          }
        }
      }
    );

    const buyerFound = await Account.findOne({ 
      where: {
        id: accountId,
        type: 'buyer'
      }
    });
  
    if (!buyerFound) {
      res.status(404).send({
        message: "The buyer could not be found"
      });
      return;
    }    

    if(amountToDeposit > (totalSubmission*0.1)) {
      res.status(404).send({
        message: `A buyer can not deposit more than 10% of their total submissions, total submission: ${totalSubmission}`
      });
      return;
    }


    buyerFound.balance += amountToDeposit;
    await buyerFound.save()
    
    res.send({
      message: "buyer has been desposited succesfuly"
    });

  } catch (error) {
    res.status(500).send({
      message:
      error.message || "Some error occurred while depositing an amount."
    });
  }

};