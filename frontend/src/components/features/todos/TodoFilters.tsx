import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  InputAdornment,
  Tooltip,
  Switch,
  FormControlLabel,
  Chip,
  alpha,
  SelectChangeEvent
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import type { TodoFiltersProps, SortOptions } from '../../../types/todo';
import { STATUS_OPTIONS, CATEGORY_OPTIONS } from '../../../constants/todo';
import { theme } from '../../../theme';

const TodoFiltersComponent: React.FC<TodoFiltersProps> = ({ 
  filters, 
  onFilterChange,
  sortOptions,
  onSortChange 
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (
    field: keyof TodoFiltersProps['filters'],
    value: string[] | boolean | string
  ) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const handleSelectAll = (field: 'status' | 'category', options: string[]) => {
    onFilterChange({
      ...filters,
      [field]: filters[field].length === options.length ? [] : [...options]
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      status: [],
      category: [],
      search: '',
      showDeleted: false,
      dueDate: ''
    });
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    const [sortBy, sortOrder] = event.target.value.split('-');
    onSortChange({
      sortBy: sortBy as SortOptions['sortBy'],
      sortOrder: sortOrder as SortOptions['sortOrder']
    });
  };

  const hasActiveFilters = filters.status.length > 0 || 
    filters.category.length > 0 || 
    filters.search || 
    filters.showDeleted || 
    filters.dueDate;

  return (
    <Box sx={{ 
      position: 'sticky',
      top: 0,
      zIndex: 1,
      backgroundColor: 'background.paper',
      borderBottom: '1px solid',
      borderColor: 'divider',
      py: 0.1,
      px: 1,
      mb: 0.5,
      width: '100%'
    }}>
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 1 },
          alignItems: 'stretch',
          width: '100%',
          maxWidth: '100%',
          mx: 'auto',
          '& > *': {
            width: { xs: '100%', sm: 'auto' }
          }
        }}
      >
            <TextField
              label="Search tasks"
              size="small"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              sx={{ 
                flex: { xs: '1 1 auto', sm: 2 },
                mb: { xs: 1, sm: 0 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  backgroundColor: 'background.paper',
                  transition: 'all 0.2s',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'background.paper',
                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                  },
                },
                '& .MuiInputLabel-root': {
                  transform: 'translate(14px, 8px) scale(1)',
                  '&.Mui-focused': {
                    color: 'primary.main',
                    transform: 'translate(14px, -9px) scale(0.75)',
                  },
                  '&.MuiInputLabel-shrink': {
                    transform: 'translate(14px, -9px) scale(0.75)',
                  },
                },
                '& .MuiInputBase-input': {
                  py: 0,
                  px: 2,
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                },
              }}
              InputProps={{
                endAdornment: (
                  <>
                    <InputAdornment position="end" sx={{ mr: 0.5 }}>
                      <SearchIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                    </InputAdornment>
                    {filters.search && (
                      <InputAdornment position="end" sx={{ mr: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleFilterChange('search', '')}
                          sx={{ 
                            color: 'text.secondary',
                            p: 0.5,
                            '&:hover': {
                              color: 'error.main',
                              backgroundColor: alpha(theme.palette.error.main, 0.1),
                            }
                          }}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    )}
                  </>
                ),
              }}
            />

        <FormControl size="small" sx={{ width: { xs: '100%', sm: 200 }, mb: { xs: 1, sm: 0 } }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={`${sortOptions.sortBy}-${sortOptions.sortOrder}`}
            onChange={handleSortChange}
            label="Sort By"
          >
            <MenuItem value="createdAt-desc">Newest First</MenuItem>
            <MenuItem value="createdAt-asc">Oldest First</MenuItem>
            <MenuItem value="title-asc">Title (A-Z)</MenuItem>
            <MenuItem value="title-desc">Title (Z-A)</MenuItem>
            <MenuItem value="dueDate-asc">Due Date (Earliest)</MenuItem>
            <MenuItem value="dueDate-desc">Due Date (Latest)</MenuItem>
            <MenuItem value="category-asc">Category (A-Z)</MenuItem>
            <MenuItem value="category-desc">Category (Z-A)</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          flexShrink: 0,
          width: { xs: '100%', sm: 'auto' },
          justifyContent: { xs: 'space-between', sm: 'flex-start' },
          mb: { xs: 1, sm: 0 }
        }}>
          <Tooltip title={showFilters ? "Hide filters" : "Show filters"}>
            <IconButton
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                backgroundColor: showFilters ? 'primary.main' : 'transparent',
                color: showFilters ? 'white' : 'primary.main',
                border: '1px solid',
                borderColor: 'primary.main',
                '&:hover': {
                  backgroundColor: showFilters ? 'primary.dark' : alpha(theme.palette.primary.main, 0.1),
                },
                borderRadius: 1.5,
                p: 1,
                height: '36px',
                width: { xs: '48%', sm: 'auto' },
                display: 'flex',
                gap: 1,
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <FilterListIcon fontSize="small" />
              <span style={{ fontSize: '14px' }}>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            </IconButton>
          </Tooltip>
          {hasActiveFilters && (
            <Tooltip title="Clear all filters">
              <IconButton
                onClick={handleClearFilters}
                sx={{
                  color: 'error.main',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                  },
                  borderRadius: 1.5,
                  p: 1,
                  height: '36px',
                  width: { xs: '48%', sm: '36px' },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
          </Box>

          <Box sx={{ 
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            mt: 1
          }}>
            <FormControlLabel
              control={
                <Switch
                  checked={filters.showDeleted}
                  onChange={(e) => handleFilterChange('showDeleted', e.target.checked)}
                />
              }
              label="Show Deleted Tasks"
              sx={{ ml: 0 }}
            />
          </Box>

          <Collapse in={showFilters} timeout="auto" unmountOnExit>
        <Box sx={{ 
          width: '100%',
          mt: 1,
          display: 'flex',
          gap: 1,
          flexWrap: 'wrap'
        }}>
          <FormControl sx={{ width: 200 }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              multiple
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value as string[])}
              label="Status"
              renderValue={(selected) => (
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 0.5,
                  width: '100%',
                  maxHeight: '40px',
                  overflow: 'hidden',
                  '& .MuiChip-root': {
                    maxWidth: '90px'
                  }
                }}>
                  {(selected as string[]).map((value) => (
                    <Chip 
                      key={value} 
                      label={value} 
                      size="small"
                      sx={{
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                        '& .MuiChip-label': {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '70px',
                          color: 'primary.main'
                        },
                        '& .MuiChip-deleteIcon': {
                          color: 'primary.main',
                          '&:hover': {
                            color: 'primary.dark',
                          },
                        },
                      }}
                      onDelete={() => {
                        handleFilterChange('status', filters.status.filter(s => s !== value));
                      }}
                    />
                  ))}
                </Box>
              )}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 300,
                    width: 200,
                    '& .MuiMenuItem-root': {
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }
                  }
                }
              }}
            >
              <MenuItem>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectAll('status', [...STATUS_OPTIONS]);
                  }}
                  sx={{
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  {filters.status.length === STATUS_OPTIONS.length ? 'Unselect All' : 'Select All'}
                </Button>
              </MenuItem>
              {STATUS_OPTIONS.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ width: 200 }}>
            <InputLabel id="category-filter-label">Category</InputLabel>
            <Select
              labelId="category-filter-label"
              multiple
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value as string[])}
              label="Category"
              sx={{
                '& .MuiSelect-select': {
                  color: 'text.primary'
                }
              }}
              renderValue={(selected) => (
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 0.5,
                  width: '100%',
                  maxHeight: '40px',
                  overflow: 'hidden',
                  '& .MuiChip-root': {
                    maxWidth: '90px'
                  }
                }}>
                  {(selected as string[]).map((value) => (
                    <Chip 
                      key={value} 
                      label={value} 
                      size="small"
                      sx={{
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                        '& .MuiChip-label': {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '70px',
                          color: 'primary.main'
                        },
                        '& .MuiChip-deleteIcon': {
                          color: 'primary.main',
                          '&:hover': {
                            color: 'primary.dark',
                          },
                        },
                      }}
                      onDelete={() => {
                        handleFilterChange('category', filters.category.filter(c => c !== value));
                      }}
                    />
                  ))}
                </Box>
              )}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 300,
                    width: 200,
                    '& .MuiMenuItem-root': {
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }
                  }
                }
              }}
            >
              <MenuItem>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectAll('category', [...CATEGORY_OPTIONS]);
                  }}
                  sx={{
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  {filters.category.length === CATEGORY_OPTIONS.length ? 'Unselect All' : 'Select All'}
                </Button>
              </MenuItem>
              {CATEGORY_OPTIONS.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
          </Collapse>
    </Box>
  );
};

export default TodoFiltersComponent; 