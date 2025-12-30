const express = require("express");
const router = express.Router();

const {
  getAllQuestions,
  getSingleQuestion,
  postQuestion,
} = require("../controller/questionController");

// routes to GET /api/question, check User must be logged in, then calls getAllquestions
router.get("/", authMiddleware, getAllQuestions);

// GET single question
router.get("/:question_id", getSingleQuestion);

// POST a question (protected)
router.post("/post", postQuestion);


module.exports = router;
