const { Op, fn, col } = require("sequelize");
const { db } = require('../lib/orm');
const { Agreement, Submission, Account } = require("../models");

exports.bestSupplierProfession = async (req, res) => {
  const startDate = req.query.start;
  const endDate = req.query.end;  

  if (!startDate || !endDate) {
    res.status(400).send({
      message: "Start date and End date are required"
    });
    return;
  }

  try {

    const submissionGroup = await Submission.findOne({
      attributes: [
        'Agreement.Supplier.id',
        [fn('sum', col('price')), 'totalAmount'],
      ],
      where: {
        paid: 1,
        paymentDate : {
          [Op.between] : [startDate , endDate ]
        }
      },
      include: {
        model: Agreement,
        attributes: [
          'SupplierId'
        ],
        include: {
          model: Account,
          attributes: [
            'id',
            'profession'
          ],
          as: 'Supplier',
          where: {
            type: 'supplier'
          }
        }
      },      
      group: ['Agreement.Supplier.id'],
      order: [[col("totalAmount"), "DESC"]]
    });
    
    res.send(submissionGroup);

  } catch (error) {
    res.status(500).send({
      message:
      error.message || "Some error occurred while getting best supllier."
    });
  }

};

exports.bestBuyers = async (req, res) => {
  const startDate = req.query.start;
  const endDate = req.query.end;  
  const limit = req.query.limit;

  if (!startDate || !endDate) {
    res.status(400).send({
      message: "Start date and End date are required"
    });
    return;
  }

  try {

    const submissionGroup = await Submission.findAll({
      attributes: [
        'Agreement.Buyer.id',
        [fn('sum', col('price')), 'totalAmount'],
      ],
      where: {
        paid: 1,
        paymentDate : {
          [Op.between] : [startDate , endDate ]
        }
      },
      include: {
        model: Agreement,
        attributes: [
          'BuyerId'
        ],
        include: {
          model: Account,          
          as: 'Buyer',
          where: {
            type: 'buyer'
          }
        }
      },      
      group: ['Agreement.Buyer.id'],
      order: [[col("totalAmount"), "DESC"]],
      limit: limit || 3
    });
    
    res.send(submissionGroup.map(item => item.Agreement.Buyer));

  } catch (error) {
    res.status(500).send({
      message:
      error.message || "Some error occurred while getting best supllier."
    });
  }

};