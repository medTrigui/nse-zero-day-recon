(function($){
    $.suggestedSettings = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;

        var mapLabels = {

        };

        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;

        base.template = '<div class="suggested customForm" style="width: 100%"><h4>Advanced Custom Settings:</h4><div style="padding:5px 10px;margin:2px;" class="ui-state-highlight ui-corner-all warning"> <span style=" margin-right: 0.3em;position:relative;top:3px;display:inline-block;" class="ui-icon ui-icon-info"></span><em>Leave these at defaults unless you <strong>really</strong> know what you are doing and specifically need to alter a default value. Changing values here may prevent the connection from working or cause other unpredictable behavior.</em></div><table><tr><td><table><tr><td width="85%"><div class="section-header" style="margin-bottom: 10px;"><strong>Available Options</strong></div><div style="position:relative;" class="filter-wrapper"><label for="filterl">Filter : </label><input style="width: 150px;" type="text" class="inputBox filter" id="filterl" /><label><a href="javascript:void(0);" id="clearFilterl" class="clear-filter">x</a></label></div></td><td style="position:relative;"><span><a style="white-space:nowrap;max-width: 60px;top:10px !important;" class="button" id="removeSetting">&lt;-</a></span></td></tr></table></td><td><table><tr><td style="position:relative;"><span><a style="white-space:nowrap;max-width: 60px;top:10px !important;" class="button" id="addSetting">-&gt;</a></span></td><td width="85%"><div class="section-header" style="margin-bottom: 10px;"><strong>Selected Options</strong></div><div  style="position:relative;" class="filter-wrapper"><label for="filterr">Filter : </label><input style="width: 150px;" type="text" class="inputBox filter" id="filterr" /><label><a href="javascript:void(0);" id="clearFilterr" class="clear-filter">x</a></label></div></td></tr></table></td><td></td></tr><tr><td style="width:50%"><div style="margin:0px 2px;"><div class="LargeListBox ui-corner-all ui-widget-content nobg sideScroll"><ol id="suggestedSettingsAvailable" class="nobg"></ol></div></div></td><td style="width:50%"><div style="margin:0px 2px;"><div class="LargeListBox ui-corner-all ui-widget-content nobg sideScroll" style="max-width:700px;"><ol id="suggestedSettingsUsed" class="nobg selectable single"></ol></div></div></td></tr></table></div>';

        // Add a reverse reference to the DOM object
        base.$el.data("suggestedSettings", base);

        base.init = function(){
            base.options = $.extend({},$.suggestedSettings.defaultOptions, options);
            // Put your initialization code here
            base.$el.empty().append(base.template);
            base.$el.form();
            base.$el.find(".button").button();
            base.bindOptions(base.options.suggestions || "", base.options.existing);
            base.bindEvents();
        };

        base.bindOptions = function(items, existing){
            existing = existing || {};
            var suggestions = items.split(',').removeByVal("");
            var availableOptions = base.$el.find("#suggestedSettingsAvailable");
            var selectedOptions = base.$el.find("#suggestedSettingsUsed");
            for (var i = 0; i < suggestions.length; i++) {
                var curSuggestion = suggestions[i];
                if(curSuggestion){
                    var curItem = curSuggestion.split(":");
                    var key = curItem[0];
                    var defaultVal = curItem[1] || "";
                    var label = mapLabels[key] ? mapLabels[key] : key;
                    if(typeof existing[key] != "undefined"){
                        selectedOptions.append('<li class="ui-widget-content nobg" key="'+key+'" defaultVal="'+defaultVal+'" _value="'+existing[key]+'"><div class="label">'+ label +'</div><div class="defaultVal">'+defaultVal+'</div><div class="value">'+existing[key]+'</div></li>');
                    }
                    else{
                        availableOptions.append('<li class="ui-widget-content nobg" key="'+key+'" defaultVal="'+defaultVal+'"><div class="label">'+ label +'</div><div class="defaultVal">'+defaultVal+'</div><div class="value"></div></li>');
                    }
                }
            }
        };

        base.bindEvents = function(){
            var availableOptions = base.$el.find("#suggestedSettingsAvailable");
            var selectedOptions = base.$el.find("#suggestedSettingsUsed");
            base.$el.on("click", "li", function(){
                $(this).closest("ol").find("li.ui-widget-header").removeClass('ui-widget-header');
                $(this).addClass('ui-widget-header');
            });

            base.$el.on("dblclick", "li", function(){
                $(this).closest("ol").find("li.ui-widget-header").removeClass('ui-widget-header');
                $(this).addClass('ui-widget-header');
                if($(this).closest("ol").is("#suggestedSettingsAvailable")){
                    base.$el.find("#addSetting").click();
                }
                else{
                    var item = $(this);
                    var key = item.attr("key");
                    var label = mapLabels[key] || key;
                    var defaultVal = item.attr("_value") || item.attr("defaultVal");
                    jPrompt(label + ": ", unescape(defaultVal), "Input", function(value) {
                        if(value != null){
                            item.attr("_value", value);
                            item.find(".value").text(value);
                        }
                    });
                }
            });

            var delay = (function() {
                var timer = 0;
                return function(callback, ms) {
                    clearTimeout(timer);
                    timer = setTimeout(callback, ms);
                };
            })();

            base.$el.on("keyup", ".filter", function(evt){
                var evt = (evt) ? evt : ((event) ? event : null);
                var phrase = this.value;
                var listToFilter = $(this).is("#filterr") ? selectedOptions : availableOptions;
                if($(this).attr("prevp") == phrase)
                    return;
                $(this).attr("prevp", phrase);
                delay(function() {
                    listToFilter.find("li").hide();
                    listToFilter.find("li:Contains('" + phrase + "')").show();
                }, 500);
            });

            base.$el.on("click", ".clear-filter", function(evt){
                $(this).closest('div').find("input").val("").trigger('keyup');
            });

            base.$el.on("click", "#removeSetting, #addSetting", function(){
                if($(this).is("#addSetting")){
                    var item = availableOptions.find("li.ui-widget-header");
                    if(item && item.length>0){
                        var key = item.attr("key");
                        var label = mapLabels[key] || key;
                        var defaultVal = item.attr("defaultVal");
                        jPrompt(label + ": ", unescape(defaultVal), "Input", function(value) {
                            if(value != null){
                                item.attr("_value", value);
                                item.find(".value").text(value);
                                item.removeClass('ui-widget-header');
                                selectedOptions.append(item);
                            }
                        });
                    }
                }
                else
                {
                    var item = selectedOptions.find("li.ui-widget-header");
                    if(item && item.length>0){
                        item.removeClass('ui-widget-header');
                        availableOptions.append(item);
                    }
                }
            });
        };

        // Run initializer
        base.init();
    };

    $.suggestedSettings.defaultOptions = {
    };

    $.fn.suggestedSettings = function(options){
        return this.each(function(){
            (new $.suggestedSettings(this, options));
        });
    };

    // This function breaks the chain, but returns
    // the suggestedSettings if it has been attached to the object.
    $.fn.getsuggestedSettings = function(){
        this.data("suggestedSettings");
    };

})(jQuery);