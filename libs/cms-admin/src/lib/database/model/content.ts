export default (conn) => {
  return conn.model(
    'Content',
    {
      path: String,
      parentPath: String,
      rootPath: String,
      type: String,
      category: String,
      subCategory: String,
      pageData: Object,
      status: String,
      createdOn: Date,
      updatedOn: Date,
      lastPublishedOn: Date,
    },
    'contents'
  );
};
