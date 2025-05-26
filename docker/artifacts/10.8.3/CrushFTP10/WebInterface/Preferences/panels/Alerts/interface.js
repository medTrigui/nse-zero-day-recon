/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelAlerts = {};
panelAlerts.localization = {};
/****************************/

// Panel details
var panelName = "Alerts";
var _panel = $("#pnl" + panelName);

// Localizations
panelAlerts.localization = {
	headerText : ""
	, pnlDescText : "Alerts allow for automatic notifications when specific server events occur."
	, btnAddText : "Add"
	, btnCopyText : "Copy"
	, btnRemoveText : "Remove"
	, lblAlertTypeText : "Alert Type: "
	, lblSecondsIntervalText : "Seconds interval: "
	, lblLoginCountText : "Login count: "
	, lblPercentageOfQuotaTobeReachedText : "Percentage of quota to be reached for this alert: "
	, lblDriveText : "Drive: "
	, lblThresholdInMBText : "Threshold in MB: "
	, lblEmailText : "Email"
	, lblEmailMaxOfText : "Max of: "
	, lblEmailDurationText : "emails per hour"
	, lblEmailFromText : "From: "
	, lblEmailToText : "To: "
	, lblEmailCCText : "CC: "
	, lblEmailBCCText : "BCC: "
	, lblEmailSubjectText : "Subject: "
	, lblEmailBodyText : "Body: "
	, btnResetText : "Reset To Default"
	, btnCancelText : "Cancel"
	, btnOKText : "Save"
};

/*
Not available:

User Changed Password
User Download Speed Below Minimum
User Exceeded Download Transfer Amount Per Day
User Exceeded Download Transfer Amount Per Month
User Exceeded Download Transfer Amount Per Session
User Exceeded Upload Transfer Amount Per Day
User Exceeded Upload Transfer Amount Per Month
User Exceeded Upload Transfer Amount Per Session
User Upload Speed Below Minimum
User Updated TwoFactor Secret
Variable Watcher
*/

