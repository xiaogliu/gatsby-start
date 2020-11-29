---
title: AngularJS指令命名规则
date: 2017-04-15 12:29:05
tags: [AngularJS,Normalization]
categories: AngularJS
e_title: normalization-name-angular-directive
---

# 命名规范

同一个AngularJS指令，在js文件和html文件中有着不同的命名规范：在js文件中使用标准的**小驼峰命名法**，在html文件中使用“**小写字母+连接符**”的命名法。如下表所示   

| 在js文件中 | 在html文件中 |
| ---       |   ---       |
| ngApp     |   ng-app    |
| myDirective | my-directive |

# 处理机制   

AngularJS之所以选择这样的命名方式，是因为html文件不区分大小写，而js文件则对大小写敏感（`myDir`和`mydir`在js文件中是不同的指令，但html看来是同一个指令），为了避免可能出现的错误，所以使用上述命名规范。   
AngularJS执行过程中，对“**小写字母+连接符**”形式的命名做如下处理，最终装换成**小驼峰命名法**：   

1. 去掉开始部分的`x-`和`data-`;
2. 第一个单词不变，把连接符后面的单词首字母转换成大写，去掉连接符。   

> 这里有两点需要**注意**：
- 指令命名时不要以`x`或`data`作为第一个单词   
- 支持的链接符包括`:`,`-`和`_`，但通常会选择`-`作为连接符   

# 隔离作用域对象中的属性命名

指令隔离作用域对象中属性命名规则同上，见下面代码：

```js
.directive('myDirective', function() {
  return {
    restrict: 'A',
    scope: {
      myUrl: '@', // 隔离作用域对象中属性命名为小驼峰命名法
      myLinkText: '@'
    },
    template: '<a href="{{myUrl}}">{{myLinkText}}</a>'
})
```

```html
<div my-directive
     my-url="http://google.com" <!-- html文件中使用“小写字母+分割符”的命名方式-->
     my-link-text="Click me"
     ></div>
```

# 参考资料
【1】[Creating Custom Directives - Normalization](https://docs.angularjs.org/guide/directive)   
【2】[How are the attribute prefixes “x-” and “data-” used in AngularJS](http://stackoverflow.com/questions/15256396/how-are-the-attribute-prefixes-x-and-data-used-in-angularjs)   
【3】[美]Ari Lerner 著，赵望野 徐飞 何鹏飞 译（2014），AngularJS权威教程，p52，人民邮电出版社
