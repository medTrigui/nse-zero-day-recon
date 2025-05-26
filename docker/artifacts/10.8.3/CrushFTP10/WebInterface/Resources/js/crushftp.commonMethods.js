/*!
 * CrushFTP Common methods
 *
 * http://crushFTP.com/
 *
 * Copyright 2012, CrushFTP
 *
 * Author: Vipul Limbachiya
 *
 * http://vipullimbachiya.com
 */

// Various methods that adds form functionalities and prototypes to existing methods

//jQuery function, clears form fields
$.fn.clearForm = function() {
    return this.each(function() {
        var type = this.type,
            tag = this.tagName.toLowerCase();
        if (tag == 'form' || tag == 'div') return $(':input', this).clearForm();
        if (type == 'text' || type == 'password' || tag == 'textarea') this.value = '';
        else if (type == 'checkbox' || type == 'radio') {
            this.checked = false;
            crushFTP.UI.checkUnchekInput($(this), false);
        } else if (tag == 'select') this.selectedIndex = -1;
    });
};

jQuery.fn.offsetRelativeTo = function(el) {
    var $el = $(el),
        o1 = this.offset(),
        o2 = $el.offset();
    o1.top -= o2.top - $el.scrollTop();
    o1.left -= o2.left - $el.scrollLeft();
    return o1;
}

//Create buttons UI
function buildButtons(context) {
    $(".button", context).each(function() {
        var icon = $(this).attr("icon");
        if (icon) {
            $(this).button({
                icons: {
                    primary: icon
                }
            });
        } else {
            $(this).button();
        }
    });
}

// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.io/#x15.4.4.19
if (!Array.prototype.map) {

  Array.prototype.map = function(callback/*, thisArg*/) {

    var T, A, k;

    if (this == null) {
      throw new TypeError('this is null or not defined');
    }

    // 1. Let O be the result of calling ToObject passing the |this|
    //    value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal
    //    method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = arguments[1];
    }

    // 6. Let A be a new array created as if by the expression new Array(len)
    //    where Array is the standard built-in constructor with that name and
    //    len is the value of len.
    A = new Array(len);

    // 7. Let k be 0
    k = 0;

    // 8. Repeat, while k < len
    while (k < len) {

      var kValue, mappedValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal
      //    method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal
        //    method of O with argument Pk.
        kValue = O[k];

        // ii. Let mappedValue be the result of calling the Call internal
        //     method of callback with T as the this value and argument
        //     list containing kValue, k, and O.
        mappedValue = callback.call(T, kValue, k, O);

        // iii. Call the DefineOwnProperty internal method of A with arguments
        // Pk, Property Descriptor
        // { Value: mappedValue,
        //   Writable: true,
        //   Enumerable: true,
        //   Configurable: true },
        // and false.

        // In browsers that support Object.defineProperty, use the following:
        // Object.defineProperty(A, k, {
        //   value: mappedValue,
        //   writable: true,
        //   enumerable: true,
        //   configurable: true
        // });

        // For best browser support, use the following:
        A[k] = mappedValue;
      }
      // d. Increase k by 1.
      k++;
    }

    // 9. return A
    return A;
  };
}

//Swap 2 array items
Array.prototype.swapItems = function(a, b) {
    var temp = this[a];
    this[a] = this[b];
    this[b] = temp;
    return this;
};

Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};

// Check if specified array has item
Array.prototype.has = function(value) {
    var i;
    for (var i = 0, loopCnt = this.length; i < loopCnt; i++) {
        if (this[i] === value) {
            return true;
        }
    }
    return false;
};

// Few buggy browsers does not have indexOf for an array, add it if not available
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(value) {
        var i;
        for (var i = 0, loopCnt = this.length; i < loopCnt; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    };
}

if (!('filter' in Array.prototype)) {
    Array.prototype.filter = function(filter, that /*opt*/ ) {
        var other = [],
            v;
        for (var i = 0, n = this.length; i < n; i++)
            if (i in this && filter.call(that, v = this[i], i, this))
                other.push(v);
        return other;
    };
}

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.lastIndexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
  };
}

//Array diff
Array.prototype.diff = function(a) {
    return this.filter(function(i) {
        return !(a.indexOf(i) > -1);
    });
};

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

Array.prototype.removeByVal = function() {
    var what, a = arguments,
        L = a.length,
        ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) != -1) {
            this.splice(ax, 1);
        }
    }
    return this;
}

Array.prototype.insert = function(index, item) {
    this.splice(index, 0, item);
};

//Max val in array
Array.prototype.max = function() {
    var max = this[0];
    var len = this.length;
    for (var i = 1; i < len; i++)
        if (this[i] > max) max = this[i];
    return max;
}

// Zero-Fill
String.prototype.zf = function(l) {
    return '0'.string(l - this.length) + this;
}
Number.prototype.zf = function(l) {
    return this.toString().zf(l);
}

// VB-like string
String.prototype.string = function(l) {
    var s = '',
        i = 0;
    while (i++ < l) {
        s += this;
    }
    return s;
}

// Capitalize first character
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.startsWithArray = function(arr) {
    var curVal = this.toLowerCase();
    for (var i = 0; i < arr.length; i++) {
        if (curVal.indexOf(arr[i].toLowerCase()) == 0)
            return true;
    }
    return false;
};

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
  };
}

String.prototype.truncate = String.prototype.trunc || function(n){
    return (this.length > n) ? this.substr(0, n-1) + '...' : this;
};

//Clean array, usage array.clean("");
Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

// Date format prototype : http://www.codeproject.com/KB/scripting/dateformat.aspx
Date.prototype.format = function(f) {
    if (!this.valueOf())
        return ' ';

    var d = this;
    var gsMonthNames = new Array(
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    );

    var gsDayNames = new Array(
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    );

    return f.replace(/(yyyy|mmmm|mmm|mm|dddd|ddd|dd|hf|hh|nn|ss|a\/p)/gi,
        function($1) {
            switch ($1.toLowerCase()) {
                case 'yyyy':
                    return d.getFullYear();
                case 'mmmm':
                    return gsMonthNames[d.getMonth()];
                case 'mmm':
                    return gsMonthNames[d.getMonth()].substr(0, 3);
                case 'mm':
                    return (d.getMonth() + 1).zf(2);
                case 'dddd':
                    return gsDayNames[d.getDay()];
                case 'ddd':
                    return gsDayNames[d.getDay()].substr(0, 3);
                case 'dd':
                    return d.getDate().zf(2);
                case 'hf':
                    return d.getHours();
                case 'hh':
                    return ((h = d.getHours() % 12) ? h : 12).zf(2);
                case 'nn':
                    return d.getMinutes().zf(2);
                case 'ss':
                    return d.getSeconds().zf(2);
                case 'a/p':
                    return d.getHours() < 12 ? 'AM' : 'PM';
            }
        }
    );
}

if (!String.prototype.shuffle) {
    String.prototype.shuffle = function() {
        var a = this.split(""),
            n = a.length;

        for (var i = n - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
        }
        return a.join("");
    }
}

function getTextFromXML(doc) {
    var string = "";
    //for IE
    if ($.browser.msie && parseInt(jQuery.browser.version) == 10) {
        string = (new XMLSerializer()).serializeToString(doc);
    } else {
        if (window.ActiveXObject) {
            string = doc.xml;
        } else {
            string = (new XMLSerializer()).serializeToString(doc);
        }
    }
    return string;
}

// Adding in-case sensitive filter
jQuery.expr[':'].Contains = function(a, i, m) {
    if (m[3].trim() == "" || m[3].trim() == "''")
        return true
    else
        return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
};

// Adding in-case sensitive filter
jQuery.expr[':'].Matches = function(a, i, m) {
    if (m[3].trim() == "" || m[3].trim() == "''")
        return true
    else
        return (a.textContent || a.innerText || "").toUpperCase() === (m[3].toUpperCase());
};

