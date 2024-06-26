import { useState } from 'react';
import PropTypes from 'prop-types';
import { utils } from '@qubejs/web-react';
// import * as utils from '../../utils';

import './dashboard.scss';
const { translate } = utils.translate;
// import { translate } from 'sq-core/web/utils/translate';
const VERSION = utils.win.getWindow().APP_CONFIG.appVersion;

const Dashboard = ({
  children,
  appBarColor = 'default',
  onAnalytics,
  pageData = {},
  data = {},
  store,
}: any) => {
  const [menuItems, setMenuItems] = useState([
    {
      text: translate('Dashboard'),
      icon: 'dashboard',
      to: 'dashboard',
    },
    '-',
    {
      text: translate('My Account'),
      icon: 'account',
      children: [
        {
          text: translate('All Accounts'),
          icon: 'accounts',
          to: 'myaccounts',
        },
      ],
    },
    {
      text: translate('Recurrning'),
      icon: 'recurring',
      children: [
        {
          text: translate('Entries'),
          icon: 'expenses',
          to: 'recurringexpenses',
        },
      ],
    },
    {
      text: translate('Budget'),
      icon: 'budget',
      to: 'budget',
    },
    {
      text: translate('Loans'),
      icon: 'loan',
      children: [
        {
          text: translate('My loans'),
          to: 'myloans',
        },
      ],
    },
    {
      text: translate('Transactions'),
      icon: 'transactions',
      to: 'transactions',
    },
    {
      text: translate('Contacts'),
      icon: 'people',
      to: 'contacts',
    },
    '-',
    {
      text: translate('Forecast'),
      icon: 'chart',
      children: [
        {
          text: translate('Report'),
          icon: 'tablechart',
          to: '/forecast/report',
        },
        {
          text: translate('Chart'),
          icon: 'trendingup',
          to: '/forecast/chart',
        },
      ],
    },
    '-',
    {
      text: translate('Shared'),
      icon: 'group-expense',
      children: [
        {
          text: translate('Groups'),
          icon: 'groupwork',
          to: '/group/groups',
        },
        {
          text: translate('Contacts'),
          icon: 'people',
          to: '/group/contacts',
        },
      ],
    },
    '-',
    {
      text: translate('Categories'),
      icon: 'list',
      to: 'categories',
    },
    {
      text: translate('Settings'),
      icon: 'settings',
      to: 'settings',
    },
    {
      text: translate('Profile'),
      icon: 'user',
      to: 'profile',
    },

    '-',
    {
      text: translate('Go Premium'),
      icon: 'premium',
      to: 'gopremium',
    },

    '-',
    {
      text: translate('FAQs'),
      icon: 'help',
      to: 'faqs',
    },
    '-',
    {
      text: translate('Logout'),
      icon: 'logout',
      to: 'loggedout',
      onClick: () => {
        // this.props.authStore.logout();
      },
    },
  ]);

  const onMenuItemClick = (item: any) => {
    // const { onAnalytics } = this.props;
    // if (item.type === 'popup') {
    //   this.props.commonStore.openScreen(item.path, item.text, {
    //     close: () => {
    //       this.props.forecastStore.unreadNotifications = 0;
    //     },
    //   });
    // }
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
  };
  const { Navigation } = utils.storage.components.get();
  let { siteMap = {} } = data;
  siteMap = siteMap?.siteMap
    ? siteMap
    : utils.win.getWindow().APP_CONFIG?.siteMap;
  let props: any = {};
  props = { ...siteMap?.siteMap?.globalNavigation };
  return (
    <div className={`sq-template sq-template--dashobard`}>
      <header className={`sq-template__header ${appBarColor}`}>
        <div className="container">
          <Navigation
            appBarColor={appBarColor}
            classes={{
              drawer: 'sq-dash-drawer',
            }}
            onMenuItemClick={onMenuItemClick}
            onAnalytics={onAnalytics}
            rightMenu={[
              {
                text: translate('Notifications'),
                icon: 'notification',
                type: 'popup',
                path: '/notifications',
                total: 1, //this.props.forecastStore.unreadNotifications,
              },
            ]}
            appVersion={VERSION}
            options={props.items.map((i) => ({
              text: i.title,
              to: i.href,
              children: i.children?.map((i) => ({
                text: i.title,
                to: i.href,
              })),
            }))}
          />
        </div>
      </header>
      <div id={`app-body`} className="sq-template__content">
        {children}
      </div>
      <footer className="sq-template__footer"></footer>
    </div>
  );
};

Dashboard.propTypes = {
  children: PropTypes.node,
  authStore: PropTypes.object,
  commonStore: PropTypes.object,
  forecastStore: PropTypes.object,
  userStore: PropTypes.object,
  onAnalytics: PropTypes.func,
  appBarColor: PropTypes.string,
  color: PropTypes.object,
  data: PropTypes.object,
};

export default Dashboard;
