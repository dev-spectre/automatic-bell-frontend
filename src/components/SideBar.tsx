import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  NavItemProps,
  NavListProps,
  NavButtonProps,
  NavCollapsibleProps,
} from "@/types";
import dashboard from "@/assets/dashboard.png";
import manual from "@/assets/manual.png";
import instructions from "@/assets/instructions.png";
import logout from "@/assets/logout.png";
import schedule from "@/assets/schedule.png";
import settings from "@/assets/settings.png";
import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { closeSideBar } from "@/utilities/sideBar";

export function NavList({ children }: NavListProps) {
  return <ul className="flex flex-col gap-1">{children}</ul>;
}

export function NavLink({ label, link, icon }: NavItemProps) {
  const location = useLocation();
  const path = location.pathname;

  return (
    <li
      className={`group text-base font-normal ${link == path && "is-active"}`}
    >
      <Link
        onClick={closeSideBar}
        to={link}
        className="flex h-full w-full items-center gap-4 px-6 py-2 hover:bg-white/15 group-[.is-active]:bg-orange-450 group-[.is-active]:text-black"
      >
        <div className="w-4">
          <img
            className="h-4 group-[.is-active]:invert"
            src={icon}
            aria-label={label}
          />
        </div>
        {label}
      </Link>
    </li>
  );
}

export function NavButton({ label, onClick, icon }: NavButtonProps) {
  return (
    <li className="text-base font-normal">
      <button
        type="button"
        onClick={onClick}
        className="group flex h-full w-full items-center gap-4 px-6 py-2 hover:bg-white/15 active:bg-orange-450 active:text-black"
      >
        <div className="w-4">
          <img
            className="h-4 group-active:invert"
            src={icon}
            aria-label={label}
          />
        </div>
        {label}
      </button>
    </li>
  );
}

export function NavCollapsible({ label, icon, children }: NavCollapsibleProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="text-base font-normal">
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="group flex h-full w-full items-center gap-4 px-6 py-2 hover:bg-white/15 active:bg-orange-450 active:text-black"
      >
        <div className="w-4">
          <img
            className="h-4 group-active:invert"
            src={icon}
            aria-label={label}
          />
        </div>
        {label}
        <ChevronDown
          className={`w-6 -rotate-90 text-hoki-500 transition-transform ${!isCollapsed ? "rotate-0" : ""}`}
        />
      </button>
      {!isCollapsed && <div>{children}</div>}
    </div>
  );
}

export function NavLogout() {
  const navigate = useNavigate();

  return (
    <NavButton
      label={"Logout"}
      onClick={() => {
        localStorage.clear();
        sessionStorage.clear();
        navigate("/auth/login");
      }}
      icon={logout}
    />
  );
}

export function SideBar() {
  return (
    <>
      <aside
        id="nav"
        className="peer fixed bottom-0 left-0 top-0 z-20 w-60 bg-eclipse-elixir-500 max-md:-translate-x-60 max-md:transition-transform md:block"
      >
        <button
          onClick={closeSideBar}
          className="absolute right-4 top-4 md:hidden"
        >
          <X className="pointer-events-none" />
        </button>
        <nav>
          <h3 className="mb-9 mt-7 text-center text-xl font-semibold">
            Bell Scheduler
          </h3>
          <NavList>
            <NavLink label={"Dashboard"} link={"/"} icon={dashboard} />
            <NavCollapsible label="Schedule" icon={schedule}>
              <NavLink
                label="Create Schedule"
                link={"/schedule/create"}
                icon={""}
              />
              <NavLink
                label="Assign Schedule"
                link={"/schedule/assign"}
                icon={""}
              />
              <NavLink
                label="Edit Schedule"
                link={"/schedule/edit"}
                icon={""}
              />
            </NavCollapsible>
            <NavLink label={"Manual"} link={"/manual"} icon={manual} />
            <NavLink
              label={"Instructions"}
              link={"/instructions"}
              icon={instructions}
            />
            <NavLink label={"Settings"} link={"/settings"} icon={settings} />
            <NavLogout />
          </NavList>
        </nav>
      </aside>
      <div
        onClick={closeSideBar}
        className="inset-0 z-10 block bg-black/55 peer-[:not(.max-md\:-translate-x-60)]:fixed md:hidden"
      ></div>
    </>
  );
}
