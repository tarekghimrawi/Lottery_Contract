import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const AdminOrders: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Orders
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Admin order management will be implemented here.
        </Typography>
      </Box>
    </Container>
  );
};

export default AdminOrders;