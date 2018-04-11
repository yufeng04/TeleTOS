/**
 * Created by JiXu on 2016-09-27.
 */
define(function (require, exports, module) {
    (function ($) {
        'use strict';

        var BootstrapTable = $.fn.bootstrapTable.Constructor;
        var _refresh=BootstrapTable.prototype.refresh;

        BootstrapTable.prototype.refresh=function (params) {
            if(params && params.queryParams){
                this.options.pageNumber = 1;
                this.options.queryParams=params.queryParams;
            }
            _refresh.apply(this, Array.prototype.slice.apply(arguments));
        };
        BootstrapTable.prototype.initTotalRows=function () {
            this.options.totalRows = this.data.length;
        };
        $.fn.bootstrapTable.methods.push('initTotalRows');

    })(jQuery);




});