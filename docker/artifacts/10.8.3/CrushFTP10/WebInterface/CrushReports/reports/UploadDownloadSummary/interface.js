/*Report interface*/

crushReports.reports.UploadDownloadSummary = function(data, tpl) {
    /*Get references from main file*/
    var config = crushReports.config;
    var isEmbed = crushReports.isEmbed;
    var utils = crushReports.utils;
    var XLSUtils = crushReports.XLSUtils;
    var getColorCode = crushReports.getColorCode;
    var getFileExtension = crushReports.getFileExtension;
    var getPerc = crushReports.getPerc;
    var loader = crushReports.loader;

    var icon = "fa-exchange rotate-90";
    var title = "Upload Downloaded Summary";
    var desc = "This report provides summary of upload and download made between selected period.";
    config.reportIcon.addClass(icon);
    config.reportTitle.text(title);
    config.reportDesc.text(desc);

    var content = $(tpl).find("#html-content").html();
    config.reportContent.empty().append(content);
    var template = $(tpl).find("#template").html();
    var userWiseTemplate = $(tpl).find("#userWiseTable").html();

    var x = $(data).find("results:first");

    var dfs = utils.getDateFormat(x);
    var dateFormat = dfs.dateFormat;
    var dateFormatS = dfs.dateFormatS;
    var dateFormatT = dfs.dateFormatT;

    var uploads = $(x).find("uploads_subitem");
    var totalUploads = uploads.length;
    var totalUploadSize = 0;
    var uploadExts = {};
    var uploadFiles = [];

    var downloads = $(x).find("downloads_subitem");
    var totalDownloads = downloads.length;
    var totalDownloadSize = 0;
    var downloadExts = {};
    var downloadFiles = [];

    function processData(_data) {
        var total = 0,
            files = [],
            exts = {},
            users = {},
            ips = {},
            largestSize = 0,
            largestFile = "",
            dates = {};
        $(_data).each(function() {
            total += parseInt($(this).find("size:first").text());
            var name = $(this).find("name:first").text();
            var user = $(this).find("username:first").text();
            var ip = $(this).find("ip:first").text();
            var date = $(this).find("date:first").text();
            var size = parseInt($(this).find("size:first").text());
            var path = $(this).find("path:first").text();
            var url = $(this).find("url:first").text();
            var speed = parseInt($(this).find("speed:first").text());

            if (size > largestSize) {
                largestSize = size;
                largestFile = name;
            }
            var curFile = {
                name: crushFTPTools.xmlEncode(name),
                username: crushFTPTools.xmlEncode(user),
                ip: crushFTPTools.xmlEncode(ip),
                date: date,
                size: size,
                path: crushFTPTools.xmlEncode(path),
                url: crushFTPTools.xmlEncode(url),
                speed: speed
            };
            files.push(curFile);
            var ext = getFileExtension(name);
            if (!exts[ext]) {
                exts[ext] = 1;
            } else {
                exts[ext] += 1;
            }

            if (!users[user]) {
                users[user] = {
                    count: 1,
                    size: size,
                    files: [curFile]
                };
            } else {
                users[user].count++;
                users[user].size += size;
                users[user].files.push(curFile);
            }

            if (!ips[ip]) {
                ips[ip] = {
                    count: 1,
                    size: size
                };
            } else {
                ips[ip].count++;
                ips[ip].size += size;
            }

            var singleDate = date.split(" ")[0];
            if (!dates[singleDate]) {
                var item = {};
                item[name] = 1;
                dates[singleDate] = {
                    count: 1,
                    size: size
                };
            } else {
                dates[singleDate].count++;
                dates[singleDate].size += size;
            }
        });

        return {
            totalCount: _data.length,
            total: total,
            totalFormatted: utils.formatBytes(parseInt(total)),
            files: files,
            exts: exts,
            users: users,
            ips: ips,
            largestSize: utils.formatBytes(largestSize) || "-",
            largestFile: largestFile || "-",
            dates: dates
        }
    };

    var uploadData = processData(uploads);
    var maxUploadByUser = 0;
    var maxUploadByUserName = "-";
    for (var user in uploadData.users) {
        var curUser = uploadData.users[user];
        if (curUser.size > maxUploadByUser) {
            maxUploadByUser = curUser.size;
            maxUploadByUserName = user;
        }
    }

    var maxUploadInADay = 0;
    var maxUploadInADayDate = "-";
    for (var date in uploadData.dates) {
        var curDate = uploadData.dates[date];
        if (curDate.size > maxUploadInADay) {
            maxUploadInADay = curDate.size;
            maxUploadInADayDate = utils.getDate(date, dateFormatS, "");
        }
    }

    var downloadData = processData(downloads);
    var maxDownloadByUser = 0;
    var maxDownloadByUserName = "-";
    for (var user in downloadData.users) {
        var curUser = downloadData.users[user];
        if (curUser.size > maxDownloadByUser) {
            maxDownloadByUser = curUser.size;
            maxDownloadByUserName = user;
        }
    }

    var maxDownloadInADay = 0;
    var maxDownloadInADayDate = "-";
    for (var date in downloadData.dates) {
        var curDate = downloadData.dates[date];
        if (curDate.size > maxDownloadInADay) {
            maxDownloadInADay = curDate.size;
            maxDownloadInADayDate = utils.getDate(date, dateFormatS, "");
        }
    }

    var panel = config.reportContent;

    /*Stats*/
    var startDate = $(x).find("startDate:first").text().split(" ")[0];
    var endDate = $(x).find("endDate:first").text().split(" ")[0];
    var stats = panel.find(".graph-stats");

    stats.find(".start-date").text(utils.getDate(startDate, dateFormatS, ""));
    stats.find(".end-date").text(utils.getDate(endDate, dateFormatS, ""));

    stats.find(".total-download").text(downloadData.totalCount);
    stats.find(".download-size").text(downloadData.totalFormatted);
    stats.find(".largest-file-download-name").text(downloadData.largestFile);
    stats.find(".largest-file-download-size").text(downloadData.largestSize);
    stats.find(".most-downloads-count").text(utils.formatBytes(maxDownloadByUser));
    stats.find(".most-downloads-user").text(maxDownloadByUserName);
    stats.find(".most-downloads-in-a-day").text(utils.formatBytes(maxDownloadInADay));
    stats.find(".most-downloads-in-a-day-date").text(maxDownloadInADayDate);

    stats.find(".total-upload").text(uploadData.totalCount);
    stats.find(".upload-size").text(uploadData.totalFormatted);
    stats.find(".largest-file-upload-name").text(uploadData.largestFile);
    stats.find(".largest-file-upload-size").text(uploadData.largestSize);
    stats.find(".most-uploads-count").text(utils.formatBytes(maxUploadByUser));
    stats.find(".most-uploads-user").text(maxUploadByUserName);
    stats.find(".most-uploads-in-a-day").text(utils.formatBytes(maxUploadInADay));
    stats.find(".most-uploads-in-a-day-date").text(maxUploadInADayDate);

    var mergedDates = {},
        mergedTimeline = {},
        mergedTimelineCount = {};
    for (var date in uploadData.dates) {
        if (!mergedDates[date]) {
            var downloadDateData = downloadData.dates[date] || {
                count: 0,
                size: 0
            };
            mergedDates[date] = {
                downloads: downloadDateData,
                uploads: uploadData.dates[date]
            };
            mergedTimeline[date] = {
                downloads: mergedDates[date].downloads.size,
                uploads: mergedDates[date].uploads.size
            };
            mergedTimelineCount[date] = {
                downloads: mergedDates[date].downloads.count,
                uploads: mergedDates[date].uploads.count
            }
        }
    }

    for (var date in downloadData.dates) {
        if (!mergedDates[date]) {
            var uploadDateData = uploadData.dates[date] || {
                count: 0,
                size: 0
            };
            mergedDates[date] = {
                downloads: downloadData.dates[date],
                uploads: uploadDateData
            }
            mergedTimeline[date] = {
                downloads: mergedDates[date].downloads.size,
                uploads: mergedDates[date].uploads.size
            };
            mergedTimelineCount[date] = {
                downloads: mergedDates[date].downloads.count,
                uploads: mergedDates[date].uploads.count
            }
        }
    }

    var uploadDownloadCountTimeline = [];
    for (var date in mergedTimelineCount) {
        var curDate = mergedTimelineCount[date];
        uploadDownloadCountTimeline.push({
            period: date,
            download: curDate.downloads,
            upload: curDate.uploads
        });
    };

    var timeline = [];
    for (var date in mergedTimeline) {
        var curDate = mergedTimeline[date];
        timeline.push({
            period: date,
            download: curDate.downloads,
            upload: curDate.uploads
        });
    };

    if (timeline.length == 0) {
        $('#totalTimeLine').hide().parent().find(".no-data").show();
    } else {
        var totalTimeline = Morris.Line({
            element: 'totalTimeLine',
            data: timeline,
            xkey: 'period',
            ykeys: ['download', 'upload'],
            labels: ['Downloaded', 'Uploaded'],
            lineColors: ["#007acc", "#008000"],
            parseTime: true,
            resize: true,
            yLabelFormat: function(y) {
                return utils.formatBytes(y);
            }
        });
    };

    if (uploadData.total || downloadData.total) {
        var sum = downloadData.total + uploadData.total;
        var downPerc = getPerc(downloadData.total, sum);
        var upPerc = getPerc(uploadData.total, sum);
        var donutData = [{
            label: "Downloads",
            value: downloadData.total,
            perc: downPerc
        }, {
            label: "Uploads",
            value: uploadData.total,
            perc: upPerc
        }];

        var colors = [];
        colors.push(getColorCode(downPerc));
        colors.push(getColorCode(upPerc));

        var donut = Morris.Donut({
            element: 'ratioDonut',
            data: donutData,
            formatter: function(x, data) {
                return data.perc + "%"
            },
            colors: colors,
            resize: true
        });
    } else {
        $('#ratioDonut, .has-report-data').hide().parent().find(".no-data").show();
        return;
    }

    var tables = panel.find(".tables").empty();

    var showIPs = utils.getConfig("showIPs_1", true);
    var showDates = utils.getConfig("showDates", true);
    var showSizes = utils.getConfig("showSizes", true);
    var showPaths = utils.getConfig("showPaths_2", true);

    function renderData(type) {
        var columns = [{
            "data": "username"
        }, {
            "data": "ip",
            visible : showIPs
        }, {
            "data": "name",
            "width": "10%"
        }, {
            "data": "date",
            "render": function(data) {
                return utils.getDate(data, dateFormat);
            },
            visible : showDates,
            "orderData": [8]
        }, {
            "data": "size",
            "render": function(data) {
                return utils.formatBytes(data);
            },
            "orderData": [9],
            visible : showSizes
        }, {
            "data": "speed",
            "render": function(data) {
                return utils.formatBytes(data) + "/s";
            },
            "orderData": [10]
        }, {
            "data": "path",
            visible : showPaths
        }, {
            "data": "url"
        }, {
            "data": "date",
            "visible": false
        }, {
            "data": "size",
            "visible": false
        }, {
            "data": "speed",
            "visible": false
        }];

        var dataSource = type == "upload" ? uploadData : downloadData;

        var htmlContent = $(template.replace(/\$type/g, type));
        tables.append(htmlContent);
        var maxwidth = '150px';

        var table = $('#' + type + '_dataRecord').find(".dataTable");
        var tableUploadDT = table.DataTable({
            "language": {
                "emptyTable": "No data available for uploads"
            },
            data: dataSource.files,
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
                [0, 'desc']
            ]
        });
        var localdelay = (function () {
            var timer = 0;
            return function (callback, ms) {
                clearTimeout(timer);
                timer = setTimeout(callback, ms);
            };
        })();

        /*Redraw table when tab loaded*/
        $("#"+type+"RecordsTabAllRecords").on('shown.bs.tab', function(e){
            loader.show();
            localdelay(function(){
                tableUploadDT.draw("full-hold");
                loader.hide();
            }, 2000)
        });

        /*Upload Timeline*/
        if (uploadDownloadCountTimeline.length == 0) {
            $('#' + type + '_timeLine').hide().parent().find(".no-data").show();
        } else {
            var ykeys = ['upload'];
            var labels = ['Uploaded'];
            var lineColors = ["#008000"];
            if (type == "download") {
                ykeys = ['download'];
                labels = ['Downloaded'];
                lineColors = ["#007acc"];
            }
            var totalTimeline = Morris.Line({
                element: '' + type + '_timeLine',
                data: uploadDownloadCountTimeline,
                xkey: 'period',
                ykeys: ykeys,
                labels: labels,
                lineColors: lineColors,
                parseTime: true,
                resize: true
            });
        };

        /*User wise donut*/
        var userDonutData = [];
        var userColors = [];
        for (var user in dataSource.users) {
            var curUser = dataSource.users[user];
            var perc = getPerc(curUser.size, dataSource.total);
            userDonutData.push({
                label: user,
                value: curUser.size,
                perc: perc
            });
            userColors.push(getColorCode(perc));
        }
        if (userDonutData.length == 0) {
            $('#' + type + 'UserDonut').hide().parent().find(".no-data").show();
        } else {
            var userDonut = Morris.Donut({
                element: '' + type + 'UserDonut',
                data: userDonutData,
                formatter: function(x, data) {
                    return " " + utils.formatBytes(x) + " ~ " + data.perc + "%"
                },
                colors: userColors,
                resize: true
            });
        }

        /*File extensions donut*/
        var extDonutData = [];
        var extColors = [];
        for (var ext in dataSource.exts) {
            var curExt = dataSource.exts[ext];
            var perc = getPerc(curExt, dataSource.totalCount);
            extDonutData.push({
                label: "." + ext,
                value: curExt,
                perc: perc
            });
            extColors.push(getColorCode(perc));
        }
        if (extDonutData.length == 0) {
            $('#' + type + 'ExtDonut').hide().parent().find(".no-data").show();
        } else {
            var extUploaDonut = Morris.Donut({
                element: '' + type + 'ExtDonut',
                data: extDonutData,
                formatter: function(x, data) {
                    return "total " + x + " file(s) : ~" + data.perc + "%"
                },
                colors: extColors,
                resize: true
            });
        }

        /*User wise donut*/
        var IPDonutData = [];
        var IPColors = [];
        for (var ip in dataSource.ips) {
            var curIP = dataSource.ips[ip];
            var perc = getPerc(curIP.size, dataSource.total);
            IPDonutData.push({
                label: ip,
                value: curIP.size,
                perc: perc
            });
            IPColors.push(getColorCode(perc));
        }
        if (IPDonutData.length == 0) {
            $('#' + type + 'IPDonut').hide().parent().find(".no-data").show();
        } else {
            var uploadIPDonut = Morris.Donut({
                element: '' + type + 'IPDonut',
                data: IPDonutData,
                formatter: function(x, data) {
                    return " " + utils.formatBytes(x) + " ~ " + data.perc + "%"
                },
                colors: IPColors,
                resize: true
            });
        }

        // userWiseTemplate
        var userWiseRecords = $('#' + type + 'UserWise').find(".user-wise-tables").empty();
        var index = 0;
        columns[0].visible = false;
        var userWiseTables = {};
        for (var user in dataSource.users) {
            index++;
            var curUser = dataSource.users[user];
            var htmlContent = $(userWiseTemplate.replace(/\$type/g, type).replace(/\$user/g, user).replace(/\$id/g, index));
            userWiseRecords.append(htmlContent);
            var maxwidth = '150px';
            var table = $('#User' + type + index + '_dataRecord').find(".dataTable");
            userWiseTables["Table_" + index] = table.DataTable({
                "language": {
                    "emptyTable": "No data available for uploads"
                },
                data: curUser.files,
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
                    [0, 'desc']
                ]
            });

        }

        var localdelay2 = (function () {
            var timer = 0;
            return function (callback, ms) {
                clearTimeout(timer);
                timer = setTimeout(callback, ms);
            };
        })();
        /*Redraw table when tab loaded*/
        $("#"+type+"RecordsTabUserWise").on('shown.bs.tab', function(e){
            loader.show();
            localdelay2(function(){
                for(var table in userWiseTables){
                    userWiseTables[table].draw("full-hold");
                }
                loader.hide();
            }, 2000);
        });
    }
    renderData("upload");
    renderData("download");


    var hasData = uploadData.total || downloadData.total;
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
                var defaultRow = ["User", "IP", "Name", "Date", "Size", "Speed", "Path", "URL"];
                tableRecords.push(defaultRow);
                for (var i = 0; i < data.files.length; i++) {
                    var curFile = data.files[i];
                    var row = [];
                    row.push(crushFTPTools.decodeXML(curFile.username));
                    row.push(crushFTPTools.decodeXML(curFile.ip));
                    row.push(crushFTPTools.decodeXML(curFile.name));
                    row.push(utils.getDate(curFile.date, dateFormat));
                    row.push(curFile.size);
                    row.push(curFile.speed);
                    row.push(crushFTPTools.decodeXML(curFile.path));
                    row.push(crushFTPTools.decodeXML(curFile.url));
                    tableRecords.push(row);
                };
                var ws = XLSUtils.sheetFromArrayOfArrays(tableRecords)
                wb.Sheets[sheetName] = ws;
            }
            addType(downloadData, "Download");
            addType(uploadData, "Upload");
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
            }), "UploadDownloadSummary.xlsx");
        });
    } else {
        $('.has-report-data').hide();
    }
}