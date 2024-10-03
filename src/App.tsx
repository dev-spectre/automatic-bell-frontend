import "./App.css";
import store from "./store";
import { Register } from "./pages/Register";
import { Root } from "./pages/Root";
import {
  AccountLoginForm,
  AccountRegisterForm,
  AccountResetPasswordForm,
} from "./components/forms/Auth";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import Toast from "./components/Toast";
import { CreateSchedule } from "./pages/createSchedule";
import { EditSchedule } from "./pages/EditSchedule";
import { AssignSchedule } from "./pages/AssignSchedule";
import { Dashboard } from "./pages/Dashboard";
import { Settings } from "./pages/Settings";
import { Manual } from "./pages/Manual";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
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
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "manual",
        element: <Manual />,
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
