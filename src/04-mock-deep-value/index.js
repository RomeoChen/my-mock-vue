// 获取大括号内部变量的值
function getValueByPath(data, path) {
  const paths = path.split('.');
  let res = data;
  for (const path of paths) {
    res = res[path];
  }
  return res;
}

// 匹配大括号
const regMustache = /\{\{(.+?)\}\}/g;

// 编译函数
function compiler(template, data) {
  const childNodes = template.childNodes;
  for (const childNode of childNodes) {
    const type = childNode.nodeType;
    switch (type) {
      case 1: // 元素节点，递归
        compiler(childNode, data);
        break;
      case 3: // 文本节点, 判断是否有mustache{{}}
        let txt = childNode.nodeValue;
        txt = txt.replace(regMustache, function (_, g) {
          // 此函数的第0个参数为匹配到的内容，例如 {{name}}
          // 第n个参数为第n组内容，例如 name
          return getValueByPath(data, g.trim());
        })
        childNode.nodeValue = txt;
        break;
      default: break;
    }
  }
}

// 构造函数
function MyVue(options) {
  // 内部数据用 _ 开头，只读数据用 $ 开头
  this._data = options.data;
  this._el = options.el;

  // 准备模板与父节点
  this.$el = this._template = document.querySelector(this._el);
  this._parent = this._template.parentNode;
  // 开始渲染
  this.render();
}

MyVue.prototype.render = function () {
  this.compiler();
}

/** 编译，得到真正的DOM */
MyVue.prototype.compiler = function () {
  let newDOM = this._template.cloneNode(true);
  compiler(newDOM, this._data);
  this.update(newDOM);
}

/** 将DOM放入页面中 */
MyVue.prototype.update = function (newDOM) {
  this._parent.replaceChild(newDOM, this._template);
}

let app = new MyVue({
  el: '#root',
  data: {
    name: 'romeo',
    message: 'wants to be rich',
    deep: {
      firstLevel: {
        secondLevel: 'awesome'
      }
    }
  }
})

/**
 * 遗留问题：
 *    在compiler函数中，这里newDOM是拷贝的真实DOM，
 *    实际上Vue里面是先将字符串模板解析为AST，在转换为虚拟DOM。
 *    每次需要渲染的时候，模板都会解析一次（模板解析消耗性能较大）。
 * 优化：
 *    将虚拟DOM缓存起来，渲染的时候，根据这个缓存的虚拟DOM来生成真正的DOM。
 *
 */