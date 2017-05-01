function largestOfFour(arr) {
  // You can do this!
  var a = arr;
  a.map(function (val) {
    val.sort(function (a, b) {
      return a - b;
    });
  });

  return a.map(function (val) {
    //console.log(val[3]);
    return val[val.length - 1];
  });

}

var result = largestOfFour([
  [13, 27, 18, 26],
  [4, 5, 1, 3],
  [32, 35, 37, 39],
  [1000, 1001, 857, 1]
]);

console.log(result);
