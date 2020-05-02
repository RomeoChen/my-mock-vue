function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    configurable: true,
    writable: true,
  })
}

const arrProto = Array.prototype;
const arrMethods = Object.create(arrProto);
