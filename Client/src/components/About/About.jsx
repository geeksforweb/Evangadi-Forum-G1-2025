import React from "react";
import Classes from "./About.module.css";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <section className={Classes.about_container}>
      <h5 className={Classes.about_subtitle}>About</h5>
      <h1 className={Classes.about_title}>Evangadi Networks</h1>

      <div className={Classes.about_content}>
        <p>
          No matter what stage of life you are in, whether you’re just starting
          elementary school or being promoted to CEO of a Fortune 500 company,
          you have much to offer to those who are trying to follow in your
          footsteps.
        </p>
        <p>
          Whether you are willing to share your knowledge or you are just
          looking to meet mentors of your own, please start by joining the
          network here.
        </p>
      </div>
      <Link to="/Instruction">
        <button className={Classes.about_button}>HOW IT WORKS</button>
      </Link>
    </section>
  );
};

export default About;