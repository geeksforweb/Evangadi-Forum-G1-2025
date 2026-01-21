import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import { AppState } from "../../App";
import instance from "../../axiosConfig";

// avatars
import maleAvatar from "../../assets/avatar.png";
import femaleAvatar from "../../assets/female_avater.jpg";

const Home = () => {
  const { user, questions, setQuestions } = useContext(AppState);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  
  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(4); // 4 questions per page as requested

  async function fetchQuestions(searchTerm = "") {
    try {
      const { data } = await instance.get(
        `/questions?search=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setQuestions(data.questions || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  // --- Pagination Logic ---
  const totalQuestions = questions.length;
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);
  
  // Safety check: if current page is greater than total pages after a search
  const activePage = currentPage > totalPages ? 1 : currentPage;

  const indexOfLastQuestion = activePage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles["home-container"]}>
      <div className={styles.content}>
        <div className={styles["top-bar"]}>
          <button className={styles["ask-btn"]} onClick={() => navigate("/ask")}>
            Ask Question
          </button>
          <h3 className={styles.welcome}>
            Welcome: <span>{user?.username}</span>
          </h3>
        </div>

        <input
          type="text"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            fetchQuestions(e.target.value);
            setCurrentPage(1); 
          }}
          className={styles.search}
        />

        <h2 className={styles["questions-title"]}>Questions</h2>

        <div className={styles["question-list"]}>
          {currentQuestions.length > 0 ? (
            currentQuestions.map((q) => {
              const authorAvatar = q.gender === "female" ? femaleAvatar : maleAvatar;
              return (
                <div
                  key={q.question_id}
                  className={styles["question-item"]}
                  onClick={() => navigate(`/questions/${q.question_id}`)}
                >
                  <img src={authorAvatar} alt="avatar" className={styles["avatar-img"]} />
                  <div className={styles["question-text"]}>
                    <p>{q.title}</p>
                    <small>{q.username}</small>
                  </div>
                  <div className={styles.arrow}>›</div>
                </div>
              );
            })
          ) : (
            <p className={styles.noResults}>No results found.</p>
          )}
        </div>

        {/* --- PAGINATION NUMBERS (Always rendered for testing) --- */}
        <div className={styles.pagination}>
          <button 
            onClick={() => handlePageChange(activePage - 1)} 
            disabled={activePage === 1}
            className={styles.pArrow}
          >
            «
          </button>
          
          {/* If you have 0 questions, it shows page 1 by default */}
          {totalPages <= 1 ? (
            <button className={`${styles.pNumber} ${styles.pActive}`}>1</button>
          ) : (
            [...Array(totalPages).keys()].map((num) => (
              <button 
                key={num + 1} 
                onClick={() => handlePageChange(num + 1)}
                className={`${styles.pNumber} ${activePage === num + 1 ? styles.pActive : ""}`}
              >
                {num + 1}
              </button>
            ))
          )}

          <button 
            onClick={() => handlePageChange(activePage + 1)} 
            disabled={activePage === totalPages || totalPages === 0}
            className={styles.pArrow}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;