/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelPreview = {};
panelPreview.localization = {};
/****************************/

// Panel details
var panelName = "Preview";
var _panel = $("#pnl" + panelName);

// Localizations
panelPreview.localization = {
	headerText : " ",
	lblEnabledText : "Enabled",
	lblDebugText : "Debug",
	lblGeneralTabText : "General",
	lblSizesTabText : "Sizes",
	lblConversionUtilityText : "Conversion utility presets: ",
	lblCautionText : "Caution : Changing these fields needs extreme caution as invalid arguments could result in data loss.",
	lblSupportedFileExtensionsText : "Supported file extensions: ",
	lblCommandLineText : "Command Line: ",
	lblWorkingDirectoryText : "Working Directory: ",
	btnFolderLocationBrowseText : "Browse",
	lblEnvironmentVariablesText : "Environment Variables: ",
	lblFramesText : "Frames : ",
	lblInfoCommandLineText : "Info command line: ",
	lblTimeoutText : "Timeout: ",
	lblScanSubDirText : "Scan subdirectories of directories in below list",
	lblDeleteThumbnailsForNonExistingFilesText : "Delete thumbnails for files that no longer exist.",
	lblScanIntervalInMinutesText : "Scan interval in minutes: ",
	lblThreadsText : "Threads :",
	lblMakeExifText : " Make exif files? (ImageMagick)",
	btnAddFolderText : "Add Folder",
	btnEditFolderText : "Edit Path",
	btnRemoveFolderText : "Remove Folder",
	btnAddText : "Add",
	btnRemoveText : "Remove",
	lblMaxWidthText : "Max Width: ",
	lblMaxHeightText : "Max Height: ",
	btnResetText : "Reset To Default",
	btnCancelText : "Cancel",
	btnOKText : "Save"
};

panelPreview.defaultConfig = {
	preview_command_line: [{text:""}],
	preview_conversion_threads: [{text:"1"}],
	preview_debug: [{text:"true"}],
	preview_enabled: [{text:"false"}],
	preview_environment: [{text:""}],
	preview_exif: [{text:"false"}],
	preview_file_extensions: [{text:""}],
	preview_folder_list: [{preview_folder_list_subitem:[]}],
	preview_frames: [{text:""}],
	preview_movie_info_command_line: [{text:""}],
	preview_reverseSubdirectories: [{text:""}],
	preview_scan_interval: [{text:"1"}],
	preview_sizes: [{preview_sizes_subitem:[{text:"80x80"},{text:"160x160"},{text:"800x800"}]}],
	preview_subdirectories: [{text:"true"}],
	preview_wait_timeout: [{text:"600"}],
	preview_working_dir: [{text:""}],
	preview_exif_get_command_line: [{text:"exiftool -S %src%"}],
	preview_exif_set_command_line: [{text:"exiftool -overwrite_original_in_place -%key%=%val% %src%"}]
};

// Assign localizations
localizations.panels[panelName] = $.extend(panelPreview.localization, localizations.panels[panelName]);

// Interface methods
panelPreview.init = function(isRefresh){
	applyLocalizations(panelName, localizations.panels);
	crushFTP.methods.setPageTitle(panelPreview.localization.Header, true);
	panelPreview.initLayout(isRefresh);
	panelPreview.bindData();
	panelPreview.bindPrefsData();
	panelPreview.bindEvents();
    setupPrefsReplicationSave(_panel, panelName);
}

panelPreview.initLayout = function(isRefresh)
{
	var prefs = $.extend(true, {}, common.data.ServerPrefs());
	var previewConfigs = prefs.preview_configs;
	delete panelPreview.configs;
	var totalSubItems = 0;
	if(previewConfigs && previewConfigs.length>0)
	{
		var subConfigs = previewConfigs[0];
		if(subConfigs && subConfigs.preview_configs_subitem)
		{
			subConfigs = subConfigs.preview_configs_subitem;
		}
		if(subConfigs && subConfigs.length>0)
		{
			panelPreview.configs = subConfigs;
		}
	}
	var conversionPresets = $("#drpConversionUtility", _panel);
	var machineInfo = $(document).data("server_info") || {};
	conversionPresets.empty().unbind("change");
	conversionPresets.append("<option selected=\"selected\"></option>");
	if (machineInfo.machine_is_x == "true")
	{
		conversionPresets.append("<option value=\"pcastaction\">OS X Movies - pcastaction</option>");
		conversionPresets.append("<option value=\"sips\">OS X Images - sips</option>");
	}
	conversionPresets.append("<option value=\"qlmanage\">OS X Everything - qlmanage</option>");
	conversionPresets.append("<option value=\"ImageMagick\">Any OS Images - ImageMagick (must be installed separately)</option>");
	conversionPresets.append("<option value=\"GraphicsMagick\">Any OS Images - GraphicsMagick (must be installed separately)</option>");
	conversionPresets.append("<option value=\"FFmpeg\">Any OS Movies - FFmpeg (must be installed separately)</option>");
	panelPreview.refreshTabs(false, false, isRefresh);
	_panel.data("totalPreviewConfigs", totalSubItems);
}

