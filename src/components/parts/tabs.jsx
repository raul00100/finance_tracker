import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import RestoreIcon from "@mui/icons-material/Restore";
import BarChartIcon from "@mui/icons-material/BarChart";

export default function VerticalTabs() {
  const location = useLocation();

  // Map routes to tab indices
  const routeToIndex = {
    "/": 0,
    "/transaction": 1,
    "/story": 2,
    "/statistic": 3,
  };

  const indexToRoute = {
    0: "/",
    1: "/transaction",
    2: "/story",
    3: "/statistic",
  };

  // Determine the active tab based on the current route
  const currentTab = routeToIndex[location.pathname] || 0;

  const handleChange = (event, newValue) => {
    // Navigate to the corresponding route when a tab is clicked
    const newRoute = indexToRoute[newValue];
    window.history.pushState({}, "", newRoute); // Update the URL
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        display: "flex",
        backgroundColor: "#4316bf",
      }}
    >
      <Tabs
        orientation="vertical"
        variant="standard"
        value={currentTab}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        TabIndicatorProps={{
          sx: {
            backgroundColor: "white", // underline color for selected tab
            height: 3,
            left: 0,
            right: 0,
          },
        }}
      >
        <Tab
          label="Home Page"
          component={Link}
          to="/"
          icon={<HomeIcon />}
          iconPosition="end"
          sx={{
            fontFamily: "monospace",
            color: currentTab === 0 ? "#ffffff" : "#e3d5ff",
            fontWeight: currentTab === 0 ? 700 : 500,
            textDecoration: currentTab === 0 ? "underline" : "none",
            textUnderlineOffset: "6px",
            "&.Mui-selected": {
              color: "white",
              textDecoration: "underline",
              textUnderlineOffset: "6px",
            },
          }}
        />
        <Tab
          label="Add Note"
          component={Link}
          to="/transaction"
          icon={<ReceiptLongIcon />}
          iconPosition="end"
          sx={{
            fontFamily: "monospace",
            color: currentTab === 1 ? "#ffffff" : "#e3d5ff",
            fontWeight: currentTab === 1 ? 700 : 500,
            textDecoration: currentTab === 1 ? "underline" : "none",
            textUnderlineOffset: "6px",
            "&.Mui-selected": {
              color: "white",
              textDecoration: "underline",
              textUnderlineOffset: "6px",
            },
          }}
        />
        <Tab
          label="See Story"
          component={Link}
          to="/story"
          icon={<RestoreIcon />}
          iconPosition="end"
          sx={{
            fontFamily: "monospace",
            color: currentTab === 2 ? "#ffffff" : "#e3d5ff",
            fontWeight: currentTab === 2 ? 700 : 500,
            textDecoration: currentTab === 2 ? "underline" : "none",
            textUnderlineOffset: "6px",
            "&.Mui-selected": {
              color: "white",
              textDecoration: "underline",
              textUnderlineOffset: "6px",
            },
          }}
        />
        <Tab
          label="Statistic"
          component={Link}
          to="/statistic"
          icon={<BarChartIcon />}
          iconPosition="end"
          sx={{
            fontFamily: "monospace",
            color: currentTab === 3 ? "#ffffff" : "#e3d5ff",
            fontWeight: currentTab === 3 ? 700 : 500,
            textDecoration: currentTab === 3 ? "underline" : "none",
            textUnderlineOffset: "6px",
            "&.Mui-selected": {
              color: "white",
              textDecoration: "underline",
              textUnderlineOffset: "6px",
            },
          }}
        />
      </Tabs>
    </Box>
  );
}
