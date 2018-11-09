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
  let done = function(err, str){
    console.log('obj.js:\n '+ str.toString().slice(0,50));
  };

  //read('obj.js')(done);

  function f(a, b, callback){
    let sum = ''+ a + b;
    callback(sum);
    callback(sum); //thunkify中有检查机制,callback不会执行两次
  }

  let ft = thunkify(f);
  let print = console.log.bind(console);
  ft(1, 2)(print);
}

{
  //generator结合thunk函数
  let fs = require('fs');
  let thunkify = require('thunkify');
  let readFileThunk = thunkify(fs.readFile);

  let gen = function* (){

    try{
      let r1 = yield readFileThunk('obj1.js');
      if(r1) console.log('obj.js:\n '+r1.toString().slice(0,50));
    }catch(err){
      console.error('1==='+err);
    }

    try{
      let r2 = yield readFileThunk('proxy1.js');
      if(r2) console.log('proxy.js:\n '+r2.toString().slice(0,50));
    }catch(err){
      console.error('2==='+err);
    }
  };

  function run(fn) {
    let gen = fn();
    next();
    function next(err, data) {
      try{
        console.log(data?data.toString().slice(0,20):'data null');
        let result = gen.next(data);
        //console.log(result);
        if(err) gen.throw(err);
        if (result.done) return;
        result.value(next);//传入了readFileThunk的回调函数,自动带入err和data参数
      }catch(err){
        console.error('3==='+err);
      }
    }
  }
  run(gen);

  // let g = gen();
  // let r1 = g.next(); //返回function readFileThunk('obj.js')
  // console.log(r1);
  // r1.value(function (err, data) {
  //   if (err) throw err;
  //   let r2 = g.next(data); //返回function readFileThunk('proxy.js'),同时把data传给gen函数的r1
  //   console.log(r2);
  //   r2.value(function (err, data) {
  //     if (err) throw err;
  //     g.next(data); //把data传给gen函数的r2
  //   });
  // });
}