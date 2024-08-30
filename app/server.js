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
  getUsers,
} = require("./server-controller");
const {
  handlePSQLErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors");
const apiRouter = require("./api-routers");
app.use(express.json());

app.use("/api", apiRouter);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
