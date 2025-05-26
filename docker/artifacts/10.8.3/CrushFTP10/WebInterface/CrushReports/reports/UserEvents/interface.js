/*Report interface*/

crushReports.reports.UserEvents = function(data, tpl) {
    /*Get references from main file*/
    var config = crushReports.config;
    var isEmbed = crushReports.isEmbed;
    var utils = crushReports.utils;
    var XLSUtils = crushReports.XLSUtils;
    var getColorCode = crushReports.getColorCode;
    var getFileExtension = crushReports.getFileExtension;
    var getPerc = crushReports.getPerc;
    var loader = crushReports.loader;

    var icon = "fa-calendar-check-o";
    var title = "User Events";
    var desc = "Information of all user's events.";
    config.reportIcon.addClass(icon);
    config.reportTitle.text(title);
    config.reportDesc.text(desc);

    var content = $(tpl).find("#html-content").html();
    config.reportContent.empty().append(content);
    var template = $(tpl).find("#template").html();
    var popupTemplate = $(tpl).find("#template-popup").html();

    var x = $(data).find("results:first");
    var users = $(x).find("users_subitem");
    var totalEvents = 0;
    var maxEvents = {user: "", count: 0};
    var donutData = [];
    var colors = [];

    function processData(_data) {
        var items = [];
        $(_data).each(function() {
            var username = $(this).find(" > username:first").text();
            var events = $(this).find("events_subitem");
            var userEvents = [];
            var userEventNames = [];
            events.each(function () {
                userEvents.push({
                    name : $(this).find(" > name:first").text(),
                    enabled : $(this).find(" > enabled:first").text()
                });
                userEventNames.push(crushFTPTools.xmlEncode($(this).find(" > name:first").text()));
            });
            if(userEvents.length>maxEvents.count){
                maxEvents={
                    user: crushFTPTools.xmlEncode(username),
                    count: userEvents.length
                }
            }
            totalEvents += userEvents.length;
            items.push({
                username : crushFTPTools.xmlEncode(username),
                events: userEvents,
                events_joined: userEventNames.join(", "),
                count : userEvents.length
            });
        });
        return {
            items : items
        }
    };
    var usersData = processData(users);
    if(maxEvents.count>0){
        usersData.items.forEach(function(user){
            if(user.count>0){
                var perc = getPerc(user.count, totalEvents);
                donutData.push({
                    label: crushFTPTools.xmlEncode(user.username),
                    value: user.count,
                    perc: perc
                });
                colors.push(getColorCode(perc))
            }
        })
    }
    var panel = config.reportContent;
    var tables = panel.find(".tables").empty();
    var shareContent = $(template.replace(/\$type/g, "users"));
    tables.append(shareContent);
    var columns = [{
        "data": "username"
    },{
        "data": null,
        "orderData": [2],
        "className": 'details-control',
        render : function(data){
            if(data.events_joined && data.events_joined.length>0)
                return '<a class="folder-items" href="javascript:void(0);"><i class="fa fa-list-alt"></i> '+data.events_joined+'</a>';
            else
                return ' - ';
        }
    }, {
        "data": "count",
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


  /*Stats*/
    var stats = panel.find(".graph-stats");
    stats.find(".total-users").text(users.length);
    stats.find(".total-events").text(totalEvents);
    stats.find(".max-events-user").text(maxEvents.user);
    stats.find(".max-events-count").text(maxEvents.count);


    /* Donut */
    if (donutData.length == 0) {
        $('#eventsDonut').hide().parent().find(".no-data").show();
    } else {
        var donut = Morris.Donut({
            element: 'eventsDonut',
            data: donutData,
            formatter: function(x, data) {
                return "total " + x + " events(s) : ~" + data.perc + "%"
            },
            colors: colors,
            resize: true
        });
    }

    /*Popup table columns*/

    var folderColumns = [{
        "data": "enabled",
        "render": function(d, type, row) {
            if(row.enabled.toString().toLowerCase()=="true")
                return  '<span class="enabled"><i class="fa fa-circle"></i></span> Enabled';
            else
                return  '<span class="disabled"><i class="fa fa-circle"></i></span> Disabled';
        }
    }, {
        "data": "name"
    }];

    usersTableDT.on('click', 'td.details-control a', function(e) {
        var tr = $(this).closest('tr');
        var row = usersTableDT.row(tr);
        var data = row.data();
        var dialog = bootbox.dialog({
            title: "Events for user : " + data.username,
            message: popupTemplate,
            backdrop : true
        });
        dialog.init(function(){
            var table = dialog.find("#folderRecords");
            var foldersTableDT = table.DataTable({
                "language": {
                    "emptyTable": "No data available"
                },
                data: data.events,
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
        var scrollTop = $('body').scrollTop() || parent.$("body").scrollTop() || $(this).offset().top - 350;
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
                var defaultRow = ["Username", "Event Name", "Enabled", ""];
                tableRecords.push(defaultRow);
                for (var i = 0; i < data.items.length; i++) {
                    var curFile = data.items[i];
                    var row = [];
                    row.push(crushFTPTools.decodeXML(curFile.username));
                    row.push("");
                    row.push("");
                    row.push("");
                    tableRecords.push(row);
                    if(curFile.events && curFile.events.length>0){
                        curFile.events.forEach(function(folder){
                            var folderRow = [];
                            folderRow.push("");
                            folderRow.push(crushFTPTools.decodeXML(folder.name));
                            folderRow.push(folder.enabled === "true" ? "Yes" : "No");
                            folderRow.push("");
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
            }), "UserEvents.xlsx");
        });
    } else {
        $('.has-report-data').hide();
    }
}