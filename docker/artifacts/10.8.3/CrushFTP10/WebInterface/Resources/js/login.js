/*CrushFTP Login Screen*/
var defaultStrings = {
    BadLoginInfoText: "Your username, or password may be incorrect, or the account may have expired.",
    ServerErrorInfoText: "The server is unavailable or your IP has been banned.",
    PasswordsDoNotMatchAlertText: "New passwords don't match.",
    LoginAgainTitleText: "Please login again",
    LoginWithNewPassText: "Login with new password",
    AuthenticatingMsgText: "Authenticating...",
    LoginSuccessText: "Success",
    LoadingWebInterfaceText: "Loading WebInterface...",
    LoginWarningText: "Warning",
    MultipleBadLoginsAlertDescText: "Too many failed attempts and your IP will be banned.\r\n\r\n{msg}<br><br><div style='font-size:13px;font-weight:normal;'>Click <a style='color:white;' href='/WebInterface/jQuery/reset.html'>here</a> to reset password.</div>",
    LoginFailedText: "Login Failed",
    ChangePasswordGrowlTitleText: "Change Password",
    UserNameText: "Username",
    ResetUserNameText : "Username",
    PasswordText: "Password",
    LoginButtonText: "Login",
    ForgotPasswordLinkText: "I forgot my password",
    ResetPasswordButtonText: "Reset Password",
    BackToLoginButtonText : "Back to Login",
    RequestPasswordHeaderText : "Request Password",
    ChangePasswordHeaderText: "Change your password",
    ValidUserNameAlertText : "Please enter valid user name",
    ChangePasswordNoteText: "You must change your password to continue",
    CurrentPasswordText: "Current Password: ",
    NewPasswordText: "New Password: ",
    ConfirmPasswordText: "Confirm Password: ",
    CancelButtonText: "Cancel",
    ChanngePasswordButtonText: "Change Password",
    GeneratePasswordButtonText: "Generate password",
    GeneratePasswordUseButtonText: "Use this",
    GeneratePasswordCancelButtonText: "Cancel",
    OldBrowserNoticeHTMLAsText: 'Your browser is out of date, it was released almost a decade ago! As a result it is very slow, full of bugs, and this WebInterface may or may not even work with IE6.<br><br><div style="text-align:right;"><button id="proceedAnyway">Proceed Anyway Cautiously</button> or get a better browser:<a href="http://chrome.google.com/">Chrome</a> | <a href="http://www.getfirefox.com/">FireFox</a></div>',
    RecaptchaValidationRequiredText : "Please validate captcha to login",
    InvalidPasswordCharacterMsgText: "Password has invalid characters, please remove it from password. Invalid characters ",
    InvalidUsernameCharacterMsgText: "Username has invalid characters, please remove it. Invalid characters ",
    CookiePolicyNotificationText : "We use cookies on this site to facilitate your ability to login for technical reasons.",
    CookiePolicyLinkText : "Cookie Policy",
    CookiePolicyAcceptButtonText : "Accept",
    CookiePolicyDismissButtonText : "Dismiss",
    AcceptCookiesToContinue: "Please accept cookie policy to continue",
    AcceptEULAToContinue: "Please accept EULA to continue"
};

window.unsafechars = ":";

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

