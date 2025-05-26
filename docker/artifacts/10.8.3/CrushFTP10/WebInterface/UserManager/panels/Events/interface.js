/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelEvents = {};
panelEvents.localization = {};
/****************************/

// Panel details
var panelName = "Events";
var pluginPlaceHolder,eventList,event_action_list;

// Localizations
panelEvents.localization = {
};

// Assign localizations
localizations.panels[panelName] = $.extend(panelEvents.localization, localizations.panels[panelName]);

// Interface methods
panelEvents.init = function(){
    pluginPlaceHolder = $("#pluginPlaceHolder", panelEvents._panel);
    eventList = $("#eventList", panelEvents._panel);
    event_action_list = $("#event_action_list", panelEvents._panel);
    applyLocalizations(panelName, localizations.panels);

    $("#ssh_private_key", panelEvents._panel).each(function(){
        $(this).addClass('maskPasswordOnURL urlWithParams').closest('div').find('.serverFilePickButton').removeClass('serverFilePickButton').addClass('serverFilePickWithParamsButton');
    });
    window.dataBindEvents.push(panelEvents.bindData);
    panelEvents.bindEvents();
};

panelEvents.clearForm = function(panel)
{
    panel = panel || panelEvents._panel;
    panel.find("input, select, textarea").each(function(){
        if($(this).attr("type")=="checkbox")
        {
            if($(this).closest("td").is(".checkboxArea"))return;
            crushFTP.UI.checkUnchekInput($(this));
        }
        else
        {
            $(this).val("");
        }
    });
};

panelEvents.hasRNETemplate = function(){
    var eventList = $("#eventList", panelEvents._panel);
    var templateAvailable;
    eventList.find("li").each(function(){
        var curItem = $(this);
        var controlData = curItem.data("controlData");
        var event_action_list = controlData.event_action_list;
        if(event_action_list == "(subscribe_reverse_notification_event_template)")
        {
            templateAvailable = controlData;
            return false;
        }
    });
    return templateAvailable;
}

panelEvents.bindData = function(userInfo, jsonDeep, panel, ignoreBind)
{
    if(!ignoreBind)
    {
        panelEvents.jsonDeep = jsonDeep;
        var events_subitem = false;
        try{
            events_subitem = jsonDeep["response_data"][0]["user_items"][0]["user"][0]["events"][0]["events_subitem"];
        }catch(ex){}
        if(events_subitem)
        {
            crushFTP.methods.rebuildSubItems(userInfo.user.events, "events");
            for(var i=0;i<events_subitem.length;i++)
            {
                var curItem = events_subitem[i];
                if(!curItem.id)
                {
                    curItem.id = [{text:crushFTP.methods.generateRandomPassword(10)}];
                    userInfo.user.events.events_subitem[i].id = curItem.id[0].text;
                }
            }
            jsonDeep["response_data"][0]["user_items"][0]["user"][0]["events"][0]["events_subitem"] = events_subitem;
            panelEvents.jsonDeep = jsonDeep;
        }
        else{
            if(userInfo.user.events && userInfo.user.events.inheritedFrom){
                try{
                    var currentUserInherited = userInfo.user.events.inheritedFrom;
                    if(currentUserInherited){
                        var parentUsers = crushFTP.storage("CurrentUserInheritanceDetails") || [];
                        var inheritedFrom;
                        for (var i = 0; i < parentUsers.length; i++) {
                            var curUser = parentUsers[i];
                            if(curUser && curUser.info && curUser.info.user && curUser.info.user.user_name && curUser.info.user.user_name == currentUserInherited){
                                inheritedFrom = curUser;
                                i = parentUsers.length+1;
                            }
                        }
                        if(inheritedFrom && inheritedFrom.xml){
                            var inheritedJson = $.xml2json(inheritedFrom.xml, true);
                            if(inheritedJson
                                && inheritedJson["response_data"]
                                && inheritedJson["response_data"][0]
                                && inheritedJson["response_data"][0]["user_items"]
                                && inheritedJson["response_data"][0]["user_items"][0]
                                && inheritedJson["response_data"][0]["user_items"][0]["user"]
                                && inheritedJson["response_data"][0]["user_items"][0]["user"][0]
                                && inheritedJson["response_data"][0]["user_items"][0]["user"][0]["events"])
                                jsonDeep["response_data"][0]["user_items"][0]["user"][0]["events"] = inheritedJson["response_data"][0]["user_items"][0]["user"][0]["events"];
                                panelEvents.jsonDeep = jsonDeep;
                        }
                    }
                }catch(ex){}
            }
        }

        var options = {
              rootTagName: 'events'
        };
    }

    var dataPanel = panel || panelEvents._panel;
    panelEvents.clearForm(dataPanel);
    var ftpDirPanel = $("#ftpDirPanel", panelEvents._panel).hide();

    if(panel)
    {
        panel.removeClass("inheritValSet");
    }
    //Binding event list
    var eventList = $("#eventList", dataPanel).empty();
    var _index = 0;
    userManager.UI.multiOptionControlDataBind(userInfo.user
        , "events"
        , eventList
        , function addNewButton(curItem){
            if(curItem && curItem.name && curItem.id.toString() != "null")
            {
                var name = crushFTP.methods.textEncode(curItem.name);
                var uid = curItem.id;
                _index++;
                return $("<li uid='"+uid+"' _index='"+_index+"' class='ui-widget-content'>"+decodeURIComponent(unescape(name))+"</li>");
            }
            else
            {
                _index++;
                return false;
            }
        }
    , !panel);

    var events = false;
    try{
        events = panelEvents.jsonDeep["response_data"][0]["user_items"][0]["user"][0]["events"];
    }catch(ex){events = false;}
    var _events = false;
    if(events && events.length >0)
    {
        _events = $.extend(true, {}, events[0]);
    }
    if(_events)
    {
        eventList.find("li").each(function(index){
            var json = false;
            if(_events && _events["events_subitem"] && _events["events_subitem"].length>index)
            {
                json = _events["events_subitem"][index];
            }
            else{
                json = _events;
            }
            if(json){
                //console.log("plugin data", json);
                $(this).data("pluginData", json);
            }
        });
    }
    panelEvents.bindPluginsList(dataPanel);
    if(!panel)
    {
        panelEvents._panel.find(".inheritance-set").removeClass('inheritance-set')
        $("#userEvents", dataPanel).closest("fieldset").removeClass("inheritSet");
        userManager.data.setInheritPropertyOfSection($("#userEvents", dataPanel), "events", true);
    }
    userManager.UI.panelsPostbindEvent(dataPanel, panel);
    userManager.UI.togglePanels(panelEvents._panel);
    if($("#event_if_cb", panelEvents._panel).is(":checked") && $("#event_if_list", panelEvents._panel).val()!="")
    {
        ftpDirPanel.show();
    }
    if(window.panelSettings){
        panelSettings.updateRNTemplateStatus();
    }
}

panelEvents.bindPluginsList = function(panel, refresh, callback){
    var dataPanel = panel || panelEvents._panel;
    function continueBinding(){
        //Bind available plugins
        var availablePlugins = $(document).data("GUIXMLPrefs").plugins.plugins_subitem;
        crushFTP.methods.rebuildSubItems(availablePlugins, "plugins_subitem");
        var pluginsAvailable = $("#pluginsAvailable", dataPanel);
        var addedPlugins = [];
        var pluginOpts = $('<optgroup label="Plugin"></optgroup>');
        function addPluginName(item)
        {
            if(jQuery.isArray(item) && item.length>0)
            {
                for(var i=0;i<item.length;i++)
                {
                    addPluginName(item[i]);
                }
            }
            else
            {
                var pluginName = item.pluginName;
                if(pluginName && !addedPlugins.has(pluginName))
                {
                    addedPlugins.push(pluginName);
                    var optionItem = $("<option value='"+item.pluginName+"'>"+pluginName+" (User Defined)</option>");
                    pluginOpts.append(optionItem);
                    optionItem.data("pluginDetails", item);
                }

                if(item.subItem && item.subItem.length > 0)
                {
                    pluginName = pluginName + ":" + item.subItem;
                }
                if(pluginName && pluginName.length > 0)
                {
                    var optionItem = $("<option value='"+pluginName+"'>"+pluginName+"</option>");
                    pluginOpts.append(optionItem);
                    optionItem.data("pluginDetails", item);
                }
            }
        }

        if(availablePlugins)
        {
            pluginsAvailable.empty();
            for(var i=0;i<availablePlugins.length;i++)
            {
                if(availablePlugins[i].plugins_subitem_subitem)
                    addPluginName(availablePlugins[i].plugins_subitem_subitem);
            }
            if(availablePlugins.length==0){
                addPluginName("CrushTask");
            }
            pluginsAvailable.append(pluginOpts);
        }
        else{
            addPluginName("CrushTask");
        }

        var availableJobs = $(document).data("AvailableJobsNoEvents");
        if(availableJobs && availableJobs.length>0)
        {
            var jobOpts = $('<optgroup label="Job"></optgroup>');
            for (var i = 0; i < availableJobs.length; i++) {
                jobOpts.append("<option value=\"Job:"+crushFTP.methods.textEncode(unescape(availableJobs[i]))+"\">"+crushFTP.methods.textEncode(unescape(availableJobs[i]))+"</option>");
            }
            pluginsAvailable.append(jobOpts);
        }
    }
    if(refresh){
        var pluginsAvailable = $("#pluginsAvailable", dataPanel);
        var curSelection = pluginsAvailable.val();
        crushFTP.UI.showLoadingIndicator(true);
        crushFTP.data.getXMLPrefsDataFromServer("GUIXMLPrefs", false, function(allPrefs){
            crushFTP.UI.hideLoadingIndicator(true);
            continueBinding();
            pluginsAvailable.val(curSelection);
            if(callback)
                callback();
        });
    }
    else
    {
        continueBinding();
        if(callback)
            callback();
    }
}

var localEventLoadDelay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

panelEvents.loadEventInfo = function(eventVal, loadedFromDD, selected, np)
{
    if(np){
            panelEvents.loadEventInfoProxy(eventVal, loadedFromDD, selected);
    }
    else{
        localEventLoadDelay(function(){
            panelEvents.loadEventInfoProxy(eventVal, loadedFromDD, selected);
        }, 100);
    }
}

