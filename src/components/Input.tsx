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
import { useState } from "react";
import { CheckedState } from "@radix-ui/react-checkbox";
import { ErrorMessage } from "formik";

export function TextInput({
  id,
  label,
  placeholder,
  name,
  className,
  value,
  onChange,
  ...props
}: TextInputProps) {
  const inputId = id || name || label.toLowerCase().replace(/\s/g, "-");
  return (
    <div className="max-w-md">
      <label htmlFor={inputId} className="mb-1 block">
        {label}
      </label>
      <input
        className={`w-full rounded border border-hoki-600 bg-eclipse-elixir-400 px-2 pb-2 pt-1 outline-2 outline-orange-450 focus-visible:outline ${className}`}
        type="text"
        id={inputId}
        name={name || inputId}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
      <div className="min-h-6">
        <ErrorMessage
          component={"div"}
          className="text-red-500"
          name={name ?? inputId}
        />
      </div>
    </div>
  );
}

export function PasswordInput({
  id,
  label,
  placeholder,
  name,
  ...props
}: PasswordInputProps) {
  const inputId = id || name || label.toLowerCase().replace(/\s/g, "-");
  return (
    <div className="max-w-md">
      <label htmlFor={inputId} className="mb-1 block">
        {label}
      </label>
      <div className="flex rounded border border-hoki-600 outline-2 outline-orange-450">
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
          {...props}
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

export function FormTextInput({
  id,
  label,
  placeholder,
  name,
  ...props
}: TextInputProps) {
  return (
    <TextInput
      id={id || name}
      className="max-w-60"
      name={name}
      label={label}
      placeholder={placeholder}
      {...props}
    />
  );
}

export function FormTimeInput({
  id,
  label,
  name,
  className,
  ...props
}: TimeInputProps) {
  const inputId = id || name || label.toLowerCase().replace(/\s/g, "-");
  return (
    <div className={`min-w-44 max-w-md flex-grow ${className}`}>
      <label htmlFor={inputId} className="mb-1 block">
        {label}
      </label>
      <div className="max-w-sm">
        <input
          className={`w-full rounded border border-hoki-600 bg-eclipse-elixir-400 px-2 pb-2 pt-1 placeholder-hoki-500 outline-2 outline-orange-450 focus-visible:outline`}
          type="time"
          id={inputId}
          name={name || inputId}
          {...props}
        />
      </div>
      <div className="min-h-6">
        <ErrorMessage
          component={"div"}
          className="text-red-500"
          name={name ?? inputId}
        />
      </div>
    </div>
  );
}

export function FormCheckBox({
  id,
  label,
  name,
  onCheckedChange,
  defaultChecked,
  ...props
}: CheckboxProps) {
  const [isChecked, setIsChecked] = useState<CheckedState>(
    defaultChecked ?? false,
  );
  const checkboxId = id || name || label.toLowerCase().replace(/\s/g, "-");
  return (
    <>
      <div className="flex items-center space-x-2">
        <Checkbox
          onCheckedChange={(value) => {
            setIsChecked(value);
            if (onCheckedChange) onCheckedChange(value);
          }}
          checked={isChecked}
          id={checkboxId}
          {...props}
          className="border-white"
        />
        <label
          htmlFor={checkboxId}
          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      </div>
      <div className="min-h-6">
        <ErrorMessage
          component={"div"}
          className="text-red-500"
          name={name ?? checkboxId}
        />
      </div>
    </>
  );
}

export function FormSelectInput({
  id,
  label,
  placeholder,
  name,
  options,
  onValueChange,
  ...props
}: SelectInputProps) {
  const selectName = id || label.toLowerCase().replace(/\s/g, "-");
  let key = 0;

  return (
    <div className="min-w-44 max-w-md flex-grow">
      <p className="mb-1">{label}</p>
      <Select
        onValueChange={onValueChange}
        name={name || selectName}
        {...props}
      >
        <SelectTrigger className="max-w-sm border-hoki-600 bg-eclipse-elixir-400 outline-2 focus:outline focus:outline-orange-450">
          <SelectValue
            className="italic text-hoki-500 placeholder-hoki-500"
            placeholder={placeholder}
          />
        </SelectTrigger>
        <SelectContent className="border-hoki-600 bg-eclipse-elixir-400 text-white">
          {options.map((option) => (
            <SelectItem
              className="bg-eclipse-elixir-400 focus:bg-orange-450"
              value={option.value}
              key={key++}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="min-h-6">
        <ErrorMessage
          component={"div"}
          className="text-red-500"
          name={name ?? selectName}
        />
      </div>
    </div>
  );
}

export function FormNumberInput({
  id,
  label,
  placeholder,
  name,
  unit,
  ...props
}: NumberInputProps) {
  const inputId = id || label.toLowerCase().replace(/\s/g, "-");
  const value = isNaN(parseFloat(props.value ?? "")) ? "" : props.value;
  return (
    <div className="max-w-md flex-grow">
      <label htmlFor={inputId} className="mb-1 block">
        {label}
      </label>
      <div className="flex max-w-sm rounded border border-hoki-600 outline-2 outline-orange-450">
        <input
          {...props}
          value={value}
          size={5}
          className="w-full rounded-l bg-eclipse-elixir-400 px-2 pb-2 pt-1 placeholder-hoki-500 placeholder:italic focus-visible:outline-none"
          type="text"
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
          onChange={(e) => {
            const parsedString: string =
              e.target.value.match(/(\d+\.\d+)|(\d+\.$)|(\d+)/)?.at(0) ?? "";
            const parsed = parseFloat(parsedString);
            if (isNaN(parsed) && !parsedString) {
              e.target.value = "";
            } else {
              e.target.value = parsedString;
            }
            if (props.onChange) props.onChange(e);
          }}
        />
        {unit && (
          <div className="rounded-r bg-eclipse-elixir-400 px-2 pt-1 font-semibold italic text-hoki-500 outline outline-1 outline-hoki-600">
            {unit}
          </div>
        )}
      </div>
      <div className="min-h-6">
        <ErrorMessage
          component={"div"}
          className="text-red-500"
          name={name ?? inputId}
        />
      </div>
    </div>
  );
}
