---
title: Git使用过程遇到问题及解决方案
date: 2017-02-12 19:33:13
tags: [git]
categories: Tools
e_title: gather-git-question
---

记录自己git使用过程中遇到的问题及解决方案，随时更新。
>曾经为了删除未commit的本地更改网上搜了一个命令，解决把该分支下 `.git` 文件下的记录全部删掉，好在不是master分支，不然闯大祸。
网上的资料也都是网友整理，稂莠不齐，git命令强大，但正因如此，可能强大到失控，模棱两可的命令一定要参考官方文档。

## pull报错'refusing to merge unrelated histories'
- 问题描述

```bash
fatal: refusing to merge unrelated histories
```
- 原因：The default behavior has changed since git 2.9:
>"git merge" used to allow merging two branches that have no common base by default, which led to a brand new history of an existing project created and then get pulled by an unsuspecting maintainer, which allowed an unnecessary parallel history merged into the existing project. The command has been taught not to allow this by default, with an escape hatch "--allow-unrelated-histories" option to be used in a rare event that merges histories of two projects that started their lives independently.

 See the [git release changelog](https://github.com/git/git/blob/master/Documentation/RelNotes/2.9.0.txt#L58-L68) for more information.

- 解决方案：Using `--allow-unrelated-histories` flag worked with pull request in this way

```bash
git pull origin branchname --allow-unrelated-histories
```

- 参考资料：stack**overflow** [Git refusing to merge unrelated histories](http://stackoverflow.com/questions/37937984/git-refusing-to-merge-unrelated-histories)

<!-- more -->

## 每次push要求填写用户名和密码
- 问题描述：已配置ssh，从remote repository可以正常clone，无需填写密码，但每次push有弹框跳出要求填写用户名密码。

- 原因：A common mistake is cloning using the default (HTTPS) instead of SSH.通过命令 `git remote -v`可以查看默认地址，如果https，要改回ssh
![](https://raw.githubusercontent.com/xiaogliu/pic-lib/master/old/2017-02-12_201337.png)

- 解决方案：You can correct this by going to your repository, clicking the ssh button left to the URL field and updating the URL of your origin remote like this:(不需要重新clone一份)

```bash
git remote set-url origin git@github.com:username/repo.git
```

- 参考资料：stack**overflow** [Git push requires username and password](http://stackoverflow.com/questions/6565357/git-push-requires-username-and-password)

## git中文乱码
> **实际跟版本也有关系！！！！2.92ok（完全默认设置），但最新的2.11中文就各种问题：不能输入，log乱码等等！** 但安装完hexo，status状态下又乱码了，下面方法解决。

- 问题描述：git status中文乱码，在中文情况下 git status是 “\344\272\247\345\223\201\351\234\200\346\261\202”差不多这样的。
- 原因不明
- 解决方案：解决这个问题方法是设置git编码：

```bash
git config --global core.quotepath false
```

## Could not resolve hostname github.com

- 问题描述：用着好好地，某天忽然报`Could not resolve hostname github.com`，完整错误见下

```bash
ssh: Could not resolve hostname github.com: Name or service not known
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

- 解决方案：   

`ping`github.com，将得到的ip地址添加到hosts文件

```bash
ping github.com
```
得到ip为192.30.253.112，将下面代码添加到hosts文件

```bash
192.30.253.112 github.com
```

## 参考资料：
【1】[git status 显示中文](http://blog.csdn.net/cjopengler/article/details/46585319)   
【2】[git错误--ssh: Could not resolve hostname ssh.github.com: Name or service not known--解决方式](http://blog.csdn.net/piaotiejun/article/details/48734175)
