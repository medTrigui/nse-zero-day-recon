/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelUserInfo = {};
panelUserInfo.localization = {};
/****************************/

// Panel details
panelUserInfo.panelName = "UserInfo";
panelUserInfo._panel = $("#pnl" + panelUserInfo.panelName);

// Localizations
panelUserInfo.localization = {
};

// Assign localizations
localizations.panels[panelUserInfo.panelName] = $.extend(panelUserInfo.localization, localizations.panels[panelUserInfo.panelName]);

// Interface methods
panelUserInfo.init = function(){
	applyLocalizations(panelUserInfo.panelName, localizations.panels);
	panelUserInfo.bindEvents();
	panelUserInfo.resizeInfoContent();
	panelUserInfo.showHidePanels();
	$('.splitter', panelUserInfo._panel).resizable({
		handles: "e",
		minWidth: 260,
		maxWidth: 800
	});
}

panelUserInfo.showHidePanels = function(flag)
{
	if(flag)
	{
		$("#userInfoContentPanel", panelUserInfo._panel).show();
		$("#userInfoContentTip", panelUserInfo._panel).hide();
	}
	else
	{
		$("#sessionInfoPanel", panelUserInfo._panel).unblock();
		$("#userInfoContentPanel", panelUserInfo._panel).hide();
		$("#userInfoContentTip", panelUserInfo._panel).show();
	}
}

panelUserInfo.resizeInfoContent = function(onlyUserLog)
{
	if(!onlyUserLog)
	{
		var userInfoContent = $("#userInfoContent", panelUserInfo._panel);
		var sideBar = $(".sideBar", panelUserInfo._panel);
		var windowWidth = $(window).width();
		windowWidth = windowWidth - sideBar.width() - 100;
		windowWidth = windowWidth < 300 ? 300 : windowWidth;
		userInfoContent.width(windowWidth);
	}
	var winHeight = $(window).height();
    var sessionInfoPanelHeight = $("#sessionInfoPanel", panelUserInfo._panel).height() || 0;
    if(sessionInfoPanelHeight>0)
        sessionInfoPanelHeight += 15;
    var arbHeight = 310;
    var actHeight = winHeight - sessionInfoPanelHeight - arbHeight;
    if(actHeight<500)
        actHeight = 500;
	$("#userSessionLog", panelUserInfo._panel).parent().height(actHeight);
	$("#userSessionLoggingFrame", panelUserInfo._panel).height(actHeight-20).attr("height", actHeight-20);
	if(panelUserInfo.logMiniMap)
	{
		panelUserInfo.logMiniMap.resizeMap();
		panelUserInfo.logMiniMap.buildMap();
	}
	var sessionListExtra = 325;
	var sessionListHeight = Math.round((winHeight - 325)/2);
	if(sessionListHeight<250)
		sessionListHeight = 250;
	panelUserInfo._panel.find(".session-list").css("height", sessionListHeight);
}

panelUserInfo.status = {
	selectedSession : function()
	{
		var sessionInfo = false;
		var sel = $("#lst_sessions", panelUserInfo._panel).find(":selected:first");
		if(sel.length>0)
		{
			sessionInfo = {
				type : "",
				index : sel.val(),
				id : sel.val()
			};
		}
		else
		{
			sel = $("#lst_recent_sessions", panelUserInfo._panel).find(":selected:first");
			if(sel.length>0)
			{
				sessionInfo = {
					type : "recent_",
					index : sel.val(),
					id : sel.val()
				};
			}
		}
		return sessionInfo;
	}
};

panelUserInfo.rebindSessions = function(elem){
	var data = elem.data("sessionData");
	var sessionSelectionStatus = {type : false, index : -1};
	if(panelUserInfo && panelUserInfo.status && panelUserInfo.status.selectedSession)
	{
		sessionSelectionStatus = panelUserInfo.status.selectedSession();
	}
	panelUserInfo.bindData.sessionList(data, "", elem, sessionSelectionStatus);
}

