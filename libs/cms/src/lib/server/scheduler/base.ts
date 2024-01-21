class BaseScheduler {
  options: any;
  scheduler: any;

  constructor({ scheduler, ...options }: any = {}) {
    this.options = options;
    this.scheduler = scheduler;
  }

  init() {}

  execute() {
    this.scheduler.log(`execute -> ${this.options.name}`);
    this.options.run && this.options.run(this.scheduler, this.options);
  }
}

export default BaseScheduler;
