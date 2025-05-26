/*!
* CrushFTP Session checker
*
* http://crushFTP.com/
*
* Copyright 2012, CrushFTP
*
* Date: Monday, Mar 19 2012
*
* Author: Vipul Limbachiya
*
* http://vipullimbachiya.com
*/
(function($){
    $.sessionChecker = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        var retries = 0;

        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;

        // Add a reverse reference to the DOM object
        base.$el.data("sessionChecker", base);

        base.init = function(){
			base.options = $.extend({},$.sessionChecker.defaultOptions, options);
			base.bindUserInfo(function(response) {
				if(window.crushFTP){
					crushFTP.curUserInfo = {
						data: response,
						time: new Date().getTime()
					};
				}
				if(response)
				{
					if($(response).find("app_version") && $(response).find("app_version").text().length>0)
					{
						$(document).data("app_version", $(response).find("app_version").text());
					}
					if($(response).find("app_enterprise") && $(response).find("app_enterprise").text().length>0)
					{
						var txt = $(response).find("app_enterprise").text();
						$(document).data("app_enterprise",  txt && txt!= "0");
					}
					if($(response).find("account_expire") && $(response).find("account_expire").text().length>0)
					{
						$(document).data("account_expire", $(response).find("account_expire").text());
						if(typeof window.accountExpiresNote != "undefined")
						{
							window.accountExpiresNote($(document).data("account_expire"));
						}
					}
					if(!options.refreshServerInfo)
					{
						// Put your initialization code here
						$(document).data(base.options.dataStorageKey, base.options.startingPointVal);
						base.updateSessionSeconds();
						base.updateTimer();
					}
					if($(response).find("user_priv_options") && $(response).find("user_priv_options").text().length>0)
					{
						base.applyAdminPrivs($(response).find("user_priv_options").text());
					}
				}
				setTimeout(function() {
					base.options.callBack(response);
				}, 10);
			});

			base.$el.bind("click", function(evt){
				if(evt.altKey)
				{
					base.$el.toggleClass('strike-out');
				}
			});

			if(base.options.keepAliveOnMouseKeyboardActivity){
				var lastReviveTimeOut;
				$(document).bind('mousemove click keydown', function(evt){
					if(!lastReviveTimeOut){
						base.bindUserInfo(function(response) {
							if(response) {
								base.updateSessionSeconds(true);
							}
						});
						lastReviveTimeOut = setTimeout(function(){
							lastReviveTimeOut = false;
						}, 60000);
					}
				});
			}

			setInterval(function(){
				if(!base.getCrushAuth() && window.crushFTP && window.crushFTP.methods && window.crushFTP.methods.validateUserLoginState){
					crushFTP.methods.validateUserLoginState();
				}
			}, 1000);

			window.electronInit = function(){
				window.electronUpdateServerStatus = function(cb){
					base.bindUserInfo(function(response) {
						if(cb)
							cb();
						if(response) {
							retries = 0;
							if($(response).find("username").text() === "anonymous" && window.isLoggedOut){
								window.isLoggedOut();
							}
							else{
								base.updateSessionSeconds(true);
								if(window.setConnectionStatus){
									window.setConnectionStatus(true);
								}
							}
						}
						else {
							retries++;
							if(retries>2){
								window.isLoggedOut();
								retries = 0;
							}
							if(window.setConnectionStatus){
								window.setConnectionStatus(false);
							}
						}
					});
				}
				setInterval(function(){
					window.electronUpdateServerStatus();
				}, 10000);
			}
        };

        base.getCrushAuth = function(){
		    var auth = $.cookie("currentAuth");
	        if(auth && auth.length>0)
	            return auth;//.substr(auth.length - 4);
	        else
	            return false;
		};

		base.getTextContent = function(obj) {
			if ($.browser.msie && parseInt(jQuery.browser.version) == 10) {
                var itm = {};
                itm.textContent = $(obj).text();
                return itm;
            }
            else
            {
				if (window.ActiveXObject) {
					var obj2 = {};
					try {
						if(typeof obj.text != "undefined")
                            obj2.textContent = obj.text;
                        else
                            obj2.textContent = $(obj).text();
					} catch (ex) {}
					return obj2;
				} else {
					return obj;
				}
            }
		}

		base.getActionResponseText = function(msg, key) {
			var responseText = '';
			key = key || "response";
			try {
				var msgs = msg.getElementsByTagName("commandResult");
				for (var x = 0; x < msgs.length; x++) {
					responseText += base.getTextContent(msgs[x].getElementsByTagName(key)[0]).textContent;
				}
			} catch (ex) {}
			return responseText;
		}

		base.formatTime = function(secs) {
			var minLabel = (typeof window.localizations !="undefined" && typeof window.localizations.minutesLabelText !="undefined") ? window.localizations.minutesLabelText : "min";
			var secondsLabel = (typeof window.localizations !="undefined" && typeof window.localizations.secondsLabelText !="undefined") ? window.localizations.secondsLabelText : "secs";
			var remaining = "";
			secs = secs.substring(0, secs.indexOf(".")) * 1;
			var mins = (secs / 60) + ".0";
			mins = mins.substring(0, mins.indexOf(".")) * 1;
			if (mins > 0) {
				secs -= (mins * 60);
				remaining = mins + " "+minLabel+", " + secs + " " + secondsLabel;
			} else {
				if (secs < 0) {
					remaining = "0 " + secondsLabel;
				} else {
					remaining = secs + " " + secondsLabel;
				}
			}
			window.sessionRemaining = remaining;
			return remaining;
		}

        // Update timer for local text on document
         base.updateTimer = function(external){
			if(!external)
			{
				if(base.updateTimerID)
					clearTimeout(base.updateTimerID);
				base.updateTimerID = setTimeout(function(){
					base.updateTimer();
				}, base.options.localTimerPeriod);
			}
			if ($(document).data(base.options.dataStorageKey) * 1 > 0)
			{
				var s = $(document).data(base.options.dataStorageKey)+".0";
				var template = $.sessionChecker.defaultOptions.noteTextTemplate || base.options.noteTextTemplate;
				base.$el.html(template.replace("%time%", base.formatTime(s)));
				if($('#alertAutoLogoutMsg').is(":visible")){
					base.$el.html("** You are signed out due to inactivity **");
				}
				$(document).data(base.options.dataStorageKey, $(document).data(base.options.dataStorageKey)*1-1);
			}
			var sessionSeconds = $(document).data("sessionSeconds") || 0;
			if(sessionSeconds <= 60 && sessionSeconds > 0)
			{
				if(base.$el.hasClass('strike-out'))
				{
					base.bindUserInfo(function(response) {
						if(response) {
							base.updateSessionSeconds(true);
						}
					});
					return false;
				}
				if(!base.ajaxCallRunning)
				{
					base.alertLogoutConfirmation(function(){
						var targetUrl = window.location.toString().replace(document.location.hash.toString(), "");
						base.ajaxCallRunning = true;
						base.bindUserInfo(function(response) {
							if (!response) {
								window.location = targetUrl;
								base.ajaxCallRunning = false;
							}
							else
							{
								base.updateSessionSeconds(true);
							}
						});
					});
				}
			}
			else if(sessionSeconds <= 0 && base.initComplete)
			{
				base.updateSessionSeconds(true, function(s){
					if(s<=0)
					{
						if(window.placeHolder && window.placeHolder.removeData)window.placeHolder.removeData("hasChanged");
						if(window.userManager && window.userManager.methods && window.userManager.methods.itemsChanged)
						{
							userManager.methods.itemsChanged(false);
						}
						if(window.doLogout)
							window.doLogout(true);
					}
					else if(s>65 && window.stayOnlineMsgShown)
					{
						$("#popup_overlay, #popup_container").remove();
						window.stayOnlineMsgShown = false;
					}
				});
			}
         };

		 // Update timer for value from the server
		 base.getTimeoutInProgress = false;
		 base.updateSessionSeconds = function(external, callBack){
		 	if(base.getTimeoutInProgress)
		 		return;
		 	base.getTimeoutInProgress = true;
			if(!external)
			{
				if(base.updateSessionSecondsID)
					clearTimeout(base.updateSessionSecondsID);
				base.updateSessionSecondsID = setTimeout(function(){
					if(base.$el.hasClass('strike-out'))
					{
						base.bindUserInfo(function(response) {
							if(response) {
								base.updateSessionSeconds();
							}
						});
						return false;
					}
					else
						base.updateSessionSeconds();
				}, base.options.sessionTimerPeriod);
			}
			$.ajax({
				type: base.options.requestType,
				url: base.options.ajaxURL,
				data: {
					command: base.options.serverCommand,
					c2f : base.getCrushAuth()
				},
				success: function (response) {
					base.getTimeoutInProgress = false;
					base.ajaxCallRunning = false;
					var s = $.trim(base.getActionResponseText(response));
					var msg = $.trim(base.getActionResponseText(response, "msg"));
					$(document).data(base.options.dataStorageKey, s);
					if(typeof window.sessionLength == "undefined")
					{
						window.sessionLength = parseInt(s);
					}
					if(parseInt(s)>65 && window.stayOnlineMsgShown)
					{
						$("#popup_overlay, #popup_container").remove();
						window.stayOnlineMsgShown = false;
					}
					if(msg){
						msg = decodeURIComponent(msg);
						if(window.crushFTPTools && window.crushFTPTools.textEncode)
						{
							msg = crushFTPTools.textEncode(msg).replace(/\n/g, "<br>").replace(/ /g, "&nbsp;");
						}
						if(window.crushFTP && window.crushFTP.UI && window.crushFTP.UI.growl){
							crushFTP.UI.growl("Message", DOMPurify.sanitize(msg), false, false);
						}
						else if(window.growl){
							window.growl("Message", msg, false)
						}
					}
					base.initComplete = true;
					if(callBack)
						callBack(parseInt(s));
				}
			});
		 };

		base.alertLogoutConfirmation = function(callBack)
		{
			if (window.keepUserSessionAlive || (typeof jAlert == "undefined" && window.newUploadAdded && window.isElectron && window.isCrushShare && window.isElectron() && window.isCrushShare())){
				var obj = {
	                command: "getXMLListing",
	                format: "JSONOBJ",
	                path: (window.path) ? window.path : "/",
	                random: Math.random()
	            };
				obj.c2f = base.getCrushAuth();
				$.ajax({
					type: "POST",
					url: base.options.ajaxURL,
					data: obj,
					success: function (msg) {
						//console.log(window);
					}
				});
				callBack();
				return;
			}
			if(!callBack)return;
			if(typeof jAlert == "undefined") //WebInterface
			{
				if($('#alertLogoutConfirmation').is(":visible") || base.logoutConfirmDialogShownRecently)return;
				if ($("#alertLogoutConfirmation").length == 0) {
					var alertLogoutHTML = "<div class='logoutConfirmDialog blockUI autologout'><div class='attention' style='height:25px;margin-top:20px;'>" + getLocalizationKeyExternal("AutoLogOutConfirmationDesc") + "</div><div style='clear:both;'></div></div>";
					$("body").append("<div id='alertLogoutConfirmation'>" + alertLogoutHTML + "</div>");
					$("#alertLogoutConfirmation").hide();
				}
				var isWelcomeNoteVisible = $("div#welcomeFormPanel").is(":visible");
				if(isWelcomeNoteVisible)
				{
					var welcomeForm = $("#welcomeFormPanel");
					$("#popupContent").append(welcomeForm);
					$.unblockUI();
				}
				var $alertBox = $('#alertLogoutConfirmation');
				$alertBox.dialog({
                    modal: true,
                    title : getLocalizationKeyExternal("AutoLogOutConfirmationTitle"),
                    buttons: [
                    {
                        text : getLocalizationKeyExternal("AutoLogOutButtonText"),
                        click : function(){
                            base.logoutConfirmDialogShownRecently = true;
							setTimeout(function(){
								base.logoutConfirmDialogShownRecently = false;
							}, 10000);
                            $(this).dialog("close");
							if(isWelcomeNoteVisible)
							{
								setTimeout(function(){
									window.displayWelcomeNote(true);
								}, 200);
							}
							$("#alertLogoutConfirmation").remove();
							var obj = {
				                command: "getXMLListing",
				                format: "JSONOBJ",
				                path: (window.path) ? window.path : "/",
				                random: Math.random()
				            };
							obj.c2f = base.getCrushAuth();
							$.ajax({
								type: "POST",
								url: base.options.ajaxURL,
								data: obj,
								success: function (msg) {
									//console.log(window);
								}
							});
							callBack();
                        }
                    }],
                    open : function(event, ui){
                        $(event.target).closest(".ui-dialog").css("zIndex", 9999).next().css("zIndex", 9998);
                    }
                });
			}
			else
			{
				if(!window.stayOnlineMsgShown && !base.logoutConfirmDialogShownRecently)
				{
					if(window.sessionCheckerStayOnlineID)
						clearInterval(window.sessionCheckerStayOnlineID);
					window.sessionCheckerStayOnlineID = setInterval(function(){
						if(window.stayOnlineMsgShown && !base.ajaxCallRunning)
						{
							base.updateSessionSeconds();
							base.updateTimer();
							clearInterval(window.sessionCheckerStayOnlineID);
						}
					}, 5000);
					jAlert("You are about to be signed out due to inactivity", "Auto Logout", function(){
						delete window.stayOnlineMsgShown;
						clearInterval(window.sessionCheckerStayOnlineID);
						base.logoutConfirmDialogShownRecently = true;
						setTimeout(function(){
							base.logoutConfirmDialogShownRecently = false;
						}, 10000);
						callBack();
					}, {
						okButtonText : "Stay logged in"
					});
					window.stayOnlineMsgShown = true;
				}
			}
		};

		//Bind user info
		base.userInfoCallInProgress = false;
		base.bindUserInfo = function(callBack, path) {
		/* Data to POST to receive file listing */
			if(base.userInfoCallInProgress)
				return false;
			base.userInfoCallInProgress = true;
			path = path || "/";
			var obj = {
				command: "getUserInfo",
				path : path,
				random: Math.random()
			};
			obj.c2f = base.getCrushAuth();
			$.ajax({
				type: "POST",
				url: base.options.ajaxURL,
				data: obj,
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					base.userInfoCallInProgress = false;
					callBack(false);
				},
				success: function (msg) {
					base.userInfoCallInProgress = false;
					var responseText = msg;
					try {
						if (callBack) {
							callBack(msg);
						}
					} catch (ex) {
						if (callBack) {
							callBack(false);
							return false;
						}
					}
				}
			});
		};

		base.applyAdminPrivs = function(privs){
			var topSwitchButtons = $("#topSwitchButtons").show();
			if(privs && privs.length>3)
			{
				window._curUserPrivs = privs;
				privs = privs.substr(1, privs.length-2).toLowerCase();
				privs = privs.split(")(");
				if(privs.has("connect"))
				{
					window.isUserFullAdmin = true;
				}
				topSwitchButtons.find("li[privs]").each(function(){
					var that = $(this);
					var reqPrivs = that.attr("privs");
					reqPrivs = reqPrivs.split(",");
					var hasPriv = false;
					for (var i = 0; i < reqPrivs.length; i++) {
						if(privs.has(reqPrivs[i]))
						{
							hasPriv = true;
							i = reqPrivs.length+1;
						}
					};
					if(!hasPriv)
						that.remove();
				});

				if(typeof window.adminPanel != "undefined")
				{
					function applyPrivsToAdminPanel(internal){
						var hasChanges = false;
						var configOptionTabs = adminPanel.placeHolder;//$("#configOptionTabs");
						configOptionTabs.find("ul.mainTabs li[privs], #aboutPanelContent *[privs]").each(function(){
							var that = $(this);
							var reqPrivs = that.attr("privs");
							reqPrivs = reqPrivs.split(",");
							var hasPriv = false;
							for (var i = 0; i < reqPrivs.length; i++) {
								if(privs.has(reqPrivs[i]))
								{
									hasPriv = true;
									i = reqPrivs.length+1;
								}
							};

							if(!hasPriv)
							{
								configOptionTabs.find("#"+that.find('a:first').attr("rel")).remove();
								that.remove();
								hasChanges = true;
							}
						});
						if(!privs.has("connect") && !privs.has("log_access"))
						{
							adminPanel.noLogAccess = true;
							if(window.panelServerInfo)
								$("#serverLog", panelServerInfo._panel).remove();
						}
						if(hasChanges && !internal)
						{
							try{
								configOptionTabs.tabs("destroy");
							}catch(ex){}
							configOptionTabs.tabs({active: 0});
						}
					}
					window.adminPanel.applyPrivsToAdminPanel = applyPrivsToAdminPanel;
					applyPrivsToAdminPanel();
				}
			}
			topSwitchButtons.show();
		};

        // Run initializer
		base.init();
    };

    $.sessionChecker.defaultOptions = {
		dataStorageKey : "sessionSeconds",
		startingPointVal : "-1",
		localTimerPeriod : 1000,
		sessionTimerPeriod : 50000,
		noteTextTemplate : "(Session timeout in %time%.)",
		ajaxURL : "/WebInterface/function/",
		serverCommand : "getSessionTimeout",
		requestType : "GET",
		callBack : function(){}
    };

    $.fn.sessionChecker = function(options){
        return this.each(function(){
            (new $.sessionChecker(this, options));
        });
    };
})(jQuery);