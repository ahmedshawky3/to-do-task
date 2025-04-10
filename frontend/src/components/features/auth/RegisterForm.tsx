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
import type { RegisterForm as RegisterFormType } from '../../../types/auth';

interface RegisterFormProps {
  formData: RegisterFormType;
  errors: Partial<RegisterFormType>;
  loading: boolean;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  formData,
  errors,
  loading,
  onFormChange,
  onSubmit
}) => {
  return (
    <Box component="form" onSubmit={onSubmit} sx={commonStyles.form}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{ 
          fontWeight: 600,
          color: 'text.primary',
          mb: 3
        }}
      >
        Create Account
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          color: 'text.secondary',
          mb: 4,
          textAlign: 'center'
        }}
      >
        Sign up to get started
      </Typography>

      {Object.values(errors).some(error => error) && (
        <Alert 
          severity="error" 
          sx={{ 
            width: '100%', 
            mb: 2,
            borderRadius: '8px'
          }}
        >
          {Object.values(errors).find(error => error)}
        </Alert>
      )}

      <TextField
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={onFormChange}
        error={!!errors.name}
        helperText={errors.name}
        margin="normal"
        required
        sx={{ mb: 2 }}
      />

      <TextField
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={onFormChange}
        error={!!errors.email}
        helperText={errors.email}
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
        error={!!errors.password}
        helperText={errors.password}
        margin="normal"
        required
        sx={{ mb: 2 }}
      />

      <TextField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={onFormChange}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
        margin="normal"
        required
        sx={{ mb: 3 }}
      />

      <Button
        type="submit"
        disabled={loading}
        sx={commonStyles.submitButton}
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Link
            component={RouterLink}
            to="/login"
            sx={commonStyles.link}
          >
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterForm; 