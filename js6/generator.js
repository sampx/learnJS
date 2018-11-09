{
  function* helloWorldGenerator(){
    yield 'hello';
    yield 'world';
    yield 123 + 456;
    return 'ending';
  }

  let hw = helloWorldGenerator();

  console.log(hw.next());   //{ value: 'hello', done: false }
  console.log(hw.next());   //{ value: 'world', done: false }
  console.log(hw.next());   //{ value: 'ending', done: true }
  console.log(hw.next());   //{ value: undefined, done: true }

  for(let val of hw){
    console.log(val);
  }
}
{
  function* f(){
    console.log('执行了！')
  }

  let generator = f(); //只会在调用next方法时执行函数

  setTimeout(function(){
    f().next()
  }, 200);
}

{
  let arr = [1, [[2, 3], 4], [5, 6]];

  let flat = function*(a){
    for(let i = 0; i < a.length; i++){
      let item = a[i];
      if(typeof item !== 'number'){
        yield* flat(item);
      }else{
        yield item;
      }
    }
  };
  console.log(...flat(arr));
}

{
  let g1 = function*() {
    //console.log('Hello' + yield); // SyntaxError
    //console.log('Hello' + yield 123); // SyntaxError
    console.log('g1 Hello ' + (yield)); // OK
    console.log('g1 Hello1 ' + (yield 123)); // OK
  }

  let demo = g1();
  // console.log(...demo);
  //
  // demo = g1();
  console.log('g1'+JSON.stringify(demo.next()));
  console.log('g1'+JSON.stringify(demo.next('Sam')));
  console.log('g1'+JSON.stringify(demo.next('ok')));

  let g2 = function *() {
    foo(yield 'a', yield 'b'); //不会传值,调用两次next方法后才执行foo函数
    let input = yield 2+3; //不会赋值
    console.log('g2 input='+input);
  }

  let foo = (v,v1)=>{
    console.log('in foo',v+v1);
  };

  demo = g2();
  // console.log(...demo);
  //
  // demo = g2();
  console.log('g2'+JSON.stringify(demo.next(7777))); //{ value: 'a', done: false }
  console.log('g2'+JSON.stringify(demo.next(9999))); //{ value: 'b', done: false }
  console.log('g2'+JSON.stringify(demo.next(8888))); //{ value: undefined, done: false }
  console.log('g2'+JSON.stringify(demo.next(6))); //input=undefined  { value: undefined, done: true }
}

{
  //由于 Generator 函数就是遍历器生成函数，因此可以把 Generator
  // 赋值给对象的Symbol.iterator属性，从而使得该对象具有 Iterator 接口。
  let myIterable = {};
  myIterable[Symbol.iterator] = function* () {
    yield 1;
    yield 2;
    yield 3;
  };
  console.log([...myIterable]) // [1, 2, 3]
}

{
  function* f() {
    for(let i = 0; true; i++) {
      let reset = yield i;
      if(reset) { i = -1; }
    }
  }

  let g = f();

  console.log(g.next()) // { value: 0, done: false }
  console.log(g.next()) // { value: 1, done: false }
  console.log(g.next(true)) // { value: 0, done: false }
  console.log(g.next()) // { value: 0, done: false }
  console.log(g.next()) // { value: 1, done: false }
  console.log(g.next()) // { value: 0, done: false }
  console.log(g.next()) // { value: 1, done: false }
}

{
  //第一个next方法用来启动遍历器对象，所以不用带有参数。
  //如果想要第一次调用next方法时，就能够输入值，可以在 Generator 函数外面再包一层
  function wrapper(generatorFunction) {
    return function (...args) {
      let generatorObject = generatorFunction(...args);
      generatorObject.next();
      return generatorObject;
    };
  }

  const wrapped = wrapper(function* () {
    console.log(`First input: ${yield}`);
    return 'DONE';
  });

  let ret = wrapped().next('hello!') //First input: hello!
  console.log(ret);
}

{
  function* dataConsumer() {
    console.log('Started');
    console.log(`1. ${yield}`);
    console.log(`2. ${yield}`);
    return 'result';
  }

  let genObj = dataConsumer();
  genObj.next(); //started
  genObj.next('a') // 1. a
  genObj.next('b') // 2. b
}

{
  function *foo() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
    return 6; //不包含在for of 循环内
  }

  for (let v of foo()) {
    console.log(v);
  }
}

{
  //应用
  function* fibonacci(max) {
    let [prev, curr] = [0, 1];
    for (;prev+curr < max;) {
      [prev, curr] = [curr, prev + curr];
      yield curr;
    }
  }

  // for (let n of fibonacci(1000)) {
    console.log(...fibonacci(10000));
  // }
}

{
  function* objectEntries(obj) {
    let propKeys = Reflect.ownKeys(obj);

    for (let propKey of propKeys) {
      yield [propKey, obj[propKey]];
    }
  }

  let jane = { first: 'Jane', last: 'Doe' };

  // for (let [key, value] of objectEntries(jane)) {
  //   console.log(key.toString() +':'+ value);
  // }
  console.log(...objectEntries(jane));

}

