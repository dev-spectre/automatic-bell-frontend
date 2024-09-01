import { RawToast } from "@/types";

export const SITE_UNDER_CONSTRUCTION: RawToast = {
  title: "Site under construction.",
  description: "This feature will soon be impelmented!",
  type: "info",
};

export const PASSWORD_DOESNT_MATCH: RawToast = {
  title: "Invalid Input",
  description: "Passwords doesn't match.",
  type: "error",
};

export const COULDNT_CONNNECT_TO_DEVICE: RawToast = {
  title: "Couldn't connect to device.",
  description:
    "Please make sure your device is turned on and connected to same wifi as this device.",
  type: "error",
};

export const INVALID_CRED: RawToast = {
  title: "Incorrect credentials",
  description: "Incorrect username or password",
  type: "error",
};

export const UNKNOWN_ERR: RawToast = {
  title: "Something went wrong!!",
  description:
    "Please try again after some time or try again after restarting your device.",
  type: "error",
};

export const USER_CREATED: RawToast = {
  title: "User created.",
  description: "Please log in to continue.",
  type: "info",
};

export const SCHEDULE_CREATED: RawToast = {
  title: "Schedule created",
  description: "Schedule has been created on device, and it can be assigned.",
  type: "info",
};

export const USER_EXISTS: RawToast = {
  title: "User already exists.",
  description: "User already exists, try to signin.",
  type: "error",
};

export const USER_DOESNT_EXISTS: RawToast = {
  title: "User doesn't exist.",
  description: "User doesn't exist, try to signup.",
  type: "error",
};

export const INVALID_FORMAT: RawToast = {
  title: "Invalid input format",
  description: "Please give input according to give format.",
  type: "error",
};

export const DEVICE_ID_NOT_FOUND: RawToast = {
  title: "Couldn't identify device.",
  description: "Please login and try again.",
  type: "error",
};

export const SCHEDULE_ASSIGNED: RawToast = {
  title: "Schedule assigned.",
  description: "Schedule has been assigned and the schedule is active.",
  type: "info",
};