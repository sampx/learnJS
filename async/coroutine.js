'use strict';

function doSomethine(n,ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

async function test(n, ms) {
  for (let i = 0; i <= n; i++) {
    console.log('i=%s', i);
    await doSomethine(i,ms);
  }
  // return new Promise((resolve, reject) => {
  //   resolve(n);
  // });
  return n;
};

let res = test(10, 500);
console.log(res);
res.then(n => console.log('执行结束，n=%s', n))
  .catch(err => console.error('执行出错：', err));
console.log(res);
