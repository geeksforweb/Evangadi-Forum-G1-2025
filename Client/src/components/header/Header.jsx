import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/evangadi-logo.jpeg';
import classes from './Header.module.css'; 

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Retrieve token to check if user is logged in
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsMenuOpen(false);
    navigate('/login');
    window.location.reload();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={classes.header_container}>
      <div className={classes.header_inner}>
        {/* Logo Link */}
        <Link to="/" className={classes.header_logo} onClick={closeMenu}>
          <img src={logo} alt="Evangadi Logo" />
        </Link>

        {/* Desktop Navigation Links */}
        <div className={classes.header_links}>
          <Link to="/" className={classes.nav_link}>Home</Link>
          <Link to="/Instruction" className={classes.nav_link}>How it works</Link>
          {/* <Link to="/how-it-works" className={classes.nav_link}>How it works</Link> */}
          
          {token ? (
            <button className={classes.header_button} onClick={handleLogout}>
              Log Out
            </button>
          ) : (
            <Link to="/login" className={classes.header_button_link}>
              <button className={classes.header_button}>Log In</button>
            </Link>
          )}
        </div>

        {/* Hamburger Menu Icon */}
        <div 
          className={`${classes.hamburger} ${isMenuOpen ? classes.open : ''}`} 
          onClick={toggleMenu}
        >
          <span className={classes.hamburger_line}></span>
          <span className={classes.hamburger_line}></span>
          <span className={classes.hamburger_line}></span>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`${classes.mobile_nav} ${isMenuOpen ? classes.open : ''}`}>
          <Link to="/" className={classes.mobile_nav_link} onClick={closeMenu}>
            Home
          </Link>
            <Link to="#" className={classes.mobile_nav_link} onClick={closeMenu}>
            How it works
          </Link>
          {/* <Link to="/how-it-works" className={classes.mobile_nav_link} onClick={closeMenu}>
            How it works
          </Link> */}
          
          {token ? (
            <button 
              className={`${classes.header_button} ${classes.mobile_nav_button}`} 
              onClick={handleLogout}
            >
              Log Out
            </button>
          ) : (
            <Link to="/login" className={classes.header_button_link} onClick={closeMenu}>
              <button className={`${classes.header_button} ${classes.mobile_nav_button}`}>
                Log In
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;