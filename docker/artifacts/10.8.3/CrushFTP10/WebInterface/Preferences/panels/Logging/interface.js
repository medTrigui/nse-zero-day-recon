/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelLogging = {};
panelLogging.localization = {};
/****************************/

// Panel details
var panelName = "Logging";
var _panel = $("#pnl" + panelName);

// Localizations

panelLogging.localization = {
	headerText : "",
	lblSettingsTabText : "Settings",
	lblServerWindowOptionsTabText : "Server Window Options",
	lblLogFileOptionsTabText : "Log File Options",
	lblLogToDiskText : "Enable Logging",
	lblUseExtendedLoggingText : "Use extended (Syslog, DB, etc.)",
	lblUseConfigurationFileText : "Use configuration file from \"conf/logging.xml\"",
	lblEnableLogRollingText : "Enable Log Rolling",
	lblMaxSizeBeforeRollingText : "Max size before rolling: ",
	lblKeepHowManyFilesText : "Keep how many files: ",
	lblKeepHowManyFilesNoteText : "(0 = no limit)",
	lblEnableDailyLogRollingText : "Enable Daily Log Rolling",
	lblServerWindowLogBufferText : "Server Window Log Buffer: ",
	lblLinesText : "lines",
	lblUserInfoLogBufferText : "User Window Log Buffer: ",
	lblLinesText : "lines",
	lblUserLogFileLocationText : "Log File Location and Name: ",
	lblUserSessionLogFileLocationText : "User session log location: ",
	lblLogMatchingPatternText : "Filter log messages matching these pattern: ",
	lblErrorAndExceptionsText : "Errors and Exceptions",
	lblServerStoppedText : "Server Stopped",
	lblUserKickedText : "User Kicked",
	lblUserConnectedText : "User Connected",
	lblHTTPPostText : "HTTP POST",
	lblHTTPDeleteText : "HTTP DELETE",
	lblHTTPMoveText : "HTTP MOVE",
	lblHelpCommandText : "Help Command",
	lblRNTOCommandText : "RNTO Command",
	lblRMDCommandText : "RMD Command",
	lblRETRCommandText : "RETR Command",
	lblPASVCommandText : "PASV Command",
	lblEPRTCommandText : "EPRT Command",
	lblPROTCommandText : "PROT Command",
	lblSIZECommandText : "SIZE Command",
	lblRESTCommandText : "REST Command",
	lblSTORCommandText : "STOR Command",
	lblLISTCommandText : "LIST Command",
	lblWebInterfaceCommandText : "WebInterface Commands",
	lblDeniedConnectionsText : "Denied Connections",
	lblCrushFTPStartedText : "CrushFTP Started",
	lblUserBannedText : "User Banned",
	lblUserDisconnectedText : "User Disconnected",
	lblHTTPPropfindText : "HTTP PROPFIND",
	lblHTTPMkColText : "HTTP MKCOL",
	lblUserPauseResumeText : "User Pause / Resume",
	lblUSERCommandText : "USER Command",
	lblPWDCommandText : "PWD Command",
	lblMACBCommandText : "MACB Command",
	lblNLSTCommandText : "NLST Command",
	lblPORTCommandText : "PORT Command",
	lblAUTHCommandText : "AUTH Command",
	lblSYSTCommandText : "SYST Command",
	lblMDTMCommandText : "MDTM Command",
	lblDELECommandText : "DELE Command",
	lblAPPECommandText : "APPE Command",
	lblDirectoryListingsText : "Directory Listings",
	lblSITECommandText : "SITE Command",
	lblServerStartedText : "Server Started",
	lblCrushFTPQuitText : "CrushFTP Quit",
	lblDateTimeText : "Date / Time",
	lblHTTPGetText : "HTTP GET",
	lblHTTPLockText : "HTTP LOCK",
	lblHTTPPutText : "HTTP PUT",
	lblSTATCommandText : "STAT Command",
	lblRNFRCommandText : "RNFR Command",
	lblCWDCommandText : "CWD Command",
	lblABORCommandText : "ABOR Command",
	lblCDUPCommandText : "CDUP Command",
	lblEPSVCommandText : "EPSV Command",
	lblPBSZCommandText : "PBSZ Command",
	lblNOOPCommandText : "NOOP Command",
	lblTYPECommandText : "TYPE Command",
	lblMKDCommandText : "MKD Command",
	lblSTOUCommandText : "STOU Command",
	lblProxyDataText : "Proxy Data",
	lblQUITCommandText : "QUIT Command",
	lblLogDebugLevelText : "Log Debug Level:",
	lblDebugLevelNoteText : "Level 1:  Revealing informational errors, Level 2: Verbose",
	btnResetText : "Reset To Default",
	btnCancelText : "Cancel",
	btnOKText : "Save"
};

