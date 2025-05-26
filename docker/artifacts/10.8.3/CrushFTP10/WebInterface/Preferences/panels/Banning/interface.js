/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelBanning = {};
panelBanning.localization = {};
/****************************/

// Panel details
var panelName = "Banning";
var _panel = $("#pnl" + panelName);

// Localizations
panelBanning.localization = {
    headerText: "",
    lblHammeringConnectionSettingsText: " Hammering Connection Settings: ",
    lblHammeringHttpConnectionSettingsText: " Hammering HTTP(S) Connection Settings: ",
    lblConnectionSettingMaximumOfText: "Maximum of",
    lblConnectionSettingAttemptsInText: "attempts in",
    lblConnectionSettingSecondsThenBannedForText: "seconds, then banned for",
    lblConnectionSettingMinutesText: "minutes.",
    lblHammeringCommandSettingsText: " Hammering Command Settings: ",
    lblConnectionSettingMaximumOfText: "Maximum of",
    lblConnectionSettingAttemptsInText: "attempts in",
    lblConnectionSettingSecondsThenBannedForText: "seconds, then banned for",
    lblConnectionSettingMinutesText: "minutes.",
    lblHammeringPasswordSettingsText: " Hammering Failed Logins Settings: ",
    lblConnectionSettingMaximumOfText: "Maximum of",
    lblConnectionSettingAttemptsInText: "attempts in",
    lblConnectionSettingSecondsThenBannedForText: "seconds, then banned for",
    lblConnectionSettingMinutesText: "minutes.",
    lblHackAttemptSettingsText: " Hack Attempt Settings: ",
    lblHackAttemptSettingNoteText: "If any of these usernames are attempted, then banned for",
    lblConnectionSettingMinutesText: "minutes.",
    lblIPRestrictionsAndBansText: " IP Restrictions and Bans: ",
    btnRestrictionsRemoveText: " Remove ",
    btnRestrictionsEditText: " Edit ",
    btnRestrictionsAddText: " Add ",
    lblIPRestrictionsAndBansNoteText: " An empty list will deny everyone. ",
    lblIPRestrictionsAndBansNeverBanIPsText: " Never ban these IPs: ",
    btnResetText: "Reset To Default",
    btnCancelText: "Cancel",
    btnOKText: "Save"
};

// Assign localizations
localizations.panels[panelName] = $.extend(panelBanning.localization, localizations.panels[panelName]);

// Interface methods
panelBanning.init = function() {
    applyLocalizations(panelName, localizations.panels);
    crushFTP.methods.setPageTitle(panelBanning.localization.Header, true);
    panelBanning.bindData();
    panelBanning.bindEvents();
    setupPrefsReplicationSave(_panel, panelName);
};

panelBanning.bindData = function() {
    var prefs = common.data.ServerPrefs();
    if(typeof prefs.max_denied_ips == "undefined")
    {
        prefs.max_denied_ips = [{text:"100"}];
    }
    if(typeof prefs.max_password_resets_per_minute == "undefined")
    {
        prefs.max_password_resets_per_minute = [{text:"10"}];
    }
    if(typeof prefs.max_connection_single_ip == "undefined")
    {
        prefs.max_connection_single_ip = [{text:"100"}];
    }
    bindValuesFromXML(_panel, prefs);
    if($("#save_temp_bans", _panel).is(":checked")){
        $("#tempBans", _panel).hide();
    }
    else{
        $("#tempBans", _panel).show();
    }
    if (prefs.ip_restrictions) {
        var bannedIPList = prefs.ip_restrictions;
        if (bannedIPList.length > 0) {
            bannedIPList = bannedIPList[0].ip_restrictions_subitem;
            var formbannedIPlist = $("#bannedIPlist", _panel).empty();
            for (var i = 0; i < bannedIPList.length; i++) {
                var curItem = bannedIPList[i];
                if (curItem) {
                    var type = crushFTP.methods.htmlEncode(crushFTP.data.getTextValueFromXMLNode(curItem.type, ""));
                    var startip = crushFTP.methods.htmlEncode(crushFTP.data.getTextValueFromXMLNode(curItem.start_ip, ""));
                    var stopip = crushFTP.methods.htmlEncode(crushFTP.data.getTextValueFromXMLNode(curItem.stop_ip, ""));
                    var reason = crushFTP.methods.htmlEncode(crushFTP.data.getTextValueFromXMLNode(curItem.reason, ""));
                    var bannedIP = crushFTP.methods.htmlEncode(type + startip + ", " + stopip);
                    var newControl = $("<li class='ui-widget-content' bannedIP='" + bannedIP + "'>" + bannedIP + "<span class='drag ui-icon ui-icon-grip-dotted-vertical' style='float: right;'></span><span class='delete-control' style='float: right;'> x </span>	<div class='ban-info'>" + reason + "</div></li>");
                    formbannedIPlist.append(newControl);
                    newControl.data("controlData", curItem);
                }
            }
        }
    }
    var serverInfo = $(document).data("server_info");
    if (serverInfo.ip_restrictions_temp && serverInfo.ip_restrictions_temp.result_value_subitem) {
        var bannedIPList = serverInfo.ip_restrictions_temp.result_value_subitem;
        if (bannedIPList.length > 0) {
            var formbannedIPlist = $("#bannedIPlistTemp", _panel).empty();
            for (var i = 0; i < bannedIPList.length; i++) {
                var curItem = bannedIPList[i];
                if (curItem) {
                    var type = crushFTP.methods.htmlEncode(crushFTP.data.getTextValueFromXMLNode(curItem.type, ""));
                    var startip = crushFTP.methods.htmlEncode(crushFTP.data.getTextValueFromXMLNode(curItem.start_ip, ""));
                    var stopip = crushFTP.methods.htmlEncode(crushFTP.data.getTextValueFromXMLNode(curItem.stop_ip, ""));
                    var reason = crushFTP.methods.htmlEncode(crushFTP.data.getTextValueFromXMLNode(curItem.reason, ""));
                    var bannedIP = crushFTP.methods.htmlEncode(type + startip + ", " + stopip);
                    var newControl = $("<li class='ui-widget-content' bannedIP='" + bannedIP + "'>" + bannedIP + "<span class='drag ui-icon ui-icon-grip-dotted-vertical' style='float: right;'></span><span class='delete-control' style='float: right;'> x </span>    <div class='ban-info'>" + reason + "</div></li>");
                    formbannedIPlist.append(newControl);
                    newControl.data("controlData", curItem);
                }
            }
        }
    }
};

