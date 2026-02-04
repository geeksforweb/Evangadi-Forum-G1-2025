import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import instance from "../../axiosConfig";
import styles from "./ResetPassword.module.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validation
    if (!password) {
      setError("Please enter a new password");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await instance.post(`/users/reset-password/${token}`, {
        password,
      });

      setMessage(response.data.msg || "Password reset successful");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.msg || "Invalid or expired token. Please request a new reset link.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.mainContent}>
      <div className={styles.loginCard}>
        <h2 className={styles.title}>Reset Password</h2>

        <p className={styles.description}>Enter your new password below.</p>

        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.success}>{message}</p>}

        <form onSubmit={handleSubmit}>
          <div className={styles.passwordGroup}>
            <input
              className={styles.input}
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <span
              className={styles.eye}
              onClick={() => setShowPassword((prev) => !prev)}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <div className={styles.passwordGroup}>
            <input
              className={styles.input}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
            <span
              className={styles.eye}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              title={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <div className={styles.passwordRequirements}>
            <ul>
              <li>Password must be at least 8 characters long</li>
            </ul>
          </div>

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className={styles.backToLogin} onClick={() => navigate("/login")}>
          Back to Login
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
