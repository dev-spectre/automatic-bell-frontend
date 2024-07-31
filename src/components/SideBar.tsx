import { Link, useNavigate } from "react-router-dom";
import {
  NavItemProps,
  NavListProps,
  NavButtonProps,
  NavCollapsibleProps,
} from "@/types";
import dashboard from "@/assets/dashboard.png";
import emergency from "@/assets/emergency.png";
import manual from "@/assets/manual.png";
import instructions from "@/assets/instructions.png";
import details from "@/assets/details.png";
import logout from "@/assets/logout.png";
import schedule from "@/assets/schedule.png";
import settings from "@/assets/settings.png";
import expand from "@/assets/expand.svg";
import { useState } from "react";

export function NavList({ children }: NavListProps) {
  return <ul className="flex flex-col gap-1">{children}</ul>;
}

export function NavLink({ label, link, icon }: NavItemProps) {
  return (
    <li className="text-base font-normal">
      <Link
        to={link}
        className="flex h-full w-full items-center gap-4 px-6 py-2 hover:bg-white/15 active:bg-orange-400"
      >
        <div className="w-4">
          <img className="h-4" src={icon} aria-label={label} />
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
        className="flex h-full w-full items-center gap-4 px-6 py-2 hover:bg-white/15 active:bg-orange-400"
      >
        <div className="w-4">
          <img className="h-4" src={icon} aria-label={label} />
        </div>
        {label}
      </button>
    </li>
  );
}

export function NavCollapsible({ label, icon, children }: NavCollapsibleProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  return (
    <li className="text-base font-normal">
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex h-full w-full items-center gap-4 px-6 py-2 hover:bg-white/15 active:bg-orange-400"
      >
        <div className="w-4">
          <img className="h-4" src={icon} aria-label={label} />
        </div>
        {label}
        <img className="w-4" src={expand} alt="expand" />
      </button>
      {!isCollapsed && <div>{children}</div>}
    </li>
  );
}

export function NavLogout() {
  const navigate = useNavigate();

  return (
    <NavButton
      label={"Logout"}
      onClick={() => {
        localStorage.clear();
        navigate("auth/signin");
      }}
      icon={logout}
    />
  );
}

export function SideBar() {
  return (
    <aside className="fixed bottom-0 left-0 top-0 w-60 bg-slate-800">
      <nav>
        <h3 className="mb-9 mt-5 text-center text-lg font-medium">
          Bell Scheduler
        </h3>
        <NavList>
          <NavLink label={"Dashboard"} link={"/"} icon={dashboard} />
          <NavCollapsible label="Schedule" icon={schedule}>
            <NavLink
              label="Create Schedule"
              link={"schedule/create"}
              icon={""}
            />
            <NavLink
              label="Assign Schedule"
              link={"schedule/assign"}
              icon={""}
            />
            <NavLink label="Edit Schedule" link={"schedule/edit"} icon={""} />
          </NavCollapsible>
          <NavLink label={"Details"} link={"details"} icon={details} />
          <NavLink label={"Manual"} link={"manual"} icon={manual} />
          <NavLink label={"Emergency"} link={"emergency"} icon={emergency} />
          <NavLink
            label={"Instructions"}
            link={"instructions"}
            icon={instructions}
          />
          <NavLink label={"Settings"} link={"settings"} icon={settings} />
          <NavLogout />
        </NavList>
      </nav>
    </aside>
  );
}
