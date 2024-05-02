export default (conn) => {
    return conn.model(
      'EmailTemplate',
      {
        name: String,
        fromName: String,
        from: String,
        subject: String,
        body: String,
        emailType: String,
        emailCc: Array,
        emailBcc: Array,
        status: String,
        active: Boolean,
        createdOn: Date,
        updatedOn: Date,
        lastPublishedOn: Date,
      },
      'email-templates'
    );
  };
  