# dva demo

```
// 运行
yarn start
```

```
// 使用cra搭建, 项目基础结构
npx create-react-app 20.dva
```

## 定义顺序

1. 产生app实例。

2. 
```
app.model(
    {
        namespace:'xx', // 注意: 在派发action时，必须加上命名空间, 防止多组件之间派发的action之前名字重复。
        state: 0,
        effects: {}, // redux-saga/effects {put, call}
        reducers: {}
    }
)
```

/**
 * subscription[订阅]:
 * 1. 是全局的，即使组件销毁, 全局的状态还在。
 * 2. 里边函数, 即在组件渲染的时候, 一一执行。
 * 3. 里边函数名字, 可以随便定义。
*/


```

3. 定义组件

4. app.router()

5. app.start("#root") // 将app.router()返回值,渲染到root元素中