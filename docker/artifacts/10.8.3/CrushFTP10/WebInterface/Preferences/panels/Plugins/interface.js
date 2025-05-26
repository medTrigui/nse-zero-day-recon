/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelPlugins = {};
panelPlugins.localization = {};
/****************************/

// Panel details
var panelName = "Plugins";
var _panel = $("#pnl" + panelName);
var _pluginsList = $("#pluginsList", _panel);
panelPlugins.saveParams = {};

panelPlugins.pluginsToIgnore = ["WebStatistics", "CrushImagePreview", "CrushLDAP", "DotBin", "FilterCommand", "HiddenFTP", "MiniUrlManager", "OSXNetInfo", "DebugOptions"];

// Localizations
panelPlugins.localization = {
	headerText : " Plugins ",
	btnResetText : "Reset To Default",
	btnCancelText : "Cancel",
	btnOKText : "Save"
};

// Assign localizations
localizations.panels[panelName] = $.extend(panelPlugins.localization, localizations.panels[panelName]);

// Interface methods
panelPlugins.init = function(pluginToLoad, refresh, pluginID, returnXML){
	panelPlugins.isEmbed = pluginToLoad && pluginToLoad.length>0;
	applyLocalizations(panelName, localizations.panels);
	crushFTP.methods.setPageTitle(panelPlugins.localization.Header, true);
	if(panelPlugins.isEmbed)
	{
		panelPlugins.loadPlugin(pluginToLoad, refresh, pluginID, returnXML);
		$(".nonEmbed", _panel).hide();
		var data = $(document).data("PluginBindData" + pluginID);
		if(data.hideButtons)
		{
			$(".buttonsPanel", _panel).hide();
		}
	}
	else
	{
		panelPlugins.bindData();
		panelPlugins.bindEvents(pluginID);
	}
}

panelPlugins.bindData = function()
{
	var prefs = common.data.ServerPrefs();
	bindValuesFromXML(_panel, prefs);
	if(!panelPlugins.isEmbed && prefs && prefs["plugins"])
	{
		var plugins = prefs["plugins"];
		if(plugins.length>0)
		{
			plugins = plugins[0]["plugins_subitem"];
			if(plugins)
			{
				_pluginsList.empty();
				for(var i=0;i<plugins.length;i++)
				{
					var curItem = plugins[i];
					curItem = curItem["plugins_subitem_subitem"];
					if(curItem)
					{
						if(curItem.length>0 && curItem[0].pluginName)
						{
							var name = crushFTP.data.getTextValueFromXMLNode(curItem[0].pluginName, "");
							if(panelPlugins.pluginsToIgnore.indexOf(name)<0)
							{
								var newControl = $("<option>"+crushFTP.methods.htmlEncode(name)+"</option>");
								_pluginsList.append(newControl);
								newControl.data("controlData", curItem);
							}
						}
					}
				}
			}
			_pluginsList.html($("option", _pluginsList).sort(function (a, b) {
			    return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
			}));
		}
	}
}

panelPlugins.getPluginIndex = function(plugin)
{
	if(panelPlugins.isEmbed) return 0;
	var prefs = common.data.ServerPrefs();
	if(prefs && prefs["plugins"])
	{
		var plugins = prefs["plugins"];
		if(plugins.length>0)
		{
			plugins = plugins[0]["plugins_subitem"];
			if(plugins)
			{
				for(var i=0;i<plugins.length;i++)
				{
					var curItem = plugins[i];
					curItem = curItem["plugins_subitem_subitem"];
					if(curItem)
					{
						if(curItem.length>0 && curItem[0].pluginName)
						{
							var name = crushFTP.data.getTextValueFromXMLNode(curItem[0].pluginName, "");
							if(name == plugin)
							return i;
						}
					}
				}
			}
		}
	}
	return false;
}

panelPlugins.showPluginPersonalizations = function(){
	if(!$.isCrush7 || !$.crushFtpPersonalization)return;
	var mostUsed = [];
	var mostVisitedPluginsPanel = $("#mostVisitedPluginsPanel", _panel).hide();
	var linksPanel = mostVisitedPluginsPanel.find("ul").empty();
	var personalizations = $.crushFtpPersonalization.getPersonalizations("prefs");
	if(personalizations && personalizations.plugins)
	{
		var plugins = personalizations.plugins;
		for(var pnl in plugins)
		{
			var _pnl = plugins[pnl];
			if(_pnl.loadCount>0)
			{
				mostUsed.push({
					panel : pnl,
					count : _pnl.loadCount
				});
			}
		}
		if(mostUsed.length>0)
		{
			mostUsed = mostUsed.sort(function(x, y){
			    var n = y.count - x.count;
			    if (n != 0) {
			        return n;
			    }
			    return y.panel < x.panel;
			});
			var links = [];
			for (var i = 0; i < mostUsed.length; i++) {
				var curItem = mostUsed[i];
				if(curItem)
					links.push('<li class="ui-state-default ui-corner-all"><a plugin="'+curItem.panel+'" href="#">'+curItem.panel+'</a></li>');
			};
			linksPanel.append(links.join(""));
			mostVisitedPluginsPanel.show();

			linksPanel.find("li").hover(function(){
				$(this).addClass("ui-state-hover");
			}, function(){
				$(this).removeClass("ui-state-hover");
			});

			linksPanel.find("li, a").click(function(){
				var plugin = false;
				if($(this).is("li"))
					plugin = $(this).find("a").attr("plugin");
				else
					plugin = $(this).attr("plugin");
				_pluginsList.val(plugin).trigger("change");
				return false;
			});
			linksPanel.find("a[plugin='"+_pluginsList.val()+"']").parent().addClass("ui-state-active");
			return mostUsed[0];
		}
	}
	return false;
}

