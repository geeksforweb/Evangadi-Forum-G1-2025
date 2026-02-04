import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SignIn.module.css";
import axiosBase from "../../axiosConfig";

const SignIn = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // New loading state
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    setError(""); // Clear previous errors
    setIsLoading(true); // Start loading

    try {
      const response = await axiosBase.post("/users/login", formData);
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid email or password");
    } finally {
      setIsLoading(false); // Stop loading regardless of success or failure
    }
  };

  return (
    <div className={styles.loginCard}>
      <h2 className={styles.title}>Login to your account</h2>

      <p className={styles.signupText}>
        Don&apos;t have an account?{" "}
        <span onClick={() => navigate("/register")}>Create a new account</span>
      </p>

      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading} // Disable input while loading
          />
        </div>

        <div className={styles.passwordGroup}>
          <input
            className={styles.input}
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading} // Disable input while loading
          />

          <span
            className={styles.eye}
            onClick={() => !isLoading && setShowPassword((prev) => !prev)}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <p
          className={styles.forgot}
          onClick={() => !isLoading && navigate("/forgot-password")}
        >
          Forgot password?
        </p>

        {/* Change button text and disable it during loading */}
        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
          {isLoading ? <div className={styles.spinner}></div> : "Login"}
        </button>
      </form>

      <p
        className={styles.create}
        onClick={() => !isLoading && navigate("/register")}
      >
        Create an account?
      </p>
    </div>
  );
};

export default SignIn;
