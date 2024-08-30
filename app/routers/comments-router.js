const commentsRouter = require("express").Router();
const { deleteCommentById } = require("../server-controller");

commentsRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentsRouter;
