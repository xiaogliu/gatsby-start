---
title: 使用 ESLint && Prettier 规范代码格式
date: 2018-05-15 15:08:18
tags: [Tools]
categories: Tools
e_title: format-code-by-eslint-and-prettier
---

开始配置之前，先问个问题：[ESLint](https://eslint.org/) 和 [Prettier](https://prettier.io/) 有什么不同？

之所以问这个问题是因为 ESLint 除了代码质量检查（比如有无声明但没有使用的变量）也提供了自动格式化代码的功能，比如，将双引号变为单引号，自定添加 trailing comma 等，既然如此，那干嘛还要再引入 Prettier？毕竟，Prettier 就是用于代码格式化的。

其实，在格式化代码方面， Prettier 确实和 ESLint 有重叠，但他们侧重点不同：ESLint 主要工作就是检查代码质量并给出提示，它所能提供的格式化功能很有限；而 Prettier 在格式化代码方面就强大的多。

> 关于 ESLint 可修复的 style 类目参考这个列表下标有扳手标记的项[Stylistic Issues](https://eslint.org/docs/rules/#stylistic-issues)

**举个例子：**

```js
methods: {
  async testURL() {
    let TEST = 11;
  },

},
```

在上面的例子中，

ESLint 可以

**检查：**

1）TEST 是常量，应该用 const 声明；
2）TEST 声明后没有使用。

**自动修改：**

1）将 let 声明改为 const 声明。

但 ESLint 也只能做什么多了，但倒数第二个空行，ESLint 就无能为力了。这时候， Prettier 就登场了：Prettier 可以自动删除倒数第二行的空行。

## 使用

因为 ESLint 和 Prettier 都可以格式化代码，如果他们对格式化代码执行不同规则，那就可能发生冲突，可以通过配置解决大部分冲突，但仍有一些是无法解决的，比如，Prettier 在 `function` 关键字后不允许有空格且不能自定义，那如果想避免 ESLint 不报错，只能配置 ESLint 允许 `function` 关键字后不带空格（主要针对匿名函数）。

这类不能配置的冲突很少，目前我只发现一例，所以，还是选择继续使用 Prettier，毕竟，更多的时候使用 Prettier 很方便，并且，后续 Prettier 版本可能会添加更多自定义选项。

> 关于 `function` 关键字后不带空格更多讨论可参考[Space after function keyword - MOVED to #3847!](https://github.com/prettier/prettier/issues/1139)

基于 Atom 和 VS Code 两个编辑器的配置过程如下

### 编辑器配置

1）Atom

安装插件：

[prettier-atom](https://atom.io/packages/prettier-atom)：格式化代码；  
[atom-beautify](https://atom.io/packages/atom-beautify)：格式化代码（以 prettier 为主，没有 prettier 时用，同时在 setting 设置 vue 的格式化插件为 prettier-atom）；  
[linter-eslint](https://atom.io/packages/linter-eslint)：js 检查，可设置和 prettier 配合使用（还有其他相关依赖，atom 会提示安装）

插件相关配置在插件面板中有，这里安装 atom-beautify 是因为 **Prettier 对于 vue 中的 html 无法自动格式化**，所以，使用 atom-beautify 替代。

另外，不知道什么原因，**Prettier 不能正确格式化 css/scss**，故也用 atom-beautify 替代。

Prettier 格式化默认快捷键：`ctrl + alt + f`，atom-beautify 格式化默认快捷键 `ctrl + alt + b`

2）VS Code

安装插件：

[ESlint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)，[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

VS Code 插件配置统一在 `preference -> setting -> user setting` 设置：

```js
// 点击保存时，根据 eslint 规则自定修复，同时集成 prettier 到 eslint 中
"prettier.eslintIntegration": true,
"eslint.autoFixOnSave": true,

// 为了避免和 eslint 冲突，讲编辑器默认的代码检查规则关闭（如果开启了）
"editor.formatOnSave": false,
"javascript.format.enable": false,
```

### 在项目中安装本地依赖

[update 2019-08-01]：现在 ESLint 和 Prettier 功能已经足够强大，不需要安装这么多依赖了，详细配置可参考基于 react 的 [demo](https://github.com/xiaogliu/react-simple-boilerplate) 

1）ESlint 相关

这里使用 airbnb 代码规范、babel 对 ES6 语法做检查，同时安装了对 react 和 vue 支持的插件

```bash
yarn add
  eslint babel-core babel-eslint eslint-config-airbnb eslint-plugin-import
  eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-vue eslint-plugin-html
-D
```

如果在不需要 vue 和 react 的项目中，只需安装下面依赖

```bash
yarn add
  eslint babel-core babel-eslint eslint-config-airbnb eslint-plugin-import
  eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-html
-D
```

> 因为 eslint-config-airbnb 依赖 eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react，所以即便不使用 react，也要安装这三个依赖

2） Prettier 相关

```bash
yarn add eslint-config-prettier eslint-plugin-prettier prettier -D
```

> 编辑器中如果已经安装了 Prettier 插件，可以省略这步？编辑器的 Prettier 和 npm 安装的 Prettier 相互有怎样的影响还不太清楚。

### 编写配置文件

编写 ESlint 配置文件 `.eslintrc.js` 配置

```js
module.exports = {
  root: true,
  parserOptions: {
    // 检查 ES6 语法
    parser: "babel-eslint"
  },
  env: {
    browser: true
  },
  // extending airbnb config and config derived from eslint-config-prettier
  // 这里是 vue
  extends: ["plugin:vue/essential", "airbnb-base", "prettier"],

  // 选择 eslint 插件
  plugins: ["prettier", "vue"],

  // react
  // extends: ['airbnb-base', 'prettier'],
  // plugins: ['prettier', 'react'],

  // 不需要框架
  // extends: ['airbnb-base', 'prettier'],
  // plugins: ['prettier'],

  // 自定义 eslint 检查规则
  rules: {
    // 自定义 prettier 规则 (实际上，可配置项非常有限)
    "prettier/prettier": [
      "error",
      {
        singleQuote: true,
        trailingComma: "all"
      }
    ],
    camelcase: "off", // 强制驼峰法命名
    "no-new": "off", // 禁止在使用new构造一个实例后不赋值
    "space-before-function-paren": "off", // 函数定义时括号前面不要有空格
    "no-plusplus": "off", // 禁止使用 ++， ——
    "max-len": "off", // 字符串最大长度
    "func-names": "off", // 函数表达式必须有名字
    "no-param-reassign": "off" // 不准给函数入参赋值

    // react 如果在项目中文件名后缀是 .js 而不是 .jsx 避免报错
    // "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    // react props validation 错误
    // "react/prop-types": 0,
  }
};
```

需要特别注意，在使用 Prettier 的时候，ESLint 自定义规则不能和 Prettier 的重复，不然会重复格式化，比如，如果在 ESLint 自定义规则中添加了下面内容会导致格式化时多出一个分号和逗号：

```js
// 加多这两个自定义规则，导致重复格式化
semi: ['error', 'always'], // 语句强制分号结尾
'comma-dangle': ['error', 'always-multiline'], // 多行对象字面量项尾总是有逗号
```

## 参考资料

[Your last ESLint config](https://medium.com/@netczuk/your-last-eslint-config-9e35bace2f99)
