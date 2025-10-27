const { Router } = require("express");
const messagesRouter = Router();
const { upload } = require("../middlewares/multerConfig.js");
const userController = require("../controllers/userController");
const messageController = require("../controllers/messageController");
const {
  verifyToken,
  verifyUserAuthorization,
} = require("../middlewares/authMiddleware");

messagesRouter.post("/register", userController.postRegister);
messagesRouter.post("/login", userController.postLogin);
messagesRouter.get(
  "/users/:id",
  verifyToken,
  verifyUserAuthorization,
  userController.getUserData
);
messagesRouter.put(
  "/user-details/:id",
  verifyToken,
  verifyUserAuthorization,
  userController.putProfileDetails
);
messagesRouter.put(
  "/profile-picture/:id",
  verifyToken,
  verifyUserAuthorization,
  upload.single("picture"),
  userController.updateProfilePicture
);
messagesRouter.get("/user/:id", verifyToken, userController.getReceiverName);
messagesRouter.get(
  "/search/users/:name",
  verifyToken,
  userController.getUserByName
);

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
