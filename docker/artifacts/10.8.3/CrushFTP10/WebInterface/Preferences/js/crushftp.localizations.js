/*!
* CrushFTP Web GUI localizations
*
* http://crushFTP.com/
*
* Copyright @ CrushFTP
*
* Date: Wed, Feb 2 2011
*
* Author: Vipul Limbachiya
*
* http://vipullimbachiya.com
*/

var localizations = {};

// Navigation items
localizations.navigationItem = {};
localizations.panels = {};
localizations.navigationItem.IPServers = "IP / Servers";
localizations.navigationItem.GeneralSettings = "General Settings";
localizations.navigationItem.WebInterface = "WebInterface";
localizations.navigationItem.Restrictions = "Restrictions";
localizations.navigationItem.Banning = "Banning";
localizations.navigationItem.Logging = "Logging";
localizations.navigationItem.Encryption = "Encryption";
localizations.navigationItem.Alerts = "Alerts";
localizations.navigationItem.FolderMonitor = "Folder Monitor";
localizations.navigationItem.Tunnels = "Tunnels";
localizations.navigationItem.UserConfig = "User Config";
localizations.navigationItem.SearchConfig = "Search Config";
localizations.navigationItem.SyncConfig = "Sync Config";
localizations.navigationItem.StatsConfig = "Stats Config";
localizations.navigationItem.Preview = "Preview";
localizations.navigationItem.Misc = "Misc";
localizations.navigationItem.Plugins = "Plugins";

function applyLocalizations(section, custLocalization)
{
	custLocalization = custLocalization || localizations;
	if(section)
	{
		var toApply = custLocalization[section];
		if(toApply)
		{
			for(var i in toApply)
			{
				if(i)
				{
					var key = i.toString();
					var val = toApply[i].toString();
					if(key && (val || val == ""))
					{
						try{
						if(key.toLowerCase().indexOf("button")>=0 || key.toLowerCase().indexOf("input")>=0)
						{
							$("."+key).val(val);
						}
						else if(key.toLowerCase().indexOf("byclass")>=0|| key.toLowerCase().indexOf("multiple")>=0)
						{
							$("."+key).html(val);
						}
						else
						{
							$("." + key + "." + section).html(val);
						}
						}catch(ex){
						}
					}
				}
			}
		}
		else
		{
			return;
		}
	}
	else
	{
		var toApply = custLocalization;
		for(var i in toApply)
		{
			if(i)
			{
				var key = i.toString();
				applyLocalizations(key);
			}
		}
	}
}

$(document).ready(function(){
	applyLocalizations();
});