panelAlerts.defaultVals = {
	"User Hammering" : "<LINE>\r\nID:%user_id%\r\nConnectionGroup:%user_listen_ip_port%\r\nServerIP:%user_listen_ip%\r\nServerPort:%user_port%\r\nUserIP:%user_ip%\r\nProtocol:%user_protocol%\r\nUsername:%user_name%\r\n</LINE>",
	"Update Object" : "Update on : {update_object_path}\r\nUpdate info : {update_object_log}",
	"Repeated Login Failure": "{user_name} has had count={count} login failures.\r\nmax attempts before permanent ban={attempts}",
	"Repeated Login Failure User Banned": "{user_name} has had count={count} login failures.\r\nmax attempts={attempts}\r\nban will timeout in minutes={timeout}\r\nusername ban expires={expire}",
	"Skipped scheduled job": "Skipped scheduled job: {scheduleName}",
    "Disk Space Below Threshold": "Your disk is low on space.\r\nFree space: {free_bytes}",
    "CrushFTP Update Available": "A new version of CrushFTP can be installed on {hostname} server.\r\n{alert_msg}",
    "CrushFTP Started": "CrushFTP Server was just started or restarted: {hostname}",
    "User reached quota percentage": "{username} reached quota percentage {quota_perc}%.",
    "IP Banned for Failed Logins": "IP was banned for failing to login too many times: {msg}",
    "Server Port Failed": "A server port ({server_port}) unexpectedly failed on server {hostname}.\r\nIt may have auto restarted.\r\nError:{server_port_error}\r\nInfo:{message}",
    "Invalid Email Attempted": "An invalid email was attempted and failed:{result}\r\nSubject:{subject}\r\nFrom:{from}\r\nTo:{to}\r\nCC:{cc}\r\nBCC:{bcc}\r\nBody:{body}",
    "Plugin Message": "A plugin generated a message:{message}",
    "Security Alert": "Security alert:{alert_type}, {alert_sub_type}\r\nMax:{alert_max}\r\nTimeout:{alert_timeout}\r\nMessage:{alert_msg}",
    "ServerBeat Alert": "ServerBeat alert:{alert_type}, {alert_sub_type}\r\nMax:{alert_max}\r\nTimeout:{alert_timeout}\r\nMessage:{alert_msg}",
    "Low Memory": "Server {hostname} is low on memory!\r\nMax Memory: {alert_ram_max}\r\nFree Memory:{alert_ram_free}\r\nThreads:{alert_memory_threads}\r\nThread dump follows:",
    "Low Memory1": "Server {hostname} is low on memory!\r\nMax Memory: {alert_ram_max}\r\nFree Memory:{alert_ram_free}\r\nThreads:{alert_memory_threads}\r\nThread dump follows:",
    "Low Memory2": "Server {hostname} is low on memory!\r\nMax Memory: {alert_ram_max}\r\nFree Memory:{alert_ram_free}\r\nThreads:{alert_memory_threads}\r\nThread dump follows:",
    "Low Memory3": "Server {hostname} is low on memory!\r\nMax Memory: {alert_ram_max}\r\nFree Memory:{alert_ram_free}\r\nThreads:{alert_memory_threads}\r\nThread dump follows:",
    "Big Directory": "A user has encountered a very large directory listing which may lead to server stability issues.\r\nTrigger max:{alert_max_items}\r\nItems listed:{alert_dir_size}\r\nDirectory:{alert_dir}\r\nInfo:{alert_msg}",
    "Slow Login": "A user has experienced a slow login which may be an indication of LDAP or other issues slowing down login processes.\r\nInfo:{alert_msg}",
    "Login Frequency": "User {username} is logging in too frequently.\r\nThey logged in {alert_msg} times in the past {alert_login_interval} seconds.",
    "Login Frequency Banned": "A user ({username}) has been banned for login frequency.\r\nUser {user_name} has been banned for too frequent of logins.\r\nThey had {count} logins (max of {attempts}) in {interval} seconds.\r\nThey are banned until {expire}.",
    "Job Changes": "A job has been changed:{alert_schedule_name}\r\nChanges:{alert_schedule_changes}\r\nAudit:{alert_schedule_audit_trail}",
    "VFS Bad Credentials": "A VFS item has something mis-configured on user {username}\r\nProtocol:{protocol}\r\nPort:{port}\r\nURL: {url}\r\nPath: {url_path}\r\nInfo: {error_message}",
    "Default": "Username (if any): %user_name%\r\nUser IP: %user_ip%\r\nMessage (if any): %msg%"
}

// Assign localizations
localizations.panels[panelName] = $.extend(panelAlerts.localization, localizations.panels[panelName]);

// Interface methods
panelAlerts.init = function(){
	applyLocalizations(panelName, localizations.panels);
	crushFTP.methods.setPageTitle(panelAlerts.localization.Header, true);
	panelAlerts.bindData();
	panelAlerts.bindEvents();
    setupPrefsReplicationSave(_panel, panelName);
}

panelAlerts.validateData = function(){
	var formAlertsList = $("#alerts", _panel).find("li");
	var validated = true;
	if(formAlertsList.length>0)
	{
		formAlertsList.each(function(){
			var elm = $(this);
			var controlData = elm.data("controlData");
			var type = controlData.type[0].text;
			if(type === "User reached quota percentage" && validated){
				var quota_perc = controlData.quota_perc ? controlData.quota_perc[0].text : "";
				if(!quota_perc || !crushFTP.methods.isNumeric(quota_perc)){
					jAlert("User quota percentage value is invalid, it must be numeric value", "Error", function(){
						var selected = $(elm);
						selected.parent().find(".ui-widget-header").removeClass("ui-widget-header");
						selected.parent().find(".ui-selected").removeClass("ui-selected");
						selected.addClass("ui-widget-header ui-selected");
						panelAlerts.bindFormDetails(selected);
						setTimeout(function(){
							$("#quota_perc").focus().addClass('input-error');
							setTimeout(function(){
								$("#quota_perc").removeClass('input-error');
							}, 1000);
						}, 100);
					}, {
  						classForPopupPanel : 'warning'
  					});
  					validated = false;
				}
			}
		});
	}
	return validated;
}

