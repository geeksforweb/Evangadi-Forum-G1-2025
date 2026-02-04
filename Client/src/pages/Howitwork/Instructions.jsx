import React from "react";
import styles from "./Instructions.module.css";

const Instructions = () => {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>How to Use Evangadi Networks Q&amp;A</h2>

        <section>
          <h3>User Registration</h3>
          <p>
            To join Evangadi Networks Q&amp;A, you need to create an account.
            Follow these steps:
          </p>
          <ul>
            <li>Click on the "Log In" button in the top-right corner.</li>
            <li>Switch to the "Create a new account" form.</li>
            <li>
              Fill in the required fields: Username, First Name, Last Name,
              Email, and Password.
            </li>
            <li>Click on the "Agree and Join" button to register.</li>
            <li>
              You will receive a confirmation message upon successful
              registration.
            </li>
          </ul>
        </section>

        <section>
          <h3>User Login</h3>
          <p>Once you have registered, you can log in to your account:</p>
          <ul>
            <li>Click on the "Log In" button in the top-right corner.</li>
            <li>Enter your registered Email and Password.</li>
            <li>Click on the "Login" button to access your account.</li>
          </ul>
        </section>

        <section>
          <h3>Asking a Question</h3>
          <p>To ask a new question:</p>
          <ul>
            <li>
              After logging in, click on the "Ask Question" button on the Home
              page.
            </li>
            <li>
              Fill in the "Title" and "Description" fields with your question
              details.
            </li>
            <li>Click on the "Post Your Question" button to submit.</li>
            <li>
              Your question will appear on the Home page for the community to
              view and answer.
            </li>
          </ul>
        </section>

        <section>
          <h3>Viewing Questions and Answers</h3>
          <p>To browse and view questions and their answers:</p>
          <ul>
            <li>
              Navigate to the Home page to see a list of recent questions.
            </li>
            <li>
              Click on a question title to view its details and existing
              answers.
            </li>
            <li>
              If there are no answers, you will see a prompt encouraging you to
              answer.
            </li>
          </ul>
        </section>

        <section>
          <h3>Submitting an Answer</h3>
          <p>To answer a question:</p>
          <ul>
            <li>Navigate to the question you want to answer.</li>
            <li>Scroll down to the "Answer The Top Question" section.</li>
            <li>Type your answer in the provided textarea.</li>
            <li>Click on the "Post Your Answer" button to submit.</li>
            <li>
              Your answer will appear under the community answers section.
            </li>
          </ul>
        </section>

        <section>
          <h3>Logging Out</h3>
          <p>To securely log out of your account:</p>
          <ul>
            <li>
              Click on the "Logout" button located in the header/navigation bar.
            </li>
            <li>
              This will clear your session and redirect you to the login page.
            </li>
          </ul>
        </section>

        <section>
          <h3>Support and Feedback</h3>
          <p>Support and Feedback:</p>
          <ul>
            <li>Contact our support team through the "About" page.</li>
            <li>
              Provide feedback using the feedback form available in your
              profile.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
};

export default Instructions;
