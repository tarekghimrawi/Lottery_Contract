import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center">
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to ModernShop
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Discover amazing products at great prices
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/products"
          sx={{ mr: 2 }}
        >
          Shop Now
        </Button>
        <Button
          variant="outlined"
          size="large"
          component={Link}
          to="/products?featured=true"
        >
          Featured Products
        </Button>
      </Box>
    </Container>
  );
};

export default Home;