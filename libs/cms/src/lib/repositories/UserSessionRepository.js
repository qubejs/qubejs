const BaseRepository = require('../BaseRepository');

class UserSessionRepository extends BaseRepository {
  constructor(options) {
    super({
      ...options,
      collection: 'userSessions'
    });
  }

  async logSession(userGuid, success) {
    return await this.insert({
      userGuid,
      success
    });
  }
}


module.exports = UserSessionRepository;