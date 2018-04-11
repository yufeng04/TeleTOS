/**
 * Created by JiXu on 2016-07-12.
 */
define(function (require, exports, module) {
    require('ckeditor');
    var configs = {};
    var toolbar_Simple=[
        ['Source','-','Bold','Italic','Underline','Strike','-','Subscript','Superscript'],
        ['Link','Unlink'],['Smiley','Image']
    ];


    var toolbar_Default= [
        ['Source','-','NewPage','Preview','Save','-','TemplateMenu'],
        ['Cut','Copy','Paste','PasteText','PasteFromWord','-', 'SpellChecker', 'Scayt'],
        ['Undo','Redo','-','Find','Replace','-','SelectAll','RemoveFormat'],
        ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'HiddenField'],
        '/',
        ['Bold','Italic','Underline','Strike','-','Subscript','Superscript'],
        ['NumberedList','BulletedList','-','Outdent','Indent','Blockquote'],
        ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
        ['Link','Unlink','Anchor'],
        ['Table','HorizontalRule','Smiley','SpecialChar','PageBreak'],
        '/',
        ['Styles','Format','Font','FontSize'],
        ['TextColor','BGColor'],
        ['Maximize', 'ShowBlocks']
    ];


    var toolbar_Full =
        [
            ['Source','-','NewPage','Preview','Save','-','TemplateMenu'],
            ['Cut','Copy','Paste','PasteText','PasteFromWord','-', 'SpellChecker', 'Scayt'],
            ['Undo','Redo','-','Find','Replace','-','SelectAll','RemoveFormat'],
            ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'HiddenField'],
            '/',
            ['Bold','Italic','Underline','Strike','-','Subscript','Superscript'],
            ['NumberedList','BulletedList','-','Outdent','Indent','Blockquote'],
            ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
            ['Link','Unlink','Anchor'],
            ['Image','Flash','Embed','Table','HorizontalRule','Smiley','SpecialChar','PageBreak'],
            '/',
            ['Styles','Format','Font','FontSize'],
            ['TextColor','BGColor'],
            ['Maximize', 'ShowBlocks','-']
        ];
    var default_config={
        // toolbar:toolbar_Default,
        font_names: "Open Sans/Open Sans;Arial/Arial, Helvetica, sans-serif;Comic Sans MS/Comic Sans MS, cursive;Courier New/Courier New, Courier, monospace;Georgia/Georgia, serif;Lucida Sans Unicode/Lucida Sans Unicode, Lucida Grande, sans-serif;Tahoma/Tahoma, Geneva, sans-serif;Times New Roman/Times New Roman, Times, serif;Trebuchet MS/Trebuchet MS, Helvetica, sans-serif;Verdana/Verdana, Geneva, sans-serif",
        font_defaultLabel :'Open Sans',
        language : 'en',
        filebrowserFlashUploadUrl :app.config.ckeditor_upload_path+'?dir=flash',
        filebrowserImageUploadUrl:app.config.ckeditor_upload_path+'?dir=image',
        filebrowserUploadUrl: app.config.ckeditor_upload_path+'?dir=file',
        extraPlugins : 'widget,uploadwidget,uploadimage,notificationaggregator,notification,embed,embedbase,filetools,templatemenu',
    }
    configs.full=$.extend({},default_config,{toolbar:toolbar_Full});
    configs.default=$.extend({},default_config,{toolbar:toolbar_Default});
    configs.simple=$.extend({},default_config,{toolbar:toolbar_Simple});
    function getConfig(name, extendConfig) {
        if (!extendConfig) {
            extendConfig = {};
        }
        return $.extend({}, configs[name], extendConfig);
    }

    exports.replace=function (select,configname,extendConfig) {
        var editor=CKEDITOR.replace(select,getConfig(configname, extendConfig))
        CKEDITOR.tools.setCookie( '_csrf_token', app.csrf_token );
        return editor;
    };
    exports.updateElement=function (select) {
        CKEDITOR.instances[select].updateElement();
    };
    exports.getData=function (select) {
        return CKEDITOR.instances[select].getData();
    };
    exports.setData=function(select,data){
        return CKEDITOR.instances[select].setData(data);
    };
    exports.callFunction=function (a,b,c) {
        return CKEDITOR.tools.callFunction(a,b,c)
    };
    exports.instance=function (select) {
        return CKEDITOR.instances[select];

    };

});