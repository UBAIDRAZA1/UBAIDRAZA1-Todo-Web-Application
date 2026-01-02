'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import { taskAPI } from '@/lib/api';
import { Task } from '@/types/task';
import { TaskForm } from '@/components/TaskForm';

export default function TaskDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const session = auth.useSession();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (session.data?.user?.id && id) {
      fetchTask();
    }
  }, [session.data, id]);

  const fetchTask = async () => {
    if (!session.data?.user?.id || !id) return;

    try {
      setLoading(true);
      const taskData = await taskAPI.getTask(session.data.user.id, parseInt(id as string));
      setTask(taskData);
      setError(null);
    } catch (err) {
      setError('Failed to load task');
      console.error('Error fetching task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: { title: string; description?: string }) => {
    if (!session.data?.user?.id || !task) return;

    try {
      const updatedTask = await taskAPI.updateTask(session.data.user.id, task.id, data);
      setTask(updatedTask);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  const handleDelete = async () => {
    if (!session.data?.user?.id || !task) return;

    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.deleteTask(session.data.user.id, task.id);
        router.push('/');
      } catch (err) {
        setError('Failed to delete task');
        console.error('Error deleting task:', err);
      }
    }
  };

  const handleToggleComplete = async () => {
    if (!session.data?.user?.id || !task) return;

    try {
      const updatedTask = await taskAPI.toggleTaskCompletion(session.data.user.id, task.id, !task.completed);
      setTask(updatedTask);
    } catch (err) {
      setError('Failed to update task status');
      console.error('Error updating task status:', err);
    }
  };

  if (session.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!session.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Please log in to access this task</h1>
          <a href="/auth/login" className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200">
            Login
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading task...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Task not found</h1>
          <button
            onClick={() => router.push('/')}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
          >
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Tasks
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
          >
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Task
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg flex items-start mb-4 border border-red-200">
            <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          {isEditing ? (
            <TaskForm
              task={task}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div>
              <div className="flex items-start mb-6">
                <label className="relative flex items-center justify-center cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={handleToggleComplete}
                    className="peer sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center
                    ${task.completed
                      ? 'bg-green-500 border-green-500'
                      : 'bg-white border-gray-300 hover:border-indigo-500'}`}
                  >
                    <svg className={`w-3 h-3 text-white transition-opacity duration-200 ${task.completed ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </label>
                <div className="ml-4 flex-1">
                  <h1 className={`text-xl font-bold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {task.title}
                  </h1>
                  {task.description && (
                    <p className={`mt-2 text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-600'}`}>
                      {task.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="ml-2 text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      <span className="font-medium text-gray-700">Created:</span>{' '}
                      {new Date(task.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      <span className="font-medium text-gray-700">Last updated:</span>{' '}
                      {new Date(task.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
