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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Showing 0 to 0 of {pagination.total} todos
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

      <Card sx={{
        ...commonStyles.card,
        position: 'sticky',
        bottom: 0,
        zIndex: 1,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        transition: 'none',
        '&:hover': {
          transform: 'none',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }
      }}>
        <CardContent sx={{ py: 2, px: 1 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: 2,
            width: '100%'
          }}>
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              width: '100%'
            }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                width: '100%',
                justifyContent: 'center'
              }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    fontSize: '0.75rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {((page - 1) * pagination.limit) + 1}-{Math.min(page * pagination.limit, pagination.total)} of {pagination.total}
                </Typography>
                <Select
                  value={pagination.limit.toString()}
                  onChange={onLimitChange}
                  size="small"
                  sx={{ 
                    minWidth: 65,
                    height: 32,
                    '& .MuiSelect-select': {
                      py: 0.5,
                      px: 1
                    }
                  }}
                >
                  {[5, 10, 20, 50].map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Box sx={{ 
                width: '100%',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <Pagination
                  count={pagination.pages}
                  page={page}
                  onChange={onPageChange}
                  color="primary"
                  size="small"
                  siblingCount={0}
                  boundaryCount={1}
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
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default TodoList; 