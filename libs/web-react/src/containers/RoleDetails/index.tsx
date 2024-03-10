import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import uniq from 'lodash/uniq';
import * as utils from '../../utils';

import {
  loadPermissions,
  getPermissionsByRole,
  savePermissionMapping,
  loadUsers,
  loadUsersByRole,
  clearAddUserError,
  addUserToRole,
  removeUserToRole,
  updateCurrentRolePermissions,
} from '../../redux/authentication';
import BaseContainer from '../BaseContainer';
import { GLOBAL_OPTIONS } from '../../globals';

import './_role-details.scss';

const { translate } = utils.translate;

class RoleDetails extends BaseContainer {
  props: any;
  state: any;
  tabs: any;
  permissionTabs: any;
  static propTypes:any;
  constructor(props) {
    super(props);
    this.state = {
      currentTab: GLOBAL_OPTIONS.permissionTypes.keys.PERMISSIONS,
      currentSelected: {},
      currentSort: 'priority_ASC',
    };
    this.tabs = GLOBAL_OPTIONS.permissionTypes.toArray();
    this.permissionTabs = [
      GLOBAL_OPTIONS.permissionTypes.keys.PERMISSIONS,
      GLOBAL_OPTIONS.permissionTypes.keys.LEFT_NAVIGATION,
    ];
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleOnSaveClick = this.handleOnSaveClick.bind(this);
    this.handleOnCheckChange = this.handleOnCheckChange.bind(this);
    this.onUserChange = this.onUserChange.bind(this);
    this.onButtonAdduserClick = this.onButtonAdduserClick.bind(this);
    this.onGridAction = this.onGridAction.bind(this);
  }

  async componentDidMount() {
    const { pageData } = this.props;
    this.props.commonActions.startLoading();
    const actions = [];
    actions.push(
      this.props.userActions.getPermissionsByRole(
        utils.queryString.query.get().code,
        pageData?.apiConfig?.getPermissionsByRole
      )
    );
    this.setState({
      roleCode: utils.queryString.query.get().code,
    });
    actions.push(
      this.props.userActions.loadUsers(
        {
          body: { isActive: true },
          source: 'ACTIVE_USERS',
          query: {
            pageSize: 10000,
          },
        },
        pageData?.apiConfig?.getUsers
      )
    );
    actions.push(
      this.props.userActions.loadPermissions(
        {},
        pageData?.apiConfig?.getPermissions
      )
    );

    actions.push(
      this.props.userActions.loadUsersByRole(
        {
          roleCode: utils.queryString.query.get().code,
        },
        pageData?.apiConfig?.roleMapping
      )
    );
    await Promise.all(actions);
    this.props.commonActions.stopLoading();
  }

  handleTabChange(data) {
    this.setState({
      currentTab: data.value,
    });
  }

  handleOnSaveClick() {
    const { pageData } = this.props;
    let allPerms = [];
    const currentRole = this.props.store.authentication.currentRole;
    Object.keys(currentRole.allPermissions).forEach((key) => {
      if (currentRole.allPermissions[key]) {
        allPerms = allPerms.concat(currentRole.allPermissions[key]);
      }
    });

    this.props.userActions.savePermissionMapping(
      {
        roleCode: this.state.roleCode,
        permissionCode: uniq(allPerms),
      },
      {...pageData?.apiConfig?.permissionMapping, userProfile: pageData?.apiConfig?.userProfile}
    );
  }

  handleOnCheckChange(key, data) {
    const { pageData } = this.props;
    this.props.userActions.updateCurrentRolePermissions(
      {
        key,
        data: data.value,
      },
      pageData?.apiConfig?.permissionMapping
    );
  }

  onUserChange(data) {
    this.setState({
      selectedUser: data.value,
    });
    this.props.userActions.clearAddUserError();
  }

  async onGridAction(row, value, column) {
    const { pageData } = this.props;
    switch (value.action) {
      case 'remove':
        await this.props.userActions.removeUserToRole({
          roleCode: this.state.roleCode,
          userId: row.userId,
        }, pageData?.apiConfig?.roleMapping);
        this.props.userActions.loadUsersByRole(
          {
            roleCode: utils.queryString.query.get().code,
          },
          pageData?.apiConfig?.roleMapping
        );
        break;
    }
  }

  async onButtonAdduserClick() {
    const { pageData } = this.props;
    if (this.state.selectedUser) {
      await this.props.userActions.addUserToRole({
        roleCode: this.state.roleCode,
        userId: this.state.selectedUser,
      }, pageData?.apiConfig.roleMapping);
      this.setState({
        selectedUser: '',
      });
      this.props.userActions.loadUsersByRole(
        {
          roleCode: this.state.roleCode,
        },
        pageData?.apiConfig?.roleMapping
      );
    }
  }