$(document).ready(function() {
    if(window.GSignClientID){
        window.onSignIn = function(auth) {
            $("#password").val(auth.credential);
            $("#username").val("crush_oauth2");
            $("#loginForm").submit();
            setTimeout(function(){
                $("#password").val("");
                $("#username").val("");
            }, 100);
        }
        $("#rememberMePanel").before('<div id="g_id_onload" data-client_id="'+window.GSignClientID+'" data-callback="onSignIn"></div><div class="g_id_signin" data-type="standard"></div>');
        $.getScript("https://accounts.google.com/gsi/client").done(function() {
        }).fail(function() {
            $.growlUI("Error :", "Problem while loading Google sign in library", 3500);
        });
    }
    if(window.MSSignClientID){
        $.getScript("//cdn.jsdelivr.net/npm/bluebird@3.7.2/js/browser/bluebird.min.js").done(function() {
            $.getScript("https://alcdn.msauth.net/browser/2.0.0-beta.4/js/msal-browser.js").done(function() {
                $("#msAuthPanel").loadContent("/WebInterface/Resources/templates/ms_auth.html", function(){
                    if(window.msal){
                        $("#msLoginPanel").show();
                    }
                    else{
                        $("#msLoginPanel").hide();
                    }
                });
            }).fail(function() {
                $.growlUI("Error :", "Problem while loading Microsoft sign in library", 3500);
            });
        }).fail(function() {
            $.growlUI("Error :", "Problem while loading Microsoft sign in library", 3500);
        });
    }
    if(window.MSSignClientIDB2C){
        $("#msLoginPanelB2C").loadContent("/WebInterface/Resources/templates/ms_auth_b2c.html", function(){
            $("#msLoginPanelB2C").show();
        });
    }
    if(window.AmazonCognitoClientID){
        $("#amazonCognitoLoginPanel").loadContent("/WebInterface/Resources/templates/amazon_cognito_auth.html", function(){
            $("#amazonCognitoLoginPanel").show();
        });
    }
    if (!window.isInitComplete) {
        if(window.dontShowGeneratePassword)
        {
            $("#generatePasswordPanel").remove();
        }
        localStorage.removeItem("loginTime");
        if (typeof window.localizations == "undefined")
            window.localizations = {};
        window.localizations = $.extend({}, defaultStrings, window.localizations);
        if(typeof window.saveLanguageSelectionInCookie == "undefined")
            window.saveLanguageSelectionInCookie = true;
        loadAndApplyLanguageLocalizations(false, true);
        window.isInitComplete = true;
        if(window.showLanguageSelection)
        {
            var languageSelector = $("#languageSelector").show();
            languageSelector.find("select").change(function() {
                loadAndApplyLanguageLocalizations($(this).val());
            });
            if(window.showLanguageSelectionPos == "left")
            {
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
        if(window.dontShowRememberMeOptionOnLoginPage){
            $('#rememberMePanel').hide();
        }
        if(window.force_eula){
            var eulaText = window.eula_line;
            if(eulaText){
                $("#TnCText").text(eulaText);
                $("#acceptTC").show();
            }
        }
        if(window.loginProcessIndicatorMessage){
            var loader = $("#loginWheel");
            loader.attr("id", "loginWheelInner").css("display","inline-block");
            loader.wrap("<div id='loginWheel' style='white-space: nowrap;display: inline-block;'></div>");
            $("#loginWheel").append("<span style='display: inline-block;position: relative;top: -4px;margin-left: 4px;white-space: break-spaces;overflow-wrap: anywhere;margin-right: 4px;'></span>");
            $("#loginWheel").find("span").text(window.loginProcessIndicatorMessage);
        }
    }
});

function loadAndApplyLanguageLocalizations(name, fresh, force) {
    var curLang = $.cookie("_i18n");
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
        else
            loadAndApplyLanguageLocalizations("en", false, true);
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
            $.cookie("_i18n", "");
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
    if(typeof window.localizations.loginPageTitle != "undefined"){
        if(document.title != "CrushFTP WebInterface :: Login" && window.localizations.loginPageTitle != "CrushFTP WebInterface :: Login"){
            document.title = window.localizations.loginPageTitle;
        }
    }
    if(typeof window.afterLocalization != "undefined")
    {
        window.afterLocalization();
    }
};

function L(key) {
    if (typeof window.localizations != "undefined") {
        if (typeof window.localizations[key] != "undefined")
            return window.localizations[key];
        else if (typeof defaultStrings[key] != "undefined")
            return defaultStrings[key];
        else
            return "";
    }
}
var attempts = 1;
var _badLogin = L("BadLoginInfoText");
var _serverError = L("ServerErrorInfoText");
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
        return crushFTPTools.sanitize(decodeURIComponent(results[1].replace(/\+/g, " ")), true);
}

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        if(hash[0] && hash[1]){
            vars.push(hash[0]);
            vars[hash[0]] = crushFTPTools.sanitize(decodeURIComponent(hash[1].replace(/\+/g, " ")), true);
        }
    }
    return vars;
}

function electronEvent(type, data){
    if (window.isElectron && window.isCrushShare && window.isElectron() && window.isCrushShare()){
        var IPCRenderer = window.getIPCRenderer();
        if(IPCRenderer){
            IPCRenderer.send(type, data);
        }
    }
}

