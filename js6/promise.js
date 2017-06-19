{
  function timeout(ms) {
    return new Promise((resolve, reject) => {
      try{
        console.log('Promise');//创建Promise后会立即执行
        setTimeout(resolve, ms, ['done']); //等待指定时间后执行
      } catch (e){
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
    setTimeout(() => {reject('Haaa')}, 2000); //p2 2秒钟后返回失败状态
  })

  p1.then(result => console.log('p1 resolve'),res => console.log('p1 reject')).catch(err => console.error('Wooooo'));

  let p2 = new Promise(function (resolve, reject) {
    setTimeout(() => resolve(p1), 100) //1秒后返回P1,而p1是一个promise,p1的状态会传递给p2
  })

  p2.then(result => console.log(result)) //必须等待p1返回状态,此例中p1未返回完成状态,会触发超时异常
    .catch(error => console.error('Wiiiiii')) // Error: fail
}

{
  let promise = new Promise(function(resolve, reject) {
    resolve('ok');
    throw new Error('test'); //一旦promise的状态变为resolved,再抛出错误是无效的,不会被捕获
  });
  promise
    .then(function(value) { console.log(value) })
    .catch(function(error) { console.log(error) }); //不会捕获错误
}

{
  //跟传统的try/catch代码块不同的是，如果没有使用catch方法指定错误处理的回调函数，Promise对象抛出的错误不会传递到外层代码，即不会有任何反应。
  //Chrome浏览器不遵守这条规定，它会抛出错误“ReferenceError: x is not defined”。
  let someAsyncThing = function() {
    return new Promise(function(resolve, reject) {
      // 下面一行会报错，因为x没有声明
      resolve(x + 2);
    });
  };

  someAsyncThing().then(function() { //如果不catch,错误不会报出
    console.log('everything is great');
  }).catch(err => console.error('something wrong')).then(() => console.log('go on'));
}
{
  let promise = new Promise(function(resolve, reject) {
    resolve('ok');
    //setTimeout(function() { throw new Error('test') }, 0) //这个错误是在下一轮事件循环才抛出
  });
  promise.then(function(value) { console.log(value) }).catch( //因此不会被promise的catch捕获.
    err => console.error('something wrong')
  );
}

{
  let count = 1;
  function tick(time) {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('tick %s after %s ms', count++, time);
        resolve();
      }, time);
    });
  }
  async function main() {
    console.log('start run...');
    await tick(500);
    await tick(1000);
    await tick(2000);
  }
  main();
}
