function handler1() {
  console.log('handler 1');
}

function handler2() {
  console.log('handler 2');
}

myEvent.on('click', handler1);
myEvent.on('click', handler1);
myEvent.on('click', handler2);

myEvent.emit('click');