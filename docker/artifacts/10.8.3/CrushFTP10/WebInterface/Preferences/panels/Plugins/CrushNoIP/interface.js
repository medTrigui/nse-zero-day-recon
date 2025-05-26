/****************************
CrushFTP GUI Plugin custom js
*****************************/
/* Do not change these lines */
var pluginCrushNoIP = {};
pluginCrushNoIP.localization = {};
/****************************/

// Plugin details
var pluginName = "CrushNoIP";
var _plugin = $("#pnlPlugin" + pluginName);

// Localizations
pluginCrushNoIP.localization = {
	lblEnabledText : "Enabled",
	lblVersionText : "Version:",
	lblNoIPUsernameText : "No-IP Username(email): ",
	lblNoIPPasswordText : "No-IP Password: ",
	lblNoIPDomainToUpdateText : "No-IP Domain To Update: ",
	lblUpdateIntervalText : "Update Interval (minutes): ",
	btnUpdateNowText : "Update Now"
};

// Assign localizations
localizations.panels["Plugins"][pluginName] = $.extend(pluginCrushNoIP.localization, localizations.panels["Plugins"][pluginName]);

// Interface methods
pluginCrushNoIP.init = function(pluginID, returnXML){
	pluginCrushNoIP.returnXML = returnXML;
	applyLocalizations(pluginName, localizations.panels["Plugins"]);
	pluginCrushNoIP.bindData(0, pluginID);
}

pluginCrushNoIP.bindData = function(index, pluginID)
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
		pluginCrushNoIP.bindPluginDetails(curPlugin);
	}
	pluginCrushNoIP.loadedSubItem = index;
	pluginCrushNoIP.bindEvents(index);
}

pluginCrushNoIP.bindEvents = function()
{
	if(this.eventAdded)return;
	_plugin.find("input, select, textarea").bind("change", function(){
		panelPlugins.itemsChanged(true, pluginCrushNoIP.returnXML, pluginName);
	});

	_plugin.find("input[type='text'], textarea").bind("textchange", function(){
		panelPlugins.itemsChanged(true, pluginCrushNoIP.returnXML, pluginName);
	});

	$("a#testSettings", _plugin).click(function(){
		var link = $(this);
		if(link.attr("disabled"))return false;
		panelPlugins.pluginMethodCallSaveCallback = function(flag){
			if(flag)
			{
				var title = "";
				var obj = {
					command : "pluginMethodCall",
					method : link.attr("id"),
					pluginName : "CrushNoIP",
					pluginSubItem : pluginCrushNoIP.loadedSubItem == 0 ? "" : _plugin.attr("subPluginName")
				}
				if(obj.method == "testSettings")
				{
					title = "Testing Settings : ";
				}
				link.block({
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
					link.unblock().removeAttr("disabled");
					crushFTP.UI.growl(title, DOMPurify.sanitize(decodeURIComponent($(msg).text())), false, false);
				});
			}
		};
		if(pluginPlaceHolder.data("hasChanged"))
			$("#saveContent", _panel).trigger("click");
		else
		{
			panelPlugins.pluginMethodCallSaveCallback(true);
			panelPlugins.pluginMethodCallSaveCallback = false;
		}
		return false;
	});
	this.eventAdded = true;
}

pluginCrushNoIP.bindPluginDetails = function(controlData)
{
	var inputs = _plugin.find("input.ignoreBind,select.ignoreBind,textarea.ignoreBind").removeClass("ignoreBind");
	bindValuesFromXML(_plugin, controlData);
	if(controlData.subItem && controlData.subItem.length>0)
		_plugin.attr("subPluginName", controlData.subItem[0].text || "");
	inputs.addClass("ignoreBind");
}

pluginCrushNoIP.saveContent = function(saveByIndex, cloneName, removeByIndex, callback, noGrowl)
{
	removeByIndex = removeByIndex || 0;
	if(pluginPlaceHolder.data("hasChanged") || removeByIndex>0 || (saveByIndex>0 && cloneName) || pluginCrushNoIP.returnXML)
	{
		if(!pluginCrushNoIP.returnXML)
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

		if(pluginCrushNoIP.returnXML)
			return formSubItem;

		var action = removeByIndex == 0 ? "change" : "remove";
		var index = window.currentPluginIndex;
		var subItemIndex = removeByIndex == 0 ? saveByIndex || this.subItem : removeByIndex;
		subItemIndex = subItemIndex || 0;
		var removeChangeFlag = (saveByIndex>0 && cloneName);
		panelPlugins.savePluginContentProcess(action, formSubItem, index, subItemIndex, removeChangeFlag, callback, noGrowl);
	}
	else
	{
		if(!noGrowl)
			crushFTP.UI.growl("No changes made", "", false, 3000);
		else
		{
			callback(true);
		}
	}
}