import { ButtonProps } from "../types";

export function RegisterButton({ label, onClick }: ButtonProps) {
  return <button className="py-2 bg-orange-450 font-medium rounded mt-2 font-poppins" type="button" onClick={onClick}>{label}</button>;
}
