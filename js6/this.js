var obj0 = {
  a: 1,
  fn: function() {
    //console.log(this);
    setTimeout(() => {
      //剪头函数将this绑定到了obj对象
      console.log(this);
    });
  }
};
obj0.fn(); //object
//1==============================
var obj = {
  i: 10,
  b: () => console.log(this.i, this), //剪头函数作为方法，this默认指向全局对象
  c: function() {
    //普通函数作为方法，this默认指向其调用的对象
    console.log(this.i, this);
  }
};
obj.b(); // undefined {} 直接执行方法，this指向全局对象{}，todo:此处全局对象为何不是global？
obj.c(); // 10 Object {...} this被绑定到调用对象obj上

let f = obj.c; //直接应用c方法
// f(); //this指向了global
f = obj.c.bind(obj);
f(); //10 { i: 10, b: [Function: b], c: [Function: c] } this被bind到obj对象上
f = obj.b.bind(obj); //将c中断this强制绑定obj对象
f(); //undefined {} 剪头函数对bind不起作用
//2==============================
//多层嵌套
var obj1 = {
  num: 4,
  fn: function() {
    var f = function() {
      console.log(this); //global,因为函数f定义后并没有对象调用，this直接绑定到最外层的全局对象
      setTimeout(() => {
        console.log(this); //global，外层this绑定到了global,内层也相当于定义在global层（全局环境）
      });
    };
    f(); //主要是因为这个地方，没有指定对象调用f，相当于global对象调用的
  }
};
obj1.fn();

//f改为剪头函数
var obj2 = {
  num: 4,
  fn: function() {
    var f = () => {
      //此处改为剪头函数就可以
      console.log(this); //object，也就是指obj2 剪头函数没有自己的this，直接使用上层对象
      setTimeout(() => {
        console.log(this); // //object，也就是指obj2
      });
    };
    f(); //无需通过对象来调用
  }
};
obj2.fn();

//将setTimeout改为非剪头函数
var obj3 = {
  num: 4,
  fn: function() {
    var f = () => {
      console.log(this); //obj3,f()定义在obj3对象中，this就指向obj3,这就是箭头函数this指向的关键
      setTimeout(function() {
        console.log(this); //在nodejs8中，这里this是Timeout对象
      });
    };
    f();
  }
};
obj3.fn();

//fn改为剪头函数
var obj4 = {
  num: 4,
  fn: () => {
    console.log(this); //nodejs8 node命令下面这里是空对象,repl中是global对象
    var f = () => {
      console.log(this); //nodejs8 node命令下面这里是空对象,repl中是global对象
      setTimeout(() => {
        console.log(this); //nodejs8 node命令下面这里是空对象,repl中是global对象
      });
    };
    f();
  }
};
obj4.fn();

//fn改为es6方法简写，相当于fn: function(){}
//成功绑定到obj5对象，说明字面量对象不能用剪头函数做方法
var obj5 = {
  num: 4,
  //
  fn() {
    console.log(this); //成功绑定到obj5对象
    var f = () => {
      console.log(this); //成功绑定到obj5对象
      setTimeout(() => {
        console.log(this); //成功绑定到obj5对象
      });
    };
    f();
  }
};
obj5.fn();
