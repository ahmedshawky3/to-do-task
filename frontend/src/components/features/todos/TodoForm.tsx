import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert
} from '@mui/material';
import axios from '../../../api/axios';
import { commonStyles } from '../../../theme';
import { CATEGORIES } from '../../../constants/todo';

interface TodoFormProps {
  onTodoCreated: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onTodoCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'work',
    dueDate: '',
    status: 'pending'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.category) {
      setError('Category is required');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/todos', formData);
      setFormData({
        title: '',
        description: '',
        category: 'work',
        dueDate: '',
        status: 'pending'
      });
      setError('');
      onTodoCreated();
    } catch (err: any) {
      console.error('Create todo error:', err);
      setError(err.response?.data?.message || 'Failed to create todo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
        Add New Task
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 1, py: 0.5 }}>
          {error}
        </Alert>
      )}

      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          fullWidth
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={!!error}
          helperText={error}
          sx={commonStyles.input}
        />
        <TextField
          fullWidth
          label="Description"
          multiline
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          sx={commonStyles.input}
        />
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={formData.category}
            label="Category"
            onChange={(e) => setFormData({ ...formData, category: e.target.value as string })}
            sx={commonStyles.input}
          >
            {CATEGORIES.map((category) => (
              <MenuItem key={category.value} value={category.value}>
                <Box>
                  <Typography>{category.label}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {category.description}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          type="date"
          label="Due Date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          InputLabelProps={{ shrink: true }}
          sx={commonStyles.input}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            ...commonStyles.button,
            alignSelf: 'flex-end',
            minWidth: '120px'
          }}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Add Task'}
        </Button>
      </Box>
    </Box>
  );
};

export default TodoForm;