/*!
* CrushFTP Web GUI interface methods
*
* http://crushFTP.com/
*
* Copyright @ CrushFTP
*
* Date: Wed, Feb 2 2011
*
* Author: Vipul Limbachiya
*
* http://vipullimbachiya.com
*/

window.defaultPanel = "IPServers";
window.panelPath = "panels/";
window.ajaxCallURL = "/WebInterface/function/";
window.ajaxCallURLBase = "/WebInterface/function/";

$(document).ready(function(){
	css_browser_selector(navigator.userAgent);
	$("#mainServerInstance").unbind().change(function(){
		localStorage.setItem("mainServerInstance", $(this).val());
		window.location = window.location;
	});
	if(!window.embedPlugin)
	{
		crushFTP.UI.initLoadingIndicator();
		crushFTP.UI.showLoadingIndicator({});
		var mainServerInstance = localStorage.getItem("mainServerInstance");
		if(mainServerInstance!=null && mainServerInstance.length>0 && mainServerInstance.toLowerCase()!= "main")
		{
			crushFTP.ajaxCallURL = window.ajaxCallURL = window.ajaxCallURLBase + mainServerInstance + "/";
		}
		$("#footer").find(".button").button();
		var logoElem = $("#logo", "#header").hide();
		crushFTP.userLogin.bindUserName(function (response, username) {
			if (response == "failure") {
				window.location = "/WebInterface/login.html?link=/WebInterface/Preferences/index.html";
			} else{
				common.data.getCurrentUserInformation(function(data){
					var customizations = [];
					var logo = "";
					$(data).find("customizations_subitem").each(function(){
						var curObj = {
							key : $(this).find("key").text(),
							value : $(this).find("value").text()
						};
						customizations.push(curObj);
						if(curObj.key && curObj.key.toLowerCase() == "logo")
						{
							logo = curObj.value;
						}
					});
					if(logo)
					{
						if(logo.toLowerCase().indexOf("http://")<0 && logo.toLowerCase().indexOf("https://")<0)
						{
							logo = "/WebInterface/images/" + logo;
						}
						if(logoElem.find("img").length>0)
							logoElem.find("img").replaceWith("<img src='" + logo+ "' />");
						else
							logoElem.append("<img src='" + logo + "' />");
					}
					logoElem.show();
					crushFTP.UI.hideLoadingIndicator({});
					crushFTP.UI.showIndicator(false, $("#GUIInterface"), "Loading server preferences..");
					common.data.getXMLPrefsDataFromServer("GUIXMLPrefs", function(allPrefs){
						crushFTP.data.serverRequest({
							command: 'getServerItem',
							key: "server_settings/server_list",
							random: Math.random()
						},
						function(data){
							var _mainServerInstance = $("#mainServerInstance").empty();
							if(data)
							{
								$(data).find("result_value_subitem").each(function(){
									var type = $(this).find("serverType").text();
									if(type.toLowerCase().indexOf("dmz") >= 0)
									{
										var instance = $(this).find("server_item_name").text();
										if(!instance) instance = $(this).find("ip").text() + ":" + $(this).find("port").text();
										if(instance && instance.length>0)
										{
											if(instance.toLowerCase() == "main")
												_mainServerInstance.append("<option value=''>"+instance+"</option>");
											else
												_mainServerInstance.append("<option value='"+instance+"'>"+instance+"</option>");
										}
									}
								});
								if(_mainServerInstance.find("option").length>0)
								{
									_mainServerInstance.prepend("<option value=''>Main</option>")
									if(mainServerInstance != null)
									{
										if(_mainServerInstance.find("option[value='"+mainServerInstance+"']").length>0)
										{
											if(mainServerInstance.length>0 && mainServerInstance.toLowerCase()!= "main")
												crushFTP.ajaxCallURL = window.ajaxCallURL = window.ajaxCallURLBase + mainServerInstance + "/";
											_mainServerInstance.val(mainServerInstance);
										}
										else
										{
											crushFTP.ajaxCallURL = window.ajaxCallURL = window.ajaxCallURLBase;
											_mainServerInstance.val("");
											localStorage.setItem("mainServerInstance", "");
										}
									}
									else{
										_mainServerInstance.val("");
									}
								}
								else
								{
									_mainServerInstance.val("");
									_mainServerInstance.parent().parent().remove();
								}
							}
							crushFTP.UI.showIndicator(false, $("#GUIInterface"), "Loading server information..");
							fetchServerInfo(function(server_info)
							{
								if(server_info)
								{
									$(document).data("server_info", server_info);
									if(server_info)
									{
										var versionInfo = "";
										if(server_info.version_info_str)
											versionInfo = server_info.version_info_str;
										if(server_info.sub_version_info_str)
										{
											var subversion = server_info.sub_version_info_str;
											if(subversion.indexOf("_")==0)
												subversion = subversion.substr(1, subversion.length);
											versionInfo += " Build : " + subversion;

											$("#crushVersionInfo").text(versionInfo);
										}

										if(server_info.machine_is_linux == "true")
										{
											$.CrushFTPOS = "linux";
										}
										else if(server_info.machine_is_solaris == "true")
										{
											$.CrushFTPOS = "solaris";
										}
										else if(server_info.machine_is_unix == "true")
										{
											$.CrushFTPOS = "unix";
										}
										else if(server_info.machine_is_windows == "true")
										{
											$.CrushFTPOS = "windows";
										}
										else if(server_info.machine_is_x == "true")
										{
											$.CrushFTPOS = "mac";
										}
									}
								}
								crushFTP.data.serverRequest({
									command: "getServerRoots"
								}, function(roots){
									crushFTP.serverConfig = crushFTP.serverConfig || {};
									crushFTP.serverConfig.userRoot = $(roots).find("user\\.root").text() || "/";
									crushFTP.serverConfig.serverRoot = $(roots).find("server\\.root").text() || "/";
									crushFTP.UI.hideIndicator(false, $("#GUIInterface"), "Loading server preferences..");
									initGUI();
								});
							});
						}, window.ajaxCallURLBase);
					});
				});
			}
		});
	}
});

function fetchServerInfo(callback)
{
	var serverInfoItems = ["ciphers","machine_is_windows","machine_is_x","sub_version_info_str","version_info_str", "ip_restrictions_temp"];
	var curItem = 0;
	var arr = {};
	for (var i = 0; i < serverInfoItems.length; i++) {
		var key = serverInfoItems[i];
		function getServerItem(key){
			var call = "server_info/" + key;
			crushFTP.data.getServerItem(call, function(server_info){
				var response_status = $(server_info).find("response_status").text();
				if(response_status)
				{
					if(key == "ip_restrictions_temp")
						arr[key] = $.xml2json(server_info.getElementsByTagName("result_value")[0], true);
					else
						arr[key] = response_status;
				}
				curItem++;
				if(curItem>serverInfoItems.length-1){
					callback(arr);
				}
			});
		};
		getServerItem(key);
	}
}

function doLogout()
{
	$.ajax({type: "POST",url: "/WebInterface/function/",data: {command: "logout",random: Math.random(), c2f:crushFTP.getCrushAuth()},
		error: function (XMLHttpRequest, textStatus, errorThrown)
		{
			$.cookie("currentAuth", "", {path: '/',expires: -1});
			document.location = "/WebInterface/login.html";
		},
		success: function (msg)
		{
			$.cookie("currentAuth", "", {path: '/',expires: -1});
			document.location = "/WebInterface/login.html";
		}
	});
	return false;
}

