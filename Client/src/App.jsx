import { createContext, useState, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import instance from "./axiosConfig";
import Header from "./components/Header/Header";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import AskQuestion from "./pages/AskQuestion/AskQuestion";
import Footer from "./components/footer/Footer";
import QuestionDetailPage from './pages/QueDetailPostAns/QuestionDetailPage'
import ForgotPassword from './pages/Forgotpassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import Instructions from './pages/Howitwork/Instructions';
import "./app.css"
/* EXPORT THE CONTEXT */
export const AppState = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  // Check logged-in user using token
  const checkUser = async () => {
    const token = localStorage.getItem("token");

    // STOP if no token
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const { data } = await instance.get("/users/check");
      setUser(data);
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

  useEffect(() => {
    if (!publicRoutes.includes(location.pathname)) {
      checkUser();
    }
  }, [location.pathname]);


  // Fetch all questions
  const fetchQuestions = async () => {
    try {
      const { data } = await instance.get("/questions");
      setQuestions(data.questions); // latest first
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !publicRoutes.includes(location.pathname)) {
      fetchQuestions();
    }
  }, [location.pathname, user]);

  return (
    <AppState.Provider value={{ user, setUser, questions, setQuestions, fetchQuestions }}>
      <Header />

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Instruction" element={<Instructions />} /> 

        {/* prtected routes */}
        <Route
          path="/ask"
          element={
            <ProtectedRoute>
              <AskQuestion />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
          
        <Route
          path="/questions/:question_id"
          element={
            <ProtectedRoute>
              <QuestionDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
      <Footer />
    </AppState.Provider>
  );
}

export default App;
