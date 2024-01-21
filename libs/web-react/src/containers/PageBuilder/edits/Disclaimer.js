import { GLOBAL_OPTIONS } from '../../../globals';
import { withEditTabsConfig } from './Common';

export default withEditTabsConfig(({ defaultParams }) => ({
  classNames: GLOBAL_OPTIONS.dislcaimerStyles.toArray(),
  pageData: {
    items: [],
  },
  general: [
    { name: 'text', cmpType: 'RichText', label: 'Disclaimer' },
    { name: 'innerClassName', cmpType: 'Input', label: 'innerClassName' },
  ],
}));
