define(function (require, exports, module) {
    require('bootstrap-calendar');
    require('bootstrap-calendar.css');
    require('bootstrap-calendar-zh-CN');

    var defaultOptions = {
        events_source: 'events.json.php',
        view: 'month',
        tmpl_path: app.basePath+'/assets/js/bootstrap-calendar/tmpls/',
        tmpl_cache: true,
        time_start: '00:00',
        time_end: '24:30',
        onAfterViewLoad: function(view) {
            $('.bootstrap-calendar-header h3').text(this.getTitle());
            $('.bootstrap-calendar-header .btn-group button').removeClass('active');
            $('.bootstrap-calendar-header button[data-calendar-view="' + view + '"]').addClass('active');
        },
        classes: {
            months: {
                general: 'label'
            }
        }
    };
    var options = {};
    options.default=$.extend({}, defaultOptions, {});

    function getOptions(name, extendOptions) {
        if (!extendOptions) {
            extendOptions = {};
        }
        if(name=="" || name==undefined){
            name="default";
        }

        return $.extend({}, options[name], extendOptions);
    }
    $.fn.bootstrapCalendar = function(name,params) {
        var calendar=$(this).calendar(getOptions(name, params));

        $('.bootstrap-calendar-header .btn-group button[data-calendar-nav]').each(function() {
            var $this = $(this);
            $this.click(function() {
                calendar.navigate($this.data('calendar-nav'));
            });
        });

        $('.bootstrap-calendar-header .btn-group button[data-calendar-view]').each(function() {
            var $this = $(this);
            $this.click(function() {
                calendar.view($this.data('calendar-view'));
            });
        });
        if(app.locale=='zh-CN'){
            calendar.setLanguage(app.locale);
            calendar.view();
        }


        return calendar;

    }


});