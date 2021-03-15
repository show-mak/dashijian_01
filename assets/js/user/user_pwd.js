$(function () {
    // 定义密码规则
    let form = layui.form;
    form.verify({
        //密码
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        //新密码不能和原密码重复
        newPwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return "新密码不能和原密码重复"
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return "新密码和确认密码必须一致"
            }
        }
    })

    // 修改密码
    $('form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            url: '/my/updatepwd',
            type: 'POST',
            data: $(this).serialize(),
            success: (res) => {
                if (res.status != 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg('密码修改成功,重新登陆')
                $('.layui-form')[0].reset();
                location.href = '/login.html'
            }
        })
    })


})