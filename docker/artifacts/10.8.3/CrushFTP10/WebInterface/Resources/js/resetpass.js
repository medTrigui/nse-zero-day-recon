(function ($) {

"use strict";

$.fn.autoCompleteFix = function(opt) {
    var ro = 'readonly', settings = $.extend({
        attribute : 'autocomplete',
        trigger : {
            disable : ["off"],
            enable : ["on"]
        },
        focus : function() {
            $(this).removeAttr(ro);
        },
        force : false
    }, opt);

    $(this).each(function(i, el) {
        el = $(el);

        if(el.is('form')) {
            var force = (-1 !== $.inArray(el.attr(settings.attribute), settings.trigger.disable))
            el.find('input').autoCompleteFix({force:force});
        } else {
            var disabled = -1 !== $.inArray(el.attr(settings.attribute), settings.trigger.disable);
            var enabled = -1 !== $.inArray(el.attr(settings.attribute), settings.trigger.enable);
            if (settings.force && !enabled || disabled)
                el.attr(ro, ro).focus(settings.focus).val("");
        }
    });
};
})(jQuery);

var resetPageDefaultStrings = {
    resetPageTitle: "CrushFTP WebInterface :: Reset Password",
    resetPageUserName: "Username or Email : ",
    resetPagePassword: "Password : ",
    resetPagePasswordConfirm: "Password Confirm : ",
    resetPageSubmit: "Submit",
    resetPageLoginPage: "Login Page",
    resetPageStartOver: "Start Over",
    resetPagePleaseWait: "Please wait...",
    resetPageServerError: "The server is unavailable or your IP has been banned.",
    resetPagePasswordDonotMatchErrorTitle: "Passwords do not match",
    resetPagePasswordDonotMatchErrorDesc: "Password and confirm password are not the same."
}
$(document).ready(function() {
    $('form').autoCompleteFix();
    if (!window.isInitComplete) {
        if(window.dontShowGeneratePassword)
        {
            $("#generatePasswordPanel").remove();
        }
        if (typeof window.localizations == "undefined")
            window.localizations = {};
        window.localizations = $.extend({}, resetPageDefaultStrings, window.localizations);
        if (typeof window.saveLanguageSelectionInCookie == "undefined")
            window.saveLanguageSelectionInCookie = true;
        loadAndApplyLanguageLocalizations(false, true);
        window.isInitComplete = true;
        if (window.showLanguageSelection) {
            var languageSelector = $("#languageSelector").show();
            languageSelector.find("select").change(function() {
                loadAndApplyLanguageLocalizations($(this).val());
            });
            if (window.showLanguageSelectionPos == "left") {
                languageSelector.css("left", "10px");
            }
        }
        var languageSelector = $("div#languageSelector");
        if(window.showTheseLanguagesToSelect)
        {
            var langs = window.showTheseLanguagesToSelect.split(",");
            languageSelector.find("option").attr("rem", true);
            for (var i = 0; i < langs.length; i++) {
                var curLang = $.trim(langs[i]).toLowerCase();
                if(curLang && curLang.length>2)
                {
                    var _curLang = curLang.split("")[0].toUpperCase() +""+ curLang.substring(1, curLang.length).toLowerCase();
                    languageSelector.find("option[rel='" + _curLang + "']").removeAttr("rem");
                }
            }
            languageSelector.find("[rem]").remove();
        }
    }
    var urlParams = {};
    (function() {
        var e,
            a = /\+/g, // Regex for replacing addition symbol with a space
            r = /([^&=]+)=?([^&]*)/g,
            d = function(s) {
                return decodeURIComponent(s.replace(a, " "));
            },
            q = window.location.search.substring(1);

        while (e = r.exec(q))
            urlParams[d(e[1]).toString().toLowerCase()] = d(e[2]);
    })();
    var isResetForm = false;
    if (urlParams.token) {
        isResetForm = true;
    }
    if (isResetForm) {
        $("#reset_1").val(urlParams.username);
        $("#resetToken").val(urlParams.token).attr("readonly", "readonly");
        $("#resetButton").find("span").text("Submit");
        $("#reset_1").focus();
        $("#command").val("reset_password");
        if(typeof urlParams.username == "undefined"){
            $('.user-name-panel').hide();
        }
        else if(urlParams.username){
            $('#reset_1').prop("disabled", "disabled");
        }
    } else {
        $("div.resetPanel").hide();
        $("#reset_1").val(urlParams.username || "");
        $("#reset_1").focus();
        $("#command").val("request_reset");
    }
    $("#frmReset").bind("submit", function() {
        return false;
    });
    $("#reset_1, #password, #passwordConfirm").keypress(function(evt) {
        var evt = (evt) ? evt : ((event) ? event : null);
        if (evt.keyCode == 13) {
            $("#resetButton").trigger("click");
            evt.stopPropagation();
            return false;
        }
    });

    $("#btnGeneratePassword").unbind().click(function() {
        $("#generated_password").val(getGeneratedPass());
        $("#passwordGeneratePanel").slideDown();
        return false;
    });

    $("#usePassword").unbind().click(function() {
        if($(this).hasClass('used'))
            return false;
        $("#password").val($("#generated_password").val());
        $("#passwordConfirm").val($("#generated_password").val());
        var that = $(this).addClass('used');
        setTimeout(function(){
            that.removeClass('used');
        }, 2000);
        return false;
    });

    $("#cancelPassword").unbind().click(function() {
        $("#generated_password").val("");
        $("#passwordGeneratePanel").slideUp();
        return false;
    });
    $("#resetWheel").hide();
    $("#resetButton").click(function(evt) {
        if (isResetForm) {
            doReset();
        } else {
            sendResetRequest();
        }
        evt.stopPropagation();
        evt.preventDefault();
        return false;
    });
});

