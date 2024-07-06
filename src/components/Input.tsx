import { TextInputProps, PasswordInputProps } from "../types";
import showPassword from "../assets/eye_open.png";
import hidePassword from "../assets/eye_close.png";

export function TextInput({ label, placeholder }: TextInputProps) {
  const inputId = label.toLowerCase().replace(" ", "-");
  return (
    <div className="max-w-md">
      <label htmlFor={inputId} className="mb-1 block font-poppins text-white">
        {label}
      </label>
      <input
        className="w-full rounded border border-zinc-600 bg-navy-500 px-2 pb-2 pt-1 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-400"
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
      <label htmlFor={inputId} className="mb-1 block font-poppins text-white">
        {label}
      </label>
      <div className="flex rounded border border-zinc-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-400">
        <input
          className="w-full rounded-l bg-navy-500 px-2 pb-2 pt-1 text-white focus-visible:outline-none"
          type="password"
          id={inputId}
          name={inputId}
          placeholder={placeholder}
        />
        <button
          className="rounded-r bg-navy-500 pr-2"
          type="button"
          onClick={(e) => {
            const buttonTarget = e.target as HTMLButtonElement;
            const buttonTargetImage = buttonTarget
              .childNodes[0] as HTMLImageElement;
            const input =
              buttonTarget.previousElementSibling as HTMLInputElement;
            if (input.type === "password") {
              buttonTargetImage.src = hidePassword;
              buttonTargetImage.alt = "hide password";
              input.type = "text";
            } else {
              buttonTargetImage.src = showPassword;
              buttonTargetImage.alt = "show password";
              input.type = "password";
            }
          }}
        >
          <img
            className="pointer-events-none"
            src={showPassword}
            alt="show password"
          />
        </button>
      </div>
    </div>
  );
}
