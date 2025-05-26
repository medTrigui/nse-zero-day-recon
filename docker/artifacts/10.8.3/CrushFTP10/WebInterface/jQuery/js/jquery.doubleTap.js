/*!
 * jQuery Double Tap Plugin.
 *
 * Copyright (c) 2010 Raul Sanchez (http://www.sanraul.com)
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 Link : http://www.sanraul.com/2010/08/01/implementing-doubletap-on-iphones-and-ipads/
 */
(function ($) {
    // Determine if we are on a touch-based device
    var hasTouch = false;
    var agent = navigator.userAgent.toLowerCase();
    if (agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0 || agent.indexOf('android') >= 0) {
        hasTouch = true;
    }
    $.fn.doubletap = function (onDoubleTapCallback, onTapCallback, delay) {
        var eventName, action;
        delay = delay == null ? 500 : delay;
        eventName = hasTouch == true ? 'touchend' : 'click';
        this.bind(eventName, function (event) {
            clearTimeout(action);
            var now = new Date().getTime();
            var lastTouch = $(this).data('lastTouch') || now + 1; /** the first time this will make delta a negative number */            
            var delta = now-lastTouch;
            if (delta <delay && delta>0) {
                // After we detct a doubletap, start over
                $(this).data('lastTouch', null);
                if (onDoubleTapCallback != null && typeof onDoubleTapCallback == 'function') {
                    onDoubleTapCallback(event, $(this));
					event.stopPropagation();
					return false;
                }
            } else {
                $(this).data('lastTouch', now);
                action = setTimeout(function (evt) {
                    if (onTapCallback != null && typeof onTapCallback == 'function') {
                        onTapCallback(evt);
                    }
                    clearTimeout(action); // clear the timeout
                }, delay, [event]);
            }
        });
    };
})(jQuery);