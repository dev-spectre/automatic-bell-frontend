import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RawToast, ToastId, Toast, ToastState } from "@/types";

const toastSlice = createSlice({
  name: "toasts",
  initialState: {
    id: 0,
    toast: [],
  } satisfies ToastState as ToastState,
  reducers: {
    addToast: (state, action: PayloadAction<RawToast>) => {
      const toast: Toast = {
        id: state.id,
        ...action.payload,
      };

      state.toast.push(toast);
      state.id++;
    },

    removeToast: (state, action: PayloadAction<ToastId>) => {
      const id = action.payload.id;
      state.toast = state.toast.filter((toast) => toast.id != id);
    },

    clearToasts: (state) => {
      state.id = 0;
      state.toast = [];
    },
  },
});

export const { addToast, removeToast, clearToasts } = toastSlice.actions;
export default toastSlice.reducer;
