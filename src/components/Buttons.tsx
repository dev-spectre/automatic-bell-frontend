import { ButtonProps } from "@/types";
import { Menu } from "lucide-react";

export function RegisterButton({ label, onClick }: ButtonProps) {
  return (
    <button
      className="mt-6 rounded bg-orange-450 py-2 font-poppins font-medium text-black"
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export function MenuButton() {
  return (
    <button
      onClick={() => {
        const sideBar = document.querySelector("aside#nav");
        sideBar?.classList.remove("max-md:-translate-x-60");
      }}
    >
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
  return <Button label="Manual" className="bg-sky-600" onClick={() => {}} />;
}

export function EmergencyButton() {
  return <Button label="Emergency" className="bg-red-600" onClick={() => {}} />;
}

export function OutlineButton({
  label,
  onClick,
  className,
  type,
}: ButtonProps) {
  return (
    <Button
      className={`border border-white bg-inherit text-sm ${className}`}
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
