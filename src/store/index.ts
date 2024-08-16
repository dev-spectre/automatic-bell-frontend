import toastReducer from "@/store/slice/toasts";
import { configureStore } from "@reduxjs/toolkit";
import createScheduleFormReducer from "./slice/createScheduleForm";

const store = configureStore({
  reducer: {
    toast: toastReducer,
    createScheduleForm: createScheduleFormReducer,
  },
});

export type AppStore = ReturnType<typeof store.getState>;
export default store;
