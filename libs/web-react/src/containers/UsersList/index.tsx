import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as utils from '../../utils';
import { GLOBAL_OPTIONS } from '../../globals';
import {
  loadRoles,
  hasPermission,
  loadUsers,
  reactivateUser,
  deactivateUser,
  deleteUser,
  resetPassword,
} from '../../redux/authentication';
import './_users-list.scss';

const { formatters } = utils.format;
const { translate } = utils.translate;
const defaultPageSize = GLOBAL_OPTIONS.noOfResultsDropdown.toArray()[0]?.value;

class Users extends React.Component {
  props: any;
  tabs: any;
  state: any;
  static propTypes: any;
  constructor(props) {
    super(props);
    this.state = {
      currentTab: GLOBAL_OPTIONS.userTabs.keys.ACTIVE_USERS,
      showFilters: false,
      currentFilter: {},
      currentSort: {
        sortColumn: 'firstName',
        sortOrder: 'asc',
        showEditColumns: false,
        gridColumnUI: [],
        initialColumns: [],
        selectedColumns: [],
        editColumnData: [
          {
            name: 'firstName',
            headerText: 'User',
            className: 'col-lg-fixed',
          },
          {
            name: 'emailId',
            className: 'col-lg-fixed',
            headerText: 'Email ID',
          },
          {
            name: 'roleName',
            className: 'col-lg-fixed',
            headerText: 'Role',
          },
          {
            name: 'contactNumber',
            className: 'col-lg-fixed',
            headerText: 'Primary Phone Number',
          },
          {
            name: 'loginDate',
            className: 'col-lg-fixed',
            headerText: 'Login Date',
          },
          {
            name: 'tickets',
            className: 'col-lg-fixed',
            headerText: translate('Service Requests'),
          },
        ],
      },
    };
    this.tabs = GLOBAL_OPTIONS.userTabs.toArray();
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.onFilterToggle = this.onFilterToggle.bind(this);
    this.onFilterAction = this.onFilterAction.bind(this);
    this.onGridAction = this.onGridAction.bind(this);
    this.users_OnSort = this.users_OnSort.bind(this);
    this.onEditColumnToggle = this.onEditColumnToggle.bind(this);
    this.onColFilterSelection = this.onColFilterSelection.bind(this);
  }

  async componentDidMount() {
    const params = utils.queryString.query.get();
    const { pageData } = this.props;
    if (params.status) {
      await this.setState({
        currentFilter: {
          ...this.state.currentFilter,
          status: params.status,
        },
      });
    }
    await this.refreshUsers({ filter: { isActive: true } });
    if (pageData?.apiConfig?.getRoles) {
      await this.props.userActions.loadRoles(
        { userType: 'INTERNAL' },
        pageData?.apiConfig?.getRoles
      );
    }
  }

  async refreshUsers({ pageNo, pageSize, sort, filter, source }: any = {}) {
    const { pageData } = this.props;
    pageSize =
      pageSize ||
      defaultPageSize ||
      this.props.store.authentication?.usersPagination.pageSize;
    pageNo =
      pageNo ||
      this.props.store.authentication?.usersPagination?.currentPage ||
      1;
    const sortBy = (sort || this.state.currentSort).sortColumn;
    const sortDir = (sort || this.state.currentSort).sortOrder;
    const extra: any = {};
    if (!source) {
      source = this.state.currentTab;
    }
    if (source === GLOBAL_OPTIONS.userTabs.keys.ALL_USERS) {
      extra.isActive = undefined;
    }
    this.props.commonActions.startLoading();
    await this.props.userActions.loadUsers(
      {
        body: { ...(filter || this.state.currentFilter), ...extra },
        source,
        query: {
          sortBy: sortBy,
          sortDir: sortDir?.toUpperCase(),
          pageSize: pageSize,
          pageNo: pageNo,
        },
      },
      pageData?.apiConfig?.getUsers
    );
    this.props.commonActions.stopLoading();
  }

  onColFilterSelection(data) {
    this.setState({
      selectedColumns: data.value,
      showFilter: false,
      showEditColumns: !this.state.showEditColumns,
    });
  }

  async resetEditColumns() {
    const columnList = {};
    (this.state?.editColumnData || []).forEach((l) => {
      columnList[l.name] = 'on';
    });
    await this.setState({ currentEditColumn: columnList }, async () => {
      this.updateColumnUI();
    });
  }

