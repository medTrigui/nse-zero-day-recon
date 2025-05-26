// jQuery Context Menu Plugin
//
// Version 1.01
//
// Cory S.N. LaViska
// A Beautiful Site (http://abeautifulsite.net/)
//
// More info: http://abeautifulsite.net/2008/09/jquery-context-menu-plugin/
//
// Terms of Use
//
// This plugin is dual-licensed under the GNU General Public License
//   and the MIT License and is copyright A Beautiful Site, LLC.
//
if(jQuery)( function() {
	$.extend($.fn, {
		contextMenu: function(o, callback) {
			// Defaults
			if( o.menu == undefined ) return false;
			if( o.inSpeed == undefined ) o.inSpeed = 150;
			if( o.addClassSP == undefined ) o.addClassSP = false;
			if( o.topPadding == undefined ) o.topPadding = 0;
			if( o.leftPadding == undefined ) o.leftPadding = 0;
			if( o.outSpeed == undefined ) o.outSpeed = 75;
			if( o.openOnClick == undefined ) o.openOnClick = false;
			// 0 needs to be -1 for expected results (no fade)
			if( o.inSpeed == 0 ) o.inSpeed = -1;
			if( o.outSpeed == 0 ) o.outSpeed = -1;
			// Loop each context menu
			$(this).each( function() {
				var el = $(this);
				var offset = $(el).offset();
				// Add contextMenu class
				$('#' + o.menu).addClass('contextMenu');
				// Simulate a true right click
				$(this).bind("mousedown.contextMenu", function(e) {
					var evt = e;
					$(this).bind("mouseup.contextMenu", function(e) {
						var srcElement = $(this);
						$(this).unbind('mouseup.contextMenu');
						if( evt.button == 2  || evt.ctrlKey || o.openOnClick) {
							var events = $(el).data("events");
							if (events != null && typeof(events.onBeforeContextMenu) !== undefined)
							{
								$(el).trigger("onBeforeContextMenu");
							}
							if(window.crushFTP && window.crushFTP.methods && crushFTP.methods.removeTextRangeSelection)
								crushFTP.methods.removeTextRangeSelection();
							if(o.addClassSP)
							{
								srcElement.parent().find(".ui-widget-header").removeClass("ui-widget-header");
								srcElement.addClass("ui-widget-header");
							}
							if(o.applyClass)
							{
								srcElement.addClass(o.applyClass);
							}
							// Hide context menus that may be showing
							$(".contextMenu").hide();
							// Get this context menu
							var menu = $('#' + o.menu);

							if( $(el).hasClass('ui-state-disabled') ) return false;

							// Detect mouse position
							var d = {}, x, y;
							if( self.innerHeight ) {
								d.pageYOffset = self.pageYOffset;
								d.pageXOffset = self.pageXOffset;
								d.innerHeight = self.innerHeight;
								d.innerWidth = self.innerWidth;
							} else if( document.documentElement &&
								document.documentElement.clientHeight ) {
								d.pageYOffset = document.documentElement.scrollTop;
								d.pageXOffset = document.documentElement.scrollLeft;
								d.innerHeight = document.documentElement.clientHeight;
								d.innerWidth = document.documentElement.clientWidth;
							} else if( document.body ) {
								d.pageYOffset = document.body.scrollTop;
								d.pageXOffset = document.body.scrollLeft;
								d.innerHeight = document.body.clientHeight;
								d.innerWidth = document.body.clientWidth;
							}
							(e.pageX) ? x = e.pageX : x = e.clientX + d.scrollLeft;
							(e.pageY) ? y = e.pageY : y = e.clientY + d.scrollTop;

							// Show the menu
							x = x - o.leftPadding;
							if(x + $(menu).width() > $(document).width())
							{
								x = $(document).width() - $(menu).width() - o.leftPadding - 10;
							}
							$(document).unbind('click.contextMenu');
							$(menu).css({ top: y - o.topPadding, left: x}).fadeIn(o.inSpeed);
							// Hover events
							$(menu).find('A').bind("mouseover.contextMenu", function() {
								$(menu).find('LI.hover').removeClass('hover');
								$(this).parent().addClass('hover');
							}).bind("mouseout.contextMenu", function() {
								$(menu).find('LI.hover').removeClass('hover');
							});

							// Keyboard
							$(document).bind("keypress.contextMenu", function(e) {
								switch( e.keyCode ) {
									case 38: // up
										if( $(menu).find('LI.hover').size() == 0 ) {
											$(menu).find('LI:last').addClass('hover');
										} else {
											$(menu).find('LI.hover').removeClass('hover').prevAll('LI:not(.ui-state-disabled)').eq(0).addClass('hover');
											if( $(menu).find('LI.hover').size() == 0 ) $(menu).find('LI:last').addClass('hover');
										}
									break;
									case 40: // down
										if( $(menu).find('LI.hover').size() == 0 ) {
											$(menu).find('LI:first').addClass('hover');
										} else {
											$(menu).find('LI.hover').removeClass('hover').nextAll('LI:not(.ui-state-disabled)').eq(0).addClass('hover');
											if( $(menu).find('LI.hover').size() == 0 ) $(menu).find('LI:first').addClass('hover');
										}
									break;
									case 13: // enter
										$(menu).find('LI.hover A').trigger('click.contextMenu');
									break;
									case 27: // esc
										$(document).trigger('click.contextMenu');
									break
								}
							});

							// When items are selected
							$('#' + o.menu).find('A').unbind('click.contextMenu');
							$('#' + o.menu).find('LI:not(.ui-state-disabled) A').bind("click.contextMenu", function() {
								$(document).unbind('click.contextMenu').unbind('keypress.contextMenu');
								$(".contextMenu").hide();
								if(o.applyClass)
								{
									srcElement.removeClass(o.applyClass);
								}
								// Callback
								var action = $(this).attr('href').substr(1);
								if(action.indexOf("#")>=0)
								{
									action = action.substr(action.indexOf("#") + 1 , action.length - 1);
								}
								if( callback ) callback(action, $(srcElement), {x: x - offset.left, y: y - offset.top, docX: x, docY: y}, $(this).attr("msg") || $(this).text() );
								if(!$(this).attr("islink"))
									return false;
							});

							srcElement.mouseout(function() {
								srcElement.data("menuOn", false);
								handleMouseOut();
							});

							function handleMouseOut() {
								setTimeout(function() {
									if (!srcElement.data("menuOn")) {
										srcElement.unbind('mouseout');
										$(".contextMenu").unbind('mouseenter mouseleave');
										$(menu).hide();
										if(o.applyClass)
										{
											srcElement.removeClass(o.applyClass);
										}
									}
								}, 200);
							}

							$(".contextMenu").hover(function() {
								srcElement.data("menuOn", true);
							},
							function() {
								srcElement.data("menuOn", false);
								handleMouseOut();
							});

							// Hide bindings
							setTimeout( function() { // Delay for Mozilla
								$(document).bind("click.contextMenu", function() {
									$(document).unbind('click.contextMenu').unbind('keypress.contextMenu');
									$(menu).fadeOut(o.outSpeed);
									if(o.applyClass)
									{
										srcElement.removeClass(o.applyClass);
									}
									return false;
								});
							}, 0);
						}
					});
				});

				// Disable text selection
				if( $.browser.mozilla ) {
					$('#' + o.menu).each( function() { $(this).css({ 'MozUserSelect' : 'none' }); });
				} else if( $.browser.msie ) {
					$('#' + o.menu).each( function() { $(this).bind('selectstart.disableTextSelect', function() { return false; }); });
				} else {
					$('#' + o.menu).each(function() { $(this).bind('mousedown.disableTextSelect', function() { return false; }); });
				}
				// Disable browser context menu (requires both selectors to work in IE/Safari + FF/Chrome)
				$(el).add($('UL.contextMenu')).bind('contextmenu', function() { return false; });

			});
			return $(this);
		},

		// Disable context menu items on the fly
		disableContextMenuItems: function(o) {
			if( o == undefined ) {
				// Disable all
				$(this).find('LI').addClass('ui-state-disabled');
				return( $(this) );
			}
			$(this).each( function() {
				if( o != undefined ) {
					var d = o.split(',');
					for( var i = 0; i < d.length; i++ ) {
						$(this).find('A[href="' + d[i] + '"]').parent().addClass('ui-state-disabled');
					}
				}
			});
			return( $(this) );
		},

		// Enable context menu items on the fly
		enableContextMenuItems: function(o) {
			if( o == undefined ) {
				// Enable all
				$(this).find('LI.ui-state-disabled').removeClass('ui-state-disabled');
				return( $(this) );
			}
			$(this).each( function() {
				if( o != undefined ) {
					var d = o.split(',');
					for( var i = 0; i < d.length; i++ ) {
						$(this).find('A[href="' + d[i] + '"]').parent().removeClass('ui-state-disabled');
					}
				}
			});
			return( $(this) );
		},

		// Disable context menu(s)
		disableContextMenu: function() {
			$(this).each( function() {
				$(this).addClass('ui-state-disabled');
			});
			return( $(this) );
		},

		// Enable context menu(s)
		enableContextMenu: function() {
			$(this).each( function() {
				$(this).removeClass('ui-state-disabled');
			});
			return( $(this) );
		},

		// Destroy context menu(s)
		destroyContextMenu: function() {
			// Destroy specified context menus
			$(this).each( function() {
				// Disable action
				$(this).unbind('mousedown.contextMenu').unbind('mouseup.contextMenu');
			});
			return( $(this) );
		}

	});
})(jQuery);