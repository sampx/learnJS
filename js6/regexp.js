{
  //正则表达式定义
  let regex = new RegExp(/xyz/i);
  // 等价于
  regex = /xyz/i;
  // 等价于
  regex = new RegExp(/xyz/i);
  // 等价于
  regex = /xyz/i;
  // 等价于
  regex = new RegExp(/xyz/ig, 'i');
  //第一个参数的修饰符被第二个参数覆盖
  console.log(regex.flags); //i
}

{
  //String的正则方法，都是直接调用Regexp的对应函数
  console.log('String.prototype.match ==> RegExp.prototype[Symbol.match]');
  console.log('String.prototype.replace ==> RegExp.prototype[Symbol.replace]');
  console.log('String.prototype.search ==> RegExp.prototype[Symbol.search]');
  console.log('String.prototype.split ==> RegExp.prototype[Symbol.split]');
}

{
  //u修饰符 码值大于\uFFFF 或 \u{}表示的Unicode字符匹配必须使用
  console.log('\uD83D\uDC2A');
  console.log(/^\uD83D/u.test('\uD83D\uDC2A'))// false
  console.log(/^\uD83D/.test('\uD83D\uDC2A'))// true

  console.log(/^.$/.test('𠮷')); // false 必须加上u修饰符
  console.log(/^.$/u.test('𠮷')); // true
  console.log(/\u{61}/.test('a')); // false 大括号表示Unicode字符,必须加上u修饰符
  console.log(/\u{61}/u.test('a')); // true
  console.log(/\u{20BB7}/u.test('𠮷')); // true

  console.log(/a{2}/.test('aa')); // true
  console.log(/a{2}/u.test('aa')); // true
  console.log(/𠮷{2}/.test('𠮷𠮷')); // false 不加u修饰符无法正确匹配
  console.log(/𠮷{2}/u.test('𠮷𠮷')); // true
  console.log(/^\u{3}$/.test('uuu')); // true 不加u修饰符，被识别成了量词
}

{
  //y修饰符 黏连修饰符
  let s = 'aaa_aa_a';
  let r1 = /a+/g;
  let r2 = /a+/y;

  console.log(r1.exec(s)); // ["aaa"]
  console.log(r2.exec(s)); // ["aaa"]

  console.log(r1.exec(s)); // ["aa"]
  console.log(r2.exec(s)); // null

  // 没有找到匹配
  console.log('x##'.split(/#/y));// [ 'x##' ]

  // 找到两个匹配
  console.log('##x'.split(/#/y));// [ '', '', 'x' ]

  const REGEX = /a/gy;
  console.log('aaxa'.replace(REGEX, '-')); // '--xa'

  //单单一个y修饰符对match方法，只能返回第一个匹配
  console.log('a1a2a3'.match(/a\d/y)); // ["a1"]
  console.log('a1a2a3'.match(/a\d/gy)); // ["a1", "a2", "a3"]

  //应用示例
  const TOKEN_Y = /\s*([\+\-\*\/]|[0-9]+)\s*/y;
  const TOKEN_G  = /\s*([\+\-\*\/]|[0-9]+)\s*/g;

  console.log(TOKEN_Y.sticky); //true 设置了y修饰符后，此属性为true
  console.log(TOKEN_G.sticky); //false

  console.log(TOKEN_G.source);
  console.log(TOKEN_G.flags);

  console.log(tokenize(TOKEN_Y, '   3   *   4 ')); // [ '3', '*', '4' ]
  console.log(tokenize(TOKEN_G, ' 3x   +   4   ')); // [ '3', '+', '4' ]

  function tokenize(TOKEN_REGEX, str) {
    let result = [];
    let match;
    while (match = TOKEN_REGEX.exec(str)) {
      result.push(match[1]);
    }
    return result;
  }

  //字符串必须转义，才能作为正则表达式

  function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  }

  let str = '/path/to/resource.html?search=query';
  console.log(escapeRegExp(str)); // "\/path\/to\/resource\.html\?search=query"

  let regex = new RegExp(escapeRegExp(str));
  console.log(regex.test(str)); //true
  console.log(str.match(regex));

}

{  
  const regex = /^[1][3,4,5,7,8][0-9]{9}$/;
  console.log(regex.test('18610108880')); // true
}