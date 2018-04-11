CKEDITOR.dialog.add('removeTemplateBtn', function(editor){
    return {
        title: editor.lang.templatemenu.removeTemplateTitle,
        resizable: CKEDITOR.DIALOG_RESIZE_BOTH,
        minWidth: 300,
        minHeight: 80,
        buttons: [
            CKEDITOR.dialog.okButton,
            CKEDITOR.dialog.cancelButton
        ],
        contents: [{
            id: 'remove_lab_template',
            label: 'remove_lab_template',
            title: 'remove_lab_template',
            elements: [{
                type: 'select',
                label:editor.lang.templatemenu.removeTemplateLebelTitle,
                items: [],
                id: 'templatemenuName',
                name:'templatemenuName',
                required: true,
                onChange: function( api ) {
                    // alert( 'Current value: ' + this.getValue() );
                },
                validate: function(api) {
                    if ( !this.getValue() ) {
                        alert(editor.lang.templatemenu.selectNoTemplateWarning);
                        this.focus();
                        return false;
                    }
                }
            }]
        }],
        onOk: function(){
            var id = this.getValueOf('remove_lab_template', 'templatemenuName');
            editor.dataLoader.removeTemplate(id)
        },
        onShow: function(){
            var data=editor.dataLoader.getSelectList();
            this.getContentElement( 'remove_lab_template', 'templatemenuName' ).clear()
            if(data.length>0){
                for(var i=0;i<data.length;i++){
                    this.getContentElement( 'remove_lab_template', 'templatemenuName' ).add(data[i][1],i)
                }
            }
        },
    };
});