// Assign localizations
localizations.panels[panelName] = $.extend(panelLogging.localization, localizations.panels[panelName]);

// Interface methods
panelLogging.init = function(){
	applyLocalizations(panelName, localizations.panels);
	crushFTP.methods.setPageTitle(panelLogging.localization.Header, true);
	panelLogging.bindEvents();
	panelLogging.bindData();
    setupPrefsReplicationSave(_panel, panelName);
}

panelLogging.bindData = function()
{
	var prefs = common.data.ServerPrefs();
	bindValuesFromXML(_panel, prefs);
	var window_log_allow_str = crushFTP.data.getTextValueFromXMLNode(prefs.window_log_allow_str, "");
	window_log_allow_str = window_log_allow_str.split(")");
	for(var item in window_log_allow_str)
	{
		var curItem = window_log_allow_str[item];
		if(curItem.length>0 && curItem.substr)
		{
			curItem = curItem.substr(1, curItem.length);
			curItem = curItem.toLowerCase();
			if(curItem && curItem.length>0)
			{
				crushFTP.UI.checkUnchekInput($("#w_"+curItem, _panel), true);
			}
		}
	}

	var log_allow_str = crushFTP.data.getTextValueFromXMLNode(prefs.log_allow_str, "");
	log_allow_str = log_allow_str.split(")");
	for(var item in log_allow_str)
	{
		var curItem = log_allow_str[item];
		if(curItem.length>0 && curItem.substr)
		{
			curItem = curItem.substr(1, curItem.length);
			curItem = curItem.toLowerCase();
			if(curItem && curItem.length>0)
			{
				crushFTP.UI.checkUnchekInput($("#"+curItem, _panel), true);
			}
		}
	}
	$("#roll_daily_logs", _panel).trigger("change");
	var provider = $("#logging_provider", _panel).val();
	if(provider == "crushftp.handlers.log.LoggingProviderDisk")
	{
		$("#logging_provider", _panel).val("");
		provider = "";
	}
	if($("#logging_provider_select", _panel).find("option[value='"+provider+"']").length==0)
	{
		$("#logging_provider_select", _panel).find("option[value='']").attr("value", provider).text(provider);
	}
	$("#logging_provider_select", _panel).val(provider).trigger("change");

	if(prefs)
	{
		var nameList = $("#logDBItems", _panel);
		var selectedIndex = nameList.find("li.ui-widget-header").index();
		nameList.empty();

		var arrayItems = [];
		for(var i in prefs)
		{
			if(i.indexOf("logging_db_")==0)
			{
				arrayItems.push(
					{
						key : i,
						text : prefs[i][0].text || ""
					}
				);
			}
		}

		arrayItems = arrayItems.sort(crushFTP.methods.sortObjectsRefKey);
		for(var i=0;i<arrayItems.length;i++)
		{
			var newControl = $("<li class='ui-widget-content' name='"+crushFTP.methods.htmlEncode(arrayItems[i].key)+"'>"+crushFTP.methods.htmlEncode(arrayItems[i].key)+"</li>");
			nameList.append(newControl);
			newControl.data("controlData", arrayItems[i]);
		}

		if(selectedIndex>=0)
		{
			selectedIndex+=1;
			var selected = nameList.find(":nth-child("+selectedIndex+")").addClass("ui-widget-header ui-selected");
			panelLogging.bindFormDetails(selected);
		}
	}
}

panelLogging.bindFormDetails = function(selected)
{
	if(!selected || selected.length==0)
	{
		return;
	}
	var controlData = selected.data("controlData");
	if(controlData && controlData.key)
	{
		var data = controlData.text;
		var key = controlData.key;
		var txtDBAction = $("#txtDBAction", _panel).val(data);
		if(key == "logging_db_driver_file")
		{
			$("#browsePopupBtn", _panel).show();
		}
		else
		{
			$("#browsePopupBtn", _panel).hide();
		}
		if(key == "logging_db_pass")
		{
			$("#logging_db_pass", _panel).show().val(data);
			txtDBAction.hide();
		}
		else
		{
			$("#logging_db_pass", _panel).hide().val("");
			txtDBAction.show();
		}

		$("#formDetailsPanel", _panel).unblock();

		var keysToBlock = [
			"db_driver_file",
			"search_db_driver_file",
			"syncs_db_driver_file",
			"stats_db_driver_file",
			"logging_db_driver_file"
		];

		if(keysToBlock.indexOf(key)>=0){
			$("#formDetailsPanel", _panel).block({
				message:  'DB driver jar files are no longer dynamically loaded. They must be present in the CrushFTP folder/plugins/lib folder at startup time to be available for usage. if you see a ClassNotFound error, please ensure you have the driver jar files copied to that folder and restart CrushFTP.',
				css: {
					border: 'none',
					padding: '10px 10px',
					width: '60%',
					fontSize: '16px',
					lineHeight:'20px',
					backgroundColor: '#000',
					'-webkit-border-radius': '10px',
					'-moz-border-radius': '10px',
					opacity: .5,
					color: '#fff',
					'text-align':'left'
				},
				overlayCSS: {
					top: '-5px',
					padding: '5px 10px'
				}
			});
		}
	}
}

