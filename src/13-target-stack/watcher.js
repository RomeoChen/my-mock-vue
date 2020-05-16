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
    this.get();
  }
  get() {
    pushTarget(this);
    this.getter.call(this.vm);
    popTarget();
  }
  run() {
    this.get();
  }
  update() {
    this.run();
  }
  cleanup() {
  }
  addDep(dep) {
    dep.addSub(this);
  }
}




