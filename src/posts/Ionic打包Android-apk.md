---
title: Ionic打包Android apk
date: 2017-05-13 23:42:41
tags: [Hybrid App,Ionic,npm,JavaScript]
categories: Hybrid App
e_title: package-ionic-android-app
---

开始前请确保已安装node环境,Ionic的安装和后续的许多前端工具的安装都依赖于node的包管理器npm。

# 一 安装Android打包环境   

## 1.1 安装JDK并配置Java环境   

jdk官网[下载地址](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)   

安装完成以后配置环境变量：   

**JAVA_HOME**：JDK的安装路径，这个环境变量本身不存在，需要创建，创建完则可以利用`%JAVA_HOME%`作为统一引用路径，其值为：jdk在你电脑上的安装路径。   

**PATH**：PATH属性已存在，可直接编辑。作用是用于配置路径，简化命令的输入，其值为：`%JAVA_HOME%\bin`。   

**CLASSPATH**：用于编译时JAVA类的路径，其值为：`%JAVA_HOME%\lib\tools.jar`。   

配置完成后，在命令行运行以下命令：`java -version`，`javac` 如果返回使用说明信息，则设置成功。   

> 扩展阅读：安装开发类软件时经常会设置系统环境变量，如果想明白为什么要设置环境变量，可参考这篇[博文](http://www.cnblogs.com/zoupeiyang/p/4034517.html#2)。   

## 1.2 安装Android Studio   

Android Studio官网[下载地址](https://developer.android.com/studio/index.html)   

下载完成并安装然后向系统Path环境变量中添加两个值。分别是Android SDK中tools目录的路径和platform-tools的路径。例如：`X:\software\Android\sdk\tools`;`X:\software\Android\sdk\platform-tools`;   

配置完成后，在命令行运行`android`并且回车，如果返回使用说明信息，则设置成功。   

> 有文章称这里可以只下载Android SDK，不需要一并下载Android Studio，未验证。   

## 1.3 安装Gradle

Gradle官网[下载地址](https://services.gradle.org/distributions/)   

下载后无需安装，解压即可使用，但需要设置环境变量：   

**GRADLE_HOME**：Gradle解压目录，利用`GRADLE_HOME`作为统一引用路径，其值为：Gradle在你电脑上解压路径，比如`X:\software\Android\gradle-3.5`   

**PATH**：其值为`%GRADLE_HOME%\bin`   

配置完成后，在命令行运行`gradle -v`并且回车，如果返回版本信息，则设置成功。   

> Gradle是Java构建工具，更多Java构建工具可参考这篇博文[Java构建工具：Ant vs Maven vs Gradle](http://blog.csdn.net/napolunyishi/article/details/39345995)

# 二 Ionic打包流程

首先确保已有Ionic项目，如果还没有，可以下载Ionic官网示例进行接下来的打包流程。下载方法是在命令行中输入一下命令：   

```bazaar
ionic start myApp tabs
```

下载完成后进入`myApp`目录进行接下来的操作。   

## 2.1 平台部署

Ionic默认没有添加任何平台，需要我们手动添加，添加命令为`ionic platform add <platform-name>`   

比如添加Android平台：   

```bazaar
ionic platform add android
```

执行完毕后，在开发目录下的platform目录会多一个android目录。   

**这里有一点需要注意**：因为项目中是用Gradle作为构建工具，但在接下来的打包过程中却可能因为下载Gradle时报错，错误信息一般包含下面提示：   

```bazaar
...
java.net.SocketException:Connection reset
...
```

此时简单解决方案有两种：   

1. 在刚生成的这个目录android目录下新建`gradle`文件夹，并在`gradle`文件夹中放入`gradle-x.x-all.zip`文件（[下载地址](https://services.gradle.org/distributions/)），同时添加环境变量：`CORDOVA_ANDROID_GRADLE_DISTRIBUTION_URL`，值为`../gradle-x.x-all.zip`   

2. 在`platforms\android\cordova\lib\builders`目录下找到`GradleBuilder.js`，   
将下面的内容：
  ```bazaar
  var distributionUrl = process.env['CORDOVA_ANDROID_GRADLE_DISTRIBUTION_URL'] || 'https\\://services.gradle.org/distributions/gradle-3.3-all.zip'
  ```
  修改为：
  ```bazaar
  var distributionUrl = process.env['CORDOVA_ANDROID_GRADLE_DISTRIBUTION_URL'] || 'https://services.gradle.org/distributions/gradle-3.3-all.zip'
  ```

> **方法2未测试**，更多内容可参考[ionic build android error when download gradle](http://stackoverflow.com/questions/29874564/ionic-build-android-error-when-download-gradle)   

## 2.2 打包  

打包命令如下：   

```bazaar
ionic build android -release
```

打包完成后会提示apk输出目录，此时的apk文件没有签名，无法使用。

> 第一次打包速度很慢，大概需要1小时左右。

## 2.3 设置签名   

- 创建key，需要用到`keytool.exe`（位于`jdkx.x.x\jre\bin`目录下）；   
- 使用产生的key对apk设置签名用到的是`jarsigner.exe`(位于`jdkx.x.x\bin`目录下)   

需要把上述两个软件所在的目录添加到环境变量PATH中，接下来   

**创建key**

```bazaar
keytool -genkey -alias demo.keystore -keyalg RSA -validity 40000 -keystore demo.keystore
```

说明：
- genkey：产生密钥
- alias demo.keystore：秘钥别名 demo.keystore
- keyalg RSA：使用RSA算法对签名加密
- validity 40000：有效期限40000天
- keystore：秘钥库别名 demo.keystore

**给apk设置签名**

```bazaar
jarsigner -verbose -keystore demo.keystore -signedjar demo_signed.apk demo.apk demo.keystore
```

说明：
- verbose 输出签名的详细信息
- keystore demo.keystore 密钥库名称及放置路径
- signedjar demor_signed.apk demo.apk demo.keystore 三个参数的含义分别为：签名后产生的文件demo_signed，要签名的文件demo.apk和密钥库demo.keystore

> 可以在构建过程中**自动添加签名**，方法如下：在platforms\android目录新建名为release-signing.properties的文件，文件内容如下：   
  ```bazaar
  storeFile=path/to/keystore
  keyAlias=your key aliasstore
  Password=your store passwordkey
  Password=your key password
  ```
  使用`ionic build --release android`构建后，文件即是已签名的安装包。

# 参考资料
【1】[window下Ionic环境安装](http://www.cnblogs.com/shikelong/p/4480975.html)
【2】[ionic环境配置和android打包签名](http://www.jianshu.com/p/0588510fbb97)
【3】[ionic build android error when download gradle](http://stackoverflow.com/questions/29874564/ionic-build-android-error-when-download-gradle)
