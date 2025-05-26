/*Report interface*/

crushReports.reports.UserFolderPermissions = function(data, tpl) {
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
    var title = "User Folder Permissions";
    var desc = "Information of all user's folder permissions.";
    config.reportIcon.addClass(icon);
    config.reportTitle.text(title);
    config.reportDesc.text(desc);

    var errors_only = utils.getConfig("errors_only", false);

    var content = $(tpl).find("#html-content").html();
    config.reportContent.empty().append(content);
    var template = $(tpl).find("#template").html();
    var popupTemplate = $(tpl).find("#template-popup").html();

    var x = $(data).find("results:first");

    var users = $(x).find("users_subitem");

    function processData(_data) {
        var items = [];
        $(_data).each(function() {
            var site_privs = $(this).find(" > site_privs:first").text();
            var groups = crushFTPTools.xmlEncode($(this).find(" > groups:first").text());
            var username = crushFTPTools.xmlEncode($(this).find(" > username:first").text());
            var notes = crushFTPTools.xmlEncode($(this).find(" > notes:first").text());
            var allowed_protocols = $(this).find(" > allowed_protocols:first").text();
            var enabled = $(this).find(" > enabled:first").text();
            var email = crushFTPTools.xmlEncode($(this).find(" > email:first").text());
            var password = crushFTPTools.xmlEncode($(this).find(" > password:first").text());
            var listings = $(this).find("listing_subitem");
            var folders = [];
            var paths = [];
            var hasError;
            listings.each(function () {
                paths.push($(this).find(" > url:first").text());
                folders.push({
                    owner : crushFTPTools.xmlEncode($(this).find(" > owner:first").text()),
                    time_or_year : $(this).find(" > time_or_year:first").text(),
                    type : crushFTPTools.xmlEncode($(this).find(" > type:first").text()),
                    url : crushFTPTools.xmlEncode($(this).find(" > url:first").text()),
                    modified : $(this).find(" > modified:first").text(),
                    group : $(this).find(" > group:first").text(),
                    permissions : $(this).find(" > permissions:first").text(),
                    num_items : $(this).find(" > num_items:first").text(),
                    is_virtual : $(this).find(" > is_virtual:first").text(),
                    protocol : $(this).find(" > protocol:first").text(),
                    size : $(this).find(" > size:first").text(),
                    dir : crushFTPTools.xmlEncode($(this).find(" > dir:first").text()),
                    local : $(this).find(" > local:first").text(),
                    day : $(this).find(" > day:first").text(),
                    root_dir : crushFTPTools.xmlEncode($(this).find(" > root_dir:first").text()),
                    privs : crushFTPTools.xmlEncode($(this).find(" > privs:first").text()),
                    month : $(this).find(" > month:first").text(),
                    name : crushFTPTools.xmlEncode($(this).find(" > name:first").text()),
                    error_message : crushFTPTools.xmlEncode($(this).find(" > error_message:first").text())
                })
                if(!hasError)
                    hasError = crushFTPTools.xmlEncode($(this).find(" > error_message:first").text()).length>0;
            });
            items.push({
                site_privs : site_privs,
                groups : groups,
                username : username,
                notes : notes,
                allowed_protocols : allowed_protocols,
                enabled : enabled,
                email : email,
                password : password,
                folders: folders,
                foldersstring : paths.join("\n"),
                count : folders.length,
                hasError: hasError
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
        "data": "username",
        "render": function(d, type, row) {
            if(row.enabled.toString()=="true")
                return  '<span class="active-user"><i class="fa fa-user"></i></span> ' + d;
            else
                return  '<span class="inactive-user"><i class="fa fa-user"></i></span> ' + d;
        },
    }, {
        "data": "enabled",
        visible : false
    }, {
        "data": "allowed_protocols"
    }, {
        "data": "site_privs"
    }, {
        "data": "groups"
    }, {
        "data": null,
        "orderData": [6],
        "className": 'details-control text-center',
        render : function(data){
            if(data.folders && data.folders.length>0){
                var errClass = errors_only && data.hasError ? 'error' : '';
                var exclaim = errors_only && data.hasError ? ' <i class="fa fa-exclamation-triangle"></i>' : '';
                return '<a class="folder-items '+errClass+'" href="javascript:void(0);"><i class="fa fa-list-alt"></i> '+data.folders.length + ' items'+ exclaim + ' </a>';
            }
            else
                return ' - ';
        }
    }, {
        "data": "count",
        visible : false
    }, {
        "data":"foldersstring",
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
        "data": "error_message",
        visible: errors_only
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
                var defaultRow = ["Username", "Enabled", "Allowed Protocols", "Permissions", "Groups", "Notes"];
                tableRecords.push(defaultRow);
                for (var i = 0; i < data.items.length; i++) {
                    var curFile = data.items[i];
                    var row = [];
                    row.push(crushFTPTools.decodeXML(curFile.username));
                    row.push(curFile.enabled);
                    row.push(crushFTPTools.decodeXML(curFile.allowed_protocols));
                    row.push(crushFTPTools.decodeXML(curFile.site_privs));
                    row.push(crushFTPTools.decodeXML(curFile.groups));
                    row.push(crushFTPTools.decodeXML(curFile.notes));
                    tableRecords.push(row);
                    if(curFile.folders && curFile.folders.length>0){
                        tableRecords.push(["", "Folder Permissions", "", "", "", ""]);
                        if(errors_only)
                            tableRecords.push(["","Type", "Name", "URL", "Permissions", "Virtual", "Error Message", ""]);
                        else
                            tableRecords.push(["","Type", "Name", "URL", "Permissions", "Virtual", ""]);
                        curFile.folders.forEach(function(folder){
                            var folderRow = [];
                            folderRow.push("");
                            folderRow.push(crushFTPTools.decodeXML(folder.type));
                            folderRow.push(crushFTPTools.decodeXML(folder.name));
                            folderRow.push(crushFTPTools.decodeXML(folder.url));
                            folderRow.push(crushFTPTools.decodeXML(folder.privs));
                            folderRow.push(folder.is_virtual);
                            if(errors_only)
                                folderRow.push(folder.error_message);
                            tableRecords.push(folderRow);
                        });
                    }
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
            }), "UserFolderPermissions.xlsx");
        });
    } else {
        $('.has-report-data').hide();
    }
}