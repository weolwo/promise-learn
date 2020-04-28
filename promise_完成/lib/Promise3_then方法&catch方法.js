/* 
自定义Promise函数模块: IIFE
*/
(function (window) {

  const PENDING = 'pending'
  const RESOLVED = 'resovled'
  const REJECTED = 'rejected'
  
  /* 
  Promise构造函数
  excutor: 执行器函数(同步执行)
  */
  function Promise(excutor) {
    // 将当前promise对象保存起来
    const self = this
    self.status = PENDING // 给promise对象指定status属性, 初始值为pending
    self.data = undefined // 给promise对象指定一个用于存储结果数据的属性
    self.callbacks = [] // 每个元素的结构: { onResolved() {}, onRejected() {}}

    function resolve (value) {
      // 如果当前状态不是pending, 直接结束
      if (self.status!==PENDING) {
        return
      }

      // 将状态改为resolved
      self.status = 'resolved'
      // 保存value数据
      self.data = value
      // 如果有待执行callback函数, 立即异步执行回调函数onResolved
      if (self.callbacks.length>0) {
        setTimeout(() => { // 放入队列中执行所有成功的回调
          self.callbacks.forEach(calbacksObj => {
            calbacksObj.onResolved(value)
          }) 
        });
      }

    }

    function reject (reason) {
      // 如果当前状态不是pending, 直接结束
      if (self.status!==PENDING) {
        return
      }

      // 将状态改为rejected
      self.status = REJECTED
      // 保存value数据
      self.data = reason
      // 如果有待执行callback函数, 立即异步执行回调函数onRejected
      if (self.callbacks.length>0) {
        setTimeout(() => { // 放入队列中执行所有成功的回调
          self.callbacks.forEach(calbacksObj => {
            calbacksObj.onRejected(reason)
          }) 
        });
      }
    }
    
    // 立即同步执行excutor
    try {
      excutor(resolve, reject)
    } catch (error) { // 如果执行器抛出异常, promise对象变为rejected状态
      reject(error)
    }
    
  }

  /* 
  Promise原型对象的then()
  指定成功和失败的回调函数
  返回一个新的promise对象
  */
  Promise.prototype.then = function (onResolved, onRejected) {

    onResolved = typeof onResolved==='function' ? onResolved : value => value // 向后传递成功的value
    // 指定默认的失败的回调(实现错误/异常传透的关键点)
    onRejected = typeof onRejected==='function' ? onRejected : reason => {throw reason} // 抽后传递失败的reason

    const self = this

    // 返回一个新的proimise对象
    return new Promise((resolve, reject) => {

      /* 
      调用指定回调函数处理, 根据执行结果, 改变return的promise的状态
      */
      function handle(callback) {
        /* 
          1. 如果抛出异常, return的promise就会失败, reason就是error
          2. 如果回调函数返回不是promise, return的promise就会成功, value就是返回的值
          3. 如果回调函数返回是promise, return的promise结果就是这个promise的结果      
           */
          try {
            const result = callback(self.data)
            // 3. 如果回调函数返回是promise, return的promise结果就是这个promise的结果
            if (result instanceof Promise) {
              result.then(
                value => resolve(value), // 当result成功时, 让 return的promise也成功
                reason => reject(reason) // 当result失败时, 让 return的promise也失败
              )
              // result.then(resolve, reject)
            } else {
              // 3. 如果回调函数返回不是promise, return的promise就会成功, value就是返回的值
              resolve(result)
            }

          } catch (error) {
            // 1. 如果抛出异常, return的promise就会失败, reason就是error
            reject(error)
          }
      }

      // 当前状态还是pending状态, 将回调函数保存起来
      if (self.status===PENDING) {
        self.callbacks.push({
          onResolved (value) {
            handle(onResolved)
          },
          onRejected (reason){
            handle(onRejected)
          }
        })
      } else if (self.status===RESOLVED) { // 如果当前是resolved状态, 异步执行onResolved并改变return的promise状态
        setTimeout(() => {
          handle(onResolved)
        })
      } else { // 如果当前是rejected状态, 异步执行onRejected并改变return的promise状态
        setTimeout(() => {
          handle(onRejected)
        })
      }
    })
  }
/* 
  function fn(event) {
    
  }
  div.onclick = function (event){
    fn(event)
  }
  div.onclick = fn
 */
  /* 
  Promise原型对象的catch()
  指定失败的回调函数
  返回一个新的promise对象
  */
  Promise.prototype.catch = function (onRejected) {
    return this.then(undefined, onRejected)
  }

  /* 
  Promise函数对象的resolve方法
  返回一个指定结果的成功的promise
  */
  Promise.resolve = function (value) {
    
  }

  /* 
  Promise函数对象的reject方法
  返回一个指定reason的失败的promise
  */
  Promise.reject = function (reason) {
      
  }

  /* 
  Promise函数对象的all方法
  返回一个promise, 只有当所有proimse都成功时才成功, 否则只要有一个失败的就失败
  */
  Promise.all = function (promises) {
      
  }

  /* 
  Promise函数对象的race方法
  返回一个promise, 其结果由第一个完成的promise决定
  */
  Promise.race = function (promises) {
        
  }

  // 向外暴露Promise函数
  window.Promise = Promise
})(window)