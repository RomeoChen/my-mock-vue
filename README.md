# my-mock-vue

# Vue 与模板
1. 编写页面模板
  1. 直接在HTML中编写模板
  2. 构造函数中使用template属性
  3. 单文件组件<template>
2. 创建Vue实例
3. 将Vue挂载到DOM中

# 数据驱动模型
Vue的执行流程: 字符串模板 -> AST -> VNode -> 真正DOM
1. 获得模板
2. 生成抽象语法树 AST
3. 利用Vue构造函数中提供的数据来替换模板中的数据，得到新的元素
4. 将新的元素替换页面中的模板
其中最消耗性能的是：模板 -> AST 这一阶段

# 虚拟DOM(提高性能)
目标：
1. 将真实DOM转换为虚拟DOM
2. 将虚拟DOM转换为真实DOM
思路：与深拷贝类似

# 对于内置标签和自定义标签的处理
内置标签如：div,span,p 等等；
自定义标签就是vue组件。
因此需要一个函数，来判断是否是内置标签。
若写成：
```javascript
const HTMLTags = 'div,span,p'.split(',')
function isHTMLTag(tagName) {
  return HTMLTags.includes(tagName);
}
```
则会造成，每次遇到一个标签，都会去遍历tags数组，大大降低性能。
因此，可以采用柯里化和闭包的思想，将tags数组转换成对象:
```javascript
const HTMLTags = 'div,span,p'
function makeMap(tagsStr) {
  const map = Object.create(null);
  const list = tagsStr.split(',');
  list.forEach(tag => {
    map[tag] = true;
  })
  return function(tagName) {
    return map[tagName.toLowerCase()];
  }
}
const isHTMLTag = makeMap(HTMLTags);
isHTMLTag('div'); // true
```