// Bind data from provided JSON to panel's fields
panelUserInfo.bindData  = {
	sessionList : function(data, prefix, elem, selection){
		prefix = prefix || "";
		if(!data)
		{
			return;
		}
		elem = elem || $("#lst_"+prefix+"sessions", panelUserInfo._panel);
		var selectedItems = [];
		elem.find("option:selected").each(function(){
			selectedItems.push($(this).val());
		});
		if(elem && elem.length>0)
		{
			var _scrollTop = elem.scrollTop();
			var phrase = $(".filterSessions").data("last_searched");
			var hide_no_time = $("#hide-with-no-time").is(":checked");
			elem.data("sessionData", data);
			adminPanel.UI.multiOptionControlDataBind(data
				, "session_list"
				, elem
				, function(curItem){
					var user_name = crushFTP.methods.textEncode(unescape(curItem.user_name));
					var user_number = crushFTP.methods.textEncode(unescape(curItem.user_number));
					var user_ip = crushFTP.methods.textEncode(unescape(curItem.user_ip));
					var user_protocol = crushFTP.methods.textEncode(unescape(curItem.user_protocol));
					var last_activity = crushFTP.methods.textEncode(unescape(curItem.last_activity));
					var last_activityDate = '';
					if(last_activity && last_activity !== "0"){
						last_activity = parseInt(last_activity);
						last_activityDate = " > " + new Date(last_activity).format("hh:nn:ss a/p");
					}
					if(typeof user_name != "undefined" && user_name != "undefined")
					{
						var textToShow = user_number+"-"+user_name+"@"+user_protocol+":"+user_ip + " " + last_activityDate;
						if(hide_no_time && !last_activityDate)
							return false;
						if(phrase && phrase.length>0)
						{
							if(phrase.indexOf("!")==0)
							{
								var text = phrase.substr(1, phrase.length);
								if(textToShow.toLowerCase().indexOf(text.toLowerCase())<0)
									return $("<option value='"+ user_number +"'>"+ textToShow +"</option>");
								else
									return false;
							}
							else
							{
								if(textToShow.toLowerCase().indexOf(phrase.toLowerCase())>=0)
									return $("<option value='"+ user_number +"'>"+ textToShow +"</option>");
								else
									return false;
							}
						}
						else
							return $("<option value='"+ user_number +"'>"+ textToShow +"</option>");
					}
					else
					{
						return false;
					}
				}
				, true
			);
			if(selection && selection.index>=0)
			{
				var loaded = false;
				var itemNotFound = false;
				if(selection.type == prefix)
				{
					panelUserInfo.showHidePanels(selection.index>=0);
					var index = selection.index + 1;
					loaded = elem.find("option[value="+selection.id+"]").append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&larr; ");
					if(selectedItems.length == 1)
					{
						loaded.attr("selected", "selected");
					}
					else
					{
						for(var i=0;i<selectedItems.length;i++)
						{
							elem.find("option[value='"+selectedItems[i]+"']").attr("selected", "selected");
						}
					}
					elem.scrollTop(_scrollTop);
					itemNotFound = loaded.length == 0;
				}
				if(itemNotFound)
				{
					if(prefix=="")
						prefix = "recent_";
					else
						prefix = "";
					elem = elem || $("#lst_"+prefix+"sessions", panelUserInfo._panel);
					var _scrollTop = elem.scrollTop();
					loaded = elem.find("option[value="+selection.id+"]").append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&larr; ").attr("selected", "selected");
					if(loaded.length>0)
					{
						elem.focus().trigger("change");
					}
					else
					{
						if(itemNotFound)
						{
							panelUserInfo.showHidePanels(false);
						}
					}
					elem.scrollTop(_scrollTop);
				}
			}
			else
				panelUserInfo.showHidePanels(false);
		}
	},
	sessionInfo : function(data, selection, elem){
		if(!data || selection.id != panelUserInfo.status.selectedSession().id)
		{
			return;
		}
		$("#userInfoContent", panelUserInfo._panel).unblock();
		var sessionInfoPanel = $("#sessionInfoPanel", panelUserInfo._panel);
		sessionInfoPanel.find(".liveData").text("");
		var items = $.xml2json(data);
		crushFTP.methods.rebuildSubItems(items, "result_value");
		var logFile = items.user_log_path + items.user_log_file;
		var userSessionLog = $("#userSessionLog");
        if(userSessionLog.data("logFile") != logFile)
        {
        	if(userSessionLog.find("#userSessionLoggingFrame").length==0)
        	{
	        	var height = userSessionLog.show().height() || 480;
			    userSessionLog.empty().append('<iframe id="userSessionLoggingFrame" onload="" width="100%" height="'+height+'" src="/WebInterface/admin/log.html?embed=true&theming=true&file='+logFile+'" style="margin:0px;padding:0px;"  marginWidth="0" marginHeight="0" frameBorder="0" scrolling="no"></iframe>');
			    userSessionLog.data("logFile", logFile);
        	}
        	else
        	{
        		userSessionLog.find("#userSessionLoggingFrame").get(0).contentWindow.serverLogging.changeLogFile(logFile);
            	userSessionLog.data("logFile", logFile);
        	}
        }
        else
        {
            userSessionLog.show();
        }
		if(!items.list_filetree_status || items.list_filetree_status == "")
		{
			sessionInfoPanel.find("#fileTreeStatus").hide();
		}
		else
		{
			sessionInfoPanel.find("#fileTreeStatus").show();
		}
		panelUserInfo.resizeInfoContent(true);
		elem = elem || $("#sessionInfoPanel", panelUserInfo._panel);
		if(elem && elem.length>0)
		{
			adminPanel.data.bindValuesFromJson(elem, items);
		}
		$("#curSelection", panelUserInfo._panel).val(selection.type + "" + selection.index);
		elem.find(".formatData, .hideZero, .formatTime").each(function(){
			var val = $(this).text();
			if($(this).hasClass("hideZero"))
			{
				val = adminPanel.methods.hideZero(val);
				$(this).text(val);
			}
			if($(this).hasClass("formatData"))
			{
				if(val && crushFTP.methods.isNumeric(val))
				{
					if($(this).hasClass("inKBs"))
					{
						val = parseFloat(val) * 1024;
					}
					$(this).text(crushFTP.methods.formatBytes(val));
					if($(this).hasClass("speedInSecond"))
					{
						$(this).text($(this).text() + " /sec");
					}
				}
			}
			if($(this).hasClass("formatTime"))
			{
				if(val && crushFTP.methods.isNumeric(val))
				{
					$(this).text(crushFTP.methods.formatTime(Math.abs(val).toString()));
				}
			}
		});
	}
}

