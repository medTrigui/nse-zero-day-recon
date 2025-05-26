/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelIPServers = {};
panelIPServers.serverData = {};
panelIPServers.localization = {};
/****************************/

// Panel details
var panelName = "IPServers";

// Localizations
panelIPServers.localization = {
	headerText : " Server items: (FTP/FTPS/SFTP/HTTP &amp; WebDAV/HTTPS &amp; WebDAV) ",
	btnRemoveText : "Remove",
	btnAddText : "Add",
	lblUserConnectionGroupsText : "User Connection Group: ",
	btnRemoveText : "Remove",
	btnAddText : "Add",
	lblGeneralTabText : "General",
	lblAdvancedTabText : "Advanced",
	lblSSHTabText : "SSH",
	lblIPText : "IP:",
	lblPortText : "Port:",
	lblUserConnectionGroupsText : "User Connection Group: ",
	lblServerTypeFTPText : "FTP Access (FTP://)",
	lblFormPassivePortRangeText : " Passive port range:",
	lblFTPAwareRouterText : " FTP Aware Router / Firewall",
	lblIPUsedForPassiveText : " IP used for Passive:",
	lblFTPWelcomeMessageText : " FTP Welcome Message:",
	lblServerTypeHTTPText : " Web Access (HTTP://) (This is also WebDAV.) ",
	lblServerTypeHTTPSText : " Web Access SSL (HTTPS://) (This is also WebDAV.) ",
	lblServerTypeSSLFTPText : " Implicit SSL FTP (FTP://) ",
	lblServerTypeSSHFTPText : " SFTP/SCP (SFTP://) ",
	lblServerTypeServerBeatText : " ServerBeat Virtual IP (ServerBeat://) ",
	lblServerTypePortForwardText : " PortForward IP (PortForward://) ",
	lblServerTypeDMZText : "DMZ (DMZ://) ",
	lblNameText : "Name (Optional):",
	lblFTPOptionsText : "FTP Options:",
	lblFTPOptionRequireEncryptionText : " Require Encryption ",
	lblFTPOptionExplicitSSLText : " Explicit SSLv3 (FTPS) ",
	lblFTPOptionExplicitTLSText : " Explicit TLS (FTPS) ",
	lblFTPOptionRequireSecureDataChannelText : " Require data channel to be secure ",
	lblHTTPOptionsText : "HTTP/HTTPS Options:",
	lblHTTPOptionAllowUsersToUseWebDAVText : " Allow Users To Use WebDAV. ",
	lblHTTPOptionRedirectToHTTPSText : " Redirected to HTTPS:// ",
	lblHTTPOptionNewWebInterfaceText : " New WebInterface ",
	lblHTTPOptionHttpReverseProxyText : "ReverseProxy Path (CrushFTP is behind a proxy):",
	lblHTTPOptionsReverseProxyText : "ReverseProxy Server Configuration:",
	lblHTTPOptionReverseProxyDomainText : "ReverseProxy Domain:",
	lblHTTPOptionReverseProxyUrlText : "ReverseProxy URL:",
	lblHTTPOptionReverseProxyPathText : "ReverseProxy Path:",
	lblTrustHeadersText : "Trust Headers:",
	lblSSLOptionsText : "SSL Options: (Overrides Global Encryption SSL Settings)",
	lblSSLOptionKeyStoreLocationText : "Keystore Location:",
	btnKeyStoreLocationBrowseText : "Browse",
	lblSSLOptionKeyStorePasswordText : "Keystore Password:",
	lblSSLOptionKeyPasswordText : "Key Password:",
	btnKeyStorePasswordTestCertificateText : "Test Certificate",
	lblSSLRequireValidClientCertiText : " Require valid client certificate. ",
	lblPriorityOptionsText : "Priority Options:",
	lblPriorityOptionCommandDelayText : "Command Delay Interval:",
	lblServerHostKeyRSAText : "Server Host Key (RSA):",
	lblSSHRSAEnabledText : " Enabled ",
	lblServerHostKeyDSAText : "Server Host Key (DSA):",
	lblSSHDSAEnabledText : " Enabled ",
	btnBrowseText : "Browse",
	lblServerBeatVirtualIP1Text : "Virtual IP:",
	lblServerBeatVirtualIP2Text : "List of participating server IPs, comma separated:",
	lblServerBeatEthernetText : "Ethernet Adapter OS Name:",
	lblPortForwardIPText : "Port Forward IP:",
	lblSSHSupportedCiphersText : "Supported Ciphers &amp; Preferred Order:",
	lblEnableSSHDebugLoggingText : " Enable debug logging ",
	lblSSHTextEncodingText : "Text Encoding:",
	lblSSHAsyncText : " Use Asynchronous Threading? ",
	lblSSHSessionTimeoutText : "Idle Timeout(seconds):",
	lblSSHRequirePasswordText : " Require Password Authentication? ",
	lblSSHRequirePublickeyText : " Require Public Key Authentication? ",
	btnResetText : "Reset To Default",
	btnCancelText : "Cancel",
	btnOKText : "Save"
};

// Assign localizations
localizations.panels[panelName] = $.extend(panelIPServers.localization, localizations.panels[panelName]);

// Interface methods
var _panel = $("#pnl" + panelName);
var formServerList = $("#serverlist", _panel);

panelIPServers.defaultValue = {
	adapter : [{text : "en0"}],
	enabled : [{text : "true"}],
	allow_webdav : [{text : "true"}],
	busyMessage : [{text : ""}],
	commandDelayInterval : [{text : "0"}],
	connected_users : [{text : "0"}],
	connection_number : [{text : "0"}],
	customKeystore : [{text : ""}],
	customKeystoreCertPass : [{text : ""}],
	customKeystorePass : [{text : ""}],
	display : [{text : ""}],
	explicit_ssl : [{text : "false"}],
	explicit_tls : [{text : "false"}],
	ftp_aware_router : [{text : "false"}],
	ftp_welcome_message : [{text : ""}],
	httpFormat : [{text : "HTML"}],
	httpReverseProxy : [{text : ""}],
	reverseProxyUrl : [{text : ""}],
	reverseProxyDomain : [{text : ""}],
	reverseProxyPath : [{text : "/"}],
	httpTrustHeaderVariables : [{text : ""}],
	https_redirect : [{text : "false"}],
	index1 : [{text : "1"}],
	index2 : [{text : "2"}],
	ip : [{text : "lookup"}],
	linkedServer : [{text : ""}],
	needClientAuth : [{text : "false"}],
	new_http : [{text : "true"}],
	pasv_ports : [{text : "1025-65535"}],
	port : [{text : ""}],
	require_encryption : [{text : "false"}],
	require_secure : [{text : "true"}],
	running : [{text : "true"}],
	serverType : [{text : "FTP"}],
	server_ip : [{text : "auto"}],
	server_item_name : [{text : ""}],
	netmask : [{text : "255.255.255.0"}],
	serverbeatEnabled : [{text : "true"}],
	vip : [{text : ""}],
	vip2 : [{text : ""}],
	dest_ip : [{text : ""}],
	dest_port : [{text : ""}],
	ssh_rsa_key : [{text : "ssh_host_rsa_key"}],
	ssh_dsa_key : [{text : "ssh_host_dsa_key"}],
	ssh_cipher_list : [{text : "aes128-cbc,aes128-ctr,3des-cbc,blowfish-cbc,arcfour128,arcfour"}],
	ssh_text_encoding : [{text : "UTF8"}],
	ssh_session_timeout : [{text : "300"}],
	ssh_rsa_enabled : [{text : "true"}],
	ssh_dsa_enabled : [{text : "false"}],
	ssh_ed25519_enabled : [{text : "false"}],
	ssh_ecdsa_enabled : [{text : "false"}],
	ssh_mac_list : [{text : "hmac-md5,hmac-sha1,hmac-md5-96,hmac-sha1-96,hmac-sha256,hmac-sha2-256,hmac-sha256@ssh.com"}],
	key_exchanges : [{text : "diffie-hellman-group14-sha1, diffie-hellman-group-exchange-sha1, diffie-hellman-group-exchange-sha256, ecdh-sha2-nistp256, ecdh-sha2-nistp384, ecdh-sha2-nistp521"}],
	max_packet_length : [{text : "70000"}],
	min_dh_size : [{text : "1024"}],
	max_dh_size : [{text : ""}],
	priority : [{text : "1"}],
	recaptcha_version : [{text : "1"}],
	max_async_req : [{text : "200"}],
	max_channels : [{text : "5"}],
	proxy_protocol : [{text: "ftp"}],
	proxy_host : [{text: "127.0.0.1"}],
	proxy_port : [{text: "21"}],
	proxy_username : [{text: "anonymous"}],
	proxy_password : [{text: "user@email.com"}],
	proxy_path : [{text: "/"}],
	ssh_transfer_threads : [{text: "10"}],
	ssh_accept_threads : [{text: "10"}],
	ssh_connect_threads : [{text: "10"}],
};

panelIPServers.init = function(){
	$("#customKeystore, #ssh_rsa_key, #ssh_dsa_key, #ssh_ecdsa_key, #ssh_ed25519_key").each(function(){
		$(this).addClass('maskPasswordOnURL urlWithParams').closest('p').find('.serverFilePickButton').removeClass('serverFilePickButton').addClass('serverFilePickWithParamsButton');
	});
	applyLocalizations(panelName, localizations.panels);
	crushFTP.methods.setPageTitle(panelIPServers.localization.Header, true);
	$("#settingsPanel", _panel).block({
		message: null,
		overlayCSS : {
			backgroundColor: '#fff',
			'-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .5,
			cursor: 'normal',
			padding : '2px'
		}
	});
	if(!panelIPServers.bindData())
	{
		panelIPServers.showHideItemsForServerType();
		$("#settingsPanel", _panel).clearForm();
	}
	panelIPServers.pollServerInfo();
	setTimeout(function(){
		placeHolder.removeData("hasChanged");
	}, 500);
}

