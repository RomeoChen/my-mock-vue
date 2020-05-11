var uid = 0;

class Dep {
  constructor() {
    this.id = uid++;
    this.subs = [];
  }
  notify() {
    if (Dep.target) {
      Dep.target.update();
    }
  }
}

Dep.target = null;