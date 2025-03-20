import React from 'react';
import { Link } from 'react-router-dom';
import PostList from '../components/PostList';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="page-header">
        <h1>Blog Posts</h1>
        <Link to="/posts/new" className="btn-primary">
          Create New Post
        </Link>
      </div>
      <PostList />
    </div>
  );
};

export default HomePage;
