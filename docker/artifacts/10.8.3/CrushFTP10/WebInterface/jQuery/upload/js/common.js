/**
 * crushFTP global object and method.
 */
$.cookie = function(key, value, options) {
    // key and value given, set cookie...
    if (arguments.length > 1 && (value === null || typeof value !== "object")) {
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
            crush.encodeURILocal(key), '=', options.raw ? String(value) : crush.encodeURILocal(String(value)), options.expires ? '; expires=' + options.expires.toUTCString() : '',
            // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''
        ].join(''));
    }
    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ?
        function(s) {
            return s;
        } : crush.decodeURILocal;
    return (result = new RegExp('(?:^|; )' + crush.encodeURILocal(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};

var crush = {
    enableLogging: false,
    ajaxCallURL: "/WebInterface/function/",
    defaultRequestType: "POST",
    queryString : function(name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        var param = match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        return param || "";
    },
    getAuth: function() {
        var auth = $.cookie("currentAuth");
        if (auth && auth.length > 0)
            return auth; //.substr(auth.length - 4);
        else
            return false;
    },
    getChunk: function(file, start, size) {
        if (!size) {
            return file;
        } else {
            if (file.size < start)
                return false;
            var blob;
            if (file.size < start + size) {
                blob = file.slice(start, file.size);
            } else {
                blob = file.slice(start, start + size);
            }
            //console.log(file, blob, start, size, file.size);
            return blob;
        }
    },
    data: {
        ajax: function(dataToSubmit, params) {
            var obj = {
                type: crush.defaultRequestType,
                url: crush.ajaxCallURL,
                data: dataToSubmit
            };
            params = params || {};
            var c2f = crush.getAuth();
            if (c2f && !params.noc2f)
                obj.data.c2f = c2f;
            if (params)
                $.extend(obj, params);
            return $.ajax(obj);
        },
        getValueFromJson: function(item, node) {
            if (item && item[node]) {
                return item[node];
            } else {
                return "";
            }
        }
    },
    timeDiff: function(time1, time2) {
        var dif = time1 - time2;
        return Math.abs(dif / 1000);
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
                value = crush.decodeURILocal(value);
            } catch (ex) {
                value = value;
            }
            return value.replace(/([\&'"<>])/g, function(str, item) {
                return crush.xmlUnSafeCharsMapping[item];
            });
        } else {
            return value.replace(/([\&'"<>])/g, function(str, item) {
                return crush.xmlUnSafeCharsMapping[item];
            }).replace(/\%/g, "%25").replace(/\+/g, "%2B");
        }
    },
    decodeXML: function(value) {
        if (value == undefined || value.length == 0) return value;
        return value.replace(/(&quot;|&lt;|&gt;|&amp;|&apos;|%2B|%25)/g,
            function(str, item) {
                return crush.xmlUnSafeCharsMappingReverse[item];
            });
    },
    htmlEncode: function(value, encodeVal, onlyHTML) {
        if (value != undefined && value.length > 0) {
            var lines = value.split(/\r\n|\r|\n/);
            for (var i = 0; i < lines.length; i++) {
                if (lines[i] && typeof lines[i] == "string")
                    lines[i] = crush.xmlEncode(lines[i], onlyHTML);
            }
            if (encodeVal)
                return crush.encodeURILocal(lines.join('\r\n'));
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
    encodeURILocal: function(val) {
        var _val = val;
        try {
            _val = encodeURIComponent(val);
        } catch (ex) {}
        return _val;
    },
    textEncode: function(val) {
        return $("<div>").text(val).html();
    },
    xssEncode: function(val) {
        return crush.htmlEncode(crush.textEncode(unescape(val)));
    },
    random: function(length, numeric, possible) {
        length = length || 8;
        var randomId = "";
        possible = possible || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        if (numeric) {
            possible = "0123456789";
        }
        for (var i = 0; i < length; i++)
            randomId += possible.charAt(Math.floor(Math.random() * possible.length));

        return randomId;
    },
    padNumber: function(number) {
        if (number <= 99) {
            number = ("0" + number).slice(-2);
        }
        return number;
    },
    secondsToTime: function(secs) {
        var hours = Math.floor(secs / (60 * 60));
        var divisor_for_minutes = secs % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);
        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);
        var obj = {
            "h": hours,
            "m": minutes,
            "s": seconds
        };
        return obj;
    },
    formatBytes : function(bytes) {
        if(!crush.isNumeric(bytes))
            return bytes;
        if (bytes < 0) return "*";
        if ((bytes / 1024).toFixed(0) == 0) return bytes.toFixed(1) + " " + locTop("dataByClassFormatBytes");
        else if ((bytes / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024).toFixed(1) + " "  + locTop("dataByClassFormatKiloBytes");
        else if ((bytes / 1024 / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024 / 1024).toFixed(1) + " "  + locTop("dataByClassFormatMegaBytes");
        else if ((bytes / 1024 / 1024 / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024 / 1024 / 1024).toFixed(1) + " " + locTop("dataByClassFormatGigaBytes");
        else if ((bytes / 1024 / 1024 / 1024 / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024 / 1024 / 1024 / 1024).toFixed(1) + " " + locTop("dataByClassFormatTeraBytes");
    },
    formatTime: function(secs) {
        var o = this;
        var remaining = "";
        if (!secs) return "";
        if(!crush.isNumeric(secs))
            return secs;
        // secs = secs.substring(0, secs.indexOf(".")) * 1;
        if (secs <= 0) {
            remaining = locTop("BrowserUploaderSpeedTimeCalculatingText");
        } else {
            var secsToTime = o.secondsToTime(secs);
            if (secsToTime.h != 0) {
                remaining = o.padNumber(secsToTime.h) + ":" + o.padNumber(secsToTime.m) + ":" + o.padNumber(secsToTime.s) + " " + loc("hoursAbbr");
            } else if (secsToTime.m != 0) {
                remaining = o.padNumber(secsToTime.m) + ":" + o.padNumber(secsToTime.s) + " " + loc("minutesAbbr");
            } else if (secsToTime.s != 0) {
                remaining = o.padNumber(secsToTime.s) + " " + loc("secondsAbbr");
            }
        }
        return remaining;
    },
    getFileExtension: function(filename) {
        var ext = /^.+\.([^.]+)$/.exec(filename);
        return ext == null ? "" : ext[1].toLowerCase();
    },
    iconForFile: function(name, type) {
        if(type == 'dir')
            return 'fa-folder-o';
        var extension = crush.getFileExtension(name);
        // Images
        var images = ["ani", "bmp", "cal", "fax", "gif", "img", "jbg", "jpe", "jpeg", "jpg", "mac", "pbm", "pcd", "pcx", "pct", "pgm", "png", "ppm", "psd", "ras", "tga", "tiff", "wmf"];
        if (images.indexOf(extension) >= 0)
            return 'fa-file-image-o';

        var audio = ["3ga", "aac", "aiff", "amr", "ape", "arf", "asf", "asx", "cda", "dvf", "flac", "gp4", "gp5", "gpx", "logic", "m4a", "m4b", "m4p", "midi", "mp3", "ogg", "pcm", "rec", "snd", "sng", "uax", "wav", "wma", "wpl", "zab"];
        if (audio.indexOf(extension) >= 0)
            return 'fa-file-audio-o';

        var video = ["webm", "mkv", "flv", "vob", "ogv", "ogg", "drc", "gif", "gifv", "mng", "avi", "mov", "qt", "wmv", "yuv", "rm", "rmvb", "asf", "amv", "mp4", "mp2", "mpe", "mpv", "mpg", "mpeg", "m2v", "m4v", "svi", "3gp", "3g2", "mxf", "roq", "nsv", "flv", "f4v", "f4p", "f4a", "f4b"];
        if (video.indexOf(extension) >= 0)
            return 'fa-file-video-o';

        if (extension == "pdf")
            return 'fa-file-pdf-o';

        if (extension == "doc" || extension == "docx" || extension == "rtf")
            return 'fa-file-word-o';

        if (extension == "xls" || extension == "xlsx" || extension == "csv")
            return 'fa-file-excel-o';

        if (extension == "ppt" || extension == "pptx")
            return 'fa-file-powerpoint-o';

        if (extension == "txt")
            return 'fa-file-text-o';

        var code = ["asm", "asp", "aspx", "bat", "htm", "inc", "jad", "java", "js", "json", "jsp", "lib", "o", "php", "rc", "rss", "scpt", "src", "vbs", "xml", "xsd", "xsl", "xslt"];
        if (code.indexOf(extension) >= 0)
            return 'fa-file-code-o';

        var archive = ["001", "002", "003", "004", "005", "006", "007", "008", "009", "010", "7z", "7z.001", "7z.002", "7z.003", "7zip", "a00", "a01", "a02", "a03", "a04", "a05", "ace", "air", "apk", "appxbundle", "arc", "arj", "asec", "bar", "bin", "c00", "c01", "c02", "c03", "cab", "cbr", "cbz", "cso", "deb", "dlc", "gz", "gzip", "hqx", "inv", "ipa", "isz", "jar", "msu", "nbh", "pak", "part1.exe", "part1.rar", "part2.rar", "r00", "r01", "r02", "r03", "r04", "r05", "r06", "r07", "r08", "r09", "r10", "rar", "rpm", "sis", "sisx", "sit", "sitd", "sitx", "tar", "tar.gz", "tgz", "uax", "webarchive", "xap", "z01", "z02", "z03", "z04", "z05", "zab", "zip"];
        if (archive.indexOf(extension) >= 0)
            return 'fa-file-archive-o';

        return 'fa-file-o';
    },
    isVisibleOnScreen: function(elem, prnt) {
        if (!elem || elem.length == 0) return;
        prnt = prnt || window;
        var docViewTop = $(prnt).scrollTop();
        var docViewBottom = docViewTop + $(prnt).height();
        var elemTop = $(elem).position().top - 20;
        var elemBottom = elemTop + $(elem).height() + 20;
        return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom));
    },
    removeRangeSelection: function() {
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
    isNumeric: function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
};

/**!
 * name: jQuery getChar
 * repository: https://github.com/bpeacock/key-to-charCode
 * @author Brian Peacock
 * @version 0.3
 * Copyright 2013, Brian Peacock
 * Licensed under the MIT license.
 */

(function($) {
    $.extend({
        getChar: function(e) {
            /*** Convert to Char Code ***/
            var code = e.which;
            //Ignore Shift Key events & arrows
            var ignoredCodes = {
                16: true,
                27: true,
                33: true,
                34: true,
                35: true,
                36: true,
                37: true,
                38: true,
                39: true,
                40: true,
                20: true,
                17: true,
                18: true,
                91: true
            };

            if (ignoredCodes[code] === true) {
                return false;
            }

            //These are special cases that don't fit the ASCII mapping
            var exceptions = {
                186: 59, // ;
                187: 61, // =
                188: 44, // ,
                189: 45, // -
                190: 46, // .
                191: 47, // /
                192: 96, // `
                219: 91, // [
                220: 92, // \
                221: 93, // ]
                222: 39, // '
                //numeric keypad
                96: '0'.charCodeAt(0),
                97: '1'.charCodeAt(0),
                98: '2'.charCodeAt(0),
                99: '3'.charCodeAt(0),
                100: '4'.charCodeAt(0),
                101: '5'.charCodeAt(0),
                102: '6'.charCodeAt(0),
                103: '7'.charCodeAt(0),
                104: '8'.charCodeAt(0),
                105: '9'.charCodeAt(0)
            };

            if (exceptions[code] !== undefined) {
                code = exceptions[code];
            }

            var ch = String.fromCharCode(code);

            /*** Handle Shift ***/
            if (e.shiftKey) {
                var special = {
                    1: '!',
                    2: '@',
                    3: '#',
                    4: '$',
                    5: '%',
                    6: '^',
                    7: '&',
                    8: '*',
                    9: '(',
                    0: ')',
                    ',': '<',
                    '.': '>',
                    '/': '?',
                    ';': ':',
                    "'": '"',
                    '[': '{',
                    ']': '}',
                    '\\': '|',
                    '`': '~',
                    '-': '_',
                    '=': '+'
                };

                if (special[ch] !== undefined) {
                    ch = special[ch];
                }
            } else {
                ch = ch.toLowerCase();
            }

            return ch.charCodeAt(0);
        }
    });
})(jQuery);

/*!
 * jQuery TextChange Plugin
 * http://www.zurb.com/playground/jquery-text-change-custom-event
 *
 * Copyright 2010, ZURB
 * Released under the MIT License
 */
(function(a) {
    a.event.special.textchange = {
        setup: function() {
            a(this).data("lastValue", this.contentEditable === "true" ? a(this).html() : a(this).val());
            a(this).bind("keyup.textchange", a.event.special.textchange.handler);
            a(this).bind("cut.textchange paste.textchange input.textchange", a.event.special.textchange.delayedHandler);
        },
        teardown: function() {
            a(this).unbind(".textchange");
        },
        handler: function() {
            a.event.special.textchange.triggerIfChanged(a(this));
        },
        delayedHandler: function() {
            var b = a(this);
            setTimeout(function() {
                    a.event.special.textchange.triggerIfChanged(b);
                },
                25);
        },
        triggerIfChanged: function(b) {
            var c = b[0].contentEditable === "true" ? b.html() : b.val();
            if (c !== b.data("lastValue")) {
                b.trigger("textchange", b.data("lastValue"));
                b.data("lastValue", c);
            }
        }
    };
    a.event.special.hastext = {
        setup: function() {
            a(this).bind("textchange", a.event.special.hastext.handler);
        },
        teardown: function() {
            a(this).unbind("textchange", a.event.special.hastext.handler);
        },
        handler: function(b, c) {
            c === "" && c !== a(this).val() && a(this).trigger("hastext");
        }
    };
    a.event.special.notext = {
        setup: function() {
            a(this).bind("textchange",
                a.event.special.notext.handler);
        },
        teardown: function() {
            a(this).unbind("textchange", a.event.special.notext.handler);
        },
        handler: function(b, c) {
            a(this).val() === "" && a(this).val() !== c && a(this).trigger("notext");
        }
    };
})(jQuery);


String.prototype.trim = function() {
    var trimmed = this.replace(/^\s+|\s+$/g, '');
    return trimmed;
};
String.prototype.ltrim = function() {
    var trimmed = this.replace(/^\s+/g, '');
    return trimmed;
};
String.prototype.rtrim = function() {
    var trimmed = this.replace(/\s+$/g, '');
    return trimmed;
};

// Add a method "has" to array
Array.prototype.has = function(value) {
    var i;
    for (var i = 0, loopCnt = this.length; i < loopCnt; i++) {
        if (this[i] === value) {
            return true;
        }
    }
    return false;
};
Array.prototype.cleanArray = function(delVal) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == delVal) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

Array.min = function(array) {
    return Math.min.apply(Math, array);
};

Array.max = function(array) {
    return Math.max.apply(null, array);
};

Array.prototype.move = function(old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};

Array.prototype.average = function() {
    var av = 0;
    var cnt = 0;
    var len = this.length;
    for (var i = 0; i < len; i++) {
        var e = +this[i];
        if(!e && this[i] !== 0 && this[i] !== '0') e--;
        if (this[i] == e) {av += e; cnt++;}
    }
    return av/cnt;
};

Array.prototype.removeDuplicates = function (){
  var temp=new Array();
  this.sort();
  for(i=0;i<this.length;i++){
    if(this[i]==this[i+1]) {continue}
    temp[temp.length]=this[i];
  }
  return temp;
};

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(str)
    {
        return (this.match(str+"$")==str);
    }
}
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
  };
}

Number.prototype.round5 = function(){
    var val = this;
    return Math.ceil(val/5)*5;
}

if(!window.console)
    window.console = {};
if(!window.console.log)
    window.console.log = function(){};
if(!window.console.info)
    window.console.info = function(){};