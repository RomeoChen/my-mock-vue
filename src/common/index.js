function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    configurable: true,
    writable: true,
  })
}

/**
 * 对与响应式数组，我们需要重写其一些方法，例如 push、pop
 * 保证响应式数组使用这些方法之后依然是响应式的。
 */
const arrProto = Array.prototype;
const arrMethods = Object.create(arrProto);
