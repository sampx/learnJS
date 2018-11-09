{
  //多种写法
  // 函数声明
  async function foo() {}

  // 函数表达式
  const foo1 = async function () {};

  // 对象的方法
  let obj = { async foo() {} };
  obj.foo().then();

  // Class 的方法
  class Storage {
    constructor() {
      this.cachePromise = async () => {
        return '/avatars/sam.jpg';
      }
    }

    async getAvatar(name) {
      try{
        const cache = await this.cachePromise();
        return cache.match(`/avatars/${name}.jpg`);
      }catch(err){
        console.error(err);
        return 'no Avatar';
      }

    }
  }

  const storage = new Storage();
  storage.getAvatar('sam').then((res)=>{console.log("avator of sam:",res)});

  // 箭头函数
  const foo2 = async () => {};
}

{
  //让同步函数同步执行，异步函数异步执行
  const f = () => console.log('now');
  (async () => f())(); //f是同步的，就会得到同步的结果；
  console.log('next');
  // now
  // next
  const f1 = () => {
    //throw new Error('oh my god');
    return new Promise((resolve) => {
      setTimeout(resolve,20,'async now')
    });
  };
  (async () => f1())() //f1是异步的，就可以用then指定下一步 见:promise.js Promise.try
    .then((ret) => console.log(ret))
    .catch((err) => console.error(err)); //注意:async f1()抛出的错误。所以，要使用catch方法。
  console.log('async next');
}

{
  //return 语句会成为then回调函数的参数
  async function f() {    
    return 'hello world';
    throw new Error('出错了');
  }

  f().then(v => console.log(v),e => console.log(e.message))
}

{
  let fetch = require('node-fetch');
  async function getTitle(url) {
    let response = await fetch(url);
    let html = await response.text();
    return html.match(/<title>([\s\S]+)<\/title>/i)[1];
  }
  //只有这三个操作全部完成，才会执行then方法里面的console.log,除非遇到return
  getTitle('https://tc39.github.io/ecma262/').then(console.log,e => console.log(e.message))
}


{
  async function f() {
    return await 123; //转成 Promise 对象，并立即resolve
  }

  f().then(v => console.log(v))
  // 123
}

{
  async function f() {
    await Promise.reject('出错了'); //可以省略return,如果想执行下面的语句,可以在此catch
    await Promise.resolve('hello world'); // 不会执行
  }

  f().then(v => console.log(v),e => console.log(e));
  // 出错了
}

{
  async function f() {
    try {
      await new Promise(function (resolve, reject) {
        throw new Error('出错了');
      });
    } catch(e) {
    }
    return await('hello world');
  }

  f()
    .then(v => console.log(v))
    .catch(e => console.log(e))
  // 出错了
}

{
  const superagent = require('superagent');
  const NUM_RETRIES = 3;

  async function test() {
    let i;
    for (i = 0; i < NUM_RETRIES; ++i) {
      try {
        //await superagent.get('http://google.com/this-throws-an-error');
        break;
      } catch(err) {}
    }
    console.log(i); // 3
  }

  test();
}

{
  async function dbExec(db) {
    let docs = [{1:1}, {2:2}, {3:3}];
    let promises = docs.map((doc) => db.post(doc));

    let results = await Promise.all(promises);
    console.log(results);
  }

  let database = {
    post : (param) => {
      console.log('DB exec sql with params:'+JSON.stringify(param));
      return new Promise((resolve) => resolve(param));
    },
  };

  // dbExec(database);

}

{
  async function dbExec(db) {
    let docs = [{1:1}, {2:2}, {3:3}];
    // let promises = docs.map((doc) => db.post(doc));

    const promises = docs.map(async doc => {
      return await db.post(doc);
    });

    let results = [];

    //注意: 无法使用forEach 和 map
    // promises.forEach(async (promise)=>{
    //   results.push(await promise) //无法返回结果
    // });

    //results = promises.map(async (promise) => {return (await promise)}); //无法执行promise

    for (let promise of promises) {//ok
      results.push(await promise);
    }

    console.log(results);
  }

  let database = {
    post : async (param) => {
      console.log('DB exec sql with params:'+JSON.stringify(param));
      return await param;
    },
  };

  dbExec(database);

}

{
  //以下是异步遍历器的提案
  // (async function () {
  //   for await (const x of ['a', 'b']) {
  //     console.log(x);
  //   }
  // })();

  //异步生成器函数
  // async function* asyncGenerator() {
  //   console.log('Start');
  //   const result = await doSomethingAsync(); // (A)
  //   yield 'Result: '+ result; // (B)
  //   console.log('Done');
  // }
  //
  // asyncGenerator()
  //   .next()
  //   .catch(err => console.log(err)); // Error: Problem!
}

