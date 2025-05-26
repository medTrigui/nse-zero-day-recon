/*Report interface*/

crushReports.reports.UserIPs = function(data, tpl) {
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
    var title = "User IPs";
    var desc = "This report provides summary of all user connections";
    config.reportIcon.addClass(icon);
    config.reportTitle.text(title);
    config.reportDesc.text(desc);

    var content = $(tpl).find("#html-content").html();
    config.reportContent.empty().append(content);
    var template = $(tpl).find("#template").html();

    var x = $(data).find("results:first");

    var ips = $(x).find("ips_subitem");
    var totalIPs = ips.length;

    function processData(_data) {
        var total = 0,
            totalCons = 0,
            items = [],
            users = [],
            ips = [];
        $(_data).each(function() {
            total++;
            var count = parseInt($(this).find(" > count:first").text());
            var totalConCount = 0;
            totalCons += count;
            var ip = crushFTPTools.xmlEncode($(this).find(" > ip:first").text());
            var username = crushFTPTools.xmlEncode($(this).find(" > username:first").text());
            var curItems = $(this).find("item");
            var ipConnections = [];
            curItems.each(function(){
                var curCount = parseInt($(this).text());
                totalConCount += curCount;
                ipConnections.push({
                    name : crushFTPTools.xmlEncode(ip) || crushFTPTools.xmlEncode($(this).attr("name")),
                    count : curCount
                });
            });
            users[username] = users[username] || 0;
            users[username] += count;

            ips[ip] = ips[ip] || 0;
            ips[ip] += count;
            items.push({
                totalConCount : totalConCount,
                count : count,
                ip : ip,
                username : username,
                ipConnections : ipConnections
            });
        });
        return {
            total : total,
            items : items,
            totalCons : totalCons,
            users : users,
            ips : ips
        }
    };

    var IPsData = processData(ips);
    var panel = config.reportContent;
    var maxConUserCount = 0;
    var maxConUser = "";
    var userDonutData = [];
    var userDonutColors = [];
    for(var user in IPsData.users){
        var curCount = IPsData.users[user];
        if(typeof curCount == "number"){
            if(curCount>maxConUserCount)
            {
                maxConUserCount = curCount;
                maxConUser = user;
            }
            var perc = getPerc(curCount, IPsData.totalCons);
            userDonutData.push({
                label: user,
                value: curCount,
                perc: perc
            });
            userDonutColors.push(getColorCode(perc));
        }
    }

    var maxConIPCount = 0;
    var maxConIP = "";
    var IPDonutData = [];
    var IPDonutColors = [];
    for(var ip in IPsData.ips){
        var curCount = IPsData.ips[ip];
        if(typeof curCount == "number"){
            if(curCount>maxConIPCount)
            {
                maxConIPCount = curCount;
                maxConIP = ip;
            }
            var perc = getPerc(curCount, IPsData.totalCons);
            IPDonutData.push({
                label: ip,
                value: curCount,
                perc: perc
            });
            IPDonutColors.push(getColorCode(perc));
        }
    }
    /*Stats*/
    var stats = panel.find(".graph-stats");
    stats.find(".total-connections").text(IPsData.totalCons);
    stats.find(".max-con-user").text(maxConUser);
    stats.find(".max-con-user-count").text(maxConUserCount);
    stats.find(".max-con-ip").text(maxConIP);
    stats.find(".max-con-ip-count").text(maxConIPCount);

    var tables = panel.find(".tables").empty();
    var shareContent = $(template.replace(/\$type/g, "ips"));
    tables.append(shareContent);

    var showIPs = utils.getConfig("showIPs_2", true);
    var showCounts = utils.getConfig("showCounts_2", true);

    var columns = [{
        "data": "username",
        "render": function(data, t, row) {
            return data;// + " - "+row.ip+"";
        },
         "orderData": [3]
    }, {
        data : "count",
        visible : showCounts
    }, {
        data : "null",
        render : function(data, t, row){
            var ipCons = row.ipConnections;
            var conData = [];
            ipCons.forEach(function(ip){
                conData.push("" + ip.name + " (" + ip.count + ")");
            });
            return conData.join("<br>");
        },
        visible : showIPs,
        "orderData": [4]
    }, {
        data : "username",
        visible : false
    }, {
        data : "totalConCount",
        visible : false
    }];

    var ipsTable = $('#ips_dataRecord').find(".dataTable");
    var maxwidth = '150px';
    var ipsTableDT = ipsTable.DataTable({
        "language": {
            "emptyTable": "No data available"
        },
        scroller: false,
        iDisplayLength: 100,
        data: IPsData.items,
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
        element: 'userDonut',
        data: userDonutData,
        formatter: function(x, data) {
            return data.perc + "%"
        },
        colors: userDonutColors,
        resize: true
    });
    if (userDonutColors.length == 0) {
        $('#userDonut').hide().parent().find(".no-data").show();
    }

    /*By IPs donut*/
    var ipsDonut = Morris.Donut({
        element: 'ipDonut',
        data: IPDonutData,
        formatter: function(x, data) {
            return data.perc + "%"
        },
        colors: IPDonutColors,
        resize: true
    });
    if (IPDonutColors.length == 0) {
        $('#ipDonut').hide().parent().find(".no-data").show();
    }

    var hasData = IPsData.total;
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
                var defaultRow = ["Username"];
                if(showCounts)
                    defaultRow.push("Connections");
                if(showIPs)
                    defaultRow.push("IPs");
                tableRecords.push(defaultRow);
                for (var i = 0; i < data.items.length; i++) {
                    var curFile = data.items[i];
                    var ipCons = curFile.ipConnections;
                    var conData = [];
                    ipCons.forEach(function(ip){
                        conData.push("" + crushFTPTools.decodeXML(ip.name) + "(" + ip.count + ")");
                    });
                    var row = [];
                    row.push(crushFTPTools.decodeXML(curFile.username));
                    if(showCounts)
                        row.push(curFile.count);
                    if(showIPs)
                        row.push(conData.join("\n"));
                    tableRecords.push(row);
                };
                var ws = XLSUtils.sheetFromArrayOfArrays(tableRecords)
                wb.Sheets[sheetName] = ws;
            }
            addType(IPsData, "IPs");
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
            }), "UserIPs.xlsx");
        });
    } else {
        $('.has-report-data').hide();
    }
}