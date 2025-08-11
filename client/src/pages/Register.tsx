import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Register: React.FC = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Registration form will be implemented here.
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;