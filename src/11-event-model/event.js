const myEvent = (function () {
  const events = {};
  return {
    events,
    /**
     * 注册事件
     */
    on: function (name, handler) {
      (events[name] || (events[name] = [])).push(handler);
    },

    /**
     * 移除事件，三种情况
     * 1. 删除所有事件
     * 2. 删除某name下的所有事件
     * 3. 删除某name下的所有handler事件
     */
    off: function (name, handler) {
      switch (arguments.length) {
        case 0:
          events = {};
          break;
        case 1:
          delete (events[name]);
          break;
        case 2:
          const curr = events[name]
          if (!curr) return;
          let len = curr.length;
          while (len--) {
            if (curr[len] === handler) {
              curr.splice(len, 1);
            }
          }
          break;
      }
    },

    /** 触发事件 */
    emit: function (name) {
      const args = Array.prototype.slice.call(arguments, 1);
      const curr = events[name];
      if (!curr) return;
      for (const e of curr) {
        e.apply(null, args);
      }
    },
  }
}())