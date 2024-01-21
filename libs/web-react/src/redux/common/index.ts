import { createSlice } from '@reduxjs/toolkit';
const initialState:any = {
  appLoaded: false,
  isLoading: false,
  error: {},
  notification: {},
  popup: {},
  popupScreen: {},
};
const common = createSlice({
  name: 'common',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    setError: (state, action) => {
      state.error.hasError = true;
      state.error.errorMessage = action.payload.message;
    },
    clearError: (state, action) => {
      state.error = {};
    },
    setNotification: (state, action) => {
      state.notification.message = action.payload.message;
      state.notification.type = action.payload.type;
      state.notification.show = true;
    },
    setNotificationTimeout: (state, action) => {
      state.notification.prevTimeout = action.payload;
    },
    setPopup: (state, action) => {
      state.popup.message = action.payload.message;
      state.popup.title = action.payload.title;
      state.popup.type = action.payload.type;
      state.popup.severity = action.payload.severity;
      state.popup.show = true;
    },
    closePopup: (state) => {
      state.popup = {};
      state.popup.show = false;
    },
    setPopupScreen: (state, action) => {
      const { name, title, dialogProps = {}, ...props } = action.payload;
      state.popupScreen.name = name;
      state.popupScreen.title = title;
      state.popupScreen.dialogProps = dialogProps;
      state.popupScreen.props = props;
      state.popupScreen.show = true;
    },
    closePopupScreen: (state) => {
      state.popupScreen = {};
      state.popupScreen.show = false;
    },
    setCloseNotification: (state) => {
      state.notification.show = false;
    },
  },
});

export const {
  setNotification,
  setNotificationTimeout,
  startLoading,
  stopLoading,
  setError,
  closePopup,
  clearError,
  closePopupScreen,
}:any = common.actions;

export const selectCurrentNotification = (state) => state.common.notification;

export const showNotificationMessage =
  (payload) => async (dispatch, getState) => {
    const { timeout = 3000 } = payload;
    const currentNotification = selectCurrentNotification(getState());
    currentNotification.prevTimeout &&
      clearTimeout(currentNotification.prevTimeout);
    await dispatch(setNotificationTimeout(null));
    await dispatch(setNotification(payload));
    const nextTimeout = setTimeout(() => {
      dispatch(closeNotification());
      payload.callback && payload.callback();
    }, timeout);
    await dispatch(setNotificationTimeout(nextTimeout));
  };
export const closeNotification = () => (dispatch, getState) => {
  const currentNotification = selectCurrentNotification(getState());
  currentNotification.prevTimeout &&
    clearTimeout(currentNotification.prevTimeout);
  dispatch(common.actions.setCloseNotification());
};

export const showPopup = (payload) => async (dispatch) => {
  await dispatch(common.actions.setPopup(payload));
};
export const showPopupScreen = (payload) => async (dispatch) => {
  await dispatch(common.actions.setPopupScreen(payload));
};

export const getParseJSON = (obj, isNull?) => {
  try {
    return typeof obj == 'string' ? JSON.parse(obj) : obj || (isNull ? undefined : {});
  } catch (e) {
    return obj || (isNull ? undefined : {});
  }
};

const getFilterKey = (prefix?) => `${ prefix || 'currentFilter'}_${ (window.location.pathname || "").split("/").join("_") }`;
const getSortKey = (prefix?) => `${prefix || 'currentSort'}_${ (window.location.pathname || "").split("/").join("_") }`;
export const getCurrentFilter = () => getParseJSON(window.localStorage.getItem(getFilterKey()));
export const setCurrentFilter = (data) => {
  data && window.localStorage.setItem(getFilterKey(), JSON.stringify(data));
};
export const getCustomKeyData = (key, isArray) => getParseJSON(window.localStorage.getItem(getFilterKey(key)), isArray);
export const setCustomKeyData = (key, data) => {
  data && window.localStorage.setItem(getFilterKey(key), JSON.stringify(data));
};
export const getCurrentSort = () => getParseJSON(window.localStorage.getItem(getSortKey()));
export const setCurrentSort = (data) => {
  data && window.localStorage.setItem(getSortKey(), JSON.stringify(data));
};
export const clearCurrentFilter = () => window.localStorage.removeItem(getFilterKey());
export const clearCurrentSort = () => window.localStorage.removeItem(getSortKey());
export const clearAllFilters = () => async () => {
  Object.keys(window.localStorage).forEach(key => {
    if (key.includes("currentFilter_") || key.includes("currentSort_")) {
      window.localStorage.removeItem(key);
    }
  });
};

export default common.reducer;
