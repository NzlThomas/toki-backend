import { Router } from "express";
const messagesRouter = Router();
import { upload } from "../middlewares/multerConfig.js";
import userController from "../controllers/userController.js";
import messageController from "../controllers/messageController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const { verifyToken, verifyUserAuthorization } = authMiddleware;

messagesRouter.post("/register", userController.postRegister);
messagesRouter.post("/login", userController.postLogin);
messagesRouter.get(
  "/users/:id",
  verifyToken,
  verifyUserAuthorization,
  userController.getUserData,
);
messagesRouter.put(
  "/user-details/:id",
  verifyToken,
  verifyUserAuthorization,
  userController.putProfileDetails,
);
messagesRouter.put(
  "/profile-picture/:id",
  verifyToken,
  verifyUserAuthorization,
  upload.single("picture"),
  userController.updateProfilePicture,
);
messagesRouter.get("/user/:id", verifyToken, userController.getReceiverName);
messagesRouter.get(
  "/search/users/:name",
  verifyToken,
  userController.getUserByName,
);

messagesRouter.post(
  "/messages/:id",
  verifyToken,
  messageController.postMessage,
);
messagesRouter.get(
  "/messages/:id",
  verifyToken,
  messageController.getConversation,
);
messagesRouter.get(
  "/conversations",
  verifyToken,
  userController.getUserConversations,
);

messagesRouter.put("/message/:id", verifyToken, messageController.putMessage);
messagesRouter.delete(
  "/message/:id",
  verifyToken,
  messageController.deleteMessage,
);

export default messagesRouter;
