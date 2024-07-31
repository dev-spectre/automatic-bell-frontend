import { TextInputProps, PasswordInputProps } from "@/types";
import showPassword from "@/assets/eye_open.png";
import hidePassword from "@/assets/eye_close.png";

export function TextInput({ label, placeholder }: TextInputProps) {
  const inputId = label.toLowerCase().replace(" ", "-");
  return (
    <div className="max-w-md">
      <label htmlFor={inputId} className="mb-1 block">
        {label}
      </label>
      <input
        className="w-full rounded border border-zinc-600 bg-navy-500 px-2 pb-2 pt-1 outline-2 outline-orange-400 focus-visible:outline"
        type="text"
        id={inputId}
        name={inputId}
        placeholder={placeholder}
      />
    </div>
  );
}

export function PasswordInput({ label, placeholder }: PasswordInputProps) {
  const inputId = label.toLowerCase().replace(" ", "-");
  return (
    <div className="max-w-md">
      <label htmlFor={inputId} className="mb-1 block">
        {label}
      </label>
      <div className="flex rounded border border-zinc-600 outline-2 outline-orange-400">
        <input
          className="w-full rounded-l bg-navy-500 px-2 pb-2 pt-1 focus-visible:outline-none"
          type="password"
          id={inputId}
          name={inputId}
          placeholder={placeholder}
          onFocus={(e) => {
            const inputTarget = e.target as HTMLInputElement;
            const parentElement = inputTarget.parentElement as HTMLElement;
            parentElement.classList.add("outline");
          }}
          onBlur={(e) => {
            const inputTarget = e.target as HTMLInputElement;
            const parentElement = inputTarget.parentElement as HTMLElement;
            parentElement.classList.remove("outline");
          }}
        />
        <button
          className="rounded-r bg-navy-500 pr-2"
          type="button"
          onClick={(e) => {
            const buttonTarget = e.target as HTMLButtonElement;
            const showPasswordImage = buttonTarget
              .childNodes[0] as HTMLImageElement;
            const hidePasswordImage = buttonTarget
              .childNodes[1] as HTMLImageElement;
            const input =
              buttonTarget.previousElementSibling as HTMLInputElement;
            if (input.type === "password") {
              showPasswordImage.classList.add("hidden");
              hidePasswordImage.classList.remove("hidden");
              input.type = "text";
            } else {
              showPasswordImage.classList.remove("hidden");
              hidePasswordImage.classList.add("hidden");
              input.type = "password";
            }
          }}
        >
          <img
            className="pointer-events-none"
            src={showPassword}
            alt="show password"
          />
          <img
            className="pointer-events-none hidden"
            src={hidePassword}
            alt="show password"
          />
        </button>
      </div>
    </div>
  );
}
