import AdminDB from './admin-db-version';
import Content from './content';
import User from './user';
import EmailTemplates from './email-template';
import UserPreference from './user-preference';
import UserSession from './user-session';


export default function (conn) {
  return {
    AdminDBVersion: AdminDB(conn),
    Content: Content(conn),
    User: User(conn),
    EmailTemplate: EmailTemplates(conn),
    UserPreference: UserPreference(conn),
    UserSession: UserSession(conn),
  };
};
