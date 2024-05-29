import { Component } from 'react';
import { postApi, processEachParam, processParams } from '../../redux/content';
import { startLoading, stopLoading } from '../../redux/common';
import { updateUserData } from '../../redux/content';
import { Validator } from '../../utils/validator';
import { query } from '../../utils/query-string';
import { events } from '../../utils/app-events';
import { object, storage, translate as i18n } from '../../utils';
import { GLOBAL_OPTIONS } from '../../globals';

import './_generic-listing.scss';

const { preference } = storage;
const defaultPageSize = GLOBAL_OPTIONS.noOfResultsDropdown.toArray()[0].value;

class GenericListing extends Component {
  props:any;
  state:any;
  filterActions:any[];
  columns:any[];
  filterFields:any[];
  quickFilterFields:any[];
  topActions:any[];
  topFilterFields:any[];
  pageFields:any[];
  static propTypes:any;
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showEditColumns: false,
    };
    this.handleAction = this.handleAction.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.onQuickFilterChange = this.onQuickFilterChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleOnSortChange = this.handleOnSortChange.bind(this);
    this.onGridAction = this.onGridAction.bind(this);
    this.onEditColumnChange = this.onEditColumnChange.bind(this);
    this.onFilterAction = this.onFilterAction.bind(this);
    this.onGridChange = this.onGridChange.bind(this);
    this.onTopFilterChange = this.onTopFilterChange.bind(this);
    this.onPopupCloseAction = this.onPopupCloseAction.bind(this);
    this.filterActions = [
      {
        actionType: 'edit-filter',
        iconName: 'filter-list',
        variant: 'outlined',
        cmpType: 'Button',
        buttonText: i18n.translate('Filters'),
      },
    ];
    events.subscribe('onPopupScreenCloseAction', this.onPopupCloseAction);
  }

  onPopupCloseAction(action) {
    if (action.refreshAfter) {
      this.refreshData({});
    }
  }

  getKey(name) {
    const { pageData } = this.props;
    return `${pageData.dataKey || window.location.pathname}_${name}`;
  }

  async componentDidUpdate(preProps) {
    const { pageData: prevPageData } = preProps;
    const { pageData } = this.props;
    if (prevPageData.dataKey !== pageData.dataKey) {
      this.componentDidMount();
    }
  }

  processField(field) {
    const { userData, store } = this.props;
    return {
      ...field,
      label: processEachParam(userData, field.label, undefined, store),
      beforeRender: (field, val, row) => {
        return {
          ...(field.componentProps ? processParams({ ...this.props.userData, ...row }, field.componentProps, undefined, store) : {}),
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
    const { pageData, userData, store } = this.props;
    const overrideParams = {
      filterParams: {},
      quickFilterParams: {},
      topFilterParams: {},
    };
    const queryParams = { ...processParams(userData, pageData.initialValues || {}), ...query.get() };
    this.filterFields = pageData.filterFields?.map((field) => {
      if (queryParams[field.name]) {
        overrideParams.filterParams[field.name] = queryParams[field.name];
      }
      return this.processField(field);
    });
    this.topFilterFields = pageData.topFilterFields?.map((field) => {
      if (queryParams[field.name]) {
        overrideParams.topFilterParams[field.name] = queryParams[field.name];
      }
      return this.processField(field);
    });
    this.quickFilterFields = pageData.quickFilterFields?.map((field) => {
      if (queryParams[field.name]) {
        overrideParams.quickFilterParams[field.name] = queryParams[field.name];
      }
      return this.processField(field);
    });
    this.topActions = pageData.topActions?.map((action) => {
      return {
        ...action,
        buttonText: processEachParam(userData, action.buttonText, undefined, store),
        beforeRender: (col:any, val:any, row:any) => {
          let match = true;
          if (action?.renderMatch) {
            const valid = new Validator(action?.renderMatch);
            valid.setValues(userData);
            match = valid.validateAll();
          }
          if (match === false) {
            return false;
          }
          return {
            ...(action.componentProps ? processParams({ ...this.props.userData, ...row }, action.componentProps, undefined, store) : {}),
          }
        },
      };
    });
    this.pageFields = this.columns = pageData.columns.map((item) => {
      return {
        ...item,
        headerText: processEachParam(userData, item.headerText, undefined, store),
        beforeRender: (col, val, row) => {
          return {
            component: {
              ...(item.componentProps ? processParams({ ...this.props.userData, ...row }, item.componentProps, undefined, store) : {}),
              fields: item.fields
                ? item.fields.map((field) => {
                    return {
                      ...field,
                      beforeRender: (col, val, row) => {
                        return field.componentProps
                          ? {
                              component: processParams({ ...this.props.userData, ...row }, field.componentProps, undefined, store),
                            }
                          : {};
                      },
                    };
                  })
                : undefined,
              actions: item.actions
                ? item.actions.map((action) => {
                    return {
                      ...action,
                      ...processParams({ ...this.props.userData, ...row }, action, undefined, store),
                      render: (row) => {
                        if (action.renderMatch) {
                          const vald = new Validator(action.renderMatch);
                          vald.setValues(row);
                          if (!vald.validateAll()) {
                            return false;
                          }
                        }
                        return true;
                      },
                    };
                  })
                : undefined,
            },
          };
        },
      };
    });
    const objToSave = {
      lastQuery: query.get(),
      pagination: { ...(preference.read('pagination', true) || {}) },
      currentSort: { ...(pageData.currentSort || {}), ...preference.read('currentSort') },
      currentFilter: { ...(queryParams.savedFilter === undefined ? preference.read('currentFilter') : {}), ...overrideParams.filterParams },
      currentQuickFilter: { ...(queryParams.savedFilter === undefined ? preference.read('quickFilter') : {}), ...overrideParams.topFilterParams },
      topFilter: { ...(queryParams.savedFilter === undefined ? preference.read('topFilter') : {}), ...overrideParams.topFilterParams },
      selectedColumns: preference.read('selectedColumns', true) || pageData.defaultColumns || undefined,
      columnsOrder: preference.read('columnsOrder', true),
    };
    await this.props.raiseAction(
      updateUserData({
        lastQuery: objToSave.lastQuery,
        [`${this.getKey('pagination')}`]: objToSave.pagination,
        [`${this.getKey('currentSort')}`]: objToSave.currentSort,
        [`${this.getKey('currentFilter')}`]: objToSave.currentFilter,
        [`${this.getKey('currentQuickFilter')}`]: objToSave.currentQuickFilter,
        [`${this.getKey('topFilter')}`]: objToSave.topFilter,
        [`${this.getKey('selectedColumns')}`]: objToSave.selectedColumns,
        [`${this.getKey('columnsOrder')}`]: objToSave.columnsOrder,
      })
    );

    this.refreshData();
  }
  async onFilterChange(data, field) {
    this.setState({ __currentFilter: data.value });
    await this.props.raiseAction(
      updateUserData({
        [`${this.getKey('tempCurrentFilter')}`]: data.value,
      })
    );
  }
  async onQuickFilterChange(data, action) {
    const { onAction } = this.props;
    this.props.raiseAction(startLoading());
    if (action.actionType) {
      action.currentData = data.value;
      onAction && onAction(data.value, action);
    }
    await this.props.raiseAction(
      updateUserData({
        [`${this.getKey('currentQuickFilter')}`]: data.value,
      })
    );
    await this.refreshData({ pageNo: 1 });
    preference.write('quickFilter', data.value);
    this.props.raiseAction(stopLoading());
  }
  async onTopFilterChange(data, action) {
    const { onAction } = this.props;
    this.props.raiseAction(startLoading());
    await this.props.raiseAction(
      updateUserData({
        [`${this.getKey('topFilter')}`]: data.value,
      })
    );
    if (action.actionType) {
      action.currentData = data.value;
      (await onAction) && onAction(data.value, action);
    }
    await this.refreshData({ pageNo: 1 });
    preference.write('topFilter', data.value);
    this.props.raiseAction(stopLoading());
  }

  getBookmarkableFields(keys, data) {
    if (!keys) {
      return data;
    }
    const obj = {};
    Object.keys(data).forEach((itemKey) => {
      if (keys?.indexOf(itemKey) > -1) {
        obj[itemKey] = data[itemKey];
      }
    });
    return obj;
  }

  async refreshData({ filter, sort, pageSize, pageNo }:any = {}) {
    const { pageData, data, userData, store, raiseAction, onAction } = this.props;

    if (pageData.apiConfig?.search) {
      this.setState({
        isLoading: true,
      });
      const pagination = userData[this.getKey('pagination')] || {};
      const currentSort = userData[this.getKey('currentSort')] || {};
      pageSize = pageSize || pagination.pageSize || pageData.defaultPageSize || defaultPageSize;
      pageNo = pageNo || pagination?.currentPage || 1;
      const sortBy = (sort || currentSort).sortColumn;
      const sortDir = (sort || currentSort).sortOrder;
      if (pageData.bookmarkable === true) {
        const fields = this.getBookmarkableFields(pageData.bookmarkableFields, {
          ...(filter || userData[this.getKey('currentFilter')] || {}),
          ...(userData[this.getKey('currentQuickFilter')] || {}),
          ...(userData[this.getKey('topFilter')] || {}),
        });
        onAction &&
          onAction(
            {},
            {
              actionType: 'self-redirect',
              urlParams: fields,
            }
          );
      }
      await raiseAction(
        postApi(
          {
            ...pageData.apiConfig?.search,
            params: object.extendData(processParams(this.props.userData, pageData.apiConfig?.search.params, undefined, store), {
              ...(filter || this.props.userData[this.getKey('currentFilter')] || {}),
              ...(this.props.userData[this.getKey('currentQuickFilter')] || {}),
              ...(this.props.userData[this.getKey('topFilter')] || {}),
            }),
            query: pageData.apiConfig?.search.query
              ? processParams({ ...this.props.userData, sortBy: `${sortBy}|${sortDir}`, pageSize: pageSize, pageNo: pageNo }, pageData.apiConfig?.search.query)
              : {
                  sortBy: sortBy && sortDir ? `${sortBy}|${sortDir}` : undefined,
                  pageSize: pageSize,
                  pageNo: pageNo,
                },
            dataKey: this.getKey('results'),
          },
          data
        )
      );
      this.setState({
        isLoading: false,
      });
    }
  }

  async handlePageChange(data) {
    const pageNo = data.value.currentPage,
      pageSize = data.value.pageSize;
    preference.write('pagination', { pageSize });
    this.props.raiseAction(startLoading());
    await this.refreshData({ pageNo, pageSize });
    this.props.raiseAction(stopLoading());
  }
  async handleAction(data, action) {
    const { onAction, userData } = this.props;
    switch (action.actionType) {
      case 'edit-cols':
        this.setState({
          showEditColumns: true,
        });
        break;
      case 'edit-filter':
        this.setState({
          showFilter: true,
        });
        this.setState({ __currentFilter: userData[this.getKey('currentFilter')] });
        break;
      default:
        if (action.actionType) {
          action.currentData = data;
          onAction && onAction(data, action);
        }
    }
  }

  async onGridAction(row, action, _) {
    switch (action.actionType) {
      default:
        this.props.raiseAction(startLoading());
        action.currentData = row;
        this.props.onAction && (await this.props.onAction(row, action));
        if (action.refreshAfter) {
          await this.refreshData({});
        }
        this.props.raiseAction(stopLoading());
    }
  }
  async onGridChange(data, action, row) {
    if (action.actionType) {
      this.props.raiseAction(startLoading());
      action.currentData = { ...row, ...data };
      this.props.onAction && (await this.props.onAction({ ...row, ...data }, action));
      if (action.refreshAfter) {
        await this.refreshData({});
      }
      this.props.raiseAction(stopLoading());
    }
  }
  async onFilterAction(data, action) {
    switch (action.actionType) {
      case 'resetFilter':
        await this.setState({
          showFilter: !this.state.showFilter,
        });
        this.props.raiseAction(startLoading());
        await this.props.raiseAction(
          updateUserData({
            [`${this.getKey('currentFilter')}`]: {},
            [`${this.getKey('tempCurrentFilter')}`]: {},
          })
        );
        preference.write('currentFilter', {});
        await this.setState({
          __currentFilter: undefined,
        });
        await this.refreshData({ filter: {}, pageNo: 1 });
        this.props.raiseAction(stopLoading());
        break;
      case 'applyFilter':
        await this.props.raiseAction(
          updateUserData({
            [`${this.getKey('currentFilter')}`]: this.state.__currentFilter,
            [`${this.getKey('tempCurrentFilter')}`]: this.state.__currentFilter,
          })
        );
        preference.write('currentFilter', this.state.__currentFilter);
        await this.setState({
          showFilter: !this.state.showFilter,
          __currentFilter: undefined,
        });
        this.props.raiseAction(startLoading());
        await this.refreshData({});
        this.props.raiseAction(stopLoading());
        break;
    }
  }
  async handleOnSortChange(data) {
    const { currentPage } = this.props.userData[this.getKey('results')] || {};
    preference.write('currentSort', data);
    await this.props.raiseAction(
      updateUserData({
        [`${this.getKey('currentSort')}`]: data,
      })
    );
    this.props.raiseAction(startLoading());
    await this.refreshData({ pageNo: currentPage, sort: data });
    this.props.raiseAction(stopLoading());
  }

  onEditColumnChange(data) {
    const { userData } = this.props;
    if (!data.cancel) {
      this.props.raiseAction(
        updateUserData({
          [`${this.getKey('selectedColumns')}`]: data.value,
          [`${this.getKey('columnsOrder')}`]: data.columnsOrder ? data.columnsOrder : userData[this.getKey('columnsOrder')],
        })
      );
      const objToSave:any = {
        selectedColumns: data.value,
      };
      if (data.columnsOrder) {
        objToSave.columnsOrder = data.columnsOrder;
      }
      preference.writeAll(objToSave);
    }
    this.setState({
      showEditColumns: !this.state.showEditColumns,
    });
  }

  render() {
    const { pageData = {}, userData, store } = this.props;
    const { className = '', styleCode = 'fixed' } = pageData;
    const { Actions, Dialog, Form, Grid, Skeleton } = storage.components.get();
    const currentSort = userData[this.getKey('currentSort')];
    const currentFilter = userData[this.getKey('currentFilter')];
    const currentQuickFilter = userData[this.getKey('currentQuickFilter')];
    const topFilter = userData[this.getKey('topFilter')];
    const selectedColumns = userData[this.getKey('selectedColumns')];
    const columnsOrder = userData[this.getKey('columnsOrder')];
    
    const groupDataMaker = pageData.groupMaker ? (key: string, data: any) => {
      return {
        ...processParams({ ...userData, ...data[0], _key: key, collection: data, _dataCount: data.length }, pageData.groupMaker, undefined, store),
      };
    } : undefined;
    return (
      <div className={`sq-generic-listing sq-v-screen sq-v-screen--${styleCode} ${className}`}>
        <div className="sq-v-screen__container">
          <div className="sq-v-screen__sub-header">
            {pageData.showPageTitle && <div className='sq-generic-listing__header'>{pageData.title}</div>}
            {this.topFilterFields && (
              <div className={'sq-generic-listing__quick'}>
                <Form disabled={this.state.isLoading} userData={userData} onChange={this.onTopFilterChange} className="sq-form--inline-auto p-0" value={topFilter} fields={this.topFilterFields} />
              </div>
            )}
            <Actions
              className="w-auto"
              userData={userData}
              disabled={this.state.isLoading}
              onAction={this.handleAction}
              actions={[
                ...(this.topActions || []),
                {
                  buttonText: i18n.translate('Edit Columns'),
                  iconName: 'edit',
                  variant: 'outlined',
                  cmpType: 'Button',
                  actionType: 'edit-cols',
                },
                ...(this.filterFields ? this.filterActions : []),
              ]}
            />
          </div>
          <div className={`sq-v-screen__container`}>
            <div className="container-fluid">
              <div className="sq-v-screen__pagination-bar d-flex fl-a-items-center justify-content-end mb-2">
                {this.quickFilterFields && (
                  <div className={'sq-generic-listing__quick mt-2'}>
                    <Form disabled={this.state.isLoading} userData={userData} onChange={this.onQuickFilterChange} className="sq-form--inline-auto p-0" value={currentQuickFilter} fields={this.quickFilterFields} />
                  </div>
                )}
              </div>
            </div>
            <div className="sq-generic-listing__grid-wrapper sq-v-screen-grow">
              <Grid
                paginationProps={{
                  onChange: this.handlePageChange,
                  count: userData[this.getKey('results')]?.totalPages,
                  value: userData[this.getKey('results')],
                  enablePageSize: true,
                  defaultPageSize: pageData.defaultPageSize || defaultPageSize,
                  pageSizeOptions: GLOBAL_OPTIONS.noOfResultsDropdown.toArray(),
                }}
                disabled={this.state.isLoading}
                className="sq-basic-grid sq-grid--fixed"
                loader={<Skeleton styleName={`grid-tran`} rows={4} />}
                dataGroup={pageData.dataGroup ? {
                  ...pageData.dataGroup,
                  groupDataMaker
                } : undefined}
                onChange={this.onGridChange}
                onColFilterChange={this.onEditColumnChange}
                selectedColumns={selectedColumns}
                columnsOrder={columnsOrder}
                showColSelection={this.state.showEditColumns}
                onAction={this.onGridAction}
                sortColumn={currentSort?.sortColumn}
                sortOrder={currentSort?.sortOrder}
                onSort={this.handleOnSortChange}
                columns={this.columns}
                enableSort={pageData.enableSort === undefined ? true : pageData.enableSort}
                showHeader={pageData.showHeader === undefined ? true : pageData.showHeader}
                data={userData[this.getKey('results')]?.data}
              />
            </div>
          </div>
        </div>
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
                buttonText: i18n.translate('Apply'),
              },
              {
                actionType: 'resetFilter',
                buttonText: i18n.translate('Reset'),
                variant: 'outlined',
              },
            ]}
            title={'Filters'}
          >
            <Form onChange={this.onFilterChange} userData={userData} className="mt-wide" value={this.state.__currentFilter || currentFilter} fields={this.filterFields} />
          </Dialog>
        </>
      </div>
    );
  }
}

GenericListing.propTypes = {};

export default GenericListing;
