---
title: package.json使用说明(npm script)
date: 2017-05-13 16:08:16
tags: [npm,JavaScript]
categories: JavaScript
e_title: package.json-instruction
---

这篇文章需要更新啦：需要区分 package.json 和 package-lock.json 及更新机制。

https://github.com/SamHwang1990/blog/issues/7  
https://stackoverflow.com/questions/44297803/what-is-the-role-of-the-package-lock-json   
https://stackoverflow.com/questions/45022048/why-does-npm-install-rewrite-package-lock-json   
https://docs.npmjs.com/about-semantic-versioning   
https://www.zhihu.com/question/62331583   


# 概述

`package.json`是`npm`本地安装包管理文件，主要作用如下：   

- 充当项目所依赖的安装包的文档说明；   
- 可以指定安装包的版本；   
- **执行`npm install`命令，可以安装`package.json`中指定的安装包。这意味着项目移植更加便捷。**   

# 使用

## 必须内容

一个`package.json`文件，至少包括`name`和`version`两项内容：   

```json
{
  "name": "my-awesome-package",
  "version": "1.0.0"
}
```

## 自动创建

使用`npm init`命令可以自动创建`package.json`文件，在命令行中采用问答的形式填充内容，除了`name`和`version`是必填的，其他内容可以为空。   

当然，也可以直接使用`npm init --yes`或者`npm init --y`命令直接生成`package.json`，直接生成的文件内容如下：   

```json
{
  "name": "my_package",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/ashleygwilliams/my_package.git"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/ashleygwilliams/my_package/issues"
  },
  "homepage": "https://github.com/ashleygwilliams/my_package"
}
```

说明如下：   
- name: the current directory name
- version: always 1.0.0
- description: info from the readme, else an empty string ""
- main: always index.js
- scripts: by default creates a empty test script
- keywords: empty
- author: empty
- license: ISC
- bugs: info from the current directory, if present
- homepage: info from the current directory, if present

> 在`scripts`里面添加的内容就是传说中的**npm script**内容了，除了简化命令操作，还可以在本地执行Gulp、Babel等命令（如果知识本地安装而非全局安装，必须使用**npm script**的形式调用Gulp/Babel命令）

## 指定依赖安装包

依赖安装包分为`dependencies`和`devDependencies`两种类型，其中带`dev`前缀的表示开发环境依赖库，不带`dev`前缀的表示生产环境依赖库，在使用`npm`命令行工具安装依赖包时可以指定添加到哪个库。   

添加到`dependencies`使用下面命令：

```bazaar
npm install <package_name> --save
```

添加到`devDependencies`使用下面命令：

```bazaar
npm install <package_name> --save-dev
```

> 如果在命令后面家`-D`flag，可以直接将插件添加到`package.json`文件中去，比如`npm install <package_name> --save-dev -D`将`<packge_name>`添加到`"devDependencies": {}`中去。

**问题：为什么要区分`dependencies`和`devDependencies`？**   

因为在生产环境中的依赖包和开发环境的依赖包可能不一样，区分`dependencies`和`devDependencies`是为了方便包管理。   

比如在生产环境中只安装`dependencies`里面的依赖包，执行下面的命令就可以：   

```bazaar
npm install --production
```

> 关于在生产环境中如何只安装`dependencies`里面的依赖包可查看[option to not install devDependencies](https://github.com/npm/npm/issues/1434)   

## npm script

很多工具本地安装要比全局安装好，这样可以根据不同项目进行不用设置。本地安装的工具，比如`gulp`, `babel`，可以通过`npm script`进行管理，比如启动Gulp   

```js
"scripts": {
  "gulp-task": "gulp gulp-task"
},
```

## 其他

更多内容可查看 npm 对`package.json`的官方描述：[Specifics of npm's package.json handling](https://docs.npmjs.com/files/package.json)   

# 参考资料

【1】[Using a package.json](https://docs.npmjs.com/getting-started/using-a-package.json)   
【2】[option to not install devDependencies](https://github.com/npm/npm/issues/1434)   
【3】[Specifics of npm's package.json handling](https://docs.npmjs.com/files/package.json)   
