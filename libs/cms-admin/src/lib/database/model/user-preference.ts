
export default function (conn) {
  return conn.model('UserPreference', {
    createdBy: String,
    language: String,
    currency: String,
    createdOn: {
      type: Date,
      default: Date.now
    },
    updatedOn: {
      type: Date,
      default: Date.now
    }
  },
    'userPreferences');
}