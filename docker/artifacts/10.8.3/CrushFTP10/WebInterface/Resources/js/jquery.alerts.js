// jQuery Alert Dialogs Plugin
//
// Version 1.1
//
// Cory S.N. LaViska
// A Beautiful Site (http://abeautifulsite.net/)
// 14 May 2009
//
// Visit http://abeautifulsite.net/notebook/87 for more information
//
// Usage:
//		jAlert( message, [title, callback] )
//		jConfirm( message, [title, callback] )
//		jPrompt( message, [value, title, callback] )
//
// History:
//
//		1.00 - Released (29 December 2008)
//
//		1.01 - Fixed bug where unbinding would destroy all resize events
//
// License:
//
// This plugin is dual-licensed under the GNU General Public License and the MIT License and
// is copyright 2008 A Beautiful Site, LLC.
//
(function($) {

	$.alerts = {

		// These properties can be read/written by accessing $.alerts.propertyName from your scripts at any time

		verticalOffset: -75,                // vertical offset of the dialog from center screen, in pixels
		horizontalOffset: 0,                // horizontal offset of the dialog from center screen, in pixels/
		repositionOnResize: true,           // re-centers the dialog on window resize
		overlayOpacity: .6,                // transparency level of overlay
		overlayColor: '#000',               // base color of overlay
		draggable: true,                    // make the dialogs draggable (requires UI Draggables plugin)
		okButton: '&nbsp;OK&nbsp;',         // text for the OK button
		cancelButton: '&nbsp;Cancel&nbsp;', // text for the Cancel button
		dialogClass: null,                  // if specified, this class will be applied to all dialogs
		showEffects : false,

		// Public methods

		alert: function(message, title, callback, displayOptions) {
			if( title == null ) title = 'Alert';
			$.alerts._show(title, message, null, 'alert', function(result) {
				if( callback ) callback(result);
			}, false, false, displayOptions);
		},

		confirm: function(message, title, callback, displayOptions) {
			if( title == null ) title = 'Confirm';
			$.alerts._show(title, message, null, 'confirm', function(result) {
				if( callback ) callback(result);
			}, false, false, displayOptions);
		},

		prompt: function(message, value, title, callback, options, sizeOfList, displayOptions) {
			if( title == null ) title = 'Prompt';
			$.alerts._show(title, message, value, 'prompt', function(result, result2, resutl3,resutl4) {
				if( callback ) callback(result, result2, resutl3, resutl4);
			}, options, sizeOfList, displayOptions);
		},

		// Private methods

		_show: function(title, msg, value, type, callback, options, sizeOfList, displayOptions) {
			$.alerts._hide();
			$.alerts._overlay('show');
			var _dialogs = $(".ui-dialog:visible");
			_dialogs.hide();
			var container = $('<div id="popup_container" class="ui-widget ui-widget-content">' +
			    '<h1 id="popup_title" class="ui-widget-header"></h1>' +
			    '<div id="popup_content">' +
			      '<div id="popup_message"></div>' +
				'</div>' +
			  '</div>');
			container.hide();
			$("BODY").append(container);
			if($.alerts.showEffects)
				container.show({effect: 'fade', duration: 300});
			else
				container.show();
			if( $.alerts.dialogClass ) $("#popup_container").addClass($.alerts.dialogClass);

			// IE6 Fix
			var pos = ($.browser.msie && parseInt($.browser.version) <= 6 ) ? 'absolute' : 'fixed';

			var popup_container = $("#popup_container").css({
				position: 'absolute',
				zIndex: 99999,
				padding: 0,
				margin: 0
			});

			$("#popup_title").text(title);
			$("#popup_content").addClass(type);
			var popup_message = $("#popup_message").text(msg);
			popup_message.html( $("#popup_message").text().replace(/\n/g, '<br />') );

			$("#popup_container").css({
				minWidth: $("#popup_container").outerWidth(),
				maxWidth: $("#popup_container").outerWidth()
			});

			$.alerts._reposition();
			$.alerts._maintainPosition(true);

			switch( type ) {
				case 'alert':
					popup_message.after('<div id="popup_panel"><a href="javascript:void(0);" id="popup_ok" class="button"><span style="display:inline-block;margin:0px 3px 0px -7px;float:left;" class="pointer ui-icon ui-icon-disk"></span><span class="submitActionOk">' + $.alerts.okButton + '</span></a></div>');
					$("#popup_ok").click( function() {
						$.alerts._hide();
						if(callback)callback(true);
					});
					if(displayOptions && displayOptions.appendAfterInput)
					{
						var parent = popup_message;
						parent.append(displayOptions.appendAfterInput);
						$("#popup_container").css({
							minWidth: "350px",
							maxWidth: "720px"
						});
						$.alerts._reposition();
						$.alerts._maintainPosition(true);
						setTimeout(function(){
							parent.find("input:first, textarea:first").select().focus();
						}, 500);
					}
					$("#popup_ok").focus().keypress( function(e) {
						if( e.keyCode == 13 || e.keyCode == 27 ) $("#popup_ok").trigger('click');
					});
				break;
				case 'confirm':
					popup_message.after('<div id="popup_panel"><a href="javascript:void(0);"  id="popup_ok" class="button"><span style="display:inline-block;margin:0px 3px 0px -7px;float:left;" class="pointer ui-icon ui-icon-disk"></span><span class="submitActionOk">' + $.alerts.okButton + '</span></a>&nbsp;&nbsp;<a href="javascript:void(0);" id="popup_cancel" class="button"><span style="display:inline-block;margin:0px 3px 0px -7px;float:left;" class="pointer ui-icon ui-icon-cancel"></span><span class="submitActionCancel">' + $.alerts.cancelButton + '</span></a></div>');
					if(displayOptions && displayOptions.appendAfterInput)
					{
						var parent = popup_message;
						parent.append(displayOptions.appendAfterInput);
						$("#popup_container").css({
							minWidth: "350px",
							maxWidth: "720px"
						});
						$.alerts._reposition();
						$.alerts._maintainPosition(true);
					}
					$("#popup_ok").click( function() {
						if($("#popup_container").find("#chk_expire_user"))
						{
							if(callback) callback(true);
							$.alerts._hide();
						}
						else
						{
							$.alerts._hide();
							if( callback ) callback(true);
						}
					});
					$("#popup_cancel").click( function() {
						$.alerts._hide();
						if( callback ) callback(false);
					});
					$("#popup_ok").focus();
					$("#popup_ok, #popup_cancel").keypress( function(e) {
						if( e.keyCode == 13 ) $("#popup_ok").trigger('click');
						if( e.keyCode == 27 ) $("#popup_cancel").trigger('click');
					});
				break;
				case 'prompt':
					var promptInput = $('<input type="text" size="30" id="popup_prompt" />');
					if(options && options.length>0)
					{
						if(sizeOfList && sizeOfList>1)
						{
							promptInput = $("<select size='"+sizeOfList+"' id='popup_prompt'></select>");
						}
						else
						{
							promptInput = $("<select id='popup_prompt'></select>");
						}
						for(var item in options)
						{
							var curItem = options[item];
							if(curItem.split)
							{
								curItem = curItem.split("|");
								if(curItem.length>1)
								{
									promptInput.append("<option value='"+curItem[0]+"'>"+curItem[1]+"</option>");
								}
								else
								{
									promptInput.append("<option value='"+curItem[0]+"'>"+curItem[0]+"</option>");
								}
							}
						}
						if (displayOptions && displayOptions.multiple)
						{
							promptInput.attr("multiple", "multiple");
						}
					}

					popup_message.append(promptInput).after('<div id="popup_panel"><a href="javascript:void(0);" id="popup_ok" class="button"><span style="display:inline-block;margin:1px 3px 0px -7px;float:left;" class="pointer ui-icon ui-icon-disk"></span><span class="submitActionOk">' + $.alerts.okButton + '</span></a>&nbsp;&nbsp;<a href="javascript:void(0);" id="popup_cancel" class="button"><span style="display:inline-block;margin:1px -3px 0px -5px;float:left;" class="pointer ui-icon ui-icon-cancel"></span><span class="submitActionCancel">' + $.alerts.cancelButton + '</span></a></div>');
					if(displayOptions && displayOptions.passwordInput)
					{
						$("#popup_prompt", popup_container).replaceWith('<input type="password" size="30" style="width:312px" id="popup_prompt" />');
					}
					$("#popup_prompt").width( popup_message.width() );
					$("#popup_ok").click( function() {
						var val = $("#popup_prompt").val();
						if(displayOptions && displayOptions.isHTMLArea)
							val = $("#popup_prompt").sceditor('instance').val();
						var key = $("#popup_prompt").find("option:selected").text();
						var extraItemVal = false;
						if(displayOptions && displayOptions.appendAfterInput)
							extraItemVal = $("#popup_prompt").parent().find(".extraItem").val();
						var extVals = [];
						if($("#popup_prompt").closest(".prompt").find(".extraItem").length>0)
						{
							$("#popup_prompt").closest(".prompt").find(".extraItem").each(function(){
								extVals.push($(this).val());
							});
						}
						if(displayOptions && displayOptions.customSelectBox)
							extraItemVal = popup_container.find("select").val();
						$.alerts._hide();
						if(callback)
						{
							if(extraItemVal || extVals.length>0)
							{
								callback(val, key, extraItemVal, extVals);
							}
							else
							 	callback(val, key);
						}
					});
					$("#popup_cancel").click( function() {
						$.alerts._hide();
						if( callback ) callback(null);
					});
					$("#popup_prompt, #popup_ok, #popup_cancel").keypress( function(e) {
						if( e.keyCode == 13 ) $("#popup_ok").trigger('click');
						if( e.keyCode == 27 ) $("#popup_cancel").trigger('click');
					});
					setTimeout(function(){
						if(value)
						{
							$("#popup_prompt").val(value);
						}
						else
						{
							promptInput.find("option:first").attr("selected","selected");
						}
						if(displayOptions && displayOptions.customSelectBox)
						{
							$("#popup_prompt", popup_container).replaceWith(displayOptions.customSelectBox);
							popup_container.find("select").val(value);
							setTimeout(function(){
								popup_container.find("select").focus();
							}, 500);
						}
						if(displayOptions && displayOptions.hideCancelButton)
						{
							promptInput.closest("#popup_content").find("a#popup_cancel").hide();
						}
						if(displayOptions && displayOptions.isColorBox)
						{
							promptInput.colorPicker().before("<span style='float:left;margin:10px 10px 10px 5px;'><strong>Choose Color : </strong></span>");
							promptInput.parent().append("<div class='clear'></div>");
						}
						if(displayOptions && displayOptions.isHTMLArea)
						{
							var parent = promptInput.parent();
							promptInput.replaceWith("<textarea id=\"popup_prompt\" cols=\"135\" rows=\"15\" style='max-width:100%;'></textarea>");
							promptInput = $("#popup_prompt", parent);
							if(value)
							{
								promptInput.val(value);
							}
							promptInput.sceditor({
								toolbar : "bold,italic,underline|orderedlist,bulletlist|left,center,right|color|image|link,unlink|font,size|maximize|source",
								autofocus : true,
								autoUpdate : true,
								emoticonsEnabled : false
							});
							promptInput.parent().append("<div class='clear'></div>");
							$("#popup_container").css({
								minWidth: "750px",
								maxWidth: "780px"
							});
							if($.browser.msie)
							{
								$("#popup_container").css({
									minWidth: "750px",
									maxWidth: "800px"
								});
							}

							$("#popup_content").css({
								background: "none"
							});
							$("#popup_message").css({
								padding: "0px 0px 0px 10px"
							});
							$.alerts._reposition();
							$.alerts._maintainPosition(true);
						}
						if(displayOptions && displayOptions.isTextArea)
						{
							var parent = promptInput.parent();
							promptInput.replaceWith("<textarea id=\"popup_prompt\" cols=\"108\" rows=\"15\" style='max-width:100%;'></textarea>");
							promptInput = $("#popup_prompt", parent);
							if(value)
							{
								promptInput.val(value);
							}
							promptInput.parent().append("<div class='clear'></div>");
							$("#popup_container").css({
								minWidth: "250px",
								maxWidth: "720px"
							});
							if($.browser.msie)
							{
								$("#popup_container").css({
									minWidth: "250px",
									maxWidth: "800px"
								});
							}

							$("#popup_content").css({
								background: "none"
							});
							$("#popup_message").css({
								padding: "0px 0px 0px 10px"
							});
							$.alerts._reposition();
							$.alerts._maintainPosition(true);
						}
						if(displayOptions && displayOptions.textBoxWidth)
						{
							$("#popup_prompt", parent).css("width", displayOptions.textBoxWidth);
						}
						if(displayOptions && displayOptions.isWideTextBox)
						{
							var parent = promptInput.parent();
							promptInput.css("width", "600px");
							promptInput = $("#popup_prompt", parent);
							if(value)
							{
								promptInput.val(value);
							}
							promptInput.parent().append("<div class='clear'></div>");
							$("#popup_container").css({
								minWidth: "250px",
								maxWidth: "720px"
							});
							$.alerts._reposition();
							$.alerts._maintainPosition(true);
						}
						if(displayOptions && displayOptions.isWideTextBox2)
						{
							var parent = promptInput.parent();
							promptInput.css("width", "200px");
							promptInput = $("#popup_prompt", parent);
							if(value)
							{
								promptInput.val(value);
							}
							promptInput.parent().append("<div class='clear'></div>");
							promptInput.before("<div class='clear'></div>");
						}
						if(displayOptions && displayOptions.appendAfterInput)
						{
							var parent = promptInput.parent();
							parent.append(displayOptions.appendAfterInput);
							$("#popup_container").css({
								minWidth: "350px",
								maxWidth: "720px"
							});
							$.alerts._reposition();
							$.alerts._maintainPosition(true);
						}
						if(displayOptions && displayOptions.prependBeforeInput)
						{
							var parent = promptInput.parent();
							parent.prepend(displayOptions.prependBeforeInput);
							$("#popup_container").css({
								minWidth: "350px",
								maxWidth: "720px"
							});
							$.alerts._reposition();
							$.alerts._maintainPosition(true);
						}
						if(displayOptions && displayOptions.okButtonText)
						{
							$(".submitActionOk", popup_container).text(displayOptions.okButtonText);
						}
						$("#popup_prompt").focus().select();
					}, 100);
				break;
			}
			if(displayOptions && displayOptions.okButtonText)
			{
				$(".submitActionOk", popup_container).text(displayOptions.okButtonText);
			}
			if(displayOptions && displayOptions.okButtonClassAdd)
			{
				$(".submitActionOk", popup_container).prev().removeClass("ui-icon-disk").addClass(displayOptions.okButtonClassAdd);
			}
			if(displayOptions && displayOptions.cancelButtonText)
			{
				$(".submitActionCancel", popup_container).text(displayOptions.cancelButtonText);
			}
			if(displayOptions && displayOptions.messageToAppend)
			{
				$(".submitActionOk", popup_container).closest("a").before(displayOptions.messageToAppend);
			}
			if(displayOptions && displayOptions.classForPopupPanel)
			{
				$("#popup_content").addClass(displayOptions.classForPopupPanel);
			}
			if(displayOptions && displayOptions.prependButtons)
			{
				var okBtn = $(".submitActionOk", popup_container).parent();
				for(var i=0; i<displayOptions.prependButtons.length;i++)
				{
					var curBtn = displayOptions.prependButtons[i];
					var btn = $(curBtn.button);
					okBtn.before(btn);
					btn.bind("click", curBtn.clickEvent);
				}
			}
			if(displayOptions && displayOptions.popupWidth)
			{
				$("#popup_container", parent).css("min-width", displayOptions.popupWidth);
				$.alerts._reposition();
			}
			buildButtons($("#popup_container"));
			if($("#popup_continue", popup_container).length>0)
			{
				setTimeout(function() {
					$("#popup_continue", popup_container).filter(":first").focus();
				}, 10);
			}
			// Make draggable
			if( $.alerts.draggable ) {
				try {
					$("#popup_container").draggable({ handle: $("#popup_title") });
					$("#popup_title").css({ cursor: 'move' });
				} catch(e) { /* requires jQuery UI draggables */ }
			}

			$(document).bind("keyup.alertBoxEscape", function(e) {
			  if (e.keyCode == 27) {
				$("#popup_cancel").trigger('click');
				$(document).unbind("keyup.alertBoxEscape");
			  }
			});
			popup_container.form();
			setTimeout(function(){
				popup_container.form();
			}, 500);
			setTimeout(function(){
				_dialogs.show();
			}, 100);
		},

		_hide: function() {
			$("#popup_container").remove();
			$.alerts._overlay('hide');
			$.alerts._maintainPosition(false);
		},

		_overlay: function(status) {
			switch( status ) {
				case 'show':
					$.alerts._overlay('hide');
					$("BODY").append('<div id="popup_overlay"></div>');
					$("#popup_overlay").css({
						position: 'absolute',
						zIndex: 99998,
						top: '0px',
						left: '0px',
						width: '100%',
						height: $(document).height(),
						background: $.alerts.overlayColor,
						opacity: $.alerts.overlayOpacity
					});
				break;
				case 'hide':
					$("#popup_overlay").remove();
				break;
			}
		},

		_reposition: function() {
			var top = (($(window).height() / 2) - ($("#popup_container").outerHeight() / 2)) + $.alerts.verticalOffset;
			var left = (($(window).width() / 2) - ($("#popup_container").outerWidth() / 2)) + $.alerts.horizontalOffset;
			if( top < 0 ) top = 0;
			if( left < 0 ) left = 0;

			top = top + $(window).scrollTop();

			$("#popup_container").css({
				top: top + 'px',
				left: left + 'px'
			});
			$("#popup_overlay").height( $(document).height() );
		},

		_maintainPosition: function(status) {
			if( $.alerts.repositionOnResize ) {
				switch(status) {
					case true:
						$(window).bind('resize', $.alerts._reposition);
					break;
					case false:
						$(window).unbind('resize', $.alerts._reposition);
					break;
				}
			}
		}

	}

	// Shortuct functions
	jAlert = function(message, title, callback, displayOptions) {
		$.alerts.alert(message, title, callback, displayOptions);
	}

	jConfirm = function(message, title, callback, displayOptions) {
		$.alerts.confirm(message, title, callback, displayOptions);
	};

	jPrompt = function(message, value, title, callback, options, sizeOfList, displayOptions) {
		$.alerts.prompt(message, value, title, callback, options, sizeOfList, displayOptions);
	};

})(jQuery);