import { RegisterButton } from "./Buttons";
import { TextInput, PasswordInput } from "./Input";
import { AccountRegisterFormContainer, RegisterNavLink } from "./Utilities";

export function AccountRegisterForm() {
  return (
    <AccountRegisterFormContainer>
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


