import envConfig from './config/environment';
import packJson from '../../package.json';

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
    appVersion: packJson.version,
    title: 'Qubejs: A react based framework',
    dynamicContentConfig: {
      //enable pages from other cms
      // '/content/test/*': {
      //   url: '/api/v1/dynamic/form/public/search',
      //   params: {
      //     path: '::test.name::.url',
      //   },
      //   method: 'post',
      // },
    },
    defaultRedirect: {
      '.*premium.com': '/content/premium',
      '.*basic.com': '/content/basic',
    },
    errorRedirects: {
      500: '/content/error',
      404: '/content/404',
      '/content/app/*': {
        500: '/content/error-d',
        404: '/content/404-d',
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
          href: '/content/app/dashboard',
        },
        {
          title: 'About us',
          href: '/content/app/aboutus',
          showInMenu: false,
          children: [
            {
              title: 'Contact us',
              href: '/content/app/contact',
            },
          ],
        },
      ],
      mobileItems: [],
      rightItems: [],
    },
    globalNavigationLoggedIn: {
      className: 'sq-global-navigation--bordered sq-global-navigation--blured',
      navPosition: 'sticky',
      classes: {
        wrapper: 'container',
      },
      navigation: [
        {
          title: 'Dashboard',
          iconName: 'dashboard',
          href: '/content/app/dashboard',
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
