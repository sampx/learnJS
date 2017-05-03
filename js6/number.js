{
  console.log(Number.isFinite(25)); // true
  console.log(Number.isFinite("25")); // false

  console.log(Number.isNaN(NaN)); // true
  console.log(Number.isNaN("NaN")); // false
  console.log(Number.isNaN(1)); // false

  console.log(Number.parseInt('12.34')); // 12
  console.log(Number.parseFloat('123.45#')); // 123.45

  console.log(Number.isInteger(25)); // true
  console.log(Number.isInteger(25.0)); // true
  console.log(Number.isInteger(25.1)); // false
  console.log(Number.isInteger("15")); // false
  console.log(Number.isInteger(true)); // false
  console.log('================');
}

{
  //极小值
  console.log(Number.EPSILON); // 2.220446049250313e-16
  console.log(Number.EPSILON.toFixed(20));  // '0.00000000000000022204'
  console.log(0.1 + 0.2);       // 0.30000000000000004
  console.log(0.1 + 0.2 - 0.3);    // 5.551115123125783e-17
  console.log(5.551115123125783e-17.toFixed(20));    // '0.00000000000000005551'
  //用来判断误差是不是在可接受的范围内
  function withinErrorMargin(left, right){
    return Math.abs(left - right) < Number.EPSILON;
  }

  console.log(withinErrorMargin(0.1 + 0.2, 0.3)); // true
  console.log(withinErrorMargin(0.2 + 0.2, 0.3)); // false
}

{
  //安全整数,JavaScript能够准确表示的整数范围在-2^53到2^53之间（不含两个端点）
  console.log(Math.pow(2, 53)); // 9007199254740992
  console.log(9007199254740992);  // 9007199254740992
  console.log(9007199254740993);  // 9007199254740992
  console.log(Math.pow(2, 53) === Math.pow(2, 53) + 1);

  console.log(Number.MAX_SAFE_INTEGER === Math.pow(2, 53) - 1); // true
  console.log(Number.MAX_SAFE_INTEGER === 9007199254740991); // true
  console.log(Number.MIN_SAFE_INTEGER === -Number.MAX_SAFE_INTEGER); // true
  console.log(Number.MIN_SAFE_INTEGER === -9007199254740991); // true

  console.log(Number.isSafeInteger('a')); // false
  console.log(Number.isSafeInteger(null)); // false
  console.log(Number.isSafeInteger(NaN)); // false
  console.log(Number.isSafeInteger(Infinity)); // false
  console.log(Number.isSafeInteger(-Infinity)); // false
  console.log(Number.isSafeInteger(3)); // true
  console.log(Number.isSafeInteger(1.2)); // false
  console.log(Number.isSafeInteger(9007199254740990)); // true
  console.log(Number.isSafeInteger(9007199254740992)); // false
  console.log(Number.isSafeInteger(Number.MIN_SAFE_INTEGER - 1)); // false
  console.log(Number.isSafeInteger(Number.MIN_SAFE_INTEGER)); // true
  console.log(Number.isSafeInteger(Number.MAX_SAFE_INTEGER)); // true
  console.log(Number.isSafeInteger(Number.MAX_SAFE_INTEGER + 1)); // false

}