/****************************
CrushFTP GUI Plugin custom js
*****************************/
/* Do not change these lines */
var pluginMagicDirectory = {};
pluginMagicDirectory.localization = {};
/****************************/

// Plugin details
var pluginName = "MagicDirectory";
var _plugin = $("#pnlPlugin" + pluginName);

// Localizations
pluginMagicDirectory.localization = {
	lblEnabledText : "Enabled",
	lblDebugText : "Debug",
	lblVersionText : "Version: ",
	lblHelpTabText : "Help",
	lblSetupTabText : "Setup",
	lblAdvancedTabText : "Advanced",
	lblPathText : "Path: ",
	btnBrowseText : "Browse",
	lblTemplateUsernameText : "Template Username: ",
	lblOverwriteVFSItemsText : "Overwrite VFS items?",
	lblTemplateUsernameHelpText : " If you specify a template username, all settings from that user will be used including that users virtual file system. ",
	lblSeparatorText : "User / Pass Separator: ",
	lblDirectoryPermissionText : "Directory permissions: ",
	lblRemoveUnsafeCharsText : "Remove unsafe web characters?",
	lblQuotaIsForAllUsersText : "Quota is for all users",
	lblDirScanDepthText : "Directory scan depth: ",
	lblConvertRandomPassText : "Convert 'random' password to generated random password.",
	lblMD5HashText : "MD5 hash passwords.",
	lblUseExpirationDateText : "Use Expiration Date.",
	lblExpirationDateFormatText : "Expiration Date Format: ",
	lblDeleteText : "Delete?",
	lblUseEmailText : "Use Email",
	lblTranslateNotifyEmailsText : "Translate 'notify_' emails and send new account notification.",
	lblEmailSubjectText : "Email Subject: ",
	lblEmailFromAddressText : "Email From Address: ",
	lblEmailCCAddressText : "Email CC Address: ",
	lblEmailBCCAddressText : "Email BCC Address: ",
	lblEmailBodyText : "Email Body : "
};

// Assign localizations
localizations.panels["Plugins"][pluginName] = $.extend(pluginMagicDirectory.localization, localizations.panels["Plugins"][pluginName]);

// Interface methods
pluginMagicDirectory.init = function(pluginID, returnXML){
	pluginMagicDirectory.returnXML = returnXML;
	applyLocalizations(pluginName, localizations.panels["Plugins"]);
	pluginMagicDirectory.bindData(0, pluginID);
}

// Interface methods
pluginMagicDirectory.bindData = function(index, pluginID)
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
		pluginMagicDirectory.bindPluginDetails(curPlugin);
	}
	pluginMagicDirectory.bindEvents();

	$('input[id$="privs_quota"]').trigger("custom-change");
}

pluginMagicDirectory.bindEvents = function()
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
		panelPlugins.itemsChanged(true, pluginMagicDirectory.returnXML, pluginName);
	});

	_plugin.find("input[type='text'], textarea").bind("textchange", function(){
		if($(this).hasClass('permissionItem'))
		{
			rebuildPrivs();
			return false;
		}
		panelPlugins.itemsChanged(true, pluginMagicDirectory.returnXML, pluginName);
	});
	_plugin.find("a[rel='setup']").trigger("click");

	$("a.serverFilePickButton", _plugin).each(function(){
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
					$("#" + curElem.attr("rel"), _panel).val(selectedPath).trigger("change");
				}
			});
			return false;
		});
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

	this.eventAdded = true;
}

pluginMagicDirectory.bindPluginDetails = function(controlData)
{
	var inputs = _plugin.find("input.ignoreBind,select.ignoreBind,textarea.ignoreBind").removeClass("ignoreBind");
	if(typeof controlData.home_name == "undefined")
	{
		controlData.home_name = [{text : ""}];
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

pluginMagicDirectory.saveContent = function(saveByIndex, cloneName, removeByIndex, callback)
{
	removeByIndex = removeByIndex || 0;
	if(pluginPlaceHolder.data("hasChanged") || removeByIndex>0 || (saveByIndex>0 && cloneName) || pluginMagicDirectory.returnXML)
	{
		if(!pluginMagicDirectory.returnXML)
			crushFTP.UI.showIndicator(false, false, "Please wait..");
		var xmlString = [];
		var container = _plugin;
		if(removeByIndex == 0)
		{
			xmlString.push("<plugins_subitem type=\"properties\">");
			xmlString.push("<version>"+$("#version", _plugin).text()+"</version>");
			xmlString.push("<pluginName>"+pluginName+"</pluginName>");
			var inputs = _plugin.find("input.ignoreBind,select.ignoreBind,textarea.ignoreBind").removeClass("ignoreBind");
			xmlString.push(buildXMLToSubmitForm(_plugin, true));
			inputs.addClass("ignoreBind");
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

		if(pluginMagicDirectory.returnXML)
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