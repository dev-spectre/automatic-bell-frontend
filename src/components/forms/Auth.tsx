import { RegisterButton } from "@/components/Buttons";
import { TextInput, PasswordInput } from "@/components/Input";
import { getFormData } from "@/utilities/forms";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AccountRegisterFormContainer,
  RegisterNavLink,
  RegisterFormHeading,
} from "@/components/Utilities";
import {
  getDeviceInfo,
  registerUser,
  signInUser,
  resetPassword,
} from "@/utilities/register";
import { useAlert } from "@/hooks/alert";
import {
  COULDNT_CONNNECT_TO_DEVICE,
  INVALID_CRED,
  INVALID_FORMAT,
  PASSWORD_DOESNT_MATCH,
  UNKNOWN_ERR,
  USER_CREATED,
  USER_DOESNT_EXISTS,
  USER_EXISTS,
} from "@/constants/alert";

export function AccountRegisterForm() {
  const alert = useAlert();

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
            alert(PASSWORD_DOESNT_MATCH);
            return;
          }

          const key = formData["key-code"];
          const deviceInfo = await getDeviceInfo(key);
          if (!deviceInfo) {
            alert(COULDNT_CONNNECT_TO_DEVICE);
            return;
          }
          localStorage.setItem("deviceIp", deviceInfo.ip);

          const username = formData["user-id"];
          const res = await registerUser(username, password, key, deviceInfo);
          if (res.ok && res.data.deviceId) {
            const user = res.data;

            localStorage.setItem("userId", user.id.toString());
            localStorage.setItem("deviceId", user.deviceId.toString());
            localStorage.setItem("username", username);

            alert(USER_CREATED);
          } else if (res.ok && !res.data.deviceId) {
            alert({
              ...COULDNT_CONNNECT_TO_DEVICE,
              title: "Couldn't register",
            });
          } else if (!res.ok) {
            if (res.error === "RESOURCE_CONFLICT") {
              alert(USER_EXISTS);
            } else if (res.error === "INVALID_FORMAT") {
              alert(INVALID_FORMAT);
            }
          }
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
  const alert = useAlert();
  const navigate = useNavigate();

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

          const res = await signInUser(username, password);
          if (!res.ok) {
            if (res.error === "INVALID_CRED") {
              alert(INVALID_CRED);
            } else if (res.error === "DEVICE_ERR") {
              alert(COULDNT_CONNNECT_TO_DEVICE);
            } else if (res.error === "RESOURCE_NOT_FOUND") {
              alert(USER_DOESNT_EXISTS);
            } else {
              alert(UNKNOWN_ERR);
            }
          } else {
            navigate("/");
          }
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
  const alert = useAlert();

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
                alert(COULDNT_CONNNECT_TO_DEVICE);
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
                alert(PASSWORD_DOESNT_MATCH);
                return;
              }

              const res = await resetPassword(username, password, key);
              if (!res) {
                alert({
                  ...COULDNT_CONNNECT_TO_DEVICE,
                  title: "Couldn't reset password",
                });
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
