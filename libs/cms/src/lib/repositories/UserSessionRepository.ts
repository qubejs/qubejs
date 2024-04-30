import BaseRepository from '../repositories/BaseRepository';

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


export default UserSessionRepository;