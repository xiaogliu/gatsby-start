---
title: 记一次线上事故（unfamiliar && communication）
date: 2020-09-09 20:19:33
tags: [idea]
categories: Team Building
e_title: online-accident
---

简单来说就是我被分配了一个自己不熟的 task（send redirect ID），但又有完成时间限制，在自己不确定的情况下就上线了，结果就出了线上事故！

并且，更为致命的是，Leader 在晨会有提及这个问题，但当时只是一语带过，我也没在追问（不确定是否可以 pending，因为曾提及和另一个 team 讨论之后再发布，我没有跟进进度）。所以在没有进一步确认的情况下，就仓促发布了。

这里面反映了两个问题：

1. “凡是可能出错的事就一定会出错”，这也即[墨菲定律](https://zh.wikipedia.org/wiki/%E6%91%A9%E8%8F%B2%E5%AE%9A%E7%90%86)。所以，不确定的代码，不能发布！
2. 工作中遇到问题要及时主动地沟通，不能坐以待毙、闭门造车（事倍功半甚至造成事故）。
