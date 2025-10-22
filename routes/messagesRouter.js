const { Router } = require("express");
const messagesRouter = Router();
const userController = require("../controllers/userController");
const messageController = require("../controllers/messageController");
const verifyToken = require("../middlewares/authMiddleware");

messagesRouter.post("/register", userController.postRegister);
messagesRouter.post("/login", userController.postLogin);
messagesRouter.get("/users/:id", verifyToken, userController.getUserData);
messagesRouter.put(
  "/user-details/:id",
  verifyToken,
  userController.putProfileDetails
);
messagesRouter.get("/user/:id", verifyToken, userController.getReceiverName);

messagesRouter.post(
  "/messages/:id",
  verifyToken,
  messageController.postMessage
);
messagesRouter.get(
  "/messages/:id",
  verifyToken,
  messageController.getConversation
);
messagesRouter.put("/message/:id", verifyToken, messageController.putMessage);
messagesRouter.delete(
  "/message/:id",
  verifyToken,
  messageController.deleteMessage
);

module.exports = messagesRouter;
