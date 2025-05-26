/*!
* CrushFTP Web GUI interface methods for User Manager
*
* http://crushFTP.com/
*
* Copyright @ CrushFTP
*
* Date: Thu, Aug 11 2011
*
* Author: Vipul Limbachiya
*
* http://vipullimbachiya.com
*/

window.dataBindEvents = [];

var crushSync = {
	ajaxCallURL : "/WebInterface/function/",
	UI :
	{
		initEvents : function()
		{
			$(".backToTopE", "#GUIAdmin").unbind().click(function () {
				$('html,body').animate({
					scrollTop: 0
				}, 500, false);
				return false;
			});
		}
	},
	data:
	{
		getSyncData : function(callback)
		{
			var obj = {
				command:"getSyncAgents",
                random: Math.random()
			};
			crushFTP.data.serverRequest(obj,
				function(msg){
					if(callback)
						callback(msg);
			});
		},
		bindValuesFromJson : function(_panel, curItem, attrToUse, ignoreUnderscore, noChangeTrigger)
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
			_panel.find("input[type='text']:not(.ignoreBind),input[type='password']:not(.ignoreBind), textarea:not(.ignoreBind), select:not(.ignoreBind)").each(function(){
				if($(this).attr(attrToUse))
				{
					if(curItem)
					{
						var curData = crushFTP.data.getValueFromJson(curItem, elemNameWithoutUnderScore($(this).attr(attrToUse)));
						var curVal = curData.value || curData;
						if(!noChangeTrigger)
							$(this).val(curVal).trigger("change");
						else
							$(this).val(curVal);
					}
					else
					{
						if(!noChangeTrigger)
							$(this).val("").trigger("change");
						else
							$(this).val("");
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
						if(!noChangeTrigger)
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
						if(!noChangeTrigger)
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
		},
		buildXMLToSubmitForm : function(_panel, includeRadio, attrToUse, ignoreNullValue)
		{
			attrToUse = attrToUse || "id";
			var xmlString = [];
			_panel.find("input[type='text']:not(.ignoreBind, .excludeXML),input[type='password']:not(.ignoreBind, .excludeXML), textarea:not(.ignoreBind, .excludeXML), select:not(.ignoreBind, .excludeXML)").each(function(){
				if($(this).attr(attrToUse))
				{
					var curVal = $(this).val();
					if($(this).hasClass('urlWithParams'))
					{
						curVal = $(this).data("realURL") || $(this).val();
					}
					if(!ignoreNullValue)
						xmlString.push("<"+$(this).attr(attrToUse)+">"+crushFTP.methods.htmlEncode(curVal)+"</"+$(this).attr(attrToUse)+">");
					else if(curVal.length>0)
						xmlString.push("<"+$(this).attr(attrToUse)+">"+crushFTP.methods.htmlEncode(curVal)+"</"+$(this).attr(attrToUse)+">");
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
	},
	methods :
	{
		initGUI : function(){
			crushSync.placeHolder = $("#crushSyncHolder");
			crushSync.GUIAdmin = $("#GUIAdmin");
			$(document).data("pageTitle", document.title);
			crushSync.GUIAdmin.find("#crushSync").block({
				message:  'Loading..',
				css: {
					border: 'none',
					padding: '10px',
					width : '200px',
					backgroundColor: '#000',
					'-webkit-border-radius': '10px',
					'-moz-border-radius': '10px',
					opacity: .5,
					color: '#fff',
					'text-align':'left'
				}
			});
			var blockMsg = $(".blockMsg");
			var mainServerInstance = $.cookie("mainServerInstance");
			$("#loadingIndicator").dialog({
				modal: false});
			crushFTP.UI.showLoadingIndicator(localizationValue("syncManagerPleaseWaitText", "Please Wait.."));
			blockMsg.text("Loading Current User Information..");
			blockMsg.text("Loading Existing Accounts Information..");
			crushSync.methods.loadPanel($("#accountsPanel"), "Accounts", false, function(flag){
				crushSync.GUIAdmin.find("#crushSync").unblock();
				crushFTP.UI.hideLoadingIndicator();
				setTimeout(function(){
					applyLocalizations();
				}, 200);
			});

			crushSync.UI.initEvents();

			/*Session checker will get version information, based on it new features will be show/hide/initiated*/
			$(".enterpriseFeature").hide();
			$("#SessionSeconds").sessionChecker({
				callBack:function(){
					if (($(document).data("app_version")+"").indexOf("6") >= 0) //show new features
					{
						if ($(document).data("app_enterprise")) //show new features
						{
							$(".enterpriseFeature").show();
						}
					}
					else
					{
						crushFTP.userLogin.userLoginStatusCheckThread();
					}
				}
			});
		},
		loadPanel : function(panelPlaceHolder, panel, initParam, callback){
			if(panel && panel.length>0)
			{
				$.ajax({
					url : "panels/"+panel+"/index.html?random="+Math.random(),
					success : function(response) {
						var curPanel = $(response);
						panelPlaceHolder.append(curPanel);
						buildButtons(curPanel);
						$.getScript("panels/"+panel+"/interface.js?random="+Math.random(), function() {
							initParam = initParam || false;
							var initScript = "panel" + panel + ".init();";
							if(initParam)
							{
								initScript = "panel" + panel + ".init('"+initParam+"');";
							}
							try{
								eval(initScript);
								crushSync.methods.initLayoutEvents(curPanel, panel);
								if(callback)
									callback(true);
							}
							catch(ex){
								if(ex && ex.toString() != "")
								{
									crushFTP.UI.growl("Error", "panel" +panel + ".init(); " + ex, true);
								}
								if(callback)
									callback(false);
							}
						});
					},
					error : function(xhr)
					{
						var msg = "Sorry but there was an error: " + xhr.status + " " + xhr.statusText + " while loading panel : " + panel;
						crushSync.UI.notification(msg, true);
						if(callback)
							callback(false);
					}
				});
			}
			else
			{
				if(callback)
				{
					callback(false);
				}
			}
			return false;
		},
		initLayoutEvents : function(context, panel){
			context = context || crushSync.placeHolder;
			vtip(context);
		}
	}
};