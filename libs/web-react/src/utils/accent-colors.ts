var colors = ['accent-1', 'accent-2', 'accent-3', 'accent-4', 'accent-5'];

const setColors = (_colors) => {
  colors = _colors;
};

const getColorByIndex = (idx) => {
  return colors[idx % colors.length];
};
const getColorByChar = (chars) => {
  var str = (new String(chars).charAt(0) || 'a').toLowerCase();
  return colors[str.charCodeAt(0) % colors.length];
};

export default {
  getColorByIndex,
  getColorByChar,
  setColors,
};
