const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  getCommentsByArticle,
  postNewComment,
  updateArticleVotes,
} = require("../server-controller");

articlesRouter.get("/", getArticles);

articlesRouter.get("/:article_id", getArticleById);

articlesRouter.get("/:article_id/comments", getCommentsByArticle);

articlesRouter.post("/:article_id/comments", postNewComment);

articlesRouter.patch("/:article_id", updateArticleVotes);

module.exports = articlesRouter;
