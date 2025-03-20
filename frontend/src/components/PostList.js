import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePostContext } from '../context/PostContext';
import './PostList.css';

const PostList = () => {
  const { posts, isLoading, error, fetchPosts } = usePostContext();
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  if (isLoading) {
    return <div className="loading">Loading posts...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <h2>No posts found</h2>
        <p>Be the first to create a post!</p>
        <Link to="/posts/new" className="btn-primary">Create Post</Link>
      </div>
    );
  }
  
  return (
    <div className="post-list">
      {posts.map((post) => (
        <div key={post._id} className="post-card">
          <h2 className="post-title">{post.title}</h2>
          <p className="post-meta">
            By {post.author} on {new Date(post.createdAt).toLocaleDateString()}
          </p>
          <p className="post-excerpt">
            {post.content.substring(0, 150)}
            {post.content.length > 150 ? '...' : ''}
          </p>
          <div className="post-actions">
            <Link to={`/posts/${post._id}`} className="btn-secondary">
              Read More
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
