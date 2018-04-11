CKEDITOR.dialog.add('loadTemplateBtn', function(editor){
    return {
        title: editor.lang.templatemenu.loadTemplateTitle,
        resizable: CKEDITOR.DIALOG_RESIZE_BOTH,
        minWidth: 300,
        minHeight: 80,
        buttons: [
            CKEDITOR.dialog.okButton,
            CKEDITOR.dialog.cancelButton
        ],
        contents: [{
            id: 'load_lab_template',
            label: 'load_lab_template',
            title: 'load_lab_template',
            elements: [{
                type: 'select',
                // label:editor.lang.templatemenu.addTemplateLebelTitle,
                items: [],
                id: 'templatemenuName',
                name:'templatemenuName',
                required: true,
                onChange: function( api ) {
                    // alert( 'Current value: ' + this.getValue() );
                },
                validate: function(api) {
                    if ( !this.getValue() ) {
                        alert(editor.lang.templatemenu.selectNoTemplateWarning)
                        this.focus();
                        return false;
                    }
                }
            },{
                id: "chkInsertOpt",
                type: "checkbox",
                label: editor.lang.templatemenu.insertOption,
                "default": editor.config.templatemenu_replaceContent
            }]
        }],
        onOk: function(){
           var id = this.getValueOf('load_lab_template', 'templatemenuName'),
            check=this.getValueOf('load_lab_template', 'chkInsertOpt'),
            content=editor.dataLoader.getContent(id);

            if(check){
                editor.setData(content);
            }else{
                editor.setData(editor.getData()+content);
            }
            editor.focus();
        },
        onShow: function(){
            var data=editor.dataLoader.getSelectList();
            this.getContentElement( 'load_lab_template', 'templatemenuName' ).clear();
            if(data.length>0){
                for(var i=0;i<data.length;i++){
                    this.getContentElement( 'load_lab_template', 'templatemenuName' ).add(data[i][1],i)
                }
            }
        },

    };
});