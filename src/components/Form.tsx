import { RegisterButton } from "./Buttons";
import { TextInput, PasswordInput } from "./Input";
import { getFormData } from "../utilities/forms";
import {
  AccountRegisterFormContainer,
  RegisterNavLink,
  RegisterFormHeading,
} from "./Utilities";
import { getDeviceInfo, registerUser } from "../utilities/register";

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
      <RegisterButton onClick={() => {}} label="Log In" />
      <RegisterNavLink
        label="Haven't registered?"
        link="/"
        linkText="Register"
      />
    </AccountRegisterFormContainer>
  );
}

export function AccountForgotPasswordForm() {
  return (
    <AccountRegisterFormContainer>
      <RegisterFormHeading text="Forgot password" />
      <TextInput label="KEY code" placeholder="Enter KEY code" />
      <RegisterButton onClick={() => {}} label="Submit" />
      <RegisterNavLink label="" link="/" linkText="Back" />
    </AccountRegisterFormContainer>
  );
}

export function AccountResetPasswordForm() {
  return (
    <AccountRegisterFormContainer>
      <RegisterFormHeading text="Reset Password" />
      <PasswordInput label="Password" placeholder="Enter new password" />
      <PasswordInput
        label="Confirm Password"
        placeholder="Enter password again"
      />
      <RegisterButton onClick={() => {}} label="Submit" />
      <RegisterNavLink label="" link="/" linkText="Go back to log In" />
    </AccountRegisterFormContainer>
  );
}
