import React, { ReactNode } from "react";
import store from "./store";
import { CheckedState } from "@radix-ui/react-checkbox";
import { FieldArrayRenderProps } from "formik";
import { Schedule } from "./schema/createSchedule";

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
  type: "error" | "info";
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

export type ModeType = "single" | "repeat";

export interface CreateScheduleFormStatePayload {
  type: ModeType;
  value: number;
}

export interface FormProps extends ReactNodes {
  handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export interface ScheduleCreateContext {
  index: number;
  arrayHelpers?: FieldArrayRenderProps | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props?: any;
}

export type ScheduleMode = Pick<
  Schedule["schedules"][number]["mode"],
  "gap" | "duration" | "ringCount" | "type"
>;

export interface ExpandedSchedule {
  [Key: string]: string;
}

export interface PageHeaderProps {
  label: string;
}

export type ErrorString =
  | "INVALID_CRED"
  | "DEVICE_ERR"
  | "UNKNOWN_ERR"
  | "INVALID_FORMAT"
  | "RESOURCE_NOT_FOUND"
  | "FORBIDDEN"
  | "RESOURCE_CONFLICT"
  | "DEVICE_ID_NOT_FOUND";

export type ApiResponse = {
  success: boolean;
  msg?: string;
  err?: string | object;
  data?: object;
};

export type Success<T> = {
  ok: true;
  data: T;
};

export type Error<E> = {
  ok: false;
  error: E;
};

export type Result<T, E> = Success<T> | Error<E>;

export type ScheduleStateAddPayload = {
  schedules: Schedule[];
};

export type Schedules = {
  [key: string]: Schedule["schedules"];
};

export type SelectOptionValue = {
  value: string;
  label: string;
};