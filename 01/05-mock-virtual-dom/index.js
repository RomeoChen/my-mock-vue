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

// 将真实节点转换为虚拟节点
function getVNode(node) {
  const {nodeType, nodeName, nodeValue, attributes, childNodes} = node;
  let _vnode = null;
  switch (nodeType) {
    case 1:
      // 元素节点
      const _attrObj = {};
      for (const {nodeName, nodeValue} of attributes) {
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
  const { tag, type, data, text, children} = vnode;
  let node;
  switch(type) {
    case 1:
      // 元素节点
      node = document.createElement(tag);
      for (const [name, value] of Object.entries(data)) {
        const attr = document.createAttribute(name);
        attr.value = value;
        node.attributes.setNamedItem(attr);
      }
      for (const child of children) {
        node.appendChild(parseVNode(child));
      }
      break;
    case 3:
      node = document.createTextNode(text);
      break;
  }
  return node;
}

const root = document.querySelector('#root');
console.log('root', root);

const vroot = getVNode(root);
console.log('vroot', vroot);

const newRoot = parseVNode(vroot);
console.log('newRoot', newRoot);
document.body.appendChild(newRoot)

