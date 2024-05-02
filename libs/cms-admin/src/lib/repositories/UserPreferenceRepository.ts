import { domain } from '@qubejs/cms';

class UserPreferenceRepository extends domain.BaseRepository {
  constructor(options) {
    super({
      ...options,
      collection: 'userPreferences'
    });
  }

  getByUser(userId) {
    return this.findOne({
      createdBy: userId
    }).then((doc) => {
      return doc || {};
    });
  }

  save(preference, userId) {
    let newPref;
    return new Promise((resolve) => {
      this.find({
        createdBy: userId
      }).then(async (prefs) => {
        if (!prefs || prefs.length === 0) {
          newPref = {
            ...preference,
            createdBy: userId
          };
          const insertedCat = await this.insert(newPref);
          resolve({
            ...insertedCat
          });
        } else {
          const result = await this.update({
            ...preference,
            uid: prefs[0].uid
          });
          resolve(result);
        }
      });
    });
  }

}


export default UserPreferenceRepository;