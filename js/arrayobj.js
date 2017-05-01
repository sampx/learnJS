'use strict';

//这三种创建数组的方法是等价的
var arr = new Array(1, 2, 3);
var arr = Array(1, 2, 3);
var arr = [1, 2, 3];

//创建一个有长度的数组，每个元素都是undefined
var arr = new Array(5);
var arr = Array(5);
var arr = [];
arr.length = 5;
for (var x in arr) {
    console.dir(arr); //不会执行循环
}

var arr = [];
arr[3.4] = "Oranges"; //给数组添加了属性
console.dir(arr);
console.log(arr.length); //数组长度为0
console.log(arr.hasOwnProperty('3.4'));
console.log(arr.hasOwnProperty('length'));

var cats = ['Dusty', 'Misty', 'Twiggy'];
console.log(cats.length); // 3
cats.length = 2;
console.log(cats); // prints "Dusty,Misty" - Twiggy has been removed
cats.length = 0;
console.log(cats); // prints nothing; the cats array is empty
cats.length = 3;
console.log(cats); // [undefined, undefined, undefined]

//from js6
var array = ['first', 'second', undefined, 'fourth'];
// returns ['first', 'second', undefined, 'fourth']
array.forEach(function(element) {
    console.log(element);
})
// returns ['first', 'second', undefined, 'fourth']
for (var i = 0; i < array.length; i++) {
    console.log(array[i]);
}
// returns ['first', 'second']
for (var i = 0, element; element = array[i]; i++) {
    console.log(element);
}

(function alertArguments(x,y,z) {
  //arguments是类数组对象，但其没有forEach方法
  // arguments.forEach(function(item){
  //   console.log(item);
  // });
  //可以如下循环参数，这称作数组的泛化
  Array.forEach(arguments, function(item) {
      console.log(item);
  });
})(1,2,3);

//数组泛化
Array.forEach("a string", function(chr) {
   console.log(chr);
});

var str = 'abcdef';
var consonantsOnlyStr = Array.filter(str, function (c) {!(/[aeiou]/i).test(c)}).join(''); // 'bcdf'
var vowelsPresent = Array.some(str, function (c) {(/[aeiou]/i).test(c)}); // true
var allVowels = Array.every(str, function (c) {(/[aeiou]/i).test(c)}); // false
var interpolatedZeros = Array.map(str, (c) => c+'0').join(''); // 'a0b0c0d0e0f0'
var numerologicalValue = Array.reduce(str, (c, c2) => c+c2.toLowerCase().charCodeAt()-96, 0);// 21 (reduce() since JS v1.8)

let iterable = [10, 20, 30];

for (let value of iterable) {
  value += 1;
  console.log(value);
}

// var numbers = [1, 2, 3, 4];
// var doubled = [i * 2 for (i of numbers)];
// console.log(doubled); // Alerts 2,4,6,8
