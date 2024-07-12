import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Register } from "./pages/Register";
import {
  AccountLoginForm,
  AccountRegisterForm,
  AccountResetPasswordForm,
} from "./components/Form";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <Register />,
    children: [
      {
        path: "",
        element: <AccountLoginForm />,
      },
      {
        path: "signup",
        element: <AccountRegisterForm />,
      },
      {
        path: "login",
        element: <AccountLoginForm />,
      },
      {
        path: "password",
        element: <AccountResetPasswordForm />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
