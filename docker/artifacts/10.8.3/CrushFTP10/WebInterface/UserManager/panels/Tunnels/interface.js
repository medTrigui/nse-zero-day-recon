/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelTunnels = {};
panelTunnels.localization = {};
/****************************/

// Panel details
var panelName = "Tunnels";

// Localizations
panelTunnels.localization = {
};

// Assign localizations
localizations.panels[panelName] = $.extend(panelTunnels.localization, localizations.panels[panelName]);

// Interface methods
panelTunnels.init = function(){
	applyLocalizations(panelName, localizations.panels);
	window.dataBindEvents.push(panelTunnels.bindData);
	panelTunnels.bindEvents();
}

panelTunnels.clearForm = function(panel)
{
	panel = panel || panelTunnels._panel;
	panel.find("input, select, textarea").each(function(){
		if($(this).attr("type")=="checkbox")
		{
			if($(this).closest("td").is(".checkboxArea"))return;
			crushFTP.UI.checkUnchekInput($(this));
		}
		else
		{
			$(this).val("");
		}
	});
}

panelTunnels.bindData = function(userInfo, jsonDeep, panel)
{
	var dataPanel = panel || panelTunnels._panel;
	panelTunnels.clearForm(dataPanel);
	if(panel)
	{
		panel.removeClass("inheritValSet");
	}
	if(userInfo.user)
	{
		userManager.data.bindValuesFromJson(panelTunnels._panel, userInfo.user, false, panel);
	}

	//Bind tunnels available in system
	var tunnelsInSystem = $("#tunnelsInSystem", panelTunnels._panel).empty();
	userManager.UI.multiOptionControlDataBind(crushFTP.storage("GUIXMLPrefs")
		, "tunnels"
		, tunnelsInSystem
		, function(curItem){
			var id = crushFTP.methods.textEncode(unescape(curItem.id));
			var name = crushFTP.methods.textEncode(unescape(curItem.name));
			return $("<li class='ui-widget-content' id='" + id + "'>" + name + "</li>");
		}
	);

	//Bind selected tunnels
	var tunnelsSelected = $("#tunnelsSelected", panelTunnels._panel).empty();
	userManager.UI.multiOptionControlDataBind(userInfo.user
		, "tunnels"
		, tunnelsSelected
		, function(curItem){
				if(!curItem) return;
				var curData = userManager.methods.seperateValueAndInheritValue(curItem);
				curItem = curData.value;
				var tunnels = curItem.split(",");
				if(tunnels && tunnels.length>0)
				{
					for(var i=0;i<tunnels.length;i++)
					{
						var itemInSystemList = tunnelsInSystem.find("li[id='"+tunnels[i]+"']");
						if(itemInSystemList.length>0)
						{
							var tunnelCopy = itemInSystemList.clone();
							tunnelsSelected.append(tunnelCopy);
							itemInSystemList.hide();
						}
					}
				}
				return false;
			}
		, !panel
		, function(){
			tunnelsInSystem.find("li:hidden").show();
		}
		, true);
	if(!panel)
		userManager.data.setInheritPropertyOfSection(tunnelsSelected, "tunnels", true);
	userManager.UI.panelsPostbindEvent(panelTunnels._panel, panel);
}

panelTunnels.bindEvents = function()
{
	//Toggle sections for this panel
	userManager.UI.togglePanels(panelTunnels._panel);

	$(".checkboxArea>input[type='checkbox']", panelTunnels._panel).change(function(){
		var curUserData = crushFTP.storage("currentUserInherited");
		if(!$(this).is(":checked"))
		{
			curUserData = {user: crushFTP.storage("currentUsersLowerLevelsData")};
			$(this).closest("fieldset").addClass("inheritSet");
		}
		else
			$(this).closest("fieldset").removeClass("inheritSet");
		if(!$(this).closest("fieldset").hasClass("notInheritable"))
			panelTunnels.bindData(curUserData, false, $(this).closest("fieldset"));
	});

	// Tunnels events
	var tunnelsInSystem = $("#tunnelsInSystem", panelTunnels._panel);
	tunnelsInSystem.bind("dblclick", function(evt){
        if(evt.target && $(evt.target).is("li")){
            $("a#addTunnel", panelTunnels._panel).trigger('click');
            return false;
        }
    });
	var tunnelsSelected = $("#tunnelsSelected", panelTunnels._panel);
	tunnelsSelected.bind("dblclick", function(evt){
        if(evt.target && $(evt.target).is("li")){
            $("a#removeTunnel", panelTunnels._panel).trigger('click');
            return false;
        }
    });

	//Add Tunnel
	$("a#addTunnel", panelTunnels._panel).click(function(){
		var selected = tunnelsInSystem.find("li.ui-selected");
		if(selected.length>0)
		{
			// Append selected option to list and hide from default list
			tunnelsSelected.append(selected.clone()
				.removeClass("ui-widget-header")
				.removeClass("ui-selected"));
			selected.hide();
			panelTunnels._panel.trigger("changed", [tunnelsSelected]);
		}
		return false;
	});

	// Remove selected Tunnel
	$("a#removeTunnel", panelTunnels._panel).click(function(){
		// Remove from list and show in default list
		crushFTP.UI.removeItem(tunnelsSelected, function(focused, removed){
			var removedKey = $(removed).attr("id");
			tunnelsInSystem.find("li[id='"+removedKey+"']").show().removeClass("ui-widget-header").removeClass("ui-selected");
			panelTunnels._panel.trigger("changed", [tunnelsSelected]);
		}, true);
		return false;
	});
}

panelTunnels.generateSpecialItemsXML = function(name, type)
{
	type = type || "add";
	if(type == "add")
	 	return panelTunnels.generateXML();
	else
		return "tunnels";
}

panelTunnels.generateXML = function()
{
	var xml = "";
	//Tunnels
	if(panelTunnels._panel.find("#tunnelsCheck").find("input:checked").length>0)
	{
		xml += "\r\n<tunnels>";
		var tunnelsSelected = $("#tunnelsSelected", panelTunnels._panel);
		var tunnels = [];
		tunnelsSelected.find("li").each(function(){
			if(!tunnels.has($(this).attr("id")))
				tunnels.push($(this).attr("id"));
		});
		xml += tunnels.join(",");
		xml += "\r\n</tunnels>";
	}
	return xml;
}