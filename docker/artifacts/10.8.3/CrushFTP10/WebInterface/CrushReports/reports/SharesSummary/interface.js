/*Report interface*/

crushReports.reports.SharesSummary = function(data, tpl) {
    /*Get references from main file*/
    var config = crushReports.config;
    var isEmbed = crushReports.isEmbed;
    var utils = crushReports.utils;
    var XLSUtils = crushReports.XLSUtils;
    var getColorCode = crushReports.getColorCode;
    var getFileExtension = crushReports.getFileExtension;
    var getPerc = crushReports.getPerc;
    var loader = crushReports.loader;

    var icon = "fa-link";
    var title = "Shares Summary";
    var desc = "This report provides summary of shares made between selected period.";
    config.reportIcon.addClass(icon);
    config.reportTitle.text(title);
    config.reportDesc.text(desc);

    var content = $(tpl).find("#html-content").html();
    config.reportContent.empty().append(content);
    var template = $(tpl).find("#template").html();

    var x = $(data).find("results:first");

    var dfs = utils.getDateFormat(x);
    var dateFormat = dfs.dateFormat;
    var dateFormatS = dfs.dateFormatS;
    var dateFormatT = dfs.dateFormatT;

    var shares = $(x).find("shares_subitem");
    var totalShares = shares.length;
    var totalShareSize = 0;

    function processData(_data) {
        var total = 0,
            files = [],
            types = {},
            users = {},
            largestSize = 0,
            largestFile = "",
            mostShares = 0,
            mostSharesUser = 0,
            totalItems = 0,
            dates = {};
        $(_data).each(function() {
            {
                totalItems++;
                total += parseInt($(this).find("size:first").text());
                var name = $(this).find("name:first").text();
                var username = $(this).find("username:first").text();
                var createdBy = $(this).find("username:last").text();
                var to = $(this).find("shareUsernames:first").text() + " " + $(this).find("emailTo:first").text();
                var size = $(this).find("size:first").text() ? parseInt($(this).find("size:first").text()) : 0;
                var sharedOn = $(this).find("share_time:first").text();
                var expiresOn = $(this).find("expire:first").text();
                var web_link = $(this).find("web_link:first").text();
                var url = $(this).find("url:first").text();
                var path = $(this).find("path:first").text();
                var metaInfo = $(this).find("metaInfo:first");
                var publishType = $(this).find("publishType:first").text();
                if (size > largestSize) {
                    largestSize = size;
                    largestFile = name;
                }
                publishType = publishType || "-";
                files.push({
                    name: crushFTPTools.xmlEncode(name),
                    username: crushFTPTools.xmlEncode(username),
                    createdBy: crushFTPTools.xmlEncode(createdBy),
                    to: (to),
                    size: utils.formatBytes(size),
                    web_link: crushFTPTools.xmlEncode(web_link),
                    sharedOn: sharedOn,
                    expiresOn: expiresOn,
                    type: publishType,
                    url: crushFTPTools.xmlEncode(url),
                    path: crushFTPTools.xmlEncode(path),
                    metaInfo: metaInfo
                });
                if (!types[publishType]) {
                    types[publishType] = 1;
                } else {
                    types[publishType] += 1;
                }
                if (!users[username]) {
                    users[username] = 1;
                } else {
                    users[username] += 1;
                }
                if (users[username] > mostShares) {
                    mostShares = users[username];
                    mostSharesUser = username;
                }
                var singleDate = sharedOn.split(" ")[0];
                if (!dates[singleDate]) {
                    var item = {};
                    item[name] = 1;
                    dates[singleDate] = {
                        count: 1,
                        files: item
                    };
                } else {
                    dates[singleDate].count++;
                    if (!dates[singleDate].files[name]) {
                        dates[singleDate].files[name] = 1;
                    } else {
                        dates[singleDate].files[name]++;
                    }
                }
            }
        });
        return {
            totalCount: totalItems,
            total: total,
            totalFormatted: utils.formatBytes(parseInt(total)),
            files: files,
            types: types,
            users: users,
            dates: dates,
            largestSize: utils.formatBytes(largestSize),
            largestFile: largestFile,
            mostShares: mostShares,
            mostSharesUser: mostSharesUser
        }
    };

    var shareData = processData(shares);

    var panel = config.reportContent;

    /*Stats*/
    var startDate = $(x).find("startDate:first").text().split(" ")[0];
    var endDate = $(x).find("endDate:first").text().split(" ")[0];
    var stats = panel.find(".graph-stats");

    stats.find(".start-date").text(utils.getDate(startDate, dateFormatS, ""));
    stats.find(".end-date").text(utils.getDate(endDate, dateFormatS, ""));

    stats.find(".total-shares").text(shareData.totalCount);
    stats.find(".most-shares-user").text(shareData.mostSharesUser);
    stats.find(".most-shares-count").text(shareData.mostShares);
    shareData.largestFile = shareData.largestFile || "-";
    stats.find(".largest-file-name").text(shareData.largestFile);
    stats.find(".largest-file-size").text(shareData.largestSize);

    var tables = panel.find(".tables").empty();
    var shareContent = $(template.replace(/\$type/g, "share"));
    tables.append(shareContent);

    var timeline = [];
    for (var date in shareData.dates) {
        timeline.push({
            period: date,
            Files: shareData.dates[date].count
        });
    }

    if (timeline.length == 0) {
        $('#share_timeLine').hide().parent().find(".no-data").show();
    } else {
        var totalTimeline = Morris.Line({
            element: 'share_timeLine',
            data: timeline,
            xkey: 'period',
            ykeys: ['Files'],
            labels: ['Item(s)'],
            parseTime: true,
            resize: true
        });
    }

    function showFormMetaInfo(data) {
        // `d` is the original data object for the row
        var formData = data.metaInfo;
        var rows = [];
        if (formData && formData.length > 0) {
            formData.find("*").each(function(index) {
                rows.push("<tr><td style='width:200px;text-align:right;'>" + crushFTPTools.xmlEncode($(this).get(0).tagName) + "</td><td>" + crushFTPTools.xmlEncode($(this).text()) + "</td></tr>");
            });
        } else {
            rows.push("<tr><td colspan='2' class='text-center'>Nothing to display</td></tr>");
        }
        return '<h5 class="sub-title">Form Data :</h5><table class="table table-striped table-bordered download-table dataTable no-footer" cellpadding="5" cellspacing="0" border="0" style="border-top:1px solid #ddd;">' +
            rows.join("") +
            '</table>';
    }

    var showPath = utils.getConfig("showPaths_1", true);
    var showURLs = utils.getConfig("showURLs_1", true);
    var showFormInfo = utils.getConfig("showFormInfo_1", true);

    var columns = [{
        "data": "createdBy"
    }, {
        "data": "to"
    }, {
        "data": "username"
    }, {
        "data": "name"
    }, {
        "data": "size"
    }, {
        "data": "type"
    }, {
        "data": "sharedOn",
         "render": function(data) {
            return utils.getDate(data, dateFormat, "");
        }
    }, {
        "data": "expiresOn",
         "render": function(data) {
            return utils.getDate(data, dateFormat, "");
        }
    }, {
        "data": "path",
        visible : showPath
    }, {
        "data": "url",
        visible : showURLs
    }, {
        "className": 'details-control text-center',
        "orderable": false,
        "data": null,
        "defaultContent": '<a href="javascript:void(0);"><i class="fa fa-list-alt"></i> Form Data</a>',
        visible : showFormInfo
    }];

    var shareTable = $('#share_dataRecord').find(".dataTable");
    var maxwidth = '150px';
    var shareTableDT = shareTable.DataTable({
        "language": {
            "emptyTable": "No data available"
        },
        data: shareData.files,
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
            [4, 'desc']
        ]
    });

    shareTable.on('click', 'td.details-control', function() {
        var tr = $(this).closest('tr');
        var row = shareTableDT.row(tr);
        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
            shareTableDT.columns.adjust().draw();
        } else {
            // Open this row
            if (shareTable.height() < 300) {
                shareTable.closest('.dataTables_scrollBody').css('height', '500px');
                shareTableDT.columns.adjust().draw();
            }
            row.child(showFormMetaInfo(row.data())).show();
            tr.addClass('shown');
        }
    });

    /*By Users donut*/
    var userDonutData = [];
    var userDonutColors = [];
    for (var item in shareData.users) {
        var curItem = shareData.users[item];
        var perc = getPerc(curItem, shareData.totalCount);
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

    /*By Type donut*/
    var typeDonutData = [];
    var typeDonutColors = [];
    for (var item in shareData.types) {
        var curItem = shareData.types[item];
        var perc = getPerc(curItem, shareData.totalCount);
        typeDonutData.push({
            label: item,
            value: curItem,
            perc: perc
        });
        typeDonutColors.push(getColorCode(perc));
    }
    var typeDonut = Morris.Donut({
        element: 'typesDonut',
        data: typeDonutData,
        formatter: function(x, data) {
            return data.perc + "%"
        },
        colors: typeDonutColors,
        resize: true
    });
    if (typeDonutColors.length == 0) {
        $('#typesDonut').hide().parent().find(".no-data").show();
    }

    var hasData = shareData.total;
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
                var defaultRow = ["Shared By", "To", "Username", "Name", "Size", "Type", "Shared On", "Expires On", "Web Link"];
                if (showPath)
                    defaultRow.push("Path");
                if (showURLs)
                    defaultRow.push("URL");
                if (showFormInfo)
                    defaultRow.push("Form Info");
                tableRecords.push(defaultRow);
                for (var i = 0; i < data.files.length; i++) {
                    var curFile = data.files[i];
                    var row = [];
                    row.push(crushFTPTools.decodeXML(curFile.createdBy));
                    row.push(crushFTPTools.decodeXML(curFile.to));
                    row.push(crushFTPTools.decodeXML(curFile.username));
                    row.push(crushFTPTools.decodeXML(curFile.name));
                    row.push(curFile.size);
                    row.push(curFile.type);
                    row.push(utils.getDate(curFile.sharedOn, dateFormat, ""));
                    row.push(utils.getDate(curFile.expiresOn, dateFormat, ""));
                    row.push(crushFTPTools.decodeXML(curFile.web_link));
                    if (showPath)
                        row.push(crushFTPTools.decodeXML(curFile.path));
                    if (showURLs)
                        row.push(crushFTPTools.decodeXML(curFile.url));
                    if (showFormInfo) {
                        row.push(curFile.metaInfo.find("*").map(function() {
                            return $.trim($(this).get(0).tagName + " = " + $(this).text());
                        }).get().join("\n"));
                    }
                    tableRecords.push(row);
                };
                var ws = XLSUtils.sheetFromArrayOfArrays(tableRecords)
                wb.Sheets[sheetName] = ws;
            }
            addType(shareData, "Shares");
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
            }), "SharesSummary.xlsx");
        });
    } else {
        $('.has-report-data').hide();
    }
}