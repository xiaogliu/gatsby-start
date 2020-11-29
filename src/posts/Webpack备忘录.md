---
title: Webpack 备忘录
date: 2018-12-12 21:50:32
tags: [Webpack]
categories: Webpack
e_title: webpack-memo
---

Webpack 属于在项目中配置一次就很少改动的那种工具，但这样就导致新项目再配置 Webpack 时会有些生疏，所以将 Webpack 核心概念及常用配置记录如下。

# 一 核心概念

Webpack 4.x 之前的核心概念有四个：entry，output，loaders，plugins，4.x 之后增加了 mode。含义如下：

- Entry：指定 webpack 从哪个 file 开始构建他的依赖关系图，可以有一个和多个，推荐对象表示法；
- Output：webpack 构建完成后的 bundles 输出位置及 name，其中 name 一般根据 entry 的 file name 动态生成；
- Loaders：webpack 可以将非 js 文件（css、图像等）通过 loaders 处理成可供我们的应用使用的 modules。也因此在配置文件中，loaders 写在`module`对象下面，因为 loaders 处理后返回的是有效 modules。
- Plugins：如果需要额外的功能，比如压缩代码、提取 css、分析打包性能，可使用插件完成；
  > Loaders 将特定文件转换为有效 module，而 plugin 扩展性更强
- Mode：接受`development`、`production`、`none`三个值，一般指定为前两个值的一种，webpack 内部针对不同环境做优化。

# 二 配置

下面介绍的配置都是`module.exports`的直接属性，比如：

```js
module.exports = {
  entry: {},
  output: {},
  // loaders 配置位置有些特殊，不知直接写 loaders 对象，而是将它鞋子啊 module 对象下面
  // 因为 loaders 处理完后返回的是有效 modules
  // 不是 复数！！！
  module: {},
  // plugin 是数组
  // 是 复数！！！
  plugins: []
};
```

同时，文件头引入相应依赖的过程省略了，实际开发中请自行引入。

## 2.1 Entry

Entry 指定哪些文件作为 webpack 打包入口，可以有一个或者多个：

```js
entry: {
  index: './src/js/view/index.js',
  people: './src/js/view/people.js',
  login: './src/js/view/login.js',
}
```

> 上例实际是多页面入口，但页面一般只有一个入口文件。实际，目前（2019-07-09）但单页应用都会官方集成 webpack，开箱即用，除非有深度定制要求。反倒是普通多页应用（当然小项目可能只有一个页面，比如简历）在使用 webpack 时必须进行从 0 到 1 的手动配置。

## 2.2 Output

Output 指明 Webpack 处理完成后的 bundles 输入位置及文件 name：

```js
output: {
  // 输入目录，这里使用了 node 的 path 模块
  path: path.resolve(__dirname, 'dist'),
  // [] 里面的内容表示变量
  filename: 'js/[name].[contenthash:8].js',
  // 静态资源在 html 引用的公共目录
  publicPath: '/',
}
```

Output 配置相对复杂：

### 2.2.1 output.path

即输出文件目录，推荐使用绝对路径，其中`__dirname`在 Node 的 path 模块中表示当前目录（即 webpack.config.js 的目录）的绝对路径，`resolve`方法可以拼接两个目录；

> 后一个目录可以加`/`也可以不加，此处无差别

### 2.2.2 output.filename

表示输出文件名称，这里注意，`[]`中是变量，其中`name`由在 entry 中定义的文件名决定，并且，**有多少个输入文件，对应有多少个输出文件**，后面的`contenthash:8`表示 chunk 的 hash 值，后文介绍；

> 实际输出文件一般多于输入文件，因为提取公共代码、设置 sourcemap 都会单独生成输出文件

### 2.2.3 output.publickPath

