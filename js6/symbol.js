{
  //symbol类似与字符串,但保证唯一
  let s = Symbol('foo');
  console.log("type:" + (typeof s) + " value:" + s.toString());

  let s1 = Symbol('foo');
  console.log(s === s1); //false

  //symbol只能显式的转换为字符串,可以转换为boolen,不能转换为数值
  //由于每一个 Symbol 值都是不相等的，这意味着 Symbol 值可以作为标识符，用于对象的属性名，就能保证不会出现同名的属性。
  let mySymbol = Symbol();

  // 第一种写法
  let a = {};
  a[mySymbol] = 'Hello!';
  console.log(a[mySymbol]); // "Hello!"
  // 第二种写法
  a = {
    [mySymbol]: 'Hello!'
  };
  console.log(a[mySymbol]); // "Hello!"
  // 第三种写法
  a = {};
  Object.defineProperty(a, mySymbol, {value: 'Hello!'});

  // 以上写法都得到同样结果
  console.log(a[mySymbol]); // "Hello!"

  //注意，Symbol 值作为对象属性名时，不能用点运算符。
  console.log(a.mySymbol); // undefined

  //在对象内部,用symbol定义属性,symbol值必须放在方括号内
  let obj = {
    [s]: function(arg){ console.log(arg); }
  };
  //增强对象写法
  obj = {
    [s](arg) { console.log(arg); }
  };
  obj[s](123);

  //用来定义常量
  const LOGGER = Symbol('logger');
  var log = {
    [LOGGER](...args) {console.log(...args);}
  };
  log.levels = {
    DEBUG: Symbol('debug'),
    INFO : Symbol('info'),
    WARN : Symbol('warn')
  };
  var l = log[LOGGER];

  l(log.levels.DEBUG, 'debug message');
  l(log.levels.INFO, 'info message');

  //另一个例子
  const COLOR_RED = Symbol('red');
  const COLOR_GREEN = Symbol('green');

  function getComplement(color){
    switch(color){
      case COLOR_RED:
        return COLOR_GREEN;
      case COLOR_GREEN:
        return COLOR_RED;
      default:
        throw new Error('Undefined color');
    }
  }

  l(getComplement(COLOR_GREEN));

  //再一个例子,消除魔术字符串
  let shapeType = {
    TRIANGLE: Symbol(),
  };

  function getArea(shape, options){
    var area = 0;
    switch(shape){
      case shapeType.TRIANGLE:
        area = .5 * options.width * options.height;
        break;
    }
    return area;
  }

  l(getArea(shapeType.TRIANGLE, {width: 100, height: 100}));

  l(Object.getOwnPropertySymbols(log)); //[ Symbol(logger) ]

  //应用3:实现私有属性
  let SIZE = Symbol('size');
  let MAXSIZE = Symbol('max_size');
  class Collection {
    constructor(){
      this[SIZE] = 0;
      this[MAXSIZE] = 0;
    }

    add(item){
      this[this[MAXSIZE]] = item;
      this[SIZE]++;
      this[MAXSIZE]++;
      return this;
    }

    rm(idx = 0){
      if(idx >= 0 && idx <= this[SIZE]){
        delete this[Object.keys(this)[idx]];
        this[SIZE]--;
      }
      return this;
    }

    static sizeOf(instance){
      return instance[SIZE];
    }
  }

  let x = new Collection();
  l(Collection.sizeOf(x)) // 0

  x.add('foo');
  l(Collection.sizeOf(x)) // 1
  x.add('bar');
  l(Collection.sizeOf(x)) // 2
  x.add('baz');
  l(Collection.sizeOf(x)) // 3

  l(Object.keys(x)) // ['0']
  l(Object.getOwnPropertyNames(x)) // ['0']
  l(Object.getOwnPropertySymbols(x)) // [Symbol(size)]

  x.rm(1);
  l(Collection.sizeOf(x)) // 2
  l(Object.keys(x)) // [ '0', '2' ]
  x.add('ba');
  l(Collection.sizeOf(x)) // 3
  l(Object.keys(x)) // [ '0', '2', '3' ]
  l(Object.values(x))
  x.rm(0).rm(1).rm(0).add('xxx');
  l(Object.keys(x)) // [ '4' ]
  l(Object.values(x))
}

{
  //Symbol.for 会先检查之前是否已经用创建Symbol.for(在全局环境登记),如果已创建就直接返回
  let foo = Symbol.for("foo");
  let bar = Symbol("bar");
  l(bar === Symbol("bar")); //false
  l(foo === Symbol.for("foo")); //true
  let foo2 = Symbol.keyFor(foo);
  bar2 = Symbol.keyFor(bar);
  l(foo,foo2,bar,bar2) //Symbol(foo) 'foo' Symbol(bar) undefined
}

