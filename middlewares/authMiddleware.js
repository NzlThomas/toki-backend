import jwt from "jsonwebtoken";
import db from "../db/queries.js";

function verifyToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

async function verifyEmail(req, res, next) {
  try {
    const user = await db.findUserById(req.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.emailVerified) {
      return res.status(403).json({ error: "Email not verified" });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Server error",
    });
  }
}

function verifyUserAuthorization(req, res, next) {
  try {
    const userId = req.userId;
    const requestedId = Number(req.params.id);

    if (userId !== requestedId) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    next();
  } catch (error) {
    res.status(403).json({ error: "Authorization failed" });
  }
}

export default {
  verifyToken,
  verifyEmail,
  verifyUserAuthorization,
};