panelPlugins.bindEvents = function()
{
	var curUserName = $(document).data("username") || "";
	panelPlugins.defaultPlugin = panelPlugins.defaultPlugin || localStorage[curUserName + "_lastLoadedPlugin"] || _pluginsList.find("option:first").attr("value") || "AutoUnzip";
	var fromLS = localStorage[curUserName + "_lastLoadedPlugin"];
	_pluginsList.bind("change", function(evt, arg){
		var plugin = $(this).val();
		var refresh = arg && arg.refresh;
		var index = arg && typeof arg.index != "undefined" ? arg.index : false;
		panelPlugins.loadPlugin(plugin, refresh, false, false, function(){
			if($.isCrush7 && $.crushFtpPersonalization)
			{
				$.crushFtpPersonalization.updateItem("prefs", "plugins", plugin);
				panelPlugins.showPluginPersonalizations();
			}
			if(fromLS){
				delete localStorage[curUserName + "_lastLoadedPlugin"];
			}
			else{
				localStorage[curUserName + "_lastLoadedPlugin"] = plugin;
			}
		}, index);

	}).val(panelPlugins.defaultPlugin);

	panelPlugins.loadPlugin(panelPlugins.defaultPlugin, false, false, false, function(){
		if(fromLS){
			delete localStorage[curUserName + "_lastLoadedPlugin"];
		}
	});
	panelPlugins.showPluginPersonalizations();

	$(".buttonAddClone", _panel).unbind("click").click(function(){
		if($(this).hasClass("ui-state-disabled"))
			return false;
		var cloneName = window.currentPlugin;
		var subItemIndex = _plugin.data("subItem") || 0;
		if(subItemIndex>0)
		{
			var pluginName = window.currentPlugin;
			var pluginPrefs = common.data.getPluginPrefs(pluginName);
			if(pluginPrefs && pluginPrefs.length>0 && pluginPrefs[subItemIndex])
			{
				cloneName = pluginPrefs[subItemIndex].subItem[0].text || cloneName;
			}
		}
		cloneName = cloneName || "";
		cloneName = cloneName.toString();
		cloneName = unescape(cloneName) + " clone";
		jPrompt("Please enter a name for this plugin clone :", cloneName, "Input", function(value){
			cloneName = value;
			if(cloneName!=null)
			{
				if(cloneName.length == 0)
				{
					$(".buttonAddClone", _panel).trigger("click");
					return;
				}
				panelPlugins.addPluginClone(cloneName.toString());
			}
		});
	});

	$(".buttonRemoveClone", _panel).unbind("click").click(function(){
		if($(this).hasClass("ui-state-disabled"))
			return false;
		var subItemIndex = _plugin.data("subItem") || 0;
		if(subItemIndex>0)
		{
			var pluginName = window.currentPlugin;
			var pluginPrefs = common.data.getPluginPrefs(pluginName);
			if(pluginPrefs && pluginPrefs.length>0 && pluginPrefs[subItemIndex])
			{
				var tabName = pluginPrefs[subItemIndex].subItem[0].text || "";
				var isAtServer = false;
				if(_panel.find(".subPluginTabHandler").length>0)
				{
					tabAnchors = _plugin.prev();
					var tab = tabAnchors.find("a[pluginIndex='"+subItemIndex+"']");
					isAtServer = $(tab).attr("atServer") || false;
				}
				jConfirm("Are you sure you wish to remove this item \""+unescape(tabName)+"\"?", "Confirm", function(value){
					if(value)
					{
						panelPlugins.removePluginClone(subItemIndex, isAtServer);
					}
				});
			}
		}
		else
		{
			jAlert("You can not remove the base plugin instance.", "Alert", false);
		}
	});

	/*Privs advanced option dialog events*/
	var fieldAdvancedDialog = $("#fieldAdvancedDialog", _panel).form();
	_panel.fieldAdvancedDialog = fieldAdvancedDialog;
	fieldAdvancedDialog.dialog({
		autoOpen: false,
		height: 600,
		width: 800,
		modal: true,
		resizable: true,
		closeOnEscape: false,
		buttons: {
			"Cancel" : function(){
				$(this).dialog( "close" );
			},
			"OK": function() {
				var isChanged = fieldAdvancedDialog.attr("isChanged");
				if(isChanged && isChanged.toString() == "true")
				{
					var encryption = {};
					fieldAdvancedDialog.find(".encryption").find("input:checked, input[type='text'], input[type='password'], select, input[_name='hint_decrypted_size']").each(function(){
						var val = $(this).val() || "";
						if($(this).is(":checked"))
						{
							val = "true";
						}
						if($(this).attr("_name") == "hint_decrypted_size" && !$(this).is(":checked")){
							val = "false";
						}
						if(val.length>0)
							encryption[$(this).attr("_name")]= val;
					});
					var sync = {};
					fieldAdvancedDialog.find(".sync").find("input:checked, input[type='text'], input[type='password']").each(function(){
						var val = $(this).val() || "";
						if($(this).is(":checked"))
						{
							val = "true";
						}
						if(val.length>0)
							sync[$(this).attr("_name")]= val;
					});
					if(_panel.advancedPrivsReceiver)
						_panel.advancedPrivsReceiver({"encryption":encryption, "sync":sync});
				}
				$(this).dialog("close");
			}
		},
		beforeClose : function(){
			return true;
		},
		open: function(){
			fieldAdvancedDialog.find("#advancedSettingsTabs").tabs({selected:0});
			$("a.serverFilePickButton", fieldAdvancedDialog).each(function(){
				$(this).unbind("click").click(function(){
					var curElem = $(this);
	                var rel = curElem.attr("rel");
	                var pickingFor = curElem.parent().parent().parent().find("label[for='"+rel+"']").text() || "";
	                pickingFor = $.trim($.trim(pickingFor).replace(":", ""));
					curElem.crushFtpLocalFileBrowserPopup({
						type : curElem.attr("PickType") || 'dir',
						pickingFor: pickingFor,
						existingVal : $("#" + curElem.attr("rel"), fieldAdvancedDialog).val(),
						callback : function(selectedPath){
							$("#" + curElem.attr("rel"), fieldAdvancedDialog).val(selectedPath).trigger("change");
						}
					});
					return false;
				});
			});
		}
	});

	fieldAdvancedDialog.find("input, select").change(function(){
		fieldAdvancedDialog.attr("isChanged", true);
	});

	$("#pgpEncryptionGenerateButton").unbind().click(function () {
		if ($("#pgpPivateKeyPathGenerate").val().indexOf(".key") < 0)
		{
			$("#pgpPivateKeyPathGenerate").val($("#pgpPivateKeyPathGenerate").val()+"private.key");
		}
		var obj = {
			command: "pgpGenerateKeyPair",
			pgpCommonNameGenerate: crushFTP.methods.htmlEncode($("#pgpCommonNameGenerate").val()),
			pgpKeySizeGenerate: $("#pgpKeySizeGenerate").val(),
			pgpKeyDaysGenerate: $("#pgpKeyDaysGenerate").val(),
			pgpPrivateKeyPasswordGenerate: crushFTP.methods.htmlEncode($("#pgpPrivateKeyPasswordGenerate").val()),
			pgpPivateKeyPathGenerate: crushFTP.methods.htmlEncode($("#pgpPivateKeyPathGenerate").val()),
			random: Math.random()
		};
		obj.c2f = crushFTP.getCrushAuth();
		$.ajax({
			type: "POST",
			url: crushFTP.ajaxCallURL,
			data: obj,
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				errorThrown = errorThrown || "pgpGenerateKeyPair failed";
				crushFTP.UI.growl("Error: ", errorThrown, true, true);
			},
			success: function (msg) {
				var responseText = msg;
				try {
					var response = msg.getElementsByTagName("response");
					response = crushFTP.data.getTextContent(response[0]).textContent;
					alert(response);
				} catch (ex) {}
			}
		});
		return false;
	});
}

