$(function () {

    let layer = layui.layer
    let form = layui.form
    // 1初始化文章分类
    initCate();
    // 封装渲染函数
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            type: 'GET',
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    layer.msg(res.message)
                }
                //渲染
                let htmlStr = template('tpl-cate', { data: res.data })
                $('[name=cate_id]').html(htmlStr)
                form.render();
            }
        })
    }
    //初始化富文本编辑器
    initEditor()


    // 选择图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })
    //
    $('#coverFile').on('change', function (e) {
        let file = e.target.files[0];
        if (file === undefined) {
            return layer.msg('你可以选一张图片作为封面')
        }
        let newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    //参数状态处理    
    let state = '已发布';
    // $("#btnSave1").on('click', function () {
    //     status = '已提交'
    // })
    $("#btnSave2").on('click', function () {
        state = '草稿'
    })


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    // 发布文章
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        let fd = new FormData(this)
        fd.append('state', state)
        //将裁减后的图片更新为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                console.log(...fd);
                publishArticle(fd)
            });
    })




    //封装 添加文章的方法
    function publishArticle(fd) {
        $.ajax({
            url: '/my/article/add',
            type: 'POST',
            data: fd,
            processDate: false,
            contentTypr: false,
            success: (res) => {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // location.href = '/article/art_list.html';
                setTimeout(() => {
                    window.parent.document.querySelector('#changeA')
                }, 200);
            }
        })
    }
})