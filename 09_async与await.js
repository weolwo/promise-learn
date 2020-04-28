/*
目标: 进一步掌握async/await的语法和使用
mdn文档:
https: //developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/await
1. async 函数
函数的返回值为promise对象
promise对象的结果由async函数执行的返回值决定

2. await 表达式
await右侧的表达式一般为promise对象, 但也可以是其它的值
如果表达式是promise对象, await返回的是promise成功的值
如果表达式是其它值, 直接将此值作为await的返回值

3. 注意:
await必须写在async函数中, 但async函数中可以没有await
如果await的promise失败了, 就会抛出异常, 需要通过try...catch来捕获处理
*/

/*async function fn1() {
    return 1
}

let res = fn1();
console.log(res) //Promise { 1 }*/

function fn2() {
    return Promise.reject(2)
}

async function test() {
    /* let result = fn2().then(value => {
             console.log('value',value)
         },
         reason => {
             console.log('reason',reason)
         });*/
    try {
        let result = await fn2();
        console.log('result', result)
    } catch (error) {
        console.log('error', error)
    }
}

test()