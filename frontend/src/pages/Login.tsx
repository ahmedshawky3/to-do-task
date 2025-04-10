import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  ThemeProvider,
  createTheme
} from '@mui/material';
import axios from '../api/axios';
import { LoginForm } from '../types/auth';
import LoginFormComponent from '../components/features/auth/LoginForm';

// Common theme and styles
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Material UI blue
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },
    MuiButton: {
      defaultProps: {
        variant: 'contained',
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          padding: '12px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
  },
});

// Common styles object
const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    py: 4, // padding top and bottom
    backgroundColor: '#f5f5f5'
  },
  paper: {
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '450px',
    mx: 'auto', // margin left and right auto
    boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)'
  }
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/auth/login', formData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/todos', { replace: true });
      } else {
        setError('Login failed: No token received');
      }
    } catch (err: any) {
      // Only log server errors (500s) to console
      if (err.response?.status >= 500) {
        console.error('Server error during login:', err);
      }
      setError(err.response?.data?.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={styles.pageContainer}>
        <Container maxWidth="sm">
          <Paper elevation={0} sx={styles.paper}>
            <LoginFormComponent
              formData={formData}
              error={error}
              loading={loading}
              onFormChange={handleFormChange}
              onSubmit={handleSubmit}
            />
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Login;