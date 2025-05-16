import { Router } from 'express';
import { PostController } from '../controllers/post.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API for managing posts
 */

// GET /api/posts - Get all posts
router.get('/posts', PostController.getAllPosts);

// GET /api/posts/:id - Get a specific post
router.get('/posts/:id', PostController.getPostById);

// POST /api/posts - Create a new post
router.post('/posts', PostController.createPost);

router.put('/posts/:id', PostController.updatePost);

router.delete('/posts/:id', PostController.deletePost);

export default router;