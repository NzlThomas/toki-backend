const { Router } = require("express");
const messagesRouter = Router();
const userController = require("../controllers/userController");

messagesRouter.post("/register", userController.postRegister);

module.exports = messagesRouter;
