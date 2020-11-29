---
title: Babel安装及使用
date: 2017-05-09 22:43:42
tags: [Babel,Gulp,工程化]
categories: Tools
e_title: install-and-use-babel
---

# Babel用途

Javascript最新语法（ECMA-262最新版）发布后，需过段时间浏览器厂家才能给予支持，这样在项目开发中使用了JS最新语法后，发布生产前需将代码装换为兼容性更好的ECMA-262版本，**Babel便是完成这项工作的工具**。   

# Babel 安装

[Babel官网](http://babeljs.io/docs/setup/) 提供了多种安装教程，这里介绍`CLI`安装方式和在`Gulp`中使用的安装方式。   

## CLI 安装

推荐在项目中本地安装的方式，而非全局安装，原因如下：   

- 不同项目可能依赖不同版本的Babel，方便后续独立升级；   

- 因为是本地安装，所以不依赖系统环境，项目移植、设置都更方便。   

> 主要是第一个原因。如果不小心全局安装了，用一下命令卸载 `npm uninstall --global babel-cli`   

**步骤 1**，本地安装Babel CLI

```bash
npm install --save-dev babel-cli
```

**步骤 2**，在项目根目录下面新建并设置`package.json`文件，初始设置参考下面内容：

```bash
{
  "name": "my-project",
  "version": "1.0.0",
  "devDependencies": {
    "babel-cli": "^6.0.0"
  }
}
```

**步骤 3**，设置启动命令。   

因为是本地安装，所以无法直接使用`Babel`这样的全局命令，我们需要将启动命令添加到[npm script](https://docs.npmjs.com/misc/scripts)中，以此启动本地 Babel。添加方法是在刚才新建的`package.json`文件中添加`"script"`，内容如下：   

```bash
  {
    "name": "my-project",
    "version": "1.0.0",
+   "scripts": {
+     "build": "babel src -d dist"
+   },
   "devDependencies": {
     "babel-cli": "^6.0.0"
   }
 }
```

> 说明：1、`build`是启动本地Babel的命令，也可以设置其他名字；2、"babel src -d dist" 中`src`指待转换的目录，该目录必须存在，`dist`指目标转换目录，可以不存在，Babel转化过程中自动创建。   

此时通过下面的命令就可以启动Babel了：   

```bash
npm run build
```

**步骤 4**，指定转化版本。   

经过前三个步骤，虽然Babel可以工作了，但并没有进行版本转换，前后代码相同。这就需要我们指定转化版本了，这也是为什么推荐本地安装的原因：不同项目可能有不同版本转化的需求。    

首先，在项目根目录下建立`.babelrc`文件，这个文件数据Babel的配置文件。然后安装并设置转换规则：   

安装规则：   

```bash
npm install babel-preset-env --save-dev
```

上述命令代表按照ES2015+进行转换，也可以制定特定的规则：

```bash
# ES2015转换规则
$ npm install babel-preset-es2015 --save-dev

# react转换规则
$ npm install babel-preset-react --save-dev

# ES7不同阶段语法提案的转换规则（共有4个阶段），选装一个
$ npm install babel-preset-stage-0 --save-dev
$ npm install babel-preset-stage-1 --save-dev
$ npm install babel-preset-stage-2 --save-dev
$ npm install babel-preset-stage-3 --save-dev
```

最后，将需要的规则添加到`.babelrc`中   

```bash
{
  "presets": ["env"]
}
```

重新运行`npm run build`，便可以如期转换。

> [Babel官网](http://babeljs.io/docs/setup/) 提示，用 npm 2.x 运行 Babel 6.x 会报错，但我并没有遇到，如果使用过程中遇到可升级到 npm 3.x 或者继续使用 npm 2.x [参考这里](https://docs.npmjs.com/cli/dedupe) 解决

## Gulp 安装

**步骤 1**，在Gulp中引入Babel依赖`gulp-babel`

```js
var gulp = require("gulp");
var babel = require("gulp-babel");

gulp.task("default", function () {
  return gulp.src("src/app.js")
    .pipe(babel())
    .pipe(gulp.dest("dist"));
});
```

> '.pipe(babel())'一般放在Gulp流中

**步骤 2**，指定转化版本。   

同“CLI 安装”步骤4。

# 参考资料：   
【1】 [How to use Babel with your tool of choice](http://babeljs.io/docs/setup/)   
【2】 [Babel 入门教程](http://www.ruanyifeng.com/blog/2016/01/babel.html)   
【3】 [How npm handles the "scripts" field](https://docs.npmjs.com/misc/scripts)
【4】 [npm scripts 使用指南](http://www.ruanyifeng.com/blog/2016/10/npm_scripts.html)
