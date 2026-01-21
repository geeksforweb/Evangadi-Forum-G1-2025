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

    try {
      const response = await axiosBase.post("/users/login", formData);
      localStorage.setItem("token", response.data.token);
      setError("");
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
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
          />

          <span
            className={styles.eye}
            onClick={() => setShowPassword((prev) => !prev)}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>
        {/* forgot password */}
        <p
          className={styles.forgot}
          onClick={() => navigate("/forgot-password")}
        >
          Forgot password?
        </p>

        <button type="submit" className={styles.submitBtn}>
          Login
        </button>
      </form>

      <p className={styles.create} onClick={() => navigate("/register")}>
        Create an account?
      </p>
    </div>
  );
};

export default SignIn;
