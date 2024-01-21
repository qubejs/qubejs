import { createSlice } from '@reduxjs/toolkit';
import { CONSTANTS } from '../../globals';
import * as utils from '../../utils';
import adminConfig from '../../admin.config';
const initialState = {
  users: null,
};

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

// customHooks.add('user', {});
export const loadUsers = () => async (dispatch) => {
  const result = await utils.apiBridge.post(adminConfig.apis.getUsers, {});
  if (result.status === CONSTANTS.STATUS.SUCCESS) {
    dispatch(setUsers(result.data.users));
  }
};

export const { setUsers }:any = user.actions;

export default user.reducer;
