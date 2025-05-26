/*Report interface*/

crushReports.reports.CurrentLogins = function(data, tpl) {
    /*Get references from main file*/
    var config = crushReports.config;
    var isEmbed = crushReports.isEmbed;
    var utils = crushReports.utils;
    var XLSUtils = crushReports.XLSUtils;
    var getColorCode = crushReports.getColorCode;
    var getFileExtension = crushReports.getFileExtension;
    var getPerc = crushReports.getPerc;
    var loader = crushReports.loader;

    var icon = "fa-group";
    var title = "Current Logins";
    var desc = "This report provides summary of all current logins";
    config.reportIcon.addClass(icon);
    config.reportTitle.text(title);
    config.reportDesc.text(desc);

    var excludeAnonymous = utils.getConfig("excludeAnonymous", true);
    var showFiles = utils.getConfig("showFiles_2", true);

    var content = $(tpl).find("#html-content").html();
    config.reportContent.empty().append(content);
    var template = $(tpl).find("#template").html();

    var x = $(data).find("results:first");

    var logins = $(x).find("recent_users_subitem");
    var totalLogins = logins.length;

    // Not needed as server returns the formatted date
    // var dfs = utils.getDateFormat(x);
    // var dateFormat = dfs.dateFormat;
    // var dateFormatS = dfs.dateFormatS;
    // var dateFormatT = dfs.dateFormatT;

    function processData(_data) {
        var total = 0,
            items = [],
            users = {}
            dates = {};
        $(_data).each(function() {
            var user_protocol = $(this).find(" > user_protocol:first").text();
            var user_ip = $(this).find(" > user_ip:first").text();
            var bind_port = $(this).find(" > bind_port:first").text();
            var time = $(this).find(" > time:first").text();
            var root_dir = $(this).find(" > root_dir:first").text();
            var bytes_received = $(this).find(" > bytes_received:first").text();
            var bytes_received_formatted = $(this).find(" > bytes_received_formatted:first").text();
            var session_download_count = $(this).find(" > session_download_count:first").text();
            var bytes_sent = $(this).find(" > bytes_sent:first").text();
            var bytes_sent_formatted = $(this).find(" > bytes_sent_formatted:first").text();
            var session_upload_count = $(this).find(" > session_upload_count:first").text();
            var status = $(this).find(" > status:first").text();
            var user_logged_in = crushFTPTools.xmlEncode($(this).find(" > user_logged_in:first").text());
            var login_date_formatted = $(this).find(" > login_date_formatted:first").text();
            var login_date_stamp_unique = $(this).find(" > login_date_stamp_unique:first").text();
            var user_name = crushFTPTools.xmlEncode($(this).find(" > user_name:first").text()) || "anonymous";
            var session_uploads = $(this).find(" > session_uploads:first").text();
            var session_downloads = $(this).find(" > session_downloads:first").text();
            if(excludeAnonymous && user_name.toLowerCase() == "anonymous"){
                //exclude
            }
            else{
                total++;
                users[user_name] = users[user_name] || 0;
                users[user_name]++;

                var singleDate = login_date_formatted.split(" ")[0];
                dates[singleDate] = dates[singleDate] || 0;
                dates[singleDate]++;

                items.push({
                    user_name : user_name,
                    user_protocol : user_protocol,
                    user_ip : crushFTPTools.xmlEncode(user_ip),
                    bind_port : bind_port,
                    time : time,
                    root_dir : root_dir,
                    bytes_received : bytes_received,
                    bytes_received_formatted : bytes_received_formatted,
                    session_download_count : session_download_count,
                    bytes_sent : bytes_sent,
                    bytes_sent_formatted : bytes_sent_formatted,
                    session_upload_count : session_upload_count,
                    status : status,
                    user_logged_in : user_logged_in,
                    login_date_formatted : login_date_formatted,
                    login_date_stamp_unique : login_date_stamp_unique,
                    session_uploads : session_uploads,
                    session_downloads : session_downloads
                });
            }
        });
        return {
            total : total,
            items : items,
            users : users,
            dates : dates
        }
    };

    var loginsData = processData(logins);
    var maxCurrentLogins = 0;
    var maxFailedLoginUser = "";
    var donutData = [];
    var donutColors = [];
    for(var user in loginsData.users){
        var curCount = loginsData.users[user];
        if(curCount>maxCurrentLogins)
        {
            maxCurrentLogins = curCount;
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

    var maxCurrentLoginsOnDate = 0;
    var maxFailedLoginDate = "";
    var timeline = [];
    for(var date in loginsData.dates){
        if(loginsData.dates[date]>maxCurrentLoginsOnDate)
        {
            maxCurrentLoginsOnDate = loginsData.dates[date];
            maxFailedLoginDate = date;
        }
        timeline.push({
            period: date,
            Logins: loginsData.dates[date]
        });
    }

    var panel = config.reportContent;
    var tables = panel.find(".tables").empty();
    var tplContent = $(template.replace(/\$type/g, "logins"));
    tables.append(tplContent);

    var columns = [{
        "data": "user_name"
    }, {
        "data": null,
        render : function(data){
            return data.user_protocol + "://" + data.user_ip + ":" + data.bind_port;
        }
    }, {
        "data": "login_date_formatted",
        "orderData": [7]
    }, {
        "data": null,
        "orderData": [8],
        "className": 'details-control',
        render : function(data){
            if(data.session_downloads && showFiles)
                return '<a class="downloaded-items" href="javascript:void(0);"><i class="fa fa-list-alt"></i> '+data.bytes_sent_formatted + ' (' + data.session_download_count + ' items)'+'</a>';
            else
                return data.bytes_sent_formatted + ' (' + data.session_download_count + ' items)';
        }
    }, {
        "data": null,
        "orderData": [9],
        "className": 'details-control',
        render : function(data){
            if(data.session_uploads && showFiles)
                return '<a class="uploaded-items" href="javascript:void(0);"><i class="fa fa-list-alt"></i> '+data.bytes_received_formatted + ' (' + data.session_upload_count + ' items)'+'</a>';
            else
                return data.bytes_received_formatted + ' (' + data.session_upload_count + ' items)';
        }
    }, {
        "data": "status"
    }, {
        "data": "user_logged_in"
    }, {
        "data": "login_date_stamp_unique",
        visible : false
    }, {
        data : "bytes_received",
        visible : false
    }, {
        data : "bytes_sent",
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
            [2, 'desc']
        ]
    });

    loginsTableDT.on('click', 'td.details-control a', function() {
        var title = $(this).is(".downloaded-items") ? "Downloads" : "Uploads";
        var variable = $(this).is(".downloaded-items") ? "session_downloads" : "session_uploads";
        var tr = $(this).closest('tr');
        var row = loginsTableDT.row(tr);
        var data = row.data();
        var dialog = bootbox.dialog({
            title: title + " : " + data.user_name + " (login time : "+ data.login_date_formatted +")",
            message: '<p>'+data[variable]+'</p>',
            backdrop : true,
            className : "fullModal"
        });
        dialog.init(function(){});
        var scrollTop = $('body').scrollTop() || parent.$("body").scrollTop();
        dialog.css({
          'top': scrollTop
        });
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
                var defaultRow = ["User Name", "Location", "Login Time", "Downloaded", "Uploaded", "Status", "Logged In"];
                if(showFiles){
                    defaultRow.push("Downloaded Items");
                    defaultRow.push("Uploaded Items");
                }
                tableRecords.push(defaultRow);
                for (var i = 0; i < data.items.length; i++) {
                    var curItem = data.items[i];
                    var row = [];
                    row.push(crushFTPTools.decodeXML(curItem.user_name));
                    row.push(curItem.user_protocol + "://" + crushFTPTools.decodeXML(curItem.user_ip) + ":" + curItem.bind_port);
                    row.push(curItem.login_date_formatted);
                    row.push(curItem.bytes_received_formatted + ' (' + curItem.session_download_count + ' items)');
                    row.push(curItem.bytes_sent_formatted + ' (' + curItem.session_upload_count + ' items)');
                    row.push(curItem.status);
                    row.push(crushFTPTools.decodeXML(curItem.user_logged_in));
                    if(showFiles){
                        row.push(curItem.session_downloads);
                        row.push(curItem.session_uploads);
                    }
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
            }), "CurrentLogins.xlsx");
        });
    } else {
        $('.has-report-data').hide();
    }
}