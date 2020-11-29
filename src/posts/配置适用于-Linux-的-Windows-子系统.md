---
title: 在 Win10 中配置 Linux 开发环境
date: 2018-09-20 20:42:32
tags: [Tools]
categories: Tools
e_title: config-win10-sub-linux-sys
---

很多公司开发用的操作系统是 windows，但 windows 的终端实在难用。win10 发布初期就集成了 linux 子系统，当时还是 beta 版，目前（2018-09-20，我当前 windows 版本号是 1803，操作系统版本是 17134.285）beta 标志已经取消，这表明已经相对成熟了。

所以想试下 ubuntu 的终端，这样就可以集成 oh-my-zsh 了（集成 oh-my-zsh 的终端超级好用啊，不管主题还是各种操作）。虽然初衷仅仅是想使用 ubuntu 的终端，但配置到后期发现完全可以将开发环境需要的软件（比如前端使用的 node，npm 等等）安装到 ubuntu 中，这样在命令行中的开发体验和直接使用 ubuntu 基本相同。从这方面讲，windows 的开发体验也不再那么不堪。

> 相当于借助 Ubuntu 的终端管理 windows 上的资源。

先上效果图，下面介绍如何配置。

![windows中linux终端](https://raw.githubusercontent.com/xiaogliu/pic-lib/master/old/windows-linux.png)

# 1. 配置 linux 的终端

这是最重要的一步，配置好终端，就成功了一半。

## 1.1 开启适用于 Linux 的 Windows 子系统

### 1.1.1 前期工作

首先，win10 版本要 1709 以上。

然后前往 “启用或关闭 Windows 功能”，将 “适用于 Linux 的 Windows 子系统” 打勾，重启生效。

> 如何进入“启用或关闭 Windows 功能”不同版本有差异，1803 是 “win + x” 选择 “应用和功能”，点击面板右侧 “程序和功能”，然后在面板左侧可以看到 “启用或关闭 Windows 功能”。

### 1.1.2 安装 linux

打开 “Microsoft Store” 搜索对应的 Linux 应用进行安装，这里我选择的是 Ubuntu（没写版本号的 Ubuntu 安装后查看版本号`cat /etc/issue`显示为 Ubuntu 18.04.1 LTS）。

安装成功后无需重启，点击“开始”，搜索 “bash”，或者 “win + r” 输入 “bash” 就可以启动 Ubuntu 下的终端了。

## 1.2 配置 zsh

配合 zsh 可以扩展 Ubuntu 终端的功能，比如，历史纪录、tab 目录选择、git 别名、自动添加`sudo`等。

### 1.2.1 安装 zsh

使用 ubuntu 的`apt-get`命令进行安装。

```bash
sudo apt-get install zsh
```

通过`zsh --version`可查看是否安装成功。

### 1.2.2 配置 zsh 为默认终端

在用户目录`~`下找到`.bash_profile`，如果没有就建一个，当然这是个隐藏的文件，需要`ls -a`来查看。打开它，然后在末尾加上:

```bash
exec zsh
source .zshrc
```

### 1.2.3 安装 oh-my-zsh

zsh 配置本身很繁琐，[oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh) 可以更方便的管理 zsh 配置，集成了各种插件、主题。

通过下面命令进行安装：

```bash
wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | sh
```

### 1.2.3 激活/安装插件

oh-my-zsh 插件分本身集成的插件（在目录`~/.oh-my-zsh/plugins`下面）和需要自己下载的插件两部分。

如果是本身继承的，直接在`~/.zshrc`中激活就好：

```bash
# 将需要激活的插件名写在小括号中
plugins=(git sudo)
```

如果是非本身集成的，除了需要在`~/.zshrc`中激活，还需要将插件下载到目录`~/.oh-my-zsh/custom/plugins`下面

除了使用内置的 git 和 sudo，我还下载了 zsh-syntax-highlighting 和 zsh-autosuggestions：

```bash
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

**NOTE：**

如果下载完第三方插件出现了权限问题，可以在`.zshrc`里引入 oh-my-zsh 之前加入`ZSH_DISABLE_COMPFIX=true`解决：

```bash
# authority，在引入 oh-my-zsh 之前加入
ZSH_DISABLE_COMPFIX=true

# 这里是引入 oh-my-zsh
source $ZSH/oh-my-zsh.sh
```

## 1.3 安装 cmder

为什么还要安装 cmder？上面配置完终端的字体还不好看，通过配置 cmder 可以使终端显示的更漂亮。

具体安装配置可参考这篇文章 [cmder 安装及配置](https://xiaogliu.github.io/2017/04/07/install-and-configure-cmder/)，这里需要说明的是怎么配置 cmder 默认启动 Ubuntu 终端：

通过 “win + alt + p” 打开设置，然后在 “startup” 中选中 “Command line” 添加参数`%windir%\system32\bash.exe ~`即可。

## 1.4 其他坑

- 对于 Ubuntu 的终端来说，windows 的硬盘相当于挂载在 ubuntu 系统下，所以切换盘符时需要在前面加`mnt`，比如，从 C 盘切到 E 盘：

```bash
# 当前 C 盘，切到 E 盘
cd /mnt/e/
```

- 在终端中使用代理

终端本身不走系统代理，如果想通过终端访问墙外资源，在`~/.zshrc`中添加下面内容：

```bash
# proxy list
alias proxy='export http_proxy=socks5://127.0.0.1:1080; export https_proxy=socks5://127.0.0.1:1080'
alias unproxy='unset http_proxy; unset https_proxy'
```

通过在终端输入命令`proxy`开启代理，通过`unproxy`关闭代理。

> 我这里使用了 shadowsocks，可以通过`curl ip.cn`命令判断代理是否开启。

- 如果在 Ubuntu 中安装了某个软件不能正确执行，比如 npm，将 windows 上对应的软件删掉再试下。

# 2. 安装开发软件

其实和原生 Ubuntu 安装软件一致，这里以安装 node，npm，vue-cli 为例介绍：

> 安装之前可以先更新下包资源：`sudo apt-get update`

## 2.1 安装 node

```bash
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

具体参考：[install Ubuntu：Debian and Ubuntu based Linux distributions](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)

## 2.2 安装 npm 及其他 npm 包

npm 需要单独安装

```bash
sudo apt-get install npm
```

安装其他 npm 包就是正常套路了，比如：

```bash
sudo npm i cnpm -g
cnpm i -g vue-cli
```

# 参考资料

[WIN10 下搭建一个 linux 环境(ubuntu+cmder+oh-my-zsh)](https://blog.csdn.net/lissettecarlr/article/details/81040750)  
[Github:zsh-syntax-highlighting how to install](https://github.com/zsh-users/zsh-syntax-highlighting/blob/master/INSTALL.md)  
[Mac OSX 终端走 shadowsocks 代理](https://github.com/mrdulin/blog/issues/18)