panelEvents.loadEventInfoProxy = function(eventVal, loadedFromDD, selected)
{
    var eventList = $("#eventList", panelEvents._panel);
    var isLinked = false;
    window.loadingTaskData = true;
    selected = $("li.ui-selected", eventList);
    if(selected.text().toLowerCase().indexOf("link :")==0 || selected.text().toLowerCase().indexOf("link:")==0)
    {
        isLinked = true;
    }
    if(isLinked)
    {
        panelEvents.loadLinkedEventInfo(eventVal, loadedFromDD, selected);
        return false;
    }
    var pluginsAvailable = $("#pluginsAvailable", panelEvents._panel);
    $("#emailActionPanel, #pluginActionPanel", panelEvents._panel).hide();
    $("#eventActionPanel").unblock().find("input,textarea,select").removeAttr("disabled");
    $(".nonTemplate", panelEvents._panel).show();
    $(".nonTemplateBtn", panelEvents._panel).removeClass("ui-state-disabled");

    if(window.panelSettings){
        panelSettings.updateRNTemplateStatus();
    }
    if(eventVal !== "(subscribe_reverse_notification_event_template)" && panelEvents.hasRNETemplate()){
        event_action_list.find("option[value='(subscribe_reverse_notification_event_template)']").wrap('<span/>');
    }
    if(eventVal == "(send_email)")
    {
        $("#emailActionPanel", panelEvents._panel).show();
        setTimeout(function(){
            window.loadingTaskData = false;
            panelEvents.eventDataChanged(selected);
        }, 100);
        $(".non-reverse", panelEvents._panel).show();
    }
    else if(eventVal == "(reverse)"){
        $(".non-reverse", panelEvents._panel).hide();
        setTimeout(function(){
            window.loadingTaskData = false;
            panelEvents.eventDataChanged(selected);
        }, 100);
    }
    else if(eventVal == "(run_plugin)" || eventVal == "(subscribe_reverse_notification_event_template)")
    {
        $(".non-reverse", panelEvents._panel).show();
        if(eventVal == "(subscribe_reverse_notification_event_template)"){
            $(".nonTemplate", panelEvents._panel).hide();
            $(".nonTemplateBtn", panelEvents._panel).addClass("ui-state-disabled");
        }
        window.afterDesignerLoads = function(){
            setTimeout(function(){
                window.loadingTaskData = false;
                panelEvents.eventDataChanged(selected);
                crushFTP.UI.hideLoadingIndicator(true);
                if(window.panelSettings){
                    panelSettings.updateRNTemplateStatus();
                }
            }, 500);
        }
        var pluginActionPanel = $("#pluginActionPanel", panelEvents._panel).show();
        window.embedPlugin = true;
        var jsonDeep = panelEvents.jsonDeep;
        var pluginToLoad = $("#pluginName", panelEvents._panel).val();
        var event_plugin_list = unescape($("#event_plugin_list", panelEvents._panel).val());
        if(event_plugin_list && event_plugin_list.lastIndexOf(":") == event_plugin_list.length-1)
        {
            event_plugin_list = event_plugin_list.substring(0, event_plugin_list.lastIndexOf(":"));
        }
        if(!event_plugin_list || event_plugin_list == "undefined" || typeof event_plugin_list == "undefined" || event_plugin_list.length == 0)
        {
            event_plugin_list = "CrushTask (User Defined)";
            $("#event_plugin_list", panelEvents._panel).val("CrushTask (User Defined)").trigger("change");
        }
        var loadPlugin = true;
        if(event_plugin_list.indexOf("Job:")<0){
            pluginsAvailable.find("option").each(function() { this.selected = (this.text == event_plugin_list); });
        }
        else{
            pluginsAvailable.val(event_plugin_list);
            loadPlugin = false;
            pluginPlaceHolder.hide();
            pluginToLoad = "";
        }
        pluginPlaceHolder.show();
        if(event_plugin_list.indexOf("(User Defined)")<0)
        {
            loadPlugin = false;
            pluginPlaceHolder.hide();
        }
        if(!pluginToLoad || pluginToLoad.length==0)
        {
            pluginToLoad = pluginsAvailable.val();
            if(pluginToLoad.indexOf("Job:") == 0)
            {
                loadPlugin = false;
                pluginPlaceHolder.hide();
            }
            else
                $("#pluginName", panelEvents._panel).val(pluginToLoad).trigger("change").trigger("textchange");
        }

        try{
            var eventList = $("#eventList", panelEvents._panel);
            var selected = $("li.ui-selected", eventList);
            var index = parseInt(selected.attr("_index"));
            var pluginData = selected.data("pluginData");
            var isLinked = false;
            if(pluginData)
            {
                var pluginName = "";
                if(typeof pluginData.pluginName != "undefined" && typeof pluginData.pluginName.length != "undefined")
                {
                    pluginName = pluginData.pluginName[0].text;
                }
                else
                {
                    pluginName = $("#pluginName", panelEvents._panel).val();
                    pluginData.pluginName = [{text:pluginName}];
                }
                if(pluginName != $("#pluginsAvailable", panelEvents._panel).val() && loadedFromDD)
                {
                    pluginData = false;
                }
            }
            if(selected.text().toLowerCase().indexOf("link :")==0 || selected.text().toLowerCase().indexOf("link:")==0)
            {
                isLinked = true;
            }
            if(loadPlugin)
            {
                crushFTP.UI.showLoadingIndicator({});
                var exid = selected.attr("uid");
                var uid = exid || crushFTP.methods.generateRandomPassword(10);
                selected.attr("uid", uid);
                function continueLoadingPlugin(){
                    crushFTP.UI.showLoadingIndicator({});
                    crushFTP.methods.getScript("/WebInterface/Preferences/js/crushftp.localizations.js", function() {
                        crushFTP.UI.showLoadingIndicator({});
                        crushFTP.methods.getScript("/WebInterface/Preferences/js/crushftp.interface.js", function() {
                            crushFTP.UI.showLoadingIndicator({});
                            loadPanel("Plugins", true, {
                                loadPlugin : pluginToLoad,
                                pluginID : uid,
                                returnXML : true,
                                placeHolder : pluginPlaceHolder,
                                dataItem : pluginData,
                                baseUrl : "/WebInterface/Preferences/",
                                hideButtons : true,
                                ignoreChanges : true,
                                callbackOnload : function()
                                {
                                    crushFTP.UI.showLoadingIndicator({});
                                    var eventList = $("#eventList", panelEvents._panel);
                                    var selected = eventList.find("li.ui-selected");
                                    if(selected)
                                    {
                                        if(selected.text().toLowerCase().indexOf("link :")==0 || selected.text().toLowerCase().indexOf("link:")==0)
                                        {
                                            // $("#eventActionPanel").block({
                                            //     message:  '',
                                            //     overlayCSS: { opacity: 0.1, cursor: 'normal'}
                                            // });
                                            $("#eventActionPanel").find("input,textarea,select").attr("disabled","disabled");
                                        }
                                        else
                                            $("#eventActionPanel").unblock().find("input,textarea,select").removeAttr("disabled");
                                    }
                                    $("#event_if_list", panelEvents._panel).trigger('change');
                                    setTimeout(function(){
                                        window.loadingTaskData = false;
                                        $("#event_if_list", panelEvents._panel).trigger('change');
                                        if (event_plugin_list == 'CrushTask (User Defined)' && $(document).data('app_enterprise')){
                                            $("#copyToJobs", panelEvents._panel).show().parent('span.enterpriseFeature').show().css({
                                                'position':'relative',
                                                'display':'inline-block'
                                            });
                                        }
                                    }, 500);
                                }
                            });
                        });
                    });
                }
                continueLoadingPlugin();
            }
            else
            {
                window.loadingTaskData = false;
            }
        }
        catch(ex)
        {
            if(ex && ex.toString() != "")
            {
                crushFTP.UI.growl("Error", DOMPurify.sanitize(ex), true);
            }
        }
    }
    var ftpDirPanel = $("#ftpDirPanel", panelEvents._panel);
    if($("#event_if_cb", panelEvents._panel).is(":checked") && $("#event_if_list", panelEvents._panel).val()!="")
    {
        ftpDirPanel.show();
    }

    $("#event_dir_data", panelEvents._panel).unbind("textchange.always").bind("textchange.always", function(){
        if($(this).val()){
            $("#event_dir_data_empty").hide();
        }
        else
            $("#event_dir_data_empty").show();
    });

    $("#event_if_list", panelEvents._panel).unbind("change.always").bind("change.always", function(){
        var that = this;
        setTimeout(function(){
            if($(that).val()!="")
                crushFTP.UI.checkUnchekInput($("#event_if_cb", panelEvents._panel), true);

            ftpDirPanel.find(".noreal").show();
            ftpDirPanel.find(".real").hide();
            ftpDirPanel.find("#event_dir_data").attr('valtype', 'dirPathAllowStar');
            $("#realURLOption").hide();
            if($(that).val().lastIndexOf("_dir")>=0)
            {
                ftpDirPanel.show();
            }
            else if($(that).val().lastIndexOf("real_url")>=0)
            {
                ftpDirPanel.show();
                ftpDirPanel.find(".noreal").hide();
                ftpDirPanel.find(".real").show();
                ftpDirPanel.find("#event_dir_data").removeAttr('valtype');
                panelEvents._panel.find(".SSHOptionsHandle").trigger('textchange');
                $("#realURLOption").show();
            }
            else
            {
                ftpDirPanel.hide();
            }
        },100);
    });

    $("#event_after_list", panelEvents._panel).unbind().change(function(){
        if($(this).val()!="")
            crushFTP.UI.checkUnchekInput($("#event_after_cb", panelEvents._panel), true);
        panelEvents.eventDataChanged();
    });
    $("#event_if_list", panelEvents._panel).trigger('change');
    setTimeout(function(){
        $("#event_if_list", panelEvents._panel).trigger('change');
        $("#event_dir_data", panelEvents._panel).trigger('textchange');
    }, 500);
};

