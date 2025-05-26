/*Report interface*/

crushReports.reports.ChangedPassword = function(data, tpl) {
    /*Get references from main file*/
    var config = crushReports.config;
    var isEmbed = crushReports.isEmbed;
    var utils = crushReports.utils;
    var XLSUtils = crushReports.XLSUtils;
    var getColorCode = crushReports.getColorCode;
    var getFileExtension = crushReports.getFileExtension;
    var getPerc = crushReports.getPerc;
    var loader = crushReports.loader;

    var icon = "fa-pie-chart";
    var title = "Changed Password";
    var desc = "This report provides list of changed password within selected period.";
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

    var records = $(x).find("users_subitem");

    function processData(_data) {
        var total = 0,
            items = [];
        $(_data).each(function() {
            total++;
            items.push({
                changed_by_ip: crushFTPTools.xmlEncode($(this).find(" > changed_by_ip:first").text()),
                server_group: crushFTPTools.xmlEncode($(this).find(" > server_group:first").text()),
                password_info: crushFTPTools.xmlEncode($(this).find(" > password_info:first").text()),
                password_changed: crushFTPTools.xmlEncode($(this).find(" > password_changed:first").text()),
                username: crushFTPTools.xmlEncode($(this).find(" > username:first").text())
            });
        });
        return {
            total : total,
            items : items
        }
    };

    var recordData = processData(records);

    var panel = config.reportContent;

    /*Stats*/
    var startDate = $(x).find("startDate:first").text().split(" ")[0];
    var endDate = $(x).find("endDate:first").text().split(" ")[0];
    var stats = panel.find(".graph-stats");
    stats.find(".start-date").text(startDate);
    stats.find(".end-date").text(endDate);

    var tables = panel.find(".tables").empty();
    var shareContent = $(template.replace(/\$type/g, "record"));
    tables.append(shareContent);

    var columns = [{
        "data": "username"
    },{
        "data": "server_group"
    },{
        "data": "changed_by_ip"
    },{
        "data": "password_changed",
        "render": function(data) {
            return utils.getDate(data, dateFormat);
        }
    }, {
        "data": "password_info"
    }];

    var recordTable = $('#record_dataRecord').find(".dataTable");
    var maxwidth = '150px';
    var usersTableDT = recordTable.DataTable({
        "language": {
            "emptyTable": "No data available"
        },
        data: recordData.items,
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

    var hasData = recordData.total;
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
                var defaultRow = ["Username", "Server Group", "Changed by IP", "Date", "Info"];
                tableRecords.push(defaultRow);
                for (var i = 0; i < data.items.length; i++) {
                    var curFile = data.items[i];
                    var row = [];
                    row.push(crushFTPTools.decodeXML(curFile.username));
                    row.push(crushFTPTools.decodeXML(curFile.server_group));
                    row.push(crushFTPTools.decodeXML(curFile.changed_by_ip));
                    row.push(crushFTPTools.decodeXML(utils.getDate(curFile.password_changed, dateFormat)));
                    row.push(crushFTPTools.decodeXML(curFile.password_info));
                    tableRecords.push(row);
                };
                var ws = XLSUtils.sheetFromArrayOfArrays(tableRecords)
                wb.Sheets[sheetName] = ws;
            }
            addType(recordData, "record");
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
            }), "ChangedPassword.xlsx");
        });
    } else {
        $('.has-report-data').hide();
    }
}