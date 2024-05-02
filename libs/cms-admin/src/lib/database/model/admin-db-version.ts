
export default (conn) => {
  return conn.model('AdminDBVersion', {
    version: String
  }, 'admin-dbversion');
}