panelEvents.loadLinkedEventInfo = function(eventVal, loadedFromDD, selected)
{
    var eventList = $("#eventList", panelEvents._panel);
    selected = $("li.ui-selected", eventList);
    var index = parseInt(selected.attr("_index"));
    var pluginData = selected.data("pluginData");
    if(!pluginData)
        pluginData = eventList.find(".ui-selected").data("pluginData");
    pluginData = $.extend({}, pluginData);
    var origPluginData = selected.data("pluginData");
    if(!origPluginData)
        origPluginData = eventList.find(".ui-selected").data("pluginData");
    origPluginData = $.extend({}, origPluginData);
    function continueLoadingPlugin(){
        var pluginsAvailable = $("#pluginsAvailable", panelEvents._panel);
        $("#emailActionPanel, #pluginActionPanel", panelEvents._panel).hide();
        $("#eventActionPanel").unblock().find("input,textarea,select").removeAttr("disabled");
        if(pluginData.event_action_list)
            eventVal = eventVal || pluginData.event_action_list[0].text;
        if(eventVal == "(send_email)")
        {
            $("#emailActionPanel", panelEvents._panel).show();
            panelEvents.eventDataChanged(selected);
            setTimeout(function(){
                // $("#eventActionPanel").block({
                //     message:  '',
                //     overlayCSS: { opacity: 0.1, cursor: 'normal'}
                // });
                $("#eventActionPanel").find("input,textarea,select").attr("disabled","disabled");
                var overlay = $("#eventActionPanel").find(".blockOverlay");
                var style = overlay.attr("style") || "";
                style = style.replace("z-index: 1000;", "z-index: 1000 !important;");
                overlay.attr("style", style);
            },100);
        }
        else if(eventVal == "(run_plugin)")
        {
            var pluginActionPanel = $("#pluginActionPanel", panelEvents._panel).show();
            window.embedPlugin = true;
            var jsonDeep = panelEvents.jsonDeep;
            var pluginToLoad = $("#pluginName", panelEvents._panel).val();
            var event_plugin_list = pluginData.event_plugin_list ? pluginData.event_plugin_list[0].text : unescape($("#event_plugin_list", panelEvents._panel).val());
            if(event_plugin_list && event_plugin_list.lastIndexOf(":") == event_plugin_list.length-1)
            {
                event_plugin_list = event_plugin_list.substring(0, event_plugin_list.lastIndexOf(":"));
            }
            if(!event_plugin_list || event_plugin_list == "undefined" || typeof event_plugin_list == "undefined" || event_plugin_list.length == 0)
            {
                event_plugin_list = "CrushTask (User Defined)";
                $("#event_plugin_list", panelEvents._panel).val("CrushTask (User Defined)").trigger("change");
            }
            if(event_plugin_list.indexOf("Job:")<0)
                pluginsAvailable.find("option").each(function() { this.selected = (this.text == event_plugin_list); });
            else
                pluginsAvailable.val(event_plugin_list);
            pluginPlaceHolder.show();
            var loadPlugin = true;
            if(event_plugin_list.indexOf("(User Defined)")<0)
            {
                loadPlugin = false;
                pluginPlaceHolder.hide();
            }
            if(!pluginToLoad || pluginToLoad.length==0)
            {
                pluginToLoad = pluginsAvailable.val();
                $("#pluginName", panelEvents._panel).val(pluginToLoad).trigger("change").trigger("textchange");
            }

            try
            {
                //if(!pluginData.event_plugin_list ? pluginData.event_plugin_list[0].text && !loadedFromDD) return;
                if(pluginData)
                {
                    var pluginName = "";
                    if(typeof pluginData.pluginName != "undefined" && typeof pluginData.pluginName.length != "undefined")
                    {
                        pluginName = pluginData.pluginName[0].text;
                    }
                    else
                    {
                        pluginName = $("#pluginName", panelEvents._panel).val();
                        pluginData.pluginName = [{text:pluginName}];
                    }
                    if(pluginName != $("#pluginsAvailable", panelEvents._panel).val() && loadedFromDD)
                    {
                        pluginData = false;
                    }
                }

                if(loadPlugin)
                {
                    crushFTP.methods.getScript("/WebInterface/Preferences/js/crushftp.localizations.js", function() {
                        crushFTP.methods.getScript("/WebInterface/Preferences/js/crushftp.interface.js", function() {
                            //window.decodeFirst = true;
                            loadPanel("Plugins", true, {
                                loadPlugin : pluginToLoad,
                                pluginID : crushFTP.methods.generateRandomPassword(10),
                                returnXML : true,
                                placeHolder : pluginPlaceHolder,
                                dataItem : pluginData,
                                baseUrl : "/WebInterface/Preferences/",
                                hideButtons : true,
                                ignoreChanges : true,
                                callbackOnload : function()
                                {
                                    var eventList = $("#eventList", panelEvents._panel);
                                    setTimeout(function(){
                                        $("#event_if_list", panelEvents._panel).trigger('change');
                                        //console.log('pl 2', origPluginData);
                                        selected.data("pluginData", origPluginData);
                                        if(selected)
                                        {
                                            if(selected.text().toLowerCase().indexOf("link :")==0 || selected.text().toLowerCase().indexOf("link:")==0)
                                            {
                                                // $("#eventActionPanel").block({
                                                //     message:  '',
                                                //     overlayCSS: { opacity: 0.1, cursor: 'normal'}
                                                // });
                                                $("#eventActionPanel").find("input,textarea,select").attr("disabled","disabled");
                                                var overlay = $("#eventActionPanel").find(".blockOverlay");
                                                var style = overlay.attr("style") || "";
                                                style = style.replace("z-index: 1000;", "z-index: 1000 !important;");
                                                overlay.attr("style", style);
                                            }
                                            else
                                                $("#eventActionPanel").unblock().find("input,textarea,select").removeAttr("disabled");
                                        }
                                    }, 500);
                                    //console.log('pl 3', origPluginData);
                                    selected.data("pluginData", origPluginData);
                                }
                            });
                        });
                    });
                }
            }
            catch(ex)
            {
                if(ex && ex.toString() != "")
                {
                    crushFTP.UI.growl("Error", DOMPurify.sanitize(ex), true);
                }
            }
        }
        var ftpDirPanel = $("#ftpDirPanel", panelEvents._panel);
        if($("#event_if_cb", panelEvents._panel).is(":checked") && $("#event_if_list", panelEvents._panel).val()!="")
        {
            ftpDirPanel.show();
        }

        $("#event_if_list", panelEvents._panel).unbind().change(function(){
            if($(this).val()!="")
                crushFTP.UI.checkUnchekInput($("#event_if_cb", panelEvents._panel), true);

            ftpDirPanel.find(".noreal").show();
            ftpDirPanel.find(".real").hide();
            ftpDirPanel.find("#event_dir_data").attr('valtype', 'dirPathAllowStar');
            $("#realURLOption").hide();
            if($(this).val().lastIndexOf("_dir")>=0)
            {
                ftpDirPanel.show();
            }
            else if($(this).val().lastIndexOf("real_url")>=0)
            {
                ftpDirPanel.show();
                ftpDirPanel.find(".noreal").hide();
                ftpDirPanel.find(".real").show();
                ftpDirPanel.find("#event_dir_data").removeAttr('valtype');
                panelEvents._panel.find(".SSHOptionsHandle").trigger('textchange');
                $("#realURLOption").show();
            }
            else
            {
                ftpDirPanel.hide();
            }
        });

        $("#event_after_list", panelEvents._panel).unbind().change(function(){
            if($(this).val()!="")
                crushFTP.UI.checkUnchekInput($("#event_after_cb", panelEvents._panel), true);
        });
        setTimeout(function(){
            $("#event_if_list", panelEvents._panel).trigger('change');
        }, 500);
    }

    crushFTP.UI.showLoadingIndicator(true);
    userManager.dataRepo.getUserInfo(pluginData.linkUser[0].text, function(info, xml){
        crushFTP.UI.hideLoadingIndicator(true);
        var eventsAvailable = false;
        if(info && info.user && info.user.events)
        {
            var events = info.user.events;
            events = $.extend({}, events);
            if(events && events.events_subitem)
            {
                crushFTP.methods.rebuildSubItems(events, "events");
                events = events.events_subitem;

                if(events.length>0)
                {
                    eventsAvailable = true;
                    var selectedUserEvents = [];
                    for(var i=0;i<events.length;i++)
                    {
                        selectedUserEvents.push(events[i].name);
                    }
                    if(selectedUserEvents.length>0)
                    {
                        var selectedEvent, selectedIndex;
                        for(var i=0;i<events.length;i++)
                        {
                            if(events[i].name == pluginData.linkEvent[0].text)
                            {
                                selectedEvent = events[i];
                                selectedIndex = i;
                                i = events.length + 1;
                            }
                        }
                        if(selectedEvent && selectedEvent.name)
                        {
                            var deepJsonForEvent = $.xml2json(xml, true);
                            var jsonForEvent = $.xml2json(xml);
                            deepJsonForEvent = $.extend({}, deepJsonForEvent);
                            jsonForEvent = $.extend({}, jsonForEvent);
                            try{
                                deepJsonForEvent = deepJsonForEvent["response_data"][0]["user_items"][0]["user"][0]["events"][0]["events_subitem"][selectedIndex];
                                crushFTP.methods.rebuildSubItems(jsonForEvent.response_data.user_items.user.events, "events");
                                jsonForEvent = jsonForEvent.response_data.user_items.user.events.events_subitem[selectedIndex];
                            }catch(ex){}
                            if(deepJsonForEvent && deepJsonForEvent.tasks)
                            {
                                crushFTP.methods.rebuildSubItems(deepJsonForEvent.tasks, "tasks");
                            }
                            deepJsonForEvent.name = pluginData.name;
                            deepJsonForEvent.id = pluginData.id;
                            deepJsonForEvent.linkUser = pluginData.linkUser;
                            deepJsonForEvent.linkEvent = pluginData.linkEvent;
                            pluginData = deepJsonForEvent;
                            continueLoadingPlugin();
                            panelEvents.eventItemSelected(false, selected, true, jsonForEvent, true);
                        }
                    }
                }
            }
        }
    }, false, true);
};

panelEvents.updatePluginControlData = function(pluginName, fromPlugin, pluginID)
{
    var selected = eventList.find("li[uid='"+pluginID+"']");
    if(!pluginID)
        selected = eventList.find(".ui-selected");
    if(selected.length>0){
        panelEvents.eventDataChanged(selected);
    }
}

panelEvents.rebuildEventListFromLocalData = function(curUser, hidePanels, eventData, isAddedNew, cb)
{
    if(hidePanels){
        $("#eventActionPanel", panelEvents._panel).hide();
    }
    eventList.empty();
    var _index = 0;
    userManager.UI.multiOptionControlDataBind(curUser
        , "events"
        , eventList
        , function addNewButton(curItem){
            var name = crushFTP.methods.textEncode(curItem.name);
            var uid = curItem.id;
            if(curItem && curItem.name && curItem.id.toString() != "null" && eventList.find("li[uif='"+uid+"']").length==0)
            {
                _index++;
                return $("<li uid='"+uid+"' _index='"+_index+"' class='ui-widget-content'>"+decodeURIComponent(unescape(name))+"</li>");
            }
            else
            {
                _index++;
                return false;
            }
        }
    , !isAddedNew);

    var events = false;
    try{
        events = panelEvents.jsonDeep["response_data"][0]["user_items"][0]["user"][0]["events"];
    }catch(ex){events = false;}
    var _events = false;
    if(events && events.length >0)
    {
        _events = $.extend(true, {}, events[0]);
    }
    if(_events)
    {
        eventList.find("li").each(function(index){
            var json = false;
            var _index = parseInt($(this).attr("_index"));
            if(_events && _events["events_subitem"] && _events["events_subitem"].length>_index-1)
            {
                json = _events["events_subitem"][_index-1];
            }
            else{
                json = _events;
            }
            if(json){
                //console.log('pl 4', json, _index, _events["events_subitem"], crushFTP.storage("currentUserInherited").user.events.events_subitem);
                $(this).data("pluginData", json);
            }
        });
    }
    if(window.panelSettings){
        panelSettings.updateRNTemplateStatus();
    }
    if(isAddedNew)
    {
        setTimeout(function(){
            var lastItemInList = eventList.find("li:last");
            if(lastItemInList.length>0)
            {
                lastItemInList.addClass("ui-selected ui-widget-header");
                panelEvents.eventItemSelected(eventList, lastItemInList);
            }
            if(cb)cb();
        }, 500);
    }
    else{if(cb)cb();}
}

panelEvents.zoomInTaskDesigner = function(){
    panelEvents.scrollPosition = {
        x : window.scrollX,
        y : window.scrollY
    }
    crushFTP.UI.showLoadingIndicator(true);
    $("#pnlPluginCrushTask", panelEvents._panel).addClass('taskDesignerPopup');
    panelEvents.evtTimer = setInterval(function(){
        $("#enabled", panelEvents._panel).trigger('change');
    },500);
};

panelEvents.zoomOutTaskDesigner = function(){
    crushFTP.UI.hideLoadingIndicator();
    $("#pnlPluginCrushTask", panelEvents._panel).removeClass('taskDesignerPopup');
    if(panelEvents.scrollPosition)
    {
        window.scrollTo(panelEvents.scrollPosition.x, panelEvents.scrollPosition.y);
    }
    $("#taskDesignerPanelContainer").scrollTo(0,0);
    try{
        setTimeout(function(){
            clearInterval(panelEvents.evtTimer);
        },1000);
    }catch(ex){}
};

