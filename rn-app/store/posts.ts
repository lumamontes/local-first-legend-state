import { observable } from '@legendapp/state';
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage';
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv';
import { syncedCrud, SyncedCrudOnSavedParams } from '@legendapp/state/sync-plugins/crud';
import { Platform } from 'react-native';

export interface Post {
  id?: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreatePostInput = Pick<Post, 'title' | 'content'>;

export type CreatePostOutput = {
  status: string;
  data: Post;
  message: string;
}

const API_URL = 'http://localhost:3000/api';

const getPosts = async () => {
  const response = await fetch(`${API_URL}/posts`);
  return response.json().then(data => {
    return data.data;
  });
};

const createPost = async (input: CreatePostInput): Promise<Post> => {
  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const result = await response.json();
  return result.data;
};

const updatePost = async (input: Partial<Post>) => {
  const response = await fetch(`${API_URL}/posts/${input.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return response.json();
};

const deletePost = async (input: Post) => {
  await fetch(`${API_URL}/posts/${input.id}`, {
    method: 'DELETE',
  });
  return { id: input.id };
};

export const postStore$ = observable(syncedCrud<CreatePostInput, CreatePostInput, 'array'>({
  initial: [] as Record<string, Post>[],
  as: 'array',
  list: getPosts,
  create: createPost,
  update: updatePost,
  delete: deletePost,
  persist: {
    name: 'posts',
    plugin: Platform.OS === 'web' ? ObservablePersistLocalStorage : ObservablePersistMMKV,
  },
  onSaved: (data) => {
    //Quando o post é salvo no backend, recebemos a resposta aqui
    //E podemos atualizar o post no store de acordo com os dados do post salvo no backend, caso quisermos
    //Por exemplo, se quisermos atualizar o post com o id do post salvo no backend etc
    return {
      ...data.saved,
    }
  },
  retry: {
    infinite: true,
  },
  syncMode: 'auto',
  fieldUpdatedAt: 'updatedAt',
  fieldCreatedAt: 'createdAt',
}));