import * as content from './content';
import * as common from './common';
import * as admin from './admin';
import * as authentication from './authentication';
import * as user from './user';
import * as emailtemplate from './emailtemplate';
import * as application from './application';

export { content, common, admin, authentication, user, emailtemplate, application };

export default {
  content: content.default,
  common: common.default,
  admin: admin.default,
  authentication: authentication.default,
  user: user.default,
  emailtemplate: emailtemplate.default,
  application: application.default,
};
