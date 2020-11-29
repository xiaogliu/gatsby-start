---
title: JavaScript数组常用方法及应用
date: 2017-06-25 14:09:18
tags: [JavaScript]
categories: JavaScript
e_title: js-array-methods-and-example
---


# 检测方法

如果判断一个对象是不是数组不能通过`typeof`，在页面当中有多个全局变量的时候`instanceof`也力不从心，为此，数组提供了原生方法`Array.isArray()`来判断一个对象是不是数组。

| 名字 | 做什么   | 返回值 | 影响原数组？ |
|:----- |:------- |:---- |:------- |
| Array.isArray() | 判断一个对象 | true of false：若对象为数组返回true，反之返回false | 否 |

语法：

```js
Array.isArray(obj)
```

应用举例：

```js
var str = '123';
var arr = [];
console.log(Array.isArray(str)); // false
console.log(Array.isArray(arr)); // true
```

> `typeof`用来确定某个变量是哪种基本数据类型（string, number, boolean, undefined），对于引用类型，`typeof`只能区分"function"，对于其他引用类型和null都返回"object"。若能保证页面中只有一个全局变量（未嵌套多个框架），可以通过`instanceof`确定变量是哪种引用类型。但实际应用中，一般只需要区分引用类型中的数组，所以`Array.isArray()`使用很频繁。


# 迭代方法

ES5定义了5个迭代方法，每个方法都接受两个参数：在每一项运行的函数和运行该函数的作用域对象---影响`this`指向。第二个参数为可选参数，通常不用。   

语法：


```js
arr.forEach(callBackFn(element[, index][, array])[, thisArg])
```

> 方括号表示可选参数，而非数组。

五个迭代方法对比如下：    

| 名字        | 做什么          | 返回值                                        | 影响原数组？ | 应用场景                    |
|:---------- |:------------- |:------------------------------------------- |:------- |:------------------------ |
| every()   | 对数组每一项运行给定函数 | true or false：如果数组每一项运行给定函数都返回true，则返回true | 否      | 判断数组所有项是否满足某一条件，比如数值比较 |
| filter()  | 同上           | 数组：返回数组中执行给定函数后返回值为true的项组成的数组             | 否      | 将符合某种条件的项过滤出来           |
| forEach() | 同上           | 没有返回值：与使用for循环迭代数组一样，但更方便，注意没法中断           | 否      | 代替for循环进行数组迭代           |
| map()     | 同上           | 数组：返回每次执行给：定函数的结果构成的数组，长度和原数组一样            | 否      | 对数组中的项做统一处理             |
| some()    | 同上           | true or false：数组中任一项执行给定函数返回true，则返回true   | 否      | 数组中是否有满足某一条件的项          |

应用举例：

## every()

```js
var arr = [1, 2, 3, 4];
var isAllBig = function (element) {
  return element >= 2;
};
arr.every(isAllBig); // false
```

另外一个常用的场景是判断数组中某个属性值是否完全相同（有变化）

```js
arr = [{q: 1,d: 2}, {q: 1,d: 2}, {q: 1,d: 2}, {q: 1,d: 2}]
var n = arr[0].d;
arr.every(function (item) {
  return item.d === n;
}); // true

arr = [{q: 1,d: 3}, {q: 1,d: 2}, {q: 1,d: 2}, {q: 1,d: 2}]
var n = arr[0].d;
arr.every(function (item) {
  return item.d === n;
}); // false
```

## filter()

```js
var arr = [1, 2, 3, 4];
var getSmallElement = function (element) {
  return element < 2;
};
arr.filter(getSmallElement); // [1]
```

## forEach()

```js
var arr = [1, 2, 3, 4];
var res = [];
var getAnotherArr = function (element) {
  res.push(element * 2)
};
arr.forEach(getAnotherArr);
console.log(res); // [2, 4, 6, 8]
```

> 注意和使用`map()`达到同样效果的区别。实现同样效果有多种方法，找出最优解

## map()

```js
var arr = [1, 2, 3, 4];
var res = []
var getAnotherArr = function (element) {
  return  element * 2;
};
res = arr.map(getAnotherArr);
console.log(res); // [2, 4, 6, 8]
```

## some()

```js
var arr = [1, 2, 3, 4];
var isSomeBig = function (element) {
  return element >= 2;
};
arr.some(isSomeBig); // true
```

> 注意和`every()`方法的区别

# 栈方法

栈是一种数据结构，访问规则是LIFO(Last-In-First-Out):后进先出，动作之发生在栈头，通过`push()`和`pop()`可实现这种访问规则。

| 名字 | 做什么   | 返回值 | 影响原数组？ |
|:----- |:------- |:---- |:------- |
| push() | 在数组尾部添加任意多个项 | 数值：修改数组的长度 | 是 |
| pop() | 移除数组最后一项 | 被移除的项 | 是 |

## push()

语法：

```js
arr.push([element1[, ...[, elementN]]]);
```

