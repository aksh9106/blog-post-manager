import React, { createContext, useContext, useReducer } from 'react';
import axios from 'axios';

const PostContext = createContext();
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

const initialState = {
  posts: [],
  isLoading: false,
  error: null,
  currentPost: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_POSTS_BEGIN':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_POSTS_SUCCESS':
      return { ...state, isLoading: false, posts: action.payload };
    case 'FETCH_POSTS_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'FETCH_POST_BEGIN':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_POST_SUCCESS':
      return { ...state, isLoading: false, currentPost: action.payload };
    case 'FETCH_POST_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'CREATE_POST_BEGIN':
      return { ...state, isLoading: true, error: null };
    case 'CREATE_POST_SUCCESS':
      return { 
        ...state, 
        isLoading: false, 
        posts: [action.payload, ...state.posts] 
      };
    case 'CREATE_POST_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'UPDATE_POST_BEGIN':
      return { ...state, isLoading: true, error: null };
    case 'UPDATE_POST_SUCCESS':
      return { 
        ...state, 
        isLoading: false, 
        posts: state.posts.map(post => 
          post._id === action.payload._id ? action.payload : post
        ),
        currentPost: action.payload
      };
    case 'UPDATE_POST_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'DELETE_POST_BEGIN':
      return { ...state, isLoading: true, error: null };
    case 'DELETE_POST_SUCCESS':
      return { 
        ...state, 
        isLoading: false, 
        posts: state.posts.filter(post => post._id !== action.payload)
      };
    case 'DELETE_POST_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const PostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Get all posts
  const fetchPosts = async () => {
    dispatch({ type: 'FETCH_POSTS_BEGIN' });
    try {
      const response = await axios.get(`${API_URL}/posts`);
      dispatch({ 
        type: 'FETCH_POSTS_SUCCESS', 
        payload: response.data.posts 
      });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_POSTS_ERROR', 
        payload: error.response?.data?.msg || 'Something went wrong' 
      });
    }
  };

  // Get a single post
  const fetchPost = async (id) => {
    dispatch({ type: 'FETCH_POST_BEGIN' });
    try {
      const response = await axios.get(`${API_URL}/posts/${id}`);
      dispatch({ 
        type: 'FETCH_POST_SUCCESS', 
        payload: response.data.post 
      });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_POST_ERROR', 
        payload: error.response?.data?.msg || 'Something went wrong' 
      });
    }
  };

  // Create a post
  const createPost = async (postData) => {
    dispatch({ type: 'CREATE_POST_BEGIN' });
    try {
      const response = await axios.post(`${API_URL}/posts`, postData);
      dispatch({ 
        type: 'CREATE_POST_SUCCESS', 
        payload: response.data.post 
      });
      return response.data.post;
    } catch (error) {
      dispatch({ 
        type: 'CREATE_POST_ERROR', 
        payload: error.response?.data?.msg || 'Something went wrong' 
      });
      throw error;
    }
  };

  // Update a post
  const updatePost = async (id, postData) => {
    dispatch({ type: 'UPDATE_POST_BEGIN' });
    try {
      const response = await axios.patch(`${API_URL}/posts/${id}`, postData);
      dispatch({ 
        type: 'UPDATE_POST_SUCCESS', 
        payload: response.data.post 
      });
      return response.data.post;
    } catch (error) {
      dispatch({ 
        type: 'UPDATE_POST_ERROR', 
        payload: error.response?.data?.msg || 'Something went wrong' 
      });
      throw error;
    }
  };

  // Delete a post
  const deletePost = async (id) => {
    dispatch({ type: 'DELETE_POST_BEGIN' });
    try {
      await axios.delete(`${API_URL}/posts/${id}`);
      dispatch({ 
        type: 'DELETE_POST_SUCCESS', 
        payload: id 
      });
    } catch (error) {
      dispatch({ 
        type: 'DELETE_POST_ERROR', 
        payload: error.response?.data?.msg || 'Something went wrong' 
      });
      throw error;
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <PostContext.Provider
      value={{
        ...state,
        fetchPosts,
        fetchPost,
        createPost,
        updatePost,
        deletePost,
        clearError
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => {
  return useContext(PostContext);
};
