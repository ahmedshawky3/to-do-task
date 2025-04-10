import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link
} from '@mui/material';
import { commonStyles } from '../../../theme';
import type { LoginForm as LoginFormType } from '../../../types/auth';

interface LoginFormProps {
  formData: LoginFormType;
  error: string;
  loading: boolean;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  formData,
  error,
  loading,
  onFormChange,
  onSubmit
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      sx={commonStyles.form}
      noValidate
    >
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{ 
          fontWeight: 600,
          color: 'text.primary',
          mb: 3,
          textAlign: 'center'
        }}
      >
        Welcome Back
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          color: 'text.secondary',
          mb: 4,
          textAlign: 'center'
        }}
      >
        Sign in to continue to your account
      </Typography>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            width: '100%', 
            mb: 2,
            borderRadius: '8px'
          }}
        >
          {error}
        </Alert>
      )}

      <TextField
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={onFormChange}
        margin="normal"
        required
        sx={{ mb: 2 }}
      />

      <TextField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={onFormChange}
        margin="normal"
        required
        sx={{ mb: 3 }}
      />

      <Button
        type="submit"
        disabled={loading}
        sx={commonStyles.submitButton}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Don't have an account?{' '}
          <Link
            component={RouterLink}
            to="/register"
            sx={commonStyles.link}
          >
            Register
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm; 