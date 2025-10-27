const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    return res.status(401).json({ error: "Access denied" });
  }

  const token = bearerHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
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

module.exports = {
  verifyToken,
  verifyUserAuthorization,
};
