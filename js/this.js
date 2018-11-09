function Foo() {
  this.name = 'Sam';
  this.x = 1977;
  this.fn = function() {
    console.log(this.name);
    console.log(this.x);
  };
  //实例化（new）时调用，普通函数调用时 this的指向不同
  console.log(this.name);
  console.log(this.x);
}

Foo.prototype.getName = function() {
  return this.name;
};
var f1 = new Foo(); //打印Sam \n 1977,因为作为构造函数调用：this => {name:"sam",x:1977}
console.log(f1.getName()); //Sam
console.log('1=======');
Foo(); //打印Sam \n 1977,作为普通函数调用,this指向了global,在global里面设置了name和x属性
console.log(global.name, global.x); //打印Sam \n 1977
//上一步污染了global，清除掉
delete name;
delete x;
console.log('2=======');
//作为全局环境上下文调用,this => global 或 window
var fn1 = f1.fn;
fn1(); //undefined
console.log('3=======');
//函数以Call 或 apply调用
var fn2 = f1.fn;
fn2.call({ name: 'Sam', x: 1977 });
console.log('4=======');
fn1.apply(f1);