function loadAndApplyLanguageLocalizations(name, fresh, force) {
    var curLang = $.cookie("_i18n") || 'en';
    if(!window.saveLanguageSelectionInCookie)
    {
        curLang = "";
    }
    if (fresh) {
        curLang = window.defaultWILanguage || curLang;
        if (window.detectBrowserLanguage) {
            var languageMenu = $("#languageSelector");
            var userLang = navigator.language || navigator.userLanguage;
            if (languageMenu.find("option[value*='#" + userLang + "']").length > 0) {
                curLang = userLang;
            } else if (userLang.indexOf("-") > 0) {
                userLang = userLang.split("-")[0];
                if (languageMenu.find("option[value*='#" + userLang + "']").length > 0) {
                    curLang = userLang;
                }
            }
        }
        if (curLang && window.saveLanguageSelectionInCookie)
            loadAndApplyLanguageLocalizations(curLang + "", false, true);
    } else {
        if (!force && curLang == name)
            return false;
        if (!name) return false;
        $.getScript("/WebInterface/localizations/" + name + ".js").done(function() {
            try {
                if(typeof window.persistentLocalizationStrings != "undefined")
                {
                    localizations = $.extend(localizations, window.persistentLocalizationStrings);
                }
                applyLocalizations();
                $("#languageSelector").find("select>option").each(function() {
                    if ($(this).attr("rel").toLowerCase() == localizations.currentLanguageName.toLowerCase())
                        $(this).attr("selected", "selected");
                });
            } catch (ex) {}
            if (window.saveLanguageSelectionInCookie) {
                var options = {
                    path: '/',
                    expires: 365
                };
                $.cookie("_i18n", name, options);
            }
        }).fail(function() {
            $.growlUI("Error :", "Localization set for language " + name + " is not available", 3500);
        });
    }
}

function applyLocalizations() {
    var languageSelector = $("#languageSelector");
    if (typeof window.localizations != "undefined") {
        for (var item in window.localizations) {
            $("#" + item).html(window.localizations[item]);
            if(item.indexOf("languageName")==0)
            {
                var lang = item.replace("languageName", "");
                languageSelector.find("option[rel='"+lang+"']").text(window.localizations[item]);
            }
        }
    }
    if (typeof window.localizations != "undefined") {
        for (var item in window.localizations) {
            $("#" + item).html(window.localizations[item]);
        }
    }
    if (typeof window.localizations.resetPageTitle != "undefined")
        document.title = window.localizations.resetPageTitle;
    if (typeof window.afterLocalization != "undefined") {
        window.afterLocalization();
    }
};

function L(key) {
    if (typeof window.localizations != "undefined") {
        if (typeof window.localizations[key] != "undefined")
            return window.localizations[key];
        else if (typeof resetPageDefaultStrings[key] != "undefined")
            return resetPageDefaultStrings[key];
        else
            return "";
    }
}

