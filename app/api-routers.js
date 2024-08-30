const apiRouter = require("express").Router();
const {
  getTopics,
  getEndpoints,
  getArticleById,
  getArticles,
  getCommentsByArticle,
  postNewComment,
  updateArticleVotes,
  deleteCommentById,
  getUsers,
} = require("./server-controller");

apiRouter.get("/", getEndpoints);

apiRouter.get("/topics", getTopics);

apiRouter.get("/articles", getArticles);

apiRouter.get("/users", getUsers);

apiRouter.get("/articles/:article_id", getArticleById);

apiRouter.get("/articles/:article_id/comments", getCommentsByArticle);

apiRouter.post("/articles/:article_id/comments", postNewComment);

apiRouter.patch("/articles/:article_id", updateArticleVotes);

apiRouter.delete("/comments/:comment_id", deleteCommentById);

module.exports = apiRouter;
