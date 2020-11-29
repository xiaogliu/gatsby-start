---
title: sublime自定义主题配色
date: 2017-04-07 21:48:24
tags: [markdown,BracketHighlighter,sublime]
categories: Tools
e_title: define-sublime-theme-color
---
对插件BracketHighlighter默认高亮及sublime自带markdown高亮显示不满意，搜索教程后在这做下总结。

# theme和color_them的区别
首先要要区分两个概念`theme`和`color_theme`：
- `theme`   
可以理解为*形状、布局*等框架类的东西，比如tab是方形还是带有弧度，侧边栏文件显示带有图标与否等等   
- `color_theme`
顾名思义：主题的颜色，实在形状、布局的基础上着色。所以，如果想调整某一主题的颜色，需要修改`color_theme`   

sublime通过 preferences > color theme > user 对color theme进行选择，color theme文件后缀为`.tmTheme`。   

网站 [tmtheme-editor](http://tmtheme-editor.herokuapp.com) 可以在线调整颜色，支持本地文件导入，调整结束后再下载到本地，非常方便。**即便如此，如果不是从事设计工作，很难调出一款满意的配色，但如果确实对某款插件或者某种语言的高亮显示不满意，最简单的方法就是针对该款插件或者语言搜索已有的优化方案，然后添加到正在使用的color_theme文件中，覆盖原有配色。**   

# 优化BracketHighlighter高亮显示
效果图：   
![BracketHighlighter自定义高亮显示](https://raw.githubusercontent.com/xiaogliu/pic-lib/master/old/bracket.png)

> 实际使用中我只保留了蓝色和未配对时显示的红色，太多颜色反而觉得好乱。但下面的配置依然是多色方案。

## 对插件进行设置
在 Preferences > package settings > Bracket Highlighter > Bracket Settings-User 中添加下面内容   

```js
{
    "bracket_styles": {
        "default": {
            "icon": "dot",  //符号的类型：() {} <>
            "color": "entity.name.class",
            "color": "brackethighlighter.default", //颜色配置
            "style": "highlight"  //高亮的类型:highlight（整个白色）或者outline（下划线）
        },
        "unmatched": {
            "icon": "question",
            "color": "brackethighlighter.unmatched",
            "style": "highlight"
        },
        // User defined region styles
        "curly": {
            "icon": "curly_bracket",
            "color": "brackethighlighter.curly",
            "style": "highlight"
        },
        "round": {
            "icon": "round_bracket",
            "color": "brackethighlighter.round",
            "style": "highlight"
        },
        "square": {
            "icon": "square_bracket",
            "color": "brackethighlighter.square",
            "style": "highlight"
        },
        "angle": {
            "icon": "angle_bracket",
            "color": "brackethighlighter.angle",
            "style": "highlight"
        },
        "tag": {
            "icon": "tag",
            "color": "brackethighlighter.tag",
            "style": "highlight"
        },
        "single_quote": {
            "icon": "single_quote",
            "color": "brackethighlighter.quote",
            "style": "highlight"
        },
        "double_quote": {
            "icon": "double_quote",
            "color": "brackethighlighter.quote",
            "style": "highlight"
        },
        "regex": {
            "icon": "regex",
            "color": "brackethighlighter.quote",
            "style": "outline"
        }
    },
}
```

## 对`.tmTheme`文件进行设置

找到Sublime text3安装目录下的Packages中的`Color Scheme - Default.sublime-package`，给该文件添加`.zip`后缀，解压找到`Monokai.tmTheme`（颜色主题），添加如下内容到`</array>`元素之前：

```html
<dict>
    <key>name</key>
    <string>Bracket Default</string>
    <key>scope</key>
    <string>brackethighlighter.default</string>
    <key>settings</key>
    <dict>
        <key>foreground</key>
        <string>#FFFFFF</string>
        <key>background</key>
        <string>#A6E22E</string>
    </dict>
</dict>
<dict>
    <key>name</key>
    <string>Bracket Unmatched</string>
    <key>scope</key>
    <string>brackethighlighter.unmatched</string>
    <key>settings</key>
    <dict>
        <key>foreground</key>
        <string>#FFFFFF</string>
        <key>background</key>
        <string>#FF0000</string>
    </dict>
</dict>
<dict>
    <key>name</key>
    <string>Bracket Curly</string>
    <key>scope</key>
    <string>brackethighlighter.curly</string>
    <key>settings</key>
    <dict>
        <key>foreground</key>
        <string>#FF00FF</string>
    </dict>
</dict>
<dict>
    <key>name</key>
    <string>Bracket Round</string>
    <key>scope</key>
    <string>brackethighlighter.round</string>
    <key>settings</key>
    <dict>
        <key>foreground</key>
        <string>#E7FF04</string>
    </dict>
</dict>
<dict>
    <key>name</key>
    <string>Bracket Square</string>
    <key>scope</key>
    <string>brackethighlighter.square</string>
    <key>settings</key>
    <dict>
        <key>foreground</key>
        <string>#FE4800</string>
    </dict>
</dict>
<dict>
    <key>name</key>
    <string>Bracket Angle</string>
    <key>scope</key>
    <string>brackethighlighter.angle</string>
    <key>settings</key>
    <dict>
        <key>foreground</key>
        <string>#02F78E</string>
    </dict>
</dict>
<dict>
    <key>name</key>
    <string>Bracket Tag</string>
    <key>scope</key>
    <string>brackethighlighter.tag</string>
    <key>settings</key>
    <dict>
        <key>foreground</key>
        <string>#FFFFFF</string>
        <key>background</key>
        <string>#0080FF</string>
    </dict>
</dict>
<dict>
    <key>name</key>
    <string>Bracket Quote</string>
    <key>scope</key>
    <string>brackethighlighter.quote</string>
    <key>settings</key>
    <dict>
        <key>foreground</key>
        <string>#56FF00</string>
    </dict>
</dict>
```

修改完成的文件放到压缩包`Color Scheme – Default.sublime-package.zip`里边（直接拖过去就好），最后改名为`Color Scheme – Default.sublime-package`放回源目录。

> 不能将`Color Scheme – Default.sublime-package.zip`解压再压缩，否则sublime无法识别这个文件

# 优化markdown高亮显示

效果图：   

![markdown高亮效果图](https://raw.githubusercontent.com/xiaogliu/pic-lib/master/old/markdown2.png)

## 引入插件   

安装插件 [Markdown Extended](https://github.com/jonschlinkert/sublime-markdown-extended)

## 扩展主题

打开 preferences > color theme > user 引用的`.tmTheme`文件，添加如下内容到`</array>`元素之前：

```html
    <dict>
      <key>name</key>
      <string>Markdown: plain</string>
      <key>scope</key>
      <string>text.html.markdown</string>
      <key>settings</key>
      <dict>
        <key>foreground</key>
        <string>#ffffff</string>
      </dict>
    </dict>
    <dict>
      <key>name</key>
      <string>Markup: raw inline</string>
      <key>scope</key>
      <string>text.html.markdown markup.raw.inline</string>
      <key>settings</key>
      <dict>
        <key>foreground</key>
        <string>#ec3533</string>
      </dict>
    </dict>
    <dict>
      <key>name</key>
      <string>Markdown: linebreak</string>
      <key>scope</key>
      <string>text.html.markdown meta.dummy.line-break</string>
      <key>settings</key>
      <dict>
        <key>foreground</key>
        <string>#e0eddd</string>
      </dict>
    </dict>
    <dict>
      <key>name</key>
      <string>Markdown: heading</string>
      <key>scope</key>
      <string>markdown.heading, markup.heading | markup.heading entity.name, markup.heading.markdown punctuation.definition.heading.markdown</string>
      <key>settings</key>
      <dict>
        <key>fontStyle</key>
        <string></string>
        <key>foreground</key>
        <string>#fd971f</string>
      </dict>
    </dict>
    <dict>
      <key>name</key>
      <string>Markup: italic</string>
      <key>scope</key>
      <string>markup.italic</string>
      <key>settings</key>
      <dict>
        <key>fontStyle</key>
        <string>italic</string>
        <key>foreground</key>
        <string>#e42e70</string>
      </dict>
    </dict>
    <dict>
      <key>name</key>
      <string>Markup: bold</string>
      <key>scope</key>
      <string>markup.bold</string>
      <key>settings</key>
      <dict>
        <key>fontStyle</key>
        <string>bold</string>
        <key>foreground</key>
        <string>#f92672</string>
      </dict>
    </dict>
    <dict>
      <key>name</key>
      <string>Markup: underline</string>
      <key>scope</key>
      <string>markup.underline</string>
      <key>settings</key>
      <dict>
        <key>fontStyle</key>
        <string>underline</string>
        <key>foreground</key>
        <string>#a6e22e</string>
      </dict>
    </dict>
    <dict>
      <key>name</key>
      <string>Markup: strike</string>
      <key>scope</key>
      <string>markup.strike</string>
      <key>settings</key>
      <dict>
        <key>fontStyle</key>
        <string></string>
        <key>foreground</key>
        <string>#cc4273</string>
      </dict>
    </dict>
    <dict>
      <key>name</key>
      <string>Markdown: Blockquote</string>
      <key>scope</key>
      <string>markup.quote, punctuation.definition.blockquote.markdown</string>
      <key>settings</key>
      <dict>
        <key>fontStyle</key>
        <string>italic</string>
        <key>foreground</key>
        <string>#66d9ef</string>
      </dict>
    </dict>
    <dict>
      <key>name</key>
      <string>Markup: Quote</string>
      <key>scope</key>
      <string>markup.quote</string>
      <key>settings</key>
      <dict>
        <key>fontStyle</key>
        <string> italic</string>
        <key>foreground</key>
        <string>#66d9ef</string>
      </dict>
    </dict>
    <dict>
      <key>name</key>
      <string>Markdown: Link</string>
      <key>scope</key>
      <string>string.other.link.title.markdown</string>
      <key>settings</key>
      <dict>
        <key>fontStyle</key>
        <string>underline</string>
        <key>foreground</key>
        <string>#66d9ef</string>
      </dict>
    </dict>
    <dict>
      <key>name</key>
      <string>Markup: Raw block</string>
      <key>scope</key>
      <string>markup.raw.block</string>
      <key>settings</key>
      <dict>
        <key>foreground</key>
        <string>#ae81ff</string>
      </dict>
    </dict>
    <dict>
      <key>name</key>
      <string>Markdown: List Items Punctuation</string>
      <key>scope</key>
      <string>punctuation.definition.list_item.markdown</string>
      <key>settings</key>
      <dict>
        <key>foreground</key>
        <string>#777777</string>
      </dict>
    </dict>
    <dict>
      <key>name</key>
      <string>Markdown: Raw Block fenced</string>
      <key>scope</key>
      <string>markup.raw.block.fenced.markdown</string>
      <key>settings</key>
      <dict>
        <key>background</key>
        <string>#222</string>
        <key>foreground</key>
        <string>#ffffff</string>
      </dict>
    </dict>
    <dict>
      <key>name</key>
      <string>Markdown: Fenced Bode Block</string>
      <key>scope</key>
      <string>punctuation.definition.fenced.markdown, variable.language.fenced.markdown</string>
      <key>settings</key>
      <dict>
        <key>background</key>
        <string>#222222</string>
        <key>foreground</key>
        <string>#636050</string>
      </dict>
    </dict>
    <dict>
      <key>name</key>
      <string>Markdown: Fenced Language</string>
      <key>scope</key>
      <string>variable.language.fenced.markdown</string>
      <key>settings</key>
      <dict>
        <key>fontStyle</key>
        <string></string>
        <key>foreground</key>
        <string>#7c7865</string>
      </dict>
    </dict>
    <dict>
      <key>name</key>
      <string>Markdown: Separator</string>
      <key>scope</key>
      <string>meta.separator</string>
      <key>settings</key>
      <dict>
        <key>background</key>
        <string>#ffffff0f</string>
        <key>fontStyle</key>
        <string>bold</string>
        <key>foreground</key>
        <string>#ffffff33</string>
      </dict>
    </dict>
    <dict>
      <key>name</key>
      <string>Markup: table</string>
      <key>scope</key>
      <string>markup.table</string>
      <key>settings</key>
      <dict>
        <key>background</key>
        <string>#ff3a281a</string>
        <key>foreground</key>
        <string>#b42a1d</string>
      </dict>
    </dict>
```

# 参考资料
【1】[Sublime Text3 BracketHighlighter高亮色彩配置](http://www.cnblogs.com/willingtolove/p/4657320.html)
