import { useState, useContext } from "react";
// ✅ Import BOTH avatars
import maleAvatar from "../../assets/avatar.png";
import femaleAvatar from "../../assets/female_avater.jpg";
import styles from "./QueDetailPostAns.module.css";
import instance from "../../axiosConfig";
import { AppState } from "../../App";

const AnswerList = ({ answers, refreshAnswers }) => {
  const { user } = useContext(AppState);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  if (answers.length === 0) {
    return <p className={styles.noAnswer}>No answers yet.</p>;
  }

  const handleEdit = (answer) => {
    setEditingId(answer.answer_id);
    setEditText(answer.answer);
  };

  const handleSave = async (answerId) => {
    if (!editText.trim()) {
      alert("Answer cannot be empty");
      return;
    }

    try {
      await instance.put(`/answers/${answerId}`, {
        answer: editText.trim(),
      });
      setEditingId(null);
      setEditText("");
      refreshAnswers();
      alert("Answer updated successfully");
    } catch (error) {
      console.error(error.response || error);
      alert(error.response?.data?.msg || "Failed to update answer");
    }
  };

  const handleDelete = async (answerId) => {
    if (!window.confirm("Delete this answer?")) return;

    try {
      await instance.delete(`/answers/${answerId}`);
      refreshAnswers();
      alert("Answer deleted successfully");
    } catch (error) {
      console.error(error.response || error);
      alert(error.response?.data?.msg || "Failed to delete answer");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditText("");
  };

  return answers.map((ans) => {
    const isOwner = user && user.userId === ans.user_id;
    const isEditing = editingId === ans.answer_id;

    // ✅ LOGIC TO CHOOSE THE CORRECT AVATAR FOR EACH ANSWER
    // ans.gender comes from the SQL JOIN we added to your backend
    const responderAvatar = ans.gender === "female" ? femaleAvatar : maleAvatar;

    return (
      <div className={styles.answerWrapper} key={ans.answer_id}>
        <div className={styles.answerLeft}>
          {/* ✅ Use the calculated responderAvatar here */}
          <img src={responderAvatar} className={styles.avatar} alt="avatar" />
          <p className={styles.username}>{ans.username}</p>
        </div>
        <div className={styles.answerRight}>
          {isEditing ? (
            <div className={styles.editBox}>
              <textarea
                className={styles.editTextarea}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <div className={styles.actionRow}>
                <button onClick={() => handleSave(ans.answer_id)}>Save</button>
                <button onClick={handleCancel}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <p className={styles.answerText}>{ans.answer}</p>
              {isOwner && (
                <div className={styles.actionRow}>
                  <button onClick={() => handleEdit(ans)}>Edit</button>
                  <button onClick={() => handleDelete(ans.answer_id)}>Delete</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  });
};

export default AnswerList;