const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  checkUser,
} = require("../controller/userController");
const jwt = require("jsonwebtoken");

// Auth middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ msg: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

router.post("/", createUser);
router.post("/login", loginUser);
router.get("/checkUser", authMiddleware, checkUser);

module.exports = router;