//A Delay method based on timeout
var delay = (function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

(function() {
    function DateDiff(date1, date2) {
        this.days = null;
        this.hours = null;
        this.minutes = null;
        this.seconds = null;
        this.date1 = date1;
        this.date2 = date2;
        this.init();
    }

    DateDiff.prototype.init = function() {
        var data = new DateMeasure(this.date1 - this.date2);
        this.days = data.days;
        this.hours = data.hours;
        this.minutes = data.minutes;
        this.seconds = data.seconds;
    };

    function DateMeasure(ms) {
        var d, h, m, s;
        s = Math.floor(ms / 1000);
        m = Math.floor(s / 60);
        s = s % 60;
        h = Math.floor(m / 60);
        m = m % 60;
        d = Math.floor(h / 24);
        h = h % 24;

        this.days = d;
        this.hours = h;
        this.minutes = m;
        this.seconds = s;
    };

    Date.diff = function(date1, date2) {
        return new DateDiff(date1, date2);
    };

    Date.prototype.diff = function(date2) {
        return new DateDiff(this, date2);
    };
})();

if(!jQuery.browser){
    jQuery.uaMatch = function( ua ) {
        ua = ua.toLowerCase();

        var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
            /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
            /(msie)[\s?]([\w.]+)/.exec( ua ) ||
            /(trident)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
            [];

        return {
            browser: match[ 1 ] || "",
            version: match[ 2 ] || "0"
        };
    };

    matched = jQuery.uaMatch( navigator.userAgent );
    //IE 11+ fix (Trident)
    matched.browser = matched.browser == 'trident' ? 'msie' : matched.browser;
    browser = {};

    if ( matched.browser ) {
        browser[ matched.browser ] = true;
        browser.version = matched.version;
    }

    // Chrome is Webkit, but Webkit is also Safari.
    if ( browser.chrome ) {
        browser.webkit = true;
    } else if ( browser.webkit ) {
        browser.safari = true;
    }

    jQuery.browser = browser;
}

var crushFTP = {
    ajaxCallURL: "/WebInterface/function/",
    ajaxCallURLBase: "/WebInterface/function/",
    indicatorHTML: "<div class='loadingIndicator'><img src='/WebInterface/Resources/images/process_indicator.gif' alt='loding indicator' /></div>",
    buggyBrowser: $.browser.msie && $.browser.version <= 8,
    notAllowedChars: "!@#$%^&*()+=-[]\\\';,./{}|\":<>?~_ ",
    placeHolder: $("#placeHolder"),
    defaultRequestType: "POST",
    getCrushAuth: function() {
        var auth = $.cookie("currentAuth");
        if (auth && auth.length > 0)
            return auth; //.substr(auth.length - 4);
        else
            return false;
    },
    UI: {
        addItem: function(listing, newControl, data, callback, appendAfter) {
            if (appendAfter)
                appendAfter.after(newControl);
            else
                listing.append(newControl);
            newControl.data("controlData", data);
            newControl.parent().find(".ui-widget-header").removeClass("ui-widget-header").removeClass("ui-selected");
            newControl.addClass("ui-widget-header").addClass("ui-selected");
            listing.closest("div.sideScroll").scrollTo(newControl);
            if (callback)
                callback(newControl);
        },
        replaceItem: function(oldControl, newControl, data, callback) {
            oldControl.replaceWith(newControl);
            newControl.data("controlData", data);
            newControl.parent().find(".ui-widget-header").removeClass("ui-widget-header").removeClass("ui-selected");
            newControl.addClass("ui-widget-header").addClass("ui-selected");
            if (callback)
                callback(newControl);
        },
        removeItem: function(listing, callback, noConfirm, classToAdd) {
            var selected = listing.find("li.ui-selected");
            if (selected.length == 0) return;

            function continueRemove(flag) {
                var toFocus = [];
                if (selected.next("li").length > 0) {
                    toFocus = selected.next("li");
                } else if (selected.prev("li").length > 0) {
                    toFocus = selected.prev("li");
                }
                selected.remove();
                if (toFocus.length > 0) {
                    toFocus.parent().find(".ui-widget-header").removeClass("ui-widget-header").removeClass("ui-selected");
                    if (!classToAdd)
                        toFocus.addClass("ui-widget-header").addClass("ui-selected");
                    else
                        toFocus.addClass(classToAdd);
                    if (callback)
                        callback(toFocus, selected);
                } else {
                    if (callback)
                        callback(toFocus, selected);
                }
            }

            if (!noConfirm) {
                jConfirm("Are you sure you wish to remove this item?", "Confirm", function(flag) {
                    if (flag) {
                        continueRemove();
                    }
                });
            } else {
                continueRemove();
            }
        },
        copyItem: function(item, callback) {
            if (item.length > 0) {
                var copy = item.clone(true);
                item.parent().append(copy);
                copy.parent().find(".ui-widget-header").removeClass("ui-widget-header").removeClass("ui-selected");
                copy.addClass("ui-widget-header").addClass("ui-selected");
                if (callback)
                    callback(copy);
            }
        },
        moveItem: function(item, up, autoScroll, callback) {
            if (item.length > 0) {
                if (up) {
                    if (item.prev().length > 0)
                        item.prev().before(item);
                } else {
                    if (item.next().length > 0)
                        item.next().after(item);
                }
                if (autoScroll)
                    item.closest("div.sideScroll").scrollTo(item);
                if (callback)
                    callback(item);
            }
        },
        showIndicator: function(loaderOnly, blockElement, message) {
            if (loaderOnly) {
                blockElement = blockElement || $(".mainContentPanel");
                if (blockElement.length > 0) {
                    blockElement.find("div.loadingIndicator").remove();
                    blockElement.prepend(crushFTP.indicatorHTML);
                }
            } else {
                crushFTP.placeHolder = $("#placeHolder");
                blockElement = blockElement || crushFTP.placeHolder;
                if(blockElement.is(".userManagerPH"))
                    return;
                message = message || "Loading...";
                blockElement.block({
                    message: '<div><span style="float: left; margin-right: 0.3em;" class="ui-icon ui-icon-refresh"></span>' + message + '</div>',
                    css: {
                        border: 'none',
                        padding: '15px',
                        backgroundColor: '#000',
                        '-webkit-border-radius': '10px',
                        '-moz-border-radius': '10px',
                        opacity: .5,
                        color: '#fff',
                        width: '100px',
                        'text-align': 'left',
                        zIndex: 9999
                    },
                    overlayCSS: {
                        zIndex: "9999"
                    }
                });
            }
        },
        hideIndicator: function(loaderOnly, blockElement) {
            if (loaderOnly) {
                blockElement = blockElement || $(".mainContentPanel");
                if (blockElement.length > 0) {
                    blockElement.find("div.loadingIndicator").remove();
                }
            } else {
                blockElement = blockElement || crushFTP.placeHolder;
                if(blockElement.is(".userManagerPH"))
                    return;
                blockElement.unblock();
            }
        },
        initLoadingIndicator: function() {
            if($("#loadingIndicator").length==0)
                $("body").append("<div id='loadingIndicator'></div>");
            $("#loadingIndicator").dialog({
                autoOpen: false,
                dialogClass: "loadingIndicatorWindow",
                closeOnEscape: false,
                draggable: false,
                width: 150,
                minHeight: 50,
                modal: true,
                buttons: {},
                resizable: false,
                open: function() {
                    $('body').css('overflow', 'hidden');
                },
                close: function() {
                    $('body').css('overflow', 'auto');
                }
            });
        },
        showLoadingIndicator: function(data) {
            if (!data) return;
            $("#loadingIndicator").html(data.message && '' != data.message ? data.message : 'Please wait...');
            $("#loadingIndicator").dialog('option', 'title', data.title && '' != data.title ? data.title : 'Loading');
            $("#loadingIndicator").dialog('open');
        },
        hideLoadingIndicator: function() {
            try{
                $("#loadingIndicator").dialog('close');
            }
            catch(ex){}
            $("#loadingIndicator").dialog('destroy');
            crushFTP.UI.initLoadingIndicator();//a simple close doens't always work due to jQuery bug
        },
        checkUnchekInput: function(input, flag) {
            if (flag) {
                if (input.attr("type") == "radio") {
                    var selected = input.closest(".customForm").find("input[name='" + input.attr("name") + "']:checked");
                    if (input == selected) return;
                    input.closest(".customForm").find("input[name='" + input.attr("name") + "']").each(function() {
                        var _parent = $(this).parent().next();
                        $(_parent).removeClass("ui-state-active").removeClass("ui-icon-radio-off").removeClass("ui-icon ui-icon-circle-check").addClass("ui-icon-radio-off");
                        $(_parent).find("span").removeClass("ui-state-active").removeClass("ui-icon-radio-off").removeClass("ui-icon ui-icon-circle-check").addClass("ui-icon-radio-off");
                    });

                    input.attr("checked", "checked").parent("label").next().find("span").removeClass("ui-icon-radio-off").addClass("ui-icon ui-icon-circle-check");
                } else if (input.attr("type") == "checkbox") {
                    input.attr("checked", "checked").parent("label").next().find("span").addClass("ui-icon ui-icon-check");
                }
            } else {
                if (input.attr("type") == "radio") {
                    var selected = input.closest(".customForm").find("input[name='" + input.attr("name") + "']:checked");
                    if (input == selected) return;
                    input.removeAttr("checked").parent("label").next().find("span").addClass("ui-icon-radio-off").removeClass("ui-icon ui-icon-circle-check");
                } else if (input.attr("type") == "checkbox") {
                    input.removeAttr("checked").parent("label").next().find("span").removeClass("ui-icon").removeClass("ui-icon-check");
                }
            }
            return input;
        },
        isScrolledIntoView: function(elem) {
            if (!elem || elem.length == 0) return;
            var docViewTop = $(window).scrollTop();
            var docViewBottom = docViewTop + $(window).height();

            var elemTop = $(elem).offset().top;
            var elemBottom = elemTop + $(elem).height();

            return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom));
        },
        growl: function(title, content, warning, expires) {
            $("#growlContainer").notify({
                speed: 500,
                expires: expires
            });
            var handler = $("#growlContainer")
                .notify({
                    custom: true
                })
                .notify("create", {
                    title: title,
                    text: content
                });
            $(handler.element).removeClass("ui-state-error ui-state-highlight");
            if (warning) {
                $(handler.element).addClass("ui-state-error");
            } else {
                $(handler.element).addClass("ui-state-highlight");
            }
        },
        notification: function(msg, error) {
            if (!msg) {
                $("#notification").hide();
                return;
            }
            if (error) {
                $("#notification").removeClass("ui-state-highlight").removeClass("ui-state-error").empty().html(msg).show().addClass("ui-state-error").prepend('<span style="float: left; margin-right: 0.3em;" class="ui-icon ui-icon-alert"></span>');
            } else {
                $("#notification").removeClass("ui-state-highlight").removeClass("ui-state-error").empty().html(msg).show().addClass("ui-state-highlight").prepend('<span style="float: left; margin-right: 0.3em;" class="ui-icon ui-icon-info"></span>');
            }
        }
    },
    data: {
        serverRequest: function(dataToSubmit, callback, url, requestType, dataType) {
            dataToSubmit.c2f = crushFTP.getCrushAuth();
            requestType = requestType || crushFTP.defaultRequestType;
            for(var key in dataToSubmit){
                if(dataToSubmit[key] && typeof dataToSubmit[key] == "string"){
                    dataToSubmit[key] = dataToSubmit[key].replace(/{percent}2B/g, "%2B");
                }
            }
            url = url || crushFTP.ajaxCallURL;
            var obj = {
                type: requestType,
                url: url,
                data: dataToSubmit,
                success: function(msg) {
                    if(dataToSubmit.format != "JSONOBJ")
                    {
                        var text = msg && crushFTP.methods.textEncode($(msg).find("response").text()) || '';
                        if(text.indexOf("FAILURE")>=0 && text.toLowerCase().indexOf("access denied")<0){
                            crushFTP.UI.growl("Error: ", "Command failed: " + dataToSubmit.command + "<br>" + DOMPurify.sanitize($(msg).find("response").text()), true, true);
                        }
                    }
                    callback(msg);
                },
                error: function(xhr, textStatus, errorThrown) {
                    if (textStatus === 'error' || !xhr.responseText) {
                        callback(false, xhr, textStatus, errorThrown);
                        return;
                    } else {
                        callback(xhr.responseText);
                        return;
                    }
                    if (xhr && xhr.statusText && xhr.statusText == "OK" && xhr.response)
                        callback(xhr.response);
                    else
                        callback(false, xhr, textStatus, errorThrown);
                }
            };
            if (dataType)
                obj.dataType = dataType;
            if (dataToSubmit.nonAsync) {
                delete dataToSubmit.nonAsync;
                obj.async = false;
            }
            $.ajax(obj);
        },
        getValueFromJson: function(item, node) {
            if (item && item[node]) {
                return item[node];
            } else {
                return "";
            }
        },
        getTextContentFromPrefs: function(item, node) {
            if (item && item[node]) {
                return item[node];
            } else {
                return "";
            }
        },
        getTextValueFromXMLNode: function(item, text) {
            if (item && item.length > 0 && item[0] && item[0].text) {
                return item[0].text;
            } else {
                return text || "";
            }
        },
        getServerItem: function(key, callback, url) {
            url = url || crushFTP.ajaxCallURL;
            var obj = {
                command: "getServerItem",
                key: key
            };
            crushFTP.data.serverRequest(obj, callback, url);
        },
        getSelectedServerSettings: function(keys, callback, url) {
            url = url || crushFTP.ajaxCallURL;
            var obj = {
                command: "getServerSettingItems",
                keys: keys
            };
            crushFTP.data.serverRequest(obj, callback, url);
        },
        getSelectedServerInfo: function(keys, callback, url) {
            url = url || crushFTP.ajaxCallURL;
            var obj = {
                command: "getServerInfoItems",
                keys: keys
            };
            crushFTP.data.serverRequest(obj, callback, url);
        },
        encryptPass: function(pass, callback, url) {
            url = url || crushFTP.ajaxCallURL;
            var obj = {
                command: "encryptPassword",
                encrypt_type: "DES",
                password: encodeURIComponent(pass),
                c2f: crushFTP.getCrushAuth()
            };
            $.ajax({
                type: "POST",
                url: url,
                data: obj,
                success: function(data) {
                    if (data) {
                        callback($.xml2json(data, true));
                    } else {
                        callback(false);
                    }
                },
                error: function() {
                    callback(false);
                }
            });
        },
        loadAllPrefs: function(callback) {
            this.getServerItem("server_settings", callback);
        },
        getXMLPrefsDataFromServer: function(dataKey, callback, callback2) {
            var items = [];
            crushFTP.data.loadAllPrefs(function(data) {
                if ($(data).find("result_value").length > 0) {
                    data = data.getElementsByTagName("result_value")[0];
                    items = $.xml2json(data);
                    crushFTP.storage(dataKey, items);
                    crushFTP.storage(dataKey + "_RAW", data);
                }
                var availableJobs = [];
                crushFTP.data.serverRequest({
                        command: "getJob"
                    },
                    function(jobs) {
                        if (jobs && typeof jobs.getElementsByTagName != "undefined") {
                            if (jobs.getElementsByTagName("result_value") && jobs.getElementsByTagName("result_value").length > 0) {
                                $(jobs).find("result_value_subitem").each(function(index, el) {
                                    availableJobs.push(crushFTP.methods.textEncode($(this).text()));
                                });
                                $(document).data("AvailableJobs", availableJobs.sort());

                                var onlyJobSchedules = [];
                                $(jobs).find("result_value_subitem").each(function(index, el) {
                                    if ($(this).text().indexOf("_") != 0)
                                        onlyJobSchedules.push(crushFTP.methods.textEncode($(this).text()));
                                });
                                $(document).data("AvailableJobsNoEvents", onlyJobSchedules.sort());
                                if (callback2)
                                    callback2();
                            }
                        }
                    });
                if (callback) {
                    callback(data);
                }
            });
        },
        loadSelectedPrefs: function(settingKeys, infoKeys, callback) {
            var that = this;
            try{
                var settings, list, info, loaded = 0;

                function continueMerge(){
                    if(loaded<3)
                        return;
                    if(list && list.getElementsByTagName){
                        var listItems = list.getElementsByTagName("result_value")[0];
                            if(settings && settings.getElementsByTagName){
                                var settingsItems = settings.getElementsByTagName("result_value")[0];
                                var server_list = settings.createElement("server_list");
                                var cloneListItems = listItems.cloneNode(true);
                                server_list.appendChild(cloneListItems);
                                if(settingsItems && settingsItems.appendChild){
                                    settingsItems.appendChild(server_list);
                                        if(info && info.getElementsByTagName){
                                            var infoItems = info.getElementsByTagName("result_value")[0].children;
                                            if(infoItems && infoItems.length){
                                                for (var i = infoItems.length - 1; i >= 0; i--) {
                                                    var clone = infoItems[i].cloneNode(true);
                                                    settingsItems.appendChild(clone);
                                                };
                                            }
                                        }
                                        callback(settings);
                                }
                                else{
                                    callback(settings);
                                }
                            }
                            else{
                                callback();
                            }
                        }
                        else{
                            callback(false);
                        }
                }

                that.getSelectedServerSettings(settingKeys, function(msg){
                    settings = msg;
                    loaded++;
                    continueMerge();
                });

                that.getServerItem("server_settings/server_list", function(server_list){
                    list = server_list;
                    loaded++;
                    continueMerge();
                    }, crushFTP.ajaxCallURLBase);

                that.getSelectedServerInfo(infoKeys, function(_info){
                    info = _info;
                    loaded++;
                    continueMerge();
                });

            }catch(ex){
                crushFTP.UI.growl("Error : ", DOMPurify.sanitize(ex.message), true, true);
            }
        },
        getSelectedXMLPrefsDataFromServer: function(settingKeys, infoKeys, dataKey, callback, callback2) {
            var items = [];
            var _prefs, _allJobs, loaded = 0, availableJobs = [];

            function continueMerge(){
                if(loaded<2)
                    return;
                if ($(_prefs).find("result_value").length > 0) {
                    _prefs = _prefs.getElementsByTagName("result_value")[0];
                    items = $.xml2json(_prefs);
                    crushFTP.storage(dataKey, items);
                    crushFTP.storage(dataKey + "_RAW", _prefs);
                }
                if (_allJobs && typeof _allJobs.getElementsByTagName != "undefined") {
                    if (_allJobs.getElementsByTagName("result_value") && _allJobs.getElementsByTagName("result_value").length > 0) {
                        $(_allJobs).find("result_value_subitem").each(function(index, el) {
                                    availableJobs.push($(this).text());
                                });
                                $(document).data("AvailableJobs", availableJobs.sort());

                                var onlyJobSchedules = [];
                        $(_allJobs).find("result_value_subitem").each(function(index, el) {
                                    if ($(this).text().indexOf("_") != 0)
                                        onlyJobSchedules.push($(this).text());
                                });
                                $(document).data("AvailableJobsNoEvents", onlyJobSchedules.sort());
                                if (callback2)
                                    callback2();
                            }
                        }
                if (callback) {
                    callback(_prefs);
                }
            }

            crushFTP.data.loadSelectedPrefs(settingKeys, infoKeys, function(data) {
                _prefs = data;
                loaded++;
                continueMerge();
                    });

            crushFTP.data.serverRequest({
                command: "getJob"
            }, function(jobs) {
                _allJobs = jobs;
                loaded++;
                continueMerge();
            });
        },
        setXMLPrefs: function(dataKey, dataType, dataAction, entryData, callback, options) {
            var obj = {
                command: "setServerItem",
                key: dataKey,
                data_type: dataType,
                data_action: dataAction,
                data: entryData,
                c2f: crushFTP.getCrushAuth()
            };
            options = options || {};
            obj = $.extend(true, obj, options);
            $.ajax({
                type: "POST",
                url: crushFTP.ajaxCallURL,
                data: obj,
                success: function(msg) {
                    callback(msg);
                }
            });
        },
        updateLocalPrefs: function(data, key) {
            var dataJson = $.xml2json(data, true);
            if (dataJson) {
                var prefs = $(document).data("GUIXMLPrefs");
                if (key == "server_prefs") {
                    for (var item in dataJson) {
                        if (item.length && item.length > 0 && dataJson[item].length && dataJson[item].length > 0) {
                            prefs[item] = dataJson[item];
                        }
                    }
                } else {
                    prefs[key] = [dataJson];
                }
                $(document).data("GUIXMLPrefs", prefs);
            }
        },
        getSubValueFromPrefs: function(node) {
            var prefs = $(document).data("GUIXMLPrefs");
            if (prefs && prefs[node] && prefs[node][node + "_subitem"]) {
                return prefs[node][node + "_subitem"];
            } else {
                return [];
            }
        },
        getTextContent: function(obj) {
            if ($.browser.msie && parseInt(jQuery.browser.version) == 10) {
                var itm = {};
                itm.textContent = $(obj).text();
                return itm;
            } else {
                if (window.ActiveXObject) {
                    var obj2 = {};
                    try {
                        if (typeof obj.text != "undefined")
                            obj2.textContent = obj.text;
                        else
                            obj2.textContent = $(obj).text();
                    } catch (ex) {}
                    return obj2;
                } else {
                    return obj;
                }
            }
        },
        getPluginPrefs: function(plugin) {
            if (!plugin) return false;
            var prefs = $(document).data("GUIXMLPrefs");
            var plugins = prefs["plugins"];
            var availablePlugins = [];
            if (plugins) {
                plugins = plugins["plugins_subitem"];
                if (plugins) {
                    for (var i = 0; i < plugins.length; i++) {
                        var curItem = plugins[i];
                        curItem = curItem["plugins_subitem_subitem"];
                        for (var l = 0; l < curItem.length; l++) {
                            if (curItem && curItem[l] && curItem[l].pluginName) {
                                var name = curItem[l].pluginName;
                                if (name == plugin) {
                                    availablePlugins.push(curItem[l]);
                                }
                            }
                        }
                    }
                }
            }
            if (availablePlugins.length > 0) {
                return availablePlugins;
            } else {
                return false;
            }
        },
        refreshAvailableJobs: function(callback) {
            var availableJobs = [];
            crushFTP.data.serverRequest({
                    command: "getJob"
                },
                function(data) {
                    if (data && typeof data.getElementsByTagName != "undefined") {
                        if (data.getElementsByTagName("result_value") && data.getElementsByTagName("result_value").length > 0) {
                            $(data).find("result_value_subitem").each(function(index, el) {
                                availableJobs.push($(this).text());
                            });
                            $(document).data("AvailableJobs", availableJobs.sort());

                            var onlyJobSchedules = [];
                            $(data).find("result_value_subitem").each(function(index, el) {
                                if ($(this).text().indexOf("__") != 0)
                                    onlyJobSchedules.push($(this).text());
                            });
                            $(document).data("AvailableJobsNoEvents", onlyJobSchedules.sort());
                            callback(onlyJobSchedules.sort());
                        }
                    }
                });
        }
    },
    storage: function(key, val) {
        if (key) {
            if (val) {
                crushFTP.storageData = crushFTP.storageData || [];
                if (!crushFTP.storageData.has(key))
                    crushFTP.storageData.push(key);
                return $(document).data(key, val);
            } else {
                return $(document).data(key);
            }
        } else {
            return false;
        }
    },
    removeStorage: function(key) {
        if ($(document).data(key)) {
            crushFTP.storageData = crushFTP.storageData || [];
            if (crushFTP.storageData.has(key))
                crushFTP.storageData.removeByVal(key);
            $(document).removeData(key);
        }
    },
    userLogin: {
        //Login status thread
        userLoginStatusCheckThread: function() {
            if (!crushFTP.loginStatusThreadInterval) {
                crushFTP.loginStatusThreadInterval = setInterval(
                    function() {
                        var targetUrl = window.location.toString();
                        crushFTP.userLogin.bindUserName(function(response, username) {
                            if (response == "failure") {
                                if (crushFTP.placeHolder) {
                                    crushFTP.placeHolder.removeData("hasChanged");
                                }
                                window.location = targetUrl;
                            }
                        });
                    }, 300000);
            }
        },
        //Bind user name
        bindUserName: function(callBack) { /* Data to POST to receive file listing */
            var obj = {
                command: "getUsername",
                random: Math.random(),
                c2f: crushFTP.getCrushAuth()
            }; /* Make a call and receive list */
            var username = "anonymous";
            $.ajax({
                type: "GET",
                url: crushFTP.ajaxCallURL,
                data: obj,
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    errorThrown = errorThrown || "getUsername failed";
                    crushFTP.UI.growl("Error : ", errorThrown, true, true);
                    callBack("failure", username);
                },
                success: function(msg) {
                    var responseText = msg;
                    try {
                        var response = msg.getElementsByTagName("response");
                        response = crushFTP.data.getTextContent(response[0]).textContent;
                        if (response == "success") {
                            username = msg.getElementsByTagName("username");
                            username = crushFTP.data.getTextContent(username[0]).textContent;
                        }
                        if (username == "anonymous" || username == "") {
                            callBack("failure", username);
                            return false;
                        } else {
                            $(document).data("username", username);
                        }
                        var loggedInAs = $("#loggedInAs");
                        if (loggedInAs.length > 0) {
                            loggedInAs.html("<i class='fa fa-user'></i> <span class='ui-priority-primary'>" + username + "</span>");
                            window.accountExpiresNote = function(text) {
                                if (text) {
                                    loggedInAs.append("<span>, Expires : <span class='ui-priority-secondary'>" + text + "</span></span>");
                                }
                            }
                        }
                    } catch (ex) {
                        if (callBack) {
                            callBack("failure", username);
                            return false;
                        }
                    }
                    if (callBack) {
                        callBack(response, username);
                    }
                }
            });
        }
    },
    methods: {
        //Generate random code based on length, numeric flag restricts code to be numbers only
        generateRandomPassword: function(length, numeric, possible) {
            length = length || 8;
            var randomId = "";
            possible = possible || "ABCDEFGHKMNPQRTUVWXYZabcdefghkmnpqrtuvwxyz2346789";
            if (numeric) {
                possible = "2346789";
            }
            for (var i = 0; i < length; i++)
                randomId += possible.charAt(Math.floor(Math.random() * possible.length));
            return randomId;
        },
        maskPassword: function(value, exp){
            if(exp){
                return new Array(value.length+1).join('*');
            }
            try{
                url = URI(value);
            }catch(ex){
                url = URI(encodeURI(value));
            }
            if(url)
            {
                var pass = url.password();
                var mask = false;
                var origVal = value + "";
                mask = new Array(pass.length+1).join('*');
                if(pass)
                {
                    url.password(mask);
                    var _val = url.toString();
                    if(value.endsWith("?"))
                        _val = _val + "?";
                    if(origVal.endsWith("}") && !origVal.endsWith("/") && _val.endsWith("/")){
                        _val = _val.substr(0, _val.length-1);
                    }
                    return _val;
                }
            }
            return value;
        },
        dottedQuadToInt: function(ip) {
            if (!ip) return false;
            var parts = ip.split('.', 4);
            if (parts.length < 4) return 0;
            var result = 0,
                base = 1;
            for (var i = 3; i >= 0; i--) {
                //validation
                if (parts[i].length == 0 || parts[i].length > 3) return -1;
                var segment = parseInt(parts[i], 10);
                if (isNaN(segment) || segment < 0 || segment > 255) return -1;

                //compute next segment
                result += base * segment;
                base = base << 8;
            }
            return result;
        },
        isValidDomain: function(domain){
            var re = new RegExp(/^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/);
            return domain.match(re);
        },
        // Validate IP Address
        isValidIP: function(ip) {
            var isValid = false;
            var origVal = ip + "";
            if (ip == "0.0.0.0") isValid = true;
            ip = crushFTP.methods.dottedQuadToInt(ip);
            if (ip <= 0) isValid = false;

            //mulitcast range:
            if (ip >= 3758096384 && ip <= 4026531839) isValid = false;

            //alternate way to check multicast:
            if (ip >= crushFTP.methods.dottedQuadToInt('224.0.0.0') && ip <= crushFTP.methods.dottedQuadToInt('239.255.255.255')) isValid = false;

            if(!isValid)
                isValid = this.isValidIPv6(origVal);
            return isValid;
        },
        isValidIPv6: function(str) {
            return /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/.test(str);
        },
        isMatchingIPRange: function(startIP, stopIP){
            startIP = $.trim(startIP);
            stopIP = $.trim(stopIP);
            if((startIP == "0.0.0.0" || startIP.startsWith("255.255.255")) && (stopIP == "0.0.0.0" || stopIP.startsWith("255.255.255")))
                return true;
            var start = startIP.split(".");
            var stop = stopIP.split(".");
            if(start[0] != stop[0] || start[1] != stop[1]){
                return false;
            }
            return true;
        },
        isValidAnyIPAddress: function(ip, allowedIPs, ipv6) {
            if (!ip || ip.length == 0) return false;
            if (allowedIPs.has(ip.toLowerCase())) return true;
            ip = ip.split(".");
            var result = true;
            if (ip.length != 4 && !ipv6) return false;
            for (var i = 0; i < ip.length; i++) {
                if (!crushFTP.methods.isNumeric(ip[i])) {
                    result = false;
                    i = ip.length;
                }
            }
            if (ipv6 && !result) {
                result = crushFTP.methods.isValidIPv6($.trim(ip));
            }
            return result;
        },
        //Validate numbers
        isNumeric: function(input) {
            return ((input - 0) == input && input.length > 0);
        },
        //Validate Email address
        isValidEmail: function(email) {
            return (email.indexOf("@") > 0 && email.lastIndexOf(".") > email.indexOf("@"));
        },
        formatBytes: function(bytes) {
            bytes = Number(bytes);
            if (isNaN(bytes) || bytes < 0) return bytes;
            const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
            let i = 0;
            while (bytes >= 1024 && i < units.length - 1) {
                bytes /= 1024;
                i++;
            }
            return bytes.toFixed(1) + " " + units[i];
        },
        formatTime: function(secs) {
            var remaining = "";
            if (!secs) return "";
            if (secs.indexOf(".") < 0)
                secs = secs + ".0";
            secs = secs.substring(0, secs.indexOf(".")) * 1;
            var mins = (secs / 60) + ".0";
            mins = mins.substring(0, mins.indexOf(".")) * 1;
            if (mins > 0) {
                secs -= (mins * 60);
                remaining = mins + " min, " + secs + " secs";
            } else {
                if (secs < 0) {
                    remaining = "Calculating";
                } else {
                    remaining = secs + " secs";
                }
            }
            return remaining;
        },
        isValidDate: function(d) {
            if (Object.prototype.toString.call(d) !== "[object Date]")
                return false;
            return !isNaN(d.getTime());
        },
        isDate: function(str, uk) {
            var parms = str.split(/[\.\-\/]/);
            var yyyy = parseInt(parms[2], 10);
            var mm = parseInt(parms[1], 10);
            var dd = parseInt(parms[0], 10);
            if (uk) {
                mm = parseInt(parms[0], 10);
                dd = parseInt(parms[1], 10);
            }
            var date = new Date(yyyy, mm - 1, dd, 0, 0, 0, 0);
            return mm === (date.getMonth() + 1) &&
                dd === date.getDate() &&
                yyyy === date.getFullYear();
        },
        isDateTS: function(dt) {
            var isvalid = true;
            if (dt.length != 12)
                isvalid = false;

            if (!crushFTP.methods.isNumeric(dt))
                isvalid = false;

            if (isvalid) {
                var mm = parseInt(dt.substr(0, 2));
                var dd = parseInt(dt.substr(2, 2));
                var yyyy = parseInt(dt.substr(4, 4));
                var hh = parseInt(dt.substr(8, 2));
                var _mm = parseInt(dt.substr(10, 2));
                if (mm < 1 || mm > 12)
                    isvalid = false;
                if (dd < 1 || dd > 31)
                    isvalid = false;
                if (hh < 1 || hh > 24)
                    isvalid = false;
                if (_mm < 1 || _mm > 60)
                    isvalid = false;
            }
            return isvalid;
        },
        isDateTime: function(str) {
            if (!str || str.length == 0)
                return "";
            var errormessage = "";
            var isvalid = false;
            var dt = str;
            var parts = dt.split(" ");
            if (parts.length == 3) {
                var date = parts[0];
                var time = parts[1];
                var ampm = parts[2];
                if (ampm.length == 2 && (ampm.toLowerCase() == "am" || ampm.toLowerCase() == "pm")) {
                    var validformatdate = /^\d{2}\/\d{2}\/\d{4}$/;
                    var validformatdate2 = /^\d{2}\/\d{2}\/\d{2}$/;
                    if (validformatdate.test(date) || validformatdate2.test(date)) {
                        var validformattime = /^\d{1,2}:\d{2}$/;
                        if (validformattime.test(time)) {
                            isvalid = true;
                        } else {
                            errormessage = "Time is not in the format HH:mm";
                        }
                    } else {
                        errormessage = "Date is not in the format dd/MM/yyyy";
                    }
                } else {
                    errormessage = "DateTime does not have AM/PM at the end";
                }
            } else {
                errormessage = "DateTime is not in the format MM/dd/yyyy hh:mm am/pm";
            }
            return errormessage;
        },
        //Check if input has special characters
        hasSpecialCharacters: function(input, charset) {
            if (input) {
                charset = charset || crushFTP.notAllowedChars;
                for (var i = 0; i < input.length; i++) {
                    if (charset.indexOf(input.charAt(i)) != -1) {
                        return true;
                    }
                }
            }
            return false;
        },
        removeSpecialChars: function(strVal) {
            return strVal.replace(/[^a-zA-Z 0-9]+/g, '');
        },
        //Check if input starts with number
        startsWithNumber: function(input) {
            input = input.replace(/(^\d+)(.+$)/i, '$1');
            return !isNaN(input);
        },
        rebuildSubItems: function(item, name) {
            if (item && name) {
                if (!item[name + "_subitem"]) {
                    item[name + "_subitem"] = [];
                } else if (!item[name + "_subitem"].push) {
                    var slab = item[name + "_subitem"];
                    item[name + "_subitem"] = [slab];
                }
            }
        },
        logout: function(elem) {
            $.ajax({
                type: "POST",
                url: crushFTP.ajaxCallURL,
                data: {
                    command: "logout",
                    random: Math.random(),
                    c2f: crushFTP.getCrushAuth()
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    $.cookie("currentAuth", "", {
                        path: '/',
                        expires: -1
                    });
                    document.location = document.location;
                },
                success: function(msg) {
                    //Remove CrushAuth cookie and redirect to login page
                    $.cookie("currentAuth", "", {
                        path: '/',
                        expires: -1
                    });
                    document.location = document.location;
                }
            });
        },
        getInputValue: function(id, panel) {
            if (panel && $("#" + id, panel).length > 0) {
                var type = $("#" + id, panel).attr("type");
                type = type || "";
                type = type.toLowerCase();
                if (type == "checkbox" || type == "radio") {
                    return $("#" + id, panel).is(":checked");
                } else {
                    return $("#" + id, panel).val();
                }
            } else if ($("#" + id).length > 0) {
                var type = $("#" + id).attr("type");
                type = type || "";
                type = type.toLowerCase();
                if (type == "checkbox" || type == "radio") {
                    return $("#" + id).is(":checked");
                } else {
                    return $("#" + id).val();
                }
            } else {
                return "";
            }
        },
        sortObjectsRefKey: function(a, b) {
            if (a.key < b.key)
                return -1;
            if (a.key > b.key)
                return 1;
            return 0;
        },
        jsonToXML: function(json, flag, reverseEncode, noEncode, asIs, asIs2) {
            if (!json) return "";
            var xml = [];
            for (var item in json) {
                var curItem = json[item];
                if (!$.isFunction(curItem)) {
                    if (curItem && curItem[0] && curItem[0][item + "_subitem"]) {
                        var subItem = curItem[0][item + "_subitem"];
                        xml.push("<" + item + "  type=\"vector\">");
                        if (subItem && subItem.length > 0) {
                            var itemTypeText = "";
                            var subItemType = subItem[0].type;
                            if (subItemType) {
                                if ($.isArray(subItemType) && subItemType.length > 1) {
                                    itemTypeText = "type =\"" + subItemType[1] + "\"";
                                } else if (typeof subItemType === "string") {
                                    itemTypeText = "type =\"" + subItemType + "\"";
                                }
                            }
                            if ($.isArray(subItem) && subItem.length > 1) {
                                for (var subSubItem in subItem) {
                                    var curSubItem = subItem[subSubItem];
                                    if (!$.isFunction(curSubItem)) {
                                        xml.push("<" + item + "_subitem " + itemTypeText + ">" + crushFTP.methods.jsonToXML(curSubItem, true, reverseEncode, noEncode, asIs, asIs2) + "</" + item + "_subitem>");
                                    }
                                }
                            } else {
                                xml.push("<" + item + "_subitem " + itemTypeText + ">" + crushFTP.methods.jsonToXML(subItem, true, reverseEncode, noEncode, asIs, asIs2) + "</" + item + "_subitem>");
                            }
                        }
                        xml.push("</" + item + ">");
                    } else {
                        var textVal = curItem;
                        if ($.isArray(textVal)) {
                            if (textVal.length > 0) {
                                textVal = textVal[0];
                                if (typeof textVal.text != "undefined") {
                                    textVal = textVal.text;
                                } else if (typeof textVal != "string") {
                                    textVal = "";
                                }
                            } else {
                                textVal = "";
                            }
                        } else if (flag) {
                            xml.push(crushFTP.methods.jsonToXML(curItem, false, reverseEncode, noEncode, asIs, asIs2));
                        }

                        if (item.toLowerCase() != "type" && typeof curItem != "string") {
                            if (typeof textVal == "string" && textVal != "undefined") {
                                if (reverseEncode)
                                    xml.push("<" + item + ">" + crushFTP.methods.htmlEncode(crushFTP.methods.decodeXML(textVal)) + "</" + item + ">");
                                else if (noEncode)
                                    xml.push("<" + item + ">" + crushFTP.methods.decodeXML(textVal) + "</" + item + ">");
                                else if (asIs)
                                    xml.push("<" + item + ">" + crushFTP.methods.htmlEncode2(textVal).replace(/(%2B|%25)/g, function(str, item) {
                                        return crushFTP.methods.xmlUnSafeCharsMappingReverse[item];
                                    }) + "</" + item + ">");
                                else if (asIs2)
                                    xml.push("<" + item + ">" + crushFTP.methods.htmlEncode2(textVal) + "</" + item + ">");
                                else
                                    xml.push("<" + item + ">" + crushFTP.methods.htmlEncode(textVal) + "</" + item + ">");
                            }
                        } else {
                            if (typeof curItem != "string") {
                                textVal = curItem[0].text;
                                if (textVal && typeof textVal == "string" && textVal != "undefined") {
                                    if (reverseEncode)
                                        xml.push("<" + item + ">" + crushFTP.methods.htmlEncode(crushFTP.methods.decodeXML(textVal)) + "</" + item + ">");
                                    else if (noEncode)
                                        xml.push("<" + item + ">" + crushFTP.methods.decodeXML(textVal) + "</" + item + ">");
                                    else if (asIs)
                                        xml.push("<" + item + ">" + crushFTP.methods.htmlEncode2(textVal).replace(/(%2B|%25)/g, function(str, item) {
                                            return crushFTP.methods.xmlUnSafeCharsMappingReverse[item];
                                        }) + "</" + item + ">");
                                    else if (asIs2)
                                        xml.push("<" + item + ">" + crushFTP.methods.htmlEncode2(textVal) + "</" + item + ">");
                                    else
                                        xml.push("<" + item + ">" + crushFTP.methods.htmlEncode(textVal) + "</" + item + ">");
                                }
                            }
                        }
                    }
                }
            }
            return xml.join("\r\n");
        },
        setPageTitle: function(title, append) {
            if (title) {
                if (append) {
                    title = $(document).data("pageTitle") + " :: " + title;
                }
                document.title = title;
            } else if ($(document).data("pageTitle")) {
                document.title = $(document).data("pageTitle");
            }
        },
        xmlUnSafeCharsMapping: {
            '&': '&amp;',
            '"': '&quot;',
            "'": '&apos;',
            '<': '&lt;',
            '>': '&gt;'
        },
        xmlUnSafeCharsMapping2: {
            '&': '&amp;',
            '"': '&quot;',
            "'": '&apos;',
            '<': '&lt;',
            '>': '&gt;',
            '%': '%25',
            '+': '%2B'
        },
        xmlUnSafeCharsMappingReverse: {
            '&amp;': '&',
            '&quot;': '"',
            '&apos;': "'",
            '&lt;': '<',
            '&gt;': '>',
            '%2B': '+',
            '%25': '%'
        },
        xmlEncode: function(value) {
            if (value == undefined || value.length == 0) return value;
            return value.replace(/([\&'"<>])/g, function(str, item) {
                return crushFTP.methods.xmlUnSafeCharsMapping[item];
            }).replace(/\%/g, "%25").replace(/\+/g, "%2B");
        },
        xmlEncode2: function(value) {
            if (value == undefined || value.length == 0) return value;
            value = value.replace(/(%2B|%25)/g,
                function(str, item) {
                    return crushFTP.methods.xmlUnSafeCharsMappingReverse[item];
                });
            return value.replace(/([\&'"<>%+])/g, function(str, item) {
                return crushFTP.methods.xmlUnSafeCharsMapping2[item];
            });
        },
        decodeXML: function(value) {
            try {
                if (value == undefined || value.length == 0) return value;
                return value.replace(/(&quot;|&lt;|&gt;|&amp;|&apos;)/g,
                    function(str, item) {
                        return crushFTP.methods.xmlUnSafeCharsMappingReverse[item];
                    });
            } catch (ex) {
                console.log(value, ex);
            }
        },
        htmlEncode: function(value, encodeVal, ignore) {
            if(!value)return value;
            if(!value.split && $.isArray(value)){
               value = value[0].text;
            }
            if (ignore) return value.replace(/\&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
            if (value != undefined && value.length > 0) {
                var lines = value.split(/\r\n|\r|\n/);
                for (var i = 0; i < lines.length; i++) {
                    if (lines[i] && typeof lines[i] == "string")
                        lines[i] = crushFTP.methods.xmlEncode(lines[i]);
                }
                if (encodeVal)
                    return encodeURIComponent(lines.join('\r\n'));
                else
                    return lines.join('\r\n');
            } else
                return value;
        },
        htmlEncode2: function(value, encodeVal, ignore) {
            if (ignore) return value.replace(/\&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
            if (value != undefined && value.length > 0) {
                var lines = value.split(/\r\n|\r|\n/);
                for (var i = 0; i < lines.length; i++) {
                    if (lines[i] && typeof lines[i] == "string")
                        lines[i] = crushFTP.methods.xmlEncode2(lines[i]);
                }
                if (encodeVal)
                    return encodeURIComponent(lines.join('\r\n'));
                else
                    return lines.join('\r\n');
            } else
                return value;
        },
        textEncode: function(val) {
            return $("<div>").text(val).html();
        },
        xssEncode: function(val) {
            return crushFTP.methods.htmlEncode(crushFTP.methods.textEncode(unescape(val)));
        },
        encode: function(value) {
            return $('<div/>').text(value).html();
        },
        decode: function(value) {
            return $('<div/>').html(value).text();
        },
        round: function(number, digits) {
            var multiple = Math.pow(10, digits);
            var rndedNum = Math.round(number * multiple) / multiple;
            return rndedNum;
        },
        pad: function(value, length, padChar) {
          padChar = padChar || '0';
          value = value + '';
          return value.length >= length ? value : new Array(length - value.length + 1).join(padChar) + value;
        },
        getScript: function(url, callback){
            if(localCache.exist(url)){
                var data = localCache.get(url);
                $("script[data-key='"+data.key+"']").remove();
                var script = document.createElement("script");
                script.setAttribute("data-key", data.key);
                script.innerHTML = data.js;
                document.body.appendChild(script);
                callback(data.js);
            }
            else{
                $.get(url).done(function(js){
                    var script = document.createElement("script");
                    script.innerHTML = js;
                    var key = crushFTP.methods.generateRandomPassword();
                    script.setAttribute("data-key", key);
                    document.body.appendChild(script);
                    localCache.set(url, {js:js, key:key}, callback);
                }).fail(function(err){
                    callback(false, err.status, err);
                    throw err;
                })
            }
        },
        createCSSClass: function(selector, style) {
            if (!document.styleSheets) {
                return;
            }
            if (document.getElementsByTagName("head").length == 0) {
                return;
            }
            var stylesheet;
            var mediaType;
            if (document.styleSheets.length > 0) {
                for (i = 0; i < document.styleSheets.length; i++) {
                    if (document.styleSheets[i].disabled) {
                        continue;
                    }
                    var media = document.styleSheets[i].media;
                    mediaType = typeof media;
                    if (mediaType == "string") {
                        if (media == "" || (media.indexOf("screen") != -1)) {
                            styleSheet = document.styleSheets[i];
                        }
                    } else if (mediaType == "object") {
                        if (media.mediaText == "" || (media.mediaText.indexOf("screen") != -1)) {
                            styleSheet = document.styleSheets[i];
                        }
                    }
                    if (typeof styleSheet != "undefined") {
                        break;
                    }
                }
            }
            if (typeof styleSheet == "undefined") {
                var styleSheetElement = document.createElement("style");
                styleSheetElement.type = "text/css";
                document.getElementsByTagName("head")[0].appendChild(styleSheetElement);
                for (i = 0; i < document.styleSheets.length; i++) {
                    if (document.styleSheets[i].disabled) {
                        continue;
                    }
                    styleSheet = document.styleSheets[i];
                }
                var media = styleSheet.media;
                mediaType = typeof media;
            }
            if (mediaType == "string") {
                for (i = 0; i < styleSheet.rules.length; i++) {
                    if (styleSheet.rules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
                        styleSheet.rules[i].style.cssText = style;
                        return;
                    }
                }
                styleSheet.addRule(selector, style);
            } else if (mediaType == "object") {
                for (i = 0; i < styleSheet.cssRules.length; i++) {
                    if (styleSheet.cssRules[i].selectorText && styleSheet.cssRules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
                        styleSheet.cssRules[i].style.cssText = style;
                        return;
                    }
                }
                styleSheet.insertRule(selector + "{" + style + "}", 0);
            }
        },
        getOppositeColor: function(color) {
            function decimalToHex(decimal) {
                var hex = decimal.toString(16);
                if (hex.length == 1) hex = '0' + hex;
                return hex;
            }

            function hexToDecimal(hex) {
                return parseInt(hex, 16);
            }

            function returnOpposite(colour) {
                return decimalToHex(255 - hexToDecimal(colour.substr(0, 2))) +
                    decimalToHex(255 - hexToDecimal(colour.substr(2, 2))) +
                    decimalToHex(255 - hexToDecimal(colour.substr(4, 2)));
            }
            return returnOpposite(color.replace("#", ""));
        },
        getTextRangeSelection: function() {
            var text = "";
            if (window.getSelection && window.getSelection().toString() && $(window.getSelection()).attr('type') != "Caret") {
                text = window.getSelection();
                return text.toString();
            } else if (document.getSelection && document.getSelection().toString() && $(document.getSelection()).attr('type') != "Caret") {
                text = document.getSelection();
                return text.toString();
            } else {
                var selection = document.selection && document.selection.createRange();

                if (!(typeof selection === "undefined") && selection.text && selection.text.toString()) {
                    text = selection.text;
                    return text.toString();
                }
            }
            return false;
        },
        getHTMLRangeSelection: function() {
            var range;
            if (document.selection && document.selection.createRange) {
                range = document.selection.createRange();
                return range.htmlText;
            } else if (window.getSelection) {
                var selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    range = selection.getRangeAt(0);
                    var clonedSelection = range.cloneContents();
                    var div = document.createElement('div');
                    div.appendChild(clonedSelection);
                    return div.innerHTML;
                } else {
                    return '';
                }
            } else {
                return '';
            }
        },
        removeTextRangeSelection: function() {
            // Remove selection range, it messes up UI as all the text came between selection highlights in native browser selection manner
            if (window.getSelection) // Modern Browsers
            {
                var selection = window.getSelection();
                if (selection.removeAllRanges) {
                    selection.removeAllRanges();
                }
            }
            if (document.getSelection) // IE
            {
                var selection = document.getSelection();
                if (selection.removeAllRanges) {
                    selection.removeAllRanges();
                }
            }
        },
        queryString: function(name) {
            if (!name) return false;
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(window.location.search);
            if (results == null)
                return "";
            else
                return decodeURIComponent(results[1].replace(/\+/g, " "));
        },
        extractLastPath: function (url) {
          const trimmedUrl = url.endsWith("/") ? url.slice(0, -1) : url;
          const parts = trimmedUrl.split("/");
          const lastPart = parts[parts.length - 1];
          if (lastPart.includes("@")) {
            return "";
          }
          return lastPart;
        },
        getFileExtension: function (filename, url) {
          var str = url ? crushFTP.methods.extractLastPath(filename) : filename;
          var ext = /^.+\.([^.]+)$/.exec(str);
          return ext == null ? "" : ext[1].toLowerCase();
        },
        isVisibleOnScreen: function(elem) {
            if (!elem || elem.length == 0) return;
            var docViewTop = $(window).scrollTop();
            var docViewBottom = docViewTop + $(window).height();
            var elemTop = $(elem).offset().top;
            var elemBottom = elemTop + $(elem).height();
            return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom));
        },
        stripScripts: function(s) {
            var div = document.createElement('div');
            div.innerHTML = s;
            var scripts = div.getElementsByTagName('script');
            var i = scripts.length;
            while (i--) {
                scripts[i].parentNode.removeChild(scripts[i]);
            }
            return div.innerHTML;
        },
        difference: function(object, base) {
            function changes(object, base) {
                return _.transform(object, function(result, value, key) {
                    if (!_.isEqual(value, base[key])) {
                        result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
                    }
                });
            }
            return changes(object, base);
        },
        validateUserLoginState: function(){
            crushFTP.userLogin.bindUserName(function (response, username) {
                if (response == "failure") {
                    window.location = "/WebInterface/login.html";
                }
            });
        },
        isHTML: function(str) {
          str = str.replace('<span id="sceditor-end-marker" class="sceditor-selection sceditor-ignore" style="line-height: 0; display: none;"> </span><span id="sceditor-start-marker" class="sceditor-selection sceditor-ignore" style="line-height: 0; display: none;"> </span>', "").replace('<span id="sceditor-start-marker" class="sceditor-selection sceditor-ignore" style="line-height: 0; display: none;"> </span><span id="sceditor-end-marker" class="sceditor-selection sceditor-ignore" style="line-height: 0; display: none;"> </span>', "");
          var a = document.createElement('div');
          a.innerHTML = str;

          a.querySelectorAll("*").forEach((x)=>{
            let tagName = "</" + x.tagName + ">";
            if (x.outerHTML.slice(tagName.length).toUpperCase() == tagName
                && /[^\s]/.test(x.innerHTML)) {
                x.remove();
            }
          });

          for (var c = a.childNodes, i = c.length; i--; ) {
            if (c[i].nodeType == 1) return true;
          }

          return false;
        }
    }
};

