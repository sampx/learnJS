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
}


{
  let obj = {
    * m(){ //*号代表是Generator函数
      yield 'hello ';
      yield 'world';
    }
  };
  // console.log(obj.m());
  // console.log(obj.m());
}