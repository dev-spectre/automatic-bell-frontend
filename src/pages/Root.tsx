import { MenuButton } from "@/components/Buttons";
import { SideBar } from "@/components/SideBar";
import { Outlet } from "react-router-dom";

export function Root() {
  return (
    <>
      <SideBar />
      <div className="min-h-[100dvh] bg-corbeau-600 px-16 py-11 md:ml-60">
        <Outlet />
      </div>
    </>
  );
}
