/****************************
CrushFTP GUI Plugin custom js
*****************************/
/* Do not change these lines */
var pluginSharedLogin = {};
pluginSharedLogin.localization = {};
/****************************/

// Plugin details
var pluginName = "SharedLogin";
var _plugin = $("#pnlPlugin" + pluginName);

// Localizations
pluginSharedLogin.localization = {
	lblEnabledText : "Enabled",
	lblDebugText : "Debug",
	lblPrivsText : "Privs: ",
	lblHomeFolderNoteText : " (This field will be used for the users 'home' folder. If not found... see below.) ",
	lblAppendUsernameToPathText : "Append username to path?",
	lblCreateFolderWithUsernameText : "Create folder with username",
	lblPathText : "Path: ",
	lblImportSettingsText : "Import settings from CrushFTP user: ",
	lblOverwriteVFSItemsText : "Overwrite VFS items?"
};

// Assign localizations
localizations.panels["Plugins"][pluginName] = $.extend(pluginSharedLogin.localization, localizations.panels["Plugins"][pluginName]);

// Interface methods
pluginSharedLogin.init = function(pluginID, returnXML){
	pluginSharedLogin.returnXML = returnXML;
	applyLocalizations(pluginName, localizations.panels["Plugins"]);
	pluginSharedLogin.bindData(0, pluginID);
}

pluginSharedLogin.bindData = function(index, pluginID)
{
	index = index || 0;
	var pluginPrefs = [];
	pluginSharedLogin.showServerList();
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
		pluginSharedLogin.bindPluginDetails(curPlugin);
		if($("#usernameTemplate", _plugin).val()=="")
		{
			$("#usernameTemplate", _plugin).val("default");
			panelPlugins.itemsChanged(true, pluginSharedLogin.returnXML, pluginName);
		}

	}
	pluginSharedLogin.loadedSubItem = index;
	pluginSharedLogin.bindEvents(index);
}

pluginSharedLogin.bindEvents = function()
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
		advancedPrivsOptions.data("permissions", data);
		rebuildPrivs();
	}

	var permissionsInput = $("#privs", _plugin);
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
		panelPlugins.itemsChanged(true, pluginSharedLogin.returnXML, pluginName);
	});

	_plugin.find("input[type='text'], textarea").bind("textchange", function(){
		if($(this).hasClass('permissionItem'))
		{
			rebuildPrivs();
			return false;
		}
		panelPlugins.itemsChanged(true, pluginSharedLogin.returnXML, pluginName);
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

	this.eventAdded = true;
}

pluginSharedLogin.bindPluginDetails = function(controlData)
{
	var inputs = _plugin.find("input.ignoreBind,select.ignoreBind,textarea.ignoreBind").removeClass("ignoreBind");
	bindValuesFromXML(_plugin, controlData);
	if(controlData.subItem && controlData.subItem.length>0)
		_plugin.attr("subPluginName", controlData.subItem[0].text || "");
	inputs.addClass("ignoreBind");
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

pluginSharedLogin.showServerList = function()
{
	if(!this.serverListShown)
	{
		var service = common;
		if(pluginSharedLogin.returnXML)
		{
			service = crushFTP;
		}
		var serverList = service.data.getSubValueFromPrefs("server_list");
		var serverPorts = $("#server_item", _plugin);
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
		serverPorts.prepend("<option>All</option>");
		this.serverListShown = true;
	}
}

pluginSharedLogin.saveContent = function(saveByIndex, cloneName, removeByIndex, callback, noGrowl)
{
	removeByIndex = removeByIndex || 0;
	if(pluginPlaceHolder.data("hasChanged") || removeByIndex>0 || (saveByIndex>0 && cloneName) || pluginSharedLogin.returnXML)
	{
		if(!pluginSharedLogin.returnXML)
			crushFTP.UI.showIndicator(false, false, "Please wait..");
		var xmlString = [];
		var container = _plugin;
		if(removeByIndex == 0)
		{
			xmlString.push("<plugins_subitem type=\"properties\">");
			xmlString.push("<version>"+$("#version", _plugin).text()+"</version>");
			xmlString.push("<pluginName>"+pluginName+"</pluginName>");
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

		if(pluginSharedLogin.returnXML)
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