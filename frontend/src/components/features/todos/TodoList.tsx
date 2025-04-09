import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Pagination,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
  Alert
} from '@mui/material';
import { commonStyles } from '../../../theme';
import TodoItem from './TodoItem';
import { Todo, TodoFilters, PaginationData } from '../../../types/todo';

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  error: string;
  page: number;
  pagination: PaginationData;
  filters: TodoFilters;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  onLimitChange: (event: SelectChangeEvent) => void;
  onTodoUpdate: () => Promise<void>;
  onDelete: (id: string) => void;
  onAddNewTask: () => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  loading,
  error,
  page,
  pagination,
  filters,
  onPageChange,
  onLimitChange,
  onTodoUpdate,
  onDelete,
  onAddNewTask
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (todos.length === 0) {
  return (
      <Card sx={{ ...commonStyles.card, textAlign: 'center', p: 4 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No tasks found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {filters.status.length > 0 || filters.category.length > 0 || filters.search
            ? 'Try adjusting your filters or search criteria'
            : 'Create your first task to get started'}
          </Typography>
            <Button
              variant="contained"
          onClick={onAddNewTask}
              sx={{
                textTransform: 'none',
                borderRadius: '8px',
                py: 1,
            px: 3,
              }}
            >
              Add New Task
            </Button>
      </Card>
    );
  }

  return (
          <>
            {todos.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
          onTodoUpdated={onTodoUpdate}
          onDelete={onDelete}
                filters={filters}
              />
            ))}

            {pagination.pages > 1 && (
              <Card sx={commonStyles.card}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Showing {((page - 1) * pagination.limit) + 1} to{' '}
                      {Math.min(page * pagination.limit, pagination.total)} of{' '}
                      {pagination.total} todos
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Select
                        value={pagination.limit.toString()}
                  onChange={onLimitChange}
                        size="small"
                        sx={{ minWidth: 100 }}
                      >
                        {[5, 10, 20, 50].map((value) => (
                          <MenuItem key={value} value={value}>
                            {value} per page
                          </MenuItem>
                        ))}
                      </Select>
                      <Pagination
                        count={pagination.pages}
                        page={page}
                  onChange={onPageChange}
                        color="primary"
                        showFirstButton
                        showLastButton
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}
          </>
  );
};

export default TodoList; 