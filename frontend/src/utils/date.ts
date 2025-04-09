export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const isOverdue = (dateString: string): boolean => {
  return new Date(dateString) < new Date();
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

export const getDaysUntilDue = (dateString: string): number => {
  const dueDate = new Date(dateString);
  const today = new Date();
  const diffTime = dueDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}; 