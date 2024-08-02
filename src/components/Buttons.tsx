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
