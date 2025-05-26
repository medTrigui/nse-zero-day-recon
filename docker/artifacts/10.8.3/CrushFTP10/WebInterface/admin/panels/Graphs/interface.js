/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelGraphs = {};
panelGraphs.localization = {};
/****************************/

// Panel details
panelGraphs.panelName = "Graphs";
var dashboardPnlName = window.panelDashboard ? panelDashboard.panelName : "Dashboard";
var dashboardPnl = window.panelDashboard ? panelDashboard._panel : $("div#pnlDashboard");
panelGraphs._panel = $("#pnl" + dashboardPnlName);

//Local variables
panelGraphs.initGraphInterval = 300;
panelGraphs.intervalsInPoll = 1;
panelGraphs.pollIntervalInMS = 1000;
panelGraphs.maxRecordsToShow = 300;
panelGraphs.hasReopened = false;

panelGraphs.Connections = [0];
panelGraphs.ConnectionsUnique = [0];
panelGraphs.OutSpeed = [0];
panelGraphs.InSpeed = [0];
panelGraphs.openFiles = [0];

panelGraphs.connectionsGraph = $("#connectionsGraph", dashboardPnl);
panelGraphs.connectionCurrent = $("#connectionCurrent", dashboardPnl);
panelGraphs.connectionMax = $("#connectionMax", dashboardPnl);
panelGraphs.connectionUnique = $("#connectionUnique", dashboardPnl);
panelGraphs.connectionUniqueMax = $("#connectionUniqueMax", dashboardPnl);
panelGraphs.connectionsUniqueCB = $("#connectionsUniqueCB", dashboardPnl);
panelGraphs.connectionsAllCB = $("#connectionsAllCB", dashboardPnl);

panelGraphs.speedGraph = $("#speedGraph", dashboardPnl);
panelGraphs.outSpeedCurrent = $("#outSpeedCurrent, #outSpeedCurrent2", dashboardPnl);
panelGraphs.outSpeedMax = $("#outSpeedMax, #outSpeedMax2", dashboardPnl);

panelGraphs.inSpeedCurrent = $("#inSpeedCurrent, #inSpeedCurrent2", dashboardPnl);
panelGraphs.inSpeedMax = $("#inSpeedMax, #inSpeedMax2", dashboardPnl);

panelGraphs.outSpeedGraph = $("#outSpeedGraph", panelGraphs._panel);

panelGraphs.inSpeedGraph = $("#inSpeedGraph", panelGraphs._panel);

panelGraphs.memoryGraph = $("#memoryTimeline", dashboardPnl);
panelGraphs.ram_max = $("#ram_max", dashboardPnl);
panelGraphs.ram_free = $("#ram_free", dashboardPnl);
panelGraphs.ram_pending_bytes = $("#ram_pending_bytes", dashboardPnl);
panelGraphs.ram_pending_bytes_s3_download = $("#ram_pending_bytes_s3_download", dashboardPnl);
panelGraphs.ram_pending_bytes_s3_upload = $("#ram_pending_bytes_s3_upload", dashboardPnl);
panelGraphs.ram_pending_bytes_multisegment_upload = $("#ram_pending_bytes_multisegment_upload", dashboardPnl);
panelGraphs.ram_pending_bytes_multisegment_download = $("#ram_pending_bytes_multisegment_download", dashboardPnl);

panelGraphs.serverCPUMax = $("#serverCPUMax", dashboardPnl);
panelGraphs.osCPUMax = $("#osCPUMax", dashboardPnl);

panelGraphs.CPUGraph = $("#CPUGraph", dashboardPnl);

panelGraphs.graphInfo = $("#graphinfo");
panelGraphs.graphInfo.draggable();
panelGraphs.graphInfo.resizable({
    minWidth: 350,
    maxWidth: 800
});
panelGraphs.graphTip = $("#graphtip");

$.fn.sparkline.defaults.common.width = "99%";
$.fn.sparkline.defaults.common.height = "100px";

panelGraphs.maxConnection = 0;
panelGraphs.maxUniqueConnection = 0;
panelGraphs.maxOutSpeed = 0;
panelGraphs.maxInSpeed = 0;

// Localizations
panelGraphs.localization = {};

// Assign localizations
localizations.panels[panelGraphs.panelName] = $.extend(panelGraphs.localization, localizations.panels[panelGraphs.panelName]);

