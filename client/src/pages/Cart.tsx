import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Cart: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Shopping Cart
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Shopping cart will be implemented here.
        </Typography>
      </Box>
    </Container>
  );
};

export default Cart;