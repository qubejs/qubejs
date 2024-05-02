
export default function (conn) {
  return conn.model('UserSession', {
    userGuid: String,
    success: Boolean,
    loggedInAt: {
      type: Date,
      default: Date.now
    }
  },
    'userSessions');
}