const { Router } = require("express");
const messagesRouter = Router();
const userController = require("../controllers/userController");
const messageController = require("../controllers/messageController");
const verifyToken = require("../middlewares/authMiddleware");

messagesRouter.post("/register", userController.postRegister);
messagesRouter.post("/login", userController.postLogin);
messagesRouter.put(
  "/user-details/:id",
  verifyToken,
  userController.putProfileDetails
);

messagesRouter.post(
  "/messages/:id",
  verifyToken,
  messageController.postMessage
);

module.exports = messagesRouter;