function initLoginFromQS() {
    var options = {
        path: '/',
        expires: -1
    };
    $.cookie("currentAuth", "", options);
    var lastUserName = $.cookie("lastUserName");
    if(lastUserName){
        $("#username").val(decodeURIComponent(lastUserName));
        $('#remember').prop("checked", "checked");
        $("input[name=password]").focus();
    }
    var userName = getQuerystring("u");
    var pass = getQuerystring("p");
    var reset = getQuerystring("r");
    var crushsync = getQuerystring("x-crushshare");
    var timedout = getQuerystring("timedout");
    if(timedout)
        electronEvent('loggedout',  {flag:true});
    else if(!window.hasCaptcha){
        setTimeout(function(){
            electronEvent('loggedout',  {flag:true});
        }, 10000);
    }
    if(crushsync){
        localStorage.setItem("crushsync", crushsync);
        $("body").addClass('crushsync');
    }
    else{
        localStorage.setItem("crushsync", "");
    }
    if (userName){
        $("#username, #resetUserName").val(userName);
    }
    if (pass)
        $("#password").val(pass);
    if(reset)
        showResetPanel();
    if (typeof window.Recaptcha != "undefined" && (userName || pass)) {
        $("#username").closest('div').hide();
        $("#password").closest('div').hide();
    }
    var _login = getQuerystring("l") || (userName && pass);
    if(_login)
    {
        $("#login").hide();
        var path = "/";
        var redirectPath = getQuerystring("path") || path;
        if(redirectPath)
            redirectPath = unescape(redirectPath);
        redirectPath = crushFTPTools.sanitize(redirectPath);
        if (location.href.indexOf("/Web" + "Interface/login.html") >= 0)
            path = location.href.substring(0, location.href.indexOf("/Web" + "Interface/login.html")) + "/#" + redirectPath;
        else
            path = location.href.replace("/#/", redirectPath);
        $("#loginForm").attr("action", path);
        if($.browser.msie)
        {
            setTimeout(function() {
                $("#loginForm").submit();
            }, 1500);
        }
        else
        {
            setTimeout(function() {
                $("#loginForm").submit();
            }, 100);
        }
    }
}

