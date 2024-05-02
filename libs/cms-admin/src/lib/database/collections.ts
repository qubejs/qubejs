import { dataLayer  } from '@qubejs/cms';

export default (allModels, db) => {
  return {
    contents: new dataLayer.Collection({ model: allModels.Content, db }),
    users: new dataLayer.Collection({ model: allModels.User, db }),
    emailTemplates: new dataLayer.Collection({ model: allModels.EmailTemplate, db }),
    userSessions: new dataLayer.Collection({ model: allModels.UserSession, db }),
    userPreferences: new dataLayer.Collection({ model: allModels.UserPreference, db }),
  };
};
