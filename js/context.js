var a = 10, //1.进入全局上下文环境
  fn,
  bar = function (x) {
    var b = 5;
    fn(x + b); //3.创建fn上下文环境，入栈
  }; //5.bar上下文环境出栈销毁

fn = function (y) {
  var c = 5; //fn上下文环境
  console.log(y + c);
}; //4.fn上下文环境，出栈销毁

bar(10); //2.创建bar上下文环境,入栈
//6.全局上下文环境出栈销毁
