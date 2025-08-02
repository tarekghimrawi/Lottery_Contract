import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const OrderDetail: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Order Detail
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Order detail page will be implemented here.
        </Typography>
      </Box>
    </Container>
  );
};

export default OrderDetail;