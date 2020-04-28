/* 
    1. 指定回调函数的方式更加灵活: 
      旧的: 必须在启动异步任务前指定
      promise: 启动异步任务 => 返回promie对象 => 给promise对象绑定回调函数(甚至可以在异步任务结束后指定)
*/
const p = new Promise((resolve, reject) => {
    console.log('执行 executor同步函数')
    let time = Date.now();
    setTimeout(() => {
        if (time % 2 === 0) {
            resolve(time)
        } else {
            reject(time)
        }
    }, 1000)

})

setTimeout(() => {
    p.then(value => {
        console.log('value', value)
    }, reason => {
        console.log('reason', reason)
    })
}, 3000)
/* 2. 支持链式调用, 可以解决回调地狱问题
    什么是回调地狱? 回调函数嵌套调用, 外部回调函数异步执行的结果是嵌套的回调函数执行的条件
    回调地狱的缺点?  不便于阅读 / 不便于异常处理
    解决方案? promise链式调用
    终极解决方案? async/await
  */

//1、查出当前用户信息
//2、按照当前用户的id查出他的课程
//3、按照当前课程id查出分数
// 回调地狱：
$.ajax({
    url: "./mock/user.json",
    success(data) {
        console.log("查询用户：", data);
        $.ajax({
            url: `./mock/user_corse_${data.id}.json`,
            success(data) {
                console.log("查询到课程：", data);
                $.ajax({
                    url: `./mock/corse_score_${data.id}.json`,
                    success(data) {
                        console.log("查询到分数：", data);
                    },
                    error(error) {
                        console.log("出现异常了：" + error);
                    }
                });
            },
            error(error) {
                console.log("出现异常了：" + error);
            }
        });
    },
    error(error) {
        console.log("出现异常了：" + error);
    }
});

// promise调用方式
function get(url, data) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            data: data,
            success: function (data) {
                resolve(data);
            },
            error: function (err) {
                reject(err)
            }
        })
    });
}

//调用封装后的方法
get("./mock/user.json")
    .then((data) => {
        console.log("用户查询成功~~~:", data)
        return get(`./mock/user_corse_${data.id}.json`);
    })
    .then((data) => {
        console.log("课程查询成功~~~:", data)
        return get(`./mock/corse_score_${data.id}.json`);
    })
    .then((data) => {
        console.log("课程成绩查询成功~~~:", data)
    })
    .catch((err) => {
        console.log("出现异常", err)
    });
// Promise操作明显更加符合我们人类的习惯，类似于流水线式的操作,对于异常的处理更加友好
// 测试代码在promise-test.html中