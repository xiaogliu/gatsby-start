---
title: ES6之模板字符串
date: 2017-06-22 11:59:12
tags: [ES6]
categories: JavaScript
e_title: es6-template-literals
---

# 简介

模板字符串（Template literals）是ES6引入的新语法规则。

# 语法

通过反引号`` ` ``包裹字符串，如下   

```js
`字符串`
```

> MarkDown反引号转义：最外层连续连个反引号，且被包裹的反引号前后各加一空格。

# 使用

可以通过`'`或者`"`包裹的字符串都可以使用`` ` ``代替，除此之外，反引号的语法常用的两种场景：   

- **实现[字符串插值](https://en.wikipedia.org/wiki/String_interpolation)功能**   

ES6之前的写法：   

```js
var a = 5;
var b = 10;
console.log('Fifteen is ' + (a + b));
// "Fifteen is 15 and"
```

ES6的写法：   

```js
var a = 5;
var b = 10;
console.log(`Fifteen is ${a + b}`);
// "Fifteen is 15 and"
```

这个功能在路由传参时非常实用：`` `/admin/article/detail/${userUID}` ``

> 字符串模板中的表达式通过`${expression}`表示

- **反引号内的空格、换行符都会保留**   

```js
$("#warning").html(`
  <h1>小心！>/h1>
  <p>未经授权打冰球可能受罚
  将近${maxPenalty}分钟。</p>
`);
```

如果在JS中嵌套html，通过字符串模板书写更友好。

# 参考资料   
【1】[Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
【2】[深入浅出ES6（四）：模板字符串](http://www.infoq.com/cn/articles/es6-in-depth-template-string)
【3】[markdown反引号内怎么转义反引号？](https://www.v2ex.com/t/57233)
