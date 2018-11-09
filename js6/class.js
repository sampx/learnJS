var util = require("../fm-utils/fm-utils.js");
{
  class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }

    toString() { //不需要加function
      return '(' + this.x + ', ' + this.y + ')';
    }
  }

  console.log(new Point(1,2).toString()); //(1, 2)
  console.log(typeof Point); //function
  console.log(typeof new Point()); //object
  console.log(Point === Point.prototype.constructor);//true

  //实例的属性除非显式定义在其本身（即定义在this对象上），否则都是定义在原型上
  let point = new Point(2,3);
  console.log(point.hasOwnProperty('toString')); // false
  console.log(point.__proto__.hasOwnProperty('toString')); // true
  console.log(...util.objectEntries(point.__proto__));

  //向类添加方法
  console.log(...util.objectEntries(Point.prototype));
  Object.assign(Point.prototype, {
    toValue(){}
  });
  console.log(...util.objectEntries(Point.prototype));

  //[ 'toValue' ] toString是内部定义方法,不可枚举,这一点与 ES5 的行为不一致
  console.log(Object.keys(Point.prototype));
  console.log(Object.getOwnPropertyNames(Point.prototype)); //[ 'constructor', 'toString', 'toValue' ]
  console.log(Object.keys(new Point()));//[ 'x', 'y' ]
}

{
  //类的属性名可以用表达式
  let methodName = 'getArea';

  class Square {
    //类的内部默认都是严格模式
    constructor(length) {
      // ...
    }

    [methodName]() {
      // ...
    }
  }

  console.log(Object.getOwnPropertyNames(Square.prototype));//[ 'constructor', 'getArea' ]
}

{
  //一个类必须有constructor方法，如果没有显式定义，一个空的constructor方法会被默认添加。

  class Point {
    constructor() {} //如果不写此行,会默认添加,默认返回this
  }
}

{
  //使用类表达式创建类,这个类的名字是MyClass而不是Me，Me只在 Class 的内部代码可用，指代当前类
  //如果内部没有使用Me可以省略
  const MyClass = class Me {//
    getClassName() {
      return Me.name;
    }
  };

  let inst = new MyClass();
  console.log(inst.getClassName()); // Me
  //Me.name // ReferenceError: Me is not defined
}

{
  //用字面量定义类
  //new MyClass(); //MyClass is not defined 没有变量提升
  const MyClass = class { /* ... */ };

  //定义立即执行的Class
  let person = new class {
    constructor(name) {
      this.name = name;
    }

    sayName() {
      console.log(this.name);
    }
  }('张三');

  person.sayName(); // "张三"
}

{
  //ES6不提供类的私有方法,只能变通实现
  class Widget {
    // 公有方法
    foo (baz) {
      this._bar(baz);
    }

    // 私有方法
    _bar(baz) { //不保险,在类的外部是可以调用此方法的
      return this.snaf = baz;
    }
    // ...
  }
  console.log(Object.getOwnPropertyNames(Widget.prototype)); //[ 'constructor', 'foo', '_bar' ]

  //第二种方法
  {
    class Widget1 {
      // 公有方法
      foo (baz) {
        bar.call(this,baz); //这使得bar实际上成为了当前模块的私有方法。
      }
    }

    // 私有方法移出到类外面
    function bar(baz) {
      return this.snaf = baz;
    }

    console.log(Object.getOwnPropertyNames(Widget1.prototype)); //[ 'constructor', 'foo' ]
  }

  //第三种方法

  const bar = Symbol('bar');
  const snaf = Symbol('snaf');

  class myClass{
    //#a; //新提案,私有属性

    // 公有方法
    foo(baz) {
      this[bar](baz);
    }
    // 私有方法
    [bar](baz) {
      return this[snaf] = baz; //私有属性
    }
    // ...
  }

  console.log(Object.getOwnPropertyNames(myClass.prototype)); //[ 'constructor', 'foo' ]
}

