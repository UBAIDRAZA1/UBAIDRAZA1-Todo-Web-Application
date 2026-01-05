import axios from 'axios';
import { Task, TaskCreate, TaskUpdate } from '../types/task';

// ✅ IMPORTANT: Port 7860 use karein for production
const getApiBaseUrl = () => {
  // Environment variable se lelo
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  
  // Production mein port 7860
  if (process.env.NODE_ENV === 'production') {
    return 'https://hafizubaid-todo-wep-app.hf.space:7860';
  }
  
  // Development mein port 8001
  return 'http://localhost:8001';
};

const API_BASE_URL = getApiBaseUrl();

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ FIXED: Safe logging with null checks
if (process.env.NODE_ENV !== 'production') {
  api.interceptors.request.use((config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    console.log('Full URL:', `${config.baseURL || ''}${config.url || ''}`);
    return config;
  });
}

export const taskAPI = {
  // ✅ GET all tasks
  getTasks: async (userId: string): Promise<Task[]> => {
    try {
      const response = await api.get(`/api/${userId}/tasks`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to get tasks:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ CREATE new task
  createTask: async (userId: string, taskData: TaskCreate): Promise<Task> => {
    try {
      const response = await api.post(`/api/${userId}/tasks`, taskData);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create task:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ GET single task
  getTask: async (userId: string, taskId: number): Promise<Task> => {
    if (!taskId) {
      throw new Error('Task ID is required');
    }
    try {
      const response = await api.get(`/api/${userId}/tasks/${taskId}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to get task:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ UPDATE task
  updateTask: async (userId: string, taskId: number, taskData: TaskUpdate): Promise<Task> => {
    if (!taskId) {
      throw new Error('Task ID is required');
    }
    try {
      const response = await api.put(`/api/${userId}/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error: any) {
      console.error('Failed to update task:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ DELETE task
  deleteTask: async (userId: string, taskId: number): Promise<void> => {
    if (!taskId) {
      throw new Error('Task ID is required');
    }
    try {
      await api.delete(`/api/${userId}/tasks/${taskId}`);
    } catch (error: any) {
      console.error('Failed to delete task:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ TOGGLE task completion
  toggleTaskCompletion: async (userId: string, taskId: number, completed: boolean): Promise<Task> => {
    if (!taskId) {
      throw new Error('Task ID is required');
    }
    try {
      const response = await api.patch(`/api/${userId}/tasks/${taskId}/toggle`, {
        completed
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to toggle task:', error.response?.data || error.message);
      throw error;
    }
  },
};

// ✅ Export individual functions
export const {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion
} = taskAPI;

// ✅ For backward compatibility
export const toggleTaskComplete = taskAPI.toggleTaskCompletion;

// ✅ Export api instance for custom requests
export default api;