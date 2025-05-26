/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelFolderMonitor = {};
panelFolderMonitor.localization = {};
/****************************/

// Panel details
var panelName = "FolderMonitor";
var _panel = $("#pnl" + panelName);

// Localizations
panelFolderMonitor.localization = {
	headerText : "",
	pnlDescText : " Item in this list will be deleted or archived. Use with caution! ",
	btnAddText : "Add",
	btnDeleteText : "Delete",
	lblFormChkEnabledText : " Enabled",
	lblFolderLocationText : "Folder Location:",
	btnFolderLocationBrowseText : "Browse ",
	lblAndPathToItemMatchesText : "And path to item matches:",
	lblAndItemDsntMatchText : "And doesn't match path:",
	lblFormChkFilesText : " Files",
	lblFormChkEmptyFoldersText : " Empty Folders",
	lblFormChkNonEmptyFoldersText : " Non Empty Folders",
	lblFormMonitorSubFoldersText : " Monitor Subfolders",
	lblExpiresDurationUnitText : " Expires when: ",
	lblActionToTakeText : " Action to take: ",
	btnActionRefreshText : "Refresh ",
	lblFormChkDeleteItemsFoundText : " Delete Items Found",
	lblArchiveToFolderLocationText : "Archive to Folder:",
	btnFolderLocationBrowseText : "Browse ",
	btnResetText : "Reset To Default",
	btnCancelText : "Cancel",
	btnOKText : "Save"
};

// Assign localizations
localizations.panels[panelName] = $.extend(panelFolderMonitor.localization, localizations.panels[panelName]);

// Interface methods
panelFolderMonitor.init = function(){
	applyLocalizations(panelName, localizations.panels);
	crushFTP.methods.setPageTitle(panelFolderMonitor.localization.Header, true);
	panelFolderMonitor.bindData();
	panelFolderMonitor.bindEvents();
    setupPrefsReplicationSave(_panel, panelName);
}

panelFolderMonitor.bindData = function()
{
	panelFolderMonitor.bindActions();
	var prefs = common.data.ServerPrefs();
	bindValuesFromXML(_panel, prefs);
	if(prefs["monitored_folders"])
	{
		var monitored_folders = prefs["monitored_folders"];
		if(monitored_folders.length>0)
		{
			monitored_folders = monitored_folders[0] ? monitored_folders[0]["monitored_folders_subitem"] : false;
			if(monitored_folders && monitored_folders.length>0)
			{
				var folderList = $("#monitored_folders", _panel);
				var selected = folderList.find("li.ui-widget-header").index();
				folderList.empty();
				for(var i=0;i<monitored_folders.length;i++)
				{
					var curItem = monitored_folders[i];
					if(curItem)
					{
						var folder = crushFTP.methods.htmlEncode(crushFTP.data.getTextValueFromXMLNode(curItem.folder, ""));
						var newControl = $("<li class='ui-widget-content' folder='"+folder+"'>"+folder+"</li>");
						folderList.append(newControl);
						newControl.data("controlData", curItem);
					}
				}
				if(selected>=0)
				{
					selected += 1;
					panelFolderMonitor.bindFormDetails(folderList.find("li:nth-child("+selected+")").addClass("ui-widget-header ui-selected"));
				}
			}
		}
	}
}

