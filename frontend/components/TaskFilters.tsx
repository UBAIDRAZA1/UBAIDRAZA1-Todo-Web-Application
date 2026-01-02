import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Icons } from '@/components/icons';

interface TaskFiltersProps {
  onFilterChange: (filter: string) => void;
  filter: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function TaskFilters({ onFilterChange, filter, searchTerm, onSearchChange }: TaskFiltersProps) {
  return (
    <Card className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-card/50 backdrop-blur-sm border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-center sm:justify-start">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange('all')}
          className="transition-all duration-300"
        >
          All
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange('pending')}
          className="transition-all duration-300"
        >
          Pending
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange('completed')}
          className="transition-all duration-300"
        >
          Completed
        </Button>
      </div>
      
      <div className="relative w-full sm:w-64">
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-full bg-background/50 focus:bg-background transition-all duration-300"
        />
        <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
    </Card>
  );
}