function focusTip(form) {
    form.find(".show-focus-tip").bind("focus", function() {
        $(this).parent().parent().find(".focus-tip").show();
    }).bind("blur", function() {
        $(this).parent().parent().find(".focus-tip").hide();
    });
    form.find(".focus-tip").hide();
}

$.fn.isolatedScroll = function() {
    this.bind('mousewheel DOMMouseScroll', function(e) {
        var delta = e.wheelDelta || (e.originalEvent && e.originalEvent.wheelDelta) || -e.detail,
            bottomOverflow = this.scrollTop + $(this).outerHeight() - this.scrollHeight >= 0,
            topOverflow = this.scrollTop <= 0;

        if ((delta < 0 && bottomOverflow) || (delta > 0 && topOverflow)) {
            e.preventDefault();
        }
    });
    return this;
};

var crushFTPTools = {
    queryString: function(name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        var param = match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        return param || "";
    },
    getCrushAuth: function() {
        var auth = $.cookie("currentAuth");
        if (auth && auth.length > 0)
            return auth; //.substr(auth.length - 4);
        else
            return false;
    },
    xmlUnSafeCharsMapping: {
        '&': '&amp;',
        '"': '&quot;',
        "'": '&apos;',
        '<': '&lt;',
        '>': '&gt;'
    },
    xmlUnSafeCharsMappingReverse: {
        '&amp;': '&',
        '&quot;': '"',
        '&apos;': "'",
        '&lt;': '<',
        '&gt;': '>',
        '%2B': '+',
        '%25': '%'
    },
    xmlEncode: function(value, onlyHTML) {
        if (value == undefined || value.length == 0) return value;
        if (onlyHTML) {
            try {
                value = crushFTPTools.decodeURILocal(value);
            } catch (ex) {
                value = value;
            }
            return value.replace(/([\&'"<>])/g, function(str, item) {
                return crushFTPTools.xmlUnSafeCharsMapping[item];
            });
        } else {
            return value.replace(/([\&'"<>])/g, function(str, item) {
                return crushFTPTools.xmlUnSafeCharsMapping[item];
            }).replace(/\%/g, "%25").replace(/\+/g, "%2B");
        }
    },
    decodeXML: function(value) {
        if (value == undefined || value.length == 0) return value;
        return value.replace(/(&quot;|&lt;|&gt;|&amp;|&apos;|%2B|%25)/g,
            function(str, item) {
                return crushFTPTools.xmlUnSafeCharsMappingReverse[item];
            });
    },
    htmlEncode: function(value, encodeVal, onlyHTML) {
        if (value != undefined && value.length > 0) {
            var lines = value.split(/\r\n|\r|\n/);
            for (var i = 0; i < lines.length; i++) {
                if (lines[i] && typeof lines[i] == "string")
                    lines[i] = crushFTPTools.xmlEncode(lines[i], onlyHTML);
            }
            if (encodeVal)
                return crushFTPTools.encodeURILocal(lines.join('\r\n'));
            else
                return lines.join('\r\n');
        } else
            return value;
    },
    decodeURILocal: function(val) {
        var _val = val;
        try {
            _val = decodeURIComponent(val);
        } catch (ex) {}
        return _val;
    },
    /* added by carlos */
    limitText: function(val, limite) {
        var _val = (val.length > limite) ? val.substring(0, limite) + '...' : val;

        return _val;
    },
    encodeURILocal: function(val) {
        var _val = val;
        try {
            _val = encodeURIComponent(val);
        } catch (ex) {}
        return crushFTPTools.sanitize(_val);
    },
    textEncode: function(val) {
        return $("<div>").text(val).html();
    },
    xssEncode: function(val) {
        return crushFTPTools.htmlEncode(crushFTPTools.textEncode(unescape(val)));
    },
    sanitize : function(str){
        if(!str)return str;
        var tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';
        var tagOrComment = new RegExp(
            '<(?:'
            // Comment body.
            + '!--(?:(?:-*[^->])*--+|-?)'
            // Special "raw text" elements whose content should be elided.
            + '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*'
            + '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
            // Regular name
            + '|/?[a-z]'
            + tagBody
            + ')>',
            'gi');
        function removeTags(html) {
          var oldHtml;
          do {
            oldHtml = html;
            html = html.replace(tagOrComment, '');
          } while (html !== oldHtml);
          return html.replace(/</g, '&lt;');
        }
        return removeTags(str);
    },
    long2ip : function(proper_address) {
        // Converts an (IPv4) Internet network address into a string in Internet standard dotted format
        //
        // version: 1109.2015
        // discuss at: http://phpjs.org/functions/long2ip
        // +   original by: Waldo Malqui Silva
        // *     example 1: long2ip( 3221234342 );
        // *     returns 1: '192.0.34.166'
        var output = false;
        if (!isNaN(proper_address) && (proper_address >= 0 || proper_address <= 4294967295)) {
            output = Math.floor(proper_address / Math.pow(256, 3)) + '.' +
            Math.floor((proper_address % Math.pow(256, 3)) / Math.pow(256, 2)) + '.' +
            Math.floor(((proper_address % Math.pow(256, 3)) % Math.pow(256, 2)) / Math.pow(256, 1)) + '.' +
            Math.floor((((proper_address % Math.pow(256, 3)) % Math.pow(256, 2)) % Math.pow(256, 1)) / Math.pow(256, 0));
        }
        return output;
    },
    ip2long : function(IP) {
        var i = 0;
        IP = IP.match( /^([1-9]\d*|0[0-7]*|0x[\da-f]+)(?:\.([1-9]\d*|0[0-7]*|0x[\da-f]+))?(?:\.([1-9]\d*|0[0-7]*|0x[\da-f]+))?(?:\.([1-9]\d*|0[0-7]*|0x[\da-f]+))?$/i );
        if (!IP) { return false; }
        IP[0] = 0;
        for (i = 1; i < 5; i += 1) {
          IP[0] += !!((IP[i] || '').length);
          IP[i] = parseInt(IP[i]) || 0;
        }
        IP.push(256, 256, 256, 256);
        IP[4 + IP[0]] *= Math.pow(256, 4 - IP[0]);
        if (IP[1] >= IP[5] || IP[2] >= IP[6] || IP[3] >= IP[7] || IP[4] >= IP[8]) { return false; }
        return IP[1] * (IP[0] === 1 || 16777216) + IP[2] * (IP[0] <= 2 || 65536) + IP[3] * (IP[0] <= 3 || 256) + IP[4] * 1;
    },
    CIDRtoIPRange : function(cidr){
        var range = [2];
        cidr = cidr.split('/');
        var start = crushFTPTools.ip2long(cidr[0]);
        range[0] = crushFTPTools.long2ip(start);
        range[1] = crushFTPTools.long2ip(Math.pow(2, 32 - cidr[1]) + start - 1);
        return range;
    },
    fixChars: function(val)
    {
        return val.replace(/@/g,"{at}").replace(/:/g,"{colon}").replace(/&/g,"{amp}").replace(/\?/g,"{question}").replace(/\//g,"{slash}").replace(/\\/g,"{backslash}").replace(/#/g,"{hash}").replace(/"/g,"{quote}").replace(/'/g,"{apos}").replace(/%/g,"{percent}").replace(/>/g,"{gt}").replace(/</g,"{lt}").replace(/\+/g,"%2B");
    }
};

var copyToClipboard = (function() {
  var _dataString = null;
  document.addEventListener("copy", function(e){
    if (_dataString !== null) {
      try {
        e.clipboardData.setData("text/plain", _dataString);
        e.preventDefault();
      } finally {
        _dataString = null;
      }
    }
  });
  return function(data) {
    _dataString = data;
    document.execCommand("copy");
  };
})();

(function($){
    $.loadContent = function(el, url, callback){
        if (localCache.exist(url)) {
            var data = localCache.get(url);
            $(el).empty().append(data);
            callback(data);
        }
        else{
            $(el).load(url, function(data){
                localCache.set(url, data, callback);
            });
        }
    };

    $.fn.loadContent = function(url, callback){
        return this.each(function(){
            (new $.loadContent(this, url, callback));
        });
    };
})(jQuery);

var localCache = {
    data: {},
    remove: function (url) {
        delete localCache.data[url];
    },
    exist: function (url) {
        return localCache.data.hasOwnProperty(url) && localCache.data[url] !== null;
    },
    get: function (url) {
        return localCache.data[url];
    },
    set: function (url, cachedData, callback) {
        localCache.remove(url);
        localCache.data[url] = cachedData;
        if ($.isFunction(callback)) callback(cachedData);
    }
};

try{
    $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
        if (options.cache) {
            var complete = originalOptions.complete || $.noop,
                url = originalOptions.url;
            //remove jQuery cache as we have our own localCache
            options.cache = false;
            options.beforeSend = function () {
                if (localCache.exist(url)) {
                    complete(localCache.get(url));
                    return false;
                }
                return true;
            };
            options.complete = function (data, textStatus) {
                localCache.set(url, data, complete);
            };
        }
    });
}catch(e){}

 window.chartColors = {
      red: 'rgb(255, 99, 132)',
      orange: 'rgb(255, 159, 64)',
      yellow: 'rgb(255, 205, 86)',
      green: 'rgb(75, 192, 192)',
      blue: 'rgb(54, 162, 235)',
      purple: 'rgb(153, 102, 255)',
      grey: 'rgb(201, 203, 207)',
      forest: '#59886b'
    };