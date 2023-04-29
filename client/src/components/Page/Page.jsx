import React from 'react';
import { Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from "components/Navbar/Navbar";

const navItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    logged: true,
  },
];

const Page = () => (<>
  <Navbar navItems={navItems}/>
  <Container sx={{ pt: 8, pb: 8 }}>
    <Outlet />
    <Box sx={{ mt: 5, textAlign: 'center' }}>
      &copy; 2023 parta <strong>hezkejch</strong> kluku.
    </Box>
  </Container>
</>);

export default Page;
