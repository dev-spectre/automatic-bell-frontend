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

export function Button({ label, onClick, className }: ButtonProps) {
  return (
    <button
      className={`min-w-44 rounded bg-black px-4 py-2 text-lg ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export function ManualButton() {
  return <Button label="Manual" className="bg-cyan-600" onClick={() => {}} />;
}

export function EmergencyButton() {
  return <Button label="Emergency" className="bg-red-600" onClick={() => {}} />;
}
