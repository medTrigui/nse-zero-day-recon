/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelWebInterface = {};
panelWebInterface.localization = {};
/****************************/

// Panel details
var panelName = "WebInterface";
var _panel = $("#pnl" + panelName);

panelWebInterface.changesDetected = [];
panelWebInterface.changed = function(name){
    if(panelWebInterface.changesDetected.indexOf(name)<0)
        panelWebInterface.changesDetected.push(name);
}

// Localizations
panelWebInterface.localization = {
    headerText: " ",
    lblCustomFormsTabText: "Custom Forms",
    lblMiniURLsTabText: "Mini URLs",
    lblOptionsTabText: "Options",
    lblTextTabText: "Text",
    lblProxyTabText: "Proxy",
    btnCreateNewFormText: "New",
    btnCreateDuplicateOfFormText: "Duplicate",
    btnDeleteFormText: "Delete",
    lblFormBuilderLabelText: " Label ",
    lblFormBuilderTextFieldInputText: "Text Field",
    lblFormBuilderBigTextFieldText: "Big Text Field (Textarea)",
    lblFormBuilderDropdownText: "Dropdown",
    lblFormBuilderCheckboxText: " Checkbox ",
    lblFormBuilderRadioText: " Radio ",
    btnFormBuilderEditEntryText: " Edit Entry",
    btnFormBuilderMoveEntryUpText: " Move Entry Up ",
    btnFormBuilderMoveEntryDownText: " Move Entry Down ",
    btnFormBuilderDeleteEntryText: " Delete Entry ",
    lblFormBuilderPreviewText: " Preview: ",
    pnlMiniUrlsHeaderNoteText: " A mini URL is a secure URL you can send to clients. It allows an end user to accsss a specific file, or folder without needing to login. It does not include the username or password as part of the URL. When a user uses the URL, it allows them to be logged in to an account, to retrieve the file specified. You may also set an expiration of when the URL will automatically be deleted and no longer valid. ",
    btnMiniUrlsAddMiniURLText: "Add Mini URL",
    btnMiniUrlsRemoveURLText: "Remove Mini URL",
    lblMiniUrlsFormURLKeyText: "MiniURL Key:",
    btnMiniUrlsFormCopyToClipboardText: "Copy To Clipboard",
    lblMiniUrlsFormURLPointsToText: "MiniURL Points To:",
    lblMiniUrlsExpirationDateText: "Expiration Date:",
    lblMiniUrlsFormSetDaysText: "Set Days",
    lblMiniUrlsFormSetDaysDescText: "Example 01/01/2008 08:00 AM",
    lblMiniUrlsLoginUsernameText: "Login Username:",
    lblMiniUrlsLoginPasswordText: "Login Password:",
    pnlOptionsHeaderNoteText: " You may set a default logo file to be used. The file will be used as the default unless you override it with a custom setting on a per user basis. This includes the logo that is displayed for the login page. <br> <br> Its important to set this here as just replacing the logo.png file will get overwritten the next time you update. Your logo file must be in the Weblnterface/images/ directory for it to work. Enter the name of your logo file below. The default is 'logo.png', but you should use a different name to prevent your logo from being overwritten ",
    pnlOptionsHeaderNotePart2Text: ' Multiple domains pointed at this one machine? Make specific login pages styled to fit each domain so your customers get the styled page you want them to see. You may also use this to alter the default login page users will see. Dont use the default "login.html" as its a file CrushFTP owns and will update it with each new release. So make your own file and point the login at it. ',
    btnOptionsAddNewLoginPageText: " Add New Login Page",
    btnOptionsEditLoginPageText: " Edit Selected Login Page ",
    btnOptionsDeleteLoginPageText: " Remove Selected Login Page ",
    btnOptionsLoginPageMoveUpText: " Move Up ",
    btnOptionsLoginPageMoveDownText: " Move Down ",
    lblBoxAllowGZipText: "Allow GZIP Encoding",
    lblBoxDisplayAlternateLogoText: "Display alternate '.logo.png' in folders",
    lblHideEmailForgottehPaswdLinkText: "Hide email forgotten password link",
    lblDefaultWindowTitleText: "Login screen window Title",
    lblOptionsHeaderNoteText: " Enter a footer message that will be added to all user's pages. This is a global footer, and is different than the footer text that can be applied on a per user basis. ",
    lblOptions404ErrorHeaderText: " 404 Error Response Text: ",
    lblOptions404ErrorDescText: " In rare cases a 404 error may be returned, and this text will be included. ",
    lblOptionsPasswordReminderHeaderText: " Password Reminder Email (If they click the 'I forgot my password, email it to me'. link) ",
    lblOptionsPasswordReminderMailSubjectLabelText: "Subject:",
    lblOptionsPasswordReminderMailBodyLabelText: "Body:",
    lblOptionsPasswordResetMessageLabelText: "Password Reset Message:",
    lblProxyOptionsKeepCopyOfUploadedFilesText: "Keep copy of uploaded files passing through server.",
    lblProxyOptionsUploadedFileRepoText: "Uploaded file repository:",
    lblProxyOptionsKeepCopyOfDownloadedFilesText: "Keep copy of downloaded files passing through server.",
    lblProxyOptionsDownloadedFileRepoText: "Downloaded file repository:",
    btnBrowseText: 'Browse',
    lblProxyHostRulesHeaderText: " Proxy Host Rules ",
    btnProxyAddNewRuleText: " Add New",
    btnProxyEditRuleText: " Edit Selected ",
    btnProxyRemoveRuleText: " Remove Selected ",
    btnProxyRuleMoveUpText: " Move Up ",
    btnProxyRuleMoveDownText: " Move Down ",
    btnResetText: "Reset To Default",
    btnCancelText: "Cancel",
    btnOKText: "Save"
};

panelWebInterface.loginThemes = {
    base: "",
    dark: "body\r\n{\r\nbackground : #000;\r\ncolor : #fff;\r\n}\r\ndiv#panelbody, div#changepasswordPanel\r\n{\r\nbackground-color:#000;\r\nborder: 1px solid #302E2E;\r\nbox-shadow: 0px 0px 20px 0px #302E2E;\r\n-webkit-box-shadow: 0px 0px 20px 0px #302E2E;\r\n-moz-box-shadow: 0px 0px 20px 0px #302E2E;\r\n}\r\ndiv#login label, div#changepasswordPanel label\r\n{\r\ncolor : #fff;\r\n}\r\n.blockUI\r\n{\r\nbox-shadow: 0px 0px 20px 0px #302E2E;\r\n-webkit-box-shadow: 0px 0px 20px 0px #302E2E;\r\n-moz-box-shadow: 0px 0px 20px 0px #302E2E;\r\n}\r\n.blockUI h2, .blockUI h1\r\n{\r\nfont-size:13px;\r\nline-height:20px;\r\ntext-align: left;\r\npadding-left: 10px;\r\n}\r\n.blockUI h1\r\n{\r\nfont-size:20px;\r\n}\r\n.popupHeader{\r\nbackground: transparent;\r\ntext-align: center;\r\nborder-bottom: 1px solid #F1EEEE;\r\nborder-radius: 0px;\r\npadding-bottom: 5px;\r\nmargin-bottom: 10px;\r\n}\r\n\r\n.passwordChangeNote{\r\ntext-align: center;\r\nmargin-bottom: 10px;\r\n}\r\n",
    bluewhite: "body\r\n{\r\nbackground : #fff;\r\ncolor : #fff;\r\n}\r\ndiv#panelbody, div#changepasswordPanel\r\n{\r\nbackground-color:#4c66a4;\r\nborder: 1px solid #4c66a4;\r\nbox-shadow: 0px 0px 20px 0px #4c66a4;\r\n-webkit-box-shadow: 0px 0px 20px 0px #4c66a4;\r\n-moz-box-shadow: 0px 0px 20px 0px #4c66a4;\r\n}\r\ndiv#login label, div#changepasswordPanel label\r\n{\r\ncolor : #fff;\r\n}\r\ndiv#login p.lostpassword a\r\n{\r\ncolor : #fff !important;\r\n}\r\n.blockUI\r\n{\r\nbox-shadow: 0px 0px 20px 0px #4c66a4;\r\n-webkit-box-shadow: 0px 0px 20px 0px #4c66a4;\r\n-moz-box-shadow: 0px 0px 20px 0px #4c66a4;\r\n}\r\n.blockUI h2, .blockUI h1\r\n{\r\nfont-size:13px;\r\nline-height:20px;\r\ntext-align: left;\r\npadding-left: 10px;\r\n}\r\n.blockUI h1\r\n{\r\nfont-size:20px;\r\n}\r\n.popupHeader{\r\nbackground: transparent;\r\ntext-align: center;\r\nborder-bottom: 1px solid #F1EEEE;\r\nborder-radius: 0px;\r\npadding-bottom: 5px;\r\nmargin-bottom: 10px;\r\n}\r\n\r\n.passwordChangeNote{\r\ntext-align: center;\r\nmargin-bottom: 10px;\r\n}\r\n",
    blue: "body\r\n{\r\nbackground : #dae1f2;\r\ncolor : #000;\r\n}\r\ndiv#panelbody, div#changepasswordPanel\r\n{\r\nbackground-color:#dae1f2;\r\nborder: 1px solid #4c66a4;\r\nbox-shadow: 0px 0px 20px 0px #4c66a4;\r\n-webkit-box-shadow: 0px 0px 20px 0px #4c66a4;\r\n-moz-box-shadow: 0px 0px 20px 0px #4c66a4;\r\n}\r\ndiv#login label, div#changepasswordPanel label\r\n{\r\ncolor : #000;\r\n}\r\n.blockUI\r\n{\r\nbox-shadow: 0px 0px 20px 0px #4c66a4;\r\n-webkit-box-shadow: 0px 0px 20px 0px #4c66a4;\r\n-moz-box-shadow: 0px 0px 20px 0px #4c66a4;\r\n}\r\n.blockUI h2, .blockUI h1\r\n{\r\nfont-size:13px;\r\nline-height:20px;\r\ntext-align: left;\r\npadding-left: 10px;\r\n}\r\n.blockUI h1\r\n{\r\nfont-size:20px;\r\n}\r\n.popupHeader{\r\nbackground: transparent;\r\ntext-align: center;\r\nborder-bottom: 1px solid #F1EEEE;\r\nborder-radius: 0px;\r\npadding-bottom: 5px;\r\nmargin-bottom: 10px;\r\n}\r\n\r\n.passwordChangeNote{\r\ntext-align: center;\r\nmargin-bottom: 10px;\r\n}\r\n",
    green: "body\r\n{\r\nbackground : #619e5d;\r\ncolor : #fff;\r\n}\r\ndiv#panelbody, div#changepasswordPanel\r\n{\r\nbackground-color:#619e5d;\r\nborder: 1px solid #57805c;\r\nbox-shadow: 0px 0px 20px 0px #0D0E0D;\r\n-webkit-box-shadow: 0px 0px 20px 0px #0D0E0D;\r\n-moz-box-shadow: 0px 0px 20px 0px #0D0E0D;\r\n}\r\ndiv#login label, div#changepasswordPanel label\r\n{\r\ncolor : #fff;\r\n}\r\ndiv#login p.lostpassword a\r\n{\r\ncolor : #fff !important;\r\n}\r\n.blockUI\r\n{\r\nbox-shadow: 0px 0px 20px 0px #0D0E0D;\r\n-webkit-box-shadow: 0px 0px 20px 0px #0D0E0D;\r\n-moz-box-shadow: 0px 0px 20px 0px #0D0E0D;\r\n}\r\n.blockUI h2, .blockUI h1\r\n{\r\nfont-size:13px;\r\nline-height:20px;\r\ntext-align: left;\r\npadding-left: 10px;\r\n}\r\n.blockUI h1\r\n{\r\nfont-size:20px;\r\n}\r\n.popupHeader{\r\nbackground: transparent;\r\ntext-align: center;\r\nborder-bottom: 1px solid #F1EEEE;\r\nborder-radius: 0px;\r\npadding-bottom: 5px;\r\nmargin-bottom: 10px;\r\n}\r\n\r\n.passwordChangeNote{\r\ntext-align: center;\r\nmargin-bottom: 10px;\r\n}\r\n",
    greenwhite: "body\r\n{\r\nbackground : #fff;\r\ncolor : #000;\r\n}\r\ndiv#panelbody, div#changepasswordPanel\r\n{\r\nbackground-color:#619e5d;\r\nborder: 1px solid #57805c;\r\nbox-shadow: 0px 0px 20px 0px #0D0E0D;\r\n-webkit-box-shadow: 0px 0px 20px 0px #0D0E0D;\r\n-moz-box-shadow: 0px 0px 20px 0px #0D0E0D;\r\n}\r\ndiv#login label, div#changepasswordPanel label\r\n{\r\ncolor : #fff;\r\n}\r\ndiv#login p.lostpassword a\r\n{\r\ncolor : #fff !important;\r\n}\r\n.blockUI\r\n{\r\nbox-shadow: 0px 0px 20px 0px #0D0E0D;\r\n-webkit-box-shadow: 0px 0px 20px 0px #0D0E0D;\r\n-moz-box-shadow: 0px 0px 20px 0px #0D0E0D;\r\n}\r\n.blockUI h2, .blockUI h1\r\n{\r\nfont-size:13px;\r\nline-height:20px;\r\ntext-align: left;\r\npadding-left: 10px;\r\n}\r\n.blockUI h1\r\n{\r\nfont-size:20px;\r\n}\r\n.popupHeader{\r\nbackground: transparent;\r\ntext-align: center;\r\nborder-bottom: 1px solid #F1EEEE;\r\nborder-radius: 0px;\r\npadding-bottom: 5px;\r\nmargin-bottom: 10px;\r\n}\r\n\r\n.passwordChangeNote{\r\ntext-align: center;\r\nmargin-bottom: 10px;\r\n}\r\n",
    red: "body\r\n{\r\nbackground : #fff;\r\ncolor : #fff;\r\n}\r\ndiv#panelbody, div#changepasswordPanel\r\n{\r\nbackground-color:#c00;\r\nborder: 1px solid #c00;\r\nbox-shadow: 0px 0px 20px 0px #c00;\r\n-webkit-box-shadow: 0px 0px 20px 0px #c00;\r\n-moz-box-shadow: 0px 0px 20px 0px #c00;\r\n}\r\ndiv#login label, div#changepasswordPanel label\r\n{\r\ncolor : #fff;\r\n}\r\ndiv#login p.lostpassword a\r\n{\r\ncolor : #fff !important;\r\n}\r\n.blockUI\r\n{\r\nbox-shadow: 0px 0px 20px 0px #c00;\r\n-webkit-box-shadow: 0px 0px 20px 0px #c00;\r\n-moz-box-shadow: 0px 0px 20px 0px #c00;\r\n}\r\n.blockUI h2, .blockUI h1\r\n{\r\nfont-size:13px;\r\nline-height:20px;\r\ntext-align: left;\r\npadding-left: 10px;\r\n}\r\n.blockUI h1\r\n{\r\nfont-size:20px;\r\n}\r\n.popupHeader{\r\nbackground: transparent;\r\ntext-align: center;\r\nborder-bottom: 1px solid #F1EEEE;\r\nborder-radius: 0px;\r\npadding-bottom: 5px;\r\nmargin-bottom: 10px;\r\n}\r\n\r\n.passwordChangeNote{\r\ntext-align: center;\r\nmargin-bottom: 10px;\r\n}\r\n"
};

// Assign localizations
localizations.panels[panelName] = $.extend(panelWebInterface.localization, localizations.panels[panelName]);

panelWebInterface.formControls = {};

// Interface methods
panelWebInterface.init = function() {
    applyLocalizations(panelName, localizations.panels);
    crushFTP.methods.setPageTitle(panelWebInterface.localization.Header, true);
    panelWebInterface.bindData();
    panelWebInterface.bindEvents();
    $("#themeSelector", _panel).dialog({
        autoOpen: false,
        width: 700,
        modal: true,
        resizable: false,
        closeOnEscape: true
    });
    setupPrefsReplicationSave(_panel, panelName);
}

