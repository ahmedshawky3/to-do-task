import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { commonStyles } from '../../theme';

interface HeaderProps {
  title?: string;
  showAddButton?: boolean;
  showLogoutButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title = 'My Tasks',
  showAddButton = true,
  showLogoutButton = true 
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Box sx={commonStyles.header}>
      <Typography variant="h4" component="h1">
        {title}
      </Typography>
      <Box>
        {showAddButton && (
          <Button
            variant="contained"
            onClick={() => navigate('/todos/add')}
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              py: 1,
              px: 2,
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            Add New Task
          </Button>
        )}
        {showLogoutButton && (
          <Button
            variant="outlined"
            onClick={handleLogout}
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              py: 1,
              px: 2,
              ml: 2,
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Header; 