{
  //this指向类的实例,
  { //示例1
    class Logger {
      //必须非常小心，一旦单独使用该方法，很可能报错
      printName(name = 'there') {
        this.print(`Hello ${name}`);
      }

      print(text) {
        console.log(text);
      }
    }

    const logger = new Logger();
    logger.printName('Sam');
    //单独使用此方法则报错
    //const { printName } = logger;
    //printName(); // TypeError: Cannot read property 'print' of undefined
  }

  { //示例2
    class Logger {
      //使用箭头函数绑定this
      constructor() {
        //this.printName = this.printName.bind(this);
        this.printName = (name = 'there') => {
          this.print(`Hello ${name}`);
        }
      }

      print(text) {
        console.log(text);
      }
    }

    const logger = new Logger();
    //单独使用此方法则报错
    const { printName } = logger;
    printName('Sam'); // TypeError: Cannot read property 'print' of undefined
  }
}

{
  //getter & setter
  class MyClass {
    constructor() {
      // ...
    }
    get prop() {
      return 'getter';
    }
    set prop(value) {
      console.log('setter: '+value);
    }
  }

  let inst = new MyClass();
  inst.prop = 123; // setter: 123
  console.log(inst.prop); // 'getter'

  //get 和 set 是设置在属性的描述符中的
  let descriptor = Object.getOwnPropertyDescriptor(
    MyClass.prototype, "prop"
  );
  console.log("get" in descriptor)  // true
  console.log("set" in descriptor)  // true
  console.log(...util.objectEntries(descriptor))
}

{
  //类的generator方法
  class Foo {
    constructor(...args) {
      this.args = args;
    }
    * [Symbol.iterator]() {
      for (let arg of this.args) {
        yield arg;
      }
    }
  }
  console.log(...new Foo('hello', 'world'));
}

{
  //类的静态方法
  class Foo {
    static classMethod() {
      console.log('classMethod');
    }
  }

  Foo.classMethod() // 'hello'

  //静态方法不能在实例中调用
  let foo = new Foo();
  //foo.classMethod() // TypeError: foo.classMethod is not a function


  class Bar extends Foo {
    //静态方法可以重载
    static classMethod() {
      super.classMethod();
      console.log("overrided");
    }
  }
  //静态方法可以被继承
  Bar.classMethod() // 'hello'
}

{
  //ES6 明确规定，Class 内部只有静态方法，没有静态属性
  class Foo {
    // 以下两种写法都不对
    //prop: 2,
    //static prop: 2
  }
  //静态属性只能采用以下写法
  //不过有一个提案,对实例属性和静态属性都规定了新的写法。
  Foo.prop = 1;

}

{
  //如果构造函数不是通过new命令调用的，new.target会返回undefined
  function Person(name) {
    if (new.target !== undefined) {
      this.name = name;
    } else {
      throw new Error('必须使用new生成实例');
    }
  }

  // 另一种写法
  //使用new调用, new.target返回当前Function
  function Person(name) {
    if (new.target === Person) {
      this.name = name;
    } else {
      throw new Error('必须使用 new 生成实例');
    }
  }

  new Person('张三'); // 正确
  //Person.call(person, '张三');  // 报错
}

{
  //Class 内部调用new.target，返回当前 Class。
  class Rectangle {
    constructor(length, width) {
      console.log(new.target === Rectangle);
      this.length = length;
      this.width = width;
    }
  }
  new Rectangle(3, 4); // 输出 true

  //子类继承父类时，new.target会返回子类
  class Square extends Rectangle {
    constructor(length) {
      super(length, length);
      console.log(new.target === Square); //true
    }
  }

  new Square(3); // 输出 false

  //利用这个特性,可以写出抽象类(不允许创建实例)
  class Shape {
    constructor() {
      if (new.target === Shape) {
        throw new Error('本类不能实例化');
      }
    }
  }

  class Rectangle1 extends Shape {
    constructor(length, width) {
      super();
      console.log('new Rectangle1');
    }
  }

  //new Shape();  // 报错
  new Rectangle1(3, 4);  // 正确
}

