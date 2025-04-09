import axios from '../api/axios';
import { Todo, TodoFilters, SortOptions } from '../types/todo';

export const todoService = {
  async getTodos(params: {
    page: number;
    limit: number;
    filters: TodoFilters;
    sortOptions: SortOptions;
  }) {
    const response = await axios.get('/todos', { params });
    return response.data;
  },

  async createTodo(todo: Omit<Todo, '_id' | 'createdAt' | 'isDeleted'>) {
    const response = await axios.post('/todos', todo);
    return response.data;
  },

  async updateTodo(id: string, todo: Partial<Todo>) {
    const response = await axios.put(`/todos/${id}`, todo);
    return response.data;
  },

  async deleteTodo(id: string) {
    const response = await axios.delete(`/todos/${id}`);
    return response.data;
  },

  async restoreTodo(id: string) {
    const response = await axios.patch(`/todos/${id}/restore`);
    return response.data;
  },

  async updateStatus(id: string, status: Todo['status']) {
    const response = await axios.patch(`/todos/${id}/status`, { status });
    return response.data;
  }
}; 