import toastReducer from "@/store/slice/toasts";
import { configureStore } from "@reduxjs/toolkit";
import createScheduleFormReducer from "./slice/createScheduleForm";
import schedulesReducer from "./slice/schedules";
import settingsReducer from "./slice/settings";

const store = configureStore({
  reducer: {
    toast: toastReducer,
    createScheduleForm: createScheduleFormReducer,
    schedules: schedulesReducer,
    settings: settingsReducer,
  },
});

export type AppStore = ReturnType<typeof store.getState>;
export default store;
