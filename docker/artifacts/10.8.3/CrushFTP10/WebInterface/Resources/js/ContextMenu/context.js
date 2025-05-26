/*
 * Animated multilevel right-click context menu
 * (C) 2011 Sawanna Team (http://sawanna.org)
 */

var contextMenu={
	handler: document,
	elem: 'ul#context-menu',
	locked: 0,
	state: 0,
	offset: 2,
	init: function() {
		$(this.elem).appendTo('body');
		$(this.handler).find("li").bind('contextmenu',function(e){
			if (e.preventDefault) {
				e.preventDefault();
			} else {
				e.returnValue= false;
			}
			if(window.crushFTP && window.crushFTP.methods && crushFTP.methods.removeTextRangeSelection)
				crushFTP.methods.removeTextRangeSelection();
			contextMenu.show(e, $(this));
			return false;
		});
		$(this.handler).bind('contextmenu',function(e){
			if (e.preventDefault) {
				e.preventDefault();
			} else {
				e.returnValue= false;
			}
			if(window.crushFTP && window.crushFTP.methods && crushFTP.methods.removeTextRangeSelection)
				crushFTP.methods.removeTextRangeSelection();
			contextMenu.show(e, $(this));
			return false;
		});
		$(this.elem).find("li").addClass("ui-state-default").bind('mouseover', function(){
			var item = $(this).addClass("ui-state-focus");//.closest("ul").parent().find("a:first").addClass("ui-state-focus");
			if(item.is("#logo")){
				item.removeClass("ui-state-focus");
			}
		}).bind('mouseout',  function(){
			$(this).removeClass("ui-state-focus");//.closest("ul").parent().find("a:first").removeClass("ui-state-focus");
		});
		$(document).bind('click',function(e){
			if (contextMenu.state && !contextMenu.locked) {
				contextMenu.hide();
				return false;
			}
			return true;
		});
		$(document).bind('keydown',function(e){
			if (contextMenu.state && !contextMenu.locked) {
				contextMenu.hide();
				return false;
			}
			return true;
		});
		$(this.elem).bind('mousedown',function(e){
			contextMenu.locked=1;
		});
		$(this.elem).bind('mouseup',function(e){
			window.setTimeout("contextMenu.locked=0;", 500);
		});
		$(this.elem).find('a').bind('click',function(e){
			contextMenu.hide();
			return true;
		});
		$(this.elem).find('a').bind('mouseover',function(e){
			contextMenu.showChild($(this));
		});
		$(this.elem).find('li').each(function(){
			if ($(this).children('ul').length) {
				$(this).addClass('parent');
				$(this).children('a').addClass('parent');
			}
		});
	},
	show: function(e, curElem) {
		if(curElem.is("li"))
		{
			$(this.elem).data("selectedUser", curElem);
		}
		else
		{
			$(this.elem).removeData("selectedUser");
		}
		$(this.elem).find('ul').css('display','none');
		$(this.elem).find('li').children('a').removeClass('active');

		this.locked=1;
		this.fixPos(e);
		$(this.elem).show();
		contextMenu.state=1;
		contextMenu.locked=0;
		if(window.crushFTP && window.crushFTP.methods && crushFTP.methods.removeTextRangeSelection)
			crushFTP.methods.removeTextRangeSelection();
	},
	hide: function() {
		$(this.elem).removeData("selectedUser");
		this.locked=1;
		$(this.elem).hide();
		contextMenu.state=0;
		contextMenu.locked=0;
		$(this).find('ul').css('display','none');
	},
	fixPos: function(e) {
		var deltaX=0;
		var deltaY=0;
		if (e.pageX+this.offset+$(this.elem).width() >= $(window).width()+$(window).scrollLeft()) {
			deltaX=-($(this.elem).width()+2*this.offset);
		}
		if (e.pageY+this.offset+$(this.elem).height() >= $(window).height()+$(window).scrollTop()) {
			deltaY=-($(this.elem).height()+2*this.offset);
		}
		$(this.elem).css({
			'left':e.pageX+this.offset+deltaX,
			'top':e.pageY+this.offset+deltaY
		});
	},
	showChild: function(el) {
		$(this.elem).find('ul').css('display','none');
		$(el).parents('ul').css('display','block');
		$(this.elem).find('li').children('a').removeClass('active');
		$(el).parents('li').children('a').addClass('active');
		if ($(el).parent('li').children('ul').length) {
			this.fixChildPos($(el).parent('li').children('ul'));
			$(el).parent('li').children('ul').show();
		}
	},
	fixChildPos: function(elem) {
		var deltaX=0;
		var deltaY=0;
		if ($(elem).parent('li').parent('ul').offset().left+$(elem).parent('li').parent('ul').width()+$(elem).width() >= $(window).width()+$(window).scrollLeft()) {
			deltaX=-($(elem).width()+$(elem).parent('li').parent('ul').width());
		}
		if ($(elem).parent('li').offset().top+$(elem).height() >= $(window).height()+$(window).scrollTop()) {
			deltaY=-($(elem).height())+$(elem).parent('li').height();
		}
		$(elem).css({
			'left':$(elem).parent('li').parent('ul').width()+deltaX,
			'top':$(elem).parent('li').offset().top-$(elem).parent('li').parent('ul').offset().top+deltaY
		});
	}
}
