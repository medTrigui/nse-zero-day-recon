/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelEmailTemplates = {};
panelEmailTemplates.localization = {};
/****************************/

// Panel details
var panelName = "EmailTemplates";
var _panel = $("#pnl" + panelName);

// Localizations
panelEmailTemplates.localization = {
	headerText : " ",
	btnResetText : "Reset To Default",
	btnCancelText : "Cancel",
	btnOKText : "Save"
};

panelEmailTemplates.defaultConfig = {
	name: [{text:""}],
	emailSubject: [{text:""}],
	emailBody: [{text:""}]
};

// Assign localizations
localizations.panels[panelName] = $.extend(panelEmailTemplates.localization, localizations.panels[panelName]);

// Interface methods
panelEmailTemplates.init = function(isRefresh){
	placeHolder.removeData("hasChanged");
	applyLocalizations(panelName, localizations.panels);
	crushFTP.methods.setPageTitle(panelEmailTemplates.localization.Header, true);
	panelEmailTemplates.initLayout(isRefresh);
	panelEmailTemplates.bindData();
	panelEmailTemplates.bindEvents();
	$("#emailTemplatesList", _panel).val("").trigger("change");
    setupPrefsReplicationSave(_panel, panelName);
}

panelEmailTemplates.initLayout = function(isRefresh)
{
	var prefs = $.extend(true, {}, common.data.ServerPrefs());
	var emailTemplates = prefs.email_templates;
	panelEmailTemplates.emailTemplates = false;
	var totalSubItems = 0;
	if(emailTemplates && emailTemplates.length>0)
	{
		var subItem = emailTemplates[0];
		if(subItem && subItem.email_templates_subitem)
		{
			subItem = subItem.email_templates_subitem;
		}
		if(subItem && subItem.length>0)
		{
			panelEmailTemplates.emailTemplates = subItem;
		}
	}
	panelEmailTemplates.refreshItems(false, false, isRefresh);
}

