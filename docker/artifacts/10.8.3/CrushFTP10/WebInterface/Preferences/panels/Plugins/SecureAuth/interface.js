/****************************
CrushFTP GUI Plugin custom js
*****************************/
/* Do not change these lines */
var pluginSecureAuth = {};
pluginSecureAuth.localization = {};
/****************************/

// Plugin details
var pluginName = "SecureAuth";
var _plugin = $("#pnlPlugin" + pluginName);

// Localizations
pluginSecureAuth.localization = {
	lblEnabledText : "Enabled",
	lblDebugText : "Debug",
	lblVersionText : "Version:",
	lblAuthenticatorText : "Authenticator Type: ",
	lblUsernameTemplateText : "Username to use as template (except directory access): ",
	lblPermissionsText : "Directory Permissions: ",
	lblServerItemText : "Server Item: ",
	lblServerItemNoteText :  "You can specify which server item will use this plugin. Example 	lookup_21, or lookup_8080",
	lblRadiusHostText : "Server Host: ",
	lblRadiusPortText : "Port: ",
	lblNASPortText : "NAS Port: ",
	lblRetriesText : "Retries: ",
	lblTimeoutText : "Timeout (s): ",
	lblSharedSecretText : "Shared Secret: ",
	lblHomeFolderLocationText : "Home folder location: ",
	btnBrowseText : "Browse",
	lblHomeFolderNoteText : "Username folder will be made in this location"
};

// Assign localizations
localizations.panels["Plugins"][pluginName] = $.extend(pluginSecureAuth.localization, localizations.panels["Plugins"][pluginName]);

// Interface methods
pluginSecureAuth.init = function(pluginID, returnXML){
	pluginSecureAuth.returnXML = returnXML;
	applyLocalizations(pluginName, localizations.panels["Plugins"]);
	pluginSecureAuth.bindData(0, pluginID);
	if(!$(document).data("app_enterprise"))
	{
		$("#pluginSection", _panel).block({ message: null, overlayCSS: { opacity: 0.1, cursor: 'normal'} });
		$(".enterpriseFeatureTag", _plugin).show();
	}
	else
	{
		$(".enterpriseFeatureTag", _plugin).hide();
	}
}

pluginSecureAuth.bindData = function(index, pluginID)
{
	index = index || 0;
	var pluginPrefs = [];
	pluginSecureAuth.showServerList();
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
		pluginSecureAuth.bindPluginDetails(curPlugin);
	}
	pluginSecureAuth.loadedSubItem = index;
	pluginSecureAuth.bindEvents(index);
	if($("#authenticationOnly", _plugin).is(":checked"))
	{
		$(".authenticationOnlyItems").hide();
	}
	else
	{
		$(".authenticationOnlyItems").show();
	}
	if($("#useLocalDirectory", _plugin).is(":checked"))
	{
		$(".forLocalDirectory", _plugin).show();
	}
	else
	{
		$(".forLocalDirectory", _plugin).hide();
	}
	$('input[id$="privs_quota"]').trigger("custom-change");
}

