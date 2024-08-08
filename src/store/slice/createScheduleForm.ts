import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CreateScheduleFormState } from "@/types";

const createScheduleFormSlice = createSlice({
  name: "createScheduleForm",
  initialState: {
    mode: null,
  } satisfies CreateScheduleFormState as CreateScheduleFormState,
  reducers: {
    setMode: (state, action: PayloadAction<CreateScheduleFormState>) => {
      state.mode = action.payload.mode;
    },
  },
});

export const { setMode } = createScheduleFormSlice.actions;
export default createScheduleFormSlice.reducer;
