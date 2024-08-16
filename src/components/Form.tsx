import { OutlineButton, RegisterButton, SolidButton } from "./Buttons";
import {
  TextInput,
  PasswordInput,
  FormTimeInput,
  FormSelectInput,
  FormCheckBox,
  FormNumberInput,
  FormTextInput,
} from "./Input";
import { getFormData, submitSchedule } from "@/utilities/forms";
import { createContext, useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Form,
  AccountRegisterFormContainer,
  RegisterNavLink,
  RegisterFormHeading,
  HorizontalLine,
  FormSection,
  CollapsibleSection,
} from "./Utilities";
import {
  getDeviceInfo,
  registerUser,
  signInUser,
  resetPassword,
} from "@/utilities/register";
import { useDispatch, useSelector } from "react-redux";
import { addToast } from "@/store/slice/toasts";
import { ScheduleDetailProps, ScheduleCreateContext, ModeType } from "@/types";
import { X } from "lucide-react";
import { Field, FieldArray, FieldArrayRenderProps, Formik } from "formik";
import { remove, setMode } from "@/store/slice/createScheduleForm";
import { AppStore } from "@/store";
import { CheckedState } from "@radix-ui/react-checkbox";
import createScheduleSchema, { CreateSchedule } from "@/schema/createSchedule";

export function AccountRegisterForm() {
  const dispatch = useDispatch();

  return (
    <AccountRegisterFormContainer>
      <RegisterFormHeading text="Register Account" />
      <TextInput label="User ID" placeholder="Enter user ID" />
      <PasswordInput label="Password" placeholder="Enter password" />
      <PasswordInput
        label="Confirm password"
        placeholder="Enter password again"
      />
      <TextInput label="KEY code" placeholder="Enter KEY code" />
      <RegisterButton
        onClick={async (e) => {
          const button = e.target as HTMLButtonElement;
          const form = button.parentElement as HTMLFormElement;
          const formData = getFormData(form);

          const password = formData["password"];
          const confirmPassword = formData["confirm-password"];
          if (password !== confirmPassword) {
            dispatch(
              addToast({
                title: "Invalid Input",
                description: "Passwords doesn't match.",
                type: "error",
              }),
            );
            return;
          }

          const key = formData["key-code"];
          const deviceInfo = await getDeviceInfo(key);
          if (!deviceInfo) {
            dispatch(
              addToast({
                title: "Couldn't connect to device",
                description:
                  "Please make sure your device is turned on and connected to same wifi as this computer.",
                type: "error",
              }),
            );
            return;
          }
          localStorage.setItem("deviceIp", deviceInfo.ip);

          const username = formData["user-id"];
          const user = await registerUser(username, password, key, deviceInfo);
          if (!user || !user.deviceId) {
            dispatch(
              addToast({
                title: "Couldn't register",
                description:
                  "Please make sure your device is turned on and connected to same wifi as this computer.",
                type: "error",
              }),
            );
            return;
          }
          localStorage.setItem("userId", user.id.toString());
          localStorage.setItem("deviceId", user.deviceId.toString());
          localStorage.setItem("username", username);

          // TODO: Notify user
        }}
        label="Register"
      />
      <RegisterNavLink
        label="Already registered?"
        link="/auth/login"
        linkText="Log In"
      />
    </AccountRegisterFormContainer>
  );
}

export function AccountLoginForm() {
  const dispatch = useDispatch();

  return (
    <AccountRegisterFormContainer>
      <RegisterFormHeading text="Log In" />
      <TextInput label="User ID" placeholder="Enter user ID" />
      <div>
        <PasswordInput label="Password" placeholder="Enter password" />
        <Link className="block text-right text-orange-450" to="/auth/password">
          Forgot password?
        </Link>
      </div>
      <RegisterButton
        onClick={async (e) => {
          const button = e.target as HTMLButtonElement;
          const form = button.parentElement as HTMLFormElement;
          const formData = getFormData(form);

          const username = formData["user-id"];
          const password = formData["password"];

          const jwt = await signInUser(username, password);
          if (!jwt) {
            dispatch(
              addToast({
                title: "Incorrect input",
                description: "Incorrect username or password",
                type: "error",
              }),
            );
            return;
          }

          //TODO: Redirect
        }}
        label="Log In"
      />
      <RegisterNavLink
        label="Haven't registered?"
        link="/auth/signup"
        linkText="Register"
      />
    </AccountRegisterFormContainer>
  );
}

