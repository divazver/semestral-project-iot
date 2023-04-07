import React from 'react';
import { Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';

const Page = () => (
  <Container sx={{ pt: 8, pb: 8 }}>
    <Outlet />
    <Box sx={{ mt: 5, textAlign: 'center' }}>
      &copy; 2023 parta <strong>hezkejch</strong> kluku.
    </Box>
  </Container>
);

export default Page;
