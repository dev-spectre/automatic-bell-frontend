import { ReactNodes, RegsiterNavLinkProps } from "../types";

export function AccountRegisterFormContainer({ children }: ReactNodes) {
  return (
    <form className="flex max-w-md flex-col gap-4 rounded bg-navy-800 px-8 py-7">
      {children}
    </form>
  );
}

export function RegisterNavLink({
  label,
  linkText,
  link,
}: RegsiterNavLinkProps) {
  return (
    <p className="text-white text-center -mt-2">
      {label}{" "}
      <a className="text-orange-400" href={link}>
        {linkText}
      </a>
    </p>
  );
}
