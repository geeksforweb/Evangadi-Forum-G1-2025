import React from "react";
import SignUp from "../../components/SignUp/SignUp";
import About from "../../components/About/About";
import styles from "./Register.module.css";

const Register = () => {
  return (
    <main className={styles.registerPage}>
      <div className={styles.registerContent}>
        {/* The section containing your large SignUp card */}
        <div className={styles.signUpSection}>
          <SignUp />
        </div>

        {/* The About Section mirroring the Login page */}
        <div className={styles.aboutWrapper}>
          <div className={styles.bgShape}></div>
          <div className={styles.aboutContent}>
            <About />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;
