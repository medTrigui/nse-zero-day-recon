/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelAdmin = {};
panelAdmin.localization = {};
/****************************/

// Panel details
var panelName = "Admin";

// Localizations
panelAdmin.localization = {
};

// Assign localizations
localizations.panels[panelName] = $.extend(panelAdmin.localization, localizations.panels[panelName]);

// Interface methods
panelAdmin.init = function(){
	applyLocalizations(panelName, localizations.panels);
	window.dataBindEvents.push(panelAdmin.bindData);
	panelAdmin.bindEvents();
	panelAdmin.prepareRolesSection();
}

panelAdmin.prepareRolesSection = function(){
	var roles = userManager.userRoles || [];
	var pnlUserRoles = panelAdmin._panel.find("#user-roles");
	var pnl = pnlUserRoles.find(".panel");
	for (var i = 0; i < roles.length; i++) {
		var curSection = roles[i];
		pnl.append('<h3>'+crushFTP.methods.htmlEncode(curSection.label)+' <span class="select-items">Select <a href="#" class="selectAll">All</a> | <a href="#" class="selectNone">None</a> | <a href="#" class="selectInverse">Inverse</a></span></h3>');
		var sectionItems = $("<div class='options'><p></p></div>");
		var para = sectionItems.find("p");
		for (var j = 0; j < curSection.items.length; j++) {
			var curItem = curSection.items[j];
			para.append('<div class="option"><input type="checkbox" name="user_role_'+crushFTP.methods.htmlEncode(curItem.key)+'" id="user_role_'+crushFTP.methods.htmlEncode(curItem.key)+'" key="'+crushFTP.methods.htmlEncode(curItem.key)+'" /><label class="field-label" for="user_role_'+crushFTP.methods.htmlEncode(curItem.key)+'">'+crushFTP.methods.htmlEncode(curItem.label)+'</label></div>')
		}
		pnl.append(sectionItems);
	};

	var lastSearchedItem;

	pnlUserRoles.find("#userRolesFilter").unbind("keyup").keyup(function (evt) {
		var evt = (evt) ? evt : ((event) ? event : null);
		var phrase = this.value;
		if (lastSearchedItem && lastSearchedItem === phrase) {
			return false;
		}
		pnl.find("div.options").find(".nothing-found").remove();
		if(phrase){
			pnl.find("div.option").hide();
			pnl.find("label:Contains('"+phrase+"')").closest("div.option").show();
			pnl.find("div.options").each(function(index, el) {
				if($(this).find(".option:visible").length==0){
					$(this).prepend('<div class="nothing-found">No matching item found in this section.</div>');
				}
			});
		}
		else{
			pnl.find("div.option").show();
		}
		lastSearchedItem = phrase;
	});

	pnlUserRoles.find("h3 > .select-items a").click(function(e) {
		e.stopPropagation();
		e.preventDefault();
		if($(this).is(".selectAll")){
			$(this).closest('h3').next().find(".option:visible").each(function(index, el) {
				crushFTP.UI.checkUnchekInput($(this).find("input"), true);
			});
		}
		else if($(this).is(".selectNone")){
			$(this).closest('h3').next().find(".option").each(function(index, el) {
				crushFTP.UI.checkUnchekInput($(this).find("input"), false);
			});
		}
		else if($(this).is(".selectInverse")){
			$(this).closest('h3').next().find(".option:visible").each(function(index, el) {
				crushFTP.UI.checkUnchekInput($(this).find("input"), !$(this).find("input").is(":checked"));
			});
		}
	});

	pnlUserRoles.find(".filters .select-items a").click(function(e) {
		e.stopPropagation();
		e.preventDefault();
		if($(this).is(".selectAll")){
			pnl.find(".option:visible").each(function(index, el) {
				crushFTP.UI.checkUnchekInput($(this).find("input"), true);
			});
		}
		else if($(this).is(".selectNone")){
			pnl.find(".option").each(function(index, el) {
				crushFTP.UI.checkUnchekInput($(this).find("input"), false);
			});
		}
		else if($(this).is(".selectInverse")){
			pnl.find(".option:visible").each(function(index, el) {
				crushFTP.UI.checkUnchekInput($(this).find("input"), !$(this).find("input").is(":checked"));
			});
		}
	});

	setTimeout(function(){
		panelAdmin.rolesDialog = pnlUserRoles.dialog({
			title : "Admin user permissions: ",
			width: 800,
			modal: true,
			autoOpen: false,
			resizable: false,
			closeOnEscape: true,
			buttons: {
				"OK" : function(){
					var selection = [];
					pnl.find("input:checked").each(function(index, el) {
						selection.push($(this).attr("key"));
					});
					if(panelAdmin.onUserRolesSelection)
						panelAdmin.onUserRolesSelection(selection);
					userManager.methods.itemsChanged(true);
					$(this).dialog("close");
				}
			},
			open : function(){
				pnl.find(".option").each(function(index, el) {
					crushFTP.UI.checkUnchekInput($(this).find("input"), false);
				});
				if(panelAdmin.onUserRolesSectionOpen)
					panelAdmin.onUserRolesSectionOpen();
			}
		});
	}, 100);
}

