{
  //属性简写
  function f(x, y) {
    return {x, y}; //等同于return {x: x, y: y};
  }
  console.log(f(1, 2)); // Object {x: 1, y: 2}

  //方法简写
  let o = {
    method() { //等同于  'method': functon{
      return "Hello!";
    }
  };
  console.log(o.method());
  o = {
    'method': function() { //等同于 method:function { 因此,不会与关键字冲突
      return "Hello!";
    }
  };
  console.log(o.method());

  //应用
  function getPoint() {
    var x = 1;
    var y = 10;
    return {x, y};
  }
  getPoint(); // {x:1, y:10}

  let ms = {};

  function getItem (key) {
    return key in ms ? ms[key] : null;
  }

  function setItem (key, value) {
    ms[key] = value;
  }

  function clear () {
    ms = {};
  }

  module.exports = { getItem, setItem, clear };
  // 等同于
  module.exports = {
    getItem: getItem,
    setItem: setItem,
    clear: clear
  };
  console.log(module.exports);

}

{
  //属性名表达式
  let propKey = 'foo';
  let obj = {
    [propKey] : 'foo', //属性名表达式
    ['b'+'ar'] : 'bar',
  };
  console.log(obj.foo); //foo
  console.log(obj.bar);
  // 方法一
  obj.foo = true; //标识符
  console.log(obj.foo); //true
  // 方法二
  obj['f' + 'oo'] = 123; //属性名表达式
  console.log(obj.foo); //123

  //再一个例子
  let lastWord = 'last word';
  let me = 'me';
  let a = {
    'first word': 'hello',
    [lastWord]: 'world',
    [me]: 'sam',
  };

  console.log(a['first word']); // "hello"
  console.log(a.me); // "sam"
  console.log(a['last word']); // "world"
}

{
  //方法名表达式
  let obj = {
    ['h' + 'ello']() {
      return 'hi';
    }
  };

  console.log(obj.hello()); // hi
}

{
  // 注意事项:属性名表达式与简洁表示法，不能同时使用，会报错。
  let foo = 'bar';
  let bar = 'abc';
  //let baz = { [foo] }; //错误:属性名表达式和属性简写不能同时使用
  let baz = { [foo]: bar};//正确
  console.log(baz);

  //注意，属性名表达式如果是一个对象，默认情况下会自动将对象转为字符串
  const keyA = {a: 1};
  const keyB = {b: 2};
  console.log(keyA.toString()); //[object Object]
  console.log(keyA.toString()); //[object Object]
  const myObject = {
    [keyA]: 'valueA',
    [keyB]: 'valueB',
  };
  console.dir(myObject); // Object {[object Object]: "valueB"}
}

{
  //对象方法的name属性
  const person = {
    sayName() {
      console.log('hello!');
    },
  };
  console.log(person.sayName.name);  // "sayName"

  //对象的get set方法,name属性不在该方法上,而在该方法的描述符对象的get 和 set 属性上
  const obj = {
    _foo: undefined,
    get foo() { return this._foo;},
    set foo(x) {this._foo = x;},
  };
  //obj.foo.name;// TypeError: Cannot read property 'name' of undefined
  const descriptor = Object.getOwnPropertyDescriptor(obj, 'foo');
  console.log(descriptor.get.name); // "get foo"
  console.log(descriptor.set.name); // "set foo"
  console.log(obj._foo);
  console.log(obj.foo = 'foo');
  console.log(obj._foo === obj.foo);

  //注意:两种特殊情况
  console.log((new Function()).name); // "anonymous"

  let doSomething = function() {};
  console.log(doSomething.bind({}).name); // "bound doSomething"

  //对象方法是Symbol,方法的name是Symbol的描述
  const key1 = Symbol('description');
  const key2 = Symbol();
  console.log(key1,key2);
  let obj1 = {
    [key1]() {},
    [key2]() {}
  };
  console.log(obj1[key1].name); // "[description]"
  console.log(obj1[key2].name); // ""
}

