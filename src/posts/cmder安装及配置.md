---
title: cmder安装及配置
date: 2017-04-07 21:51:49
tags: [cmder, webstorm, sublime]
categories: Tools
e_title: install-and-configure-cmder
---

# 安装

[官网下载](http://cmder.net/)程序包。  
**cmder 无需安装，解压即用**。官网有两个版本供下载：cmder-mini 和 cmder-full，两个区别是 full 版本含有 git for windows，若已经安装，选用 cmder-mini 即可，否则选 cmder-full。

# 配置

## 添加鼠标右键

以**管理员权限**打开终端，输入下面命令（先把 cmder 添加到系统变量中）

```bash
Cmder.exe /REGISTER ALL
```

> 配置完成后，鼠标右键可看到 cmder 选项，打开 cmder，**终端显示目录为当前目录**

若想**删除鼠标右键打开 cmder**，根目录新建文件`*.bat`，写入下面内容，以管理员身份运行即可

```bash
@echo off
Reg delete "HKEY_LOCAL_MACHINE\SOFTWARE\Classes\Directory\Background\shell\Cmder" /f
pause
```

## 添加系统环境变量

我的电脑 > 右键属性 > 高级系统设置 > 环境变量 > 系统变量，在`path`中添加 cmder 路径

> 添加系统变量后可以通过`win+r`输入`cmder`开启 cmder，打开后默认目录为`C:\Users\Administrator`

## ls 中文乱码

Startup > Environment > Set up environment variables， 添加下面代码

```bash
set LANG=zh_CN.UTF8
```

> 需要重启 cmder

## 主题

Features > Colors > Schemes，目前在用默认主题`<xterm>`

## 字体

Main > Main console font，目前在用~~`YaHei Consolas Hybrid`~~ ~~`Ubuntu Mono`~~ `Microsoft YaHei Mono`，Size 为`18`，勾选`Bold`，其他默认

> 很多人推荐 Adobe 开源字体[source-code-pro](https://github.com/adobe-fonts/source-code-pro)。但安装后感觉中文显示太难看，换回 ~~"YaHei Consolas Hybrid"~~ "Ubuntu Mono"。
> windown 系统下安装字体方法：下载字体包，将字体包里面 TTF 文件夹下面文件全部复制到 window 字体文件夹下（控制面板 > 字体，或者 win 键 > 输入“字体”进行搜索）

## Tab bar

Main > Tab bar > Tabs, `Don't show`

> Tab bar 即默认窗口最下面类似任务栏的横条

## Scrollbar

Main > Appearance > Scrollbar, `Hide`

## 自定义快捷键

Keys & Macro > Hotkeys,modifiers,macros, 通过搜索框快速定位需要设置的操作，目前只对分屏（split(0,50,0)）进行了快捷键自定义`LAlt + LShift + S`

## 设置默认任务

默认为`{cmd::Cmder}`，其他选项含义如下

| Task                | Shell          | Description                                                                                    |
| ------------------- | -------------- | ---------------------------------------------------------------------------------------------- |
| Cmder               | cmd.exe        | Windows 'cmd.exe' shell enhanced with Git, Git aware prompt, Clink(GNU Readline), and Aliases. |
| Cmder as Admin      | cmd.exe        | Administrative Windows 'cmd.exe' Cmder shell.                                                  |
| PowerShell          | powershell.exe | Windows PowerShell enhanced with Git and Git aware prompt.                                     |
| PowerShell as Admin | powershell.exe | Administrative Windows 'powershell.exe' Cmder shell.                                           |
| Bash                | bash.exe       | Unix/Linux like bash shell running on Windows.                                                 |
| Bash as Admin       | bash.exe       | Administrative Unix/Linux like bash shell running on Windows.                                  |
| Mintty              | bash.exe       | Unix/Linux like bash shell running on Windows.                                                 |
| Mintty as Admin     | bash.exe       | Administrative Unix/Linux like bash shell running on Windows.                                  |

若使用 Mintty 需进行额外设置，详见[Access to multiple shells in one window using tabs](https://github.com/cmderdev/cmder)。

> 使用 cmd.exe、powershell.exe 和 bash.exe，切换盘符有差别
>
> - cmd.exe、powershell.exe 下切换盘符：直接输入盘符加冒号
>
> ```js
>   // 假设当前目录为C盘，想切换到D盘
>   d:
> ```

````
> - bash.exe下切换盘符： cd空格/盘符/
```js
// 假设当前目录为C盘，想切换到D盘
cd /d/
````

# 操作

## 打开 cmder

- **当前目录右键打开 cmder**  
   开始后 cmder 默认目录为当前目录
- **win+r，输入 cmder**  
   开启后默认目录为 C:\Users\Administrator

## 调出设置面板

```bash
win + alt + p
```

## 在已有终端窗口下打开新窗口

```bash
ctrl + t
```

> 若想以管理员身份打开终端，`ctrl + t`调出选择面板后，勾选`run as administrator`。  
> 在这里，也可以选择以什么任务打开新的窗口而非默认值

## 分屏显示

```js
LShift + LAlt + s; // 自定义快捷键
```

# 关联编辑器

## webstorm

settings > terminal > shell path, 填写下面内容

```bash
"cmd.exe" /k ""%CMDER_ROOT%\vendor\init.bat""
```

> cmd.exe 需要加引号，路径需要加两个引号，不然可能会报下面错误

```bash
java.io.IOException: Couldn't create PTY
```

## sublime

无法直接内嵌到 sublime 中，但可以在使用 sublime 时通过快捷键打开 cmder

- 安装插件`terminal`
- 设置`terminal`
  Preferences->Package Settings->Terminal->Settings-User，输入下面内容

  ```js
  {
      // 输入cmder路径
      "terminal": "X:\\software\\cmder\\Cmder.exe",

      // 通过设置自定义快捷键，使用命令"open_terminal" 或者
      // "open_terminal_project_folder"打开终端
      "parameters": ["/START","%CWD%"]
  }
  ```

- 自定义打开终端快捷键
  Preferences->Key Bindings - User，输入下面内容

  ```json
  { "keys": ["alt+2"], "command": "open_terminal" }
  ```

# 其他设置

cmder 支持 Aliases，通过`alias`命令可以设置别名，简化操作，terminal 中输入`alias 替代名=被替代名 $*`，如

```bash
alias ls=ls --color $*
```

> 也可以直接在 cmder 安装目录/config/user-aliases.cmd 中直接输入要设置的别名

# 效果图

![cmder效果图](https://raw.githubusercontent.com/xiaogliu/pic-lib/master/old/cmder170726.png)

# 问题

1. win10 创意者更新（1703）安装后 cmder 光标前多了一个空格，且`ls`打印的目录没有颜色，将 win10 cmd 更改为“使用旧版控制台”就可以了（打开 windows 自带终端，标题栏右键-->属性-->选项，可看到使用旧版控制台选项），更多信息可查看这个 issue: [display error with non-ASCII characters on windows 1703](https://github.com/cmderdev/cmder/issues/1339)

> 如果要使用 Windows 自带 bash 功能，必须使用新版控制台，但 Windows 下的 bash 目前（2017-07-03）还很鸡肋，不建议使用。

# 参考资料

【1】[cmderdev/cmder](https://github.com/cmderdev/cmder)
【2】[Cmder 使用](http://front-end.leanote.com/post/Cmder)  
【3】[Win 下必备神器之 Cmder](http://jeffjade.com/2016/01/13/2016-01-13-windows-software-cmder/)  
【4】[再见 2015 再见 cmd](http://imweb.io/topic/56b072d05c49f9d377ed8ee2)
