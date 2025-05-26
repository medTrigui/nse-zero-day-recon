/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelAbout = {};
panelAbout.localization = {};
/****************************/

// Panel details
panelAbout.panelName = "About";
panelAbout._panel = $("#pnl" + panelAbout.panelName);
panelAbout.makingListUpdate = 0;

// Localizations
panelAbout.localization = {
};

// Assign localizations
localizations.panels[panelAbout.panelName] = $.extend(panelAbout.localization, localizations.panels[panelAbout.panelName]);

// Interface methods
panelAbout.init = function(){
	applyLocalizations(panelAbout.panelName, localizations.panels);
	panelAbout.bindEvents();
	panelAbout.bindData();
}

panelAbout.bindData = function()
{
	var serverInfo = crushFTP.storage("serverInfo");
	if(serverInfo)
	{
		serverInfo.repliction_status1 =
		serverInfo.repliction_status2 =
		serverInfo.repliction_status3 =
		serverInfo.repliction_error =
		serverInfo.last_item_path =
		serverInfo.last_item_client_id =
		serverInfo.last_item_id =
		serverInfo.last_item_date =
		serverInfo.last_item_action =
		serverInfo.last_item_path1 =
		serverInfo.last_item_path2 =
		serverInfo.last_item_path3 = "";
		if(serverInfo.replication_status){
			serverInfo.repliction_status1 = serverInfo.replication_status.status1 || "";
			serverInfo.repliction_status2 = serverInfo.replication_status.status2 || ""
			serverInfo.repliction_status3 = serverInfo.replication_status.status3 || ""
			serverInfo.repliction_error =  serverInfo.replication_status.error || "";
			serverInfo.last_item_client_id =  serverInfo.replication_status.last_item_client_id || "";
			serverInfo.last_item_id =  serverInfo.replication_status.last_item_id || "";
			serverInfo.last_item_path = serverInfo.replication_status.last_item_path || "";
			serverInfo.last_item_date = serverInfo.replication_status.last_item_date || "";
			serverInfo.last_item_action = serverInfo.replication_status.last_item_action || "";
			serverInfo.last_item_path1 = serverInfo.replication_status.last_item_path1 || "";
			serverInfo.last_item_path2 = serverInfo.replication_status.last_item_path2 || "";
			serverInfo.last_item_path3 = serverInfo.replication_status.last_item_path3 || "";
		}
		if(serverInfo.last_item_client_id && serverInfo.last_item_id){
			$('#killReplication').removeAttr("disabled").removeClass('ui-state-disabled').unbind().click(function(){
				crushFTP.UI.showLoadingIndicator({});
				crushFTP.data.serverRequest({
					command: "deleteReplication",
					client_id : serverInfo.last_item_client_id,
					item_id : serverInfo.replication_status.last_item_id
				},
				function(data){
					crushFTP.UI.hideLoadingIndicator({})
				}, false, "POST");
				return false;
			});
		}
		else{
			$('#killReplication').attr("disabled", "disabled").addClass('ui-state-disabled').unbind().click(function(){
				return false;
			});
		}
		if(serverInfo.java_info){
			serverInfo.java_info = serverInfo.java_info.replace(/\r?\n/g, "<br>");
			$('#javaInfo', panelAbout._panel).show().find("span").html(DOMPurify.sanitize(serverInfo.java_info));
		}
		else
			$('#javaInfo', panelAbout._panel).hide();

		if(serverInfo.memcache_objects)
			$('#memcacheItems', panelAbout._panel).show();
		else
			$('#memcacheItems', panelAbout._panel).hide();

		if(serverInfo.exif_item_count)
			$('#exifCachedCount', panelAbout._panel).show();
		else
			$('#exifCachedCount', panelAbout._panel).hide();
		var cacheSize = serverInfo.keywords_cache_size || 0;
		cacheSize = crushFTP.methods.formatBytes(cacheSize);
		serverInfo.keywords_cache_size_f = cacheSize;
		$('#keywordCacheSize', panelAbout._panel).show();
		adminPanel.data.bindValuesFromJson(panelAbout._panel, serverInfo);

		if (serverInfo.enterprise_level*1 > 0) $("#enterprise_level", panelAbout._panel).text("Enterprise Level: "+serverInfo.enterprise_level);
		if($("#enterprise_level", panelAbout._panel).text() == "0")
			$("#enterprise_level", panelAbout._panel).hide();
		else
			$("#enterprise_level", panelAbout._panel).show();

		if (serverInfo.max_max_users == "32768") $("#max_max_users", panelAbout._panel).text("unlimited");
		else if (serverInfo.max_max_users == "5")
		{
			$("#registration_name", panelAbout._panel).text("Unregistered");
			$("#registration_email", panelAbout._panel).text("30 Day Trial");
		}

		$("#server_current_version", panelAbout._panel).text(serverInfo.version_info_str + serverInfo.sub_version_info_str);

		if(serverInfo.update_available == "true")
		{
			$("#newUpdateAvailable", panelAbout._panel).show();
			$("#noNewVersion", panelAbout._panel).hide();
			if(!adminPanel.updateNotificationShown)
			{
				adminPanel.updateNotificationShown = true;
				crushFTP.UI.growl("Update available", "New version available : " +  DOMPurify.sanitize(serverInfo.update_available_version) + "<div style='margin:10px;text-align:right;'>" + "<a href='#' class='growlUpdateShowInfo'>Show Details</a> | <a href='#' class='growlUpdateNow'>Update Now</a></div>", false);
				setTimeout(function(){
					$(".growlUpdateShowInfo").click(function(){
						$("#configOptionTabs").tabs({selected:3});
						$("#showNewVersionDetails", panelAbout._panel).trigger("click");
						$(this).closest(".ui-notify").find(".ui-notify-close").trigger("click");
						return false;
					});
					$(".growlUpdateNow").click(function(){
						$("#configOptionTabs").tabs({selected:3});
						// $(".updateCrushFTP:first", panelAbout._panel).trigger("click");
						window.isOnlyWIUpdate = false;
						panelAbout.makingListUpdate = 0;
						crushFTP.data.serverRequest({
							command: "updateNow"
						},
						function(data){
							panelAbout.checkUpdateProgress(true);
						}, false, "POST");
						$(this).closest(".ui-notify").find(".ui-notify-close").trigger("click");
						return false;
					});
				}, 500);
			}
		}
		else
		{
			$("#newUpdateAvailable", panelAbout._panel).hide();
			$("#noNewVersion", panelAbout._panel).show();
		}

		if(serverInfo && serverInfo.machine_is_windows && serverInfo.machine_is_windows.toString() != "true")
		{
			$(".windowsOnly", panelAbout.serverRestartingDialog).remove();
		}
	}
	else
	{
		panelAbout._panel.block({
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
		});

		adminPanel.dataRepo.refreshServerInfo(function(items){
			panelAbout._panel.unblock();
			if(items)
			{
				panelAbout.bindData();
			}
		});
	}
}