panelAlerts.bindData = function()
{
	panelAlerts.bindActions();
	var prefs = common.data.ServerPrefs();
	bindValuesFromXML(_panel, prefs);
	if(prefs && prefs["alerts"])
	{
		var alerts = prefs["alerts"];
		if(alerts.length>0)
		{
			alerts = alerts[0] ? alerts[0]["alerts_subitem"] : false;
			if(alerts)
			{
				var alertsList = $("#alerts", _panel);
				var selected = alertsList.find("li.ui-widget-header").index();
				alertsList.empty();
				for(var i=0;i<alerts.length;i++)
				{
					var curItem = alerts[i];
					var type = crushFTP.data.getTextValueFromXMLNode(curItem.type, "");
					if(curItem && curItem.type && type != "Dummy")
					{
						var typeText = type == "User Hammering" ? "Too Many Active Logins" : type;
						var newControl = $("<li class='ui-widget-content' alertType='"+crushFTP.methods.htmlEncode(type)+"'>"+crushFTP.methods.htmlEncode(typeText)+"</li>");
						alertsList.append(newControl);
						newControl.data("controlData", curItem);
					}
				}
				if(selected>=0)
				{
					selected += 1;
					panelAlerts.bindFormDetails(alertsList.find("li:nth-child("+selected+")").addClass("ui-widget-header ui-selected"));
				}
			}
		}
	}
}

panelAlerts.bindActions = function()
{
	var alert_plugin = $("#alert_plugin", _panel).empty();
	alert_plugin.append("<option value=\"\">-</option>");
	var crushTaskPlugins = common.data.getPluginPrefs("CrushTask");
	var pluginOpts = $('<optgroup label="Plugin"></optgroup>');
	for(var index=0; index<crushTaskPlugins.length;index++)
	{
		var curPlugin = crushTaskPlugins[index];
		if(curPlugin && curPlugin.subItem && curPlugin.subItem.length>0)
		{
			var tabName = curPlugin.subItem[0].text ? "CrushTask:" + curPlugin.subItem[0].text : "CrushTask";
			pluginOpts.append("<option value=\""+crushFTP.methods.textEncode(unescape(tabName))+"\">"+crushFTP.methods.textEncode(unescape(tabName))+"</option>");
		}
	}
	alert_plugin.append(pluginOpts);
	var availableJobs = $(document).data("AvailableJobsNoEvents");
	if(availableJobs && availableJobs.length>0)
	{
		var jobOpts = $('<optgroup label="Job"></optgroup>');
		for (var i = 0; i < availableJobs.length; i++) {
			jobOpts.append("<option value=\"Job:"+crushFTP.methods.textEncode(unescape(availableJobs[i]))+"\">"+crushFTP.methods.textEncode(unescape(availableJobs[i]))+"</option>");
		}
		alert_plugin.append(jobOpts);
	}
};

