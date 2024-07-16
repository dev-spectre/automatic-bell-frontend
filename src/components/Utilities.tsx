import { Link } from "react-router-dom";
import { ReactNodes, RegsiterNavLinkProps, FormHeadingProps } from "@/types";

export function AccountRegisterFormContainer({ children }: ReactNodes) {
  return (
    <form className="flex min-h-[33.4rem] max-w-md flex-col gap-4 rounded bg-navy-800 px-8 py-7">
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
    <p className="-mt-2 text-center text-white">
      {label}{" "}
      <Link className="text-orange-400" to={link}>
        {linkText}
      </Link>
    </p>
  );
}

export function RegisterFormHeading({ text }: FormHeadingProps) {
  return <h2 className="mb-2 text-2xl font-medium text-white">{text}</h2>;
}
