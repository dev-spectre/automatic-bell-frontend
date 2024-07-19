import toastReducer from "@/store/slice/toasts";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    toast: toastReducer,
  },
});

export default store;
