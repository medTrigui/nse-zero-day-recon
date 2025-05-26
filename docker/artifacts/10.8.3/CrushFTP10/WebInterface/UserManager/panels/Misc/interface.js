/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelMisc = {};
panelMisc.localization = {};
/****************************/

// Panel details
var panelName = "Misc";

// Localizations
panelMisc.localization = {
};

// Assign localizations
localizations.panels[panelName] = $.extend(panelMisc.localization, localizations.panels[panelName]);

// Interface methods
panelMisc.init = function(){
	applyLocalizations(panelName, localizations.panels);
	window.dataBindEvents.push(panelMisc.bindData);
	panelMisc.bindEvents();
}

panelMisc.clearForm = function(panel)
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

panelMisc.bindData = function(userInfo, jsonDeep, panel)
{
	panelMisc.user = userInfo.user;
	if(!userInfo.user.created_by_username){
		$('#createrinformation').hide()
	} else {
		$('#createrinformation').show()
	}
	var createdTime = userInfo.user.created_time;
	var convertedCteatedTime = new Date();
	if(createdTime){
		if((createdTime + "").length == 13){
			convertedCteatedTime = new Date(parseInt(createdTime));
		}
		else {
			var mm = parseInt(createdTime.substr(0, 2), 0);
			var dd = parseInt(createdTime.substr(2, 2), 0);
			var yyyy = parseInt(createdTime.substr(4, 4), 0);
			var hh = parseInt(createdTime.substr(8, 2), 0);
			var mmm = parseInt(createdTime.substr(10, 2), 0);
			var ss = parseInt(createdTime.substr(12, 2), 0);
			convertedCteatedTime = new Date(yyyy, mm-1, dd, hh, mmm, ss);
		}
	}
	convertedCteatedTime = convertedCteatedTime.format('mm/dd/yyyy hh:nn:ss a/p')
	$('span#convertedCteatedTime').html(convertedCteatedTime)

	var dataPanel = panel || panelMisc._panel;
	panelMisc.clearForm(dataPanel);

	if(panel)
	{
		panel.removeClass("inheritValSet");
	}
	if(userInfo.user)
	{
		userManager.data.bindValuesFromJson(dataPanel, userInfo.user, false, panel);
		//Bind extra text references
		var extraTextReference = $("#extraTextReference", dataPanel).empty();
		var currentUserData = crushFTP.storage("currentUser").user;
		for(var item in currentUserData)
		{
			if(item.toString().indexOf("x_")==0)
			{
				var newItem = $("<li class='ui-widget-content' key='"+item.replace("x_" , "")+"'>"+ crushFTP.methods.textEncode(item) + " : " + crushFTP.methods.textEncode(currentUserData[item]) +"</li>");
				extraTextReference.append(newItem);
				newItem.data("_value", currentUserData[item]);
			}
		}
	}
	userManager.UI.panelsPostbindEvent(dataPanel, panel);
}

