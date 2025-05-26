/****************************
CrushFTP GUI Plugin custom js
*****************************/
/* Do not change these lines */
var pluginContentBlocker = {};
pluginContentBlocker.localization = {};
/****************************/

// Plugin details
var pluginName = "ContentBlocker";
var _plugin = $("#pnlPlugin" + pluginName);

// Localizations
pluginContentBlocker.localization = {
	lblEnabledText : "Enabled",
	lblDebugText : "Debug",
	lblVersionText : "Version: ",
	lblSetupTabText : "Setup",
	lblHelpTabText : "Help",
	lblUsernamesToMonitorText : "Usernames to monitor: ",
	lblUsernameInstructionText : " (Separate multiple usernames with a comma) ",
	lblListOfFPTPathNoteText : " List of FTP paths to watch. (Example: '/uploads/')",
	btnAddPathText : " Add Path",
	btnEditPathText : " Edit Selected ",
	btnRemovePathText : " Remove Selected ",
	lblListOfAllowedExtensionsText : "List of allowed extensions for uploads from above directory selection :",
	btnAddExtensionText : "Add",
	btnEditExtensionText : "Edit",
	btnRemoveExtensionText : "Remove"
};

// Assign localizations
localizations.panels["Plugins"][pluginName] = $.extend(pluginContentBlocker.localization, localizations.panels["Plugins"][pluginName]);

// Interface methods
pluginContentBlocker.init = function(pluginID, returnXML){
	pluginContentBlocker.returnXML = returnXML;
	applyLocalizations(pluginName, localizations.panels["Plugins"]);
	pluginContentBlocker.bindData(0, pluginID);
}

pluginContentBlocker.bindData = function(index, pluginID)
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
		pluginContentBlocker.bindPluginDetails(curPlugin);
	}
	pluginContentBlocker.bindTrackedItems($("#pathList", _plugin).find(".ui-widget-header"));
	pluginContentBlocker.bindEvents();
}

pluginContentBlocker.bindEvents = function()
{
	if(this.eventAdded)return;
	var pathList = $("#pathList", _plugin);
	var extensionList = $("#allowedExtensions", _plugin);
	pathList.selectable({
		selected: function(event, ui) {
			var selected = $(ui.selected);
			pathList.find(".ui-widget-header").removeClass("ui-widget-header");
			selected.addClass("ui-widget-header");
			pluginContentBlocker.bindTrackedItems(selected);
			return false;
		}
	});

	$("#allowedExtensions", _plugin).selectable({
		selected: function(event, ui) {
			var selected = $(ui.selected);
			$("#allowedExtensions", _plugin).find(".ui-widget-header").removeClass("ui-widget-header");
			selected.addClass("ui-widget-header");
			return false;
		}
	});

	$("a#removePath", _plugin).click(function(){
		crushFTP.UI.removeItem(pathList, function(selected){
			pluginContentBlocker.bindTrackedItems(pathList.find("li.ui-selected"));
			panelPlugins.itemsChanged(true, pluginContentBlocker.returnXML, pluginName);
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
					newControl.data("controlData", {
						"path":actionName,
						"tracked" :  [{
							tracked_subitem : []
						}]
					});
				}
				panelPlugins.itemsChanged(true, pluginContentBlocker.returnXML, pluginName);
				pluginContentBlocker.bindTrackedItems(pathList.find("li.ui-selected"));
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
		panelPlugins.itemsChanged(true, pluginContentBlocker.returnXML, pluginName);
	});

	_plugin.find("input[type='text'], textarea").bind("textchange", function(){
		panelPlugins.itemsChanged(true, pluginContentBlocker.returnXML, pluginName);
	});

	$("a#addExtension", _plugin).click(function(){
		if(pathList.find("li.ui-selected").length>0)
		{
			var selected = pathList.find("li.ui-selected");
			jPrompt("Enter an extension to allow :", "", "Input", function(extension){
				if(extension!=null && extension.length > 0)
				{
					extension = extension.toUpperCase();
					var controlData = selected.data("controlData");
					if(!controlData.tracked)
					{
						controlData.tracked = [{
							tracked_subitem : []
						}];
					}
					controlData.tracked[0].tracked_subitem.push({
						text : extension
					});
					pluginContentBlocker.bindTrackedItems(selected);
					panelPlugins.itemsChanged(true, pluginContentBlocker.returnXML, pluginName);
				}
			});
		}
		return false;
	});

	$("a#editExtension", _plugin).click(function(){
		if(extensionList.find("li.ui-selected").length>0)
		{
			var selected = extensionList.find("li.ui-selected");
			jPrompt("Enter an extension to allow :",  selected.text(), "Input", function(extension){
				if(extension!=null && extension.length > 0)
				{
					extension = extension.toUpperCase();
					selected.text(extension);
					var selectedDir = pathList.find("li.ui-selected");
					var controlData = selectedDir.data("controlData");
					controlData.tracked[0].tracked_subitem[selected.index()].text = extension;
					panelPlugins.itemsChanged(true, pluginContentBlocker.returnXML, pluginName);
				}
			});
		}
		return false;
	});

	$("a#removeExtension", _plugin).click(function(){
		if(extensionList.find("li.ui-selected").length>0)
		{
			var selected = extensionList.find("li.ui-selected");
			var selectedDir = pathList.find("li.ui-selected");
			var controlData = selectedDir.data("controlData");
			controlData.tracked[0].tracked_subitem.remove(selected.index());
			selected.remove();
			extensionList.find("li:last").addClass("ui-widget-header ui-selected");
			panelPlugins.itemsChanged(true, pluginContentBlocker.returnXML, pluginName);
		}
		return false;
	});

	this.eventAdded = true;
}

pluginContentBlocker.bindPluginDetails = function(controlData)
{
	var inputs = _plugin.find("input.ignoreBind,select.ignoreBind,textarea.ignoreBind").removeClass("ignoreBind");
	bindValuesFromXML(_plugin, controlData);
	if(controlData.subItem && controlData.subItem.length>0)
		_plugin.attr("subPluginName", controlData.subItem[0].text || "");
	inputs.addClass("ignoreBind");
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
						if(path != "null"){
							var newControl = $("<li class='ui-widget-content' path='"+crushFTP.methods.htmlEncode(path)+"'>" + crushFTP.methods.htmlEncode(path) +"</li>");
							pathList.append(newControl);
							newControl.data("controlData", curItem);
						}
					}
				}
			}
		}
	}
}

