/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelMisc = {};
panelMisc.localization = {};
/****************************/

// Panel details
var panelName = "Misc";
var _panel = $("#pnl" + panelName);

// Localizations
panelMisc.localization = {
	headerText : "",
	lblBeepWhenUsersConnectText : " Beep when users connect?",
	lblAlwaysDoRETRInBinaryText : " Always do RETR in BINARY?",
	lblAlwaysDoSTORInBinaryText : " Always do STOR in BINARY?",
	lblHideSplashScreenText : " Hide Splash Screen?",
	lblForNewVersionsText : " Check for New Versions",
	lblAllowMacBinaryOpertaionsText : " Allow MacBinary Operations?",
	lblAllowExtendedPassiveCommandsText : " Allow extended passive and port commands (EPSV/EPRT)",
	lblAllowDirectoryCachingText : " Allow Directory Caching",
	lblUseISLAText : " Use 'Is-la' for directory listings (OSX, Unix, Linux)",
	lblAutoIPDiscoveryText : " Auto IP discovery refresh interval in minutes:",
	lblSlowDownHackAttemptScansText : " Slow Down Hack Attempt Scans?",
	lblDisableRefererCookieText : " Disable Referer Cookie",
	lblDefaultPrivsText : " Default privs for new VFS items in User Manager:",
	lblLogDateTimeFormatText : " Log Date / Time Format:",
	lblDefaultOwnerText : " Default 'owner' of settings files:",
	lblDefaultGroupText : " Default 'group' of settings files:",
	lblNoOfUserBackupText : " Keep x backups of users in User Manager:",
	lblLocalizationNameText : " Localization Name:",
	lblZipCompressionLevelText : " Zip Compression Level:",
	lblDisableMDTMModificationsText : " Disable MDTM modifications",
	lblAllowZipstreamText : " Allow '.zipstream' Expansion",
	lblDeletePartialUploadsText : " Delete partial uploads.",
	lblAllowMagicFileTreeDownloadText : " Allow Magic '.filetree' Download",
	lblAllowListingSubdirsViaLSTText : " Allow listing subdirectories via LIST.",
	lblRemoteAdminRefreshIntervalText : " Remote Admin Refresh Interval (seconds):",
	lblAllowReUseInEmailEventsText : " Allow re-use in Email Events",
	lblDelayBetweenDisListingsText : " Delay Between Dir Listings (milliseconds):",
	lblRunEventsAsyncText : " Run Events Asynchronously",
	lblRememberInvalidUserNamesForXSecondsText : " Remember invalid usernames for x seconds:",
	lblFroceLowercaseUserNamesText : " Force Lowercase Usernames",
	lblWebDAVTimezoneOffsetText : " WebDAV Timezone Offset:",
	lblAllowAlternateURLDecodeText : " Allow Alternate URL Decode",
	lblServerStartMessageText : " Server Start Message:",
	btnResetText : "Reset To Default",
	btnCancelText : "Cancel",
	btnOKText : "Save"
};

// Assign localizations
localizations.panels[panelName] = $.extend(panelMisc.localization, localizations.panels[panelName]);

// Interface methods
panelMisc.init = function(){
	applyLocalizations(panelName, localizations.panels);
	crushFTP.methods.setPageTitle(panelMisc.localization.Header, true);
	var machineInfo = $(document).data("server_info") || {};

    // panelMisc.createSlider("low_memory_trigger_value1");
    // panelMisc.createSlider("low_memory_trigger_value2");
    // panelMisc.createSlider("low_memory_trigger_value3");

	panelMisc.bindData();
	if(machineInfo.machine_is_x)
	{
		$("#beep_connect", _panel).removeAttr("checked").trigger("change").closest("span").hide();
	}
    setupPrefsReplicationSave(_panel, panelName);
}

