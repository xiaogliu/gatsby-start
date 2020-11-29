---
title: Async函数和Promise对象
date: 2017-07-16 11:23:46
tags: [ES7]
categories: JavaScript
e_title: async-function-promise-object
---

Async函数已写入ES7标准中，通过async函数可以更友好直观的写异步代码。调用Async函数时返回的是一个Promise对象，所以，介绍Async函数之前，有必要先介绍下Promise对象。

# Promise对象

## 为什么要用

在实际工作中，经常会遇到这样的场景：接口A需要的入参是接口B响应中的部分或全部内容，这时在执行请求接口A的代码时就需要等待接口B响应完成以后再执行，这就涉及**异步调用**。   

异步调用最开始是通过回调函数进行的，但当代码依赖增多时，回调函数的写法就会变得难以维护（比如极端情况，接口A的入参依赖接口B的响应，接口B的入参依赖接口C的响应，接口C的入参依赖接口D的响应...）。而Promise对象就是解决**回调函数地狱**（callback hell。回调函数本身没有问题，但嵌套多个回调函数就变得难以维护了）的问题：它可以用类似写同步代码的模式写异步调用。

> 这里异步调用不是说JS可以异步执行：JS是单线程（single-threaded），总是同步执行，但有多种多样的回调机制（callback mechanisms）。通过回调机制，可以实现异步操作。注意，回调函数只是多种多样的回调机制中的一种，正在介绍的Promise对象和将要介绍的Async函数都是回调机制的一种。

## 定义

`promise`是一个对象，它可以用于表示一个异步操作的执行结果（成功或者失败）并将执行结果返回。

> promise，顾名思义，“承诺”将来的某个时间点返回结果。

## 语法

```js
new Promise(function(resolve, reject) { ... });
```

既然`promise`是对象，便可通过构造函数创建`promise`实例，Promise构造函数接受一个函数作为参数，而作为Promise的入参，该函数又接受两个函数作为入参：其中第一个函数（通常命名为`resolve`）在`promise`返回预期结果时调用，第二个函数（通常命名为`reject`）在不能如期返回结果时调用。

> 为便于描述，以下如预期结果称为resolve的情况，不然称为reject的情况。

## 常用方法`then()`与`catch()`

通常，promise 实例和then()以及catch()方法一起使用。

- `then()`方法返回一个`promise`，最多接受两个函数作为参数，分别处理resolve和reject两种情况：第一个参数是promise resolve时执行的回调函数，并且resolve的值作为入参传入回调函数；第二个参数是promise reject时调用的回调函数，并且将reject的原因作为参数传入回调函数。

> 更常用的是resolve时使用then()方法，reject时使用catch()方法。

语法如下：

```js
p.then(onFulfilled[, onRejected]);

p.then(function(value) {
  // fulfillment
}, function(reason) {
  // rejection
});
```

- `catch()`方法也返回一个`promise`，但只接受一个函数作为参数，只在reject时执行。

语法如下：

```js
p.catch(onRejected);

p.catch(function(reason) {
   // rejection
});
```

## 举几个例子

- 模拟异步请求：生成随机数，如果随机数小于1则认为是resolve的情况，执行resolve函数；如果大于1，则认为reject，执行reject函数。

```js
let p = new Promise(function (resolve, reject) {
  console.log('promise starting');
  let timeOut = Math.random() * 2;
  console.log('the random number is ' + timeOut + '...');

  // 模拟异步执行需要的时间
  setTimeout(function () {
    if (timeOut < 1) {
      console.log('返回结果如预期，调用resolve()...');
      resolve('200 OK');
    } else {
      console.log('没得到预期返回结果，调用reject()...');
      reject('请求超时：' + timeOut + 'second ...');
    }
  }, timeOut * 1000);
});

p.then(function (resolveValue) {
  console.log(resolveValue);
}).catch(function (rejectReason) {
  console.log(rejectReason);
});
```

- 模拟promise强大之处：链式调用

```js
let p = new Promise(function (resolve, reject) {
  console.log('直接返回resolve的promise');
  resolve(5);
});

let multiply = function (input) {
  return new Promise(function (resolve, reject) {
    console.log('计算' + input + '*' + input + '...');

    // 设置1s的计算延时，同样，认为为resolve的情况
    setTimeout(resolve, 1000, input * input);
  });
};

let add = function (input) {
  return new Promise(function (resolve, reject) {
    console.log('计算' + input + '+' + input + '...');
    setTimeout(resolve, 1000, input + input);   
  });
};

p.then(multiply)
 .then(add)
 .then(multiply)
 .then(add)
 .then(function (result) {
    console.log('最终结果是' + result);
 });
```