panelPlugins.loadPlugin = function(plugin, refresh, pluginID, returnXML, callback, subItem)
{
	subItem = subItem || "''";
	if((plugin && window.currentPlugin != plugin) || refresh)
	{
		window.pluginPlaceHolder = $("#pluginContainer");
		function continueLoading()
		{
			panelPlugins.saveParams = {};
			if(!panelPlugins.isEmbed)
			{
				if($(".replicationSaveHelper").length>0){
					$(".replicationSaveHelper").remove();
					$("#saveContent").show();
				}
				var replicate_preferences = common.data.getTextContentFromPrefs(common.data.ServerPrefs(), "replicate_preferences");
				if(replicate_preferences && replicate_preferences.toLowerCase() === "true"){
					crushFTP.Replication.init(common.data.ServerPrefs(), "Preferences:Plugins", _panel, plugin, "#saveContent", function(prefs, _panelname){
				        panelPlugins.saveParams.ui_save_preferences = prefs;
				        panelPlugins.saveParams.ui_save_preferences_item = _panelname;
				        itemsChanged(true);
				        panelPlugins.itemsChanged(true, window["plugin"+plugin].returnXML, plugin);
				        _panel.find("#saveContent").click();
				        crushFTP.Replication.popupVisible(false);
				    });
				}
			}
			var btnPanel = $("#clonningButtons .button").show();
			// if(plugin=="LetsEncrypt"){
			// 	btnPanel.hide();
			// }
			crushFTP.UI.showIndicator(false);
			crushFTP.UI.notification(false);
			pluginPlaceHolder.loadContent(window.panelPath + "Plugins/"+plugin+"/index.html", function(response, status, xhr) {
			  $("#vtip").remove();
			  if (status == "error") {
				var msg = "Sorry but there was an error: " + xhr.status + " " + xhr.statusText + " while loading plugin : " + plugin;
				crushFTP.UI.notification(msg, true);
				crushFTP.UI.hideIndicator(false);
				if(!panelPlugins.isEmbed)
				{
					_pluginsList.val(window.currentPlugin);
				}
				else
				{
					pluginPlaceHolder.html("<div style='padding:5px;'>"+msg+"</div>");
					pluginPlaceHolder.find("div").addClass("ui-state-error").prepend('<span style="float: left; margin-right: 0.3em;" class="ui-icon ui-icon-alert"></span>');
				}
				window.currentPluginIndex = panelPlugins.getPluginIndex(window.currentPlugin);
			  }
			  else
			  {
				crushFTP.UI.showIndicator(false);
				buildButtons(pluginPlaceHolder);
				$(".tabs", pluginPlaceHolder).tabs();
				crushFTP.methods.getScript(window.panelPath + "Plugins/"+plugin+"/interface.js", function() {
					if($("#mostVisitedLinksPanel").find("a[loadplugin='"+plugin+"']").parent().addClass('ui-state-active').length>0)
						$("#mostVisitedLinksPanel").find("a[loadplugin!='"+plugin+"']").parent().removeClass('ui-state-active');
					else
					{
						$("#mostVisitedLinksPanel").find("a[loadplugin!='"+plugin+"']").parent().removeClass('ui-state-active');
						$("#mostVisitedLinksPanel").find("a[panel='Plugins']:first").parent().addClass('ui-state-active');
					}
					var initScript = "plugin" + plugin + ".init();";
					if(pluginID)
					{
						initScript = "plugin" + plugin + ".init('"+pluginID+"', "+returnXML+", "+subItem+");";
					}
					else if(subItem)
					{
						initScript = "plugin" + plugin + ".init('', '', "+subItem+");";
					}
					try{
						crushFTP.UI.hideIndicator(false);
						eval(initScript);
						window.currentPlugin = plugin;
						window.currentPluginIndex = panelPlugins.getPluginIndex(window.currentPlugin);
						panelPlugins.initLayoutEvents(pluginPlaceHolder, plugin, pluginID, subItem);
						if(callback)
							callback();
					}
					catch(ex){
						if(ex && ex.toString() != "")
						{
							crushFTP.UI.growl("Error", ex, true);
						}
					}
				});
			  }
			});
		}
		if(pluginPlaceHolder.data("hasChanged") && !returnXML)
		{
			jConfirm("If you navigate away, you will lose your unsaved changes. Do you want to continue?", "Confirm", function(value){
				if(value)
				{
					continueLoading();
				}
			});
		}
		else
		{
			continueLoading();
		}
	}
	return false;
}

