/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelReportsSetup = {};
panelReportsSetup.localization = {};
/****************************/

// Panel details
panelReportsSetup.panelName = "ReportsSetup";
panelReportsSetup._panel = $("#pnl" + panelReportsSetup.panelName);

// Localizations
panelReportsSetup.localization = {
};

// Assign localizations
localizations.panels[panelReportsSetup.panelName] = $.extend(panelReportsSetup.localization, localizations.panels[panelReportsSetup.panelName]);

// Interface methods
panelReportsSetup.init = function(){
	applyLocalizations(panelReportsSetup.panelName, localizations.panels);
	$("#reportConfiguration", panelReportsSetup._panel).hide();
	panelReportsSetup.bindEvents();
	panelReportsSetup.bindData();
}

panelReportsSetup.bindData = function()
{
    var dateFormat = "mm/dd/yyyy";
        if(typeof adminPanel.dateFormat != "undefined")
            dateFormat = adminPanel.dateFormat;
        dateFormat = dateFormat.replace("yyyy","yy").replace("yyyy","yy").replace("YYYY","yy").replace("AA","A").replace("aa","a").replace("_"," ").split(" ");
        if(dateFormat[0].toLowerCase().indexOf("hh")>=0 && dateFormat[1])
            dateFormat = dateFormat[1].split("_hh")[0]; //This is hack to support date format like YYYY,MM,dd_hh:mm ss
        else
            dateFormat = dateFormat[0].split("_hh")[0]; //This is hack to support date format like YYYY,MM,dd_hh:mm ss
	var dates = $("#startDate, #endDate", panelReportsSetup._panel).datepicker({
        dateFormat : dateFormat,
		changeMonth: true,
		changeYear: true,
		onSelect: function(selectedDate) {
			var option = this.id == "startDate" ? "minDate" : "maxDate",
				instance = $(this).data("datepicker"),
				date = $.datepicker.parseDate(
					instance.settings.dateFormat ||
					$.datepicker._defaults.dateFormat,
					selectedDate, instance.settings );
			dates.not(this).datepicker("option", option, date);
		}
	});
	panelReportsSetup.bindForms();
	panelReportsSetup._panel.find("input#showFiles_1").trigger("change");
}

panelReportsSetup.bindDataToForm = function(_panel, data){
    var attrToUse = "name";
    _panel = $(_panel);
    _panel.find("input[type='text'],input[type='password'], textarea, select").each(function(){
        if($(this).attr(attrToUse))
        {
            if(data)
            {
                for(var curItem in data)
                {
                    if("meta_" + curItem == $(this).attr(attrToUse))
                    {
                        $(this).val(crushFTPTools.decodeURILocal(data[curItem]));
                    }
                }
            }
            else
            {
                $(this).val("");
            }
        }
    });
    _panel.find("input[type='checkbox']").each(function(){
        if($(this).attr(attrToUse))
        {
            if(curItem)
            {
                var flag = false;
                if(data)
                {
                    for(var curItem in data)
                    {
                        if("meta_" + curItem == $(this).attr(attrToUse) && crushFTPTools.decodeURILocal(data[curItem]) == $(this).val())
                        {
                            flag = true;
                        }
                    }
                }
                if(flag)
                    $(this).attr("checked", "checked");
                else
                    $(this).removeAttr("checked");
            }
            else
                $(this).removeAttr("checked");
        }
    });
    _panel.find("input[type='radio']").each(function(){
        if($(this).attr(attrToUse))
        {
            if(data)
            {
                var flag = false;
                for(var curItem in data)
                {
                    if("meta_" + curItem == $(this).attr(attrToUse) && crushFTPTools.decodeURILocal(data[curItem]) == $(this).val())
                    {
                        flag = true;
                    }
                }
            }
            if(flag)
            {
                $(this).parent().find("input[type='radio']").removeAttr("checked");
                $(this).attr("checked", "checked");
            }
            else
                $(this).removeAttr("checked");
        }
    });
};

