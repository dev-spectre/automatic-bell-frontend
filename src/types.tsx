import React, { ReactNode } from "react";
import store from "./store";

export interface ReactNodes {
  children: ReactNode;
}

export interface TextInputProps {
  label: string;
  placeholder: string;
}

export interface PasswordInputProps extends TextInputProps {}

export interface ButtonProps {
  label: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
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

export interface NavCollapsibleProps extends ReactNodes {
  label: string;
  icon: string;
}