panelPlugins.bindSwappingEventForSubConfig = function(tabAnchors)
{
	// if(window.currentPlugin == "CrushLDAPGroup")
	// 	return false;
	tabAnchors.find("li").contextMenu({
			menu: "subConfigContext",
			topPadding : 100,
			leftPadding : 220
		},
		function(action, el, pos) {
			if(action == "moveRight" || action == "moveLeft")
			{
				if(pluginPlaceHolder.data("hasChanged"))
				{
					jConfirm("You have unsaved changes, if you continue with rearrangement you will lose your unsaved changes. Do you want to continue?", "Confirm", function(value){
						if(value)
						{
							pluginPlaceHolder.removeData("hasChanged");
							panelPlugins.sortConfigs(elem, action);
						}
					});
					return false;
				}
			}
			if(action == "moveRight")
			{
				$(el).next().after($(el));
				panelPlugins.sortConfigs($(el), "move_right", function(flag){
					if(flag){
						setTimeout(function()
						{
							$(".subPluginTabHandler li:first").find("a").trigger("click");
							$(el).find("a").trigger('click');
						}, 500);
					}else{
						$(el).prev().before($(el));
					}
				});
			}
			else if(action == "moveLeft")
			{
				$(el).prev().before($(el));
				panelPlugins.sortConfigs($(el), "move_left", function(flag){
					if(flag){
						setTimeout(function()
						{
							$(".subPluginTabHandler li:first").find("a").trigger("click");
							$(el).find("a").trigger('click');
						}, 500);
					}
					else{
						$(el).next().after($(el));
					}
				});
			}
			else if(action == "rename")
			{
				panelPlugins.renameConfig($(el), $(el).text());
			}
	}).bind("onBeforeContextMenu", function(){
		$("#subConfigContext").find(".ui-state-disabled").removeClass("ui-state-disabled");
		if($(this).next("li").length == 0)
			$("#subConfigContext").find(".moveRight").addClass("ui-state-disabled");
		if($(this).prev("li").length == 0)
		{
			$("#subConfigContext").find(".moveLeft, .rename").addClass("ui-state-disabled");
		}
	});
}

