/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelGeneralSettings = {
    defaultGeneralSettings: {
        outgoingSpeedAryDisplay: [],
        incomingSpeedAryDisplay: [],
        generalSettingsOutgoingSpeed: "",
        generalSettingsIncomingSpeed: ""
    }
};
panelGeneralSettings.localization = {};
/****************************/

// Panel details
var panelName = "GeneralSettings";
var _panel = $("#pnl" + panelName);

// Localizations
panelGeneralSettings.localization = {
    headerText: "General Settings",
    lblMaxGlobalServerConnectionsText: "Max Global Server Connections:",
    lblMaxServerOutgoingSpeedText: "Max Server Outgoing Speed:",
    lblSpeedText: "K/sec",
    lblMaxServerIncomingSpeedText: "Incoming:",
    lblSpeedText: "K/sec",
    lblIPPatternsImmuneToSpeedText: "IP Patterns Immune To Speed:",
    lblReportSettingText: " Reports / Statistics Settings ",
    lblSaveStatisticsToDiskIntervalText: "Save statistics to disk interval in minutes:",
    lblTrackDaysWorthSessionHistoryText: "Track how many days worth session history:",
    lblTrackDaysWorthTransferHistoryText: "Track how many days worth transfer history:",
    lblSMTPServerUsedForEmailingText: "SMTP Server Used for Emailing:",
    lblSMTPServerUsernameText: "SMTP Server Username:",
    lblCheckBoxSSLOrTLSText: "SSL/TLS",
    lblCheckBoxHTMLText: "HTML",
    lblSMTPServerPasswordText: "SMTP Server Password:",
    btnTestSMTPSettingsText: "Test SMTP Settings",
    lblSMTPServerFromEmaiText: "From email address:",
    lblFTPWelcomeMessageText: "FTP Welcome Message:",
    lblMoveDeletedFilesToTempFolderText: "Move 'deleted' files/folders to temp folder. (Trash/Recycle bin)",
    btnBrowseText: "Browse",
    btnResetText: "Reset To Default",
    btnCancelText: "Cancel",
    btnOKText: "Save"
};

// Assign localizations
localizations.panels[panelName] = $.extend(panelGeneralSettings.localization, localizations.panels[panelName]);

// Interface methods
panelGeneralSettings.init = function() {
    applyLocalizations(panelName, localizations.panels);
    crushFTP.methods.setPageTitle(panelGeneralSettings.localization.Header, true);
    panelGeneralSettings.bindData();
    setupPrefsReplicationSave(_panel, panelName);
};

