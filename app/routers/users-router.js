const usersRouter = require("express").Router();
const { getUsers, getUserByUsername } = require("../server-controller");

usersRouter.get("/", getUsers);

usersRouter.get("/:username", getUserByUsername);

module.exports = usersRouter;
