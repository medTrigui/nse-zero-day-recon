/*Report interface*/

crushReports.reports.JobSchedules = function(data, tpl) {
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
    var title = "Job Schedules";
    var desc = "This report provides summary of all job schedules";
    config.reportIcon.addClass(icon);
    config.reportTitle.text(title);
    config.reportDesc.text(desc);

    var content = $(tpl).find("#html-content").html();
    config.reportContent.empty().append(content);
    var template = $(tpl).find("#template").html();

    var x = $(data).find("results:first");
    // Not needed as date comes formatted from the server
    // var dfs = utils.getDateFormat(x);
    // var dateFormat = dfs.dateFormat;
    // var dateFormatS = dfs.dateFormatS;
    // var dateFormatT = dfs.dateFormatT;

    var jobs = $(x).find("jobs_subitem");
    var totalJobs = jobs.length;

    function processData(_data) {
        var total = 0,
            items = [],
            active = 0,
            inactive = 0,
            manually = 0,
            minutely = 0,
            daily = 0,
            weekly = 0,
            monthly = 0;
        $(_data).each(function() {
            total++;
            var nextRun = $(this).find("nextRun:first").text();
            var scheduleName = $(this).find("scheduleName:first").text();
            var jobEnabled = $(this).find("jobEnabled:first").text();
            var scheduleType = $(this).find("scheduleType:first").text();
            var scheduleNote = $(this).find("scheduleNote:first").text();

            items.push({
                nextRun : nextRun,
                scheduleName : crushFTPTools.xmlEncode(scheduleName),
                jobEnabled : jobEnabled,
                scheduleType : scheduleType,
                scheduleNote : crushFTPTools.xmlEncode(scheduleNote)
            });
            if(scheduleType.indexOf('manually')>=0){
                manually++;
            }
            else if(scheduleType.indexOf('minutes')>=0){
                minutely++;
            }
            else if(scheduleType.indexOf('days')>=0){
                daily++;
            }
            else if(scheduleType.indexOf('weeks')>=0){
                weekly++;
            }
            else if(scheduleType.indexOf('months')>=0){
                monthly++;
            }
            if(jobEnabled == "true")
                active++;
            else
                inactive++;

        });
        return {
            total : total,
            items : items,
            active : active,
            inactive : inactive,
            manually : manually,
            minutely : minutely,
            daily : daily,
            weekly : weekly,
            monthly : monthly
        }
    };

    var jobsData = processData(jobs);

    var panel = config.reportContent;

    /*Stats*/
    var stats = panel.find(".graph-stats");
    stats.find(".total-shares").text(jobsData.total);
    stats.find(".total-active").text(jobsData.active);
    stats.find(".total-disabled").text(jobsData.inactive);
    stats.find(".total-manually").text(jobsData.manually);
    stats.find(".total-minutely").text(jobsData.minutely);
    stats.find(".total-daily").text(jobsData.daily);
    stats.find(".total-weekly").text(jobsData.weekly);
    stats.find(".total-monthly").text(jobsData.monthly);

    var tables = panel.find(".tables").empty();
    var shareContent = $(template.replace(/\$type/g, "jobs"));
    tables.append(shareContent);

    var columns = [{
        "data": "scheduleName"
    }, {
        "data": "scheduleType"
    }, {
        "data": "nextRun"
    }, {
        "data": "jobEnabled",
        render : function(d){
            return d == "true" ? "Enabled" : "Disabled";
        }
    }, {
        "data": "scheduleNote"
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

    var perc = getPerc(jobsData.manually, jobsData.total);
    jobsDonutData.push({
        label: "Manually",
        value: jobsData.manually,
        perc: perc
    });
    jobsDonutColors.push(getColorCode(perc));

    perc = getPerc(jobsData.minutely, jobsData.total);
    jobsDonutData.push({
        label: "Minutely",
        value: jobsData.minutely,
        perc: perc
    });
    jobsDonutColors.push(getColorCode(perc));

    perc = getPerc(jobsData.daily, jobsData.total);
    jobsDonutData.push({
        label: "Daily",
        value: jobsData.daily,
        perc: perc
    });
    jobsDonutColors.push(getColorCode(perc));

    perc = getPerc(jobsData.weekly, jobsData.total);
    jobsDonutData.push({
        label: "Weekly",
        value: jobsData.weekly,
        perc: perc
    });
    jobsDonutColors.push(getColorCode(perc));

    perc = getPerc(jobsData.monthly, jobsData.total);
    jobsDonutData.push({
        label: "Monthly",
        value: jobsData.monthly,
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
                var defaultRow = ["Job Name", "Type", "Next Run", "Enabled", "Notes"];
                tableRecords.push(defaultRow);
                for (var i = 0; i < data.items.length; i++) {
                    var curFile = data.items[i];
                    var row = [];
                    row.push(crushFTPTools.decodeXML(curFile.scheduleName));
                    row.push(curFile.scheduleType);
                    row.push(curFile.nextRun);
                    row.push(curFile.jobEnabled);
                    row.push(crushFTPTools.decodeXML(curFile.scheduleNote));
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
            }), "JobSchedules.xlsx");
        });
    } else {
        $('.has-report-data').hide();
    }
}