var _ = require('lodash');

var users = {
  fred: { user: 'fred', age: 40 },
  pebbles: { user: 'pebbles', age: 1 }
};

console.log(
  'result:',
  _.mapValues(users, function(v, k, o) {
    console.log('value:', v);
    console.log('key:', k);
    console.log('obj:', o);
    return v.age;
  })
);
// => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)

// The `_.property` iteratee shorthand.
console.log(_.mapValues(users, 'age'));
// => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
