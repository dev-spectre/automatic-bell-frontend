import { SideBarActiveState, SideBarState } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const sideBarSlice = createSlice({
  name: "sideBar",
  initialState: {
    active: "Dashboard",
  } satisfies SideBarState as SideBarState,
  reducers: {
    setActive: (state, action: PayloadAction<SideBarActiveState>) => {
      state.active = action.payload;
    },
  },
});

export const { setActive } = sideBarSlice.actions;
export default sideBarSlice.reducer;