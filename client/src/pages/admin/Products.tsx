import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const AdminProducts: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Products
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Admin product management will be implemented here.
        </Typography>
      </Box>
    </Container>
  );
};

export default AdminProducts;