panelLogging.getDataFromKey = function(key)
{
	var data = "";
	var sqlItem = $("#logDBItems", _panel).find("li[name='"+key+"']");
	if(sqlItem && sqlItem.length>0)
	{
		var controlData = sqlItem.data("controlData");
		if(controlData && controlData.text)
			data = encodeURIComponent(controlData.text);
		else
			data = "";
	}
	return data;
}

panelLogging.bindEvents = function()
{
	$("#roll_daily_logs", _panel).change(function(){
		if($(this).is(":checked"))
		{
			$("#sizeBeforeRolling",_panel).hide();
		}
		else
		{
			$("#sizeBeforeRolling",_panel).show();
		}
	});

	var logingLogFileOptions = $('#LogingLogFileOptions', _panel);
	$("#quickFilter", _panel).bind("textchange", function(event) {
		var val = $(this).val();
		var toShow = logingLogFileOptions.find("input[name*='"+val+"'], label:Contains('"+val+"')");
		console.log(toShow);
		logingLogFileOptions.find("table").find("p").hide();
		toShow.closest('p').show();
	});

	$("#logging_provider_select", _panel).change(function(){
		/*if($(this).val() == "crushftp.handlers.log.LoggingProviderDisk")
		{
			$(".diskOption", _panel).show();
			$(".dbOption, .sysLogOption", _panel).hide();
		}
		else */
		if($(this).val() == "crushftp.handlers.log.LoggingProviderSQL")
		{
			$(".dbOption", _panel).show();
			$(".sysLogOption", _panel).hide();
		}
		else if($(this).val() == "crushftp.handlers.log.LoggingProviderSyslog")
		{
			$(".sysLogOption", _panel).show();
			$(".dbOption", _panel).hide();
		}
		else if($(this).val() == "crushftp.handlers.log.LoggingProviderSystemOut")
		{
			$(".sysLogOption, .dbOption", _panel).hide();
		}
		else
		{
			$(".sysLogOption, .dbOption", _panel).hide();
		}
		$("#logging_provider", _panel).val($(this).val());
	});

	var sqlItems = $("#logDBItems", _panel);
	sqlItems.selectable({
		selected: function(event, ui) {
			var selected = $(ui.selected);
			function continueLoading()
			{
				selected.parent().find(".ui-widget-header").removeClass("ui-widget-header ui-selected");
				selected.addClass("ui-widget-header ui-selected");
				panelLogging.bindFormDetails(selected);
			}
			if(_panel.find(".hasPendingCall").length>0)
			{
				window.pendingEncryptionCall = function(){
					continueLoading();
				};
				_panel.find(".hasPendingCall").trigger("blur");
			}
			else
			{
				continueLoading();
			}
			return false;
		}
	});

	var formDetailsPanel  = $("#formDetailsPanel", _panel);
	formDetailsPanel.find("input, select, textarea").bind("change", function(){
		if($(this).attr("id") == "logging_db_pass")
		{
			var item = $("#logDBItems", _panel).find("li[name='logging_db_pass']");
			if(!item || item.length==0)return;
			var data = item.data("controlData");
			if(data)
			{
				data.text = $(this).val();
			}
			item.data("controlData", data);
		}
		else
		{
			var item = sqlItems.find("li.ui-widget-header");
			if(!item || item.length==0)return;
			var data = item.data("controlData");
			if(data)
			{
				var isBool = $(this).attr("type") == "radio" || $(this).attr("type") == "checkbox";
				data.text = isBool ? $(this).is(":checked").toString() : $(this).val();
				if($(this).attr("id") == "type")
				{
					item.text($(this).val());
				}
			}
			item.data("controlData", data);
		}
		itemsChanged(true);
	});

	formDetailsPanel.find("input[type='text']:not(.ignoreChange), textarea").bind("textchange", function(){
		var item = sqlItems.find("li.ui-widget-header");
		if(!item || item.length==0)return;
		var data = item.data("controlData");
		if(data)
		{
			var isBool = $(this).attr("type") == "radio" || $(this).attr("type") == "checkbox";
			data.text = isBool ? $(this).is(":checked").toString() : $(this).val();
			if($(this).attr("id") == "type")
			{
				item.text($(this).val());
			}
		}
		item.data("controlData", data);
		itemsChanged(true);
	});

	$("a.serverFilePickButton", _panel).each(function(){
		$(this).unbind("click").click(function(){
			var curElem = $(this);
            var rel = curElem.attr("rel");
            var pickingFor = curElem.parent().parent().parent().find("label[for='"+rel+"']").text() || "";
            pickingFor = $.trim($.trim(pickingFor).replace(":", ""));
			curElem.crushFtpLocalFileBrowserPopup({
				type : curElem.attr("PickType") || 'file',
				pickingFor: pickingFor,
				existingVal : $("#" + curElem.attr("rel"), _panel).val(),
				callback : function(selectedPath){
					$("#" + curElem.attr("rel"), _panel).val(selectedPath).trigger("change").trigger("textchange");
				}
			});
			return false;
		});
	});

	// $('input#user_log_location, input#log_location', _panel).unbind().bind('keyup', function(){
	// 	var fixedValue = $(this).val();
	// 	fixedValue = fixedValue.replace('\\', '/');
	// 	$(this).val(fixedValue);
	// });

	$('input#user_log_location', _panel).unbind().bind('change', function(){
		var fixedValue = $(this).val();
		fixedValue = fixedValue.replace('\\', '/');
		if(fixedValue.substr(-1) != "/"){
			fixedValue = fixedValue+"/";
		}
		$(this).val(fixedValue);
	});

	$("a#testDB", _panel).click(function(){
		var link = $(this);
		if(link.attr("disabled"))return false;
		if(_panel.find(".hasPendingCall").length>0)
		{
			window.pendingEncryptionCall = function(){
				link.trigger("click");
			};
			_panel.find(".hasPendingCall").trigger("blur");
		}
		else
		{
			var obj = {
				command : "testDB",
				db_driver_file : panelLogging.getDataFromKey("logging_db_driver_file") || "",
				db_driver : panelLogging.getDataFromKey("logging_db_driver") || "",
				db_url : panelLogging.getDataFromKey("logging_db_url") || "",
				db_user : panelLogging.getDataFromKey("logging_db_user") || "",
				db_pass : panelLogging.getDataFromKey("logging_db_pass") || ""
			};
			$("a#testDB", _panel).block({
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

			crushFTP.data.serverRequest(obj, function(msg){
				$("a#testDB", _panel).unblock().removeAttr("disabled");
				crushFTP.UI.growl("Testing Database", DOMPurify.sanitize(decodeURIComponent($(msg).text())), false, false);
			});
		}
		return false;
	});
}

panelLogging.saveContent = function()
{
	if(placeHolder.data("hasChanged"))
	{
		crushFTP.UI.showIndicator(false, false, "Please wait..");
		var xmlData = '<server_prefs type="properties">'+panelLogging.buildXMLData(_panel)+'</server_prefs>';
		crushFTP.data.setXMLPrefs("server_settings/server_prefs/", "properties", "update", xmlData, function(data){
			data = $.xml2json(data, true);
			if(data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK")
			{
				common.data.updateLocalPrefs(function(){
					crushFTP.UI.hideIndicator();
					crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
					placeHolder.removeData("hasChanged");
				});
			}
			else
			{
				crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
			}
		}, panelLogging.saveParams);
	}
	else
	{
		crushFTP.UI.growl("No changes made", "", false, 3000);
	}
}

panelLogging.buildXMLData = function()
{
	var xmlString = buildXMLToSubmitForm(_panel);

	var window_log_allow_str = "";
	$("input:checked", _panel.find("#LogingServerOptions")).each(function(){
		window_log_allow_str += "(" + $(this).attr("id").replace("w_","").toUpperCase() + ")";
	});
	xmlString += "\r\n<window_log_allow_str>" + crushFTP.methods.htmlEncode(window_log_allow_str) + "</window_log_allow_str>";
	var logDBItems = $("#logDBItems", _panel).find("li");
	logDBItems.each(function(){
		var data = $(this).data("controlData");
		if(data)
		{
			var text = data.text;
			xmlString += "\r\n<"+$(this).attr("name")+">"+crushFTP.methods.htmlEncode(text)+"</"+$(this).attr("name")+">";
		}
	});
	var log_allow_str = "";
	$("input:checked", _panel.find("#LogingLogFileOptions")).each(function(){
		log_allow_str += "(" + $(this).attr("id").toUpperCase() + ")";
	});
	xmlString += "\r\n<log_allow_str>" + crushFTP.methods.htmlEncode(log_allow_str) + "</log_allow_str>";
	return xmlString;
}