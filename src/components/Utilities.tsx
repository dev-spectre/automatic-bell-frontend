import { Link } from "react-router-dom";
import {
  ReactNodes,
  RegsiterNavLinkProps,
  FormHeadingProps,
  CollapsibleSectionProps,
  FormProps,
  PageHeaderProps,
} from "@/types";
import { EmergencyButton, ManualButton, MenuButton } from "./Buttons";
import { useState } from "react";
import { Bell, ChevronDown } from "lucide-react";

export function AccountRegisterFormContainer({ children }: ReactNodes) {
  return (
    <form className="mx-auto flex min-h-[33.4rem] max-w-md flex-col gap-4 rounded bg-eclipse-elixir-500 px-8 py-7">
      {children}
    </form>
  );
}

export function Form({ children, handleSubmit }: FormProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-md bg-eclipse-elixir-500 pb-12 pt-4"
    >
      {children}
    </form>
  );
}

export function FormSection({ children }: ReactNodes) {
  return <section className="px-7">{children}</section>;
}

export function RegisterNavLink({
  label,
  linkText,
  link,
}: RegsiterNavLinkProps) {
  return (
    <p className="-mt-2 text-center text-white">
      {label}{" "}
      <Link className="text-orange-450" to={link}>
        {linkText}
      </Link>
    </p>
  );
}

export function RegisterFormHeading({ text }: FormHeadingProps) {
  return <h2 className="mb-2 text-2xl font-medium text-white">{text}</h2>;
}

export function HorizontalLine() {
  return <hr className="mb-7 mt-2 border-t-hoki-600" />;
}

export function ManualControl() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="max-lg:relative">
      <button
        onClick={() => setIsCollapsed((value) => !value)}
        className="rounded-full border border-hoki-600 bg-eclipse-elixir-400 p-2 lg:hidden"
      >
        <Bell />
      </button>
      <div
        className={`right-0 top-12 flex flex-wrap max-lg:absolute max-lg:flex-col lg:gap-2 ${isCollapsed && "max-lg:hidden"}`}
      >
        <ManualButton />
        <EmergencyButton />
      </div>
    </div>
  );
}

export function CollapsibleSection({
  label,
  children,
}: CollapsibleSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  return (
    <section>
      <h2 className="font-semibold">
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex h-full w-full items-center py-2"
        >
          {label}
          <ChevronDown
            className={`ml-4 w-6 -rotate-90 transition-transform ${!isCollapsed ? "rotate-0" : ""}`}
          />
        </button>
      </h2>
      <div className={`${isCollapsed && "h-0 opacity-0"}`}>{children}</div>
    </section>
  );
}

export function PageHeader({ label }: PageHeaderProps) {
  return (
    <header className="mb-7 flex items-center justify-between gap-2">
      <div className="flex gap-2">
        <MenuButton />
        <h2 className="text-lg sm:text-xl md:text-2xl">{label}</h2>
      </div>
      <ManualControl />
    </header>
  );
}