panelAlerts.bindEvents = function()
{
	var alerts = $("#alerts", _panel);
	alerts.selectable({
		selected: function(event, ui) {
			var selected = $(ui.selected);
			selected.parent().find(".ui-widget-header").removeClass("ui-widget-header");
			selected.addClass("ui-widget-header");
			panelAlerts.bindFormDetails(selected);
			return false;
		}
	});

	_panel.find("select#type").change(function(){
		var type = $(this).val();
		var typeText = type == "User Hammering" ? "Too Many Active Logins" : type;
		$("#body", _panel).val(panelAlerts.defaultVals[type] || panelAlerts.defaultVals["Default"]).change();
		$("#subject", _panel).val(typeText).change();
		panelAlerts.showFieldsBasedOnType(type);
	});

	$("a#addAlert", _panel).click(function(){
		crushFTP.UI.addItem($("#alerts", _panel)
		, $("<li class='ui-widget-content'>No Action</li>")
		, {
			alert_plugin:[{text:""}],
			cc:[{text:""}],
			quota_perc:[{text:""}],
			login_count:[{text:"10"}],
			max_alert_emails:[{text:"60"}],
			body:[{text:"Username (if any): %user_name%\nUser IP: %user_ip%\nMessage (if any): %msg%"}],
			bcc:[{text:""}],
			type:[{text:"No Action"}],
			subject:[{text:""}],
			from:[{text:""}],
			to:[{text:""}],
			threshold_mb:[{text:""}],
			drive:[{text:""}],
			login_interval:[{text:"60"}],
			failure_count:[{text:"10"}],
			path_filter:[{text:"*"}],
			log_filter:[{text:"*"}]
		}
		, panelAlerts.bindFormDetails);
		itemsChanged(true);
		return false;
	});

	$("a#copyAlert", _panel).click(function(){
		crushFTP.UI.copyItem($("#alerts", _panel).find("li.ui-selected"), panelAlerts.bindFormDetails);
		itemsChanged(true);
		return false;
	});

	$("a#removeAlert", _panel).click(function(){
		crushFTP.UI.removeItem($("#alerts", _panel), panelAlerts.bindFormDetails);
		itemsChanged(true);
		return false;
	});

	var formDetailsPanel  = $("#formDetailsPanel", _panel);
	formDetailsPanel.find("input, select, textarea").bind("change", function(){
		var item = alerts.find("li.ui-selected");
		if(!item || item.length==0)return;
		var data = item.data("controlData");
		if(data)
		{
			var isBool = $(this).attr("type") == "radio" || $(this).attr("type") == "checkbox";
			data[$(this).attr("id")] = [{text: isBool ? $(this).is(":checked").toString() : $(this).val()}];
			if($(this).attr("id") == "type")
			{
				var typeText = $(this).val() == "User Hammering" ? "Too Many Active Logins" : $(this).val();
				item.text(typeText);
			}
		}
		item.data("controlData", data);
		itemsChanged(true);
	});

	formDetailsPanel.find("input[type='text'], textarea").bind("textchange", function(){
		var item = alerts.find("li.ui-selected");
		if(!item || item.length==0)return;
		var data = item.data("controlData");
		if(data)
		{
			var isBool = $(this).attr("type") == "radio" || $(this).attr("type") == "checkbox";
			data[$(this).attr("id")] = [{text: isBool ? $(this).is(":checked").toString() : $(this).val()}];
			if($(this).attr("id") == "type")
			{
				var typeText = $(this).val() == "User Hammering" ? "Too Many Active Logins" : $(this).val();
				item.text(typeText);
			}
		}
		item.data("controlData", data);
		itemsChanged(true);
	});

	$("#testEmail", _panel).click(function(){
		var prefs = common.data.ServerPrefs();
		function getPrefsVal(key,dval)
		{
			if(prefs && prefs[key] && prefs[key].length>0 && prefs[key][0].text)
				return prefs[key][0].text;
			else
				dval;
		}
		var that = $(this);
		var obj = {
			command : "testSMTP",
			to : $("#to", _panel).val(),
			cc : $("#cc", _panel).val(),
			bcc : $("#bcc", _panel).val(),
			from : $("#from", _panel).val(),
			subject : $("#subject", _panel).val(),
			body : $("#body", _panel).val(),
			server : getPrefsVal("smtp_server", ""),
			user : getPrefsVal("smtp_user", ""),
			pass : crushFTP.methods.htmlEncode(getPrefsVal("smtp_pass", "")),
			ssl : getPrefsVal("smtp_ssl", "false"),
			html : getPrefsVal("smtp_html", "false")
		};
		that.block({
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
			that.unblock().removeAttr("disabled");
			crushFTP.UI.growl("Sending test email : ", DOMPurify.sanitize(decodeURIComponent($(msg).text())), false, false);
		});
		return false;
	})
}

