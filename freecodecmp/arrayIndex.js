function getIndexToIns(arr, num) {
  // Find my place in this sorted array.
  arr.push(num);
  arr.sort(function (a, b) {
    return a - b;
  });
  console.log(arr);
  return arr.lastIndexOf(num);
}

console.log(getIndexToIns([5, 3, 20, 3], 5));
