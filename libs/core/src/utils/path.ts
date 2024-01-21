export default {
  ensureSlashAtEnd: (path) => {
    if (path && path.substr(path.length - 1, 1) === '/') {
      return path;
    } else if (path) {
      return `${path}/`;
    }
    return path;
  },
  ensureNoSlashAtEnd: (path) => {
    if (path && path.substr(path.length - 1, 1) === '/') {
      return path.substr(0, path.length - 1);
    }
    return path;
  },
  ensureNoSlashAtStart: (path) => {
    if (path && path.substr(0, 1) === '/') {
      return path.substr(1);
    }
    return path;
  },
  ensureSlashAtStart: (path) => {
    if (path && path.substr(0, 1) === '/') {
      return path;
    } else if (path) {
      return `/${path}`;
    }
    return path;
  },
  convertTextToPath: (text = '') => {
    const finalText =
      text
        ?.toString()
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .replace(/\s\s+/g, ' ')
        .replace(new RegExp(' ', 'g'), '-')
        .toLowerCase() || '';
    return finalText;
  },
};
