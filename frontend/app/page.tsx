'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { auth } from '@/lib/auth';
import { TaskList } from '@/components/TaskList';
import { TaskForm } from '@/components/TaskForm';
import { TaskFilters } from '@/components/TaskFilters';
import { taskAPI } from '@/lib/api';
import { Task } from '@/types/task';
import { Card } from '@/components/ui/card';

export default function Dashboard() {
  const router = useRouter();
  const session = auth.useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTimeout, setIsTimeout] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimeout(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (session.data?.user?.id) {
      fetchTasks();
    }
  }, [session.data]);

  const fetchTasks = async () => {
    if (!session.data?.user?.id) return;

    try {
      setLoading(true);
      const userTasks = await taskAPI.getTasks(session.data.user.id);
      setTasks(userTasks);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: { title: string; description?: string }) => {
    if (!session.data?.user?.id) return;

    try {
      const newTask = await taskAPI.createTask(session.data.user.id, taskData);
      setTasks([...tasks, newTask]);
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
    }
  };

  const handleUpdateTask = async (taskId: number, taskData: Partial<Task>) => {
    if (!session.data?.user?.id) return;

    try {
      const updatedTask = await taskAPI.updateTask(session.data.user.id, taskId, taskData);
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!session.data?.user?.id) return;

    try {
      await taskAPI.deleteTask(session.data.user.id, taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  const handleToggleComplete = async (taskId: number, completed: boolean) => {
    if (!session.data?.user?.id) return;

    try {
      const updatedTask = await taskAPI.toggleTaskCompletion(session.data.user.id, taskId, completed);
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
    } catch (err) {
      setError('Failed to update task status');
      console.error('Error updating task status:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/auth/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (session.isPending || (loading && !isTimeout && !tasks.length)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
          <p className="text-muted-foreground animate-pulse">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!session.data) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Navbar user={undefined} onLogout={() => {}} />
        <main className="container mx-auto px-4 py-16 text-center space-y-8 max-w-4xl relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] -z-10"></div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-700">
            Master Your Day with <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">TaskMaster</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            A professional, intuitive, and powerful task management solution designed to help you achieve more with less stress.
          </p>
          <div className="flex justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <button
              onClick={() => router.push('/auth/signup')}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Get Started Free
            </button>
            <button
              onClick={() => router.push('/auth/login')}
              className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-all duration-300"
            >
              Sign In
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20 text-left">
            {[
              { title: 'Organize', desc: 'Keep all your tasks in one place with a clean, intuitive interface.' },
              { title: 'Prioritize', desc: 'Focus on what matters most with smart sorting and filtering.' },
              { title: 'Achieve', desc: 'Track your progress and celebrate your daily victories.' }
            ].map((feature, i) => (
              <Card key={i} className="p-6 glass border-white/10 hover:-translate-y-1 transition-transform duration-300">
                <h3 className="text-xl font-semibold mb-2 text-primary">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'completed' ? task.completed :
      !task.completed;
    
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      <Navbar user={session.data?.user} onLogout={handleLogout} />
      
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid gap-8 md:grid-cols-12">
          {/* Sidebar / Left Column */}
          <div className="md:col-span-4 space-y-6">
            <div className="glass rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl group-hover:bg-indigo-500/30 transition-all duration-500"></div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 mb-2">
                Hello, {session.data?.user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-muted-foreground relative z-10">
                You have {tasks.filter(t => !t.completed).length} pending tasks today.
              </p>
            </div>

            <Card className="p-6 glass border-white/10 shadow-xl">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                Create New Task
              </h2>
              <TaskForm onSubmit={handleCreateTask} />
            </Card>
          </div>

          {/* Main Content / Right Column */}
          <div className="md:col-span-8 space-y-6">
            <TaskFilters 
              filter={filter} 
              onFilterChange={setFilter} 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />

            <div className="glass rounded-2xl p-6 min-h-[500px] border-white/10">
              {loading ? (
                 <div className="flex flex-col items-center justify-center h-64 space-y-4">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                   <p className="text-muted-foreground">Syncing tasks...</p>
                 </div>
              ) : error ? (
                <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded-md animate-shake">
                  <p className="text-destructive font-medium">{error}</p>
                </div>
              ) : (
                <TaskList
                  tasks={filteredTasks}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleUpdateTask}
                  onDelete={handleDeleteTask}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}