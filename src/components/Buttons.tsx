import { ButtonProps } from "@/types";
import { openSideBar } from "@/utilities/sideBar";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function RegisterButton({ label, onClick }: ButtonProps) {
  return (
    <button
      className="mt-2 rounded bg-orange-450 py-2 font-poppins font-medium text-black"
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export function MenuButton() {
  return (
    <button className="md:hidden" onClick={openSideBar}>
      <Menu />
    </button>
  );
}

export function Button({ label, onClick, className, type }: ButtonProps) {
  return (
    <button
      className={`min-w-44 rounded bg-orange-450 px-4 py-2 ${className}`}
      onClick={onClick}
      type={type || "button"}
    >
      {label}
    </button>
  );
}

export function ManualButton() {
  const navigate = useNavigate();

  return (
    <Button
      label="Manual"
      className="outline-1 outline-hoki-600 max-lg:min-w-min max-lg:rounded-none max-lg:bg-eclipse-elixir-400 max-lg:outline max-lg:hover:bg-hoki-800 max-lg:active:bg-orange-450 max-lg:active:text-black lg:bg-sky-600"
      onClick={() => {
        navigate("manual");
      }}
    />
  );
}

export function OutlineButton({
  label,
  onClick,
  className,
  type,
}: ButtonProps) {
  return (
    <Button
      className={`border border-white !bg-inherit text-sm ${className}`}
      label={label}
      type={type || "button"}
      onClick={onClick}
    />
  );
}

export function SolidButton({ label, onClick, className, type }: ButtonProps) {
  return (
    <Button
      className={`border border-orange-450 text-sm font-medium text-black ${className}`}
      label={label}
      type={type || "button"}
      onClick={onClick}
    />
  );
}
