---
title: React Native初探
date: 2017-05-28 00:59:21
tags: [Hybrid App,React,Android]
categories: Hybrid App
e_title: glance-react-native
---
# 概述
本文基于React Native（0.44）官方文档[Getting Start](https://facebook.github.io/react-native/docs/getting-started.html)实践在Windows 10 操作系统下开发Android APP，主要记录实际开发过程与官方文档不同之处。   

# 安装依赖   

## Node, Python2, JDK

官方推荐使用[Chocolatey](https://chocolatey.org/)(windows下的包管理工具)进行安装，也可以在依赖工具的官网下载安装包进行安装：   

- Node.js [官网下载地址](https://nodejs.org/en/)   
- Python [官网下载地址](https://www.python.org/downloads/)   
- Java SE Development Kit 8 [官网下载地址](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)   

## React Native CLI

使用下面命令安装 React Native CLI ：   

```bazaar
npm install -g react-native-cli
```

## Android Development Environment

具体步骤请参考[官方教程](https://facebook.github.io/react-native/docs/getting-started.html#android-development-environment)   

# 启动Android Virtual Device

这点很重要，进行React Native APP的调试可以选择在安卓模拟器或者真机上进行，如果使用安卓模拟器，在调试之前必须先把模拟器打开，不然会报下面的错误：   

```bazaar
Execution failed for task ':app:installDebug'.
> com.android.builder.testing.api.DeviceException: No connected devices!
```

错误提示为：未发现连接的设备。如果是用模拟器，错误提示可以理解为“模拟器未打开”。   

**下面通过命令行的方式打开安卓模拟器**：

1.查看可用安卓模拟器

```bazaar
emulator -avd -list-avds
```

2.假如上述列表为空，则通过Android Studio创建新的模拟器：   

创建路径为 tools - android - AVD manager   

> 在创建的时候可能会遇到问题，如果不是预期，请谷歌解决。

3.开启模拟器

```bazaar
emulator -avd <AVD-name>
```

开启模拟器的过程最可能出现的问题是下面的错误：   

```bazaar
[11256]:ERROR:./android/qt/qt_setup.cpp:28:Qt library not found at ..\emulator\lib64\qt\lib
Could not launch '..\emulator/qemu/windows-x86_64/qemu-system-x86_64.exe': No such file or directory
```

这是因为emulator更新过程中目录发生了变化，可通过下面命令查询emulator路径   

```bazaar
which emulator
```

如果和`qemu-system-x86_64.exe`文件不再同一个目录，进入`qemu-system-x86_64.exe`目录，重新输入启动模拟器的命令即可   

> 如何通过环境变量更改后面再填坑

# 调试

这里使用React官方案例，下载案例命令如下：   

```bazaar
react-native init AwesomeProject
```

进入AwesomeProject目录，输入下面命令：   

```bazaar
react-native run-android
```

顺利的话就可以在模拟器中看到APP了。

我在打包后遇到过这个错误

```bazaar
Error calling AppRegistry.runApplication
```

有人反馈在模拟器中也遇到过，解决方法请参考[Error calling Appregistry.runApplication in react-native](https://stackoverflow.com/questions/43744156/error-calling-appregistry-runapplication-in-react-native)

# 打包发布

前面准备工作做好后，React签名打包相对简单，输入下面命令就好：   

```bazaar
gradlew assembleRelease
```

> 在Mac或者Linux系统，使用这个命令：`./gradlew assembleRelease`

如果是想发布签名版APK，请参考[Generating Signed APK](https://facebook.github.io/react-native/docs/signed-apk-android.html)

可能会遇到的问题是：

1.finished with non zero exit value

解决方法：通过`gradlew assembleDebug --info`尝试打包debug的APK, 然后在重新使发布命令。

2.设置签名后输出的APK还是未签名的

解决方法：目前无解，不知道为什么按照官方教程设置以后依然是未签名的APK，但可以手动给未签名的APK设置签名，参考这篇文章：[Ionic打包Android apk](https://xiaogliu.github.io/2017/05/13/Ionic%E6%89%93%E5%8C%85Android-apk/#2-3-设置签名)设置签名部分。

# 参考资料
【1】[Getting Started](https://facebook.github.io/react-native/docs/getting-started.html)
【2】[Failed run android simulator : No connected devices!](https://github.com/facebook/react-native/issues/3091)   
【3】[Android emulator启动模拟器](http://www.cnblogs.com/hautezwei/p/6719929.html)   
【4】[How do I launch the Android emulator from the command line?](https://stackoverflow.com/questions/4974568/how-do-i-launch-the-android-emulator-from-the-command-line)   
