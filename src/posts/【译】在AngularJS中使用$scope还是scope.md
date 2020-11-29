---
title: 【译】在AngularJS中使用$scope还是scope
date: 2017-04-13 22:31:55
tags: [AngularJS]
categories: AngularJS
e_title: $scope-or-scope-in-angular
---

当我最开始接触AngularJS时，在任何地方我一直都用AngularJS提供的变量`$scope`，过去两年一直如此。直到一周以前，Jonathan Rowny指出在某些情况下我错用了`$scope`。因此，在命名的时候我做了一些改变。    

Rowny指出，`$scope`前面的`$`标志是指明这个scope被注入到当前执行环境，但不是所有涉及scope的地方都基于依赖注入。举个例子，比如在`$watch`或指令中的`link()`函数中，`scope`仅仅是个**位置参数**，至于叫什么名字，无关紧要。因此，这种情况下，不应该加前缀`$`。请看下面代码:   

- 无依赖注入的函数我之前写的代码

```js
function link( $scope, element, attributes ) {
  // ...with $
}
```

- 更改后

```js
function link( scope, element, attributes ) {
  // ...without $
}
```

我知道这有点吹毛求疵，但我喜欢让代码富有意义---这样令我开心。

_(下面是评论中更详细的讨论)_   

在AngularJS中，当参数是通过**依赖注入**的形式传入的时候，参数在参数列表中的位置无关紧要。举个例子，我可以这样定义Controller：   

- scope在第一位

```js
app.controller( "MyController", function( $scope, $timeout, $http ) { .. } );
```

- 或者这样：scope在最后一位

```js
app.controller( "MyController", function( $timeout, $http, $scope ) { .. } );
```

上面两种写法都一样，因为通过依赖注入的形式传参时AngularJS不关心参数的顺序，只关注他们的名字：在AngularJS执行时，会通过参数名在依赖注入容器中调用相关功能。   

而在另外一些方法中，比如，指令中使用到的`link()`函数，它接受scope作为入参，此时参数位置是很重要的，而参数名无关紧要。也就是说，你可以像这样定义link函数：   

```js
function link( scope, element, attributes ) { ... }
```

或者这样：

```js
function link( FOO, BAR, BAZ ) { ... }
```

后面的例子中，`Foo=scope`, `Bar=element`, `Baz=attributes`，这是因为此时AngularJS不关心你怎么定义变量名，只关注变量位置（也就是：`Scope:0`, `Element:1`, `Attributes:2`, `Controller:3`, `Transclude:4`）。   

Controllers, Services, Factories, and Directive functions都使用依赖注入，但据我所知，下面的函数没有使用依赖注入，而是使用了位置参数（其中一个参数是`scope`）

```js
// Linking functions (and probably other pre-link functions).
function link( scope ) { ... }

// Watch expressions (not handlers).
$scope.$on( function watchExpression( scope ) { ... }, .... )

// Transclude clone functions.
transclude( function linkClonedNode( clone, scope ) { ... } )
```

出处：[When To Use $scope vs. scope In AngularJS](https://www.bennadel.com/blog/2716-when-to-use-scope-vs-scope-in-angularjs.htm) - [Ben Nadel](https://twitter.com/BenNadel)