{
  //Object.is同值相等,与===表现基本一致,两个对象永远不严格相等
  console.log(Object.is('foo', 'foo'),'foo' === 'foo'); // true
  console.log(Object.is({foo:'foo'}, {foo:'foo'}),{foo:'foo'} === {foo:'foo'}); // false
  console.log(Object.is(1, 1),1 === 1); // true
  console.log(Object.is(undefined, undefined),undefined === undefined); // true
  console.log(Object.is(null, null),null === null); // true
  console.log(Object.is(false, false), false === false); // true
  console.log(Object.is(new Boolean(true), new Boolean(true)),new Boolean(true) === new Boolean(true)); // false
  //与===不同之处
  console.log(Object.is(+0, -0), +0 === -0); // false ,true
  console.log(Object.is(NaN, NaN), NaN === NaN); // true,false
}

{
  //Object.assign方法,注意同名属性会被覆盖
  let target = { a: 1 , b: 1};
  let source1 = { b: 2, c: 2 }; //b:2覆盖b:1
  let source2 = { c: 3, d: 3 }; //c:3覆盖c:2
  Object.assign(target, source1, source2); //会改变Target对象
  console.dir(target) // {a:1, b:2, c:3}
  //如果只有一个参数,则直接返回其自身,如果是非对象,则先转换为对象
  let obj = {a: 1};
  console.log(Object.assign(obj) === obj); // true
  let s = 'str';
  console.log(s = Object.assign(s)); //[String: 'str']
  //undefined 和 null 无法转换成对象,所以报错
  // Object.assign(undefined) // 报错
  // Object.assign(null) // 报错
  //但null和undefined允许作为源对象
  Object.assign(s,undefined) //目标对象不会发生变化
  // Object.assign(s,source2)
  console.log(s);

  //其他原始值,除了字符串可以拷贝到目标对象外,其他值不会产生效果.因为只有字符串的包装对象可枚举
  console.log(Object.assign({}, 'abc', true, 10)); // { "0": "a", "1": "b", "2": "c" }
  //只拷贝源对象的自身属性,不拷贝继承属性,不拷贝不可枚举属性
  let o = Object.defineProperty({}, '_invisible', {
    enumerable: false,
    value: 'hello'
  });
  console.dir(o._invisible); //hello
  console.log(Object.assign({b: 'c'},o)); //{ b: 'c' }
  //属性名为Symbol值的属性，也会被Object.assign拷贝
  //TODO:在node下似乎没有效果,在chrome里面是可以的
  console.log(Object.assign({ a: 'b' }, { [Symbol('c')]: 'd' })); //{ a: 'b' }

  //注意,Object.assgin 执行的是浅拷贝
  o.str = s;
  o.obj = obj;
  console.log(target = Object.assign({b: 'c'},o)); //{ b: 'c' }
  obj.a = 2;
  console.log(target);

  //注意,数组会当做对象进行拷贝:目标对象属性名为0、1的属性，被源数组的0号和1号属性覆盖了。
  console.log(Object.assign([1, 2, 3], [4, 5])); //[ 4, 5, 3 ]

  //应用:为对象添加属性
  class Point {
    constructor(x, y) {
      Object.assign(this, {x, y});
    }
  }

  //为对象添加方法
  Object.assign(Point.prototype, {
    moveLeft(arg) { this.x -= arg; return this},
    moveDown(arg) { this.y += arg; return this}
  });
  let p;
  console.log(p = new Point(0,1));
  console.log(p.moveLeft(-5).moveDown(10));

  //应用:对象克隆
  function clone(origin) {
    let originProto = Object.getPrototypeOf(origin); //获取继承的值
    return Object.assign(Object.create(originProto), origin);
  }

  let p1 = clone(p);
  console.log(p1.__proto__ === Point.prototype);

  //合并对象
  const merge =  (...sources) => Object.assign({}, ...sources);
  p1.moveDown(-4);
  console.log(merge(p,p1));

  //为属性制定默认值,注意:由于是浅拷贝,DEFAULTS对象和options对象的所有属性的值，最好都是简单类型，
  // 不要指向另一个对象。否则，options中的对象可能完全会覆盖DEFAULTS中的对象。
  const DEFAULTS = {
    logLevel: 0,
    outputFormat: 'html'
  };

  function processContent(options) {
    options = Object.assign({}, DEFAULTS, options);
    return options;
  }
  console.log(processContent({}));
}

