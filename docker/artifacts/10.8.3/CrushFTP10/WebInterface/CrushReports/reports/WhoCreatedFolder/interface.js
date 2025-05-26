/*Report interface*/

crushReports.reports.WhoCreatedFolder = function(data, tpl) {
    /*Get references from main file*/
    var config = crushReports.config;
    var isEmbed = crushReports.isEmbed;
    var utils = crushReports.utils;
    var XLSUtils = crushReports.XLSUtils;
    var getColorCode = crushReports.getColorCode;
    var getFileExtension = crushReports.getFileExtension;
    var getPerc = crushReports.getPerc;
    var loader = crushReports.loader;

    var icon = "fa-folder-o";
    var title = "Created Folders";
    var desc = "Information of folders created.";
    config.reportIcon.addClass(icon);
    config.reportTitle.text(title);
    config.reportDesc.text(desc);

    var content = $(tpl).find("#html-content").html();
    config.reportContent.empty().append(content);
    var template = $(tpl).find("#template").html();
    var popupTemplate = $(tpl).find("#template-popup").html();

    var x = $(data).find("results:first");

    var users = $(x).find("users_subitem");

    function processData(_data) {
        var items = [];
        $(_data).each(function() {
            var listings = $(this).find("filesDetail_subitem");
            listings.each(function () {
                items.push({
                    date : crushFTPTools.xmlEncode($(this).find(" > date:first").text()),
                    dates : $(this).find(" > dates_subitem"),
                    name : $(this).find(" > name:first").text(),
                    path : $(this).find(" > path:first").text(),
                    username : crushFTPTools.xmlEncode($(this).find(" > username:first").text())
                })
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
        "data": "name",
        "render": function(d, type, row) {
            return  '<span class="active-user"><i class="fa fa-folder"></i></span> ' + d;
        },
    }, {
        "data": "username",
        "render": function(d, type, row) {
            return  '<span class="active-user"><i class="fa fa-user"></i></span> ' + d;
        },
    }, {
        "data": "path"
    }, {
        "data": "date"
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
            [3, 'desc']
        ]
    });

    /*Popup table columns*/

    // owner : $(this).find(" > owner:first").text(),
    // time_or_year : $(this).find(" > time_or_year:first").text(),
    // type : $(this).find(" > type:first").text(),
    // url : $(this).find(" > url:first").text(),
    // modified : $(this).find(" > modified:first").text(),
    // group : $(this).find(" > group:first").text(),
    // permissions : $(this).find(" > permissions:first").text(),
    // num_items : $(this).find(" > num_items:first").text(),
    // is_virtual : $(this).find(" > is_virtual:first").text(),
    // protocol : $(this).find(" > protocol:first").text(),
    // size : $(this).find(" > size:first").text(),
    // dir : $(this).find(" > dir:first").text(),
    // local : $(this).find(" > local:first").text(),
    // day : $(this).find(" > day:first").text(),
    // root_dir : $(this).find(" > root_dir:first").text(),
    // privs : $(this).find(" > privs:first").text(),
    // month : $(this).find(" > month:first").text(),
    // name : $(this).find(" > name:first").text()
    var folderColumns = [{
        "data": "type",
        "render": function(d, type, row) {
            if(row.type.toString().toLowerCase()=="dir")
                return  '<span class="active-user"><i class="fa fa-folder"></i></span> ' + row.type;
            else
                return  '<span class="inactive-user"><i class="fa fa-file"></i></span> ' + row.type;
        }
    }, {
        "data": "name"
    }, {
        "data": "url"
    }, {
        "data": "privs"
    }, {
        "data": "is_virtual",
        "render": function(d, type, row) {
            if(row.is_virtual.toString().toLowerCase()=="true")
                return  'Yes';
            else
                return  'No';
        }
    }];

    usersTableDT.on('click', 'td.details-control a', function() {
        var tr = $(this).closest('tr');
        var row = usersTableDT.row(tr);
        var data = row.data();
        var dialog = bootbox.dialog({
            title: "Folder Permissions for user : " + data.username,
            message: popupTemplate,
            backdrop : true,
            className : "fullModal"
        });
        dialog.init(function(){
            var table = dialog.find("#folderRecords");
            var foldersTableDT = table.DataTable({
                "language": {
                    "emptyTable": "No data available"
                },
                data: data.folders,
                fnRowCallback: function(nRow, aData, iDisplayIndex) {
                    var x = nRow;
                    $(x).find('td').each(function() {
                        $(this).addClass('reports-td');
                        $(this).css("max-width", maxwidth);
                        $(this).attr("title", $(this).html().replace(/\<div>/g, " ").replace(/\<\/div>/g, " ").replace(/\<br>/g, " ").replace(/\<br\/>/g, " "));
                    });
                    return nRow;
                },
                "columns": folderColumns,
                "order": [
                    [0, 'asc']
                ]
            });
        });
        var scrollTop = $('body').scrollTop() || parent.$("body").scrollTop();
        dialog.css({
          'top': scrollTop
        });
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
                var defaultRow = ["Name", "Username", "Path", "Date"];
                tableRecords.push(defaultRow);
                for (var i = 0; i < data.items.length; i++) {
                    var curFile = data.items[i];
                    var row = [];
                    row.push(crushFTPTools.decodeXML(curFile.name));
                    row.push(crushFTPTools.decodeXML(curFile.username));
                    row.push(crushFTPTools.decodeXML(curFile.path));
                    row.push(crushFTPTools.decodeXML(curFile.date));
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
            }), "WhoCreatedFolder.xlsx");
        });
    } else {
        $('.has-report-data').hide();
    }
}