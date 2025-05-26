/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelReportSchedule = {};
panelReportSchedule.localization = {};
/****************************/

// Panel details
panelReportSchedule.panelName = "ReportSchedule";
panelReportSchedule._panel = $("#pnl" + panelReportSchedule.panelName);

// Localizations
panelReportSchedule.localization = {
};

// Assign localizations
localizations.panels[panelReportSchedule.panelName] = $.extend(panelReportSchedule.localization, localizations.panels[panelReportSchedule.panelName]);

// Interface methods
panelReportSchedule.init = function(){
	applyLocalizations(panelReportSchedule.panelName, localizations.panels);
	panelReportSchedule.bindData();
	panelReportSchedule.bindEvents();
	panelReportSchedule.showScheduleInfo();
}

panelReportSchedule.defaultTemplateForSchedule = {
	scheduleName : "",
	to : "",
	reportTime : "8:00 AM",
	reportOverwrite : "false",
	subject : "",
	reportFilename : crushFTP.methods.encode("{name}_report_{MM}{dd}{yy}.html"),
	weekDays : "",
	monthlyAmount : 1,
	dailyAmount : 1,
	body : "",
	minutelyAmount : 1,
	weeklyAmount : 1,
	cc : "",
	monthDays : "",
	from : "",
	bcc : "",
	emailReport : "false",
	reportFolder : "",
	config : {},
	report_enabled: "true"
}

panelReportSchedule.bindData = function()
{
	$("#report-path-error").hide();
	var prefs = $(document).data("GUIXMLPrefs");
	var reportSchedules = prefs.reportSchedules;
	var scheduleList = $("#scheduleList", panelReportSchedule._panel);
	crushFTP.methods.rebuildSubItems(reportSchedules, "reportSchedules");
	adminPanel.UI.multiOptionControlDataBind(prefs
		, "reportSchedules"
		, scheduleList
		, function(curItem){
			var name = crushFTP.methods.textEncode(curItem.scheduleName);
			if(name && name != "undefined")
			return $("<li><span class='schedule'></span><span class='listText'>" + name + "</span></li>");
		}
	);

	$("li" , scheduleList).unbind().hover(function(){
		$(this).addClass("ui-state-focus");
	},function(){
		$(this).removeClass("ui-state-focus");
	}).click(function(){
		var selected = $(this);
		if(selected.hasClass("ui-state-active")) return false;
		var continueLoading = function()
		{
			$(".ui-state-active" , scheduleList).removeClass("ui-state-active");
			crushFTP.UI.checkUnchekInput(scheduleList.find("input"), false);
			crushFTP.UI.checkUnchekInput(selected.addClass("ui-state-active").find("input"), true);
			panelReportSchedule.showScheduleInfo();
		}
		if(panelReportSchedule.dataChanged)
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
	}).each(function(){
		$(this).prepend("<input type=\"checkbox\" class=\"scheduleSelection\" style=\"float:right;\" />").form(true);
	});

	var monthdays = $(".monthdays", panelReportSchedule._panel).empty();
	for(var i=1;i<=31;i++)
	{
		monthdays.append('<div class="ui-state-default" _day="'+i+'">'+i+'</div>');
	}
}

panelReportSchedule.hasPendingChanges = function(flag)
{
	flag = flag && panelReportSchedule.infoShown;
	panelReportSchedule.dataChanged = flag;
}

