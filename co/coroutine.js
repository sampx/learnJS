'use strict';

const co = require('co');

function doSomethine(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

const test = co.wrap(function* (n, ms) {
  for (let i = 0; i < n; i++) {
    console.log('i=%s', i);
    yield doSomethine(ms);
  }
  return n;
});

test(10, 500)
  .then(n => console.log('执行结束，n=%s', n))
  .catch(err => console.error('执行出错：', err));
