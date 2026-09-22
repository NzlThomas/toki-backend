import db from "../db/queries.js";
import { getIO } from "../sockets/socket.js";
import { updateUi, updateDeletedMessage } from "../sockets/socketHandler.js";

async function postMessage(req, res) {
  try {
    const senderId = req.userId;
    const receiverId = Number(req.params.id);
    const { message } = req.body;

    const receiver = await db.findUserById(receiverId);

    if (!receiver) {
      return res.status(404).json({ error: "User does not exist" });
    }

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const io = getIO();

    const newMessage = await db.sendMessage(senderId, receiverId, message);

    updateUi(io, receiverId, newMessage);

    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    res.status(500).json({ error: "Couldn't send message" });
  }
}

async function getConversation(req, res) {
  try {
    const connectedUser = req.userId;
    const receiverId = Number(req.params.id);

    const receiver = await db.findUserById(receiverId);

    if (!receiver) {
      return res.status(404).json({ error: "User does not exist" });
    }

    const conversation = await db.getConversation(connectedUser, receiverId);

    res.status(200).json({ conversation });
  } catch (error) {
    res.status(500).json({ error: "Couldn't fetch conversation" });
  }
}

async function putMessage(req, res) {
  try {
    const connectedUser = req.userId;
    const messageId = Number(req.params.id);

    const { newText } = req.body;

    const message = await db.findMessage(messageId);

    if (!message) {
      return res.status(404).json({ error: "Message does not exist" });
    }

    if (message.senderId !== connectedUser) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updatedMessage = await db.updateMessage(messageId, newText);
    res.status(200).json({ updatedMessage });
  } catch (error) {
    res.status(500).json({ error: "Couldn't update message" });
  }
}

async function deleteMessage(req, res) {
  try {
    const connectedUser = req.userId;
    const messageId = Number(req.params.id);

    const message = await db.findMessage(messageId);

    if (!message) {
      return res.status(404).json({ error: "Message does not exist" });
    }

    if (message.senderId !== connectedUser) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const deletedMessage = await db.deleteMessage(messageId);

    const io = getIO();

    updateDeletedMessage(io, message.receiverId, deletedMessage);
    res.status(200).json({ deletedMessage });
  } catch (error) {
    res.status(500).json({ error: "Couldn't delete message" });
  }
}

export default {
  postMessage,
  getConversation,
  putMessage,
  deleteMessage,
};
