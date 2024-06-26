import { utils } from '@qubejs/web-react';
import GitHub from '@mui/icons-material/GitHub';
import menu from '@mui/icons-material/Menu';
import FilterAlt from '@mui/icons-material/FilterAlt';
import { ReactComponent as Logo } from '../digital-assets/svg/logo.svg';
import { ReactComponent as LogoWide } from '../digital-assets/svg/logo-wide.svg';

utils.storage.icons.set({
  logo: Logo,
  'logo-wide': LogoWide,
  'logo-full': LogoWide,
  GitHub,
  menu,
  'filter-list': FilterAlt,
});
