import { PostRepository } from '../repositories/post.repository';
import { Post, CreatePostDto, UpdatePostDto, PostResponse } from '../types/post.types';
import logger from '../utils/logger';

export const PostService = {
  getAllPosts: (): PostResponse[] => {
    logger.info('Getting all posts');
    const posts = PostRepository.findAll();
    return posts.map(formatPostResponse);
  },
  
  getPostById: (id: string): PostResponse => {
    logger.info(`Getting post with id: ${id}`);
    const post = PostRepository.findById(id);
    return formatPostResponse(post);
  },
  
  createPost: (postData: CreatePostDto): PostResponse => {
    logger.info('Creating new post', { data: postData });
    const newPost = PostRepository.create(postData);
    return formatPostResponse(newPost);
  },
  
  updatePost: (id: string, postData: UpdatePostDto): PostResponse => {
    logger.info(`Updating post with id: ${id}`, { data: postData });
    const updatedPost = PostRepository.update(id, postData);
    return formatPostResponse(updatedPost);
  },
  
  deletePost: (id: string): void => {
    logger.info(`Deleting post with id: ${id}`);
    PostRepository.delete(id);
  }
};

const formatPostResponse = (post: Post): PostResponse => {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    author: post.author,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString()
  };
};