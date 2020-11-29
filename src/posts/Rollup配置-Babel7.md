---
title: Rollup 配置（Babel7）
date: 2019-07-24 11:32:06
tags: [Rollup]
categories: Tools
e_title: rollup-config
---

Vue 和 React 当前（2019-07-24）都是用 Rollup 作为构建工具，目前有一个[最佳实践](https://medium.com/webpack/webpack-and-rollup-the-same-but-different-a41ad427058c)：如果是应用打包（需要处理静态静态资源，这是 Rollup 的弱项）用 webpack，如果是 library 打包用 Rollup（更小的打包体积及更多选择的输入文件格式，比如 ES6 module，CommonJS 等）。

关于 Rollup 和 Webpack 打包后资源对比可参考这篇文章 [Tree-Shaking 性能优化实践 - 原理篇](https://juejin.im/post/5a4dc842518825698e7279a9)

本篇文章主要记录如何配置 Rollup 对 Library 进行打包。

# 一 调用 Rollup

配置 Rollup 进行可以可以通过命令行的方式和配置文件的方式，通常我们选择使用配置文件的方式。在根目录下新建 `rollup.config.js` 文件，然后 `package.json` 中的 script 命令中添加下面两行：

```json
"scripts": {
  ...
  "start": "NODE_ENV=dev rollup -w -c",
  "build": "NODE_ENV=prod rollup -c",
  ...
},
```

其中 `start` 表示开发模式；`-w` 表示 `watch` 如果入口文件及其中导入的文件发生变化重新打包；`-c` 表示 `config`，表示使用 Rollup 打包规则按照配置文件 `rollup.config.js` 进行。完整命令行 flag 看这里 [Rollup - Command line flags](https://rollupjs.org/guide/en/#command-line-flags)

# 二 写 Rollup 配置文件

就配置而言，Rollup 要比 Webpack 简单很多。Rollup 配置文件完整选项看这里 [Rollup - Configuration Files](https://rollupjs.org/guide/en/#configuration-files)，这里介绍常用三个选项： - `input`：入口文件；

- `output`：处理后的输出文件名及所在目录；
- `plugins`：对于入口文件一系列处理都依赖插件完成。

> Rollup 支持 ES6 模块和 CommonJS 模块，这里使用了 ES6 模块

## 2.1）单个输入输出文件

这是最简单的模式

```js
export default {
  input: "main-a.js",
  output: {
    file: "dist/bundle-a.js",
    format: "cjs"
  }
};
```

- `output.format`：表示打包输出的文件类型，有 `amd`, `cjs`, `es`, `iife`, `umd`

  - amd - 异步模块定义，用于像 RequireJS 这样的模块加载器
  - cjs - CommonJS，适用于 Node 和 Browserify/Webpack
  - es - 将软件包保存为 ES 模块文件
  - iife - 一个自动执行的功能，适合作为 `<script>` 标签。（如果要为应用程序创建一个捆绑包，您可能想要使用它，因为它会使文件大小变小。）
  - umd - 通用模块定义，以 amd，cjs 和 iife 为一体 
  
- `output.name`：生成包名称，如果是 `iife/umd` 格式，`name` 必须有，相当于 `var moduleName = (function(){})()`

## 2.2）多个输入输出文件

Rollup 支持一次处理多个输入输出文件，`watch` mode 也支持检测多个入口文件，这个时候，使用数组进行包装。

```js
export default [
  // 第一个入口文件
  {
    input: "main-a.js",
    output: {
      file: "dist/bundle-a.js",
      format: "cjs"
    }
  },
  // 第二个入口文件
  {
    input: "main-b.js",
    output: [
      // 多个输出文件
      {
        file: "dist/bundle-b1.js",
        format: "cjs"
      },
      {
        file: "dist/bundle-b2.js",
        format: "esm"
      }
    ]
  }
];
```

**更常见的模式是一个入口文件，多个输出文件，其中输出文件的不同在于使用了不同的模块定义，比如同时输出 ES6 模块和 CommonJS 模块**。

> 输出 ES6 模式是为了做 Treeshaking，详见：输出 CommonJS 模块是为了兼容。

# 三 Rollup 插件

Rollup 本身不对代码进行操作，一系列操作都依赖 Rollup 的插件们，常用插件有：

import babel from "rollup-plugin-babel";
import alias from "rollup-plugin-alias";
import { terser } from "rollup-plugin-terser";

## 3.1）rollup-plugin-babel

适用于 Rollup 的 Babel 插件。这里需要特别说明，Babel7 之前，如果要转译 TypeScript 代码，需要安装单独的 TypeScript 插件，但从 Babel7 开始，通过 `preset-typeScript` 这一个 preset 对 TypeScript 进行转译。

> preset 代表一组 _预设_ 的 Babel 插件集合。

相对于引入 TS 自身的编译器，通过 Babel 统一管理需要转译的代码是比较好的（不管 JSX or TS or 其他，只要非目标 JS，都用 Babel 进行转译，相比于 JSX，TS 也没啥特殊的），更多介绍可参考这篇文章：[TypeScript With Babel: A Beautiful Marriage](https://iamturns.com/typeScript-babel/)

在 `rollup.config.js` 中配置如下：

```js
plugins: [
  babel({
    extensions: [".js", ".ts"],
    exclude: "node_modules/**"
  })
];
```

### 3.1.1）新建 Babel 配置文件

在项目根目录新建 `.babelrc` 文件，内容设置如下：

> [Rollup 文档](https://rollupjs.org/guide/en/#babel)中推荐将 Babel 配置文件放在 src 目录下，以区分测试文件，这个看具体情况。

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        // 避免转换成 CommonJS
        "modules": false,
        // 使用 loose 模式，避免产生副作用
        "loose": true
      }
    ],
    ["@babel/preset-typeScript"]
  ]
}
```

### 3.1.2）Babel 配置说明

- module

这里 `module` 必须设置为 `false`，不然在 Rollup 处理代码钱，Babel 已经将代码默认处理成了 CommonJS 的模块，Rollup 处理时会出错。

- loose

`loose` 是否设置为 `true` 看业务需求，宽松模式使 Babel 在编译代码不完全按照 ES6 语义进行编译，而是编译成更接近于我们手写代码的形式，这样好处除了使代码更加精简，还会避免产生副作用。典型的是对 ES6 `class` 语法进行转译的区别：如果不是用宽松模式，ES6 的方法通过 `Object.defineProperty` 进行定义；如果使用宽松模式，则直接在原型链上进行定义。可以通过输入下面代码在 Babel REPL 进行测试：

`loose` 为 [`false`](https://babeljs.io/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=KYDwDg9gTgLgBAYwDYEMDOa4AVhTRAOzgG8AoORQtGKAVwRmjgApi4CUBbYOAXwEoS5CnBgALAJZoAdB25wAvOy7BhvYQHNgMAHIqWgsiLhRttKEXFTZKtaV5A&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015&prettier=false&targets=&version=7.5.5&externalPlugins=); `loose` 为 [`true`](https://babeljs.io/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=KYDwDg9gTgLgBAYwDYEMDOa4AVhTRAOzgG8AoORQtGKAVwRmjgApi4CUBbYOAXwEoS5CnBgALAJZoAdB25wAvOy7BhvYQHNgMAHIqWgsiLhRttKEXFTZKtaV5A&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015-loose&prettier=false&targets=&version=7.5.5&externalPlugins=)。

```js
// es6
export class Person {
  constructor({ name }) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}
```

那么问题来了，用不用原型链进行构造函数方法的定义有什么差别？差别就是如果使用 `Object.defineProperty` 进行定义可以产生副作用导致 treeshaking 失效，具体参考这篇文章：[你的 Tree-Shaking 并没什么卵用](https://juejin.im/post/5a5652d8f265da3e497ff3de#heading-2)。

## 3.2）rollup-plugin-terser

[rollup-plugin-terser](https://github.com/TrySound/rollup-plugin-terser) 用于压缩 ES6 代码，功能和 uglify-js 相同，但 uglify-js 不支持 ES6 所以有了这个插件。

> rollup-plugin-terser 基于 [terser](https://github.com/terser-js/terser) is a fork of uglify-es that mostly retains API and CLI compatibility with uglify-es and uglify-js@3

使用：

```js
plugins: [
  terser({
    compress: {
      // remove console.log
      pure_funcs: ["console.log"]
    },
    output: {
      // add comment on the top
      preamble: `/*! ${PROJECT} - v${VERSION} - ${DATE} https://xiaogliu.github.io */`
    }
  })
];
```

> 题外话，为什么那么执着于 ES6 模块定义？因为 TreeShaking 正是基于 ES6 的模块系统进行静态分析，配合 rollup-plugin-terser 移除不会执行（传统 DCE，dead code elimination）以及模块间没有用到的代码。

## 3.3）其他

剩余常用插件归结为其他，因为配置简单，或者目前来说我用的还少，没有单独拿出来做总结的必要，其他插件包括：

- [rollup-plugin-alias](https://github.com/rollup/rollup-plugin-alias)：设置别名，比如将 `src` 目录设置别名为 `@`；
- [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace)：打包时替换代码中的特定字符串。

> 在使用 alias 引入文件时 TSLint错，简单错报的方法：`// @ts-ignore`

# 参考资料

[Tree-Shaking 性能优化实践 - 原理篇](https://juejin.im/post/5a4dc842518825698e7279a9)   
[10分钟快速精通rollup.js——前置学习之rollup.js插件篇](https://juejin.im/post/5bf823b96fb9a049e93c61a8)   
[你的 Tree-Shaking 并没什么卵用](https://juejin.im/post/5a5652d8f265da3e497ff3de#heading-2)    
[TypeScript With Babel: A Beautiful Marriage](https://iamturns.com/typeScript-babel/)   
[使用 rollup 打包 JS](https://juejin.im/post/5c073d86f265da615a419989)   
[Webpack and Rollup: the same but different](https://medium.com/webpack/webpack-and-rollup-the-same-but-different-a41ad427058c)   