export function AccountResetPasswordForm() {
  const [key, setKey] = useState("");
  const dispatch = useDispatch();

  return (
    <AccountRegisterFormContainer>
      {!key ? (
        <>
          <RegisterFormHeading text="Forgot password" />
          <input type="hidden" />
          <TextInput label="KEY code" placeholder="Enter KEY code" />
          <RegisterButton
            onClick={async (e) => {
              const button = e.target as HTMLButtonElement;
              const form = button.parentElement as HTMLFormElement;
              const formData = getFormData(form);

              const key = formData["key-code"];
              const deviceInfo = await getDeviceInfo(key);
              if (!deviceInfo) {
                dispatch(
                  addToast({
                    title: "Couldn't connect to device",
                    description:
                      "Please make sure your device is turned on and connected to same wifi as this computer.",
                    type: "error",
                  }),
                );
                return;
              }

              localStorage.setItem("deviceId", deviceInfo.id.toString());
              localStorage.setItem("deviceIp", deviceInfo.ip);
              setKey(key);
            }}
            label="Submit"
          />
          <RegisterNavLink label="" link="/auth/login" linkText="Back" />
        </>
      ) : (
        <>
          <RegisterFormHeading text="Reset Password" />
          <TextInput label="User ID" placeholder="Enter user ID" />
          <PasswordInput label="Password" placeholder="Enter new password" />
          <PasswordInput
            label="Confirm Password"
            placeholder="Enter password again"
          />
          <RegisterButton
            onClick={async (e) => {
              const button = e.target as HTMLButtonElement;
              const form = button.parentElement as HTMLFormElement;
              const formData = getFormData(form);

              const username = formData["user-id"];
              const password = formData["password"];
              const confirmPassword = formData["confirm-password"];

              if (password !== confirmPassword) {
                dispatch(
                  addToast({
                    title: "Invalid Input",
                    description: "Passwords doesn't match.",
                    type: "error",
                  }),
                );
                return;
              }

              const res = await resetPassword(username, password, key);
              if (!res) {
                dispatch(
                  addToast({
                    title: "Couldn't reset password",
                    description:
                      "Please make sure your device is turned on and connected to same wifi as this computer.",
                    type: "error",
                  }),
                );
                return;
              }
            }}
            label="Submit"
          />
          <RegisterNavLink
            label=""
            link="/auth/login"
            linkText="Go back to log In"
          />
        </>
      )}
    </AccountRegisterFormContainer>
  );
}

const ScheduleCreateFormContext = createContext<ScheduleCreateContext>({
  index: 0,
  arrayHelpers: null,
  props: null,
});

