/**
 * Created by JiXu on 2016-07-07.
 */
define(function (require, exports, module) {
    require('bootstrap.validate');
    require('bootstrap.validate-zh-CN');
    //bootstrapValidator 增加addItem 方法
    $.extend($.fn.bootstrapValidator.DEFAULT_OPTIONS,{
        autoSubmit: true,
        onFormValidated:function (e) {
            return true;
        }
    });
    $.extend($.fn.bootstrapValidator.Constructor.prototype,{
        //新增addItem
        addItem:function (options) {
            this.addField(options.element,options);
        },
        // 重写_onSuccess
        _onSuccess: function(e) {
            if(!this.options.autoSubmit){
                this.options.onFormValidated(e);
                return true;
            }
            if (e.isDefaultPrevented()) {
                return;
            }
            // Submit the form
            this.disableSubmitButtons(true).defaultSubmit();
        },
        _submit: function() {
            var isValid   = this.isValid(),
                eventType = isValid ? this.options.events.formSuccess : this.options.events.formError,
                e         = $.Event(eventType);

            this.$form.trigger(e);

            // Call default handler
            // Check if whether the submit button is clicked
            isValid ? this._onSuccess(e) : this._onError(e);

        },

    });

    //jQuery增加addItem 方法
    $.prototype.addItem=function (options) {
        this.data('bootstrapValidator').addItem(options)
    };
    $.prototype.removeItem=function (options) {
        this.data('bootstrapValidator').removeField(options);
    };

    $.fn.bootstrapValidator.validators.required = $.fn.bootstrapValidator.validators.notEmpty;
    $.fn.bootstrapValidator.i18n.required = $.fn.bootstrapValidator.i18n.notEmpty;

    $.fn.bootstrapValidator.i18n.emailOrMobile = $.extend($.fn.bootstrapValidator.i18n.emailOrMobile || {}, {
        'default': 'Please enter a valid email adress or phone number'
    });
    $.fn.bootstrapValidator.validators.emailOrMobile = {
        validate: function(validator, $field, options) {
            var value = $field.val();
            var email=/^\s*([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,20})\s*$/;
            var isValid=false;
            //Brazil
            isValid = (/^(([\d]{4}[-.\s]{1}[\d]{2,3}[-.\s]{1}[\d]{2}[-.\s]{1}[\d]{2})|([\d]{4}[-.\s]{1}[\d]{3}[-.\s]{1}[\d]{4})|((\(?\+?[0-9]{2}\)?\s?)?(\(?\d{2}\)?\s?)?\d{4,5}[-.\s]?\d{4}))$/).test(value);
            if(isValid)return true;

            //China
            isValid = (/^((00|\+)?(86(?:-| )))?((\d{11})|(\d{3}[- ]{1}\d{4}[- ]{1}\d{4})|((\d{2,4}[- ]){1}(\d{7,8}|(\d{3,4}[- ]{1}\d{4}))([- ]{1}\d{1,4})?))$/).test(value);
            if(isValid)return true;

            //Czech Republic
            isValid = /^(((00)([- ]?)|\+)(420)([- ]?))?((\d{3})([- ]?)){2}(\d{3})$/.test(value);
            if(isValid)return true;

            //Germany
            isValid = (/^(((((((00|\+)49[ \-/]?)|0)[1-9][0-9]{1,4})[ \-/]?)|((((00|\+)49\()|\(0)[1-9][0-9]{1,4}\)[ \-/]?))[0-9]{1,7}([ \-/]?[0-9]{1,5})?)$/).test(value);
            if(isValid)return true;

            //Denmark
            isValid = (/^(\+45|0045|\(45\))?\s?[2-9](\s?\d){7}$/).test(value);
            if(isValid)return true;

            //Spain
            isValid = (/^(?:(?:(?:\+|00)34\D?))?(?:9|6)(?:\d\D?){8}$/).test(value);
            if(isValid)return true;
            //France
            isValid = (/^(?:(?:(?:\+|00)33[ ]?(?:\(0\)[ ]?)?)|0){1}[1-9]{1}([ .-]?)(?:\d{2}\1?){3}\d{2}$/).test(value);
            if(isValid)return true;

            //United Kingdom
            isValid = (/^\(?(?:(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?\(?(?:0\)?[\s-]?\(?)?|0)(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}|\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4}|\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3})|\d{5}\)?[\s-]?\d{4,5}|8(?:00[\s-]?11[\s-]?11|45[\s-]?46[\s-]?4\d))(?:(?:[\s-]?(?:x|ext\.?\s?|\#)\d+)?)$/).test(value);
            if(isValid)return true;

            //Morocco
            isValid = (/^(?:(?:(?:\+|00)212[\s]?(?:[\s]?\(0\)[\s]?)?)|0){1}(?:5[\s.-]?[2-3]|6[\s.-]?[13-9]){1}[0-9]{1}(?:[\s.-]?\d{2}){3}$/).test(value);
            if(isValid)return true;

            //Pakistan
            isValid = (/^0?3[0-9]{2}[0-9]{7}$/).test(value);
            if(isValid)return true;

            //Romania
            isValid = (/^(\+4|)?(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?(\s|\.|\-)?([0-9]{3}(\s|\.|\-|)){2}$/g).test(value);
            if(isValid)return true;

            //Russia
            isValid = (/^((8|\+7|007)[\-\.\/ ]?)?([\(\/\.]?\d{3}[\)\/\.]?[\-\.\/ ]?)?[\d\-\.\/ ]{7,10}$/g).test(value);
            if(isValid)return true;

            //Slovakia
            isValid = /^(((00)([- ]?)|\+)(420)([- ]?))?((\d{3})([- ]?)){2}(\d{3})$/.test(value);
            if(isValid)return true;

            //Thailand
            isValid = (/^0\(?([6|8-9]{2})*-([0-9]{3})*-([0-9]{4})$/).test(value);
            if(isValid)return true;

            //Venezuela
            isValid = (/^0(?:2(?:12|4[0-9]|5[1-9]|6[0-9]|7[0-8]|8[1-35-8]|9[1-5]|3[45789])|4(?:1[246]|2[46]))\d{7}$/).test(value);
            if(isValid)return true;

            //USA

            isValid = (/^(?:(1\-?)|(\+1 ?))?\(?(\d{3})[\)\-\.]?(\d{3})[\-\.]?(\d{4})$/).test(value) && (value.length === 10);
            if(isValid)return true;

            if(email.test(value))return true;


            return false;
        }
    };

    if(app.locale=='zh-CN'){
        require('bootstrap.validate-zh-CN');
        $.fn.bootstrapValidator.i18n = $.extend(true, $.fn.bootstrapValidator.i18n, {
            emailOrMobile:{
                default:"请输入有效的电子邮件地址或者手机号码"
            }
        })
    }
    var defaultSetting={
        excluded: [':disabled', ':hidden', ':not(:visible)'],
        submitButtons: 'button[type="submit"]',
        feedbackIcons: {
            valid: 'glyphicon',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        }
    };
    exports.bootstrapValidator=function (settings) {
        settings=$.extend(defaultSetting,settings);
        var validatior=$(settings.element).bootstrapValidator(settings);
        var submitBtn=settings.submitBtn;
        if(typeof(submitBtn)=='object' ){
            submitBtn.click(function (e) {
                $(settings.element).submit()
            });
        }else if(typeof(submitBtn)=='string'){
            $(submitBtn).click(function (e) {
                $(settings.element).submit()
            });
        }
        return validatior;

    };






});