function processResponse(res){
    $("#resetWheel").hide();
    $("#resetButton").removeAttr("disabled");
    var msg = decodeURIComponent($(res).find("response").text());
    msg = msg.replace("You did not enter the correct current password.", L("ChangePasswordCurrentPasswordNotCorrectWarningText"));
    if(L("ChangePasswordResetLinkExpiredText"))
        msg = msg.replace("ERROR: The link is invalid or expired.", L("ChangePasswordResetLinkExpiredText"));
    if(typeof window.localizations.passwordRequirementsMessages != "undefined")
        msg = msg.replace("Not Allowed", window.localizations.passwordRequirementsMessages.notAllowedErrorMsg);

    if(typeof window.localizations.passwordChangePreviousPasswordErrorMessage != "undefined")
        msg = msg.replace("Password cannot be one of your recent passwords", window.localizations.passwordChangePreviousPasswordErrorMessage);
    if(msg.indexOf("ERROR: ")==0 && window.localizations && typeof window.localizations.passwordRequirementsMessages != "undefined")
    {
        var msgToShow = [];
        msg = msg.replace("ERROR: ", "");
        var msgs = msg.split("\n");
        for (var i = 0; i < msgs.length; i++) {
            var curmsg = $.trim(msgs[i]);
            if(curmsg.length>0)
            {
                if(curmsg.match(/\d+/))
                {
                    var no = curmsg.match(/\d+/)[0];
                    if(curmsg.indexOf("number characters")>=0)
                    {
                        msgToShow.push(localizations.passwordRequirementsMessages.numericChars.replace("$$", no));
                    }
                    else if(curmsg.indexOf("lower case")>=0)
                    {
                        msgToShow.push(localizations.passwordRequirementsMessages.lowerCase.replace("$$", no));
                    }
                    else if(curmsg.indexOf("upper case")>=0)
                    {
                        msgToShow.push(localizations.passwordRequirementsMessages.upperCase.replace("$$", no));
                    }
                    else if(curmsg.indexOf("special characters")>=0)
                    {
                        msgToShow.push(localizations.passwordRequirementsMessages.specialCase.replace("$$", no));
                    }
                    else if(curmsg.indexOf("Password must be at least")>=0 || curmsg.indexOf("Password must have at least")>=0)
                    {
                        msgToShow.push(localizations.passwordRequirementsMessages.chars.replace("$$", no));
                    }
                    else
                    {
                        // msgToShow.push(curmsg);
                    }
                }
                else
                {
                    msgToShow.push(curmsg);
                }
            }
        }
        if(msgToShow.length>0){
            msgToShow = "<div style='text-align:left;font-size:14px;font-weight:normal;'>" +  msgToShow.join(localizations.passwordRequirementsMessages.msgSeparator + "<br>") + "</div>";
            $.growlUI(localizations.passwordRequirementsMessages.errorTitle, msgToShow, 0, "", false);
        }
        else
        {
            $.growlUI("", crushFTPTools.decodeURILocal(msg), 0, "", false);
        }
    }
    else{
        if (msg.toUpperCase().indexOf("PASSWORD CHANGED") >= 0) {
            $.growlUI("", localizations.PasswordChangedMsgText, 0, "", false);
            setTimeout(function(){
                window.location = "../login.html";
            }, 3000);
        }
        else
            $.growlUI("", crushFTPTools.decodeURILocal(msg), 0, "", false);
    }
}

