import toastReducer from "@/store/slice/toasts";
import { configureStore } from "@reduxjs/toolkit";
import createScheduleFormReducer from "./slice/createScheduleForm";
import sidebarReducer from "./slice/sidebar";

const store = configureStore({
  reducer: {
    toast: toastReducer,
    createScheduleForm: createScheduleFormReducer,
    sidebar: sidebarReducer
  },
});

export type AppStore = ReturnType<typeof store.getState>;
export default store;
