import React from "react";
import PropTypes from "prop-types";

PieSkeleton.propTypes = {
  label: PropTypes.string.isRequired,
};

export default function PieSkeleton({ label }) {
  const angles = [1, 2.5, 4];
  return (
    <svg width="350" height="350" viewBox="0 0 350 350">
      <circle cx="175" cy="175" r="175" fill="#dbdfe5ff" />
      {angles.map((angle, i) => {
        const r = 195;
        const cx = 175;
        const cy = 175;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="#a1a1aa"
            strokeWidth="6"
          />
        );
      })}
      <text
        x="175"
        y="175"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="16"
        fontWeight="bold"
      >
        {label}
      </text>
    </svg>
  );
}
