/**
 * Created by JiXu on 2016-09-28.
 */
define(function (require, exports, module) {
    var jQuery=require("$");
    !(function () {
        'use strict';

        var findModals = function (target) {
            var i;
            var modals = document.querySelectorAll('a');

            for (; target && target !== document; target = target.parentNode) {
                for (i = modals.length; i--;) {
                    if (modals[i] === target) {
                        return target;
                    }
                }
            }
        };

        var getModal = function (event) {
            var modalToggle = findModals(event.target);
            if (modalToggle && modalToggle.hash) {
                return document.querySelector(modalToggle.hash);
            }
        };

        window.addEventListener('click', function (event) {
            var modal = getModal(event);
            if (modal) {
                if (modal && modal.classList.contains('modal')) {
                    modal.classList.toggle('active');
                }
                event.preventDefault(); // prevents rewriting url (apps can still use hash values in url)
            }
        });

    }());

    !(function () {
        'use strict';

        var noop = function () {};


        // Pushstate caching
        // ==================

        var isScrolling;
        var maxCacheLength = 20;
        var cacheMapping   = sessionStorage;
        var domCache       = {};
        var transitionMap  = {
            slideIn  : 'slide-out',
            slideOut : 'slide-in',
            fade     : 'fade'
        };

        var bars = {
            bartab             : '.bar-tab',
            barnav             : '.bar-nav',
            barfooter          : '.bar-footer',
            barheadersecondary : '.bar-header-secondary'
        };

        var cacheReplace = function (data, updates) {
            PUSH.id = data.id;
            if (updates) {
                data = getCached(data.id);
            }
            cacheMapping[data.id] = JSON.stringify(data);
            window.history.replaceState(data.id, data.title, data.url);
            domCache[data.id] = document.body.cloneNode(true);
        };

        var cachePush = function () {
            var id = PUSH.id;

            var cacheForwardStack = JSON.parse(cacheMapping.cacheForwardStack || '[]');
            var cacheBackStack    = JSON.parse(cacheMapping.cacheBackStack    || '[]');

            cacheBackStack.push(id);

            while (cacheForwardStack.length) {
                delete cacheMapping[cacheForwardStack.shift()];
            }
            while (cacheBackStack.length > maxCacheLength) {
                delete cacheMapping[cacheBackStack.shift()];
            }

            window.history.pushState(null, '', cacheMapping[PUSH.id].url);

            cacheMapping.cacheForwardStack = JSON.stringify(cacheForwardStack);
            cacheMapping.cacheBackStack    = JSON.stringify(cacheBackStack);
        };

        var cachePop = function (id, direction) {
            var forward           = direction === 'forward';
            var cacheForwardStack = JSON.parse(cacheMapping.cacheForwardStack || '[]');
            var cacheBackStack    = JSON.parse(cacheMapping.cacheBackStack    || '[]');
            var pushStack         = forward ? cacheBackStack    : cacheForwardStack;
            var popStack          = forward ? cacheForwardStack : cacheBackStack;

            if (PUSH.id) {
                pushStack.push(PUSH.id);
            }
            popStack.pop();

            cacheMapping.cacheForwardStack = JSON.stringify(cacheForwardStack);
            cacheMapping.cacheBackStack    = JSON.stringify(cacheBackStack);
        };

        var getCached = function (id) {
            return JSON.parse(cacheMapping[id] || null) || {};
        };

        var getTarget = function (e) {
            var target = findTarget(e.target);
            if (!target ||
                e.which > 1 ||
                e.metaKey ||
                e.ctrlKey ||
                isScrolling ||
                location.protocol !== target.protocol ||
                location.host     !== target.host ||
                !target.hash && /#/.test(target.href) ||
                target.hash && target.href.replace(target.hash, '') === location.href.replace(location.hash, '') ||
                target.getAttribute('data-ignore') === 'push'
            ) { return; }

            return target;
        };


        // Main event handlers (touchend, popstate)
        // ==========================================

        var touchend = function (e) {
            var target = getTarget(e);

            if (!target) {
                return;
            }

            e.preventDefault();

            PUSH({
                url        : target.href,
                hash       : target.hash,
                timeout    : target.getAttribute('data-timeout'),
                transition : target.getAttribute('data-transition')
            });
        };

        var popstate = function (e) {
            var key;
            var barElement;
            var activeObj;
            var activeDom;
            var direction;
            var transition;
            var transitionFrom;
            var transitionFromObj;
            var id = e.state;

            if (!id || !cacheMapping[id]) {
                return;
            }

            direction = PUSH.id < id ? 'forward' : 'back';

            cachePop(id, direction);

            activeObj = getCached(id);
            activeDom = domCache[id];

            if (activeObj.title) {
                document.title = activeObj.title;
            }

            if (direction === 'back') {

                transitionFrom    = JSON.parse(direction === 'back' ? cacheMapping.cacheForwardStack : cacheMapping.cacheBackStack);
                transitionFromObj = getCached(transitionFrom[transitionFrom.length - 1]);
            } else {
                transitionFromObj = activeObj;
            }



            if (direction === 'back' && !transitionFromObj.id) {
                return (PUSH.id = id);
            }


            transition = direction === 'back' ? transitionMap[transitionFromObj.transition] : transitionFromObj.transition;

            if (!activeDom) {
                return PUSH({
                    id         : activeObj.id,
                    url        : activeObj.url,
                    title      : activeObj.title,
                    timeout    : activeObj.timeout,
                    transition : transition,
                    ignorePush : true
                });
            }

            if (transitionFromObj.transition) {
                activeObj = extendWithDom(activeObj, '.content', activeDom.cloneNode(true));

                for (key in bars) {
                    if (bars.hasOwnProperty(key)) {
                        barElement = document.querySelector(bars[key]);
                        if (activeObj[key]) {
                            swapContent(activeObj[key], barElement);//加载对象
                        } else if (barElement) {
                            barElement.parentNode.removeChild(barElement);
                        }
                    }
                }
            }

            swapContent(
                (activeObj.contents || activeDom).cloneNode(true),
                document.querySelector('.content'),
                transition
            );

            PUSH.id = id;

            document.body.offsetHeight; // force reflow to prevent scroll
        };


        // Core PUSH functionality
        // =======================

        var PUSH = function (options) {
            var key;
            var xhr = PUSH.xhr;

            options.container = options.container || options.transition ? document.querySelector('.content') : document.body;

            for (key in bars) {
                if (bars.hasOwnProperty(key)) {
                    options[key] = options[key] || document.querySelector(bars[key]);
                }
            }

            if (xhr && xhr.readyState < 4) {
                xhr.onreadystatechange = noop;
                xhr.abort();
            }

            xhr = new XMLHttpRequest();
            xhr.open('GET', options.url, true);
            xhr.setRequestHeader('X-PUSH', 'true');

            xhr.onreadystatechange = function () {
                if (options._timeout) {
                    clearTimeout(options._timeout);
                }
                if (xhr.readyState === 4) {
                    xhr.status === 200 ? success(xhr, options) : failure(options.url);
                }
            };

            if (!PUSH.id) {
                cacheReplace({
                    id         : +new Date(),
                    url        : window.location.href,
                    title      : document.title,
                    timeout    : options.timeout,
                    transition : null
                });
            }
            if (options.timeout) {
                options._timeout = setTimeout(function () {  xhr.abort('timeout'); }, options.timeout);
            }


            xhr.send();

            if (xhr.readyState && !options.ignorePush) {
                cachePush();
            }
        };


        // Main XHR handlers
        // =================

        var success = function (xhr, options) {
            var key;
            var barElement;
            var data = parseXHR(xhr, options);

            if (!data.contents) {
                return locationReplace(options.url);
            }

            if (data.title) {
                document.title = data.title;
            }

            if (options.transition) {
                for (key in bars) {
                    if (bars.hasOwnProperty(key)) {
                        barElement = document.querySelector(bars[key]);
                        if (data[key]) {
                            swapContent(data[key], barElement);
                        } else if (barElement) {
                            barElement.parentNode.removeChild(barElement);
                        }
                    }
                }
            }

            swapContent(data.contents, options.container, options.transition, function () {
                cacheReplace({
                    id         : options.id || +new Date(),
                    url        : data.url,
                    title      : data.title,
                    timeout    : options.timeout,
                    transition : options.transition
                }, options.id);
                triggerStateChange();
            });

            if (!options.ignorePush && window._gaq) {
                _gaq.push(['_trackPageview']); // google analytics
            }
            if (!options.hash) {
                return;
            }
        };

        var failure = function (url) {
            throw new Error('Could not get: ' + url);
        };


        // PUSH helpers
        // ============

        var swapContent = function (swap, container, transition, complete) {
            var enter;
            var containerDirection;
            var swapDirection;

            if (!transition) {
                if (container) {
                    if(!$(container).hasClass('bar-swiper')){
                        container.innerHTML = swap.innerHTML;
                    }else{

                        // if($(swap).hasClass('bar-swiper-hidden')){
                        //     $(container).addClass('bar-swiper-hidden');
                        // }else{
                        //     $(container).removeClass('bar-swiper-hidden');
                        // }

                    }
                } else if (swap.classList.contains('content')) {
                    document.body.appendChild(swap);
                } else {

                    document.body.insertBefore(swap, document.querySelector('.content'));
                }
            } else {
                enter  = /in$/.test(transition);

                if (transition === 'fade') {
                    container.classList.add('in');
                    container.classList.add('fade');
                    swap.classList.add('fade');
                }

                if (/slide/.test(transition)) {
                    swap.classList.add('sliding-in', enter ? 'right' : 'left');
                    swap.classList.add('sliding');
                    container.classList.add('sliding');
                }

                container.parentNode.insertBefore(swap, container);
            }

            if (!transition) {
                complete && complete();
            }

            if (transition === 'fade') {
                container.offsetWidth; // force reflow
                container.classList.remove('in');
                var fadeContainerEnd = function () {
                    container.removeEventListener('webkitTransitionEnd', fadeContainerEnd);
                    swap.classList.add('in');
                    swap.addEventListener('webkitTransitionEnd', fadeSwapEnd);
                };
                var fadeSwapEnd = function () {
                    swap.removeEventListener('webkitTransitionEnd', fadeSwapEnd);
                    container.parentNode.removeChild(container);
                    swap.classList.remove('fade');
                    swap.classList.remove('in');
                    complete && complete();
                };
                container.addEventListener('webkitTransitionEnd', fadeContainerEnd);

            }

            if (/slide/.test(transition)) {
                var slideEnd = function () {
                    swap.removeEventListener('webkitTransitionEnd', slideEnd);
                    swap.classList.remove('sliding', 'sliding-in');
                    swap.classList.remove(swapDirection);
                    container.parentNode.removeChild(container);
                    complete && complete();
                };

                container.offsetWidth; // force reflow
                swapDirection      = enter ? 'right' : 'left';
                containerDirection = enter ? 'left' : 'right';
                container.classList.add(containerDirection);
                swap.classList.remove(swapDirection);
                swap.addEventListener('webkitTransitionEnd', slideEnd);
            }
        };

        var triggerStateChange = function () {
            var e = new CustomEvent('push', {
                detail: { state: getCached(PUSH.id) },
                bubbles: true,
                cancelable: true
            });

            window.dispatchEvent(e);
        };

        var findTarget = function (target) {
            var i;
            var toggles = document.querySelectorAll('a');

            for (; target && target !== document; target = target.parentNode) {
                for (i = toggles.length; i--;) {
                    if (toggles[i] === target) {
                        return target;
                    }
                }
            }
        };

        var locationReplace = function (url) {
            window.history.replaceState(null, '', '#');
            window.location.replace(url);
        };

        var extendWithDom = function (obj, fragment, dom) {
            var i;
            var result = {};

            for (i in obj) {
                if (obj.hasOwnProperty(i)) {
                    result[i] = obj[i];
                }
            }

            Object.keys(bars).forEach(function (key) {
                var el = dom.querySelector(bars[key]);
                if (el) {
                    el.parentNode.removeChild(el);
                }
                result[key] = el;
            });

            result.contents = dom.querySelector(fragment);

            return result;
        };

        var parseXHR = function (xhr, options) {
            var head;
            var body;
            var data = {};
            var responseText = xhr.responseText;

            data.url = options.url;

            if (!responseText) {
                return data;
            }

            if (/<html/i.test(responseText)) {
                head           = document.createElement('div');
                body           = document.createElement('div');
                head.innerHTML = responseText.match(/<head[^>]*>([\s\S.]*)<\/head>/i)[0];
                body.innerHTML = responseText.match(/<body[^>]*>([\s\S.]*)<\/body>/i)[0];
            } else {
                head           = body = document.createElement('div');
                head.innerHTML = responseText;
            }

            data.title = head.querySelector('title');
            var text = 'innerText' in data.title ? 'innerText' : 'textContent';
            data.title = data.title && data.title[text].trim();

            if (options.transition) {
                data = extendWithDom(data, '.content', body);
            } else {
                data.contents = body;
            }

            return data;
        };


        // Attach PUSH event handlers
        // ==========================

        window.addEventListener('touchstart', function () { isScrolling = false; });
        window.addEventListener('touchmove', function () { isScrolling = true; });
        window.addEventListener('click', touchend);
        // window.addEventListener('touchend', touchend);
       // window.addEventListener('click', function (e) { if (getTarget(e)) {e.preventDefault();  } });
        window.addEventListener('popstate', popstate);
        window.PUSH = PUSH;
        window.POPSTATE=popstate;

    }());

    !(function () {
        'use strict';

        var pageX;
        var pageY;
        var slider;
        var deltaX;
        var deltaY;
        var offsetX;
        var lastSlide;
        var startTime;
        var resistance;
        var sliderWidth;
        var slideNumber;
        var isScrolling;
        var scrollableArea;
        var loopInterval=undefined;

        var getSlider = function (target) {
            var i;
            var sliders = document.querySelectorAll('.slider > .slide-group');

            for (; target && target !== document; target = target.parentNode) {
                for (i = sliders.length; i--;) {
                    if (sliders[i] === target) {
                        return target;
                    }
                }
            }
        };

        var getScroll = function () {
            if ('webkitTransform' in slider.style) {
                var translate3d = slider.style.webkitTransform.match(/translate3d\(([^,]*)/);
                var ret = translate3d ? translate3d[1] : 0;
                return parseInt(ret, 10);
            }
        };

        var setSlideNumber = function (offset) {
            var round = offset ? (deltaX < 0 ? 'ceil' : 'floor') : 'round';
            slideNumber = Math[round](getScroll() / (scrollableArea / slider.children.length));
            slideNumber += offset;
            slideNumber = Math.min(slideNumber, 0);
            slideNumber = Math.max(-(slider.children.length - 1), slideNumber);
        };

        var onTouchStart = function (e) {
            slider = getSlider(e.target);
            if (!slider) {
                return;
            }

            var firstItem  = slider.querySelector('.slide');

            scrollableArea = firstItem.offsetWidth * slider.children.length;
            isScrolling    = undefined;
            sliderWidth    = slider.offsetWidth;
            resistance     = 1;
            lastSlide      = -(slider.children.length - 1);
            startTime      = +new Date();
            pageX          = e.touches[0].pageX;
            pageY          = e.touches[0].pageY;
            deltaX         = 0;
            deltaY         = 0;

            setSlideNumber(0);

            slider.style['-webkit-transition-duration'] = 0;
            clearInterval(loopInterval);
        };

        var onTouchMove = function (e) {
            if (e.touches.length > 1 || !slider) {
                return; // Exit if a pinch || no slider
            }

            deltaX = e.touches[0].pageX - pageX;
            deltaY = e.touches[0].pageY - pageY;
            pageX  = e.touches[0].pageX;
            pageY  = e.touches[0].pageY;

            if (typeof isScrolling === 'undefined') {
                isScrolling = Math.abs(deltaY) > Math.abs(deltaX);
            }

            if (isScrolling) {
                return;
            }

            offsetX = (deltaX / resistance) + getScroll();

            e.preventDefault();

            resistance = slideNumber === 0         && deltaX > 0 ? (pageX / sliderWidth) + 1.25 :
                slideNumber === lastSlide && deltaX < 0 ? (Math.abs(pageX) / sliderWidth) + 1.25 : 1;

            slider.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';
        };
        var onTouchEnd = function (e) {
            if (!slider || isScrolling) {
                return;
            }

            setSlideNumber(
                (+new Date()) - startTime < 1000 && Math.abs(deltaX) > 15 ? (deltaX < 0 ? -1 : 1) : 0
            );

            offsetX = slideNumber * sliderWidth;

            slider.style['-webkit-transition-duration'] = '.2s';
            slider.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';

            e = new CustomEvent('slide', {
                detail: { slideNumber: Math.abs(slideNumber) },
                bubbles: true,
                cancelable: true
            });

            slider.parentNode.dispatchEvent(e);
        };
        var LoopTouch=function () {
            if(loopInterval){
                clearInterval(loopInterval);
            }
            slider = document.querySelectorAll('.slider > .slide-group')[0];
            if (!slider && !$(slider).data('loop')) {
                return;
            }
            var reg = /^\d+(?=\.{0,1}\d+$|$)/;
            var loopSlider  = slider;
            var firstItem   = slider.querySelector('.slide');
            var loop         = 2000 ||  $(slider).data('loop');
            var speed        = 500  ||  $(slider).data('speed');
            scrollableArea   = firstItem.offsetWidth * slider.children.length;
            sliderWidth      = slider.offsetWidth;
            lastSlide        = -(slider.children.length - 1);

            loop             =  reg.test(loop)? loop: 2000;
            speed            =  reg.test(speed)? speed: 500;
            var sliderLength =slider.children.length;
            if(sliderLength<=1) return;
            setSlideNumber(0);

            slider.style['-webkit-transition-duration'] = 0;

            loopInterval=setInterval(function () {
                if(slideNumber+sliderLength==1){
                    slideNumber=0;
                }else{
                    slideNumber--;
                }
                offsetX = slideNumber * sliderWidth;
                loopSlider.style['-webkit-transition-duration'] = speed+'ms';
                loopSlider.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';

            },loop);
        };
        window.addEventListener('touchstart', onTouchStart);
        window.addEventListener('touchmove', onTouchMove);
        window.addEventListener('touchend', onTouchEnd);
        window.addEventListener('push',LoopTouch);
        LoopTouch();

    }());

    !(function () {
        'use strict';

        var start     = {};
        var touchMove = false;
        var distanceX = false;
        var toggle    = false;

        var findToggle = function (target) {
            var i;
            var toggles = document.querySelectorAll('.toggle');

            for (; target && target !== document; target = target.parentNode) {
                for (i = toggles.length; i--;) {
                    if (toggles[i] === target) {
                        return target;
                    }
                }
            }
        };

        window.addEventListener('touchstart', function (e) {
            e = e.originalEvent || e;

            toggle = findToggle(e.target);

            if (!toggle) {
                return;
            }

            var handle      = toggle.querySelector('.toggle-handle');
            var toggleWidth = toggle.clientWidth;
            var handleWidth = handle.clientWidth;
            var offset      = toggle.classList.contains('active') ? (toggleWidth - handleWidth) : 0;

            start     = { pageX : e.touches[0].pageX - offset, pageY : e.touches[0].pageY };
            touchMove = false;
        });

        window.addEventListener('touchmove', function (e) {
            e = e.originalEvent || e;

            if (e.touches.length > 1) {
                return; // Exit if a pinch
            }

            if (!toggle) {
                return;
            }

            var handle      = toggle.querySelector('.toggle-handle');
            var current     = e.touches[0];
            var toggleWidth = toggle.clientWidth;
            var handleWidth = handle.clientWidth;
            var offset      = toggleWidth - handleWidth;

            touchMove = true;
            distanceX = current.pageX - start.pageX;

            if (Math.abs(distanceX) < Math.abs(current.pageY - start.pageY)) {
                return;
            }

            e.preventDefault();

            if (distanceX < 0) {
                return (handle.style.webkitTransform = 'translate3d(0,0,0)');
            }
            if (distanceX > offset) {
                return (handle.style.webkitTransform = 'translate3d(' + offset + 'px,0,0)');
            }

            handle.style.webkitTransform = 'translate3d(' + distanceX + 'px,0,0)';

            toggle.classList[(distanceX > (toggleWidth / 2 - handleWidth / 2)) ? 'add' : 'remove']('active');
        });

        window.addEventListener('touchend', function (e) {
            if (!toggle) {
                return;
            }

            var handle      = toggle.querySelector('.toggle-handle');
            var toggleWidth = toggle.clientWidth;
            var handleWidth = handle.clientWidth;
            var offset      = (toggleWidth - handleWidth);
            var slideOn     = (!touchMove && !toggle.classList.contains('active')) || (touchMove && (distanceX > (toggleWidth / 2 - handleWidth / 2)));

            if (slideOn) {
                handle.style.webkitTransform = 'translate3d(' + offset + 'px,0,0)';
            } else {
                handle.style.webkitTransform = 'translate3d(0,0,0)';
            }

            toggle.classList[slideOn ? 'add' : 'remove']('active');

            e = new CustomEvent('toggle', {
                detail: { isActive: slideOn },
                bubbles: true,
                cancelable: true
            });

            toggle.dispatchEvent(e);

            touchMove = false;
            toggle    = false;
        });

        window.addEventListener('click', function (e){
            toggle = findToggle(e.target);

            if (!toggle || $.support.touch) {
                return;
            }


            var handle      = toggle.querySelector('.toggle-handle');
            var toggleWidth = toggle.clientWidth;
            var handleWidth = handle.clientWidth;
            var offset      = (toggleWidth - handleWidth);
            var slideOn     = (!touchMove && !toggle.classList.contains('active')) || (touchMove && (distanceX > (toggleWidth / 2 - handleWidth / 2)));

            if (slideOn) {
                handle.style.webkitTransform = 'translate3d(' + offset + 'px,0,0)';
            } else {
                handle.style.webkitTransform = 'translate3d(0,0,0)';
            }

            toggle.classList[slideOn ? 'add' : 'remove']('active');

            e = new CustomEvent('toggle', {
                detail: { isActive: slideOn },
                bubbles: true,
                cancelable: true
            });

            toggle.dispatchEvent(e);

            touchMove = false;
            toggle    = false;
        })

    }());

    !(function () {
        'use strict';

        var getTarget = function (target) {
            var i;
            var segmentedControls = document.querySelectorAll('.segmented-control .control-item');

            for (; target && target !== document; target = target.parentNode) {
                for (i = segmentedControls.length; i--;) {
                    if (segmentedControls[i] === target) {
                        return target;
                    }
                }
            }
        };

        window.addEventListener('click', function (e) {
            var activeTab;
            var activeBodies;
            var targetBody;
            var targetTab     = getTarget(e.target);
            var className     = 'active';
            var classSelector = '.' + className;
            var targetBodyClassName = 'control-content';

            if (!targetTab) {
                return;
            }

            activeTab = targetTab.parentNode.querySelector(classSelector);

            if (activeTab) {
                activeTab.classList.remove(className);
            }

            targetTab.classList.add(className);

            if (!$(targetTab).data('id')) {
                return;
            }

            targetBody = document.querySelector('[data-event-id="'+$(targetTab).data('id')+'"]');

            if (!targetBody) {
                return;
            }

            activeBodies = targetBody.parentNode.querySelectorAll(classSelector);
            for (var i = 0; i < activeBodies.length; i++) {
                activeBodies[i].classList.remove(className);
            }

            targetBody.classList.add(className);
        });

        window.addEventListener('click', function (e) { if (getTarget(e.target)) {e.preventDefault();} });
    }());


    !(function( $, window ,undefined) {
        var $document = $( document );

        // add new event shortcuts
        $.each( ( "touchstart touchmove touchend " +
        "tap taphold " +
        "swipe swipeleft swiperight " +
        "scrollstart scrollstop" ).split( " " ), function( i, name ) {

            $.fn[ name ] = function( fn ) {
                return fn ? this.bind( name, fn ) : this.trigger( name );
            };

            // jQuery < 1.8
            if ( $.attrFn ) {
                $.attrFn[ name ] = true;
            }
        });
        var support = {
            touch: "ontouchend" in document
        };
        $.extend( $.support, support );
        var supportTouch = $.support.touch,
            scrollEvent = "touchmove scroll",
            touchStartEvent = supportTouch ? "touchstart" : "mousedown",
            touchStopEvent = supportTouch ? "touchend" : "mouseup",
            touchMoveEvent = supportTouch ? "touchmove" : "mousemove";

        function triggerCustomEvent( obj, eventType, event ) {
            var originalType = event.type;
            event.type = eventType;
            $.event.dispatch.call( obj, event );
            event.type = originalType;
        }

        // also handles scrollstop
        $.event.special.scrollstart = {

            enabled: true,

            setup: function() {

                var thisObject = this,
                    $this = $( thisObject ),
                    scrolling,
                    timer;

                function trigger( event, state ) {
                    scrolling = state;
                    triggerCustomEvent( thisObject, scrolling ? "scrollstart" : "scrollstop", event );
                }

                // iPhone triggers scroll after a small delay; use touchmove instead
                $this.bind( scrollEvent, function( event ) {

                    if ( !$.event.special.scrollstart.enabled ) {
                        return;
                    }

                    if ( !scrolling ) {
                        trigger( event, true );
                    }

                    clearTimeout( timer );
                    timer = setTimeout( function() {
                        trigger( event, false );
                    }, 50 );
                });
            }
        };

        // also handles taphold
        $.event.special.tap = {
            tapholdThreshold: 750,

            setup: function() {
                var thisObject = this,
                    $this = $( thisObject );

                $this.bind( "vmousedown", function( event ) {

                    if ( event.which && event.which !== 1 ) {
                        return false;
                    }

                    var origTarget = event.target,
                        origEvent = event.originalEvent,
                        timer;

                    function clearTapTimer() {
                        clearTimeout( timer );
                    }

                    function clearTapHandlers() {
                        clearTapTimer();

                        $this.unbind( "vclick", clickHandler )
                            .unbind( "vmouseup", clearTapTimer );
                        $document.unbind( "vmousecancel", clearTapHandlers );
                    }

                    function clickHandler( event ) {
                        clearTapHandlers();

                        // ONLY trigger a 'tap' event if the start target is
                        // the same as the stop target.
                        if ( origTarget === event.target ) {
                            triggerCustomEvent( thisObject, "tap", event );
                        }
                    }

                    $this.bind( "vmouseup", clearTapTimer )
                        .bind( "vclick", clickHandler );
                    $document.bind( "vmousecancel", clearTapHandlers );

                    timer = setTimeout( function() {
                        triggerCustomEvent( thisObject, "taphold", $.Event( "taphold", { target: origTarget } ) );
                    }, $.event.special.tap.tapholdThreshold );
                });
            }
        };

        // also handles swipeleft, swiperight
        $.event.special.swipe = {

            scrollSupressionThreshold: 30, // More than this horizontal displacement, and we will suppress scrolling.

            durationThreshold: 1000, // More time than this, and it isn't a swipe.

            horizontalDistanceThreshold: 30,  // Swipe horizontal displacement must be more than this.

            verticalDistanceThreshold: 75,  // Swipe vertical displacement must be less than this.

            start: function( event ) {
                var data = event.originalEvent.touches ?
                    event.originalEvent.touches[ 0 ] : event;
                return {
                    time: ( new Date() ).getTime(),
                    coords: [ data.pageX, data.pageY ],
                    origin: $( event.target )
                };
            },

            stop: function( event ) {

                var data = event.originalEvent.touches ?
                    event.originalEvent.touches[ 0 ] : event;
                return {
                    time: ( new Date() ).getTime(),
                    coords: [ data.pageX, data.pageY ]
                };
            },

            handleSwipe: function( start, stop ) {
                if ( stop.time - start.time < $.event.special.swipe.durationThreshold &&
                    Math.abs( start.coords[ 0 ] - stop.coords[ 0 ] ) > $.event.special.swipe.horizontalDistanceThreshold &&
                    Math.abs( start.coords[ 1 ] - stop.coords[ 1 ] ) < $.event.special.swipe.verticalDistanceThreshold ) {

                    start.origin.trigger( "swipe" )
                        .trigger( start.coords[0] > stop.coords[ 0 ] ? "swipeleft" : "swiperight" );
                }
            },

            setup: function() {
                var thisObject = this,
                    $this = $( thisObject );

                $this.bind( touchStartEvent, function( event ) {
                    var start = $.event.special.swipe.start( event ),
                        stop;

                    function moveHandler( event ) {
                        if ( !start ) {
                            return;
                        }

                        stop = $.event.special.swipe.stop( event );

                        // prevent scrolling
                        if ( Math.abs( start.coords[ 0 ] - stop.coords[ 0 ] ) > $.event.special.swipe.scrollSupressionThreshold ) {
                            event.preventDefault();
                        }
                    }

                    $this.bind( touchMoveEvent, moveHandler )
                        .one( touchStopEvent, function() {
                            $this.unbind( touchMoveEvent, moveHandler );

                            if ( start && stop ) {
                                $.event.special.swipe.handleSwipe( start, stop );
                            }
                            start = stop = undefined;
                        });
                });
            }
        };
        $.each({
            scrollstop: "scrollstart",
            taphold: "tap",
            swipeleft: "swipe",
            swiperight: "swipe"
        }, function( event, sourceEvent ) {

            $.event.special[ event ] = {
                setup: function() {
                    $( this ).bind( sourceEvent, $.noop );
                }
            };
        });

    })( jQuery, this );

    !(function ($) {

        var findTarget = function (target) {
            var i;
            var toggles = document.querySelectorAll('a');

            for (; target && target !== document; target = target.parentNode) {
                for (i = toggles.length; i--;) {
                    if (toggles[i] === target) {
                        return target;
                    }
                }
            }
        };

        var getBackTarget = function (e) {
            var target = findTarget(e.target);

            if (!target ||
                target.getAttribute('data-rel') !== 'back'
            ) { return; }

            return target;
        };
        window.addEventListener('click',function (e) {
            var activeObj;
            var backTarget=getBackTarget(e);
            if(!backTarget)
                return ;

            var cacheMapping   = sessionStorage;
            var cacheBackStack    = JSON.parse(cacheMapping.cacheBackStack    || '[]');
            var ignore=$(backTarget).data('ignore')=='push';
            if(cacheBackStack.length){
                e.state=cacheBackStack[cacheBackStack.length-1];
                if(ignore){
                    var cacheBack=cacheMapping[cacheBackStack[cacheBackStack.length-1]];
                    cacheBack=JSON.parse(cacheBack   || '[]');
                    if(cacheBack.url ){
                        if(cacheBack.url==window.location.href){

                            window.location.href=$(backTarget).data('default');
                        }else{
                            window.location.href=cacheBack.url;
                        }

                    }else{
                        history.back();
                    }


                }else{
                    var id=window.POPSTATE(e);
                    if(id){
                        window.location.href=$(backTarget).data('default');
                    }
                }
            }else {
                // window.location.href=$(backTarget).data('default');
                history.back();
            }
        })

    }(jQuery));

    !(function ($) {
        'use strict';

        // COLLAPSE PUBLIC CLASS DEFINITION
        // ================================

        var Collapse = function (element, options) {
            this.$element      = $(element)
            this.options       = $.extend({}, Collapse.DEFAULTS, options)
            this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                '[data-toggle="collapse"][data-target="#' + element.id + '"]')
            this.transitioning = null

            if (this.options.parent) {
                this.$parent = this.getParent()
            } else {
                this.addAriaAndCollapsedClass(this.$element, this.$trigger)
            }

            if (this.options.toggle) this.toggle()
        }

        Collapse.VERSION  = '3.3.5'

        Collapse.TRANSITION_DURATION = 350

        Collapse.DEFAULTS = {
            toggle: true
        }

        Collapse.prototype.dimension = function () {
            var hasWidth = this.$element.hasClass('width')
            return hasWidth ? 'width' : 'height'
        }

        Collapse.prototype.show = function () {
            if (this.transitioning || this.$element.hasClass('in')) return

            var activesData
            var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

            if (actives && actives.length) {
                activesData = actives.data('bs.collapse')
                if (activesData && activesData.transitioning) return
            }

            var startEvent = $.Event('show.bs.collapse')
            this.$element.trigger(startEvent)
            if (startEvent.isDefaultPrevented()) return

            if (actives && actives.length) {
                Plugin.call(actives, 'hide')
                activesData || actives.data('bs.collapse', null)
            }

            var dimension = this.dimension()

            this.$element
                .removeClass('collapse')
                .addClass('collapsing')[dimension](0)
                .attr('aria-expanded', true)

            this.$trigger
                .removeClass('collapsed')
                .attr('aria-expanded', true)

            this.transitioning = 1

            var complete = function () {
                this.$element
                    .removeClass('collapsing')
                    .addClass('collapse in')[dimension]('')
                this.transitioning = 0
                this.$element
                    .trigger('shown.bs.collapse')
            }

            if (!$.support.transition) return complete.call(this)

            var scrollSize = $.camelCase(['scroll', dimension].join('-'))

            this.$element
                .one('bsTransitionEnd', $.proxy(complete, this))
                .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
        }

        Collapse.prototype.hide = function () {
            if (this.transitioning || !this.$element.hasClass('in')) return

            var startEvent = $.Event('hide.bs.collapse')
            this.$element.trigger(startEvent)
            if (startEvent.isDefaultPrevented()) return

            var dimension = this.dimension()

            this.$element[dimension](this.$element[dimension]())[0].offsetHeight

            this.$element
                .addClass('collapsing')
                .removeClass('collapse in')
                .attr('aria-expanded', false)

            this.$trigger
                .addClass('collapsed')
                .attr('aria-expanded', false)

            this.transitioning = 1

            var complete = function () {
                this.transitioning = 0
                this.$element
                    .removeClass('collapsing')
                    .addClass('collapse')
                    .trigger('hidden.bs.collapse')
            }

            if (!$.support.transition) return complete.call(this)

            this.$element
                [dimension](0)
                .one('bsTransitionEnd', $.proxy(complete, this))
                .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
        }

        Collapse.prototype.toggle = function () {
            this[this.$element.hasClass('in') ? 'hide' : 'show']()
        }

        Collapse.prototype.getParent = function () {
            return $(this.options.parent)
                .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
                .each($.proxy(function (i, element) {
                    var $element = $(element)
                    this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
                }, this))
                .end()
        }

        Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
            var isOpen = $element.hasClass('in')

            $element.attr('aria-expanded', isOpen)
            $trigger
                .toggleClass('collapsed', !isOpen)
                .attr('aria-expanded', isOpen)
        }

        function getTargetFromTrigger($trigger) {
            var href
            var target = $trigger.attr('data-target')
                || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

            return $(target)
        }


        // COLLAPSE PLUGIN DEFINITION
        // ==========================

        function Plugin(option) {
            return this.each(function () {
                var $this   = $(this)
                var data    = $this.data('bs.collapse')
                var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

                if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
                if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
                if (typeof option == 'string') data[option]()
            })
        }

        var old = $.fn.collapse

        $.fn.collapse             = Plugin
        $.fn.collapse.Constructor = Collapse


        // COLLAPSE NO CONFLICT
        // ====================

        $.fn.collapse.noConflict = function () {
            $.fn.collapse = old
            return this
        }


        // COLLAPSE DATA-API
        // =================

        $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
            var $this   = $(this)

            if (!$this.attr('data-target')) e.preventDefault()

            var $target = getTargetFromTrigger($this)
            var data    = $target.data('bs.collapse')
            var option  = data ? 'toggle' : $this.data()

            Plugin.call($target, option)
        })

    }(jQuery));

    !(function ($) {
        'use strict';

        // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
        // ============================================================

        function transitionEnd() {
            var el = document.createElement('bootstrap')

            var transEndEventNames = {
                WebkitTransition : 'webkitTransitionEnd',
                MozTransition    : 'transitionend',
                OTransition      : 'oTransitionEnd otransitionend',
                transition       : 'transitionend'
            }

            for (var name in transEndEventNames) {
                if (el.style[name] !== undefined) {
                    return { end: transEndEventNames[name] }
                }
            }

            return false // explicit for ie8 (  ._.)
        }

        // http://blog.alexmaccaw.com/css-transitions
        $.fn.emulateTransitionEnd = function (duration) {
            var called = false
            var $el = this
            $(this).one('bsTransitionEnd', function () { called = true })
            var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
            setTimeout(callback, duration)
            return this
        }

        $(function () {
            $.support.transition = transitionEnd()

            if (!$.support.transition) return

            $.event.special.bsTransitionEnd = {
                bindType: $.support.transition.end,
                delegateType: $.support.transition.end,
                handle: function (e) {
                    if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
                }
            }
        })

    }(jQuery));

    !(function ($) {
        'use strict'

        function initPullToRefresh(options) {

            var eventsTarget = $(this);

            if (!eventsTarget.hasClass('content')) {
                eventsTarget = eventsTarget.find('.content');
            }

            if (!eventsTarget || eventsTarget.length === 0) return;

            var isTouched, _touch,isTouchMoved, touchesStart = {}, touchesDiff, container,refreshcontainer,isPullDownRefresh = false, useTranslate = false, startTranslate = 0, translate=0;
                var scrollTop, scrollHeight,distance,height, triggerDistance,isScrolled,isPullUpRefresh=false,isPullUpRefreshNow=false;

            var delay=1500;

            container = eventsTarget.find('.wrapper');
            if (!container || container.length === 0) return;
            refreshcontainer=container.children(':first');

            // Define trigger distance
                triggerDistance = 44;

            function handleTouchStart(e) {
                if (isTouched) {
                   return;
                }
                isTouchMoved = false;
                isTouched = true;
                _touch = e.originalEvent.targetTouches[0];
                touchesStart.x = _touch.pageX;
                touchesStart.y = _touch.pageY;

            }

            function handleTouchMove(e) {
                if (!isTouched) return;
                var pageX, pageY;
                    _touch = e.originalEvent.targetTouches[0];
                    pageX = _touch.pageX;
                    pageY = _touch.pageY;

                if (!pageX || !pageY) return;

                if (!isTouchMoved) {
                    /*jshint validthis:true */
                    container.removeClass('refreshing');

                    startTranslate = translate ? translate : 0;
                    scrollTop=eventsTarget[0].scrollTop;
                    //如果touch中使用了滚动条有值
                    useTranslate = true;
                    // if (container[0].scrollHeight === container[0].offsetHeight) {
                    //     useTranslate = true;
                    // }
                    // else {
                    //     useTranslate = false;
                    // }
                }
                isTouchMoved = true;
                touchesDiff = pageY - touchesStart.y;

                if (scrollTop===0 && touchesDiff > 0 && touchesDiff+startTranslate>0) {

                    //pulldown
                    if (useTranslate) {
                        e.preventDefault();
                        translate = touchesDiff + startTranslate;
                        refreshcontainer.transform('translate3d(0,' + translate + 'px,0)');
                    }
                    if (useTranslate && translate>=triggerDistance) {

                        isPullDownRefresh = true;
                        if(translate>0){
                            container.addClass('pull-down');
                        }

                    }
                    else {
                        isPullDownRefresh = false;
                        container.removeClass('pull-down');
                    }
                }
                else {
                    container.removeClass('pull-down');
                    isPullDownRefresh = false;
                    return;
                }


            }

            function handleTouchEnd(e) {

                if (!isTouched || !isTouchMoved) {
                    isTouched = false;
                    isTouchMoved = false;
                    return;
                }

                if (isPullDownRefresh) {
                    container.addClass('refreshing');
                    translate = 0;
                    refreshcontainer.transform('');
                    container.trigger('pullRefresh.down');

                }
                else {
                    container.removeClass('refreshing');
                    isTouched = false;

                }
                isTouchMoved = false;

            }

            function finishRefersh () {


                    container.removeClass('pull-up pull-down');
                    container.removeClass('refreshing');
                    scrollHeight = container[0].scrollHeight;
                    height = eventsTarget.height();
                    isTouched = false;
                    isScrolled=false;


            };


            function handleScrollstart(e) {
                if(isScrolled && isPullUpRefreshNow) {
                    return;
                }
                isScrolled = true;
                scrollHeight = container[0].scrollHeight;
                height = eventsTarget.height();
                distance = eventsTarget.prev('.bar-header-secondary').length==1?88:44;
                scrollTop = eventsTarget[0].scrollTop;

            }

            function handleScroll(e) {
                if (!isScrolled) return;
                e.preventDefault();
                scrollTop = eventsTarget[0].scrollTop;
                if(scrollTop + height >= scrollHeight - distance){
                    container.addClass('pull-up');
                    isPullUpRefresh=true;
                }else{
                    container.removeClass('pull-up');
                    isPullUpRefresh=false;
                }
            }

            function handleScrollstop(e) {
                if(isPullUpRefresh && !isPullUpRefreshNow){
                    isPullUpRefreshNow=true;
                    setTimeout(function () {
                        container.trigger('pullRefresh.up');
                        isPullUpRefreshNow=false;
                    },delay)
                }else{
                    isScrolled=false;
                }
                isPullUpRefresh=false;

            }

            eventsTarget.on('touchstart', handleTouchStart);
            eventsTarget.on('touchmove', handleTouchMove);
            eventsTarget.on('touchend', handleTouchEnd);
            eventsTarget.on('scrollstart',handleScrollstart);
            eventsTarget.on('scroll',handleScroll);
            eventsTarget.on('scrollstop',handleScrollstop);
            eventsTarget.on('pullRefresh.finish', function (event) {
                finishRefersh();
            });

        }



        jQuery.fn.extend({
            initPullToRefresh:initPullToRefresh,
            transform : function (transform) {
                for (var i = 0; i < this.length; i++) {
                    var elStyle = this[i].style;
                    elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
                }
                return this;
            },
            transition: function (duration) {
                if (typeof duration !== 'string') {
                    duration = duration + 'ms';
                }
                for (var i = 0; i < this.length; i++) {
                    var elStyle = this[i].style;
                    elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
                }
                return this;
            },
        });


        // $.initPullToRefresh=initPullToRefresh;


    }(jQuery))

});

