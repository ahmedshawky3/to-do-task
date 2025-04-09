import { useState, useCallback } from 'react';
import axios from '../api/axios';
import { Todo, TodoFilters, PaginationData, SortOptions } from '../types/todo';
import { DEFAULT_PAGINATION, DEFAULT_FILTERS } from '../constants/todo';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState<PaginationData>(DEFAULT_PAGINATION);
  const [filters, setFilters] = useState<TodoFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOptions>({
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const fetchTodos = useCallback(async (page: number) => {
    try {
      setLoading(true);
      const response = await axios.get('/todos', {
        params: {
          page,
          limit: pagination.limit,
          ...filters,
          ...sort
        }
      });
      setTodos(response.data.data);
      setPagination(response.data.pagination);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  }, [pagination.limit, filters, sort]);

  const updateTodo = useCallback(async (id: string, data: Partial<Todo>) => {
    try {
      const response = await axios.put(`/todos/${id}`, data);
      setTodos(prev => prev.map(todo => 
        todo._id === id ? response.data.data : todo
      ));
      return response.data.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update todo');
    }
  }, []);

  const deleteTodo = useCallback(async (id: string) => {
    try {
      const response = await axios.delete(`/todos/${id}`);
      setTodos(prev => prev.filter(todo => todo._id !== id));
      return response.data.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete todo');
    }
  }, []);

  const restoreTodo = useCallback(async (id: string) => {
    try {
      const response = await axios.patch(`/todos/${id}/restore`);
      setTodos(prev => prev.map(todo => 
        todo._id === id ? response.data.data : todo
      ));
      return response.data.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to restore todo');
    }
  }, []);

  return {
    todos,
    loading,
    error,
    pagination,
    filters,
    sort,
    fetchTodos,
    updateTodo,
    deleteTodo,
    restoreTodo,
    setFilters,
    setSort
  };
}; 