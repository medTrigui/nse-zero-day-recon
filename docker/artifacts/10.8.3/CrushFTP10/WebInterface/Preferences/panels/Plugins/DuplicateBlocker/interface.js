/****************************
CrushFTP GUI Plugin custom js
*****************************/
/* Do not change these lines */
var pluginDuplicateBlocker = {};
pluginDuplicateBlocker.localization = {};
/****************************/

// Plugin details
var pluginName = "DuplicateBlocker";
var _plugin = $("#pnlPlugin" + pluginName);

// Localizations
pluginDuplicateBlocker.localization = {
	lblEnabledText : "Enabled",
	lblDebugText : "Debug",
	lblVersionText : "Version: ",
	lblSetupTabText : "Setup",
	lblHelpTabText : "Help",
	lblUsernamesToMonitorText : "Usernames to monitor: ",
	lblUsernameInstructionText : " (Separate multiple usernames with a comma) ",
	lblListOfFTPPathsToWatchText : " List of FTP paths to watch and deny duplicate uploads. (Example : '/uploads/') ",
	btnAddText : "Add",
	btnEditText : "Edit",
	btnRemoveText : "Remove",
	lblListOfTrackedUploadsText : " List of tracked uploads from above directory selection: ",
	pnlHelpText : " <strong>Help</strong> <br> <br> This plugin allows you to block uploads with the same name from being uploaded to a directory. It will prevent the replacement of a file in the directory, as well as any file that has been previously uploaded to the directory with ths same name. For example, a file named backup_01012007.zip would only be allowed to be uploaded once. Even if the file was later moved, the file would still be blocked from being uploaded if it has the same name. <br> <br> To use, enter a list of usernames this plugin will monitor. Then add FTP paths to the list of monitored directories. An FTP path is the path that the user sees from their FTP client, not the real physical path on your HD. All uploads inside of that location will be monitored and blocked when appropriate. You can view the list of currently tracked filenames in the plugin as well. It will initially be empty until some uploads have been done. <br> <br> Questions? Email us: support@crushftp.com <br> --Support "
};

// Assign localizations
localizations.panels["Plugins"][pluginName] = $.extend(pluginDuplicateBlocker.localization, localizations.panels["Plugins"][pluginName]);

// Interface methods
pluginDuplicateBlocker.init = function(pluginID, returnXML){
	pluginDuplicateBlocker.returnXML = returnXML;
	applyLocalizations(pluginName, localizations.panels["Plugins"]);
	pluginDuplicateBlocker.bindData(0, pluginID);
}

pluginDuplicateBlocker.bindData = function(index, pluginID)
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
		pluginDuplicateBlocker.bindPluginDetails(curPlugin);
	}
	pluginDuplicateBlocker.bindEvents();
}

pluginDuplicateBlocker.bindEvents = function()
{
	if(this.eventAdded)return;
	var dir_list = $("#dir_list", _panel);
	dir_list.selectable({
		selected: function(event, ui) {
			var selected = $(ui.selected);
			selected.parent().find(".ui-widget-header").removeClass("ui-widget-header");
			selected.addClass("ui-widget-header");
			pluginDuplicateBlocker.bindTrackedItems(selected);
			return false;
		}
	});

	var tracked_path = $("#tracked_path", _panel);
	tracked_path.selectable({
		selected: function(event, ui) {
			var selected = $(ui.selected);
			selected.parent().find(".ui-widget-header").removeClass("ui-widget-header");
			selected.addClass("ui-widget-header");
			return false;
		}
	});

	$("a#addPath", _plugin).click(function(evt, path){
		var pathName =  "";
		if(path)
		{
			pathName = path;
		}
		jPrompt("Enter a FTP path to monitor: ", pathName, "Input", function(_val){
			if(_val && _val.length>0)
			{
				if(path)
				{
					dir_list.find("li.ui-selected").text(_val).data("controlData", {
							"path":_val
						}).data("path", _val);
				}
				else
				{
					crushFTP.UI.addItem($("#dir_list", _plugin)
						, $("<li class='ui-widget-content'>"+crushFTP.methods.htmlEncode(_val)+"</li>").data("path", _val)
						,{
							"path":_val
						});
				}
				panelPlugins.itemsChanged(true, pluginDuplicateBlocker.returnXML, pluginName);
				pluginDuplicateBlocker.bindTrackedItems(dir_list.find("li.ui-selected"));
			}
		});
		return false;
	});

	$("a#editPath", _plugin).click(function(){
		if(dir_list.find("li.ui-selected").length>0)
		{
			var selected = dir_list.find("li.ui-selected");
			var path = selected.data("path");
			if(path)
			{
				$("#addPath", _plugin).trigger("click", path);
			}
		}
		return false;
	});

	$("a#removePath", _plugin).click(function(){
		crushFTP.UI.removeItem($("#dir_list", _plugin), function(){
			pluginDuplicateBlocker.bindTrackedItems(dir_list.find("li.ui-selected"));
			panelPlugins.itemsChanged(true, pluginDuplicateBlocker.returnXML, pluginName);
		});
		return false;
	});

	$("a#removeTracked", _plugin).click(function(){
		var selected = dir_list.find("li.ui-selected");
		var selectedTrackedItem = tracked_path.find("li.ui-selected");
		if(selected.length > 0 && selectedTrackedItem.length > 0)
		{
			var trackedItem = selectedTrackedItem.data("trackedItem");
			crushFTP.UI.removeItem(tracked_path, function(){
				var path = selected.data("controlData");
				if(path["tracked"])
				{
					var trackedPath = path["tracked"];
					if(trackedPath.length>0)
					{
						var tracked_list = trackedPath[0]["tracked_subitem"];
						var newList = [];
						if(tracked_list)
						{
							for(var i=0;i<tracked_list.length;i++)
							{
								var curItem = tracked_list[i];
								if(curItem && curItem.text)
								{
									if(trackedItem != curItem.text)
									{
										newList.push(curItem);
									}
								}
							}
						}
						trackedPath[0]["tracked_subitem"] = newList;
						path["tracked"] = trackedPath;
						selected.data("controlData", path);
					}
				}
			});
			panelPlugins.itemsChanged(true, pluginDuplicateBlocker.returnXML, pluginName);
		}
		return false;
	});

	_plugin.find("input, select, textarea").bind("change", function(){
		panelPlugins.itemsChanged(true, pluginDuplicateBlocker.returnXML, pluginName);
	});

	_plugin.find("input[type='text'], textarea").bind("textchange", function(){
		panelPlugins.itemsChanged(true, pluginDuplicateBlocker.returnXML, pluginName);
	});

	this.eventAdded = true;
}

