import { createSlice } from '@reduxjs/toolkit';
import domain from '../../domain';
import {
  processParams,
  selectUserData,
  updateProtectedUserData,
  customHooks,
} from '../content';
import uniq from 'lodash/uniq';
import groupBy from 'lodash/groupBy';
import { GLOBAL_OPTIONS, CONSTANTS } from '../../globals';
import * as utils from '../../utils';
import adminConfig from '../../admin.config';
import { showNotificationMessage } from '../common';
const initialState = {
  currentUser: null,
};

const authentication = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setUser: (state: any, action: any) => {
      state.currentUser = action.payload;
    },
    setUsers: (state: any, action: any) => {
      state.users = action.payload;
    },
    setAllRoles: (state: any, action: any) => {
      state.allRoles = action.payload;
    },
    setAllRolesPages: (state: any, action: any) => {
      state.allRolesPages = action.payload;
    },
    setRoles: (state: any, action: any) => {
      state.roles = action.payload;
    },
    setPermissions: (state: any, action: any) => {
      state.permissions = action.payload;
    },
    setCurrentRole: (state: any, action: any) => {
      state.currentRole = action.payload;
    },
    clearAddUserError: (state: any) => {
      state.currentUserError = {};
    },
    updateCurrentRolePermissions: (state: any, action: any) => {
      state.currentRole.allPermissions = {
        ...state.currentRole.allPermissions,
        [action.payload.key]: action.payload.data,
      };
    },
    setRoleUsers: (state: any, action: any) => {
      state.currentRoleUsers = action.payload;
    },
    setAddUserError: (state: any, action?: any) => {
      state.currentUserError = {
        error: true,
        ...action.payload,
      };
    },
    setUserPagination: (state: any, action: any) => {
      state.usersPagination = action.payload;
    },
    setPreference: (state: any, action: any) => {
      state.currentUserPreference = action.payload;
    },
  },
});

customHooks.add('authentication', {
  login: async (response, { payload, dispatch, state }) => {
    if (response.status === CONSTANTS.STATUS.SUCCESS) {
      if (response.data.token) {
        utils.cookie.add('qjs-token', response.data.token);
        utils.apiBridge.addHeader('qjs-token', `${response.data.token}`);
      }
      await dispatch(setUser(response.data));
      await dispatch(updateProtectedUserData({ currentUser: response.data }));

      await dispatch(loadUserProfile());
      const returnUrl = utils.queryString.query.get().returnUrl;
      if (returnUrl) {
        utils.redirect.redirectTo(returnUrl);
        return response;
      }
      utils.redirect.redirectTo('adminDashboard');
    }
    return response;
  },
  loadUserProfile: async (response, { dispatch }) => {
    dispatch(loadUserProfile());
  },
});
export const loadUserProfile = (userProfile?) => async (dispatch) => {
  // console.log(getState().content.userData);
  const response = await utils.apiBridge[userProfile?.method || 'get'](
    userProfile?.url || adminConfig.apis.userInfo,
    {}
  );
  if (
    response.status !== CONSTANTS.STATUS.SUCCESS &&
    utils.cookie.get('qjs-token')
  ) {
    utils.cookie.remove('qjs-token');
    await dispatch(
      showNotificationMessage({
        message: response.error.errorMessage || 'Unauthorized',
        type: 'error',
      })
    );
    await dispatch(clearUser());
    await dispatch(
      updateProtectedUserData({
        currentUser: undefined,
        currentUserPreference: undefined,
      })
    );
  } else if (response.status === CONSTANTS.STATUS.SUCCESS) {
    response.data.userInfo.roles = response.data.permissions
      ? uniq(response.data.permissions.map((a) => a.roleCode))
      : [];
    response.data.userInfo.allPermissions = response.data.permissions
      ? response.data.permissions
          .reduce((a, b) => {
            return a.concat(b.permission);
          }, [])
          .map((a) => a.code)
      : [];
    await dispatch(setUser(response.data.userInfo));
    await dispatch(setPreference(response.data.preference));
    await dispatch(
      updateProtectedUserData({
        currentUser: response.data.userInfo,
        currentUserPreference: response.data.preference,
      })
    );
  }
};

export const logout = () => (dispatch) => {
  dispatch(
    updateProtectedUserData({
      isLoggedOut: true,
    })
  );
};
export const clearUser = () => (dispatch) => {
  utils.cookie.remove('qjs-token');
  utils.apiBridge.removeHeader('qjs-token');
  setTimeout(() => {
    dispatch(setUser(null));
    dispatch(
      updateProtectedUserData({
        currentUser: null,
        currentUserPreference: null,
      })
    );
  }, 200);
};

