/****************************
CrushFTP GUI Plugin custom js
*****************************/
/* Do not change these lines */
var pluginCrushLDAPGroup = {};
pluginCrushLDAPGroup.localization = {};
/****************************/

// Plugin details
var pluginName = "CrushLDAPGroup";
var _plugin = $("#pnlPlugin" + pluginName);

// Localizations
pluginCrushLDAPGroup.localization = {
	lblEnabledText : "Enabled",
	lblDebugText : "Debug",
	lblJavaRequiredNoteText : " This plugin requires Java 1.5 or higher to function. ",
	lblVersionText : "Version:",
	lblAllowedServerPortText : "Allowed Server Port: ",
	lblLDAPCacheTimeText : "LDAP Cache Time: ",
	lblUsernameForQueriesText : "Username For Queries: ",
	lblPasswordText : "Password: ",
	lblLDAPServerURLText : "LDAP Server URL: ",
	btnTestLoginSettingsText : "Test Connection Settings",
	lblSearchBaseLocationText : "Search Base Location: ",
	lblSearchFilterText : "Search Filter: ",
	btnTestSearchText : "Test Search",
	lblSearchNoteText : " Tree will be searched for a field that matches the username. In general this will be 'uid' or 'sAMAccountName'. ",
	lblLDAPRolesTheUserMustBeMemberOfText : "LDAP roles the user must be a member of: ",
	lblLeaveBlankForAllUsersNoteText : " Leave blank for all users. ",
	btnTestSearchRoleText : "Test Search Role",
	lblRoleMemberFieldText : "Role Member Field: ",
	lblRoleMemberFieldNoteText : " (memberOf, memberof, member, groupMembership, memberUid, memberuid, etc.) ",
	lblLDAPOnlyUsedForAuthenticationText : "LDAP only used for Authentication (User manager then defines user's access.)",
	lblHomeDirectoryFieldText : "HomeDirectory field: ",
	lblPrivsText : "Privs: ",
	lblHomeFolderNoteText : " (This field will be used for the users 'home' folder. If not found... see below.) ",
	lblCreateHomedirectoryIfNotExistText : "Create HomeDirectory folder if it doesn't exists.",
	lblUseLocalFolderText : "Use local folder if LDAP's HomeDirectory not found?",
	lblAppendUsernameToPathText : "Append username to path?",
	lblCreateFolderWithUsernameText : "Create folder with username",
	lblPathText : "Path: ",
	lblImportSettingsText : "Import settings from CrushFTP user: ",
	lblOverwriteVFSItemsText : "Overwrite VFS items?"
};

// Assign localizations
localizations.panels["Plugins"][pluginName] = $.extend(pluginCrushLDAPGroup.localization, localizations.panels["Plugins"][pluginName]);

// Interface methods
pluginCrushLDAPGroup.init = function(pluginID, returnXML){
	$("#ssh_private_key").each(function(){
		$(this).addClass('maskPasswordOnURL urlWithParams').closest('div').find('.serverFilePickButton').removeClass('serverFilePickButton').addClass('serverFilePickWithParamsButton');
	});
	pluginCrushLDAPGroup.returnXML = returnXML;
	applyLocalizations(pluginName, localizations.panels["Plugins"]);
	pluginCrushLDAPGroup.bindData(0, pluginID);
}

pluginCrushLDAPGroup.bindData = function(index, pluginID)
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
	pluginCrushLDAPGroup.showServerList();
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
		_panel.find(".advanced-options").addClass('closed').removeClass('open');
		var curPlugin = pluginPrefs;
		if(!pluginID && pluginPrefs.length)
		{
			curPlugin = pluginPrefs[index];
		}
		if(!curPlugin.allow_reverse || typeof curPlugin.allow_reverse == "undefined")
        {
            curPlugin.allow_reverse = [{text: "true"}];
        }
        if(!curPlugin.allow_forward || typeof curPlugin.allow_forward == "undefined")
        {
            curPlugin.allow_forward = [{text: "true"}];
        }

		pluginCrushLDAPGroup.bindPluginDetails(curPlugin);
		if($("#usernameTemplate", _plugin).val()=="")
		{
			$("#usernameTemplate", _plugin).val("default");
			panelPlugins.itemsChanged(true, pluginCrushLDAPGroup.returnXML, pluginName);
		}
		var service = common;
		if(pluginCrushLDAPGroup.returnXML)
		{
			service = crushFTP;
		}
		var server_item = service.data.getTextContentFromPrefs(curPlugin, "server_item") || "All";
		$("#server_items_list", _plugin).find("li").removeClass('ui-selected ui-widget-header disabled');
		if(server_item)
		{
			if($.isArray(server_item))
				server_item = server_item[0].text;
			var items = server_item.split(",");
			if(items.has("All") || items.has("all"))
			{
				_plugin.find("#server_item_all").addClass('ui-selected ui-widget-header');
				setTimeout(function(){
					_plugin.find("#server_item_all").click();
					pluginPlaceHolder.removeData("hasChanged");
				}, 200);
			}
			else
			{
				var serverPorts = $("#server_items_list", _plugin);
				serverPorts.find("li[name!='server_item_all']").each(function(){
					$(this).closest(".item").removeClass('disabled');
				});
				for (var i = 0; i < items.length; i++) {
					_plugin.find("li[server_name='"+items[i]+"']").addClass('ui-selected ui-widget-header');
				}
			}
		}

		var user_connection_groups = service.data.getTextContentFromPrefs(curPlugin, "user_connection_groups") || "All";
		$("#user_connection_groups", _plugin).find("li").removeClass('ui-selected ui-widget-header disabled');
		if(user_connection_groups)
		{
			if($.isArray(user_connection_groups))
				user_connection_groups = user_connection_groups[0].text;
			var items = user_connection_groups.split(",");
			if(items.has("All") || items.has("all"))
			{
				_plugin.find("#server_group_all").addClass('ui-selected ui-widget-header');
				setTimeout(function(){
					_plugin.find("#server_group_all").click();
					pluginPlaceHolder.removeData("hasChanged");
				}, 200);
			}
			else
			{
				var serverPorts = $("#user_connection_groups", _plugin);
				serverPorts.find("li[name!='server_group_all']").each(function(){
					$(this).closest(".item").removeClass('disabled');
				});
				for (var i = 0; i < items.length; i++) {
					_plugin.find("li[server_group='"+items[i]+"']").addClass('ui-selected ui-widget-header');
				}
			}
		}
	}
	pluginCrushLDAPGroup.loadedSubItem = index;
	pluginCrushLDAPGroup.bindEvents(index);
	if($("#authenticationOnly", _plugin).is(":checked"))
	{
		$("#authenticationOnly", _plugin).closest("p").nextAll().hide();
	}
	else
	{
		$("#authenticationOnly", _plugin).closest("p").nextAll().show();
	}
	if($("#useLocalDirectory", _plugin).is(":checked") && !$("#authenticationOnly", _plugin).is(":checked"))
	{
		$(".forLocalDirectory", _plugin).show();
	}
	else
	{
		$(".forLocalDirectory", _plugin).hide();
	}
	if($("#acl_permissions", _plugin).is(":checked"))
	{
		$(".ntfsSettings", _plugin).show();
	}
	else
	{
		$(".ntfsSettings", _plugin).hide();
	}
	if($("#notify_email_on_account_locked", _plugin).is(":checked"))
	{
		_plugin.find("p#notifyEmailTimeout").show();
	}
	else
	{
		_plugin.find("p#notifyEmailTimeout").hide();
	}
	var permissionsInput = $("#privs", _plugin);
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
			panelPlugins.bindAdvancedPrivs(advancedPrivs);
		}
		$('input[id$="privs_quota"]').trigger("custom-change");
	}
	_panel.find(".maskPasswordOnURL").trigger("applymask");
	setTimeout(function(){
		_panel.find(".SSHOptionsHandle").trigger("custevt");
	});
}