panelFolderMonitor.bindEvents = function()
{
	var monitored_folders = $("#monitored_folders", _panel);
	monitored_folders.selectable({
		selected: function(event, ui) {
			var selected = $(ui.selected);
			selected.parent().find(".ui-widget-header").removeClass("ui-widget-header");
			selected.addClass("ui-widget-header");
			panelFolderMonitor.bindFormDetails(selected);
			return false;
		}
	});

	$("a#addRule", _panel).click(function(){
		itemsChanged(true);
		crushFTP.UI.addItem($("#monitored_folders", _panel)
			, $("<li class='ui-widget-content'>/myFolder/folderX/</li>")
			, {
				folderMonitorAction:[{text:""}],
				monitor_sub_folders:[{text:"true"}],
				time_units:[{text:"2"}],
				folder:[{text:"/myFolder/folderX/"}],
				folder_match:[{text:"*"}],
				monitor_files:[{text:"true"}],
				zippath:[{text:"/MyZips/"}],
				monitor_empty_folders:[{text:""}],
				folder_not_match:[{text:""}],
				time_units_no:[{text:"30"}],
				enabled:[{text:""}],
				monitor_non_empty_folders:[{text:""}],
				"delete":[{text:""}],
				w_subdir:[{text:""}],
				empty_count_files:[{text:"true"}],
				empty_count_folders:[{text:"false"}]
			}
			, panelFolderMonitor.bindFormDetails);
		return false;
	});

	$("a#deleteRule", _panel).click(function(){
		crushFTP.UI.removeItem($("#monitored_folders", _panel), panelFolderMonitor.bindFormDetails);
		itemsChanged(true);
		return false;
	});

	$("#delete",_panel).bind("change", function(){
		if($(this).is(":checked"))
		{
			$("p.zippath_panel", _panel).hide();
		}
		else
		{
			$("p.zippath_panel", _panel).show();
		}
		itemsChanged(true);
	});

	var formDetailsPanel  = $("#formDetailsPanel", _panel);
	formDetailsPanel.find("input, select, textarea").bind("change", function(){
		var item = monitored_folders.find("li.ui-widget-header");
		if(!item || item.length==0)return;
		var data = item.data("controlData");
		if(data)
		{
			var isBool = $(this).attr("type") == "radio" || $(this).attr("type") == "checkbox";
			data[$(this).attr("id")] = [{text: isBool ? $(this).is(":checked").toString() : $(this).val()}];
		}
		item.data("controlData", data);
	});

	formDetailsPanel.find("input[type='text'], textarea").bind("textchange", function(){
		var item = monitored_folders.find("li.ui-widget-header");
		if(!item || item.length==0)return;
		var data = item.data("controlData");
		if(data)
		{
			var isBool = $(this).attr("type") == "radio" || $(this).attr("type") == "checkbox";
			data[$(this).attr("id")] = [{text: isBool ? $(this).is(":checked").toString() : $(this).val()}];
		}
		item.data("controlData", data);
	});

	formDetailsPanel.find("#folderMonitorAction").change(function(){
		if($(this).val() && ($(this).val().indexOf("CrushTask")>=0 || $(this).val().indexOf("Job:")>=0))
		{
			$(".noForCrushTask", formDetailsPanel).hide();
		}
		else
		{
			$(".noForCrushTask", formDetailsPanel).show();
			formDetailsPanel.find("#delete").trigger("change");
		}
	});

	$("a.serverFilePickButton", _panel).each(function(){
		$(this).unbind("click").click(function(){
			var curElem = $(this);
            var rel = curElem.attr("rel");
            var pickingFor = curElem.parent().parent().parent().find("label[for='"+rel+"']").text() || "";
            pickingFor = $.trim($.trim(pickingFor).replace(":", ""));
			curElem.crushFtpLocalFileBrowserPopup({
				pickingFor: pickingFor,
				type : curElem.attr("PickType") || 'file',
				file_mode : curElem.attr("fileMode") || 'server',
				existingVal : $("#" + curElem.attr("rel"), _panel).val(),
				callback : function(selectedPath){
					$("#" + curElem.attr("rel"), _panel).val(selectedPath).trigger("change");
					var folderList = $("#monitored_folders", _panel);
					folderList.find("li.ui-widget-header").attr("folder", selectedPath).text(selectedPath);
				}
			});
			return false;
		});
	});
}

panelFolderMonitor.bindFormDetails = function(folderList)
{
	if(!folderList)
	{
		$("#formDetailsPanel", _panel).hide();
		return;
	}
	var controlData = $(folderList).data("controlData");
	var formDetailsPanel = $("#formDetailsPanel", _panel).show();
	if(controlData)
	{
		var hasChanged = placeHolder.data("hasChanged");
		var isAddedDefaults = false;
		if(typeof controlData.empty_count_files == "undefined")
		{
			controlData.empty_count_files = [{text:"true"}];
			isAddedDefaults = true;
		}
		if(typeof controlData.empty_count_folders == "undefined")
		{
			controlData.empty_count_folders = [{text:"false"}];
			isAddedDefaults = true;
		}

		var inputs = formDetailsPanel.find("input.ignoreBind,select.ignoreBind,textarea.ignoreBind").removeClass("ignoreBind");
		if(isAddedDefaults)
			inputs.removeClass("ignoreBind");
		bindValuesFromXML(formDetailsPanel, controlData);
		inputs.removeClass("ignoreBind");
		setTimeout(function(){
			formDetailsPanel.find("#folderMonitorAction").trigger("change");
			formDetailsPanel.find("#delete").trigger("change");
			if(!hasChanged)
				placeHolder.removeData("hasChanged");
		}, 100);
		formDetailsPanel.find("#delete").trigger("change");
		return;
	}
	else
	{
		$("#formDetailsPanel", _panel).hide();
		return;
	}
}