panelWebInterface.bindData = function() {
    var prefs = common.data.ServerPrefs();
    var formCustomFormList = $("#CustomForms", _panel);
    var selectedForm = formCustomFormList.find(":selected").index();
    if (prefs.Access_Control_Allow_Origin) {
        prefs["Access-Control-Allow-Origin"] = prefs.Access_Control_Allow_Origin;
    }
    bindValuesFromXML(_panel, prefs);
    var loginPageList = common.data.getSubValueFromPrefs("login_page_list");
    if (loginPageList) {
        var formloginPageList = $("#loginPageList", _panel);
        var selected = formloginPageList.find(".ui-widget-header").index();
        formloginPageList.empty();
        for (var i = 0; i < loginPageList.length; i++) {
            var curItem = loginPageList[i];
            if (curItem) {
                var favicon = common.data.getTextContentFromPrefs(curItem, "favicon");
                var page = common.data.getTextContentFromPrefs(curItem, "page");
                var domain = common.data.getTextContentFromPrefs(curItem, "domain");
                var loginPage = domain + " -> " + page + ":" + favicon;
                var newControl = $("<li class='ui-widget-content' loginPage='" + crushFTP.methods.htmlEncode(loginPage) + "'>" + crushFTP.methods.htmlEncode(loginPage) + " <span class='drag ui-icon ui-icon-grip-dotted-vertical'></span><span class='delete-control'> x </span> </li>");
                formloginPageList.append(newControl);
                newControl.data("controlData", curItem);
            }
        }
        if (selected >= 0)
            $(formloginPageList.find("li").get(selected)).addClass("ui-widget-header ui-selected");

        formloginPageList.sortable({
            update : function(evt, ui){
                itemsChanged(true);
                panelWebInterface.changed("loginpages");
            }
        });
        formloginPageList.find("li").unbind("dblclick").bind("dblclick", function(){
            formloginPageList.find("li").removeClass('ui-selected');
            $(this).addClass('ui-selected');
            $("#editNewLoginPage", _panel).trigger('click');
        });
        formloginPageList.find("li").unbind("click").bind("click", function(){
            formloginPageList.find("li").removeClass('ui-selected ui-widget-header');
            $(this).addClass('ui-selected ui-widget-header');
        });
        formloginPageList.find(".delete-control").click(function(){
            formloginPageList.find("li").removeClass('ui-selected ui-widget-header');
            $(this).closest("li").addClass('ui-selected ui-widget-header');
            $("#removeLoginPage").trigger("click");
        });
    }

    var proxyRules = common.data.getSubValueFromPrefs("proxyRules");
    if (proxyRules) {
        var formProxyRulesList = $("#proxyRules", _panel);
        var selected = formProxyRulesList.find(".ui-widget-header").index();
        formProxyRulesList.empty();
        for (var i = 0; i < proxyRules.length; i++) {
            var curItem = proxyRules[i];
            if (curItem) {
                var proxyName = common.data.getTextContentFromPrefs(curItem, "proxyName");
                if (proxyName.length > 0) {
                    var protocol = common.data.getTextContentFromPrefs(curItem, "protocol");
                    var host = common.data.getTextContentFromPrefs(curItem, "host");
                    var condition = common.data.getTextContentFromPrefs(curItem, "condition");
                    var criteria1 = common.data.getTextContentFromPrefs(curItem, "criteria1");
                    var criteria2 = common.data.getTextContentFromPrefs(curItem, "criteria2");
                    var port = common.data.getTextContentFromPrefs(curItem, "port");
                    var proxyRuleText = proxyName + "   " + protocol + "://" + host + ":" + port + "   ";
                    var ruleType = "Custom";
                    if (condition == "=" && criteria1 == "%user_name%" && criteria2 == "*") {
                        ruleType = "Whitelist";
                    } else if (condition == "=" && criteria1 == "1" && criteria2 == "2") {
                        ruleType = "Blacklist";
                    }
                    if (ruleType == "Custom") {
                        proxyRuleText = proxyRuleText + criteria1 + " " + condition + " " + criteria2;
                    } else {
                        proxyRuleText = proxyRuleText + ruleType;
                    }
                    var newControl = $("<li class='ui-widget-content'>" + crushFTP.methods.htmlEncode(proxyRuleText) + " <span class='drag ui-icon ui-icon-grip-dotted-vertical'></span><span class='delete-control'> x </span> </li>");
                    formProxyRulesList.append(newControl);
                    newControl.data("controlData", curItem);
                }
            }
        }
        if (selected >= 0)
            $(formProxyRulesList.find("li").get(selected)).addClass("ui-widget-header ui-selected");
        formProxyRulesList.sortable({
            update : function(evt, ui){
                itemsChanged(true);
                panelWebInterface.changed("proxy");
            }
        });
        formProxyRulesList.find("li").unbind("dblclick").bind("dblclick", function(){
            formProxyRulesList.find("li").removeClass('ui-selected');
            $(this).addClass('ui-selected');
            $("#editProxyRule", _panel).trigger('click');
        });
        formProxyRulesList.find("li").unbind("click").bind("click", function(){
            formProxyRulesList.find("li").removeClass('ui-selected ui-widget-header');
            $(this).addClass('ui-selected ui-widget-header');
        });
        formProxyRulesList.find(".delete-control").click(function(){
            formProxyRulesList.find("li").removeClass('ui-selected ui-widget-header');
            $(this).closest("li").addClass('ui-selected ui-widget-header');
            $("#removeProxyRule").trigger("click");
        });
    }

    var CustomForms = common.data.getSubValueFromPrefs("CustomForms");
    if (CustomForms) {
        formCustomFormList.empty();
        for (var i = 0; i < CustomForms.length; i++) {
            var curItem = CustomForms[i];
            if (curItem) {
                var name = common.data.getTextContentFromPrefs(curItem, "name");
                var id = common.data.getTextContentFromPrefs(curItem, "id");
                if (formCustomFormList.find("option[value='" + id + "']").length == 0) {
                    formCustomFormList.append("<option value='" + crushFTP.methods.htmlEncode(id) + "'>" + crushFTP.methods.htmlEncode(name) + "</option>");
                    panelWebInterface.formControls[id] = curItem;
                }
            }
        }
        if (selectedForm >= 0)
            $(formCustomFormList.find("option").get(selectedForm)).attr("selected", "selected");
    }

    panelWebInterface.bindMiniURLs();
    panelWebInterface.bindFormDetails();
    panelWebInterface.bindCSP();
}

panelWebInterface.bindMiniURLs = function (sortBy, sortType) {
    var miniURLs = common.data.getSubValueFromPrefs("miniURLs");
    if (miniURLs) {
        var formMiniURLsList = $("#miniURLs", _panel);
        var selected = formMiniURLsList.find(".ui-widget-header").index();
        formMiniURLsList.empty();
        sortBy = sortBy || $("#miniURLSortLinks").find("a.desc, a.asc").attr("rel") || "user";
        if (!sortType)
        {
            sortType = $("#miniURLSortLinks").find("a.desc").length > 0 ? "desc" : "asc";
        }
        function sortData() {
            miniURLs = miniURLs.sort(function (a, b) {
                return (
                    common.data.getTextContentFromPrefs(a, sortBy) > common.data.getTextContentFromPrefs(b, sortBy)) ? 1 :((common.data.getTextContentFromPrefs(b, sortBy) > common.data.getTextContentFromPrefs(a, sortBy)) ? -1 : 0);
            });
            if (sortType == "desc")
                miniURLs = miniURLs.reverse();
        }
        sortData();
        for (var i = 0; i < miniURLs.length; i++) {
            var curItem = miniURLs[i];
            if (curItem) {
                var key = common.data.getTextContentFromPrefs(curItem, "key");
                var user = common.data.getTextContentFromPrefs(curItem, "user");
                var redirect = common.data.getTextContentFromPrefs(curItem, "redirect");
                var expires = common.data.getTextContentFromPrefs(curItem, "expire") || "-";
                if (key != "null") {
                    var newControl = $("<li class='ui-widget-content' key='" + crushFTP.methods.htmlEncode(key) + "'>(<span style='display:inline-block;position:relative;' class='ui-icon ui-icon-person'></span>"+crushFTP.methods.htmlEncode(user)+") " + crushFTP.methods.htmlEncode(key) + " --> " + crushFTP.methods.htmlEncode(redirect) + "<span style='float:right;'> <span style='display:inline-block;position:relative;' class='ui-icon ui-icon-calendar'></span> "+crushFTP.methods.htmlEncode(expires)+" </span></li>");
                    formMiniURLsList.append(newControl);
                    newControl.data("controlData", curItem);
                }
            }
        }
        if(selected>=0)
            $(formMiniURLsList.find("li").get(selected)).addClass("ui-widget-header ui-selected");
        panelWebInterface.bindMiniURLDetails();
    }
}

panelWebInterface.addThemeCSS = function(theme) {
    var customCssTA = $("#login_custom_script", _panel);
    var curCSS = customCssTA.val();
    var themeCss = panelWebInterface.loginThemes[theme] || "";
    themeCss = "\r\n</script>\r\n<!-- ### Don't change this unless you are sure what you are doing ###  -->\r\n\r\n<!-- ### Login Page Theme : " + theme + " ###  -->\r\n<style>\r\n" + themeCss + "</style>\r\n";
    if (curCSS.indexOf("<!--LoginPageThemeStart-->") >= 0) {
        var start = curCSS.indexOf("<!--LoginPageThemeStart-->");
        var end = curCSS.indexOf("<!--LoginPageThemeEnd-->");
        var buildThemeCSS = curCSS.substr(0, start) + "\r\n<!--LoginPageThemeStart-->" + themeCss + "<!--LoginPageThemeEnd-->\r\n" + curCSS.substr(end + ("<!--LoginPageThemeEnd-->").length, curCSS.length);
        customCssTA.val(buildThemeCSS).trigger("change").focus();
    } else {
        var buildThemeCSS = curCSS + "\r\n<!--LoginPageThemeStart-->" + themeCss + "<!--LoginPageThemeEnd-->";
        customCssTA.val(buildThemeCSS).trigger("change").focus();
    }
    panelWebInterface.changed("options");
}

panelWebInterface.addResponsiveCss = function() {
    var customCssTA = $("#login_custom_script", _panel);
    var curCSS = customCssTA.val();
    var themeCss = "\r\n@media screen and (max-width:580px) {\r\n.login input, .login div, .login label{\r\nmax-width: 99%;\r\n}\r\n.login div#login{\r\nmargin-top: 20px;\r\n}\r\ndiv#login div#branding img\r\n{\r\nmax-width: 70%;\r\n}\r\n.login .submit{\r\nposition: absolute;\r\nleft: 50%;\r\nmargin-top: -45px !important;\r\ndisplay: inline-block;\r\nwidth: 50px !important;\r\n}\r\n.login .lostpassword\r\n{\r\ntext-align: center;\r\nmargin-top: 28px;\r\nwidth: 100%;\r\n}\r\n}\r\n";
    themeCss = "\r\n</script>\r\n<!-- ### Don't change this unless you are sure what you are doing ###  -->\r\n\r\n<!-- ### Login Page Responsive CSS  ###  -->\r\n<style>\r\n" + themeCss + "</style>\r\n";
    if (curCSS.indexOf("<!--LoginPageResponsiveCSSStart-->") >= 0) {
        var start = curCSS.indexOf("<!--LoginPageResponsiveCSSStart-->");
        var end = curCSS.indexOf("<!--LoginPageResponsiveCSSEnd-->");
        var buildThemeCSS = curCSS.substr(0, start) + "\r\n<!--LoginPageResponsiveCSSStart-->" + themeCss + "<!--LoginPageResponsiveCSSEnd-->\r\n" + curCSS.substr(end + ("<!--LoginPageResponsiveCSSEnd-->").length, curCSS.length);
        customCssTA.val(buildThemeCSS).trigger("change").focus();
    } else {
        var buildThemeCSS = curCSS + "\r\n<!--LoginPageResponsiveCSSStart-->" + themeCss + "<!--LoginPageResponsiveCSSEnd-->";
        customCssTA.val(buildThemeCSS).trigger("change").focus();
    }
    panelWebInterface.changed("options");
}

panelWebInterface.showLogoInCenter = function() {
    var customCssTA = $("#login_custom_script", _panel);
    var curCSS = customCssTA.val();
    var themeCss = "\r\n#branding{text-align:center;}#branding a{display:inline-block;float:none;}";
    themeCss = "\r\n</script>\r\n<!-- ### Don't change this unless you are sure what you are doing ###  -->\r\n<!-- ### Make logo centrally aligned  ###  -->\r\n<style>" + themeCss + "</style>\r\n";
    if (curCSS.indexOf("<!--LogoCentrallyAlignedStart-->") >= 0) {
        var start = curCSS.indexOf("<!--LogoCentrallyAlignedStart-->");
        var end = curCSS.indexOf("<!--LogoCentrallyAlignedEnd-->");
        var buildThemeCSS = curCSS.substr(0, start) + "\r\n<!--LogoCentrallyAlignedStart-->" + themeCss + "<!--LogoCentrallyAlignedEnd-->\r\n" + curCSS.substr(end + ("<!--LogoCentrallyAlignedEnd-->").length, curCSS.length);
        customCssTA.val(buildThemeCSS).trigger("change").focus();
    } else {
        var buildThemeCSS = curCSS + "\r\n<!--LogoCentrallyAlignedStart-->" + themeCss + "<!--LogoCentrallyAlignedEnd-->";
        customCssTA.val(buildThemeCSS).trigger("change").focus();
    }
    panelWebInterface.changed("options");
}

panelWebInterface.showLogoToRight = function() {
    var customCssTA = $("#login_custom_script", _panel);
    var curCSS = customCssTA.val();
    var themeCss = "\r\n#branding{text-align:right;}#branding a{display:inline-block;float:none;}";
    themeCss = "\r\n</script>\r\n<!-- ### Don't change this unless you are sure what you are doing ###  -->\r\n<!-- ### Put logo to right  ###  -->\r\n<style>" + themeCss + "</style>\r\n";
    if (curCSS.indexOf("<!--LogoAlignedToRightStart-->") >= 0) {
        var start = curCSS.indexOf("<!--LogoAlignedToRightStart-->");
        var end = curCSS.indexOf("<!--LogoAlignedToRightEnd-->");
        var buildThemeCSS = curCSS.substr(0, start) + "\r\n<!--LogoAlignedToRightStart-->" + themeCss + "<!--LogoAlignedToRightEnd-->\r\n" + curCSS.substr(end + ("<!--LogoAlignedToRightEnd-->").length, curCSS.length);
        customCssTA.val(buildThemeCSS).trigger("change").focus();
    } else {
        var buildThemeCSS = curCSS + "\r\n<!--LogoAlignedToRightStart-->" + themeCss + "<!--LogoAlignedToRightEnd-->";
        customCssTA.val(buildThemeCSS).trigger("change").focus();
    }
    panelWebInterface.changed("options");
}

panelWebInterface.addPrivacyPolicyLink = function() {
    jPrompt("Please enter link to privacy policy:", "privacy.html", "Privacy Policy Link", function(value) {
        if(value){
            var customCssTA = $("#login_custom_script", _panel);
            var link = "\r\n$(document).ready(function(){\r\n$('#btnLogin').after(\"<a href='"+value+"' target='_blank' class='loginLink' id='PrivacyPolicyText'>Privacy Policy</a>\");\r\n}\r\n);\r\n"
            var curVal = customCssTA.val();
            if (curVal.indexOf("/*PrivacyPolicyLinkStart*/") >= 0) {
                var start = curVal.indexOf("/*PrivacyPolicyLinkStart*/");
                var end = curVal.indexOf("/*PrivacyPolicyLinkEnd*/");
                var buildLink = curVal.substr(0, start) + "\r\n\r\n/*PrivacyPolicyLinkStart*/" + link + "/*PrivacyPolicyLinkEnd*/\r\n" + curVal.substr(end + ("/*PrivacyPolicyLinkEnd*/").length, curVal.length);
                customCssTA.val(buildLink).trigger("change").focus();
            } else {
                var buildLink = curVal + "\r\n\r\n/*PrivacyPolicyLinkStart*/" + link + "/*PrivacyPolicyLinkEnd*/";
                customCssTA.val(buildLink).trigger("change").focus();
            }
            panelWebInterface.changed("options");
        }
    });
}