// Interface methods
panelGraphs.init = function() {
    applyLocalizations(panelGraphs.panelName, localizations.panels);
    var isInit = true;

    function threadMethod() {
        if (!panelGraphs._panel.is(":visible")) {
            //panelGraphs.hasReopened = true;
        } else {
            if (!panelGraphs.graphThreadRunning) {
                panelGraphs.refreshDataFromServer(isInit);
                panelGraphs.hasReopened = isInit = false;
            }
        }
    }
    if (!panelGraphs.graphsThread) {
        panelGraphs.graphsThread = setInterval(
            threadMethod, panelGraphs.pollIntervalInMS);
    }
    threadMethod();
    $("#memoryRelease").unbind().bind("dblclick", function() {
        var cmdObj = {
            command: "system.gc"
        };
        crushFTP.data.serverRequest(cmdObj,
        function(data) {
            crushFTP.UI.growl("Success", "", false, 2000);
        });
        crushFTP.methods.removeTextRangeSelection()
        return false;
    });

    panelGraphs.outSpeedGraph.bind("mousemove", function(ev) {
        var left = ev.pageX;
        if (left > $(window).width() - 370) {
            left = $(window).width() - 370;
        }
        panelGraphs.graphTip.css({
            top: panelGraphs.outSpeedGraph.offset().top - panelGraphs.outSpeedGraph.height(),
            left: left
        });
    });

    panelGraphs.inSpeedGraph.bind("mousemove", function(ev) {
        var left = ev.pageX;
        if (left > $(window).width() - 370) {
            left = $(window).width() - 370;
        }
        panelGraphs.graphTip.css({
            top: panelGraphs.inSpeedGraph.offset().top - panelGraphs.inSpeedGraph.height(),
            left: left
        });
    });

    panelGraphs.outSpeedGraph.bind("click", function(ev) {
        var curRegion = panelGraphs.outSpeedGraph.data("curRegion");
        if (curRegion) {
            panelGraphs.showSpeedInfoProxy(curRegion, "out", false, true);
        }
    });

    panelGraphs.inSpeedGraph.bind("click", function(ev) {
        var curRegion = panelGraphs.inSpeedGraph.data("curRegion");
        if (curRegion) {
            panelGraphs.showSpeedInfoProxy(curRegion, "in", false, true);
        }
    });

    panelGraphs.speedGraph.bind("mousemove", function(ev) {
        var left = ev.pageX;
        if (left > $(window).width() - 370) {
            left = $(window).width() - 370;
        }
        panelGraphs.graphTip.css({
            top: panelGraphs.speedGraph.offset().top - panelGraphs.speedGraph.height(),
            left: left
        });
    });

    panelGraphs.speedGraph.bind("click", function(ev) {
        var curRegion = panelGraphs.speedGraph.data("curRegion");
        if (curRegion) {
            panelGraphs.showSpeedInfoProxy(curRegion, "both", false, true);
        }
    });

    window.panelDashboard && dashboardPnl.find("fieldset#speedInformation").find(".downSpeed").bind("mouseenter", function(ev) {
        var left = ev.pageX;
        if (left > $(window).width() - 370) {
            left = $(window).width() - 370;
        }
        panelGraphs.graphTip.css({
            top: ev.pageY - 100,
            left: left - 150
        });
        panelGraphs.graphTip.attr("monitoring.down", true);

        function refreshSpeedInfo() {
            panelGraphs.showSpeedInfoProxy(ev, "both", 299);
            setTimeout(function() {
                if (panelGraphs.graphTip.attr("monitoring.down"))
                    refreshSpeedInfo();
            }, 2000);
        }
        refreshSpeedInfo();
    }).bind("mouseleave", function() {
        setTimeout(function(){
            panelGraphs.graphTip.hide();
        }, 600);
        panelGraphs.graphTip.removeAttr("monitoring.down");
    });

    window.panelDashboard && dashboardPnl.find("fieldset#speedInformation").find(".upSpeed").bind("mouseenter", function(ev) {
        var left = ev.pageX;
        if (left > $(window).width() - 370) {
            left = $(window).width() - 370;
        }
        panelGraphs.graphTip.css({
            top: ev.pageY - 100,
            left: left - 150
        });
        panelGraphs.graphTip.attr("monitoring.up", true);

        function refreshSpeedInfo() {
            panelGraphs.showSpeedInfo(ev, "both", 299);
            setTimeout(function() {
                if (panelGraphs.graphTip.attr("monitoring.up"))
                    refreshSpeedInfo();
            }, 2000);
        }
        refreshSpeedInfo();
    }).bind("mouseleave", function() {
        setTimeout(function(){
            panelGraphs.graphTip.hide();
        }, 600);
        panelGraphs.graphTip.removeAttr("monitoring.up");
    });

    panelGraphs.graphInfo.find(".close").click(function() {
        panelGraphs.graphInfo.hide();
        return false;
    });

    panelGraphs.connectionsUniqueCB.unbind().change(function(){
        panelGraphs.renderGraphs();
    });

    panelGraphs.connectionsAllCB.unbind().change(function(){
        panelGraphs.renderGraphs();
    });

    $("#memoryGraphPanel").contextMenu({
        topPadding: 110,
        leftPadding: 20,
        menu: 'memoryGraphContextMenu'
    }, function(action, el, pos, command) {
        if (command == "restartProcess") {
            var obj = {
                command: "restartProcess",
                random: Math.random(),
                c2f: crushFTP.getCrushAuth()
            };
            $.ajax({
                type: "POST",
                url: crushFTP.ajaxCallURL,
                data: obj,
                async: true,
                success: function(data) {
                    crushFTP.UI.growl("Success", "", false, 2000);
                }
            });
        }
        if (command == "restartIdle") {
            var obj = {
                command: "restartIdle",
                random: Math.random(),
                c2f: crushFTP.getCrushAuth()
            };
            $.ajax({
                type: "POST",
                url: crushFTP.ajaxCallURL,
                data: obj,
                async: true,
                success: function(data) {
                    crushFTP.UI.growl("Success", "", false, 2000);
                }
            });
        }
        if (command == "shutdownIdle") {
            var obj = {
                command: "shutdownIdle",
                random: Math.random(),
                c2f: crushFTP.getCrushAuth()
            };
            $.ajax({
                type: "POST",
                url: crushFTP.ajaxCallURL,
                data: obj,
                async: true,
                success: function(data) {
                    crushFTP.UI.growl("Success", "", false, 2000);
                }
            });
        }
        if (command == "CallGC") {
            var obj = {
                command: "system.gc",
                random: Math.random(),
                c2f: crushFTP.getCrushAuth()
            };
            $.ajax({
                type: "POST",
                url: crushFTP.ajaxCallURL,
                data: obj,
                async: true,
                success: function(data) {
                    crushFTP.UI.growl("Success", "", false, 2000);
                }
            });
        }
        if (command == "setMaxServerMemory") {
            function setMaxMemory() {
                var _val = "0";
                var numbers = /^[0-9]+$/;
                jPrompt("Set Max. Server Memory: (in MegaBytes)", _val, "Input", function(value) {
                    if (value && value.length > 0) {
                        if (value.match(numbers)) {
                            var obj = {
                                command: "setMaxServerMemory",
                                memory: $.trim(value),
                                random: Math.random(),
                                c2f: crushFTP.getCrushAuth()
                            };
                            $.ajax({
                                type: "POST",
                                url: crushFTP.ajaxCallURL,
                                data: obj,
                                async: true,
                                success: function(data) {
                                    crushFTP.UI.growl("Success", "", false, 2000);
                                }
                            });
                        } else {
                            jAlert("Please input numeric characters only.", "Error", function() {
                                setMaxMemory();
                            });
                        }
                    }
                });
            }
            setMaxMemory();
        }
        if (command == "dumpMemory") {
            window.open("/WebInterface/function/?command=dumpHeap&c2f="+crushFTP.getCrushAuth());
        }
        return false;
    }).click(function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        return false;
    });

};

 var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

