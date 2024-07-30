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
      items:[
        {
          title: 'Containers',
          href: '/content/in/xpentro',
          children: [
            {
              title: 'Generic Listing',
              href: '/content/pagelisting-home',
            },
            {
              title: 'Generic Listing (Dashboard template)',
              href: '/content/pagelisting',
            },
            {
              title: 'Select Popup',
              href: '/content/components/select-popup',
            },
            {
              title: 'Page Editor',
              href: '/content/trynow',
            },
            {
              title: 'Dashboard',
              href: '/content/dashboard',
            },
          ],
        },
        {
          title: 'Components',
          href: '/content/in/components',
          children: [
           
            {
              title: 'Custom processor',
              href: '/content/components/c-processor',
            },
            {
              title: 'Select Popup',
              href: '/content/components/select-popup',
            },
          ],
        },
        {
          title: 'About us',
          href: '/content/in/aboutus',
          always: true,
          children: [
            {
              title: 'Overview',
              href: '/content/in/aboutus',
            },
            {
              title: 'Contact',
              href: '/content/in/aboutus/contact',
            },
          ],
        },
      ],
      mobileItems: [
        {
          type: 'LinkButton',
          color: 'secondary',
          iconName: 'login',
          iconSize: 'small',
          buttonText: 'Login',
          to: '/login',
        },
      ],
      rightItems: [
        {
          type: 'LinkButton',
          color: 'none',
          buttonText: '',
          className: 'sq-link--button mr-4',
          iconName: 'email',
          to: '/contact',
          analytics: {
            click: {
              type: 'event',
              eventName: 'link_click',
              action: 'contact',
              label: 'Contact',
              category: 'Content',
              section: 'Homepage',
            },
          },
        },
        {
          type: 'LinkButton',
          iconName: 'login',
          color: 'secondary',
          size: 'small',
          iconSize: 'small',
          buttonText: 'Login',
          to: '/login',
        },
        {
          type: 'Button',
          size: 'small',
          color: 'secondary',
          variant: 'outlined',
          buttonText: 'Register',
          to: '/content/in/register',
        },
      ],
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