panelAdmin.clearItems = function(dataPanel)
{
	dataPanel.find("input.siteField:checked").each(function(){
		crushFTP.UI.checkUnchekInput($(this), false);
	});
}

panelAdmin.bindData = function(userInfo, jsonDeep, panel)
{
	var dataPanel = panel || panelAdmin._panel;
	if(panel)
	{
		panel.removeClass("inheritValSet");
	}
	panelAdmin.clearItems(dataPanel);
	delete panelAdmin.curUserPermissions;
	delete panelAdmin.curUserOtherPermissions;
	if(userInfo.user)
	{
		userManager.data.bindValuesFromJson(dataPanel, userInfo.user, false, panel);
		var dataInheritedFrom = false;
		var curData = userManager.methods.seperateValueAndInheritValue(crushFTP.data.getValueFromJson(userInfo.user, "site"));
		var value = curData.value;
		dataInheritedFrom = curData.inherit || dataInheritedFrom;
		var sitePrefs = value.toLowerCase();
		$("#limitedUserRolesPanel").find("input").removeAttr("checked");
		$("input.siteField").each(function(){
			if(sitePrefs.indexOf($(this).attr("id"))>=0)
			{
				crushFTP.UI.checkUnchekInput($(this), true);
			}
		});
		if(!panel)
		{
			userManager.data.setInheritPropertyOfSection($("div.siteSettings", dataPanel), "site", true);
		}
		userManager.methods.showInheritValueLabel($("div.siteSettings", dataPanel), dataInheritedFrom);
		var curAllowedConfigData = userManager.methods.seperateValueAndInheritValue(crushFTP.data.getValueFromJson(userInfo.user, "allowed_config"));
		var allowedConfigValue = curAllowedConfigData.value;
		if(allowedConfigValue){
			var tmp = allowedConfigValue.split(",");
			tmp.removeByVal("account_expire_advance_days_notify");
			tmp.removeByVal("account_expire_rolling_days");
			tmp.removeByVal("account_expire_delete");
			tmp.removeByVal("expire_password");
			tmp.removeByVal("expire_password_when");
			tmp.removeByVal("password_expire_advance_days_notify");
			allowedConfigValue = tmp.join(",");
		}
		panelAdmin.curUserPermissions = allowedConfigValue;
	}
	userManager.UI.panelsPostbindEvent(dataPanel, panel);
	if (!$(document).data("app_enterprise"))
	{
		$("#site_proxy").attr("disabled", "disabled").parent().parent().addClass("ui-state-disabled");
		$(".enterpriseFeatureTag", panel).show();
	}
	else
	{
		$(".enterpriseFeatureTag", panel).hide();
	}
	$("#connect", panelAdmin._panel).trigger('change');
	$("#user_admin").trigger('change');
};