这个配置想最为复杂，它的作用是配合 loaders 或 plugins 中设置的资源路径，指定静态文件（css、js、img）插入 html 中的引用路径，简单讲，就是 **对输出的静态资源进行目录管理**。这里直接使用 [详解 Webpack2 的那些路径](http://www.qinshenxue.com/article/20170315092242.html) 的描述，只稍作说明。

静态资源最终引用路径计算公式：

> html 静态资源路径 = output.publicPath + loaders/plugins 中设置的资源路径

比如：

```js
// publicPath 设置
output.publicPath = '/static/'

// JS output.filename 配置
{
  filename: 'js/[name].js'
}
// JS 最终访问路径为
output.publicPath + 'js/[name].js' = '/static/js/[name].js'

// 图片资源, file-loader，这里省略了 file-loader 其他配置，只列出指定输出路径及文件名的配置
{
  name: 'img/[name].[ext]'
}
// 图片最终的访问路径为
output.publicPath + 'img/[name].[ext]' = '/static/img/[name].[ext]'

// CSS，ExtractTextPlugin 为提取 CSS 的插件
new ExtractTextPlugin("css/style.css")
// CSS 最终访问路径为
output.publicPath + 'css/style.css' = '/static/css/style.css'
```

我们上述指定`publicPath`为绝对路径，实际上，也支持相对路径，相对于`index.html`，用的比较少。

`publicPath`默认为空字符串，但为了使输出目录更加条理，推荐使用`publicPath`对静态资源进行目录管理。

## 2.3 Loaders

Loaders 的配置写在`module`对象中，如前所述，因为 loaders 最终返回的是有效 modules，故使用了`module`命名，注意是单数。这节介绍 loaders 配置及常用 loaders 两部分内容。

### 2.3.1 loaders 配置

loaders 规则写在 `module.rules` 里面（不知道为什么不直接写在 `module` 中），其中 `rules` 是个数组，可接受一个或多个 loader 配置。两点需要注意：

1）如果某类型需要多个 loader 进行处理，在 `use` 中按 **从右往左** 的顺序流式处理；
2）每个 loader 可以进行额外配置；
3）像是 `postcss-loader`, `babel-loader` 等一般需要额外的配置，**推荐直接在 webpack 配置文件中进行配置，而非在根目录下新建文件**（项目目录看上去更整洁）。

```js
module: {
  // 含有 rules，这一个属性
  // rules 是数组，每个元素对应一个 loader 配置
  // loader 配置本身是个对象
  rules: [
    {
      // 正则匹配文件，最终匹配的是一个路径，具体间解析 zepto 源文件时的设置
      test: /\.scss$/,
      // 使用的 loader，可以字符串（单个 loader）、数组（多个 loader）
      // 如果是数组，从右往左开始解析
      use: ['style-loader', 'css-loader', 'scss-loader'],
    },
    {
      test: /\.(png|jpg|jpeg|svg|gif)$/,
      // 每个 loader 可进行额外配置
      use: [
        {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]',
          },
        },
      ],
    },
  ],
},
```

## 2.4 Plugins

同 loaders 一样，分配置和常用 plugins 两部分

### 2.4.1 plugins 配置

Plugins 使用相对简单，配置项写在`plugins`（复数）数组中，元素为插件的实例（通过`new`调用），生成实例的时候可接收参数，具体看相应插件文档。见下面代码及注释：

```js
plugins: [
  // 带有参数
  new CleanWebpackPlugin(['dist']),
  new MiniCssExtractPlugin({
    filename: 'css/[name].[contenthash:8].css',
    chunkFileName: '[id].[contenthash:8].css',
  }),
  // 直接调用
  new UglifyJsPlugin(),
],
```

## 2.5 Mode

接受`development`、`production`、`none`三个值，一般取前两个值之一，指定构建环境，webpack 本身会做相应优化（配合[optimization](https://webpack.js.org/configuration/optimization/)使用，下文会有更多介绍），同时省去在命令行中指定构建环境的过程。

```js
// 相当于 webpack --mode=production
mode: 'production',
```

## 2.6 其他

上述配置对应 Webpack 核心概念，除此之外，还有下面配置项很常用。

### 2.6.1 optimization

这个选项是在 Webpack 4.x 中引入的，最常用的配置是代替[CommonsChunkPlugin](https://webpack.js.org/plugins/commons-chunk-plugin/)提取公共代码。下面直介绍提取公共 JS 代码的配置：

```js
optimization: {
  splitChunks: {
    // 只对入口文件处理
    chunks: 'initial',
    cacheGroups: {
      vendor: {
        //  split  `src/js/vendor` 目录下共用的代码到`vendor.js`
        // 这里指的是第三方库，很少改动，故单独做持久化缓存
        // 注意，目前 splitChunks 在 split css 时有 bug？现在只 split js 代码
        // 不推荐直接匹配 node_modules 文件夹，如上，因为涉及 css，打包后 css 错误
        test: /src\/js\/vendor\//,
        name: 'vendor',
        // 只要第三方库，只要 > 0B, 就 split 出来
        minSize: 0,
        // 只要被引用一次，也要分离出来
        minChunks: 1,
        // priority: 10,
        // enforce: true,
      },
      common: {
        //  split  `src/js/common` 目录下共用的代码到`common.js`
        // 这里是自定义的公共 js 代码，改的频率比第三方库要高，但比具体页面的 js 文件低
        // 故单独 split 出来做持久化缓存
        // 不一定共用才 split ，很少改动的也 split 出来，如上的 vender.js
        // 但此处至少两个共用 minChunks 才抽出
        test: /src\/js\/common\//,
        name: 'common',
        minChunks: 2,
        minSize: 0,
        // priority: 9,
        // enforce: true,
      },
    },
  },
},
```

### 2.6.2 devtool

`devtool`最常用功能是配置 sourcemap，生产和开发环境一般使用不同的 sourcemap，配置如下：

```js
// 生产环境
devtool: 'source-map',

// 开发环境
devtool: 'cheap-module-eval-source-map',
```

关于各配置项的含义可参考[Devtool](https://webpack.js.org/configuration/devtool/)和这片文章[Webpack 的 devtool 和 source maps](https://www.jianshu.com/p/ad96e712564c)。

> sourcemap 是构建后的代码 map 到源代码的映射表，便于定位 bug，具体的映射关系存储在构建后的`.map`文件中。

**NOTE**: 这里我们在生产环境使用的是 `source-map` 选项而不是其他，是因为目前 webpack 在开启 uglifyjs-webpack-plugin 优化代码后，其他模式下的 [sourcemap 选项无效](https://github.com/webpack/webpack/issues/2704)，官网对此也有[说明](https://webpack.js.org/plugins/uglifyjs-webpack-plugin/#sourcemap)。虽然使用`source-map`选项生成的映射表比较大，但只有开启开发者工具的时候`.map`文件才会加载，这意味着 **映射表文件的大小不影响正常用户的访问体验，但是否压缩 js 文件对正常用户有直接影响**，故，现阶段，生产环境 devtool 使用 `source-map` 选项。

### 2.6.3 devServer

开发环境为了更好的开发体验，可以开启热更新等功能，在`devServer`中配置：

```js
devServer: {
  open: true,
  hot: true,
},
```

需要在插件中进行下面配置：

```js
plugins: [
  new webpack.HotModuleReplacementPlugin(),
],
```

NOTE：如果传统多页面项目，在入口文件后面添加下面代码，配合热更新：

```js
// 配合 webpack 配置实现热更新
if (module.hot) {
  module.hot.accept();
}
```

多页面目前只有在 JS 或者 CSS 文件改变的时候实现了热更新，如果是模版（html）文件改变，没有实现热更新（可以实现自动刷新页面，但感觉很鸡肋，如果改动了模版文件，手动刷新）。

> devServer 还可以设置反向代理，后续填坑。

### 2.6.4 resolve

`resolve` 选项可以指定如何解析 modules，更多是通过设置 alias 告诉 webpack 去哪找文件解析。比如，如果在项目中通过文件的形式引入的 jq，那在使用 `ProvidePlugin` 对 jq 进行解析的时候，就需要通过设置别名的形式告诉 webpack 去哪找 jq 源文件。

```js
resolve: {
  alias: {
    // 后面加 $ 符号表示精确匹配
    jquery$: path.resolve(__dirname, 'path/jquery.min.js');
  }
}


// 解析插件
new webpack.ProvidePlugin({
  // 加载 jquery
  $: 'jquery',
}),
```

# 三 常见需求详细配置

下面记录针对具体需求的完整代码描述。

## 3.1 引入第三方库

比如，jq，zepto 等，如果通过 CDN 可以在项目中直接使用 `$` 符号，但如果是通过 npm 安装到本地，甚至直接将第三方库源文件写在项目中，那是无法直接使用 `$` 符号这种调用方式的，需要使用上文介绍的 `ProvidePlugin` 插件。当然，还有细节需要注意，见下面详细代码。

### 3.1.1 使用 npm 引入

相对于直接引入，使用 npm 可以省去我们手动指定 module 路径的麻烦，已 zepto 为例：

> 使用 zepto 时，直接使用 ProvidePlugin 会报错，具体参考这片文章[如何在 webpack 中引入未模块化的库，如 Zepto](https://sebastianblade.com/how-to-import-unmodular-library-like-zepto/)

```js
// 处理 zepto 模块化问题，需要安装 exports-loader 和 script-loader
{
  test: require.resolve('zepto'),
  use: ['exports-loader?window.Zepto', 'script-loader'],
},

// 给 zepto 设置别名，可以任何名称
plugins: [
  new webpack.ProvidePlugin({
    $: 'zepto',
  }),
],
```

### 3.1.2 直接在项目中引入源文件

同 npm 不同之处在于我们需要手动指定 zepto 的路径，如下

```js
// 设置别名
resolve: {
  alias: {
    zepto$: path.resolve(__dirname, 'src/js/vendor/zepto.min.js'),
  },
},

// 处理 zepto 模块化问题
{
  // test 路径也要跟着改变，不知道为什么不能用上面指定的别名。。
  test: path.resolve(__dirname, 'src/js/vendor/zepto.min.js'),
  use: ['exports-loader?window.Zepto', 'script-loader'],
},

// 给 zepto 设置别名，可以任何名称
plugins: [
  new webpack.ProvidePlugin({
    $: 'zepto',
  }),
],
```

## 3.2 提取 css

为了能将 css 从 js 中提取出来，需要在 `module` 中将 style-loader 替换为 MiniCssExtractPlugin.loader，见下面代码：

```js
module: {
  rules: [
    {
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader'],
    },
    {
      test: /\.scss$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
    },
  ],
},

plugins: [
  new MiniCssExtractPlugin({
    filename: 'css/[name].[contenthash:8].css',
    // 这个干嘛用？
    chunkFileName: '[id].[contenthash:8].css',
  }),
],
```

## 3.3 缓存控制

主要一下几个方面：

- 提取 css，添加 `contenthash`（使用 `mini-css-extract-plugin`）;
- 提取公共代码（工具函数等，更改频率相比业务代码要小），添加 `contenthash`，使用 webpack 自带 splitChunks 提取;
- 提取第三方库代码（比如 jquery，更改频率相比公共代码还要小），添加 `contenthash`，使用 webpack 自带 splitChunks 提取;
- 图片可以直接打 `hash`（图片文件添加 hash 并不一样，也不会随每次构建改变，还不知原理，反正可以工作，待填坑）。

# 四 常用 loaders 及 plugins

这里按照功能进行划分。

## 4.1 处理 html

1）loaders

- html-loader：解析 html 文件；

2）plugins

- html-webpack-plugin：将构建后的静态文件动态插入 html 中；

## 4.2 处理 js（ts）

1）loaders

- babel-loader：es6+语法转换，目前已支持 ts 转换；

2）plugins

- uglifyjs-webpack-plugin：**不仅仅是压缩代码，还进行了 tree shaking 工作**；

## 4.3 处理 css（sass）

1）loaders

- sass-loader：解析 scss/sass 文件；
- css-loader：解析 css 文件；
- style-loader：将解析后的 css 嵌入 js；
- postcss-loader：完成 css 自动化处理，比如添加前缀、压缩 css、自动生成雪碧图等
  > postcss 本身支持插件扩展，常用的有 autoprefixer、cssnano、postcss-sprites，更多参考[官网介绍](https://github.com/postcss/postcss)
  > 要在 css-loader 之前处理 css：`use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']`

- MiniCssExtractPlugin.loader：这个是 `mini-css-extract-plugin` 提供的 loader，可以替代 `style-loader`

2）plugins

- mini-css-extract-plugin：提取 css 文件，减小增量更新成本（**需要在`module`代理 style-loader 处理 css**）；
  > 这个插件将 css 从 js 中分离出来，是 webpack 4.x 新引入，代替 extract-text-webpack-plugin。

- optimize-css-assets-webpack-plugin：将提取出的 css 做进一步优化；

## 4.4 处理 图片

1）loaders

- file-loader：解析图片文件；
- url-loader：具有 file-loader 的全部功能，同时可以提取小图片为 base64（如果开启 HTTP2 这样增大 静态资源体积反而不好？）；

## 4.5 构建相关 plugins

涉及到构建的主要是 plugins，分为内置和第三方

1）webpack 内置

- webpack.HotModuleReplacementPlugin：热更新插件，webpack 内置；
- ProvidePlugin：webpack 内置，提取第三方库的 api，比如通过 `$` 符号调用 jq
  > 如果不是通过 npm 安装，而是直接在项目中引入，需要配合`resolve`的别名使用，不然找不到

2）第三方

- webpack-merge：实际项目中，一般将 webpack 配置文件拆分为 base、dev、pro，这个插件用户合并配置文件；
- clean-webpack-plugin：清除指定文件夹，一般是构建的目录（大型项目慎用，更新需要时间）；
- webpack-bundle-analyzer：打包后文件图形化展示工具，一目了然各文件体积；

## 4.6 第三方库相关

事实上，目前（2019-07-09）第三方库（react，vue，angular）都已经集成好了 webpack，如果不是特别需要，可以不进行单独配置。

1）Vue 相关

- vue-loader：解析 vue 文件；
- vue-style-loader：解析 vue 中的样式文件。

2）jquery 和 zepto ?

尝试用原生 js 写，兼容到 ie10 +

## 4.7 一键安装 loaders 和 plugins

```bash
npm i -D html-webpack-plugin @babel/core @babel/preset-env @babel/preset-typescript typescript babel-loader uglifyjs-webpack-plugin node-sass sass-loader css-loader mini-css-extract-plugin postcss-loader postcss-cssnext cssnano clean-webpack-plugin webpack webpack-bundle-analyzer webpack-cli webpack-dev-server webpack-merge
```

说明：

- `@babel/core @babel/preset-env @babel/preset-typescript typescript` babel 依赖，包含了处理 typescript 的 package
- `node-sass` 处理 `sass` 的依赖
- `postcss-cssnext cssnano` 这两个是 postcss 的插件，其中 `postcss-cssnext` 可用于写 css next 版本的语法，同时补全浏览器前缀；而 `cssnano` 可以用来减少 css 文件体积，不止是压缩，可其参考[官方文档示例](https://cssnano.co/)

# 五 一个完整的配置文件

## 5.1 完整文件

示例配置文件只添加了处理 html、js、css 的基础 loaders 和 plugins 以及配置开发环境，至于像 `DllPlugin` 这种高阶插件的使用并没有列入其中。

```js
const webpack = require("webpack"); //to access built-in plugins
const HtmlWebpackPlugin = require("html-webpack-plugin"); //installed via npm
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    // entry files, can multiple files
    index: "./src/scripts/index.ts"
  },
  output: {
    // output directory
    path: path.resolve(__dirname, "dist"),
    // variable in []
    filename: "js/[name].[hash:8].js",
    // html static file directory
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: {
                  node: true
                }
              }
            ],
            "@babel/typescript"
          ]
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [
                require('postcss-cssnext')(),
                require('cssnano')()
              ]
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [
                require('postcss-cssnext')(),
                require('cssnano')()
              ]
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.(png|jpg|jpeg|svg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "img/[name].[ext]"
            }
          }
        ]
      }
    ]
  },
  // recognize typescript
  resolve: {
    extensions: [".ts", ".js"]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:8].css",
      // 这个干嘛用？
      chunkFileName: "[id].[contenthash:8].css"
    }),
    new HtmlWebpackPlugin({ template: "./src/pages/index.html" }),
    // 直接调用
    new webpack.HotModuleReplacementPlugin()
  ],
  optimization: {
    minimizer: [new UglifyJsPlugin()]
  },
  mode: "development",
  // 生产环境
  // devtool: "source-map",
  // 开发环境
  devtool: "cheap-module-eval-source-map",
  // 使用webpack-dev-server，提高开发效率
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
    hot: true,
    open: true
  }
};
```

## 5.2 github 示例代码

<!-- TODO 提供多个参考配置文件（1.拆分；2.带有 zepto；3.不带 zepto 等） -->

在 github 上提供了一个示例代码

# 参考资料

[详解 Webpack2 的那些路径](http://www.qinshenxue.com/article/20170315092242.html)