{
  class MyClass {
    static [Symbol.hasInstance](foo) {
      return foo instanceof Array;
    }
  }

  l([1, 2, 3] instanceof MyClass); // true

  class Even {
    static [Symbol.hasInstance](obj) {
      return Number(obj) % 2 === 0;
    }
  }

  l(1 instanceof Even); // false
  l('2' instanceof Even); // true
  l('345' instanceof Even); // false
}

{
  //Symbol.isConcatSpreadable 如果显示设置为false,表示数组在连接时不会自动展开,如果不进行设置则进行默认展开
  let arr1 = ['c', 'd'];
  l(['a', 'b'].concat(arr1, 'e')); // ['a', 'b', 'c', 'd', 'e']
  l(arr1[Symbol.isConcatSpreadable]); // undefined

  let arr2 = ['c', 'd'];
  arr2[Symbol.isConcatSpreadable] = false;
  l(['a', 'b'].concat(arr2, 'e')); // ['a', 'b', ['c','d'], 'e']

  //类数组的对象也可以展开,但其Symbol.isConcatSpreadable默认设置为false,必须手动打开
  let obj = {length: 2, 0: 'c', 1: 'd'};
  l(['a', 'b'].concat(obj, 'e')); // ['a', 'b', obj, 'e']

  obj[Symbol.isConcatSpreadable] = true;
  l(['a', 'b'].concat(obj, 'e')); // ['a', 'b', 'c', 'd', 'e']

  //注意:对于一个类来说，Symbol.isConcatSpreadable属性必须写成实例的属性。
  class A1 extends Array {
    constructor(args) {
      super(args);
      this[Symbol.isConcatSpreadable] = true;
    }
  }
  class A2 extends Array {
    constructor(args) {
      super(args);
      this[Symbol.isConcatSpreadable] = false;
    }
  }
  let a1 = new A1();
  a1[0] = 3;
  a1[1] = 4;
  let a2 = new A2();
  a2[0] = 5;
  a2[1] = 6;
  l([1, 2].concat(a1).concat(a2));// [1, 2, 3, 4, [5, 6]]
}

{
  //Symbol.species指向当前对象的构造函数 采用get读取器方式写,只要定义了本属性,将在调用构造函数时使用本属性返回的函数
  class MyArray extends Array {
    constructor (...args){
      super(...args);
      l('in MyArray constructor');
    }
    static get [Symbol.species]() {
      l('in Symbol.species');
      // return this;
      return Array;  //改为返回其父类型
    }
  }
  var a = new MyArray(1,2,3);
  l(a instanceof MyArray);
  l(a);
  let mapped = a.map(x => x * x); //会调用get [Symbol.species](如果定义了)属性方法构造返回对象,否则使用constructor
  l(mapped instanceof MyArray); // false
  l(mapped instanceof Array); // true
  l(mapped);
}

{
  //Symbol.iterator指向该对象的默认遍历器方法
  class Collection {
    *[Symbol.iterator]() {
      let i = 0;
      while(this[i] !== undefined) {
        yield this[i];
        ++i;
      }
    }
  }

  let myCollection = new Collection();
  myCollection[0] = 1;
  myCollection[1] = 2;

  for(let value of myCollection) {
    console.log(value);
  }
  // 1
  // 2
}

{
  //Symbol.toPrimitive属性，指向一个方法。该对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始类型值。
  let obj = {
    [Symbol.toPrimitive](hint) {
      switch (hint) {
        case 'number':
          return 123;
        case 'string':
          return 'str';
        case 'default':
          return 'default';
        default:
          throw new Error();
      }
    },
    [Symbol.toStringTag]: 'Foo'
  };

  l(2 * obj); // 246
  l(3 - obj); // -120
  l(obj == 'default'); // true
  l(String(obj)); // 'str
  l(obj+''); //default
  l(obj.toString());//[object Foo]
}

{
  //Symbol.toStringTag属性，指向一个方法。在该对象上面调用Object.prototype.toString方法时
  // 如果这个属性存在，它的返回值会出现在toString方法返回的字符串之中，表示对象的类型。
  // 例一
  l(({[Symbol.toStringTag]: 'Bar'}.toString()));// "[object Bar]"

  // 例二
  class Collection {
    get [Symbol.toStringTag]() {
      return 'xxx';
    }
  }

  var x = new Collection();
  l(Object.prototype.toString.call(x)); // "[object xxx]"



}