/****************************
CrushFTP GUI Plugin custom js
*****************************/
/* Do not change these lines */
var pluginHomeDirectory = {};
pluginHomeDirectory.localization = {};
/****************************/

// Plugin details
var pluginName = "HomeDirectory";
var _plugin = $("#pnlPlugin" + pluginName);

// Localizations
pluginHomeDirectory.localization = {
	lblEnabledText : "Enabled",
	lblDebugText : "Debug",
	lblVersionText : "Version: ",
	lblPathText : "Path: ",
	btnBrowseText : "Browse",
	lblDirectoryPermissionText : "Directory Permissions: ",
	lblUseUniqueTimeStampText : "Use Unique Time Stamped Folder? (ex. johndoe_01.01.2007)",
	lblUsernameMatchingText : "Username matching: ",
	lblPrependUserNameText : "Prepend username?",
	lblAlwaysGenerateHomeFolderText : "Replace Existing VFS With New Home Folder",
	lblRunOnlyForLoginEventText : "Only run if configured for a login event?",
	lblMemoryOnlyText : "Only build VFS in memory (don't save to user configuration)?",
	lblServerText : "Server: ",
	lblAllowAccessToOldHomeFoldersText : "Allow access to old home folders",
	lblCreateAdditionalSubfoldersText : " Create additional subfolders in home directory : "
};

// Assign localizations
localizations.panels["Plugins"][pluginName] = $.extend(pluginHomeDirectory.localization, localizations.panels["Plugins"][pluginName]);

// Interface methods
pluginHomeDirectory.init = function(pluginID, returnXML){
	$("#ssh_private_key").each(function(){
		$(this).addClass('maskPasswordOnURL urlWithParams').closest('div').find('.serverFilePickButton').removeClass('serverFilePickButton').addClass('serverFilePickWithParamsButton');
	});
	pluginHomeDirectory.returnXML = returnXML;
	applyLocalizations(pluginName, localizations.panels["Plugins"]);
	$("#setupTabLink", _plugin).trigger("click");
	pluginHomeDirectory.bindData(0, pluginID);
}

pluginHomeDirectory.bindData = function(index, pluginID)
{
	_panel.find(".maskPasswordOnURL").each(function () {
		$(this).removeData("originalURL realURL url");
		var rel = $(this).attr("rel");
		if (rel) {
		  var refElem = $("#" + rel, _plugin);
		  refElem.removeData("urlParams");
		}
	});
	index = index || 0;
	var pluginPrefs = [];
	pluginHomeDirectory.showServerList();
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
		pluginHomeDirectory.bindPluginDetails(curPlugin);
	}
	pluginHomeDirectory.bindEvents();

	var service = common;
	if(pluginHomeDirectory.returnXML)
	{
		service = crushFTP;
	}
	var server_item = service.data.getTextContentFromPrefs(curPlugin, "server_item");
	if(server_item)
	{
		if($.isArray(server_item))
			server_item = server_item[0].text;
		var items = server_item ? server_item.split(",") : [];
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
	$('input[id$="privs_quota"]').trigger("custom-change");
	_panel.find(".maskPasswordOnURL").trigger("applymask");
}

pluginHomeDirectory.showServerList = function()
{
	if(!this.serverListShown)
	{
		var service = common;
		if(pluginHomeDirectory.returnXML)
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
				var newControl = $('<span class="item" style="width:auto;"><input class="ignoreBind excludeXML" type="checkbox" server_name="'+crushFTP.methods.htmlEncode(server)+'" name="server_item_'+crushFTP.methods.htmlEncode(server)+'" id="server_item_'+crushFTP.methods.htmlEncode(server)+'" /><label for="server_item_'+crushFTP.methods.htmlEncode(server)+'">'+crushFTP.methods.htmlEncode(server)+'</label><span class="spacer"></span></span>');
				serverPorts.append(newControl);
				newControl.data("controlData", curItem);
			}
		}
		serverPorts.prepend('<span class="item" style="width:auto;"><input class="ignoreBind excludeXML" type="checkbox" name="server_item_All" id="server_item_all" /><label for="server_item_all">All</label><span class="spacer"></span></span>');
		this.serverListShown = true;
	}
}

pluginHomeDirectory.showSubFolderPrivs = function(){
	var homeDirSubFolders = $("#homeDirSubFolders", _panel);
	var item = homeDirSubFolders.find("li.ui-selected");
	if(!item || item.length==0)
	{
		$("#subfolderPrivs").hide().clearForm();
	}
	else
	{
		var data = item.data("controlData");
		$("#subfolderPrivs").show().clearForm();
		if(data.privs && data.privs.length>0)
		{
			var permissionsInputVal = data.privs;
			if(permissionsInputVal)
			{
				var actionItems = permissionsInputVal.split("(");
				var filteredItems = [];
				for (var i = 0; i < actionItems.length; i++) {
					var curAction = actionItems[i];
					if(curAction && curAction.length>0)
					{
						curAction = curAction.replace("(","").replace(")","");
						filteredItems.push(curAction);
					}
				};
				var advancedPrivs = {
					sync : {},
					encryption : {
						encryption_cypher_upload: 'CAST5',
						encryption_cypher_download: 'CAST5'
					}
				};
				if(filteredItems.length>0)
				{
					for (var i = 0; i < filteredItems.length; i++) {
						var curItem = filteredItems[i];
						if(curItem.indexOf("sync")==0)
						{
							var info = curItem.split("=");
							advancedPrivs.sync[info[0]] = info[1];
						}
						else if(panelPlugins.isEncryptionItem(curItem))
						{
							var info = curItem.split("=");
							advancedPrivs.encryption[info[0]] = info[1];
						}
						else if(curItem.indexOf("quota")==0)
						{
							var info = curItem.split("quota");
							if(crushFTP.methods.isNumeric(info[1]))
							{
								var val = Math.round(info[1]/(1024*1024));
								$("#subfolder_privs_quota", _plugin).val(val);
							}
						}
						else if(curItem.indexOf("comment")==0)
						{
							var info = curItem.replace("comment", "");
							$("#subfolder_privs_comment", _plugin).val(unescape(info));
						}
						else
							crushFTP.UI.checkUnchekInput($("#subfolder_privs_" + curItem, _plugin), true);
					};
					$("a#advancedPrivsOptionsSubFolder",_plugin).data("permissions", advancedPrivs);
				}
				$('input[id$="privs_quota"]').trigger("custom-change");
			}
		}
	}
}

