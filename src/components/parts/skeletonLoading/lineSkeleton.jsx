import React from "react";
import generalStyle from "../../css/generalStyle";

const { innerSkeleton, outerSkeleton } = generalStyle;

export default function LineSkeleton() {
  return (
    <div className={outerSkeleton}>
      <div className={innerSkeleton}>
        {/* X-axis label */}
        <div className="h-4 bg-gray-300 rounded w-1/3 h-6 mx-auto">
          <p className="font-semibold text-center">
            Not enough data to come up with statistic
          </p>
        </div>
        <div className="h-4 bg-gray-300 rounded w-1/5 h-6 mb-10 mt-5 mx-auto"></div>
        {/* Chart area */}
        <div className="flex-1 flex items-end">
          <div className="w-full h-110 bg-gray-200 rounded relative overflow-hidden">
            {/* Simulated line */}
            <div className="absolute left-0 bottom-20 w-full h-1/2">
              <svg width="100%" height="100%">
                <polyline
                  points="0,110 80,5 160,190 240,110 320,130 400,0 480,100 560,20 640,80 720,0 800,220 880,50 960,170 1040,100 1120,180 1200,10"
                  fill="none"
                  stroke="#d1d5db"
                  strokeWidth="4"
                  strokeDasharray="8 8"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