panelGraphs.showSpeedInfo = function(ev, type, region, info) {
    delay(function(){
        panelGraphs.showSpeedInfoProxy(ev, type, region, info)
    }, 500);
}

panelGraphs.formatTime = function(secs) {
    var remaining = "";
    secs = secs.toString();
    secs = secs.substring(0, secs.indexOf(".")) * 1;
    var mins = (secs / 60) + ".0";
    mins = mins.substring(0, mins.indexOf(".")) * 1;
    if (mins > 0) {
        secs -= (mins * 60);
        remaining = mins + " min, " + secs + " secs";
    } else {
        if (secs < 0) {
            remaining = "Calculating";
        } else {
            remaining = secs + " secs";
        }
    }
    return remaining;
}

panelGraphs.showSpeedInfoProxy = function(ev, type, region, info) {
    if (!region) {
        var sparkline = ev.sparklines[0];
        region = sparkline.getCurrentRegionFields().x;
        region = region || 299;
    }
    var curDataIn = [],curDataOut = [];
    var infoPanel = panelGraphs.graphTip;
    if (info) {
        infoPanel = panelGraphs.graphInfo;
    }
    infoPanel.show();
    infoPanel.find(".nodata").hide();
    infoPanel.find(".info").hide();
    infoPanel.find(".loader").show();
    crushFTP.data.serverRequest({
        command: "getServerItem",
        key: "/server_info/incoming_transfers_history/" + region
    }, function(data) {
        var items = $.xml2json(data);
        if (items && items.response_data && items.response_data.result_value && items.response_data.result_value.result_value_subitem) {
            curDataIn = items.response_data.result_value.result_value_subitem;
            infoPanel.find(".nodata").hide();
            infoPanel.find(".info").show();
            infoPanel.find(".loader").hide();
            if (!jQuery.isArray(curDataIn)) {
                curDataIn = [curDataIn];
            }
        }
        crushFTP.data.serverRequest({
            command: "getServerItem",
            key: "/server_info/outgoing_transfers_history/" + region
        }, function(data) {
            var items = $.xml2json(data);
            if (items && items.response_data && items.response_data.result_value && items.response_data.result_value.result_value_subitem) {
                curDataOut = items.response_data.result_value.result_value_subitem;
                infoPanel.find(".nodata").hide();
                infoPanel.find(".info").show();
                infoPanel.find(".loader").hide();
                if (!jQuery.isArray(curDataOut)) {
                    curDataOut = [curDataOut];
                }
            }
            infoPanel.find(".info").empty();
            var hasItems = false;
            if(type == "both" || type == "out")
            {
                for (var i = 0; i < curDataOut.length; i++) {
                    var item = curDataOut[i];
                    if (item && item.user_name) {
                        var infoItem = $('<li><i class="fa fa-download"></i><span class="value">&nbsp;Outgoing:&nbsp;</span><span class="value">(</span><span class="value user_protocol"></span><span class="value">)</span><strong><span class="value user_name"></span></strong><span class="value user_ip"></span><span class="value">&nbsp;&nbsp;</span><span class="perc"></span><span class="value time"></span><br><span class="value">Item: </span><div class="value name"></div><span class="value folder_type"></span>&nbsp;<span class="value">(</span><span class="value the_file_size size"></span><span class="value">)&nbsp;</span><span class="value the_file_speed size"></span><span class="value timestamp"></span>&nbsp;<span class="value timeinfo"></span></li>');
                        hasItems = true;
                        var dt, dtstart, ts;
                        try {
                            var now = new Date(parseInt(item.now));
                            dt = dateFormat(now, "hh:MM:ss TT");
                            ts = dateFormat(now, "mm/dd/yyyy hh:MM:ss TT");
                            var the_file_start = new Date(parseInt(item.the_file_start));
                            dtstart = dateFormat(now, "hh:MM:ss TT");
                        } catch (ex) {
                            dt = dtstart = "-";
                        }

                        var elapsed = parseInt(item.now) - parseInt(item.the_file_start);
                        var bytes = parseInt(item.current_loc);
                        var size = parseInt(item.size);
                        var remainingBytes = size - bytes;
                        var secs = Math.round((elapsed * remainingBytes) / bytes);
                        var remaining = panelGraphs.formatTime((secs / 1000) + 1 + "");//formatted time
                        var percentDone = Math.round((bytes * 100.0)/size);// percentages completed
                        var rElapsed = panelGraphs.formatTime((elapsed / 1000) + 1 + "");// elapsed time formatted

                        infoItem.find(".time").text(dt);
                        infoItem.find(".user_name").text(item.user_name);
                        infoItem.find(".user_protocol").text(item.user_protocol);
                        infoItem.find(".user_ip").text(item.user_ip);
                        infoItem.find(".timestamp").text(ts);
                        infoItem.find(".timeinfo").text("Remaining/Elapsed: "+ remaining + "/" + rElapsed);
                        infoItem.find(".name").text(item.path || item.name);
                        infoItem.find(".folder_type").text(item.folder_type);
                        infoItem.find(".the_file_size").text(crushFTP.methods.formatBytes(item.the_file_size) + " " + percentDone + "% Done");
                        infoItem.find(".the_file_speed").text(crushFTP.methods.formatBytes(item.the_file_speed * 1024) + "/s");
                        infoPanel.find(".info").append(infoItem);
                        if (type === "in" && item.user_protocol.toLowerCase().indexOf("http") !== 0) {
                            infoItem.find(".the_file_size").hide();
                        }
                        if (type === "out") {
                            var curLoc = item.current_loc;
                            var totalSize = item.the_file_size;
                            var perc = (100 * curLoc) / totalSize;
                            if (perc <= 100)
                                infoItem.find(".perc").text(Math.round(perc) + "%");
                        }
                    }
                }
            }

            if(type == "both" || type == "in")
            {
                for (var i = 0; i < curDataIn.length; i++) {
                    var item = curDataIn[i];
                    if (item && item.user_name) {
                        var infoItem = $('<li><i class="fa fa-upload"></i><span class="value">&nbsp;Incoming:&nbsp;</span><span class="value">(</span><span class="value user_protocol"></span><span class="value">)</span><strong><span class="value user_name"></span></strong><span class="value user_ip"></span><span class="value">&nbsp;&nbsp;</span><span class="perc"></span><span class="value time"></span><br><span class="value">Item: </span><div class="value name"></div><span class="value folder_type"></span>&nbsp;<span class="value">(</span><span class="value the_file_size size"></span><span class="value">)&nbsp;</span><span class="value the_file_speed size"></span><span class="value timestamp"></span>&nbsp;<span class="value timeinfo"></span></li>');
                        hasItems = true;
                        var dt, dtstart, ts;
                        try {
                            var now = new Date(parseInt(item.now));
                            dt = dateFormat(now, "hh:MM:ss TT");
                            ts = dateFormat(now, "mm/dd/yyyy hh:MM:ss TT");
                            var the_file_start = new Date(parseInt(item.the_file_start));
                            dtstart = dateFormat(now, "hh:MM:ss TT");
                        } catch (ex) {
                            dt = dtstart = "-";
                        }

                        var elapsed = parseInt(item.now) - parseInt(item.the_file_start);
                        var bytes = parseInt(item.current_loc);
                        var size = parseInt(item.size);
                        var remainingBytes = size - bytes;
                        var secs = Math.round((elapsed * remainingBytes) / bytes);
                        var remaining = panelGraphs.formatTime((secs / 1000) + 1 + "");//formatted time
                        var percentDone = Math.round((bytes * 100.0)/size);// percentages completed
                        var rElapsed = panelGraphs.formatTime((elapsed / 1000) + 1 + "");// elapsed time formatted

                        infoItem.find(".time").text(dt);
                        infoItem.find(".user_name").text(item.user_name);
                        infoItem.find(".user_protocol").text(item.user_protocol);
                        infoItem.find(".user_ip").text(item.user_ip);
                        infoItem.find(".timestamp").text(ts);
                        infoItem.find(".timeinfo").text("Remaining/Elapsed: "+ remaining + "/" + rElapsed);
                        infoItem.find(".name").text(item.path || item.name);
                        infoItem.find(".folder_type").text(item.folder_type);
                        infoItem.find(".the_file_size").text(crushFTP.methods.formatBytes(item.the_file_size) + " " + percentDone + "% Done");
                        infoItem.find(".the_file_speed").text(crushFTP.methods.formatBytes(item.the_file_speed * 1024) + "/s");
                        infoPanel.find(".info").append(infoItem);
                        if (type === "in" && item.user_protocol.toLowerCase().indexOf("http") !== 0) {
                            infoItem.find(".the_file_size").hide();
                        }
                        if (type === "out") {
                            var curLoc = item.current_loc;
                            var totalSize = item.the_file_size;
                            var perc = (100 * curLoc) / totalSize;
                            if (perc <= 100)
                                infoItem.find(".perc").text(Math.round(perc) + "%");
                        }
                    }
                }
            }
            if (hasItems) {
                if (panelGraphs.graphTip.attr("monitoring.up"))
                    infoPanel.show();
            } else {
                infoPanel.find(".nodata").show();
                infoPanel.find(".info").hide();
                infoPanel.find(".loader").hide();
            }
        });
    });
};

