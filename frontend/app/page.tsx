'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/lib/auth';
import { TaskList } from '@/components/TaskList';
import { TaskForm } from '@/components/TaskForm';
import { TaskFilters } from '@/components/TaskFilters';
import { taskAPI } from '@/lib/api';
import { Task } from '@/types/task';
import { Card } from '@/components/ui/card';

export default function Dashboard() {
  const router = useRouter();
  const { session, signOut } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed'
  const [searchTerm, setSearchTerm] = useState('');

  // Memoized fetch function
  const fetchTasks = useCallback(async () => {
    if (!session.data?.user?.id) return;

    try {
      setLoading(true);
      // Get token from session data
      const token = session.data.token;
      const userTasks = await taskAPI.getTasks(session.data.user.id, token);
      setTasks(userTasks ?? []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [session.data?.user?.id, session.data?.token]);

  // Initial load
  useEffect(() => {
    if (session.data?.user?.id) {
      fetchTasks();
    }
  }, [session.data?.user?.id, fetchTasks]);

  // ================== TASK OPERATIONS ==================

  const handleCreateTask = async (taskData: { title: string; description?: string }) => {
    if (!session.data?.user?.id) return;

    const optimisticTask: Task = {
      id: Date.now(), // temporary negative/timestamp id
      title: taskData.title,
      description: taskData.description,
      completed: false,
      user_id: session.data.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Optimistic add
    setTasks((prev) => [optimisticTask, ...prev]);

    try {
      const token = session.data.token;
      const createdTask = await taskAPI.createTask(session.data.user.id, taskData, token);

      // Replace temp task with real one
      setTasks((prev) =>
        prev.map((t) => (t.id === optimisticTask.id ? createdTask : t))
      );

      // Most reliable: background refresh after create
      setTimeout(fetchTasks, 400);
    } catch (err) {
      console.error('Create failed:', err);
      setError('Failed to create task');
      // Rollback
      setTasks((prev) => prev.filter((t) => t.id !== optimisticTask.id));
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!session.data?.user?.id || !taskId) return;

    const taskToDelete = tasks.find((t) => t.id === taskId);
    if (!taskToDelete) return;

    // Optimistic remove
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    try {
      const token = session.data.token;
      await taskAPI.deleteTask(session.data.user.id, taskId, token);

      // Extra safety net (especially for Supabase-like setups)
      setTimeout(fetchTasks, 300);
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to delete task');
      // Rollback
      setTasks((prev) => [...prev, taskToDelete].sort((a, b) => b.id - a.id));
    }
  };

  const handleUpdateTask = async (taskId: number, taskData: Partial<Task>) => {
    if (!session.data?.user?.id || !taskId) return;

    const originalTask = tasks.find((t) => t.id === taskId);
    if (!originalTask) return;

    // Optimistic update
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, ...taskData, updated_at: new Date().toISOString() } : task
      )
    );

    try {
      const token = session.data.token;
      await taskAPI.updateTask(session.data.user.id, taskId, taskData, token);
      // Background refresh (most reliable for now)
      setTimeout(fetchTasks, 400);
    } catch (err) {
      console.error('Update failed:', err);
      setError('Failed to update task');
      // Rollback
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? originalTask : task))
      );
    }
  };

  const handleToggleComplete = async (taskId: number, completed: boolean) => {
    if (!session.data?.user?.id || !taskId) return;

    const originalTask = tasks.find((t) => t.id === taskId);
    if (!originalTask) return;

    // Optimistic toggle
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed,
              completed_at: completed ? new Date().toISOString() : undefined,
              updated_at: new Date().toISOString(),
            }
          : task
      )
    );

    try {
      const token = session.data.token;
      await taskAPI.toggleTaskCompletion(session.data.user.id, taskId, completed, token);
      setTimeout(fetchTasks, 300);
    } catch (err) {
      console.error('Toggle failed:', err);
      setError('Failed to update task status');
      // Rollback
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? originalTask : task))
      );
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // ================== RENDER ==================

  if (session.isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!session.data) {
    router.push('/auth/login');
    return null;
  }

  // ✅ FIXED: Proper filtering logic
  const filteredTasks = tasks.filter((task) => {
    // First filter by completion status
    let matchesFilter = true;

    if (filter === 'pending') {
      matchesFilter = !task.completed; // Show only incomplete tasks
    } else if (filter === 'completed') {
      matchesFilter = task.completed; // Show only completed tasks
    }
    // 'all' means matchesFilter remains true (show all tasks)

    // Then filter by search term
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description?.toLowerCase()?.includes(searchTerm.toLowerCase()) ?? false);

    return matchesFilter && matchesSearch;
  });

  // Calculate counts for display
  const pendingCount = tasks.filter(task => !task.completed).length;
  const completedCount = tasks.filter(task => task.completed).length;
  const allCount = tasks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <Navbar user={session.data?.user} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid gap-8 md:grid-cols-12">
          {/* Left sidebar */}
          <div className="md:col-span-4 space-y-6">
            <Card className="p-6 bg-gradient-to-br from-card to-card/50">
              <h1 className="text-3xl font-bold text-card-foreground mb-2">
                Hello, {session.data?.user?.name?.split(' ')[0] ?? 'User'}! 👋
              </h1>
              <p className="text-muted-foreground">
                {pendingCount} pending tasks • {completedCount} completed
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">New Task</h2>
              <TaskForm onSubmit={handleCreateTask} />
            </Card>
          </div>

          {/* Main content */}
          <div className="md:col-span-8 space-y-6">
            <TaskFilters
              filter={filter}
              onFilterChange={setFilter}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              counts={{
                all: allCount,
                pending: pendingCount,
                completed: completedCount
              }}
            />

            <Card className="p-6 min-h-[500px]">
              {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4 border border-destructive/20">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground">Loading tasks...</p>
                  </div>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-2xl">
                      {filter === 'completed' ? '✅' : filter === 'pending' ? '⏳' : '📝'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {searchTerm
                      ? 'No tasks match your search'
                      : filter === 'completed'
                        ? 'No completed tasks yet'
                        : filter === 'pending'
                          ? 'No pending tasks'
                          : 'No tasks yet. Create your first task!'
                    }
                  </h3>
                  <p className="text-muted-foreground">
                    {!searchTerm && filter !== 'all' && 'Try switching to "All tasks" or create a new task.'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4 text-sm text-muted-foreground">
                    Showing {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
                    {filter !== 'all' && ` (${filter} tasks)`}
                  </div>
                  <TaskList
                    tasks={filteredTasks}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleUpdateTask}
                    onDelete={handleDeleteTask}
                  />
                </>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}