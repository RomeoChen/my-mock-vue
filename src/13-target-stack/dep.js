var uid = 0;

function remove(array, item) {
  let len = array.length;
  while (len--) {
    if (array[len] === item) {
      array.splice(len, 1);
    }
  }
}

class Dep {
  constructor() {
    this.id = uid++;
    this.subs = [];
  }
  addSub(sub) {
    this.subs.push(sub);
  }
  removeSub(sub) {
    remove(this.subs, sub)
  }
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }
  notify() {
    let subs = this.subs.slice();
    subs.sort((a, b) => a.id - b.id);
    for (const sub of subs) {
      sub.update();
    }
  }
}

/**
 * 全局唯一，因为一次只能执行一个watcher
 */
Dep.target = null;
const targetStack = [];

/**
 * 将当前处理的 watcher 添加到全局的栈中
 * @param {watcher} target 当前 watcher
 */
function pushTarget (target) {
  targetStack.push(target);
  Dep.target = target;
}

/**
 * 出栈一个 watcher
 */
function popTarget () {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}