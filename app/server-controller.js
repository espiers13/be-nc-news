const { getAllTopics, findEndpoints } = require("./server-model");
const endPoints = require("../endpoints.json");

exports.getTopics = (req, res, next) => {
  getAllTopics()
    .then((rows) => {
      res.status(200).send(rows);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getEndpoints = (req, res, next) => {
  res.status(200).send(endPoints);
};
