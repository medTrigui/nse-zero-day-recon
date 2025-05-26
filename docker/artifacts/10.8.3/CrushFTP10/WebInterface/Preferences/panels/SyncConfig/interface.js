/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelSyncConfig = {};
panelSyncConfig.localization = {};
/****************************/

// Panel details
var panelName = "SyncConfig";
var _panel = $("#pnl" + panelName);

panelSyncConfig.syncConfigItems = [
	"syncs_debug",
	"syncs_get_file",
	"syncs_get_file_updates",
	"syncs_get_all_files",
	"syncs_update_file",
	"syncs_rename_file",
	"syncs_delete_file",
	"syncs_insert_file",
	"syncs_insert_journal",
	"syncs_delete_journal",
	"syncs_delete_journal_expired",
	"syncs_get_journal"
];

// Localizations
panelSyncConfig.localization = {
	headerText : " ",
	lblSyncDatabaseTabText : "Sync Database",
	lblScriptMySQLTabText : "Script MySQL",
	btnBrowseText : "Browse",
	btnTestDBText : "Test DB",
	btnResetText : "Reset To Default",
	btnCancelText : "Cancel",
	btnOKText : "Save",
	btnExecuteQuery : "Execute Query",
	btnClearQuerys : "Clear",
	txtQueryTitle : "SQL Query:",
	txtQueryResponseTitle : "SQL Response:",
	txtReturnTitle : "Return Limit:"
};

// Assign localizations
localizations.panels[panelName] = $.extend(panelSyncConfig.localization, localizations.panels[panelName]);

// Interface methods
panelSyncConfig.init = function(){
	applyLocalizations(panelName, localizations.panels);
	crushFTP.methods.setPageTitle(panelSyncConfig.localization.Header, true);
	panelSyncConfig.bindData();
	panelSyncConfig.bindEvents();
	$("#browsePopupBtn", _panel).hide();
    setupPrefsReplicationSave(_panel, panelName);
}

panelSyncConfig.bindData = function()
{
	var prefs = common.data.ServerPrefs();
	bindValuesFromXML(_panel, prefs);
	if(prefs)
	{
		var nameList = $("#SCsqlItems", _panel);
		var selectedIndex = nameList.find("li.ui-widget-header").index();
		nameList.empty();

		var arrayItems = [];
		for(var i in prefs)
		{
			if(i.indexOf("syncs_db_")==0 || panelSyncConfig.syncConfigItems.has(i))
			{
				arrayItems.push(
					{
						key : i,
						text : prefs[i][0].text || ""
					}
				);
			}
		}

		arrayItems = arrayItems.sort(crushFTP.methods.sortObjectsRefKey);
		for(var i=0;i<arrayItems.length;i++)
		{
			var newControl = $("<li class='ui-widget-content' name='"+crushFTP.methods.htmlEncode(arrayItems[i].key)+"'>"+crushFTP.methods.htmlEncode(arrayItems[i].key)+"</li>");
			nameList.append(newControl);
			newControl.data("controlData", arrayItems[i]);
		}

		if(selectedIndex>=0)
		{
			selectedIndex+=1;
			var selected = nameList.find(":nth-child("+selectedIndex+")").addClass("ui-widget-header ui-selected");
			panelSyncConfig.bindFormDetails(selected);
		}
	}
}

