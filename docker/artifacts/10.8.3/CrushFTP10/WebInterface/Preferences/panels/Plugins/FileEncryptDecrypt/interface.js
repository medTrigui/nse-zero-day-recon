/****************************
CrushFTP GUI Plugin custom js
*****************************/
/* Do not change these lines */
var pluginFileEncryptDecrypt = {};
pluginFileEncryptDecrypt.localization = {};
/****************************/

// Plugin details
var pluginName = "FileEncryptDecrypt";
var _plugin = $("#pnlPlugin" + pluginName);

// Localizations
pluginFileEncryptDecrypt.localization = {
	lblEnabledText : "Enabled",
	lblDebugText : "Debug",
	lblVersionText : "Version: "
};

// Assign localizations
localizations.panels["Plugins"][pluginName] = $.extend(pluginFileEncryptDecrypt.localization, localizations.panels["Plugins"][pluginName]);

// Interface methods
pluginFileEncryptDecrypt.init = function(pluginID, returnXML){
	pluginFileEncryptDecrypt.returnXML = returnXML;
	applyLocalizations(pluginName, localizations.panels["Plugins"]);
	pluginFileEncryptDecrypt.bindData(0, pluginID);
}

pluginFileEncryptDecrypt.bindData = function(index, pluginID)
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
		pluginFileEncryptDecrypt.bindPluginDetails(curPlugin);
	}
	pluginFileEncryptDecrypt.bindEvents();
}

pluginFileEncryptDecrypt.bindEvents = function()
{
	if(this.eventAdded)return;
	_plugin.find("input, select, textarea").bind("change", function(){
		panelPlugins.itemsChanged(true, pluginFileEncryptDecrypt.returnXML, pluginName);
	});

	_plugin.find("input[type='text'], textarea").bind("textchange", function(){
		panelPlugins.itemsChanged(true, pluginFileEncryptDecrypt.returnXML, pluginName);
	});
	this.eventAdded = true;
}

pluginFileEncryptDecrypt.bindPluginDetails = function(controlData)
{
	var inputs = _plugin.find("input.ignoreBind,select.ignoreBind,textarea.ignoreBind").removeClass("ignoreBind");
	bindValuesFromXML(_plugin, controlData);
	if(controlData.subItem && controlData.subItem.length>0)
		_plugin.attr("subPluginName", controlData.subItem[0].text || "");
	inputs.addClass("ignoreBind");
}

pluginFileEncryptDecrypt.saveContent = function(saveByIndex, cloneName, removeByIndex, callback)
{
	removeByIndex = removeByIndex || 0;
	if(pluginPlaceHolder.data("hasChanged") || removeByIndex>0 || (saveByIndex>0 && cloneName) || pluginFileEncryptDecrypt.returnXML)
	{
		if(!pluginFileEncryptDecrypt.returnXML)
			crushFTP.UI.showIndicator(false, false, "Please wait..");

		var xmlString = [];
		var container = _plugin;
		if(removeByIndex == 0)
		{
			xmlString.push("<plugins_subitem type=\"properties\">");
			xmlString.push("<version>"+$("#version", _plugin).text()+"</version>");
			xmlString.push("<debug>"+$("#debug", _plugin).is(":checked")+"</debug>");
			xmlString.push("<enabled>"+$("#enabled", _plugin).is(":checked")+"</enabled>");
			xmlString.push("<replicate>"+$("#replicate", container).is(":checked")+"</replicate>");
			xmlString.push("<pluginName>"+pluginName+"</pluginName>");
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

		if(pluginFileEncryptDecrypt.returnXML)
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