import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import Login from './pages/Login';
import Register from './pages/Register';
import Main from './pages/Main';
import AddTask from './pages/AddTask';
import PrivateRoute from './components/features/auth/PrivateRoute';
import './App.css';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/todos" element={<PrivateRoute><Main /></PrivateRoute>} />
          <Route path="/todos/add" element={<PrivateRoute><AddTask /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/todos" replace />} />
          <Route 
            path="*" 
            element={<Navigate to="/login" replace />} 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;