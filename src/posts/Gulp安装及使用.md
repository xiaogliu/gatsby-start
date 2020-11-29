---
title: Gulp安装及使用
date: 2017-05-10 21:33:34
tags: [Gulp,Babel,工程化]
categories: Tools
e_title: install-and-use-gulp
---

# Gulp用途

Gulp是自动任务执行工具，主要用途是把开发者从重复劳动中解放出来，Gulp可以做但不限于以下工作：

- 转换、压缩、合并js或者css文件（包括Less/Sass文件转CSS文件，ECMA-262高版本转低版本）
- 设置某次改动后自动更新版本号、提交commit到git等
- 在编辑器中点击保存按钮自动刷新浏览器页面
- 运行代码分析
- 快速运行单元测试

其中压缩、转换、合并js或者css文件是最为常用功能。

> Gulp借鉴了Unix操作系统的管道（pipe）思想，很多人认为，在操作上，它要比Grunt简单

# Gulp 安装

如果之前全局安装过Gulp，先卸载全局安装的Gulp`npm rm --global gulp`，然后开始下面的步骤。

> Gulp维护团队已不再建议全局安装`gulp`，可参参考这个issue[gulp vs gulp-cli reasoning unclear in getting started guide](https://github.com/gulpjs/gulp/issues/1795)，但在[gulp中文网](http://www.gulpjs.com.cn/docs/getting-started/) 还未更新，依旧建议全局安装`gulp`，安装时请注意。

**步骤一**，全局安装Gulp命令行工具   

任意目录执行下面命令：

```bash
$ npm install --global gulp-cli
```

> 全局安装不是必须的，如果只是在项目中引入Gulp而不希望全局安装Gulp命令行工具，可以通过**npm script**实现对Gulp的调用。

**步骤二**，项目本地安装Gulp   

项目根目录执行下面命令：

```bash
$ npm install --save-dev gulp
```

**步骤三**，常见`gulpfile.js`文件

在项目根目录新建`gulpfile.js`文件，并添加下面内容：

```js
var gulp = require('gulp');

gulp.task('default', function() {
  // place code for your default task here
});
```

> `default`是输入`gulp`以后默认执行的任务，如果要执行过个任务，可以用这个命令`gulp <task> <othertask>`

**步骤四**，测试是否成功

输入`gulp`命令，如果输出以下打印内容，说明Gulp安装成功：

```bash
$ gulp
[16:22:02] Using gulpfile x:\study\myProject\calculator_for_house_loan\jquery\gulpfile.js
[16:22:02] Starting 'default'...
[16:22:02] Finished 'default' after 63 μs
```

# Gulp配置

Gulp强大之处在于可以引入插件实现一系列功能。下面是引入压缩js文件插件的例子：

```js
var gulp = require('gulp');
var uglify = require('gulp-uglify');

gulp.task('minify', function () {
  gulp.src('js/app.js')
  .pipe(uglify())
  .pipe(gulp.dest('build'))
});
```

**注意：** 如果使用ES6语法，`gulp-uglify`会报错`GulpUglifyError: unable to minify JavaScript`，需要引入Babel对ES6语法进行转换，更改后代码如下（同时引入错误标记插件`gulp-util`）：

```js
// 引入gulp
var gulp = require('gulp');

// 引入依赖模块
var babel = require("gulp-babel");
var uglify = require('gulp-uglify');
var gutil = require('gulp-util'); // 错误标记插件

gulp.task('default', function () {
  return gulp.src('js/main_js.js') // 加return，finish后马上结束，但显示总时间长
  .pipe(babel())
  .pipe(uglify())
  .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
  .pipe(gulp.dest('build'))
});
```

> `gulp.task`, `gulp.src`, `gulp.dest`等属于Gulp的API，多更信息可参看[gulp API docs](https://github.com/gulpjs/gulp/blob/master/docs/API.md)   

# 使用案例

- 下面是实际使用的一个简单案例   

```js
const gulp = require('gulp');
const minify = require('gulp-minify-css');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');

gulp.task('sass', function () {
  gulp.src('./css/main.scss')
    .pipe(sass()) // 转化scss文件
    .pipe(minify()) // 转化后压缩
    .pipe(gulp.dest('./dist/css/'))
  });

gulp.task('minjs', function () {
  gulp.src('./js/main.js')
    .pipe(uglify()) // 压缩js文件
    .pipe(gulp.dest('./dist/js/'))
  });

// 设置watch，自动转化、压缩
gulp.task('watch', function () {
  gulp.watch('./css/main.scss', ['sass']);
  gulp.watch('./js/main.js', ['minjs']);
});
```

- 下面是实际使用的一个复杂案例   

```js
// 引入 gulp
var gulp = require('gulp');
// 引入组件
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var gutil = require("gulp-util");
var glob = require('glob');
var md5 = require('md5-file');
var replace = require('gulp-replace-task');
var source = require('vinyl-source-stream');  
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var nodemon = require('gulp-nodemon');
var sass = require('gulp-sass');

var oPath = {
  'sass': 'common/css/*.css',
  'directives': 'common/engine/directives/**/*.js',
  'services': 'common/engine/services/**/*.js',
  'templates': '@(supplyCloud|common|integrated|platformService)/views/**/*.html',
  'controllers': '@(supplyCloud|common|integrated|platformService)/controllers/**/*.js',
  'bundles': 'public/@(js|css)/!(version).*',
  'core': [
  'common/engine/setting.js',
  'common/engine/tools.js',
  'common/engine/common.js',
  'common/js/zhl.js',
  'common/engine/app.js',
  'common/engine/route_cloud.js',
  'common/engine/directives.js',
  'common/engine/filters.js',
  'common/engine/factory.js'
  ],
  'vendor': [
  "common/vendors/lodash.min.js",
  "common/vendors/angular/angular.min.js",
  "common/vendors/angular/angular-translate.min.js",
  "common/vendors/angular/angular-translate-loader-static-files.min.js",
  "common/vendors/angular/angular-sanitize.min.js",
  "common/vendors/angular/angular-resource.min.js",
  "common/vendors/bootstrap/js/bootstrap.min.js",
  "common/vendors/angular/angular-route.min.js",
  "common/vendors/angular/angular-cookies.min.js",
  "common/vendors/file-upload/dist/angular-file-upload.min.js",
  "common/vendors/md5.min.js",
  "common/vendors/big.min.js",
  "common/vendors/chart.min.js",
  "common/vendors/jquery/jquery-ui.min.js",
  "common/vendors/jquery/jquery.mousewheel.min.js",
  "common/vendors/datetimepicker/js/bootstrap-datetimepicker.min.js",
  "common/vendors/datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js",
  "common/vendors/web-im/strophe-1.2.8.min.js",
  "common/vendors/web-im/webim.config.js",
  "common/vendors/web-im/websdk-1.1.3.js"
  ],
  'vendorCss': [
  'common/vendors/bootstrap/css/bootstrap.min.css',
  'common/vendors/Font-Awesome/css/font-awesome.min.css',
  'common/vendors/datetimepicker/css/bootstrap-datetimepicker.min.css'
  ]
};

var NODE_ENV = 'production';

var createErrorHandler = function (name) {
  return function (err) {
    delete err.cause.stack;
    console.error('Error from ' + name + ' in compress task', err.cause);
  };
};

var start = function (env) {
  NODE_ENV = env;
  nodemon({
    script: 'server.js',
    ext: 'js html json',
    watch: [
    'server.js',
    'env.json',
    'app',
    'config',
    'resources'
    ],
    delay: '2000',
    ignor: ['gulpfile.js'],
    env: {'NODE_ENV': env}
  });
};

gulp.task('development', function () {
  start('development');
});
gulp.task('production', function () {
  start('production');
});


gulp.task('compress', function (cb) {
  pump([
    gulp.src('lib/*.js'),
    uglify(),
    gulp.dest('dist')
    ],
    cb
    );
});

gulp.task('browserify', function () {
  browserify()
  .require('./common/engine/util.js', {expose: 'util'})
  .require('./common/vendors/moment.js', {expose: 'moment'})
  .exclude('version')
  .bundle()
  .pipe(source('common.bundle.js'))
  .pipe(buffer())
  .pipe(uglify())
  .on('error', createErrorHandler('uglify'))
  .pipe(gulp.dest('public/js'));
});

// 检查脚本
gulp.task('lint', function () {
  gulp.src([oPath.directives, oPath.services])
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

// 合并，压缩指令文件
gulp.task('min-directives', function () {
  gulp.src(oPath.directives)
  .pipe(concat('directive.min.js'))
  .pipe(uglify())
  .on('error', createErrorHandler('uglify'))
  .pipe(gulp.dest('public/js'));
});

// 合并，压缩服务文件
gulp.task('min-services', function () {
  gulp.src(oPath.services)
  .pipe(concat('services.min.js'))
  .pipe(uglify())
  .on('error', createErrorHandler('uglify'))
  .pipe(gulp.dest('public/js'));
});

// 合并，压缩项目核心文件
gulp.task('min-core', function () {
  gulp.src(oPath.core)
  .pipe(concat('core.min.js'))
  .pipe(uglify())
  .on('error', createErrorHandler('uglify'))
  .pipe(gulp.dest('public/js'));
});

// 合并，压缩第三方库
gulp.task('min-vendor', function () {
  gulp.src(oPath.vendor)
  .pipe(concat('vendor.min.js'))
  .pipe(uglify())
  .on('error', createErrorHandler('uglify'))
  .pipe(gulp.dest('public/js'));
});

//合并压缩css
gulp.task("sass", function () {
  gulp.src(oPath.sass)
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(concat('zhl.css'))
  .pipe(gulp.dest("public/css"));
  gulp.src(oPath.vendorCss)
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(concat('vendor.min.css'))
  .pipe(gulp.dest('public/css'));
});

// 为所有controller和template增加版本hash
gulp.task("version", function () {

  var objHash = {},
  arrHash = [];

  objHash.build = (new Date()).toLocaleString();

    //templates
    glob.sync(oPath.templates).forEach(function (file) {
      objHash[file] = md5.sync(file).slice(0,10);
    });

    //controlers
    glob.sync(oPath.controllers).forEach(function (file) {
      objHash[file] = md5.sync(file).slice(0,10);
    });

    //min and bundle files
    glob.sync(oPath.bundles).forEach(function (file) {
      objHash[file] = md5.sync(file).slice(0,10);
    });

    Object.keys(objHash).forEach(function (key) {
      arrHash.push('"' + key + '"' + ' : ' + '"' + objHash[key] + '"');
    });

    gulp.src('./resources/config/version.js.tpl')
    .pipe(replace({
      patterns: [{
        match: 'hash',
        replacement: arrHash.join(' , ')
      }
      ]}))
    .pipe(rename('version.js'))
    .pipe(gulp.dest('./config'))

    browserify()
    .require('./config/version.js', {expose: 'version'})
    .bundle()
    .pipe(source('version.js'))
    .pipe(buffer())
    .pipe(uglify())
    .on('error', createErrorHandler('uglify'))
    .pipe(gulp.dest('./public/js'));

  });

//开发时自动打包任务
gulp.task('watch', ['production', 'min', 'browserify', 'version'], function () {
  gulp.watch([oPath.sass, oPath.vendorCss], ['sass']);
  gulp.watch(oPath.directives, ['min-directives']);
  gulp.watch(oPath.services, ['min-services']);
  gulp.watch(oPath.core, ['min-core']);
  gulp.watch('common/engine/util.js', ['browserify']);
  gulp.watch([oPath.templates, oPath.controllers, oPath.bundles], ['version']);
});

//合并压缩
gulp.task('min', ['min-directives', 'min-services', 'min-core', 'min-vendor', 'sass']);

//发布前打包任务
gulp.task('build', ['min', 'browserify', 'version']);

//默认任务
gulp.task('default', ['production', 'min', 'browserify', 'version', 'watch']);
```

# 参考资料
【1】 [gulp documentation](https://github.com/gulpjs/gulp/blob/master/docs/README.md)   
【2】 [What is gulp.js and why use it?](http://brandonclapp.com/what-is-gulp-js-and-why-use-it/)    
【3】 [Gulp：任务自动管理工具](http://javascript.ruanyifeng.com/tool/gulp.html#comment-3299560540)
