/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelTunnels = {};
panelTunnels.localization = {};
/****************************/

// Panel details
var panelName = "Tunnels";
var _panel = $("#pnl" + panelName);

// Localizations
panelTunnels.localization = {
	headerText : " ",
	pnlDescText : "Tunnels allow for specific access to services on your network ",
	btnAddText : "Add",
	btnCopyText : "Copy",
	btnRemoveText : "Remove",
	lblHttpsTunnelText : "HTTP(S) Tunnel",
	lblSSHPortForwardingText : "SSH Port Forwarding (Tunnel)",
	lblConfigTabText : " Config ",
	lblTunnelNameText : "Tunnel Name:",
	lblAutoStartText : " Auto Start",
	lblUserConfigurableText : "User Configurable",
	lblServerTabText : " Server ",
	lblDestinationHostText : "Destination Host:",
	lblDestinationPortText : "Destination Port:",
	lblClientTabText : " Client ",
	lblLocalClientIPText : "Local Client IP:",
	lblLocalClientPortText : "Local Client Port:",
	lblReverseText : " Reverse?",
	lblTweaksTabText : "Tweaks (advanced settings)",
	lblStableSecondsText : "Stable Seconds:",
	lblChannelRampUpText : "Channel Ramp Up:",
	lblSpeedThresholdText : "Speed Threshold Percentage:",
	lblMinFastSpeedText : "Min Fast Speed:",
	lblMinSlowSpeedText : "Min Slow Speed:",
	lblAckTimeoutText : "Ack Timeout:",
	lblSendBufferText : "Send Buffer (MB):",
	lblConnectBtnText : "Connect Button's Text : &nbsp;&nbsp;&nbsp;",
	lblInChannelsText : "In Channels :&nbsp;&nbsp;&nbsp;",
	lblDisconnectBtnText : "Disconnect Button's Text:",
	lblOutChannelsText : "Out Channels:",
	lblRunAfterConnectingText : " Run after connecting: ",
	lblRunBeforeDisconnectingText : " Run before disconnecting: ",
	btnResetText : "Reset To Default",
	btnCancelText : "Cancel",
	btnOKText : "Save"
};

// Assign localizations
localizations.panels[panelName] = $.extend(panelTunnels.localization, localizations.panels[panelName]);

// Interface methods
panelTunnels.init = function(){
	applyLocalizations(panelName, localizations.panels);
	crushFTP.methods.setPageTitle(panelTunnels.localization.Header, true);
	panelTunnels.bindData();
	panelTunnels.bindEvents();
    setupPrefsReplicationSave(_panel, panelName);
}

panelTunnels.bindData = function()
{
	var prefs = common.data.ServerPrefs();
	bindValuesFromXML(_panel, prefs);
	if(prefs["tunnels"])
	{
		var tunnels = prefs["tunnels"];
		if(tunnels.length>0)
		{
			tunnels = tunnels[0]["tunnels_subitem"];
			if(tunnels && tunnels.length>0)
			{
				var nameList = $("#tunnels", _panel);
				for(var i=0;i<tunnels.length;i++)
				{
					var curItem = tunnels[i];
					if(curItem)
					{
						var name = crushFTP.methods.htmlEncode(crushFTP.data.getTextValueFromXMLNode(curItem.name, ""));
						if(name != "null")
						{
							var newControl = $("<li class='ui-widget-content' name='"+name+"'>"+name+"</li>");
							nameList.append(newControl);
							newControl.data("controlData", curItem);
						}
					}
				}
			}
		}
	}
}