panelReportsSetup.bindEvents = function()
{
	var customFormPanel = $("#customFormPanel", panelReportsSetup._panel).dialog({
		autoOpen: false,
        modal : false,
        width: 600,
        closeOnEscape : false,
        open : function()
        {
        	setTimeout(function(){
                $(customFormPanel).find("select[name$='_cascade']").each(function(){
                    var _this = $(this);
                    _this.unbind().bind("change", function(){
                        var val = $(this).val();
                        _this.find("option").each(function(){
                            $(customFormPanel).find("*[name$='_"+$(this).val()+"']").closest("tr").hide();
                        });
                        $(customFormPanel).find("*[name$='_"+val+"']").closest("tr").show();
                    }).trigger("change");
                });
                var _nowDate = new Date();
	            _nowDate.setDate(_nowDate.getDate() + 1);
	            var _dateFormat = 'mm/dd/yy';
	            customFormPanel.find("input.futureDateField").each(function(){
	                if($(this).is(":disabled") || $(this).attr("readonly")) return;
	                $(this).datepicker({ //For date fields which accepts future dates
	                    dateFormat: _dateFormat,
	                    showOn: 'both',
	                    buttonImage: '/WebInterface/jQuery/images/calendar.png',
	                    buttonImageOnly: true,
	                    minDate: _nowDate
	                }).attr("readonly", "readonly");
	            });

	            customFormPanel.find("input.dateField").each(function(){
	                if($(this).is(":disabled") || $(this).attr("readonly")) return;
	                $(this).datepicker({  //Normal date fields
	                    dateFormat: _dateFormat,
	                    showOn: 'both',
	                    buttonImage: '/WebInterface/jQuery/images/calendar.png',
	                    buttonImageOnly: true
	                }).attr("readonly", "readonly");
	            });
            }, 500);
        },
        buttons : {"OK" : function(){
        	$(this).dialog("close");
        }}
	});

	panelReportsSetup._panel.find("#dateRange").change(function(){
		var range = $(this).val();
        var dateFormat = "mm/dd/yyyy";
        if(typeof adminPanel.dateFormat != "undefined")
            dateFormat = adminPanel.dateFormat;
        dateFormat = dateFormat.replace("yyyy","yy").replace("yyyy","yy").replace("YYYY","yy").replace("_"," ").replace("yy","yyyy").split(" ");
        if(dateFormat[0].toLowerCase().indexOf("hh")>=0 && dateFormat[1])
            dateFormat = dateFormat[1].split("_hh")[0]; //This is hack to support date format like YYYY,MM,dd_hh:mm ss
        else
            dateFormat = dateFormat[0].split("_hh")[0]; //This is hack to support date format like YYYY,MM,dd_hh:mm ss

		if(range != "")
		{
			var days = parseInt(range);
            if(range.endsWith("h"))
                days = 0;
            var startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            startDate = startDate.format(dateFormat);

			$("#startDate", panelReportsSetup._panel).val(startDate).attr("disabled", true).addClass("ui-priority-secondary");
			$("#endDate", panelReportsSetup._panel).val("").attr("disabled", true).addClass("ui-priority-secondary");
        }
		else
		{
			var curDate = $("#startDate", panelReportsSetup._panel).val();
			if(curDate.length==0)
			{
				curDate = new Date();
				curDate.setDate(curDate.getDate()-14);
                curDate = curDate.format(dateFormat);
			}
			$("#startDate", panelReportsSetup._panel).val(curDate).removeAttr("disabled").removeClass("ui-priority-secondary");
			$("#endDate", panelReportsSetup._panel).removeAttr("disabled").removeClass("ui-priority-secondary");
		}
	}).trigger("change");

	panelReportsSetup._panel.find("a#pickUsers").click(function(){
		$("#usernames", panelReportsSetup._panel).crushFtpPickUserPopup({
            width: 1000,
            height: 800
        });
		return false;
	});

	panelReportsSetup._panel.find("input#showFiles_1").change(function(){
		if($(this).is(":checked"))
			panelReportsSetup._panel.find("p#sub_options_for_files").show();
		else
			panelReportsSetup._panel.find("p#sub_options_for_files").hide();
	});

	panelReportsSetup._panel.find("#reportName").change(function(){
		var reportConfiguration = $("#reportConfiguration", panelReportsSetup._panel);
		reportConfiguration.hide().find("div.reportConfig").hide();
		if($(this).val() && $(this).val() != "")
		{
			reportConfiguration.show().find("div#reportConfig" + $(this).val()).show();
		}
	});
	var show = "scale";
	if($.browser.opera){
		show = "none";
	}
	$("#reportDialog").dialog({
	   autoOpen: false,
	   modal: true,
	   show : show,
	   height: 600,
	   width: 900,
	   closeOnEscape : false,
		buttons: [
		{
			text: "OK",
			click: function() { $(this).dialog("close"); }
		},
		{
			text: "Save Report",
			click: function() {
				$(this).dialog("close");
				panelReportsSetup._panel.find("#saveReport").trigger("click");
			}
		}]
     });

	panelReportsSetup._panel.find("#runReport, #saveReport").unbind().click(function(){
		if(panelReportsSetup._panel.find("#reportName").val() == "" || panelReportsSetup._panel.find("#reportName").val() == null)
        {
            jAlert("Please choose report to run", "Message", function(){
                panelReportsSetup._panel.find("#reportName").focus().select();
            });
            return false;
        }
        if(panelReportsSetup._panel.find("#reportName").val() == "UserFolderAccess" && $("#search_url").val() == "" && $("#search_name").val() == "")
        {
            jAlert("You have to enter search phrase at least for one field from URL or VFS name as Name searches by `contains` and url searches by `starts with`", "Message", function(){
                panelReportsSetup._panel.find("#search_url").focus().select();
            });
            return false;
        }
        var params = panelReportsSetup.serializeReportElements();
        var parameters = params.join("&");
        parameters = parameters + "&c2f=" + crushFTP.getCrushAuth();
        if($(this).is("#saveReport"))
        {
            parameters += "&saveReport=true";
            $("#reportDialog").html('<iframe id="reportDialogFrame" width="99%" height="99%" marginWidth="0" marginHeight="0" frameBorder="0" scrolling="auto"></iframe>');
            $("#reportDialogFrame").attr("src", crushFTP.ajaxCallURL + "?command=runReport&" + parameters);
        }
        else
        {
            var reportPath = "CrushReports";
            if(crushFTPTools.queryString("nr") == "false")
                reportPath = "CrushReportsOld";
            var linkURL="/WebInterface/"+reportPath+"/index.html?parameters=" + parameters;
            $("#reportDialogNew").html('<iframe id="reportDialogNewFrame" onload="panelReportsSetup.reportFrameLoaded();" width="100%" height="100%" marginWidth="0" marginHeight="0" frameBorder="0"></iframe>');
            $("#reportDialogNewFrame").attr("src", linkURL);

             $("#reportDialogNew").block({
                message:'Loading report..',
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
		}
		return false;
	});

	$("#uploadForm,#welcomeForm", panelReportsSetup._panel).change(function(){
		if($(this).val()!="")
		{
			var formID = $(this).val();
			var items = panelReportsSetup.getFormDetails(formID);
			//Get XML text from an element
			function XMLValue(val) {
				if (val && val.text) {
					return val.text;
				} else {
					return "";
				}
			}
			if(items)
			{
				if(panelReportsSetup.lastShownForm == formID)
				{
					customFormPanel.dialog("open");
				}
				else
				{
					panelReportsSetup.lastShownForm = formID;
					var html = "";
					var formname = "CustomForm";
					if (items.entries) {
						var fields = items.entries[0].entries_subitem;
						formname = XMLValue(items.name[0]);
						html = '<form id="frmCustomForm" method="post"><table class="mycustomForm" cellpadding="0" cellspacing="0">';
						html += '<tr style="display:none;"><td colspan="2"><input type="hidden" id="meta_UploadFormId" name="meta_UploadFormId" value="' + XMLValue(items.id[0]) + '"/><input type="hidden" id="meta_form_name" name="meta_form_name" value="' + XMLValue(items.name[0]) + '" /></td></tr><tr><td width="30%"></td><td width="70%"></td></tr>';
						for (var item in fields) {
							html += panelReportsSetup.generateFormField(fields[item]);
						}
						html += '</table></form>';
					}
					if(html && html.length>0)
					{
						customFormPanel.html(html).dialog({
							title : formname
						}).dialog("open");
					}
				}
			}
		}
	});

	$("#showUploadFormPopup,#showWelcomeFormPopup", panelReportsSetup._panel).click(function(){
		if($(this).is("#showUploadFormPopup"))
			$("#uploadForm", panelReportsSetup._panel).trigger("change");
		else
			$("#welcomeForm", panelReportsSetup._panel).trigger("change");
		return false;
	});
    var localdelay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();
    panelReportsSetup._panel.find("input[type='text'], input[type='password']").bind("textchange", function(){
        localdelay(function () {
            panelReportsSetup.configChanged();
        }, 300);
    });
    panelReportsSetup._panel.find("input[type='checkbox'], input[type='radio'], textarea, select").bind("change", function(){
        localdelay(function () {
            panelReportsSetup.configChanged();
        }, 300);
    });
};

panelReportsSetup.configChanged = function(){
    if($('#reportDialogNewFrame').contents().find("#crushReportPanel").length){
        $('#hasChanges').show();
    }
    else{
        $('#hasChanges').hide();
    }
};

function extractValString(item, index, rep) {
    if (item.length >= index && item[index] && item[index].toString() != "undefined") {
        return item[index];
    } else {
        return rep || "";
    }
}

//Get XML text from an element
function XMLValue(val) {
    if (val && val.text) {
        return val.text;
    } else {
        return "";
    }
}

//General form field based on data passed
panelReportsSetup.generateFormField = function(data) {
	var html = '';
    var randomId = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)
    randomId += possible.charAt(Math.floor(Math.random() * possible.length)); //Generate random Id for field
    var requiredField = (data.required && XMLValue(data.required[0]) == "true") ? "<span class='requiredField'>*</span>" : "";
    if (!data.type || (data.type[0].text != 'label' && !data.name)) {
        return "";
    }
    var controlName = "";
    if(data.name)
    {
        controlName = XMLValue(data.name[0]);
    }
    switch (data.type[0].text) {
    case "label":
        //Generate label, with value
        var labelL = XMLValue(data.label[0]);
        var labelR = XMLValue(data.value[0]);
        var labelName = "label_" + randomId;
        try{
            if(data.name && data.name.length>0)
                labelName = XMLValue(data.name[0]);
        }catch(ex){
            labelName = "label_" + randomId;
        }
        var loadPage = false;
        var loadLeft = false;
        if(labelL.indexOf("{get:")>=0)
        {
            var _index = labelL.indexOf("{get:");
            loadPage = labelL.substring(labelL.indexOf("{get:") + 5, labelL.length);
            loadPage = loadPage.substring(0, loadPage.indexOf("}"));
            loadLeft = true;
        }
        else if(labelR.indexOf("{get:")>=0)
        {
            var _index = labelR.indexOf("{get:");
            loadPage = labelR.substring(labelR.indexOf("{get:") + 5, labelR.length);
            loadPage = loadPage.substring(0, loadPage.indexOf("}"));
        }
        if(loadPage)
        {
            if(labelR.length==0)
                html = '<tr>' + '<td colspan="2" class="formValFull loadPage" page="'+loadPage+'"><label name="meta_'+labelName+'">' + XMLValue(data.label[0]) + '</label></td><tr>';
            else
            {
                if(loadLeft)
                    html = '<tr>' + '<td class="formLabel loadPage" page="'+loadPage+'">' + labelL + '</td>' + '<td class="formVal"><label name="meta_'+labelName+'">' + labelR + '</label></td> ' + requiredField + '<tr>';
                else
                    html = '<tr>' + '<td class="formLabel">' + labelL + ' ' + requiredField + '</td>' + '<td class="formVal loadPage" page="'+loadPage+'"><label name="meta_'+labelName+'">' + labelR + '</label></td>' + '<tr>';
            }
        }
        else
        {
            if(labelR.length==0)
                html = '<tr>' + '<td colspan="2" class="formValFull"><label name="meta_'+labelName+'">' + XMLValue(data.label[0]) + '</label></td><tr>';
            else
                html = '<tr>' + '<td class="formLabel">' + labelL + '</td>' + '<td class="formVal"><label name="meta_'+labelName+'">' + labelR + '</label>' + requiredField + '</td>' + '<tr>';
        }
        break;
    case "text":
        //Generate input text box, with value and applied size
        var size = XMLValue(data.size[0]);
        var maxchars = data.max_chars ? XMLValue(data.max_chars[0]) : "";
        var dateFieldClass = "";
        var validateEmail = "";
        var validatePass = "";
        var inputType = "text";
        if (controlName.lastIndexOf("_date1") >= 0) {
            dateFieldClass = "futureDateField";
        } else if (controlName.lastIndexOf("_date") >= 0) {
            dateFieldClass = "dateField";
        }
        if (controlName.lastIndexOf("_email") >= 0) {
            validateEmail = " validateEmail";
        }
        if (controlName.lastIndexOf("_password") >= 0) {
            validatePass = " validatePass";
            inputType = "password";
        }
        var maxlength = size ? size.toString().indexOf("%")>0 ? " style='width:"+size.toString()+";' " : " style='width:"+size.toString().split("px")[0]+"px;' " : "";
        maxchars = maxchars ? " maxlength='"+maxchars+"' " : "";
        html = '<tr>' + '<td class="formLabel"><label for="' + XMLValue("meta_" + data.name[0]) + '">' + XMLValue(data.label[0]) + '</label></td>' + '<td class="formVal"><input  type="'+inputType+'"  id="' + "meta_" + controlName + randomId + '" name="' + "meta_" + controlName + '" value="' + XMLValue(data.value[0]) + '" ' + maxlength + maxchars + ' class="required_' + XMLValue(data.required[0]) + ' ' + dateFieldClass + validateEmail + validatePass + '" />' + requiredField + '</td>' + '<tr>';
        break;
    case "textarea":
        //Generate textarea, with value, cols provided
        var cols = parseInt(XMLValue(data.cols[0]));
        if (cols > 40) cols = 40;
        html = '<tr>' + '<td class="formLabel"><label for="' + "meta_" + controlName + '">' + XMLValue(data.label[0]) + '</label></td>' + '<td class="formVal"><textarea id="' + "meta_" + controlName + randomId + '" name="' + "meta_" + controlName + '" cols="' + cols + '" rows="' + XMLValue(data.rows[0]) + '" class="required_' + XMLValue(data.required[0]) + '">' + XMLValue(data.value[0]) + '</textarea>' + ' ' + requiredField + '</td>' + '<tr>';
        break;
    case "combo":
        //Generate dropdown list, with options provided, selected option
        var options = '';
        var opts = data.options[0].options_subitem;
        var itemCount = 0;
        var optgroupOpen = false;
        for (var item in opts) {
            if (typeof opts[item] == "object" || typeof opts[item] == "string") {
                var selected = itemCount == 0 ? "selected" : "";
                var curValue = typeof opts[item] == "string" ? opts[item] : opts[item].text;
                var nameValuePair = [curValue, curValue];
                if (curValue.indexOf(":") >= 0) {
                    nameValuePair = curValue.split(":");
                }
                var val = extractValString(nameValuePair, 1, extractValString(nameValuePair, 0));
                if(nameValuePair.length==3 && nameValuePair[2].toLowerCase() == val.toLowerCase())
                {
                    selected = "selected";
                }
                if(curValue.indexOf("---")==0)
                {
                    if(optgroupOpen)
                    {
                        options += '</optgroup>';
                    }
                    options += '<optgroup label="' + curValue.replace("---","") + '">';
                    optgroupOpen = true;
                }
                else
                    options += '<option ' + selected + ' value="' + extractValString(nameValuePair, 1, extractValString(nameValuePair, 0)) + '">' + nameValuePair[0] + '</option>';
                itemCount++;
            }
        }
        if(optgroupOpen)
        {
            options += '</optgroup>';
        }
        html = '<tr>' + '<td class="formLabel"><label for="' + "meta_" + controlName + '">' + XMLValue(data.label[0])+ '</label></td class="formVal">' + '<td><select id="' + "meta_" + controlName + randomId + '" name="' + "meta_" + controlName + '" class=" required_' + XMLValue(data.required[0]) + '">' + options + '</select>' + ' ' + requiredField + '</td>' + '<tr>';
        break;
    case "checkbox":
        //Generate checkboxes, with value and default selection
        var options = '';
        var opts = data.options[0].options_subitem;
        for (var item in opts) {
            if (typeof (opts[item]) != "function") {
                var selected = ""; //item == 0 ? "checked" : "";
                var nameValuePair = " : ";
                if (opts[item].text) {
                    nameValuePair = opts[item].text.split(":");
                }
                var val = extractValString(nameValuePair, 2, extractValString(nameValuePair, 0)).split(",");
                if(nameValuePair.length==3 && val.has(extractValString(nameValuePair, 1, extractValString(nameValuePair, 0))))
                {
                    selected = "checked";
                }
                options += '<span class="chkBoxPanel"><input class="chkbox required_' + XMLValue(data.required[0]) + '" type="checkbox" id="' + "meta_" + controlName + '"  ' + selected + ' name="' + "meta_" + controlName + '"  value="' + extractValString(nameValuePair, 1, extractValString(nameValuePair, 0)) + '">' + nameValuePair[0] + '</input></span>';
            }
        }
        html = '<tr>' + '<td class="formLabel"><label for="' + "meta_" + controlName + randomId + '">' + XMLValue(data.label[0]) + '</label></td>' + '<td class="formVal">' + options + ' ' + requiredField+'</td>' + '<tr>';
        break;
    case "tags":
        //Generate checkboxes, with value and default selection
        var options = '';
        var opts = data.options[0].options_subitem;
        var itemCount = 0;
        var optgroupOpen = false;
        for (var item in opts) {
            if (typeof opts[item] == "object" || typeof opts[item] == "string") {
                var selected = "";
                var curValue = typeof opts[item] == "string" ? opts[item] : opts[item].text;
                var nameValuePair = " : ";
                if (opts[item].text) {
                    nameValuePair = opts[item].text.split(":");
                }
                var val = extractValString(nameValuePair, 2, extractValString(nameValuePair, 0)).split(",");
                if(nameValuePair.length==3 && val.has(extractValString(nameValuePair, 1, extractValString(nameValuePair, 0))))
                {
                    selected = "selected";
                }
                if(curValue.indexOf("---")==0)
                {
                    if(optgroupOpen)
                    {
                        options += '</optgroup>';
                    }
                    options += '<optgroup label="' + curValue.replace("---","") + '">';
                    optgroupOpen = true;
                }
                else
                    options += '<option ' + selected + ' value="' + extractValString(nameValuePair, 1, extractValString(nameValuePair, 0)) + '">' + nameValuePair[0] + '</option>';
                itemCount++;
            }
        }
        if(optgroupOpen)
        {
            options += '</optgroup>';
        }
        html = '<tr>' + '<td class="formLabel"><label for="' + "meta_" + controlName + '">' + XMLValue(data.label[0])+ '</label></td class="formVal">' + '<td><select style="width:250px;" multiple id="' + "meta_" + controlName + randomId + '" name="' + "meta_" + controlName + '" class="chosen required_' + XMLValue(data.required[0]) + '">' + options + '</select>' + ' ' + requiredField + '</td>' + '<tr>';
        break;
    case "radio":
        //Generate radio buttons, with value and default selection
        var options = '';
        var opts = data.options[0].options_subitem;
        var item = 0;
        for (var item in opts) {
            if (opts[item].text) {
                var selected = item == 0 ? "checked" : "";
                var nameValuePair = opts[item].text.split(":");
                var val = extractValString(nameValuePair, 2, extractValString(nameValuePair, 0)).split(",");
                if(nameValuePair.length==3 && val.has(extractValString(nameValuePair, 1, extractValString(nameValuePair, 0))))
                {
                    selected = "checked";
                }
                options += '<input type="radio" id="' + "meta_" + controlName + randomId + '" ' + selected + ' name="' + "meta_" + controlName + '"  value="' + extractValString(nameValuePair, 1, extractValString(nameValuePair, 0)) + '">' + nameValuePair[0] + '</input>';
                item++;
            }
        }
        html = '<tr>' + '<td class="formLabel"><label for="' + "meta_" + controlName + '">' + XMLValue(data.label[0]) + '</label></td>' + '<td class="formVal">' + options + ' ' + requiredField+'</td>' + '<tr>';
        break;
    default:
        break;
    }
    return html; //Return current field
}

panelReportsSetup.getFormDetails = function(formId)
{
	var prefs = crushFTP.storage("GUIXMLPrefs_RAW");
	var items = $.xml2json(prefs, true);
	var forms = items.CustomForms;
	if(forms && forms.length>0)
	{
		forms = forms[0];
		if(forms.CustomForms_subitem)
		{
			forms = forms.CustomForms_subitem;
			for(var i=0;i<forms.length;i++)
			{
				var curForm = forms[i];
				if(curForm && curForm.id[0].text == formId)
				{
					return curForm;
				}
			}
		}
	}
	return false;
}

panelReportsSetup.serializeReportElements = function(delimiter)
{
	function elemName(name, _reportName)
	{
		if(name == "linked_vfs_users" || name == "expire_account" || name == "expire_password" || name == "errors_only") return name;
        if(_reportName != "UserFolderAccess"){
    		if(name.indexOf("_")>=0)
    		{
    			name = name.substr(0, name.indexOf("_"));
    		}
        }
		return name;
	}
	var params = [];
	delimiter = delimiter || "=";
	var isDateRange = panelReportsSetup._panel.find("#dateRange").val() != "";
    var _startDate = $("#startDate", panelReportsSetup._panel).val();
    var _endDate = $("#endDate", panelReportsSetup._panel).val();
    if(_startDate && _endDate && _startDate == _endDate){
        jAlert("Report start/end date cannot be same, end date has to be one day in the future to the start day", "Message", function(){
            $("#endDate", panelReportsSetup._panel).focus();
        });
        return false;
    }
	panelReportsSetup._panel.find("#reportInputs").find(".reportElement").each(function(){
		if($(this).attr("type")=="checkbox")
		{
			params.push($(this).attr("id") + delimiter + $(this).is(":checked"));
		}
		else
		{
			var id = $(this).attr("id");
            if(id == "startDate")
            {
                try{
                    var startDate = $("#startDate", panelReportsSetup._panel).datepicker("getDate").format("mm/dd/yyyy");
                    params.push("startDate" + delimiter + startDate);
                }catch(ex){
                    params.push("startDate" + delimiter + "");
                }
            }
            else if(id == "endDate")
            {
                try{
                    var endDate = $("#endDate", panelReportsSetup._panel).datepicker("getDate").format("mm/dd/yyyy");
                    params.push("endDate" + delimiter + endDate);
                }catch(ex){
                    params.push("endDate" + delimiter + "");
                }
            }
            else
            {
			     params.push($(this).attr("id") + delimiter + $(this).val());
            }
		}
	});

	var reportName = panelReportsSetup._panel.find("#reportName").val();
	panelReportsSetup._panel.find("div#reportConfig" + reportName).find(".reportElement").each(function(){
		if($(this).attr("type")=="checkbox")
		{
			params.push(elemName($(this).attr("id")) + delimiter + $(this).is(":checked"));
		}
		else
		{
			params.push(elemName($(this).attr("id"), reportName) + delimiter + $(this).val());
		}
	});
	if(isDateRange)
	{
		params.push("show" + delimiter + panelReportsSetup._panel.find("#dateRange").find(":selected").text());
	}
	if((reportName == "UploadFormsSearch" && $("#uploadForm", panelReportsSetup._panel).val()!="") || (reportName == "WelcomeFormsSearch" && $("#welcomeForm", panelReportsSetup._panel).val()!=""))
	{
		$("#customFormPanel").find("input, textarea, select").each(function(){
            params.push($(this).attr("name") + "___type" + delimiter + $(this).attr("type"));
            params.push($(this).attr("name") + delimiter + $(this).val());
		});
	}
	return params;
}

panelReportsSetup.reportFrameLoaded = function()
{
    setTimeout(function(){
        $('#hasChanges').hide();
    	$("#reportDialog").unblock();
        $("#reportDialogNew").unblock();
        var iframe = $('#reportDialogNewFrame').contents().find("#crushReportPanel");
        var lastHeight = iframe.outerHeight();
        $('#reportDialogNewFrame').css("height", lastHeight);
        panelReportsSetup.reportFrameResizer();
    }, 1500);
};

panelReportsSetup.reportFrameResizer = function(){
    // var iframe = $('#reportDialogNewFrame').contents().find("#crushReportPanel");
    // var lastHeight = iframe.outerHeight();
    // setInterval(function() {
    //     var newHeight = iframe.outerHeight();
    //     if(newHeight != lastHeight){
    //         $('#reportDialogNewFrame').css("height", newHeight);
    //         lastHeight = newHeight;
    //     }
    // }, 500);

    $("#reportDialog").unblock();
    $("#reportDialogNew").unblock();
    $('#reportDialogNewFrame').css("height", $('#reportDialogNewFrame').contents().find("#ifrmbody").outerHeight() + 20)
    if(panelReportsSetup.reportFrameResizerID)
        clearInterval(panelReportsSetup.reportFrameResizerID)
    panelReportsSetup.reportFrameResizerID = setInterval(function() {
        var curHeight = $('#reportDialogNewFrame').height();
        var newHeight = $('#reportDialogNewFrame').contents().find("#ifrmbody").outerHeight();
        if(Math.abs(newHeight-curHeight) > 20)
            $('#reportDialogNewFrame').css("height", newHeight + 20)
    }, 1000);
}

panelReportsSetup.bindScheduleConfig = function(config)
{
	$("#reportsPanelTabs").tabs({selected:0});
	if(config)
	{
		panelReportsSetup._panel.clearForm();
		adminPanel.data.bindValuesFromJson(panelReportsSetup._panel, config, false, true);
		if(config.show)
		{
			panelReportsSetup._panel.find("#dateRange option:contains(" + config.show + ")").attr('selected', 'selected').trigger("change");
		}
	}
	return false;
}

panelReportsSetup.bindForms = function()
{
	var formsDropdowns = $("#uploadForm,#welcomeForm", panelReportsSetup._panel).empty();
	var prefs = crushFTP.storage("GUIXMLPrefs");
	var forms = prefs.CustomForms;
	crushFTP.methods.rebuildSubItems(forms, "CustomForms");
	if(forms && forms.CustomForms_subitem)
	{
		forms = forms.CustomForms_subitem;
	}
	formsDropdowns.append("<option value=''></option>");
	if(forms && forms.length>0)
	{
		for(var i=0;i<forms.length;i++)
		{
			var curForm = forms[i];
			if(curForm)
			{
				var newControl = $("<option value='"+curForm.id+"'>"+curForm.name+"</option>")
				newControl.data("controlData", curForm);
				formsDropdowns.append(newControl);
			}
		}
	}
}