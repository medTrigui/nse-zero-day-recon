/*Report interface file for report*/

crushReports.reports.AuditSummary = function(data, tpl) {
    /*Get references from main file*/
    var config = crushReports.config;
    var isEmbed = crushReports.isEmbed;
    var utils = crushReports.utils;
    var XLSUtils = crushReports.XLSUtils;
    var getColorCode = crushReports.getColorCode;
    var getFileExtension = crushReports.getFileExtension;
    var getPerc = crushReports.getPerc;
    var loader = crushReports.loader;
    var getTemplate = crushReports.getTemplate;

    var content = $(tpl).find("#html-content").html();
    config.reportContent.empty().append(content);
    var template = $(tpl).find("#template").html();
    var typeTemplate = $(tpl).find("#typeRecordsTemplate").html();
    var loginTemplate = $(tpl).find("#loginRecordsTemplate").html();

    var icon = "fa-search";
    var title = "Audit Summary";
    var desc = "This report provides information of actions made by users in selected date range.";
    config.reportIcon.addClass(icon);
    config.reportTitle.text(title);
    config.reportDesc.text(desc);

    var x = $(data).find("results:first");
    var data = [];
    var totalFiles = 0;
    var exts = {};
    var userDateTimeline = {};
    var totalDateTimeline = {
        dates: {}
    };
    var maxOnDate = {
        date: "",
        count: 0
    };
    var usersData = {};
    var deleteBytes = parseInt($(x).find("> deleteBytes").text());
    var userCount = parseInt($(x).find("> userCount").text());
    var downloadCount = parseInt($(x).find("> downloadCount").text());
    var uploadCount = parseInt($(x).find("> uploadCount").text());
    var downloadBytes = parseInt($(x).find("> downloadBytes").text());
    var uploadBytes = parseInt($(x).find("> uploadBytes").text());
    var deleteCount = parseInt($(x).find("> deleteCount").text());
    var renameCount = parseInt($(x).find("> renameCount").text());
    var loginCount = parseInt($(x).find("logins_subitem").length);

    var maxDownloadsSize = 0;
    var maxDownloadsUser = "";
    var maxUploadsSize = 0;
    var maxUploadsUser = "";
    var maxLogins = 0;
    var maxLoginUser = "";
    var maxRenames = 0;
    var maxRenamesUser = "";
    var maxDeletes = 0;
    var maxDeletesUser = "";

    var dfs = utils.getDateFormat(x);
    var dateFormat = dfs.dateFormat;
    var dateFormatS = dfs.dateFormatS;
    var dateFormatT = dfs.dateFormatT;

    var dates = {};
    $(x).find("summary > summary_subitem").each(function(index) {
        var curSummary = $(this);
        var userDates = {};
        function getFiles(type){
            var files = [];
            curSummary.find(type + "s_subitem").each(function(){
                var fileData = type == "login" ? {
                    username : $(this).find("username:first").text(),
                    date : $(this).find("date:first").text(),
                    ip : $(this).find("ip:first").text(),
                    port : $(this).find("server_port:first").text(),
                    protocol : $(this).find("protocol:first").text(),
                    size : 0,
                    success_login : $(this).find("success_login:first").text()
                } : {
                    username : $(this).find("username:first").text(),
                    url : $(this).find("url:first").text(),
                    name : $(this).find("name:first").text(),
                    date : $(this).find("date:first").text(),
                    size : parseInt($(this).find("size:first").text()),
                    speed : parseInt($(this).find("speed:first").text()),
                    path : $(this).find("path:first").text(),
                    ip : $(this).find("ip:first").text(),
                    port : $(this).find("server_port:first").text(),
                    protocol : $(this).find("protocol:first").text(),
                }
                var singleDate = fileData.date.split(" ")[0];
                if (!dates[singleDate]) {
                    dates[singleDate] = {
                        upload : {count:0, size:0},
                        download : {count:0, size:0},
                        rename : {count:0, size:0},
                        delete : {count:0, size:0},
                        login : {count:0, size:0}
                    };
                } else {
                    dates[singleDate][type].count++;
                    dates[singleDate][type].size += fileData.size;
                }
                if (!userDates[singleDate]) {
                    userDates[singleDate] = {
                        upload : {count:0, size:0},
                        download : {count:0, size:0},
                        rename : {count:0, size:0},
                        delete : {count:0, size:0},
                        login : {count:0, size:0}
                    };
                } else {
                    userDates[singleDate][type].count++;
                    userDates[singleDate][type].size += fileData.size;
                }
                files.push(fileData);
            });
            return files;
        };

        var auditData = {
            downloadCount : parseInt(curSummary.find("downloadCount:first").text()),
            renameCount : parseInt(curSummary.find("renameCount:first").text()),
            deleteCount : parseInt(curSummary.find("deleteCount:first").text()),
            uploadBytes : parseInt(curSummary.find("uploadBytes:first").text()),
            username : curSummary.find("username:first").text(),
            downloadBytes : parseInt(curSummary.find("downloadBytes:first").text()),
            deleteBytes : parseInt(curSummary.find("deleteBytes:first").text()),
            uploadCount : parseInt(curSummary.find("uploadCount:first").text()),
            loginCount : parseInt(curSummary.find("logins_subitem").length),
            userDates : userDates,
            uploads : getFiles("upload"),
            downloads : getFiles("download"),
            renames : getFiles("rename"),
            deletes : getFiles("delete"),
            logins : getFiles("login")
        };

        usersData[auditData.username] = auditData;
        if(auditData.uploadBytes > maxUploadsSize){
            maxUploadsSize = auditData.uploadBytes;
            maxUploadsUser = auditData.username;
        }
        if(auditData.downloadBytes > maxDownloadsSize){
            maxDownloadsSize = auditData.downloadBytes;
            maxDownloadsUser = auditData.username;
        }
        if(auditData.deleteCount > maxDeletes){
            maxDeletes = auditData.deleteCount;
            maxDeletesUser = auditData.username;
        }
        if(auditData.renameCount > maxRenames){
            maxRenames = auditData.renameCount;
            maxRenamesUser = auditData.username;
        }
        if(auditData.loginCount > maxLogins){
            maxLogins = auditData.loginCount;
            maxLoginUser = auditData.username;
        }
    });
    /*Action donut*/
    var donutData = [];
    var colors = [];
    var panel = config.reportContent;

    var totalActions = downloadCount + uploadCount + deleteCount + renameCount + loginCount;

    var perc = getPerc(downloadCount, totalActions);
    donutData.push({
        label: "Downloads",
        value: downloadCount,
        perc: perc
    });
    colors.push(getColorCode(perc));

    perc = getPerc(uploadCount, totalActions);
    donutData.push({
        label: "Uploads",
        value: uploadCount,
        perc: perc
    });
    colors.push(getColorCode(perc));

    perc = getPerc(deleteCount, totalActions);
    donutData.push({
        label: "Deletes",
        value: deleteCount,
        perc: perc
    });
    colors.push(getColorCode(perc));

    perc = getPerc(renameCount, totalActions);
    donutData.push({
        label: "Renames",
        value: renameCount,
        perc: perc
    });
    colors.push(getColorCode(perc));

    if (donutData.length == 0) {
        $('#actionDonut').hide().parent().find(".no-data").show();
    } else {
        var donut = Morris.Donut({
            element: 'actionDonut',
            data: donutData,
            formatter: function(x, data) {
                return "total " + x + " file(s) : ~" + data.perc + "%"
            },
            colors: colors,
            resize: true
        });
    }

    /*Stats*/
    var startDate = $(x).find("startDate:first").text().split(" ")[0];
    var endDate = $(x).find("endDate:first").text().split(" ")[0];
    var stats = panel.find(".graph-stats");
    stats.find(".start-date").text(utils.getDate(startDate, dateFormatS, ""));
    stats.find(".end-date").text(utils.getDate(endDate, dateFormatS, ""));
    stats.find(".total-downloaded-count").text(downloadCount);
    stats.find(".total-downloaded-size").text(utils.formatBytes(downloadBytes));
    stats.find(".total-uploaded-count").text(uploadCount);
    stats.find(".total-uploaded-size").text(utils.formatBytes(uploadBytes));
    stats.find(".total-deleted-count").text(deleteCount);
    stats.find(".total-renamed-count").text(renameCount);
    stats.find(".total-logins-count").text(loginCount);
    stats.find(".max-downloads-by").text(maxDownloadsUser);
    stats.find(".max-downloads-by-user-count").text(utils.formatBytes(maxDownloadsSize));
    stats.find(".max-downloads-by-perc").text(getPerc(maxDownloadsSize, downloadBytes));
    stats.find(".max-uploads-by").text(maxUploadsUser);
    stats.find(".max-uploads-by-user-count").text(utils.formatBytes(maxUploadsSize));
    stats.find(".max-uploads-by-perc").text(getPerc(maxUploadsSize, uploadBytes));
    stats.find(".max-deleted-by").text(maxDeletesUser);
    stats.find(".max-delete-by-user-count").text(maxDeletes);
    stats.find(".max-delete-by-perc").text(getPerc(maxDeletes, deleteCount));
    stats.find(".max-renamed-by").text(maxRenamesUser);
    stats.find(".max-rename-by-user-count").text(maxRenames);
    stats.find(".max-rename-by-perc").text(getPerc(maxRenames, renameCount));

    stats.find(".max-login-by").text(maxLoginUser);
    stats.find(".max-login-by-user-count").text(maxLogins);
    stats.find(".max-login-by-perc").text(getPerc(maxLogins, loginCount));

    /*Total timeline*/
    var timelineSize = [], timelineCount = [];
    for (var date in dates) {
        var curDate = dates[date];
        timelineSize.push({
            period: date,
            download: curDate.download.size,
            upload: curDate.upload.size,
            rename: curDate.rename.size,
            delete: curDate.delete.size
        });
        timelineCount.push({
            period: date,
            download: curDate.download.count,
            upload: curDate.upload.count,
            rename: curDate.rename.count,
            delete: curDate.delete.count,
            logins : curDate.login.count
        });
    };

    function showTimeline(type){
        $('#totalTimeLine').empty();
        if(type == "size"){
            if (timelineSize.length == 0) {
                $('#totalTimeLine').hide().parent().find(".no-data").show();
            } else {
                var totalTimeline = Morris.Line({
                    element: 'totalTimeLine',
                    data: timelineSize,
                    xkey: 'period',
                    ykeys: ['delete', 'download', 'rename', 'upload'],
                    labels: ['Deleted', 'Downloaded', 'Renamed', 'Uploaded'],
                    lineColors: ["#cc0000", "#007acc", "#cc7a00", "#008000"],
                    parseTime: true,
                    resize: true,
                    yLabelFormat: function(y) {
                        return utils.formatBytes(y);
                    }
                });
            };
        }
        else{
            if (timelineCount.length == 0) {
                $('#totalTimeLine').hide().parent().find(".no-data").show();
            } else {
                var totalTimeline = Morris.Line({
                    element: 'totalTimeLine',
                    data: timelineCount,
                    xkey: 'period',
                    ykeys: ['delete', 'download', 'rename', 'upload', 'logins'],
                    labels: ['Deleted', 'Downloaded', 'Renamed', 'Uploaded', 'Logins'],
                    lineColors: ["#cc0000", "#007acc", "#cc7a00", "#008000", "#ff9900"],
                    parseTime: true,
                    resize: true
                });
            };
        }
    }
    showTimeline("size");
    $('#showTimelineBySize,#showTimelineByCount').click(function(event) {
        if(!$(this).hasClass('active')){
            $('#showTimelineBySize,#showTimelineByCount').removeClass('active');
            $(this).addClass('active');
            showTimeline($(this).attr("type"));
        }
        return false;
    });

    var tables = panel.find(".tables").empty();
    var hasData = false;
    var actionLabel = "uploads";
    var i = 0;
    var showIP = utils.getConfig("showIPs_1", true);
    var showDate = utils.getConfig("showDates", true);
    var showSize = utils.getConfig("showSizes", true);
    var showPath = utils.getConfig("showPaths_2", true);
    var showUploads = utils.getConfig("showUploads", true);
    var showDownloads = utils.getConfig("showDownloads", true);
    var showDeletes = utils.getConfig("showDeletes", true);
    var showRenames = utils.getConfig("showRenames", true);
    var showLogins = utils.getConfig("showLogins_1", true);
    console.time("Rendering Graph");
    function showUserRecords(i, tl) {
        /*Total timeline*/
        var userTimelineSize = [], userTimelineCount = [];
        for (var date in curUser.userDates) {
            var curDate = curUser.userDates[date];
            userTimelineSize.push({
                period: date,
                download: curDate.download.size,
                upload: curDate.upload.size,
                rename: curDate.rename.size,
                delete: curDate.delete.size
            });
            userTimelineCount.push({
                period: date,
                download: curDate.download.count,
                upload: curDate.upload.count,
                rename: curDate.rename.count,
                delete: curDate.delete.count,
                logins : curDate.login.count
            });
        };
        function showUserTimeline(panelID, type){
            $('#'+panelID).empty();
            if(type == "size"){
                if (userTimelineSize.length == 0) {
                    $('#'+panelID).hide().parent().find(".no-data").show();
                } else {
                    var totalTimeline = Morris.Line({
                        element: ''+panelID,
                        data: userTimelineSize,
                        xkey: 'period',
                        ykeys: ['delete', 'download', 'rename', 'upload'],
                        labels: ['Deleted', 'Downloaded', 'Renamed', 'Uploaded'],
                        lineColors: ["#cc0000", "#007acc", "#cc7a00", "#008000"],
                        parseTime: true,
                        resize: true,
                        yLabelFormat: function(y) {
                            return utils.formatBytes(y);
                        }
                    });
                };
            }
            else{
                if (userTimelineCount.length == 0) {
                    $('#'+panelID).hide().parent().find(".no-data").show();
                } else {
                    var totalTimeline = Morris.Line({
                        element: ''+panelID,
                        data: userTimelineCount,
                        xkey: 'period',
                        ykeys: ['delete', 'download', 'rename', 'upload', 'logins'],
                        labels: ['Deleted', 'Downloaded', 'Renamed', 'Uploaded', 'Logins'],
                        lineColors: ["#cc0000", "#007acc", "#cc7a00", "#008000", '#ff9900'],
                        parseTime: true,
                        resize: true
                    });
                };
            }
        }
        var panelID = "user"+ i +"_timeLine";
        setTimeout(function(){
            showUserTimeline(panelID, "size");
        }, 100);
        var userPanel = $("#user"+i+"_table");
        $('.timeline-switch', userPanel).click(function(event) {
            if(!$(this).hasClass('active')){
                $('.timeline-switch', userPanel).removeClass('active');
                $(this).addClass('active');
                showUserTimeline(panelID, $(this).attr("type"));
            }
            return false;
        });
        var columns = [ {
            data : "protocol"
        },{
            data : "ip",
            visible : showIP
        }, {
            data : "port"
        }, {
            data : "name"
        }, {
            "data": "date",
            "render": function(data) {
                return utils.getDate(data, dateFormat);
            },
            "orderData": [7],
            visible : showDate
        }, {
            "data": "size",
            "render": function(data) {
                return utils.formatBytes(data);
            },
            "orderData": [8],
            visible : showSize
        }, {
            "data": "speed",
            "render": function(data) {
                return utils.formatBytes(data) + "/s";
            },
            "orderData": [9]
        }, {
            data : "path",
            visible : showPath
        }, {
            data : "url"
        }, {
            data : "date",
            visible : false
        }, {
            data : "size",
            visible : false
        }, {
            data : "speed",
            visible : false
        }];

        var loginColumns = [ {
            data : "protocol",
            visible : false
        },{
            data : "ip"
        }, {
            data : "port",
            visible : false
        }, {
            data : "username"
        }, {
            "data": "success_login",
            "render": function(data) {
                if(data == "true"){
                    return "Successful";
                }
                return "Failed";
            }
        }, {
            "data": "date",
            "render": function(data) {
                return utils.getDate(data, dateFormat);
            },
            "orderData": [4]
        }, {
            data : "date",
            visible : false
        }];
        var maxwidth = '150px';
        var userTables = $('#user' + i + '_dataRecord');
        function showRecords(type){
            var icon = type == "uploads" ? "fa-upload" : type == "downloads" ? "fa-download" : type == "renames" ? "fa-edit" : type == "deletes" ? "fa-trash-o" : "fa-user";
            var tmp = type == "logins" ? loginTemplate : typeTemplate;
            var typeData = $(tmp.replace(/\$id/g, i).replace(/\$username/g, username).replace(/\$type/g, type).replace(/\$icon/g, icon));
            var elem = userTables.append(typeData);
            elem.find(".notice").hide();
            if(curUser[type].length>0){
                var table = $('#' + type + i + '_table').find(".dataTable").DataTable({
                    "language": {
                        "emptyTable": "No data available"
                    },
                    data: curUser[type],
                    fnRowCallback: function(nRow, aData, iDisplayIndex) {
                        var x = nRow;
                        $(x).find('td').each(function() {
                            $(this).addClass('reports-td');
                            $(this).css("max-width", maxwidth);
                            $(this).attr("title", $(this).html().replace(/\<div>/g, " ").replace(/\<\/div>/g, " ").replace(/\<br>/g, " ").replace(/\<br\/>/g, " "));
                        });
                        return nRow;
                    },
                    "columns": type == "logins" ? loginColumns : columns,
                    "order": [
                        [0, 'desc']
                    ]
                });
                setTimeout(function(){
                    table.draw();
                }, 500);
                if(curUser[type].length>999)
                    elem.find(".notice").show();
            }
        }
        if(showUploads)
            showRecords("uploads");
        if(showDownloads)
            showRecords("downloads");
        if(showRenames)
            showRecords("renames");
        if(showDeletes)
            showRecords("deletes");
        if(showLogins)
            showRecords("logins");

    }
    for(var user in usersData)
    {
        i++;
        hasData = true;
        var curUser = usersData[user];
        var username = curUser.username;
        var userData = $(template.replace(/\$id/g, i).replace(/\$username/g, username));
        tables.append(userData);
        var curUserTimeline = {};
        (function(i, tl){setTimeout(showUserRecords(i, tl), 0);})(i, curUserTimeline);
    }
    console.timeEnd("Rendering Graph");

    if (hasData) {
        $('#exportAsXLS').unbind().click(function() {
            function Workbook() {
                if (!(this instanceof Workbook)) return new Workbook();
                this.SheetNames = [];
                this.Sheets = {};
            }
            var wb = new Workbook();
            /* add worksheet to workbook */
            function addUser(sheetName, data) {
                if (!wb.SheetNames.has(sheetName))
                    wb.SheetNames.push(sheetName);
                var tableRecords = [];
                var defaultRow = ["Type", "Protocol", "IP", "Server Port", "Username", "Date", "Size", "Speed", "Path", "URL"];
                tableRecords.push(defaultRow);
                function addToSheetByType(_type){
                    var type = _type.toLowerCase();
                    for (var i = 0; i < data[type].length; i++) {
                        var curFile = data[type][i];
                        var date = utils.getDate(curFile.date, dateFormat);
                        var row = [];
                        if(type == "logins"){
                            row.push(type);
                            row.push(curFile.protocol);
                            row.push(curFile.ip);
                            row.push(curFile.port);
                            row.push(curFile.username);
                            row.push(date);
                            row.push("");
                            row.push("");
                            row.push("");
                            row.push("");
                            tableRecords.push(row);
                        }
                        else{
                            row.push(type);
                            row.push(curFile.protocol);
                            row.push(curFile.ip);
                            row.push(curFile.port);
                            row.push(curFile.username);
                            row.push(date);
                            row.push(curFile.size);
                            row.push(curFile.speed);
                            row.push(curFile.path);
                            row.push(curFile.url);
                            tableRecords.push(row);
                        }
                    };
                }
                if(showUploads)
                    addToSheetByType("Uploads");
                if(showDownloads)
                    addToSheetByType("Downloads");
                if(showDeletes)
                    addToSheetByType("Deletes");
                if(showRenames)
                    addToSheetByType("Renames");
                if(showLogins)
                    addToSheetByType("Logins");
                var ws = XLSUtils.sheetFromArrayOfArrays(tableRecords)
                wb.Sheets[sheetName] = ws;
            }

            for(var user in usersData){
                addUser(user, usersData[user]);
            }

            var wbout = XLSX.write(wb, {
                bookType: 'xlsx',
                bookSST: true,
                type: 'binary'
            });

            function s2ab(s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }
            saveAs(new Blob([s2ab(wbout)], {
                type: "application/octet-stream"
            }), "AuditSummary.xlsx");
        });
    } else {
        $('.has-report-data').hide();
    }
}