panelGeneralSettings.bindData = function() {
    bindValuesFromXML(_panel, common.data.ServerPrefs());
    var otp_token_timeout = $("#otp_token_timeout", _panel);
    var val_otp_token_timeout_msec = otp_token_timeout.val();
    if(val_otp_token_timeout_msec){
        otp_token_timeout.val(val_otp_token_timeout_msec / 1000);
    }
    bindValuesFromXML(_panel.find("#max_users").parent(), common.data.ServerPrefs(true));
    panelGeneralSettings.bindEvents();
    // var htmlAreaItems = $(".htmlarea:visible", _panel);
    // if (htmlAreaItems && htmlAreaItems.length > 0) {
    //     htmlAreaItems.htmlarea('dispose');
    //     htmlAreaItems.val(DOMPurify.sanitize(htmlAreaItems.val()));
    //     htmlAreaItems.htmlarea({
    //         toolbar: [
    //             "bold", "italic", "underline",
    //             "|",
    //             "h1", "h2", "h3",
    //             "|",
    //             "orderedList", "unorderedList",
    //             "|",
    //             "justifyleft", "justifycenter", "justifyright",
    //             "|",
    //             "forecolor",
    //             "|",
    //             "image",
    //             "|",
    //             "link", "unlink",
    //             "|",
    //             "increasefontsize", "decreasefontsize"
    //         ],
    //         css: "/WebInterface/Resources/css/jHtmlArea/editor.css"
    //     });
    // }

    _panel.find(".htmlswitch").unbind("change").bind("change", function(){
        var htmlBody = $(this).closest("div").find(".htmlarea");
        htmlBody.val(DOMPurify.sanitize(htmlBody.val()));
        if($(this).is(":checked")){
            htmlBody.htmlarea('dispose');
        }
        else{
            htmlBody.htmlarea('dispose');
            htmlBody.htmlarea({
                toolbar: [
                        "bold", "italic", "underline",
                        "|",
                        "h1", "h2", "h3",
                        "|",
                        "orderedList", "unorderedList",
                        "|",
                        "justifyleft", "justifycenter", "justifyright",
                        "|",
                        "forecolor",
                        "|",
                        "image",
                        "|",
                        "link", "unlink",
                        "|",
                        "increasefontsize", "decreasefontsize"
                    ],
                css : "/WebInterface/Resources/css/jHtmlArea/editor.css"
            });
        }
    }).trigger("change");

    //common.data.ServerPrefs().max_server_download_speed="0000:650;0700:325;1900:650";
    if (common.data.ServerPrefs().max_server_download_speed != undefined) {
        var downloadData = common.data.ServerPrefs().max_server_download_speed[0].text || "";
        downloadData = downloadData == "0" ? "" : downloadData;
        if (downloadData && downloadData.length != 0) {
            var timearray = downloadData.split(";");
            var uniqueNames = [];
            for (var i = 0; i < timearray.length; i++) {
                if (timearray[i] != '') {
                    var data = timearray[i].split(":");
                    data[0] = crushFTP.methods.pad(data[0], 4, "0");
                    var time = moment(data[0], "HH:mm").format("hh:mm A");
                    panelGeneralSettings.defaultGeneralSettings.outgoingSpeedAryDisplay.push(time + "/" + data[1]);
                }
            }
            var timearray = panelGeneralSettings.defaultGeneralSettings.outgoingSpeedAryDisplay;
            var ph = $(".time-list-fieldset").empty();
            for (var i = 0; i < timearray.length; i++) {
                if (timearray[i] != '') {
                    timearray[i] = crushFTP.methods.htmlEncode(timearray[i].toUpperCase());
                    var timeliststr = "<span class='time-list excludeXML' _index='1' value='" + timearray[i] + "' style='' disabled _id='" + timearray[i] + "'>" + timearray[i] + "</span><span class='pointer ui-icon ui-icon-close removefromtimelist time-list-remove-icon' _id='" + timearray[i] + "'></span>";
                    ph.append(timeliststr);

                    if ($(".time-list-fieldset span").length != 0)
                        ph.show();
                    else
                        ph.hide();
                }
            }
            setTimeout(function() {
                panelGeneralSettings.setRemoveTimeCall();
                placeHolder.removeData("hasChanged");
                itemsChanged(false);
            }, 100);
        }
    }

    if (common.data.ServerPrefs().max_server_upload_speed != undefined) {
        var uploadData = common.data.ServerPrefs().max_server_upload_speed[0].text || "";
        uploadData = uploadData == "0" ? "" : uploadData;
        if (uploadData && uploadData.length != 0) {
            var timearray = uploadData.split(";");
            var uniqueNames = [];
            for (var i = 0; i < timearray.length; i++) {
                if (timearray[i] != '') {
                    var data = timearray[i].split(":");
                    data[0] = crushFTP.methods.pad(data[0], 4, "0");
                    var time = moment(data[0], "HH:mm").format("hh:mm A");
                    panelGeneralSettings.defaultGeneralSettings.incomingSpeedAryDisplay.push(time + "/" + data[1]);
                }
            }
            var timearray = panelGeneralSettings.defaultGeneralSettings.incomingSpeedAryDisplay;
            var ph = $(".time-list-fieldset-upload").empty();
            for (var i = 0; i < timearray.length; i++) {
                if (timearray[i] != '') {
                    timearray[i] = crushFTP.methods.htmlEncode(timearray[i].toUpperCase());
                    var timeliststr = "<span class='time-list excludeXML' _index='1' value='" + timearray[i] + "' style='' disabled _uploadid='" + timearray[i] + "'>" + timearray[i] + "</span><span class='pointer ui-icon ui-icon-close removefromUploadtimelist time-list-remove-icon' _uploadid='" + timearray[i] + "'></span>";
                    ph.append(timeliststr);

                    if ($(".time-list-fieldset-upload span").length != 0)
                        ph.show();
                    else
                        ph.hide();
                }
            }
            setTimeout(function() {
                panelGeneralSettings.setRemoveUploadTimeCall();
            }, 100);
        }
    }

    setTimeout(function() {
        $('#max_server_time').timepicker({
            ampm: true,
            timeFormat: 'hh:mm tt',
            beforeShow: function(el, instance, timePicker) {
                setTimeout(function(){
                    $('#ui-datepicker-div').find(".ui-priority-primary").unbind("click.custom").bind("click.custom", function() {
                        if(!$(el).val()){
                            $(el).val(timePicker.formattedTime);
                        }
                    });
                }, 100);

                $('#ui-datepicker-div').find(".ui-datepicker-close").click(function() {
                    $('#addinTimeList').click();
                });
            }
        });

        $('#max_server_upload_time').timepicker({
            ampm: true,
            timeFormat: 'hh:mm tt',
            beforeShow: function(el, instance, timePicker) {
                setTimeout(function(){
                    $('#ui-datepicker-div').find(".ui-priority-primary").unbind("click.custom").bind("click.custom", function() {
                        if(!$(el).val()){
                            $(el).val(timePicker.formattedTime);
                        }
                    });
                }, 100);
                $('#ui-datepicker-div').find(".ui-datepicker-close").click(function() {
                    $('#addinUploadTimeList').click();
                });
            }
        });
        $("#max_server_download_speed_input").keypress(function(evt) {
            var value = $(this).val();
            var charCode = (evt.which) ? evt.which : event.keyCode;
            if ((value.indexOf('.') != -1) && (charCode != 45 && (charCode < 48 || charCode > 57))) {
                return false;
            } else if (charCode != 45 && (charCode != 46 || $(this).val().indexOf('.') != -1) && (charCode < 48 || charCode > 57)) {
                return false;
            }
            return true;
        });
        $("#max_server_upload_speed_input").keypress(function(evt) {
            var value = $(this).val();
            var charCode = (evt.which) ? evt.which : event.keyCode;
            if ((value.indexOf('.') != -1) && (charCode != 45 && (charCode < 48 || charCode > 57))) {
                return false;
            } else if (charCode != 45 && (charCode != 46 || $(this).val().indexOf('.') != -1) && (charCode < 48 || charCode > 57)) {
                return false;
            }
            return true;
        });


    }, 100);

};

