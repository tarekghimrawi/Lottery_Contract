import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const ProductDetail: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Product Detail
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Product detail page will be implemented here.
        </Typography>
      </Box>
    </Container>
  );
};

export default ProductDetail;