panelTunnels.bindEvents = function()
{
	var tunnels = $("#tunnels", _panel);
	tunnels.selectable({
		selected: function(event, ui) {
			var selected = $(ui.selected);
			selected.parent().find(".ui-widget-header").removeClass("ui-widget-header ui-selected");
			selected.addClass("ui-widget-header ui-selected");
			panelTunnels.bindFormDetails(selected);
			return false;
		}
	});

	$("a#addTunnel", _panel).click(function(){
		crushFTP.UI.addItem($("#tunnels", _panel)
						, $("<li class='ui-widget-content'>New Tunnel</li>")
						, {
							bindIp:[{text:"127.0.0.1"}],
							localPort:[{text:"55555"}],
							channelsOutAuto:[{text:"false"}],
							destPort:[{text:"55580"}],
							chunked:[{text:"true"}],
							run:[{text:"true"}],
							tunnelType:[{text:"HTTP"}],
							runAfterConnect:[{text:""}],
							buttonConnect:[{text:"Connect"}],
							channelsOut:[{text:"1"}],
							id:[{text:crushFTP.methods.generateRandomPassword(4)}],
							runBeforeDisconnect:[{text:""}],
							name:[{text:"New Tunnel"}],
							channelsInAuto:[{text:"false"}],
							buttonDisconnect:[{text:"Disconnect"}],
							channelsIn:[{text:"1"}],
							configurable:[{text:"false"}],
							destIp:[{text:"127.0.0.1"}],
							channelsOutMax:[{text:"1"}],
							channelsInMax:[{text:"1"}],
							reverse:[{text:"false"}],
							ram:[{text:"false"}],
							stableSeconds:[{text:"5"}],
							channelRampUp:[{text:"1"}],
							speedThreshold:[{text:"60"}],
							minFastSpeed:[{text:"100"}],
							minSlowSpeed:[{text:"50"}],
							ackTimeout:[{text:"30"}],
							sendBuffer:[{text:"1"}],
							tunnel_version : [{text:"Tunnel3"}]
						}
						, panelTunnels.bindFormDetails);
		itemsChanged(true);
		return false;
	});

	$("a#copyTunnel", _panel).unbind().click(function(){
		var selected = $("#tunnels", _panel).find("li.ui-selected");
		if(selected.length==0)
			return false;
		var data = $.extend(true, {}, selected.data("controlData"));
		var name = selected.text() + " copy";
		data.name = [{text:name}];
		data.id = [{text:crushFTP.methods.generateRandomPassword(4)}];
		crushFTP.UI.addItem($("#tunnels", _panel)
			, $("<li class='ui-widget-content'>"+name+"</li>")
			, data
			, panelTunnels.bindFormDetails
		);
		itemsChanged(true);
		return false;
	});

	$("a#removeTunnel", _panel).unbind().click(function(){
		crushFTP.UI.removeItem($("#tunnels", _panel), panelTunnels.bindFormDetails);
		itemsChanged(true);
		return false;
	});

	var formDetailsPanel  = $("#formDetailsPanel", _panel);
	formDetailsPanel.find("input, select, textarea").unbind().bind("change", function(){
		var that = $(this);
		var item = tunnels.find("li.ui-selected");
		if(!item || item.length==0)return;
		var data = item.data("controlData");
		if(data)
		{
			if(that.attr("name") == "tunnelType")
			{
				panelTunnels.showHideHTTPOptions();
				data["tunnelType"] = [{text: that.attr("id").replace("tunnelType_","")}];
			}
			else if(that.attr("name") == "runAfterConnect" || that.attr("name") == "runBeforeDisconnect"){
				var curOption = that.find(":selected");
				if(curOption.text().indexOf("Custom")==0){
					var cmd = !that.val() || that.val() == "custom" ? "mstsc.exe;localhost:{localPort};/user:;rdp_user;/password:;rdppassword" : that.val();
					jPrompt("Enter custom command:", cmd, "Custom Command", function(value) {
						if(value){
							curOption.text("Custom:" + value);
							curOption.prop("value", value);
							data[that.attr("id")] = [{text: value}];
							item.data("controlData", data);
						}
					}, false, false, {isTextArea: true, appendAfterInput : '<span class="ui-state-highlight ui-corner-all warning" style="padding:3px;display:block;">";" is the separator instead of a space like it would normally be in a DOS/Shell prompt.</span>'});
				}
				else{
					data[that.attr("id")] = [{text: that.val()}];
					item.data("controlData", data);
				}
				return;
			}
			else
			{
				var isBool = that.attr("type") == "radio" || that.attr("type") == "checkbox";
				data[that.attr("id")] = [{text: isBool ? that.is(":checked").toString() : that.val()}];
				if(that.attr("id") == "name")
				{
					item.text(that.val());
				}
			}
		}
		item.data("controlData", data);
	});

	formDetailsPanel.find("input[type='text'], textarea").unbind("textchange").bind("textchange", function(){
		var item = tunnels.find("li.ui-selected");
		if(!item || item.length==0)return;
		var data = item.data("controlData");
		var elm = $(this);
		if(data)
		{
			if(elm.attr("id") == "channelsInMax" || elm.attr("id") == "channelsOutMax")
			{
				var text = parseInt(elm.val());
				if(text && text>1)
				{
					if(!$(document).data("app_enterprise"))
					{
						jAlert('<div style="text-align:center">To add more In/Out channels for a Tunnel, an Enterprise license is required.<br><br> To get more information on features and pricing, see the following links : <br><br><a href="http://crushftp.com/pricing.html#enterprise" tabIndex="-1" target="_blank">Plans &amp; Pricing</a> | <a href="http://www.crushftp.com/crush6wiki/Wiki.jsp?page=Enterprise%20License%20Enhancements" tabIndex="-1" target="_blank">Enterprise License Enhancements</a></div>', "This is an Enterprise License feature");
						elm.val("1");
						return false;
					}
				}
			}
			var isBool = elm.attr("type") == "radio" || elm.attr("type") == "checkbox";
			data[elm.attr("id")] = [{text: isBool ? elm.is(":checked").toString() : elm.val()}];
			if(elm.attr("id") == "name")
			{
				item.text(elm.val());
			}
		}
		item.data("controlData", data);
	});
}