panelEvents.bindEvents = function()
{
    userManager.UI.togglePanels(panelEvents._panel);
    $("a.serverFilePickButton.noreal", panelEvents._panel).each(function(){
        $(this).click(function(){
            var curElem = $(this);
            var rel = curElem.attr("rel");
            var pickingFor = curElem.parent().parent().parent().find("label[for='"+rel+"']").text() || "";
            pickingFor = $.trim($.trim(pickingFor).replace(":", ""));
            function continueSelection(extraVFS)
            {
                curElem.crushFtpVFSBrowserPopup({
                    type : curElem.attr("PickType") || 'dir',
                    pickingFor: pickingFor,
                    isVFSBrowse : true,
                    extraVFS : extraVFS,
                    allowRootSelection : true,
                    userNameForVFS : crushFTP.storage("userName"),
                    existingVal : $("#" + curElem.attr("rel")).val(),
                    callback: function (selectedPath) {
                        $("#" + curElem.attr("rel")).val(unescape(selectedPath)).trigger("textchange").trigger("change");
                    }
                });
            }

            if($("#vfsItemButtons", panelSetup._panel).find(".vfsBtn").length>0)
            {
                var items = ["Default"];
                $("#vfsItemButtons").find(".vfsBtn").each(function(){
                    items.push($(this).find("a").text());
                });
                jPrompt("This user has multiple VFS Items :", "", "Pick A VFS", function(value){
                    if(value)
                    {
                        if(value == "Default")
                            continueSelection();
                        else
                        {
                            if(typeof crushFTP.storage("extraUserInfo"+value) == "undefined")
                            {
                                var usrExtraVFS = crushFTP.storage("userName") + "_" + value;
                                crushFTP.UI.showLoadingIndicator(true);
                                userManager.dataRepo.getUserInfo(usrExtraVFS, function(data, xml){
                                    crushFTP.storage("extraUserInfo"+usrExtraVFS, data);
                                    crushFTP.storage("extraUserXML"+usrExtraVFS, xml);
                                    panelSetup.buildDirPrivs(value);
                                    crushFTP.UI.hideLoadingIndicator(true);
                                    continueSelection(value);
                                }, false, true, usrExtraVFS);
                            }
                            else
                                continueSelection(value);
                        }
                    }
                }, items
                , false);
            }
            else
                continueSelection();
            return false;
        });
    });

    panelEvents._panel.find(".maskPasswordOnURL").each(function(){
        $(this).unbind("focus.form").bind("focus.form", function(){
            if($(this).data("originalURL"))
                $(this).val($(this).data("originalURL"));
        }).unbind("blur.form").bind("blur.form", function(){
            $(this).trigger("applymask");
        }).unbind("applymask").bind("applymask", function(){
            var elem = $(this);
            var value = $(this).val();
            var url = value;
            try{
                url = URI(value);
            }catch(ex){
                url = URI(encodeURI(value));
            }
            var urlParams = getParamsFromURL(value) || {};
            if(elem.hasClass('urlWithParams') && Object.keys(urlParams.params).length != 0){
                elem.data("urlParams", urlParams.params);
                url.port(urlParams.port || "");
            }
            if(elem.hasClass('urlWithParams'))
                elem.data("realURL", getFullURLWithParams(value, elem.data("urlParams") || {}));
            if(url && elem.val().substr(8, 1) != ":")
            {
                var pass = decodeURIComponent(url.password());
                var mask = false;
                var existingPass = elem.data("password");
                if(pass != existingPass)
                {
                    if(existingPass)
                    {
                        mask = new Array(existingPass.length+1).join('*');
                    }
                    if(existingPass && pass == mask)
                        pass = existingPass;
                    else
                        mask = new Array(pass.length+1).join('*');
                    if(pass)
                    {
                        elem.data("password", pass);
                        elem.data("url", value);
                        url.password(mask);
                        var _val = url.toString();
                        elem.val(decodeURIComponent(_val));
                    }
                }
                else
                {
                    pass = existingPass;
                    mask = new Array(pass.length+1).join('*');
                    url.password(mask);
                    var _val = url.toString();
                    elem.val(decodeURIComponent(_val));
                    elem.data("url", value);
                }
                url.password(pass);
                var _val = url.toString();
                if(value.indexOf("////")==0){
                    _val = "//" + _val;
                }
                elem.data("originalURL", decodeURIComponent(_val));
            }
            else
            {
                elem.data("url", value);
            }
        });
    });
    panelEvents._panel.find(".maskPasswordOnURL").trigger("applymask");

    $("a.serverFilePickWithParamsButton", panelEvents._panel).each(function(){
        $(this).unbind("click").click(function(){
            var curElem = $(this);
            var rel = curElem.attr("rel");
            var pickingFor = curElem.parent().parent().parent().find("label[for='"+rel+"']").text() || "";
            pickingFor = $.trim($.trim(pickingFor).replace(":", ""));
            var refElem = $("#" + rel, panelEvents._panel);
            var labelName = refElem.val() || "";
            var advancedBrowse = true;
            var existingData = refElem.data("urlParams") || {};
            var curPath = refElem.val();
            if(refElem.hasClass('maskPasswordOnURL')){
                curPath = refElem.data("realURL") || refElem.val();
            }
            // curPath = getFullURLWithParams(curPath, existingData);
            var note = false;
            if(labelName.length>0)
            {
                var text = labelName;
                try{
                    var url = URI(text);
                    var pass = url.password();
                    if(url && pass)
                    {
                        var mask = new Array(pass.length+1).join('*');
                        url.password(mask);
                        text = unescape(url.toString());
                    }
                }catch(ex){}
                note = "Current selected directory : " + text;
            }
            if(!existingData.timeout || typeof existingData.timeout == "undefined")
            {
                existingData.timeout = "20000";
            }
            if(!existingData.write_timeout || typeof existingData.write_timeout == "undefined")
            {
                existingData.write_timeout = "20000";
            }
            if(!existingData.read_timeout || typeof existingData.read_timeout == "undefined")
            {
                existingData.read_timeout = "20000";
            }
            if(typeof existingData.sharepoint_site_drive_name == "undefined")
            {
                existingData.sharepoint_site_drive_name = "Documents";
            }
            delete existingData.path;
            if(curPath){
                existingData.url = existingData[refElem.attr("id")] = getURLWithoutParams(curPath);
            }
            curElem.crushFtpLocalFileBrowserPopup({
                type : curElem.attr("PickType") || 'dir',
                file_mode : advancedBrowse ? "server" : curElem.attr("FileMode") || 'server',
                pickingFor: pickingFor,
                note : note,
                existingData : existingData || {},
                urlWithParams: true,
                existingVal : "/",
                allowRootSelection : advancedBrowse,
                isFTPBrowse : advancedBrowse,
                callback : function(selectedPath){
                    $("#" + curElem.attr("rel"), panelEvents._panel).val(selectedPath).removeData("urlParams").trigger('applymask');
                    var selected = eventList.find("li.ui-widget-header");
                    if(selected && selected.length>0)
                    {
                        var controlData = selected.data("controlData");
                        controlData[curElem.attr("rel")] = selectedPath;
                        selected.data("controlData", controlData);
                    }
                    panelEvents._panel.trigger("changed", [eventList]);
                }
            });
            return false;
        });
    });

    panelEvents._panel.find(".SSHOptionsHandle").each(function(){
        $(this).bind("textchange", function(){
            if($("#event_if_list", panelEvents._panel).val()!="(real_url)")
                return;
            var text = $(this).val().toLowerCase();
            if(text.indexOf("http://")>=0 || text.indexOf("https://")>=0)
            {
                $(this).closest("div.actionConfigPanel").find(".httpOptions").show();
            }
            else
            {
                $(this).closest("div.actionConfigPanel").find(".httpOptions").hide();
            }
            if(text.indexOf("sftp://")>=0)
            {
                $(this).closest("div.actionConfigPanel").find(".sftpOptions").show();
            }
            else
            {
                $(this).closest("div.actionConfigPanel").find(".sftpOptions").hide();
            }
            if(text.indexOf("ftps://")>=0 || text.indexOf("https://")>=0 || text.indexOf("webdavs://")>=0)
            {
                $(this).closest("div.actionConfigPanel").find(".sslOptions").show().find(".excludeXML").removeClass('excludeXML').addClass('tempallowXML');
            }
            else
            {
                $(this).closest("div.actionConfigPanel").find(".sslOptions").hide().find(".tempallowXML").removeClass('tempallowXML').addClass('excludeXML');
            }
            if(text.indexOf("smb://")==0 || text.indexOf("smb3://")==0 || text.indexOf("file:")==0)
            {
                $(this).closest("div.actionConfigPanel").find(".dmzOption").hide();
            }
            else
            {
                $(this).closest("div.actionConfigPanel").find(".dmzOption").show();
            }
            if(text.indexOf("ftp://")==0)
            {
                $(this).closest("div.actionConfigPanel").find(".ftpOptions").show();
            }
            else
            {
                $(this).closest("div.actionConfigPanel").find(".ftpOptions").hide();
            }
            if(text.indexOf("ftp://")==0 || text.indexOf("ftps://")==0 || text.indexOf("ftpes://")==0)
            {
                $(this).closest("div.actionConfigPanel").find(".ftpSOptions").show();
                if(text.indexOf("ftpes://")==0)
                    $(this).closest("div.actionConfigPanel").find(".sslOptions").show();
            }
            else
            {
                $(this).closest("div.actionConfigPanel").find(".ftpSOptions").hide();
            }
            if(text.indexOf("s3://")>=0 || text.indexOf("s3crush://")>=0)
            {
                $(this).closest("div.actionConfigPanel").find(".s3Credentials").show().find(".excludeXML").removeClass('excludeXML').addClass('tempallowXML');
            }
            else
            {
                $(this).closest("div.actionConfigPanel").find(".s3Credentials").hide().find(".tempallowXML").removeClass('tempallowXML').addClass('excludeXML');
            }
            if(text.indexOf("gdrive://")>=0)
            {
                $(this).closest("div.actionConfigPanel").find(".gdriveCredentials").show();
            }
            else
            {
                $(this).closest("div.actionConfigPanel").find(".gdriveCredentials").hide();
            }
            if($(this).closest("div.actionConfigPanel").find(".encryptionMode:visible").length>0)
                $(this).closest("div.actionConfigPanel").find(".encryptionMode:visible").trigger("change");
        });
    });

    $("a.serverFilePickButton.real", panelEvents._panel).each(function(){
        $(this).click(function(){
            var curElem = $(this);
            var rel = curElem.attr("rel");
            var pickingFor = curElem.parent().parent().parent().find("label[for='"+rel+"']").text() || "";
            pickingFor = $.trim($.trim(pickingFor).replace(":", ""));
            var eventList = $("#eventList", panelEvents._panel);
            var selected = eventList.find("li.ui-widget-header");
            if(selected && selected.length>0)
            {
                var controlData = selected.data("controlData");
                curElem.crushFtpLocalFileBrowserPopup({
                    file_mode : curElem.attr("FileMode") || 'server',
                    pickingFor: pickingFor,
                    type : 'dir',
                    allowRootSelection: false,
                    isFTPBrowse : true,
                    existingData : controlData,
                    existingVal : $("#" + curElem.attr("rel")).val(),
                    callback : function(selectedPath, ftpServerInfo){
                        if(ftpServerInfo)
                        {
                            selectedPath = selectedPath.replace("/home", "");
                            var isUNC = ftpServerInfo.path.indexOf("//") == 0;
                            if(ftpServerInfo.url.lastIndexOf("/") == ftpServerInfo.url.length-1 && selectedPath.indexOf("/")==0)
                            {
                                selectedPath = selectedPath.substr(1, selectedPath.length);
                            }
                            var path = ftpServerInfo.url + selectedPath;
                            if(isUNC)
                                path = "FILE:///" + ftpServerInfo.url;
                            $("#" + curElem.attr("rel")).val(path).trigger('textchange');
                            var rel = curElem.attr("rel");
                            ftpServerInfo[rel] = path;
                            if(controlData)
                            {
                                var tempControlData = $.extend(true, {}, controlData);
                                tempControlData = $.extend(tempControlData, ftpServerInfo);
                                if(tempControlData.use_dmz.indexOf("socks://") == 0 || tempControlData.use_dmz.indexOf("internal://") == 0)
                                {
                                    panelEvents._panel.find("#use_dmz").find("option[_rel='custom']").attr("value", tempControlData.use_dmz).text(tempControlData.use_dmz + " (custom)");
                                }
                                controlData = tempControlData;
                                selected.data("controlData", tempControlData);
                                panelEvents.eventItemSelected(eventList, selected, true);
                            }
                        }
                        else
                            $("#" + curElem.attr("rel")).val(selectedPath).trigger('textchange');
                    }
                });
            }
            return false;
        });
    });

    $("a.serverFilePickButton.common", panelEvents._panel).each(function(){
        $(this).click(function(){
            var curElem = $(this);
            var rel = curElem.attr("rel");
            var pickingFor = curElem.parent().parent().parent().find("label[for='"+rel+"']").text() || "";
            pickingFor = $.trim($.trim(pickingFor).replace(":", ""));
            curElem.crushFtpLocalFileBrowserPopup({
                type : curElem.attr("PickType") || 'dir',
                pickingFor: pickingFor,
                file_mode : curElem.attr("FileMode") || 'user',
                isFTPBrowse : false,
                allowRootSelection : false,
                existingVal : $("#" + curElem.attr("rel")).val(),
                callback : function(selectedPath, ftpServerInfo){
                    $("#" + curElem.attr("rel")).val(selectedPath).trigger("change");
                }
            });
            return false;
        });
    });

    $("#showNotSupportedPluginList", panelEvents._panel).click(function(){
        var listOfPluginsInSystem = $("#listOfPluginsInSystem", panelEvents._panel);
        if(listOfPluginsInSystem.is(":hidden"))
        {
            listOfPluginsInSystem.show();
            $(this).text("Hide list");
        }
        else
        {
            listOfPluginsInSystem.hide();
            $(this).text("Show list of plugins");
        }
        return false;
    });

    $(".checkboxArea>input[type='checkbox']", panelEvents._panel).change(function(){
        var curUserData = crushFTP.storage("currentUserInherited");
        if(!$(this).is(":checked"))
        {
            curUserData = {user: crushFTP.storage("currentUsersLowerLevelsData")};
            $(this).closest("fieldset").addClass("inheritSet");
        }
        else
            $(this).closest("fieldset").removeClass("inheritSet");

        if(!$(this).closest("fieldset").hasClass("notInheritable"))
        {
            $("#eventActionPanel", panelEvents._panel).hide();
            panelEvents.bindData(curUserData, panelEvents.jsonDeep, $(this).closest("fieldset"), false);
        }
    });

    $("#eventActionPanel", panelEvents._panel).hide();
    eventList.unbind("onSelect").bind("onSelect"
        , function(evt, list, selected){
            window.loadingTaskData = true;
            panelEvents.eventItemSelected(list, selected);
    });

    function eventExists(eventName) {
        var events = [];
        var currentUserInherited = crushFTP.storage("currentUserInherited");
        if(currentUserInherited && currentUserInherited.user)
        {
            currentUserInherited = currentUserInherited.user;
            if(currentUserInherited && currentUserInherited.events)
            {
                events = currentUserInherited.events;
            }
            else
            {
                currentUserInherited.events = events;
            }
            crushFTP.methods.rebuildSubItems(events, "events");
            if(events.events_subitem.length==1 && (events.events_subitem[0].id=="null" || !events.events_subitem[0].name))
                events.events_subitem.pop();
        }
        var events = panelEvents.jsonDeep["response_data"][0]["user_items"][0]["user"][0]["events"];
        if(!events || !jQuery.isArray(events))
        {
            events = panelEvents.jsonDeep["response_data"][0]["user_items"][0]["user"][0]["events"] = [{
                "events_subitem" : []
            }];
        }
        else if(!events[0]["events_subitem"] || !jQuery.isArray(events[0]["events_subitem"]))
        {
            events[0]["events_subitem"] = [];
        }
        for (var index = 0; index < events[0]["events_subitem"].length; index++) {
            var curItem = events[0]["events_subitem"][index];
            if (curItem && curItem.name && curItem.name[0].text.toLowerCase() == eventName.toLowerCase())
                return true;
        }
        return false;
    }

    function addNewEventToCollection(newEvent, defaultData, isLink, cb)
    {
        var events = [];
        var currentUserInherited = crushFTP.storage("currentUserInherited");
        if(currentUserInherited && currentUserInherited.user)
        {
            currentUserInherited = currentUserInherited.user;
            if(currentUserInherited && currentUserInherited.events)
            {
                events = currentUserInherited.events;
            }
            else
            {
                currentUserInherited.events = events;
            }
            crushFTP.methods.rebuildSubItems(events, "events");
            if(events.events_subitem.length==1 && (events.events_subitem[0].id=="null" || !events.events_subitem[0].name))
                events.events_subitem.pop();
            events.events_subitem.push(newEvent);
        }

        var events = panelEvents.jsonDeep["response_data"][0]["user_items"][0]["user"][0]["events"];
        if(!events || !jQuery.isArray(events))
        {
            panelEvents.jsonDeep["response_data"][0]["user_items"][0]["user"][0]["events"] = [{
                "events_subitem" : []
            }];
        }
        else if(!events[0]["events_subitem"] || !jQuery.isArray(events[0]["events_subitem"]))
        {
            events[0]["events_subitem"] = [];
        }
        try{
            if((events && events.length == 1 && events[0].events_subitem && events[0].events_subitem[0] && (events[0].events_subitem[0].id[0].text == "null" || !events[0].events_subitem[0].name)))
            {
                panelEvents.jsonDeep["response_data"][0]["user_items"][0]["user"][0]["events"] = [{
                    "events_subitem" : []
                }];
            }
        }catch(ex){}

        var eventsAll = panelEvents.jsonDeep["response_data"][0]["user_items"][0]["user"][0]["events"][0]["events_subitem"];
        if(!isLink)
        {
            try{
                if(panelEvents.jsonDeep["response_data"][0]["user_items"][0]["user"][0]["events"][0]["events_subitem"][0].id[0].text == "null" || !panelEvents.jsonDeep["response_data"][0]["user_items"][0]["user"][0]["events"][0]["events_subitem"][0].name)
                {
                    eventsAll = [];
                }
            }catch(ex){}
            eventsAll.push(defaultData);
            panelEvents.jsonDeep["response_data"][0]["user_items"][0]["user"][0]["events"][0]["events_subitem"] = eventsAll;
        }
        else
        {
            try{
                if(panelEvents.jsonDeep["response_data"][0]["user_items"][0]["user"][0]["events"][0]["events_subitem"][0].id[0].text == "null" || !panelEvents.jsonDeep["response_data"][0]["user_items"][0]["user"][0]["events"][0]["events_subitem"][0].name)
                {
                    eventsAll = [];
                }
            }catch(ex){}
            eventsAll.push({linkUser : defaultData.linkUser, linkEvent : defaultData.linkEvent, name : defaultData.name, id:crushFTP.methods.generateRandomPassword(10)});
            panelEvents.jsonDeep["response_data"][0]["user_items"][0]["user"][0]["events"][0]["events_subitem"] = eventsAll;
        }
        panelEvents.rebuildEventListFromLocalData(currentUserInherited, false, defaultData, true, cb);
        panelEvents._panel.trigger("changed", [eventList]);
    }

    $("#addEvent", panelEvents._panel).unbind().click(function(){
        jPrompt("Please enter name for this event :", "", "CrushFTP Events", function(value){
            if(value)
            {
                if(crushFTP.methods.hasSpecialCharacters(value, userManager.notAllowedCharsInDirName))
                {
                    jAlert("You can not use these characters in name : \"" + userManager.notAllowedCharsInDirName + "\"", "Message", function(){
                        $("#addEvent", panelEvents._panel).trigger("click");
                    });
                    return false;
                }
                var uId = crushFTP.methods.generateRandomPassword(10);
                addNewEventToCollection({
                    command: "EMAIL",
                    event_action_list : "(run_plugin)",
                    event_dir_data: "",
                    from: "%user_email%",
                    id: uId,
                    name: value,
                    subject: "Example for on Disconnect:?User %user_name%",
                    event_always_cb : "true",
                    event_after_cb : "true",
                    event_after_list : "(disconnect_all)"
                }, {
                    command: [{text : "EMAIL"}],
                    event_action_list : [{text : "(run_plugin)"}],
                    event_dir_data: [{text : ""}],
                    from: [{text : "%user_email%"}],
                    id: [{text : uId}],
                    name: [{text : value}],
                    subject: [{text : "Example for on Disconnect:?User %user_name%"}],
                    event_always_cb : [{text : "true"}],
                    event_after_cb : [{text : "true"}],
                    event_after_list : [{text : "(disconnect_all)"}]
                });
            }
        });
        return false;
    });

    $("#deleteEvent", panelEvents._panel).unbind().click(function(){
        var selected = eventList.find("li.ui-selected");
        if(selected && selected.length>0)
        {
            var eventName = selected.text();
            var eventUID = selected.attr("uid");
            jConfirm("Are you sure you want to delete event '" + crushFTP.methods.htmlEncode(eventName) + "' ?", "CrushFTP Events", function(value){
                if(value)
                {
                    window.loadingTaskData = true;
                    var indexOfEvent = parseInt(selected.attr("_index"));
                    var eventsItem = panelEvents.jsonDeep["response_data"][0]["user_items"][0]["user"][0]["events"][0]["events_subitem"];
                    eventsItem.remove(indexOfEvent-1);
                    panelEvents.jsonDeep["response_data"][0]["user_items"][0]["user"][0]["events"][0]["events_subitem"] = eventsItem;

                    var events = [];
                    var currentUserInherited = crushFTP.storage("currentUserInherited");
                    if(currentUserInherited && currentUserInherited.user)
                    {
                        currentUserInherited = currentUserInherited.user;
                        if(currentUserInherited && currentUserInherited.events)
                        {
                            events = currentUserInherited.events;
                        }
                        else
                        {
                            currentUserInherited.events = events;
                        }
                        crushFTP.methods.rebuildSubItems(events, "events");
                        var arr = [];
                        for(var i=0;i<events.events_subitem.length;i++)
                        {
                            if(events.events_subitem[i].id !== eventUID)
                            {
                                arr.push(events.events_subitem[i]);
                            }
                        }
                        events.events_subitem = arr;
                        $("#eventActionPanel", panelEvents._panel).hide();
                        panelEvents.rebuildEventListFromLocalData(currentUserInherited, true, false, false);
                        var lastItemInList = eventList.find("li:last");
                        if(lastItemInList.length>0)
                        {
                            lastItemInList.addClass("ui-selected ui-widget-header");
                            panelEvents.eventItemSelected(eventList, lastItemInList);
                        }
                        else
                        {
                            $("#eventActionPanel", panelEvents._panel).hide();
                        }
                    }
                    panelEvents._panel.trigger("changed", [eventList]);
                    setTimeout(function(){
                        window.loadingTaskData = false;
                    },500);
                    crushFTP.UI.checkUnchekInput(panelEvents._panel.find("input.config"), true);
                }
            });
        }
        return false;
    });

    $("#renameEvent", panelEvents._panel).unbind().click(function(){
        var renameEventBtn = $(this);
        var selected = eventList.find("li.ui-selected");
        if(selected && selected.length>0)
        {
            var eventName = crushFTP.methods.htmlEncode(selected.text());
            if(eventName.toLowerCase().indexOf("link :")==0)
            {
                jAlert("You can not rename linked event.", "Message", function(){
                });
                return false;
            }
            jPrompt("Please enter name for this event :", eventName, "CrushFTP Events", function(value){
                if(value)
                {
                    if(crushFTP.methods.hasSpecialCharacters(value, userManager.notAllowedCharsInDirName))
                    {
                        jAlert("You can not use these characters in name : \"" + userManager.notAllowedCharsInDirName + "\"", "Message", function(){
                            $("#renameEvent", panelEvents._panel).trigger("click");
                        });
                        return false;
                    }
                    var indexOfEvent = parseInt(selected.attr("_index"))-1;
                    var eventsItem = panelEvents.jsonDeep["response_data"][0]["user_items"][0]["user"][0]["events"][0]["events_subitem"];
                    eventsItem[indexOfEvent].name[0].text = value;
                    $("#name", panelEvents._panel).val(value);
                    selected.text(value);
                    // var currentUserInherited = panelEvents.jsonDeep["response_data"][0]["user_items"][0]["user"][0];
                    // var events = [];
                    // var currentUserInherited = crushFTP.storage("currentUserInherited");
                    // if(currentUserInherited && currentUserInherited.user)
                    // {
                    //     currentUserInherited = currentUserInherited.user;
                    //     if(currentUserInherited && currentUserInherited.events)
                    //     {
                    //         events = currentUserInherited.events;
                    //     }
                    //     else
                    //     {
                    //         currentUserInherited.events = events;
                    //     }
                    //     crushFTP.methods.rebuildSubItems(events, "events");
                    //     var mergedDataDeep = crushFTP.methods.jsonToXML(eventsItem[indexOfEvent], false, false, false, true);
                    //     mergedDataDeep = $.xml2json("<item>"+mergedDataDeep+"</item>");
                    //     events.events_subitem[selected.index()] = mergedDataDeep;
                    // }
                    // panelEvents.rebuildEventListFromLocalData(currentUserInherited, false, false, true);
                    // eventList.find("li:eq("+indexOfEvent+")").addClass("ui-selected ui-widget-header");
                    panelEvents._panel.trigger("changed", [eventList]);
                }
            });
        }
        return false;
    });

    $("#duplicateEvent", panelEvents._panel).unbind().click(function(){
        var selected = eventList.find("li.ui-selected");
        if(selected && selected.length>0)
        {
            var eventName = selected.text();
            jPrompt("Please enter name for this event :", "Copy of " + crushFTP.methods.htmlEncode(eventName), "CrushFTP Events", function(value){
                if(value)
                {
                    var events = [];
                    var currentUserInherited = crushFTP.storage("currentUserInherited");
                    if(currentUserInherited && currentUserInherited.user)
                    {
                        currentUserInherited = currentUserInherited.user;
                        if(currentUserInherited && currentUserInherited.events)
                        {
                            events = currentUserInherited.events;
                        }
                        else
                        {
                            currentUserInherited.events = events;
                        }
                        crushFTP.methods.rebuildSubItems(events, "events");
                        var copyFrom = selected.data("controlData");
                        var dataXML = $.json2xml(copyFrom, {rootTagName: 'events_subitem'}).replace(/<tasks_subitem >/g, '<tasks_subitem type ="properties">')
                                        .replace(/\<connections>/g, "<connections type=\"vector\">")
                                        .replace(/\<connections_subitem>/g, "<connections_subitem type=\"properties\">")
                                        .replace(/\<type>properties<\/type>/g, "")
                                        .replace(/\<type>vector<\/type>/g, "")
                                        .replace(/\<connections type="vector">undefined<\/connections>/g, "")
                                        .replace(/\<connections type="vector"><connections_subitem\/><\/connections>/g, "<connections type=\"vector\"><connections_subitem type=\"properties\"><type>null</type><connectionID>null</connectionID></connections_subitem></connections>")
                                        .replace(/\<headers>/g, '<headers type="vector">')
                                        .replace(/\<headers_subitem>/g, '<headers_subitem type="properties">')
                                        .replace(/\<prop_item>/g, '<prop_item type="vector">')
                                        .replace(/\<prop_item_subitem>/g, '<prop_item_subitem type="properties">')
                                        .replace(/\<\nfunction item\(\) \{\n    \[native code\]\n\}\n>undefined<\/\nfunction item\(\) {\n    \[native code\]\n\}\n\>/g,"");
                        var deepJson = $.xml2json(dataXML, true);
                        var data = $.extend(true, {}, deepJson);
                        data.name = [{text: value}];
                        data.id = [{text: crushFTP.methods.generateRandomPassword(10)}];
                        if(!panelEvents.jsonDeep["response_data"][0]["user_items"][0]["user"][0]["events"] || !panelEvents.jsonDeep["response_data"][0]["user_items"][0]["user"][0]["events"][0]["events_subitem"])
                        {
                            panelEvents.jsonDeep["response_data"][0]["user_items"][0]["user"][0]["events"] = [{
                                events_subitem : []
                            }];
                        }
                        panelEvents.jsonDeep["response_data"][0]["user_items"][0]["user"][0]["events"][0]["events_subitem"].push(data);
                        $("#saveUserData", "#GUIInterface").trigger("click", [{fromSaveAndContniue:true, callBack : function(flag){
                            $("#popup_cancel").click();
                            userManager.methods.loadUserInfo(crushFTP.storage("userName"), true, function(){
                                $("#quick_jump").val("Events").trigger('change', [true]);
                                eventList.find("li:last").addClass("ui-selected ui-widget-header");
                                panelEvents.eventItemSelected(eventList, eventList.find("li:last"));
                            }, true, true);
                        }}]);
                    }
                    panelEvents._panel.trigger("changed", [eventList]);
                }
            });
        }
        return false;
    });

    $("#linkEvent, #copyEvent", panelEvents._panel).unbind().click(function(){
        var isCopy = $(this).is("#copyEvent");
        var userList = crushFTP.storage("users");
        var currentUser = crushFTP.storage("userName");
        var users = [];
        for(var i=0; i<userList.length;i++)
        {
            var name = userList[i].text;
            if(name && name.toLowerCase() != currentUser.toLowerCase())
            {
                users.push(userList[i].text);
            }
        }
        if(users.length>0)
        {
            var action = isCopy ? "copy" : "link";
            jPrompt("Pick another CrushFTP user to "+action+" event from :", "", "Pick A User", function(selectedUser){
                if(selectedUser)
                {
                    userManager.dataRepo.getUserInfo(selectedUser, function(info, xml){
                        var eventsAvailable = false;
                        if(info && info.user && info.user.events)
                        {
                            var events = info.user.events;
                            events = $.extend({}, events);
                            if(events && events.events_subitem)
                            {
                                crushFTP.methods.rebuildSubItems(events, "events");
                                events = events.events_subitem;

                                if(events.length>0)
                                {
                                    var deepJsonForEvent = $.xml2json(xml, true);
                                    deepJsonForEvent = $.extend({}, deepJsonForEvent);
                                    var selectedUserEvents = [];
                                    for(var i=0;i<events.length;i++)
                                    {
                                        var name = "LINK : " + selectedUser + " : " + events[i].name;
                                        if (events[i].name && events[i].name.toLowerCase().indexOf("link :") != 0 && !eventExists(name)) {
                                            selectedUserEvents.push(events[i].name);
                                        }
                                    }
                                    if(selectedUserEvents.length>0)
                                    {
                                        eventsAvailable = true;
                                        // jPrompt("Pick the event item to "+action+" :", "", "Pick Event", function(value){
                                        //     if(value)
                                        //     {
                                        //         var selectedEvent = {};
                                        //         var selectedIndex = -1;
                                        //         for(var i=0;i<events.length;i++)
                                        //         {
                                        //             if(events[i].name == value)
                                        //             {
                                        //                 selectedEvent = events[i];
                                        //                 selectedIndex = i;
                                        //                 i = events.length + 1;
                                        //             }
                                        //         }
                                        //         if(selectedEvent && selectedEvent.name)
                                        //         {
                                        //             var origName = selectedEvent.name;
                                        //             var uniqueID = crushFTP.methods.generateRandomPassword(10);
                                        //             if(!isCopy)
                                        //             {
                                        //                 selectedEvent.name = "LINK : " + selectedUser + " : " + selectedEvent.name;
                                        //             }
                                        //             else
                                        //                 selectedEvent.id = uniqueID;
                                        //             var deepJsonForEvent = $.xml2json(xml, true);
                                        //             deepJsonForEvent = $.extend({}, deepJsonForEvent);
                                        //             try{
                                        //                 deepJsonForEvent = deepJsonForEvent["response_data"][0]["user_items"][0]["user"][0]["events"][0]["events_subitem"][selectedIndex];
                                        //             }catch(ex){}
                                        //             if(deepJsonForEvent && deepJsonForEvent.name)
                                        //             {
                                        //                 deepJsonForEvent.name = [{text:selectedEvent.name}];
                                        //                 if(isCopy)
                                        //                     deepJsonForEvent.id = [{text: uniqueID}];
                                        //             }
                                        //             if(!isCopy)
                                        //             {
                                        //                 deepJsonForEvent.linkUser = [{text: selectedUser}];
                                        //                 deepJsonForEvent.linkEvent = [{text: origName}];
                                        //                 selectedEvent.linkUser = selectedUser;
                                        //                 selectedEvent.linkEvent = origName;
                                        //             }
                                        //             window.loadingTaskData = false;
                                        //             addNewEventToCollection(selectedEvent, deepJsonForEvent, !isCopy);
                                        //             $("#saveUserData", "#GUIInterface").trigger("click", [{fromSaveAndContniue:true, callBack : function(flag){
                                        //                 $("#popup_cancel").click();
                                        //                 userManager.methods.loadUserInfo(crushFTP.storage("userName"), true, function(){
                                        //                     $("#quick_jump").val("Events").trigger('change', [true]);
                                        //                     eventList.find("li:last").addClass("ui-selected ui-widget-header");
                                        //                     panelEvents.eventItemSelected(eventList, eventList.find("li:last"));
                                        //                 }, true, true);
                                        //             }}]);
                                        //         }
                                        //     }
                                        // }, selectedUserEvents);
                                        //TODO-multiple copy
                                        jPrompt("Pick the event item to "+action+" :", "", "Pick Event", function(value){
                                            value = $.isArray(value) ? value : [value];
                                            if(value && value.length>0)
                                            {
                                                var index = 0;
                                                function addSelectedItems(){
                                                    if(index < value.length)
                                                    {
                                                        crushFTP.UI.showLoadingIndicator(true);
                                                        var toCopyIndexes = [];
                                                        var curValue = value[index];
                                                        var selectedEvent = {};
                                                        var selectedIndex = -1;
                                                        for(var i=0;i<events.length;i++)
                                                        {
                                                            if(events[i].name == curValue)
                                                            {
                                                                toCopyIndexes.push(i);
                                                                selectedEvent = events[i];
                                                                selectedIndex = i;
                                                                i = events.length + 1;
                                                            }
                                                        }
                                                        if(selectedEvent && selectedEvent.name)
                                                        {
                                                            var origName = selectedEvent.name;
                                                            var uniqueID = crushFTP.methods.generateRandomPassword(10);
                                                            var jsonToCopy;
                                                            if(!isCopy)
                                                            {
                                                                selectedEvent.name = "LINK : " + selectedUser + " : " + selectedEvent.name;
                                                            }
                                                            else
                                                                selectedEvent.id = uniqueID;
                                                            try{
                                                                jsonToCopy = deepJsonForEvent["response_data"][0]["user_items"][0]["user"][0]["events"][0]["events_subitem"][selectedIndex];
                                                            }catch(ex){}
                                                            if(jsonToCopy && jsonToCopy.name)
                                                            {
                                                                jsonToCopy.name = [{text:selectedEvent.name}];
                                                                if(isCopy)
                                                                    jsonToCopy.id = [{text: uniqueID}];
                                                            }
                                                            if(!isCopy)
                                                            {
                                                                jsonToCopy.linkUser = [{text: selectedUser}];
                                                                jsonToCopy.linkEvent = [{text: origName}];
                                                                selectedEvent.linkUser = selectedUser;
                                                                selectedEvent.linkEvent = origName;
                                                            }
                                                        }
                                                        addNewEventToCollection(selectedEvent, jsonToCopy, !isCopy, function(){
                                                            index++;
                                                            addSelectedItems();
                                                        });
                                                    }
                                                    else{
                                                        setTimeout(function () {
                                                            window.loadingTaskData = false;
                                                            $("#saveUserData", "#GUIInterface").trigger("click", [{
                                                                fromSaveAndContniue: true, callBack: function (flag) {
                                                                    $("#popup_cancel").click();
                                                                    userManager.methods.loadUserInfo(crushFTP.storage("userName"), true, function () {
                                                                        $("#quick_jump").val("Events").trigger('change', [true]);
                                                                        eventList.find("li:last").addClass("ui-selected ui-widget-header");
                                                                        panelEvents.eventItemSelected(eventList, eventList.find("li:last"));
                                                                        crushFTP.UI.hideLoadingIndicator(true);
                                                                    }, true, true);
                                                                }
                                                            }]);
                                                        }, 500);
                                                    }
                                                }
                                                addSelectedItems();
                                            }
                                        }, selectedUserEvents, 10, {
                                            multiple : true
                                        });
                                    }
                                }
                            }
                        }
                        if(!eventsAvailable)
                        {
                            jAlert("No events available for selected user : '" + selectedUser + "'", "Message", function(){
                                if(isCopy)
                                    $("#copyEvent", panelEvents._panel).trigger("click");
                                else
                                    $("#linkEvent", panelEvents._panel).trigger("click");
                            });
                        }
                    }, false, true);
                    panelEvents._panel.trigger("changed", [eventList]);
                }
            }, users);
        }
        return false;
    });

    $("a#sendEventEmail", panelEvents._panel).click(function(){
        var link = $(this);
        if(link.attr("disabled")) return false;

        var obj = {
            command : "sendEventEmail",
            email_from : crushFTP.methods.htmlEncode($("#from", panelEvents._panel).val()),
            email_to : crushFTP.methods.htmlEncode($("#to", panelEvents._panel).val()),
            email_cc : crushFTP.methods.htmlEncode($("#cc", panelEvents._panel).val()),
            email_bcc : crushFTP.methods.htmlEncode($("#bcc", panelEvents._panel).val()),
            email_subject : crushFTP.methods.htmlEncode($("#subject", panelEvents._panel).val()),
            email_body : encodeURIComponent($("#body", panelEvents._panel).val()),
            username : crushFTP.methods.htmlEncode(crushFTP.storage("userName")),
            serverGroup : crushFTP.methods.htmlEncode($("#userConnectionGroups").val()) || "MainUsers"
        };
        if($("#email", panelSetup._panel).val().length>0)
        {
            obj.user_email = crushFTP.methods.htmlEncode($("#email", panelSetup._panel).val());
        }
        userManager.methods.performServerAction(link
            , obj
            , "Sending user information via email :");

        return false;
    });

    $("a#pickEmailTemplate", panelEvents._panel).click(function(){
        $("#emailTemplatesDialog").dialog("open");
        var that = $(this);
        var editBtn = $("#emailTemplatesDialog").find("#editEmailTemplate").hide();
        userManager.afterEmailTemplate = function(name, cancel, data)
        {
            editBtn.show();
            if(cancel)
                return;
            else if(data)
            {
                var emailActionPanel = $("#emailActionPanel", panelEvents._panel);
                emailActionPanel.find("#bcc").val(data.emailBCC).trigger('textchange');
                emailActionPanel.find("#body").val(decodeURIComponent(data.emailBody)).trigger('textchange');
                emailActionPanel.find("#from").val(data.emailFrom).trigger('textchange');
                emailActionPanel.find("#subject").val(data.emailSubject).trigger('textchange');
            }
        }
        return false;
    });

    function filterEvents(phrase)
    {
        var listToFilter = $("#eventList", panelEvents._panel);
        listToFilter.find("li").hide();
        listToFilter.find("li:Contains('"+phrase+"')").show();
    }

    var delay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    var filterAvailableEvents = $("#filterAvailableEvents", panelEvents._panel).unbind("keyup").keyup(function (evt) {
        var evt = (evt) ? evt : ((event) ? event : null);
        var phrase = this.value;
        if (panelEvents.last_searched_avl_c && panelEvents.last_searched_avl_c === phrase) {
            return false;
        }
        delay(function(){
            filterEvents(phrase);
            panelEvents.last_searched_avl_c = phrase;
        }, 500);
    });

    $("#clearAvlEventsFilter", panelEvents._panel).click(function(){
        filterAvailableEvents.val("").trigger("keyup");
        return false;
    });
}

