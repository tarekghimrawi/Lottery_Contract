import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Products: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Products
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Product listings will be implemented here.
        </Typography>
      </Box>
    </Container>
  );
};

export default Products;