export function ScheduleCreateForm() {
  const arrayHelpersRef = useRef<FieldArrayRenderProps>();
  const initialValues: CreateSchedule = {
    scheduleName: "",
    schedules: [
      {
        start: "",
        end: "",
        type: "session",
        includeEndTime: true,
        interval: NaN,
        mode: {
          type: "",
          gap: NaN,
          ringCount: NaN,
          duration: NaN,
        },
      },
    ],
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={createScheduleSchema}
      onSubmit={async (values, actions) => {
        values = createScheduleSchema.cast(values);
        const data = await submitSchedule(values);
        console.log(data);
        actions.setSubmitting(false);
      }}
      component={(props) => (
        <Form {...props}>
          <FormSection>
            <button
              className="w-full text-right text-hoki-500"
              onClick={props.handleReset}
              type="button"
            >
              Reset
            </button>
          </FormSection>
          <FormSection>
            <Field
              as={FormTextInput}
              className="placeholder-hoki-500 placeholder:italic"
              label="Schedule Name"
              placeholder="Enter schedule name"
              name="scheduleName"
            />
          </FormSection>
          <HorizontalLine />
          <FieldArray
            name="schedules"
            render={(arrayHelpers) => {
              arrayHelpersRef.current = arrayHelpers;
              const schedules = props.values.schedules;

              return (
                <>
                  {schedules.map((schedule, index) => (
                    <ScheduleCreateFormContext.Provider
                      value={{
                        arrayHelpers,
                        index,
                        props,
                      }}
                      key={index}
                    >
                      <ScheduleDetail
                        type={(() => {
                          return schedule.type === "session" ||
                            schedule.type === "additional"
                            ? schedule.type
                            : "session";
                        })()}
                        index={index}
                      />
                    </ScheduleCreateFormContext.Provider>
                  ))}
                </>
              );
            }}
          />
          <FormSection>
            {props.errors.schedules &&
            props.touched.schedules &&
            typeof props.errors.schedules === "string" ? (
              <div className="-mt-6 mb-1 text-red-500">
                {props.errors.schedules}
              </div>
            ) : null}
            <div className="flex flex-wrap content-center justify-between gap-4">
              <div className="flex flex-wrap content-center gap-4">
                <OutlineButton
                  label="Add session"
                  onClick={() => {
                    arrayHelpersRef.current?.push({
                      start: "",
                      end: "",
                      includeEndTime: true,
                      interval: NaN,
                      type: "session",
                      mode: {
                        type: "",
                        gap: NaN,
                        ringCount: NaN,
                        duration: NaN,
                      },
                    });
                  }}
                />
                <OutlineButton
                  label="Add Additional Bell"
                  onClick={() => {
                    arrayHelpersRef.current?.push({
                      type: "additional",
                      start: "",
                      mode: {
                        type: "",
                        gap: NaN,
                        ringCount: NaN,
                        duration: NaN,
                      },
                    });
                  }}
                />
              </div>
              <SolidButton
                onClick={(e) => {
                  const event =
                    e as unknown as React.FormEvent<HTMLFormElement>;
                  props.handleSubmit(event);
                }}
                type="submit"
                label="Confirm"
              />
            </div>
          </FormSection>
        </Form>
      )}
    />
  );
}

function ScheduleDetail({ type }: ScheduleDetailProps) {
  return (
    <>
      <FormSection>
        {type !== "additional" ? <Session /> : <AdditionalBell />}
        <ModeDetails />
      </FormSection>
      <HorizontalLine />
    </>
  );
}

function ModeDetails() {
  const { index } = useContext(ScheduleCreateFormContext);
  const mode = useSelector((state: AppStore) => state.createScheduleForm.mode);
  const isSingle = mode.single.includes(index);
  const isRepeat = mode.repeat.includes(index);

  return (
    (isRepeat || isSingle) && (
      <div>
        <CollapsibleSection label="Mode settings">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-4">
              <Field
                as={FormNumberInput}
                label="Duration"
                unit="secs"
                placeholder="Ring duration"
                name={`schedules.${index}.mode.duration`}
                id={`schedules.${index}.mode.duration`}
              />
              {isRepeat && (
                <Field
                  as={FormNumberInput}
                  label="Gap"
                  unit="secs"
                  placeholder="Gap between rings"
                  name={`schedules.${index}.mode.gap`}
                  id={`schedules.${index}.mode.gap`}
                />
              )}
            </div>
          </div>
          {isRepeat && (
            <Field
              as={FormNumberInput}
              label="No. of rings"
              placeholder="Total no. of rings"
              name={`schedules.${index}.mode.ringCount`}
              id={`schedules.${index}.mode.ringCount`}
            />
          )}
        </CollapsibleSection>
      </div>
    )
  );
}

