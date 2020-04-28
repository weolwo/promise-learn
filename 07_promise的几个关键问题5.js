/*
6.promise异常传透?
  (1)当使用promise的then链式调用时, 可以在最后指定失败的回调,
  (2)前面任何操作出了异常, 都会传到最后失败的回调中处理
7.中断promise链?
  (1)当使用promise的then链式调用时, 在中间中断, 不再调用后面的回调函数
  (2)办法: 在回调函数中返回一个pending状态的promise对象
*/

new Promise((resolve, reject) => {
    // resolve(1)
    reject(1)
}).then(
    value => {
        console.log('onResolved1()', value)
        return 2
    },
    // reason => {throw reason}
).then(
    value => {
        console.log('onResolved2()', value)
        return 3
    },
    reason => {
        throw reason
    }
).then(
    value => {
        console.log('onResolved3()', value)
    },
    reason => Promise.reject(reason)
).catch(reason => {
    console.log('onReejected1()', reason)
    // throw reason
    // return Promise.reject(reason)
    return new Promise(()=>{}) // 返回一个pending的promise  中断promise链
}).then(
    value => {
        console.log('onResolved3()', value)
    },
    reason => {
        console.log('onReejected2()', reason)
    }
)