panelEmailTemplates.refreshItems = function(templates, bindData, isRefresh, addedNew)
{
	templates = templates || panelEmailTemplates.emailTemplates;
	if(templates && templates.length>0)
	{
		var templateList = $("#emailTemplatesList", _panel);
		var templateIndex = templateList.val();
		if(addedNew)
			templateIndex = "";
		templateList.empty();
		for(var index=0; index<templates.length;index++)
		{
			var curItem = templates[index];
			var opt = $("<option value='"+index+"'>"+crushFTP.methods.htmlEncode(curItem.name[0].text)+"</option>");
			try{
				curItem.emailBody[0].text = DOMPurify.sanitize(curItem.emailBody[0].text);
			}catch(ex){}
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
		templateList.prepend('<option value="">Please select</option>');
		templateList.append('<option value="addNew">+ Add new</option>');
		if(templateIndex != "addNew" && templateIndex != "")
		{
			setTimeout(function(){
				var inputs = _panel.find("#templateDetails").find("input, textarea").addClass("excludeXML");
				templateList.val(templateIndex).trigger("change");
				inputs.removeClass("excludeXML");
			}, 100);
		}
	}
}

panelEmailTemplates.bindData = function(data)
{
	var isChanged = placeHolder.data("hasChanged") || false;
	var templateDetails = _panel.find("#templateDetails");
	var inputs = templateDetails.find("input, textarea").addClass("excludeXML");
	if(data)
	{
		templateDetails.show();
		$("#selctToContinueNote", _panel).hide();
		bindValuesFromXML(templateDetails, data);
		$("#emailBody").htmlarea('dispose');
		$("#emailBody").htmlarea({
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
	else
	{
		templateDetails.hide();
		$("#selctToContinueNote", _panel).show();
	}
	setTimeout(function(){
		inputs.removeClass("excludeXML");
		templateDetails.find("#htmlswitch").trigger("change");
		placeHolder.data("hasChanged", isChanged);
	}, 500);
}

panelEmailTemplates.bindEvents = function()
{
	function doesNameExists(name)
	{
		if(!panelEmailTemplates.emailTemplates)
		{
			panelEmailTemplates.emailTemplates = [];
		}
		var templates = panelEmailTemplates.emailTemplates;
		for(var index=0; index<templates.length;index++)
		{
			var curItem = templates[index];
			if(curItem.name[0].text.toLowerCase() == name.toLowerCase())
				return true;
		}
		return false;
	}
	var emailTemplatesList = $("#emailTemplatesList", _panel);
	function selectAndLoad(name)
	{
		if(!panelEmailTemplates.emailTemplates)
		{
			panelEmailTemplates.emailTemplates = [];
		}
		var templates = panelEmailTemplates.emailTemplates;
		for(var index=0; index<templates.length;index++)
		{
			var curItem = templates[index];
			if(curItem.name[0].text.toLowerCase() == name.toLowerCase())
			{
				emailTemplatesList.val(index).trigger("change");
				index = templates.length;
			}
		}
	}

	var addTemplate = $("a#addTemplate", _panel).unbind().click(function(evt, data){
		if(!panelEmailTemplates.emailTemplates)
		{
			panelEmailTemplates.emailTemplates = [];
		}
		var _val = "New Email Template";
		if(data)
			_val == data;
		jPrompt("Template Name : ", _val, "Input", function(value){
			if(value && value.length>0)
			{
				value = $.trim(value);
				if(!doesNameExists(value))
				{
					itemsChanged(true);
					var newTemplate = $.extend({}, panelEmailTemplates.defaultConfig);
					newTemplate.name = [{text:value}];
					panelEmailTemplates.emailTemplates.push(newTemplate);
					panelEmailTemplates.refreshItems(panelEmailTemplates.emailTemplates, true, false, true);
					selectAndLoad(value);
				}
				else
				{
					jAlert("Same name form Email Template exists, choose another name.", "Error", function(){
						addTemplate.trigger("click", [value]);
					});
				}
			}
		});
		return false;
	});

	emailTemplatesList.bind("change", function(){
		var templateName = $(this).val();
		if(templateName == "addNew")
		{
			addTemplate.trigger("click");
			emailTemplatesList.val("").trigger("change");
		}
		else if(templateName != "")
		{
			var controlData = $(this).find("option:selected").data("controlData");
			if(controlData)
			{
				panelEmailTemplates.bindData(controlData);
			}
			else
			{
				panelEmailTemplates.bindData();
			}
		}
		else
		{
			panelEmailTemplates.bindData();
		}
	});

	$("a#removeTemplate", _panel).unbind().click(function(evt, control){
		var templateIndex = emailTemplatesList.val();
		if(templateIndex != "addNew" && templateIndex != "")
		{
			jConfirm("Are you sure you wish to remove selected template?", "Confirm", function(value){
				if(value)
				{
					itemsChanged(true);
					templateIndex = parseInt(templateIndex);
					panelEmailTemplates.emailTemplates.remove(parseInt(templateIndex));
					emailTemplatesList.val("").trigger("change");
					panelEmailTemplates.refreshItems(panelEmailTemplates.emailTemplates, true);
				}
			});
		}
		return false;
	});

	function updateStorageValue(key, val)
	{
		var templateIndex = emailTemplatesList.val();
		if(templateIndex != "addNew" && templateIndex != "")
		{
			templateIndex = parseInt(templateIndex);
			var emailTemplates = panelEmailTemplates.emailTemplates;
			if(emailTemplates && emailTemplates.length>templateIndex)
			{
				var curItem = emailTemplates[templateIndex];
				curItem[key] = [{text : val}];
			}
		}
	}

	var templateDetails = _panel.find("#templateDetails");
	templateDetails.find("input[type='text'], textarea").unbind("textchange").bind("textchange", function(){
		var that = $(this);
		if(that.hasClass("excludeXML"))return;
		if(that.is("#name"))
		{
			emailTemplatesList.find("option:selected").text(that.val());
		}
		itemsChanged(true);
		updateStorageValue(that.attr("id"), DOMPurify.sanitize(that.val()))
	});

	templateDetails.find("#htmlswitch").unbind("change").bind("change", function(){
		$("#emailBody").val(DOMPurify.sanitize($("#emailBody").val()));
		if($(this).is(":checked")){
			$("#emailBody").htmlarea('dispose');
		}
		else{
			$("#emailBody").htmlarea('dispose');
			$("#emailBody").htmlarea({
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
}

panelEmailTemplates.saveContent = function()
{
	var templateDetails = _panel.find("#templateDetails");
	templateDetails.find("input[type='text'], textarea").trigger("textchange");
	templateDetails.find("#htmlswitch").trigger("change");
	if(placeHolder.data("hasChanged"))
	{
		var emailTemplates = panelEmailTemplates.emailTemplates;
		var xml = [];
		xml.push("<email_templates type=\"vector\">");
		if(emailTemplates && emailTemplates.length>0)
		{
			for(var i=0;i<emailTemplates.length;i++)
			{
				xml.push("<email_templates_subitem type=\"properties\">");
				var curConfig = emailTemplates[i];
				for(var item in curConfig)
				{
					if(item != "type")
					{
						if(curConfig[item] && curConfig[item].length>0)
						{
							var text = curConfig[item][0].text || "";
							xml.push("<"+item+">" + crushFTP.methods.htmlEncode(DOMPurify.sanitize(text)) + "</"+item+">");
						}
					}
				}
				xml.push("</email_templates_subitem>");
			}
		}
		xml.push("</email_templates>");
		var xmlData = '<server_prefs type="properties">'+xml.join("\r\n")+'</server_prefs>';
		crushFTP.UI.showIndicator(false, false, "Please wait..");
		crushFTP.data.setXMLPrefs("server_settings/server_prefs/", "properties", "update", xmlData, function(data){
			data = $.xml2json(data, true);
			if(data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK")
			{
				placeHolder.removeData("hasChanged");
				common.data.updateLocalPrefs(function(){
					placeHolder.removeData("hasChanged");
					panelEmailTemplates.init(true);
					crushFTP.UI.hideIndicator();
					crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
				});
			}
			else
			{
				crushFTP.UI.hideIndicator();
				crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
			}
		}, panelEmailTemplates.saveParams);
	}
	else
	{
		crushFTP.UI.growl("No changes made", "", false, 3000);
	}
}

panelEmailTemplates.buildXMLData = function()
{
	var xmlString = buildXMLToSubmitForm(_panel);
	return xmlString;
}