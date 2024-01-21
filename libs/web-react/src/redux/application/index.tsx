import { createSlice } from '@reduxjs/toolkit';

const application = createSlice({
  name: 'application',
  initialState: {
    appLoaded: false,
    theme: 'main',
  },
  reducers: {
    setAppLoaded: (state: any) => {
      state.appLoaded = true;
    },
  },
});

export const { setAppLoaded } = application.actions;
export default application.reducer;
