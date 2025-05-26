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
crushFTP.defaultRequestType = "GET";
$(document).ready(function(){

	$("#telnetOptions").contextMenu({
        topPadding: 10,
        leftPadding: 10,
        menu: 'telnetButtonMenu',
        openOnClick : true,
    }, function(action, el, pos, command) {
        if (command == "telnet") {

        }
        else if (command == "logs") {

        }
        else if (command == "debug") {
        	if($("#debugButtonSupport").attr("disabled"))return false;
        	var url = crushFTP.ajaxCallURL || "/WebInterface/function/";
        	$.ajax({
        		type: "GET",
        		url: url,
        		data: {
        			command: "upload_debug_info",
        			send: "true",
        			save:"false",
        			random: Math.random(),
        			c2f:crushFTP.getCrushAuth()
        		},
				error: function (XMLHttpRequest, textStatus, errorThrown)
				{
					$("#debugButtonSupport").removeAttr("disabled");
				},
				success: function (message)
				{
					$("#debugButtonSupport").removeAttr("disabled");
				}
			});
			$("#debugButtonSupport").attr("disabled", "disabled");
			crushFTP.UI.growl("Sending debug info, this might take 30-40 seconds.", "", false, 5000);
        }
        else if (command == "debug_download") {
        	var url = crushFTP.ajaxCallURL || "/WebInterface/function/";
        	window.open(url + "?command=upload_debug_info&save=true&send=false&c2f="+crushFTP.getCrushAuth());
        }
        return false;
    }).click(function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        return false;
    });

	var theme = localStorage["theme"] || "light";
	if(theme == "light"){
		$("#themeIcon").removeClass('fa-sun-o').addClass('fa-moon-o');
		$("#themeLink").remove();
		$("head").append('<link type="text/css" id="themeLink" href="/WebInterface/Resources/css/themes/light-theme.zip/jquery-ui.min.css" rel="stylesheet" />');
	}
	else {
		$("html").attr('data-theme', "dark");
		$("#themeIcon").addClass('fa-sun-o').removeClass('fa-moon-o');
		$("#themeLink").remove();
		$("head").append('<link type="text/css" id="themeLink" href="/WebInterface/Resources/css/themes/dark-theme.zip/jquery-ui.min.css" rel="stylesheet" />');
	}
    var topbar = $("#topbar_side");
    $(".menuToggleButton").click(function(){
        topbar.toggleClass("topbar-open");
    });
    $(".navbar-right").click(function(e){
        if(e.target && $(e.target).closest("ul.navbar-right-nav").length>0)
            return;
        topbar.removeClass("topbar-open");
    })
	$(".tabs").tabs();
	crushFTP.UI.initLoadingIndicator();
	crushFTP.userLogin.bindUserName(function (response, username) {
		crushFTP.UI.showLoadingIndicator({});
		$("#adminPanel").form();
		css_browser_selector(navigator.userAgent);
		$(".button").button();
		if (response == "failure") {
			window.location = "/WebInterface/login.html?link=/WebInterface/admin/index.html";
		} else {
			adminPanel.methods.initGUI();
		}
	});
});

function toggleTheme(){
	var theme = localStorage["theme"] || "light";
	if(theme == "light"){
		$("html").attr('data-theme', "dark");
		localStorage["theme"] = "dark";
		$("#themeIcon").addClass('fa-sun-o').removeClass('fa-moon-o');
		$("#themeLink").remove();
		$("head").append('<link type="text/css" id="themeLink" href="/WebInterface/Resources/css/themes/dark-theme.zip/jquery-ui.min.css" rel="stylesheet" />');
	}
	else{
		$("html").removeAttr('data-theme');
		localStorage["theme"] = "light";
		$("#themeIcon").removeClass('fa-sun-o').addClass('fa-moon-o');
		$("#themeLink").remove();
		$("head").append('<link type="text/css" id="themeLink" href="/WebInterface/Resources/css/themes/light-theme.zip/jquery-ui.min.css" rel="stylesheet" />');
	}
	$(document).trigger("theme-change");
	return false;
}

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