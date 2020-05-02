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
function Observer(value) {
  this.value = value;
  if (Array.isArray(value)) {
    this.observeArray(value);
  } else {
    this.walk(value);
  }
}

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function (obj) {
  for (const key in obj) {
    defineReactive(obj, key, obj[key]);
  }
}

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function (items) {
  for (const item of items) {
    observe(item);
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
  return new Observer(obj);
}

/**
 * Define a reactive property on an Object.
 * 这里使用到了闭包
 */
function defineReactive(obj, key, val) {
  observe(val);

  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get: function reactiveGetter() {
      console.log(`get ${key}: ${val}`);
      return val
    },
    set: function reactiveSetter(newValue) {
      console.log(`set ${key} from ${val} to ${newValue}`);
      val = newValue;
    },
  })
}
