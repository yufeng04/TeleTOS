
define(function(require, exports, module) {

    window.$=window.jQuery=require("$");
    require("bootstrap.min");
    exports.load=function (name) {
        if(window.app.jsPaths[name.split('/',1)[0]]==undefined) {
            name=window.app.basePath + '/bundles/cosite/js/'+name;
        }

        name+='.js?'+window.app.version;
        seajs.use(name,function (module) {
            if($.isFunction(module.run)) {
                module.run();
            }
        })
    };

    window.app.load=exports.load;//让modal使用

    if (app.controller) {
        exports.load(app.controller);
    }


    $(document).ajaxSend(function (a,b,c) {
        if(c.type== "POST") {
            b.setRequestHeader('X-CSRFToken',window.app.csrf_token);

        }
    })


});