import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { ComponentList } from './ComponentList';
import Panel from './Panel';
import { withEditTabsConfig } from './edits/Common';
import {
  startLoading,
  showNotificationMessage,
  closeNotification,
  stopLoading,
  showPopupScreen,
  showPopup,
  setError,
  clearError,
} from '../../redux/common';
import {
  getFieldsMeta,
  createPage,
  getPage,
  savePageDraft,
} from '../../redux/admin';
import ContentEditor from './ContentEditor';
import DynamicContentRoot from '../DynamicContent';
import * as utils from '../../utils';
import ErrorBoundry from '../../components/ErrorBoundry';
import { GLOBAL_OPTIONS } from '../../globals';

import './supported-comps';

import {
  fetchContentPage,
  postApi,
  downloadApi,
  executeHook,
  updateUserData,
  updateMetaData,
  mergeUserData,
  updateErrorData,
  resetUserData,
  sendContact,
} from '../../redux/content';
utils.storage.pageBuilder.setHelpers({
  withEditTabsConfig,
});
utils.storage.pageBuilder.set({
  templates: [
    {
      text: 'apps/core/templates/page',
      value: 'apps/core/templates/page',
    },
  ],
  layouts: [
    {
      text: 'apps/core/layouts/spa',
      value: 'apps/core/layouts/spa',
    },
  ],
  containers: [
    {
      text: 'Default',
      value: 'Default',
    },
  ],
  containerTemplates: [
    {
      text: 'Default',
      value: 'Default',
    },
  ],
  themes: [
    {
      text: 'Main',
      value: 'main',
    },
  ],
});

class PageBuilder extends Component {
  props: any;
  state: any;
  static propTypes: any;
  constructor(props) {
    super(props);
    this.state = {
      enableMenu: true,
      advancedPageConfig: false,
      autoSave: !!utils.queryString.query.get().path,
      enableProps: false,
      pageFetched: false,
      contentData: {
        pageData: {
          updatePageTitle: false,
          items: [],
        },
      },
    };
    this.componentOnDrop = this.componentOnDrop.bind(this);
    this.toggleProps = this.toggleProps.bind(this);
    this.toggleElements = this.toggleElements.bind(this);
    this.toggleQuickPreview = this.toggleQuickPreview.bind(this);
    this.toggleAutoSave = this.toggleAutoSave.bind(this);
    this.onContentChange = this.onContentChange.bind(this);
    this.onContentDelete = this.onContentDelete.bind(this);
    this.savePageAsDraft = this.savePageAsDraft.bind(this);
    this.toggleAdvPageConfig = this.toggleAdvPageConfig.bind(this);
    this.formOnChange = this.formOnChange.bind(this);
    this.onMoveItemDown = this.onMoveItemDown.bind(this);
    this.onMoveItemUp = this.onMoveItemUp.bind(this);
    this.savePageAsNew = this.savePageAsNew.bind(this);
    this.advFormOnChange = this.advFormOnChange.bind(this);
  }

  async componentDidUpdate(prevProps) {
    // console.log('@@@@', prevProps);
    // console.log('> store', this.props.store.common);
    // if (!this.props.store.common.isLoading && !this.state.pageFetched && utils.queryString.query.get().path && this.state.pathFetched !== utils.queryString.query.get().path) {
    //   await this.checkPageLoad();
    // }
  }

  async checkPageLoad() {
    const { pageData, store } = this.props;
    this.props.commonActions.startLoading();
    if (utils.queryString.query.get().path) {
      await this.props.raiseAction(
        getPage(
          {
            path: utils.queryString.query.get().path,
          },
          pageData.getPageConfig
        )
      );
      this.setState({
        pageFetched: true,
        autoSave: true,
        pathFetched: utils.queryString.query.get().path
      });
    } else {
      await this.props.raiseAction(createPage());
    }
    pageData.fieldsMetaConfig &&
      (await this.props.raiseAction(
        getFieldsMeta({}, pageData.fieldsMetaConfig)
      ));
    this.setState({
      contentData: JSON.parse(JSON.stringify(this.props.store.admin.contentData)),
    });
    this.props.commonActions.stopLoading();
  }

