import { Link } from "react-router-dom";
import {
  ReactNodes,
  RegsiterNavLinkProps,
  FormHeadingProps,
  CollapsibleSectionProps,
  FormProps,
  PageHeaderProps,
  OverlayProps,
  SkipScheduleModalProps,
} from "@/types";
import {
  ManualButton,
  MenuButton,
  OutlineButton,
  SolidButton,
} from "./Buttons";
import { useState } from "react";
import { Bell, ChevronDown, X } from "lucide-react";
import { FormCheckBox } from "./Input";
import { Formik, FormikProps } from "formik";
import req from "@/api/requests";
import { dateToString } from "@/utilities/dashboard";
import { getDeviceId, getDeviceIp } from "@/utilities/device";
import { useDispatch } from "react-redux";
import { assignSchedules, unassignSchedules } from "@/store/slice/schedules";
import { addToast } from "@/store/slice/toasts";
import {
  COULDNT_CONNNECT_TO_DEVICE,
  SCHEDULE_ASSIGNMENT_UPDATED,
} from "@/constants/alert";

export function AccountRegisterFormContainer({ children }: ReactNodes) {
  return (
    <form className="mx-auto flex min-h-[33.4rem] max-w-md flex-col gap-4 rounded bg-eclipse-elixir-500 px-8 py-7">
      {children}
    </form>
  );
}

export function Form({ onClose, edit, children, handleSubmit }: FormProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className="min-w-72 rounded-md bg-eclipse-elixir-500 pb-12 pt-4"
    >
      {edit && (
        <div className="flex justify-end px-2 text-hoki-500">
          <button onClick={onClose}>
            <X />
          </button>
        </div>
      )}
      {children}
    </form>
  );
}

export function FormSection({ children }: ReactNodes) {
  return <section className="px-7">{children}</section>;
}

export function RegisterNavLink({
  label,
  linkText,
  link,
}: RegsiterNavLinkProps) {
  return (
    <p className="-mt-2 text-center text-white">
      {label}{" "}
      <Link className="text-orange-450" to={link}>
        {linkText}
      </Link>
    </p>
  );
}

export function RegisterFormHeading({ text }: FormHeadingProps) {
  return <h2 className="mb-2 text-2xl font-medium text-white">{text}</h2>;
}

export function HorizontalLine() {
  return <hr className="mb-7 mt-2 border-t-hoki-600" />;
}

export function ManualControl() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="max-lg:relative">
      <button
        onClick={() => setIsCollapsed((value) => !value)}
        className="rounded-full border border-hoki-600 bg-eclipse-elixir-400 p-2 lg:hidden"
      >
        <Bell />
      </button>
      <div
        className={`right-0 top-12 z-10 flex flex-wrap max-lg:absolute max-lg:flex-col lg:gap-2 ${isCollapsed && "max-lg:hidden"}`}
      >
        <ManualButton />
      </div>
    </div>
  );
}

export function CollapsibleSection({
  label,
  children,
}: CollapsibleSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  return (
    <section>
      <h2 className="font-semibold">
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex h-full w-full items-center py-2"
        >
          {label}
          <ChevronDown
            className={`ml-4 w-6 -rotate-90 transition-transform ${!isCollapsed ? "rotate-0" : ""}`}
          />
        </button>
      </h2>
      <div className={`${isCollapsed && "h-0 opacity-0"}`}>{children}</div>
    </section>
  );
}

export function PageHeader({ label }: PageHeaderProps) {
  return (
    <header className="mb-7 flex items-center justify-between gap-2">
      <div className="flex gap-2">
        <MenuButton />
        <h2 className="text-lg sm:text-xl md:text-2xl">{label}</h2>
      </div>
      <ManualControl />
    </header>
  );
}

export function Overlay({ onClick, children, ...props }: OverlayProps) {
  return (
    <div
      id="overlay"
      className="fixed inset-0 z-30 flex items-start justify-center overflow-scroll border-none bg-black/50 p-10"
      {...props}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function SkipScheduleModal({
  date,
  skipSchedules,
  setSkipSchedules,
}: SkipScheduleModalProps) {
  const dispatch = useDispatch();

  return Object.keys(skipSchedules).length ? (
    <Overlay
      onClick={(e) => {
        const target = e.target as HTMLDivElement;
        if (target.id === "overlay") setSkipSchedules({});
      }}
    >
      <Formik
        enableReinitialize={true}
        onSubmit={async (values, actions) => {
          const skipSchedules: string[] = Object.keys(values).reduce(
            (skip, schedule) => (values[schedule] ? [schedule, ...skip] : skip),
            [] as string[],
          );
          const deviceId = getDeviceId() ?? NaN;
          const deviceIp = await getDeviceIp(deviceId);
          const dateString = dateToString(date);
          const payload = {
            skip: {
              [dateString]: skipSchedules,
            },
          };
          const res = await req.put(
            `http://${deviceIp}/schedule/skip`,
            payload,
          );
          if (res.success) {
            const unassignSkipSchedules = Object.keys(values).filter(
              (value) => !skipSchedules.includes(value),
            );
            dispatch(assignSchedules(payload));
            dispatch(
              unassignSchedules({
                skip: {
                  [dateString]: unassignSkipSchedules,
                },
              }),
            );
            dispatch(addToast(SCHEDULE_ASSIGNMENT_UPDATED));
          } else {
            dispatch(addToast(COULDNT_CONNNECT_TO_DEVICE));
          }
          actions.setSubmitting(false);
          setSkipSchedules({});
        }}
        initialValues={skipSchedules}
        component={({
          values,
          ...props
        }: FormikProps<typeof skipSchedules>) => (
          <div className="flex h-full items-center justify-center">
            <div className="min-w-56 rounded bg-eclipse-elixir-500 px-5 py-7">
              <p className="mb-3">Select schedules to skip</p>
              <ul>
                {Object.keys(values).map((schedule) => (
                  <li key={schedule}>
                    <div>
                      <FormCheckBox
                        name={schedule}
                        defaultChecked={values[schedule]}
                        label={schedule}
                        onCheckedChange={() => {
                          props.setFieldValue(schedule, !values[schedule]);
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <OutlineButton
                  className="w-28 min-w-fit"
                  label="Cancel"
                  onClick={() => setSkipSchedules({})}
                />
                <SolidButton
                  className="w-28 min-w-fit"
                  label="Submit"
                  onClick={(e) => {
                    const event =
                      e as unknown as React.FormEvent<HTMLFormElement>;
                    props.handleSubmit(event);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      />
    </Overlay>
  ) : (
    <></>
  );
}