panelAdmin.bindEvents = function()
{
	userManager.UI.togglePanels(panelAdmin._panel);
	$(".checkboxArea>input[type='checkbox']", panelAdmin._panel).change(function(){
		var curUserData = crushFTP.storage("currentUserInherited");
		if(!$(this).is(":checked"))
		{
			curUserData = {user: crushFTP.storage("currentUsersLowerLevelsData")};
			$(this).closest("fieldset").addClass("inheritSet");
		}
		else
			$(this).closest("fieldset").removeClass("inheritSet");
		if(!$(this).closest("fieldset").hasClass("notInheritable"))
			panelAdmin.bindData(curUserData, false, $(this).closest("fieldset"));
	});

	var limitedUserRoles = $("#limitedUserRoles").addClass('ui-state-disabled');
	var adminUserPermissions = $("#adminUserPermissions").addClass('ui-state-disabled');
	var limitedUserRolesPanel = $("#limitedUserRolesPanel");
	try{
		limitedUserRolesPanel.dialog("destroy");
	}
	catch(ex){}
	limitedUserRolesPanel.find("input").removeAttr("checked");
	$("#connect", panelAdmin._panel).change(function(){
		if(!$("#connect", panelAdmin._panel).is(":checked"))
		{
			limitedUserRoles.removeClass('ui-state-disabled');
			adminUserPermissions.addClass('ui-state-disabled');
			if($("#user_admin", panelAdmin._panel).is(":checked")){
				adminUserPermissions.removeClass('ui-state-disabled');
			}
		}
		else
		{
			limitedUserRoles.addClass('ui-state-disabled');
			limitedUserRolesPanel.find("input").each(function(){
				$(this).removeAttr("checked");
			});
			adminUserPermissions.addClass('ui-state-disabled');
		}
	});

	$("#user_admin", panelAdmin._panel).change(function(){
		if($(this).is(":checked"))
		{
			adminUserPermissions.removeClass('ui-state-disabled');
		}
		else
		{
			adminUserPermissions.addClass('ui-state-disabled');
		}
	});


	limitedUserRolesPanel.dialog({
		title : "Limited Admin Roles: ",
		autoOpen: false,
		width: 800,
		modal: true,
		resizable: false,
		closeOnEscape: true,
		buttons: {
			"OK" : function(){
				if(limitedUserRolesPanel.find("input").not(":checked").length==0){
					jAlert("You can't select all items while setting up permissions", "Error", {
						okButtonText : "OK"
					});
					return false;
				}
				$(this).dialog( "close" );
			}
		},
		open : function(){
			setTimeout(function(){
				$("#user_admin").trigger('change');
        		$(".roleGroup").find("input").trigger("change")
        		setTimeout(function(){
          			$("#limitedUserRolesPanel").find("input[type='checkbox'][rel]:checked").trigger("change");
        		},100);
			}, 100);
		}
	});

	$("#limitedUserRoles", panelAdmin._panel).click(function(event) {
		if($(this).hasClass('ui-state-disabled'))return false;
		limitedUserRolesPanel.dialog("open");
	});

	limitedUserRolesPanel.find("input").change(function(event) {
		if($(this).attr('rel'))
		{
			if($(this).is(":checked"))
			{
				limitedUserRolesPanel.find($(this).attr('rel')).attr('checked', 'checked').attr("disabled", "disabled");
			}
			else
				limitedUserRolesPanel.find($(this).attr('rel')).removeAttr("disabled");

			$(this).removeAttr("disabled");
		}
		if($(this).attr('reverserel'))
		{
			if($(this).is(":checked"))
			{
				limitedUserRolesPanel.find($(this).attr('reverserel')).removeAttr('checked').attr("disabled", "disabled");
			}
			else
				limitedUserRolesPanel.find($(this).attr('reverserel')).removeAttr("disabled");

			$(this).removeAttr("disabled");
		}
		// if($(this).is("#report_run"))
		// {
		// 	if(!$(this).is(":checked"))
		// 		limitedUserRolesPanel.find("#report_edit").removeAttr('checked');
		// }
		// if($(this).is("#report_edit"))
		// {
		// 	if(!$(this).is(":checked"))
		// 		limitedUserRolesPanel.find("#report_run").removeAttr('checked');
		// }
		if($(this).is("#user_admin"))
		{
			if($(this).is(":checked"))
				limitedUserRolesPanel.find("input").not("#user_admin").not("[id^='job']").removeAttr('checked').attr("disabled", "disabled");
			else
				limitedUserRolesPanel.find("input").removeAttr("disabled");
		}
	});

	limitedUserRolesPanel.find('.multicheck, .multicheckAll').find("a").click(function(){
		if($(this).hasClass('all'))
		{
			$(this).closest('div.roleGroup').find('input:not(:disabled)').attr('checked', 'checked').trigger('change');
		}
		else if($(this).hasClass('none'))
			$(this).closest('div.roleGroup').find('input').removeAttr('checked').filter(":not(:disabled)").trigger('change');
		else if($(this).hasClass('everything'))
		{
			limitedUserRolesPanel.find(".roles").find('input').attr('checked', 'checked').trigger('change');
		}
		else
			limitedUserRolesPanel.find(".roles").find('input').removeAttr('checked').trigger('change');
		return false;
	});

	$("#adminUserPermissions", panelAdmin._panel).click(function(event) {
		if($(this).hasClass('ui-state-disabled'))return false;
		panelAdmin.onUserRolesSectionOpen = function(){
			if(panelAdmin.curUserPermissions){
				var items = panelAdmin.curUserPermissions.split(",");
				var otherConfigs = [];
				for (var i = 0; i < items.length; i++) {
					var curItem = $.trim(items[i]);
					if(!crushFTP.UI.checkUnchekInput(panelAdmin.rolesDialog.find("input[key='"+curItem+"']"), true).length)
					{
						otherConfigs.push(curItem);
					}
				}
				if(otherConfigs.length>0){
					panelAdmin.curUserOtherPermissions = otherConfigs;
				}
			}
		}
		panelAdmin.onUserRolesSelection = function(selection){
			panelAdmin.curUserPermissions = selection.join(",");
		}
		panelAdmin.rolesDialog.dialog("open");
	});
};

