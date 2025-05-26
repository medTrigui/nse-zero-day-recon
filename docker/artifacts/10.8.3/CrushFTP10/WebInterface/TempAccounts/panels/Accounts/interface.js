/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelAccounts = {};
panelAccounts.localization = {};
/****************************/

// Panel details
panelAccounts.panelName = "Accounts";
panelAccounts._panel = $("#pnl" + panelAccounts.panelName);

// Localizations
panelAccounts.localization = {
};

// Assign localizations
localizations.panels[panelAccounts.panelName] = $.extend(panelAccounts.localization, localizations.panels[panelAccounts.panelName]);

var tempAccountsList = $("#lst_tempAccounts", panelAccounts._panel);
var generalSettingsPanel = $("#generalSettingsPanel", panelAccounts._panel);

// Interface methods
panelAccounts.init = function(){
	applyLocalizations(panelAccounts.panelName, localizations.panels);
	panelAccounts.bindEvents();
	panelAccounts.resizeInfoContent();
	panelAccounts.showHidePanels();
	panelAccounts.accountsLoadingIndicator(true);
	crushFTP.data.refreshAvailableJobs(function(data){
		panelAccounts.bindActions();
		panelAccounts.bindData();
	});
}

panelAccounts.showHidePanels = function(flag)
{
	if(flag)
	{
		$("#accountDetailsPanel", panelAccounts._panel).show();
		$("#accountsContentTip", panelAccounts._panel).hide();
	}
	else
	{
		$("#accountDetailsPanel", panelAccounts._panel).hide();
		$("#accountsContentTip", panelAccounts._panel).show();
	}
}

panelAccounts.bindActions = function()
{
	var expirationAction = $("#temp_accounts_account_expire_task, #share_expire_notify_task", panelAccounts._panel).empty();
	expirationAction.append("<option value=\"\">Please select</option>");
	var crushTaskPlugins = crushFTP.data.getPluginPrefs("CrushTask");
	var pluginOpts = $('<optgroup label="Plugin"></optgroup>');
	for(var index=0; index<crushTaskPlugins.length;index++)
	{
		var curPlugin = crushTaskPlugins[index];
		var tabName = curPlugin.subItem ? "CrushTask:" + curPlugin.subItem : "CrushTask";
		pluginOpts.append("<option value=\""+unescape(tabName)+"\">"+unescape(tabName)+"</option>");
	}
	expirationAction.append(pluginOpts);
	var availableJobs = $(document).data("AvailableJobsNoEvents");
	if(availableJobs && availableJobs.length>0)
	{
		var jobOpts = $('<optgroup label="Job"></optgroup>');
		for (var i = 0; i < availableJobs.length; i++) {
			jobOpts.append("<option value=\"Job:"+crushFTP.methods.textEncode(unescape(availableJobs[i]))+"\">"+crushFTP.methods.textEncode(unescape(availableJobs[i]))+"</option>");
		}
		expirationAction.append(jobOpts);
	}
	$("#showUrl").unbind().change(function(){
		var containedFiles = $("#containedFiles", panelAccounts._panel);
		var showUrl = $(this).is(":checked");
		containedFiles.find("li").each(function(){
			var fullPath = $(this).attr("fullPath");
			var fileName = $(this).attr("key");
			var toShow = showUrl ? fullPath : fileName;
			$(this).text(toShow);
		});
	});
}

panelAccounts.resizeInfoContent = function()
{
	var userInfoContent = $("#AccountsContent", panelAccounts._panel);
	var sideBar = $(".sideBarTempAccounts", panelAccounts._panel);
	var windowWidth = $(window).width();
	windowWidth = windowWidth - sideBar.width() - 115;
	windowWidth = windowWidth < 300 ? 300 : windowWidth;
	userInfoContent.width(windowWidth);
}

