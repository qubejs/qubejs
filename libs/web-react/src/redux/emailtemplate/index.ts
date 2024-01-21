import { createSlice } from '@reduxjs/toolkit';
import {
  customHooks,
} from '../content';
import {  CONSTANTS } from '../../globals';
import * as utils from '../../utils';
import adminConfig from '../../admin.config';
const initialState:any = {
  currentUser: null,
};

const emailtemplate = createSlice({
  name: 'emailtemplate',
  initialState,
  reducers: {
    setTemplates: (state, action) => {
      state.templates = action.payload;
    },
    setTemplatesPagination: (state, action) => {
      state.templatesPagination = action.payload;
    },
  },
});

customHooks.add('emailtemplate', {

  // loadUserProfile: async (response, { dispatch }) => {
  //   dispatch(loadUserProfile());
  // },
});

export const loadTemplates =
  (payload, { url }:any = {}) =>
  async (dispatch) => {
    const response = await utils.apiBridge.post(
      url || adminConfig.apis.searchEmailTemplates,
      { ...payload.body },
      {},
      payload.query
    );
    if (response.status === CONSTANTS.STATUS.SUCCESS) {
      const pagination = {
        total: response.data?.totalItems,
        pageSize: response.data?.pageSize,
        currentPage: response.data?.currentPage,
        isLast: response.data?.last,
        totalPages: response.data?.totalPages,
      };
      await dispatch(setTemplates(response.data.data));
      await dispatch(setTemplatesPagination(pagination));
    }
  };


export const {
  setTemplates,
  setTemplatesPagination,
}:any = emailtemplate.actions;

export default emailtemplate.reducer;