function doWebInterface()
{
	var loc = "/WebInterface/"; //this allows the server to modify this URL if needed.
	loc = loc.substring(0,loc.length-13);
	document.location = loc;
	return false;
}

function loadPanel(panel, refresh, params)
{
	if((panel && window.currentPanel != panel) || refresh)
	{
		if(refresh)
		{
			window.currentPlugin = false;
		}
		window.placeHolder = $("#placeHolder");
		if(params && params.placeHolder)
		{
			window.placeHolder = params.placeHolder;
		}
		if(params && params.baseUrl)
		{
			window.panelPath = params.baseUrl + "panels/";
		}
		function continueLoading()
		{
			crushFTP.UI.showIndicator(false);
			var relLink = $("."+panel);
			crushFTP.UI.notification(false);
			$("ul.links").find(".ui-state-active").removeClass("ui-state-active");
			relLink.addClass("ui-state-active");
			placeHolder.loadContent(window.panelPath +panel+"/index.html", function(response, status, xhr) {
			  if (status == "error") {
				var msg = "Sorry but there was an error: " + xhr.status + " " + xhr.statusText + " while loading panel : " + panel;
				crushFTP.UI.notification(msg, true);
				placeHolder.empty();
				crushFTP.UI.hideIndicator(false);
			  }
			  else
			  {
				crushFTP.UI.showIndicator(false);
				buildButtons(placeHolder);
				$(".tabs", placeHolder).tabs();
				crushFTP.methods.getScript(window.panelPath +panel+"/interface.js", function() {
					try{
						if(window.panelPreview)
							panelPreview.configs = false;
					}catch(ex){
						console.log(ex);
						console.log(ex.stack);
					}
					var initParam = false;
					if(params && params.loadDefaultPlugin)
					{
						panelPlugins.defaultPlugin = params.loadDefaultPlugin;
					}
					var initScript = "panel" + panel + ".init();";

					var curUserName = $(document).data("username") || "";
					localStorage[curUserName + "_lastLoadedTab"] = panel;
					if(params && params.loadPlugin)
					{
						initParam = params.loadPlugin;
						var pluginID = params.pluginID;
						$(document).data("PluginBindData" + pluginID, params);
						initScript = "panel" + panel + ".init('"+initParam+"', true, '" + pluginID + "', "+params.returnXML+");";
					}
					try{
						crushFTP.UI.hideIndicator(false);
						eval(initScript);
						window.currentPanel = panel;
						if(panel != "Plugins")
							window.currentPlugin = false;
						initLayoutEvents(placeHolder, panel);
						if(params && params.callbackOnload)
							params.callbackOnload();
					}
					catch(ex){
						if(ex && ex.toString() != "")
						{
							crushFTP.UI.growl("Error", DOMPurify.sanitize(ex), true);
							console.log(ex);
							console.log(ex.stack);
						}
					}
				});
			  }
			});
		}
		if(placeHolder.data("hasChanged"))
		{
			if(params && params.ignoreChanges)
			{
				continueLoading();
			}
			else
			{
				jConfirm("If you navigate away, you will lose your unsaved changes. Do you want to continue?", "Confirm", function(value){
					if(value)
					{
						continueLoading();
					}
				},{
					okButtonText : "Yes, Discard Changes",
					cancelButtonText : "No"
				});
			}
		}
		else
		{
			continueLoading();
		}
	}
	return false;
}

function bindNavigationMenuItemEvents()
{
	$("ul.links").find(".ui-state-default").hover(function(){
			$(this).addClass("ui-state-focus");
		},
		function(){
			$(this).removeClass("ui-state-focus");
		});
}

function initLayoutEvents(context, panel)
{
	$.crushFtpCustomization.init($("#pnl"+panel));
	context = context || placeHolder;
	showFeaturesBasedOnVersion(context);
	itemsChanged(false);
	context.form();
	if(context.find(".panelFormFields").length>0)
	{
		listenChanges(context.find(".panelFormFields"));
	}
	else
	{
		listenChanges(context);
	}
	context.unbind("changed").bind("changed", function(){
		itemsChanged(true);
	});

	$("a#saveContent", context).unbind().click(function(e, savingPlugin){
		var elem = $(this);
		if($(this).hasClass("ui-state-disabled"))
			return false;
		if(context.find(".hasPendingCall").length>0)
		{
			window.pendingEncryptionCall = function(){
				elem.trigger("click");
			};
		}
		else
		{
			var submitScript = "panel" + panel + ".saveContent();"
			if(savingPlugin && window._plugin && window.pluginName)
			{
				var subItem = crushFTP.methods.htmlEncode(window._plugin.attr("subPluginName"));
				if(!subItem || subItem == "undefined")
					subItem = window.pluginName;
				submitScript = "panel" + panel + ".saveContent(parseInt($('.subPluginTabHandler').find('.ui-state-active').parent().attr('pluginindex')), \""+subItem+"\", false, \"function(flag){if(flag){if(panelPlugins.swapPlugins == true){$('.subPluginTabHandler').find('.ui-state-active').removeClass('ui-state-active');panelPlugins.triggerSave();}}}\");";
			}
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
		return false;
	});
	$("a#cancel", context).unbind().click(function(){
		if($(this).hasClass("ui-state-disabled"))
			return false;
		if(placeHolder.data("hasChanged"))
		{
			jConfirm("Are you sure you want to reject changes made so far?", "Confirm", function(value){
				if(value)
				{
					crushFTP.UI.showIndicator(false, false, "Please wait..");
					common.data.updateLocalPrefs(function(){
						crushFTP.UI.hideIndicator();
						itemsChanged(false)
						loadPanel(panel, true);
					});
				}
			});
		}
		else
		{
			loadPanel(panel, true);
		}
		return false;
	});
	$(".submitActionRestore", context).parent().unbind().click(function(){
		if($(this).hasClass("ui-state-disabled"))
			return false;
		if(panel == "Plugins")
		{
			jAlert("You can not restore plugins to default settings.");
			return;
		}
		jConfirm("Are you sure you want to restore default settings for <strong>"+localizations.navigationItem[panel]+"</strong>?", "Confirm", function(value){
			if(value)
			{
				window.resetPrefsFlag = true;
				placeHolder.removeData("hasChanged");
				loadPanel(panel, true);
			}
		},{
			okButtonText : "Yes",
			cancelButtonText : "No",
			appendAfterInput: "<div>This will reset values of <strong>"+localizations.navigationItem[panel]+"</strong> panel and all of its sub panels and configs to default values, not only the visible section.</div>"
		});
		return false;
	});
	$("input:not(.no-submit)", context).unbind("keypress").keypress(function (e) {
		if($(this).closest(".ui-dialog").length>0)
		{
			//$(this).closest(".ui-dialog").find(".ui-dialog-buttonpane").find("button:first").trigger("click");
			if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13))
				return false;
		}
		else
		{
			if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
				$('a#saveContent', context).click();
				return false;
			} else {
				return true;
			}
		}
    });
	vtip(context);
	if(window.resetPrefsFlag)
	{
		itemsChanged(true);
		jAlert("Settings are now restored to the defaults, but <strong>have not been saved</strong>. Click the <strong>save button</strong> to save or click <strong>cancel</strong> to <strong>undo</strong>.");
	}
	window.resetPrefsFlag = false;
}

