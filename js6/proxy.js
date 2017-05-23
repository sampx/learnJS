var log = require('../fm-utils/fm-logger.js');
{
  let obj = new Proxy({}, {
    get: function(target, key, receiver) {
      console.log(`getting ${key}!`);
      return Reflect.get(target, key, receiver);
    },
    set: function(target, key, value, receiver) {
      console.log(`setting ${key}!`);
      return Reflect.set(target, key, value, receiver);
    }
  });

  log.l(obj.count = 1) //  setting count! //1
  log.l(++obj.count) //  getting count!   setting count! //  2
}

{
  let proxy = new Proxy({}, {
    get: function(target, property) { //代理了这个对象的所有属性获取操作
      log.l(target, property);
      return 35;
    }
  });
  // log.l(proxy.time) // 35
  // log.l(proxy.name) // 35
  // log.l(proxy.title) // 35

  //proxy作为原型
  let obj = Object.create(proxy);
  log.d(obj);
  // log.l(obj.time) // 35
}

{
  let handler = {
    get: function(target, name) {
      if (name === 'prototype') {
        return Object.prototype;
      }
      return 'Hello, ' + name;
    },

    set: function(target, name, value) {
      log.l(`setting ${name}!`);
      target[name] = value;
    },

    apply: function(target, thisBinding, args) {
      return args[0];
    },
    construct: function(target, args) {
      log.l('constructing ' + target.name);
      return {value: args[1]};
    }
  };

  let target = function(x, y) {
    log.l('in target function', x, y);
    return x + y;
  }

  //function proxy
  let fproxy = new Proxy(target, handler);

  log.l(fproxy(1, 2)); //1 调用handler apply方法
  log.l(fproxy.sam); //Hello, sam 调用handler get方法
  log.l(new fproxy(1, 3)); // 3 调用handler construct方法

  handler.apply = function(target, thisBinding, args) {
    log.l('apply function args=' + args);
    let rst = target.call(thisBinding, ...args);
    log.l('after function apply');
    return rst;
  };

  log.l(fproxy(1, 2)); //3

  //对象proxy
  let foo = Object.create(new Proxy({}, handler));
  foo.n = 1; //调用handler set方法
  handler.get = function(target, name, receiver) {
    if (name in target && typeof name === 'string') {
      log.l(`getting ${name}!`);
    }
    return Reflect.get(target, name, receiver);
  }
  log.l(foo.n);
  log.l(foo.__proto__);

  class Foo_proto {
    constructor() {
      this.a = 'a';
    }
  }

  let Foo = new Proxy(Foo_proto, handler);

  Foo.prototype.sayHello = function() {
    console.log('hello');
  }

  handler.construct = function(target, args) {
    log.l('constructing ' + target.name);
    return Reflect.construct(target, args);
  }
  handler.get = function(target, name, receiver) {
    return Reflect.get(target, name, receiver);
  }

  let f = new Foo();
  f.sayHello();
  log.l(f.constructor); //proxy中的target对象 Foo_proto
  log.l(f.__proto__ === Foo_proto.prototype); //true
  log.l(f instanceof Foo); //true
  log.l(Foo.prototype === Foo_proto.prototype); //true
  log.l(Foo.__proto__); //Function
  log.l(Function.__proto__); //Function
  log.l(Function.prototype.__proto__); //{}
  log.l(Foo.prototype.constructor); //Foo_proto
}

{
  //get 拦截 数组 实现负值索引获取元素
  function createArray(...elements) {
    let handler = {
      get(target, propKey, receiver) {
        let index = Number(propKey);
        if (index < 0) {
          propKey = String(target.length + index);
        }
        return Reflect.get(target, propKey, receiver);
      }
    };

    let target = [];
    target.push(...elements);
    return new Proxy(target, handler);
  }

  let arr = createArray('a', 'b', 'c');
  log.l(arr[-1]) // c
}

{
  //实现链式调用
  let pipe = function(value) {
    let funcStack = [];
    let oproxy = new Proxy({}, {
      get: function(pipeObject, fnName) {
        if (fnName === 'get') {
          return funcStack.reduce(function(val, fn) {
            return fn(val);
          }, value);
        }
        funcStack.push(eval(fnName));
        return oproxy;
      }
    });
    return oproxy;
  }

  var double = n => n * 2;
  var pow = n => n * n;
  var reverseInt = n => n.toString().split("").reverse().join("") | 0;

  log.l(pipe(32).double.pow.reverseInt.get); // 63
  //log.l(eval('double'));
}

{
  //注意:如果属性不可配置和不可写,则无法代理
  const target = Object.defineProperties({}, {
    foo: {
      value: 123,
      writable: false,
      configurable: true
    }
  });

  const handler = {
    get(target, propKey) {
      return 'abc';
    }
  };

  const proxy = new Proxy(target, handler);

  log.l(proxy.foo) // TypeError: Invariant check failed

}

{
  //设置_开头的变量不能被外部使用
  let handler = {
    get(target, key) {
      if (keyValid(key, 'get'))
        return Reflect.get(target, key);
      }
    ,
    set(target, key, value) {
      if (keyValid(key, 'set')) {
        target[key] = value;
        return true;
      }
    },
    has(target, key) { //属性必须可配置,而且对象可扩展
      if (!keyValid(key, 'HasProperty')) { //只拦截HasProperty操作,而不是HasPropertyOwn操作
        return false;
      }
      return key in target;
    },
    //注意，如果目标对象不可扩展（extensible），则defineProperty不能增加目标对象上不存在的属性，否则会报错。另外，如果目标对象的某个属性不可写（writable）或不可配置（configurable），则defineProperty方法不得改变这两个设置。
    defineProperty(target, key, descriptor) { //不允许新添加属性
      log.w("Not allowed to add new property!");
      return false;
    },
    getOwnPropertyDescriptor(target, key) {
      if (!keyValid(key, 'getOwnPropertyDescriptor')) {
        return;
      }
      return Object.getOwnPropertyDescriptor(target, key);
    },
    ownKeys(target) {
      return Reflect.ownKeys(target).filter(key => key[0] !== '_');
    }
  };
  function keyValid(key, action) {
    if (key[0] === '_') {
      log.w(`Invalid attempt to ${action} private "${key}" property`);
      return false;
      //throw new Error(`Invalid attempt to ${action} private "${key}" property`);
    }
    return true;
  }
  let target = {
    who: 'me',
    _prop: 'a',
    are: 'you'
  };
  let proxy = new Proxy(target, handler);
  log.l(proxy.who);
  proxy._prop = 'c' //warn: Invalid attempt to get private "_prop" property
  log.l(proxy._prop) //undefined warn: Invalid attempt to get private "_prop" property
  for (let x in proxy)
    log.l(x); //不生效
  log.l('_prop' in proxy) //false 被拦截
  proxy.xx = 'xx'; //没生效
  //log.l(proxy);
  Object.getOwnPropertyDescriptor(proxy, '_prop')
  for (let key of Object.keys(proxy)) {
    console.log(target[key]);
  }
}

{
  //应用:用proxy和Reflect实现观察者模式
  const queuedObservers = new Set();

  const observe = fn => queuedObservers.add(fn);
  const observable = obj => new Proxy(obj, {set});

  function set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver);
    queuedObservers.forEach(observer => observer());
    return result;
  }

  const person = observable({name: '张三', age: 20});

  function print() {
    console.log(`${person.name}, ${person.age}`)
  }

  observe(print);
  person.name = '李四';
}
