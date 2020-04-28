function makeMap(tagsStr) {
  const map = Object.create(null);
  const list = tagsStr.split(',');
  list.forEach(tag => {
    map[tag] = true;
  })
  return function (tagName) {
    return map[tagName.toLowerCase()];
  }
}

const isHTMLTag = makeMap('div,span,p')

const rootElm = document.querySelector('#root')
const result = isHTMLTag(root.tagName)

const resultElm = document.querySelector('#result');
resultElm.innerHTML = result


