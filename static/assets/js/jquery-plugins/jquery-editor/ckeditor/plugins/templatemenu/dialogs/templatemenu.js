CKEDITOR.dialog.add('TemplateMenu', function(editor){
    return {
        title: editor.lang.dlgTitle,
        resizable: CKEDITOR.DIALOG_RESIZE_BOTH,
        minWidth: 300,
        minHeight: 80,
        contents: [{
            id: 'cb',
            label: 'Label',
            title: 'Title',
            expand: true,
            padding: 0,
            elements: [
                {
                    type: 'html',
                    html: '<p>第一个简单的插件!</p>'
                }
            ]
        }]
    };
});