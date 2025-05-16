import request from 'supertest';
import app from '../src/app';
import { PostRepository } from '../src/repositories/post.repository';

// Clear the database before each test
beforeEach(() => {
  PostRepository.clear();
});

describe('Post API', () => {
  // Test data
  const testPost = {
    title: 'Test Post',
    content: 'This is a test post content',
    author: 'Test Author'
  };

  describe('POST /api/posts', () => {
    it('should create a new post', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send(testPost);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.status).toEqual('success');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.title).toEqual(testPost.title);
      expect(res.body.data.content).toEqual(testPost.content);
      expect(res.body.data.author).toEqual(testPost.author);
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({ title: 'Missing Fields' });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.status).toEqual('error');
    });
  });

  describe('GET /api/posts', () => {
    it('should return all posts', async () => {
      // Create a post first
      const createRes = await request(app)
        .post('/api/posts')
        .send(testPost);
      
      const res = await request(app).get('/api/posts');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(Array.isArray(res.body.data)).toBeTruthy();
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title).toEqual(testPost.title);
    });

    it('should return an empty array when no posts exist', async () => {
      const res = await request(app).get('/api/posts');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(Array.isArray(res.body.data)).toBeTruthy();
      expect(res.body.data).toHaveLength(0);
    });
  });

  describe('GET /api/posts/:id', () => {
    it('should return a specific post by ID', async () => {
      // Create a post first
      const createRes = await request(app)
        .post('/api/posts')
        .send(testPost);
      
      const postId = createRes.body.data.id;
      
      const res = await request(app).get(`/api/posts/${postId}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data).toHaveProperty('id', postId);
      expect(res.body.data.title).toEqual(testPost.title);
    });

    it('should return 404 for non-existent post ID', async () => {
      const res = await request(app).get('/api/posts/nonexistent-id');
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.status).toEqual('error');
    });
  });

  describe('PUT /api/:id/posts', () => {
    it('should update a post', async () => {
      // Create a post first
      const createRes = await request(app)
        .post('/api/posts')
        .send(testPost);
      
      const postId = createRes.body.data.id;
      const updateData = {
        title: 'Updated Title',
        content: 'Updated Content'
      };
      
      const res = await request(app)
        .put(`/api/${postId}/posts`)
        .send(updateData);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.title).toEqual(updateData.title);
      expect(res.body.data.content).toEqual(updateData.content);
      expect(res.body.data.author).toEqual(testPost.author); // Unchanged field
    });

    it('should return 404 for updating non-existent post', async () => {
      const updateData = { title: 'New Title' };
      
      const res = await request(app)
        .put('/api/nonexistent-id/posts')
        .send(updateData);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.status).toEqual('error');
    });

    it('should return 400 if no update fields provided', async () => {
      // Create a post first
      const createRes = await request(app)
        .post('/api/posts')
        .send(testPost);
      
      const postId = createRes.body.data.id;
      
      const res = await request(app)
        .put(`/api/${postId}/posts`)
        .send({});
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.status).toEqual('error');
    });
  });

  describe('DELETE /api/:id/posts', () => {
    it('should delete a post', async () => {
      // Create a post first
      const createRes = await request(app)
        .post('/api/posts')
        .send(testPost);
      
      const postId = createRes.body.data.id;
      
      const res = await request(app).delete(`/api/${postId}/posts`);
      
      expect(res.statusCode).toEqual(204);
      
      // Verify post is deleted
      const getRes = await request(app).get(`/api/posts/${postId}`);
      expect(getRes.statusCode).toEqual(404);
    });

    it('should return 404 for deleting non-existent post', async () => {
      const res = await request(app).delete('/api/nonexistent-id/posts');
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.status).toEqual('error');
    });
  });
});