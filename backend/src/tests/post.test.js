const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../app');
const Post = require('../models/Post');

// Connect to the test database before running tests
beforeAll(async () => {
  const testDbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/blog-post-manager-test';
  await mongoose.connect(testDbUri);
});

// Disconnect from the database after all tests are done
afterAll(async () => {
  await mongoose.disconnect();
});

// Clear the database before each test
beforeEach(async () => {
  await Post.deleteMany({});
});

describe('Post API', () => {
  // Test creating a post
  describe('POST /api/v1/posts', () => {
    it('should create a new post', async () => {
      const postData = {
        title: 'Test Post',
        content: 'This is a test post content',
        author: 'Test Author'
      };

      const response = await request(app)
        .post('/api/v1/posts')
        .send(postData)
        .expect(201);

      expect(response.body.post).toHaveProperty('_id');
      expect(response.body.post.title).toBe(postData.title);
      expect(response.body.post.content).toBe(postData.content);
      expect(response.body.post.author).toBe(postData.author);
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/v1/posts')
        .send({ title: 'Test Post' })
        .expect(400);

      expect(response.body).toHaveProperty('msg');
    });
  });

  // Test getting all posts
  describe('GET /api/v1/posts', () => {
    it('should return all posts', async () => {
      // Create test posts
      await Post.create([
        {
          title: 'Test Post 1',
          content: 'Content 1',
          author: 'Author 1'
        },
        {
          title: 'Test Post 2',
          content: 'Content 2',
          author: 'Author 2'
        }
      ]);

      const response = await request(app)
        .get('/api/v1/posts')
        .expect(200);

      expect(response.body.posts).toHaveLength(2);
      expect(response.body.count).toBe(2);
    });
  });

  // Test getting a post by ID
  describe('GET /api/v1/posts/:id', () => {
    it('should return a post by id', async () => {
      const post = await Post.create({
        title: 'Test Post',
        content: 'Test Content',
        author: 'Test Author'
      });

      const response = await request(app)
        .get(`/api/v1/posts/${post._id}`)
        .expect(200);

      expect(response.body.post._id).toBe(post._id.toString());
      expect(response.body.post.title).toBe(post.title);
    });

    it('should return 404 if post not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      await request(app)
        .get(`/api/v1/posts/${nonExistentId}`)
        .expect(404);
    });
  });

  // Test updating a post
  describe('PATCH /api/v1/posts/:id', () => {
    it('should update a post', async () => {
      const post = await Post.create({
        title: 'Original Title',
        content: 'Original Content',
        author: 'Original Author'
      });

      const updatedData = {
        title: 'Updated Title',
        content: 'Updated Content'
      };

      const response = await request(app)
        .patch(`/api/v1/posts/${post._id}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.post.title).toBe(updatedData.title);
      expect(response.body.post.content).toBe(updatedData.content);
      expect(response.body.post.author).toBe(post.author);
    });

    it('should return 404 if post not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      await request(app)
        .patch(`/api/v1/posts/${nonExistentId}`)
        .send({ title: 'Updated Title' })
        .expect(404);
    });
  });

  // Test deleting a post
  describe('DELETE /api/v1/posts/:id', () => {
    it('should delete a post', async () => {
      const post = await Post.create({
        title: 'Test Post',
        content: 'Test Content',
        author: 'Test Author'
      });

      await request(app)
        .delete(`/api/v1/posts/${post._id}`)
        .expect(200);

      const deletedPost = await Post.findById(post._id);
      expect(deletedPost).toBeNull();
    });

    it('should return 404 if post not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      await request(app)
        .delete(`/api/v1/posts/${nonExistentId}`)
        .expect(404);
    });
  });
});
