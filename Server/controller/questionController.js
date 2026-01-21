const crypto = require("crypto");
const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

// 1. GET ALL QUESTIONS (with optional search)
async function getAllQuestions(req, res) {
  const { search } = req.query;

  let query = `
    SELECT 
      questions.question_id,
      questions.title,
      questions.description,
      questions.tags,
      questions.user_id,
      users.username,
      users.gender, 
      COUNT(answers.answer_id) AS answerCount
    FROM questions
    INNER JOIN users 
      ON questions.user_id = users.user_id
    LEFT JOIN answers 
      ON questions.question_id = answers.question_id
  `;

  let values = [];

  if (search) {
    query += `
      WHERE questions.title LIKE ? 
      OR questions.description LIKE ?
    `;
    values.push(`%${search}%`, `%${search}%`);
  }

  query += `
    GROUP BY questions.question_id
    ORDER BY questions.question_id DESC
  `;

  try {
    const [questions] = await dbConnection.query(query, values);
    res.status(StatusCodes.OK).json({
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
  }
}

// 2. GET SINGLE QUESTION
async function getSingleQuestion(req, res) {
  const { question_id } = req.params;

  try {
    const [[question]] = await dbConnection.query(
      `SELECT questions.*, users.username, users.gender 
       FROM questions 
       INNER JOIN users ON questions.user_id = users.user_id 
       WHERE questions.question_id = ?`,
      [question_id]
    );

    if (!question) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Question not found" });
    }

    res.status(StatusCodes.OK).json({ question });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
  }
}

// 3. POST QUESTION (with tags)
async function postQuestion(req, res) {
  const { title, description, tags } = req.body;
  const user_id = req.user.user_id;

  if (!title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Title and description are required" });
  }

  try {
    await dbConnection.query(
      `INSERT INTO questions (user_id, title, description, tags) VALUES (?, ?, ?, ?)`,
      [user_id, title, description, tags]
    );

    res
      .status(StatusCodes.CREATED)
      .json({ msg: "Question created successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
  }
}

// 4. EDIT QUESTION (with tags)
async function editQuestion(req, res) {
  const { question_id } = req.params;
  const { title, description, tags } = req.body;
  const user_id = req.user.user_id;

  if (!title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Title and description are required" });
  }

  try {
    const [result] = await dbConnection.query(
      `UPDATE questions SET title = ?, description = ?, tags = ? WHERE question_id = ? AND user_id = ?`,
      [title, description, tags, question_id, user_id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ msg: "Not allowed to edit this question" });
    }

    res.status(StatusCodes.OK).json({ msg: "Question updated successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
  }
}

// 5. DELETE QUESTION
async function deleteQuestion(req, res) {
  const { question_id } = req.params;
  const user_id = req.user.user_id;

  try {
    // Delete answers first if they exist
    await dbConnection.query("DELETE FROM answers WHERE question_id = ?", [
      question_id,
    ]);

    const [result] = await dbConnection.query(
      "DELETE FROM questions WHERE question_id = ? AND user_id = ?",
      [question_id, user_id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ msg: "Not allowed to delete this question" });
    }

    res.status(StatusCodes.OK).json({ msg: "Question deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
  }
}

module.exports = {
  getAllQuestions,
  getSingleQuestion,
  postQuestion,
  editQuestion,
  deleteQuestion,
};