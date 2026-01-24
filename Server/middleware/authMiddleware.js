const jwt = require("jsonwebtoken");
const dbConnection = require("../db/dbConfig");

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // Check header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Authorization denied" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    const { user_id, username } = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        user_id: user_id,
        username: username,
      };
      
      next();

  } catch (error) {
    return res.status(401).json({ msg: "Invalid token" });
  }
}

module.exports = authMiddleware;
