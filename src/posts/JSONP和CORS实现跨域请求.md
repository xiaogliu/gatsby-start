---
title: JSONP和CORS实现跨源请求
date: 2017-10-18 15:06:32
tags: [JavaScript,Node.js]
categories: JavaScript
e_title: cross-origin-request-using-jsonp-and-cors
---

# 为什么会产生跨源

跨源产生的场景主要是在：如果A页面（通过B页面提供的API）获取B页面的资源，而A页面和B页面的源信息不同，那么便会产生跨源错误。  

> 源信息包括：协议、域名、端口三部分，同源指的是源信息的协议、域名、端口都相同

这主要源于 [跨源安全策略](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)，简单说，如果两个页面的源信息不同，就不能通过 [XHR](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest) 对象获取对方的信息。

**需要注意的是，跨源策略是浏览器基于安全考虑做的限制，而非服务器端做了不允许跨源的限制**。如果将浏览器设置为允许跨源请求，跨源策略随即失效（Safari浏览器开发菜单下拉列表中有“停用跨源限制”的选项，Chrome设置略复杂，请自行搜索解决）。   

通过更改代码跳过浏览器跨源限制的方法很多，本文主要讨论常用的JSONP和CORS方法，完整代码已放在 Github 上 [cross_origin_example](https://github.com/xiaogliu/cross_origin_example)。

# 跨源场景

## 跨源场景说明

url  | 说明  | 是否允许通信
--|---|--
http://www.domain.com/a.js <br> http://www.domain.com/b.js <br> http://www.domain.com/c/c.js  | 同源，不同文件或路径  |  允许
http://www.domain.com:8080/a.js <br> http://www.domain.com/b.js  | 协议、域名相同，端口不同 | 不允许
http://www.domain.com/a.js <br> http://www.domain111.com/b.js  | 协议、端口相同，域名不同 | 不允许
http://www.domain.com/a.js <br> http://x.domain.com/b.js <br> http://domain.com/c.js | 协议、端口相同，域名不同（主域相同，子域不同） | 不允许
http://www.domain.com/a.js <br> http://127.0.0.1/b.js | 协议、端口相同，域名不同（即便 www.domain.com 对应的ip地址为 127.0.0.1） | 不允许
http://www.domain.com/a.js <br> https://www.domain.com/b.js | 域名、端口相同，协议不同 | 不允许

## 跨源实例

下面是通过写原生 XHR 对象，调用豆瓣图书的API

```js
const xhr = new XMLHttpRequest();

xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
      console.log(xhr.responseText);
    } else {
      console.log("Error" + xhr.status);
    }
  }
};
// 获取id为6548683的图书信息
xhr.open('get', 'https://api.douban.com/v2/book/6548683', true);
xhr.send(null);
```

直接使用上述代码会报下面的错误：

```
Failed to load https://api.douban.com/v2/book/6548683:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
Origin 'http://127.0.0.1:7070' is therefore not allowed access.
```

该错误说明 `https://api.douban.com` 在响应头信息中没有设置 `Access-Control-Allow-Origin` （CORS标准中定义的内容，后面讨论），这就不允许跨源请求。

> - 此处我通过Node开启了本地服务，通过http://127.0.0.1:7070 这个地址进行的请求，如果直接将上述代码插入到 html 文件中，在本地直接访问也会报跨源错误，错误提示中 Origin 由 http://127.0.0.1:7070 变为 `null`。    
> - 不同浏览器的跨源安全策略实现方式有差异，上述代码在 Chrome（61.0.3163.100）浏览器下测试会报跨源错误，但 Safari（10.1.2）浏览器不会报跨源错误，可以正常返回数据。

# JSONP实现跨源通信

JSONP(JSON with Padding) 实现跨源通信的原理是 **Web 页面上调用外部 js 文件不受浏览器同源策略的限制，所以通过动态创建 `script` 便签，然后获取其内容，便实现了跨源通信**，具体过程为：

1. 首先在 DOM 中创建 `script` 标签；
2. 将 `script` 标签的 `src` 属性值设置为请求API的地址（一般是一个绝对路径的url），这里的关键是 **设置回调函数，并将其作为 url 的参数**；
2. 服务端接收到请求后，通过该参数获得回调函数名，并将数据放在参数中将其返回；
3. 获取数据后就可以通过提前设置的回调函数进一步处理数据。

## JSONP实例

还是以调用豆瓣读书API为例，通过JSONP调用的代码如下：

```js
// 创建script标签
const script = document.createElement('script');
script.type = 'text/javascript';

// 指定script标签src属性值，同时传参并指定回调函数，此处为onBack
script.src = 'https://api.douban.com/v2/book/6548683?callback=onBack';
document.head.appendChild(script);

// 回调函数
function onBack(res) {
  console.log(res);
}
```

执行上面代码，就可以跨源访问豆瓣API了。

## 优缺点

- 优点

1. 兼容性很好，在古老的浏览器也能很好的运行；
2. 简单，不管通过创建 `script` 标签获取数据，还是通过回调函数处理获取的数据，都简单明了；
3. 不需要服务端单独为某个域名做设置（对比CORS方法，下文说明），这在请求自己不受控的资源是特别受用（你总不能要求豆瓣或者某个提供查询天气状况的API提供商单独为你的域名做设置）。

- 缺点

1. 只支持 `get`；
2. 潜在的安全问题（大站提供的API可忽略）；
3. 稳定性存疑。毕竟，使用JSONP访问的资源往往都是别人家的，说不定哪天就关了或者代码有改动。

## 应用场景

主要是在访问不能按自己的需求随意更改的公共API时使用，比如查个天气什么的。

# CORS实现跨源通信

[CORS](https://fetch.spec.whatwg.org/#http-cors-protocol)(Cross-Origin Resource Sharing，跨源资源共享)是 W3C 一项推荐标准，定义了在必须访问跨源资源时，浏览器和服务器应该如何通信。   

其实现方式是，通过使用自定义的HTTP头信息让浏览器和服务器进行通信，进而确定是否允许跨源通信。   

浏览器向服务器发送请求时会在 Request Headers 中自动添加请求源信息（`Origin`字段），服务器端通过在 Response Headers 中添加 `Access-Control-Allow-Origin` 字段，指明允许那些源可以访问。经浏览器检查，如果请求源在服务器允许请求源列表中，则允许请求源从该服务器上的获取资源。   

> 实际上，浏览器不会完全阻止跨源请求，如果源A要请求源B上的资源，浏览器会将请求到的数据放在 [网络层](https://en.wikipedia.org/wiki/OSI_model#Layer_3:_Network_Layer) ，然后检查源A是否在源B允许的请求源列表上，如果没有，浏览器就会触发 `XMLHttpRequest` 的 `error` 事件（此处就是跨源错误），同时阻止数据从网络层传送到源A的js代码中。

## CORS实例

实现CORS方法需要服务源做设置，为了模拟这个场景通过Node搭建两个本地服务器，一个做请求源，一个做服务源。   

> 需要对Node有基本了解，如何使用Node搭建本地服务器不在本文中讨论

### 服务源设置

```js
// 引入http模块（http是node自带模块，安装node后自带，无需额外安装）
const http = require('http');

const serv = http.createServer(function (req, res) {
  res.writeHead(200, {
    // 在respnse headers中注明是编码、数据类型
    "Content-Type": "text/html;charset=utf-8",

    // 允许跨域请求源，端口后面不能有'/'
    'Access-Control-Allow-Origin': 'http://127.0.0.1:7070',
  });
  res.end('这是你要的数据：data');
});

serv.listen(3030, '127.0.0.1');

console.log('服务启动，监听 127.0.0.1:3030');
```

上述代码中，关键是在 response headers 中添加 `'Access-Control-Allow-Origin': 'http://127.0.0.1:7070',`，据此明确允许访问的源（列表）。如果是开放源，可以将 `Access-Control-Allow-Origin` 的值设为 `'*'`，这样任何请求源都可以访问该服务源上的数据。

### 请求源设置

- 设置静态服务器

为方便起见，直接通过 `http-server` 模块搭建静态服务器，目的是通过指定源（此处为http://127.0.0.1:7070）发送请求。安装完 `http-server`模块后通过下面命令进行启动

```bash
http-server -a 127.0.0.1 -p 7070
```

这里启动的静态服务器域名为 `127.0.0.1`， 端口为 `7070`，协议默认为 `http`，静态目录就是当前运行命令所在目录，点击事先准备好的请求文件模拟跨域请求。

> 这里全局安装 `http-server` 模块后才能直接使用该命令，不过更推荐通过本地（局部）安装，然后通过 [npm script](https://xiaogliu.github.io/2017/05/13/package.json-instruction/#npm-script) 启动服务。

- 设置请求文件

实际发送请求的代码可以通过多种形式写，原生、axios 或者 jquery，随意，只要请求 url 是上文设置的服务源就好。下面是使用原生方式写的代码：

```js
const xhr = new XMLHttpRequest();

xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
      console.log(xhr.responseText);
    } else {
      console.log("Error" + xhr.status);
    }
  }
};
// 注明服务源地址
xhr.open('get', 'http://127.0.0.1:3030/', true);
xhr.send(null);
```

## 优缺点

- 优点

1. 前端不需要改动代码，就像访问同源资源一样；
2. 没有对请求方法的限制。

- 缺点

1. 存在[兼容性问题](http://caniuse.com/#search=cors)：IE10以上。
2. 最重要的是不能设置 cookie（cookie 遵循同源策略）。

## 应用场景

在服务源可以按照自己的需求更改（即在 response headers 中添加请求源信息）时使用，公司项目一般都是通过CORS方法实现跨源通信的。

## 待补充

涉及到简单请求和复杂请求，其中 preflight 请求是不带任何自定义请求头的，是浏览器自发行为。

# 通过 Nginx 反向代理

这是最好的方法，简单，前后端也不需要做额外更改。

# 参考资料

【1】[How does Access-Control-Allow-Origin header work?](https://stackoverflow.com/questions/10636611/how-does-access-control-allow-origin-header-work)
【2】[关于跨域，你想知道的全在这里](https://zhuanlan.zhihu.com/p/25778815)
