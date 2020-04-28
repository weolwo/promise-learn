/*
1. 宏列队: 用来保存待执行的宏任务(回调), 比如: 定时器回调/DOM事件回调/ajax回调
	2. 微列队: 用来保存待执行的微任务(回调), 比如: promise的回调/MutationObserver的回调
	3. JS执行时会区别这2个队列
		JS引擎首先必须先执行所有的初始化同步任务代码
		每次准备取出第一个宏任务执行前, 都要将所有的微任务一个一个取出来执行
 */

setTimeout(() => {
    console.log('setTimeout1')
    Promise.resolve(3).then(value => {
        console.log('onResolved3', value)
    })
})

setTimeout(() => {
    console.log('setTimeout2')
})

Promise.resolve(1).then(value => {
    console.log('onResolved1', value)
})

Promise.resolve(2).then(value => {
    console.log('onResolved2', value)
})

//浏览器执行结果
/*
onResolved1 1
onResolved2 2
setTimeout1
onResolved3 3
setTimeout2*/

//node上执行结果

/*
onResolved1 1
onResolved2 2
setTimeout1
setTimeout2
onResolved3 3*/
