const { Router } = require("express");
const messagesRouter = Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middlewares/authMiddleware");

messagesRouter.post("/register", userController.postRegister);
messagesRouter.post("/login", userController.postLogin);

module.exports = messagesRouter;
