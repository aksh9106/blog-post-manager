import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePostContext } from '../context/PostContext';
import './PostForm.css';

const PostForm = ({ post = null, isEditing = false }) => {
  const navigate = useNavigate();
  const { createPost, updatePost, error, clearError } = usePostContext();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  useEffect(() => {
    if (isEditing && post) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        author: post.author || ''
      });
    }
  }, [isEditing, post]);
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      errors.title = 'Title cannot be more than 100 characters';
    }
    
    if (!formData.content.trim()) {
      errors.content = 'Content is required';
    }
    
    if (!formData.author.trim()) {
      errors.author = 'Author is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear field error when typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
    
    // Clear API error when typing
    if (error) {
      clearError();
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isEditing) {
        await updatePost(post._id, formData);
        navigate(`/posts/${post._id}`);
      } else {
        const newPost = await createPost(formData);
        navigate(`/posts/${newPost._id}`);
      }
    } catch (err) {
      // Error is handled in context
    }
  };
  
  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <h2>{isEditing ? 'Edit Post' : 'Create New Post'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={formErrors.title ? 'error' : ''}
        />
        {formErrors.title && <div className="field-error">{formErrors.title}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="author">Author</label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          className={formErrors.author ? 'error' : ''}
        />
        {formErrors.author && <div className="field-error">{formErrors.author}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows="10"
          className={formErrors.content ? 'error' : ''}
        />
        {formErrors.content && <div className="field-error">{formErrors.content}</div>}
      </div>
      
      <div className="form-actions">
        <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {isEditing ? 'Update Post' : 'Create Post'}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
