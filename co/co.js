
var co = require('co');
{
  co(function *(){
    // yield any promise
    let result = yield Promise.resolve(false);
    console.log(result);
  }).catch(onerror);
}

{
  //数组的写法
  co(function *(){
    // resolve multiple promises in parallel
    let a = Promise.resolve(1);
    let b = Promise.resolve(2);
    let c = Promise.resolve(3);
    let res = yield [a, b, c];
    console.log(res); // => [1, 2, 3]
  }).catch(onerror);

  //对象的写法
  co(function* () {
    let res = yield {
      'one': Promise.resolve(1),
      'two': Promise.resolve(2),
    };
    console.log(res); //{ one: 1, two: 2 }
  }).catch(onerror);
}

// errors can be try/catched
{
  co(function *(){
    try {
      yield Promise.reject(new Error('boom'));
    } catch (err) {
      console.error(err.message); // "boom"
    }
  }).catch(onerror);
}

//并发异步操作
{
  const fs = require('fs');

  // let somethingAsync = function* (x) {
  //   // do something async
  //   console.log('async operation:'+x);
  //   let y = yield readFile('data.txt');
  //   y = isNaN(parseInt(y))?1:parseInt(y);
  //   return x * y;
  // };

  function readFile(file){
    return new Promise((resolve,reject)=>{
      fs.readFile(file+'.txt', (err, data) => {
        if (err) reject(err);
        //console.log(data.toString());
        let y = isNaN(parseInt(data))?1:parseInt(data);
        resolve(y);
      });
    });
  }

  co(function* () {
    let values = [1, 2, 3];
    let ret = yield values.map(readFile);//三个异步操作，等到它们全部完成，才会进行下一步
    console.log(ret);
  });
}

{
  const fs = require('fs');

  const stream = fs.createReadStream('./coroutine.js');
  let coCount = 0;

  co(function*() {
    while(true) {
      const res = yield Promise.race([
        new Promise(resolve => stream.once('data', resolve)),
        new Promise(resolve => stream.once('end', resolve)),
        new Promise((resolve, reject) => stream.once('error', reject))
      ]);
      if (!res) {
        break;
      }
      stream.removeAllListeners('data');
      stream.removeAllListeners('end');
      stream.removeAllListeners('error');
      console.log(res.toString());
      console.log('---------------');
      coCount += (res.toString().match(/co/g) || []).length;
    }
    console.log('count:', coCount); // count: 8
  });
}


function onerror(err) {
  // log any uncaught errors
  // co will not throw any errors you do not handle!!!
  // HANDLE ALL YOUR ERRORS!!!
  console.error(err.toString());
}