  async updateColumnUI() {
    const columnsUI = (this.state.editColumnData || []).map((col) => {
      if (col.name !== 'projectCode') {
        col.hide = !this.state.currentEditColumn[col.name];
      }
      return col;
    });
    const finalColumns = columnsUI.filter((i) => !i.hide).map((i) => i.name);
    this.setState({
      showFilter: false,
      showEditColumns: false,
      gridColumnUI: columnsUI,
      selectedColumns: finalColumns,
    });
  }
  onEditColumnToggle(data, field) {
    this.setState({
      showFilter: false,
      showEditColumns: !this.state.showEditColumns,
    });
  }

  handleTabChange(data) {
    this.setState({
      currentTab: data.value,
    });
    const source = data.value;
    if (data.value === 'ACTIVE_USERS') {
      this.refreshUsers({
        filter: { isActive: true, ...this.state.currentFilter },
        source: source,
        pageNo: 1,
      });
    } else if (data.value === 'INACTIVE_USERS') {
      this.refreshUsers({
        filter: { isActive: false, ...this.state.currentFilter },
        source: source,
        pageNo: 1,
      });
    } else {
      this.refreshUsers({ source: source, pageNo: 1 });
    }
  }

  onFilterChange(data) {
    Object.keys(data.value).forEach(
      (key) =>
        (data.value[key] == null || data.value[key] == '') &&
        delete data.value[key]
    );
    this.setState({
      currentFilter: data.value,
    });
  }

  async handlePageChange(data) {
    const { currentPage } = this.props.store.authentication.usersPagination;
    const pageNo = data.value.currentPage;
    if (this.state.currentTab === 'ACTIVE_USERS') {
      await this.refreshUsers({
        pageNo: pageNo,
      });
    } else if (this.state.currentTab === 'INACTIVE_USERS') {
      await this.refreshUsers({
        pageNo: pageNo,
      });
    } else {
      await this.refreshUsers({
        pageNo: pageNo,
      });
    }
  }

  async onGridAction(row, value, column) {
    const { currentPage, pageSize } =
      this.props.store.authentication.usersPagination;
    const { pageData } = this.props;
    switch (value.action) {
      case 'edit':
        utils.redirect.redirectTo('editUser', {
          userId: row.email || row.emailId /* replace with data.uid */,
          uid: row.uid /* replace with data.uid */,
        });
        break;
      case 'activate':
        await this.props.userActions.reactivateUser(
          row,
          pageData?.apiConfig?.activateUser
        );
        await this.refreshUsers({
          filter: { isActive: false, ...this.state.currentFilter },
          pageSize: pageSize,
        });
        break;
      case 'deactivate':
        await this.props.userActions.deactivateUser(
          row,
          pageData?.apiConfig?.deActivateUser
        );
        await this.refreshUsers({
          filter: { isActive: true, ...this.state.currentFilter },
          pageSize: pageSize,
        });
        break;
      case 'delete':
        await this.props.userActions.deleteUser(
          row,
          pageData?.apiConfig?.deleteUser
        );
        await this.refreshUsers({
          filter: { isActive: true, ...this.state.currentFilter },
          pageSize: pageSize,
        });
        break;
      case 'reset-password':
        this.props.userActions.resetPassword(
          row,
          pageData?.apiConfig?.resetPassword
        );
        break;
    }
  }

  onFilterToggle() {
    this.setState({
      showFilter: !this.state.showFilter,
    });
  }

  async onFilterAction(data, action) {
    this.setState({
      showFilter: false,
    });
    if (data.value) {
      return;
    }
    const { currentPage } = this.props.store.authentication.usersPagination;
    switch (action.actionType) {
      case 'resetfilter':
        this.setState({
          currentFilter: {},
        });
        await this.refreshUsers({
          filter: {},
          currentPage: currentPage,
        });
        break;
      case 'applyfilter':
        if (this.state.currentTab === 'ACTIVE_USERS') {
          await this.refreshUsers({
            filter: { ...this.state.currentFilter, isActive: true },
            currentPage: currentPage,
          });
        } else if (this.state.currentTab === 'INACTIVE_USERS') {
          await this.refreshUsers({
            filter: { ...this.state.currentFilter, isActive: false },
            currentPage: currentPage,
          });
        } else {
          await this.refreshUsers({});
        }
        break;
    }
  }

  async users_OnSort(data, column) {
    await this.setState({
      currentSort: data,
    });
    if (this.state.currentTab === 'ACTIVE_USERS') {
      await this.refreshUsers({
        filter: { ...this.state.currentFilter, isActive: true },
        sort: data,
      });
    } else if (this.state.currentTab === 'INACTIVE_USERS') {
      await this.refreshUsers({
        filter: { ...this.state.currentFilter, isActive: false },
        sort: data,
      });
    } else {
      await this.refreshUsers({
        sort: data,
      });
    }
  }