panelTunnels.showHideHTTPOptions = function()
{
	var actDiv = $(".forHTTPTunnelOnly", _panel);
	var flag = $("#tunnelType_SSH", _panel).is(":checked");
	if(flag)
	{
		actDiv.clearForm().hide();
		actDiv.find("input, select").trigger("change");
	}
	else
	{
		var selected = $("#tunnels", _panel).find("li.ui-widget-header");
		actDiv.clearForm().show();
		if(selected && selected.length>0)
		{
			panelTunnels.bindFormDetails(selected, actDiv);
			actDiv.find("input, select").trigger("change");
		}
	}
}

panelTunnels.bindFormDetails = function(tunnelList, panel)
{
	if(!tunnelList)
	{
		$("#formDetailsPanel", _panel).hide();
		return;
	}
	var controlData = $(tunnelList).data("controlData");
	if(!controlData)
	{
		$("#formDetailsPanel", _panel).hide();
		return;
	}
	var formDetailsPanel = panel || $("#formDetailsPanel", _panel).show();
	if(controlData["runAfterConnect"] && controlData["runAfterConnect"][0] && controlData["runAfterConnect"][0].text){
		var runAfterConnect = controlData["runAfterConnect"][0].text;
		var hasCustomAction = true;
		var elemAfterConnect = $('#runAfterConnect', panel);
		elemAfterConnect.find("option").each(function(){
			if($(this).prop("value") == runAfterConnect)
			{
				hasCustomAction = false;
			}
		});
		var customConnectOption = elemAfterConnect.find("option:last");
		if(hasCustomAction){
			customConnectOption.text("Custom:" + runAfterConnect);
			customConnectOption.prop("value", runAfterConnect);
		}
		else{
			customConnectOption.text("Custom");
			customConnectOption.prop("value", "custom");
		}
	}
	else{
		var elemAfterConnect = $('#runAfterConnect', panel);
		var customConnectOption = elemAfterConnect.find("option:last");
		customConnectOption.text("Custom");
		customConnectOption.prop("value", "custom");
	}
	if(controlData["runBeforeDisconnect"] && controlData["runBeforeDisconnect"][0] && controlData["runBeforeDisconnect"][0].text){
		var runBeforeDisconnect = controlData["runBeforeDisconnect"][0].text;
		var hasDisconnectCustomAction = true;
		var elem = $('#runBeforeDisconnect', panel);
		elem.find("option").each(function(){
			if($(this).prop("value") == runBeforeDisconnect)
			{
				hasDisconnectCustomAction = false;
			}
		});
		var customOption = elem.find("option:last");
		if(hasDisconnectCustomAction){
			customOption.text("Custom:" + runBeforeDisconnect);
			customOption.prop("value", runBeforeDisconnect);
		}
		else{
			customOption.text("Custom");
			customOption.prop("value", "custom");
		}
	}
	else{
		var elem = $('#runBeforeDisconnect', panel);
		var customOption = elem.find("option:last");
		customOption.text("Custom");
		customOption.prop("value", "custom");
	}
	bindValuesFromXML(formDetailsPanel, controlData);
	if(!panel)
	{
		var actDiv = $(".forHTTPTunnelOnly", _panel).show();
		crushFTP.UI.checkUnchekInput($("#tunnelType_" + crushFTP.data.getTextValueFromXMLNode(controlData.tunnelType, ""), _panel), true);
		var flag = $("#tunnelType_SSH", _panel).is(":checked");
		if(flag)
		{
			actDiv.clearForm().hide();
		}
	}
	return;
}

