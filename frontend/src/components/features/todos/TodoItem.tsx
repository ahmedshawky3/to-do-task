import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip,
  SelectChangeEvent,
  alpha
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Event as EventIcon,
  RestoreFromTrash as RestoreIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { TodoItemProps } from '../../../types/todo';
import { CATEGORY_COLORS, STATUS_COLORS, CATEGORY_OPTIONS, CategoryType, StatusType } from '../../../constants/todo';
import { formatDate, getDaysUntilDue } from '../../../utils/date';
import { todoService } from '../../../services/todoService';
import { theme, commonStyles } from '../../../theme';

const TodoItem: React.FC<TodoItemProps> = ({ todo, onTodoUpdated, onDelete, filters }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [localTodo, setLocalTodo] = useState(todo);
  const [editedTodo, setEditedTodo] = useState({
    title: todo.title,
    description: todo.description || '',
    category: todo.category as CategoryType,
    status: todo.status as StatusType,
    dueDate: todo.dueDate || ''
  });

  const handleStatusClick = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (loading || !localTodo || localTodo.isDeleted) {
      return;
    }

    const statusOrder = ['pending', 'in_progress', 'completed'] as const;
    const currentIndex = statusOrder.indexOf(localTodo.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    
    try {
      setLoading(true);
      const response = await todoService.updateStatus(localTodo._id, nextStatus);
      setLocalTodo(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
  };

  const handleSave = async () => {
    if (!editedTodo.title?.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setLoading(true);
      const response = await todoService.updateTodo(localTodo._id, editedTodo);
      if (response?.data) {
        setLocalTodo(response.data);
        setIsEditing(false);
        onTodoUpdated(response.data);
      } else {
        setError('Failed to update todo: No data received');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update todo');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await todoService.deleteTodo(localTodo._id);
      setLocalTodo(response.data);
      if (onDelete && !filters.showDeleted) {
        onDelete(localTodo._id);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete todo');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    try {
      setLoading(true);
      const response = await todoService.restoreTodo(todo._id);
      setLocalTodo(response.data);
      if (onDelete) {
        onDelete(todo._id);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to restore task');
    } finally {
      setLoading(false);
    }
  };

  if (!localTodo) {
    return null;
  }

  return (
    <Card sx={{
      ...commonStyles.todoItem,
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)'
      }
    }}>
      <CardContent sx={{ p: '24px !important' }}>
        {isEditing ? (
          <Box>
            {error && (
              <Typography 
                color="error" 
                sx={{ 
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: 'error.light',
                  color: 'error.dark',
                  p: 1,
                  borderRadius: 1,
                  fontSize: '0.875rem'
                }}
              >
                {error}
              </Typography>
            )}
            <TextField
              fullWidth
              label="Title"
              value={editedTodo.title}
              onChange={(e) => setEditedTodo({ ...editedTodo, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={editedTodo.description}
              onChange={(e) => setEditedTodo({ ...editedTodo, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={editedTodo.category}
                label="Category"
                onChange={(e: SelectChangeEvent) => setEditedTodo({ 
                  ...editedTodo, 
                  category: e.target.value as CategoryType
                })}
              >
                {CATEGORY_OPTIONS.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={editedTodo.status}
                label="Status"
                onChange={(e: SelectChangeEvent) => setEditedTodo({ 
                  ...editedTodo, 
                  status: e.target.value as StatusType
                })}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              type="date"
              label="Due Date"
              value={editedTodo.dueDate ? editedTodo.dueDate.split('T')[0] : ''}
              onChange={(e) => {
                const selectedDate = e.target.value;
                const today = new Date().toISOString().split('T')[0];
                if (selectedDate >= today) {
                  setEditedTodo({ ...editedTodo, dueDate: selectedDate });
                }
              }}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: new Date().toISOString().split('T')[0],
                max: "9999-12-31"
              }}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
              <Button 
                variant="outlined" 
                onClick={handleCancel} 
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  px: 3
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleSave} 
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none'
                  }
                }}
              >
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, width: '100%' }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: 1.5, 
                flex: 1,
                minWidth: 0,
                [theme.breakpoints.down('sm')]: {
                  flexDirection: 'column',
                  gap: 1
                }
              }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    wordBreak: 'break-word',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    [theme.breakpoints.down('sm')]: {
                      fontSize: '1rem',
                      WebkitLineClamp: 3,
                      width: '100%'
                    }
                  }}
                >
                  {localTodo.title}
                </Typography>
                {localTodo.dueDate && !localTodo.isDeleted && (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    flexWrap: 'wrap'
                  }}>
                    <Chip
                      label={formatDate(localTodo.dueDate)}
                      size="small"
                      icon={<EventIcon />}
                      color="default"
                      sx={{
                        borderRadius: '8px',
                        '& .MuiChip-label': {
                          px: 1
                        }
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: getDaysUntilDue(localTodo.dueDate) <= 0 ? 'error.main' : 'success.main',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.5,
                        bgcolor: getDaysUntilDue(localTodo.dueDate) <= 0 
                          ? alpha(theme.palette.error.main, 0.1)
                          : alpha(theme.palette.success.main, 0.1),
                        py: 0.5,
                        px: 1,
                        borderRadius: 1,
                        fontSize: '0.8125rem',
                        whiteSpace: 'nowrap',
                        minWidth: 'fit-content',
                        height: '100%',
                        lineHeight: 1.2
                      }}
                    >
                      <AccessTimeIcon fontSize="small" />
                      {getDaysUntilDue(localTodo.dueDate) <= 0
                        ? 'passed'
                        : `${getDaysUntilDue(localTodo.dueDate)} days left`}
                    </Typography>
                  </Box>
                )}
              </Box>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                flex: '0 0 auto',
                ml: 2,
                minWidth: 'fit-content'
              }}>
                <Tooltip title="Click to change status">
                  <Box 
                    onClick={!loading ? handleStatusClick : undefined} 
                    sx={{ 
                      cursor: loading ? 'wait' : 'pointer',
                      opacity: loading ? 0.7 : 1,
                      transition: 'all 0.2s'
                    }}
                  >
                    <Chip
                      label={localTodo.status === 'in_progress' ? 'In Progress' : localTodo.status.charAt(0).toUpperCase() + localTodo.status.slice(1)}
                      size="small"
                      color={STATUS_COLORS[localTodo.status] as 'warning' | 'info' | 'success'}
                      icon={localTodo.status === 'completed' ? <CheckCircleIcon /> : <PendingIcon />}
                      sx={{
                        minWidth: '100px',
                        justifyContent: 'center',
                        opacity: localTodo.isDeleted ? 0.5 : 1,
                        cursor: localTodo.isDeleted ? 'not-allowed' : 'pointer',
                        borderRadius: '8px',
                        transition: 'all 0.2s',
                        '&:hover': {
                          opacity: localTodo.isDeleted ? 0.5 : 0.85,
                          transform: 'scale(1.02)'
                        },
                      }}
                    />
                  </Box>
                </Tooltip>
              </Box>
            </Box>
            <Typography 
              color="text.secondary" 
              sx={{ 
                mb: 2,
                opacity: localTodo.isDeleted ? 0.6 : 0.87,
                fontSize: '0.9375rem',
                lineHeight: 1.5
              }}
            >
              {localTodo.description}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.75,
                  py: 0.5,
                  px: 1,
                  borderRadius: 1,
                  bgcolor: 'action.hover',
                  '&::before': {
                    content: '""',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: CATEGORY_COLORS[localTodo.category]
                  }
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{
                      color: 'text.primary',
                      fontSize: '0.8125rem',
                      fontWeight: 500
                    }}
                  >
                    {localTodo.category.charAt(0).toUpperCase() + localTodo.category.slice(1)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                ml: 'auto'
              }}>
                {!localTodo.isDeleted && (
                  <>
                    <Tooltip title="Edit">
                      <IconButton 
                        onClick={handleEdit} 
                        size="small"
                        sx={{ 
                          color: '#B8860B',
                          transition: 'all 0.2s',
                          '&:hover': {
                            color: '#DAA520',
                            transform: 'scale(1.1)',
                            bgcolor: 'rgba(218, 165, 32, 0.1)'
                          }
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        onClick={handleDelete} 
                        size="small"
                        sx={{ 
                          color: '#CD5C5C',
                          transition: 'all 0.2s',
                          '&:hover': {
                            color: '#DC143C',
                            transform: 'scale(1.1)',
                            bgcolor: 'rgba(220, 20, 60, 0.1)'
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
                {localTodo.isDeleted && (
                  <Tooltip title="Restore">
                    <IconButton 
                      onClick={handleRestore} 
                      size="small"
                      sx={{ 
                        color: '#2E8B57',
                        transition: 'all 0.2s',
                        '&:hover': {
                          color: '#3CB371',
                          transform: 'scale(1.1)',
                          bgcolor: 'rgba(60, 179, 113, 0.1)'
                        }
                      }}
                    >
                      <RestoreIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TodoItem; 