class ArgsReader {
  dataKeys: any;
  constructor(keys = ['--']) {
    this.dataKeys = keys;
  }

  get() {
    const args = {};
    this.dataKeys.forEach((dataKey) => {
      process.argv.forEach((key) => {
        if (key.indexOf(dataKey) > -1) {
          const split = key.split('=');
          const keyToSet = split[0].replace('--', '');
          args[keyToSet] = split[1];
        }
      });
    });
    return args;
  }
}

export default ArgsReader;
