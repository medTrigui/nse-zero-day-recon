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

var tempAccounts = {
	ajaxCallURL : "/WebInterface/function/",
	ajaxCallURLBase : "/WebInterface/function/",
	refreshInfoInterval : 5000,
	UI :
	{
		initEvents : function()
		{
			$(".backToTop", "#GUIAdmin").unbind().click(function () {
				$('html,body').animate({
					scrollTop: 0
				}, 500, false);
				return false;
			});

			//Keep this line at the end of this method, it will bind click at the end of all bindings
			$("#topNavigation, ul#context-menu").find("a").click(function(){
				contextMenu.hide();
				$(document).trigger("click");
			});

			$("#mainServerInstance").unbind().change(function(){
				localStorage.setItem("mainServerInstance", $(this).val());
				window.location = window.location;
			});
		},
		multiOptionControlDataBind : function(dataSet, dataColumn, control, bindItemMethod, directData, noSubitem, reverse){
			var dataItem = directData ? dataSet : dataSet[dataColumn];
			control.empty();
			if(dataItem)
			{
				if(!noSubitem)
				{
					dataItem = dataItem[dataColumn + "_subitem"];
				}
				if(dataItem)
				{
					function addNewOption(curItem)
					{
						var newControl = bindItemMethod(curItem);
						if(!newControl)return;
						if(reverse)
							control.prepend(newControl);
						else
							control.append(newControl);
						newControl.data("controlData", curItem);
					}
					if(dataItem.length && dataItem.length>0 && !noSubitem)
					{
						for(var i=0; i < dataItem.length; i++)
						{
							addNewOption(dataItem[i]);
						}
					}
					else
					{
						addNewOption(dataItem);
					}
				}
			}
		}
	},
	data:
	{
		getXMLPrefsDataFromServer : function(dataKey, callback)
		{
			var items = [];
			crushFTP.data.loadAllPrefs(function(data){
				var response = $(data).find("response").text();
				if(response == "FAILURE:Access Denied."){
					$('#access-denied').show();
					$("#tempAccounts").hide();
				}
				if(data && data.getElementsByTagName && data.getElementsByTagName("result_value") && data.getElementsByTagName("result_value").length > 0)
				{
					data = data.getElementsByTagName("result_value")[0];
					$(data).find("reportSchedules").find("usernames").each(function(){
						var users = [];
						$(this).find("usernames_subitem").each(function(){
							users.push($(this).text());
						});
						$(this).text(users.join(","));
					});
					items = $.xml2json(data);
					crushFTP.storage(dataKey, items);
					crushFTP.storage(dataKey + "_RAW", data);
					if(callback){
						callback(data);
					}
				}
			});
		},
		updateLocalPrefs : function(callback)
		{
			var mainServerInstance = localStorage.getItem("mainServerInstance");
			if(mainServerInstance!=null && mainServerInstance.length>0 && mainServerInstance.toLowerCase()!= "main")
			{
				crushFTP.ajaxCallURL = tempAccounts.ajaxCallURL = tempAccounts.ajaxCallURLBase + mainServerInstance + "/";
			}
			tempAccounts.data.getXMLPrefsDataFromServer("GUIXMLPrefs", function(){
				if(callback)
				{
					callback();
				}
			});
		},
		bindValuesFromJson : function(_panel, curItem, attrToUse, ignoreUnderscore)
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
						$(this).val(curVal).trigger("change");
					}
					else
					{
						$(this).val("").trigger("change");
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
	dataRepo :
	{
		refreshServerInfo : function(callback)
		{
			function fetchServerInfo(callback)
			{
				var serverInfoItems = ["machine_is_linux","machine_is_solaris","machine_is_unix","machine_is_windows","machine_is_x","machine_is_x_10_5_plus","sub_version_info_str","version_info_str"];
				var curItem = 0;
				var arr = {};
				for (var i = 0; i < serverInfoItems.length; i++) {
					var key = serverInfoItems[i];
					function getServerItem(key){
						crushFTP.data.getServerItem("server_info/" + key, function(server_info){
							var response_status = $(server_info).find("response_status").text();
							if(response_status)
							{
								arr[key] = response_status;
							}
							curItem++;
							if(curItem>serverInfoItems.length-1){
								callback(arr);
							}
						});
					};
					getServerItem(key);
				}
			}
			fetchServerInfo(function(server_info){
				if(server_info)
				{
					crushFTP.storage("serverInfo", server_info);
					if(server_info)
					{
						var versionInfo = "";
						if(server_info.version_info_str)
							versionInfo = server_info.version_info_str;
						if(server_info.sub_version_info_str)
						{
							var subversion = server_info.sub_version_info_str;
							if(subversion.indexOf("_")==0)
								subversion = subversion.substr(1, subversion.length);
							versionInfo += " Build : " + subversion;

							$("#crushVersionInfo").text(versionInfo);
						}
						if(server_info.machine_is_linux == "true")
						{
							$.CrushFTPOS = "linux";
						}
						else if(server_info.machine_is_solaris == "true")
						{
							$.CrushFTPOS = "solaris";
						}
						else if(server_info.machine_is_unix == "true")
						{
							$.CrushFTPOS = "unix";
						}
						else if(server_info.machine_is_windows == "true")
						{
							$.CrushFTPOS = "windows";
						}
						else if(server_info.machine_is_x == "true")
						{
							$.CrushFTPOS = "mac";
						}
					}
					if(callback){
						callback(server_info);
						return;
					}
				}
				if(callback){
					callback(server_info);
				}
				return;
			});
		},
		getSeverLog : function(callback)
		{
			crushFTP.data.serverRequest({
				command: "getServerItem",
				key : "server_info/server_log"
			},
			function(data){
				var items = false;
				if(data && typeof data.getElementsByTagName != "undefined")
				{

					if(data.getElementsByTagName("result_value") && data.getElementsByTagName("result_value").length > 0)
					{
						data = data.getElementsByTagName("result_value")[0];
						var log = [];
						$(data).find("result_value_subitem").each(function(){
							log.push($(this).text());
						});
						if(callback){
							if(crushFTP.buggyBrowser)
								callback(log.join("\r\n"));
							else
								callback(log.join("\n"));
							return;
						}
					}
				}
				if(callback){
					callback(items);
				}
				return;
			});
		},
		refreshUserSessonList : function(prefix, callback)
		{
			prefix = prefix || "";
			crushFTP.data.serverRequest({
				command: "getSessionList",
				session_list : prefix + "user_list"
			},
			function(data){
				var items = false;
				if(data && typeof data.getElementsByTagName != "undefined")
				{
					if(data.getElementsByTagName("session_list") && data.getElementsByTagName("session_list").length > 0)
					{
						data = data.getElementsByTagName("session_list")[0];
						items = $.xml2json(data);
						crushFTP.methods.rebuildSubItems(items, "session_list");
						if(callback){
							callback(items);
							return;
						}
					}
				}
				if(callback){
					callback(items);
				}
				return;
			});
		},
		getUserSessionInfo : function(prefix, index, callback)
		{
			prefix = prefix || "";
			if(index<0)return;
			crushFTP.data.serverRequest({
				command: "getServerItem",
				key : "server_info/"+prefix+"user_list/" + index
			},
			function(data){
				var items = false;
				if(data)
				{
					if(data.getElementsByTagName("result_value") && data.getElementsByTagName("result_value").length > 0)
					{
						data = data.getElementsByTagName("result_value")[0];
						if(callback){
							callback(data);
							return;
						}
					}
				}
				if(callback){
					callback(items);
				}
				return;
			});
		},
		refreshServerGroupList : function(callback)
		{
			crushFTP.data.serverRequest({
				command: "getServerItem",
				key : "server_settings/server_groups"
			},
			function(data){
				var items = false;
				if(data)
				{
					if(data.getElementsByTagName("result_value") && data.getElementsByTagName("result_value").length > 0)
					{
						data = data.getElementsByTagName("result_value")[0];
						items = $.xml2json(data);
						crushFTP.methods.rebuildSubItems(items, "result_value");
						crushFTP.storage("serverGroups", items);
						if(callback){
							callback(items);
							return;
						}
					}
				}
				if(callback){
					callback(items);
				}
				return;
			});
		},
		bindUserList : function (callback)
		{
			var serverGroup = $("#userConnectionGroups").val() || "MainUsers";
			crushFTP.data.serverRequest({
				command: 'getUserList',
				serverGroup : serverGroup
			},
			function(data){
				if(data)
				{
					var users = $.xml2json(data, true);
					if(users && users.response_data && users.response_data.length>0 && users.response_data[0].user_list && users.response_data[0].user_list.length>0)
					{
						var userList = users.response_data[0].user_list[0].user_list;
						if(userList && userList.length>0 && userList[0].user_list_subitem && userList[0].user_list_subitem.length>0)
						{
							userList = userList[0].user_list_subitem;
							if(callback)
							{
								callback(userList);
							}
						}
					}
				}
				else
				{
					crushFTP.UI.growl("Failure", DOMPurify.sanitize($(data).text()), true, true);
				}
			});
		},
		bindConnectionGroupList : function(allPrefs)
		{
			var prefs = $.xml2json(allPrefs, true);
			var userConnectionGroups = $("#userConnectionGroups").empty();
			if(prefs && prefs.server_groups && prefs.server_groups.length>0 && prefs.server_groups[0].server_groups_subitem && prefs.server_groups[0].server_groups_subitem.length>0)
			{
				crushFTP.methods.rebuildSubItems(prefs.server_groups, "server_groups");
				var serverGroupList = prefs.server_groups[0]["server_groups_subitem"];
				for(var i=0;i<serverGroupList.length;i++)
				{
					var name = serverGroupList[i].text;
					userConnectionGroups.append("<option val='"+name+"'>"+name+"</option>");
				}
			}
			else
			{
				userConnectionGroups.append("<option val='MainUsers'>MainUsers</option>");
			}
		},
		getCurrentUserInformation : function(callback)
		{
			crushFTP.data.serverRequest({
					command: 'getUserInfo',
					path : "/",
					random: Math.random()
				},
				function(data){
					if(data)
					{
						callback(data);
					}
				}
			);
		},
		getUserInfo : function(user, callback, trackInfo, returnDataOnly) {
			var context = this;
			function getUserCall()
			{
				var serverGroup = $("#userConnectionGroups").val() || "MainUsers";
				crushFTP.data.serverRequest({
					command: 'getUser',
					serverGroup : serverGroup,
					username : user
				},
				function(data){
					if(data)
					{
						var usersData = $.xml2json(data, false);
						if(usersData && usersData["response_status"] && usersData["response_status"]== "OK")
						{
							if(callback)
							{
								var userItems = usersData.response_data.user_items;
								if(!returnDataOnly)
								{
									crushFTP.storage("currentUser", userItems);
									tempAccounts.isUserAdmin = false;
									tempAccounts.isUserLimitedAdmin = false;
									if(userItems && userItems.user && userItems.user.site)
									{
										if(userItems.user.site.indexOf("(CONNECT)")>=0)
										{
											tempAccounts.isUserAdmin = true;
										}
										else if(userItems.user.site.indexOf("(USER_ADMIN)")>=0)
										{
											tempAccounts.isUserLimitedAdmin = true;
										}
									}
									crushFTP.storage("currentUserXML", data);
									if(trackInfo)
									{
										tempAccounts.data.storeCurrentUserInfo(user);
										tempAccounts.data.bindGroupDetails();
									}
								}
								callback(userItems, data);
							}
						}
						else
						{
							crushFTP.UI.growl("Failure", DOMPurify.sanitize($(data).text()), true, true);
							if(trackInfo)
							{
								tempAccounts.data.storeCurrentUserInfo(false);
							}
							if(callback)
							{
								callback(false);
							}
						}
					}
					else
					{
						crushFTP.UI.growl("Failure", DOMPurify.sanitize($(data).text()), true, true);
						if(trackInfo)
						{
							tempAccounts.data.storeCurrentUserInfo(false);
						}
						if(callback)
						{
							callback(false);
						}
					}
				});
			}
			if($.trim(user).toLowerCase() == "default" || returnDataOnly)
			{
				getUserCall();
			}
			else
			{
				tempAccounts.dataRepo.refreshDefaultUserData(function(info, xml){
					if(info)
					{
						getUserCall();
					}
					else
					{
						if(callback)
						{
							callback(false);
						}
					}
				});
			}
		},
		//Expects user name, action as new, update or delete, a callback function and a flag if to track current user or not
		saveUserInfo : function(user, vfs_items, permissions, userName, action, callback, noGrowl) {
			var context = this;
			var serverGroup = $("#userConnectionGroups").val() || "MainUsers";
			var objData = {
				command: 'setUserItem',
				data_action : action || 'new',
				serverGroup : serverGroup,
				username : userName
			};
			if(action == "delete")
			{
				delete objData.username;
				objData.usernames = userName;
			}
			if(user)
			{
				objData.user = user;
				objData.xmlItem = "user";
			}
			if(vfs_items)
			{
				objData.vfs_items = vfs_items;
			}
			if(permissions)
			{
				objData.permissions = permissions;
			}
			crushFTP.data.serverRequest(objData,
			function(data, XMLHttpRequest, textStatus, errorThrown){
				if(data)
				{
					var usersData = $.xml2json(data, false);
					if(usersData && usersData["response_status"] && usersData["response_status"]== "OK")
					{
						if(callback)
						{
							callback(data);
						}
					}
					else
					{
						if(!noGrowl)
						{
							crushFTP.UI.growl("Failure", DOMPurify.sanitize($(data).text()), true, true);
						}
						if(callback)
						{
							callback(false, data);
						}
					}
				}
				else
				{
					if(!noGrowl)
					{
						crushFTP.UI.growl("Failure", DOMPurify.sanitize($(data).text()), true, true);
					}
					if(callback)
					{
						callback(false, XMLHttpRequest, textStatus, errorThrown);
					}
				}
			});
		},
		saveGroupInfo : function(groupXML, userName, action, callback, noGrowl) {
			var context = this;
			var serverGroup = $("#userConnectionGroups").val() || "MainUsers";
			var objData = {
				command: 'setUserItem',
				data_action : action || 'new',
				serverGroup : serverGroup,
				username : userName,
				xmlItem : "groups",
				groups : groupXML
			};
			crushFTP.data.serverRequest(objData,
			function(data, XMLHttpRequest, textStatus, errorThrown){
				if(data)
				{
					var usersData = $.xml2json(data, false);
					if(usersData && usersData["response_status"] && usersData["response_status"]== "OK")
					{
						if(callback)
						{
							callback(data);
						}
					}
					else
					{
						if(!noGrowl)
						{
							crushFTP.UI.growl("Failure", DOMPurify.sanitize($(data).text()), true, true);
						}
						if(callback)
						{
							callback(false, data);
						}
					}
				}
				else
				{
					if(!noGrowl)
					{
						crushFTP.UI.growl("Failure", DOMPurify.sanitize($(data).text()), true, true);
					}
					if(callback)
					{
						callback(false, XMLHttpRequest, textStatus, errorThrown);
					}
				}
			});
		},
		getGroupInfo : function(type, serverGroup, callback) {
			var context = this;
			type = type || "group";
			serverGroup = serverGroup || "MainUsers";
			crushFTP.data.serverRequest({
				command: 'getUserXML',
				serverGroup : serverGroup,
				xmlItem : type
			},
			function(data){
				if(data)
				{
					var usersData = $.xml2json(data, false);
					if(usersData && usersData["response_status"] && usersData["response_status"]== "OK")
					{
						var response = usersData.response_data;
						if(callback)
						{
							callback(response, data);
						}
					}
				}
				else
				{
					crushFTP.UI.growl("Failure", DOMPurify.sanitize($(data).text()), true, true);
					if(callback)
					{
						callback(false);
					}
				}
			});
		},
		refreshDefaultUserData : function(callback){
			tempAccounts.dataRepo.getUserInfo("default", function(info, xml){
				if(info)
				{
					crushFTP.storage("defaultUser", info);
					crushFTP.storage("defaultUserXML", xml);
					if(callback)
					{
						callback(info, xml);
					}
				}
				else
				{
					if(callback)
					{
						callback(false);
					}
				}
			});
		}
	},
	methods :
	{
		initGUI : function(){
			tempAccounts.placeHolder = $("#tempAccountHolder");
			tempAccounts.GUIAdmin = $("#GUIAdmin");
			$(document).data("pageTitle", document.title);
			tempAccounts.dataRepo.refreshServerInfo();
			tempAccounts.GUIAdmin.find("#tempAccounts").block({
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
			var logoElem = $("#logo", "#header").hide();
			var mainServerInstance = localStorage.getItem("mainServerInstance");
			crushFTP.data.serverRequest({
				command: 'getServerItem',
					key: "server_settings/server_list",
					random: Math.random()
				},
				function(data){
					var _mainServerInstance = $("#mainServerInstance").empty();
					if(data)
					{
						$(data).find("result_value_subitem").each(function(){
							var type = $(this).find("serverType").text();
							if(type.toLowerCase().indexOf("dmz") >= 0)
							{
								var instance = $(this).find("server_item_name").text();
								if(!instance) instance = $(this).find("ip").text() + ":" + $(this).find("port").text();
								if(instance && instance.length>0)
								{
									if(instance.toLowerCase() == "main")
										_mainServerInstance.append("<option value=''>"+instance+"</option>");
									else
										_mainServerInstance.append("<option value='"+instance+"'>"+instance+"</option>");
								}
							}
						});
						if(_mainServerInstance.find("option").length>0)
						{
							_mainServerInstance.prepend("<option value=''>Main</option>")
							if(mainServerInstance != null)
							{
								if(_mainServerInstance.find("option[value='"+mainServerInstance+"']").length>0)
								{
									if(mainServerInstance.length>0 && mainServerInstance.toLowerCase()!= "main")
										crushFTP.ajaxCallURL = tempAccounts.ajaxCallURL = tempAccounts.ajaxCallURLBase + mainServerInstance + "/";
									_mainServerInstance.val(mainServerInstance);
								}
								else
								{
									crushFTP.ajaxCallURL = tempAccounts.ajaxCallURL = tempAccounts.ajaxCallURLBase;
									_mainServerInstance.val("");
									localStorage.setItem("mainServerInstance", "");
								}
							}
							else{
								_mainServerInstance.val("");
							}
						}
						else
						{
							_mainServerInstance.val("");
							_mainServerInstance.parent().remove();
						}
				}
				tempAccounts.data.getXMLPrefsDataFromServer("GUIXMLPrefs", function(allPrefs){
					blockMsg.text("Loading Current User Information..");
					tempAccounts.dataRepo.getCurrentUserInformation(function(data){
						$(document).data("username", $(data).find("username").text());
						var customizations = [];
						var logo = "";
						$(data).find("customizations_subitem").each(function(){
							var curObj = {
								key : $(this).find("key").text(),
								value : $(this).find("value").text()
							};
							customizations.push(curObj);
							if(curObj.key && curObj.key.toLowerCase() == "logo")
							{
								logo = curObj.value;
							}
							else if(curObj.key && curObj.key.toLowerCase() == "date_format_text")
							{
								var val = curObj.value;
								if(val)
			                    {
			                        window.DateFormat = val.replace("MMM","M").replace("MM","mm").replace(" hh:MM aa", "");
			                        window.datetimepickerDateFormat = window.DateFormat.toLowerCase().replace("yyyy","yy");
			                    }
							}
							else if(curObj.key && curObj.key.toLowerCase() == "shareddmmyyyy" && !window.DateFormat)
							{
								var val = curObj.value.toLowerCase();
								if(val == "true")
			                    {
			                        window.DateFormat = "dd/mm/yyyy";
			                        window.datetimepickerDateFormat = window.DateFormat.toLowerCase().replace("yyyy","yy");
			                    }
							}
							else if(curObj.key && curObj.key.toLowerCase() == "shareyyyymmdd" && !window.DateFormat)
							{
								var val = curObj.value.toLowerCase();
								if(val == "true")
			                    {
			                        window.DateFormat = "yyyy/mm/dd";
			                        window.datetimepickerDateFormat = window.DateFormat.toLowerCase().replace("yyyy","yy");
			                    }
							}
						});
						if(logo)
						{
							if(logo.toLowerCase().indexOf("http://")<0 && logo.toLowerCase().indexOf("https://")<0)
							{
								logo = "/WebInterface/images/" + logo;
							}
							if(logoElem.find("img").length>0)
								logoElem.find("img").replaceWith("<img src='" + logo+ "' />");
							else
								logoElem.append("<img src='" + logo + "' />");
						}
						logoElem.show();
						blockMsg.text("Loading Existing Accounts Information..");
						tempAccounts.methods.loadPanel($("#accountsPanel"), "Accounts", false, function(flag){
							tempAccounts.GUIAdmin.find("#tempAccounts").unblock();
						});
					});
				});
			}, tempAccounts.ajaxCallURLBase, "POST");
			crushFTP.UI.hideLoadingIndicator();
			tempAccounts.UI.initEvents();

			/*Session checker will get version information, based on it new features will be show/hide/initiated*/
			$(".enterpriseFeature").hide();
			$("#SessionSeconds").sessionChecker({
				callBack:function(){
					if ($(document).data("app_enterprise")) //show new features
					{
						$(".enterpriseFeature").show();
					}
					if (($(document).data("app_version")+"").indexOf("6") >= 0) //show new features
					{
					}
					else
					{
						crushFTP.userLogin.userLoginStatusCheckThread();
					}
				}
			});
		},
		loadPanel : function(panelPlaceHolder, panel, initParam, callback){
			crushFTP.UI.notification(false);
			if(panel && panel.length>0)
			{
				$.ajax({
					url : "panels/"+panel+"/index.html?random="+Math.random(),
					success : function(response) {
						var curPanel = $(response);
						panelPlaceHolder.append(curPanel);
						buildButtons(curPanel);
						$(".tabs", curPanel).tabs();
						$("#configOptionTabs").tabs();
						$.getScript("panels/"+panel+"/interface.js?random="+Math.random(), function() {
							initParam = initParam || false;
							var initScript = "panel" + panel + ".init();";
							if(initParam)
							{
								initScript = "panel" + panel + ".init('"+initParam+"');";
							}
							try{
								eval(initScript);
								tempAccounts.methods.initLayoutEvents(curPanel, panel);
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
						crushFTP.UI.notification(msg, true);
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
			context = context || tempAccounts.placeHolder;
			tempAccounts.methods.itemsChanged(false);
			context.form();
			$("#ui-datepicker-div").hide();
			if(context.find(".panelFormFields").length>0)
			{
				tempAccounts.methods.listenChanges(context.find(".panelFormFields"));
			}
			else
			{
				tempAccounts.methods.listenChanges(context);
			}
			context.unbind("changed").bind("changed", function(){
				tempAccounts.methods.itemsChanged(true);
			});
			vtip(context);
			$("ol.selectable", context).selectable({
				selected: function(event, ui) {
					var selected = $(ui.selected);
					selected.parent().find(".ui-widget-header").removeClass("ui-widget-header");
					selected.addClass("ui-widget-header");
					if(selected.is("li"))
					{
						try{
							var events = $(this).data('events');
							if(events && events.onSelect)
							{
								$(this).trigger("onSelect", [$(this), selected]);
							}
						}
						catch(ex){
							if(ex && ex.toString() != "")
							{
								crushFTP.UI.growl("Error", DOMPurify.sanitize(ex), true);
							}
						}
					}
					return false;
				}
			});
		},
		listenChanges : function(context){
			context = context || tempAccounts.placeHolder;
			context.find("input:not(.ignoreChange), select:not(.ignoreChange), textarea:not(.ignoreChange)").change(function(){
				tempAccounts.methods.itemsChanged(true);
			});
			context.find("input[type='text']:not(.ignoreChange), textarea:not(.ignoreChange)").bind("textchange", function(){
				tempAccounts.methods.itemsChanged(true);
			});
		},
		itemsChanged : function(flag){
			var context = tempAccounts.placeHolder;
			if(context)
			{
				context.data("hasChanged", flag);
			}
		},
		confirmExit : function(){
			if(tempAccounts.placeHolder.data("hasChanged"))
			{
				return "If you navigate away, you will lose your unsaved changes. Do you want to continue?";
			}
		},
		jsonToXML : function(json, flag)
		{
			if(!json) return "";
			var xml = [];
			for(var item in json)
			{
				var curItem = json[item];
				if(!$.isFunction(curItem))
				{
					if(curItem[0] && curItem[0][item + "_subitem"])
					{
						var subItem = curItem[0][item + "_subitem"];
						xml.push("<"+item+"  type=\"vector\">");
						if(subItem && subItem.length>0)
						{
							var itemTypeText = "";
							var subItemType = subItem[0].type;
							if(subItemType)
							{
								if($.isArray(subItemType) && subItemType.length>1)
								{
									itemTypeText = "type =\""+subItemType[1]+"\"";
								}
								else if(typeof subItemType === "string")
								{
									itemTypeText = "type =\""+subItemType+"\"";
								}
							}
							if($.isArray(subItem) && subItem.length>1)
							{
								for(var subSubItem in subItem)
								{
									var curSubItem = subItem[subSubItem];
									if(!$.isFunction(curSubItem))
									{
										xml.push("<"+item+"_subitem "+itemTypeText+">" + tempAccounts.methods.jsonToXML(curSubItem, true) + "</"+item+"_subitem>");
									}
								}
							}
							else
							{
								xml.push("<"+item+"_subitem "+itemTypeText+">" + tempAccounts.methods.jsonToXML(subItem, true) + "</"+item+"_subitem>");
							}
						}
						xml.push("</"+item+">");
					}
					else
					{
						var textVal = curItem;
						if($.isArray(textVal))
						{
							if(textVal.length>0)
							{
								textVal = textVal[0];
								if(typeof textVal.text != "undefined")
								{
									textVal = textVal.text;
								}
								else if(typeof textVal != "string")
								{
									textVal = "";
								}
							}
							else
							{
								textVal = "";
							}
						}
						else if(flag)
						{
							xml.push(tempAccounts.methods.jsonToXML(curItem));
						}

						if(item.toLowerCase() != "type" && typeof curItem != "string")
						{
							if(typeof textVal =="string")
							{
								xml.push("<"+item+">" + escape(textVal) + "</"+item+">");
							}
						}
						else
						{
							if(typeof curItem != "string")
							{
								textVal = curItem[0].text;
								if(textVal && typeof textVal == "string")
								{
									xml.push("<"+item+">" + escape(textVal) + "</"+item+">");
								}
							}
						}
					}
				}
			}
			return xml.join("\r\n");
		}
	}
};