$(document).ready(function() {
    localStorage.setItem("redirectPath", "");
    olderBrowserNotification();
    $("input[name=username]").focus();
    initLoginFromQS();
    $("#loginWheel").hide();
    $("#btnLogin").click(function(evt) {
        if($(this).hasClass('disabled'))
            return false;
        $("#loginWheel").show();
        window.isAlternateRedirect = evt.altKey;
        setTimeout(function() {
            $("#loginForm").submit();
        }, 100);
    });
    $('.showResetPanel').click(function(){
        showResetPanel();
        return false;
    })
    $("#username, #password").keydown(function(evt) {
        var evt = (evt) ? evt : ((event) ? event : null);
        if (evt.keyCode == 13) {
            window.isAlternateRedirect = evt.altKey;
            $("#loginWheel").show();
            setTimeout(function() {
                $("#loginForm").submit();
            }, 100);
            return false;
        }
    });
    $("#resetUserName").keydown(function(evt) {
        var evt = (evt) ? evt : ((event) ? event : null);
        if (evt.keyCode == 13) {
            //emailPassword();
            submitPasswordRequest();
            return false;
        }
    });
    $("#changepasswordPanel").find("#btnChangePasswordCancel").click(function() {
        window.curUser = false;
        window.curPass = false;
        $("#changepasswordPanel").hide();
        $("#panelbody").show();
        if ($("#username").val().length == 0) {
            $("#username").focus().select();
            $("#password").val("");
        } else {
            $("#password").val("").focus().select();
        }
        return false;
    });

    $("#changepasswordPanel").find("#btnGeneratePassword").unbind().click(function() {
        $("#generated_password").val(getGeneratedPass());
        $("#passwordGeneratePanel").slideDown();
        return false;
    });

    $("#changepasswordPanel").find("#usePassword").unbind().click(function() {
        $("#new_password1").val($("#generated_password").val());
        $("#new_password2").val($("#generated_password").val());
        return false;
    });

    $("#changepasswordPanel").find("#cancelPassword").unbind().click(function() {
        $("#generated_password").val("");
        $("#passwordGeneratePanel").slideUp();
        return false;
    });

    $("#current_password").keydown(function(evt) {
        var evt = (evt) ? evt : ((event) ? event : null);
        if (evt.keyCode == 13) {
            $("#new_password1").select().focus();
            return false;
        }
    });

    $("#new_password1").keydown(function(evt) {
        var evt = (evt) ? evt : ((event) ? event : null);
        if (evt.keyCode == 13) {
            $("#new_password2").select().focus();
            return false;
        }
    });

    $("#new_password2").keydown(function(evt) {
        var evt = (evt) ? evt : ((event) ? event : null);
        if (evt.keyCode == 13) {
            $("#btnChangePassword").trigger("click");
            return false;
        }
    });

    function processChangePassRequest(res){
        if(window.clearPasswordsAfterSubmit){
            $("#current_password,#new_password1,#new_password2").val("");
        }
        var s = $(res).find("response").text();
        if (s.toUpperCase().indexOf("PASSWORD CHANGED") >= 0) {
            $("#changepasswordPanel").find("#btnChangePasswordCancel").trigger("click");
            $.growlUI(L("LoginAgainTitleText"), L("LoginWithNewPassText"), 2000, "", false);
        }
        else
        {
            var msg = unescape(s);
            if(typeof window.localizations.passwordRequirementsMessages != "undefined")
                msg = msg.replace("Not Allowed", window.localizations.passwordRequirementsMessages.notAllowedErrorMsg);

            if(typeof window.localizations.passwordChangePreviousPasswordErrorMessage != "undefined")
                msg = msg.replace("Password cannot be one of your recent passwords", window.localizations.passwordChangePreviousPasswordErrorMessage);
            if(msg.indexOf("ERROR: ")==0 && typeof window.localizations.passwordRequirementsMessages != "undefined")
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
                            // msgToShow.push(curmsg);
                        }
                    }
                }
                if(msgToShow.length>0){
                    msgToShow = localizations.passwordRequirementsMessages.errorTitle +  msgToShow.join(localizations.passwordRequirementsMessages.msgSeparator);
                    alert(msgToShow);
                }
                else
                {
                    alert(msg);
                }
            }
            else
            {
                if (msg.toUpperCase().indexOf("PASSWORD CHANGED") >= 0) {
                    alert(localizations.PasswordChangedMsgText);
                }
                else
                    alert(msg);
            }
        }
    }

    $("#changepasswordPanel").find("#btnChangePassword").unbind().click(function() {
        if ($("#new_password1")[0].value != $("#new_password2")[0].value) {
            alert(L("PasswordsDoNotMatchAlertText"));
        } else {
            var curLang = $.cookie("_i18n") || 'en';
            $.ajax({
                type: "POST",
                url: "/WebInterface/function/",
                data: {
                    command: "changePassword",
                    current_password: crushFTPTools.encodeURILocal($("#current_password")[0].value),
                    new_password1: crushFTPTools.encodeURILocal($("#new_password1")[0].value),
                    new_password2: crushFTPTools.encodeURILocal($("#new_password2")[0].value),
                    language: curLang,
                    c2f : crushFTPTools.getCrushAuth()
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    if(XMLHttpRequest.responseText){
                        processChangePassRequest(XMLHttpRequest.responseText);
                    }
                },
                success: function(response) {
                    processChangePassRequest(response);
                }
            });
        }
        return false;
    });

    $("#btnSubmitOTP").unbind().click(function(){
        var otp = $.trim($("#otp").val());
        if ($(this).hasClass("disabled")) {
            return false;
        }

        $(this).addClass("disabled");

        if($("#OTPBox").data("smsOTP"))
        {
            window.smsOTP = otp;
            $("#loginForm").submit();
        }
        else{
            $("#password").val(otp);
            window.otpSubmit = true;
            $("#loginForm").submit();
        }
        $.unblockUI();
        $(this).removeClass("disabled");
    });

    $("#otp").keydown(function (evt) {
        var evt = (evt) ? evt : ((event) ? event : null);
        if (evt.keyCode == 13) {
            $("#btnSubmitOTP").click();
        }
    });

    $("#btnBackToLogin").unbind().click(function(){
        $('#panelLogin').show();
        $('#panelResetPass').hide();
        return false;
    });

    $("#btnResetPassword").unbind().click(function(){
        submitPasswordRequest();
        return false;
    });
});

