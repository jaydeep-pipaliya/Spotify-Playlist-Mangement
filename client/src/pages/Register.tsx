import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import AccountCircle from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

// Validation schema using yup
const validationSchema = yup.object({
  username: yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
});

const Register = () => {
  const navigate = useNavigate();
  const [generalError, setGeneralError] = useState<string | null>(null); // State for general errors

  // Formik hook to handle form logic
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await axios.post('http://localhost:5000/api/auth/register', values);
        alert('Registration successful!');
        navigate('/login');
      } catch (error) {
        setGeneralError('Registration failed. Please try again.'); // Set the general error
      }
    },
  });

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(to right, #6a11cb, #2575fc)',
        padding: 4,
      }}
    >
      <Box
        mt={5}
        p={4}
        component={Paper}
        elevation={6}
        sx={{
          borderRadius: '16px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
          width: '100%', // Make the form slightly wider
          maxWidth: '500px', // Control the maximum width
        }}
      >
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#2575fc' }}>Register</Typography>
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', marginBottom: 2 }}>
            <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              label="Username"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
              fullWidth
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', marginBottom: 2 }}>
            <EmailIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              fullWidth
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', marginBottom: 2 }}>
            <LockIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              fullWidth
            />
          </Box>
          {generalError && ( // Display general error if it exists
            <Typography color="error" sx={{ mt: 2 }}>
              {generalError}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, backgroundColor: '#2575fc', color: '#fff', '&:hover': { backgroundColor: '#1e63db' } }}
          >
            Register
          </Button>
        </form>
        <Box mt={2} textAlign="center">
          <Typography variant="body2" sx={{ color: 'black' }}>
            Already have an account? <Link to="/login" style={{ color: 'green', textDecoration: 'none' }}>Login here</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
