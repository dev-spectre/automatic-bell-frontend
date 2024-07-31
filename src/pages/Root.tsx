import { SideBar } from "@/components/SideBar";
import { Outlet } from "react-router-dom";

export function Root() {
  return (
    <>
      <SideBar />
      <div className="ml-50 min-h-[100dvh] bg-indigo-950">
        <Outlet />
      </div>
    </>
  );
}
