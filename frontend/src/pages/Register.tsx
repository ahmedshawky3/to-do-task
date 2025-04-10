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
import { RegisterForm } from '../types/auth';
import RegisterFormComponent from '../components/features/auth/RegisterForm';

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

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Partial<RegisterForm>>({});
  const [loading, setLoading] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof RegisterForm]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterForm> = {};
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      try {
        const { confirmPassword, ...registerData } = formData;
        const response = await axios.post('/auth/register', registerData);
        
        // Save token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Navigate to welcome page
        navigate('/');
      } catch (error: any) {
        console.error('Registration error:', error.response?.data);
        setErrors({
          email: error.response?.data?.message || 'Registration failed'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={styles.pageContainer}>
        <Container maxWidth="sm">
          <Paper elevation={0} sx={styles.paper}>
            <RegisterFormComponent
              formData={formData}
              errors={errors}
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

export default Register;