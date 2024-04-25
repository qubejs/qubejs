import { utils } from '@qubejs/web-react';
import GitHub from '@mui/icons-material/GitHub';
import { ReactComponent as Logo } from '../digital-assets/svg/logo.svg';
import { ReactComponent as LogoWide } from '../digital-assets/svg/logo-wide.svg';

utils.storage.icons.set({
  logo: Logo,
  'logo-wide': LogoWide,
  GitHub,
});
