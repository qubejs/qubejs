import PropTypes from 'prop-types';
import * as utils from '../../utils';
import {
  loadPageTree,
  loadPagesByPath,
  deletePage,
  clonePage,
} from '../../redux/admin';
import { updateUserData, processParams } from '../../redux/content';
import BaseContainer from '../BaseContainer';
import clonePageConfig from './ClonePage';
import { GLOBAL_OPTIONS } from '../../globals';

import PathTree from './PathTree';
import DynamicContentRoot from '../DynamicContent';
import { Validator } from '../../utils/validator';

const { translate } = utils.translate;

class PageListing extends BaseContainer {
  props: any;
  state: any;
  filterFields: any;
  static propTypes: any;
  constructor(props) {
    super(props);
    this.state = {
      showFilter: false,
      currentQuickFilter: {},
    };
    this.onGridAction = this.onGridAction.bind(this);
    this.toggleEditForm = this.toggleEditForm.bind(this);
    this.onCloneFormSubmit = this.onCloneFormSubmit.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.onTreeSelect = this.onTreeSelect.bind(this);
    this.onFilterAction = this.onFilterAction.bind(this);
  }

  processField(field) {
    const { userData, store } = this.props;
    return {
      ...field,
      beforeRender: (field, val, row) => {
        return {
          ...(field.componentProps
            ? processParams(
                { ...userData, ...row },
                field.componentProps,
                undefined,
                store
              )
            : {}),
        };
      },
      fields: field.fields
        ? field.fields.map((field) => {
            return this.processField(field);
          })
        : undefined,
    };
  }

  async componentDidMount() {
    const { pageData, store } = this.props;
    this.props.commonActions.startLoading();
    if (pageData.enableTree !== false) {
      await this.props.raiseAction(
        loadPageTree({}, pageData.getPageTreeConfig)
      );
      await this.setState({
        parentPath: store.admin.contentTree?.path,
      });
    }
    await this.setState({
      currentFilter: utils.storage.preference.read('currentFilter'),
    });
    this.filterFields = [
      {
        name: 'pageName',
        label: 'Name',
      },
      {
        name: 'path',
        label: 'Path',
      },
      {
        name: 'type',
        cmpType: 'ButtonSelection',
        label: 'Page Type',
        options: GLOBAL_OPTIONS.contentType.toArray(),
      },
    ].concat(
      (pageData.filterFields || []).map((field) => {
        return this.processField(field);
      })
    );
    this.refreshPages();
  }

  async refreshPages(options = {}) {
    const {
      parentPath = this.state.parentPath,
      pageNo = 1,
      pageSize = GLOBAL_OPTIONS.noOfResultsDropdown.toArray()[0].value,
    }: any = options;
    const { pageData } = this.props;
    this.props.commonActions.startLoading();
    await this.props.raiseAction(
      loadPagesByPath(
        { ...this.state.currentFilter, parentPath },
        pageData.getPagesConfig,
        { pageNo, pageSize }
      )
    );
    this.props.commonActions.stopLoading();
  }

  componentDidUpdate(prevProps) {
    const { pageData } = this.props;
    const { pageData: prevPageData } = prevProps;
    if (pageData.id !== prevPageData.id) {
      this.refreshPages();
    }
  }

  getCurrentPage() {
    const { store } = this.props;
    return {
      pageNo: store.admin?.contentPagesPagination.currentPage,
      pageSize: store.admin?.contentPagesPagination.pageSize,
    };
  }

  async onGridAction(row, value, column) {
    const { pageData, store } = this.props;
    let currentPage;
    let params;
    switch (value.action) {
      case 'clone':
        this.setState({
          openClone: true,
          cloneFrom: row,
        });
        break;
      case 'delete':
        this.props.commonActions.startLoading();
        await this.props.raiseAction(
          deletePage(row, pageData.deletePageConfig)
        );
        currentPage = this.getCurrentPage();
        this.refreshPages({ ...currentPage });
        break;
      case 'edit':
        utils.redirect.redirectTo(
          row.type === 'SITE_MAP'
            ? pageData.editSiteMap || 'editSiteMap'
            : pageData.editPage || 'editPage',
          {
            path: row.path,
            pageId: row.pageId /* replace with data.uid */,
          },
          { target: '_blank' }
        );
        break;
      case 'preview':
        params = {
          path: row.path,
          ...processParams(
            {
              ...this.props.userData,
              ...this.props.pageData,
              ...row,
            },
            this.props.pageData.preview || {},
            undefined,
            this.props.store
          ),
        };
        utils.redirect.redirectTo(params.path, {...params.urlParams, status: 'draft'}, {
          target: '_blank',
        });
        break;
    }
  }
  async onCloneFormSubmit(data) {
    const { pageData } = this.props;
    this.props.commonActions.startLoading();
    await this.props.raiseAction(
      clonePage(data, pageData.clonePageConfig, {
        success: () => {
          const currentPage = this.getCurrentPage();
          this.refreshPages({ ...currentPage });
          this.setState({
            openClone: false,
          });
        },
        error: (resp) => {
          this.props.commonActions.stopLoading();
          if (resp.error?.errors) {
            this.props.raiseAction(
              updateUserData({
                formData_errors: resp.error.errors,
              })
            );
          }
        },
      })
    );
  }
  async toggleEditForm() {
    this.setState({
      openClone: false,
    });
  }

