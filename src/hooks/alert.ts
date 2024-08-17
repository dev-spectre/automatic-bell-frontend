import { addToast } from "@/store/slice/toasts";
import { RawToast } from "@/types";
import { useDispatch } from "react-redux";

export function useAlert() {
  const dispatch = useDispatch();
  return (toast: RawToast) => {
    dispatch(addToast(toast));
  };
}
