import axios from 'axios';
import { Task, TaskCreate, TaskUpdate } from '../types/task';

// ✅ FIXED: Use proper Hugging Face backend URL with API path
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://hafizubaid-todo-wep-app.hf.space';

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
      const response = await api.get(`/api/tasks`, {
        params: { user_id: userId }
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to get tasks:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ CREATE new task
  createTask: async (userId: string, taskData: TaskCreate): Promise<Task> => {
    try {
      const response = await api.post(`/api/tasks`, {
        ...taskData,
        user_id: userId
      });
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
      const response = await api.get(`/api/tasks/${taskId}`, {
        params: { user_id: userId }
      });
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
      const response = await api.put(`/api/tasks/${taskId}`, {
        ...taskData,
        user_id: userId
      });
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
      await api.delete(`/api/tasks/${taskId}`, {
        params: { user_id: userId }
      });
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
      const response = await api.patch(`/api/tasks/${taskId}/toggle`, {
        completed,
        user_id: userId
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
