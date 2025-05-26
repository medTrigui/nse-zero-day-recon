/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelJobsMonitor = {};
panelJobsMonitor.localization = {};
/****************************/

// Panel details
panelJobsMonitor.panelName = "JobsMonitor";
panelJobsMonitor._panel = $("#pnl" + panelJobsMonitor.panelName);

// Localizations
panelJobsMonitor.localization = {
};

// Assign localizations
localizations.panels[panelJobsMonitor.panelName] = $.extend(panelJobsMonitor.localization, localizations.panels[panelJobsMonitor.panelName]);

// Interface methods
panelJobsMonitor.init = function(){
	applyLocalizations(panelJobsMonitor.panelName, localizations.panels);
	panelJobsMonitor.bindEvents();
};

panelJobsMonitor.bindData = function()
{
	panelJobsMonitor.bindJobs();
};

panelJobsMonitor.bindJobs = function(statusFilter, noIndicator)
{
	var lstJobs = $("#lstJobs", panelJobsMonitor._panel);
	var lastJobListUpdatedTimestamp = $("#lastJobListUpdatedTimestamp", panelJobsMonitor._panel);
	var selectedId = lstJobs.find(".ui-widget-header").attr("taskId");
	if(!noIndicator)
		crushFTP.UI.showIndicator(false, false, "Please wait..");
	else
		crushFTP.UI.showIndicator(true, $("#jobsPanel"));
	crushFTP.data.serverRequest({
		command: "getJobsSummary"
	},
	function(data){
		if(!noIndicator)
			crushFTP.UI.hideIndicator();
		else
			crushFTP.UI.hideIndicator(true, $("#jobsPanel"));
		var items = false;
		if(data)
		{
			if(data.getElementsByTagName("response_data") && data.getElementsByTagName("response_data").length > 0)
			{
				data = data.getElementsByTagName("response_data")[0];
				items = $.xml2json(data);
			}
		}
		lstJobs.empty();
		if(items)
		{
			var curIndex = 0;
			adminPanel.UI.multiOptionControlDataBind(items
				, "running_tasks"
				, lstJobs
				, function(curItem){
					var status = curItem.status &&  curItem.status.length>0 ? curItem.status : false;
					if(status && status != "undefined")
					{
						if(statusFilter && status.toLowerCase() != statusFilter.toLowerCase() && statusFilter.toLowerCase() != "all")
						{
							return false;
						}
						else
						{
							var start = curItem.start &&  curItem.start.length>0? new Date(parseFloat(curItem.start)) : false;
							var end =  curItem.end &&  curItem.end.length>0? new Date(parseFloat(curItem.end)) : false;
							var diff = "";
							if(start && end)
							{
								var dateDiff = (end.diff(start));
								diff = " (" + dateDiff.hours + ":" + dateDiff.minutes + ":" + dateDiff.seconds + ") ";
							}
							var scheduleName = "";
							var pluginName = "";
							var subItemName = "";
							var curSettings = curItem.settings;
							if(curSettings)
							{
								if(curSettings.scheduleName && curSettings.scheduleName.length>0 && curSettings.scheduleName)
								{
									scheduleName = " : " + curSettings.scheduleName;
								}
								if(curSettings.pluginName && curSettings.pluginName.length>0 && curSettings.pluginName)
								{
									pluginName = " : " + curSettings.pluginName;
								}
								if(curSettings.subItem && curSettings.subItem.length>0 && curSettings.subItem)
								{
									subItemName = " : " + curSettings.subItem;
								}
							}
							curIndex += 1;
							var _start = start ? dateFormat(start, "dd/mm/yyyy hh:MM:ss TT") : "";
							var _end = end ? dateFormat(end, "dd/mm/yyyy hh:MM:ss TT") : "";
							return $("<li taskId='"+curItem.id+"' _index='"+curIndex+"' class='ui-widget-content'><span class='schedule' style='top:3px;'></span><span class='listText'>" + status.toUpperCase() + " : " + _start + " - " + _end + diff + crushFTP.methods.textEncode(scheduleName) + crushFTP.methods.textEncode(pluginName) + crushFTP.methods.textEncode(subItemName) +"</span></li>");
						}
					}
				}, false, false, true
			);
			var now = new Date();
			lastJobListUpdatedTimestamp.text(dateFormat(now, "mediumTime"));
			panelJobsMonitor.bindEvents(true);
			if(selectedId)
			{
				var loaded = lstJobs.find("li[taskId='"+selectedId+"']").addClass("ui-selected ui-widget-header");
				if(loaded && loaded.length>0)
				{
					loaded.trigger("click.bindData");
				}
			}
		}
		return;
	});
};

