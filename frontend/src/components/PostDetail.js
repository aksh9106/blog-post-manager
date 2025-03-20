import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePostContext } from '../context/PostContext';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    currentPost, 
    isLoading, 
    error, 
    fetchPost, 
    deletePost 
  } = usePostContext();
  
  useEffect(() => {
    fetchPost(id);
  }, [id]);
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(id);
        navigate('/');
      } catch (err) {
        // Error is handled in context
      }
    }
  };
  
  if (isLoading) {
    return <div className="loading">Loading post...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  if (!currentPost) {
    return <div className="not-found">Post not found</div>;
  }
  
  return (
    <div className="post-detail">
      <h1 className="post-title">{currentPost.title}</h1>
      
      <div className="post-meta">
        <p>
          By <span className="author">{currentPost.author}</span>
        </p>
        <p>
          Created: {new Date(currentPost.createdAt).toLocaleDateString()}
        </p>
        {currentPost.updatedAt !== currentPost.createdAt && (
          <p>
            Updated: {new Date(currentPost.updatedAt).toLocaleDateString()}
          </p>
        )}
      </div>
      
      <div className="post-content">
        {currentPost.content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      
      <div className="post-actions">
        <Link to="/" className="btn-secondary">
          Back to Posts
        </Link>
        <Link to={`/posts/${id}/edit`} className="btn-primary">
          Edit Post
        </Link>
        <button onClick={handleDelete} className="btn-danger">
          Delete Post
        </button>
      </div>
    </div>
  );
};

export default PostDetail;