  async componentDidMount() {
    await this.checkPageLoad();
  }
  async savePageAsNew() {
    const { pageData } = this.props;
    pageData.createPopupScreen &&
      this.props.commonActions.showPopupScreen({
        ...pageData.createPopupScreen,
        initialData: {
          current: {
            ...this.state.contentData,
            ...pageData.createPopupScreen?.initialData,
          },
        },
      });
  }
  async savePageAsDraft(autoSave?) {
    const { pageData } = this.props;
    !autoSave && this.props.commonActions.startLoading();
    await this.props.raiseAction(
      savePageDraft(this.state.contentData, {
        autoSave: autoSave === true,
        ...pageData.savePageConfig,
      })
    );
    !autoSave && this.props.commonActions.stopLoading();
  }
  componentOnDrop(item, e, idx) {
    const newItems = [
      ...(this.state.contentData.pageData.items || []),
      {
        component: item.name,
        name:
          item.name.toLowerCase() +
          (this.state.contentData.pageData.items?.length || 1),
        ...item.metaData.sampleData,
      },
    ];
    const dragIndex = newItems.length - 1;
    this.setState({
      contentData: {
        ...this.state.contentData,
        pageData: {
          ...this.state.contentData.pageData,
          items:
            idx !== undefined
              ? update(newItems, {
                  $splice: [
                    [dragIndex, 1],
                    [idx, 0, newItems[dragIndex]],
                  ],
                })
              : newItems,
        },
      },
    });
    this.checkAutoSave();
  }
  toggleProps() {
    this.setState({ enableProps: !this.state.enableProps });
  }
  toggleElements() {
    this.setState({ enableMenu: !this.state.enableMenu });
  }

  advFormOnChange(data) {
    this.setState({
      contentData: {
        ...this.state.contentData,
        ...data.value,
      },
    });
    this.checkAutoSave();
  }

  formOnChange(data) {
    const finalData = {
      pageData: {
        ...this.state.contentData.pageData,
        ...data.value,
      },
    };
    this.setState({
      contentData: {
        ...this.state.contentData,
        pageData: finalData.pageData,
      },
    });
    this.checkAutoSave();
  }
  onContentChange(data, idx) {
    const finalData = {
      pageData: {
        ...this.state.contentData.pageData,
        items: [...this.state.contentData.pageData.items],
      },
    };
    finalData.pageData.items[idx] = {
      ...finalData.pageData.items[idx],
      ...data,
    };
    this.setState({
      contentData: {
        ...this.state.contentData,
        pageData: finalData.pageData,
      },
    });
    this.checkAutoSave();
  }

  onContentDelete(idx) {
    const finalData = {
      pageData: {
        ...this.state.contentData.pageData,
        items: [...this.state.contentData.pageData.items],
      },
    };
    finalData.pageData.items.splice(idx, 1);
    this.setState({
      contentData: {
        ...this.state.contentData,
        pageData: finalData.pageData,
      },
    });
    this.checkAutoSave();
  }

  toggleQuickPreview() {
    this.setState({
      preview: !this.state.preview,
    });
  }
  toggleAutoSave() {
    this.setState({
      autoSave: !this.state.autoSave,
    });
  }
  toggleAdvPageConfig() {
    this.setState({
      advancedPageConfig: !this.state.advancedPageConfig,
    });
  }
  showPreview() {
    utils.redirect.redirectTo(
      utils.queryString.query.get().path,
      {},
      { target: '_blank' }
    );
  }

  onMoveItemDown(index) {
    const finalData = {
      pageData: {
        ...this.state.contentData.pageData,
        items: [...this.state.contentData.pageData.items],
      },
    };
    finalData.pageData.items = update(finalData.pageData.items, {
      $splice: [
        [index, 1],
        [index + 1, 0, finalData.pageData.items[index]],
      ],
    });
    this.setState({
      contentData: {
        ...this.state.contentData,
        pageData: finalData.pageData,
      },
    });
    this.checkAutoSave();
  }

  checkAutoSave() {
    setTimeout(() => {
      this.state.autoSave && this.savePageAsDraft(true);
    }, 200);
  }

  onMoveItemUp(index) {
    const finalData = {
      pageData: {
        ...this.state.contentData.pageData,
        items: [...this.state.contentData.pageData.items],
      },
    };
    finalData.pageData.items = update(finalData.pageData.items, {
      $splice: [
        [index, 1],
        [index - 1, 0, finalData.pageData.items[index]],
      ],
    });
    this.setState({
      contentData: {
        ...this.state.contentData,
        pageData: finalData.pageData,
      },
    });
    this.checkAutoSave();
  }