panelGraphs.bindGraphsData = function(items, init){
    function getDataFromResponse(items, key) {
        if (items && items[key]) {
            var val = items[key];
            if (val.lastIndexOf(",") == val.length - 1)
                val = val.substr(0, val.length - 1);
            return val.split(",").reverse();
        } else
            return "";
    }
    if(init){
        priorIntervals = panelGraphs.initGraphInterval;
        panelGraphs.Connections = [];
        panelGraphs.ConnectionsUnique = [];
        panelGraphs.OutSpeed = [];
        panelGraphs.InSpeed = [];
        panelGraphs.RamFree = [];
        panelGraphs.RamPendingBytes = [];
        panelGraphs.RamS3PendingDownload = [];
        panelGraphs.RamS3PendingUpload = [];
        panelGraphs.RamUsed = [];
        panelGraphs.ServerCPU = [];
        panelGraphs.OSCPU = [];
        panelGraphs.maxOpenFiles = 0;
        panelGraphs.openFiles = [];
        panelGraphs.intervalsInPoll = panelGraphs.initGraphInterval;
    }

    setTimeout(function(){
        panelGraphs.bindData.graphs({
            logged_in_users: getDataFromResponse(items.response_data, "logged_in_users"),
            connected_unique_ips: getDataFromResponse(items.response_data, "connected_unique_ips"),
            current_download_speed: getDataFromResponse(items.response_data, "current_download_speed"),
            current_upload_speed: getDataFromResponse(items.response_data, "current_upload_speed"),
            ram_free: getDataFromResponse(items.response_data, "ram_free"),
            ram_pending_bytes: getDataFromResponse(items.response_data, "ram_pending_bytes"),
            ram_pending_bytes_s3_download: getDataFromResponse(items.response_data, "ram_pending_bytes_s3_download"),
            ram_pending_bytes_s3_upload: getDataFromResponse(items.response_data, "ram_pending_bytes_s3_upload"),
            ram_pending_bytes_multisegment_upload: getDataFromResponse(items.response_data, "ram_pending_bytes_multisegment_upload"),
            ram_pending_bytes_multisegment_download: getDataFromResponse(items.response_data, "ram_pending_bytes_multisegment_download"),
            ram_max: getDataFromResponse(items.response_data, "ram_max"),
            server_cpu: getDataFromResponse(items.response_data, "server_cpu"),
            os_cpu: getDataFromResponse(items.response_data, "os_cpu"),
            open_files: getDataFromResponse(items.response_data, "open_files"),
            max_open_files: getDataFromResponse(items.response_data, "max_open_files")
        });
    })
}