panelGeneralSettings.refreshMSToken = function(dialog, client_id, pass, tenant){
    var baseURL = window.location.protocol + "//" + window.location.host + "/";
    var curURL = encodeURIComponent(baseURL) + "register_microsoft_graph_api/";
    var scope = "offline_access https://outlook.office.com/SMTP.Send";
    var ms_client_id = client_id + "~" + pass;
    var msURL = 'https://login.microsoftonline.com/'+tenant+'/oauth2/v2.0/authorize?client_id='+client_id+'&redirect_uri='+curURL+'&scope='+scope+'&response_type=code';
    dialog.parent().block({ message: "Waiting... <a href='javascript:void(0);' class='cancel' style='color:#fff;'>Cancel</a> <div style='margin-top:20px;'>(If your browser has not opened a new window, you may need to unblock popups.)</div>", overlayCSS: { opacity: 0.7, cursor: 'normal'},css: {
        border: 'none',
        backgroundColor: 'transparent',
        color: '#fff',
        'text-align':'center',
        'font-weight' : 'normal',
        opacity : 0.8,
        width : '100%',
        cursor : 'normal'
    }});
    var popup = window.open(msURL, "ms", "width=800,height=600");
    var timer, stopPolling;

    function closePopup(){
        dialog.parent().unblock();
        popup.close();
        clearTimeout(timer);
        stopPolling = true;
    }

    dialog.parent().find("a.cancel").click(function(){
        closePopup();
    });
    function checkTokenStatus(){
        if(stopPolling){
            stopPolling = false;
            return false;
        }
        crushFTP.data.serverRequest({
            command: 'lookup_microsoft_graph_api_code',
            scope: scope,
            server_url: curURL,
            client_id: ms_client_id,
            client_secret: pass,
            serverGroup : $("#userConnectionGroups").val() || "MainUsers",
            tenant : tenant
        },
        function(data){
            var code = data ? $.trim($(data).find("response").text()) : "";
            if(data && code && code != "null")
            {
                if(code.toLowerCase().indexOf("error")>=0){
                    closePopup();
                    crushFTP.UI.growl("Error: ", code, true);
                    return;
                }

                $("#smtp_pass").val(code).trigger("textchange");
                $("#smtp_pass").trigger("blur");
                $("#smtp_user").val(client_id + "~" + pass + "~" + tenant).trigger("textchange");
                $("#smtp_user").trigger("blur");
                itemsChanged(true);
                closePopup();
                crushFTP.UI.growl("Message : ", "Token Refreshed.", false, 3000);
            }
            else{
                timer = setTimeout(function(){
                    checkTokenStatus();
                }, 1000);
            }
        });
    }
    checkTokenStatus();
}

panelGeneralSettings.checkMSTokenStatus = function(){

}

panelGeneralSettings.getOAuthToken = function(){
    var baseURL = window.location.protocol + "//" + window.location.host + "/";
    var curURL = encodeURIComponent(baseURL) + "%3Fcommand%3Dregister_oauth_mail_api";
    var oauth_url = $("#smtp_client_url").val();
    var oauth_action =$("#smtp_client_action").val();
    var oauth_client_id = $("#smtp_client_id").val();
    var oauth_client_scope = $("#smtp_client_scope").val().replace(/ /g,"%20");
    var oauth_params = $("#smtp_client_params").val();
   var OauthCodeURL = oauth_url +oauth_action+  '?client_id='+oauth_client_id+'&redirect_uri='+curURL+'&scope='+oauth_client_scope+ '&response_type=code'+'&'+oauth_params;
    _panel.parent().block({ message: "Waiting... <a href='javascript:void(0);' class='cancel' style='color:#fff;'>Cancel</a> <div style='margin-top:20px;'>(If your browser has not opened a new window, you may need to unblock popups.)</div>", overlayCSS: { opacity: 0.7, cursor: 'normal'},css: {
        border: 'none',
        backgroundColor: 'transparent',
        color: '#fff',
        'text-align':'center',
        'font-weight' : 'normal',
        opacity : 0.8,
        width : '100%',
        cursor : 'normal'
    }});
    var popup = window.open(OauthCodeURL, "oAuth", "width=800,height=600");
    var timer, stopPolling;

    function closePopup(){
        _panel.parent().unblock();
        popup.close();
        clearTimeout(timer);
        stopPolling = true;
    }

    _panel.parent().find("a.cancel").click(function(){
        closePopup();
    });

    function checkTokenStatus(){
        if(stopPolling){
            stopPolling = false;
            return false;
        }
        crushFTP.data.serverRequest({
            command: 'lookup_oath_api',
            smtp_client_url:$("#smtp_client_url").val(),
            smtp_client_id: $("#smtp_client_id").val(),
            smtp_client_secret:$("#smtp_client_secret").val(),
            smtp_client_scope:$("#smtp_client_scope").val(),
            serverGroup : $("#userConnectionGroups").val() || "MainUsers",
            server_url : curURL
        },
        function(data){
            var code = data ? $.trim($(data).find("response").text()) : "";
            if(data && code && code != "null")
            {
                if(code.toLowerCase().indexOf("error")>=0){
                    closePopup();
                    crushFTP.UI.growl("Error: ", code, true);
                    return;
                }
                //dialog.find(".gdriveCredentials").find(".username").hide();
                //dialog.find("#itemProperty_option_gdrive_secretKeyID").val("user").trigger("textchange");//we use the actual google API client_id now
                // dialog.find("#itemProperty_option_gdrive_secretKey").val(code).trigger("textchange");
                $("#smtp_pass").val(code).trigger("textchange");
                $("#smtp_pass").trigger("blur");
                $("#smtp_user").val( $("#smtp_client_id").val() + '~' +$("#smtp_client_secret").val() + '~' +$("#smtp_client_url").val()).trigger("textchange");
                $("#smtp_user").trigger("blur");
                itemsChanged(true);
                closePopup();
                crushFTP.UI.growl("Message: ", "Token Refreshed.", false, 3000);
            }
            else{
                timer = setTimeout(function(){
                    checkTokenStatus();
                }, 1000);
            }
        });
    }
    checkTokenStatus();
};

