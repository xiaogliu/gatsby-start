---
title: Flex 布局中避免子元素高度被撑高
date: 2020-05-15 14:06:51
tags: [ES6]
categories: CSS
e_title: avoid-child-element-height-expand-in-flex-layout
---

Flex 布局中子元素高度容易被最高元素撑高，使用 `align-self` 可避免。

```css
/* 此处是居中对齐，也可使用 flex-start 顶部对齐 */
align-self: center; 
```
