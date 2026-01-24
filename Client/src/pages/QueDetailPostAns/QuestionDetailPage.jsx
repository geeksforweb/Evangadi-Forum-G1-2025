import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import instance from "../../axiosConfig";
import styles from "./QueDetailPostAns.module.css";  
import EditDelete from "./EditDelete";
import AnswerList from "./AnswerList";
import PostAnswerForm from "./PostAnswerForm";
import { AppState } from "../../App";

const QuestionDetailPage = () => {
  const { question_id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AppState);

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 5;

  // Auth
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, [navigate]);

  // Fetch single question
  useEffect(() => {
    instance.get(`/questions/${question_id}`).then((res) => {
      setQuestion(res.data.question);
    });
  }, [question_id]);

  // Reset page when question changes
  useEffect(() => {
    setPage(1);
  }, [question_id]);

  // Fetch answers (paginated)
  const fetchAnswers = async (pageNumber = page) => {
    const res = await instance.get(
      `/answers/${question_id}?page=${pageNumber}&limit=${LIMIT}`,
    );

    setAnswers(res.data.answers || []);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => {
    fetchAnswers(page);
  }, [question_id, page]);

  if (!question) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <EditDelete question={question} setQuestion={setQuestion} user={user} />

      <hr />
      <h2 className={styles.sectionTitle}>Answer From The Community</h2>
      <hr />
      <AnswerList
        answers={answers}
        refreshAnswers={() => fetchAnswers(page)}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />

      <PostAnswerForm
        question_id={question_id}
        refreshAnswers={() => fetchAnswers(page)}
      />
    </div>
  );
};;;

export default QuestionDetailPage;