pluginDuplicateBlocker.bindPluginDetails = function(controlData)
{
	var inputs = _plugin.find("input.ignoreBind,select.ignoreBind,textarea.ignoreBind").removeClass("ignoreBind");
	bindValuesFromXML(_plugin, controlData);
	if(controlData.subItem && controlData.subItem.length>0)
		_plugin.attr("subPluginName", controlData.subItem[0].text || "");
	inputs.addClass("ignoreBind");

	if(controlData["dir_list"])
	{
		var dir_list = controlData["dir_list"];
		if(dir_list.length>0)
		{
			dir_list = dir_list[0]["dir_list_subitem"];
			if(dir_list)
			{
				var nameList = $("#dir_list", _panel).empty();
				for(var i=0;i<dir_list.length;i++)
				{
					var curItem = dir_list[i];
					if(curItem && curItem.path)
					{
						var path = curItem.path[0].text || "";
						if(path){
							var newControl = $("<li class='ui-widget-content'>"+crushFTP.methods.htmlEncode(unescape(path))+"</li>");
							nameList.append(newControl);
							newControl.data("path", path);
							newControl.data("controlData", curItem);
						}
					}
				}
			}
		}
	}
}

pluginDuplicateBlocker.bindTrackedItems = function(selected)
{
	var tracksPanel = $("#trackedItems", _plugin);
	if(!selected || selected.length == 0)
	{
		tracksPanel.hide();
		return;
	}
	var path = selected.data("controlData");
	tracksPanel.show();
	var nameList = $("#tracked_path", tracksPanel).empty();
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

pluginDuplicateBlocker.saveContent = function(saveByIndex, cloneName, removeByIndex, callback)
{
	removeByIndex = removeByIndex || 0;
	if(pluginPlaceHolder.data("hasChanged") || removeByIndex>0 || (saveByIndex>0 && cloneName) || pluginDuplicateBlocker.returnXML)
	{
		if(!pluginDuplicateBlocker.returnXML)
			crushFTP.UI.showIndicator(false, false, "Please wait..");
		var xmlString = [];
		var container = _plugin;
		if(removeByIndex == 0)
		{
			xmlString.push("<plugins_subitem type=\"properties\">");
			xmlString.push("<version>"+$("#version", _plugin).text()+"</version>");
			xmlString.push("<pluginName>"+pluginName+"</pluginName>");
			xmlString.push(buildXMLToSubmitForm(_plugin, true));
			var dir_list = $("#dir_list", _panel).find("li");
			if(dir_list.length>0)
			{
				xmlString.push("<dir_list type=\"vector\">");
				dir_list.each(function(){
					xmlString.push("<dir_list_subitem type=\"properties\">");
					xmlString.push("<path>"+crushFTP.methods.htmlEncode($(this).data("path"))+"</path>");
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

		if(pluginDuplicateBlocker.returnXML)
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