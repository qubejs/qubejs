import Interval from './interval';

class JobScheduler {
  jobs: any;
  internal: any;
  jobTypes: any;
  options: any;
  constructor({ jobs, interval, ...options }: any = {}) {
    this.options = options;
    this.jobs = jobs;
    this.jobTypes = {
      interval: interval || Interval,
    };
  }

  log(message) {
    console.log(`JobScheduler:: ${message}`);
  }

  schedule() {
    this.log('start');
    Object.keys(this.jobs).forEach((job) => {
      const config = this.jobs[job];
      new this.jobTypes[config.type]({
        scheduler: this,
        name: job,
        ...config,
      }).init();
      console.log(`job-> ${job} type:${config.type}|${config.frequency}`);
    });
  }
}

export default JobScheduler;
