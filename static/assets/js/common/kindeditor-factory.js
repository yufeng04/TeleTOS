define(function(require, exports, module) {

    var KindEditor=require('kindeditor');

    //KindEditor.lang({insertblank: '插入填空项'});

    var simpleNoImageItems = ['source','|','bold', 'italic', 'underline', 'forecolor', '|', 'insertorderedlist', 'insertunorderedlist', '|', 'link', 'unlink', '|', 'removeformat', 'source'];

    var simpleItems = ['source','|','bold', 'italic', 'underline', 'forecolor', '|', 'insertorderedlist', 'insertunorderedlist', '|', 'link', 'unlink', 'image', '|', 'removeformat', 'source'];

    var standardItems = [
        'source','|','bold', 'italic', 'underline', 'strikethrough', 'removeformat', '|',
        'undo','redo','print','template','|', 'cut','copy','paste','plainpaste','wordpaste','|','subscript','superscript','quickformat','selectall','|','lineheight','emoticons','baidumap','pagebreak','anchor','link',
        'fontsize', 'forecolor', 'hilitecolor',   '|', 
        'link', 'unlink', '|',
        'image', 'flash',  'code',  '|',
        'insertorderedlist', 'insertunorderedlist','indent', 'outdent', '|',
        'justifyleft', 'justifycenter', 'justifyright', '|',
        'source',  'fullscreen', 'about'
    ];

    var nofileItems = [
        'source','|','bold', 'italic', 'underline', 'strikethrough', '|',
        'undo','redo','print','template','|', 'cut','copy','paste','plainpaste','wordpaste','|','subscript','superscript','quickformat','selectall','|','lineheight','emoticons','baidumap','pagebreak','anchor','link',
        'link', 'unlink', '|',
        'insertorderedlist', 'insertunorderedlist','indent', 'outdent', '|',
         'code', 'table', 'hr', '/',
        'formatblock', 'fontname', 'fontsize', '|',
        'forecolor', 'hilitecolor',   '|',
        'justifyleft', 'justifycenter', 'justifyright', 'justifyfull',  '|',
        'removeformat', 'clearhtml', '|',
         'preview',  'fullscreen', '|',
        'about'
    ];


    var fullItems = [
        'source','|','bold', 'italic', 'underline', 'strikethrough', '|',
        'undo','redo','print','template','|', 'cut','copy','paste','plainpaste','wordpaste','|','subscript','superscript','quickformat','selectall','|','lineheight','emoticons','baidumap','pagebreak','anchor','link',
        'link', 'unlink', '|',
        'insertorderedlist', 'insertunorderedlist','indent', 'outdent', '|',
         'image', 'flash', 'insertfile', 'code', 'table', 'hr', '/',
        'formatblock', 'fontname', 'fontsize', '|',
        'forecolor', 'hilitecolor',   '|', 
        'justifyleft', 'justifycenter', 'justifyright', 'justifyfull',  '|',
        'removeformat', 'clearhtml', '|',
         'preview',  'fullscreen', '|',
        'about'
    ];

    var  noneItems=[];

    var questionItems = ['source','|','bold', 'italic', 'underline', 'forecolor', '|', 'insertorderedlist', 'insertunorderedlist', '|', 'link', 'unlink', '|', 'removeformat', '|', 'insertblank'];

    var contentCss = [];
    contentCss.push('body {font-size: 14px; line-height: 1.428571429;color: #333333;}');
    contentCss.push('a {color: #428bca;}');
    contentCss.push('p {margin: 0 0 10px;}');
    contentCss.push('img {max-width: 100%;}');
    contentCss.push('p {font-size:14px;}');

    var defaultConfig = {
        width: '100%',
        resizeType: 1,
        uploadJson: app.config.editor_upload_path,
        extraFileUploadParams: {},
        filePostName: 'file',
        cssData: contentCss.join('\n'),
        langType : 'en'
    };

    var configs = {};
    configs.default=$.extend({}, defaultConfig, {});
    configs.simple_noimage = $.extend({}, defaultConfig, {items:simpleNoImageItems});
    configs.simple = $.extend({}, defaultConfig, {items:simpleItems});
    configs.standard = $.extend({}, defaultConfig, {items:standardItems});
    configs.full = $.extend({}, defaultConfig, {items:fullItems});
    configs.question = $.extend({}, defaultConfig, {items:questionItems});
    configs.none = $.extend({}, defaultConfig, {items:noneItems});
    configs.nofile = $.extend({}, defaultConfig, {items:nofileItems});

    function getConfig(name, extendConfig) {
        if (!extendConfig) {
            extendConfig = {};
        }
        return $.extend({}, configs[name], extendConfig);
    }

    exports.create = function(select, name, config) {
        return KindEditor.create(select, getConfig(name, config));
    };
    exports.sync=function (select) {
        return KindEditor.sync(select);
    };
    exports.html=function (select, val) {
        return KindEditor.html(select, val);
    };
    exports.clickToolbar=function (name,fn) {
       return this.clickToolbar(name, fn);
    }
  
    
});