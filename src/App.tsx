import "./App.css";
import {
  AccountLoginForm,
  AccountRegisterForm,
  AccountForgotPasswordForm,
  AccountResetPasswordForm,
} from "./components/Form";

function App() {
  return (
    <div className="flex flex-col gap-4">
      <AccountRegisterForm />
      <AccountLoginForm />
      <AccountForgotPasswordForm />
      <AccountResetPasswordForm />
    </div>
  );
}

export default App;
