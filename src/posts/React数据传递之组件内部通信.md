---
title: React数据传递之组件内部通信
date: 2017-12-31 02:16:59
tags: [React]
categories: React
e_title: react-components-inner-communication
---

# 1. 概述

脱离初级前端一段时间后会发现，写样式的时间越来越少，处理数据的时间越来越多。处理数据的过程也就是实现业务逻辑的过程，这在项目中无疑是最重要的。   

所以学习前端框架，了解完基本语法后，接下来就要学习其如何进行数据传递。   

Angular 设计之初的一大亮点就是实现了数据的双向绑定，使用 Vue 一段时间后发现，所谓数据的双向绑定，组件内部唯一的应用场景就是 form 表单（input，textarea，select， radio），而这种场景下的数据双向绑定，即便框架内部没有实现，自己实现起来也非常简单。明白这一点后感觉之前认为 React 没有实现数据双向绑定很 low 的想法很幼稚。   

对于 React 的数据传递，涉及两方面的内容：   

1. 组件内部的数据传递，典型的应用场景包括如何实现 form 表单双向数据绑定、如何绑定事件；
2. 组件间的数据传递。 包括父组件往子组件传递数据、子组件往父组件传递数据以及兄弟组件之间传递数据。   

本文先讨论组件内部的数据传递。   

# 2. 组件内部数据传递   

React 组件内部通信主要分为两部分：数据展示与事件处理。

## 2.1 数据展示

组件内部数据的展示和更新都是通过 `state` 来实现的，如果要使用 `state` 必须使用 ES6 的 class 定义组件。数据更新在双向数据绑定部分探讨，这部分仅讨论展示初始化数据。   

> 如果你熟悉 Vue，React 的 `state` 对象相当于 Vue 的 `data` 对象    

下面是一个纯展示数据的示例：   

```js
class App extends Component {
  constructor(props) {
    super(props);

    // 初始化 state
    this.state = {
      inputValue: "test",
    };
  }

  render() {
    // 注意，在 react 中，DOM 元素是对象，所以使用‘()’包住 
    return (
      <div className="App">
        <p>{this.state.inputValue}</p>
      </div>
    );
  }
}
```

在通过 class 定义的 React 组件中，除了生命周期钩子函数，`constructor()` 和 `render()` 着两个方法也是自动执行的，先执行 `constructor()`，执行 `constructor()` 的同时也是再为 `render()` 渲染 DOM 做数据准备。   

> 实际上 `constructor()` 函数是组件生命周期中调用的第一个函数。

## 2.2 事件

### 2.2.1 与 DOM 中事件的异同

在 React 中处理事件和在 DOM 中处理事件类似，有两点不同：   

1. React 中通过驼峰命名法命名事件，而不是全是小写字母；
2. 在 JSX 中直接传递函数作为事件处理程序，而不是字符串。 

> 第 2 点不同有坑，后面细说

举个例子，HTML中的事件：   

```html
<button onclick="activateLasers()">
  Activate Lasers
</button>
```

React 中的事件：   

```js
// 因为 jsx 中'{}'里面代表函数表达式，
// 所以传递给 onClick 的实际是函数 activateLasers 的函数体部分，
// 因此需要指定 this 指向，不然会报错
<button onClick={activateLasers}>
  Activate Lasers
</button>
```

### 2.2.2 存在的坑

直接传递 function 作为 event handler 需要指定函数的执行环境，即需要手动绑定 `this`，不然会报 `this` 为 `undefined` 的错。见下面的例子：   

```js
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isToggleOn: true,
    };

    // 手动绑定 this
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // 如果不在 constructor() 方法中手动绑定 this，直接将其作为事件处理程序 this 为 undefined
    console.log(this);

    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render() {
    return (
      <div className="App">
        <button onClick={this.handleClick}>
          {this.state.isToggleOn ? "on" : "off"}
        </button>
      </div>
    );
  }
}
```

### 2.2.3 为什么会有坑

