---
title: 理解JS参数按值传递
date: 2017-04-18 23:08:42
tags: [JavaScript]
categories: JavaScript
e_title: understand-params-passing-by-value
---

首先要明白按值传递和按引用传递的区别以及JS当中基本类型值和引用类型值的区别。

# 按值传递和按引用传递

- 按值传递：在变量传递进函数之前，先从堆内存对象中复制一个副本，然后传入函数。所以在函数中对该变量做的任何修改，都不会影响到该变量在堆内存中引用的对象（因为修改的是副本，而非引用本身）。

- 按参数传递：传入函数中的变量实际只是指向堆内存对象的一个指针，所以，在函数内部对于该变量做的任何修改，也同步修改了该变量在堆内存中引用的对象，这样，在函数调用结束后在函数内部对该变量做的任何修改都会保留下来。

# 基本类型值和引用类型值

ECMAScript 变量可能包含两种不同数据类型的值：基本类型值(primitive values)和引用类型值(reference values)，定义如下：

> 基本类型值指的是简单的数据段，而引用类型值指那些可能由多个值构成的对象。

两种数据类型最大的区别在于对其进行复制时：

- 如果从一个变量向另一个变量复制基本类型的值时，会在变量对象上创建一个新值，然后把该值复制到为新变量分配的位置上。也就是说，新的变量是旧变量的一个副本，复制操作结束后，两者便互不相干：**改变其中一个变量，不会影响另一个变量**。见下代码及图示：   

```js
var a = 1;
var b = a;
a = 2;
console.log(b); // 1
```

![基本类型复制前后变量对象变化](https://raw.githubusercontent.com/xiaogliu/pic-lib/master/old/20170418185835.png)   

- 如果从一个变量向另一个变量复制基本类型的值时，同样也会将存储在变量对象中的值复制一份放到为新变量分配的空间中。不同的是，**这个值的副本实际上是一个指针**，而这个指针指向存储在堆中的一个对象。复制操作结束后，**两个变量实际上将引用同一个对象：改变其中一个变量，就会影响另一个变量**。见下代码及图示   

```js
var obj1 = {};
var obj2 = obj1;
obj1.name = "xiaoming";
console.log(obj2.name); // "xiaoming"
```

![引用类型复制前后变量对象变化](https://raw.githubusercontent.com/xiaogliu/pic-lib/master/old/20170418185905.png)   

# JS传参按值传递详解

《JavaScript高级程序设计》中指出JS所有参数都是按值传递的，不可能按引用传递：   

> All arguments in ECMAScript are passed by value. It is not possible to pass
  arguments by reference.   

当参数为基本类型时，这容易理解，但当参数为引用类型时，有些地方需要注意。   

## 当参数为基本类型时

当变量为基本类型时，很好理解参数传递是按值传递的，如下：

```js
var a = 1;

function changeValue(argument) {
  argument = 2;
}
changeValue(a);

console.log(a); // 1
```

在函数体内的`a`是函数体外的`a`的副本，所以在函数体内对`a`的操作不影响函数体外的`a`。

## 当参数为引用类型时

当参数为引用类型时，需要注意的点是，虽然引用类型也是按值传递，但**这里的“值”指的是引用类型指向堆内存中对象的指针**，如果仅仅是修改引用类型内部的属性值，这些修改在函数调用结束后，都会保留下来。看下面的例子  

```js
var x = {key:"foo"};

function changeKey(argument) {
  argument.key = "bar";
}

changeKey(x);
console.log(x); // {key:"bar"}
```

这是因为此时函数体内的`x`和函数体外的`x`引用的都是同一个堆内存中的对象，所以修改函数体内的`x`属性值反映到了函数体外的`x`身上。这会让人产生疑惑：当参数为引用类型时，是按引用传递，而非按值传递。其实不然，看下面的例子

```js
var x = {key:"foo"};

function changeObject(argument) {
  argument = {key:"bar"};
}
changeObject(x);

console.log(x); // {key:"foo"}
```

跟上面的例子不同的是，函数体内的`x`被重新赋值，而非修改内部的属性，如果是按引用传递，此时函数体外的`x`也会被重新赋值，但并没有。这是因为引用类型被重新赋值后，其指针在堆内存中的指向（引用类型的“值”）也发生了变化，正因为JS传参是按值传递，所以函数体内对引用类型的值（该引用类型在变量对象中的指针）的修改不会反映到函数体外。

## 帮助理解的关键概念

1、引用类型保存在变量对象中的值实际是一指针，该指针指向堆内存中的对象；   
2、**修改引用类型变量的属性值，不会修改该变量在变量对象中的指针，但会修改其对应的堆内存中的对象，同时，也影响其他指向该堆内存对象的变量**；   
3、给引用类型重新赋值实际是修改引用类型指针的指向；   
4、**给引用类型重新赋值后不会影响其之前指向的堆内存中的对象，所以若有其他变量也指向堆内存中的这个对象，不会受到影响** 。     

> - 可以把 ECMAScript 函数的参数想象成局部变量。
> - JS这种传参方式从技术上讲是**共享传参**([call-by-sharing](https://en.wikipedia.org/wiki/Evaluation_strategy#Call_by_sharing)):对形参赋值，不影响实参的值（按值传递）；但形参和实参指向同一堆内存中的对象，即**共享**同一对象，所以对形参属性值的修改也会影响实参。   

# 参考资料
【1】[Is JavaScript a pass-by-reference or pass-by-value language?](http://stackoverflow.com/questions/518000/is-javascript-a-pass-by-reference-or-pass-by-value-language)   
【2】[美]Nicholas C. Zakas 著，李松峰 曹力 译（2012），JavasSript高级程序设计，p69~p71，人民邮电出版社   
【3】[JS是按值传递还是按引用传递?](http://bosn.me/js/js-call-by-sharing/)   