{
  console.log('=======3');
  //对象描述符
  let obj = {
    _foo:123,
    get foo() { return this._foo; },
    set foo(val) {this._foo = val;},
  };
  console.log(Object.getOwnPropertyDescriptor(obj, '_foo'));
  // { value: 123,
  //   writable: true, 属性值可改变
  //   enumerable: true, 可枚举,如果为false,for...in\Object.keys()\Object.assign()\JSON.stringify()会忽略此属性
  //   configurable: true } //属性描述可以被改变或者属性可被删除
  console.log(Object.getOwnPropertyDescriptor(obj, 'foo'));
  // { get: [Function: get foo],
  //   set: [Function: set foo],
  //   enumerable: true,
  //     configurable: true }

  Object.defineProperty(obj,'_foo',{
    enumerable: false,
    value: 123
  });

  Object.assign(obj, { [Symbol('bar')]: 456 });

  console.log(obj.__proto__ === Object.prototype); //true
  console.log(obj.constructor); //[Function: Object]
  console.log(obj.prototype); //undefined
  console.log(obj._foo); //123

  class Point {
    //构造方法
    constructor(x=0, y=0) { //原型方法不可枚举,包括toString length等属性都不可枚举
      Object.assign(this, {x, y});
      // console.log("*****");
      // console.dir(this);
    }
  }
  //添加方法
  Object.assign(Point.prototype, {
    moveRight(arg) { this.x += arg; return this;},
    moveDown(arg) { this.y += arg; return this;},
});
  //定义不可枚举属性
  Object.defineProperty(Point.prototype, '_invisible', {
    enumerable: false,
    value: 'hello',
  });
  //定义Symbol属性
  Object.assign(Point.prototype, { [Symbol('z')]: 0 });

  //定义obj继承Point
  Object.setPrototypeOf(obj,new Point());
  console.log(obj instanceof Point); //true
  console.log(obj.prototype); //undefined

  console.log(Object.getPrototypeOf(obj)); //与__proto__的作用相同, Point { x: 0, y: 0 }
  console.log(obj.moveRight(2).moveDown(2)); //可直接使用原型中的方法
  console.log('==========');

  //遍历对象自身的和继承的可枚举属性（不含Symbol属性）。
  for (let x in obj) { console.log(x + ":" + obj[x]); }
  //Object.keys() 返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含Symbol属性）
  console.log(Object.keys(obj)); //[ 'foo', 'x', 'y' ]
  //包含对象自身的所有属性（不含继承的）,不含Symbol属性，但是包括不可枚举属性
  console.log(Object.getOwnPropertyNames(obj)); //[ '_foo', 'foo', 'x', 'y' ]
  //包含对象自身的（不含继承的）所有Symbol属性。
  console.log(Object.getOwnPropertySymbols(obj)); //[ Symbol(bar) ]
  //包含对象自身的所有属性（不含继承的），不管属性名是Symbol或字符串，也不管是否可枚举
  console.log(Reflect.ownKeys(obj)); //[ '_foo', 'foo', 'x', 'y', Symbol(bar) ]

  console.log('==========');
  let p = new Point(1,1);

  //遍历对象自身的和继承的可枚举属性（不含Symbol属性）。
  //for (let x in p) { console.log(x + ":" + p[x]); } //x:1 y:1 moveRight moveDown
  //Object.keys() 返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含Symbol属性）
  //console.log(Object.keys(p)); //[ 'x', 'y' ]
  //包含对象自身的所有属性,不含继承属性,不含Symbol属性，但是包括不可枚举属性
  //todo: 如何列出继承的不可枚举属性?
  console.log(Object.getOwnPropertyNames(p)); //[ 'x', 'y' ]
  //包含对象自身的所有Symbol属性,不含继承的。
  //todo: 如何列出继承的Symbol属性?
  console.log(Object.getOwnPropertySymbols(p)); //[]
  //包含对象自身的所有属性,不含继承的，不管属性名是Symbol或字符串，也不管是否可枚举
  console.log(Reflect.ownKeys(p)); //[ 'x', 'y' ]
  console.log(p._invisible = 'sam'); //无法更改值,但不报错
  console.log(Object.getOwnPropertyDescriptor(Point.prototype, '_invisible'));
  console.log(Object.getOwnPropertyDescriptors(Point.prototype));//ES2017语法

  //应用,注意:会正确拷贝set方法,但无法拷贝Symbol属性
  const shallowClone = (obj) => Object.create(
    Object.getPrototypeOf(obj),
    Object.getOwnPropertyDescriptors(obj)
  );

  let o2 = shallowClone(obj);
  console.log(Object.getOwnPropertyDescriptors(o2));

  //对象继承的新写法
  const o3 = Object.create(
    o2,
    Object.getOwnPropertyDescriptors({
                                       foo: 456,
                                     })
  );
  console.log(o3);
}

