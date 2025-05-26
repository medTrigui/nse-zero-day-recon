/*Report interface*/

crushReports.reports.WhoUploadedFileTemplateFolder = "WhoDownloadedFile";
crushReports.isLoadingScript = true;
console.log("Report:WhoUploadedFile" + " Fetching base report js");
$.getScript("reports/WhoDownloadedFile/interface.js", function(){
    crushReports.reports.WhoUploadedFile = function(data, tpl) {
        crushReports.reports.WhoDownloadedFile(data, tpl, "upload");
    };
    if(crushReports.callbackOnReady)
        crushReports.callbackOnReady();
});