import React from "react";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import logofooter from "../../assets/footer-logo.png";
import classes from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={classes.footer}>
      {/* Column 1: Logo and Socials */}
      <div className={`${classes.footer_col} ${classes.logo_col}`}>
        <img
          src={logofooter}
          alt="evangadi logo"
          className={classes.logo_img}
        />
        <div className={classes.socials}>
          <a
            href="https://www.facebook.com/evangaditech"
            target="_blank"
            rel="noreferrer"
          >
            <FacebookOutlinedIcon />
          </a>
          <a
            href="https://www.instagram.com/evangaditech/"
            target="_blank"
            rel="noreferrer"
          >
            <InstagramIcon />
          </a>
          <a
            href="https://www.youtube.com/@EvangadiTech"
            target="_blank"
            rel="noreferrer"
          >
            <YouTubeIcon />
          </a>
        </div>
      </div>

      {/* Column 2: Links */}
      <div className={classes.footer_col}>
        <h4>Useful Link</h4>
        <p>How it works</p>
        <p>Terms of Service</p>
        <p>Privacy policy</p>
      </div>

      {/* Column 3: Contact */}
      <div className={classes.footer_col}>
        <h4>Contact Info</h4>
        <p>Evangadi Networks</p>
        <p>support@evangadi.com</p>
        <p>+1-202-386-2702</p>
      </div>
    </footer>
  );
};

export default Footer;
