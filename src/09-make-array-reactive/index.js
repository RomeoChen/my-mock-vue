const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'sort',
  'reverse',
  'splice',
]

methodsToPatch.forEach(method => {
  const original = arrMethods[method];
  def(arrMethods, method, function mutate() {
    console.log('调用的方法是：', method);
    
    let args = [], len = arguments.length;
    while (len--) args[len] = arguments[len];
    const result = original.apply(this, args);
    let inserted;
    const ob = this.__ob__;
    switch(method) {
      case 'push':
      case 'unshift':
        inserted = args; break;
      case 'splice':
        inserted = args.slice(2); break;
    }
    // 如果有新增的数据，则每个数据都将其响应式化
    if (inserted) {
      ob.observeArray(inserted);
    }
    return result;
  })
})

