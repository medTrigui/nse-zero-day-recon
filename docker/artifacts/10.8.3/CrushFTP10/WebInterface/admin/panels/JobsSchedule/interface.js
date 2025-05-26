/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelJobsSchedule = {};
panelJobsSchedule.localization = {};
/****************************/

// Panel details
panelJobsSchedule.panelName = "JobsSchedule";
panelJobsSchedule._panel = $("#pnl" + panelJobsSchedule.panelName);

// Localizations
panelJobsSchedule.localization = {
};

// Assign localizations
localizations.panels[panelJobsSchedule.panelName] = $.extend(panelJobsSchedule.localization, localizations.panels[panelJobsSchedule.panelName]);

// Interface methods
panelJobsSchedule.init = function(){
	applyLocalizations(panelJobsSchedule.panelName, localizations.panels);
	panelJobsSchedule.bindData();
	panelJobsSchedule.bindEvents();
	panelJobsSchedule.showScheduleInfo();
}

panelJobsSchedule.defaultTemplateForSchedule = {
	scheduleType : "",
	weekDays : "",
	monthlyAmount : "1",
	weeklyAmount : "1",
	plugin : "",
	scheduleName : "",
	monthDays : "",
	scheduleTime : "8:00 AM",
	dailyAmount : "1",
	minutelyAmount : "1"
}

