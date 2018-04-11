'use strict';
( function() {
    CKEDITOR.plugins.add( 'templatemenu', { //extraPlugins name
        //templatemenu_loadDataListUrl
        //templatemenu_postDataUrl
        //templatemenu_removeDataUrl
        //templatemenu_ckCsrfTokenParameter
        //templatemenu_ckCsrfToken
//CKEDITOR.document.appendStyleSheet()
     //   CKEDITOR.scriptLoader.load()
        lang: 'cs,da,de,de-ch,el,en,eo,eu,fr,gl,hu,id,it,ko,ku,nb,nl,pl,pt-br,ru,sv,tr,ug,uk,zh,zh-cn', // %REMOVE_LINE_CORE%
        beforeInit:function (editor) {
            CKEDITOR.config.templatemenu_replaceContent=!0;
            editor.dataLoader=new dataLoader(editor);
        },
        init: function( editor ) {
            var pluginName = 'TemplateMenu';//toolbar name config
            var buttonData = {};
            var items =  {};
            buttonData.loadTemplateBtn=editor.lang.templatemenu.loadTemplateBtnInfo;
            buttonData.addTemplateBtn=editor.lang.templatemenu.addTemplateBtnInfo;
            buttonData.removeTemplateBtn=editor.lang.templatemenu.removeTemplateBtnInfo;
            var buttons=buttonData;
            // Build the list of menu items
            for(var key in buttons) {
                items[key] = {
                    label: buttons[key],
                    command: key,
                    group: 'TemplateMenuGroup',
                    order: 1,
                    icon: CKEDITOR.getUrl(this.path + 'icons/templatemenu.png')
                }
            }
            editor.addMenuGroup( 'TemplateMenuGroup');
            editor.addMenuItems( items );

            editor.ui.add(pluginName,CKEDITOR.UI_MENUBUTTON,{
                label: editor.lang.templatemenu.pluginName,
                icon: this.path + 'icons/templatemenu.png' ,
                modes: {
                    wysiwyg: 1
                },
                onMenu: function() {
                    var active = {};
                    // Make all items active.
                    for ( var p in items )
                        active[ p ] = CKEDITOR.TRISTATE_OFF;

                    return active;
                }
            });
            editor.addCommand('addTemplateBtn', new CKEDITOR.dialogCommand('addTemplateBtn'));
            editor.addCommand('removeTemplateBtn', new CKEDITOR.dialogCommand('removeTemplateBtn'));
            editor.addCommand('loadTemplateBtn', new CKEDITOR.dialogCommand('loadTemplateBtn'));
            CKEDITOR.dialog.add('addTemplateBtn', this.path + 'dialogs/addTemplateBtn.js');
            CKEDITOR.dialog.add('removeTemplateBtn', this.path + 'dialogs/removeTemplateBtn.js');
            CKEDITOR.dialog.add('loadTemplateBtn', this.path + 'dialogs/loadTemplateBtn.js');


        },
    } );
    function dataLoader( editor ) {
        this.editor = editor;
        this.path=CKEDITOR.getUrl(CKEDITOR.plugins.getPath('templatemenu'));
        this._init();
    }

    dataLoader.prototype={
        _init:function () {
            this.options = {
                loadDataListUrl:this.path+'./example/data.json',
                postDataUrl:this.path+'./example/post.php',
                removeDataUrl:this.path+'./example/remove.php',
                postHead:"contentType='application/x-www-form-urlencoded; charset=UTF-8'",
                ckCsrfTokenParameter:'ckCsrfToken',
                ckCsrfToken:CKEDITOR.tools.getCsrfToken(),
                selectList:[],
                content:[],
                formatHandler:function (data) {
                    return data;
                }
            };

            if( this.editor.config.templatemenu_loadDataListUrl){
                this.options.loadDataListUrl= this.editor.config.templatemenu_loadDataListUrl;
            }
            if( this.editor.config.templatemenu_postDataUrl){
                this.options.postDataUrl= this.editor.config.templatemenu_postDataUrl;
            }
            if( this.editor.config.templatemenu_removeDataUrl){
                this.options.removeDataUrl= this.editor.config.templatemenu_removeDataUrl;
            }
            if( this.editor.config.templatemenu_ckCsrfTokenParameter){
                this.options.ckCsrfTokenParameter= this.editor.config.templatemenu_ckCsrfTokenParameter;
            }
            if( this.editor.config.templatemenu_ckCsrfToken){
                this.options.ckCsrfToken= this.editor.config.templatemenu_ckCsrfToken;
            }
            this.loadData()
        },
        loadData:function () {
            var that    = this;
            $.ajax({
                url:this.options.loadDataListUrl,
                dataType:"JSON",
                beforeSend: function(request) {
                    request.setRequestHeader(that.options.ckCsrfTokenParameter,that.options.ckCsrfToken);
                },
                success:function (g) {
                    var data=g;
                    if((data.total!=undefined || data.rows!=undefined) && data.total>0 ){
                        that.options.selectList=[];
                        for(var i=0;i<data.total;i++){
                            if(data.rows[i]!=undefined){
                                if(data.rows[i].id!=undefined && data.rows[i].name!=undefined && data.rows[i].content!=undefined){
                                    that.options.selectList[i]=[data.rows[i].id,data.rows[i].name,data.rows[i].content];
                                    that.options.content[i]=data.rows[i].content;
                                }
                            }
                        }
                    }
                },error:function () {

                }
            })

        },
        getContent:function (i) {
            return this.options.content[i] || "";
        },
        getSelectList:function () {
            return this.options.selectList;
        },
        saveTemplate:function (name,content ) {
            var that=this;
            $.ajax({
                url:this.options.postDataUrl,
                dataType:"JSON",
                data:{name:name,content:content},
                type:"POST",
                beforeSend: function(request) {
                    request.setRequestHeader(that.options.ckCsrfTokenParameter,that.options.ckCsrfToken);
                },
                success:function (g) {
                    if(g.status=="SUCCESS"){
                        that.loadData();
                    }
                 //   console.info(g);
                },error:function (e) {
                  //  console.info(e);
                }
            })
        },
        removeTemplate:function(i){
            var that=this;
            var id=this.options.selectList[i][0];
            if(id!=undefined){
                $.ajax({
                    url:this.options.removeDataUrl,
                    dataType:"JSON",
                    data:{sid:id},
                    type:"POST",
                    beforeSend: function(request) {
                        request.setRequestHeader(that.options.ckCsrfTokenParameter,that.options.ckCsrfToken);
                    },
                    success:function (g) {
                        if(g.status=="SUCCESS"){
                            that.loadData();
                        }
                      //console.info(g);
                    },error:function (e) {
                     // console.info(e);
                    }
                })

            }
        }
    }


} )();