  render() {
    const { store, pageData } = this.props;
    const data = store.authentication.permissions
      ? store.authentication.permissions[this.state.currentTab]
      : undefined;
    const { currentRole } = this.props.store.authentication;
    const viewOnly = !!pageData?.viewOnly;
    const { Grid, Tabs, LinkButton, CheckboxList, Autocomplete, Button, Skeleton } =
      utils.storage.components.get();
    return (
      <div className="sq-role-details container-med">
        <div className="sq-role-details__container mt-wide">
          <div className="sq-role-details__header">
            <div className="sq-role-details__header-text">
              <h2>{currentRole?.roleName || 'No Name'}</h2>
            </div>
          </div>
          <Tabs
            options={this.tabs}
            onChange={this.handleTabChange}
            value={this.state.currentTab}
          />
          {!currentRole && <Skeleton styleName="permissions" />}
          {this.permissionTabs.indexOf(this.state.currentTab) > -1 && (
            <div className="sq-role-details__permissions-wrapper">
              {false && (
                <div className="sq-role-details__permissions-nav">
                  <List>
                    {data &&
                      Object.keys(data).map((key) => {
                        return (
                          <ListItem disablePadding key={key}>
                            <ListItemButton>
                              <ListItemText primary={key} />
                            </ListItemButton>
                          </ListItem>
                        );
                      })}
                  </List>
                </div>
              )}
              <div className="sq-role-details__permissions pt-wide">
                {data &&
                  Object.keys(data).map((key) => {
                    const innerData = data[key];
                    const uniQueKey = `${this.state.currentTab}_${key}`;
                    return (
                      <div
                        className="sq-role-details__group-wrapper"
                        key={uniQueKey}
                      >
                        <div className="sq-role-details__group-header">
                          <h3>{key}</h3>
                        </div>
                        <CheckboxList
                          disabled={viewOnly}
                          className="sq-role-details__permission-check"
                          options={innerData}
                          valueField="code"
                          textField="name"
                          onChange={(data, config) =>
                            this.handleOnCheckChange(uniQueKey, data)
                          }
                          value={currentRole?.allPermissions[uniQueKey]}
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
          {this.state.currentTab ===
            GLOBAL_OPTIONS.permissionTypes.keys.ASSIGN_USERS && (
            <div className="sq-role-details__users-wrapper">
              {!viewOnly && (
                <div className="sq-role-details__user-add">
                  <Autocomplete
                    label="User"
                    {...store.authentication.currentUserError}
                    onChange={this.onUserChange}
                    value={this.state.selectedUser}
                    textField="displayName"
                    valueField="emailId"
                    options={store.authentication.users}
                    className="sq-role-details__user-list"
                  />
                  <Button
                    className="mt-1"
                    disabled={!this.state.selectedUser}
                    buttonText={'Add'}
                    onClick={this.onButtonAdduserClick}
                  />
                </div>
              )}
              <Grid
                className="sq-basic-grid sq-basic-grid--default sq-basic-grid--rounded pt-wide"
                columns={[
                  {
                    name: 'icon',
                    cmpType: 'Icon',
                    className: 'col-icon',
                    component: {
                      textIcon: (row) => `${utils.string.getTwoChars(row.firstName)}`,
                      iconClass: 'sq-icon--square sq-icon--text-icon-accent',
                      variant: (row) => utils.accentColors.getColorByChar(utils.string.getTwoChars(row.firstName)),
                    },
                  },
                  {
                    name: 'fullName',
                    headerText: 'Name',
                    className: 'col-initial',
                  },
                  {
                    name: 'userId',
                    headerText: 'Email ID',
                    className: 'col-initial',
                  },
                  {
                    name: 'actions',
                    className: 'col-actions',
                    cmpType: 'MoreActions',
                    component: {
                      actions: [
                        {
                          cmpType: 'LinkButton',
                          iconName: 'deactivate',
                          disabled: viewOnly,
                          confirm: {
                            title: translate('Confirm'),
                            content: translate(
                              'Are you sure you want to remove this user?'
                            ),
                          },
                          iconColor: 'error',
                          action: 'remove',
                          buttonText: translate('Remove'),
                        },
                      ],
                    },
                  },
                ]}
                onAction={this.onGridAction}
                data={store.authentication.currentRoleUsers}
              />
            </div>
          )}
          {!viewOnly &&
            this.state.currentTab !==
              GLOBAL_OPTIONS.permissionTypes.keys.ASSIGN_USERS && (
              <div className="sq-role-details__actions mt-wide">
                <Button
                  size="large"
                  buttonText={'Save'}
                  onClick={this.handleOnSaveClick}
                />
                <LinkButton
                  buttonText={'Cancel'}
                  size="large"
                  type="Button"
                  variant="outlined"
                  to="roles"
                />
              </div>
            )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    userActions: {
      updateCurrentRolePermissions: (data, config) =>
        dispatch(updateCurrentRolePermissions(data, config)),
      removeUserToRole: (data, config) =>
        dispatch(removeUserToRole(data, config)),
      clearAddUserError: (data, config) =>
        dispatch(clearAddUserError(data, config)),
      addUserToRole: (data, config) => dispatch(addUserToRole(data, config)),
      loadUsers: (data, config) => dispatch(loadUsers(data, config)),
      loadPermissions: (data, config) =>
        dispatch(loadPermissions(data, config)),
      loadUsersByRole: (data, config) =>
        dispatch(loadUsersByRole(data, config)),
      savePermissionMapping: (data, config) =>
        dispatch(savePermissionMapping(data, config)),
      getPermissionsByRole: (roleCode, config) =>
        dispatch(getPermissionsByRole(roleCode, config)),
    },
  };
};

RoleDetails.propTypes = {
  raiseAction: PropTypes.func,
  store: PropTypes.object,
  commonActions: PropTypes.object,
  appActions: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
};

export { RoleDetails as Users };

export default connect(mapStateToProps, mapDispatchToProps)(RoleDetails);
