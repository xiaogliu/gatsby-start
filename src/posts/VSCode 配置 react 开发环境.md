---
title: 'VSCode 配置 react 开发环境'
date: 2017-12-26 20:27:48
tags: [vscode, React]
categories: Tools
e_title: develop-react-using-vscode
---

> update 2018-05-16：这篇文章比较久了，如果配置完有问题，可参考这篇文章 [使用 ESLint && Prettier 规范代码格式](https://xiaogliu.github.io/2018/05/15/format-code-by-eslint-and-prettier/)

vscode 默认配置对于 react 的 JSX 语法不友好，体现在使用自动格式化或者粘贴后默认缩进错误，尽管可以通过改变 language mode 缓解错误，但更改 language mode 后的格式化依然不够理想。    

通过搭配使用 [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) 和 [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) 插件可以实现在 vscode 中完美支持 JSX 语法。      

# 编辑器安装插件

在 vscode 中需要安装下面插件：   

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

# 项目中的配置

## 配置ESLint

### 基础配置

1. 项目中安装 `babel-eslint`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react` 依赖：   

```bash
npm install babel-eslint eslint-plugin-jsx-a11y eslint-plugin-react --save-dev
```

2. 推荐的 ESLint 配置如下（修改`.eslintrc`）  

```json
{
  // Use the AirBnB JS styleguide - https://github.com/airbnb/javascript
  "extends": "airbnb",

  // We use 'babel-eslint' mainly for React Native Classes
  "parser": "babel-eslint",
  "ecmaFeatures": {
    "classes": true,
  },

  // jsx相关插件
  "plugins": ["react", "jsx-a11y", "import"]

  // We can add/overwrite custom rules here
  "rules": {
    // React Native has JSX in JS files
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],

    // React Native includes images via require("../images/example.png")
    "global-require": 0
  }
}
```

需要注意几点：   
   
- 如果使用 yarn 安装，需要手动创建 `.eslintrc` 文件
- **如果在使用过程中 eslint 报错，提示缺少依赖，安装相关依赖就好**

### 可能遇到的问题

- 如果在项目中文件名后缀是 `.js` 而不是 `.jsx`，可能会遇到下面的错误：   

```bash
[eslint] JSX not allowed in files with extension '.js' (react/jsx-filename-extension)
```
   
在 `.eslintrc` 中添加新的 `rules` 允许 `.js` 和 `.jsx` 后缀就好：   

```json
  "rules": {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }]
  }
```

> react-native 0.49 及以后版本已经不建议使用 `.jsx` 为后缀了，参考这个讨论 [No .jsx extension?](https://github.com/facebookincubator/create-react-app/issues/87)   

- props validation 错误

```bash
[eslint] 'navigation' is missing in props validation (react/prop-types)
```

检测 props 的类型有助于写出复用组件，最好不要把这个提醒关掉，如果一定要关，添加下面规则：   
   
```json
  "rules": {
    "react/prop-types": 0
  }
```

## 配置Prettier

我们想要的效果是：**配置 Prettier 按照 ESLint 的规则保存文件时自动格式化 JSX 代码**，步骤如下：

1. 项目中安装 `prettier-eslint`   

```bash
npm install prettier-eslint --save-dev
```

2. 配置 vscode workspace

在 vscode workspace 用户自定义部分添加如下代码：   

```json
// Format a file on save. 
// A formatter must be available, 
// the file must not be auto-saved, 
// and editor must not be shutting down.
"editor.formatOnSave": true,
   
// Enable/disable default JavaScript formatter (For Prettier)
"javascript.format.enable": false,
   
// Use 'prettier-eslint' instead of 'prettier'. 
// Other settings will only be fallbacks 
// in case they could not be inferred from eslint rules.
"prettier.eslintIntegration": true,
```

# 最终效果

进行保存操作后，自动格式化文件

![vscode 格式化 react 效果图](https://raw.githubusercontent.com/xiaogliu/pic-lib/master/old/vscode_format_react.gif)

> ps：随着 vscode 不断升级，编辑器默认支持 react 越来越好，这片文章基于 vscode 19.0版本。    

# 参考资料   

【1】[Configure ESLint, Prettier, and Flow in VS Code for React Development](https://hackernoon.com/configure-eslint-prettier-and-flow-in-vs-code-for-react-development-c9d95db07213)   
【2】[eslint-plugin-react/docs/rules/prop-types.md](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prop-types.md)   
【3】[Linting for React Native](https://medium.com/pvtl/linting-for-react-native-bdbb586ff694)   
