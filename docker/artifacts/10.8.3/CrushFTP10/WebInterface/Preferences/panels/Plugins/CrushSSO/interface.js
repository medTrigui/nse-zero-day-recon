/****************************
CrushFTP GUI Plugin custom js
*****************************/
/* Do not change these lines */
var pluginCrushSSO = {};
pluginCrushSSO.localization = {};
/****************************/

// Plugin details
var pluginName = "CrushSSO";
var _plugin = $("#pnlPlugin" + pluginName);

// Localizations
pluginCrushSSO.localization = {
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
	lblImportSettingsText : "Import settings from user: ",
	lblOverwriteVFSItemsText : "Overwrite VFS items?"
};

// Assign localizations
localizations.panels["Plugins"][pluginName] = $.extend(pluginCrushSSO.localization, localizations.panels["Plugins"][pluginName]);

// Interface methods
pluginCrushSSO.init = function(pluginID, returnXML){
	pluginCrushSSO.returnXML = returnXML;
	applyLocalizations(pluginName, localizations.panels["Plugins"]);
	pluginCrushSSO.bindData(0, pluginID);
}

pluginCrushSSO.bindData = function(index, pluginID)
{
	index = index || 0;
	var pluginPrefs = [];
	pluginCrushSSO.showServerList();
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
		pluginCrushSSO.bindPluginDetails(curPlugin);
		if($("#usernameTemplate", _plugin).val()=="")
		{
			$("#usernameTemplate", _plugin).val("default");
			panelPlugins.itemsChanged(true, pluginCrushSSO.returnXML, pluginName);
		}
		var service = common;
		if(pluginCrushSSO.returnXML)
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
	pluginCrushSSO.loadedSubItem = index;
	pluginCrushSSO.bindEvents(index);
	if($("#authenticationOnly", _plugin).is(":checked"))
	{
		$("#authenticationOnly", _plugin).closest("p").nextAll().hide();
	}
	else
	{
		$("#authenticationOnly", _plugin).closest("p").nextAll().show();
	}
	if($("#useLocalDirectory", _plugin).is(":checked"))
	{
		$(".forLocalDirectory", _plugin).show();
	}
	else
	{
		$(".forLocalDirectory", _plugin).hide();
	}
}

pluginCrushSSO.bindEvents = function()
{
	if(this.eventAdded)return;
	var advancedPrivsOptions = $("a#advancedPrivsOptions",_plugin).click(function(event) {
		_panel.fieldAdvancedDialog.dialog("open");
		return false;
	});

	function rebuildPrivs(){
		permissionsInputAddon.val("");
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
			permissionsInputAddon.val(items.join("")).trigger("change");
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

	var permissionsInputAddon = $("#addon_privs", _plugin);
	_plugin.find("input, select, textarea").bind("change", function(){
		if($(this).hasClass('permissionCB'))
		{
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
						$(this).closest(".item").addClass('disabled');
					});
					$("#server_item").val("All").trigger('change');
				}
				else
				{
					serverPorts.find("input[name!='server_item_All']").each(function(){
						$(this).closest(".item").removeClass('disabled').end().trigger('change');
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
		if($(this).is("#authenticationOnly"))
		{
			if($(this).is(":checked"))
				$(this).closest("p").nextAll().hide();
			else
				$(this).closest("p").nextAll().show();
		}
		else if($(this).is("#useLocalDirectory"))
		{
			if($(this).is(":checked"))
				$(this).closest("p").find(".forLocalDirectory").show();
			else
				$(this).closest("p").find(".forLocalDirectory").hide();
		}
		if($(this).hasClass('permissionCBSubFolder'))
		{
			rebuildPrivsSubFolder();
			return false;
		}
		panelPlugins.itemsChanged(true, pluginCrushSSO.returnXML, pluginName);
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
		panelPlugins.itemsChanged(true, pluginCrushSSO.returnXML, pluginName);
	});


	$("a#testLogin, a#testSearch, a#testSearchRole", _plugin).click(function(){
		var link = $(this);
		if(link.attr("disabled")) return false;
		panelPlugins.pluginMethodCallSaveCallback = function(flag){
			if(flag)
			{
				var title = "";
				var obj = {
					command : "pluginMethodCall",
					method : link.attr("id"),
					pluginName : "CrushSSO",
					pluginSubItem : pluginCrushSSO.loadedSubItem == 0 ? "" : _plugin.attr("subPluginName"),
					username : $("#adminUsername", _panel).val()
				}
				if(obj.method == "testLogin")
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
						crushFTP.UI.growl(title, DOMPurify.sanitize(decodeURIComponent($(msg).html())), false, false);
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
			panelPlugins.itemsChanged(true, pluginCrushSSO.returnXML, pluginName);
		});
		return false;
	});

	$("a#addNewRole", _plugin).click(function(evt, control){
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
				panelPlugins.itemsChanged(true, pluginCrushSSO.returnXML, pluginName);
			}
		}, false, false, {isWideTextBox:true, appendAfterInput : appendHTML});
		return false;
	});

	$("a#editRole", _plugin).click(function(){
		if(ldapRolesList.find("li.ui-selected").length>0)
		{
			var selected = ldapRolesList.find("li.ui-selected");
			$("#addNewRole", _panel).trigger("click", [selected]);
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
			pluginCrushSSO.showSubFolderPrivs();
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
					pluginCrushSSO.showSubFolderPrivs();
					itemsChanged(true);
					panelPlugins.itemsChanged(true);
				}
			});
		}
		return false;
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

    _panel.find(".advanced-options h3").click(function(){
		$(this).parent().toggleClass('closed open');
	});

	this.eventAdded = true;
}

pluginCrushSSO.showSubFolderPrivs = function(){
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
				$('input[id$="privs_quota"]').trigger("custom-change");
			}
		}
	}
};

pluginCrushSSO.bindPluginDetails = function(controlData)
{
	if(controlData && typeof controlData.timeout == "undefined")
		controlData.timeout = [{ text: "30" }];

	var inputs = _plugin.find("input.ignoreBind,select.ignoreBind,textarea.ignoreBind").removeClass("ignoreBind");
	bindValuesFromXML(_plugin, controlData);
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
	var permissionsInputAddon = $("#addon_privs", _plugin);
	var permissionsInputVal = permissionsInputAddon.val();
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
}

pluginCrushSSO.showServerList = function()
{
	if(!this.serverListShown)
	{
		var service = common;
		if(pluginCrushSSO.returnXML)
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

pluginCrushSSO.saveContent = function(saveByIndex, cloneName, removeByIndex, callback, noGrowl)
{
	removeByIndex = removeByIndex || 0;
	if(pluginPlaceHolder.data("hasChanged") || removeByIndex>0 || (saveByIndex>0 && cloneName) || pluginCrushSSO.returnXML)
	{
		if(!pluginCrushSSO.returnXML)
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

		if(pluginCrushSSO.returnXML)
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