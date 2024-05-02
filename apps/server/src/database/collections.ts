import { dataLayer } from '@qubejs/cms';
import { database } from '@qubejs/cms-admin';

//dataLayer.Collection
export default (allModels, db) => {
  return {
    ...database.collections(allModels, db),
    emailqueues: new dataLayer.Collection({
      model: allModels.EmailQueue,
      db,
    }),
  };
};
