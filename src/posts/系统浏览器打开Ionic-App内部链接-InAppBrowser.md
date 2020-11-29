---
title: 系统浏览器打开Ionic App内部链接(InAppBrowser)
date: 2017-05-15 14:57:38
tags: [Hybrid App,Ionic,JavaScript]
categories: Hybrid App
e_title: open-ionic-app-inside-link-use-mobile-browser
---

# 一 概述

App使用过程中有使用系统自带浏览器打开App内部链接的需求，比如App升级时通过点击App内部链接调用系统自带浏览器下载更新包。   

Ionic App 通过 Cordova 的插件：[InAppBrowser](https://github.com/apache/cordova-plugin-inappbrowser)实现该功能。本篇文章将通过实际案例介绍`InAppBrowser`的使用。   

# 二 Ionic App环境搭建   

下载Ionic App官方案例   

```bazaar
ionic start myApp tabs
```

添加平台   

```bazaar
ionic platform add android
```

# 三 安装并使用InAppBrowser

## 3.1 安装InAppBrowser   

```bazaar
ionic plugin add cordova-plugin-inappbrowser
```

## 3.2 使用InAppBrowser

为方便起见，直接在Ionic官方案例`dash`页面中使用`InAppBrowser`。    

**修改HTML文件**：在刚下载的Ionic项目中找到`tab-dash.html`，在自定义标签`ion-content`最后添加下面代码：   

```html
<!-- InAppBrowser example begin -->
<p>
  <b>点击下面的按钮，将在系统自带浏览器中打开链接。</b>
</p>
<button class="button button-full button-positive" ng-click="openInExternalBrowser()">
  在系统自带浏览器中打开链接
</button>
<!-- InAppBrowser example end -->
```

**修改JS文件**：在刚下载的Ionic项目中找到`controllers.js`，在控制器`DashCtrl`最后添加下面代码：   

```js
// InAppBrowser example begin
$scope.openInExternalBrowser = function()
{
  // 在系统自带浏览器中打开链接
  window.open('https://xiaogliu.github.io/','_system','location=yes');
};
// InAppBrowser example end
```

# 四 构建APP

现在已经可以构建APP测试了：

```bazaar
ionic build android -release
```

> 更多打包Ionic APP的信息可查看[Ionic打包Android apk](https://xiaogliu.github.io/2017/05/13/package-ionic-android-app/)   

**完整代码请参考GitHub上这个仓库[Cordova_InAppBrowser_Plugin_Example](https://github.com/xiaogliu/Cordova_InAppBrowser_Plugin_Example)**   

# 参考资料   
【1】[Cordova InAppBrowser Plugin Example using ionic framework](http://sourcefreeze.com/cordova-inappbrowser-plugin-example-using-ionic-framework/)   
