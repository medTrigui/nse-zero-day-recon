/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelReplication = {};
panelReplication.localization = {};
/****************************/

// Panel details
var panelName = "Replication";
var _panel = $("#pnl" + panelName);

// Localizations
panelReplication.localization = {
	headerText : " ",
	btnResetText : "Reset To Default",
	btnCancelText : "Cancel",
	btnOKText : "Save"
};

// Assign localizations
localizations.panels[panelName] = $.extend(panelReplication.localization, localizations.panels[panelName]);

// Interface methods
panelReplication.init = function(){
	applyLocalizations(panelName, localizations.panels);
	crushFTP.methods.setPageTitle(panelReplication.localization.Header, true);
	panelReplication.bindData();
	panelReplication.bindEvents();
}

panelReplication.bindData = function()
{
	var prefs = common.data.ServerPrefs();
	if(typeof prefs.replicated_vfs_ping_interval == "undefined")
	{
		prefs.replicated_vfs_ping_interval = [{text :"60"}]
	}
	if(typeof prefs.replicate_preferences == "undefined")
	{
		prefs.replicate_preferences = [{text :"true"}]
	}
	if(typeof prefs.replicate_preferences_sync == "undefined")
	{
		prefs.replicate_preferences_sync = [{text :"true"}]
	}
	bindValuesFromXML(_panel, prefs);
}

panelReplication.bindEvents = function()
{

}

panelReplication.saveContent = function()
{
	if(placeHolder.data("hasChanged"))
	{
		crushFTP.UI.showIndicator(false, false, "Please wait..");
		var xmlData = '<server_prefs type="properties">'+panelReplication.buildXMLData(_panel)+'</server_prefs>';
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
		});
	}
	else
	{
		crushFTP.UI.growl("No changes made", "", false, 3000);
	}
}

panelReplication.buildXMLData = function()
{
	var xmlString = buildXMLToSubmitForm(_panel);
	return xmlString;
}