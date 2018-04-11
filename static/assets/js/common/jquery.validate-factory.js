/**
 * Created by JiXu on 2016-07-07.
 */
define(function (require, exports, module) {
    require('jquery.validate.min');
    require("jquery.validate.additional.methods");
    $.validator.addMethod("phoneZHCN",function(value,element,params) {
        var isValid=false;

        //China
        isValid = (/^((00|\+)?(86(?:-| )))?((\d{11})|(\d{3}[- ]{1}\d{4}[- ]{1}\d{4})|((\d{2,4}[- ]){1}(\d{7,8}|(\d{3,4}[- ]{1}\d{4}))([- ]{1}\d{1,4})?))$/).test(value);
        if(isValid)return true;

        return false;
    },'Please enter a valid phone number.');
    if(app.locale=='zh-CN'){
        require("jquery.validate-zh-CN");
        $.extend($.validator.messages, {
            phoneZHCN:"请输入一个有效的电话号码",
        });
    }
    $.extend($.validator.prototype,{
        
        addItem:function (settings) {
            var item = this.query($(settings.element));
            if (item) {
                settings.element=undefined;
                $(item).rules('add',settings)
            }
        },
        query: function (selector) {
            return this.findItemBySelector($(this.currentForm ).find(selector));
        },
        findItemBySelector:function (target) {
            var array=$( this.currentForm )
                .find( "input, select, textarea" )
                .not( ":submit, :reset, :image, :disabled" )
                .not( this.settings.ignore );
            var ret;
            $.each(array, function (i, item) {

                if (target.get(0) === item) {
                    ret = item;
                    return false;
                }
            });
            return ret;
        },
        addRule:function (name,method,message) {
            $.validator.addMethod(name,method,message)
        },
        showErrors:function(errors) {
            if ( errors ) {
                var validator = this;

                // Add items to error list and map
                $.extend( this.errorMap, errors );
                this.errorList = $.map( this.errorMap, function( message, name ) {
                    return {
                        message: message,
                        element: validator.findByName( name )[ 0 ]
                    };
                } );

                // Remove items from success list
                this.successList = $.grep( this.successList, function( element ) {
                    return !( element.name in errors );
                } );
            }
            if ( this.settings.showErrors ) {
                this.settings.showErrors.call( this, this.errorMap, this.errorList );
            } else {

                if(this.errorList.length && $.growl){
                    $.growl.error({duration: 1000,close:"",title:"",message:this.errorList[0].message,location:'ct'});
                }else{
                    this.defaultShowErrors();
                }
            }
        }
    });


    var defaultSetting={
        errorClass: "zfou-error",
        validClass: "zfou-danger",
        errorElement: "div",
        onkeyup:false,
        onclick:false,
        onfocusout:false,
    };
    exports.validate=function (settings) {
        settings=$.extend(defaultSetting,settings);
        return $(settings.element).validate(settings)
    };

    exports.addItem=function (settings) {
        $.validator.addItem(settings)
    }


});