import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import PropTypes from "prop-types";

export default function FormSelectGroup({
  //   label,
  value,
  onChange,
  options,
  required = true,
  selectLabel = "Select:",
  menuItemNone = true,
  formControlSx = {
    border: "2px solid black",
    height: "44px",
    width: 327,
    marginLeft: 1,
    boxShadow: "4px 4px 0px 0px #000",
    fontSize: "1.125rem",
    fontWeight: 500,
    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "& .Mui-focused": {
      boxShadow: "none",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
  },
  inputLabelSx = {
    "&.MuiInputLabel-shrink": { top: 1 },
    top: 1,
    background: "#f1f2f6",
    px: 0.5,
  },
  ...rest
}) {
  return (
    <div>
      {/* <label>{label}</label> */}
      <FormControl size="small" className="w-80" sx={formControlSx}>
        <InputLabel id="demo-select-small-label" sx={inputLabelSx}>
          {selectLabel}
        </InputLabel>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={value}
          //   label={label}
          onChange={onChange}
          required={required}
          {...rest}
        >
          {menuItemNone && (
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
          )}
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

FormSelectGroup.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  required: PropTypes.bool,
  selectLabel: PropTypes.string,
  menuItemNone: PropTypes.bool,
  formControlSx: PropTypes.object,
  inputLabelSx: PropTypes.object,
};
