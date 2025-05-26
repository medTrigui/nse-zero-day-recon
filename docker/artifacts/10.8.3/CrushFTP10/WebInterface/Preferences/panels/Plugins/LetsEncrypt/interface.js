/****************************
CrushFTP GUI Plugin custom js
*****************************/
/* Do not change these lines */
var pluginLetsEncrypt = {};
pluginLetsEncrypt.localization = {};
/****************************/

// Plugin details
var pluginName = "LetsEncrypt";
var _plugin = $("#pnlPlugin" + pluginName);
var curLoadedData;

// Interface methods
pluginLetsEncrypt.init = function(pluginID, returnXML){
	pluginLetsEncrypt.returnXML = returnXML;
	applyLocalizations(pluginName, localizations.panels["Plugins"]);
	var service = common;
	if(pluginLetsEncrypt.returnXML)
	{
		service = crushFTP;
	}
	var serverList = service.data.getSubValueFromPrefs("server_list");
	var serverPorts = $("#tls_alpn_https_port", _plugin).empty();
    var httpserverPorts = $("#challenge_http_port", _plugin).empty();
	// var pfwdList = $("#temporarily_close_port_forward", _plugin).empty();
	// pfwdList.append("<option value=''></option>");
	var serverInstances = $("#plugin_instance", _plugin).empty();
	var mainServerInstance = $("#mainServerInstance");
	mainServerInstance.find("option").each(function(){
		var opt = $(this).clone();
		if(opt.text() == "Main")
			opt.text("");
		serverInstances.append(opt);
	});
	if(serverInstances.find("option").length == 0){
		serverInstances.append("<option value=''></option>");
	}
	for(var i=0;i<serverList.length;i++)
	{
		var curItem = serverList[i];
		if(curItem)
		{
			var serverType = service.data.getTextContentFromPrefs(curItem, "serverType");
			var port = service.data.getTextContentFromPrefs(curItem, "port");
			if(serverType.toLowerCase() == "https" || serverType.toLowerCase() == "portforwards")
			{
				var newControl = $('<option value="' + port + '">' + port + '</option>');
				serverPorts.append(newControl);
			}
            else if(serverType.toLowerCase() == "http")
            {
                var newControl = $('<option value="' + port + '">' + port + '</option>');
                httpserverPorts.append(newControl);
            }
			// else if(serverType.toLowerCase() == "portforward" || serverType.toLowerCase() == "portforwards"){
			// 	pfwdList.append('<option value="' + port + '">' + port + '</option>');
			// }
		}
	}
	var run_plugin_after_renew = $("#run_plugin_after_renew", _panel).empty();
	run_plugin_after_renew.append("<option value=\"\">-</option>");
	var crushTaskPlugins = common.data.getPluginPrefs("CrushTask");
	var pluginOpts = $('<optgroup label="Plugin"></optgroup>');
	for(var index=0; index<crushTaskPlugins.length;index++)
	{
		var curPlugin = crushTaskPlugins[index];
		if(curPlugin && curPlugin.subItem && curPlugin.subItem.length>0)
		{
			var tabName = curPlugin.subItem[0].text ? "CrushTask:" + curPlugin.subItem[0].text : "CrushTask";
			pluginOpts.append("<option value=\""+crushFTP.methods.textEncode(unescape(tabName))+"\">"+crushFTP.methods.textEncode(unescape(tabName))+"</option>");
		}
	}
	run_plugin_after_renew.append(pluginOpts);
	var availableJobs = $(document).data("AvailableJobsNoEvents");
	if(availableJobs && availableJobs.length>0)
	{
		var jobOpts = $('<optgroup label="Job"></optgroup>');
		for (var i = 0; i < availableJobs.length; i++) {
			jobOpts.append("<option value=\"Job:"+crushFTP.methods.textEncode(unescape(availableJobs[i]))+"\">"+crushFTP.methods.textEncode(unescape(availableJobs[i]))+"</option>");
		}
		run_plugin_after_renew.append(jobOpts);
	}
	pluginLetsEncrypt.bindData(0, pluginID);
}

pluginLetsEncrypt.bindData = function(index, pluginID)
{
    _panel.find(".maskPasswordOnURL").each(function () {
        $(this).removeData("originalURL realURL url");
        var rel = $(this).attr("rel");
        if (rel) {
          var refElem = $("#" + rel, _plugin);
          refElem.removeData("urlParams");
        }
    });
	index = index || 0;
	var pluginPrefs = [];
	pluginLetsEncrypt.showServerList();
	if(pluginID)
	{
		var data = $(document).data("PluginBindData" + pluginID);
		pluginPrefs = data.dataItem;
		$(".nonEmbed", _plugin).hide();
	}
	else
	{
		pluginPrefs = common.data.getPluginPrefs(pluginName);
	}
	if(pluginPrefs)
	{
		var curPlugin = pluginPrefs;
		if(!pluginID && pluginPrefs.length)
		{
			curPlugin = pluginPrefs[index];
		}
        // if(typeof curPlugin.challenge_path == "undefined")
        //     curPlugin.challenge_path = [{"text" : "./Webinterface/"}];
		pluginLetsEncrypt.bindPluginDetails(curPlugin);
	}
	$("#request_version", _plugin).val("V02");
	pluginLetsEncrypt.bindEvents();
    $("#request_version, #challenge_type").trigger('change');
}

