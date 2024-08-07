import {
  TextInputProps,
  PasswordInputProps,
  TimeInputProps,
  SelectInputProps,
  CheckboxProps,
  NumberInputProps,
} from "@/types";
import showPassword from "@/assets/eye_open.png";
import hidePassword from "@/assets/eye_close.png";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TextInput({
  label,
  placeholder,
  name,
  className,
}: TextInputProps) {
  const inputId = label.toLowerCase().replace(/\s/g, "-");
  return (
    <div className="max-w-md">
      <label htmlFor={inputId} className="mb-1 block">
        {label}
      </label>
      <input
        className={`border-hoki-600 w-full rounded border bg-eclipse-elixir-400 px-2 pb-2 pt-1 outline-2 outline-orange-450 focus-visible:outline ${className}`}
        type="text"
        id={inputId}
        name={name || inputId}
        placeholder={placeholder}
      />
    </div>
  );
}

export function PasswordInput({
  label,
  placeholder,
  name,
}: PasswordInputProps) {
  const inputId = label.toLowerCase().replace(/\s/g, "-");
  return (
    <div className="max-w-md">
      <label htmlFor={inputId} className="mb-1 block">
        {label}
      </label>
      <div className="border-hoki-600 flex rounded border outline-2 outline-orange-450">
        <input
          className="w-full rounded-l bg-eclipse-elixir-400 px-2 pb-2 pt-1 focus-visible:outline-none"
          type="password"
          id={inputId}
          name={name || inputId}
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
          className="rounded-r bg-eclipse-elixir-400 pr-2"
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

export function FormTextInput({ label, placeholder, name }: TextInputProps) {
  return (
    <TextInput
      className="max-w-60"
      name={name}
      label={label}
      placeholder={placeholder}
    />
  );
}

export function FormTimeInput({ label, name, className }: TimeInputProps) {
  const inputId = label.toLowerCase().replace(/\s/g, "-");
  return (
    <div className={`min-w-44 max-w-md flex-grow ${className}`}>
      <label htmlFor={inputId} className="mb-1 block">
        {label}
      </label>
      <div className="max-w-sm">
        <input
          className={`border-hoki-600 placeholder-hoki-500 w-full rounded border bg-eclipse-elixir-400 px-2 pb-2 pt-1 outline-2 outline-orange-450 focus-visible:outline`}
          type="time"
          id={inputId}
          name={name || inputId}
        />
      </div>
    </div>
  );
}

export function FormCheckBox({ label }: CheckboxProps) {
  const checkboxId = label.toLowerCase().replace(/\s/g, "-");
  return (
    <div className="flex items-center space-x-2">
      <Checkbox checked={true} className="border-white" id={checkboxId} />
      <label
        htmlFor={checkboxId}
        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  );
}

export function FormSelectInput({
  label,
  placeholder,
  name,
  options,
}: SelectInputProps) {
  const selectName = label.toLowerCase().replace(/\s/g, "-");
  return (
    <div className="min-w-44 max-w-md flex-grow">
      <p className="mb-1">{label}</p>
      <Select name={name || selectName}>
        <SelectTrigger className="border-hoki-600 max-w-sm bg-eclipse-elixir-400 outline-2 focus:outline focus:outline-orange-450">
          <SelectValue
            className="text-hoki-500 placeholder-hoki-500 italic"
            placeholder={placeholder}
          />
        </SelectTrigger>
        <SelectContent className="border-hoki-600 bg-eclipse-elixir-400 text-white">
          {options.map((option) => (
            <SelectItem
              className="bg-eclipse-elixir-400 focus:bg-orange-450"
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function FormNumberInput({
  label,
  placeholder,
  name,
  unit,
}: NumberInputProps) {
  const inputId = label.toLowerCase().replace(/\s/g, "-");
  return (
    <div className="max-w-md flex-grow">
      <label htmlFor={inputId} className="mb-1 block">
        {label}
      </label>
      <div className="border-hoki-600 flex max-w-sm rounded border outline-2 outline-orange-450">
        <input
          size={5}
          className="placeholder-hoki-500 w-full rounded-l bg-eclipse-elixir-400 px-2 pb-2 pt-1 placeholder:italic focus-visible:outline-none"
          type="text"
          pattern="\d*"
          id={inputId}
          name={name || inputId}
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
        {unit && (
          <div className="text-hoki-500 outline-hoki-600 rounded-r bg-eclipse-elixir-400 px-2 pt-1 font-semibold italic outline outline-1">
            {unit}
          </div>
        )}
      </div>
    </div>
  );
}
