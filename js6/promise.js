{
  function timeout(ms) {
    return new Promise((resolve, reject) => {
      try {
        console.log('Promise');//创建Promise后会立即执行
        setTimeout(resolve, ms, ['done']); //等待指定时间后执行 
      } catch (e) {
        //console.log(e);
        reject(e);
      }

    });
  }

  timeout(10).then((value) => {
    console.log(value);
  }).catch((err) => { //建议总是使用catch方法，而不使用then方法的第二个参数。
    console.error("err");
  });

  console.log('Hi!');
}

{
  let p1 = new Promise(function (resolve, reject) {
    setTimeout(() => { reject('reject in 200ms') }, 200); //p2 2秒钟后返回失败状态
  })

  p1.then(result => console.log('p1 resolve'), res => console.log('p1 reject')).catch(err => console.error('error'));

  let p2 = new Promise(function (resolve, reject) {
    setTimeout(() => resolve(p1), 1000) //1秒后返回P1,而p1是一个promise,p1的状态会传递给p2
  })

  p2.then(result => console.log(result)) //必须等待p1返回状态,此例中p1未返回完成状态,会触发超时异常
    .catch(error => console.error(error)) // Error: fail
}

{
  let promise = new Promise(function (resolve, reject) {
    resolve('ok1');
    throw new Error('test'); //一旦promise的状态变为resolved,再抛出错误是无效的,不会被捕获
  });
  promise
    .then(function (value) { console.log(value) })
    .catch(function (error) { console.log(error) }); //不会捕获错误
}

{
  let someAsyncThing = function () {
    return new Promise(function (resolve, reject) {
      // 下面一行会报错，因为x没有声明
      resolve(x + 2);
    });
  };

  someAsyncThing().then(function () { //如果不catch,错误不会报出
    console.log('everything is great');
  }).catch(err => console.error('something wrong'+err)).then(() => console.log('go on'));
}
console.log('----------------------');

{
  let promise = new Promise(function (resolve, reject) {
    resolve('ok');
    //setTimeout(function () { throw new Error('test') }, 0) //这个错误是在下一轮事件循环才抛出
  });

  promise.then(function (value) { console.log(value) }).catch( //因此不会被promise的catch捕获.
    err => console.error('error')
  );
}

console.log('----------------------');

process.on('unhandledRejection', function (err, p) {
  console.error('unhandledRejection: '+err+' '+p);
});

{
  let someAsyncThing = function () {
    return new Promise(function (resolve, reject) {
      // 下面一行会报错，因为x没有声明
      resolve(x + 2);
    });
  };

  someAsyncThing().then(function () {
    return someOtherAsyncThing();
  }).catch(function (error) {
    console.log('oh no: '+error); // oh no [ReferenceError: x is not defined]
    // 下面一行会报错，因为y没有声明
    y + 2;  //本错误导致下面的then不能执行,同时错误被process.on('unhandledRejection')捕获
  }).then(function () {
    console.log('carry on');
  });  

  //将then改写为catch
  someAsyncThing().then(function () {
    return someOtherAsyncThing();
  }).catch(function (error) {
    console.log('oh no: '+error); // oh no [ReferenceError: x is not defined]
    // 下面一行会报错，因为y没有声明
    y + 2;  //本错误被下面的catch捕获
  }).catch(function (error) {
    console.log('carry on: '+error);
  }); 
}

{
  //不管函数f是同步函数还是异步操作，但是想用 Promise 来处理它。
  // 因为这样就可以不管f是否包含异步操作，都用then方法指定下一步流程，用catch方法处理f抛出的错误。
  const f = () => console.log('now');
  Promise.resolve().then(f); //缺点，就是如果f是同步函数，那么它会在本轮事件循环的末尾执行。
  console.log('next');
  // next
  // now
}

{
  //让同步函数同步执行，异步函数异步执行
  const f = () => console.log('now');
  (async () => f())(); //f是同步的，就会得到同步的结果；
  console.log('next');
  // now
  // next
  const f1 = () => {    
    return new Promise((resolve) => {
      setTimeout(resolve,20,'async now')
    });
    throw new Error('oh my god');
  };
  (async () => f1())() //f1是异步的，就可以用then指定下一步
    .then(console.log)
    .catch(console.error); //注意:async f1()抛出的错误。所以，要使用catch方法。
  console.log('async next');

  //用try改写,已成为一项提案
  Promise.try = (func) => (async () => await func())();
  const f = () => console.log('now');
  Promise.try(f).then(()=>{});
  console.log('next');

  Promise.try(f1)
    .then((ret) => console.log(ret))
    .catch((err) => console.error(err));
  console.log('async next');
}
