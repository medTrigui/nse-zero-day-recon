/****************************
CrushFTP GUI Plugin custom js
*****************************/
/* Do not change these lines */
var pluginWebApplication = {};
pluginWebApplication.localization = {};
/****************************/

// Plugin details
var pluginName = "WebApplication";
var _plugin = $("#pnlPlugin" + pluginName);

// Localizations
pluginWebApplication.localization = {
	lblEnabledText : "Enabled",
	lblDebugText : "Debug",
	lblVersionText : "Version: ",
	lblAllowedServerPortText : "Allowed Server Port: ",
	lblHTTPUsernameText : "HTTP Username: ",
	lblHTTPPasswordText : "HTTP Password: ",
	lblUserXMLURLText : "User XML URL: ",
	lblPostDataText : "Post Data: ",
	lblPermissionXMLURLText : "Permission XML URL: ",
	lblVFSXMLURLText : "VFS XML URL: ",
	lblHTTPMethodText : "HTTP Method: ",
	lblImportSettingsFromUserText : "Import settings from CrushFTP user: ",
	lblOverwriteVFSItemsText : "Overwrite VFS items?"
};

// Assign localizations
localizations.panels["Plugins"][pluginName] = $.extend(pluginWebApplication.localization, localizations.panels["Plugins"][pluginName]);

// Interface methods
pluginWebApplication.init = function(pluginID, returnXML){
	pluginWebApplication.returnXML = returnXML;
	applyLocalizations(pluginName, localizations.panels["Plugins"]);
	pluginWebApplication.bindData(0, pluginID);
}

pluginWebApplication.bindData = function(index, pluginID)
{
	index = index || 0;
	var pluginPrefs = [];
	pluginWebApplication.showServerList();
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
		pluginWebApplication.bindPluginDetails(curPlugin);
		var service = common;
		if(pluginWebApplication.returnXML)
		{
			service = crushFTP;
		}
		var server_item = service.data.getTextContentFromPrefs(curPlugin, "server_item");
		if(server_item)
		{
			if($.isArray(server_item))
				server_item = server_item[0].text;
			var items = server_item.split(",");
			if(items.has("All"))
			{
				crushFTP.UI.checkUnchekInput(_plugin.find("#server_item_all"), true);
				setTimeout(function(){
					_plugin.find("#server_item_all").trigger("change");
					pluginPlaceHolder.removeData("hasChanged");
				},100);
			}
			else
			{
				var serverPorts = $("#server_item_list", _plugin);
				serverPorts.find("input[name!='server_item_All']").each(function(){
					$(this).closest(".item").removeClass('ui-state-disabled');
				});
				for (var i = 0; i < items.length; i++) {
					crushFTP.UI.checkUnchekInput(_plugin.find("input[server_name='"+items[i]+"']"), true);
				}
			}
		}
	}
	pluginWebApplication.bindEvents();
}

pluginWebApplication.bindEvents = function()
{
	if(this.eventAdded)return;
	_plugin.find("input, select, textarea").bind("change", function(){
		panelPlugins.itemsChanged(true, pluginWebApplication.returnXML, pluginName);
		if($(this).closest('span.item').length>0)
		{
			var serverPorts = $("#server_item_list", _plugin);
			if($(this).is("#server_item_all"))
			{
				if($(this).is(":checked"))
				{
					serverPorts.find("input[name!='server_item_All']").each(function(){
						$(this).closest(".item").addClass('ui-state-disabled');
					});
					$("#server_item").val("All").trigger('change');
				}
				else
				{
					serverPorts.find("input[name!='server_item_All']").each(function(){
						$(this).closest(".item").removeClass('ui-state-disabled').end().trigger('change');
					});
				}
			}
			else
			{
				if($("#server_item_all", serverPorts).is(":checked"))
				{
					crushFTP.UI.checkUnchekInput($(this), false);
				}
				var items = [];
				$("#server_item_list").find("input:checked").each(function(){
					items.push($(this).attr("server_name"));
				});
				$("#server_item").val(items.join(",")).trigger('change');
			}
		}
	});

	_plugin.find("input[type='text'], textarea").bind("textchange", function(){
		panelPlugins.itemsChanged(true, pluginWebApplication.returnXML, pluginName);
	});
	$("[valtype]", _plugin).crushValidator();
	$("[valtype]", _plugin).unbind().bind("textchange",function(){
		$(this).validateNow({
			notForUserManager : true,
			isForPreferences : true
		});
	});
	this.eventAdded = true;
}

pluginWebApplication.bindPluginDetails = function(controlData)
{
	var inputs = _plugin.find("input.ignoreBind,select.ignoreBind,textarea.ignoreBind").removeClass("ignoreBind");
	if(controlData)
	{
		if(typeof controlData.usernameTemplate == "undefined" || controlData.usernameTemplate[0] == "" || controlData.usernameTemplate[0].text == "")
			controlData.usernameTemplate = [{ text: "default" }];
	}
	bindValuesFromXML(_plugin, controlData);
	if(controlData.subItem && controlData.subItem.length>0)
		_plugin.attr("subPluginName", controlData.subItem[0].text || "");
	inputs.addClass("ignoreBind");
}

pluginWebApplication.showServerList = function()
{
	if(!this.serverListShown)
	{
		var service = common;
		if(pluginWebApplication.returnXML)
		{
			service = crushFTP;
		}
		var serverList = service.data.getSubValueFromPrefs("server_list");
		var serverPorts = $("#server_item_list", _plugin);
		for(var i=0;i<serverList.length;i++)
		{
			var curItem = serverList[i];
			if(curItem)
			{
				var serverType = service.data.getTextContentFromPrefs(curItem, "serverType");
				var ip = service.data.getTextContentFromPrefs(curItem, "ip");
				var port = service.data.getTextContentFromPrefs(curItem, "port");
				var server = ip + "_" + port;
				var newControl = $('<span class="item"><input class="ignoreBind excludeXML" type="checkbox" server_name="'+crushFTP.methods.htmlEncode(server)+'" name="server_item_'+crushFTP.methods.htmlEncode(server)+'" id="server_item_'+crushFTP.methods.htmlEncode(server)+'" /><label for="server_item_'+crushFTP.methods.htmlEncode(server)+'">'+crushFTP.methods.htmlEncode(server)+'</label><span class="spacer"></span></span>');
				serverPorts.append(newControl);
				newControl.data("controlData", curItem);
			}
		}
		serverPorts.prepend('<span class="item"><input class="ignoreBind excludeXML" type="checkbox" name="server_item_All" id="server_item_all" /><label for="server_item_all">All</label><span class="spacer"></span></span>');
		this.serverListShown = true;
	}
}

pluginWebApplication.saveContent = function(saveByIndex, cloneName, removeByIndex, callback)
{
	removeByIndex = removeByIndex || 0;
	if(pluginPlaceHolder.data("hasChanged") || removeByIndex>0 || (saveByIndex>0 && cloneName) || pluginWebApplication.returnXML)
	{
		var hasError = false;
		$("[valtype]", _plugin).each(function(){
			if($(this).validateNow({
				notForUserManager : true,
				isForPreferences : true
			}) && !$(this).attr("_ignore"))
			{
				hasError = true;
			}
		});
		if(hasError){
			return;
		}

		if(!pluginWebApplication.returnXML)
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

		if(pluginWebApplication.returnXML)
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