panelFolderMonitor.bindActions = function()
{
	var folderMonitorAction = $("#folderMonitorAction", _panel).empty();
	folderMonitorAction.append("<option value=\"Archive or Delete\">Archive Or Delete</option>");
	var crushTaskPlugins = common.data.getPluginPrefs("CrushTask");
	var pluginOpts = $('<optgroup label="Plugin"></optgroup>');
	for(var index=0; index<crushTaskPlugins.length;index++)
	{
		var curPlugin = crushTaskPlugins[index];
		if(curPlugin && curPlugin.subItem && curPlugin.subItem.length>0)
		{
			var tabName = curPlugin.subItem[0].text ? "CrushTask:" + curPlugin.subItem[0].text : "CrushTask";
			pluginOpts.append("<option value=\""+crushFTP.methods.textEncode(unescape(tabName))+"\">"+crushFTP.methods.textEncode(unescape(tabName))+"</option>");
		}
	}
	folderMonitorAction.append(pluginOpts);
	var availableJobs = $(document).data("AvailableJobsNoEvents");
	if(availableJobs && availableJobs.length>0)
	{
		var jobOpts = $('<optgroup label="Job"></optgroup>');
		for (var i = 0; i < availableJobs.length; i++) {
			jobOpts.append("<option value=\"Job:"+crushFTP.methods.textEncode(unescape(availableJobs[i]))+"\">"+crushFTP.methods.textEncode(unescape(availableJobs[i]))+"</option>");
		}
		folderMonitorAction.append(jobOpts);
	}

	/*var prefs = common.data.ServerPrefs();
	var schedules = prefs["schedules"];
	if(schedules && schedules.length>0 && schedules[0].schedules_subitem)
	{
		schedules = schedules[0].schedules_subitem;
		for(var index=0; index<schedules.length;index++)
		{
			try
			{
				var curJob = schedules[index];
				if(curJob.scheduleName)
				{
					var tabName = "Job:" + curJob.scheduleName[0].text;
					folderMonitorAction.append("<option value=\""+unescape(tabName)+"\">"+unescape(tabName)+"</option>");
				}
			}
			catch(ex){}
		}
	}*/
}

panelFolderMonitor.saveContent = function()
{
	if(placeHolder.data("hasChanged"))
	{
		crushFTP.UI.showIndicator(false, false, "Please wait..");
		var xmlString = [];
		var folderList = $("#monitored_folders", _panel).find("li");
		if(folderList.length>0)
		{
			xmlString.push("<monitored_folders type=\"vector\">");
			folderList.each(function(){
				xmlString.push("<monitored_folders_subitem type=\"properties\">");
				var controlData = $(this).data("controlData");
				for(var item in controlData)
				{
					if(controlData[item].length && item != "type")
					{
						if(typeof controlData[item][0].text != "undefined")
						{
							xmlString.push("<"+item+">"+crushFTP.methods.htmlEncode(controlData[item][0].text)+"</"+item+">");
						}
					}
				}
				xmlString.push("</monitored_folders_subitem>");
			});
			xmlString.push("</monitored_folders>");
		}
		var formSubItem = xmlString.join("\n");
		var action = "reset";
		if(xmlString.length==0)
			formSubItem = "<monitored_folders type=\"vector\"></monitored_folders>";
		crushFTP.data.setXMLPrefs("server_settings/monitored_folders/0"
			, "vector"
			, action
			, formSubItem
			, function(data){
				data = $.xml2json(data, true);
				if(data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK")
				{
					common.data.updateLocalPrefs(function(){
						crushFTP.UI.hideIndicator();
						crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
						panelFolderMonitor.bindData();
						setTimeout(function(){
							placeHolder.removeData("hasChanged");
						}, 200);
					});
				}
				else
				{
					crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
				}
			}
			, panelFolderMonitor.saveParams
		);
	}
	else
	{
		crushFTP.UI.growl("No changes made", "", false, 3000);
	}
}