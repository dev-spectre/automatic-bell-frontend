import { FormDataObject } from "@/types";

export function getFormData(form: HTMLFormElement) {
  const data: FormDataObject = {};
  const formData = new FormData(form);
  for (const keyValuePair of formData) {
    const key = keyValuePair[0] as string;
    const value = keyValuePair[1] as string;
    data[key] = value;
  }
  return data;
}