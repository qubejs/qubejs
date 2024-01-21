function getRandomS4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}
function getRandomS6() {
  return [getRandomS4().substr(2), getRandomS4()].join('-');
}
function getRandomS8() {
  return [getRandomS4(), getRandomS4()].join('-');
}
const preFix = (num, prefix = '0', lengthToReturn = 2) => {
  const length = num.toString().length;
  let startLen = length;
  while (startLen < lengthToReturn) {
    num = prefix + num;
    startLen++;
  }
  return num;
};

const getRandomNumber = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};
const getRandomBetweenRange = (minimum, maximum) => {
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
};
const getRandomMobile = () => {
  let i = 1;
  const num: number[] = [];
  while (i <= 10) {
    num.push(getRandomNumber(9));
    i++;
  }
  return num.join('');
};

export default {
  getRandomNumber,
  getRandomBetweenRange,
  getRandomMobile,
  getRandomS4,
  getRandomS6,
  getRandomS8,
  preFix,
};
