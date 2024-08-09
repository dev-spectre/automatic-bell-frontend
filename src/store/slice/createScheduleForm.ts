import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CreateScheduleFormState,
  CreateScheduleFormStatePayload,
} from "@/types";

const createScheduleFormSlice = createSlice({
  name: "createScheduleForm",
  initialState: {
    mode: {
      single: [],
      repeat: [],
    },
  } satisfies CreateScheduleFormState as CreateScheduleFormState,
  reducers: {
    setMode: (state, action: PayloadAction<CreateScheduleFormStatePayload>) => {
      const { type, value } = action.payload;
      if (type === "single") {
        const index = state.mode.repeat.indexOf(value);
        if (index !== -1) state.mode.repeat.splice(index, 1);
      }
      if (type === "repeat") {
        const index = state.mode.single.indexOf(value);
        if (index !== -1) state.mode.single.splice(index, 1);
      }
      state.mode[type].push(value);
    },
  },
});

export const { setMode } = createScheduleFormSlice.actions;
export default createScheduleFormSlice.reducer;
