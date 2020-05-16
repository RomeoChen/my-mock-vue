# my-mock-vue

# Vue 与模板
1. 编写页面模板
  - 直接在HTML中编写模板
  - 构造函数中使用template属性
  - 单文件组件`<template>`
2. 创建Vue实例
3. 将Vue挂载到DOM中

### 数据驱动模型
Vue的执行流程: 字符串模板 -> AST -> VNode -> 真正DOM
1. 获得模板
2. 生成抽象语法树 AST
3. 利用Vue构造函数中提供的数据来替换模板中的数据，得到新的元素
4. 将新的元素替换页面中的模板
其中最消耗性能的是：模板 -> AST 这一阶段

### 虚拟DOM(提高性能)
目标：
1. 将真实DOM转换为虚拟DOM
2. 将虚拟DOM转换为真实DOM
思路：与深拷贝类似

### 对于内置标签和自定义标签的处理
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

# 响应式原理
### 将对象的属性转换为响应式
1. 数据是直接存在于Vue实例上的
例如：
``` javascript
const app = new Vue({
  el: 'root',
  data: {
    name: 'romeo'
  }
})
const name = app.name; // romeo
```
2. 修改数据时，页面更新
```javascript
app.name = 'new name';
```
### 添加数组的下列方法使其成为响应式
- push
- pop
- shift
- unshift
- splice
- sort
- reverse

# 发布订阅模式
解耦，减少各个部分联系
### 引入watcher与Dep
Watcher 构造函数，Dep：watcher容器
Wathcer有以下方法：
- get 用来进行**计算**或**执行**处理函数
- update 公共的外部方法，该方法会触发run
- run 运行方法，判断内部是使用异步还是同步，并会调用 get 方法
- cleanupDep 清除容器队列
目前将 watcher 放在了全局作用域下，这样其实有问题，因为实际会有很多组件，所以**watcher**会有多个。
每个**watcher**描述渲染行为或计算行为。
- 子组件发生数据的更新，页面需要局部渲染；
- 对于计算属性，其使用的属性发生改变时而重新计算，这就是计算行为。

# 依赖收集与派发更新
watcher：解析表达式，收集依赖，当表达式的值改变时，触发回调函数。
Dep：可以拥有多个指令来订阅