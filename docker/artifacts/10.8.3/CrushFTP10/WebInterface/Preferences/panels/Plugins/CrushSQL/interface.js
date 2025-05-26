/****************************
CrushFTP GUI Plugin custom js
*****************************/
/* Do not change these lines */
var pluginCrushSQL = {};
pluginCrushSQL.localization = {};
/****************************/

// Plugin details
var pluginName = "CrushSQL";
var _plugin = $("#pnlPlugin" + pluginName);
var pathList = $("#pathList", _plugin);

// Localizations
pluginCrushSQL.localization = {
	lblEnabledText : "Enabled",
	lblDebugText : "Debug",
	lblVersionText : "Version: ",
	lblHelpTabText : "Help",
	lblSetupTabText : "Setup",
	lblAdvancedOptionsTabText : "Advanced Options",
	pnlHelpInstructionsText : " <b>Instructions</b><br> CrushFTP will need to be able to load the java driver for whatever SQL type you are using.<br> <br> You can get the MySQL driver here: http://dev.mysql.com/downloads/connector/j/5.0.html<br> <br> Then use the browse button above to pick the .jar file. If you move the folder where this .jar file is at, you will need to pick it again. (MySQL: mysql-connector-java-5.0.4-bin.jar)<br> There is nothing that limits this plugin to MySQL, its just the database I have provided the table creation scripts for. The tables are simple, and you can create them by hand as well. Just be sure to match up the column names correctly, as well as the table names.<br> <br> <b>Setup</b><br> <b>1)</b> You will be using these tables (The table scripts are included below):<br> users, directories, events, etc.<br> <b>2)</b> Create a database for CrushFTP...name it something like 'crushftp'.<br> <b>3)</b> Use the table scripts to generate the table structures in the 'crushftp' database.<br> <b>4)</b> Change the settings above to match the SQL driver you are using. Also set the correct IP to the server, the correct database name, and a valid user / pass.<br> <b>5)</b> Create a record in the users table. Give it a username and password...the rest can be left at their defaults.<br> <b>6)</b> Create a record in the directories table. The directory's ID must link to a user's ID. For example: ID=1,dirName=MyApps, dirFTPPath=/, dirLocalPath=/Applications/, privDownload=Y, privView=Y (leave the rest at their defaults.)<br> dirName is the display name CrushFTP will display this item as.<br> dirFTPPath is the FTP path at which this item should appear. (usually '/')<br> dirLocalPath is the local directory path this item links to. It MUST end and start with '/'. If this is a path on windows you should use forward slashes ex:'/C:/Program Files/'. If this is MacOS X '/Applications/'.<br> <b>7)</b> Go login with an FTP client and test!<br> <br> If you do not know what to enter in a field, look at a user.xml file for a user that was made in the CrushFTP User Manager. The tables basically represent the xml file.<br> <br> <b>Microsoft SQL Server Setup Instructions</b><br> 1)The Microsoft SQL Server driver is sqljdbc.jar, and can be downloaded here: http://msdn2.microsoft.com/en-us/data/aa937724.aspx If the sqljdbc.jar is loaded into c:\CrushFTP, then the Database Driver File input box would hold: 'C:\CrushFTP\sqljdbc.jar'.<br> 2)The class name has changed between SQL Server 2000 JDBC driver and the SQL Server 2005 JDBC driver. The class name for the SQL Server 2000 JDBC driver is: 'com.microsoft.jdbc.sqlserver.SQLServerDriver'. The SQL Server 2005 JDBC driver class name is 'com.microsoft.sqlserver.jdbc.SQLServerDriver'. Note the change from 'microsoft.jdbc.sqlserver' to 'microsoft.sqlserver.jdbc'.<br> 3)The URL prefix has also changed between the SQL Server 2000 JDBC driver and the SQL Server 2005 JDBC driver. The SQL Server JDBC driver uses a URL prefix of 'jdbc:microsoft:sqlserver://', while SQL Server 2005 JDBC driver uses a URL prefix of: 'jdbc:sqlserver://'. Note the removal of 'microsoft' from the URL path.<br> <br> --Support support@crushftp.com<br> <br> The SQL scripts below are for MySQL. (You will have to tweak them slightly for MS SQL.) They will generate the tables needed by this plugin. You can add additional columns to the users table, just look in the user.xml file for the proper column names. (CMD-C, or CTR-C will copy the text if you select it even though there is no right click or 'Edit' menu.)<br> <br> # Database: crushftp<br> # ************************************************************<br> # Dump of table directories<br> # ------------------------------------------------------------<br> <br> CREATE TABLE `users` (<br> `id` int(11) NOT NULL auto_increment,<br> `userName` varchar(50) NOT NULL default 'anonymous',<br> `userPass` varchar(50) NOT NULL default '',<br> `maxIdleTime` int(11) NOT NULL default '10',<br> `expireDate` datetime default NULL,<br> `maxSimultaneousLogins` int(11) NOT NULL default '0',<br> `maxLoginsPerIP` int(11) NOT NULL default '0',<br> `canRequestFilesAsZip` char(1) NOT NULL default 'Y',<br> `requireEncryption` char(1) NOT NULL default 'N',<br> PRIMARY KEY (`id`)<br> ) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;<br> <br> <br> CREATE TABLE `directories` (<br> `id` int(11) NOT NULL default '0',<br> `dirName` varchar(255) NOT NULL default 'dirName',<br> `dirFTPPath` varchar(255) NOT NULL default '/',<br> `dirLocalPath` varchar(255) NOT NULL default '/',<br> `privDownload` char(1) NOT NULL default 'Y',<br> `privUpload` char(1) NOT NULL default 'N',<br> `privView` char(1) NOT NULL default 'Y',<br> `privDelete` char(1) NOT NULL default 'N',<br> `privDeleteDir` char(1) NOT NULL default 'N',<br> `privMakeDir` char(1) NOT NULL default 'N',<br> `privRename` char(1) NOT NULL default 'N',<br> `privResume` char(1) NOT NULL default 'Y',<br> `privRealQuota` char(1) NOT NULL default 'Y',<br> `quotaBytes` varchar(255) NOT NULL default ''<br> ) ENGINE=MyISAM DEFAULT CHARSET=latin1;<br> <br> <br> # Dump of table events<br> # ------------------------------------------------------------<br> <br> CREATE TABLE `events` (<br> `userid` int(11) NOT NULL default '0',<br> `name` varchar(255) NOT NULL default '',<br> `command` varchar(255) NOT NULL default '',<br> `event_dir_data` varchar(255) NOT NULL default '',<br> `event_if_list` varchar(255) NOT NULL default '',<br> `event_action_list` varchar(255) NOT NULL default '',<br> `event_user_action_list` varchar(255) NOT NULL default '',<br> `event_after_list` varchar(255) NOT NULL default '',<br> `event_plugin_list` varchar(255) NOT NULL default '',<br> `from` varchar(255) NOT NULL default '',<br> `to` varchar(255) NOT NULL default '',<br> `cc` varchar(255) NOT NULL default '',<br> `bcc` varchar(255) NOT NULL default '',<br> `subject` varchar(255) NOT NULL default '',<br> `body` varchar(255) NOT NULL default '',<br> `event_always_cb` varchar(10) NOT NULL default 'false',<br> `event_after_cb` varchar(10) NOT NULL default 'false',<br> `event_now_cb` varchar(10) NOT NULL default 'false',<br> `event_if_cb` varchar(10) NOT NULL default 'false'<br> ) ENGINE=MyISAM DEFAULT CHARSET=latin1;<br> <br> <br> # Dump of table ip_restrictions<br> # ------------------------------------------------------------<br> <br> CREATE TABLE `ip_restrictions` (<br> `userid` int(11) NOT NULL default '0',<br> `start_ip` varchar(255) default NULL,<br> `type` varchar(1) default NULL,<br> `stop_ip` varchar(255) default NULL<br> ) ENGINE=MyISAM DEFAULT CHARSET=latin1;<br> <br> <br> # Dump of table users<br> # ------------------------------------------------------------<br> <br> # Dump of table domain_root_list<br> # ------------------------------------------------------------<br> <br> CREATE TABLE `domain_root_list` (<br> `userid` int(11) NOT NULL default '0',<br> `domain` varchar(255) default NULL,<br> `path` varchar(255) default NULL<br> ) ENGINE=MyISAM DEFAULT CHARSET=latin1;<br> <br> <br> # Dump of table web_buttons<br> # ------------------------------------------------------------<br> <br> CREATE TABLE `web_buttons` (<br> `userid` int(11) NOT NULL default '0',<br> `sort_order` int(11) NOT NULL default '0',<br> `key` varchar(255) default NULL,<br> `value` varchar(255) default NULL<br> ) ENGINE=MyISAM DEFAULT CHARSET=latin1;<br> <br> <br> # Dump of table web_customizations<br> # ------------------------------------------------------------<br> <br> CREATE TABLE `web_customizations` (<br> `userid` int(11) NOT NULL default '0',<br> `key` varchar(255) default NULL,<br> `value` varchar(255) default NULL<br> ) ENGINE=MyISAM DEFAULT CHARSET=latin1;<br>  ",
	lblDataBaseDriverFileText : "Database Driver File: ",
	btnBrowseText : "Browse",
	lblDatabaseDriverClassText : "Database Driver Class: ",
	lblDatabaseURLText : "Database URL: ",
	lblDatabaseUserText : "Database User: ",
	lblDatabasePasswordText : "Pass: ",
	lblDateFormatText : "Date Format: ",
	lblServerItemText : "Server Item: ",
	lblTemplateUsernameText : "Template Username: ",
	lblServerItemInstructionsText : " You can specify which server item will use this plugin. Example : lookup_21, or lookup_8080. (Leave blank for all.) ",
	lblUserLookupQueryText : "User Lookup Query: ",
	lblUserQuotaUpdateQueryText : "User Quota Update Query: ",
	btnTestSettingsText : "Test Settings",
	lblScanAccountEveryXMinutesText : "Scan for accounts every x minutes: ",
	lblCreateSQLDirectoriesText : "Create SQL directories if they don't exist? ",
	lblCreateAsNeededText : "Create as needed? ",
	lblQueryAllText : "Query All: ",
	lblQueryOneText : "Query One: ",
	lblDeleteExpiredAccountsText : "Delete expired accounts? ",
	lblQueryText : "Query: ",
	lblDeleteExpiredAccountsFileSystemText : "Delete expired accounts file system? ",
	lblMoveExpiredAccountsToArchiveText : "Move expired accounts file system to Archive? ",
	lblPathLocationToMoveFilesToText : "Path location to move files to : "
};

