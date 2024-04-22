export default (conn) => {
  return conn.model(
    'EmailQueue',
    {
      subject: String,
      emailType: String,
      messageStatus: String,
      body: Object,
      toEmailId: String,
      creationDate: Date,
      retryAttempt: Number,
      firstName: String,
      lastName: String,
    },
    'EmailQueue'
  );
};
