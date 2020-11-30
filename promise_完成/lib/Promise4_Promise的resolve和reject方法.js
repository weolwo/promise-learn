/* 
自定义Promise函数模块: IIFE
*/
(function (window) {

  const PENDING = 'pending'
  const RESOLVED = 'resolved'
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
      self.status = RESOLVED
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
  返回promise的结果由onResolved/onRejected执行结果决定

  */
  Promise.prototype.then = function (onResolved, onRejected) {
    const self = this

    // 指定回调函数的默认值(必须是函数)
    onResolved = typeof onResolved==='function' ? onResolved : value => value
    onRejected = typeof onRejected==='function' ? onRejected : reason => {throw reason}


    // 返回一个新的promise
    return new Promise((resolve, reject) => {

      /* 
      执行指定的回调函数
      根据执行的结果改变return的promise的状态/数据
      */
      function handle(callback) {
        /* 
        返回promise的结果由onResolved/onRejected执行结果决定
        1. 抛出异常, 返回promise的结果为失败, reason为异常
        2. 返回的是promise, 返回promise的结果就是这个结果
        3. 返回的不是promise, 返回promise为成功, value就是返回值
        */
        try {
          const result = callback(self.data)
          if (result instanceof Promise) { // 2. 返回的是promise, 返回promise的结果就是这个结果
            /* 
            result.then(
              value => resolve(vlaue),
              reason => reject(reason)
            ) */
            result.then(resolve, reject)
          } else { // 3. 返回的不是promise, 返回promise为成功, value就是返回值
            resolve(result)
          }

        } catch (error) { // 1. 抛出异常, 返回promise的结果为失败, reason为异常
          reject(error)
        }
      }

      // 当前promise的状态是resolved
      if (self.status===RESOLVED) {
        // 立即异步执行成功的回调函数
        setTimeout(() => {
          handle(onResolved)
        })
      } else if (self.status===REJECTED) { // 当前promise的状态是rejected
        // 立即异步执行失败的回调函数
        setTimeout(() => {
          handle(onRejected)
        })
      } else { // 当前promise的状态是pending
        // 将成功和失败的回调函数保存callbacks容器中缓存起来
        self.callbacks.push({
          onResolved (value) {
            handle(onResolved)
          },
          onRejected (reason) {
            handle(onRejected)
          }
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
    // 返回一个成功/失败的promise
    return new Promise((resolve, reject) => {
      // value是promise
      if (value instanceof Promise) { // 使用value的结果作为promise的结果
        value.then(resolve, reject)
      } else { // value不是promise  => promise变为成功, 数据是value
        resolve(value)
      }
    })
  }

  /* 
  Promise函数对象的reject方法
  返回一个指定reason的失败的promise
  */
  Promise.reject = function (reason) {
    // 返回一个失败的promise
    return new Promise((resolve, reject) => {
      reject(reason)
    })
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