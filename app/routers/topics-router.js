const topicsRouter = require("express").Router();
const { getTopics } = require("../server-controller");

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;
