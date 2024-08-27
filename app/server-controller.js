const {
  getAllTopics,
  findArticleById,
  getAllArticles,
  findComments,
  findCommentsByArticle,
} = require("./server-model");
const endpoints = require("../endpoints.json");

exports.getEndpoints = (req, res, next) => {
  res.status(200).send({ endpoints });
};

exports.getTopics = (req, res, next) => {
  getAllTopics()
    .then((rows) => {
      res.status(200).send(rows);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  getAllArticles().then((articles) => {
    res.status(200).send(articles);
  });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  findArticleById(article_id)
    .then((data) => {
      res.status(200).send({ article: data[0] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  findArticleById(article_id)
    .then(() => {
      findComments(article_id).then((comments) =>
        res.status(200).send(comments)
      );
    })
    .catch((err) => {
      next(err);
    });
};
