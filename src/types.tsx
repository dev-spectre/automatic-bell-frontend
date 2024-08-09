import React, { ReactNode } from "react";
import store from "./store";
import { CheckedState } from "@radix-ui/react-checkbox";

export interface ReactNodes {
  children: ReactNode;
}

export interface TextInputProps {
  label: string;
  placeholder: string;
  className?: string;
  name?: string;
  id?: string;
  value?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (e: React.ChangeEvent<any>) => void;
}

export interface PasswordInputProps extends TextInputProps {}

export type TimeInputProps = Omit<TextInputProps, "placeholder">;

export interface NumberInputProps extends TextInputProps {
  unit?: string;
}

export interface SelectInputProps extends Omit<TextInputProps, "onChange"> {
  options: { value: string; label: string }[];
  onValueChange?: (value: string) => void;
}

export interface CheckboxProps {
  id?: string;
  name?: string;
  label: string;
  onCheckedChange?: (value: CheckedState) => void;
  defaultChecked: CheckedState;
}

export interface ButtonProps {
  type?: "submit" | "button" | "reset";
  label: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  className?: string;
}

export interface RegsiterNavLinkProps {
  label: string;
  linkText: string;
  link: string;
}

export interface FormHeadingProps {
  text: string;
}

export interface FormDataObject {
  [key: string]: string;
}

export interface RequestHeaders {
  [key: string]: unknown;
}

export interface RequestBody extends RequestHeaders {}

export interface DeviceInfo {
  id: number;
  ip: string;
}

export interface User {
  id: number;
  username: string;
}

export interface UserWithDevice extends DeviceInfo {
  deviceId: number;
}

export interface AlertProps {
  id: number;
  title: string;
  description: string;
}

export interface RawToast {
  title: string;
  description: string;
  type: string;
  action?: string;
}

export interface ToastId {
  id: number;
}

export interface Toast extends RawToast, ToastId {}

export interface ToastState {
  id: number;
  toast: Toast[];
}

export type ReduxStore = ReturnType<typeof store.getState>;

export interface NavItemProps {
  label: string;
  link: string;
  icon: string;
}

export interface NavListProps extends ReactNodes {}

export interface NavButtonProps {
  label: string;
  onClick: () => void;
  icon: string;
}

export interface CollapsibleSectionProps extends ReactNodes {
  label: string;
}

export interface NavCollapsibleProps extends CollapsibleSectionProps {
  icon: string;
}

export interface ScheduleDetailProps {
  type: "session" | "additional";
  index: number;
}

export interface CreateScheduleFormState {
  mode: {
    single: number[];
    repeat: number[];
  };
}

export interface CreateScheduleFormStatePayload {
  type: "single" | "repeat";
  value: number;
}

export interface FormProps extends ReactNodes {
  handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}
