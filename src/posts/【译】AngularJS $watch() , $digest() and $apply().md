---
title: '【译】AngularJS $watch() , $digest() and $apply()'
date: 2017-04-27 23:10:50
tags: [AngularJS]
categories: AngularJS
e_title: watch-digest-apply-in-angular
---

# 概述

从某种程度上讲，`$watch()`,`$digest()`和`$apply()`是AngularJS核心函数的一部分，明白他们是怎么工作的，对于理解AngularJS至关重要。   

当在视图中与`$scope`对象上的变量进行数据绑定时，AngularJS自动创建了“监听”事件，这意味着AngularJS时刻监测着`$scope`对象上变量的变化。“监听”工作是通过`$scope.$watch()`函数创建的，这也是这篇文章接下来要讲述的。   

在应用程序很多关键地方，AngularJS都会调用`$scope.$digest()`函数。如果某个被监听的变量发生了变化，`$digest()`函数会遍历所有watcher（译者注：可以理解为`watch()`函数创建的监听器），检查是否还有其他变量发生了变化。如果检测到有变量发生了变化，对应的监听函数(listener function)就会执行，监听函数可以执行任何需要的操作，比如更新视图中对应的文本信息。所以，**`$digest()`函数就是触发绑定的数据进行更新**。   

大部分时候，AngularJS会自动调用`$scope.$watch()`和`$scope.$digest()`函数，但有些时候你必须自己调用他们。因此，知道他们是怎么工作的是很有必要的。   

**`$scope.$apply()`函数用来执行某些代码，代码执行完成后调用`$scope.$digest()`**，所以此时所有的watcher都会被检查。因此当把AngularJS和其他代码集成时`$apply()`很有用。   

接下来，会详细介绍`$watch()`,`$digest()`和`$apply()`函数。   

# $watch()

`$scope.watch()`函数在变量上创建watcher。当创建watcher时，向`$watch()`函数传递了两个函数作为入参：   

- 值函数（value function）   
- 监听函数（listener function）（译者注：即回调函数，当检测到变化时在这个函数中定义要执行的操作）   

这是一个例子：   

```js
$scope.$watch(function () {}, function () {});
```

第一个函数时值函数，第二个函数是监听函数。   

值函数应该返回被监听变量的值。AngularJS会检查当前返回的值和最后一次返回的值是否相同，这样AngularJS就可以判断变量的值是否发生变化，下面是一个例子：   

```js
$scope.$watch(function (scope) { return scope.data.myVar },
    function () {}
);
```

在这个例子中，值函数返回了`$scope`对象的变量`scope.data.myVar`。如果这个变量的值发生了变化，不同的值便会返回，这样，AngularJS就会触发监听函数。   

注意这里值函数是将scope作为入参的（没有前缀$）。通过这个参数，值函数可以访问`$scope`对象及定义在上面的变量。当然，值函数也可以监听全局变量，但更多时候，只是监听`$scope`对象上的变量。   

如果被监听的变量值发生了变化，监听函数可以执行定义在其上的任何操作。比如，改变另一个变量的值，或者更新某个html元素或者其他什么事。下面是一个例子：   

```js
$scope.$watch(function (scope) { return scope.data.myVar },
    function (newValue, oldValue) {
      document.getElementById("someId").innerHTML = "<b>" + newValue + "</b>";
    }
);
```

在这个例子中，把id为`someId`的html元素的内容更新为变量`scope.data.myVar`的新值，同时被`b`元素包裹以便使内容加粗。当然，也可以通过`{{data.myVar}}`来达到同样的效果，这里只是为了展示监听函数可以执行的操作。   

# $digest()

`$scope.$digest()`函数循环时会遍历`$scope`对象（以及它的子`$scope`对象，如果有的话）上所有的watcher。**在遍历watcher时，同时会调用watcher上的值函数，如果检测到返回值发生了变化，便会触发对应的监听函数**。   

**`$digest()`函数会在AngularJS认为有必要时被调用**。比如，当按钮的点击事件触发时或者AJAX请求返回时（当`done()`/`fail()`回调函数执行完成后）。   

