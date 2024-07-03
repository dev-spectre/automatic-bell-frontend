import { RegisterButton } from "./Buttons";
import { TextInput, PasswordInput } from "./Input";
import {
  AccountRegisterFormContainer,
  RegisterNavLink,
  RegisterFormHeading,
} from "./Utilities";

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
      <RegisterButton onClick={() => {}} label="Register" />
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
      <PasswordInput label="Confirm Password" placeholder="Enter password again" />
      <RegisterButton onClick={() => {}} label="Submit" />
      <RegisterNavLink label="" link="/" linkText="Go back to log In" />
    </AccountRegisterFormContainer>
  )
}
