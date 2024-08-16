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
import { EditSchedule } from "./pages/EditSchedule";
import { AssignSchedule } from "./pages/AssignSchedule";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "schedule/create",
        element: <CreateSchedule />,
      },
      {
        path: "schedule/assign",
        element: <AssignSchedule />,
      },
      {
        path: "schedule/edit",
        element: <EditSchedule />,
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
        path: "login",
        element: <AccountLoginForm />,
      },
      {
        path: "signin",
        element: <AccountLoginForm />,
      },
      {
        path: "signup",
        element: <AccountRegisterForm />,
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
