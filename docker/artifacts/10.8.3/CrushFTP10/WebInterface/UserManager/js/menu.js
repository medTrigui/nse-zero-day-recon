/**
 * 
 */
var timeout    = 500;
var closetimer = 0;
var ddmenuitem = 0;

function topNavigation_open(elm)
{
   topNavigation_canceltimer();
   topNavigation_close();
   ddmenuitem = $(elm).find('ul').css('visibility', 'visible');   
   if(elm.find("ul").width()<100)
   {
		elm.find("ul").css("width","150px");
   }
}

function topNavigation_close()
{  
	if(ddmenuitem) ddmenuitem.css('visibility', 'hidden');	
}

function topNavigation_timer()
{  
	closetimer = window.setTimeout(topNavigation_close, timeout);
}

function topNavigation_canceltimer()
{ 
	if(closetimer)
   {  
		window.clearTimeout(closetimer);
		closetimer = null;
	}
}

$(document).ready(function()
{  
	$('#topNavigation > li').bind('mouseover', function(){
		topNavigation_open($(this));
	}).bind('mouseout',  function(){
		topNavigation_timer();
	}).find("a").addClass("ui-widget-header").bind('mouseover', function(){
		$(this).addClass("ui-state-focus");		
	}).bind('mouseout',  function(){
		$(this).removeClass("ui-state-focus");
	});
});

document.onclick = topNavigation_close;