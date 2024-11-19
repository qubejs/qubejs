import { createSlice } from '@reduxjs/toolkit';
import adminConfig from '../../admin.config';
import { CONSTANTS } from '../../globals';
import * as utils from '../../utils';
import { showNotificationMessage } from '../common';
import { processParams, selectUserData, customHooks } from '../content';

const initialState: any = {
  contentData: {
    pageData: {
      title: 'Untitled Page',
    },
  },
};
const admin = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setMedia: (state: any, action: any) => {
      state.media = action.payload;
    },
    setMediaPage: (state: any, action: any) => {
      state.mediaPage = action.payload;
    },
    setContentPage: (state: any, action: any) => {
      state.contentData = action.payload;
    },
    setContentPages: (state: any, action: any) => {
      state.contentPages = action.payload;
    },
    setContentPagination: (state: any, action: any) => {
      state.contentPagesPagination = action.payload;
    },
    setFieldsMeta: (state: any, action: any) => {
      state.fieldsMeta = action.payload;
    },
    setContentTree: (state: any, action: any) => {
      state.contentTree = action.payload;
    },
    setRoot: (state: any, action: any) => {
      state.root = action.payload;
    },
  },
});

export const getPage =
  (payload, { url, method = 'post', params, hook, query }: any = {}) =>
  async (dispatch, getState) => {
    const result = await utils.apiBridge[method](
      processParams(
        {
          ...selectContentData(getState()),
          ...selectUserData(getState()),
          ...payload,
        },
        { url: url || adminConfig.apis.getPage }
      ).url,
      params
        ? processParams(
            { ...selectContentData(getState()), ...selectUserData(getState()) },
            params,
            undefined,
            getState()
          )
        : payload,
      undefined,
      processParams(
        { ...selectContentData(getState()), ...selectUserData(getState()) },
        query,
        undefined,
        getState()
      )
    );
    if (result.status === CONSTANTS.STATUS.SUCCESS) {
      if (hook) {
        result.data = await customHooks.execute(hook, result);
      }
      await dispatch(setContentPage(result.data));
    }
  };
export const createPage = () => async (dispatch, getState) => {
  await dispatch(setContentPage(initialState.contentData));
};
export const getFieldsMeta =
  (payload, { url, method = 'post', params, query, hook }: any = {}) =>
  async (dispatch, getState) => {
    if (url && method) {
      const result = await utils.apiBridge[method](
        processParams(
          {
            ...selectContentData(getState()),
            ...selectUserData(getState()),
            ...payload,
          },
          { url }
        ).url,
        params
          ? processParams(
              {
                ...selectContentData(getState()),
                ...selectUserData(getState()),
              },
              params,
              undefined,
              getState()
            )
          : payload,
        undefined,
        processParams(
          { ...selectContentData(getState()), ...selectUserData(getState()) },
          query,
          undefined,
          getState()
        )
      );
      if (result.status === CONSTANTS.STATUS.SUCCESS) {
        if (hook) {
          result.data = await customHooks.execute(hook, result);
        }
        await dispatch(setFieldsMeta(result.data));
      }
    }
  };

export const loadPageTree =
  (payload, options: any = {}) =>
  async (dispatch, getState) => {
    const { url, method = 'post', hook, params, query } = options;
    const result = await utils.apiBridge[method](
      processParams(
        {
          ...selectContentData(getState()),
          ...selectUserData(getState()),
          ...payload,
        },
        { url: url || adminConfig.apis.getContentTree }
      ).url,
      params
        ? processParams(
            {
              ...selectUserData(getState()),
              ...payload,
            },
            params,
            undefined,
            getState()
          )
        : payload,
      undefined,
      processParams(
        {
          ...selectUserData(getState()),
          ...payload,
        },
        query,
        undefined,
        getState()
      )
    );
    if (hook) {
      result.data = await customHooks.execute(hook, result, options);
    }
    if (result.status === CONSTANTS.STATUS.SUCCESS) {
      await dispatch(setContentTree(result.data));
    }
  };

export const loadPagesByPath =
  (payload, options: any = {}, query2?) =>
  async (dispatch, getState) => {
    const {
      url,
      method = 'post',
      params,
      hook,
      query = { pageNo: '.pageNo', pageSize: '.pageSize' },
    } = options;
    const result = await utils.apiBridge[method](
      processParams(
        {
          ...selectContentData(getState()),
          ...selectUserData(getState()),
          ...payload,
        },
        { url: url || adminConfig.apis.getPageByPath }
      ).url,
      params
        ? processParams(
            {
              ...selectUserData(getState()),
              ...payload,
              ...query2,
            },
            params,
            undefined,
            getState()
          )
        : payload,
      undefined,
      {
        ...processParams(
          {
            ...selectUserData(getState()),
            ...payload,
            ...query2,
          },
          query,
          undefined,
          getState()
        ),
      }
    );
    if (result.status === CONSTANTS.STATUS.SUCCESS) {
      if (hook) {
        result.data = await customHooks.execute(hook, result, options);
      }
      const pageData: any = {
        total: result.data?.total || result.data?.totalItems,
        pageSize: result.data.pageSize,
        currentPage: result.data.currentPage,
        isLast: result.data.last,
        totalPages: result.data.totalPages,
      };
      await dispatch(setContentPages(result.data.pages));
      await dispatch(setContentPagination(pageData));
    }
  };

