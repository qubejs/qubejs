import mongoose from 'mongoose';
const escapedChars = ['+'];

const escapeValue = (val) => {
  if (val) {
    val = val.toString();
    escapedChars.forEach((char) => {
      val = val.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    });
  }
  return val;
};

export default {
  ignoreCase: function (value) {
    value = escapeValue(value);
    return { $regex: `^${value}$`, $options: 'i' };
  },
  includes: function (value) {
    value = escapeValue(value);
    return { $regex: `${value}`, $options: 'i' };
  },
  objectId: function (value) {
    return new mongoose.Types.ObjectId(value);
  },
};
