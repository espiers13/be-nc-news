const { getAllTopics } = require("./server-model");

exports.getTopics = (req, res, next) => {
  getAllTopics()
    .then((rows) => {
      res.status(200).send(rows);
    })
    .catch((err) => {
      console.log(err, "<-- error in catch block");
      next(err);
    });
};
