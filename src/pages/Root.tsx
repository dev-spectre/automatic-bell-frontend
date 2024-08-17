import { SideBar } from "@/components/SideBar";
import { useAuthorizeSession } from "@/hooks/auth";
import { Outlet } from "react-router-dom";

export function Root() {
  useAuthorizeSession();

  return (
    <>
      <SideBar />
      <div className="min-h-[100dvh] bg-corbeau-600 px-5 py-11 md:ml-60 md:px-16">
        <Outlet />
      </div>
    </>
  );
}
