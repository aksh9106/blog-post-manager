const Post = require('../models/Post');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors');

// Get all posts
const getAllPosts = async (req, res) => {
  const posts = await Post.find({}).sort({ createdAt: -1 });
  res.status(StatusCodes.OK).json({ posts, count: posts.length });
};

// Get a single post
const getPost = async (req, res) => {
  const { id: postId } = req.params;
  
  const post = await Post.findOne({ _id: postId });
  if (!post) {
    throw new NotFoundError(`No post with id: ${postId}`);
  }
  
  res.status(StatusCodes.OK).json({ post });
};

// Create a post
const createPost = async (req, res) => {
  const post = await Post.create(req.body);
  res.status(StatusCodes.CREATED).json({ post });
};

// Update a post
const updatePost = async (req, res) => {
  const { id: postId } = req.params;
  
  const post = await Post.findOneAndUpdate(
    { _id: postId },
    { ...req.body, updatedAt: Date.now() },
    { new: true, runValidators: true }
  );
  
  if (!post) {
    throw new NotFoundError(`No post with id: ${postId}`);
  }
  
  res.status(StatusCodes.OK).json({ post });
};

// Delete a post
const deletePost = async (req, res) => {
  const { id: postId } = req.params;
  
  const post = await Post.findOneAndDelete({ _id: postId });
  if (!post) {
    throw new NotFoundError(`No post with id: ${postId}`);
  }
  
  res.status(StatusCodes.OK).json({ msg: 'Post deleted successfully' });
};

module.exports = {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
};
