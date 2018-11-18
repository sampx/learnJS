var _ = require('lodash');

function greet(greeting, name) {
  return greeting + ' ' + name;
}

//做函数柯里化
var sayHelloTo = _.partial(greet, 'hello');
console.log(sayHelloTo('fred'));
// => 'hello fred'

// Partially applied with placeholders.
var greetFred = _.partial(greet, _, 'fred');
console.log(greetFred('hi'));
// => 'hi fred'

function morningTo(name) {
  return 'Good morning ' + name;
}

var wordsToSam = _.partial(morningTo, 'Sam');
console.log(wordsToSam());
