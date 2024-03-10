import { createAsyncAction } from './redux-actions';

export const create = ({
  fetchContentPage = {
    data: {
      pageData: {},
    },
  },
  postApi = {
    status: 'success',
    statusCode: 200,
    data: {},
  },
  downloadApi = {
    status: 'success',
    statusCode: 200,
    data: {},
  },
  executeHook = {
    status: 'success',
    statusCode: 200,
    data: {},
  },
} = {}) => {
  return {
    fetchContentPage: createAsyncAction(fetchContentPage),
    postApi: jest.fn(() => Promise.resolve(postApi)),
    updateMetaData: jest.fn(() => Promise.resolve({})),
    downloadApi: jest.fn(() => Promise.resolve(downloadApi)),
    executeHook: jest.fn(() => Promise.resolve(executeHook)),
    resetUserData: jest.fn(),
    showNotificationMessage: jest.fn(),
    showPopup: jest.fn(),
    showPopupScreen: jest.fn(),
    updateUserData: jest.fn(),
    mergeUserData: jest.fn(),
  };
};