panelAbout.refreshInfoFromServer = function()
{
	crushFTP.UI.showIndicator(false, false, "Please wait..");
	adminPanel.dataRepo.refreshServerInfo(function(items){
		panelAbout.bindData();
		$("#SessionSeconds").sessionChecker({
			refreshServerInfo : true,
			callBack:function(){
				if (($(document).data("app_version")+"").indexOf("6") >= 0) //show new features
				{
					if ($(document).data("app_enterprise")) //show new features
					{
						$(".enterpriseFeature").show();
					}
				}
				crushFTP.UI.hideIndicator();
			}
		});
	});
}

panelAbout.bindEvents = function()
{
	$("#updateProgressPanel").dialog({
		autoOpen: false,
		minHeight: 150,
		width: 400,
		modal: true,
		resizable: false,
		title : "Update in progress : ",
		closeOnEscape: false,
		open : function(event, ui){
			$("#cancelUpdate").blur();
			$("#updateProgressPanel").closest(".ui-dialog").find(".ui-dialog-titlebar-close").remove();
		}
	});

	panelAbout.serverRestartingDialog = $("#serverRestartingDialog").dialog({
		autoOpen: false,
		height: 220,
		width: 440,
		modal: true,
		resizable: false,
		title : "Server restarting : ",
		closeOnEscape: false,
		open : function(event, ui){
			panelAbout.serverRestartingDialog.closest(".ui-dialog").find(".ui-dialog-titlebar-close").remove();
			if($(".windowsOnly", panelAbout.serverRestartingDialog).length==0)
			{
				panelAbout.serverRestartingDialog.dialog({
					height:120
				});
			}
		}
	});

	$("#registrationDialog").dialog({
		autoOpen: false,
		height: 340,
		width: 550,
		modal: true,
		resizable: false,
		title : "CrushFTP Registration : ",
		closeOnEscape: false,
		open: function(){
			$("#registrationDialog_registration_name").focus().select();
		}
	});

	$("#registerCrushFTP", panelAbout._panel).unbind().click(function(){
		$("#registrationDialog").dialog("open");
		return false;
	});

	$("#registerCrushFTPAction").unbind().click(function(){
		var registrationDialog = $("#registrationDialog");
		var name = $("#registrationDialog_registration_name", registrationDialog).val();
		var email = $("#registrationDialog_registration_email", registrationDialog).val();
		var code = $("#registrationDialog_registration_code", registrationDialog).val();
		if(name.length == 0 || email.length == 0 || code.length == 0)
		{
			jAlert("All fields are required", "Error", function(){
				if(name.length == 0)
				{
					$("#registrationDialog_registration_name", registrationDialog).focus().select();
				}
				else if(email.length == 0)
				{
					$("#registrationDialog_registration_email", registrationDialog).focus().select();
				}
				else
				{
					$("#registrationDialog_registration_code", registrationDialog).focus().select();
				}
			});
		}
		else if(!crushFTP.methods.isValidEmail(email))
		{
			jAlert("Please enter vaild email address", "Error", function(){
				$("#registrationDialog_registration_email", registrationDialog).focus().select();
			});
		}
		else
		{
			crushFTP.data.serverRequest({
				command: "registerCrushFTP",
				registration_name : encodeURIComponent(name),
				registration_email : encodeURIComponent(email),
				registration_code : encodeURIComponent(code)
			},
			function(data){
				var items = false;
				if(data)
				{
					if($(data).length > 0)
					{
						data = $(data).text();
						jAlert(data, "Message", function(){
							if(data == "Registration Information Accepted")
							{
								$("#registrationDialog").dialog("close");
								$("#registrationDialog").clearForm();
								panelAbout.refreshInfoFromServer();
							}
							else
							{
								$("#registrationDialog_registration_name", registrationDialog).focus().select();
							}
						});
					}
				}
			}, false, "POST");
		}
		return false;
	});

	$("#cancelRegistration").unbind().click(function(){
		$("#registrationDialog").dialog("close");
		return false;
	});

	$("#updateDialog").dialog({
		autoOpen: false,
		minWidth: 800,
		minHeight: 700,
		modal: true,
		resizable: false,
		title : "CrushFTP Update :",
		closeOnEscape: false
	});

	$("#checkForUpdateCrushFTPAction", panelAbout._panel).unbind().click(function(){
		var btn = $(this);
		if(btn.hasClass('ui-state-disabled'))
			return;
		btn.addClass('ui-state-disabled');
		crushFTP.data.serverRequest({
			command: "checkForUpdate"
		},
		function(data){
			btn.removeClass('ui-state-disabled');
			var items = $.xml2json(data);
			if(items && items.response)
			{
				if(items.response == "true")
				{
					adminPanel.updateNotificationShown = false;
					panelAbout.refreshInfoFromServer();
				}
				else
				{
					crushFTP.UI.growl("No updates available", "", false, 5000);
				}
			}
		}, false, "POST");

		return false;
	});

	$("#showNewVersionDetails", panelAbout._panel).unbind().click(function(){
		var updateDialog = $("#updateDialog");
		$("#new_version_no", updateDialog).text($("#update_available_version").text());
		$("#new_version_html", updateDialog).html(DOMPurify.sanitize($("#update_available_html").val()));
		updateDialog.dialog("open");
		return false;
	});

	$("#updateCrushFTP").contextMenu({
        topPadding: -10,
        leftPadding: -10,
        menu: 'updateButtonMenu',
        openOnClick : true,
    }, function(action, el, pos, command) {
        if (command == "updatenow") {
        	if(!panelAbout.updateRunning)
			{
				var btn = $(this);
				if(btn.hasClass('ui-state-disabled'))return;
				window.isOnlyWIUpdate = false;
				panelAbout.makingListUpdate = 0;
				btn.addClass('ui-state-disabled');
				crushFTP.data.serverRequest({
					command: "updateNow"
				},
				function(data){
					btn.removeClass('ui-state-disabled');
					panelAbout.checkUpdateProgress(true);
				}, false, "POST");
				$("#updateDialog").dialog("close");
			}
			return false;
        }
        else if (command == "updateIdle") {
        	if(!panelAbout.updateRunning)
			{
				var btn = $(this);
				if(btn.hasClass('ui-state-disabled'))return;
				window.isOnlyWIUpdate = false;
				panelAbout.makingListUpdate = 0;

				btn.addClass('ui-state-disabled');
				crushFTP.data.serverRequest({
					command: "updateIdle"
				},
				function(data){
					btn.removeClass('ui-state-disabled');
					panelAbout.checkUpdateProgress(true);
				}, false, "POST");
				$("#updateDialog").dialog("close");

			}
			return false;
        }
        else if(command == "updatewi"){
        	var btn = $(this);
        	btn.addClass('ui-state-disabled');
			crushFTP.data.serverRequest({
				command: "updateWebNow"
			},
			function(data){
				btn.removeClass('ui-state-disabled');
				window.isOnlyWIUpdate = true;
				panelAbout.checkUpdateProgress(true);
			}, false, "POST");
			$("#updateDialog").dialog("close");
        }
        return false;
    }).click(function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        return false;
    });

	$(".updateCrushFTP").unbind().click(function(e){
		if(!panelAbout.updateRunning)
		{
			var btn = $(this);
			if(btn.hasClass('ui-state-disabled'))return;
			window.isOnlyWIUpdate = false;
			panelAbout.makingListUpdate = 0;
			if((e.ctrKey || e.altKey))
			{
				jConfirm("Are you sure you wish to update only WebInterface?", "Confirm", function(flag){
					if(flag)
					{
						btn.addClass('ui-state-disabled');
						crushFTP.data.serverRequest({
							command: "updateWebNow"
						},
						function(data){
							btn.removeClass('ui-state-disabled');
							window.isOnlyWIUpdate = true;
							panelAbout.checkUpdateProgress(true);
						}, false, "POST");
						$("#updateDialog").dialog("close");
					}
				});
			}
			else
			{
				btn.addClass('ui-state-disabled');
				crushFTP.data.serverRequest({
					command: "updateNow"
				},
				function(data){
					btn.removeClass('ui-state-disabled');
					panelAbout.checkUpdateProgress(true);
				}, false, "POST");
				$("#updateDialog").dialog("close");
			}
		}
		return false;
	});

	$("#cancelUpdate").unbind().click(function(){
		if(panelAbout.updateRunning)
		{
			jConfirm("Are you sure you wish to cancel update process?", "Confirm", function(flag)
			{
				if(flag)
				{
					crushFTP.data.serverRequest({
						command: "cancelUpdateProgress"
					},
					function(data){
						crushFTP.UI.growl("Update canceled", "Updated was canceled, you can update to latest version from 'About' tab.", false, 5000);
						panelAbout.showHideUpdateProgress();
					}, false, "POST");
					panelAbout.updateRunning = false;
				}
			});
		}
		return false;
	});

	$("#closeUpdateWindow").unbind().click(function(){
		$("#updateDialog").dialog("close");
		return false;
	});

	$("#debugThreadList").unbind().click(function(event){
		if(event.ctrlKey || event.metaKey || event.altKey)
		{
			window.open(crushFTP.ajaxCallURL + "?command=dumpHeap&c2f="+crushFTP.getCrushAuth());
		}
		else
			window.open(crushFTP.ajaxCallURL + "?command=dumpStack&c2f="+crushFTP.getCrushAuth());

		return false;
	});

	$("#clearCache").unbind().click(function(event){
		crushFTP.UI.showLoadingIndicator({});
		crushFTP.data.serverRequest({
			command: "clearCache"
		},
		function(data){
			crushFTP.UI.growl("Clearing cache...", crushFTP.methods.htmlEncode($(data).find("response").text()));
			crushFTP.UI.hideLoadingIndicator({})
		}, false, "POST");
		return false;
	});

	$("#validateAppMD5s").unbind().click(function(event){
		window.open(crushFTP.ajaxCallURL + "?command=validateAppMD5s&c2f="+crushFTP.getCrushAuth());
		return false;
	});
	$(".infoTip", panelAbout._panel).tooltip();
};

