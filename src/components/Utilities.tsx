import { Link } from "react-router-dom";
import { ReactNodes, RegsiterNavLinkProps, FormHeadingProps } from "@/types";
import { EmergencyButton, ManualButton } from "./Buttons";

export function AccountRegisterFormContainer({ children }: ReactNodes) {
  return (
    <form className="mx-auto flex min-h-[33.4rem] max-w-md flex-col gap-4 rounded bg-eclipse-elixir-500 px-8 py-7">
      {children}
    </form>
  );
}

export function Form({ children }: ReactNodes) {
  return (
    <form className="rounded-md bg-eclipse-elixir-500 py-16">{children}</form>
  );
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
  return <hr className="border-t-slate-500" />;
}

export function ManualControl() {
  return (
    <div className="flex gap-2">
      <ManualButton />
      <EmergencyButton />
    </div>
  );
}
