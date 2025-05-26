/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelServerInfo = {};
panelServerInfo.localization = {};
/****************************/

// Panel details
panelServerInfo.panelName = "ServerInfo";
panelServerInfo._panel = $("#pnl" + panelServerInfo.panelName);
panelServerInfo.serverItemContextMenu = $("#serverItemContextMenu", panelServerInfo._panel);

// Localizations
panelServerInfo.localization = {
};

// Assign localizations
localizations.panels[panelServerInfo.panelName] = $.extend(panelServerInfo.localization, localizations.panels[panelServerInfo.panelName]);

// Interface methods
panelServerInfo.init = function(){
	applyLocalizations(panelServerInfo.panelName, localizations.panels);
	panelServerInfo.bindEvents();
	$("#lstServers", panelServerInfo._panel).parent().resizable({minHeight:40, handles: 's', resize : function(){
		panelServerInfo.resizeLogFrame();
	} });
	if(adminPanel.noLogAccess)
	{
		$("#serverLog", panelServerInfo._panel).remove();
	}
}

// Bind data from provided JSON to panel's fields
panelServerInfo.bindData  = {
	serverList : function(data, elem){
		data = data || crushFTP.storage("serverInfo");
		if(!data)
		{
			return;
		}
		elem = elem || $("#lstServers", panelServerInfo._panel);
		var selectedIndex = elem.find("li.ui-widget-header").index();
		if(elem && elem.length>0)
		{
			var serverStatus = {
				total : 0,
				running : 0,
				down : 0
			};
			adminPanel.UI.multiOptionControlDataBind(data
				, "server_list"
				, elem
				, function(curItem){
					var display = crushFTP.methods.textEncode(unescape(curItem.display));
					if(display && display != "undefined")
					{
						if(elem.find("li[display='"+escape(display)+"']").length==0)
						{
							serverStatus.total+=1;
							if(curItem.running)
								serverStatus.running+=1;
							else
								serverStatus.down+=1;
							var _class = curItem.running.toString() == "true" ? "running" : "stopped";
							return $("<li class='ui-widget-content' running='"+curItem.running+"' display='"+ escape(display)+"'><span class='server_"+_class+"'></span>"+ display +"</li>");
						}
						else
							return false;
					}
					else
					{
						return false;
					}
				}
			);
			if(selectedIndex>=0)
			{
				selectedIndex += 1;
				elem.find("li.ui-widget-header").removeClass("ui-widget-header");
				elem.find("li:nth-child("+selectedIndex+")").addClass("ui-widget-header");
			}

			panelServerInfo.resizeLogFrame();

			elem.find("li").contextMenu({
				topPadding : 110,
				leftPadding : 20,
				addClassSP : true,
				menu: 'serverItemContextMenu'
			}, function (action, el, pos, command) {
				panelServerInfo.adminAction(action);
				return false;
			}).click(function (evt) {
				evt.stopPropagation();
				evt.preventDefault();
				$(this).trigger("mousedown").trigger("mouseup");
				return false;
			}).bind("onBeforeContextMenu", function(){
				var running = $(this).attr("running");
				panelServerInfo.serverItemContextMenu.find(".ui-state-disabled").removeClass("ui-state-disabled");
				if(running == "true")
				{
					panelServerInfo.serverItemContextMenu.find(".start").addClass("ui-state-disabled");
				}
				else
				{
					panelServerInfo.serverItemContextMenu.find(".stop, .restart").addClass("ui-state-disabled");
				}
			});

			elem.find("li").each(function(){
				var item = $("<span class='serverItemButtonPnl' style='display:none;'></span>")
				 $(this).prepend(item);
				item.append('<a href="#" class="serverItemButton start"><i class="fa fa-play"></i> Start</a>');
				item.append('<a href="#" class="serverItemButton stop"><i class="fa fa-power-off"></i> Stop</a>');
				item.append('<a href="#" class="serverItemButton restart"><i class="fa fa-refresh"></i> Restart</a>');
				// item.append('<a href="#" class="serverItemButton diagnose"><span style="display: inline-block;margin: 0px 3px 0px -17px; float: left;" class="pointer ui-icon ui-icon-circle-check"></span><span class="">Diagnostics Test</span></a>');
				$(this).hover(function(){
					var serverItemButtonPnl = $(this).find(".serverItemButtonPnl").show();
					var running = $(this).attr("running");
					serverItemButtonPnl.find(".ui-state-disabled").removeClass("ui-state-disabled");
					if(running == "true")
					{
						serverItemButtonPnl.find(".start").addClass("ui-state-disabled");
					}
					else
					{
						serverItemButtonPnl.find(".stop, .restart").addClass("ui-state-disabled");
					}
					if($(this).hasClass('ui-widget-header'))
						$(this).addClass("server_item_hover_selected");
					else
						$(this).addClass("server_item_hover");
				},function(){
					$(this).find(".serverItemButtonPnl").hide();
					$(this).removeClass("server_item_hover server_item_hover_selected");
				});

				item.bind("mousedown", function(evt)
				{
					evt.stopPropagation();
					evt.preventDefault();
				});

				item.find(".serverItemButton").click(function(evt){
					if(!$(this).hasClass("ui-state-disabled"))
					{
						if ($(this).hasClass("diagnose")) {
							action = "diagnose";
							panelServerInfo.diagnose($(this).closest("li").data('controlData'));
						}
						else
						{
							var action = "startServer";
							if ($(this).hasClass("stop")) {
								action = "stopServer";
							}
							else if ($(this).hasClass("restart")) {
								action = "restartServer";
							}
							panelServerInfo.adminAction(action, $(this).closest("li").index());
						}
					}
					evt.stopPropagation();
					evt.preventDefault();
					return false;
				})
			});
		}
	},
	serverInfo : function(data, elem){
		return;
		data = data || crushFTP.storage("serverInfo");
		if(!data)
		{
			return;
		}
		elem = elem || $("#serverInfoTab", panelServerInfo._panel);
		if(elem && elem.length>0)
		{
			adminPanel.data.bindValuesFromJson(elem, data);
		}
		elem.find(".formatData, .hideZero").each(function(){
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
		});
	}
};

