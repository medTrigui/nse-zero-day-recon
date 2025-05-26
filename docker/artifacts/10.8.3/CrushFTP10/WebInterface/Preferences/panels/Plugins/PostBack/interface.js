/****************************
CrushFTP GUI Plugin custom js
*****************************/
/* Do not change these lines */
var pluginPostBack = {};
pluginPostBack.localization = {};
/****************************/

// Plugin details
var pluginName = "PostBack";
var _plugin = $("#pnlPlugin" + pluginName);

// Localizations
pluginPostBack.localization = {
	lblEnabledText : "Enabled",
	lblDebugText : "Debug",
	lblVersionText : "Version: ",
	lblMetaDataHelpText : " %user_name%, %the_real_path%, %the_file_path%, %the_file_name%, %the_file_size%, %the_file_speed%, %the_file_start%, %the_file_end%, %the_file_error% ",
	lblURLText : "URL: ",
	lblBasicAuthenticationUsernameText : "Basic Authentication Username (optional): ",
	lblPasswordText : "Password (optional): ",
	lblAlertNotificationText : "Alert notifications on failures. ",
	lblRetryXTimesText : "Retry x times on failure: ",
	lblMaximumFilesPerEventText : "Maximum files per event that post without delay: ",
	lblDelayBetweenEventText : "Delay between event posts: ",
	lblPostDataText : "Post Data: ",
	lblEnableDebugModeInstructionText : " Enable debug mode to see how the url was called. ",
	lblOnlyUseMostRecentItemsText : "Only use most recent item.",
	lblPostDataHelpText : " If this is for an event where the event happens immediately, and not just on logout, this will only process the most recent item. <br> Otherwise, it will go through each item executing the command on each. "
};

// Assign localizations
localizations.panels["Plugins"][pluginName] = $.extend(pluginPostBack.localization, localizations.panels["Plugins"][pluginName]);

// Interface methods
pluginPostBack.init = function(pluginID, returnXML){
	pluginPostBack.returnXML = returnXML;
	applyLocalizations(pluginName, localizations.panels["Plugins"]);
	pluginPostBack.bindData(0, pluginID);
}

pluginPostBack.bindData = function(index, pluginID)
{
	index = index || 0;
	var pluginPrefs = [];
	if(pluginID)
	{
		var data = $(document).data("PluginBindData" + pluginID);
		pluginPrefs = data.dataItem;
		$(".nonEmbed", _plugin).hide();
	}
	else
	{
		pluginPrefs = common.data.getPluginPrefs(pluginName);
	}
	if(pluginPrefs)
	{
		var curPlugin = pluginPrefs;
		if(!pluginID && pluginPrefs.length)
		{
			curPlugin = pluginPrefs[index];
		}
		pluginPostBack.bindPluginDetails(curPlugin);
	}
	pluginPostBack.bindEvents();
}

pluginPostBack.bindEvents = function()
{
	if(this.eventAdded)return;
	_plugin.find("input, select, textarea").bind("change", function(){
		panelPlugins.itemsChanged(true, pluginPostBack.returnXML, pluginName);
	});

	_plugin.find("input[type='text'], textarea").bind("textchange", function(){
		panelPlugins.itemsChanged(true, pluginPostBack.returnXML, pluginName);
	});
	this.eventAdded = true;
}

pluginPostBack.bindPluginDetails = function(controlData)
{
	var inputs = _plugin.find("input.ignoreBind,select.ignoreBind,textarea.ignoreBind").removeClass("ignoreBind");
	bindValuesFromXML(_plugin, controlData);
	if(controlData.subItem && controlData.subItem.length>0)
		_plugin.attr("subPluginName", controlData.subItem[0].text || "");
	inputs.addClass("ignoreBind");
}

pluginPostBack.saveContent = function(saveByIndex, cloneName, removeByIndex, callback)
{
	removeByIndex = removeByIndex || 0;
	if(pluginPlaceHolder.data("hasChanged") || removeByIndex>0 || (saveByIndex>0 && cloneName) || pluginPostBack.returnXML)
	{
		if(!pluginPostBack.returnXML)
			crushFTP.UI.showIndicator(false, false, "Please wait..");

		var xmlString = [];
		var container = _plugin;
		if(removeByIndex == 0)
		{
			xmlString.push("<plugins_subitem type=\"properties\">");
			xmlString.push("<pluginName>"+pluginName+"</pluginName>");
			xmlString.push("<version>"+$("#version", _plugin).text()+"</version>");
			xmlString.push(buildXMLToSubmitForm(_plugin, true));
			if(typeof saveByIndex != "undefined")
			{
				if(typeof cloneName == "undefined" || cloneName == "undefined" || cloneName == "false" || cloneName == pluginName)
				{
					var subItem = crushFTP.methods.htmlEncode(container.attr("subPluginName"));
					if(!subItem || subItem == "undefined" || subItem == "false" || subItem == pluginName)
						subItem = "";
					xmlString.push("<subItem>"+subItem+"</subItem>");
				}
				else
					xmlString.push("<subItem>"+crushFTP.methods.htmlEncode(cloneName)+"</subItem>");
			}
			else
			{
				if(container.attr("subPluginName") && this.subItem>0)
				{
					var subItem = crushFTP.methods.htmlEncode(container.attr("subPluginName"));
					if(!subItem || subItem == "undefined" || subItem == "false" || subItem == pluginName)
						subItem = "";
					xmlString.push("<subItem>"+subItem+"</subItem>");
				}
				else
				{
					xmlString.push("<subItem></subItem>");
				}
			}
			xmlString.push("</plugins_subitem>");
		}
		var formSubItem = xmlString.join("\n");

		if(pluginPostBack.returnXML)
			return formSubItem;

		var action = removeByIndex == 0 ? "change" : "remove";
		var index = window.currentPluginIndex;
		var subItemIndex = removeByIndex == 0 ? saveByIndex || this.subItem : removeByIndex;
		subItemIndex = subItemIndex || 0;
		var removeChangeFlag = (saveByIndex>0 && cloneName);
		panelPlugins.savePluginContentProcess(action, formSubItem, index, subItemIndex, removeChangeFlag, callback);
	}
	else
	{
		crushFTP.UI.growl("No changes made", "", false, 3000);
	}
}