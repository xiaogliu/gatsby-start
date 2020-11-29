---
title: 通过 gh-pages 创建 Hexo 博客子目录
date: 2018-01-29 22:46:09
tags: [git,hexo]
categories: Tools
e_title: create-hexo-subdir-using-gh-pages
---

# 需求描述

如何使用 Hexo 创建博客可以查看这篇文章 [使用 Hexo + Github 搭建个人博客](https://xiaogliu.github.io/2016/06/09/build-blog-by-hexo-github/) ，创建完成后个人博客地址格式如下：   

```bash
username.github.io
```

假设我们现在有个需求，比如说把自己的简历挂在个人博客地址下面，访问地址如下，要怎么实现呢？   

```bash
username.github.io/resume

# 或者下面的格式
username.github.io/resume/index.html
```

当然，可以使用简单文字加图片以文章的形式展现，但这不是我们想要的效果。我们希望子目录下包含的是可以独立控制的文件，比如独立的css、js文件，从而可以实现复杂的展示效果。    

或者说，我们的需求是**给博客添加子目录，子目录可以独立于 Hexo 工作**。

# 实现方式

Github 实际上已经提供了实现方式，操作如下：   

1. 新建仓库，仓库名比如是 resume；
2. 在仓库 resume 下面创建新分支 `gh-pages`（默认已创建 `master` 分支，所以现在 resume 下面有两个分支）；
3. 在分支 `gh-pages` 下面新建 `index.html`。

此时，如果 resume 仓库的远程分支 `gh-pages` 下面已经存在 `index.html`，那么通过访问下述任一网址，就可以访问到刚才的 `index.html` 了:    

```bash
username.github.io/resume

# 或者下面的格式
username.github.io/resume/index.html
```

**NOTE: ** `username.github.io/reponame` 访问的是仓库 `reponame` 下分支 `gh-pages` 中的 `index.html` 文件，所以上述操作的关键是必须建立 `gh-pages` 分支以及必须在其下创建 `index.html` 文件。   

后续更新维护只需要在分支 `gh-pages` 上进行，但出于最佳实践考虑，最好始终保持和 `master` 同步。   

# 参考资料

受 [React Native](https://facebook.github.io/react-native/docs/tutorial.html) 官网启发。
 