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

  // Rest of the test file remains the same...
});