panelPreview.refreshTabs = function(configs, bindData, isRefresh)
{
	configs = configs || panelPreview.configs;
	var tabAnchors = false;
	var configsAvailable = configs && configs.length>0;
	var configPanel = $("#configTable", _panel);
	var removeConfigBtn = $("#removeConfig", _panel);
	if(configsAvailable)
	{
		totalSubItems = configs.length;
		configPanel.find("div#configSetup").show();
		if($("div.previewSettingsContainer",_panel).length==0)
		{
			configPanel.wrap("<div class=\"ui-widget-content previewSettingsContainer\"></div>");
			configPanel.before("<div class='subConfigTabHandler ui-corner-all ui-widget-header'></div>");
		}
		tabAnchors = configPanel.prev().empty();
		for(var index=0; index<configs.length;index++)
		{
			var curConfig = configs[index];
			var container = configPanel;
			if(configsAvailable)
			{
				var tabName = index + 1;
				tabAnchors.append("<button pluginIndex=\""+index+"\">"+crushFTP.methods.htmlEncode(tabName)+"</button>");
			}
		}
		tabAnchors.find("button").button().click(function(){
			var btn = $(this);
			if(btn.find(".ui-state-active").length>0)return false;
			panelPreview.bindData(btn.attr("pluginIndex"));
			tabAnchors.find(".ui-state-active").removeClass("ui-state-active");
			btn.find("span").addClass("ui-state-active");
			btn.blur();
		});
		if(panelPreview.currentConfigIndex && panelPreview.currentConfigIndex>0)
		{
			var index = parseInt(panelPreview.currentConfigIndex) + 1;
			var btn = tabAnchors.find("button:nth-child("+index+")").addClass("ui-state-active");
			if(isRefresh)
			{
				crushFTP.UI.showIndicator(false, false, "Please wait..");
				setTimeout(function(){
					btn.trigger("click");
					crushFTP.UI.hideIndicator();
				}, 200);
			}
		}
		else
		{
			tabAnchors.find("button:first").addClass("ui-state-active");
		}
		if(bindData && !isRefresh)
		{
			panelPreview.bindData(panelPreview.currentConfigIndex);
		}
		if(totalSubItems>1)
		{
			tabAnchors.show();
			removeConfigBtn.show();
		}
		else
		{
			tabAnchors.hide();
			removeConfigBtn.hide();
		}
	}
	else
	{
		configPanel.find("div#configSetup").hide();
	}
}

panelPreview.bindPrefsData = function()
{
	var prefs = common.data.ServerPrefs();
	bindValuesFromXML(_panel.find("#previewPrefs"), prefs);
}

panelPreview.bindData = function(index)
{
	var subConfigs = panelPreview.configs;
	if(subConfigs && subConfigs.length>0)
	{
		index = index || 0;
		panelPreview.currentConfigIndex = index;
		var prefs = subConfigs[index];
		var configTable = _panel.find("#configTable");
		bindValuesFromXML(configTable, prefs);
		configTable.find("input").removeData("lastValue");
		var nameList = $("#preview_folder_list", _panel).empty();
		if(prefs["preview_folder_list"])
		{
			var preview_folder_list = prefs["preview_folder_list"];
			if(preview_folder_list.length>0)
			{
				preview_folder_list = preview_folder_list[0]["preview_folder_list_subitem"];
				if(preview_folder_list)
				{
					for(var i=0;i<preview_folder_list.length;i++)
					{
						var curItem = preview_folder_list[i];
						if(preview_folder_list[i].preview_folder_list_subitem_subitem){
							var tempItem = preview_folder_list[i].preview_folder_list_subitem_subitem[0];
							curItem = {};
							for(var _item in tempItem){
								curItem[_item] = tempItem[_item][0].text;
							}
						}
						if(curItem && curItem.text && curItem.text != "null")
						{
							var name = curItem.text;
							var newControl = $("<li class='ui-widget-content'>"+crushFTP.methods.htmlEncode(unescape(name))+"</li>");
							nameList.append(newControl);
							newControl.data("controlData", curItem);
						}
					}
				}
			}
		}
		panelPreview.resetURIs();
		var sizeList = $("#preview_sizes", _panel).empty();
		if(prefs["preview_sizes"])
		{
			var preview_sizes = prefs["preview_sizes"];
			if(preview_sizes.length>0)
			{
				preview_sizes = preview_sizes[0]["preview_sizes_subitem"];
				for(var i=0;i<preview_sizes.length;i++)
				{
					var curItem = preview_sizes[i];
					if(curItem && curItem.text)
					{
						var name = curItem.text;
						var newControl = $("<li class='ui-widget-content'>"+crushFTP.methods.htmlEncode(unescape(name))+"</li>");
						sizeList.append(newControl);
						newControl.data("controlData", curItem);
					}
				}
			}
		}
	}
}

panelPreview.resetURIs = function() {
	$("#preview_folder_list", _panel).find("li").each(function(){
		var text = $(this).text();
		try{
			var url = URI(text);
			var pass = url.password();
			if(url && pass)
			{
				var mask = new Array(pass.length+1).join('*');
				url.password(mask);
				$(this).html(unescape(url.toString()));
			}
		}catch(ex){}
	});
};

