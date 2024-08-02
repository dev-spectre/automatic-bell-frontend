import { MenuButton } from "@/components/Buttons";
import { SideBar } from "@/components/SideBar";
import { Outlet } from "react-router-dom";

export function Root() {
  return (
    <>
      <SideBar />
      <div className="min-h-[100dvh] bg-indigo-950 md:ml-60">
      <MenuButton />
        <Outlet />
      </div>
    </>
  );
}
