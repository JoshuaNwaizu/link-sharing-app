import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ToastState {
  message: string | null;
  type: 'success' | 'error' | null;
}

const initialState: ToastState = {
  message: null,
  type: null,
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    setToast: (
      state,
      action: PayloadAction<{ message: string; type: 'success' | 'error' }>,
    ) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    clearToast: (state) => {
      state.message = null;
      state.type = null;
    },
  },
});

export const { setToast, clearToast } = toastSlice.actions;
export default toastSlice.reducer;