pluginHomeDirectory.bindEvents = function()
{
	if(this.eventAdded)return;
	var advancedPrivsOptions = $("a#advancedPrivsOptions",_plugin).click(function(event) {
		panelPlugins.bindAdvancedPrivs($(this).data("permissions"));
		_panel.fieldAdvancedDialog.dialog("open");
		return false;
	});

	function rebuildPrivs(){
		permissionsInput.val("");
		var items = [];
		$(".permissionCB:checked", _plugin).each(function(){
			items.push($(this).attr("rel"));
		});

		$(".permissionItem", _plugin).each(function(){
			if($(this).val())
			{
				if($(this).attr("id") == "privs_quota")
				{
					var MB = $(this).val();
					if(crushFTP.methods.isNumeric(MB))
					{
						MB = parseInt(MB) * 1024 * 1024;
					}
					else
					{
						MB = "";
					}
					if(MB)
					{
						items.push("(quota" + MB + ")");
					}
				}
				else
					items.push("(" + $(this).attr("id").replace("privs_", "") + escape($(this).val()) + ")");
			}
		});
		var advPrivs = advancedPrivsOptions.data("permissions");
		if(advPrivs)
		{
			if(advPrivs.sync)
			{
				for(var data in advPrivs.sync)
				{
					items.push("("+data+"="+advPrivs.sync[data]+")");
				}
			}
			if(advPrivs.encryption)
			{
				for(var data in advPrivs.encryption)
				{
					items.push("("+data+"="+advPrivs.encryption[data]+")");
				}
			}
		}
		permissionsInput.val(items.join("")).trigger("change");
	}

	_panel.advancedPrivsReceiver = function(data){
		if(window.isAdvancedForSubFolder)
		{
			advancedPrivsOptionsSubFolder.data("permissions", data);
			rebuildPrivsSubFolder();
			window.isAdvancedForSubFolder = false;
		}
		else
		{
			advancedPrivsOptions.data("permissions", data);
			rebuildPrivs();
		}
		itemsChanged(true);
		panelPlugins.itemsChanged(true);
	}

	var advancedPrivsOptionsSubFolder = $("a#advancedPrivsOptionsSubFolder",_plugin).click(function(event) {
		window.isAdvancedForSubFolder = true;
		panelPlugins.bindAdvancedPrivs($(this).data("permissions"));
		_panel.fieldAdvancedDialog.dialog("open");
		return false;
	});

	function rebuildPrivsSubFolder(){
		var items = [];
		$(".permissionCBSubFolder:checked", _plugin).each(function(){
			items.push($(this).attr("rel"));
		});

		$(".permissionItemSubFolder", _plugin).each(function(){
			if($(this).val())
			{
				if($(this).attr("id") == "subfolder_privs_quota")
				{
					var MB = $(this).val();
					if(crushFTP.methods.isNumeric(MB))
					{
						MB = parseInt(MB) * 1024 * 1024;
					}
					else
					{
						MB = "";
					}
					if(MB)
					{
						items.push("(quota" + MB + ")");
					}
				}
				else
					items.push("(" + $(this).attr("id").replace("subfolder_privs_", "") + escape($(this).val()) + ")");
			}
		});
		var advPrivs = advancedPrivsOptionsSubFolder.data("permissions");
		if(advPrivs)
		{
			if(advPrivs.sync)
			{
				for(var data in advPrivs.sync)
				{
					items.push("("+data+"="+advPrivs.sync[data]+")");
				}
			}
			if(advPrivs.encryption)
			{
				for(var data in advPrivs.encryption)
				{
					items.push("("+data+"="+advPrivs.encryption[data]+")");
				}
			}
		}
		var homeDirSubFolders = $("#homeDirSubFolders", _panel);
		var item = homeDirSubFolders.find("li.ui-selected");
		if(item.length>0)
		{
			var data = item.data("controlData");
			/*var uniqueItems = [];
			$.each(data, function(i, el){
			    if($.inArray(el, uniqueItems) === -1) uniqueItems.push(el);
			});
			items = uniqueItems;*/
			data.privs = items.join("");
			item.data("controlData", data);
		}
	}

	var permissionsInput = $("#permissions", _plugin);
	_plugin.find("input, select, textarea").bind("change", function(){
		if($(this).hasClass('permissionCB'))
		{
			// permissionsInput.val("");
			// var items = [];
			// $(".permissionCB:checked", _plugin).each(function(){
			// 	items.push($(this).attr("rel"));
			// });
			// $(".permissionItem", _plugin).each(function(){
			// 	if($(this).val())
			// 	{
			// 		if($(this).attr("id") == "privs_quota")
			// 		{
			// 			var MB = $(this).val();
			// 			if(crushFTP.methods.isNumeric(MB))
			// 			{
			// 				MB = parseInt(MB) * 1024 * 1024;
			// 			}
			// 			else
			// 			{
			// 				MB = "";
			// 			}
			// 			if(MB)
			// 			{
			// 				items.push("(quota" + MB + ")");
			// 			}
			// 		}
			// 		else
			// 			items.push("(" + $(this).attr("id").replace("privs_", "") + escape($(this).val()) + ")");
			// 	}
			// });
			// permissionsInput.val(items.join("")).trigger("change");
			rebuildPrivs();
			return false;
		}
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
		if($(this).hasClass('permissionCBSubFolder'))
		{
			rebuildPrivsSubFolder();
			return false;
		}
		panelPlugins.itemsChanged(true, pluginHomeDirectory.returnXML, pluginName);
	});

	_plugin.find("input[type='text'], textarea").bind("textchange", function(){
		if($(this).hasClass('permissionItem'))
		{
			rebuildPrivs();
			return false;
		}
		else if($(this).hasClass('permissionItemSubFolder'))
		{
			rebuildPrivsSubFolder();
			return false;
		}
		if($(this).attr("id") !== "path")
			panelPlugins.itemsChanged(true, pluginHomeDirectory.returnXML, pluginName);
	});

	$("a.serverFilePickButton", _plugin).each(function(){
		$(this).unbind("click").click(function(){
			var curElem = $(this);
            var rel = curElem.attr("rel");
            var pickingFor = curElem.parent().parent().parent().find("label[for='"+rel+"']").text() || "";
            pickingFor = $.trim($.trim(pickingFor).replace(":", ""));
			var existingData = {};
			var relElem = $("#" + rel, _panel);
			var val;
			if(relElem.hasClass('maskPasswordOnURL')){
				val = relElem.data("originalURL") || relElem.val();
			}
			else{
				val = relElem.val();
			}
			var serverTypeOptions = _plugin.find(".serverTypeOptions");
			serverTypeOptions.find("input, select, textarea").each(function(){
				if(existingData)
				{
					if($(this).attr("id") == "modified_comparison_newer" && $(this).is(":checked"))
					{
						existingData["modified_comparison"] = "new";
					}
					else if($(this).attr("id") == "modified_comparison_older" && $(this).is(":checked"))
					{
						existingData["modified_comparison"] = "old";
					}
					else if($(this).attr("id") == "cache_mode_read" && $(this).is(":checked"))
					{
						existingData["cache_mode"] = "read";
					}
					else if($(this).attr("id") == "cache_mode_write" && $(this).is(":checked"))
					{
						existingData["cache_mode"] = "write";
					}
					else if($(this).hasClass("maskPasswordOnURL"))
					{
						var elem = $(this);
						var attrID = elem.attr("id");
						if(elem.hasClass('urlWithParams')){
							existingData[attrID] = decodeURIComponent(elem.data("realURL"));
						}
						else{
							var curVal = elem.val();
							var isFILE = curVal.toLowerCase().indexOf("file:/") == 0;
							if(curVal && curVal.indexOf(":")<0)
								isFILE = true;
							if(!isFILE)
							{
								var value = curVal;
		                        var url = value;
		                        try{
		                            url = URI(value);
		                        }catch(ex){
		                            url = URI(encodeURI(value));
		                        }
								if(url)
								{
									var pass = elem.data("password");
									if(pass)
									{
										url.password(pass);
		                                var _val = url.toString();
		                                if(value.length!=unescape(_val).length)
		                                    _val = _val.substr(0, _val.length-1);
										existingData[attrID] = decodeURIComponent(_val);
									}
		                            else
		                            {
		                                var _val = url.toString();
		                                if(value.length!=unescape(_val).length)
		                                    _val = _val.substr(0, _val.length-1);
		                                existingData[attrID] = decodeURIComponent(_val);
		                            }
								}
							}
							else
							{
								var url = curVal;
								if(url && url.indexOf(":")<0)
								{
		                            if(!elem.hasClass("notForcedURL") && elem.val().indexOf("{")!=0)
										url = "FILE:/" + elem.val();
		                            else
		                                url = elem.val();
								}
								existingData[attrID] = decodeURIComponent(url);
							}
							existingData[attrID] = decodeURIComponent(curVal);
						}
					}
					else
					{
						var recName = $(this).attr("recName");
						var isBool = $(this).attr("type") == "radio" || $(this).attr("type") == "checkbox";
						existingData[$(this).attr("id")] = isBool ? $(this).is(":checked").toString() : $(this).val();
					}
				}
			});
			if(!existingData.timeout || typeof existingData.timeout == "undefined")
            {
                existingData.timeout = "20000";
            }
            if(!existingData.write_timeout || typeof existingData.write_timeout == "undefined")
            {
                existingData.write_timeout = "20000";
            }
            if(!existingData.read_timeout || typeof existingData.read_timeout == "undefined")
            {
                existingData.read_timeout = "20000";
            }
            if(!existingData.proxyActivePorts || typeof existingData.proxyActivePorts == "undefined")
            {
                existingData.proxyActivePorts = "1025-655351";
            }
            if(typeof existingData.sharepoint_site_drive_name == "undefined")
            {
                existingData.sharepoint_site_drive_name = "Documents";
            }
            if(!existingData.s3_max_buffer_download || typeof existingData.s3_max_buffer_download == "undefined")
	        {
	            existingData.s3_max_buffer_download = "100";
	        }
	        if(!existingData.s3_buffer || typeof existingData.s3_buffer == "undefined")
	        {
	            existingData.s3_buffer = "5";
	        }
	        if(!existingData.s3_buffer_download || typeof existingData.s3_buffer_download == "undefined")
	        {
	            existingData.s3_buffer_download = "5";
	        }
	        if(!existingData.s3_acl || typeof existingData.s3_acl == "undefined")
	        {
	            existingData.s3_acl = "private";
	        }
	        if(!existingData.s3_storage_class || typeof existingData.s3_storage_class == "undefined")
	        {
	            existingData.s3_storage_class = "STANDARD";
	        }
	        if(!existingData.s3_threads_upload || typeof existingData.s3_threads_upload == "undefined")
	        {
	            existingData.s3_threads_upload = "3";
	        }
	        if(!existingData.s3_threads_download || typeof existingData.s3_threads_download == "undefined")
	        {
	            existingData.s3_threads_download = "3";
	        }
	        if(!existingData.s3_meta_md5_and_upload_by || typeof existingData.s3_meta_md5_and_upload_by == "undefined")
	        {
	            existingData.s3_meta_md5_and_upload_by = "true";
	        }
	        if(typeof existingData.multithreaded_s3_download == "undefined")
            {
                existingData.multithreaded_s3_download = existingData.multithreaded_s3 || "false";
            }
			existingData[curElem.attr("rel")] = val;
			existingData.url = val;
			var _path = existingData.path + "";
			existingData.dir_path = _path;
			curElem.crushFtpLocalFileBrowserPopup({
				type : curElem.attr("PickType") || 'dir',
				pickingFor: pickingFor,
				file_mode: curElem.attr("FileMode") || 'server',
				isFTPBrowse : true,
				existingVal: val,
				allowRootSelection: false,
				existingData : existingData,
				callback: function (selectedPath, ftpServerInfo) {
					var _path = ftpServerInfo.dir_path + "";
					ftpServerInfo.path = _path;
					$("#" + curElem.attr("rel"), _panel).val(ftpServerInfo.url).trigger("change");
					$("#" + curElem.attr("rel") + ".maskPasswordOnURL", _panel).removeData().trigger("applymask");
					var taskForm = _panel;
					var ignored = taskForm.find(".ignoreBind").removeClass("ignoreBind");
                    var tempControlData = ftpServerInfo;
                    if(tempControlData.use_dmz.indexOf("socks://") == 0 || tempControlData.use_dmz.indexOf("internal://") == 0 || tempControlData.use_dmz.indexOf("variable") == 0)
                    {
                        _plugin.find("#use_dmz").find("option[_rel='custom']").attr("value", tempControlData.use_dmz).text(tempControlData.use_dmz + " (custom)");
                    }
                    window.applyingChanges = true;
                    if(curElem.hasClass("global"))
						bindValuesFromJson(serverTypeOptions, tempControlData);
                    if(tempControlData.use_dmz == "false" || tempControlData.use_dmz == "")
                    {
                        _plugin.find("#use_dmz").find("option:first").attr("selected", "selected");
                    }
                    window.applyingChanges = false;
					taskForm.find(".SSHOptionsHandle").trigger("textchange");
					taskForm.find(".encryptionMode").trigger("change");
					ignored.addClass("ignoreBind");
					setTimeout(function(){
						taskForm.find(".SSHOptionsHandle").trigger("textchange");
						taskForm.find(".maskPasswordOnURL").trigger("blur");
					}, 100);
				}
			});
			return false;
		});
	});

	$("a.serverFilePickWithParamsButton", _plugin).each(function(){
		$(this).unbind("click").click(function(){
			var curElem = $(this);
            var rel = curElem.attr("rel");
            var pickingFor = curElem.parent().parent().parent().find("label[for='"+rel+"']").text() || "";
            pickingFor = $.trim($.trim(pickingFor).replace(":", ""));
			var refElem = $("#" + rel, _plugin);
			var labelName = refElem.val() || "";
			var advancedBrowse = true;
			var existingData = refElem.data("urlParams") || {};
			var curPath = refElem.val();
			if(refElem.hasClass('maskPasswordOnURL')){
				curPath = refElem.data("url") || refElem.val();
			}
			// curPath = getFullURLWithParams(curPath, existingData);
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
			if(!existingData.timeout || typeof existingData.timeout == "undefined")
            {
                existingData.timeout = "20000";
            }
            if(!existingData.write_timeout || typeof existingData.write_timeout == "undefined")
            {
                existingData.write_timeout = "20000";
            }
            if(!existingData.read_timeout || typeof existingData.read_timeout == "undefined")
            {
                existingData.read_timeout = "20000";
            }
            if(!existingData.proxyActivePorts || typeof existingData.proxyActivePorts == "undefined")
            {
                existingData.proxyActivePorts = "1025-655351";
            }
            if(typeof existingData.sharepoint_site_drive_name == "undefined")
            {
                existingData.sharepoint_site_drive_name = "Documents";
            }
            if(!existingData.s3_max_buffer_download || typeof existingData.s3_max_buffer_download == "undefined")
	        {
	            existingData.s3_max_buffer_download = "100";
	        }
	        if(!existingData.s3_buffer || typeof existingData.s3_buffer == "undefined")
	        {
	            existingData.s3_buffer = "5";
	        }
	        if(!existingData.s3_buffer_download || typeof existingData.s3_buffer_download == "undefined")
	        {
	            existingData.s3_buffer_download = "5";
	        }
	        if(!existingData.s3_acl || typeof existingData.s3_acl == "undefined")
	        {
	            existingData.s3_acl = "private";
	        }
	        if(!existingData.s3_storage_class || typeof existingData.s3_storage_class == "undefined")
	        {
	            existingData.s3_storage_class = "STANDARD";
	        }
	        if(!existingData.s3_threads_upload || typeof existingData.s3_threads_upload == "undefined")
	        {
	            existingData.s3_threads_upload = "3";
	        }
	        if(!existingData.s3_threads_download || typeof existingData.s3_threads_download == "undefined")
	        {
	            existingData.s3_threads_download = "3";
	        }
	        if(!existingData.s3_meta_md5_and_upload_by || typeof existingData.s3_meta_md5_and_upload_by == "undefined")
	        {
	            existingData.s3_meta_md5_and_upload_by = "true";
	        }
	        if(typeof existingData.multithreaded_s3_download == "undefined")
            {
                existingData.multithreaded_s3_download = existingData.multithreaded_s3 || "false";
            }
            delete existingData.path;
            if(curPath){
            	existingData.url = existingData[refElem.attr("id")] = getURLWithoutParams(curPath);
            }
			curElem.crushFtpLocalFileBrowserPopup({
				type : curElem.attr("PickType") || 'dir',
				file_mode : advancedBrowse ? "server" : curElem.attr("FileMode") || 'server',
				pickingFor: pickingFor,
				note : note,
				existingData : $.extend(true, {}, existingData) || {},
				urlWithParams: true,
				// isServerBrowse : true,
				existingVal : "/",
				allowRootSelection : advancedBrowse,
				isFTPBrowse : advancedBrowse,
				callback : function(selectedPath){
					$("#" + curElem.attr("rel"), _plugin).val(decodeURIComponent(selectedPath)).removeData("urlParams").trigger('applymask');
					$("#" + curElem.attr("rel"), _plugin).focus();
					setTimeout(function(){
						$("#" + curElem.attr("rel"), _plugin).trigger("textchange");
						$("#" + curElem.attr("rel"), _plugin).trigger("blur");
					}, 100);
					panelPlugins.itemsChanged(true, pluginHomeDirectory.returnXML, pluginName);
				}
			});
			return false;
		});
	});

	var homeDirSubFolders = $("#homeDirSubFolders", _panel);
	homeDirSubFolders.selectableAdvanced({
		select: function(event, ui) {
			var selected = $(ui.selection);
			selected.parent().find(".ui-state-highlight").removeClass("ui-state-highlight");
			selected.parent().find(".ui-state-highlight, .ui-selected, .ui-widget-header, .ui-state-highlight, .ui-state-focus, .ui-state-active").removeClass("ui-state-highlight ui-selected ui-widget-header ui-state-highlight ui-state-focus ui-state-active");
			selected.addClass('ui-selected ui-widget-header');
			pluginHomeDirectory.showSubFolderPrivs();
			return false;
		},
		change: function(event, ui) {
			var selected = $(ui.selection).filter(":last");
			selected.parent().find(".ui-state-highlight, .ui-selected, .ui-widget-header, .ui-state-highlight, .ui-state-focus, .ui-state-active").removeClass("ui-state-highlight ui-selected ui-widget-header ui-state-highlight ui-state-focus ui-state-active");
			selected.addClass('ui-selected ui-widget-header');
			return false;
		},
		remove : function(event, ui) {
			$("a#removeSubFolder", _panel).click();
			return false;
		}
	});

	// $('input[id$="privs_quota"]').each(function(){
	// 	$(this).unbind('textchange.quota custom-change change').bind('textchange.quota custom-change change', function(event) {
	// 		if($(this).val()){
	// 			$(this).closest("fieldset").find('input[id$="privs_real_quota"]').attr("checked", "checked").attr("readonly", "readonly").closest("span").find("span").find("span").addClass("ui-icon ui-icon-check");
	// 		}
	// 		else{
	// 			$(this).closest("fieldset").find('input[id$="privs_real_quota"]').removeAttr("readonly");
	// 		}
	// 	});
	// });

	var notAllowedCharsInDirName = ":&#?<>";
	$("a#addNewSubFolder", _panel).click(function(evt){
		jPrompt("Enter Folder Name :", "untitled", "Input", function(value){
			if(value)
			{
				value = $.trim(value);
				if(homeDirSubFolders.find("li[rel='"+crushFTP.methods.htmlEncode(value.toLowerCase())+"']").length>0)
				{
					jAlert("Folder exists", "Choose another folder name", function(){
						$("a#addNewSubFolder", _panel).click();
					});
				}
				else if(crushFTP.methods.hasSpecialCharacters(value, notAllowedCharsInDirName))
                {
                    jAlert("You can not use these characters in folder name : \"" + notAllowedCharsInDirName + "\"", "Invalid name", function(){
                        $("a#addNewSubFolder", _panel).click();
                    });
                    return false;
                }
				else
				{
					var newControl = $('<li class="ui-widget-content" rel="'+crushFTP.methods.htmlEncode(value.toLowerCase())+'">' + crushFTP.methods.htmlEncode(value) + '</li>');
					var data = {name : value};
					newControl.data("controlData", data);
					homeDirSubFolders.append(newControl);
					if(newControl)
					{
						newControl.addClass("ui-widget-content ui-selectable-item");
						try{
							homeDirSubFolders.selectableAdvanced("refresh");
                        }catch(ex){}
						itemsChanged(true);
						panelPlugins.itemsChanged(true);
					}
				}
			}
		});
		return false;
	});

	$("a#editSubFolder", _panel).click(function(){
		var item = homeDirSubFolders.find("li.ui-selected");
		if(!item || item.length==0)return;
		var data = item.data("controlData");
		if(data)
		{
			var name = data["name"];
			jPrompt("Enter Folder Name :", name, "Input", function(value){
				if(value)
				{
					value = $.trim(value);
					if(value != name && homeDirSubFolders.find("li[rel='"+value.toLowerCase()+"']").length>0)
					{
						jAlert("Folder exists", "Choose another folder name", function(){
							$("a#editSubFolder", _panel).click();
						});
					}
					else if(crushFTP.methods.hasSpecialCharacters(value, notAllowedCharsInDirName))
		            {
		                jAlert("You can not use these characters in folder name : \"" + notAllowedCharsInDirName + "\"", "Invalid name", function(){
		                    $("a#editSubFolder", _panel).click();
		                });
		                return false;
		            }
					else
					{
						data.name = value;
						item.attr("rel", value.toLowerCase());
						item.text(value);
						item.data("controlData", data);
						try{
							homeDirSubFolders.selectableAdvanced("refresh");
                        }catch(ex){}
						itemsChanged(true);
						panelPlugins.itemsChanged(true);
					}
				}
			});
			itemsChanged(true);
			panelPlugins.itemsChanged(true);
		}
		return false;
	});

	$("a#removeSubFolder", _panel).click(function(){
		var item = homeDirSubFolders.find("li.ui-selected");
		if(!item || item.length==0)return false;
		var data = item.data("controlData");
		if(data)
		{
			var name = data["name"];
			jConfirm("Are you sure you wish to remove folder : " + name, "Confirm", function(val){
				if(val)
				{
					item.remove();
					try{
						homeDirSubFolders.selectableAdvanced("refresh");
                     }catch(ex){}
					pluginHomeDirectory.showSubFolderPrivs();
					itemsChanged(true);
					panelPlugins.itemsChanged(true);
				}
			});
		}
		return false;
	});
	_panel.find(".maskPasswordOnURL").each(function(){
		$(this).unbind("focus.form").bind("focus.form", function(){
			if($(this).data("originalURL"))
				$(this).val($(this).data("originalURL"));
        }).unbind("blur.form").bind("blur.form", function(){
			$(this).trigger("applymask");
        }).unbind("applymask").bind("applymask", function(){
        	var elem = $(this);
        	var value = $(this).val();
            var url = value;
            try{
                url = URI(value);
            }catch(ex){
                url = URI(encodeURI(value));
            }
            var urlParams = getParamsFromURL(value) || {};
            if(elem.hasClass('urlWithParams') && Object.keys(urlParams.params).length != 0){
            	elem.data("urlParams", urlParams.params);
            	url.port(urlParams.port || "");
            }
            if(elem.hasClass('urlWithParams'))
            	elem.data("realURL", getFullURLWithParams(value, elem.data("urlParams") || {}));
            if(url && elem.val().substr(8, 1) != ":")
            {
                var pass = decodeURIComponent(url.password());
                var mask = false;
                var existingPass = elem.data("password");
                if(pass != existingPass)
                {
                    if(existingPass)
                    {
                        mask = new Array(existingPass.length+1).join('*');
                    }
                    if(existingPass && pass == mask)
                        pass = existingPass;
                    else
                        mask = new Array(pass.length+1).join('*');
                    if(pass)
                    {
                        elem.data("password", pass);
                        elem.data("url", value);
                        url.password(mask);
                        var _val = url.toString();
                        elem.val(decodeURIComponent(_val));
                    }
                }
                else
                {
                    pass = existingPass;
                    mask = new Array(pass.length+1).join('*');
                    url.password(mask);
                    var _val = url.toString();
                    elem.val(decodeURIComponent(_val));
                    elem.data("url", value);
                }
                url.password(pass);
                var _val = url.toString();
                if(value.indexOf("////")==0){
                	_val = "//" + _val;
                }
                elem.data("originalURL", decodeURIComponent(_val));
            }
            else
            {
            	elem.data("url", value);
            	elem.data("originalURL", value);
            }
        });
	});
	_panel.find(".advanced-options h3").unbind().click(function(){
        $(this).closest(".advanced-options").toggleClass("open closed");
    });

    _panel.find(".advanced-options-all h3").unbind().click(function(){
        $(this).closest(".advanced-options-all").toggleClass("open closed");
    });

    _panel.find(".customScriptBtn").click(function(){
        $(this).closest(".customScriptPanel").find(".customScriptsPanel").toggle();
        return false;
    });

    var scriptType = _panel.find(".scriptType").change(function(){
        $(this).closest(".customScriptsPanel").find(".valPanel").hide();
        $(this).closest(".customScriptsPanel").find(".valPanel[rel='"+$(this).val()+"']").show();
        return false;
    });

    setTimeout(function(){
        _panel.find("#secure").change(function(){
            if($(this).val() == "true" && $(this).is(":visible"))
            {
                _panel.find(".SSHOptionsHandle:visible").each(function(){
                    var url = $(this).val();
                    var itms = url.split(":");
                    itms[0] = "FTPES";
                    if(itms.length==1)
                        itms[0] = "FTPES://";
                    $(this).val(itms.join(":")).trigger("custevt").trigger("blur.form", [{password:$(this).data("password")}]);
                });
            }
        });
    }, 500);

	_panel.find(".SSHOptionsHandle").each(function(){
        var that = $(this);
        function change(elem)
        {
            var text = elem.val().toLowerCase();
            elem.closest("div.actionConfigPanel").find("div.advanced-options, .smbOption, .smbOnlyOption").hide();
            elem.closest("div.actionConfigPanel").find(".nonFileOption").show();
            if(text.indexOf("http://")>=0 || text.indexOf("https://")>=0)
            {
                elem.closest("div.actionConfigPanel").find(".httpOptions").show();
                elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
            }
            else
            {
                elem.closest("div.actionConfigPanel").find(".httpOptions").hide();
            }
            if(text.indexOf("azure://")>=0)
            {
                elem.closest("div.actionConfigPanel").find(".azureOptions").show();
                elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
            }
            else
            {
                elem.closest("div.actionConfigPanel").find(".azureOptions").hide();
            }
            if(text.indexOf("webdav://")>=0 || text.indexOf("webdavs://")>=0)
            {
                elem.closest("div.actionConfigPanel").find(".webdavOptions").show();
                elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
            }
            else
            {
                elem.closest("div.actionConfigPanel").find(".webdavOptions").hide();
            }
            if(text.indexOf("ftp://")>=0 || text.indexOf("sftp://")>=0)
            {
                elem.closest("div.actionConfigPanel").find(".ftpSftpOptions").show();
                elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
            }
            else
            {
                elem.closest("div.actionConfigPanel").find(".ftpSftpOptions").hide();
            }
            if(text.indexOf("glacier://")>=0)
            {
                elem.closest("div.actionConfigPanel").find(".glacierCredentials").show();
                elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
            }
            else
            {
                elem.closest("div.actionConfigPanel").find(".glacierCredentials").hide();
            }
            if(text.indexOf("sftp://")>=0)
            {
                elem.closest("div.actionConfigPanel").find(".sftpOptions").show();
                elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
            }
            else
            {
                elem.closest("div.actionConfigPanel").find(".sftpOptions").hide();
            }
            if(text.indexOf("ftps://")>=0 || text.indexOf("https://")>=0 || text.indexOf("webdavs://")>=0)
            {
                elem.closest("div.actionConfigPanel").find(".sslOptions").show().find(".excludeXML").removeClass('excludeXML').addClass('tempallowXML');
                elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
            }
            else
            {
                elem.closest("div.actionConfigPanel").find(".sslOptions").hide().find(".tempallowXML").removeClass('tempallowXML').addClass('excludeXML');;
            }
            if(text.indexOf("smb://")==0)
            {
            	elem.closest("div.actionConfigPanel").find(".smbOnlyOption").show();
            	elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
            }
            if(text.indexOf("smb")==0)
            {
            	elem.closest("div.actionConfigPanel").find(".smbOption").show();
            	elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
            }
            if(text.indexOf("smb://")==0 || text.indexOf("smb3://")==0 || text.indexOf("file:")==0 || text.indexOf("memory://")==0)
            {
                elem.closest("div.actionConfigPanel").find(".dmzOption").hide();
            }
            else
            {
                elem.closest("div.actionConfigPanel").find(".dmzOption").show();
            }
            if(text.indexOf("smb3://")==0)
            {
                elem.closest("div.actionConfigPanel").find(".smb3Option").show();
                elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
                elem.closest("div.actionConfigPanel").find(".dmzOption").show();
            }
            else
            {
                elem.closest("div.actionConfigPanel").find(".smb3Option").hide();
            }
            if(text.indexOf("ftp://")==0)
            {
                elem.closest("div.actionConfigPanel").find(".ftpOptions").show();
                elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
            }
            else
            {
                elem.closest("div.actionConfigPanel").find(".ftpOptions").hide();
            }
            if(text.indexOf("hadoop://")==0)
            {
                elem.closest("div.actionConfigPanel").find(".hadoopOptions, .hadoopOption2").show();
                elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
            }
            else
            {
                elem.closest("div.actionConfigPanel").find(".hadoopOptions").hide();
            }
            if(text.indexOf("ftp://")==0 || text.indexOf("ftps://")==0 || text.indexOf("ftpes://")==0)
            {
                elem.closest("div.actionConfigPanel").find(".ftpSOptions").show();
                if(text.indexOf("ftpes://")==0)
                    elem.closest("div.actionConfigPanel").find(".sslOptions").show().find(".excludeXML").removeClass('excludeXML').addClass('tempallowXML');;
                if(text.indexOf("ftp://")==0)
                    elem.closest("div.actionConfigPanel").find("#secure").val("false");
                elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
            }
            else
            {
                elem.closest("div.actionConfigPanel").find(".ftpSOptions").hide();
            }
            if(text.indexOf("sftp://")==0 || text.indexOf("ftp://")==0 || text.indexOf("ftps://")==0 || text.indexOf("ftpes://")==0)
            {
                elem.closest("div.actionConfigPanel").find(".allftpOptions").show();
                elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
            }
            else
            {
                elem.closest("div.actionConfigPanel").find(".allftpOptions").hide();
            }
            if(text.indexOf("ftps://")==0 || text.indexOf("ftpes://")==0)
            {
                elem.closest("div.actionConfigPanel").find(".ftpesOptions").show();
                elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
            }
            else
            {
                elem.closest("div.actionConfigPanel").find(".ftpesOptions").hide();
            }
            if(text.indexOf("s3://")>=0 || text.indexOf("s3crush://")>=0)
            {
                elem.closest("div.actionConfigPanel").find(".s3Credentials").show();
                elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
            }
            else
            {
                elem.closest("div.actionConfigPanel").find(".s3Credentials").hide();
            }
            if(text.indexOf("s3crush://")>=0)
            {
                elem.closest("div.actionConfigPanel").find(".s3CrushCredentials").show();
                elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
            }
            else
            {
                elem.closest("div.actionConfigPanel").find(".s3CrushCredentials").hide();
            }
            if(text.indexOf("smb3://")==0 || text.indexOf("sftp://")==0){
                elem.closest("div.actionConfigPanel").find(".sftpsmbCommonOption").show();
            }
            else{
                elem.closest("div.actionConfigPanel").find(".sftpsmbCommonOption").hide();
            }
            if(text.indexOf("onedrive://")>=0)
            {
                elem.closest("div.actionConfigPanel").find(".onedriveCredentials").show();
                elem.closest("div.actionConfigPanel").find(".onedriveCredentialsOnly").show();
                elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
            }
            else
            {
                elem.closest("div.actionConfigPanel").find(".onedriveCredentialsOnly, .onedriveCredentials").hide();
            }
            if(text.indexOf("sharepoint://")>=0 || text.indexOf("sharepoint2://")>=0)
            {
                elem.closest("div.actionConfigPanel").find(".onedriveCredentials, .sharepointCredentials").show();
                elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
                elem.closest("div.actionConfigPanel").find(".onedriveCredentialsOnly").hide();
                var val = that.val();
                try{
                	var _url = URI(val);
                	var _path = _url.path();
		            if(!_path.endsWith("/") && val.endsWith("/"))
						_path += "/";
		            $("#sharepoint_site_folder_name", elem.closest("div.actionConfigPanel")).val(_path);
                }catch(ex){}
            }
            else
            {
                elem.closest("div.actionConfigPanel").find(".sharepointCredentials").hide();
            }
            if(text.indexOf("gdrive://")>=0)
            {
                elem.closest("div.actionConfigPanel").find(".gdriveCredentials").show();
                elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
            }
            else
            {
                elem.closest("div.actionConfigPanel").find(".gdriveCredentials").hide();
            }
            if(text.indexOf("{")==0)
            {
                elem.closest("div.actionConfigPanel").find(".gdriveCredentials").show();
                elem.closest("div.actionConfigPanel").find(".onedriveCredentials").show();
                elem.closest("div.actionConfigPanel").find(".s3CrushCredentials").show();
                elem.closest("div.actionConfigPanel").find(".s3Credentials").show();
                elem.closest("div.actionConfigPanel").find(".azureOptions").show();
                elem.closest("div.actionConfigPanel").find(".ftpOptions").show();
                elem.closest("div.actionConfigPanel").find(".hadoopOptions, .hadoopOption2").show();
                elem.closest("div.actionConfigPanel").find(".ftpSOptions").show();
                elem.closest("div.actionConfigPanel").find(".ftpesOptions").show();
                elem.closest("div.actionConfigPanel").find(".webdavOptions").show();
                elem.closest("div.actionConfigPanel").find(".allftpOptions").show();
                elem.closest("div.actionConfigPanel").find(".smbOption").show();
                elem.closest("div.actionConfigPanel").find(".smbOnlyOption").show();
                elem.closest("div.actionConfigPanel").find(".smb3Option").show();
                elem.closest("div.actionConfigPanel").find(".dmzOption").show();
                elem.closest("div.actionConfigPanel").find(".sslOptions").show().find(".excludeXML").removeClass('excludeXML').addClass('tempallowXML');
                elem.closest("div.actionConfigPanel").find(".sftpOptions").show();
                elem.closest("div.actionConfigPanel").find(".httpOptions").show();
                elem.closest("div.actionConfigPanel").find(".ftpSftpOptions").show();
                elem.closest("div.actionConfigPanel").find(".nonFileOption").show();
                elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
            }
            if(text.indexOf("file:")>=0){
            	elem.closest("div.actionConfigPanel").find(".nonFileOption").hide();
            }
            if(elem.closest("div.actionConfigPanel").find(".encryptionMode:visible").length>0)
                elem.closest("div.actionConfigPanel").find(".encryptionMode:visible").trigger("change");
        }
        $(this).bind("custevt", function(){
            change(that);
        });
		$(this).bind("textchange", function(){
            change(that);
        });
        that.closest("div.actionConfigPanel").find("#sharepoint_site_folder_name").bind("textchange", function(){
        	var path = $(this).val();
			if(path && !path.endsWith("/"))
	        	path += "/";
	        if(path.indexOf("/")==0)
	        {
	        	path = path.replace("/", "");
	       	}
	       	try{
	       		var val = that.val();
            	var _url = URI(val);
            	_url.path(path);
            	that.val(decodeURIComponent(_url.toString()));
            	_panel.find(".maskPasswordOnURL").trigger("applymask");
            }catch(ex){}
        });
	});

    _panel.find(".httpOnly").each(function(){
        $(this).bind("textchange", function(){
            var text = $(this).val().toLowerCase();
            if(text.indexOf("http://")>=0 || text.indexOf("https://")>=0)
            {
                $(this).removeClass("ui-state-error").closest("p").find(".errorMsg").hide();
            }
            else
            {
                $(this).addClass("ui-state-error").closest("p").find(".errorMsg").show();
            }
        });
    });

    _panel.find("#verifyHost").change(function(){
		if($(this).is(":checked")){
			_panel.find('.onlyVerifyHost').show();
		}
		else
			_panel.find('.onlyVerifyHost').hide();
	}).trigger("change");

	_panel.find("#upload_blob_type").unbind().change(function(){
        var item_option_itemType = _panel.find("input.SSHOptionsHandle:first").val() || "";
        if((item_option_itemType.indexOf("{") == 0 || item_option_itemType.indexOf("azure") == 0) && $(this).val() == "blockblob")
        {
            _panel.find(".blockblob_option").show();
        }
        else
        {
            _panel.find(".blockblob_option").hide();
        }
    }).trigger("change");

	_panel.find("#multithreaded_s3").change(function(){
		if($(this).is(":checked")){
			_panel.find('.multiThreadUploadOptions').show().find("input").removeClass('excludeXML');
		}
		else
			_panel.find('.multiThreadUploadOptions').hide().find("input").addClass('excludeXML');
	}).trigger("change");

	_panel.find("#multithreaded_s3_download").change(function(){
		if($(this).is(":checked")){
			_panel.find('.multiThreadDownloadOptions').show().find("input").removeClass('excludeXML');
		}
		else
			_panel.find('.multiThreadDownloadOptions').hide().find("input").addClass('excludeXML');
	}).trigger("change");

    _panel.find("#onedrive_my_shares").change(function(){
        if($(this).is(":checked")){
        	_panel.find(".onDriveShared").show();
        }
        else{
        	_panel.find(".onDriveShared").hide();
        }
        return false;
    }).trigger("change");

	this.eventAdded = true;
}

