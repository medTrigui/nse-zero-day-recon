var uploadPanelDefaultLocalizations = {
    //Data size format items
    dataByClassFormatBytes: "bytes",
    dataByClassFormatKiloBytes: "KB",
    dataByClassFormatMegaBytes: "MB",
    dataByClassFormatGigaBytes: "GB",
    dataByClassFormatTeraBytes: "TB",
    BrowserUploaderSpeedTimeCalculatingText: "Calculating...",
    uploadWindowTitle: "Files to upload",
    dragDropMsg: "Drag and Drop File Here",
    remove: "Remove",
    removeAllSelected: "All Selected",
    removeAllWithError: "All With Error",
    removeAllUploaded: "All Uploaded",
    removeAllCancelled: "All Canceled",
    removeAllSkipped: "All Skipped",
    removeAll: "All",
    addFiles: "Add files...",
    upload: "Upload",
    uploadSelected: "Upload Selected",
    reuploadAll: "Re-Upload All",
    cancel: "Cancel",
    uploadDetails: "Upload Details",
    overwriteAll: "Overwrite All",
    resumeAll: "Resume All",
    shareUploaded: "Share Uploaded",
    shareSelected: "Share Selected",
    quickFilterSubtext: "Quick Filter...",
    total: "Total",
    filesFailed: "file(s) failed.",
    selectedFiles: "Selected File(s) :",
    size: "Size :",
    filtered: "(Filtered)",
    totalFiles: "Total File(s) :",
    scrollWithActivity: "Scroll with activity",
    writingFile: "Writing file...",
    decompressingFile: "Decompressing file...",
    pleaseWait: "Please wait...",
    uploadedIn: "Uploaded in",
    aMoment: "a moment",
    atAvgSpeedOf: "at average speed of",
    uploadingFailed: "Uploading failed",
    canceled: "Canceled",
    skipped: "Skipped",
    currentSpeed: "Current Speed :",
    averageSpeed: "Average Speed :",
    "of": "of",
    elapsed: "Elapsed",
    remaining: "Remaining",
    waiting: "Waiting..",
    details: "Details",
    overwrite: "Overwrite",
    resume: "Resume",
    reupload: "Re-Upload",
    pause: "Pause",
    paused: "Paused",
    uploading: "Uploading",
    items: "item(s)",
    skip: "Skip",
    cancelAll: "Cancel All",
    OK: 'Yes',
    CANCEL: 'No',
    CONFIRM: "Yes",
    reuploadConfirmation: "It will re-upload all files which are already uploaded, canceled, skipped or failed while uploading and it will overwrite existing files. Are you sure you want to continue?",
    folderUploadNotSupported: "Folder upload is not supported in this browser",
    fileAlreadySelected: "File already added to upload at same location.",
    fileExistsOnServer: "File with same name available on the server.",
    fileNameNotAllowed: "The name contains unsafe characters.",
    fileSizeExceed: "File size exceed.",
    fileTypeNotAllowed: "File type not allowed.",
    fileNameSizeExceed: "File name length exceeds the allowed length of {x} characters",
    maxFilesAllowedInQueueExceed: "Maximum files allowed in a queue {x}",
    filterApplied: "Filter applied",
    noMatchingItemAvailable: "No matching item available.",
    addFilesToUpload: "Add files to upload...",
    file: "File",
    reason: "Reason",
    failedItems: "Failed items",
    ignoreAll: "Ignore All",
    retryAll: "Retry All",
    failedOpeningFile: "while opening the file.",
    cancelConfirmation: "Are you sure you wish to cancel uploading",
    failedClosingFile: "while closing file",
    failedWileRetryingChunk: "while retrying chunk upload.",
    retryingFile: "Retrying uploading file",
    "in": "In",
    seconds: "second(s)",
    skipFile: "Skip File",
    retryNow: "Retry now",
    retryingClosingFile: "Retrying closing file",
    fileExistConfirmation: "File [1] with same size exists, do you want to resend the file?",
    bigFileOverwriteConfirmation: "File [1] on the server is bigger than the one being uploaded, do you want to overwrite?",
    fileExistsOnServerConfirmation: "File [1] exists of the server",
    fileActionTitle: "Please select what you want to do with this file.",
    applyToAll: "Apply to all",
    retryingOpeningFile: "Retrying opening file",
    secondsAbbr: "secs",
    minutesAbbr: "mins",
    hoursAbbr: "hours"
};

var isEmbed = crush.queryString("embed") == "true";
var locs = isEmbed ? parent.window.localizations: window.localizations;

function loc(item, params){
    if(locs){
        var val = locs.uploadPanel && locs.uploadPanel[item] ? locs.uploadPanel[item]: uploadPanelDefaultLocalizations[item] || "";
        if(params){
            for (var i = 0; i < params.length; i++) {
                var _index = i + 1;
                val = val.replace("["+_index+"]", params[i]);
            }
        }
        return val;
    }
}

function locTop(item, params){
    if(locs){
        var val = locs[item] || uploadPanelDefaultLocalizations[item] || "";
        if(params){
            for (var i = 0; i < params.length; i++) {
                var _index = i + 1;
                val = val.replace("["+_index+"]", params[i]);
            }
        }
        return val;
    }
}

function applyLoc(elem){
    elem = elem || $('body');
    $("[loc]", elem).each(function(){
        var txt = loc($(this).attr("loc"));
        if($(this).attr("loctop"))
            txt = locTop($(this).attr("loc"));
        var appendloc = $(this).attr("appendloc") || "";
        var prependloc = $(this).attr("prependloc") || "";
        if(txt)
            $(this).text(prependloc + txt + appendloc);
    });
    $("[locph]", elem).each(function(){
        var txt = loc($(this).attr("locph"));
        var appendloc = $(this).attr("appendloc") || "";
        var prependloc = $(this).attr("prependloc") || "";
        if(txt)
            $(this).attr("placeholder", prependloc + txt + appendloc);
    });
    if(!elem){
        bootbox.addLocale("custom", {
            OK: loc("OK") || 'Yes',
            CANCEL: loc("CANCEL") || 'No',
            CONFIRM: loc("CONFIRM") || "Yes"
        });
    }
    var popupTitle = loc("uploadWindowTitle");
    if(isEmbed && parent.window){
        parent.window.jQuery(".fileRepoHeader").text(popupTitle);
    }
}

function reloadLoc(){
    locs = isEmbed ? parent.window.localizations: window.localizations;
    applyLoc();
}

$(document).ready(function(){
    applyLoc();
});