  async onTreeSelect(data) {
    const { pageData } = this.props;
    this.props.commonActions.startLoading();
    this.setState({
      parentPath: data.value,
    });
    await this.props.raiseAction(
      loadPagesByPath({ parentPath: data.value }, pageData.getPagesConfig)
    );
    this.props.commonActions.stopLoading();
  }
  onQuickFilterChange = async (data, action) => {
    await this.setState({
      __currentFilter: data.value,
    });
  };

  async onFilterAction(data, action) {
    switch (action.actionType) {
      case 'resetFilter':
        await this.setState({
          showFilter: !this.state.showFilter,
        });
        this.setState({
          currentFilter: {},
        });
        await this.setState({
          __currentFilter: {},
        });
        await this.refreshPages();
        break;
      case 'applyFilter':
        await this.setState({
          currentFilter: this.state.__currentFilter,
        });
        utils.storage.preference.write(
          'currentFilter',
          this.state.__currentFilter
        );
        await this.setState({
          showFilter: !this.state.showFilter,
          __currentFilter: undefined,
        });
        await this.refreshPages();
        break;
    }
  }

  async handleAction(data, action) {
    const { onAction } = this.props;
    switch (action.actionType) {
      case 'edit-filter':
        this.setState({
          showFilter: true,
        });
        break;
      default:
        if (action.actionType) {
          action.currentData = data;
          onAction && onAction(data, action);
        }
    }
  }

