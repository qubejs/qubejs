class BaseEntity {
  excludeKeys: string[];
  uid: string;
  _doc: any;
  constructor(raw: any = {}) {
    const { _id, uid, _doc, ...restRaw } = raw;
    this.excludeKeys = ['_doc', 'excludeKeys'];
    this.uid = (uid || _id)?.toString();
    this._doc = raw;
    this.set(restRaw);
  }

  set(raw) {
    Object.keys(raw).forEach((rawKey) => {
      this[rawKey] = raw[rawKey];
    });
  }

  toObject() {
    const newObj = {};
    Object.keys(this).forEach((key) => {
      if (this.excludeKeys.indexOf(key) === -1) {
        newObj[key] = this[key];
      }
    });
    return newObj;
  }
}

export default BaseEntity;
