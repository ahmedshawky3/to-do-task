import { SelectChangeEvent } from '@mui/material/Select';

export interface Todo {
  _id: string;
  title: string;
  description: string;
  category: 'work' | 'personal' | 'shopping' | 'health' | 'other';
  dueDate?: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  updatedAt?: string;
  isDeleted: boolean;
}

export interface TodoFormData {
  title: string;
  description: string;
  category: 'work' | 'personal' | 'shopping' | 'health' | 'other';
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface TodoFormProps {
  initialData?: Partial<TodoFormData>;
  onSubmit: (data: TodoFormData) => void;
  onCancel: () => void;
}

export interface TodoItemProps {
  todo: Todo;
  onTodoUpdated: (updatedTodo: Todo) => void;
  onDelete: (id: string) => void;
  filters: TodoFilters;
}

export interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  error: string;
  page: number;
  pagination: PaginationData;
  filters: TodoFilters;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  onLimitChange: (event: SelectChangeEvent) => void;
  onTodoUpdate: (updatedTodo: Todo) => void;
  onDelete: (id: string) => void;
  onAddNewTask: () => void;
}

export interface TodoFilters {
  status: string[];
  category: string[];
  search: string;
  showDeleted: boolean;
  dueDate?: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface SortOptions {
  sortBy: 'createdAt' | 'title' | 'dueDate' | 'category';
  sortOrder: 'asc' | 'desc';
}

export interface TodoFiltersProps {
  filters: TodoFilters;
  onFilterChange: (filters: Partial<TodoFilters>) => void;
  sortOptions: SortOptions;
  onSortChange: (sortOptions: SortOptions) => void;
} 