panelMisc.createSlider = function(name, value){
	var handle = $(".custom-handle", "#" + name);
    $("#" + name).slider({
      value: 100 - parseInt(value),
      create: function() {
        handle.text(parseInt($(this).slider("value")) + "%");
        $(this).parent().find(".tip").text(parseInt($(this).slider("value")) + "% Used, " + (100 - parseInt($(this).slider("value"))) + "% Remaining");
      },
      slide: function(event, ui) {
        handle.text(parseInt(ui.value) + "%");
        $(this).parent().find(".tip").text(parseInt(ui.value) + "% Used, " + (100 - parseInt(ui.value)) + "% Remaining");
        itemsChanged(true);
      }
    });
}

panelMisc.bindData = function()
{
	var prefs = common.data.ServerPrefs();
	if(typeof prefs.s3_max_buffer_download == "undefined")
	{
		prefs.s3_max_buffer_download = [{text:"100"}];
	}
	if(typeof prefs.s3_threads_download == "undefined")
	{
		prefs.s3_threads_download = [{text:"3"}];
	}
	if(typeof prefs.s3_threads_upload == "undefined")
	{
		prefs.s3_threads_upload = [{text:"3"}];
	}
	if(typeof prefs.s3_buffer == "undefined")
	{
		prefs.s3_buffer = [{text:"5"}];
	}
	if(typeof prefs.s3_buffer_download == "undefined")
	{
		prefs.s3_buffer_download = [{text:"5"}];
	}
	if(typeof prefs.s3_acl == "undefined")
	{
		prefs.s3_acl = [{text:"private"}];
	}
	if(typeof prefs.s3_storage_class == "undefined")
	{
		prefs.s3_storage_class = [{text:"STANDARD"}];
	}
	if(typeof prefs.low_memory_trigger_value1 == "undefined")
	{
		prefs.low_memory_trigger_value1 = [{text:"0"}];
	}
	if(typeof prefs.low_memory_trigger_value2 == "undefined")
	{
		prefs.low_memory_trigger_value2 = [{text:"0"}];
	}
	if(typeof prefs.low_memory_trigger_value3 == "undefined")
	{
		prefs.low_memory_trigger_value3 = [{text:"0"}];
	}
	panelMisc.createSlider("low_memory_trigger_value1", prefs.low_memory_trigger_value1[0].text);
  panelMisc.createSlider("low_memory_trigger_value2", prefs.low_memory_trigger_value2[0].text);
  panelMisc.createSlider("low_memory_trigger_value3", prefs.low_memory_trigger_value3[0].text);

	// $("#low_memory_trigger_value1", _panel).slider("value", prefs.low_memory_trigger_value1[0].text);
	// $("#low_memory_trigger_value2", _panel).slider("value", prefs.low_memory_trigger_value2[0].text);
	// $("#low_memory_trigger_value3", _panel).slider("value", prefs.low_memory_trigger_value3[0].text);
	bindValuesFromXML(_panel, prefs);
}

panelMisc.saveContent = function()
{
	if(placeHolder.data("hasChanged"))
	{
		crushFTP.UI.showIndicator(false, false, "Please wait..");
		var xmlData = '<server_prefs type="properties">'+panelMisc.buildXMLData(_panel);
		xmlData += "<low_memory_trigger_value1>"+ (100 - parseInt($("#low_memory_trigger_value1", _panel).slider("value"))) +"</low_memory_trigger_value1>";
		xmlData += "<low_memory_trigger_value2>"+ (100 - parseInt($("#low_memory_trigger_value2", _panel).slider("value"))) +"</low_memory_trigger_value2>";
		xmlData += "<low_memory_trigger_value3>"+ (100 - parseInt($("#low_memory_trigger_value3", _panel).slider("value"))) +"</low_memory_trigger_value3>";
		xmlData += '</server_prefs>';
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
		}, panelMisc.saveParams);
	}
	else
	{
		crushFTP.UI.growl("No changes made", "", false, 3000);
	}
}

panelMisc.buildXMLData = function()
{
	var xmlString = buildXMLToSubmitForm(_panel);
	return xmlString;
}
