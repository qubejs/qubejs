import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
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
import { getPage, savePageDraft } from '../../redux/admin';
import DynamicContentRoot from '../DynamicContent';

import Button from '../../components/Button';
import Switch from '../../components/Switch';
import * as utils from '../../utils';
import editData from './editConfig';
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

class SiteMapBuilder extends Component {
  props: any;
  state: any;
  static propTypes: any;
  constructor(props) {
    super(props);
    this.state = {
      enableMenu: true,
      autoSave: false,
      enableProps: false,
      contentData: {},
    };
    this.savePageAsDraft = this.savePageAsDraft.bind(this);
    this.onContentChange = this.onContentChange.bind(this);
    this.toggleAutoSave = this.toggleAutoSave.bind(this);
  }

  toggleAutoSave() {
    this.setState({
      autoSave: !this.state.autoSave,
    });
  }

  async componentDidMount() {
    const { pageData, store } = this.props;
    this.props.commonActions.startLoading();
    await this.props.raiseAction(
      getPage(
        {
          path: utils.queryString.query.get().path,
        },
        pageData.getPageConfig
      )
    );
    this.setState({
      contentData: this.props.store.admin.contentData,
    });

    this.props.commonActions.stopLoading();
  }
  async savePageAsDraft(data?, autoSave?) {
    const parms:any = {};
    if (data) {
      parms.pageData = { ...data };
    }
    const { pageData, store } = this.props;
    !autoSave && this.props.commonActions.startLoading();
    await this.props.raiseAction(
      savePageDraft(
        { ...this.state.contentData, ...parms },
        { autoSave, ...pageData.savePageConfig }
      )
    );
    !autoSave && this.props.commonActions.stopLoading();
  }
  async onContentChange(data) {
    await this.setState({
      contentData: { ...this.state.contentData, pageData: { ...data } },
    });
    this.state.autoSave && this.savePageAsDraft(data, this.state.autoSave);
  }
  render() {
    const { className = '' } = this.props;
    const editfinalData = editData(utils.storage.pageBuilder.get());
    return (
      <div
        className={`sq-sitemap-builder sq-v-screen sq-v-screen--fixed ${className}`}
      >
        <DndProvider backend={HTML5Backend}>
          <div className="sq-v-screen__container">
            <div className="sq-sitemap-builder__top-actions text-right mb-wide">
              <div className="container-fluid">
                <Switch
                  label="Autosave"
                  value={this.state.autoSave}
                  onChange={this.toggleAutoSave}
                />
                <Button
                  iconName={'Save'}
                  variant="outlined"
                  buttonText="Save"
                  onClick={() => this.savePageAsDraft()}
                />
              </div>
              {/* <Button iconName={'Preview'} variant="outlined" buttonText="Full Preview" onClick={this.showPreview} /> */}
              {/* <Button iconName={'Publish'} buttonText="Publish" /> */}
            </div>
            <div className="sq-sitemap-builder__content sq-v-screen-grow auto">
              <div className="container-fluid">
                {this.state.contentData?.pageData && (
                  <DynamicContentRoot
                    pageConfig={editfinalData}
                    rootClass={''}
                    initialData={{
                      main: this.state.contentData.pageData,
                    }}
                    contentParams={editfinalData.pageData.params}
                    onContentChange={this.onContentChange}
                    onSubmit={this.savePageAsDraft}
                  />
                )}
              </div>
            </div>
          </div>
        </DndProvider>
      </div>
    );
  }
}

SiteMapBuilder.propTypes = {};

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

export default connect(mapStateToProps, mapDispatchToProps)(SiteMapBuilder);
export { SiteMapBuilder };