function AdditionalBell() {
  const { index, arrayHelpers, props } = useContext(ScheduleCreateFormContext);
  const { setFieldValue } = props;
  const dispatch = useDispatch();
  const modeRef = useRef<ModeType | undefined>();

  return (
    <>
      <div className="flex justify-between">
        <h3 className="mb-5 text-lg font-semibold">Additional Bell</h3>
        {props.values.schedules.length - 1 == index && (
          <button
            className="self-start"
            type="button"
            onClick={() => {
              arrayHelpers?.remove(index);
              if (modeRef.current) {
                dispatch(
                  remove({
                    type: modeRef.current,
                    value: index,
                  }),
                );
              }
            }}
          >
            <X className="text-hoki-500" />
          </button>
        )}
      </div>
      <div className="max-w-90 mb-5 flex flex-wrap items-center gap-4">
        <Field
          name={`schedules.${index}.start`}
          id={`schedules.${index}.start`}
          as={FormTimeInput}
          label="Start time"
        />
        <Field
          as={FormSelectInput}
          name={`schedules.${index}.mode.type`}
          id={`schedules.${index}.mode.type`}
          label="Mode"
          options={[
            {
              value: "single",
              label: "Single chime",
            },
            {
              value: "repeat",
              label: "Repeat chime",
            },
          ]}
          placeholder="Select a mode"
          onValueChange={(value: string) => {
            setFieldValue(`schedules.${index}.mode.type`, value);
            if (value === "single" || value === "repeat") {
              modeRef.current = value;
              dispatch(setMode({ type: value, value: index }));
            }
          }}
        />
      </div>
    </>
  );
}

function Session() {
  const { index, arrayHelpers, props } = useContext(ScheduleCreateFormContext);
  const { setFieldValue, values } = props;
  const dispatch = useDispatch();
  const modeRef = useRef<ModeType | undefined>();

  return (
    <>
      <div className="flex justify-between">
        <h3 className="mb-5 text-lg font-semibold">Session</h3>
        {props.values.schedules.length - 1 == index && (
          <button
            className="self-start"
            type="button"
            onClick={() => {
              arrayHelpers?.remove(index);
              if (modeRef.current) {
                dispatch(
                  remove({
                    type: modeRef.current,
                    value: index,
                  }),
                );
              }
            }}
          >
            <X className="text-hoki-500" />
          </button>
        )}
      </div>
      <div className="max-w-90 flex flex-wrap items-center gap-4">
        <Field
          name={`schedules.${index}.start`}
          id={`schedules.${index}.start`}
          as={FormTimeInput}
          label="Start time"
        />
        <Field
          name={`schedules.${index}.end`}
          id={`schedules.${index}.end`}
          as={FormTimeInput}
          label="End time"
          className="max-w-sm"
        />
        <div className="mb-3 self-end">
          <Field
            name={`schedules.${index}.includeEndTime`}
            id={`schedules.${index}.includeEndTime`}
            component={FormCheckBox}
            label="Include end time"
            onCheckedChange={(state: CheckedState) => {
              if (typeof state === "boolean") {
                setFieldValue(`schedules.${index}.includeEndTime`, state);
              } else {
                setFieldValue(`schedules.${index}.includeEndTime`, true);
              }
            }}
            defaultChecked={values.schedules[index].includeEndTime}
          />
        </div>
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-4">
          <Field
            name={`schedules.${index}.mode.type`}
            id={`schedules.${index}.mode.type`}
            component={FormSelectInput}
            label="Mode"
            options={[
              {
                value: "single",
                label: "Single chime",
              },
              {
                value: "repeat",
                label: "Repeat chime",
              },
            ]}
            placeholder="Select a mode"
            onValueChange={(value: string) => {
              setFieldValue(`schedules.${index}.mode.type`, value);
              if (value === "single" || value === "repeat") {
                modeRef.current = value;
                dispatch(setMode({ type: value, value: index }));
              }
            }}
          />
          <Field
            name={`schedules.${index}.interval`}
            id={`schedules.${index}.interval`}
            as={FormNumberInput}
            label="Intervals"
            unit="min"
            placeholder="Gap between bells"
          />
        </div>
      </div>
    </>
  );
}