export const loadRoles =
  (payload = {}, { url }: any = {}) =>
  async (dispatch) => {
    const response = await utils.apiBridge.get(
      url || adminConfig.apis.userRoles,
      payload
    );
    if (response.status === CONSTANTS.STATUS.SUCCESS) {
      dispatch(
        setRoles({
          [GLOBAL_OPTIONS.roleTabs.keys.ALL_ROLES]: response.data,
        })
      );
    }
  };

export const showAllRoles =
  (payload, { url }) =>
  async (dispatch) => {
    const response = await utils.apiBridge.post(
      url || adminConfig.apis.searchRole,
      { ...payload.body },
      {},
      payload.query
    );
    if (response.status === CONSTANTS.STATUS.SUCCESS) {
      const data: any = {
        [GLOBAL_OPTIONS.roleTabs.keys.ALL_ROLES]: response.data,
      };
      const pageData: any = {
        total: response.data?.totalItems,
        pageSize: response.data.pageSize,
        currentPage: response.data.currentPage,
        isLast: response.data.last,
        totalPages: response.data.totalPages,
      };
      await dispatch(setAllRoles(data));
      await dispatch(setAllRolesPages(pageData));
    }
  };

export const removeUserToRole =
  (payload, { url }: any = {}) =>
  async (dispatch) => {
    const response = await utils.apiBridge.delete(
      url || adminConfig.apis.roleMapping,
      payload
    );
    if (response.status === CONSTANTS.STATUS.SUCCESS) {
      await dispatch(
        showNotificationMessage({
          message: 'User removed successfully',
          type: 'success',
        })
      );
    }
  };

export const removeRole =
  (payload, { url }: any = {}) =>
  async (dispatch) => {
    const response = await utils.apiBridge.delete(
      url || adminConfig.apis.userRoles,
      payload
    );
    if (response.status === CONSTANTS.STATUS.SUCCESS) {
      await dispatch(
        showNotificationMessage({
          message: 'Role removed successfully',
          type: 'success',
        })
      );
    }
  };
export const hasPermission = (permission, state) => {
  return (
    state?.authentication?.currentUser?.allPermissions?.indexOf(permission) > -1
  );
};
const populateFullName = (data) => {
  return data.map((i) => {
    return {
      ...i,
      fullName: `${i.firstName} ${i.lastName}`,
      displayName: `${i.firstName} ${i.lastName} (${i.emailId})`,
    };
  });
};

export const loadUsers =
  (payload, { url }: any = {}) =>
  async (dispatch) => {
    const response = await utils.apiBridge.post(
      url || adminConfig.apis.searchUsers,
      { ...payload.body },
      {},
      payload.query
    );
    if (response.status === CONSTANTS.STATUS.SUCCESS) {
      const pagination: any = {
        total: response.data?.totalItems,
        pageSize: response.data.pageSize,
        currentPage: response.data.currentPage,
        isLast: response.data.last,
        totalPages: response.data.totalPages,
      };
      response.data.data = populateFullName(response.data.data);
      await dispatch(setUsers(response.data.data));
      await dispatch(setUserPagination(pagination));
    }
  };

export const loadUsersByRole =
  (payload, { url }: any = {}) =>
  async (dispatch, getState) => {
    const response = await utils.apiBridge.get(
      url || adminConfig.apis.getUsersByRole,
      {
        roleCode: payload.roleCode,
      }
    );
    dispatch(setRoleUsers(response.data));
  };
export const loadAllUsers = (payload) => async (dispatch, getState) => {
  const response = await utils.apiBridge.get(
    adminConfig.apis.getUsersByRole,
    { ...payload.body },
    {},
    payload.query
  );
  dispatch(setRoleUsers(response.data));
};
export const getProperty = (payload) => async (dispatch, getState) => {
  const response = await utils.apiBridge.post(
    adminConfig.apis.getPropertyList,
    { ...payload.body },
    {},
    payload.query
  );
  dispatch(setUsers(response.data));
};
export const addUserToRole =
  (payload, { url }: any = {}) =>
  async (dispatch, getState) => {
    const response = await utils.apiBridge.post(
      url || adminConfig.apis.roleMapping,
      payload
    );
    if (response.status === CONSTANTS.STATUS.SUCCESS) {
      await dispatch(
        showNotificationMessage({
          message: 'User added saved successfully',
          type: 'success',
        })
      );
    } else if (response.validationError?.key === 'CODE_IS_DUPLICATE') {
      await dispatch(
        setAddUserError({
          errorMessage: 'User already exists',
        })
      );
    }
  };

