import { ButtonProps } from "@/types";

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
