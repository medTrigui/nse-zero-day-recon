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
function applyLocalizations(section, custLocalization)
{
	custLocalization = custLocalization || localizations;
	var toApply = custLocalization;
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
					if(key.toLowerCase().indexOf("input")>=0)
					{
						$("."+key).val(val);
					}
					else if(key.toLowerCase().indexOf("byclass")>=0|| key.toLowerCase().indexOf("multiple")>=0)
					{
						$("."+key).html(val);
					}
					else
					{
						$("." + key).html(val);
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

function localizationValue(key, defaultVal)
{
	if(typeof localizations[key] != "undefined")
		return localizations[key].toString();
	else
	{

		defaultVal = defaultVal || "";
		return defaultVal;
	}
}

$(document).ready(function(){
	setTimeout(function(){
		applyLocalizations();
	}, 100);
});