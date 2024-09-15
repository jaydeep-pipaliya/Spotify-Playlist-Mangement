import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TextField, Button, Container, Typography, Box, Paper, Snackbar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login = () => {
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    setSuccessMessage('');

    if (!validateEmail(email)) {
        setEmailError('Please enter a valid email address.');
        return;
    }

    if (authContext) {
        try {
            // Call the login method and check the response
            const response = await authContext.login(email, password);

            if (response && response.status === 200) {
                // If login is successful, show success message
                setSuccessMessage('Login successful!');
                setTimeout(() => {
                    navigate('/');
                }, 2000); // Redirect after 2 seconds
            }
        } catch (error: any) {
            // Handle API response errors
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message); // Show "Invalid credentials" message
            } else {
                setError('Login failed. Please try again.');
            }
        }
    }
};

  


  const handleSnackbarClose = () => {
    setSuccessMessage('');
    navigate('/'); // Navigate to the dashboard page when the Snackbar closes
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(to right, #00c6ff, #0072ff)',
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
          width: '100%',
          maxWidth: '500px',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#0072ff' }}>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', marginBottom: 2 }}>
            <EmailIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              label="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError('');
              }}
              fullWidth
              required
              error={!!emailError}
              helperText={emailError}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', marginBottom: 2 }}>
            <LockIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />
          </Box>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: '#0072ff',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#005bb5',
              },
            }}
          >
            Login
          </Button>
        </form>
        <Box mt={2} textAlign="center">
          <Typography variant="body2" sx={{ color: 'black' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'darkgreen', textDecoration: 'none' }}>
              Register here
            </Link>
          </Typography>
        </Box>
      </Box>
      <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;
