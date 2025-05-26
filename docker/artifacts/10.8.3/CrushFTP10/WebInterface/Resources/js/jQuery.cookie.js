/* jslint browser: true */
/* global jQuery: true */
/**
 * jQuery Cookie plugin
 *
 * Copyright (c) 2010 Klaus Hartl (stilbuero.de) Dual licensed under the MIT and
 * GPL licenses: http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

/* jslint browser: true */
/* global jQuery: true */
/**
 * jQuery Cookie plugin
 *
 * Copyright (c) 2010 Klaus Hartl (stilbuero.de) Dual licensed under the MIT and
 * GPL licenses: http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
// jQuery.cookie = function (key, value, options) {
//     // key and value given, set cookie...
//     if (arguments.length > 1 && (value === null || typeof value !== "object")) {
//         options = jQuery.extend({}, options);
//         if (value === null) {
//             options.expires = -1;
//         }
//         if (typeof options.expires === 'number') {
//             var days = options.expires,
//                 t = options.expires = new Date();
//             t.setDate(t.getDate() + days);
//         }
//         return (document.cookie = [
//             crushFTPTools.encodeURILocal(key), '=', options.raw ? String(value) : crushFTPTools.encodeURILocal(String(value)), options.expires ? '; expires=' + options.expires.toUTCString() : '',
//             // use expires attribute, max-age is not supported by IE
//                     options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join(''));
//     }
//     // key and possibly options given, get cookie...
//     options = value || {};
//     var result, decode = options.raw ?
//     function (s) {
//         return s;
//     } : crushFTPTools.decodeURILocal;
//     return (result = new RegExp('(?:^|; )' + crushFTPTools.encodeURILocal(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
// };

jQuery.cookie = function (key, value, options, force) {
    var lowKey = key.toLowerCase();
    var ignoreKey = (lowKey === "crushauth" || lowKey === "currentauth");
    // key and value given, set cookie...
    if (arguments.length > 1 && (value === null || typeof value !== "object")) {
    	if(!ignoreKey && !force){
    		window.localStorage[key] = value;
    		return crushFTPTools.sanitize(window.localStorage[key]);
    	}
        options = jQuery.extend({}, options);
        if (value === null) {
            options.expires = -1;
        }
        if (typeof options.expires === 'number') {
            var days = options.expires,
                t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }
        return (document.cookie = [
            crushFTPTools.encodeURILocal(key), '=', options.raw ? String(value) : crushFTPTools.encodeURILocal(String(value)), options.expires ? '; expires=' + options.expires.toUTCString() : '',
            // use expires attribute, max-age is not supported by IE
                    options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join(''));
    }
    // key and possibly options given, get cookie...
    options = value || {};
    if(force)
	{
	    var result, decode = options.raw ?
	    function (s) {
	        return s;
	    } : crushFTPTools.decodeURILocal;
	    return (result = new RegExp('(?:^|; )' + crushFTPTools.encodeURILocal(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
	}
    var curCookie = $.cookie(key, {}, null, true);
    if(key == "i18n"){
    	console.log(key, value, options, force);
    }
    if(!ignoreKey){
	    var curLocalStorage = window.localStorage[key];
	    if(curCookie){
	    	window.localStorage[key] = curCookie;
	    	$.cookie(key, "", {
	                    path: '/',
	                    expires: -1
	                }, true);
	    }
	    return crushFTPTools.sanitize(window.localStorage[key]);
    }
    return curCookie;
};