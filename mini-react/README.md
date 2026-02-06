# Mini React 原理详解

这个项目实现了一个简化版本的 React 核心，旨在通过最少的代码演示 **React Fiber** 和 **并发模式** 的工作原理。

## 核心原理解析

### 1. 虚拟 DOM (VDOM)
我们通过 `createElement` 函数将 UI 描述为普通的 JS 对象。每个对象包含 `type`, `props` 和 `children`。

### 2. Fiber 架构 (核心)
React 15 以前使用递归渲染，一旦开始无法中断，容易导致浏览器卡顿。
Fiber 将“树”结构转换成了“链表”结构：
- `child`: 指向第一个子节点。
- `sibling`: 指向下一个兄弟节点。
- `parent`: 指向父节点。

这种结构允许我们随时记录当前的执行进度，并在浏览器主线程繁忙时通过 `yield` 交出控制权。

### 3. 时间切片 (Time Slicing)
利用浏览器的 `requestIdleCallback` API，我们可以在浏览器空闲时执行微小的渲染任务。
```javascript
function workLoop(deadline) {
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  // ...
}
```

### 4. 双缓存与 Reconciliation (Diff)
- **alternate**: 每个 Fiber 节点保存着它在上一帧对应的节点引用。
- **Reconciliation**: 我们对比新旧 Fiber 树，标记 `PLACEMENT` (新增), `UPDATE` (更新) 或 `DELETION` (删除)。

### 5. Commit 阶段
为了避免用户看到只渲染了一半的 UI，我们将计算阶段（Render Phase）和应用阶段（Commit Phase）分开。只有当整棵 Fiber 树计算完毕后，才一次性应用到真实 DOM 上。

### 6. Hooks 原理
`useState` 通过在 Fiber 节点上维护一个 `hooks` 数组来实现。
- 每次调用 Hook，索引 `hookIndex` 递增。
- 这就是为什么 Hook 不能写在 `if` 或 `loop` 中，因为顺序一旦改变，状态就会错位。

## 如何运行
1. 打开 `index.html`。
2. 你会看到一个基于 `Function Component` 和 `useState` 的计数器。
3. 所有的渲染都是通过 Fiber 调度完成的。
