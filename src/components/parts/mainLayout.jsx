import React from "react";
import VerticalTabs from "./tabs";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="bg-[#EFEFEF] h-screen flex">
      <div className="flex mr-[50px] w-[180px]">
        <VerticalTabs />
      </div>
      <div className="overflow-auto w-screen">
        <Outlet />
      </div>
    </div>
  );
}
