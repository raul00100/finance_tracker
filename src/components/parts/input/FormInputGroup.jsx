import React from "react";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";

export default function FormInputGroup({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  inputSx = {
    border: "2px solid black",
    height: "44px",
    width: 327,
    marginLeft: 1,
    boxShadow: "4px 4px 0px 0px #000",
    fontSize: "1.125rem",
    fontWeight: 500,
    paddingLeft: 2,
    "& .MuiInputBase-input": {
      paddingTop: "8px",
      fontSize: "18px",
      fontWeight: 500,
      marginLeft: "-12px",
    },
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
  ...rest
}) {
  return (
    <div>
      <label>{label}</label>
      <TextField
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        sx={inputSx}
        {...rest}
      />
    </div>
  );
}

FormInputGroup.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  required: PropTypes.bool,
  inputSx: PropTypes.object,
};
