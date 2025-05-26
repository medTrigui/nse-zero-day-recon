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
	$("#placeHolder").hide();
	crushFTP.UI.initLoadingIndicator();
	$("#mainServerInstance").unbind().change(function(){
		localStorage.setItem("mainServerInstance", $(this).val());
		window.location = window.location;
	});
	if(crushFTP.methods.queryString("onlyVFS")=="true" && crushFTP.methods.queryString("username") && crushFTP.methods.queryString("username")!="")
	{
		userManager.makeVFSOnly($.trim(crushFTP.methods.queryString("username")));
	}
	var mainServerInstance = localStorage.getItem("mainServerInstance");
	if(mainServerInstance!=null && mainServerInstance.length>0 && mainServerInstance.toLowerCase()!= "main")
		crushFTP.ajaxCallURL = userManager.ajaxCallURL = userManager.ajaxCallURLBase + mainServerInstance + "/";
	if($.sessionChecker && $.sessionChecker.defaultOptions)
		$.sessionChecker.defaultOptions.ajaxURL = crushFTP.ajaxCallURL;
	crushFTP.userLogin.bindUserName(function (response, username) {
		crushFTP.UI.showLoadingIndicator({});
		$("#UserManagerPanel").form();
		css_browser_selector(navigator.userAgent);
		$(".button").button();
		if (response == "failure") {
			window.location = "/WebInterface/login.html?link=/WebInterface/UserManager/index.html";
		} else {
			userManager.methods.initGUI();
		}
	});
});

function doLogout()
{
	$.ajax({type: "POST",url: "/WebInterface/function/",data: {command: "logout",random: Math.random(),c2f:crushFTP.getCrushAuth()},
		error: function (XMLHttpRequest, textStatus, errorThrown)
		{
			$.cookie("currentAuth", "", {path: '/',expires: -1});
			document.location = "/WebInterface/login.html";
		},
		success: function (msg)
		{
			$.cookie("currentAuth", "", {path: '/',expires: -1});
			document.location = "/WebInterface/login.html";
		}
	});
	return false;
}