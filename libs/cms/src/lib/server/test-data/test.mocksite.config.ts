import { utils } from '@qubejs/core';

export default {
  theme: 'basic',
  analytics: {
    gaTrackingId: 'G-MOCK'
  },
  launchConfig: {
    '/content/crm/launch/*': utils.datetime.new().addDays(1).toStringDefault(),
    '/content/crm/launched/*': utils.datetime.new().addDays(-1).toStringDefault()
  },
  siteMap: {
    maxNavigationLevel: 2,
    appVersion: '0.1.0',
    title: 'CRM',

    globalNavigation: {
      className: 'sq-global-navigation--bordered',
      classes: {
        wrapper: 'container'
      },
      mobileItems: [],
      rightItems: []
    },
    globalNavigationLoggedIn: {
      mobileItems: [],
      rightItems: []
    },
    globalFooter: {
      classes: {
        item: 'col-xs-12 col-sm-6'
      },
      className: 'sq-footer--light',
      copyrights: '©CRM All Rights Reserved'
    },
    logo: {
      text: '',
      name: 'logo-full',
      imgAlt: 'logo image',
      size: 'dan-wide',
      className: '',
      variant: 'primary',
      href: 'home'
    },
    children: [
      {
        title: 'home'
      }
    ]
  }
};
