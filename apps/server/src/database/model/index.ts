import { database } from '@qubejs/cms-admin';
import DbVersin from './dbversion';
import EmailQueue from './email-queue';

export default (conn) => {
  return {
    ...database.models(conn),
    DbVersion: DbVersin(conn),
    EmailQueue: EmailQueue(conn),
  };
};
