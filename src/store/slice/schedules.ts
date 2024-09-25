import {
  ScheduleStateAddPayload,
  ScheduleStateDeletePayload,
  Schedules,
} from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const scheduleSlice = createSlice({
  name: "scheduleSlice",
  initialState: {
    schedules: {} satisfies Schedules as Schedules,
    active: [] satisfies string[] as string[],
  },
  reducers: {
    addSchedules: (state, action: PayloadAction<ScheduleStateAddPayload>) => {
      action.payload.schedules.forEach(
        (schedule) =>
          (state.schedules[schedule.scheduleName] = schedule.schedules),
      );
    },

    removeSchedules: (
      state,
      action: PayloadAction<ScheduleStateDeletePayload>,
    ) => {
      action.payload.schedules.forEach((schedule) => {
        delete state.schedules[schedule];
      });
      state.active = state.active.filter(
        (value) => !action.payload.schedules.includes(value),
      );
    },

    addActiveSchedules: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach((value) => state.active.push(value));
    },

    removeActiveSchedules: (state, action: PayloadAction<string[]>) => {
      state.active = state.active.filter((value) =>
        action.payload.includes(value),
      );
    },
  },
});

export const { addSchedules, removeSchedules, addActiveSchedules, removeActiveSchedules } = scheduleSlice.actions;
export default scheduleSlice.reducer;
