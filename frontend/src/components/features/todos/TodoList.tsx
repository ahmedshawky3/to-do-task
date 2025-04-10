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
import { useTheme } from '@mui/material/styles';

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
  const theme = useTheme();

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
      <>
        <Card sx={{ ...commonStyles.card, textAlign: 'center', p: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {filters.showDeleted ? 'No deleted tasks found' : 'No tasks found'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {filters.status.length > 0 || filters.category.length > 0 || filters.search
              ? 'Try adjusting your filters or search criteria'
              : filters.showDeleted 
                ? 'No tasks have been deleted yet'
                : 'Create your first task to get started'}
          </Typography>
          {!filters.showDeleted && (
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
          )}
        </Card>

        <Card sx={commonStyles.card}>
          <CardContent>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between', 
              alignItems: { xs: 'center', sm: 'center' },
              gap: { xs: 2, sm: 0 },
              mb: 2 
            }}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  textAlign: { xs: 'center', sm: 'left' },
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%'
                }}
              >
                Showing {((page - 1) * pagination.limit) + 1} to {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} todos
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', sm: 'flex-end' }
              }}>
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
                  sx={{
                    '& .MuiPaginationItem-root': {
                      minWidth: 30,
                      height: 30,
                      margin: '0 1px',
                      fontSize: '0.875rem',
                      [theme.breakpoints.down('sm')]: {
                        minWidth: 24,
                        height: 24,
                        margin: '0 0.5px',
                        fontSize: '0.75rem'
                      }
                    },
                    [theme.breakpoints.down('sm')]: {
                      '& .MuiPagination-ul': {
                        gap: '2px'
                      }
                    }
                  }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </>
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

      <Card sx={commonStyles.card}>
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'center', sm: 'center' },
            gap: { xs: 2, sm: 0 },
            mb: 2 
          }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                textAlign: { xs: 'center', sm: 'left' },
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%'
              }}
            >
              Showing {((page - 1) * pagination.limit) + 1} to {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} todos
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', sm: 'flex-end' }
            }}>
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
                sx={{
                  '& .MuiPaginationItem-root': {
                    minWidth: 30,
                    height: 30,
                    margin: '0 1px',
                    fontSize: '0.875rem',
                    [theme.breakpoints.down('sm')]: {
                      minWidth: 24,
                      height: 24,
                      margin: '0 0.5px',
                      fontSize: '0.75rem'
                    }
                  },
                  [theme.breakpoints.down('sm')]: {
                    '& .MuiPagination-ul': {
                      gap: '2px'
                    }
                  }
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default TodoList; 