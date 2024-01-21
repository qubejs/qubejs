import { connect } from 'react-redux';
import { storage, browser, apiBridge } from '../../utils';
import DynamicContent from '../DynamicContent';
import ErrorBoundry from '../ErrorBoundry';
import { closePopupScreen, closePopup } from '../../redux/common';

const Application = ({ children, progressProps = {}, ...rest }) => {
  const { store, userData, raiseAction } = rest;
  const containers = storage.containers.get();
  const { Dialog, Progress } = storage.components.get();
  const { popupScreen } = store.common;
  const RouterComponent = containers[popupScreen.name]
    ? containers[popupScreen.name]
    : popupScreen?.props?.url
    ? DynamicContent
    : undefined;
  const { ...Routerprops } = popupScreen.props || {};

  const handleClosePopup = () => {
    raiseAction(closePopup());
  };
  const handleClosePopupScreen = () => {
    raiseAction(closePopupScreen());
  };
  return (
    <>
      {!RouterComponent && store.common.isLoading && (
        <Progress style="fixed" color="secondary" {...progressProps} />
      )}
      <Dialog
        open={store.common.popup.show}
        content={store.common.popup.message}
        title={store.common.popup.title}
        actions={
          store.common.popup.actions || [
            { buttonText: 'Ok', actionType: 'close' },
          ]
        }
        onClose={handleClosePopup}
        onAction={handleClosePopup}
        severity={store.common.popup.type}
      />
      {RouterComponent && store.common.popupScreen.show && (
        <Dialog
          open={store.common.popupScreen.show}
          isLoading={store.common.isLoading}
          fullScreen={browser.breakpoints.down('sm')}
          content={
            <ErrorBoundry>
              {store.common.isLoading && (
                <Progress color="secondary" {...progressProps} style="screen" />
              )}
              <RouterComponent
                {...rest}
                dataPacket={{
                  ...userData,
                  hasDialog: true,
                }}
                {...Routerprops}
                {...store.common.popupScreen.props}
              />
            </ErrorBoundry>
          }
          {...store.common.popupScreen.dialogProps}
          title={store.common.popupScreen.title}
          onClose={() => {
            handleClosePopupScreen();
            apiBridge.events.emit('onPopupScreenClose');
          }}
          onAction={() => {
            handleClosePopupScreen();
            apiBridge.events.emit('onPopupScreenAction');
          }}
        />
      )}
      <div className="sq-app__main">{children}</div>
    </>
  );
};

// export default Application;
const mapStateToProps = (state) => {
  return {
    store: {
      ...state,
    },
    userData: state.content.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    commonActions: {
      closePopup: () => dispatch(closePopup()),
      closePopupScreen: () => dispatch(closePopupScreen()),
    },
    raiseAction: dispatch,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Application);
