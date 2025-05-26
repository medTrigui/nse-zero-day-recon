/*Report interface*/

crushReports.reports.UploadDownloadRatios = function(data, tpl) {
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
    var title = "Upload/Download Ratio";
    var desc = "This report provides user wise upload/download ratio within selected period.";
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

    var ratios = $(x).find("ratios_subitem");

    function processData(_data) {
        var total = 0,
            items = [],
            totalTransfersCount = 0,
            totalTransfersSize = 0,
            totalDownloadCount = 0,
            totalDownloadSize = 0,
            totalUploadCount = 0,
            totalUploadSize = 0,
            maxDownloadUser = "",
            maxDownloadSize = 0,
            maxUploadUser = "",
            maxUploadSize = 0;
        $(_data).each(function() {
            total++;
            var downloadBytes = parseInt($(this).find(" > downloadBytes:first").text());
            var uploadCount = parseInt($(this).find(" > uploadCount:first").text());
            var downloadCount = parseInt($(this).find(" > downloadCount:first").text());
            var uploadBytes = parseInt($(this).find(" > uploadBytes:first").text());
            var username = $(this).find(" > username:first").text();

            totalDownloadCount += downloadCount;
            totalDownloadSize += downloadBytes;
            totalUploadCount += uploadCount;
            totalUploadSize += uploadBytes;
            totalTransfersCount += (downloadCount + uploadCount);
            totalTransfersSize += (downloadBytes + uploadBytes);
            if(downloadBytes>maxDownloadSize){
                maxDownloadSize = downloadBytes;
                maxDownloadUser = username;
            }

            if(uploadBytes>maxUploadSize){
                maxUploadSize = uploadBytes;
                maxUploadUser = username;
            }

            var totalBytes = downloadBytes + uploadBytes;
            var uploadPerc = getPerc(uploadBytes, totalBytes);
            var downloadPerc = getPerc(downloadBytes, totalBytes);

            items.push({
                downloadBytes : downloadBytes,
                uploadCount : uploadCount,
                downloadCount : downloadCount,
                uploadBytes : uploadBytes,
                username : crushFTPTools.xmlEncode(username),
                totalBytes : totalBytes,
                uploadPerc : uploadPerc,
                downloadPerc : downloadPerc
            });
        });
        return {
            total : total,
            items : items,
            totalTransfersCount : totalTransfersCount,
            totalTransfersSize : totalTransfersSize,
            totalDownloadCount : totalDownloadCount,
            totalDownloadSize : totalDownloadSize,
            totalUploadCount : totalUploadCount,
            totalUploadSize : totalUploadSize,
            maxDownloadUser : maxDownloadUser,
            maxDownloadSize : maxDownloadSize,
            maxUploadUser : maxUploadUser,
            maxUploadSize : maxUploadSize
        }
    };

    var ratioData = processData(ratios);

    var panel = config.reportContent;

    /*Stats*/
    var startDate = $(x).find("startDate:first").text().split(" ")[0];
    var endDate = $(x).find("endDate:first").text().split(" ")[0];
    var stats = panel.find(".graph-stats");

    stats.find(".start-date").text(utils.getDate(startDate, dateFormatS, ""));
    stats.find(".end-date").text(utils.getDate(endDate, dateFormatS, ""));
    stats.find(".total-download").text(ratioData.totalDownloadCount);
    stats.find(".download-size").text(utils.formatBytes(ratioData.totalDownloadSize));
    stats.find(".total-upload").text(ratioData.totalUploadCount);
    stats.find(".upload-size").text(utils.formatBytes(ratioData.totalUploadSize));
    stats.find(".max-downloads-user").text(ratioData.maxDownloadUser);
    stats.find(".max-downloads-size").text(utils.formatBytes(ratioData.maxDownloadSize));
    stats.find(".max-uploads-user").text(ratioData.maxUploadUser);
    stats.find(".max-uploads-size").text(utils.formatBytes(ratioData.maxUploadSize));

    var tables = panel.find(".tables").empty();
    var shareContent = $(template.replace(/\$type/g, "ratio"));
    tables.append(shareContent);

    var columns = [{
        "data": "username"
    }, {
        "data": null,
        render : function(d, type, row){
            return "" + row.uploadCount + " ("+utils.formatBytes(row.uploadBytes)+", "+row.uploadPerc+"%)";
        },
        "orderData": [3]
    }, {
        "data": null,
        render : function(d, type, row){
            return "" + row.downloadCount + " ("+utils.formatBytes(row.downloadBytes)+", "+row.downloadPerc+"%)";
        },
        "orderData": [4]
    }, {
        "data": "uploadPerc",
        visible : false
    }, {
        "data": "downloadPerc",
        visible : false
    }];

    var ratioTable = $('#ratio_dataRecord').find(".dataTable");
    var maxwidth = '150px';
    var usersTableDT = ratioTable.DataTable({
        "language": {
            "emptyTable": "No data available"
        },
        data: ratioData.items,
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

    /*Donut based on size*/
    var sizeDonutData = [];
    var sizeDonutColors = [];
    var perc = getPerc(ratioData.totalUploadSize, ratioData.totalTransfersSize);
    sizeDonutData.push({
        label: "Uploads",
        value: ratioData.totalUploadSize,
        perc: perc
    });
    sizeDonutColors.push(getColorCode(perc));

    perc = getPerc(ratioData.totalDownloadSize, ratioData.totalTransfersSize);
    sizeDonutData.push({
        label: "Downloads",
        value: ratioData.totalDownloadSize,
        perc: perc
    });
    sizeDonutColors.push(getColorCode(perc));

    if (sizeDonutColors.length == 0) {
        $('#sizeDonut').hide().parent().find(".no-data").show();
    }
    else{
        var userDonut = Morris.Donut({
            element: 'sizeDonut',
            data: sizeDonutData,
            formatter: function(x, data) {
                return utils.formatBytes(data.value) + " (" + data.perc + "%)"
            },
            colors: sizeDonutColors,
            resize: true
        });
    }

    /*Donut based on count*/
    var countDonutData = [];
    var countDonutColors = [];
    var perc = getPerc(ratioData.totalUploadCount, ratioData.totalTransfersCount);
    countDonutData.push({
        label: "Uploads",
        value: ratioData.totalUploadCount,
        perc: perc
    });
    countDonutColors.push(getColorCode(perc));

    perc = getPerc(ratioData.totalDownloadCount, ratioData.totalTransfersCount);
    countDonutData.push({
        label: "Downloads",
        value: ratioData.totalDownloadCount,
        perc: perc
    });
    countDonutColors.push(getColorCode(perc));

    if (countDonutColors.length == 0) {
        $('#countDonut').hide().parent().find(".no-data").show();
    }
    else{
        var userDonut = Morris.Donut({
            element: 'countDonut',
            data: countDonutData,
            formatter: function(x, data) {
                return data.value + " (" + data.perc + "%)"
            },
            colors: countDonutColors,
            resize: true
        });
    }

    /*Donut based on uploads*/
    var uploadsDonutData = [];
    var uploadsDonutColors = [];
    var downloadsDonutData = [];
    var downloadsDonutColors = [];
    for (var i = 0; i < ratioData.items.length; i++) {
        var curItem = ratioData.items[i];
        var upPerc = getPerc(curItem.uploadBytes, ratioData.totalUploadSize);
        var downPerc = getPerc(curItem.downloadBytes, ratioData.totalDownloadSize);
        uploadsDonutData.push({
            label: curItem.username,
            value: curItem.uploadBytes,
            perc: upPerc
        });
        uploadsDonutColors.push(getColorCode(upPerc));

        downloadsDonutData.push({
            label: curItem.username,
            value: curItem.downloadBytes,
            perc: downPerc
        });
        downloadsDonutColors.push(getColorCode(downPerc));
    };

    if (uploadsDonutColors.length == 0) {
        $('#uploadDonut').hide().parent().find(".no-data").show();
    }
    else{
        Morris.Donut({
            element: 'uploadDonut',
            data: uploadsDonutData,
            formatter: function(x, data) {
                return utils.formatBytes(data.value) + " (" + data.perc + "%)"
            },
            colors: uploadsDonutColors,
            resize: true
        });
    }

    if (downloadsDonutColors.length == 0) {
        $('#downloadDonut').hide().parent().find(".no-data").show();
    }
    else{
        Morris.Donut({
            element: 'downloadDonut',
            data: downloadsDonutData,
            formatter: function(x, data) {
                return utils.formatBytes(data.value) + " (" + data.perc + "%)"
            },
            colors: downloadsDonutColors,
            resize: true
        });
    }

    var hasData = ratioData.total;
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
                var defaultRow = ["Username", "Total Uploads", "Upload Size", "Upload Perc", "Total Downloads", "Download Size", "Download Perc"];
                tableRecords.push(defaultRow);
                for (var i = 0; i < data.items.length; i++) {
                    var curFile = data.items[i];
                    var row = [];
                    row.push(crushFTPTools.decodeXML(curFile.username));
                    row.push(curFile.uploadCount);
                    row.push(curFile.uploadBytes);
                    row.push(curFile.uploadPerc + "%");
                    row.push(curFile.downloadCount);
                    row.push(curFile.downloadBytes);
                    row.push(curFile.downloadPerc + "%");
                    tableRecords.push(row);
                };
                var ws = XLSUtils.sheetFromArrayOfArrays(tableRecords)
                wb.Sheets[sheetName] = ws;
            }
            addType(ratioData, "Ratio");
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
            }), "UploadDownloadRatios.xlsx");
        });
    } else {
        $('.has-report-data').hide();
    }
}