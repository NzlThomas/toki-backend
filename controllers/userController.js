const bcrypt = require("bcryptjs");
const db = require("../db/queries");

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

module.exports = {
  postRegister,
};
