const bcrypt = require("bcryptjs");
const db = require("../db/queries");
const jwt = require("jsonwebtoken");

async function getUserData(req, res) {
  const loggedUserId = req.userId;
  const requestedUserId = Number(req.params.id);
  try {
    if (loggedUserId !== requestedUserId) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const userData = await db.findUserById(requestedUserId);

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(userData);
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
    const userId = req.userId;
    const requestedId = Number(req.params.id);

    const { username, picture, bio } = req.body;

    const user = await db.findUserById(requestedId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (userId !== requestedId) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    await db.updateProfile(requestedId, username, picture, bio);
    res.status(200).json({ message: "Successfully updated profile" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
}

module.exports = {
  postRegister,
  postLogin,
  putProfileDetails,
  getUserData,
};
