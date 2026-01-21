const crypto = require("crypto");
const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

// 1. GET ALL QUESTIONS (with optional search)
async function getAllQuestions(req, res) {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    // Paginated questions
    const [questions] = await dbConnection.query(
      `
      SELECT 
        q.question_id,
        q.title,
        q.description,
        q.tags,
        q.user_id,
        u.username,
        COUNT(a.answer_id) AS answerCount
      FROM questions q
      INNER JOIN users u ON q.user_id = u.user_id
      LEFT JOIN answers a ON q.question_id = a.question_id
      WHERE q.title LIKE ? OR q.description LIKE ?
      GROUP BY q.question_id
      ORDER BY q.question_id DESC
      LIMIT ? OFFSET ?
      `,
      [`%${search}%`, `%${search}%`, limit, offset]
    );

    // Total count (used for pagination UI)
    const [[{ total }]] = await dbConnection.query(
      `
      SELECT COUNT(*) AS total
      FROM questions
      WHERE title LIKE ? OR description LIKE ?
      `,
      [`%${search}%`, `%${search}%`]
    );

    res.status(200).json({
      questions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}


// 2. GET SINGLE QUESTION
async function getSingleQuestion(req, res) {
  const { question_id } = req.params;

  try {
    const [[question]] = await dbConnection.query(
      `SELECT questions.*, users.username 
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
