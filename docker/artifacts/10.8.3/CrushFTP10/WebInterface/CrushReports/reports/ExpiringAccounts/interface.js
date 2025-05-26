/*Report interface*/

crushReports.reports.ExpiringAccounts = function(data, tpl) {
    /*Get references from main file*/
    var config = crushReports.config;
    var isEmbed = crushReports.isEmbed;
    var utils = crushReports.utils;
    var XLSUtils = crushReports.XLSUtils;
    var getColorCode = crushReports.getColorCode;
    var getFileExtension = crushReports.getFileExtension;
    var getPerc = crushReports.getPerc;
    var loader = crushReports.loader;

    var icon = "fa-hourglass-half";
    var title = "Expiring Accounts";
    var desc = "Information of expiring accounts and/or passwords.";
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

    function processData(_data) {
        var accounts = [];
        var passwords = [];
        var disabled = [];
        $(_data).each(function() {
            var username = $(this).find(" > username:first").text();
            var password_expire = $(this).find(" > password_expire:first").text();
            var account_expire = $(this).find(" > account_expire:first").text();
            var account_disabled = $(this).find(" > account_disabled:first").text();
            if(account_expire){
                accounts.push({
                    username : crushFTPTools.xmlEncode(username),
                    date : account_expire,
                    account_disabled: account_disabled
                });
            }
            if(password_expire){
                passwords.push({
                    username : crushFTPTools.xmlEncode(username),
                    date : password_expire,
                    account_disabled: account_disabled
                });
            }
            if(account_disabled){
                disabled.push({
                    username : crushFTPTools.xmlEncode(username),
                    date : password_expire,
                    account_disabled: account_disabled
                });
            }
        });
        return {
            accounts : accounts,
            passwords : passwords,
            disabled: disabled
        }
    };
    var usersData = processData(users);

    var showAccounts = utils.getConfig("expire_account", true);
    var showPasswords = utils.getConfig("expire_password", true);
    var showDisabled = utils.getConfig("expire_disabled", true);

    var panel = config.reportContent;
    var tables = panel.find(".tables").empty();
    var columns = [{
        "data": "username"
    }, {
        "data": "date",
        "render": function(data) {
            return utils.getDate(data, dateFormat, "MM/DD/YYYY hh:mm:ss A");
        }
    }
    , {
        "data": "date",
        "visible": false
    }];
    if(showAccounts){
        var accountsContent = $(template.replace(/\$type/g, "accounts").replace(/\$header/g, "Expiring Accounts"));
        tables.append(accountsContent);
        var usersTable = $('#accounts_dataRecord').find(".dataTable");
        var maxwidth = '150px';
        var usersTableDT = usersTable.DataTable({
            "language": {
                "emptyTable": "No data available"
            },
            data: usersData.accounts,
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
                [1, 'asc']
            ]
        });
    }

    if(showPasswords){
        var passwordContent = $(template.replace(/\$type/g, "passwords").replace(/\$header/g, "Expiring Passwords"));
        tables.append(passwordContent);
        var passwordTable = $('#passwords_dataRecord').find(".dataTable");
        var maxwidth = '150px';
        var passwordTableDT = passwordTable.DataTable({
            "language": {
                "emptyTable": "No data available"
            },
            data: usersData.passwords,
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
                [1, 'asc']
            ]
        });
    }

    if(showDisabled){
        var accountsContent = $(template.replace(/\$type/g, "disabled").replace(/\$header/g, "Disabled Accounts"));
        tables.append(accountsContent);
        var usersTable = $('#disabled_dataRecord').find(".dataTable");
        var maxwidth = '150px';
        var usersTableDT = usersTable.DataTable({
            "language": {
                "emptyTable": "No data available"
            },
            data: usersData.disabled,
            fnRowCallback: function(nRow, aData, iDisplayIndex) {
                var x = nRow;
                $(x).find('td').each(function() {
                    $(this).addClass('reports-td');
                    $(this).css("max-width", maxwidth);
                    $(this).attr("title", $(this).html().replace(/\<div>/g, " ").replace(/\<\/div>/g, " ").replace(/\<br>/g, " ").replace(/\<br\/>/g, " "));
                });
                return nRow;
            },
            "columns": [{
                "data": "username"
            }, {
                "data": "date",
                "visible": false
            }
            , {
                "data": "account_disabled"
            }],
            "order": [
                [1, 'asc']
            ]
        });
    }

    var hasData = (showAccounts && usersData.accounts.length) || (showPasswords && usersData.passwords.length)  || (showDisabled && usersData.disabled.length);
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
                var defaultRow = ["Username", "Expires On", "Disabled"];
                tableRecords.push(defaultRow);
                for (var i = 0; i < data.length; i++) {
                    var curFile = data[i];
                    var row = [];
                    row.push(crushFTPTools.decodeXML(curFile.username));
                    row.push(utils.getDate(curFile.date, dateFormat, "MM/DD/YYYY hh:mm:ss A"));
                    row.push(curFile.account_disabled);
                    tableRecords.push(row);
                };
                var ws = XLSUtils.sheetFromArrayOfArrays(tableRecords)
                wb.Sheets[sheetName] = ws;
            }
            if(showAccounts)
                addType(usersData.accounts, "Accounts");
            if(showPasswords)
                addType(usersData.passwords, "Passwords");
            if(showDisabled)
                addType(usersData.disabled, "Disabled Account");

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
            }), "ExpiringAccounts.xlsx");
        });
    } else {
        $('.has-report-data').hide();
    }
}