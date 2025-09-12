import axios from 'axios';
import type { LoginData, RegisterData, User, FileItem, UpdateFileData } from '../types';

const API_BASE_URL = 'https://file-upload-react-app-0.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (data: LoginData): Promise<{ token: string; user: User }> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<{ token: string; user: User }> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};

// Files API
export const filesAPI = {
  upload: async (file: File): Promise<FileItem> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAll: async (): Promise<FileItem[]> => {
    const response = await api.get('/files');
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/files/${id}`);
  },

  getById: async (id: string): Promise<FileItem> => {
    const response = await api.get(`/files/${id}`);
    return response.data;
  },

  update: async (id: string, data: UpdateFileData): Promise<FileItem> => {
    const response = await api.put(`/files/${id}`, data);
    return response.data;
  },
};

export default api;