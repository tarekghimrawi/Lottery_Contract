import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              ModernShop
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Your one-stop destination for quality products at great prices. 
              We're committed to providing excellent service and customer satisfaction.
            </Typography>
            <Box>
              <IconButton color="inherit" size="small">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" size="small">
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link
                component={RouterLink}
                to="/products"
                color="inherit"
                underline="hover"
                sx={{ mb: 1 }}
              >
                All Products
              </Link>
              <Link
                component={RouterLink}
                to="/products?featured=true"
                color="inherit"
                underline="hover"
                sx={{ mb: 1 }}
              >
                Featured Products
              </Link>
              <Link
                component={RouterLink}
                to="/products?category=electronics"
                color="inherit"
                underline="hover"
                sx={{ mb: 1 }}
              >
                Electronics
              </Link>
              <Link
                component={RouterLink}
                to="/products?category=clothing"
                color="inherit"
                underline="hover"
                sx={{ mb: 1 }}
              >
                Clothing
              </Link>
              <Link
                component={RouterLink}
                to="/products?category=home"
                color="inherit"
                underline="hover"
                sx={{ mb: 1 }}
              >
                Home & Garden
              </Link>
            </Box>
          </Grid>

          {/* Customer Service */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Customer Service
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link
                href="#"
                color="inherit"
                underline="hover"
                sx={{ mb: 1 }}
              >
                Contact Us
              </Link>
              <Link
                href="#"
                color="inherit"
                underline="hover"
                sx={{ mb: 1 }}
              >
                FAQ
              </Link>
              <Link
                href="#"
                color="inherit"
                underline="hover"
                sx={{ mb: 1 }}
              >
                Shipping & Returns
              </Link>
              <Link
                href="#"
                color="inherit"
                underline="hover"
                sx={{ mb: 1 }}
              >
                Size Guide
              </Link>
              <Link
                href="#"
                color="inherit"
                underline="hover"
                sx={{ mb: 1 }}
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                color="inherit"
                underline="hover"
                sx={{ mb: 1 }}
              >
                Terms of Service
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact Info
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOn sx={{ mr: 1, fontSize: 'small' }} />
                <Typography variant="body2">
                  123 Commerce Street<br />
                  New York, NY 10001
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Phone sx={{ mr: 1, fontSize: 'small' }} />
                <Typography variant="body2">
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Email sx={{ mr: 1, fontSize: 'small' }} />
                <Typography variant="body2">
                  support@modernshop.com
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }}>
              <strong>Business Hours:</strong><br />
              Mon-Fri: 9:00 AM - 6:00 PM<br />
              Sat-Sun: 10:00 AM - 4:00 PM
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.3)' }} />

        {/* Bottom Row */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="body2">
              © 2024 ModernShop. All rights reserved.
            </Typography>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link href="#" color="inherit" underline="hover" variant="body2">
                Privacy Policy
              </Link>
              <Link href="#" color="inherit" underline="hover" variant="body2">
                Terms of Service
              </Link>
              <Link href="#" color="inherit" underline="hover" variant="body2">
                Cookie Policy
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;