panelSyncConfig.bindEvents = function()
{
	var sqlItems = $("#SCsqlItems", _panel);
	sqlItems.selectable({
		selected: function(event, ui) {
			var selected = $(ui.selected);
			function continueLoading()
			{
				selected.parent().find(".ui-widget-header").removeClass("ui-widget-header ui-selected");
				selected.addClass("ui-widget-header ui-selected");
				panelSyncConfig.bindFormDetails(selected);
			}
			if(_panel.find(".hasPendingCall").length>0)
			{
				window.pendingEncryptionCall = function(){
					continueLoading();
				};
				_panel.find(".hasPendingCall").trigger("blur");
			}
			else
			{
				continueLoading();
			}
			return false;
		}
	});

	var formDetailsPanel  = $("#formDetailsPanel", _panel);
	formDetailsPanel.find("input, select, textarea").bind("change", function(){
		if($(this).attr("id") == "syncs_db_pass")
		{
			var item = $("#SCsqlItems", _panel).find("li[name='syncs_db_pass']");
			if(!item || item.length==0)return;
			var data = item.data("controlData");
			if(data)
			{
				data.text = $(this).val();
			}
			item.data("controlData", data);
		}
		else
		{
			var item = sqlItems.find("li.ui-widget-header");
			if(!item || item.length==0)return;
			var data = item.data("controlData");
			if(data)
			{
				var isBool = $(this).attr("type") == "radio" || $(this).attr("type") == "checkbox";
				data.text = isBool ? $(this).is(":checked").toString() : $(this).val();
				if($(this).attr("id") == "type")
				{
					item.text($(this).val());
				}
			}
			item.data("controlData", data);
		}
		itemsChanged(true);
	});

	formDetailsPanel.find("input[type='text'], textarea").bind("textchange", function(){
		var item = sqlItems.find("li.ui-widget-header");
		if(!item || item.length==0)return;
		var data = item.data("controlData");
		if(data)
		{
			var isBool = $(this).attr("type") == "radio" || $(this).attr("type") == "checkbox";
			data.text = isBool ? $(this).is(":checked").toString() : $(this).val();
			if($(this).attr("id") == "type")
			{
				item.text($(this).val());
			}
		}
		item.data("controlData", data);
		itemsChanged(true);
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
					$("#" + curElem.attr("rel"), _panel).val(selectedPath).trigger("change").trigger("textchange");
				}
			});
			return false;
		});
	});

	$("a#testDBSearch", _panel).click(function(){
		var link = $(this);
		if(link.attr("disabled"))return false;
		if(_panel.find(".hasPendingCall").length>0)
		{
			window.pendingEncryptionCall = function(){
				link.trigger("click");
			};
			_panel.find(".hasPendingCall").trigger("blur");
		}
		else
		{
			var obj = {
				command : "testDB",
				db_driver_file : panelSyncConfig.getDataFromKey("syncs_db_driver_file") || "",
				db_driver : panelSyncConfig.getDataFromKey("syncs_db_driver") || "",
				db_url : panelSyncConfig.getDataFromKey("syncs_db_url") || "",
				db_user : panelSyncConfig.getDataFromKey("syncs_db_user") || "",
				db_pass : panelSyncConfig.getDataFromKey("syncs_db_pass") || ""
			};
			$("a#testDBSearch", _panel).block({
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
				$("a#testDBSearch", _panel).unblock().removeAttr("disabled");
				crushFTP.UI.growl("Testing Database", DOMPurify.sanitize(decodeURIComponent($(msg).text())), false, false);
			});
		}
		return false;
	});

	$('a#execute_query', _panel).click(function(){
		var sql_query = jQuery.trim($('textarea#sql_query', _panel).val());
		if(sql_query == ""){
			crushFTP.UI.growl("Error", "Please write a query before you execute it.", true, 3000);
		} else {
			var obj = {
				command : "testQuery",
				db_driver_file : panelSyncConfig.getDataFromKey("syncs_db_driver_file") || "",
				db_driver : panelSyncConfig.getDataFromKey("syncs_db_driver") || "",
				db_url : panelSyncConfig.getDataFromKey("syncs_db_url") || "",
				db_user : panelSyncConfig.getDataFromKey("syncs_db_user") || "",
				db_pass : panelSyncConfig.getDataFromKey("syncs_db_pass") || "",
				sql_limit : $('input#sql_limit', _panel).val() || 1000,
				sql : sql_query
			};
			$("a#execute_query", _panel).block({
				message:  'Executing..',
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
				$("a#execute_query", _panel).unblock().removeAttr("disabled");
				var queryResult = '',
				tableHeadersResult = '',
				tableResultContent = '';
				if($(msg).find("SQL").length > 0){
					queryResult += '<p style="text-align: right">Total rows: '+$(msg).find("SQL_subitem").length+'</p>';
					$(msg).find("SQL_subitem").each(function(indexMain){ var rootIndex = indexMain;
						tableResultContent += '<tr>';
						$(this).children().each(function(index){
							if(rootIndex == 0){
								tableHeadersResult += '<th style="padding: 5px 8px; text-align: left" class="ui-dialog-titlebar ui-widget-header ui-corner-all">'+this.tagName+'</th>';
							}
							tableResultContent += '<td>'+$(this).text()+'</td>';
						});
						tableResultContent += '</tr>';
					});
					queryResult += '<table style="width: 100%" cellpadding="2" cellspasing="2"><thead><tr>'+tableHeadersResult+'</tr></thead><tbody>'+tableResultContent+'</tbody></table>';
				} else {
					queryResult = decodeURIComponent($(msg).text());
				}
				$('#sql_response', _panel).html(queryResult).trigger("create");
			});
		}
		return false;
	});

	$('a#clear_querys', _panel).click(function(){
		$('textarea#sql_query', _panel).val('');
		$('#sql_response', _panel).html('');
		itemsChanged(false);
	});
}

