// ES5版本
{
  Thunk = function(fn){
    return function (){
      let args = Array.prototype.slice.call(arguments);
      return function (callback){
        args.push(callback);
        return fn.apply(this, args);
      }
    };
  };
}
// ES6版本
{
  const Thunk = function(fn) {
    return function (...args) {
      return function (callback) {
        return fn.call(this, ...args, callback);
      }
    };
  };

  function f(a, cb) {
    cb(a);
  }
  const ft = Thunk(f);

  ft(1)(console.log) // 1
}

{
  let thunkify = require('thunkify');
  let fs = require('fs');

  let read = thunkify(fs.readFile);

  read('obj.js')(function(err, str){
    console.log(str);
  });

  function f(a, b, callback){
    let sum = ''+ a + b;
    callback(sum);
    callback(sum);
  }

  let ft = thunkify(f);
  let print = console.log.bind(console);
  ft(1, 2)(print);
}