import { RegisterButton } from "./Buttons";
import { TextInput, PasswordInput } from "./Input";
import { getFormData } from "../utilities/forms";
import { useState } from "react";
import {
  AccountRegisterFormContainer,
  RegisterNavLink,
  RegisterFormHeading,
} from "./Utilities";
import {
  getDeviceInfo,
  registerUser,
  signInUser,
  resetPassword,
} from "../utilities/register";

export function AccountRegisterForm() {
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
          const confirmPassword = formData["password"];
          if (password !== confirmPassword) {
            // TODO: Notify user
            return;
          }

          const key = formData["key-code"];
          const deviceInfo = await getDeviceInfo(key);
          if (!deviceInfo) {
            // TODO: Notify user
            return;
          }
          localStorage.setItem("deviceIp", deviceInfo.ip);

          const username = formData["user-id"];
          const user = await registerUser(username, password, key, deviceInfo);
          if (!user || !user.deviceId) {
            // TODO: Notify user
            return;
          }
          localStorage.setItem("userId", user.id.toString());
          localStorage.setItem("deviceId", user.deviceId.toString());
          localStorage.setItem("username", username);

          // TODO: Notify user
        }}
        label="Register"
      />
      <RegisterNavLink label="Already registered?" link="/" linkText="Log In" />
    </AccountRegisterFormContainer>
  );
}

export function AccountLoginForm() {
  return (
    <AccountRegisterFormContainer>
      <RegisterFormHeading text="Log In" />
      <TextInput label="User ID" placeholder="Enter user ID" />
      <div>
        <PasswordInput label="Password" placeholder="Enter password" />
        <a className="block text-right text-orange-400" href="#">
          Forgot password?
        </a>
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
            // TODO: Notify user
            return;
          }

          //TODO: Redirect
        }}
        label="Log In"
      />
      <RegisterNavLink
        label="Haven't registered?"
        link="/"
        linkText="Register"
      />
    </AccountRegisterFormContainer>
  );
}

export function AccountResetPasswordForm() {
  const [key, setKey] = useState("");

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
                // TODO: Notify user
                return;
              }

              localStorage.setItem("deviceId", deviceInfo.id.toString());
              localStorage.setItem("deviceIp", deviceInfo.ip);
              setKey(key);
            }}
            label="Submit"
          />
          <RegisterNavLink label="" link="/" linkText="Back" />
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
                // TODO: Notify user
                return;
              }

              const res = await resetPassword(username, password, key);
              if (!res) {
                // TODO: Notify user
                return;
              }

              console.log(res);
            }}
            label="Submit"
          />
          <RegisterNavLink label="" link="/" linkText="Go back to log In" />
        </>
      )}
    </AccountRegisterFormContainer>
  );
}
