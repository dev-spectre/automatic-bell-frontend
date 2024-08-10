import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CreateScheduleFormState,
  CreateScheduleFormStatePushPayload,
  CreateScheduleFormStateRemovePayload,
} from "@/types";

const createScheduleFormSlice = createSlice({
  name: "createScheduleForm",
  initialState: {
    mode: {
      max: -Infinity,
      values: {},
    },
  } satisfies CreateScheduleFormState as CreateScheduleFormState,
  reducers: {
    setMode: (state, action: PayloadAction<CreateScheduleFormStatePushPayload>) => {
      const { type, value } = action.payload;
      state.mode.values[value] = type;
      if (value > state.mode.max) state.mode.max = value;
    },
    remove: (state, action: PayloadAction<CreateScheduleFormStateRemovePayload>) => {
      const { value } = action.payload;
      for (let i = state.mode.max; i > value; i--) {
        state.mode.values[i - 1] = state.mode.values[i];
      }
      delete state.mode.values[state.mode.max];
      state.mode.max--;
    },
  },
});

export const { setMode, remove } = createScheduleFormSlice.actions;
export default createScheduleFormSlice.reducer;
