/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelAccounts = {};
/****************************/

// Panel details
panelAccounts.panelName = "Accounts";
panelAccounts._panel = $("#pnl" + panelAccounts.panelName);

panelAccounts.availableSyncs = [];
panelAccounts.refreshPanel = false;
panelAccounts.configsPanel = $("#instancesPanel", panelAccounts._panel).find("div.accordion");
panelAccounts.syncPrefsPanelTemplate = $("#syncPrefsPanelTemplate", panelAccounts._panel);
panelAccounts.inactiveCallsCount = 0;
panelAccounts.agentsPollingTimeMS = 5000;

if(typeof window.localizations == "undefined") window.localizations = {};
localizations.SyncAppNameWindowHeaderText = "Sync application download";
localizations.SyncAppDownloadYourPassText = "Your Password : ";
localizations.SyncAppDownloadAdminPassText = "Admin Password : ";
localizations.SyncAppNamePanelSaveLinkText = "OK";
localizations.SyncAppNamePanelCancelLinkText = "Cancel";
localizations.DownloadStartedAlertTitleText = "Download has started";
localizations.DownloadStartedAlertDescText = "Please select location to save your file(s) to proceed";

panelAccounts.defaultSyncVal = '<?xml version="1.0" encoding="UTF-8"?><syncs_subitem type="properties"><syncPath></syncPath><syncServerPath>/</syncServerPath><syncAutoStart>true</syncAutoStart><allowTunnel>false</allowTunnel><allowCompression>false</allowCompression><readOnly>false</readOnly><send_compressed>false</send_compressed><receive_compressed>false</receive_compressed><size_only>false</size_only></syncs_subitem>';

// Interface methods
panelAccounts.init = function(){
	panelAccounts.SyncDataPolling(function(){
	});
	$("#pageContent").show();
	$(".popupLoader").remove();
	if(crushSync.isPopupWindow)
		window.parent.resizeSyncPopup();

	panelAccounts.reloadPage = $("#reloadPage", panelAccounts._panel).click(function(){
		var wd = window || document;
		wd.location.reload(true);
		return false;
	});

	var changePasswordDialog = $("#changePasswordDialog", panelAccounts._panel).form().dialog({
		autoOpen: false,
		width: 500,
		modal: true,
		resizable: false,
		closeOnEscape: false,
		title : "Change Password :",
		buttons: {
			"Cancel" : function(){
				$(this).dialog("close");
			},
			"OK": function() {
				var existingPass = $.trim(changePasswordDialog.find("#existingPassword").val());
				var newPass = $.trim(changePasswordDialog.find("#newPassword").val());
				var confirmPass = $.trim(changePasswordDialog.find("#confirmPassword").val());
				if(newPass.length==0)
				{
					alert(localizationValue("syncManagerEnterPasswordText", "Please enter password"));
					changePasswordDialog.find("#newPassword").val("").focus();
					return false;
				}
				else if(newPass != confirmPass)
				{
					alert(localizationValue("syncManagerPasswordDoesNotMatchText", "Password and confirm password does not match"));
					changePasswordDialog.find("#confirmPassword").val("").focus();
					return false;
				}
				else
				{
					var obj = {
		                command : "sendSyncCommand",
		                sync_password : existingPass,
		                sync_command : "noop",
		                sync_new_password : newPass,
                		random: Math.random()
		            };
		            var avlIds = [];
		            panelAccounts._panel.find("div[clientid]").each(function(){
		            	avlIds.push($(this).attr("clientid"));
		            });
		            if(avlIds.length==0)
		            	return;

		            changePasswordDialog.parent().block({
		                message:  'Wait..',
		                css: {
		                    border: 'none',
		                    padding: '0px',
		                    backgroundColor: '#000',
		                    opacity: .5,
		                    color: '#fff',
		                    'text-align':'left'
		                }
		            });
		            function changePass(flag)
		            {
		            	if(avlIds && avlIds.length>0)
		            	{
		            		obj.agentid = avlIds[0];
				            avlIds.remove(0);
				            crushFTP.data.serverRequest(obj,
				                function(msg){
				                    if(msg)
				                    {
				                    	changePass(true);
				                    }
				            });
		            	}
		            	else if(flag)
		            	{
		            		jAlert(localizationValue("syncManagerPasswordChangedText", "Your password is changed, please re-login."), "Success", function(){
		            			panelAccounts.reloadPage.trigger("click");
		            		});
		            	}
		            }
		            changePass();
				}
			}
		},
		open : function(){
			changePasswordDialog.find("input").val("");
		}
	});

	$("#changePassword", panelAccounts._panel).click(function(){
		changePasswordDialog.dialog("open");
		return false
	});

	$("#refreshAgents", panelAccounts._panel).click(function(){
		panelAccounts.SyncDataPolling(function(data){
		}, true);
		return false
	});

	if(crushSync.isPopupWindow)
	{
		$("#header, #footer").remove();
	}
	else
	{
		$("#pageContent").show();
	}

	$("#inactiveMessage", panelAccounts._panel).find(".downloadLink").unbind().click(function(){
		panelAccounts.downloadSyncApp();
		return false;
	});
}

