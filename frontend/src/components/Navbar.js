import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          Blog Post Manager
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/posts/new" className="nav-link">
            Create Post
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
