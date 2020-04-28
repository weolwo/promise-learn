// 自定义Promise
// ES5匿名函数自调用实现模块化
(function (window) {
    const PENDING = 'pending'
    const RESOLVED = 'resolved'
    const REJECTED = 'rejected'

    class Promise {
        // 参数为executor函数
        constructor(executor) {
            const that = this
            // 三个属性
            that.status = PENDING //Promise对象状态属性，初始状态为 pending
            that.data = 'undefined' // 用于存储结果数据
            that.callbacks = [] //保存待执行的回调函数 ，数据结构：{onResolved(){},onRejected(){}}

            function resolve(value) {
                // RESOLVED 状态只能改变一次
                if (that.status !== PENDING) {
                    return
                }
                that.status = RESOLVED
                that.data = value
                //执行异步回调函数 onResolved
                if (that.callbacks.length > 0) {
                    setTimeout(() => { // 放入队列中执行所有成功的回调
                        that.callbacks.forEach(callbackObj => {
                            callbackObj.onResolved(value)
                        })
                    })
                }
            }

            function reject(seaon) {
                if (that.status !== PENDING) {
                    return
                }
                that.status = REJECTED
                that.data = seaon
                //执行异步回调函数 onRejected
                if (that.callbacks.length > 0) {
                    setTimeout(() => { // 放入队列中执行所有失败的回调
                        that.callbacks.forEach(callbackObj => {
                            callbackObj.onRejected(seaon)
                        })
                    })
                }
            }

            try { //执行器函数立即执行
                executor(resolve, reject)
            } catch (e) {
                reject(e)
            }
        }

        //Promise原型对象 then ,两个回掉函数 成功 onResolved ，失败onRejected
        //返回一个新的Promise对象
        then(onResolved, onRejected) {
            onResolved = typeof onResolved === 'function' ? onResolved : value => value // 向后传递成功的value
            // 指定默认的失败的回调(实现错误/异常传透的关键点)
            onRejected = typeof onRejected === 'function' ? onRejected : reason => {
                throw reason
            } // 抽后传递失败的reason
            const that = this
            return new Promise((resolve, reject) => {

                //调用指定回调函数处理, 根据执行结果, 改变return的promise的状态
                function handle(callback) {
                    // 调用成功的回调函数 onResolved
                    //1.如果抛出异常，return的promise就 会失败，reason就 是error
                    //2.如果回调函数返回不是promise, return的promise就 会成功，value就是返回的值
                    //3.如果回调函数返回是promise, return的promise结 果就是这个promise的结果
                    try {
                        const result = callback(that.data);
                        if (result instanceof Promise) {
                            result.then(value => resolve(value), reason => reject(reason))
                        } else {
                            resolve(result)
                        }
                    } catch (e) {
                        reject(e)
                    }
                }

                // 当前状态还是pending状态, 将回调函数保存起来
                if (that.status === PENDING) {
                    that.callbacks.push({
                        onResolved(value) {
                            handle(onResolved)
                        },
                        onRejected(reason) {
                            handle(onRejected)
                        }
                    })
                } else if (that.status === RESOLVED) {
                    setTimeout(() => {
                        handle(onResolved)
                    })
                } else {
                    setTimeout(() => {
                        //调用失败的回调函数 onRejected
                        handle(onRejected)
                    })
                }
            })
        }

        //Promise原型对象 catch ,参数为失败的回掉函数 onRejected
        //返回一个新的Promise对象
        catch(onRejected) {
            return this.then(undefined, onRejected)
        }

        // Promise函数对象的 resolve 方法
        //返回一个新的Promise对象,Promise.resolve()中可以传入Promise
        static  resolve = function (value) {
            return new Promise((resolve, reject) => {
                if (value instanceof Promise) {
                    value.then(resolve, reject)
                } else {
                    resolve(value)
                }
            })
        }

        // Promise函数对象的 reject 方法
        //返回一个新的Promise对象 Promise.reject中不能再传入Promise


        static  reject = function (reason) {
            return new Promise((resolve, reject) => {
                reject(reason)
            })
        }

        // Promise函数对象的 all 方法,接受一个promise类型的数组
        // 返回一个新的Promise对象
        static all = function (promises) {
            // 保证返回的值得结果的顺序和传进来的时候一致
            // 只有全部都成功长才返回成功
            const values = new Array(promises.length) // 指定数组的初始长度
            let successCount = 0
            return new Promise((resolve, reject) => {
                promises.forEach((p, index) => { // 由于p有可能不是一个Promise
                    Promise.resolve(p).then(
                        value => {
                            successCount++
                            values[index] = value
                            if (successCount === promises.length) {
                                resolve(values)
                            }
                        },
                        // 如果失败
                        reason => {
                            reject(reason)
                        })
                })
            })

        }

        // Promise函数对象的 race 方法,接受一个promise类型的数组
        // 返回一个新的Promise对象
        static race = function (promises) {
            return new Promise((resolve, reject) => {
                promises.forEach(p => {
                    Promise.resolve(p).then(
                        value => {
                            resolve(value)
                        }, reason => {
                            reject(reason)
                        })
                })
            })

        }
    }

    // 把Promise暴露出去
    window.Promise = Promise
})(window)