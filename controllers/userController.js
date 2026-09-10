import cloudinary from "../lib/cloudinary.js";
import bcrypt from "bcryptjs";
import db from "../db/queries.js";
import jwt from "jsonwebtoken";
import sharp from "sharp";
import path from "path";
import fs from "node:fs/promises";

async function getProfile(req, res) {
  try {
    const userId = req.userId;

    const user = await db.findUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user infos" });
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
    const { username, email, password, confirmPassword, bio, picture } =
      req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

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

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 24 * 60 * 60 * 1000,
};

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
      expiresIn: "24h",
    });

    res
      .cookie("token", token, cookieOptions)
      .status(200)
      .json({
        token,
        user: {
          id: user.id,
          username: user.username,
          bio: user.bio,
          picture: user.picture,
        },
      });
  } catch (error) {
    res.status(500).json({ error: "Authentication failed" });
  }
}

async function postLogout(req, res) {
  try {
    res
      .clearCookie("token", cookieOptions)
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Logout failed" });
  }
}

async function putProfileDetails(req, res) {
  try {
    const requestedId = Number(req.params.id);

    const { username, bio } = req.body;

    const user = await db.findUserById(requestedId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedInfos = await db.updateProfile(requestedId, username, bio);
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

    if (user.picturePublicId) {
      try {
        await cloudinary.uploader.destroy(user.picturePublicId);
      } catch (err) {
        console.warn("Impossible de supprimer l'ancienne photo :", err.message);
      }
    }

    const originalImageBuffer = await fs.readFile(req.file.path);

    const processedImage = await sharp(originalImageBuffer)
      .resize(400, 400, { fit: "cover" })
      .toFormat("webp", { quality: 85 })
      .toBuffer();

    const uploadResult = await cloudinary.uploader.upload(
      `data:image/webp;base64,${processedImage.toString("base64")}`,
      {
        folder: "profile-pictures",
        public_id: `user-${userId}`,
        overwrite: true,
        resource_type: "image",
      },
    );

    try {
      await fs.unlink(req.file.path);
    } catch (err) {
      console.warn(
        "Impossible de supprimer le fichier original :",
        err.message,
      );
    }

    const updatedUser = await db.uploadProfilePicture(
      userId,
      uploadResult.secure_url,
      uploadResult.public_id,
    );

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

export default {
  postRegister,
  postLogin,
  postLogout,
  putProfileDetails,
  getProfile,
  getReceiverName,
  getUserByName,
  updateProfilePicture,
  getUserConversations,
};