{
  function* objectEntries() {
    let propKeys = Object.keys(this);

    for (let propKey of propKeys) {
      yield [propKey, this[propKey]];
    }
  }

  let jane = { first: 'Jane', last: 'Doe' };

  jane[Symbol.iterator] = objectEntries;

  // for (let [key, value] of jane) {
  //   console.log(`${key}: ${value}`);
  // }
  console.log(...jane);
}

{
  let g = function* () {
    try {
      yield new Error('yield a Error！');//不会被捕获
    } catch (e) {
      console.log('内部捕获',e.message);
    }
  };

  try {
    let i = g(); //获取iterator
    console.log(i.next().value.toString()); //Error: yield a Error！
    i.throw(new Error('出错了！')); //只要指针还在generator函数内部,异常就能被内部catch块捕获
    i.throw('b');
    i.throw('c'); //不会被执行
  } catch (e) {
    console.log('外部捕获', e);
  }

  try {
    throw new Error('a');
    throw new Error('b'); //不会被执行
  } catch (e) {
    console.log('外部捕获', e.message);
  }
}

{
  let gen = function* gen(){
    try {
      yield console.log('a');
    } catch (e) {
          console.error('捕获',e.message);
    }
    yield console.log('b');
    yield console.log('c');
  }

  let g = gen();
  g.next() // a
  g.throw(new Error('Something Error')) // b 执行第二个yield
  g.next() // c
}

console.log('==================');

{
  function* foo() {
    try{
      let x = yield 3;
      let y = x.toUpperCase();
      yield y;
    } catch(err){
      console.log('catched in generator:'+err.toString());
    }
  }

  let it = foo();

  try {
    it.next(); // { value:3, done:false }
    it.next(42);
  } catch (err) {
    console.error(err.message);
  }
}
{
  function* numbers () {
    yield 1;
    try {
      yield 2;
      yield 3;
    } finally {
      yield 4;
      yield 5;
    }
    yield 6;
  }
  var g = numbers();
  console.log(g.next()); // { value: 1, done: false }
  console.log(g.next()); // { value: 2, done: false }
  console.log(g.return(7)); // { value: 4, done: false }
  console.log(g.next()); // { value: 5, done: false }
  console.log(g.next()); // { value: 7, done: true }
}

{
  function* foo() {
    yield 'a';
    yield 'b';
  }

  function* bar() {
    yield 'x';
    foo(); //不生效,无法从一个generator内部调用另外一个generator函数
    yield* foo(); //a,b
    yield 'y';
  }

  for (let v of bar()){
    console.log(v);
  }
}

{
  function* genFuncWithReturn() {
    yield 'a';
    yield 'b';
    return 'The result';
  }
  function* logReturned(genObj) {
    let result = yield* genObj;
    console.log(result);
  }

  console.log([...logReturned(genFuncWithReturn())]);
}

{
  //应用:二叉树遍历
  // 下面是二叉树的构造函数，
  // 三个参数分别是左树、当前节点和右树
  function Tree(left, label, right) {
    this.left = left;
    this.label = label;
    this.right = right;
  }

  // 下面是中序（inorder）遍历函数。
  // 由于返回的是一个遍历器，所以要用generator函数。
  // 函数体内采用递归算法，所以左树和右树要用yield*遍历
  function* inorder(t) {
    if (t) {
      yield* inorder(t.left);
      yield t.label;
      yield* inorder(t.right);
    }
  }

  // 下面生成二叉树
  function make(array) {
    // 判断是否为叶节点
    if (array.length == 1) return new Tree(null, array[0], null);
    return new Tree(make(array[0]), array[1], make(array[2]));
  }
  let tree = make([[['a'], 'b', ['c']], 'd', [['e'], 'f', ['g']]]);

  // 遍历二叉树
  var result = [];
  for (let node of inorder(tree)) {
    result.push(node);
  }

  console.log(result );
}

{
  //让 Generator 函数返回一个正常的对象实例，既可以用next方法，又可以获得正常的this
  function* F() {
    this.a = 1;
    yield this.b = 2;
    yield this.c = 3;
  }
  //let obj = {};
  let f = F.call(F.prototype);

  console.log(f.next());  // Object {value: 2, done: false}
  console.log(f.next());  // Object {value: 3, done: false}
  console.log(f.next());  // Object {value: undefined, done: true}

  console.log(f.a) // 1
  console.log(f.b) // 2
  console.log(f.c) // 3
}

{
  function* gen(x) {
    x++;
    let y = yield x + 2;
    console.log(y); //undefined
    return 10;
  }

  let g = gen(1);
  console.log(g.next()); // { value: 4, done: false }
  console.log(g.next()); // { value: 10, done: false }
}

{
  let fetch = require('node-fetch');

  function* gen(){
    let url = 'https://api.github.com/users/github';
    let result = yield fetch(url);
    console.log(JSON.stringify(result));
  }

  let g = gen();
  let result = g.next();

  result.value.then(function(data){
    return data.json();
  }).then(function(data){
    g.next(data);
  });
}
