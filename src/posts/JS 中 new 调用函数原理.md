---
title: JS 中 new 调用函数原理
date: 2018-06-28 23:14:14
tags: [JavaScript]
categories: JavaScript
e_title: what-happened-when-using-new
---

JavaScript 中经常使用构造函数创建对象（通过 `new` 操作符调用一个函数），那在使用 `new` 调用一个函数的时候到底发生了什么？先看几个例子，再解释背后发生了什么。

## 1）看三个例子

### 1.1 无 return 语句

构造函数最后没有 `return` 语句，这也是使用构造函数时默认情况，最后会返回一个新对象，如下：

```js
function Foo(age) {
  this.age = age;
}

var o = new Foo(111);
console.log(o);
```

这是常见的使用构造函数创建对象的过程，打印出来的是 `{age: 111}`。

### 1.2 return 对象类型数据

构造函数最后 `return` 对象类型数据：

```js
function Foo(age) {
  this.age = age;

  return { type: "我是显式返回的" };
}

var o = new Foo(222);
console.log(o);
```

打印出来的是 `{type: '我是显式返回的'}`，也就是说，`return` 之前的工作都白做了，最后返回 `return` 后面的对象。

### 1.3 return 基本类型数据

那是不是只要构造函数体内最后有 `return`，返回都是 `return` 后面的数据呢？

我们看下返回基本类型数据的情况：

```js
function Foo(age) {
  this.age = age;

  return 1;
}

var o = new Foo(333);
console.log(o);
```

打印出来的是 `{age: 333}`，和没有 `return` 时效果一样。跟预期不一样，背后你原理看下面分析。

## 2）背后原理

### 2.1 非箭头函数的情况

