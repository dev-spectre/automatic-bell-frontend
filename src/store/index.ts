import toastReducer from "@/store/slice/toasts";
import { configureStore } from "@reduxjs/toolkit";
import createScheduleFormReducer from "./slice/createScheduleForm";
import schedulesReducer from "./slice/schedules";

const store = configureStore({
  reducer: {
    toast: toastReducer,
    createScheduleForm: createScheduleFormReducer,
    schedules: schedulesReducer,
  },
});

export type AppStore = ReturnType<typeof store.getState>;
export default store;
