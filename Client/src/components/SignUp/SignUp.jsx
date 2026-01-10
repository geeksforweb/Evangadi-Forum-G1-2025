import instance from "../../axiosConfig";
import React, { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Classes from "./SignUp.module.css";

const Register = () => {
  const navigate = useNavigate();

  const userNameDom = useRef();
  const firstNameDom = useRef();
  const lastNameDom = useRef();
  const emailDom = useRef();
  const passwordDom = useRef();

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const errors = {};

    const username = userNameDom.current.value.trim();
    const firstname = firstNameDom.current.value.trim();
    const lastname = lastNameDom.current.value.trim();
    const email = emailDom.current.value.trim();
    const password = passwordDom.current.value;

    if (!username) errors.username = "Username is required";
    else if (username.length < 3)
      errors.username = "Username must be at least 3 characters";

    if (!firstname) errors.firstname = "First name is required";
    else if (!/^[A-Za-z]+$/.test(firstname))
      errors.firstname = "First name must contain only letters";

    if (!lastname) errors.lastname = "Last name is required";
    else if (!/^[A-Za-z]+$/.test(lastname))
      errors.lastname = "Last name must contain only letters";

    if (!email) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Please enter a valid email address";

    if (!password) errors.password = "Password is required";
    else if (password.length < 6)
      errors.password = "Password must be at least 6 characters";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await instance.post("/users/register", {
        userName: userNameDom.current.value,
        firstName: firstNameDom.current.value,
        lastName: lastNameDom.current.value,
        email: emailDom.current.value,
        password: passwordDom.current.value,
      });
      navigate("/login");
    } catch (error) {
      setErrors({
        server: error.response?.data?.msg || "Registration failed",
      });
    }
  };

  return (
    <section className={Classes.registerSection}>
      <h2>Join the network</h2>
      <p className={Classes.signInPrompt}>
        Already have an account?{" "}
        <Link to="/login" className={Classes.signInLink}>
          Sign in
        </Link>
      </p>

      {errors.server && <p className={Classes.serverError}>{errors.server}</p>}

      <form className={Classes.registerForm} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          ref={userNameDom}
          className={errors.username ? Classes.inputError : ""}
        />
        {errors.username && (
          <small className={Classes.error}>{errors.username}</small>
        )}

        <div className={Classes.nameRow}>
          <input
            type="text"
            placeholder="First name"
            ref={firstNameDom}
            className={errors.firstname ? Classes.inputError : ""}
          />
          <input
            type="text"
            placeholder="Last name"
            ref={lastNameDom}
            className={errors.lastname ? Classes.inputError : ""}
          />
        </div>
        {errors.firstname && (
          <small className={Classes.error}>{errors.firstname}</small>
        )}
        {errors.lastname && (
          <small className={Classes.error}>{errors.lastname}</small>
        )}

        <input
          type="email"
          placeholder="Email address"
          ref={emailDom}
          className={errors.email ? Classes.inputError : ""}
        />
        {errors.email && (
          <small className={Classes.error}>{errors.email}</small>
        )}

        <div className={Classes.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            ref={passwordDom}
            className={errors.password ? Classes.inputError : ""}
          />
          <span
            className={Classes.togglePassword}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>
        {errors.password && (
          <small className={Classes.error}>{errors.password}</small>
        )}

        <p className={Classes.agreement}>
          I agree to the{" "}
          <a href="/privacy-policy" target="_blank">
            privacy policy
          </a>{" "}
          and{" "}
          <a href="/terms-of-service" target="_blank">
            terms of service
          </a>
          .
        </p>

        <button type="submit" className={Classes.submitBtn}>
          Agree and Join
        </button>
      </form>

      <p className={Classes.loginText}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </section>
  );
};

export default Register;
