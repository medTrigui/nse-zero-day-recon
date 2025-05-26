/*Report interface*/

crushReports.reports.TopDownloadsUploads = function(data, tpl) {
    /*Get references from main file*/
    var config = crushReports.config;
    var isEmbed = crushReports.isEmbed;
    var utils = crushReports.utils;
    var XLSUtils = crushReports.XLSUtils;
    var getColorCode = crushReports.getColorCode;
    var getFileExtension = crushReports.getFileExtension;
    var getPerc = crushReports.getPerc;
    var loader = crushReports.loader;

    var icon = "fa-exchange rotate-90";
    var title = "Top Downloads/Uploads";
    var desc = "This report provides summary of top uploads and downloads made between selected period.";
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

    var uploads = $(x).find("uploads_subitem");
    var totalUploads = uploads.length;
    var totalUploadSize = 0;
    var uploadExts = {};
    var uploadFiles = [];

    var downloads = $(x).find("downloads_subitem");
    var totalDownloads = downloads.length;
    var totalDownloadSize = 0;
    var downloadExts = {};
    var downloadFiles = [];

    function processData(_data) {
        var total = 0,
            files = [],
            exts = {},
            largestSize = 0,
            largestFile = "";
        $(_data).each(function() {
            total += parseInt($(this).find("size:first").text());
            var name = $(this).find("name:first").text();
            var size = parseInt($(this).find("size:first").text());
            var path = $(this).find("path:first").text();
            var url = $(this).find("url:first").text();
            var metaInfo = $(this).find("metaInfo:first");
            var speed = parseInt($(this).find("averageSpeed:first").text());
            if (size > largestSize) {
                largestSize = size;
                largestFile = name;
            }
            files.push({
                name: crushFTPTools.xmlEncode(name),
                size: utils.formatBytes(size),
                path: crushFTPTools.xmlEncode(path),
                url: crushFTPTools.xmlEncode(url),
                speed: utils.formatBytes(speed * 1024),
                metaInfo: metaInfo
            });
            var ext = getFileExtension(name);
            if (!exts[ext]) {
                exts[ext] = 1;
            } else {
                exts[ext] += 1;
            }
        });
        return {
            totalCount: _data.length,
            total: total,
            totalFormatted: utils.formatBytes(parseInt(total)),
            files: files,
            exts: exts,
            largestSize: utils.formatBytes(largestSize),
            largestFile: largestFile
        }
    };

    var uploadData = processData(uploads);
    var downloadData = processData(downloads);

    var panel = config.reportContent;

    /*Stats*/
    var startDate = $(x).find("startDate:first").text().split(" ")[0];
    var endDate = $(x).find("endDate:first").text().split(" ")[0];
    var stats = panel.find(".graph-stats");
    stats.find(".start-date").text(utils.getDate(startDate, dateFormatS, ""));
    stats.find(".end-date").text(utils.getDate(endDate, dateFormatS, ""));

    stats.find(".total-download").text(downloadData.totalCount);
    stats.find(".download-size").text(downloadData.totalFormatted);
    downloadData.largestFile = downloadData.largestFile || "-";
    stats.find(".largest-file-download-name").text(downloadData.largestFile);
    stats.find(".largest-file-download-size").text(downloadData.largestSize);

    stats.find(".total-upload").text(uploadData.totalCount);
    stats.find(".upload-size").text(uploadData.totalFormatted);
    uploadData.largestFile = uploadData.largestFile || "-";
    stats.find(".largest-file-upload-name").text(uploadData.largestFile);
    stats.find(".largest-file-upload-size").text(uploadData.largestSize);

    if (uploadData.total || downloadData.total) {
        var sum = downloadData.total + uploadData.total;
        var downPerc = getPerc(downloadData.total, sum);
        var upPerc = getPerc(uploadData.total, sum);
        var donutData = [{
            label: "Downloads",
            value: downloadData.total,
            perc: downPerc
        }, {
            label: "Uploads",
            value: uploadData.total,
            perc: upPerc
        }];

        var colors = [];
        colors.push(getColorCode(downPerc));
        colors.push(getColorCode(upPerc));

        var donut = Morris.Donut({
            element: 'uploadDownloadDonut',
            data: donutData,
            formatter: function(x, data) {
                return data.perc + "%"
            },
            colors: colors,
            resize: true
        });
    } else {
        $('#uploadDownloadDonut, .has-report-data').hide().parent().find(".no-data").show();
        return;
    }

    function showFormMetaInfo(data) {
        // `d` is the original data object for the row
        var formData = data.metaInfo;
        var rows = [];
        if (formData && formData.length > 0) {
            formData.find("*").each(function(index) {
                rows.push("<tr><td style='width:200px;text-align:right;'>" + crushFTPTools.xmlEncode($(this).get(0).tagName) + "</td><td>" + crushFTPTools.xmlEncode($(this).text()) + "</td></tr>");
            });
        } else {
            rows.push("<tr><td colspan='2' class='text-center'>Nothing to display</td></tr>");
        }
        return '<h5 class="sub-title">Form Data :</h5><table class="table table-striped table-bordered download-table dataTable no-footer" cellpadding="5" cellspacing="0" border="0" style="border-top:1px solid #ddd;">' +
            rows.join("") +
            '</table>';
    }

    var showPath = utils.getConfig("showPaths_1", true);
    var showURLs = utils.getConfig("showURLs_1", true);
    var showFormInfo = utils.getConfig("showFormInfo_1", true);

    var tables = panel.find(".tables").empty();
    var columns = [{
        "data": "name"
    }, {
        "data": "size"
    }, {
        "data": "speed",
        render : function(data){
            return data + "/s";
        }
    }, {
        "data": "path",
        visible : showPath
    }, {
        "data": "url",
        visible : showURLs
    }, {
        "className": 'details-control text-center',
        "orderable": false,
        "data": null,
        "defaultContent": '<a href="javascript:void(0);"><i class="fa fa-list-alt"></i> Form Data</a>',
        visible : showFormInfo
    }];

    var uploadContent = $(template.replace(/\$type/g, "upload"));
    tables.append(uploadContent);
    var maxwidth = '150px';
    var tableUpload = $('#upload_dataRecord').find(".dataTable");
    var tableUploadDT = tableUpload.DataTable({
        "language": {
            "emptyTable": "No data available for uploads"
        },
        data: uploadData.files,
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
            [0, 'desc']
        ]
    });

    tableUpload.on('click', 'td.details-control', function() {
        var tr = $(this).closest('tr');
        var row = tableUploadDT.row(tr);
        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
            tableUploadDT.columns.adjust().draw();
        } else {
            // Open this row
            if (tableUpload.height() < 300) {
                tableUpload.closest('.dataTables_scrollBody').css('height', '500px');
                tableUploadDT.columns.adjust().draw();
            }
            row.child(showFormMetaInfo(row.data())).show();
            tr.addClass('shown');
        }
    });

    /*File extensions donut*/
    var uploadExtDonutData = [];
    var extUploadColors = [];
    for (var ext in uploadData.exts) {
        var curExt = uploadData.exts[ext];
        var perc = getPerc(curExt, uploadData.totalCount);
        uploadExtDonutData.push({
            label: "." + ext,
            value: curExt,
            perc: perc
        });
        extUploadColors.push(getColorCode(perc));
    }
    var extDonut = Morris.Donut({
        element: 'extDonutupload',
        data: uploadExtDonutData,
        formatter: function(x, data) {
            return "total " + x + " file(s) : ~" + data.perc + "%"
        },
        colors: extUploadColors,
        resize: true
    });
    if (uploadExtDonutData.length == 0) {
        $('#extDonutupload').hide().parent().find(".no-data").show();
    }

    var downloadContent = $(template.replace(/\$type/g, "download"));
    tables.append(downloadContent);
    var tableDownload = $('#download_dataRecord').find(".dataTable");
    if (!showPath) {
        tableDownload.find(".path").remove();
    }

    if (!showURLs) {
        tableDownload.find(".url").remove();
    }

    if (!showFormInfo) {
        tableDownload.find(".formInfo").remove();
    }

    tableDownload.DataTable({
        "language": {
            "emptyTable": "No data available for downloads"
        },
        data: downloadData.files,
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
            [0, 'desc']
        ]
    });

    /*File extensions donut*/
    var downloadExtDonutData = [];
    var extDownloadColors = [];
    for (var ext in downloadData.exts) {
        var curExt = downloadData.exts[ext];
        var perc = getPerc(curExt, downloadData.totalCount);
        downloadExtDonutData.push({
            label: "." + ext,
            value: curExt,
            perc: perc
        });
        extDownloadColors.push(getColorCode(perc));
    }
    var extDonut = Morris.Donut({
        element: 'extDonutdownload',
        data: downloadExtDonutData,
        formatter: function(x, data) {
            return "total " + x + " file(s) : ~" + data.perc + "%"
        },
        colors: extDownloadColors,
        resize: true
    });
    if (downloadExtDonutData.length == 0) {
        $('#extDonutdownload').hide().parent().find(".no-data").show();
    }

    var hasData = uploadData.total || downloadData.total;
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
                var defaultRow = ["Name", "Size", "Avg. Speed"];
                if (showPath)
                    defaultRow.push("Path");
                if (showURLs)
                    defaultRow.push("URL");
                if (showFormInfo)
                    defaultRow.push("Form Info");
                tableRecords.push(defaultRow);
                for (var i = 0; i < data.files.length; i++) {
                    var curFile = data.files[i];
                    var row = [];
                    row.push(crushFTPTools.decodeXML(curFile.name));
                    row.push(curFile.size);
                    row.push(curFile.speed);
                    if (showPath)
                        row.push(crushFTPTools.decodeXML(curFile.path));
                    if (showURLs)
                        row.push(crushFTPTools.decodeXML(curFile.url));
                    if (showFormInfo) {
                        row.push(curFile.metaInfo.find("*").map(function() {
                            return $.trim($(this).get(0).tagName + " = " + $(this).text());
                        }).get().join("\n"));
                    }
                    tableRecords.push(row);
                };
                var ws = XLSUtils.sheetFromArrayOfArrays(tableRecords)
                wb.Sheets[sheetName] = ws;
            }
            addType(downloadData, "Download");
            addType(uploadData, "Upload");
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
            }), "TopDownloadsUploads.xlsx");
        });
    } else {
        $('.has-report-data').hide();
    }
}