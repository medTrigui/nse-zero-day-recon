/*Crush Reports*/
var crushReports = (function($) {
    //Constants
    var config = {
        params: window.location.search.replace("?parameters=", ""),
        isInIFrame: function() {
            try {
                return window.self !== window.top;
            } catch (e) {
                return true;
            }
        },
        colorCodes: { //This colors will be used in charts to show stats
            q1: "#5cb85c", //Items which contribute between 0-25%
            q2: "#5bc0de", //25-50%
            q3: "#f0ad4e", //50-70%
            q4: "#d9534f" //70% and more
        }
    };

    //Flag to know if reports are loaded inside an iframe
    var isEmbed = config.isInIFrame();

    if (isEmbed) {
        setTimeout(function() {
            window.parent.panelReportsSetup.reportFrameResizer();
        }, 2000);
    }

    function getCrushAuth(){
        return $.cookie("currentAuth");
    }

    function getUserName(callBack){
        var obj = {
            command: "getUsername",
            random: Math.random(),
            c2f: getCrushAuth()
        }; /* Make a call and receive list */
        var username = "anonymous";
        $.ajax({
            type: "GET",
            url: "/WebInterface/function/",
            data: obj,
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                callBack(false);
            },
            success: function(msg) {
                var responseText = msg;
                try {
                    var response = $(msg).find("response").text();
                    if (response == "success") {
                        username = $(msg).find("username").text();
                    }
                    if (username == "anonymous" || username == "") {
                        callBack(false);
                        return false;
                    }
                } catch (ex) {
                    if (callBack) {
                        callBack(false);
                        return false;
                    }
                }
                if (callBack) {
                    callBack(true, username);
                }
            }
        });
    }

    function getUserInfo(callBack){
        var obj = {
            command: "getUserInfo",
            random: Math.random(),
            c2f: getCrushAuth()
        };
        $.ajax({
            type: "POST",
            url: "/WebInterface/function/",
            data: obj,
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                callBack(false);
            },
            success: function(msg) {
                if (callBack) {
                    callBack(msg);
                }
            }
        });
    }

    var utils = {
        getDate: function(date, format, fOD){
            if(!date)return "";
            fOD = typeof fOD === "undefined" ? "YYYY-MM-DD HH:mm:ss" : fOD;
            return utils.correctTimezone(moment(date, fOD), format);
        },
        getDateFormat: function(x){
            var dateFormat, dateFormatS = "MM/DD/YYYY", dateFormatT = "hh:mm:ss A";
            var paramsObj = $(x).find("paramsObj");
            if(paramsObj){
                dateFormat = paramsObj.find("log_date_format").text();
                dateFormat = dateFormat.replace("yyyy","yy").replace("yyyy","yy").replace("YYYY","yy").replace("AA","A").replace("aa","a").replace("_"," ")
                if(dateFormat){
                    dateFormat = dateFormat.replace(/dd/i, "DD");
                    dateFormat = dateFormat.replace(/.SSS/i, "");
                }
                dateFormatS = dateFormat.split(" ")[0];
                dateFormatT = dateFormat.split(" ").pop();
            }
            return {
                dateFormat: dateFormat,
                dateFormatS: dateFormatS,
                dateFormatT: dateFormatT
            }
        },
        formatBytes: function(bytes) {
            if ((bytes / 1024).toFixed(0) == 0) return bytes + " bytes";
            else if ((bytes / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024).toFixed(1) + " KB";
            else if ((bytes / 1024 / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024 / 1024).toFixed(1) + " MB";
            else if ((bytes / 1024 / 1024 / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024 / 1024 / 1024).toFixed(1) + " GB";
            else if ((bytes / 1024 / 1024 / 1024 / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024 / 1024 / 1024 / 1024).toFixed(1) + " TB";
        },
        correctTimezone: function(date, format) {
            if(!date)
                return date;
            if(typeof date == "string")
                return date;
            format = format || "MM/DD/YYYY hh:mm:ss A";
            if(crushReports.config.timezone_offset){
                return moment(date).utcOffset(crushReports.config.timezone_offset).format(format);
            }
            return moment(date).format(format);
        },
        formatTime: function(secs) {
            var remaining = "";
            if (!secs) return "";
            if (secs.indexOf(".") < 0)
                secs = secs + ".0";
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
        },
        getConfig: function(name, defaultVal) {
            if (!isEmbed)
                return defaultVal || true;
            return $(parent.document).find("#reportConfiguration").find(".reportConfig:visible").find("#" + name).is(":checked");
        },
        deparam: function(query) {
            var pairs, i, keyValuePair, key, value, map = {};
            // remove leading question mark if its there
            if (query.slice(0, 1) === '?') {
                query = query.slice(1);
            }
            if (query !== '') {
                pairs = query.split('&');
                for (i = 0; i < pairs.length; i += 1) {
                    keyValuePair = pairs[i].split('=');
                    key = crushFTPTools.textEncode(decodeURIComponent(keyValuePair[0]));
                    value = (keyValuePair.length > 1) ? decodeURIComponent(keyValuePair[1]) : undefined;
                    map[key] = crushFTPTools.textEncode(value);
                }
            }
            return map;
        }
    };

    var XLSUtils = {
        datenum: function(v, date1904) {
            if (date1904) v += 1462;
            var epoch = Date.parse(v);
            return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
        },
        sheetFromArrayOfArrays: function(data, opts) {
            var that = this;
            var ws = {};
            var range = {
                s: {
                    c: 10000000,
                    r: 10000000
                },
                e: {
                    c: 0,
                    r: 0
                }
            };
            for (var R = 0; R != data.length; ++R) {
                for (var C = 0; C != data[R].length; ++C) {
                    if (range.s.r > R) range.s.r = R;
                    if (range.s.c > C) range.s.c = C;
                    if (range.e.r < R) range.e.r = R;
                    if (range.e.c < C) range.e.c = C;
                    var cell = {
                        v: data[R][C]
                    };
                    if (cell.v == null) continue;
                    var cell_ref = XLSX.utils.encode_cell({
                        c: C,
                        r: R
                    });
                    if (typeof cell.v === 'number') cell.t = 'n';
                    else if (typeof cell.v === 'boolean') cell.t = 'b';
                    else if (cell.v instanceof Date) {
                        cell.t = 'n';
                        cell.z = XLSX.SSF._table[14];
                        cell.v = that.datenum(cell.v);
                    } else cell.t = 's';
                    ws[cell_ref] = cell;
                }
            }
            if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
            return ws;
        }
    };

    function getColorCode(perc) {
        if (perc < 25)
            return config.colorCodes.q1;
        else if (perc < 50)
            return config.colorCodes.q2;
        if (perc < 70)
            return config.colorCodes.q3;
        else
            return config.colorCodes.q4;
    };

    function getFileExtension(filename) {
        var ext = /^.+\.([^.]+)$/.exec(filename);
        return ext == null ? "" : ext[1].toLowerCase();
    };

    function getPerc(val, total) {
        if (total == 0)
            return 100;
        return Math.round((100 * val) / total);
    };

    //Methods for showing loading indicator on the page
    var loader = {
        init: function() {
            if ($("#loadingIndicator").length == 0)
                $("body").append("<div id='loadingIndicator'></div>");
            $("#loadingIndicator").dialog({
                autoOpen: false,
                dialogClass: "loadingIndicatorWindow",
                closeOnEscape: false,
                draggable: false,
                width: 220,
                minHeight: 50,
                modal: true,
                buttons: {},
                resizable: false,
                open: function(evt, ui) {
                    $('body').css('overflow', 'hidden');
                    $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
                },
                close: function() {
                    $('body').css('overflow', 'auto');
                }
            });
        },
        show: function(msg) {
            msg = msg || "Please wait...";
            $("#loadingIndicator").html('<i class="fa fa-spinner fa-spin margin-hor-20"></i> ' + msg);
            $("#loadingIndicator").dialog('open');
        },
        hide: function() {
            $("#loadingIndicator").dialog('close');
        }
    };

    //Show report parameters on the UI
    function showParameters(xml) {
        var parametersStr = $(xml).find("results > params").text().slice(1, -1)
        var paraarray = parametersStr.split(",");
        var parametersDivRenderStr = "";
        for (var i = 0; i < paraarray.length; i++) {
            var para1 = paraarray[i].split("=")[0].toLowerCase().trim();
            if (para1 != 'c2f' && para1 != 'instance' && para1 != 'reportname' && para1 != 'command' && para1 != 'export') {
                parametersDivRenderStr += ('<div class="row list-group-item"><div class="text-right col-sm-3 col-md-3"><strong>' + crushFTPTools.textEncode(paraarray[i].split("=")[0]) + '</strong></div><div class="col-sm-9 col-md-9">' + crushFTPTools.textEncode(paraarray[i].split("=")[1]) + '</div></div>');
            }
        }
        config.parametersList.find(".list-group").empty().append(parametersDivRenderStr);
    }

    //Generate report by making server call to run report based on selected parameters
    function generateReport() {
        loader.show();
        var params = utils.deparam(config.params);
        var url = "/WebInterface/function/?command=runReport&" + config.params;
        if(!params.c2f){
            url += "&c2f=" + getCrushAuth();
        }
        console.log("Report:" + config.params);
        var name = ($.trim(params.reportName));
        getTemplate(name, function(tpl) {
            console.log("Report:" + name);
            if (reports[name]) {
                loader.show("Getting Report Data...");
                console.log("Report:" + name + " getting data");
                $.ajax({
                    type: "GET",
                    async: "true",
                    url: url,
                    dataType: "xml",
                    contentType: "text/xml; charset=\"utf-8\""
                }).then(function(xml) {
                    //Success
                    console.log("Report:" + name + " data recieved");
                    loader.hide();
                    showParameters(xml);
                    reports[name](xml, tpl);
                    setTimeout(function(){
                        var startTime = window.reportStartTime;
                        if(startTime){
                            var curTime = new Date().getTime();
                            var diff = (curTime - startTime) / 1000;
                            var diffText = utils.formatTime(diff + "");
                            $('#timeTaken').show().find(".time-taken").text(diffText);
                        }
                    }, 1000);
                }, function(error) {
                    //Failure
                    $.bootstrapGrowl("No data available for report <strong>'" + params.reportName + "'</strong> for applied filters.", {
                        type: 'danger',
                        width: 400,
                        delay: 5000,
                        allow_dismiss: true
                    });
                    var name = (params.reportName);
                    if (reports[name]) {
                        getTemplate(name, function(tpl) {
                            showParameters(params);
                            reports[name]("<xml></xml>", tpl);
                        });
                    } else {
                        $.bootstrapGrowl("The report <strong>'" + name + "'</strong> is not yet configured.", {
                            type: 'danger',
                            width: 400,
                            delay: 5000,
                            allow_dismiss: true
                        });
                    }
                    setTimeout(function(){
                        loader.hide();
                    }, 1000);
                });
            } else {
                $.bootstrapGrowl("The report <strong>'" + name + "'</strong> is not yet configured.", {
                    type: 'danger',
                    width: 400,
                    delay: 5000,
                    allow_dismiss: true
                });
            }
        });
    };

    var getTemplate = function(name, cb) {
        var holder = $("<div></div>");
        loader.show("Loading report...");
        $.getScript("reports/" + name + "/interface.js", function(){
            console.log("Report:" + name + ", js loaded");
            var isTemplateLoaded = false;
            if(crushReports.isLoadingScript){
                crushReports.callbackOnReady = function(){
                    if(isTemplateLoaded){
                        setTimeout(function(){
                            cb(holder);
                            delete crushReports.callbackOnReady;
                        }, 100);
                    }
                }
            }
            loader.show("Loading report data...");
            var templatePath = crushReports.reports[name + "TemplateFolder"] || name;
            holder.load("reports/" + templatePath + "/template.html", function() {
                console.log("Report:" + name + ", template/html loaded");
                loader.show("Generating Report...");
                if(!crushReports.callbackOnReady){
                    console.log("Report:" + name + ", using custom callback");
                    cb(holder);
                }
                else{
                    setTimeout(function(){
                        crushReports.callbackOnReady();
                        cb(holder);
                    }, 100);
                    console.log("Report:" + name + ", using callbackOnReady");
                }
            });
        }).fail(function(){
            loader.hide();
            $.bootstrapGrowl("The report <strong>'" + name + "'</strong> is not yet configured.", {
                type: 'danger',
                width: 400,
                delay: 5000,
                allow_dismiss: true
            });
        });
    };

    //Contains methods for each report
    var reports = {

    };

    function processReportInfo(xml) {}

    function init() {
        // Check if specified array has item
        Array.prototype.has = function(value) {
            var i;
            for (var i = 0, loopCnt = this.length; i < loopCnt; i++) {
                if (this[i] === value) {
                    return true;
                }
            }
            return false;
        };

        var paramsArr = utils.deparam(config.params);
        loader.init();
        loader.show();
        getUserName(function(validLogin){
            if(!validLogin){
                var path = "/WebInterface/CrushReports/index.html?parameters=" + config.params;
                window.location = "/WebInterface/login.html?link="+ encodeURI(path);
                return false;
            }
            else{
                getUserInfo(function(data){
                    loader.hide();
                    if(data){
                        config.timezone_offset = $(data).find("timezone_offset").text() || "";
                        if(config.timezone_offset){
                            config.timezone_offset = parseFloat(config.timezone_offset);
                            config.timezone_offset *= 60;
                        }
                        //Default options for datatables
                        $.extend(true, $.fn.dataTable.defaults, {
                            deferRender: true,
                            scrollY: 500,
                            sScrollY: 500,
                            bScrollInfinite: true,
                            scrollCollapse: true,
                            scroller: true,
                            searchHighlight: true,
                            iDisplayLength: 50,
                            "dom": 'Zlfrtip',
                            "colResize": {
                                "handleWidth": 10
                            },
                            responsive : false,
                            "autoWidth": false
                        });

                        config.reportIcon = $('#reportIcon');
                        config.reportTitle = $('#reportTitle');
                        config.reportDesc = $('#reportDesc');
                        config.parametersList = $('#parametersList');
                        config.reportContent = $('#reportContent');
                        if(isEmbed){
                            $('#openInNewTab').click(function(){
                                window.open(window.location);
                                return false;
                            }).parent().show();
                        }
                        generateReport();
                    }
                })
            }
        });
    }

    function getTimestamp(d, format){
        if(d){
            format = format || "YYYY-MM-DD HH:mm:ss";
            var value = moment(d, format).valueOf();
            if(isNaN(value))
                value = moment(d).valueOf();
            return value;
        }
        else
            return d;
    }

    function formatDate(d, isTS){
        if(d){
            if(isTS)
                return utils.correctTimezone(moment(d).format("MM/DD/YYYY hh:mm:ss A"));
            else
                return utils.correctTimezone(moment(d, "YYYY-MM-DD HH:mm:ss").format("MM/DD/YYYY hh:mm:ss A"));
        }
        else
            return d;
    }

    return {
        reports : reports,
        config : config,
        isEmbed : isEmbed,
        utils : utils,
        XLSUtils : XLSUtils,
        getColorCode : getColorCode,
        getFileExtension : getFileExtension,
        getPerc : getPerc,
        loader : loader,
        showParameters : showParameters,
        generateReport : generateReport,
        getTemplate : getTemplate,
        processReportInfo : processReportInfo,
        init : init,
        getTimestamp: getTimestamp,
        formatDate: formatDate
    };
})(jQuery);

$(document).ready(function() {
    $.support.transition = false;
    crushReports.init();
});