panelAccounts.showAgents = function(callback)
{
	if(panelAccounts.availableSyncs && panelAccounts.refreshPanel)
	{
		panelAccounts.configsPanel.empty();
		for(var i=0;i<panelAccounts.availableSyncs.length;i++)
		{
			var curAgent = panelAccounts.availableSyncs[i];
			var pingTS = new Date(parseFloat(curAgent.ping));
			var text = "<span class='agentName'>" + curAgent.clientid + " : " + curAgent.ip + "</span><span class='pingTS' style='float:right'>" + localizationValue("syncManagerLastAgentCommunicationText", "Last agent communication : ") + pingTS.format("mm/dd/yyyy HH:nn:ss a/p") +"</span>";
			if(curAgent.syncName)
				text = "<span class='agentName'>" + curAgent.syncName + " : " + curAgent.ip + "</span><span class='pingTS' style='float:right'>" + localizationValue("syncManagerLastAgentCommunicationText", "Last agent communication : ") + pingTS.format("mm/dd/yyyy HH:nn:ss a/p") +"</span>";
			var segment = $("<div clientid='"+curAgent.clientid+"' class='syncClient clear ui-corner-all ui-widget-content nobg'></div>");
			segment.append("<h2 title='Unique AgentID = "+ curAgent.clientid +"' class='ui-state-highlight ui-corner-all syncHeader' style='vertical-align: top;height: 15px;padding-top:5px;'><span class='refreshData' title='Refresh agents from server'></span><span style='display: inline-block;margin: -1px 3px 0px 0px; float: left;' class='icon ui-icon ui-icon-triangle-1-e'></span>"+text+"</h2>");
			segment.data("agentInfo", curAgent);
			panelAccounts.configsPanel.append(segment);
			segment.append('<div class="agentButtons" style="display:none;margin-top:15px;"><a href="#" class="action button createNewSync" style="float:right;margin:0px 5px 10px 0px;"><span style="display: inline-block;margin: 0px 3px 0px -7px; float: left;" class="pointer ui-icon ui-icon-copy"></span>'+localizationValue("syncManagerCreateNewSyncButtonText", "Create New Sync")+'</a> <a href="#" class="action button changeName" style="float:right;margin:0px 5px 10px 0px;"><span style="display: inline-block;margin: 0px 3px 0px -7px; float: left;" class="pointer ui-icon ui-icon-tag"></span>'+localizationValue("syncManagerSetAgentNameButtonText", "Set Agent Name")+'</a></div>');
			segment.find(".createNewSync").button().unbind().click(function(){
				var that = $(this);
				if(that.hasClass("ui-state-disabled"))
					return false;
				var blockElem = that.addClass("ui-state-disabled");
				var _data = that.closest("div.syncClient").data("agentInfo");
	            blockElem.block({
	                message:  'Wait..',
	                css: {
	                    border: 'none',
	                    padding: '0px',
	                    backgroundColor: '#000',
	                    opacity: .5,
	                    color: '#fff',
	                    'text-align':'left'
	                }
	            });
	            var obj = {
	                command : "sendSyncCommand",
	                agentid : _data.clientid,
	                sync_password : crushSync.syncPassword,
	                sync_command : "set_sync",
	                sync_obj : panelAccounts.defaultSyncVal,
	                sync_action : "insert",
                	random: Math.random()
	            };
	            crushFTP.data.serverRequest(obj,
	                function(msg){
	                	setTimeout(function()
	                	{
	                    	blockElem.removeClass("ui-state-disabled").unblock();
	                    	crushFTP.UI.growl("Wait : ", localizationValue("syncManagerRequestSubmittedText", "Your request is received at server, new sync panel will appear shortly."), false, 3000);
	                	}, 1000);
	                    if($(msg).find("response_status").text() == "Success")
	                    {
	                        panelAccounts.getSyncDetails(that.closest("div.syncClient").index(), true);
	                    }
	            });
	            return false;
			});
			segment.find(".changeName").button().unbind().click(function(){
				var that = $(this);
				var _data = that.closest("div.syncClient").data("agentInfo");
				jPrompt(localizationValue("syncManagerEnterAgentNameText", "Enter Agent Name :"), _data.syncName, "Agent Name", function(val){
					if(val)
					{
						val = $.trim(val);
						var blockElem = that.addClass("ui-state-disabled");
			            blockElem.block({
			                message:  'Wait..',
			                css: {
			                    border: 'none',
			                    padding: '0px',
			                    backgroundColor: '#000',
			                    opacity: .5,
			                    color: '#fff',
			                    'text-align':'left'
			                }
			            });
						var obj = {
			                command : "sendSyncCommand",
			                agentid : _data.clientid,
			                sync_password : crushSync.syncPassword,
			                sync_command : "set_pref",
			                sync_key : "syncName",
			                sync_val : val,
                			random: Math.random()
			            };
			            crushFTP.data.serverRequest(obj,
			                function(msg){
			                    blockElem.removeClass("ui-state-disabled").unblock();
			                    if($(msg).find("response_status").text() == "Success")
			                    {
			                    	_data.syncName = val;
			                    	var curPanel = that.closest("div.syncClient").data("agentInfo", _data);
			                    	var pingTS = new Date(parseFloat(_data.ping));
									var text = _data.syncName + " : " + _data.ip;
									curPanel.find("h2").find(".agentName").text(text);
			                    }
			            });
					}
				})
				return false;
			});
		}
		panelAccounts.bindEvents(true);
		if(!window.isUserFullAdmin)
			panelAccounts.configsPanel.find("h2").trigger("click");
		panelAccounts.refreshPanel = false;
		$(".syncAgentsLoading", panelAccounts._panel).hide();
		panelAccounts.agentsPollingTimeMS = 30000;
	};
}

panelAccounts.bindEvents = function()
{
	panelAccounts.configsPanel.find("h2").unbind().click(function(){
		var tbl = $(this).parent().find(".agentButtons").toggle();
		$(this).parent().find(".syncPanel").toggle();
		if(!tbl.is(":visible"))
		{
			$(this).find(".icon").removeClass("ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-e");
		}
		else
		{
			$(this).find(".icon").removeClass("ui-icon-triangle-1-e").addClass("ui-icon-triangle-1-s");
			if(!$(this).closest("div.syncClient").hasClass("syncLoadedInit"))
			{
				$(this).find(".refreshData").trigger("click");
			}
		}
	}).find(".refreshData").click(function(evt){
		panelAccounts.getSyncDetails($(this).closest("div.syncClient").index(), true);
		evt.stopPropagation();
		return false;
	});
};

