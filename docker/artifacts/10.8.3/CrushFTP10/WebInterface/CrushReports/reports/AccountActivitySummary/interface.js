/*Report interface*/

crushReports.reports.AccountActivitySummary = function(data, tpl) {
    /*Get references from main file*/
    var config = crushReports.config;
    var isEmbed = crushReports.isEmbed;
    var utils = crushReports.utils;
    var XLSUtils = crushReports.XLSUtils;
    var getColorCode = crushReports.getColorCode;
    var getFileExtension = crushReports.getFileExtension;
    var getPerc = crushReports.getPerc;
    var loader = crushReports.loader;

    var icon = "fa-group";
    var title = "Account Activity Summary";
    var desc = "This report provides summary of accounts and their activities between selected period.";
    config.reportIcon.addClass(icon);
    config.reportTitle.text(title);
    config.reportDesc.text(desc);

    var content = $(tpl).find("#html-content").html();
    config.reportContent.empty().append(content);
    var template = $(tpl).find("#template").html();

    var x = $(data).find("results:first");

    var activities = $(x).find("summary_subitem");

    var dfs = utils.getDateFormat(x);
    var dateFormat = dfs.dateFormat;
    var dateFormatS = dfs.dateFormatS;
    var dateFormatT = dfs.dateFormatT;

    var paramsObj = $(x).find("paramsObj");
    if(paramsObj){
        dateFormat = paramsObj.find("log_date_format").text();
        if(dateFormat){
            dateFormat = dateFormat.replace(/dd/i, "DD");
            dateFormat = dateFormat.replace(/.SSS/i, "");
        }
        dateFormatS = dateFormat.split(" ")[0];
        dateFormatT = dateFormat.split(" ").pop();
    }

    function processData(_data) {
        var users = {},
            ips = {},
            longestDuration = 0,
            longestDurationFormatted = "",
            longestDurationUser = "",
            longestDurationDate = "",
            mostUplaods = 0,
            mostUploadsDate = "",
            mostDownloads = 0,
            mostDownloadsDate = "",
            mostDeletes = 0,
            mostDeletesDate = "",
            mostRenames = 0,
            mostRenamesDate = "",
            totalItems = 0,
            totalUploads = 0,
            totalDownloads = 0,
            totalUploadsCount = 0,
            totalDownloadsCount = 0,
            totalDelete = 0,
            totalRename = 0,
            dates = {},
            records = [];
        $(_data).each(function() {
            var start = $(this).find("start:first").text();
            var downloadCount = parseInt($(this).find("downloadCount:first").text());
            var renameCount = parseInt($(this).find("renameCount:first").text());
            var deleteCount = parseInt($(this).find("deleteCount:first").text());
            var uploadBytes = parseInt($(this).find("uploadBytes:first").text());
            var duration = crushFTPTools.xmlEncode($(this).find("duration:first").text());
            var end = crushFTPTools.xmlEncode($(this).find("end:first").text());
            var username = crushFTPTools.xmlEncode($(this).find("username:first").text());
            var durationRaw = parseInt($(this).find("durationRaw:first").text());
            var downloadBytes = parseInt($(this).find("downloadBytes:first").text());
            var ip = crushFTPTools.xmlEncode($(this).find("ip:first").text());
            var protocol = crushFTPTools.xmlEncode($(this).find("protocol:first").text());
            var port = crushFTPTools.xmlEncode($(this).find("server_port:first").text());
            var uploadCount = parseInt($(this).find("uploadCount:first").text());

            totalItems++;
            totalUploadsCount += uploadCount;
            totalDownloadsCount += downloadCount;
            totalUploads += uploadBytes;
            totalDownloads += downloadBytes;
            totalDelete += deleteCount;
            totalRename += renameCount;

            users[username] = users[username] || 0;
            users[username]++;

            ips[ip] = ips[ip] || 0;
            ips[ip]++;

            if (durationRaw > longestDuration) {
                longestDuration = durationRaw;
                longestDurationFormatted = duration;
                longestDurationDate = start;
                longestDurationUser = username;
            }
            if (uploadBytes > mostUplaods) {
                mostUplaods = uploadBytes;
                mostUploadsDate = start;
            }
            if (downloadBytes > mostDownloads) {
                mostDownloads = downloadBytes;
                mostDownloadsDate = start;
            }
            if (deleteCount > mostDeletes) {
                mostDeletes = deleteCount;
                mostDeletesDate = start;
            }
            if (renameCount > mostRenames) {
                mostRenames = renameCount;
                mostRenamesDate = start;
            }

            var singleDate = start.split(" ")[0];
            if (!dates[singleDate]) {
                dates[singleDate] = {
                    delete: deleteCount,
                    download: downloadCount,
                    rename: renameCount,
                    upload: uploadCount
                };
            } else {
                dates[singleDate].delete += deleteCount;
                dates[singleDate].download += downloadCount;
                dates[singleDate].rename += renameCount;
                dates[singleDate].upload += uploadCount;
            }

            records.push({
                start: start,
                downloadCount: downloadCount,
                renameCount: renameCount,
                deleteCount: deleteCount,
                uploadBytes: uploadBytes,
                duration: duration,
                end: end,
                username: username,
                durationRaw: durationRaw,
                downloadBytes: downloadBytes,
                ip: ip,
                port: port,
                protocol: protocol,
                uploadCount: uploadCount
            });
        });
        var mostActiveUser, mostActiveUserCount = 0,
            mostActiveIP, mostActiveIPCount = 0;
        for (var user in users) {
            if (users[user] > mostActiveUserCount) {
                mostActiveUserCount = users[user];
                mostActiveUser = user;
            }
        }
        for (var ip in ips) {
            if (ips[ip] > mostActiveIPCount) {
                mostActiveIPCount = ips[ip];
                mostActiveIP = ip;
            }
        }
        return {
            users: users,
            ips: ips,
            longestDuration: longestDuration || "-",
            longestDurationFormatted: longestDurationFormatted || "-",
            longestDurationUser: longestDurationUser || "-",
            longestDurationDate: longestDurationDate || "-",
            mostUplaods: mostUplaods || "-",
            mostUploadsDate: mostUploadsDate || "-",
            mostDownloads: mostDownloads || "-",
            mostDownloadsDate: mostDownloadsDate || "-",
            mostDeletes: mostDeletes || "-",
            mostDeletesDate: mostDeletesDate || "-",
            mostRenames: mostRenames || "-",
            mostRenamesDate: mostRenamesDate || "-",
            totalItems: totalItems,
            totalUploads: totalUploads,
            totalDownloads: totalDownloads,
            totalUploadsCount: totalUploadsCount,
            totalDownloadsCount: totalDownloadsCount,
            totalDelete: totalDelete,
            totalRename: totalRename,
            dates: dates,
            records: records,
            mostActiveUser: mostActiveUser || "-",
            mostActiveUserCount: mostActiveUserCount || "-",
            mostActiveIP: mostActiveIP || "-",
            mostActiveIPCount: mostActiveIPCount || "-"
        }
    };

    var activityData = processData(activities);
    var panel = config.reportContent;

    /*Stats*/
    var startDate = $(x).find("startDate:first").text().split(" ")[0];
    var endDate = $(x).find("endDate:first").text().split(" ")[0];
    var stats = panel.find(".graph-stats");
    stats.find(".start-date").text(utils.getDate(startDate, dateFormatS, ""));
    stats.find(".end-date").text(utils.getDate(endDate, dateFormatS, ""));

    stats.find(".total-stat-count").text(activityData.totalItems);
    stats.find(".most-active-user").text(activityData.mostActiveUser);
    stats.find(".most-active-count").text(activityData.mostActiveUserCount);
    stats.find(".most-active-ip").text(activityData.mostActiveIP);
    stats.find(".most-active-ip-count").text(activityData.mostActiveIPCount);
    stats.find(".longest-duration").text(activityData.longestDurationFormatted);
    stats.find(".longest-duration-user").text(activityData.longestDurationUser);
    if(activityData.longestDurationDate == "-")
        stats.find(".longest-duration-date").text(activityData.longestDurationDate);
    else
        stats.find(".longest-duration-date").text(utils.getDate(activityData.longestDurationDate, dateFormat));
    stats.find(".most-uploads").text(utils.formatBytes(activityData.mostUplaods));

    if(activityData.mostUploadsDate == "-")
        stats.find(".most-uploads-date").text(activityData.mostUploadsDate);
    else
        stats.find(".most-uploads-date").text(utils.getDate(activityData.mostUploadsDate, dateFormat));
    stats.find(".most-downloads").text(utils.formatBytes(activityData.mostDownloads));

    if(activityData.mostDownloadsDate == "-")
        stats.find(".most-downloads-date").text(activityData.mostDownloadsDate);
    else
        stats.find(".most-downloads-date").text(utils.getDate(activityData.mostDownloadsDate, dateFormat));
    stats.find(".most-deleted").text(activityData.mostDeletes);

    if(activityData.mostDeletesDate == "-")
        stats.find(".most-deleted-date").text(activityData.mostDeletesDate);
    else
        stats.find(".most-deleted-date").text(utils.getDate(activityData.mostDeletesDate, dateFormat));

    stats.find(".most-renamed").text(activityData.mostRenames);
    if(activityData.mostRenamesDate == "-")
        stats.find(".most-renamed-date").text(activityData.mostRenamesDate);
    else
        stats.find(".most-renamed-date").text(utils.getDate(activityData.mostRenamesDate, dateFormat));

    var tables = panel.find(".tables").empty();
    var activityContent = $(template.replace(/\$type/g, "activity"));
    tables.append(activityContent);

    var timeline = [];
    for (var date in activityData.dates) {
        var curDate = activityData.dates[date];
        timeline.push({
            period: date,
            delete: curDate.delete,
            download: curDate.download,
            rename: curDate.rename,
            upload: curDate.upload
        });
    };

    if (timeline.length == 0) {
        $('#activity_timeLine').hide().parent().find(".no-data").show();
    } else {
        var totalTimeline = Morris.Line({
            element: 'activity_timeLine',
            data: timeline,
            xkey: 'period',
            ykeys: ['delete', 'download', 'rename', 'upload'],
            labels: ['Deleted', 'Downloaded', 'Renamed', 'Uploaded'],
            lineColors: ["#cc0000", "#007acc", "#cc7a00", "#008000"],
            parseTime: true,
            resize: true
        });
    };

    /*By Users donut*/
    var userDonutData = [];
    var userDonutColors = [];
    for (var item in activityData.users) {
        var curItem = activityData.users[item];
        var perc = getPerc(curItem, activityData.totalItems);
        userDonutData.push({
            label: item,
            value: curItem,
            perc: perc
        });
        userDonutColors.push(getColorCode(perc));
    }
    var userDonut = Morris.Donut({
        element: 'usersDonut',
        data: userDonutData,
        formatter: function(x, data) {
            return data.perc + "%"
        },
        colors: userDonutColors,
        resize: true
    });
    if (userDonutColors.length == 0) {
        $('#usersDonut').hide().parent().find(".no-data").show();
    }

    var columns = [{
        "data": "username"
    }, {
        data : "protocol"
    }, {
        data : "ip",
    }, {
        data : "port"
    }, {
        "data": "start",
        "render": function(data, vis, row) {
            return utils.getDate(row.start, dateFormat) + " - " + utils.getDate(row.end, dateFormat);
        },
        "orderData": [8],
        "width": "20%"
    }, {
        "data": "duration",
        "orderData": [9]
    }, {
        "data": "uploadCount",
        "render": function(data, vis, row) {
            return data + " (" + utils.formatBytes(row.uploadBytes) + ")";
        },
        "orderData": [10]
    }, {
        "data": "downloadCount",
        "render": function(data, vis, row) {
            return data + " (" + utils.formatBytes(row.downloadBytes) + ")";
        },
        "orderData": [11]
    }, {
        "data": "deleteCount"
    }, {
        "data": "renameCount"
    }, {
        data: "start",
        visible: false
    }, {
        data: "durationRaw",
        visible: false
    }, {
        data: "uploadBytes",
        visible: false
    }, {
        data: "downloadBytes",
        visible: false
    }];
    var activityTable = $('#activity_dataRecord').find(".dataTable");
    var maxwidth = '150px';
    var activityTableDT = activityTable.DataTable({
        "language": {
            "emptyTable": "No data available"
        },
        data: activityData.records,
        fnRowCallback: function(nRow, aData, iDisplayIndex) {
            var x = nRow;
            $(x).find('td').each(function() {
                $(this).addClass('reports-td');
                $(this).css("max-width", maxwidth);
                $(this).attr("title", $(this).html().replace(/\<div>/g, " ").replace(/\<\/div>/g, " ").replace(/\<br>/g, " ").replace(/\<br\/>/g, " "));
            });
            return nRow;
        },
        "columns": columns,
        "order": [
            [8, 'asc']
        ]
    });

    var hasData = activityData.totalItems;
    if (hasData) {
        $('#exportAsXLS').unbind().click(function() {
            function Workbook() {
                if (!(this instanceof Workbook)) return new Workbook();
                this.SheetNames = [];
                this.Sheets = {};
            }
            var wb = new Workbook();
            /* add worksheet to  */
            function addType(data, type) {
                var sheetName = "" + type;
                if (!wb.SheetNames.has(sheetName))
                    wb.SheetNames.push(sheetName);
                var tableRecords = [];
                tableRecords.push(["Username", "Protocol", "IP", "Server Port", "Duration", "UploadCount", "UploadSize", "DownloadCount", "DownloadSize", "DeleteCount", "RenameCount", "SessionStartTime", "SessionEndTime"]);
                for (var i = 0; i < data.records.length; i++) {
                    var curFile = data.records[i];
                    var row = [];
                    row.push(crushFTPTools.decodeXML(curFile.username));
                    row.push(crushFTPTools.decodeXML(curFile.protocol));
                    row.push(crushFTPTools.decodeXML(curFile.ip));
                    row.push(crushFTPTools.decodeXML(curFile.port));
                    row.push(curFile.duration);
                    row.push(curFile.uploadCount);
                    row.push(curFile.uploadBytes);
                    row.push(curFile.downloadCount);
                    row.push(curFile.downloadBytes);
                    row.push(curFile.deleteCount);
                    row.push(curFile.renameCount);
                    row.push(utils.getDate(curFile.start, dateFormat));
                    row.push(utils.getDate(curFile.end, dateFormat));
                    tableRecords.push(row);
                };
                var ws = XLSUtils.sheetFromArrayOfArrays(tableRecords)
                wb.Sheets[sheetName] = ws;
            }
            addType(activityData, "Activities");
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
            }), "AccountActivitySummary.xlsx");
        });
    } else {
        $('.has-report-data').hide();
    }
}