/****************************
CrushFTP GUI Plugin custom js
*****************************/
/* Do not change these lines */
var pluginPreferencesController = {};
pluginPreferencesController.localization = {};
/****************************/

// Plugin details
var pluginName = "PreferencesController";
var _plugin = $("#pnlPlugin" + pluginName);

// Localizations
pluginPreferencesController.localization = {
	lblEnabledText : "Enabled",
	lblDebugText : "Debug",
	lblVersionText : "Version: ",
	lblSnapshotsTabText : "Snapshots",
	lblInstructionsTabText : "Instructions",
	lblWeekdayText : "Weekday: ",
	lblTimeText : "Time: ",
	btnCreateSnapshotText : "Create Snapshot",
	btnRemoveText : "Remove",
	pnlHelpText : " <b>Instructions</b><br> This plugin allows you to have preset preferences that take effect at different times of the day. This might be used to specify different bandwidth restrictions or enabling and disabling server itemsbased on the weekday or time of day. This plugin allows for some pretty powerful configurations.<br> <br> Simply specify the time you want the preferences to take affect, and press the 'Create Snapshot' button. A copy of your last 'saved' prefs.xml will then be made. (Every time you click OK a prefs.xml is saved.)Do not configure this plugin while CrushFTP is installed as a service or daemon. You will always want two snapshots or else the preferenceswill be swapped at the given time...and never swapped to anything different.<br> <br> When the time arrives for the snapshot, CrushFTP will swap out its preferences and the new settings will be live.Once the next snapshot time arrives, the next snapshot will be swapped in and so on. If you do alter your preferencesafter you have made a snapshot, you will need to re-make your snapshots as they will be out of date with your currentsettings.<br> <br> Questions? Email us: support@crushftp.com<br> "
};

// Assign localizations
localizations.panels["Plugins"][pluginName] = $.extend(pluginPreferencesController.localization, localizations.panels["Plugins"][pluginName]);

// Interface methods
pluginPreferencesController.init = function(pluginID, returnXML){
	pluginPreferencesController.returnXML = returnXML;
	applyLocalizations(pluginName, localizations.panels["Plugins"]);
	pluginPreferencesController.bindData(0, pluginID);
}

pluginPreferencesController.bindData = function(index, pluginID)
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
		pluginPreferencesController.bindPluginDetails(curPlugin);
	}
	pluginPreferencesController.bindEvents();
}

pluginPreferencesController.bindEvents = function()
{
	if(this.eventAdded)return;
	var snapshots = $("#snapshots", _panel);
	snapshots.selectable({
		selected: function(event, ui) {
			var selected = $(ui.selected);
			selected.parent().find(".ui-widget-header").removeClass("ui-widget-header");
			selected.addClass("ui-widget-header");
			return false;
		}
	});

	$("a#createSnapshot", _plugin).click(function(){
		var _val = $("#weekday").val() + ":" + $("#hour").val() + ":"  + $("#minute").val() + ":" + $("#ampm").val();
		var snapshotExist = false;
		snapshots.find("li").each(function(){
			if($(this).data("snapshotEntry") == _val)
			{
				snapshotExist = true;
			}
		});

		if(!snapshotExist)
		{
			crushFTP.UI.addItem($("#snapshots", _plugin)
				, $("<li class='ui-widget-content'>"+_val+"</li>").data("snapshotEntry", _val)
			);
		}
		jAlert("Snapshot created with current prefs.xml file.");
		panelPlugins.itemsChanged(true, pluginPreferencesController.returnXML, pluginName);
		return false;
	});

	$("a#removeSnapshot", _plugin).click(function(){
		crushFTP.UI.removeItem($("#snapshots", _plugin), function(){
			panelPlugins.itemsChanged(true, pluginPreferencesController.returnXML, pluginName);
		});
		return false;
	});

	_plugin.find("input, select, textarea").bind("change", function(){
		panelPlugins.itemsChanged(true, pluginPreferencesController.returnXML, pluginName);
	});

	_plugin.find("input[type='text'], textarea").bind("textchange", function(){
		panelPlugins.itemsChanged(true, pluginPreferencesController.returnXML, pluginName);
	});
	this.eventAdded = true;
}

pluginPreferencesController.bindPluginDetails = function(controlData)
{
	var inputs = _plugin.find("input.ignoreBind,select.ignoreBind,textarea.ignoreBind").removeClass("ignoreBind");
	bindValuesFromXML(_plugin, controlData);
	if(controlData.subItem && controlData.subItem.length>0)
		_plugin.attr("subPluginName", controlData.subItem[0].text || "");
	inputs.addClass("ignoreBind");

	if(!this.timeFieldsGenerated)
	{
		var hour = $("#hour", _plugin);
		for(var i=1;i<=12;i++)
		{
			var hr =  i < 10 ? '0' + i : '' + i;
			hour.append($("<option>"+hr.toString()+"</option>"));
		}
		var minutes = $("#minute", _plugin);
		for(var i=0;i<=59;i++)
		{
			var min =  i < 10 ? '0' + i : '' + i;
			minutes.append($("<option>"+min.toString()+"</option>"));
		}
		this.timeFieldsGenerated = true;
	}
	if(controlData["snapshots"])
	{
		var snapshots = controlData["snapshots"];
		if(snapshots.length>0)
		{
			snapshots = snapshots[0]["snapshots_subitem"];
			var nameList = $("#snapshots", _panel).empty();
			if(snapshots)
			{
				for(var i=0;i<snapshots.length;i++)
				{
					var curItem = snapshots[i];
					if(curItem)
					{
						var newControl = $("<li class='ui-widget-content'>"+crushFTP.methods.htmlEncode(unescape(curItem.text))+"</li>");
						nameList.append(newControl);
						newControl.data("snapshotEntry", curItem.text);
						newControl.data("controlData", curItem);
					}
				}
			}
		}
	}
}

pluginPreferencesController.saveContent = function(saveByIndex, cloneName, removeByIndex, callback)
{
	removeByIndex = removeByIndex || 0;
	if(pluginPlaceHolder.data("hasChanged") || removeByIndex>0 || (saveByIndex>0 && cloneName) || pluginPreferencesController.returnXML)
	{
		if(!pluginPreferencesController.returnXML)
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
			var snapshots = $("#snapshots", _panel).find("li");
			if(snapshots.length>0)
			{
				xmlString.push("<snapshots type=\"vector\">");
				snapshots.each(function(){
					xmlString.push("<snapshots_subitem>");
					xmlString.push($(this).data("snapshotEntry"));
					xmlString.push("</snapshots_subitem>");
				});
				xmlString.push("</snapshots>");
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

		if(pluginPreferencesController.returnXML)
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