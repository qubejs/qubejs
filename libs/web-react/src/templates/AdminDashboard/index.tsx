import PropTypes from 'prop-types';
import * as utils from '../../utils';
import ErrorBoundry from '../../components/ErrorBoundry';
import AdminContainer from '../AdminContainer';
import { clearUser, logout } from '../../redux/authentication';

import './_admin-dashboard.scss';

class AdminDashboard extends AdminContainer {
  props: any;
  state: any;
  static propTypes: any;
  constructor(props) {
    super(props);
    this.state = {
      openDrawer: false,
    };
    this.onMenuItemClick = this.onMenuItemClick.bind(this);
    this.onUserMenuAction = this.onUserMenuAction.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  onMenuItemClick(item) {
    const { onAnalytics } = this.props;
    if (item.type === 'popup') {
      this.props.commonActions.openScreen(item.path, item.text, {
        close: () => {},
      });
    }
    onAnalytics &&
      onAnalytics({
        type: 'event',
        eventName: 'link_click',
        action: 'navigate',
        category: 'Navigation',
        viewType: item.type,
        label: item.text,
        section: 'Global',
      });
  }
  handleNavClick(item) {
    utils.redirect.redirectTo(item.href);
  }

  onUserMenuAction(action) {
    switch (action.actionType) {
      case 'logout':
        utils.redirect.redirectTo('login');
        this.props.raiseAction(logout());
        this.props.raiseAction(clearUser());
        break;
      case 'redirect':
        utils.redirect.redirectTo(action.to, action.params, action.options);
        break;
    }
  }

  toggleMenu() {
    this.setState({
      openDrawer: !this.state.openDrawer,
    });
  }

  render() {
    const {
      children,
      appBarColor = 'default',
      location,
      userData,
    } = this.props;
    const { Icon, LeftNavigation, UserMenu, BreadCrumb } =
      utils.storage.components.get();
    const { data = {}, store } = this.props;
    const { pageData = {}, metaData = {}, siteMap = {} } = data;
    const { templateClasses = {} } = pageData;
    const listOfActions = [
      {
        iconName: 'person',
        iconSize: 'small',
        actionType: 'redirect',
        to: 'editProfile',
        className: 'sq-icon--bg-icon',
        buttonText: 'Profile',
      },
      {
        iconName: 'login',
        actionType: 'redirect',
        to: 'profileChangePassword',
        iconSize: 'small',
        className: 'sq-icon--bg-icon',
        buttonText: 'Change password',
      },
      'divider',
      // {
      //   iconName: 'money',
      //   actionType: 'billing',
      //   iconSize: 'small',
      //   buttonText: 'Billing',
      // },
      {
        iconName: 'logout',
        actionType: 'logout',
        iconSize: 'small',
        buttonText: 'Logout',
      },
    ].filter((i) => !!i);
    const { currentUser } = this.props.store.authentication;
    const logo = siteMap.siteMap.logo;
    
    return (
      <>
        <div
          className={`admin-app-template admin-app-template--dashboard ${
            templateClasses.root || ''
          }`}
        >
          <header className={`sq-template__header ${appBarColor}`}>
            <div className="sq-template__header-text">
              <div className="sq-template-menu-trigger">
                <Icon
                  name="Menu"
                  size="medium"
                  variant="primary"
                  onClick={this.toggleMenu}
                />
              </div>
              {logo.topName && (
                <Icon
                  name={logo.topName}
                  className="sq-template-menu-logo"
                  size="wide"
                />
              )}
              {logo.topImage && (
                <img
                  className="sq-template-menu-logo-img"
                  src={logo.topImage}
                  alt={logo.topImageAlt}
                />
              )}
              <div className="sq-template-menu-logo"></div>
            </div>
            {store.authentication.currentUser && (
              <UserMenu
                user={store.authentication.currentUser}
                onAction={this.onUserMenuAction}
                listOfActions={listOfActions}
              />
            )}
          </header>
          <div className="admin-app-template__main">
            <div className="admin-app-template__left-nav">
              <LeftNavigation
                logo={logo}
                onCloseDrawer={this.toggleMenu}
                openDrawer={this.state.openDrawer}
                items={
                  currentUser
                    ? siteMap.siteMap.globalNavigationLoggedIn.navigation
                    : siteMap.siteMap.globalNavigation.navigation
                }
                roles={[]}
                permissions={store.authentication.currentUser?.permissions}
                className={'sq-left-navigation--compact'}
                onClick={this.handleNavClick}
              />
            </div>
            <div className="admin-app-template__right-body">
              <div
                className={`sq-content-page sq-template sq-template--100-h sq-template--flex-page sq-template--dashobard sq-content-page--top-0`}
              >
                <section className="sq-template__sub-header">
                  <BreadCrumb
                    navigation={
                      siteMap.siteMap.globalNavigationLoggedIn.navigation
                    }
                    userData={userData}
                    appStore={store}
                    breadcrumb={store.content.breadcrumb}
                    roles={store.authentication.currentUser?.roles}
                    permissions={store.authentication.currentUser?.permissions}
                    currentPath={location.pathname}
                  />
                </section>
                <div
                  className={`sq-template__content ${
                    templateClasses.content || ''
                  }`}
                >
                  <ErrorBoundry>{children}</ErrorBoundry>
                </div>
                <footer className="sq-template__footer">
                  <div className="sq-template__footer-text"></div>
                </footer>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

AdminDashboard.propTypes = {
  children: PropTypes.any,
  appStore: PropTypes.object,
  commonActions: PropTypes.object,
  forecastStore: PropTypes.object,
  location: PropTypes.object,
  onAnalytics: PropTypes.func,
  raiseAction: PropTypes.func,
  appBarColor: PropTypes.string,
  color: PropTypes.object,
  data: PropTypes.object,
};

export default AdminDashboard;