pluginHomeDirectory.bindPluginDetails = function(controlData)
{
	var inputs = _plugin.find("input.ignoreBind,select.ignoreBind,textarea.ignoreBind").removeClass("ignoreBind");
	if(controlData)
	{
		if(typeof controlData.timeout == "undefined")
			controlData.timeout = [{ text: "20000" }];
		if(typeof controlData.write_timeout == "undefined")
			controlData.write_timeout = [{ text: "20000" }];
		if(typeof controlData.read_timeout == "undefined")
			controlData.read_timeout = [{ text: "20000" }];
		if(typeof controlData.sharepoint_site_drive_name == "undefined")
			controlData.sharepoint_site_drive_name = [{ text: "Documents" }];
		if(typeof controlData.s3_max_buffer_download == "undefined")
			controlData.s3_max_buffer_download = [{ text: "100" }];
		if(typeof controlData.s3_buffer == "undefined")
			controlData.s3_buffer = [{ text: "5" }];
		if(typeof controlData.s3_buffer_download == "undefined")
			controlData.s3_buffer_download = [{ text: "5" }];
		if(typeof controlData.s3_acl == "undefined")
			controlData.s3_acl = [{ text: "private" }];
		if(typeof controlData.s3_storage_class == "undefined")
			controlData.s3_storage_class = [{ text: "STANDARD" }];
		if(typeof controlData.s3_threads_upload == "undefined")
			controlData.s3_threads_upload = [{ text: "3" }];
		if(typeof controlData.s3_threads_download == "undefined")
			controlData.s3_threads_download = [{ text: "3" }];
		if(typeof controlData.s3_meta_md5_and_upload_by == "undefined")
			controlData.s3_meta_md5_and_upload_by = [{ text: "true" }];
		if(typeof controlData.multithreaded_s3_download == "undefined")
			controlData.multithreaded_s3_download = controlData.multithreaded_s3 || [{ text: "false" }];
	}
	bindValuesFromXML(_plugin, controlData);
	if(controlData.subItem && controlData.subItem.length>0)
		_plugin.attr("subPluginName", controlData.subItem[0].text || "");
	inputs.addClass("ignoreBind");
	var permissionsInput = $("#permissions", _plugin);
	var permissionsInputVal = permissionsInput.val();
	if(permissionsInputVal)
	{
		var actionItems = permissionsInputVal.split("(");
		var filteredItems = [];
		for (var i = 0; i < actionItems.length; i++) {
			var curAction = actionItems[i];
			if(curAction && curAction.length>0)
			{
				curAction = curAction.replace("(","").replace(")","");
				filteredItems.push(curAction);
			}
		};
		var advancedPrivs = {
			sync : {},
			encryption : {
				encryption_cypher_upload: 'CAST5',
				encryption_cypher_download: 'CAST5'
			}
		};
		if(filteredItems.length>0)
		{
			for (var i = 0; i < filteredItems.length; i++) {
				var curItem = filteredItems[i];
				if(curItem.indexOf("sync")==0)
				{
					var info = curItem.split("=");
					advancedPrivs.sync[info[0]] = info[1];
				}
				else if(panelPlugins.isEncryptionItem(curItem))
				{
					var info = curItem.split("=");
					advancedPrivs.encryption[info[0]] = info[1];
				}
				else if(curItem.indexOf("quota")==0)
				{
					var info = curItem.split("quota");
					if(crushFTP.methods.isNumeric(info[1]))
					{
						var val = Math.round(info[1]/(1024*1024));
						$("#privs_quota", _plugin).val(val);
					}
				}
				else if(curItem.indexOf("comment")==0)
				{
					var info = curItem.replace("comment", "");
					$("#privs_comment", _plugin).val(unescape(info));
				}
				else
					crushFTP.UI.checkUnchekInput($("#privs_" + curItem, _plugin), true);
			};
			if(typeof advancedPrivs.encryption.hint_decrypted_size == "undefined"){
				advancedPrivs.encryption.hint_decrypted_size = "true";
			}
			$("a#advancedPrivsOptions",_plugin).data("permissions", advancedPrivs);
		}
	}
	var homeDirSubFolders = $("#homeDirSubFolders", _panel).empty();
	if(controlData.additional_paths && controlData.additional_paths.length>0 && controlData.additional_paths[0].text)
	{
		var additionalDirs = controlData.additional_paths[0].text.split("\n");
		if(additionalDirs.length>0)
		{
			for (var i = 0; i < additionalDirs.length; i++) {
				var curDir = additionalDirs[i];
				if(curDir)
				{
					var name = curDir;
					var privs = "";
					if(curDir.indexOf(":")>0)
					{
						name = curDir.substr(0, curDir.lastIndexOf(":"));
						privs = curDir.substr(curDir.lastIndexOf(":")+1, curDir.length);
					}
					var newControl = $('<li class="ui-widget-content" rel="'+crushFTP.methods.htmlEncode(name.toLowerCase())+'">' + crushFTP.methods.htmlEncode(name) + '</li>');
					var data = {name : name, privs : privs};
					newControl.data("controlData", data);
					homeDirSubFolders.append(newControl);
					if(newControl)
					{
						newControl.addClass("ui-widget-content ui-selectable-item");
						try{
							homeDirSubFolders.selectableAdvanced("refresh");
                        }catch(ex){}
						itemsChanged(true);
						panelPlugins.itemsChanged(true);
					}
				}
			};
		}
		var item = homeDirSubFolders.find("li.ui-selected");
		if(!item || item.length==0)
		{
			$("#subfolderPrivs").hide().clearForm();
		}
	}
	setTimeout(function(){
		_panel.find(".SSHOptionsHandle").trigger("custevt");
	});
}

