class EventManager {
  events: any;
  constructor() {
    this.events = {};
  }

  subscribe(evtName, fn) {
    if (!this.events[evtName]) {
      this.events[evtName] = [];
    }
    this.events[evtName].push(fn);
  }

   subscribeOnce(evtName, fn) {
    if (!this.events[evtName]) {
      this.events[evtName] = [];
    }
    if (this.events[evtName].length === 0) {
      this.events[evtName].push(fn);
    }
  }

  unsubscribe(evtName, fn) {
    if (this.events[evtName] && fn) {
      const idx = this.events[evtName].indexOf(fn);
      if (idx > -1) {
        this.events[evtName].splice(idx, 1);
      }
    } else if (this.events[evtName]) {
      delete this.events[evtName];
    }
  }

  emit(evtName, ...params) {
    let output;
    if (this.events[evtName]) {
      this.events[evtName].forEach((fn) => {
        if (output !== false) {
          output = fn.apply(this, params);
        }
      });
    }
    return output;
  }
}

export default EventManager;
