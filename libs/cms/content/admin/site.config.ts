export default {
  theme: 'basic',
  analytics: {
    gaTrackingId: 'est',
  },
  siteMap: {
    maxNavigationLevel: 2,
    appVersion: '0.0.0',
    title: 'QubeJS: Admin Panel',

    errorRedirects: {
      500: '/ho/pages/error',
      404: '/ho/pages/404',
      launchSoon: '/ho/pages/wait',
      launchEnded: '/ho/pages/ended',
      '/ho/admin/*': {
        500: '/ho/admin/common/error',
        404: '/ho/admin/common/404',
      },
    },
    globalNavigation: {
      className: 'sq-global-navigation--bordered daneil-navigation--site',
      navPosition: 'fixed',
      classes: {
        wrapper: 'container',
      },
      navigation: [],
      mobileItems: [],
      rightItems: [],
    },
    globalNavigationLoggedIn: {
      className: 'sq-global-navigation--bordered daneil-navigation--site',
      navPosition: 'fixed',
      navigation: [
        {
          title: 'Dashboard',
          iconName: 'dashboard',
          href: '/content/admin/portal/dashboard',
          header: 'Dashboard Module',
          children: [],
        },
        {
          title: 'Pages',
          iconName: 'Pages',
          href: '/content/admin/portal/pages',
          header: 'Content Pages',
          children: [
            {
              title: 'Create new',
              // key: 'serviceRequestSubMenu',
              iconName: 'AddBox',
              href: '/content/admin/portal/pages/create',
              children: [],
            },
            {
              title: 'Edit page',
              // key: 'serviceRequestSubMenu',
              hideInMenu: true,
              href: '/content/admin/portal/pages/edit',
              children: [],
            },
            {
              title: 'Edit SiteMap',
              // key: 'serviceRequestSubMenu',
              hideInMenu: true,
              href: '/content/admin/portal/pages/editmap',
              children: [],
            },
          ],
        },
        {
          title: 'Admin Settings',
          iconName: 'Settings',
          href: '/content/admin/portal/adminsettings',
          header: 'Admin Settings',
          children: [
            {
              title: 'Manage Users',
              iconName: 'people',
              href: '/content/admin/portal/users',
              children: [
                {
                  title: 'Create new',
                  // key: 'serviceRequestSubMenu',
                  iconName: 'AddBox',
                  href: '/content/admin/portal/users/create',
                  children: [],
                },
                {
                  title: 'Edit user',
                  // key: 'serviceRequestSubMenu',
                  hideInMenu: true,
                  href: '/content/admin/portal/users/edit',
                  children: [],
                },
              ],
            },
            {
              title: 'Email Templates',
              iconName: 'people',
              href: '/content/admin/portal/emailtemplates',
              children: [
                {
                  title: 'Create new',
                  // key: 'serviceRequestSubMenu',
                  iconName: 'AddBox',
                  href: '/content/admin/portal/emailtemplates/new',
                  children: [],
                },
                {
                  title: 'Edit Template',
                  // key: 'serviceRequestSubMenu',
                  hideInMenu: true,
                  href: '/content/admin/portal/emailtemplates/edit',
                  children: [],
                },
              ],
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
      copyrights: '© QUbeJS, All Rights Reserved',
    },
    logo: {
      text: '',
      imgAlt: 'logo image',
      // name: 'logo',
      mobileName: 'logo-wide',
      topName: 'logo-wide',
      size: 'dan-wide',
      className: '',
      variant: 'primary',
      href: 'home',
    },
    children: [
      {
        title: 'Docs',
        href: '/content/admin/knowledge-base',
      },
      {
        title: 'Documents',
        href: '/content/admin/documents',
      },
      {
        title: 'Service Requests',
        href: '/content/admin/tickets',
      },
    ],
  },
};
