import PropTypes from 'prop-types';
import {
  loadRoles,
  showAllRoles,
  removeRole,
  hasPermission,
} from '../../redux/authentication';
import * as utils from '../../utils';
import BaseContainer from '../BaseContainer';
import { GLOBAL_OPTIONS } from '../../globals';
// import Skeleton from '../../components/Skeleton';
import './_roles.scss';
const { translate } = utils.translate;
const { Validator } = utils.validator;
const defaultPageSize = +GLOBAL_OPTIONS.noOfResultsDropdown.toArray()[0]?.value;
class Roles extends BaseContainer {
  props: any;
  state: any;
  tabs: any;
  validator: any;
  permissionTabs: any;
  static propTypes: any;
  constructor(props) {
    super(props);
    this.state = {
      currentTab: GLOBAL_OPTIONS.roleTabs.keys.ALL_ROLES,
      currentSort: {
        sortColumn: 'id',
        sortOrder: 'desc',
      },
      showEditColumns: false,
      showFilter: false,
      currentFilter: {},
      singleData: false,
    };
    this.tabs = GLOBAL_OPTIONS.roleTabs.toArray();
    this.handleOnSort = this.handleOnSort.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
    this.onGridAction = this.onGridAction.bind(this);
    this.onEditColumnToggle = this.onEditColumnToggle.bind(this);
    this.onEditColumnChange = this.onEditColumnChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.onFilterToggle = this.onFilterToggle.bind(this);
    this.onFilterAction = this.onFilterAction.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.validator = new Validator({
      contactNumber: {
        validators: [{ type: 'phone' }],
      },
    });
  }

  async componentDidMount() {
    const { pageData } = this.props;
    this.loadForms();
    this.props.raiseAction(loadRoles({}, pageData?.apiConfig?.getRoles));
  }

  async handleOnSort(data, column) {
    this.setState({
      currentSort: data,
    });
    const currentPage =
      this.props.store.authentication?.allRolesPage?.currentPage;
    await this.loadForms({ pageNo: currentPage, sort: data });
  }

  async onFilterChange(data, field) {
    this.validator.setValue(field.name, data.value[field.name]);
    this.validator.validate(field.name);
    await this.setState({
      errors: this.validator.errors,
    });
    Object.keys(data.value).forEach(
      (key) =>
        (data.value[key] == null || data.value[key] == '') &&
        delete data.value[key]
    );
    this.setState({
      currentFilter: data.value,
      singleData: false,
    });
  }

  async onFilterToggle() {
    this.setState({
      showFilter: !this.state.showFilter,
      showEditColumns: false,
    });
  }

  async onFilterAction(data, action) {
    switch (action.actionType) {
      case 'resetfilter':
        this.setState({
          showFilter: !this.state.showFilter,
        });
        this.setState({
          currentFilter: {},
          singleData: false,
        });
        await this.loadForms({ filter: {} });
        break;
      case 'applyfilter':
        this.setState({
          showFilter: !this.state.showFilter,
        });
        this.setState({
          singleData: true,
        });
        await this.loadForms({});
        break;
    }
  }

  async loadForms({ pageNo, sort, filter, pageSize }:any = {}) {
    const { pageData } = this.props;
    pageSize = pageSize || defaultPageSize;
    pageNo = pageNo || 1;
    const sortBy = (sort || this.state.currentSort).sortColumn;
    const sortDir = (sort || this.state.currentSort).sortOrder;
    this.props.commonActions.startLoading();
    await this.props.raiseAction(
      showAllRoles(
        {
          body: {
            ...(filter || this.state.currentFilter),
          },
          query: {
            sortBy: `${sortBy}|${sortDir}`,
            pageSize: pageSize,
            pageNo: pageNo,
          },
        },
        pageData?.apiConfig?.searchRoles
      )
    );
    this.props.commonActions.stopLoading();
  }

  async handlePageChange(data) {
    const pageNo = data.value.currentPage;
    const pageSize = data.value.pageSize;
    await this.loadForms({ pageNo: pageNo, pageSize });
  }

  onEditColumnToggle() {
    this.setState({
      showEditColumns: !this.state.showEditColumns,
    });
  }
  onEditColumnChange(data) {
    this.setState({
      selectedColumns: data.value,
      showEditColumns: !this.state.showEditColumns,
    });
  }

  handleTabChange(data) {
    this.setState({
      currentTab: data.value,
    });
  }

  onRowClick(row) {
    if (hasPermission('viewRole', this.props.store))
      utils.redirect.redirectTo('viewRole', { code: row.code });
  }

