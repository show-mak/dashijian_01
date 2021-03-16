$(function () {
    // 1.渲染文章分类列表(后面还要反复调用) 封装函数
    initArtCateList()


    //点击 "+添加类别" 按钮进行弹框
    let layer = layui.layer;
    $('#btnAdd').on('click', function () {
        layer.open({
            type: 1,
            title: ['添加文章分类', 'font-size:18px;'],
            area: ['500px', '250px'],
            skin: 'demo-class',
            offset: 'auto',
            shade: 0.3,
            content: $('#dialog-add').html(),
        });
    })
    //事件代理完成 添加文章分类
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        // 发送ajax
        $.ajax({
            url: '/my/article/addcates',
            method: 'POST',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                //清空form表单内容
                $('#form-add')[0].reset();
                //重新刷新列表渲染数据
                initArtCateList();
                //关闭弹出框
                // layer.close(indexAdd);
                layer.closeAll(); //关闭所有信息框
            }
        })
    })

    //编辑文章分类(事件代理)
    $('tbody').on('click', '.btn-edit', function () {
        //编辑弹出框
        layer.open({
            type: 1,
            title: ['修改文章分类', 'font-size:18px;'],
            area: ['500px', '250px'],
            skin: 'demo-class',
            offset: 'auto',
            shade: 0.3,
            content: $('#dialog-edit').html(),
        });

        //发送ajax 将已有数据的渲染到form表单中
        let form = layui.form;
        // 获取ID保存至变量中
        let Id = $(this).attr('data-id');
        $.ajax({
            url: '/my/article/cates/' + Id,
            type: 'GET',
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                form.val('form-edit', res.data)
            }
        })
    })
    // 修改提交
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/article/updatecate',
            type: 'POST',
            data: $(this).serialize(),
            success: (res) => {
                if (res.ststus != 0) {
                    return layer.msg(res.message)
                }


                //重新刷新列表渲染数据
                initArtCateList();
                layer.msg("修改数据成功");
                //关闭所有弹出框
                layer.closeAll();
            }
        })
    })


    // 删除
    $('tbody').on('click', '.btn-delete', function () {
        // 获取ID保存至变量中
        let Id = $(this).attr('data-id');
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                url: '/my/article/deletecate/' + Id,
                type: 'GET',
                success: (res) => {
                    console.log(res);
                    if (res.status != 0) {
                        return layer.msg(res.message)
                    }
                    layer.close(index);; //关闭所有弹出框
                    //重新刷新列表渲染数据
                    initArtCateList();
                    layer.msg('恭喜,删除成功')
                }
            })
        });

    })
})




//利用模板引擎渲染页面的函数封装
function initArtCateList() {
    $.ajax({
        url: '/my/article/cates',
        method: 'GET',
        success: (res) => {
            // console.log(res);
            if (res.status != 0) {
                return layer.msg(res.message)
            }
            //获取不用弹窗,直接渲染 
            //传递的是对象,遍历对象上面的属性
            let htmlStr = template("tpl-art-cate", { data: res.data })
            $('tbody').html(htmlStr)
        }
    })
}