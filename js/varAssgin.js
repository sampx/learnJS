console.log(a); //a被事先赋值为undefined

var a = 10;

console.log(this); //this被事先赋值

console.log(fn); //fn事先被赋值
console.log(foo);

function Fn(x) {
  this.x = x;
  console.log(this);
  console.log(this.x);
}

console.log('******', new Fn(1));

function fn(x) {
  console.log(arguments);
  console.log(x);
}

fn(2); //创建新的上下文环境

var foo = function () {
  console.log(a); //a的作用域在此时就已被限定
}

function bar(f) {
  var a = 20;
  f();
}

bar(foo);
