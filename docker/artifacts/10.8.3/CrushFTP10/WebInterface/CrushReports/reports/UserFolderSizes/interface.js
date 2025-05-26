/*Report interface*/

crushReports.reports.UserFolderSizes = function(data, tpl) {
    /*Get references from main file*/
    var config = crushReports.config;
    var isEmbed = crushReports.isEmbed;
    var utils = crushReports.utils;
    var XLSUtils = crushReports.XLSUtils;
    var getColorCode = crushReports.getColorCode;
    var getFileExtension = crushReports.getFileExtension;
    var getPerc = crushReports.getPerc;
    var loader = crushReports.loader;

    var icon = "fa-folder-open-o";
    var title = "User Folder Sizes";
    var desc = "Information of all user's folder sizes.";
    config.reportIcon.addClass(icon);
    config.reportTitle.text(title);
    config.reportDesc.text(desc);

    var content = $(tpl).find("#html-content").html();
    config.reportContent.empty().append(content);
    var template = $(tpl).find("#template").html();

    var x = $(data).find("results:first");

    var users = $(x).find("users_subitem");

    function processData(_data) {
        var items = [];
        $(_data).each(function() {
            var username = crushFTPTools.xmlEncode($(this).find(" > username:first").text());
            var fileSize = $(this).find(" > fileSize:first").text();
            var quotaFormatted = $(this).find(" > quotaFormatted:first").text();
            var fileSizeFormatted = $(this).find(" > fileSizeFormatted:first").text();
            var quota = $(this).find(" > quota:first").text();
            var fileCount = $(this).find(" > fileCount:first").text();
            items.push({
                username : username,
                fileSize : fileSize,
                quotaFormatted : quotaFormatted,
                fileSizeFormatted : fileSizeFormatted,
                quota : quota,
                fileCount : fileCount
            });
        });
        return {
            items : items
        }
    };
    var usersData = processData(users);
    var panel = config.reportContent;
    var tables = panel.find(".tables").empty();
    var shareContent = $(template.replace(/\$type/g, "users"));
    tables.append(shareContent);
    var columns = [{
        "data": "username"
    }, {
        "data": "fileSizeFormatted",
        "orderData": [4]
    }, {
        "data": "fileCount"
    }, {
        "data": "quotaFormatted",
        "orderData": [5]
    }, {
        "data": "fileSize",
        visible : false
    }, {
        "data": "quota",
        visible : false
    }];

    var usersTable = $('#users_dataRecord').find(".dataTable");
    var maxwidth = '150px';
    var usersTableDT = usersTable.DataTable({
        "language": {
            "emptyTable": "No data available"
        },
        data: usersData.items,
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

    var hasData = usersData.items.length;
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
                var defaultRow = ["Username", "Folder Size", "Files Count", "Quota"];
                tableRecords.push(defaultRow);
                for (var i = 0; i < data.items.length; i++) {
                    var curFile = data.items[i];
                    var row = [];
                    row.push(crushFTPTools.decodeXML(curFile.username));
                    row.push(curFile.fileSizeFormatted);
                    row.push(curFile.fileCount);
                    row.push(curFile.quotaFormatted);
                    tableRecords.push(row);
                };
                var ws = XLSUtils.sheetFromArrayOfArrays(tableRecords)
                wb.Sheets[sheetName] = ws;
            }
            addType(usersData, "users");
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
            }), "UserFolderSizes.xlsx");
        });
    } else {
        $('.has-report-data').hide();
    }
}