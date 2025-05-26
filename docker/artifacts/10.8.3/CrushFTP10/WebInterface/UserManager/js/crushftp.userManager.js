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

var userManager = {
	panelsToLoad : ["Setup", "Settings", "Restrictions", "Admin", "Events", "WebInterface", "Tunnels", "Misc"],
	usernamesToIgnorePasswordValidation : ["anonymous", "template", "tempaccount", "default"],
	specialCharactersInUserPass : "!$^*()_-=[]{};,.<>~@#",
	notAllowedCharsInUserName : "&:\\/\;<>?+=%#'*",
	notAllowedCharsInGroupName : ":/\\&#?<>'\"",
	notAllowedCharsInDirName : ":/\\#?<>",
	ajaxCallURL : "/WebInterface/function/",
	ajaxCallURLBase : "/WebInterface/function/",
	indicatorHTML : "<div class='loadingIndicator'><img src='/WebInterface/Resources/images/process_indicator.gif' alt='loding indicator' /></div>",
	buggyBrowser : $.browser.msie && $.browser.version <= 8,
	defaultUserToLoad : false,
	extraVFSServerGroup : "extra_vfs",
	importColumnsValues : [],
	defaultPanelToShow : false,//"Misc",
	makeVFSOnly : function(user)
	{
		userManager.disableBatchUpdate = true;
		userManager.onlyVFS = true;
		userManager.defaultUserToLoad = user;
		$("body").addClass("onlyVFS");
		$("#welcomeNote").find(".msgText").text("Loading user : " + user + ". Please wait...");
		$("#userManagerHeader").text("User VFS Settings").hide();
		userManager.panelsToLoad = ["Setup"];
		var _serverGroup = $.trim(crushFTP.methods.queryString("serverGroup"));
		if(_serverGroup && _serverGroup.length>0)
			userManager.onlyVFSServerGroup = _serverGroup;
	},
	UI :
	{
		multiOptionControlDataBind : function(dataSet, dataColumn, control, bindItemMethod, setInheritedPropery, postBindMethod, noSubitem){
			var dataItem = dataSet[dataColumn];
			if(dataItem)
			{
				var dataInheritedFrom = dataItem["inheritedFrom"];
				if(typeof dataItem == "string")
				{
					var curData = userManager.methods.seperateValueAndInheritValue(crushFTP.data.getValueFromJson(dataSet, dataColumn));
					var curVal = curData.value;
					dataInheritedFrom = curData.inherit || dataInheritedFrom || "default";
				}
				if(dataInheritedFrom)
				{
					var parent = $(control).closest("fieldset").attr("inheritedFrom", dataInheritedFrom);
					if(!dataInheritedFrom)
					{
						parent.removeAttr("inheritedFrom");
					}
					if(!parent.hasClass("inheritValSet"))
					{
						parent.addClass("inheritValSet").find("legend").text(dataInheritedFrom);
					}
				}
				if(!noSubitem)
				{
					dataItem = dataItem[dataColumn + "_subitem"];
				}
				if(dataItem)
				{
					control.empty();
					if(postBindMethod)
					{
						postBindMethod();
					}
					function addNewOption(curItem)
					{
						var newControl = bindItemMethod(curItem);
						if(!newControl)return;
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
			else
			{
				dataInheritedFrom = "default";
				var parent = $(control).closest("fieldset").attr("inheritedFrom", dataInheritedFrom);
				if(!dataInheritedFrom)
				{
					parent.removeAttr("inheritedFrom");
				}
				if(!parent.hasClass("inheritValSet"))
				{
					parent.addClass("inheritValSet").find("legend").text(dataInheritedFrom);
				}
			}
			if(setInheritedPropery)
			{
				userManager.data.setInheritPropertyOfSection(control, dataColumn, true);
			}
		},
		togglePanels : function(panel) {
			if(!panel)return;
			$('.checkboxArea>:checkbox', panel).each(function () {
				$(this).unbind("change").change(function () {
					if($(this).closest("td").hasClass("noInherit"))
					{
						crushFTP.UI.checkUnchekInput($(this),true);
						return;
					}
					var batchSwitch = $(this).closest("td").find("span.batch");
					if(batchSwitch.length>0)
					{
						var chkBox = $(this);
						var override = chkBox.is(":checked");
						var label = override ? "" : " not ";
						jConfirm("Are you sure you wish set all users in the list"+label+" to override this setting?<br><br>","Confirm", function(flag){
							if(!flag)
							{
								batchSwitch.removeClass("batch").parent().parent().removeClass("ui-state-hover");
								return;
							}
							userManager.data.saveBatchInfo(function(flag){
								if(flag)
								{
									batchSwitch.removeClass("batch").parent().parent().removeClass("ui-state-hover");
								}
							}, !override, chkBox);
						},{
							okButtonText : "Yes, to all listed users",
							cancelButtonText : "No, only current user : " + $(document).data("userName")
						});
					}
					userManager.UI.disableUncheckedPanel($(this));
				}).trigger("change");
			});
		},
		disableUncheckedPanel : function(checkbox, inheritedFrom) {
            if(!checkbox)return;
            if($(checkbox).closest('fieldset').is("#vfsItemsListingAndOptions") && inheritedFrom)
            {
                checkbox.closest("fieldset").attr("inheritedFrom", inheritedFrom);
            }
            inheritedFrom = inheritedFrom || "default";
            if(checkbox.closest("fieldset").attr("inheritedFrom"))
            {
                inheritedFrom = checkbox.closest("fieldset").attr("inheritedFrom");
            }
            inheritedFrom = inheritedFrom || "default";
			if (checkbox.is(':checked')) {
				checkbox.closest("tr").find("td.settingsArea>div:first").unblock();
				checkbox.closest("fieldset").find("legend").remove();
			} else {
				checkbox.closest("tr").find("td.settingsArea>div:first").block({ message: null, overlayCSS: { opacity: 0.1, cursor: 'normal'} });
				if(checkbox.closest("fieldset").find("legend").length==0)
				{
					checkbox.closest("fieldset").addClass('noForm').prepend("<legend>"+inheritedFrom+"</legend>");
				}
				else
				{
					checkbox.closest("fieldset").find("legend").text(inheritedFrom);
				}
				checkbox.closest("fieldset").find(".validationErrorMessage").remove();
				checkbox.closest("fieldset").find("input.ui-state-error").removeClass("ui-state-error nobg");
			}
		},
		panelsPostbindEvent : function(panel, inherit)
		{
			if(!userManager.onlyVFS)
			{
				var hiddenSections = [];
				var ignoreDefaultItems = $.cookie("ignoreDefaultItems");
				if(ignoreDefaultItems)
					ignoreDefaultItems = ignoreDefaultItems.split(",");

				if(!panel.data("stickyAdded") && ! userManager.disableBatchUpdate)
				{
					panel.find("fieldset[pnlId]").prepend("<a class='makeSticky' href='#'>Make sticky</a>");
					panel.find("a.makeSticky").unbind().bind("click", function(){
						var options = {
							path: '/'
						};
						var itms = $.cookie("ignoreDefaultItems");
						if(itms)
							itms = itms.split(",");
						else
							itms = [];
						if($(this).hasClass("removeFromSticky"))
						{
							itms.remove(itms.indexOf($(this).parent().attr("pnlId")));
							crushFTP.UI.growl("Message : ", "Panel removed from sticky.", false, 3000);
							$(this).removeClass("removeFromSticky").text("Make sticky");
						}
						else
						{
							itms.push($(this).parent().attr("pnlId"));
							crushFTP.UI.growl("Message : ", "Panel made sticky. It will be shown always now.", false, 3000);
							$(this).addClass("removeFromSticky").text("Remove sticky");
						}
						$.cookie("ignoreDefaultItems", null);
						$.cookie("ignoreDefaultItems", itms.join(","), options);
						return false;
					});
					panel.data("stickyAdded", true);
				}
				if(ignoreDefaultItems)
				{
					for(var i=0;i<ignoreDefaultItems.length;i++)
					{
						var pnlId = ignoreDefaultItems[i];
						if(pnlId && pnlId.length>0)
							panel.find("fieldset[pnlId='"+pnlId+"']").find("a.makeSticky").addClass("removeFromSticky").text("Remove sticky");
					}
				}
				if(!inherit)
				{
					$(".inheritSet", panel).each(function(){
						if($(this).attr("inheritedfrom"))
						{
							if($(this).attr("inheritedfrom").toLowerCase() == 'default')
							{
								if(!ignoreDefaultItems || !ignoreDefaultItems.has($(this).attr("pnlId"))){
									if(!$(this).hasClass('.not-allowed'))
										hiddenSections.push($(this).hide());
								}
							}
						}
						else
						{
							if(!$(this).hasClass('.not-allowed'))
								hiddenSections.push($(this).hide());
						}
					});

					if(panel.find("fieldset:visible").length == 0)
					{
						$(".collapseHandle", panel.closest("fieldset")).click();
					}
					if(userManager.isUserLimitedAdmin)
						$(".adminOnly", panel).remove();
				}
				userManager.UI.updateHiddenSectionsCountForPanel(panel, hiddenSections.length);
			}
			else
			{
				$("#accountDetailsAndOptions").hide();
				panelSetup._panel.find("fieldset[pnlid='setup1']").hide();
				panelSetup._panel.find("fieldset[pnlid='setup2']").hide();
				panelSetup._panel.find("fieldset[pnlid='setup4']").hide();
				panelSetup._panel.find("legend.collapseHandle").hide();
			}
			userManager.methods.listenChanges(panel);
		},
		updateHiddenSectionsCount : function(){
			var hiddenSections = $(".inheritSet:hidden:not(.not-allowed)", userManager.GUIInterface).length;
			if(hiddenSections==0)
			{
				$("#hiddenPanelsNote", userManager.GUIInterface).hide();
				$("span.hiddenSectionCount", userManager.GUIInterface).hide();
			}
			else
			{
				$("#hiddenPanelsCount", $("#hiddenPanelsNote", userManager.GUIInterface).show()).html("<strong>" + hiddenSections + " </strong>");
			}
		},
		updateHiddenSectionsCountForPanel : function(panel, hiddenSections){
			var collapseHandle = $("legend.collapseHandle:first", panel);
			collapseHandle.parent().find(".no-item").remove();
			if(hiddenSections == 0)
			{
				$("span.hiddenSectionCount", panel).hide();
				if(panel.find(".allowed").length==0){
					collapseHandle.after("<div class='no-item'>No settings available in this section</div>");
				}
			}
			else
			{
				if($("span.hiddenSectionCount", panel).length == 0)
				{
					collapseHandle.after("<span class='hiddenSectionCount notes ienote'></span>");
				}
				var sectionNote = hiddenSections <=1 ? " section is" : " sections are";
				$("span.hiddenSectionCount", panel).html((" (Total <strong>" + hiddenSections + "</strong> "+sectionNote+" not being shown)")).show();
			}
			if(userManager.onlyVFS)
			{
				setTimeout(function() {
					$("#vfsItemsListingAndOptions", panelSetup._panel).siblings(":visible").hide();
					$(".hiddenSectionCount", panelSetup._panel).hide();
				}, 100);
			}
		},
		/* added by carlos */
		in_array : function(needle, haystack, argStrict)
		{
			var key = '',
    		strict = !! argStrict;
			if (strict) {
			  for (key in haystack) {
			    if (haystack[key] === needle) {
			      return true;
			    }
			  }
			} else {
			  for (key in haystack) {
			  	var text = haystack[key].toString();
			    if (text.toLowerCase() == needle.toLowerCase()) {
			      return true;
			    }
			  }
			}
			return -1;
		},
		loadPreviewCSV : function()
		{
			if(jQuery.trim($('#csv_separator').val()) == ""){
				crushFTP.UI.growl("Import Users: ", "Please write your column separator.", false, 3000);
				return false;
			}
			var params = {
				command : "importUsers",
				serverGroup : $("#default_group").val() || "MainUsers"
			};
			$("#importUsersDialog").find("input, select").each(function(){
				params[$(this).attr("id")] = encodeURIComponent($(this).val());
			});
			params['preview'] = true;
			crushFTP.data.serverRequest(params, function(msg){
				var responseText = $(msg).find("response").text().split('\n');
				var previewHTML = '<table class="map_table"><tr>{headers}</tr>';
				var totalColumns = -1;
				var startLine = ($('#first_header').val() == "true") ? 1 : 0;
				for( var x = 0; x <= responseText.length-1; x++ ){
					var splitLine = responseText[x].split($('#csv_separator').val());
					if( x == 0) { totalColumns = splitLine.length-1; }
					if( x >= startLine){
						previewHTML += '<tr>';
						for( var z = 0; z <= splitLine.length-1; z++ ){
							previewHTML += '<td nowrap>'+splitLine[z]+'</td>';
						}
						previewHTML += '</tr>';
					}
				}
				previewHTML += '</table>';
				var headerSelects = '';
				var columnTypes = ['user_name', 'user_pass', 'userGroup', 'email', 'first_name', 'last_name', 'permissions', 'notes', 'salt', 'home_folder'];
				var columnTypesByName = ['Username', 'Password', 'Group', 'Email', 'First Name', 'Last Name', 'Permissions', 'Notes', 'Salt', 'Home Folder'];
				for( var x = 0; x <= totalColumns; x++ ){
					if (typeof userManager.importColumnsValues[x] == 'undefined' || userManager.importColumnsValues[x] == "") {
						userManager.importColumnsValues[x] = "";
					}
					headerSelects += '<td><select data-id="'+x+'" class="ui-state-default ui-corner-all form-created colValue" name="col'+x+'" id="col'+x+'"><option value="">Type</option><option value="user_name">Username</option><option value="user_pass">Password</option><option value="userGroup">Group</option><option value="email">Email</option><option value="first_name">First Name</option><option value="last_name">Last Name</option><option value="permissions">Permissions</option><option value="notes">Notes</option><option value="salt">Salt</option><option value="home_folder">Home Folder</option><option value="Custom">Custom</option></select></td>';
				}
				var width = (120 * (totalColumns+1));
				$('#map_html').html(previewHTML.replace('{headers}', headerSelects));//.css('width', width+'px');
				//setting default values
				for( var x = 0; x <= responseText.length-1; x++ ){
					var splitLine = responseText[x].split($('#csv_separator').val());
					if( x == 0) {
						for( var z = 0; z <= splitLine.length-1; z++ ){
							if(userManager.UI.in_array(splitLine[z], columnTypes) == true) {
								if (typeof userManager.importColumnsValues[z] == 'undefined' || userManager.importColumnsValues[z] == "") {
									userManager.importColumnsValues[z] = splitLine[z];
									$('select#col'+z).val(splitLine[z]);
								}
							} else if(userManager.UI.in_array(splitLine[z], columnTypesByName) == true) { var pattern = '/'+splitLine[z]+'/gi';
								if (typeof userManager.importColumnsValues[z] == 'undefined' || userManager.importColumnsValues[z] == "") {
									$('select#col'+z+' option').each(function(index) {
										var selectText = $(this).text().toString();
										var regex = new RegExp(splitLine[z], 'i');
										if(selectText.match(regex)){
											$(this).attr('selected', 'selected');
											userManager.importColumnsValues[z] = $(this).val();
										}
									});
								}
							}
						}
					}
				}
				//overwrite colums
				for( var x = 0; x <= userManager.importColumnsValues.length; x++ ){
					$('select#col'+x).val(userManager.importColumnsValues[x]);
				}
				$("#importUsersDialog").find(".colValue").unbind().change(function(){
					//show input field for count the saled
					var element = $(this);
					var elementID = element.data('id');
					userManager.importColumnsValues[elementID] = element.val();
					if(element.val() == "Custom") {
						jPrompt("Enter a custom value", "", "Custom Value", function(value){
							if(value){
								element.append($('<option>', {value:value, text:value})).val(value).trigger('change');
							} else {
								element.val(element.find("option:first").val()).trigger('change');
							}
						});
					}
				});
				$("#importUsersDialog").dialog('option', 'position', 'center');
			});
		},
		initEvents : function()
		{
			if(!userManager.onlyVFS)
			{
				$(document).bind("scroll", function(){
					try{
						if($(this).scrollTop()==0)
						{
							$(this).scrollTop(2);
						}
					}
					catch(ex){}
				}).trigger("scroll");
			}
			if($("ul#context-menu").length==0)
			{
				var contextmenu = $('#topNavigationContext').clone();
				contextmenu.attr("id", "context-menu").find("li").show();
				$("body").append(contextmenu);
			}

			contextMenu.handler = $("#userList");    // element which triggers right click context menu
			contextMenu.init();
			if(window.isMobileDevice)
			{
				$("#userList").removeAttr("multiple").attr("style", "height:25px !important;");
			}
			$("#quickJump", "#GUIInterface").hide();
			$("#userSpecificButtons", "#GUIInterface").hide();
			$('#quick_jump', "#GUIInterface").unbind("change").change(function (evt, voidAnimation) {
				var id = $('#quick_jump').val();
				var pnl = $('#pnl' + id);
				if(id && id.length>0 && pnl.length>0)
				{
					if(!voidAnimation)
					{
						if(userManager.placeHolder)
						{
							$(userManager.placeHolder).find("div.userMgrPanel").show();
						}
						var top_val = pnl.offset().top;
						$('html, body').animate({ scrollTop: top_val - 100 }, 200);
						pnl.find("fieldset:first").effect("highlight", {}, 2000);
						$('#quick_filter').val("");
					}
					$('#quick_jump').val("");
					if(pnl.find("div.dataDiv:hidden").length>0)
					{
						pnl.find("legend.collapseHandle").trigger("click");
					}
					pnl.find(".inheritSet:hidden").show();
					userManager.UI.updateHiddenSectionsCountForPanel(pnl, 0);
					userManager.UI.updateHiddenSectionsCount();
					if($.isCrush7)
					{
						$.crushFtpPersonalization.updateItem("userManager", "panels", id);
						userManager.methods.showRecentUsersPersonalization(true);
					}
				}
			});

			$('#recentlyViewedUsers, #recentlyEditedUsers', "#GUIInterface").unbind("change").change(function (evt, voidAnimation) {
				var user = $(this).val();
				if(user && user.length>0)
				{
					$(this).val("");
					userManager.methods.loadUserInfo(user, true, function(){
						userManager.methods.itemsChanged(false);
						setTimeout(function(){
							panelSetup.revealPassEvent();
							var userListPanel = $("#userList");
							if(userListPanel.find("option[username='"+user+"']").attr("selected", "selected").length==0)
							{
								$("#groupSelectList").val("all").trigger("change");
								setTimeout(function(){
									userListPanel.find("option:selected").removeAttr("selected");
									userListPanel.find("option[username='"+user+"']").attr("selected", "selected");
								}, 100);
							}
							else
							{
								setTimeout(function(){
									userListPanel.find("option:selected").removeAttr("selected");
									userListPanel.find("option[username='"+user+"']").attr("selected", "selected");
								}, 100);
							}
						}, 200);
					}, false, true);
				}
			});

			$(window).resize(function () {
				userManager.UI.resizeSidebar();
			});
			var localDelay = (function () {
				var timer = 0;
				return function (callback, ms) {
					clearTimeout(timer);
					timer = setTimeout(callback, ms);
				};
			})();
			$(window).scroll(function () {
				/*if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
					localDelay(function(){
						userManager.UI.resizeSidebar(true);
					}, 100);
				}
				else*/
					userManager.UI.resizeSidebar(true);
			});
			userManager.UI.resizeSidebar();

			$(".backToTop", "#GUIInterface").unbind().click(function () {
				$('html,body').animate({
					scrollTop: 0
				}, 500, false);
				return false;
			});
			$("#userList").isolatedScroll();
			$("#showAllPanels", "#GUIInterface").unbind().click(function(e, showFlag){
				e.stopPropagation();
				e.preventDefault();
				var showHideBtn = $(this);
				var showItems = true;
				if(!showFlag)
				{
					$('#quick_filter').val("");
					window.last_searched_quick_filter = "";
					$(userManager.placeHolder).find("div.userMgrPanel").show();
					if(showHideBtn.attr("state") == "hidden")
					{
						showItems = false;
						showHideBtn.attr("state", "visible");
						showHideBtn.find("span.showHideText").text("Show all");
					}
					else
					{
						showHideBtn.attr("state", "hidden");
						showHideBtn.find("span.showHideText").text("Hide Defaults");
					}
				}
				$(".collapseHandle").each(function(){
					var parentFs = $(this).parent();
					if(showFlag)
					{
						parentFs.find(".inheritSet").show();
					}
					else
					{
						if(showItems)
						{
							parentFs.find(".inheritSet").show();
						}
						else
						{
							//parentFs.find(".inheritSet").hide();

							var ignoreDefaultItems = $.cookie("ignoreDefaultItems");
							if(ignoreDefaultItems)
								ignoreDefaultItems = ignoreDefaultItems.split(",");

							$(".inheritSet", parentFs).each(function(){
								if(!ignoreDefaultItems || !ignoreDefaultItems.has($(this).attr("pnlId")))
									$(this).hide();
							});
						}
					}
					if(parentFs.find("div.dataDiv:hidden").length>0)
					{
						$(this).trigger("click");
					}
					userManager.UI.updateHiddenSectionsCountForPanel(parentFs, $(".inheritSet:hidden:not(.not-allowed)", parentFs).length);
				});
				setTimeout(function(){
					userManager.UI.updateHiddenSectionsCount();
				}, 100);

				return false;
			});
			var userList = $("#userList");
			$("#filterUserInList", "#GUIInterface").unbind("keyup").keyup(function (evt) {
				var evt = (evt) ? evt : ((event) ? event : null);
				var phrase = this.value;
				if (window.last_searched_user_name && window.last_searched_user_name === phrase) {
					return false;
				}
				userManager.methods.buildUserList(false, phrase, $("#groupSelectList").val());
				window.last_searched_user_name = phrase;
			}).unbind("keydown").keydown(function (evt) {
				var evt = (evt) ? evt : ((event) ? event : null);
				var code = (evt.keyCode ? evt.keyCode : evt.which);
				userManager.methods.keyboarNav(false, evt, code);
			});

			$("#filterUserByInheritance", "#GUIInterface").unbind("keyup").keyup(function (evt) {
				var evt = (evt) ? evt : ((event) ? event : null);
				var phrase = this.value;
				if (window.last_searched_inheritance_name && window.last_searched_inheritance_name === phrase) {
					return false;
				}
				userManager.methods.buildUserList(false, false, $("#groupSelectList").val(), phrase);
				window.last_searched_inheritance_name = phrase;
			});

			$("#quick_filter", "#GUIInterface").unbind("keyup").keyup(function (evt) {
				var evt = (evt) ? evt : ((event) ? event : null);
				var phrase = this.value.toLowerCase();
				function startFilter()
				{
					if (window.last_searched_quick_filter && window.last_searched_quick_filter === phrase) {
						return false;
					}
					var captured = false;
					$("#showAllPanels").trigger("click", [true]);
					if(!phrase || (phrase && phrase.length==0))
					{
						$(userManager.placeHolder).find(".userMgrPanel").find(".dataDiv").find("fieldset").show();
						var showHideBtn = $("#showAllPanels", "#GUIInterface");
						if(showHideBtn.attr("state") == "hidden")
						{
							showHideBtn.attr("state", "visible");
						}
						else
						{
							showHideBtn.attr("state", "hidden");
						}
						showHideBtn.trigger("click");
						$(userManager.placeHolder).find(".userMgrPanel").find(".dataDiv").find("fieldset[inheritedfrom!='default']").each(function(){
							if($(this).attr("inheritedfrom"))
							{
								$(this).show();
							}
						});
						return;
					}
					var userMgrPanel = $(userManager.placeHolder).find("div.userMgrPanel").hide().each(function(){
						var matching = $(this).find("fieldset[filterKeywords*='"+phrase+"']");
						if(matching && matching.length>0)
						{
							var panel = $(this).attr("id");
							if(panel)
							{
								panel = panel.replace("pnl", "");
								$("#quick_jump").val(panel).trigger("change", [true]);
								setTimeout(function(){
									if(!captured)
									{
										var top_val = matching.offset().top;
										$('html, body').animate({ scrollTop: top_val - 100}, 200);
										matching.effect("highlight", {}, 2000);
									}
									matching.closest(".userMgrPanel").find(".dataDiv").find("fieldset").hide();
									matching.show();
								}, 0);
								captured = true;
							}
							$(this).show();
						}
					});
					window.last_searched_quick_filter = phrase;
				}
				if (evt.keyCode == 13) {
					startFilter();
				} else {
					delay(function () {
						startFilter();
					}, 500);
				}
			}).unbind("keydown").keydown(function (evt) {
				var evt = (evt) ? evt : ((event) ? event : null);
				var code = (evt.keyCode ? evt.keyCode : evt.which);
				userManager.methods.keyboarNav(false, evt, code);
			});

			$("#groupSelectList", "#GUIInterface").unbind("change").bind("change", function(){
				if($(this).val() == "#addnewgroup#")
				{
					$(this).val(userManager.lastSelectedGroup);
					$("a.addNewGroup", "#GUIInterface").trigger("click");
					return false;
				}
				else
				{
					userManager.lastSelectedGroup = $(this).val();
					userManager.methods.buildUserList(false, false, $(this).val());
				}
			});

			$("#userConnectionGroups", "#GUIInterface").unbind("change").bind("change", function(){
				userManager.data.storeCurrentUserInfo();
				crushFTP.UI.showLoadingIndicator(true);
				$(".reloadUsersLinkMain", "#sideBar").trigger("click", [{callback : function(){
					crushFTP.UI.hideLoadingIndicator();
					if(window.bindDropdown)
						window.bindDropdown();
				}}]);
			});

			$("#groupListToSelectForInheritance", "#GUIInterface").unbind("change").bind("change", function(){
				if($(this).val() != "")
					userManager.methods.pickupUserFromGroup($(this).val());
				$(this).val("");
			});

			//Add, copy and edit user events
			$("#addUser, a.createNewUser", "#GUIInterface").unbind("click").bind("click", function(){
				var showTour = (crushFTP.methods.queryString("tour") == "y" || $.jStorage.get("tour") == "y");
				function addUserMethod(uName)
				{
					uName = uName || "";
					if(showTour){
						setTimeout(function(){
							nextStep();
						})
					}
					jPrompt("Enter a User Name :", uName, "User Name", function(value){
						if(value)
						{
							value = $.trim(value);
							var userName = value;
							var waitBoxOpen = false;

							function continueUserCreation(value)
							{
								jAlert("Checking user name availability. Please wait..", "Wait", function(){
									waitBoxOpen = false;
								}, {
									okButtonText : "Cancel"
								});
								waitBoxOpen = true;
								userManager.methods.checkUserNameAvailability(value, function(available){
									if(available)
									{
										jAlert("User already exist, please choose another name", "Message", function(){
											addUserMethod(value);
										});
									}
									else
									{
										if(waitBoxOpen)
										{
											$("#popup_container").find(".submitActionOk").trigger("click");
											function choosePassword(password)
											{
												if(typeof password != undefined)
												{
													var msgs = userManager.methods.validateUserPassword(password, userName.toLowerCase());
													if(msgs && msgs.length)
													{
														jAlert(crushFTP.methods.htmlEncode(msgs[0]), "Error", function(){
															showPasswordDialog(password);
														}, {
															classForPopupPanel : 'warning'
														});
														return false;
													}
													function continueAddingUser(){
														crushFTP.UI.showLoadingIndicator(true);
														var defaultUser = crushFTP.storage("defaultUser");
														var salt = "";
														if(defaultUser && defaultUser.user && defaultUser.user.salt && defaultUser.user.salt == "random")
														{
															var pass = panelSetup.generatePasswordUsingPrefs();
															salt = "<salt>"+pass+"</salt>";
														}
														var currentUserForCreateUser = $(document).data("username");
													    crushFTP.data.getServerItem("server_info/current_datetime_ddmmyyhhmmss", function (serverTime) {
													        var responseStatusForCreateUser = $(serverTime).find("response_status").text() || "";
													        userManager.dataRepo.saveUserInfo("<?xml version=\"1.0\" encoding=\"UTF-8\"?><user type=\"properties\"><created_by_username>"+currentUserForCreateUser+"</created_by_username><created_by_email>"+userManager.currentUserEmail+"</created_by_email><created_time>"+responseStatusForCreateUser+"</created_time><username>"+crushFTP.methods.htmlEncode(userName)+"</username><password>"+crushFTP.methods.htmlEncode(password)+"</password>"+salt+"<max_logins>0</max_logins><root_dir>/</root_dir></user>", "<?xml version=\"1.0\" encoding=\"UTF-8\"?><vfs type=\"vector\"></vfs>", "<?xml version=\"1.0\" encoding=\"UTF-8\"?><permissions type=\"properties\"><item name=\"/\">(read)(view)(resume)</item></permissions>", userName, "new", function(response){
																	crushFTP.UI.hideLoadingIndicator();
																	if(response) {
																		$(document).data("newUserPass", password);
																		crushFTP.UI.growl("Message : ", "User created", false, 3000);
																		$(".reloadUsersLinkMain", "#GUIInterface").trigger("click", [{callback : function(){
																			if(userList.find("option[userName='"+userName+"']").length==0)
																			{
																				userManager.methods.buildUserList(false, $("#filterUserInList").val(), $("#groupSelectList").val(), false, true);
																			}
																			var selectedGroup = $("#groupSelectList").find("option:selected");
																			if(selectedGroup.attr("rel") == "editable")
																			{
																				userManager.data.addUsersToGroup(selectedGroup.val(), [userName], function(){
																					userList.find(":selected").removeAttr("selected");
																					userList.find("option[userName='"+userName+"']").attr("selected", "selected").end().trigger("change");
																				});
																			}
																			else
																			{
																				userList.find(":selected").removeAttr("selected");
																				userList.find("option[userName='"+userName+"']").attr("selected", "selected").end().trigger("change");
																			}
																		}}]);
																	}else{
																		crushFTP.UI.growl("Failure : ", DOMPurify.sanitize(response.toString()), true, true);
																	}
															});
													    });
													}
													crushFTP.Replication.showOptionsOrContinue(continueAddingUser);
												}
											}
											function showPasswordDialog(password)
											{
												$("#userPasswordDialog").form().dialog({
													autoOpen: true,
													width: 500,
													modal: true,
													resizable: false,
													closeOnEscape: false,
													title : "Choose a password for this user :",
													/* edited by carlos assign some ids to the buttons for easy tour reference */
													buttons: [{
														id:"passbtn-cancel",
														text: "Cancel",
														click: function() {
															$(this).dialog("close");
														}
													},
													{
														id:"passbtn-ok",
														text: "OK",
														click: function() {
															var pass = $("#user_password_prompt").val();
															choosePassword(pass);
															$(this).dialog("close");
														}
													}],
													open : function(){
														$("#user_generated_password").val("");
														var passtoShow = password || "";
														$("#user_password_prompt").val(passtoShow).focus();
													}
												});
											}
											userManager.methods.showInfoToUserAboutSpecialUser(userName, function(isdone){
												if(isdone || userManager.currentUserConfigNoPass)
													choosePassword("");
												else
													showPasswordDialog();
											});
										}
									}
								});
							}

							if(crushFTP.methods.hasSpecialCharacters(value, userManager.notAllowedCharsInUserName))
							{
								jAlert("You can not use these characters in user name : \"" + userManager.notAllowedCharsInUserName + "\"", "Error", function(){
									addUserMethod(value);
								});
							}
							else
							{
								continueUserCreation(value);
							}
						}
					});
				}
				addUserMethod();
				return false;
			});

			//Copy selected user
			$("#copyUser, a.duplicateSelectedUser", "#GUIInterface").unbind("click").bind("click", function(){
				var selectedUser = userList.find(":selected");
				var contextMenu = $(this).closest("ul#context-menu");
				if(contextMenu.length>0)
				{
					var curElem = contextMenu.data("selectedUser");
					if(curElem && curElem.length)
					{
						selectedUser = curElem;
					}
				}
				if(selectedUser.length>0)
				{
					var selectedUserName = selectedUser.attr("username");
					function copyUser(val)
					{
						var newUserName = val || "Copy of " + selectedUserName;
						jPrompt("Enter a User Name :", newUserName, "Enter User Name", function(value){
							if(value)
							{
								function continueSaving()
								{
									crushFTP.UI.showLoadingIndicator(true);
									crushFTP.data.serverRequest({
										command: 'getUser',
										serverGroup : $("#userConnectionGroups").val() || "MainUsers",
										username : selectedUser.attr("username")
									},
									function(data){
										if(data)
										{
											var usersData = $.xml2json(data, false);
											if(usersData && usersData["response_status"] && usersData["response_status"] == "OK")
											{
												function continueCopyingUser(){
													crushFTP.UI.showLoadingIndicator(true);
													crushFTP.data.getServerItem("server_info/current_datetime_ddmmyyhhmmss", function (serverTime) {
												        var responseStatusForCreateUser = $(serverTime).find("response_status").text() || "";
												        $(data).find("username, user_name").text(value);
														$(data).find("events_subitem").find("id").each(function(){
															var uniqueID = crushFTP.methods.generateRandomPassword(10);
															$(this).text(uniqueID);
														});
														var xmlPrivs = [];
														function traverseAndBuildPrivsXML(tree) {
														    $(tree).contents().each(function() {
														        if (this.nodeType == 3) {
														            xmlPrivs.push(crushFTP.methods.xmlEncode($(this).text()));
														        }
														        else
														        {
													                var attrs = "";
													                for (var i=0; i<this.attributes.length; i++)
													                {
													                	var name = this.attributes.item(i).nodeName;
													                    attrs += name+"=\"" + crushFTP.methods.htmlEncode(unescape(crushFTP.methods.decodeXML($(this).attr(name)))).replace(/\+/g, "%2B") + "\"";
													                }
													                var pathName = crushFTP.methods.htmlEncode(unescape(crushFTP.methods.decodeXML(this.nodeName))).replace(/\+/g, "%2B");
														        	xmlPrivs.push("<"+pathName+" "+attrs+">");
														            traverseAndBuildPrivsXML(this);
														            xmlPrivs.push("</"+pathName+">");
														        }
														    });
														}
														traverseAndBuildPrivsXML($(data).find("permissions[type='properties']"));
														var privs = "<VFS type=\"properties\">" + xmlPrivs.join("") + "</VFS>";
														if(xmlPrivs.length==0)
															privs = "<VFS type=\"vector\"></VFS>";
														var userItems = usersData.response_data.user_items;
														var vfs = panelSetup.generateVFSXML(userItems, true);
														if(!vfs)
														{
															vfs = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><vfs type=\"vector\"></vfs>";
														}

														var xml = [];
														function traverseAndBuildXML(tree) {
														    $(tree).contents().each(function() {
														        if (this.nodeType == 3) {
														        	var curData = userManager.methods.seperateValueAndInheritValue($(this).text());
																	var curVal = curData.value;
														            xml.push(crushFTP.methods.xmlEncode(curVal));
														        } else {
														        	var attrs = "";
													                for (var i=0; i<this.attributes.length; i++)
													                {
													                	var name = this.attributes.item(i).nodeName;
													                    attrs += name+"=\"" + crushFTP.methods.htmlEncode(unescape(crushFTP.methods.decodeXML($(this).attr(name)))).replace(/\+/g, "%2B") + "\"";
													                }
													                var pathName = crushFTP.methods.htmlEncode(unescape(crushFTP.methods.decodeXML(this.nodeName))).replace(/\+/g, "%2B");
													                if(pathName == "created_time"){
													                	xml.push("<"+pathName+" "+attrs+">" + responseStatusForCreateUser + "</"+pathName+">");
													                }
													                else{
															        	xml.push("<"+pathName+" "+attrs+">");
															            traverseAndBuildXML(this);
															            xml.push("</"+pathName+">");
													                }
														        }
														    });
														}
														traverseAndBuildXML($(data).find("user"));
														var usr = "<user type=\"properties\">" + xml.join("") + "</user>";
														userManager.dataRepo.saveUserInfo("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n"+ usr, vfs,"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n" + privs, value, "new", function(response){
															if(response)
															{
																crushFTP.UI.growl("Message : ", "User created", false, 3000);
																userManager.data.copyUsersGroupInfo(selectedUserName, value, function(flag){
																	if(flag)
																	{
																		userManager.data.copyUsersInheritanceInfo(selectedUserName, value, function(flag){
																			userManager.data.copyExtraVFSInfo($(data), selectedUserName, value, function(flag){
																				crushFTP.UI.hideLoadingIndicator();
																				if(flag)
																				{
																					userManager.placeHolder.removeData("hasChanged");
																					userManager.changedSettings = [];
																					$(".reloadUsersLinkMain", "#GUIInterface").trigger("click", [{callback : function(){
																						userList.find(":selected").removeAttr("selected");
																						userList.find("option[userName='"+value+"']").attr("selected", "selected").end().trigger("change");
																					}}]);
																				}
																			});
																		});
																	}
																	else
																	{
																		crushFTP.UI.hideLoadingIndicator();
																	}
																});
															}
															else
															{
																crushFTP.UI.growl("Failure: ", DOMPurify.sanitize(data), true, true);
															}
														});
											    	});
												}
												crushFTP.UI.hideLoadingIndicator();
												crushFTP.Replication.showOptionsOrContinue(continueCopyingUser);
											}
										}
									});
								}
								var waitBoxOpen = false;
								jAlert("Checking user name availability. Please wait..", "Wait", function(){
									waitBoxOpen = false;
								}, {
									okButtonText : "Cancel"
								});
								waitBoxOpen = true;
								userManager.methods.checkUserNameAvailability(value, function(available){
									if(available)
									{
										jAlert("User already exist, please choose another name", "Message", function(){
											copyUser(value);
										});
									}
									else
									{
										if(waitBoxOpen)
										{
											$("#popup_container").find(".submitActionOk").trigger("click");
											userManager.methods.showInfoToUserAboutSpecialUser(value, continueSaving);
										}
									}
								});
							}
						});
					}
					copyUser();
				}
				else
				{
					crushFTP.UI.growl("Message : ", "Please select user to copy", false, 3000);
				}
				return false;
			});

			//Rollback selected user
			$("a.rollbackSelectedUser", "#GUIInterface").unbind("click").bind("click", function(){
				var selectedUser = userList.find(":selected");
				var contextMenu = $(this).closest("ul#context-menu");
				if(contextMenu.length>0)
				{
					var curElem = contextMenu.data("selectedUser");
					if(curElem && curElem.length)
					{
						selectedUser = curElem;
					}
				}
				if(selectedUser.length>0)
				{
					var selectedUserName = selectedUser.attr("username");
					crushFTP.UI.showLoadingIndicator(true);
					crushFTP.data.serverRequest({
						command:'getUserVersions',
						username:selectedUserName,
						serverGroup : $("#userConnectionGroups").val() || "MainUsers"
					}, function(data){
						crushFTP.UI.hideLoadingIndicator();
						var versions = [];
						$(data).find("user_versions_subitem").each(function(){
							$(this).find("*").each(function(){
								var zipName = $(this).get(0).nodeName;
								if(zipName.toLowerCase() === "item")
									zipName = $($(this).get(0)).attr("name");
								versions.push({
									zip : zipName,
									date : $(this).text(),
									user : selectedUserName
								})
							});
						});
						versions = versions.sort(function(a, b){
							return new Date(b.date).getTime() - new Date(a.date).getTime();
						})
						var rollbackVersions = $('#rollbackVersions').empty();
						versions.forEach(function(ver){
							var elem = $('<li><label><input type="radio" name="rollbackVersion"> '+crushFTP.methods.htmlEncode(ver.date)+'</label></li>');
							elem.data("dataRow", ver);
							rollbackVersions.append(elem);
						});
						if(versions.length==0){
							rollbackVersions.append('<li style="text-align:center;"><label for="">No versions available to rollback</label></li>')
						}
						rollbackVersions.form();
						rollbackUserDialog.dialog("open");
					});
				}
				else
				{
					crushFTP.UI.growl("Message : ", "Please select user to rollback", false, 3000);
				}
				return false;
			});

			//Undelete user
			$("a.undeleteUser", "#GUIInterface").unbind("click").bind("click", function(){
				crushFTP.UI.showLoadingIndicator(true);
				crushFTP.data.serverRequest({
					command:'getDeletedUsers',
					serverGroup : $("#userConnectionGroups").val() || "MainUsers"
				}, function(data){
					crushFTP.UI.hideLoadingIndicator();
					var users = [];
					$(data).find("deleted_users_subitem").each(function(){
						$(this).find("*").each(function(){
							var date = $(this).text().split("-")[1].split("_")[0];
							users.push({
								date : moment(date, "MMDDYYYY"),
								zip : $(this).text(),
								user : $(this).attr("name") || $(this).get(0).nodeName
							})
						});
					});
					users = users.sort(function(a, b){
						return b.date.valueOf() - a.date.valueOf();
					});
					var undeleteUserList = $('#undeleteUserList').empty();
					users.forEach(function(ver){
						var elem = $('<li><label><input type="radio" name="rollbackVersion"> '+crushFTP.methods.htmlEncode(ver.user)+' ('+ver.date.format("MM/DD/YYYY")+')</label></li>');
						elem.data("dataRow", ver);
						undeleteUserList.append(elem);
					});
					if(users.length==0){
						undeleteUserList.append('<li style="text-align:center;"><label for="">No user(s) available to restore</label></li>')
					}
					undeleteUserList.form();
					undeleteUsersDialog.dialog("open");
				});
				return false;
			});

			$("a.setupTeam", "#GUIInterface").unbind("click").bind("click", function(){
				crushTeamSetup.show();
				return false;
			});

			//Delete selected user
			$("#deleteUser, a.deleteSelectedUsers", "#GUIInterface").unbind("click").bind("click", function(){
				var hasTempAccountUser = false;
				var hasCurrentLoggedUser = false;
				var selectedUsers = $("#userList").find(":selected");
				var contextMenu = $(this).closest("ul#context-menu");
				var currentUserName = crushFTP.storage("username");
				if(contextMenu.length>0)
				{
					var curElem = contextMenu.data("selectedUser");
					if(curElem && curElem.length)
					{
						selectedUsers.push(curElem);
					}
				}
				if(selectedUsers.length>0)
				{
					var selectedUserNames = [];
					selectedUsers.each(function(){
						var userName = crushFTP.methods.htmlEncode($(this).attr("username"));
						if(userName && typeof userName != "undefined")
						{
							if(userName.toLowerCase() == "tempaccount")
							{
								hasTempAccountUser = true;
							}
							if(userName.toLowerCase() == currentUserName.toLowerCase())
							{
								hasCurrentLoggedUser = true;
							}
							if(!selectedUserNames.has(userName))
								selectedUserNames.push(userName);
						}
					});

					function continueMultiDelete()
					{
						jConfirm("Are you sure you wish to delete  \n\n" + selectedUserNames.join("\n") + " \n\n users ?", "Confirm",  function(value){
							if(value)
							{
								function continueDeleting(expire_user)
								{
									function finalRemoveContinue(){
										crushFTP.UI.showLoadingIndicator(true);
										userManager.data.deleteExtraVFSUsers(selectedUserNames, function(){
											userManager.dataRepo.saveUserInfo("<?xml version=\"1.0\" encoding=\"UTF-8\"?>", "<?xml version=\"1.0\" encoding=\"UTF-8\"?><vfs type=\"vector\"></vfs>", "<?xml version=\"1.0\" encoding=\"UTF-8\"?><permissions type=\"vector\"></permissions>", selectedUserNames.join(";"), "delete", function(data){
												if(data)
												{
													var usersData = $.xml2json(data, false);
													if(usersData && usersData["response_status"] && usersData["response_status"]== "OK")
													{
														//Remove from group added by carlos on 20/02/2015 at 10:48 am GMT -6
														var usersFormatted = [];
														selectedUsers.each(function(){
															usersFormatted.push($.trim($(this).closest("option").attr("username")));
														});
														var userList = crushFTP.storage("users");
														var groupsToCheck = [];
														for (var i = 0; i <= selectedUserNames.length; i++) {
															for(var z=0;z<userList.length;z++){
																if( userList[z].text == selectedUserNames[i]) {
																	var groups = userList[z].groups;
																	if(!groups || !jQuery.isArray(groups))
																	{
																		groups = [];
																	}
																	$.each(groups, function( index, value ) {
																		groupsToCheck.push(value.toLowerCase());
																	});
																}
															}
														}

														function continueProcess(){
															crushFTP.UI.showLoadingIndicator(true);
															userManager.data.storeCurrentUserInfo(false);
															userManager.placeHolder.removeData("hasChanged");
															userManager.changedSettings = [];

															for (var i = 0; i < selectedUserNames.length; i++) {
																$.crushFtpPersonalization.deleteItem("userManager", "users", "edited", selectedUserNames[i]);
																$.crushFtpPersonalization.deleteItem("userManager", "users", "viewed", selectedUserNames[i]);
															};

															userManager.methods.showRecentUsersPersonalization();

															$(".reloadUsersLinkMain", "#GUIInterface").trigger("click", [{callback : function(){
																crushFTP.UI.growl("Message : ", "User \"" + crushFTP.methods.htmlEncode(selectedUserNames.join("; ")) + "\" deleted", false, 3000);
																var xml = userManager.data.buildInheritanceXML();
																userManager.dataRepo.saveInheritanceInfo(xml.join("\r\n"), crushFTP.storage("userName"), "update", function(data){
																	if(data)
																	{
																		crushFTP.UI.growl("Message : ", "Inheritance data saved", false, 3000);
																		userManager.placeHolder.removeData("hasChanged");
																		userManager.changedSettings = [];
																		crushFTP.UI.hideLoadingIndicator();
																		userManager.methods.removeUsersLocalStorage();
																		crushFTP.removeStorage("CurrentUserInheritanceDetails");
																	}
																	else
																	{
																		crushFTP.UI.growl("Failure : Inheritance not saved", DOMPurify.sanitize(data), true, true);
																		crushFTP.UI.hideLoadingIndicator();
																	}
																});
															}}]);
														}

														if(groupsToCheck && groupsToCheck.length>0){
															userManager.data.removeUsersFromGroup("", usersFormatted, false, function(){
																continueProcess();
															}, groupsToCheck, true);
														}
														else{
															continueProcess();
														}
														//End

														var inheritanceChanged = false;
														if(selectedUserNames.length>0)
														{
															var userList = crushFTP.storage("users");
															if(userList && userList.length>0)
															{
																for(var i=0;i<userList.length;i++)
																{
																	if(userList[i] && userList[i].text && userList[i].inheritance)
																	{
																		var inheritance = userList[i].inheritance;
																		var actualinfo = inheritance.length;
																		inheritance = inheritance.diff(selectedUserNames);
																		userList[i].inheritance = inheritance;
																		if(inheritance.length != actualinfo)
																			inheritanceChanged = true;
																	}
																}
															}
														}
														if(inheritanceChanged)
														{
															var xml = userManager.data.buildInheritanceXML();
															crushFTP.UI.showLoadingIndicator(true);
															userManager.dataRepo.saveInheritanceInfo(xml.join("\r\n"), crushFTP.storage("userName"), "update", function(data){
																if(data)
																{
																	crushFTP.UI.growl("Message : ", "Inheritance data saved", false, 3000);
																	userManager.placeHolder.removeData("hasChanged");
																	userManager.changedSettings = [];
																	crushFTP.UI.hideLoadingIndicator();
																	userManager.methods.removeUsersLocalStorage();
																	crushFTP.removeStorage("CurrentUserInheritanceDetails");
																}
																else
																{
																	crushFTP.UI.growl("Failure : Inheritance not saved", DOMPurify.sanitize(data), true, true);
																}
															});
														}
													}
													else
													{
														crushFTP.UI.growl("Failure : ", "Error occured while deleting user \"" + DOMPurify.sanitize(selectedUserNames.join("; ")) + "\" \r\n" + DOMPurify.sanitize(data) , false, 3000);
													}
												}
												else
												{
													crushFTP.UI.growl("Failure: ", DOMPurify.sanitize(data), true, true);
												}
											}, false, false, expire_user);
										});
									}
									crushFTP.Replication.showOptionsOrContinue(finalRemoveContinue);
								}
								if($("#chk_expire_user").closest("div").find(".ui-icon-check").length>0)
								{
									setTimeout(function(){
										jConfirm("Are you sure? <br> <br>The CrushTask item associated with the account expiration on this user will be executed.", "Confirm",  function(_val){
											if(_val)
											{
												continueDeleting(true);
											}
										}, {
											okButtonText : "Yes",
											cancelButtonText : "No"
										});
									}, 100);
								}
								else
								{
									continueDeleting();
								}
							}
						}, {
							classForPopupPanel: 'heightContent',
							messageToAppend : "<div style='padding:15px;'><label style='display: inline-flex;line-height: 20px;'><input type='checkbox' class='expire_user_task' id='chk_expire_user' />Run expiration task action with VFS contents?</label></div>",
							okButtonText : "Yes",
							cancelButtonText : "No"
						});
					}

					if(hasCurrentLoggedUser)
					{
						jAlert("You can not delete the user you are currently logged in with : \"" + crushFTP.methods.htmlEncode(currentUserName) + "\"", "Error", false, {
							classForPopupPanel : 'warning'
						});
					}
					else if(hasTempAccountUser)
					{
						jConfirm("Deleting the \"TempAccount\" user will disable the WebInterface \"Sharing\" functionality. <br>This user is used as a template for that feature.<br>This user can not be logged in as, and is safe to leave here.", "Confirm",  function(value){
							if(value)
							{
								continueMultiDelete();
							}
						});
					}
					else
					{
						continueMultiDelete();
					}
				}
				else
				{
					crushFTP.UI.growl("Message : ", "Please select user to delete", false, 3000);
				}
				return false;
			});

			//Reload users list
			$(".reloadUsersLinkMain", "#GUIInterface").unbind("click").bind("click", function(evt, data){
				$("#filterUserInList").val("").trigger("keyup");
				var userList = $("#userList", "#GUIInterface");
				var userName = crushFTP.storage("userName");
				crushFTP.UI.showIndicator(false, userList, "Wait..");
				function continueReload()
				{
					crushFTP.removeStorage("userName");
					userManager.methods.prepareDataRepo(function(){
						userManager.methods.refreshUsersFromServer(function(){
							var selectedGroup = false;
							var grpName = $("#groupSelectList").val();
							userManager.methods.buildUserList(false, false, selectedGroup);
							userManager.data.bindGroupDetails(false, false, selectedGroup, function(){
								if(!selectedGroup)
								{
									$("#groupSelectList").val(grpName).trigger("change");
								}
							});
							userManager.UI.initEvents();
							userManager.data.bindInheritanceDetails();
							if(userName)
							{
								userList.find("option[userName='"+userName+"']").attr("selected", "selected");
								userList.trigger('change');
								$("#quickJump", "#GUIInterface").show();
								$("#userSpecificButtons", "#GUIInterface").show();
								userManager.UI.resizeSidebar();
							}
							crushFTP.UI.hideIndicator(false, userList);
							if(data && data.callback)
							{
								data.callback();
							}
						});
					}, true);
				}
				if(userName && userManager.methods.hasPendingChanges() && userName != "undefined")
				{
					jConfirm("If you navigate away, you will lose your unsaved changes for user : " + userName + ". Do you want to continue?", "Confirm", function(value){
						if(value)
						{
							continueReload();
							userManager.methods.itemsChanged(false);
						}
						else
						{
							crushFTP.UI.hideIndicator(true);
							crushFTP.UI.hideLoadingIndicator(true);
						}
					},
					{
						prependButtons : [{
							button : '<a href="javascript:void(0);" id="popup_continue" class="button" style="margin-right:10px;"><span style="display:inline-block;margin:-1px 3px 0px -7px;float:left;" class="pointer ui-icon ui-icon-disk"></span><span class="submitActionSaveAndContinue">Save & Continue</span></a>&nbsp;&nbsp;',
							clickEvent : function(){
								$("#saveUserData", "#GUIInterface").trigger("click", [{fromSaveAndContniue:true, callBack : function(flag){
									if(flag)
									{
										$("#popup_cancel").click();
										continueReload();
									}
									else
									{
										$("#popup_cancel").click();
										crushFTP.UI.hideIndicator(true);
										crushFTP.UI.hideLoadingIndicator(true);
									}
								}}]);
							}
						}],
						okButtonText : "Discard Changes",
						okButtonClassAdd : "ui-icon-trash"
					});
				}
				else
				{
					continueReload();
				}
				return false;
			});

			var sideBar = $("#sideBar", "#GUIInterface");
			$(".selectAllUsers, .deSelectUsers", sideBar).unbind().click(function(){
				if($(this).is(".selectAllUsers"))
				{
					userList.find("option").attr("selected","selected");
				}
				else
				{
					userList.find("option").removeAttr("selected");
				}
				return false;
			});

			$(".pasteToSelectUser", sideBar).unbind().click(function(){
				jPrompt("Paste Users List", "", "Paste and select users", function(val, key) {
		            if (val) {
		            	userList.find("option").removeAttr("selected");
		                var items = val.split("\n");
		                if(val.indexOf(";")>=0){
		                	items = val.split(";");
		                }
		                items = items.removeByVal("");
		                items.forEach(function(curItem){
		                	userList.find("option:Matches('"+$.trim(curItem)+"')").attr("selected","selected");
		                });
		            }
		        }, false, false, {
		            isTextArea: true,
		            appendAfterInput: '<small>Paste user name list to select. New line or comma separated</small>'
		        });
				return false;
			});

			$(".showAllUsers", sideBar).unbind().click(function(){
				userManager.methods.buildUserList(false, $("#filterUserInList").val(), $("#groupSelectList").val(), false, true);
				return false;
			});

			// Methods for group menu in top bar
			$("a.addNewGroup", "#GUIInterface").unbind("click").bind("click", function(){
				var selectedUsers = userList.find(":selected");
				var users = [];
				selectedUsers.each(function(){
					users.push(crushFTP.methods.htmlEncode($(this).attr("username")));
				});
				var strMsg = "Total " + selectedUsers.length + " user(s) selected : \"" + users.join(", ") + "\"";
				function addGroup(groupName)
				{
					groupName = groupName || "";
					jPrompt("Enter Group Name :", groupName, "Group Name", function(value){
						if(value != null)
						{
							groupName = $.trim(value);
							if(value.length == 0)
							{
								jAlert("Group name is required", "Error", function(){
									addGroup();
								});
							}
							else if(crushFTP.methods.hasSpecialCharacters(groupName, userManager.notAllowedCharsInGroupName))
							{
								jAlert("You can not use these characters in name : \"" + userManager.notAllowedCharsInGroupName + "\"", "Error", function(){
									addGroup(groupName);
								});
							}
							else
							{
								var serverGroup = $("#userConnectionGroups").val() || "MainUsers";
								crushFTP.UI.showLoadingIndicator(true);
								userManager.dataRepo.getGroupInfo("group", serverGroup, function(info, xml){
									if(info)
									{
										crushFTP.storage("groupInfo", info);
										crushFTP.storage("groupInfoXML", xml);

										if(userManager.methods.checkGroupNameExistance(groupName))
										{
											crushFTP.UI.hideLoadingIndicator();
											jAlert("Group name already exist, choose another name", "Error", function(){
												addGroup(groupName);
											});
										}
										else
										{
											function continueAddingGroup(){
												crushFTP.UI.showLoadingIndicator(true);
												var groupInfoXML = $(crushFTP.storage("groupInfoXML"));
												//Method to save group
												var xml = [];
												xml.push("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
												xml.push("<groups type=\"properties\">");

												if(groupInfoXML && groupInfoXML.length>0)
												{
													groupInfoXML.find("result_item result_item").each(function(){
														var groupAndUsers = $(this).find("*[type='vector']").each(function(){
															var groupName = $(this).attr("name") || $(this).get(0).tagName;
															xml.push("<item name=\""+crushFTP.methods.htmlEncode(groupName)+"\" type=\"vector\">");
															$(this).children().each(function(){
																xml.push("<item_subitem>"+crushFTP.methods.htmlEncode($(this).text())+"</item_subitem>");
															});
															xml.push("</item>");
														});
													});
												}

												xml.push("<item name=\""+crushFTP.methods.htmlEncode(groupName)+"\" type=\"vector\">");
												var hasItems = false;
												for(var i=0;i<users.length;i++)
												{
													xml.push("<item_subitem>"+users[i]+"</item_subitem>");
													hasItems = true;
												}
												if(!hasItems)
													xml.push("<item_subitem>placeholder</item_subitem>");
												xml.push("</item>");
												xml.push("</groups>");
												userManager.dataRepo.saveGroupInfo(xml.join("\r\n"), crushFTP.storage("userName"), "update", function(data){
													if(data)
													{
														/*userManager.data.addUsersToGroup(groupName, users, function(){*/
														userManager.data.bindGroupDetails(true, true, groupName);
														crushFTP.UI.growl("Message : ", "New group \""+ crushFTP.methods.htmlEncode(groupName) +"\" added (with total "+ selectedUsers.length +" users)", false, 3000);
														crushFTP.UI.hideLoadingIndicator();
														setTimeout(function(){
															$("#groupSelectList", "#GUIInterface").trigger("change");
														}, 100);
														/*});*/
													}
													else
													{
														crushFTP.UI.growl("Failure: ", DOMPurify.sanitize(data), true, true);
														crushFTP.UI.hideLoadingIndicator();
													}
												});
											}
											crushFTP.UI.hideLoadingIndicator();
											crushFTP.Replication.showOptionsOrContinue(continueAddingGroup);
										}
									}
								});
							}
						}
					}, false
					, false
					,{
						messageToAppend : users.length>0 ? strMsg + "<br /><br />" : "(Creating empty group as there is no user selected to add)<br /><br />"
					});
				}
				addGroup();
				return false;
			});

			$("a.renameCurrentGroup", "#GUIInterface").unbind("click").bind("click", function(){
				var groupSelectList = $("#groupSelectList", "#GUIInterface");
				var selectedGroup = groupSelectList.find("option:selected");
				if(selectedGroup.length>0)
				{
					if(selectedGroup.attr("rel")=="editable")
					{
						var groupNameOld = $.trim(selectedGroup.val());
						function renameGroup(valToShow)
						{
							valToShow = valToShow || groupNameOld;
							jPrompt("Enter Group Name :", groupNameOld, "Group Name", function(value){
								if(value)
								{
									//Method to rename group
									var groupNameNew = $.trim(value);
									if($.trim(groupNameOld) == $.trim(groupNameNew))
									{
										return false;
									}
									else if(groupNameNew.length == 0)
									{
										jAlert("Group name is required", "Error", function(){
											renameGroup();
										});
									}
									else if(crushFTP.methods.hasSpecialCharacters(groupNameNew, userManager.notAllowedCharsInGroupName))
									{
										jAlert("You can not use these characters in group name : \"" + userManager.notAllowedCharsInGroupName + "\"", "Error", function(){
											renameGroup(groupNameNew);
										});
									}
									else
									{
										var serverGroup = $("#userConnectionGroups").val() || "MainUsers";
										crushFTP.UI.showLoadingIndicator(true);
										userManager.dataRepo.getGroupInfo("group", serverGroup, function(info, xml){
											if(info)
											{
												crushFTP.storage("groupInfo", info);
												crushFTP.storage("groupInfoXML", xml);

												if(userManager.methods.checkGroupNameExistance(groupNameNew) && $.trim(groupNameOld).toLowerCase() != $.trim(groupNameNew).toLowerCase())
												{
													crushFTP.UI.hideLoadingIndicator();
													jAlert("Group name already exist, choose another name", "Error", function(){
														renameGroup(groupNameNew);
													});
												}
												else
												{
													var groupInfoXML = $(crushFTP.storage("groupInfoXML"));
													//Method to save group
													var xml = [];
													xml.push("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
													xml.push("<groups type=\"properties\">");

													if(groupInfoXML && groupInfoXML.length>0)
													{
														groupInfoXML.find("result_item result_item").each(function(){
															var groupAndUsers = $(this).find("*[type='vector']").each(function(){
																var groupName = $(this).attr("name") || $(this).get(0).tagName;
																if($.trim(groupName).toLowerCase()== $.trim(groupNameOld).toLowerCase())
																{
																	groupName = groupNameNew;
																}
																xml.push("<item name=\""+crushFTP.methods.htmlEncode(groupName)+"\" type=\"vector\">");
																$(this).children().each(function(){
																	xml.push("<item_subitem>"+crushFTP.methods.htmlEncode($(this).text())+"</item_subitem>");
																});
																xml.push("</item>");
															});
														});
													}
													xml.push("</groups>");
													function continueRename(){
														crushFTP.UI.showLoadingIndicator(true);
														userManager.dataRepo.saveGroupInfo(xml.join("\r\n"), crushFTP.storage("userName"), "update", function(data){
															if(data)
															{
																userManager.data.bindGroupDetails(true, false, groupNameNew);
																crushFTP.UI.growl("Message : ", "Group \""+ crushFTP.methods.htmlEncode(groupNameOld) +"\" renamed to \"" + crushFTP.methods.htmlEncode(groupNameNew) + "\"", false, 3000);
																crushFTP.UI.hideLoadingIndicator();
															}
															else
															{
																crushFTP.UI.hideLoadingIndicator();
																crushFTP.UI.growl("Failure: ", DOMPurify.sanitize(data), true, true);
															}
														});
													}
													crushFTP.UI.hideLoadingIndicator();
													crushFTP.Replication.showOptionsOrContinue(continueRename);
												}
											}
										});
									}
								}
							});
						}
						renameGroup();
					}
					else
					{
						jAlert("This group can not be modified", "Message");
					}
				}
				else
				{
					jAlert("You must select a group to rename", "Message");
				}
				return false;
			});

			$("a.deleteSelectedGroup", "#GUIInterface").unbind("click").bind("click", function(){
				var groupSelectList = $("#groupSelectList", "#GUIInterface");
				var selectedGroup = groupSelectList.find("option:selected");
				if(selectedGroup.length>0)
				{
					if(selectedGroup.attr("rel")=="editable")
					{
						var groupNameToDelete = selectedGroup.val();
						jConfirm("Are you sure you wish to delete group : '" + groupNameToDelete + "' ? <br /> <br/> (Users will not be deleted, just the group reference)", "Confirm", function(value){
							if(value)
							{
								//Method to remove group
								var serverGroup = $("#userConnectionGroups").val() || "MainUsers";
								crushFTP.UI.showLoadingIndicator(true);
								userManager.dataRepo.getGroupInfo("group", serverGroup, function(info, xml){
									if(info)
									{
										crushFTP.storage("groupInfo", info);
										crushFTP.storage("groupInfoXML", xml);

										var groupInfoXML = $(crushFTP.storage("groupInfoXML"));
										//Method to save group
										var xml = [];
										xml.push("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
										xml.push("<groups type=\"properties\">");

										if(groupInfoXML && groupInfoXML.length>0)
										{
											groupInfoXML.find("result_item result_item").each(function(){
												var groupAndUsers = $(this).find("*[type='vector']").each(function(){
													var groupName = $(this).attr("name") || $(this).get(0).tagName;
													if($.trim(groupName).toLowerCase()!= $.trim(groupNameToDelete).toLowerCase())
													{
														xml.push("<item name=\""+crushFTP.methods.htmlEncode(groupName)+"\" type=\"vector\">");
														$(this).children().each(function(){
															xml.push("<item_subitem>"+crushFTP.methods.htmlEncode($(this).text())+"</item_subitem>");
														});
														xml.push("</item>");
													}
												});
											});
										}
										xml.push("</groups>");
										function continueRemoveGroup(){
											crushFTP.UI.showLoadingIndicator(true);
											userManager.dataRepo.saveGroupInfo(xml.join("\r\n"), crushFTP.storage("userName"), "update", function(data){
												if(data)
												{
													userManager.data.bindGroupDetails(true, true);
													crushFTP.UI.growl("Message : ", "Group \""+ crushFTP.methods.htmlEncode(groupNameToDelete) +"\" deleted", false, 3000);
													var users = crushFTP.storage("users");
													for (var i = 0; i < users.length; i++) {
														var curUserGroups = users[i].groups;
														if(curUserGroups && curUserGroups.indexOf(groupNameToDelete)>=0)
															curUserGroups.remove(curUserGroups.indexOf(groupNameToDelete))
													}
													crushFTP.storage("users", users);
													crushFTP.UI.hideLoadingIndicator();
												}
												else
												{
													crushFTP.UI.growl("Failure: ", DOMPurify.sanitize(data), true, true);
												}
											});
										}
										crushFTP.UI.hideLoadingIndicator();
										crushFTP.Replication.showOptionsOrContinue(continueRemoveGroup);
									}
								});
							}
						});
					}
					else
					{
						jAlert("This group can not be deleted", "Message");
					}
				}
				else
				{
					jAlert("You must select a group to delete", "Message");
				}
				return false;
			});

			$("a.addSelectedUsersToGroup", "#GUIInterface").unbind("click").bind("click", function(){
				var selectedUsers = userList.find(":selected");
				var contextMenu = $(this).closest("ul#context-menu");
				if(contextMenu.length>0)
				{
					var curElem = contextMenu.data("selectedUser");
					if(curElem && curElem.length)
					{
						selectedUsers.push(curElem);
					}
				}
				if(selectedUsers.length>0)
				{
					var users = [];
					selectedUsers.each(function(){
						var userName = crushFTP.methods.htmlEncode($(this).attr("username"));
						if(userName && !users.has(userName) && userName.length>0)
							users.push(userName);
					});
					if(!users || users.length==0)
					{
						jAlert("Please select user(s) to add to the group", "Message");
						return false;
					}
					var usersList = users.join(", ");
					if(usersList.length>300){
						usersList = usersList.substr(0, 300) + "...";
					}
					var strMsg = "Total " + users.length + " user(s) selected : \"" + usersList + "\"";
					jPrompt("Select group :", "", "Pick A Group", function(value){
						if(value)
						{
							//Method to save group
							userManager.data.addUsersToGroup(value, users);
						}
					}, crushFTP.storage("availableGroups").sort()
					, false
					,{
						messageToAppend : strMsg + "<br /><br />"
					});
				}
				else
				{
					jAlert("Please select user(s) to add to the group", "Message");
				}
				return false;
			});

			$("a.serverFilePickButton", $("#migrateUsersPopup, #importUsersDialog")).each(function(){
				$(this).unbind("click").click(function(){
					var curElem = $(this);
		            var rel = curElem.attr("rel");
		            var pickingFor = curElem.parent().parent().parent().find("label[for='"+rel+"']").text() || "";
		            pickingFor = $.trim($.trim(pickingFor).replace(":", ""));
					curElem.crushFtpLocalFileBrowserPopup({
						file_mode : curElem.attr("FileMode") || 'server',
						pickingFor: pickingFor,
						type : curElem.attr("PickType") || 'file',
						existingVal : $("#" + curElem.attr("rel")).val(),
						callback : function(selectedPath){
							$("#" + curElem.attr("rel")).val(selectedPath).trigger("change");
						}
					});
					return false;
				});
			});

			/*Rollback User*/
			var rollbackUserDialog = $("#rollbackUsersDialog").form().dialog({
				autoOpen: false,
				height: 'auto',
				width: '30%',
				modal: true,
				resizable: true,
				closeOnEscape: true,
				open: function(){
				},
				buttons: {
					"Cancel" : function(){
						$(this).dialog( "close" );
					},
					"Preview Selected Version": function() {
						var rollbackVersions = $('#rollbackVersions');
						var selectedItem = rollbackVersions.find("input:checked");
						if(selectedItem.length>0){
							var dataRow = selectedItem.closest("li").data("dataRow");
							userManager.data.loadPreview = dataRow;
							$(".reloadUsersLinkMain", "#GUIInterface").trigger("click");
							$(this).dialog("close");
						}
						else{
							jAlert("Please select version to rollback to", "Message");
							return false;
						}
					}
				},
				beforeClose : function(){
					return true;
				}
			});

			/*Restore Deleted User*/
			var undeleteUsersDialog = $("#undeleteUsersDialog").form().dialog({
				autoOpen: false,
				height: 'auto',
				width: '30%',
				modal: true,
				resizable: true,
				closeOnEscape: true,
				open: function(){
				},
				buttons: {
					"Cancel" : function(){
						$(this).dialog( "close" );
					},
					"Preview Selected User": function() {
						var undeleteUserList = $('#undeleteUserList');
						var selectedItem = undeleteUserList.find("input:checked");
						if(selectedItem.length>0){
							var dataRow = selectedItem.closest("li").data("dataRow");
							userManager.data.loadPreview = dataRow;
							userManager.data.undeleteUser = dataRow.user;
							$(".reloadUsersLinkMain", "#GUIInterface").trigger("click", [{callback : function(){
								$("#userList").val(dataRow.user).trigger("change");
							}}]);
							$(this).dialog("close");
						}
						else{
							jAlert("Please select version to rollback to", "Message");
							return false;
						}
					}
				},
				beforeClose : function(){
					return true;
				}
			});

			/*Import Users*/
			var importUsersDialog = $("#importUsersDialog").form().dialog({
				autoOpen: false,
				height: 'auto',
				width: '60%',
				modal: true,
				resizable: true,
				closeOnEscape: true,
				open: function(){
					$("#the_dir").val('');
					$("#user_type").val('Import CSV...').trigger('change');
					$("#password_type").val('plain').trigger('change');
					$('#map_html').html('');
					$('#salted_x_char').val(2);
				},
				buttons: {
					"Cancel" : function(){
						$(this).dialog( "close" );
					},
					"Import": function() {
						var params = {
							command : "importUsers",
							serverGroup : $("#userConnectionGroups").val() || "MainUsers"
						};
						importUsersDialog.find("input, select").each(function(){
							params[$(this).attr("id")] = encodeURIComponent($(this).val());
						});
						if(params.the_dir == "")
						{
							crushFTP.UI.growl("Import Users: ", "Please choose file/folder to continue user import.", true, 1500);
							$("#the_dir", importUsersDialog).focus();
							return false;
						}
						importUsersDialog.parent().block({
							message:  '<span><span style="float: left; margin-right: 0.3em;" class="ui-icon ui-icon-refresh"></span>Wait..</span>',
							css: {
								border: 'none',
								padding: '5px',
								backgroundColor: '#000',
								'-webkit-border-radius': '10px',
								'-moz-border-radius': '10px',
								opacity: .5,
								color: '#fff',
								'text-align':'center'
							}
						});
						crushFTP.data.serverRequest(params, function(msg){
							importUsersDialog.parent().unblock();
							var response = decodeURIComponent($(msg).find("response").text());
							if(response == "SUCCESS: Users imported."){
								importUsersDialog.dialog("close");
								$(".reloadUsersLinkMain", "#GUIInterface").trigger("click");
							}
							crushFTP.UI.growl("Import Users: ", crushFTP.methods.htmlEncode(response), false, false);

						});
					}
				},
				beforeClose : function(){
					$('#map_html').empty().css("width", "auto");
					return true;
				}
			});

			/* added by carlos */
			importUsersDialog.find("#the_dir").change(function(){
				//load preview when file chosen and type is csv
				if($(this).val() != '' && $("#user_type").val() == "Import CSV...") {
					userManager.UI.loadPreviewCSV();
				}
			});

			importUsersDialog.find("#password_type").change(function(){
				//show input field for count the saled
				if($(this).val() == "md5saltedhash" || $(this).val() == "sha512cryptsaltedhash") {
					$('#salted_x_char').show().val(2);
				} else {
					$('#salted_x_char').hide();
				}
			});

			importUsersDialog.find("#user_type").change(function(){
				$('.csv_options').css('display', 'none');
				if($(this).val() == "Import WingFTP Users...")
				{
					importUsersDialog.find("#importUserLabel").text("Choose users folder to import:");
					importUsersDialog.find(".serverFilePickButton").attr("PickType", "dir");
				}
				else if($(this).val() == "Import Gene6 Users...")
				{
					importUsersDialog.find("#importUserLabel").text("Choose users folder to import:");
					importUsersDialog.find(".serverFilePickButton").attr("PickType", "dir");
				}
				else if($(this).val() == "Import CSV...")
				{
					if($("#the_dir").val() != "") {
						userManager.UI.loadPreviewCSV();
					}
					$('.csv_options').css('display', 'table');
					importUsersDialog.find("#importUserLabel").text("Choose the csv file:");
					importUsersDialog.find(".serverFilePickButton").attr("PickType", "file");
				}
				else
				{
					importUsersDialog.find("#importUserLabel").text("Choose file/folder to import:");
					importUsersDialog.find(".serverFilePickButton").attr("PickType", "any");
				}
				importUsersDialog.dialog('option', 'position', 'center');
			});

			//refresh csv button added by carlos
			importUsersDialog.find('#refresh_csv').unbind().click(function(e, showFlag){
				if($("#the_dir").val() != '' && $("#user_type").val() == "Import CSV...") {
					userManager.UI.loadPreviewCSV();
				} else {
					crushFTP.UI.growl("Import Users: ", "Please select a file.", false, false);
				}
			});

			//auto refresh
			importUsersDialog.find('#csv_separator, #salted_x_char').unbind().bind('keyup',function(e){
				if($("#the_dir").val() != '' && $("#user_type").val() == "Import CSV...") {
					userManager.UI.loadPreviewCSV();
				}
			});

			//auto refresh
			importUsersDialog.find('#first_header, #password_type, #default_group').change(function(){
				if($("#the_dir").val() != '' && $("#user_type").val() == "Import CSV...") {
					userManager.UI.loadPreviewCSV();
				}
			});

			$("a.importUsers", "#GUIInterface").unbind("click").bind("click", function(){
				$('#default_group').html($("#groupSelectList").html());
				$("#default_group option[value='#addnewgroup#']").remove();
				importUsersDialog.dialog("open");
				importUsersDialog.dialog('option', 'position', 'center');
				return false;
			});

			$("#migrateUsersPopup").form().dialog({
				autoOpen: false,
				height: 200,
				width: 600,
				title : "Migrate users data from one HD to another",
				modal: true,
				resizable: false,
				closeOnEscape: false,
				buttons: {
					"Cancel" : function(){
						$(this).dialog( "close" );
					},
					"OK": function() {
						var params = {
							command : "migrateUsersVFS",
							serverGroup : $("#userConnectionGroups").val() || "MainUsers"
						};
						$("#migrateUsersPopup").find("input").each(function(){
							params[$(this).attr("id")] = $(this).val();
						});
						$("#migrateUsersPopup").parent().block({
							message:  '<span><span style="float: left; margin-right: 0.3em;" class="ui-icon ui-icon-refresh"></span>Wait..</span>',
							css: {
								border: 'none',
								padding: '5px',
								backgroundColor: '#000',
								'-webkit-border-radius': '10px',
								'-moz-border-radius': '10px',
								opacity: .5,
								color: '#fff',
								'text-align':'center'
							}
						});
						crushFTP.data.serverRequest(params, function(msg){
							$("#migrateUsersPopup").parent().unblock();
							$("#migrateUsersPopup").dialog("close");
							crushFTP.UI.growl("Migrate users data from one HD to another", DOMPurify.sanitize(decodeURIComponent($(msg).find("response").text())), false, false);
						});
					}
				},
				open: function(){
					$("#migrateUsersPopup").find("input").each(function(){
						$(this).val("");
					});
				}
			});

			$("a.migrateUsersData", "#GUIInterface").unbind("click").bind("click", function(){
				$("#migrateUsersPopup").dialog("open");
				return false;
			});

			$("a.accountActivity", "#GUIInterface").unbind("click").bind("click", function(){
				var usersFormatted = [];
				var selectedUsers = userList.find(":selected");
				if(selectedUsers.length>0)
				{
					selectedUsers.each(function(){
						usersFormatted.push(crushFTP.methods.htmlEncode($.trim($(this).attr("username"))).toUpperCase());
					});
				}
				var users;
				if(usersFormatted.length>0)
				{
					users = usersFormatted.join(",");
				}
				else
				{
					jAlert("Please select users to continue", "Error");
					return false;
				}
				localStorage.setItem("reportUsers", users);
				window.open("/WebInterface/admin/index.html", '_blank').focus();
			});

			$("a.removeSelectedUsersFromGroup", "#GUIInterface").unbind("click").bind("click", function(){
				var groupSelectList = $("#groupSelectList", "#GUIInterface");
				var selectedGroup = groupSelectList.find("option:selected");

				if(selectedGroup.length>0)
				{
					if(selectedGroup.attr("rel")=="editable")
					{
						var groupName = selectedGroup.val();
						var selectedUsers = userList.find(":selected");
						if(selectedUsers.length>0)
						{
							var users = [];
							var usersFormatted = [];
							selectedUsers.each(function(){
								users.push($(this).closest("option").attr("username"));
								usersFormatted.push($.trim($(this).closest("option").attr("username")));
							});
							var strMsg = "Total " + selectedUsers.length + " user(s) selected : \"" + users.join(", ") + "\"";
							jConfirm("Are you sure you wish to remove selected users from this group : '" + groupName + "' ? <br /> <br/> (Users will not be deleted, just the group reference) <br /> <br />" + strMsg, "Confirm", function(value){
								if(value)
								{
									userManager.data.removeUsersFromGroup(groupName, users, usersFormatted);
								}
							});
						}
						else
						{
							jAlert("You must have a user selected to continue", "Message");
						}
					}
					else
					{
						jAlert("This group can not be modified", "Message");
					}
				}
				else
				{
					jAlert("You must select a group to continue", "Message");
				}
				return false;
			});

			var btnApplyInheritance = $("#applyInheritance", "#GUIInterface").unbind().click(function(){
				var selectedInheritance = $("#selectedInheritance", "#GUIInterface");
				var removedInheritance = [];
				var appliedInheritance = [];
				var user = crushFTP.storage("userName");
				selectedInheritance.find("input[type='checkbox']").each(function(){
					if(!$(this).is(":checked"))
					{
						removedInheritance.push($(this).attr("rel"));
					}
				});
				selectedInheritance.find("input[type='checkbox']").each(function(){
					if(!$(this).attr("disabled") && $(this).is(":checked"))
						appliedInheritance.push($(this).attr("rel"));
				});
				var userList = crushFTP.storage("users");
				if(userList && userList.length>0)
				{
					for(var i=0;i<userList.length;i++)
					{
						if(userList[i] && userList[i].text && userList[i].text.toString().toLowerCase() == user.toLowerCase())
						{
							var inheritance = appliedInheritance;
							inheritance = inheritance.diff(removedInheritance);
							userList[i].inheritance = inheritance;
							i = userList.length;
						}
					}
				}
				function continueSavingInheritance(){
					var xml = userManager.data.buildInheritanceXML();
					crushFTP.UI.showLoadingIndicator(true);
					userManager.dataRepo.saveInheritanceInfo(xml.join("\r\n"), crushFTP.storage("userName"), "update", function(data){
						if(data)
						{
							crushFTP.UI.growl("Message : ", "User's inheritance data saved", false, 3000);
							crushFTP.UI.hideLoadingIndicator();
							userManager.methods.removeUsersLocalStorage();
							userManager.placeHolder.removeData("hasChanged");
							userManager.changedSettings = [];
							crushFTP.removeStorage("CurrentUserInheritanceDetails");
							$("a.reloadUsersLink:visible", "#sideBar").trigger("click");
						}
						else
						{
							crushFTP.UI.growl("Failure: ", DOMPurify.sanitize(data), true, true);
						}
					});
				}
				crushFTP.Replication.showOptionsOrContinue(continueSavingInheritance);
				userManager.data.showInheritanceDataForUser(user);
			});

			var btnApplyInheritanceToAllListedUsers = $("#applyInheritanceToAllListedUsers", "#GUIInterface").unbind().click(function(evt, selectedOnly){
				var confirmText = "Are you sure you wish to apply this inheritance to all users in the list?<br><br>";
				var okBtnText = "Yes, to all listed users";
				if(selectedOnly)
				{
					confirmText = "Are you sure you wish to apply this inheritance to all selected users in the list?<br><br>";
					okBtnText = "Yes, to all selected users";
				}
				jConfirm(confirmText,"Confirm", function(flag)
				{
					if(flag)
					{
						var selectedInheritance = $("#selectedInheritance", "#GUIInterface");
						var removedInheritance = [];
						var appliedInheritance = [];
						var usersToUpdate = [];
						$("#userList").find("option").each(function()
						{
							var userName = crushFTP.methods.htmlEncode($(this).attr("userName"));
							if(selectedOnly)
							{
								 if($(this).is(":selected"))
									usersToUpdate.push(userName);
							}
							else
								usersToUpdate.push(userName);
						});
						if(usersToUpdate.length==0)return;
						selectedInheritance.find("input[type='checkbox']").each(function(){
							if(!$(this).attr("disabled") && $(this).is(":checked"))
								appliedInheritance.push($(this).attr("rel"));
						});

						var userList = crushFTP.storage("users");
						if(userList && userList.length>0)
						{
							for(var i=0;i<userList.length;i++)
							{
								for(var j=0;j<usersToUpdate.length;j++)
								{
									var user = usersToUpdate[j];
									if(user.toLowerCase() != "default")
									{
										if(userList[i] && userList[i].text && userList[i].text.toString().toLowerCase() == user.toLowerCase())
										{
											var inheritance = [];
											for(var k=0;k<appliedInheritance.length;k++)
											{
												var curInheritance = appliedInheritance[k];
												if(curInheritance && !inheritance.has(curInheritance) && curInheritance.toLowerCase() != user.toLowerCase())
												{
													inheritance.push(curInheritance);
												}
											}
											userList[i].inheritance = inheritance;
										}
									}
								}
							}
						}

						function continueSavingInheritance(){
							var xml = userManager.data.buildInheritanceXML();
							crushFTP.UI.showLoadingIndicator(true);
							userManager.dataRepo.saveInheritanceInfo(xml.join("\r\n"), crushFTP.storage("userName"), "update", function(data){
								if(data)
								{
									if(selectedOnly)
										crushFTP.UI.growl("Success!", "All selected users' inheritance data saved", false, 3000);
									else
										crushFTP.UI.growl("Success!", "All listed users' inheritance data saved", false, 3000);
									crushFTP.UI.hideLoadingIndicator();
									userManager.placeHolder.removeData("hasChanged");
									userManager.changedSettings = [];
									userManager.methods.removeUsersLocalStorage();
									crushFTP.removeStorage("CurrentUserInheritanceDetails");
									$("a.reloadUsersLink:visible", "#sideBar").trigger("click");
								}
								else
								{
									crushFTP.UI.growl("Failure: ", DOMPurify.sanitize(data), true, true);
								}
							});
						}
						crushFTP.Replication.showOptionsOrContinue(continueSavingInheritance);
						userManager.data.showInheritanceDataForUser(crushFTP.storage("userName"));
					}
				},{
                    okButtonText : okBtnText,
                    cancelButtonText : "No"
                });
			});

			var applyInheritanceTrigger = $("#applyInheritanceTrigger", "#GUIInterface").contextMenu({
					menu: "batchUploadSelector",
					openOnClick : true,
					inSpeed : 0,
					outSpeed : 0
				},
				function(action, el, pos) {
					if(action == "current")
					{
						btnApplyInheritance.trigger("click");
						applyInheritanceTrigger.removeClass("ui-state-hover");
					}
					else if(action == "selectedBatch")
					{
						btnApplyInheritanceToAllListedUsers.trigger("click", [true]);
						applyInheritanceTrigger.removeClass("ui-state-hover");
					}
					else if(action == "batch")
					{
						btnApplyInheritanceToAllListedUsers.trigger("click");
						applyInheritanceTrigger.removeClass("ui-state-hover");
					}
				}
			);

			$(".logout", "#myslidemenu").unbind().click(function(){
				crushFTP.methods.logout();
				return false;
			});

			setTimeout(function(){
				try{
					$("#sideBar, #quickJump").form(true);
				}catch(ex){}
			});

			$("#cancelChanges", "#GUIInterface").unbind().click(function(){
				if(userManager.methods.hasPendingChanges())
					$("a.reloadUsersLink", "#sideBar").trigger("click");
				return false;
			});

			$("#saveUserData", "#GUIInterface").unbind().click(function(evt, evtData){
				var isUndelete = $("#undeleteMessage").is(":visible");
				$("#rollbackMessage, #undeleteMessage").hide();
				var elem = $(this);
				var fromSaveAndContniue = false;
				if(evtData)
				{
					fromSaveAndContniue = evtData.fromSaveAndContniue;
				}
				if($(".hasPendingCall").length>0)
				{
					window.pendingEncryptionCall = function(){
						elem.trigger("click");
					};
					if($('#pluginPlaceHolder').find(".hasPendingCall").length>0)
					{
						$('#pluginPlaceHolder').find(".hasPendingCall").trigger("blur.crushFTP").removeClass('hasPendingCall');
					}
				}
				else
				{
					var hasError, passwordError = false;
					$(".validate", "#GUIInterface").each(function(){
						if(!$(this).hasClass('ignore-user-validate') && $(this).validateNow())
						{
							if($(this).is("#crush_value2"))
							{
								if($(this).data("dataChanged") && !evt.altKey)
									hasError = true;
								else
									passwordError = true;
							}
							else
								hasError = true;
						}
					})
					if(!hasError)
					{
						var xml = ["<?xml version=\"1.0\" encoding=\"UTF-8\"?> "];
						var vfs = panelSetup.generateVFSXML(false, true);
						var privs = panelSetup.generatePrivsXML(false, true);
						xml.push("<user type=\"properties\">");
						for(var i=0;i<userManager.panelsToLoad.length;i++)
						{
							var pluginName = userManager.panelsToLoad[i];
							if(pluginName)
							{
								var scriptToRun = "xml.push(panel" + pluginName + ".generateXML());"
								eval(scriptToRun);
							}
						}
						var currentUser = crushFTP.storage("currentUser");
						if(currentUser && currentUser.user && currentUser.user.last_logins){
							xml.push("<last_logins>"+currentUser.user.last_logins+"</last_logins>")
						}
						xml.push("</user>");
						xml = xml.join("");
						var username = $.trim(crushFTP.storage("userName"));
						var newUsername = $.trim($("#crush_value1", panelSetup._panel).val());
						var dataAction = "replace";
						var deleteUser = false;
						var renamingUser = username.toLowerCase() != newUsername.toLowerCase();
						var oldUserName;
						if(renamingUser){
							oldUserName = username;
						}
						function continueSavingData()
						{
							crushFTP.UI.showLoadingIndicator({
								message : "Saving information..",
								title : "Wait..."
							});
							panelSetup.saveExtraVFSItems(function(){
								userManager.dataRepo.saveUserInfo(xml, vfs, privs, newUsername, dataAction, function(data, flag, returnGroup){
									if(data)
									{
										if(deleteUser)
										{
											userManager.dataRepo.saveUserInfo("<?xml version=\"1.0\" encoding=\"UTF-8\"?>", "<?xml version=\"1.0\" encoding=\"UTF-8\"?><vfs type=\"vector\"></vfs>", "<?xml version=\"1.0\" encoding=\"UTF-8\"?><permissions type=\"vector\"></permissions>", username, "delete", function(delData){
												if(delData)
												{
													var usersData = $.xml2json(delData, false);
													if(usersData && usersData["response_status"] && usersData["response_status"]== "OK")
													{
														userManager.methods.itemsChanged(false);
														if($.isCrush7)
														{
															$.crushFtpPersonalization.updateItem("userManager", "users", "edited", username);
															userManager.methods.showRecentUsersPersonalization();
														}
														userManager.data.copyUsersGroupInfo(username, newUsername, function(flag){
															if(flag)
															{
																userManager.data.copyUsersInheritanceInfo(username, newUsername, function(flag){
																	crushFTP.UI.hideLoadingIndicator();
																	if(flag)
																	{
																		userManager.data.storeCurrentUserInfo(newUsername);
																		crushFTP.UI.growl("Message : ", "User settings saved", false, 3000);
																		$(".reloadUsersLinkMain", "#GUIInterface").trigger("click", [{callback : function(){
																			userManager.data.storeCurrentUserInfo(newUsername);
																			var userListPanel = $("#userList");
																			var selectedElem  = userListPanel.find("option[userName='"+newUsername+"']").addClass("userSelected");
																			userManager.methods.showRefreshButton();
																			$(".reloadUsersLink", "#sideBar").trigger("click", [newUsername]);
																		}}]);
																		// panelSetup.saveExtraVFSItems(function(){
																		// });
																	}
																}, true, renamingUser, oldUserName);
															}
															else
															{
																crushFTP.UI.hideLoadingIndicator();
															}
														}, true, renamingUser, oldUserName);
													}
													else
													{
														userManager.data.storeCurrentUserInfo(newUsername);
														crushFTP.UI.growl("Message : ", "User settings saved. Failed while removing user : " + crushFTP.methods.htmlEncode(username), true);
														// panelSetup.saveExtraVFSItems();
													}
												}
											});
										}
										else
										{
											userManager.methods.itemsChanged(false);
											crushFTP.UI.hideLoadingIndicator();
											crushFTP.UI.growl("Message : ", "User settings saved", false, 3000);
											if($.isCrush7)
											{
												$.crushFtpPersonalization.updateItem("userManager", "users", "edited", username);
												userManager.methods.showRecentUsersPersonalization();
											}
											if(fromSaveAndContniue)
											{
												if(evtData.callBack)
												{
													evtData.callBack(true);
												}
											}
											else if(returnGroup)
											{
												setTimeout(function(){
													$("#groupSelectList").val("all").trigger("change");
													$("#userList").find("option[userName='"+username+"']").attr("selected","selected").end().trigger("change");
												}, 100);
											}

											if(isUndelete)
											{
												crushFTP.removeStorage("userList");
												$(".reloadUsersLinkMain", "#GUIInterface").trigger("click");
											}

											// panelSetup.saveExtraVFSItems(function(){
											// });
										}
									}
									else
									{
										crushFTP.UI.hideLoadingIndicator();
										crushFTP.UI.growl("Failure: ", DOMPurify.sanitize(data), true, true);
										if(fromSaveAndContniue)
										{
											if(evtData.callBack)
											{
												evtData.callBack(false);
											}
										}
									}
								}, false, false, false, oldUserName);
							});

							/*$("#dialog-message" ).html("<textarea style=\"width:970px;height:600px\">"+unescape(xml)+ "\r\n" + unescape(vfs) + "\r\n" + unescape(privs) + "</textarea>").dialog({
								modal: true,
								minWidth : 1000,
								maxWidth : 1000,
								maxHeight : 600,
								buttons: {
									OK: function() {
										$( this ).dialog( "close" );
									}
								}
							});*/
						}

						if(renamingUser)
						{
							dataAction = "new";
							deleteUser = true;
							var waitBoxOpen = false;
							jAlert("Checking user name availability. Please wait..", "Wait", function(){
								waitBoxOpen = false;
							}, {
								okButtonText : "Cancel"
							});
							waitBoxOpen = true;
							userManager.methods.checkUserNameAvailability(newUsername, function(available){
								if(available)
								{
									if(fromSaveAndContniue)
									{
										if(evtData.callBack)
										{
											evtData.callBack(false);
										}
									}
									jAlert("User already exist, please choose another name", "Message", function(){
										$("#crush_value1", panelSetup._panel).focus().select();
									});
								}
								else
								{
									if(waitBoxOpen)
									{
										$("#popup_container").find(".submitActionOk").trigger("click");
										userManager.methods.showInfoToUserAboutSpecialUser(newUsername, function(){
											userManager.data.renameExtraItems(username, newUsername, function(){
												continueSavingData();
											});
										});
									}
								}
							});
						}
						else
						{
							continueSavingData();
						}
					}
					if(hasError || passwordError)
					{
						var top_val = $(".validationErrorMessage:first").offset().top;
						$('html, body').animate({ scrollTop: top_val - 120}, 200);
						if(fromSaveAndContniue)
						{
							if(evtData.callBack)
							{
								evtData.callBack(false);
							}
						}
						if(passwordError)
						{
							panelSetup._panel.find("#crush_value2").removeClass("ui-state-error").addClass("ui-state-highlight").closest("td").find("span.validationErrorMessage").removeClass("ui-state-error").addClass("ui-state-highlight");
						}
					}
				}
				return false;
			});

			/*Replication stuff*/
			if(crushFTP.replicate_users && crushFTP.replicate_users.toLowerCase() === "true"){
				crushFTP.Replication.init({
					replicateHosts: crushFTP.replicateHosts,
					replicate_users: crushFTP.replicate_users
				}, "UserManager", $("#GUIInterface"), "", "#saveUserData", function(prefs, _panelname){
					crushFTP.replicationSavePrefs = prefs;
					$("#saveUserData", "#GUIInterface").trigger("click");
					crushFTP.Replication.popupVisible(false);
			    });
			}

			$(".enterpriseFeatureTag").click(function(){
				jAlert('<div style="text-align:center">To use this feature, an Enterprise license is required.<br><br> To get more information on features and pricing, see the following links : <br><br><a href="http://crushftp.com/pricing.html#enterprise" tabIndex="-1" target="_blank">Plans &amp; Pricing</a> | <a href="http://www.crushftp.com/crush6wiki/Wiki.jsp?page=Enterprise%20License%20Enhancements" tabIndex="-1" target="_blank">Enterprise License Enhancements</a></div>', "This is an Enterprise License feature");
				return false;
			});
			//Keep this line at the end of this method, it will bind click at the end of all bindings
			$("#topNavigation, ul#context-menu").find("a").click(function(){
				contextMenu.hide();
				$(document).trigger("click");
			});
			var rollbackMessage = $('#rollbackMessage');
			rollbackMessage.find("a#savePreviewVersion").unbind().click(function(){
				$("#saveUserData", "#GUIInterface").trigger("click");
				rollbackMessage.hide();
				return false;
			});
			rollbackMessage.find("a#cancelRollback").unbind().click(function(){
				rollbackMessage.hide();
				$(".reloadUsersLinkMain", "#GUIInterface").trigger("click");
				return false;
			});
			var undeleteMessage = $('#undeleteMessage');
			undeleteMessage.find("a#savePreviewVersion").unbind().click(function(){
				$("#saveUserData", "#GUIInterface").trigger("click");
				undeleteMessage.hide();
				return false;
			});
			undeleteMessage.find("a#cancelRollback").unbind().click(function(){
				undeleteMessage.hide();
				$(".reloadUsersLinkMain", "#GUIInterface").trigger("click");
				return false;
			});
			if(window.bindDropdown)
				window.bindDropdown();
		},
		resizeSidebar : function(scroll)
		{
			var sideBar = $('#sideBar');
			var heightOfHeader = $('#header').height();
			var sidebarTop = heightOfHeader + 5;
			// if(scroll)
			// {
			// }
			// else
			{
				sideBar.css("top", sidebarTop + "px");
				var scrollLeft = 0-($(document).scrollLeft() - 5);
				sideBar.css("left", scrollLeft + "px");
				var heightOfFooter = $('#footer').height();
				var windowHeight = $(window).height();
				var xH = 10;
				var iS = 10;
				if(navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0){
					xH = 25;
					iS = 40;
				}
				var cHeight = windowHeight - heightOfHeader - heightOfFooter - xH;
				if($("#personalizedUsersPanel").is(":visible"))
					cHeight = cHeight - $("#personalizedUsersPanel").height() + 20;
				cHeight = cHeight > 270 ? cHeight : 270;
				sideBar.height(cHeight);
				cHeight = cHeight - 270;
				$("#userList").height(cHeight + iS);
				if(!window.isMobileDevice){
					try{
						$("#userListWrapper").resizable("destroy");
					}catch(ex){}
					$("#userListWrapper").resizable({ handles: "se", "helper" : "ui-resizable-helper", "minWidth" : 250, "maxHeight" : cHeight + 15, "minHeight" : cHeight + 15});
				}
				$("body").css("padding-top", heightOfHeader + 3 + "px");
				// sideBar.css("margin-top", $(document).scrollTop() + "px");
			}
		}
	},
	data:
	{
		loadServerInfo : function(callback)
		{
			function fetchServerInfo(callback)
			{
				if(crushFTP.storage("serverInfo"))
				{
					callback(crushFTP.storage("serverInfo"));
					return;
				}
				var serverInfoItems = ["registration_name","rid", "machine_is_linux","machine_is_solaris","machine_is_unix","machine_is_windows","machine_is_x","machine_is_x_10_5_plus","sub_version_info_str","version_info_str"];
				var arr = {};
				var items = crushFTP.storage("GUIXMLPrefs");
				if(items){
					for (var i = 0; i < serverInfoItems.length; i++) {
						var key = serverInfoItems[i];
						arr[key] = items[key];
					}
					callback(arr);
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
		removeUsersFromGroup : function(groupName, users, usersFormatted, calback, groups, isDelete)
		{
			//Method to remove group
			var groupSelectList = $("#groupSelectList", "#GUIInterface");
			var serverGroup = $("#userConnectionGroups").val() || "MainUsers";
			crushFTP.UI.showLoadingIndicator(true);
			usersFormatted = usersFormatted || users;
			userManager.dataRepo.getGroupInfo("group", serverGroup, function(info, xml){
				if(info)
				{
					crushFTP.storage("groupInfo", info);
					crushFTP.storage("groupInfoXML", xml);

					var groupInfoXML = $(crushFTP.storage("groupInfoXML"));
					//Method to save group
					var xml = [];
					xml.push("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
					xml.push("<groups type=\"properties\">");
					var groupUsernameExists = false;
					if(groupInfoXML && groupInfoXML.length>0)
					{
						var allUsers = crushFTP.storage("users");
						if(allUsers && allUsers.length>0)
						{
							for(var i=0;i<allUsers.length;i++)
							{
								if((allUsers[i] && allUsers[i].text && allUsers[i].text.toString().toLowerCase() == groupName.toLowerCase()) || (groups && groups.has(allUsers[i].text.toString().toLowerCase())))
								{
									groupUsernameExists = true;
									break;
								}
							}
						}
						groupInfoXML.find("result_item result_item").each(function(){
							var groupAndUsers = $(this).find("*[type='vector']").each(function(){
								var hasItems = false;
								var curGroupName = $(this).attr("name") || $(this).get(0).tagName;
								xml.push("<item name=\""+crushFTP.methods.htmlEncode(curGroupName)+"\" type=\"vector\">");
								if((groups && groups.has($.trim(curGroupName).toLowerCase())) || ($.trim(curGroupName).toLowerCase() == groupName.toLowerCase()))
								{
									$(this).children().each(function(){
										if(!usersFormatted.has($.trim($(this).text())))
										{
											xml.push("<item_subitem>"+crushFTP.methods.htmlEncode($(this).text())+"</item_subitem>");
											hasItems = true;
										}
										else
										{
											if(groupUsernameExists)
											{
												userManager.data.addRemoveInheritanceDetailsFromUser($(this).text(), groupName, true, true);
											}
										}
									});
								}
								else
								{
									$(this).children().each(function(){
										xml.push("<item_subitem>"+crushFTP.methods.htmlEncode($(this).text())+"</item_subitem>");
										hasItems = true;
									});
								}
								if(!hasItems)
									xml.push("<item_subitem>placeholder</item_subitem>");
								xml.push("</item>");
							});
						});
					}
					xml.push("</groups>");

					function continueRemovingUserFromGroup(){
						crushFTP.UI.showLoadingIndicator(true);
						userManager.dataRepo.saveGroupInfo(xml.join("\r\n"), crushFTP.storage("userName"), "update", function(data){
							if(data)
							{
								userManager.data.bindGroupDetails(true, true, groupSelectList.val());
								var userList = crushFTP.storage("users");
								for(var i=0;i<userList.length;i++)
								{
									var curUser = userList[i];
									if(curUser && curUser.text && usersFormatted.has(curUser.text))
									{
										var groups = curUser.groups;
										if(!groups || !jQuery.isArray(groups))
										{
											groups = [];
										}
										if(groups && groups.indexOf(groupName) >= 0 && groups.length>groups.indexOf(groupName))
											groups.remove(groups.indexOf(groupName));
									}
								}
								//crushFTP.UI.growl("Message : ", "Users \"" +users.join(", ")+ "\" removed from group \""+ groupName + "\"", false, 3000);
								if(groupSelectList.val()!="all")
									groupSelectList.trigger("change");
								crushFTP.UI.hideLoadingIndicator();
							}
							else
							{
								crushFTP.UI.growl("Failure: ", DOMPurify.sanitize(data), true, true);
							}
							if (groupUsernameExists)
							{
								xml = userManager.data.buildInheritanceXML();
								crushFTP.UI.showLoadingIndicator(true);
								userManager.dataRepo.saveInheritanceInfo(xml.join("\r\n"), crushFTP.storage("userName"), "update", function(data){
									if(data)
									{
										crushFTP.UI.growl("Message : ", "User's inheritance data saved", false, 3000);
										crushFTP.UI.hideLoadingIndicator();
										userManager.methods.removeUsersLocalStorage();
										userManager.placeHolder.removeData("hasChanged");
										userManager.changedSettings = [];
										crushFTP.removeStorage("CurrentUserInheritanceDetails");
										if(!isDelete){
											$("a.reloadUsersLink:visible", "#sideBar").trigger("click");
										}
										if(calback)
											calback();
									}
									else
									{
										crushFTP.UI.growl("Failure: ", DOMPurify.sanitize(data), true, true);
									}
								});
							}
							else{
								if(calback)
									calback();
							}
						});
					}
					if(!crushFTP.replicationSavePrefs){
						crushFTP.UI.hideLoadingIndicator();
						crushFTP.Replication.showOptionsOrContinue(continueRemovingUserFromGroup);
					}
					else
						continueRemovingUserFromGroup();
				}
			});
		},
		setInheritPropertyOfSection : function(field, attrToUse, dynamic, user)
        {
            var parentPanel = $(field).closest("fieldset");
            var chkBox = parentPanel.find("td.checkboxArea:first").find("input:checkbox:first");
            if(chkBox.closest("td").hasClass("noInherit") || parentPanel.hasClass("inheritSet")) return;
            var id = $(field).attr(attrToUse);
            if(dynamic)
            {
                id = attrToUse;
            }
            if(chkBox.hasClass("inheritance-set"))
            	return;
            if(id)
            {
                var inheritedFrom = false;
                if(user)
                {
                    var curData = userManager.methods.seperateValueAndInheritValue(crushFTP.data.getValueFromJson(user, id));
                    if(curData.inherit)
                    {
                        inheritedFrom = curData.inherit;
                    }
                }
                if(typeof crushFTP.storage("currentUser").user[id] == "undefined")
                {
                    crushFTP.UI.checkUnchekInput(chkBox, false);
                    userManager.UI.disableUncheckedPanel(chkBox, inheritedFrom);
                    parentPanel.addClass("inheritSet");
                }
                else
                {
                    crushFTP.UI.checkUnchekInput(chkBox, true);
                    userManager.UI.disableUncheckedPanel(chkBox, inheritedFrom);
                    chkBox.addClass('inheritance-set');
                }
            }
        },
		bindValuesFromJson : function(_panel, curItem, attrToUse, voidInheritValSet, noChange)
		{
			var dataInheritedFrom = false;
			attrToUse = attrToUse || "id";
			_panel.find(".inheritance-set").removeClass('inheritance-set');
			_panel.find("input[type='text']:not(.ignoreBind),input[type='password']:not(.ignoreBind), textarea:not(.ignoreBind), select:not(.ignoreBind)").each(function(){
				if($(this).attr(attrToUse))
				{
					if(curItem)
					{
						var curData = userManager.methods.seperateValueAndInheritValue(crushFTP.data.getValueFromJson(curItem, $(this).attr(attrToUse)));
						var curVal = curData.value;
						dataInheritedFrom = curData.inherit || dataInheritedFrom || "default";

						if($(this).closest("fieldset").is(".notInheritable"))
						{
							dataInheritedFrom = false;
						}
						if(!noChange)
							$(this).val(crushFTP.methods.decodeXML(curVal)).trigger("change");
						else
							$(this).val(crushFTP.methods.decodeXML(curVal));
						var parent = $(this).closest("fieldset").attr("inheritedFrom", dataInheritedFrom);
						if(!voidInheritValSet)
						{
							userManager.data.setInheritPropertyOfSection($(this), attrToUse);
							if(!dataInheritedFrom)
							{
								parent.removeAttr("inheritedFrom");
							}
							if(!dataInheritedFrom)
							{
								parent.find("legend").remove();
							}
							_panel.find("fieldset:not(.inheritSet)").show();
						}
						if(!parent.hasClass("inheritValSet") && dataInheritedFrom)
						{
							parent.addClass("inheritValSet").find("legend").text(dataInheritedFrom);
						}
					}
					else
					{
						$(this).val("");
					}
				}
			});
			_panel.find("input[type='checkbox']:not(.ignoreBind), input[type='radio']:not(.ignoreBind) ").each(function(){
				if($(this).attr(attrToUse))
				{
					if(curItem)
					{
						var curData = userManager.methods.seperateValueAndInheritValue(crushFTP.data.getValueFromJson(curItem, $(this).attr(attrToUse)));
						var curVal = curData.value;
						dataInheritedFrom = curData.inherit || dataInheritedFrom || "default";
						if($(this).is(".reverse"))
						{
							crushFTP.UI.checkUnchekInput($(this), curVal != "true");
						}
						else
						{
							crushFTP.UI.checkUnchekInput($(this), curVal == "true");
						}
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
					}
					if($(this).closest("fieldset").is(".notInheritable"))
					{
						dataInheritedFrom = false;
					}

					var parent = $(this).closest("fieldset").attr("inheritedFrom", dataInheritedFrom);
					if(!voidInheritValSet)
					{
						if(!dataInheritedFrom)
						{
							parent.removeAttr("inheritedFrom");
						}
						if(!dataInheritedFrom)
						{
							parent.find("legend").remove();
						}
						userManager.data.setInheritPropertyOfSection($(this), attrToUse);
					}
					if(!parent.hasClass("inheritValSet") && dataInheritedFrom)
					{
						parent.addClass("inheritValSet").find("legend").text(dataInheritedFrom);
					}
				}
			});
			_panel.find(".liveData").each(function(){
				if($(this).attr(attrToUse))
				{
					if(curItem)
					{
						var curData = userManager.methods.seperateValueAndInheritValue(crushFTP.data.getValueFromJson(curItem, $(this).attr(attrToUse)));
						var curVal = curData.value;
						dataInheritedFrom = curData.inherit || dataInheritedFrom || "default";
						$(this).text(curVal);
					}
					else
					{
						$(this).text("");
					}
					if($(this).closest("fieldset").is(".notInheritable"))
					{
						dataInheritedFrom = false;
					}

					var parent = $(this).closest("fieldset").attr("inheritedFrom", dataInheritedFrom);
					if(!voidInheritValSet)
					{
						userManager.data.setInheritPropertyOfSection($(this), attrToUse);
						if(!dataInheritedFrom)
						{
							parent.removeAttr("inheritedFrom");
						}
						if(!dataInheritedFrom)
						{
							parent.find("legend").remove();
						}
					}
					if(!parent.hasClass("inheritValSet") && dataInheritedFrom)
					{
						parent.addClass("inheritValSet").find("legend").text(dataInheritedFrom);
					}
				}
			});
			$.crushFtpCustomization.init(_panel);
		},
		buildXMLToSubmitForm : function(_panel, includeRadio, attrToUse, ignoreNullValue, ignoreFalse, noEncode)
		{
			attrToUse = attrToUse || "id";
			var xmlString = [];
			function getValue(val) {
				if(!noEncode)
					return crushFTP.methods.htmlEncode(val);
				else
					return val;
			}
			_panel.find("input[type='text']:not(.ignoreBind, .excludeXML),input[type='password']:not(.ignoreBind, .excludeXML), textarea:not(.ignoreBind, .excludeXML), select:not(.ignoreBind, .excludeXML)").each(function(){
				if($(this).attr(attrToUse))
				{
					var curVal = getValue($(this).val());
					if($(this).hasClass("seconds") && crushFTP.methods.isNumeric(curVal)){
						var val = parseInt(curVal) * 1000;
						curVal = val;
					}
					var val;
					if($(this).hasClass('maskPasswordOnURL')){
						val = $(this).data("realURL") || $(this).data("originalURL") || $(this).data("origURL") || $(this).val();
						try{
	                    	val = crushFTP.methods.htmlEncode(decodeURIComponent(val));
	                    }catch(ex){
	                    	val = crushFTP.methods.htmlEncode((val));
	                    }
					}
					else{
						val = curVal;
					}
					if(!ignoreNullValue)
						xmlString.push("<"+$(this).attr(attrToUse)+">"+val+"</"+$(this).attr(attrToUse)+">");
					else if(val.length>0)
						xmlString.push("<"+$(this).attr(attrToUse)+">"+val+"</"+$(this).attr(attrToUse)+">");
				}
			});
			_panel.find("input[type='checkbox']:not(.ignoreBind, .excludeXML)").each(function(){
				if($(this).attr(attrToUse))
				{
					if($(this).is(".reverse"))
					{
						if(!ignoreFalse)
							xmlString.push("<"+$(this).attr(attrToUse)+">"+!$(this).is(":checked")+"</"+$(this).attr(attrToUse)+">");
						else if(!$(this).is(":checked"))
							xmlString.push("<"+$(this).attr(attrToUse)+">"+!$(this).is(":checked")+"</"+$(this).attr(attrToUse)+">");
					}
					else
					{
						if(!ignoreFalse)
							xmlString.push("<"+$(this).attr(attrToUse)+">"+$(this).is(":checked")+"</"+$(this).attr(attrToUse)+">");
						else if($(this).is(":checked"))
							xmlString.push("<"+$(this).attr(attrToUse)+">"+$(this).is(":checked")+"</"+$(this).attr(attrToUse)+">");
					}
				}
			});
			_panel.find(".liveData").each(function(){
				var curVal = getValue($(this).html());
				if($(this).attr(attrToUse) == "failure_count")
				{
					xmlString.push("<"+$(this).attr(attrToUse)+">0</"+$(this).attr(attrToUse)+">");
				}
				else
				{
					if(!ignoreNullValue)
						xmlString.push("<"+$(this).attr(attrToUse)+">"+curVal+"</"+$(this).attr(attrToUse)+">");
					else if(curVal.length>0)
						xmlString.push("<"+$(this).attr(attrToUse)+">"+curVal+"</"+$(this).attr(attrToUse)+">");
				}
			});
			if(includeRadio)
			{
				_panel.find("input[type='radio']:not(.ignoreBind, .excludeXML)").each(function(){
					if($(this).attr(attrToUse))
					{
						if(!ignoreFalse)
							xmlString.push("<"+$(this).attr(attrToUse)+">"+$(this).is(":checked")+"</"+$(this).attr(attrToUse)+">");
						else if($(this).is(":checked"))
							xmlString.push("<"+$(this).attr(attrToUse)+">"+$(this).is(":checked")+"</"+$(this).attr(attrToUse)+">");
					}
				});
			}
			return xmlString.join("\r\n");
		},
		getFieldsNameInForm : function(_panel, includeRadio, attrToUse, ignoreNullValue, ignoreFalse)
		{
			attrToUse = attrToUse || "id";
			var xmlString = [];
			_panel.find("input[type='text']:not(.excludeXML),input[type='password']:not(.excludeXML), textarea:not(.excludeXML), select:not(.excludeXML)").each(function(){
				if($(this).attr(attrToUse))
				{
					var curVal = crushFTP.methods.htmlEncode($(this).val());
					if(!ignoreNullValue)
						xmlString.push($(this).attr(attrToUse));
					else if(curVal.length>0)
						xmlString.push($(this).attr(attrToUse));
				}
			});
			_panel.find("input[type='checkbox']:not(.excludeXML)").each(function(){
				if($(this).attr(attrToUse))
				{
					if($(this).is(".reverse"))
					{
						if(!ignoreFalse)
							xmlString.push($(this).attr(attrToUse));
						else if(!$(this).is(":checked"))
							xmlString.push($(this).attr(attrToUse));
					}
					else
					{
						if(!ignoreFalse)
							xmlString.push($(this).attr(attrToUse));
						else if($(this).is(":checked"))
							xmlString.push($(this).attr(attrToUse));
					}
				}
			});
			if(includeRadio)
			{
				_panel.find("input[type='radio']:not(.excludeXML)").each(function(){
					if($(this).attr(attrToUse))
					{
						if(!ignoreFalse)
							xmlString.push($(this).attr(attrToUse));
						else if($(this).is(":checked"))
							xmlString.push($(this).attr(attrToUse));
					}
				});
			}
			return xmlString;
		},
		bindGroupDetails : function(reloadData, triggerChange, nameToSelect, callback)
		{
			function updateDetails()
			{
				var groupSelectList = $("#groupSelectList, #groupListToSelectForInheritance", "#GUIInterface").empty();
				var userList = crushFTP.storage("users");
				var groupInfoXML = $(crushFTP.storage("groupInfoXML"));
				var availableGroups = crushFTP.storage("availableGroups") || [];
				if(groupInfoXML && groupInfoXML.length>0)
				{
					groupInfoXML.find("result_item result_item").each(function(){
						var groupAndUsers = $(this).find("*[type='vector']").each(function(){
							var groupName = $(this).attr("name") || $(this).get(0).tagName;
							if(!availableGroups.has(groupName))
							{
								availableGroups.push(groupName);
							}
							groupSelectList.append("<option rel='editable' value='"+groupName+"'>"+groupName+"</option>");
							$(this).children().each(function(){
								var curUserName = $(this).text();
								for(var i=0;i<userList.length;i++)
								{
									var curUser = userList[i];
									if(curUser && curUser.text && curUser.text.toLowerCase() == curUserName.toLowerCase())
									{
										var groups = curUser.groups;
										if(!groups || !jQuery.isArray(groups))
										{
											groups = [];
										}
										if(!groups.has(groupName))
										{
											groups.push(groupName);
										}
										curUser.groups = groups;
										try{
											var curList = groupSelectList.find("option[value='"+groupName+"']");
											var curtentLoadedUserName = crushFTP.storage("userName");
											if(curtentLoadedUserName && $.trim(curtentLoadedUserName).toLowerCase() == $.trim(curUser.text).toLowerCase() && !curList.attr("processed"))
											{
												curList.text(" * " + groupName);
												curList.attr("processed", true);
											}
										}
										catch(ex){
											if(typeof window.console != "undefined")
												console.log(ex);
										}
									}
								}
							});
						});
					});
				}
				crushFTP.storage("availableGroups", availableGroups);

				groupSelectList.each(function() {
			        // Keep track of the selected option.
			        var selectedValue = $(this).val();
			        var _this = $(this);
			        // Sort all the options by text. I could easily sort these by val.
			        _this.html($("option", _this).sort(function(a, b) {
			            return a.text.toLowerCase() == b.text.toLowerCase() ? 0 : a.text.toLowerCase() < b.text.toLowerCase() ? -1 : 1
			        }));
			        // Select one option.
			        _this.val(selectedValue);
			    });

				groupSelectList.prepend("<option value='notingroup'>Not In A Group</option>");
				groupSelectList.prepend("<option value='all'>All Users</option>");
				$("#groupSelectList", "#GUIInterface").val("all");
				$("#groupListToSelectForInheritance", "#GUIInterface").prepend("<option value=''>Pick a group</option>").val("");
				if(nameToSelect)
				{
					$("#groupSelectList", "#GUIInterface").val(nameToSelect);
				}
				if(triggerChange)
					groupSelectList.trigger("change");

				groupSelectList.append("<option value='#addnewgroup#'>Add new group</option>");

				if(callback)
					callback();
			}
			if(reloadData)
			{
				var userList = $("#userList", "#GUIInterface");
				crushFTP.UI.showIndicator(false, userList, "Wait..");
				var serverGroup = $("#userConnectionGroups").val() || "MainUsers";
				userManager.dataRepo.getGroupInfo("group", serverGroup, function(info, xml){
					if(info)
					{
						crushFTP.UI.hideIndicator(false, userList);
						crushFTP.storage("groupInfo", info);
						crushFTP.storage("groupInfoXML", xml);
						updateDetails();
					}
				});
			}
			else
			{
				updateDetails();
			}
		},
		bindInheritanceDetails : function()
		{
			var userList = crushFTP.storage("users");
			var inheritanceInfoXML = $(crushFTP.storage("inheritanceInfoXML"));
			if(inheritanceInfoXML && inheritanceInfoXML.length>0)
			{
				inheritanceInfoXML.find("result_item result_item").each(function(){
					$(this).children().each(function(){
						var curelem = $(this);
						var curTag = "";
						if(curelem.is("item"))
						{
							curTag = curelem.attr("name");
						}
						else
						{
							curTag = curelem.get(0).tagName;
						}
						var curUserName = curTag;
						$(curelem).children().each(function(){
							for(var i=0;i<userList.length;i++)
							{
								var curUser = userList[i];
								if(curUser && curUser.text && curUser.text.toString().toLowerCase() == curUserName.toLowerCase())
								{
									var inheritance = curUser.inheritance;
									if(!inheritance || !jQuery.isArray(inheritance))
									{
										inheritance = [];
									}
									if(!inheritance.has($(this).text()))
										inheritance.push($(this).text());
									curUser.inheritance = inheritance;
								}
							}
						});
					});
				});
			}
		},
		showInheritanceDataForUser : function(user)
		{
			var userList = crushFTP.storage("users");
			var selectedInheritance = $("#selectedInheritance", "#GUIInterface").empty();
			var disabled = $("#userInfoInheritance").find("legend:first").hasClass("not-allowed") ? "disabled='disabled'" : "";
			var inheritance = [];
			crushFTP.removeStorage("CurrentUserInheritanceFrom");
			if(userList && userList.length>0 && user)
			{
				for(var i=0;i<userList.length;i++)
				{
					if(userList[i] && userList[i].text && userList[i].text.toString().toLowerCase() == user.toLowerCase())
					{
						inheritance = userList[i].inheritance;
						i = userList.length;
					}
				}
			}
			if(inheritance && inheritance.length>0)
			{
				//inheritance.sort();
				for(var i=0;i<inheritance.length;i++)
				{
					var curVal = crushFTP.methods.htmlEncode(inheritance[i]);
					if(curVal)
					{
						selectedInheritance.append("<span class='inherit-item' rel='"+curVal+"'><input "+disabled+" rel='"+curVal+"' checked type='checkbox' id='inheritance_"+curVal+"' /><label for='inheritance_"+curVal+"'> "+curVal+" </label></span>");
					}
				}
				//inheritance.reverse();
			}
			crushFTP.storage("CurrentUserInheritanceFrom", inheritance);
			if(!disabled){
				selectedInheritance.form().sortable(
				{
					placeholder: "drop-ph",
					helper:'clone',
					containment: $("#userInfoInheritance"),
					cursor: "move",
					cursorAt: {
						left: 5
					},
					change: function(event, ui) {

					}
				});
			}
		},
		fetchInheritanceDataForUser : function(callback){
			var inheritance = crushFTP.storage("CurrentUserInheritanceFrom");
			var inheritanceData = [];
			crushFTP.removeStorage("CurrentUserInheritanceDetails");
			if(inheritance)
			{
				var index = 0;
				function getUserData()
				{
					if(index>=inheritance.length)
					{
						if(callback)
						{
							crushFTP.storage("CurrentUserInheritanceDetails", inheritanceData);
							callback();
						}
					}
					else
					{
						var curUser = inheritance[index];
						userManager.dataRepo.getUserInfo(curUser, function(info, xml){
							if(info && xml)
							{
								inheritanceData.push({info:info, xml:xml});
							}
							index+=1;
							getUserData();
						}, false, true, false, true);
					}
				}
				getUserData();
			}
			else
			{
				if(callback)
				{

					callback();
				}
			}
		},
		storeCurrentUserInfo : function(userName)
		{
			if(userName)
			{
				crushFTP.storage("userName", userName);
				$("#placeHolder").fadeIn();
				$("#welcomeNote").fadeOut("medium");
			}
			else
			{
				crushFTP.removeStorage("userName");
				$("#placeHolder").fadeOut();
				$("#welcomeNote").fadeIn("medium");
			}
		},
		addRemoveInheritanceDetailsFromUser : function(user, inheritanceUser, remove, rebind, notSave)
		{
			var userList = crushFTP.storage("users");
			for(var i=0;i<userList.length;i++)
			{
				var curUser = userList[i];
				if(curUser && curUser.text && curUser.text.toString().toLowerCase() == user.toLowerCase())
				{
					var inheritance = curUser.inheritance;
					if(!inheritance || !jQuery.isArray(inheritance))
					{
						inheritance = [];
					}
					if(!inheritance.has(inheritanceUser))
					{
						if(!remove)
						{
							inheritance.push(inheritanceUser);
							if(!notSave)
							{
								setTimeout(function(){
									$("#applyInheritance", "#GUIInterface").trigger("click");
								}, 100);
							}
						}
					}
					else
					{
						if(remove)
						{
							try{
								inheritance.remove(inheritance.indexOf(inheritanceUser));
							}
							catch(ex){}
						}
						else
						{
							crushFTP.UI.growl("Message : ", "User '" +crushFTP.methods.htmlEncode(inheritanceUser) + "'  already added to inherit from", false, 3000);
						}
					}
					curUser.inheritance = inheritance;
				}
			}
			if(rebind)
			{
				userManager.data.showInheritanceDataForUser(user);
			}
		},
		addUsersToGroup : function(selectedGroupName, users, callback)
		{
			var serverGroup = $("#userConnectionGroups").val() || "MainUsers";
			crushFTP.UI.showLoadingIndicator(true);
			userManager.dataRepo.getGroupInfo("group", serverGroup, function(info, xml){
				if(info)
				{
					crushFTP.storage("groupInfo", info);
					crushFTP.storage("groupInfoXML", xml);
					var groupUsernameExists = false;

					var groupInfoXML = $(crushFTP.storage("groupInfoXML"));
					//Method to save group
					var xml = [];
					xml.push("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
					xml.push("<groups type=\"properties\">");

					if(groupInfoXML && groupInfoXML.length>0)
					{
						var allUsers = crushFTP.storage("users");
						if(allUsers && allUsers.length>0)
						{
							for(var i=0;i<allUsers.length;i++)
							{
								if(allUsers[i] && allUsers[i].text && allUsers[i].text.toString().toLowerCase() == selectedGroupName.toLowerCase())
								{
									groupUsernameExists = true;
									break;
								}
							}
						}

						groupInfoXML.find("result_item result_item").each(function(){
							var groupAndUsers = $(this).find("*[type='vector']").each(function(){
								var groupName = $(this).attr("name") || $(this).get(0).tagName;
								var addedUsers = [];
								xml.push("<item name=\""+crushFTP.methods.htmlEncode(groupName)+"\" type=\"vector\">");
								$(this).children().each(function(){
									if($(this).text().length>0)
									{
										xml.push("<item_subitem>"+crushFTP.methods.htmlEncode($(this).text())+"</item_subitem>");
										addedUsers.push($(this).text());
									}
								});
								if(typeof groupName != "undefined" && typeof selectedGroupName != "undefined" && $.trim(groupName).toUpperCase() == selectedGroupName.toUpperCase())
								{
									for(var j=0;j<users.length;j++)
									{
										if(!addedUsers.has(users[j]) && users[j] != undefined && users[j] != 'undefined')
										{
											xml.push("<item_subitem>"+crushFTP.methods.htmlEncode(users[j])+"</item_subitem>");
											if(groupUsernameExists && users[j].toUpperCase()!= selectedGroupName.toUpperCase())
											{
												userManager.data.addRemoveInheritanceDetailsFromUser(users[j], selectedGroupName, false, true, true);
											}
										}
									}
								}
								xml.push("</item>");
							});
						});
					}
					xml.push("</groups>");
					function continueAdding(){
						crushFTP.UI.showLoadingIndicator(true);
						userManager.dataRepo.saveGroupInfo(xml.join("\r\n"), crushFTP.storage("userName"), "update", function(data){
							if(data)
							{
								userManager.data.bindGroupDetails(true, true, selectedGroupName, callback);
								crushFTP.UI.growl("Message : ", "Users \"" +crushFTP.methods.htmlEncode(users.join(", "))+ "\" added to group \""+ crushFTP.methods.htmlEncode(selectedGroupName) + "\"", false, 3000);
								crushFTP.UI.hideLoadingIndicator();
							}
							else
							{
								crushFTP.UI.growl("Failure: ", DOMPurify.sanitize(data), true, true);
							}
						});
						if (groupUsernameExists)
						{
							xml = userManager.data.buildInheritanceXML();
							crushFTP.UI.showLoadingIndicator(true);
							userManager.dataRepo.saveInheritanceInfo(xml.join("\r\n"), crushFTP.storage("userName"), "update", function(data){
								if(data)
								{
									crushFTP.UI.growl("Message : ", "User's inheritance data saved", false, 3000);
									crushFTP.UI.hideLoadingIndicator();
									userManager.methods.removeUsersLocalStorage();
									userManager.placeHolder.removeData("hasChanged");
									userManager.changedSettings = [];
									crushFTP.removeStorage("CurrentUserInheritanceDetails");
									$("a.reloadUsersLink:visible", "#sideBar").trigger("click");
								}
								else
								{
									crushFTP.UI.growl("Failure: ", DOMPurify.sanitize(data), true, true);
								}
							});
						}
					}
					crushFTP.UI.hideLoadingIndicator();
					crushFTP.Replication.showOptionsOrContinue(continueAdding);
				}
			});
		},
		buildInheritanceXML : function()
		{
			//Method to save inheritance
			var xml = [];
			xml.push("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
			xml.push("<inheritance type=\"properties\">");

			var usersList = crushFTP.storage("users");
			if(usersList && usersList.length>0)
			{
				for(var i=0;i<usersList.length;i++)
				{
					var curUserName = usersList[i].text;
					if(curUserName && curUserName.length>0)
					{
						var inheritanceData = usersList[i].inheritance;
						if(inheritanceData && inheritanceData.length>0)
						{
							xml.push("<item name=\""+crushFTP.methods.htmlEncode(curUserName)+"\" type=\"vector\">");
							for(var j=0;j<inheritanceData.length;j++)
							{
								xml.push("<item_subitem>"+crushFTP.methods.htmlEncode(inheritanceData[j])+"</item_subitem>");
							}
							xml.push("</item>");
						}
					}
				}
			}
			xml.push("</inheritance>");
			return xml;
		},
		copyUsersGroupInfo : function(sourceUser, newUser, callback, replace, renamingUser, oldUserName){
			if(!sourceUser ||  !newUser || !callback) return;
			sourceUser = sourceUser.toLowerCase();
			var serverGroup = $("#userConnectionGroups").val() || "MainUsers";
			crushFTP.UI.showLoadingIndicator(true);
			userManager.dataRepo.getGroupInfo("group", serverGroup, function(info, xml){
				if(info)
				{
					if(!renamingUser)
					{
						crushFTP.storage("groupInfo", info);
						crushFTP.storage("groupInfoXML", xml);
					}
					var groupInfoXML = $(crushFTP.storage("groupInfoXML"));
					//Method to save group
					var xml = [];
					xml.push("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
					xml.push("<groups type=\"properties\">");
					if(groupInfoXML && groupInfoXML.length>0)
					{
						groupInfoXML.find("result_item result_item").each(function(){
							var groupAndUsers = $(this).find("*[type='vector']").each(function(){
								var groupName = $(this).attr("name") || $(this).get(0).tagName;
								xml.push("<item name=\""+crushFTP.methods.htmlEncode(groupName)+"\" type=\"vector\">");
								$(this).children().each(function(){
									if(replace)
									{
										if($(this).text().toLowerCase() == sourceUser)
										{
											xml.push("<item_subitem>"+crushFTP.methods.htmlEncode(newUser)+"</item_subitem>");
										}
										else
										{
											if($(this).text())
												xml.push("<item_subitem>"+crushFTP.methods.htmlEncode($(this).text())+"</item_subitem>");
										}
									}
									else
									{
										if($(this).text())
											xml.push("<item_subitem>"+crushFTP.methods.htmlEncode($(this).text())+"</item_subitem>");

										if($(this).text().toLowerCase() == sourceUser)
										{
											xml.push("<item_subitem>"+crushFTP.methods.htmlEncode(newUser)+"</item_subitem>");
										}
									}
								});
								xml.push("</item>");
							});
						});
					}
					xml.push("</groups>");
					var userName = renamingUser ? newUser : crushFTP.storage("userName");
					userManager.dataRepo.saveGroupInfo(xml.join("\r\n"), userName, "update", function(data){
						if(data)
						{
							callback(true);
						}
						else
						{
							callback(false);
							crushFTP.UI.growl("Failure: ", DOMPurify.sanitize(data), true, true);
						}
					}, undefined, oldUserName);
				}
			});
		},
		copyUsersInheritanceInfo : function(sourceUser, newUser, callback, replace, renamingUser, oldUserName)
		{
			if(!sourceUser ||  !newUser || !callback) return;
			sourceUser = sourceUser.toLowerCase();
			//Method to save inheritance
			var xml = [];
			xml.push("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
			xml.push("<inheritance type=\"properties\">");

			var usersList = crushFTP.storage("users");
			if(usersList && usersList.length>0)
			{
				for(var i=0;i<usersList.length;i++)
				{
					var curUserName = usersList[i].text;
					if(curUserName && curUserName.length>0)
					{
						var inheritanceData = usersList[i].inheritance;
						if(inheritanceData)
						{
							if(replace)
							{
								if(curUserName.toLowerCase() == sourceUser)
								{
									xml.push("<item name=\""+newUser+"\" type=\"vector\">");
									for(var j=0;j<inheritanceData.length;j++)
									{
										if(inheritanceData[j])
											xml.push("<item_subitem>"+inheritanceData[j]+"</item_subitem>");
									}
									xml.push("</item>");
								}
								else
								{
									xml.push("<item name=\""+curUserName+"\" type=\"vector\">");
									for(var j=0;j<inheritanceData.length;j++)
									{
										if(inheritanceData[j])
											xml.push("<item_subitem>"+inheritanceData[j]+"</item_subitem>");
									}
									xml.push("</item>");
								}
							}
							else
							{
								xml.push("<item name=\""+curUserName+"\" type=\"vector\">");
								for(var j=0;j<inheritanceData.length;j++)
								{
									if(inheritanceData[j])
										xml.push("<item_subitem>"+inheritanceData[j]+"</item_subitem>");
								}
								xml.push("</item>");
								if(curUserName.toLowerCase() == sourceUser)
								{
									xml.push("<item name=\""+newUser+"\" type=\"vector\">");
									for(var j=0;j<inheritanceData.length;j++)
									{
										if(inheritanceData[j])
											xml.push("<item_subitem>"+inheritanceData[j]+"</item_subitem>");
									}
									xml.push("</item>");
								}
							}
						}
					}
				}
			}
			xml.push("</inheritance>");
			crushFTP.UI.showLoadingIndicator(true);
			var userName = renamingUser ? newUser : crushFTP.storage("userName");
			userManager.dataRepo.saveInheritanceInfo(xml.join("\r\n"), userName, "update", function(data){
				if(data)
				{
					if(!replace)
					{
						userManager.methods.removeUsersLocalStorage();
						crushFTP.removeStorage("CurrentUserInheritanceDetails");
						$("a.refresh", "#sideBar").trigger("click");
					}
					callback(true);
				}
				else
				{
					callback(false);
					crushFTP.UI.growl("Failure: ", DOMPurify.sanitize(data), true, true);
				}
			}, undefined, oldUserName);
		},
		copyExtraVFSInfo : function(sourceUserXML, sourceUserName, newUserName, callback){
			if(!sourceUserXML || !newUserName || !sourceUserName) callback();
			var extraVFSItems = sourceUserXML.find("extra_vfs:first").find("extra_vfs_subitem");
			if(extraVFSItems && extraVFSItems.length>0)
			{
				var itms = [];
				extraVFSItems.each(function(){
					itms.push($(this).text());
				});
				function copyExtraItem()
				{
					if(itms.length>0)
					{
						var curUser = itms[0];
						var usrExtraVFS = sourceUserName + "~" + curUser;
						var newExtraVFS = crushFTP.methods.htmlEncode(newUserName + "~" + curUser);
						userManager.dataRepo.getUserInfo(usrExtraVFS, function(data, xml){
							var usersData = $.xml2json(xml, false);
							if(usersData && usersData["response_status"] && usersData["response_status"] == "OK")
							{
								var xmlPrivs = [];
								function traverseAndBuildPrivsXML(tree) {
								    $(tree).contents().each(function() {
								        if (this.nodeType == 3) {
								            xmlPrivs.push(crushFTP.methods.xmlEncode($(this).text()));
								        } else {
								        	var attrs = "";
							                for (var i=0; i<this.attributes.length; i++)
							                {
							                	var name = this.attributes.item(i).nodeName;
							                    attrs += name+"=\"" + $(this).attr(name) + "\"";
							                }
								        	xmlPrivs.push("<"+this.nodeName+" "+attrs+">");
								            traverseAndBuildPrivsXML(this);
								            xmlPrivs.push("</"+this.nodeName+">");
								        }
								    });
								}
								traverseAndBuildPrivsXML($(xml).find("permissions[type='properties']"));
								var privs = "<VFS type=\"properties\">" + xmlPrivs.join("") + "</VFS>";
								if(xmlPrivs.length==0)
									privs = "<VFS type=\"vector\"></VFS>";

								var userItems = usersData.response_data.user_items;
								var vfs = panelSetup.generateVFSXML(userItems, true);
								if(!vfs)
								{
									vfs = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><vfs type=\"vector\"></vfs>";
								}

								userManager.dataRepo.saveUserInfo("<?xml version=\"1.0\" encoding=\"UTF-8\"?><user type=\"properties\"><username>"+newExtraVFS+"</username><password></password><max_logins>0</max_logins><root_dir>/</root_dir></user>", vfs,"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n" + privs, newExtraVFS, "new", function(response){
									itms.remove(0);
									copyExtraItem();
								}, false, true);
							}
							else
							{
								itms.remove(0);
								copyExtraItem();
							}

						}, false, true, true);
					}
					else
					{
						callback(true);
					}
				}
				copyExtraItem();
			}
			else
			{
				callback(true);
			}
		},
		renameExtraVFSInfo : function(oldName, newUserName, callback){
			if(!oldName || !newUserName) callback();
			userManager.dataRepo.getUserInfo(oldName, function(data, xml){
				var usersData = $.xml2json(xml, false);
				if(usersData && usersData["response_status"] && usersData["response_status"] == "OK")
				{
					var xmlPrivs = [];
					function traverseAndBuildPrivsXML(tree) {
					    $(tree).contents().each(function() {
					        if (this.nodeType == 3) {
					            xmlPrivs.push(crushFTP.methods.xmlEncode($(this).text()));
					        } else {
					        	var attrs = "";
				                for (var i=0; i<this.attributes.length; i++)
				                {
				                	var name = this.attributes.item(i).nodeName;
				                    attrs += name+"=\"" + $(this).attr(name) + "\"";
				                }
					        	xmlPrivs.push("<"+this.nodeName+" "+attrs+">");
					            traverseAndBuildPrivsXML(this);
					            xmlPrivs.push("</"+this.nodeName+">");
					        }
					    });
					}
					traverseAndBuildPrivsXML($(xml).find("permissions[type='properties']"));
					var privs = "<VFS type=\"properties\">" + xmlPrivs.join("") + "</VFS>";
					if(xmlPrivs.length==0)
							privs = "<VFS type=\"vector\"></VFS>";
					var userItems = usersData.response_data.user_items;
					var vfs = panelSetup.generateVFSXML(userItems, true);
					if(!vfs)
					{
						vfs = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><vfs type=\"vector\"></vfs>";
					}
					userManager.dataRepo.saveUserInfo("<?xml version=\"1.0\" encoding=\"UTF-8\"?><user type=\"properties\"><username>"+newUserName+"</username><password></password><max_logins>0</max_logins><root_dir>/</root_dir></user>", vfs,"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n" + privs, newUserName, "new", function(response){
						userManager.dataRepo.saveUserInfo("<?xml version=\"1.0\" encoding=\"UTF-8\"?>", "<?xml version=\"1.0\" encoding=\"UTF-8\"?><vfs type=\"vector\"></vfs>", "<?xml version=\"1.0\" encoding=\"UTF-8\"?><permissions type=\"vector\"></permissions>", oldName, "delete", function(data)
						{
							callback(data);
						}, false, true);
					}, false, true);
				}
				else
				{
					callback(false);
				}
			}, false, true, true);
		},
		deleteExtraVFSUsers : function(itms, callback){
			if(!itms) callback();
			var deletingUsers = $.extend(true, [], itms);
			if(deletingUsers && deletingUsers.length>0)
			{
				function deleteExtraItem()
				{
					if(deletingUsers.length>0)
					{
						var curUser = deletingUsers[0];
						userManager.dataRepo.getUserInfo(curUser, function(data, xml){
							var extraUsers = [];
							$(xml).find("extra_vfs_subitem").each(function(){
								extraUsers.push(curUser + "~" + $(this).text());
							});
							if(extraUsers.length>0)
							{
								userManager.dataRepo.saveUserInfo("<?xml version=\"1.0\" encoding=\"UTF-8\"?>", "<?xml version=\"1.0\" encoding=\"UTF-8\"?><vfs type=\"vector\"></vfs>", "<?xml version=\"1.0\" encoding=\"UTF-8\"?><permissions type=\"vector\"></permissions>", extraUsers.join(";"), "delete", function(data)
								{
									deletingUsers.remove(0);
									deleteExtraItem();
								}, false, true);
							}
							else
							{
								deletingUsers.remove(0);
								deleteExtraItem();
							}
						}, false, true);
					}
					else
					{
						callback(true);
					}
				}
				deleteExtraItem();
			}
			else
			{
				callback(true);
			}
		},
		renameExtraItems : function(oldName, newName, callback)
		{
			if(!oldName || !newName) callback();
			if(oldName==newName)callback();
			var xml = crushFTP.storage("currentUserXML");
			var extraUsers = [];
			$(xml).find("extra_vfs_subitem").each(function(){
				extraUsers.push($(this).text());
			});
			function renameItem()
			{
				if(extraUsers.length>0)
				{
					if(newName != "undefined" && typeof newName !="undefined")
					{
						var curUser = extraUsers[0];
						var usrExtraVFS = oldName + "~" + curUser;
						var newExtraVFS = crushFTP.methods.htmlEncode(newName + "~" + curUser);
						userManager.dataRepo.getUserInfo(usrExtraVFS, function(data, xml){
							var usersData = $.xml2json(xml, false);
							if(usersData && usersData["response_status"] && usersData["response_status"] == "OK")
							{
								var xmlPrivs = [];
								function traverseAndBuildPrivsXML(tree) {
								    $(tree).contents().each(function() {
								        if (this.nodeType == 3) {
								            xmlPrivs.push(crushFTP.methods.xmlEncode($(this).text()));
								        } else {
								        	var attrs = "";
							                for (var i=0; i<this.attributes.length; i++)
							                {
							                	var name = this.attributes.item(i).nodeName;
							                    attrs += name+"=\"" + $(this).attr(name) + "\"";
							                }
								        	xmlPrivs.push("<"+this.nodeName+" "+attrs+">");
								            traverseAndBuildPrivsXML(this);
								            xmlPrivs.push("</"+this.nodeName+">");
								        }
								    });
								}
								traverseAndBuildPrivsXML($(xml).find("permissions[type='properties']"));
								var privs = "<VFS type=\"properties\">" + xmlPrivs.join("") + "</VFS>";
								if(xmlPrivs.length==0)
									privs = "<VFS type=\"vector\"></VFS>";
								var userItems = usersData.response_data.user_items;
								var vfs = panelSetup.generateVFSXML(userItems, true);
								if(!vfs)
								{
									vfs = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><vfs type=\"vector\"></vfs>";
								}

								userManager.dataRepo.saveUserInfo("<?xml version=\"1.0\" encoding=\"UTF-8\"?>", "<?xml version=\"1.0\" encoding=\"UTF-8\"?><vfs type=\"vector\"></vfs>", "<?xml version=\"1.0\" encoding=\"UTF-8\"?><permissions type=\"vector\"></permissions>", usrExtraVFS, "delete", function(delData){
									if(delData)
									{
										userManager.dataRepo.saveUserInfo("<?xml version=\"1.0\" encoding=\"UTF-8\"?><user type=\"properties\"><username>"+newExtraVFS+"</username><password></password><max_logins>0</max_logins><root_dir>/</root_dir></user>", vfs,"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n" + privs, newExtraVFS, "replace", function(response)
										{
											extraUsers.remove(0);
											renameItem();
										}
										, false, true);
									}
								}, false, true);
							}
							else
							{
								extraUsers.remove(0);
								renameItem();
							}
						}, false, true, true);
					}
					else
					{
						extraUsers.remove(0);
						renameItem();
					}
				}
				else
				{
					callback(true);
				}
			}
			renameItem();
		},
		saveBatchInfo : function(callback, remove, checkbox, selectedOnly)
		{
			var isSpecialProperty = false;
			var userXMLSpecial = "";
			var removeKeys = "";
			var isVFS = false;
			if(checkbox.closest("td.checkboxArea").is(".specialProperty") || checkbox.closest("td.checkboxArea").is(".extraFields"))
			{
				isSpecialProperty = true;
				var propertyType = checkbox.closest("td.checkboxArea").attr("propertyType");
				propertyType = propertyType.split(":");
				var panel = propertyType[0];
				var property = propertyType[1];
				if(remove)
				{
					var temp = "";
					var cmd = "temp = " +panel + ".generateSpecialItemsXML('"+property+"','remove')";
					eval(cmd);
					removeKeys = temp;
				}
				else
				{
					if(property == "VFS")
					{
						isVFS = true;
					}
					else
					{
						var temp = "";
						var cmd = "temp = " +panel + ".generateSpecialItemsXML('"+property+"')";
						eval(cmd);
						userXMLSpecial = temp;
					}
				}
			}
			var usersToUpdate = [];
			var formPanel = checkbox.closest("fieldset");
			if(selectedOnly)
			{
				$("#userList").find("option:selected").each(function()
				{
					var userName = crushFTP.methods.htmlEncode($(this).attr("userName"));
					usersToUpdate.push(userName);
				});
			}
			else{
				if(!userManager.lastSelectedGroup || userManager.lastSelectedGroup == "all")
				{
					var usrs = crushFTP.storage("users");
					for (var i = 0; i < usrs.length; i++) {
						usersToUpdate.push(usrs[i].text);
					};
				}
				else{
					$("#userList").find("option").each(function()
					{
						var userName = crushFTP.methods.htmlEncode($(this).attr("userName"));
						usersToUpdate.push(userName);
					});
				}
			}
			var currentUserName = crushFTP.storage("userName");
			if(usersToUpdate.indexOf(currentUserName)<0)
				usersToUpdate.push(currentUserName);
			var serverGroup = $("#userConnectionGroups").val() || "MainUsers";
			var objData = {
				command: 'setUserItem',
				data_action : "update",
				serverGroup : serverGroup,
				usernames : usersToUpdate.join(";"),
				xmlItem : "user"
			};
			if(isVFS)
			{
				var vfs_items = panelSetup.generateVFSXML(false, true);
				var permissions = panelSetup.generatePrivsXML(false, true);
				if(vfs_items)
				{
					objData.vfs_items = vfs_items;
				}
				else
				{
					objData.vfs_items  = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><vfs type=\"vector\"></vfs>";
				}
				if(permissions)
				{
					objData.permissions = permissions;
				}

				objData.user = '<?xml version="1.0" encoding="UTF-8"?><user type="properties"><root_dir>'+$("#root_dir", panelSettings._panel).val()+'</root_dir></user>';
			}
			else
			{
				if(!isSpecialProperty)
				{
					if(remove)
					{
						var fieldsToRemove = userManager.data.getFieldsNameInForm(formPanel);
						objData.data_action = "update_remove";
						objData.update_remove_key = fieldsToRemove.join(";");
						objData.user = '';
					}
					else{
						var userXML = userManager.data.buildXMLToSubmitForm(formPanel);
						if(userXML && userXML.length>0)
						{
							userXML = '<?xml version="1.0" encoding="UTF-8"?><user type="properties">' + userXML + '</user>';
						}
						objData.user = userXML;
					}
				}
				else
				{
					if(remove)
					{
						objData.data_action = "update_remove";
						objData.update_remove_key = removeKeys;
						objData.user = '';
					}
					else{
						if(userXMLSpecial && userXMLSpecial.length>0)
						{
							userXMLSpecial = '<?xml version="1.0" encoding="UTF-8"?><user type="properties">' + userXMLSpecial + '</user>';
						}
						objData.user = userXMLSpecial;
					}
				}
			}
			crushFTP.data.serverRequest(objData, function(data, XMLHttpRequest, textStatus, errorThrown){
				if(data)
				{
					var usersData = $.xml2json(data, false);
					if(usersData && usersData["response_status"] && usersData["response_status"]== "OK")
					{
						if(selectedOnly)
							crushFTP.UI.growl("Success!","Settings for all selected users saved successfully!", false, 3000);
						else
							crushFTP.UI.growl("Success!","Settings for all listed users saved successfully!", false, 3000);
						if(callback)
						{
							callback(true, data);
						}
						userManager.methods.changesSavedForPanel(formPanel.attr("_uniqueID"));
					}
					else
					{
						crushFTP.UI.growl("Failure", DOMPurify.sanitize($(data).text()), true, true);
						if(callback)
						{
							callback(false, data);
						}
					}
				}
				else
				{
					crushFTP.UI.growl("Failure", DOMPurify.sanitize($(data).text()), true, true);
					if(callback)
					{
						callback(false, XMLHttpRequest, textStatus, errorThrown);
					}
				}
			});
		}
	},
	dataRepo :
	{
		bindUserList : function (callback)
		{
			if(crushFTP.storage("userList"))
			{
				callback(crushFTP.storage("userList"));
				return;
			}
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
							if(userManager.data.undeleteUser)
							{
								userList.push({text : userManager.data.undeleteUser, deleted: true});
							}
							if(callback)
							{
								crushFTP.storage("userList", userList);
								setTimeout(function(){
									crushFTP.removeStorage("userList");
								}, 2000);
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
			if(userManager.onlyVFS && userManager.onlyVFSServerGroup)
			{
				userConnectionGroups.val(userManager.onlyVFSServerGroup).trigger("change");
			}
		},
		getUserInfo : function(user, callback, trackInfo, returnDataOnly, isExtraVFS, isInheritance, loadPreview) {
			var context = this;
			if($.trim(user).toLowerCase() == "default" && !trackInfo && !returnDataOnly && !isExtraVFS && !isInheritance)
			{
				if(crushFTP.storage("defaultUser") && crushFTP.storage("defaultUserXML"))
				{
					callback(crushFTP.storage("defaultUser") ,crushFTP.storage("defaultUserXML"));
					return;
				}
			}
			function getUserCall()
			{
				var serverGroup = $("#userConnectionGroups").val() || "MainUsers";
				if(isExtraVFS)
					serverGroup = userManager.extraVFSServerGroup;
				var obj = {
					command: 'getUser',
					serverGroup : serverGroup,
					username : user
				};
				if(loadPreview && loadPreview.user == user){
					obj.serverGroup += "_restored_backup";
					obj.user_zip_file = loadPreview.zip;
				}
				crushFTP.data.serverRequest(obj,
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
									crushFTP.storage("currentUserXML", data);
									if(trackInfo)
									{
										userManager.data.storeCurrentUserInfo(user);
										var selectedGroup = $("#groupSelectList").val();
										if(!selectedGroup || selectedGroup.length == 0) selectedGroup = "all";
										userManager.data.bindGroupDetails(false, false, selectedGroup);
									}
								}
								if(user == "default"){
									crushFTP.storage("defaultUser", userItems);
									crushFTP.storage("defaultUserXML", data);
								}
								callback(userItems, data);
							}
							if(loadPreview && loadPreview.user == user){
								if(userManager.data.undeleteUser){
									$('#undeleteMessage').show().find("span.user").text(user).end().find("span.version").text(moment(loadPreview.date).format("MM/DD/YYYY"));
									delete userManager.data.undeleteUser;
									userManager.methods.clearUserPreview();
								}
								else{
									setTimeout(function(){
										$('#rollbackMessage').show().find("span.user").text(user).end().find("span.version").text(loadPreview.date);
									}, 1000);
								}
								userManager.methods.itemsChanged(true, {});
							}
							else{
								$('#rollbackMessage, #undeleteMessage').hide();
								$("#userList").find("option.deleted").remove();
								var users = crushFTP.storage("users");
								var filtered = [];
								for (var i = 0; i < users.length; i++) {
									if(!users[i].deleted){
										filtered.push(users[i]);
									}
								}
								crushFTP.storage("users", filtered);
							}
							if(!userManager.data.undeleteUser)
							{
								userManager.methods.clearUserPreview();
							}
						}
						else
						{
							if(isInheritance)
								crushFTP.UI.growl("Failure", DOMPurify.sanitize($(data).find("response_status").text()) + "<br>(Problem while fetching user info from inheritance, may be inherited user is no longer available or have corrupted XML)", true, true);
							else
								crushFTP.UI.growl("Failure", DOMPurify.sanitize($(data).find("response_status").text()) + "<br>User xml not found or corrupted", true, true);
							if(trackInfo)
							{
								userManager.data.storeCurrentUserInfo(false);
							}
							if(callback)
							{
								callback(false);
							}
						}
					}
					else
					{
						if(isInheritance)
							crushFTP.UI.growl("Failure", DOMPurify.sanitize($(data).find("response_status").text()) + "<br>(Problem while fetching user info from inheritance, may be inherited user is no longer available or have corrupted XML)", true, true);
						else
							crushFTP.UI.growl("Failure", DOMPurify.sanitize($(data).find("response_status").text()) + "<br>User xml not found or corrupted", true, true);
						if(trackInfo)
						{
							userManager.data.storeCurrentUserInfo(false);
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
				userManager.dataRepo.refreshDefaultUserData(function(info, xml){
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
		saveUserVFS : function(vfs_items, permissions, userName, callback)
		{
			var serverGroup = $("#userConnectionGroups").val() || "MainUsers";
			var objData = {
				command: 'setUserItem',
				data_action : 'replace',
				serverGroup : serverGroup,
				username : userName
			};
			if(vfs_items)
			{
				objData.vfs_items = vfs_items;
			}
			else
			{
				objData.vfs_items  = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><vfs type=\"vector\"></vfs>";
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
						var selfRegisterGroupName = "pendingSelfRegistration";
						var allUsers = crushFTP.storage("users");
						var isSelfRegistered = false;
						for(var i=0;i<allUsers.length;i++)
						{
							var curUser = allUsers[i];
							if(curUser.text == userName && curUser.groups && curUser.groups.has(selfRegisterGroupName))
							{
								isSelfRegistered = true;
								i = allUsers.length;
							}
						}
						if(isSelfRegistered)
						{
							userManager.data.removeUsersFromGroup(selfRegisterGroupName, [userName], false, function(){
								if(callback)
								{
									callback(data, false, true);
								}
							});
						}
						else
						{
							if(callback)
							{
								callback(data);
							}
						}
					}
					else
					{
						crushFTP.UI.growl("Failure", DOMPurify.sanitize($(data).text()), true, true);
						if(callback)
						{
							callback(false, data);
						}
					}
				}
				else
				{
					crushFTP.UI.growl("Failure", DOMPurify.sanitize($(data).text()), true, true);
					if(callback)
					{
						callback(false, XMLHttpRequest, textStatus, errorThrown);
					}
				}
			});
		},
		//Expects user name, action as new, update or delete, a callback function and a flag if to track current user or not
		saveUserInfo : function(user, vfs_items, permissions, userName, action, callback, noGrowl, isExtraVFS, expire_user, oldUserName) {
			var context = this;
			var serverGroup = $("#userConnectionGroups").val() || "MainUsers";
			if(isExtraVFS)
				serverGroup = userManager.extraVFSServerGroup;
			var objData = {
				command: 'setUserItem',
				data_action : action || 'new',
				serverGroup : serverGroup,
				username : userName
			};
			if(oldUserName){
				objData.old_username = oldUserName;
			}
			if(crushFTP.replicationSavePrefs){
				objData.ui_save_preferences_item = crushFTP.replicationSavePrefs;
			}
			if(action == "delete")
			{
				delete objData.username;
				objData.usernames = userName;
				if(expire_user)
					objData.expire_user = expire_user;
			}
			if(user)
			{
				objData.user = user.replace(/crush_value1/g, 'user_name').replace(/crush_value2/g, 'password');
				objData.xmlItem = "user";
			}
			if(vfs_items)
			{
				objData.vfs_items = vfs_items;
			}
			else
			{
				objData.vfs_items  = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><vfs type=\"vector\"></vfs>";
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
						function continueProcess(){
							var selfRegisterGroupName = "pendingSelfRegistration";
							var allUsers = crushFTP.storage("users");
							var isSelfRegistered = false;
							for(var i=0;i<allUsers.length;i++)
							{
								var curUser = allUsers[i];
								if(curUser.text == userName && curUser.groups && curUser.groups.has(selfRegisterGroupName))
								{
									isSelfRegistered = true;
									i = allUsers.length;
								}
							}
							if(isSelfRegistered)
							{
								userManager.data.removeUsersFromGroup(selfRegisterGroupName, [userName], false, function(){
									if(callback)
									{
										callback(data, false, true);
									}
								});
							}
							else
							{
								if(callback)
								{
									callback(data);
								}
							}
							if($(objData.user).find("account_expire").text())
							{
								$('#expiredLabel').hide();
								setTimeout(function(){
									if(userManager.methods.getServerTime && typeof userManager.methods.getServerTime == "function"){
										var accExpDate = new Date($(objData.user).find("account_expire").text()).getTime();
										userManager.methods.getServerTime(function(time){
											var curTime = time.getTime();
											if(accExpDate < curTime){
												$('#expiredLabel').show();
											}
										});
									}
								}, 100);
							}
						}
						if(userName.toLowerCase() == "default"){
							userManager.dataRepo.refreshDefaultUserData(function(info, xml){
								if(info)
								{
									continueProcess();
								}
							}, true);
						}
						else{
							continueProcess();
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
		saveGroupInfo : function(groupXML, userName, action, callback, noGrowl, oldUserName) {
			var context = this;
			var serverGroup = $("#userConnectionGroups").val() || "MainUsers";
			var objData = {
				command: 'setUserItem',
				data_action : action || 'new',
				serverGroup : serverGroup,
				username : crushFTP.methods.htmlEncode(userName),
				xmlItem : "groups",
				groups : groupXML
			};
			if(oldUserName){
				objData.old_username = oldUserName;
			}
			if(crushFTP.replicationSavePrefs){
				objData.ui_save_preferences_item = crushFTP.replicationSavePrefs;
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
		saveInheritanceInfo : function(inheritanceXML, userName, action, callback, noGrowl, oldUserName) {
			var context = this;
			var serverGroup = $("#userConnectionGroups").val() || "MainUsers";
			var objData = {
				command: 'setUserItem',
				data_action : action || 'new',
				serverGroup : serverGroup,
				username : userName,
				xmlItem : "inheritance",
				inheritance : inheritanceXML
			};
			if(oldUserName){
				objData.old_username = oldUserName;
			}
			if(crushFTP.replicationSavePrefs){
				objData.ui_save_preferences_item = crushFTP.replicationSavePrefs;
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
		refreshDefaultUserData : function(callback, force){
			if(!force && crushFTP.storage("defaultUser") && crushFTP.storage("defaultUserXML"))
			{
				callback(crushFTP.storage("defaultUser") ,crushFTP.storage("defaultUserXML"));
				return;
			}
			if(force){
				crushFTP.removeStorage("defaultUser");
				crushFTP.removeStorage("defaultUserXML");
			}
			userManager.dataRepo.getUserInfo("default", function(info, xml){
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
			var mainServerInstance = localStorage.getItem("mainServerInstance");
			if(mainServerInstance!=null && mainServerInstance.length>0 && mainServerInstance.toLowerCase()!= "main")
				crushFTP.ajaxCallURL = userManager.ajaxCallURL = userManager.ajaxCallURLBase + mainServerInstance + "/";
			window.onbeforeunload = userManager.methods.confirmExit;
			userManager.placeHolder = $("#placeHolder");
			userManager.GUIInterface = $("#GUIInterface");
			$(document).data("pageTitle", document.title);
			crushFTP.UI.showLoadingIndicator(true);
			userManager.methods.prepareDataRepo(function(){
				userManager.methods.bindEmailTemplates();
				crushFTP.UI.showLoadingIndicator(true);
				userManager.methods.loadPanels(false, function(){
					userManager.methods.applyLimitedAdminRestrictions();
					userManager.methods.buildUserList();
					userManager.UI.initEvents();
					userManager.data.bindGroupDetails();
					userManager.data.bindInheritanceDetails();
					crushFTP.UI.hideLoadingIndicator();

					setTimeout(function(){
						$("#filterUserInList", "#GUIInterface").focus().select();
					}, 10);
					/*added by carlos for continue the tour */
					if( crushFTP.methods.queryString("tour") == "y" || $.jStorage.get("tour") == "y" ){
						showControls(mainTour2, 'r', true);
					}
					/*added by carlos for continue the tour DMZ */
					if( crushFTP.methods.queryString("tourDMZ") == "y" || $.jStorage.get("tourDMZ") == "y" ){
						userManager.methods.checkUserNameAvailability("template", function(available){
							if(!available){
								showControls(dmzTour2, 'r', true);
							} else {
								jAlert("User already exist, please delete the username \"template\" and run the tour again.", "Message", function(){
									if($.jStorage.storageAvailable()){
	            						$.jStorage.deleteKey("tourDMZ");
	        						}
								});
							}
						});
					}
					if(userManager.defaultUserToLoad.length>0)
					{
						var user = $("#userList").find("option[userName='"+userManager.defaultUserToLoad+"']").attr("selected","selected");
						if(user.length>0)
							$("#userList").trigger("change");
						else
						{
							// crushFTP.UI.growl("Error", "Not able to find specified user: " + crushFTP.methods.htmlEncode(userManager.defaultUserToLoad), true);
							userManager.methods.loadUserFromData(userManager.defaultUserToLoad);
							// console.log("Loaded from data");
						}
					}
				});
			});

			$("#user_password_prompt").keypress(function (e) {
				if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
					$(".ui-dialog-buttonpane:visible").find("button:last").trigger("click");
					return false;
				} else {
					return true;
				}
			});
			$(document).on("dialogopen", ".ui-dialog", function (event, ui) {
			    $('body').css("overflow-x", "hidden");
			});
			$(document).on("dialogclose", ".ui-dialog", function (event, ui) {
			    $('body').css("overflow-x", "auto");
			});
			var userPasswordGeneratePanel = $("#userPasswordGeneratePanel");
			$("#user_generateRandomPass").unbind().click(function () {
				var pass = panelSetup.generatePasswordUsingPrefs();
				$("#user_generated_password").val(pass);
				userPasswordGeneratePanel.show();
				return false;
			});

			$("#user_usePassword").unbind().click(function () {
				$("#user_password_prompt").val($("#user_generated_password").val()).focus();
				return false;
			});

			$("#user_cancelPassword").unbind().click(function () {
				userPasswordGeneratePanel.hide();
				$("#user_password_prompt").focus();
				return false;
			});

			/*Session checker will get version information, based on it new features will be show/hide/initiated*/
			$(".enterpriseFeature").hide();
			$("#SessionSeconds").sessionChecker({
				callBack:function(){
					var versionNo = ($(document).data("app_version")+"").replace( /^\D+/g, '');
					versionNo = versionNo || 5;
					var crushVersion = parseInt(versionNo);
					if (crushVersion >= 6) //show new features
					{
						userManager.methods.showFeaturesBasedOnVersion($("body"));
					}
					else
					{
						crushFTP.userLogin.userLoginStatusCheckThread();
					}
				},
				keepAliveOnMouseKeyboardActivity: true
			});
		},
		getServerTime : function(cb){
			if(crushFTP.storage("currentServerTime"))
			{
				cb(crushFTP.storage("currentServerTime"));
				return;
			}
			crushFTP.data.serverRequest(
				{
					command: 'getServerItem',
					key: "server_info/current_datetime_ddmmyyhhmmss",
					random: Math.random()
				},
				function(msg){
					var time = $(msg).find("response_status").text() || "";
					var myDate = new Date();
					if(time)
					{
						var mm = parseInt(time.substr(0, 2), 0);
						var dd = parseInt(time.substr(2, 2), 0);
						var yyyy = parseInt(time.substr(4, 4), 0);
						var hh = parseInt(time.substr(8, 2), 0);
						var mmm = parseInt(time.substr(10, 2), 0);
						var ss = parseInt(time.substr(12, 2), 0);
						myDate = new Date(yyyy, mm-1, dd, hh, mmm, ss);
					}
					crushFTP.storage("currentServerTime", myDate);
					setTimeout(function(){
						crushFTP.removeStorage("currentServerTime");
					}, 10000);
					cb(myDate);
				}
			);
		},
		bindEmailTemplates : function()
		{
			var prefs = $(document).data("GUIXMLPrefs");
			var templateList = $("#emailTemplatesList").empty();
			var emailTemplatesDialog = $("#emailTemplatesDialog");
			if(prefs && prefs.email_templates)
			{
				crushFTP.methods.rebuildSubItems(prefs.email_templates, "email_templates");
				var templates = prefs.email_templates.email_templates_subitem;
				if(templates && templates.length>0)
				{
					for(var index=0; index<templates.length;index++)
					{
						var curItem = templates[index];
						var opt = $("<option value='"+index+"'>"+curItem.name+"</option>");
						curItem.emailBody = DOMPurify.sanitize(curItem.emailBody);
						opt.data("controlData", curItem);
						templateList.append(opt);
					}
					templateList.append(templateList.find('option').sort(function(a, b){
					    return (
					        a = $(a).text(),
					        b = $(b).text(),
					        a == b ? 0 : a < b ? -1 : 1
					    );
					}));
				}
			}
			templateList.prepend('<option value="">Please select</option>');
			templateList.unbind().bind("change", function(){
				var index = $(this).val();
				if(index!="")
				{
					var templateDetails = $("#templateDetails").show();
					var controlData = $(this).find("option:selected").data("controlData");
					if(controlData)
					{
						templateDetails.find("#emailTemplateEmailFrom").html(controlData.emailFrom);
						templateDetails.find("#emailTemplateEmailFromEdit").val(controlData.emailFrom);
						templateDetails.find("#emailTemplateSubject").html(controlData.emailSubject);
						templateDetails.find("#emailTemplateSubjectEdit").val(controlData.emailSubject);
						templateDetails.find("#emailTemplateBody").html(controlData.emailBody);
						templateDetails.find("#emailTemplateBodyEdit").val(controlData.emailBody);
						if(controlData.emailCC)
						{
							templateDetails.find("#emailTemplateEmailCC").html(controlData.emailCC);
							templateDetails.find("#emailTemplateEmailCCEdit").val(controlData.emailCC);
						}
						if(controlData.emailBCC)
						{
							templateDetails.find("#emailTemplateEmailBCC").html(controlData.emailBCC);
							templateDetails.find("#emailTemplateEmailBCCEdit").val(controlData.emailBCC);
						}
						if(controlData.emailReplyTo)
						{
							templateDetails.find("#emailTemplateEmailReplyTo").html(controlData.emailReplyTo);
							templateDetails.find("#emailTemplateEmailReplyToEdit").val(controlData.emailReplyTo);
						}
						var editItems = emailTemplatesDialog.find(".template-editmode").hide();
						var viewItems = emailTemplatesDialog.find(".template-viewmode").show();
					}
					else
					{
						templateDetails.find("#emailTemplateEmailFrom, #emailTemplateSubject, #emailTemplateBody, #emailTemplateEmailCC, #emailTemplateEmailBCC").html("");
					}
					emailTemplatesDialog.dialog({
    					position : { 'my': 'center', 'at': 'center' }
					});
				}
				else
				{
					$("#templateDetails").hide();
				}
			});

			emailTemplatesDialog.form().dialog({
				autoOpen: false,
				width: 700,
				modal: true,
				resizable: false,
				closeOnEscape: false,
				buttons: {
					"Cancel" : function(){
						$(this).dialog("close");
						if(userManager.afterEmailTemplate)
							userManager.afterEmailTemplate(false, true);
					},
					"OK": function() {
						if(userManager.afterEmailTemplate)
						{
							var selected = "";
							if(templateList.val()!="")
								selected = templateList.find("option:selected").text();
							if(emailTemplatesDialog.find("#editEmailTemplate").is(":visible"))
								userManager.afterEmailTemplate(selected, false, templateList.find("option:selected").data("controlData"));
							else{
								var body = DOMPurify.sanitize(emailTemplatesDialog.find("#emailTemplateBodyEdit").val());
								if(body.indexOf("<html>")<0)
                                        body = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>' + body + '</body></html>';
								var selectedData = $.extend(true, {}, templateList.find("option:selected").data("controlData"));
								selectedData.emailFrom = crushFTP.methods.htmlEncode(emailTemplatesDialog.find("#emailTemplateEmailFromEdit").val());
								selectedData.emailSubject = crushFTP.methods.htmlEncode(emailTemplatesDialog.find("#emailTemplateSubjectEdit").val());
								selectedData.emailBody = encodeURIComponent(body);
								selectedData.emailCC = crushFTP.methods.htmlEncode(emailTemplatesDialog.find("#emailTemplateEmailCCEdit").val());
								selectedData.emailBCC = crushFTP.methods.htmlEncode(emailTemplatesDialog.find("#emailTemplateEmailBCCEdit").val());
								selectedData.emailReplyTo = crushFTP.methods.htmlEncode(emailTemplatesDialog.find("#emailTemplateEmailReplyToEdit").val());
								userManager.afterEmailTemplate(selected, false, selectedData);
							}
							delete userManager.afterEmailTemplate;
						}
						$(this).dialog("close");
					}
				},
				open : function(){
					templateList.val("").trigger("change");
					setTimeout(function(){
						$("#emailTemplatesList").get(0).selectedIndex = 0;
						$("#emailTemplatesList").trigger("change");
					},100);
					var editItems = emailTemplatesDialog.find(".template-editmode").hide();
					var viewItems = emailTemplatesDialog.find(".template-viewmode").show();
					emailTemplatesDialog.find("#editEmailTemplate").unbind().click(function(){
						viewItems.hide();
						editItems.show();
						setTimeout(function(){
							 emailTemplatesDialog.find(".htmlswitch").unbind("change").bind("change", function(){
						        var htmlBody = $(this).closest("div").find("textarea");
						        htmlBody.val(DOMPurify.sanitize(htmlBody.val()));
						        if($(this).is(":checked")){
						            htmlBody.htmlarea('dispose');
						        }
						        else{
						            htmlBody.htmlarea('dispose');
						            htmlBody.htmlarea({
						                toolbar: [
						                        "bold", "italic", "underline",
						                        "|",
						                        "h1", "h2", "h3",
						                        "|",
						                        "orderedList", "unorderedList",
						                        "|",
						                        "justifyleft", "justifycenter", "justifyright",
						                        "|",
						                        "forecolor",
						                        "|",
						                        "image",
						                        "|",
						                        "link", "unlink",
						                        "|",
						                        "increasefontsize", "decreasefontsize"
						                    ],
						                css : "/WebInterface/Resources/css/jHtmlArea/editor.css"
						            });
						        }
						    }).trigger("change");
							// emailTemplatesDialog.find("#emailTemplateBodyEdit").htmlarea('dispose');
							// emailTemplatesDialog.find("#emailTemplateBodyEdit").htmlarea({
					  //           toolbar: [
					  //                   "bold", "italic", "underline",
					  //                   "|",
					  //                   "h1", "h2", "h3",
					  //                   "|",
					  //                   "orderedList", "unorderedList",
					  //                   "|",
					  //                   "justifyleft", "justifycenter", "justifyright",
					  //                   "|",
					  //                   "forecolor",
					  //                   "|",
					  //                   "image",
					  //                   "|",
					  //                   "link", "unlink",
					  //                   "|",
					  //                   "increasefontsize", "decreasefontsize"
					  //               ],
					  //           css : "/WebInterface/Resources/css/jHtmlArea/editor.css"
					  //       });
						});
						return false;
					})
				}
			});
		},
		inheritDataFromUser : function(target, copyFrom){
			if(!target || !copyFrom)return;
			var inhUser = copyFrom.user_name;
			// if(!copyFrom.configure_reverse_share_events)
			// 	copyFrom.configure_reverse_share_events = "true";
			for(obj in copyFrom)
			{
				if(target && typeof target[obj] == "undefined")
				{
					target[obj] = copyFrom[obj];
					if(typeof target[obj] == "string")
						target[obj] = target[obj].toString() + "|||||" + inhUser;
					else if(typeof target[obj] == "object")
						target[obj]["inheritedFrom"] = inhUser;
				}
			}
			return target;
		},
		//Performs varions server actions on buttons
		performServerAction : function(elem, data, title, callback, hideGrowl)
		{
			if(elem.attr("disabled"))return false;
			elem.block({
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
			crushFTP.data.serverRequest(data, function(msg){
				elem.unblock().removeAttr("disabled");
				if(callback)
				{
					callback($(msg).find("response"));
				}
				else
				{
					title = title || "Message from server, action : " + data.command;
					if(hideGrowl)
						crushFTP.UI.growl(title, DOMPurify.sanitize(decodeURIComponent($(msg).find("response").text())), false, 5000);
					else
						crushFTP.UI.growl(title, DOMPurify.sanitize(decodeURIComponent($(msg).find("response").text())), false, false);
				}
			});
			return false;
		},
		/*Fetches user list, and default users data and stores in local storage*/
		prepareDataRepo : function(callback, dontBindGroups){
			var logoElem = $("#logo", "#header").hide();
			var mainServerInstance = localStorage.getItem("mainServerInstance");
			var settingItemsToFetch = [
				"server_groups",
				"random_password_length",
				"min_password_length",
				"min_password_numbers",
				"min_password_lowers",
				"min_password_uppers",
				"min_password_specials",
				"unsafe_password_chars",
				"blank_passwords",
				"email_templates",
				"plugins",
				"miniURLs",
				"user_default_folder_privs",
				"miniURLHost",
				"tunnels",
				"CustomForms",
				"registration_name",
				"rid",
				"replicate_session_host_port",
				"replicate_users"
			];
			var infoItemsToFetch = [
				"machine_is_linux",
				"machine_is_solaris",
				"machine_is_unix",
				"machine_is_windows",
				"machine_is_x",
				"machine_is_x_10_5_plus",
				"sub_version_info_str",
				"version_info_str"
			];
			crushFTP.data.getSelectedXMLPrefsDataFromServer(settingItemsToFetch.join(","), infoItemsToFetch.join(","), "GUIXMLPrefs", function(allPrefs){
				userManager.data.loadServerInfo();
				var _mainServerInstance = $("#mainServerInstance").empty();
				if(!allPrefs){
					$('#access-denied').show();
					$("#myslidemenu, table").hide();
					crushFTP.UI.hideLoadingIndicator();
				}
				if(allPrefs)
				{
					$(allPrefs).find("server_list result_value_subitem").each(function(){
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
					crushFTP.replicateHosts = $(allPrefs).find("replicate_session_host_port").text();
					crushFTP.replicate_users = $(allPrefs).find("replicate_users").text();

					if(_mainServerInstance.find("option").length>0)
					{
						_mainServerInstance.prepend("<option value=''>Main</option>");
						if(mainServerInstance != null)
						{
							if(_mainServerInstance.find("option[value='"+mainServerInstance+"']").length>0)
							{
								if(mainServerInstance.length>0 && mainServerInstance.toLowerCase()!= "main")
									crushFTP.ajaxCallURL = userManager.ajaxCallURL = userManager.ajaxCallURLBase + mainServerInstance + "/";
								_mainServerInstance.val(mainServerInstance);
							}
							else
							{
								crushFTP.ajaxCallURL = userManager.ajaxCallURL = userManager.ajaxCallURLBase;
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
				function processUserInformation(xmlData){
					var userInfo = $.xml2json(xmlData, false);
					userManager.isUserAdmin = false;
					userManager.isUserLimitedAdmin = false;
					userManager.currentUserEmail = userInfo.email || "";
					if(userInfo && userInfo.user_priv_options)
					{
						var privs = userInfo.user_priv_options;
						if(privs.indexOf("(CONNECT)")>=0)
						{
							userManager.isUserAdmin = true;
						}
						else if(privs.indexOf("(USER_ADMIN)")>=0)
						{
							userManager.isUserLimitedAdmin = true;
							$(".adminOnly").remove();
						}
					}
					if(userInfo && userInfo.allowed_config){
						userManager.currentUsersAllowedConfigs = userInfo.allowed_config;
					}
					var customizations = [];
					var logo = "";
					$(xmlData).find("customizations_subitem").each(function(){
						var curObj = {
							key : $(this).find("key").text(),
							value : $(this).find("value").text()
						};
						customizations.push(curObj);
						if(curObj.key && curObj.key.toLowerCase() == "logo")
						{
							logo = curObj.value;
						}
					});
					if(logo)
					{
						if(logo.toLowerCase().indexOf("http://")<0 && logo.toLowerCase().indexOf("https://")<0)
						{
							logo = "/WebInterface/images/" + crushFTP.methods.htmlEncode(logo);
						}
						if(logoElem.find("img").length>0)
							logoElem.find("img").replaceWith("<img src='" + logo+ "' />");
						else
							logoElem.append("<img src='" + logo + "' />");
					}
					logoElem.show();
					if(!dontBindGroups)
						userManager.dataRepo.bindConnectionGroupList(allPrefs);

					var curUserList, CurUserInfo, CurUserXml, groupInfo, groupXml, inheritanceInfo, inheritanceXml, roots, loaded = 0;
					var serverGroup = $("#userConnectionGroups").val() || "MainUsers";
					function continueMerge(){
						loaded++;
						if(loaded<5)
							return;
						crushFTP.storage("users", curUserList);
						userManager.methods.showRecentUsersPersonalization(true);
						if(groupInfo)
						{
							crushFTP.storage("groupInfo", groupInfo);
							crushFTP.storage("groupInfoXML", groupXml);
						}
						if(inheritanceInfo)
						{
							crushFTP.storage("inheritanceInfo", inheritanceInfo);
							crushFTP.storage("inheritanceInfoXML", inheritanceXml);
							crushFTP.serverConfig = crushFTP.serverConfig || {};
							crushFTP.serverConfig.userRoot = $(roots).find("user\\.root").text() || "/";
							crushFTP.serverConfig.serverRoot = $(roots).find("server\\.root").text() || "/";
							if(callback)
							{
								callback();
							}
							if(!userManager.loadingPanels)
								crushFTP.UI.hideLoadingIndicator();
						}
						else{
							if(!userManager.loadingPanels)
								crushFTP.UI.hideLoadingIndicator();
						}
					}
					userManager.dataRepo.bindUserList(function(_userList){
						curUserList = _userList;
						crushFTP.storage("users", _userList);
						continueMerge();
						userManager.dataRepo.refreshDefaultUserData(function(_userInfo, _userXml){
							CurUserInfo = _userInfo;
							CurUserXml = _userXml;
							continueMerge();
						});

						userManager.dataRepo.getGroupInfo("group", serverGroup, function(_groupInfo, _groupXml){
							groupInfo = _groupInfo;
							groupXml = _groupXml;
							continueMerge();
						});

						userManager.dataRepo.getGroupInfo("inheritance", serverGroup, function(_inheritanceInfo, _inheritanceXml){
							inheritanceInfo = _inheritanceInfo;
							inheritanceXml = _inheritanceXml;
							continueMerge();
						});

						crushFTP.data.serverRequest({
							command: "getServerRoots"
						}, function(_roots){
							roots = _roots;
							continueMerge();
						});
					});
				}
				if(crushFTP.curUserInfo && crushFTP.curUserInfo.data)
				{
					processUserInformation(crushFTP.curUserInfo.data);
				}
				else{
					crushFTP.data.serverRequest({
						command: "getUserInfo",
						path : "/",
						random: Math.random()
					}, function(xmlData){
						processUserInformation(xmlData);
					});
				}
			});
		},
		applyLimitedAdminRestrictions: function(){
			var roles = userManager.currentUsersAllowedConfigs || '';
			var curUserRoles = roles.split(',');
			var panels = $("#GUIInterface");
			userManager.allowBatchUpdate = false;
			if(!roles || curUserRoles.length == 0 || roles === 'allowed_config'){
				panels.find("[config]").addClass('allowed');
				userManager.allowBatchUpdate = true;
				return;
			}
			for(var i=0; i<curUserRoles.length;i++){
				var curRole = $.trim(curUserRoles[i]);
				panels.find("[config='"+curRole+"']").addClass('allowed').parents("[config]").addClass('allowed');
				if(curRole === "batch_update"){
					userManager.allowBatchUpdate = true;
				}
			}
			panels.find("[config]:not(.allowed)").addClass('not-allowed');
			$(".multipleConfigs").each(function(){
				// console.log($(this).find("[config]:not(.not-allowed)").length);
				if($(this).find("[config]:not(.not-allowed)").length===0)
				{
					$(this).closest("fieldset").addClass('not-allowed');
					if($(this).is("li")){
						$(this).addClass('not-allowed');
						if($(this).hasClass('sibling')){
							$(this).prev().addClass('not-allowed');
						}
					}
				}
			});
			if($("[config='password']:first").hasClass('not-allowed')){
				userManager.currentUserConfigNoPass = true;
			}
		},
		removeUsersLocalStorage : function()
		{
			crushFTP.removeStorage("currentUserDirPrivs");
			crushFTP.removeStorage("currentUserDirPrivsDefault");
			crushFTP.removeStorage("currentUserInherited");
			crushFTP.removeStorage("currentUsersLowerLevelsData");
			panelSetup.extraVFS = false;
			var storageData = [];
			for(var i=0;i<crushFTP.storageData.length;i++)
			{
				if(crushFTP.storageData[i].indexOf("extraUser")==0)
					storageData.push(crushFTP.storageData[i]);
			}
			for(var i=0;i<storageData.length;i++)
			{
				crushFTP.removeStorage(storageData[i]);
			}
			$("#vfsItemButtons").find("a:first").trigger("click");
			if(window.panelSettings)
				$("#root_dir", panelSettings._panel).removeClass("excludeXML");
			panelSetup.loadUser = false;
			panelSetup._panel.find("#crush_value2").removeData("dataChanged");
		},
		refreshUsersFromServer : function(callback)
		{
			userManager.dataRepo.bindUserList(function(userList){
				if(userList)
				{
					crushFTP.storage("users", userList);
				}
				if(callback)
				{
					callback();
				}
			});
		},
		showBatchUpdateOption : function()
		{
			if(userManager.disableBatchUpdate)
				return;
			var allSettings = [];
			userManager.placeHolder.find("td.checkboxArea").each(function(){
				var fieldSet = $(this).closest("fieldset").attr("_uniqueID", crushFTP.methods.generateRandomPassword(10));
				if(!fieldSet.hasClass("notInheritable"))
					allSettings.push($(this));
			});

			$(allSettings).each(function(){
				if((userManager.isUserLimitedAdmin && !userManager.allowBatchUpdate) || $(this).find("span.batchUserSelector").length>0)return;
				var btn = $('<span class="button batchUserSelector"><span class="current"></span></span>');
				$(this).append(btn);
				btn.button().contextMenu({
						menu: "batchUploadSelector",
						openOnClick : true,
						inSpeed : 0,
						outSpeed : 0
					},
					function(action, el, pos) {
					if(action == "current")
					{
						btn.find("span.current").removeClass("batch");
						btn.removeClass("ui-state-hover");
					}
					else if(action == "batch" || action == "selectedBatch")
					{
						var batchSwitch = btn.find("span.current").addClass("batch");
						btn.addClass("ui-state-hover");
						var chkBox = btn.closest("td").find("input");
						var override = chkBox.is(":checked");
						var label = override ? "" : " not ";
						var confirmText = "Are you sure you wish to set all users in the list"+label+" to override this setting?<br><br>";
						var okBtnText = "Yes, to all listed users";
						if(action == "selectedBatch")
						{
							confirmText = "Are you sure you wish to set all selected users in the list"+label+" to override this setting?<br><br>";
							okBtnText = "Yes, to all selected users";
						}

                        jConfirm(confirmText,"Confirm", function(flag){
                            if(!flag)
                            {
                                batchSwitch.removeClass("batch").parent().parent().removeClass("ui-state-hover");
                                return;
                            }
                            userManager.data.saveBatchInfo(function(flag){
								if(flag)
								{
									batchSwitch.removeClass("batch").parent().parent().removeClass("ui-state-hover");
								}
							}, !override, chkBox, action == "selectedBatch");
                        },{
                            okButtonText : okBtnText,
                            cancelButtonText : "No, only current user : " + $(document).data("userName")
                        });
					}
				});
			});
		},
		showRefreshButton : function()
		{
			var reloadLinksPanel = $("#reloadLinks");
			var userListPanel = $("#userList");
			reloadLinksPanel.find("a.reloadUsersLink").hide();
			var active = userListPanel.find("option.userSelected");
			var userList = crushFTP.storage("users");
			var availableUser = [];
			for (var i = 0; i < userList.length; i++) {
				availableUser.push(userList[i].text);
			};
			var curUser = $(document).data("userName");
			if(availableUser.has(curUser))
			{
				reloadLinksPanel.find("a.reloadUsersLink").show().unbind().click(function(e, userName){
					crushFTP.UI.showLoadingIndicator(true);
					userName = userName || $(document).data("userName") || userListPanel.find(".userSelected").attr("username");
					userManager.methods.loadUserInfo(userName, true, function(){
						crushFTP.UI.hideLoadingIndicator(true);
						userManager.methods.itemsChanged(false);
						setTimeout(function(){
							panelSetup.revealPassEvent();
							userListPanel.find("option[username='"+userName+"']").attr("selected", "selected");
						}, 200);
					}, false, true);
					e.stopPropagation();
					e.preventDefault();
				});
			}
			else
			{
				$("#quickJump", "#GUIInterface").hide();
				$("#userSpecificButtons", "#GUIInterface").hide();
			}
		},
		/*Builds list of users and shows in right panel*/
		buildUserList : function(userList, name, group, inheritance, showAll){
			var users = userList || crushFTP.storage("users");
			var userListPanel = $("<select></select>");
			group = group || "all";
			$("#groupSelectList").val(group);
			inheritance = inheritance || "";
			var currentUserName = crushFTP.methods.htmlEncode(crushFTP.storage("userName"));
			var filtered = [];
			var filteredNames = [];
			for(var i=0; i<users.length;i++)
			{
				if(name)
				{
					name = name.toLowerCase();
					if(group && !inheritance)
					{
						var isPattern = false;
						var regxp;
						try{
							var regParts = name.match(/^\/(.*?)\/([gim]*)$/);
							if (regParts) {
							    regxp = new RegExp(regParts[1], regParts[2]);
							} else {
							    regxp = new RegExp(name);
							}
							isPattern = true;
						}
						catch(ex){
							isPattern = false;
						}
						var curVal = users[i].text.toLowerCase();
						if(isPattern ? regxp.test(users[i].text.toLowerCase()) : curVal.indexOf(name.toLowerCase())>=0)
						{
							var groups = users[i].groups;
							if(group == "all")
							{
								filtered.push(users[i]);
								filteredNames.push(users[i].text);
							}
							else if(group == "notingroup")
							{
								if(!groups || groups.length==0)
								{
									filtered.push(users[i]);
									filteredNames.push(users[i].text);
								}
							}
							else
							{
								if(groups && groups.length>0 && groups.has(group))
								{
									filtered.push(users[i]);
									filteredNames.push(users[i].text);
								}
							}
						}
					}
					else if(inheritance)
					{
						var curVal = users[i].text.toLowerCase();
						if(group)
						{
							if(curVal.indexOf(name.toLowerCase())>=0)
							{
								var inheritanceInfo = users[i].inheritance;
								inheritance = inheritance.toLowerCase();
								if(inheritanceInfo && inheritanceInfo.length>0)
								{
									for(var j=0; j< inheritanceInfo.length;j++)
									{
										var curVal = inheritanceInfo[j].toLowerCase();
										if(curVal.indexOf(inheritance)>=0)
										{
											if(!filteredNames.has(users[i].text))
											{
												var groups = users[i].groups;
												if(group == "all")
												{
													filtered.push(users[i]);
													filteredNames.push(users[i].text);
												}
												else if(group == "notingroup")
												{
													if(!groups || groups.length==0)
													{
														filtered.push(users[i]);
														filteredNames.push(users[i].text);
													}
												}
												else
												{
													if(groups && groups.length>0 && groups.has(group))
													{
														filtered.push(users[i]);
														filteredNames.push(users[i].text);
													}
												}
											}
										}
									}
								}
							}
						}
						else
						{
							if(curVal.indexOf(name.toLowerCase())>=0)
							{
								var inheritanceInfo = users[i].inheritance;
								inheritance = inheritance.toLowerCase();
								if(inheritanceInfo && inheritanceInfo.length>0)
								{
									for(var j=0; j< inheritanceInfo.length;j++)
									{
										var curVal = inheritanceInfo[j].toLowerCase();
										if(curVal.indexOf(inheritance)>=0)
										{
											if(!filteredNames.has(users[i].text))
											{
												filtered.push(users[i]);
												filteredNames.push(users[i].text);
											}
										}
									}
								}
							}
						}
					}
					else
					{
						var curVal = users[i].text.toLowerCase();
						if(curVal.indexOf(name.toLowerCase())>=0)
						{
							if(!filteredNames.has(users[i].text))
							{
								filtered.push(users[i]);
								filteredNames.push(users[i].text);
							}
						}
					}
				}
				else if(group && !inheritance)
				{
					var groups = users[i].groups;
					if(group == "all")
					{
						filtered.push(users[i]);
						filteredNames.push(users[i].text);
					}
					else if(group == "notingroup")
					{
						if(!groups || groups.length==0)
						{
							filtered.push(users[i]);
							filteredNames.push(users[i].text);
						}
					}
					else
					{
						if(groups && groups.length>0 && groups.has(group))
						{
							filtered.push(users[i]);
							filteredNames.push(users[i].text);
						}
					}
				}
				else if(inheritance)
				{
					var curVal = users[i].text.toLowerCase();
					if(group)
					{
						var inheritanceInfo = users[i].inheritance;
						inheritance = inheritance.toLowerCase();
						if(inheritanceInfo && inheritanceInfo.length>0)
						{
							for(var j=0; j< inheritanceInfo.length;j++)
							{
								var curVal = inheritanceInfo[j].toLowerCase();
								if(curVal.indexOf(inheritance)>=0)
								{
									if(!filteredNames.has(users[i].text))
									{
										var groups = users[i].groups;
										if(group == "all")
										{
											filtered.push(users[i]);
											filteredNames.push(users[i].text);
										}
										else if(group == "notingroup")
										{
											if(!groups || groups.length==0)
											{
												filtered.push(users[i]);
												filteredNames.push(users[i].text);
											}
										}
										else
										{
											if(groups && groups.length>0 && groups.has(group))
											{
												filtered.push(users[i]);
												filteredNames.push(users[i].text);
											}
										}
									}
								}
							}
						}
					}
					else
					{
						var inheritanceInfo = users[i].inheritance;
						inheritance = inheritance.toLowerCase();
						if(inheritanceInfo && inheritanceInfo.length>0)
						{
							for(var j=0; j< inheritanceInfo.length;j++)
							{
								var curVal = inheritanceInfo[j].toLowerCase();
								if(curVal.indexOf(inheritance)>=0)
								{
									if(!filteredNames.has(users[i].text))
									{
										filtered.push(users[i]);
										filteredNames.push(users[i].text);
									}
								}
							}
						}
					}
				}
			}
			users = filtered;
			var totalCount = users.length>500 && !showAll ? 500 : users.length;
			userManager.totalUsers = users.length;
			for(var i=0; i<totalCount;i++)
			{
				if(users[i].deleted && userManager.data.undeleteUser)
					userListPanel.append("<option userName='" + crushFTP.methods.htmlEncode(users[i].text) + "' value='" + crushFTP.methods.htmlEncode(users[i].text) + "' class='user deleted'>" + crushFTP.methods.htmlEncode(users[i].text) + " (deleted)</option>");
				else
					userListPanel.append("<option userName='" + crushFTP.methods.htmlEncode(users[i].text) + "' value='" + crushFTP.methods.htmlEncode(users[i].text) + "' class='user'>" + crushFTP.methods.htmlEncode(users[i].text) + "</option>");
			}
			if(window.isMobileDevice)
			{
				userListPanel.prepend("<option value='' class='user'>Select User</option>");
			}
			function continueBinding()
			{
				var usersList = $("#userList").empty();
				usersList.append(userListPanel.children());
				usersList.find("option").each(function(){
					$(this).removeAttr("selected");
				})
				userListPanel = usersList;
				//$("option" , userListPanel).addClass("ui-widget-content");
				var users = crushFTP.storage("users");
				var name = $.trim($("#filterUserInList").val());
				var totalUsers = userManager.totalUsers;
				var userListedCount = $("#userListedCount");
				if(totalUsers != userListPanel.find("option").length){
					userListedCount.text("" + userListPanel.find("option").length + " of " + totalUsers);
					userListedCount.closest("div").find(".showAllUsers").show();
				}
				else{
					userListedCount.text(totalUsers);
					userListedCount.closest("div").find(".showAllUsers").hide();
				}
				var selectedElem  = userListPanel.find("option[userName='"+currentUserName+"']").addClass("userSelected");
				userManager.methods.showRefreshButton();
				var userList = crushFTP.storage("users");
				var availableUser = [];
				for (var i = 0; i < userList.length; i++) {
					availableUser.push(userList[i].text);
				};
				if(availableUser.has(currentUserName))
				{
					try{
						userListPanel.scrollTo(selectedElem);
					}catch(ex){}
				}
				else
				{
					userManager.data.storeCurrentUserInfo(false);
				}

				var localDelay = (function () {
					var timer = 0;
					return function (callback, ms) {
						clearTimeout(timer);
						timer = setTimeout(callback, ms);
					};
				})();

				usersList.unbind().bind("change", function(e, data){
					setTimeout(function(){
						var selected = usersList.find(":selected:last");
						if(usersList.find(":selected.lastSelection").length>0)
							selected = usersList.find(":selected.lastSelection:last");
						usersList.find(".lastSelection").removeClass("lastSelection");
						if(selected.length>0)
							userManager.methods.userSelected(selected);
					}, 100);
				});

				usersList.unbind("click").bind("click", function(e, data){
					if($(e.target).length>0)
					{
						$(e.target).addClass("lastSelection");
					}
				});

				contextMenu.handler = usersList;    // element which triggers right click context menu
            	contextMenu.init();
			}

			if(userManager.methods.hasPendingChanges() && currentUserName && userListPanel.find("option[userName='"+currentUserName+"']").length == 0)
			{
				jConfirm("If you navigate away, you will lose your unsaved changes for user : " + currentUserName + ". Do you want to continue?", "Confirm", function(value){
					if(value)
					{
						continueBinding();
						userManager.methods.itemsChanged(false);
					}
					else
					{
						crushFTP.UI.hideIndicator(true);
						crushFTP.UI.hideLoadingIndicator(true);
					}
				},
				{
					prependButtons : [{
						button : '<a href="javascript:void(0);" id="popup_continue" class="button" style="margin-right:10px;"><span style="display:inline-block;margin:-1px 3px 0px -7px;float:left;" class="pointer ui-icon ui-icon-disk"></span><span class="submitActionSaveAndContinue">Save & Continue</span></a>&nbsp;&nbsp;',
						clickEvent : function(){
							$("#saveUserData", "#GUIInterface").trigger("click", [{fromSaveAndContniue:true, callBack : function(flag){
								if(flag)
								{
									$("#popup_cancel").click();
									continueBinding();
								}
								else
								{
									$("#popup_cancel").click();
									crushFTP.UI.hideIndicator(true);
									crushFTP.UI.hideLoadingIndicator(true);
								}
							}}]);
						}
					}],
					okButtonText : "Discard Changes",
					okButtonClassAdd : "ui-icon-trash"
				});
			}
			else
			{
				continueBinding();
			}
		},
		loadUserFromData: function(username){
			userManager.methods.loadUserInfo(username, false, function(){
				userManager.methods.itemsChanged(false);
				panelSetup.revealPassEvent();
				try{
					var path = panelSetup.serverDirSelectList.parent().next().find("input").val();
					if(path && path != "/"){
						setTimeout(function(){
							panelSetup.serverDirSelectList.parent().next().find("input").trigger('blur');
						}, 100);
					}
				}catch(ex){}
			}, false);
		},
		userSelected : function(selected, nofocus)
		{
			userManager.methods.loadUserInfo(selected.attr("userName"), false, function(){
				selected.parent().find(".userSelected").removeClass("userSelected");
				selected.addClass("userSelected");
				userManager.methods.itemsChanged(false);
				panelSetup.revealPassEvent();
				try{
					var path = panelSetup.serverDirSelectList.parent().next().find("input").val();
					if(path && path != "/"){
						setTimeout(function(){
							panelSetup.serverDirSelectList.parent().next().find("input").trigger('blur');
						}, 100);
					}
				}catch(ex){}
			}, nofocus);
		},
		/*Builds list of users to pick up based on selected group*/
		pickupUserFromGroup : function(group){
			var users = crushFTP.storage("users");
			var currentUserName = crushFTP.storage("userName");
			var userListFiltered = [];
			group = group || "all";
			for(var i=0; i<users.length;i++)
			{
				var groups = users[i].groups;
				var userName = crushFTP.methods.htmlEncode(users[i].text);
				if(userName.toLowerCase() != currentUserName.toLowerCase() && !userListFiltered.has(userName))
				{
					if(group == "all")
					{
						userListFiltered.push(userName);
					}
					else if(group == "notingroup")
					{
						if(!groups || groups.length==0)
						{
							userListFiltered.push(userName);
						}
					}
					else
					{
						if(groups && groups.length>0 && groups.has(group))
						{
							userListFiltered.push(userName);
						}
					}
				}
			}
			userListFiltered = userListFiltered.removeByVal("default");
			if(userListFiltered && userListFiltered.length>0)
			{
				jPrompt("Pick a user to inherit from :", "", "Pick A User", function(value){
					if(value)
					{
						userManager.data.addRemoveInheritanceDetailsFromUser(currentUserName, value, false, true);
					}
				}, userListFiltered
				, false,
				{
					messageToAppend : "<div class='smallFont' style='margin:10px 0;'>(Note : Current user is not shown in the list)</div>"
				});
			}
			else
			{
				jAlert("No users available for selected group!!", "Message", function(){
					$("#groupListToSelectForInheritance", "#GUIInterface").focus().select();
				});
			}
		},
		clearUserPreview : function(){
			delete userManager.data.loadPreview;
		},
		/*Method to load user info on all panels*/
		loadUserInfo : function(userName, forced, callback, nofocus, noScroll){
			if(crushFTP.storage("userName") != userName || forced)
			{
				function continueLoadingUser()
				{
					if(!userName)
					{
						userManager.data.storeCurrentUserInfo();
						return;
					}
					var quickFilterVal = false;
					crushFTP.UI.showLoadingIndicator(true);
					if(window.panelEvents)
						$("#eventActionPanel", panelEvents._panel).hide();
					var loadPreview = $.extend(true, {}, userManager.data.loadPreview);
					delete crushFTP.replicationSavePrefs;
					userManager.dataRepo.getUserInfo(userName, function(info, xmlData){
						userManager.data.showInheritanceDataForUser(userName);
						userManager.data.fetchInheritanceDataForUser(function(){
							if(info)
							{
								window.last_searched_quick_filter = false;
								quickFilterVal = $("#quick_filter", "#GUIInterface").val();
								$("#quick_filter", "#GUIInterface").val("").trigger("keyup");
								userManager.methods.removeUsersLocalStorage();
								var defaultUserJson = $.xml2json(crushFTP.storage("defaultUserXML"));
								var currentUserJson= $.xml2json(xmlData);
								var currentUserJsonDeep= $.xml2json(xmlData, true);

								//Override values from inherited users now
								var currentUserInheritanceDetails = crushFTP.storage("CurrentUserInheritanceDetails");
								if(currentUserInheritanceDetails)
									currentUserInheritanceDetails = currentUserInheritanceDetails.reverse();
								if(currentUserInheritanceDetails)
								{
									for(var i=0;i<currentUserInheritanceDetails.length;i++)
									{
										var inheritedUserXML = currentUserInheritanceDetails[i].xml;
										if(inheritedUserXML)
										{
											var inheritedJson = $.xml2json(inheritedUserXML);
											userManager.methods.inheritDataFromUser(currentUserJson.response_data.user_items.user, inheritedJson.response_data.user_items.user);//deep copy of object and then overriding inherited users data with values of current users data
										}
									}
								}

								userManager.methods.inheritDataFromUser(currentUserJson.response_data.user_items.user, defaultUserJson.response_data.user_items.user); //deep copy of object and then overriding default users data with values of current users data

								//Generate lower level's data
								var lowerLevelsData = {};
								if(currentUserInheritanceDetails)
								{
									for(var i=0;i<currentUserInheritanceDetails.length;i++)
									{
										var inheritedUserXML = currentUserInheritanceDetails[i].xml;
										if(inheritedUserXML)
										{
											var inheritedJson = $.xml2json(inheritedUserXML);
											userManager.methods.inheritDataFromUser(lowerLevelsData, inheritedJson.response_data.user_items.user);//deep copy of object and then overriding inherited users data with values of current users data
										}
									}
								}

								userManager.methods.inheritDataFromUser(lowerLevelsData, defaultUserJson.response_data.user_items.user); //deep copy of object and then overriding default users data with values of current users data

								var properties = crushFTP.storage("defaultUser");
								//Override values from inherited users now
								var curUserData = $.extend(true, {}, info);

								//** Linked VFS Building **//
								var linkedVFS = [];
								var rebuildRequired = false;
								try{
									var links = false;
									var user = currentUserJsonDeep.response_data[0].user_items[0].user[0];
									if(user && user.linked_vfs && user.linked_vfs.length>0)
									{
										links = currentUserJsonDeep.response_data[0].user_items[0].user[0].linked_vfs[0].linked_vfs_subitem;
									}
									if(links && links.length>0)
									{
										for(var i=0;i<links.length;i++)
										{
											if(links[i] && links[i].text)
											{
												linkedVFS.push(links[i].text);
											}
										}
									}
									crushFTP.methods.rebuildSubItems(curUserData.user.linked_vfs, "linked_vfs");
									curUserData.user.linked_vfs.linked_vfs_subitem = linkedVFS;
								}catch(ex){
									rebuildRequired = true;
								}
								if(currentUserInheritanceDetails)
								{
									for(var i=0;i<currentUserInheritanceDetails.length;i++)
									{
										var inheritedUserInfo = currentUserInheritanceDetails[i].info;
										if(rebuildRequired)
										{
											var inheritedJson = $.xml2json(currentUserInheritanceDetails[i].xml, true);
											//var linkedVFS = [];
											if(inheritedJson.response_data && inheritedJson.response_data[0].user_items && inheritedJson.response_data[0].user_items[0].user)
											{
												var user = inheritedJson.response_data[0].user_items[0].user[0];
												if(user && user.linked_vfs && user.linked_vfs.length>0)
												{
													links = inheritedJson.response_data[0].user_items[0].user[0].linked_vfs[0].linked_vfs_subitem;
												}
												if(links && links.length>0)
												{
													for(var j=0;j<links.length;j++)
													{
														if(links[j] && links[j].text)
														{
															linkedVFS.push(links[j].text);
														}
													}
												}
											}
											if(!inheritedUserInfo.user)
												inheritedUserInfo.user = {};
											if(!inheritedUserInfo.user.linked_vfs)
												inheritedUserInfo.user.linked_vfs = {};
											if(!inheritedUserInfo.user.linked_vfs.linked_vfs_subitem)
												inheritedUserInfo.user.linked_vfs.linked_vfs_subitem = {};
											inheritedUserInfo.user.linked_vfs.linked_vfs_subitem = linkedVFS;

											if(!lowerLevelsData.linked_vfs)
												lowerLevelsData.linked_vfs = {};
											if(!lowerLevelsData.linked_vfs.linked_vfs_subitem)
												lowerLevelsData.linked_vfs.linked_vfs_subitem = {};
											lowerLevelsData.linked_vfs.linked_vfs_subitem = linkedVFS;
										}
										if(inheritedUserInfo)
										{
											userManager.methods.inheritDataFromUser(curUserData.user, inheritedUserInfo.user); //deep copy of object and then overriding inherited users data with values of current users data
										}
									}
								}
								else if(!curUserData.user.linked_vfs)
								{
									var inheritedJson = $.xml2json(crushFTP.storage("defaultUserXML"), true);
									//var linkedVFS = [];
									var user = inheritedJson.response_data[0].user_items[0].user[0];
									if(user && user.linked_vfs && user.linked_vfs.length>0)
									{
										links = inheritedJson.response_data[0].user_items[0].user[0].linked_vfs[0].linked_vfs_subitem;
									}
									if(links && links.length>0)
									{
										for(var i=0;i<links.length;i++)
										{
											if(links[i] && links[i].text)
											{
												linkedVFS.push(links[i].text);
											}
										}
									}

									if(!lowerLevelsData.linked_vfs)
										lowerLevelsData.linked_vfs = {};
									if(!lowerLevelsData.linked_vfs.linked_vfs_subitem)
										lowerLevelsData.linked_vfs.linked_vfs_subitem = {};
									lowerLevelsData.linked_vfs.linked_vfs_subitem = linkedVFS;

									if(!curUserData.user.linked_vfs)
										curUserData.user.linked_vfs = {};
									if(!curUserData.user.linked_vfs.linked_vfs_subitem)
										curUserData.user.linked_vfs.linked_vfs_subitem = {};
									curUserData.user.linked_vfs.linked_vfs_subitem = linkedVFS;
								}

								//** Extra VFS **//
								var extraVFSRebuildRequired = false;
								try
								{
									var extraVFS = [];
									var extra = false;
									var user = currentUserJsonDeep.response_data[0].user_items[0].user[0];
									if(user && user.extra_vfs && user.extra_vfs.length>0)
									{
										extra = currentUserJsonDeep.response_data[0].user_items[0].user[0].extra_vfs[0].extra_vfs_subitem;
									}
									if(extra && extra.length>0)
									{
										var userExtraVFSLinks = {};
										var hasVFSLinks = false;
										for(var i=0;i<extra.length;i++)
										{
											if(extra[i] && extra[i].text)
											{
												extraVFS.push(extra[i].text);
											}
											else
											{
												for(var key in extra[i])
												{
													if(extra[i][key] && extra[i][key].length && extra[i][key][0] && extra[i][key][0].text){
														var extraVFSInfo = extra[i][key][0].text;
														extraVFSInfo = extraVFSInfo.replace(".zip","");
														var responseInfo = extraVFSInfo.split("~");
														var vfsinfo = responseInfo[1];
														var vfsName = vfsinfo.substr(0, vfsinfo.lastIndexOf("-"));
														extraVFS.push(vfsName);
														userExtraVFSLinks[vfsName] = {
															name : vfsName,
															zip : extra[i][key][0].text
														};
														hasVFSLinks = true;
													}
												}
											}
										}
									}
									crushFTP.methods.rebuildSubItems(curUserData.user.extra_vfs, "extra_vfs");
									curUserData.user.extra_vfs.extra_vfs_subitem = extraVFS;
									if(hasVFSLinks){
										curUserData.user.extraVFSLinks = userExtraVFSLinks;
									}
								}
								catch(ex){
									extraVFSRebuildRequired = true;
								}
								if(currentUserInheritanceDetails)
								{
									for(var i=0;i<currentUserInheritanceDetails.length;i++)
									{
										var inheritedUserInfo = currentUserInheritanceDetails[i].info;
										var inheritedJson = $.xml2json(currentUserInheritanceDetails[i].xml, true);
										var extraVFS = [];
										if(inheritedJson.response_data && inheritedJson.response_data[0].user_items && inheritedJson.response_data[0].user_items[0].user)
										{
											var user = inheritedJson.response_data[0].user_items[0].user[0];
											if(user && user.extra_vfs && user.extra_vfs.length>0)
											{
												extra = inheritedJson.response_data[0].user_items[0].user[0].extra_vfs[0].extra_vfs_subitem;
											}
											if(extra && extra.length>0)
											{
												for(var j=0;j<extra.length;j++)
												{
													if(extra[j] && extra[j].text)
													{
														extraVFS.push(extra[j].text);
													}
												}
											}
										}

										if(!lowerLevelsData.extra_vfs)
											lowerLevelsData.extra_vfs = {};
										if(!lowerLevelsData.extra_vfs.extra_vfs_subitem)
											lowerLevelsData.extra_vfs.extra_vfs_subitem = {};
										lowerLevelsData.extra_vfs.extra_vfs_subitem = extraVFS;

										if(inheritedUserInfo)
										{
											userManager.methods.inheritDataFromUser(curUserData.user, inheritedUserInfo.user); //deep copy of object and then overriding inherited users data with values of current users data
										}
									}
								}
								else
								{
									var inheritedJson = $.xml2json(crushFTP.storage("defaultUserXML"), true);
									var extraVFS = [];
									var user = inheritedJson.response_data[0].user_items[0].user[0];
									if(user && user.extra_vfs && user.extra_vfs.length>0)
									{
										extra = inheritedJson.response_data[0].user_items[0].user[0].extra_vfs[0].extra_vfs_subitem;
									}
									if(extra && extra.length>0)
									{
										for(var i=0;i<extra.length;i++)
										{
											if(extra[i] && extra[i].text)
											{
												extraVFS.push(extra[i].text);
											}
										}
									}

									if(!lowerLevelsData.extra_vfs)
										lowerLevelsData.extra_vfs = {};
									if(!lowerLevelsData.extra_vfs.extra_vfs_subitem)
										lowerLevelsData.extra_vfs.extra_vfs_subitem = {};
									lowerLevelsData.extra_vfs.extra_vfs_subitem = extraVFS;
								}

								//** User Events building **//
								try{
									var events = [];
									var evt = false;
									var user = currentUserJson.response_data.user_items.user;
									crushFTP.methods.rebuildSubItems(user.events, "events");
									if(user && user.events && user.events.events_subitem)
									{
										evt = user.events.events_subitem;
									}

									var _evt = false;
									var _user = currentUserJsonDeep.response_data[0].user_items[0].user[0];
									if(_user && _user.events && _user.events.length>0 && _user.events[0].events_subitem)
									{
										_evt = _user.events[0].events_subitem;
									}
									if(!_evt && evt)
									{
										if(!currentUserInheritanceDetails)
										{
											var defaultUserJsonDeep = $.xml2json(crushFTP.storage("defaultUserXML"), true);
											var __user = defaultUserJsonDeep.response_data[0].user_items[0].user[0];
											if(__user && __user.events && __user.events.length>0 && __user.events[0].events_subitem)
											{
												_user.events = __user.events;
											}
										}
										else
                                        {
                                            if(currentUserInheritanceDetails[currentUserInheritanceDetails.length-1] && currentUserInheritanceDetails[currentUserInheritanceDetails.length-1].xml)
                                            {
                                                var inheritedUserJsonDeep = $.xml2json(currentUserInheritanceDetails[currentUserInheritanceDetails.length-1].xml, true);
                                                var __user_items = inheritedUserJsonDeep.response_data[0].user_items[0];
                                                if (__user_items.length != 0)
                                                {
                                                    var __user = inheritedUserJsonDeep.response_data[0].user_items[0];
                                                    if(__user && __user.events && __user.events.length>0 && __user.events[0].events_subitem)
                                                    {
                                                        _user.events = __user.events;
                                                    }
                                                }
                                            }
                                        }
									}

								}catch(ex){
									throw(ex);
								}
								crushFTP.methods.rebuildSubItems(lowerLevelsData.linked_vfs, "linked_vfs");
								// if(!lowerLevelsData.configure_reverse_share_events){
								// 	lowerLevelsData.configure_reverse_share_events = "true";
								// 	var userItems = crushFTP.storage("currentUser");
								// 	if(!userItems.user.configure_reverse_share_events){
								// 		userItems.user.configure_reverse_share_events = "true";
								// 		crushFTP.storage("currentUser", userItems);
								// 	}
								// }
								crushFTP.storage("currentUsersLowerLevelsData", lowerLevelsData);
								//** End : Manual lower level data building **//

								userManager.methods.inheritDataFromUser(curUserData.user, properties.user);//deep copy of object and then overriding default users data with values of current users data

								//Set default values here
								var userDeep = currentUserJsonDeep.response_data[0].user_items[0].user[0];
								var userJ = curUserData.user;
								// if(!userJ.configure_reverse_share_events){
								// 	userJ.configure_reverse_share_events = "true";
								// 	userDeep.configure_reverse_share_events = [{text:"true"}];
								// }
								crushFTP.storage("currentUserInherited", curUserData);
								$(".inheritSet", "#GUIInterface").removeClass("inheritSet").show();
								$(".inheritValSet", "#GUIInterface").removeClass("inheritValSet");
								$("fieldset:hidden", userManager.placeHolder).show();

								userManager.methods.panelsDatabind(curUserData, currentUserJsonDeep);
								$(".validate", "#GUIInterface").crushValidator();
								if($("#placeHolder").is(":hidden"))
								{
									$("#welcomeNote").fadeOut();
									if(userManager.defaultPanelToShow)
									{
										$("#placeHolder").fadeIn("medium", function(){
											$("#quick_jump").val(userManager.defaultPanelToShow).trigger("change");
										});
									}
									else
									{
										$("#placeHolder").fadeIn("medium");
									}
								}
								if($("#showAllPanels").attr("state") && $("#showAllPanels").attr("state")=="hidden")
									$("#showAllPanels").trigger("click", [true]);
								if($.isCrush7)
								{
									$.crushFtpPersonalization.updateItem("userManager", "users", "viewed", userName);
									userManager.methods.showRecentUsersPersonalization();
								}
								try{
									var site_privs = userManager.methods.seperateValueAndInheritValue(crushFTP.data.getValueFromJson(curUserData.user, "site")).value;
									if(site_privs.toLowerCase().indexOf("connect")>=0){
										$("#footer").find(".admin-note").show()
						            }
						            else if(site_privs.toLowerCase().indexOf("admin")>=0){
						            	$("#footer").find(".admin-note").show();
						            }
						            else{
						            	$("#footer").find(".admin-note").hide()
						            }
								}catch(ex){}
							}
							$("#quickJump", "#GUIInterface").show();
							$("#userSpecificButtons", "#GUIInterface").show();
							userManager.UI.resizeSidebar();
							if(!nofocus){
								setTimeout(function(){
									$("#quick_filter").focus().select();
								}, 100);
							}
							if(callback)
							{
								callback();
							}
							userManager.methods.showRefreshButton();
							userManager.methods.showBatchUpdateOption();
							userManager.UI.updateHiddenSectionsCount();
							if(quickFilterVal)
							{
								setTimeout(function(){
									$("#quick_filter", "#GUIInterface").val(quickFilterVal).trigger("keyup");
								}, 500);
							}
							crushFTP.UI.hideLoadingIndicator(true);
							if(!noScroll)
							{
								$('html,body').animate({
										scrollTop: 100
								}, 500, false);
							}
							/* added by carlos, we detect if was a tour user create so we continue the tour for folder configuration */
							//var regexTourUser = new RegExp("touruser", "i");
							if((crushFTP.methods.queryString("tour") == "y" || $.jStorage.get("tour") == "y")){
								showControls(mainTour3, 'r', true, true);
							}
							/* added by carlos, we detect if was a tour user template create so we continue the tour for folder configuration */
							if((crushFTP.methods.queryString("tourDMZ") == "y" || $.jStorage.get("tourDMZ") == "y" && userName == "template")){
								//we expand all items so we can modify ssh keys
								$('#showAllPanels').trigger('click');
								endTour();
								setTimeout(function(){ showControls(dmzTour3, 'r', true, true); }, 1000);
								if($.jStorage.storageAvailable()){
            						$.jStorage.deleteKey("tourDMZ");
        						}
							}
							$("#quickJump", "#GUIInterface").show();
							$("#userSpecificButtons", "#GUIInterface").show();
							userManager.UI.resizeSidebar();
							if($("#mostVisitedUsers").is(":visible"))
							{
								var mostVisitedUsers = $("#mostVisitedUsers");
								mostVisitedUsers.find("li.ui-state-active").removeClass('ui-state-active');
								mostVisitedUsers.find("a[user='"+crushFTP.methods.htmlEncode(userName)+"']").closest("li").addClass('ui-state-active');
							}
						});
					}, true, false, false, false, loadPreview);
				}
				if(userManager.methods.hasPendingChanges() && crushFTP.storage("userName"))
				{
					jConfirm("If you navigate away, you will lose your unsaved changes for user : " + crushFTP.storage("userName") + ". Do you want to continue?", "Confirm", function(value){
						if(value)
						{
							continueLoadingUser();
						}
						else
						{
							var userList = $("#userList");
							var selected = userList.find(".userSelected");
							selected.parent().find(".ui-state-active").removeClass("ui-state-active");
							selected.parent().find(".ui-state-focus").removeClass("ui-state-focus");
							selected.parent().find(".ui-selected").removeClass("ui-selected");
							crushFTP.UI.hideIndicator(true);
							crushFTP.UI.hideLoadingIndicator(true);
						}
					},
					{
						prependButtons : [{
							button : '<a href="javascript:void(0);" id="popup_continue" class="button" style="margin-right:10px;"><span style="display:inline-block;margin:-1px 3px 0px -7px;float:left;" class="pointer ui-icon ui-icon-disk"></span><span class="submitActionSaveAndContinue">Save & Continue</span></a>&nbsp;&nbsp;',
							clickEvent : function(){
								$("#saveUserData", "#GUIInterface").trigger("click", [{fromSaveAndContniue:true, callBack : function(flag){
									if(flag)
									{
										$("#popup_cancel").click();
										continueLoadingUser();
									}
									else
									{
										$("#popup_cancel").click();
										crushFTP.UI.hideIndicator(true);
										crushFTP.UI.hideLoadingIndicator(true);
									}
								}}]);
							}
						}],
						okButtonText : "Discard Changes",
						okButtonClassAdd : "ui-icon-trash"
					});
				}
				else
				{
					continueLoadingUser();
				}
			}
		},
		/*Method passes merged user information to databind mehtod of each panels separately, event handled on panel's code*/
		panelsDatabind : function(userInfo, jsonDeep){
			for(var i=0; i<window.dataBindEvents.length;i++)
			{
				if(typeof window.dataBindEvents[i] == 'function')
				{
					window.dataBindEvents[i](userInfo, jsonDeep);
				}
			}
		},
		loadPanels : function(params, callback){
			var panels = $("#panels");
			crushFTP.UI.notification(false);
			var loadedPanels = [];
			function loadingDone(){
				loadedPanels = loadedPanels.sort(function(a,b){
					if (a.index < b.index) { return 1; }
					if (a.index > b.index) { return -1; }
					return 0;
				});
				for (var i = loadedPanels.length - 1; i >= 0; i--) {
					var curpnl = loadedPanels[i];
					var pnlHtml = $(curpnl.html);
					$.crushFtpCustomization.init(pnlHtml);
					var _panel = curpnl.panel;
					buildButtons(pnlHtml);
					$(".tabs", pnlHtml).tabs();
					panels.append(pnlHtml);
					var initParam = false;
					var initScript = "panel" + _panel + "._panel = $('#pnl" + _panel + "');panel" + _panel + ".init();";
					if(params && params.loadPlugin)
					{
						initParam = params.loadPlugin;
						initScript = "panel" + _panel + "._panel = $('#pnl" + _panel + "');panel" + _panel + ".init('"+initParam+"');";
					}
					var prefs = $(document).data("GUIXMLPrefs") || {};

					try{
						eval(initScript);
						userManager.methods.initLayoutEvents(pnlHtml, _panel);
					}
					catch(ex){
						if(ex && ex.toString() != "")
						{
							crushFTP.UI.growl("Error", _panel + ".init(); " + crushFTP.methods.htmlEncode(ex), true);
						}
					}
				};
				userManager.loadingPanels = false;
				if(callback)
				{
					callback();
				}
			}
			function loadNextPanel(index)
			{
				index = index || 0;
				if(userManager.panelsToLoad.length>index)
				{
					var panel = userManager.panelsToLoad[index];
					userManager.loadingPanels = true;
					index += 1;
					$.ajax({
						url : "panels/"+panel+"/index.html?c2f="+crushFTP.getCrushAuth(),
						cache : true,
						success : function(response) {
							crushFTP.methods.getScript("panels/"+panel+"/interface.js?c2f="+crushFTP.getCrushAuth(), function() {
								loadedPanels.push({
									panel: panel,
									index: index,
									html: response
								});
								if(loadedPanels.length == userManager.panelsToLoad.length){
									loadingDone();
								}
							});
						},
						error : function(xhr)
						{
							var msg = "Sorry but there was an error: " + xhr.status + " " + xhr.statusText + " while loading panel : " + panel;
							crushFTP.UI.notification(msg, true);
							// loadNextPanel(index);
						}
					});
					loadNextPanel(index);
				}
			}
			loadNextPanel();
			return false;
		},
		initLayoutEvents : function(context, panel){
			var userList = $("#userList");
			context = context || userManager.placeHolder;
			userManager.methods.showFeaturesBasedOnVersion(context);
			userManager.methods.itemsChanged(false);
			context.form();
			$("#ui-datepicker-div").hide();
			context.unbind("changed").bind("changed", function(evt, elem){
				userManager.methods.itemsChanged(true, elem);
			});
			$("input", context).keypress(function (e) {
				if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
					$('a#saveUserData', context).click();
					return false;
				} else {
					return true;
				}
			});
			vtip(context);
			if(panel)
			{
				$(".collapseHandle", context).each(function(){
					$(this).html(" [ - ]  " + panel + " (Click 'Show All' to see inherited items.) ");
					var fieldset = $(this).closest("fieldset").addClass("ui-state-default");
					$(this).click(function(){
						var dataDiv = $(this).parent().find("div.dataDiv");
						if(dataDiv.is(":hidden"))
						{
							dataDiv.show();
							$(this).html(" [ - ]  " + panel + " (Click 'Show All' to see inherited items.) ");
							fieldset.addClass("ui-state-default");
						}
						else
						{
							dataDiv.hide();
							$(this).html(" [ + ] " + panel);
							fieldset.removeClass("ui-state-default");
						}
					});
				});
			}
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

			$("ol.selectableMultiple", context).selectable({
				filter: "li",
				selected: function(event, ui) {
					var selected = $(ui.selected);
					selected.addClass("ui-widget-header");
					return false;
				},
				stop : function(event, ui)
				{
					try{
						var events = $(this).data('events');
						if(events && events.onSelect)
						{
							$(this).find(".ui-widget-header:last").trigger("click.shift");
							$(this).trigger("onSelect", [$(this), $(this).find(".ui-widget-header")]);
						}
					}
					catch(ex){
						if(ex && ex.toString() != "")
						{
							crushFTP.UI.growl("Error", DOMPurify.sanitize(ex), true);
						}
					}
				},
				unselected: function( event, ui ) {
					var unselected = $(ui.unselected);
					unselected.removeClass("ui-widget-header");
				}
			});

			$("ol.customSelectable", context).each(function(){
				var list = $(this);
				list.find("li").live("click", function(evt){
					crushFTP.methods.removeTextRangeSelection();
					if(list.hasClass("multiple") && evt.shiftKey)
					{
						var curIndex = $(this).index();
						var firstIndex = list.find(".ui-widget-header:first").index();
						if(list.find(".ui-widget-header.lastSelection").length>0)
							firstIndex = list.find(".ui-widget-header.lastSelection:first").index();
						//list.find(".ui-widget-header").removeClass("ui-widget-header ui-selected");
						list.find(".lastSelection").removeClass('lastSelection');
						if(curIndex>firstIndex)
						{
							list.find("li").slice(firstIndex, curIndex+1).addClass("ui-widget-header ui-selected").filter(":last").addClass('lastSelection');
						}
						else
						{
							list.find("li").slice(curIndex, firstIndex+1).addClass("ui-widget-header ui-selected").filter(":first").addClass('lastSelection');
						}
						list.trigger("onSelect", [list, list.find(".ui-widget-header")]);
					}
					else if(list.hasClass("multiple") && evt.altKey)
					{
						list.find(".lastSelection").removeClass('lastSelection');
						$(this).toggleClass("ui-widget-header ui-selected lastSelection");
						list.trigger("onSelect", [list, list.find(".ui-widget-header")]);
					}
					else
					{
						list.find(".lastSelection").removeClass('lastSelection');
						list.find(".ui-widget-header").removeClass("ui-widget-header ui-selected");
						$(this).addClass("ui-widget-header ui-selected lastSelection");
						list.trigger("onSelect", [list, list.find(".ui-widget-header")]);
					}
					return false;
				});
			});
		},
		bindPersonalizations : function(){
			var quickLocate = $("#quickLocate");
			var settingSearchAction = quickLocate.find("#settingSearchAction").hide();
			quickLocate.dialog({
				autoOpen: false,
				width: 650,
				modal: true,
				resizable: false,
				closeOnEscape: true,
				title : "Quick Locate :",
				dialogClass : "quickLocateDialog",
				open : function(){
					$("#quickLocateFilter", quickLocate).val("");
					$("#quickLocateResult", quickLocate).hide();
					$("#selectFilteredUsersDiv", quickLocate).hide();
				}
			});

			quickLocate.find("#submitBtnForUserSettings").click(function(){
				var phrase = $.trim(quickLocate.find("#quickLocateFilter").val());
				crushFTP.UI.showLoadingIndicator(true);
				crushFTP.data.serverRequest({
					command: 'searchUserSettings',
					serverGroup : $("#userConnectionGroups").val() || "MainUsers",
					search_text : phrase
				},
				function(data){
					crushFTP.UI.hideLoadingIndicator(true);
					if(data)
					{
						var users = $(data).find("user_settings_list_subitem");
						var result = [];
						if(users.length>0){
							users.each(function(){
								var keys = [];
								var name = "";
								$(this).find("*").each(function(){
									if(this.tagName == "username"){
										name = $(this).text();
									}
									else{
										keys.push(this.tagName);
									}
								});
								result.push({
									user: name,
									items: keys.join(",")
								});
							});
						}
						result = result.sort(function(a, b) {
			              if (a.user.toLowerCase() < b.user.toLowerCase()) { return -1; }
			              if (a.user.toLowerCase() > b.user.toLowerCase()) { return  1; }
			              return 0;
			            });
						var list = [];
						var count = result.length > 50 ? 50 : result.length;
			            for (var i = 0; i < count; i++) {
			            	var curItem = result[i];
				            	list.push('<div type="user" class="ui-widget-content ui-corner-all user nobg"><span class="type">user : </span> <span class="val">'+crushFTP.methods.htmlEncode(curItem.user)+'</span>  <span class="quickLocateNote">(Press <span class="unicode">↵</span> to load user)</span><span class="keys" title="'+crushFTP.methods.htmlEncode(curItem.items)+'">'+crushFTP.methods.htmlEncode(curItem.items)+'</span></div>');
			            };
			            var quickLocateResult = $("#quickLocateResult", quickLocate);
			            var itms = quickLocateResult.empty().append(list.join("")).show().find("div").click(function(event) {
			            	userManager.methods.locateSelectedItem($(this));
			            });
			            quickLocateResult.find("span.val").removeHighlight();
			            if(itms.length==0)
			            {
			            	quickLocateResult.append('<span style="display:block;text-align:center;">Can not find matching item</span>');
			            }
			            else
			            {
			            	quickLocateResult.find("span.val").highlightNoRegex(phrase);
			            	var itm = quickLocateResult.find(".highlight:first").closest("div").addClass('ui-state-active');
							if(itm.length>0)
							{
								delay(function(){
									quickLocateResult.animate({
										scrollTop : quickLocateResult.scrollTop() + itm.position().top
									}, 100);
								}, 50);
							}
			            }
					}
				});
				return false;
			});

			$("#quickLocateButton").click(function(event) {
				if(!$(".ui-dialog").is(":visible")){
					quickLocate.dialog("open");
				}
				return false;
			});

			$(document).bind('keydown', 'Alt+f', function (evt){
				if(!$(".ui-dialog").is(":visible")){
					quickLocate.dialog("open");
				}
		        evt.stopPropagation();
		        evt.preventDefault();
		    });
			var quickLocateResult = $("#quickLocateResult", quickLocate);
			var quickLocateFilter = $("#quickLocateFilter", quickLocate).unbind("keyup").keyup(function(event) {
				$(this).trigger('keydown');
			});
			$("#selectFilteredUsers", quickLocate).unbind().click(function(){
				$("#filterUserInList").val("").trigger("keyup");
				var userlist = $("#userList");
				userlist.find("option").removeAttr("selected");
				quickLocateResult.find("div[type='user']").each(function(){
					var uname = $(this).find(".val").text();
					userlist.find("option[username='"+uname+"']").attr("selected", "selected");
				});
				userlist.find("option:selected:last").trigger("change");
				quickLocate.dialog("close");
				return false;
			});
			quickLocate.find("input[name='quickLocateOption']").change(function(event) {
				window.quickLocateLastPhrase = false;
				quickLocateFilter.trigger('keydown');
				if($(this).attr("id") == "quickLocateUserSettings"){
					$("#quickLocateResult", quickLocate).slideUp("fast", function(){
						$(this).empty();
					});
					settingSearchAction.show();
				}
				else{
					settingSearchAction.hide();
				}
			});

		    $("#quickLocateFilter", quickLocate).unbind("keydown").keydown(function (evt) {
				var evt = (evt) ? evt : ((event) ? event : null);
				if (evt.keyCode == 27)
				{
					if($(this).val() == "")
					{
						if(!quickLocateResult.is(":visible"))
							quickLocate.dialog("close");
					}
					else
					{
						$(this).val("").trigger("keydown");
						quickLocateResult.find(".ui-state-active").removeClass("ui-state-active");
					}
					return false;
				}
				else if(evt.keyCode == 13)
				{
					if(quickLocate.find("input[name='quickLocateOption']:checked").attr("id") === "quickLocateUserSettings"){
						quickLocate.find("#submitBtnForUserSettings").trigger("click");
					}
					else{
						var active = quickLocateResult.find(".ui-state-active");
						if(active.length>0)
						{
							$(this).val("").trigger("keydown");
							quickLocateResult.find(".ui-state-active").removeClass("ui-state-active").trigger("click");
						}
					}
					return false;
				}
				else if(evt.keyCode == 38 || evt.keyCode == 40)
				{
					evt.stopPropagation();
					evt.preventDefault();
					var active = quickLocateResult.find(".ui-state-active");
					if(active.length==0)
					{
						active = quickLocateResult.find("div:visible:first").addClass("ui-state-active");
						return;
					}
					var isUp = evt.keyCode == 38;
					if(isUp)
					{
						if(active.prevAll(":visible").length>0)
						{
							quickLocateResult.find(".ui-state-active").removeClass("ui-state-active");
							active.prevAll(":visible:first").addClass("ui-state-active");
						}
					}
					else
					{
						if(active.nextAll(":visible").length>0)
						{
							quickLocateResult.find(".ui-state-active").removeClass("ui-state-active");
							active.nextAll(":visible:first").addClass("ui-state-active");
						}
					}
					var itm = quickLocateResult.find(".ui-state-active");
					if(itm.length>0)
					{
						delay(function(){
							quickLocateResult.animate({
								scrollTop : quickLocateResult.scrollTop() + itm.position().top
							}, 100);
						}, 50);
					}
					return false;
				}
				if(quickLocate.find("input[name='quickLocateOption']:checked").attr("id") !== "quickLocateUserSettings")
					userManager.methods.showQuickLocateResult(quickLocate, this.value);
			});
			$(document).bind('keydown', 'Alt+0', function (evt){
				userManager.methods.keyboarNav(0);
		        evt.stopPropagation();
		        evt.preventDefault();
		    });

		    $(document).bind('keydown', 'Alt+1', function (evt){
				userManager.methods.keyboarNav(1);
		        evt.stopPropagation();
		        evt.preventDefault();
		    });
		    $(document).bind('keydown', 'Alt+2', function (evt){
				userManager.methods.keyboarNav(2);
		        evt.stopPropagation();
		        evt.preventDefault();
		    });
		    $(document).bind('keydown', 'Alt+3', function (evt){
				userManager.methods.keyboarNav(3);
		        evt.stopPropagation();
		        evt.preventDefault();
		    });
		    $(document).bind('keydown', 'Alt+4', function (evt){
				userManager.methods.keyboarNav(4);
		        evt.stopPropagation();
		        evt.preventDefault();
		    });
		    $(document).bind('keydown', 'Alt+5', function (evt){
				userManager.methods.keyboarNav(5);
		        evt.stopPropagation();
		        evt.preventDefault();
		    });
		    $(document).bind('keydown', 'Alt+6', function (evt){
				userManager.methods.keyboarNav(6);
		        evt.stopPropagation();
		        evt.preventDefault();
		    });
		    $(document).bind('keydown', 'Alt+7', function (evt){
				userManager.methods.keyboarNav(7);
		        evt.stopPropagation();
		        evt.preventDefault();
		    });
		    $(document).bind('keydown', 'Alt+8', function (evt){
				userManager.methods.keyboarNav(8);
		        evt.stopPropagation();
		        evt.preventDefault();
		    });
		    $(document).bind('keydown', 'Alt+9', function (evt){
				userManager.methods.keyboarNav(9);
		        evt.stopPropagation();
		        evt.preventDefault();
		    });
		},
		keyboarNav : function(index, evt, code){
			if(evt && code)
			{
				if(evt.altKey)
				{
					if(code == 70) // Alt + F
					{
						if(!$(".ui-dialog").is(":visible")){
							$("#quickLocate").dialog("open");
						}
				        evt.stopPropagation();
				        evt.preventDefault();
				        return;
					}
					if(code>=47 && code<58)
					{
						index = code - 48;
					}
					else if(code>=95 && code<106)
					{
						index = code - 96;
					}
					else
						return false;
				}
				else
					return false;
			}
			var mostVisitedUsers = $("#mostVisitedUsers");
			if(mostVisitedUsers.is(":visible"))
			{
				mostVisitedUsers.find("li[_index='"+index+"']").trigger('click');
			}
		},
		locateSelectedItem : function(item){
			if(!item || item.length==0)return false;
			var toLocate = item.find("span.val").text();
			var type = item.attr("type");
			var settingText = item.attr("settingText");
			if(item.hasClass('subItem'))
				type = "settingq";
			if(type == "user")
			{
				var userList = $("#userList");
				if(userList.find("option[username='"+toLocate+"']").length>0)
				{
					setTimeout(function(){
						userList.val(toLocate).trigger('change');
					}, 200);
				}
				else
				{
					$("#groupSelectList").val("all").trigger('change');
					if(userList.find("option[username='"+toLocate+"']").length>0)
					{
						setTimeout(function(){
							userList.val(toLocate).trigger('change');
						}, 200);
					}
					else{
						userManager.methods.loadUserFromData(toLocate);
					}
				}
			}
			else if(type == "group")
			{
				if(toLocate == "All Users")
					toLocate = "all";
				else if(toLocate == "Not In A Group")
					toLocate = "notingroup";
				else if(toLocate == "Add new group")
					toLocate = "#addnewgroup#";

				$("#groupSelectList").val(toLocate).trigger('change');
			}
			else if(type == "setting")
			{
				$("#quick_jump").val(toLocate).trigger('change');
			}
			else if(type == "settingq")
			{
				toLocate = item.attr("settingsPanel");
				$("#quick_jump").val(toLocate).trigger('change', [true]);
				var pnl = $("[quickLocate='"+item.find("span.val").text()+"']");
				if(pnl && pnl.length>0)
				{
					var top_val = pnl.offset().top;
					$('html, body').animate({ scrollTop: top_val - 150 }, 200);
					pnl.closest("fieldset").effect("highlight", {}, 2000);
					$('#quick_filter').val("");
				}
			}
			$("#quickLocate").dialog("close");
		},
		showQuickLocateResult : function(quickLocate, phrase)
		{
			phrase = $.trim(phrase.toLowerCase());
			if(window.quickLocateLastPhrase == phrase)
				return false;
			window.quickLocateLastPhrase = phrase;
			if(!phrase)
			{
				$("#quickLocateResult", quickLocate).slideUp("fast", function(){
					$(this).empty();
				});
				return false;
			}
			var filterAll = quickLocate.find('#quickLocateAll').is(":checked");
			var users, groups, settings, stngT;
			users = [];
			for (var i = 0; i < crushFTP.storage("users").length; i++) {
				users.push(crushFTP.storage("users")[i].text);
			};
			groups = [];
			$("#groupSelectList").find("option").each(function(){
				groups.push($(this).text());
			});
			settings = [];
			stngT = [];
			$("[filterkeywords]").each(function(){
				var pnl = $(this).closest("div.userMgrPanel").attr("id").replace("pnl", "");
				if(!stngT.has(pnl))
				{
					stngT.push(pnl);
					settings.push({
						panel : pnl,
						val : $(this).attr('filterKeywords')
					});
				}
			});

			var quickLocates = [], ql = [];
			$("[quickLocate]").each(function(){
				var value = $(this).attr("quickLocate");
				var pnl = $(this).closest("div.userMgrPanel").attr("id").replace("pnl", "");
				if(!ql.has(value))
				{
					ql.push(pnl);
					quickLocates.push({
						panel : pnl,
						val : value,
						target : $(this)
					});
				}
			});

			if(!crushFTP.storage("userName"))
				quickLocates = settings = [];
			if(!filterAll)
			{
				if(quickLocate.find('#quickLocateUser').is(":checked"))
				{
					quickLocates = settings = groups = [];
				}
				if(quickLocate.find('#quickLocateGroups').is(":checked"))
				{
					quickLocates = settings = users = [];
				}
				if(quickLocate.find('#quickLocateSettings').is(":checked"))
				{
					users = groups = [];
				}
			}

			var filtered = [];
			var stq = [];
			function quickFilter(arr, type){
				for (var i = 0; i < arr.length; i++) {
					var curItem = arr[i];
					var value = curItem;
					if(type == "setting" || type == "settingq")
					{
						value = curItem.val;
					}
					var cmpTo = $.trim(value).toLowerCase();
					if(cmpTo.indexOf(phrase) >= 0 || phrase == "*" || phrase == type)
					{
						var sortBy = value;
						if(type == "setting")
						{
							if(!stq.has(curItem.panel))
							{
								stq.push(curItem.panel);
							}
							sortBy = curItem.panel;
						}
						else if(type == "settingq")
						{
							sortBy = curItem.panel + " -> " + value;
							if(!stq.has(curItem.panel))
							{
								stq.push(curItem.panel);
								filtered.push({
									type : "setting",
									value : curItem.panel,
									settingsPanel : curItem.panel,
									sortBy : curItem.panel,
									curItem : curItem
								});
							}
						}
						var resultVal = value;
						if(type == "settingq")
						{
							resultVal = curItem.panel + " -> " + value;
						}
						filtered.push({
							type : type,
							value : resultVal,
							settingsPanel : curItem.panel,
							curItem : curItem,
							sortBy : sortBy,
							origVal : value
						});
					}
				};
			}

			filtered = [];
			quickFilter(settings, "setting");
			if(quickLocates.length>0)
				quickFilter(quickLocates, "settingq");
			quickFilter(users, "user");
			quickFilter(groups, "group");
			filtered = filtered.sort(function(a, b) {
              if (a.sortBy.toLowerCase() < b.sortBy.toLowerCase()) { return -1; }
              if (a.sortBy.toLowerCase() > b.sortBy.toLowerCase()) { return  1; }
              return 0;
            });
			var list = [];
			var count = filtered.length > 30 ? 30 : filtered.length;
            for (var i = 0; i < count; i++) {
            	var curItem = filtered[i];
            	if(curItem.type == "setting")
            		list.push('<div type="'+curItem.type+'" settingText="'+curItem.value+'" class="ui-widget-content ui-corner-all '+curItem.type+' nobg"><span class="type">'+curItem.type+' : </span> <span class="val">'+curItem.settingsPanel+'</span>  <span class="quickLocateNote">(Press <span class="unicode">↵</span> to load '+curItem.type+')</span></div>');
            	else if(curItem.type == "settingq")
            	{
            		curItem.type = "setting";
            		list.push('<div type="'+curItem.type+'" settingsPanel="'+curItem.settingsPanel+'" settingText="'+curItem.origVal+'" class="ui-widget-content ui-corner-all nobg subItem"><span class="type"></span> <span class="val">'+curItem.origVal+'</span>  <span class="quickLocateNote">(Press <span class="unicode">↵</span> to load '+curItem.type+')</span></div>');
            	}
            	else
            		list.push('<div type="'+curItem.type+'" class="ui-widget-content ui-corner-all '+curItem.type+' nobg"><span class="type">'+curItem.type+' : </span> <span class="val">'+curItem.value+'</span>  <span class="quickLocateNote">(Press <span class="unicode">↵</span> to load '+curItem.type+')</span></div>');
            };
            var quickLocateResult = $("#quickLocateResult", quickLocate);
            var itms = quickLocateResult.empty().append(list.join("")).show().find("div").click(function(event) {
            	userManager.methods.locateSelectedItem($(this));
            });
            quickLocateResult.find("span.val").removeHighlight();
            if(itms.length==0)
            {
            	quickLocateResult.append('<span style="display:block;text-align:center;">Can not find matching item</span>');
            	$("#selectFilteredUsersDiv", quickLocate).hide();
            }
            else
            {
            	quickLocateResult.find("span.val").highlightNoRegex(phrase);
            	var itm = quickLocateResult.find(".highlight:first").closest("div").addClass('ui-state-active');
				if(itm.length>0)
				{
					delay(function(){
						quickLocateResult.animate({
							scrollTop : quickLocateResult.scrollTop() + itm.position().top
						}, 100);
						if(quickLocateResult.find("div[type='user']").length>0)
							$("#selectFilteredUsersDiv", quickLocate).show();
						else
							$("#selectFilteredUsersDiv", quickLocate).hide();
					}, 50);
				}
            }
		},
		showRecentUsersPersonalization : function()
		{
			var personalizations = $.crushFtpPersonalization.getPersonalizations("userManager");
			var personalizedUsersPanel = $("#personalizedUsersPanel");
			if(personalizations)
			{
				var userList = crushFTP.storage("users");
				var availableUser = [];
				for (var i = 0; i < userList.length; i++) {
					availableUser.push(userList[i].text);
				};
				function isUserAvailable(user){
					return availableUser.has(user);
				}
				var users = personalizations.users;
				if(users.edited)
				{
					var edited = [];
					for(var itm in users.edited)
					{
						var _itm = users.edited[itm];
						if(_itm.loadCount>0)
						{
							edited.push({
								name : itm,
								count : _itm.loadCount
							});
						}
					}
					var hadEdited = false;
					if(edited.length>0)
					{
						edited = edited.sort(function(x, y){
						    var n = y.count - x.count;
						    if (n != 0) {
						        return n;
						    }
						    return y.name < x.name;
						});
						var edt = personalizedUsersPanel.find(".edited").show();
						var lne = edited.length > 10 ? 10 : edited.length;
						edt.find('select').empty().append('<option>-</option>');
						for (var i = 0; i < lne; i++) {
							if(isUserAvailable(edited[i].name))
							{
								hadEdited = true;
								edt.find('select').append("<option value='"+edited[i].name+"'>"+edited[i].name+"</option>");
							}
						};
					}
					if(!hadEdited)
					{
						personalizedUsersPanel.find(".edited").hide();
					}
				}
				if(users.viewed)
				{
					var viewed = [];
					for(var itm in users.viewed)
					{
						var _itm = users.viewed[itm];
						if(_itm.loadCount>0)
						{
							viewed.push({
								name : itm,
								count : _itm.loadCount
							});
						}
					}
					var hasViewed = false;
					if(viewed.length>0)
					{
						viewed = viewed.sort(function(x, y){
						    var n = y.count - x.count;
						    if (n != 0) {
						        return n;
						    }
						    return y.name < x.name;
						});
						var vwd = personalizedUsersPanel.find(".viewed").show();
						var lnv = viewed.length > 10 ? 10 : viewed.length;
						vwd.find('select').empty().append('<option>-</option>');
						for (var i = 0; i < lnv; i++) {
							if(isUserAvailable(viewed[i].name))
							{
								hasViewed = true;
								vwd.find('select').append("<option value='"+crushFTP.methods.htmlEncode(viewed[i].name)+"'>"+crushFTP.methods.htmlEncode(viewed[i].name)+"</option>");
							}
						};

						//lnv = lnv > 5 ? 5 : lnv;
						var mostVisitedUsers = $("#mostVisitedUsers").show();
						mostVisitedUsers.find('ul').empty();
						for (var i = 0; i < lnv; i++) {
							if(isUserAvailable(crushFTP.methods.htmlEncode(viewed[i].name)))
							{
								var sup = i+1;
								if(sup==10)
									sup = 0;
								mostVisitedUsers.find('ul').append('<li class="ui-state-default ui-corner-all" _index="'+sup+'"><a user="'+crushFTP.methods.htmlEncode(viewed[i].name)+'" href="#">'+crushFTP.methods.htmlEncode(viewed[i].name)+'</a> <sup>alt+'+sup+'</sup></li>');
							}
						};
						mostVisitedUsers.find("a").click(function(event) {
							var loading = $(this).closest('li').addClass('ui-state-hover');
							$('#recentlyViewedUsers').val($(this).attr("user")).trigger('change');
							setTimeout(function(){
								loading.removeClass('ui-state-hover');
							}, 2000);
							return false;
						});
						mostVisitedUsers.find("li").click(function(){$(this).find("a").click();return false;});
					}
					if(!hasViewed)
					{
						personalizedUsersPanel.find(".viewed").hide();
					}
				}
			}
			return false;
		},
		showFeaturesBasedOnVersion : function(context)
		{
			context = context || userManager.placeHolder;
			var versionNo = ($(document).data("app_version")+"").replace( /^\D+/g, '');
			context.find(".enterpriseFeature, .crush6Feature, .crush7Feature").hide();
			if(!versionNo)return;
			var crushVersion = parseInt(versionNo);
			$.crushVersion = crushVersion;
			$.isCrush7 = crushVersion>=7;
			var isEnterprise = $(document).data("app_enterprise");
			context.find(".enterpriseFeature").each(function(){
				if($(this).hasClass("crush6Feature") && crushVersion>=6)
					$(this).show();
				else if($(this).hasClass("crush7Feature") && crushVersion>=7)
					$(this).show();
				else if(!$(this).hasClass("crush6Feature") && !$(this).hasClass("crush7Feature"))
					$(this).show();
			});
			context.find(".crush6Feature, .crush7Feature").not(".enterpriseFeature").each(function(){
				if($(this).hasClass("crush6Feature") && crushVersion>=6)
					$(this).show();
				else if($(this).hasClass("crush7Feature") && crushVersion>=7)
					$(this).show();
			});

			if($.isCrush7 && !$.personalizationsAdded)
			{
				$.personalizationsAdded = true;
				userManager.methods.bindPersonalizations();
			}
		},
		showInfoToUserAboutSpecialUser : function(userName, callback){
			if(userName.toLowerCase() == "anonymous")
			{
				jConfirm("This username is special and will allow any password. <br/>Are you sure  you want to allow any password?<br/>(Be sure to be secure if you do)", "Allow Anonymous User?", function(accepted){
					if(accepted)
					{
						callback(true);
					}
				});
			}
			else if(userName.toLowerCase() == "template")
			{
				jConfirm("Template is a special username that allows all usernames and passwords to login.<br/>Its like a catch all account... similar to anonymous logins.<br/><br/>Are you sure you want to use this username?", "Allow Anonymous User?", function(accepted){
					if(accepted)
					{
						callback(true);
					}
				});
			}
			else
			{
				callback();
			}
		},
		checkGroupNameExistance : function(groupName){
			var groupExist = false;
			var groupInfo = crushFTP.storage("groupInfoXML");
			if(groupInfo && $(groupInfo).find("result_item").length>0)
			{
				var groups = [];
				$(crushFTP.storage("groupInfoXML")).find("result_item:last").find("*[type='vector']").each(function(){
					groups.push($(this)[0].tagName.toLowerCase())
				});
				if(groups.has(groupName.toLowerCase()))
				{
					groupExist = true;
				}
			}
			return groupExist;
		},
		checkUserNameAvailability : function(user, callback)
		{
			var userExists = false;
			crushFTP.data.serverRequest({
				command: 'getUser',
				serverGroup : $("#userConnectionGroups").val() || "MainUsers",
				username : user
			},
			function(data){
				if(data)
				{
					var usersData = $.xml2json(data, false);
					if(usersData && usersData["response_status"] && usersData["response_status"]== "OK")
					{
						userExists = true;
					}
				}
				if(callback)
				{
					callback(userExists);
				}
			});
		},
		listenChanges : function(context){
			if(!context)return;
			context.find("input:not(.ignoreChange), select:not(.ignoreChange), textarea:not(.ignoreChange)").change(function(){
				userManager.methods.itemsChanged(true, $(this));
			});
			context.find("input[type='text']:not(.ignoreChange), textarea:not(.ignoreChange)").bind("textchange", function(){
				userManager.methods.itemsChanged(true, $(this));
			});
		},
		itemsChanged : function(flag, elem){
			var context = userManager.placeHolder;
			if(flag && elem && elem.closest)
			{
				var fieldSetID = $(elem).closest("fieldset").attr("_uniqueID");
				if(!fieldSetID)
				{
					fieldSetID = crushFTP.methods.generateRandomPassword(10);
				}
				if(!userManager.changedSettings)
					userManager.changedSettings = [];
				if(!userManager.changedSettings.has(fieldSetID))
					userManager.changedSettings.push(fieldSetID);
			}
			if(context)
			{
				context.data("hasChanged", flag);
				if(!userManager.saveButton)
				{
					userManager.saveButton = $("#saveUserData");
				}
				if(flag)
				{
					userManager.saveButton.addClass("ui-state-hover");
				}
				else
				{
					userManager.saveButton.removeClass("ui-state-hover");
					userManager.changedSettings = [];
				}
			}
		},
		changesSavedForPanel : function(uniqueID)
		{
			if(!uniqueID)return;
			if(!userManager.changedSettings)
				userManager.changedSettings = [];
			if(userManager.changedSettings.has(uniqueID))
			{
				userManager.changedSettings.remove(userManager.changedSettings.indexOf(uniqueID));
			}
		},
		hasPendingChanges : function()
		{
			if(!userManager.changedSettings)
				userManager.changedSettings = [];
			return userManager.changedSettings.length>0;
		},
		setPageTitle : function(title, append){
			if(title)
			{
				if(append)
				{
					title =  $(document).data("pageTitle") + " :: " + title;
				}
				document.title = title;
			}
			else if($(document).data("pageTitle"))
			{
				document.title = $(document).data("pageTitle");
			}
		},
		confirmExit : function(){
			if(userManager.placeHolder.data("hasChanged") && crushFTP.storage("userName"))
			{
				return "If you navigate away, you will lose your unsaved changes for user : " + crushFTP.storage("userName") + ". Do you want to continue?";
			}
		},
		validateUserPassword : function(password, username)
		{
			if(!username)
			{
				username = $("#crush_value1", panelSetup._panel).val();
			}
			var pswdToCmpare = password.toUpperCase();
			if(pswdToCmpare.indexOf("MD5:")==0 || pswdToCmpare.indexOf("MD4:")==0 || pswdToCmpare.indexOf("SHA:")==0 || pswdToCmpare.indexOf("SHA512:")==0  || pswdToCmpare.indexOf("SHA256:")==0 || pswdToCmpare.indexOf("SHA3:")==0 || pswdToCmpare.indexOf("CRYPT3:")==0 || pswdToCmpare.indexOf("BCRYPT:")==0 || pswdToCmpare.indexOf("MD5CRYPT:")==0)
				return false;
			if(userManager.usernamesToIgnorePasswordValidation.has(username.toLowerCase()))return false;
			var messages = false;
			var minLength = $(document).data("GUIXMLPrefs").min_password_length || 8;
			var minNumeric = $(document).data("GUIXMLPrefs").min_password_numbers || 0;
			var minLower = $(document).data("GUIXMLPrefs").min_password_lowers || 0;
			var minUpper = $(document).data("GUIXMLPrefs").min_password_uppers || 0;
			var minSpecial = $(document).data("GUIXMLPrefs").min_password_specials || 0;
			var unsafeChars = $(document).data("GUIXMLPrefs").unsafe_password_chars || "";
			var specialChars = userManager.specialCharactersInUserPass + "";
			for (var i = 0; i < unsafeChars.length; i++) {
				specialChars = specialChars.split(unsafeChars.charAt(i)).join('');
			}
			if($(document).data("GUIXMLPrefs").blank_passwords == "false" && password.length == 0 && $(document).data("GUIXMLPrefs").min_password_length!=0)
			{
				return messages;
			}
			var continueValidation = true;
			if($("#crush_value2", panelSetup._panel).hasClass("ignoreBlank"))
			{
				 continueValidation = (password.length>0);
			}
			if(continueValidation)
			{
				var passed = validatePassword(password, {
					length:   [minLength, 512],
					lower:    minLower,
					upper:    minUpper,
					numeric:  minNumeric,
					special:  minSpecial,
					badWords: unsafeChars.split("")
				});
				if(!passed)
				{
					var rules = [];
					rules.push("<br /> - Must be of at least " + minLength +  " characters");
					if(minNumeric>0)
					{
						rules.push(" - Must contain at least " + minNumeric +  " numbers");
					}
					if(minLower>0)
					{
						rules.push(" - Must contain at least " + minLower +  " lower case characters");
					}
					if(minUpper>0)
					{
						rules.push(" - Must contain at least " + minUpper +  "  upper case characters");
					}
					if(minSpecial>0)
					{
						rules.push(" - Must contain at least " + minSpecial +  "  special characters (like "+specialChars+")");
					}
					if(unsafeChars){
						rules.push(" - Must not contain unsafe characters like " + unsafeChars);
					}
					messages = [];
					messages.push("Password is not valid. Follow these rules for password : " + rules.join("<br/>"));
				}
			}
			return messages;
		},
		seperateValueAndInheritValue : function(val)
		{
			var dataInheritedFrom = false;
			if(val && val.lastIndexOf("|||||")>=0)
			{
				dataInheritedFrom = val.substring(val.lastIndexOf("|||||"), val.length);
				dataInheritedFrom = dataInheritedFrom.replace("|||||","");
				val = val.substring(0, val.lastIndexOf("|||||"));
			}
			return {
				value : val,
				inherit : dataInheritedFrom
			};
		},
		showInheritValueLabel : function(field, dataInheritedFrom)
		{
			if(dataInheritedFrom)
			{
				var parent = $(field).closest("fieldset").attr("inheritedFrom", dataInheritedFrom);
				if(!parent.hasClass("inheritValSet") )
				{
					parent.addClass("inheritValSet").find("legend").text(dataInheritedFrom);
				}
			}
		}
	}
};

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
	window.isMobileDevice = true;
	jQuery.event.special.dblclick = {
	    setup: function(data, namespaces) {
	        var elem = this,
	            $elem = jQuery(elem);
	        $elem.bind('touchend.dblclick', jQuery.event.special.dblclick.handler);
	    },

	    teardown: function(namespaces) {
	        var elem = this,
	            $elem = jQuery(elem);
	        $elem.unbind('touchend.dblclick');
	    },

	    handler: function(event) {
	        var elem = event.target,
	            $elem = jQuery(elem),
	            lastTouch = $elem.data('lastTouch') || 0,
	            now = new Date().getTime();

	        var delta = now - lastTouch;
	        if(delta > 20 && delta<500){
	            $elem.data('lastTouch', 0);
	            $elem.trigger('dblclick');
	        }else
	            $elem.data('lastTouch', now);
	    }
	};
}