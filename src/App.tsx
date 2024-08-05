import "./App.css";
import store from "./store";
import { Register } from "./pages/Register";
import { Root } from "./pages/Root";
import {
  AccountLoginForm,
  AccountRegisterForm,
  AccountResetPasswordForm,
} from "./components/Form";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import Toast from "./components/Toast";
import { CreateSchedule } from "./pages/createSchedule";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "schedule/create",
        element: <CreateSchedule />,
      },
    ],
  },
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
