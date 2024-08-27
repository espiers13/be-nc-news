const { getAllTopics, findArticleById } = require("./server-model");
const endpoints = require("../endpoints.json");

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
  res.status(200).send({ endpoints });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  findArticleById(article_id)
    .then((data) => {
      if (data.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      } else res.status(200).send({ article: data[0] });
    })
    .catch((err) => {
      next(err);
    });
};