panelPlugins.initLayoutEvents = function(context, plugin, pluginID, subItem)
{
	var pluginName = window.currentPlugin;
	/*if(pluginName && window.panelEvents)
		window.panelEvents.updatePluginControlData(pluginName, true);*/
	var _plugin = $("#pnlPlugin" + pluginName);
	var pluginPrefs = [];
	if(pluginID)
	{
		var data = $(document).data("PluginBindData" + pluginID);
		pluginPrefs = data.dataItem;
	}
	else
	{
		pluginPrefs = common.data.getPluginPrefs(pluginName);
	}
	_plugin.data("subItem",0);
	if(pluginPrefs && pluginPrefs.length>0)
	{
		var pluginContainer = false;
		var tabAnchors = false;
		var multipleInstance = pluginPrefs.length>1;
		if(multipleInstance)
		{
			_plugin.wrap("<div class=\"ui-widget-content pluginsContainer\"></div>");
			_plugin.before("<ul class='subPluginTabHandler ui-corner-all ui-widget-header' style='height: auto;padding: 0px;overflow: hidden;'></ul>");
			tabAnchors = _plugin.prev();
			for(var index=0; index<pluginPrefs.length;index++)
			{
				var curPlugin = pluginPrefs[index];
				var container = _plugin;
				if(multipleInstance)
				{
					var tabName = curPlugin.subItem[0].text || pluginName;
					tabAnchors.append("<li><a atServer=\"true\" pluginIndex=\""+index+"\">"+crushFTP.methods.htmlEncode(unescape(tabName))+"</a></li>");
				}
			}
			tabAnchors.find(".clearBtn").remove();
			tabAnchors.append("<span class='clearBtn' style='display:block;clear:both;'></span>");
			tabAnchors.find("a").button().unbind().click(function(){
				panelPlugins.loadCloneItem($(this));
			});
			if(subItem && subItem != "''")
				tabAnchors.find("a:eq("+subItem+")").addClass("ui-state-active");
			else
				tabAnchors.find("a:first").addClass("ui-state-active");
			panelPlugins.bindSwappingEventForSubConfig(tabAnchors);
		}
		_plugin.data("totalSubPlugins", pluginPrefs.length);
	}
	else
		_plugin.data("totalSubPlugins", 0);
	context = context || pluginPlaceHolder;
	panelPlugins.itemsChanged(false);
	context.form();
	if(context.find(".panelFormFields").length>0)
	{
		panelPlugins.listenChanges(context.find(".panelFormFields"));
	}
	else
	{
		panelPlugins.listenChanges(context);
	}
	context.unbind("changed").bind("changed", function(){
		panelPlugins.itemsChanged(true);
	});
	$("a#saveContent", context).click(function(){
		if($("#pnlPluginCrushTask").is(":visible") && !window.taskLoaded)
		{
			window.afterDesignerLoads = function(){
				$("a#saveContent").trigger("click", [true]);
			}
			return;
		}
		var submitScript = "plugin" + plugin + ".saveContent();";
		try{
			eval(submitScript);
		}
		catch(ex){
			if(ex && ex.toString() != "")
			{
				crushFTP.UI.growl("Error", ex, true);
			}
		}
		return false;
	});
	$("a#cancel", context).click(function(){
		if(pluginPlaceHolder.data("hasChanged"))
		{
			jConfirm("Are you sure you want to reject changes made so far?", "Confirm", function(value){
				if(value)
				{
					panelPlugins.itemsChanged(false);
					panelPlugins.loadPlugin(plugin, true);
				}
			});
		}
		else
		{
			panelPlugins.loadPlugin(plugin, true);
		}
		return false;
	});
	$("input", context).keypress(function (e) {
		if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
			$('a#saveContent', context).click();
			return false;
		} else {
			return true;
		}
    });
	vtip(context);
	$(".enterpriseFeatureTag", context).click(function(){
		jAlert('<div style="text-align:center">To use this feature, an Enterprise license is required.<br><br> To get more information on features and pricing, see the following links : <br><br><a href="http://crushftp.com/pricing.html#enterprise" tabIndex="-1" target="_blank">Plans &amp; Pricing</a> | <a href="http://www.crushftp.com/crush6wiki/Wiki.jsp?page=Enterprise%20License%20Enhancements" tabIndex="-1" target="_blank">Enterprise License Enhancements</a></div>', "This is an Enterprise License feature");
		return false;
	});
	if($(".enterpriseFeatureTag:visible", context).length>0)
	{
		$("#clonningButtons").find(".button").addClass("ui-state-disabled");
		$(".buttonBar").find("a").addClass("ui-state-disabled");
	}
	else
	{
		$("#clonningButtons").find(".button").removeClass("ui-state-disabled");
		$(".buttonBar").find("a").removeClass("ui-state-disabled");
	}
}

panelPlugins.renameConfig = function(elem, name)
{
	if(!elem)return;
	var pluginIndex = elem.find("a").attr("pluginindex");
	if(!pluginIndex)
		pluginIndex = 0;
	else
		pluginIndex = parseInt(pluginIndex);
	if(typeof pluginIndex == "undefined" || pluginIndex == NaN){
		return;
	}
	var cloneName = name;
	jPrompt("Please enter a name for this plugin clone: ", cloneName, "Input", function(value){
		cloneName = value;
		if(cloneName != null && cloneName != name && cloneName.length>0)
		{
			panelPlugins.savePluginContentProcess("change", "<plugins_subitem type=\"properties\"><subItem>"+cloneName+"</subItem></plugins_subitem>", window.currentPluginIndex, pluginIndex, false, function(flag){
				if(flag)
					elem.find("span").text(cloneName);
			}, false);
		}
	});
}