{
  //类的继承
  class Point { /* ... */ }
  class ColorPoint extends Point {
    constructor(x, y, color) { //如果不定义构造方法,会生成默认的构造方法
      super(x, y); // 调用父类的constructor(x, y) 新建父类的this对象。
      //如果不调用super方法，子类就得不到this对象。以下语句会报错:ReferenceError: this is not defined
      this.color = color; //子类没有自己的this对象，而是继承父类的this对象，然后对其进行加工
    }

    toString() {
      return this.color + ' ' + super.toString(); // 调用父类的toString()
    }
  }

  //可以使用这个方法判断，一个类是否继承了另一个类
  console.log(Object.getPrototypeOf(ColorPoint) === Point);//true
}

{
  //super的用法
  class A {
    constructor() {
      this.x = 5;
      console.log(new.target.name);
    }
    p() {
      return 2;
    }
    print() {
      console.log(this.x);
    }
  }
  A.prototype.y = 3; //静态属性

  class B extends A {
    constructor() {
      //super作为函数调用(只能在构造函数中使用)，代表父类的构造函数,但super内部的this指的是B
      super(); //相当于:A.prototype.constructor.call(this)
      console.log(super.p()); //2
      this.x = 4;
      //使用super的时候，必须显式指定是作为函数、还是作为对象使用，否则会报错
      //console.log(Object.objectEntries(super)); // 语法错误,此处不允许调用super
    }
    method(){
      //super作为对象使用,在普通方法之中，指向A.prototype
      console.log(super.p()); //2
      console.log(super.x); // undefined
      super.z = 6; //此处super代表this
      console.log(super.z); // undefined
      console.log(this.z); // 6
      console.log(super.y); // 3
      console.log(this.y); // 3
    }
    get m() {
      console.log(super.x); // undefined
      console.log(super.y); // 3
      return super.p();
    }
    print () {
      super.print(); //会绑定子类B的this,相当于:super.print.call(this)
    }
  }
  new A() // A
  let b = new B() // B
  b.method();
  console.log(b.m); //2
  b.print(); //4
}
{
  //super在静态方法之中指向父类，在普通方法之中指向父类的原型对象
  class Parent {
    static myMethod(msg) {
      console.log('parent static', msg);
    }

    myMethod(msg) {
      console.log('parent instance', msg);
    }
  }

  class Child extends Parent {
    static myMethod(msg) {
      super.myMethod(msg); //super指向父类
    }

    myMethod(msg) {
      super.myMethod(msg);//super指向父类的prototype
    }
  }

  Child.myMethod(1); // parent static 1

  let child = new Child();
  child.myMethod(2); // parent instance 2
}

{
  //可以在任意一个对象中，使用super关键字。
  let obj = {
    toString() {
      return "MyObject: " + super.toString();
    }
  };

  console.log(obj.toString()); // MyObject: [object Object]
}

{
  //作为一个对象，子类（B）的原型（__proto__属性）是父类（A）；
  // 作为一个构造函数，子类（B）的原型（prototype属性）是父类的实例。
  class A {
  }

  class B extends A {
  }

  //父类的__proto__是Function类的prototype
  console.log(A.__proto__ == Function.prototype);
  //子类的__proto__是其父类,代表构造函数的继承
  console.log(B.__proto__ === A); // true

  //父类的prototype是一个空对象,其__proto__是Object.prototype
  console.log(A.prototype); //A {}
  console.log(A.prototype.__proto__ === {}.__proto__ ); //Object.prototype

  //子类的prototype是一个空对象,其__proto__是父类的prototype
  console.log(B.prototype); //B {}
  console.log(B.prototype.__proto__=== A.prototype); // true
  console.log(B.prototype instanceof A); //true

  //对象没有prototype
  console.log(new B().prototype); //undefined

  //父对象的__proto__是父类的prototype
  console.log(new A().__proto__ === A.prototype); //true

  //子对象的__proto__是子类的prototype
  console.log(new B().__proto__ === B.prototype); //true

  //父类的prototype与子类的prototype不同
  console.log(A.prototype === B.prototype); //false
}

