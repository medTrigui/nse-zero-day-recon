/*
    Vipul Limbachiya
    http://vipullimbachiya.com
*/
/*
 * This program is free software. It comes without any warranty, to the extent permitted by applicable law.
 * You can redistribute it and/or modify it without any terms.
 * Save developers!! Use Chrome  http://www.google.co.in/chrome  Or Firefox http://www.mozilla.com/firefox/
*/


(function($){
    $.simpleMiniMap = function(el, options){
        var base = this;
        base.$el = $(el);
        base.el = el;
        base.$el.data("simpleMiniMap", base);
        base.init = function(){
            base.options = $.extend({}, $.simpleMiniMap.defaultOptions, options);
            if(base.$el.parent().parent().find(".minimapWrapper").length==0)
            {
                var _parent = base.$el.parent().parent();
                _parent.prepend('<div class="minimapWrapper"><div class="toTop ui-corner-top" title="Scroll to top">&and;</div><div class="miniMap ui-corner-all"><span class="positionMarker ui-corner-tr ui-corner-bl"></span></div><div class="toBottom ui-corner-bottom" title="Scroll to bottom">&or;</div></div>');
                base.miniMapWrapper = _parent.find(".minimapWrapper");
                base.miniMap = _parent.find(".miniMap");
                if(base.options.miniMapPosition == "right")
                    base.miniMapWrapper.css("float", "right").css("margin-left", "10px");
                else
                    base.miniMapWrapper.css("margin-right", "5px");
                if(!base.options.showScrollButtons)
                {
                    base.miniMapWrapper.find(".toTop, .toBottom").remove();
                    base.miniMap.css("height", base.$el.parent().height());
                }
                else
                {
                    base.miniMap.css("height", base.$el.parent().height() - 30);
                    $(".toTop, .toBottom", base.miniMapWrapper).click(function(){
                        if($(this).is(".toTop"))
                            base.$el.parent().scrollTo(base.$el.find(":first"), 500);
                        else
                            base.$el.parent().scrollTo(base.$el.find(":last"), 500);
                        return false;
                    });
                }
                var topPos = base.$el.parent().offset().top;
                base.miniMapWrapper.css("top", topPos);
                var handleMiniMap = base.miniMapWrapper.find(".positionMarker").draggable({
                    axis: "y",
                    containment: "parent",
                    drag: function(event, ui) {
                        base.minimapPositionChanged(handleMiniMap);
                    },
                    stop : function(event, ui){
                        base.dontScroll = false;
                    }
                });

                base.miniMap.bind('mousewheel', function(event, delta) {
                    var up = delta > 0,
                        vel = Math.abs(delta);
                    if(vel)
                    {
                        var parentHeight = base.miniMap.innerHeight() - handleMiniMap.outerHeight();
                        var top = handleMiniMap.offsetRelativeTo(base.miniMap).top;
                        var perc = (top * 100) / parentHeight;
                        var _perc = Math.floor(perc);
                        if(up)
                            _perc = _perc - vel;
                        else
                            _perc = _perc + vel;
                        if(_perc>100)
                            _perc=100;
                        else if(_perc<0)
                            _perc=0;
                        var topPos = (parentHeight * _perc) / 100;
                        handleMiniMap.css("top", topPos);
                        setTimeout(function(){
                            base.minimapPositionChanged(handleMiniMap);
                            setTimeout(function(){
                                base.dontScroll = false;
                            }, 10);
                        }, 10);
                    }
                    return false;
                });

                var logPanel = base.$el.parent().scroll(function(){
                    if(base.dontScroll)return;
                    var _height = base.$el.height() - logPanel.height();
                    var _scrollPos = $(this).scrollTop();
                    var perc = (100 * _scrollPos) / _height;
                    if(perc<0)perc=0;
                    if(perc>100)perc=100;
                    var parentHeight = base.miniMap.innerHeight() - handleMiniMap.outerHeight();
                    var topPos = (parentHeight * perc) / 100;
                    handleMiniMap.css("top", topPos);
                });
            }
        };

        base.minimapPositionChanged = function(handleMiniMap){
            base.dontScroll = true;
            handleMiniMap = handleMiniMap || base.miniMap.find(".positionMarker");
            var parentHeight = base.miniMap.innerHeight() - handleMiniMap.outerHeight();
            var top = handleMiniMap.offsetRelativeTo(base.miniMap).top;
            var perc = (top * 100) / parentHeight;
            var _perc = Math.floor(perc);
            if(_perc==99)_perc=100;
            var _height = base.$el.height();
            var _scrollPos = (_height * _perc) / 100;
            base.$el.parent().scrollTop(_scrollPos);
        };

        base.init();
    };
    $.simpleMiniMap.defaultOptions = {
        filterElem : ".highlight", //Can be filtered by any possible jquery selector
        showScrollButtons : true, //To show/hide scroll to top/bottom buttons
        titleBuilder : false, //If you want to customize title of marker, this is function, function(marker)
        beforeBuildMap : false, //method to call before building maf, function(mainElement, miniMapWrapper)
        afterBuildMap : false, //method to call after building maf, function(mainElement, miniMapWrapper)
        markerCSSClass : "marker", //CSS class for marker on minimap
        setMarkerBGBasedOnElement : false,
        miniMapPosition : "left"
    };

    $.fn.resizeMap = function()
    {
        var base = this.data("simpleMiniMap");
        if(!base.options.showScrollButtons)
        {
            base.miniMapWrapper.find(".toTop, .toBottom").remove();
            base.miniMap.css("height", base.$el.parent().height());
        }
        else
        {
            base.miniMap.css("height", base.$el.parent().height() - 30);
        }
    };

    $.fn.buildMap = function()
    {
        var base = this.data("simpleMiniMap");
        var matches = base.$el.find(base.options.filterElem);
        base.miniMap.find("span.marker").remove();
        var logArea = base.$el;
        var parentPos = logArea.offset();
        if(base.options.beforeBuildMap)
            base.options.beforeBuildMap(base.$el, base.minimapWrapper);
        if(matches.length>0)
        {
            var h = logArea.height();
            var h2 = base.miniMap.height();
            var markerClass = base.options.markerCSSClass || "marker";
            matches.each(function(){
                var match = $(this);
                var childPos = $(this).offset();
                var t = childPos.top - parentPos.top;
                var markerTop = (h2 * t) / h;
                markerTop = Math.round(markerTop);
                var marker;
                if(!base.options.noTitleOnMarker)
                {
                    var title = match.parent().text();
                    title = title.replace(/'/g, "&apos;").replace(/"/g, "&quot;");
                    if(base.options.titleBuilder)
                    {
                        title = base.options.titleBuilder(match);
                    }
                    marker = $("<span class='"+markerClass+"' style='top:"+markerTop+"px;' title='"+title+"'></span>");
                }
                else
                    marker = $("<span class='"+markerClass+"' style='top:"+markerTop+"px;'></span>");
                if(base.options.setMarkerBGBasedOnElement)
                {
                    var matchBG = match.css("background-color");
                    if(matchBG)
                        marker.css("background-color", matchBG);
                }
                base.miniMap.append(marker);
                marker.data("relem", match);
                marker.click(function(){
                    base.dontScroll = false;
                    var miniMapDragHandle = base.miniMap.find(".positionMarker").css("top", $(this).offsetRelativeTo(base.miniMap).top - 5);
                    setTimeout(function(){
                        base.minimapPositionChanged(miniMapDragHandle);
                        setTimeout(function(){
                            base.dontScroll = false;
                        }, 10);
                    }, 100);
                    return false;
                });
            });
        }
        if(base.options.afterBuildMap)
            base.options.afterBuildMap(base.$el, base.minimapWrapper);
    };

    $.fn.simpleMiniMap = function(options){
        return this.each(function(){
            (new $.simpleMiniMap(this, options));
        });
    };

    $.fn.offsetRelativeTo = function(el){
      var $el=$(el), o1=this.offset(), o2=$el.offset();
      o1.top  -= o2.top  - $el.scrollTop();
      o1.left -= o2.left - $el.scrollLeft();
      return o1;
    }
})(jQuery);