panelPlugins.sortConfigs = function(elem, action, cb)
{
	if(!elem){
		if(cb)
			cb(false);
		return;
	};
	var pluginIndex = elem.find("a").attr("pluginindex");
	if(!pluginIndex)
		pluginIndex = 0;
	else
		pluginIndex = parseInt(pluginIndex);
	if(typeof pluginIndex == "undefined" || pluginIndex == NaN){
		if(cb)
			cb(false);
		return;
	}
	var curIndex = elem.index();
	if(pluginIndex == curIndex){
		if(cb)
			cb(false);
		return;
	}
	jConfirm("Are you sure you want to rearrange the selected config? <br><strong>You will have to restart the server manually for the change to take effect!</strong>", "Confirm", function(value){
		if(value){
			function continueSorting(callback){
				pluginPlaceHolder.removeData("hasChanged");
				crushFTP.UI.showIndicator(false, false, "Please wait..");
				panelPlugins.rearrangePluginSubItem(pluginIndex, action, function(){
					common.data.updateLocalPrefs(function(){
						crushFTP.UI.hideIndicator();
						if(callback)
							callback();
					});
				});
			}
			if(pluginIndex == 0 || curIndex == 0)
			{
				crushFTP.UI.showIndicator(false, false, "Please wait..");
				setTimeout(function(){
					crushFTP.UI.hideIndicator();
					var cloneName = "Original";
					jPrompt("Please enter a name for the item that was in the 1st position.<br/>It now needs a name since it had none before: ", cloneName, "Input", function(value){
						cloneName = value;
						if(cloneName != null && cloneName != name && cloneName.length>0)
						{
							if(action == "move_right"){
								panelPlugins.savePluginContentProcess("change", "<plugins_subitem type=\"properties\"><subItem>"+cloneName+"</subItem></plugins_subitem>", window.currentPluginIndex, pluginIndex, false, function(flag){
									continueSorting(function(){
										crushFTP.UI.showIndicator(false, false, "Please wait..");
										panelPlugins.savePluginContentProcess("change", "<plugins_subitem type=\"properties\"><subItem></subItem></plugins_subitem>", window.currentPluginIndex, 0, false, function(flag){
											common.data.updateLocalPrefs(function(){
												crushFTP.UI.hideIndicator();
												$("#pluginsList").trigger("change", [{refresh:true, index:curIndex}]);
												crushFTP.UI.growl("Warning", "You need to restart the server for recent change to take affect", true);
												if(cb)
													cb(true);
											});
										});
									});
								}, false);
							}
							else{
								continueSorting(function(){
									crushFTP.UI.showIndicator(false, false, "Please wait..");
									panelPlugins.savePluginContentProcess("change", "<plugins_subitem type=\"properties\"><subItem>"+cloneName+"</subItem></plugins_subitem>", window.currentPluginIndex, pluginIndex, false, function(flag){
										panelPlugins.savePluginContentProcess("change", "<plugins_subitem type=\"properties\"><subItem></subItem></plugins_subitem>", window.currentPluginIndex, 0, false, function(flag){
											common.data.updateLocalPrefs(function(){
												crushFTP.UI.hideIndicator();
												$("#pluginsList").trigger("change", [{refresh:true, index:curIndex}]);
												crushFTP.UI.growl("Warning", "You need to restart the server for recent change to take affect", true);
												if(cb)
													cb(true);
											});
										});
									}, false);
								});
							}
						}
						else{
							if(cb)
								cb(false);
						}
					});
				}, 500);
			}
			else{
				continueSorting(function(){
					$("#pluginsList").trigger("change", [{refresh:true, index:curIndex}]);
					crushFTP.UI.growl("Warning", "You need to restart the server for recent change to take affect", true);
					if(cb)
						cb(true);
				});
			}
		}
		else{
			if(cb)
				cb(false);
		}
	});
}

panelPlugins.triggerSave = function()
{
	var index = panelPlugins.nextPluginIndex;
	if(typeof index == "undefined")return;
	panelPlugins.itemsChanged(false);
	setTimeout(function()
	{
		$('.subPluginTabHandler').find('a[pluginindex="'+index+'"]').trigger('click');
	}, 500);
}

panelPlugins.loadCloneItem = function(btn, reloadData)
{
	if(!btn || btn.hasClass(".ui-state-active"))return false;
	function continueLoadingClone()
	{
		var plugin = window.currentPlugin;
		var tabAnchors = _plugin.prev();
		var index = btn.attr("pluginIndex");
		var initScript = "plugin" + plugin + ".bindData("+index+");"
		eval("plugin" + plugin + ".subItem = '" + index + "'");
		_plugin.data("subItem", index);
		eval(initScript);
		if(!window.embedPlugin)
		{
			tabAnchors.find(".ui-state-active").removeClass("ui-state-active");
		}
		btn.addClass("ui-state-active");
		btn.blur();
	}
	if(pluginPlaceHolder.data("hasChanged"))
	{
		jConfirm("If you navigate away, you will lose your unsaved changes. Do you want to continue?", "Confirm", function(value){
			if(value)
			{
				panelPlugins.itemsChanged(false);
				continueLoadingClone();
			}
		});
	}
	else
	{
		continueLoadingClone();
	}
	return false;
}

panelPlugins.addnewActive=function()
{
	$(".subPluginTabHandler li:last").find("a").trigger("click");
}

