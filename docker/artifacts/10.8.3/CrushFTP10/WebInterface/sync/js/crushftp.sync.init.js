/*!
* CrushFTP Web GUI Initial events
*
* http://crushFTP.com/
*
* Copyright @ CrushFTP
*
* Date: Thu, Aug 11 2011
*
* Author: Vipul Limbachiya
*
* http://vipullimbachiya.com
*/

$(document).ready(function(){
	crushSync.isPopupWindow = getParameterByName("popup") == "true";
	if(crushSync.isPopupWindow)
		window.parent.resetSyncPopupTitle();
	$(".tabs").tabs();
	crushFTP.UI.initLoadingIndicator();
	crushFTP.userLogin.bindUserName(function (response, username) {
		crushFTP.UI.showLoadingIndicator({});
		$("#crushSync").form();
		css_browser_selector(navigator.userAgent);
		$(".button").button();
		if (response == "failure") {
			window.location = "/WebInterface/login.html?link=/WebInterface/sync/index.html";
		} else {
			crushFTP.UI.hideLoadingIndicator();
			jPrompt(localizationValue("syncManagerEnterCrushSyncPasswordText", "Enter CrushSync Admin password :"), "", localizationValue("syncManagerEnterPasswordTitleText", "Password"), function(value){
				if(value)
				{
					value = $.trim(value);
					crushSync.syncPassword = value;
					crushSync.methods.initGUI();
				}
				else
				{
					var wd = window || document;
					wd.location.reload(true);
					return false;
				}
			}, false, false, {passwordInput : true});
		}
	});
});

function getParameterByName(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function doLogout()
{
	$.ajax({type: "POST",url: "/WebInterface/function/",data: {command: "logout",random: Math.random(),c2f:crushFTP.getCrushAuth()},
		error: function (XMLHttpRequest, textStatus, errorThrown)
		{
			$.cookie("currentAuth", "", {path: '/',expires: -1});
			document.location = "/WebInterface/login.html?link=/WebInterface/sync/index.html";
		},
		success: function (msg)
		{
			$.cookie("currentAuth", "", {path: '/',expires: -1});
			document.location = "/WebInterface/login.html?link=/WebInterface/sync/index.html";
		}
	});
	return false;
}

//Finds average numeric value in an array
Array.prototype.average = function() {
	var av = 0;
	var cnt = 0;
	var len = this.length;
	for (var i = 0; i < len; i++) {
		var e = +this[i];
		if(!e && this[i] !== 0 && this[i] !== '0') e--;
		if (this[i] == e) {av += e; cnt++;}
	}
	return av/cnt;
}