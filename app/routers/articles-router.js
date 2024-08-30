const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  getCommentsByArticle,
  postNewComment,
  updateArticleVotes,
  postNewArticle,
} = require("../server-controller");

articlesRouter.get("/", getArticles);

articlesRouter.get("/:article_id", getArticleById);

articlesRouter.get("/:article_id/comments", getCommentsByArticle);

articlesRouter.post("/:article_id/comments", postNewComment);

articlesRouter.patch("/:article_id", updateArticleVotes);

articlesRouter.post("/", postNewArticle);

module.exports = articlesRouter;