  render() {
    const { store, pageData } = this.props;
    const { isLoading } = this.state;
    const createUserPerm = hasPermission('createUser', store);
    const editUserPerm = hasPermission('editUser', store);
    const deleteUserPerm = hasPermission('deleteUser', store);
    const { Grid, Tabs, Form, Pagination, Dialog, Actions, Skeleton } =
      utils.storage.components.get();
    const { fieldMapping = {} } = pageData;
    // console.log('@@@@userstore', store);
    return (
      <div className="sq-auth-users sq-v-screen sq-v-screen--fixed">
        <div className="sq-v-screen__container">
          <div className="container-fluid">
            <div className="sq-v-screen__top-header mt-wide">
              <div>
                <h2 className="mt-3">
                  {'Users'}
                  {!isLoading &&
                    store.authentication?.usersPagination &&
                    `(${store.authentication.usersPagination.total})`}
                </h2>
              </div>
              <Actions
                actions={[
                  createUserPerm && {
                    type: 'Button',
                    iconName: 'add',
                    size: 'medium',
                    to: 'createNewUser',
                    buttonText: 'Add New',
                  },
                  {
                    type: 'Button',
                    variant: 'outlined',
                    onClick: this.onEditColumnToggle,
                    iconName: 'edit',
                    buttonText: 'Edit Columns',
                    color: this.state.showEditColumns ? 'secondary' : 'primary',
                  },
                  {
                    type: 'Button',
                    iconName: 'filter-list',
                    variant: 'outlined',
                    size: 'medium',
                    onClick: this.onFilterToggle,
                    buttonText: 'Filters',
                    color: this.state.showFilter ? 'secondary' : 'primary',
                  },
                ].filter((i) => i)}
              />
            </div>
          </div>
          <div
            className={`sq-v-screen__body-container ${
              this.state.showFilter ? 'sq-auth-users__container-filter' : ''
            }`}
          >
            <Dialog
              open={this.state.showFilter}
              classes={{
                dialog: {
                  root: 'sq-dialog--fixed-right',
                },
              }}
              onClose={this.onFilterAction}
              onAction={this.onFilterAction}
              actions={[
                {
                  actionType: 'applyfilter',
                  buttonText: 'Apply',
                },
                {
                  actionType: 'resetfilter',
                  buttonText: 'Reset',
                  variant: 'outlined',
                },
              ]}
              title={'Filters'}
            >
              <Form
                onChange={this.onFilterChange}
                value={this.state.currentFilter}
                onAction={this.onFilterAction}
                name={'userFilter'}
                fields={[
                  {
                    name: 'emailId',
                    label: translate('Email ID'),
                    ...fieldMapping.emailId,
                    cmpType: 'Input',
                    // multiple: true,
                  },
                  {
                    name: 'firstName',
                    label: translate('First Name'),
                    ...fieldMapping.firstName,
                    cmpType: 'Input',
                    // options: this.props.store.project?.projects.data,
                  },
                  {
                    name: 'lastName',
                    label: translate('Last Name'),
                    ...fieldMapping.lastName,
                    cmpType: 'Input',
                    // options: this.props.store.project?.inventories?.data,
                  },
                  {
                    name: 'roleCode',
                    cmpType: 'Autocomplete',
                    label: translate('Roles'),
                    ...fieldMapping.roleCode,
                    options: this.props.store.authentication.roles?.ALL_ROLES,
                    valueField: 'code',
                    textField: 'name',
                  },
                ]}
              />
            </Dialog>
            <Tabs
              options={this.tabs}
              onChange={this.handleTabChange}
              value={this.state.currentTab}
            />
            <div className="mb-wide">
              {store.authentication.usersPagination?.total > 0 && (
                <Pagination
                  className="j-content-fl-end ml-3"
                  enablePageSize={true}
                  count={store.authentication?.usersPagination.totalPages}
                  disabled={isLoading}
                  pageSizeOptions={GLOBAL_OPTIONS.noOfResultsDropdown.toArray()}
                  value={store.authentication?.usersPagination}
                  onChange={(data) => {
                    const pageNo = data.value.currentPage;
                    const pageSize = data.value.pageSize;
                    if (!isLoading) {
                      this.refreshUsers({ pageNo, pageSize });
                    }
                  }}
                />
              )}
            </div>
            <div className="sq-v-screen-grow">
              {
                <Grid
                  onColFilterChange={this.onColFilterSelection}
                  className="sq-basic-grid sq-grid--fixed sq-basic-grid--rounded"
                  sortColumn={this.state.currentSort.sortColumn}
                  sortOrder={this.state.currentSort.sortOrder}
                  enableSort={true}
                  onSort={this.users_OnSort}
                  loader={<Skeleton styleName={`grid-tran`} rows={8} />}
                  onAction={this.onGridAction}
                  selectedColumns={this.state.selectedColumns}
                  showColSelection={this.state.showEditColumns}
                  columns={[
                    {
                      name: 'icon',
                      cmpType: 'Icon',
                      className: 'col-icon',
                      sort: false,
                      component: {
                        textIcon: (row) =>
                          `${utils.string.getTwoChars(row.firstName)}`,
                        iconClass: 'sq-icon--square sq-icon--text-icon-accent',
                        variant: (row) =>
                          row.active
                            ? utils.accentColors.getColorByChar(
                                row.firstName?.substr(0, 1)
                              )
                            : 'default',
                      },
                      ...fieldMapping.icon,
                    },
                    {
                      name: 'firstName',
                      cmpType: 'TextFields',
                      headerText: 'User',
                      className: 'sq-auth-users-screen--col-default',
                      component: {
                        fields: [
                          {
                            name: 'firstName',
                            className: 'header',
                          },
                          {
                            name: 'lastName',
                            className: 'sub-header',
                          },
                        ],
                      },
                      ...fieldMapping.firstName,
                    },
                    {
                      name: 'emailId',
                      className: 'sq-auth-users-screen--col-title',
                      headerText: 'Email ID',
                      tooltip: {
                        title: (row) => row.emailId,
                        arrow: true,
                      },
                      ...fieldMapping.emailId,
                    },
                    {
                      name: 'roleName',
                      className: 'sq-auth-users-screen--col-small',
                      headerText: 'Role',
                      ...fieldMapping.roleName,
                    },
                    {
                      name: 'contactNumber',
                      className: 'sq-auth-users-screen--col-title',
                      headerText: 'Primary Phone Number',
                      formatter: {
                        type: 'phoneNumber',
                      },
                      ...fieldMapping.contactNumber,
                    },
                    {
                      name: 'loginDate',
                      className: 'sq-auth-users-screen--col-default',
                      headerText: 'Login Date',
                      render: (value) => {
                        return formatters.dateFullTime(value);
                      },
                      ...fieldMapping.loginDate,
                    },
                    {
                      name: 'actions',
                      headerText: 'Actions',
                      className: 'col-actions',
                      cmpType: 'MoreActions',
                      sort: false,
                      component: {
                        actions: [
                          {
                            cmpType: 'LinkButton',
                            action: 'edit',
                            disabled: !editUserPerm,
                            iconName: 'edit',
                            buttonText: translate('Edit'),
                          },
                          {
                            cmpType: 'LinkButton',
                            action: 'reset-password',
                            disabled: !editUserPerm,
                            iconName: 'RestartAlt',
                            buttonText: translate('Reset Password'),
                          },
                          {
                            cmpType: 'LinkButton',
                            iconName: 'deactivate',
                            confirm: {
                              title: translate('Confirm'),
                              content: translate(
                                'Are you sure you want to deactivate this user?'
                              ),
                            },
                            iconColor: 'error',
                            action: 'deactivate',
                            disabled: !editUserPerm,
                            buttonText: translate('Deactivate'),
                            render: (row) => {
                              return row.active;
                            },
                          },
                          {
                            cmpType: 'LinkButton',
                            iconName: 'Delete',
                            confirm: {
                              title: translate('Confirm'),
                              content: translate(
                                'Are you sure you want to delete this user?'
                              ),
                            },
                            iconColor: 'error',
                            action: 'delete',
                            disabled: !deleteUserPerm,
                            buttonText: translate('Delete'),
                            render: (row) => {
                              return row.active && deleteUserPerm;
                            },
                          },
                          {
                            cmpType: 'LinkButton',
                            iconName: 'active',
                            iconColor: 'success',
                            action: 'activate',
                            disabled: !createUserPerm,
                            buttonText: translate('Re-Activate'),
                            render: (row) => {
                              return !row.active;
                            },
                          },
                        ],
                      },
                    },
                  ]}
                  showHeader={true}
                  data={store?.authentication?.users || []}
                />
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    store: {
      ...state,
    },
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userActions: {
      loadUsers: (data, config) => dispatch(loadUsers(data, config)),
      deactivateUser: (data, config) => dispatch(deactivateUser(data, config)),
      deleteUser: (data, config) => dispatch(deleteUser(data, config)),
      reactivateUser: (data, config) => dispatch(reactivateUser(data, config)),
      resetPassword: (data, config) => dispatch(resetPassword(data, config)),
      loadRoles: (data, config) => dispatch(loadRoles(data, config)),
    },
  };
};

Users.propTypes = {
  raiseAction: PropTypes.func,
  store: PropTypes.object,
  commonActions: PropTypes.object,
  appActions: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
};

export { Users };

export default connect(mapStateToProps, mapDispatchToProps)(Users);