panelAccounts.bindEvents = function()
{
	$(window).resize(function () {
		panelAccounts.resizeInfoContent();
	});

	tempAccountsList.unbind("change").bind("change"
	, function(){
		if($(this).find(":selected").length==1)
		{
			panelAccounts.accountSelected($(this), $(this).find(":selected:first"));
		}
		else
		{
			panelAccounts.showHidePanels();
		}
	});

	var filterAccountField = $("#filterAvailableAccounts", panelAccounts._panel).unbind("keyup").keyup(function (evt) {
		var evt = (evt) ? evt : ((event) ? event : null);
		if (evt.keyCode === 27) {
			evt.preventDefault();
			filterAccountField.val("").trigger("keyup");
			return;
		}
		var phrase = this.value;
		if (window.last_searched_c === phrase) {
			return false;
		}
		panelAccounts.bindAccounts(phrase);
		if(tempAccountsList.find(":selected").length==0)
			panelAccounts.showHidePanels();
		window.last_searched_c = phrase;
	});

	$("#clearFilter", panelAccounts._panel).click(function(){
		filterAccountField.val("").trigger("keyup");
		return false;
	});

	$("#reloadAccountsLink", panelAccounts._panel).click(function(){
		panelAccounts.bindData();
		return false;
	});

	$("a.serverFilePickButton", panelAccounts._panel).each(function(){
		$(this).unbind("click").click(function(){
			var curElem = $(this);
            var rel = curElem.attr("rel");
            var pickingFor = curElem.parent().parent().parent().find("label[for='"+rel+"']").text() || "";
            pickingFor = $.trim($.trim(pickingFor).replace(":", ""));
			var rel = $("#" + curElem.attr("rel"), panelAccounts._panel);
			curElem.crushFtpLocalFileBrowserPopup({
				type : curElem.attr("PickType") || 'any',
				pickingFor: pickingFor,
				file_mode : curElem.attr("FileMode") || 'server',
				allowMultiple : true,
				callback : function(selectedPath){
					if(curElem.is("#addFiles"))
					{
						if(selectedPath)
						{
							var items = selectedPath.split("\n");
							var files = [];
							for(var i=0;i<items.length;i++)
							{
								var curPath = $.trim(items[i]);
								if(curPath.length>0 && rel.find("option[val='"+curPath+"']").length==0)
								{
									files.push(curPath);
								}
							}
							if(files && files.length>0)
							{
								panelAccounts.filesListingLoadingIndicator(true);
								panelAccounts.addSelectedFilesFromAccount(files, function(){
									panelAccounts.filesListingLoadingIndicator();
									panelAccounts.accountSelected(tempAccountsList, tempAccountsList.find(":selected:first"));
								});
							}
						}
					}
					else
					{
						$("#" + curElem.attr("rel"), panelAccounts._panel).val(selectedPath).trigger("change");
					}
				}
			});
			return false;
		});
	});

	$("#allowUploads", panelAccounts._panel).unbind().change(function(){
		if($(this).hasClass("noChange"))
			return;
		if(panelAccounts.curAccountData && panelAccounts.curAccountData.info)
		{
			panelAccounts.curAccountData.info.allowUploads = $(this).is(":checked");
		}
	});

	$("#expire", panelAccounts._panel).unbind().change(function(){
		if($(this).hasClass("noChange"))
			return;
		if(panelAccounts.curAccountData && panelAccounts.curAccountData.info)
		{
			var format = "mm/dd/yyyy";
			panelAccounts.curAccountData.info.expire = $(this).datetimepicker("getDate").format(format + " hh:MM TT");
			$("#expire2", panelAccounts._panel).val(panelAccounts.curAccountData.info.expire);
		}
	});

	$("#expire", panelAccounts._panel).unbind("textchange").bind("textchange", function(){
		if(panelAccounts.curAccountData && panelAccounts.curAccountData.info)
		{
			var format = "mm/dd/yyyy";
			panelAccounts.curAccountData.info.expire = $(this).datetimepicker("getDate").format(format + " hh:MM TT");
			$("#expire2", panelAccounts._panel).val(panelAccounts.curAccountData.info.expire);
		}
	});

	$("#removeFiles", panelAccounts._panel).click(function(){
		panelAccounts.filesListingLoadingIndicator(true);
		panelAccounts.removeSelectedFilesFromAccount(function(){
			panelAccounts.filesListingLoadingIndicator();
		});
		return false;
	});

	$("#linkGeneralSettings", panelAccounts._panel).click(function(){
		generalSettingsPanel.show()
		generalSettingsPanel.find("input:first").focus();
		panelAccounts.resizeInfoContent();
		return false;
	});

	$("#cancelGeneralSettings", panelAccounts._panel).click(function(){
		generalSettingsPanel.slideUp("fast", function(){
			panelAccounts.resizeInfoContent();
		});
		return false;
	});

	$("#saveGeneralSettings", panelAccounts._panel).click(function(){
		panelAccounts.savePrefs();
		return false;
	});

	var createUserDialog = $("#createUserDialog", panelAccounts._panel).form().dialog({
		autoOpen: false,
		width: 500,
		modal: true,
		resizable: false,
		closeOnEscape: false,
		title : "Create new account :",
		buttons: {
			"Cancel" : function(){
				$(this).dialog("close");
			},
			"OK": function() {
				var hasError = false;
				$(".validate", createUserDialog).each(function(){
					if($(this).validateNow())
					{
						hasError = true;
					}
				})
				if(!hasError)
				{
					var uName = $.trim(createUserDialog.find("#username_prompt").val());
					var uPass = $.trim(createUserDialog.find("#userpassword_prompt").val());
					if(tempAccountsList.find("[username='"+uName.toLowerCase()+"']").length>0)
					{
						alert("User already exist, please choose another name");
						createUserDialog.find("#username_prompt").focus();
						return false;
					}
					else
					{
						var dateNow = new Date();
						dateNow = crushFTP.methods.htmlEncode(dateNow.format("mm/dd/yyyy hh:MM TT"));
						var url = crushFTP.methods.htmlEncode(window.location.protocol + "//" + window.location.host + "/");
						var publishType = createUserDialog.find("input[name='publishType']:checked").val();
						var expDate = $("#expires_prompt", createUserDialog).datetimepicker("getDate");
						var folderName = 'u='+uName+',,p='+uPass+',,m='+$(document).data("username")+',,t=TempAccount,,ex=' + expDate.format("mmddyyyyhhmm");
						var permissions = '(read)(view)(resume)(slideshow)';
						if(createUserDialog.find("#allowUploads_prompt").is(":checked"))
							permissions = '(read)(write)(view)(resume)(slideshow)';
						var saveData = {
							tempaccount_user : uName,
							tempaccount_pass : uPass,
							permissions : '<?xml version="1.0" encoding="UTF-8"?><VFS type="properties"><item name="/">' + permissions + '</item></VFS>',
							info : '<?xml version="1.0" encoding="UTF-8"?><INFO type="properties"><password>'+uPass+'</password><baseUrl>'+url+'</baseUrl><type>text</type><command>publish</command><username>'+uName+'</username><emailBcc></emailBcc><shareUsernamePermissions>'+permissions+'</shareUsernamePermissions><sendEmail>false</sendEmail><emailSubject></emailSubject><created>'+dateNow+'</created><emailTo></emailTo><web_link>'+url+'?u='+uName+'&amp;p='+uPass+'</web_link><publishType>'+publishType+'</publishType><master>'+$(document).data("username")+'</master><emailBody></emailBody><allowUploads>'+createUserDialog.find("#allowUploads_prompt").is(":checked")+'</allowUploads><paths></paths><emailFrom></emailFrom><emailCc></emailCc><expire>'+expDate.format("mm/dd/yyyy hh:MM TT")+'</expire><attach>false</attach><shareUsernames></shareUsernames><instance></instance><shareUsername>false</shareUsername></INFO>',
							tempaccount_folder : folderName
						};
						createUserDialog.block({
							message:  'Please Wait..',
							css: {
								border: 'none',
								padding: '10px',
								width : '110px',
								backgroundColor: '#000',
								'-webkit-border-radius': '10px',
								'-moz-border-radius': '10px',
								opacity: .5,
								color: '#fff',
								'text-align':'center'
							}
						});
						panelAccounts.addEditTempAccount(saveData, function(flag){
							createUserDialog.unblock();
							if(flag)
							{
								panelAccounts.bindData(function(){
									createUserDialog.dialog("close");
									tempAccountsList.val(uName).trigger("change");
								});
							}
							else
							{
								jAlert("Adding account failed, please try again.", "Failed");
							}
						});
					}
				}
			}
		},
		open : function(){
			var randomNameLength = parseInt($(document).data("GUIXMLPrefs").temp_accounts_length);
			if(!randomNameLength) randomNameLength = 4;
			var uName = crushFTP.methods.generateRandomPassword(randomNameLength);
			var uPass = crushFTP.methods.generateRandomPassword(randomNameLength);
			createUserDialog.find("#username_prompt").val(uName);
			createUserDialog.find("#userpassword_prompt").val(uPass);
			var dateNow = new Date();
			dateNow.setDate(dateNow.getDate()+30);
			var expDate = $("#expires_prompt", createUserDialog).datetimepicker("setDate", dateNow);
		}
	});

	$("#user_generateUser").click(function(){
		var randomNameLength = parseInt($(document).data("GUIXMLPrefs").temp_accounts_length);
		if(!randomNameLength) randomNameLength = 4;
		var uName = crushFTP.methods.generateRandomPassword(randomNameLength);
		createUserDialog.find("#username_prompt").val(uName);
		return false;
	});

	$("#user_generateRandomPass").click(function(){
		var randomNameLength = parseInt($(document).data("GUIXMLPrefs").temp_accounts_length);
		if(!randomNameLength) randomNameLength = 4;
		var uPass = crushFTP.methods.generateRandomPassword(randomNameLength);
		createUserDialog.find("#userpassword_prompt").val(uPass);
		return false;
	});

	$("#addEvent", panelAccounts._panel).click(function(evt){
		if(evt.altKey)
			createUserDialog.dialog("open");
		else
		{
			crushFTP.UI.growl("Create Share", "Creating new shares should be done from WebInterface and not from admin panel.", true, 5000);
		}
		return false;
	});

	$("#saveAccountSettings", panelAccounts._panel).click(function(){
		panelAccounts.saveAccountInfo();
		return false;
	});

	$("#removeEvent", panelAccounts._panel).click(function(){
		var toRemove = [];
		tempAccountsList.find(":selected").each(function(){
			var data = $(this).data("controlData");
			if(data)
			{
				toRemove.push(data);
			}
		});
		if(toRemove.length>0)
		{
			jConfirm("Are you sure you wish to remove selected " + toRemove.length + " account(s)?", "Confirm", function(flag){
				if(flag)
				{
					panelAccounts.accountsToRemove = toRemove;
					panelAccounts.removeAccounts(function(){
						panelAccounts.accountsToRemove = false;
						panelAccounts.bindData();
					});
				}
			});
		}
		else
			crushFTP.UI.growl("Nothing selected to remove", "Select account you want to remove", true, 5000);
		return false;
	});
};

