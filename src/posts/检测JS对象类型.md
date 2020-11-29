---
title: 检测JS对象类型
date: 2017-07-29 11:25:08
tags: [JavaScript]
categories: JavaScript
e_title: check-js-object-type
---

这里检测对象类型不是指`typeof`操作符返回的六种对象类型（string, number, boolean, object, function, undefined），而是指要区分出具体的引用类型(`Object`, `Array`, `Date`, `RegExp`, `Function`)以及`null`。测试结果具体见下表

| 测试对象           | 返回结果      |
|:---------------|:----------|
| undefined      | undefined |
| null           | null      |
| true           | boolean   |
| 1              | number    |
| ""             | string    |
| {}             | object    |
| []             | array     |
| new Date()     | date      |
| /\.css$/       | regexp    |
| function () {} | function  |
| window         | global    |

> JS更多对象类型参见[Standard built-in objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)

# 检测对象是否是数组

工作中经常有需求检测一个对象是否是数组，常用方法有两种：

## Array.isArray()

- 语法

```
Array.isArray(obj)
```

- 举例：

```js
Array.isArray([]); // true
Array.isArray(1); // false
Array.isArray(""); // false
```

## instanceof操作符

- 语法

```js
obj instanceof Array;
```

- 举例

```js
[] instanceof Array; // true

var a = {};
a instanceof Array; // false
a instanceof Object; // true
```

## 使用instanceof注意事项

**如果变量是`String`, `Number`或者`Boolean`类型，使用`instanceof`操作符始终返回`false`**，见下代码：

```js
var a = '';
var b = 1;
var c = true;

a instanceof String; // false
b instanceof Number; // false
c instanceof Boolean; // false
```

这涉及**基本包装类型**的知识点，这里不做展开，可参考《JavaScript高级程序设计（第3版）》对_基本包装类型_的解释以及《The Principles of Object-Oriented JavaScript》对_Primitive wrapper Types_的解释。  

# 检测对象类型通用方法

如果要判断某个对象是否是某种具体引用类型，使用`instanceof`操作符就可以解决。但如果是想知道一个对象的具体类型（具体哪种基本类型、引用类型），使用`instanceof`就不合理了，总不能一个个去试。

并且，`instanceof`对于基本数据类型无能为力。

## 使用Object.prototype.toString.call(obj)

使用`Object.prototype.toString.call(obj)`可以判断某个对象的具体类型。

- 语法

```js
Object.prototype.toString.call(obj)
```

> 该方法返回字符串，其中包含对象类型，格式如下"[object type]"，其中type为对象具体类型

- 举例

```js
Object.prototype.toString.call([]); // "[object Array]"
Object.prototype.toString.call(new Date()); // "[object Date]"
Object.prototype.toString.call({}); // "[object Object]"
```

## 封装

使用`Object.prototype.toString.call(obj)`可以检测对象的具体类型，但性能损耗，如果要频繁使用，可以对该方法封装后使用：

```js
// 封装检测对象类型方法
var type = (function(global) {
    var cache = {};
    return function(obj) {
        var key;
        /**
         * 下面六行注释依次为
         * // null
         * // window in browser or global in nodejs
         * // basic: string, boolean, number, undefined, function
         * // DOM element
         * // cached. date, regexp, error, object, array, math
         * // get XXXX from [object XXXX], and cache it
         */
        return obj === null ? 'null'
            : obj === global ? 'global'
            : (key = typeof obj) !== 'object' ? key
            : obj.nodeType ? 'object'
            : cache[key = ({}).toString.call(obj)]
            || (cache[key] = key.slice(8, -1).toLowerCase());
    };
}(this));
```

```js
// 测试
type({}); // Object
type([]); // Array
type(new Date()); // Date
type(/\.css$/); // Regexp
```

参考资料：
【1】[The most accurate way to check JS object's type?](https://stackoverflow.com/questions/7893776/the-most-accurate-way-to-check-js-objects-type)
