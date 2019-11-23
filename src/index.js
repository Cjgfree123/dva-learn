import React from 'react';
import dva, { connect } from 'dva';
import keymaster from "keymaster";
import { Router, Route } from "dva/router";

// 执行dva函数，返回app实例
const app = dva();

/**
 * store树:
 * store={
 *  counter: { num: 0 },
 *  counter2: { num: 0 },
 * }
 */

const delay = (millseconds) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, millseconds);
    })
}

app.model({
    namespace: "counter",
    state: {
        num: 0,
    },
    reducers: {
        // 接收拉状态, 返回新状态
        /**
         * dispatch({type:'minus'})
         */
        add(state) {
            return {
                num: state.num + 1,
            };
        },
        minus(state) {
            return {
                num: state.num - 1,
            }
        }
    }
});

app.model({
    namespace: "counter2",
    state: {
        num: 0,
    },
    reducers: {
        // 接收拉状态, 返回新状态
        /**
         * dispatch({type:'minus'})
         */
        add(state) {
            return {
                num: state.num + 1,
            };
        },
        minus(state) {
            return {
                num: state.num - 1,
            }
        }
    },
    effects: {
        *asyncAdd(action, { put, call }) { // redux-saga/effects {put, call}
            yield call(delay, 1000); // 把1000传给delay方法, 并进行调用, yield会等待promise方法完成
            yield put({
                type: "add"
            });
        }
    },
    subscriptions: {
        keyboard({ dispatch }) { // keyboard这个名字, 可以随便起
            // 监听键盘的输入, 如果是space,调用add
            keymaster("space", () => {
                dispatch({ type: "add" })
            })
        },
        changeTitle({ history }) {
            // 随着hash变化，随时更新网页title
            history.listen(({ pathname }) => {
                document.title = pathname;
            });
        }
    }
});

const Counter = (props) => {
    // 注意: 在派发action时，必须加上命名空间, 防止多组件之间派发的action之前名字重复。
    return (
        <div>
            <p>{props.num}</p>
            <button onClick={() => props.dispatch({ type: "counter/add" })}>+</button>
            <button onClick={() => props.dispatch({ type: "counter/minus" })}>-</button>
        </div>
    )
}

const Counter2 = (props) => {
    // 注意: 在派发action时，必须加上命名空间, 防止多组件之间派发的action之前名字重复。
    return (
        <div>
            <p>{props.num}</p>
            <button onClick={() => props.dispatch({ type: "counter2/add" })}>+[add]</button>
            <button onClick={() => props.dispatch({ type: "counter2/asyncAdd" })}>+[asyncAdd]</button>
            <button onClick={() => props.dispatch({ type: "counter2/minus" })}>-</button>
        </div>
    )
}

// 将状态和组件, 进行连接
// 备注: 如果第2各参数不写的话, 在app.router(()=> {}) 返回
const ConnectedCounter = connect(state => state.counter)(Counter);
const ConnectedCounter2 = connect(state => state.counter2)(Counter2);

// 1.将app.router()返回值,渲染到root元素中
app.router(
    // props: {app,history}
    ({ app, history }) => {
        return (<Router history={history}>
            <div>
                <Route path="/counter1" component={ConnectedCounter} />
                <Route path="/counter2" component={ConnectedCounter2} />
            </div>
        </Router>);
    }
);

// 2.启动项目
app.start("#root");

/**
 * subscription[订阅]:
 * 1. 是全局的，即使组件销毁, 全局的状态还在。
 * 2. 里边函数, 即在组件渲染的时候, 一一执行。
 */