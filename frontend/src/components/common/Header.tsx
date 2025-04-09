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
    <Box sx={{
      ...commonStyles.header,
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: { xs: 'stretch', sm: 'center' },
      justifyContent: 'space-between',
      gap: { xs: 1, sm: 0 },
      p: { xs: 2, sm: 3 },
      mb: { xs: 2, sm: 3 },
      backgroundColor: 'background.paper',
      borderBottom: '1px solid',
      borderColor: 'divider'
    }}>
      <Typography 
        variant="h4" 
        component="h1"
        sx={{
          fontSize: { xs: '1.5rem', sm: '2rem' },
          textAlign: { xs: 'center', sm: 'left' },
          mb: { xs: 0, sm: 0 },
          lineHeight: 1.2
        }}
      >
        {title}
      </Typography>
      <Box sx={{ 
        display: 'flex',
        flexDirection: { xs: 'row', sm: 'row' },
        gap: 2,
        width: { xs: '100%', sm: 'auto' },
        justifyContent: { xs: 'center', sm: 'flex-start' }
      }}>
        {showAddButton && (
          <Button
            variant="contained"
            onClick={() => navigate('/todos/add')}
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              py: 1,
              px: { xs: 2, sm: 2 },
              width: { xs: '45%', sm: 'auto' },
              height: '36px',
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
              px: { xs: 2, sm: 2 },
              width: { xs: '45%', sm: 'auto' },
              minWidth: { sm: 'auto' },
              height: '36px',
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