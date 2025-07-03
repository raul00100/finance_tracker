import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Link, useLocation } from 'react-router-dom';

function VerticalTabs() {
  const location = useLocation();

  // Map routes to tab indices
  const routeToIndex = {
    '/': 0,
    '/transaction': 1,
    '/story': 2,
    '/statistic': 3,
  };

  const indexToRoute = {
    0: '/',
    1: '/transaction',
    2: '/story',
    3: '/statistic',
  };

  // Determine the active tab based on the current route
  const currentTab = routeToIndex[location.pathname] || 0;

  const handleChange = (event, newValue) => {
    // Navigate to the corresponding route when a tab is clicked
    const newRoute = indexToRoute[newValue];
    window.history.pushState({}, '', newRoute); // Update the URL
  };

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' }}
    >
      <Tabs
        orientation="vertical"
        variant="standard"
        value={currentTab}
        onChange={handleChange}
        aria-label="Vertical tabs example" // Set a fixed width
      >
        <Tab label="Home Page" component={Link} to="/" />
        <Tab label="Transaction" component={Link} to="/transaction" />
        <Tab label="See Story" component={Link} to="/story" />
        <Tab label="Statistic" component={Link} to="/statistic" />
      </Tabs>
    </Box>
  );
}

export default VerticalTabs;