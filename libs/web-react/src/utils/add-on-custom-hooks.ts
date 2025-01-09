

export default function ({ content, authentication }: any) {
  content.customHooks.add('authData', {
    setUser: (result, { dataKey = '.data', dispatch }) => {
      dispatch(authentication.setUser(result.data));
      return result;
    },
    clearUser: (result, { dispatch }) => {
      dispatch(authentication.clearUser());
      return result;
    },
  });
}
