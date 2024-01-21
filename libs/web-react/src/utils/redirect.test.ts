/* eslint-disable */
jest.mock('animated-scroll-to');
import { redirectTo, setHistory, setUrlMapping, setCustomHandlers } from './redirect';
import { events } from './app-events';
import { fake } from '../../tests/ui';
import animationScrollTo from 'animated-scroll-to';

setUrlMapping({
  home: '/new/home',
  '/en/(.*)': {
    type: 'regex',
    target: '/en/$1',
  },
});

describe('utils:redirect', () => {
  let fakeHistory;
  beforeEach(() => {
    fakeHistory = fake.history.create();
    setHistory(fakeHistory);
  });
  describe('redirectTo()', function () {
    test('should have defined', async () => {
      expect(redirectTo).toBeDefined();
    });
    test('should not call beforeRedirect if path is not given', async () => {
      const fakeFn = jest.fn();
      events.subscribe('beforeRedirect', fakeFn);
      redirectTo();
      expect(fakeFn).not.toHaveBeenCalled();
    });
    test('should redirect to /new/home', async () => {
      jest.useFakeTimers();
      const fakeFn = jest.fn();
      events.subscribe('beforeRedirect', fakeFn);
      redirectTo('home');
      jest.advanceTimersByTime(10);
      expect(fakeFn).toHaveBeenCalled();
      expect(fakeHistory.push).toHaveBeenCalledWith('/new/home');
    });
    test('should open in new window for /new/home', async () => {
      jest.useFakeTimers();
      redirectTo('home', {}, { target: '_blank' });
      jest.advanceTimersByTime(10);
      expect(window.open).toHaveBeenCalledWith('/new/home');
    });
    test('should redirect to /new/home with query string', async () => {
      jest.useFakeTimers();
      const fakeFn = jest.fn();
      events.subscribe('beforeRedirect', fakeFn);
      redirectTo('home', { home: 'ok', fake: 'bar' });
      jest.advanceTimersByTime(10);
      expect(fakeFn).toHaveBeenCalled();
      expect(fakeHistory.push).toHaveBeenCalledWith('/new/home?home=ok&fake=bar');
    });
    test('should redirect to /en/home', async () => {
      jest.useFakeTimers();
      const fakeFn = jest.fn();
      events.subscribe('beforeRedirect', fakeFn);
      redirectTo('/en/home');
      jest.advanceTimersByTime(10);
      expect(fakeFn).toHaveBeenCalled();
      expect(fakeHistory.push).toHaveBeenCalled();
      expect(animationScrollTo).toHaveBeenCalledWith(0)
    });
    test('[matcher] should open in new widow in case of target=_blank to /en/home', async () => {
      jest.useFakeTimers();
      const fakeFn = jest.fn();
      events.subscribe('beforeRedirect', fakeFn);
      redirectTo('/en/home', {}, { target: '_blank' });
      jest.advanceTimersByTime(10);
      expect(fakeFn).not.toHaveBeenCalled();
      expect(window.open).toHaveBeenCalled();
    });
    test('[fullUrl] should redirect to page ', async () => {
      jest.useFakeTimers();
      const fakeFn = jest.fn();
      events.subscribe('beforeRedirect', fakeFn);
      redirectTo('http://go.com/park/home');
      jest.advanceTimersByTime(10);
      expect(fakeFn).not.toHaveBeenCalled();
      expect(location.href).toBe('http://go.com/park/home');
    });
    test('[fullUrl] should open in new window with query string ', async () => {
      redirectTo('http://go.com/park/home', { bar: 'foo' }, { target: '_blank' });
      expect(window.open).toHaveBeenCalledWith('http://go.com/park/home?bar=foo');
    });
    test('should call custom register handler ', async () => {
      const customDirect = jest.fn();
      setCustomHandlers({
        customDirect,
      });
      redirectTo('http:/go.com/park/home', { bar: 'foo', handler: 'custom', handlerType: 'customDirect' }, { target: '_blank' });
      expect(window.open).not.toHaveBeenCalledWith();
      expect(customDirect).toHaveBeenCalledWith('http:/go.com/park/home', { bar: 'foo', handler: 'custom', handlerType: 'customDirect' }, { target: '_blank' });
    });
  });
});