  getLiveFields(items = []) {
    let arryData = [];

    items.forEach((item) => {
      if (item.component === 'Form') {
        arryData.push({
          text: `.${item.name}`,
          value: `.${item.name}`,
        });
        item.fields?.forEach((field) => {
          arryData.push({
            text: `.${item.name}.${field.name}`,
            value: `.${item.name}.${field.name}`,
          });
        });
      }
      if (item.items) {
        arryData = arryData.concat(this.getLiveFields(item.items));
      }
    });
    return arryData;
  }

  getDrivedProps() {
    return {
      liveFields: this.getLiveFields(this.state.contentData?.pageData?.items),
    };
  }

  render() {
    const { className = '', pageData, store } = this.props;
    const compList = { ...utils.storage.dynamicComponents.get() };
    const { Form, IconButton, Button, Switch } = utils.storage.components.get();
    return (
      <div
        className={`sq-page-builder sq-v-screen sq-v-screen--fixed ${className}`}
      >
        <div className="sq-v-screen__container">
          <div className="sq-page-builder__top-actions mb-wide">
            {utils.queryString.query.get().path && (
              <Switch
                label="Autosave"
                value={this.state.autoSave}
                onChange={this.toggleAutoSave}
              />
            )}
            <Switch
              label="Quick Preview"
              value={this.state.preview}
              onChange={this.toggleQuickPreview}
            />
            {!utils.queryString.query.get().path && (
              <Button
                iconName={'Save'}
                variant="outlined"
                disabled={!pageData.createPopupScreen}
                buttonText="Save"
                onClick={() => this.savePageAsNew()}
              />
            )}
            {utils.queryString.query.get().path && (
              <Button
                iconName={'Save'}
                variant="outlined"
                buttonText="Save"
                onClick={() => this.savePageAsDraft()}
              />
            )}
            {
              <Button
                iconName={'Preview'}
                variant="outlined"
                disabled={!utils.queryString.query.get().path}
                buttonText="Full Preview"
                onClick={this.showPreview}
              />
            }
            {/* <Button iconName={'Publish'} buttonText="Publish" /> */}
          </div>
          <div className="sq-page-builder__content sq-v-screen-grow">
            <DndProvider backend={HTML5Backend}>
              <div className="sq-page-builder__l-options">
                <IconButton
                  title="Elements"
                  iconName="code"
                  variant={!this.state.enableMenu ? 'default' : 'primary'}
                  onClick={this.toggleElements}
                />
                <IconButton
                  title="Page Properties"
                  iconName="default"
                  variant={!this.state.enableProps ? 'default' : 'primary'}
                  onClick={this.toggleProps}
                />
              </div>
              {/* <div className="sq-page-builder__r-options">
              </div> */}

              <div className="sq-page-builder__container">
                <div className="sq-page-builder__left">
                  {this.state.enableMenu && (
                    <Panel
                      header="Elements"
                      theme="dark"
                      onClose={this.toggleElements}
                    >
                      <div className="row">
                        <ComponentList
                          compList={compList}
                          filter={pageData.compListFilter}
                        />
                      </div>
                    </Panel>
                  )}
                </div>
                <div className="sq-page-builder__center">
                  {this.state.preview && (
                    <ErrorBoundry>
                      <DynamicContentRoot
                        mode="preview"
                        pageConfig={this.state.contentData}
                      />
                    </ErrorBoundry>
                  )}
                  {!this.state.preview && (
                    <>
                      <ContentEditor
                        fieldsMeta={{
                          ...this.getDrivedProps(),
                          ...store.admin.fieldsMeta,
                        }}
                        pageData={this.state.contentData.pageData}
                        compList={compList}
                        onDelete={this.onContentDelete}
                        onChange={this.onContentChange}
                        onMoveItemUp={this.onMoveItemUp}
                        onMoveItemDown={this.onMoveItemDown}
                        onDrop={this.componentOnDrop}
                      />
                    </>
                  )}
                </div>
                <div className="sq-page-builder__right">
                  {this.state.enableProps && (
                    <Panel
                      header="Page Properties"
                      enableFullScreen={true}
                      onClose={this.toggleProps}
                    >
                      <div className="d-flex j-content-fl-end">
                        <Switch
                          label="Advanced"
                          value={this.state.advancedPageConfig}
                          onChange={this.toggleAdvPageConfig}
                        />
                      </div>
                      {this.state.advancedPageConfig && (
                        <Form
                          fields={[
                            {
                              name: 'pageData',
                              cmpType: 'FormObject',
                              label: 'Page Data',
                            },
                          ]}
                          onChange={this.advFormOnChange}
                          value={this.state.contentData}
                        />
                      )}
                      {!this.state.advancedPageConfig && (
                        <Form
                          value={this.state.contentData.pageData}
                          onChange={this.formOnChange}
                          fields={[
                            {
                              name: 'title',
                              cmpType: 'Input',
                              label: 'Title',
                            },
                            {
                              name: 'headScript',
                              cmpType: 'Textarea',
                              label: 'Dynamic Script',
                            },
                            // {
                            //   name: 'pageBackground',
                            //   cmpType: 'ColorPicker',
                            //   label: 'Page background',
                            // },
                            {
                              name: 'updatePageTitle',
                              cmpType: 'Switch',
                              label: 'updatePageTitle',
                            },
                            {
                              name: 'init',
                              cmpType: 'FormObject',
                              label: 'init',
                            },
                            {
                              name: 'hook',
                              cmpType: 'FormObject',
                              label: 'hook',
                            },
                            {
                              name: 'merge',
                              cmpType: 'FormObject',
                              label: 'merge',
                            },
                            {
                              name: 'template',
                              cmpType: 'Autocomplete',
                              label: 'Template',
                              options:
                                pageData.templates ||
                                utils.storage.pageBuilder.get().templates,
                            },
                            {
                              name: 'layout',
                              cmpType: 'Autocomplete',
                              label: 'Layout',
                              options:
                                pageData.layouts ||
                                utils.storage.pageBuilder.get().layouts,
                            },
                            {
                              name: 'theme',
                              cmpType: 'Autocomplete',
                              label: 'Theme',
                              options:
                                pageData.themes ||
                                utils.storage.pageBuilder.get().themes,
                            },
                            {
                              name: 'className',
                              cmpType: 'InputWithOptions',
                              label: 'className',
                              options: GLOBAL_OPTIONS.bodyContainers.toArray(),
                            },
                            {
                              name: 'wrapperClassName',
                              cmpType: 'InputWithOptions',
                              label: 'wrapperClassName',
                              options:
                                GLOBAL_OPTIONS.pageWrapperClasses.toArray(),
                            },
                            {
                              cmpType: 'Autocomplete',
                              name: 'container',
                              label: 'container',
                              options:
                                pageData.containers ||
                                utils.storage.pageBuilder.get().containers,
                            },
                            {
                              cmpType: 'Input',
                              name: 'bodyClassName',
                              label: 'bodyClassName',
                            },
                            {
                              cmpType: 'Autocomplete',
                              name: 'containerTemplate',
                              label: 'containerTemplate',
                              options:
                                pageData.containerTemplates ||
                                utils.storage.pageBuilder.get()
                                  .containerTemplates,
                            },
                            {
                              cmpType: 'FormObject',
                              name: 'custom',
                              label: 'custom',
                            },
                            ...(pageData.customProps || []),
                          ]}
                        />
                      )}
                    </Panel>
                  )}
                </div>
              </div>
            </DndProvider>
          </div>
          <div className="sq-page-builder__footer"></div>
        </div>
      </div>
    );
  }
}