panelAdmin.getDataXML = function(data)
{
	data = data || {};
	data.site = "";
	panelAdmin._panel.find("input.siteField:checked").each(function(){
		if(typeof $(this).attr("id") != "undefined")
			data.site += "("+$(this).attr("id").toUpperCase()+")";
	});
	return data;
}

panelAdmin.generateSpecialItemsXML = function(name, type)
{
    type = type || "add";
    var xml = "";
    if(name == "SitePrefs")
    {
        if(type == "add")
        {
            if(panelAdmin._panel.find("#sitePrefsCheck").find("input:checked").length>0)
			{
				xml += "\r\n<site>";
				$("input.siteField:checked").each(function(){
					if(typeof $(this).attr("id") != "undefined")
						xml += "(" + $(this).attr("id").toUpperCase() + ")";
				});
				xml += "\r\n</site>";
			}
        }
        else
            xml = "site";
    }
    else if(name == "All"){
    	if(type == "add")
        {
    		return panelAdmin.generateXML();
    	}
    }
    return xml;
}

panelAdmin.generateXML = function()
{
	var xml = "";

	//General items
	panelAdmin._panel.find("td.checkboxArea").not(".specialProperty").find("input:checked").each(function(){
		var formPanel = $(this).closest("td").next();
		xml += "\r\n" + userManager.data.buildXMLToSubmitForm(formPanel);
	});
	if(panelAdmin.curUserPermissions){
		var otherPermissions = panelAdmin.curUserOtherPermissions || [];
		var permissions = panelAdmin.curUserPermissions;
		if(otherPermissions.length>0)
			permissions += "," + otherPermissions.join(",");
		if(permissions.indexOf("account_expire")>=0){
			permissions += ",account_expire_advance_days_notify,account_expire_rolling_days,account_expire_delete"
		}
		else{
			var tmp = permissions.split(",");
			tmp.removeByVal("account_expire_advance_days_notify");
			tmp.removeByVal("account_expire_rolling_days");
			tmp.removeByVal("account_expire_delete");
			permissions = tmp.join(",");
		}
		if(permissions.indexOf("expire_password_days")>=0){
			permissions += ",expire_password,expire_password_when,password_expire_advance_days_notify";
		}
		else{
			var tmp = permissions.split(",");
			tmp.removeByVal("expire_password");
			tmp.removeByVal("expire_password_when");
			tmp.removeByVal("password_expire_advance_days_notify");
			permissions = tmp.join(",");
		}
		xml += "<allowed_config>"+permissions+"</allowed_config>";
	}
	xml += panelAdmin.generateSpecialItemsXML("SitePrefs");
	return xml;
}