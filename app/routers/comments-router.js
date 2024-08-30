const commentsRouter = require("express").Router();
const {
  deleteCommentById,
  getCommentById,
  updateCommentVotes,
} = require("../server-controller");

commentsRouter.get("/:comment_id", getCommentById);

commentsRouter.delete("/:comment_id", deleteCommentById);

commentsRouter.patch("/:comment_id", updateCommentVotes);

module.exports = commentsRouter;
