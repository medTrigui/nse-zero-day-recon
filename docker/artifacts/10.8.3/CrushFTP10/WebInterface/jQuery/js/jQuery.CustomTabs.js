/* 
	Vipul Limbachiya 
	http://vipullimbachiya.com
*/
/* 
 * This program is free software. It comes without any warranty, to the extent permitted by applicable law. 
 * You can redistribute it and/or modify it without any terms.
 * Save developers, use Firefox http://firefox.com
*/

function initTabs() {
	$('.customtabs').each(function () {
		$(this).siblings('div').children('div:gt(0)').hide();
		$(this).children('a:first').addClass('active');
		$(this).find('a').click(function () {
			setTabByHandler(this);
			return false;
		});
	});
}

$(document).ready(function(){
	initTabs();
});

function setTabByHandler(elm) {
	if (elm && !$(elm).hasClass("disabled")) {
		var current_content_div = '#' + $(elm).attr('rel');
		$(elm).siblings().removeClass('active');
		$(elm).addClass('active');
		$(current_content_div).siblings().hide();
		$(current_content_div).show();
	}
	$(elm).blur();
	return false;
}

function setTabToElem(elm) {
	setTabByHandler($("a[rel='" + elm + "']:first"));
}