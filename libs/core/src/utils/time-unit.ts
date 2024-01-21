class Timeunit {

  getUnitByPeriod(period) {
    switch (period) {
      case 'd':
        return 24 * 60 * 60 * 1000;
      case 'h':
        return 60 * 60 * 1000;
      case 'm':
        return 60 * 1000;
      case 's':
        return 1000;
    }
    return 0;
  }

  getTimeunit(input) {
    const unit = input.match(/\d{0,}/)[0];
    const period = input.match(/[^\d]/)[0];
    return unit * this.getUnitByPeriod(period);
  }
}

export default Timeunit;
