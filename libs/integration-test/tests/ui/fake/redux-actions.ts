const createAsyncAction = (data) => {
  return jest.fn(() => {
    return {
      unwrap: () => Promise.resolve(data),
    };
  });
};

export { createAsyncAction };
