import "./App.css";
import store from "./store";
import { Register } from "./pages/Register";
import {
  AccountLoginForm,
  AccountRegisterForm,
  AccountResetPasswordForm,
} from "./components/Form";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import Toast from "./components/Toast";

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
  return (
    <Provider store={store}>
      <Toast />
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
