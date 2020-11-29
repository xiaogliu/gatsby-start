---
title: Vue组件中使用Sass全局变量
date: 2017-09-09 21:09:40
tags: [Vue, Webpack]
categories: Vue
e_title: use-sass-global-variables-in-every-vue-components
---

在Vue组件中使用Sass全局变量是项目中常见的需求，比如，网站基本色、常用字号等，这些变量设为全局变量，不仅在开发时更加规范，后期维护也更加便捷。   

本文介绍的是通过[Vue-CLI](https://github.com/vuejs/vue-cli)`webpack-simple`脚手架构建的项目中添加Sass全局变量的方法。在这个脚手架中可以在`main.js`中引入全局`css`文件，但直接引入`scss`文件会报错。下面介绍两种引入Sass全局变量的方法（第一种是常规做法，只做介绍用，实际项目中推荐使用配置Webpack的方法）：

# 每个组件中单独引用

假设Sass全局变量保存在`global.scss`文件中，路径为`../path/global.scss`,在需要引用该全局变量的组件中通过`import`引入：

```vue
// some vue component
<template lang="html">
<!-- some code -->
</template>

<script>
// some code
</script>

<style lang="scss">
// 引入sass全局变量
import ../path/global.scss;

// other code
</style>
```

这样做的弊端显而易见：每个组件需要单独写`import`，除了代码重复，如果组件间目录结构不一样，路径还要小心调整。虽然可以设置路径变量防止路径出错，但重复的问题还是没有解决。**所以不推荐这种方法**。

# 更改Webpack配置文件

推荐项目中使用这种方法，只需在Webpack中配置一次，项目中所有Vue组件都可以直接使用Sass全局变量，不需要通过`import`方式重复引用。

## webpack-simple

这里是使用Vue脚手架`webpack-simple`中配置的方法：

1. 安装[sass-resources-loader](https://github.com/shakacode/sass-resources-loader)   

官方介绍该loader的作用：This loader will `@import` your SASS resources into every `required` SASS module. So you can use your shared variables & mixins across all SASS styles without manually importing them in each file.   

但是在`webpack-simple`脚手架中按照Github主页上的介绍，并没有成功引入Sass全局变量。。。而是通过修改默认`vue-loader`解决的

2. 修改默认vue-loader

在Webpack配置文件中修改后的整个`vue-loader`代码如下：

```js
// webpack.config.js中vue-loader部分代码
{
  test: /\.vue$/,
  use: {
    loader: 'vue-loader',
    options: {
      loaders: {
        sass: [
          'vue-style-loader',
          'css-loader',

          // postcss-loader非必须
          'postcss-loader',
          'sass-loader?indentedSyntax=1',
          {
            loader: 'sass-resources-loader',
            options: {

              // 需更改为项目中实际scss文件路径
              resources: path.resolve(__dirname, '../path/global.scss'),
            },
          },
        ],
        scss: [
          'vue-style-loader',
          'css-loader',

          // postcss-loader非必须
          'postcss-loader',
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {

              // 需更改为项目中实际scss文件路径
              resources: path.resolve(__dirname, '../path/global.scss'),
            },
          },
        ],
      },
    },
  },
},
```
经过上述配置，项目中所有Vue组件，只要`<style lang="scss">` (或者sass)标签中的代码都可以使用在`global.scss`中定义的全局变量了，等效将`global.scss`引入进来。

## nuxt

这里是使用[Nuxt.js](https://nuxtjs.org/)时配置方法：

1. 同样需要安装[sass-resources-loader](https://github.com/shakacode/sass-resources-loader)   

2. 在`nuxt.config.js`中进行如下配置：   

```js
const resolve = require('path').resolve

const isVueRule = (rule) => {
  return rule.test.toString() === '/\\.vue$/'
}
const isSASSRule = (rule) => {
  return ['/\\.sass$/', '/\\.scss$/'].indexOf(rule.test.toString()) !== -1
}
const sassResourcesLoader = {
  loader: 'sass-resources-loader',
  options: {
    resources: [
      resolve(__dirname, 'sass/variables.sass')
    ]
  }
}

module.exports = {
  css: ['~/sass/main.scss'],
  build: {
    extend (config) {
      config.module.rules.forEach((rule) => {
        if (isVueRule(rule)) {
          rule.query.loaders.sass.push(sassResourcesLoader)
          rule.query.loaders.scss.push(sassResourcesLoader)
        }
        if (isSASSRule(rule)) {
          rule.use.push(sassResourcesLoader)
        }
      })
    }
  }
}
```

# 参考资料   

【1】[Load a global settings.scss file in every vue component?](https://github.com/vuejs/vue-loader/issues/328)   
【2】[Enable pre-processors of global scss variables](https://github.com/nuxt/nuxt.js/issues/1092)   
【3】[Using Pre-Processors --- Loading a global settings file](https://vue-loader.vuejs.org/en/configurations/pre-processors.html#loading-a-global-settings-file)   
