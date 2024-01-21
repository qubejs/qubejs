const BaseRepository = require('../BaseRepository');

class UserPreferenceRepository extends BaseRepository {
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
    var newPref;
    var that = this;
    return new Promise((resolve) => {
      this.find({
        createdBy: userId
      }).then(async (prefs) => {
        if (!prefs || prefs.length === 0) {
          newPref = {
            ...preference,
            createdBy: userId
          };
          const insertedCat = await that.insert(newPref);
          resolve({
            ...insertedCat
          });
        } else {
          var result = await this.update({
            ...preference,
            uid: prefs[0].uid
          });
          resolve(result);
        }
      });
    });
  }

}


module.exports = UserPreferenceRepository;