panelAccounts.getSyncDetails = function(index, reload)
{
	index = index || 0;
	var curSync = panelAccounts.configsPanel.find("div.syncClient").eq(index);
	if(curSync && curSync.length>0)
	{
		var header = curSync.find("h2");
		if(header.find(".loading").length>0)
			return false;
		header.append("<span class='loading' style='position:relative;top:-3px;margin-left:10px;'></span>");
		var agentInfo = curSync.data("agentInfo");
		var clientid = curSync.attr("clientid");
		panelAccounts.runSyncCommand("get_syncs", [clientid], function(msg){
			curSync.addClass("syncLoadedInit");
			if(msg)
			{
				header.find(".loading").remove();
				var details = $.xml2json(msg);
				if(details && details.response_data && details.response_data.response)
				{
					var response = details.response_data.response;
					crushFTP.methods.rebuildSubItems(response, "response");
					response = response.response_subitem;
					if(reload)
						curSync.find(".template").remove();
					if(response.length>0)
					{
						for(var i=0;i<response.length;i++)
						{
							var curInfo = response[i];
							var randomP = crushFTP.methods.generateRandomPassword(4);
							var randomId = "sync_" + randomP;
							var tbl = $(syncPrefsPanelTemplate).find(".template").clone();
							var tabRandomId = "tab_" + randomP;
							tbl.find(".tab1a").attr("href", "#" + tabRandomId);
							tbl.find(".tab1").attr("id", tabRandomId);
							tbl.find(".tab2a").attr("href", "#" + tabRandomId + "_2");
							tbl.find(".tab2").attr("id", tabRandomId + "_2");
							tbl.addClass("syncPanel").attr("id", randomId).attr("_index", i);
							tbl.find("#log_live_update").attr("id", "log_live_update" + randomP);
							tbl.find("label[for='log_live_update']").attr("for", "log_live_update" + randomP);
							tbl.find("#scroll_with_activity").attr("id", "scroll_with_activity" + randomP);
							tbl.find("label[for='scroll_with_activity']").attr("for", "scroll_with_activity" + randomP);
							curSync.append(tbl);
							tbl.tabs({show :
								function(){
									panelAccounts.refreshLogForSync($(this));
								}
							});
							tbl.find("input").each(function(){
								var rId = "input_" + crushFTP.methods.generateRandomPassword(4);
								$(this).attr("id", rId);
								if($(this).attr("type")=="text")
								{
									$(this).closest("tr").find("label").attr("for", rId);
								}
								else
								{
									$(this).closest("span").find("label").attr("for", rId);
								}
							})
							tbl.find(".filterInput").attr("id", "searchField" + randomP);
							tbl.find("label[for='searchField']").attr("for", "searchField" + randomP);

							tbl.find(".regex").attr("id", "isRegex" + randomP);
							tbl.find("label[for='regexSearch']").attr("for", "isRegex" + randomP);

							tbl.hide().parent().find(".agentButtons").hide();
							var data = curInfo;
							data.clientid = clientid;
							var saveChanges = false;
							if(typeof data.honor_deletes == "undefined")
							{
								data.honor_deletes = "true";
								saveChanges = true;
							}
							if(typeof data.send_compressed == "undefined")
							{
								data.send_compressed = false;
								saveChanges = true;
							}
							if(typeof data.receive_compressed == "undefined")
							{
								data.receive_compressed = false;
								saveChanges = true;
							}
							if(typeof data.size_only == "undefined")
							{
								data.size_only = false;
								saveChanges = true;
							}
							if(typeof data.download_threads == "undefined")
							{
								data.download_threads = 1;
								saveChanges = true;
							}
							if(typeof data.upload_threads == "undefined")
							{
								data.upload_threads = 1;
								saveChanges = true;
							}
							data.index = i;
							tbl.data("syncData", data);
							crushSync.data.bindValuesFromJson(tbl, data, "_id");
							panelAccounts.bindPrefsItemEvents(tbl, data, clientid);
							if(saveChanges && !tbl.find('.advanceSettings').hasClass('ui-state-disabled'))
							{
								tbl.find('.advanceSettingsPanel').find("input:first").trigger('change');
							}
						}
						if(curSync.find(".agentButtons:visible").length==0)
						{
							curSync.find("h2:first").trigger("click");
						}
						curSync.find("a.testSync:not(.initCheckDone):first").trigger("click");
						curSync.form();
					}
					else
					{
						if($(msg).find("agentInfo").text() == "BAD_PASS")
						{
							if(header.find(".badPassMessage").length==0)
							{
								header.find(".pingTS").after($(".badPassMessage:first", panelAccounts._panel).clone().show());
								header.closest("div.syncClient").find(".agentButtons").remove();
								header.closest("div.syncClient").find(".reloadPage").click(function(){
									panelAccounts.reloadPage.trigger("click");
								})
							}
						}
						else
						{
							setTimeout(function(){
								panelAccounts.getSyncDetails(index);
							}, 3000);
						}
					}
				}
				else
				{
					panelAccounts.getSyncDetails(index);
				}
			}
			else
			{
				header.find(".loading").remove();
				crushFTP.UI.growl(localizationValue("syncManagerErrorText", "Error : "), localizationValue("syncManagerUnableToConnectToTheServerText", "Unable to connect to the server. Please make sure server is running and you are connected with server."), true, 5000);
			}
		});
	}
}

panelAccounts.refreshLogForSync = function(elem)
{
	var parentElem = elem.closest(".template");
	var logPanel = parentElem.find(".syncLogPanel");
	if(logPanel.find(".syncStatusLoading").length>0)
		return false;
	if(logPanel.is(":visible"))
	{
		logPanel.find(".info").append("<span class='syncStatusLoading' style='position:absolute;top:40px;left:5px;'></span>");
		var data = parentElem.data("syncData");
		var logIndex = logPanel.attr("curLogIndex") || 0;
		var obj = {
			command : "sendSyncCommand",
			agentid : data.clientid,
			sync_password : crushSync.syncPassword,
			sync_command : "get_log",
			sync_index : logIndex,
			sync_path : data.syncPath,
            random: Math.random()
		};
		crushFTP.data.serverRequest(obj,
			function(msg){
				logPanel.find(".syncStatusLoading").remove();
				if(msg && $(msg).find("response_status").text() == "Success")
				{
					var curIndex = $(msg).find("sync_index").text();
					logPanel.attr("curLogIndex", curIndex);
					var logArea = logPanel.find(".logArea");
					$(msg).find("sync_log_subitem").each(function(){
						logArea.append("<p>"+$(this).text()+"</p>");
					});
					var now = new Date();
					$(".logUpdatedTimestamp", elem).text(dateFormat(now, "mediumTime"));
					if(logPanel.find(".scrollWithActivity").is(":checked"))
					{
						logArea.scrollTo(logArea.find("p:last"));
					}
				}
				if(logPanel.find(".liveUpdate").is(":checked"))
				{
					setTimeout(function(){
						panelAccounts.refreshLogForSync(elem);
					}, 3000);
				}
		}, "POST");
	}
	else
	{
		logPanel.find(".syncStatusLoading").remove();
	}
}

panelAccounts.runSyncCommand = function(command, data, callback, path, elem)
{
	var obj = {
		command : "sendSyncCommand",
		agentid : data[0],
		sync_password : crushSync.syncPassword,
		sync_command : command,
        random: Math.random()
	};
	if(data.length>1)
		obj.sync_index = data[1];
	if(path)
		obj.sync_path = path;
	crushFTP.data.serverRequest(obj,
	function(msg){
		callback(msg, elem);
	});
}