PageBuilder.propTypes = {};

const mapStateToProps = (state) => {
  return {
    store: {
      ...state,
    },
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    contentActions: {
      postApi: (data) => dispatch(postApi(data)),
      downloadApi: (data) => dispatch(downloadApi(data)),
      updateMetaData: (data) => dispatch(updateMetaData(data)),
      executeHook: (data) => dispatch(executeHook(data)),
      fetchContentPage: (data) => dispatch(fetchContentPage(data)),
      resetUserData: (data) => dispatch(resetUserData(data)),
      updateUserData: (data) => dispatch(updateUserData(data)),
      mergeUserData: (data) => dispatch(mergeUserData(data)),
      sendContact: (data) => dispatch(sendContact(data)),
      updateErrorData: (data) => dispatch(updateErrorData(data)),
    },
    commonActions: {
      showNotificationMessage: (data) =>
        dispatch(showNotificationMessage(data)),
      closeNotification: () => dispatch(closeNotification()),
      startLoading: (data) => dispatch(startLoading(data)),
      showPopup: (data) => dispatch(showPopup(data)),
      stopLoading: (data) => dispatch(stopLoading(data)),
      setError: (data) => dispatch(setError(data)),
      clearError: (data) => dispatch(clearError(data)),
      showPopupScreen: (data) => dispatch(showPopupScreen(data)),
    },
    raiseAction: dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PageBuilder);
