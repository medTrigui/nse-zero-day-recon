var serverLogging = {
    defaultBytes : 1048576,
    subtractCalcLen : 1048576,
    refreshInterval : 3000,
	selectedText : [],
    selectedTextLine : -1,
    selectedTextLineEnd : -1,
    selectingText : false,
    highlightColors :[
    {
        bgcolor : "#FFCC00",
        color : "#000000"
    },
    {
        bgcolor : "#FF9900",
        color : "#000000"
    },
    {
        bgcolor : "#FF0000",
        color : "#FFFFFF"
    },
    {
        bgcolor : "#CCCC99",
        color : "#000000"
    },
    {
        bgcolor : "#990033",
        color : "#FFFFFF"
    },
    {
        bgcolor : "#C3C3E5",
        color : "#000000"
    },
    {
        bgcolor : "#F1F0FF",
        color : "#000000"
    },
    {
        bgcolor : "#8C489F",
        color : "#FFFFFF"
    },
    {
        bgcolor : "#81A594",
        color : "#FFFFFF"
    },
    {
        bgcolor : "#FEFEE8",
        color : "#000000"
    }],
    getNextHighlightColor : function()
    {
        serverLogging.curColor = serverLogging.curColor || 0;
        if(serverLogging.curColor==9 || serverLogging.curColor==0)
        {
            serverLogging.curColor = 0;
            serverLogging.curColor++;
            return serverLogging.highlightColors[0];
        }
        else
        {
            serverLogging.curColor++;
            return serverLogging.highlightColors[serverLogging.curColor];
        }
    },
    getOppColor : function(color)
    {
        var oppColor;
        for(var i=0;i<serverLogging.highlightColors.length;i++)
        {
            if(serverLogging.highlightColors[i].bgcolor == color)
            {
                oppColor = serverLogging.highlightColors[i].color;
                i = serverLogging.highlightColors.length;
            }
        }
        if(!oppColor)
            oppColor = "#" + crushFTP.methods.getOppositeColor(color);
        return oppColor;
    },
    getParameterByName : function(name)
    {
      name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
      var regexS = "[\\?&]" + name + "=([^&#]*)";
      var regex = new RegExp(regexS);
      var results = regex.exec(window.location.search);
      if(results == null)
        return "";
      else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
    },
    init : function(){
        var mainServerInstance = localStorage.getItem("mainServerInstance");
        if(serverLogging.getParameterByName("embed") != "true")
        {
            crushFTP.data.serverRequest({
                command: 'getServerItem',
                    key: "server_settings/server_list",
                    random: Math.random()
                },
                function(data){
                    var _mainServerInstance = $("#mainServerInstance").empty();
                    if(data)
                    {
                        $(data).find("result_value_subitem").each(function(){
                            var type = $(this).find("serverType").text();
                            if(type.toLowerCase().indexOf("dmz") >= 0)
                            {
                                var instance = $(this).find("server_item_name").text();
                                if(!instance) instance = $(this).find("ip").text() + ":" + $(this).find("port").text();
                                if(instance && instance.length>0)
                                {
                                    if(instance.toLowerCase() == "main")
                                        _mainServerInstance.append("<option value=''>"+instance+"</option>");
                                    else
                                        _mainServerInstance.append("<option value='"+instance+"'>"+instance+"</option>");
                                }
                            }
                        });
                        if(_mainServerInstance.find("option").length>0)
                        {
                            _mainServerInstance.prepend("<option value=''>Main</option>");
                            if(mainServerInstance != null)
                            {
                                if(_mainServerInstance.find("option[value='"+mainServerInstance+"']").length>0)
                                {
                                    if(mainServerInstance.length>0 && mainServerInstance.toLowerCase()!= "main")
                                    {
                                        crushFTP.ajaxCallURL = adminPanel.ajaxCallURL = adminPanel.ajaxCallURL + mainServerInstance + "/";
                                    }
                                    _mainServerInstance.val(mainServerInstance);
                                }
                                else
                                {
                                    crushFTP.ajaxCallURL = adminPanel.ajaxCallURL = adminPanel.ajaxCallURLBase;
                                    _mainServerInstance.val("");
                                    localStorage.setItem("mainServerInstance", "");
                                }
                            }
                            else{
                                _mainServerInstance.val("");
                            }
                        }
                        else
                        {
                            _mainServerInstance.val("");
                            _mainServerInstance.parent().remove();
                        }
                    }
                    crushFTP.data.serverRequest({
                        command: "getServerRoots"
                    }, function(roots){
                        crushFTP.serverConfig = crushFTP.serverConfig || {};
                        crushFTP.serverConfig.userRoot = $(roots).find("user\\.root").text() || "/";
                        crushFTP.serverConfig.serverRoot = $(roots).find("server\\.root").text() || "/";
                        serverLogging.startLogViewer();
                    });
                }
            );
            $("#mainServerInstance").unbind().change(function(){
                localStorage.setItem("mainServerInstance", $(this).val());
                window.location = window.location;
            });
        }
        else
        {
            if(parent.crushFTP.ajaxCallURL){
                crushFTP.ajaxCallURL = adminPanel.ajaxCallURL = parent.crushFTP.ajaxCallURL;
            }
            else if(mainServerInstance.length>0 && mainServerInstance.toLowerCase()!= "main")
            {
                crushFTP.ajaxCallURL = adminPanel.ajaxCallURL = adminPanel.ajaxCallURL + mainServerInstance + "/";
            }
            serverLogging.startLogViewer();
        }
    },
    startLogViewer : function()
    {
        var fileToLoad = serverLogging.getParameterByName("file");
        if(fileToLoad && fileToLoad.length>0)
        {
            serverLogging.curLogFile = fileToLoad;
            $("#openInNewWindow").attr("href", "/WebInterface/admin/log.html?file=" + fileToLoad);
        }
        var drpLogBufferWindowSize = $("#drpLogBufferWindowSize");
        var ua = $.browser;
        if (!(window.mozInnerScreenX == null)) {
            drpLogBufferWindowSize.append("<option value='2097152'>2MB</option>");
            drpLogBufferWindowSize.append("<option value='5242880'>5MB</option>");
            drpLogBufferWindowSize.append("<option value='10485760'>10MB</option>");
            drpLogBufferWindowSize.append("<option value='20971520'>20MB</option>");
        }
        else if (ua.webkit) {
            drpLogBufferWindowSize.append("<option value='5242880'>5MB</option>");
            drpLogBufferWindowSize.append("<option value='10485760'>10MB</option>");
            drpLogBufferWindowSize.append("<option value='20971520'>20MB</option>");
            drpLogBufferWindowSize.append("<option value='31457280'>30MB</option>");
            drpLogBufferWindowSize.append("<option value='41943040'>40MB</option>");
        }
        else{
            drpLogBufferWindowSize.append("<option value='2097152'>2MB</option>");
            drpLogBufferWindowSize.append("<option value='3145728'>3MB</option>");
            drpLogBufferWindowSize.append("<option value='4194304'>4MB</option>");
            drpLogBufferWindowSize.append("<option value='5242880'>5MB</option>");
        }
        if(serverLogging.getParameterByName("embed") == "true")
        {
            $(".mainContentHolder").removeClass("ui-widget-content");
            $("#selectLogFile").hide();
            $("#mainServerInstance").parent().remove();
        }
        else
        {
            $("#openInNewWindow").hide();
        }
        $("#filterProcessIndicator").hide();
        crushFTP.UI.initLoadingIndicator();
        crushFTP.userLogin.bindUserName(function (response, username) {
            css_browser_selector(navigator.userAgent);
            if (response == "failure") {
                window.location = "/WebInterface/login.html?link=/WebInterface/admin/log.html";
            }
            else
            {
                $("#SessionSeconds").sessionChecker({
                    callBack:function(){
                        setTimeout(function(){
                            crushFTP.userLogin.userLoginStatusCheckThread();
                        }, 5000);
                    }
                });
            }
        });
        serverLogging.logPanel = $("#serverLogging");
        serverLogging.actionPanel = $("#actionPanel");
        serverLogging.miniMap = $("#miniMap");
        serverLogging.slider = $("#slider");
        serverLogging.realTimeIndicator = $(".realTimeIndicator");
        serverLogging.scrollWithActivity = $("#server_log_scroll_with_activity");
        serverLogging.slider.find(".moveSliderCustom.next").hide();
        setTimeout(function(){
            if(!serverLogging.logPanel || serverLogging.logPanel.length==0)
            {
                serverLogging.logPanel = $("#serverLogging");
                serverLogging.actionPanel = $("#actionPanel");
                serverLogging.miniMap = $("#miniMap");
                serverLogging.slider = $("#slider");
                serverLogging.realTimeIndicator = $("#realTimeIndicator");
                serverLogging.scrollWithActivity = $("#server_log_scroll_with_activity");
            }
        }, 1000);
        serverLogging.getLogData(0, 1, function(){
            if(!serverLogging.curLogInfo)
            {
                serverLogging.curLogInfo = {};
                serverLogging.curLogInfo.log_end = 0;
                serverLogging.curLogInfo.log_max = 0;
                serverLogging.curLogInfo.log_start = 0;
                serverLogging.curLogInfo.log_segment = [];
            }
            if(!serverLogging.curLogInfo.log_max)
                serverLogging.curLogInfo.log_max = 0;
            var newLength = serverLogging.curLogInfo.log_max - serverLogging.subtractCalcLen;
            if(newLength<0) newLength = 0;
            serverLogging.curLogInfo.log_segment = [];
            serverLogging.getLogData(newLength, serverLogging.defaultBytes, function()
            {
                serverLogging.redrawLogArea();
                if(!serverLogging.refreshThreadInterval)
                {
                    serverLogging.refreshThreadInterval = setInterval(function(){
                        serverLogging.seekNext();
                    }, serverLogging.refreshInterval);
                }
            });
        }, true);
        serverLogging.bindEvents();
        serverLogging.copyItemDialog = $("#copyItemDialog").dialog({
            autoOpen: false,
            height: 600,
            width: 1000,
            title : "Copy selected lines :",
            open : function(){
                setTimeout(function(){
                    serverLogging.copyItemDialog.find("textarea").focus().select();
                }, 100);
            },
            buttons : {
                "Download log snippet": function(){
                    downloadFile("CrushFTP_snippet_"+new Date().format("mm-dd-YYYY_hhnnss")+".log", serverLogging.copyItemDialog.find("textarea").val());
                },
                "OK" : function(){$(this).dialog("close");}
            }
        });

        serverLogging.copyItemHelpDialog = $("#copyItemHelpDialog").dialog({
            autoOpen: false,
            height: 660,
            width: 800,
            title : "How to copy from log :",
            modal : true,
            closeOnEscape : true,
            buttons : {"OK" : function(){$(this).dialog("close");}}
        });

        function measureScrollbar() {
          var $c = $("<div style='position:absolute; top:-10000px; left:-10000px; width:100px; height:100px; overflow:scroll;'></div>").appendTo("body");
          var dim = {
            width: $c.width() - $c[0].clientWidth,
            height: $c.height() - $c[0].clientHeight
          };
          $c.remove();
          return dim;
        }
        serverLogging.scrollbarDimensions = measureScrollbar();

        function getMaxSupportedCssHeight() {
          var supportedHeight = 1000000;
          // FF reports the height back but still renders blank after ~6M px
          var testUpTo = ($.browser.mozilla) ? 6000000 : 1000000000;
          var div = $("<div style='display:none' />").appendTo(document.body);

          while (true) {
            var test = supportedHeight * 2;
            div.css("height", test);
            if (test > testUpTo || div.height() !== test) {
              break;
            } else {
              supportedHeight = test;
            }
          }
          div.remove();
          return parseInt(supportedHeight);
        }
        serverLogging.maxHeightAllowed = getMaxSupportedCssHeight();

        //Delayed call of repeatative method, it will ignore all events untill specified event has completed
        var delay = (function () {
            var timer = 0;
            return function (callback, ms) {
                clearTimeout(timer);
                timer = setTimeout(callback, ms);
            };
        })();
        var filter = serverLogging.getParameterByName("filter");
        if(filter && filter.length>0)
        {
            $("#filterTag").val(filter);
            setTimeout(function(){
                $("#findAndFilters").show();
                $("#applyFilters").click();
                $("#findAndFilters").hide();
            }, 500);
        }
    },
    changeLogFile : function(file){
        serverLogging.curLogFile = serverLogging.curLogFile || "";
        if(serverLogging.curLogFile != file)
        {
            window.location = "/WebInterface/admin/log.html?file=" + file;
            return false;
            $("#findAndFilters").find(".removeSearchTerm, .removeFilter").trigger("click");
            $("#findAndFilters").find("#findPhrase, #filterTag").val("");
            $("#applyFilters").trigger("click");
            if($("#findAndFilters").is(":visible"))
            {
                $("#findAndFilterOptions").trigger("click");
            }
            serverLogging.curColor=0;
            serverLogging.curLogFile = file;
            $("#openInNewWindow").attr("href", "/WebInterface/admin/log.html?file=" + file);
            delete serverLogging.lastShownRange;
            if(!serverLogging.curLogInfo)
            {
                serverLogging.curLogInfo = {};
                serverLogging.curLogInfo.log_end = 0;
                serverLogging.curLogInfo.log_max = 0;
                serverLogging.curLogInfo.log_start = 0;
                serverLogging.curLogInfo.log_segment = [];
            }
            serverLogging.logPanel.empty();
            if(serverLogging.hasFindItems)
                serverLogging.findItemsResult = [];
            if(serverLogging.isLogFiltered)
                serverLogging.filteredItems = [];
            delete serverLogging.curLogInfo.log_end;
            delete serverLogging.curLogInfo.log_max;
            delete serverLogging.curLogInfo.log_start;
            delete serverLogging.curLogInfo.log_segment;
            delete serverLogging.curLogInfo.log_start_date;
            delete serverLogging.curLogInfo.log_end_date;
            $("#slider").find(".handle").css("left", $("#slider").width() - $("#slider").find(".handle").width());
            setTimeout(function(){
                crushFTP.UI.showLoadingIndicator({});
                clearInterval(serverLogging.refreshThreadInterval);
                delete serverLogging.refreshThreadInterval;
                serverLogging.getLogData(0, 1, function(noRender, hasError){
                    if(!hasError)
                    {
                        delete serverLogging.showingSliderRangeData;
                        serverLogging.reRenderLog = true;
                        serverLogging.realTimeIndicator.show();
                        serverLogging.performSliderDrag();
                        if(!serverLogging.refreshThreadInterval)
                        {
                            function callback(){
                                crushFTP.UI.hideLoadingIndicator({});
                            }
                            serverLogging.refreshThreadInterval = setInterval(function(){
                                serverLogging.seekNext(function(){
                                    if(callback)
                                    {
                                        callback();
                                        callback = false;
                                    }
                                });
                            }, serverLogging.refreshInterval);
                        }
                    }
                }, true);
            }, 100);
        }
    },
    bindEvents : function()
    {
        $("#changeColorScheme").click(function(){
            serverLogging.logPanel.toggleClass("day");
            return false;
        });

        var crushLogBGColor = $.cookie("crushLogBGColor");
        var crushLogFontColor = $.cookie("crushLogFontColor");

        if(crushLogBGColor)
        {
           var input = $("#colorSchemeBGColor").val(crushLogBGColor);
           setTimeout(function(){
            input.trigger("change");
           }, 100);
        }

        if(crushLogFontColor)
        {
           var input = $("#colorSchemeFontColor").val(crushLogFontColor);
           setTimeout(function(){
            input.trigger("change");
           }, 100);
        }

        var parentElem = serverLogging.logPanel.parent();
        parentElem.scroll(function(){
            delay(function(){
                var st = parentElem.scrollTop() - serverLogging.scrollbarDimensions.height;
                if(st < (serverLogging.logPanel.innerHeight() - serverLogging.logPanel.parent().innerHeight() - 25))
                {
                    serverLogging.scrollWithActivity.removeAttr("checked");
                }
                else{
                    if(serverLogging.lastLinesCount>80)
                        serverLogging.scrollWithActivity.attr("checked","checked");
                }
                serverLogging.renderLogDataByScrollPosition(st);
            }, 50);
        });

        serverLogging.logPanel.bind("focus, click", function(){
            serverLogging.isFocusOnLogArea = true;
        });

        $(document.documentElement).keydown(function (event) {
            if(serverLogging.isFocusOnLogArea)
            {
                var curST = parentElem.scrollTop();
                // handle cursor keys
                if (event.keyCode == 40) {// go down
                    parentElem.scrollTop(curST+15);
                    event.preventDefault();
                    event.stopPropagation();
                } else if (event.keyCode == 38) {// go up
                    parentElem.scrollTop(curST-15);
                    event.preventDefault();
                    event.stopPropagation();
                } else if (event.keyCode == 34) {// go page up
                    parentElem.scrollTop(curST+200);
                    event.preventDefault();
                    event.stopPropagation();
                } else if (event.keyCode == 33) {// go page down
                    parentElem.scrollTop(curST-200);
                    event.preventDefault();
                    event.stopPropagation();
                } else if (event.keyCode == 35) {// go to line end
                    if(event.ctrlKey || event.metaKey)
                        parentElem.scrollTop(serverLogging.logPanel.height());
                    else
                        parentElem.scrollLeft(serverLogging.logPanel.width());
                    event.preventDefault();
                    event.stopPropagation();
                } else if (event.keyCode == 36) {// go to line home
                    if(event.ctrlKey || event.metaKey)
                        parentElem.scrollTop(0);
                    else
                        parentElem.scrollLeft(0);
                    event.preventDefault();
                    event.stopPropagation();
                } else if (event.metaKey || event.ctrlKey) {
                    if(event.keyCode == 65){
                        copyCurrentView();
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }
            }
        }).bind("click", function(e){
            if(!$(e.target).hasClass("logData")){
                serverLogging.isFocusOnLogArea = false;
            }
        });

        function copyCurrentView() {
            var copyItems = [];
            // serverLogging.logPanel.find("div.logData").each(function(){
            //     copyItems.push($(this).text());
            // });
            var currentLog = serverLogging.curLogInfo.log_segment.join("\n");
            serverLogging.copyItemDialog.empty().append("<textarea style='width:99%;height:550px;'>"+currentLog+"</textarea>");
            serverLogging.copyItemDialog.dialog("open");
        }

        /*Hotkeys binding*/
        // Find and filters
        jQuery(document).bind('keydown', 'Ctrl+f', function (evt){
            if($("#findAndFilters").is(":visible"))
            {
                $("#findAndFilters").find("input:first").select().focus();
            }
            else
                $("#findAndFilterOptions").trigger("click");
            evt.stopPropagation();
            evt.preventDefault();
        });

        jQuery(document).bind('keydown', 'Meta+f', function (evt){
            if($("#findAndFilters").is(":visible"))
            {
                $("#findAndFilters").find("input:first").select().focus();
            }
            else
                $("#findAndFilterOptions").trigger("click");
            evt.stopPropagation();
            evt.preventDefault();
        });

        // Next result
        jQuery(document).bind('keydown', 'f3', function (evt){
            $("#nextResult").trigger("click");
            evt.stopPropagation();
            evt.preventDefault();
        });

        jQuery(document).bind('keydown', 'Ctrl+g', function (evt){
            $("#nextResult").trigger("click");
            evt.stopPropagation();
            evt.preventDefault();
        });

        jQuery(document).bind('keydown', 'Meta+g', function (evt){
            $("#nextResult").trigger("click");
            evt.stopPropagation();
            evt.preventDefault();
        });

        //Prev result
        jQuery(document).bind('keydown', 'Shift+f3', function (evt){
            $("#prevResult").trigger("click");
            evt.stopPropagation();
            evt.preventDefault();
        });

        jQuery(document).bind('keydown', 'Ctrl+h', function (evt){
            $("#prevResult").trigger("click");
            evt.stopPropagation();
            evt.preventDefault();
        });

        //Reset find and fitlers
        jQuery(document).bind('keydown', 'Alt+f3', function (evt){
            $("#resetFindAndFilters").trigger("click");
            evt.stopPropagation();
            evt.preventDefault();
        });

        //Move slider one step left
        jQuery(document).bind('keydown', 'Alt+left', function (evt){
            if(!serverLogging.fetchRequestInProgress)
            {
                $("span.moveSliderCustom.prev:visible").trigger("click");
            }
            evt.stopPropagation();
            evt.preventDefault();
        });

        //Move slider one step right
        jQuery(document).bind('keydown', 'Alt+right', function (evt){
            if(!serverLogging.fetchRequestInProgress)
            {
                $("span.moveSliderCustom.next:visible").trigger("click");
            }
            evt.stopPropagation();
            evt.preventDefault();
        });

        //clear log
        jQuery(document).bind('keydown', 'Meta+k', function (evt){
            $("#clearLog:visible").trigger("click");
            evt.stopPropagation();
            evt.preventDefault();
        });

        jQuery(document).bind('keydown', 'Ctrl+k', function (evt){
            $("#clearLog:visible").trigger("click");
            evt.stopPropagation();
            evt.preventDefault();
        });

        //Line scroll to end
        jQuery(document).bind('keydown', 'Meta+right', function (evt){
            parentElem.scrollLeft(serverLogging.logPanel.width());
            evt.stopPropagation();
            evt.preventDefault();
        });

        //Line scroll to home
        jQuery(document).bind('keydown', 'Meta+left', function (evt){
            parentElem.scrollLeft(0);
            evt.stopPropagation();
            evt.preventDefault();
        });

        //Toggle Scroll with activity
        jQuery(document).bind('keydown', 'Alt+s', function (evt){
            if(serverLogging.scrollWithActivity.is(":checked"))
                serverLogging.scrollWithActivity.removeAttr("checked");
            else
                serverLogging.scrollWithActivity.attr("checked", "checked");
            evt.stopPropagation();
            evt.preventDefault();
        });

        $("#colorSchemeBGColor, #colorSchemeFontColor").colorPicker().change(function(){
            var options = {
                path: '/',
                expires: 365
            };
            if($(this).is("#colorSchemeBGColor"))
            {
                crushFTP.methods.createCSSClass(".customScheme p, .customScheme div", "background-color:" + $(this).val() + ";color:" + $(this).parent().parent().find("#colorSchemeFontColor").val()+"!important;");
                $.cookie("crushLogBGColor", null);
                $.cookie("crushLogBGColor", $(this).val(), options);
            }
            else
            {
                crushFTP.methods.createCSSClass(".customScheme p, .customScheme div", "background-color:" + $(this).parent().parent().find("#colorSchemeBGColor").val() + ";color:" + $(this).val() +"!important;");
                $.cookie("crushLogFontColor", null);
                $.cookie("crushLogFontColor", $(this).val(), options);
            }
        });

        var delay = (function () {
            var timer = 0;
            return function (callback, ms) {
                clearTimeout(timer);
                timer = setTimeout(callback, ms);
            };
        })();

        $(".toTop, .toBottom", "#navMapWrapper").click(function(){
            if($(this).is(".toTop"))
                serverLogging.logPanel.parent().scrollTo({left:0, top: 0}, 500);
            else
                serverLogging.logPanel.parent().scrollTo({left:0, top: serverLogging.logPanel.height()}, 500);
            return false;
        });

        var handle = serverLogging.slider.find(".handle").draggable({
            axis: "x",
            containment: "parent",
            drag: function(event, ui) {
                serverLogging.performSliderDrag();
            },
            stop: function(event, ui) {
                serverLogging.performSliderDrag();
                serverLogging.showLogSegmentBySelection();
            }
        });

        var handleMiniMap = serverLogging.miniMap.find(".positionMarker").draggable({
            axis: "y",
            containment: "parent",
            drag: function(event, ui) {
                serverLogging.minimapPositionChanged(handleMiniMap);
            },
            stop : function(event, ui){
                serverLogging.dontScroll = false;
            }
        });

        serverLogging.miniMap.bind('mousewheel', function(event, delta) {
            var up = delta > 0,
                vel = Math.abs(delta);
            if(vel)
            {
                var parentHeight = serverLogging.miniMap.innerHeight() - handleMiniMap.outerHeight();
                var top = handleMiniMap.offsetRelativeTo(serverLogging.miniMap).top;
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
                    serverLogging.minimapPositionChanged(handleMiniMap);
                    setTimeout(function(){
                        serverLogging.dontScroll = false;
                    }, 10);
                }, 10);
            }
            return false;
        });

        serverLogging.miniMap.click(function(e){
            if($(this).hasClass("pointer"))
            {
                e.stopPropagation();
                var offset = $(this).offset();
                var topPos = e.clientY - offset.top - 7;
                if(topPos+13>$(this).height())
                    topPos = $(this).height()-13;
                handleMiniMap.css("top", topPos);
                setTimeout(function(){
                    serverLogging.minimapPositionChanged(handleMiniMap);
                    setTimeout(function(){
                        serverLogging.dontScroll = false;
                    }, 10);
                }, 10);
            }
        });

        serverLogging.logPanel.parent().scroll(function(){
            if(serverLogging.dontScroll)return;
            var _height = serverLogging.logPanel.height() - serverLogging.logPanel.parent().height();
            var _scrollPos = $(this).scrollTop();
            var perc = (100 * _scrollPos) / _height;
            if(perc<0)perc=0;
            if(perc>100)perc=100;
            var parentHeight = serverLogging.miniMap.innerHeight() - handleMiniMap.outerHeight();
            var topPos = (parentHeight * perc) / 100;
            if(isNaN(topPos))
                topPos = 0;
            handleMiniMap.css("top", topPos);
        });

        var handleLeft = serverLogging.slider.width() - handle.width() - 5;
        handle.css("left", handleLeft);
        serverLogging.slider.find(".moveSliderCustom.prev").css("left", handleLeft + 24);
        serverLogging.slider.find(".moveSliderCustom.next").css("left", handleLeft + 145);

        $("#drpLogBufferWindowSize").change(function(){
            serverLogging.defaultBytes = parseInt($(this).val());
            serverLogging.performSliderDrag();
            serverLogging.showLogSegmentBySelection();
        });

        $(window).resize(function () {
            serverLogging.resizeSlider(handle);
            serverLogging.resizeLogPanel();
        });

        serverLogging.resizeLogPanel();
        serverLogging.resizeSlider(handle);

        serverLogging.logPanel.bind("copy", function(){
            if(!$("#dontShowCopyHelp").is(":checked"))
                serverLogging.copyItemHelpDialog.dialog("open");
        });

        serverLogging.logPanel.bind("cut", function(){
            if(!$("#dontShowCopyHelp").is(":checked"))
                serverLogging.copyItemHelpDialog.dialog("open");
        });

        serverLogging.slider.find(".moveSliderCustom").unbind().click(function(){
            var curStartPoint;
            if(serverLogging.curLogInfo.sliderStartPoint == 0 ||  serverLogging.curLogInfo.sliderStartPoint)
                curStartPoint = parseInt(serverLogging.curLogInfo.sliderStartPoint);
            else
                curStartPoint = parseInt(serverLogging.curLogInfo.log_start);
            var startPoint, perc;
            if($(this).is(".prev"))
            {
                startPoint = curStartPoint - serverLogging.defaultBytes;
            }
            else
            {
                startPoint = curStartPoint + serverLogging.defaultBytes;
            }
            if(startPoint<0)startPoint=0;
            if(startPoint>(serverLogging.curLogInfo.log_max - serverLogging.defaultBytes))
            {
                delete serverLogging.curLogInfo.sliderStartPoint;
                perc = 100;
                serverLogging.slider.find(".moveSliderCustom.next").hide();
                startPoint = serverLogging.curLogInfo.log_max - serverLogging.defaultBytes;
            }
            else
            {
                serverLogging.slider.find(".moveSliderCustom.next").show();
                serverLogging.curLogInfo.sliderStartPoint = startPoint;
                perc = (100 * startPoint)/serverLogging.curLogInfo.log_max;
                perc = perc.toFixed(1);
                if(perc==0)
                    serverLogging.slider.find(".moveSliderCustom.prev").hide();
                else
                {
                    serverLogging.slider.find(".moveSliderCustom.prev").show();
                    if(perc>100)
                        perc=100;
                    else if(perc<0)
                        perc=0;
                }
            }
            var endPoint = startPoint + serverLogging.defaultBytes;
            if(endPoint>serverLogging.curLogInfo.log_max)
                endPoint = serverLogging.curLogInfo.log_max;
            serverLogging.slider.find(".valSelectionRange").text(crushFTP.methods.formatBytes(startPoint) + " - " + crushFTP.methods.formatBytes(endPoint));
            serverLogging.resizeSlider(handle, perc);
            serverLogging.showLogSegmentBySelection();
            if(startPoint===0)
                serverLogging.slider.find(".moveSliderCustom.prev").hide();
            return false;
        });

        var findAndFiltersPanel = $("#findAndFilters");

        var findAndFilterOptions = $("#findAndFilterOptions").unbind().click(function(){
            var textSpan = $(this).find(".text");
            var iconSpan = $(this).find(".ui-icon");
            var clsTag = "ui-icon-tag";
            if(iconSpan.length == 0){
                iconSpan = $(this).find(".fa");
                clsTag = "fa-tag";
            }
            if(iconSpan.hasClass(clsTag))
            {
                findAndFiltersPanel.slideDown("fast", function(){
                    findAndFiltersPanel.find("input:first:visible").focus();
                    serverLogging.resizeLogPanel();
                });
                iconSpan.addClass("ui-icon-close").removeClass(clsTag);
                textSpan.text("Hide Find and Filters")
            }
            else
            {
                findAndFiltersPanel.slideUp("medium", function(){
                    serverLogging.resizeLogPanel();
                });
                iconSpan.addClass(clsTag).removeClass("ui-icon-close");
                textSpan.text("Show Find and Filters");
            }
            return false;
        });

        function showTipForActions()
        {
            findAndFiltersPanel.find(".addSearchTerm").addClass("vtip").attr("title", "Add another field");
            findAndFiltersPanel.find(".removeSearchTerm").addClass("vtip").attr("title", "Remove this field");
            findAndFiltersPanel.find(".addFilter").addClass("vtip").attr("title", "Add another filter");
            findAndFiltersPanel.find(".removeFilter").addClass("vtip").attr("title", "Remove this filter");
            vtip(findAndFiltersPanel);
            $("#vtip").hide();
        }

        function findTermRemoved(uid)
        {
            serverLogging.findCSSClasses = serverLogging.findCSSClasses || [];
            if(serverLogging.findCSSClasses.has(uid))
            {
                serverLogging.logPanel.removeHighlight(uid);
                serverLogging.findCSSClasses.remove(serverLogging.findCSSClasses.indexOf(uid));
                serverLogging.miniMap.find("span.marker." + uid).remove();
            }
            var opts = serverLogging.findOpts;
            if(opts)
            {
                var _index = -1;
                for(var j=0;j<opts.length;j++)
                {
                    var opt = opts[j];
                    if(opt.uid == uid)
                    {
                        _index = j;
                        j=opts.length;
                    }
                }
                if(_index>-1)
                {
                    opts.remove(_index);
                    var result = serverLogging.findItemsResult;
                    if(!result || result.length==0)
                    {
                        return false;
                    }
                    var newRes = [];
                    var resultLength = result.length;
                    for(var i=0;i<resultLength;i++)
                    {
                        var curItem = result[i];
                        if(curItem.uid!=uid)
                            newRes.push(curItem);
                    }
                    serverLogging.findItemsResult = newRes;
                }
            }
            if(serverLogging.findCSSClasses.length==0)
                serverLogging.hasFindItems = false;
        }

        function filterRemoved(uid)
        {
            serverLogging.filterItems = serverLogging.filterItems || [];
            if(serverLogging.filterItems.has(uid))
            {
                serverLogging.filterItems.remove(serverLogging.filterItems.indexOf(uid));
                serverLogging.filterOptionItems = serverLogging.filterOptionItems || [];
                for(var i=0;i<serverLogging.filterOptionItems.length;i++)
                {
                    if(serverLogging.filterOptionItems[i].uid == uid)
                    {
                        serverLogging.filterOptionItems.remove(i);
                        i = serverLogging.filterOptionItems.length +1;
                    }
                }
            }
            if(serverLogging.filterItems.length==0)
            {
                serverLogging.isLogFiltered =
                serverLogging.filterOptionItems = false;
                serverLogging.filteredItems = [];
            }
            serverLogging.processFindAndFilters();
        }

        function colorCodeChange()
        {
            var uid = $(this).closest("div.findOption").attr("uniqueid");
            serverLogging.findCSSClasses = serverLogging.findCSSClasses || [];
            if(serverLogging.findCSSClasses.has(uid))
            {
                var cls = "." + uid;
                var bgcolor = $(this).val();
                crushFTP.methods.createCSSClass(cls, "background-color:" + bgcolor + ";display:inline;color:" + serverLogging.getOppColor(bgcolor)+"!important;");
            }
        }

        var findTermPanel = $("#findTermPanel").EnableMultiField({
            confirmOnRemove: false,
            linkText : "",
            linkClass : "addSearchTerm",
            removeLinkText : "",
            removeLinkClass : "removeSearchTerm",
            addEventCallback : function(newElem, clonnedFrom){
                var randomColor = serverLogging.getNextHighlightColor();
                newElem.find("input.colorPicker").val(randomColor.bgcolor).colorPicker().change(colorCodeChange);
                showTipForActions();
                newElem.find("input.findPhrase").focus().keydown(function (e) {
                    var keyCode = e.keyCode || e.which;
                    if (keyCode == 13) {
                        $("#applyFilters").trigger("click");
                        return false;
                    }
                    else if (keyCode == 9) {
                        if(e.shiftKey)
                        {
                            if(newElem.prev().find("input:first").select().focus().length>0)
                            {
                                e.preventDefault();
                                return false;
                            }
                        }
                        else
                        {
                            var itm = newElem.find(".addSearchTerm").trigger("click");
                            if(itm.length>0)
                            {
                                e.preventDefault();
                                return false;
                            }
                        }
                    }
                    else if (keyCode == 27) {
                        if(!$(this).val())
                            newElem.find(".removeSearchTerm").trigger("click");
                        else
                            $(this).val("");
                        e.preventDefault();
                        return false;
                    }
                });
                if(clonnedFrom.find(".removeSearchTerm").length==0)
                {
                    var removeBase = $('<a style="margin-left:5px;" href="#" class="removeSearchTerm vtip" title="Remove this field"></a>');
                    clonnedFrom.find(".color_picker").after(removeBase);
                    removeBase.click(function(){
                        findTermRemoved(clonnedFrom.attr("uniqueid"));
                        clonnedFrom.hide().find("input.findPhrase").val("");
                        return false;
                    });
                }
                serverLogging.resizeLogPanel();
            },
            removeEventCallback : function(prev, self, uid){
                findTermRemoved(uid);
                if(findTermPanel.parent().find(".findOption").length==1)
                {
                    findTermPanel.show().find(".removeSearchTerm").remove();
                }
                prev.find("input.findPhrase").focus();
                setTimeout(function(){
                    $("#vtip").hide();
                }, 100);
                serverLogging.resizeLogPanel();
            }
        });

        findTermPanel.find("input.findPhrase").focus().keydown(function (e) {
            var keyCode = e.keyCode || e.which;
            if (keyCode == 13) {
                $("#applyFilters").trigger("click");
                return false;
            }
            else if (keyCode == 9) {
                if(e.shiftKey)
                {
                    if(findTermPanel.prev().find("input:first").select().focus().length>0)
                    {
                        e.preventDefault();
                        return false;
                    }
                }
                else
                {
                    var itm = findTermPanel.find(".addSearchTerm").trigger("click");
                    if(itm.length>0)
                    {
                        e.preventDefault();
                        return false;
                    }
                }
            }
            else if (keyCode == 27) {
                if(!$(this).val())
                    findTermPanel.find(".removeSearchTerm").trigger("click");
                else
                    $(this).val("");
                e.preventDefault();
                return false;
            }
        });

        var filterPanel = $("#filterPanel").EnableMultiField({
            confirmOnRemove: false,
            linkText : "",
            linkClass : "addFilter",
            removeLinkText : "",
            removeLinkClass : "removeFilter",
            addEventCallback : function(newElem, clonnedFrom){
                showTipForActions();
                newElem.find("input.filterText").focus().keydown(function (e) {
                    var keyCode = e.keyCode || e.which;
                    if (keyCode == 13) {
                        $("#applyFilters").trigger("click");
                        return false;
                    }
                    else if (keyCode == 9) {
                        if(e.shiftKey)
                        {
                            if(newElem.prev().find("input:first").select().focus().length>0)
                            {
                                e.preventDefault();
                                return false;
                            }
                        }
                        else
                        {
                            var itm = newElem.find(".addFilter").trigger("click");
                            if(itm.length>0)
                            {
                                e.preventDefault();
                                return false;
                            }
                        }
                    }
                    else if (keyCode == 27) {
                        if(!$(this).val())
                            newElem.find(".removeFilter").trigger("click");
                        else
                            $(this).val("");
                        e.preventDefault();
                        return false;
                    }
                });
                if(clonnedFrom.find(".removeFilter").length==0)
                {
                    var removeBase = $('<a style="margin-left:5px;" href="#" class="removeFilter vtip" title="Remove this filter"></a>');
                    clonnedFrom.find(".filterText").after(removeBase);
                    removeBase.click(function(){
                        clonnedFrom.hide().find("input.filterText").val("");
                        filterRemoved(clonnedFrom.attr("uniqueid"));
                        serverLogging.resizeLogPanel();
                        return false;
                    });
                }
                serverLogging.resizeLogPanel();
            },
            removeEventCallback : function(prev, self, uid){
                if(filterPanel.parent().find(".filterOption").length==1)
                {
                    filterPanel.show().find(".removeFilter").remove();
                }
                setTimeout(function(){
                    $("#vtip").hide();
                }, 100);
                prev.find("input.filterText").focus();
                filterRemoved(uid);
                serverLogging.resizeLogPanel();
            }
        });

        filterPanel.find("input.filterText").focus().keydown(function (e) {
            var keyCode = e.keyCode || e.which;
            if (keyCode == 13) {
                $("#applyFilters").trigger("click");
                return false;
            }
            else if (keyCode == 9) {
                if(e.shiftKey)
                {
                    if(filterPanel.prev().find("input:first").select().focus().length>0)
                    {
                        e.preventDefault();
                        return false;
                    }
                }
                else
                {
                    var itm = filterPanel.find(".addFilter").trigger("click");
                    if(itm.length>0)
                    {
                        e.preventDefault();
                        return false;
                    }
                }
            }
            else if (keyCode == 27) {
                if(!$(this).val())
                    filterPanel.find(".removeFilter").trigger("click");
                else
                    $(this).val("");
                e.preventDefault();
                return false;
            }
        });

        var resetFindAndFilters = $("#resetFindAndFilters").click(function(){
            findAndFiltersPanel.find(".removeSearchTerm, .removeFilter").trigger("click");
            findAndFiltersPanel.find("#findPhrase, #filterTag").val("");
            $("#applyFilters").trigger("click");
            if($("#findAndFilters").is(":visible"))
            {
                findAndFilterOptions.trigger("click");
            }
            serverLogging.curColor=0;
            setTimeout(function(){
                serverLogging.redrawLogArea(false, true);
            }, 100);
            return false;
        });

        $("#applyFilters").click(function(){
            serverLogging.processFindAndFilters();
            return false;
        });

        showTipForActions();

        $("#filterTagColor").colorPicker().change(colorCodeChange);
        findAndFiltersPanel.find(".button").button();

        $("#excludeFilteredItems").change(function(){
            serverLogging.processFindAndFilters();
        });

        $("#excludeFilteredItemsOperation").change(function(){
            serverLogging.processFindAndFilters();
        });

        $("#copyLog").click(function(){
            copyCurrentView();
            return false;
        });

        $("#clearLog").click(function(){
            delete serverLogging.lastShownRange;
            serverLogging.curLogInfo.log_segment = [];
            serverLogging.logPanel.empty();
            if(serverLogging.hasFindItems)
                serverLogging.findItemsResult = [];

            if(serverLogging.isLogFiltered)
                serverLogging.filteredItems = [];
            serverLogging.bindMiniMap();
            serverLogging.redrawLogArea(false, true, true);
            serverLogging.seekNext();
            return false;
        });

        var helpPanel = $("#helpPanel").dialog({
            autoOpen: false,
            width: 600,
            modal: false,
            resizable: false,
            closeOnEscape: true,
            title : "Keyboard shortcuts : ",
            buttons: {
                "OK" : function(){
                    $(this).dialog("close");
                }
            }
        });

        $("#loggingHelp").button().click(function(){
            helpPanel.dialog("open");
            return false;
        });

        var logFileChange = $("#logFileChange").hide();

        $("#selectLogFile").click(function(){
            logFileChange.toggle("fast");
            return false;
        });

        $("#browseLogFile").button().unbind("click").click(function(){
            var curElem = $(this);
            curElem.crushFtpLocalFileBrowserPopup({
                type : curElem.attr("PickType") || 'dir',
                existingVal : $("#" + curElem.attr("rel")).val(),
                callback : function(selectedPath){
                    var trgr = $("#" + curElem.attr("rel")).val(selectedPath);
                    $("#changeLogFile").trigger("click");
                }
            });
            return false;
        });

        $("#changeLogFile").button().click(function(){
            var file = $("#logFilePath").val();
            serverLogging.changeLogFile(file);
            logFileChange.toggle("fast");
           return false;
        });

        var timeout;
        $("#nextResult, #prevResult").mousedown(function(){
            var that = $(this)
            timeout = setInterval(function(){
                that.trigger("click");
            }, 1000);
            return false;
        }).mouseup(function(){
            clearInterval(timeout);
            return false;
        });

        $("#nextResult, #prevResult").click(function(){
            var next = $(this).is("#nextResult");
            var that = $(this);
            function locateResult(){
                function seekResult(noIncrement) {
                    var showIndex;
                    var sameLine = false;
                    var resultLength = serverLogging.findItemsResult.length;
                    if(next)
                    {
                        if(noIncrement)
                            showIndex = serverLogging.curShownResult;
                        else
                            showIndex = serverLogging.curShownResult + 1;
                        if(resultLength>showIndex)
                        {
                            if(serverLogging.curShownResult != -1 && resultLength > serverLogging.curShownResult)
                            {
                                var prevLine = serverLogging.findItemsResult[serverLogging.curShownResult].lineNo;
                                serverLogging.curShownResult = showIndex;
                                if(prevLine == serverLogging.findItemsResult[showIndex].lineNo)
                                    sameLine = true;
                                if(showIndex == resultLength)
                                    sameLine = false;
                            }
                            else
                                serverLogging.curShownResult = showIndex;
                        }
                        else
                            showIndex-=1;
                    }
                    else
                    {
                        if(noIncrement)
                            showIndex = serverLogging.curShownResult;
                        else
                            showIndex = serverLogging.curShownResult - 1;
                        if(showIndex<0)showIndex=0;
                        if(resultLength>showIndex)
                        {
                            if(serverLogging.curShownResult != -1 && resultLength > serverLogging.curShownResult)
                            {
                                var prevLine = serverLogging.findItemsResult[serverLogging.curShownResult].lineNo;
                                serverLogging.curShownResult = showIndex;
                                if(prevLine == serverLogging.findItemsResult[showIndex].lineNo)
                                    sameLine = true;
                                if(showIndex==0)
                                    sameLine = false;
                            }
                            else
                                serverLogging.curShownResult = showIndex;
                        }
                        else
                            showIndex+=1;
                    }
                    if(typeof serverLogging.curShownResult != "undefined")
                    {
                        if(sameLine)
                        {
                            that.trigger("click");
                        }
                        else
                        {
                            var lineToShow = serverLogging.findItemsResult[serverLogging.curShownResult];
                            if(lineToShow)
                            {
                                var lineNo = parseInt(lineToShow.lineNo);
                                var sp = (lineNo-1) * 15;
                                sp = Math.ceil(sp - (serverLogging.logPanel.parent().height()/2) + 15);
                                serverLogging.nextPrevResultNavigation = lineToShow.lineNo - 1;
                                serverLogging.logPanel.parent().scrollTop(sp);
                                if(serverLogging.nextPrevResultNavigation || serverLogging.nextPrevResultNavigation == 0)
                                {
                                    serverLogging.logPanel.find("div[_index='"+serverLogging.nextPrevResultNavigation+"']").effect("highlight", {}, 1500);
                                    serverLogging.nextPrevResultNavigation = false;
                                }
                            }
                        }
                    }
                }
                if(serverLogging.hasFindItems && serverLogging.findItemsResult && serverLogging.findItemsResult.length>0 && serverLogging.findOpts)
                {
                    var noIncrement = false;
                    if(serverLogging.lastResultClickedItem)
                    {
                        var lastSelIndex = parseInt(serverLogging.lastResultClickedItem);
                        var result = serverLogging.findItemsResult;
                        var nearestIndex = -1;
                        var resultLength = result.length;
                        for(var i=0;i<resultLength;i++)
                        {
                            var curItem = result[i];
                            if(curItem.lineNo != lastSelIndex)
                            {
                                if(next)
                                {
                                    if(i>0)
                                        nearestIndex = i-1;
                                    else
                                        nearestIndex = i;
                                    if(lastSelIndex<curItem.lineNo)
                                        i = resultLength;
                                }
                                else
                                {
                                    if(lastSelIndex<curItem.lineNo)
                                    {
                                        nearestIndex = i;
                                        i = resultLength;
                                    }
                                    else
                                        nearestIndex = i;
                                }
                            }
                            else
                            {
                                nearestIndex = i;
                                i = resultLength;
                            }
                        }
                        if(nearestIndex!=-1)
                        {
                            serverLogging.curShownResult = nearestIndex;
                            noIncrement = true;
                        }
                        serverLogging.lastResultClickedItem = false;
                    }
                    if(typeof serverLogging.curShownResult != "undefined")
                        seekResult(noIncrement);
                    else
                    {
                        if(next)
                            serverLogging.curShownResult = -1;
                        else
                            serverLogging.curShownResult = serverLogging.findItemsResult.length;
                        seekResult();
                    }
                }
            }
            delay(function(){
                locateResult();
            }, 100);
            return false;
        });

        var logContextMenu = $("#logContextMenu");
        var markItemBtn = logContextMenu.find("a").click(function(){
            var el = logContextMenu.data("curElem");
            if($(this).parent().hasClass("markSelected"))
                serverLogging.markSelected($(this).data("markItem"));
            else if($(this).parent().hasClass("filterSelected"))
                serverLogging.filterBySelected($(this).data("markItem"));
            /*else if($(this).parent().hasClass("startSelection"))
                serverLogging.markStartLine(el);
            else if($(this).parent().hasClass("endSelection"))
                serverLogging.markEndLine(el);*/
            logContextMenu.hide();
            return false;
        }).hover(function(){
            $(this).parent().addClass("hover");
        },function(){
            $(this).parent().removeClass("hover");
        });
    },
    markSelected : function(phrase)
    {
        var findAndFilters = $("#findAndFilters");
        serverLogging.isFocusOnLogArea = false;
        if(findAndFilters.is(":visible"))
        {
            var findPanel = findAndFilters.find(".findPanel");
            if(findPanel.find("input:visible:last").val()=="")
            {
                findPanel.find("input:visible:last").val(phrase).focus().select();
            }
            else
            {
                findPanel.find(".addSearchTerm:first").trigger("click");
                findPanel.find("input:visible:last").val(phrase).focus().select();
            }
            setTimeout(function(){
                $("#applyFilters", findAndFilters).trigger("click");
            }, 300);
        }
        else
        {
            $("#findAndFilterOptions").trigger("click");
            setTimeout(function(){
                serverLogging.markSelected(phrase);
            }, 300);
        }
        serverLogging.hasSelText = false;
    },
    filterBySelected : function(phrase, flag)
    {
        var findAndFilters = $("#findAndFilters");
        if(findAndFilters.is(":visible"))
        {
            var filterPanel = findAndFilters.find(".filterPanel");
            if(filterPanel.find("input:visible:last").val()=="")
            {
                filterPanel.find("input:visible:last").val(phrase);
            }
            else
            {
                filterPanel.find(".addFilter:first").trigger("click");
                filterPanel.find("input:visible:last").val(phrase);
            }
            if(flag)
            {
                findAndFilters.find("#excludeFilteredItems").val("1");
            }
            else
                findAndFilters.find("#excludeFilteredItems").val("0");
            setTimeout(function(){
                $("#applyFilters", findAndFilters).trigger("click");
            }, 300);
        }
        else
        {
            $("#findAndFilterOptions").trigger("click");
            setTimeout(function(){
                serverLogging.filterBySelected(phrase, flag);
            }, 300);
        }
        serverLogging.hasSelText = false;
    },
    minimapPositionChanged : function(handleMiniMap)
    {
        handleMiniMap = handleMiniMap || serverLogging.miniMap.find(".positionMarker");
        serverLogging.dontScroll = true;
        var parentHeight = serverLogging.miniMap.innerHeight() - handleMiniMap.outerHeight();
        var top = handleMiniMap.offsetRelativeTo(serverLogging.miniMap).top;
        var perc = (top * 100) / parentHeight;
        var _perc = perc;
        if(_perc>=99)_perc=100;
        var _height = serverLogging.logPanel.height() - serverLogging.logPanel.parent().height();
        var _scrollPos = (_height * _perc) / 100;
        serverLogging.logPanel.parent().scrollTop(_scrollPos);
    },
    resizeSlider : function(handle, perc)
    {
        var percToMove = false;
        var sliderWidth, newLeft;
        handle = handle || $(".handle", serverLogging.slider);
        if(perc || perc === 0)
        {
            percToMove = perc;
            sliderWidth = serverLogging.slider.innerWidth();
        }
        else
        {
            var winWidth = $(window).width();
            var varWidth = 145;
            if(winWidth<1124)winWidth = 1124;
            sliderWidth = winWidth - varWidth;
            serverLogging.slider.width(sliderWidth);
            serverLogging.slider.parent().width(sliderWidth+135);
            if(serverLogging.curLogInfo && typeof serverLogging.curLogInfo.sliderPerc!="undefined")
                percToMove = serverLogging.curLogInfo.sliderPerc;
        }
        if(percToMove>100)percToMove=100;
        if(percToMove<0)percToMove=0;
        if((percToMove || percToMove===0) && percToMove != 100)
        {
            var calWidth = sliderWidth - handle.outerWidth();
            newLeft = (calWidth * percToMove) / 100;
            if(newLeft + serverLogging.slider.offset().left + serverLogging.slider.scrollLeft() > sliderWidth)
                newLeft = sliderWidth - serverLogging.slider.offset().left + serverLogging.slider.scrollLeft();
        }
        else
        {
            newLeft = serverLogging.slider.innerWidth() - handle.width();
        }
        if(newLeft<=0)
            newLeft = 0;
        handle.css("left", newLeft);
        var leftMove = serverLogging.slider.find(".moveSliderCustom.prev").css("left", newLeft + 24);
        var rightMove = serverLogging.slider.find(".moveSliderCustom.next").css("left", newLeft + 145);
        if(percToMove===0)
            leftMove.hide();
        else
            leftMove.show();
        if(percToMove)
        {
            if(percToMove===100)
                rightMove.hide();
            else if(percToMove<100)
                rightMove.show();
        }
    },
    resizeLogPanel : function()
    {
        var winHeight = $(window).height();
        var filterPanelHeight = $("#findAndFilters:visible").height() || 0;
        if(filterPanelHeight>0)
            filterPanelHeight += 15;
        var sliderPanelHeight = $("#slider-wrapper:visible").height();
        var arbHeight = 115;
        var actHeight = winHeight - filterPanelHeight - sliderPanelHeight - arbHeight;
        if(actHeight<300)
            actHeight = 300;
        serverLogging.miniMap.height(actHeight - 31);
        serverLogging.logPanel.parent().height(actHeight).width($(window).width()-50);
        serverLogging.logPanel.trigger("scroll");
        serverLogging.bindMiniMap();
    },
    performSliderDrag : function()
    {
        serverLogging.lastLinesCount = 0;
        var handle = serverLogging.slider.find(".handle");
        var parentWidth = serverLogging.slider.innerWidth() - handle.outerWidth();
        var left = handle.offsetRelativeTo(serverLogging.slider).left;
        var perc = (left * 100) / parentWidth;
        var _perc = perc.toFixed(1);
        if(perc.toFixed(2) * 100<10)
            _perc = 0;
        if(_perc>99.8)
            _perc = 100;
        serverLogging.sliderMoving(_perc, left);
    },
    sliderMoving : function(perc, left)
    {
        if(!serverLogging.curLogInfo)serverLogging.curLogInfo={};
        var startPoint, endPoint;
        if($(window).width()<1160 && perc == "0.1")
            perc = 0;
        if(perc == 100)
        {
            startPoint = Math.round((serverLogging.curLogInfo.log_max - serverLogging.defaultBytes));
            endPoint = Math.round(serverLogging.curLogInfo.log_max);
            serverLogging.slider.find(".moveSliderCustom.next").hide();
        }
        else
        {
            serverLogging.slider.find(".moveSliderCustom.next").show();
            startPoint = Math.round((serverLogging.curLogInfo.log_max * perc) / 100);
            endPoint = Math.round(startPoint + serverLogging.defaultBytes);
            if(endPoint>serverLogging.curLogInfo.log_max) endPoint = serverLogging.curLogInfo.log_max;
            if(perc==0)
                serverLogging.slider.find(".moveSliderCustom.prev").hide();
            else
                serverLogging.slider.find(".moveSliderCustom.prev").show();
        }
        var leftTrim = 25;
        if(startPoint<0) startPoint = 0;
        serverLogging.slider.find(".valSelectionRange").text(crushFTP.methods.formatBytes(startPoint) + " - " + crushFTP.methods.formatBytes(endPoint));
        serverLogging.slider.find(".moveSliderCustom.prev").css("left", left + 24);
        serverLogging.slider.find(".moveSliderCustom.next").css("left", left + 145);
        serverLogging.curLogInfo.sliderStartPoint = startPoint;
        serverLogging.curLogInfo.sliderEndPoint = endPoint;
        serverLogging.curLogInfo.sliderPerc = perc;
    },
    showLogSegmentBySelection : function()
    {
        if(typeof serverLogging.curLogInfo.sliderStartPoint == "undefined"){
            delete serverLogging.showingSliderRangeData;
            serverLogging.reRenderLog = true;
            serverLogging.realTimeIndicator.show();
            return;
        }
        serverLogging.showingSliderRangeData = true;
        crushFTP.UI.showLoadingIndicator({});
        delete serverLogging.lastShownRange;
        if(serverLogging.curLogInfo && typeof serverLogging.curLogInfo.log_end != "undefined")
            serverLogging.curLogInfo.log_end = serverLogging.curLogInfo.sliderStartPoint;
        serverLogging.getLogData(serverLogging.curLogInfo.sliderStartPoint, serverLogging.defaultBytes, function(noRender)
        {
            crushFTP.UI.hideLoadingIndicator({});
            var scrollToTop = true;
            if(serverLogging.curLogInfo.sliderPerc == 100)
            {
                delete serverLogging.showingSliderRangeData;
                serverLogging.reRenderLog = true;
                serverLogging.realTimeIndicator.show();
                var handleLeft = serverLogging.slider.width() - serverLogging.slider.find(".handle").width() - 5;
                serverLogging.slider.find(".moveSliderCustom.next").hide();
                scrollToTop = false;
            }
            else
            {
                serverLogging.realTimeIndicator.hide();
                serverLogging.slider.find(".moveSliderCustom.next").show();
            }
            if(!noRender)
            {
                serverLogging.logPanel.empty();
                serverLogging.redrawLogArea(scrollToTop);
            }
        });
    },
    bindMiniMap : function(elem)
    {
        serverLogging.miniMap.addClass("pointer");
        $("#resultActions").hide();
        if((!serverLogging.hasFindItems && typeof serverLogging.lastRangeSelected == "undefined") || (!serverLogging.curLogInfo))
        {
            delete serverLogging.curShownResult;
            return;
        }

        serverLogging.miniMap.find("span.marker").remove();
        var log = serverLogging.curLogInfo.log_segment;
        var h = serverLogging.logPanel.height();
        var h2 = serverLogging.miniMap.height();
        if(typeof serverLogging.lastRangeSelected != "undefined")
        {
            var lineNo = serverLogging.lastRangeSelected;
            var childPos = (lineNo * 15);
            var t = childPos;
            var markerTop = (h2 * t) / h;
            markerTop = Math.round(markerTop);
            var title = lineNo + " : " + log[lineNo-1];
            title = crushFTP.methods.htmlEncode(title.replace(/'/g, "&apos;").replace(/"/g, "&quot;"));
            var marker = $("<span _index='"+i+"' class='marker vtip' lineNo='"+lineNo+"' style='top:"+markerTop+"px;' title='Selection Starts: "+crushFTP.methods.htmlEncode(title)+"'></span>");
            marker.addClass("selection-marker").click(function(){
                var lineNo = parseInt($(this).attr("lineNo"));
                var sp = (lineNo - 1) * 15;
                sp = Math.ceil(sp - (serverLogging.logPanel.parent().height()/2) + 15);
                serverLogging.logPanel.parent().scrollTop(sp);
                return false;
            });
            serverLogging.miniMap.append(marker);
            vtip(serverLogging.miniMap);
        }

        var result = serverLogging.findItemsResult;
        if(!result || result.length==0 || !serverLogging.curLogInfo || !serverLogging.curLogInfo.log_segment)
        {
            delete serverLogging.curShownResult;
            return false;
        }

        $("#resultActions").show();
        if(serverLogging.isLogFiltered)
        {
            log = serverLogging.filteredItems;
        }
        var resultLength = result.length;
        var jump = Math.round(resultLength / 500);
        if(jump==0)jump=1;
        for(var i=0;i<resultLength;i = i + jump)
        {
            var childPos = (result[i].lineNo * 15);
            var t = childPos;
            var markerTop = (h2 * t) / h;
            markerTop = Math.round(markerTop);
            if(log.length>=result[i].lineNo)
            {
                var lineNo = result[i].lineNo;
                var title = lineNo + " : " + log[lineNo-1];
                title = crushFTP.methods.htmlEncode(title.replace(/'/g, "&apos;").replace(/"/g, "&quot;"));
                var marker = $("<span _index='"+i+"' class='marker vtip' lineNo='"+lineNo+"' style='top:"+markerTop+"px;' title='"+crushFTP.methods.htmlEncode(title)+"'></span>");
                marker.addClass(result[i].uid).click(function(){
                    var lineNo = parseInt($(this).attr("lineNo"));
                    var sp = (lineNo - 1) * 15;
                    serverLogging.nextPrevResultNavigation = lineNo - 1;
                    sp = Math.ceil(sp - (serverLogging.logPanel.parent().height()/2) + 15);
                    serverLogging.logPanel.parent().scrollTop(sp);
                    serverLogging.curShownResult = parseInt($(this).attr("_index"));
                    return false;
                });
                serverLogging.miniMap.append(marker);
            }
        }
        serverLogging.miniMap.removeClass("pointer");
        vtip(serverLogging.miniMap);
    },
    bindPortionSlider : function(){
        if(serverLogging.curLogInfo && serverLogging.curLogInfo.log_max)
        {
            serverLogging.slider.parent().find(".maxVal").text(crushFTP.methods.formatBytes(serverLogging.curLogInfo.log_max));
            var maxPropSize = Math.ceil(serverLogging.curLogInfo.log_max / serverLogging.defaultBytes) * serverLogging.defaultBytes;
            var handlePerc = (serverLogging.defaultBytes * 100) / maxPropSize;
        }
    },
    getLogData : function(start, len, callback, isPolling)
    {
        if(serverLogging.fetchRequestInProgress)
        {
            setTimeout(function(){
                serverLogging.getLogData(start, len, callback, isPolling);
            }, 1000);
            return;
        }
        serverLogging.fetchRequestInProgress = true;
        adminPanel.dataRepo.getSeverLogSegment(start, len, function(data){
            serverLogging.fetchRequestInProgress = false;
            if(data && $(data).find("log_segment"))
            {
                var logSegment = $(data).find("log_segment").text();
                logSegment = unescape(logSegment);
                if ($.browser.msie) {
                    logSegment = logSegment.split("\n\n");
                    if(logSegment.length==1 && logSegment[0].indexOf("\n")>=0)
                        logSegment = logSegment[0].split("\n");
                }
                else
                    logSegment = logSegment.split("\n");
                logSegment = logSegment.clean("");
                var log_start = $(data).find("log_start").text();
                var log_end = $(data).find("log_end").text();
                if(typeof log_start == "undefined")return;
                var noRender = log_end == "0";
                var l_end = parseInt(log_end);
                if(serverLogging.curLogInfo && typeof serverLogging.curLogInfo.log_end != "undefined" && serverLogging.curLogInfo.log_end > l_end)
                    log_end = serverLogging.curLogInfo.log_end + "";
                var log_max = $(data).find("log_max").text();
                var l_max = parseInt(log_max);
                if(serverLogging.curLogInfo && typeof serverLogging.curLogInfo.log_max != "undefined" && serverLogging.curLogInfo.log_max > l_max)
                    log_max = serverLogging.curLogInfo.log_max + "";
                if(log_end != "")
                {
                    var logData = {
                        log_end : log_end,
                        log_max : log_max,
                        log_start : log_start,
                        log_start_date : $(data).find("log_start_date").text(),
                        log_end_date : $(data).find("log_end_date").text(),
                        log_segment : logSegment
                    };
                    if(!serverLogging.curLogInfo)serverLogging.curLogInfo = {};
                    serverLogging.curLogInfo.log_end = logData.log_end;
                    serverLogging.curLogInfo.log_max = logData.log_max;
                    serverLogging.curLogInfo.log_start = logData.log_start;
                    if(serverLogging.showingSliderRangeData)
                    {
                        if(!isPolling)
                            serverLogging.curLogInfo.log_segment = logData.log_segment;
                    }
                    else
                    {
                        if(serverLogging.curLogInfo.log_segment)
                        {
                            serverLogging.curLogInfo.log_segment.push.apply(serverLogging.curLogInfo.log_segment, logData.log_segment);
                        }
                        else
                        {
                            serverLogging.curLogInfo.log_segment = logData.log_segment;
                        }
                    }
                    if(logData.log_start_date)
                    {
                        if(serverLogging.curLogInfo.log_start_date)
                        {
                            if(serverLogging.showingSliderRangeData)
                                serverLogging.curLogInfo.log_start_date = logData.log_start_date;
                        }
                        else
                            serverLogging.curLogInfo.log_start_date = logData.log_start_date;
                    }
                    if(logData.log_end_date)
                    {
                        serverLogging.curLogInfo.log_end_date = logData.log_end_date;
                    }
                    serverLogging.bindPortionSlider();
                }
                else
                {
                    if(!serverLogging.curLogInfo)serverLogging.curLogInfo = {};
                    serverLogging.curLogInfo.log_end = 0;
                    serverLogging.curLogInfo.log_max = 0;
                    serverLogging.curLogInfo.log_start = 0;
                }
                if(callback)
                    callback(noRender);
            }
            else
            {
                callback(noRender, true)
            }
            if(serverLogging.curLogFile)
                $("#logFileLoaded").text(serverLogging.curLogFile);
            else
                $("#logFileLoaded").text("Server Log");
        }, serverLogging.curLogFile);
    },
    seekNext : function(callback)
    {
        var curLastIndex = serverLogging.curLogInfo.log_end;
        if(serverLogging.showingSliderRangeData)
        {
            serverLogging.realTimeIndicator.hide();
            serverLogging.getLogData(curLastIndex, 1, function(noRender)
            {
                if(callback)
                    callback();
            }, true);
        }
        else
        {
            serverLogging.realTimeIndicator.show();
            serverLogging.getLogData(curLastIndex, serverLogging.defaultBytes, function(noRender)
            {
                if(!noRender)
                {
                    serverLogging.redrawLogArea();
                }
                if(callback)
                    callback();
            });
        }
    },
    redrawLogArea : function(moveToTop, justRedraw, clear)
    {
        serverLogging.lastLinesCount = serverLogging.lastLinesCount || 0;
        if(!serverLogging.curLogInfo)
        {
            serverLogging.curLogInfo = {};
            serverLogging.curLogInfo.log_end = 0;
            serverLogging.curLogInfo.log_max = 0;
            serverLogging.curLogInfo.log_start = 0;
            serverLogging.curLogInfo.log_segment = [];
        }

        var log = serverLogging.curLogInfo.log_segment;
        if(serverLogging.isLogFiltered)
        {
            serverLogging.filterLog($("#excludeFilteredItems").val() == "0", true);
            log = serverLogging.filteredItems;
        }
        if((log && log.length>0) || clear)
        {
            if(serverLogging.showingSliderRangeData || serverLogging.reRenderLog)
            {
                serverLogging.logPanel.empty();
                delete serverLogging.reRenderLog;
            }
            var lines = log.length;
            var divHeight = (lines * 15) + 15;
            var stillAvl = serverLogging.maxHeightAllowed - divHeight;
            var parentElem = serverLogging.logPanel.parent();
            var parentHeight = parentElem.height();
            if(parentHeight>divHeight)
                divHeight = parentHeight;
            serverLogging.logPanel.height(divHeight);
            if(serverLogging.scrollWithActivity.is(":checked"))
            {
                if(moveToTop)
                {
                    parentElem.scrollTop(0);
                }
                else{
                    if(lines>serverLogging.lastLinesCount)
                        parentElem.scrollTop(serverLogging.logPanel.innerHeight());
                }
            }
            serverLogging.lastLinesCount = lines;
            if(!justRedraw)
            {
                parentElem.scroll();
                if(serverLogging.hasFindItems || serverLogging.isLogFiltered)
                    serverLogging.processFindAndFilters(false, true);
            }
            if(serverLogging.curLogInfo.log_start_date && serverLogging.curLogInfo.log_end_date)
            {
                $("#dateRangeForLog").html("<em>" + serverLogging.curLogInfo.log_start_date + "</em> to <em>" + serverLogging.curLogInfo.log_end_date + "</em>");
            }
            else
                $("#dateRangeForLog").html("");
        }
        else
        {
            serverLogging.logPanel.empty();
            if(serverLogging.isLogFiltered)
                crushFTP.UI.growl("Nothing to show", "No matches found for specified filter", false, 5000);
            /*else
                crushFTP.UI.growl("Nothing to show", "There was a problem while fetching log information from server. Wait few moments..", false, 2000);*/
        }
    },
    renderLogDataByScrollPosition : function(pos)
    {
        if(!serverLogging.curLogInfo || !serverLogging.curLogInfo.log_segment)return;
        var obj = serverLogging.curLogInfo.log_segment;
        if(serverLogging.isLogFiltered)
        {
            obj = serverLogging.filteredItems;
            delete serverLogging.lastShownRange;
        }
        var logPanel = serverLogging.logPanel;
        pos = Math.ceil(pos / 15);
        var minLength = pos - 250;
        if(minLength<0)minLength=0;

        var maxLength = pos + 250;
        if(maxLength>obj.length) maxLength=obj.length;
        if(typeof serverLogging.lastShownRange !="undefined" && serverLogging.lastShownRange.length>0)
        {
            var lastMin = serverLogging.lastShownRange[0];
            var lastMax = serverLogging.lastShownRange[1];
            if(minLength>=lastMin && minLength<lastMax)
            {
                for(var i=lastMin;i<minLength;i++)
                {
                    logPanel.find("div[_index="+i+"]").remove();
                }
                for(var i=lastMax;i<maxLength;i++)
                {
                    var top = i * 15;
                    if(logPanel.find("div[_index="+i+"]").length==0)
                    {
                        var lineNo = i+1;
                        /* added by carlos */
                        var originalLine = i;
                        var lineText = crushFTP.methods.encode(obj[i]);
                        if( serverLogging.selectedTextLine !== -1 && serverLogging.selectedTextLineEnd !== -1 && serverLogging.isLogFiltered != true )
                        {
                            var lineText = crushFTP.methods.encode(obj[i]);
                            var lineasSeparadas = serverLogging.selectedText.split('\n')
                            var lineasTotales = lineasSeparadas.length;
                            if(serverLogging.selectedTextLine > serverLogging.selectedTextLineEnd){
                                var tmp = serverLogging.selectedTextLineEnd, tmp2 = serverLogging.selectedTextLine;
                                serverLogging.selectedTextLine = tmp;
                                serverLogging.selectedTextLineEnd = tmp2;
                            }
                            if( lineasTotales > 0 )
                            {
                                for(var q = 0; q <= lineasTotales-1; q++){
                                    var selectedLine = (parseInt(serverLogging.selectedTextLine) + q);
                                    if( serverLogging.selectedTextLine !== -1 && selectedLine == originalLine ){
                                        var matchedText = jQuery.trim(lineasSeparadas[q]);
                                        lineText = crushFTP.methods.encode(obj[i]).replace(matchedText, '<span class="textoSel" style="background-color: #3399ff; color: #FFF;">'+matchedText+'</span>');
                                    }
                                }
                            }
                        }
                        var lineNoMark = lineNo == serverLogging.lastRangeSelected ? "set-marker" : "";
                        logPanel.append("<div class='itm logData' _index='"+i+"' style='top:"+top+"px;'><span class='lineNo "+lineNoMark+"'>" + lineNo + "</span> "+lineText+"</div>");
                    }
                }
            }
            else if(maxLength<=lastMax && maxLength>lastMin)
            {
                for(var i=maxLength;i<lastMax;i++)
                {
                    logPanel.find("div[_index="+i+"]").remove();
                }
                for(var i=lastMin;i>=minLength;i--)
                {
                    var top = i * 15;
                    if(logPanel.find("div[_index="+i+"]").length==0)
                    {
                        var lineNo = i+1;
                        /* added by carlos */
                        var originalLine = i;
                        var lineText = crushFTP.methods.encode(obj[i]);
                        if( serverLogging.selectedTextLine !== -1 && serverLogging.selectedTextLineEnd !== -1 && serverLogging.isLogFiltered != true )
                        {
                            var lineText = crushFTP.methods.encode(obj[i]);
                            var lineasSeparadas = serverLogging.selectedText.split('\n')
                            var lineasTotales = lineasSeparadas.length;
                            if(serverLogging.selectedTextLine > serverLogging.selectedTextLineEnd){
                                var tmp = serverLogging.selectedTextLineEnd, tmp2 = serverLogging.selectedTextLine;
                                serverLogging.selectedTextLine = tmp;
                                serverLogging.selectedTextLineEnd = tmp2;
                            }
                            if( lineasTotales > 0 )
                            {
                                for(var q = 0; q <= lineasTotales-1; q++){
                                    var selectedLine = (parseInt(serverLogging.selectedTextLine) + q);
                                    if( serverLogging.selectedTextLine !== -1 && selectedLine == originalLine ){
                                        var matchedText = jQuery.trim(lineasSeparadas[q]);
                                        lineText = crushFTP.methods.encode(obj[i]).replace(matchedText, '<span class="textoSel" style="background-color: #3399ff; color: #FFF;">'+matchedText+'</span>');
                                    }
                                }
                            }
                        }
                        var lineNoMark = lineNo == serverLogging.lastRangeSelected ? "set-marker" : "";
                        logPanel.append("<div class='itm logData' _index='"+i+"' style='top:"+top+"px;'><span class='lineNo "+lineNoMark+"'>" + lineNo + "</span> "+lineText+"</div>");
                    }
                }
            }
            else
            {
                logPanel.find("div").remove();
                for(var i=minLength;i<maxLength;i++)
                {
                    var top = i * 15;
                    if(logPanel.find("div[_index="+i+"]").length==0)
                    {
                        var lineNo = i+1;
                        /* added by carlos */
                        var originalLine = i;
                        var lineText = crushFTP.methods.encode(obj[i]);
                        if( serverLogging.selectedTextLine !== -1 && serverLogging.selectedTextLineEnd !== -1 && serverLogging.isLogFiltered != true )
                        {
                            var lineText = crushFTP.methods.encode(obj[i]);
                            var lineasSeparadas = serverLogging.selectedText.split('\n')
                            var lineasTotales = lineasSeparadas.length;
                            if(serverLogging.selectedTextLine > serverLogging.selectedTextLineEnd){
                                var tmp = serverLogging.selectedTextLineEnd, tmp2 = serverLogging.selectedTextLine;
                                serverLogging.selectedTextLine = tmp;
                                serverLogging.selectedTextLineEnd = tmp2;
                            }
                            if( lineasTotales > 0 )
                            {
                                for(var q = 0; q <= lineasTotales-1; q++){
                                    var selectedLine = (parseInt(serverLogging.selectedTextLine) + q);
                                    if( serverLogging.selectedTextLine !== -1 && selectedLine == originalLine ){
                                        var matchedText = jQuery.trim(lineasSeparadas[q]);
                                        lineText = crushFTP.methods.encode(obj[i]).replace(matchedText, '<span class="textoSel" style="background-color: #3399ff; color: #FFF;">'+matchedText+'</span>');
                                    }
                                }
                            }
                        }
                        var lineNoMark = lineNo == serverLogging.lastRangeSelected ? "set-marker" : "";
                        logPanel.append("<div class='itm logData' _index='"+i+"' style='top:"+top+"px;'><span class='lineNo "+lineNoMark+"'>" + lineNo + "</span> "+lineText+"</div>");
                    }
                }
            }
            serverLogging.lastShownRange = [minLength, maxLength];
        }
        else
        {
            serverLogging.lastShownRange = [minLength, maxLength];
            logPanel.find("div").remove();
            for(var i=minLength;i<maxLength;i++)
            {
                var top = i * 15;
                {
                    var lineNo = i+1;
                    /* added by carlos */
					var originalLine = i;
					var lineText = crushFTP.methods.encode(obj[i]);
					if( serverLogging.selectedTextLine !== -1 && serverLogging.selectedTextLineEnd !== -1 && serverLogging.isLogFiltered != true )
					{
						var lineText = crushFTP.methods.encode(obj[i]);
						var lineasSeparadas = serverLogging.selectedText.split('\n')
						var lineasTotales = lineasSeparadas.length;
						if(serverLogging.selectedTextLine > serverLogging.selectedTextLineEnd){
							var tmp = serverLogging.selectedTextLineEnd, tmp2 = serverLogging.selectedTextLine;
							serverLogging.selectedTextLine = tmp;
							serverLogging.selectedTextLineEnd = tmp2;
						}
						if( lineasTotales > 0 )
						{
							for(var q = 0; q <= lineasTotales-1; q++){
								var selectedLine = (parseInt(serverLogging.selectedTextLine) + q);
								if( serverLogging.selectedTextLine !== -1 && selectedLine == originalLine ){
									var matchedText = jQuery.trim(lineasSeparadas[q]);
									lineText = crushFTP.methods.encode(obj[i]).replace(matchedText, '<span class="textoSel" style="background-color: #3399ff; color: #FFF;">'+matchedText+'</span>');
								}
							}
						}
					}
                    var lineNoMark = lineNo == serverLogging.lastRangeSelected ? "set-marker" : "";
					logPanel.append("<div class='itm logData' _index='"+i+"' style='top:"+top+"px;'><span class='lineNo "+lineNoMark+"'>" + lineNo + "</span> "+lineText+"</div>");
                }
            }
        }
        var maxWidthOfLogItem = 0;
        logPanel.find("div").each(function(){
            if($(this).width()>maxWidthOfLogItem)
                maxWidthOfLogItem = $(this).width();
        });
        if(maxWidthOfLogItem)
        {
            if(logPanel.width()<=maxWidthOfLogItem)
                logPanel.width(maxWidthOfLogItem);
            else
                logPanel.css("width", "auto");
        }
        logPanel.find("div").css("min-width", logPanel.width() - 10 + "px");
        if(serverLogging.nextPrevResultNavigation || serverLogging.nextPrevResultNavigation == 0)
        {
            serverLogging.logPanel.find("div[_index='"+serverLogging.nextPrevResultNavigation+"']").effect("highlight", {}, 1500);
            serverLogging.nextPrevResultNavigation = false;
        }
        setTimeout(function(){
            serverLogging.processLogRowEvents();
            if(typeof serverLogging.lastRangeSelected != "undefined"){
                serverLogging.bindMiniMap();
            }
        }, 100);
    },
    markStartLine : function(elem)
    {
        serverLogging.lastRangeSelected = parseInt($(elem).attr("_index"));
        if(serverLogging.hasFindItems && serverLogging.findItemsResult && serverLogging.findItemsResult.length>0 && serverLogging.findOpts)
            serverLogging.lastResultClickedItem = parseInt($(elem).attr("_index"));
        else
            serverLogging.lastResultClickedItem = false;
        serverLogging.logPanel.find(".set-marker").removeClass('set-marker');
        $(elem).find(".lineNo").addClass('set-marker');
        serverLogging.bindMiniMap();
    },
    markEndLine : function(elem)
    {
        var curIndex = parseInt($(elem).attr("_index"));
        var totalLines = (curIndex>serverLogging.lastRangeSelected) ? curIndex-serverLogging.lastRangeSelected : serverLogging.lastRangeSelected - curIndex;
        totalLines+=1;
        var copyDiv = $("#copyReady").html("Total " + totalLines + " lines ready to copy. <a href='#'>Click here to copy</a> | <a href='#' class='cancel'>Cancel</a>").show();
        copyDiv.effect("highlight", {color : "orange"}, 3000);
        var obj = serverLogging.curLogInfo.log_segment;
        copyDiv.find("a").click(function(){
            if($(this).hasClass("cancel"))
            {
                copyDiv.hide();
                delete serverLogging.lastRangeSelected;
                serverLogging.bindMiniMap();
            }
            else
            {
                var min, max;
                if(curIndex>serverLogging.lastRangeSelected)
                {
                    min = serverLogging.lastRangeSelected;
                    max = curIndex;
                }
                else
                {
                    min = curIndex;
                    max = serverLogging.lastRangeSelected;
                }
                var copyItems = [];
                serverLogging.filterOptionItems = serverLogging.filterOptionItems || [];
                if(serverLogging.filterOptionItems.length>0 && serverLogging.curLogInfo && serverLogging.curLogInfo.log_segment && serverLogging.filteredItems)
                {
                    obj = serverLogging.filteredItems;
                }
                for(var i=min;i<=max;i++)
                {
                    copyItems.push(obj[i]);
                }
                if(copyItems.length>0)
                {
                    serverLogging.copyItemDialog.empty().append("<textarea style='width:99%;height:550px;'>"+copyItems.join("\n")+"</textarea>");
                    serverLogging.copyItemDialog.dialog("open");
                }
                if (window.getSelection) // Modern Browsers
                {
                    var selection = window.getSelection();
                    if (selection.removeAllRanges) {
                        selection.removeAllRanges();
                    }
                }
                if (document.getSelection) // IE
                {
                    var selection = document.getSelection();
                    if (selection.removeAllRanges) {
                        selection.removeAllRanges();
                    }
                }
            }
            return false;
        });
    },
    processLogRowEvents  :function()
    {
        var parentElem = serverLogging.logPanel.parent();
        serverLogging.logPanel.find("div").unbind().click(function(e){
			/* added by carlos */
            if( serverLogging.isLogFiltered != true ){
                $('.textoSel').each(function(){
                    var contenido = $(this).parent().html();
                    var destacadoText = $(this).html();
                    if( destacadoText && destacadoText.length > 0) {
                        contenido = contenido.replace('<span class="textoSel" style="background-color: #3399ff; color: #FFF;">'+destacadoText+'</span>', destacadoText);
                        $(this).parent().html(contenido);
                        serverLogging.selectedText = [];
                        serverLogging.selectedTextLine = -1;
                        serverLogging.selectedTextLineEnd = -1;
                    }
                });
            }
            if (e.shiftKey) {
                if(typeof serverLogging.lastRangeSelected != "undefined")
                {
                    serverLogging.markEndLine($(this));
                }
            }
            else
            {
                if(e.button != 2 && !e.ctrlKey)
                    serverLogging.markStartLine($(this));
            }
        }).bind("mousedown", function(evt){
            serverLogging.selectingText = true;
            if( serverLogging.isLogFiltered != true ){
                serverLogging.selectedTextLine = $(this).attr('_index');
            }
        }).bind("mouseup", function(evt){
			/* added by carlos */
            serverLogging.selectingText = false;
            if( serverLogging.isLogFiltered != true ){
                $('.textoSel').each(function(){
                    var contenido = $(this).parent().html();
                    var destacadoText = $(this).html();
                    if( destacadoText && destacadoText.length > 0) {
                        contenido = contenido.replace('<span class="textoSel" style="background-color: #3399ff; color: #FFF;">'+destacadoText+'</span>', destacadoText);
                        $(this).parent().html(contenido);
                        serverLogging.selectedText = [];
                        serverLogging.selectedTextLine = -1;
                        serverLogging.selectedTextLineEnd = -1;
                    }
                });
            }
            var selText = crushFTP.methods.getHTMLRangeSelection();
            var logContextMenu = $("#logContextMenu");
            logContextMenu.data("curElem", $(this));
            serverLogging.hasSelText = false;
            if(selText && selText.length>0)
            {
				/* added by carlos .replace(/(\r\n|\n|\r)/gm, ""); */
                if( serverLogging.isLogFiltered != true ){
                    serverLogging.selectedText = jQuery.trim(selText.replace(/<span class="lineNo">\d+<\/span>/ig, '').replace(/(<([^>]+)>)/ig,""));
                    serverLogging.selectedTextLineEnd = $(this).attr('_index');
                }
                serverLogging.hasSelText = true;
                var pnl = $("<div>");
                pnl.append(selText);
                if(pnl.find("span.lineNo").length>1)
                {
                    logContextMenu.hide();
                }
                else
                {
                    // single line/word selected show popup
                    var x = evt.clientX;
                    var y = evt.clientY;
                    x = x - 10;
                    if(x + $(logContextMenu).width() > $(document).width())
                    {
                        x = $(document).width() - $(logContextMenu).width() - 10;
                    }
                    logContextMenu.show().css("top", y+5).css("left", x);
                    logContextMenu.find(".endSelection").addClass("disabled");
                    logContextMenu.find(".markSelected, .filterSelected").show();
                    logContextMenu.find("a").data("markItem", pnl.text());

                    logContextMenu.unbind("focusout").focusout(function(){
                        delay(function(){
                            logContextMenu.hide();
                        }, 400);
                    });

                    logContextMenu.unbind("mouseleave").mouseleave(function(){
                        delay(function(){
                            logContextMenu.hide();
                        }, 400);
                    });
                }
            }
			/* added by carlos */
            else
            {
                if( serverLogging.isLogFiltered != true ){
                    serverLogging.selectedText = [];
                    serverLogging.selectedTextLine = -1;
                    serverLogging.selectedTextLineEnd = -1;
                }
            }
        });

        serverLogging.logPanel.removeHighlight();
        if(serverLogging.hasFindItems && serverLogging.findItemsResult && serverLogging.findItemsResult.length>0 && serverLogging.findOpts)
        {
            var opts = serverLogging.findOpts;
            for(var j=0;j<opts.length;j++)
            {
                var opt = opts[j];
                serverLogging.logPanel.highlightNoRegex(opt.phrase, opt.uid);
            }
        }

        serverLogging.logPanel.find("div").contextMenu({
                menu: "logContextMenu",
                inSpeed : 0,
                outSpeed : 0,
                applyClass : "ui-state-highlight"
            },
            function(action, el, pos) {
                if(action=="startSelection")
                {
                    serverLogging.markStartLine(el);
                }
                else if(action=="endSelection")
                {
                    serverLogging.markEndLine(el);
                }
                else if(action=="markSelected")
                {
                    //$("#logContextMenu").find(".markSelected").find("a").trigger("click");
                }
                else if(action=="filterSelected")
                {
                    //$("#logContextMenu").find(".filterSelected").find("a").trigger("click");
                }
            }
        ).bind("onBeforeContextMenu", function(){
            if(typeof serverLogging.lastRangeSelected != "undefined")
            {
                $("#logContextMenu").find(".endSelection").removeClass("disabled");
            }
            else
                $("#logContextMenu").find(".endSelection").addClass("disabled");
            if(!serverLogging.hasSelText)
                $("#logContextMenu").find(".markSelected, .filterSelected").hide();
            else
                $("#logContextMenu").find(".markSelected, .filterSelected").show();
        });
    },
    processFindAndFilters : function(items, onExistingItems)
    {
        // console.log(items, onExistingItems);
        if(!onExistingItems)
            delete serverLogging.curShownResult;
        var findAndFiltersPanel = $("#findAndFilters");
        var filterProcessIndicator = findAndFiltersPanel.find("#filterProcessIndicator");
        filterProcessIndicator.show();
        function continueProcess()
        {
            serverLogging.filterOptionItems = [];
            serverLogging.filterItems = [];
            findAndFiltersPanel.find(".filterOption").each(function(){
                var option = {
                    "phrase" : $.trim($(this).find(".filterText").val()).toLowerCase(),
                    "uid" : $.trim($(this).attr("uniqueid"))
                };
                if(option.phrase && option.phrase.length>0)
                {
                    serverLogging.filterOptionItems.push(option);
                    serverLogging.filterItems.push(option.uid);
                }
            });
            serverLogging.filterLog($("#excludeFilteredItems").val() == "0");

            serverLogging.findItems = serverLogging.findItems || [];
            if(!items)
            {
                serverLogging.findItems = [];
                findAndFiltersPanel.find(".findOption").each(function(){
                    var option = {
                        "phrase" : $.trim($(this).find(".findPhrase").val()).toLowerCase(),
                        "color" : $.trim($(this).find(".colorPicker").val()),
                        "uid" : $.trim($(this).attr("uniqueid"))
                    };
                    if(option.phrase && option.phrase.length>0)
                        serverLogging.findItems.push(option);
                });
            }

            if(serverLogging.findItems.length>0)
            {
                var findOpts = [];
                for(var i=0;i<serverLogging.findItems.length;i++)
                {
                    var curOpt = serverLogging.findItems[i];
                    findOpts.push(curOpt);
                }
                if(findOpts.length>0)
                    serverLogging.findInLog(findOpts, items);
                serverLogging.bindMiniMap(items);
            }
            else
            {
                serverLogging.hasFindItems = false;
                serverLogging.findItemsResult = false;
                serverLogging.miniMap.find("span.marker").remove();
                var elem = items || serverLogging.logPanel;
                elem.removeHighlight("highlight");
            }
            filterProcessIndicator.hide();
        }
        continueProcess();
    },
    findInLog : function(opts, items)
    {
        serverLogging.findCSSClasses = serverLogging.findCSSClasses || [];
        serverLogging.findOpts = opts;
        var elem = items || serverLogging.logPanel;
        serverLogging.hasFindItems = true;
        serverLogging.fetchRequestInProgress = true;
        var itemsFound = [];
        if(opts && opts.length>0 && serverLogging.curLogInfo && serverLogging.curLogInfo.log_segment)
        {
            var log = serverLogging.curLogInfo.log_segment;
            if(serverLogging.isLogFiltered)
            {
                log = serverLogging.filteredItems;
            }
            for(var i=0, logLength = log.length;i<logLength;i++)
            {
                var line = log[i].toLowerCase();
                for(var j=0, optsLength = opts.length;j<optsLength;j++)
                {
                    var opt = opts[j];
                    if(line.indexOf(opt.phrase)>=0)
                    {
                        if(!serverLogging.findCSSClasses.has(opt.uid))
                        {
                            crushFTP.methods.createCSSClass("." + opt.uid, "background-color:" + opt.color + ";display:inline;color:" + serverLogging.getOppColor(opt.color) +"!important;");
                            serverLogging.findCSSClasses.push(opt.uid);
                        }
                        itemsFound.push({
                            lineNo : i+1,
                            uid : opt.uid
                        });
                    }
                }
            }
        }
        if(itemsFound.length>0)
        {
            serverLogging.logPanel.removeHighlight();
            serverLogging.findItemsResult = itemsFound;
            for(var j=0;j<opts.length;j++)
            {
                var opt = opts[j];
                elem.highlightNoRegex(opt.phrase, opt.uid);
            }
        }
        else
        {
            serverLogging.findItemsResult = false;
            for(var j=0;j<opts.length;j++)
            {
                var opt = opts[j];
                if(elem.find("."+opt.uid+":first").length>0)
                {
                    elem.removeHighlight(opt.uid);
                }
            }
        }
        serverLogging.fetchRequestInProgress = false;
    },
    filterLog : function(flag, noRedraw)
    {
        serverLogging.filterOptionItems = serverLogging.filterOptionItems || [];
        if(serverLogging.filterOptionItems.length>0 && serverLogging.curLogInfo && serverLogging.curLogInfo.log_segment)
        {
            var log = serverLogging.curLogInfo.log_segment;
            var opts = serverLogging.filterOptionItems;
            var _filteredItems = [];
            var operation = $("#excludeFilteredItemsOperation").val();
            for(var i=0, logLength = log.length;i<logLength;i++)
            {
                var line = log[i].toLowerCase();
                var flagAdd = false;
                if(operation === "or"){
                    for(var j=0, optsLength = opts.length;j<optsLength;j++)
                    {
                        var opt = opts[j];
                        if(line.indexOf(opt.phrase)>=0)
                        {
                            flagAdd = true;
                            j = optsLength;
                        }
                    }
                }
                else{
                    var hasAllMatching = false;
                    for(var j=0, optsLength = opts.length;j<optsLength;j++)
                    {
                        var opt = opts[j];
                        if(line.indexOf(opt.phrase)>=0)
                        {
                            hasAllMatching = true;
                        }
                        else{
                            hasAllMatching = false;
                            j = optsLength;
                        }
                    }
                    flagAdd = hasAllMatching;
                }
                if(flag)
                {
                    if(flagAdd)
                        _filteredItems.push(log[i]);
                }
                else
                {
                    if(!flagAdd)
                        _filteredItems.push(log[i]);
                }
            }
            serverLogging.filteredItems = _filteredItems;
            serverLogging.isLogFiltered = true;
            delete serverLogging.lastShownRange;
            if(!noRedraw)
                serverLogging.redrawLogArea(false, true);
        }
        else
        {
            serverLogging.filteredItems = [];
            serverLogging.isLogFiltered = false;
            delete serverLogging.lastShownRange;
            serverLogging.logPanel.parent().scroll();
            if(!noRedraw)
                serverLogging.redrawLogArea(false, true);
        }
    }
};


function downloadFile(filename, content) {
  // It works on all HTML5 Ready browsers as it uses the download attribute of the <a> element:
  const element = document.createElement("a");
  //A blob is a data type that can store binary data
  // “type” is a MIME type
  // It can have a different value, based on a file you want to save
  const blob = new Blob([content], { type: "plain/text" });
  //createObjectURL() static method creates a DOMString containing a URL representing the object given in the parameter.
  const fileUrl = URL.createObjectURL(blob);
  //setAttribute() Sets the value of an attribute on the specified element.
  element.setAttribute("href", fileUrl); //file location
  element.setAttribute("download", filename); // file name
  element.style.display = "none";
  //use appendChild() method to move an element from one element to another
  document.body.appendChild(element);
  element.click();
  //The removeChild() method of the Node interface removes a child node from the DOM and returns the removed node
  document.body.removeChild(element);
};