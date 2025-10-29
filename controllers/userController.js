const bcrypt = require("bcryptjs");
const db = require("../db/queries");
const jwt = require("jsonwebtoken");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs/promises");

async function getUserData(req, res) {
  const requestedUserId = Number(req.params.id);
  try {
    const userData = await db.findUserById(requestedUserId);

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ error: "Failed to get user data" });
  }
}

async function getReceiverName(req, res) {
  const receiverId = Number(req.params.id);
  try {
    const receiverInfos = await db.findReceiverById(receiverId);
    res.status(200).json(receiverInfos);
  } catch (error) {
    res.status(500).json({ error: "Failed to get user data" });
  }
}

async function getUserByName(req, res) {
  const searchedName = req.params.name;
  try {
    const searchResult = await db.findUserByName(searchedName);
    res.status(200).json(searchResult);
  } catch (error) {
    res.status(500).json({ error: "Failed to get user data" });
  }
}

async function postRegister(req, res) {
  try {
    const { username, email, password, bio, picture } = req.body;
    const existingUser = await db.findUserByEmail(email);

    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.createUser(username, email, hashedPassword, bio, picture);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
}

async function postLogin(req, res) {
  try {
    const { email, password } = req.body;
    const user = await db.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        picture: user.picture,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Authentication failed" });
  }
}

async function putProfileDetails(req, res) {
  try {
    const requestedId = Number(req.params.id);

    const { username, picture, bio } = req.body;

    const user = await db.findUserById(requestedId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedInfos = await db.updateProfile(
      requestedId,
      username,
      picture,
      bio
    );
    res.status(200).json({ updatedInfos });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
}

async function updateProfilePicture(req, res) {
  try {
    const userId = req.userId;
    const requestedId = Number(req.params.id);

    const user = await db.findUserById(requestedId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!req.file) return res.status(400).json({ error: "Aucun fichier reçu" });

    const outputDir = path.resolve("uploads");
    const resizedFilename = `user-${userId}-${Date.now()}.webp`;
    const outputPath = path.join(outputDir, resizedFilename);

    const originalImageBuffer = await fs.readFile(req.file.path);

    const processedImage = await sharp(originalImageBuffer)
      .resize(400, 400, { fit: "cover" })
      .toFormat("webp", { quality: 85 })
      .toBuffer();

    await fs.writeFile(outputPath, processedImage);

    try {
      await fs.unlink(req.file.path);
    } catch (err) {
      console.warn(
        "Impossible de supprimer le fichier original :",
        err.message
      );
    }

    const pathString = `/uploads/${resizedFilename}`;
    const updatedUser = await db.uploadProfilePicture(userId, pathString);

    res.json({ message: "Photo mise à jour", updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

async function getUserConversations(req, res) {
  try {
    const userId = req.userId;

    const messages = await db.getUserConversations(userId);

    const uniqueUsers = new Map();
    for (const msg of messages) {
      if (msg.sender.id !== userId) uniqueUsers.set(msg.sender.id, msg.sender);
      if (msg.receiver.id !== userId)
        uniqueUsers.set(msg.receiver.id, msg.receiver);
    }

    const userConversations = [...uniqueUsers.values()];

    res.status(200).json(userConversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

module.exports = {
  postRegister,
  postLogin,
  putProfileDetails,
  getUserData,
  getReceiverName,
  getUserByName,
  updateProfilePicture,
  getUserConversations,
};