export const copyMediaLink = (payload) => async (dispatch, getState) => {
  navigator.clipboard.writeText(payload);
  dispatch(
    showNotificationMessage({
      message: 'Media link has been copied.',
      type: 'success',
    })
  );
};

export const deleteLink =
  (payload, { url, params, method = 'delete', hook }: any = {}) =>
  async (dispatch, getState) => {
    const result = await utils.apiBridge[method](
      processParams(
        {
          ...selectContentData(getState()),
          ...selectUserData(getState()),
          ...payload,
        },
        { url: url || adminConfig.apis.deleteMedia }
      ).url,
      params
        ? processParams(
            {
              ...selectContentData(getState()),
              ...selectUserData(getState()),
              ...payload,
            },
            params,
            undefined,
            getState()
          )
        : payload
    );
    if (result.status === CONSTANTS.STATUS.SUCCESS) {
      if (hook) {
        result.data = await customHooks.execute(hook, result);
      }
      await dispatch(
        showNotificationMessage({
          message: 'Media link has been deleted.',
          type: 'success',
        })
      );
      return;
    }
  };

export const updateMedia =
  (payload, { url, params, method = 'patch', hook }: any = {}) =>
  async (dispatch, getState) => {
    const result = await utils.apiBridge[method](
      processParams(
        {
          ...selectContentData(getState()),
          ...selectUserData(getState()),
          ...payload,
        },
        { url: url || adminConfig.apis.updateMedia }
      ).url,
      params
        ? processParams(
            {
              ...selectContentData(getState()),
              ...selectUserData(getState()),
              ...payload,
            },
            params,
            undefined,
            getState()
          )
        : payload
    );
    if (result.status === CONSTANTS.STATUS.SUCCESS) {
      if (hook) {
        result.data = await customHooks.execute(hook, result);
      }
      await dispatch(
        showNotificationMessage({
          message: 'Media updated successfully.',
          type: 'success',
        })
      );
      return;
    }
  };

export const uploadMedia =
  (payload, { url, params, hook }: any = {}) =>
  async (dispatch, getState) => {
    const response: any = {};
    if (payload.data) {
      const formData = new FormData();
      payload.data.files.forEach((file) => {
        formData.append('file', file);
      });
      response.status = 'success';
      response.data = {};
      const fileName = (payload.data.fileNames || payload.data.files).map(
        (i) => i.name
      );
      const contentType = {
        contentType: 'VIDEO',
        status: 'DRAFT',
      };
      if (!fileName.includes('.mp4')) {
        delete contentType['contentType'];
      }
      const result = await utils.apiBridge.rawPost(
        processParams(
          {
            ...selectContentData(getState()),
            ...selectUserData(getState()),
            ...payload,
          },
          { url: url || adminConfig.apis.uploadMedia }
        ).url,
        formData,
        {},
        {
          fileName: fileName,
          ...(params
            ? processParams(
                {
                  ...selectContentData(getState()),
                  ...selectUserData(getState()),
                },
                params,
                undefined,
                getState()
              )
            : {}),
          ...contentType,
        }
      );

      if (result.status === CONSTANTS.STATUS.SUCCESS) {
        if (hook) {
          result.data = await customHooks.execute(hook, result);
        }
        dispatch(
          showNotificationMessage({
            message: 'Uploaded media successfully',
          })
        );
        payload.success(result.data.files);
      } else {
        dispatch(
          showNotificationMessage({
            message: 'Upload media failed',
            type: 'error',
          })
        );
      }
    }
  };

export const loadMedia =
  (
    { body, query }: any = {},
    { url, method = 'post', params, hook }: any = {}
  ) =>
  async (dispatch, getState) => {
    const result = await utils.apiBridge[method](
      processParams(
        {
          ...selectContentData(getState()),
          ...selectUserData(getState()),
          ...body,
        },
        { url: url || adminConfig.apis.searchMedia }
      ).url,
      params
        ? processParams(
            {
              ...selectContentData(getState()),
              ...selectUserData(getState()),
              ...body,
            },
            params,
            undefined,
            getState()
          )
        : body,
      undefined,
      processParams(
        { ...selectContentData(getState()), ...selectUserData(getState()) },
        query,
        undefined,
        getState()
      )
    );
    if (result.status === CONSTANTS.STATUS.SUCCESS) {
      if (hook) {
        result.data = await customHooks.execute(hook, result);
      }
      const pageData: any = {
        pageSize: result.data.pageSize,
        currentPage: result.data.currentPage,
        isFirst: result.data.first,
        isLast: result.data.last,
        totalPages: result.data.totalPages,
      };
      await dispatch(setMedia(result.data.data));
      await dispatch(setMediaPage(pageData));
    }
  };

