---
title: 获取JS对象属性（自身/原型/可枚举/不可枚举）
date: 2017-08-06 19:17:23
tags: [JavaScript]
categories: [JavaScript]
e_title: get-js-object-properties
---

在看JS构造函数、原型、原型链、继承相关内容时对对象的属性，比如`[[Prototype]]`, `constructor`, `prototype`有些云里雾里，因为画原型链时，使用的是对象的自身属性（own property），但实际使用时，对象中又能继承原型属性（prototype property）。

还有些特点会让自己更加迷惑，比如“JS高程”提到任何对象都有`constructor`属性，但实际这里的`constructor`属性实际是原型属性。

学习当中如果能通过代码验证，印象会更加深刻，所以这篇文章记录下怎么获取对象的四种属性：自身可枚举属性，自身所有属性（可枚举+不可枚举），自身+原型可枚举属性，自身+原型所有属性（可枚举+不可枚举），以便在学习当中加以验证。

> 关于`constructor`属性为什么定义在原型中，可以参考这个问答[JavaScript inheritance and the constructor property](https://stackoverflow.com/questions/8093057/javascript-inheritance-and-the-constructor-property)

# 自身可枚举属性

## ES5+

如果支持ES5+的浏览器（即IE8以上），可以通过JS内建方法：

语法：

```js
Object.keys(obj); // 返回的是所有属性组成的数组
```

举例：

```js
var Person = function (name) {
  this.name = name;
};

// 创建原型属性
Person.prototype.age = 26;

// 创建实例
var person = new Person('xiaog');

// 在person实例中创建不可枚举属性"job"
Object.defineProperty(person, 'job', {
  value: 'FEDer',
  enumerable: false,
  configurable: true,
  writable: true,
});

// 只能返回自身可枚举属性
Object.keys(person); // ["name"]
```

> 题外话：如果使用`Object.defineProperty()`方法，如果省略指明`configurable`等属性值，默认为`false`。

## ES3+

如果需要兼容IE8及以下浏览器，可使用`for...in`。

> `for...in`是默认枚举自身及原型中继承来的所有可枚举属性，下面讲完“自身/原型可枚举属性”再看怎么通过`for...in`来枚举“自身可枚举属性”

# 自身+原型可枚举属性

如上所述，通过`for..in`实现：   

语法：   

```js
for (property in object) { ...
}
```

举例：   

```js
var Person = function (name) {
  this.name = name;
};

// 创建原型属性
Person.prototype.age = 26;

// 创建实例
var person = new Person('xiaog');

// 在person实例中创建不可枚举属性"job"
Object.defineProperty(person, 'job', {
  value: 'FEDer',
  enumerable: false,
  configurable: true,
  writable: true,
});

var person = new Person('xiaog');
for (p in person) {
  // 只能打印自身+原型中可枚举属性
  console.log(p); // "name", "age"
}
```

## Object.hasOwnProperty()

结合`Object.hasOwnProperty()`方法可以通过`for...in`实现对自身可枚举属性的遍历：

```js
var Person = function (name) {
  this.name = name;
};

// 创建原型属性
Person.prototype.age = 26;

// 创建实例
var person = new Person('xiaog');

// 在person实例中创建不可枚举属性"job"
Object.defineProperty(person, 'job', {
  value: 'FEDer',
  enumerable: false,
  configurable: true,
  writable: true,
});

for (p in person) {
  // 只有是自身属性时，打印
  if (Object.hasOwnProperty(p)) {
    console.log(p); // "name"
  }
}
```

# 自身所有属性

通过JS内建方法即可实现：

语法：

```js
Object.getOwnPropertyNames(obj);
```

举例：

```js
var Person = function (name) {
  this.name = name;
};

// 创建原型属性
Person.prototype.age = 26;

// 创建实例
var person = new Person('xiaog');

// 在person实例中创建不可枚举属性"job"
Object.defineProperty(person, 'job', {
  value: 'FEDer',
  enumerable: false,
  configurable: true,
  writable: true,
});

var ownAllProperties = Object.getOwnPropertyNames(person);

// 可以打印自身可枚举属性"name"以及不可枚举属性"job"
console.log(ownAllProperties); // ["name", "job"]
```

# 自身+原型所有属性

想要获取自身+原型所有属性没有内建的JS方法，可通过下面代码实现：


```js
// 获取所有属性方法封装
function getAllPropertyNames( obj ) {
  var props = [];

  do {
    Object.getOwnPropertyNames( obj ).forEach(function ( prop ) {
      if ( props.indexOf( prop ) === -1 ) {
          props.push( prop );
      }
    });
  } while ( obj = Object.getPrototypeOf( obj ) );

  return props;
}

// 测试
var Person = function (name) {
  this.name = name;
};

// 创建原型属性
Person.prototype.age = 26;

// 创建实例
var person = new Person('xiaog');

// 在person实例中创建不可枚举属性"job"
Object.defineProperty(person, 'job', {
  value: 'FEDer',
  enumerable: false,
  configurable: true,
  writable: true,
});

var allPropertiesNames = getAllPropertyNames(person);
console.log(allPropertiesNames); // 返回的数组中会包括"name", "job", "age", 还有原型对象中其他默认不可枚举属性
```

方法`getAllPropertyNames`可以简化成下面的代码：   

```js
function getAllPropertyNames( obj ) {
  var props = [];

  do {
      props= props.concat(Object.getOwnPropertyNames( obj ));
  } while ( obj = Object.getPrototypeOf( obj ) );

  return props;
}
```

# 参考资料

【1】[MDN for...in](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in)   
【2】[How to get all properties values of a Javascript Object (without knowing the keys)?](https://stackoverflow.com/questions/7306669/how-to-get-all-properties-values-of-a-javascript-object-without-knowing-the-key)   
【3】[How do I access properties of a javascript object if I don't know the names?](https://stackoverflow.com/questions/675231/how-do-i-access-properties-of-a-javascript-object-if-i-dont-know-the-names)   
【4】[Is it possible to get the non-enumerable inherited property names of an object?](https://stackoverflow.com/questions/8024149/is-it-possible-to-get-the-non-enumerable-inherited-property-names-of-an-object)   
【5】[JavaScript inheritance and the constructor property](https://stackoverflow.com/questions/8093057/javascript-inheritance-and-the-constructor-property)   
