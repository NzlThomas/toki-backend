import { Router } from "express";
const messagesRouter = Router();
import { upload } from "../middlewares/multerConfig.js";
import userController from "../controllers/userController.js";
import messageController from "../controllers/messageController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const { verifyToken, verifyUserAuthorization, verifyEmail } = authMiddleware;

messagesRouter.post("/register", userController.postRegister);
messagesRouter.post("/login", userController.postLogin);
messagesRouter.post("/logout", userController.postLogout);

messagesRouter.get("/verify-email", userController.verifyEmailToken);
messagesRouter.post(
  "/resend-verification",
  verifyToken,
  userController.resendVerificationEmail,
);

messagesRouter.get("/profile", verifyToken, userController.getProfile);

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

messagesRouter.get(
  "/user/:id",
  verifyToken,
  verifyEmail,
  userController.getReceiverName,
);
messagesRouter.get(
  "/search/users/:name",
  verifyToken,
  verifyEmail,
  userController.getUserByName,
);

messagesRouter.post(
  "/messages/:id",
  verifyToken,
  verifyEmail,
  messageController.postMessage,
);
messagesRouter.get(
  "/messages/:id",
  verifyToken,
  verifyEmail,
  messageController.getConversation,
);
messagesRouter.get(
  "/conversations",
  verifyToken,
  verifyEmail,
  userController.getUserConversations,
);

messagesRouter.put("/message/:id", verifyToken, messageController.putMessage);
messagesRouter.delete(
  "/message/:id",
  verifyToken,
  verifyEmail,
  messageController.deleteMessage,
);

export default messagesRouter;
