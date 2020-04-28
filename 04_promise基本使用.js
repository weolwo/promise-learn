// promise的基本使用
// Promise接口定义： new <T>(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T>;
new Promise((resolve, reject) => {
    console.log('执行 executor同步函数')
    let time = Date.now();
    // 执行异步操作
    setTimeout(() => {
        if (time % 2 === 0) {
            resolve(time) // 如果成功了, 调用 resolve(value)
        } else {
            reject(time)// 如果失败了, 调用 reject(reason)
        }
    })

// then接口定义：then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
}).then(value => {
    console.log('value', value) // The callback to execute when the Promise is resolved
}, reason => {
    console.log('reason1', reason) // The callback to execute when the Promise is rejected
// catch接口定义：catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
}).catch(reason => {
    console.log('reason2', reason) // 接收得到失败的reason数据  onRejected 回调执行
})