/**
 * 获取大括号内部变量的值
 * @param {*} data 对象
 * @param {string} path 路径
 */
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

/**
 * 编译函数
 * @param {} template 模板
 * @param {} data 数据
 */
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

/**
 * 带{{}}的vnode + data -> vnode
 * @param {MyVNode} vnode 虚拟节点
 * @param {*} data 数据
 */
function combine(vnode, data) {
  const {tag, text, type, data: attrs, children} = vnode;
  let _vnode;
  switch(type) {
    case 1: // 元素节点
      _vnode = new MyVNode(tag, attrs, text, type);
      for (const child of children) {
        _vnode.appendChild(combine(child, data));
      }
      break;
    case 3: // 文本节点
      const newText = text.replace(regMustache, function (_, g) {
        return getValueByPath(data, g.trim());
      })
      _vnode = new MyVNode(tag, attrs, newText, type)
      break;
  }
  return _vnode;
}

function mountComponent(vm, el) {
  vm.$el = el;
  vm._update(vm._render());
}

/**
 * 构造函数
 * @param {*} options 参数
 */
function MyVue(options) {
  // 内部数据用 _ 开头，只读数据用 $ 开头
  this._data = options.data;
  this._template = document.querySelector(options.el); // Vue中是字符串模板，这里是DOM
  this._parent = this._template.parentNode
  // 开始渲染
  this.$mount();
}

MyVue.prototype.$mount = function() {
  this._render = this.createRenderFn(); // 带缓存的render函数
  this.mountComponent();
}

MyVue.prototype.mountComponent = function () {
  this._update(this._render())
}

/**
 * 通过AST生成render函数。
 * 目的是缓存AST。
 * 这里用 vnode 来模拟AST。
 */
MyVue.prototype.createRenderFn = function() {
  const vnode = getVNode(this._template);
  /**
   * Vue: AST + data => VNode
   * MyVue: 带{{}}的VNode + data => VNode
   */
  return function render() {
    return combine(vnode, this._data);
  }
}

/** 
 * Vue: diff算法更新vnode
 * MyVue(简化): 将vnode生成DOM放入文档中
 */
MyVue.prototype._update = function (newDOM) {
  this._parent.replaceChild(parseVNode(newDOM), this._template);
}

/**
 * 虚拟节点
 */
class MyVNode {
  /**
   * 构造函数
   * @param {string} tag 标签名
   * @param {object} data 标签拥有的属性
   * @param {string} text 文本节点中的文本（非文本节点则为undefined）
   * @param {number} type 1代表元素节点，3代表文本节点
   */
  constructor(tag, data, text, type) {
    this.tag = tag && tag.toLowerCase();
    this.data = data;
    this.text = text;
    this.type = type;
    this.children = [];
  }
  appendChild(vnode) {
    this.children.push(vnode);
  }
}

/**
 * 将真实节点转换为虚拟节点
 * @param {node} node 真实节点
 */
function getVNode(node) {
  const { nodeType, nodeName, nodeValue, attributes, childNodes } = node;
  let _vnode = null;
  switch (nodeType) {
    case 1:
      // 元素节点
      const _attrObj = {};
      for (const { nodeName, nodeValue } of attributes) {
        _attrObj[nodeName] = nodeValue;
      }
      _vnode = new MyVNode(nodeName, _attrObj, undefined, nodeType);
      for (const node of childNodes) {
        _vnode.appendChild(getVNode(node));
      }
      break;
    case 3:
      // 文本节点
      _vnode = new MyVNode(undefined, undefined, nodeValue, nodeType)
      break;
  }
  return _vnode;
}

/**
 * 将虚拟节点转换为真正DOM节点
 * @param {MyVNode} vnode 虚拟节点
 */
function parseVNode(vnode) {
  const { tag, type, data, text, children } = vnode;
  let _node;
  switch (type) {
    case 1: // 元素节点
      _node = document.createElement(tag);
      // 属性
      Object.entries(data).forEach(([key, value]) => {
        _node.setAttribute(key, value);
      })
      // 递归生成子元素
      for (const child of children) {
        _node.appendChild(parseVNode(child));
      }
      break;
    case 3:
      _node = document.createTextNode(text);
      break;
  }
  return _node;
}
