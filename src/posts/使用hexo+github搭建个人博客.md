---
title: 使用 Hexo + Github 搭建个人博客
date: 2016-06-09 22:56:37
tags: [工具, hexo, Node.js]
categories: Tools
e_title: build-blog-by-hexo-github
---

记录利用 hexo 搭建 blog 的过程。

自从接触编程以来，一直想建立自己的博客来记录重要的学习笔记，这也符合“分享”的精神。但限于自己小白的身份，一直搭建不成功，直接使用 [github page](https://pages.github.com/)，只是自动生成了首页，但不知如何添加自己的文章。后面了解到，这可能需要借助 [jekll](http://jekyllrb.com/) ，但试着部署，还是有种累觉不爱的感觉：折腾的精神应该提倡，但写博客应该把精力放在内容本身上，而非花在样式、不熟等等事情上（算是给自己偷懒的说辞）。后来，注意，后来接触到了 [**hexo**](https://hexo.io/) ，相比 jekll，它部署简单，并且实际写文章时也可以自动完成很多工作，使我可以专注写作。期间查了很多资料，在此一并做下总结。

> 其他可选择方案：[Gatsby](https://github.com/gatsbyjs/gatsby), [Hugo](https://github.com/gohugoio/hugo)

<!-- more -->

## 一、环境准备

### 1.1 安装 Git

### 1.2 安装 node.js

## 二、配置 Github

### 2.1 建立 repository

必须先建立 username.github.io，可参照 github page 教程

### 2.2 配置 SSH-Key

貌似只有配置好 SSH-Key 以后才能用 git 命令远程控制 repository？

## 三、安装 Hexo

### 3.1 安装

打开 Git 命令控制窗口，执行下面命令

```bash
$ npm install -g hexo-cli
```

### 3.2 快速开始

#### 3.2.1 设置你的博客

在电脑中建立一个名字叫「Hexo」的文件夹（比如我建在了 E:\Hexo），然后在此文件夹中右键打开 Git Bash。执行下面的命令

```bash
$ hexo init
# [info] Copying data
# [info] You are almost done! Don't forget to run `npm install` before you start b
logging with Hexo!
```

Hexo 随后会自动在目标文件夹建立网站所需要的文件。然后按照提示，运行 npm install（在 /E/Hexo 下）

> windows 窗口下，在那个文件夹右键点击 git bash，git bash 打开后默认在该文件夹目录下

```bash
npm install
```

会在 E:\Hexo 目录中安装 node_modules。

#### 3.2.2 开始服务器（start server）

运行下面的命令（在 /E/Hexo 下）

```bash
$ hexo server
[info] Hexo is running at http://localhost:4000/. Press Ctrl+C to stop.
```

表明 Hexo Server 已经启动了，在浏览器中打开 http://localhost:4000/ ，这时可以看到 Hexo 已为你生成了一篇 blog。
你可以按 Ctrl+C 停止 Server。

> 只有在 hexo server 启动时，localhost 才可用

#### 3.2.3 Create a new post

在/E/Hexo 目录下打开 git bash 窗口，执行下面的命令

```bash
$ hexo new "My New Post"
# [info] File created at d:\Hexo\source\_posts\My-New-Post.md
```

刷新http://localhost:4000/ ，可以发现在 E:\Hexo\source_posts 已生成了一篇新文章 "My New Post"。

#### 3.2.4 Generate static files

执行下面的命令，将 markdown 文件生成静态网页。

```bash
$ hexo generate
```

该命令执行完后，会在 D:\Hexo\public\ 目录下生成一系列 html，css 等文件。

#### 3.2.5 编辑文章

hexo new "My New Post"会在 D:\Hexo\source_posts 目录下生成一个 markdown 文件：My-New-Post.md
可以使用一个支持 markdown 语法的编辑器（比如 Sublime Text 2）来编辑该文件。

> 只改文件名无效，需要更改文档中的 yaml 文件头。

#### **3.2.6 <font color=red>部署到 Github</font>**

##### 3.2.6-1 部署到 Github 前需要配置 hexo 的\_config.yml 文件，首先找到下面的内容(一般在文档最后)

```bash
# Deployment
## Docs: http://hexo.io/docs/deployment.html
deploy:
  type:
```

然后将它们修改为

```bash
# Deployment
## Docs: http://hexo.io/docs/deployment.html
deploy:
  type: git
  repository: git@github.com:xiaogliu/xiaogliu.github.io.git
  branch: master
```

Repository：必须是 SSH 形式的 url（ git@github.com:xiaogliu/xiaogliu.github.io.git ），而不能是 HTTPS 形式的 url（https://github.com/xiaogliu/xiaogliu.github.io.git ），否则会出现错误：

> 此处有坑，有说 type 为 github，但此处应该为 git，和 hexo 版本有关？？？
>
> 另，有说：Be carefull, with your current configuration, you will erase all your source code on master branch. I recommend > you to deploy on `gh-pages` to be automatically reachable at https://github.com/username/repository_name
> deploy:
> type: git
> repo: <repository url>
> branch: gh-pages
> http://stackoverflow.com/questions/34452547/hexoerror-deployer-not-found-github

##### 3.2.6-2 安装 hexo-deployer

```bash
npm install hexo-deployer-git --save
```

##### 3.2.6-3 deploy

```bash
$ hexo deploy
[info] Start deploying: github
[error] https://github.com/zhchnchn/zhchnchn.github.io is not a valid repositor URL!
```

使用 SSH url，如果电脑没有开放 SSH 端口，会致部署失败。

```bash
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

> 如果你是为一个项目制作网站，那么需要把 branch 设置为 gh-pages。

#### 3.2.7 测试

当部署完成后，在浏览器中打开https://xiaogliu.github.io/ ，正常显示网页，表明部署成功。

#### 3.2.8 总结

每次部署的步骤，可按以下三步来进行。

```bash
$ hexo clean
$ hexo generate
$ hexo deploy
```

> 每次写文章/修改文章都要重新全部 deploy？？

#### 3.2.9 总结：本地调试

##### 3.2.9-1 在执行下面的命令后，

```bash
$ hexo g #生成
$ hexo s #启动本地服务，进行文章预览调试
```

在浏览器输入http://localhost:4000 ，查看搭建效果。此后的每次变更\_config.yml 文件或者新建文件都可以先用此命令调试，尤其是当你想调试新添加的主题时。

##### 3.2.9-2 可以用简化的一条命令

```bash
hexo s -g
```

### 3.3 命令总结

#### 3.3.1 常用命令

```bash
hexo new "postName" #新建文章
hexo new page "pageName" #新建页面
hexo generate #生成静态页面至public目录
hexo server #开启预览访问端口（默认端口4000，'ctrl + c'关闭server）
hexo deploy #将.deploy目录部署到GitHub
hexo help  # 查看帮助
hexo version  #查看Hexo的版本
```

#### 3.3.2 复合命令

```bash
hexo deploy -g  #生成加部署
hexo server -g  #生成加预览
```

#### 3.3.4 命令的简写为

```bash
hexo n == hexo new
hexo g == hexo generate
hexo s == hexo server
hexo d == hexo deploy
```

## 四、设计更改

### 4.1 更换主题

在 Hexo 目录下打开 Git Bash，后只需要一句 Git 命令：

```bash
git clone https://github.com/heroicyang/hexo-theme-modernist.git themes/modernist
```

> [more theme](https://hexo.io/themes/)

安装完成后，打开 hexo_config.yml，修改主题为 modernist

```bash
theme: modernist
```

> 打开 hexo\themes\modernist 目录下的\_config.yml，可做有限的定制。若想再次基础上做更多更改，需要编辑主题的 js（ejs）、css（styl）等文件。

更新主题：进到主题相应文件夹，pull

```bash
cd themes/modernist
git pull
```

**添加网站图标**

在 hexo\themes\modernist\layout_partial\head.ejs，找到这句：

```
<link rel="icon" type="image/x-icon" href="<%- config.root %>favicon.ico">
```

将你的 favicon.ico 放到工程根目录下即可，也就是 hexo\source 目录。

### 4.2 自定义页面

#### 4.2.1 about 页面

执行 new page 命令

```bash
hexo new page "about"
```

在 hexo\source\下会生成 about 目录，里面有个 index.md，直接编辑就可以了，然后在主题的\_config.yml 中将其配置显示出来。
上述步骤，也可以手工生成，在 hexo\source\下手工新建 about 和 index.md 也是完全等价的。

#### 4.2.2 404 页面

GitHub Pages 自定义[404 页面](https://help.github.com/articles/creating-a-custom-404-page-for-your-github-pages-site/)非常容易，直接在根目录下创建自己的 404.html 就可以。但是自定义 404 页面仅对绑定顶级域名的项目才起作用，GitHub 默认分配的二级域名是不起作用的，使用 hexo server 在本机调试也是不起作用的。

其实，404 页面可以做更多有意义的事，目前有如下几个公益 404 接入地址:

[腾讯公益 404](http://www.qq.com/404/)
[404 公益\_益云(公益互联网)社会创新中心](http://yibo.iyiyun.com/Index/web404)
[失蹤兒童少年資料管理中心 404](http://404page.missingkids.org.tw/)

### 4.3 hexo 更多介绍

#### 4.3.1 目录介绍

默认目录结构：

```bash
.
├── .deploy
├── public
├── scaffolds
├── scripts
├── source
|   ├── _drafts
|   └── _posts
├── themes
├── _config.yml
└── package.json
```

- .deploy：执行 hexo deploy 命令部署到 GitHub 上的内容目录
- public：执行 hexo generate 命令，输出的静态网页内容目录
- scaffolds：layout 模板文件目录，其中的 md 文件可以添加编辑
- scripts：扩展脚本目录，这里可以自定义一些 javascript 脚本
- source：文章源码目录，该目录下的 markdown 和 html 文件均会被 hexo 处理。该页面对应 repo 的根目录，404 文件
- favicon.ico 文件，CNAME 文件等都应该放这里，该目录下可新建页面目录。
- \_drafts：草稿文章
- \_posts：发布文章
- themes：主题文件目录
- \_config.yml：全局配置文件，大多数的设置都在这里
- package.json：应用程序数据，指明 hexo 的版本等信息，类似于一般软件中的关于按钮

#### 4.3.2 \_config.yml 简单说明：

```bash
# Hexo Configuration
## Docs: http://zespia.tw/hexo/docs/configure.html
## Source: https://github.com/tommy351/hexo/

# Site #整站的基本信息
title: 刘小光 #网站标题
subtitle: 求知，好奇，审美。就自己仅有的才能去发挥，去表达内心深刻的感觉。 #网站副标题
description: #网站描述，给搜索引擎用的，在生成html中的head->meta中可看到
author: 刘小光 #网站作者，在下方显示
email: vincexgliu@gmail.com.com #联系邮箱
language: zh-CN #语言
timezone:

# URL #域名和文件结构
## If your site is put in a subdirectory, set url as 'http://yoursite.com/child' and root as '/child/'
url: http://ibruce.info #你的域名
root: /
permalink: :year/:month/:day/:title/
tag_dir: tags
archive_dir: archives
category_dir: categories
code_dir: downloads/code

# Writing #写文章选项
new_post_name: :title.md # File name of new posts
default_layout: post #默认layout方式
auto_spacing: false # Add spaces between asian characters and western characters
titlecase: false # Transform title into titlecase
external_link: true # Open external links in new tab
max_open_file: 100
multi_thread: true
filename_case: 0
render_drafts: false
highlight: #代码高亮
  enable: true #是否启用
  line_number: false #是否显示行号
  tab_replace:

# Category & Tag #分类与标签
default_category: uncategorized # default
category_map:
tag_map:

# Archives #存档，这里的说明好像不对。全部选择1，这个选项与主题中的选项有时候会有冲突
## 2: Enable pagination
## 1: Disable pagination
## 0: Fully Disable
archive: 1
category: 1
tag: 1

# Server #本地服务参数
## Hexo uses Connect as a server
## You can customize the logger format as defined in
## http://www.senchalabs.org/connect/logger.html
port: 4000
logger: true
logger_format:

# Date / Time format #日期显示格式
## Hexo uses Moment.js to parse and display date
## You can customize the date format as defined in
## http://momentjs.com/docs/#/displaying/format/
date_format: MMM D YYYY
time_format: H:mm:ss

# Pagination #分页设置
## Set per_page to 0 to disable pagination
per_page: 10 #每页10篇文章
pagination_dir: page

# Disqus #社会化评论disqus，我使用多说，在主题中配置
disqus_shortname:

# Extensions #插件，暂时未安装插件
## Plugins: https://github.com/tommy351/hexo/wiki/Plugins
## Themes: https://github.com/tommy351/hexo/wiki/Themes
## 主题
theme: modernist # raytaylorism # pacman # modernist # light
exclude_generator:

# Deployment #部署
## Docs: http://zespia.tw/hexo/docs/deploy.html
deploy:
  type: git
  repository: git@github.com:xiaogliu/xiaogliu.github.io.git
  branch: master #你的GitHub Pages仓库
```

#### 4.3.3 修改局部页面

页面展现的全部逻辑都在每个主题中控制，源代码在 hexo\themes\你使用的主题\中，以 modernist 主题为例：

```bash
.
├── languages          #多语言
|   ├── default.yml    #默认语言
|   └── zh-CN.yml      #中文语言
├── layout             #布局，根目录下的*.ejs文件是对主页，分页，存档等的控制
|   ├── _partial       #局部的布局，此目录下的*.ejs是对头尾等局部的控制
|   └── _widget        #小挂件的布局，页面下方小挂件的控制
├── source             #源码
|   ├── css            #css源码
|   |   ├── _base      #*.styl基础css
|   |   ├── _partial   #*.styl局部css
|   |   ├── fonts      #字体
|   |   ├── images     #图片
|   |   └── style.styl #*.styl引入需要的css源码
|   ├── fancybox       #fancybox效果源码
|   └── js             #javascript源代码
├── _config.yml        #主题配置文件
└── README.md          #用GitHub的都知道
```

如果你需要修改头部，直接修改 hexo\themes\modernist\layout_partial\header.ejs，比如头上加个搜索框：

```html
<div>
<form class="search" action="//google.com/search" method="get" accept-charset="utf-8">
 <input type="search" name="q" id="search" autocomplete="off" autocorrect="off" autocapitalize="off" maxlength="20" placeholder="Search" />
 <input type="hidden" name="q" value="site:<%- config.url.replace(/^https?:\/\//, '') %>">
</form>
</div>
```

将如上代码加入即可，您需要修改 css 以便这个搜索框比较美观。

再如，你要修改页脚版权信息，直接编辑 hexo\themes\modernist\layout_partial\footer.ejs。同理，你需要修改 css，直接去修改对应位置的 styl 文件。

## 五、多台电脑协同维护 blog

这就需要一开始配置 github 仓库时做好：第一次搭建 blog 时 git 新建两个分支，一个 master，发布更新，一个 source（或其他任意名称）进行维护(放置所有原始 markdown 文件)。每次更新 blog，都是再 source 分支更新，然后 deploy 到 master。

> 我第一次搭建 blog 时，发布的分支和维护的分支没有区分，虽然建了两个分支，但并不清楚原理，时隔几个月再看时，发现维护的 source 分支并没有及时推送到远程仓库，结果，拉回 source 分支一看，markdown 文件都丢失了，这样发布 master 后，之前的文件就都没有了！

- 日常维护流程：
  1、在 source 分支添加、修改 blog 内容，修改完后 git add , commit, push；
  2、执行 hexo g -d，发布到 master（\_config.yml 中的 deploy 参数，分支已经设置为 master）

- 本地资料丢失（比如重装电脑或者更换电脑）后进行下列步骤维护：

1、将 source 分支拉到本地

**进行`hexo`命令操作前，确保本地已安装 hexo 命令行工具**

> 检测方法：在命令行中输入`hexo`看有无版本信息，没有的执行命令`npm install hexo-cli -g`安装

```bash
git clone -b source https://github.com/xiaogliu/xiaogliu.github.io
```

> 之所以日常维护每次更改 markdown 都要 push，实际也是备份的过程，不然拉回的是不完整的 blog

2、进入 hexo 文件夹，执行

```bash
npm install
```

> 实际不需要重新 npm install hexo、npm install、npm install hexo-deployer-git，因为执行 npm install，hexo,hexo-deployer-git 就已经安装，因为 package.json 文件里都写了相应依赖了，如下

```bash
{
  "name": "hexo-site",
  "version": "0.0.0",
  "private": true,
  "hexo": {
    "version": "3.2.2"
  },
  "dependencies": {
    "hexo": "^3.2.0",
    "hexo-deployer-git": "^0.1.0",
    "hexo-generator-archive": "^0.1.4",
    "hexo-generator-category": "^0.1.3",
    "hexo-generator-index": "^0.2.0",
    "hexo-generator-tag": "^0.2.0",
    "hexo-renderer-ejs": "^0.2.0",
    "hexo-renderer-marked": "^0.2.10",
    "hexo-renderer-stylus": "^0.3.1",
    "hexo-server": "^0.2.0"
  }
}
```

## 六、遇到问题及解决方案

1，有时使用 hexo 默认指令`hexo server`会出现本地没法预览的情况。因为 hexo 本地预览，默认端口是`4000`，若该端口被占用，则无法启动预览，开启本地服务时置顶端口就可以了，比如

```js
hexo s -p 3600 // 指定3600端口
```

2，`FATAL Cannot set property 'lastIndex' of undefined`  
解决方法：将文件`_config.yml`中的`auto_detect`设为`false`，详见[Hexo 3.2.0-beta.2 test result report](https://github.com/hexojs/hexo/issues/1627)。

3，`command not found: hexo`

问题描述： 之前使用 Ok，忽然就`command not found: hexo`，可能的原因是改变了 node 版本。

解决办法：重新安装 hexo-cli： `npm install hexo-cli -g`

### 参考资料

【1】[hexo 你的博客](http://ibruce.info/2013/11/22/hexo-your-blog/)  
【2】[Hexo 搭建 Github 静态博客](http://www.cnblogs.com/zhcncn/p/4097881.html")  
【3】[使用 hexo，如果换了电脑怎么更新博客？CrazyMilk 回答](https://www.zhihu.com/question/21193762)  
【4】[SSH-互动百科](http://www.baike.com/wiki/ssh)  
【5】[Secure Shell-维基百科](https://en.wikipedia.org/wiki/Secure_Shell)
