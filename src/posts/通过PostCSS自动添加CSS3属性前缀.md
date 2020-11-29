---
title: 通过PostCSS自动添加CSS3属性前缀
date: 2017-07-19 17:21:01
tags: [CSS,PostCSS,兼容性,工程化]
categories: CSS
e_title: using-postcss-add-css-prefix
---

有点标题党的感觉，给CSS3属性自动添加前缀只是[PostCSS](https://github.com/postcss/postcss)众多功能中的一种，但正是因为这项功能，使我开始使用PostCSS。本文主要介绍PostCSS是什么、为什么要使用以及怎么使用。

# PostCSS是什么

PostCSS是通过JS插件转化CSS样式的一个库，这种转化包括但不限于检查CSS语法、使用变量和mixins、将CSS语法转化为浏览器兼容模式（比如常用的添加浏览器厂商前缀）等等。   

尽管PostCSS可以当做CSS预处理器来使用，就像SASS和LESS一样，但PostCSS能做的远不止如此，因为PostCSS的功能是可以通过插件进行扩展的。   

目前而言，PostCSS最吸引我的是因为它可以提供SASS和LESS不能（轻易）完成的功能：**给CSS3属性添加浏览器厂商前缀，转化Flex布局使其兼容IE10以下浏览器**。   

如果你习惯使用SASS语法，同时又想使用PostCSS给对CSS进行处理，也是可以做到的，这也是本篇文章重点介绍的。

# 如何使用

目前流行的使用方式是通过Gulp或者Webpack使用。   

## 通过Gulp使用

- 简单使用   

先贴出通过使用[flexibility](https://github.com/7rulnik/postcss-flexibility)插件，转换Flex语法兼容IE10以下浏览器的gulpfile.js文件内容：   

```js
const gulp = require('gulp');

// 引入PostCSS
const postcss = require('gulp-postcss');

/**
  * 通过require引入PostCSS所需插件，这里除了引入flexibility
  */
gulp.task('postcss', () => {
  return gulp.src('src/main.css')
  .pipe(postcss([require('postcss-flexibility')]))
  .pipe(gulp.dest('dist/'));
});
```

通过`postcss([ require('postcss-flexibility') ])`便可以引入`postcss-flexibility`插件对CSS进行处理了。其中插件列表是一个数组，可以引入多个，比如还想给CSS3属性添加前缀可以这样写：   

```js
...
.pipe(postcss([require('postcss-flexibility'), require('autoprefixer')]))
...
```

> 插件使用前需要先通过npm进行安装。   

- 结合SASS使用   

如果已经习惯使用SASS语法写CSS，PostCSS也可以处理经过SASS转化后的CSS文件，gulpfile.js文件配置如下（这里也引入了添加CSS3属性前缀的插件）：   

```js
const gulp = require('gulp');

// 引入PostCSS
const postcss = require('gulp-postcss');

// 引入SASS
const sass = require('gulp-sass');

/**
  * 通过require引入PostCSS所需插件，这里除了引入flexibility, autoprefixer插件
  */
gulp.task('postcss', () => {
  return gulp.src('src/main.css')
  .pipe(sass())
  .pipe(postcss([require('postcss-flexibility'), require('autoprefixer')]))
  .pipe(gulp.dest('dist/'));
});
```

完整代码可参考这个仓库：[postcss_example](https://github.com/xiaogliu/postcss_example)   

## 通过Webpack使用

待完善。

# 参考资料
【1】[PostcCSS-Github仓库](https://github.com/postcss/postcss)
【2】[PostCSS深入学习：你需要知道什么](https://www.w3cplus.com/PostCSS/postcss-deep-dive-what-you-need-to-know.html)
