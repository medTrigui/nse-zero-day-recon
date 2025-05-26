/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelRestrictions = {};
panelRestrictions.localization = {};
/****************************/

// Panel details
var panelName = "Restrictions";
var _panel = $("#pnl" + panelName);

// Localizations
panelRestrictions.localization = {
	headerText : " ",
	lblDaysOfTheWeeksAllowedToConnectHeaderText : " Days of the week users are allowed to connect: ",
	lblSundayText : "Sunday",
	lblMondayText : "Monday",
	lblTuesdayText : "Tuesday",
	lblWednesdayText : "Wednesday",
	lblThursdayText : "Thursday",
	lblFridayText : "Friday",
	lblSaturdayText : "Saturday",
	lblDownloadQueuingText : "Download Queuing?",
	lblDownloadQueueSizeLabelText : "Download Queue Size:",
	lblDownloadQueueSizeMaxLabelText : "Max:",
	lblUploadQueuingLabelText : "Upload Queuing?",
	lblUploadQueueSizeLabelText : "Upload Queue Size:",
	lblUploadQueueSizeMaxLabelText : "Max:",
	lblDenyFXPLabelText : "Deny FXP?",
	lblDenyLocalhostAdministrationLabelText : "Deny localhost automatic remote administration?",
	lblDenyReservedPortsLabelText : "Deny reserved ports?",
	lblFileNameFiltersLabelText : " Filename Filters (block matching names) ",
	btnAddNewFilenameFilterText : " Add",
	lblBlockPathMatchingPatternLabelText : " Block access to any path matching these patterns: ",
	btnResetText : "Reset To Default",
	btnCancelText : "Cancel",
	btnOKText : "Save"
};

// Assign localizations
localizations.panels[panelName] = $.extend(panelRestrictions.localization, localizations.panels[panelName]);

// Interface methods
panelRestrictions.init = function(){
	applyLocalizations(panelName, localizations.panels);
	crushFTP.methods.setPageTitle(panelRestrictions.localization.Header, true);
	panelRestrictions.bindData();
	panelRestrictions.bindEvents();
    setupPrefsReplicationSave(_panel, panelName);
}

panelRestrictions.bindData = function()
{
	var prefs = common.data.ServerPrefs();
	bindValuesFromXML(_panel, prefs);
	var daysAllowed = crushFTP.data.getTextValueFromXMLNode(prefs["day_of_week_allow"], "");
	for(var i=0; i< daysAllowed.toString().length;i++)
	{
		crushFTP.UI.checkUnchekInput($("#day_of_week_allow_" + daysAllowed.charAt(i), _panel), true);
	}
}

panelRestrictions.bindEvents = function()
{
	$("a#addFilenameFilter", _panel).click(function(){
		var stopOption =  "";
		jPrompt("Choose one: ", stopOption, "Stop Options", function(value){
			stopOption = value;
			if(stopOption!=null)
			{
				if(stopOption.length == 0)
				{
					$("a#addFilenameFilter", _panel).trigger("click");
					return;
				}
				var textValue = "";
				jPrompt("Please enter the text :", textValue, "CrushFTP Filters!", function(value){
					textValue = value;
					$("#filename_filters_str", _panel).val($("#filename_filters_str", _panel).val() + "\n" + stopOption + textValue + ";");
					itemsChanged(true);
				});
			}
		},[":LS:|(Listing) Starts With", ":LC:|(Listing) Contains", ":LE:|(Listing) Ends With", ":RS:|(Rename) Starts With", ":RC:|(Rename) Contains", ":RE:|(Rename) Ends With", ":US:|(Upload) Starts With", ":UC:|(Upload) Contains", ":UE:|(Upload) Ends With", ":DS:|(Download) Starts With", ":DC:|(Download) Contains", ":DE:|(Download) Ends With",
			":XS:|(Delete) Starts With",
			":XC:|(Delete) Contains",
			":XE:|(Delete) Ends With"]);
		return false;
	});
}

panelRestrictions.saveContent = function()
{
	if(placeHolder.data("hasChanged"))
	{
		crushFTP.UI.showIndicator(false, false, "Please wait..");
		var xmlData = '<server_prefs type="properties">'+panelRestrictions.buildXMLData(_panel)+'</server_prefs>';
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
		}, panelRestrictions.saveParams);
	}
	else
	{
		crushFTP.UI.growl("No changes made", "", false, 3000);
	}
}

panelRestrictions.buildXMLData = function()
{
	var xmlString = buildXMLToSubmitForm(_panel);
	var day_of_week_allow = "";
	$("input.dayOfTheWeek:checked", _panel).each(function(){
		day_of_week_allow += $(this).attr("id").replace("day_of_week_allow_","");
	});
	xmlString += "\r\n<day_of_week_allow>" + day_of_week_allow + "</day_of_week_allow>";
	return xmlString;
}