panelEvents.eventDataChanged = function(selected2)
{
    if(window.loadingTaskData){
        // console.log("its loading task data still");
        return false;
    };
    var continueEvent = function()
    {
        var eventList = $("#eventList", panelEvents._panel);
        var eventActionPanel = $("#eventActionPanel", panelEvents._panel);
        var selected = eventList.find("li.ui-selected");
        if(selected && selected.length>0 && selected.data("pluginData")) // If event is selected
        {
            var pluginData = selected.data("pluginData");
            if(!pluginData.event_action_list)
            {
                // console.log(pluginData, "plugin data does not have event action list");
                return;
            }
            //console.log(pluginData.task, pluginData);
            var isPlugin = pluginData.event_action_list[0].text == "(run_plugin)" || pluginData.event_action_list[0].text == "(subscribe_reverse_notification_event_template)";
            var eventsJsonData = {};
            var eventsJsonDataDeep = {};
            if(isPlugin && pluginData && pluginData.pluginName && jQuery.isArray(pluginData.pluginName))
            {
                if(crushFTP.kioskJobData && !crushFTP.kioskJobData.readyListenChanges){
                    // console.log("its loading kiosk data and ready listen changes not fired yet");
                    return;
                }
                crushFTP.UI.hideLoadingIndicator({});
                var pluginName = pluginData.pluginName[0].text;
                if(pluginName && pluginName.length>0 &&  window["plugin"+pluginName])
                {
                    //panelEvents._panel.find(".maskPasswordOnURL").trigger("rebuild");
                    var script = "selected.data(\"pluginDataTemp\", plugin"+pluginName+".saveContent());";
                    eval(script);
                    var eventPluginData = selected.data("pluginDataTemp");
                    selected.removeData("pluginDataTemp");
                    eventsJsonDataDeep = $.xml2json(eventPluginData, true);
                    eventsJsonData = $.xml2json(eventPluginData);
                }
            }
            var eventDataBindPanel  = eventActionPanel.find("#eventDataBindPanel");
            var inputs = eventDataBindPanel.find(".ignoreBind").removeClass("ignoreBind");
            $("#pluginsAvailable, #variable", panelEvents._panel).addClass("ignoreBind");
            var xml = userManager.data.buildXMLToSubmitForm(eventDataBindPanel, true);
            inputs.addClass("ignoreBind");
            var fieldsData = $.xml2json("<item>"+xml+"</item>");
            var mergedData = $.extend(fieldsData, eventsJsonData);
            if (mergedData.event_plugin_list == 'CrushTask (User Defined)' && $(document).data('app_enterprise')){
                $("#copyToJobs", panelEvents._panel).show().parent('span.enterpriseFeature').show().css({
                    'position':'relative',
                    'display':'inline-block'
                });
            }
            for(var key in mergedData)
            {
                var val = mergedData[key];
                if(typeof val === "string")
                {
                    mergedData[key] = decodeURIComponent(val);
                }
            }
            var events = [];
            var currentUserInherited = crushFTP.storage("currentUserInherited");
            if(currentUserInherited && currentUserInherited.user)
            {
                var user = currentUserInherited.user;
                if(user && user.events)
                {
                    events = user.events;
                }
                else
                {
                    user.events = events;
                }
                crushFTP.methods.rebuildSubItems(events, "events");
                events.events_subitem[parseInt(selected.attr("_index"))-1] = mergedData;
                crushFTP.storage("currentUserInherited", currentUserInherited);
            }
            selected.data("controlData", mergedData);
            var fieldsDataDeep = $.xml2json("<item>"+xml+"</item>", true);
            var mergedDataDeep = $.extend(fieldsDataDeep, eventsJsonDataDeep);
            mergedDataDeep = crushFTP.methods.jsonToXML(mergedDataDeep, false, false, false, true);
            mergedDataDeep = $.xml2json("<item>"+mergedDataDeep+"</item>", true);
            //console.log("updating", mergedDataDeep, selected.index(), selected2.index());
            panelEvents.updateEventsDataInCache(mergedDataDeep, selected);
            if(selected.text().toLowerCase().indexOf("link : ")==0){
                // $("#eventActionPanel").block({
                //     message:  '',
                //     overlayCSS: { opacity: 0.1, cursor: 'normal'}
                // });
            }
            else
                $("#eventActionPanel").unblock();
        }
    }
    localEventLoadDelay(function(){
        continueEvent();
    }, 100);
    // continueEvent();
}