function getGeneratedPass() {
    var passwords = [];
    var maxChars = passwordRule.random_password_length || 8;
    passwords.push(generateRandomPassword(maxChars));

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
            passwords.push(generateRandomPassword(minSpecial, false, '$^&*()_-+=[]{};,.<>?~'));
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

function getActionResponseText(msg) {
    var responseText = '';
    try {
        var msgs = msg.getElementsByTagName("commandResult");
        for (var x = 0; x < msgs.length; x++) {
            responseText += IE(msgs[x].getElementsByTagName("response")[0]).textContent;
        }
    } catch (ex) {}
    return responseText;
}

function doLogin(e) {
    if(window.cookiePolicyAcceptedToLogin && !localStorage.getItem("acceptCookies")){
        $.growlUI("Error", L("AcceptCookiesToContinue"), 5000, "", false);
        if(e){
            e.preventDefault()
            e.stopPropagation();
        }
        $("#loginWheel").hide();
        if($(".accept-cookies:visible").length>0){
            $(".accept-cookies:visible").addClass('accept-cookies-fixed');
        }
        else{
            acceptCookies.show(true);
        }
        return false;
    }
    if(window.force_eula && window.eula_line && !$("#tandc").is(":checked")){
        $.growlUI("Error", L("AcceptEULAToContinue"), 5000, "", false);
        if(e){
            e.preventDefault()
            e.stopPropagation();
        }
        $("#loginWheel").hide();
        return false;
    }
    $("#loginWheel").show();
    $("#btnLogin").addClass('disabled');
    $.growlUI("", L("AuthenticatingMsgText"), 5000, "", false);
    localStorage.setItem("loginTime", new Date().getTime());
}

function doLogin2(e) {
    if(window.cookiePolicyAcceptedToLogin && !localStorage.getItem("acceptCookies")){
        $.growlUI("Error", L("AcceptCookiesToContinue"), 5000, "", false);
        if(e){
            e.preventDefault()
            e.stopPropagation();
        }
        $("#loginWheel").hide();
        if($(".accept-cookies:visible").length>0){
            $(".accept-cookies:visible").addClass('accept-cookies-fixed');
        }
        else{
            acceptCookies.show(true);
        }
        return false;
    }
    if(window.force_eula && window.eula_line && !$("#tandc").is(":checked")){
        $.growlUI("Error", L("AcceptEULAToContinue"), 5000, "", false);
        if(e){
            e.preventDefault()
            e.stopPropagation();
        }
        $("#loginWheel").hide();
        return false;
    }
    $("input").each(function() {
        $(this).val($.trim($(this).val()));
    });
    $("#loginWheel").show();
    $("#btnLogin").addClass('disabled');
    $.growlUI(L("AuthenticatingMsgText"), "", 5000, "", false);
    window.curUser = false;
    window.curPass = false;
    var username = $("#username").val();
    if (!username) username = $("input[name=username]").val();
    var password = $("#password").val();
    var charsToCheck = window.unsafechars.split().join("|");
    if(charsToCheck && new RegExp(charsToCheck).test(password))
    {
        $.growlUI(L("LoginWarningText"), L("InvalidPasswordCharacterMsgText") + " '" + window.unsafechars + "'", 5000, "", true);
        $("#loginWheel").hide();
        electronEvent('loginerror',  {message: L("InvalidPasswordCharacterMsgText") + " '" + window.unsafechars + "'"});
        return false;
    }
    if(username.indexOf("/") >= 0 || username.indexOf("\\") >= 0){
        $.growlUI(L("LoginWarningText"), L("InvalidUsernameCharacterMsgText") + " '/ \\'", 5000, "", true);
        $("#loginWheel").hide();
        $("#login").show();
        $("#btnLogin").removeClass('disabled');
        electronEvent('loginerror',  {message: L("InvalidUsernameCharacterMsgText") + " '/ \\'"});
        return false;
    }
    if (!password) password = $("input[name=password]").val();
    if(window.smsOTP)
        password = password + ":" + window.smsOTP;
    var curLang = $.cookie("_i18n") || 'en';
    var obj = {
        command: "login",
        username: encodeURIComponent(username),
        password: encodeURIComponent(password),
        encoded: true,
        language: curLang,
        random: Math.random()
    };
    if(window.smsOTP){
        if(window.cachedCaptcha){
            obj["g-recaptcha-response"] = window.cachedCaptcha + "";
        }
    }

    if ($("#recaptcha_response_field").length > 0)
        obj.recaptcha_response_field = crushFTPTools.encodeURILocal($("#recaptcha_response_field").val());
    if ($("#recaptcha_challenge_field").length > 0)
        obj.recaptcha_challenge_field = crushFTPTools.encodeURILocal($("#recaptcha_challenge_field").val());
    if ($("#g-recaptcha-response").length > 0 && !obj["g-recaptcha-response"])
        obj["g-recaptcha-response"] = $("#g-recaptcha-response").val();
    else if(window.captchaToken && !obj["g-recaptcha-response"]){
        obj["g-recaptcha-response"] = window.captchaToken;
    }
    if(obj["g-recaptcha-response"]){
        window.cachedCaptcha = obj["g-recaptcha-response"] + "";
    }
    var success_login = false;
    $.ajax({
        type: "POST",
        url: "/WebInterface/function/",
        data: obj,
        timeout : 60000,
        async: false,
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(window.clearPasswordsAfterSubmit){
                $("#password").val("");
            }
            $("#btnLogin").removeClass('disabled');
            if (!errorThrown) errorThrown = "Error";
            if(typeof errorThrown.name !== undefined)
            {
                var err = errorThrown.name + " : ";
                if(typeof errorThrown.message !== undefined)
                    err += errorThrown.message;
            }
            errorThrown = errorThrown || "";
            if(typeof errorThrown != "string") errorThrown = errorThrown.toString();
            errorThrown = errorThrown.replace("Check your username or password and try again.", L("BadLoginInfoText"));
            electronEvent('loginerror',  {message: errorThrown});
            $.growlUI(unescape(errorThrown), _serverError, 5000, "", false);
            $("#loginWheel").hide();
            success_login = false;
            delete window.smsOTP;
            $("#OTPBox").removeData("smsOTP");
        },
        success: function(msg) {
            localStorage.setItem("mainServerInstance", "");
            $("#dummyIframe").attr("src", "javascript:void(0);");
            $("#loginWheel").hide();
            var response = unescape($(msg).find("response").text());
            var response_msg = "";
            try{response_msg = unescape($(msg).find("message").text());}catch(ex) {}
            var c2f = unescape($(msg).find("c2f").text());
            if (response.toLowerCase() == "recaptcha") {
                $("#login").show();
                $("#btnLogin").removeClass('disabled');
                $.growlUI("", L("RecaptchaValidationRequiredText"), 7000, "", false);
                if (!$("#recaptcha_div").attr("recaptcha-added"))
                {
                    $("#recaptcha_div").attr("recaptcha-added", true);
                    showRecaptcha("recaptcha_div", function () {
                        setTimeout(function() {
                            $("#loginForm").submit();
                        }, 100);
                        return false;
                    });
                }
                return false;
            }
            else if (response == "success") {
                electronEvent('loginsuccess',  {message: "Logged in, setting up now."});
                electronEvent('save-url',  location.protocol + "//" + location.host + "?u="+obj.username+"&p="+obj.password+"&path=" + (getQuerystring("path") || "/"));
                var queryStrings = getUrlVars();
                delete localStorage["wi_upload_count"];
                for(var key in queryStrings){
                    if(key.toLowerCase() === "wi_upload_count"){ //key.toLowerCase().indexOf("meta_")===0 ||
                        localStorage[key.toLowerCase()] = queryStrings[key];
                    }
                }
                if($('#remember').is(":checked"))
                {
                    var options = {
                        path: '/',
                        expires: 365
                    };
                    $.cookie("lastUserName", encodeURIComponent(username), options);
                }
                else
                {
                    var options = {
                        path: '/',
                        expires: -1
                    };
                    $.cookie("lastUserName", "", options);
                }
                var link = false;
                if(c2f){
                    var options = {
                        path: '/'
                    };
                    if(window.location.protocol.toLowerCase().indexOf("https")==0)
                        options.secure = true;
                    $.cookie("currentAuth", c2f, options);
                }
                if (location.href.indexOf("?link=") >= 0) link = location.href.substring(location.href.indexOf("link=") + "link=".length);
                if(window.isAlternateRedirect)
                {
                    link = "/WebInterface/admin/index.html";
                }
                if (link && link.length > 0 && unescape(link).indexOf(":")<0) {
                    link = crushFTPTools.sanitize(link);
                    window.location = link;
                    return false;
                } else {
                    $.growlUI(L("LoginSuccessText"), L("LoadingWebInterfaceText"), 30000, "", false);
                    $("#username, #password").val("");
                    var path = "/";
                    var redirectPath = getQuerystring("path") || path;
                    if(redirectPath)
                        redirectPath = crushFTPTools.sanitize(redirectPath);
                    if (location.href.indexOf("/Web" + "Interface/login.html") >= 0) path = location.href.substring(0, location.href.indexOf("/Web" + "Interface/login.html")) + "/#" + redirectPath;
                    //Web+Interface must be split up to work with reverse proxy
                    else path = location.href.replace("/#/", redirectPath);
                    $("#loginForm").attr("action", path);
                    link = path;
                    localStorage.setItem("redirectPath", redirectPath);
                }
                if(window.otpSubmit || ($.browser.msie && parseInt($.browser.version)<9) || $.browser.safari)
                {
                    window.location = link;
                    return false;
                }
                localStorage.setItem("loginTime", new Date().getTime());
                success_login = true;
                setTimeout(function(){
                    $("#username, #password").val("");
                }, 100);
            } else if (response == "password_expired") {
                $("#login").show();
                if(window.clearPasswordsAfterSubmit){
                    $("#password").val("");
                }
                window.curUser = username;
                window.curPass = password;
                _badLogin = (msg && msg.getElementsByTagName && IE(msg.getElementsByTagName("message")[0]).textContent) || _badLogin;
                _badLogin = unescape(_badLogin);
                $.growlUI(L("ChangePasswordGrowlTitleText"), _badLogin, 2000, "", false);
                electronEvent('loginerror',  {message: _badLogin});
                $("#panelbody").hide();
                $("#changepasswordPanel").show().find("input").val("");
                $("#current_password").select().focus();
                success_login = false;
                $("#btnLogin").removeClass('disabled');
                delete window.smsOTP;
                $("#OTPBox").removeData("smsOTP");
            } else if (response == "challenge_code") {
                $("#login").show();
                $.growlUI("", response_msg, 60000, "", false);
                success_login = false;
                setTimeout(() => {
                    $("#loginForm").submit();
              	}, 1000);
            } else if (response == "challenge" || response == "challenge_otp") {
            	$("#login").show();
            	askforOTP(response == "challenge_otp");
            	success_login = false;
            } else {
                if(window.clearPasswordsAfterSubmit){
                    $("#password").val("");
                }
                $("#login").show();
                $("#btnLogin").removeClass('disabled');
                $("#password").focus();
                _badLogin = (msg && msg.getElementsByTagName && IE(msg.getElementsByTagName("message")[0]).textContent) || _badLogin;
                _badLogin = unescape(_badLogin);
                _badLogin = _badLogin.replace("Check your username or password and try again.", L("BadLoginInfoText"));
                if(!window.hasCaptcha){
                    electronEvent('loginerror',  {message: _badLogin});
                }
                $.growlUI(L("LoginFailedText"), _badLogin, 7000, "", false);
                if (attempts++ >= 3) {
                    var dummyElem = $("<div></div>");
                    dummyElem.append(L("MultipleBadLoginsAlertDescText").replace("{msg}", _badLogin));
                    if($(".lostpassword:first").css("visibility") == "hidden"){
                        dummyElem.find("div").hide();
                    }
                    $.growlUI(L("LoginWarningText"), dummyElem.html(), false);
                }
                $("#loginWheel").hide();
                success_login = false;
                delete window.smsOTP;
                $("#OTPBox").removeData("smsOTP");
            }
            if(!success_login && window.Recaptcha)
            {
                try{
                    window.Recaptcha.reload();
                }catch(ex){}
            }
            if(!success_login && window.grecaptcha)
            {
                try{
                    window.grecaptcha.reset();
                }catch(ex){}
            }
            window.otpSubmit = false;
        }
    });
    return success_login;
}