export const savePermissionMapping =
  (payload, { url, userProfile }: any = {}) =>
  async (dispatch, getState) => {
    const response = await utils.apiBridge.post(
      url || adminConfig.apis.savePermissionByRole,
      payload
    );
    if (response.status === CONSTANTS.STATUS.SUCCESS) {
      await dispatch(
        showNotificationMessage({
          message: 'Permssions saved successfully',
          type: 'success',
        })
      );
      await dispatch(loadUserProfile(userProfile));
      utils.redirect.redirectTo('viewRoles');
    } else {
      await dispatch(
        showNotificationMessage({
          message: 'Something went wrong',
          type: 'error',
        })
      );
    }
  };
export const loadPermissions =
  (payload, { url }: any = {}) =>
  async (dispatch) => {
    const response = await utils.apiBridge.get(
      url || adminConfig.apis.getAllPermissions,
      {}
    );
    const filterable = new domain.collection.Filterable(response.data);
    const obj: any = {
      [GLOBAL_OPTIONS.permissionTypes.keys.PERMISSIONS]: groupBy(
        filterable
          .filterBy({
            groupTypeCode: GLOBAL_OPTIONS.permissionTypes.keys.PERMISSIONS,
          })
          .toArray(),
        'groupName'
      ),
      [GLOBAL_OPTIONS.permissionTypes.keys.LEFT_NAVIGATION]: groupBy(
        filterable
          .filterBy({
            groupTypeCode: GLOBAL_OPTIONS.permissionTypes.keys.LEFT_NAVIGATION,
          })
          .toArray(),
        'groupName'
      ),
    };
    dispatch(setPermissions(obj));
  };

export const getPermissionsByRole =
  (roleCode, { url }: any = {}) =>
  async (dispatch) => {
    const response = await utils.apiBridge.post(
      url || adminConfig.apis.searchPermissionsMapping,
      {
        roleCode,
      }
    );

    if (response.status === CONSTANTS.STATUS.SUCCESS) {
      const dataObj = { ...response.data };
      dataObj.allPermissions = {};
      response.data?.permission &&
        response.data.permission.forEach((perm) => {
          const uniQKey = `${perm.groupTypeCode}_${perm.groupName}`;
          if (dataObj.allPermissions[uniQKey]) {
            dataObj.allPermissions[uniQKey].push(perm.code);
          } else {
            dataObj.allPermissions[uniQKey] = [perm.code];
          }
        });
      dispatch(setCurrentRole(dataObj));
    } else {
      dispatch(
        showNotificationMessage({
          message: 'Failed to get permissions',
          type: 'error',
        })
      );
    }
  };

export const deactivateUser =
  (payload, config = {}) =>
  async (dispatch, getState) => {
    const { url }: any = processParams(
      { ...selectUserData(getState()), ...payload },
      config
    );
    const response = await utils.apiBridge.patch(
      url || `${adminConfig.apis.user}/${payload.emailId}/deactivate`
    );
    if (response.status === CONSTANTS.STATUS.SUCCESS) {
      await dispatch(
        showNotificationMessage({
          message: 'User deactivate successfully',
          type: 'success',
        })
      );
    }
  };
export const deleteUser =
  (payload, config = {}) =>
  async (dispatch, getState) => {
    const { url }: any = processParams(
      { ...selectUserData(getState()), ...payload },
      config
    );
    const response = await utils.apiBridge.delete(
      url || `${adminConfig.apis.user}/${payload.emailId}/delete`
    );
    if (response.status === CONSTANTS.STATUS.SUCCESS) {
      await dispatch(
        showNotificationMessage({
          message: 'User deleted successfully',
          type: 'success',
        })
      );
    }
  };

export const reactivateUser =
  (payload, config = {}) =>
  async (dispatch, getState) => {
    const { url }: any = processParams(
      { ...selectUserData(getState()), ...payload },
      config
    );
    const response = await utils.apiBridge.patch(
      url || `${adminConfig.apis.user}/${payload.emailId}/activate`
    );
    if (response.status === CONSTANTS.STATUS.SUCCESS) {
      await dispatch(
        showNotificationMessage({
          message: 'User activate successfully',
          type: 'success',
        })
      );
    }
  };

export const resetPassword =
  (payload, config = {}) =>
  async (dispatch, getState) => {
    const { url }: any = processParams(
      { ...selectUserData(getState()), ...payload },
      config
    );
    const response = await utils.apiBridge.patch(
      url || `${adminConfig.apis.user}/${payload.emailId}/resetPassword`
    );
    if (response.status === CONSTANTS.STATUS.SUCCESS) {
      await dispatch(
        showNotificationMessage({
          message: 'Password reset completed successfully.',
          type: 'success',
        })
      );
    }
  };

export const {
  setUser,
  setRoles,
  setUsers,
  setUserPagination,
  setPreference,
  setAllRoles,
  setAllRolesPages,
  setAddUserError,
  setCurrentRole,
  setPermissions,
  setRoleUsers,
  updateCurrentRolePermissions,
  clearAddUserError,
}:any = authentication.actions;

export default authentication.reducer;