panelServerInfo.diagnose = function(data){
	panelServerInfo.diagnoseDialog.data("controlData", data).dialog("open");
};

panelServerInfo.adminAction = function(action, _index)
{
	var selectedIndex = $("#lstServers", panelServerInfo._panel).find("li.ui-widget-header").index();
	if(typeof _index != "undefined")
		selectedIndex = _index;
	if(!action || selectedIndex < 0) return;
	var cmdObj = {
		command: "adminAction",
		action : action,
		index : selectedIndex
	};
	crushFTP.data.serverRequest(
	cmdObj,
	function(data){
		var success = false;
		if(data)
		{
			var usersData = $.xml2json(data);
			if(usersData && usersData["response_status"] && usersData["response_status"]== "OK")
			{
				success = true;
			}
		}
		if(!success)
		{
			crushFTP.UI.growl("Failure", "Admin action " + action + " failed for index " + selectedIndex, true, true);
		}
		else
		{
			var msg = "Server Started";
			if(action == "stopServer")
				msg = "Server Stopped";
			else if(action == "restartServer")
				msg = "Server Restarted";
			crushFTP.UI.growl("Success", crushFTP.methods.htmlEncode(msg), false, 2000);
		}
	});
};

panelServerInfo.resizeLogFrame = function()
{
	var winHeight = $(window).height();
	var serverListHeight = $("#lstServers").parent().height();
	var arbHeight = serverListHeight + 250;
	var frameHeight = winHeight - arbHeight;
	if(frameHeight<500)
		frameHeight = 500;
	$("#serverLoggingFrame").height(frameHeight);
	$("#logFrameOverlay").width($(window).width() - 100);
	$("#logFrameOverlayPreview").width($(window).width() - 100);
}

panelServerInfo.unloadServerLog = function(){
	$("#serverLoggingFrame").attr("src", "about:blank");
	$("#logFrameOverlay").show();
};

panelServerInfo.unloadPreviewLog = function(){
	$("#serverLoggingFramePreview").attr("src", "about:blank");
	$("#logFrameOverlayPreview").show();
};