panelReportSchedule.showScheduleInfo = function()
{
	$("a.updateSchedule", panelReportSchedule._panel).hide();
	$("a.editSchedule", panelReportSchedule._panel).show();
	var scheduleInfo = $("#scheduleInfo", panelReportSchedule._panel);
	scheduleInfo.find("input:not(.ignoreChange), select:not(.ignoreChange), textarea:not(.ignoreChange)").unbind("change.listen");
	scheduleInfo.find("input[type='text']:not(.ignoreChange), textarea:not(.ignoreChange)").unbind("change.listen");

	window.onbeforeunload = panelReportSchedule.confirmExit;
	panelReportSchedule.hasPendingChanges(false);
	var selected = $("#scheduleList", panelReportSchedule._panel).find(".ui-state-active");
	if(selected && selected.length>0)
	{
		var scheduleInfo = $("#scheduleInfo", panelReportSchedule._panel).clearForm().removeClass("ui-priority-secondary");
		panelReportSchedule.scheduleLoaded = selected.index();
		var controlData = selected.data("controlData");
		if(typeof controlData.report_enabled == "undefined"){
			controlData.report_enabled = "true";
		}
		adminPanel.data.bindValuesFromJson(scheduleInfo, controlData);
		//scheduleInfo.find("input#reportFilename").val(controlData["reportFilename"]);
		var reportType = controlData.reportType;
		if(reportType)
		{
			crushFTP.UI.checkUnchekInput(scheduleInfo.find("input#"+reportType), true);
			scheduleInfo.find("input#"+reportType).trigger("change");
		}
		if(controlData.config.usernames && !controlData.config.usernames.text){
			controlData.config.usernames.text= "";
		}
		panelReportSchedule.config = controlData.config;
		var monthdaysPanel = $(".monthdays", panelReportSchedule._panel);
		monthdaysPanel.find(".ui-state-active").removeClass("ui-state-active");
		var monthDays = controlData.monthDays;
		if(monthDays)
		{
			monthDays = monthDays.split(")(").join("|");
			monthDays = monthDays.substr(0, monthDays.lastIndexOf(")"));
			monthDays = monthDays.substr(1, monthDays.length);
			monthDays = monthDays.split("|");
			for(var i=0; i<=monthDays.length;i++)
			{
				monthdaysPanel.find("div[_day='"+monthDays[i]+"']").addClass("ui-state-active");
			}
		}

		var weekDaysPanel = $(".weekdays", panelReportSchedule._panel);
		weekDaysPanel.find(".ui-state-active").removeClass("ui-state-active");
		var weekDays = controlData.weekDays;
		if(weekDays)
		{
			weekDays = weekDays.split(")(").join("|");
			weekDays = weekDays.substr(0, weekDays.lastIndexOf(")"));
			weekDays = weekDays.substr(1, weekDays.length);
			weekDays = weekDays.split("|");
			for(var i=0; i<=weekDays.length;i++)
			{
				weekDaysPanel.find("div[_day='"+weekDays[i]+"']").addClass("ui-state-active");
			}
		}
		panelReportSchedule.infoShown = true;
		scheduleInfo.find("input:not(.ignoreChange), select:not(.ignoreChange), textarea:not(.ignoreChange)").unbind("change.listen").bind("change.listen", function(){
			panelReportSchedule.hasPendingChanges(true);
		});

		scheduleInfo.find("input[type='text']:not(.ignoreChange), textarea:not(.ignoreChange)").unbind("change.listen").bind("textchange.listen", function(){
			panelReportSchedule.hasPendingChanges(true);
		});
	}
	else
	{
		panelReportSchedule.infoShown = false;
		panelReportSchedule.scheduleLoaded = -1;
		$("#scheduleInfo", panelReportSchedule._panel).clearForm().addClass("ui-priority-secondary");
		panelReportSchedule._panel.find("input[name='reportType']").trigger("change");
	}
	$("#nextRun", panelReportSchedule._panel).val("0");
}