pluginHomeDirectory.saveContent = function(saveByIndex, cloneName, removeByIndex, callback)
{
	removeByIndex = removeByIndex || 0;
	if(pluginPlaceHolder.data("hasChanged") || removeByIndex>0 || (saveByIndex>0 && cloneName) || pluginHomeDirectory.returnXML)
	{
		if(!pluginHomeDirectory.returnXML)
			crushFTP.UI.showIndicator(false, false, "Please wait..");
		var xmlString = [];
		var container = _plugin;
		if(removeByIndex == 0)
		{
			xmlString.push("<plugins_subitem type=\"properties\">");
			xmlString.push("<version>"+$("#version", _plugin).text()+"</version>");
			xmlString.push("<pluginName>"+pluginName+"</pluginName>");
			var additionalDirs = [];
			$("#homeDirSubFolders").find("li").each(function(index, el) {
				var data = $(this).data("controlData");
				if(data)
				{
					var name = data.name;
					var privs = data.privs;
					if(!additionalDirs.has(name))
					{
						if(privs)
							additionalDirs.push(name+":"+privs);
						else
							additionalDirs.push(name);
					}
				}
			});
			if(additionalDirs.length>0)
			{
				xmlString.push("<additional_paths>"+crushFTP.methods.htmlEncode(additionalDirs.join("\n"))+"</additional_paths>");
			}
			else
			{
				xmlString.push("<additional_paths></additional_paths>");
			}
			var ignored = _plugin.find(".serverTypeOptions").find(".ignoreBind").removeClass("ignoreBind");
			xmlString.push(buildXMLToSubmitForm(_plugin, true));
			_plugin.find(".SSHOptionsHandle").trigger("textchange");
			ignored.addClass("ignoreBind");
			setTimeout(function(){
				_plugin.find(".SSHOptionsHandle").trigger("textchange");
				_plugin.find(".maskPasswordOnURL").trigger("blur");
			}, 100);

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

		if(pluginHomeDirectory.returnXML)
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