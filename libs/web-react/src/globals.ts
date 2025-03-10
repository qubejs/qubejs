import { utils } from '@qubejs/core';
const GlobalOptions = utils.GlobalOptions;
export const CONSTANTS = {
  STATUS: {
    UNKNOWN: undefined,
    SUCCESS: 'success',
    ERROR: 'error',
    OK: 'ok',
  },
  contentType: {
    PAGE: 'PAGE',
    SITE_MAP: 'SITE_MAP',
  },
};

export const GLOBAL_OPTIONS = {
  inputVariant: new GlobalOptions({
    outlined: 'Outlined',
    standard: 'Standard',
    filled: 'Filled',
    default: 'Default',
  }),
  contentType: new GlobalOptions({
    PAGE: {
      text: 'Page',
      size: 'small',
    },
    SITE_MAP: {
      text: 'Site Map',
      size: 'small',
    },
  }),
  pricingTemplates: new GlobalOptions({
    default: 'default',
    'box-style': 'box-style',
  }),
  featureContentTemplates: new GlobalOptions({
    default: 'Default',
    'with-bg': 'With Background',
  }),
  editorStyle: new GlobalOptions({
    full: 'full',
    compact: 'compact',
    default: 'default',
    basic: 'basic',
  }),
  datePickerInstanceType: new GlobalOptions({
    DatePicker: 'DatePicker',
    TimePicker: 'TimePicker',
    DateTimePicker: 'DateTimePicker',
    DesktopDatePicker: 'DesktopDatePicker',
    MobileDatePicker: 'MobileDatePicker',
  }),
  userTabs: new GlobalOptions({
    ALL_USERS: 'All Users',
    ACTIVE_USERS: 'Active Users',
    INACTIVE_USERS: 'Inactive Users',
  }),
  mediaStatus: new GlobalOptions({
    DRAFT: 'Draft',
    PUBLISHED: 'Published',
  }),
  dislcaimerStyles: new GlobalOptions({
    'sq-disclaimer--bg-gray': 'sq-disclaimer--bg-gray',
    'sq-disclaimer--bg-black': 'sq-disclaimer--bg-black',
    'sq-disclaimer--top-border': 'sq-disclaimer--top-border',
  }),
  imageStyles: new GlobalOptions({
    'sq-image--inline-auto': 'sq-image--inline-auto',
    'sq-image--medium': 'sq-image--medium',
    'sq-image--auto-full': 'sq-image--auto-full',
  }),
  emailStatus: new GlobalOptions({
    DRAFT: 'Draft',
    PUBLISHED: 'Published',
    DEPRICATED: 'Depricated',
    ARCHIVED: 'Archived',
  }),
  mediaGalleryTabs: new GlobalOptions({
    ALL_MEDIA: 'All Media',
    UPLOAD_MEDIA: 'Upload Media',
  }),
  roleTabs: new GlobalOptions({
    ALL_ROLES: 'All Roles',
  }),
  roleType: new GlobalOptions({
    INTERNAL: 'Internal',
    EXTERNAL: 'External',
  }),
  alerTypes: new GlobalOptions({
    info: 'Info',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
  }),
  permissionTypes: new GlobalOptions({
    PERMISSIONS: {
      text: 'Permissions',
      key: 'permission',
    },
    LEFT_NAVIGATION: {
      text: 'Left Navigation',
      key: 'navigation',
    },
    ASSIGN_USERS: {
      text: 'Assign Users',
    },
  }),
  noOfResultsDropdown: new GlobalOptions({
    25: 25,
    50: 50,
    100: 100,
  }),
  progressTypes: new GlobalOptions({
    default: 'default',
    circle: 'circle',
    cube: 'cube',
    round: 'round',
    ripple: 'ripple',
  }),
  progressStyles: new GlobalOptions({
    'full-screen': 'full-screen',
  }),
  maskTypes: new GlobalOptions({
    phone: 'phone',
    number: 'number',
    currency: 'currency',
    percentage: 'percentage',
    appendText: 'appendText',
    titleCase: 'titleCase',
    upperCase: 'upperCase',
    lowerCase: 'lowerCase',
    appendViewOnlyText: 'appendViewOnlyText',
  }),
  compareOperators: new GlobalOptions({
    bool: 'bool type equals',
    '=': '= equals',
    '!=': '!= not equals',
  }),
  headerTags: new GlobalOptions({
    h1: 'H1',
    h2: 'H2',
    h3: 'H3',
    h4: 'H4',
    h5: 'H5',
    h6: 'H6',
  }),
  bodyContainers: new GlobalOptions({
    'body-container-small': 'body-container-small',
    'body-container-med': 'body-container-med',
    'body-container-lg': 'body-container-lg',
    'body-container-xl': 'body-container-xl',
  }),
  linkTypes: new GlobalOptions({
    Button: 'Button',
    LinkButton: 'LinkButton',
  }),
  variants: new GlobalOptions({
    contained: 'Contained',
    outlined: 'Outlined',
    default: 'Default',
  }),
  pageWrapperClasses: new GlobalOptions({
    'sq-content-page--full-width': 'sq-content-page--full-width',
    'sq-content-page--h-100': 'sq-content-page--h-100',
    'sq-content-page--header-footer-body':
      'sq-content-page--header-footer-body',
  }),
  buttonSize: new GlobalOptions({
    small: 'small',
    medium: 'medium',
    large: 'large',
  }),
  colorTypes: new GlobalOptions({
    inherit: 'inherit',
    primary: 'primary',
    secondary: 'secondary',
    success: 'success',
    info: 'info',
    error: 'error',
    warning: 'warning',
  }),
  iconSize: new GlobalOptions({
    xs: 'xs',
    small: 'small',
    medium: 'medium',
    large: 'large',
    xl: 'xl',
    xxl: 'xxl',
    auto: 'auto',
    xxxl: 'xxxl',
    full: 'full',
  }),
  iconColorTypes: new GlobalOptions({
    inherit: 'inherit',
    primary: 'primary',
    secondary: 'secondary',
    success: 'success',
    info: 'info',
    error: 'error',
    warning: 'warning',
    blue: 'blue',
    'blue-dark': 'blue-dark',
    pink: 'pink',
    'pink-dark': 'pink-dark',
    green: 'green',
    'green-dark': 'green-dark',
    yellow: 'yellow',
    'yellow-dark': 'yellow-dark',
    purple: 'purple',
    'purple-dark': 'purple-dark',
    red: 'red',
    'red-dark': 'red-dark',
  }),
  radioDisplay: new GlobalOptions({
    Column: 'Column',
    Inline: 'Inline',
  }),
  headerStyles: new GlobalOptions({
    'sq-header--center': 'sq-header--center',
    'sq-header--left': 'sq-header--left',
    'mb-narrow': 'Margin bottom narrow',
    'mb-wide': 'Margin bottom wide',
    'mb-none': 'Margin bottom none',
  }),
  heroStyles: new GlobalOptions({
    'sq-hero-content--left-aligned': 'sq-hero-content--left-aligned',
    'sq-hero-content--right-aligned': 'sq-hero-content--right-aligned',
    'sq-hero-content--center-aligned': 'sq-hero-content--center-aligned',
    'sq-hero-content--large-background-theme-dark':
      'sq-hero-content--large-background-theme-dark',
    'sq-hero-content--bg-black': 'sq-hero-content--bg-black',
    'sq-hero-content--bg-gray': 'sq-hero-content--bg-gray',
    'sq-hero-content--dark': 'sq-hero-content--dark',
    'sq-hero-content--full-width': 'sq-hero-content--full-width',
    'sq-hero-content--dark-secondary': 'sq-hero-content--dark-secondary',
  }),
  imageBlockWithTextStyles: new GlobalOptions({
    'bg-black': 'bg-black',
    'bg-gray': 'bg-gray',
  }),
  imageBlockWithTextCss: new GlobalOptions({
    'sq-image-block-with-text--left-aligned':
      'sq-image-block-with-text--left-aligned',
  }),
  imageWithHeaderBody: new GlobalOptions({
    bordered: 'bordered',
    shadow: 'shadow',
  }),
  imageAlign: new GlobalOptions({
    left: 'left',
    right: 'right',
  }),
  heroTemplates: new GlobalOptions({
    'without-image': 'without-image',
    default: 'default',
    'with-background': 'with-background',
    'large-background': 'large-background',
  }),
  formStyles: new GlobalOptions({
    'sq-form--2-cols': '2 Columns',
    'sq-form--3-cols': '3 Columns',
    'sq-form--inline-auto': 'Inline Auto',
    'sq-form--narrow-space': 'Narrow Space',
    'pb-0': 'No Padding bottom',
  }),

  genericStyles: new GlobalOptions({
    'mb-wide': 'Margin bottom wide',
    'mt-wide': 'Margin top wide',
    'mr-wide': 'Margin right wide',
    'ml-wide': 'Margin left wide',
    'mb-jumbo': 'Margin bottom jumbo',
    'mt-jumbo': 'Margin top jumbo',
    'mb-none': 'Margin bottom none',
    'mt-none': 'Margin top none',
    'pb-wide': 'Padding bottom wide',
    'pt-wide': 'Padding top wide',
    'pl-wide': 'Padding left wide',
    'pr-wide': 'Padding right wide',
    'pb-0': 'Padding bottom none',
    'm-0': 'Margin none',
    'p-0': 'Padding none',
    'pt-none': 'Padding top none',
    'pb-jumbo': 'Padding bottom jumbo',
    'pt-jumbo': 'Padding top jumbo',
    'text-center': 'text-center',
  }),

  htmlTags: new GlobalOptions({
    span: 'span',
    div: 'div',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    p: 'p',
  }),
  actionTypes: new GlobalOptions({
    submit: 'submit',
    api: 'api',
    module: 'module',
    redirect: 'redirect',
  }),
  methodTypes: new GlobalOptions({
    get: 'GET',
    post: 'POST',
    patch: 'PATCH',
    update: 'UPDATE',
    delete: 'DELETE',
  }),
  salutation: new GlobalOptions({
    'Mr.': 'Mr.',
    'Mrs.': 'Mrs.',
    'Miss.': 'Miss',
  }),
};
export { GlobalOptions };
