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
      '/content/pages/*': {
        url: '/crm/api/v1/dynamic/form/public/search',
        params: {
          path: '::test.name::.url',
        },
        method: 'post',
      },
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
          title: 'PageListing',
          iconName: 'dashboard',
          href: '/content/pagelisting',
        },
        {
          title: 'Login',
          iconName: 'dashboard',
          href: '/login',
        },
        {
          title: 'Register',
          iconName: 'dashboard',
          href: '/register',
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
      name: 'home',
      topName: 'Computer',
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
