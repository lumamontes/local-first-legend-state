import { v4 as uuidv4 } from 'uuid';
import { Post, CreatePostDto, UpdatePostDto } from '../types/post.types';
import { ApiError } from '../utils/error-handler';
import { PostService } from '../services/post.service';
import logger from '../utils/logger';

let posts: Post[] = [];

export const PostRepository = {
  findAll: (): Post[] => {
    return posts;
  },
  
  findById: (id: string): Post => {
    const post = posts.find(post => post.id === id);
    if (!post) {
      throw new ApiError(404, `Post with id ${id} not found`);
    }
    return post;
  },
  
  create: (postData: CreatePostDto): Post => {
    const now = new Date();
    const newPost: Post = {
      id: uuidv4(),
      ...postData,
      createdAt: now,
      updatedAt: now
    };
    
    posts.push(newPost);
    return newPost;
  },
  
  update: (id: string, postData: UpdatePostDto): Post => {
    const postIndex = posts.findIndex(post => post.id === id);
    
    if (postIndex === -1) {
      throw new ApiError(404, `Post with id ${id} not found`);
    }
    
    const updatedPost: Post = {
      ...posts[postIndex],
      ...postData,
      updatedAt: new Date()
    };
    
    posts[postIndex] = updatedPost;
    return updatedPost;
  },
  
  delete: (id: string): void => {
    posts = posts.filter(post => post.id !== id);
  },
  
  // For testing purposes
  clear: (): void => {
    posts = [];
  }
};