{
  //只要是有prototype属性的函数，就能被继承。函数都有prototype属性（除了Function.prototype函数）
  //A可以是任意函数。
  let A = function() {};
  // A.prototype = {};
  class B extends A { }
}

{
  //A继承Object类,
  class A extends Object {
  }
  //A的实例就是Object的实例
  console.log(A.__proto__ === Object); // true
  console.log(A.prototype.__proto__ === Object.prototype); // true
}

{
  //A不存在继承,就是一个普通函数,所以直接继承Function.prototype
  class A {
  }

  console.log(A.__proto__ === Function.prototype);  // true
  console.log(A.prototype.__proto__ === Object.prototype);  // true
}

{
  class A extends null { }
  console.log(A.__proto__ === Function.prototype);  // true
  console.log(A.prototype.__proto__ === undefined);  // true
}

{
  //ES6 允许继承原生构造函数定义子类, ES5不可以
  //因为ES5是先创建子类的this,再用父类的this属性,修改子类this属性,而有些父类的内部属性此时无法获取
  //而ES6是线创建父类的this,然后对子类的this属性进行修改
  {
    //ES5
    function MyArray() {
      Array.apply(this, arguments);
    }

    MyArray.prototype = Object.create(Array.prototype, {
      constructor: {
        value: MyArray,
        writable: true,
        configurable: true,
        enumerable: true
      }
    });

    let colors = new MyArray();
    colors[0] = "red";
    console.log(colors.length)  // 0 与原始数组对象表现不一致

    colors.length = 0;
    console.log(colors[0])  // "red"
  }

  {
    class MyArray extends Array {
      constructor(...args) {
        super(...args);
      }
    }

    let arr = new MyArray();
    arr[0] = 12;
    console.log(arr.length) // 1

    arr.length = 0;
    console.log(arr[0]) // undefined 与原始数组对象表现一致
  }
}

{
  //应用:集成内部类
  class VersionedArray extends Array {
    constructor() {
      super();
      this.history = [[]];
    }
    commit() {
      this.history.push(this.slice());
    }
    revert() {
      this.splice(0, this.length, ...this.history[this.history.length - 1]);
    }
  }

  let x = new VersionedArray();

  x.push(1);
  x.push(2);
  console.log(x); // [1, 2]
  console.log(x.history); // [[]]

  x.commit();
  console.log(x.history); // [[], [1, 2]]

  x.push(3);
  console.log(x); // [1, 2, 3]
  console.log(x.history); // [[], [1, 2]]

  x.revert();
  console.log(x); // [1, 2]
}

{
  //注意: 直接继承Object无法向父类传参
  class NewObj extends Object{
    constructor(){
      super(...arguments);
    }
  }
  let o = new NewObj({attr: true});
  console.log(o.attr === true);  // false

  let o1 = new Object({attr: true}); //通过new Object的方式可以传参
  console.log(o1.attr === true);  // true
}

{
  class A {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    a (){console.log('A');}
  }

  class B {
    constructor(z) {
      this.z = z;
    }
    b (){console.log('B');}
  }

  //mixin模式:将多个类的接口“混入”（mix in）另一个类
  function mix(...mixins) {
    class Mix {}

    for (let mixin of mixins) {
      copyProperties(Mix, mixin);
      copyProperties(Mix.prototype, mixin.prototype);
    }

    return Mix;
  }

  function copyProperties(target, source) {
    for (let key of Reflect.ownKeys(source)) {
      if ( key !== "constructor"
        && key !== "prototype"
        && key !== "name"
      ) {
        let desc = Object.getOwnPropertyDescriptor(source, key);
        Object.defineProperty(target, key, desc);
      }
    }
  }

  class MixAB extends mix(A, B) {  }

  let mab = new MixAB('d');
  // mab.a();
  // mab.b();

  Object.getOwnPropertyNames(MixAB).sort().forEach(function (val) {console.log(val)});

  //console.log(Reflect.ownKeys(mab));

}


