{
  let s = '\uD842\uDFB7';
  console.log(s);
  s = "\u20BB7";
  console.log(s);
  s = "\u{20BB7}";
  console.log(s);
  //大括号表示法与四字节的 UTF-16 编码是等价的
  console.log('\u{1F680}' === '\uD83D\uDE80');//true

  //字符的6种表示方法
  console.log('\z' === 'z' ) // true
  console.log('\172' === 'z') // true
  console.log('\x7A' === 'z') // true
  console.log('\u007A' === 'z') // true
  console.log('\u{7A}' === 'z') // true
}

{
  //JavaScript内部，字符以UTF-16的格式储存，每个字符固定为2个字节。对于那些需要4个字节储存的字符（Unicode码点大于0xFFFF的字符），JavaScript会认为它们是两个字符。
  let s = "𠮷a";
  console.log(s.length)// 2
  console.log(s.charAt(0)) // ''
  console.log(s.charAt(1)) // ''
  console.log(s.charCodeAt(0)) // 55362
  console.log(s.charCodeAt(1)) // 57271
  //es6 codePointAt
  console.log(s.codePointAt(0).toString(16)) // 134071
  console.log(s.codePointAt(1).toString(16)) // 57271 这个依然不正确
  console.log(s.codePointAt(2).toString(16)) // 97
  //可以使用for
  for(let ch of s){
    console.log(ch.codePointAt(0).toString(16)); //20bb7 61
  }

  //测试字符是2字节还是4字节
  function is32Bit(c){
    return c.codePointAt(0) > 0xFFFF;
  }

  console.log(is32Bit(s)); //true
}

{
  //ES5 String.fromCharCode不能识别大于0xFFFF的码点
  console.log(String.fromCharCode(0x20BB7)); //ஷ 最高位2被舍弃了

  //ES6 String.fromCodePoint
  console.log(String.fromCodePoint(0x20BB7)); //𠮷

  function getUniLength(unicodeString){
    var result = unicodeString.match(/[\s\S]/gu);
    return result ? result.length : 0;
  }

  let s = '【徐云飞】𠮷';
  console.log(getUniLength(s));
  console.log('================');

  //ES5 charAt方法也不能识别大于0xFFFF的码点
  console.log('abc'.charAt(0));// "a"
  console.log('𠮷'.charAt(0));// "\uD842"
  require('string.prototype.at'); //polyfill
  console.log('𠮷'.at(0));
}

{
  s = '\u01D1'; //Ǒ
  s1 = '\u004F\u030C'; //Ǒ
  console.log(s);
  console.log(s1);
  console.log(s === s1); //false
  console.log(s.normalize() === s1.normalize()); //true
}

{
  //ES6新方法
  let s = '你好!';
  console.log(s.startsWith('你')); // true
  console.log(s.endsWith('!'));// true
  console.log(s.includes('好'));// true
  console.log(s.repeat(3));

  //ES2017 字符串补全长度
  // console.log('x'.padStart(5, 'ab')) // 'ababx'
  // console.log('x'.padStart(4, 'ab')) // 'abax'
  // console.log('x'.padEnd(5, 'ab')) // 'xabab'
  // console.log('x'.padEnd(4, 'ab')) // 'xaba'
}

{
  //模板字符串
  console.log(`string text line 1
               string text line 2`);
  let name = "Bob", time = "today";
  console.log(`Hello ${name}, how are you ${time}?`);

  //计算javascript表达式
  let x = 1, y = 2;
  console.log(`${x} + ${y} = ${x + y}`);// "1 + 2 = 3"
  console.log(`${x} + ${y * 2} = ${x + y * 2}`);// "1 + 4 = 5"
  let obj = {x: 1, y: 2};
  console.log(`${obj.x + obj.y}`);

  //调用函数
  function fn(){
    return "Hello World";
  }

  console.log(`foo ${fn()} bar`);

  //模板字符串嵌套
  const tmpl = addrs => `
  <table>
  ${addrs.map(addr => `
    <tr><td>${addr.first}</td></tr>
    <tr><td>${addr.last}</td></tr>
  `).join('')}
  </table>
`;
  const data = [
    {first: '<Jane>', last: 'Bond'},
    {first: 'Lars', last: '<Croft>'},
  ];

  console.log(tmpl(data));

  // 写法一
  let str = 'return ' + '`Hello ${name}!`';
  let func = new Function('name', str);
  console.log(func('Jack')); // "Hello Jack!"

  // 写法二
  str = '(name) => `Hello ${name}!`';
  func = eval.call(null, str);
  console.log(func('Jack')); // "Hello Jack!"
}

{

  let template = `
    <ul>
      <% for(let i=0; i < data.supplies.length; i++) { %>
        <li><%= data.supplies[i] %></li>
      <% } %>
    </ul>
  `;

  function compile(template){
    let evalExpr = /<%=(.+?)%>/g;
    let expr = /<%([\s\S]+?)%>/g;

    template = template
      .replace(evalExpr, '`); \n  echo( $1 ); \n  echo(`')
      .replace(expr, '`); \n $1 \n  echo(`');

    template = 'echo(`' + template + '`);';

    return `(function parse(data){
          let output = "";
          
          function echo(html){
            output += html;
          }

          ${ template }

          return output;
       })`;
  }

  // console.log(compile(template));

  let parse = eval(compile(template));
  console.log(parse({supplies: ["broom", "mop", "cleaner"]}));
}

{
  //标签模板,其实不是模板，而是函数调用的一种特殊形式
  let a = 5;
  let b = 10;
  tag`Hello ${ a + b } world ${ a * b }`;
  // 等同于
  tag(['Hello ', ' world ', ''], 15, 50);

  function tag(stringArr, ...values){
    console.log(stringArr, values);
  }

  let sender = '<script>alert("abc")</script>';
  let message = SaferHTML`${sender} <p>has sent you a message ${sender}.</p>`;

  function SaferHTML(templateData,...msg) {
    let s = templateData[0];
    console.log('templateData ='+ templateData);
    console.log('args ='+ msg);
    for (let i = 1; i < arguments.length; i++) {
      let arg = msg[i-1];

      // Escape special characters in the substitution.
      s += arg.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      // Don't escape special characters in the template.
      s += templateData[i];
    }
    return s;
  }
  console.log(message);
}

{
  //模板处理函数的第一个参数（模板字符串数组），还有一个raw属性
  tag1`First line\nSecond line`;

  function tag1(strings) {
    console.log(strings.raw[0]); // "First line\\nSecond line"
  }

  console.log(String.raw`Happy\n! Sam ${30+10}\'s birsday'`);

}


