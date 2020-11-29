---
title: JavaScript编程风格规范
date: 2017-04-27 00:20:15
tags: [JavaScript,Normalization]
categories: JavaScript
e_title: js-write-normalization
---
基于[Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)，整理常用风格规范，方便日后查找。

# 一 注释

## 1.1 多行注释

多行注释用`/** ... */`   

```js
/**
 * make() returns a new element
 * based on the passed-in tag name
 */
function make(tag) {

  // ...

  return element;
}
```

## 1.2 单行注释

单行注释使用`//`。且单行注释在被注释的代码前另起一行书写（而非和被注释的代码在同一行）；除非在代码块的首行，否则，当前备注前留一空白行。   

```js
// bad
const active = true;  // is current tab

// good
// is current tab
const active = true;

// bad
function getType() {
  console.log('fetching type...');
  // set the default type to 'no type'
  const type = this.type || 'no type';

  return type;
}

// good
function getType() {
  console.log('fetching type...');

  // set the default type to 'no type'
  const type = this.type || 'no type';

  return type;
}

// also good
function getType() {
  // set the default type to 'no type'
  const type = this.type || 'no type';

  return type;
}
```

## 1.3 注释内容

注释内容前面加多一空格   

```js
// bad
//is current tab
const active = true;

// good
// is current tab
const active = true;

// bad
/**
 *make() returns a new element
 *based on the passed-in tag name
 */
function make(tag) {

  // ...

  return element;
}

// good
/**
 * make() returns a new element
 * based on the passed-in tag name
 */
function make(tag) {

  // ...

  return element;
}
```

## 1.4 备注前缀

如果备注的目的是提示“有问题待修复”，或者有“有工作待完成”最好在备注前加前缀`FIXME: -- need to figure this out`或者`TODO: -- need to implement`

> 这类备注可以设置不同颜色的以示区分其他备注。   

使用`// FIXME:`指出问题   

```js
class Calculator extends Abacus {
  constructor() {
    super();

    // FIXME: shouldn't use a global here
    total = 0;
  }
}
```

使用`// TODO:`指出问题的解决方案（但还有遗留代码未更改）   

```js
class Calculator extends Abacus {
  constructor() {
    super();

    // TODO: total should be configurable by an options param
    this.total = 0;
  }
}
```

# 二 空白（Whitespace）

## 2.1 缩进

用空格进行缩进，缩进宽度为两个空格（如果喜欢使用tab，使用`soft tabs`，并设置`soft tabs`为两个空格宽度）   

```js
// bad
function foo() {
∙∙∙∙let name;
}

// bad
function bar() {
∙let name;
}

// good
function baz() {
∙∙let name;
}
```

