/**
 * Created by JiXu on 2016-08-19.
 */
define(function (require, exports, module) {
    require("jquery.mulitselect");
    require("jquery.mulitselect.css");
    require("jquery.quicksearch");
    var search_config={
        selectableHeader: "<input type='text' class='form-control' autocomplete='off' placeholder='Search'>",
        selectionHeader: "<input type='text' class='form-control' autocomplete='off' placeholder='Search'>",
        afterInit: function(ms){
            var that = this,
                $selectableSearch = that.$selectableUl.prev(),
                $selectionSearch = that.$selectionUl.prev(),
                selectableSearchString = '#'+that.$container.attr('id')+' .ms-elem-selectable:not(.ms-selected)',
                selectionSearchString = '#'+that.$container.attr('id')+' .ms-elem-selection.ms-selected';

            that.qs1 = $selectableSearch.quicksearch(selectableSearchString)
                .on('keydown', function(e){
                    if (e.which === 40){
                        that.$selectableUl.focus();
                        return false;
                    }
                });

            that.qs2 = $selectionSearch.quicksearch(selectionSearchString)
                .on('keydown', function(e){
                    if (e.which == 40){
                        that.$selectionUl.focus();
                        return false;
                    }
                });
        },
        afterSelect: function(){
            this.qs1.cache();
            this.qs2.cache();
        },
        afterDeselect: function(){
            this.qs1.cache();
            this.qs2.cache();
        }
    }

    var default_config={
        keepOrder: true,
        selectableOptgroup:true,
    };
    var configs = {};
    configs.default=$.extend({},default_config);
    configs.search=$.extend({},default_config,search_config);

    function getConfig(name, extendConfig) {
        if (!extendConfig) {
            extendConfig = {};
        }
        return $.extend({}, configs[name], extendConfig);
    }

    exports.multiSelect=function (select,configname,options) {
       var  settings=getConfig(configname, options);
        return $(select).multiSelect(settings)
    }
});