  async onGridAction(row, value, column) {
    const { pageData } = this.props;
    switch (value.action) {
      case 'edit':
        utils.redirect.redirectTo('editRole', {
          code: row.code,
          userType: row.userType,
        });
        break;
      case 'assign':
        utils.redirect.redirectTo('assignRole', { code: row.code });
        break;
      case 'delete':
        await this.props.raiseAction(
          removeRole(row, pageData?.apiConfig?.userRole)
        );
        this.props.raiseAction(loadRoles({}, pageData?.apiConfig?.getRoles));
    }
  }

  render() {
    const { store } = this.props;
    const { isLoading } = this.state;
    const { Grid, Tabs, Actions, Pagination, Dialog, Form, Skeleton } =
      utils.storage.components.get();

    const actions = hasPermission('createRole', store)
      ? [
          {
            type: 'Button',
            iconName: 'add',
            className: '',
            to: 'createNewRole',
            buttonText: 'Add New',
          },
          {
            buttonText: 'Edit Columns',
            iconName: 'edit',
            variant: 'outlined',
            cmpType: 'Button',
            onClick: this.onEditColumnToggle,
          },
          {
            buttonText: 'Filters',
            iconName: 'filter-list',
            variant: 'outlined',
            cmpType: 'Button',
            onClick: this.onFilterToggle,
          },
        ]
      : [
          {
            buttonText: 'Edit Columns',
            iconName: 'edit',
            variant: 'outlined',
            cmpType: 'Button',
            onClick: this.onEditColumnToggle,
          },
          {
            buttonText: 'Filters',
            iconName: 'filter-list',
            variant: 'outlined',
            cmpType: 'Button',
            onClick: this.onFilterToggle,
          },
        ];
    return (
      <div className="sq-user-roles sq-v-screen sq-v-screen--fixed">
        <div className="sq-v-screen__container ">
          <div className="container-fluid">
            <div className="sq-v-screen__top-header mt-wide">
              <h2>
                {'Manage Roles'}
                {!isLoading &&
                  store.authentication?.roles?.ALL_ROLES &&
                  `(${store.authentication.roles.ALL_ROLES.length})`}
              </h2>
              <Actions actions={actions} />
            </div>
            <div className="mt-wide">
              {store.authentication?.allRoles?.ALL_ROLES && (
                <Pagination
                  className="j-content-fl-end"
                  onChange={this.handlePageChange}
                  count={store.authentication?.allRolesPage?.totalPages}
                  value={store.authentication?.allRolesPage}
                  enablePageSize={true}
                  pageSizeOptions={GLOBAL_OPTIONS.noOfResultsDropdown.toArray()}
                />
              )}
            </div>
          </div>
          <Tabs
            options={this.tabs}
            onChange={this.handleTabChange}
            value={this.state.currentTab}
          />
          <div className={'sq-v-screen__body-container'}>
            <Dialog
              open={this.state.showFilter}
              transitionDir="left"
              classes={{
                dialog: {
                  root: 'sq-dialog--fixed-right',
                },
              }}
              onClose={this.onFilterToggle}
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
                className="mt-wide"
                value={this.state.currentFilter}
                onAction={this.onFilterAction}
                name={'ticketFilter'}
                fields={[
                  {
                    name: 'code',
                    label: translate('Name'),
                    cmpType: 'Autocomplete',
                    options: store?.authentication.roles?.ALL_ROLES,
                    textField: 'name',
                    valueField: 'code',
                  },
                ]}
              />
            </Dialog>
            <div className="sq-v-screen-grow">
              {this.state.singleData ? (
                <Grid
                  sortColumn={this.state.currentSort.sortColumn}
                  sortOrder={this.state.currentSort.sortOrder}
                  onColFilterChange={this.onEditColumnChange}
                  selectedColumns={this.state.selectedColumns}
                  showColSelection={this.state.showEditColumns}
                  enableSort={true}
                  onSort={this.handleOnSort}
                  onRowClick={this.onRowClick}
                  className="sq-basic-grid sq-grid--fixed sq-basic-grid--rounded sq-basic-grid"
                  loader={<Skeleton styleName={`grid-tran`} rows={5} />}
                  onAction={this.onGridAction}
                  columns={[
                    {
                      name: 'icon',
                      sort: false,
                      cmpType: 'Icon',
                      className: 'col-icon',
                      customize: false,
                      component: {
                        textIcon: (row) =>
                          `${utils.string.getTwoChars(row.name)}`,
                        iconClass: 'sq-icon--square sq-icon--text-icon-accent',
                        variant: (row) =>
                          `${utils.accentColors.getColorByChar(
                            row.name?.substr(0, 1)
                          )}`,
                        className: 'sq-icon--square',
                      },
                    },
                    {
                      name: 'category',
                      cmpType: 'TextFields',
                      headerText: 'Role',
                      className: 'col-large-grow',
                      component: {
                        fields: [
                          {
                            name: 'name',
                            className: 'header',
                          },
                        ],
                      },
                    },
                    {
                      name: 'description',
                      className: 'col-large',
                      headerText: 'Description',
                    },
                    {
                      name: 'userType',
                      className: 'col-medium',
                      headerText: 'Type',
                      tooltip: {
                        title: (row) => row.userType,
                        arrow: false,
                      },
                    },
                    {
                      name: 'actions',
                      className: 'col-actions',
                      cmpType: 'MoreActions',
                      sort: false,
                      component: {
                        actions: [
                          {
                            cmpType: 'LinkButton',
                            action: 'edit',
                            disabled: !hasPermission('editRole', store),
                            iconName: 'default',
                            buttonText: translate('Edit'),
                          },
                          {
                            cmpType: 'LinkButton',
                            disabled: !hasPermission('editRole', store),
                            action: 'assign',
                            iconName: 'default',
                            buttonText: translate('Assign Permissions'),
                          },
                          {
                            cmpType: 'LinkButton',
                            action: 'delete',
                            disabled: !hasPermission('editRole', store),
                            iconName: 'default',
                            buttonText: translate('Delete'),
                            confirm: {
                              title: 'Confirm?',
                              content:
                                'Are you sure you want to delete this page?',
                            },
                          },
                        ],
                      },
                    },
                  ]}
                  showHeader={true}
                  data={store.authentication?.allRoles?.ALL_ROLES.data || []}
                />
              ) : (
                <Grid
                  sortColumn={this.state.currentSort.sortColumn}
                  sortOrder={this.state.currentSort.sortOrder}
                  onColFilterChange={this.onEditColumnChange}
                  selectedColumns={this.state.selectedColumns}
                  showColSelection={this.state.showEditColumns}
                  enableSort={true}
                  onSort={this.handleOnSort}
                  onRowClick={this.onRowClick}
                  className="sq-basic-grid sq-basic-grid--default sq-basic-grid--rounded sq-grid--fixed pt-wide"
                  loader={<Skeleton styleName={`grid-tran`} rows={5} />}
                  onAction={this.onGridAction}
                  columns={[
                    {
                      name: 'icon',
                      sort: false,
                      cmpType: 'Icon',
                      className: 'col-icon',
                      customize: false,
                      component: {
                        textIcon: (row) =>
                          `${utils.string.getTwoChars(row.name)}`,
                        variant: (row) =>
                          `${utils.accentColors.getColorByChar(
                            row.name?.substr(0, 1)
                          )}`,
                        className: 'sq-icon--square',
                      },
                    },
                    {
                      name: 'category',
                      cmpType: 'TextFields',
                      headerText: 'Role',
                      className: 'col-large-grow',
                      component: {
                        fields: [
                          {
                            name: 'name',
                            className: 'header',
                          },
                        ],
                      },
                    },
                    {
                      name: 'description',
                      className: 'col-large',
                      headerText: 'Description',
                    },
                    {
                      name: 'userType',
                      className: 'col-medium',
                      headerText: 'Type',
                      tooltip: {
                        title: (row) => row.userType,
                        arrow: false,
                      },
                    },
                    {
                      name: 'actions',
                      className: 'col-actions',
                      cmpType: 'MoreActions',
                      sort: false,
                      component: {
                        actions: [
                          {
                            cmpType: 'LinkButton',
                            action: 'edit',
                            disabled: !hasPermission('editRole', store),
                            iconName: 'default',
                            buttonText: translate('Edit'),
                          },
                          {
                            cmpType: 'LinkButton',
                            disabled: !hasPermission('editRole', store),
                            action: 'assign',
                            iconName: 'default',
                            buttonText: translate('Assign Permissions'),
                          },
                          {
                            cmpType: 'LinkButton',
                            action: 'delete',
                            disabled: !hasPermission('editRole', store),
                            iconName: 'default',
                            buttonText: translate('Delete'),
                            confirm: {
                              title: 'Confirm?',
                              content:
                                'Are you sure you want to delete this page?',
                            },
                          },
                        ],
                      },
                    },
                  ]}
                  showHeader={true}
                  data={store.authentication?.roles?.ALL_ROLES || []}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Roles.propTypes = {
  raiseAction: PropTypes.func,
  store: PropTypes.object,
  commonActions: PropTypes.object,
  appActions: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
};

export default Roles;
