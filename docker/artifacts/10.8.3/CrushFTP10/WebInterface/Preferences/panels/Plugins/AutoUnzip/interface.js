/****************************
CrushFTP GUI Plugin custom js
*****************************/
/* Do not change these lines */
var pluginAutoUnzip = {};
pluginAutoUnzip.localization = {};
/****************************/

// Plugin details
var pluginName = "AutoUnzip";
var _plugin = $("#pnlPlugin" + pluginName);

// Localizations
pluginAutoUnzip.localization = {
	lblEnabledText : "Enabled",
	lblDebugText : "Debug",
	lblVersionText : "Version: ",
	lblSetupTabText : "Setup",
	lblHelpTabText : "Help",
	lblUsernamesToMonitorText : "Usernames to monitor: ",
	lblUsernameInstructionText : "",
	lblListOfFPTPathNoteText : " List of FTP paths to watch and unzip uploads. (Example : '/uploads/')",
	btnAddPathText : " Add Path",
	btnEditPathText : " Edit Selected ",
	btnRemovePathText : " Remove Selected ",
	lblInternalUnzippingText : "Internal Unzipping",
	lblUnzipToOwnFolderText : "Unzip into its own folder.",
	lblExternalUnzipText : "External 'unzip' Unzipping",
	lblDeleteOriginalText : "Delete original .zip",
	pnlHelpText : "<strong>AutoUnzip Help</strong> <br> <br> This plugin allows you to have uploaded .zip files be automatically expanded. This way if users are using the auto zip feature of the CrushUpIoader, you won't first need to unzip each file when its uplaoded before you can use it. It is transparent to the end user. <br> <br> Their are two different modes that can be used for the unzipping. You can either do the internal unzip method which will unzip the files with CrushFTP, or if you are on OS X or a Unix/Linux variant, it will use the built in command line 'unzip' to expand the .zip files instead. <br> <br> Questions? Email us: support@crushftp.com <br> -Support"
};

// Assign localizations
localizations.panels["Plugins"][pluginName] = $.extend(pluginAutoUnzip.localization, localizations.panels["Plugins"][pluginName]);

// Interface methods
pluginAutoUnzip.init = function(pluginID, returnXML){
	pluginAutoUnzip.returnXML = returnXML;
	applyLocalizations(pluginName, localizations.panels["Plugins"]);
	pluginAutoUnzip.bindData(0, pluginID);
}

pluginAutoUnzip.bindData = function(index, pluginID)
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
		pluginAutoUnzip.bindPluginDetails(curPlugin);
	}
	pluginAutoUnzip.bindEvents();
}

pluginAutoUnzip.bindEvents = function()
{
	if(this.eventAdded)return;
	var pathList = $("#pathList", _plugin);
	pathList.selectable({
		selected: function(event, ui) {
			var selected = $(ui.selected);
			pathList.find(".ui-widget-header").removeClass("ui-widget-header");
			selected.addClass("ui-widget-header");
			return false;
		}
	});

	$("a#removePath", _plugin).click(function(){
		crushFTP.UI.removeItem(pathList, function(selected){
			panelPlugins.itemsChanged(true, pluginAutoUnzip.returnXML, pluginName);
		});
		return false;
	});

	$("a#addNewPath", _plugin).click(function(evt, control){
			var actionName = "";
			if(control)
			{
				actionName = control.attr("path");
			}
			jPrompt("Enter a FTP path to monitor :", actionName, "Input", function(value){
				actionName = value;
				if(actionName!=null)
				{
					if(actionName.length == 0)
					{
						$("#addPath", _panel).trigger("click");
						return;
					}
					if(control)
					{
						control.text(actionName).attr("path", actionName);
					}
					else
					{
						var newControl = $("<li class='ui-widget-content' path='"+crushFTP.methods.htmlEncode(actionName)+"'>" + crushFTP.methods.htmlEncode(actionName) +"</li>");
						pathList.append(newControl);
						newControl.parent().find(".ui-widget-header").removeClass("ui-widget-header").removeClass("ui-selected");
						newControl.addClass("ui-widget-header").addClass("ui-selected");
					}
					panelPlugins.itemsChanged(true, pluginAutoUnzip.returnXML, pluginName);
				}
			});
		return false;
	});

	$("a#editPath", _plugin).click(function(){
		if(pathList.find("li.ui-selected").length>0)
		{
			var selected = pathList.find("li.ui-selected");
			$("#addNewPath", _panel).trigger("click", [selected]);
		}
		return false;
	});

	_plugin.find("input, select, textarea").bind("change", function(){
		panelPlugins.itemsChanged(true, pluginAutoUnzip.returnXML, pluginName);
	});

	_plugin.find("input[type='text'], textarea").bind("textchange", function(){
		panelPlugins.itemsChanged(true, pluginAutoUnzip.returnXML, pluginName);
	});
	this.eventAdded = true;
}

