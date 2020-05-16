/**
   * Quick object check - this is primarily used to tell
   * Objects from primitive values when we know the value
   * is a JSON-compliant type.
   */
function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
class Observer {
  constructor(value) {
    this.value = value;
    this.dep = new Dep();
    def(value, '__ob__', this);
    if (Array.isArray(value)) {
      value.__proto__ = arrMethods;
      this.observeArray(value);
    }
    else {
      this.walk(value);
    }
  }
  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk(obj) {
    for (const key in obj) {
      defineReactive(obj, key, obj[key]);
    }
  }
  /**
   * Observe a list of Array items.
   */
  observeArray(items) {
    for (const item of items) {
      observe(item);
    }
  }
}



/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe(obj) {
  if (!isObject(obj)) {
    return
  }
  if (obj.hasOwnProperty('__ob__')) { 
    // 如果已经是响应式
    return obj.__ob__;
  } else {
    return new Observer(obj);
  }
}

/**
 * Define a reactive property on an Object.
 * 这里使用到了闭包
 */
function defineReactive(obj, key, val) {
  const childOb = observe(val);
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get: function reactiveGetter() {
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
        }
      }
      return val
    },
    set: function reactiveSetter(newValue) {
      val = newValue;
      observe(val); // 对于直接给数组复制的情况需要添加响应式
      dep.notify();
    },
  })
}