function showResetPanel(){
    emailPassword();
}

function emailPassword() {
    $('#panelLogin').hide();
    var username = $("#username").val();
    $('#panelResetPass').show();
    $('#resetUserName').val(username).focus();
    return false;
}

function processResetResponse(msg){
    var response = $(msg).find("response").text();
    try{
        if(response == "This server is not configured to send email password reminders." && window.localizations.serverNotConfiguredForEmailError)
            response = window.localizations.serverNotConfiguredForEmailError;
    }catch(ex){}
    $.growlUI("", response, 10000, "", false);
    $('#btnBackToLogin').trigger('click');
}

function submitPasswordRequest(){
    $("input").each(function() {
        $(this).val($.trim($(this).val()));
    });
    var username = $("#resetUserName").val();
    if (!username){
        alert(L("ValidUserNameAlertText"));
        $("#resetUserName").focus();
        return;
    };
    $("#loginWheel").show();
    var curLang = $.cookie("_i18n") || 'en';
    $.ajax({
        type: "POST",
        url: "/WebInterface/function/",
        data: {
            command: "emailpassword",
            username: encodeURIComponent(username),
            c2f : crushFTPTools.getCrushAuth(),
            language: curLang,
            encoded: true,
            random: Math.random()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!errorThrown) errorThrown = "Error";
            $.growlUI(unescape(errorThrown), _serverError, 5000, "", false);
            $("#loginWheel").hide();
            if(XMLHttpRequest.responseText){
                processResetResponse(XMLHttpRequest.responseText);
            }
        },
        success: function(msg) {
            $("#loginWheel").hide();
            processResetResponse(msg);
        }
    });
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

