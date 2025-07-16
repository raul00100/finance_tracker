import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";

FormSelect.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  sx: PropTypes.object,
  className: PropTypes.string,
};

export default function FormSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select",
  sx = {},
  className = "",
}) {
  return (
    <FormControl sx={{ ...sx }} size="small" className={`w-80 ${className}`}>
      <InputLabel
        id={`${label}-label`}
        sx={{
          // Add top margin when label is shrunk (floating)
          "&.MuiInputLabel-shrink": {
            top: 1, // adjust this value for more/less gap
          },
          // Optionally, adjust default position too
          top: 1,
          background: "#f1f2f6", // optional, for better contrast
          px: 0.5, // optional, horizontal padding
        }}
      >
        {placeholder}
      </InputLabel>
      <Select
        labelId={`${label}-label`}
        id={`${label}-select`}
        value={value}
        label={label}
        onChange={onChange}
        required
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