# Async函数

## 为什么要用

Promise对象相比回调函数已直观很多：将横向发展的回调函数变成了链式的写法。但Promise对象在编写和理解上实际并没有那么轻松。   

**而调用Async函数时会自动返回一个Promise对象：当这个异步函数返回预期值时，Promise会调用resolve方法处理这个预期值；如果这个异步函数抛出异常或者返回非法值时，Promise会调用reject方法进行处理。**

虽然依然使用Promise，但这一切都是交给Async函数去处理，我们不需要编写代码处理Promise对象，只关注返回值就好了。

## 语法

Async函数本身的语法为：

```js
async function name([param[, param[, ... param]]]) {
   statements
}
```

在普通函数前面加`async`关键字就变成了Async函数。

## `await`表达式

通常Async函数都会搭配`await`表达式和`try-catch`语句一起使用，代码格式为：

```js
async function myFirstAsyncFunction() {
  try {
    let fulfilledValue = await promise;
  }
  catch (rejectedValue) {
    // 捕获异常
  }
}
```
关于`await`表达时的几点说明：

- await表达式必须放在Async函数中使用；
- await表达式后面可以跟一个Promise对象或者任何待解析的值（通常都是promise对象，不然没啥意义了），**在等待Promise返回值时，Async函数暂停执行`await`表达式后面的代码，但不会阻塞JS主线程，即Async函数后面的代码正常执行**。

具体参见下面重写的promise例子。

## 重写promise的例子

- 模拟异步请求

```js
// 模拟异步请求生成的promise对象
let p = new Promise(function (resolve, reject) {
  console.log('promise starting');
  let timeOut = Math.random() * 2;
  console.log('the random number is ' + timeOut + '...');

  // 模拟异步执行需要的时间
  setTimeout(function () {
    if (timeOut < 1) {
      console.log('返回结果如预期，调用resolve()...');
      resolve('200 OK');
    } else {
      console.log('没得到预期返回结果，调用reject()...');
      reject('请求超时：' + timeOut + 'second ...');
    }
  }, timeOut * 1000);
});

(async function () {
  try {
    console.log(111);
    var resolvedP = await p; // promise返回结果之前，函数暂停执行
    console.log(222);
    console.log(resolvedP);
  } catch (error) {
    console.log(333);
    console.log(error);
  }
})();

console.log(444); // await等待promise的时候并不阻塞JS主线程，先于console.log(222)或者console.log(333)执行
```

- promise链式写法重写

```js
let p = new Promise(function (resolve, reject) {
  console.log('直接返回resolve的promise');
  resolve(5);
});

let multiply = function (input) {
  return new Promise(function (resolve, reject) {
    console.log('计算' + input + '*' + input + '...');

    // 设置1s的计算延时，同样，认为为resolve的情况
    setTimeout(resolve, 1000, input * input);
  });
};

let add = function (input) {
  return new Promise(function (resolve, reject) {
    console.log('计算' + input + '+' + input + '...');
    setTimeout(resolve, 1000, input + input);   
  });
};

(async function () {
  let a = await p;
  let b = await multiply(a);
  let c = await add(b);
  let d = await multiply(c);
  let e = await add(d);
  console.log('最终结果是' + e)
})();
```


# 参考资料
【1】[Promise](http://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/0014345008539155e93fc16046d4bb7854943814c4f9dc2000)    
【2】[MDN-Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)    
【3】[ES6 Promises](http://www.datchley.name/es6-promises/)   
【4】[async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)   
【5】[Async functions - making promises friendly](https://developers.google.com/web/fundamentals/getting-started/primers/async-functions)   
【6】[单线程模型](http://javascript.ruanyifeng.com/advanced/single-thread.html)   
【7】[JavaScript 既是单线程又是异步的，请问这二者是否冲突，以及有什么区别？](https://www.zhihu.com/question/20866267)   
【8】[Javascript异步编程的4种方法](http://www.ruanyifeng.com/blog/2012/12/asynchronous%EF%BC%BFjavascript.html)   
【9】[When is JavaScript synchronous?](https://stackoverflow.com/questions/2035645/when-is-javascript-synchronous)   
