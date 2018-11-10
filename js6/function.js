{
  //rest参数和扩展运算符
  function f(v, w, x, y, ...z) {
    let arr = Array.from(arguments);
    console.log(...arr);

    for (let [index, elem] of arr.entries()) {
      console.log(index + '=' + elem);
    }

    console.log(v); //-1
    console.log(w); //0
    console.log(x); //1
    console.log(y); //2
    console.log(z); //[3,4,5]
  }

  let args = [0, 1];
  f(-1, ...args, 2, ...[3, 4, 5]);

  //应用
  let str = 'x\uD83D\uDE80y';
  console.log(str);
  console.log([...str].length); // 3
  console.log(str.length); // 4 32位Unicode字符长度识别错误
  console.log(
    str
      .split('')
      .reverse()
      .join('')
  ); // 'y\uDE80\uD83Dx' 错误
  console.log([...str].reverse().join('')); // 'y\uD83D\uDE80x' 正确

  let map = new Map([[1, 'one'], [2, 'two'], [3, 'three']]);
  let arr1 = [...map.values()];
  // for (let elem of arr.values()) {
  //   console.log(elem);
  // }
  console.log(...arr1);
}

{
  let go = function*() {
    yield 1;
    yield 2;
    yield 3;
  };

  console.log(go()); // [1, 2, 3]
}

{
  //严格模式
  (function doSomething(a, b = 0) {
    //'use strict'; //使用了参数默认值、解构或者剩余参数，不能用严格模式
    console.log(a, b);
  })(1, 2);

  //此方法可以规避
  const doSomething1 = (function() {
    'use strict';
    return function(value = 42) {
      return value;
    };
  })();
}

{
  //箭头函数
  let sum = (num1, num2) => {
    return num1 + num2;
  };
  console.log(sum(2, 3));
  //如果函数返回一个对象，必须在对象外层包装圆括号，以免被识别为代码执行块
  let getTempItem = id => ({ id: id, name: 'Temp' });
  console.log(getTempItem(2));

  //配合解构使用箭头函数
  const fullName = ({ first, last = 'xu' }) => first + ' ' + last;
  console.log(fullName({ first: 'Sam', last: 'Xu' }));

  //应用
  const result = [2, 56, 44, 8].sort((a, b) => a - b);
  console.log(result);
  const isEven = n => n % 2 == 0;
  console.log(isEven(5));

  const numbers = (...nums) => nums.join(',');
  console.log(numbers(1, 2, 3, 4, 5)); // [1,2,3,4,5]
  const headAndTail = (head, ...tail) => [head, tail];
  console.log(headAndTail(1, 2, 3, 4, 5)); // [1,[2,3,4,5]]

  const pipeline = (...funcs) => val => funcs.reduce((a, b) => b(a), val);

  const plus1 = a => a + 1;
  const mult2 = a => a * 2;
  const minas2 = a => a - 2;
  const addThenMult = pipeline(plus1, mult2, minas2);
  console.log(addThenMult(5));

  //注意 箭头函数体内this绑定为函数定义时所在对象

  let id = 21;

  function Foo({ id, name }) {
    this.id = id;
    this.name = name;
    this.log = () => {
      //此处必须是箭头函数，否则就无法绑定this的值
      setTimeout(() => {
        console.log('*** id:', this.id, this.name);
      }, 100);
    };
  }

  Foo.prototype.name = 'bar';
  Foo.prototype.logme = function() {
    //此处不能用箭头函数，因为箭头函数无自己的this
    setTimeout(() => {
      //此处必须是箭头函数，否则就无法绑定this的值
      console.log('id:', this.id, this.name);
    }, 100);
  };

  let f = new Foo({ id: 88, name: 'sam' });
  let f1 = new Foo({ id: 66, name: 'lucy' });
  let f2 = new Foo({ id: 77 });
  // f.logme();
  // f1.logme();
  // f2.logme();
  // f.log();
  // f1.log();
  // f2.log();

  let v = function() {
    return [
      function() {
        return this.x;
      }.bind({ x: 'inner' })(),
      (() => this.x).bind({ x: 'inner' })() //箭头函数bind不会生效
    ];
  }.call({ x: 'outer' });

  console.log(v);
}

{
  //尾递归优化，确保最后一步只调用自身,注意：尾递归优化只在严格模式下生效
  function Fibonacci2(n, ac1 = 1, ac2 = 1) {
    if (n <= 1) {
      return ac2;
    }
    if (n > 95) console.log(n, ac1, ac2);

    return Fibonacci2(n - 1, ac2, ac1 + ac2);
  }
  console.log(Fibonacci2(100)); // 573147844013817200000
  console.log(Fibonacci2(1000)); // 7.0330367711422765e+208
  console.log(Fibonacci2(10000)); // Infinity

  function tailFactorial(n, total) {
    if (n === 1) return total;
    return tailFactorial(n - 1, n * total);
  }

  function tail_factorial(n) {
    return tailFactorial(n, 1);
  }
  //console.log(tail_factorial(10000) >= Number.MAX_VALUE); // 3.0414093201713376e+64

  //currying 柯里化--将多参数的函数转换成单参数的形式
  function currying(fn, n) {
    return function(m) {
      return fn.call(this, m, n);
    };
  }

  const currying_factorial = currying(tailFactorial, 1);
  console.log(currying_factorial(10)); // 3628800

  function factorial(n, total = 1) {
    if (n === 1) return total;
    return factorial(n - 1, n * total);
  }

  console.log(factorial(10000)); // 120

  //采用蹦床函数将递归转换为循环

  let sum_origin = function(x, y) {
    //递归函数
    if (y > 0) {
      return sum_origin(x + 1, y - 1);
    } else {
      return x;
    }
  };

  //console.log(sum_origin(1, 100000)) //RangeError: Maximum call stack size exceeded

  //蹦床函数：如果是函数就执行它
  function trampoline(f) {
    while (f && f instanceof Function) {
      f = f();
    }
    return f;
  }

  function sum(x, y) {
    //返回一个函数
    if (y > 0) {
      return sum.bind(null, x + 1, y - 1);
    } else {
      return x;
    }
  }
  //用蹦床函数执行
  console.log(trampoline(sum(1, 1000000)));

  //真正的尾递归优化函数
  function tco(f) {
    var value;
    var active = false;
    var accumulated = [];

    return function accumulator() {
      accumulated.push(arguments);
      //console.log(accumulated);
      if (!active) {
        active = true;
        while (accumulated.length) {
          let arg = accumulated.shift();
          value = f.apply(this, arg);
        }
        active = false;
        return value;
      }
    };
  }

  let sum_tco = tco(function(x, y) {
    //递归函数
    if (y > 0) {
      return sum_tco(x + 1, y - 1);
    } else {
      return x;
    }
  });

  console.log(sum_tco(1, 10000000));
}