pluginCrushLDAPGroup.bindEvents = function()
{
	if(this.eventAdded)return;
	var advancedPrivsOptions = $("a#advancedPrivsOptions",_plugin).click(function(event) {
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
			advancedPrivsOptionsSubFolder.removeData("permissions");
			window.isAdvancedForSubFolder = false;
		}
		else
		{
			advancedPrivsOptions.data("permissions", data);
			rebuildPrivs();
		}
		itemsChanged(true);
		panelPlugins.itemsChanged(true);
	};

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
			data.privs = items.join("");
			item.data("controlData", data);
		}
	}

	var permissionsInput = $("#privs", _plugin);
	_plugin.find("input, select, textarea").bind("change", function(){
		if($(this).hasClass('permissionCB'))
		{
			rebuildPrivs();
			return false;
		}
		else if($(this).is("#authenticationOnly"))
		{
			if($(this).is(":checked"))
				$(this).closest("p").nextAll().hide();
			else{
				$(this).closest("p").nextAll().show();
				$("#useLocalDirectory", _plugin).trigger("change");
			}
		}
		else if($(this).is("#useLocalDirectory"))
		{
			if($(this).is(":checked"))
				_plugin.find(".forLocalDirectory").show();
			else
				_plugin.find(".forLocalDirectory").hide();
		}
		else if($(this).is("#multithreaded_s3_download"))
		{
			if($(this).is(":checked"))
				_plugin.find(".multiThreadDownloadOptions").show();
			else
				_plugin.find(".multiThreadDownloadOptions").hide().find("input").val("");
		}
		else if($(this).is("#multithreaded_s3"))
		{
			if($(this).is(":checked"))
				_plugin.find(".multiThreadUploadOptions").show();
			else
				_plugin.find(".multiThreadUploadOptions").hide().find("input").val("");
		}
		else if($(this).is("#acl_permissions"))
		{
			if($(this).is(":checked"))
			{
				_plugin.find(".ntfsSettings").show();
				crushFTP.UI.checkUnchekInput($("#smb_permissions", _plugin), false);
			}
			else
				_plugin.find(".ntfsSettings").hide();
		}
		else if($(this).is("#smb_permissions"))
		{
			if($(this).is(":checked"))
			{
				_plugin.find(".ntfsSettings").hide();
				crushFTP.UI.checkUnchekInput($("#acl_permissions", _plugin), false);
			}
		}
		if($(this).is("#notify_email_on_account_locked"))
		{
			if($(this).is(":checked"))
				_plugin.find("p#notifyEmailTimeout").show();
			else
				_plugin.find("p#notifyEmailTimeout").hide();
		}
		if($(this).hasClass('permissionCBSubFolder'))
		{
			rebuildPrivsSubFolder();
			return false;
		}
		panelPlugins.itemsChanged(true, pluginCrushLDAPGroup.returnXML, pluginName);
	});

	if($("#multithreaded_s3").is(":checked"))
		_plugin.find(".multiThreadUploadOptions").show();
	else
		_plugin.find(".multiThreadUploadOptions").hide().find("input").val("");

	if($("#multithreaded_s3_download").is(":checked"))
		_plugin.find(".multiThreadDownloadOptions").show();
	else
		_plugin.find(".multiThreadDownloadOptions").hide().find("input").val("");

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
		panelPlugins.itemsChanged(true, pluginCrushLDAPGroup.returnXML, pluginName);
	});


	$("a#testLogin, a#testSearch, a#testSearchRole, a#testLoginReport", _plugin).click(function(){
		var link = $(this);
		if(link.attr("disabled")) return false;
		panelPlugins.pluginMethodCallSaveCallback = function(flag){
			if(flag)
			{
				var title = "";
				var obj = {
					command : "pluginMethodCall",
					method : link.attr("id"),
					pluginName : "CrushLDAPGroup",
					pluginSubItem : pluginCrushLDAPGroup.loadedSubItem == 0 ? "" : _plugin.attr("subPluginName"),
					username : $("#adminUsername", _panel).val()
				};
				if(obj.method == "testLogin" || obj.method == "testLoginReport")
				{
					obj.password = crushFTP.methods.htmlEncode($("#adminPassword", _panel).val());
					title = "Testing Login";
				}
				else if(obj.method == "testSearch")
				{
					title = "Testing Search";
				}
				else if(obj.method == "testSearchRole")
				{
					title = "Testing Search Role";
				}
				function initCall()
				{
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
						crushFTP.UI.growl(crushFTP.methods.htmlEncode(title), DOMPurify.sanitize(decodeURIComponent($(msg).html())), false, false);
					});
				}
				if(obj.method == "testSearch"  || obj.method == "testSearchRole")
				{
					jPrompt("Enter test username:", "", "Test Search", function(val){
						if(val)
						{
							obj.username = val;
							initCall();
						}
					});
				}
				else if(obj.method == "testLoginReport")
				{
					delete obj.password;
					jPrompt("Username : ", "", "Test Login", function(value, other, pass){
						if(value)
						{
							obj.username = crushFTP.methods.htmlEncode(value);
							if(pass){
								crushFTP.data.encryptPass(pass, function(data){
									if(data)
									{
										generatedPass = unescape(data.response[0].text);
										obj.password = crushFTP.methods.htmlEncode(generatedPass);
										initCall();
									}
								});
							}
							else{
								initCall();
							}
						}
					}, false, false, {
						appendAfterInput : '<p><label for="password_for_test_login">Password :</label> <input type="password" placeholder="Optional" class="extraItem" id="password_for_test_login" name="password_for_test_login" style="width: 312px;margin-left: 5px;" /></p>'
					});
				}
				else
				{
					initCall();
				}
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
				val = relElem.data("realURL") || relElem.data("originalURL") || relElem.data("origURL") || relElem.val();
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
            if(existingData.user_home_config && typeof existingData.user_home_config.sharepoint_site_drive_name == "undefined")
            {
                existingData.user_home_config.sharepoint_site_drive_name = "Documents";
            }
            if(existingData.user_home_config && typeof existingData.user_home_config.s3_max_buffer_download == "undefined")
            {
                existingData.user_home_config.s3_max_buffer_download = "100";
            }
            if(existingData.user_home_config && typeof existingData.user_home_config.s3_buffer == "undefined")
            {
                existingData.user_home_config.s3_buffer = "5";
            }
            if(existingData.user_home_config && typeof existingData.user_home_config.s3_buffer_download == "undefined")
            {
                existingData.user_home_config.s3_buffer_download = "5";
            }
            if(existingData.user_home_config && typeof existingData.user_home_config.s3_acl == "undefined")
            {
                existingData.user_home_config.s3_acl = "private";
            }
            if(existingData.user_home_config && typeof existingData.user_home_config.s3_storage_class == "undefined")
            {
                existingData.user_home_config.s3_storage_class = "STANDARD";
            }
            if(existingData.user_home_config && typeof existingData.user_home_config.s3_threads_upload == "undefined")
            {
                existingData.user_home_config.s3_threads_upload = "3";
            }
            if(existingData.user_home_config && typeof existingData.user_home_config.s3_threads_download == "undefined")
            {
                existingData.user_home_config.s3_threads_download = "3";
            }
            if(existingData.user_home_config && typeof existingData.user_home_config.s3_meta_md5_and_upload_by == "undefined")
            {
                existingData.user_home_config.s3_meta_md5_and_upload_by = "true";
            }
            if(existingData.user_home_config && typeof existingData.user_home_config.multithreaded_s3_download == "undefined")
            {
                existingData.user_home_config.multithreaded_s3_download = existingData.user_home_config.multithreaded_s3 || "false";
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
				allowRootSelection: true,
				existingData : existingData,
				callback: function (selectedPath, ftpServerInfo) {
					var _path = ftpServerInfo.dir_path + "";
					ftpServerInfo.path = _path;
					$("#" + curElem.attr("rel"), _panel).val(ftpServerInfo.url).trigger("change");
					$("#" + curElem.attr("rel") + ".maskPasswordOnURL", _panel).removeData().trigger("applymask");
					var taskForm = _panel.find(".serverTypeOptions");
					var ignored = taskForm.find(".ignoreBind").removeClass("ignoreBind");
					ftpServerInfo[curElem.attr("rel")] = ftpServerInfo.url;
                    var tempControlData = ftpServerInfo;
                    if(tempControlData.use_dmz.indexOf("socks://") == 0 || tempControlData.use_dmz.indexOf("internal://") == 0 || tempControlData.use_dmz.indexOf("variable") == 0)
                    {
                        _plugin.find("#use_dmz").find("option[_rel='custom']").attr("value", tempControlData.use_dmz).text(tempControlData.use_dmz + " (custom)");
                    }
                    if(!tempControlData.timeout || typeof tempControlData.timeout == "undefined")
                    {
                        tempControlData.timeout = "20000";
                    }
                    if(!tempControlData.write_timeout || typeof tempControlData.write_timeout == "undefined")
                    {
                        tempControlData.write_timeout = "20000";
                    }
                    if(!tempControlData.read_timeout || typeof tempControlData.read_timeout == "undefined")
                    {
                        tempControlData.read_timeout = "20000";
                    }
                    if(!tempControlData.sharepoint_site_drive_name || typeof tempControlData.sharepoint_site_drive_name == "undefined")
		            {
		                tempControlData.sharepoint_site_drive_name = "Documents";
		            }
		            if(!tempControlData.s3_max_buffer_download || typeof tempControlData.s3_max_buffer_download == "undefined")
			        {
			            tempControlData.s3_max_buffer_download = "100";
			        }
			        if(!tempControlData.s3_buffer || typeof tempControlData.s3_buffer == "undefined")
			        {
			            tempControlData.s3_buffer = "5";
			        }
			        if(!tempControlData.s3_acl || typeof tempControlData.s3_acl == "undefined")
			        {
			            tempControlData.s3_acl = "private";
			        }
			        if(!tempControlData.s3_storage_class || typeof tempControlData.s3_storage_class == "undefined")
			        {
			            tempControlData.s3_storage_class = "STANDARD";
			        }
			        if(!tempControlData.s3_buffer_download || typeof tempControlData.s3_buffer_download == "undefined")
			        {
			            tempControlData.s3_buffer_download = "5";
			        }
			        if(!tempControlData.s3_threads_upload || typeof tempControlData.s3_threads_upload == "undefined")
			        {
			            tempControlData.s3_threads_upload = "3";
			        }
			        if(!tempControlData.s3_threads_download || typeof tempControlData.s3_threads_download == "undefined")
			        {
			            tempControlData.s3_threads_download = "3";
			        }
			        if(!tempControlData.s3_meta_md5_and_upload_by || typeof tempControlData.s3_meta_md5_and_upload_by == "undefined")
			        {
			            tempControlData.s3_meta_md5_and_upload_by = "true";
			        }
		            if(typeof tempControlData.multithreaded_s3_download == "undefined")
		            {
		                tempControlData.multithreaded_s3_download = tempControlData.multithreaded_s3 || "false";
		            }
                    window.applyingChanges = true;
                    if(curElem.hasClass("global"))
						bindValuesFromJson(taskForm, tempControlData);
                    if(tempControlData.use_dmz == "false" || tempControlData.use_dmz == "")
                    {
                        _plugin.find("#use_dmz").find("option:first").attr("selected", "selected");
                    }
                    window.applyingChanges = false;
					_panel.find(".SSHOptionsHandle").trigger("textchange");
					_panel.find(".encryptionMode").trigger("change");
					ignored.addClass("ignoreBind");
					setTimeout(function(){
						_panel.find(".SSHOptionsHandle").trigger("textchange");
						_panel.find(".maskPasswordOnURL").trigger("blur");
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
            if(existingData.user_home_config && typeof existingData.user_home_config.sharepoint_site_drive_name == "undefined")
            {
                existingData.user_home_config.sharepoint_site_drive_name = "Documents";
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
					panelPlugins.itemsChanged(true, pluginCrushLDAPGroup.returnXML, pluginName);
				}
			});
			return false;
		});
	});

	$("a.rolePickButton", _plugin).each(function(){
		$(this).unbind("click").click(function(){
			var curElem = $(this);
			curElem.crushFtpVFSBrowserPopup({
				type : "any",
				existingVal : $("#" + curElem.attr("rel"), _plugin).val(),
				roleBrowse : true,
				roleObj : {
					command : "pluginMethodCall",
					method : "testBrowseTree",
					pluginName : "CrushLDAPGroup",
					pluginSubItem : pluginCrushLDAPGroup.loadedSubItem == 0 ? "" : _plugin.attr("subPluginName")
				},
				callback : function(selectedPath){
					$("#" + curElem.attr("rel"), _plugin).val(selectedPath).trigger("change");
				}
			});
			return false;
		});
	});

	var ldapRolesList = $("#ldap_roles", _plugin);
	ldapRolesList.selectable({
		selected: function(event, ui) {
			var selected = $(ui.selected);
			ldapRolesList.find(".ui-widget-header").removeClass("ui-widget-header");
			selected.addClass("ui-widget-header");
			return false;
		}
	});

	$("a#removeRole", _plugin).click(function(){
		crushFTP.UI.removeItem(ldapRolesList, function(selected){
			panelPlugins.itemsChanged(true, pluginCrushLDAPGroup.returnXML, pluginName);
		});
		return false;
	});

	$("a#addNewRole", _plugin).click(function(evt, control){
		if(evt.altKey || evt.shiftKey)
		{
			pluginCrushLDAPGroup.editRoles();
			return false;
		}
		var role = "";
		if(control)
		{
			role = control.attr("role");
		}
		var appendHTML = "<div style='margin:5px 0px;'>Template Username : <br> <input style='margin:5px 0px;width:200px;' id='templateUsernameForRole' class='extraItem' type='text' value='' /></div>";
		if(role.length>0)
		{
			var _temp = role.split(":");
			if(_temp && _temp.length > 1)
			{
				role = $.trim(_temp[0]);
				appendHTML = "<div style='margin:5px 0px;'>Template Username : <br> <input style='margin:5px 0px;width:200px;' id='templateUsernameForRole' class='extraItem' type='text' value='"+ $.trim(_temp[1]) +"' /></div>";
			}
		}
		jPrompt("Enter LDAP role :", role, "Input", function(value, key, username){
			role = value;
			if(role!=null)
			{
				if(role.length == 0)
				{
					$("#addNewRole", _panel).trigger("click");
					return;
				}
				else
				{
					if(username && username.length>0)
					{
						role += " : " + username;
					}
				}
				if(control)
				{
					control.text(role).attr("role", role);
				}
				else
				{
					var newControl = $("<li class='ui-widget-content' role='"+crushFTP.methods.htmlEncode(role)+"'>" + crushFTP.methods.htmlEncode(role) +"</li>");
					ldapRolesList.append(newControl);
					newControl.parent().find(".ui-widget-header").removeClass("ui-widget-header").removeClass("ui-selected");
					newControl.addClass("ui-widget-header").addClass("ui-selected");
				}
				panelPlugins.itemsChanged(true, pluginCrushLDAPGroup.returnXML, pluginName);
			}
		}, false, false, {isWideTextBox:true, appendAfterInput : appendHTML});
		return false;
	});

	$("a#editRole", _plugin).click(function(evt){
		if(evt.altKey || evt.shiftKey)
		{
			pluginCrushLDAPGroup.editRoles();
			return false;
		}
		if(ldapRolesList.find("li.ui-selected").length>0)
		{
			var selected = ldapRolesList.find("li.ui-selected");
			$("#addNewRole", _panel).trigger("click", [selected]);
		}
		return false;
	});

	$("a#moveRoleUp", _plugin).click(function(){
		if(ldapRolesList.find("li.ui-selected").length>0)
		{
			var selected = ldapRolesList.find("li.ui-selected");
			selected.prev().before(selected);
			panelPlugins.itemsChanged(true, pluginCrushLDAPGroup.returnXML, pluginName);
		}
		return false;
	});

	$("a#moveRoleDown", _plugin).click(function(){
		if(ldapRolesList.find("li.ui-selected").length>0)
		{
			var selected = ldapRolesList.find("li.ui-selected");
			selected.next().after(selected);
			panelPlugins.itemsChanged(true, pluginCrushLDAPGroup.returnXML, pluginName);
		}
		return false;
	});

	var keysMapping = $("#keysMapping", _plugin);
	keysMapping.selectable({
		selected: function(event, ui) {
			var selected = $(ui.selected);
			keysMapping.find(".ui-widget-header").removeClass("ui-widget-header");
			selected.addClass("ui-widget-header");
			return false;
		}
	});

	$("a#removeMapping", _plugin).click(function(){
		crushFTP.UI.removeItem(keysMapping, function(selected){
			panelPlugins.itemsChanged(true, pluginCrushLDAPGroup.returnXML, pluginName);
		});
		return false;
	});

	$("a#addNewMapping", _plugin).click(function(evt, control){
			var mapping = "";
			if(control)
			{
				mapping = control.attr("mapping");
			}
			var appendHTML = "<div style='margin:5px 0px;'>CrushFTP Key : <br> <input style='margin:5px 0px;width:200px;' id='keyMappingValue' class='extraItem' type='text' value='' /></div>";
			if(mapping.length>0)
			{
				var _temp = mapping.split(":");
				if(_temp && _temp.length > 1)
				{
					mapping = $.trim(_temp[0]);
					appendHTML = "<div style='margin:5px 0px;'>CrushFTP Key : <br> <input style='margin:5px 0px;width:200px;' id='keyMappingValue' class='extraItem' type='text' value='"+ $.trim(_temp[1]) +"' /></div>";
				}
			}
			var notAllowedCharsInDirName = ":&#?<> ";
			jPrompt("LDAP Key :", mapping, "Input", function(value, key, username){
				mapping = value;
				if(mapping!=null)
				{
					mapping = $.trim(value);
					if(username)
						username = $.trim(username);
					//if(crushFTP.methods.hasSpecialCharacters(mapping, notAllowedCharsInDirName) || crushFTP.methods.hasSpecialCharacters(username, notAllowedCharsInDirName))
					//{
					//	alert("You can not have special characters in key-value mapping");
					//	$("#addNewMapping", _panel).trigger("click");
					//	return;
					//}
					if(mapping.length == 0)
					{
						$("#addNewMapping", _panel).trigger("click");
						return;
					}
					else
					{
						if(username && username.length>0)
						{
							mapping += " : " + username;
						}
					}
					if(control)
					{
						control.text(mapping).attr("mapping", mapping);
					}
					else
					{
						var newControl = $("<li class='ui-widget-content' mapping='"+crushFTP.methods.htmlEncode(mapping)+"'>" + crushFTP.methods.htmlEncode(mapping) +"</li>");
						keysMapping.append(newControl);
						newControl.parent().find(".ui-widget-header").removeClass("ui-widget-header").removeClass("ui-selected");
						newControl.addClass("ui-widget-header").addClass("ui-selected");
					}
					panelPlugins.itemsChanged(true, pluginCrushLDAPGroup.returnXML, pluginName);
				}
			}, false, false, {isWideTextBox2:true, appendAfterInput : appendHTML});
		return false;
	});

	$("a#editMapping", _plugin).click(function(){
		if(keysMapping.find("li.ui-selected").length>0)
		{
			var selected = keysMapping.find("li.ui-selected");
			$("#addNewMapping", _panel).trigger("click", [selected]);
		}
		return false;
	});

	var homeDirSubFolders = $("#homeDirSubFolders", _panel);
	homeDirSubFolders.selectableAdvanced({
		select: function(event, ui) {
			var selected = $(ui.selection);
			selected.parent().find(".ui-state-highlight").removeClass("ui-state-highlight");
			selected.parent().find(".ui-state-highlight, .ui-selected, .ui-widget-header, .ui-state-highlight, .ui-state-focus, .ui-state-active").removeClass("ui-state-highlight ui-selected ui-widget-header ui-state-highlight ui-state-focus ui-state-active");
			selected.addClass('ui-selected ui-widget-header');
			pluginCrushLDAPGroup.showSubFolderPrivs();
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

	var server_items_list = $("#server_items_list", _panel);
	var lastClickedSLI;
	server_items_list.find("li").unbind("click").bind("click", function(e) {
        var parent = $(this).closest("ol");
        if (e.ctrlKey || e.metaKey) {
            $(this).toggleClass('ui-selected ui-widget-header');
        }
        else if (e.shiftKey) {
            // Get the first possible element that is selected.
            var currentSelectedIndex = parent.find("li").index(lastClickedSLI);
            // Get the shift+click element
            var selectedElementIndex = parent.find("li").index($(this));

            parent.find("li").removeClass("ui-selected ui-widget-header");
            if (currentSelectedIndex < selectedElementIndex) {
                for (var indexOfRows = currentSelectedIndex; indexOfRows <= selectedElementIndex; indexOfRows++) {
                    parent.find("li").eq(indexOfRows).addClass('ui-selected ui-widget-header ');
                }
            } else {
                for (var indexOfRows = selectedElementIndex; indexOfRows <= currentSelectedIndex; indexOfRows++) {
                    parent.find("li").eq(indexOfRows).addClass('ui-selected ui-widget-header ');
                }
            }
        } else {
            $(this).addClass('ui-selected').siblings().removeClass('ui-selected');
            $(this).addClass('ui-widget-header').siblings().removeClass('ui-widget-header');
        }
        if(server_items_list.find("li[name!='server_item_all'].ui-selected").length == server_items_list.find("li").length-1)
    	{
    		server_items_list.find("#server_item_all").addClass('ui-selected ui-widget-header');
    	}
        if(server_items_list.find("#server_item_all").hasClass('ui-selected'))
        {
            server_items_list.find("li[name!='server_item_all']").each(function(){
                $(this).closest("li").addClass('disabled').removeClass('ui-selected ui-widget-header');
            });
        }
        else{
        	server_items_list.find(".disabled").removeClass('disabled');
        }
        lastClickedSLI = $(this);
        itemsChanged(true);
		panelPlugins.itemsChanged(true);
    });

	var user_connection_groups = $("#user_connection_groups", _panel);
	var lastClickedCG;
	user_connection_groups.find("li").unbind("click").bind("click", function(e) {
        var parent = $(this).closest("ol");
        if (e.ctrlKey || e.metaKey) {
            $(this).toggleClass('ui-selected ui-widget-header');
        }
        else if (e.shiftKey) {
            // Get the first possible element that is selected.
            var currentSelectedIndex = parent.find("li").index(lastClickedCG);
            // Get the shift+click element
            var selectedElementIndex = parent.find("li").index($(this));

            parent.find("li").removeClass("ui-selected ui-widget-header");
            if (currentSelectedIndex < selectedElementIndex) {
                for (var indexOfRows = currentSelectedIndex; indexOfRows <= selectedElementIndex; indexOfRows++) {
                    parent.find("li").eq(indexOfRows).addClass('ui-selected ui-widget-header ');
                }
            } else {
                for (var indexOfRows = selectedElementIndex; indexOfRows <= currentSelectedIndex; indexOfRows++) {
                    parent.find("li").eq(indexOfRows).addClass('ui-selected ui-widget-header ');
                }
            }
        } else {
            $(this).addClass('ui-selected').siblings().removeClass('ui-selected');
            $(this).addClass('ui-widget-header').siblings().removeClass('ui-widget-header');
        }
        if(user_connection_groups.find("li[name!='server_group_all'].ui-selected").length == user_connection_groups.find("li").length-1)
    	{
    		user_connection_groups.find("#server_group_all").addClass('ui-selected ui-widget-header');
    	}
        if(user_connection_groups.find("#server_group_all").hasClass('ui-selected'))
        {
            user_connection_groups.find("li[name!='server_group_all']").each(function(){
                $(this).closest("li").addClass('disabled').removeClass('ui-selected ui-widget-header');
            });
        }
        else{
        	user_connection_groups.find(".disabled").removeClass('disabled');
        }
        lastClickedCG = $(this);
        itemsChanged(true);
		panelPlugins.itemsChanged(true);
    });

	$('input[id$="privs_quota"]').each(function(){
		$(this).unbind('textchange.quota custom-change change').bind('textchange.quota custom-change change', function(event) {
			if($(this).val()){
				$(this).closest("fieldset").find('input[id$="privs_real_quota"]').attr("checked", "checked").attr("readonly", "readonly").closest("span").find("span").find("span").addClass("ui-icon ui-icon-check");
			}
			else{
				$(this).closest("fieldset").find('input[id$="privs_real_quota"]').removeAttr("readonly");
			}
		});
	});

	var notAllowedCharsInDirName = ":&#?<>";
	$("a#addNewSubFolder", _panel).click(function(evt){
		jPrompt("Enter Folder Name :", "untitled", "Input", function(value){
			if(value)
			{
				value = $.trim(value);
				if(homeDirSubFolders.find("li[rel='"+value.toLowerCase()+"']").length>0)
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
					pluginCrushLDAPGroup.showSubFolderPrivs();
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
            if(url)
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
            }
        });
	});

	_panel.find(".advanced-options h3").click(function(){
		$(this).parent().toggleClass('closed open');
	})

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
                elem.closest("div.actionConfigPanel").find(".dmzOption").show();
                elem.closest("div.actionConfigPanel").find(".smbOption").show();
                elem.closest("div.actionConfigPanel").find(".smbOnlyOption").show();
                elem.closest("div.actionConfigPanel").find(".smb3Option").show();
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

	 function showOnedriveOptions(){
        if(_panel.find("#onedrive_my_shares").is(":checked")){
            _panel.find(".onDriveShared").show();
            _panel.find(".onDriveSite").hide();
        }
        else if (_panel.find("#onedrive_site").is(":checked")){
            _panel.find(".onDriveShared").hide();
            _panel.find(".onDriveSite").show();
        }
    }

    _panel.find("#onedrive_my_shares, #onedrive_site").change(function(){
        showOnedriveOptions();
        return false;
    }).trigger("change");

	this.eventAdded = true;
};

pluginCrushLDAPGroup.showSubFolderPrivs = function(){
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
};

pluginCrushLDAPGroup.bindPluginDetails = function(controlData)
{
	var inputs = _plugin.find("input.ignoreBind,select.ignoreBind,textarea.ignoreBind").removeClass("ignoreBind");
	if(controlData)
	{
		if(typeof controlData.acl_permissions == "undefined")
			controlData.acl_permissions = [{ text: "false" }];
		if(typeof controlData.notify_email_on_account_locked == "undefined")
			controlData.notify_email_on_account_locked = [{ text: "false" }];
		if(typeof controlData.notify_email_cache_timeout == "undefined")
			controlData.notify_email_cache_timeout = [{ text: "30" }];
		if(typeof controlData.username_filter == "undefined")
			controlData.username_filter = [{ text: "*" }];
		if(typeof controlData.timeout == "undefined")
			controlData.timeout = [{ text: "30" }];
		if(typeof controlData.retry_fullusername_login == "undefined")
			controlData.retry_fullusername_login = [{text:"true"}];
		if(typeof controlData.acl_domain == "undefined")
			controlData.acl_domain = [{text:"local"}];
		if(typeof controlData.acl_groups_command == "undefined")
			controlData.acl_groups_command = [{text:"cmd /c dsquery user -samid {username} | dsget user -memberof -expand | dsget group -samid"}];
		if(controlData.user_home_config && typeof controlData.user_home_config[0].sharepoint_site_drive_name == "undefined")
			controlData.user_home_config[0].sharepoint_site_drive_name = [{ text: "Documents" }];
		if(controlData.user_home_config && typeof controlData.user_home_config[0].s3_max_buffer_download == "undefined")
			controlData.user_home_config[0].s3_max_buffer_download = [{text:"100"}];
		if(controlData.user_home_config && typeof controlData.user_home_config[0].s3_buffer == "undefined")
			controlData.user_home_config[0].s3_buffer = [{text:"5"}];
		if(controlData.user_home_config && typeof controlData.user_home_config[0].s3_buffer_download == "undefined")
			controlData.user_home_config[0].s3_buffer_download = [{text:"5"}];
		if(controlData.user_home_config && typeof controlData.user_home_config[0].s3_acl == "undefined")
			controlData.user_home_config[0].s3_acl = [{text:"private"}];
		if(controlData.user_home_config && typeof controlData.user_home_config[0].s3_storage_class == "undefined")
			controlData.user_home_config[0].s3_storage_class = [{text:"STANDARD"}];
		if(controlData.user_home_config && typeof controlData.user_home_config[0].s3_threads_upload == "undefined")
			controlData.user_home_config[0].s3_threads_upload = [{text:"3"}];
		if(controlData.user_home_config && typeof controlData.user_home_config[0].s3_threads_download == "undefined")
			controlData.user_home_config[0].s3_threads_download = [{text:"3"}];
		if(controlData.user_home_config && typeof controlData.user_home_config[0].s3_meta_md5_and_upload_by == "undefined")
			controlData.user_home_config[0].s3_meta_md5_and_upload_by = [{text:"true"}];
		if(controlData.user_home_config && typeof controlData.user_home_config[0].multithreaded_s3_download == "undefined")
			controlData.user_home_config[0].multithreaded_s3_download = controlData.user_home_config[0].multithreaded_s3 || [{ text: "false" }];
	}
	bindValuesFromXML(_plugin, controlData);
	if(controlData.user_home_config){
		bindValuesFromXML(_plugin.find(".serverTypeOptions"), controlData.user_home_config[0]);
	}
	if(controlData.subItem && controlData.subItem.length>0)
		_plugin.attr("subPluginName", controlData.subItem[0].text || "");
	inputs.addClass("ignoreBind");
	var ldapRolesList = $("#ldap_roles", _plugin).empty();
	if(controlData && controlData["ldap_roles"])
	{
		var ldap_roles = controlData["ldap_roles"];
		if(ldap_roles.length>0)
		{
			ldap_roles = ldap_roles[0].text;
			if(ldap_roles)
			{
				ldap_roles = ldap_roles.split("\n");
				for(var i=0;i<ldap_roles.length;i++)
				{
					var curItem = ldap_roles[i];
					if(curItem)
					{
						curItem = $.trim(curItem);
						var newControl = $("<li class='ui-widget-content' role='"+crushFTP.methods.htmlEncode(curItem)+"'>" + crushFTP.methods.htmlEncode(curItem) +"</li>");
						ldapRolesList.append(newControl);
						newControl.data("controlData", curItem);
					}
				}
			}
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
	var keysMapping = $("#keysMapping", _panel).empty();
	if(controlData.key_mappings && controlData.key_mappings.length>0 && controlData.key_mappings[0].text)
	{
		var mappings = controlData.key_mappings[0].text.split("\n");
		if(mappings.length>0)
		{
			for (var i = 0; i < mappings.length; i++) {
				var curDir = mappings[i];
				if(curDir)
				{
					var newControl = $('<li class="ui-widget-content" mapping="'+crushFTP.methods.htmlEncode(curDir)+'">' + crushFTP.methods.htmlEncode(curDir) + '</li>');
					keysMapping.append(newControl);
					if(newControl)
					{
						newControl.addClass("ui-widget-content ui-selectable-item");
						try{
							homeDirSubFolders.selectableAdvanced("refresh");
						}catch(ex){}
					}
				}
			};
		}
	}
}

pluginCrushLDAPGroup.editRoles = function(){
	var ldapRolesList = $("#ldap_roles", _plugin);
	var roles = "";
	ldapRolesList.find("li[role]").each(function(){
		if(roles.length>0)
			roles += "\n";
		roles += $(this).attr("role");
	});
	jPrompt("Map Roles (user : role) : ", roles, "Input :", function(val){
		if(val != null){
			val = $.trim(val);
			ldapRolesList.empty();
			var items = val.split("\n");
			for (var i = 0; i < items.length; i++) {
				var role = items[i];
				if(role)
				{
					var newControl = $("<li class='ui-widget-content' role='"+crushFTP.methods.htmlEncode(role)+"'>" + crushFTP.methods.htmlEncode(role) +"</li>");
					ldapRolesList.append(newControl);
					newControl.parent().find(".ui-widget-header").removeClass("ui-widget-header").removeClass("ui-selected");
					newControl.addClass("ui-widget-header").addClass("ui-selected");
				}
			}
			panelPlugins.itemsChanged(true, pluginCrushLDAPGroup.returnXML, pluginName);
		}
	}, false, false, {
		isTextArea : true
	});
}

pluginCrushLDAPGroup.showServerList = function()
{
	if(!this.serverListShown)
	{
		var service = common;
		if(pluginCrushLDAPGroup.returnXML)
		{
			service = crushFTP;
		}
		var serverList = service.data.getSubValueFromPrefs("server_list");
		var serverPorts = $("#server_items_list", _plugin).empty();
		for(var i=0;i<serverList.length;i++)
		{
			var curItem = serverList[i];
			if(curItem)
			{
				var serverType = service.data.getTextContentFromPrefs(curItem, "serverType");
				var ip = service.data.getTextContentFromPrefs(curItem, "ip");
				var port = service.data.getTextContentFromPrefs(curItem, "port");
				var server = ip + "_" + port;
				var newControl = $('<li class="ui-widget-content" server_name="'+crushFTP.methods.htmlEncode(server)+'" name="server_item_'+crushFTP.methods.htmlEncode(server)+'" id="server_item_'+crushFTP.methods.htmlEncode(server)+'">' + crushFTP.methods.htmlEncode(server) + '</li>');
				serverPorts.append(newControl);
				if(newControl)
				{
					newControl.addClass("ui-widget-content ui-selectable-item");
				}
				serverPorts.append(newControl);
				newControl.data("controlData", curItem);
			}
		}
		serverPorts.prepend('<li class="ui-widget-content" server_name="all" name="server_item_all" id="server_item_all">All</li>');

		var groupList = service.data.getSubValueFromPrefs("server_groups");
		var serverConnections = $("#user_connection_groups", _plugin).empty();
		for(var i=0;i<groupList.length;i++)
		{
			var curItem = groupList[i];
			if(curItem)
			{
				var serverGroup = curItem.text;
				var newControl = $('<li class="ui-widget-content" server_group="'+crushFTP.methods.htmlEncode(serverGroup)+'" name="server_group_'+crushFTP.methods.htmlEncode(serverGroup)+'" id="server_group_'+crushFTP.methods.htmlEncode(serverGroup)+'">' + crushFTP.methods.htmlEncode(serverGroup) + '</li>');
				serverConnections.append(newControl);
				if(newControl)
				{
					newControl.addClass("ui-widget-content ui-selectable-item");
				}
				serverConnections.append(newControl);
				newControl.data("controlData", curItem);
			}
		}
		serverConnections.prepend('<li class="ui-widget-content" server_name="all" name="server_group_all" id="server_group_all">All</li>');
		this.serverListShown = true;
	}
}

pluginCrushLDAPGroup.saveContent = function(saveByIndex, cloneName, removeByIndex, callback, noGrowl)
{
	removeByIndex = removeByIndex || 0;
	if(pluginPlaceHolder.data("hasChanged") || removeByIndex>0 || (saveByIndex>0 && cloneName) || pluginCrushLDAPGroup.returnXML)
	{
		if(!pluginCrushLDAPGroup.returnXML)
			crushFTP.UI.showIndicator(false, false, "Please wait..");
		var xmlString = [];
		var container = _plugin;
		if(removeByIndex == 0)
		{
			xmlString.push("<plugins_subitem type=\"properties\">");
			xmlString.push("<version>"+$("#version", _plugin).text()+"</version>");
			xmlString.push("<pluginName>"+pluginName+"</pluginName>");
			var ldapRoles = $("#ldap_roles", container).find("li");
			if(ldapRoles.length>0)
			{
				xmlString.push("<ldap_roles>");
				ldapRoles.each(function(){
					xmlString.push(crushFTP.methods.htmlEncode($(this).attr("role")));
				});
				xmlString.push("</ldap_roles>");
			}
			else
			{
				xmlString.push("<ldap_roles></ldap_roles>");
			}
			var additionalDirs = [];
			$("#homeDirSubFolders").find("li").each(function(index, el) {
				var data = $(this).data("controlData");
				if(data)
				{
					var name = data.name;
					var privs = data.privs;
					if(privs)
						additionalDirs.push(name+":"+privs);
					else
						additionalDirs.push(name);
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

			var ignored = _plugin.find(".serverTypeOptions").find("input, select, textarea, .ignoreBind").addClass("ignoreBind");
			ignored.removeClass('ignoreBind');
			_plugin.find(".SSHOptionsHandle").trigger("textchange");
			var user_home_config = buildXMLToSubmitForm(_plugin.find(".serverTypeOptions"), true);
			ignored.addClass("ignoreBind");
			xmlString.push("<user_home_config type=\"properties\">");
			xmlString.push(user_home_config);
			xmlString.push("</user_home_config>");

			var keysMappingItems = [];
			$("#keysMapping", _plugin).find("li").each(function(index, el) {
				var data = $(this).attr("mapping");
				if(data)
				{
					keysMappingItems.push(data);
				}
			});
			if(keysMappingItems.length>0)
			{
				xmlString.push("<key_mappings>"+crushFTP.methods.htmlEncode(keysMappingItems.join("\n"))+"</key_mappings>");
			}
			else
			{
				xmlString.push("<key_mappings></key_mappings>");
			}

			var server_items_list = [];
			$("#server_items_list", _plugin).find("li.ui-widget-header").each(function(index, el) {
				var data = $(this).attr("server_name");
				if(data)
				{
					server_items_list.push(data);
				}
			});
			if(server_items_list.length>0)
			{
				xmlString.push("<server_item>"+crushFTP.methods.htmlEncode(server_items_list.join(","))+"</server_item>");
			}
			else
			{
				xmlString.push("<server_item>All</server_item>");
			}

			var user_connection_groups = [];
			$("#user_connection_groups", _plugin).find("li.ui-widget-header").each(function(index, el) {
				var data = $(this).attr("server_group");
				if(data)
				{
					user_connection_groups.push(data);
				}
			});
			if(user_connection_groups.length>0)
			{
				xmlString.push("<user_connection_groups>"+crushFTP.methods.htmlEncode(user_connection_groups.join(","))+"</user_connection_groups>");
			}
			else
			{
				xmlString.push("<user_connection_groups>All</user_connection_groups>");
			}

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

		if(pluginCrushLDAPGroup.returnXML)
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
			callback(true);
	}
}