panelAbout.checkUpdateProgress = function(init)
{
    if(init)
    {
        try{
        	delete window.currentProgressBytes;
    	}catch(ex){};
        panelAbout.pollingTries = 0;
        panelAbout.updateRunning = true;
        panelAbout.lastUpdateLocation = 0;
        panelAbout.showHideUpdateProgress();
        $("#updateProgressbar").removeData("history");
        panelAbout.updateProgressCallRunning = false;
    }
	if(panelAbout.updateProgressCallRunning) return false;
	panelAbout.updateProgressCallRunning = true;
	try{$("#growlUpdateShowInfo").closest("div.ui-notify").find("a.ui-notify-close").trigger("click");}catch(ex){}
	crushFTP.data.serverRequest({
		command: "updateNowProgress"
	},
	function(data){
		panelAbout.updateProgressCallRunning = false;
		var items = $.xml2json(data);
		var updateProgress = false;
		if(items && items.response)
		{
			var currentLoc = parseInt(items.response.currentLoc);
			var maximumLoc = parseInt(items.response.maximumLoc);
			var currentStatus = items.response.currentStatus || "";
			if(currentLoc>0)
				window.currentProgressBytes = currentLoc;
			var skipPolling = false;
			if(window.isOnlyWIUpdate)
			{
				if(window.currentProgressBytes && window.currentProgressBytes > currentLoc)
				{
					skipPolling = true;
					updateProgress = false;
				}
			}
			if((currentLoc<maximumLoc && !skipPolling) && currentStatus.toLowerCase().indexOf("complete")<0)
			{
				panelAbout.lastUpdateLocation = currentLoc;
				panelAbout.updateProgressbar(currentLoc, maximumLoc, currentStatus);
				var time = window.isOnlyWIUpdate ? 500 : 1000;
				setTimeout(function(){
					if(panelAbout.updateRunning)
						panelAbout.checkUpdateProgress();
				}, time);
				updateProgress = true;
			}
		}
		if(!updateProgress)
		{
			panelAbout.updateRunning = false;
			panelAbout.showHideUpdateProgress();
			crushFTP.UI.growl("Update completed", "Successfully updated to latest version, please wait while server restarts.", false, 5000);
			try{$("#growlUpdateShowInfo").closest("div.ui-notify").find("a.ui-notify-close").trigger("click");}catch(ex){}
			setTimeout(function(){
				if(window.isOnlyWIUpdate)
					window.location = window.location;
			}, 1500);
			panelAbout.last_restart_time = $("#server_start_time").text();
			panelAbout.pollServerInfo(1000);
		}
	}, false, "POST");
}

