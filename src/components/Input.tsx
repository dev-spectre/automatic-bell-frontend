import {
  TextInputProps,
  PasswordInputProps,
  TimeInputProps,
  SelectInputProps,
  CheckboxProps,
  NumberInputProps,
  DateInputProps,
  WeekdayProps,
  WeekdaysProps,
  MonthdaysProps,
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
import { useEffect, useState } from "react";
import { CheckedState } from "@radix-ui/react-checkbox";
import { ErrorMessage } from "formik";
import { Calendar } from "./ui/calendar";

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
          name={name || checkboxId}
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
  value,
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
        value={value}
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
  allowNegative,
  hideError,
  ...props
}: NumberInputProps) {
  const inputId = id || label.toLowerCase().replace(/\s/g, "-");
  if (!props.value) props.value = "";

  const regex = allowNegative ? /-?\d+\.?\d*|^-/ : /\d+\.?\d*|^-/;

  let value =
    !isNaN(parseFloat(props.value)) ||
    (props.value === "-" &&
    allowNegative)
      ? props.value
      : "";

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
              e.target.value.match(regex)?.at(0) ?? "";
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
      {!hideError && (
        <div className="min-h-6">
          <ErrorMessage
            component={"div"}
            className="text-red-500"
            name={name ?? inputId}
          />
        </div>
      )}
    </div>
  );
}

export function FormDatePicker({ label, id, value, onChange }: DateInputProps) {
  const datePickerId = id || label.toLowerCase().replace(/\s/g, "-");
  const initialValues =
    value?.map((value) => {
      const [date, month, year] = value
        .split("/")
        .map((value) => Number(value));
      return new Date(year, month - 1, date);
    }) || [];
  const [date, setDate] = useState<Date[]>(initialValues);

  return (
    <>
      <label className="mb-1 block" htmlFor={datePickerId}>
        {label}
      </label>
      <Calendar
        id={datePickerId}
        mode="multiple"
        selected={date}
        onSelect={(selected) => {
          if (!selected) return;
          if (onChange) {
            const values = selected.map((value) => {
              const year = value.getFullYear();
              const month = value.getMonth() + 1;
              const date = value.getDate();
              return `${date}/${month}/${year}`;
            });
            onChange(values);
          }
          setDate(selected);
        }}
        className="inline-block rounded-md border border-hoki-600"
        classNames={{
          day_selected: "bg-orange-450 text-black",
          day_today:
            "bg-eclipse-elixir-600 outline outline-1 outline-orange-450",
          cell: "h-8 w-8 md:h-10 md:w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-eclipse-elixir-500/50 [&:has([aria-selected])]:bg-eclipse-elixir-500 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        }}
      />
    </>
  );
}

function RoundCheckBox({
  id,
  label,
  name,
  selected,
  setSelected,
}: WeekdayProps) {
  const checked = selected.includes(id);

  return (
    <>
      <label
        onClick={() => {
          setSelected((selected: string[]) => {
            if (selected.includes(id)) {
              return selected.filter((value) => value != id);
            } else {
              return [id, ...selected];
            }
          });
        }}
        className={`flex h-10 w-10 items-center justify-center rounded-full border border-hoki-600 hover:cursor-pointer ${checked && "bg-orange-450 text-black"}`}
        htmlFor={id}
      >
        {label}
      </label>
      <input className="hidden" type="checkbox" id={id} name={name} />
    </>
  );
}

export function FormWeekdays({
  name,
  value,
  onChange,
  touched,
}: WeekdaysProps) {
  const [selected, setSelected] = useState<string[]>(value || []);
  useEffect(() => {
    if (onChange && (touched || selected.length)) onChange(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <div id={name}>
      <div className="flex flex-wrap gap-3">
        <RoundCheckBox
          id="sun"
          label="S"
          name={name}
          selected={selected}
          setSelected={setSelected}
        />
        <RoundCheckBox
          id="mon"
          label="M"
          name={name}
          selected={selected}
          setSelected={setSelected}
        />
        <RoundCheckBox
          id="tue"
          label="T"
          name={name}
          selected={selected}
          setSelected={setSelected}
        />
        <RoundCheckBox
          id="wed"
          label="W"
          name={name}
          selected={selected}
          setSelected={setSelected}
        />
        <RoundCheckBox
          id="thu"
          label="T"
          name={name}
          selected={selected}
          setSelected={setSelected}
        />
        <RoundCheckBox
          id="fri"
          label="F"
          name={name}
          selected={selected}
          setSelected={setSelected}
        />
        <RoundCheckBox
          id="sat"
          label="S"
          name={name}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
    </div>
  );
}

export function FormMonthdays({
  name,
  value,
  onChange,
  touched,
}: MonthdaysProps) {
  const [selected, setSelected] = useState<string[]>(value || []);

  useEffect(() => {
    if (onChange && (touched || selected.length)) onChange(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const currentMonthDaysCount = new Date(year, month, 0).getDate();

  const monthdays = [];
  for (let i = 1; i <= currentMonthDaysCount; i++) {
    monthdays.push(
      <RoundCheckBox
        key={i}
        label={i.toString()}
        id={i.toString()}
        name={name}
        selected={selected}
        setSelected={setSelected}
      />,
    );
  }
  return <div className="flex max-w-80 flex-wrap gap-3">{monthdays}</div>;
}
