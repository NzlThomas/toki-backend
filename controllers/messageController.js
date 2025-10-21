const db = require("../db/queries");

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

    const newMessage = await db.sendMessage(senderId, receiverId, message);
    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    res.status(500).json({ error: "Couldn't send message" });
  }
}

module.exports = {
  postMessage,
};