pluginLetsEncrypt.bindEvents = function()
{
	if(this.eventAdded)return;
    var auto_update_items = $("#auto_update_items", _plugin);
    var LetsEncryptV2Option = $("#LetsEncryptV2Option", _plugin);
    var tlsOption = $("#tlsOption", _plugin);
    var httpOption = $("#httpOption", _plugin);
	_plugin.find("input, select, textarea").bind("change", function(){
		panelPlugins.itemsChanged(true, pluginLetsEncrypt.returnXML, pluginName);
        if($(this).is("#auto_update")){
            if($(this).is(":checked")){
                auto_update_items.show();
            }
            else{
                auto_update_items.hide();
            }
        }
        if($(this).is("#request_version")){
            if($(this).val() == "V02"){
                LetsEncryptV2Option.show();
            }
            else{
                LetsEncryptV2Option.hide();
            }
        }
        if($(this).is("#challenge_type")){
            if($(this).val() == "tls-alpn-01"){
                tlsOption.show();
                httpOption.hide();
            }
            else{
                tlsOption.hide();
                httpOption.show();
            }
        }
	});

    $("#auto_update", _plugin).trigger('change');

	_plugin.find("input[type='text'], textarea").bind("textchange", function(){
		panelPlugins.itemsChanged(true, pluginLetsEncrypt.returnXML, pluginName);
	});
	$("[valtype]", _plugin).crushValidator();
	$("[valtype]", _plugin).unbind().bind("textchange",function(){
		$(this).validateNow({
			notForUserManager : true,
			isForPreferences : true
		});
	});

	_panel.find(".maskPasswordOnURL").each(function(){
        $(this).unbind("focus.form").bind("focus.form", function(){
            if($(this).data("originalURL"))
                $(this).val($(this).data("originalURL"));
        }).unbind("blur.form").bind("blur.form", function(){
            $(this).trigger("applymask");
        }).unbind("applymask").bind("applymask", function(){
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

	setTimeout(function(){
    	_panel.find(".maskPasswordOnURL").trigger("applymask");
	}, 100);

	$("a.serverFilePickButton", _panel).each(function(){
        $(this).unbind("click").click(function(){
			var curElem = $(this);
            var rel = curElem.attr("rel");
            var pickingFor = curElem.parent().parent().find("label[for='"+rel+"']").text() || "";
            pickingFor = $.trim($.trim(pickingFor).replace(":", ""));
            var refElem = $("#" + rel, _panel);
            var labelName = refElem.val() || "";
            var advancedBrowse = true;
            var existingData = refElem.data("urlParams") || {};
            var curPath = refElem.val();
            if(refElem.hasClass('maskPasswordOnURL')){
                curPath = refElem.data("realURL") || refElem.val();
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
            if(typeof existingData.sharepoint_site_drive_name == "undefined")
            {
                existingData.sharepoint_site_drive_name = "Documents";
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
                existingData : existingData || {},
                urlWithParams: true,
                existingVal : "/",
                allowRootSelection : advancedBrowse,
                isFTPBrowse : advancedBrowse,
                callback : function(selectedPath){
                    $("#" + curElem.attr("rel"), _panel).val(selectedPath).removeData("urlParams").trigger('applymask');
                    panelPlugins.itemsChanged(true, pluginLetsEncrypt.returnXML, pluginName);
                }
            });
            return false;
		});
    });

     $('#submit-btn, #test-btn').click(function(e){
        e.preventDefault();
        e.stopPropagation();
        var btn = $(this);
        if(btn.hasClass('ui-state-disabled'))
            return false;
        var isTest = $(this).is("#test-btn");
        btn.addClass('ui-state-disabled').attr("disabled", "disabled");
        function continueCommand(){
            var data = {
                command: "letsencrypt",
                action: "fetch_certs"
            };
            _panel.find("input[type='text'],input[type='password'],textarea,select").each(function(){
                if($(this).attr("id"))
                {
                    var curVal = $(this).val();
                    if($(this).attr("id") == "keystore_path"){
                        data[$(this).attr("id")] = crushFTP.methods.htmlEncode(curVal);
                    }
                    else{
                        data[$(this).attr("id")] = curVal;
                    }
                }
            });
            _panel.find("input[type='checkbox']").each(function(){
                if($(this).attr("id"))
                {
                    var curVal = $(this).is(":checked");
                    data[$(this).attr("id")] = curVal;
                }
            });
            if(isTest){
            	data.staging = true;
            }
            else{
            	data.staging = false;
            }
            crushFTP.data.serverRequest(data, function(msg){
                crushFTP.UI.growl("Let's Encrypt", DOMPurify.sanitize(decodeURIComponent($(msg).text())), false, false);
                btn.removeClass('ui-state-disabled').removeAttr('disabled');
            });
        }
        if(_panel.find(".hasPendingCall").length>0)
        {
            window.pendingEncryptionCall = function(){
                continueCommand();
            };
            _panel.find(".hasPendingCall").trigger("blur");
        }
        else
        {
            continueCommand();
        }
    });
	this.eventAdded = true;
}

pluginLetsEncrypt.bindPluginDetails = function(controlData)
{
    curLoadedData = controlData;
	var inputs = _plugin.find("input.ignoreBind,select.ignoreBind,textarea.ignoreBind").removeClass("ignoreBind");
	if(controlData)
	{
		if(typeof controlData.usernameTemplate == "undefined" || controlData.usernameTemplate[0] == "" || controlData.usernameTemplate[0].text == "")
			controlData.usernameTemplate = [{ text: "default" }];
	}
	bindValuesFromXML(_plugin, controlData);
	if(controlData.subItem && controlData.subItem.length>0)
		_plugin.attr("subPluginName", controlData.subItem[0].text || "");
	inputs.addClass("ignoreBind");
}

pluginLetsEncrypt.showServerList = function()
{
	if(!this.serverListShown)
	{
		var service = common;
		if(pluginLetsEncrypt.returnXML)
		{
			service = crushFTP;
		}
		var serverList = service.data.getSubValueFromPrefs("server_list");
		var serverPorts = $("#server_item", _plugin);
		for(var i=0;i<serverList.length;i++)
		{
			var curItem = serverList[i];
			if(curItem)
			{
				var serverType = service.data.getTextContentFromPrefs(curItem, "serverType");
				var ip = service.data.getTextContentFromPrefs(curItem, "ip");
				var port = service.data.getTextContentFromPrefs(curItem, "port");
				var server = ip + "_" + port;
				var newControl = $("<option>"+server+"</option>");
				serverPorts.append(newControl);
				newControl.data("controlData", curItem);
			}
		}
		serverPorts.prepend("<option>All</option>");
		this.serverListShown = true;
	}
}

pluginLetsEncrypt.saveContent = function(saveByIndex, cloneName, removeByIndex, callback)
{
	removeByIndex = removeByIndex || 0;
	if(pluginPlaceHolder.data("hasChanged") || removeByIndex>0 || (saveByIndex>0 && cloneName) || pluginLetsEncrypt.returnXML)
	{
		var hasError = false;
		$("[valtype]", _plugin).each(function(){
			if($(this).validateNow({
				notForUserManager : true,
				isForPreferences : true
			}) && !$(this).attr("_ignore"))
			{
				hasError = true;
			}
		});
		if(hasError){
			return;
		}

		if(!pluginLetsEncrypt.returnXML)
			crushFTP.UI.showIndicator(false, false, "Please wait..");

		var xmlString = [];
		var container = _plugin;
		if(removeByIndex == 0)
		{
            var domains = $("#domains", _plugin).val();
            var commonName = $("#commonName", _plugin).val();
            if(!commonName){
                $("#commonName", _plugin).val(domains);
            }
            if(curLoadedData){
                var oldDomainsName = common.data.getTextContentFromPrefs(curLoadedData, "domains");
                if(oldDomainsName != domains)
                    $("#commonName", _plugin).val(domains);
            }
			xmlString.push("<plugins_subitem type=\"properties\">");
			xmlString.push("<version>"+$("#version", _plugin).text()+"</version>");
			xmlString.push("<pluginName>"+pluginName+"</pluginName>");
			xmlString.push(buildXMLToSubmitForm(_plugin, true));
			if(typeof saveByIndex != "undefined")
			{
				if(typeof cloneName == "undefined" || cloneName == "undefined" || cloneName == "false" || cloneName == pluginName)
				{
					var subItem = crushFTP.methods.htmlEncode(container.attr("subPluginName"));
					if(!subItem || subItem == "undefined" || subItem == "false" || subItem == pluginName)
						subItem = "";
					xmlString.push("<subItem>"+subItem+"</subItem>");
				}
				else
					xmlString.push("<subItem>"+crushFTP.methods.htmlEncode(cloneName)+"</subItem>");
			}
			else
			{
				if(container.attr("subPluginName") && this.subItem>0)
				{
					var subItem = crushFTP.methods.htmlEncode(container.attr("subPluginName"));
					if(!subItem || subItem == "undefined" || subItem == "false" || subItem == pluginName)
						subItem = "";
					xmlString.push("<subItem>"+subItem+"</subItem>");
				}
				else
				{
					xmlString.push("<subItem></subItem>");
				}
			}
			xmlString.push("</plugins_subitem>");
		}
		var formSubItem = xmlString.join("\n");

		if(pluginLetsEncrypt.returnXML)
			return formSubItem;

		var action = removeByIndex == 0 ? "change" : "remove";
		var index = window.currentPluginIndex;
		var subItemIndex = removeByIndex == 0 ? saveByIndex || this.subItem : removeByIndex;
		subItemIndex = subItemIndex || 0;
		var removeChangeFlag = (saveByIndex>0 && cloneName);
		panelPlugins.savePluginContentProcess(action, formSubItem, index, subItemIndex, removeChangeFlag, callback);
	}
	else
	{
		crushFTP.UI.growl("No changes made", "", false, 3000);
	}
}