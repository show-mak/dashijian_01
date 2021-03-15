
//window.onload 外部的文件和图片音频视频等 全部加载完毕再执行
$(window).on('load', function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 4 / 3,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    $('#files').hide()
    //点击上传按钮激活input上传文件事件
    let layer = layui.layer
    $('#btnChooseImage').on('click', function () {
        console.log(1);
        $('#files').click();
        //选择图片后 修改裁剪区域
        $('#files').on('change', function (e) {
            let file = e.target.files[0];
            if (file === undefined) {
                return layer.msg('请选择图片')

            }
            let newImgURL = URL.createObjectURL(file)
            let dataURL = $image
            $image
                .cropper('destroy')      // 销毁旧的裁剪区域
                .attr('src', newImgURL)  // 重新设置图片路径
                .cropper(options)        // 重新初始化裁剪区域

        })

    })
    // 修改头像
    let dataURL = '';
    $('#btnUpLoad').on('click', function () {
        dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')
        // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 发送ajax
        $.ajax({
            url: '/my/update/avatar',
            method: 'POST',
            data: { avatar: dataURL },
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                console.log(1);
                layer.msg('头像上传成功')
                window.parent.getUserInfo();

            }
        })
    })





})

// document.onDOMcontentLoaded 只要DOM树加载完毕就可以了,不一定要渲染到页面
// $(function(){

// })