panelAbout.pollServerInfo = function(interval)
{
	if(!panelAbout.serverRestartingDialog.dialog("isOpen"))
	{
		if($(".windowsOnly", panelAbout.serverRestartingDialog).length==0)
		{
			panelAbout.serverRestartingDialog.dialog({
				height:90
			});
		}
		panelAbout.serverRestartingDialog.dialog("open");
		panelAbout.pollingTries = 0;
	}
	interval = interval || 100;
	setTimeout(function(){
		adminPanel.dataRepo.refreshServerInfo(function(items){
			if(items && panelAbout.last_restart_time != $("#server_start_time").text())
			{
				panelAbout.serverRestartingDialog.dialog("close");
				panelAbout.bindData();
				crushFTP.UI.growl("Server started", "Server is up and running, current version is : " + crushFTP.methods.htmlEncode($("#server_current_version").text()), false, 5000);
				try{$("#growlUpdateShowInfo").closest("div.ui-notify").find("a.ui-notify-close").trigger("click");}catch(ex){}
			}
			else
			{
				panelAbout.pollingTries += 1;
				if(panelAbout.pollingTries > 60)
				{
					crushFTP.UI.growl("Refreshing page", "Too many tries to contacting server, refreshing page", true, 5000);
					try{$("#growlUpdateShowInfo").closest("div.ui-notify").find("a.ui-notify-close").trigger("click");}catch(ex){}
					setTimeout(function(){
						window.location = window.location;
					}, 5000);
				}
				else
				{
					setTimeout(function(){
						panelAbout.pollServerInfo();
					}, 1000);
				}
			}
		});
	}
	, interval);
};

