/*Report interface*/

crushReports.reports.FailedLogins = function(data, tpl) {
    /*Get references from main file*/
    var config = crushReports.config;
    var isEmbed = crushReports.isEmbed;
    var utils = crushReports.utils;
    var XLSUtils = crushReports.XLSUtils;
    var getColorCode = crushReports.getColorCode;
    var getFileExtension = crushReports.getFileExtension;
    var getPerc = crushReports.getPerc;
    var loader = crushReports.loader;

    var icon = "fa-unlink";
    var title = "Failed Logins";
    var desc = "This report provides summary of all failed logins during selected period.";
    config.reportIcon.addClass(icon);
    config.reportTitle.text(title);
    config.reportDesc.text(desc);

    var excludeAnonymous = utils.getConfig("excludeAnonymous", true);

    var content = $(tpl).find("#html-content").html();
    config.reportContent.empty().append(content);
    var template = $(tpl).find("#template").html();

    var x = $(data).find("results:first");

    var dfs = utils.getDateFormat(x);
    var dateFormat = dfs.dateFormat;
    var dateFormatS = dfs.dateFormatS;
    var dateFormatT = dfs.dateFormatT;

    var logins = $(x).find("ips_subitem");
    var totalLogins = logins.length;

    function processData(_data) {
        var total = 0,
            items = [],
            users = {}
            dates = {};
        $(_data).each(function() {
            var start_time = $(this).find(" > start_time:first").text();
            var ip = $(this).find(" > ip:first").text();
            var username = $(this).find(" > username:first").text();
            var protocol = $(this).find(" > protocol:first").text();
            var server_port = $(this).find(" > server_port:first").text();
            total++;
            users[username] = users[username] || 0;
            users[username]++;

            var singleDate = start_time.split(" ")[0];
            dates[singleDate] = dates[singleDate] || 0;
            dates[singleDate]++;
                items.push({
                    start_time : crushReports.getTimestamp(start_time),
                    ip : ip,
                    username : crushFTPTools.xmlEncode(username),
                    protocol : crushFTPTools.xmlEncode(protocol),
                    server_port : crushFTPTools.xmlEncode(server_port)
                });
        });
        return {
            total : total,
            items : items,
            users : users,
            dates : dates
        }
    };

    var loginsData = processData(logins);
    var maxFailedLogins = 0;
    var maxFailedLoginUser = "";
    var donutData = [];
    var donutColors = [];
    for(var user in loginsData.users){
        var curCount = loginsData.users[user];
        if(curCount>maxFailedLogins)
        {
            maxFailedLogins = curCount;
            maxFailedLoginUser = user;
        }
        var perc = getPerc(curCount, loginsData.total);
        donutData.push({
            label: user,
            value: curCount,
            perc: perc
        });
        donutColors.push(getColorCode(perc));
    }

    var maxFailedLoginsOnDate = 0;
    var maxFailedLoginDate = "";
    var timeline = [];
    for(var date in loginsData.dates){
        if(loginsData.dates[date]>maxFailedLoginsOnDate)
        {
            maxFailedLoginsOnDate = loginsData.dates[date];
            maxFailedLoginDate = date;
        }
        timeline.push({
            period: date,
            Logins: loginsData.dates[date]
        });
    }

    var panel = config.reportContent;
    /*Stats*/
    var startDate = $(x).find("startDate:first").text().split(" ")[0];
    var endDate = $(x).find("endDate:first").text().split(" ")[0];
    var stats = panel.find(".graph-stats");
    stats.find(".start-date").text(utils.getDate(startDate, dateFormatS, ""));
    stats.find(".end-date").text(utils.getDate(endDate, dateFormatS, ""));
    stats.find(".total").text(loginsData.total);
    stats.find(".max-failed-user").text(maxFailedLoginUser);
    stats.find(".max-failed-count").text(maxFailedLogins);
    if(maxFailedLoginDate)
        stats.find(".max-failed-date").text(moment(maxFailedLoginDate, "YYYY-MM-DD").format("MM/DD/YYYY"));
    stats.find(".max-failed-date-count").text(maxFailedLoginsOnDate);

    var tables = panel.find(".tables").empty();
    var tplContent = $(template.replace(/\$type/g, "logins"));
    tables.append(tplContent);

    var columns = [{
        "data": "start_time",
        "render": function(data) {
            return utils.getDate(crushReports.formatDate(data, true), dateFormat, "");
        },
        "orderData": [5]
    }, {
        "data": "ip"
    }, {
        "data": "protocol"
    }, {
        "data": "server_port"
    }, {
        "data": "username"
    }, {
        data : "start_time",
        visible : false
    }];
    var loginsTable = $('#logins_dataRecord').find(".dataTable");
    var maxwidth = '150px';
    var loginsTableDT = loginsTable.DataTable({
        "language": {
            "emptyTable": "No data available"
        },
        data: loginsData.items,
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
            [0, 'asc']
        ]
    });

    /*By Users donut*/
    var userDonut = Morris.Donut({
        element: 'typeDonut',
        data: donutData,
        formatter: function(x, data) {
            return data.perc + "%"
        },
        colors: donutColors,
        resize: true
    });
    if (donutColors.length == 0) {
        $('#typeDonut').hide().parent().find(".no-data").show();
    }

    /*Failed attemp timeline*/
    if (timeline.length == 0) {
        $('#totalTimeLine').hide().parent().find(".no-data").show();
    } else {
        var totalTimeline = Morris.Line({
            element: 'totalTimeLine',
            data: timeline,
            xkey: 'period',
            ykeys: ['Logins'],
            labels: ['Failed Attempts(s)'],
            parseTime: true,
            resize: true
        });
    }

    var hasData = loginsData.total;
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
                var defaultRow = ["Date", "IP", "Protocol", "Server Port", "User Name"];
                tableRecords.push(defaultRow);
                for (var i = 0; i < data.items.length; i++) {
                    var curItem = data.items[i];
                    var row = [];
                    row.push(utils.getDate(crushReports.formatDate(curItem.start_time, true), dateFormat, ""));
                    row.push(curItem.ip);
                    row.push(crushFTPTools.decodeXML(curItem.protocol));
                    row.push(crushFTPTools.decodeXML(curItem.server_port));
                    row.push(crushFTPTools.decodeXML(curItem.username));
                    tableRecords.push(row);
                };
                var ws = XLSUtils.sheetFromArrayOfArrays(tableRecords)
                wb.Sheets[sheetName] = ws;
            }
            addType(loginsData, "users");
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
            }), "FailedLogins.xlsx");
        });
    } else {
        $('.has-report-data').hide();
    }
}