/*Report interface*/
crushReports.reports.WhoDeletedFileTemplateFolder = "WhoDownloadedFile";
crushReports.isLoadingScript = true;
$.getScript("reports/WhoDownloadedFile/interface.js", function(){
    crushReports.reports.WhoDeletedFile = function(data, tpl) {
        crushReports.reports.WhoDownloadedFile(data, tpl, "delete");
    };
    if(crushReports.callbackOnReady)
        crushReports.callbackOnReady();
});