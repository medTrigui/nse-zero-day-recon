/*!
* Custom DataTable - a jQuery plugin to help handling millions of rows in any list using virtual scroll
*
* http://crushFTP.com/
*
* Copyright @ CrushFTP
*
* Date: Mon, July 29 2015
*
* Author: Vipul Limbachiya
*
* http://UrvaTechlabs.com
*/
(function($) {
    $.dataTable = function(el, options) {
        var base = this;
        base.$el = $(el);
        base.$el.data("dataTable", base);
        var lastShownRange, $scrollElem;
        var init = function() {
            base.options = $.extend({}, $.dataTable.defaultOptions, options);
            base.$el.css("height", base.options.height).addClass("custom-data-table").empty().append(base.options.scrollElemTemplate);
            $scrollElem = base.$el.find(".custom-data-table-scroll");
            bindEvents();
            render();
        };
        var bindEvents = function(){
            var delay = (function () {
                var timer = 0;
                return function (callback, ms) {
                    clearTimeout(timer);
                    timer = setTimeout(callback, ms);
                };
            })();
            base.$el.scroll(function(){
                delay(function(){
                    render();
                }, 20);
            });
            if(typeof base.options.onDoubleClick === "function" && typeof base.options.onClick === "undefined")
            {
                base.$el.unbind("dblclick.dataTable").bind("dblclick.dataTable", base.options.onDoubleClick);
            }
            if(typeof base.options.onClick === "function")
            {
                if(typeof base.options.onDoubleClick === "undefined")
                {
                    base.$el.unbind("click.dataTable").bind("click.dataTable", base.options.onClick);
                }
                else
                {
                    base.$el.unbind("click.dataTable").bind("click.dataTable", function(evt){
                        var $button=$(this);
                        if ($button.data('alreadyclicked')){
                            $button.data('alreadyclicked', false);
                            if ($button.data('alreadyclickedTimeout')){
                                clearTimeout($button.data('alreadyclickedTimeout'));
                            }
                            base.options.onDoubleClick(evt);
                        }else{
                            $button.data('alreadyclicked', true);
                            var alreadyclickedTimeout=setTimeout(function(){
                                $button.data('alreadyclicked', false);
                            },300);
                            base.options.onClick(evt);
                            $button.data('alreadyclickedTimeout', alreadyclickedTimeout);
                        }
                    });
                }
            }
            if(typeof base.options.onKeyDown === "function")
            {
                base.$el.unbind("keydown.dataTable").bind("keydown.dataTable", base.options.onKeyDown).attr("tabindex", "1");
            }
            if(typeof base.options.onKeyUp === "function")
            {
                base.$el.unbind("keyup.dataTable").bind("keyup.dataTable", base.options.onKeyUp).attr("tabindex", "1");
            }
            if(typeof base.options.onFocus === "function")
            {
                base.$el.unbind("focus.dataTable").bind("focus.dataTable", base.options.onMouseIn).attr("tabindex", "1");
            }
            if(typeof base.options.onContext === "function")
            {
                base.$el.unbind("contextmenu.dataTable").bind("contextmenu.dataTable", base.options.onContext);
            }
        };
        var render = function(force) {
            if(typeof base.options.onRenderStart === "function")
                base.options.onRenderStart();
            var data = base.options.dataSource;
            calculateDimensions(data);
            var curLinesToShow = linesToShow(data);
            var minLength = curLinesToShow.start;
            var maxLength = curLinesToShow.end;
            var height = base.options.lineHeight;
            var elem = $scrollElem;
            var template = base.options.template;
            if(data.length==0)
            {
                elem.parent().find(".custom-data-table-scroll").empty();
                lastShownRange = {};
                if(base.options.emptyTemplate){
                    var elm = $("<div>"+base.options.emptyTemplate+"</div>");
                    elem.append(elm.addClass('empty-template'));
                }
                base.$el.trigger("render");
                if(typeof base.options.onRender === "function")
                    base.options.onRender();
                return;
            }
            else{
                elem.find(".empty-template").remove();
            }
            function random(length, numeric, possible) {
                length = length || 8;
                var randomId = "";
                possible = possible || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                if (numeric) {
                    possible = "0123456789";
                }
                for (var i = 0; i < length; i++)
                    randomId += possible.charAt(Math.floor(Math.random() * possible.length));
                return randomId;
            }
            function renderTemplate(params, index)
            {
                var str = template + "";
                if(typeof base.options.renderMethod !== "undefined")
                {
                    str = base.options.renderMethod(str, params, index);
                }
                else if(typeof window.Mustache !== "undefined")
                {
                    str = str.replace(/{{/, "{{{").replace(/}}/, "}}}");
                    str = Mustache.render(str, params);
                }
                else
                {
                    for (param in params) {
                        var re = new RegExp('{{' + param + '}}', 'g');
                        str = str.replace(re, crush.textEncode(params[param]));
                    }
                    str = str.replace(new RegExp('{{random}}', 'g'), random());
                    str = str.replace(new RegExp('{{index}}', 'g'), index);
                }
                return str;
            }
            if(typeof lastShownRange !="undefined" && !force)
            {
                var lastMin = lastShownRange.start;
                var lastMax = lastShownRange.end;
                if(lastMin == minLength && lastMax == maxLength)
                    return false;
                if(minLength>=lastMin && minLength<lastMax)
                {
                    for(var i=lastMin;i<minLength;i++)
                    {
                        elem.find(".custom-data-row[_index="+i+"]").remove();
                    }
                    for(var i=lastMax;i<maxLength;i++)
                    {
                        var top = i * height;
                        if(elem.find(".custom-data-row[_index="+i+"]").length==0)
                        {
                            var elm = $(renderTemplate(data[i], i)).css("top", top+"px").data("dataRow", data[i]);
                            elem.append(elm);
                        }
                    }
                }
                else if(maxLength<=lastMax && maxLength>lastMin)
                {
                    for(var i=maxLength;i<lastMax;i++)
                    {
                        elem.find(".custom-data-row[_index="+i+"]").remove();
                    }
                    for(var i=lastMin;i>=minLength;i--)
                    {
                        var top = i * height;
                        if(elem.find(".custom-data-row[_index="+i+"]").length==0)
                        {
                            var elm = $(renderTemplate(data[i], i)).css("top", top+"px").data("dataRow", data[i]);
                            elem.append(elm);
                        }
                    }
                }
                else
                {
                    elem.find(".custom-data-row").remove();
                    for(var i=minLength;i<maxLength;i++)
                    {
                        var top = i * height;
                        if(elem.find(".custom-data-row[_index="+i+"]").length==0)
                        {
                            var elm = $(renderTemplate(data[i], i)).css("top", top+"px").data("dataRow", data[i]);
                            elem.append(elm);
                        }
                    }
                }
                lastShownRange = curLinesToShow;
            }
            else
            {
                lastShownRange = curLinesToShow;
                elem.find("div").remove();
                for(var i=minLength;i<maxLength;i++)
                {
                    var top = i * height;
                    var elm = $(renderTemplate(data[i], i)).css("top", top+"px").data("dataRow", data[i]);
                    elem.append(elm);
                }
            }
            base.$el.trigger("render");
            if(base.options.scrollToEnd){
                base.$el.scrollTop(base.$el[0].scrollHeight);
                delete base.options.scrollToEnd;
            }
            if(typeof base.options.onRender === "function")
                base.options.onRender();
        };

        var calculateDimensions = function(data) {
            var heightOfPanel = base.$el.data("height") || base.options.height;
            if(base.$el.data("height")){
                base.$el.css("height", heightOfPanel);
                base.$el.removeData("height");
            }
            var visibleLinesCount = Math.ceil(heightOfPanel / base.options.lineHeight);
            visibleLinesCount += percentagesOf(visibleLinesCount, 10);
            base.options.visibleLinesCount = visibleLinesCount;
            var subElementHeight = data.length * base.options.lineHeight;
            subElementHeight = subElementHeight>=heightOfPanel ? subElementHeight : heightOfPanel;
            $scrollElem.height(subElementHeight);
            if(base.options.isolatedScroll && typeof $.fn.isolatedScroll != "undefined")
            {
                base.$el.isolatedScroll();
            }
        };

        var linesToShow = function(data) {
            var scrollPos = base.$el.scrollTop();
            var lineStart = Math.ceil(scrollPos / base.options.lineHeight);
            lineStart -= percentagesOf(base.options.visibleLinesCount, 10);
            lineStart = lineStart < 0 ? 0 : lineStart;
            var lineEnd = lineStart + base.options.visibleLinesCount;
            lineEnd = data.length >= lineEnd ? lineEnd : data.length;
            var diff = lineEnd - lineStart;
            if(diff < base.options.minLinesToShow)
            {
                lineStart -= Math.ceil(base.options.minLinesToShow/2);
                lineStart = lineStart < 0 ? 0 : lineStart;
                lineEnd = lineEnd + (base.options.minLinesToShow - diff) + 1;
                lineEnd = data.length >= lineEnd ? lineEnd : data.length;
            }
            return {
                start: lineStart,
                end: lineEnd
            };
        };
        var percentagesOf = function(number, perc) {
            return Math.ceil((number * perc) / 100);
        };
        this.rebind = function(options, force){
            this.options = $.extend({}, this.options, options);
            render(force);
            return this;
        };
        this.scroll = function(dir){
            if(dir == "up")
            {
                base.$el.scrollTop(0);
            }
            else
            {
                base.$el.scrollTop(base.$el[0].scrollHeight);
            }
            return this;
        };
        this.scrollToIndex = function(index){
            var scrollHeight = (index - 1) * base.options.lineHeight;
            base.$el.scrollTop(scrollHeight);
            return this;
        };
        init();
    };

    $.dataTable.defaultOptions = {
        lineHeight: 25,
        height: 500,
        minLinesToShow : 30,
        template: "<div class='custom-data-row' _index='{{index}}'>{{text}}</div>",
        emptyTemplate : "<div class='text-center'>No items to display</div>",
        scrollElemTemplate: "<div class='custom-data-table-scroll'></div>",
        isolateScroll : false
    };

    $.fn.dataTable = function(options) {
        return this.each(function() {
            var element = $(this);
            if(element.data('dataTable')) return;
            var plugin = new $.dataTable(this, options);
            element.data('dataTable', plugin);
        });
    };

    $.fn.getdataTable = function() {
        this.data("dataTable");
    };
})(jQuery);