[React 官网](https://reactjs.org/docs/handling-events.html)说这个锅要 JS 原生语法来背，其实不尽然，React 实在 JS 语法早已确定的情况下设计了这样的事件系统，如果一定要有人站出来背锅，他们五五分吧。   

**1, JS原生语法存在的问题**   

JS语法中有这样的规则：如果将一个函数的函数体（没有`()`）赋值给另一个变量，函数体内部的 `this` 指向可能会发生变化。会不会变化取决于函数和被赋值的变量是否处于同一个作用域（相同的执行环境）中，但实际使用中，将一个函数赋值给相同作用域的变量没有意义，那样的话直接使用那个函数就好，没必要在赋值给另一个变量。   

- `this` 指向不发生改变的没有意义的例子（为了方便说明，直接使用 `var` 操作符）：
```js
var fn = function () {
  console.log(this);
};

var a = fn;

fn(); // window
a(); // window
```

- `this` 指向发生改变的例子：

```js
var fn = function () {
  console.log(this);
};

// 将函数体赋值给一个对象的属性，函数执行时 this 和定义时指向不同
var o = {
  a: fn,
};

fn(); // window
o.a(); // o，即{a:f}
```

如果想要在将函数体赋值另一个变量的同时把原函数的 `this` 指向也一块赋值过去，就需要在赋值的过程中进行绑定 `this` 的操作，如下：   

```js
var fn = function () {
  console.log(this);
};

// fn 在赋值的同时将内部的 this 打包一块赋值给了 a
var o = {
  a: fn.bind(this),
};

fn(); // window
o.a(); // window
```

通常在将函数体赋值给变量的时候为了避免 `this` 出错，都会进行**绑定执行环境的操作**，典型的例子是 `var bindId = document.getElementById.bind(document)`   

**2, JSX 存在的问题**   

因为 JSX 中 DOM 元素也是对象，给元素的属性赋值实际是给 DOM 元素对象的属性赋值，见下：   

```js
const element = (
  <button onClick={this.handleClick}>click me</button>
);
```

等同于

```js
const element = {
  type: 'button',
  props: {
    onClick: this.handleClick,
    children: 'click me',
  },
};
```
这实际就是**将函数体赋值给一个对象的属性，函数执行时 this 和定义时指向不同**的场景，和原生语法相同的是 **this** 指向发生了改变，不同的是原生 JS 中不管怎样，`this` 总归是有个指向的，而 JSX 直接 `undefined`。    

所以说不绑定 `this` 报 `undefined` 的错不能全怪 JS 原生语法。   

## 3. 双向数据绑定

通过 `state` 传递数据加上事件处理程序便能实现数据的双向绑定，其背后的思想是（以 input 为例）：初始化时将 `state` 中预定义的 state `a` 赋值给 input，当 input 的 value 发生改变时，触发事件处理程序，将改变后的 value 赋值给状态 `a`，React 监测到 `state` 改变时重新调用 `render()` 方法，即重新渲染组件，达到双向绑定的目的。   

```js
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "test",
    };
    this.changeInput = this.changeInput.bind(this);
  }

  changeInput(e) {
    // 将改变后的 input 值赋值给 inputValue，通过事件对象 $event.target.value 实现
    this.setState({
      inputValue: e.target.value
    });
  }

  render() {
    // input 改变时触发 changeInput
    return (
      <div className="App">
        <input value={this.state.inputValue} onChange={this.changeInput} />
        <p>{this.state.inputValue}</p>
      </div>
    );
  }
}
```

这里用到了事件对象，React 的事件对象和 JS 原生事件对象保持一致。 

# 参考资料  
【1】[Handling Events](https://reactjs.org/docs/handling-events.html)   
【2】[State and Lifecycle](https://reactjs.org/docs/state-and-lifecycle.html)   
【3】[Introducing JSX](https://reactjs.org/docs/introducing-jsx.html)   
【4】[React组件生命周期小结](https://www.jianshu.com/p/4784216b8194)   