panelEvents.updateEventsDataInCache = function(eventData, selected)
{
    selected = $("li.ui-selected", eventList);
    try
    {
        var eventsItem = panelEvents.jsonDeep["response_data"][0]["user_items"][0]["user"][0]["events"][0]["events_subitem"];
        if(!eventsItem)
        {
            var events = panelEvents.jsonDeep["response_data"][0]["user_items"][0]["user"][0]["events"];
            if(!events || !jQuery.isArray(events))
            {
                panelEvents.jsonDeep["response_data"][0]["user_items"][0]["user"][0]["events"] = [{
                    "events_subitem" : []
                }];
            }
            else if(!events[0]["events_subitem"] || !jQuery.isArray(events[0]["events_subitem"]))
            {
                events[0]["events_subitem"] = [];
            }
            eventsItem = panelEvents.jsonDeep["response_data"][0]["user_items"][0]["user"][0]["events"][0]["events_subitem"];
        }
        var eventFound = false;
        var ID = eventData.id[0].text;
        for(var i=0;i<eventsItem.length;i++)
        {
            var curEvent = eventsItem[i];
            var eventId = curEvent.id[0].text;

            if(ID == eventId)
            {
                eventsItem[i] = $.extend(true, {}, eventData);
                eventFound = true;
            }
        }
        if(!eventFound)
        {
            if(!jQuery.isArray(eventsItem))
            {
                eventsItem = [];
            }
            eventsItem.push($.extend(true, {}, eventData));
        }
        if(selected && selected.length>0)
        {
            selected.data("pluginData", $.extend(true, {}, eventData));
        }
        userManager.methods.itemsChanged(true, panelEvents._panel);
    }
    catch(ex){}
}

