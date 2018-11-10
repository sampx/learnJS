var a = {};
console.log(a.prototype); //undefined
console.log(a.__proto__); //{}

var b = function() {};
console.log(b.prototype); //b {}
console.log(b.__proto__); //[Function]

//__proto__指向谁
/*1、字面量方式*/
var a = {};
console.log(a.__proto__); //{}
console.log(a.__proto__ === a.constructor.prototype); //true

/*2、构造器方式*/
var A = function() {};
var a = new A();
console.log(a.__proto__); //A {}
console.log(a.__proto__ === a.constructor.prototype); //true

/*3、Object.create()方式*/
var a1 = { a: 1 };
var a2 = Object.create(a1);
console.log(a2.__proto__); //Object {a: 1}
console.log(a2.__proto__.__proto__); //false（此处即为图1中的例外情况）

//原型链
var A = function() {};
var a = new A();
console.log(a.__proto__); //A {}（即构造器function A 的原型对象--A.prototype）
console.log(a.__proto__.__proto__ === Object.prototype); //{}（即构造器function Object的原型对象--Object.prototype）
console.log(a.__proto__.__proto__.__proto__); //null