数组中最常用的方法了吧，使用举例：

```js
var arr = [1, 2];
var count = arr.push('a', 'b');
console.log(arr); // [1, 3, '1', 'b']
console.log(count); // 4
```

## pop()
语法：

```js
arr.pop()
```

使用举例：

```js
var arr = [1, 2, 3, 4];
var deleteElement = arr.pop();
console.log(arr); // [1, 2, 3]
console.log(deleteElement); // 4
```
> 因为`pop()`方法只能返回一个元素，所以返回的数据类型不是数组。

# 队列方法

队列数据结构访问规则是FIFO(First-In-First-Out)：先进先出，结合`shift()`和`push()`方法可以模拟这种访问规则。同时，结合`unshift()`和`pop()`方法可以从相反的方向来模拟队列。

| 名字 | 做什么   | 返回值 | 影响原数组？ |
|:----- |:------- |:---- |:------- |
| shift() | 移除数组第一项 | 被移除的项 | 是 |
| unshift() | 在数组前端添加任意多个项 | 数值：修改后数组的长度 | 是 |

## shift()

语法：

```js
arr.shift();
```

队列访问规则：

```js
var arr = [1, 2, 3];
var deleteElement = arr.shift();
console.log(arr); // [2, 3]
console.log(deleteElement); // [1]
```
## unshift()

语法：

```js
arr.unshift();
```

反方向队列访问规则：

```js
var arr = [1, 2, 3];
var count = arr.unshift(4);
console.log(count); // 4
console.log(arr); // [4, 1, 2, 3]
```

# 转换方法

这里的转换指的是数组到字符串的转换。数组有继承自Object对象的两个转换方法`toString()`和`toLocalString()`，但更实用的是数组内置方法`join()`

| 名字 | 做什么   | 返回值 | 影响原数组？ |
|:----- |:------- |:---- |:------- |
| join() | 将数组所有项拼接为字符串，并可以指定分隔符 | 字符串：数组中所有项组成的字符串，用指定的分隔符分割 | 否 |
| toString() | 将数组中所有项拼接为字符串，只能用逗号分割 | 字符串：数组中所有项组成的字符窜，以逗号分割 | 否 |
| toLocalString() | 同上 | 同上 | 否 |

> `toLocalString()`和`toString()`区别主要体现在数据表现于地区有关的情况下，比如日期，在此不作讨论，详见MDN的[Array.prototype.toLocaleString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toLocaleString)

## join()

语法：

```js
arr.join()
arr.join(separator)
```

> 注意，分隔符一定要放在引号内（ES6也可用反引号，总之是字符串的形式）

应用举例：

```js
var arr = [1, 2, 3];
var newArr = arr.join('|');
console.log(newArr) // '1|2|3'
```

更实用的例子： 反转字符串

```js
var str = 'i am student';
var strArr = str.split(' ');
var revStr = strArr.reverse().join(' ');
console.log(revStr); // 'student am i'
```

> 这里使用了字符串[`split()`方法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split)

# 操作方法

操作方法有`concat()`, `slice()`以及**万能的**`splice`方法，三种方法对比如下：   


| 名字 | 做什么   | 返回值 | 影响原数组？ |
|:----- |:------- |:---- |:------- |
| concat() | 拼接数组 | 数组：拼接后的新数组 | 否 |
| slice() | 截取数组中指定的部分 | 数组：截取的数组 | 否 |
| splice() | 入参不同可以实现数组的增、删、改 | 数组：删除的元素组成的数组 | 是 |

**应用举例**

## concat()

语法：

```js
var new_array = old_array.concat(value1[, value2[, ...[, valueN]]])
```

举例：

```js
var arr = [1, 2, 3, 4];
var res = arr.concat(5);
console.log(res); // [1, 2, 3, 4, 5]
```
> 如果不传参，返回元素组的副本

## slice()

语法：

```js
arr.slice();
arr.slice(begin);
arr.slice(begin, end);
```

如果`slice()`方法中不传参数，返回整个数组；只传入一个参数，返回从此位置至数组末尾的元素组成的数组；如果传入两个参数，则返回**第一个参数（包括）至第二个参数（不包括）之间的元素组成的数组**。

举例：

```js
var arr = [1, 2, 3, 4];
var res = arr.slice(0);
var res1 = arr.slice(1);
var res2 = arr.slice(1, 2);
console.log(res); // [1, 2, 3, 4]
console.log(res1); // [2, 3, 4]
console.log(res2); // [2]
```

> `slice()`也接受负数参数，在此不作讨论。

## splice()

语法：

```js
array.splice(start)
array.splice(start, deleteCount)
array.splice(start, deleteCount, item1, item2, ...)
```

`splice()`方法可以对数组进行增、删、改的操作：

