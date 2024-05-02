import { domain } from '@qubejs/cms';

class UserSessionRepository extends domain.BaseRepository {
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