但这种调用机制在实际使用中可能会遇到AngularJS没有及时调用`$digest()`函数的情况。所以，当遇到数据没有及时更新时，应该手动检查下是不是AngularJS没有及时调用`$digest()`函数导致的。这种情况下，如果手动触发下`$scope.$digest()`应该就会正常工作了。或者，可以通过`$scope.$apply()`代替手动检查，下面会详述。   

# $apply()

`$scope.$apply()`函数会接受一个函数作为入参，这个函数会在`$apply()`函数调用时被执行，当这个函数执行完成后，`$scope.$digest()`便被触发。这可以更容易的保证所有的watcher都被检查，从而使绑定的数据得到更新。下面是一个应用`$apply`的例子：   

```js
$scope.$apply(function () {
  $scope.data.myVar = "Another value";
});
```

这个作为参数传进`$apply`的函数改变了`$scope.data.myVar`的值，一旦这个函数执行完，AngularJS会调用`$scope.$digest()`，从而保证所有被监听的数据都得到更新。   

# 案例

为了说明`$watch()`,`$digest()`和`$apply()`怎么工作的，来看下面的例子：   

```html
<div ng-controller="myController">
  {{data.time}}
<br/>
<button ng-click="updateTime()">update time - ng-click</button>
<button id="updateTimeButton"  >update time</button>
</div>

<script>
var module = angular.module("myapp", []);
var myController1 = module.controller("myController", function ($scope) {

  $scope.data = {
    time: new Date()
  };

  $scope.updateTime = function () {
    $scope.data.time = new Date();
  }

  document.getElementById("updateTimeButton")
    .addEventListener('click', function () {
      console.log("update time clicked");
      $scope.data.time = new Date();
    });
});
</script>
```

在这个例子中，将`$scope.data.time`绑定到了HTML页面，同时，也为`$scope.data.time`创建了watcher。   

这个例子中包含两个按钮，第一个按钮添加了`ng-click`，当按钮点击时，`$scope.updateTime()`函数被调用，之后，AngularJS调用`$scope.$digest()`使绑定的数据得以更新。

第二个按钮是在控制器函数中添加的标准JavaScript监听事件。当按钮被点击时，执行监听函数。正如你所见，这两个按钮上的监听函数做着几乎一样的事情，但是当第二个按钮上的监听函数被调用时，绑定的数据并没有更新。这是因为当第二个按钮的监听函数执行以后`$scope.$digest()`没有被调用。因此，当点击第二个按钮时，尽管`$scope.data.time`上的时间更新了，但是更新的时间并没有在HTML中展示出来。   

为了解决这个问题，我们可以在第二个按钮监听事件的最后一行添加`$scope.$digest()`来触发`$digest`函数。   

```js
document.getElementById("updateTimeButton")
  .addEventListener('click', function() {
    console.log("update time clicked");
    $scope.data.time = new Date();
    $scope.$digest();
  });
```

除了在第二个按钮的监听函数内部调用`$digest()`，还可以如下所示，使用`$apply()`函数   

```js
document.getElementById("updateTimeButton")
  .addEventListener('click', function() {
    $scope.$apply(function() {
      console.log("update time clicked");
      $scope.data.time = new Date();
    });
  });
```

注意如何在按钮的监听事件中调用`$scope.$apply()`以及`$scope.data.time`的值是如何更新的。这样，当`$apply`函数执行完成后，AngularJS自动启用digest循环，所以数据得到了更新。   

> 译者注：总结下，`$watch()`检测变化，并且在检测到变化时可以通过监听函数执行相关操作；但`$watch()`不会自己执行，这时`$digest()`就登场了，`$digest()`被触发后会遍历watcher，遍历的过程也就是触发每个watcher的过程；但`$digest()`触发时机是由AngularJS决定的，有可能出现该触发时未触发的情况，从而导致视图中的数据未及时更新；这时`$apply()`又登场了，其入参为一函数，该函数执行完毕紧接着会触发`$digest()`，从而保证在该函数里面更新的数据一定会同步更新到视图中。   

# 文章出处

原文链接：[AngularJS $watch() , $digest() and $apply()](http://tutorials.jenkov.com/angularjs/watch-digest-apply.html)   
原作者：[Jakob Jenkov](https://twitter.com/jjenkov)
