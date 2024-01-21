import { utils } from '@qubejs/core';
const { GlobalOptions } = utils;
export default {
  contentType: new GlobalOptions({
    PAGE: 'Page',
    SITE_MAP: 'Site Map',
  }),
  contentStatus: new GlobalOptions({
    DRAFT: 'Draft',
    PUBLISHED: 'Published',
  }),
};
