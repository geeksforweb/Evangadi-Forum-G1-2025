const crypto = require("crypto");
const dbConnection = require("../db/dbConfig");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const sendEmail = require("../utils/email");

/**
 * REGISTER USER
 */
async function createUser(req, res) {
  const { userName, firstName, lastName, email, password, gender } = req.body;

  if (!userName || !firstName || !lastName || !email || !password || !gender) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "All fields required" });
  }

  if (!["male", "female"].includes(gender)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Invalid gender value" });
  }

  if (password.length < 8) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Password must be 8+ chars" });
  }

  const [[existingUser]] = await dbConnection.query(
    "SELECT user_id FROM users WHERE email = ?",
    [email]
  );

  if (existingUser) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await dbConnection.query(
    `INSERT INTO users 
     (username, first_name, last_name, email, password, gender)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userName, firstName, lastName, email, hashedPassword, gender]
  );

  res.status(StatusCodes.CREATED).json({
    msg: "User registered successfully",
  });
}

/**
 * LOGIN USER
 */
async function login(req, res) {
  const { email, password } = req.body;

  const [[user]] = await dbConnection.query(
    "SELECT user_id, username, password, gender FROM users WHERE email = ?",
    [email]
  );

  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      user_id: user.user_id,
      username: user.username,
      gender: user.gender, // ✅ included in token
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.status(StatusCodes.OK).json({
    msg: "Login successful",
    token,
    userId: user.user_id,
    username: user.username,
    gender: user.gender, // ✅ frontend needs this
  });
}

/**
 * FORGOT PASSWORD
 */
async function forgotPassword(req, res) {
  const { email } = req.body;

  if (!email) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide an email" });
  }

  try {
    const [rows] = await dbConnection.execute(
      "SELECT user_id, username FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Email not found" });
    }

    const user = rows[0];

    const token = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    await dbConnection.execute(
      "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
      [token, resetTokenExpiry, email]
    );

    const frontendUrl =
      process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendUrl}/reset-password/${token}`;

    const emailSent = await sendEmail(
      email,
      "Password Reset Request",
      `Hello ${user.username},

Click the link below to reset your password (valid for 1 hour):

${resetLink}

If you did not request this, please ignore this email.`
    );

    if (!emailSent) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "Failed to send email. Try again later." });
    }

    res
      .status(StatusCodes.OK)
      .json({ msg: "Password reset link sent to your email" });
  } catch (error) {
    console.error("❌ forgotPassword error:", error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong" });
  }
}

/**
 * RESET PASSWORD
 */
async function resetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 8) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Password must be at least 8 characters long" });
  }

  try {
    const [rows] = await dbConnection.query(
      "SELECT user_id FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()",
      [token]
    );

    if (rows.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await dbConnection.query(
      `UPDATE users
       SET password = ?, reset_token = NULL, reset_token_expiry = NULL
       WHERE reset_token = ?`,
      [hashedPassword, token]
    );

    res.status(StatusCodes.OK).json({ msg: "Password reset successful" });
  } catch (error) {
    console.error("❌ resetPassword error:", error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong" });
  }
}

/**
 * CHECK USER
 */
async function checkUser(req, res) {
  const { user_id, username, gender } = req.user;

  res.status(StatusCodes.OK).json({
    msg: "Congratulations! you are a valid user",
    userId: user_id,
    username,
    gender,
  });
}

module.exports = {
  createUser,
  login,
  forgotPassword,
  resetPassword,
  checkUser,
};
