const express = require("express");
const app = express();
const { getTopics, getEndpoints } = require("./server-controller");

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

module.exports = app;
