import { Outlet } from "react-router-dom";
import logo from "@/assets/logo.svg";

export function Register() {
  return (
    <div className="min-h-[100dvh] bg-navy-600 bg-gradient-to-b from-black via-dark-blue-300 via-50% to-navy-500 pt-10">
      <div className="container mx-auto items-center justify-center gap-10 px-5 md:flex md:justify-between xl:px-28">
        <div className="mb-5 max-w-2xl md:mb-0">
          <h1 className="text-5xl font-medium md:text-6xl lg:text-7xl">
            Bell Scheduler
          </h1>
          <div className="hidden md:block">
            <p className="mt-2 md:text-2xl lg:text-3xl">
              Create, Assign and Automate your bell schedule.
            </p>
            <div className="flex h-[470px] justify-center p-6">
              <img className="h-full" src={logo} alt="" />
            </div>
          </div>
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
