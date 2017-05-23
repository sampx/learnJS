var log = require('../fm-utils/fm-logger.js');

{
  //Set
  let s = new Set();
  [2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));
  //Set不包含重复值
  for (let i of s) {
    log.l(i);
  }

  s = new Set([1, 2, 3, 4, 4]);
  log.l(...s); //1 2 3 4
  log.l(s.size);//4

  s.add({}).add({}); //对象总是不相等的
  log.l(s.size);//6
  s.add(Boolean(true)).add(new Boolean(false)).add(true);//转换为原始值
  s.add({x:1}).add(new String('abc')).add(new Boolean(false));

  s.add(NaN).add(NaN);//NaN被认为相等,注意:===不认为NaN相等
  log.l(s.size);//7
  log.l(...s);
  log.l(s.has({}));//false
  log.l(s.has(NaN));//true
  s.delete(NaN);
  log.l(...s);
  log.l(s.delete({}));//空对象无法删除
  log.l(...s);

  for(let x of s){
    log.l(x instanceof Object);
    if(x instanceof Object && [...Object.entries(x)].length === 0){ //删除空对象 todo:如何判断Boolean
      // log.l(x);
      s.delete(x);
    }
  }
  log.l(...s);
  //应用:求并集,交集和差集
  let a = new Set([1, 2, 3]);
  let b = new Set([4, 3, 2]);

  // 并集
  let union = new Set([...a, ...b]);
  log.l(union);// Set {1, 2, 3, 4}

  // 交集
  let intersect = new Set([...a].filter(x => b.has(x)));
  log.l(intersect);// set {2, 3}

  // 差集
  let difference = new Set([...a].filter(x => !b.has(x)));
  log.l(difference)// Set {1}
}

{
  //WeakSet 成员只能是对象
  //WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，
  //也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中
  const a = [[1, 2], [3, 4]];
  const ws = new WeakSet(a);
  log.l(ws);
  const b = [3, 4];
  //ws = new WeakSet(b); //错误,虽然b是数组对象,但将数组传入构造WeakSet实际传的是数组的值
  ws.add(this);
  log.l(ws.has(this));//WeakSet没有size属性，没有办法遍历它的成员。

  //应用
  const foos = new WeakSet()
  class Foo {
    constructor() {
      foos.add(this)
    }
    method () {
      log.l('I am been invoked!');
      if (!foos.has(this)) {
        throw new TypeError('Foo.prototype.method 只能在Foo的实例上调用！');
      }
    }
  }
  let f = f1 = new Foo();
  f = null;
  log.l(foos.has(f1));
  f1.method();
  foos.delete(f1);
  //f1.method(); TypeError
}

{
  log.l('===========');
  //map Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键
  let m = new Map();
  const o = {p: 'Hello World'};

  m.set(o, 'content');
  log.l(m.get(o)); // "content"

  log.l(m.has(o)); // true
  log.l(...m.keys()); //{ p: 'Hello World' }
  log.l(m.delete(o)); // true
  log.l(m.has(o)); // false

  //用数组构造
  let map = new Map([
            ['name', '张三'],
            ['title', 'Author']
          ]);
  log.l(map.size) // 2
  log.l(map.has('name')) // true
  log.l(map.get('name')) // "张三"
  log.l(map.has('title')) // true
  log.l(map.get('title')) // "Author"

  map.set(-0, 123);
  log.l(map.get(+0)) // 123

  map.set(true, 1);
  map.set('true', 2);
  log.l(map.get(true)) // 1
  log.l(map.get('true'))//2

  map.set(undefined, 3);
  map.set(null, 4);
  log.l(map.get(undefined)) // 3
  log.l(map.get(null));//4

  map.set(NaN, 123);
  log.l(map.get(NaN)) // 123
}