function listenChanges(context)
{
	context = context || placeHolder;
	context.find("input:not(.ignoreChange), select:not(.ignoreChange), textarea:not(.ignoreChange)").unbind("change.listen").bind("change.listen", function(){
		itemsChanged(true);
	});
	context.find("input[type='text']:not(.ignoreChange), input[type='number']:not(.ignoreChange), textarea:not(.ignoreChange)").unbind("textchange.listen").bind("textchange.listen", function(){
		itemsChanged(true);
	});
}

function itemsChanged(flag)
{
	var context = placeHolder;
	if(context)
	{
		context.data("hasChanged", flag);
	}
	if(flag)
		$("#saveContent:visible").addClass('ui-state-hover');
	else
		$("#saveContent:visible").removeClass('ui-state-hover');
}

function buildButtons(context)
{
	$(".button", context).each(function(){
		var icon = $(this).attr("icon");
		if(icon)
		{
			$(this).button(
			{
				icons: {
					primary: icon
				}
			});
		}
		else
		{
			$(this).button();
		}
	});
}

function getBaseNodeXMLTextContent(entries,tagName)
{
	return crushFTP.data.getTextContent(entries.getElementsByTagName(tagName)[0]).textContent;
}

function bindValuesFromXML(_panel, curItem, attrToUse)
{
	attrToUse = attrToUse || "id";
	_panel.find("input[type='text']:not(.ignoreBind), input[type='number']:not(.ignoreBind), input[type='password']:not(.ignoreBind), textarea:not(.ignoreBind), select:not(.ignoreBind)").each(function(){
		if($(this).attr(attrToUse))
		{
			if(curItem)
			{
				$(this).val(common.data.getTextContentFromPrefs(curItem, $(this).attr(attrToUse)));
			}
			else
			{
				$(this).val("");
			}
		}
	});
	_panel.find("input[type='checkbox']:not(.ignoreBind), input[type='radio']:not(.ignoreBind)").each(function(){
		if($(this).attr(attrToUse))
		{
			if(curItem)
			{
				var flag = common.data.getTextContentFromPrefs(curItem, $(this).attr(attrToUse));
				if($(this).is(".reverse"))
				{
					crushFTP.UI.checkUnchekInput($(this), flag != "true");
				}
				else
				{
					crushFTP.UI.checkUnchekInput($(this), flag == "true");
				}
			}
			else
			{
				if($(this).is(".reverse"))
				{
					crushFTP.UI.checkUnchekInput($(this), true);
				}
				else
				{
					crushFTP.UI.checkUnchekInput($(this), false);
				}
			}
		}
	});
	_panel.find(".liveData").each(function(){
		if($(this).attr(attrToUse))
		{
			if(curItem)
			{
				$(this).text(common.data.getTextContentFromPrefs(curItem, $(this).attr(attrToUse)));
			}
			else
			{
				$(this).text("");
			}
		}
	});
	$.crushFtpCustomization.init(_panel);
}

function buildXMLToSubmitForm(_panel, includeRadio, attrToUse)
{
	var xmlString = [];
	attrToUse = attrToUse || "id";
	_panel.find("input[type='text']:not(.ignoreBind, .excludeXML),input[type='password']:not(.ignoreBind, .excludeXML), input[type='number']:not(.ignoreBind, .excludeXML),input[type='password']:not(.ignoreBind, .excludeXML), textarea:not(.ignoreBind, .excludeXML), select:not(.ignoreBind, .excludeXML)").each(function(){
		if($(this).attr(attrToUse))
		{
			var val;
			if($(this).hasClass('maskPasswordOnURL')){
				val = $(this).data("realURL") || $(this).data("originalURL") || $(this).data("origURL") || $(this).val();
				val = decodeURIComponent(val);
			}
			else{
				val = $(this).val();
			}
			xmlString.push("<"+$(this).attr(attrToUse)+">"+crushFTP.methods.htmlEncode(val)+"</"+$(this).attr(attrToUse)+">");
		}
	});
	_panel.find("input[type='checkbox']:not(.ignoreBind, .excludeXML)").each(function(){
		if($(this).attr(attrToUse))
		{
			if($(this).is(".reverse"))
			{
				xmlString.push("<"+$(this).attr(attrToUse)+">"+!$(this).is(":checked")+"</"+$(this).attr(attrToUse)+">");
			}
			else
			{
				xmlString.push("<"+$(this).attr(attrToUse)+">"+$(this).is(":checked")+"</"+$(this).attr(attrToUse)+">");
			}
		}
	});
	if(includeRadio)
	{
		_panel.find("input[type='radio']:not(.ignoreBind, .excludeXML)").each(function(){
			if($(this).attr(attrToUse))
			{
				xmlString.push("<"+$(this).attr(attrToUse)+">"+$(this).is(":checked")+"</"+$(this).attr(attrToUse)+">");
			}
		});
	}
	return xmlString.join("\r\n");
}

function bindValuesFromJson(_panel, curItem, attrToUse, ignoreUnderscore)
{
	function elemNameWithoutUnderScore(name)
	{
		if(ignoreUnderscore && name.indexOf("_")>=0)
		{
			name = name.substr(0, name.indexOf("_"));
		}
		return name;
	}

	attrToUse = attrToUse || "id";
	_panel.find("input[type='text']:not(.ignoreBind), input[type='number']:not(.ignoreBind),input[type='password']:not(.ignoreBind), textarea:not(.ignoreBind), select:not(.ignoreBind)").each(function(){
		if($(this).attr(attrToUse))
		{
			if(curItem)
			{
				var curData = crushFTP.data.getValueFromJson(curItem, elemNameWithoutUnderScore($(this).attr(attrToUse)));
				var curVal = curData.value || curData;
				$(this).val(curVal).trigger("change");
			}
			else
			{
				$(this).val("").trigger("change");
			}
		}
	});
	_panel.find("input[type='checkbox']:not(.ignoreBind), input[type='radio']:not(.ignoreBind) ").each(function(){
		if($(this).attr(attrToUse))
		{
			if(curItem)
			{
				var curData = crushFTP.data.getValueFromJson(curItem, elemNameWithoutUnderScore($(this).attr(attrToUse)));
				var curVal = curData.value || curData;
				if($(this).is(".reverse"))
				{
					crushFTP.UI.checkUnchekInput($(this), curVal != "true");
				}
				else
				{
					crushFTP.UI.checkUnchekInput($(this), curVal == "true");
				}
				$(this).trigger("change");
			}
			else
			{
				if($(this).is(".reverse"))
				{
					crushFTP.UI.checkUnchekInput($(this), true);
				}
				else
				{
					crushFTP.UI.checkUnchekInput($(this), false);
				}
				$(this).trigger("change");
			}
		}
	});
	_panel.find(".liveData").each(function(){
		if($(this).attr(attrToUse))
		{
			if(curItem)
			{
				var curVal = crushFTP.data.getValueFromJson(curItem, elemNameWithoutUnderScore($(this).attr(attrToUse)));
				$(this).text(curVal);
			}
			else
			{
				$(this).text("");
			}
		}
	});
}

