//理解Object和Function的关系 -- javascript原型链
var obj = new Object();
var Fn = function () {};
var fn = new Fn();

console.log(Object.__proto__ === Function.prototype); //true 记住这个是关键
console.log(Function.__proto__ === Function.prototype); //true
console.log(Function.prototype.__proto__ === Object.prototype); //true 记住这个是关键
console.log('11111111111111111');

console.log(Object.constructor === Function); //true
console.log(Function.constructor === Function); //true
console.log(obj.constructor === Object); //true
console.log(Fn.constructor === Function.prototype.constructor && Function.prototype.constructor === Function); //true
console.log(fn.constructor === Fn.prototype.constructor && Fn.prototype.constructor === Fn); //true
console.log('222222222222222222');

console.log(typeof (Fn)); //funtion
console.log(typeof (fn)); //object
console.log(typeof (obj)); //object
console.log(Fn instanceof Object); // true
console.log(Fn instanceof Function); //true
console.log(fn instanceof Object); // true
console.log(fn instanceof Function); //false
console.log(obj instanceof Function); //false
console.log(Object instanceof Function); //true
console.log(Function instanceof Object); //true
console.log('3333333333333333333');

console.log(Object.prototype.__proto__ === null); //true 切记
console.log(Function.prototype.__proto__ === Object.prototype); //true
console.log(Fn.prototype.__proto__ === Object.prototype); //true
console.log(Fn.__proto__ === Function.prototype); //true
console.log(fn.__proto__ === Fn.prototype); //true fn这个对象本质上是Fn这个函数实例化出来的
console.log(obj.__proto__ === Object.prototype); //true
console.log('4444444444444444444');

console.log(typeof (Object.prototype)); //object
console.log(Object.prototype.constructor === Object); //true
console.log(Function.prototype.constructor === Function); //true
