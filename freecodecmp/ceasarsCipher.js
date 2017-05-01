function rot13(str) { // LBH QVQ VG!
  var n;
  var arr = [];
  str = str.toUpperCase();
  for (var i = 0; i < str.length; i++) {
    n = str.charCodeAt(i);
    if ((n >= 65 && n <= 90)) {
      if (n < 65 + 13) {
        n += 13;
      } else {
        n -= 13;
      }
    }
    arr.push(n);
  }
  return arr.map(function (val) {
    return String.fromCharCode(val);
  }).join("");
}

// Change the inputs below to test
console.log(rot13("SERR PBQR PNZC"));
