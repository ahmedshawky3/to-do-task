// Status-related constants
export const STATUS_OPTIONS = ['pending', 'in_progress', 'completed'] as const;
export type StatusType = typeof STATUS_OPTIONS[number];

export const STATUS_COLORS = {
  pending: 'error',
  in_progress: 'info',
  completed: 'success'
} as const;

export const STATUS_ICONS = {
  pending: 'PendingIcon',
  in_progress: 'AccessTimeIcon',
  completed: 'CheckCircleIcon'
} as const;

// Category-related constants
export const CATEGORY_OPTIONS = ['work', 'personal', 'shopping', 'health', 'other'] as const;
export type CategoryType = typeof CATEGORY_OPTIONS[number];

export const CATEGORY_COLORS = {
  work: '#4A90E2',
  personal: '#50E3C2',
  shopping: '#F5A623',
  health: '#D0021B',
  other: '#9013FE'
} as const;

export const CATEGORIES = [
  { value: 'work', label: 'Work', description: 'Tasks related to your job or professional work' },
  { value: 'personal', label: 'Personal', description: 'Personal tasks and errands' },
  { value: 'shopping', label: 'Shopping', description: 'Items to buy or shopping lists' },
  { value: 'health', label: 'Health', description: 'Health-related tasks and appointments' },
  { value: 'other', label: 'Other', description: 'Tasks that don\'t fit other categories' }
] as const;

// Pagination and filtering constants
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  total: 0,
  pages: 1
};

export const DEFAULT_FILTERS = {
  status: [] as StatusType[],
  category: [] as CategoryType[],
  search: '',
  showDeleted: false
};

export const DEFAULT_SORT = {
  field: 'createdAt' as const,
  order: 'desc' as const
}; 