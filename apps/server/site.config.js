import envConfig from './config/environment';

export default {
  analytics: envConfig.analytics,
  launchConfig: {
    // '/content/en/ho-*': {
    //   start: '2022-03-20T03:30:00.000Z',
    //   end: '2022-03-21T03:30:00.000Z',
    // },
    // },
  },
  siteMap: {
    theme: 'main',
    maxNavigationLevel: 2,
    appVersion: '1.0.0',
    title: 'Qubejs: A react based framework',
    dynamicContentConfig: {
      '/content/dynamic/*': {
        url: '/api/v1/dynamic/form/public/search',
        params: {
          path: '.url',
        },
        method: 'post',
      },
    },
    defaultRedirect: {
      '.*premium.com': '/ho/premium',
      '.*basic.com': '/ho/basic',
    },
    errorRedirects: {
      500: '/ho/error',
      404: '/ho/404',
      '/ho/app/*': {
        500: '/ho/error-d',
        404: '/ho/404-d',
      },
    },
    globalNavigation: {
      className: 'sq-global-navigation--bordered sq-global-navigation--blured',
      navPosition: 'sticky',
      classes: {
        wrapper: 'container',
      },
      items: [
        {
          title: 'Dashboard',
          iconName: 'dashboard',
          href: '/ho/app/dashboard',
        },
        {
          title: 'Select Prospect',
          href: '/ho/app/prospect/select-prospect',
          showInMenu: false,
          children: [
            {
              title: 'Add New Prospect',
              href: '/ho/app/prospect/addnewprospect',
            },
          ],
        },
      ],
      mobileItems: [],
      rightItems: [],
    },
    globalFooter: {
      classes: {
        item: 'col-xs-12 col-sm-6',
      },
      className: 'sq-footer--light',
      copyrights: '© Sales Portal, All Rights Reserved',
    },
    logo: {
      text: '',
      // image: envConfig.publicUrl + '/assets/imgs/rise-white.png',
      // mobileImage: envConfig.publicUrl + '/daniels-logo-blue.png',
      name: 'home',
      imgAlt: 'logo image',
      size: 'dan-wide',
      className: '',
      variant: 'primary',
      href: 'home',
    },
    children: [],
  },
  brands: {},
};
