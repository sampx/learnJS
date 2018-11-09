console.log('Promise.all');
{
  /*
   以下promises是包含6个 Promise 实例的数组，只有这6个实例的状态都变成fulfilled，
   或者其中有一个变为rejected，才会调用Promise.all方法后面的回调函数。
   */
  console.time('promise all');
  let promises = [2, 3, 5, 7, 28, 13].map(function(id){
    return getJSON(id, '/post/' + id + ".json");
  });

  Promise.all(promises).then(function(posts){
    console.log('all done: ' + JSON.stringify(posts));
    console.timeEnd('promise all');
  }).catch(function(reason){
    console.error(reason);
  });

  function getJSON(id, url){
    return new Promise((resolve, reject) =>{
      try{
        if(id > 40){
          throw new Error('getJSON failed:' + url);
        }
        setTimeout(resolve, id, {url: url, 'result': 'done'}); //等待指定时间后执行
      }catch(e){
        reject(e);
      }
    });
  }
}

process.on('unhandledRejection', function(err, p){
  console.error('unhandledRejection: ' + err + ' ' + p);
});

{
  /*
   注意，如果作为参数的 Promise 实例，自己定义了catch方法，
   那么它一旦被rejected，并不会触发Promise.all()的catch方法
   */
  const p1 = new Promise((resolve, reject) =>{
    resolve('hello');
  }).then(result => result)
    .catch(e => e);

  const p2 = new Promise((resolve, reject) =>{
    throw new Error('报错了');
  }).then(result => result)
    .catch(e =>{ //如果没有这个catch,异常会被promise.all.catch捕获
      console.error(e.toString());
      return e.message;
    });

  Promise.all([p1, p2])
    .then(result => console.log(result)) //[ 'hello', '报错了' ]
    .catch(e => console.log(e.message));
}

console.log('Promise.race');

{
  //如果指定时间内没有获得结果，就将Promise的状态变为reject，否则变为resolve。
  console.time('promise race');
  const p = Promise.race([
                           fetch(300, '/resource-that-may-take-a-while'),
                           new Promise(function(resolve, reject){
                             setTimeout(() => reject(new Error('request timeout')), 500)
                           }),
                           fetch1(100, '/hahaha')
                         ])
    .then(response =>{
      console.log(response);
      console.timeEnd('promise race');
    })
    .catch(error => console.log(error));

  function fetch(ms, url){
    return new Promise((resolve, reject) =>{
      try{
        setTimeout(resolve, ms, {url: url, 'result': 'done'});
      }catch(e){
        reject(e);
      }
    });
  }

  async function fetch1(ms, url){
    try{
      console.log('fetching url:' + url);
      await sleep(ms);
      console.log('fetch url done:' + url);
      return {url: url, result: 'done'};
    }catch(e){
      console.error(e);
    }
  }

  function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

console.log('Promise实用方法');

{
  let thenable = {
    then: function(resolve, reject){
      resolve(42);
    }
  };
  //如果参数是一个promise,则直接返回这个promise
  //如果参数是一个thenable,则转换其为promise,然后立即执行其then方法
  let p1 = Promise.resolve(thenable);
  p1.then(function(value){
    console.log(value);  // 42
  });

  //如果参数不是thenable,或者是一个原始值,则返回一个新的promise对象,状态为resolved
  //如果没有传参数,直接返回一个resolved的Promise对象
  let p2 = Promise.resolve('Hello');
  p2.then(function(s){
    console.log(s)
  });
  console.time("resolve time");
  let p3 = Promise.resolve();
  p3.then(function(){
    console.timeEnd("resolve time");
  });

  let p4 = Promise.reject('出错了'); // 等同于 new Promise((resolve, reject) => reject('出错了'))

  p4.then(null, function(s){
    console.log(s)
  });

  const thenable2 = {
    then(resolve, reject) {
      reject('出错了');
    }
  };

  //注意，Promise.reject()方法的参数，会原封不动地作为reject的理由，
  //变成后续方法的参数。这一点与Promise.resolve方法不一致。
  Promise.reject(thenable2)
    .catch(e =>{
      console.log(e === thenable2) // true
    })
}

{
  //promise的事件执行顺序
  setTimeout(function(){ //在下一轮“事件循环”开始时执行
    console.log('three');
  }, 0);

  Promise.resolve().then(function(){ //在本轮“事件循环”结束时执行
    console.log('two');
  });

  console.log('one'); //立即执行，因此最先输出
}

//Promise对象的回调链，不管以then方法或catch方法结尾，
// 要是最后一个方法抛出错误，都有可能无法捕捉到（因为Promise内部的错误不会冒泡到全局）
//我们可以提供一个done方法，总是处于回调链的尾端，保证抛出任何可能出现的错误。
Promise.prototype.done = function(onFulfilled, onRejected){
  this.then(onFulfilled, onRejected)
    .catch(function(reason){
      // 抛出一个全局错误
      setTimeout(() =>{ throw reason }, 0);
    });
};
//finally方法用于指定不管Promise对象最后状态如何，都会执行的操作。
// 它与done方法的最大区别，它接受一个普通的回调函数作为参数，该函数不管怎样都必须执行。
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};