panelGraphs.refreshDataFromServer = function(isInit) {
    if(window.panelDashboard && !window.panelDashboard.isLive) {
        return;
    }
    panelGraphs.graphThreadRunning = true;
    var priorIntervals = panelGraphs.intervalsInPoll;
    if (isInit) {
        priorIntervals = panelGraphs.initGraphInterval;
        panelGraphs.Connections = [];
        panelGraphs.ConnectionsUnique = [];
        panelGraphs.OutSpeed = [];
        panelGraphs.InSpeed = [];
        panelGraphs.RamFree = [];
        panelGraphs.RamPendingBytes = [];
        panelGraphs.RamS3PendingDownload = [];
        panelGraphs.RamS3PendingUpload = [];
        panelGraphs.RamUsed = [];
        panelGraphs.ServerCPU = [];
        panelGraphs.OSCPU = [];
    }

    if (priorIntervals > panelGraphs.maxRecordsToShow) priorIntervals = panelGraphs.maxRecordsToShow;
    var params = "current_download_speed-current_upload_speed-logged_in_users-ram_free-ram_max-ram_pending_bytes-ram_pending_bytes_s3_upload-ram_pending_bytes_s3_download-server_cpu-os_cpu-connected_unique_ips-open_files-max_open_files-ram_pending_bytes_multisegment_download-ram_pending_bytes_multisegment_upload";
    crushFTP.data.serverRequest({
        command: "getStatHistory",
        params: params,
        priorIntervals: priorIntervals
    }, function(data) {
        panelGraphs.graphThreadRunning = false;
        panelGraphs.bindGraphsData($.xml2json(data));
    });
};