function askforOTP(smsOTP){
    $("#OTPBox").data("smsOTP", smsOTP);
    $.blockUI({
        message: $("#OTPBox"),
        css: {
            width: 350,
            padding: '15px',
            'margin-left': "-175px",
            left: '50%',
            position: 'absolute',
            top: '25%',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: 1,
            'border': "none"
        },
        onBlock : function(elem){
            setTimeout(function() {
                $("#otp").val("").focus();
            }, 100);
        }
    });
}

function olderBrowserNotification() {
    if ($.browser.msie && $.browser.version == "6.0") {
        $.blockUI({
            message: $('<div id="olderBrowserNotice" style="display:none;top:100px;padding: 10px;" class="alertMessage"><div id="OldBrowserNoticeHTMLAsText">Your browser is out of date, it was released almost a decade ago! As a result it is very slow, full of bugs, and this WebInterface may or may not even work with IE6.<br /><br /><div style="text-align:right;"><button id="proceedAnyway">Proceed Anyway Cautiously</button>or get a better browser : &nbsp;<a href="http://chrome.google.com/">Chrome</a> | <a href="http://www.getfirefox.com/">FireFox</a></div></div></div>'),
            css: {
                width: '430px',
                padding: '10px',
                top: '250px',
                border: '3px solid #F17E7E'
            }
        });
        $("#proceedAnyway").click(function() {
            $.unblockUI();
            $("#username").focus();
        });
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
        return _val;
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

if(typeof jQuery.cookie == "undefined"){
    jQuery.cookie = function (key, value, options, force) {
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
}

if (typeof window.localizations == "undefined")
    window.localizations = {};
String.prototype.endsWith = function(str)
{
    return (this.match(str+"$")==str);
}
if(location.hostname.endsWith("."))
{
    location.hostname = location.hostname.substring(0, location.hostname.length-1);
}
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(search, pos) {
        return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    };
}

window.getIPCRenderer = function(){
    return window.require && window.require('electron').ipcRenderer;
}

window.isCrushShare = function(){
    return localStorage.getItem("crushsync");
}

window.isElectron = function(){
    // Renderer process
    if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
        return true;
    }

    // Main process
    if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
        return true;
    }

    // Detect the user agent when the `nodeIntegration` option is set to true
    if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
        return true;
    }
    return false;
}