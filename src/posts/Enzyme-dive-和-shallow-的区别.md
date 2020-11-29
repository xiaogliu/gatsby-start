---
title: Enzyme dive() 和 shallow() 的区别
date: 2020-10-14 14:36:49
tags: [Enzyme]
categories: Test
e_title: the-difference-between-dive-and-shallow
---

ShallowWrapper API 中有两个易混的 `.dive()` 和 `.shallow()`，调用它们都会返回 `ShallowWrapper`，但他们在使用场景和执行过程中都有所区别。

# API 定义

- `.dive([options]) => ShallowWrapper`

  Shallow render the one non-DOM child of the current wrapper, and return a wrapper around the result.

  > `non-DOM child` 指的是 非 dom 的 reactElement（不能是 div span 等）

- `.shallow([options]) => ShallowWrapper`

  Shallow renders the current node and returns a shallow wrapper around it.

# 源码解析

- `.dive()` [源码](https://github.com/enzymejs/enzyme/blob/master/packages/enzyme/src/ShallowWrapper.js#L1700)

  ```js
  /**
   * Primarily useful for HOCs (higher-order components), this method may only be
   * run on a single, non-DOM node, and will return the node, shallow-rendered.
   *
   * @param {Object} options
   * @returns {ShallowWrapper}
   */

  dive(options = {}) {
    const adapter = getAdapter(this[OPTIONS]);
    const name = 'dive';
    return this.single(name, (n) => {
      if (n && n.nodeType === 'host') {
        throw new TypeError(`ShallowWrapper::${name}() can not be called on Host Components`);
      }
      const el = getAdapter(this[OPTIONS]).nodeToElement(n);
      if (!isCustomComponentElement(el, adapter)) {
        throw new TypeError(`ShallowWrapper::${name}() can only be called on components`);
      }
      const childOptions = makeInheritedChildOptions(this, options);
      return this.wrap(el, null, childOptions);
    });
  }
  ```

- `.shallow()` [源码](https://github.com/enzymejs/enzyme/blob/master/packages/enzyme/src/ShallowWrapper.js#L1288)

  ```js
  /**
   * Shallow renders the current node and returns a shallow wrapper around it.
   *
   * NOTE: can only be called on wrapper of a single node.
   *
   * @param {Object} options
   * @returns {ShallowWrapper}
   */
  shallow(options = {}) {
    return this.single('shallow', (n) => {
      const childOptions = makeInheritedChildOptions(this, options);
      return this.wrap(getAdapter(this[OPTIONS]).nodeToElement(n), null, childOptions);
    });
  }
  ```

我们可以将 `.dive()` 源码稍作变化：

```js
dive(options = {}) {
  return this.single('dive', (n) => {
    // 错误判断-start
    if (n && n.nodeType === 'host') {
      throw new TypeError(`ShallowWrapper::${name}() can not be called on Host Components`);
    }
    const el = getAdapter(this[OPTIONS]).nodeToElement(n);
    const adapter = getAdapter(this[OPTIONS]);
    if (!isCustomComponentElement(el, adapter)) {
      throw new TypeError(`ShallowWrapper::${name}() can only be called on components`);
    }
    // 错误判断-end
    const childOptions = makeInheritedChildOptions(this, options);
    return this.wrap(getAdapter(this[OPTIONS]).nodeToElement(n), null, childOptions);
  });
}
```

通过对比变体后的 `.dive()` 和 `.shallow()` 对比，如果去掉错误判断部分，我们可以看到，`.dive()` 的逻辑和 `.shallow()` 一样。通常，`.dive()` 配合高阶组件一起使用，如在 Enzyme 仓库这个 issue 中 [Documentation does not make it clear when to use `.dive()` vs `.shallow()`](https://github.com/enzymejs/enzyme/issues/1798) ，[@Jordan Harband](https://github.com/ljharb) 提到

> .dive() is sugar for "throw if there's more than one child, throw if that child isn't a custom component, call .shallow on it". It was a common enough pattern that it warranted first-class inclusion.
> In particular, the mantra i often use is "when shallow rendering, one .dive() per HOC"

如果仅从功能来看，能用 `.dive()` 的场景同样可以使用 `.shallow()` ，且结果一样。

但 `.dive()` 内部做了更加严格的类型判断（不能是 `Host Components`，且必须是自定义的 components。对 web 而言，`div` 等原生 html DOM 元素，以及 `null` 或者 react 内建组件 `<Fragment>` 都不行），并且，在高阶组件中使用，语义也更加友好：dive 到高阶组件包裹的自定义组件中（后文有例子）。

> With respect to renderers there are two types of react components:
> **Host Components**: Host components are platform-specific components, such as `<div>` or a `<View>` and they run platform-specific code such as mounting, updates, and unmounting of DOM/Native view. They typically begin with lower-case in the case of ReactDom.
> **Composite Components**: Composite components are user-defined components such as `<MyButton>` or `<Content>` and they behave the same way with all renderers. React will calls methods, such as render() and componentDidMount(), on the user-supplied composite components.

# 使用场景

## 宿主对象类型

`.dive()` 只能用于非 DOM 的 wrapper，而 `.shallow()` 没有此限制，如果成功输出 `ShallowWrapper`，结果都一样。看下面代码：

```js
test('试验', () => {
  class Bar extends React.Component {
    render() {
      return (
        <div>
          <div className="in-bar" />
        </div>
      );
    }
  }

  class Foo extends React.Component {
    render() {
      return (
        <div>
          <Bar />
        </div>
      );
    }
  }

  const wrapper = shallow(<Foo />);

  // 因为浅渲染，Bar 在当前 wrapper 中只会渲染成 <Bar />，所以找不到其包含的 '.in-bar'
  expect(wrapper.find('.in-bar').length).toBe(0);

  // 这里找到的 Bar 是 <Bar />
  expect(wrapper.find('Bar').length).toBe(1);

  // 对 '<Bar />' 使用 dive() 后，将会渲染它，然后就可以找到 '.in-bar'了
  expect(wrapper.find('Bar').dive().find('.in-bar').length).toBe(1);
  // 这里可以使用 shallow() 效果相同
  expect(wrapper.find('Bar').shallow().find('.in-bar').length).toBe(1);

  // dive() 只能应用于 非 DOM
  console.log(wrapper.find(Bar).dive().find('.in-bar').dive().debug()); // 报错，不能对 dom 使用
  console.log(wrapper.find(Bar).dive().find('.in-bar').shallow().debug()); // 正常输出 html
});
```

> `.dive()` only works on a wrapper around a single element from a custom component. If you want to shallow on an HTML element, or multiple, you'd need `.shallow()`. I think the use cases are rare, but they exist. by [@Jordan Harband](https://github.com/ljharb)

## 配合高阶组件使用

```js
const withHOC = Component => props => (
  <Component testHOCProp="come from HOC" {...props} />
);
class Bar extends React.Component {
  render() {
    return (
      <div>
        <div className="in-bar" />
      </div>
    );
  }
}
class EnzymeDive extends React.Component {
  shouldComponentUpdate() {
    console.log(1111);
  }
  render() {
    return (
      <div>
        Enzyme Dive
        <Bar />
      </div>
    );
  }
}

test('Enzyme .dive() with HOC', () => {
  const wrapper = shallow(<EnzymeDive />);
  wrapper.dive().setProps();

  console.log('====wrapper.debug()====', wrapper.debug());
  console.log('====wrapper.dive().debug()====', wrapper.dive().debug());
});

test('Enzyme .shallow() with HOC', () => {
  const wrapper = shallow(<EnzymeDive />);
  wrapper.shallow().setProps();

  console.log('====wrapper.debug()====', wrapper.debug());
  console.log('====wrapper.dive().debug()====', wrapper.shallow().debug());
});
```

两个测试用例 `Enzyme .dive() with HOC` 和 `Enzyme .shallow() with HOC` 输出的结果都一样，且对于 `EnzymeDive` 组件而言，测试覆盖率都达到了 100%。其中

- `wrapper.debug()` 的输出结果为：

```js
<EnzymeDive testHOCProp="come from HOC" />
```

- `wrapper.dive().debug()` 和 `wrapper.shallow().debug()` 的输出结果为：

```js
<div>
  Enzyme Dive
  <Bar />
</div>
```

可以看到 `.dive()` 和 `.shallow()` 都 "unwrap" 了高阶组件（"unwrap" here just means "shallow-render one level deeper" ）。

> **测试源码**可以在[这里](https://github.com/xiaogliu/test-react/blob/master/src/features/EnzymeDive/EnzymeDive.test.jsx)找到。

# 结论

如果宿主对象不是 `div` 等原生 html DOM 元素，使用哪个功能一样。但如 Enzyme（3.11.0）源码注释所写，如果是高阶组件，推荐使用 `.dive()`，其他场景，使用 `.shallow()`。

# 参考资料

[Documentation does not make it clear when to use `.dive()` vs `.shallow()`](https://github.com/enzymejs/enzyme/issues/1798)
