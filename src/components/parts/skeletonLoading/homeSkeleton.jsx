import React from "react";
import generalStyle from "../../css/generalStyle";

const { outerSkeleton, innerSkeleton } = generalStyle;
const addStyle = "mb-20 shadow-[4px_4px_0px_0px_#000]";

export default function HomeSkeleton() {
  return (
    <div className="flex flex-row gap-7 justify-center">
      <div className={`${outerSkeleton} ${addStyle}`}>
        <div className={`${innerSkeleton} space-y-4 w-[340px]`}>
          <div className="h-5 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-2 mx-auto mt-1"></div>
          <div className="h-50 mt-9 bg-gray-200 rounded"></div>
        </div>
      </div>

      <div className={`${outerSkeleton} ${addStyle}`}>
        <div className={`${innerSkeleton} space-y-4 w-[340px]`}>
          <div className="h-5 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-2 mx-auto mt-1"></div>
          <div className="h-50 mt-9 bg-gray-200 rounded"></div>
        </div>
      </div>

      <div className={`${outerSkeleton} ${addStyle}`}>
        <div className={`${innerSkeleton} space-y-4  w-[340px]`}>
          <div className="h-5 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-2 mx-auto mt-1"></div>
          <div className="h-50 mt-9 bg-gray-200 rounded"></div>
        </div>
      </div>

      <div className={`${outerSkeleton} ${addStyle}`}>
        <div className={`${innerSkeleton} space-y-4  w-[340px]`}>
          <div className="h-5 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-2 mx-auto mt-1"></div>
          <div className="h-50 mt-9 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
