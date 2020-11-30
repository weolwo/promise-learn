//声明构造函数
function Promise(executor){
    //resolve 函数
    function resolve(data){

    }
    //reject 函数
    function reject(data){

    }

    //同步调用『执行器函数』
    executor(resolve, reject);
}

//添加 then 方法
Promise.prototype.then = function(onResolved, onRejected){

}