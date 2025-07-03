import React from 'react';
import VerticalTabs from './tabs';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';

export default function MainLayout() {
  return (
    <Box sx={{display: 'flex', height: '100%'}}>
      <Box sx={{display: 'flex', marginRight: '50px', width: '150px'}}>
        <VerticalTabs />
      </Box>
      <Box sx={{width: '100%'}}>
        <Outlet />
      </Box>
    </Box>
  );
} 