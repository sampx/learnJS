function f(){
  console.log('I am outside!');
}

(function(){
  if(false){
    // 重复声明一次函数f
    function f(){
      console.log('I am inside!');
    }
  }
  // f(); //报错,f函数未定义,在块级作用域内,函数申明会被提升到顶部
}());

f();

{
  let a = 'secret';
  let f = function () { //块级作用域内的函数定义建议用表达式方式
    console.log('I am inside! ' + a);
  };
  f();
}

if (true) { //在某些实现中,如果不加此花括号,会报语法错误
  'use strict';
  function f(){
    console.log('I am another function!');
  }
}

f();

const PI = 3.1415;
//PI = 3; 给常量赋值会报错TypeError,常量必须在定义时赋值

//const拥有与let一样的块作用域,同样存在暂时性死区,因此,好的做法是在块的顶部进行定义
if (true) {
  //console.log(MAX); // ReferenceError
  const MAX = 5;
  //var PI = 3; 不可重复定义
}

//注意: const实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址不得改动。
const foo = {};

// 为 foo 添加一个属性，可以成功
foo.prop = 123;
console.log(foo.prop); // 123

// 将 foo 指向另一个对象，就会报错
//foo = {}; // TypeError: "foo" is read-only

//如果想将对象完全冻结,可以用:
{
  const bar = Object.freeze(foo);
  'use strict';
  console.log(bar.prop);
  bar.prop = 456; //不起作用,但也不报错
  bar.prop2 = 'new prop'; //不起作用,但也不报错
  console.log(bar.prop);
  console.log(bar.prop2);
}

var  xx = 0;

//将对象彻底冻结
var constantize = (obj) => {
  Object.freeze(obj);
  xx++;
  Object.keys(obj).forEach( (key, i) => {
    if ( typeof obj[key] === 'object' ) {
      constantize( obj[key] );
    }
  });
};

try{
  constantize(global);
}catch(e) {
  console.error(e.message);
}finally{
  console.log(xx);
}

//测试callstack最大值
function computeMaxCallStackSize() {
  try {
    return 1 + computeMaxCallStackSize();
  } catch (e) {
    // Call stack overflow
    console.error(e.message);
    return 1;
  }
}
console.log(computeMaxCallStackSize());









