import toastReducer from "@/store/slice/toasts";
import { configureStore, Middleware } from "@reduxjs/toolkit";
import createScheduleFormReducer from "./slice/createScheduleForm";
import schedulesReducer from "./slice/schedules";
import settingsReducer from "./slice/settings";
import { setCache } from "@/utilities/cache";

const cacheMiddleware: Middleware<{}, any> =
  (store) => (next) => (action: any) => {
    const result = next(action);
    const state: AppStore = store.getState();
    const slice = action.type.split("/").at(0);
    if (slice === "scheduleSlice") {
      setCache(slice, state.schedules);
    } else if (slice === "settingsSlice") {
      setCache(slice, state.settings);
    }
    return result;
  };

const store = configureStore({
  reducer: {
    toast: toastReducer,
    createScheduleForm: createScheduleFormReducer,
    schedules: schedulesReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cacheMiddleware),
});

export type AppStore = ReturnType<typeof store.getState>;
export default store;