panelGeneralSettings.refreshGoogleToken = function(client_id, pass, encPass){
   var baseURL = window.location.protocol + "//" + window.location.host + "/";
   var curURL = encodeURIComponent(baseURL) + "%3Fcommand%3Dregister_google_mail_api";
   var google_client_id = client_id + "~" + pass;
   var googleURL = 'https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A%2F%2Fmail.google.com%2F&redirect_uri='+curURL+'&response_type=code&access_type=offline&client_id='+client_id+'&prompt=consent';
    _panel.parent().block({ message: "Waiting... <a href='javascript:void(0);' class='cancel' style='color:#fff;'>Cancel</a> <div style='margin-top:20px;'>(If your browser has not opened a new window, you may need to unblock popups.)</div>", overlayCSS: { opacity: 0.7, cursor: 'normal'},css: {
        border: 'none',
        backgroundColor: 'transparent',
        color: '#fff',
        'text-align':'center',
        'font-weight' : 'normal',
        opacity : 0.8,
        width : '100%',
        cursor : 'normal'
    }});
    var popup = window.open(googleURL, "google", "width=800,height=600");
    var timer, stopPolling;

    function closePopup(){
        _panel.parent().unblock();
        popup.close();
        clearTimeout(timer);
        stopPolling = true;
    }

    _panel.parent().find("a.cancel").click(function(){
        closePopup();
    });

    function checkTokenStatus(){
        if(stopPolling){
            stopPolling = false;
            return false;
        }
        crushFTP.data.serverRequest({
            command: 'lookup_google_mail_api_code',
            google_client_info: google_client_id,
            serverGroup : $("#userConnectionGroups").val() || "MainUsers",
            server_url : curURL
        },
        function(data){
            var code = data ? $.trim($(data).find("response").text()) : "";
            if(data && code && code != "null")
            {
                if(code.toLowerCase().indexOf("error")>=0){
                    closePopup();
                    crushFTP.UI.growl("Error: ", code, true);
                    return;
                }
                //dialog.find(".gdriveCredentials").find(".username").hide();
                //dialog.find("#itemProperty_option_gdrive_secretKeyID").val("user").trigger("textchange");//we use the actual google API client_id now
                // dialog.find("#itemProperty_option_gdrive_secretKey").val(code).trigger("textchange");
                $("#smtp_pass").val(code).trigger("textchange");
                $("#smtp_pass").trigger("blur");
                var smpt_user = $.trim($("#smtp_user").val());
                var googlePassUser = smpt_user ?
                                        smpt_user + "~" + client_id + "~" + encPass
                                        :
                                        client_id + "~" + encPass;
                $("#smtp_user").val(googlePassUser).trigger("textchange");
                itemsChanged(true);
                closePopup();
                crushFTP.UI.growl("Message: ", "Token Refreshed.", false, 3000);
            }
            else{
                timer = setTimeout(function(){
                    checkTokenStatus();
                }, 1000);
            }
        });
    }
    checkTokenStatus();
}