panelAccounts.bindPrefsItemEvents = function(el)
{
	$("a.serverFilePickButton", el).each(function(){
		$(this).unbind().click(function(){
			if($(this).attr("disabled"))
				return false;
			var curElem = $(this);
            var rel = curElem.attr("rel");
            var pickingFor = curElem.parent().parent().parent().find("label[for='"+rel+"']").text() || "";
            pickingFor = $.trim($.trim(pickingFor).replace(":", ""));
			var data = curElem.closest(".template").data("syncData");
			curElem.crushFtpLocalFileBrowserPopup({
				isServerBrowse  : curElem.attr("serverBrowse") == "true" || false,
				pickingFor: pickingFor,
				type : curElem.attr("PickType") || 'dir',
				allowRootSelection : true,
				existingVal : curElem.parent().find("input").val(),
				callback : function(selectedPath){
					curElem.parent().find("input").val(selectedPath).trigger("change");
				},
				syncOpts : {
					syncData : data,
					password : crushSync.syncPassword
				}
			});
			return false;
		});
	});

	$("a.action", el).unbind().click(function(evt, evtdata){
		var that = $(this);
		var elem = that.closest(".template");
		var data = elem.data("syncData");
		var curIndex = elem.attr("_index");
		if(that.hasClass("ui-state-disabled"))
			return false;
		if(that.hasClass("testSync"))
		{
			if(el.data("stopSyncRunning") || elem.data("progressing"))
			{
				setTimeout(function(){
					that.trigger("click", [true]);
				}, 1000);
				return false;
			}
			if(!evtdata)
				elem.find("span.syncStatus").removeClass("syncError inactiveSync activeSync").addClass("syncStatusLoading").text("Please wait.. updating");
			else
				elem.find("label.statusLabel").addClass("progressBG");
			that.data("progressing", true);//.addClass("ui-state-disabled");
			panelAccounts.runSyncCommand("get_status", [data.clientid, curIndex],function(statusData, elem){
				that.removeData("progressing").removeClass("ui-state-disabled");
				that.addClass("initCheckDone");
				if(statusData && $(statusData).find("syncStatus").length>0)
				{
					panelAccounts.processStatusData(statusData, elem);
					var status = $(statusData).find("syncStatus").text();
					status = status || localizationValue("syncManagerSyncNotRunningTitleText","Not running");
					var span = elem.find("span.syncStatus").text(status).removeClass("syncStatusLoading inactiveSync activeSync syncError");
					if(evtdata)
						elem.find("label.statusLabel").removeClass("progressBG");
					status = status.toLowerCase();
					elem.addClass("statusPollEnabled");
					if(status.indexOf("error")>=0 && status != "error...server is offline.")
					{
						span.addClass("syncError");
						elem.removeClass("statusPollEnabled");
						elem.find(".startSync, .deleteSync, .advanceSettings").removeClass("ui-state-disabled");
						elem.find(".stopSync").addClass("ui-state-disabled");
						elem.find(".settingsArea").find(".serverFilePickButton").removeAttr("disabled");
						elem.find("td.settingsArea").removeClass("disabledUI");
					}
					else if(status.indexOf("not running")>=0)
					{
						span.addClass("inactiveSync");
						elem.removeClass("statusPollEnabled");
						elem.find(".startSync, .deleteSync, .advanceSettings").removeClass("ui-state-disabled");
						elem.find(".stopSync").addClass("ui-state-disabled");
						elem.find(".settingsArea").find(".serverFilePickButton").removeAttr("disabled");
						elem.find("td.settingsArea").removeClass("disabledUI");
					}
					else
					{
						span.addClass("activeSync");
						elem.find(".startSync, .deleteSync, .advanceSettings").addClass("ui-state-disabled");
						elem.find(".advanceSettingsPanel").hide("fast");
						elem.find(".stopSync").removeClass("ui-state-disabled");
						elem.find(".settingsArea").find(".serverFilePickButton").attr("disabled", "disabled");
						elem.find("td.settingsArea").addClass("disabledUI");
					}
					elem.closest("div.syncClient").find("a.testSync:not(.initCheckDone):first").trigger("click");
					if(elem.hasClass("statusPollEnabled"))
					{
						setTimeout(function(){
							that.trigger("click", [true]);
						}, 4000);
					}
				}
				else
				{
					elem.find("span.syncStatus").removeClass("syncStatusLoading");
					elem.removeClass("statusPollEnabled");
					if(evtdata)
						elem.find("label.statusLabel").removeClass("progressBG");
					elem.closest("div.syncClient").find("a.testSync:not(.initCheckDone):first").trigger("click");
					if(data.syncPath && data.syncPath!="")
					{
						setTimeout(function(){
							that.trigger("click", [true]);
						}, 4000);
					}
				}
			}, data.syncPath, elem);
		}
		else if(that.hasClass("startSync"))
		{
			var path = $('input[_id="syncServerPath"]').val() || "/";
			panelAccounts.verifyDirSyncEnabled(path, function(flag){
				if(flag || window.isUserFullAdmin)
				{
					var blockElem = that.addClass("ui-state-disabled");
					elem.find(".deleteSync, .advanceSettings").addClass("ui-state-disabled");
					elem.find(".advanceSettingsPanel").hide("fast");
					elem.find(".settingsArea").find(".serverFilePickButton").attr("disabled", "disabled");
					elem.find("td.settingsArea").addClass("disabledUI");
					blockElem.block({
						message:  'Wait..',
						css: {
							border: 'none',
							padding: '0px',
							backgroundColor: '#000',
							opacity: .5,
							color: '#fff',
							'text-align':'left'
						}
					});
					panelAccounts.runSyncCommand("start_sync", [data.clientid, curIndex], function(statusData, elem){
						if(statusData)
						{
							blockElem.unblock();
							elem.addClass("statusPollEnabled");
							elem.find(".testSync").trigger("click", [true]);
							elem.find("div.syncLogPanel").attr("curLogIndex", "0");
						}
					}, data.syncPath, elem);
				}
				else
				{
					crushFTP.UI.growl(localizationValue("syncManagerErrorText", "Error : "), localizationValue("syncManagerServerPathNotValidText", "Selected server path is invalid or sync is not enabled"), true, 3500);
				}
			});
		}
		else if(that.hasClass("stopSync"))
		{
			var blockElem = that.addClass("ui-state-disabled");
			blockElem.block({
				message:  'Wait..',
				css: {
					border: 'none',
					padding: '0px',
					backgroundColor: '#000',
					opacity: .5,
					color: '#fff',
					'text-align':'left'
				}
			});
			el.data("stopSyncRunning", true);
			panelAccounts.runSyncCommand("stop_sync", [data.clientid, curIndex], function(statusData, elem){
				el.removeData("stopSyncRunning");
				if(statusData)
				{
					blockElem.unblock();
					elem.find(".testSync").trigger("click", [true]);
				}
			}, data.syncPath, elem);
		}
		else if(that.hasClass("saveSync"))
		{
			var blockElem = that.addClass("ui-state-disabled");
			blockElem.block({
				message:  'Wait..',
				css: {
					border: 'none',
					padding: '0px',
					backgroundColor: '#000',
					opacity: .5,
					color: '#fff',
					'text-align':'left'
				}
			});
			var obj = {
				command : "sendSyncCommand",
				agentid : data.clientid,
				sync_password : crushSync.syncPassword,
				sync_command : "set_sync",
				sync_obj : '<?xml version="1.0" encoding="UTF-8"?><syncs_subitem type="properties">' + crushSync.data.buildXMLToSubmitForm(elem, false, "_id") + "</syncs_subitem>",
				sync_action : "update",
				sync_index : elem.attr("_index"),
                random: Math.random()
			};
			elem.find(".serverFilePickButton").attr("disabled", "disabled");
			elem.find("td.settingsArea").addClass("disabledUI");
			crushFTP.data.serverRequest(obj,
				function(msg){
					elem.find(".serverFilePickButton").removeAttr("disabled");
					elem.find("td.settingsArea").removeClass("disabledUI");
					blockElem.removeClass("ui-state-disabled").unblock();
					if(msg)
					{
						var dataJson = $.xml2json(msg);
						if(dataJson && dataJson.response_data && dataJson.response_data.response && dataJson.response_data.response.response_subitem)
						{
							var agent = dataJson.response_data.response.response_subitem;
							if(typeof agent.allowUnstable != "undefined")
								agent = [agent];
							var curAgent = {};
							if(agent && agent.length>obj.sync_index)
							{
								curAgent = agent[obj.sync_index];
							}
							var newData = $.extend(data, curAgent);
							newData.index = curIndex;
							elem.data("syncData", newData);
							crushSync.data.bindValuesFromJson(elem.find(".prefsPanel"), newData, "_id", false, true);
							elem.closest("div.syncPanel").find("a.testSync").trigger("click");
						}
					}
			});
		}
		else if(that.hasClass("deleteSync"))
		{
			jConfirm("Are you sure you wish to delete this sync configuration?", "Confirm", function(flag){
				if(flag)
				{
					var blockElem = that.addClass("ui-state-disabled");
					blockElem.block({
						message:  'Wait..',
						css: {
							border: 'none',
							padding: '0px',
							backgroundColor: '#000',
							opacity: .5,
							color: '#fff',
							'text-align':'left'
						}
					});
					var obj = {
						command : "sendSyncCommand",
						agentid : data.clientid,
						sync_password : crushSync.syncPassword,
						sync_command : "set_sync",
						sync_obj : '<?xml version="1.0" encoding="UTF-8"?><syncs_subitem type="properties">' + crushSync.data.buildXMLToSubmitForm(elem, false, "_id") + "</syncs_subitem>",
						sync_action : "delete",
						sync_index : elem.attr("_index"),
                		random: Math.random()
					};
					crushFTP.data.serverRequest(obj,
						function(msg){
							setTimeout(function()
		                	{
		                    	blockElem.removeClass("ui-state-disabled").unblock();
		                    	crushFTP.UI.growl("Wait : ",  localizationValue("syncManagerRequestSubmittedText", "Your request is received at server, please wait while data refreshes."), false, 3000);
		                	}, 1000);
							if($(msg).find("response_status").text() == "Success")
							{
								panelAccounts.getSyncDetails(that.closest("div.syncClient").index(), true);
							}
					});
				}
			}, {
				okButtonText : "Yes",
				cancelButtonText : "No"
			});
		}
		else if(that.hasClass("refreshLog"))
		{
			panelAccounts.refreshLogForSync(that.closest("div.syncLogPanel"));
		}
		else if(that.hasClass("emailLog"))
		{
			that.block({
				message:  'Wait..',
				css: {
					border: 'none',
					padding: '0px',
					backgroundColor: '#000',
					opacity: .5,
					color: '#fff',
					'text-align':'left'
				}
			});
			var obj = {
				command : "sendSyncCommand",
				agentid : data.clientid,
				sync_password : crushSync.syncPassword,
				sync_command : "SEND_LOG",
				sync_index : elem.attr("_index"),
                random: Math.random()
			};
			crushFTP.data.serverRequest(obj,
			function(msg){
				that.unblock();
				if($(msg).find("response_status").text() == "Success")
				{
					crushFTP.UI.growl(localizationValue("syncManagerMailSentText", "Mail sent : "), localizationValue("syncManagerMailSentDescText", "Log has been sent via email"), false, 3000);
				}
				else
					crushFTP.UI.growl(localizationValue("syncManagerMailSendingFailedText", "Mail sending failed : "), $(msg).find("response_status").text(), true, 3000);
			});
		}
		else if(that.hasClass("advanceSettings"))
		{
			elem.find(".advanceSettingsPanel").toggle("fast");
		}
		return false;
	});

	function pad(num, size) {
	    var s = num+"";
	    while (s.length < size) s = "0" + s;
	    return s;
	}
	var scheduled_times = $(".scheduled_times", el);
	var addScheduleTime = $(".addScheduleTime", el).click(function(evt, data){
		var _time = "12:00";
		if(data)
			_time=data;
		jPrompt(localizationValue("syncManagerEnterTimeText", "Enter a schedule time : (24 hours format)"), _time, localizationValue("syncManagerScheduleTitleText", "Schedule Time"), function(value){
			if(value)
			{
				var time = value.split(":");
				var isValid = false;
				if(time.length==2)
				{
					var hrs = time[0];
					var min = time[1];
					if(crushFTP.methods.isNumeric(hrs) && crushFTP.methods.isNumeric(min))
					{
						hrs = parseInt(hrs);
						min = parseInt(min);
						if(hrs<=24 && min<=59)
						{
							time = pad(hrs,2) + ":" + pad(min, 2);
							if(scheduled_times.val().length>0)
								scheduled_times.val(scheduled_times.val() + "," + time);
							else
								scheduled_times.val(time);
							isValid = true;
						}
					}
				}
				if(!isValid)
				{
					jAlert(localizationValue("syncManagerInvalidTimeText", "Invalid time format, try again"), localizationValue("syncManagerErrorText", "Error"), function(){
						addScheduleTime.trigger("click", [value]);
					});
				}
				else
				{
					$(".prefsPanel", el).find("input:first").trigger("change");
				}
			}
		});
		return false
	});

	$("input.liveUpdate", el).unbind().bind("change", function(){
		if($(this).is(":checked"))
			panelAccounts.refreshLogForSync($(this).closest("div.syncLogPanel"));
	});

	$(".prefsPanel", el).find("textarea").unbind("change").bind("change", function()
	{
		$(".prefsPanel", el).find("input:first").trigger("change");
	});

	$(".prefsPanel", el).find("input, select").unbind("change").bind("change", function()
	{
		if($(this).attr("_id")=="syncPath" || $(this).attr("_id")=="syncServerPath")
		{
			var path = $(this).val();
			path = path.replace(/\\/g, "/").replace(/\//g, "/").replace(/\\\\/g, "/").replace(/\/\//g, "/");
			if(path.indexOf("/") != 0)
			{
				path = "/" + path;
			}
			if(path[path.length-1] != "/")
			{
				path += "/";
			}
			var that = $(this).val(path);
			if($(this).attr("_id")=="syncServerPath")
			{
				if(window.isUserFullAdmin)
				{
					el.find(".saveSync").trigger("click");
				}
				else
				{
					panelAccounts.verifyDirSyncEnabled(path, function(flag){
						if(flag)
							el.find(".saveSync").trigger("click");
						else
						{
							var data = el.data("syncData");
							if(data && data.syncServerPath)
								that.val(data.syncServerPath);
							else
								that.val("/");
							crushFTP.UI.growl(localizationValue("syncManagerErrorText", "Error : "), localizationValue("syncManagerServerPathNotValidText", "Selected server path is invalid or sync is not enabled"), true, 3500);
						}
					});
				}
			}
			else
				el.find(".saveSync").trigger("click");
		}
		else if($(this).attr("_id")=="move_after_sync" || $(this).attr("_id")=="upload_delete")
		{
			if($(this).is(":checked"))
			{
				if($(this).attr("_id")=="move_after_sync")
				{
					crushFTP.UI.checkUnchekInput(el.find("input[_id='upload_delete']"), false);
				}
				else
				{
					crushFTP.UI.checkUnchekInput(el.find("input[_id='move_after_sync']"), false);
				}
			}
			el.find(".saveSync").trigger("click");
		}
		else
			el.find(".saveSync").trigger("click");
	});

	var filterInput = $(".filterInput", el).unbind("keyup").keyup(function (evt) {
		var evt = (evt) ? evt : ((event) ? event : null);
		var logArea = el.find(".logArea");
		if (evt.keyCode == 27)
		{
			$(this).val("").trigger("keyup");
			return false;
		}
		var phrase = $.trim($(this).val());
		if ($(this).data("last_searched") && $(this).data("last_searched") === phrase) {
			return false;
		}
		$(this).data("last_searched", phrase);
		if(!phrase)
		{
			el.find(".logArea").removeHighlight();
			return false;
		}
		if(el.find(".regex").is(":checked"))
		{
			try{
				phrase = phrase.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
				var regex = new RegExp(""+phrase+"");
				logArea.removeHighlight().highlight(regex);
			}
			catch(ex){
			}
		}
		else
			logArea.removeHighlight().highlight("" + phrase);
		var frstElem = logArea.find(".highlight:first");
		if(frstElem.length>0)
			logArea.scrollTo(frstElem);
	});

	$(".clearFilter", el).unbind().click(function(){
		filterInput.val("").trigger("keyup");
		return false;
	});
}

panelAccounts.processStatusData = function(data, elem)
{
	var statusProgressPanel = elem.find(".statusProgress");
	var jsonData = $.xml2json(data);
	if(jsonData.response_data && jsonData.response_data.response)
		jsonData = jsonData.response_data.response;
	else
	{
		statusProgressPanel.hide();
		return;
	}
	if(!jsonData.downloadStatus && !jsonData.uploadStatus)
	{
		statusProgressPanel.hide();
		return;
	}
	if(jsonData.toUploadStatus=="" || !jsonData.uploadStatus)
	{
		var uploadStatus = statusProgressPanel.find(".uploadStatus").hide().removeData("uploadInfo");
		uploadStatus.find(".time,.speed,.status,.uploadStatusLabel").remove();
	}
	else
	{
		var uploadStatusPanel = statusProgressPanel.show().find(".uploadStatus");
		if(!uploadStatusPanel.data("uploadInfo"))
		{
			var obj = jsonData.uploadStatus;
			obj.history = new Array();
			obj.status = obj.uploadStatus;
			uploadStatusPanel.data("uploadInfo", obj);
			panelAccounts.showProgressBar(uploadStatusPanel);
		}
		else
		{
			var obj = jsonData.uploadStatus;
			var uploadInfo = uploadStatusPanel.data("uploadInfo");
			obj.history = uploadInfo.history;
			obj.status = obj.uploadStatus;
			uploadStatusPanel.data("uploadInfo", obj);
			panelAccounts.showProgressBar(uploadStatusPanel);
		}
	}
	if(jsonData.toDownloadStatus=="" || !jsonData.downloadStatus)
	{
		var downloadStatus = statusProgressPanel.find(".downloadStatus").hide().removeData("uploadInfo");
		downloadStatus.find(".time,.speed,.status,.uploadStatusLabel").remove();
	}
	else
	{
		var downloadStatusPanel = statusProgressPanel.show().find(".downloadStatus");
		if(!downloadStatusPanel.data("uploadInfo"))
		{
			var obj = jsonData.downloadStatus;
			obj.history = new Array();
			obj.status = obj.downloadStatus;
			downloadStatusPanel.data("uploadInfo", obj);
			panelAccounts.showProgressBar(downloadStatusPanel);
		}
		else
		{
			var obj = jsonData.downloadStatus;
			var uploadInfo = downloadStatusPanel.data("uploadInfo");
			obj.history = uploadInfo.history;
			obj.status = obj.downloadStatus;
			downloadStatusPanel.data("uploadInfo", obj);
			panelAccounts.showProgressBar(downloadStatusPanel);
		}
	}
}

panelAccounts.formatTime = function(secs) {
	var remaining = "";
	secs = secs.substring(0, secs.indexOf(".")) * 1;
	var mins = (secs / 60) + ".0";
	mins = mins.substring(0, mins.indexOf(".")) * 1;
	if (mins > 0) {
		secs -= (mins * 60);
		remaining = mins + " min, " + secs + " secs";
	} else {
		if (secs < 0) {
			remaining = "Calculating..";
		} else {
			remaining = secs + " secs";
		}
	}
	return remaining;
}

panelAccounts.formatBytes = function(bytes) {
	if(!bytes || bytes<0) return "*";
	try{
		bytes = parseFloat(bytes);
	}catch(ex){return "*";}
	if(bytes==NaN)
		return "*";
	else if ((bytes / 1024).toFixed(0) == 0) return bytes.toFixed(1) + " bytes";
	else if ((bytes / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024).toFixed(1) + " KB";
	else if ((bytes / 1024 / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024 / 1024).toFixed(1) + " MB";
	else if ((bytes / 1024 / 1024 / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024 / 1024 / 1024).toFixed(1) + " GB";
	else if ((bytes / 1024 / 1024 / 1024 / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024 / 1024 / 1024 / 1024).toFixed(1) + " TB";
}

panelAccounts.showProgressBar = function(progressInfo)
{
	var uploadInfo = progressInfo.data("uploadInfo");
	if(!uploadInfo) return;
	var now = new Date().getTime();
	if (!uploadInfo.history) uploadInfo.history = new Array();
	//calculate speeds using a rolling 10 interval window.  This provides a smoother speed calculation that doesn't bounce around so much to make the user concerned
	var history = uploadInfo.history;//Progressbar data history
	var currentSpeed = uploadInfo.currentSpeed;//Current upload/download speed
	var speedHistory = uploadInfo.speedHistory || [];
	history.push({
		now: now,
		bytes: uploadInfo.transferedBytes
	});
	if (history.length > 0) {//Calculation and updating progressbar. Calculation of speed, percentages etc.
		var pivot = 0; //If history is for less than 5 seconds, use data of first second
		if (history.length > 5) {
			pivot = history.length - 5; // Set pivot to be of previous five second
		}
		var elapsed = now - history[0].now; // Time elapsed
		var bytes = uploadInfo.transferedBytes - history[pivot].bytes; // Bytes transferred in timeframe
		var lastElapsed = now - history[pivot].now;// Elapsed time for last transfer timeframe
		var originalBytes = uploadInfo.transferedBytes - history[0].bytes; // total bytes transferred
		var secs = ((((uploadInfo.totalBytes - uploadInfo.transferedBytes) / (originalBytes / elapsed)) / 1000) + 1) + ""; // total time remaining
		var remaining = panelAccounts.formatTime(secs);//formatted time
		var percentDone = (uploadInfo.transferedBytes / uploadInfo.totalBytes) * 100.0;// percentages completed
		var rElapsed = panelAccounts.formatTime((elapsed / 1000) + 1 + "");// elapsed time formatted
		var speed = "";
		var currentActualSpeed = 0;
		if ((originalBytes / elapsed) == 0) {// Still Calculating
			speed = "Calculating..";
			remaining = "Calculating..";
			uploadInfo.currentSpeed = speed;
		} else {
			currentActualSpeed = (bytes / lastElapsed) * 1024.0;
			speed = panelAccounts.formatBytes(currentActualSpeed) + "/s";// Based on data transferred in last timeframe (5 secs)
			uploadInfo.currentSpeed = speed;
		}
		var uploadedSize = panelAccounts.formatBytes(uploadInfo.transferedBytes);
		var originalSize = panelAccounts.formatBytes(uploadInfo.totalBytes);
		progressInfo.find(".time,.speed,.status,.uploadStatusLabel").remove();
		progressInfo.prepend("<div class='status'>"+uploadInfo.status+"</div>");
		progressInfo.append('<span class="uploadStatusLabel">' + uploadedSize + ' of ' + originalSize + '</span>');
		var timeStampLabel = "<div class='time'> Time: Elapsed: <span class='elapsed'>{0}</span> <span class='remained'>, Remaining : {1}</span></div>";
		timeStampLabel = timeStampLabel.replace("{0}", rElapsed);
		uploadInfo.timeElapsed = rElapsed;
		timeStampLabel = timeStampLabel.replace("{1}", remaining);
		progressInfo.append(timeStampLabel);
		uploadInfo.avgSpeed = speed;
		if(elapsed/1000 >= 20)
		{
			speedHistory.push(currentActualSpeed);
			uploadInfo.speedHistory = speedHistory;
			var getAverageSpeed = function()
			{
				if(speedHistory.length>30)
				{
					while (speedHistory.length > 30) speedHistory.shift();
				}
				var avgSpeed = speedHistory.average();
				if(avgSpeed>0)
				{
					uploadInfo.avgSpeed = panelAccounts.formatBytes(avgSpeed) + "/s";
					return "Avg. Speed : " + uploadInfo.avgSpeed +", ";
				}
				else
					return "";
			}
			progressInfo.append("<div class='speed'>" + getAverageSpeed() + "Current Speed : " + speed + "</div>");
		}
		else
		{
			progressInfo.append("<div class='speed'>" + "Current Speed : " + speed + "</div>");
		}
		if(uploadInfo.transferedBytes>0)
			progressInfo.find(".progressbar").progressbar({"value" : percentDone});
		progressInfo.data("uploadInfo", uploadInfo).show();
	}
}

panelAccounts.processResponse = function(data)
{
	if(data)
	{
		var dataJson = $.xml2json(data);
		var avlClientIds = [];
		if(dataJson && dataJson.response_data && dataJson.response_data.agents)
		{
			var agents = dataJson.response_data.agents;
			crushFTP.methods.rebuildSubItems(agents, "agents");
			agents = agents.agents_subitem;
			for(var i=0;i<agents.length;i++)
			{
				var curAgent = agents[i];
				if(!panelAccounts.isSyncItemAvailable(curAgent.clientid))
				{
					panelAccounts.availableSyncs.push(curAgent);
					panelAccounts.refreshPanel = true;
				}
				else
				{
					var pingTS = new Date(parseFloat(curAgent.ping));
					curAgent.syncName = curAgent.syncName || curAgent.clientid;
					panelAccounts.configsPanel.find("div[clientid='"+curAgent.clientid+"']").find(".pingTS").text(localizationValue("syncManagerLastAgentCommunicationText", "Last agent communication : ") + pingTS.format("mm/dd/yyyy HH:nn:ss a/p"));
				}
				avlClientIds.push(curAgent.clientid);
			}
		}
		panelAccounts.configsPanel.find("div[clientid]").each(function(){
			var clientid = $(this).attr("clientid");
			if(!avlClientIds.has(clientid))
			{
				$(this).remove();
				var newAccs = [];
				if(panelAccounts.availableSyncs)
				{
					for(var i=0;i<panelAccounts.availableSyncs.length;i++)
					{
						if(panelAccounts.availableSyncs[i].clientid != clientid)
						{
							newAccs.push(panelAccounts.availableSyncs[i]);
						}
					}
					panelAccounts.availableSyncs = newAccs;
				}
			}
		});
		if(panelAccounts.availableSyncs.length==0)
			panelAccounts.inactiveCallsCount++;
		else
			panelAccounts.inactiveCallsCount = 0;

		if(panelAccounts.inactiveCallsCount>3)
			$("#inactiveMessage", panelAccounts._panel).show();
		else
			$("#inactiveMessage", panelAccounts._panel).hide();
	}
}

panelAccounts.downloadSyncApp = function(appName)
{
    appName = appName || localizations.syncAppName || "CrushSync";
    $("#syncAppNamePanel").remove();
    var promptTemplate = "<div class='syncAppNamePanel'><h2>" + localizationValue("SyncAppNameWindowHeaderText") + "</h2><br><div style='text-align:left;'>"+localizationValue("SyncAppDownloadYourPassText")+"<input type='password' class='currentPass' style='width:300px;' /><br><div style='text-align:left;'>"+localizationValue("SyncAppDownloadAdminPassText")+"<input type='password' class='appName' style='width:300px;' /><br><div class='cancelButton' style='float:right;margin-left:10px;'>" + localizationValue("SyncAppNamePanelCancelLinkText") + "</div><div class='saveButton' style='float:right;'>" + localizationValue("SyncAppNamePanelSaveLinkText") + "</div></div></div>";
    $("body").append("<div id='syncAppNamePanel'>" + promptTemplate + "</div>");
    var $NameBox = $("#syncAppNamePanel").hide();
    $.blockUI({
        message: $NameBox,
        css: {
            padding: '10px 10px 20px 30px',
            'background-color': "#FFF",
            'border': "1px solid #CCC",
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            color: '#000',
            opacity: 0.9,
            top: 100,
            left: '40%',
            width: '305px'
        },
        onBlock : function()
        {
            $NameBox.parent().css("top","200px");
            if($("div#filesBasket").dialog("isOpen"))
            {
                $(".blockOverlay").css("z-index", "1002");
                $(".blockMsg").css("z-index", "1003");
                $("div#filesBasket").parent().css("z-index", "1001");
            }
        },
        onUnblock : function()
        {
            if($("div#filesBasket").dialog("isOpen"))
            {
                $("div#filesBasket").parent().css("z-index", "1003");
            }
        }
    });
    $NameBox.find(".currentPass").val("").focus();
    $NameBox.find(".cancelButton").unbind().click(
       function () {
            $.unblockUI();
            $("#syncAppNamePanel").remove();
            if($("div#filesBasket").dialog("isOpen"))
            {
                $("div#filesBasket").parent().css("z-index", "1003");
            }
    });
    $NameBox.find(".saveButton").unbind().click(
    function () {
        var newName =  encodeURIComponent($NameBox.find(".appName").val());
        var curPass = encodeURIComponent($NameBox.find(".currentPass").val());
        panelAccounts.submitAction({
            '#command': "downloadSyncAgent",
            '#appname' : appName,
            '#admin_pass': newName,
            '#current_password': curPass,
            '#random': Math.random()
        });
        $.growlUI(localizationValue("DownloadStartedAlertTitleText"), localizationValue("DownloadStartedAlertDescText"), 3000);
        if($("div#filesBasket").dialog("isOpen"))
        {
            $("div#filesBasket").parent().css("z-index", "1003");
        }
    });
    $NameBox.find(".appName").unbind().keyup(
    function (evt) {
        var evt = (evt) ? evt : ((event) ? event : null);
        if (evt.keyCode == 13) {
            $NameBox.find(".saveButton").click();
            return false;
        } else if (evt.keyCode == 27) {
            $NameBox.find(".cancelButton").click();
            return false;
        }
    });
}

panelAccounts.submitAction = function(opt, requestType){
	var uniqueIFrameID = "i" + Math.random();
	var uniqueIFrame = $("<iframe id=\"" + uniqueIFrameID + "\" name=\"" + uniqueIFrameID + "\" src=\"javascript:false;\" style=\"display:none;\"></iframe>");
	$("body").append(uniqueIFrame);
	$("#crushftp_action").remove();
	$("body").append('<form id="crushftp_action" style=\"display:none;\" name="crushftp_action" enctype="multipart/form-data" method="post">' + '<input type="text" id="command" name="command" value="" />' + '<input type="text" id="path" name="path" value="" />' + '<input type="text" id="paths" name="paths" value="" />' + '<input type="text" id="random" name="random" value="" />' + '</form>');
	var formToSubmit = $("#crushftp_action");
	if(requestType)
	{
		formToSubmit.attr("method", requestType);
	}
	formToSubmit.attr("action", "/WebInterface/function/").attr("target", uniqueIFrameID);
	formToSubmit.find("input").val("");
	for (var key in opt) {
		if (opt.hasOwnProperty(key)) {
			if(formToSubmit.find(key).attr("value", opt[key]).length==0)
			{
				formToSubmit.append('<input type="text" id="'+key.replace("#", "")+'" name="'+key.replace("#", "")+'" value="'+opt[key]+'" />');
			}
		}
	}
	formToSubmit.submit();
}

panelAccounts.isSyncItemAvailable = function(clientid)
{
	var avl = false;
	if(panelAccounts.availableSyncs)
	{
		for(var i=0;i<panelAccounts.availableSyncs.length;i++)
		{
			if(panelAccounts.availableSyncs[i].clientid == clientid)
			{
				avl = true;
				i = panelAccounts.availableSyncs.length;
			}
		}
	}
	return avl;
}

panelAccounts.SyncDataPolling = function(callback, noTimer)
{
	$(".syncAgentsLoading", panelAccounts._panel).show();
	crushSync.data.getSyncData(function(data){
		$(".syncAgentsLoading", panelAccounts._panel).hide();
		panelAccounts.processResponse(data);
		panelAccounts.showAgents();
		if(!noTimer)
		{
			setTimeout(function(){
				panelAccounts.SyncDataPolling(callback);
			}, panelAccounts.agentsPollingTimeMS);
		}
	});
}

panelAccounts.tools = {
	decodeURILocal : function(val)
    {
        var _val = val;
        try{
            _val = decodeURIComponent(val);
        }
        catch(ex){
        }
        return _val;
    },
    encodeURILocal : function(val)
    {
        var _val = val;
        try{
            _val = encodeURIComponent(val);
        }
        catch(ex){}
        return _val;
    }
}

panelAccounts.verifyDirSyncEnabled = function(dir, callback)
{
	var _path = escape(dir);
	try{
        _path = panelAccounts.tools.encodeURILocal(unescape(unescape(_path)));
    }
    catch(ex)
    {
        _path = panelAccounts.tools.encodeURILocal(_path);
    }
	var obj = {
		command: "getXMLListing",
		format: "JSONOBJ",
		path: _path, //if required dir.replace(/\+/g, "%2B"),
		random: Math.random()
	};
	crushFTP.data.serverRequest(obj,
		function(msg){
			var enabled = false;
			try{
				if(typeof msg == "string")
					msg = JSON.parse(msg);
			}catch(ex){}
			if(msg && msg.privs && msg.privs.indexOf("(syncName=")>=0)
			{
				enabled=true;
			}
			if(callback)
				callback(enabled);
	});
}