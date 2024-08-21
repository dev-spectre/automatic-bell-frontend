import { ScheduleStateAddPayload, Schedules } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const scheduleSlice = createSlice({
  name: "scheduleSlice",
  initialState: {
    schedules: {} satisfies Schedules as Schedules,
  },
  reducers: {
    addSchedules: (state, action: PayloadAction<ScheduleStateAddPayload>) => {
      action.payload.schedules.forEach(
        (schedule) =>
          (state.schedules[schedule.scheduleName] = schedule.schedules),
      );
    },
  },
});

export const { addSchedules } = scheduleSlice.actions;
export default scheduleSlice.reducer;