// Assign localizations
localizations.panels["Plugins"][pluginName] = $.extend(pluginCrushSQL.localization, localizations.panels["Plugins"][pluginName]);

// Interface methods
pluginCrushSQL.init = function(pluginID, returnXML){
	pluginCrushSQL.returnXML = returnXML;
	applyLocalizations(pluginName, localizations.panels["Plugins"]);
	$("#setupTabLink", _plugin).trigger("click");
	pluginCrushSQL.bindData(0, pluginID);
}

pluginCrushSQL.bindData = function(index, pluginID)
{
	index = index || 0;
	var pluginPrefs = [];
	pluginCrushSQL.showServerList();
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
		pluginCrushSQL.bindPluginDetails(curPlugin);
	}
	pluginCrushSQL.loadedSubItem = index;
	pluginCrushSQL.bindEvents();
}

pluginCrushSQL.bindEvents = function()
{
	if(this.eventAdded)return;
	_plugin.find("input, select, textarea").bind("change", function(){
		panelPlugins.itemsChanged(true, pluginCrushSQL.returnXML, pluginName);
	});

	_plugin.find("input[type='text'], textarea").bind("textchange", function(){
		panelPlugins.itemsChanged(true, pluginCrushSQL.returnXML, pluginName);
	});

	$("a.serverFilePickButton", _plugin).each(function(){
		$(this).unbind("click").click(function(){
			var curElem = $(this);
            var rel = curElem.attr("rel");
            var pickingFor = curElem.parent().parent().parent().find("label[for='"+rel+"']").text() || "";
            pickingFor = $.trim($.trim(pickingFor).replace(":", ""));
			curElem.crushFtpLocalFileBrowserPopup({
				type : curElem.attr("PickType") || 'dir',
				pickingFor: pickingFor,
				file_mode : curElem.attr("FileMode") || 'server',
				existingVal : $("#" + curElem.attr("rel"), _panel).val(),
				callback : function(selectedPath){
					$("#" + curElem.attr("rel"), _panel).val(selectedPath).trigger("change");
				}
			});
			return false;
		});
	});

	$("a#testSettings", _plugin).click(function(){
		var link = $(this);
		if(link.attr("disabled"))return false;
		panelPlugins.pluginMethodCallSaveCallback = function(flag){
			if(flag)
			{
				var title = "";
				var obj = {
					command : "pluginMethodCall",
					method : link.attr("id"),
					pluginName : "CrushSQL",
					pluginSubItem : pluginCrushSQL.loadedSubItem == 0 ? "" : _plugin.attr("subPluginName")
				}
				if(obj.method == "testSettings")
				{
					title = "Testing Settings : ";
				}
				link.block({
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
					link.unblock().removeAttr("disabled");
					crushFTP.UI.growl(title, DOMPurify.sanitize(decodeURIComponent($(msg).html())), false, false);
				});
			}
		};
		if(pluginPlaceHolder.data("hasChanged"))
			$("#saveContent", _panel).trigger("click");
		else
		{
			panelPlugins.pluginMethodCallSaveCallback(true);
			panelPlugins.pluginMethodCallSaveCallback = false;
		}
		return false;
	});

	this.eventAdded = true;
}