panelIPServers.showHideItemsForServerType = function()
{
	var ftpOpts = $(".ftpOpts", _panel).show();
	var httpsOpts = $(".httpsOpts", _panel).show();
	var sslOpts = $(".sslOpts", _panel).hide();
	var sftpOpts = $(".sftpOptions", _panel).hide();
	var commonOpts = $('.commonOpts', _panel).hide();
	var dmzOptions = $('.dmzOptions', _panel).hide();
	/* added by carlos: stop the tab from load tab content and open the tour manager */
	$('#dmzTourLink').unbind().bind('click', function(e){
		e.preventDefault();
		showControls(dmzTour, 'r', true);
	});
	$("li.tourTab", _panel).hide();
	var serverType = $("input[name='serverType']:checked", _panel);
	if(serverType && serverType.length >0 )
		serverType = serverType.attr("id").replace("rdb","");

	var onlyFTP = $(".onlyFTP", _panel).hide();
	var item = formServerList.find("li.ui-selected");
	$("li.oauthTab", _panel).hide();
	if(serverType == "SFTP")
	{
		$("li.sshTab", _panel).show();
		sftpOpts.show();
		if(!item || item.length==0)return;
		var data = item.data("controlData");
		var dataAvailable = false;
		if(data)
		{
			$("#IPSSSH", _panel).find("input").each(function(){
				if(typeof data[$(this).attr("id")] != "undefined")
				{
					dataAvailable = true;
					return false;
				}
			});
			if(!dataAvailable)
			{
				data.ssh_rsa_key = [{text : "ssh_host_rsa_key"}];
				data.ssh_dsa_key =  [{text : "ssh_host_dsa_key"}];
				data.ssh_cipher_list =  [{text : "aes128-cbc,aes128-ctr,3des-cbc,blowfish-cbc,arcfour128,arcfour"}];
				data.ssh_text_encoding = [{text : "UTF8"}];
				data.ssh_session_timeout = [{text : "300"}];
				data.ssh_rsa_enabled = [{text : "true"}];
				data.ssh_dsa_enabled = [{text : "false"}];
				data.ssh_ecdsa_enabled = [{text : "false"}];
				data.ssh_ed25519_enabled = [{text : "false"}];
			}


			if(data && typeof data.ssh_transfer_threads === "undefined"){
				data.ssh_transfer_threads = [{text : "10"}];
			}

			if(data && typeof data.ssh_accept_threads === "undefined"){
				data.ssh_accept_threads = [{text : "10"}];
			}

			if(data && typeof data.ssh_connect_threads === "undefined"){
				data.ssh_connect_threads = [{text : "10"}];
			}

			if(data && typeof data.rsa_sha1_signatures === "undefined"){
				data.rsa_sha1_signatures = [{text : "true"}];
				crushFTP.UI.checkUnchekInput($("#rsa_sha1_signatures"), true);
			}

			if(data && typeof data.compression_allowed === "undefined"){
				data.compression_allowed = [{text : "true"}];
				crushFTP.UI.checkUnchekInput($("#compression_allowed"), true);
			}
		}
		item.data("controlData", data);
		var mutData = $.extend(true, {}, data);
		var settingsPanel  = $("#settingsPanel", _panel);
		settingsPanel.find(".ssh-change-warn").each(function(){
			var curItem = $(this);
			curItem.unbind("change.warning").bind("change.warning", function(){
				setTimeout(function(){
					jConfirm("Changing this key may cause all prior clients to stop trusting your server.  If your looking to reference a public key for a user for automated logins, this is done in the User Manager, ssh public keys for the specific username.", "Warning!", function(value){
						if(!value)
						{
							var text = mutData[curItem.attr("id")][0].text;
							if(curItem.is("input[type='checkbox']"))
							{
								crushFTP.UI.checkUnchekInput(curItem, text == "true");
							}
							else
							{
								curItem.val(text).trigger('applymask');
							}
						}
						else
						{
							curItem.unbind("change.warning");
						}
					}, {okButtonText:"Continue", cancelButtonText:"Revert Changes"});
				}, 200);
			});
		});

		settingsPanel.find(".password-change-warn").each(function(){
			var curItem = $(this);
			curItem.unbind("change.warning").bind("change.warning", function(){
				if(curItem.is(":checked")){
					jConfirm("Enabling this blocks \"Keyboard interactive authentication.\"", "Warning!", function(value){
						if(!value)
						{
							var text = mutData[curItem.attr("id")] ? mutData[curItem.attr("id")][0].text : "";
							if(curItem.is("input[type='checkbox']"))
							{
								crushFTP.UI.checkUnchekInput(curItem, text == "true");
							}
							else
							{
								curItem.val(text).trigger('applymask');
							}
						}
						else
						{
							curItem.unbind("change.warning");
						}
					}, {okButtonText:"Continue", cancelButtonText:"Revert Changes"});
				}
			});
		});

		if(!dataAvailable)
		{
			bindValuesFromXML($("#IPSSSH", _panel), data);
		}
	}
	else
	{
		$("li.sshTab", _panel).hide();
		if($("#IPSSSH").is(":visible"))
		{
			$("#settingsPanel").find(".tabs").tabs({active: 0});
		}
	}

	if(crushFTP.methods.getInputValue("rdbFTP", _panel) || crushFTP.methods.getInputValue("rdbFTPS", _panel) || crushFTP.methods.getInputValue("rdbSFTP", _panel))
	{
		$("input[name='serverType']:checked", _panel).closest("p").after(onlyFTP.show());
		if(serverType == "SFTP")
		{
			onlyFTP.find("p").hide();
			onlyFTP.find("#ftp_welcome_message").closest("p").show();
		}
		else
		{
			onlyFTP.find("p").show();
		}
	}

	if(crushFTP.methods.getInputValue("rdbSFTP", _panel))
	{
		$("#welcomeMsgLabelText").text("SFTP Welcome Message:");
	}
	else
	{
		$("#welcomeMsgLabelText").text("FTP Welcome Message:");
	}

	if(serverType == "HTTPS")
	{
		$('.httpsRedirect').hide();
		var data = item.data("controlData");
		if(data && data.https_redirect && data.https_redirect[0].text && data.https_redirect[0].text.toString() == "true"){
			data.https_redirect[0].text = "false";
			item.data("controlData", data);
		}
		$("li.oauthTab", _panel).show();
	}
	else if(serverType == "HTTP")
	{
		$('.httpsRedirect').show();
		$("li.oauthTab", _panel).show();
	}

	if(serverType == "HTTPS" || serverType == "HTTP")
	{
		$("li.captchaTab", _panel).show();
		var data = item.data("controlData");
		if(typeof data.allow_webdav == "undefined")
		{
			data.allow_webdav = [{text : "true"}];
			item.data("controlData", data);
			bindValuesFromXML($("#IPSSSH", _panel), data);
		}
	}
	else
	{
		$("li.captchaTab", _panel).hide();
		if($("#recaptcha_public_key").is(":visible"))
		{
			$("#settingsPanel").find(".tabs").tabs({active: 0});
		}
	}

	if(serverType == "FTP" || serverType == "DMZ" || serverType == "ServerBeat")
	{
		httpsOpts.hide();
	}

	if(serverType == "HTTPS" || serverType == "HTTP" || serverType == "DMZ")
	{
		ftpOpts.hide();
	}

	if(serverType == "SFTP" || serverType == "ServerBeat" || serverType == "SOCKS5")
	{
		httpsOpts.hide();
		ftpOpts.hide();
		sslOpts.hide();
	}
	if(serverType == "FTP" || serverType == "FTPS" || serverType == "HTTPS")
	{
		sslOpts.show();
		var data = item.data("controlData");
		if(typeof data.customKeystore == "undefined" || !data.customKeystore[0].text)
		{
			$(".ssl-blocked", _panel).show().addClass("ssl");
		}
	}

	if(serverType == "SFTP" || serverType == "FTP" || serverType == "FTPS" || serverType == "HTTP" || serverType == "HTTPS")
	{
		commonOpts.show();
	}

	if(serverType == "ServerBeat")
	{
		$("#ip", _panel).trigger("blur");
		$(".upnpOpts", _panel).hide();
		$("li.restrictionTab", _panel).hide();
		$("#settingsPanel").find(".tabs").tabs({active: 0});
		//here
	}
	else
	{
		$(".upnpOpts", _panel).show();
		$("li.restrictionTab", _panel).show();
	}

	if(serverType == "DMZ")
	{
		$("li.advanceTab", _panel).hide();
		$("#settingsPanel").find(".tabs").tabs({active: 0});
		$(".lblNameText", _panel).text("Name :");
		$("#server_item_name", _panel).trigger("blur");
		/*added by carlos */
		$("li.tourTab", _panel).show();
		dmzOptions.show();
	}
	else
	{
		$("li.advanceTab", _panel).show();
		$(".lblNameText", _panel).text("Name (Optional):");
		$("#server_item_name", _panel).trigger("blur");
	}

	if(serverType == "FTPS")
	{
		httpsOpts.hide();
		ftpOpts.hide();
	}
	if(serverType == "TFTP"){
		httpsOpts.hide();
		ftpOpts.hide();
		$(".upnpOpts, .proxyHeaderOpts", _panel).hide();
	}
	if(crushFTP.methods.getInputValue("rdbServerBeat", _panel))
		$("#serverBeatOptions", _panel).show();
	else
		$("#serverBeatOptions", _panel).hide();

	if(crushFTP.methods.getInputValue("rdbTFTP", _panel))
		$("#tftpOptions", _panel).show();
	else
		$("#tftpOptions", _panel).hide();

	if(crushFTP.methods.getInputValue("rdbPortForward", _panel)){
		$("#portForwardOptions, .portForwardOptions", _panel).show();
		ftpOpts.hide();
		httpsOpts.hide();
	}
	else{
		$("#portForwardOptions, .portForwardOptions", _panel).hide();
	}

	if(crushFTP.methods.getInputValue("rdbPortForwardS", _panel)){
		$("#portForwardOptions, .portForwardOptions", _panel).show();
		sslOpts.show();
		ftpOpts.hide();
		httpsOpts.hide();
	}
	else{
		if(!crushFTP.methods.getInputValue("rdbPortForward", _panel))
			$("#portForwardOptions, .portForwardOptions", _panel).hide();
	}

	if(serverType == "SOCKS5")
	{
		$("li.sshTab, li.captchaTab", _panel).hide();
		$("#settingsPanel").find(".tabs").tabs({active: 0});
	}
	setTimeout(function(){
		$("#ip", _panel).trigger("blur");
		panelIPServers.changeServerText();
	}, 100);
}

panelIPServers.bindIPRestrictions = function(){

	var formbannedIPList = $("#bannedIPlist", _panel).empty();
	var item = formServerList.find("li.ui-selected");
	if(!item || item.length==0)return;
	var data = item.data("controlData");
	var dataAvailable = false;
	if(data)
	{
		if(data["ip_restrictions"])
		{
			var bannedIPList = data["ip_restrictions"];
			if(bannedIPList && bannedIPList.length>0)
			{
				bannedIPList = bannedIPList[0]["ip_restrictions_subitem"];
				if(bannedIPList && bannedIPList.length){
					for(var i=0;i<bannedIPList.length;i++)
					{
						var curItem = bannedIPList[i];
						if(curItem)
						{
							var type = crushFTP.data.getTextValueFromXMLNode(curItem.type, "");
							var startip = crushFTP.data.getTextValueFromXMLNode(curItem.start_ip, "");
							var stopip = crushFTP.data.getTextValueFromXMLNode(curItem.stop_ip, "");
							var notes = crushFTP.data.getTextValueFromXMLNode(curItem.notes, "");
							var bannedIP = type + startip + ", " + stopip;
							var newControl = $("<li class='ui-widget-content' bannedIP='"+bannedIP+"'>" + crushFTP.methods.htmlEncode(bannedIP) + " ("+ crushFTP.methods.htmlEncode(notes) +") <span class='delete-control' style='right: 7px;'> x </span> </li>");
							formbannedIPList.append(newControl);
							newControl.data("controlData", curItem);
						}
					}
				}
			}
		}
	}
	var bannedIPlist = common.data.getSubValueFromPrefs("bannedIPlist");
	if (bannedIPlist) {
		var formbannedIPlist = $("#bannedIPlist", _panel);
		var selected = formbannedIPlist.find(".ui-widget-header").index();
		formbannedIPlist.find("li").unbind("dblclick").bind("dblclick", function(){
            formbannedIPlist.find("li").removeClass('ui-selected');
            $(this).addClass('ui-selected');
            $("#editBanRule", _panel).trigger('click');
        });

 		formbannedIPlist.find("li").unbind("click").bind("click", function(){
            formbannedIPlist.find("li").removeClass('ui-selected ui-widget-header');
            $(this).addClass('ui-selected ui-widget-header');
        });

        formbannedIPlist.find(".delete-control").click(function(){
            formbannedIPlist.find("li").removeClass('ui-selected ui-widget-header');
            $(this).closest("li").addClass('ui-selected ui-widget-header');
            $("#removeBanRule").trigger("click");
        });
	}
}

panelIPServers.changeServerText = function()
{
	var item = formServerList.find("li.ui-selected");
	if(!item || item.length==0)return;
	var data = item.data("controlData");
	if(data)
	{
		var serverType = data.serverType[0].text;
		if(serverType.toLowerCase()=="socks5")
			serverType = "SOCKS";
		item.find(".serverInfo").text(serverType + "://" + data.ip[0].text + ":" + data.port[0].text);
	}
}

