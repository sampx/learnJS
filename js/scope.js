var i = 10;
foo();

function foo() {
  console.log(name);
}
if (i > 3) {
  var name = "sam"; //不要在"块"内申明变量，Javascript没有块级作用域
}
foo();

console.log('1 === === === === === === == ');

var a = 2, //全局作用域
  b = 20; //全局作用域

/* 作用域在函数定义时就确定 => 静态作用域 <= */
function fn(x) { //fn作用域
  var a = 20, //fn作用域
    c = x; //fn作用域
  console.log(a); //=>20 fn作用域上下文
  console.log(b); //=>20 b是自由变量，要到创建此函数的作用域上下文中获取变量值（创建fn函数的作用域是全局作用域）。
  function bar(x) { //bar作用域
    var a = x, //bar作用域
      d = 40; //bar作用域
    console.log(a); //=>x bar作用域上下文
    console.log(b); //=>20 b是自由变量，要到创建此函数的作用域上下文中获取变量值（创建bar函数的作用域是fn作用域，但fn作用域没有变量b，递归到创建fn函数的作用域上下文中去获取）。
  }
  bar(30); //创建bar(30)执行上下文
  bar(50); //创建bar(50)执行上下文
}
fn();

console.log('2 === === === === === === == ');
//用以下方法封装变量，避免全局变量冲突
(function (window, undefined) {
  var a,
    b,
    c;
  //...
}(this));
