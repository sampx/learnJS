function show(x) {

  console.log(typeof (x)); // undefined
  console.log(typeof (10)); // number
  console.log(typeof ('abc')); // string
  console.log(typeof (true)); // boolean

  console.log(typeof (function () {})); //function

  console.log(typeof ([1, 'a', true])); //object
  console.log(typeof ({
    a: 10,
    b: 20
  })); //object
  console.log(typeof (null)); //object
  console.log(typeof (new Number(10))); //object

  //对象是函数创建的，而函数又是一种对象，要理解这个，需要理解prototype
  console.log(typeof (Object)); // function
  console.log(typeof (Array)); // function
  var fn = function () {};
  console.log(fn instanceof Object); // true

}

show();
