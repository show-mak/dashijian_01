$(function () {
    //1 校验用户昵称栏的规则定义
    let form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.trim().length < 1 || value.trim().length > 6) {
                return "用户昵称必须在1-6位之间"
            }
        }
    })

    // 展示用户信息 封装函数
    initUserInfo();
    let layer = layui.layer;
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 成功后渲染
                form.val("formTest", res.data)
            }
        })
    }

    //3.重置按钮
    $('#btnReset').on('click', function (e) {
        // 组织页面跳转
        e.preventDefault();
        // 调用展示用户信息函数进行渲染
        initUserInfo();
    })


    // 4.修改用户信息
    $('form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/userinfo',
            method: 'POST',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // 成功后弹出提示
                layer.msg('用户信息修改成功')
                // 注意此处的window是user_info.html
                // window.parent可以找到上一级html的window 也可以使用其中的方法
                window.parent.getUserInfo()
            }
        })
    })
})