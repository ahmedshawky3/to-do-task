import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  SelectChangeEvent
} from '@mui/material';
import axios from '../api/axios';
import { commonStyles } from '../theme';
import { Todo, TodoFilters as TodoFiltersType, PaginationData, SortOptions } from '../types/todo';
import Header from '../components/common/Header';
import TodoFiltersComponent from '../components/features/todos/TodoFilters';
import TodoList from '../components/features/todos/TodoList';

const Main: React.FC = () => {
    const navigate = useNavigate();
    const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
    const [filters, setFilters] = useState<TodoFiltersType>({
    status: [],
    category: [],
    search: '',
    showDeleted: false
  });
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/todos', {
        params: {
          page,
          limit: pagination.limit,
          ...filters,
          ...sortOptions
        }
      });
      setTodos(response.data.data);
      setPagination(response.data.pagination);
      setError('');
    } catch (err: any) {
      if (err.response?.status === 401) {
        handleLogout();
      } else {
        setError('Failed to fetch todos');
      }
    } finally {
      setLoading(false);
    }
  }, [page, filters, handleLogout, pagination.limit, sortOptions]);

    useEffect(() => {
        fetchTodos();
  }, [fetchTodos]);

    const handleFilterChange = (newFilters: Partial<TodoFiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  };

    const handleSortChange = (newSortOptions: SortOptions) => {
        setSortOptions(newSortOptions);
    setPage(1); // Reset to first page when sort changes
  };

  const handleTodoUpdate = async () => {
    await fetchTodos(); // Refresh the list after update
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleDelete = (id: string) => {
    // Remove the item from the local state immediately
    setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
    };

    const handleLimitChange = (event: SelectChangeEvent) => {
        setPagination(prev => ({
            ...prev,
            limit: parseInt(event.target.value),
            pages: Math.ceil(prev.total / parseInt(event.target.value))
        }));
        setPage(1);
    };

    return (
    <Container maxWidth="md">
      <Box sx={{ py: 1 }}>
        <Header showAddButton={todos.length > 0} />
        
        <Box sx={{ 
          mb: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          p: 2
        }}>
          <TodoFiltersComponent 
            filters={filters}
            onFilterChange={handleFilterChange}
            sortOptions={sortOptions}
            onSortChange={handleSortChange}
          />
        </Box>

        <Card sx={{ 
          ...commonStyles.card,
          backgroundColor: 'grey.50'
        }}>
          <TodoList
            todos={todos}
            loading={loading}
            error={error}
            page={page}
            pagination={pagination}
            filters={filters}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            onTodoUpdate={handleTodoUpdate}
            onDelete={handleDelete}
            onAddNewTask={() => navigate('/todos/add')}
          />
        </Card>
      </Box>
    </Container>
    );
};

export default Main; 