panelWebInterface.bindEvents = function () {
    $(".sense-change", _panel).each(function(){
        var rel = $(this).attr("rel");
        $(this).find("input, textarea").unbind("textchange.sense").bind("textchange.sense", function(){
            panelWebInterface.changed(rel);
        });
        $(this).find("input").unbind("change.sense").bind("change.sense", function(){
            panelWebInterface.changed(rel);
        });

        if(rel == "forms"){
            $(this).find("#formPreview").find("input,textarea").unbind("textchange.sense change.sense");
        }
    })
    $("#miniURLSortLinks").find("a").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        var elem = $(this);
        var parent = elem.closest("#miniURLSortLinks");
        var sortBy = elem.attr("rel") , sortType = elem.hasClass("asc") ? "desc" : "asc";
        parent.find(".asc,.desc").removeClass("asc desc");
        elem.addClass(sortType);
        panelWebInterface.bindMiniURLs(sortBy, sortType);
    })
    var themeSelector = $("#themeSelector", _panel);
    $("#addThemeCss", _panel).click(function() {
        themeSelector.dialog("open");
        return false;
    });
    themeSelector.find("a").click(function() {
        panelWebInterface.addThemeCSS($(this).attr("_rel"));
        themeSelector.dialog("close");
        return false;
    });
    $("#addResponsiveCss", _panel).click(function() {
        panelWebInterface.addResponsiveCss();
        return false;
    });
    $("#showLogoInCenter", _panel).click(function() {
        panelWebInterface.showLogoInCenter();
        return false;
    });
    $("#showLogoToRight", _panel).click(function() {
        panelWebInterface.showLogoToRight();
        return false;
    });
    $("#addPrivacyPolicyLink", _panel).click(function() {
        panelWebInterface.addPrivacyPolicyLink();
        return false;
    });

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

    /* CustomForms Tab events*/
    var formloginPageList = $("#loginPageList", _panel);
    // formloginPageList.selectable({
    //     selected: function(event, ui) {
    //         var selected = $(ui.selected);
    //         selected.parent().find(".ui-widget-header").removeClass("ui-widget-header ui-selected");
    //         selected.addClass("ui-widget-header ui-selected");
    //         return false;
    //     }
    // });

    var proxyRules = $("#proxyRules", _panel);
    proxyRules.selectable({
        selected: function(event, ui) {
            var selected = $(ui.selected);
            selected.parent().find(".ui-widget-header").removeClass("ui-widget-header ui-selected");
            selected.addClass("ui-widget-header ui-selected");
            return false;
        }
    });

     var itemControls = $("#custom_form_controls", _panel);
    // itemControls.selectable({
    //     selected: function(event, ui) {
    //         var selected = $(ui.selected);
    //         selected.parent().find(".ui-widget-header").removeClass("ui-widget-header ui-selected");
    //         selected.addClass("ui-widget-header ui-selected");
    //         return false;
    //     }
    // });

    var formCustomFormList = $("#CustomForms", _panel);
    formCustomFormList.change(function() {
        panelWebInterface.bindFormDetails();
    });

    $("a#moveControlUp, a#moveControlDown", _panel).click(function() {
        if (itemControls.find("li.ui-selected").length > 0) {
            panelWebInterface.moveFormControl(itemControls.find("li.ui-selected"), $(this).is("#moveControlUp"));
            itemsChanged(true);
            panelWebInterface.changed("forms");
        }
        return false;
    });

    $("a#deleteFormControl", _panel).click(function() {
        if (itemControls.find("li.ui-selected").length > 0) {
            jConfirm("Are you sure you wish to remove this item?", "Confirm", function(flag) {
                if (flag) {
                    var toFocus = [];
                    var selected = itemControls.find("li.ui-selected");
                    var name = selected.attr("rel");
                    if (name) {
                        var preview = $("table", "#formPreview");
                        if (preview.find("tr#" + name).length > 0) {
                            preview.find("tr#" + name).remove();
                        }
                    }
                    if (selected.next("li").length > 0) {
                        toFocus = selected.next("li");
                    } else if (selected.prev("li").length > 0) {
                        toFocus = selected.prev("li");
                    }
                    if (toFocus.length > 0)
                        toFocus.addClass("ui-widget-header").addClass("ui-selected");
                    var controlData = selected.data("controlData");
                    var formCustomFormList = $("#CustomForms", _panel);
                    var formId = formCustomFormList.val();
                    var controls = [];
                    var form = panelWebInterface.formControls[formId];
                    if (form && form.entries && form.entries.length > 0 && form.entries[0].entries_subitem) {
                        controls = panelWebInterface.formControls[formId].entries[0].entries_subitem;
                        var index = controls.indexOf(controlData);
                        controls.splice(index, 1);
                        panelWebInterface.formControls[formId].entries[0].entries_subitem = controls;
                        panelWebInterface.bindFormDetails(formId, controlData);
                    }
                    itemsChanged(true);
                    panelWebInterface.changed("forms");
                }
            }, {
                okButtonText: "Yes",
                cancelButtonText: "No"
            });
        }
        return false;
    });

    $("a#editFormControl", _panel).click(function() {
        if (itemControls.find("li.ui-selected").length > 0) {
            var selected = itemControls.find("li.ui-selected");
            var controlData = selected.data("controlData");
            if (controlData) {
                var itemType = crushFTP.data.getTextValueFromXMLNode(controlData.item_type, "");
                if (!itemType)
                    itemType = crushFTP.data.getTextValueFromXMLNode(controlData.type, "");
                if (itemType == "text") {
                    $("#addNewTextbox", _panel).trigger("click", [controlData]);
                } else if (itemType == "textarea") {
                    $("#addNewTextarea", _panel).trigger("click", [controlData]);
                } else if (itemType == "combo") {
                    $("#addNewDropdown", _panel).trigger("click", [controlData]);
                } else if (itemType == "checkbox") {
                    $("#addNewCheckbox", _panel).trigger("click", [controlData]);
                } else if (itemType == "tags") {
                    $("#addNewTagsInput", _panel).trigger("click", [controlData]);
                } else if (itemType == "radio") {
                    $("#addNewRadio", _panel).trigger("click", [controlData]);
                } else if (itemType == "label") {
                    $("#addNewLabel", _panel).trigger("click", [controlData]);
                }
            }
        }
        return false;
    });

    $("a#createNewForm, a#duplicateForm", _panel).click(function() {
        var formName = "";
        var duplicate = false;
        var formId = false;
        if ($(this).is("a#duplicateForm")) {
            duplicate = true;
            formId = $("select#CustomForms").val();
            formName = $("select#CustomForms").find("option:selected").text() + "_copy";
        }
        jPrompt("Please enter a name for this form:", formName, "Custom Form Name", function(value) {
            formName = crushFTP.methods.htmlEncode(value);
            if (formName) {
                if ($("select#CustomForms").find("option[value='" + formName + "']").length == 0) {
                    $("select#CustomForms").append("<option value='" + formName + "'>" + formName + "</option>");
                    $("select#CustomForms").find("option[value='" + formName + "']").attr("selected", "selected");
                    var entries = [{
                        entries_subitem: []
                    }];
                    if (duplicate && panelWebInterface.formControls && panelWebInterface.formControls[formId] && panelWebInterface.formControls[formId].entries) {
                        var controlData = $.extend(true, {}, panelWebInterface.formControls[formId]);
                        entries = controlData.entries;
                    }
                    panelWebInterface.formControls[formName] = {
                        entries: entries,
                        name: [{
                            text: formName
                        }],
                        id: [{
                            text: crushFTP.methods.generateRandomPassword(10)
                        }]
                    };
                    panelWebInterface.bindFormDetails(formName);
                    itemsChanged(true);
                    panelWebInterface.changed("forms");
                } else {
                    crushFTP.UI.growl("Form exist", "Please select different name as form exist with the name specified : " + crushFTP.methods.htmlEncode(formName), true, 3000);
                    $("a#createNewForm").trigger("click");
                }
            }
        });
        return false;
    });

    $("a#deleteForm", _panel).click(function() {
        if ($("select#CustomForms").val().length > 0) {
            jConfirm("Are you sure you wish to remove this item?", "Confirm", function(flag) {
                var toFocus = [];
                var selected = $("select#CustomForms").find("option:selected");
                if (selected.next("option").length > 0) {
                    toFocus = selected.next("option");
                } else if (selected.prev("option").length > 0) {
                    toFocus = selected.prev("option");
                }
                selected.remove();
                var controls = panelWebInterface.formControls;
                var newControls = {};
                for (var item in controls) {
                    if (item != selected.val()) {
                        newControls[item] = controls[item];
                    }
                }
                itemsChanged(true);
                panelWebInterface.changed("forms");
                panelWebInterface.formControls = newControls;
                panelWebInterface.bindFormDetails();
            }, {
                okButtonText: "Yes",
                cancelButtonText: "No"
            });
        }
        return false;
    });

    $("#addNewLabel", _panel).click(function(evt, control) {
        var addLabelDialogisOpen = $("#WICustomFormsLabel").attr("dialogInit") && $("#WICustomFormsLabel").dialog("isOpen");
        if (addLabelDialogisOpen != true) {
            var dialogId = '#WICustomFormsLabel',
                labelName = '',
                fieldName = '',
                labelValue = ''
            var clearDialog = function() {
                $('#lbLeftText', dialogId).val('');
                $('#lbName', dialogId).val('');
                $('#lbRightText', dialogId).val('');
                $('.ui-state-focus', dialogId).removeClass('ui-state-focus');
            }
            if (control) {
                labelName = crushFTP.data.getTextValueFromXMLNode(control.label, "");
                fieldName = crushFTP.data.getTextValueFromXMLNode(control.name, "");
                labelValue = crushFTP.data.getTextValueFromXMLNode(control.value, "");

                $('#lbLeftText', dialogId).val(labelName);
                $('#lbName', dialogId).val(fieldName);
                $('#lbRightText', dialogId).val(labelValue);
            }
            $("#WICustomFormsLabel").attr("dialogInit", "true").dialog({
                resizable: false,
                modal: true,
                width: 450,
                open: function() {
                    $('body').css('overflow','hidden');
                },
                close: function() {
                    $('body').css('overflow','auto');
                },
                create: function() {
                    $(this).css("maxHeight", 500);
                },
                buttons: {
                    OK: function() {
                        labelName = $('#lbLeftText', dialogId).val();
                        fieldName = $('#lbName', dialogId).val();
                        labelValue = $('#lbRightText', dialogId).val();
                        var validFieldName = crushFTP.methods.startsWithNumber(fieldName);
                        if (!validFieldName) {
                            if (control) {
                                panelWebInterface.updateFormControl(control, {
                                    item_type: [{
                                        text: "label"
                                    }],
                                    label: [{
                                        text: labelName
                                    }],
                                    name: [{
                                        text: fieldName
                                    }],
                                    value: [{
                                        text: labelValue
                                    }],
                                    options: {},
                                    required: [{
                                        text: false
                                    }],
                                    type: [{
                                        text: "label"
                                    }]
                                });
                            } else {
                                panelWebInterface.addControlToTheList("label", labelName, fieldName, labelValue, [], false, "", "label");
                            }
                            panelWebInterface.changed("forms");
                            $(this).dialog("close");
                            clearDialog();
                        } else {
                            alert('Field Name can not be empty or start with number');
                        }
                    },
                    Cancel: function() {
                        $(this).dialog("close");
                        clearDialog();
                    }
                }
            });
        }
    });
    $("#addNewTextbox", _panel).click(function(evt, control) {
        var addLabelDialogisOpen = $("#WICustomFormsTextField").attr("dialogInit") && $("#WICustomFormsTextField").dialog("isOpen");
        if (addLabelDialogisOpen != true) {
            var dialogId = '#WICustomFormsTextField',
                labelName = '',
                fieldName = '',
                fieldValue = '',
                required = '',
                size = '',
                maxchars = '',
                taskComboId = 'TFTask',
                type = '';

            var taskSelectBox = function(val) {
                var pluginPicker = $("<option value=\"\">-</option>");
                var crushTaskPlugins = common.data.getPluginPrefs("CrushTask");
                var pluginOpts = $('<optgroup label="Plugin"></optgroup>');
                for (var index = 0; index < crushTaskPlugins.length; index++) {
                    var curPlugin = crushTaskPlugins[index];
                    var tabName = curPlugin.subItem[0].text ? "CrushTask:" + curPlugin.subItem[0].text : "CrushTask";
                    pluginOpts.append("<option value=\"" + crushFTP.methods.textEncode(unescape(tabName)) + "\">" + crushFTP.methods.textEncode(unescape(tabName)) + "</option>");
                }
                pluginPicker.append(pluginOpts);
                var availableJobs = $(document).data("AvailableJobsNoEvents");
                if (availableJobs && availableJobs.length > 0) {
                    var jobOpts = $('<optgroup label="Job"></optgroup>');
                    for (var i = 0; i < availableJobs.length; i++) {
                        jobOpts.append("<option value=\"Job:" + crushFTP.methods.textEncode(unescape(availableJobs[i])) + "\">" + crushFTP.methods.textEncode(unescape(availableJobs[i])) + "</option>");
                    }
                    pluginPicker.append(jobOpts);
                }
                if ($('#' + taskComboId).length == 0) {
                    $('select#TFType', dialogId).closest('div').after('<div><label for="' + taskComboId + '">Task</label> <select id="' + taskComboId + '">' + pluginPicker.wrap('<div/>').parent().html() + '</select> <label for="' + taskComboId + '" class="metaInfo">Select Task:</label></div>');
                    $('#' + taskComboId).parent('div').form();
                }
                if (val) {
                    $('#' + taskComboId, dialogId).closest('div').show();
                    $('#' + taskComboId, dialogId).val(val);
                }
            }
            var clearDialog = function() {
                $('#TFLabel', dialogId).val('');
                $('#TFName', dialogId).val('');
                $('#TFValue', dialogId).val('');
                $('input[name="TFRequire"]', dialogId).filter('[value="false"]').attr('checked', 'checked');
                $('#TFSize', dialogId).val('');
                $('#TFMaxChars', dialogId).val('');
                $('.ui-state-focus', dialogId).removeClass('ui-state-focus');
            }
            $('#TFName', dialogId).change(function() {
                fieldName = $(this).val();
                if (fieldName.length > 4 && fieldName.lastIndexOf("_db") == fieldName.length - 3) {
                    $('#TFType', dialogId).closest('div').show();
                }
                $('#TFType', dialogId).change(function(event) {
                    if ($(this).val() == 'task') {
                        taskSelectBox();
                    }
                });
            });
            crushFTP.UI.checkUnchekInput($('input[name="TFRequire"]', dialogId).filter('[value="false"]'), true);
            if (control) {
                labelName = crushFTP.data.getTextValueFromXMLNode(control.label, "");
                fieldName = crushFTP.data.getTextValueFromXMLNode(control.name, "");
                fieldValue = crushFTP.data.getTextValueFromXMLNode(control.value, "");
                required = crushFTP.data.getTextValueFromXMLNode(control.required, "");
                size = crushFTP.data.getTextValueFromXMLNode(control.size, "");
                maxchars = crushFTP.data.getTextValueFromXMLNode(control.max_chars, "");
                type = crushFTP.data.getTextValueFromXMLNode(control.lookup_type, "");
                taskToRun = crushFTP.data.getTextValueFromXMLNode(control.entry_plugin, "");

                $('#TFLabel', dialogId).val(labelName);
                $('#TFName', dialogId).val(fieldName);
                $('#TFValue', dialogId).val(fieldValue);
                crushFTP.UI.checkUnchekInput($('input[name="TFRequire"]', dialogId).filter('[value="' + required + '"]'), true);
                $('#TFSize', dialogId).val(size);
                $('#TFMaxChars', dialogId).val(maxchars);
                $('#TFType', dialogId).val(type);
                $('#TFTask', dialogId).val(taskToRun);
            }
            $("#WICustomFormsTextField").attr("dialogInit", "true").dialog({
                resizable: false,
                modal: true,
                width: 450,
                create: function() {
                    $(this).css("maxHeight", 500);
                },
                open: function() {
                    $('body').css('overflow','hidden');
                },
                close: function() {
                    $('body').css('overflow','auto');
                },
                buttons: {
                    OK: function() {
                        labelName = $('#TFLabel', dialogId).val();
                        fieldName = $('#TFName', dialogId).val();
                        fieldValue = $('#TFValue', dialogId).val();
                        required = $('input[name="TFRequire"]:checked', dialogId).val();
                        size = $('#TFSize', dialogId).val();
                        type = $('#TFType', dialogId).val();
                        maxchars = $('#TFMaxChars', dialogId).val();
                        taskToRun = $('#TFTask', dialogId).val();
                        var validFieldName = crushFTP.methods.startsWithNumber(fieldName);
                        if (!validFieldName) {
                            if (control) {
                                panelWebInterface.updateFormControl(control, {
                                    item_type: [{
                                        text: "text"
                                    }],
                                    lookup_type: [{
                                        text: type
                                    }],
                                    entry_plugin: [{
                                        text: taskToRun
                                    }],
                                    label: [{
                                        text: labelName
                                    }],
                                    name: [{
                                        text: fieldName
                                    }],
                                    value: [{
                                        text: fieldValue
                                    }],
                                    options: {},
                                    required: [{
                                        text: required.toString()
                                    }],
                                    size: [{
                                        text: size
                                    }],
                                    max_chars: [{
                                        text: maxchars
                                    }],
                                    type: [{
                                        text: "text"
                                    }],
                                    cols: [],
                                    rows: []
                                });
                            } else {
                                panelWebInterface.addControlToTheList("text", labelName, fieldName, fieldValue, {
                                    lookup_type: type,
                                    entry_plugin: taskToRun
                                }, required, size, "text");
                            }
                            panelWebInterface.changed("forms");
                            clearDialog();
                            $(this).dialog("close");
                        } else {
                            alert('Field Name can not be empty or start with number');
                        }
                    },
                    Cancel: function() {
                        clearDialog();
                        $(this).dialog("close");
                    }
                }
            });
        }
    });

    $("#addNewTextarea", _panel).click(function(evt, control) {
        var addLabelDialogisOpen = $("#WICustomFormsTextarea").attr("dialogInit") && $("#WICustomFormsTextarea").dialog("isOpen");
        if (addLabelDialogisOpen != true) {
            var dialogId = '#WICustomFormsTextarea',
                labelName = '',
                fieldName = '',
                fieldValue = '',
                required = '',
                cols = '',
                rows = '';
            var clearDialog = function() {
                $('#BTFLabel', dialogId).val('');
                $('#BTFName', dialogId).val('');
                $('#BTFValue', dialogId).val('');
                $('input[name="BTFRequire"]', dialogId).filter('[value="false"]').attr('checked', 'checked');
                $('#BTFCol', dialogId).val('');
                $('#BTFRow', dialogId).val('');
                $('.ui-state-focus', dialogId).removeClass('ui-state-focus');
            }
            crushFTP.UI.checkUnchekInput($('input[name="BTFRequire"]', dialogId).filter('[value="false"]'), true);
            if (control) {
                labelName = crushFTP.data.getTextValueFromXMLNode(control.label, "");
                fieldName = crushFTP.data.getTextValueFromXMLNode(control.name, "");
                fieldValue = crushFTP.data.getTextValueFromXMLNode(control.value, "");
                required = crushFTP.data.getTextValueFromXMLNode(control.required, "");
                cols = crushFTP.data.getTextValueFromXMLNode(control.cols, "");
                rows = crushFTP.data.getTextValueFromXMLNode(control.rows, "");
                $('#BTFLabel', dialogId).val(labelName);
                $('#BTFName', dialogId).val(fieldName);
                $('#BTFValue', dialogId).val(fieldValue);
                crushFTP.UI.checkUnchekInput($('input[name="BTFRequire"]', dialogId).filter('[value="' + required + '"]'), true);
                $('#BTFCol', dialogId).val(cols);
                $('#BTFRow', dialogId).val(rows);
            }
            $("#WICustomFormsTextarea").dialog({
                resizable: false,
                modal: true,
                width: 450,
                create: function() {
                    $(this).css("maxHeight", 500);
                },
                open: function() {
                    $('body').css('overflow','hidden');
                },
                close: function() {
                    $('body').css('overflow','auto');
                },
                buttons: {
                    OK: function() {
                        labelName = $('#BTFLabel', dialogId).val();
                        fieldName = $('#BTFName', dialogId).val();
                        fieldValue = $('#BTFValue', dialogId).val();
                        required = $('input[name="BTFRequire"]:checked', dialogId).val();
                        cols = $('#BTFCol', dialogId).val();
                        rows = $('#BTFRow', dialogId).val();
                        var validFieldName = crushFTP.methods.startsWithNumber(fieldName);
                        if (!validFieldName) {
                            if (control) {
                                panelWebInterface.updateFormControl(control, {
                                    item_type: [{
                                        text: "textarea"
                                    }],
                                    label: [{
                                        text: labelName
                                    }],
                                    name: [{
                                        text: fieldName
                                    }],
                                    value: [{
                                        text: fieldValue
                                    }],
                                    options: {},
                                    required: [{
                                        text: required.toString()
                                    }],
                                    size: [],
                                    type: [{
                                        text: "textarea"
                                    }],
                                    cols: [{
                                        text: cols
                                    }],
                                    rows: [{
                                        text: rows
                                    }]
                                });
                            } else {
                                panelWebInterface.addControlToTheList("textarea", labelName, fieldName, fieldValue, "", required, "", "textarea", cols, rows);
                            }
                            panelWebInterface.changed("forms");
                            clearDialog()
                            $(this).dialog("close");
                        } else {
                            alert('Field Name can not be empty or start with number');
                        }
                    },
                    Cancel: function() {
                        clearDialog()
                        $(this).dialog("close");
                    }
                }
            });
        }
    });

    $("#addNewDropdown,#addNewCheckbox,#addNewRadio,#addNewTagsInput", _panel).click(function(evt, control) {
        var dialogId = '',
            taskComboId = '',
            itemType = '',
            labelName = '',
            fieldName = '',
            required = '',
            options = [],
            preFix = '',
            lookup_type = '',
            entry_plugin = '';
        if ($(this).attr('id') == 'addNewDropdown') {
            dialogId = '#WICustomFormsDropdown';
            taskComboId = 'DTask';
            itemType = "combo";
            preFix = 'D';
        } else if ($(this).attr('id') == 'addNewCheckbox') {
            dialogId = '#WICustomFormsCheckbox';
            taskComboId = 'CTask';
            itemType = "checkbox";
            preFix = 'C';
        } else if ($(this).attr('id') == 'addNewTagsInput') {
            dialogId = '#WICustomFormsTags';
            taskComboId = 'CTask';
            itemType = "tags";
            preFix = 'C';
        } else if ($(this).attr('id') == 'addNewRadio') {
            dialogId = '#WICustomFormsRadio';
            taskComboId = 'RTask';
            itemType = "radio";
            preFix = 'R';
        }
        var taskSelectBox = function(val) {
            var pluginPicker = $("<option value=\"\">-</option>");
            var crushTaskPlugins = common.data.getPluginPrefs("CrushTask");
            var pluginOpts = $('<optgroup label="Plugin"></optgroup>');
            for (var index = 0; index < crushTaskPlugins.length; index++) {
                var curPlugin = crushTaskPlugins[index];
                var tabName = curPlugin.subItem[0].text ? "CrushTask:" + curPlugin.subItem[0].text : "CrushTask";
                pluginOpts.append("<option value=\"" + crushFTP.methods.textEncode(unescape(tabName)) + "\">" + crushFTP.methods.textEncode(unescape(tabName)) + "</option>");
            }
            pluginPicker.append(pluginOpts);
            var availableJobs = $(document).data("AvailableJobsNoEvents");
            if (availableJobs && availableJobs.length > 0) {
                var jobOpts = $('<optgroup label="Job"></optgroup>');
                for (var i = 0; i < availableJobs.length; i++) {
                    jobOpts.append("<option value=\"Job:" + crushFTP.methods.textEncode(unescape(availableJobs[i])) + "\">" + crushFTP.methods.textEncode(unescape(availableJobs[i])) + "</option>");
                }
                pluginPicker.append(jobOpts);
            }
            if ($('#' + taskComboId).length == 0) {
                $('select#' + preFix + 'Type', dialogId).closest('div').after('<div><label for="' + taskComboId + '">Task</label> <select id="' + taskComboId + '">' + pluginPicker.wrap('<div/>').parent().html() + '</select> <label for="' + taskComboId + '" class="metaInfo">Select Task:</label></div>');
                $('#' + taskComboId).parent('div').form();
            }
            if (val) {
                $('#' + taskComboId, dialogId).closest('div').show();
                $('#' + taskComboId, dialogId).val(val);
            }
        }
        var clearDialog = function(PF, PId, TCID) {
            $('#' + PF + 'Type', PId).val('text').closest('div').hide();
            $('#' + TCID, PId).closest('div').hide();
            $('.addMultiItems', PId).not(':first').remove();
            $('#' + PF + 'Label', PId).val('');
            $('#' + PF + 'Name', PId).val('');
            $('.addMultiItems', PId).find('input').val('');
            $('.addMultiItems', PId).find('.removeItemProxy').trigger("click");
            $('.ui-state-focus', dialogId).removeClass('ui-state-focus');
        }
        crushFTP.UI.checkUnchekInput($('[name="' + preFix + 'Require"]', dialogId).filter('[value="false"]'), true);
        clearDialog(preFix, dialogId, taskComboId);
        var data = [];
        if (control) {
            itemType = crushFTP.data.getTextValueFromXMLNode(control.item_type, "")
            labelName = crushFTP.data.getTextValueFromXMLNode(control.label, "")
            fieldName = crushFTP.data.getTextValueFromXMLNode(control.name, "")
            required = crushFTP.data.getTextValueFromXMLNode(control.required, "")
            lookup_type = crushFTP.data.getTextValueFromXMLNode(control.lookup_type, "")
            entry_plugin = crushFTP.data.getTextValueFromXMLNode(control.entry_plugin, "")
            options = control.options[0].options_subitem;
            $('#' + preFix + 'Label', dialogId).val(labelName)
            $('#' + preFix + 'Name', dialogId).val(fieldName);
            if (lookup_type != '') {
                $('#' + preFix + 'Type', dialogId).val(lookup_type).closest('div').show();
            }
            if (entry_plugin != '') {
                taskSelectBox(entry_plugin);
            }
            crushFTP.UI.checkUnchekInput($('[name="' + preFix + 'Require"]', dialogId).filter('[value="' + required + '"]'), true);
            if (options.length > 0) {
                data = [];
                $.each(options, function(index, val) {
                    data.push({name : options[index].text})
                });
            }
        }
        $(".addMultiItems", dialogId).EnableMultiField({
            confirmOnRemove: false,
            data : data,
            linkText: "Add More",
            linkClass: "addItemProxy",
            removeLinkText: "Remove",
            removeLinkClass: "removeItemProxy",
            addEventCallback: function(newElem, clonnedFrom) {
                newElem.show().form();
                newElem.find(".removeItemProxy").before(newElem.find(".addItemProxy"));
                newElem.find("input:first").select().focus();
                itemsChanged(true);
                panelWebInterface.changed("forms");
            },
            removeEventCallback: function(prev, self, uid) {
                prev.find("input:first").select().focus();
                prev.find(".removeItemProxy").before(prev.find(".addItemProxy"));
                itemsChanged(true);
                panelWebInterface.changed("forms");
            }
        });
        if(data.length>0)
        {
            $(dialogId).find(".removeItemProxy:last").trigger('click');
        }
        $('#' + preFix + 'Name', dialogId).change(function() {
            fieldName = $(this).val();
            if (fieldName.length > 4 && fieldName.lastIndexOf("_db") == fieldName.length - 3) {
                $('#' + preFix + 'Type', dialogId).closest('div').show();
            } else {
                $('#' + preFix + 'Type', dialogId).closest('div').hide();
            }
        });
        var addLabelDialogisOpen = $(dialogId).attr("dialogInit") && $(dialogId).dialog("isOpen");
        if (addLabelDialogisOpen != true) {
            $(dialogId).attr("dialogInit", "true").dialog({
                resizable: false,
                modal: true,
                width: 550,
                maxHeight: 600,
                create: function() {
                    $(this).css("maxHeight", 500);
                },
                open: function() {
                    $('body').css('overflow','hidden');
                    $(dialogId).find("form").prepend('<div style="margin-bottom:15px;text-align:right;" class="form-item"><label for="CType" style="width: auto !important;display: inline-block;top: 0px;margin-right: 11px;">Change Control Type To :</label><select style="width: 200px !important;" class="ignoreBind excludeXML notFormElem" id="CType" name="CType"><option value="combo">Select option (Single selections)</option><option value="checkbox">Checkboxes (Multiple selections)</option><option value="radio">Radio Options (Single selection)</option><option value="tags">Tags Input (Multiple selection)</option></select></div>');
                    $(dialogId).find("#CType").change(function(){
                        itemType = $(this).val();
                        $(dialogId).closest(".ui-dialog").find(".ui-dialog-title").text("Add/Edit " + $(this).find(":selected").text())
                    }).val(itemType);
                },
                close: function() {
                    $('body').css('overflow','auto');
                    $(dialogId).find("#CType").closest("div.form-item").remove();
                },
                buttons: {
                    OK: function() {
                        options = [];
                        labelName = $('#' + preFix + 'Label', dialogId).val();
                        fieldName = $('#' + preFix + 'Name', dialogId).val();
                        required = $('input[name="' + preFix + 'Require"]:checked', dialogId).val();
                        if (fieldName.length > 4 && fieldName.lastIndexOf("_db") == fieldName.length - 3) {
                            lookup_type = $('#' + preFix + 'Type', dialogId).val();
                            entry_plugin = $('#' + preFix + 'Task', dialogId).val()
                        }
                        $.each($('.addMultiItems', dialogId), function(index, val) {
                            options.push({
                                text: crushFTP.methods.htmlEncode($(this).find('input').val())
                            });
                        });
                        var validFieldName = crushFTP.methods.startsWithNumber(fieldName);
                        if (!validFieldName) {
                            if (control) {
                                panelWebInterface.updateFormControl(control, {
                                    item_type: [{
                                        text: itemType
                                    }],
                                    lookup_type: [{
                                        text: lookup_type
                                    }],
                                    entry_plugin: [{
                                        text: entry_plugin
                                    }],
                                    label: [{
                                        text: labelName
                                    }],
                                    name: [{
                                        text: fieldName
                                    }],
                                    value: [],
                                    options: [{
                                        options_subitem: options
                                    }],
                                    required: [{
                                        text: required.toString()
                                    }],
                                    size: [],
                                    type: [{
                                        text: itemType
                                    }],
                                    cols: [],
                                    rows: []
                                });
                            } else {
                                panelWebInterface.addControlToTheList(itemType, labelName, fieldName, "", [{
                                    options_subitem: options
                                }], required, "", itemType, '', '', '', lookup_type, entry_plugin);
                            }
                            panelWebInterface.changed("forms");
                            clearDialog(preFix, dialogId, taskComboId);
                            $(this).dialog("close");
                        } else {
                            alert('Field Name can not be empty or start with number');
                        }
                    },
                    Cancel: function() {
                        clearDialog(preFix, dialogId, taskComboId);
                        $(this).dialog("close");
                    }
                }
            });

            $('select#' + preFix + 'Type', dialogId).change(function(event) {
                if ($('select', dialogId).val() == 'task') {
                    taskSelectBox();
                } else {
                    $('#' + taskComboId).closest('div').remove();
                }
            });
        }
    });

    /* MiniURLs tab events*/
    var miniURLs = $("#miniURLs", _panel);
    miniURLs.selectable({
        selected: function(event, ui) {
            var selected = $(ui.selected);
            selected.parent().find(".ui-widget-header").removeClass("ui-widget-header ui-selected");
            selected.addClass("ui-widget-header ui-selected");
            panelWebInterface.bindMiniURLDetails(selected);
            return false;
        }
    });

    var miniURLDetails = $("#miniURLDetails", _panel).hide();
    miniURLDetails.find("input").bind("textchange", function() {
        var item = miniURLs.find("li.ui-selected");
        if (!item || item.length == 0) return;
        var curId = $(this).attr("id");
        var curVal = $(this).val();
        if(curId === "miniURLHost" || curId === "redirect"){
            if($.trim(curVal)==="*"){
                $(this).closest("tr").find(".error-text").show();
                return false;
            }
            else{
                $(this).closest("tr").find(".error-text").hide();
            }
        }
        var data = item.data("controlData");
        if (data) {
            data[curId] = [{
                text: $(this).val()
            }];
        }
        var key = common.data.getTextContentFromPrefs(data, "key");
        var redirect = common.data.getTextContentFromPrefs(data, "redirect");
        var expires = common.data.getTextContentFromPrefs(data, "expire") || "-";
        var newField = "(<span style='display:inline-block;position:relative;' class='ui-icon ui-icon-person'></span>"+crushFTP.methods.htmlEncode(common.data.getTextContentFromPrefs(data, "user"))+") " + crushFTP.methods.htmlEncode(key) + " --> " + crushFTP.methods.htmlEncode(redirect) + "<span style='float:right;'> <span style='display:inline-block;position:relative;' class='ui-icon ui-icon-calendar'></span> "+crushFTP.methods.htmlEncode(expires)+" </span>";
        item.attr("key", key).html(newField);
        item.data("controlData", data);
    });

    $("a#addMiniURL", _panel).click(function() {
        var key = crushFTP.methods.generateRandomPassword(13, true);
        var redirect = "/path/file.ext";
        var newControl = $("<li class='ui-widget-content' key='" + key + "'>" + key + " --> " + redirect + "</li>");
        crushFTP.UI.addItem($("#miniURLs", _panel), $("<li class='ui-widget-content' key='" + key + "'>" + key + " --> " + redirect + "</li>"), {
            pass: [{
                text: ""
            }],
            key: [{
                text: key
            }],
            user: [{
                text: ""
            }],
            redirect: [{
                text: redirect
            }],
            expire: [{
                text: ""
            }]
        }, panelWebInterface.bindMiniURLDetails);
        itemsChanged(true);
        panelWebInterface.changed("miniurl");
        return false;
    });

    $("a#removeMiniURL", _panel).click(function() {
        crushFTP.UI.removeItem($("#miniURLs", _panel), panelWebInterface.bindMiniURLDetails);
        itemsChanged(true);
        panelWebInterface.changed("miniurl");
        return false;
    });

    $("a#copyMiniURL", _panel).click(function() {
        var key = crushFTP.methods.generateRandomPassword(13, true);
        var selected = $("#miniURLs", _panel).find(".ui-selected:first");
        if(selected.length==0){
            return false;
        }
        var data = selected.data("controlData");
        crushFTP.UI.addItem($("#miniURLs", _panel), $("<li class='ui-widget-content' key='" + key + "'>" + key + " --> " + data.redirect[0].text + "</li>"), {
            pass: [{
                text: data.pass ? data.pass[0].text : ""
            }],
            key: [{
                text: key
            }],
            user: [{
                text: data.user ? data.user[0].text : ""
            }],
            redirect: [{
                text: data.redirect ? data.redirect[0].text : ""
            }],
            expire: [{
                text: data.expire ? data.expire[0].text || "" : ""
            }]
        }, panelWebInterface.bindMiniURLDetails);
        itemsChanged(true);
        panelWebInterface.changed("miniurl");
        return false;
    });

    /* Options tab events */
    $("a#addNewLoginPage", _panel).click(function(evt, controlData, control) {
        var domainName = "", fileName = "", favicon = "";
        if (controlData) {
            domainName = crushFTP.data.getTextValueFromXMLNode(controlData.domain, "");
            fileName = crushFTP.data.getTextValueFromXMLNode(controlData.page, "");
            favicon = crushFTP.data.getTextValueFromXMLNode(controlData.favicon, "");
        }
        $("#WILoginPageDialog").dialog({
            resizable: false,
            modal: true,
            width: 450,
            create: function() {
                $(this).css("maxHeight", 500);
            },
            close: function() {
                $('body').css('overflow','auto');
            },
            open : function(){
                $('body').css('overflow','hidden');
                $("#WILoginPageDialog #loginPageDomain").val(domainName);
                $("#WILoginPageDialog #loginPageFileName").val(fileName);
                $("#WILoginPageDialog #loginPageFaviconName").val(favicon);
            },
            buttons: {
                OK: function() {
                    domainName = $.trim($("#WILoginPageDialog").find("#loginPageDomain").val());
                    fileName = $.trim($("#WILoginPageDialog").find("#loginPageFileName").val());
                    favicon = $.trim($("#WILoginPageDialog").find("#loginPageFaviconName").val());
                    if(!domainName)
                    {
                        alert("Please enter domain name")
                        $("#WILoginPageDialog").find("#loginPageDomain").focus();
                        return false;
                    }
                    if(!fileName)
                    {
                        alert("Please enter login file name")
                        $("#WILoginPageDialog").find("#loginPageFileName").focus();
                        return false;
                    }
                    var loginPage = crushFTP.methods.htmlEncode(domainName) + " -> " + crushFTP.methods.htmlEncode(fileName) + ":" + crushFTP.methods.htmlEncode(favicon);
                    var newControl = $("<li class='ui-widget-content'>" + loginPage + " <span class='drag ui-icon ui-icon-grip-dotted-vertical'></span><span class='delete-control'> x </span> </li>");
                    newControl.data("controlData", {
                        favicon: [{
                            text: favicon
                        }],
                        page: [{
                            text: fileName
                        }],
                        domain: [{
                            text: domainName
                        }]
                    });
                    if (control) {
                        control.replaceWith(newControl);
                    } else {
                        formloginPageList.append(newControl);
                    }
                    if (newControl) {
                        newControl.parent().find(".ui-widget-header").removeClass("ui-widget-header").removeClass("ui-selected");
                        newControl.addClass("ui-widget-header").addClass("ui-selected");
                    }
                    formloginPageList.find("li").unbind("dblclick").bind("dblclick", function(){
                        formloginPageList.find("li").removeClass('ui-selected');
                        $(this).addClass('ui-selected');
                        $("#editNewLoginPage", _panel).trigger('click');
                    });
                    formloginPageList.find("li").unbind("click").bind("click", function(){
                        formloginPageList.find("li").removeClass('ui-selected ui-widget-header');
                        $(this).addClass('ui-selected ui-widget-header');
                    });
                    formloginPageList.find(".delete-control").click(function(){
                        formloginPageList.find("li").removeClass('ui-selected ui-widget-header');
                        $(this).closest("li").addClass('ui-selected ui-widget-header');
                        $("#removeLoginPage").trigger("click");
                    });
                    itemsChanged(true);
                    panelWebInterface.changed("loginpages");
                    $(this).dialog("close");
                },
                Cancel: function() {
                    $(this).dialog("close");
                }
            }
        });
        return false;
    });

    $("a#editNewLoginPage", _panel).click(function(evt, control) {
        var formloginPageList = $("#loginPageList", _panel);
        var selected = formloginPageList.find("li.ui-selected");
        if (selected && selected.length > 0) {
            $("#addNewLoginPage", _panel).trigger("click", [selected.data("controlData"), selected]);
        }
        return false;
    });

    $("a#removeLoginPage", _panel).click(function(evt, control) {
        crushFTP.UI.removeItem($("#loginPageList", _panel));
        itemsChanged(true);
        panelWebInterface.changed("loginpages");
        return false;
    });

    $("a#moveLoginPageUp, a#moveLoginPageDown", _panel).click(function(evt, control) {
        var formloginPageList = $("#loginPageList", _panel);
        var selected = formloginPageList.find("li.ui-selected");
        if (selected && selected.length > 0) {
            if ($(this).is("#moveLoginPageUp") && selected.prev("li").length > 0) {
                selected.prev("li").before(selected);
            } else if ($(this).is("#moveLoginPageDown") && selected.next("li").length > 0) {
                selected.next("li").after(selected);
            }
            itemsChanged(true);
            panelWebInterface.changed("loginpages");
        }
        return false;
    });

    /* Proxy Tab Events */
    $("a#addNewProxyRule", _panel).click(function(evt, controlData, control) {
        var ruleName = "", hostName = "", protocol = "FTP", port = "21", ruleType = "Custom", condition = "=", criteria1 = "%user_name%", criteria2 = "";
        if (controlData) {
            ruleName = crushFTP.data.getTextValueFromXMLNode(controlData.proxyName, "");
            hostName = crushFTP.data.getTextValueFromXMLNode(controlData.host, "");
            protocol = crushFTP.data.getTextValueFromXMLNode(controlData.protocol, "");
            port = crushFTP.data.getTextValueFromXMLNode(controlData.port, "");
            condition = crushFTP.data.getTextValueFromXMLNode(controlData.condition, "");
            criteria1 = crushFTP.data.getTextValueFromXMLNode(controlData.criteria1, "");
            criteria2 = crushFTP.data.getTextValueFromXMLNode(controlData.criteria2, "");
            if (condition == "=" && criteria1 == "%user_name%" && criteria2 == "*") {
                ruleType = "Whitelist";
            } else if (condition == "=" && criteria1 == "1" && criteria2 == "2") {
                ruleType = "Blacklist";
            }
        }
        else
        {
            ruleType = "Whitelist";
        }
        $("#WIProxyDialog").find("#proxyRule").unbind("change").bind("change", function(){
            if($(this).val()=="Custom")
            {
                $("#WIProxyDialog .customProxyRuleOption").show();
            }
            else
            {
                $("#WIProxyDialog .customProxyRuleOption").hide();
                if($(this).val()=="Whitelist"){
                    condition = "=";
                    criteria1 = "%user_name%";
                    criteria2 = "*";
                } else if (rule == "Blacklist") {
                    condition = "=";
                    criteria1 = "1";
                    criteria2 = "2";
                }
                $("#WIProxyDialog #proxyRuleCriteria1").val(criteria1);
                $("#WIProxyDialog #proxyRuleCondition").val(condition);
                $("#WIProxyDialog #proxyRuleCriteria2").val(criteria2);
            }
        });
        $("#WIProxyDialog").dialog({
            resizable: false,
            modal: true,
            width: 450,
            create: function() {
                $(this).css("maxHeight", 500);
            },
            open : function(){
                $('body').css('overflow','hidden');
                $("#WIProxyDialog #proxyName").val(ruleName);
                $("#WIProxyDialog #proxyHostname").val(hostName);
                $("#WIProxyDialog #proxyProtocol").val(protocol);
                $("#WIProxyDialog #proxyPort").val(port);
                $("#WIProxyDialog #proxyRule").val(ruleType).trigger("change");
                $("#WIProxyDialog #proxyRuleCriteria1").val(criteria1);
                $("#WIProxyDialog #proxyRuleCondition").val(condition);
                $("#WIProxyDialog #proxyRuleCriteria2").val(criteria2);
            },
            close: function() {
                $('body').css('overflow','auto');
            },
            buttons: {
                OK: function() {
                    ruleName = $.trim($("#WIProxyDialog").find("#proxyName").val());
                    hostName = $.trim($("#WIProxyDialog").find("#proxyHostname").val());
                    protocol = $.trim($("#WIProxyDialog").find("#proxyProtocol").val());
                    port = $.trim($("#WIProxyDialog").find("#proxyPort").val());
                    ruleType = $.trim($("#WIProxyDialog").find("#proxyRule").val());
                    criteria1 = $.trim($("#WIProxyDialog").find("#proxyRuleCriteria1").val());
                    condition = $.trim($("#WIProxyDialog").find("#proxyRuleCondition").val());
                    criteria2 = $.trim($("#WIProxyDialog").find("#proxyRuleCriteria2").val());
                    if(!ruleName)
                    {
                        alert("Please enter proxy rule name")
                        $("#WIProxyDialog").find("#proxyName").focus();
                        return false;
                    }
                    if(!hostName)
                    {
                        alert("Please enter proxy host name")
                        $("#WIProxyDialog").find("#proxyHostname").focus();
                        return false;
                    }
                    if(!port)
                    {
                        alert("Please enter proxy port")
                        $("#WIProxyDialog").find("#proxyPort").focus();
                        return false;
                    }
                    function buildControl() {
                        var formProxyRulesList = $("#proxyRules", _panel);
                        var proxyRule = ruleName + "   " + protocol + "://" + hostName + ":" + port + "   ";
                        if (ruleType == "Custom") {
                            proxyRule = proxyRule + criteria1 + " " + condition + " " + criteria2;
                        } else {
                            proxyRule = proxyRule + ruleType;
                        }
                        var newControl = $("<li class='ui-widget-content'>" + proxyRule + " <span class='drag ui-icon ui-icon-grip-dotted-vertical'></span><span class='delete-control'> x </span> </li>");
                        newControl.data("controlData", {
                            port: [{
                                text: port
                            }],
                            host: [{
                                text: hostName
                            }],
                            protocol: [{
                                text: protocol
                            }],
                            proxyName: [{
                                text: ruleName
                            }],
                            condition: [{
                                text: condition
                            }],
                            criteria1: [{
                                text: criteria1
                            }],
                            criteria2: [{
                                text: criteria2
                            }]
                        });
                        if (control) {
                            control.replaceWith(newControl);
                        } else {
                            formProxyRulesList.append(newControl);
                        }
                        if (newControl) {
                            newControl.unbind("dblclick").bind("dblclick", function(){
                                newControl.removeClass('ui-selected');
                                newControl.addClass('ui-selected');
                                $("#editProxyRule", _panel).trigger('click');
                            });
                            newControl.unbind("click").bind("click", function(){
                                newControl.removeClass('ui-selected ui-widget-header');

                                 newControl.parent().find(".ui-widget-header").removeClass("ui-widget-header").removeClass("ui-selected");

                                newControl.addClass('ui-selected ui-widget-header');
                            });
                            newControl.find(".delete-control").click(function(){
                                newControl.find("li").removeClass('ui-selected ui-widget-header');
                                $("#removeProxyRule").trigger("click");
                            });

                            newControl.click();

                        }
                        itemsChanged(true);
                        panelWebInterface.changed("proxy");
                    }
                    buildControl();
                    $(this).dialog("close");
                },
                Cancel: function() {
                    $(this).dialog("close");
                }
            }
        });
        return false;
    });

    $("a#editProxyRule", _panel).click(function(evt, control) {
        var formProxyRulesList = $("#proxyRules", _panel);
        var selected = formProxyRulesList.find("li.ui-selected");
        if (selected && selected.length > 0) {
            $("#addNewProxyRule", _panel).trigger("click", [selected.data("controlData"), selected]);
        }
        return false;
    });

    $("a#removeProxyRule", _panel).click(function(evt, control) {
        crushFTP.UI.removeItem($("#proxyRules", _panel));
        itemsChanged(true);
        panelWebInterface.changed("proxy");
        return false;
    });

    $("a#moveProxyRuleUp, a#moveProxyRuleDown", _panel).click(function(evt, control) {
        var formProxyRulesList = $("#proxyRules", _panel);
        var selected = formProxyRulesList.find("li.ui-selected");
        if (selected && selected.length > 0) {
            if ($(this).is("#moveProxyRuleUp") && selected.prev("li").length > 0) {
                selected.prev("li").before(selected);
            } else if ($(this).is("#moveProxyRuleDown") && selected.next("li").length > 0) {
                selected.next("li").after(selected);
            }
            itemsChanged(true);
            panelWebInterface.changed("proxy");
        }
        return false;
    });

    $("a#resetCSP", _panel).click(function(evt, controlData, control) {
        jConfirm("Are you sure you wish to reset CSP to defaults?", "Confirm", function(flag) {
            if (flag) {
                panelWebInterface.addMissingCSP(true);
                panelWebInterface.bindCSP(false, true);
                $("#strictTransportSecurity", _panel).val("max-age=31536000; preload");
                crushFTP.UI.growl("Value reset to defatuls", "CSP values are set to defaults, please save your changes to apply", false, 5000);
            }
        }, {
            appendAfterInput: "<div>This will reset <strong>Strict-Transport-Security, CSP and Headers</strong></div>"
        });
        return false;
    });

    $("a#resetHeaders", _panel).click(function(evt, controlData, control) {
        panelWebInterface.bindCSP(false, true);
        return false;
    });

    $("a#addMissingCSP", _panel).click(function(evt, controlData, control) {
        panelWebInterface.addMissingCSP();
        return false;
    });

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

    $("a#copyToClipboardMiniURLKey", _panel).click(function() {
        var miniURLs = $("#miniURLs", _panel);
        var item = miniURLs.find("li.ui-selected");
        if (!item || item.length == 0) return false;
        var url = $("input#miniURLHost", _panel).val() + $("input#key", _panel).val();
        jPrompt("URL", url, "Copy", false, false, false, {
            hideCancelButton: true
        });
        return false;
    });

    $("a#quickSet", _panel).click(function() {
        var input = $("#expire", _panel);
        var selDate = input.datepicker("getDate");
        var myDate = new Date();
        var defaultDays = 1.5;
        if (selDate) {
            var t2 = selDate.getTime();
            var t1 = myDate.getTime();
            defaultDays = parseInt((t2 - t1) / (24 * 3600 * 1000)) + 1;
        }
        jPrompt("Enter the number of days from now until this account expires : ", defaultDays, "Input", function(value) {
            var days = parseInt(value);
            if (days != null && days != NaN) {
                if (days == NaN) days = 0;
                if (days > 0) {
                    myDate.setDate(myDate.getDate() + days);
                    input.datepicker("setDate", myDate);
                }
            }
        });
        $("#ui-datepicker-div").hide();
        return false;
    });

    var delay = (function() {
        var timer = 0;
        return function(callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    var proxyRules = $("#proxyRules", _panel);

    function filterProxyList(phrase) {
        proxyRules.find("li").hide();
        proxyRules.find("li:Contains('" + phrase + "')").each(function() {
            var that = $(this).show();
        });
    }

    var filterProxy = $("#filterProxy", _panel).unbind("keyup").keyup(function(evt) {
        var evt = (evt) ? evt : ((event) ? event : null);
        var phrase = this.value;
        if (window.last_searched_proxy && window.last_searched_proxy === phrase) {
            return false;
        }
        delay(function() {
            filterProxyList(phrase);
            window.last_searched_proxy = phrase;
        }, 500);
    });

    $("#domain_cookie").bind("textchange.once", function() {
        $("#domain_cookie").unbind("textchange.once");
        $("#domain_cookie_warning").show();
    });

    $("#clearProxyFilter", _panel).click(function() {
        filterProxy.val("").trigger("keyup");
        return false;
    });

    $("#sortProxyList", _panel).click(function(event) {
        var reverse = false;
        if ($(this).find(".ui-icon").hasClass('ui-icon-arrowthickstop-1-n')) {
            $(this).find('.ui-icon').removeClass('ui-icon-arrowthickstop-1-n').addClass('ui-icon-arrowthickstop-1-s');
            $(this).find('span.text').text("Sort Alphabetically (decending)");
            reverse = true;
        } else {
            $(this).find('.ui-icon').removeClass('ui-icon-arrowthickstop-1-s').addClass('ui-icon-arrowthickstop-1-n');
            $(this).find('span.text').text("Sort Alphabetically (ascending)");
        }

        var li = $("#proxyRules", _panel).find("li");
        // accending sort
        function asc_sort(a, b) {
            return ($(b).text().toUpperCase()) < ($(a).text().toUpperCase()) ? 1 : -1;
        }

        // decending sort
        function dec_sort(a, b) {
            return ($(b).text().toUpperCase()) > ($(a).text().toUpperCase()) ? 1 : -1;
        }
        if (reverse) {
            $("#proxyRules", _panel).find("li").sort(asc_sort).appendTo("#proxyRules", _panel);
        } else {
            $("#proxyRules", _panel).find("li").sort(dec_sort).appendTo("#proxyRules", _panel);
        }
        return false;
    });
}

panelWebInterface.updateFormControl = function(controlData, newData) {
    var formCustomFormList = $("#CustomForms", _panel);
    var formId = formCustomFormList.val();
    var controls = [];
    var form = panelWebInterface.formControls[formId];
    if (form && form.entries && form.entries.length > 0 && form.entries[0].entries_subitem) {
        controls = panelWebInterface.formControls[formId].entries[0].entries_subitem;
        var index = controls.indexOf(controlData);
        if (index >= 0) {
            controls[index] = newData;
            panelWebInterface.formControls[formId].entries[0].entries_subitem = controls;
            panelWebInterface.bindFormDetails(formId, controlData);
        }
    }
}

panelWebInterface.moveFormControl = function(control, up) {
    var controlData = control.data("controlData");
    var formCustomFormList = $("#CustomForms", _panel);
    var formId = formCustomFormList.val();
    var controls = [];
    var form = panelWebInterface.formControls[formId];
    if (form && form.entries && form.entries.length > 0 && form.entries[0].entries_subitem) {
        controls = panelWebInterface.formControls[formId].entries[0].entries_subitem;
        var index = controls.indexOf(controlData);
        if (index >= 0) {
            if (up) {
                if (index > 0) {
                    controls.swapItems(index, index - 1);
                }
            } else {
                if (index < controls.length) {
                    controls.swapItems(index, index + 1);
                }
            }
            panelWebInterface.formControls[formId].entries[0].entries_subitem = controls;
            panelWebInterface.bindFormDetails(formId, controlData);
        }
    }
}
panelWebInterface.moveFormControlUsingSortable = function(control, newIndex) {
    if(control.attr("_index") == newIndex + "")
        return;
    var controlData = control.data("controlData");
    var formCustomFormList = $("#CustomForms", _panel);
    var formId = formCustomFormList.val();
    var controls = [];
    var form = panelWebInterface.formControls[formId];
    if (form && form.entries && form.entries.length > 0 && form.entries[0].entries_subitem) {
        controls = panelWebInterface.formControls[formId].entries[0].entries_subitem;
        var index = controls.indexOf(controlData);
        if (index >= 0) {
            controls.move(parseInt(control.attr("_index")), newIndex);
            panelWebInterface.formControls[formId].entries[0].entries_subitem = controls;
            panelWebInterface.bindFormDetails(formId, controlData);
        }
    }
}

panelWebInterface.generatePreview = function(formItems) {
    var preview = $("table", "#formPreview").empty();
    for (var j = 0; j < formItems.length; j++) {
        var curFormItem = formItems[j];
        if (curFormItem) {
            var itemType = crushFTP.data.getTextValueFromXMLNode(curFormItem.item_type, crushFTP.data.getTextValueFromXMLNode(curFormItem.type, ""));
            var isRequired = "<span class='requiredField'>*</span>";
            var name = crushFTP.data.getTextValueFromXMLNode(curFormItem.name, "").replace(/\s+/g, '');
            if (crushFTP.data.getTextValueFromXMLNode(curFormItem.required, "") != "true") {
                isRequired = "";
            }
            var label = crushFTP.data.getTextValueFromXMLNode(curFormItem.label, "");
            var val = crushFTP.data.getTextValueFromXMLNode(curFormItem.value, "");
            var control = $("<tr id='" + crushFTP.methods.htmlEncode(name) + "'><td class='previewLabel'>" + crushFTP.methods.htmlEncode(label) + " " + isRequired + "</td><td class='previewContent'></td></tr>");
            preview.append(control);
            if (itemType == "label") {
                if (val)
                    control.find("td.previewContent").append(crushFTP.methods.htmlEncode(val));
                else {
                    control.find("td.previewContent").remove();
                    control.find("td.previewLabel").attr("colspan", "2");
                }
                var loadPage = false;
                var loadLeft = false;
                if (label.indexOf("{get:") >= 0) {
                    var _index = label.indexOf("{get:");
                    loadPage = label.substring(label.indexOf("{get:") + 5, label.length);
                    loadPage = loadPage.substring(0, loadPage.indexOf("}"));
                    loadLeft = true;
                } else if (val.indexOf("{get:") >= 0) {
                    var _index = val.indexOf("{get:");
                    loadPage = val.substring(val.indexOf("{get:") + 5, val.length);
                    loadPage = loadPage.substring(0, loadPage.indexOf("}"));
                }
                if (loadPage) {
                    var loadAt = control.find("td.previewContent");
                    if (loadLeft) {
                        loadAt = control.find("td.previewLabel");
                    }
                    loadAt.empty().append($("<div>"));
                    loadAt = loadAt.find("div");
                    if (loadPage.indexOf("#") > 0) {
                        var _index = loadPage.indexOf("#");
                        var style = loadPage.substring(loadPage.indexOf("#") + 1, loadPage.length);
                        loadAt.attr("style", style);
                    }
                    loadAt.load(loadPage, function(response, status, xhr) {
                        if (status == "error") {
                            loadAt.text("Not found : " + loadPage);
                        }
                    });
                }
            } else if (itemType == "text") {
                var size = parseInt(crushFTP.data.getTextValueFromXMLNode(curFormItem.size, 0)) + "";
                if (crushFTP.methods.isNumeric(size) && size > 0) {
                    size = "style='width:" + size + "px;'";
                } else {
                    size = "";
                }
                var max_chars = parseInt(crushFTP.data.getTextValueFromXMLNode(curFormItem.max_chars, 0));
                if (max_chars) {
                    max_chars = " maxlength='" + max_chars + "' ";
                } else {
                    max_chars = "";
                }
                control.find("td.previewContent").append("<input type='text' value='" + val + "' " + size + max_chars +" />");
            } else if (itemType == "textarea") {
                var cols = parseInt(crushFTP.data.getTextValueFromXMLNode(curFormItem.cols, 0));
                if (crushFTP.methods.isNumeric(cols) && cols > 0) {
                    cols = "cols=" + cols;
                } else {
                    cols = "";
                }

                var rows = parseInt(crushFTP.data.getTextValueFromXMLNode(curFormItem.rows, 0));
                if (crushFTP.methods.isNumeric(rows) && rows > 0) {
                    rows = "rows=" + rows;
                } else {
                    rows = "";
                }
                control.find("td.previewContent").append("<textarea " + cols + " " + rows + ">" + val + "</textarea>");
            } else if (itemType == "radio" || itemType == "checkbox" || itemType == "tags") {
                var msg = "";
                if(itemType == "tags"){
                    msg = "&nbsp;&nbsp;&nbsp;<label>(Will be shown as tags selection panel)</label>";
                    itemType = "checkbox";
                }
                var options = curFormItem.options;
                if (options && options.length > 0) {
                    options = options[0]["options_subitem"];
                    for (var i = 0; i < options.length; i++) {
                        var curItem = options[i];
                        if (curItem) {
                            var opt = curItem.text.split(":");
                            if (opt.length > 1) {
                                control.find("td.previewContent").append("&nbsp;<label><input name='" + name + "' value='" + opt[1] + "' type='" + itemType + "'>" + opt[0] + "</label>");
                            } else {
                                control.find("td.previewContent").append("&nbsp;<label><input name='" + name + "' type='" + itemType + "'>" + curItem.text + "</label>");
                            }
                        }
                    }
                    control.find("td.previewContent").append(msg);
                }
            } else if (itemType == "combo") {
                var options = curFormItem.options;
                if (options && options.length > 0) {
                    var name = crushFTP.data.getTextValueFromXMLNode(curFormItem.name, "");
                    options = options[0]["options_subitem"];
                    var selectList = "<select>";
                    var optgroupOpen = false;
                    for (var i = 0; i < options.length; i++) {
                        var curItem = (options[i]);
                        if (curItem) {
                            if (curItem.text.indexOf("---") == 0) {
                                if (optgroupOpen) {
                                    selectList += '</optgroup>';
                                }
                                selectList += '<optgroup label="' + curItem.text.replace("---", "") + '">';
                                optgroupOpen = true;
                            } else {
                                var opt = curItem.text.split(":");
                                if (opt.length > 1) {
                                    selectList += "<option value='" + opt[1] + "'>" + opt[0] + "</option>";
                                } else {
                                    selectList += "<option value='" + curItem.text + "'>" + curItem.text + "</option>";
                                }
                            }
                        }
                    }
                    if (optgroupOpen) {
                        selectList += '</optgroup>';
                    }
                    selectList += "</select>";
                    control.find("td.previewContent").append(selectList);
                }
            }
        }
    }
    preview.form();
}

panelWebInterface.addControlToTheList = function(itemType, label, name, value, options, required, size, type, cols, rows, formId, selected_lookup_type, selected_entry_plugin) {
    $("table", "#formPreview").empty();
    var formCustomFormList = $("#CustomForms", _panel);
    formId = formId || formCustomFormList.val();
    var controls = [];
    var form = panelWebInterface.formControls[formId];
    var entries = [{
        entries_subitem: []
    }];
    if (form && typeof form.entries == "undefined")
        form.entries = entries;
    var lookup_type = "";
    var entry_plugin = "";
    if (itemType == "text") {
        lookup_type = options.lookup_type || "";
        entry_plugin = options.entry_plugin || "";
        options = "";
    }
    if (itemType == "combo" || itemType == "checkbox" || itemType == "radio") {
        lookup_type = selected_lookup_type;
        entry_plugin = selected_entry_plugin;
    }
    if (form && form.entries && (form.entries.length == 0 || !form.entries[0].entries_subitem)) {
        form.entries = [
            {
                entries_subitem: []
            }
        ];
    }
    if (form && form.entries && form.entries.length > 0 && form.entries[0].entries_subitem) {
        controls = panelWebInterface.formControls[formId].entries[0].entries_subitem;
        var ctrlData = {
            item_type: [{
                text: itemType
            }],
            label: [{
                text: label
            }],
            lookup_type: [{
                text: lookup_type
            }],
            entry_plugin: [{
                text: entry_plugin
            }],
            name: [{
                text: name
            }],
            value: [{
                text: value
            }],
            options: options,
            required: [{
                text: required.toString()
            }],
            size: [{
                text: size
            }],
            type: [{
                text: type
            }],
            cols: [{
                text: cols
            }],
            rows: [{
                text: rows
            }]
        };
        if(typeof panelWebInterface.controlIndex != "undefined")
        {
            controls.splice(panelWebInterface.controlIndex, 0, ctrlData);
            delete panelWebInterface.controlIndex;
        }
        else
        {
            controls.push(ctrlData);
        }
        panelWebInterface.formControls[formId].entries[0].entries_subitem = controls;
        panelWebInterface.bindFormDetails(formId);
    }
}

panelWebInterface.getFormControls = function(formId) {
    var controls = [];
    var form = panelWebInterface.formControls[formId];
    if (form && form.entries && form.entries.length > 0 && form.entries[0].entries_subitem) {
        controls = panelWebInterface.formControls[formId].entries[0].entries_subitem;
    }
    return controls;
}

panelWebInterface.bindFormDetails = function(formId, controlSelected) {
    $("table", "#formPreview").empty();
    var formCustomFormList = $("#CustomForms", _panel);
    formId = formId || formCustomFormList.val();
    var customFormControlsList = $("#custom_form_controls", _panel).empty();
    panelWebInterface.generatePreview([]);
    if (formId) {
        var formItems = panelWebInterface.getFormControls(formId);
        if (formItems) {
            for (var j = 0; j < formItems.length; j++) {
                var curFormItem = formItems[j];
                if (curFormItem) {
                    var itemType = crushFTP.data.getTextValueFromXMLNode(curFormItem.item_type, "");
                    if (!itemType) {
                        itemType = crushFTP.data.getTextValueFromXMLNode(curFormItem.type, "");
                    }
                    var label = crushFTP.methods.xmlEncode(crushFTP.data.getTextValueFromXMLNode(curFormItem.label, ""));
                    if (label.length == 0 && curFormItem.value)
                        label = crushFTP.methods.xmlEncode(crushFTP.data.getTextValueFromXMLNode(curFormItem.value, ""));
                    var name = crushFTP.data.getTextValueFromXMLNode(curFormItem.name, "");
                    var control = itemType + ":" + label;
                    var newControl = $("<li _index='"+j+"' class='ui-widget-content' rel='" + name + "' control='" + control + "'>" + control + "<span class='drag ui-icon ui-icon-grip-dotted-vertical'></span><span class='delete-control'> x </span> </li>");
                    customFormControlsList.append(newControl);
                    newControl.data("controlData", curFormItem);
                    if (controlSelected === curFormItem) {
                        newControl.addClass("ui-widget-header").addClass("ui-selected");
                    }
                }
            }
            customFormControlsList.find(".delete-control").click(function(){
                customFormControlsList.find("li").removeClass('ui-selected ui-widget-header');
                $(this).closest("li").addClass('ui-selected ui-widget-header');
                $("#deleteFormControl").trigger("click");
            });
            customFormControlsList.sortable({
                update : function(evt, ui){
                    panelWebInterface.moveFormControlUsingSortable($(ui.item),$(ui.item).index());
                    itemsChanged(true);
                    panelWebInterface.changed("forms");
                },
                receive: function(event, ui) {
                    var triggergerId = $(this).find('.ui-draggable').find('span:first').attr('id');
                    var controlIndex = customFormControlsList.find(".addControlTrigger").index();
                    panelWebInterface.controlIndex = controlIndex;
                    customFormControlsList.find(".addControlTrigger").remove();
                    $("#"+triggergerId).trigger('click');
                },
                over : function(event, ui){
                    $(this).addClass('ui-state-hover').css("cursor", "move");
                },
                out : function(event, ui){
                    $(this).removeClass('ui-state-hover').css("cursor", "inherit");
                }
            });
            customFormControlsList.find("li").bind("dblclick", function(){
                customFormControlsList.find("li").removeClass('ui-selected');
                $(this).addClass('ui-selected');
                $("#editFormControl", _panel).trigger('click');
            });
            customFormControlsList.find("li").bind("click", function(){
                customFormControlsList.find("li").removeClass('ui-selected ui-widget-header');
                $(this).addClass('ui-selected ui-widget-header');
            });
            var flag=true;
            $("#sortableWebInterfaceForm li").draggable({
                connectToSortable: "#custom_form_controls",
                revert: "invalid",
                helper: "clone",
                cursorAt: {
                    top : -10
                },
                start : function(evt, ui)
                {
                    $(ui.helper).addClass('addControlTriggerDragging');
                    if(flag){
                        flag = false;
                        $('body').one("mouseleave", function(){
                            $('body').mouseup();
                            flag = true; //event occured, rebind
                        });
                    }
                    else{
                        flag = false;
                    }
                }
            });
            panelWebInterface.generatePreview(formItems);
        }
    }
}

panelWebInterface.bindMiniURLDetails = function(item) {
    var detailsForm = _panel.find("#miniURLDetails").hide();
    var miniURLs = $("#miniURLs", _panel);
    item = item || miniURLs.find("li.ui-selected");
    if (!item || item.length == 0) {
        _panel.find("#miniURLDetails").find("#key,#redirect,#expire,#user,#pass").val("");
        return false;
    }
    var data = item.data("controlData");
    detailsForm.show();
    detailsForm.find(".error-text").hide();
    if (data) {
        var inputs = detailsForm.find("input.ignoreBind").removeClass("ignoreBind");
        detailsForm.find("#miniURLHost").addClass("ignoreBind");
        bindValuesFromXML(detailsForm, data);
        detailsForm.find("#miniURLHost").removeClass("ignoreBind");
        inputs.removeClass("ignoreBind");
    }
}

panelWebInterface.bindCSPFromDomains = function(){
    var cspPanel = $("#WICSP");
    var domainsForm = $(".domains-form", cspPanel);
    var domains = [];
    var _defaults = [];
    var forms = [];
    var fonts = [];
    var styles = [];
    var scripts = [];
    var frames = [];
    var frameAncestors = [];
    var connects = [];
    var bases = [];
    var objects = [];
    var images = [];
    domainsForm.find(".csp-domain").each(function(){
        var name = $.trim($(this).find("[recname='name']").val());
        var _def = $(this).find("[recname='_default']").is(":checked");
        var form = $(this).find("[recname='form']").is(":checked");
        var script = $(this).find("[recname='script']").is(":checked");
        var font = $(this).find("[recname='font']").is(":checked");
        var style = $(this).find("[recname='style']").is(":checked");
        var frame = $(this).find("[recname='frame']").is(":checked");
        var connect = $(this).find("[recname='connect']").is(":checked");
        var frameAncestor = $(this).find("[recname='frameAncestor']").is(":checked");
        var baseURI = $(this).find("[recname='baseURI']").is(":checked");
        var object = $(this).find("[recname='object']").is(":checked");
        var image = $(this).find("[recname='image']").is(":checked");
        domains.push({
            name: name,
            _default: _def,
            form: form,
            script: script,
            font: font,
            style: style,
            frame: frame,
            connect: connect,
            frameAncestor: frameAncestor,
            baseURI: baseURI,
            object: object,
            image: image
        });
        if(_def && _defaults.indexOf(name)<0)
            _defaults.push(name);
        if(form && forms.indexOf(name)<0)
            forms.push(name);
        if(script && scripts.indexOf(name)<0)
            scripts.push(name);
        if(font && fonts.indexOf(name)<0)
            fonts.push(name);
        if(style && styles.indexOf(name)<0)
            styles.push(name);
        if(frame && frames.indexOf(name)<0)
            frames.push(name);
        if(connect && connects.indexOf(name)<0)
            connects.push(name);
        if(frameAncestor && frameAncestors.indexOf(name)<0)
            frameAncestors.push(name);
        if(baseURI && bases.indexOf(name)<0)
            bases.push(name);
        if(object && objects.indexOf(name)<0)
            objects.push(name);
        if(image && images.indexOf(name)<0)
            images.push(name);
    });
    var cspPolicy = $.trim($("#contentSecurityPolicy", cspPanel).val()).toLowerCase();
    var newPolicies = [];
    var gotStyles, gotScripts, gotFonts, gotFrames, gotConnects, gotAncestors, gotDefaults, gotForms, gotBase, gotObject, gotImage;
    var policies = cspPolicy.toLowerCase().startsWith("content-security-policy") ? cspPolicy.split("content-security-policy:")[1].split(";") : cspPolicy.split(";");
    for (var j = 0; j < policies.length; j++) {
        var curPolicy = policies[j];
        var values = curPolicy.split(" ");
        values.removeByVal("");
        var policyType = $.trim(values.shift() || "").toLowerCase();
        if(policyType == "default-src" || policyType == "form-action" || policyType == "base-uri" ||policyType == "script-src" || policyType == "style-src" || policyType == "font-src" || policyType == "frame-src" || policyType == "connect-src" || policyType == "frame-ancestors" || policyType == "object-src" || policyType == "img-src"){
            var newValues = [];
            values.forEach(function(val){
                val = (val || "").toLowerCase();
                if(val.indexOf("'")>=0 || val == 'data:'){
                    newValues.push(val);
                }
            });
            if(policyType == "script-src"){
                newValues = newValues.concat(scripts);
                gotScripts = true;
            }
            else if(policyType == "default-src"){
                newValues = newValues.concat(_defaults);
                gotDefaults = true;
            }
            else if(policyType == "form-action"){
                newValues = newValues.concat(forms);
                gotForms = true;
            }
            else if(policyType == "base-uri"){
                newValues = newValues.concat(bases);
                gotBase = true;
            }
            else if(policyType == "style-src"){
                newValues = newValues.concat(styles);
                gotStyles = true;
            }
            else if(policyType == "font-src"){
                newValues = newValues.concat(fonts);
                gotFonts = true;
            }
            else if(policyType == "frame-src"){
                newValues = newValues.concat(frames);
                gotFrames = true;
            }
            else if(policyType == "connect-src"){
                newValues = newValues.concat(connects);
                gotConnects = true;
            }
            else if(policyType == "frame-ancestors"){
                newValues = newValues.concat(frameAncestors);
                gotAncestors = true;
            }
            else if(policyType == "object-src"){
                newValues = newValues.concat(objects);
                gotObject = true;
            }
            else if(policyType == "img-src"){
                newValues = newValues.concat(images);
                gotImage = true;
            }
            newPolicies.push(policyType + " " + newValues.join(" "));
        }
        else{
            if(curPolicy)
                newPolicies.push(curPolicy);
        }
    };
    if(_defaults.length>0 && !gotDefaults){
        newPolicies.push("default-src 'self' " + _defaults.join(" "));
    }
    if(forms.length>0 && !gotForms){
        newPolicies.push("form-action 'self' " + forms.join(" "));
    }
    if(bases.length>0 && !gotBase){
        newPolicies.push("base-uri 'self' " + bases.join(" "));
    }
    if(scripts.length>0 && !gotScripts){
        newPolicies.push("script-src 'unsafe-inline' 'unsafe-eval' 'self' " + scripts.join(" "));
    }
    if(fonts.length>0 && !gotFonts){
        newPolicies.push("font-src data 'self'" + fonts.join(" "));
    }
    if(styles.length>0 && !gotStyles){
        newPolicies.push("style-src 'unsafe-inline' 'self' " + styles.join(" "));
    }
    if(frames.length>0 && !gotFrames){
        newPolicies.push("frame-src 'self' " + frames.join(" "));
    }
    if(connects.length>0 && !gotConnects){
        newPolicies.push("connect-src 'self' " + connects.join(" "));
    }
    if(images.length>0 && !gotImage){
        newPolicies.push("img-src 'self' " + images.join(" "));
    }
    if(objects.length>0 && !gotObject){
        newPolicies.push("object-src 'self' " + objects.join(" "));
    }
    if(frameAncestors.length>0 && !gotAncestors){
        newPolicies.push("frame-ancestors 'self' " + frameAncestors .join(" "));
    }
    newPolicies.push("");
    $("#contentSecurityPolicy", cspPanel).val(newPolicies.join(";"));
}

panelWebInterface.addMissingCSP = function(reset){
    var cspPanel = $("#WICSP");
    var defaultCSP = {
        "default-src": ["'self'"],
        "base-uri": ["'self'"],
        "form-action": ["'self'"],
        "frame-ancestors": ["'self'"],
        "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        "style-src": ["'unsafe-inline'", "'self'"],
        "img-src": ["'self'", 'data:'],
        "font-src": ['data:', "'self'", "'unsafe-inline'"],
        "frame-src": ["'self'"],
        "object-src": ["'self'"],
        "connect-src": ["'self'"]
    }
    var prefs = common.data.ServerPrefs();
    var serverList = common.data.getSubValueFromPrefs("server_list");
    var hasRecaptcha, hasGoogleAuth, hasMSAuth;
    for (var i = 0; i < serverList.length; i++) {
        var curServer = serverList[i];
        if(curServer){
            var serverType = common.data.getTextContentFromPrefs(curServer, "serverType").toLowerCase();
            var recaptchaEnabled = common.data.getTextContentFromPrefs(curServer, "recaptcha_enabled").toLowerCase();
            var gsign_enabled = common.data.getTextContentFromPrefs(curServer, "gsign_enabled").toLowerCase();
            var mssign_enabled = common.data.getTextContentFromPrefs(curServer, "mssign_enabled").toLowerCase();
            if((serverType == 'http' || serverType == 'https'))
            {
                if(recaptchaEnabled == 'true')
                    hasRecaptcha = true;
                if(gsign_enabled == 'true')
                    hasGoogleAuth = true;
                if(mssign_enabled == 'true')
                    hasMSAuth = true;
            }
        }
    }
    if(hasRecaptcha){
        defaultCSP["script-src"].push("www.recaptcha.net");
        defaultCSP["script-src"].push("www.gstatic.com");

        defaultCSP["frame-src"].push("www.recaptcha.net");
        defaultCSP["frame-src"].push("www.gstatic.com");
    }
    if(hasGoogleAuth){
        defaultCSP["script-src"].push("accounts.google.com");
        defaultCSP["style-src"].push("accounts.google.com");
        defaultCSP["frame-src"].push("accounts.google.com");
        defaultCSP["connect-src"].push("accounts.google.com");
    }
    if(hasMSAuth){
        defaultCSP["script-src"].push("cdn.jsdelivr.net");
        defaultCSP["script-src"].push("alcdn.msauth.net");
        defaultCSP["connect-src"].push("login.microsoftonline.com");
    }
    var cspPolicy = reset ? "" : $.trim($("#contentSecurityPolicy", cspPanel).val()).toLowerCase();
    var newPolicies = [];
    var policies = cspPolicy.toLowerCase().startsWith("content-security-policy") ? cspPolicy.split("content-security-policy:")[1].split(";") : cspPolicy.split(";");
    var availableTypes = [];
    for (var j = 0; j < policies.length; j++) {
        var curPolicy = policies[j];
        var values = curPolicy.split(" ");
        values.removeByVal("");
        var policyType = $.trim(values.shift() || "").toLowerCase();
        if(policyType && availableTypes.indexOf(policyType)<0){
            availableTypes.push(policyType);
            values = values.concat(defaultCSP[policyType] || []);
            values = values.filter((item,index)=>{
               return (values.indexOf(item) == index)
            });
            newPolicies.push(policyType + " " + values.join(" "));
        }
    }
    for(var dcsp in defaultCSP){
        if(availableTypes.indexOf(dcsp)<0){
            newPolicies.push(dcsp + " " + (defaultCSP[dcsp].join(" ")).replace(/'data:'/g, "data:"));
        }
    }
    newPolicies.removeByVal("");
    newPolicies.push("");
    $("#contentSecurityPolicy", cspPanel).val(newPolicies.join(";")).trigger("change");
    itemsChanged(true);
    panelWebInterface.changed("csp");
}

panelWebInterface.bindCSPDomains = function(cspPolicy, txtChange, fromInput){
    var cspPanel = $("#WICSP");
    var domainsHash = {};
    var domains = [];
    if(!txtChange)
        $("#contentSecurityPolicy", cspPanel).val($.trim(cspPolicy.split("content-security-policy:")[1]).toLowerCase());
    var policies = cspPolicy.toLowerCase().startsWith("content-security-policy") ? cspPolicy.split("content-security-policy:")[1].split(";") : cspPolicy.split(";");
    for (var j = 0; j < policies.length; j++) {
        var curPolicy = policies[j];
        var values = curPolicy.split(" ");
        values.removeByVal("");
        var policyType = (values.shift() || "").toLowerCase();
        values.forEach(function(val){
            val = (val || "").toLowerCase();
            if(val.indexOf("'")<0 && val != 'data:'){
                domainsHash[val] = domainsHash[val] || {};
                if(policyType == "script-src"){
                    domainsHash[val].script = true;
                }
                else if(policyType == "default-src"){
                    domainsHash[val]._default = true;
                }
                else if(policyType == "form-action"){
                    domainsHash[val].form = true;
                }
                else if(policyType == "style-src"){
                    domainsHash[val].style = true;
                }
                else if(policyType == "font-src"){
                    domainsHash[val].font = true;
                }
                else if(policyType == "frame-src"){
                    domainsHash[val].frame = true;
                }
                else if(policyType == "connect-src"){
                    domainsHash[val].connect = true;
                }
                else if(policyType == "frame-ancestors"){
                    domainsHash[val].frameAncestor = true;
                }
                else if(policyType == "base-uri"){
                    domainsHash[val].baseURI = true;
                }
                else if(policyType == "object-src"){
                    domainsHash[val].object = true;
                }
                else if(policyType == "img-src"){
                    domainsHash[val].image = true;
                }
            }
        });
    };
    for(var domain in domainsHash){
        if(domain){
            domains.push({
                name: domain,
                _default: domainsHash[domain]._default,
                form: domainsHash[domain].form,
                script: domainsHash[domain].script,
                style: domainsHash[domain].style,
                font: domainsHash[domain].font,
                baseURI: domainsHash[domain].baseURI,
                image: domainsHash[domain].image,
                object: domainsHash[domain].object,
                frame: domainsHash[domain].frame,
                connect: domainsHash[domain].connect,
                frameAncestor: domainsHash[domain].frameAncestor
            });
        }
    }
    $(".domains-form", cspPanel).empty();
    var cspDomainTemplate = '<div class="csp-domain" style="width: 1000px;padding: 10px 5px;"><input type="text" class="csp-domain-name bigInputBox excludeXML" recname="name" /><span class="checkbox-group"><span class="checkbox"><input type="checkbox" class="ignoreBind excludeXML notFormElem" recname="_default" /><label>Default</label><span title="<strong>default-src:</strong> directive serves as a fallback for the other CSP" class="ui-icon ui-icon-info vtip"></span></span><span class="checkbox"><input type="checkbox" class="ignoreBind excludeXML notFormElem" recname="baseURI" /><label>Base URI</label><span title="<strong>base-uri:</strong> directive restricts the URLs which can be used in a document\'s &amp;lt;base&amp;gt; element. If this value is absent, then any URI is allowed. If this directive is absent, the user agent will use the value in the &amp;lt;base&amp;gt; element." class="ui-icon ui-icon-info vtip"></span></span><span class="checkbox"><input type="checkbox" class="ignoreBind excludeXML notFormElem" recname="form" /><label>Form action</label><span title="<strong>form-action:</strong> directive restricts the URLs which can be used as the target of form submissions from a given context." class="ui-icon ui-icon-info vtip"></span></span><span class="checkbox"><input type="checkbox" class="ignoreBind excludeXML notFormElem" recname="frame" /><label>Frame</label><span title="<strong>frame-src:</strong> it specifies valid sources for nested browsing contexts loading using elements such as &amp;lt;frame&amp;gt; and &amp;lt;iframe&amp;gt;" class="ui-icon ui-icon-info vtip"></span></span><span class="checkbox"><input type="checkbox" class="ignoreBind excludeXML notFormElem" recname="frameAncestor" /><label>Frame Ancestor</label><span title="<strong>frame-src:</strong> it specifies valid parents that may embed a page using &amp;lt;frame&amp;gt;, &amp;lt;iframe&amp;gt;, &amp;lt;object&amp;gt;, &amp;lt;embed&amp;gt;, or &amp;lt;applet&amp;gt;." class="ui-icon ui-icon-info vtip"></span></span><span class="checkbox"><input type="checkbox" class="ignoreBind excludeXML notFormElem" recname="connect" /><label>Connect</label><span title="<strong>connect-src:</strong> it restricts the URLs which can be loaded using script interfaces. The APIs that are restricted are:<br>ping,<br>fetch(),<br>XMLHttpRequest,<br>WebSocket,<br>EventSource,<br>and<br>Navigator.sendBeacon()" class="ui-icon ui-icon-info vtip"></span></span><span class="checkbox"><input type="checkbox" class="ignoreBind excludeXML notFormElem" recname="script" /><label>Script</label><span title="<strong>script-src:</strong> it specifies valid sources for JavaScript. This includes not only URLs loaded directly into &amp;lt;script&amp;gt; elements, but also things like inline script event handlers (onclick) and XSLT stylesheets which can trigger script execution." class="ui-icon ui-icon-info vtip"></span></span><span class="checkbox"><input type="checkbox" class="ignoreBind excludeXML notFormElem" recname="image" /><label>Image</label><span title="<strong>img-src:</strong> directive specifies valid sources of images and favicons." class="ui-icon ui-icon-info vtip"></span></span><span class="checkbox"><input type="checkbox" class="ignoreBind excludeXML notFormElem" recname="object" /><label>Object</label><span title="<strong>object-src:</strong> directive specifies valid sources for the &amp;lt;object&amp;gt;, &amp;lt;embed&amp;gt;, and &amp;lt;applet&amp;gt; elements." class="ui-icon ui-icon-info vtip"></span></span><span class="checkbox"><input type="checkbox" class="ignoreBind excludeXML notFormElem" recname="style" /><label>Style</label><span title="<strong>style-src:</strong> it specifies valid sources for stylesheets." class="ui-icon ui-icon-info vtip"></span></span><span class="checkbox"><input type="checkbox" class="ignoreBind excludeXML notFormElem" recname="font" /><label>Fonts</label><span title="<strong>font-src:</strong> it specifies valid sources for fonts loaded using @font-face." class="ui-icon ui-icon-info vtip"></span></span></span><span class="warn-url"><span style="" class="ui-icon ui-icon-alert"></span> You must select option to allow this domain for </span><a href="#" class="removeItemFileParser2" style="top:13px;margin-right:42px;"></a></div>';
    var cspDomainEmptyTemplate = '<div><a style="margin:20px 10px;" id="addNewDomain" href="#" class="button ui-button ui-corner-all ui-widget" role="button"><span style="display:inline-block;margin:0px 3px 0px -7px;float:left;" class="pointer ui-icon ui-icon-plus"></span>Add New Domain</a></div>';
    cspPanel.find('.domains-form').append(cspDomainTemplate);
    cspPanel.find('.domains-form').find(".removeItemFileParser2").click(function(){
        $(this).closest(".csp-domain").remove();
        if($(".csp-domain", cspPanel).length==0){
            cspPanel.find('.domains-form').append(cspDomainEmptyTemplate);
             cspPanel.find('.domains-form').find("#addNewDomain").click(function(){
                panelWebInterface.bindCSPDomains($("#contentSecurityPolicy", cspPanel).val(), true);
                return false;
            });
        }
        panelWebInterface.changed("csp");
        panelWebInterface.bindCSPFromDomains();
        if($(".csp-domain", cspPanel).length==1){
            $(".csp-domain", cspPanel).find(".addItemFileParser").css("margin-left", "20px");
        }
        return false;
    });
    var csp = $(".csp-domain", cspPanel).EnableMultiField({
        confirmOnRemove: false,
        linkText : "",
        data: domains,
        linkClass : "addItemFileParser",
        removeLinkText : "",
        maxItemsAllowedToAdd : 20,
        removeLinkClass : "removeItemFileParser",
        addEventCallback : function(newElem, clonnedFrom){
            newElem.find(".removeItemFileParser2").remove();
            newElem.show().form().find("input").focus();
            newElem.find("input").bind("change.csp", function(){
                var prnt = $(this).closest(".csp-domain");
                prnt.find(".warn-url").hide();
                if(prnt.find(":checked").length>0){
                    prnt.find(".warn-url").hide();
                }
                else if(prnt.find("input[recname='name']").val()!==""){
                    prnt.find(".warn-url").show();
                }
                itemsChanged(true);
                panelWebInterface.changed("csp");
                panelWebInterface.bindCSPFromDomains();
            });
            newElem.find(".warn-url").hide();
            if(newElem.find(":checked").length>0){
                newElem.find(".warn-url").hide();
            }
            else if(newElem.find("input[recname='name']").val()!==""){
                newElem.find(".warn-url").show();
            }
            vtip(newElem);
        },
        removeEventCallback : function(prev, self, uid){
            itemsChanged(true);
            if($(".csp-domain", cspPanel).length==0){
                cspPanel.find('.domains-form').append(cspDomainEmptyTemplate);
                cspPanel.find('.domains-form').find("#addNewDomain").click(function(){
                    panelWebInterface.bindCSPDomains($("#contentSecurityPolicy", cspPanel).val(), true);
                    return false;
                });
            }
            panelWebInterface.changed("csp");
            panelWebInterface.bindCSPFromDomains();
            if($(".csp-domain", cspPanel).length==1){
                self.find(".addItemFileParser").css("margin-left", "20px");
            }
            vtip(cspPanel);
        }
    });
    vtip(cspPanel);
    if(!txtChange && domains.length == 0){
        $(".csp-domain", cspPanel).find(".removeItemFileParser, .removeItemFileParser2").click();
    }
    if(fromInput && domains.length == 0){
        $(".csp-domain", cspPanel).find(".removeItemFileParser, .removeItemFileParser2").click();
    }
    if($(".csp-domain", cspPanel).length==1){
        $(".csp-domain", cspPanel).find(".addItemFileParser").css("margin-left", "20px");
    }
    $(".csp-domain", cspPanel).form().find("input").unbind("change.csp").bind("change.csp", function(){
        var prnt = $(this).closest(".csp-domain");
        prnt.find(".warn-url").hide();
        if(prnt.find(":checked").length>0){
            prnt.find(".warn-url").hide();
        }
        else if(prnt.find("input[recname='name']").val()!==""){
            prnt.find(".warn-url").show();
        }
        itemsChanged(true);
        panelWebInterface.changed("csp");
        panelWebInterface.bindCSPFromDomains();
    });
    $(".csp-domain", cspPanel).each(function(){
        var prnt = $(this);
        prnt.find(".warn-url").hide();
        if(prnt.find(":checked").length>0){
            prnt.find(".warn-url").hide();
        }
        else if(prnt.find("input[recname='name']").val()!==""){
            prnt.find(".warn-url").show();
        }
    });
    csp.find("input").bind("textchange", function(){
        itemsChanged(true);
        panelWebInterface.changed("csp");
    });

    if(domains.length>0)
    {
        cspPanel.find(".domains-form").find(".removeItemFileParser:last").trigger('click');
        // panelWebInterface.changesDetected.removeByVal("csp");
    }
}

panelWebInterface.bindCSP = function(headers, addDefaults){
    var otherHeaders = [];
    var cspPanel = $("#WICSP");
    $("#contentSecurityPolicy", cspPanel).bind("change", function(){
        panelWebInterface.bindCSPDomains($(this).val(), true, true);
    })
    if(!headers){
        var prefs = common.data.ServerPrefs();
        for (var i = 0; i < 20; i++) {
            var curHeader = $.trim(common.data.getTextContentFromPrefs(prefs, "http_header"+ (i+1))).toLowerCase();
            if(curHeader.indexOf("content-security-policy")==0){
                panelWebInterface.bindCSPDomains(curHeader);
            }
            if(curHeader){
                otherHeaders.push({value:curHeader});
            }
        }
    }
    else {
        otherHeaders = headers;
    }
    var defaultHeaders = {
        'Referrer-Policy': 'Referrer-Policy: no-referrer-when-downgrade',
        'X-Content-Type-Options': 'X-Content-Type-Options: nosniff',
        'X-XSS-Protection': 'X-XSS-Protection: 1; mode=block',
        'Permissions-Policy': 'Permissions-Policy: camera=self; autoplay=self; execution-while-not-rendered=self; execution-while-out-of-viewport=self; identity-credentials-get=self; otp-credentials=self'
    };
    var strictTransportSecurity = "max-age=31536000; preload";

    var _headers = [];
    for (var i = 0; i < otherHeaders.length; i++) {
        var curItem = otherHeaders[i].value;
        if(curItem.toLowerCase().indexOf("referrer-policy")>=0)
        {
            delete defaultHeaders['Referrer-Policy'];
            _headers.push(otherHeaders[i]);
        }
        else if(curItem.toLowerCase().indexOf("x-content-type-options")>=0)
        {
            delete defaultHeaders['X-Content-Type-Options'];
            _headers.push(otherHeaders[i]);
        }
        else if(curItem.toLowerCase().indexOf("x-xss-protection")>=0)
        {
            delete defaultHeaders['X-XSS-Protection'];
            _headers.push(otherHeaders[i]);
        }
        else if(curItem.toLowerCase().indexOf("strict-transport-security")>=0)
        {
            strictTransportSecurity = $.trim(curItem.split("strict-transport-security:")[1]);
        }
        else if(curItem.toLowerCase().indexOf("content-security-policy")>=0)
        {
        }
        else{
            _headers.push(otherHeaders[i]);
        }
    }

    $("#strictTransportSecurity", cspPanel).val(strictTransportSecurity);
    if(addDefaults){
        for(var item in defaultHeaders){
            _headers.push({value:defaultHeaders[item]});
        }
    }
    $(".headers-form", cspPanel).empty();
    cspPanel.find('.headers-form').append('<div class="other-headers" style="width: 500px;padding: 10px 5px;"><input type="text" class="other-headers-name bigInputBox excludeXML" recname="value" /></div>');
    var csp = $(".other-headers", cspPanel.form()).EnableMultiField({
        confirmOnRemove: false,
        linkText : "",
        data: _headers,
        linkClass : "addItemFileParser",
        removeLinkText : "",
        maxItemsAllowedToAdd : 15,
        removeLinkClass : "removeItemFileParser",
        addEventCallback : function(newElem, clonnedFrom){
            itemsChanged(true);
            panelWebInterface.changed("csp");
            newElem.show().form().find("input").focus();
            newElem.find("input").bind("textchange", function(){
                itemsChanged(true);
                panelWebInterface.changed("csp");
            });
        },
        removeEventCallback : function(prev, self, uid){
            itemsChanged(true);
            panelWebInterface.changed("csp");
        }
    });
    csp.find("input").bind("textchange", function(){
        itemsChanged(true);
        panelWebInterface.changed("csp");
    });
    if(otherHeaders.length>0)
    {
        cspPanel.find(".headers-form").find(".removeItemFileParser:last").trigger('click');
        if(!addDefaults)
            panelWebInterface.changesDetected.removeByVal("csp");
    }
}

panelWebInterface.saveContent = function() {
    if (placeHolder.data("hasChanged")) {
        function saveMainPrefs(callback) {
            if(panelWebInterface.changesDetected.indexOf("options")<0){
                callback(true);
                return;
            }
            _panel.find(".htmlswitch").trigger("change");
            var xmlData = '<server_prefs type="properties">' + buildXMLToSubmitForm(_panel) + '</server_prefs>';
            crushFTP.data.setXMLPrefs("server_settings/server_prefs/", "properties", "update", xmlData, function(data) {
                data = $.xml2json(data, true);
                if (data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK") {
                    if (callback) {
                        callback(true);
                    } else {
                        crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
                    }
                } else {
                    if (callback) {
                        callback(false);
                    } else {
                        crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
                    }
                }
            }, panelWebInterface.saveParams);
        }

        function saveCustomForms(callback) {
            if(panelWebInterface.changesDetected.indexOf("forms")<0){
                callback(true);
                return;
            }
            var xmlStringCF = [];
            xmlStringCF.push("<CustomForms type=\"vector\">");
            var idAdded = [];
            for (var formId in panelWebInterface.formControls) {
                var controls = [];
                var form = panelWebInterface.formControls[formId];
                var id = common.data.getTextContentFromPrefs(panelWebInterface.formControls[formId], "id");
                var name = common.data.getTextContentFromPrefs(panelWebInterface.formControls[formId], "name");
                if (id === name)
                    id = crushFTP.methods.generateRandomPassword(10);
                //if(!idAdded.has(id))
                {
                    idAdded.push(id);
                    xmlStringCF.push("<CustomForms_subitem type=\"properties\">");
                    xmlStringCF.push("<entries type=\"vector\">");
                    if (form && form.entries && form.entries.length > 0 && form.entries[0].entries_subitem) {
                        controls = panelWebInterface.formControls[formId].entries[0].entries_subitem;
                        if (controls && id && name) {
                            for (var item in controls) {
                                var curItem = controls[item];
                                var itemType = curItem.item_type;
                                if (typeof itemType == "undefined" || !itemType)
                                    itemType = curItem.type || "text";
                                if (curItem && typeof itemType != "undefined") {
                                    var curXMLItem = [];
                                    var hasData = false;
                                    curXMLItem.push("<entries_subitem type=\"properties\">");
                                    for (var controlDetail in curItem) {
                                        if (controlDetail.toLowerCase() == "options") {
                                            var controlOpts = curItem[controlDetail];
                                            if (controlOpts && controlOpts.length) {
                                                curXMLItem.push("<options type=\"vector\">");
                                                for (var opt in controlOpts) {
                                                    if (controlOpts[opt].options_subitem) {
                                                        var subOpt = controlOpts[opt].options_subitem;
                                                        for (var subItem in subOpt) {
                                                            if (subOpt[subItem] && typeof subOpt[subItem].text != "undefined") {
                                                                curXMLItem.push("<options_subitem>");
                                                                var textVal = crushFTP.methods.htmlEncode(subOpt[subItem].text);
                                                                if (textVal.length == 0) textVal = ":";
                                                                curXMLItem.push(textVal);
                                                                curXMLItem.push("</options_subitem>");
                                                            }
                                                        }
                                                    }
                                                }
                                                curXMLItem.push("</options>");
                                            }
                                        } else {
                                            curXMLItem.push("<" + controlDetail + ">");
                                            if (curItem[controlDetail] && curItem[controlDetail].length > 0) {
                                                curXMLItem.push(crushFTP.methods.htmlEncode(curItem[controlDetail][0].text));
                                            } else {
                                                curXMLItem.push("");
                                            }
                                            curXMLItem.push("</" + controlDetail + ">");
                                        }
                                    }
                                    if (curXMLItem.length > 1) {
                                        curXMLItem.push("</entries_subitem>");
                                        xmlStringCF = xmlStringCF.concat(curXMLItem);
                                    }
                                }
                            }
                        }
                    }
                    xmlStringCF.push("</entries>");
                    xmlStringCF.push("<name>" + crushFTP.methods.htmlEncode(name) + "</name>");
                    xmlStringCF.push("<id>" + crushFTP.methods.htmlEncode(id) + "</id>");
                    xmlStringCF.push("</CustomForms_subitem>");
                }
            }
            xmlStringCF.push("</CustomForms>");
            var formSubItem = xmlStringCF.join("\n");
            crushFTP.data.setXMLPrefs("server_settings/CustomForms/0", "vector", "reset", formSubItem, function(data) {
                data = $.xml2json(data, true);
                if (data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK") {
                    if (callback) {
                        callback(true);
                    } else {
                        crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
                    }
                } else {
                    if (callback) {
                        callback(true);
                    } else {
                        crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
                    }
                }
            }, panelWebInterface.saveParams);
        }

        function saveMiniURLs(callback) {
            if(panelWebInterface.changesDetected.indexOf("miniurl")<0){
                callback(true);
                return;
            }
            var xmlStringMU = [];
            var formMiniURLsList = $("#miniURLs", _panel).find("li");
            if (formMiniURLsList.length > 0) {
                xmlStringMU.push("<miniURLs type=\"vector\">");
                formMiniURLsList.each(function() {
                    xmlStringMU.push("<miniURLs_subitem type=\"properties\">");
                    var controlData = $(this).data("controlData");
                    for (var item in controlData) {
                        if (controlData[item].length) {
                            if (controlData[item][0] && typeof controlData[item][0].text != "undefined") {
                                xmlStringMU.push("<" + item + ">" + crushFTP.methods.htmlEncode(controlData[item][0].text) + "</" + item + ">");
                            }
                        }
                    }
                    xmlStringMU.push("</miniURLs_subitem>");
                });
                xmlStringMU.push("</miniURLs>");
            } else {
                xmlStringMU.push("<miniURLs type=\"vector\"><miniURLs_subitem type=\"properties\"><expire></expire><user>null</user><key>null</key><pass></pass><redirect></redirect></miniURLs_subitem></miniURLs>");
            }
            var formSubItem = xmlStringMU.join("");
            var action = xmlStringMU.length > 0 ? "reset" : "remove";
            crushFTP.data.setXMLPrefs("server_settings/miniURLs/0", "vector", action, formSubItem, function(data) {
                data = $.xml2json(data, true);
                if (data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK") {
                    if (callback) {
                        callback(true);
                    } else {
                        crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
                    }
                } else {
                    if (callback) {
                        callback(true);
                    } else {
                        crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
                    }
                }
            }, panelWebInterface.saveParams);
        }

        function saveLoginPages(callback) {
            if(panelWebInterface.changesDetected.indexOf("loginpages")<0){
                callback(true);
                return;
            }
            var xmlStringLP = [];
            var formloginPageList = $("#loginPageList", _panel).find("li");
            if (formloginPageList.length > 0) {
                xmlStringLP.push("<login_page_list type=\"vector\">");
                formloginPageList.each(function() {
                    xmlStringLP.push("<login_page_list_subitem type=\"properties\">");
                    var controlData = $(this).data("controlData");
                    for (var item in controlData) {
                        if (controlData[item].length) {
                            if (controlData[item][0] && controlData[item][0].text) {
                                xmlStringLP.push("<" + item + ">" + crushFTP.methods.htmlEncode(controlData[item][0].text) + "</" + item + ">");
                            }
                        }
                    }
                    xmlStringLP.push("</login_page_list_subitem>");
                });
                xmlStringLP.push("</login_page_list>");
            }
            var loginPageSubItem = xmlStringLP.join("");
            var action = xmlStringLP.length > 0 ? "reset" : "remove";
            crushFTP.data.setXMLPrefs("server_settings/login_page_list/0", "vector", action, loginPageSubItem, function(data) {
                data = $.xml2json(data, true);
                if (data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK") {
                    if (callback) {
                        callback(true);
                    } else {
                        crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
                    }
                } else {
                    if (callback) {
                        callback(true);
                    } else {
                        crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
                    }
                }
            }, panelWebInterface.saveParams);
        }

        function saveProxyRules(callback) {
            if(panelWebInterface.changesDetected.indexOf("proxy")<0){
                callback(true);
                return;
            }
            var xmlStringPR = [];
            var proxyRulesList = $("#proxyRules", _panel).find("li");
            if (proxyRulesList.length > 0) {
                xmlStringPR.push("<proxyRules type=\"vector\">");
                proxyRulesList.each(function() {
                    xmlStringPR.push("<proxyRules_subitem type=\"properties\">");
                    var controlData = $(this).data("controlData");
                    for (var item in controlData) {
                        if (controlData[item].length) {
                            if (controlData[item][0] && typeof controlData[item][0].text != "undefined") {
                                xmlStringPR.push("<" + item + ">" + crushFTP.methods.htmlEncode(controlData[item][0].text) + "</" + item + ">");
                            }
                        }
                    }
                    xmlStringPR.push("</proxyRules_subitem>");
                });
                xmlStringPR.push("</proxyRules>");
            }
            var loginPageSubItem = xmlStringPR.join("");
            var action = xmlStringPR.length > 0 ? "reset" : "remove";
            crushFTP.data.setXMLPrefs("server_settings/proxyRules/0", "vector", action, loginPageSubItem, function(data) {
                data = $.xml2json(data, true);
                if (data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK") {
                    if (callback) {
                        callback(true);
                    } else {
                        crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
                    }
                } else {
                    if (callback) {
                        callback(true);
                    } else {
                        crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
                    }
                }
            }, panelWebInterface.saveParams);
        }

        function saveCSP(callback){
            if(panelWebInterface.changesDetected.indexOf("csp")<0){
                callback(true);
                return;
            }
            var cspPanel = $("#WICSP");
            var otherHeaders = cspPanel.find("input.other-headers-name");
            var strictTransportSecurity = $.trim(cspPanel.find("#strictTransportSecurity").val());
            var contentSecurityPolicy = $.trim(cspPanel.find("#contentSecurityPolicy").val()).toLowerCase();
            var xmlData = '<server_prefs type="properties">';
            var contIndex = 1;
            var headers = [];
            xmlData += '<Access-Control-Allow-Origin>'+crushFTP.methods.xmlEncode($("#Access-Control-Allow-Origin").val())+'</Access-Control-Allow-Origin>';
            if(strictTransportSecurity){
                if(strictTransportSecurity.toLowerCase().indexOf("strict-transport-security")==0){
                    headers.push(crushFTP.methods.xmlEncode(strictTransportSecurity));
                    var val = strictTransportSecurity;
                    xmlData += '<http_header1>'+crushFTP.methods.xmlEncode(val)+'</http_header1>';
                }
                else{
                    var val = strictTransportSecurity;
                    xmlData += '<http_header1>strict-transport-security: '+crushFTP.methods.xmlEncode(val)+'</http_header1>';
                }
                contIndex++;
            }
            if(contentSecurityPolicy){
                if(contentSecurityPolicy.toLowerCase().indexOf("content-security-policy")==0){
                    headers.push(crushFTP.methods.xmlEncode(contentSecurityPolicy.toLowerCase()));
                    var val = contentSecurityPolicy;
                    xmlData += '<http_header2>'+crushFTP.methods.xmlEncode(val)+'</http_header2>';
                }
                else{
                    var val = contentSecurityPolicy;
                    xmlData += '<http_header2>Content-Security-Policy: '+crushFTP.methods.xmlEncode(val)+'</http_header2>';
                }
                contIndex++;
            }
            var lastIndex;
            otherHeaders.each(function(ind){
                lastIndex = ind+contIndex;
                if($.trim($(this).val()) && headers.indexOf(crushFTP.methods.xmlEncode($.trim($(this).val())))<0){
                    headers.push(crushFTP.methods.xmlEncode($.trim($(this).val())));
                    var val = $.trim($(this).val());
                    xmlData += '<http_header'+(lastIndex)+'>'+crushFTP.methods.xmlEncode(val)+'</http_header'+(lastIndex)+'>'
                }
                else{
                    xmlData += '<http_header'+(lastIndex)+'></http_header'+(lastIndex)+'>'
                }
            });

            for (var i = lastIndex + 1; i < 21; i++) {
                xmlData += '<http_header'+(i)+'></http_header'+(i)+'>'
            }

            xmlData += '</server_prefs>';
            crushFTP.data.setXMLPrefs("server_settings/server_prefs/", "properties", "update", xmlData, function(data) {
                data = $.xml2json(data, true);
                if (data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK") {
                    if (callback) {
                        callback(true);
                    } else {
                        crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
                    }
                } else {
                    if (callback) {
                        callback(false);
                    } else {
                        crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
                    }
                }
            }, panelWebInterface.saveParams);
        }

        crushFTP.UI.showIndicator(false, false, "Please wait..");
        saveMainPrefs(function(flag) {
            if (flag) {
                saveCustomForms(function(flag) {
                    if (flag) {
                        saveMiniURLs(function(flag) {
                            saveLoginPages(function(flag) {
                                saveProxyRules(function(flag) {
                                    saveCSP(function(flag) {
                                        common.data.updateLocalPrefs(function() {
                                            panelWebInterface.changesDetected = [];
                                            crushFTP.UI.hideIndicator();
                                            if (flag) {
                                                crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
                                                panelWebInterface.bindData();
                                                placeHolder.removeData("hasChanged");
                                            } else {
                                                crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
                                            }
                                        });
                                    });
                                });
                            });
                        });
                    }
                });
            }
        });
    } else {
        crushFTP.UI.growl("No changes made", "", false, 3000);
    }
}