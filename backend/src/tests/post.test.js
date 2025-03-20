const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Post = require('../models/Post');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Post.deleteMany({});
});

describe('Post API', () => {
  const samplePost = {
    title: 'Test Post',
    content: 'This is a test post content',
    author: 'Test Author'
  };

  describe('POST /api/v1/posts', () => {
    it('should create a new post', async () => {
      const response = await request(app)
        .post('/api/v1/posts')
        .send(samplePost)
        .expect(201);

      expect(response.body.post).toHaveProperty('_id');
      expect(response.body.post.title).toBe(samplePost.title);
      expect(response.body.post.content).toBe(samplePost.content);
      expect(response.body.post.author).toBe(samplePost.author);
    });

    it('should return 400 if required fields are missing', async () => {
      await request(app)
        .post('/api/v1/posts')
        .send({ title: 'Test Post' })
        .expect(400);
    });
  });

  describe('GET /api/v1/posts', () => {
    it('should return all posts', async () => {
      await Post.create(samplePost);
      await Post.create({
        ...samplePost,
        title: 'Another Test Post'
      });

      const response = await request(app)
        .get('/api/v1/posts')
        .expect(200);

      expect(response.body.posts.length).toBe(2);
      expect(response.body.count).toBe(2);
    });
  });

  describe('GET /api/v1/posts/:id', () => {
    it('should return a post by id', async () => {
      const post = await Post.create(samplePost);

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

  describe('PATCH /api/v1/posts/:id', () => {
    it('should update a post', async () => {
      const post = await Post.create(samplePost);
      const updatedData = { title: 'Updated Title' };

      const response = await request(app)
        .patch(`/api/v1/posts/${post._id}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.post.title).toBe(updatedData.title);
      expect(response.body.post.content).toBe(post.content);
    });

    it('should return 404 if post not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      await request(app)
        .patch(`/api/v1/posts/${nonExistentId}`)
        .send({ title: 'Updated Title' })
        .expect(404);
    });
  });

  describe('DELETE /api/v1/posts/:id', () => {
    it('should delete a post', async () => {
      const post = await Post.create(samplePost);

      await request(app)
        .delete(`/api/v1/posts/${post._id}`)
        .expect(200);

      const foundPost = await Post.findById(post._id);
      expect(foundPost).toBeNull();
    });

    it('should return 404 if post not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      await request(app)
        .delete(`/api/v1/posts/${nonExistentId}`)
        .expect(404);
    });
  });
});
