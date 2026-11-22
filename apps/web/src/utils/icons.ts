import { utils } from '@qubejs/web-react';
import { ReactComponent as Logo } from '../digital-assets/svg/logo.svg';
import { ReactComponent as LogoWide } from '../digital-assets/svg/logo-wide.svg';

utils.storage.icons.set({
  logo: Logo,
  'logo-wide': LogoWide,
  'logo-full': LogoWide,
});
// `menu` and `filter-list` come from the selected UI library's built-in icons; `GitHub`
// is added per library in app/ui-library (ui-reui-base ships its own).
