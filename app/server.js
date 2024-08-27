const express = require("express");
const app = express();
const { getTopics } = require("./server-controller");
const {
  handlePSQLErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors");

app.use(express.json());

app.get("/api/topics", getTopics);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