panelEvents.eventItemSelected = function(list, selected, noRefresh, controlData, loadingLinkedItem)
{
    var eventList = $("#eventList", panelEvents._panel);
    var eventActionPanel = $("#eventActionPanel", panelEvents._panel);
    selected = $("li.ui-selected", eventList);
    if(selected) // If event is selected
    {
        window.loadingTaskData = true;
        $("#tasksList").empty();
        eventActionPanel.show();
        event_action_list.find("span option[value='(subscribe_reverse_notification_event_template)']").unwrap();
        // Options for selected event
        controlData = controlData || selected.data("controlData");
        //console.log(controlData, selected);
        if(controlData)
        {
            panelEvents._panel.find("#eventDataBindPanel").find("input, select, textarea").unbind("change.custom");
            panelEvents._panel.find("#eventDataBindPanel").find("input[type='text'], textarea").unbind("change.custom");
            event_action_list.find("span option[value='(subscribe_reverse_notification_event_template)']").unwrap();

            var eventDataBindPanel = eventActionPanel.find("#eventDataBindPanel");
            var inputs = eventDataBindPanel.find(".ignoreBind").removeClass("ignoreBind");
            $("#pluginsAvailable, #variable, #event_plugin_list", panelEvents._panel).addClass("ignoreBind");
            if(typeof controlData.async == "undefined")
                controlData.async = "auto";

            $("#event_if_list", panelEvents._panel).show();
            $("#event_if_list", panelEvents._panel).find("option[rel='temp']").remove();
            $("#event_if_list_labels", panelEvents._panel).remove();

            var ifList = controlData.event_if_list ? controlData.event_if_list.split(")(").join("|") : "";

            if(ifList){
                ifList = ifList.substr(0, ifList.lastIndexOf(")"));
                ifList = ifList.substr(1, ifList.length);
                ifList = ifList.split("|");
                if(ifList.length>1){
                    var labels = [];
                    for(var i=0; i<=ifList.length;i++)
                    {
                        if(ifList[i])
                        {
                            var curVal = ifList[i].split("_")[0];
                            if(curVal == "make")
                                curVal = "Create Folder";
                            labels.push("<span>"+curVal+"</span>");
                        }
                    }
                    $("#event_if_list", panelEvents._panel).append("<option rel='temp' value='"+controlData.event_if_list+"'>temp</option>").hide();
                    $("#event_if_list", panelEvents._panel).after("<div id='event_if_list_labels'>"+labels.join("")+"</div>");
                }
            }

            userManager.data.bindValuesFromJson(eventDataBindPanel, controlData, false, true, loadingLinkedItem);

            eventDataBindPanel.find(".maskPasswordOnURL").trigger("applymask");

            crushFTP.UI.checkUnchekInput($("#event_"+controlData.async+"_cb", panelEvents._panel), true);

            $(".event_user_action_list:checked", panelEvents._panel).each(function(){
                crushFTP.UI.checkUnchekInput($(this));
            });
            var event_user_action_list = $("#event_user_action_list", panelEvents._panel);
            var event_user_action_listVal = event_user_action_list.val();
            if(event_user_action_listVal)
            {
                var actionItems = event_user_action_listVal.split("(");
                var filteredItems = [];
                for (var i = 0; i < actionItems.length; i++) {
                    var curAction = actionItems[i];
                    if(curAction && curAction.length>0)
                    {
                        curAction = curAction.replace("(","").replace(")","");
                        filteredItems.push(curAction);
                    }
                };
                if(filteredItems.length>0)
                {
                    for (var i = 0; i < filteredItems.length; i++) {
                        crushFTP.UI.checkUnchekInput($("#evtCB_" + filteredItems[i]), true);
                    };
                }
            }
            var eventVal = controlData.event_action_list;
            $("#pluginName", panelEvents._panel).val(controlData.pluginName || "");
            $("#event_plugin_list", panelEvents._panel).val(unescape(controlData.event_plugin_list) || "");
            var event_plugin_list = unescape($("#event_plugin_list", panelEvents._panel).val());
            if(event_plugin_list && event_plugin_list.lastIndexOf(":") == event_plugin_list.length-1)
            {
                event_plugin_list = event_plugin_list.substring(0, event_plugin_list.lastIndexOf(":"));
            }
            if(event_plugin_list.indexOf("Job:")<0)
                $("#pluginsAvailable", panelEvents._panel).find("option").each(function() { this.selected = (this.text == event_plugin_list); });
            else
                $("#pluginsAvailable", panelEvents._panel).val(event_plugin_list);
            if(!noRefresh){
                panelEvents.loadEventInfo(eventVal, true, selected);
            }
            panelEvents._panel.find("#eventDataBindPanel").find("input, select, textarea").unbind("change.custom").bind("change.custom", function(){

                if($(this).attr("id") == "event_always_cb" && $(this).is(":checked"))
                {
                    $("#event_if_list", panelEvents._panel).val("").trigger("change");
                }
                else if($(this).attr("id") == "event_now_cb" && $(this).is(":checked"))
                {
                    $("#event_after_list", panelEvents._panel).val("").trigger("change");
                }

                if($(this).attr("id") == "event_auto_cb" && $(this).is(":checked"))
                {
                    $("#async", panelEvents._panel).val("auto").trigger("change");
                }
                else if($(this).attr("id") == "event_yes_cb" && $(this).is(":checked"))
                {
                    $("#async", panelEvents._panel).val("yes").trigger("change");
                }
                else if($(this).attr("id") == "event_no_cb" && $(this).is(":checked"))
                {
                    $("#async", panelEvents._panel).val("no").trigger("change");
                }

                if($(this).hasClass('maskPasswordOnURL'))
                    $(this).trigger('applymask')

                if($(this).hasClass('eventListAction'))
                {
                    event_user_action_list.val("");
                    var items = [];
                    $(".eventListAction:checked", panelEvents._panel).each(function(){
                        items.push($(this).attr("rel"));
                    });
                    event_user_action_list.val(items.join("")).trigger("change");
                }
                panelEvents.eventDataChanged(selected);
            });

            panelEvents._panel.find("#eventDataBindPanel").find("input[type='text'], textarea").unbind("textchange.custom").bind("textchange.custom", function(){
                panelEvents.eventDataChanged(selected);
            });

            $("#variable", panelEvents._panel).unbind("change.custom1").bind("change.custom1", function(){
                var selectedText = $(this).find(":selected").text();
                if(selectedText.length>0)
                {
                    $("#subject", panelEvents._panel).val();
                    var bodyTextArea = $("textarea#body", panelEvents._panel);
                    if(bodyTextArea.val().length>0)
                    {
                        bodyTextArea.val(bodyTextArea.val() + "\n" + ($(this).val()+"").replace(/(\\n)/gm,"\n") + "\n");
                    }
                    else
                    {
                        bodyTextArea.val(bodyTextArea.val() + ($(this).val()+"").replace(/(\\n)/gm,"\n") + "\n");
                    }
                    $(this).val("");
                }
                panelEvents.eventDataChanged(selected);
            });

            //hide eventActionPanel, show it on selection
            var ftpDirPanel = $("#ftpDirPanel", panelEvents._panel);

            var pluginsAvailable = $("#pluginsAvailable", panelEvents._panel).unbind("change.custom1").bind("change.custom1", function(){
                if($(this).val().indexOf("Job:")==0)
                {
                    $("#event_plugin_list", panelEvents._panel).val($(this).val()).trigger("change");
                    panelEvents.loadEventInfo(event_action_list.val(), true, selected, true);
                }
                else
                {
                    var selectedName = $(this).find("option:selected").text();
                    var pluginName = $(this).val().split(":")[0];
                    $("#pluginName", panelEvents._panel).val(pluginName);
                    $("#event_plugin_list", panelEvents._panel).val(selectedName).trigger("change");
                    panelEvents.loadEventInfo(event_action_list.val(), true, selected, true);
                }
                panelEvents.eventDataChanged(selected);
            });

            event_action_list.unbind("change").change(function(){
                panelEvents.loadEventInfo($(this).val(), true, selected, true);
            });

            inputs.addClass("ignoreBind");
        }
    }
}

