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
    throw new Error('出错了');
    return 'hello world';
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
  //只有这三个操作全部完成，才会执行then方法里面的console.log
  getTitle('https://tc39.github.io/ecma262/').then(console.log,e => console.log(e.message))
}

