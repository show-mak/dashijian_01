$(function () {
    // 点击a连接,显示注册界面的盒子
    $('#link-reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    $('#link-login').on('click', function () {
        $('.reg-box').hide();
        $('.login-box').show();
    })


    //自定义验证规则
    let form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        //自定义注册栏密码校验规则
        repwd: function (value, item) {
            //重复密码里面的值
            console.log(value);
            let pwd = $('.reg-box input[name=password]').val();
            if (value != pwd) {
                return "两次密码输入不一致"
            }
        }
    })


    // 需求3 注册功能
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        console.log(1);
        $.ajax({
            url: '/api/reguser',
            type: 'POST',
            data: {
                username: $('.reg-box input[name=username]').val(),
                password: $('.reg-box input[name=password]').val(),
            },
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    layer.ready(function () {
                        layer.msg('舒服舒服,kimodi,再来一次吧');
                    });
                }
                layer.ready(function () {
                    layer.msg('好大!好强!好喜欢!');
                });
                // 切换回登录表单
                $('#link-login').click();
                //重置当前的form表单
                $('#form_reg')[0].reset();
            }
        })
    })


    // 需求4 用户登录
    $("#form_login").on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            type: 'POST',
            data: $(this).serialize(),
            success: (res) => {
                if (res.status != 0) {
                    layer.ready(function () {
                        layer.msg('客官,掏钱才能进哦!哦!哦!');
                    });
                }
                layer.ready(function () {
                    layer.msg('客观!欢迎光临');

                });
                // 跳转页面
                location.href = '/index.html';
                localStorage.setItem('token', res.token);
            }
        })




    })
})