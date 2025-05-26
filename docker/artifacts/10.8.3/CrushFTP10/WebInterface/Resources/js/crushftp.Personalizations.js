/*!
* CrushFTP Admin Panel Personalizations based on use
*
* http://crushFTP.com/
*
* Copyright 2013, CrushFTP
*
* Date: Wed, Oct 23 2013
*
* Author: Vipul Limbachiya
*
* http://vipullimbachiya.com
*/

$.crushFtpPersonalization = {
	currentSettings : {},
	init : function(){
		var _this = this;
		if(typeof $.jStorage != "undefined")
		{
			_this.isInitiated = true;
			var defaultSetting = {
				prefs : {
					panels : {
						IPServers : {loadCount : 0, lastLoaded : false},
						GeneralSettings : {loadCount : 0, lastLoaded : false},
						WebInterface : {loadCount : 0, lastLoaded : false},
						EmailTemplates : {loadCount : 0, lastLoaded : false},
						Restrictions : {loadCount : 0, lastLoaded : false},
						Banning : {loadCount : 0, lastLoaded : false},
						Logging : {loadCount : 0, lastLoaded : false},
						Encryption : {loadCount : 0, lastLoaded : false},
						Alerts : {loadCount : 0, lastLoaded : false},
						FolderMonitor : {loadCount : 0, lastLoaded : false},
						Tunnels : {loadCount : 0, lastLoaded : false},
						UserConfig : {loadCount : 0, lastLoaded : false},
						SearchConfig : {loadCount : 0, lastLoaded : false},
						SyncConfig : {loadCount : 0, lastLoaded : false},
						StatsConfig : {loadCount : 0, lastLoaded : false},
						Preview : {loadCount : 0, lastLoaded : false},
						Misc : {loadCount : 0, lastLoaded : false},
						Plugins : {loadCount : 0, lastLoaded : false}
					},
					plugins : {
						AutoUnzip : {loadCount : 0, lastLoaded : false},
						ContentBlocker : {loadCount : 0, lastLoaded : false},
						CrushLDAPGroup : {loadCount : 0, lastLoaded : false},
						CrushNoIP : {loadCount : 0, lastLoaded : false},
						CrushSQL : {loadCount : 0, lastLoaded : false},
						CrushTask : {loadCount : 0, lastLoaded : false},
						DuplicateBlocker : {loadCount : 0, lastLoaded : false},
						FileEncryptDecrypt : {loadCount : 0, lastLoaded : false},
						HomeDirectory : {loadCount : 0, lastLoaded : false},
						LaunchProcess : {loadCount : 0, lastLoaded : false},
						MagicDirectory : {loadCount : 0, lastLoaded : false},
						PostBack : {loadCount : 0, lastLoaded : false},
						PreferencesController : {loadCount : 0, lastLoaded : false},
						Radius : {loadCount : 0, lastLoaded : false},
						SharedLogin : {loadCount : 0, lastLoaded : false},
						UniSSO : {loadCount : 0, lastLoaded : false},
						SAMLSSO : {loadCount : 0, lastLoaded : false},
						WebApplication : {loadCount : 0, lastLoaded : false}
					}
				},
				userManager : {
					panels : {
						Setup : {loadCount : 0, lastLoaded : false},
						Settings : {loadCount : 0, lastLoaded : false},
						Restrictions : {loadCount : 0, lastLoaded : false},
						Admin : {loadCount : 0, lastLoaded : false},
						Events : {loadCount : 0, lastLoaded : false},
						WebInterface : {loadCount : 0, lastLoaded : false},
						Tunnels : {loadCount : 0, lastLoaded : false},
						Misc : {loadCount : 0, lastLoaded : false}
					},
					users : {
						edited : {},
						viewed : {}
					}
				}
			};
			_this.currentSettings = $.jStorage.get("crushFtpPersonalization");
			if(_this.currentSettings == null)
			{
				$.jStorage.set("crushFtpPersonalization", defaultSetting);
				_this.currentSettings = defaultSetting;
			}
		}
	},
	updateItem : function(panel, section, type, user){
		var _this = this;
		if(!_this.isInitiated)
			_this.init();
		if(panel && section && type)
		{
			var _panel = _this.currentSettings[panel];
			if(!_panel)
				_panel = _this.currentSettings[panel] = {};
			var _section = _panel[section];
			if(!_section)
				_section = _panel[section] = {};
			if(!user)
			{
				var _type = _section[type];
				if(!_type)
					_type = _section[type] = {};
				var count = _type.loadCount || 0;
				count++;
				var last = _type.lastLoaded || new Date();
				_type = _section[type] = {
					loadCount : count,
					lastLoaded : last
				}
			}
			else
			{
				var _type = _section[type];
				if(!_type)
					_type = _section[type] = {};

				var _user = _type[user];
				if(!_user)
					_user = _type[user] = {};

				var count = _user.loadCount || 0;
				count++;
				var last = _user.lastLoaded || new Date();
				_user = _type[user] = {
					loadCount : count,
					lastLoaded : last
				}
			}
			_this.currentSettings[panel] = _panel;
			$.jStorage.set("crushFtpPersonalization", _this.currentSettings);
		}
	},
	deleteItem : function(panel, section, type, user){
		var _this = this;
		if(!_this.isInitiated)
			_this.init();
		try{
			if(panel && section && type)
			{
				var _panel = _this.currentSettings[panel];
				if(!_panel)
					_panel = _this.currentSettings[panel] = {};
				var _section = _panel[section];
				if(!_section)
					_section = _panel[section] = {};

				var _type = _section[type];
				if(!_type)
					_type = _section[type] = {};

				var _user = _type[user];
				if(_user)
					delete _type[user];

				_this.currentSettings[panel] = _panel;
				$.jStorage.set("crushFtpPersonalization", _this.currentSettings);
			}
		}
		catch(ex){}
	},
	getPersonalizations : function(panel){
		var _this = this;
		if(!_this.isInitiated)
			_this.init();
		if(panel)
			return _this.currentSettings[panel];
		else
			return _this.currentSettings;
	}
};