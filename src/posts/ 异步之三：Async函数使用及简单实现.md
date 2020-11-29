---
title: 异步之三：Async 函数的使用及简单实现
date: 2018-07-22 22:57:33
tags: [JavaScript, ES6, ES7]
categories: JavaScript
e_title: generator-to-promise-to-async-3
---

解决回调地狱的异步操作，Async 函数是终极办法，但了解生成器和 Promise 有助于理解 Async 函数原理。由于内容较多，分三部分进行，这是第三部分，介绍 Async 函数相关。[第一部分](https://xiaogliu.github.io/2018/07/22/generator-to-promise-to-async-1/)介绍 Generator，[第二部分](https://xiaogliu.github.io/2018/07/22/generator-to-promise-to-async-2/)介绍 Promise。

在这部分中，我们会先介绍 Async 函数的基本使用，然后会结合前两部分介绍的生成器和 Promise 实现一个 async 函数。

# 1）Async 函数概览

## 1.1 概念

通过在普通函数前加`async`操作符可以定义 Async 函数：

```js
// 这是一个 async 函数
async function() {}
```

Async 函数体中的代码是异步执行的，不会阻塞后面代码执行，但它们的写法和同步代码相似。

Async 函数会 **返回一个已完成的 promise 对象**，实际在使用的时候会和`await`操作符配合使用，在介绍`await`之前，我们先看看 async 函数本身有哪些特点。

## 1.2 Async 函数基本用法

### 1.2.1 函数体内没有 await

如果 async 函数体内如果没有`await`操作符，那么它返回的 promise 对象状态和他的函数体内代码怎么写有关系，具体和 promise 的`then()`方法的处理方式相同：

1）没有显式 return 任何数据

此时默认返回`Promise.resolve()`:

```js
var a = (async () => {})();
```

相当于

```js
var a = (async () => {
  return Promise.resolve();
})();
```

此时 a 的值：

```js
a {
  [[PromiseStatus]]: 'resolved',
  [[PromiseValue]]: undefined
}
```

2）显式 return 非 promise

相当于返回`Promise.resolve(data)`

```js
var a = (async () => {
  return 111;
})();
```

相当于

```js
var a = (async () => {
  return Promise.resolve(111);
})();
```

此时 a 的值：

```js
a {
  [[PromiseStatus]]: 'resolved',
  [[PromiseValue]]: 111
}
```

3）显式 return promise 对象

此时 async 函数返回的 promise 对象状态由显示返回的 promise 对象状态决定，这里以被拒绝的 promise 为例：

```js
var a = (async () => Promise.reject(111))();
```

此时 a 的值：

```js
a {
  [[PromiseStatus]]: 'rejected',
  [[PromiseValue]]: 111
}
```

但实际使用中，我们不会向上面那样使用，而是配合`await`操作符一起使用，不然像上面那样，和 promise 相比，并没有优势可言。特别的，没有`await`操作符，我们并不能用 async 函数解决相互依赖的异步数据的请求问题。

换句话说：我们不关心 async 返回的 promise 状态（通常情况，async 函数不会返回任何内容，即默认返回`Promise.resolve()`），我们关心的是 async 函数体内的代码怎么写，因为里面的代码可以异步执行且不阻塞 async 函数后面代码的执行，这就为写异步代码创造了条件，并且书写形式上和同步代码一样。

### 1.2.2 await 介绍

`await`操作符使用方式如下：

```js
[rv] = await expression;
```

expression：可以是任何值，但通常是一个 promise；

rv: 可选。如果有且 expression 是非 promise 的值，则 rv 等于 expression 本身；不然，rv 等于 **兑现** 的 promise 的值，如果该 promise 被拒绝，则抛个异常（所以`await`一般被 try-catch 包裹，异常可以被捕获到）。

但注意`await`**必须在 async 函数中使用，不然会报语法错误**。

### 1.2.3 await 使用

看下面代码例子：

1）expression 后为非 promise

```js
(async () => {
  const b = await 111;
  console.log(b); // 111
})();
```

直接返回这个 expression 的值，即，打印 `111`。

2）expression 为兑现的 promise

```js
(async () => {
  const b = await Promise.resolve(111);
  console.log(b); // 111
})();
```

返回兑现的 promise 的值，所以打印`111`。

3）expression 为拒绝的 promise

```js
(async () => {
  try {
    const b = await Promise.reject(111);

    // 前面的 await 出错后，当前代码块后面的代码就不执行了
    console.log(b); // 不执行
  } catch (e) {
    console.log("出错了：", e); // 出错了：111
  }
})();
```

如果`await`后面的 promise 被拒绝或本身代码执行出错都会抛出一个异常，然后被 catch 到，并且，和当前`await`同属一个代码块的后面的代码不再执行。

# 2）Async 函数处理异步请求

## 2.1 相互依赖的异步数据

在 promise 中我们处理相互依赖的异步数据使用链式调用的方式，虽然相比回调函数已经优化很多，但书写及理解上还是没有同步代码直观。我们看下 async 函数如何解决这个问题。

先回顾下需求及 promise 的解决方案：

需求：_请求 URL1 得到 data1；请求 URL2 得到 data2，但 URL2 = data1[0].url2；请求 URL3 得到 data3，但 URL3 = data2[0].url3_。

使用 promise 链式调用可以这样写代码：

> promiseAjax 在 [第二部分介绍 promise 时在 3.1 中定义的](https://xiaogliu.github.io/2018/07/22/generator-to-promise-to-async-2/#3-1-%E7%94%A8-promise-%E5%B0%81%E8%A3%85-ajax)，通过 promise 封装的 ajax GET 请求。

```js
promiseAjax('URL1')
  .then(data1 => promiseAjax(data1[0].url2))
  .then(data2 => promiseAjax(data2[0].url3);)
  .then(console.log(data3))
  .catch(e => console.log(e));
```

如果使用 Async 函数则可以像同步代码的一样写：

```js
async function() {
  try {
    const data1 = await promiseAjax('URL1');
    const data2 = await promiseAjax(data1[0].url);
    const data3 = await promiseAjax(data2[0].url);
  } catch (e) {
    console.log(e);
  }
}
```

之所以可以这样用，是因为只有当前`await`等待的 promise 兑现后，它后面的代码才会执行（或者抛出错误，后面代码都不执行，直接去到 catch 分支）。

这里有两点值得关注:

1）`await`帮我们处理了 promise，要么返回兑现的值，要么抛出异常；
2）`await`在等待 promise 兑现的同时，整个 async 函数会挂起，promise 兑现后再重新执行接下来的代码。

对于第 2 点，是不是想到了生成器？在 1.4 节中我们会通过生成器 + promise 自己写一个 async 函数。

## 2.2 无依赖关系的异步数据

~~Async 函数没有`Promise.all()`之类的方法，我们需要写多几个 async 函数。~~

可以借助`Promise.all()`在同一个 async 函数中并行处理多个无依赖关系的异步数据，如下：

```js
async function fn1() {
  try {
    const arr = await Promise.all([
      promiseAjax("URL1"),
      promiseAjax("URL2"),
    ]);

    // ... do something
  } catch (e) {
    console.log(e);
  }
}
```

> 感谢 [@贾顺名](https://segmentfault.com/u/jiasm) 的 [评论](https://segmentfault.com/a/1190000015735201#goToReplyArea)

但实际开发中如果异步请求的数据是业务不相关的，不推荐这样写，原因如下：

把所有的异步请求放在一个 async 函数中相当于手动加强了业务代码的耦合，会导致下面两个问题：

1）写代码及获取数据都不直观，尤其请求多起来的时候；
2）`Promise.all`里面写多个无依赖的异步请求，如果 **其中一个被拒绝或发生异常，所有请求的结果我们都获取不到**。

如果业务场景是不关心上面两点，可以考虑使用上面的写法，不然，每个异步请求都放在不同的 async 函数中发出。

下面是分开写的例子：

```js
async function fn1() {
  try {
    const data1 = await promiseAjax("URL1");

    // ... do something
  } catch (e) {
    console.log(e);
  }
}

async function fn2() {
  try {
    const data2 = await promiseAjax("URL2");

    // ... do something
  } catch (e) {
    console.log(e);
  }
}
```

# 3）Async 模拟实现

## 3.1 async 函数处理异步数据的原理

我们先看下 async 处理异步的原理：

- async 函数遇到`await`操作符会挂起；
- `await`后面的表达式求值（通常是个耗时的异步操作）前 async 函数一直处于挂起状态，避免阻塞 async 函数后面的代码；
- `await`后面的表达式求值求值后（异步操作完成），`await`可以对该值做处理：如果是非 promise，直接返回该值；如果是 promsie，则提取 promise 的值并返回。同时告诉 async 函数接着执行下面的代码；
- 哪里出现异常，结束 async 函数。

`await`后面的那个异步操作，往往是返回 promise 对象（比如 [axios](https://github.com/axios/axios)），然后交给 `await` 处理，毕竟，async-await 的设计初衷就是为了解决异步请求数据时的回调地狱问题，而使用 promise 是关键一步。

async 函数本身的行为，和生成器类似；而`await`等待的通常是 promise 对象，也正因如此，常说 async 函数是 _生成器 + promise_ 结合后的语法糖。

既然我们知道了 async 函数处理异步数据的原理，接下来我们就简单模拟下 async 函数的实现过程。

## 3.2 async 函数简单实现

这里只模拟 async 函数配合`await`处理网络请求的场景，并且请求最终返回 promise 对象，async 函数本身返回值（已完成的 promise 对象）及更多使用场景这里没做考虑。

所以接下来的 myAsync 函数只是为了说明 async-await 原理，不要将其用在生产环境中。

### 3.2.1 代码实现

```js
/**
 * 模拟 async 函数的实现，该段代码取自 Secrets of the JavaScript Ninja (Second Edition)，p159
 */
// 接收生成器作为参数，建议先移到后面，看下生成器中的代码
var myAsync = generator => {
  // 注意 iterator.next() 返回对象的 value 是 promiseAjax()，一个 promise
  const iterator = generator();

  // handle 函数控制 async 函数的 挂起-执行
  const handle = iteratorResult => {
    if (iteratorResult.done) return;

    const iteratorValue = iteratorResult.value;

    // 只考虑异步请求返回值是 promise 的情况
    if (iteratorValue instanceof Promise) {
      // 递归调用 handle，promise 兑现后再调用 iterator.next() 使生成器继续执行
      // ps.原书then最后少了半个括号 ')'
      iteratorValue
        .then(result => handle(iterator.next(result)))
        .catch(e => iterator.throw(e));
    }
  };

  try {
    handle(iterator.next());
  } catch (e) {
    console.log(e);
  }
};
```

### 3.2.2 使用

`myAsync`接收的一个生成器作为入参，生成器函数内部的代码，和写原生 async 函数类似，只是用`yield`代替了`await`

```js
myAsync(function*() {
  try {
    const a = yield Promise.resolve(1);
    const b = yield Promise.resolve(a + 10);
    const c = yield Promise.resolve(b + 100);
    console.log(a, b, c); // 输出 1，11，111
  } catch (e) {
    console.log("出错了：", e);
  }
});
```

上面会打印`1 11 111`。

如果第二个`yield`语句后的 promise 被拒绝`Promise.reject(a + 10)`，则打印`出错了：11`。

### 3.2.3 说明：

- myAsync 函数接受一个生成器作为参数，控制生成器的 _挂起_ 可达到使整个 myAsync 函数在异步代码请求过程 _挂起_ 的效果；
- myAsync 函数内部通过定义`handle`函数，控制生成器的 _挂起-执行_。

具体过程如下：

1）首先调用`generator()`生成它的控制器，即迭代器`iterator`，此时，生成器处于挂起状态；
2）第一次调用`handle`函数，并传入`iterator.next()`，这样就完成生成器的第一次调用的；
3）执行生成器，遇到`yield`生成器再次挂起，同时把`yield`后表达式的结果（未完成的 promise）传给 handle；
4）生成器挂起的同时，异步请求还在进行，异步请求完成（promise 兑现）后，会调用`handle`函数中的`iteratorValue.then()`；
5）`iteratorValue.then()`执行时内部递归调用`handle`，同时把异步请求回的数据传给生成器（`iterator.next(result)`），生成器更新数据再次执行。如果出错直接结束；
6）3、4、5 步重复执行，直到生成器结束，即`iteratorResult.done === true`，myAsync 结束调用。

> 如果看不明白，可参考下 [第一部分](https://xiaogliu.github.io/2018/07/22/generator-to-promise-to-async-1/) 生成器相关和 [第二部分](https://xiaogliu.github.io/2018/07/22/generator-to-promise-to-async-2/) Promise 相关。

# 参考

【1】[美]JOHN RESIG,BEAR BIBEAULT and JOSIP MARAS 著（2016），Secrets of the JavaScript Ninja (Second Edition)，p159，Manning Publications Co.   
【2】[async function-MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)   
【3】[await-MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)   
【4】[理解 JavaScript 的 async/await](https://segmentfault.com/a/1190000007535316)   