| 操作 | 入参 | 返回 |
|:----- |:------- |:---- |
| 删除 | 两个参数：要删除的第一项的位置和要删除的项数 | 数组：删掉的元素组成的数组 |
| 插入 | 三个参数：起始位置、0（删除0项）、要插入的项 | 数组：空数组（删掉的项） |
| 替换 | 三个参数：起始位置、要删除的项数、要插入的项（**当删除的项数和插入的项数相等时，实现更改的目的**） | 数组：删掉的元素组成的数组 |

splice()应用举例   

删除   

```js
var arr = [1, 2, 3, 4];
var removed = arr.splice(1, 2);
console.log(arr); // [1, 4]
console.log(removed); // [2, 3]
```

> 如果不传参，不对数组进行任何操作；如果只传递一个参数，则以此参数为起始位置（包含），删除数组之后所有的项

插入   

```js
var arr = [1, 2, 3, 4];
var removed = arr.splice(1, 0, 5);
console.log(arr); // [1, 2, 5, 3, 4]
console.log(removed); // []
```

替换

```js
var arr = [1, 2, 3, 4];
var removed = arr.splice(1, 1, 'a');
console.log(arr); // [1, 'a', 3, 4]
console.log(removed); // [2]
```

> 要删除的项没必要和要添加的项相等

# 重排序方法

数组中内置两个原生的重排序方法：`sort()`和`reverse()`。  

| 名字 | 做什么   | 返回值 | 影响原数组？ |
|:----- |:------- |:---- |:------- |
| sort() | 默认将数组按升序排序（先转为字符串，有坑） | 数组：排序后的原数组 | 是 |
| reverse() | 反转数组原来的顺序 | 数组：反转后的原数组 | 是 |

## sort()

语法：

```js
arr.sort();
arr.sort(compareFn);
```

`sort()`方法可以接受可选参数：比较函数。如果没有比较函数，`sort()`方法默认升序排序，但不是数值升序，而是先调用数组每一项的`toString()`方法，然后比较字符串，这和常识有点相悖。

```js
var arr = [1, 2, 3, 10, 4];
arr.sort();
console.log(arr);  // [1, 10, 2, 3, 4]
```

因为字符串中"10"是在"2"之前的。

为了实现数值的比较，可以传入比较函数作为`sort()`方法的入参。


```js
var arr = [1, 2, 3, 10, 4];
var compareFn = function (v1, v2) {
  return v1 - v2;
};
arr.sort(compareFn);
console.log(arr);  // [1, 2, 3, 4, 10]
```

> 比较函数执行过程：如果第一个参数应该位于第二个参数之前，则返回负数；反之，返回正数；相等返回0。这里是数值比较。

**Tips**：常见的业务场景是：数组元素由对象组成，根据对象中属性的值进行排序，比如：

```js
var sortByTime = function(v1, v2) {
  return v1.create_time - v2.create_time
};

var readMsg = [{"uid": 6, "create_time": 1498458322}, {"uid": 7, "create_time": 1498527524}];

readMsg.sort(sortByTime);
```

## reverse()

语法：

```js
arr.reverse()
```

`reverse()`方法实现对字符串的反转，见下面的例子：

```js
var arr = [1, 3, 4, 2];
arr.reverse();
console.log(arr); // [2, 4, 3, 1]
```

# 位置方法

ES5为数组提供了两个位置方法：`indexOf()`和`lastIndexOf()`。

| 名字 | 做什么   | 返回值 | 影响原数组？ |
|:----- |:------- |:---- |:------- |
| indexOf() | 从数组开头向后查找提供元素的索引值 | 索引值：第一个符合条件的元素的索引值 | 否 |
| lastIndexOf() | 从数组末尾向前查找提供元素的索引值 | 同上 | 否 |

## indexOf()   

语法：

```js
arr.indexOf(searchElement[, fromIndex])
```

应用举例：

```js
var arr = [1, 1, 1, 2];
var index = arr.indexOf(1);
console.log(index); // 0
```
> 返回**第一个**符合条件的元素的索引值。**indexOf()方法也可以很方便的判断某元素是否是数组里的元素**。

# 归并方法

所谓归并方法就是将一个数组中的所有项归并为一个值，数组提供了两个原生的归并方法：`reduce()`和`reduceRight()`。


| 名字 | 做什么   | 返回值 | 影响原数组？ |
|:----- |:------- |:---- |:------- |
| reduce() | 将数组中所有项通过加性操作符归并为一个值，从左往右加 | 归并后的值 | 否 |
| [reduceRight()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/ReduceRight) | 将数组中所有项通过加性操作符归并为一个值，从右往左加 | 同上 | 否 |

## reduce()

`reduce()`方法可以实现数组求和，如下：

```js
var arr = [1, 2, 3, 4];
var sum = arr.reduce(function (prev, cur) {
  return prev + cur;
});
console.log(sum); // 10
```

> 关于`reduce()`更多介绍请查看MDN[Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)

# 参考资料

【1】[JavaScript Array on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
【2】[美]Nicholas C. Zakas 著，李松峰 曹力 译（2012），JavasSript高级程序设计，p86~p97，人民邮电出版社   