{
  console.log('==========');
  //以下方法都只返回参数对象自身的（不含继承的）所有可遍历（enumerable）属性,不含Symbols
  let obj = { foo: 'bar', baz: 42 };
  console.log(Object.keys(obj));
  console.log(Object.values(obj));
  console.log(Object.entries(obj));

  obj = Object.create({}, {p: {value: 42}}); //不显式声明，默认是不可遍历的
  console.log(Object.values(obj)); // []
  obj = Object.create({}, {p: {value: 42,enumerable:true}});
  console.log(Object.values(obj)); // [42]

  console.log(Object.keys({ [Symbol()]: 123, foo: 'abc' }));//[ 'abc' ]
  console.log(Object.values('foo')); //[ 'f', 'o', 'o' ] 字符串会返回数组
  console.log(Object.values(42)); // []
  console.log(Object.values(true));// []

  //应用
  obj = { foo: 'bar', baz: 42 };
  let map = new Map(Object.entries(obj));
  console.log(map);

}
var log = require('../fm-utils/fm-logger');

{
  console.log('==========');

  let myIterable = {};
  myIterable[Symbol.iterator] = function* () {
    yield 1;
    yield 2;
    yield 3;
  };

  log.l([...myIterable] );// [1, 2, 3]

  let obj = {
    * m(){ //*号代表是Generator函数
      yield 'hello ';
      yield 'world';
    }
  };

  log.l(...obj.m());

  for(let i of obj.m()){
    log.l(i);
  }

  log.l(...obj.m());

}

{
  // Shape - superclass
  function Shape() {
    this.x = 0;
    this.y = 0;
  }

  // superclass method
  Shape.prototype.move = function(x, y) {
    this.x += x;
    this.y += y;
    console.info('Shape moved.');
  };

  // Rectangle - subclass
  function Rectangle() {
    Shape.call(this); // call super constructor.
  }

  // subclass extends superclass
  Rectangle.prototype = Object.create(Shape.prototype);
  Rectangle.prototype.constructor = Rectangle;

  var rect = new Rectangle();

  console.log('Is rect an instance of Rectangle?',
              rect instanceof Rectangle); // true
  console.log('Is rect an instance of Shape?',
              rect instanceof Shape); // true
  log.l(rect.__proto__.__proto__);
  rect.move(1, 1); // Outputs, 'Shape moved.'
}