panelJobsSchedule.bindData = function()
{
	var prefs = $(document).data("GUIXMLPrefs");
	var JobsSchedules = prefs.schedules;
	var scheduleList = $("#jobsScheduleList", panelJobsSchedule._panel);
	crushFTP.methods.rebuildSubItems(JobsSchedules, "schedules");
	adminPanel.UI.multiOptionControlDataBind(prefs
		, "schedules"
		, scheduleList
		, function(curItem){
			var name = decodeURIComponent(unescape(curItem.scheduleName));
			if(name && name != "undefined")
			{
				var pluginName = crushFTP.methods.textEncode(decodeURIComponent(unescape(curItem.plugin)) || "");
				var _nameToShow = crushFTP.methods.textEncode(pluginName == "CrushTask (User Defined)" ? "" : " : " + pluginName);
				return $("<li _name='"+name+"'><span class='schedule'></span><span class='listText'>" + name + _nameToShow + "</span></li>");
			}
		}
	);

	$("li" , scheduleList).unbind().hover(function(){
		$(this).addClass("ui-state-focus");
	},function(){
		$(this).removeClass("ui-state-focus");
	}).unbind("click").click(function(){
		var selected = $(this);
		if(selected.hasClass("ui-state-active")) return false;
		var continueLoading = function()
		{
			$(".ui-state-active" , scheduleList).removeClass("ui-state-active");
			crushFTP.UI.checkUnchekInput(scheduleList.find("input"), false);
			crushFTP.UI.checkUnchekInput(selected.addClass("ui-state-active").find("input"), true);
			panelJobsSchedule.showScheduleInfo();
		}
		if(panelJobsSchedule.dataChanged)
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

	var monthdays = $(".monthdays", panelJobsSchedule._panel).empty();
	for(var i=1;i<=31;i++)
	{
		monthdays.append('<div class="ui-state-default" _day="'+i+'">'+i+'</div>');
	}

	scheduleList.find("li").contextMenu({
			menu: "jobsContext",
			topPadding : 65,
			leftPadding : 25
		},
		function(action, el, pos) {
			if(action == "moveUp")
			{
				panelJobsSchedule.sortSchedule(el.index(), true);
				$(el).next().after($(el));
			}
			else if(action == "moveDown")
			{
				panelJobsSchedule.sortSchedule(el.index());
				$(el).prev().before($(el));
			}
	}).bind("onBeforeContextMenu", function(){
		$("#jobsContext").find(".ui-state-disabled").removeClass("ui-state-disabled");
		if($(this).next().length==0)
			$("#jobsContext").find(".moveDown").addClass("ui-state-disabled");
		if($(this).prev().length==0)
		{
			$("#jobsContext").find(".moveUp").addClass("ui-state-disabled");
		}
	});
}

panelJobsSchedule.availablePlugins = function()
{
	//Bind available plugins
	var availablePlugins = $(document).data("GUIXMLPrefs").plugins.plugins_subitem;
	crushFTP.methods.rebuildSubItems(availablePlugins, "plugins_subitem");
	var addedPlugins = [];
	function addPluginName(item)
	{
		if(jQuery.isArray(item) && item.length>0)
		{
			for(var i=0;i<item.length;i++)
			{
				addPluginName(item[i]);
			}
		}
		else
		{
			var pluginName = item.pluginName;
			if(pluginName == "CrushTask")
			{
				var pluginName = item.pluginName;
				if(!addedPlugins.has(pluginName))
				{
					addedPlugins.push(pluginName + " (User Defined)");
				}
				if(item.subItem && item.subItem.length > 0)
				{
					pluginName = pluginName + ":" + item.subItem;
				}
				if(pluginName && pluginName.length > 0)
				{
					addedPlugins.push(pluginName);
				}
			}
		}
	}
	for(var i=0;i<availablePlugins.length;i++)
	{
		addPluginName(availablePlugins[i].plugins_subitem_subitem);
	}
	if(addedPlugins.length>1)
	{
		var first = addedPlugins[0];
		addedPlugins[0] = addedPlugins[1];
		addedPlugins[1] = first;
	}
	return addedPlugins;
}

panelJobsSchedule.hasPendingChanges = function(flag)
{
	flag = flag && panelJobsSchedule.infoShown;
	panelJobsSchedule.dataChanged = flag;
}

panelJobsSchedule.showScheduleInfo = function()
{
	var scheduleInfo = $("#jobsScheduleInfo", panelJobsSchedule._panel);
	scheduleInfo.find("input:not(.ignoreChange), select:not(.ignoreChange), textarea:not(.ignoreChange)").unbind("change.listen");
	scheduleInfo.find("input[type='text']:not(.ignoreChange), textarea:not(.ignoreChange)").unbind("change.listen");

	window.onbeforeunload = panelJobsSchedule.confirmExit;
	panelJobsSchedule.hasPendingChanges(false);
	var selected = $("#jobsScheduleList", panelJobsSchedule._panel).find(".ui-state-active");
	if(selected && selected.length>0)
	{
		var scheduleInfo = $("#jobsScheduleInfo", panelJobsSchedule._panel).clearForm().removeClass("ui-priority-secondary").unblock();
		panelJobsSchedule.scheduleLoaded = selected.index();
		var controlData = selected.data("controlData");
		adminPanel.data.bindValuesFromJson(scheduleInfo, controlData, "_id");
		var scheduleType = controlData.scheduleType;
		if(scheduleType)
		{
			crushFTP.UI.checkUnchekInput(scheduleInfo.find("input#"+scheduleType + "_jobs"), true);
			scheduleInfo.find("input#"+scheduleType + "_jobs").trigger("change");
		}
		var indexOfLoadedItem = panelJobsSchedule.scheduleLoaded;
		var tasksXML = $($(document).data("GUIXMLPrefs_RAW")).find("schedules_subitem").get(indexOfLoadedItem);
		if(tasksXML)
		{
			panelJobsSchedule.tasks = $.xml2json(tasksXML, true);
		}
		else
		{
			panelJobsSchedule.tasks = {};
		}
		var monthdaysPanel = $(".monthdays", panelJobsSchedule._panel);
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

		var weekDaysPanel = $(".weekdays", panelJobsSchedule._panel);
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
		panelJobsSchedule.loadPlugin(controlData.pluginName, function(){
			$("#pluginPlaceHolder", panelJobsSchedule._panel).removeData("hasChanged");
		});
		panelJobsSchedule.infoShown = true;
		$("input[_id='nextRun']", scheduleInfo).val("0");
		scheduleInfo.find("input:not(.ignoreChange), select:not(.ignoreChange), textarea:not(.ignoreChange)").unbind("change.listen").bind("change.listen", function(){
			panelJobsSchedule.hasPendingChanges(true);
		});

		scheduleInfo.find("input[type='text']:not(.ignoreChange), textarea:not(.ignoreChange)").unbind("change.listen").bind("textchange.listen", function(){
			panelJobsSchedule.hasPendingChanges(true);
		});
	}
	else
	{
		panelJobsSchedule.infoShown = false;
		panelJobsSchedule.scheduleLoaded = -1;
		$("#jobsScheduleInfo", panelJobsSchedule._panel).clearForm().addClass("ui-priority-secondary");
		panelJobsSchedule._panel.find("input[name='scheduleType']").trigger("change");
	}
}

panelJobsSchedule.bindEvents = function()
{
	 $(".monthdays, .weekdays", panelJobsSchedule._panel).find("div").unbind().click(function(){
		if($(this).hasClass("ui-state-active"))
		{
			$(this).removeClass("ui-state-active");
		}
		else
		{
			$(this).addClass("ui-state-active");
		}
		panelJobsSchedule.hasPendingChanges(true);
	 });

	panelJobsSchedule._panel.find("input[name='scheduleType']").unbind().change(function(){
		var selected = panelJobsSchedule._panel.find("input[name='scheduleType']:checked");
		var scheduleType = false;
		if(selected && selected.length>0)
		{
			scheduleType = selected.attr("_id");
		}
		var periodOptions = $("div[_id='periodOptions']", panelJobsSchedule._panel).hide();
		if(scheduleType)
		{
			periodOptions.show();
			periodOptions.find("div.option").hide();
			periodOptions.find("div." + scheduleType).show();
		}
	});

	panelJobsSchedule._panel.find("#jobsScheduleListActions").find("a").unbind().click(function(){
		if($(this).hasClass("selectAll"))
		{
			crushFTP.UI.checkUnchekInput($("#jobsScheduleList", panelJobsSchedule._panel).find("input[type='checkbox']"), true);
		}
		else if($(this).hasClass("deSelect"))
		{
			crushFTP.UI.checkUnchekInput($("#jobsScheduleList", panelJobsSchedule._panel).find("input[type='checkbox']"), false);
		}
		return false;
	});

	 $("a.saveSchedule", panelJobsSchedule._panel).unbind().click(function(evt, evtData){
		elem = $(this);
		if(panelJobsSchedule.infoShown)
		{
			if(panelJobsSchedule._panel.find(".hasPendingCall").length>0)
			{
				window.pendingEncryptionCall = function(){
					elem.trigger("click");
				};
			}
			else
			{
				var index = panelJobsSchedule.scheduleLoaded;
				var formSubItem = panelJobsSchedule.buildXML();
				if(formSubItem)
				{
					crushFTP.UI.showIndicator(false, false, "Please wait..");
					crushFTP.data.setXMLPrefs("server_settings/schedules/" + index
						, "properties"
						, "update"
						, formSubItem
						, function(data){
							data = $.xml2json(data, true);
							if(data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK")
							{
								panelJobsSchedule.reloadDataFromServer(function(){
									panelJobsSchedule.hasPendingChanges(false);
									var childNo = index + 1;
									crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
									$("#pluginPlaceHolder", panelJobsSchedule._panel).removeData("hasChanged");
									crushFTP.UI.hideIndicator();
									$("#jobsScheduleList", panelJobsSchedule._panel).find("li:nth-child("+childNo+")").trigger("click");
									if(evtData && evtData.callback)
									{
										evtData.callback(true);
									}
								});
							}
							else
							{
								crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
								if(evtData && evtData.callback)
								{
									evtData.callback(false);
								}
							}
						}
					);
				}
			}
		}
		return false;
	 });

	 $("a.testSchedule", panelJobsSchedule._panel).unbind().click(function(){
		if(panelJobsSchedule.infoShown)
		{
			var index = panelJobsSchedule.scheduleLoaded;
			if(index>=0)
			{
				var pluginArea = $("#pluginArea", panelJobsSchedule._panel)
				if(pluginArea.is(":visible") && !pluginArea.find("#enabled").is(":checked"))
				{
					crushFTP.UI.growl("Message", "You must enable task before running", true, 5000);
					return false;
				}
				$("a.saveSchedule:first", panelJobsSchedule._panel).trigger("click", [{callback:function(flag){
					if(flag)
					{
						crushFTP.UI.showIndicator(false, false, "Please wait..");
						var obj = {
							command : "testJobSchedule",
							scheduleIndex : index
						};
						crushFTP.data.serverRequest(obj
							, function(data){
								data = $.xml2json(data, true);
								crushFTP.UI.hideIndicator();
								if(data.response)
								{
									crushFTP.UI.growl("Message", DOMPurify.sanitize(unescape(data.response[0].text)), false, 5000);
									$("#jobsPanelTabs").tabs({
										selected : 1
									});
								}
								else
								{
									crushFTP.UI.growl("Error while testing the job schedule", "Error", true);
								}
							}
						 , false, "POST"
						);
					}
				}}]);
			}
		}
		return false;
	 });

	$("a.changePlugin", panelJobsSchedule._panel).unbind().click(function(){
		if(panelJobsSchedule.infoShown)
		{
			var plugins = panelJobsSchedule.availablePlugins();
			var plugin = panelJobsSchedule._panel.find("input[_id='plugin']").val();
			jPrompt("Choose the plugin to schedule : ", plugin, "Input", function(selectedPlugin){
				if(selectedPlugin != null && selectedPlugin.length>0)
				{
					panelJobsSchedule._panel.find("input[_id='plugin']").val(selectedPlugin).trigger("change");
					panelJobsSchedule.pluginLoaded = false;
					if(selectedPlugin.indexOf("User Defined")>=0)
					{
						panelJobsSchedule._panel.find("input[_id='pluginName']").val("CrushTask").trigger("change");
					}
					else
					{
						panelJobsSchedule._panel.find("input[_id='pluginName']").val("").trigger("change");
					}
					panelJobsSchedule.dataChanged = true;
					$("a.saveSchedule:first", panelJobsSchedule._panel).trigger("click");
				}
			}, plugins);
		}
		return false;
	 });

	 $(".buttonBar", panelJobsSchedule._panel).find("a").unbind().click(function(){
		if($(this).attr("id") == "newJobsSchedule")
		{
			if(!$(document).data("app_enterprise"))
			{
				jAlert('<div style="text-align:center">To use this feature, an Enterprise license is required.<br><br> To get more information on features and pricing, see the following links : <br><br><a href="http://crushftp.com/pricing.html#enterprise" tabIndex="-1" target="_blank">Plans &amp; Pricing</a> | <a href="http://www.crushftp.com/crush6wiki/Wiki.jsp?page=Enterprise%20License%20Enhancements" tabIndex="-1" target="_blank">Enterprise License Enhancements</a></div>', "This is an Enterprise License feature");
				return false;
			}
			jPrompt("Schedule Name", "", "Input", function(scheduleName){
				if(scheduleName != null && scheduleName.length>0)
				{
					var plugins = panelJobsSchedule.availablePlugins();
					jPrompt("Choose the plugin to schedule : ", "", "Input", function(selectedPlugin){
						if(selectedPlugin != null && selectedPlugin.length>0)
						{
							var newSchedule = panelJobsSchedule.defaultTemplateForSchedule;
							newSchedule = $.extend(true, {}, newSchedule);
							newSchedule.scheduleName = scheduleName;
							newSchedule.plugin = selectedPlugin;
							if(selectedPlugin.indexOf("User Defined")>=0)
							{
								newSchedule.pluginName = "CrushTask";
							}
							var prefs = $(document).data("GUIXMLPrefs");
							prefs.schedules.schedules_subitem.push(newSchedule);
							panelJobsSchedule.bindData();
							panelJobsSchedule.bindEvents();
							panelJobsSchedule.infoShown = false;
							panelJobsSchedule.scheduleLoaded = -1;
							$("#jobsScheduleInfo", panelJobsSchedule._panel).clearForm().block({
								message: null,
								overlayCSS : {
									backgroundColor: '#fff',
									'-webkit-border-radius': '10px',
									'-moz-border-radius': '10px',
									opacity: .5,
									cursor: 'normal',
									padding : '2px'
								}
							});
							panelJobsSchedule._panel.find("input[name='reportType']").trigger("change");
							$("#jobsScheduleList", panelJobsSchedule._panel).find("li:last").trigger("click");
							panelJobsSchedule.dataChanged = true;
							$("a.saveSchedule:first", panelJobsSchedule._panel).trigger("click");
						}
					}, plugins);
				}
			});
			return false;
		}
		else if($(this).attr("id") == "deleteJobsSchedule")
		{
			var items = [];
			$("#jobsScheduleList", panelJobsSchedule._panel).find("input:checked").each(function(){
				items.push($(this).closest("li").index());
			});
			if(items.length>0)
			{
				var total = items.length;
				jConfirm("Are you sure you wish to remove selected "+ total +" schedule(s)?", "Confirm", function(value){
					if(value)
					{
						crushFTP.UI.showIndicator(false, false, "Please wait..");
						function removeSchedule()
						{
							if(items.length>0)
							{
								var curItem = items.pop();
								panelJobsSchedule.removeSchedule(curItem, removeSchedule);
							}
							else
							{
								panelJobsSchedule.reloadDataFromServer(function(){
									crushFTP.UI.hideIndicator();
									$("#tasksList", $("#jobsScheduleInfo", panelJobsSchedule._panel)).empty();
									crushFTP.UI.growl("Schedules removed", "Total "+ total +" schedule(s) removed", false, 5000);
									panelJobsSchedule.infoShown = false;
									panelJobsSchedule.scheduleLoaded = -1;
									$("#jobsScheduleInfo", panelJobsSchedule._panel).clearForm().block({
										message: null,
										overlayCSS : {
											backgroundColor: '#fff',
											'-webkit-border-radius': '10px',
											'-moz-border-radius': '10px',
											opacity: .5,
											cursor: 'normal',
											padding : '2px'
										}
									});
									panelJobsSchedule._panel.find("input[name='reportType']").trigger("change");
								});
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

panelJobsSchedule.removeSchedule = function(index, callback)
{
	if(typeof index == "undefined")return;
	crushFTP.data.setXMLPrefs("server_settings/schedules/" + index
		, "properties"
		, "remove"
		, "<schedules_subitem type=\"properties\"></schedules_subitem>"
		, function(data){
			data = $.xml2json(data, true);
			if(data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK")
			{
				if(callback)
					callback(true);
			}
			else
			{
				crushFTP.UI.growl("Error", "Error while removing schedule" + index, true);
				if(callback)
					callback(false);
			}
		}
	);
}

panelJobsSchedule.reloadDataFromServer = function(callback)
{
	adminPanel.data.getXMLPrefsDataFromServer("GUIXMLPrefs", function(allPrefs){
		panelJobsSchedule.bindData();
		panelJobsSchedule.bindEvents();
		if(callback)
			callback();
	});
}

panelJobsSchedule.confirmExit = function()
{
	if(!panelJobsSchedule.dataChanged)
		panelJobsSchedule.dataChanged = $("#pluginPlaceHolder", panelJobsSchedule._panel).data("hasChanged");
	if(window.panelJobsSchedule && panelJobsSchedule.dataChanged)
	{
		return "If you navigate away, you will lose your unsaved changes. Do you want to continue?";
	}
}

panelJobsSchedule.getPluginXML = function()
{
	if(!panelJobsSchedule.pluginLoaded) return false;
	var pluginData = "";
	var script = "pluginData = plugin"+panelJobsSchedule.pluginLoaded+".saveContent();";
	eval(script);
	return pluginData;
}

panelJobsSchedule.loadPlugin = function(pluginToLoad, callback)
{
	var pluginPlaceHolder = $("#pluginPlaceHolder", panelJobsSchedule._panel);
	if(!pluginToLoad || pluginToLoad.length==0)
	{
		panelJobsSchedule.pluginLoaded = false;
		pluginPlaceHolder.parent().hide();
		return;
	}
	pluginPlaceHolder.parent().show();
	window.embedPlugin = true;
	var jsonDeep = panelJobsSchedule.tasks;
	try{
		$.getScript("/WebInterface/Preferences/js/crushftp.localizations.js", function() {
			$.getScript("/WebInterface/Preferences/js/crushftp.interface.js", function() {
				panelJobsSchedule.pluginLoaded = pluginToLoad;
				loadPanel("Plugins", true, {
					loadPlugin : pluginToLoad,
					pluginID : crushFTP.methods.generateRandomPassword(10),
					returnXML : true,
					placeHolder : pluginPlaceHolder,
					dataItem : jsonDeep,
					baseUrl : "/WebInterface/Preferences/",
					hideButtons : true,
					ignoreChanges : true,
					callbackOnload : function(){
						if(callback)
							callback();
					}
				});
			});
		});
	}
	catch(ex)
	{
		if(ex && ex.toString() != "")
		{
			crushFTP.UI.growl("Error", DOMPurify.sanitize(ex), true);
		}
	}
}

panelJobsSchedule.sortSchedule = function(index, flag)
{
	var selected_index;
	var selected = $("#jobsScheduleList", panelJobsSchedule._panel).find(".ui-state-active");
	if(selected && selected.length>0)
	{
		selected_index = selected.attr("_name");
	}
	function continueSorting()
	{
		crushFTP.UI.showIndicator(false, false, "Please wait..");
		var prefs = $($(document).data("GUIXMLPrefs_RAW"));
		if(typeof index != "undefined")
		{
			var fnElem = prefs.find("schedules_subitem:eq("+index+")");
			if(flag)
				fnElem.prev().before(fnElem);
			else
				fnElem.next().after(fnElem);
		}
		var xml = [];
		function traverseAndBuildPrivsXML(tree) {
		    $(tree).contents().each(function() {
		        if (this.nodeType == 3) {
		            xml.push(crushFTP.methods.xmlEncode($(this).text()));
		        }
		        else
		        {
	                var attrs = "";
	                for (var i=0; i<this.attributes.length; i++)
	                {
	                	var name = this.attributes.item(i).nodeName;
	                    attrs += name+"=\"" + $(this).attr(name) + "\"";
	                }
		        	xml.push("<"+this.nodeName+" "+attrs+">");
		            traverseAndBuildPrivsXML(this);
		            xml.push("</"+this.nodeName+">");
		        }
		    });
		}
		traverseAndBuildPrivsXML(prefs.find("schedules"));
		var completeXML = "<schedules type=\"vector\">" + xml.join("") + "</schedules>";
		crushFTP.UI.showIndicator(false, false, "Please wait..");
		crushFTP.data.setXMLPrefs("server_settings/schedules/"
			, "vector"
			, "update"
			, completeXML
			, function(data){
				data = $.xml2json(data, true);
				if(data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK")
				{
					panelJobsSchedule.reloadDataFromServer(function(){
						crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
						$("#pluginPlaceHolder", panelJobsSchedule._panel).removeData("hasChanged");
						if(typeof selected_index != "undefined")
						{
							$("#jobsScheduleList", panelJobsSchedule._panel).find("li[_name='"+selected_index+"']").trigger("click");
						}
						crushFTP.UI.hideIndicator();
					});
				}
				else
				{
					crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
				}
			}
		);
	}
	if(panelJobsSchedule.infoShown && panelJobsSchedule.dataChanged)
	{
		$("a.saveSchedule:first", panelJobsSchedule._panel).trigger("click", [{callback:function(flag){
			if(flag)
			{
				continueSorting();
			}
		}}]);
	}
	else
	{
		continueSorting();
	}
}

panelJobsSchedule.buildXML = function()
{
	var selected = $("#jobsScheduleList", panelJobsSchedule._panel).find(".ui-state-active");
	if(selected && selected.length>0)
	{
		var xmlString = adminPanel.data.buildXMLToSubmitForm(panelJobsSchedule._panel.find("#jobsScheduleInfo"), false, "_id");
		var weekDays = "";
		$(".weekdays", panelJobsSchedule._panel).find(".ui-state-active").each(function(){
			weekDays += "("+$(this).attr("_day")+")";
		});
		xmlString += "\n<weekDays>"+weekDays+"</weekDays>";

		var monthDays = "";
		$(".monthdays", panelJobsSchedule._panel).find(".ui-state-active").each(function(){
			monthDays += "("+$(this).attr("_day")+")";
		});
		xmlString += "\n<monthDays>"+monthDays+"</monthDays>";
		var pluginData = panelJobsSchedule.getPluginXML();
		if(pluginData)
		{
			pluginData = pluginData.replace("<plugins_subitem type=\"properties\">" ,"");
			pluginData = pluginData.replace("</plugins_subitem>" ,"");
			pluginData = pluginData.replace("<subItem></subItem>>" ,"");
			xmlString += "\n" + pluginData;
		}
		var selected = panelJobsSchedule._panel.find("input[name='scheduleType']:checked");
		var scheduleType = false;
		if(selected && selected.length>0)
		{
			scheduleType = selected.attr("_id");
		}
		xmlString += "\n<scheduleType>"+scheduleType+"</scheduleType>";
		return "<schedules_subitem type=\"properties\">" + xmlString + "</schedules_subitem>";
	}
	else
	{
		return false;
	}
}