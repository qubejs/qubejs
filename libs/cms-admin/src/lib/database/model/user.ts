
export default function(conn) {
  return conn.model('User', {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    roleCode: String,
    password: String,
    emailVerified: Boolean,
    forceChangePassword: Boolean,
    phoneVerified: Boolean,
    createdOn: {
      type: Date,
      default: Date.now
    },
    updatedOn: {
      type: Date,
      default: Date.now
    },
    active: {
      type: Boolean,
      default: true
    }
  }, 'users')
};