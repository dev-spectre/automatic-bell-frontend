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