  render() {
    const { store, pageData = {}, userData } = this.props;
    const { isLoading } = this.state;
    const { Form, Dialog, Grid, Actions } = utils.storage.components.get();
    return (
      <div className="sq-page-listing sq-v-screen sq-v-screen--fixed">
        <>
          <Dialog
            open={this.state.showFilter}
            transitionDir="left"
            classes={{
              dialog: {
                root: 'sq-dialog--fixed-right',
              },
            }}
            onClose={() => this.setState({ showFilter: false })}
            onAction={this.onFilterAction}
            actions={[
              {
                actionType: 'applyFilter',
                buttonText: 'Apply',
              },
              {
                actionType: 'resetFilter',
                buttonText: 'Reset',
                variant: 'outlined',
              },
            ]}
            title={'Filters'}
          >
            <Form
              onChange={this.onQuickFilterChange}
              userData={userData}
              className="mt-wide"
              value={this.state.__currentFilter || this.state.currentFilter}
              fields={this.filterFields}
            />
          </Dialog>
        </>
        <div className="sq-v-screen__container">
          <div
            className={`container-fluid pb-wide ${
              pageData.actionInBreadCrumb === true
                ? 'sq-v-screen__sub-header'
                : 'mt-wide'
            }`}
          >
            <Actions
              onAction={this.handleAction}
              actions={[
                {
                  type: 'Button',
                  iconName: 'add',
                  to: pageData.addNewPage || 'addNewPage',
                  buttonText: 'Add New',
                },
                {
                  actionType: 'edit-filter',
                  iconName: 'filter-list',
                  variant: 'outlined',
                  cmpType: 'Button',
                  buttonText: 'Filters',
                },
              ].filter((i) => i)}
            />
          </div>
          {/* <div className="container-fluid">
            <Form disabled={userData.isLoading} userData={userData} onChange={this.onQuickFilterChange} className="sq-form--inline-auto p-0" value={this.state.currentQuickFilter} fields={this.quickFilterFields} />
          </div> */}
          <Dialog
            open={this.state.openClone}
            onClose={this.toggleEditForm}
            title={`Clone page`}
          >
            <div className="mt-wide">
              <DynamicContentRoot
                className={`sq-page-listing__clone`}
                onSubmit={this.onCloneFormSubmit}
                pageConfig={clonePageConfig({
                  formData: this.state.cloneFrom,
                  ...pageData.cloneConfig,
                })}
              ></DynamicContentRoot>
            </div>
          </Dialog>
          <div className={`container-fluid  sq-v-screen__body-container`}>
            <div className="sq-v-screen-grow mb-wide sq-page-listing__container">
              {pageData.enableTree !== false && (
                <div className="sq-page-listing__left">
                  <PathTree
                    data={store.admin.contentTree}
                    onChange={this.onTreeSelect}
                    value={this.state.parentPath}
                  />
                </div>
              )}
              <Grid
                className="sq-basic-grid sq-page-listing__right sq-basic-grid--rounded sq-grid--fixed"
                paginationProps={{
                  disabled: isLoading,
                  count: store.admin?.contentPagesPagination?.totalPages,
                  value: store.admin?.contentPagesPagination,
                  onChange: (data) =>
                    this.refreshPages({
                      pageNo: data?.value?.currentPage,
                      pageSize: data?.value?.pageSize,
                    }),
                  enablePageSize: true,
                  pageSizeOptions: GLOBAL_OPTIONS.noOfResultsDropdown.toArray(),
                }}
                // loader={<Skeleton styleName={`grid-tran`} rows={8} />}
                onAction={this.onGridAction}
                columns={[
                  {
                    name: 'icon',
                    cmpType: 'Icon',
                    className: 'col-icon',
                    sort: false,
                    component: {
                      name: (row) => {
                        return row.type === 'SITE_MAP'
                          ? 'AccountTree'
                          : 'Description';
                      },
                    },
                  },
                  {
                    name: 'title',
                    headerText: 'Page Title',
                    className: 'col-large',
                    render: (val, col, row) =>
                      row.pageName ||
                      (row.type === 'SITE_MAP'
                        ? `${row.pageData?.siteMap?.title}`
                        : `${row.pageData?.title}`),
                  },
                  {
                    name: 'path',
                    headerText: 'Path',
                    className: 'col-large-grow',
                  },

                  {
                    cmpType: 'TagLabel',
                    name: 'status',
                    headerText: 'Status',
                    className: 'col-medium',
                    beforeRender: (col, val, data) => {
                      if (pageData.isPublished) {
                        const validator = new Validator(pageData.isPublished);
                        const validatorModified = new Validator(
                          pageData.isModified
                        );
                        validator.setValues(data);
                        validatorModified.setValues(data);
                        return {
                          component: {
                            value: validator.validateAll()
                              ? 'Published'
                              : validatorModified.validateAll()
                              ? 'Modified'
                              : 'Draft',
                            color: validator.validateAll()
                              ? 'success'
                              : validatorModified.validateAll()
                              ? 'warning'
                              : 'info',
                            size: 'small',
                          },
                        };
                      } else {
                        return {
                          component: {
                            value: 'Live',
                            color: 'info',
                            size: 'small',
                          },
                        };
                      }
                    },
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
                          iconName: 'edit',
                          buttonText: translate('Edit'),
                        },
                        {
                          cmpType: 'LinkButton',
                          action: 'preview',
                          iconName: 'RestartAlt',
                          buttonText: translate('Preview'),
                          render: (row) => row.type === 'PAGE',
                        },
                        {
                          cmpType: 'LinkButton',
                          iconName: 'deactivate',
                          iconColor: 'error',
                          action: 'unpublish',
                          buttonText: translate('UnPublish'),
                          render: (row) => {
                            const validator = new Validator(pageData.isPublished);
                            validator.setValues(row);
                            return validator.validateAll();
                          },
                        },
                        {
                          cmpType: 'LinkButton',
                          iconName: 'CloudUpload',
                          iconColor: 'info',
                          action: 'publish',
                          buttonText: translate('Publish'),
                          render: (row) => {
                            const validator = new Validator(pageData.isPublished);
                            validator.setValues(row);
                            return !validator.validateAll();
                          },
                        },
                        {
                          cmpType: 'LinkButton',
                          iconName: 'ContentCopy',
                          iconColor: 'info',
                          action: 'clone',
                          buttonText: translate('Clone'),
                        },
                        {
                          cmpType: 'LinkButton',
                          iconName: 'Delete',
                          iconColor: 'error',
                          action: 'delete',
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
                data={store.admin?.contentPages}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PageListing.propTypes = {
  raiseAction: PropTypes.func,
  store: PropTypes.object,
  commonActions: PropTypes.object,
  appActions: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
};

export { PageListing };

export default PageListing;