pluginAutoUnzip.bindPluginDetails = function(controlData)
{
	if(!controlData) return;
	var inputs = _plugin.find("input.ignoreBind,select.ignoreBind,textarea.ignoreBind").removeClass("ignoreBind");
	bindValuesFromXML(_plugin, controlData);
	if(controlData.subItem && controlData.subItem.length)
		_plugin.attr("subPluginName", controlData.subItem[0].text || "");

	inputs.addClass("ignoreBind");
	if(controlData.internal_zip && controlData.internal_zip[0].text == "true")
	{
		crushFTP.UI.checkUnchekInput(_plugin.find("#internal_unzip"), true);
	}
	else if(controlData.external_zip && controlData.external_zip[0].text == "true")
	{
		crushFTP.UI.checkUnchekInput(_plugin.find("#external_unzip"), true);
	}
	var pathList = $("#pathList", _plugin).empty();
	if(controlData && controlData["dir_list"])
	{
		var dir_list = controlData["dir_list"];
		if(dir_list.length>0)
		{
			dir_list = dir_list[0]["dir_list_subitem"];
			if(dir_list)
			{
				for(var i=0;i<dir_list.length;i++)
				{
					var curItem = dir_list[i];
					if(curItem && curItem.path && curItem.path.length>0)
					{
						var path = curItem.path[0].text;
						var newControl = $("<li class='ui-widget-content' path='"+crushFTP.methods.htmlEncode(path)+"'>" + crushFTP.methods.htmlEncode(path) +"</li>");
						pathList.append(newControl);
						newControl.data("controlData", curItem);
					}
				}
			}
		}
	}
}

pluginAutoUnzip.saveContent = function(saveByIndex, cloneName, removeByIndex, callback)
{
	removeByIndex = removeByIndex || 0;
	if(pluginPlaceHolder.data("hasChanged") || removeByIndex>0 || (saveByIndex>0 && cloneName) || pluginAutoUnzip.returnXML)
	{
		if(!pluginAutoUnzip.returnXML)
			crushFTP.UI.showIndicator(false, false, "Please wait..");
		var xmlString = [];
		var container = _plugin;
		if(removeByIndex == 0)
		{
			xmlString.push("<plugins_subitem type=\"properties\">");
			xmlString.push("<version>"+$("#version", container).text()+"</version>");
			xmlString.push("<debug>"+$("#debug", container).is(":checked")+"</debug>");
			xmlString.push("<usernames>"+crushFTP.methods.htmlEncode($("#usernames", container).val())+"</usernames>");
			xmlString.push("<enabled>"+$("#enabled", container).is(":checked")+"</enabled>");
			xmlString.push("<replicate>"+$("#replicate", container).is(":checked")+"</replicate>");
			xmlString.push("<pluginName>"+pluginName+"</pluginName>");
			xmlString.push("<unzip_in_folder>"+$("#unzip_in_folder", container).is(":checked")+"</unzip_in_folder>");
			xmlString.push("<delete_zip>"+$("#delete_zip", container).is(":checked")+"</delete_zip>");
			xmlString.push("<external_zip>"+$("#external_unzip", container).is(":checked")+"</external_zip>");
			xmlString.push("<internal_zip>"+$("#internal_unzip", container).is(":checked")+"</internal_zip>");
			var pathList = $("#pathList", container).find("li");
			if(pathList.length>0)
			{
				xmlString.push("<dir_list type=\"vector\">");
				pathList.each(function(){
					xmlString.push("<dir_list_subitem type=\"properties\">");
					xmlString.push("<path>"+crushFTP.methods.htmlEncode($(this).attr("path"))+"</path>");
					xmlString.push("<tracked type=\"vector\"></tracked>");
					xmlString.push("</dir_list_subitem>");
				});
				xmlString.push("</dir_list>");
			}
			else
			{
				xmlString.push("<dir_list type=\"vector\">");
				xmlString.push("</dir_list>");
			}
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
		if(pluginAutoUnzip.returnXML)
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