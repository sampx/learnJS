function confirmEnding1(str, target) {

  var re = new RegExp(target + '\$', 'i');
  return re.test(str);
}

console.log(confirmEnding("He has to give me a new name", "aME"));

function confirmEnding(str, target) {
  var s1 = str.substr(str.length - target.length);
  //console.log(s1);
  return s1.toUpperCase() == target.toUpperCase();
}
