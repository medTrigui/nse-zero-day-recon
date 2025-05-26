$(function() {
    var loadingIndicatorUpload = $("#loadingIndicatorUpload").hide();
    loadingIndicatorUpload.dialog({
        autoOpen: true,
        dialogClass: "loadingIndicatorWindow",
        closeOnEscape: false,
        draggable: false,
        width: window.loadingIndicatorDialogWidth || 150,
        minHeight: 50,
        modal: true,
        buttons: {},
        resizable: false,
        open: function() {
            $('body').css('overflow','hidden');
        },
        close: function() {
            $('body').css('overflow','auto');
        }
    });
    $('body').append('<div style="visibility:hidden;" id="fileUploadModule"><div class="fileListHeader ui-widget-header ui-corner-all"><span class="fileRepoHeader">Files to upload</span><span style="position:absolute;cursor:pointer;right:7px;top:6px;" class="ui-icon ui-icon-closethick" id="toggleUploadPanel"></span></div><div class="widget-content"><iframe frameborder="0" id="fileUploadIframe" src="/WebInterface/jQuery/upload/index.html?embed=true"></iframe></div></div>').find('#fileUploadIframe').on('load', function() {
        loadingIndicatorUpload.dialog("destroy");
        $("body").trigger("newUploadPanelLoaded");
        if(window.onUploadReady){
            window.onUploadReady();
        }
        window.setUploadPath();
    });

    var fileUploadModule = $('#fileUploadModule');
    fileUploadModule.css("top", 190);
    var fileUploadIframe = $('#fileUploadIframe');
    var toggleUploadPanel = $('#toggleUploadPanel');
    var browseFileButtonPanel = $('#browseFileButtonPanel');
    var viewFileQueue = $('#viewFileQueue');
    var randomUploadPath = "";
    toggleUploadPanel.click(function(){
        window.hideUploadPanel();
    });

    var maxChunkSizeSet = requestRetriesSizeSet = false;
    window.resizeiFramePanel = function(width, height, progress){
        if(width){
            fileUploadIframe.width(width);
            fileUploadModule.width(width);
        }
        if(height){
            fileUploadIframe.height(height);
        }
        fileUploadModule.css("visibility", "visible");
        window.crushUpload = fileUploadIframe[0].contentWindow.crushUpload;
        if(typeof window.maxChunkSize != "undefined" && !maxChunkSizeSet){
            maxChunkSizeSet = true;
            window.crushUpload.maxChunkSize = parseInt(window.maxChunkSize);
        }
        if(typeof window.requestRetries != "undefined" && !requestRetriesSizeSet){
            requestRetriesSizeSet = true;
            window.crushUpload.requestRetries = parseInt(window.requestRetries);
        }
        if(progress){
            window.resizeiFrame();
        }
    }

    window.hideUploadPanel = function(flag){
        $("body").removeClass('upload-window-open');
        if(flag)
            fileUploadModule.hide();
        else
            fileUploadModule.slideUp("fast");
        browseFileButtonPanel.show();
        viewFileQueue.show();
    }

    window.showUploadPanel = function(browse){
        $("body").addClass('upload-window-open');
        viewFileQueue.hide();
        fileUploadModule.slideDown("fast");
        browseFileButtonPanel.hide();
        if(window.crushUpload){
            window.crushUpload.resizeiFrame();
            if(browse)
                window.crushUpload.browseFiles();
        }
        $(window).scrollTop(0);
    }

    window.uploadCancelledNotify = function(){
        $("#mainContent").find("span.refreshButton").trigger("click");
        $.titleAlert("** Cancelled "+locale.fileupload.uploadCompletedText+"**", {
            duration  : 2000
        });
    }

    window.setFocus = function(selected){
        setTimeout(function(){
            $("#fileUploadIframe").contents().find("#filter").click();
        });
    };

    window.reconnect = function(cb){
        window.electronUpdateServerStatus(cb);
    }

    window.isLoggedOut = function(){
        crushUpload.invokeElectronEvent('user-logged-out');
    }

    window.electronInitFn = function(){
        window.electronInit();
    }

    window.setConnectionStatus = function(status){
        if(!status){
            $("#fileUploadIframe").contents().find("body").addClass('offline');
            crushUpload.invokeElectronEvent('disconnected');
        }
        else{
            $("#fileUploadIframe").contents().find("body").removeClass('offline');
            crushUpload.invokeElectronEvent('connected');
        }
    }

    window.resetUploadFormStatus = function(){
        if(window.commonFormPerBatch){
            window.commonUploadFormShown = false;
            window.resetUplodForm = true;
        }
    }

    window.uploadDoneNotify = function(selected, hasError, errmsg){
        errmsg = errmsg || "There was a problem with upload";
        $("#mainContent").find("span.refreshButton").trigger("click");

        $.titleAlert("**"+locale.fileupload.uploadCompletedText+"**", {
            duration  : 2000
        });
        window.resetUploadFormStatus();
        if(window.showUploadNotification)
        {
            if(Notification.permission !== 'granted'){
                Notification.requestPermission();
            }
            if(hasError){
                var n = new Notification(locale.fileupload.errorLabel, {
                    body: " " + errmsg
                });
                $.growlUI(" " + errmsg, "&nbsp;", 30000, "growlError", true);
            }
            else{
                var n = new Notification(locale.fileupload.uploadCompletedText, {
                    body: locale.fileupload.uploadedMultipleFilesText
                });
                if(!window.dontShowUploadQueueCompletedGrowlMessage)
                    $.growlUI(locale.fileupload.uploadCompletedText, "&nbsp;", 30000, false, true);
            }
        }
        else{
            if(hasError){
                $.growlUI(" " + errmsg, "&nbsp;", 30000, "growlError", true);
            }
            else{
                if(!window.dontShowUploadQueueCompletedGrowlMessage)
                    $.growlUI(locale.fileupload.uploadCompletedText, "&nbsp;", 30000, false, true);
            }
        }

        if(window.runBatchCompletedCommandAfterUploadQueueFinishes)
        {
            window.batchComplete();
        }
        if(typeof window.onUploadComplete == "function"){
            window.onUploadComplete();
        }
        if(window.hideUploadBarAfterUpload)
        {
            window.hideUploadPanel();
        }

        var autoShareUploadedItem = $(document).data("autoShareUploadedItem");
        var autoShareUploadedItemInBatch = $(document).data("autoShareUploadedItemInBatch");
        var autoShareUploadedItemNotify = $(document).data("autoShareUploadedItemNotify");
        if(autoShareUploadedItem && autoShareUploadedItem.toLowerCase()=="true")
        {
            setTimeout(function(){
                if(window.crushUpload)
                {
                    var res = window.crushUpload.getItemsToShare(false, autoShareUploadedItemInBatch);
                    if(res && ((res.paths || res.files) && (res.paths.length>0 || res.files.length>0))){
                        var shareMethodUploadedItem = $(document).data("shareMethodUploadedItem");
                        var _continueShare = function() {
                            if(shareMethodUploadedItem && shareMethodUploadedItem.toLowerCase() == "quick")
                            {
                                window.quickShareFile(false, res.paths.join("\r\n"), false, res.files.join("\r\n"));
                            }
                            else
                                window.shareFile(false, res.paths.join("\r\n"), res.files.join("\r\n"));
                            window.onShareComplete = function(url, message, sharedItems){
                                if(message.indexOf("ERROR:") == 0 && message.indexOf("email_failed")>0)
                                {
                                    //Handle error
                                    console.log(message);
                                }
                                else{
                                var ids = res.ids || [];
                                for (var i = 0; i < ids.length; i++) {
                                    window.crushUpload.updateFileMetaData(ids[i], {
                                        sharedURL: url,
                                        shared: true
                                    });
                                }
                                window.setUploadPath();
                                delete window.onShareComplete;
                            }
                            }

                            window.onShareFailed = function(){
                                if(!window.autoShareRetry){
                                    window.autoShareRetry = true;
                                    _continueShare();
                                }
                                else{
                                    console.log("Share failed again..");
                                }
                                delete window.autoShareRetry;
                                delete window.onShareFailed;
                            }

                            if(window.isElectron())
                            {
                                window.onShareComplete = function(url, message, sharedItems){
                                    var ids = res.ids || [];
                                    for (var i = 0; i < ids.length; i++) {
                                        window.crushUpload.updateFileMetaData(ids[i], {
                                            sharedURL: url,
                                            shared: true
                                        });
                                    }
                                    window.setUploadPath();
                                    delete window.onShareComplete;
                                    var loggedInUser = window.userInfo ? window.userInfo.username : "";
                                    var sharedItemsHistory = localStorage.getItem("" + loggedInUser + "_share_history");
                                    sharedItemsHistory = sharedItemsHistory ? JSON.parse(sharedItemsHistory) : [];
                                    var format = window.customDateFormat || "mm/dd/yyyy";
                                    format = format.replace(/:mm/g, ":nn");
                                    var timeFormat = window.customTimeFormat || "hh:nn:ss TT";
                                    var _date = new Date();
                                    var formattedFullDate;
                                    if(format.toLowerCase().indexOf("hh")<0)
                                        formattedFullDate = _date.format(format.replace("MMM","M").replace("MM","mm") + " " + timeFormat);
                                    else
                                        formattedFullDate = _date.format(format.replace("MMM","M").replace("MM","mm"));
                                    sharedItemsHistory.push({
                                        time: formattedFullDate,
                                        timestamp: _date.getTime(),
                                        id: "i" + generateRandomPassword(8),
                                        url: url,
                                        message: message,
                                        sharedItems: unescape(sharedItems)
                                    });
                                    localStorage.setItem("" + loggedInUser + "_share_history", JSON.stringify(sharedItemsHistory));
                                    crushUpload.invokeElectronEvent('share-link', {url: url, message: message, sharedItems: unescape(sharedItems)});
                                }
                            }
                        }
                        setTimeout(_continueShare);
                    }
                    if(autoShareUploadedItemNotify)
                    {
                        setTimeout(function(){
                            var shareReadyMsg = window.localizations.shareUploadedItemsMessage || "Your files are uploaded and ready to share.";
                            $.crushNotify({
                                message : shareReadyMsg,
                                playSound : true,
                                alert: false,
                                flashTitle : true,
                                browserNotification : true
                            })
                        },1000);
                    }
                    setTimeout(function(){
                        if(window.autoRemoveUploadedItemFromList)
                        {
                            window.crushUpload.removeUploaded();
                            window.hideUploadPanel();
                        }
                    }, 100);
                }
            }, 100);
        }
        else
        {
            setTimeout(function(){
                if(window.autoRemoveUploadedItemFromList)
                {
                    window.crushUpload.removeUploaded();
                    window.hideUploadPanel();
                }
            }, 100);
        }
    }

    window.shareUploaded = function(selected){
        if(window.crushUpload)
        {
            selected = selected || false;
            var autoShareUploadedItemInBatch = $(document).data("autoShareUploadedItemInBatch");
            var res = window.crushUpload.getItemsToShare(selected, autoShareUploadedItemInBatch);
            if(res && ((res.paths || res.files) && (res.paths.length>0 || res.files.length>0))){
                var shareMethodUploadedItem = $(document).data("shareMethodUploadedItem");
                var _continueShare = function() {
                    if(shareMethodUploadedItem && shareMethodUploadedItem.toLowerCase() == "quick")
                    {
                        window.quickShareFile(false, res.paths.join("\r\n"), false, res.files.join("\r\n"));
                    }
                    else
                        window.shareFile(false, res.paths.join("\r\n"), res.files.join("\r\n"));

                    window.onShareComplete = function(url, message, sharedItems){
                        var ids = res.ids || [];
                        for (var i = 0; i < ids.length; i++) {
                            window.crushUpload.updateFileMetaData(ids[i], {
                                sharedURL: url,
                                shared: true
                            });
                        }
                        delete window.onShareComplete;
                    }
                }
                setTimeout(_continueShare);
            }
        }
    }

    window.shareSelected = function(){
        window.shareUploaded(true);
    }

    window.currentPath = function(){
        var path = window.defaultUploadPath || hashListener.getHash().toString().replace("#", "");
        try{
            path = decodeURIComponent(path);
        }catch(ex){
            path = unescape(path);
        }
        if(randomUploadPath){
            path = path + randomUploadPath;
        }
        return path;
    }

    window.resizeiFrame = function(){
        if(fileUploadModule.data("resized"))
        {
            var width = fileUploadModule.width();
            var height = fileUploadModule.height();
            window.crushUpload.resizeList(width, height);
        }
    }

    fileUploadModule.draggable({
        handle : ".fileListHeader",
        containment : "document",
        iframeFix : true
    }).resizable({
        containment: "document",
        minHeight: 350,
        minWidth: 640,
        helper: "ui-resizable-helper",
        start: function(event, ui) {
            fileUploadIframe.css('pointer-events','none');
        },
        stop: function(event, ui) {
            fileUploadModule.data("resized", true);
            fileUploadIframe.css('pointer-events','auto');
            resizeiFrame(ui.size);
            //window.crushUpload.resizeList(size.width, size.height);
        }
    });

    window.getReverseProxyPath = function(){
        try{
            var ajaxURL = window.ajaxCallURL;
            var proxy = ajaxURL.substring(0, ajaxURL.indexOf("/Web" + "Interface/"));
            return proxy;
        }
        catch(ex){
            return "";
        }
    }

    window.autoStartUpload = function(){
        return $.cookie($.CrushFTP.Options.CookieAutoUploadFlag) + "" == "true";
    };

    window.isCommonFormShown = function(){
        return window.commonUploadFormShown;
    };

    window.getMetaInfo = function(){
        return window.metaInfo;
    };

    window.maxFilesAllowedInQueue = function(){
        return localStorage["wi_upload_count"] ? parseInt(localStorage["wi_upload_count"]) : window.maxFilesInQueue;
    };

    window.maxFilesnameLength = function(){
        return window.maxFileNameLengthInUpload || 0;
    };

    window.maxFilesReached = function(){
        $.growlUI(getLocalizationKeyExternal("MaxUploadFilesCountReachedGrowlText"), getLocalizationKeyExternal("MaxUploadFilesCountReachedGrowlDesc") + window.maxFilesAllowedInQueue(), 3000, "growlError");
    }

    window.folderUploadNotAllowed = function(){
        $.growlUI(getLocalizationKeyExternal("AdvancedUploadDirNotAllowedText"), getLocalizationKeyExternal("AdvancedUploadDirNotAllowedDescText"), 3000, "growlError");
    }

    window.urlCopied = function(){
        $.growlUI("URL copied to clipboard", "&nbsp;", 3000);
    }

    window.showUploadFormAdvanced = function(showCommonForm, index, items, direct){
        if(items && items.length)
        {
            if(window.maxUploadItemsBeforeShowingWarning && items.length>window.maxUploadItemsBeforeShowingWarning){
                $.growlUI("Warning", window.maxUploadItemsWarningMessage || getLocalizationKeyExternal("maxUploadItemsWarningMessage"), 3000, "growlError", true);
            }
        }
        return $.CrushFTP.showUploadFormAdvanced(showCommonForm, index, items, direct);
    };

    window.fileExistsOnServer = function(name, path, realCheck){
        if(randomUploadPath)return false;
        return $.CrushFTP.checkFileExistOnServer(name, path, realCheck);
    }

    window.folderExistsOnServer = function(folder){
        return $.CrushFTP.checkFolderExistOnServer(folder);
    }

    window.isFileTypeAllowed = function(name){
        return $.CrushFTP.isFileTypeAllowed(name);
    }

    window.hasUnsafeChars = function(name, fullPath){
        return $.CrushFTP.hasUnsafeChars(name, fullPath);
    }

    window.doesFileSizeExceed = function(size){
        return $.CrushFTP.doesFileSizeExceed(size);
    }

    window.doesFileNameSizeExceed = function(name){
        return $.CrushFTP.doesFileNameSizeExceed(name);
    }

    window.doesFileSizeExceedAllowedSize = function(size){
        return $.CrushFTP.doesFileSizeExceedAllowedSize(size);
    }

    window.checkCommonUploadForm = function(){
        if($.CrushFTP && $.CrushFTP.checkUploadForm)
            $.CrushFTP.checkUploadForm();
    }

    window.uploadInProgress = function(flag){
        $.CrushFTP.UploadProgressing = flag;
    }

    window.tempFileExtensionWhileUploading = function(){
        return window.temp_upload_ext;
    }

    window.alternateDomains = function(){
        return window.alternate_domains || [];
    }

    window.uploadShowNameInsteadOfPath = function() {
        if(window.isElectron()){
            return true;
        }
        return window.uploadWindowShowNameInsteadOfFullPath;
    }

    window.disableDND = function() {
        return window.disableDragDropUpload;
    }

    window.disableUploadingDirs = function() {
        return window.blockUploadingDirs;
    }

    window.hasWritePermission = function(){
        var privs = $(document).data("curDirPrivs");
        var flag = true;
        if(privs)
            flag = privs.indexOf("(write)") >= 0;
        if(!flag)
        {
            var destinationPath = encodeURIComponent(hashListener.getHash().toString().replace("#", ""));
            destinationPath = destinationPath || "/";
            var path = destinationPath;
            $.growlUI(getLocalizationKeyExternal("NoUploadInDirGrowlText"), getLocalizationKeyExternal("NoUploadInDirGrowlDesc") + "<br/>" + unescape(path), 3000, "growlError");
        }
        return flag;
    }

    window.uploadNotifications = function(type){
        var _files = [];
        var files = type.files || [];
        for (var i = 0; i < files.length; i++) {
            var curFile = files[i];
            _files.push(curFile.uploading_to + " Size: " + curFile.size);
        }
        userAudit.log(type.type + ": " + _files.join(","));
        if(window.parent.postMessage){
            window.parent.postMessage(type, "*");
        }
    }

    window.getIPCRenderer = function(){
        return window.require && window.require('electron').ipcRenderer;
    }

    window.setCrushShare = function(){
        $("body").addClass('crushshareapp');
        fileUploadModule.resizable("destroy");
        localizations.uploadPanel.addFilesToUpload = "Add files or drag and drop files to upload."
    }

    window.isCrushShare = function(){
        return localStorage.getItem("crushsync");
    }

    window.autoRename = function(){
        return window.autoRenameFilesWhileUploading;
    }

    window.autoRenameCrushDrop = function(){
        return window.autoRenameFilesWhileUploadingCrushDrop;
    }

    // window.isGroupShareFiles = function(){
    //     return window.groupShareFiles;
    // }

    // window.isGroupShareFilesCrushDrop = function(){
    //     return window.groupShareFilesCrushDrop;
    // }

    function random(length, numeric, possible) {
        length = length || 8;
        var randomId = "";
        possible = possible || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        if (numeric) {
            possible = "0123456789";
        }
        for (var i = 0; i < length; i++)
            randomId += possible.charAt(Math.floor(Math.random() * possible.length));

        return randomId;
    }

    window.setUploadPath = function(){
        if(window.groupShareFilesCrushDrop || window.groupShareFiles){
            randomUploadPath = (new Date().format("YYYY-mm-dd") + "-" + random(4)) + "/";
        }
    }

    window.hasCustomUploadLocation = function(){
        return randomUploadPath ? window.currentPath() : "";
    }

    window.isElectron = function(){
        // Renderer process
        if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
            return true;
        }

        // Main process
        if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
            return true;
        }

        // Detect the user agent when the `nodeIntegration` option is set to true
        if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
            return true;
        }
        return false;
    }
    // window.isElectron = window.isCrushShare = function() {return true};

    window.loggedInUserName = function(){
        return window.userInfo ? window.userInfo.username : "";
    };

    window.shareHistory = function(){
        var loggedInUser = window.userInfo ? window.userInfo.username : "";
        var sharedItemsHistory = localStorage.getItem("" + loggedInUser + "_share_history");
        sharedItemsHistory = sharedItemsHistory ? JSON.parse(sharedItemsHistory) : [];
        return sharedItemsHistory;
    };

    window.shareHistoryRemove = function(params){
        params = params || {};
        var id = params.id;
        var loggedInUser = window.userInfo ? window.userInfo.username : "";
        var sharedItemsHistory = localStorage.getItem("" + loggedInUser + "_share_history");
        sharedItemsHistory = sharedItemsHistory ? JSON.parse(sharedItemsHistory) : [];
        if(!id)
            return sharedItemsHistory;
        var items = [];
        for (var i = 0; i < sharedItemsHistory.length; i++) {
            if(sharedItemsHistory[i].id !== id)
                items.push(sharedItemsHistory[i]);
        }
        localStorage.setItem("" + loggedInUser + "_share_history", JSON.stringify(items));
        return items;
    };

    window.shareHistoryRemoveAll = function(){
        var loggedInUser = window.userInfo ? window.userInfo.username : "";
        localStorage.setItem("" + loggedInUser + "_share_history", "");
        return [];
    };

    window.closePopups = function(){
        var btns = $(".ui-dialog-titlebar > .ui-dialog-titlebar-close:visible");
        btns.click();
        return btns.length;
    };

    window.addEventListener("dragenter", function(e) {
        window.closePopups();
    });

    window.isUploadingFile = function(){
        return $(document).data("filesInProgress") || ($.CrushFTP && $.CrushFTP.UploadProgressing);
    }

    window.useNewUpload = true;
});