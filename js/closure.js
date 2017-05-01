function fn() {
  var max = 10;
  return function bar(x) { //函数作为返回值
    if (x > max) {
      console.log(x, "比10大");
    } else {
      console.log(x, "不大于10");
    }
  }
}

var closureFunc1 = fn();
closureFunc1(10);

(function (f) {
  f(15);
})(closureFunc1); //将闭包行数作为参数传递给一个匿名立即执行函数