panelEvents.generateSpecialItemsXML = function(name, type)
{
    type = type || "add";
    if(type == "add")
        return panelEvents.generateXML();
    else
        return "events";
}

panelEvents.generateXML = function()
{
    if(panelEvents._panel.find("#userEventsCB").find("input:checked").length>0)
    {
        var xml = ["<events type=\"vector\">"];
        var eventList = $("#eventList", panelEvents._panel);
        var eventsItem = [];
        var addFakeEvent = true;
        try{
            eventsItem = panelEvents.jsonDeep["response_data"][0]["user_items"][0]["user"][0]["events"][0]["events_subitem"];
        }catch(ex){
            eventsItem = false;
        }
        if(eventsItem)
        {
            for(var i=0;i<eventsItem.length;i++)
            {
                var isFakeItem = false;

                try{
                    isFakeItem = eventsItem[i].id && (eventsItem[i].id[0].text == "null" || !eventsItem[i].name);
                }catch(ex){}

                if(!isFakeItem)
                {
                    var item = crushFTP.methods.jsonToXML(eventsItem[i], false, false, false, false, true);
                    if(item && item.length>0)
                    {
                        xml.push("<events_subitem type=\"properties\">");
                        xml.push(item);
                        if(item.indexOf("<id>")<0)
                        {
                            xml.push("<id>" + crushFTP.methods.generateRandomPassword(10) + "</id>");
                        }
                        xml.push("</events_subitem>");
                        addFakeEvent = false;
                    }
                }
            }
        }
        if(!eventsItem || eventsItem.length==0 || addFakeEvent)
        {
            xml.push("<events_subitem type=\"properties\">");
            xml.push("<id>null</id>");
            xml.push("</events_subitem>");
        }
        xml.push("</events>");
        var genXML = xml.join("\r\n");
        genXML = genXML.replace(/<tasks_subitem >/g, '<tasks_subitem type ="properties">')
            .replace(/\<connections>/g, "<connections type=\"vector\">")
            .replace(/\<connections_subitem>/g, "<connections_subitem type=\"properties\">")
            .replace(/\<type>properties<\/type>/g, "")
            .replace(/\<type>vector<\/type>/g, "")
            .replace(/\<connections type="vector">undefined<\/connections>/g, "")
            .replace(/\<connections type="vector"><connections_subitem\/><\/connections>/g, "<connections type=\"vector\"><connections_subitem type=\"properties\"><type>null</type><connectionID>null</connectionID></connections_subitem></connections>")
            .replace(/\<headers>/g, '<headers type="vector">')
            .replace(/\<headers_subitem>/g, '<headers_subitem type="properties">')
            .replace(/\<prop_item>/g, '<prop_item type="vector">')
            .replace(/\<prop_item_subitem>/g, '<prop_item_subitem type="properties">')
            .replace(/\<\nfunction item\(\) \{\n    \[native code\]\n\}\n>undefined<\/\nfunction item\(\) {\n    \[native code\]\n\}\n\>/g,"");
        return genXML;
    }
    else
        return "";
}