pluginSecureAuth.bindEvents = function()
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

	var permissionsInput = $("#permissions", _plugin);
	_plugin.find("input, select, textarea").bind("textchange", function(){

	});
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
		if($(this).is("#useLocalDirectory"))
		{
			if($(this).is(":checked"))
				$(this).closest("p").find(".forLocalDirectory").show();
			else
				$(this).closest("p").find(".forLocalDirectory").hide();
		}
		if($(this).is("#authenticationOnly"))
		{
			if($(this).is(":checked"))
				$(".authenticationOnlyItems").hide();
			else
				$(".authenticationOnlyItems").show();
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
		if($(this).hasClass('permissionCBSubFolder'))
		{
			// console.log($(this));
			// var items = [];
			// $(".permissionCBSubFolder:checked", _plugin).each(function(){
			// 	items.push($(this).attr("rel"));
			// });
			// $(".permissionItemSubFolder", _plugin).each(function(){
			// 	if($(this).val())
			// 	{
			// 		if($(this).attr("id") == "subfolder_privs_quota")
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
			// 			items.push("(" + $(this).attr("id").replace("subfolder_privs_", "") + escape($(this).val()) + ")");
			// 	}
			// });
			// var homeDirSubFolders = $("#homeDirSubFolders", _panel);
			// var item = homeDirSubFolders.find("li.ui-selected");
			// if(item.length>0)
			// {
			// 	var data = item.data("controlData");
			// 	data.privs = items.join("");
			// 	item.data("controlData", data);
			// }
			rebuildPrivsSubFolder();
			return false;
		}
		panelPlugins.itemsChanged(true, pluginSecureAuth.returnXML, pluginName);
	});

	_plugin.find("input[type='text'], textarea").bind("textchange", function(){
		if($(this).hasClass('permissionItem'))
		{
			rebuildPrivs();
			return false;
		}
		else if($(this).hasClass('permissionItemSubFolder'))
		{
			// var items = [];
			// $(".permissionCBSubFolder:checked", _plugin).each(function(){
			// 	items.push($(this).attr("rel"));
			// });
			// $(".permissionItemSubFolder", _plugin).each(function(){
			// 	if($(this).val())
			// 	{
			// 		if($(this).attr("id") == "subfolder_privs_quota")
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
			// 			items.push("(" + $(this).attr("id").replace("subfolder_privs_", "") + escape($(this).val()) + ")");
			// 	}
			// });
			// var homeDirSubFolders = $("#homeDirSubFolders", _panel);
			// var item = homeDirSubFolders.find("li.ui-selected");
			// if(item.length>0)
			// {
			// 	var data = item.data("controlData");
			// 	data.privs = items.join("");
			// 	item.data("controlData", data);
			// }
			rebuildPrivsSubFolder();
		}
		panelPlugins.itemsChanged(true, pluginSecureAuth.returnXML, pluginName);
	});

	$("a.serverFilePickButton", _plugin).each(function(){
		$(this).unbind("click").click(function(){
			var curElem = $(this);
            var rel = curElem.attr("rel");
            var pickingFor = curElem.parent().parent().parent().find("label[for='"+rel+"']").text() || "";
            pickingFor = $.trim($.trim(pickingFor).replace(":", ""));
			curElem.crushFtpLocalFileBrowserPopup({
				type : curElem.attr("PickType") || 'dir',
				pickingFor: pickingFor,
				existingVal : $("#" + curElem.attr("rel"), _plugin).val(),
				callback : function(selectedPath){
					$("#" + curElem.attr("rel"), _plugin).val(selectedPath).trigger("change");
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
			pluginSecureAuth.showSubFolderPrivs();
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
					pluginSecureAuth.showSubFolderPrivs();
					itemsChanged(true);
					panelPlugins.itemsChanged(true);
				}
			});
		}
		return false;
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
	var radiusRolesList = $("#sa_roles", _plugin);
	radiusRolesList.selectable({
		selected: function(event, ui) {
			var selected = $(ui.selected);
			radiusRolesList.find(".ui-widget-header").removeClass("ui-widget-header");
			selected.addClass("ui-widget-header");
			return false;
		}
	});

	$("a#removeRole", _plugin).click(function(){
		crushFTP.UI.removeItem(radiusRolesList, function(selected){
			panelPlugins.itemsChanged(true, pluginSecureAuth.returnXML, pluginName);
		});
		return false;
	});

	$("a#addNewRole", _plugin).click(function(evt, control){
		if(evt.altKey || evt.shiftKey)
		{
			pluginSecureAuth.editRoles();
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
		jPrompt("Enter role :", role, "Input", function(value, key, username){
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
					radiusRolesList.append(newControl);
					newControl.parent().find(".ui-widget-header").removeClass("ui-widget-header").removeClass("ui-selected");
					newControl.addClass("ui-widget-header").addClass("ui-selected");
				}
				panelPlugins.itemsChanged(true, pluginSecureAuth.returnXML, pluginName);
			}
		}, false, false, {isWideTextBox:true, appendAfterInput : appendHTML});
		return false;
	});

	$("a#editRole", _plugin).click(function(evt){
		if(evt.altKey || evt.shiftKey)
		{
			pluginSecureAuth.editRoles();
			return false;
		}
		if(radiusRolesList.find("li.ui-selected").length>0)
		{
			var selected = radiusRolesList.find("li.ui-selected");
			$("#addNewRole", _panel).trigger("click", [selected]);
		}
		return false;
	});

	$("a#moveRoleUp", _plugin).click(function(){
		if(radiusRolesList.find("li.ui-selected").length>0)
		{
			var selected = radiusRolesList.find("li.ui-selected");
			selected.prev().before(selected);
			panelPlugins.itemsChanged(true, pluginSecureAuth.returnXML, pluginName);
		}
		return false;
	});

	$("a#moveRoleDown", _plugin).click(function(){
		if(radiusRolesList.find("li.ui-selected").length>0)
		{
			var selected = radiusRolesList.find("li.ui-selected");
			selected.next().after(selected);
			panelPlugins.itemsChanged(true, pluginSecureAuth.returnXML, pluginName);
		}
		return false;
	});
	this.eventAdded = true;
};

pluginSecureAuth.editRoles = function(){
	var radiusRolesList = $("#sa_roles", _plugin);
	var roles = "";
	radiusRolesList.find("li[role]").each(function(){
		if(roles.length>0)
			roles += "\n";
		roles += $(this).attr("role");
	});
	jPrompt("Map Roles (user : role): ", roles, "Input :", function(val){
		if(val != null){
			val = $.trim(val);
			radiusRolesList.empty();
			var items = val.split("\n");
			for (var i = 0; i < items.length; i++) {
				var role = items[i];
				if(role)
				{
					var newControl = $("<li class='ui-widget-content' role='"+crushFTP.methods.htmlEncode(role)+"'>" + crushFTP.methods.htmlEncode(role) +"</li>");
					radiusRolesList.append(newControl);
					newControl.parent().find(".ui-widget-header").removeClass("ui-widget-header").removeClass("ui-selected");
					newControl.addClass("ui-widget-header").addClass("ui-selected");
				}
			}
			panelPlugins.itemsChanged(true, pluginSecureAuth.returnXML, pluginName);
		}
	}, false, false, {
		isTextArea : true
	});
}

pluginSecureAuth.showSubFolderPrivs = function(){
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
					encryption : {}
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
			}
			$('input[id$="privs_quota"]').trigger("custom-change");
		}
	}
};