panelAccounts.saveAccountInfo = function()
{
	if(panelAccounts.curAccountData && panelAccounts.curAccountData.info)
	{
		var infoXML = [];
		var notToAdd = ["C","EX","M","P","T"];
		var index = tempAccountsList.find(":selected").index();
		var XML = $(panelAccounts.accountXML);
		var curXMLData = XML.find('tempaccount_user:contains('+panelAccounts.curAccountData.tempaccount_user+')').closest('temp_accounts_subitem');
		for(var item in panelAccounts.curAccountData.info)
		{
			if(!notToAdd.has(item))
			{
				var curItem = panelAccounts.curAccountData.info[item];
				if (typeof curItem == 'string' || curItem instanceof String || curItem.toString() == "true" || curItem.toString() == "false"){
					infoXML.push("<"+item+">"+crushFTP.methods.htmlEncode(curItem)+"</"+item+">");
				}
				else{
					var curXML = $(curXMLData).find(item.toString());
					var itemXML = curXML.html();
					var type = curXML.attr("type");
					if(type)
						infoXML.push("<"+item+" type=\""+type+"\">"+itemXML+"</"+item+">");
					else
						infoXML.push("<"+item+">"+itemXML+"</"+item+">");
				}
			}
		}
		var existingPrivs = $(curXMLData).find("permissions").html() || '<item name="/">(read)(view)(resume)(slideshow)</item>';
		var permissions = '<?xml version="1.0" encoding="UTF-8"?><VFS type="properties">'+existingPrivs+'</VFS>';
		if(panelAccounts.curAccountData.info.allowUploads && panelAccounts.curAccountData.info.allowUploads.toString() == "true"){
			if(permissions.indexOf("(write)") < 0)
				permissions = permissions.replace(/\<\/item\>/g, '(write)</item>')
		}
		else{
			if(permissions.indexOf("(write)") >= 0)
				permissions = permissions.replace(/\(write\)/g, '')
		}
		var saveData = {
			tempaccount_user : panelAccounts.curAccountData.tempaccount_user,
			tempaccount_pass : panelAccounts.curAccountData.tempaccount_pass,
			permissions : permissions,
			info : '<?xml version="1.0" encoding="UTF-8"?><INFO type="properties">'+infoXML.join("\n")+'</INFO>',
			tempaccount_folder : panelAccounts.curAccountData.tempaccount_folder
		};
		var accountDetailsPanel = $("#accountDetailsPanel").block({
			message:  'Please Wait..',
			css: {
				border: 'none',
				padding: '10px',
				width : '110px',
				backgroundColor: '#000',
				'-webkit-border-radius': '10px',
				'-moz-border-radius': '10px',
				opacity: 0.5,
				color: '#fff',
				'text-align':'center'
			}
		});
		panelAccounts.addEditTempAccount(saveData, function(flag){
			accountDetailsPanel.unblock();
			if(flag)
			{
				panelAccounts.bindData(function(){
					tempAccountsList.val(saveData.tempaccount_user).trigger("change");
				});
			}
			else
			{
				jAlert("Saving account failed, please try again.", "Failed");
			}
		});
	}
};