// Bind data from provided JSON to panel's fields
panelGraphs.bindData = {
    graphs: function(data) {
        // if (!data || !data.logged_in_users) {
        //     return;
        // }

        if(data && data.logged_in_users){
            //Connections
            panelGraphs.Connections = panelGraphs.Connections.concat(data.logged_in_users);
            if (panelGraphs.Connections.length > panelGraphs.maxRecordsToShow) {
                var itemsToRemove = panelGraphs.Connections.length - panelGraphs.maxRecordsToShow;
                panelGraphs.Connections.remove(1, itemsToRemove);
                panelGraphs.Connections[0] = 0;
            }
            var currentConnections = parseInt(data.logged_in_users[data.logged_in_users.length - 1]);
            var maxVal = parseInt(data.logged_in_users.max());
            if (maxVal > panelGraphs.maxConnection) {
                panelGraphs.maxConnection = maxVal;
            }
            panelGraphs.connectionCurrent.text(currentConnections);
            panelGraphs.connectionMax.text(panelGraphs.maxConnection);
        }

        if(data && data.connected_unique_ips)
        {
            //Connections Unique
            panelGraphs.ConnectionsUnique = panelGraphs.ConnectionsUnique.concat(data.connected_unique_ips);
            if (panelGraphs.ConnectionsUnique.length > panelGraphs.maxRecordsToShow) {
                var itemsToRemove = panelGraphs.ConnectionsUnique.length - panelGraphs.maxRecordsToShow;
                panelGraphs.ConnectionsUnique.remove(1, itemsToRemove);
                panelGraphs.ConnectionsUnique[0] = 0;
            }

            var currentUniqueConnections = parseInt(data.connected_unique_ips[data.connected_unique_ips.length - 1]);
            var maxUniqueVal = parseInt(data.connected_unique_ips.max());
            if (maxUniqueVal > panelGraphs.maxUniqueConnection) {
                panelGraphs.maxUniqueConnection = maxUniqueVal;
            }
            panelGraphs.connectionUnique.text(currentUniqueConnections);
            panelGraphs.connectionUniqueMax.text(panelGraphs.maxUniqueConnection);
        }

        if(data && data.current_download_speed)
        {
            //Out speed
            panelGraphs.OutSpeed = panelGraphs.OutSpeed.concat(data.current_download_speed);
            if (panelGraphs.OutSpeed.length > panelGraphs.maxRecordsToShow) {
                var itemsToRemove = panelGraphs.OutSpeed.length - panelGraphs.maxRecordsToShow;
                panelGraphs.OutSpeed.remove(1, itemsToRemove);
                panelGraphs.OutSpeed[0] = 0;
            }
            var currentOutSpeed = parseInt(data.current_download_speed[data.current_download_speed.length - 1]);
            var maxOSVal = parseInt(data.current_download_speed.max());
            if (maxOSVal > panelGraphs.maxOutSpeed) {
                panelGraphs.maxOutSpeed = maxOSVal;
            }
            panelGraphs.outSpeedCurrent.text(crushFTP.methods.formatBytes(currentOutSpeed * 1024) + "/sec");
            panelGraphs.outSpeedMax.text(crushFTP.methods.formatBytes(panelGraphs.maxOutSpeed * 1024) + "/sec");
        }

        if(data && data.current_upload_speed)
        {
            //In Speed
            panelGraphs.InSpeed = panelGraphs.InSpeed.concat(data.current_upload_speed);
            if (panelGraphs.InSpeed.length > panelGraphs.maxRecordsToShow) {
                var itemsToRemove = panelGraphs.InSpeed.length - panelGraphs.maxRecordsToShow;
                panelGraphs.InSpeed.remove(1, itemsToRemove);
                panelGraphs.InSpeed[0] = 0;
            }
            var currentInSpeed = parseInt(data.current_upload_speed[data.current_upload_speed.length - 1]);
            var maxISVal = parseInt(data.current_upload_speed.max());
            if (maxISVal > panelGraphs.maxInSpeed) {
                panelGraphs.maxInSpeed = maxISVal;
            }
            panelGraphs.inSpeedCurrent.text(crushFTP.methods.formatBytes(currentInSpeed * 1024) + "/sec");
            panelGraphs.inSpeedMax.text(crushFTP.methods.formatBytes(panelGraphs.maxInSpeed * 1024) + "/sec");
        }

        if(data && data.ram_free)
        {
            //Memory
            panelGraphs.RamFree = panelGraphs.RamFree ? panelGraphs.RamFree.concat(data.ram_free) : panelGraphs.RamFree;
            if (panelGraphs.RamFree && panelGraphs.RamFree.length > panelGraphs.maxRecordsToShow) {
                var itemsToRemove = panelGraphs.RamFree.length - panelGraphs.maxRecordsToShow;
                panelGraphs.RamFree.remove(1, itemsToRemove);
                panelGraphs.RamFree[0] = 0;
            }
        }

        if(data && data.ram_pending_bytes)
        {
            panelGraphs.RamPendingBytes = panelGraphs.RamPendingBytes ? panelGraphs.RamPendingBytes.concat(data.ram_pending_bytes) : panelGraphs.RamPendingBytes;
            if (panelGraphs.RamPendingBytes && panelGraphs.RamPendingBytes.length > panelGraphs.maxRecordsToShow) {
                var itemsToRemove = panelGraphs.RamPendingBytes.length - panelGraphs.maxRecordsToShow;
                panelGraphs.RamPendingBytes.remove(1, itemsToRemove);
                panelGraphs.RamPendingBytes[0] = 0;
            }
        }

        if(data && data.ram_pending_bytes_s3_download)
        {
            panelGraphs.RamS3PendingDownload = panelGraphs.RamS3PendingDownload ? panelGraphs.RamS3PendingDownload.concat(data.ram_pending_bytes_s3_download) : panelGraphs.RamS3PendingDownload;
            if (panelGraphs.RamS3PendingDownload && panelGraphs.RamS3PendingDownload.length > panelGraphs.maxRecordsToShow) {
                var itemsToRemove = panelGraphs.RamS3PendingDownload.length - panelGraphs.maxRecordsToShow;
                panelGraphs.RamS3PendingDownload.remove(1, itemsToRemove);
                panelGraphs.RamS3PendingDownload[0] = 0;
            }
        }

        if(data && data.ram_pending_bytes_s3_upload)
        {
            panelGraphs.RamS3PendingUpload = panelGraphs.RamS3PendingUpload ? panelGraphs.RamS3PendingUpload.concat(data.ram_pending_bytes_s3_upload) : panelGraphs.RamS3PendingUpload;
            if (panelGraphs.RamS3PendingUpload && panelGraphs.RamS3PendingUpload.length > panelGraphs.maxRecordsToShow) {
                var itemsToRemove = panelGraphs.RamS3PendingUpload.length - panelGraphs.maxRecordsToShow;
                panelGraphs.RamS3PendingUpload.remove(1, itemsToRemove);
                panelGraphs.RamS3PendingUpload[0] = 0;
            }
        }

        try{
            panelGraphs.ram_pending_bytes.text(crushFTP.methods.formatBytes(data.ram_pending_bytes[data.ram_pending_bytes.length - 1]));
            panelGraphs.ram_pending_bytes_s3_download.text(crushFTP.methods.formatBytes(data.ram_pending_bytes_s3_download[data.ram_pending_bytes_s3_download.length - 1]));
            panelGraphs.ram_pending_bytes_s3_upload.text(crushFTP.methods.formatBytes(data.ram_pending_bytes_s3_upload[data.ram_pending_bytes_s3_upload.length - 1]));
            panelGraphs.ram_pending_bytes_multisegment_upload.text(crushFTP.methods.formatBytes(data.ram_pending_bytes_multisegment_upload[data.ram_pending_bytes_multisegment_upload.length - 1]));
            panelGraphs.ram_pending_bytes_multisegment_download.text(crushFTP.methods.formatBytes(data.ram_pending_bytes_multisegment_download[data.ram_pending_bytes_multisegment_download.length - 1]));
            panelGraphs.ram_free.text(crushFTP.methods.formatBytes(data.ram_free[data.ram_free.length - 1]));
            panelGraphs.ram_max.text(crushFTP.methods.formatBytes(data.ram_max[data.ram_max.length - 1]));
        }
        catch(ex){
            console.log(ex);
        }

        if(panelGraphs.RamFree){
            panelGraphs.RamUsed = [];
            var maxRam = data.ram_max[data.ram_max.length - 1];
            for (var i = 0; i < panelGraphs.RamFree.length; i++) {
                if (panelGraphs.RamFree[i] > 0)
                    panelGraphs.RamUsed.push(maxRam - panelGraphs.RamFree[i]);
            }
        }

        if(data && data.server_cpu)
        {
            //Server CPU
            panelGraphs.ServerCPU = panelGraphs.ServerCPU.concat(data.server_cpu);
            if (panelGraphs.ServerCPU.length > panelGraphs.maxRecordsToShow) {
                var itemsToRemove = panelGraphs.ServerCPU.length - panelGraphs.maxRecordsToShow;
                panelGraphs.ServerCPU.remove(1, itemsToRemove);
                panelGraphs.ServerCPU[0] = 0;
            }
            var maxServerCPU = 0;
            for (var i = panelGraphs.ServerCPU.length - 1; i >= 0; i--) {
                if(parseInt(panelGraphs.ServerCPU[i])>maxServerCPU)
                    maxServerCPU = panelGraphs.ServerCPU[i];
            };
            panelGraphs.serverCPUMax.text(maxServerCPU);
        }

        if(data && data.os_cpu)
        {
            //OS CPU
            panelGraphs.OSCPU = panelGraphs.OSCPU.concat(data.os_cpu);
            if (panelGraphs.OSCPU.length > panelGraphs.maxRecordsToShow) {
                var itemsToRemove = panelGraphs.OSCPU.length - panelGraphs.maxRecordsToShow;
                panelGraphs.OSCPU.remove(1, itemsToRemove);
                panelGraphs.OSCPU[0] = 0;
            }
            var maxCPU = 0;
            for (var i = panelGraphs.OSCPU.length - 1; i >= 0; i--) {
                if(parseInt(panelGraphs.OSCPU[i])>maxCPU)
                    maxCPU = panelGraphs.OSCPU[i];
            };
            panelGraphs.osCPUMax.text(maxCPU);
        }

        if(data && data.open_files)
        {
            //Open files
            panelGraphs.openFiles = panelGraphs.openFiles.concat(data.open_files);
            if (panelGraphs.openFiles.length > panelGraphs.maxRecordsToShow) {
                var itemsToRemove = panelGraphs.openFiles.length - panelGraphs.maxRecordsToShow;
                panelGraphs.openFiles.remove(1, itemsToRemove);
                panelGraphs.openFiles[0] = 0;
            }
            panelGraphs.maxOpenFiles = data.max_open_files[0];
        }

        // Now render graphs
        panelGraphs.renderGraphs(maxRam);
    }
};

