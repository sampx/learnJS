var log = require('../fm-utils/fm-logger.js');

var sum = [0, 1, 2, 3].reduce(function(acc, val) {
  log.l(acc,val);
  return acc + val;
}, 0);
log.l(sum);// sum is 6[0 0->0 1->1 2->3 3]

var list1 = [[0, 1], [2, 3], [4, 5]];
var list2 = [0, [1, [2, [3, [4, [5]]]]]];

const flatten = arr => arr.reduce(
  (acc, val) => {
    log.l(acc,val);
    return acc.concat(Array.isArray(val) ? flatten(val) : val );
  },
  []
);
log.l(flatten(list1)); // returns [0, 1, 2, 3, 4, 5]
log.l(flatten(list2)); // returns [0, 1, 2, 3, 4, 5]