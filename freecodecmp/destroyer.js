function destroyer(arr) {

  var args = Array.from(arguments).slice(1);

  var filtered = arr.filter(function (el) {
    return args.indexOf(el) == -1;
  });

  return filtered;
}

var a = destroyer([1, 2, 3, 1, 2, 3], 2, 3);

console.log(a);