panelSyncConfig.getDataFromKey = function(key)
{
	var data = "";
	var sqlItem = $("#SCsqlItems", _panel).find("li[name='"+key+"']");
	if(sqlItem && sqlItem.length>0)
	{
		var controlData = sqlItem.data("controlData");
		if(controlData && controlData.text)
			data = encodeURIComponent(controlData.text);
		else
			data = "";
	}
	return data;
}

panelSyncConfig.bindFormDetails = function(selected)
{
	if(!selected || selected.length==0)
	{
		return;
	}
	var controlData = selected.data("controlData");
	if(controlData && controlData.key)
	{
		var data = controlData.text;
		var key = controlData.key;
		var txtSCDBAction = $("#txtSCDBAction", _panel).val(data);
		if(key == "syncs_db_driver_file")
		{
			$("#browsePopupBtn", _panel).show();
		}
		else
		{
			$("#browsePopupBtn", _panel).hide();
		}
		if(key == "syncs_db_pass")
		{
			$("#syncs_db_pass", _panel).show().val(data);
			txtSCDBAction.hide();
		}
		else
		{
			$("#syncs_db_pass", _panel).hide().val("");
			txtSCDBAction.show();
		}

		$("#formDetailsPanel", _panel).unblock();

		var keysToBlock = [
			"db_driver_file",
			"search_db_driver_file",
			"syncs_db_driver_file",
			"stats_db_driver_file",
			"logging_db_driver_file"
		];

		if(keysToBlock.indexOf(key)>=0){
			$("#formDetailsPanel", _panel).block({
				message:  'DB driver jar files are no longer dynamically loaded. They must be present in the CrushFTP folder/plugins/lib folder at startup time to be available for usage. if you see a ClassNotFound error, please ensure you have the driver jar files copied to that folder and restart CrushFTP.',
				css: {
					border: 'none',
					padding: '10px 10px',
					width: '60%',
					fontSize: '16px',
					lineHeight:'20px',
					backgroundColor: '#000',
					'-webkit-border-radius': '10px',
					'-moz-border-radius': '10px',
					opacity: .5,
					color: '#fff',
					'text-align':'left'
				},
				overlayCSS: {
					top: '-5px',
					padding: '5px 10px'
				}
			});
		}
	}
}

panelSyncConfig.saveContent = function()
{
	if(placeHolder.data("hasChanged"))
	{
		crushFTP.UI.showIndicator(false, false, "Please wait..");
		var xmlString = [];
		var formAlertsList = $("#SCsqlItems", _panel).find("li");
		if(formAlertsList.length>0)
		{
			xmlString.push('<server_prefs type="properties">');
			formAlertsList.each(function(){
				var data = $(this).data("controlData");
				if(data)
				{
					var text = data.text;
					xmlString.push("<"+$(this).attr("name")+">"+crushFTP.methods.htmlEncode(text)+"</"+$(this).attr("name")+">");
				}
			});
			xmlString.push(panelSyncConfig.buildXMLData(_panel.find("#Syncs")));
			xmlString.push("</server_prefs>");
		}
		else
		{
			xmlString.push('<server_prefs type="properties">');
			xmlString.push(panelSyncConfig.buildXMLData(_panel.find("#Syncs")));
			xmlString.push("</server_prefs>");
		}
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
						panelSyncConfig.bindData();
						crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
						placeHolder.removeData("hasChanged");
					});
				}
				else
				{
					crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
				}
			}
			, panelSyncConfig.saveParams
		);
	}
	else
	{
		crushFTP.UI.growl("No changes made", "", false, 3000);
	}
}

panelSyncConfig.buildXMLData = function(pnl)
{
	pnl = pnl || _panel;
	var xmlString = buildXMLToSubmitForm(pnl);
	return xmlString;
}