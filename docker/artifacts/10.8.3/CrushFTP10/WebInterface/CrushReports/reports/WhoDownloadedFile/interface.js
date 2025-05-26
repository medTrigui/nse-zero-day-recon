/*Report interface*/

crushReports.reports.WhoDownloadedFile = function(data, tpl, type) {
    /*Get references from main file*/
    var config = crushReports.config;
    var isEmbed = crushReports.isEmbed;
    var utils = crushReports.utils;
    var XLSUtils = crushReports.XLSUtils;
    var getColorCode = crushReports.getColorCode;
    var getFileExtension = crushReports.getFileExtension;
    var getPerc = crushReports.getPerc;
    var loader = crushReports.loader;
    type = type || "download";
    var content = $(tpl).find("#html-content").html().replace(/\$type/g, type).replace(/\eed/g, "ed");
    config.reportContent.empty().append(content);

    var template = $(tpl).find("#template").html();
    var icon = "";
    var title = "";
    var desc = "";
    if(type == "download"){
        icon = "fa-download";
        title = "Who Downloaded File";
        desc = "This report provides information of files downloaded in selected period, you can filter results by username, file name and path of downloaded file.";
    }
    else if (type == "upload") {
        icon = "fa-upload";
        title = "Who Uploaded File";
        desc = "This report provides information of files uploaded in selected period, you can filter results by username, file name and path of uploaded file.";
    }
    else if (type == "delete") {
        icon = "fa-trash-o";
        title = "Who Deleted File";
        desc = "This report provides information of files deleted in selected period, you can filter results by username, file name and path of deleted file.";
    }
    else if (type == "rename") {
        icon = "fa-edit";
        title = "Who Renamed File";
        desc = "This report provides information of files renamed in selected period, you can filter results by username, file name and path of renamed file.";
    }
    config.reportIcon.addClass(icon);
    config.reportTitle.text(title);
    config.reportDesc.text(desc);

    var x = $(data).find("results:first");
    var dfs = utils.getDateFormat(x);
    var dateFormat = dfs.dateFormat;
    var dateFormatS = dfs.dateFormatS;
    var dateFormatT = dfs.dateFormatT;
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
    $(x).find("users > users_subitem").each(function(index) {
        var username = crushFTPTools.xmlEncode($(this).find("users_subitem > username").text());
        if (!userDateTimeline[username]) {
            userDateTimeline[username] = {
                dates: {}
            };
        }
        var item = {
            id: index,
            user: username,
            files: [],
            totalCount: 0
        };
        $(this).find("filesDetail > filesDetail_subitem").each(function() {
            var name = crushFTPTools.xmlEncode($(this).find("filesDetail_subitem > name").text());
            var dates = $(this).find("filesDetail_subitem > dates > dates_subitem");
            var singleDate = $(this).find("filesDetail_subitem > date").text();
            item.files.push({
                path: crushFTPTools.xmlEncode($(this).find("filesDetail_subitem > path").text()),
                name: name,
                date: singleDate,
                timestamp: crushReports.getTimestamp(singleDate),
                dates: dates
            });
            var curTotal = 0;
            if (dates.length == 0) {
                curTotal = 1;
                item.totalCount++;
                singleDate = singleDate.split(" ")[0];
                if (!totalDateTimeline.dates[singleDate]) {
                    var file = {};
                    file[name] = 1;
                    totalDateTimeline.dates[singleDate] = {
                        count: 1,
                        files: file
                    };
                } else {
                    totalDateTimeline.dates[singleDate].count++;
                    if (!totalDateTimeline.dates[singleDate].files[name]) {
                        totalDateTimeline.dates[singleDate].files[name] = 1;
                    } else {
                        totalDateTimeline.dates[singleDate].files[name]++;
                    }
                }
            } else {
                dates.each(function() {
                    item.totalCount++;
                    curTotal++;
                    var date = $(this).text().split(" ")[0];
                    if (!userDateTimeline[username].dates[date]) {
                        var file = {};
                        file[name] = 1;
                        userDateTimeline[username].dates[date] = {
                            count: 1,
                            files: file
                        };
                    } else {
                        userDateTimeline[username].dates[date].count++;
                        if (!userDateTimeline[username].dates[date].files[name]) {
                            userDateTimeline[username].dates[date].files[name] = 1;
                        } else {
                            userDateTimeline[username].dates[date].files[name]++;
                        }
                    }

                    if (!totalDateTimeline.dates[date]) {
                        var file = {};
                        file[name] = 1;
                        totalDateTimeline.dates[date] = {
                            count: 1,
                            files: file
                        };
                    } else {
                        totalDateTimeline.dates[date].count++;
                        if (!totalDateTimeline.dates[date].files[name]) {
                            totalDateTimeline.dates[date].files[name] = 1;
                        } else {
                            totalDateTimeline.dates[date].files[name]++;
                        }
                    }
                    if (!maxOnDate.count || maxOnDate.count < totalDateTimeline.dates[date].count) {
                        maxOnDate.count = totalDateTimeline.dates[date].count;
                        maxOnDate.date = date;
                    }
                });
            }
            var ext = getFileExtension(name);
            if (!exts[ext]) {
                exts[ext] = curTotal;
            } else {
                exts[ext] += curTotal;
            }
        });
        totalFiles += item.totalCount;
        data.push(item);
    });

    /*User's donut*/
    var donutData = [];
    var colors = [];
    var panel = config.reportContent;
    var maxFilesUser = {
        count: 0,
        user: "",
        perc: 0
    };
    for (var i = 0; i < data.length; i++) {
        var curUser = data[i];
        var perc = getPerc(curUser.totalCount, totalFiles);
        donutData.push({
            label: curUser.user,
            value: curUser.totalCount,
            perc: perc
        });
        if (!maxFilesUser.count || maxFilesUser.count < curUser.totalCount) {
            maxFilesUser.count = curUser.totalCount;
            maxFilesUser.user = curUser.user;
            maxFilesUser.perc = perc;
        }
        colors.push(getColorCode(perc));
    }

    if (donutData.length == 0) {
        $('#userDonut').hide().parent().find(".no-data").show();
    } else {
        var donut = Morris.Donut({
            element: 'userDonut',
            data: donutData,
            formatter: function(x, data) {
                return "total " + x + " file(s) : ~" + data.perc + "%"
            },
            colors: colors,
            resize: true
        });
    }

    /*File extensions donut*/
    var extDonutData = [];
    var extColors = [];
    for (var ext in exts) {
        var curExt = exts[ext];
        var perc = getPerc(curExt, totalFiles);
        extDonutData.push({
            label: "." + ext,
            value: curExt,
            perc: perc
        });
        extColors.push(getColorCode(perc));
    }
    if (extDonutData.length == 0) {
        $('#extDonut').hide().parent().find(".no-data").show();
    } else {
        var extDonut = Morris.Donut({
            element: 'extDonut',
            data: extDonutData,
            formatter: function(x, data) {
                return "total " + x + " file(s) : ~" + data.perc + "%"
            },
            colors: extColors,
            resize: true
        });
    }

    /*Stats*/
    var startDate = $(x).find("startDate:first").text().split(" ")[0];
    var endDate = $(x).find("endDate:first").text().split(" ")[0];
    var stats = panel.find(".graph-stats");
    stats.find(".start-date").text(utils.getDate(startDate, dateFormatS, ""));
    stats.find(".end-date").text(utils.getDate(endDate, dateFormatS, ""));
    stats.find(".total").text(totalFiles);

    stats.find(".max-uploads-by").text(maxFilesUser.user);
    stats.find(".max-uploads-by-count").text(maxFilesUser.count);
    stats.find(".max-uploads-by-perc").text(maxFilesUser.perc);

    stats.find(".max-uploads-date").text(maxOnDate.date);
    stats.find(".max-uploads-date-count").text(maxOnDate.count);

    /*Total timeline*/
    var timeline = [];
    for (var date in totalDateTimeline.dates) {
        timeline.push({
            period: date,
            Files: totalDateTimeline.dates[date].count
        });
    }

    if (timeline.length == 0) {
        $('#totalTimeLine').hide().parent().find(".no-data").show();
    } else {
        var totalTimeline = Morris.Line({
            element: 'totalTimeLine',
            data: timeline,
            xkey: 'period',
            ykeys: ['Files'],
            labels: ['File(s)'],
            parseTime: true,
            resize: true
        });
    }

    if (isEmbed) {
        setTimeout(function() {
            window.parent.panelReportsSetup.reportFrameResizer();
        }, 2000);
    }

    var tables = panel.find(".tables").empty();

    function showOccurrences(d) {
        // `d` is the original data object for the row
        var dates = d.dates;
        var rows = [];
        if (dates && dates.length > 0) {
            $(dates).each(function(index) {
                var i = index + 1;
                rows.push("<tr><td style='width:50px;text-align:right;'>" + i + "</td><td>" + crushReports.formatDate($(this).text()) + "</td></tr>");
            });
        } else {
            rows.push("<tr><td colspan='2' class='text-center'>Nothing to display</td></tr>");
        }
        var prefix = "";
        if(type == "download"){
            prefix = "Downloaded";
        }
        else if (type == "upload") {
            prefix = "Uploaded";
        }
        else if (type == "delete") {
            prefix = "Deleted";
        }
        else if (type == "rename") {
            prefix = "Renamed";
        }
        return '<h5 class="sub-title">'+prefix+' on :</h5><table class="table table-striped table-bordered download-table dataTable no-footer" cellpadding="5" cellspacing="0" border="0" style="border-top:1px solid #ddd;">' +
            rows.join("") +
            '</table>';
    }
    var hasData = false;
    var actionLabel = type;
    $(x).find("users > users_subitem").each(function(i) {
        var username = crushFTPTools.xmlEncode($(this).find("users_subitem > username").text());
        var userData = $(template.replace(/\$id/g, i).replace(/\$username/g, username).replace(/\$type/g, type));
        tables.append(userData);
        var userTimeline = userDateTimeline[username];
        if (userTimeline) {
            var curUserTimeline = [];
            for (var date in userTimeline.dates) {
                curUserTimeline.push({
                    period: date,
                    Files: userTimeline.dates[date].count
                });
            }

            (function showRecords(i, tl) {
                Morris.Line({
                    element: i + '_timeLine',
                    data: tl,
                    xkey: 'period',
                    ykeys: ['Files'],
                    labels: ['File(s)'],
                    parseTime: true,
                    resize: true
                });
                var maxwidth = '150px';
                var table = $('#' + i + '_dataRecord').find(".dataTable").DataTable({
                    "language": {
                        "emptyTable": "No data available"
                    },
                    data: data[i].files,
                    fnRowCallback: function(nRow, aData, iDisplayIndex) {
                        var x = nRow;
                        $(x).find('td').each(function() {
                            $(this).addClass('reports-td');
                            $(this).css("max-width", maxwidth);
                            $(this).attr("title", $(this).html().replace(/\<div>/g, " ").replace(/\<\/div>/g, " ").replace(/\<br>/g, " ").replace(/\<br\/>/g, " "));
                        });
                        if (aData.dates.length < 2) {
                            $(x).find(".details-control").text("-");
                        } else {
                            $(x).find(".details-control").find("span.count").text(aData.dates.length);
                        }
                        return nRow;
                    },
                    "columns": [{
                        "data": "timestamp",
                        "render": function(data) {
                            return utils.getDate(crushReports.formatDate(data, true), dateFormat, "");
                        }
                    }, {
                        "data": "name"
                    }, {
                        "data": "path"
                    }, {
                        "className": 'details-control text-center',
                        "orderable": false,
                        "data": null,
                        "defaultContent": '<a href="javascript:void(0);"><span class="count"></span> ' + actionLabel + '</a>'
                    }],
                    "order": [
                        [0, 'desc']
                    ]
                });
                $('#' + i + '_dataRecord tbody').on('click', 'td.details-control', function() {
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    if (row.child.isShown()) {
                        // This row is already open - close it
                        row.child.hide();
                        tr.removeClass('shown');
                    } else {
                        // Open this row
                        row.child(showOccurrences(row.data())).show();
                        tr.addClass('shown');
                    }
                });
            })(i, curUserTimeline);
        }
        hasData = true;
    });

    if (hasData) {
        $('#exportAsXLS').unbind().click(function() {

            function Workbook() {
                if (!(this instanceof Workbook)) return new Workbook();
                this.SheetNames = [];
                this.Sheets = {};
            }

            var wb = new Workbook();

            /* add worksheet to workbook */
            function addUser(data) {
                var sheetName = "" + data.user;
                if (!wb.SheetNames.has(sheetName))
                    wb.SheetNames.push(sheetName);
                var tableRecords = [
                    ["Date", "Name", "Path", "All Occurrences"]
                ];
                for (var i = 0; i < data.files.length; i++) {
                    var curFile = data.files[i];
                    var date = utils.getDate(crushReports.formatDate(curFile.date), dateFormat, "");
                    var row = [];
                    row.push(date);
                    row.push(crushFTPTools.decodeXML(curFile.name));
                    row.push(crushFTPTools.decodeXML(curFile.path));
                    row.push(curFile.dates.map(function() {
                        return utils.getDate(crushReports.formatDate($.trim($(this).text())), dateFormat, "");
                    }).get().join(","));
                    tableRecords.push(row);
                };
                var ws = XLSUtils.sheetFromArrayOfArrays(tableRecords)
                wb.Sheets[sheetName] = ws;
            }
            for (var i = 0; i < data.length; i++) {
                addUser(data[i]);
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
            var filePrefix = type;
            if(type == "download"){
                filePrefix = "Downloaded";
            }
            else if (type == "upload") {
                filePrefix = "Uploaded";
            }
            else if (type == "delete") {
                filePrefix = "Deleted";
            }
            else if (type == "rename") {
                filePrefix = "Renamed";
            }
            saveAs(new Blob([s2ab(wbout)], {
                type: "application/octet-stream"
            }), "Who" + filePrefix + "File.xlsx");
        });
    } else {
        $('.has-report-data').hide();
    }
}