function ScrollTo(id) {
    $('.LargeListBox').animate({
        scrollTop: $("#" + id).offset().top
    }, 'slow');
}

panelBanning.bindEvents = function() {

    var bannedIPlist = common.data.getSubValueFromPrefs("bannedIPlist");
    if (bannedIPlist) {

        var formbannedIPlist = $("#bannedIPlist, #bannedIPlistTemp", _panel);

        var selected = formbannedIPlist.find(".ui-widget-header").index();
        //formbannedIPlist.empty();

        if (selected >= 0)
            $(formbannedIPlist.find("li").get(selected)).addClass("ui-widget-header ui-selected");

        formbannedIPlist.sortable({
            update: function(evt, ui) {
                itemsChanged(true);
            }
        });

        formbannedIPlist.find("li").unbind("dblclick").bind("dblclick", function() {
            $(this).closest("ol").find("li").removeClass('ui-selected');
            $(this).addClass('ui-selected');
            var isTemp = $(this).closest("ul").is("#bannedIPlistTemp");
            if(isTemp)
                $("#editBanRule", _panel).trigger('click');
            else
                $("#editBanRuleTemp", _panel).trigger('click');
        });


        formbannedIPlist.find("li").unbind("click").bind("click", function(e) {
            //formbannedIPlist.find("li").removeClass('ui-selected ui-widget-header');
            //$(this).addClass('ui-selected ui-widget-header');
            var parent = $(this).closest("ol");
            if (e.ctrlKey || e.metaKey) {
                $(this).toggleClass('ui-selected ui-widget-header');
            }
            else if (e.shiftKey) {
                // Get the first possible element that is selected.
                var currentSelectedIndex = parent.find("li").index(panelBanning.lastClickedBanListItem);
                // Get the shift+click element
                var selectedElementIndex = parent.find("li").index($(this));

                parent.find("li").removeClass("ui-selected ui-widget-header");
                if (currentSelectedIndex < selectedElementIndex) {
                    for (var indexOfRows = currentSelectedIndex; indexOfRows <= selectedElementIndex; indexOfRows++) {
                        parent.find("li").eq(indexOfRows).addClass('ui-selected ui-widget-header ');
                    }
                } else {
                    for (var indexOfRows = selectedElementIndex; indexOfRows <= currentSelectedIndex; indexOfRows++) {
                        parent.find("li").eq(indexOfRows).addClass('ui-selected ui-widget-header ');
                    }
                }
            } else {
                $(this).addClass('ui-selected').siblings().removeClass('ui-selected');
                $(this).addClass('ui-widget-header').siblings().removeClass('ui-widget-header');
            }
            panelBanning.lastClickedBanListItem = $(this);
        });

        formbannedIPlist.find(".delete-control").click(function() {
            $(this).closest("ul").find("li").removeClass('ui-selected ui-widget-header');
            $(this).closest("li").addClass('ui-selected ui-widget-header');
            var isTemp = $(this).closest("ol").is("#bannedIPlistTemp");
            if(isTemp)
                $("#removeBanRuleTemp").trigger("click");
            else
                $("#removeBanRule").trigger("click");
        });
    }

    $("a#editBanRule, a#editBanRuleTemp", _panel).click(function(evt, control) {
        var formbannedIPlist = $(this).is("#editBanRuleTemp") ? $("#bannedIPlistTemp", _panel) : $("#bannedIPlist", _panel);
        var selected = formbannedIPlist.find("li.ui-selected");
        if (selected && selected.length > 0) {
            $("#addNewBanRule", _panel).trigger("click", [selected.data("controlData"), selected]);
        }
        return false;
    });

    $("a#addNewBanRule, a#addNewBanRuleTemp", _panel).click(function(evt, controlData, control) {
        var beforeAfter = "",
            chooseOptId = "",
            startingipID = "",
            stoppingipId = "",
            reasonId = "";

        if (controlData) {
            chooseOptId = crushFTP.data.getTextValueFromXMLNode(controlData.type, "");
            startingipID = crushFTP.data.getTextValueFromXMLNode(controlData.start_ip, "");
            stoppingipId = crushFTP.data.getTextValueFromXMLNode(controlData.stop_ip, "");
            reasonId = crushFTP.data.getTextValueFromXMLNode(controlData.reason, "");
        }
        var isTemp = $(this).is("a#addNewBanRuleTemp") || (control && control.closest('#bannedIPlistTemp').length>0);
        $("#WIbannedIPDialogBan").find("#bannedIPlist").unbind("change").bind("change", function() {});
        $("#WIbannedIPDialogBan").dialog({
            resizable: false,
            modal: true,
            width: 450,
            create: function() {
                $(this).css("maxHeight", 500);
            },
            open: function() {
                $("#WIbannedIPDialogBan #selectionId").val(beforeAfter);
                $("#WIbannedIPDialogBan #chooseoptId").val(chooseOptId);
                $("#WIbannedIPDialogBan #startingIP").val(startingipID);
                $("#WIbannedIPDialogBan #stoppingIp").val(stoppingipId);
                $("#WIbannedIPDialogBan #reasonId").val(reasonId);

                if (controlData) {
                    $("#WIbannedIPDialogBan").find('#before_after_Id').hide();
                } else {
                    $("#WIbannedIPDialogBan").find('#before_after_Id').show();
                }
            },
            buttons: {
                OK: function() {

                    beforeAfter = crushFTP.methods.htmlEncode($.trim($("#WIbannedIPDialogBan").find("#selectionId").val()));
                    chooseOptId = crushFTP.methods.htmlEncode($.trim($("#WIbannedIPDialogBan").find("#chooseoptId").val()));
                    startingipID = crushFTP.methods.htmlEncode($.trim($("#WIbannedIPDialogBan").find("#startingIP").val()));
                    stoppingipId = crushFTP.methods.htmlEncode($.trim($("#WIbannedIPDialogBan").find("#stoppingIp").val()));
                    reasonId = crushFTP.methods.htmlEncode($.trim($("#WIbannedIPDialogBan").find("#reasonId").val()));

                    // Validation
                    if (!startingipID) {
                        alert("Please enter starting IP")
                        $("#WIbannedIPDialogBan").find("#startingIP").focus();
                        return false;
                    }
                    if (!crushFTP.methods.isValidIP(startingipID)) {
                        alert("Invalid starting IP - Address!!")
                        $("#WIbannedIPDialogBan").find("#startingIP").focus();
                        return false;
                    }
                    if (!stoppingipId) {
                        alert("Please enter stopping IP")
                        $("#WIbannedIPDialogBan").find("#stoppingIp").focus();
                        return false;
                    }
                    if (!crushFTP.methods.isValidIP(stoppingipId)) {
                        alert("Invalid stopping IP - Address!!")
                        $("#WIbannedIPDialogBan").find("#startingIP").focus();
                        return false;
                    }
                    if (!crushFTP.methods.isMatchingIPRange(startingipID, stoppingipId)) {
                        var that = $(this);
                        jConfirm("IP range mismatches, maybe its a typo. Ignore if it's intended.", "Warning", function(val){
                            if(val){
                                buildControl();
                                that.dialog("close");
                            }
                        }, {
                            okButtonText: "Ignore",
                            cancelButtonText: "Cancel"
                        });
                        return false;
                    }
                    function buildControl() {
                        var formbannedIPlist = isTemp ? $("#bannedIPlistTemp", _panel) : $("#bannedIPlist", _panel);
                        var bannedIP = chooseOptId + startingipID + ", " + stoppingipId;

                        var newControl = $("<li class='ui-widget-content' bannedIP='" + bannedIP + "'>" + bannedIP + "<span class='drag ui-icon ui-icon-grip-dotted-vertical' style='float: right;'></span><span class='delete-control' style='float: right;'> x </span><div class='ban-info'>" + reasonId + "</div> </li>");

                        var dataObj = {
                            start_ip: [{
                                text: startingipID
                            }],
                            type: [{
                                text: chooseOptId
                            }],
                            stop_ip: [{
                                text: stoppingipId
                            }],
                            reason: [{
                                text: reasonId
                            }]
                        };
                        newControl.data("controlData", dataObj);

                        if (control) {
                            control.replaceWith(newControl);
                        } else {
                            if (beforeAfter == "After") {
                                formbannedIPlist.append(newControl);
                                ScrollTo("bannedIPlist");
                            } else {
                                formbannedIPlist.prepend(newControl);
                            }
                        }

                        if (newControl) {
                            newControl.unbind("dblclick").bind("dblclick", function() {
                                newControl.removeClass('ui-selected');
                                newControl.addClass('ui-selected');
                                $("#editBanRule", _panel).trigger('click');
                            });
                            newControl.unbind("click").bind("click", function(e) {
                                // newControl.removeClass('ui-selected ui-widget-header');
                                // newControl.parent().find(".ui-widget-header").removeClass("ui-widget-header").removeClass("ui-selected");
                                // newControl.addClass('ui-selected ui-widget-header');
                                if (e.ctrlKey || e.metaKey) {
                                    $(this).toggleClass('ui-selected ui-widget-header');
                                }
                                else if (e.shiftKey) {
                                    // Get the first possible element that is selected.
                                    var currentSelectedIndex = formbannedIPlist.find("li").index(panelBanning.lastClickedBanListItem);
                                    // Get the shift+click element
                                    var selectedElementIndex = formbannedIPlist.find("li").index($(this));

                                    formbannedIPlist.find("li").removeClass("ui-selected ui-widget-header");
                                    if (currentSelectedIndex < selectedElementIndex) {
                                        for (var indexOfRows = currentSelectedIndex; indexOfRows <= selectedElementIndex; indexOfRows++) {
                                            formbannedIPlist.find("li").eq(indexOfRows).addClass('ui-selected ui-widget-header ');
                                        }
                                    } else {
                                        for (var indexOfRows = selectedElementIndex; indexOfRows <= currentSelectedIndex; indexOfRows++) {
                                            formbannedIPlist.find("li").eq(indexOfRows).addClass('ui-selected ui-widget-header ');
                                        }
                                    }
                                } else {
                                    $(this).addClass('ui-selected').siblings().removeClass('ui-selected');
                                    $(this).addClass('ui-widget-header').siblings().removeClass('ui-widget-header');
                                }
                                panelBanning.lastClickedBanListItem = $(this);
                            });
                            newControl.find(".delete-control").click(function() {
                                newControl.find("li").removeClass('ui-selected ui-widget-header');
                                $("#removeBanRule").trigger("click");
                            });
                            newControl.click();
                        }
                        itemsChanged(true);
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


    $("a#addNewBanRule_Old", _panel).click(function(evt) {
        var beforeAfter = "";
        jPrompt("Insert before/after selection?", beforeAfter, "CrushFTP IP Insert", function(value) {
            beforeAfter = value;
            if (beforeAfter != null) {
                var allowDeny = "";
                function allowDenyEntry() {
                    jPrompt("Choose one :", allowDeny, "CrushFTP IPs", function(value) {
                        allowDeny = value;
                        if (allowDeny == null) return false;
                        if (allowDeny) {
                            var startIP = "";
                            function startIPEntry() {
                                jPrompt("Please enter a starting IP:", startIP, "CrushFTP IPs", function(value) {
                                    startIP = value;
                                    if (startIP == null) return false;
                                    if (!crushFTP.methods.isValidIP(startIP)) {
                                        jAlert("Invalid starting IP - Address!!", "Message", function() {
                                            startIPEntry();
                                        });
                                    } else {
                                        var stopIP = startIP;

                                        function stopIPEntry() {
                                            jPrompt("Please enter a stopping IP:", stopIP, "CrushFTP IPs", function(value) {
                                                stopIP = value;
                                                if (stopIP == null) return false;
                                                if (!crushFTP.methods.isValidIP(stopIP)) {
                                                    jAlert("Invalid stopping IP - Address!!", "Message", function() {
                                                        stopIPEntry();
                                                    });
                                                } else {
                                                    jPrompt("Reason", "", "CrushFTP IPs", function(value) {
                                                        var reason = value || "";
                                                        if (reason == null) return false;
                                                        var formbannedIPlist = $("#bannedIPlist", _panel);
                                                        var bannedIP = crushFTP.methods.htmlEncode(allowDeny + startIP + ", " + stopIP);
                                                        var newControl = $("<li class='ui-widget-content' bannedIP='" + bannedIP + "'>" + bannedIP + "<div class='ban-info'>" + crushFTP.methods.htmlEncode(reason) + "</div></li>");
                                                        newControl.data("controlData", {
                                                            start_ip: [{
                                                                text: startIP
                                                            }],
                                                            type: [{
                                                                text: allowDeny
                                                            }],
                                                            stop_ip: [{
                                                                text: stopIP
                                                            }],
                                                            reason: [{
                                                                text: reason
                                                            }]
                                                        });

                                                        var selected = formbannedIPlist.find(".ui-selected");
                                                        if (selected && selected.length > 0) {
                                                            if (beforeAfter == "After") {
                                                                selected.after(newControl);
                                                            } else {
                                                                selected.before(newControl);
                                                            }
                                                        } else {
                                                            if (beforeAfter == "After") {
                                                                formbannedIPlist.append(newControl);
                                                            } else {
                                                                formbannedIPlist.prepend(newControl);
                                                            }
                                                        }

                                                        if (newControl) {
                                                            newControl.addClass("ui-widget-content ui-selectable-item");
                                                            try{
                                                                formbannedIPlist.selectableAdvanced("refresh");
                                                            }catch(ex){}
                                                            itemsChanged(true);
                                                        }
                                                    }, false, false, {
                                                        isTextArea: true
                                                    });
                                                }
                                            });
                                        }
                                        stopIPEntry();
                                    }
                                });
                            }
                            startIPEntry();
                        } else if (fieldName != null) {
                            allowDenyEntry();
                        }
                    }, ["A|Allow", "D|Deny", "D|Ban"]);
                }
                allowDenyEntry();
            }
        }, ["Before", "After"]);
        return false;
    });

    $("a#pasteBanList, a#pasteBanListTemp", _panel).click(function(evt) {
        var formbannedIPlist = $(this).is("a#pasteBanListTemp") ? $("#bannedIPlistTemp", _panel) : $("#bannedIPlist", _panel);
        jPrompt("Paste IP List", "", "CrushFTP IP Insert", function(val, key, extraItemVal, extVals) {
            if (val) {
                var items = val.split("\n");
                var ips = [];
                for (var i = 0; i < items.length; i++) {
                    var curItem = items[i];
                    var hasCIDR;
                    if(curItem.indexOf("/")>0){
                        if(curItem.indexOf("-")>0){
                            if(curItem.indexOf("-") > curItem.indexOf("/")){
                                hasCIDR = true;
                            }
                        }
                        else{
                            hasCIDR = true;
                        }
                    }
                    var curIPs = items[i].split("-");
                    if(hasCIDR){
                        if (curIPs && curIPs.length > 0) {
                            var rsn = curIPs[1] || "";
                            var range = crushFTPTools.CIDRtoIPRange(curIPs[0]);
                            if(range && range.length==2){
                                ips.push({
                                    start: $.trim(range[0]),
                                    end: $.trim(range[1]),
                                    reason : $.trim(rsn)
                                });
                            }
                        }
                    }
                    else{
                        if (curIPs && curIPs.length > 1) {
                            var rsn = curIPs[2] || "";
                            ips.push({
                                start: $.trim(curIPs[0]).split(' ')[0],
                                end: $.trim(curIPs[1]).split(' ')[0],
                                reason : $.trim(rsn)
                            });
                        }
                    }
                }
                if (ips && ips.length > 0) {
                    var allowDeny = extVals[1];
                    var beforeAfter = extVals[0];
                    for (var i = 0; i < ips.length; i++) {
                        var curIp = ips[i];
                        curIp.reason = curIp.reason || "";
                        var bannedIP = crushFTP.methods.htmlEncode(allowDeny + curIp.start + ", " + curIp.end);
                        var newControl = $("<li class='ui-widget-content' bannedIP='" + bannedIP + "'>" + bannedIP + "<span class='drag ui-icon ui-icon-grip-dotted-vertical' style='float: right;'></span><span class='delete-control' style='float: right;'> x </span>    <div class='ban-info'>" + crushFTP.methods.htmlEncode(curIp.reason) + "</div></li>");
                        newControl.data("controlData", {
                            start_ip: [{
                                text: curIp.start
                            }],
                            type: [{
                                text: allowDeny
                            }],
                            stop_ip: [{
                                text: curIp.end
                            }],
                            reason: [{
                                text: curIp.reason
                            }]
                        });
                        var selected = formbannedIPlist.find(".ui-selected");
                        if (selected && selected.length > 0) {
                            if (beforeAfter == "After") {
                                selected.after(newControl);
                            } else {
                                selected.before(newControl);
                            }
                        } else {
                            if (beforeAfter == "After") {
                                formbannedIPlist.append(newControl);
                            } else {
                                formbannedIPlist.prepend(newControl);
                            }
                        }
                        if (newControl) {
                            newControl.addClass("ui-widget-content ui-selectable-item");
                        }
                    }
                    try{
                        formbannedIPlist.selectableAdvanced("refresh");
                    }catch(ex){}
                    itemsChanged(true);
                    setTimeout(function(){
                        try{
                            formbannedIPlist.selectableAdvanced("refresh");
                        }catch(ex){}
                    },500);
                }
            }
        }, false, false, {
            isTextArea: true,
            appendAfterInput: '<small>Format : Starting IP - Stopping IP - Reason (optional) New line separated</small><div style="margin:10px 0px;"><label>Insert before/after selection? : <select class="extraItem" id="popup_before_after"><option value="Before">Before</option><option value="After">After</option></select></label><span class="spacer"></span><label>Choose one : <select class="extraItem"  id="popup_deny_allow"><option value="A">Allow</option><option value="D">Deny</option><option value="D">Ban</option></select></label></div>'
        });
        return false;
    });

    $("a#removeBanRule, a#removeBanRuleTemp", _panel).click(function() {
        var formbannedIPlist = $(this).is("a#removeBanRuleTemp") ? $("#bannedIPlistTemp", _panel) : $("#bannedIPlist", _panel);
        function continueRemove(noConfirm) {
            crushFTP.UI.removeItem(formbannedIPlist, function() {
                if (formbannedIPlist.find("li").length == 0) {
                    var newControl = $("<li class='ui-widget-content' bannedIP='A0.0.0.0, 255.255.255.255'>A0.0.0.0, 255.255.255.255 <span class='drag ui-icon ui-icon-grip-dotted-vertical' style='float: right;'></span> <span class='delete-control' style='float: right;'> x </span><div class='ban-info'></div></li>");
                    newControl.data("controlData", {
                        start_ip: [{
                            text: "0.0.0.0"
                        }],
                        type: [{
                            text: "A"
                        }],
                        stop_ip: [{
                            text: "255.255.255.255"
                        }],
                        reason: [{
                            text: ""
                        }]
                    });
                    formbannedIPlist.append(newControl);
                    if (newControl) {
                        newControl.unbind("dblclick").bind("dblclick", function() {
                            newControl.removeClass('ui-selected');
                            newControl.addClass('ui-selected');
                            $("#editBanRule", _panel).trigger('click');
                        });
                        newControl.unbind("click").bind("click", function(e) {
                            /*newControl.removeClass('ui-selected ui-widget-header');
                            newControl.parent().find(".ui-widget-header").removeClass("ui-widget-header").removeClass("ui-selected");
                            newControl.addClass('ui-selected ui-widget-header');*/
                            if (e.ctrlKey || e.metaKey) {
                                $(this).toggleClass('ui-selected ui-widget-header');
                            }
                            else if (e.shiftKey) {
                                // Get the first possible element that is selected.
                                var currentSelectedIndex = formbannedIPlist.find("li").index(panelBanning.lastClickedBanListItem);
                                // Get the shift+click element
                                var selectedElementIndex = formbannedIPlist.find("li").index($(this));

                                formbannedIPlist.find("li").removeClass("ui-selected ui-widget-header");
                                if (currentSelectedIndex < selectedElementIndex) {
                                    for (var indexOfRows = currentSelectedIndex; indexOfRows <= selectedElementIndex; indexOfRows++) {
                                        formbannedIPlist.find("li").eq(indexOfRows).addClass('ui-selected ui-widget-header ');
                                    }
                                } else {
                                    for (var indexOfRows = selectedElementIndex; indexOfRows <= currentSelectedIndex; indexOfRows++) {
                                        formbannedIPlist.find("li").eq(indexOfRows).addClass('ui-selected ui-widget-header ');
                                    }
                                }
                            } else {
                                $(this).addClass('ui-selected').siblings().removeClass('ui-selected');
                                $(this).addClass('ui-widget-header').siblings().removeClass('ui-widget-header');
                            }
                            panelBanning.lastClickedBanListItem = $(this);
                        });
                        newControl.find(".delete-control").click(function() {
                            newControl.find("li").removeClass('ui-selected ui-widget-header');
                            $("#removeBanRule").trigger("click");
                        });
                        try{
                            formbannedIPlist.selectableAdvanced("refresh");
                        }catch(ex){}
                        itemsChanged(true);
                    }
                    crushFTP.UI.growl("Warning", "Removing all items in the list will disable access to the server completely. A0.0.0.0, 255.255.255.255 is added by default when list is empty.", false, 5000);
                } else {
                    formbannedIPlist.find(".ui-widget-header").addClass("ui-state-focus ui-state-active").removeClass("ui-widget-header");
                }
            }, noConfirm, " ");
            try{
                formbannedIPlist.selectableAdvanced("refresh");
            }catch(ex){}
            itemsChanged(true);
        }
        if(formbannedIPlist.find("li").length==1 && formbannedIPlist.find("li").attr("bannedip")=="A0.0.0.0, 255.255.255.255")
        {
            crushFTP.UI.growl("Error", "Removing 0.0.0.0, 255.255.255.255 will disable access to the server completely.", true, 3000);
        }
        else
        {
            var selected = formbannedIPlist.find("li.ui-selected");
            if (selected.length > 0 && selected.attr("bannedIP") == "A0.0.0.0, 255.255.255.255") {
                jConfirm("Are you sure you wish to remove this item? <div style='color:red;margin:15px 0px;'>Removing this itme will disable all access to the server</div>", "Confirm", function(flag) {
                    if (flag) {
                        continueRemove(true);
                        try{
                            formbannedIPlist.selectableAdvanced("refresh");
                        }catch(ex){}
                    } else {
                        return false;
                    }
                });
            } else {
                continueRemove();
            }
        }
        return false;
    });

    $("a#editBanRule_old", _panel).click(function(evt, control) {
        var formbannedIPlist = $("#bannedIPlist", _panel);
        var selected = formbannedIPlist.find("li.ui-selected:last");
        if (selected && selected.length > 0) {
            selected.parent().find(".ui-state-highlight").removeClass("ui-state-highlight");
            selected.addClass("ui-state-highlight");
            var controlData = selected.data("controlData");
            if (!controlData) return;
            var allowDeny = crushFTP.data.getTextValueFromXMLNode(controlData.type, "");

            function allowDenyEntry() {
                jPrompt("Choose one :", allowDeny, "CrushFTP IPs", function(value) {
                    allowDeny = value;
                    if (allowDeny) {
                        var startIP = crushFTP.data.getTextValueFromXMLNode(controlData.start_ip, "");

                        function startIPEntry() {
                            jPrompt("Please enter a starting IP:", startIP, "CrushFTP IPs", function(value) {
                                startIP = value;
                                if (value) {
                                    if (!crushFTP.methods.isValidIP(startIP)) {
                                        jAlert("Invalid starting IP - Address!!", "Message", function() {
                                            startIPEntry();
                                        });
                                    } else {
                                        var stopIP = crushFTP.data.getTextValueFromXMLNode(controlData.stop_ip, "");

                                        function stopIPEntry() {
                                            jPrompt("Please enter a stopping IP:", stopIP, "CrushFTP IPs", function(value) {
                                                stopIP = value;
                                                if (!crushFTP.methods.isValidIP(stopIP)) {
                                                    jAlert("Invalid stopping IP - Address!!", "Message", function() {
                                                        stopIPEntry();
                                                    });
                                                } else {
                                                    var reason = crushFTP.data.getTextValueFromXMLNode(controlData.reason, "");
                                                    jPrompt("Reason", reason, "CrushFTP IPs", function(value) {
                                                        var reason = value || "";
                                                        if (reason == null) return false;
                                                        var formbannedIPlist = $("#bannedIPlist", _panel);
                                                        var bannedIP = allowDeny + startIP + ", " + stopIP;
                                                        var newControl = $("<li class='ui-widget-content' bannedIP='" + bannedIP + "'>" + bannedIP + "<div class='ban-info'>" + reason + "</div></li>");
                                                        selected.replaceWith(newControl);
                                                        newControl.data("controlData", {
                                                            start_ip: [{
                                                                text: startIP
                                                            }],
                                                            type: [{
                                                                text: allowDeny
                                                            }],
                                                            stop_ip: [{
                                                                text: stopIP
                                                            }],
                                                            reason: [{
                                                                text: reason
                                                            }]
                                                        });
                                                        if (newControl) {
                                                            newControl.addClass("ui-widget-content ui-selectable-item");
                                                            try{
                                                                formbannedIPlist.selectableAdvanced("refresh");
                                                            }catch(ex){}
                                                            itemsChanged(true);
                                                        }
                                                    }, false, false, {
                                                        isTextArea: true
                                                    });
                                                }
                                            });
                                        }
                                        stopIPEntry();
                                    }
                                }
                            });
                        }
                        startIPEntry();
                    } else if (allowDeny != null) {
                        allowDenyEntry();
                    }
                }, ["A|Allow", "D|Deny", "D|Ban"]);
            }
            allowDenyEntry();
        }
        return false;
    });

    $("a#moveIPUp, a#moveIPDown", _panel).click(function() {
        if (formbannedIPlist.find("li.ui-selected").length > 0) {
            crushFTP.UI.moveItem(formbannedIPlist.find("li.ui-selected"), $(this).is("#moveIPUp"), true, function() {
                itemsChanged(true);
            });
        }
        return false;
    });

    function filterIPList(phrase, isUsed, listToFilter) {
        listToFilter = listToFilter || $("#bannedIPlist", _panel);
        listToFilter.find("li").hide();
        listToFilter.find("li:Contains('" + phrase + "')").show();
    }

    var delay = (function() {
        var timer = 0;
        return function(callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    var filterIPs = $("#filterIPList, #filterIPListTemp", _panel).unbind("keyup").keyup(function(evt) {
        var evt = (evt) ? evt : ((event) ? event : null);
        var isTemp = $(this).is("#filterIPListTemp");
        var phrase = this.value;
        if (_panel["quick_filter_"+isTemp] && _panel["quick_filter_"+isTemp] === phrase) {
            return false;
        }
        delay(function() {
            var list = isTemp ? $("#bannedIPlistTemp", _panel) : $("#bannedIPlist", _panel);
            filterIPList(phrase, true, list);
            _panel["quick_filter_"+isTemp] = phrase;
        }, 500);
    });

    $("#clearFilter, #clearFilterTemp", _panel).click(function() {
        var isTemp = $(this).is("#clearFilterTemp");
        if(isTemp)
            $("#filterIPListTemp").val("").trigger("keyup");
        else
            $("#filterIPList").val("").trigger("keyup");
        return false;
    });

    $("#save_temp_bans", _panel).bind("change", function(){
        if($(this).is(":checked")){
            $("#tempBans", _panel).hide();
        }
        else{
            $("#tempBans", _panel).show();
        }
    });
    var banInvalid = $("#banInvalidMsg", _panel);
    $("#never_ban", _panel).bind("textchange", function(){
        var banValue = $(this).val();
        if(banValue.indexOf(" ") >=0 || banValue.indexOf("/") >=0 || banValue.indexOf("\\") >=0){
            banInvalid.show();
            $(this).addClass('input-error');
        }
        else{
            banInvalid.hide();
            $(this).removeClass('input-error');
        }
    }).trigger('textchange');

    $("#unblockUser", _panel).click(function(){
        var that = $(this);
        jPrompt("Please enter a username to unblock:", "", "Unblock Username", function(value) {
            if(value){
                var user = $.trim(value);
                if(user){
                    that.block({
                        message:  'Wait..',
                        css: {
                            border: 'none',
                            padding: '0px 10px',
                            backgroundColor: '#000',
                            '-webkit-border-radius': '10px',
                            '-moz-border-radius': '10px',
                            opacity: .5,
                            color: '#fff',
                            'text-align':'left'
                        }
                    }).attr("disabled", "disabled");
                    var obj = {
                        command:"unblockUsername",
                        username: user
                    };
                    crushFTP.data.serverRequest(obj, function(data){
                        data = $.xml2json(data, true);
                        if(data.response && crushFTP.data.getTextValueFromXMLNode(data.response) && crushFTP.data.getTextValueFromXMLNode(data.response) == "SUCCESS")
                        {
                            crushFTP.UI.growl("User unblocked", "", false, 5000);
                        }
                        else
                        {
                            crushFTP.UI.growl("Error while unblocking the user", "Error: " + $(data).text(), true);
                        }
                        that.unblock().removeAttr("disabled");
                    });
                }
            }
        });
        return false;
    })
};

panelBanning.saveContent = function() {
    if(_panel.find(".input-error:visible").length>0){
        alert("Please fix input errors to continue");
        _panel.find(".input-error:visible:first").focus();
        return false;
    }
    if (placeHolder.data("hasChanged")) {
        var hackUsers = $("#hack_usernames", _panel).val().toLowerCase().split(",");
        for (var i = 0; i < hackUsers.length; i++) {
            var curUser = $.trim(hackUsers[i]);
            if (curUser == "anonymous") {
                alert("You can not add 'Anonymous' user to ban in hack attempt setting");
                $("#hack_usernames", _panel).focus();
                return false;
            }
        }
        crushFTP.UI.showIndicator(false, false, "Please wait..");
        var prefsToSave = '<server_prefs type="properties">' + buildXMLToSubmitForm(_panel) + '</server_prefs>';
        crushFTP.data.setXMLPrefs("server_settings/server_prefs/", "properties", "update", prefsToSave, function(data) {
            data = $.xml2json(data, true);
            if (data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK") {
                var xmlData = panelBanning.buildXMLData();
                crushFTP.data.setXMLPrefs("server_settings/ip_restrictions/0", "vector", "reset", xmlData, function(data) {
                    data = $.xml2json(data, true);
                    if (data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK") {
                        common.data.updateLocalPrefs(function() {
                            if(!$("#save_temp_bans", _panel).is(":checked")){
                                var xmlTempData = panelBanning.buildXMLData(true);
                                var obj = {
                                    command:"setServerItem",
                                    key: "server_info/ip_restrictions_temp",
                                    data_type: "properties",
                                    data_action: "update",
                                    data: xmlTempData
                                };
                                crushFTP.data.serverRequest(obj,
                                    function(data){
                                        data = $.xml2json(data, true);
                                        if(data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK")
                                        {
                                            $("#filterIPList", _panel).val("").trigger("keyup");
                                            crushFTP.UI.hideIndicator();
                                            crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
                                            placeHolder.removeData("hasChanged");
                                        }
                                        else
                                        {
                                            $("#filterIPList", _panel).val("").trigger("keyup");
                                            crushFTP.UI.hideIndicator();
                                            crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
                                            crushFTP.UI.growl("Error while updating temp bans", "Error: " + DOMPurify.sanitize($(data).text()), true);
                                            placeHolder.removeData("hasChanged");
                                        }
                                    }
                                , false, "POST");
                            }
                            else{
                                $("#filterIPList", _panel).val("").trigger("keyup");
                                crushFTP.UI.hideIndicator();
                                crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
                                placeHolder.removeData("hasChanged");
                            }
                        });
                    } else {
                        crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
                    }
                }, panelBanning.saveParams);
            } else {
                crushFTP.UI.hideIndicator();
                crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
            }
        }, panelBanning.saveParams);
    } else {
        crushFTP.UI.growl("No changes made", "", false, 3000);
    }
};

panelBanning.buildXMLData = function(temp) {
    var postFix = "";
    var divID = "";
    if(temp){
        postFix = "_temp";
        divID = "Temp";
    }
    var ip_restrictions = "<ip_restrictions"+postFix.toLowerCase()+" type=\"vector\">";
    var formbannedIPlist = $("#bannedIPlist"+divID, _panel);
    formbannedIPlist.find("li").each(function() {
        var curData = $(this).data("controlData");
        if (curData) {
            ip_restrictions += "<ip_restrictions"+postFix.toLowerCase()+"_subitem type=\"properties\">";
            ip_restrictions += "<start_ip>" + crushFTP.methods.htmlEncode(crushFTP.data.getTextValueFromXMLNode(curData.start_ip, "")) + "</start_ip>";
            ip_restrictions += "<type>" + crushFTP.methods.htmlEncode(crushFTP.data.getTextValueFromXMLNode(curData.type, "")) + "</type>";
            ip_restrictions += "<stop_ip>" + crushFTP.methods.htmlEncode(crushFTP.data.getTextValueFromXMLNode(curData.stop_ip, "")) + "</stop_ip>";
            ip_restrictions += "<reason>" + crushFTP.methods.htmlEncode(crushFTP.data.getTextValueFromXMLNode(curData.reason, "")) + "</reason>";
            ip_restrictions += "</ip_restrictions"+postFix.toLowerCase()+"_subitem>";
        }
    });
    ip_restrictions += "</ip_restrictions"+postFix.toLowerCase()+">";
    return ip_restrictions;
};