panelMisc.bindEvents = function()
{
	//Toggle sections for this panel
	userManager.UI.togglePanels(panelMisc._panel);
	$(".checkboxArea>input[type='checkbox']", panelMisc._panel).change(function(){
		var curUserData = crushFTP.storage("currentUserInherited");
		if(!$(this).is(":checked"))
		{
			curUserData = {user: crushFTP.storage("currentUsersLowerLevelsData")};
			$(this).closest("fieldset").addClass("inheritSet");
		}
		else
			$(this).closest("fieldset").removeClass("inheritSet");
		if(!$(this).closest("fieldset").hasClass("notInheritable"))
			panelMisc.bindData(curUserData, false, $(this).closest("fieldset"));
	});

	// Setup POSIX
	var setupPOSIX = $("#setupPOSIX", panelMisc._panel).unbind("click").click(function(){
		//User name entry
		function enterOwner(callback)
		{
			var input = $("#default_owner_command", panelMisc._panel);
			var owner = $.trim(input.val());
			if(owner.length == 0) owner = "www";
			jPrompt("Enter OS X user name : ", owner, "Default 'user' to set owner to : ", function(value){
				if(value != null)
				{
					input.val($.trim(value));
					if(callback)
						callback();
				}
			});
		}

		//Group name entry
		function enterGroup(callback)
		{
			var input = $("#default_group_command", panelMisc._panel);
			var group = $.trim(input.val());
			if(group.length == 0) group = "staff";
			jPrompt("Enter OS X group name : ", group, "Default 'group' to set group to : ", function(value){
				if(value != null)
				{
					input.val($.trim(value));
					if(callback)
						callback();
				}
			});
		}

		//Permissions entry
		function enterPermissions(callback)
		{
			var input = $("#default_privs_command, #default_folder_privs_command", panelMisc._panel);
			var perm = $.trim(input.val());
			if(perm.length == 0) perm = "777";
			jPrompt("Enter OS X group name : ", perm, "Default permissions to set file to : ", function(value){
				if(value != null)
				{
					input.val($.trim(value));
					if(callback)
						callback();
				}
			});
		}

		enterOwner(function(){
			panelMisc._panel.trigger("changed", [setupPOSIX]);
			enterGroup(function(){
				enterPermissions();
			});
		});
		return false;
	});

	// Add file name filter
	$("a#addFileFilter", panelMisc._panel).click(function(){
		jPrompt("Choose One : ", "", "Stop Options", function(value){
			if(value != null)
			{
				var filterType = value;
				jPrompt("Please enter the text : ", "", "CrustFTP Filters", function(value){
					if(value != null)
					{
						var file_filter = $("textarea#file_filter", panelMisc._panel);
						file_filter.val(file_filter.val() + ":" + filterType + ":" + value  +";\n");
						panelMisc._panel.trigger("changed", [file_filter]);
					}
				});
			}
		}, ["LS|(Listing) Starts With",
			"LC|(Listing) Contains",
			"LE|(Listing) Ends With",
			"RS|(Rename) Starts With",
			"RC|(Rename) Contains",
			"RE|(Rename) Ends With",
			"US|(Upload) Starts With",
			"UC|(Upload) Contains",
			"UE|(Upload) Ends With",
			"DS|(Download) Starts With",
			"DC|(Download) Contains",
			"DE|(Download) Ends With",
			"XS|(Delete) Starts With",
			"XC|(Delete) Contains",
			"XE|(Delete) Ends With"]);
		return false;
	});

	//Extra text reference events
	var extraTextReference = $("#extraTextReference", panelMisc._panel);
	extraTextReference.bind("dblclick", function(evt){
        if(evt.target && $(evt.target).is("li")){
            $("a#editTextRef", panelMisc._panel).trigger('click');
            return false;
        }
    });
	//Event to add extra text ref
	var addTextRef = $("a#addTextRef", panelMisc._panel).click(function(evt, control){
		var key =  "";
		var val = "";
		if(control && control.length>0 && control.attr("key"))
		{
			key = control.attr("key");
			val = control.data("_value");
		}
		jPrompt("Please enter the variable name : ", key, "Variable Name", function(value){
			key = value;
			if(key != null)
			{
				key = crushFTP.methods.htmlEncode(key);
				jPrompt("Please enter the variable value :", val, "Variable Value", function(value){
					val = value;
					if(val != null)
					{
						if(control) // If edit mode
						{
							var newItem = $("<li class='ui-widget-content' key='"+key+"'>x_"+ crushFTP.methods.textEncode(key) + " : " + crushFTP.methods.textEncode(val) +"</li>");
							newItem.data("_value", val);

							crushFTP.UI.addItem(extraTextReference
								, newItem
								, false, function(newControl){
								control.replaceWith(newControl); // Append to list and replace selected with new item
							});
						}
						else // If add mode
						{
							var newItem = $("<li class='ui-widget-content' key='"+key+"'>x_"+ crushFTP.methods.textEncode(key) + " : " + crushFTP.methods.textEncode(val) +"</li>");
							newItem.data("_value", val);

							crushFTP.UI.addItem(extraTextReference
								, newItem);
						}
						panelMisc._panel.trigger("changed", [extraTextReference]);
					}
				});
			}
		});
		return false;
	});

	//Event to edit extra text ref
	$("a#editTextRef", panelMisc._panel).click(function(){
		var selected = extraTextReference.find("li.ui-selected");
		if(selected && selected.length > 0)
		{
			$("a#addTextRef", panelMisc._panel).trigger("click", [selected]);
		}
		return false;
	});

	//Event to remove extra text ref
	var removeTextRef = $("a#removeTextRef", panelMisc._panel).click(function(){
		var selected = extraTextReference.find("li.ui-selected");
		if(selected && selected.length > 0)
		{
			crushFTP.UI.removeItem(extraTextReference);
			panelMisc._panel.trigger("changed", [extraTextReference]);
		}
		return false;
	});
}

panelMisc.generateXML = function()
{
	var xml = "";

	//General items
	panelMisc._panel.find("td.checkboxArea").not(".specialProperty").find("input:checked").each(function(){
		var formPanel = $(this).closest("td").next();
		xml += "\r\n" + userManager.data.buildXMLToSubmitForm(formPanel);
	});

	if(panelMisc._panel.find("#extraTextReferencesCheck").find("input:checked").length>0)
	{
		$("#extraTextReference", panelMisc._panel).find("li").each(function(){
			xml += "\r\n<x_" + $(this).attr("key") + ">" + crushFTP.methods.htmlEncode($(this).data("_value")) + "</x_" + $(this).attr("key") + ">";
		});
	}
	function getServerTime(){
		var params = {
			command:"getServerItem",
			key:"server_info/current_datetime_ddmmyyhhmmss",
			c2f: crushFTP.getCrushAuth()
		}
		var time;
		var obj = {
            type: crushFTP.defaultRequestType
            , url: crushFTP.ajaxCallURL
            , data: params
            , async : false
            , success: function(msg){
            	time = $(msg).find("response_status").text() || "";
            }
        }
		$.ajax(obj);
		return time;
	}
	if(panelMisc.user && panelMisc.user.created_by_username)
	{
		var username = panelMisc.user.created_by_username;
		var email = panelMisc.user.created_by_email || "";
		var time = panelMisc.user.created_time || getServerTime();
		var password_history = panelMisc.user.password_history || "";
		if(!userManager.methods.seperateValueAndInheritValue(username).inherit)
			xml +="\r\n<created_by_username>"+username+"</created_by_username>";
		if(!userManager.methods.seperateValueAndInheritValue(email).inherit)
			xml +="\r\n<created_by_email>"+email+"</created_by_email>";
		if(!userManager.methods.seperateValueAndInheritValue(time).inherit)
			xml +="\r\n<created_time>"+time+"</created_time>";
		if(!userManager.methods.seperateValueAndInheritValue(password_history).inherit)
			xml +="\r\n<password_history>"+password_history+"</password_history>";
	}
	else
	{
		var username = $(document).data("username");
		var email = userManager.currentUserEmail || "";
		var time = getServerTime();
		var password_history = panelMisc.user && panelMisc.user.password_history || "";
		xml +="\r\n<created_by_username>"+username+"</created_by_username>";
		xml +="\r\n<created_by_email>"+email+"</created_by_email>";
		xml +="\r\n<created_time>"+time+"</created_time>";
		if(!userManager.methods.seperateValueAndInheritValue(password_history).inherit)
			xml +="\r\n<password_history>"+password_history+"</password_history>";
	}
	return xml;
}