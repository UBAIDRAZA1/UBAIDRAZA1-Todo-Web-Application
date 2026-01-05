'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TaskFilters } from "@/components/TaskFilters";
import { TaskCard } from "@/components/TaskCard";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { Icons } from "@/components/icons";

interface Task {
  id: number;
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  tags?: string[];
  completed: boolean;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

// Mock data
const mockTasks: Task[] = [
  {
    id: 1,
    title: "Complete project proposal",
    description: "Finish the proposal document for the new client project",
    priority: "high",
    dueDate: "2023-06-15",
    tags: ["work", "important"],
    completed: false,
  },
  {
    id: 2,
    title: "Buy groceries",
    description: "Milk, eggs, bread, fruits, and vegetables",
    priority: "medium",
    dueDate: "2023-06-10",
    tags: ["personal"],
    completed: true,
  },
  {
    id: 3,
    title: "Schedule team meeting",
    description: "Coordinate with team members for next week",
    priority: "low",
    dueDate: "2023-06-20",
    tags: ["work", "meeting"],
    completed: false,
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddTask = (task: {
    title: string;
    description?: string;
    priority?: "low" | "medium" | "high";
    dueDate?: string;
    tags: string[];
  }) => {
    const newTask: Task = {
      id: tasks.length + 1,
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      tags: task.tags,
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setIsAddTaskOpen(false);
  };

  const handleToggleTask = (id: number) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "completed"
        ? task.completed
        : filter === "pending"
        ? !task.completed
        : true;

    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description ?? "").toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container py-8">
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Tasks
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your tasks efficiently
              </p>
            </div>

            <Button onClick={() => setIsAddTaskOpen(true)}>
              <Icons.plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </motion.div>

          <TaskFilters
            onFilterChange={setFilter}
            filter={filter}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>

        {filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-full mb-4">
              <Icons.task className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              No tasks found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filter === "completed"
                ? "You have no completed tasks yet."
                : filter === "pending"
                ? "You have no pending tasks. Great job!"
                : "Get started by creating a new task."}
            </p>

            <Button onClick={() => setIsAddTaskOpen(true)}>
              <Icons.plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <TaskCard
                  task={{
                    id: task.id,
                    title: task.title,
                    description: task.description ?? "",
                    priority: task.priority ?? "low",
                    dueDate: task.dueDate,
                    tags: task.tags ?? [],
                    completed: task.completed,
                  }}
                  onToggle={() => handleToggleTask(task.id)}
                  onDelete={() => handleDeleteTask(task.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        <AddTaskDialog
          open={isAddTaskOpen}
          onOpenChange={setIsAddTaskOpen}
          onAddTask={handleAddTask}
        />
      </div>
    </div>
  );
}
