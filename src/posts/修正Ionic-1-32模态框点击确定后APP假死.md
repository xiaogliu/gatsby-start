---
title: 修正Ionic-1.32模态框点击确定后APP假死
date: 2017-05-14 11:43:03
tags: [Hybrid App,Ionic,JavaScript]
categories: Hybrid App
e_title: fix-ionic1.32-click-modal-app-frozen
---

目前Ionic V1最新版为Ionic V1.32，因为目前（2017-5-14）不管是JavaScirpt还是Angular都处于快速发展中，这意味着版本迭代会非常快，尤其对于框架来说，有时升级版本甚至是破坏性升级。而Ionic是基于Angular的，为了避免不断升级过程中大量踩坑，之前用Ionic-V1构建的APP暂时不进行大版本更新，等Angular稳定后再做升级考虑。同时，如果后续再有APP制作需求，采用当时可选的Ionic最新版。   

也正是因为发展太快，Ionic团队对于旧版本bug的修复往往不能及时发布更新（甚至不做更新），但会在GitHub这个仓库[driftyco/ionic-v1](https://github.com/driftyco/ionic-v1/issues/53)对已知bug提供解决方案。   

曾遇到下拉框在Chrome-V53中无效的情况，但这个问题已经在Ionic-V1.32中修复（详细讨论见这个issue [Select/option doesn't work in chrome 53 for touch events](https://github.com/driftyco/ionic/issues/8181#issuecomment-249667016)），但V-1.32引入了新问题：模态框点击确定后APP假死，修复方案如下：   

在`ionic-angular.js`和`ionic.bundle.js`中找到：   

```js
if (!modalStack.length) {
```

替换为：   

```js
var otherSibling = false;

for (var i = 0; i < modalStack.length; ++i) {
  if (modalStack[i].viewType === self.viewType) {
    // there are other modal (or popover, depending on viewType)
    otherSibling = true;
    break;
  }
}

if (!otherSibling) {
```

关于该问题的总结请查看：[bug (and fix): app FROZEN: class popover-open not removed from body when closing a popover from a modal](https://github.com/driftyco/ionic-v1/issues/53)   

该问题最初的讨论在这：[Popover and Modals interfering, body classes do not get removed - bug newly introduced with 1.3.2](https://github.com/driftyco/ionic-v1/issues/71)   