function doReset() {
    var password1 = encodeURIComponent($("#password").val());
    var password2 = encodeURIComponent($("#passwordConfirm").val());
    if (password1 != password2) {
        $.growlUI(L("resetPagePasswordDonotMatchErrorTitle"), L("resetPagePasswordDonotMatchErrorDesc"), 0, "", false);
        $("#passwordConfirm").focus();
        return false;
    }
    $("#resetWheel").show();
    $("#resetButton").attr("disabled", "disabled");
    $.growlUI(L("resetPagePleaseWait"), "", 0, "", false);
    var username = $("#reset_1").val();
    var curLang = $.cookie("_i18n") || 'en';
    $.ajax({
        type: "POST",
        url: "/WebInterface/function/",
        data: {
            command: $("#command").val(),
            reset_username_email: encodeURIComponent(username),
            password1: password1,
            password2: password2,
            resetToken: encodeURIComponent($("#resetToken").val()),
            currentURL: document.location.protocol + "//" + document.location.host + document.location.pathname,
            language: curLang,
            random: Math.random()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            $("#resetButton").removeAttr("disabled");
            if (!errorThrown) errorThrown = "Error";
            $("#resetWheel").hide();
            if(XMLHttpRequest.responseText)
                processResponse(XMLHttpRequest.responseText);
        },
        success: function(msg) {
            processResponse(msg);
        }
    });
    return false;
}
function getGeneratedPass() {
    var passwords = [];
    var maxChars = passwordRule.random_password_length || 8;
    passwords.push(generateRandomPassword(maxChars));
    var specialChars = '$^&*()_-+=[]{};,.<>?~';

    var minNumeric = passwordRule.min_password_numbers || 0;
    var minLower = passwordRule.min_password_lowers || 0;
    var minUpper = passwordRule.min_password_uppers || 0;
    var minSpecial = passwordRule.min_password_specials || 0;
    if(minNumeric>0 || minLower>0 || minUpper>0 || minSpecial>0)
    {
        passwords = [];
        if(minNumeric>0)
        {
            passwords.push(generateRandomPassword(minNumeric, true));
        }
        if(minLower>0)
        {
            passwords.push(generateRandomPassword(minLower, false, 'abcdefghkmnpqrtuvwxyz'));
        }
        if(minUpper>0)
        {
            passwords.push(generateRandomPassword(minUpper, false, 'ABCDEFGHKMNPQRTUVWXYZ'));
        }
        if(minSpecial>0)
        {
            passwords.push(generateRandomPassword(minSpecial, false, specialChars));
        }
    }
    else{
        passwords.push(generateRandomPassword(maxChars));
    }
    passwords.sort(function(a,b){ return( parseInt( Math.random()*10 ) %2 );});
    var pass = passwords.join("");
    pass = pass.shuffle();
    if(pass.length>maxChars)
    {
        pass = pass.substr(0, maxChars);
    }
    else if(pass.length<maxChars)
    {
        pass += generateRandomPassword(maxChars - pass.length, true);
    }
    pass = pass.shuffle();
    return pass;
}

function generateRandomPassword(length, numeric, possible) {
    length = length || 8;
    var randomId = "";
    possible = possible || "ABCDEFGHKMNPQRTUVWXYZabcdefghkmnpqrtuvwxyz2346789";
    if (numeric) {
        possible = "2346789";
    }
    for (var i = 0; i < length; i++)
        randomId += possible.charAt(Math.floor(Math.random() * possible.length));
    return randomId;
}
function sendResetRequest() {
    $("#resetWheel").show();
    $("#resetButton").attr("disabled", "disabled");
    $.growlUI(L("resetPagePleaseWait"), "", 0, "", false);
    var username = $("#reset_1").val();
    var curLang = $.cookie("_i18n") || 'en';
    $.ajax({
        type: "POST",
        url: "/WebInterface/function/",
        data: {
            command: $("#command").val(),
            reset_username_email: encodeURIComponent(username),
            currentURL: document.location.protocol + "//" +document.location.host + document.location.pathname,
            language: curLang,
            random: Math.random()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            $("#resetButton").removeAttr("disabled");
            if (!errorThrown) errorThrown = "Error";
            $.growlUI(crushFTPTools.decodeURILocal(errorThrown), L("resetPageServerError"), 0, "", false);
            $("#resetWheel").hide();
        },
        success: function(msg) {
            $("#resetWheel").hide();
            $("#resetButton").removeAttr("disabled");
            var response = unescape($(msg).find("response").text());
            if(L("ResetPasswordUserNotFoundMsgText"))
                response = response.replace("Unable to locate this user.", L("ResetPasswordUserNotFoundMsgText"));
            $.growlUI("", crushFTPTools.decodeURILocal(response), 0, "", false);
        }
    });
    return false;
}

function IE(obj) {
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
}

var crushFTPTools = {
    getCrushAuth: function() {
        var auth = $.cookie("currentAuth");
        if(auth && auth.length>0)
            return auth;//.substr(auth.length - 4);
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
    encodeURILocal: function(val) {
        var _val = val;
        try {
            _val = encodeURIComponent(val);
        } catch (ex) {}
        return crushFTPTools.sanitize(_val);
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
    }
};
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
function getQuerystring(name) {
    if (!name) return false;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}
/*
if(typeof jQuery.cookie == "undefined"){
    jQuery.cookie = function (key, value, options, force) {
        console.log(key, value, options, force);
        var lowKey = key.toLowerCase();
        var ignoreKey = (lowKey === "crushauth" || lowKey === "currentauth");
        // key and value given, set cookie...
        if (arguments.length > 1 && (value === null || typeof value !== "object")) {
            if(!ignoreKey && !force){
                window.localStorage[key] = value;
                return window.localStorage[key];
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
            return window.localStorage[key];
        }
        return curCookie;
    };
}*/