panelUserInfo.adminAction = function(action, selection, banTimeout, message)
{
	if(!action || !selection) return;
	var selectedItems = [];

	selection.each(function(){
		selectedItems.push($(this).val());
	});

	var cmdObj = {
		command: "adminAction",
		action : action,
		index : selectedItems.join(",")
	};
	if(banTimeout)
	{
		cmdObj.banTimeout = banTimeout;
	}
	if(action == "msgUser"){
		cmdObj.message = message;
	}
	crushFTP.data.serverRequest(
	cmdObj,
	function(data){
		var success = false;
		if(data)
		{
			var usersData = $.xml2json(data);
			if(usersData && usersData["response_status"] && (usersData["response_status"].indexOf("OK") >= 0 || usersData["response_status"].indexOf("true") >= 0))
			{
				success = true;
			}
		}
		if(!success)
		{
			crushFTP.UI.growl("Failure", "Admin action " + action + " failed for index " + cmdObj.index, true, true);
		}
		else
		{
			crushFTP.UI.growl("Success", "Admin action " + action + " completed for index " + cmdObj.index, false, 1500);
		}
	}, false, action == "msgUser" ? "POST" : false);
}

panelUserInfo.sessionSelected = function(list, index)
{
	if(list.is("#lst_sessions"))
	{
		$("#lst_recent_sessions", panelUserInfo._panel).find(":selected").removeAttr("selected");
	}
	else
	{
		$("#lst_sessions", panelUserInfo._panel).find(":selected").removeAttr("selected");
	}
	$("#sessionInfoPanel", panelUserInfo._panel).find(".liveData").text("");
	$("#sessionInfoPanel", panelUserInfo._panel).block({
		message:  'Loading..',
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
	adminPanel.data.dataRefreshCall();
}

panelUserInfo.bindEvents = function()
{
	$(window).resize(function () {
		panelUserInfo.resizeInfoContent();
	});

	$("#lst_sessions, #lst_recent_sessions", panelUserInfo._panel).unbind("change").bind("change"
	, function(){
		if($(this).find(":selected").length==1)
		{
			$(".filterInput", panelUserInfo._panel).val("");
			panelUserInfo.sessionSelected($(this), $(this).find(":selected:first").attr("value"));
		}
	});

	$("#actionButtons a.sessionAction", panelUserInfo._panel).click(function(){
		var action = $(this).attr("_action");
		var selection = $("#lst_sessions, #lst_recent_sessions", panelUserInfo._panel).find(":selected");
		if(selection && selection.length>0)
		{
			var showAction = action;
			if(showAction == "temporaryBan")
				showAction = "temporarily ban";
			else if(showAction == "ban")
				showAction = "permanently ban";

			if(action == "temporaryBan")
			{
				var benTimeout = 10;
				function getMinutes(val, callback)
				{
					val = val || benTimeout;
					jPrompt("For how many minutes do you want to Ban selected user(s)?", val, "Temporary Ban", function(value){
						if(value)
						{
							value = $.trim(value);
							if(value && crushFTP.methods.isNumeric(value))
							{
								if(callback)
									callback(value);
							}
							else
							{
								jAlert("Please enter only numeric value for minutes", "Error", function(){
									getMinutes(value, callback);
								});
							}
						}
					});
				}
				getMinutes(false, function(minutes){
					panelUserInfo.adminAction(action, selection, minutes);
				});
			}
			else if(action == "msgUser"){
				jPrompt("Please enter message", "", "Send message to user", function(value){
					if(value)
					{
						panelUserInfo.adminAction(action, selection, false, $.trim(value));
					}
				}, false, false, {isTextArea: true});
				setTimeout(function(){
					$("#popup_prompt").focus();
				}, 500)
				return false;
			}
			else
			{
				jConfirm("Are you sure you wish to <strong>" + showAction + "</strong>  selected user(s)?", "Confirm", function(flag){
					if(flag)
					{
						panelUserInfo.adminAction(action, selection);
					}
				});
			}
		}
		return false;
	});

	var el = panelUserInfo._panel;
	var delay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

	var filterInput = $(".filterInput", el).unbind("keyup").keyup(function (evt, data) {
		var evt = (evt) ? evt : ((event) ? event : null);
		var logArea = el.find(".logArea");
		if (evt.keyCode == 27)
		{
			$(this).val("").trigger("keyup");
			return false;
		}
		var phrase = $.trim($(this).val());
		if(phrase.length<2)
		{
			phrase = "";
		}
		if ($(this).data("last_searched") && $(this).data("last_searched") === phrase) {
			if(panelUserInfo.logMiniMap)
			{
				panelUserInfo.logMiniMap.buildMap();
			}
			return false;
		}
		function startFilter()
		{
			$(this).data("last_searched", phrase);
			if(!phrase)
			{
				el.find(".logArea").removeHighlight();
				if(panelUserInfo.logMiniMap)
				{
					panelUserInfo.logMiniMap.buildMap();
				}
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
			{
				logArea.attr("scrollTop", frstElem.attr("scrollHeight"));
			}
			if(panelUserInfo.logMiniMap)
			{
				panelUserInfo.logMiniMap.buildMap();
			}
		}
		if(data)
		{
			startFilter();
		}
		else
		{
			delay(function () {
	            startFilter();
	        }, 1000);
		}
	});

	$(".clearFilter", el).unbind().click(function(){
		filterInput.val("").trigger("keyup");
		return false;
	});

	var filterInputSession = $(".filterSessions", el).unbind("keyup").keyup(function (evt, data) {
		var evt = (evt) ? evt : ((event) ? event : null);
		if (evt.keyCode == 27)
		{
			$(this).val("").trigger("keyup");
			return false;
		}
		var phrase = $.trim($(this).val());
		if(phrase.length<1)
		{
			phrase = "";
		}
		if ($(this).data("last_searched") && $(this).data("last_searched") === phrase) {
			return false;
		}
		function startFilter()
		{
			filterInputSession.data("last_searched", phrase);
			panelUserInfo.rebindSessions($("#lst_sessions"));
			panelUserInfo.rebindSessions($("#lst_recent_sessions"));
		}
		if(data)
		{
			startFilter();
		}
		else
		{
			delay(function () {
	            startFilter();
	        }, 500);
		}
	});

	$("#hide-with-no-time", el).unbind("change").change(function (evt, data) {
		function startFilter()
		{
			panelUserInfo.rebindSessions($("#lst_sessions"));
			panelUserInfo.rebindSessions($("#lst_recent_sessions"));
		}
		startFilter();
	});

	$(".clearSessionFilter", el).unbind().click(function(){
		filterInputSession.val("").removeData("last_searched").trigger("keyup", ["noDelay"])
		return false;
	});
}