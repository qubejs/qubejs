
export default (conn) => {
  return conn.model('DBVersion', {
    version: String
  }, 'dbversion');
};