panelAlerts.bindFormDetails = function(alertList)
{
	if(!alertList)
	{
		$("#formDetailsPanel", _panel).hide();
		return;
	}
	var controlData = $(alertList).data("controlData");
	if(!controlData){
		$("#formDetailsPanel", _panel).hide();
		return;
	}
	var formDetailsPanel = $("#formDetailsPanel", _panel).show();
	var type = crushFTP.data.getTextValueFromXMLNode(controlData.type, "");
	panelAlerts.showFieldsBasedOnType(type);
	var inputs = formDetailsPanel.find("input.ignoreBind,select.ignoreBind,textarea.ignoreBind").removeClass("ignoreBind");
	bindValuesFromXML(formDetailsPanel, controlData);
	inputs.addClass("ignoreBind");
}

panelAlerts.showFieldsBasedOnType = function(type)
{
	type = type || _panel.find("select#type").val();
	$(".hammeringSpecific,.quotaReachedSpecific,.diskSpaceBelowThresholdSpecific, .variableWatcherSpecific, .securityAlertSpecific, .lowMemoryAlertSpecific, .updateObjectSpecific, .repeatLoginFailureSpecific", _panel).hide();
	if(type == "User Hammering" || type == "Login Frequency")
	{
		$(".hammeringSpecific", _panel).show();
	}
	else if(type == "User reached quota percentage")
	{
		$(".quotaReachedSpecific", _panel).show();
	}
	else if(type == "Disk Space Below Threshold")
	{
		$(".diskSpaceBelowThresholdSpecific", _panel).show();
	}
	else if(type == "Variable Watcher")
	{
		$(".variableWatcherSpecific", _panel).show();
	}
	else if(type == "Security Alert")
	{
		$(".securityAlertSpecific", _panel).show();
	}
	else if(type == "ServerBeat Alert")
	{
		$(".securityAlertSpecific", _panel).show();
	}
	else if(type.indexOf("Low Memory")==0)
	{
		$(".lowMemoryAlertSpecific", _panel).show();
	}
	else if(type == "Update Object")
	{
		$(".updateObjectSpecific", _panel).show();
	}
	else if(type == "Repeated Login Failure")
	{
		$(".repeatLoginFailureSpecific", _panel).show();
	}
}

panelAlerts.saveContent = function()
{
	if(panelAlerts.validateData())
	{
		if(placeHolder.data("hasChanged"))
		{
			crushFTP.UI.showIndicator(false, false, "Please wait..");
			var xmlString = [];
			var formAlertsList = $("#alerts", _panel).find("li");
			if(formAlertsList.length>0)
			{
				xmlString.push("<alerts type=\"vector\">");
				formAlertsList.each(function(){
					xmlString.push("<alerts_subitem type=\"properties\">");
					var controlData = $(this).data("controlData");
					for(var item in controlData)
					{
						if(controlData[item].length)
						{
							if(controlData[item][0].text)
							{
								xmlString.push("<"+item+">"+crushFTP.methods.htmlEncode(controlData[item][0].text)+"</"+item+">");
							}
							else{
								xmlString.push("<"+item+"></"+item+">");
							}
						}
					}
					xmlString.push("</alerts_subitem>");
				});
				xmlString.push("</alerts>");
			}
			else
			{
				xmlString.push("<alerts type=\"vector\"><alerts_subitem type=\"properties\"><type>Dummy</type></alerts_subitem></alerts>");
			}
			var formSubItem = xmlString.join("\n");
			var action = xmlString.length>0 ? "reset" : "remove";
			crushFTP.data.setXMLPrefs("server_settings/alerts/0"
				, "vector"
				, action
				, formSubItem
				, function(data){
					data = $.xml2json(data, true);
					if(data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK")
					{
						common.data.updateLocalPrefs(function(){
							crushFTP.UI.hideIndicator();
							crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
							panelAlerts.bindData();
							placeHolder.removeData("hasChanged");
						});
					}
					else
					{
						crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
					}
				}
				, panelAlerts.saveParams
			);
		}
		else
		{
			crushFTP.UI.growl("No changes made", "", false, 3000);
		}
	}
}