function initGUI()
{
	window.onbeforeunload = confirmExit;
	var prefs = common.data.ServerPrefs();
	if(prefs && prefs.CustomForms)
	{
		$(document).data("pageTitle", document.title);
		var curUserName = $(document).data("username") || "";
		var lastLoadedPanel = localStorage[curUserName + "_lastLoadedTab"] || window.defaultPanel;
		loadPanel(lastLoadedPanel, false, {callbackOnload:function(){
			delete localStorage[curUserName + "_lastLoadedTab"];
		}});
		delete localStorage[curUserName + "_lastLoadedTab"];
		bindNavigationMenuItemEvents();
	}
	else
	{
		var container = $("#GUIInterface");
		container.block({
            message:  '<div class="ui-state-error ui-corner-all"><p style="margin-left:5px;"><span style="float: left; margin-right: 0.3em;" class="ui-icon ui-icon-alert"></span>GUI XML preference data not loaded</p></div>',
			css: {
				border: 'none',
				opacity: .8,
				width: '250px',
				'text-align':'left'
			}
        });
	}
	$("td#menu").find("a").click(function(){
		var panel = $(this).attr("panel");
		loadPanel(panel, false, {callbackOnload:function(){
			if($.isCrush7 && $.crushFtpPersonalization)
			{
				$.crushFtpPersonalization.updateItem("prefs", "panels", panel);
				showPanelPersonalizations();
			}
		}});
		$(this).blur();
		return false;
	});
	$("#backToTop", "#footer").unbind().click(function () {
		$('html,body').animate({
			scrollTop: 0
		}, 500, false);
		return false;
	});
  function fixChars(val)
  {
      return val.replace(/@/g,"{at}").replace(/:/g,"{colon}").replace(/&/g,"{amp}").replace(/\?/g,"{question}").replace(/\//g,"{slash}").replace(/\\/g,"{backslash}").replace(/#/g,"{hash}").replace(/"/g,"{quote}").replace(/'/g,"{apos}").replace(/%/g,"{percent}").replace(/>/g,"{gt}").replace(/</g,"{lt}").replace(/\+/g,"%2B");
  }
	var generateKeystoreDialog = $("#generateKeystoreDialog");
	generateKeystoreDialog.dialog({
		autoOpen: false,
		width: 750,
		zIndex:99999,
		title : "Generate SSL File : ",
		modal: true,
		resizable: false,
		closeOnEscape: true,
		dialogClass : "generateKeystoreDialog",
		buttons: {
			"Cancel" : function(){
				$(this).dialog( "close" );
			},
			"Generate": function() {
				function continueGenerate() {
					var hasError = false;
					$("[valtype]", generateKeystoreDialog).each(function(){
						if($(this).validateNow({
							notForUserManager : true,
							isForPreferences : true,
							selector : ".generateKeystoreDialog"
						}) && !$(this).is("#keystoreDialog_domainName") && !$(this).attr("_ignore"))
						{
							hasError = true;
						}
					});
					if(!hasError)
					{
						var blockedDiv = generateKeystoreDialog.closest("div.ui-dialog").block({
							message:  'Wait..',
							css: {
								border: 'none',
								padding: '10px',
								width : '100px',
								backgroundColor: '#000',
								'-webkit-border-radius': '10px',
								'-moz-border-radius': '10px',
								opacity: .5,
								color: '#fff',
								'text-align':'left'
							}
						});
						var obj = {};
						var objPlain = {};
						generateKeystoreDialog.find("[sid]").each(function(){
							obj[$(this).attr("sid")] = crushFTP.methods.htmlEncode($(this).val());
							objPlain[$(this).attr("sid")] = $(this).val();
						});
						obj["keystore_path"] = crushFTP.methods.htmlEncode(generateKeystoreDialog.find("#keystoreDialog_path").val() + generateKeystoreDialog.find("#keystoreDialog_fileName").val());
						objPlain["keystore_path"] = generateKeystoreDialog.find("#keystoreDialog_path").val() + generateKeystoreDialog.find("#keystoreDialog_fileName").val();
						obj.command = "generateSsl";
						crushFTP.data.serverRequest(obj,
							function(data){
								blockedDiv.unblock();
								if(data)
								{
									var response = unescape($(data).find("response").text());
									if(response.toLowerCase().indexOf("error")>=0)
									{
										jAlert(response, "Error", false, {
											classForPopupPanel : 'warning'
										});
									}
									else
									{
										if(window.afterKeySSLGeneration)
										{
											window.afterKeySSLGeneration(objPlain);
											delete window.afterKeySSLGeneration;
										}
										generateKeystoreDialog.dialog("close");
										crushFTP.UI.growl("Success", "Key generated successfully", false, 3000);
									}
								}
							}
						);
					}
				}
				if(generateKeystoreDialog.find(".hasPendingCall").length>0)
				{
					window.pendingEncryptionCall = function(){
						continueGenerate();
					};
				}
				else
				{
					continueGenerate();
				}
			}
		},
		open: function(){
			generateKeystoreDialog.clearForm().form();
			generateKeystoreDialog.find("#keystoreDialog_algorithm").val("RSA");
			generateKeystoreDialog.find("#keystoreDialog_sigalgorithm").val("SHA256withRSA");
			generateKeystoreDialog.find("#keystoreDialog_keySize").val("2048");
			generateKeystoreDialog.dialog("option", "position", "center");
			$("a.serverFilePickButton", generateKeystoreDialog).each(function(){
				$(this).unbind().click(function(){
					var curElem = $(this);
	                var rel = curElem.attr("rel");
	                var pickingFor = curElem.parent().parent().parent().find("label[for='"+rel+"']").text() || "";
	                pickingFor = $.trim($.trim(pickingFor).replace(":", ""));
					curElem.crushFtpLocalFileBrowserPopup({
						type : curElem.attr("PickType") || 'file',
						pickingFor: pickingFor,
						existingVal : $("#" + curElem.attr("rel"), generateKeystoreDialog).val(),
						callback : function(selectedPath){
							$("#" + curElem.attr("rel"), generateKeystoreDialog).val(selectedPath).trigger("textchange");
						}
					});
					return false;
				});
			});
		}
	});
	$("[valtype]", generateKeystoreDialog).crushValidator();
	$("[valtype]", generateKeystoreDialog).unbind().bind("textchange",function(){
		$(this).validateNow({
			notForUserManager : true,
			isForPreferences : true,
			selector : ".generateKeystoreDialog"
		});
		if($(this).is("#keystoreDialog_domainName"))
		{
			var domainName = $(this).val();
			domainName = domainName.replace(/\./g, "_");
			if(domainName.length>0)
				generateKeystoreDialog.find("#keystoreDialog_fileName").val(domainName + ".jks");
			else
				generateKeystoreDialog.find("#keystoreDialog_fileName").val("");
		}
	});

	var generateCSRDialog = $("#generateCSRDialog");
	generateCSRDialog.dialog({
		autoOpen: false,
		width: 750,
		zIndex:99999,
		title : "Generate Certificate Signing Request : ",
		modal: true,
		resizable: false,
		closeOnEscape: true,
		dialogClass : "generateCSRDialog",
		buttons: {
			"Cancel" : function(){
				$(this).dialog( "close" );
			},
			"Generate": function() {
				function continueGenerate(){
					var hasError = false;
					$("[valtype]", generateCSRDialog).each(function(){
						if($(this).validateNow({
							notForUserManager : true,
							isForPreferences : true,
							selector : ".generateCSRDialog"
						}))
						{
							hasError = true;
						}
					});
					if(!hasError)
					{
						var blockedDiv = generateCSRDialog.closest("div.ui-dialog").block({
							message:  'Wait..',
							css: {
								border: 'none',
								padding: '10px',
								width : '100px',
								backgroundColor: '#000',
								'-webkit-border-radius': '10px',
								'-moz-border-radius': '10px',
								opacity: .5,
								color: '#fff',
								'text-align':'left'
							}
						});
						var obj = {};
						generateCSRDialog.find("[sid]").each(function(){
							obj[$(this).attr("sid")] = crushFTP.methods.htmlEncode($(this).val());
						});
						obj.command = "generateCSR";
						crushFTP.data.serverRequest(obj,
							function(data){
								blockedDiv.unblock();
								if(data)
								{
									var response = unescape($(data).find("response").text());
									if(response.toLowerCase().indexOf("error")>=0)
									{
										jAlert(response, "Error", false, {
											classForPopupPanel : 'warning'
										});
									}
									else
									{
										generateCSRDialog.dialog("close");
										const trimmedResponse = $.trim(response);

										jAlert("", "Success", false, {
											appendAfterInput: `<textarea style='width:590px;height:210px;padding:2px;margin:2px;'>${trimmedResponse}</textarea>`,
											prependButtons: [
											{
											button:
										  	'<a href="javascript:void(0);" class="button" tabIndex="0" style="margin-right:10px;"><span style="display:inline-block;margin:-1px 3px 0px -7px;float:left;" class="pointer ui-icon ui-icon-disk"></span><span>Export CSR</span></a>&nbsp;&nbsp;',
											clickEvent: function () {
											  var blob = new Blob([trimmedResponse], { type: "text/plain" });
											  var link = document.createElement("a");
											  link.href = window.URL.createObjectURL(blob);
											  link.download = "request.csr";
											  link.click();
											  window.URL.revokeObjectURL(link.href);
											  return false;
											},
											},
										],
										});
									}
								}
							}
						);
					}
				}
				if(generateCSRDialog.find(".hasPendingCall").length>0)
				{
					window.pendingEncryptionCall = function(){
						continueGenerate();
					};
				}
				else
				{
					continueGenerate();
				}
			}
		},
		open: function(){
			generateCSRDialog.form();
			generateCSRDialog.dialog("option", "position", "center");
			$("a.serverFilePickButton", generateCSRDialog).each(function(){
				$(this).unbind().click(function(){
					var curElem = $(this);
	                var rel = curElem.attr("rel");
	                var pickingFor = curElem.parent().parent().parent().find("label[for='"+rel+"']").text() || "";
	                pickingFor = $.trim($.trim(pickingFor).replace(":", ""));
					curElem.crushFtpLocalFileBrowserPopup({
						type : curElem.attr("PickType") || 'file',
						pickingFor: pickingFor,
						existingVal : $("#" + curElem.attr("rel"), generateCSRDialog).val(),
						callback : function(selectedPath){
							$("#" + curElem.attr("rel"), generateCSRDialog).val(selectedPath).trigger("textchange");
						}
					});
					return false;
				});
			});
		}
	});

	var importSSLDialog = $("#importSSLDialog");
	importSSLDialog.dialog({
		autoOpen: false,
		width: 850,
		zIndex : 99999,
		height : "auto",
		title : "Import Certificate Authority Reply File : ",
		modal: true,
		resizable: false,
		closeOnEscape: true,
		dialogClass : "importSSLDialog",
		buttons: {
			"Cancel" : function(){
				$(this).dialog( "close" );
			},
			"Import": function() {
				function continueImport(){
					var hasError = false;
					$("[valtype]", importSSLDialog).each(function(){
						if($(this).validateNow({
							notForUserManager : true,
							isForPreferences : true,
							selector : ".importSSLDialog"
						}))
						{
							hasError = true;
						}
					});
					if(!hasError)
					{
						var blockedDiv = importSSLDialog.closest("div.ui-dialog").block({
							message:  'Wait..',
							css: {
								border: 'none',
								padding: '10px',
								width : '100px',
								backgroundColor: '#000',
								'-webkit-border-radius': '10px',
								'-moz-border-radius': '10px',
								opacity: 0.5,
								color: '#fff',
								'text-align':'left'
							}
						});
						var obj = {};
						importSSLDialog.find("[sid]").each(function(){
							obj[$(this).attr("sid")] = escape($(this).val());
						});
						var trustedCerties = [];
						importSSLDialog.find("div.trustedCertificates").each(function(){
							if($(this).find("input:first").val())
								trustedCerties.push($(this).find("input:first").val());
						});
						obj["trusted_paths"] = crushFTP.methods.htmlEncode(trustedCerties.join(";"));
						obj.command = "importReply";
						crushFTP.data.serverRequest(obj,
							function(data){
								blockedDiv.unblock();
								if(data)
								{
									var response = unescape($(data).find("response").text());
									if(response.toLowerCase().indexOf("error")>=0)
									{
										crushFTP.UI.growl("Error", DOMPurify.sanitize(response), true);
									}
									else
									{
										crushFTP.UI.growl("Success", DOMPurify.sanitize(response));
										jConfirm("Do you want to use new certificate?", "Confirm", function(value){
											if(value)
											{
												itemsChanged(true);
												var kl = $("#customKeystore:visible").length > 0 ? $("#customKeystore:visible") :  $("#cert_path:visible");
												var kp = $("#customKeystorePass:visible").length > 0 ? $("#customKeystorePass:visible") :  $("#globalKeystorePass:visible");
												var kp2 = $("#customKeystoreCertPass:visible").length > 0 ? $("#customKeystoreCertPass:visible") :  $("#globalKeystoreCertPass:visible");
												var tb = $("#testCertificate:visible");
												if(kl.length>0)
													kl.val(unescape(obj.keystore_path));
												if(kp.length>0)
													kp.val(unescape(obj.key_pass));
												if(kp2.length>0)
													kp2.val(unescape(obj.key_pass));
												if(tb.length>0)
													tb.trigger('click');
											}
											importSSLDialog.dialog("close");
										},{
											okButtonText : "Yes",
											cancelButtonText : "No"
										});
									}
								}
							}
						);
					}
				}
				if(importSSLDialog.find(".hasPendingCall").length>0)
				{
					window.pendingEncryptionCall = function(){
						continueImport();
					};
				}
				else
				{
					continueImport();
				}
			}
		},
		open: function(){
			importSSLDialog.clearForm().form();
			var kl = $("#customKeystore:visible").val() ||  $("#cert_path:visible").val() || "";
			var kp =  $("#customKeystorePass:visible").val() ||  $("#globalKeystorePass:visible").val() || "";
			importSSLDialog.find('#importSSLDialog_keystore_path').val(kl);
			importSSLDialog.find('#importSSLDialog_key_pass').val(kp);
			importSSLDialog.dialog("option", "position", "center");
			$("a.serverFilePickButton", importSSLDialog).each(function(){
				$(this).unbind().click(function(){
					var curElem = $(this);
	                var rel = curElem.attr("rel");
	                var pickingFor = curElem.parent().parent().parent().find("label[for='"+rel+"']").text() || "";
	                pickingFor = $.trim($.trim(pickingFor).replace(":", ""));
					curElem.crushFtpLocalFileBrowserPopup({
						type : curElem.attr("PickType") || 'file',
						pickingFor: pickingFor,
						existingVal : $("#" + curElem.attr("rel"), importSSLDialog).val(),
						callback : function(selectedPath){
							$("#" + curElem.attr("rel"), importSSLDialog).val(selectedPath).trigger("textchange");
						}
					});
					return false;
				});
			});
			if(!importSSLDialog.data("addedMultiCertiCalls"))
			{
				importSSLDialog.find('.encryptPass').crushFtpEncryptPassword();
				importSSLDialog.data("addedMultiCertiCalls", true);
				var trustedCertificates = $(".trustedCertificates", importSSLDialog).show().EnableMultiField({
				    confirmOnRemove: false,
				    linkText : "Add more..",
				    linkClass : "addTrustedCerti",
				    removeLinkText : "Remove",
				    maxItemsAllowedToAdd : 2,
				    removeLinkClass : "removeTrustedCerti",
				    addEventCallback : function(newElem, clonnedFrom){
				    	newElem.show().form();
				    	newElem.find('a.serverFilePickButton').attr("rel", newElem.find('input').attr("id"));
				    	$("a.serverFilePickButton", newElem).each(function(){
							$(this).unbind().click(function(){
								var curElem = $(this);
				                var rel = curElem.attr("rel");
				                var pickingFor = curElem.parent().parent().parent().find("label[for='"+rel+"']").text() || "";
				                pickingFor = $.trim($.trim(pickingFor).replace(":", ""));
								curElem.crushFtpLocalFileBrowserPopup({
									type : curElem.attr("PickType") || 'file',
									pickingFor: pickingFor,
									existingVal : $("#" + curElem.attr("rel"), importSSLDialog).val(),
									callback : function(selectedPath){
										$("#" + curElem.attr("rel"), importSSLDialog).val(selectedPath).trigger("textchange");
									}
								});
								return false;
							});
						});
				    },
				    removeEventCallback : function(prev, self, uid){
				    }
				});
			}
			else
			{
				$(".removeTrustedCerti", importSSLDialog).trigger("click");
			}
		}
	});

	$("[valtype]", importSSLDialog).crushValidator();
	$("[valtype]", importSSLDialog).bind("textchange",function(){
		$(this).validateNow({
			notForUserManager : true,
			isForPreferences : true,
			selector : ".importSSLDialog"
		});
	});

	/*Session checker will get version information, based on it new features will be show/hide/initiated*/
	$("#SessionSeconds").sessionChecker({
		callBack:function(){
			var versionNo = ($(document).data("app_version")+"").replace( /^\D+/g, '');
			var crushVersion = parseInt(versionNo);
			if (crushVersion<6)
			{
				crushFTP.userLogin.userLoginStatusCheckThread();
			}
			else
			{
				showFeaturesBasedOnVersion();
			}
		},
		keepAliveOnMouseKeyboardActivity: true
	});
}

function keyboarNav(index)
{
	var mostVisitedLinksPanel = $("#mostVisitedLinksPanel");
	if(mostVisitedLinksPanel.is(":visible"))
	{
		var link = mostVisitedLinksPanel.find("li[_index='"+index+"']");
		if(!link.hasClass('isloading')){
			link.addClass('isloading');
			link.trigger('click');
			setTimeout(function() {
				link.removeClass('isloading');
			}, 100);
		}
	}
}

function bindKeyEvents()
{
	$(document).bind('keydown', 'Alt+0', function (evt){
		keyboarNav(0);
        evt.stopPropagation();
        evt.preventDefault();
    });

    $(document).bind('keydown', 'Alt+1', function (evt){
		keyboarNav(1);
        evt.stopPropagation();
        evt.preventDefault();
    });
    $(document).bind('keydown', 'Alt+2', function (evt){
		keyboarNav(2);
        evt.stopPropagation();
        evt.preventDefault();
    });
    $(document).bind('keydown', 'Alt+3', function (evt){
		keyboarNav(3);
        evt.stopPropagation();
        evt.preventDefault();
    });
    $(document).bind('keydown', 'Alt+4', function (evt){
		keyboarNav(4);
        evt.stopPropagation();
        evt.preventDefault();
    });
    $(document).bind('keydown', 'Alt+5', function (evt){
		keyboarNav(5);
        evt.stopPropagation();
        evt.preventDefault();
    });
    $(document).bind('keydown', 'Alt+6', function (evt){
		keyboarNav(6);
        evt.stopPropagation();
        evt.preventDefault();
    });
    $(document).bind('keydown', 'Alt+7', function (evt){
		keyboarNav(7);
        evt.stopPropagation();
        evt.preventDefault();
    });
    $(document).bind('keydown', 'Alt+8', function (evt){
		keyboarNav(8);
        evt.stopPropagation();
        evt.preventDefault();
    });
    $(document).bind('keydown', 'Alt+9', function (evt){
		keyboarNav(9);
        evt.stopPropagation();
        evt.preventDefault();
    });
}

function showPanelPersonalizations()
{
	if(!$.isCrush7 || !$.crushFtpPersonalization)return;
	var mostUsed = [];
	var mostVisitedLinksPanel = $("#mostVisitedLinksPanel");
	var menu = $("#menu");
	var linksPanel = mostVisitedLinksPanel.find("ul").empty();
	var personalizations = $.crushFtpPersonalization.getPersonalizations("prefs");
	if(personalizations && personalizations.panels)
	{
		var panels = personalizations.panels;
		for(var pnl in panels)
		{
			var _pnl = panels[pnl];
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
			var pluginPanelIndex = -1;
			mostUsed = mostUsed.sort(function(x, y){
			    var n = y.count - x.count;
			    if (n != 0) {
			        return n;
			    }
			    return y.panel < x.panel;
			});
			for (var i = 0; i < mostUsed.length; i++) {
				if(mostUsed[i].panel == "Plugins")
				{
					pluginPanelIndex = i;
					i = mostUsed.length;
				}
			};
			if(pluginPanelIndex>=0 && personalizations.plugins)
			{
				var plugins = personalizations.plugins;
				var mostUsedPlugins = [];
				for(var pnl in plugins)
				{
					var _pnl = plugins[pnl];
					if(_pnl.loadCount>0)
					{
						mostUsedPlugins.push({
							panel : pnl,
							count : _pnl.loadCount,
							type : "Plugin"
						});
					}
				}
				if(mostUsedPlugins.length>0)
				{
					mostUsedPlugins = mostUsedPlugins.sort(function(x, y){
					    var n = y.count - x.count;
					    if (n != 0) {
					        return n;
					    }
					    return y.panel < x.panel;
					});
				}
				var totalPlugins = mostUsedPlugins.length > 5 ? 5 : mostUsedPlugins.length;
				for (var i = totalPlugins-1; i >= 0; i--) {
					mostUsed.insert(pluginPanelIndex+1, mostUsedPlugins[i]);
				};
			}
			var links = [];
			var totalItems = mostUsed.length > 10 ? 10 : mostUsed.length;
			for (var i = 0; i < totalItems; i++) {
				var curItem = mostUsed[i];
				if(curItem)
				{
					var sup = i+1;
					if(sup==10)
						sup = 0;
					if(curItem && curItem.type == "Plugin")
					{
						links.push('<li class="ui-state-default ui-corner-all" _index="'+sup+'"><a panel="Plugins" loadPlugin="'+curItem.panel+'" href="#">'+menu.find('a[panel="Plugins"]').text()+' &raquo; '+ curItem.panel +'</a> <sup>alt+'+sup+'</sup></li>');
					}
					else
						links.push('<li class="ui-state-default ui-corner-all" _index="'+sup+'"><a panel="'+curItem.panel+'" href="#">'+menu.find('a[panel="'+curItem.panel+'"]').text()+'</a> <sup>alt+'+sup+'</sup></li>');
				}
			};
			linksPanel.append(links.join(""));

			linksPanel.find("li").hover(function(){
				$(this).addClass("ui-state-hover");
			}, function(){
				$(this).removeClass("ui-state-hover");
			});

			linksPanel.find("li, a").click(function(){
				var panel = false;
				var loadPlugin = false;
				if($(this).is("li"))
				{
					panel = $(this).find("a").attr("panel");
					loadPlugin = $(this).find("a").attr("loadPlugin");
				}
				else
				{
					panel = $(this).attr("panel");
					loadPlugin = $(this).attr("loadPlugin");
				}
				var refresh = false;
				if(loadPlugin && window.currentPanel == panel && loadPlugin != window.currentPlugin)
				{
					refresh = true;
				}
				loadPanel(panel, refresh, {
					loadDefaultPlugin : loadPlugin
				});
				linksPanel.find(".ui-state-active").removeClass("ui-state-active");
				linksPanel.find("a[panel='"+menu.find("a.ui-state-active").attr("panel")+"']:first").parent().addClass("ui-state-active");
				return false;
			});
			linksPanel.find("a[panel='"+menu.find("a.ui-state-active").attr("panel")+"']:first").parent().addClass("ui-state-active");
			return mostUsed[0];
		}
	}
	if(linksPanel.find("li").length==0)
		mostVisitedLinksPanel.hide();
	return false;
}

function showFeaturesBasedOnVersion(context)
{
	context = context || $(document);
	var versionNo = ($(document).data("app_version")+"").replace( /^\D+/g, '');
	var crushVersion = parseInt(versionNo);
	$.crushVersion = crushVersion;
	$.isCrush7 = crushVersion>=7;
	var isEnterprise = $(document).data("app_enterprise");
	context.find(".crush6Feature, .crush7Feature").hide();

	context.find(".enterpriseFeature").each(function(){
		$(this).show();
		if(!isEnterprise){
			if($(this).find('.enterpriseInfo').length==0 && !$(this).hasClass('no-alert')){
				$(this).find("input, select, textarea, a, button").attr("disabled", "disabled").addClass('ui-state-disabled');
				var elm = '<a href="http://www.crushftp.com/crush6wiki/Wiki.jsp?page=Enterprise%20License%20Enhancements" tabIndex="-1" target="_blank" style="border:none;background:transparent;padding:0px;" class="enterpriseInfo vtip nobg ui-state-active" title="To use this feature, an Enterprise license is required. <br> Click here for more information"><span style="display: inline-block;" class="pointer ui-icon ui-icon-info"></span></a>';
				if($(this).find(".infoPH").length>0){
					$(this).find(".infoPH").append(elm);
					if($(this).find(".infoPH").attr("rel")){
						$(this).parent().find(""+$(this).find(".infoPH").attr("rel")).addClass('ent-feature');
					}
				}
				else{
					$(this).append(elm);
				}
			}
			vtip($(this).parent());
		}
	});

	context.find(".crush6Feature, .crush7Feature").not(".enterpriseFeature").each(function(){
		if($(this).hasClass("crush6Feature") && crushVersion>=6)
			$(this).show();
		else if($(this).hasClass("crush7Feature") && crushVersion>=7)
			$(this).show();
	});
	if($.isCrush7)
	{
		showPanelPersonalizations();
		bindKeyEvents();
	}
	$('#crushVersionInfo').unbind().bind("dblclick", function(evt){
		if(evt.altKey || evt.shiftKey)
		{
			var codeEditorPanel = $("#codeEditorPanel");
			codeEditorPanel.dialog({
				autoOpen: false,
				width: 800,
				zIndex:99999,
				title : "CrushFTP Editor : ",
				modal: true,
				resizable: true,
				closeOnEscape: false,
				dialogClass : "",
				buttons: {
					"Cancel" : function(){
						$(this).dialog( "close" );
					},
					"Save" : function(){
						var xml = $("#codeEditorIframe")[0].contentWindow.getCode();
						if(confirm("Are you sure you want to save changes made to prefs.xml? it can not be undone."))
						{
							var action = "reset";
							crushFTP.data.setXMLPrefs("server_settings"
								, "properties"
								, action
								, xml
								, function(data){
									data = $.xml2json(data, true);
									if(data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK")
									{
										common.data.updateLocalPrefs(function(){
											crushFTP.UI.hideIndicator();
											crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
										});
									}
									else
									{
										crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
									}
								}
							);
						}
						$(this).dialog( "close" );
					}
				},
				open: function(){
					var closeButton = codeEditorPanel.parent().find(".ui-dialog-titlebar-close");
                    if(closeButton.parent().find("a.fullScreen").length==0)
                    {
                        closeButton.after('<a title="Maximize" href="#" role="button" style="float: right;margin-right: 13px;margin-top: 0px;" class="fullScreen ui-corner-all"><span class="ui-icon ui-icon-arrow-4-diag">Fullscreen</span></a>');
                        var fullScreenLink = closeButton.parent().find("a.fullScreen").click(function(){
                            var isFullS = codeEditorPanel.attr("maximized");
                            if(!isFullS)
                            {
                                $(this).find("span").addClass("ui-icon-arrow-1-sw").removeClass("ui-icon-arrow-4-diag");
                                $(this).attr("title", "Resize to original size");
                                var h = window.innerHeight ? window.innerHeight : $(window).height();
                                var w = $(window).width() - 10;
                                h -= 5;
                                codeEditorPanel.parent().css("position", "fixed");
                                codeEditorPanel.dialog("widget").animate({
                                    width: w+'px',
                                    height:h+'px'
                                  }, {
                                  duration: 100,
                                  step: function() {
                                    codeEditorPanel.dialog('option', 'position', 'top');
                                  }
                                });
                                codeEditorPanel.dialog('option', 'resizable', false);
                                codeEditorPanel.dialog('option', 'draggable', false);
                                //codeEditorPanel.height(h + "px");
                                h -= 100;
                                codeEditorPanel.find("iframe").height(h + "px");
                                codeEditorPanel.find("iframe").width((w-30) + "px");
                                codeEditorPanel.attr("maximized", "true");
                            }
                            else
                            {
                                $(this).attr("title", "Maximize");
                                $(this).find("span").addClass("ui-icon-arrow-4-diag").removeClass("ui-icon-arrow-1-sw");
                                codeEditorPanel.parent().css("position", "absolute");
                                codeEditorPanel.dialog("widget").animate({
                                    width: '80%',
                                    height:'650px'
                                  }, {
                                  duration: 100,
                                  step: function() {
                                    codeEditorPanel.dialog('option', 'position', 'center');
                                  }
                                });
                                codeEditorPanel.dialog('option', 'resizable', true);
                                codeEditorPanel.dialog('option', 'draggable', true);
                                codeEditorPanel.find("iframe").height("600px").width("100%");
                                codeEditorPanel.removeAttr("maximized");
                            }
                            return false;
                        });
						closeButton.parent().find("a.fullScreen").trigger("click");
                    }
                    else
                    {
                        if(codeEditorPanel.attr("maximized"))
                        {
                            codeEditorPanel.removeAttr("maximized");
                        }
                        else
                        {
                            codeEditorPanel.attr("maximized", "true");
                        }
                        closeButton.parent().find("a.fullScreen").trigger("click");
                    }
				}
			});
			crushFTP.UI.showIndicator(false, false, "Please wait..");
			common.data.updateLocalPrefs(function(){
				crushFTP.UI.hideIndicator();
				var xml = $(document).data("GUIXMLPrefs_RAW").outerHTML + "";
				codeEditorPanel.html('<iframe id="codeEditorIframe" onload="$(\'#codeEditorPanel\').unblock()" width="95%" height="80%" src="/WebInterface/Preferences/codeEditor.html" style="margin:0px;padding:0px;" marginWidth="0" marginHeight="0" frameBorder="0" scrolling="no"></iframe>');
				codeEditorPanel.dialog("open");
				codeEditorPanel.block({
		            message:  'Please Wait..',
		            css: {
		                width:100,
		                border: 'none',
		                padding: '10px',
		                backgroundColor: '#000',
		                '-webkit-border-radius': '10px',
		                '-moz-border-radius': '10px',
		                opacity: .5,
		                color: '#fff',
		                'text-align':'left'
		            }
		        });
		        $("#codeEditorIframe").bind("load", function(){
		        	$("#codeEditorIframe")[0].contentWindow.setCode(xml.replace('<result_value type="properties">', '<server_prefs type="properties">').replace('</result_value>', '</server_prefs>'))
		        });
			});
		}
	});
}

function confirmExit()
{
	if(placeHolder.data("hasChanged"))
	{
		return "If you navigate away, you will lose your unsaved changes. Do you want to continue?";
	}
}

var common = {
	data:
	{
		getCurrentUserInformation : function(callback)
		{
			crushFTP.data.serverRequest({
					command: 'getUserInfo',
					path : "/",
					random: Math.random()
				},
				function(data){
					if(data)
					{
						callback(data);
					}
				}
			);
		},
		getXMLPrefsDataFromServer : function(dataKey, callback)
		{
			var items = [];
			crushFTP.data.loadAllPrefs(function(data){
				var response = $(data).find("response").text();
				if(response == "FAILURE:Access Denied."){
					$('#access-denied').show();
					$("#GUIInterface").hide();
				}
				if(data && data.getElementsByTagName && data.getElementsByTagName("result_value") && data.getElementsByTagName("result_value").length > 0)
				{
					data = data.getElementsByTagName("result_value")[0];
					items = $.xml2json(data, true);
					$(document).data(dataKey, items);
					$(document).data(dataKey + "_RAW", data);

					crushFTP.data.serverRequest({
						command: 'getServerItem',
						key: "server_settings",
						defaults : "true",
						random: Math.random()
					},
					function(defaultPrefs){
				        var availableJobs = [];
				        crushFTP.data.serverRequest({
				            command: "getJob"
				        },
				        function(data){
				            if(data && typeof data.getElementsByTagName != "undefined")
				            {
				                if(data.getElementsByTagName("result_value") && data.getElementsByTagName("result_value").length > 0)
				                {
				                    $(data).find("result_value_subitem").each(function(index, el) {
				                        availableJobs.push($(this).text());
				                    });
				                    $(document).data("AvailableJobs", availableJobs.sort());

				                    var onlyJobSchedules = [];
		                            $(data).find("result_value_subitem").each(function(index, el) {
		                                if($(this).text().indexOf("__")!=0)
		                                    onlyJobSchedules.push($(this).text());
		                            });
		                            $(document).data("AvailableJobsNoEvents", onlyJobSchedules.sort());
				                }
				            }
				        });
						if(defaultPrefs)
						{
							var defaultItems = [];
							if(defaultPrefs.getElementsByTagName("result_value") && defaultPrefs.getElementsByTagName("result_value").length > 0)
							{
								defaultPrefs = defaultPrefs.getElementsByTagName("result_value")[0];
								defaultItems = $.xml2json(defaultPrefs, true);
								$(document).data(dataKey + "_default", defaultItems);
							}
						}
						if(callback){
							callback(defaultPrefs);
						}
					});

				}
			});
		},
		updateLocalPrefs : function(callback)
		{
			var mainServerInstance = localStorage.getItem("mainServerInstance");
			if(mainServerInstance!=null && mainServerInstance.length>0 && mainServerInstance.toLowerCase()!= "main")
			{
				window.ajaxCallURL = window.ajaxCallURLBase + mainServerInstance + "/";
			}
			common.data.getXMLPrefsDataFromServer("GUIXMLPrefs", function(){
				if(callback)
				{
					callback();
				}
			});
		},
		getSubValueFromPrefs : function(node)
		{
			var prefs = common.data.ServerPrefs();
			if(!prefs || prefs.length == 0) return [];
			if(prefs[node] && prefs[node].length>0 && prefs[node][0][node + "_subitem"])
			{
				return prefs[node][0][node + "_subitem"];
			}
			else
			{
				return [];
			}
		},
		ServerPrefs : function(origFlag, xml)
		{
			var prep = xml ? "_RAW" : "";
			if(window.resetPrefsFlag && !origFlag)
				return $(document).data("GUIXMLPrefs_default"+prep);
			else
				return $(document).data("GUIXMLPrefs"+prep);

		},
		getTextContentFromPrefs : function(item, node)
		{
			if(item && item[node] && item[node].length && item[node].length>0 && item[node][0].text)
			{
				var val = item[node][0].text;
				if(window.decodeFirst)
				{
					val = crushFTP.methods.decodeXML(item[node][0].text);
				}
				return val;
			}
			else
			{
				return "";
			}
		},
		getPluginPrefs : function(plugin)
		{
			if(!plugin) return false;
			var prefs = common.data.ServerPrefs();
			var plugins = prefs["plugins"];
			var availablePlugins = [];
			if(plugins.length>0)
			{
				plugins = plugins[0]["plugins_subitem"];
				if(plugins)
				{
					for(var i=0;i<plugins.length;i++)
					{
						var curItem = plugins[i];
						curItem = curItem["plugins_subitem_subitem"];
						if(curItem && curItem.length && curItem.length >0)
						{
							for(var l=0;l<curItem.length;l++)
							{
								if(curItem && curItem[l] && curItem[l].pluginName)
								{
									var name = crushFTP.data.getTextValueFromXMLNode(curItem[l].pluginName, "");
									if(name == plugin)
									{
										availablePlugins.push(curItem[l]);
									}
								}
							}
						}
					}
				}
			}
			if(availablePlugins.length>0)
			{
				return availablePlugins;
			}
			else
			{
				return false;
			}
		}
	}
};

function setupPrefsReplicationSave(_panel, panelName){
	var replicate_preferences = common.data.getTextContentFromPrefs(common.data.ServerPrefs(), "replicate_preferences");
	if(replicate_preferences && replicate_preferences.toLowerCase() === "true"){
		crushFTP.Replication.init(common.data.ServerPrefs(), "Preferences", _panel, panelName, "#saveContent", function(prefs, _panelname){
			window["panel" + panelName].saveParams = {};
	        window["panel" + panelName].saveParams.ui_save_preferences = prefs;
	        window["panel" + panelName].saveParams.ui_save_preferences_item = _panelname;
	        itemsChanged(true);
	        _panel.find("#saveContent").click();
	        crushFTP.Replication.popupVisible(false);
	    });
	}
}