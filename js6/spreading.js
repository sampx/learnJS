/* 数组解构 */
{
  let [a, b, c] = [1, 2, 3];
  let d = 4;
  console.log(a, b, c, d);
  let [foo, [[bar], baz]] = [1, [[2], 3]];
  console.log(foo, bar, baz);
  let [ , , a3] = ["foo", "bar", "baz"];
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
  let [e, f, g] = new Set(['a', 'b', 'c']);//只要某种数据结构具有 Iterator 接口，都可以采用数组形式的解构赋值。
  console.log(e, f, g); //a b c

  function

*
  fibs()
  {
    let a = 0;
    let b = 1;
    while(true){
      yield a;
      [a, b] = [b, a + b];
    }
  }

  let [first, second, third, fourth, fifth, sixth] = fibs();
  console.log(sixth);

  let [foo2 = true] = []; //解构可以有默认值
  console.log(foo2); //true
  let [x1, y1 = 'b'] = ['a', undefined]; //必须严格是undefined,才能使用默认值
  console.log(x1, y1); //a b

  function fn(){
    console.log('aaa');
    return fn;
  }

  let [x2 = fn()] = [1]; //惰性求值,因为x能取到值，所以函数f根本不会执行
  console.log(x2);
}

/* 对象解构 */
{
  let { foo, bar } = { foo: "aaa", bar: "bbb" };
  console.log(foo,bar); //aaa bbb

  let { baz } = { foo: "aaa", bar: "bbb" }; //对象的属性没有次序，变量必须与属性同名，才能取到正确的值。
  console.log(baz); //undefined

  let obj = { first: 'hello', last: 'world' };
  let { first: f, last: l } = obj; //如果变量名与属性名不一致,可以这样设置
  console.log(f,l); //hello world

  let { foo1: bar1 } = { foo1: "aaa", bar1: "bbb" };
  console.log(bar1); // foo1 未定义

  ({ foo1: bar1 } = { foo1: "ccc", bar1: "ddd" }); //必须加圆括号,否则报错,因为解析器会将起首的大括号，理解成一个代码块，而不是赋值语句。
  console.log(bar1);

  //对象和数组嵌套解构
  obj = { p: ['Hello', { y: 'World' } ] };
  let { p: [x, { y }] } = obj; //注意,p是模式,不是变量,因此p不会被赋值.
  console.log(x,y);

}

