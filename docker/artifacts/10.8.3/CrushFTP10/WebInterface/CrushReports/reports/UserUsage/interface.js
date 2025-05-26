/*Report interface*/

crushReports.reports.UserUsage = function(data, tpl) {
    /*Get references from main file*/
    var config = crushReports.config;
    var isEmbed = crushReports.isEmbed;
    var utils = crushReports.utils;
    var XLSUtils = crushReports.XLSUtils;
    var getColorCode = crushReports.getColorCode;
    var getFileExtension = crushReports.getFileExtension;
    var getPerc = crushReports.getPerc;
    var loader = crushReports.loader;

    var icon = "fa-user-o";
    var title = "User Usage";
    var desc = "This report provides summary of all user usage";
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

    var users = $(x).find("users_subitem");
    var totalUsers = users.length;

    function processData(_data) {
        var total = 0,
            items = [],
            active = 0,
            inactive = 0,
            admin = 0,
            fulladmin = 0,
            limitedadmin = 0;
        $(_data).each(function() {
            total++;

            var site_privs = $(this).find(" > site_privs:first").text();
            var expire_password_days = $(this).find(" > expire_password_days:first").text();
            var groups = $(this).find(" > groups:first").text();
            var username = $(this).find(" > username:first").text();
            var notes = $(this).find(" > notes:first").text();
            var enabled = $(this).find(" > enabled:first").text();
            var last_login = $(this).find(" > last_login:first").text();
            var listing = $(this).find(" > listing:first").text();
            var linked_vfs = $(this).find(" > linked_vfs:first").text();
            var expire_password = $(this).find(" > expire_password:first").text();
            var created_time = $(this).find(" > created_time:first").text();
            var password = $(this).find(" > password:first").text();
            var account_expire = $(this).find(" > account_expire:first").text();
            var expire_password_when = $(this).find(" > expire_password_when:first").text();
            var max_logins = $(this).find(" > max_logins:first").text();
            var listings = $(this).find("listing_subitem");
            var folders = [];
            listings.each(function(){
                folders.push({
                    name : crushFTPTools.xmlEncode($(this).find(" > name:first").text()),
                    dir : crushFTPTools.xmlEncode($(this).find(" > dir:first").text()),
                    url : crushFTPTools.xmlEncode($(this).find(" > url:first").text()),
                    privs : crushFTPTools.xmlEncode($(this).find(" > privs:first").text())
                })
            });

            if(site_privs.toLowerCase().indexOf("connect")>=0 || site_privs.toLowerCase().indexOf("web_admin")>=0){
                fulladmin++;
                admin++;
            }
            else if(site_privs.toLowerCase().indexOf("admin")>=0){
                limitedadmin++;
                admin++;
            }

            items.push({
                site_privs : site_privs,
                expire_password_days : expire_password_days,
                groups : crushFTPTools.xmlEncode(groups),
                username : crushFTPTools.xmlEncode(username),
                notes : crushFTPTools.xmlEncode(notes),
                enabled : enabled,
                last_login : crushReports.getTimestamp(last_login, "MM/DD/YYYY HH:mm:ss aa"),
                listing : listing,
                linked_vfs : crushFTPTools.xmlEncode(linked_vfs),
                expire_password : expire_password,
                created_time : crushReports.getTimestamp(created_time, "MM/DD/YYYY HH:mm:ss aa"),
                password : crushFTPTools.xmlEncode(password),
                account_expire : crushReports.getTimestamp(account_expire, "MM/DD/YYYY HH:mm:ss aa"),
                expire_password_when : crushReports.getTimestamp(expire_password_when, "MM/DD/YYYY HH:mm:ss aa"),
                max_logins : max_logins,
                folders : folders
            });

            if(enabled == "true")
                active++;
            else
                inactive++;

        });
        return {
            total : total,
            items : items,
            active : active,
            inactive : inactive,
            admin : admin,
            fulladmin : fulladmin,
            limitedadmin : limitedadmin
        }
    };

    var usersData = processData(users);

    var panel = config.reportContent;

    /*Stats*/
    var stats = panel.find(".graph-stats");
    stats.find(".total-users").text(usersData.total);
    stats.find(".total-active").text(usersData.active);
    stats.find(".total-disabled").text(usersData.inactive);
    stats.find(".total-admin").text(usersData.admin);
    stats.find(".total-fulll-admin").text(usersData.fulladmin);
    stats.find(".total-limited-admin").text(usersData.limitedadmin);

    var tables = panel.find(".tables").empty();
    var shareContent = $(template.replace(/\$type/g, "users"));
    tables.append(shareContent);

    var columns = [{
        "data": "username"
    }, {
        "data": "enabled",
        render : function(d){
            return d == "true" ? "Active" : "Inactive";
        }
    }, {
        "data": "last_login",
        "render": function(data) {
            return utils.getDate(data, dateFormat, "");
        },
        "orderData": [7]
    }, {
        "data": "created_time",
        "render": function(data) {
            return utils.getDate(data, dateFormat, "");
        },
        "orderData": [8]
    }, {
        "data": "max_logins",
        render : function(d){
            return d+"" == "0" ? "No Limit" : d;
        }
    }, {
        "data": "account_expire",
        "render": function(data) {
            return utils.getDate(data, dateFormat, "");
        },
        "orderData": [9]
    }, {
        "data": "expire_password_when",
        "render": function(data) {
            return utils.getDate(data, dateFormat, "");
        },
        "orderData": [10]
    }, {
        data : "last_login",
        visible : false
    }, {
        data : "created_time",
        visible : false
    }, {
        data : "account_expire",
        visible : false
    }, {
        data : "expire_password_when",
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

    /*By Users donut*/
    var usersDonutData = [];
    var usersDonutColors = [];

    var perc = getPerc(usersData.total - usersData.admin, usersData.total);
    usersDonutData.push({
        label: "Regular Users",
        value: usersData.total - usersData.admin,
        perc: perc
    });
    usersDonutColors.push(getColorCode(perc));

    perc = getPerc(usersData.fulladmin, usersData.total);
    usersDonutData.push({
        label: "Full Admin",
        value: usersData.fulladmin,
        perc: perc
    });
    usersDonutColors.push(getColorCode(perc));

    perc = getPerc(usersData.limitedadmin, usersData.total);
    usersDonutData.push({
        label: "Limited Admin",
        value: usersData.limitedadmin,
        perc: perc
    });
    usersDonutColors.push(getColorCode(perc));

    var userDonut = Morris.Donut({
        element: 'typeDonut',
        data: usersDonutData,
        formatter: function(x, data) {
            return data.perc + "%"
        },
        colors: usersDonutColors,
        resize: true
    });
    if (usersDonutColors.length == 0) {
        $('#typeDonut').hide().parent().find(".no-data").show();
    }

    var hasData = usersData.total;
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
                var defaultRow = ["Username", "Active", "Last Login", "Created", "Max Logins", "Expires On", "Password Expiration Enabeld", "Password Expiration Days", "Password Expiration Date", "Folder", "Permissions", "Linked VFS", "Groups"];
                tableRecords.push(defaultRow);
                for (var i = 0; i < data.items.length; i++) {
                    var curFile = data.items[i];
                    var row = [];
                    var folders = [];
                    if(curFile.folders.length>0){
                        curFile.folders.forEach(function(item){
                            folders.push(crushFTPTools.decodeXML(item.name) + "|||" + crushFTPTools.decodeXML(item.url) + "|||" + crushFTPTools.decodeXML(item.privs));
                        });
                    }
                    row.push(crushFTPTools.decodeXML(curFile.username));
                    row.push(curFile.enabled);
                    row.push(utils.getDate(curFile.last_login, dateFormat, ""));
                    row.push(utils.getDate(curFile.created_time, dateFormat, ""));
                    row.push(curFile.max_logins);
                    row.push(utils.getDate(curFile.account_expire, dateFormat, ""));
                    row.push(crushFTPTools.decodeXML(curFile.expire_password));
                    row.push(curFile.expire_password_days);
                    row.push(utils.getDate(curFile.expire_password_when, dateFormat, ""));
                    row.push(folders.join("\n"));
                    row.push(crushFTPTools.decodeXML(curFile.site_privs));
                    row.push(crushFTPTools.decodeXML(curFile.linked_vfs));
                    row.push(crushFTPTools.decodeXML(curFile.groups));
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
            }), "UserUsage.xlsx");
        });
    } else {
        $('.has-report-data').hide();
    }
}