panelGeneralSettings.bindEvents = function() {
    $("#trashPathBlankError", _panel).hide();
    $("a.serverFilePickButton", _panel).each(function() {
        $(this).unbind("click").click(function() {
            var curElem = $(this);
            var rel = curElem.attr("rel");
            var pickingFor = curElem.parent().parent().parent().find("label[for='"+rel+"']").text() || "";
            pickingFor = $.trim($.trim(pickingFor).replace(":", ""));
            curElem.crushFtpLocalFileBrowserPopup({
                type: curElem.attr("PickType") || 'dir',
                pickingFor: pickingFor,
                existingVal: $("#" + curElem.attr("rel"), _panel).val(),
                callback: function(selectedPath) {
                    $("#" + curElem.attr("rel"), _panel).val(selectedPath).trigger("change");
                }
            });
            return false;
        });
    });

    $("#recycle", _panel).change(function() {
        validateTrashPath();
    });

    $("#recycle_path", _panel).bind("change", function() {
        validateTrashPath();
    });

    $("#recycle_path", _panel).bind("textchange", function() {
        validateTrashPath();
    });

    $("#password_reset_message_browser").bind("textchange", function() {
        if ($(this).val().indexOf("<") >= 0 || $(this).val().indexOf(">") >= 0) {
            $("#password_reset_message_browserMsg").show();
        } else {
            $("#password_reset_message_browserMsg").hide();
        }
    });

    $("#smtp_xoauth2").bind("change", function(){
        if($(this).is(":checked")){
                $(".oauth_settings").show();
            }
            else{
                 $(".oauth_settings").hide();
            }
    }).trigger("change");

    $("#smtp_server").bind("textchange", function() {
        if ($(this).val().indexOf('gmail.com')>=0) {
            $(".googleSMTPOptions").show();
            $(".microsoftSMTPOptions").hide();
            $(".nonGoogleSMTPOptions").hide();
        } else if ($(this).val().indexOf('office365')>=0 || $(this).val().indexOf('outlook')>=0) {
            $(".microsoftSMTPOptions").show();
            $(".googleSMTPOptions").hide();
            $(".nonmicrosoftSMTPOptions").hide();
        } else {
            $(".googleSMTPOptions").hide();
            $(".microsoftSMTPOptions").hide();
            $(".nonGoogleSMTPOptions").show();
        }
    });
    $("#smtp_server").trigger("textchange");

    $("#getRefreshToken").click(function(){
        var userName = $("#smtp_user").val();
        var _name = "";
        if(userName && userName.indexOf("~")>1){
            var vals = userName.split("~");
            _name = (vals.length>2) ? vals[1] : vals[0];
        }
        jPrompt("Client ID: ", _name, "Please enter Google Oauth", function(value, other, pass){
            if(value)
            {
                var username = (value);
                if(pass){
                    crushFTP.data.encryptPass(pass, function(data){
                        if(data)
                        {
                            var generatedPass = unescape(data.response[0].text);
                            panelGeneralSettings.refreshGoogleToken(username, pass, generatedPass);
                        }
                    });
                }
                else{
                    //
                }
            }
        }, false, false, {
            appendAfterInput : '<p><label for="google_client_secret" style="display:block;">Client Secret: </label> <input type="password" placeholder="" class="extraItem" id="google_client_secret" name="google_client_secret" style="width: 500px;margin-top: 6px;" /></p>',
            prependBeforeInput: '<span class="ui-state-highlight ui-corner-all googleSMTPOptions" style="padding:3px;display:inline-block;margin:0px 3px;width:auto;position: absolute;top: 30px;right:15px;"><span style="float: left; margin-right: 0.3em;" class="ui-icon ui-icon-info"></span><span><a target="_blank" href="https://www.crushftp.com/crush9wiki/Wiki.jsp?page=SMTP%20Google%20Mail%20Integration">Learn more : SMTP Google Mail Integration</a></span></span>'
        });
        // panelGeneralSettings.refreshGoogleToken();
        return false;
    });
    $("#getMSRefreshToken").click(function(){
        var userName = $("#smtp_user").val();
        var _name = "";
        var _secret = "";
        var _tenant = "";
        if(userName && userName.indexOf("~")>1){
            var vals = userName.split("~");
            _name = (vals.length>2) ? vals[1] : vals[0];
        }
        jPrompt("Client ID: ", _name, "Please enter OneDrive/Sharepoint Oauth", function(value, other, pass, tenant){
            if(value)
            {
                crushFTP.data.encryptPass(pass, function(data){
                    if(data)
                    {
                        generatedPass = unescape(data.response[0].text);
                        panelGeneralSettings.refreshMSToken($("#GUIInterface"), value, generatedPass, tenant[1] || "common");
                    }
                });
            }
        }, false, false, {
            appendAfterInput : '<p><label for="ms_client_secret" style="display:block;">Client Secret: </label> <input type="password" placeholder="" class="extraItem" id="ms_client_secret" value="'+_secret+'" name="ms_client_secret" style="width: 500px;margin-top: 6px;" /></p><p><label for="ms_tenant" style="display:block;">Tenant: </label> <input type="text" placeholder="" class="extraItem" id="ms_tenant" value="'+_tenant+'" name="ms_tenant" style="width: 500px;margin-top: 6px;" /></p>',
            prependBeforeInput: '<span class="ui-state-highlight ui-corner-all googleSMTPOptions" style="padding:3px;display:inline-block;margin:0px 3px;width:auto;position: absolute;top: 30px;right:15px;"><span style="float: left; margin-right: 0.3em;" class="ui-icon ui-icon-info"></span><span><a target="_blank" href="https://www.crushftp.com/crush9wiki/Wiki.jsp?page=OneDrive%20Integration">Learn more : OneDrive Integration</a></span></span>'
        });
        return false;
    });
    $("#getOAuthToken").click(function(){
        panelGeneralSettings.getOAuthToken();
        return false;
    });
    function validateTrashPath() {
        if ($("#recycle", _panel).is(":checked") && $.trim($("#recycle_path", _panel).val()).length == 0) {
            $("#trashPathBlankError", _panel).show();
            $("#recycle_path", _panel).select().focus();
            return false;
        } else {
            $("#trashPathBlankError", _panel).hide();
            return true;
        }
    }

    $("a#testSMTPSettings", _panel).click(function() {
        if ($(this).attr("disabled")) return false;
        jPrompt("Please enter a 'From' email address: ", "", "From Address", function(fromEmail) {
            if (fromEmail && fromEmail.length > 0) {
                jPrompt("Please enter a 'To' email address: ", "", "To Address", function(toEmail) {
                    if (toEmail && toEmail.length > 0) {
                        var obj = {
                            command: "testSMTP",
                            to: toEmail,
                            cc: "",
                            bcc: "",
                            from: fromEmail,
                            subject: "Email Test",
                            body: "This is the body of the test message.",
                            server: crushFTP.methods.htmlEncode($("#smtp_server", _panel).val()),
                            user: crushFTP.methods.htmlEncode($("#smtp_user", _panel).val()),
                            pass: crushFTP.methods.htmlEncode($("#smtp_pass", _panel).val()),
                            ssl: $("#smtp_ssl", _panel).is(":checked"),
                            html: $("#smtp_html", _panel).is(":checked")
                        };
                        $("a#testSMTPSettings", _panel).block({
                            message: 'Wait..',
                            css: {
                                border: 'none',
                                padding: '0px 10px',
                                backgroundColor: '#000',
                                '-webkit-border-radius': '10px',
                                '-moz-border-radius': '10px',
                                opacity: .5,
                                color: '#fff',
                                'text-align': 'left'
                            }
                        }).attr("disabled", "disabled");
                        crushFTP.data.serverRequest(obj, function(msg) {
                            $("a#testSMTPSettings", _panel).unblock().removeAttr("disabled");
                            crushFTP.UI.growl("Testing SMTP Settings", DOMPurify.sanitize(decodeURIComponent($(msg).text())), false, false);
                        });
                    }
                }, false, false, {
                    messageToAppend: '<div class="ui-corner-all warning left" style="padding:5px;display:block;margin:0px 0px 10px 100px;"><span style="float: left; margin-right: 0.3em;" class="ui-icon ui-icon-info"></span>Can not be blank</div>'
                });
            }
        }, false, false, {
            messageToAppend: '<div class="ui-corner-all warning left" style="padding:5px;display:block;margin:0px 0px 10px 100px;"><span style="float: left; margin-right: 0.3em;" class="ui-icon ui-icon-info"></span>Can not be blank</div>'
        });
        return false;
    });

    $("a#testOTPSettings", _panel).click(function() {
        var curElem = $(this);
        if ($(this).attr("disabled")) return false;
        jPrompt("Please enter a phone number including country code to send sms to: ", "", "Send OTP to", function(tophone) {
            if(!tophone){
                // curElem.trigger('click');
                return;
            }
            var obj = {
                command: "testOTP",
                otp_url : crushFTP.methods.htmlEncode($("#otp_url", _panel).val()),
                otp_validated_logins : crushFTP.methods.htmlEncode($("#otp_validated_logins", _panel).val()),
                otp_username : crushFTP.methods.htmlEncode($("#otp_username", _panel).val()),
                otp_password : crushFTP.methods.htmlEncode($("#otp_password", _panel).val()),
                otp_extra1 : crushFTP.methods.htmlEncode($("#otp_extra1", _panel).val()),
                otp_extra2 : crushFTP.methods.htmlEncode($("#otp_extra2", _panel).val()),
                otp_from : crushFTP.methods.htmlEncode($("#otp_from", _panel).val()),
                otp_to : crushFTP.methods.htmlEncode(tophone),
                otp_url_verb : crushFTP.methods.htmlEncode($("#otp_url_verb", _panel).val()),
                otp_post : crushFTP.methods.htmlEncode($("#otp_post", _panel).val())
            };
            $("a#testOTPSettings", _panel).block({
                message: 'Wait..',
                css: {
                    border: 'none',
                    padding: '0px 10px',
                    backgroundColor: '#000',
                    '-webkit-border-radius': '10px',
                    '-moz-border-radius': '10px',
                    opacity: .5,
                    color: '#fff',
                    'text-align': 'left'
                }
            }).attr("disabled", "disabled");
            crushFTP.data.serverRequest(obj, function(msg) {
                $("a#testOTPSettings", _panel).unblock().removeAttr("disabled");
                crushFTP.UI.growl("Testing OTP Settings", DOMPurify.sanitize(decodeURIComponent($(msg).text())), false, false);
            });
        }, false, false, {
            messageToAppend: '<div class="ui-corner-all warning left" style="padding:5px;display:block;margin:0px 0px 10px 100px;"><span style="float: left; margin-right: 0.3em;" class="ui-icon ui-icon-info"></span>Example : +14155552671</div>'
        });
        return false;
    });

    $('#addinUploadTimeList').click(function() {
        var timevalue = $.trim($("#max_server_upload_time").val());
        var speedvalue = $.trim($("#max_server_upload_speed_input").val());
        if (!timevalue)
            return false;
        if (!speedvalue)
            return false;
        speedvalue = parseFloat(speedvalue);

        if (!panelGeneralSettings.formatTime(timevalue, "") && timevalue != '') {
            $("#max_server_upload_time").val("");
            alert(timevalue + " is not a valid Time");
            return false;
        } else if (!panelGeneralSettings.checkIfArrayIsUniqueWithValue(panelGeneralSettings.defaultGeneralSettings.incomingSpeedAryDisplay, timevalue)) {
            $("#max_server_upload_time").val("");
            alert(timevalue + " exists.");
            return false;
        } else {
            timevalue = panelGeneralSettings.formatTime(timevalue);
            panelGeneralSettings.defaultGeneralSettings.incomingSpeedAryDisplay.push(timevalue + "/" + speedvalue);
            var timearray = $.extend(true, [], panelGeneralSettings.defaultGeneralSettings.incomingSpeedAryDisplay);
            $(".time-list-fieldset-upload").html("");
            timearray.sort(function(a, b) {
                var aSplit = a.split("/");
                a = aSplit[0];
                var bSplit = b.split("/");
                b = bSplit[0];
                return new moment(a, "hh:mm A").valueOf() - new moment(b, "hh:mm A").valueOf();
            });
            panelGeneralSettings.defaultGeneralSettings.generalSettingsIncomingSpeed = "";
            for (var i = 0; i < timearray.length; i++) {
                if (timearray[i] != '') {
                    timearray[i] = crushFTP.methods.htmlEncode(timearray[i].toUpperCase());
                    var timeliststr = "<span class='time-list excludeXML' _index='1' value='" + timearray[i] + "' style='' disabled _uploadid='" + timearray[i] + "'>" + timearray[i] + "</span><span class='pointer ui-icon ui-icon-close removefromUploadtimelist time-list-remove-icon' _uploadid='" + timearray[i] + "'></span>";

                    var data = timearray[i].split("/");
                    timearray[i] = moment(data[0], "hh:mm A").format("HHmm") + ":" + data[1];

                    if (i == 0)
                        panelGeneralSettings.defaultGeneralSettings.generalSettingsIncomingSpeed += timearray[i];
                    else
                        panelGeneralSettings.defaultGeneralSettings.generalSettingsIncomingSpeed += ";" + timearray[i];

                    $(".time-list-fieldset-upload").append(timeliststr);
                    //panelGeneralSettings.setRemoveUploadTimeCall();
                }
            }
            if ($(".time-list-fieldset-upload span").length != 0)
                $(".time-list-fieldset-upload").show();
            else
                $(".time-list-fieldset-upload").hide();

            $("#max_server_upload_speed").val(panelGeneralSettings.defaultGeneralSettings.generalSettingsIncomingSpeed).trigger("change");
            setTimeout(function() {
                panelGeneralSettings.setRemoveUploadTimeCall();
            }, 100);

            $("#max_server_upload_time").val("");
            $("#max_server_upload_speed_input").val("0");
        }
        return false;
    });

    $('#addinTimeList').click(function() {
        var timevalue = $.trim($("#max_server_time").val());
        var speedvalue = $.trim($("#max_server_download_speed_input").val());
        if (!timevalue)
            return false;
        if (!speedvalue)
            return false;
        speedvalue = parseFloat(speedvalue);

        if (!panelGeneralSettings.formatTime(timevalue, "") && timevalue != '') {
            $("#max_server_time").val("");
            alert(timevalue + " is not a valid Time");
            return false;
        } else if (!panelGeneralSettings.checkIfArrayIsUniqueWithValue(panelGeneralSettings.defaultGeneralSettings.outgoingSpeedAryDisplay, timevalue)) {
            $("#max_server_time").val("");
            alert(timevalue + " exists.");
            return false;
        } else {
            timevalue = panelGeneralSettings.formatTime(timevalue);
            panelGeneralSettings.defaultGeneralSettings.outgoingSpeedAryDisplay.push(timevalue + "/" + speedvalue);
            var timearray = $.extend(true, [], panelGeneralSettings.defaultGeneralSettings.outgoingSpeedAryDisplay);
            $(".time-list-fieldset").html("");
            timearray.sort(function(a, b) {
                var aSplit = a.split("/");
                a = aSplit[0];
                var bSplit = b.split("/");
                b = bSplit[0];
                return new moment(a, "hh:mm A").valueOf() - new moment(b, "hh:mm A").valueOf();
            });
            panelGeneralSettings.defaultGeneralSettings.generalSettingsOutgoingSpeed = "";
            for (var i = 0; i < timearray.length; i++) {
                if (timearray[i] != '') {
                    timearray[i] = crushFTP.methods.htmlEncode(timearray[i].toUpperCase());
                    var timeliststr = "<span class='time-list excludeXML' _index='1' value='" + timearray[i] + "' style='' disabled _id='" + timearray[i] + "'>" + timearray[i] + "</span><span class='pointer ui-icon ui-icon-close removefromtimelist time-list-remove-icon' _id='" + timearray[i] + "'></span>";

                    var data = timearray[i].split("/");
                    timearray[i] = moment(data[0], "hh:mm A").format("HHmm") + ":" + data[1];

                    if (i == 0)
                        panelGeneralSettings.defaultGeneralSettings.generalSettingsOutgoingSpeed += timearray[i];
                    else
                        panelGeneralSettings.defaultGeneralSettings.generalSettingsOutgoingSpeed += ";" + timearray[i];

                    $(".time-list-fieldset").append(timeliststr);
                }
            }
            if ($(".time-list-fieldset span").length != 0)
                $(".time-list-fieldset").show();
            else
                $(".time-list-fieldset").hide();

            $("#max_server_download_speed").val(panelGeneralSettings.defaultGeneralSettings.generalSettingsOutgoingSpeed).trigger("change");
            setTimeout(function() {
                panelGeneralSettings.setRemoveTimeCall();
            }, 100);

            $("#max_server_time").val("");
            $("#max_server_download_speed_input").val("0");
        }
        return false;
    });

    $("#max_server_download_speed_input", _panel).keypress(function(evt) {
        var value = $(this).val();
        var charCode = (evt.which) ? evt.which : event.keyCode;
        if ((value.indexOf('.') != -1) && (charCode != 45 && (charCode < 48 || charCode > 57))) {
            return false;
        } else if (charCode != 45 && (charCode != 46 || $(this).val().indexOf('.') != -1) && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    });
};


panelGeneralSettings.saveContent = function() {
    if (placeHolder.data("hasChanged")) {
        _panel.find(".htmlswitch").trigger("change");
        if ($("#recycle", _panel).is(":checked") && $.trim($("#recycle_path", _panel).val()).length == 0) {
            $("#trashPathBlankError", _panel).show();
            $("#recycle_path", _panel).select().focus();
            return false;
        } else {
            $("#trashPathBlankError", _panel).hide();
        }
        crushFTP.UI.showIndicator(false, false, "Please wait..");
        var otp_token_timeout = $("#otp_token_timeout", _panel);
        var val_otp_token_timeout_sec = otp_token_timeout.val();
        if(val_otp_token_timeout_sec){
            otp_token_timeout.val(val_otp_token_timeout_sec * 1000);
        }
        var dataXML = '<server_prefs type="properties">' + buildXMLToSubmitForm(_panel) + '</server_prefs>';
        if(val_otp_token_timeout_sec){
            otp_token_timeout.val(val_otp_token_timeout_sec);
        }
        crushFTP.data.setXMLPrefs("server_settings/server_prefs/", "properties", "update", dataXML, function(data) {
            data = $.xml2json(data, true);
            if (data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK") {
                common.data.updateLocalPrefs(function() {
                    crushFTP.UI.hideIndicator();
                    crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
                    placeHolder.removeData("hasChanged");
                });
            } else {
                crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
            }
        }, panelGeneralSettings.saveParams);
    } else {
        crushFTP.UI.growl("No changes made", "", false, 3000);
    }
};

panelGeneralSettings.setRemoveUploadTimeCall = function() {
    $(".removefromUploadtimelist", _panel).unbind("click").bind("click", function() {
        for (var i = 0; i < panelGeneralSettings.defaultGeneralSettings.incomingSpeedAryDisplay.length; i++) {
            if (panelGeneralSettings.defaultGeneralSettings.incomingSpeedAryDisplay[i].toUpperCase() == $(this).attr("_uploadid").toUpperCase()) {
                panelGeneralSettings.defaultGeneralSettings.incomingSpeedAryDisplay.splice(i, 1);
                $("span[_uploadid='" + $(this).attr("_uploadid") + "']").remove();
                $(this).remove();
            }
        }
        panelGeneralSettings.defaultGeneralSettings.generalSettingsIncomingSpeed = "";
        var timearray = $.extend(true, [], panelGeneralSettings.defaultGeneralSettings.incomingSpeedAryDisplay);
        for (var i = 0; i < timearray.length; i++) {
            if (timearray[i] != '') {
                var data = timearray[i].split("/");
                    timearray[i] = moment(data[0], "hh:mm A").format("HHmm") + ":" + data[1];
                if (i == 0)
                    panelGeneralSettings.defaultGeneralSettings.generalSettingsIncomingSpeed += timearray[i];
                else
                    panelGeneralSettings.defaultGeneralSettings.generalSettingsIncomingSpeed += ";" + timearray[i];
            }
        }
        $("#max_server_upload_speed").val(panelGeneralSettings.defaultGeneralSettings.generalSettingsIncomingSpeed);
        if ($(".time-list-fieldset-upload span").length != 0)
            $(".time-list-fieldset-upload").show();
        else
            $(".time-list-fieldset-upload").hide();
        itemsChanged(true);
    });
};
panelGeneralSettings.setRemoveTimeCall = function() {
    $(".removefromtimelist", _panel).unbind("click").bind("click", function() {
        for (var i = 0; i < panelGeneralSettings.defaultGeneralSettings.outgoingSpeedAryDisplay.length; i++) {
            if (panelGeneralSettings.defaultGeneralSettings.outgoingSpeedAryDisplay[i].toUpperCase() == $(this).attr("_id").toUpperCase()) {
                panelGeneralSettings.defaultGeneralSettings.outgoingSpeedAryDisplay.splice(i, 1);
                $("span[_id='" + $(this).attr("_id") + "']").remove();
                $(this).remove();
            }
        }
        panelGeneralSettings.defaultGeneralSettings.generalSettingsOutgoingSpeed = "";
        var timearray = $.extend(true, [], panelGeneralSettings.defaultGeneralSettings.outgoingSpeedAryDisplay);
        for (var i = 0; i < timearray.length; i++) {
            if (timearray[i] != '') {
                var data = timearray[i].split("/");
                timearray[i] = moment(data[0], "hh:mm A").format("HHmm") + ":" + data[1];

                if (i == 0)
                    panelGeneralSettings.defaultGeneralSettings.generalSettingsOutgoingSpeed += timearray[i];
                else
                    panelGeneralSettings.defaultGeneralSettings.generalSettingsOutgoingSpeed += ";" + timearray[i];
            }
        }
        itemsChanged(true);
        $("#max_server_download_speed").val(panelGeneralSettings.defaultGeneralSettings.generalSettingsOutgoingSpeed);
        if ($(".time-list-fieldset span").length != 0)
            $(".time-list-fieldset").show();
        else
            $(".time-list-fieldset").hide();
    });
};
panelGeneralSettings.formatTime = function(time, speed) {
    var result = false,
        m, n;
    time = time.trim();
    //var re = /^\s*([01]?\d|2[0-3]):?([0-5]\d)\s*$/;
    var re = /^\s*([01]?\d|2[0-3]):?([0-5]\d) [APap][mM]$/;
    var re2 = /^\s*([01]?\d|2[0-3]):?([0-5]\d)[APap][mM]$/;
    var regex = /^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/;
    var regex2 = /^(0?[1-9]|1[012])(:[0-5]\d)[APap][mM]$/;
    if ((regex.test(time) || regex2.test(time)) && time != '') {
        if ((m = time.match(re)) || (n = time.match(re2))) {
            time = time.trim().slice(-2);
            if (!m == false)
                result = (m[1].length === 2 ? "" : "0") + m[1] + ":" + m[2];
            else if (!n == false)
                result = (n[1].length === 2 ? "" : "0") + n[1] + ":" + n[2];

            result = result + " " + time;
        }
    }
    if (result)
        return result;
    else
        return time;
};
panelGeneralSettings.checkIfArrayIsUnique = function(myarray) {
    for (var i = 0; i < myarray.length; i++) {
        if (myarray[i] != '') {
            if (myarray.indexOf(myarray[i]) !== myarray.lastIndexOf(myarray[i])) {
                return false;
            }
        }
    }
    return true;
};
panelGeneralSettings.checkIfArrayIsUniqueWithValue = function(myarray, value) {
    for (var i = 0; i < myarray.length; i++) {
        if (myarray[i] != '') {
            var checkVal = panelGeneralSettings.formatTime(myarray[i].toUpperCase());
            checkVal = checkVal.split("/");
            checkVal = checkVal[0];
            if (checkVal == panelGeneralSettings.formatTime(value.toUpperCase())) {
                return false;
            }
        }
    }
    return true;
};