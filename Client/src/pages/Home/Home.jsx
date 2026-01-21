import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import { AppState } from "../../App";
import instance from "../../axiosConfig";
import avatar from "../../assets/avatar.png";

const Home = () => {
  const { user, questions, setQuestions } = useContext(AppState);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const LIMIT = 5;

  async function fetchQuestions(searchTerm = "", pageNumber = 1) {
    try {
      const { data } = await instance.get(
        `/questions?search=${searchTerm}&page=${pageNumber}&limit=${LIMIT}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setQuestions(data.questions);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  }

  useEffect(() => {
    fetchQuestions(search, page);
  }, [page]);

  function handleSearch(e) {
    const value = e.target.value;
    setSearch(value);
    setPage(1); // reset to first page
    fetchQuestions(value, 1);
  }

  return (
    <div className={styles["home-container"]}>
      <div className={styles.content}>
        <div className={styles["top-bar"]}>
          <button
            className={styles["ask-btn"]}
            onClick={() => navigate("/ask")}
          >
            Ask Question
          </button>

          <h3 className={styles.welcome}>
            Welcome: <span>{user?.username}</span>
          </h3>
        </div>

        {/* SEARCH INPUT */}
        <input
          type="text"
          placeholder="Search questions..."
          value={search}
          onChange={handleSearch}
          className={styles.search}
        />

        <h2 className={styles["questions-title"]}>Questions</h2>

        <div className={styles["question-list"]}>
          {questions.length > 0 ? (
            questions.map((q) => (
              <div
                key={q.question_id}
                className={styles["question-item"]}
                onClick={() => navigate(`/questions/${q.question_id}`)}
              >
                <img
                  src={avatar}
                  alt="avatar"
                  className={styles["avatar-img"]}
                />

                <div className={styles["question-text"]}>
                  <p>{q.title}</p>
                  <small>{q.username}</small>
                </div>

                <div className={styles.arrow}>›</div>
              </div>
            ))
          ) : (
            <p
              style={{ textAlign: "center", marginTop: "20px", color: "#555" }}
            >
              No results found.
            </p>
          )}
        </div>

        {/* PAGINATION CONTROLS */}
        <div className={styles.pagination}>
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
