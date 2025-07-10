import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function TransactionTabs({ tabValue, handleTabChange, panels }) {
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="transaction tabs"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600, // Make all tab labels thicker
            },
            '& .MuiTab-root.Mui-selected': {
              color: '#6366f1', // Tailwind indigo-500 hex
              fontWeight: 700, // Even bolder for selected tab
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#6366f1', // indicator color
            },
          }}
        >
          <Tab label="All" {...a11yProps(0)} />
          <Tab label="Income" {...a11yProps(1)} />
          <Tab label="Expenses" {...a11yProps(2)} />
        </Tabs>
      </Box>
      {panels.map((panel, idx) => (
        <CustomTabPanel value={tabValue} index={idx} key={idx}>
          {panel}
        </CustomTabPanel>
      ))}
    </Box>
  );
}