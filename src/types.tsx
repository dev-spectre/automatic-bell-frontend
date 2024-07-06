import React, { ReactNode } from "react";

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