panelGraphs.renderGraphs = function(maxRam) {
    if(!maxRam && panelGraphs.curMaxRam)
        maxRam = panelGraphs.curMaxRam;
    panelGraphs.curMaxRam = maxRam;
    var connections = panelGraphs.Connections;
    if(panelGraphs.connectionsUniqueCB.is(":checked")){
        connections = panelGraphs.ConnectionsUnique;
    }
    panelGraphs.outSpeedGraph.sparkline(panelGraphs.OutSpeed, {
        type: "line",
        lineColor: "#36363a",
        fillColor: "#ADAD85",
        tooltipOffsetY: -50
    }).unbind('sparklineRegionChange').bind('sparklineRegionChange', function(ev) {
        panelGraphs.outSpeedGraph.data("curRegion", ev);
        panelGraphs.showSpeedInfo(ev, "out");
    }).unbind('mouseleave').bind('mouseleave', function() {
        setTimeout(function(){
            panelGraphs.graphTip.hide();
        }, 600);
    });

    panelGraphs.inSpeedGraph.sparkline(panelGraphs.InSpeed, {
        type: "line",
        lineColor: "#999966",
        fillColor: "#ADAD85",
        tooltipOffsetY: -50
    }).unbind('sparklineRegionChange').bind('sparklineRegionChange', function(ev) {
        panelGraphs.inSpeedGraph.data("curRegion", ev);
        panelGraphs.showSpeedInfo(ev, "in");
    }).unbind('mouseleave').bind('mouseleave', function() {
        setTimeout(function(){
            panelGraphs.graphTip.hide();
        }, 600);
    });

    panelGraphs.connectionsGraph.sparkline(connections, {
        type: "line",
        height: panelGraphs.connectionsGraph.closest(".ui-dialog").length > 0 ? "150px" : "30px",
        lineColor: window.chartColors.green,
        fillColor: false,
        tooltipPrefix: "Connections:"
    });

    panelGraphs.speedGraph.sparkline(panelGraphs.OutSpeed, {
        type: "line",
        height: panelGraphs.speedGraph.closest(".ui-dialog").length > 0 ? "150px" : "30px",
        lineColor: window.chartColors.yellow,
        fillColor: false,
        tooltipOffsetY: -50,
        tooltipPrefix: "Out Speed:",
        numberFormatter: crushFTP.methods.formatBytes
    });

    panelGraphs.speedGraph.sparkline(panelGraphs.InSpeed, {
        type: "line",
        composite: true,
        height: panelGraphs.speedGraph.closest(".ui-dialog").length > 0 ? "150px" : "30px",
        lineColor: window.chartColors.blue,
        fillColor: false,
        tooltipOffsetY: -50,
        tooltipPrefix: "In Speed:",
        numberFormatter: crushFTP.methods.formatBytes
    }).unbind('sparklineRegionChange').bind('sparklineRegionChange', function(ev) {
        panelGraphs.speedGraph.data("curRegion", ev);
        panelGraphs.showSpeedInfo(ev, "both");
    }).unbind('mouseleave').bind('mouseleave', function() {
        setTimeout(function(){
            panelGraphs.graphTip.hide();
        }, 600);
        panelGraphs.graphTip.removeAttr("monitoring.down").removeAttr("monitoring.up");
    });

    panelGraphs.memoryGraph.sparkline(panelGraphs.RamUsed, {
        type: "line",
        height: panelGraphs.memoryGraph.closest(".ui-dialog").length > 0 ? "150px" : "30px",
        lineColor: window.chartColors.red,
        fillColor: false,
        chartRangeMax: maxRam,
        tooltipPrefix: "Used Memory:",
        numberFormatter: crushFTP.methods.formatBytes
    });

    panelGraphs.CPUGraph.sparkline(panelGraphs.ServerCPU, {
        type: "line",
        height: panelGraphs.CPUGraph.closest(".ui-dialog").length > 0 ? "150px" : "30px",
        lineColor: window.chartColors.orange,
        fillColor: false,
        chartRangeMin: 0,
        chartRangeMax: 100,
        chartRangeClip: true,
        tooltipPrefix: "Server CPU:",
        tooltipSuffix: "%"
    });

    panelGraphs.CPUGraph.sparkline(panelGraphs.OSCPU, {
        type: "line",
        height: panelGraphs.CPUGraph.closest(".ui-dialog").length > 0 ? "150px" : "30px",
        composite: true,
        lineColor: window.chartColors.green,
        fillColor: false,
        chartRangeMin: 0,
        chartRangeMax: 100,
        tooltipPrefix: "OS CPU:",
        tooltipSuffix: "%"
    });

     panelGraphs.memoryGraph.sparkline(panelGraphs.openFiles, {
        type: "line",
        height: "150px",
        composite: true,
        lineColor: window.chartColors.blue,
        fillColor: false,
        chartRangeMin: 0,
        chartRangeMax: panelGraphs.maxOpenFiles,
        tooltipPrefix: "Open Files:"
    });
};