panelPlugins.addPluginClone = function(cloneName)
{
	var pluginName = window.currentPlugin;
	var _plugin = $("#pnlPlugin" + pluginName);
	var pluginPrefs = common.data.getPluginPrefs(pluginName);
	var subItemIndexToClone = _plugin.data("subItem") || 0;
	if(pluginPrefs && pluginPrefs.length>0)
	{
		var tabCreated = false;
		if(_plugin.parent().find("ul.subPluginTabHandler").length == 0)
		{
			_plugin.wrap("<div class=\"ui-widget-content pluginsContainer\"></div>");
			_plugin.before("<ul class='subPluginTabHandler ui-corner-all ui-widget-header' style='height:auto;padding:3px;'></ul>");
			tabCreated = true;
		}
		var tabAnchors = _plugin.prev();
		function getTabName(pf, ind, trail)
		{
			trail = trail || "";
			var nameToUse = pf + trail;
			nameToUse = unescape(nameToUse.toLowerCase());
			for(var index=0; index<pluginPrefs.length;index++)
			{
				var curPlugin = pluginPrefs[index];
				var container = _plugin;
				var subItem = unescape(curPlugin.subItem[0].text) || window.pluginName;
				if(nameToUse == subItem.toLowerCase())
				{
					ind = ind || 1;
					ind += 1;
					return getTabName(pf, ind, ind);
				}
			}
			ind = ind || "";
			return pf + ind;
		}
		cloneName = getTabName(cloneName);
		if(tabCreated)
		{
			tabAnchors.append("<li><a  pluginIndex=\"0\">"+crushFTP.methods.htmlEncode(pluginName)+"</a></li>");
			panelPlugins.loadCloneItem(tabAnchors.find("a[pluginIndex='"+0+"']").button());
		}
		var tabIndex = pluginPrefs.length;
		tabAnchors.append("<li><a pluginIndex=\""+tabIndex+"\">"+crushFTP.methods.htmlEncode(cloneName)+"</a></li>");
		tabAnchors.find("a[pluginIndex='"+tabIndex+"']").button().attr("disabled", "disabled").addClass("ui-state-disabled");
		var prefsToClone = $.extend(true, {}, pluginPrefs[subItemIndexToClone]);
		var cloneTarget = $.evalJSON($.toJSON(prefsToClone));
		cloneTarget.subItem = [{"text" : cloneName}];
		pluginPrefs.push(cloneTarget);
		panelPlugins.setPluginPrefs(pluginName, pluginPrefs);
		tabAnchors.find("a").unbind().click(function(){
			panelPlugins.loadCloneItem($(this));
		});
		tabAnchors.show();
		panelPlugins.bindSwappingEventForSubConfig(tabAnchors);
		tabAnchors.find(".clearBtn").remove();
		var hasChanges = pluginPlaceHolder.data("hasChanged");
		tabAnchors.append('<span class="clearBtn" style="display:block;clear:both;"></span>');
		crushFTP.UI.showIndicator(false, false, "Please wait..");
		panelPlugins.saveContent(tabIndex, cloneName, false, "function(flag){if(flag){panelPlugins.loadCloneItem(_plugin.prev().find(\"a[pluginIndex='"+tabIndex+"']\").removeClass('ui-state-disabled').removeAttr('disabled').attr('atServer'), true);panelPlugins.itemsChanged("+hasChanges+");}else{panelPlugins.removePluginClone('"+tabIndex+"');}}");
	}
	_plugin.data("totalSubPlugins", pluginPrefs.length);
	panelPlugins.addnewActive();
}

panelPlugins.removePluginClone = function(subItemIndex, removeAtServer)
{
	var pluginPrefs = common.data.getPluginPrefs(pluginName);
	if(pluginPrefs && pluginPrefs.length>0)
	{
		if(removeAtServer)
		{
			panelPlugins.saveContent(false, false, subItemIndex, "function(flag){if(flag){panelPlugins.removeCloneFromCache("+subItemIndex+", true);}}");
		}
		else
		{
			panelPlugins.removeCloneFromCache(subItemIndex);
		}
	}
	_plugin.data("totalSubPlugins", pluginPrefs.length);
	panelPlugins.itemsChanged(false);
	$(".subPluginTabHandler li:first").find("a").trigger("click");
}

panelPlugins.removeCloneFromCache = function(subItemIndex, pluginPrefsRemoved)
{
	var pluginPrefs = common.data.getPluginPrefs(pluginName);
	if(pluginPrefs)
	{
		if(!pluginPrefsRemoved)
		{
			pluginPrefs.remove(subItemIndex);
		}
		var tabAnchors = _plugin.prev();
		tabAnchors.find("a[pluginIndex='"+subItemIndex+"']").remove();
		panelPlugins.setPluginPrefs(pluginName, pluginPrefs);
		panelPlugins.loadCloneItem(tabAnchors.find("a[pluginIndex='0']"));
		if(tabAnchors.find("a").length==1)
		{
			tabAnchors.hide();
		}
		tabAnchors.find("a").each(function(){
			var tabIndex = parseInt($(this).attr("pluginIndex"));
			if(tabIndex && tabIndex>subItemIndex)
			{
				tabIndex -= 1;
				$(this).attr("pluginIndex", tabIndex);
			}
		});
		panelPlugins.itemsChanged(true);
	}
}

panelPlugins.listenChanges = function(context)
{
	context = context || pluginPlaceHolder;
	context.find("input:not(.ignoreChange), select:not(.ignoreChange), textarea:not(.ignoreChange)").change(function(){
		panelPlugins.itemsChanged(true);
	});

	context.find("input[type='text']:not(.ignoreChange), textarea:not(.ignoreChange)").bind("textchange", function(){
		itemsChanged(true);
	});
}

panelPlugins.bindAdvancedPrivs = function(privs)
{
	var fieldAdvancedDialog = _panel.fieldAdvancedDialog || $("#fieldAdvancedDialog", _panel).form();
	fieldAdvancedDialog.clearForm();
	if(!privs)return;
	function bindPopupFields(panel, data)
	{
		var inputs = panel.find("input, select");
		for(var i in data)
		{
			var curPriv = data[i];
			if(curPriv)
			{
				inputs.each(function(){
					if($(this).attr("_name") == i)
					{
						if($(this).attr("type") == "checkbox")
						{
							crushFTP.UI.checkUnchekInput($(this), curPriv == "true");
						}
						else
						{
							$(this).val(unescape(curPriv));
						}
						return false;
					}
				});
			}
		}
	}

	var encryption = privs.encryption;
	if(encryption)
	{
		bindPopupFields(fieldAdvancedDialog.find(".encryption"), encryption);
	}

	var sync = privs.sync;
	if(sync)
	{
		bindPopupFields(fieldAdvancedDialog.find(".sync"), sync);
	}
	$("#pgpKeySizeGenerate",fieldAdvancedDialog).val("2048");
	$("#pgpKeyDaysGenerate",fieldAdvancedDialog).val("365");
}

