$(function () {
    getUserInof();

    //2.注销功能 
    let layer = layui.layer;
    // 1.弹出一个框给用户提示是否退出 如果点击了确定就销毁token
    $('#btnLogout').on('click', function (e) {
        //阻止页面跳转刷新
        e.preventDefault();
        layer.confirm('是否退出账号', function (index) {
            //do something
            //销毁token即当前账户信息
            localStorage.removeItem('token')
            //进行页面的跳转至登录界面
            location.href = '/login.html'
            layer.close(index);
        });
    })
})


//登录



function getUserInof() {
    $.ajax({
        url: '/my/userinfo',
        //请求头直接设置在baseAPI文件中
        // headers: {
        //     Authorization: localStorage.getItem("token") || ""
        // },
        success: (res) => {
            console.log(res);
            if (res.status == 1) {
                console.log(res.status == 1);
                return layui.layer.msg(res.message, { icon: 5 });

            }
            renderAvatar(res.data);
        }
    })
}


//渲染后台页面
function renderAvatar(user) {
    console.log(user);
    // 1.
    let name = user.nickname || user.username
    $('#welcome').html("welcome!!" + name);
    if (user.user_pic == null) {
        $('.layui-nav-img').hide();
        $('.text-avatar').html(name[0].toUpperCase());
    } else {
        $('.layui-nav-img').attr('src', user.user_pic);
        $('.text-avatar').hide();
    }
}