panelServerInfo.bindEvents = function()
{
	$(window).resize(function () {
		panelServerInfo.resizeLogFrame();
    });
    $("#logFrameOverlay").click(function(event){
    	if(event.ctrlKey || event.metaKey || event.altKey)
    	{
    		window.open("log.html", "_blank");
    		return false;
    	}
    	var that = $(this);
    	crushFTP.UI.showIndicator();
    	$("#serverLoggingFrame").attr("src", "log.html?embed=true&theming=true").bind("load", function(){
    		$("#serverLoggingFrame").unbind("load").contents().find("#openInNewWindow").bind("click.action" ,function(){
    			panelServerInfo.unloadServerLog();
    			window.open("log.html", "_blank");
    			return false;
    		});
    		that.hide();
    		crushFTP.UI.hideIndicator();
    	});
    });
    $("#logFrameOverlay").find(".newWindow").click(function(e){
    	e.preventDefault();
    	e.stopPropagation();
    	window.open("log.html", "_blank");
    });

    $("#logFrameOverlayPreview").click(function(event){
    	if(event.ctrlKey || event.metaKey || event.altKey)
    	{
    		window.open("log.html?filter=PREVIEW|", "_blank");
    		return false;
    	}
    	var that = $(this);
    	crushFTP.UI.showIndicator();
    	$("#serverLoggingFramePreview").attr("src", "log.html?embed=true&filter=PREVIEW|").bind("load", function(){
    		$("#serverLoggingFramePreview").unbind("load").contents().find("#openInNewWindow").bind("click.action" ,function(){
    			panelServerInfo.unloadPreviewLog();
    			window.open("log.html?filter=PREVIEW|", "_blank");
    			return false;
    		});
    		that.hide();
    		crushFTP.UI.hideIndicator();
    	});
    });

    $("#logFrameOverlayPreview").find(".newWindow").click(function(e){
    	e.preventDefault();
    	e.stopPropagation();
    	window.open("log.html?filter=PREVIEW|", "_blank");
    });

    panelServerInfo.resizeLogFrame();
	panelServerInfo.diagnoseDialog = $("#diagnoseDialog");
	panelServerInfo.diagnoseDialog.form().dialog({
		autoOpen: false,
		width: 400,
		title : "Diagnostics Test : ",
		modal: true,
		resizable: false,
		closeOnEscape: false,
		buttons: {
			"Cancel" : function(){
				$(this).dialog("close");
			},
			"OK": function() {
				var IP = panelServerInfo.diagnoseDialog.find("#diag_HostAuto").is(":checked") ? "auto" : $.trim(panelServerInfo.diagnoseDialog.find("#diag_IP").val());
				var Port = $.trim(panelServerInfo.diagnoseDialog.find("#diag_Port").val());
				var Protocol = $.trim(panelServerInfo.diagnoseDialog.find("#diag_Protocol").val());
				var User = $.trim(panelServerInfo.diagnoseDialog.find("#diag_UserName").val());
				var Pass = $.trim(panelServerInfo.diagnoseDialog.find("#diag_pass").val());

				if(Port == "")
				{
					jAlert("Port is required", function(){});
					return false;
				}
				if(Protocol == "")
				{
					jAlert("Protocol is required", function(){
						panelServerInfo.diagnoseDialog.find("#diag_Protocol").focus();
					});
					return false;
				}
				var obj = {
					ip : IP,
					port : Port,
					protocol : Protocol
				};
				if(Protocol.toLowerCase() == "ftp")
				{
					obj.user = User;
					obj.pass = Pass;
				}
				obj.c2f = crushFTP.getCrushAuth();
				var blockedDiv = panelServerInfo.diagnoseDialog.closest("div.ui-dialog").block({
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
				$.ajax({
	                type: "GET"
	                , url: "http://crushftp.com/d.jsp"
	                , data: obj
	                , success: function(data){
	                    if(data)
	                    {
	                    	var msg = data;
	                    	if(data.indexOf("ERROR")>=0)
	                    	{
	                    		var alertMsg = "";
	                    		var e = msg;
								if ((e+"").toUpperCase().indexOf("REFUSED") >= 0)
								{
									alertMsg = "We reached something...but no server was running, bad port?";
								}
								else if ((e+"").toUpperCase().indexOf("TIMEOUT") >= 0 && (e+"").toUpperCase().indexOf("CONNECT") >= 0)
								{
									alertMsg = "Probably a firewall blocked the connection, or the IP/host was wrong";
								}
								else if ((e+"").toUpperCase().indexOf("PLAINTEXT") >= 0)
								{
									alertMsg = "Probably HTTP or some other protocol port";
								}
								else if ((e+"").toUpperCase().indexOf("NOT_SSH") >= 0)
								{
									alertMsg = "Definitely not ssh...probably FTP";
								}
								else if ((e+"").toUpperCase().indexOf("SSH_NO_HEADER") >= 0)
								{
									alertMsg = "Connected so some other protocol port.";
								}
								else if ((e+"").toUpperCase().indexOf("NOT_FTP") >= 0)
								{
									alertMsg = "Definitely not FTP...probably sftp";
								}
								else if ((e+"").toUpperCase().indexOf("FTP_NO_HEADER") >= 0)
								{
									alertMsg = "Connected so some other protocol port.";
								}
								else if ((e+"").toUpperCase().indexOf("FTP_NOT_CRUSHFTP") >= 0)
								{
									alertMsg = "Some other vendor's server";
								}
								else if ((e+"").toUpperCase().indexOf("FTP_BAD_USER_PASS") >= 0)
								{
									alertMsg = "Couldn't login to verify PASV mode stuff";
								}
								else if ((e+"").toUpperCase().indexOf("FTP_PASV_BAD_PORT") >= 0)
								{
									alertMsg = "PASV port was blocked, not mapped correctly in router";
								}
								else if ((e+"").toUpperCase().indexOf("FTP_PASV_TIMEOUT") >= 0)
								{
									alertMsg = "PASV port was blocked, not mapped in router, or firewall, or pointed to wrong internal LAN address";
								}
								else if ((e+"").toUpperCase().indexOf("FTP_PASV_IP_BAD") >= 0)
								{
									alertMsg = "PASV IP seems to be wrong";
								}

								jAlert(msg + "<br>" + alertMsg, "Error", function(){});
	                    	}
	                    	else
	                    	{
	                    		jAlert("Success!! " + msg, "Success", function(){
	                    			panelServerInfo.diagnoseDialog.dialog("close");
	                    		});
	                    	}
	                    }
	                    blockedDiv.unblock();
	                }, error : function(){
	                    jAlert("Error occurred while testing server");
	                    blockedDiv.unblock();
	                }
	            });
			}
		},
		open : function(){
			var data = $(this).data("controlData");
			if(!data)
			{
				$(this).dialog("close");
				return;
			}
			crushFTP.UI.checkUnchekInput(panelServerInfo.diagnoseDialog.find("#diag_HostAuto"), true);
			panelServerInfo.diagnoseDialog.find(".manualIP,.ftpItems").hide();
			panelServerInfo.diagnoseDialog.find("#diag_Port").val(data.port).attr("readonly", "readonly");
			panelServerInfo.diagnoseDialog.find("#diag_IP").val("");
			panelServerInfo.diagnoseDialog.find("#diag_Protocol").val(data.serverType).trigger('textchange');
			$.get("http://www.crushftp.com/ip.jsp", function(data){
				if(data)
				{
					var elem = $(data);
					var IP = $.trim(elem.text().replace("Current IP CheckCurrent IP Address: ", ""));
					if(IP)
					{
						panelServerInfo.diagnoseDialog.find("#diag_publicIPAddress").text(IP);
						panelServerInfo.diagnoseDialog.find("#diag_IP").val(IP);
					}
				}
			})
		}
	});

	panelServerInfo.diagnoseDialog.find("#diag_HostAuto").change(function(){
		if($(this).is(":checked"))
			panelServerInfo.diagnoseDialog.find(".manualIP").hide();
		else
			panelServerInfo.diagnoseDialog.find(".manualIP").show();
	});

	panelServerInfo.diagnoseDialog.find("#diag_Protocol").bind("textchange", function(){
		if($.trim($(this).val().toLowerCase()) == "ftp")
			panelServerInfo.diagnoseDialog.find(".ftpItems").show();
		else
			panelServerInfo.diagnoseDialog.find(".ftpItems").hide();
	});

	panelServerInfo.diagnoseDialog.find("#diag_Port").bind("dblclick", function(){
		$(this).removeAttr('readonly').focus();
	});
};