export const savePageDraft =
  (
    payload,
    { url, method = 'patch', params, hook, autoSave, query }: any = {}
  ) =>
  async (dispatch, getState) => {
    const result = await utils.apiBridge[method](
      processParams(
        {
          ...selectContentData(getState()),
          ...selectUserData(getState()),
          ...payload,
        },
        { url: url || adminConfig.apis.contentPage }
      ).url,
      params
        ? processParams(
            {
              ...selectContentData(getState()),
              ...selectUserData(getState()),
              ...payload,
            },
            params,
            undefined,
            getState()
          )
        : payload,
      undefined,
      processParams(
        { ...selectContentData(getState()), ...selectUserData(getState()) },
        query,
        undefined,
        getState()
      )
    );
    if (result.status === CONSTANTS.STATUS.SUCCESS) {
      !autoSave &&
        dispatch(
          showNotificationMessage({
            message: 'Page saved successfully',
          })
        );
      if (hook) {
        result.data = await customHooks.execute(hook, result);
      }
      await dispatch(setContentPage(result.data));
    }
  };
export const deletePage =
  (payload, { url, method = 'delete', params, hook, query }: any = {}) =>
  async (dispatch, getState) => {
    const result = await utils.apiBridge[method](
      processParams(
        {
          ...selectContentData(getState()),
          ...selectUserData(getState()),
          ...payload,
        },
        { url: url || adminConfig.apis.contentPage }
      ).url,
      params
        ? processParams(
            {
              ...selectContentData(getState()),
              ...selectUserData(getState()),
              ...payload,
            },
            params,
            undefined,
            getState()
          )
        : { uid: payload.uid },
      undefined,
      processParams(
        { ...selectContentData(getState()), ...selectUserData(getState()) },
        query,
        undefined,
        getState()
      )
    );
    if (result.status === CONSTANTS.STATUS.ERROR) {
      dispatch(
        showNotificationMessage({
          message: 'Can\'t delete page',
        })
      );
    }
    if (result.status === CONSTANTS.STATUS.SUCCESS) {
      dispatch(
        showNotificationMessage({
          message: 'Page deleted successfully',
        })
      );
      if (hook) {
        result.data = await customHooks.execute(hook, result);
      }
      await dispatch(setContentPage(result.data));
    }
  };
export const clonePage =
  (
    payload,
    { url, method = 'post', params, hook, query }: any = {},
    { success, error }: any = {}
  ) =>
  async (dispatch, getState) => {
    const result = await utils.apiBridge[method](
      processParams(
        {
          ...selectContentData(getState()),
          ...selectUserData(getState()),
          ...payload,
        },
        { url: url || adminConfig.apis.clonePage }
      ).url,
      params
        ? processParams(
            {
              ...selectContentData(getState()),
              ...selectUserData(getState()),
              ...payload,
            },
            params,
            undefined,
            getState()
          )
        : { from: payload.from, to: payload.to, type: payload.type },
      undefined,
      processParams(
        { ...selectContentData(getState()), ...selectUserData(getState()) },
        query,
        undefined,
        getState()
      )
    );
    if (result.status === CONSTANTS.STATUS.SUCCESS) {
      dispatch(
        showNotificationMessage({
          message: 'Page cloned successfully',
        })
      );
      if (hook) {
        result.data = await customHooks.execute(hook, result);
      }
      await dispatch(setContentPage(result.data));
      success && success(result);
    } else {
      error && error(result);
    }
  };
export const selectContentData = (state) => {
  return state.admin.contentData;
};


customHooks.add('admin', {
  afterPageCreate: (result, { dispatch }) => {
    if (result.status === CONSTANTS.STATUS.SUCCESS) {
      switch (result.data.type) {
        case CONSTANTS.contentType.PAGE:
          utils.redirect.redirectTo('editPage', { path: result.data.path });
          break;
        case CONSTANTS.contentType.SITE_MAP:
          utils.redirect.redirectTo('editSiteMap', { path: result.data.path });
          break;
      }
    }
    return result;
  },
});

export const {
  setRoot,
  setContentPage,
  setContentTree,
  setContentPages,
  setContentPagination,
  setFieldsMeta,
  setMedia,
  setMediaPage,
}: any = admin.actions;

export default admin.reducer;
