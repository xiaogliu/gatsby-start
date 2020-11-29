---
title: Atom配置
date: 2017-08-27 13:15:24
tags: [atom]
categories: Tools
e_title: atom-configuration
---

用 vscode 很长一段时间，因为相比 atom，vscode 占用内存和 CPU 更少，并且体积也比 atom 小很多。但是 vscode 耗电量太大了，自己经常带笔记本出去不带电源，如果打开 vscode 电量消耗太快。所以，又用回 atom（2018-5）。

# 编辑器配置

## Non Word Charactors

```
/\()"':,.;<>~!@#$%^&*|+=[]{}`?…
```

> 双击选择文本时中划线`-`作为单词的一部分，不作为分割依据

## Preferred Line Length

```
1000
```

> 不一定是 200，主要不想看到编辑器中的分割线，大于编辑器能显示的最大字符就好

## Show Indent Guide

复选框打钩，可以显示对齐线。

# 快捷键

## 自定义快捷键配置如下：

```bash
'atom-text-editor':
  'cmd-alt-i':        'editor:auto-indent'
  'ctrl-shift-cmd-m': 'markdown-preview:toggle'
# markdown-writer keymap
'.platform-darwin atom-text-editor:not([mini])':
  'shift-cmd-K': 'markdown-writer:insert-link'
  'shift-cmd-I': 'markdown-writer:insert-image'
  'cmd-v':       'markdown-writer:insert-image-clipboard'
  'cmd-i':       'markdown-writer:toggle-italic-text'
  'cmd-b':       'markdown-writer:toggle-bold-text'
  "cmd-'":       'markdown-writer:toggle-code-text'
  'cmd-k':       'markdown-writer:toggle-keystroke-text'
  'cmd-h':       'markdown-writer:toggle-strikethrough-text'
  'ctrl-alt-1':  'markdown-writer:toggle-h1'
  'ctrl-alt-2':  'markdown-writer:toggle-h2'
  'ctrl-alt-3':  'markdown-writer:toggle-h3'
  'ctrl-alt-4':  'markdown-writer:toggle-h4'
  'ctrl-alt-5':  'markdown-writer:toggle-h5'
  'shift-cmd-O': 'markdown-writer:toggle-ol'
  'shift-cmd-U': 'markdown-writer:toggle-ul'
  'shift-cmd->': 'markdown-writer:toggle-blockquote'
  "shift-cmd-'": 'markdown-writer:toggle-codeblock-text'
  'cmd-j cmd-p': 'markdown-writer:jump-to-previous-heading'
  'cmd-j cmd-n': 'markdown-writer:jump-to-next-heading'
  'cmd-j cmd-d': 'markdown-writer:jump-to-reference-definition'
  'cmd-j cmd-t': 'markdown-writer:jump-to-next-table-cell'
# enable emmet in .vue file
'atom-text-editor[data-grammar~="vue"]:not([mini])':
  'tab': 'emmet:expand-abbreviation-with-tab'
```

## 系统默认常用快捷键

| 操作                       | 快捷键                   |
| -------------------------- | ------------------------ |
| toggle 目录树              | cmd + \                  |
| 在当前行的下一行插入一空行 | cmd + enter              |
| 在项目中搜索文件           | cmd + p                  |
| 调出命令窗口               | cmd + shift + p          |
| tab 间切换                 | cmd + 数字 or ctrl + tab |
| 全局搜索                   | cmd + shift + f          |
| 当前行复制到下一行         | cmd + shift + d          |
| 选中相同字符               | cmd + d                  |
| 删除当前行                 | ctrl + shift + k         |
| 通过 prettier 格式化       | ctrl + options + f       |
| 通过 atom-beautify 格式化  | ctrl + options + b       |

> 显示隐藏不可见字符操作：首先`cmd + shift + p`调出命令行，然后在搜索框输入`invisible`，选中`Window Toggle Invisibles`。这在确认编辑器中是否混用`tab`，`space`，或者查看行结尾是 Unix 类型还是 Windows 类型时很便捷，不用去设置里设置。

# 插件

## 必备

[sublime-style-column-selection](https://atom.io/packages/Sublime-Style-Column-Selection)：支持列选择；  
[prettier-atom](https://atom.io/packages/prettier-atom)：格式化代码；  
[atom-beautify](https://atom.io/packages/atom-beautify)：格式化代码（以 prettier 为主，没有 prettier 时用，同时在 setting 设置 vue 的格式化插件为 prettier-atom）；  
[linter-eslint](https://atom.io/packages/linter-eslint)：js 检查，可设置和 prettier 配合使用（还有其他相关依赖，atom 会提示安装）；  
~~[atom-terminal](https://atom.io/packages/atom-terminal)：在当前目录打开终端；~~  
[highlight-selected](https://atom.io/packages/highlight-selected)：自动高亮选中的相同字符；  
~~[minimap](https://atom.io/packages/minimap)：代码缩略地图；~~
[open-in-browser](https://github.com/magbicaleman/open-in-browser)：在浏览器中打开文件，主要针对 html

## 语言相关

[emmet](https://atom.io/packages/emmet)：编写 html 神奇，强大的自动补全（**vue 组件中使用需更改自定义快捷键配置，见上文快捷键配置**）；  
[markdown-writer](https://atom.io/packages/markdown-writer)：书写 markdown 利器，支持各种快捷键（**需自定义快捷键，见上文快捷键配置**）；  
[language-vue](https://atom.io/packages/language-vue)：Vue 语法高亮；  
[pigments](https://atom.io/packages/pigments)：CSS 颜色高亮；  
[atom-typescript](https://atom.io/packages/atom-typescript)：typescript 颜色高亮；  
[language-ejs](https://atom.io/packages/language-ejs)：ejs 颜色高亮；

> vue 的 template 不能设置自定义规则格式化，再另安装插件感觉没必要，但支持手动批量缩进，见自定义快捷键。

## 其他

[file-icons](https://atom.io/packages/file-icons)：显示文件类型图标；  
[docblockr](https://atom.io/packages/docblockr)：快速注释；  
[autocomplete-paths](https://atom.io/packages/autocomplete-paths)：路径不全，vue 中貌似 not working；  
[script](https://atom.io/packages/script)：选中代码即可在 atom 中返回执行结果；  
[merge-conflicts](https://atom.io/packages/merge-conflicts)：处理冲突的文件（还没用过）；

# 主题

**UI Theme**： one dark;
~~**Syntax Theme**: Monokai。~~
**Syntax Theme**: one dark。

> [Monokai](https://atom.io/themes/monokai)主题需要单独安装

# 其他

## windows 下默认安装失败

如果在 windows 下默认安装失败，提示`Path too long exception`，下载安装包后参考下面解决方式：

1.  用解压文件打开 AtomSetup.exe；
2.  将文件内容导出到相对较短的路径中，比如`C:\Temp`；
3.  打开 CMD，进入刚才放 Atom 导出文件的文件目录；
4.  运行`Update.exe --install=.` 。

## 更新说明

2017-09-16 更新为基于 Mac 进行的配置。

# 参考资料

【1】[Path too long exception on Windows install](https://github.com/atom/atom/issues/5109)  
【2】[Atom 编辑器中的自动缩进代码](https://gxnotes.com/article/71037.html)  
【3】[zhuochun/md-writer-Settings for Keymaps](https://github.com/zhuochun/md-writer/wiki/Settings-for-Keymaps)
