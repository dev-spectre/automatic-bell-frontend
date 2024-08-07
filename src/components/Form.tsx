import { OutlineButton, RegisterButton, SolidButton } from "./Buttons";
import {
  TextInput,
  PasswordInput,
  FormTimeInput,
  FormSelectInput,
  FormCheckBox,
  FormNumberInput,
} from "./Input";
import { getFormData } from "@/utilities/forms";
import { useState } from "react";
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
import { useDispatch } from "react-redux";
import { addToast } from "@/store/slice/toasts";
import { ScheduleDetailProps } from "@/types";
import { X } from "lucide-react";

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

export function ScheduleCreateForm() {
  return (
    <Form>
      <FormSection>
        <input className="text-hoki-500 w-full text-right" type="reset" />
      </FormSection>
      <FormSection>
        <TextInput
          className="placeholder-hoki-500 placeholder:italic"
          label="Schedule Name"
          placeholder="Enter schedule name"
        />
      </FormSection>
      <HorizontalLine />
      <ScheduleDetailForm type="session" />
      <ScheduleDetailForm type="additional" />
      <FormSection>
        <div className="flex flex-wrap content-center justify-between gap-4">
          <div className="flex flex-wrap content-center gap-4">
            <OutlineButton label="Add session" onClick={() => {}} />
            <OutlineButton label="Add Additional Bell" onClick={() => {}} />
          </div>
          <SolidButton type="submit" label="Confirm" onClick={() => {}} />
        </div>
      </FormSection>
    </Form>
  );
}

function ScheduleDetailForm({ type }: ScheduleDetailProps) {
  return (
    <>
      <FormSection>
        {type !== "additional" ? <Session /> : <AdditionalBell />}
        <div>
          <CollapsibleSection label="Mode settings">
            <div className="mb-3 flex flex-wrap items-center gap-4">
              <FormNumberInput
                label="Duration"
                unit="secs"
                placeholder="Ring duration"
              />
              <FormNumberInput
                label="Gap"
                unit="secs"
                placeholder="Gap between rings"
              />
            </div>
            <FormNumberInput
              label="No. of rings"
              placeholder="Total no. of rings"
            />
          </CollapsibleSection>
        </div>
      </FormSection>
      <HorizontalLine />
    </>
  );
}

function AdditionalBell() {
  return (
    <>
      <div className="flex justify-between">
        <h3 className="mb-5 text-lg font-semibold">Additional Bell</h3>
        <button className="self-start" type="button" onClick={() => {}}>
          <X />
        </button>
      </div>
      <div className="max-w-90 mb-5 flex flex-wrap items-center gap-4">
        <FormTimeInput label="Start time" />
        <FormSelectInput
          name="mode"
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
        />
      </div>
    </>
  );
}

function Session() {
  return (
    <>
      <div className="flex justify-between">
        <h3 className="mb-5 text-lg font-semibold">Session</h3>
        <button className="self-start" type="button" onClick={() => {}}>
          <X />
        </button>
      </div>
      <div className="max-w-90 mb-5 flex flex-wrap items-center gap-4">
        <FormTimeInput label="Start time" />
        <FormTimeInput label="End time" className="max-w-sm" />
        <div className="mb-3 self-end">
          <FormCheckBox label="Include end time" />
        </div>
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-4">
        <FormSelectInput
          name="mode"
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
        />
        <FormNumberInput
          label="Intervals"
          unit="min"
          placeholder="Gap between bells"
        />
      </div>
    </>
  );
}
