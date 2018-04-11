CKEDITOR.dialog.add('addTemplateBtn', function(editor){
    return {
        title: editor.lang.templatemenu.addTemplateBtnInfo,
        resizable: CKEDITOR.DIALOG_RESIZE_BOTH,
        minWidth: 300,
        minHeight: 80,
        buttons: [
            CKEDITOR.dialog.okButton,
            CKEDITOR.dialog.cancelButton
        ],
        contents: [{
            id: 'add_lab_template',
            label: 'add_lab_template',
            title: 'add_lab_template',
            elements: [{
                type: 'text',
                label:editor.lang.templatemenu.addTemplateLebelTitle,
                id: 'templatemenuName',
                name:'templatemenuName',
                placeholder:'name',
                validate: function(api) {
                    if ( !this.getValue() ) {
                        alert(editor.lang.templatemenu.addTemplateLebelTitle);
                        this.focus();
                        return false;
                    }
                }
            }]
        }],
        onOk: function(){

            var name = this.getValueOf('add_lab_template', 'templatemenuName'),
                content=editor.getData();
                editor.dataLoader.saveTemplate(name,content);

        },
    };
});