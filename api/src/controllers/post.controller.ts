import { Request, Response, NextFunction } from 'express';
import { PostService } from '../services/post.service';
import { CreatePostDto, UpdatePostDto } from '../types/post.types';
import { ApiError } from '../utils/error-handler';

export const PostController = {
  /**
   * @swagger
   * /api/posts:
   *   get:
   *     summary: Get all posts
   *     responses:
   *       200:
   *         description: A list of posts
   */
  getAllPosts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = PostService.getAllPosts();
      res.status(200).json({
        status: 'success',
        data: posts
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * @swagger
   * /api/posts/{id}:
   *   get:
   *     summary: Get a post by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Post details
   *       404:
   *         description: Post not found
   */
  getPostById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const post = PostService.getPostById(id);
      res.status(200).json({
        status: 'success',
        data: post
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * @swagger
   * /api/posts:
   *   post:
   *     summary: Create a new post
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *               - content
   *               - author
   *     responses:
   *       201:
   *         description: Created post
   *       400:
   *         description: Bad request
   */
  createPost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, content, author } = req.body;
      
      if (!title || !content || !author) {
        throw new ApiError(400, 'Missing required fields: title, content, and author are required');
      }
      
      const postData: CreatePostDto = { title, content, author };
      const newPost = PostService.createPost(postData);
      
      res.status(201).json({
        status: 'success',
        data: newPost
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * @swagger
   * /api/{id}/posts:
   *   put:
   *     summary: Update a post
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       200:
   *         description: Updated post
   *       404:
   *         description: Post not found
   */
  updatePost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { title, content, author } = req.body;
      
      if (!title && !content && !author) {
        throw new ApiError(400, 'At least one field (title, content, or author) must be provided');
      }
      
      const postData: UpdatePostDto = {};
      if (title) postData.title = title;
      if (content) postData.content = content;
      if (author) postData.author = author;
      
      const updatedPost = PostService.updatePost(id, postData);
      
      res.status(200).json({
        status: 'success',
        data: updatedPost
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * @swagger
   * /api/{id}/posts:
   *   delete:
   *     summary: Delete a post
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Post deleted
   *       404:
   *         description: Post not found
   */
  deletePost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      PostService.deletePost(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};