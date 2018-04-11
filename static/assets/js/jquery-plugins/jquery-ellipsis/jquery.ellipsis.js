/*!
 * jQuery.ellipsis
 * http://github.com/jjenzz/jquery.ellipsis
 * --------------------------------------------------------------------------
 * Copyright (c) 2013 J. Smith (@jjenzz)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * adds a class to the last 'allowed' line of text so you can apply
 * text-overflow: ellipsis;
 */
(function(a) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], a)
    } else {
        a(jQuery)
    }
}(function($) {


   $.fn.ellipsis=function (option) {
        var that=this;
        this.each(function() {
            var $this, data;
            $this = $(this);
            data = $this.data("ellipsis");
            if (!data) {
                $this.data("ellipsis", data = new Ellipsis(this, option));
            }
            if (typeof option === "string") {

                return that = data[option].apply(data, arguments);
            }
        });
        return that;
   };


    $.fn.ellipsis.Constructor = Ellipsis;
    var Ellipsis=function (element, options) {
        var that = this;
        this.element = $(element);
        this.ellpsisContainer=null;
        this.options=[];
        this.defaults = {
            ellipsis: '...',
            wrap: 'letter',
            line:1,
            letterlength:100,
            textArrlength: 0,
            callback: null,
            toggle: true,
            togglelink:[
                'Read More',
                'Pack Up'
            ],
            windowResizeFix: true,
        };
        this.defaultArrays = {
            style: ['line', 'letter'],
        };
        this._events = [];
        this.originalContent=this.element.html();
        this.content='';
        if (typeof options !== 'object' || options === null)
            options = {};

        this.options = $.extend(true,this.defaults, options);

        this.init();

        return that;
    }

    Ellipsis.prototype = {
        constructor: Ellipsis,
        init:function () {
            this.calc();
            this.ellipsis();
            this.toggle();
            this._attachEvents();
        },
        calc:function () {
            var that        = this,
                txt			= this.originalContent,
                space		= ( txt.indexOf(' ') !== -1 ) ? ' ' : '\u3000',
                separator	= ( this.options.wrap == 'letter' ) ? '' : space,
                textArr		= txt.split( separator ),
                height 	    = 0,
                meanlength  = 0,
                midPos		= 0,
                startPos	= 0,
                endPos		= textArr.length;


            if($.inArray(this.options.wrap,this.defaultArrays.style)===false){
                this.error('ellpsis style must "line" or "letter"');
                return;
            }
            //	Only one word
            if (startPos == 0 && endPos == 0 )
            {
                separator	= '';
                textArr		= txt.split( separator );
                endPos		= textArr.length;
            }
            this.options.textArrlength=endPos;
            this.element.html('<span class="ellpsis-container"></span>');
            this.ellpsisContainer=this.element.find('.ellpsis-container');
            //calc one word width and hight

            this.ellpsisContainer.html(textArr.slice( 0, endPos));
            height=this.ellpsisContainer.height();
            if(height==0){

                if(this.options.textArrlength>=this.options.letterlength){

                    this.content=textArr.slice( 0, this.options.letterlength ).join(separator)+this.options.ellipsis;
                }else{
                    that.content=this.originalContent;
                }
                return;
            }

            this.ellpsisContainer.html(textArr.slice( 0, 1));
            meanlength=this.ellpsisContainer[0].offsetHeight;
            height=Math.ceil( height / meanlength );

            while (height>0) {
                if(this.options.wrap=='line'){
                    midPos = Math.floor( ( startPos + endPos ) / 2 );
                    height = Math.ceil( height / 2 );
                    if(height<=this.options.line){
                        that.content=textArr.slice( 0, midPos-1 ).join(separator)+this.options.ellipsis;
                        break;
                    }
                    endPos=midPos;
                }else{
                    if(endPos<=this.options.letterlength){
                        that.content=textArr.slice( 0, endPos ).join(separator);
                        break;
                    }
                    that.content=textArr.slice( 0, this.options.letterlength ).join(separator)+this.options.ellipsis;
                    break;
                }
            }


        },
        resize:function () {

        },
        ellipsis:function () {

            this.ellpsisContainer.html(this.content);
        },
        toggle:function () {
            if(this.options.toggle && this.options.textArrlength>=this.options.letterlength){
                var toggleTemplate=' <a class="ellpsis-toggle" href="#"><span class="plus">'+this.options.togglelink[0]+'</span><span class="minus">'+this.options.togglelink[1]+'</span></a>';
                this.ellpsisContainer.append(toggleTemplate);
            }
        
        },
        toggleEvent:function () {
           if( this.ellpsisContainer.hasClass('toggle-opened')){
               this.ellpsisContainer.removeClass('toggle-opened');
               this.ellpsisContainer.html(this.content);
               this.toggle();
               this._attachEvents();
           }else{
               this.ellpsisContainer.addClass('toggle-opened');
               this.ellpsisContainer.html(this.originalContent);
               this.toggle();
               this._attachEvents();
           }
        },
        _attachEvents: function () {
            this._detachEvents();
            if (this.options.toggle && this.options.textArrlength>=this.options.letterlength) { // single input
                this._events = [
                    [this.element.find('.ellpsis-toggle'), {
                        click:   $.proxy(this.toggleEvent, this)
                    }],
                ];

            }
            if(this.options.windowResizeFix){
                this._events.push([
                    $(window),
                    {resize: $.proxy(this.resize, this)}
                ]);
            }
            if(this._events.length){
                for (var i = 0, el, ev; i < this._events.length; i++) {
                    el = this._events[i][0];
                    ev = this._events[i][1];
                    el.on(ev);
                }
            }

        },

        _detachEvents: function () {
            for (var i = 0, el, ev; i < this._events.length; i++) {
                el = this._events[i][0];
                ev = this._events[i][1];
                el.off(ev);
            }
            this._events = [];
        },
        debug:function (msg) {
            console.info(msg);
        },
        error : function( msg ) {
            console.error(msg);
        }
    }


}));
