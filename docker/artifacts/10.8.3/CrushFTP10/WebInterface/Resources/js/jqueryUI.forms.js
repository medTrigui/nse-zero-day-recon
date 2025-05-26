/*
Original code from  : http://www.tuttoaster.com/wp-content/uploads/demos/5/index.html
*/
$.widget("ui.form", {
    _init: function (stopProp) {
        var object = this;
        var form = this.element;
        var inputs = form.find("input , select ,textarea");
        form.find("fieldset").filter(":not(.donotProcess)").addClass("ui-widget-content");
        form.find("legend").filter(":not(.donotProcess)").each(function(){
			if(!$(this).parent().hasClass("noForm"))
			{
				if($(this).is(".normal"))
				{
					$(this).addClass("ui-priority-primary ui-corner-all");
				}
				else
				{
					$(this).addClass("ui-widget-header ui-corner-all");
				}
			}
		});
        var suggests = ["{r}||a return character"
            ,"{n}||a new line character"
            ,"{task_error}||will output the error encountered if any."
            ,"{task_errors}||will output of previous errors encountered if any."
            ,"{url}||actual url that points to the file"
            ,"{parent_url}||actual url that points to the items parent folder"
            ,"{path}||path to the file"
            ,"{parent_path}||path to the file"
            ,"{name}||name of the file"
            ,"{stem}||first part of the name before the dot"
            ,"{ext}||end part of the name including the dot"
            ,"{size}||size of the file"
            ,"{speed}||speed of the transfer"
            ,"{error}||error message for the transfer if any"
            ,"{start}||start time"
            ,"{end}||end time"
            ,"{resume_loc}||resume location in file"
            ,"{md5}||MD5 hash of the uploaded file"
            ,"{user_dir}||the directory the user saw when uploading"
            ,"{real_path}||files local path on disk"
            ,"{real_parent_path}||files parent folder's local path on disk"
            ,"{MM}||month"
            ,"{dd}||day"
            ,"{yy}||or"
            ,"{yyyy}||year"
            ,"{HH}||24 hour"
            ,"{mm}||minute"
            ,"{hh}||12 hour"
            ,"{aa}||AM or PM"
            ,"{ss}||seconds"
            ,"{S}||milliseconds"
            ,"{EEE}||weekday abbreviation"];
        form.addClass("ui-widget");
        $.each(inputs, function () {
			if($.browser && $.browser.msie && $.browser.version <= 8 && ($(this).is(":radio") || $(this).is(":checkbox")))
			{
				return;
			}
            if((typeof window.panelGeneralSettings !="undefined" || typeof window.panelWebInterface !="undefined") && $(this).closest("div.noForm").length>0)return;
            if($(this).closest("div.noForm").length>0)return;
			if($(this).hasClass("form-created") || $(this).is("input[type='file']"))return;
            $(this).addClass('ui-state-default ui-corner-all form-created');
            $(this).wrap("<label />");
            if ($(this).is(":reset ,:submit")) object.buttons(this);
            else if ($(this).is(":checkbox")) object.checkboxes(this);
            else if ($(this).is("input[type='text']") || $(this).is("textarea") || $(this).is("input[type='password']") || $(this).is("select")) object.textelements(this);
            else if ($(this).is(":radio")) object.radio(this);
            else if ($(this).is("select")) object.selector(this);
            if ($(this).hasClass("date")) {
                var dateFormat = "mm/dd/yy";
                if(window.datetimepickerDateFormat)
                    dateFormat = window.datetimepickerDateFormat;
                if($(this).hasClass("time"))
                {
                    if($(this).hasClass("imgBtnTrigger"))
                    {
                        $(this).datetimepicker({
                            timeFormat: 'hh:mm TT',
                            dateFormat : dateFormat,
                            ampm: true,
                            showOn: "both",
                            buttonImage: "/WebInterface/Resources/images/calendar.png",
                            buttonImageOnly: true
                        });
                    }
                    else
                    {
    					$(this).datetimepicker({
    						timeFormat: 'hh:mm TT',
                            dateFormat : dateFormat,
    						ampm: true
    					});
                    }
				}
				else
				{
					$(this).datepicker({
                        dateFormat : dateFormat
                    });
				}
            }
			else if ($(this).hasClass("time")) {
				$(this).timepicker({
					timeFormat: 'hh:mm TT',
					ampm: true
				});
            }
			if($(this).hasClass("encryptPass"))
			{
				$(this).crushFtpEncryptPassword();
			}
            if($(this).hasClass("suggestVariables") && typeof $.fn.autocomplete2 != "undefined" && window.addAutoSuggests == true)
            {
                var that = $(this);
                setTimeout(function() {
                    that.autocomplete({
                        mode : "inner",
                        wordCount:1,
                        on: {
                            query: function(text,cb){
                                if(text.length<1)return;
                                var words = [];
                                for( var i=0; i<suggests.length; i++ ){
                                    if(suggests[i].toLowerCase().indexOf(text.toLowerCase()) == 0) words.push(suggests[i]);
                                }
                                cb(words);
                            }
                        }
                    });
                }, 500);
            }
        });
        $(".hover").hover(function () {
            if($(this).prev().find("input").is(":disabled"))
                return;
            $(this).addClass("ui-state-hover");
        }, function () {
            $(this).removeClass("ui-state-hover");
        });
    },
    textelements: function (element) {
		if($(element).is("textarea"))
		{
			$(element).addClass("nobg");
		}
        // if(!$(element).is("textarea") && !$(element).is("select") && $(element).is('input:not([readonly])'))
        // {
        //     $(element).attr("readonly", "readonly").attr("onfocus", "this.removeAttribute('readonly');").attr("autocomplete", "off");
        // }
        $(element).bind({
            focusin: function () {
                var that = $(this);
                setTimeout(function(){
                    //console.log(that);
                    if(!that.is("[readonly]") && !that.is(":disabled"))
                        that.addClass('ui-state-focus');
                },50);
            },
            focusout: function () {
                if(!$(this).is("[readonly]") && !$(this).is(":disabled"))
                    $(this).removeClass('ui-state-focus');
            }
        });
        // if($(element).attr("type") == "password" && !$(this).is("[readonly]")){
        //     $(element).attr("readonly", "readonly");
        //     $(element).bind({
        //         focusin: function () {
        //             $(this).removeAttr("readonly");
        //         },
        //         focusout: function () {
        //             $(this).attr("readonly", "readonly");
        //         }
        //     });
        // }
    },
    buttons: function (element) {
        if ($(element).is(":submit")) {
            $(element).addClass("ui-priority-primary ui-corner-all ui-state-disabled hover");
            $(element).bind("click", function (event) {
                event.preventDefault();
				event.stopPropagation();
            });
        } else if ($(element).is(":reset")) $(element).addClass("ui-priority-secondary ui-corner-all hover");
        $(element).bind('mousedown mouseup', function () {
            $(this).toggleClass('ui-state-active');
        });
    },
    checkboxes: function (element) {
        $(element).parent("label").after("<span />");
        var parent = $(element).parent("label").next();
        $(element).addClass("ui-helper-hidden");
        parent.css({
            width: 16,
            height: 16,
            display: "block"
        });
        parent.wrap("<span class='ui-state-default ui-corner-all checkbox-parent' style='display:inline-block;margin-right:5px;overflow:hidden;'/>");
        parent.parent().addClass('hover');
		if($(element).is(":checked"))
		{
			parent.toggleClass("ui-icon ui-icon-check");
		}
		if(!$(element).attr("disabled"))
		{
			parent.parent("span").click(function (event) {
                if(!$(element).attr("disabled") && !$(element).attr("readonly"))
                {
                    //$(this).toggleClass("ui-state-active");
                    parent.toggleClass("ui-icon ui-icon-check");
    				if(!$(element).is(":checked"))
    				{
    					$(element).attr("checked","checked");
    				}
    				else
    				{
    					$(element).removeAttr("checked");
    				}
    				$(element).trigger("change");
                }
                else
                {
                    $(this).removeClass("ui-state-active");
                }
				//event.stopPropagation();
			});
			parent.parent("span").next("label[for]").click(function (event) {
                if(!$(element).attr("disabled") && !$(element).attr("readonly") && !(($(this).hasClass('altClick')) && event.ctrlKey || event.metaKey || event.altKey))
                {
    				//$(this).prev().toggleClass("ui-state-active");
    				parent.toggleClass("ui-icon ui-icon-check");
    				if(!$(element).is(":checked"))
    				{
    					$(element).attr("checked","checked");
    				}
    				else
    				{
    					$(element).removeAttr("checked");
    				}
                    $(element).trigger("change");
                }
                else
                {
                    $(this).prev().removeClass("ui-state-active");
                }
    			event.preventDefault();
				//event.stopPropagation();
			}).addClass('pointer');
            $(element).removeClass('disabled');
		}
        else{
            $(element).addClass('disabled');
        }
    },
    radio: function (element) {
        if($(element).hasClass('no-form'))return false;
        $(element).parent("label").after("<span />");
        var parent = $(element).parent("label").next();
        $(element).addClass("ui-helper-hidden");
        parent.wrap("<span class='ui-state-default ui-corner-all checkbox-parent' style='display:inline-block;width:16px;height:16px;margin-right:5px;'/>");
        parent.parent().addClass('hover');
        if(!$(element).attr("disabled"))
        {
    		if($(element).is(":checked"))
    		{
    			parent.toggleClass("ui-icon ui-icon-circle-check");
    		}
			parent.parent("span").click(function (event) {
                if(!$(element).attr("disabled"))
                {
    				$(element).closest(".customForm").find("input[name='"+$(element).attr("name")+"']").each(function(){
    					var _parent = $(this).parent().next();
    					$(_parent).removeClass("ui-state-active").removeClass("ui-icon ui-icon-circle-check").addClass("");
    					$(_parent).find("span").removeClass("ui-state-active").removeClass("ui-icon ui-icon-circle-check").addClass("");
    				});
    				//$(this).toggleClass("ui-state-active");
    				parent.toggleClass("ui-icon ui-icon-circle-check");
    				if(!$(element).is(":checked"))
    				{
    					$(element).attr("checked","checked");
    				}
    				event.stopPropagation();
    				$(element).trigger("change");
                }
			});
			parent.parent("span").next("label[for]").click(function (event) {
                if(!$(element).attr("disabled"))
                {
    				$(element).closest(".customForm").find("input[name='"+$(element).attr("name")+"']").each(function(){
    					var _parent = $(this).parent().next();
    					$(_parent).removeClass("ui-state-active").removeClass("").removeClass("ui-icon ui-icon-circle-check").addClass("");
    					$(_parent).find("span").removeClass("ui-state-active").removeClass("").removeClass("ui-icon ui-icon-circle-check").addClass("");
    				});
    				//$(this).prev().toggleClass("ui-state-active");
    				parent.toggleClass("ui-icon ui-icon-circle-check");
    				if(!$(element).is(":checked"))
    				{
    					$(element).attr("checked","checked");
    				}
    				event.preventDefault();
    				event.stopPropagation();
    				$(element).trigger("change");
                }
			});
		    parent.parent().removeClass('disabled');
        }
        else{
            parent.parent().addClass('disabled');
        }
    },
    selector: function (element) {
        var parent = $(element).parent();
        parent.css({
            "display": "block",
            width: 140,
            height: 21
        }).addClass("ui-state-default ui-corner-all");
        $(element).addClass("ui-helper-hidden");
        parent.append("<span id='labeltext' style='float:left;'></span><span style='float:right;display:inline-block' class='ui-icon ui-icon-triangle-1-s' ></span>");
        parent.after("<ul class=' ui-helper-reset ui-widget-content ui-helper-hidden' style='position:absolute;z-index:50;width:140px;' ></ul>");
        $.each($(element).find("option"), function () {
            $(parent).next("ul").append("<li class='hover'>" + $(this).html() + "</li>");
        });
        $(parent).next("ul").find("li").click(function (event) {
            $("#labeltext").html($(this).html());
            $(element).val($(this).html());
			if(stopProp)
			{
				event.stopPropagation();
			}
        });
        $(parent).click(function (event) {
            $(this).next().slideToggle('fast');
            event.preventDefault();
			if(stopProp)
			{
				event.stopPropagation();
			}
        });
    }
});