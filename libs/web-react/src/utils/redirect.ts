import animateScrollTo from 'animated-scroll-to';
import { QueryString } from './query-string';
import { events } from './app-events';
let history;
let navigate;
let urlMapping = {};
let customHandlers = {};

export const setUrlMapping = (newMap) => {
  urlMapping = {
    ...urlMapping,
    ...newMap,
  };
};

export const setHistory = (newHistory) => {
  history = newHistory;
};
export const setNavigate = (_navigate) => {
  navigate = _navigate;
};

export const setCustomHandlers = (newHandlers) => {
  customHandlers = {
    ...customHandlers,
    ...newHandlers,
  };
};

export const redirectTo = (screen, params:any = {}, { target = '', ...options } = {}) => {
  if (!screen) {
    return;
  }
  if (screen === 'self') {
    screen = window.location.pathname;
  }
  if (params.handler === 'custom') {
    events.emit('beforeRedirect', screen, params, { target, ...options });
    customHandlers[params.handlerType] && customHandlers[params.handlerType](screen, params, { target, ...options });
  } else {
    const url = urlMapping[screen];
    const query = new QueryString(params, true).toString();
    let matchedRegex;
    Object.keys(urlMapping).forEach((key) => {
      if (typeof urlMapping[key] === 'object') {
        if (urlMapping[key].type === 'regex') {
          if (screen.match(new RegExp(key, 'g'))) {
            matchedRegex = key;
          }
        }
      }
    });
    if (url) {
      if (target === '_top') {
        window.top.location.href = url + query;
      } else if (target === '_blank') {
        window.open(url + query);
      } else {
        events.emit('beforeRedirect', screen, params, { target, ...options });
        animateScrollTo(0);
        setTimeout(() => {
          if (navigate) {
            navigate(url + query);
          } else {
            history.push(url + query);
          }
        });
      }
    } else if (matchedRegex) {
      const processEdUrl = screen.replace(new RegExp(matchedRegex, 'g'), urlMapping[matchedRegex].target);
      if (target === '_top') {
        window.top.location.href = processEdUrl + query;
      } else if (target === '_blank') {
        window.open(processEdUrl + query);
      } else {
        setTimeout(() => {
          events.emit('beforeRedirect', screen, params, { target, ...options });
          animateScrollTo(0);
          if (navigate) {
            navigate(processEdUrl + query);
          } else {
            history.push(processEdUrl + query);
          }
        });
      }
    } else {
      if (target === '_top') {
        window.top.location.href = screen + query;
      } else if (target === '_blank') {
        window.open(screen + query);
      } else {
        window.location.href = screen + query;
      }
    }
  }
  setTimeout(() => {
    events.emit('afterRedirect', screen, params, { target, ...options });
  }, 120);
};
