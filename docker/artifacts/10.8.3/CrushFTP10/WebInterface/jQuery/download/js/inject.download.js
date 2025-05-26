$(function() {
    var loadingIndicatorDownload = $("#loadingIndicatorDownload").hide();
    loadingIndicatorDownload.dialog({
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
    $('body').append('<div style="visibility:hidden;" id="fileDownloadModule"><div class="fileListHeader ui-widget-header ui-corner-all"><span class="fileRepoHeader">Downloads</span><span style="position:absolute;cursor:pointer;right:7px;top:6px;" class="ui-icon ui-icon-closethick" id="toggleDownloadPanel"></span></div><div class="widget-content"><iframe frameborder="0" id="fileDownloadIframe" src="/WebInterface/jQuery/download/index.html?embed=true"></iframe></div></div>').find('#fileDownloadIframe').on('load', function() {
        loadingIndicatorDownload.dialog("destroy");
        $("body").trigger("newDownloadPanelLoaded");
        if(window.onDownloadReady){
            window.onDownloadReady();
        }
    });

    var fileDownloadModule = $('#fileDownloadModule');
    fileDownloadModule.css("top", 190);
    var fileDownloadIframe = $('#fileDownloadIframe');
    var toggleDownloadPanel = $('#toggleDownloadPanel');
    toggleDownloadPanel.click(function(){
        window.hideDownloadPanel();
    });
    window.resizeDownloadiFramePanel = function(width, height, progress){
        if(width){
            fileDownloadIframe.width(width);
            fileDownloadModule.width(width);
        }
        if(height){
            fileDownloadIframe.height(height);
        }
        fileDownloadModule.css("visibility", "visible");
        if(!window.crushDownload)
            window.crushDownload = fileDownloadIframe[0].contentWindow.crushDownload;
        if(progress){
            window.resizeiFrame();
        }
    }

    window.hideDownloadPanel = function(flag){
        $("body").removeClass('download-window-open');
        if(flag)
            fileDownloadModule.hide();
        else
            fileDownloadModule.slideUp("fast");
    }

    window.showDownloadPanel = function(){
        $("body").addClass('download-window-open');
        fileDownloadModule.slideDown("fast");
        if(window.crushDownload)
            window.crushDownload.resizeiFrame();
        $(window).scrollTop(0);
    }

    window.downloadCancelledNotify = function(){
        $("#mainContent").find("span.refreshButton").trigger("click");
        $.titleAlert("** Cancelled "+locale.filedownload.downloadCompletedText+"**", {
            duration  : 2000
        });
    }

    window.downloadDoneNotify = function(seelcted){
        $("#mainContent").find("span.refreshButton").trigger("click");

        $.titleAlert("**"+locale.filedownload.downloadCompletedText+"**", {
            duration  : 2000
        });

        if(window.showDownloadNotification)
        {
            if(Notification.permission !== 'granted'){
                Notification.requestPermission();
            }
            var n = new Notification(locale.filedownload.downloadCompletedText, {
                body: locale.filedownload.downloadedMultipleFilesText
            });
        }

        if(window.runBatchCompletedCommandAfterDownloadQueueFinishes)
        {
            window.batchComplete();
        }
        if(typeof window.onDownloadComplete == "function"){
            window.onDownloadComplete();
        }

        var autoShareDownloadedItem = $(document).data("autoShareDownloadedItem");
        var autoShareDownloadedItemNotify = $(document).data("autoShareDownloadedItemNotify");
        if(autoShareDownloadedItem && autoShareDownloadedItem.toLowerCase()=="true")
        {
            setTimeout(function(){
                if(window.crushDownload)
                {
                    var res = window.crushDownload.getItemsToShare();
                    if(res && ((res.paths || res.files) && (res.paths.length>0 || res.files.length>0))){
                        var shareMethodDownloadedItem = $(document).data("shareMethodDownloadedItem");
                        var _continueShare = function() {
                            if(shareMethodDownloadedItem && shareMethodDownloadedItem.toLowerCase() == "quick")
                            {
                                window.quickShareFile(false, res.paths.join("\r\n"), false, res.files.join("\r\n"));
                            }
                            else
                                window.shareFile(false, res.paths.join("\r\n"), res.files.join("\r\n"));
                        }
                        setTimeout(_continueShare);
                    }
                    if(autoShareDownloadedItemNotify)
                    {
                        setTimeout(function(){
                            var shareReadyMsg = window.localizations.shareDownloadedItemsMessage || "Your files are downloaded and ready to share.";
                            $.crushNotify({
                                message : shareReadyMsg,
                                playSound : true,
                                flashTitle : true,
                                browserNotification : true
                            })
                        },1000);
                    }
                    setTimeout(function(){
                        if(window.autoRemoveDownloadedItemFromList)
                        {
                            window.crushDownload.removeDownloaded();
                            window.hideDownloadPanel();
                        }
                    }, 100);
                }
            }, 100);
        }
        else
        {
            setTimeout(function(){
                if(window.autoRemoveDownloadedItemFromList)
                {
                    window.crushDownload.removeDownloaded();
                    window.hideDownloadPanel();
                }
            }, 100);
        }
    }

    window.downloadCurrentPath = function(){
        var path = window.defaultDownloadPath || hashListener.getHash().toString().replace("#", "");
        try{
            path = decodeURIComponent(path);
        }catch(ex){
            path = unescape(path);
        }
        return path;
    }

    window.resizeDownloadiFrame = function(){
        if(fileDownloadModule.data("resized"))
        {
            var width = fileDownloadModule.width();
            var height = fileDownloadModule.height();
            window.crushDownload.resizeList(width, height);
        }
    }

    window.getDownloadReverseProxyPath = function(){
        try{
            var ajaxURL = window.ajaxCallURL;
            var proxy = ajaxURL.substring(0, ajaxURL.indexOf("/Web" + "Interface/"));
            return proxy;
        }
        catch(ex){
            return "";
        }
    }

    window.useNewDownload = true;
});