panelAccounts.removeAccounts = function(callback)
{
	var selectedAccounts = panelAccounts.accountsToRemove;
	if(!selectedAccounts || selectedAccounts.length == 0)
	{
		if(callback)
			callback();
		return;
	}
	var curAccount = selectedAccounts[0];
	if(!curAccount)return;
	var obj = {
		command : "removeTempAccount",
		tempaccount_user : curAccount.tempaccount_user,
		tempaccount_pass : curAccount.tempaccount_pass,
		tempaccount_folder : curAccount.tempaccount_folder
	}
	crushFTP.data.serverRequest(obj,
	function(data){
		if(data && typeof $(data).find != "undefined" && $(data).find("response").text().toLowerCase().indexOf("success")>=0)
		{
			selectedAccounts.remove(0);
			panelAccounts.removeAccounts(callback);
		}
	});
}

panelAccounts.savePrefs = function()
{
	crushFTP.UI.showIndicator(false, generalSettingsPanel, "Please wait..");
	var loc = $("#temp_accounts_path").val();
	if(loc.lastIndexOf("/")!=loc.length-1 && loc.lastIndexOf("\\")!=loc.length-1)
	{
		loc = loc + "/";
		$("#temp_accounts_path").val(loc);
	}
	var dataXML = '<server_prefs type="properties">'+tempAccounts.data.buildXMLToSubmitForm(generalSettingsPanel)+'</server_prefs>';
	dataXML = dataXML.replace("<expire>"+$("#expire", panelAccounts._panel).val()+"</expire>", "<expire>"+$("#expire2", panelAccounts._panel).val()+"</expire>");
	crushFTP.data.setXMLPrefs("server_settings/server_prefs/"
		, "properties"
		, "update"
		, dataXML
		, function(data){
			data = $.xml2json(data, true);
			if(data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK")
			{
				tempAccounts.data.updateLocalPrefs(function(){
					crushFTP.UI.hideIndicator(false, generalSettingsPanel);
					crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
					var prefs = $(document).data("GUIXMLPrefs");
					tempAccounts.data.bindValuesFromJson(generalSettingsPanel, prefs);
					$("#cancelGeneralSettings", panelAccounts._panel).trigger("click");
				});
			}
			else
			{
				crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
			}
	});
}

panelAccounts.filesListingLoadingIndicator = function(block)
{
	var containedFiles = $("#containedFiles", panelAccounts._panel);
	if(block)
	{
		containedFiles.closest("div").block({
			message:  'Loading..',
			css: {
				border: 'none',
				padding: '10px',
				width : '70px',
				backgroundColor: '#000',
				'-webkit-border-radius': '10px',
				'-moz-border-radius': '10px',
				opacity: .5,
				color: '#fff',
				'text-align':'center'
			}
		});
	}
	else
		containedFiles.closest("div").unblock();
};

panelAccounts.accountsLoadingIndicator = function(block)
{
	var lst_tempAccounts = $("#lst_tempAccounts", panelAccounts._panel);
	if(block)
	{
		lst_tempAccounts.closest("div").block({
			message:  'Loading..',
			css: {
				border: 'none',
				padding: '10px',
				width : '70px',
				backgroundColor: '#000',
				'-webkit-border-radius': '10px',
				'-moz-border-radius': '10px',
				opacity: 0.5,
				color: '#fff',
				'text-align':'center'
			}
		});
	}
	else
		lst_tempAccounts.closest("div").unblock();
};

panelAccounts.accountSelected = function(list, selectedItem)
{
	var data = selectedItem.data("controlData");
	var showUrl = $("#showUrl").is(":checked");
	if(data && data.info){
		panelAccounts.showPrefsData(data.info);
	}
	panelAccounts.curAccountData = data;
	var containedFiles = $("#containedFiles", panelAccounts._panel).empty();
	panelAccounts.filesListingLoadingIndicator(true);
	panelAccounts.getAccountFiles(data, function(filesInfo){
		panelAccounts.filesListingLoadingIndicator();
		var files = $(filesInfo).find("fileNames_subitem");
		var realUrls = $(filesInfo).find("realUrls_subitem");
		if(files)
		{
			files.each(function(index){
				var toShow = showUrl ? $(realUrls.get(index)).text() : $(this).text();
				containedFiles.append('<li class="ui-widget-content" fullPath="'+$(realUrls.get(index)).text()+'" key="'+$(this).text()+'" defaultVal="middle">'+toShow+'</li>');
			});
		}
		containedFiles.find("li").click(function(){
			if($(this).hasClass('ui-selected')){
				$(this).removeClass('ui-selected ui-widget-header');
				return;
			}
			containedFiles.find("li.ui-selected").removeClass('ui-selected ui-widget-header');
			$(this).addClass('ui-selected ui-widget-header');
		});
	});
};

panelAccounts.getAccountFiles = function(data, callback)
{
	var obj = {
		command : "getTempAccountFiles",
		tempaccount_user : data.tempaccount_user,
		tempaccount_pass : data.tempaccount_pass,
		tempaccount_folder : data.tempaccount_folder
	};
	crushFTP.data.serverRequest(obj,
	function(data){
		if(callback)
			callback(data);
	});
};

panelAccounts.removeSelectedFilesFromAccount = function(callback)
{
	var selectedFile = $("#containedFiles", panelAccounts._panel).find(".ui-selected");
	if(!selectedFile || selectedFile.length == 0)
	{
		if(callback)
			callback();
		return;
	}
	var file = selectedFile.attr("key");
	var data = panelAccounts.curAccountData;
	if(!data || !file)return;
	var obj = {
		command : "removeTempAccountFile",
		tempaccount_user : data.tempaccount_user,
		tempaccount_pass : data.tempaccount_pass,
		tempaccount_folder : data.tempaccount_folder,
		tempaccount_file : file
	};
	crushFTP.data.serverRequest(obj,
	function(data){
		if(data && typeof $(data).find != "undefined" && $(data).find("response").text().toLowerCase().indexOf("success")>=0)
		{
			selectedFile.remove();
			panelAccounts.removeSelectedFilesFromAccount(callback);
		}
	});
};

panelAccounts.addSelectedFilesFromAccount = function(files, callback)
{
	if(!files || files.length == 0)
	{
		if(callback)
			callback();
		return;
	}
	var file = files[files.length - 1];
	var data = panelAccounts.curAccountData;
	var containedFiles = $("#containedFiles", panelAccounts._panel);
	if(!data || !file)return;
	var obj = {
		command : "addTempAccountFile",
		tempaccount_user : data.tempaccount_user,
		tempaccount_pass : data.tempaccount_pass,
		tempaccount_folder : data.tempaccount_folder,
		tempaccount_file : file,
		tempaccount_reference : $("#shareOptions", panelAccounts._panel).find("#publishType").text() == "reference"
	};
	crushFTP.data.serverRequest(obj,
	function(data){
		if(data && typeof $(data).find != "undefined" && $(data).find("response").text().toLowerCase().indexOf("success")>=0)
		{
			containedFiles.append("<option val=\""+file+"\">"+file+"</option>");
			files.remove(files.length - 1);
			panelAccounts.addSelectedFilesFromAccount(files, callback);
		}
	});
};

panelAccounts.addEditTempAccount = function(saveData, callback)
{
	if(!saveData)
	{
		if(callback)
			callback();
		return;
	}
	var obj = {
		command : "addTempAccount",
		tempaccount_user : saveData.tempaccount_user,
		tempaccount_pass : saveData.tempaccount_pass,
		permissions : saveData.permissions,
		info : saveData.info,
		tempaccount_folder : saveData.tempaccount_folder
	};
	crushFTP.data.serverRequest(obj,
	function(data){
		if(data && typeof $(data).find != "undefined" && $(data).find("response").text().toLowerCase().indexOf("success")>=0)
		{
			callback(true);
		}
		else
			callback(false);
	});
};

panelAccounts.showPrefsData = function(data)
{
	if(!data)
	{
		panelAccounts.showHidePanels();
		return;
	}
	else
	{
		panelAccounts.showHidePanels(true);
		data.expire = data.expire.replace("+", " ");
		var dateExpire = new Date(data.expire);
		if (window.DateFormat)
			data.expire = dateExpire.format(window.DateFormat + " hh:MM TT");
		else
			data.expire = dateExpire.format("mm/dd/yyyy hh:MM tt");
		$("#allowUploads, #expire", panelAccounts._panel).addClass("noChange");
		tempAccounts.data.bindValuesFromJson($("#accountDetailsPanel", panelAccounts._panel), data);
		setTimeout(function() {
			$("#allowUploads, #expire", panelAccounts._panel).removeClass("noChange");
			$("#expire", panelAccounts._panel).trigger('textchange');
		}, 10);
	}
};

panelAccounts.bindData = function(callback)
{
	panelAccounts.accountsLoadingIndicator(true);
	crushFTP.data.serverRequest({
		command: "getTempAccounts",
		random : Math.random()
	},
	function(data){
		panelAccounts.accountsLoadingIndicator();
		var dataJson = $.xml2json(data);
		panelAccounts.accountXML = data;
		crushFTP.methods.rebuildSubItems(dataJson, "temp_accounts");
		if(dataJson)
		{
			if(dataJson.temp_accounts_subitem)
				dataJson = dataJson.temp_accounts_subitem;
			panelAccounts.tempAccountsData = dataJson;
			panelAccounts.bindAccounts();
		}
		if(callback)
			callback();
	});
	var prefs = $(document).data("GUIXMLPrefs");

	if(typeof prefs.temp_account_share_web_javascript == "undefined")
	    prefs.temp_account_share_web_javascript = "true";
	if(typeof prefs.temp_account_share_web_css == "undefined")
	    prefs.temp_account_share_web_css = "true";
	if(typeof prefs.temp_account_share_web_customizations == "undefined")
	    prefs.temp_account_share_web_customizations = "true";
	if(typeof prefs.temp_account_share_web_buttons == "undefined")
	    prefs.temp_account_share_web_buttons = "true";
	if(typeof prefs.temp_account_share_web_forms == "undefined")
	    prefs.temp_account_share_web_forms = false;
	if(typeof prefs.temp_account_pgp_settings == "undefined")
	    prefs.temp_account_pgp_settings = false;

	tempAccounts.data.bindValuesFromJson(generalSettingsPanel, prefs);
};

panelAccounts.bindAccounts = function(filter)
{
	var selectedVal = tempAccountsList.val();
	tempAccountsList.empty();
	if(filter) filter = filter.toLowerCase();
	var dataJson = panelAccounts.tempAccountsData;
	for(var i=0;i<dataJson.length;i++)
	{
		var curItem = dataJson[i];
		try{
			curItem.dateOrig = new Date(curItem.info.created);
		}catch(ex){}
	}

	dataJson = dataJson.sort(function(a,b){
	  return new Date(b.dateOrig) - new Date(a.dateOrig);
	});

	for(var i=0;i<dataJson.length;i++)
	{
		var curItem = dataJson[i];
		if(curItem && curItem.info)
		{
			var info = curItem.info;
			var created = info.created;
			if (window.DateFormat)
			{
				created = new Date(created);
				created = created.format(window.DateFormat + " hh:MM TT");
			}
			var txtToShow = info.master + " - " + created + " - " + info.U + " - " + info.emailTo;
			var newItem = $("<option username='"+info.U.toLowerCase()+"' value='"+info.U+"'>"+ txtToShow +"</option>");
			newItem.data("controlData", curItem);
			if(filter)
			{
				if(txtToShow.toLowerCase().indexOf(filter)>=0)
				{
					tempAccountsList.append(newItem);
				}
			}
			else
			{
				tempAccountsList.append(newItem);
			}
		}
	}
	if(filter)
		$("#accountCountLabel", panelAccounts._panel).text(tempAccountsList.find("option").length + " (filtered) ");
	else
		$("#accountCountLabel", panelAccounts._panel).text(tempAccountsList.find("option").length);
	tempAccountsList.val(selectedVal);
	if(tempAccountsList.find(":selected").length == 0)
	{
		panelAccounts.showHidePanels();
	}
};