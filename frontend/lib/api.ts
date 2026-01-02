import axios from 'axios';
import { Task, TaskCreate, TaskUpdate, TaskToggleComplete } from '../types/task';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important: This allows cookies to be sent with requests
});

// Better Auth automatically handles session tokens via cookies
// No need to manually add tokens to headers

// API functions for tasks
export const taskAPI = {
  // Get all tasks for a user
  getTasks: async (userId: string): Promise<Task[]> => {
    const response = await api.get(`/api/${userId}/tasks`);
    return response.data;
  },

  // Create a new task
  createTask: async (userId: string, taskData: TaskCreate): Promise<Task> => {
    const response = await api.post(`/api/${userId}/tasks`, taskData);
    return response.data;
  },

  // Get a specific task
  getTask: async (userId: string, taskId: number): Promise<Task> => {
    const response = await api.get(`/api/${userId}/tasks/${taskId}`);
    return response.data;
  },

  // Update a task
  updateTask: async (userId: string, taskId: number, taskData: TaskUpdate): Promise<Task> => {
    const response = await api.put(`/api/${userId}/tasks/${taskId}`, taskData);
    return response.data;
  },

  // Delete a task
  deleteTask: async (userId: string, taskId: number): Promise<void> => {
    await api.delete(`/api/${userId}/tasks/${taskId}`);
  },

  // Toggle task completion
  toggleTaskCompletion: async (userId: string, taskId: number, completed: boolean): Promise<Task> => {
    const response = await api.patch(`/api/${userId}/tasks/${taskId}/complete`, { completed });
    return response.data;
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