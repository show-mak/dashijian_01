
//在jq中有一个方法 ajaxPrefilter 只要启动了$.ajax() 这个方法就会直接被激活

let baseURL = 'http://api-breakingnews-web.itheima.net';
$.ajaxPrefilter(function (options) {
    options.url = baseURL + options.url;
})