panelJobsMonitor.updateJobsStatus = function(index, status)
{
	index = parseInt(index) - 1;
	var obj = {
		command:"setServerItem",
		key: "server_info/running_tasks/"+index+"/status",
		data_type: "properties",
		data_action: "update",
		data: "<status>"+status+"</status>"
	};
	crushFTP.data.serverRequest(obj,
		function(data){
			data = $.xml2json(data, true);
			if(data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK")
			{
				crushFTP.UI.growl("Status updated", "Status for job "+ index + " updated to : " +status, false, 5000);
			}
			else
			{
				crushFTP.UI.growl("Error while updating status", "Status not updated. Job : " + index + ", Status : " + status + ", Error : " + $(data).text(), true);
			}
		}
	, false, "POST");
}

panelJobsMonitor.showLogForSelectedJob = function(elem)
{
	if(!elem || elem.length==0)return;
	var index = elem.attr("_index");
	var cData = elem.data("controlData");
	var log_file = false;
	if(cData)
		log_file = cData.log_file;
	if(log_file && log_file!="")
	{
		if(log_file == panelJobsMonitor.curShownLogFile)
			return;
		$("#logsSimple").hide();
		$("#jobsLogViewer").empty().html('<iframe id="jobsLoggingFrame" onload="" width="100%" height="560" src="log.html?embed=true&file='+log_file+'" style="margin:0px;padding:0px;"  marginWidth="0" marginHeight="0" frameBorder="0" scrolling="no"></iframe>').show();
		panelJobsMonitor.curShownLogFile = log_file;
	}
	else
	{
		panelJobsMonitor.curShownLogFile = false;
		$("#logsSimple").show();
		$("#jobsLogViewer").empty().hide();
		index = parseInt(index) - 1;
		crushFTP.data.serverRequest({
			command: "getServerItem",
			key : "server_info/running_tasks/" + index + "/msgs"
		},
		function(data){
			var controlData = false;
			var jobsLog = $("#jobsLog", panelJobsMonitor._panel).empty();
			if(data)
			{
				if(data.getElementsByTagName("result_value") && data.getElementsByTagName("result_value").length > 0)
				{
					var log = [];
					data = data.getElementsByTagName("result_value")[0];
					controlData = $.xml2json(data, true);
					if(controlData && controlData.result_value_subitem)
					{
						var msgs = controlData.result_value_subitem;
						for(var i=0;i<msgs.length;i++)
						{
							log.push(msgs[i].text);
						}
					}
					if(adminPanel.buggyBrowser)
						log = log.join("\r\n");
					else
						log = log.join("\n");
					jobsLog.text(log);
					var now = new Date();
					lastJobLogUpdatedTimestamp.text(dateFormat(now, "mediumTime"));
				}
			}
			return;
		});
	}
}

panelJobsMonitor.bindEvents = function(onlyListEvents)
{
	var lastJobLogUpdatedTimestamp = $("#lastJobLogUpdatedTimestamp", panelJobsMonitor._panel);

	$("#lstJobs", panelJobsMonitor._panel).unbind("onSelect").bind("onSelect", function(){
		panelJobsMonitor.showLogForSelectedJob($(this).find("li.ui-selected"));
		return;
	});

	var lstJobs = $("#lstJobs", panelJobsMonitor._panel).find("li").unbind("click.bindData").bind("click.bindData", function(){
		panelJobsMonitor.showLogForSelectedJob($(this));
		return;
	});

	if(!onlyListEvents)
	{
		$("#jobStatus", panelJobsMonitor._panel).change(function(){
			$("#jobsLog", panelJobsMonitor._panel).empty();
			panelJobsMonitor.bindJobs($(this).val());
		});

		$("a.reloadJob", panelJobsMonitor._panel).click(function(){
			$("#jobStatus", panelJobsMonitor._panel).trigger("change");
			return false;
		});

		$("a.pauseResumeJob, a.cancelJob", panelJobsMonitor._panel).click(function(){
			var selected = $("#lstJobs", panelJobsMonitor._panel).find("li.ui-widget-header");
			if(selected && selected.length>0)
			{
				var controlData = selected.data("controlData");
				var curStatus = controlData.status.toLowerCase();
				var status = "";
				if($(this).is(".pauseResumeJob"))
				{
					if(curStatus == "paused")
					{
						status = "running";
					}
					else if(curStatus == "running")
					{
						status = "paused";
					}
				}
				else
				{
					if(curStatus == "running")
					{
						status = "cancelled";
					}
				}
				if(status.length>0)
				{
					panelJobsMonitor.updateJobsStatus(selected.attr("_index"), status);
				}
				else
				{
					var msg = "";
					if($(this).is(".pauseResumeJob"))
					{
						msg = "Selected job can not be paused/resumed"
					}
					else
					{
						msg = "Selected job can not be canceled"
					}
					crushFTP.UI.growl("No Action", msg, true, 2000);
				}
			}
			return false;
		});
	}
};

panelJobsMonitor.dataPollingMethod = function()
{
	panelJobsMonitor.bindJobs($("#jobStatus", panelJobsMonitor._panel).val(), true);
};