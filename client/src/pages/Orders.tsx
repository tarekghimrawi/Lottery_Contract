import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Orders: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          My Orders
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Order history will be implemented here.
        </Typography>
      </Box>
    </Container>
  );
};

export default Orders;