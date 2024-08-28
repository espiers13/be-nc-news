const express = require("express");
const app = express();
const {
  getTopics,
  getEndpoints,
  getArticleById,
  getArticles,
  getCommentsByArticle,
  postNewComment,
  updateArticleVotes,
  deleteCommentById,
} = require("./server-controller");
const {
  handlePSQLErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors");
app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticle);

app.post("/api/articles/:article_id/comments", postNewComment);

app.patch("/api/articles/:article_id", updateArticleVotes);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
