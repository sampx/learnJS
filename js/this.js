function Foo() {
  this.name = "Sam";
  this.x = 1977;
  this.fn = function () {
    console.log(this);
    console.log(this.x);
  };
  //实例化（new）时调用，普通函数调用时 this的指向不同
  console.log(this);
  console.log(this.x);
}

Foo.prototype.getName = function () {
  return this.name;
}
var f1 = new Foo(); //作为构造函数调用：this => {name:"sam",x:1977}
console.log(f1.getName());
console.log("1=======");
Foo(); //作为普通函数调用
//上一步污染了global，清除掉
delete name;
delete x;
console.log(global.name, global.x);
console.log("2=======");
var obj = {
  name: 'Sam',
  x: 1977,
  fn: function () {
    console.log(this);
    console.log(this.x);
  }
}
//作为属性方法调用：this => {name:"sam",x:1977}
obj.fn();
f1.fn();
console.log("3=======");

//作为全局环境上下文调用,this => global 或 window
var fn1 = obj.fn;
fn1();
console.log("4=======");

//函数以Call 或 apply调用
var fn2 = f1.fn;
fn2.call(obj);
console.log("5=======");
fn1.apply(f1);