panelAbout.updateProgressbar = function(cur, max, currentStatus)
{
	var perc = 0;
	var updateProgressbar = $("#updateProgressbar");
	if(max>0)
	{
		perc = Math.round((cur * 100)/max);
	}
	var updateProgressText = currentStatus || "Getting file size information...";
	if(updateProgressText == "Building list of files...CrushFTP7_PC"){
		var limitTimeout = window.isOnlyWIUpdate ? 60 : 30;
		panelAbout.makingListUpdate++;
		if(panelAbout.makingListUpdate == limitTimeout){
			crushFTP.UI.growl("Error Updating", "Seems like a firewall may be blocking access to https://www.crushftp.com", true);
		}
	}
	if(cur > 0)
	{
		var downloaded = crushFTP.methods.formatBytes(cur);
		var toDownload = crushFTP.methods.formatBytes(max);

		var now = new Date().getTime();
		if (!$(updateProgressbar).data("history")) $(updateProgressbar).data("history", new Array());
		var history = $(updateProgressbar).data("history");
		history.push({
			now: now,
			bytes: cur
		});
		var pivot = 0;
		if (history.length > 5) {
			pivot = history.length - 5;
		}
		var elapsed = now - history[0].now;
		var bytes = cur - history[pivot].bytes;
		var lastElapsed = now - history[pivot].now;
		var originalBytes = cur - history[0].bytes;
		var secs = ((((max - cur) / (originalBytes / elapsed)) / 1000) + 1) + "";
		var remaining = crushFTP.methods.formatTime(secs);
		var elapsedFormatted = crushFTP.methods.formatTime((elapsed / 1000) + 1 + "");
		var avgSpeed = crushFTP.methods.formatBytes((originalBytes / elapsed) * 1024.0);
		avgSpeed = avgSpeed ? avgSpeed + "/s" : "Calculating..";
		elapsedFormatted = elapsedFormatted ||  "Calculating..";
		remaining = remaining ||  "Calculating..";
		updateProgressText = "<div>Current Status : <span class='ui-priority-primary'>" + currentStatus + "</span></div><div>Avg. Download Speed : <span class='ui-priority-primary'>" + avgSpeed + "</span></div><div>Downloaded <span class='ui-priority-primary'>" + downloaded + "</span> of Total <span class='ui-priority-primary'>" + toDownload + "</span>" + "</div><div>Time Elapsed : <span class='ui-priority-primary'>" + elapsedFormatted + "</span></div><div>Time Remaining : <span class='ui-priority-primary'>" + remaining + "</span></div>";
	}
	$("#updateProgressText").html(DOMPurify.sanitize(updateProgressText));
	updateProgressbar.progressbar({
		value: perc
	});
	$("#ui-dialog-title-updateProgressPanel").text("Update in progress : " + perc + "%");
}

panelAbout.tabShown = function()
{
	panelAbout.showHideUpdateProgress();
}

panelAbout.showHideUpdateProgress = function(flag)
{
	flag = flag || panelAbout.updateRunning;
	if(flag)
	{
		$("#updateProgressPanel").dialog("open");
	}
	else
	{
		$("#updateProgressPanel").dialog("close");
	}
};