pluginContentBlocker.bindTrackedItems = function(selected)
{
	var tracksPanel = $("#trackedItems", _plugin);
	if(!selected || selected.length == 0)
	{
		tracksPanel.hide();
		return;
	}
	var path = selected.data("controlData");
	tracksPanel.show();
	var nameList = $("#allowedExtensions", tracksPanel).empty();
	if(path["tracked"])
	{
		var tracked_list = path["tracked"];
		if(tracked_list.length>0)
		{
			tracked_list = tracked_list[0]["tracked_subitem"];
			if(tracked_list)
			{
				for(var i=0;i<tracked_list.length;i++)
				{
					var curItem = tracked_list[i];
					if(curItem && curItem.text)
					{
						var path = curItem.text;
						var newControl = $("<li class='ui-widget-content'>"+crushFTP.methods.htmlEncode(unescape(path))+"</li>");
						nameList.append(newControl);
						newControl.data("controlData", curItem).data("trackedItem", path);
					}
				}
			}
		}
	}
}

pluginContentBlocker.saveContent = function(saveByIndex, cloneName, removeByIndex, callback)
{
	removeByIndex = removeByIndex || 0;
	if(pluginPlaceHolder.data("hasChanged") || removeByIndex>0 || (saveByIndex>0 && cloneName) || pluginContentBlocker.returnXML)
	{
		if(!pluginContentBlocker.returnXML)
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
			var pathList = $("#pathList", container).find("li");
			if(pathList.length>0)
			{
				xmlString.push("<dir_list type=\"vector\">");
				pathList.each(function(){
					xmlString.push("<dir_list_subitem type=\"properties\">");
					xmlString.push("<path>"+crushFTP.methods.htmlEncode($(this).attr("path"))+"</path>");
					xmlString.push("<tracked type=\"vector\">");
					var controlData = $(this).data("controlData");
					if(controlData["tracked"])
					{
						var trackedPath = controlData["tracked"];
						if(trackedPath.length>0)
						{
							var tracked_list = trackedPath[0]["tracked_subitem"];
							if(tracked_list)
							{
								for(var i=0;i<tracked_list.length;i++)
								{
									var curItem = tracked_list[i];
									if(curItem && curItem.text)
									{
										xmlString.push("<tracked_subitem>"+crushFTP.methods.htmlEncode(curItem.text)+"</tracked_subitem>");
									}
								}
							}
						}
					}
					xmlString.push("</tracked>");
					xmlString.push("</dir_list_subitem>");
				});
				xmlString.push("</dir_list>");
			}
			else{
				xmlString.push("<dir_list type=\"vector\">");
				xmlString.push("<dir_list_subitem type=\"properties\">");
            	xmlString.push("<path>null</path>");
            	xmlString.push("<tracked type=\"vector\">");
				xmlString.push("<tracked_subitem>null</tracked_subitem>");
            	xmlString.push("</tracked>");
            	xmlString.push("</dir_list_subitem>");
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

		if(pluginContentBlocker.returnXML)
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