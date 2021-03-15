
//在jq中有一个方法 ajaxPrefilter 只要启动了$.ajax() 这个方法就会直接被激活

let baseURL = 'http://api-breakingnews-web.itheima.net';
$.ajaxPrefilter(function (options) {
    if (options.url === 'http://127.0.0.1:5500/index.html') {
        return
    }
    options.url = baseURL + options.url;

    //2.包含 /my/路径的请求,就要手动添加 Authorrization
    if (options.url.indexOf('/my/') != -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }

        //无论请求成功还是失败都会启动complete方法
        //登录拦截
        options.complete = function (res) {
            console.log(res.responseJSON);
            let obj = res.responseJSON;
            let timeId = null;
            if (obj.status == '1' && obj.message == '身份认证失败！') {
                //跳转到登录界面并且销毁token
                timeId = setInterval(function () {
                    location.href = '/login.html';
                }, 2)
                localStorage.removeItem('token');
            }
        }
    }
})