import { Link } from "react-router-dom";
import {
  ReactNodes,
  RegsiterNavLinkProps,
  FormHeadingProps,
  CollapsibleSectionProps,
  FormProps,
} from "@/types";
import { EmergencyButton, ManualButton } from "./Buttons";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

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
      className="rounded-md bg-eclipse-elixir-500 py-12"
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
  return <hr className="my-7 border-t-hoki-600" />;
}

export function ManualControl() {
  return (
    <div className="flex flex-wrap gap-2">
      <ManualButton />
      <EmergencyButton />
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
      <div className={`overflow-y-hidden ${isCollapsed && "h-0"}`}>
        {children}
      </div>
    </section>
  );
}
