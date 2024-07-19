import { AlertCircle } from "lucide-react";
import { AlertProps, ReduxStore } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useRef } from "react";
import { TOAST_TIMEOUT } from "@/constants/toast";
import { useDispatch, useSelector } from "react-redux";
import { removeToast } from "@/store/slice/toasts";

export function AlertError({ id, title, description }: AlertProps) {
  const dispatch = useDispatch();
  const toastRef = useRef(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const toast = toastRef.current as unknown as HTMLElement;
      dispatch(removeToast({ id: toast.id }));
    }, TOAST_TIMEOUT);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [toastRef, dispatch]);

  return (
    <Alert
      id={id.toString()}
      ref={toastRef}
      variant="destructive"
      className="relative inset-0 bg-black/75"
    >
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}

export default function Toast() {
  const toasts = useSelector((store: ReduxStore) => store.toast.toast);

  return (
    <div className="absolute right-1/2 top-5 flex -translate-x-1/2 flex-col gap-2 md:right-5 md:w-72 md:-translate-x-0">
      {toasts.map((toast) => {
        if (toast.type === "error") {
          return (
            <AlertError
              id={toast.id}
              key={toast.id}
              title={toast.title}
              description={toast.description}
            />
          );
        }
      })}
    </div>
  );
}
