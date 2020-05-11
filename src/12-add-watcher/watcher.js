/**
 *
 * @param {object} vm vue实例
 * @param {string|function} expOrFn 计算watcher的路径表达式，或者渲染watcher的函数
 */
class Watcher {
  constructor(vm, expOrFn) {
    this.vm = vm;
    this.getter = expOrFn;
    this.deps = [];
    this.depOds = {};
    this.get();
  }
  get() {
    this.getter.call(this.vm);
  }
  run() {
    this.get();
  }
  update() {
    this.run();
  }
  cleanup() {
  }
}




