/*
1. Promise构造函数: Promise (excutor) {}
excutor函数: 同步执行  (resolve, reject) => {}
resolve函数: 内部定义成功时我们调用的函数 value => {}
reject函数: 内部定义失败时我们调用的函数 reason => {}
说明: excutor会在Promise内部立即同步回调,异步操作在执行器中执行
定义：new <T>(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T>;

2. Promise.prototype.then方法: (onResolved, onRejected) => {}
onResolved函数: 成功的回调函数  (value) => {}
onRejected函数: 失败的回调函数 (reason) => {}
说明: 指定用于得到成功value的成功回调和用于得到失败reason的失败回调
返回一个新的promise对象
then接口定义：then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;

3. Promise.prototype.catch方法: (onRejected) => {}
onRejected函数: 失败的回调函数 (reason) => {}
说明: then()的语法糖, 相当于: then(undefined, onRejected)
catch接口定义：catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;

4. Promise.resolve方法: (value) => {}
value: 成功的数据或promise对象
说明: 返回一个成功/失败的promise对象  resolve<T>(value: T | PromiseLike<T>): Promise<T>;

5. Promise.reject方法: (reason) => {}
reason: 失败的原因
说明: 返回一个失败的promise对象 reject<T = never>(reason?: any): Promise<T>;

6. Promise.all方法: (promises) => {}
promises: 包含n个promise的数组
说明: 返回一个新的promise, 只有所有的promise都成功才成功, 只要有一个失败了就直接失败
all<T>(values: readonly (T | PromiseLike<T>)[]): Promise<T[]>;

7. Promise.race方法: (promises) => {}
promises: 包含n个promise的数组
说明: 返回一个新的promise, 第一个完成的promise的结果状态就是最终的结果状态
 race<T>(values: readonly T[]): Promise<T extends PromiseLike<infer U> ? U : T>;
*/

// 产生一个成功或者失败的 Promise
let p1 = new Promise((resolve, reject) => {
    // 下面两个方法只能执行一个，因为状态只能改变一次
    resolve('成功了执行resolve(),Promise状态变为resolved')
    //reject('失败执行reject(),Promise状态变为rejected')
});

let p2 = Promise.resolve(`成功了执行resolve(),Promise状态变为resolved`);
let p3 = Promise.reject('失败执行reject(),Promise状态变为rejected');

p1.then(value => {
    console.log(value)
})

p2.then(value => { // 执行 onfulfilled()回调函数,官方名字
    console.log(value)
})

p3.then(null, reason => {
    console.log(reason)
})

p3.catch(reason => { // 执行 onRejected()回调函数
    console.log(reason)
})

// 所有的成功才算成功,只要有一个失败就失败
const promise = Promise.all([p1, p2, p3]);
promise.then(value => {
    console.log(value)
}, reason => {
    console.log(reason)
})

// 谁先执行完就返回谁
const rece = Promise.race([p1, p2, p3]);
rece.then(value => {
    console.log(value)
}, reason => {
    console.log(reason)
})