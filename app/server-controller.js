const {
  getAllTopics,
  findArticleById,
  getAllArticles,
  getAllUsers,
  findComments,
  findCommentById,
  findNewestComment,
  createNewComment,
  updateArticle,
  deleteComment,
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

exports.getUsers = (req, res, next) => {
  getAllUsers().then((users) => {
    res.status(200).send(users);
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

exports.postNewComment = (req, res, next) => {
  let { article_id } = req.params;
  const { username, body } = req.body;
  createNewComment(article_id, username, body).catch((err) => {
    next(err);
  });

  findNewestComment()
    .then((article) => {
      res.status(201).send(article[0]);
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  let { inc_votes } = req.body;
  updateArticle(article_id, inc_votes).catch((err) => {
    next(err);
  });
  findArticleById(article_id)
    .then((article) => {
      res.status(200).send(article[0]);
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  findCommentById(comment_id).catch((err) => {
    next(err);
  });
  deleteComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
