/****************************
CrushFTP GUI Plugin custom js
*****************************/
/* Do not change these lines */
var pluginLaunchProcess = {};
pluginLaunchProcess.localization = {};
/****************************/

// Plugin details
var pluginName = "LaunchProcess";
var _plugin = $("#pnlPlugin" + pluginName);

// Localizations
pluginLaunchProcess.localization = {
	lblEnabledText : "Enabled",
	lblDebugText : "Debug",
	lblVersionText : "Version:",
	lblCommandParametersHelpText : "%user_name%, %the_real_path%, %the_file_path%, %the_file_name%, %the_file_size%, %the_file_speed%, %the_file_error%",
	lblCommandText : "Command: ",
	lblExamplesText : "Examples:",
	lblArgumentText : "Argument: ",
	lblSeparatorText : "Separator: ",
	lblExampleHelpText : "Example: If the command was \"cp\" and the argument was %the_real_path%:/archive/%the_file_name%<br/>Then, if a file was uploaded to \"/upload/stuff.zip\", it would be copied to \"/Archive/stuff.zip\"<br/>Note the purpose of the \".\" in that it separates arguments to the command.",
	lblEnableDebugModeHelpText : "Enable debug mode to see how the command would be executed.",
	lblUseRecentItemText : "Only use most recent item.",
	lblUseRecentItemHelpText : "If this is for an event where the event happens immediately, and not just on logout, this will only process the most recent item. Otherwise, it will go through each item executing the command on each.",
	lblRunCommandText : "Run command once with argument repeated for each item.",
	lblRunCommandHelpText : "This does : \"command argument argument argument\" etc."
};

// Assign localizations
localizations.panels["Plugins"][pluginName] = $.extend(pluginLaunchProcess.localization, localizations.panels["Plugins"][pluginName]);

// Interface methods
pluginLaunchProcess.init = function(pluginID, returnXML){
	pluginLaunchProcess.returnXML = returnXML;
	applyLocalizations(pluginName, localizations.panels["Plugins"]);
	pluginLaunchProcess.bindData(0, pluginID);
}

pluginLaunchProcess.bindData = function(index, pluginID)
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
		pluginLaunchProcess.bindPluginDetails(curPlugin);
	}
	pluginLaunchProcess.bindEvents();
}

pluginLaunchProcess.bindEvents = function()
{
	if(this.eventAdded)return;
	_plugin.find("input, select, textarea").bind("change", function(){
		panelPlugins.itemsChanged(true, pluginLaunchProcess.returnXML, pluginName);
	});

	_plugin.find("input[type='text'], textarea").bind("textchange", function(){
		panelPlugins.itemsChanged(true, pluginLaunchProcess.returnXML, pluginName);
	});

	_plugin.find("#examples").change(function(){
		var curVal = $(this).val();
		$("#command", _plugin).val(curVal);
		$("#argument", _plugin).val("");
		if(curVal == "cp")
		{
			$("#argument", _plugin).val("%the_real_path%:/archive/%the_file_name%");
		}
		else if(curVal == "mv")
		{
			$("#argument", _plugin).val("%the_real_path%:/processing/new files/%the_file_name%");
		}
		else if(curVal == "/Applications/MyApp.app/Contents/MacOS/MyApp")
		{
			$("#argument", _plugin).val("%the_real_path%");
		}
		else if(curVal == "open")
		{
			$("#argument", _plugin).val("%the_real_path%");
		}
	});

	this.eventAdded = true;
}

pluginLaunchProcess.bindPluginDetails = function(controlData)
{
	var inputs = _plugin.find("input.ignoreBind,select.ignoreBind,textarea.ignoreBind").removeClass("ignoreBind");
	bindValuesFromXML(_plugin, controlData);
	if(controlData.subItem && controlData.subItem.length>0)
		_plugin.attr("subPluginName", controlData.subItem[0].text || "");
	inputs.addClass("ignoreBind");
}

pluginLaunchProcess.saveContent = function(saveByIndex, cloneName, removeByIndex, callback)
{
	removeByIndex = removeByIndex || 0;
	if(pluginPlaceHolder.data("hasChanged") || removeByIndex>0 || (saveByIndex>0 && cloneName) || pluginLaunchProcess.returnXML)
	{
		if(!pluginLaunchProcess.returnXML)
			crushFTP.UI.showIndicator(false, false, "Please wait..");

		var xmlString = [];
		var container = _plugin;
		if(removeByIndex == 0)
		{
			xmlString.push("<plugins_subitem type=\"properties\">");
			xmlString.push("<version>"+$("#version", _plugin).text()+"</version>");
			xmlString.push("<pluginName>"+pluginName+"</pluginName>");
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

		if(pluginLaunchProcess.returnXML)
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