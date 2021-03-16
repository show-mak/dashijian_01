$(function () {
    //时间过滤器
    template.defaults.imports.dataFormat = function (dtStr) {
        const dt = new Date(dtStr);
        let y = dt.getFullYear();
        // console.log(y);
        let m = padZero(dt.getMonth() + 1);
        // console.log(m);
        let d = padZero(dt.getDate());
        // console.log(d);

        let hh = padZero(dt.getHours());
        let mm = padZero(dt.getMinutes());
        let ss = padZero(dt.getSeconds());

        return (`${y}-${m}-${d} ${hh}:${mm}:${ss}`)
    }
    // 时间函数补零

    function padZero(num) {
        let nums = '';
        if (num > 9) {
            return num
        } else {
            nums = '0' + num;
            return nums
        }
    }


    //定义查询参数
    let p = {
        pagenum: 1, //是	int	页码值
        pagesize: 1,//是	int	每页显示多少条数据
        cate_id: '',//否	string	文章分类的 Id
        state: '',//否	string	文章的状态，可选值有：已发布、草稿
    }
    let layer = layui.layer
    let form = layui.form
    initTable();
    // 封装渲染函数
    function initTable() {
        $.ajax({
            url: '/my/article/list',
            type: 'GET',
            data: p,
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    layer.msg(res.message)
                }
                let htmlStr = template('tpl-table', { data: res.data });
                $('tbody').html(htmlStr);
                //分页
                renderpage(res.total)
            }
        })
    }


    // 3初始化文章分类
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

    //4 文章列表筛选
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取
        let cate_id = $('[name=cate_id]').val();
        p.cate_id = cate_id;
        let state = $('[name=state]').val();
        p.state = state;
        initTable();
    })


    // 5分页
    let laypage = layui.laypage;
    function renderpage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: p.pagesize,
            curr: p.pagenum,
            //分页的自定义排版
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip', 'refresh'],
            limits: [1, 2, 3, 4, 5],
            // 切换分页方法
            jump: function (obj, frist) {
                // console.log(obj);
                // console.log(frist);
                if (!frist) {
                    // 当前切换的按钮页码之赋值给p中的pagenum
                    p.pagenum = obj.curr;
                    //每页显示多少条数 进行重新赋值
                    p.pagesize = obj.limit
                    initTable();
                }
            }
        });
    }


    // 6.按钮删除
    $('tbody').on('click', '.btn-delete', function () {
        // 获取ID保存至变量中
        let Id = $(this).attr('data-id');
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                url: '/my/article/delete/' + Id,
                type: 'GET',
                success: (res) => {
                    console.log(res);
                    if (res.status != 0) {
                        return layer.msg(res.message)
                    }
                    //BUG最后一页删除数据不会跳转至上一页
                    // 最后一页的当前页码必须大于1 再点击删除时 判断是否只剩下一个数据 ture就直接跳转至上一页
                    if ($('.btn-delete').length === 1 && p.pagenum > 1) p.pagenum--;
                    //重新刷新列表渲染数据
                    initTable();
                    layer.closeAll();; //关闭所有弹出框
                    layer.msg('恭喜,删除成功')
                }
            })
        })


    })

})