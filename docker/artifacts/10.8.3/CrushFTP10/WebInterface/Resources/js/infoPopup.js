(function ($) {
    $.infoPopup = function(el, options){
        var base = this;

        base.$el = $(el);
        base.el = el;

        base.$el.data("infoPopup", base);

        base.init = function(){
            base.options = $.extend({},$.infoPopup.defaultOptions, options);
            if($("#infoPopup").length == 0){
                $("body").append('<div id="infoPopup"></div>');
            }
            var elemType = base.options.elemType;
            var infoPopup = $("#infoPopup");
            infoPopup.dialog({
                autoOpen: true,
                width: base.options.width,
                zIndex:99999,
                title : base.options.title || "Information",
                modal: true,
                // resizable: true,
                closeOnEscape: true,
                dialogClass : "",
                buttons: {
                    "OK" : function(){
                        $(this).dialog( "close" );
                    }
                },
                close: function(){
                    $('body').removeClass('noscroll');
                    $("#infoPopup").remove();
                },
                open: function(){
                    infoPopup.html(base.$el.html());
                    var closeButton = infoPopup.parent().find(".ui-dialog-titlebar-close");
                    if(closeButton.parent().find("a.fullScreen").length==0)
                    {
                        closeButton.after('<a title="Maximize" href="#" role="button" style="float: right;margin-right: 13px;margin-top: 0px;" class="fullScreen ui-corner-all"><span class="ui-icon ui-icon-arrow-4-diag">Fullscreen</span></a>');
                        var fullScreenLink = closeButton.parent().find("a.fullScreen").click(function(){
                            var isFullS = infoPopup.attr("maximized");
                            if(!isFullS)
                            {
                                $(this).find("span").addClass("ui-icon-arrow-1-sw").removeClass("ui-icon-arrow-4-diag");
                                $(this).attr("title", "Resize to original size");
                                var h = window.innerHeight ? window.innerHeight : $(window).height();
                                var w = $(window).width() - 2;
                                h -= 5;
                                infoPopup.parent().css("position", "fixed");
                                infoPopup.dialog("widget").animate({
                                    width: w+'px',
                                    height:h+'px'
                                  }, {
                                  duration: 100,
                                  step: function() {
                                    infoPopup.dialog('option', 'position', 'top');
                                  }
                                });
                                infoPopup.dialog('option', 'resizable', false);
                                infoPopup.dialog('option', 'draggable', false);
                                //infoPopup.height(h + "px");
                                h -= 100;
                                infoPopup.find(elemType).height(h + "px");
                                infoPopup.find(elemType).width((w-30) + "px");
                                infoPopup.attr("maximized", "true");
                                $('body').addClass('noscroll');
                            }
                            else
                            {
                                $(this).attr("title", "Maximize");
                                $(this).find("span").addClass("ui-icon-arrow-4-diag").removeClass("ui-icon-arrow-1-sw");
                                infoPopup.parent().css("position", "absolute");
                                infoPopup.dialog("widget").animate({
                                    width: base.options.width,
                                    height:base.options.height
                                  }, {
                                  duration: 100,
                                  step: function() {
                                    infoPopup.dialog('option', 'position', 'center');
                                  }
                                });
                                infoPopup.dialog('option', 'resizable', true);
                                infoPopup.dialog('option', 'draggable', true);
                                infoPopup.find(elemType).height("600px").width("100%");
                                infoPopup.removeAttr("maximized");
                                $('body').removeClass('noscroll');
                            }
                            return false;
                        });
                        infoPopup.attr("maximized", "true");
                        closeButton.parent().find("a.fullScreen").trigger("click");
                    }
                    else
                    {
                        if(infoPopup.attr("maximized"))
                        {
                            infoPopup.removeAttr("maximized");
                        }
                        else
                        {
                            infoPopup.attr("maximized", "true");
                        }
                        closeButton.parent().find("a.fullScreen").trigger("click");
                    }
                    if(base.options.maximized){
                        infoPopup.removeAttr("maximized");
                        closeButton.parent().find("a.fullScreen").trigger("click");
                    }
                }
            });
        };
        base.init();
    };
    $.infoPopup.defaultOptions = {
        elemType: "iframe",
        width: "80%",
        height: "650px"
    };

    $.fn.infoPopup = function(options){
        return this.each(function(){
            (new $.infoPopup(this, options));
        });
    };
})(jQuery);