panelPreview.bindEvents = function()
{
	var preview_folder_list = $("#preview_folder_list", _panel);
	preview_folder_list.selectable({
		selected: function(event, ui) {
			var selected = $(ui.selected);
			selected.parent().find(".ui-widget-header").removeClass("ui-widget-header");
			selected.addClass("ui-widget-header");
			return false;
		}
	});

	preview_folder_list.bind("dblclick", function(evt){
		if($(evt.target).is("li")){
			$("a#editFolder", _panel).trigger("click");
		}
	});

	var preview_sizes_list = $("#preview_sizes", _panel);
	preview_sizes_list.selectable({
		selected: function(event, ui) {
			var selected = $(ui.selected);
			selected.parent().find(".ui-widget-header").removeClass("ui-widget-header");
			selected.addClass("ui-widget-header");
			panelPreview.bindSizeDetails(selected);
			return false;
		}
	});

	$("a#addConfig", _panel).unbind().click(function(evt, control){
		if(!panelPreview.configs)
		{
			panelPreview.configs = [];
		}
		var config = $.extend(true, {}, panelPreview.defaultConfig);
		if(typeof panelPreview.currentConfigIndex != "undefined")
		{
			if(panelPreview.configs[panelPreview.currentConfigIndex])
				config = $.extend(true, {}, panelPreview.configs[panelPreview.currentConfigIndex]);
		}
		panelPreview.configs.push(config);
		panelPreview.currentConfigIndex = panelPreview.configs.length - 1;
		panelPreview.refreshTabs(panelPreview.configs, true);
		itemsChanged(true);
		return false;
	});

	$("a#removeConfig", _panel).unbind().click(function(evt, control){
		if(panelPreview.configs)
		{
			jConfirm("Are you sure you wish to remove this config?", "Confirm", function(value){
				if(value)
				{
					panelPreview.configs.remove(parseInt(panelPreview.currentConfigIndex));
					if(panelPreview.currentConfigIndex>0)
						panelPreview.currentConfigIndex= parseInt(panelPreview.currentConfigIndex) - 1;
					panelPreview.refreshTabs(panelPreview.configs, true);
					itemsChanged(true);
				}
			});
		}
		return false;
	});

	$("a#addFolder", _panel).unbind().click(function(evt, control){
		var labelName =  "";
		if(control)
		{
			labelName = control.text;
		}
		var curElem = $(this);
		var note = false;
		if(labelName.length>0)
		{
			var text = labelName;
			try{
				var url = URI(text);
				var pass = url.password();
				if(url && pass)
				{
					var mask = new Array(pass.length+1).join('*');
					url.password(mask);
					text = unescape(url.toString());
				}
			}catch(ex){}
			note = "Current selected directory : " + text;
		}
		var advancedBrowse = evt.shiftKey || evt.altKey || evt.metaKey || (control && control.url);
		var defaultValues = {
	        multiThreaded: "false",
	        retry: "0",
	        retry_delay: "1",
	        ssh_private_key: "",
	        ssh_private_key_pass: "",
	        ssh_two_factor: "false",
	        timeout: "20000",
	        write_timeout: "20000",
	        read_timeout: "20000",
	        onedriveTenant: "common",
	        sharepoint_site_drive_name: "Documents",
	        one_drive_conflict_behaviour: "replace",
	        s3_max_buffer_download: "100",
	        s3_buffer: "5",
	        s3_buffer_download: "5",
	        s3_acl: "private",
	        s3_storage_class: "STANDARD",
	        s3_threads_upload: "3",
	        s3_threads_download: "3",
	        s3_meta_md5_and_upload_by: "true",
	        ascii: "false",
	        threads: "1",
	        pasv: "true",
	        resume: "false",
	        resume_failure: "false",
	        ascii_convert: "none",
	        simple: "false",
	        keystore: "",
	        keystore_pass: "",
	        key_pass: "",
	        copyUnique: "false",
	        secure: "false",
	        send_compressed: "false",
	        receive_compressed: "false",
	        add_cache : "false",
	        process_first : "false",
	        block_overwrite_pattern : "",
	        append : "false",
	        validate_size : "false",
	        encryption_cypher: "CAST5",
	        box_store_jwt_json: "true",
	        block_blob_upload_buffer_size: "4",
	        block_blob_upload_threads: "3"
		};
		curElem.crushFtpLocalFileBrowserPopup({
			type : curElem.attr("PickType") || 'dir',
			file_mode : advancedBrowse ? "server" : curElem.attr("FileMode") || 'server',
			note : note,
			existingData : control || defaultValues,
			// isServerBrowse : true,
			existingVal : "/",
			allowRootSelection : advancedBrowse,
			isFTPBrowse : advancedBrowse,
			callback : function(selectedPath, ftpServerInfo){
				ftpServerInfo = ftpServerInfo || {};
				if(advancedBrowse)
				{
					selectedPath = ftpServerInfo.url;
				}
				ftpServerInfo.text = selectedPath;
				var lowCaseURL = ftpServerInfo.url ? ftpServerInfo.url.toLowerCase() : '';
				if(lowCaseURL && (lowCaseURL.indexOf("s3") == 0 || lowCaseURL.indexOf("s3crush") == 0))
                {
                    if(typeof ftpServerInfo.random_id == "undefined")
                    {
                        ftpServerInfo.random_id = true;
                    }
                    if(!ftpServerInfo.timeout || typeof ftpServerInfo.timeout == "undefined")
                    {
                        ftpServerInfo.timeout = "20000";
                    }
                    if(!ftpServerInfo.write_timeout || typeof ftpServerInfo.write_timeout == "undefined")
                    {
                        ftpServerInfo.write_timeout = "20000";
                    }
                    if(!ftpServerInfo.read_timeout || typeof ftpServerInfo.read_timeout == "undefined")
                    {
                        ftpServerInfo.read_timeout = "20000";
                    }
                    if(typeof ftpServerInfo.multithreaded_s3 == "undefined")
                    {
                        ftpServerInfo.multithreaded_s3 = false;
                    }
                    if(typeof ftpServerInfo.multithreaded_s3_download == "undefined")
                    {
                        ftpServerInfo.multithreaded_s3_download = ftpServerInfo.multithreaded_s3 || false;
                    }
                    if(typeof ftpServerInfo.s3_stat_head_calls == "undefined")
                    {
                        ftpServerInfo.s3_stat_head_calls = true;
                    }
                    if(!ftpServerInfo.sharepoint_site_drive_name || typeof ftpServerInfo.sharepoint_site_drive_name == "undefined")
		            {
		                ftpServerInfo.sharepoint_site_drive_name = "Documents";
		            }
                }
				if(control)
				{
					var elem = preview_folder_list.find("li.ui-selected");
					elem.text(selectedPath).data("controlData", ftpServerInfo);
					var subConfigs = panelPreview.configs;
					if(subConfigs && subConfigs.length>panelPreview.currentConfigIndex)
					{
						var curItem = subConfigs[panelPreview.currentConfigIndex];
						var folderList = curItem.preview_folder_list[0].preview_folder_list_subitem;
						folderList[elem.index()] = ftpServerInfo;
					}
					panelPreview.resetURIs();
				}
				else
				{
					crushFTP.UI.addItem($("#preview_folder_list", _panel)
						, $("<li class='ui-widget-content'>"+crushFTP.methods.htmlEncode(unescape(selectedPath))+"</li>")
						, ftpServerInfo
					);
					panelPreview.resetURIs();
					var subConfigs = panelPreview.configs;
					if(subConfigs && subConfigs.length>panelPreview.currentConfigIndex)
					{
						var curItem = subConfigs[panelPreview.currentConfigIndex];
						if(!curItem.preview_folder_list || curItem.preview_folder_list[0] == "")
						{
							curItem.preview_folder_list = [{
								preview_folder_list_subitem : []
							}];
						}
						if(!curItem.preview_folder_list[0].preview_folder_list_subitem)
						{
							curItem.preview_folder_list[0].preview_folder_list_subitem = [];
						}
						var folderList = curItem.preview_folder_list[0].preview_folder_list_subitem;
						folderList.push(ftpServerInfo);
					}
				}
				itemsChanged(true);
			}
		});
		return false;
	});

	$("a#editFolder", _panel).unbind().click(function(){
		if(preview_folder_list.find("li.ui-selected").length>0)
		{
			var selected = preview_folder_list.find("li.ui-selected");
			var controlData = selected.data("controlData");
			if(controlData)
			{
				// $("a#addFolder", _panel).trigger("click", [controlData, selected]);
				var labelName = controlData.text;
				jPrompt("Enter folder name: ", labelName, "Enter path", function(_val){
					if(_val && _val.length>0)
					{
						if(controlData)
						{
							selected.text(_val).data("controlData", {
								"text":_val
							});

							var subConfigs = panelPreview.configs;
							if(subConfigs && subConfigs.length>panelPreview.currentConfigIndex)
							{
								var curItem = subConfigs[panelPreview.currentConfigIndex];
								if(!curItem.preview_folder_list)
								{
									curItem.preview_folder_list = [{
										preview_folder_list_subitem : []
									}];
								}
								else if(!curItem.preview_folder_list[0].preview_folder_list_subitem)
								{
									curItem.preview_folder_list[0].preview_folder_list_subitem = [];
								}
								var folderList = curItem.preview_folder_list[0].preview_folder_list_subitem;
								if(folderList)
								{
									for(var i=0;i<folderList.length;i++)
									{
										var _curItem = folderList[i];
										if(_curItem && _curItem.text && _curItem.text == labelName)
										{
											_curItem.text = _val;
										}
										else if(_curItem.preview_folder_list_subitem_subitem){
											var url = _curItem.preview_folder_list_subitem_subitem[0].text[0].text;
											if(url == labelName)
											{
												_curItem.preview_folder_list_subitem_subitem[0].url[0].text = _val;
												_curItem.preview_folder_list_subitem_subitem[0].text[0].text = _val;
											}
										}
									}
								}
							}
							panelPreview.resetURIs();
							itemsChanged(true);
						}
					}
				});
			}
		}
		return false;
	});

	$("a#removeFolder", _panel).unbind().click(function(){
		var selected = preview_folder_list.find("li.ui-selected");
		var controlData = selected.data("controlData");
		if(controlData)
		{
			var labelName = controlData.text;
			crushFTP.UI.removeItem($("#preview_folder_list", _panel), function(){
				var subConfigs = panelPreview.configs;
				if(subConfigs && subConfigs.length>panelPreview.currentConfigIndex)
				{
					var curItem = subConfigs[panelPreview.currentConfigIndex];
					if(!curItem.preview_folder_list)
					{
						curItem.preview_folder_list = [{
							preview_folder_list_subitem : []
						}];
					}
					else if(!curItem.preview_folder_list[0].preview_folder_list_subitem)
					{
						curItem.preview_folder_list[0].preview_folder_list_subitem = [];
					}
					var folderList = curItem.preview_folder_list[0].preview_folder_list_subitem;
					if(folderList)
					{
						var newList = [];
						for(var i=0;i<folderList.length;i++)
						{
							var _curItem = folderList[i];
							if(_curItem && _curItem.text && _curItem.text != labelName)
							{
								newList.push(_curItem);
							}
						}
						folderList = newList;
						subConfigs[panelPreview.currentConfigIndex].preview_folder_list[0].preview_folder_list_subitem = newList;
					}
				}
				itemsChanged(true);
			});
		}
		return false;
	});

	$("a#addSize", _panel).unbind().click(function(){
		crushFTP.UI.addItem(preview_sizes_list
			, $("<li class='ui-widget-content'>200x200</li>")
			,{
				"text":"200x200"
			});
		var subConfigs = panelPreview.configs;
		if(subConfigs && subConfigs.length>panelPreview.currentConfigIndex)
		{
			var curItem = subConfigs[panelPreview.currentConfigIndex];
			if(!curItem.preview_sizes)
			{
				curItem.preview_sizes = [{
					preview_sizes_subitem : []
				}];
			}
			else if(!curItem.preview_sizes[0].preview_sizes_subitem)
			{
				curItem.preview_sizes[0].preview_sizes_subitem = [];
			}
			var sizeList = curItem.preview_sizes[0].preview_sizes_subitem;
			sizeList.push({
				"text":"200x200"
			});
		}
		panelPreview.bindSizeDetails(preview_sizes_list.find(".ui-selected"));
		itemsChanged(true);
		return false;
	});

	$("a#removeSize", _panel).unbind().click(function(){
		var selected = preview_sizes_list.find("li.ui-selected");
		var controlData = selected.data("controlData");
		if(controlData)
		{
			var labelName = controlData.text;
			crushFTP.UI.removeItem(preview_sizes_list, function(){
				var subConfigs = panelPreview.configs;
				if(subConfigs && subConfigs.length>panelPreview.currentConfigIndex)
				{
					var curItem = subConfigs[panelPreview.currentConfigIndex];
					if(!curItem.preview_sizes)
					{
						curItem.preview_sizes = [{
							preview_sizes_subitem : []
						}];
					}
					else if(!curItem.preview_sizes[0].preview_sizes_subitem)
					{
						curItem.preview_sizes[0].preview_sizes_subitem = [];
					}
					var sizeList = curItem.preview_sizes[0].preview_sizes_subitem;
					if(sizeList)
					{
						var newList = [];
						for(var i=0;i<sizeList.length;i++)
						{
							var curItem = sizeList[i];
							if(curItem && curItem.text && curItem.text != labelName)
							{
								newList.push(curItem);
							}
						}
						sizeList = newList;
						subConfigs[panelPreview.currentConfigIndex].preview_sizes[0].preview_sizes_subitem = newList;
					}
				}
				itemsChanged(true);
			});
		}
		return false;
	});

	var previewSizesPanel = $("#PreviewSizes", _panel);
	previewSizesPanel.find("input").bind("textchange", function(){
		var item = preview_sizes_list.find("li.ui-widget-header");
		if(!item || item.length==0)return;
		var index = item.index();
		var controlData = item.data("controlData");
		if(controlData)
		{
			var labelName = controlData.text;
			var val = $("#preview_max_width", previewSizesPanel).val() + "x" + $("#preview_max_height", previewSizesPanel).val();
			controlData = {text: val};
			item.text(val);
			var subConfigs = panelPreview.configs;
			if(subConfigs && subConfigs.length>panelPreview.currentConfigIndex)
			{
				var curItem = subConfigs[panelPreview.currentConfigIndex];
				if(!curItem.preview_sizes)
				{
					curItem.preview_sizes = [{
						preview_sizes_subitem : []
					}];
				}
				else if(!curItem.preview_sizes[0].preview_sizes_subitem)
				{
					curItem.preview_sizes[0].preview_sizes_subitem = [];
				}
				var preivewSizeList = curItem.preview_sizes[0].preview_sizes_subitem;
				if(preivewSizeList && typeof preivewSizeList[index] != "undefined")
					preivewSizeList[index].text = val;
			}
		}
		item.data("controlData", controlData);
		itemsChanged(true);
	});

	$("#preview_conversion_threads", _panel).blur(function(){
		if($.trim($(this).val()) == "")
		{
			$(this).val(1).trigger("textchange");
		}
	});

	$("a.serverFilePickButton", _panel).each(function(){
		$(this).unbind("click").click(function(){
			var curElem = $(this);
            var rel = curElem.attr("rel");
            var pickingFor = curElem.parent().parent().parent().find("label[for='"+rel+"']").text() || "";
            pickingFor = $.trim($.trim(pickingFor).replace(":", ""));
			curElem.crushFtpLocalFileBrowserPopup({
				type : curElem.attr("PickType") || 'dir',
				pickingFor: pickingFor,
				file_mode : curElem.attr("FileMode") || 'server',
				existingVal : $("#" + curElem.attr("rel"), _panel).val(),
				callback : function(selectedPath){
					var input = $("#" + curElem.attr("rel"), _panel).val(selectedPath).trigger("textchange");
					if(input.is("#previews_path"))
					{
						selectedPath = selectedPath.replace(/\\/g,'/');
                        selectedPath = selectedPath.replace(/\/\//g,'/');
						if(selectedPath.indexOf("/")!=0)
							selectedPath = "/" + selectedPath;
						if(selectedPath.lastIndexOf("/") != selectedPath.length - 1)
                        {
                            selectedPath = selectedPath + "/";
                        }
                        input.val(selectedPath).trigger("textchange");
					}
				}
			});
			return false;
		});
	});

	function updateStorageValue(key, val)
	{
		var subConfigs = panelPreview.configs;
		if(subConfigs && subConfigs.length>parseInt(panelPreview.currentConfigIndex))
		{
			var curItem = subConfigs[panelPreview.currentConfigIndex];
			curItem[key] = [{text : val}];
		}
	}

	$("#drpConversionUtility", _panel).bind("change", function(){
		var val = $(this).val();
		var configSetup = $("#configSetup", _panel);
		var machineInfo = $(document).data("server_info") || {};
		if(val == "pcastaction")
		{
			$("#preview_conversion_threads", configSetup).val("1").trigger("textchange");
			$("#preview_working_dir", configSetup).val("./").trigger("textchange");
			$("#preview_environment", configSetup).val("PATH=/opt/local/bin:/opt/local/sbin:/opt/local/bin:/opt/local/sbin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/local/git/bin:/usr/X11/bin").trigger("textchange");
			$("#preview_command_line", configSetup).val("./pcastaction_wrapper.sh %previews% %previews%temp/%random%/ %src% %dst% %time% %width%").trigger("textchange");
			$("#preview_file_extensions", configSetup).val(".m4v, .mp4, .mpeg, .mov, .avi, .h264").trigger("textchange");
			$("#preview_frames", configSetup).val("20").trigger("textchange");
			$("#preview_movie_info_command_line", configSetup).val("pcastaction qtinfo --key=duration --prb=%previews% --input=%src%").trigger("textchange");
		}
		else if(val == "qlmanage")
		{
			$("#preview_conversion_threads", configSetup).val("1").trigger("textchange");
			$("#preview_working_dir", configSetup).val("./").trigger("textchange");
			$("#preview_environment", configSetup).val("PATH=/opt/local/bin:/opt/local/sbin:/opt/local/bin:/opt/local/sbin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/local/git/bin:/usr/X11/bin").trigger("textchange");
			$("#preview_command_line", configSetup).val("./qlmanage_wrapper.sh %width% %previews%temp/%random%/ %src% %dst%").trigger("textchange");
			$("#preview_file_extensions", configSetup).val(".jpg, .jpeg, .gif, .png, .bmp, .pdf, .psd, .tif, .tiff, .zip, *.txt, *.rtf, *.doc, *.docx, *.xls, *.xlsx, *.pdf, *.eps, *.ai, *.bmp, *.ppt").trigger("textchange");
			$("#preview_frames", configSetup).val("1").trigger("textchange");
			$("#preview_movie_info_command_line", configSetup).val("").trigger("textchange");
		}
		else if(val == "sips")
		{
			$("#preview_conversion_threads", configSetup).val("1").trigger("textchange");
			$("#preview_working_dir", configSetup).val("").trigger("textchange");
			$("#preview_environment", configSetup).val("").trigger("textchange");
			$("#preview_command_line", configSetup).val("sips -Z %width% -s format jpeg %src% -m /System/Library/ColorSync/Profiles/Generic\\ RGB\\ Profile.icc --out %dst%").trigger("textchange");
			$("#preview_file_extensions", configSetup).val(".jpg, .jpeg, .gif, .png, .bmp, .pdf, .psd, .tif, .tiff, .zip").trigger("textchange");
			$("#preview_frames", configSetup).val("1").trigger("textchange");
			$("#preview_movie_info_command_line", configSetup).val("").trigger("textchange");
		}
		else if(val == "ImageMagick")
		{
			if (machineInfo.machine_is_windows == "true")
			{
				$("#preview_conversion_threads", configSetup).val("1").trigger("textchange");
				$("#preview_working_dir", configSetup).val("C:\\Program Files\\ImageMagick-6.5.0-Q16\\").trigger("textchange");
				$("#preview_environment", configSetup).val("MAGICK_HOME=./;DYLD_LIBRARY_PATH=./lib").trigger("textchange");
				$("#preview_command_line", configSetup).val("magick.exe convert -colorspace RGB -alpha off  -strip -geometry %width%x%width% -quality 75 %src%[0] %dst%").trigger("textchange");
				$("#preview_frames", configSetup).val("1").trigger("textchange");
				$("#preview_movie_info_command_line", configSetup).val("").trigger("textchange");
			}
			else
			{
				$("#preview_conversion_threads", configSetup).val("1").trigger("textchange");
				$("#preview_working_dir", configSetup).val("/opt/local/bin/").trigger("textchange");
				$("#preview_environment", configSetup).val("PATH=/opt/local/bin:/opt/local/sbin:/opt/local/bin:/opt/local/sbin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/local/git/bin:/usr/X11/bin").trigger("textchange");
				$("#preview_command_line", configSetup).val("./convert -colorspace RGB -alpha off -strip -geometry %width%x%width% -quality 75 %src%[0] %dst%").trigger("textchange");
				$("#preview_frames", configSetup).val("1").trigger("textchange");
				$("#preview_movie_info_command_line", configSetup).val("").trigger("textchange");
			}
			$("#preview_file_extensions", configSetup).val(".jpg, .jpeg, .gif, .png, .bmp, .ai, .pdf, .psd, .tif, .tiff, .cr2, .dng, .crw, .dcr, .mrw, .nef, .orf, .pef, .srf, .eps").trigger("textchange");
		}
		else if(val == "GraphicsMagick")
		{
			if (machineInfo.machine_is_windows == "true")
			{
				$("#preview_conversion_threads", configSetup).val("1").trigger("textchange");
				$("#preview_working_dir", configSetup).val("C:\\Program Files\\GraphicsMagick\\").trigger("textchange");
				$("#preview_environment", configSetup).val("MAGICK_HOME=./;DYLD_LIBRARY_PATH=./lib").trigger("textchange");
				$("#preview_command_line", configSetup).val("gm.exe convert %src%[0] -resize %width%x%width% -background white -flatten -quality 75 %dst%").trigger("textchange");
				$("#preview_frames", configSetup).val("1").trigger("textchange");
				$("#preview_movie_info_command_line", configSetup).val("").trigger("textchange");
			}
			else
			{
				$("#preview_conversion_threads", configSetup).val("1").trigger("textchange");
				$("#preview_working_dir", configSetup).val("/opt/local/bin/").trigger("textchange");
				$("#preview_environment", configSetup).val("PATH=/opt/local/bin:/opt/local/sbin:/opt/local/bin:/opt/local/sbin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/local/git/bin:/usr/X11/bin").trigger("textchange");
				$("#preview_command_line", configSetup).val("./gm convert %src%[0] -resize %width%x%width% -background white -flatten -quality 75 %dst%").trigger("textchange");
				$("#preview_frames", configSetup).val("1").trigger("textchange");
				$("#preview_movie_info_command_line", configSetup).val("").trigger("textchange");
			}
			$("#preview_file_extensions", configSetup).val(".jpg, .jpeg, .gif, .png, .bmp, .ai, .pdf, .psd, .tif, .tiff, .cr2, .dng, .crw, .dcr, .mrw, .nef, .orf, .pef, .srf, .eps").trigger("textchange");
		}
		else if(val == "FFmpeg")
		{
			if (machineInfo.machine_is_windows == "true")
			{
				$("#preview_conversion_threads", configSetup).val("1").trigger("textchange");
				$("#preview_working_dir", configSetup).val("C:\\Program Files\\FFMpeg\\").trigger("textchange");
				$("#preview_environment", configSetup).val("").trigger("textchange");
				$("#preview_command_line", configSetup).val("ffmpeg.exe -ss %time% -i %src% -vcodec mjpeg -vframes 1 -an -f m4v %dst% -y").trigger("textchange");
				$("#preview_frames", configSetup).val("10").trigger("textchange");
				$("#preview_movie_info_command_line", configSetup).val("ffmpeg.exe -i %src%").trigger("textchange");
			}
			else
			{
				$("#preview_conversion_threads", configSetup).val("1").trigger("textchange");
				$("#preview_working_dir", configSetup).val("/usr/bin/").trigger("textchange");
				$("#preview_environment", configSetup).val("PATH=/opt/local/bin:/opt/local/sbin:/opt/local/bin:/opt/local/sbin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/local/git/bin:/usr/X11/bin").trigger("textchange");
				$("#preview_command_line", configSetup).val("./ffmpeg -ss %time% -i %src% -vcodec mjpeg -vframes 1 -an -f m4v %dst% -y").trigger("textchange");
				$("#preview_frames", configSetup).val("10").trigger("textchange");
				$("#preview_movie_info_command_line", configSetup).val("./ffmpeg -i %src%").trigger("textchange");
			}
			$("#preview_file_extensions", configSetup).val(".m4v, .mp4").trigger("textchange");
		}
		$("#preview_exif_get_command_line", configSetup).val("exiftool -S %src%").trigger("textchange");
		$("#preview_exif_set_command_line", configSetup).val("exiftool -overwrite_original_in_place -%key%=%val% %src%").trigger("textchange");
		itemsChanged(true);
	});

	var configTable = _panel.find("#configTable");
	configTable.find("select").bind("change", function(){
		if($(this).hasClass("excludeXML"))return;
		updateStorageValue($(this).attr("id"), $(this).val())
		itemsChanged(true);
	});

	configTable.find("input[type='checkbox']").bind("change", function(){
		if($(this).hasClass("excludeXML"))return;
		updateStorageValue($(this).attr("id"), $(this).is(":checked").toString())
		itemsChanged(true);
	});

	configTable.find("input[type='text'], textarea").bind("textchange", function(){
		if($(this).hasClass("excludeXML"))return;
		updateStorageValue($(this).attr("id"), $(this).val())
		itemsChanged(true);
	});

	_panel.find("input#previews_path").bind("textchange", function(){
		$(this).removeClass("ui-state-error");
		if($(this).hasClass("excludeXML"))return;
		$(this).attr("isChanged", "yes");
		if($(this).val()=="")
		{
			$(this).addClass("ui-state-error");
		}
		itemsChanged(true);
	});

	$("#logFrameOverlay").click(function(event){
    	if(event.ctrlKey || event.metaKey || event.altKey || event.shiftKey)
    	{
    		window.open("../admin/log.html?filter=PREVIEW|", "_blank");
    		return false;
    	}
    	var that = $(this);
    	crushFTP.UI.showIndicator();
    	$("#serverLoggingFrame").attr("src", "../admin/log.html?filter=PREVIEW|&embed=true").bind("load", function(){
    		$("#serverLoggingFrame").unbind("load").contents().find("#openInNewWindow").bind("click.action" ,function(){
    			panelPreview.unloadServerLog();
    			window.open("../admin/log.html?filter=PREVIEW|", "_blank");
    			return false;
    		});
    		that.hide();
    		crushFTP.UI.hideIndicator();
    	});
    });
    $("#logFrameOverlay").find(".newWindow").click(function(e){
    	e.preventDefault();
    	e.stopPropagation();
    	window.open("../admin/log.html?filter=PREVIEW|", "_blank");
    });
}

panelPreview.unloadServerLog = function(){
	$("#serverLoggingFrame").attr("src", "about:blank");
	$("#logFrameOverlay").show();
};

panelPreview.bindSizeDetails = function(selected)
{
	if(!selected)return;
	var size = selected.data("controlData");
	size = size.text.split("x");
	if(size.length>0)
	{
		$("#preview_max_width", _panel).val(size[0]);
		$("#preview_max_height", _panel).val(size[1]);
	}
}

panelPreview.saveContent = function()
{
	if(placeHolder.data("hasChanged"))
	{
		var subConfigs = panelPreview.configs;
		var xml = [];
		xml.push("<preview_configs type=\"vector\">");
		if(subConfigs && subConfigs.length>0)
		{
			for(var i=0;i<subConfigs.length;i++)
			{
				xml.push("<preview_configs_subitem type=\"properties\">");
				var curConfig = subConfigs[i];
				for(var item in curConfig)
				{
					if(item != "type")
					{
						if(item == "preview_folder_list")
						{
							xml.push("<preview_folder_list type=\"vector\">");
							var curList = curConfig[item][0].preview_folder_list_subitem;
							var hasItem = false;
							if(curList)
							{
								for(var j=0;j<curList.length;j++)
								{
									if(curList[j].url && curList[j].url != "null")
									{
										var curItem = curList[j];
										xml.push("<preview_folder_list_subitem type=\"vector\"><preview_folder_list_subitem_subitem type=\"properties\">");
										for(var _item in curItem){
											var _val = curItem[_item] || "";
											xml.push("<"+_item+">" + crushFTP.methods.htmlEncode(_val) + "</"+_item+">");
										}
										xml.push("</preview_folder_list_subitem_subitem></preview_folder_list_subitem>");
										hasItem = true;
									}
									else if(curList[j].preview_folder_list_subitem_subitem){
										var tempItem = curList[j].preview_folder_list_subitem_subitem[0];
										xml.push("<preview_folder_list_subitem type=\"vector\"><preview_folder_list_subitem_subitem type=\"properties\">");
										for(var _item in tempItem){
											var _val = tempItem[_item][0].text || "";
											xml.push("<"+_item+">" + crushFTP.methods.htmlEncode(_val)  + "</"+_item+">");
										}
										xml.push("</preview_folder_list_subitem_subitem></preview_folder_list_subitem>");
										hasItem = true;
									}
									else{
										xml.push("<preview_folder_list_subitem>" + crushFTP.methods.htmlEncode(curList[j].text) + "</preview_folder_list_subitem>");
										hasItem = true;
									}
								}
							}
							if(!hasItem)
							{
								xml.push("<preview_folder_list_subitem>null</preview_folder_list_subitem>");
							}
							xml.push("</preview_folder_list>");
						}
						else if(item == "preview_sizes")
						{
							xml.push("<preview_sizes type=\"vector\">");
							var curList = curConfig[item][0].preview_sizes_subitem;
							if(curList)
							{
								for(var j=0;j<curList.length;j++)
								{
									if(curList[j].text)
										xml.push("<preview_sizes_subitem>" + crushFTP.methods.htmlEncode(curList[j].text) + "</preview_sizes_subitem>");
								}
							}
							xml.push("</preview_sizes>");
						}
						else
						{
							if(curConfig[item] && curConfig[item].length>0)
							{
								var text = curConfig[item][0].text || "";
								if(item == "preview_conversion_threads" && text == "")
									text = 1;
								xml.push("<"+item+">" + crushFTP.methods.htmlEncode(text) + "</"+item+">");
							}
						}
					}
				}
				xml.push("</preview_configs_subitem>");
			}
		}
		xml.push("</preview_configs>");
		var xmlData = '<server_prefs type="properties">'+xml.join("\r\n")+'</server_prefs>';
		crushFTP.UI.showIndicator(false, false, "Please wait..");
		crushFTP.data.setXMLPrefs("server_settings/server_prefs/", "properties", "update", xmlData, function(data){
			data = $.xml2json(data, true);
			if(data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK")
			{
				var previews_path = _panel.find("input#previews_path");
				var savePreviewPath = false;
				if(previews_path.attr("isChanged") == "yes")
				{
					if(previews_path.val().length>0)
						savePreviewPath=true;
					else
					{
						crushFTP.UI.growl("Previews Path Invalid", "Provided Preview path was invalid, reverted back to previous value", true, 3000);
						var server_prefs = common.data.ServerPrefs();
						if(typeof server_prefs.previews_path != "undefined")
						{
							previews_path.val(server_prefs.previews_path[0].text).trigger("textchange");
							previews_path.removeAttr("isChanged");
						}
					}
				}
				//if(savePreviewPath)
				{
					var xmlPreviewPathData = '<server_prefs type="properties"><previews_path>'+crushFTP.methods.htmlEncode(previews_path.val())+'</previews_path><zip_icon_preview_allowed>'+$("#zip_icon_preview_allowed", _panel).is(":checked")+'</zip_icon_preview_allowed></server_prefs>';
					crushFTP.data.setXMLPrefs("server_settings/server_prefs/", "properties", "update", xmlPreviewPathData, function(_data){
						_data = $.xml2json(_data, true);
						if(_data.response_status && crushFTP.data.getTextValueFromXMLNode(_data.response_status) && crushFTP.data.getTextValueFromXMLNode(_data.response_status) == "OK")
						{
							common.data.updateLocalPrefs(function(){
								crushFTP.UI.hideIndicator();
								crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
								placeHolder.removeData("hasChanged");
								previews_path.removeAttr("isChanged");
							});
						}
						else
						{
							crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
						}
					}, panelPreview.saveParams);
				}
				/*else
				{
					common.data.updateLocalPrefs(function(){
						panelPreview.init(true);
						crushFTP.UI.hideIndicator();
						crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
						placeHolder.removeData("hasChanged");
					});
				}*/
			}
			else
			{
				crushFTP.UI.hideIndicator();
				crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
			}
		}, panelPreview.saveParams);
	}
	else
	{
		crushFTP.UI.growl("No changes made", "", false, 3000);
	}
}

panelPreview.buildXMLData = function()
{
	var xmlString = buildXMLToSubmitForm(_panel);
	return xmlString;
}