panelTunnels.saveContent = function()
{
	if(placeHolder.data("hasChanged"))
	{
		crushFTP.UI.showIndicator(false, false, "Please wait..");
		var xmlString = [];
		var folderList = $("#Tunnels", _panel).find("li");
		if(folderList.length>0)
		{
			xmlString.push("<tunnels type=\"vector\">");
			folderList.each(function(){
				xmlString.push("<tunnels_subitem type=\"properties\">");
				var controlData = $(this).data("controlData");
				for(var item in controlData)
				{
					if(controlData[item].length)
					{
						if(controlData[item][0].text)
						{
							xmlString.push("<"+item+">"+crushFTP.methods.htmlEncode(controlData[item][0].text)+"</"+item+">");
						}
					}
				}
				xmlString.push("</tunnels_subitem>");
			});
			xmlString.push("</tunnels>");
		}
		else
		{
			xmlString.push("<tunnels type=\"vector\">");
			folderList.each(function(){
				xmlString.push("<tunnels_subitem type=\"properties\">");
				xmlString.push("<name>null</name>");
				xmlString.push("</tunnels_subitem>");
			});
			xmlString.push("</tunnels>");
		}
		var formSubItem = xmlString.join("\n");
		var action = xmlString.length>0 ? "reset" : "remove";
		crushFTP.data.setXMLPrefs("server_settings/tunnels/0"
			, "vector"
			, action
			, formSubItem
			, function(data){
				data = $.xml2json(data, true);
				if(data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK")
				{
					xmlString = [];
					xmlString.push('<server_prefs type="properties">');
					xmlString.push("<tunnel_ram_cache>"+crushFTP.methods.htmlEncode($("#tunnel_ram_cache", _panel).val())+"</tunnel_ram_cache>");
					xmlString.push("<tunnel_minimum_version>"+crushFTP.methods.htmlEncode($("#tunnel_minimum_version", _panel).val())+"</tunnel_minimum_version>");
					xmlString.push("</server_prefs>");
					var formSubItem = xmlString.join("\n");
					var action = xmlString.length>0 ? "reset" : "remove";
					crushFTP.data.setXMLPrefs("server_settings/server_prefs/"
						, "properties"
						, action
						, formSubItem
						, function(data){
							data = $.xml2json(data, true);
							if(data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK")
							{
								common.data.updateLocalPrefs(function(){
									crushFTP.UI.hideIndicator();
									crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
									placeHolder.removeData("hasChanged");
								});
							}
							else
							{
								crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
							}
						}
						, panelTunnels.saveParams
					);
				}
				else
				{
					crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
				}
			}
			, panelTunnels.saveParams
		);
	}
	else
	{
		crushFTP.UI.growl("No changes made", "", false, 3000);
	}
}