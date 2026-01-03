import axios from 'axios';
import { Task, TaskCreate, TaskUpdate } from '../types/task';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Better Auth ke cookies ke liye
});

// Development mein requests log karne ke liye
if (process.env.NODE_ENV !== 'production') {
  api.interceptors.request.use((config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  });
}

export const taskAPI = {
  getTasks: async (userId: string): Promise<Task[]> => {
    try {
      const response = await api.get(`/api/${userId}/tasks`);
      return response.data;
    } catch (error) {
      console.error('Failed to get tasks:', error);
      throw error;
    }
  },

  createTask: async (userId: string, taskData: TaskCreate): Promise<Task> => {
    try {
      const response = await api.post(`/api/${userId}/tasks`, taskData);
      return response.data;
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  },

  getTask: async (userId: string, taskId: number): Promise<Task> => {
    if (!taskId) {
      console.error('Task ID is invalid for get task:', taskId);
      throw new Error('Task ID is required for get task');
    }
    try {
      const response = await api.get(`/api/${userId}/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get task:', error);
      throw error;
    }
  },

  // General update (PUT method)
  updateTask: async (userId: string, taskId: number, taskData: TaskUpdate): Promise<Task> => {
    if (!taskId) {
      console.error('Task ID is invalid for update task:', taskId);
      throw new Error('Task ID is required for update task');
    }
    try {
      const response = await api.put(`/api/${userId}/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  },

  deleteTask: async (userId: string, taskId: number): Promise<void> => {
    if (!taskId) {
      console.error('Task ID is invalid for delete task:', taskId);
      throw new Error('Task ID is required for delete task');
    }
    try {
      await api.delete(`/api/${userId}/tasks/${taskId}`);
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  },

  // Toggle task completion – FIXED: PUT method use kiya (backend PUT support karta hai)
  toggleTaskCompletion: async (userId: string, taskId: number, completed: boolean): Promise<Task> => {
    if (!taskId) {
      console.error('Task ID is invalid for toggle completion:', taskId);
      throw new Error('Task ID is required for toggle completion');
    }
    try {
      // PUT use kar rahe hain, body mein completed bhej rahe hain (updateTask ke jaise)
      const response = await api.put(`/api/${userId}/tasks/${taskId}`, { completed });
      return response.data;
    } catch (error: any) {
      console.error('Failed to toggle task completion:', error.response?.data || error.message);
      throw error;
    }
  },
};

export const {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} = taskAPI;

export const toggleTaskComplete = taskAPI.toggleTaskCompletion;