'use client';

import { useState } from 'react';
import { Task } from '@/types/task';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: { title: string; description?: string }) => void;
  onCancel?: () => void;
}

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setError('');
    onSubmit({ title: title.trim(), description: description.trim() || undefined });

    if (!task) {
      // Only reset form if creating a new task
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {error && (
        <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded-md animate-shake">
          <p className="text-sm text-destructive font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-foreground font-medium">
            Task Title
          </Label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-background/50 backdrop-blur-sm focus:bg-background transition-all duration-300"
            placeholder="What needs to be done?"
            maxLength={255}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-foreground font-medium">
            Description (Optional)
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="bg-background/50 backdrop-blur-sm focus:bg-background transition-all duration-300 resize-none"
            placeholder="Add more details..."
            maxLength={1000}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant={task ? "default" : "gradient"}
            className="w-full sm:w-auto"
          >
            {task ? 'Update Task' : 'Add Task'}
          </Button>
        </div>
      </div>
    </form>
  );
}