const apiRouter = require("express").Router();
const articlesRouter = require("./articles-router");
const usersRouter = require("./users-router");
const topicsRouter = require("./topics-router");
const commentsRouter = require("./comments-router");
const { getEndpoints } = require("../server-controller");

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/comments", commentsRouter);

apiRouter.get("/", getEndpoints);

module.exports = apiRouter;
