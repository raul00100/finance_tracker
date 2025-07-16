import React from "react";
import generalStyle from "../../css/generalStyle";

const { outerSkeleton, innerSkeleton } = generalStyle;

export default function HomeSkeleton() {
  return (
    <div className={outerSkeleton} style={{ minWidth: 360, minHeight: 370 }}>
      <div className={`${innerSkeleton} space-y-4`}>
        <div className="h-5 bg-gray-300 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/3 mb-2 mx-auto mt-1"></div>
        <div className="h-50 mt-9 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