当使用 `new` 操作符创建对象是，ES5 官方文档在 _函数定义_ 一节中做了如下定义 [13.2.2 [[Construct]]](https://stackoverflow.com/questions/1978049/what-values-can-a-constructor-return-to-avoid-returning-this)：

When the `[[Construct]]` internal method for a `Function` object `F` is called with a possibly empty list of arguments, the following steps are taken:

1.  Let obj be a newly created **native ECMAScript object**.
2.  Set all the internal methods of obj as specified in 8.12.
3.  Set the [[Class]] internal property of obj to Object.
4.  Set the [[Extensible]] internal property of obj to true.
5.  Let proto be the value of calling the [[Get]] internal property of **F with argument "prototype"**.
6.  If Type(proto) is Object, set the **[[Prototype]] internal property of obj to proto**.
7.  If Type(proto) is not Object, set the [[Prototype]] internal property of obj to the standard built-in **Object prototype object** as described in 15.2.4.
8.  Let result be the result of calling the [[Call]] internal property of F, **providing obj as the this value** and providing the argument list passed into [[Construct]] as args.
9.  **If Type(result) is Object then return result**.
10. Return obj.

看第 8、9 步：

> 8）调用函数 `F`，将其返回值赋给 `result`；其中，`F` 执行时的实参为传递给 `[[Construct]]`（即 `F` 本身） 的参数，`F` 内部 `this` 指向 `obj`；
> 9）如果 `result` 是 `Object` 类型，返回 `result`；

**这也就解释了如果构造函数显式返回对象类型，则直接返回这个对象，而不是返回最开始创建的对象。**

最后在看第 10 步：

> 10）如果 `F` 返回的不是对象类型（第 9 步不成立），则返回创建的对象 `obj`。

**如果构造函数没有显式返回对象类型（显式返回基本数据类型或者直接不返回），则返回最开始创建的对象。**

### 2.2 箭头函数的情况

那如果构造函数是箭头函数怎么办？

箭头函数中没有 `[[Construct]]` 方法，不能使用 `new` 调用，会报错。

NOTICE：其中 `[[Construct]]` 就是指构造函数本身。

> 相关规范在 [ES6 的官方文档](https://www.ecma-international.org/ecma-262/6.0/index.html) 中有提，但自从 ES6 以来的官方文档巨难懂，在此不做表述。

## 3）new 调用函数完整过程

### 3.1 中文描述及相关代码分析

除了箭头函数之外的任何函数，都可以使用 `new` 进行调用，背后发生了什么，上节英文讲述的很清楚了，再用中文描述如下：

1）创建 ECMAScript 原生对象 `obj`；  
2）给 `obj` 设置原生对象的内部属性；（和原型属性不同，内部属性表示为 `[[PropertyName]]`，两个方括号包裹属性名，并且属性名大写，比如常见 `[[Prototype]]`、`[[Constructor]]`）  
3）设置 `obj` 的内部属性 `[[Class]]` 为 `Object`；  
4）设置 `obj` 的内部属性 `[[Extensible]]` 为 `true`；  
5）将 `proto` 的值设置为 `F` 的 `prototype` 属性值；  
6）如果 `proto` 是对象类型，则设置 `obj` 的内部属性 `[[Prototype]]` 值为 `proto`；（**进行原型链关联，实现继承的关键**）  
7）如果 `proto` 是不对象类型，则设置 `obj` 的内部属性 `[[Prototype]]` 值为内建构造函数 **Object** 的 `prototype` 值；（**函数 `prototype` 属性可以被改写**，如果改成非对象类型，`obj` 的 `[[Prototype]]` 就指向 Object 的原型对象）  
8）9）10）见上节分析。（决定返回什么）

对于第 7 步的情况，见下面代码：

```js
function Foo(name) {
  this.name = name;
}

var o1 = new Foo("xiaoming");
console.log(o1.__proto__ === Foo.prototype); // true

// 重写构造函数原型属性为非对象类型，实例内部 [[Prototype]] 属性指向 Object 原型对象
// 因为实例是一个对象类型的数据，默认会继承内建对象的原型，
// 如果构造函数的原型不满足形成原型链的要求，那就跳过直接和内建对象原型关联
Foo.prototype = 1;
var o2 = new Foo("xiaohong");
console.log(o2.__proto__ === Foo.prototype); // false
console.log(o2.__proto__ === Object.prototype); // true
```

### 3.2 更简洁的语言描述

- 若执行 `new Foo()`，过程如下：

1）创建新对象 `o`；  
2）给新对象的内部属性赋值，关键是给`[[Prototype]]`属性赋值，构造原型链（如果构造函数的原型是 Object 类型，则指向构造函数的原型；不然指向 Object 对象的原型）；  
3）执行函数 `Foo`，执行过程中内部 `this` 指向新创建的对象 `o`；  
4）如果 `Foo` 内部显式返回对象类型数据，则，返回该数据，执行结束；不然返回新创建的对象 `o`。

### 3.3 伪代码实现 new

```js
var bar = new Foo(...args);

// 过程如下（不考虑 Foo 显式返回对象）
var bar = {};
bar.__proto__ = Foo.prototype; // 或者 bar.[[Prototype]] = Foo.prototype
Foo.apply(bar, args);

return bar;
```

### 3.4 可运行的 new polyfill

- 好理解的版本

下面这个版本也是根据规范表述写的：

```js
// 入参：构造函数、构造函数入参
function myNew() {
  let obj = {};
  // 提取构造函数，同时删除 arguments 第一个元素
  let Constructor = Array.prototype.shift.call(arguments);

  obj.__proto__ = Constructor.prototype;

  let temp = Constructor.apply(obj, arguments);

  // 如果构造函数返回对象，则直接返回构造函数的对象，不然返回创建的对象
  return temp instanceof Object ? temp : obj;
}
```

- 兼容不支持 `__proto__` 的版本

```js
function myNew() {
  let Constructor = Array.prototype.shift.call(arguments);

  // 创建对象，并关联原型链
  let obj = Object.create(Constructor.prototype);

  let temp = Constructor.apply(obj, arguments);

  // 如果构造函数返回对象，则直接返回构造函数的对象，不然返回创建的对象
  return temp instanceof Object ? temp : obj;
}
```

> 参考这篇文章后面的评论[JavaScript深入之new的模拟实现](https://github.com/mqyqingfeng/Blog/issues/13)，注意，**是这篇文章后面的评论**，文章本身代码实现和 《JavaScript 设计模式与开发实践》p19 中一样，不知谁参考了谁的，但后面的评论有些很精彩。

## 4）几点说明

### 4.1 判断是否是 Object 类型

关于一个数据是否是 `Object` 类型，可以通过 `instanceof` 操作符进行判断：如果 `x instanceof Object` 返回 `true`，则 `x` 为 `Object` 类型。

由上可知，`null instanceof Object` 返回 `false`，所以 `null` 不是 `Object` 类型，尽管`typeof null` 返回 "Object"。

### 4.2 instanceof 原理

**`instanceof` 的工作原理是：在表达式 `x instanceof Foo` 中，如果 `Foo` 的原型（即 `Foo.prototype`）出现在 `x` 的原型链中，则返回 `true`，不然，返回 `false`**。

因为函数的原型可以被改写，所以会出现在 `x` 通过 `Foo` new 出来**之后**完全改写 `Foo` 的原型 `x instanceof Foo` 返回 `false` 的情况。因为实例创建之后重写构造函数原型，实例指向的原型已经不是构造函数的新的原型了，见下面代码：

```js
const Foo = function() {};

const o = new Foo();

o instanceof Foo; // true

// 重写 Foo 原型
Foo.prototype = {};
o instanceof Foo; // false
```

PS.那既然 `instanceof` 不靠谱，怎么才能判断一个实例是哪个构造函数构造的呢？可以通过原型对象上的 `constructor` 属性实现：虽然构造函数原型可以改写导致之前创建的实例的原型链断开，但是，构造函数的原型中 `contructor` 属性还是指向构造函数的。

```js
const Foo = function() {};

const o = new Foo();

// 重写 Foo 原型
Foo.prototype = {};
o instanceof Foo; // false

// o.__proto__ 获取 o 构造函数的原型，此时，其 constructor 属性还是之前最初的构造函数
// 通过 name 属性能直接找到构造函数是哪个 
o.__proto__.constructor.name; // Foo
o.__proto__.constructor === Foo; // true
```

但重新原型对象，稍不注意会引入新的问题：`constructor` 指向丢失。比如上面的例子:

```js
const Foo = function() {};
const o = new Foo();
// 重写 Foo 原型
Foo.prototype = {};

var o1 = new Foo();
o1.__proto__.constructor.name; // Object 而非 Foo，因为 Foo.prototype = new Object(); 新建对象实例，普通对象实例没有 constructor 属性

// 每次重新原型都要向下面这样执行 constructor 
Foo.prototype = {
  constructor: Foo,
};
var o2 = new Foo();
o2.__proto__.constructor.name; // Foo
```

> 虽然 function 自带的原型对象也是对象，但有特殊属性 `constructor`，重写后默认丢失，需要指定。

### 4.3 关于内建构造函数

```js
// 内建构造函数都是 Function 的实例
// 毕竟也是函数，但创建过程待重新整理
Object instanceof Function; // true
Function instanceof Function; // true
Array instanceof Function; // true
Date instanceof Function; // true
RegExp instanceof Function; // true

// 或者
Object.__proto__.constructor === Function; // true
Function.__proto__.constructor === Function; // true
Array.__proto__.constructor === Function; // true
Date.__proto__.constructor === Function; // true
RegExp.__proto__.constructor === Function; // true
```

但下面也成立：

```js
Function instanceof Object;

// 因为 Function 的原型对象（Function.__proto__）的 __proto__ 指向 Object.prototype
// 即 Object.prototype 出现在了 Function 的原型链上
Function.__proto__.__proto__ === Object.prototype; // true
```

具体参考这篇问答：[Why in JavaScript both “Object instanceof Function” and “Function instanceof Object” return true?](https://stackoverflow.com/questions/23622695/why-in-javascript-both-object-instanceof-function-and-function-instanceof-obj/23623598)

## 参考资料

[What values can a constructor return to avoid returning this?](https://stackoverflow.com/questions/1978049/what-values-can-a-constructor-return-to-avoid-returning-this)    
[`[[Construct]]` internal method](https://stackoverflow.com/questions/21874128/construct-internal-method)   
