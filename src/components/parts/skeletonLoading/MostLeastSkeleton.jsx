import React from "react";
import generalStyle from "../../css/generalStyle";

const { innerSkeleton, outerSkeleton } = generalStyle;

export default function MostLeastSkeleton() {
  return (
    <div className={`${outerSkeleton} w-[360px] `}>
      <div className={`${innerSkeleton} space-y-4`}>
        <div className="font-semibold mb-1">
          <p>No transactions yet, add one</p>
        </div>
        <div className="h-2 bg-gray-300 rounded w-1/3 mb-2 mt-1"></div>
        <div className="h-2 bg-gray-300 rounded w-1/3 mb-2 mt-1"></div>
        <div className="h-2 bg-gray-300 rounded w-1/2 mb-2 mt-1 mb-4"></div>
        <div className="border-b-3"></div>
        <div className="h-3 bg-gray-300 rounded w-[200px] mt-1"></div>
        <div className="h-2 bg-gray-300 rounded w-1/3 mt-1"></div>
      </div>
    </div>
  );
}