> **Hard tabs**就是通常意义上的制表符（[tab character](http://en.wikipedia.org/wiki/Tab_key#Tab_characters)）, 而**soft tabs**实际上就是空格，通常为2个或者4个空格宽度，取决于编辑器的设置。   
> 所以，如果在编辑器中设置了使用**soft tabs**，那么当在键盘上按下`Tab`键时，在编辑器中会插入空格（宽度取决于编辑器的设置）而非制表符。

## 2.2 大括号`{}`

- 大括号`{}`前面加一空格   

```js
// bad
function test(){
  console.log('test');
}

// good
function test() {
  console.log('test');
}

// bad
dog.set('attr',{
  age: '1 year',
  breed: 'Bernese Mountain Dog',
});

// good
dog.set('attr', {
  age: '1 year',
  breed: 'Bernese Mountain Dog',
});
```

- 大括号内部两侧各加一空格

```js
// bad
const foo = {clark: 'kent'};

// good
const foo = { clark: 'kent' };
```

> 英语中各种括号名称对应：`()` parenthesis or round brackets 圆括号；`[]` square brackets 方括号；`{}` curly brackets or braces 大括号；`<>` Angle brackets 尖括号

## 2.3 方括号`[]`

方括号内部两侧不需要空格

```js
// bad
const foo = [ 1, 2, 3 ];
console.log(foo[ 0 ]);

// good
const foo = [1, 2, 3];
console.log(foo[0]);
```

## 2.4 小括号`()`

### 2.4.1 需要空格的情况

流程控制语句(if, while等)的小括号`()`前加一空格   

```js
// bad
if(isJedi) {
  fight ();
}

// good
if (isJedi) {
  fight();
}
```

### 2.4.2 不需要空格的情况

- 参数列表间及通过函数名调用或声明时使用的小括号前面不用空格   

```js
// bad
function fight () {
  console.log ('Swooosh!');
}

// good
function fight() {
  console.log('Swooosh!');
}
```

**注意：如果是匿名函数则在`function`声明和小括号之间加一空格(相当于隐去的函数名)**   

```js
// bad
var test = function() {
    // ...
}

// good
var test = function () {
    // ...
}
```

- 小括号内部两侧不需要空格

```js
// bad
function bar( foo ) {
  return foo;
}

// good
function bar(foo) {
  return foo;
}

// bad
if ( foo ) {
  console.log(foo);
}

// good
if (foo) {
  console.log(foo);
}
```

## 2.5 运算符

### 2.5.1 前后各加一空格   

除了2.5.2中的情况，其他都是前后都加空格

```js
// bad
const x=y+5;

// good
const x = y + 5;

// good
const maybeNull = value1 > value2 ? 'baz' : null;
```

### 2.5.2 只在后面加空格

- 键值对中使用的冒号后加一空格，前面不加空格

```js
// bad
const hero = {
  firstName:'Ada',
  lastName:'Lovelace',
};

// good
const hero = {
  firstName: 'Ada',
  lastName: 'Lovelace',
};
```

- 逗号前面没有空格，后面加多一空格（英语书写正常格式）

```js
// bad
const foo = [1,2,3];
const foo = [1 , 2 , 3];

// bad
function foo(name,age) {
  // ...
}

function foo(name , age) {
  // ...
}

// good
const foo = [1, 2, 3];

// bad
function foo(name, age) {
  // ...
}

```

> 冒号和逗号不算运算符，但在三目中涉及冒号，就在运算符中一并说下。


## 2.6 文档尾部加一空白行

```js
// bad
import { es6 } from './AirbnbStyleGuide';
  // ...
export default es6;
```

```js
// bad
import { es6 } from './AirbnbStyleGuide';
  // ...
export default es6;↵
↵
```

```js
// good
import { es6 } from './AirbnbStyleGuide';
  // ...
export default es6;↵
```

## 2.7 方法链

大于两个方法的方法链，每个方法另起一行，以点`.`开始   

```js
// bad
$('#items').find('.selected').highlight().end().find('.open').updateCount();

// bad
$('#items').
  find('.selected').
    highlight().
    end().
  find('.open').
    updateCount();

// good
$('#items')
  .find('.selected')
    .highlight()
    .end()
  .find('.open')
    .updateCount();

// bad
const leds = stage.selectAll('.led').data(data).enter().append('svg:svg').classed('led', true)
    .attr('width', (radius + margin) * 2).append('svg:g')
    .attr('transform', `translate(${radius + margin},${radius + margin})`)
    .call(tron.led);

// good
const leds = stage.selectAll('.led')
    .data(data)
  .enter().append('svg:svg')
    .classed('led', true)
    .attr('width', (radius + margin) * 2)
  .append('svg:g')
    .attr('transform', `translate(${radius + margin},${radius + margin})`)
    .call(tron.led);

// good（只有两个方法的方法链可以写在同一行）
const leds = stage.selectAll('.led').data(data);
```

## 2.8 代码块

### 2.8.1 代码块之后

代码块之后，下一语句之前，加一空白行之后，下一语句之前，加一空白行   

```js
// bad
if (foo) {
  return bar;
}
return baz;

// good
if (foo) {
  return bar;
}

return baz;

// bad
const obj = {
  foo() {
  },
  bar() {
  },
};
return obj;

// good
const obj = {
  foo() {
  },

  bar() {
  },
};

return obj;

// bad
const arr = [
  function foo() {
  },
  function bar() {
  },
];
return arr;

// good
const arr = [
  function foo() {
  },

  function bar() {
  },
];

return arr;
```

### 2.8.2 代码块之间

代码块之间不要添加空白行（除非有注释或其他需要添加空白行的情况）   

```js
// bad
function bar() {

  console.log(foo);

}

// also bad
if (baz) {

  console.log(qux);
} else {
  console.log(foo);

}

// good
function bar() {
  console.log(foo);
}

// good
if (baz) {
  console.log(qux);
} else {
  console.log(foo);
}

// also good
if (baz) {
  console.log(qux);

  // this is a comment
  console.log(qux);
} else {
  console.log(foo);
}
```

## 2.9 单行长度限制

单行长度不超过100个字符（包括空格）。注意：长字符串例外，不要打断字符串

```js
// bad
const foo = jsonData && jsonData.foo && jsonData.foo.bar && jsonData.foo.bar.baz && jsonData.foo.bar.baz.quux && jsonData.foo.bar.baz.quux.xyzzy;

// bad
$.ajax({ method: 'POST', url: 'https://airbnb.com/', data: { name: 'John' } }).done(() => console.log('Congratulations!')).fail(() => console.log('You have failed this city.'));

// good
const foo = jsonData
  && jsonData.foo
  && jsonData.foo.bar
  && jsonData.foo.bar.baz
  && jsonData.foo.bar.baz.quux
  && jsonData.foo.bar.baz.quux.xyzzy;

// good
$.ajax({
  method: 'POST',
  url: 'https://airbnb.com/',
  data: { name: 'John' },
})
  .done(() => console.log('Congratulations!'))
  .fail(() => console.log('You have failed this city.'));
```

# 三 命名

## 3.1 避免使用单个字母

避免使用单个字母，含义越明确越好

```js
// bad
function q() {
  // ...
}

// good
function query() {
  // ...
}
```
## 3.2 对象，函数及其他实例

命名对象、函数及其他实例使用小驼峰命名法（首个单词首字母小写）

```js
// bad
const OBJEcttsssss = {};
const this_is_my_object = {};
function c() {}

// good
const thisIsMyObject = {};
function thisIsMyFunction() {}
```

## 3.3 构造函数，类

构造函数，类使用大驼峰命名法（首个单词首字母大写）

```js
// bad
function user(options) {
  this.name = options.name;
}

const bad = new user({
  name: 'nope',
});

// good
class User {
  constructor(options) {
    this.name = options.name;
  }
}

const good = new User({
  name: 'yup',
});
```

## 3.4 首尾不要使用下划线

```js
// bad
this.__firstName__ = 'Panda';
this.firstName_ = 'Panda';
this._firstName = 'Panda';

// good
this.firstName = 'Panda';
```

> Why? JavaScript does not have the concept of privacy in terms of properties or methods. Although a leading underscore is a common convention to mean “private”, in fact, these properties are fully public, and as such, are part of your public API contract. This convention might lead developers to wrongly think that a change won't count as breaking, or that tests aren't needed. tl;dr: if you want something to be “private”, it must not be observably present.   

## 3.5 不使用驼峰命名法的情况

缩写词保留通用写法，不使用驼峰命名法，这样更容易阅读。

```js
// bad
import SmsContainer from './containers/SmsContainer';

// bad
const HttpRequests = [
  // ...
];

// good
import SMSContainer from './containers/SMSContainer';

// good
const HTTPRequests = [
  // ...
];
```

# 其他

## 优先使用单引号

```js
// not good
if (hasName === "test") {
  return false;
}

// good
if (hasName === 'test') {
  return false;
}
```
# 参考资料
【1】[Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)   
【2】[What are hard and soft tabs?](http://stackoverflow.com/questions/26350689/what-are-hard-and-soft-tabs)   
【2】[标点符号的英语名称](http://www.ruanyifeng.com/blog/2007/07/english_punctuation.html)