panelReportSchedule.bindEvents = function()
{
	$("a.serverFilePickButton", panelReportSchedule._panel).each(function(){
		$(this).unbind("click").click(function(){
			var curElem = $(this);
            var rel = curElem.attr("rel");
            var pickingFor = curElem.parent().parent().parent().find("label[for='"+rel+"']").text() || "";
            pickingFor = $.trim($.trim(pickingFor).replace(":", ""));
			curElem.crushFtpLocalFileBrowserPopup({
				type : curElem.attr("PickType") || 'dir',
				file_mode : curElem.attr("FileMode") || 'server',
				pickingFor: pickingFor,
				existingVal : $("#" + curElem.attr("rel"), panelReportSchedule._panel).val(),
				callback : function(selectedPath){
					var elem = $("#" + curElem.attr("rel"), panelReportSchedule._panel);
					elem.val(selectedPath).trigger("change");
					panelReportSchedule.hasPendingChanges(true);
				}
			});
			return false;
		});
	});

	$("#emailReport", panelReportSchedule._panel).change(function(){
		if($(this).is(":checked"))
		{
			$("#emailActionConfig", panelReportSchedule._panel).show();
		}
		else
		{
			$("#emailActionConfig", panelReportSchedule._panel).hide();
		}
	});

	 $(".monthdays, .weekdays", panelReportSchedule._panel).find("div").unbind().click(function(){
		if($(this).hasClass("ui-state-active"))
		{
			$(this).removeClass("ui-state-active");
		}
		else
		{
			$(this).addClass("ui-state-active");
		}
		panelReportSchedule.hasPendingChanges(true);
	 });

	panelReportSchedule._panel.find("input[name='reportType']").unbind().change(function(){
		var selected = panelReportSchedule._panel.find("input[name='reportType']:checked");
		var reportType = false;
		if(selected && selected.length>0)
		{
			reportType = selected.attr("id");
		}
		var periodOptions = $("#periodOptions", panelReportSchedule._panel).hide();
		if(reportType)
		{
			periodOptions.show();
			periodOptions.find("div.option").hide();
			periodOptions.find("div." + reportType).show();
		}
	});

	panelReportSchedule._panel.find("#scheduleListActions").find("a").unbind().click(function(){
		if($(this).hasClass("selectAll"))
		{
			crushFTP.UI.checkUnchekInput($("#scheduleList", panelReportSchedule._panel).find("input[type='checkbox']"), true);
		}
		else if($(this).hasClass("deSelect"))
		{
			crushFTP.UI.checkUnchekInput($("#scheduleList", panelReportSchedule._panel).find("input[type='checkbox']"), false);
		}
		return false;
	});

	 $("a.saveSchedule", panelReportSchedule._panel).unbind().click(function(){
		if(panelReportSchedule.infoShown)
		{
			var reportFolder = $('#reportFolder').val();
			if(!reportFolder){
				$("#reportFolder").focus();
				$("#report-path-error").show();
				return false;
			}
			$("#report-path-error").hide();
			var index = panelReportSchedule.scheduleLoaded;
			crushFTP.UI.showIndicator(false, false, "Please wait..");
			var formSubItem = panelReportSchedule.buildXML();
			if(formSubItem)
			{
				crushFTP.data.setXMLPrefs("server_settings/reportSchedules/" + index
					, "properties"
					, "update"
					, formSubItem
					, function(data){
						data = $.xml2json(data, true);
						crushFTP.UI.hideIndicator();
						if(data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK")
						{
							panelReportSchedule.reloadDataFromServer(function(){
								panelReportSchedule.hasPendingChanges(false);
								var childNo = index + 1;
								crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
								crushFTP.UI.hideIndicator();
								$("#scheduleList", panelReportSchedule._panel).find("li:nth-child("+childNo+")").trigger("click");
							});
						}
						else
						{
							crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
						}
					},
					{
						command: "setReportSchedules"
					}
				);
			}
		}
		return false;
	 });

	$("a.updateSchedule", panelReportSchedule._panel).unbind().click(function(){
		var config = {};
		var params = panelReportsSetup.serializeReportElements();
		for(var i=0;i<params.length;i++)
		{
			var curItem = params[i].split("=");
			var key = curItem.length>0 ? curItem[0] : "";
			var val = curItem.length>1 ? curItem[1] : "";
			if(key.length>0)
			{
				config[key] = val;
			}
		}
		panelReportSchedule.config = config;
		panelReportsSetup._panel.clearForm();
		panelReportsSetup._panel.find("#reportName").trigger("change");
		panelReportSchedule.dataChanged = true;
		$("a.saveSchedule:first", panelReportSchedule._panel).trigger("click");
		return false;
	});

	$("a.editSchedule", panelReportSchedule._panel).unbind().click(function(){
		if(panelReportSchedule.config && panelReportSchedule.infoShown)
		{
			jConfirm("This will reload the parameters from this report. You can then edit them and take another snapshot", "Confirm", function(value){
				if(value)
				{
					if(!panelReportSchedule.config.usernames)
						panelReportSchedule.config.usernames = "";

					if(!panelReportSchedule.config.usernames.split)
						panelReportSchedule.config.usernames = panelReportSchedule.config.usernames.text || '';

					panelReportsSetup.bindScheduleConfig(panelReportSchedule.config);
					$("a.updateSchedule", panelReportSchedule._panel).show();
					$("a.editSchedule", panelReportSchedule._panel).hide();
				}
			}
			,{
				okButtonText : "Continue"
			});
		}
		return false;
	});

	$("a.testSchedule", panelReportSchedule._panel).unbind().click(function(){
		if(panelReportSchedule.infoShown)
		{
			var index = panelReportSchedule.scheduleLoaded;
			crushFTP.UI.showIndicator(false, false, "Please wait..");
			var obj = {
				command : "testReportSchedule",
				scheduleIndex : index
			};
			crushFTP.data.serverRequest(obj
				, function(data){
					data = $.xml2json(data, true);
					crushFTP.UI.hideIndicator();
					if(data.response)
					{
						crushFTP.UI.growl("Message", DOMPurify.sanitize(unescape(data.response[0].text)), false, 5000);
					}
					else
					{
						crushFTP.UI.growl("Error while testing the schedule", "Error", true);
					}
				}
			 , false, "POST"
			);
		}
		return false;
	 });

	 $(".buttonBar", panelReportSchedule._panel).find("a").unbind().click(function(){
		if($(this).attr("id") == "newSchedule")
		{
			if(!panelReportsSetup._panel.find("#reportName").val() || panelReportsSetup._panel.find("#reportName").val() == "")
			{
				jAlert("Have you configured a report under the setup tab?<br/>A snapshot is taken of the current configuration in the setup tab.<br/><br/><a style='margin-left:115px;' href='#' id='goToSetup'>Go to Setup Tab</a>", "Snapshot failed", false, {
					classForPopupPanel : 'warning'
				});
				setTimeout(function(){
					$("#popup_content").find("#goToSetup").click(function(){
						$("#popup_content").find("#popup_ok").trigger("click");
						panelReportsSetup.bindScheduleConfig();
						return false;
					});
				},100);
			}
			else
			{
				var controlData = $.extend(panelReportSchedule.defaultTemplateForSchedule, {});
				var selected = $("#scheduleList", panelReportSchedule._panel).find(".ui-state-active");
				if(selected && selected.length>0)
				{
					controlData = $.extend(selected.data("controlData"), {});
				}
				if(controlData)
				{
					jPrompt("Schedule Name", "", "Input", function(value){
						if(value != null && value.length>0)
						{
							controlData.scheduleName = $.trim(value);
							var config = {};
							var params = panelReportsSetup.serializeReportElements();
							for(var i=0;i<params.length;i++)
							{
								var curItem = params[i].split("=");
								var key = curItem.length>0 ? curItem[0] : "";
								var val = curItem.length>1 ? curItem[1] : "";
								if(key.length>0)
								{
									config[key] = val;
								}
							}
							controlData.config = config;
							var prefs = $(document).data("GUIXMLPrefs");
							prefs.reportSchedules.reportSchedules_subitem.push(controlData);
							panelReportSchedule.bindData();
							panelReportSchedule.infoShown = false;
							panelReportSchedule.scheduleLoaded = -1;
							$("#scheduleInfo", panelReportSchedule._panel).clearForm().addClass("ui-priority-secondary");
							panelReportSchedule._panel.find("input[name='reportType']").trigger("change");
							setTimeout(function(){
								$("#scheduleList", panelReportSchedule._panel).find("li:last").trigger("click");
								panelReportSchedule.dataChanged = true;
								$("a.saveSchedule:first", panelReportSchedule._panel).trigger("click");
							}, 200);
						}
					}, false, false, {
						messageToAppend : '<span class="ui-state-highlight ui-corner-all warning" style="padding:5px;display:inline-block;margin:0px 0px 10px 0px;"><span style="float: left; margin-right: 0.3em;" class="ui-icon ui-icon-info"></span>You are taking a snapshot of the current report setup</span>'
					});
				}
			}
			return false;
		}
		else if($(this).attr("id") == "deleteSchedule")
		{
			var items = [];
			$("#scheduleList", panelReportSchedule._panel).find("input:checked").each(function(){
				items.push($(this).closest("li").index());
			});
			if(items.length>0)
			{
				var total = items.length;
				jConfirm("Are you sure you wish to remove selected " + total + " schedule(s)?", "Confirm", function(value){
					if(value)
					{
						function removeSchedule()
						{
							if(items.length>0)
							{
								var curItem = items.pop();
								panelReportSchedule.removeSchedule(curItem, removeSchedule);
							}
							else
							{
								panelReportSchedule.bindData();
								crushFTP.UI.growl("Schedules removed", "Total "+ total +" schedule(s) removed", false, 5000);
								panelReportSchedule.infoShown = false;
								panelReportSchedule.scheduleLoaded = -1;
								$("#scheduleInfo", panelReportSchedule._panel).clearForm().addClass("ui-priority-secondary");
								panelReportSchedule._panel.find("input[name='reportType']").trigger("change");
							}
						}
						removeSchedule();
					}
				});
			}
		}
		return false;
	 });
};

panelReportSchedule.reloadDataFromServer = function(callback)
{
	adminPanel.data.getXMLPrefsDataFromServer("GUIXMLPrefs", function(allPrefs){
		panelReportSchedule.bindData();
		panelReportSchedule.bindEvents();
		if(callback)
			callback();
	});
}

panelReportSchedule.removeSchedule = function(index, callback)
{
	if(typeof index == "undefined")return;
	crushFTP.UI.showIndicator(false, false, "Please wait..");
	crushFTP.data.setXMLPrefs("server_settings/reportSchedules/" + index
		, "properties"
		, "remove"
		, "<reportSchedules_subitem type=\"properties\"></reportSchedules_subitem>"
		, function(data){
			data = $.xml2json(data, true);
			crushFTP.UI.hideIndicator();
			if(data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK")
			{
				var prefs = $(document).data("GUIXMLPrefs");
				prefs.reportSchedules.reportSchedules_subitem.remove(index);
				if(callback)
					callback(true);
			}
			else
			{
				crushFTP.UI.growl("Error", "Error while removing schedule" + index, true);
				if(callback)
					callback(false);
			}
		}, {
			command: "deleteReportSchedules"
		}
	);
}

panelReportSchedule.confirmExit = function()
{
	if(window.panelReportSchedule && panelReportSchedule.dataChanged)
	{
		return "If you navigate away, you will lose your unsaved changes. Do you want to continue?";
	}
}

panelReportSchedule.buildXML = function()
{
	var selected = $("#scheduleList", panelReportSchedule._panel).find(".ui-state-active");
	if(selected && selected.length>0)
	{
		var xmlString = adminPanel.data.buildXMLToSubmitForm(panelReportSchedule._panel.find("#scheduleInfo"));
		var weekDays = "";
		$(".weekdays", panelReportSchedule._panel).find(".ui-state-active").each(function(){
			weekDays += "("+$(this).attr("_day")+")";
		});
		xmlString += "\n<weekDays>"+weekDays+"</weekDays>";

		var monthDays = "";
		$(".monthdays", panelReportSchedule._panel).find(".ui-state-active").each(function(){
			monthDays += "("+$(this).attr("_day")+")";
		});
		xmlString += "\n<monthDays>"+monthDays+"</monthDays>";

		xmlString += "\n<config type=\"properties\">";
		if(panelReportSchedule.config)
		{
			for(var item in panelReportSchedule.config)
			{
				if(item != "type" && item != "usernames")
				{
					if(item == "schedule_nextRun")
						xmlString += "\n<"+item+">0</"+item+">";
					else
						xmlString += "\n<"+item+">"+crushFTP.methods.htmlEncode(panelReportSchedule.config[item])+"</"+item+">";
				}
				else if(item == "usernames")
				{
					xmlString += "\n<usernames type=\"vector\">";
					var userNames = panelReportSchedule.config[item] || '';
					if(panelReportSchedule.config[item].text)
						userNames = panelReportSchedule.config[item].text || '';
					if(userNames && userNames.split){
						var users = userNames.split(",")
						for(var i=0;i<users.length;i++)
						{
							if(users[i] && users[i].length>0)
								xmlString += "\n<usernames_subitem>"+users[i]+"</usernames_subitem>";
						}
					}
					xmlString += "\n</usernames>";
				}
			}
		}
		var selected = panelReportSchedule._panel.find("input[name='reportType']:checked");
		var reportType = false;
		if(selected && selected.length>0)
		{
			reportType = selected.attr("id");
		}
		xmlString += "\n</config>";
		xmlString += "\n<reportType>"+reportType+"</reportType>";
		return "<reportSchedules_subitem type=\"properties\">" + xmlString + "</reportSchedules_subitem>";
	}
	else
	{
		return false;
	}
}