panelIPServers.bindEvents = function()
{
	var settingsPanel  = $("#settingsPanel", _panel);
	formServerList.unbind().selectableAdvanced({
		select: function(event, ui) {
			var selected = $(ui.selection);
			if(formServerList.hasClass("single"))
			{
				formServerList.find(".ui-selected, .ui-state-focus").removeClass("ui-selected ui-state-active ui-state-focus");
				$(selected[selected.length-1]).addClass("ui-selected ui-state-active");
			}
			panelIPServers.showDetails();
			panelIPServers.showHideItemsForServerType();
			return false;
		},
		remove:function(){
			$("a#removeServerItem").click();
			return false;
		}
	});

	$(".ssl-guide", _panel).sslGuideButton();

	$("input[name='serverType']", _panel).change(function(){
		panelIPServers.showHideItemsForServerType();
	});

	$("#tunneled,#dmz_version", _panel).change(function(){
		if($(this).is(":checked"))
		{
			if($(this).is("#tunneled")){
				crushFTP.UI.checkUnchekInput($("#dmz_version"), false);
				crushFTP.UI.checkUnchekInput($("#dmz_version_5"), false);
			}
			else if($(this).is("#dmz_version")){
				crushFTP.UI.checkUnchekInput($("#tunneled"), false);
				crushFTP.UI.checkUnchekInput($("#dmz_version_5"), false);
			}
			else{
				crushFTP.UI.checkUnchekInput($("#tunneled"), false);
				crushFTP.UI.checkUnchekInput($("#dmz_version"), false);
			}
		}
	})

	$("a#addServerItem").click(function(){
		function serverArray()
		{
			var servers = [];
			$("#linkedServer", _panel).find("option").each(function(){
				servers.push($(this).attr("value") + "|" + $(this).text());
			});
			return servers;
		}
		var port =  21;
		jPrompt("Please enter a port to listen on:", port, "PORT", function(value){
			port = value;
			if(port !== null)
			{
				var group = 0;
				jPrompt("Which server group?", group, "Pick A Server Group", function(value){
					group = value;
					if(group !== null){
						panelIPServers.addServer(port, group);
						// setTimeout(function(){
						// 	panelIPServers.saveContent();
						// }, 200);
					}
				}, serverArray());
				itemsChanged(true);
			}
		});
		return false;
	});

	$("a#removeServerItem").click(function(){
		crushFTP.UI.removeItem($("#serverlist", _panel), function(){
			itemsChanged(true);
			panelIPServers.saveContent();
			// panelIPServers.showDetails();
		}, false, "ui-selected ui-state-active");
		return false;
	});

	$("a#addUserConnection").click(function(evt, params){
		var linkParent = $(this).closest("fieldset").parent();
		var name = params || "";
		var notAllowedCharsInGroupName = " +/\\<>&%#='\"";
		var formServerGroupList = $("#linkedServer, #drpConnectionGroupsOption", _panel);
		jPrompt("Enter a name for this user connection group:", name, "User Connection Group Name", function(value){
			name = value;
			if(name)
				name = $.trim(name);
			if(name)
			{
				if(crushFTP.methods.hasSpecialCharacters(name, notAllowedCharsInGroupName))
				{
					jAlert("You can not use these characters in group name : \"" + notAllowedCharsInGroupName + "\"", "Error", function(){
						$("a#addUserConnection").trigger('click', [name]);
					});
					return false;
				}
				linkParent.block({
					message:  '<div><span style="float: left; margin-right: 0.3em;" class="ui-icon ui-icon-refresh"></span>Saving..</div>',
					css: {
						border: 'none',
						padding: '5px',
						backgroundColor: '#000',
						'-webkit-border-radius': '10px',
						'-moz-border-radius': '10px',
						opacity: .5,
						color: '#fff',
						'text-align':'left'
					}
				});
				crushFTP.data.setXMLPrefs("server_settings/server_groups/" + $("#linkedServer", _panel).find("option").length, "vector", "add", "<server_groups_subitem>"+name+"</server_groups_subitem>", function(data){
					data = $.xml2json(data, true);
					if(data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK")
					{
						formServerGroupList.append("<option value='"+name+"'>"+crushFTP.methods.htmlEncode(name)+"</option>").val(name);
						crushFTP.UI.showIndicator();
						common.data.updateLocalPrefs(function(){
							crushFTP.UI.hideIndicator();
							linkParent.unblock();
							placeHolder.removeData("hasChanged");
							panelIPServers.init();
						});
					}
					else
					{
						crushFTP.UI.growl("Error while saving", "User connection group \"" + crushFTP.methods.htmlEncode(name) + "\" was not added", true);
					}
				});
			}
		});
		return false;
	});

	$("a.overrideDMZSettings").click(function(){
		var that = $(this);
		if(that.parent().hasClass("ssl"))
		{
			that.parent().hide();
			return false;
		}
		jConfirm("File paths should be configured to match the internal server's path so the file will be delivered in memory from the internal server and not stored locally on the DMZ server. Are you sure you want to override?", "Confirm", function(value){
			if(value){
				that.parent().hide();
			}
		});
		return false;
	});

	$("a#removeUserConnection").click(function(){
		var linkParent = $(this).closest("fieldset").parent();
		var selectedItem = $("select.ConnectionListBox", _panel).val();
		var selectedIndex = $("select.ConnectionListBox", _panel).find(":selected").index();
		var formServerGroupList = $("#linkedServer, #drpConnectionGroupsOption", _panel);
		if(selectedItem)
		{
			jConfirm("Are you sure you wish to remove this group?", "Confirm", function(value){
				if(value)
				{
					linkParent.block({
						message:  '<div><span style="float: left; margin-right: 0.3em;" class="ui-icon ui-icon-refresh"></span>Saving..</div>',
						css: {
							border: 'none',
							padding: '5px',
							backgroundColor: '#000',
							'-webkit-border-radius': '10px',
							'-moz-border-radius': '10px',
							opacity: .5,
							color: '#fff',
							'text-align':'left'
						}
					});
					crushFTP.data.setXMLPrefs("server_settings/server_groups/" + selectedIndex, "vector", "remove", "<server_groups_subitem>"+selectedItem+"</server_groups_subitem>", function(data){
						data = $.xml2json(data, true);
						if(data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK")
						{
							crushFTP.UI.showIndicator();
							common.data.updateLocalPrefs(function(){
								crushFTP.UI.hideIndicator();
								linkParent.unblock();
								placeHolder.removeData("hasChanged");
								panelIPServers.init();
							});
						}
						else
						{
							crushFTP.UI.growl("Error while removing", "User connection group \"" + crushFTP.methods.htmlEncode(selectedItem) + "\" was not removed", true);
						}
					});
				}
			});
		}
		else
		{
			crushFTP.UI.growl("Nothing selected", "Please select group from a list and try again", true, 3000);
		}
		return false;
	});

	var sshType = ["ssh_dsa_enabled",
			"ssh_rsa_enabled",
			"ssh_ecdsa_enabled",
			"ssh_ed25519_enabled"];

	function checkSHA(current, checked){
		if(!checked){
			var hasChecked = false;
			sshType.forEach(function(item){
				if(current != item){
					if(!hasChecked)
						hasChecked = settingsPanel.find('#'+item).is(":checked");
				}
			});
			return hasChecked;
		}
		else
			return true;
	}

	settingsPanel.find("input, select, textarea").bind("change", function(){
		var item = formServerList.find("li.ui-selected");
		if(!item || item.length==0 || $(this).hasClass("notFormElem") || $(this).hasClass('maskPasswordOnURL'))return;
		var data = item.data("controlData");
		if(data)
		{
			var elemID = $(this).attr("id");

			if($(this).is(":checked"))
			{
				if($(this).is("#tunneled")){
					crushFTP.UI.checkUnchekInput($("#dmz_version"), false);
					crushFTP.UI.checkUnchekInput($("#dmz_version_5"), false);
					data["dmz_version"] = [{text: "false"}];
					data["dmz_version_5"] = [{text: "false"}];
				}
				else if($(this).is("#dmz_version")){
					crushFTP.UI.checkUnchekInput($("#tunneled"), false);
					crushFTP.UI.checkUnchekInput($("#dmz_version_5"), false);
					data["tunneled"] = [{text: "false"}];
					data["dmz_version_5"] = [{text: "false"}];
				}
				else{
					crushFTP.UI.checkUnchekInput($("#tunneled"), false);
					crushFTP.UI.checkUnchekInput($("#dmz_version"), false);
					data["tunneled"] = [{text: "false"}];
					data["dmz_version"] = [{text: "false"}];
				}
			}

			if($(this).is("#recaptcha_version"))
			{
				var ver = $(this).val();
				if(ver === "3"){
					$(".recaptcha_v3_items").show();
				}
				else{
					$(".recaptcha_v3_items").hide();
				}
			}

			if(elemID.indexOf("rdb") >=0)
			{
				data["serverType"] = [{text: elemID.replace("rdb", "")}];
			}
			else
			{
				if(sshType.indexOf(elemID)>=0)
				{
					if(!checkSHA(elemID, $(this).is(":checked"))){
						crushFTP.UI.checkUnchekInput($("#"+elemID), true);
						crushFTP.UI.growl("Error", "You should have at least one SFTP type enabled", true, 3000);
					}
				}
				var isBool = $(this).attr("type") == "radio" || $(this).attr("type") == "checkbox";
				data[elemID] = [{text: isBool ? $(this).is(":checked").toString() : $(this).val()}];
			}
		}
		item.data("controlData", data);
	});

	settingsPanel.find("input[type='text'], textarea").bind("textchange", function(){
		var item = formServerList.find("li.ui-selected");
		if(!item || item.length==0 || $(this).hasClass("notFormElem") || $(this).hasClass('maskPasswordOnURL'))return;
		var hasError = false;
		var msgs = [];
		$(this).parent().find(".validateError").remove();
		var serverType = $("input[name='serverType']:checked", _panel);
		if(serverType && serverType.length >0 )
			serverType = serverType.attr("id").replace("rdb","");
		if($(this).is("#ip"))
		{
			var ip = $(this).val();
			if(!ip || ip.length == 0 || !crushFTP.methods.isValidAnyIPAddress(ip, ["lookup"], true))
			{
				if(serverType != "DMZ" && serverType != "ServerBeat")
				{
					msgs.push("Enter valid IP address");
					hasError = true;
				}
			}
			if(serverType == "ServerBeat")
			{
				if(ip.toLowerCase() == "lookup")
				{
					msgs.push("Enter valid IP address (lookup is not valid for ServerBeat)");
					hasError = true;
				}
			}
			setTimeout(function(){
				panelIPServers.changeServerText();
			}, 100);
		}
		else if($(this).is("#port"))
		{
			var port = $(this).val();
			if(!port || port.length == 0 || !crushFTP.methods.isNumeric(port, true))
			{
				msgs.push("Port should be numeric value");
				hasError = true;
			}
			setTimeout(function(){
				panelIPServers.changeServerText();
			}, 100);
		}
		else if($(this).is("#pasv_ports"))
		{
			var portRange = $(this).val();
			if(!portRange || portRange.length == 0 || (portRange.split("-").length!=2 || $.trim(portRange.split("-")[0]).length==0 || $.trim(portRange.split("-")[1]).length==0 || !crushFTP.methods.isNumeric($.trim(portRange.split("-")[0]), true) || !crushFTP.methods.isNumeric($.trim(portRange.split("-")[1]), true)))
			{
				msgs.push("Please enter port range. Eg. 2000-2100");
				hasError = true;
			}
			setTimeout(function(){
				panelIPServers.changeServerText();
			}, 100);
		}
		else if($(this).is("#server_item_name"))
		{
			if(serverType == "DMZ")
			{
				var serverName = $(this).val();
				if(!serverName || serverName.length == 0)
				{
					msgs.push("Server name is required");
					hasError = true;
				}
			}
		}
		else if($(this).is("#ssh_cipher_list") || $(this).is("#ssh_session_timeout") || $(this).is("#ssh_text_encoding"))
		{
			if(serverType == "SFTP")
			{
				var val = $.trim($(this).val());
				if(!val || val.length == 0)
				{
					msgs.push("This field is required");
					hasError = true;
				}
			}
		}
		else if($(this).is("#commandDelayInterval"))
		{
			if(serverType == "SFTP" || serverType == "FTP" || serverType == "FTPS" || serverType == "HTTP" || serverType == "HTTPS")
			{
				var val = $.trim($(this).val());
				if(!val || val.length == 0)
				{
					msgs.push("This field is required");
					hasError = true;
				}
				else if(!crushFTP.methods.isNumeric(val, true)){
					msgs.push("Interval should be numeric value");
					hasError = true;
				}
			}
		}
		else if($(this).is("#cognito_domain_prefix"))
		{
			if(serverType == "HTTP" || serverType == "HTTPS")
			{
				var val = $.trim($(this).val());
				if(!val || val.length == 0)
				{
					msgs.push("This field is required");
					hasError = true;
				}
				else{
					var invalidChars = "\\/*_!";
					if(crushFTP.methods.hasSpecialCharacters(val, invalidChars))
					{
						msgs.push("Invalid characters: \"" + invalidChars + "\"");
						hasError = true;
					}
				}
			}
		}
		if(msgs.length>0)
		{
			$(this).after("<span class='ui-state-error validateError ui-corner-all' style='margin-left:10px;padding:2px 10px;'>"+ msgs.join("") +"</span>");
			$("#serverlist").closest("td").block({
				message : ""
			});
			$("#saveContent").hide();
		}
		if(!hasError)
		{
			if(settingsPanel.find('.groupConnection').length==0)
			{
				$("#serverlist").closest("td").unblock();
				$("#saveContent").show();
			}

			var data = item.data("controlData");
			if(data)
			{
				var elemID = $(this).attr("id");
				if(elemID.indexOf("rdb") >=0)
				{
					data["serverType"] = [{text: elemID.replace("rdb", "")}];
				}
				else
				{
					var isBool = $(this).attr("type") == "radio" || $(this).attr("type") == "checkbox";
					data[elemID] = [{text: isBool ? $(this).is(":checked").toString() : $(this).val()}];
				}
			}
			item.data("controlData", data);
		}
	});

	settingsPanel.find('#linkedServer').bind("change", function(){
		var msgs = [];
		$(this).parent().find(".validateError").remove();
		if($(this).val()==="")
		{
			msgs.push("Please select User Connection Group");
		}
		if(msgs.length>0)
		{
			$(this).after("<span class='ui-state-error validateError groupConnection ui-corner-all' style='margin-left:10px;padding:2px 10px;'>"+ msgs.join("") +"</span>");
			$("#serverlist").closest("td").block({
				message : ""
			});
			$("#saveContent").hide();
		}
		else if(settingsPanel.find('.groupConnection').length==0)
		{
			$("#serverlist").closest("td").unblock();
			$("#saveContent").show();
		}
	});

	settingsPanel.find("#proxy_header, #proxy_header_v2").bind("change", function(){
		var isv1 = $(this).is("#proxy_header");
		var v1 = settingsPanel.find("#proxy_header");
		var v2 = settingsPanel.find("#proxy_header_v2");
		if($(this).is(":checked")){
			if(isv1){
				crushFTP.UI.checkUnchekInput(v2);
				v2.trigger('change');
			}
			else{
				crushFTP.UI.checkUnchekInput(v1);
				v1.trigger('change');
			}
		}
	});

	settingsPanel.find("#ip, #port, #server_item_name").bind("blur", function(){
		var msgs = [];
		$(this).parent().find(".validateError").remove();
		var serverType = $("input[name='serverType']:checked", _panel);
		if(serverType && serverType.length >0 )
			serverType = serverType.attr("id").replace("rdb","");
		if($(this).is("#ip"))
		{
			var ip = $(this).val();
			var hasError;
			if(!ip || ip.length == 0 || !crushFTP.methods.isValidAnyIPAddress(ip, ["lookup"], true))
			{
				if(serverType != "DMZ" && serverType != "ServerBeat")
				{
					msgs.push("Enter valid IP address");
					hasError = true;
				}
			}
			if(serverType == "ServerBeat")
			{
				if(ip.toLowerCase() == "lookup")
				{
					msgs.push("Enter valid IP address. (lookup is not valid for ServerBeat)");
				}
			}
			if(serverType == "DMZ" && hasError && crushFTP.methods.isValidDomain(ip)){
				msgs.pop();
			}
		}
		else if($(this).is("#port"))
		{
			var port = $(this).val();
			if(!port || port.length == 0 || !crushFTP.methods.isNumeric(port, true))
			{
				msgs.push("Port should be numeric value");
			}
		}
		else if($(this).is("#server_item_name"))
		{
			if(serverType == "DMZ")
			{
				var serverName = $(this).val();
				if(!serverName || serverName.length == 0)
				{
					msgs.push("Server name is required");
				}
			}
		}
		if(msgs.length>0)
		{
			$(this).after("<span class='ui-state-error validateError ui-corner-all' style='margin-left:10px;padding:2px 10px;'>"+ msgs.join("") +"</span>");
			$("#serverlist").closest("td").block({
				message : ""
			});
			$("#saveContent").hide();
		}
		else if(settingsPanel.find('.groupConnection').length==0)
		{
			$("#serverlist").closest("td").unblock();
			$("#saveContent").show();
		}
	});

	$("a.serverFilePickButton", _panel).each(function(){
		$(this).unbind("click").click(function(){
			var curElem = $(this);
            var rel = curElem.attr("rel");
            var pickingFor = curElem.parent().parent().parent().find("label[for='"+rel+"']").text() || "";
            pickingFor = $.trim($.trim(pickingFor).replace(":", ""));
			curElem.crushFtpLocalFileBrowserPopup({
				type : curElem.attr("PickType") || 'file',
				pickingFor: pickingFor,
				existingVal : $("#" + curElem.attr("rel"), _panel).val(),
				callback : function(selectedPath){
					$("#" + curElem.attr("rel"), _panel).val(selectedPath).trigger("change");
				}
			});
			return false;
		});
	});

	$("a.serverFilePickWithParamsButton", _panel).each(function(){
		$(this).unbind("click").click(function(){
			var curElem = $(this);
            var rel = curElem.attr("rel");
            var pickingFor = curElem.parent().parent().parent().find("label[for='"+rel+"']").text() || "";
            pickingFor = $.trim($.trim(pickingFor).replace(":", ""));
			var refElem = $("#" + rel, _panel);
			var labelName = refElem.val() || "";
			var advancedBrowse = true;
			var existingData = refElem.data("urlParams") || {};
			var curPath = refElem.val();
			if(refElem.hasClass('maskPasswordOnURL')){
				curPath = refElem.data("url") || refElem.val();
			}
			// curPath = getFullURLWithParams(curPath, existingData);
			var note = false;
			if(labelName.length>0)
			{
				var text = labelName;
				try{
					var url = URI(text);
					var pass = url.password();
					if(url && pass)
					{
						var mask = new Array(pass.length+1).join('*');
						url.password(mask);
						text = unescape(url.toString());
					}
				}catch(ex){}
				note = "Current selected directory : " + text;
			}
			if(!existingData.timeout || typeof existingData.timeout == "undefined")
            {
                existingData.timeout = "20000";
            }
            if(!existingData.write_timeout || typeof existingData.write_timeout == "undefined")
            {
                existingData.write_timeout = "20000";
            }
            if(!existingData.read_timeout || typeof existingData.read_timeout == "undefined")
            {
                existingData.read_timeout = "20000";
            }
            delete existingData.path;
            if(curPath){
            	existingData.url = existingData[refElem.attr("id")] = getURLWithoutParams(curPath);
            }
			curElem.crushFtpLocalFileBrowserPopup({
				type : curElem.attr("PickType") || 'dir',
				file_mode : advancedBrowse ? "server" : curElem.attr("FileMode") || 'server',
				pickingFor: pickingFor,
				note : note,
				existingData : $.extend(true, {}, existingData) || {},
				urlWithParams: true,
				// isServerBrowse : true,
				existingVal : "/",
				allowRootSelection : advancedBrowse,
				isFTPBrowse : advancedBrowse,
				callback : function(selectedPath){
					$("#" + curElem.attr("rel"), _panel).val(decodeURIComponent(selectedPath)).removeData("urlParams").trigger('applymask');;
				}
			});
			return false;
		});
	});

	_panel.find(".maskPasswordOnURL").each(function(){
		$(this).unbind("focus.form").bind("focus.form", function(){
			if($(this).data("originalURL"))
				$(this).val($(this).data("originalURL"));
        }).unbind("blur.form").bind("blur.form", function(){
			$(this).trigger("applymask");
        }).unbind("applymask").bind("applymask", function(){
			var item = formServerList.find("li.ui-selected");
        	var elem = $(this);
        	var value = $(this).val();
            var url = value;
            try{
                url = URI(value);
            }catch(ex){
                url = URI(encodeURI(value));
            }
            var urlParams = getParamsFromURL(value) || {};
            if(elem.hasClass('urlWithParams') && Object.keys(urlParams.params).length != 0){
            	elem.data("urlParams", urlParams.params);
            	url.port(urlParams.port || "");
            }
            var data = item.data("controlData");
			if(data)
			{
				var elemID = elem.attr("id");
				var val = value ? [{text: decodeURIComponent(getFullURLWithParams(value, elem.data("urlParams")) || {text: ""})}] : [{text: ""}];
				data[elemID] = val;
				item.data("controlData", data);
			}
			if(elem.hasClass('urlWithParams'))
            	elem.data("realURL", getFullURLWithParams(value, elem.data("urlParams") || {}));
            if(url && elem.val().substr(8, 1) != ":")
            {
                var pass = decodeURIComponent(url.password());
                var mask = false;
                var existingPass = elem.data("password");
                if(pass != existingPass)
                {
                    if(existingPass)
                    {
                        mask = new Array(existingPass.length+1).join('*');
                    }
                    if(existingPass && pass == mask)
                        pass = existingPass;
                    else
                        mask = new Array(pass.length+1).join('*');
                    if(pass)
                    {
                        elem.data("password", pass);
                        elem.data("url", value);
                        url.password(mask);
                        var _val = url.toString();
                        elem.val(decodeURIComponent(_val));
                    }
                }
                else
                {
                    pass = existingPass;
                    mask = new Array(pass.length+1).join('*');
                    url.password(mask);
                    var _val = url.toString();
                    elem.val(decodeURIComponent(_val));
                    elem.data("url", value);
                }
                url.password(pass);
                var _val = url.toString();
                if(value.indexOf("////")==0){
                	_val = "//" + _val;
                }
                elem.data("originalURL", decodeURIComponent(_val));
            }
            else
            {
            	elem.data("url", value);
            }
        });
	});
	var sslDetailsPanel = $('#sslDetailsPanelp', _panel);
	var sslDetailsDialog = sslDetailsPanel.dialog({
		autoOpen: false,
		height: 'auto',
		width: '1200',
		modal: true,
		resizable: true,
		title: "Certificate Details",
		closeOnEscape: false,
		open: function(){
		},
		close: function(){
		},
		buttons: {
			"OK": function() {
				$(this).dialog( "close" );
			}
		},
		beforeClose : function(){
			return true;
		}
	});

	$("a#testCertificate", _panel).click(function(){
		if($(this).attr("disabled"))return false;
		var customKeystore = $("#customKeystore", _panel);
		var obj = {
			command : "testKeystore",
			keystorePath : encodeURIComponent(customKeystore.hasClass('urlWithParams') ? decodeURIComponent(customKeystore.data("realURL")) : crushFTP.methods.htmlEncode(customKeystore.val())).replace(/\+/g, "%2B"),
			keystorePass : crushFTP.methods.htmlEncode($("#customKeystorePass", _panel).val()),
			keyPass : crushFTP.methods.htmlEncode($("#customKeystoreCertPass", _panel).val())
		};
		$("a#testCertificate", _panel).block({
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

		crushFTP.data.serverRequest(obj, function(msg){
			$("a#testCertificate", _panel).unblock().removeAttr("disabled");

            var responseText = msg;
            var aliases = sslDetailsPanel.find("#aliasesp").empty();
            var count = 0;
            var txt = $(responseText).find("response").text();
            var SSL_subitem = $(responseText).find("SSL_subitem");
            if ((txt && txt.indexOf("Error") == 0) || SSL_subitem.length === 0) {
                crushFTP.UI.growl("Error", DOMPurify.sanitize(unescape(txt)), true);
                sslDetailsPanel.hide();
                return false;
            }
            else{
            	jAlert("" + DOMPurify.sanitize($(responseText).find("testResult").text()), "Message", function(){
				}, {
					appendAfterInput : '<br><br><div style="position: absolute;right: 20px;margin-top: 12px;"><a id="testReultPopupBtn" href="javascript:void(0);" class="button"><span style="display:inline-block;margin:0px 3px 0px -7px;float:left;" class="pointer ui-icon ui-icon-search"></span>Show Details</a></div>'
				});
				$("#testReultPopupBtn").click(function(){
					detailsPopup();
					$(this).closest("#popup_content").find("#popup_ok").click();
					return false;
				});
				function detailsPopup(){
					SSL_subitem.each(function() {
		                var aliasName = $(this).find("alias").text();
		                var isPrivate = $(this).find("private").text() == "true" ? " :: <strong> Private </strong>" : "";
		                var expires = $(this).find("expires").text();
		                try {
		                    expires = new Date(parseInt(expires));
		                    expires = expires.format("mm/dd/yyyy hh:nn:ss a/p");
		                } catch (ex) {}
		                var newControl = $("<li class='ui-widget-content'><span class='name'>" + crushFTP.methods.htmlEncode(aliasName) + "</span> " + isPrivate + " || Expires: " + crushFTP.methods.htmlEncode(expires) + "</li>");
		                aliases.append(newControl);
		                newControl.data("controlData", $(this));
		            });

		            var keyDetails = $("#keyDetailsp", sslDetailsPanel).hide();

		            function showDetails() {
		                var selected = aliases.find(".ui-selected:first");
		                aliases.find(".ui-selected").removeClass('ui-state-focus ui-selected ui-state-active ui-state-highlight');
		                selected.addClass('ui-state-focus ui-selected ui-state-active');
		                if (selected && selected.length > 0) {
		                    var data = selected.data("controlData");
		                    keyDetails.show().empty().append("<ul class='certi-details'></ul>");
		                    data.find("*").each(function() {
		                        if ($(this)[0].tagName.toLowerCase() == "expires") {
		                            var expires = $(this).text();
		                            try {
		                                expires = new Date(parseInt(expires));
		                                expires = expires.format("mm/dd/yyyy hh:nn:ss a/p");
		                            } catch (ex) {}
		                            keyDetails.find("ul").append('<li><span class="label">' + crushFTP.methods.htmlEncode($(this)[0].tagName) + '</span><span class="value">' + crushFTP.methods.htmlEncode(expires) + '</span></li>');
		                        } else
		                            keyDetails.find("ul").append('<li><span class="label">' + crushFTP.methods.htmlEncode($(this)[0].tagName) + '</span><span class="value">' + crushFTP.methods.htmlEncode($(this).text()) + '</span></li>');
		                    });
		                } else {
		                    keyDetails.hide();
		                }
		            }

		            aliases.selectableAdvanced({
		                select: function(event, ui) {
		                    var selected = $(ui.selection);
		                    selected.parent().find(".ui-state-highlight").removeClass("ui-state-highlight");
		                    showDetails();
		                    return false;
		                },
		                change: function(event, ui) {
		                    var selected = $(ui.selection).filter(":last");
		                    selected.parent().find(".ui-state-highlight").removeClass("ui-state-highlight");
		                    showDetails();
		                    return false;
		                },
		                remove: function(event, ui) {
		                    $("a#removeAlias", _panel).click();
		                    return false;
		                }
		            });

		            aliases.find("li:first").addClass("ui-selected");
		            showDetails();
		            sslDetailsDialog.dialog("open");
				}
            }

		});
		return false;
	});


	function ScrollTo(id){
	     // Scroll
	    $("#"+id).animate({scrollTop: $("#"+id).offset().top},'slow');
	}

	$("a#addNewBanRule", _panel).click(function(evt, controlData, control) {

		var beforeAfter = "", chooseOptId = "", startingipID = "", stoppingipId = "", notes = "";

        if (controlData) {
            chooseOptId = crushFTP.data.getTextValueFromXMLNode(controlData.type, "");
            startingipID = crushFTP.data.getTextValueFromXMLNode(controlData.start_ip, "");
            stoppingipId = crushFTP.data.getTextValueFromXMLNode(controlData.stop_ip, "");
            notes = crushFTP.data.getTextValueFromXMLNode(controlData.notes, "");
        }

		var item = formServerList.find("li.ui-selected");
		if(!item || item.length==0 || $(this).hasClass("notFormElem"))return;
		var data = item.data("controlData");
		if(data)
		{
			var bannedIPList = data["ip_restrictions"] || [];
			if(bannedIPList && bannedIPList.length>0)
			{
				bannedIPList = bannedIPList[0]["ip_restrictions_subitem"];
			}
			else
			{
				data["ip_restrictions"] = [{ip_restrictions_subitem : []}];
				bannedIPList = data["ip_restrictions"];
				bannedIPList = bannedIPList[0]["ip_restrictions_subitem"];
			}

			$("#WIbannedIPDialog").find("#bannedIPlist").unbind("change").bind("change", function(){});


			$("#WIbannedIPDialog").dialog({
	            resizable: false,
	            modal: true,
	            width: 450,
	            create: function() {
	                $(this).css("maxHeight", 500);
	            },
	            open : function(){
	            	$("#WIbannedIPDialog #selectionId").val(beforeAfter);
	                $("#WIbannedIPDialog #chooseoptId").val(chooseOptId);
					$("#WIbannedIPDialog #startingIP").val(startingipID);
	        		$("#WIbannedIPDialog #stoppingIp").val(stoppingipId);
	        		$("#WIbannedIPDialog #notes").val(notes);

	        		if (controlData) {
	        			$("#WIbannedIPDialog").find('#before_after_Id').hide();
	        		}
	        		else
	        		{
						$("#WIbannedIPDialog").find('#before_after_Id').show();
	        		}
	            },
	            buttons: {
	                OK: function() {
	                	beforeAfter = $.trim($("#WIbannedIPDialog #selectionId").val());
	                	chooseOptId = $.trim($("#WIbannedIPDialog #chooseoptId").val());
	                	startingipID = $.trim($("#WIbannedIPDialog #startingIP").val());
	                	stoppingipId = $.trim($("#WIbannedIPDialog #stoppingIp").val());
	                	notes = $.trim($("#WIbannedIPDialog #notes").val());

	                    if(!startingipID)
	                    {
	                        alert("Please enter starting IP")
	                        $("#WIbannedIPDialog").find("#startingIP").focus();
	                        return false;
	                    }

	                    if(!crushFTP.methods.isValidIP(startingipID))
	                    {
	                    	alert("Invalid starting IP - Address!!")
	                        $("#WIbannedIPDialog").find("#startingIP").focus();
	                        return false;
	                    }
	                    if(!stoppingipId)
	                    {
	                        alert("Please enter stopping IP")
	                        $("#WIbannedIPDialog").find("#stoppingIp").focus();
	                        return false;
	                    }

	                    if(!crushFTP.methods.isValidIP(stoppingipId))
	                    {
	                    	alert("Invalid stopping IP - Address!!")
	                        $("#WIbannedIPDialog").find("#startingIP").focus();
	                        return false;
	                    }

	                    if (!crushFTP.methods.isMatchingIPRange(startingipID, stoppingipId)) {
	                        var that = $(this);
	                        jConfirm("IP range mismatches, maybe its a typo. Ignore if it's intended.", "Warning", function(val){
	                            if(val){
	                                buildControl();
	                                that.dialog("close");
	                            }
	                        }, {
	                            okButtonText: "Ignore",
	                            cancelButtonText: "Cancel"
	                        });
	                        return false;
	                    }

						function buildControl() {
							var formbannedIPList = $("#bannedIPlist", _panel);
							var bannedIP = chooseOptId + startingipID + ", " + stoppingipId + " ("+ crushFTP.methods.htmlEncode(notes) +")";

							var newControl = $("<li class='ui-widget-content' bannedIP='"+bannedIP+"'>" + bannedIP + "<span class='delete-control' style='right: 7px;'> x </span> </li>");

		                    var dataObj = {
								start_ip:[{text:startingipID}],
								type:[{text:chooseOptId}],
								stop_ip:[{text:stoppingipId}],
								notes:[{text:notes}]
							};
							newControl.data("controlData", dataObj);

							bannedIPList = bannedIPList || [];
							if(beforeAfter == "After")
							{
								bannedIPList.push(dataObj);
							}
							else
							{
								bannedIPList.unshift(dataObj);
							}
							if (control) {
		                        control.replaceWith(newControl);
		                    } else {
			                    if(beforeAfter == "After")
								{
									formbannedIPList.append(newControl);
									ScrollTo("bannedIPlist");
								}
								else
								{
									formbannedIPList.prepend(newControl);
								}
		                    }

		                    if (newControl) {

										newControl.unbind("dblclick").bind("dblclick", function(){
							            newControl.removeClass('ui-selected');
							            newControl.addClass('ui-selected');
							            $("#editBanRule", _panel).trigger('click');
							        });


							 		newControl.unbind("click").bind("click", function(){
							            newControl.removeClass('ui-selected ui-widget-header');

							            newControl.parent().find(".ui-widget-header").removeClass("ui-widget-header").removeClass("ui-selected");
							            newControl.addClass('ui-selected ui-widget-header');

							        });

					    	        newControl.find(".delete-control").click(function(){
						            newControl.find("li").removeClass('ui-selected ui-widget-header');
            						$("#removeBanRule").trigger("click");
        							});

							        newControl.click();
		                    }

							bannedIPList = [];
                            formbannedIPList.find("li").each(function(){
                                bannedIPList.push($(this).data("controlData"));
                            });
                            data["ip_restrictions"] = [{ip_restrictions_subitem : bannedIPList}];
                            item.data("controlData", data);

						itemsChanged(true);
						}

	                buildControl();
	                $(this).dialog("close");
	                },
	                Cancel: function() {
	                    $(this).dialog("close");
	                }
	            }
	        });
		}
		return false;
	});

	$("a#removeBanRule", _panel).click(function(){
		var item = formServerList.find("li.ui-selected");
		if(!item || item.length==0 || $(this).hasClass("notFormElem"))return;
		var data = item.data("controlData");
		if(data)
		{
			var bannedIPList = data["ip_restrictions"];
			if(bannedIPList && bannedIPList.length>0)
			{
				bannedIPList = bannedIPList[0]["ip_restrictions_subitem"];
			}
			else
			{
				data["ip_restrictions"] = [{ip_restrictions_subitem : []}];
				bannedIPList = data["ip_restrictions"];
				bannedIPList = bannedIPList[0]["ip_restrictions_subitem"];
			}
			var formbannedIPList = $("#bannedIPlist", _panel);
			if(formbannedIPList.find("li").length==1 && formbannedIPList.find("li").attr("bannedip")=="A0.0.0.0, 255.255.255.255")
			{
				crushFTP.UI.growl("Error", "Removing 0.0.0.0, 255.255.255.255 will disable access to the server completely.", true, 3000);
			}
			else
			{
				crushFTP.UI.removeItem(formbannedIPList, function(){
					if(formbannedIPList.find("li").length==0)
					{
						var newControl = $("<li class='ui-widget-content' bannedIP='A0.0.0.0, 255.255.255.255'>A0.0.0.0, 255.255.255.255<span class='delete-control' style='right: 7px;'> x </span> </li>");
						var dataObj = {
							start_ip:[{text:"0.0.0.0"}],
							type:[{text:"A"}],
							stop_ip:[{text:"255.255.255.255"}]
						};
						newControl.data("controlData", dataObj);
						bannedIPList.push(dataObj);
						formbannedIPList.append(newControl);
						if(newControl)
						{
			  				newControl.unbind("dblclick").bind("dblclick", function(){
                                newControl.removeClass('ui-selected');
                                newControl.addClass('ui-selected');
                                $("#editBanRule", _panel).trigger('click');
                            });
                            newControl.unbind("click").bind("click", function(){
                                newControl.removeClass('ui-selected ui-widget-header');
                                newControl.parent().find(".ui-widget-header").removeClass("ui-widget-header").removeClass("ui-selected");
                                newControl.addClass('ui-selected ui-widget-header');
                            });
                            newControl.find(".delete-control").click(function(){
                            newControl.find("li").removeClass('ui-selected ui-widget-header');
                                $("#removeBanRule").trigger("click");
                            });
                            newControl.click();
						}
						crushFTP.UI.growl("Warning", "Removing all items in the list will disable access to the server completely. A0.0.0.0, 255.255.255.255 is added by default when list is empty.", false, 5000);
					}
					formbannedIPList.find(".ui-widget-header").removeClass("ui-widget-header");
					bannedIPList = [];
					formbannedIPList.find("li").each(function(){
						bannedIPList.push($(this).data("controlData"));
					});
					data["ip_restrictions"] = [{ip_restrictions_subitem : bannedIPList}];
					item.data("controlData", data);
				});
			}
			try{
                formbannedIPlist.selectableAdvanced("refresh");
            }catch(ex){}
			itemsChanged(true);
		}
		return false;
	});


	$("a#editBanRule", _panel).click(function(evt, control) {
	        var formbannedIPlist = $("#bannedIPlist", _panel);
	        var selected = formbannedIPlist.find("li.ui-selected");
	        if (selected && selected.length > 0) {
	            $("#addNewBanRule", _panel).trigger("click", [selected.data("controlData"), selected]);
	        }
	        return false;
	});


	$("a#editBanRule_OLD", _panel).click(function(evt, control){
		var item = formServerList.find("li.ui-selected");
		if(!item || item.length==0 || $(this).hasClass("notFormElem"))return;
		var data = item.data("controlData");
		if(data)
		{

			var bannedIPList = data["ip_restrictions"];
			if(bannedIPList && bannedIPList.length>0)
			{
				bannedIPList = bannedIPList[0]["ip_restrictions_subitem"];
			}
			else
			{
				data["ip_restrictions"] = [{ip_restrictions_subitem : []}];
				bannedIPList = data["ip_restrictions"];
				bannedIPList = bannedIPList[0]["ip_restrictions_subitem"];
			}
			var formbannedIPList = $("#bannedIPlist", _panel);
			var selected = formbannedIPList.find("li.ui-selected:last");
			if(selected && selected.length > 0)
			{
				selected.parent().find(".ui-state-highlight").removeClass("ui-state-highlight");
				selected.addClass("ui-state-highlight");
				var controlData = selected.data("controlData");
				if(!controlData)return;
				var allowDeny = crushFTP.data.getTextValueFromXMLNode(controlData.type, "");
				function allowDenyEntry()
				{
					jPrompt("Choose one:", allowDeny, "CrushFTP IPs", function(value){
						allowDeny = value;
						if(allowDeny)
						{
							var startIP = crushFTP.data.getTextValueFromXMLNode(controlData.start_ip, "");
							function startIPEntry()
							{
								jPrompt("Please enter a starting IP:", startIP, "CrushFTP IPs", function(value){
									startIP = value;
									if(value)
									{
										if(!crushFTP.methods.isValidIP(startIP))
										{
											jAlert("Invalid starting IP - Address!!", "Message", function(){
											startIPEntry();
											});
										}
										else
										{
											var stopIP = crushFTP.data.getTextValueFromXMLNode(controlData.stop_ip, "");
											function stopIPEntry()
											{
												jPrompt("Please enter a stopping IP:", stopIP, "CrushFTP IPs", function(value){
													stopIP = value;
													if(!crushFTP.methods.isValidIP(stopIP))
													{
														jAlert("Invalid stopping IP - Address!!", "Message", function(){
														stopIPEntry();
														});
													}
													else
													{
														var formbannedIPList = $("#bannedIPlist", _panel);
														var bannedIP = allowDeny + startIP + ", " + stopIP;
														var newControl = $("<li class='ui-widget-content' bannedIP='"+bannedIP+"'>"+bannedIP+"</li>");
														selected.replaceWith(newControl);
														newControl.data("controlData", {
															start_ip:[{text:startIP}],
															type:[{text:allowDeny}],
															stop_ip:[{text:stopIP}]
														});
														if(newControl)
														{
															newControl.addClass("ui-widget-content ui-selectable-item");
															try{
                                                                formbannedIPlist.selectableAdvanced("refresh");
                                                            }catch(ex){}
															itemsChanged(true);
														}
														bannedIPList = [];
														formbannedIPList.find("li").each(function(){
															bannedIPList.push($(this).data("controlData"));
														});
														data["ip_restrictions"] = [{ip_restrictions_subitem : bannedIPList}];
														item.data("controlData", data);
													}
												});
											}
											stopIPEntry();
										}
									}
								});
							}
							startIPEntry();
						}
						else if(allowDeny != null)
						{
							allowDenyEntry();
						}
					}, ["A|Allow", "D|Deny", "D|Ban"]);
				}
				allowDenyEntry();
			}
		}
		return false;
	});

	var defaultPopupData = {
		algorithm : "RSA",
		sigalgorithm : "SHA256withRSA",
		validityDays : "365",
		keySize : "2048",
		domainName : "www.domain.com",
		city : "no_city",
		country : "US"
	};
	$("#btnGenerateKeyStore", settingsPanel).click(function(event) {
		$("#generateKeystoreDialog").dialog("open");
		$("#generateKeystoreDialog").find("input, select").each(function(){
			var curVal = defaultPopupData[$(this).attr("id").replace("keystoreDialog_","")] || "";
			$(this).val(curVal);
			if($(this).is("#keystoreDialog_domainName"))
			{
				var that = $(this);
				setTimeout(function(){
					that.trigger('textchange');
				}, 100);
			}
			$(".validationErrorMessage", "#generateKeystoreDialog").remove();
		});
		window.afterKeySSLGeneration = function(data){
			$("#customKeystore", _panel).val(data.keystore_path);
			$("#customKeystorePass", _panel).val(data.key_pass);
			$("#customKeystoreCertPass", _panel).val(data.key_pass);

			$("#generateCSRDialog_path").val(data.keystore_path);
			$("#generateCSRDialog_pass").val(data.key_pass);
		}
		return false;
	});

	$("#btnGenerateCSR", _panel).click(function(event) {
		$("#generateCSRDialog").dialog("open");
		return false;
	});

	$("#btnImportSSL", settingsPanel).click(function(event) {
		$("#importSSLDialog").dialog("open");
		return false;
	});

	/*Telnet Client*/
	var telnetDialog = $("#telnetDialog").form().dialog({
		autoOpen: false,
		height: 'auto',
		width: '60%',
		modal: false,
		resizable: true,
		closeOnEscape: false,
		open: function(){
			$("#telnet_host").focus();
			$('#telnet_area').empty();
			$('#telnet_cmd').val("");
			crushTelnet.telnetReset();
		},
		close: function(){
			if( $("#telnetDialog").data("connected") == "true"){
				crushTelnet.telnetDisconnect();
			}
		},
		buttons: {
			"Clear Console" : function(){
				$('#telnet_area').empty();
			},
			"Close Dialog": function() {
				$(this).dialog( "close" );
			}
		},
		beforeClose : function(){
			return true;
		}
	});
	$("#telnet_host, #telnet_port").keyup(function(ev) {
		if (ev.which === 13) {
			$('#telnet_connect').trigger('click');
		}
	});
	$(window).unload(function(){
		if( $("#telnetDialog").data("connected") == "true"){
			var obj = {
	            command: "telnetSocket",
	            sub_command: "close",
	            id: $("#telnetDialog").data("conid"),
	            random: Math.random(),
	            c2f: crushFTP.getCrushAuth()
	        };
	        $.ajax({
	            type: "POST",
	            url: crushFTP.ajaxCallURL,
	            data: obj,
	            async: true,
	            success: function (data) {
	                $("#telnetDialog").data("conid", "");
                    $("#telnetDialog").data("connected", "false");
                    $('#telnet_connect').text("Connect");
                    $('#telnet_host, #telnet_port').attr("disabled", "");
	            }
	        });
		}
	});
	$("#telnet_cmd").keyup(function(ev) {
		if (ev.which === 13) {
			var command = $(this).val();
			var timer;
			if( $("#telnetDialog").data("connected") == "false"){
				crushFTP.UI.growl("Telnet Client", "Please connect before send commands.", 2000);
			} else {
				$('#telnet_cmd').val("");
				$("#telnet_cmd").focus();
				crushTelnet.telnetAddMSG("\n"+command);
				var obj = {
					command: "telnetSocket",
					sub_command: "write",
					id: $("#telnetDialog").data("conid"),
					data: command,
					random: Math.random(),
					c2f: crushFTP.getCrushAuth()
				};
				$.ajax({
					type: "POST",
					url: crushFTP.ajaxCallURL,
					data: obj,
					async: true,
					success: function (data) {
						var response = $(data);
						var error = jQuery.trim(response.find("error").text());
						if(error != ""){
							crushTelnet.telnetAddMSG("\n"+error);
							crushTelnet.telnetDisconnect();
							crushTelnet.telnetReset();
						}
					}
				});
			}
		}
	});
	$('#telnet_connect').unbind().click(function(){
		if( $("#telnetDialog").data("connected") == "true"){
			crushTelnet.telnetDisconnect();
		} else {
			crushTelnet.telnetConnect();
		}
	});
}

panelIPServers.addServer = function(port, group)
{
	var curItem = $.extend(true, {}, panelIPServers.defaultValue);
	var msgs = panelIPServers.validateItems(port, false, false, true);
	if(port && group && msgs.length==0)
	{
		var prefs = common.data.ServerPrefs();
		curItem.port = [{text:port}];
		curItem.linkedServer = [{text:group}];
		curItem.serverbeat_ifdown_command = prefs.serverbeat_ifdown_command;
		curItem.serverbeat_ifup_command = prefs.serverbeat_ifup_command;
		curItem.serverbeat_command_disable = prefs.serverbeat_command_disable;
		curItem.serverbeat_command = prefs.serverbeat_command;
		curItem.serverbeat_post_command = prefs.serverbeat_post_command;
		curItem.serverbeat_start_ports = prefs.serverbeat_start_ports;
		var serverType = common.data.getTextContentFromPrefs(curItem, "serverType");
		var ip = common.data.getTextContentFromPrefs(curItem, "ip");
		var port = common.data.getTextContentFromPrefs(curItem, "port");
		if(serverType.toLowerCase()=="socks5")
			serverType = "SOCKS";
		var server = serverType + "://" + ip + ":" + port;
		var newElem = $("<li class='ui-widget-content'><span class='serverInfo'>"+crushFTP.methods.htmlEncode(server)+"</span></li>");
		formServerList.append(newElem);
		newElem.addClass("ui-widget-content ui-selectable-item");
		newElem.data("controlData", curItem);
		try{
            formServerList.selectableAdvanced("refresh");
        }catch(ex){}
		formServerList.find(".ui-selected, .ui-state-active").removeClass("ui-selected ui-state-active");
		newElem.addClass("ui-selected ui-state-active");
		panelIPServers.showDetails();
		panelIPServers.showHideItemsForServerType();
	}
	else
	{
		crushFTP.UI.growl("Please select valid options. Options selected",  msgs.join("<br>") + "<br/> Group:" + group, true);
	}
}

panelIPServers.bindData = function()
{
	var prefs = common.data.ServerPrefs();
	var serverList = common.data.getSubValueFromPrefs("server_list");
	var cert_path = common.data.getTextContentFromPrefs(prefs, "cert_path");
	var selectedIndex = formServerList.find("li.ui-selected").index();
	formServerList.empty();
	for(var i=0;i<serverList.length;i++)
	{
		var curItem = serverList[i];
		if(curItem)
		{
			curItem.serverbeat_ifdown_command = prefs.serverbeat_ifdown_command;
			curItem.serverbeat_ifup_command = prefs.serverbeat_ifup_command;
			curItem.serverbeat_command_disable = prefs.serverbeat_command_disable;
			curItem.serverbeat_command = prefs.serverbeat_command;
			curItem.serverbeat_post_command = prefs.serverbeat_post_command;
			curItem.serverbeat_start_ports = prefs.serverbeat_start_ports;
			var serverType = common.data.getTextContentFromPrefs(curItem, "serverType");
			var ip = common.data.getTextContentFromPrefs(curItem, "ip");
			var port = common.data.getTextContentFromPrefs(curItem, "port");
			if(typeof curItem.enabled == "undefined"){
				curItem.enabled = [{text : "true"}];
			}
			if(serverType.toLowerCase()=="socks5")
				serverType = "SOCKS";
			else if(serverType.toLowerCase()=="serverbeat")
			{
				if(typeof curItem.netmask == "undefined")
					curItem.netmask = [{text : "255.255.255.0"}];
				if(typeof curItem.priority == "undefined")
					curItem.priority = [{text : "1"}];
			}
			else if (serverType.toLowerCase() === "sftp") {
				if(typeof curItem.min_dh_size == "undefined")
					curItem.min_dh_size = [{text : "1024"}];
				if(typeof curItem.window_space == "undefined")
					curItem.window_space = [{text : "4096"}];
				if(typeof curItem.ssh_debug_log == "undefined" || curItem.ssh_debug_log == "")
					curItem.ssh_debug_log = [{text : "false"}];
				if(typeof curItem.ssh_debug_logging != "undefined")
					delete curItem.ssh_debug_logging;
				if(typeof curItem.rsa_sha1_signatures == "undefined")
					curItem.rsa_sha1_signatures = [{text : "true"}];
			}
			else if (serverType.toLowerCase() === "tftp") {
				if(typeof curItem.proxy_protocol === "undefined")
				    curItem.proxy_protocol = [{text: "ftp"}];
				if(typeof curItem.proxy_host === "undefined")
				    curItem.proxy_host = [{text: "127.0.0.1"}];
				if(typeof curItem.proxy_port === "undefined")
				    curItem.proxy_port = [{text: "21"}];
				if(typeof curItem.proxy_username === "undefined")
				    curItem.proxy_username = [{text: "anonymous"}];
				if(typeof curItem.proxy_password === "undefined")
				    curItem.proxy_password = [{text: "user@email.com"}];
				if(typeof curItem.proxy_path === "undefined")
				    curItem.proxy_path = [{text: "/"}];
			}
			if(typeof curItem.max_async_req == "undefined")
				curItem.max_async_req = [{text : "200"}];
			if(typeof curItem.proxy_header == "undefined")
				curItem.proxy_header = [{text : "false"}];
			if(typeof curItem.ssh_keep_alive_interval == "undefined")
				curItem.ssh_keep_alive_interval = [{text : "30"}];
			if(typeof curItem.ssh_auth_timeout == "undefined")
				curItem.ssh_auth_timeout = [{text : "30"}];
			if(typeof curItem.compression_allowed == "undefined")
				curItem.compression_allowed = [{text : "true"}];
			var cert = common.data.getTextContentFromPrefs(curItem, "customKeystore");
			var server = serverType + "://" + ip + ":" + port;
			var _class = common.data.getTextContentFromPrefs(curItem, "running") == "true" ? "running" : "stopped";
			var comments = common.data.getTextContentFromPrefs(curItem, "comments");
			var cmtText = comments ? "<div class='comments separator'><span>"+crushFTP.methods.htmlEncode(comments)+"</span></div>" : "";
			var newElem = $("<li class='ui-widget-content "+_class+"' serverIp='"+crushFTP.methods.htmlEncode(common.data.getTextContentFromPrefs(curItem, "ip"))+"' serverType='"+crushFTP.methods.htmlEncode(common.data.getTextContentFromPrefs(curItem, "serverType"))+"' port='"+crushFTP.methods.htmlEncode(common.data.getTextContentFromPrefs(curItem, "port"))+"' linkedServer='"+crushFTP.methods.htmlEncode(common.data.getTextContentFromPrefs(curItem, "linkedServer"))+"' running='"+crushFTP.methods.htmlEncode(common.data.getTextContentFromPrefs(curItem, "running"))+"'><span class='serverInfo'>"+crushFTP.methods.htmlEncode(server)+"</span><span class='icon'></span><div class='separator small status'>"+crushFTP.methods.htmlEncode(common.data.getTextContentFromPrefs(curItem, "display"))+"</div>"+cmtText+"</li>");
			if(serverType.toLowerCase() == "https" || serverType.toLowerCase() == "ftps" || serverType.toLowerCase() == "ftp")
			{
				if(cert){
					newElem.find("span.icon").after('<span style="float:right;" title="SSL : Using port certificate : '+crushFTP.methods.htmlEncode(cert)+'" class="ui-icon ui-icon-script vtip"></span>');
				}
				else {
					newElem.find("span.icon").after('<span style="float:right;" title="SSL : Using global certificate : '+crushFTP.methods.htmlEncode(cert_path)+'" class="ui-icon ui-icon-script vtip"></span>');
				}
			}
			formServerList.append(newElem);
			vtip(formServerList);
			newElem.data("controlData", curItem);
		}
	}
	panelIPServers.serverItemContextMenu = $("#serverItemContextMenu", _panel);
	formServerList.find("li").contextMenu({
		topPadding : 110,
		leftPadding : 230,
		menu: 'serverItemContextMenu'
	}, function (action, el, pos, command) {
		panelIPServers.adminAction(action, el.index(), el);
		return false;
	}).click(function (evt) {
		evt.stopPropagation();
		evt.preventDefault();
		$(this).trigger("mousedown").trigger("mouseup");
		return false;
	}).bind("onBeforeContextMenu", function(){
		var running = $(this).attr("running");
		panelIPServers.serverItemContextMenu.find(".ui-state-disabled").removeClass("ui-state-disabled");
		if(running == "true")
		{
			panelIPServers.serverItemContextMenu.find(".start").addClass("ui-state-disabled");
		}
		else
		{
			panelIPServers.serverItemContextMenu.find(".stop, .restart").addClass("ui-state-disabled");
		}
	});

	var groupList = common.data.getSubValueFromPrefs("server_groups");
	var formServerGroupList = $("#linkedServer, #drpConnectionGroupsOption", _panel).empty();
	for(var i=0;i<groupList.length;i++)
	{
		var curItem = groupList[i];
		if(curItem)
		{
			var serverGroup = curItem.text;
			var newElem = $("<option value='"+serverGroup+"'>"+serverGroup+"</option>");
			formServerGroupList.append(newElem);
			newElem.data("controlData", curItem);
		}
	}
	$("#linkedServer", _panel).prepend("<option value=\"\">Please Select</option>")
	$("#linkedServer", _panel).append("<option value=\"@AutoDomain\">@AutoDomain</option>")
	$("#linkedServer", _panel).append("<option value=\"@AutoHostHttp\">@AutoHostHttp</option>")
	panelIPServers.bindEvents();
	var showingData = false;
	if(selectedIndex>=0)
	{
		selectedIndex += 1;
		if(formServerList.find("li:nth-child("+selectedIndex+")").length>0)
		{
			$("#settingsPanel", _panel).unblock();
			formServerList.find("li:nth-child("+selectedIndex+")").addClass("ui-selected ui-state-active");
			panelIPServers.showDetails();
			panelIPServers.showHideItemsForServerType();
			showingData = true;
		}
	}
	else
	{
		setTimeout(function(){
			formServerList.find("li:first").trigger("mousedown.selectable");
		}, 100);
	}
	return showingData;
}

panelIPServers.diagnose = function(data){
	panelIPServers.diagnoseDialog.data("controlData", data).dialog("open");
};

panelIPServers.adminAction = function(action, _index, elem)
{
	var selectedIndex = _index;
	if(!action || selectedIndex < 0) return;
	if(action == "diag")
	{
		panelIPServers.diagnose(elem.data('controlData'));
		return;
	}
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

panelIPServers.validateItems = function(port, ip, name, onlyPort)
{
	var msgs = [];
	if(!port || port.length == 0 || !crushFTP.methods.isNumeric(port, true))
	{
		msgs.push("Port should be numeric value");
	}
	if(onlyPort)
		return msgs;
	var serverType = $("input[name='serverType']:checked", _panel);
	if(!ip || ip.length == 0 || !crushFTP.methods.isValidAnyIPAddress(ip, ["lookup"], true))
	{
		if(serverType != "DMZ" && serverType != "ServerBeat")
			msgs.push("Enter valid IP address");
	}
	if(serverType && serverType.length >0 )
		serverType = serverType.attr("id").replace("rdb","");
	if(serverType == "ServerBeat")
	{
		if(ip.toLowerCase() == "lookup")
		{
			msgs.push("(lookup is not valid for ServerBeat)");
		}
	}
	else if(serverType == "DMZ")
	{
		if(!name || name.length == 0)
		{
			msgs.push("Server name is required");
		}
	}
	return msgs;
}

panelIPServers.showDetails = function()
{
	var mainServerInstance = localStorage.getItem("mainServerInstance");
	if(mainServerInstance!=null && mainServerInstance.length>0 && mainServerInstance.toLowerCase()!= "main")
	{
		_panel.find(".dmz-blocked").show();
	}
	else{
		_panel.find(".dmz-blocked").hide();
	}
	var hasChanges = placeHolder.data("hasChanged");
	$("#settingsPanel", _panel).unblock();
	var formServerList = $(".ui-selected", _panel.find("#serverlist"));
	var server = formServerList.data("controlData");
	if(server && (typeof server.ssh_mac_list == "undefined" || server.ssh_mac_list[0] == ""))
	{
		server.ssh_mac_list = panelIPServers.defaultValue.ssh_mac_list;
	}
	if(server && (typeof server.max_packet_length == "undefined" || server.max_packet_length == ""))
	{
		server.max_packet_length = panelIPServers.defaultValue.max_packet_length;
	}
	if(server && typeof server.key_exchanges == "undefined")
	{
		server.key_exchanges = panelIPServers.defaultValue.key_exchanges;
	}
	if(server && typeof server.max_channels == "undefined")
	{
		server.max_channels = panelIPServers.defaultValue.max_channels;
	}
	if(server && server.dmz_version && server.dmz_version[0].text == "4")
	{
		server.dmz_version[0].text = "true";
	}
	if(server && server.dmz_version && server.dmz_version[0].text == "5")
	{
		server.dmz_version_5 = [{text: "true"}];
	}
	if(server.serverType[0].text.toLowerCase() == "http" || server.serverType[0].text.toLowerCase() == "https"){
		if(server.recaptcha_version && server.recaptcha_version[0].text === "3")
		{
			$(".recaptcha_v3_items").show();
		}
		else{
			$(".recaptcha_v3_items").hide();
		}
		if(server && typeof server.recaptcha_score_min == "undefined")
		{
			server.recaptcha_score_min = [{text: "0.5"}];
		}
	}

	if(formServerList && server)
	{
		bindValuesFromXML(_panel, server)
		crushFTP.UI.checkUnchekInput($("#rdb" + common.data.getTextContentFromPrefs(server, "serverType"), _panel), true);
	}
	else
	{
		bindValuesFromXML(_panel, false);
	}
	var reverseProxyData = [];
	var domains = server.reverseProxyDomain;
	var paths = server.reverseProxyPath;
	var urls = server.reverseProxyUrl;
	if(domains && domains.length>0)
		domains = domains[0].text;
	if(paths && paths.length>0)
		paths = paths[0].text;
	if(urls && urls.length>0)
		urls = urls[0].text;
	if(domains && paths && urls)
	{
		domains = domains.split("\n");
		paths = paths.split("\n");
		urls = urls.split("\n");
		for(var i=0;i<domains.length;i++)
		{
			reverseProxyData.push({
				domain : domains[i],
				url : urls[i],
				path : paths[i]
			});
		}
	}
	$(".multipleProxiesOption", _panel).addClass("hidden");
	panelIPServers.bindReverseProxiesEvents(reverseProxyData, hasChanges);
	panelIPServers.bindIPRestrictions();
	$("#linkedServer").trigger("change");
	_panel.find(".maskPasswordOnURL").each(function(){
		/*
		originalURL
		urlParams
		password
		url
		*/
		$(this).removeData().trigger("applymask");
	});
}

panelIPServers.bindReverseProxiesEvents = function(data, hasChanges)
{
	$(".removeItemProxy", _panel).trigger("click");
	$(".multipleProxiesOption", _panel).find("input").val("");
	var multipleProxiesOption = $(".multipleProxiesOption", _panel).removeClass('hidden').EnableMultiField({
        confirmOnRemove: false,
        linkText : "Add more..",
        linkClass : "addItemProxy",
        removeLinkText : "Remove",
        removeLinkClass : "removeItemProxy",
        data: data,
        addEventCallback : function(newElem, clonnedFrom){
        	newElem.show().form();
        	newElem.find(".removeItemProxy").before(newElem.find(".addItemProxy"));
        	newElem.find("input:first").select().focus();
        	newElem.find("input").bind("textchange", function(){
        		panelIPServers.buildReverseProxies();
        	});
        	itemsChanged(true);
        },
        removeEventCallback : function(prev, self, uid){
        	prev.find("input:first").select().focus();
        	prev.find(".removeItemProxy").before(prev.find(".addItemProxy"));
        	setTimeout(function(){
        		panelIPServers.buildReverseProxies();
        	}, 200);
        	itemsChanged(true);
        }
    });

	multipleProxiesOption.find("input").bind("textchange", function(){
		panelIPServers.buildReverseProxies();
	});
    multipleProxiesOption.append('<a href="#" class="removeItemProxy">Remove</a>');
    multipleProxiesOption.find('.removeItemProxy').unbind().click(function(){
    	multipleProxiesOption.addClass('hidden');
    	setTimeout(function(){
    		panelIPServers.buildReverseProxies();
    	}, 200);
    	itemsChanged(true);
    	return false;
    });

    multipleProxiesOption.find(".removeItemProxy").before(multipleProxiesOption.find(".addItemProxy"));

    $(".addMoreProxy").unbind().bind("click", function(){
    	multipleProxiesOption.parent().find(".addItemProxy:first").trigger("click");
    	return false;
    });

    if(data && data.length>0)
    {
    	$(".removeItemProxy:last", _panel).trigger("click");
    }
    else
    	multipleProxiesOption.addClass('hidden');
    setTimeout(function(){
		if(!hasChanges)
			placeHolder.removeData("hasChanged");
    }, 200);
}

panelIPServers.buildReverseProxies = function(){
	var domains = [];
	var urls =[];
	var paths =[];
	var hasItems = false;
	$(".multipleProxiesOption:not('.hidden')", _panel).each(function(){
		hasItems = true;
		var domain = $(this).find(".domain").val();
		var url = $(this).find(".url").val();
		var path = $(this).find(".path").val();
		if(domain.length>0 || url.length>0 || path.length>0)
		{
			domains.push(domain);
			urls.push(url);
			paths.push(path);
		}
	});
	if(!hasItems)
	{
		$("#reverseProxyDomain", _panel).val("").trigger("textchange");
		$("#reverseProxyUrl", _panel).val("").trigger("textchange");
		$("#reverseProxyPath", _panel).val("").trigger("textchange");
		return false;
	}
	if(domains.length>0)
	{
		$("#reverseProxyDomain", _panel).val(domains.join("\n")).trigger("textchange");
		$("#reverseProxyUrl", _panel).val(urls.join("\n")).trigger("textchange");
		$("#reverseProxyPath", _panel).val(paths.join("\n")).trigger("textchange");
	}
	else
	{
		$("#reverseProxyDomain", _panel).val("").trigger("textchange");
		$("#reverseProxyUrl", _panel).val("").trigger("textchange");
		$("#reverseProxyPath", _panel).val("").trigger("textchange");
	}
}

panelIPServers.saveContent = function()
{
	crushFTP.UI.showIndicator(false, false, "Please wait..");
	var xmlString = [];
	var formServersList = $("#serverlist", _panel).find("li");
	var isSSH = $("#rdbSFTP", _panel).is(":checked");
	var isDMZ = $("#rdbDMZ", _panel).is(":checked");
	panelIPServers.buildReverseProxies();
	var ftpOpts = $(".ftpOpts", _panel).show();
	var httpsOpts = $(".httpsOpts", _panel).show();
	var sslOpts = $(".sslOpts", _panel).show();

	/*var hasError = false;
	var itemsWithError = [];*/

	var FTPFields = $(".onlyFTP", _panel);
	if(formServersList.length>0)
	{
		var excludeItems = ["connected_users", "running", "display", "connection_number", "dmz_version", "tunneled", "dmz_version_5", "serverbeat_ifdown_command", "serverbeat_ifup_command", "serverbeat_command_disable", "serverbeat_command", "serverbeat_post_command", "serverbeat_start_ports"];
		var serverXML = [];
		xmlString.push("<server_list type=\"vector\">");
		formServersList.each(function(){
			xmlString.push("<server_list_subitem type=\"properties\">");
			var curElem = $(this);
			var controlData = curElem.data("controlData");
			var serverType = controlData.serverType[0].text;
			if(serverType == "ServerBeat"){
				serverXML.push("<serverbeat_ifdown_command>"+crushFTP.data.getTextValueFromXMLNode(controlData.serverbeat_ifdown_command,"")+"</serverbeat_ifdown_command>");
				serverXML.push("<serverbeat_ifup_command>"+crushFTP.data.getTextValueFromXMLNode(controlData.serverbeat_ifup_command, "")+"</serverbeat_ifup_command>");
				serverXML.push("<serverbeat_command_disable>"+crushFTP.data.getTextValueFromXMLNode(controlData.serverbeat_command_disable, "")+"</serverbeat_command_disable>");
				serverXML.push("<serverbeat_command>"+crushFTP.data.getTextValueFromXMLNode(controlData.serverbeat_command, "")+"</serverbeat_command>");
				serverXML.push("<serverbeat_post_command>"+crushFTP.data.getTextValueFromXMLNode(controlData.serverbeat_post_command, "")+"</serverbeat_post_command>");
				serverXML.push("<serverbeat_start_ports>"+crushFTP.data.getTextValueFromXMLNode(controlData.serverbeat_start_ports, "")+"</serverbeat_start_ports>");
			}
			for(var item in controlData)
			{
				var curItem = controlData[item];
				if(typeof curItem != "undefined" && curItem.length>0 && !excludeItems.has(item))
				{
					if(typeof curItem[0] != "undefined" && typeof curItem[0].text != "undefined")
					{
						var text = curItem[0].text;
						if(serverType == "DMZ")
						{
							if($("#IPSSSH", _panel).find("input#" + item).length==0 && FTPFields.find("input#" + item).length==0){
								if(item === "dmz_version"){
									if(text === "true"){
										xmlString.push("<"+item+">4</"+item+">");
									}
									else{
										xmlString.push("<"+item+"></"+item+">");
									}
								}
								else if(item === "dmz_version_5"){
									if(text === "true"){
										xmlString.push("<"+item+">5</"+item+">");
									}
									else{
										xmlString.push("<"+item+"></"+item+">");
									}
								}
								else{
									xmlString.push("<"+item+">"+crushFTP.methods.htmlEncode(text)+"</"+item+">");
								}
							}
						}
						else if(serverType == "SFTP")
						{
							if(FTPFields.find("input#" + item).length==0)
							{
								xmlString.push("<"+item+">"+crushFTP.methods.htmlEncode(text)+"</"+item+">");
								/*if(item == "ssh_cipher_list" && text == "")
								{
									if(!itemsWithError.has(curElem.index()))
										itemsWithError.push(curElem.index())
									hasError = true;
								}
								if(item == "ssh_session_timeout" && text == "")
								{
									if(!itemsWithError.has(curElem.index()))
										itemsWithError.push(curElem.index())
									hasError = true;
								}
								if(item == "ssh_text_encoding" && text == "")
								{
									if(!itemsWithError.has(curElem.index()))
										itemsWithError.push(curElem.index())
									hasError = true;
								}*/
							}
						}
						else
						{
							if($("#IPSSSH", _panel).find("input#" + item).length==0)
								xmlString.push("<"+item+">"+crushFTP.methods.htmlEncode(text)+"</"+item+">");
						}
					}
				}
			}
			if(isDMZ)
			{
				xmlString.push("<server_ip>auto</server_ip>");
			}
			xmlString.push(panelIPServers.buildRestrictionXMLData(controlData));
			if(serverType == "DMZ")
			{
				var v4 = controlData.dmz_version ? controlData.dmz_version[0].text : "";
				var v5 = controlData.dmz_version_5 ? controlData.dmz_version_5[0].text : "";
				if(!v5 && v4 == "5"){
					v5 = true;
				}
				var v3 = controlData.tunneled ? controlData.tunneled[0].text : "";
				if(v4 + "" === "true"){
					xmlString.push("<dmz_version>4</dmz_version>");
					xmlString.push("<tunneled>false</tunneled>");
				}
				else if(v5 + "" === "true"){
					xmlString.push("<dmz_version>5</dmz_version>");
					xmlString.push("<tunneled>false</tunneled>");
				}
				else{
					xmlString.push("<dmz_version>false</dmz_version>");
					xmlString.push("<tunneled>"+v3+"</tunneled>");
				}

			}
			xmlString.push("</server_list_subitem>");
		});
		xmlString.push("</server_list>");
	}
	var formSubItem = xmlString.join("\n");
	var errorIndex;
	$(formSubItem).find("recaptcha_enabled:contains('true')").each(function(index){
	    if(typeof errorIndex == 'undefined' && !$(this).parent().find("recaptcha_public_key").text())
	    {
	    	var serverType = $(this).parent().find("serverType").text();
	    	if(serverType.toLowerCase() == "http" || serverType.toLowerCase() == "https")
	        	errorIndex = $(this).parent();
	    }
	});

	function continueSaving(){
		if(placeHolder.data("hasChanged") && $("#pnlIPServers").is(":visible"))
		{
			var existingServerList = $(common.data.ServerPrefs(false, true)).find("server_list_subitem");
			var action = xmlString.length>0 ? "reset" : "remove";
			crushFTP.data.setXMLPrefs("server_settings/server_list/0"
				, "vector"
				, action
				, formSubItem
				, function(data){
					var updatedServerList = $(formSubItem).find("server_list_subitem");
					var changedItems = [];
					updatedServerList.each(function(index, curItem){
						var toMatch = $(existingServerList[index]);
						if(toMatch && toMatch.length>0){
							$(this).find(">*:not([type])").each(function(){
								var tag = $(this).get(0).tagName;
								var val = $(this).text();
								var valToMatch = toMatch.find(">" + tag + ":not([type])").text();
								if(val != valToMatch && !changedItems.has(index)){
									changedItems.push(index);
								}
							});
						}
						else{
							if(!changedItems.has(index) && !changedItems.has(index + "start"))
								changedItems.push(index + "start");
						}
					});
					data = $.xml2json(data, true);
					if(data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK")
					{
						function updateServerItems(){
							common.data.updateLocalPrefs(function(){
								crushFTP.UI.hideIndicator();
								crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
								placeHolder.removeData("hasChanged");
								panelIPServers.init();
							});
							for (var i = 0; i < changedItems.length; i++) {
								var curIndex = changedItems[i] + "";
								if(curIndex.indexOf("start")>=0)
								{
									curIndex = curIndex.split("start")[0];
									(function(i){
										setTimeout(function(){
											panelIPServers.adminAction("startServer", i);
										}, 500)
									})(curIndex);
								}
								else{
									if(formServerList.find("li:eq("+curIndex+")").hasClass('running')){
										(function(i){
											setTimeout(function(){
												panelIPServers.adminAction("restartServer", i);
											}, 500)
										})(curIndex);
									}
								}
							}
						}
						if(serverXML.length>0){
							var dataXML = '<server_prefs type="properties">' + serverXML.join("\r\n") + '</server_prefs>';
					        crushFTP.data.setXMLPrefs("server_settings/server_prefs/", "properties", "update", dataXML, function(data) {
					            data = $.xml2json(data, true);
					            if (data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK") {
					            	updateServerItems();
					            } else {
					                crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
					            }
					        });
						}
						else{
							updateServerItems();
						}
					}
					else
					{
						crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
					}
				}
			);
		}
		else
		{
			crushFTP.UI.growl("No changes made", "", false, 3000);
		}
	}

	if(errorIndex){
		jConfirm("Recaptcha is enabled but not configured, all logins will fail if the recaptcha configuration is incorrect.", "Recaptcha Warning", function(value){
			if(value)
			{
				crushFTP.UI.hideIndicator();
				$($("#serverlist").find("li").get(errorIndex.index())).click();
				setTimeout(function(){
					$($("#settingsPanel:visible").find(".tabs").find("li").get(3)).find("a").click();
				}, 100);
			}
			else{
				continueSaving();
			}
		},{
			okButtonText : "Fix",
			cancelButtonText : "Continue Anyway"
		});
		return;
	}
	else{
		continueSaving();
	}
}

panelIPServers.buildRestrictionXMLData = function(data)
{
	if(data)
	{
		var bannedIPList = data["ip_restrictions"];
		if(bannedIPList && bannedIPList.length>0)
		{
			bannedIPList = bannedIPList[0]["ip_restrictions_subitem"];
		}
		else
		{
			data["ip_restrictions"] = [{ip_restrictions_subitem : []}];
			bannedIPList = data["ip_restrictions"];
			bannedIPList = bannedIPList[0]["ip_restrictions_subitem"];
		}
		var ip_restrictions = "<ip_restrictions type=\"vector\">";
		if(bannedIPList){
			for (var i = 0; i < bannedIPList.length; i++) {
				var curData = bannedIPList[i];
				if(curData)
				{
					ip_restrictions += "<ip_restrictions_subitem type=\"properties\">";
					ip_restrictions += "<start_ip>"+crushFTP.methods.htmlEncode(crushFTP.data.getTextValueFromXMLNode(curData.start_ip, ""))+"</start_ip>";
					ip_restrictions += "<type>"+crushFTP.methods.htmlEncode(crushFTP.data.getTextValueFromXMLNode(curData.type, ""))+"</type>";
					ip_restrictions += "<stop_ip>"+crushFTP.methods.htmlEncode(crushFTP.data.getTextValueFromXMLNode(curData.stop_ip, ""))+"</stop_ip>";
					ip_restrictions += "<notes>"+crushFTP.methods.htmlEncode(crushFTP.data.getTextValueFromXMLNode(curData.notes, ""))+"</notes>";
					ip_restrictions += "</ip_restrictions_subitem>";
				}
			};
		}
		ip_restrictions += "</ip_restrictions>";
		return ip_restrictions;
	}
}

panelIPServers.diagnoseDialog = $("#diagnoseDialog");
panelIPServers.diagnoseDialog.form().dialog({
	autoOpen: false,
	width: 400,
	title : "Diagnostics Test: ",
	modal: true,
	resizable: false,
	closeOnEscape: false,
	buttons: {
		"Cancel" : function(){
			$(this).dialog("close");
		},
		"OK": function() {
			var IP = panelIPServers.diagnoseDialog.find("#diag_HostAuto").is(":checked") ? "auto" : $.trim(panelIPServers.diagnoseDialog.find("#diag_IP").val());
			var Port = $.trim(panelIPServers.diagnoseDialog.find("#diag_Port").val());
			var Protocol = $.trim(panelIPServers.diagnoseDialog.find("#diag_Protocol").val());
			var User = $.trim(panelIPServers.diagnoseDialog.find("#diag_UserName").val());
			var Pass = $.trim(panelIPServers.diagnoseDialog.find("#diag_pass").val());

			if(Port == "")
			{
				jAlert("Port is required", function(){});
				return false;
			}
			if(Protocol == "")
			{
				jAlert("Protocol is required", function(){
					panelIPServers.diagnoseDialog.find("#diag_Protocol").focus();
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
			var blockedDiv = panelIPServers.diagnoseDialog.closest("div.ui-dialog").block({
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
                    			panelIPServers.diagnoseDialog.dialog("close");
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
		crushFTP.UI.checkUnchekInput(panelIPServers.diagnoseDialog.find("#diag_HostAuto"), true);
		panelIPServers.diagnoseDialog.find(".manualIP,.ftpItems").hide();
		panelIPServers.diagnoseDialog.find("#diag_Port").val(crushFTP.data.getTextValueFromXMLNode(data.port, "")).attr("readonly", "readonly");
		panelIPServers.diagnoseDialog.find("#diag_IP").val("");
		panelIPServers.diagnoseDialog.find("#diag_Protocol").val(crushFTP.data.getTextValueFromXMLNode(data.serverType, "")).trigger('textchange');
		$.get("http://www.crushftp.com/ip.jsp", function(data){
			if(data)
			{
				var elem = $(data);
				var IP = $.trim(elem.text().replace("Current IP CheckCurrent IP Address: ", ""));
				if(IP)
				{
					panelIPServers.diagnoseDialog.find("#diag_publicIPAddress").text(IP);
					panelIPServers.diagnoseDialog.find("#diag_IP").val(IP);
				}
			}
		})
	}
});

panelIPServers.diagnoseDialog.find("#diag_HostAuto").change(function(){
	if($(this).is(":checked"))
		panelIPServers.diagnoseDialog.find(".manualIP").hide();
	else
		panelIPServers.diagnoseDialog.find(".manualIP").show();
});

panelIPServers.diagnoseDialog.find("#diag_Protocol").bind("textchange", function(){
	if($.trim($(this).val().toLowerCase()) == "ftp")
		panelIPServers.diagnoseDialog.find(".ftpItems").show();
	else
		panelIPServers.diagnoseDialog.find(".ftpItems").hide();
});

panelIPServers.diagnoseDialog.find("#diag_Port").bind("dblclick", function(){
	$(this).removeAttr('readonly').focus();
});

var crushTelnet = {
	telnetListener : function(activate){
		if(activate){
			if(panelIPServers.telnetTimer)
				clearInterval(panelIPServers.telnetTimer);
			panelIPServers.telnetTimer = setInterval(function(){
				var obj = {
					command: "telnetSocket",
					sub_command: "read",
					id: $("#telnetDialog").data("conid"),
					random: Math.random(),
					c2f: crushFTP.getCrushAuth()
				};
				if(panelIPServers.telnetReading == false){
					$.ajax({
						type: "POST",
						url: crushFTP.ajaxCallURL,
						data: obj,
						async: true,
						beforeSend: function(){
							panelIPServers.telnetReading = true;
						},
						success: function (data) {
							var response = $(data);
							var error = jQuery.trim(response.find("error").text());
							if(error != ""){
								crushTelnet.telnetAddMSG("\n"+error);
								crushTelnet.telnetDisconnect();
								crushTelnet.telnetReset();
							} else {
								var finalResponse = decodeURIComponent(jQuery.trim(response.find("data").text()));
								if(finalResponse != ""){
									crushTelnet.telnetAddMSG("\n"+finalResponse.replace(/[\s\r\n]+$/, ''));
									$("#telnet_area").animate({
										scrollTop:$("#telnet_area")[0].scrollHeight - $("#telnet_area").height()
									},10);
								}
							}
							panelIPServers.telnetReading = false;
						}
					});
				} else {
					//console.log('skipping');
				}
			}, 1000);
		} else {
			if(panelIPServers.telnetTimer)
				clearInterval(panelIPServers.telnetTimer);
		}
	},
	telnetDisconnect : function(){
		var obj = {
			command: "telnetSocket",
			sub_command: "close",
			id: $("#telnetDialog").data("conid"),
			random: Math.random(),
			c2f: crushFTP.getCrushAuth()
		};
		$.ajax({
			type: "POST",
			url: crushFTP.ajaxCallURL,
			data: obj,
			async: true,
			success: function (data) {
				var response = $(data);
				crushTelnet.telnetAddMSG("\n"+decodeURIComponent(jQuery.trim(response.find("data").text())));
				crushTelnet.telnetReset();
			}
		});
	},
	telnetConnect : function(){
		if( jQuery.trim($('#telnet_host').val()) == "" || jQuery.trim($('#telnet_port').val()) == "" ) {
			crushFTP.UI.growl("Telnet Client", "Host and port cannot be empty.", 2000);
		} else {
			$('#telnet_area').empty();
			crushTelnet.telnetAddMSG("Connecting to: "+$('#telnet_host').val()+" on port: "+$('#telnet_port').val()+"...");
			var obj = {
				command: "telnetSocket",
				sub_command: "connect",
				host: $('#telnet_host').val(),
				port: $('#telnet_port').val(),
				random: Math.random(),
				c2f: crushFTP.getCrushAuth()
			};
			$.ajax({
				type: "POST",
				url: crushFTP.ajaxCallURL,
				data: obj,
				async: true,
				success: function (data) {
					var response = $(data);
					var idConnection = jQuery.trim(response.find("id").text());
					if(idConnection != "") {
						$("#telnetDialog").data("conid", idConnection);
						$('#telnet_connect').text("Disconnect");
						$('#telnet_host, #telnet_port').attr("disabled", "disabled");
						$("#telnetDialog").data("connected", "true");
						crushTelnet.telnetAddMSG("\n"+decodeURIComponent(jQuery.trim(response.find("data").text())));
						crushTelnet.telnetListener(true);
					} else {
						crushTelnet.telnetReset();
						crushTelnet.telnetAddMSG("\n"+decodeURIComponent(jQuery.trim(response.find("error").text())));
					}
					$("#telnet_cmd").focus();
				}
			});
		}
	},
	telnetReset : function(){
		$("#telnetDialog").data("conid", "");
	    $("#telnetDialog").data("connected", "false");
	    $('#telnet_connect').text("Connect");
	    $('#telnet_host, #telnet_port').attr("disabled", "");
	    crushTelnet.telnetListener(false);
	},
	telnetAddMSG : function(msg){
		$('#telnet_area').append(crushTelnet.htmlspecialchars(decodeURIComponent(msg)));
		$("#telnet_area").animate({
			scrollTop:$("#telnet_area")[0].scrollHeight - $("#telnet_area").height()
		},10);
	},
	htmlspecialchars : function(string, quote_style, charset, double_encode){
		var optTemp = 0,
		  i = 0,
		  noquotes = false;
		if (typeof quote_style === 'undefined' || quote_style === null) {
		  quote_style = 2;
		}
		string = string.toString();
		  if (double_encode !== false) {
		    // Put this first to avoid double-encoding
		    string = string.replace(/&/g, '&amp;');
		}
		string = string.replace(/</g, '&lt;')
		  .replace(/>/g, '&gt;');

		  var OPTS = {
		    'ENT_NOQUOTES': 0,
		    'ENT_HTML_QUOTE_SINGLE': 1,
		    'ENT_HTML_QUOTE_DOUBLE': 2,
		    'ENT_COMPAT': 2,
		    'ENT_QUOTES': 3,
		    'ENT_IGNORE': 4
		  };
		  if (quote_style === 0) {
		    noquotes = true;
		  }
		  if (typeof quote_style !== 'number') {
		    // Allow for a single string or an array of string flags
		    quote_style = [].concat(quote_style);
		    for (i = 0; i < quote_style.length; i++) {
		      // Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
		      if (OPTS[quote_style[i]] === 0) {
		        noquotes = true;
		      } else if (OPTS[quote_style[i]]) {
		        optTemp = optTemp | OPTS[quote_style[i]];
		      }
		    }
		    quote_style = optTemp;
		  }
		  if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
		    string = string.replace(/'/g, '&#039;');
		  }
		  if (!noquotes) {
		    string = string.replace(/"/g, '&quot;');
		  }

		  return string;
	}
}


panelIPServers.pollServerInfo = function(){
	if(panelIPServers.serverInfoTimer)
		return;
	panelIPServers.serverInfoTimer = setInterval(function(){
		if($("#serverlist", _panel).is(":visible"))
		{
			crushFTP.data.serverRequest({
				command: "getServerItem",
				key : "server_info/server_list"
			},
			function(data){
				var serverlist = $.xml2json(data);
				if(serverlist && serverlist.response_data && serverlist.response_data.result_value)
				{
					crushFTP.methods.rebuildSubItems(serverlist.response_data.result_value, "result_value");
					serverlist = serverlist.response_data.result_value.result_value_subitem;
					for (var i = 0; i < serverlist.length; i++) {
						var curItem = serverlist[i];
						var _class = curItem.running == "true" ? "running" : "stopped";
						var elem = formServerList.find("li").eq(i);
						if(elem && elem.length>0)
						{
							elem.removeClass('running stopped').addClass(_class).find(".status").text(curItem.display);
							elem.attr("running", curItem.running);
						}
					}
				}
				if(!data){
					crushFTP.methods.validateUserLoginState();
				}
			}, undefined, "GET");
		}
	}, 1000);
}