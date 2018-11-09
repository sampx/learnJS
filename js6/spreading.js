/* 数组解构 */
{
  let [a, b, c] = [1, 2, 3];
  let d = 4;
  console.log(a, b, c, d); //1 2 3 4
  let [foo, [[bar], baz]] = [1, [[2], 3]];
  console.log(foo, bar, baz); //1 2 3
  let [, , a3] = ['foo', 'bar', 'baz'];
  console.log(a3); //baz
  let [head, ...tail] = [1, 2, 3, 4];
  console.log(head, tail); //1 [ 2, 3, 4 ]
  let [x, y, ...z] = ['a'];
  console.log(x, y, z); //a undefined []
  let [foo1] = []; //解构不成功
  console.log(foo1); //undefined
  let [bar1] = 'bar'; //字符串属于可遍历对象,解构出字符
  console.log(bar1); //b
  //let [baz1] = 1; //非可遍历对象,无法解构
  //console.log(baz1);
  let [e, f, g] = new Set(['a', 'b', 'c']); //只要某种数据结构具有 Iterator 接口，都可以采用数组形式的解构赋值。
  console.log(e, f, g); //a b c

  function* fibs() {
    let a = 0;
    let b = 1;
    while (true) {
      yield a;
      [a, b] = [b, a + b];
    }
  }

  let [first, second, third, fourth, fifth, sixth] = fibs();
  console.log(first, second, third, fourth, fifth, sixth); //0 1 1 2 3 5

  let [foo2 = true] = []; //解构可以有默认值
  console.log(foo2); //true
  let [x1, y1 = 'b'] = ['a', undefined]; //必须严格是undefined,才能使用默认值
  console.log(x1, y1); //a b

  function fn() {
    console.log('aaa');
    return fn;
  }

  let [x2 = fn()] = [1]; //惰性求值,因为x能取到值，所以函数f根本不会执行
  console.log(x2);
}

/* 对象解构 */
{
  let { foo, bar } = { foo: 'aaa', bar: 'bbb' };
  console.log(foo, bar); //aaa bbb

  let { baz } = { foo: 'aaa', bar: 'bbb' }; //对象的属性没有次序，变量必须与属性同名，才能取到正确的值。
  console.log(baz); //undefined

  let obj = { first: 'hello', last: 'world' };
  let { first: f, last: l } = obj; //如果变量名与属性名不一致,可以这样设置
  console.log(f, l); //hello world

  let { foo1: bar1 } = { foo1: 'aaa', bar1: 'bbb' };
  console.log(bar1); // aaa

  ({ foo1: bar1 } = { foo1: 'ccc', bar1: 'ddd' }); //必须加圆括号,否则报错,因为解析器会将起首的大括号，理解成一个代码块，而不是赋值语句。
  console.log(bar1); // ccc

  //对象和数组嵌套解构
  obj = { p: ['Hello', { y: 'World' }] };
  let {
    p: [x, { y }]
  } = obj; //注意,p是模式(或者叫对象解构匹配名),不是变量,因此p不会被赋值.
  console.log(x, y);

  //对象和数组嵌套解构
  obj = { p: ['Hello', { y: 'World' }] };
  let { p } = obj; //在此,p既是模式,又是变量. 相当于：let { p:p } = obj
  console.log(p);

  let { log, sin, cos } = Math;
  console.log(log, sin, cos);

  //对数组进行对象解构
  let arr = [1, 2, 3];
  //let { 0: first, [arr.length - 1]: last } = arr; //[]是属性名表达式
  let [first, , last] = arr;
  console.log(first, last);

  //对数组进行对象解构
  let arr = [0, 1, 1, 2, 3];
  let { 0: first, 1: secend, ...rest } = arr;
  //let [first,,last] = arr;
  console.log(first, secend, rest); //0 1 { '2': 1, '3': 2, '4': 3 }

  //解构属性
  let { length: len } = 'hello';
  console.log(len);

  //解构方法
  let { toString: s } = true;
  console.log(s.call(true)); //有些方法中绑定了this无法直接使用，需bind到指定对象

  //函数参数解构赋值
  function add([x, y]) {
    return x + y;
  }
  console.log(add([1, 2])); // 3

  console.log([[1, 2], [3, 4]].map(([a, b]) => a + b));

  //函数参数对象解构赋值，支持默认值。如果没有传入参数对象就使用默认值解构。
  function move({ x = 0, y = 0 } = {}) {
    return [x, y];
  }
  console.log(move({ x: 3, y: 8 })); // [3, 8]
  console.log(move({ x: 3 })); // [3, 0]
  console.log(move({})); // [0, 0]
  console.log(move()); // [0, 0]

  //此方法与上面不同，为函数输入参数对象提供了默认值，如果没有传入对象才使用默认值，只要传入了参数对象就进行解构
  function move({ x, y } = { x: 0, y: 0 }) {
    return [x, y];
  }
  console.log(move({ x: 3, y: 8 })); // [3, 8]
  console.log(move({ x: 3 })); // [3, undefined]
  console.log(move({})); // [undefined, undefined]
  console.log(move()); // [0, 0]
  //只要输入值是undefined就使用默认值
  console.log([1, undefined, 3].map((x = false) => x)); // [ 1, false, 3 ]

  //变量申明解构模式不能使用圆括号,语法错误
  // let { o: ({ p: p }) } = { o: { p: 2 } };
  // console.log(p);

  //赋值语句（非申明语句）的非模式部分可以使用圆括号
  [b] = [3];
  ({ p: d } = { p: 4 });
  console.log(b, d);
}

{
  //解构的用法
  //1.交换赋值
  let x = 1;
  let y = 2;
  [x, y] = [y, x];
  console.log(x, y);

  //2.从函数返回多个值
  // 返回一个数组
  function example() {
    return [1, 2, 3];
  }
  let [a, b, c] = example();
  console.log(a, b, c);

  // 返回一个对象
  function example1() {
    return {
      foo: 1,
      bar: 2
    };
  }
  let { foo, bar } = example1();
  console.log(foo, bar);

  //3.提取json数据
  let jsonData = {
    id: 42,
    status: 'OK',
    data: [867, 5309]
  };

  let { id, status, data: number } = jsonData;

  console.log(id, status, number);

  //4.函数参数赋默认值
  let jQuery = {};
  jQuery.ajax = function(
    url,
    {
      async = true,
      beforeSend = function() {},
      cache = true,
      complete = function() {},
      crossDomain = false,
      global = true
      // ... more config
    }
  ) {
    // ... do stuff
  };

  //遍历map
  var map = new Map();
  map.set('first', 'hello');
  map.set('second', 'world');

  for (let [key, value] of map) {
    console.log(key + ' is ' + value);
  }
}