pluginCrushSQL.bindPluginDetails = function(controlData)
{
	var inputs = _plugin.find("input.ignoreBind,select.ignoreBind,textarea.ignoreBind").removeClass("ignoreBind");
	bindValuesFromXML(_plugin, controlData);
	if(controlData.subItem && controlData.subItem.length>0)
		_plugin.attr("subPluginName", controlData.subItem[0].text || "");
	inputs.addClass("ignoreBind");
}

pluginCrushSQL.showServerList = function()
{
	if(!this.serverListShown)
	{
		var service = common;
		if(pluginCrushSQL.returnXML)
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

pluginCrushSQL.saveContent = function(saveByIndex, cloneName, removeByIndex, callback, noGrowl)
{
	removeByIndex = removeByIndex || 0;
	if(pluginPlaceHolder.data("hasChanged") || removeByIndex>0 || (saveByIndex>0 && cloneName) || pluginCrushSQL.returnXML)
	{
		if(!pluginCrushSQL.returnXML)
			crushFTP.UI.showIndicator(false, false, "Please wait..");

		var xmlString = [];
		var container = _plugin;
		if(removeByIndex == 0)
		{
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

		if(pluginCrushSQL.returnXML)
			return formSubItem;

		var action = removeByIndex == 0 ? "change" : "remove";
		var index = window.currentPluginIndex;
		var subItemIndex = removeByIndex == 0 ? saveByIndex || this.subItem : removeByIndex;
		subItemIndex = subItemIndex || 0;
		var removeChangeFlag = (saveByIndex>0 && cloneName);
		panelPlugins.savePluginContentProcess(action, formSubItem, index, subItemIndex, removeChangeFlag, callback, noGrowl);
	}
	else
	{
		if(!noGrowl)
			crushFTP.UI.growl("No changes made", "", false, 3000);
		else
			callback(true);
	}
}