panelPlugins.itemsChanged = function(flag, forEvents, pluginName, pluginID)
{
	var context = pluginPlaceHolder;
	if(context)
	{
		context.data("hasChanged", flag);
	}
	itemsChanged(flag);
	if(typeof forEvents == "undefined"){
		if(window._panel && window._panel.closest("#eventActionPanel").length>0)
			forEvents = true;
	}
	if(flag && forEvents && window.panelEvents)
	{
		window.panelEvents.updatePluginControlData(pluginName, true, pluginID);
	}
	// if(flag && window.panelEvents)
	// {
	// 	if(window.panelEvents.eventDataChanged)
	// 		window.panelEvents.eventDataChanged();
	// }
};

panelPlugins.setPluginPrefs = function(plugin, pluginPrefs)
{
	var prefs = common.data.ServerPrefs();
	var plugins = prefs["plugins"];
	var availablePlugins = [];
	if(plugins.length>0)
	{
		var pluginsSubItem = plugins[0]["plugins_subitem"];
		if(pluginsSubItem)
		{
			for(var i=0;i<pluginsSubItem.length;i++)
			{
				var curItem = pluginsSubItem[i];
				var curItemSubItems = curItem["plugins_subitem_subitem"];
				for(var l=0;l<curItemSubItems.length;l++)
				{
					if(curItemSubItems && curItemSubItems[l] && curItemSubItems[l].pluginName)
					{
						var name = crushFTP.data.getTextValueFromXMLNode(curItemSubItems[l].pluginName, "");
						if(name == plugin)
						{
							curItemSubItems = pluginPrefs;
							l = curItemSubItems.length;
						}
					}
				}
				curItem["plugins_subitem_subitem"] = curItemSubItems;
				pluginsSubItem[i] = curItem;
			}
		}
		plugins[0]["plugins_subitem"] = pluginsSubItem;
	}
	prefs["plugins"] = plugins;
	$(document).data("GUIXMLPrefs", prefs);
}

panelPlugins.saveContent = function(addIndex, cloneName, removeIndex, callback)
{
	if(!window.currentPlugin)return;
	if(typeof addIndex == "undefined")
		addIndex = false;
	removeIndex = removeIndex || false;
	callback = callback || false;
	var submitScript = "plugin" + window.currentPlugin + ".saveContent("+ addIndex + ", '"  + crushFTP.methods.htmlEncode(cloneName) + "', " + removeIndex + ", " + callback + ");";
	try{
		eval(submitScript);
	}
	catch(ex){
		if(ex && ex.toString() != "")
		{
			crushFTP.UI.growl("Error", DOMPurify.sanitize(ex), true);
		}
	}
}

panelPlugins.rearrangePluginSubItem = function(subItemIndex, action, callback)
{
	var pluginIndex = window.currentPluginIndex;
	crushFTP.data.setXMLPrefs("server_settings/plugins/" + pluginIndex +"/" + subItemIndex
		, "vector"
		, action
		, ""
		, function(data){
			var res = $(data).find("response_status")=="OK";
			if(callback)
				callback(res);
		}
	);
}

panelPlugins.isEncryptionItem = function(curItem){
	return curItem.indexOf("pgp") == 0 || curItem.indexOf("encryption") == 0 || curItem.indexOf("pgpAsciiUpload") == 0 || curItem.indexOf("hint_decrypted_size") == 0 || curItem.indexOf("pgpAsciiDownload") == 0 || curItem.indexOf("encrypt_pgp_check_downloads") == 0;
}

panelPlugins.savePluginContentProcess = function(action, formSubItem, pluginIndex, subItemIndex, removeChangeFlag, callback, noGrowl)
{
	if(pluginIndex == 0){
		formSubItem = formSubItem.replace(/<subItem>[\s\S]*?<\/subItem>/, '<subItem><\/subItem>');
	}
	crushFTP.data.setXMLPrefs("server_settings/plugins/" + pluginIndex +"/" + subItemIndex
		, "vector"
		, action
		, formSubItem
		, function(data){
			data = $.xml2json(data, true);
			crushFTP.UI.hideIndicator();
			if(data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK")
			{
				crushFTP.UI.showIndicator(false, false, "Please wait..");
				common.data.updateLocalPrefs(function(){
					crushFTP.UI.hideIndicator();
				});

				if(!noGrowl && !panelPlugins.pluginMethodCallSaveCallback)
				{
					crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
					placeHolder.removeData("hasChanged");
					pluginPlaceHolder.removeData("hasChanged");
					itemsChanged(false);
				}

				if(callback)
				{
					callback(true);
				}
				if(panelPlugins.pluginMethodCallSaveCallback)
				{
					setTimeout(function(){
						panelPlugins.pluginMethodCallSaveCallback(true);
						panelPlugins.pluginMethodCallSaveCallback = false;
					}, 500);
				}
				if(!removeChangeFlag)
				{
					placeHolder.removeData("hasChanged");
					pluginPlaceHolder.removeData("hasChanged");
					itemsChanged(false);
				}
			}
			else
			{
				crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
				if(callback)
				{
					callback(false);
				}
			}
		},
		panelPlugins.saveParams
	);
}