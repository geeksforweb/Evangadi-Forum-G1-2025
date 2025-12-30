const express = require("express");
const router = express.Router();

// User controllers
const { createUser, loginUser } = require("../controller/userController");

/**
 * POST /api/users
 * Register new user
 */
router.post("/", createUser);

/**
 * POST /api/users/login
 * Login user (placeholder)
 */
router.post("/login", loginUser);

module.exports = router;
