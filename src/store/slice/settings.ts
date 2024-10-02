import { UpdateSettingPayload, WlanCredential } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  network: {
    wlanCredentials: [] as WlanCredential[],
    connectionAttempts: NaN,
  },
  time: {
    offset: NaN,
  },
  schedule: {
    minGapBetweenRings: NaN,
    maxWaitForMissedschedule: NaN,
  },
};

const settingsSlice = createSlice({
  name: "settingsSlice",
  initialState,
  reducers: {
    updateSetting: (state, action: PayloadAction<UpdateSettingPayload>) => {
      const { path, value } = action.payload;
      const keys = path.split(".");
      let current: any = state;
      
      keys.slice(0, -1).forEach((key) => {
        current = current[key];
      });
      
      current[keys[keys.length - 1]] = value;
    },
    
    updateSettingsUnsafe: (
      state,
      action: PayloadAction<typeof initialState>,
    ) => {
      state.network = action.payload.network;
      state.schedule = action.payload.schedule;
      state.time = action.payload.time;
    },
  },
});

export type Config = typeof initialState;
export const { updateSetting, updateSettingsUnsafe } = settingsSlice.actions;
export default settingsSlice.reducer;
