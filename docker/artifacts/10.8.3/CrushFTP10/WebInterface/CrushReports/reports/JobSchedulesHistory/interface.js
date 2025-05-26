/*Report interface*/

crushReports.reports.JobSchedulesHistory = function(data, tpl) {
    /*Get references from main file*/
    var config = crushReports.config;
    var isEmbed = crushReports.isEmbed;
    var utils = crushReports.utils;
    var XLSUtils = crushReports.XLSUtils;
    var getColorCode = crushReports.getColorCode;
    var getFileExtension = crushReports.getFileExtension;
    var getPerc = crushReports.getPerc;
    var loader = crushReports.loader;

    var icon = "fa-clock-o";
    var title = "Job Schedule History";
    var desc = "This report provides summary of job history";
    config.reportIcon.addClass(icon);
    config.reportTitle.text(title);
    config.reportDesc.text(desc);

    var content = $(tpl).find("#html-content").html();
    config.reportContent.empty().append(content);
    var template = $(tpl).find("#template").html();

    var x = $(data).find("results:first");

    var jobs = $(x).find("jobs_subitem");
    var totalJobs = jobs.length;

    function processData(_data) {
        var total = 0,
            items = [],
            completed = 0,
            completedErrors = 0,
            running = 0,
            paused = 0,
            cancelled = 0,
            mostCount = 0,
            maxTime = 0,
            maxCountJob = "-",
            maxTimeJob = "-",
            counts = {};
        $(_data).each(function() {
            total++;
            var start = $(this).find("start:first").text();
            var end = $(this).find("end:first").text();
            var scheduleName = $(this).find("scheduleName:first").text();
            var status = $(this).find("status:first").text();
            var log_file = $(this).find("log_file:first").text();

            var startTime = moment(new Date(parseInt(start)));
            var endTime = end ? moment(new Date(parseInt(end))) : "-";
            var seconds = end ? endTime.diff(startTime, 'seconds') : "-";

            items.push({
                start : start,
                end : end,
                startDate : startTime.valueOf ? startTime.valueOf() : startTime,
                endDate : endTime.valueOf ? endTime.valueOf() : endTime,
                scheduleName : crushFTPTools.xmlEncode(scheduleName),
                status : status,
                log_file : log_file,
                seconds : seconds,
                formattedTime : crushFTP.methods.formatTime("" + seconds)
            });

            if(status == "completed")
                completed++;
            if(status == "completed-errors")
                completedErrors++;
            if(status == "running")
                running++;
            if(status == "paused")
                paused++;
            if(status == "cancelled")
                cancelled++;

            if(seconds>maxTime){
                maxTime = seconds;
                maxTimeJob = crushFTPTools.xmlEncode(scheduleName);
            }
            counts[crushFTPTools.xmlEncode(scheduleName)] = counts[crushFTPTools.xmlEncode(scheduleName)] || 0;
            counts[crushFTPTools.xmlEncode(scheduleName)] += 1;
        });
        for(var key in counts){
            if(counts[key]>mostCount){
                mostCount = counts[key];
                maxCountJob = key;
            }
        }
        return {
            total : total,
            items : items,
            completed : completed,
            completedErrors : completedErrors,
            running : running,
            paused : paused,
            cancelled : cancelled,
            mostCount : mostCount,
            maxTime : maxTime,
            maxCountJob : maxCountJob,
            maxTimeJob : maxTimeJob
        }
    };

    var jobsData = processData(jobs);

    var panel = config.reportContent;

    /*Stats*/
    var stats = panel.find(".graph-stats");
    stats.find(".total-jobs").text(jobsData.total);
    stats.find(".total-running").text(jobsData.running);
    stats.find(".total-completed").text(jobsData.completed);
    stats.find(".total-completed-error").text(jobsData.completedErrors);
    stats.find(".total-paused").text(jobsData.paused);
    stats.find(".total-cancelled").text(jobsData.cancelled);
    stats.find(".max-run-job").text(jobsData.maxCountJob);
    stats.find(".max-run-job-count").text(jobsData.mostCount);
    stats.find(".max-run-time-job").text(jobsData.maxTimeJob);
    stats.find(".max-run-job-time").text(crushFTP.methods.formatTime(""+jobsData.maxTime));

    var tables = panel.find(".tables").empty();
    var shareContent = $(template.replace(/\$type/g, "jobs"));
    tables.append(shareContent);

    var columns = [{
        "data": "scheduleName"
    }, {
        "data": "status"
    }, {
        "data": "seconds",
        "render": function(data) {
            data = data || 0;
            if(data === "-")
                return data;
            return crushFTP.methods.formatTime(""+data);
        },
        "orderData": [6]
    }, {
        "data": "startDate",
        "render": function(data) {
            return crushReports.formatDate(data, true);
        },
        "orderData": [7]
    }, {
        "data": "endDate",
        "render": function(data) {
            return crushReports.formatDate(data, true);
        },
        "orderData": [8]
    }, {
        "data": "log_file",
        "render" : function(data){
            return "<a target='_blank' href='/WebInterface/admin/log.html?file="+data+"'>Show Log</a>"
        }
    },
    {
        "data" : "seconds",
        visible : false
    },
    {
        "data" : "startDate",
        visible : false
    },
    {
        "data" : "endDate",
        visible : false
    }];

    var jobsTable = $('#jobs_dataRecord').find(".dataTable");
    var maxwidth = '150px';
    var jobsTableDT = jobsTable.DataTable({
        "language": {
            "emptyTable": "No data available"
        },
        data: jobsData.items,
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
    var jobsDonutData = [];
    var jobsDonutColors = [];

    var perc = getPerc(jobsData.completed, jobsData.total);
    jobsDonutData.push({
        label: "Completed",
        value: jobsData.completed,
        perc: perc
    });
    jobsDonutColors.push(getColorCode(perc));

    perc = getPerc(jobsData.completedErrors, jobsData.total);
    jobsDonutData.push({
        label: "Completed-errors",
        value: jobsData.completedErrors,
        perc: perc
    });
    jobsDonutColors.push(getColorCode(perc));

    perc = getPerc(jobsData.running, jobsData.total);
    jobsDonutData.push({
        label: "Running",
        value: jobsData.running,
        perc: perc
    });
    jobsDonutColors.push(getColorCode(perc));

    perc = getPerc(jobsData.paused, jobsData.total);
    jobsDonutData.push({
        label: "Paused",
        value: jobsData.paused,
        perc: perc
    });
    jobsDonutColors.push(getColorCode(perc));

    perc = getPerc(jobsData.cancelled, jobsData.total);
    jobsDonutData.push({
        label: "Cancelled",
        value: jobsData.cancelled,
        perc: perc
    });
    jobsDonutColors.push(getColorCode(perc));

    var userDonut = Morris.Donut({
        element: 'typeDonut',
        data: jobsDonutData,
        formatter: function(x, data) {
            return data.perc + "%"
        },
        colors: jobsDonutColors,
        resize: true
    });
    if (jobsDonutColors.length == 0) {
        $('#typeDonut').hide().parent().find(".no-data").show();
    }

    var hasData = jobsData.total;
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
                var defaultRow = ["Job Name", "Status", "Duration", "Started At", "Ended At"];
                tableRecords.push(defaultRow);
                for (var i = 0; i < data.items.length; i++) {
                    var curFile = data.items[i];
                    var row = [];
                    row.push(crushFTPTools.decodeXML(curFile.scheduleName));
                    row.push(curFile.status);
                    row.push(curFile.seconds == "-" ? "-" : crushFTP.methods.formatTime(""+curFile.seconds));
                    row.push(crushReports.formatDate(parseInt(curFile.startDate), true));
                    row.push(crushReports.formatDate(parseInt(curFile.endDate), true));
                    tableRecords.push(row);
                };
                var ws = XLSUtils.sheetFromArrayOfArrays(tableRecords)
                wb.Sheets[sheetName] = ws;
            }
            addType(jobsData, "Jobs");
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
            }), "JobSchedulesHistory.xlsx");
        });
    } else {
        $('.has-report-data').hide();
    }
}