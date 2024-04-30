import { dataLayer, database } from '@qubejs/cms';

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
