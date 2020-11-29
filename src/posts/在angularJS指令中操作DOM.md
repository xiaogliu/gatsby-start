---
title: 通过AngularJS指令操作DOM
date: 2017-04-12 19:36:57
tags: [AngularJS,jQuery]
categories: AngularJS
e_title: manipulate-dom-use-angular-directive
---

# 在指令而非在控制器中操作DOM

在页面处理中，难免会遇到操作DOM的情况，在AngularJS中，对DOM的操作是在指令而非控制器中完成的。

> AngularJS强调隔离的思想：把复杂的逻辑和操作放在指令或服务中，控制器作为视图和$scope之间的桥梁，仅仅用来存储数据模型。    

# jqLite

为了便于DOM操作，AngularJS内部封装了`angular.element`，如果现有项目中已经引入的jQuery，`angular.element`相当于jQuery函数的别名，否则，`angular.element`代表AngularJS对jQuery封装的一个子集，称为"jQuery lite"或者**jqLite**。**jqLite** 不具备jQuery全部方法，详见AngularJS官方文档 [angular.element](https://docs.angularjs.org/api/ng/function/angular.element)。   

# link-function

link-function可以注册DOM监听器，同时更新DOM，更多link-function介绍参考这篇文章[AngularJS Custom-Directives link-function guide](http://websystique.com/angularjs/angularjs-custom-directives-link-function-guide/)   

# 指令代码

一个引入jQuery操作DOM的指令如下：   

```js
webApp.directive("detailTopStick", ["$timeout", "$window", function ($timeout, $window) {
  return {
    restrict: "A",
    link: function (scope) {
      $timeout(function () {
        var navbar = $(".navbar-nav");
        var navbarOffsetTop = navbar.offset().top;
        var headerInfo = $(".header-info");
        var headerInfoMarginBottom = parseInt(headerInfo.css("margin-bottom"));
        var navbarHeight = parseInt(navbar.css("height"));

        angular.element($window).bind("resize", function () { // 窗口绑定resize事件
          navbar.css("width", headerInfo.width());
          navbarOffsetTop = navbar.offset().top;
          scope.$apply();
        });

        angular.element($window).bind("scroll", function () {
          if ($window.scrollY > navbarOffsetTop) {
            navbar.css("width", headerInfo.width());
            navbar.addClass("detail-navbar-fix");
            headerInfo.css("margin-bottom", headerInfoMarginBottom + navbarHeight);
          }
          else {
            navbar.removeClass("detail-navbar-fix");
            headerInfo.css("margin-bottom", headerInfoMarginBottom);
          }
          scope.$apply();
        });

        navbar.on("click", function () {
          if ($window.scrollY > navbarOffsetTop) {
            $window.scrollTo(0, navbarOffsetTop);
          }
        });
      });
    }
  };
}]);
```

> 如果未引入jquery，可以这样获取元素：angular.element(document.querySelector(".class-name"))

参考资料：   
【1】[Finding HTML element by css class name in angularJS](http://www.dotnetlearners.com/blogs/view/168/finding-html-element-by-css-class-name-in-angularjs.aspx)  
【2】[AngularJS Custom-Directives link-function guide](http://websystique.com/angularjs/angularjs-custom-directives-link-function-guide/)   
【3】[Angular JS - Scroll $window](http://stackoverflow.com/questions/20253322/angular-js-scroll-window)   
【4】[AngularJS $watch window resize inside directive](http://stackoverflow.com/questions/31622673/angularjs-watch-window-resize-inside-directive)   
【5】[Angular and getting window scroll position in controller](http://stackoverflow.com/questions/26365339/angular-and-getting-window-scroll-position-in-controller/29042247)   
【6】[Separating DOM manipulation from Angular controllers - Best Practice wanted](http://stackoverflow.com/questions/28988547/separating-dom-manipulation-from-angular-controllers-best-practice-wanted)   
【7】[angular.element](https://docs.angularjs.org/api/ng/function/angular.element)   
