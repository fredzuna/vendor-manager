const { Agreement } = require("../models");
const { Op } = require("sequelize");

exports.findAll = (req, res) => {
  Agreement.findAll({ where: {status: {[Op.ne]: 'terminated'}} })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving agreements."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Agreement.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Agreement with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Agreement with id=" + id
      });
    });
};