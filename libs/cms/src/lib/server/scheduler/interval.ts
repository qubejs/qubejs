import BaseScheduler from './base';
import { utils } from '@qubejs/core';

class IntervalScheduler extends BaseScheduler {
  timeUnit: any;
  intervalId: NodeJS.Timer;
  constructor(options = {}) {
    super(options);
    this.options.type = 'interval';
    this.timeUnit = new utils.Timeunit();
  }

  override init() {
    if (this.options.runAtStart === true) {
      this.execute();
    }
    this.intervalId = setInterval(() => {
      this.execute();
    }, this.timeUnit.getTimeunit(this.options.frequency));
  }
}

export default IntervalScheduler;
