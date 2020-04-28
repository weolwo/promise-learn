/* 
    1.	如何改变promise的状态?
      (1)resolve(value): 如果当前是pending就会变为resolved
      (2)reject(reason): 如果当前是pending就会变为rejected
      (3)抛出异常: 如果当前是pending就会变为rejected
    
    2.	一个promise指定多个成功/失败回调函数, 都会调用吗?
      当promise改变为对应状态时都会调用
    */

let p = new Promise((resolve, reject) => {
    //resolve('Promise状态会被标记为resolved')
   // reject('Promise状态会被标记为rejected')
    throw new Error('Promise状态会被标记为rejected')
});

p.then(
    value => {
        console.log('value1', value) // value1 Promise状态会被标记为resolved
    },
    reason => {
        console.log('reason1', reason) // value2 undefined
    }
).then(
    value => {
        console.log('value2', value)
    },
    reason => {
        console.log('reason2', reason)
    }
)