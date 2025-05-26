(function ($) {
    $.sslGuideButton = function(el, options){
        var base = this;

        base.$el = $(el);
        base.el = el;

        base.$el.data("sslGuideButton", base);

        base.init = function(){
            base.options = $.extend({},$.sslGuideButton.defaultOptions, options);
            if($("#sslGuidePanel").length == 0){
                $("body").append('<div id="sslGuidePanel"></div>');
            }
            var sslGuidePanel = $("#sslGuidePanel");
            sslGuidePanel.dialog({
                autoOpen: false,
                width: "80%",
                zIndex:99999,
                title : "SSL Guide: ",
                modal: true,
                resizable: true,
                closeOnEscape: true,
                dialogClass : "",
                buttons: {
                    "OK" : function(){
                        $(this).dialog( "close" );
                    }
                },
                close: function(){
                    $('body').removeClass('noscroll');
                },
                open: function(){
                    var closeButton = sslGuidePanel.parent().find(".ui-dialog-titlebar-close");
                    if(closeButton.parent().find("a.fullScreen").length==0)
                    {
                        closeButton.after('<a title="Maximize" href="#" role="button" style="float: right;margin-right: 13px;margin-top: 0px;" class="fullScreen ui-corner-all"><span class="ui-icon ui-icon-arrow-4-diag">Fullscreen</span></a>');
                        var fullScreenLink = closeButton.parent().find("a.fullScreen").click(function(){
                            var isFullS = sslGuidePanel.attr("maximized");
                            if(!isFullS)
                            {
                                $(this).find("span").addClass("ui-icon-arrow-1-sw").removeClass("ui-icon-arrow-4-diag");
                                $(this).attr("title", "Resize to original size");
                                var h = window.innerHeight ? window.innerHeight : $(window).height();
                                var w = $(window).width() - 2;
                                h -= 5;
                                sslGuidePanel.parent().css("position", "fixed");
                                sslGuidePanel.dialog("widget").animate({
                                    width: w+'px',
                                    height:h+'px'
                                  }, {
                                  duration: 100,
                                  step: function() {
                                    sslGuidePanel.dialog('option', 'position', 'top');
                                  }
                                });
                                sslGuidePanel.dialog('option', 'resizable', false);
                                sslGuidePanel.dialog('option', 'draggable', false);
                                //sslGuidePanel.height(h + "px");
                                h -= 100;
                                sslGuidePanel.find("iframe").height(h + "px");
                                sslGuidePanel.find("iframe").width((w-30) + "px");
                                sslGuidePanel.attr("maximized", "true");
                                $('body').addClass('noscroll');
                            }
                            else
                            {
                                $(this).attr("title", "Maximize");
                                $(this).find("span").addClass("ui-icon-arrow-4-diag").removeClass("ui-icon-arrow-1-sw");
                                sslGuidePanel.parent().css("position", "absolute");
                                sslGuidePanel.dialog("widget").animate({
                                    width: '80%',
                                    height:'650px'
                                  }, {
                                  duration: 100,
                                  step: function() {
                                    sslGuidePanel.dialog('option', 'position', 'center');
                                  }
                                });
                                sslGuidePanel.dialog('option', 'resizable', true);
                                sslGuidePanel.dialog('option', 'draggable', true);
                                sslGuidePanel.find("iframe").height("600px").width("100%");
                                sslGuidePanel.removeAttr("maximized");
                                $('body').removeClass('noscroll');
                            }
                            return false;
                        });
                        // sslGuidePanel.attr("maximized", "true");
                        // closeButton.parent().find("a.fullScreen").trigger("click");
                    }
                    else
                    {
                        if(sslGuidePanel.attr("maximized"))
                        {
                            sslGuidePanel.removeAttr("maximized");
                        }
                        else
                        {
                            sslGuidePanel.attr("maximized", "true");
                        }
                        closeButton.parent().find("a.fullScreen").trigger("click");
                    }
                }
            });
            $(el).off().on("click", function () {
                var elm = $(this);
                if (elm.hasClass("ui-state-disabled"))
                    return false;
                var sslGuidePanel = $("#sslGuidePanel");
                sslGuidePanel.html('<iframe id="sslGuideIframe" onload="$(\'#sslGuidePanel\').unblock()" width="100%" height="600px" src="/WebInterface/ssl_guide.html" style="margin:0px;padding:0px;" marginWidth="0" marginHeight="0" frameBorder="0" scrolling="scrolling"></iframe>');
                sslGuidePanel.dialog("open");
                sslGuidePanel.block({
                    message:  'Please Wait..',
                    css: {
                        width:100,
                        border: 'none',
                        padding: '10px',
                        backgroundColor: '#000',
                        '-webkit-border-radius': '10px',
                        '-moz-border-radius': '10px',
                        opacity: .5,
                        color: '#fff',
                        'text-align':'left'
                    }
                });
                return false;
            });
        };
        base.init();
    };
    $.sslGuideButton.defaultOptions = {
        parent: "div"
    };

    $.fn.sslGuideButton = function(options){
        return this.each(function(){
            (new $.sslGuideButton(this, options));
        });
    };
})(jQuery);