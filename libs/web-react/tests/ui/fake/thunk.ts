const thunkMiddleware =
  ({ dispatch, getState }) =>
  (next) =>
  async (action) => {
    if (typeof action === 'function') {
      return await action(dispatch, getState);
    }

    return next(action);
  };
const create = (prevState = {}) => {
  const next = jest.fn();
  const store = {
    results: [],
    getState: jest.fn(() => prevState),
    dispatch: jest.fn(async (action) => {
      let result = thunkMiddleware(store)(next)(action);
      store.results.push(result);
      return result;
    }),
  };

  const invoke = (action) => thunkMiddleware(store)(next)(action);
  return { store, next, invoke };
};
export { thunkMiddleware, create };
