
const autobind = require('core-decorators');

{
  //@testable
  class MyTestableClass {
    // ...
  }

  function testable(target) {
    target.isTestable = true;
  }

  console.log(MyTestableClass.isTestable); // true
}

{
  //使用高阶函数,修饰函数
  function doSomething(name) {
    console.log('Hello, ' + name);
  }

  function loggingDecorator(wrapped) {
    return function() {
      console.log('Starting');
      const result = wrapped.apply(this, arguments);
      console.log('Finished');
      return result;
    }
  }

  const wrapped = loggingDecorator(doSomething);
  wrapped('Sam');
}

{
  class Person {
    @autobind
    getPerson() {
      return this;
    }
  }

  let person = new Person();
  let getPerson = person.getPerson;
  console.log(getPerson() === person);
}