pluginSecureAuth.bindPluginDetails = function(controlData)
{
	var inputs = _plugin.find("input.ignoreBind,select.ignoreBind,textarea.ignoreBind").removeClass("ignoreBind");
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
			encryption : {}
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
	}
	var radiusRolesList = $("#sa_roles", _plugin).empty();
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
						radiusRolesList.append(newControl);
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
}

pluginSecureAuth.showServerList = function()
{
	if(!this.serverListShown)
	{
		var service = common;
		if(pluginSecureAuth.returnXML)
		{
			service = crushFTP;
		}
		var serverList = service.data.getSubValueFromPrefs("server_list");
		var serverPorts = $("#server_item", _plugin).empty();
		for(var i=0;i<serverList.length;i++)
		{
			var curItem = serverList[i];
			if(curItem)
			{
				var serverType = service.data.getTextContentFromPrefs(curItem, "serverType");
				var ip = service.data.getTextContentFromPrefs(curItem, "ip");
				var port = service.data.getTextContentFromPrefs(curItem, "port");
				var server = ip + "_" + port;
				var newControl = $("<option>"+server+"</option>");
				serverPorts.append(newControl);
				newControl.data("controlData", curItem);
			}
		}
		serverPorts.prepend("<option selected>All</option>");
		this.serverListShown = true;
	}
}

pluginSecureAuth.saveContent = function(saveByIndex, cloneName, removeByIndex, callback, noGrowl)
{
	removeByIndex = removeByIndex || 0;
	if(pluginPlaceHolder.data("hasChanged") || removeByIndex>0 || (saveByIndex>0 && cloneName) || pluginSecureAuth.returnXML)
	{
		if(!pluginSecureAuth.returnXML)
			crushFTP.UI.showIndicator(false, false, "Please wait..");
		var xmlString = [];
		var container = _plugin;
		if(removeByIndex == 0)
		{
			xmlString.push("<plugins_subitem type=\"properties\">");
			xmlString.push("<version>"+$("#version", _plugin).text()+"</version>");
			xmlString.push("<pluginName>"+pluginName+"</pluginName>");
			var radiusRoles = $("#sa_roles", container).find("li");
			if(radiusRoles.length>0)
			{
				xmlString.push("<ldap_roles>");
				radiusRoles.each(function(){
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

		if(pluginSecureAuth.returnXML)
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