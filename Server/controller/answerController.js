const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

//  GET ANSWERS
async function getAnswers(req, res) {
  const { question_id } = req.params;

  // Read page & limit from query
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  // Calculate offset
  const offset = (page - 1) * limit;

  // Get total count
  const [[{ total }]] = await dbConnection.query(
    `SELECT COUNT(*) AS total FROM answers WHERE question_id = ?`,
    [question_id],
  );

  // Get paginated answers
  const [answers] = await dbConnection.query(
    `
    SELECT 
      answers.answer_id,
      answers.answer,
      answers.user_id,
      users.username
    FROM answers
    INNER JOIN users
      ON answers.user_id = users.user_id
    WHERE answers.question_id = ?
    ORDER BY answers.answer_id DESC
    LIMIT ? OFFSET ?
    `,
    [question_id, limit, offset],
  );
  res.status(StatusCodes.OK).json({
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    answers,
  });
}

  // POST ANSWER
async function postAnswer(req, res) {
  const { question_id, answer } = req.body;
  const user_id = req.user.user_id; // from auth middleware

  // Validation
  if (!question_id || !answer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "question_id and answer are required" });
  }
  try {
    // Insert answer
    await dbConnection.query(
      `INSERT INTO answers (question_id, user_id, answer)
     VALUES (?, ?, ?)`,
      [question_id, user_id, answer]
    );

    // Success response
    return res.status(StatusCodes.CREATED).json({
      msg: "Answer posted successfully",
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server error" });
  }
}

// EDIT ANSWER
// PUT /api/answers/:answer_id
async function editAnswer(req, res) {
  const { answer_id } = req.params;
  const { answer } = req.body;
  const user_id = req.user.user_id;

  if (!answer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Answer is required" });
  }

  try {
    const [result] = await dbConnection.query(
      `UPDATE answers
       SET answer = ?
       WHERE answer_id = ? AND user_id = ?`,
      [answer, answer_id, user_id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ msg: "Not allowed to edit this answer" });
    }

    return res.status(StatusCodes.OK).json({
      msg: "Answer updated successfully",
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server error" });
  }
}

// DELETE ANSWER
// DELETE /api/answers/:answer_id
async function deleteAnswer(req, res) {
  const { answer_id } = req.params;
  const user_id = req.user.user_id;

  try {
    const [result] = await dbConnection.query(
      "DELETE FROM answers WHERE answer_id = ? AND user_id = ?",
      [answer_id, user_id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ msg: "Not allowed to delete this answer" });
    }

    res.status(StatusCodes.OK).json({
      msg: "Answer deleted successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
  }
}

module.exports = { getAnswers, postAnswer, editAnswer, deleteAnswer };
