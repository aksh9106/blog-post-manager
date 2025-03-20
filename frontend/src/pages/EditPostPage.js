import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { usePostContext } from '../context/PostContext';
import './EditPostPage.css';

const EditPostPage = () => {
  const { id } = useParams();
  const { currentPost, isLoading, error, fetchPost } = usePostContext();
  
  useEffect(() => {
    fetchPost(id);
  }, [id]);
  
  if (isLoading) {
    return <div className="loading">Loading post...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  if (!currentPost) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="edit-post-page">
      <PostForm post={currentPost} isEditing={true} />
    </div>
  );
};

export default EditPostPage;
