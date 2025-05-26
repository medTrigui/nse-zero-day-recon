//'use strict';
var crushUpload = (function() {
    //Initial variables
    var fileList = {},
        initChunkSize = 0.5,
        maxChunkSize = 10,
        chunkTimeout = 900000, //in milliseconds
        MB = 1048576,
        minFileSizeToCheckForResume = MB * 1,
        requestsAllowedPerDomain = 4,
        maxRequests = 4,
        ongoingRequests = 0,
        requestRetries = 10,
        retryInProgress = 0,
        ignoreStatus = ["init", "error", "uploading", "done", "failed", "processing", "canceled", "pausing", "paused", "skipped"],
        cancellableStatus = ["", "init", "uploading", "resend", "retrying", "processing", "pausing", "paused", "closing"],
        continueWithFileForm = false,
        listHeight = 500,
        lineHeight = 70,
        listWidth = 850,
        overwriteAll = false,
        skipAll = false,
        resumeAll = false,
        reverseProxyPath = "",
        scrollWithActivity = false,
        altDomainsReady = false,
        isSafari = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1 &&  navigator.userAgent.indexOf('Android') == -1,
        onAltDomainsReady = function(){
            if(crush.enableLogging)
            {
                console.log("Alt domains ready!");
            }
        },
        altDomainToken = "",
        altDomains = [],
        altDomainTokenRefreshedOn,
        altDomainsRequests = {};

    function increaseRequestCount(msg){
        ongoingRequests++;
        if(crush.enableLogging)
        {
            console.log('%c'+ongoingRequests + ' : ' + msg + '|' + new Date().getTime(), 'padding:0px 5px;');
        }
    }

    function decreaseRequestCount(msg){
        ongoingRequests--;
        if(crush.enableLogging)
        {
            console.log('%c'+ongoingRequests + ' : ' + msg+ '|' + new Date().getTime(), 'padding:0px 5px;');
        }
        ongoingRequests = ongoingRequests < 0 ? 0 : ongoingRequests;
    }

    function prepareAltDomains(callback){
        if(altDomains && altDomains.length>0){
            if(altDomainsReady && altDomainToken && altDomainTokenRefreshedOn){
                if(moment().diff(altDomainTokenRefreshedOn, "m")<4){
                    callback();
                    return;
                }
            }
            getAltDomainToken(function(data){
                altDomainToken = $(data).find("response").text();
                altDomainTokenRefreshedOn = moment();
                maxRequests = altDomains.length * requestsAllowedPerDomain;
                altDomainsReady = true;
                onAltDomainsReady();
                if(callback)
                {
                    callback();
                }
            });
        }
        else{
            if(callback)
            {
                callback();
            }
        }
    }

     function sanitizeText(str){
        if(!str)return str;
        var tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';
        var tagOrComment = new RegExp(
            '<(?:'
            // Comment body.
            + '!--(?:(?:-*[^->])*--+|-?)'
            // Special "raw text" elements whose content should be elided.
            + '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*'
            + '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
            // Regular name
            + '|/?[a-z]'
            + tagBody
            + ')>',
            'gi');
        function removeTags(html) {
          var oldHtml;
          do {
            oldHtml = html;
            html = html.replace(tagOrComment, '');
          } while (html !== oldHtml);
          return html.replace(/</g, '&lt;');
        }
        return removeTags(str);
    }

    function getAltDomainToken(callback){
        var params = {
            command: "loginDomain1"
        };
        $.when(crush.data.ajax(params)).done(function(msg) {
            callback(msg);
        }).fail(function(){
            callback("FAILED");
        });
    }

    //Initialize events
    function boot() {
        bootbox.addLocale("custom", {
            OK : 'Yes',
            CANCEL : 'No',
            CONFIRM : "Yes"
        });
        bootbox.setLocale("custom");
        embed.init(); // Things to do when its embeded on a page
        action.init();// Events of buttons on top
        dnd.init();// Drag-drop, paste image events
        queue.init();// Queue binding, filtering, selection etc
        $('[data-toggle="tooltip"]').tooltip();
        altDomains = embed.invoke("alternateDomains");
        var port = window.location.port;
        var protocol = window.location.protocol;
        if(altDomains && altDomains.length>0){
            if(altDomains && altDomains.length>0){
                for (var i = 0; i < altDomains.length; i++) {
                    var serverName = altDomains[i];
                    if(!serverName.startsWith("http://") && !serverName.startsWith("https://"))
                        serverName = protocol + "//"+serverName;
                    if(serverName.endsWith("/"))
                        serverName = serverName.slice(0,-1);
                    if(serverName.split(":").length<3){
                        serverName += ":" + port;
                    }
                    altDomains[i] = serverName;
                    altDomainsRequests[serverName] = 0;
                }
                altDomains.splice(0, 0, "");
                altDomainsRequests["local"] = 0;
                prepareAltDomains();
            }
        }
        if(embed.invoke("isCrushShare") && embed.invoke("isElectron")){
          $(document).bind("keyup", function (e) {
            if (e.keyCode === 27) {
                if(embed.invoke("closePopups"))
                {
                    return false;
                }
                var btns = $(".modal-header>button.close:visible");
                if(btns.length>0){
                    btns.click();
                    return false;
                }
                embed.invokeElectronEvent('toggle-view');
            }
          });
        }
    }

    var embed = (function(){
        var mainContentHolder= $('.mainContentHolder');
        var isEmbed = crush.queryString("embed") == "true";
        var ipcRenderer;
        function init(){
            resize();
            reverseProxyPath = embed.invoke("getReverseProxyPath");
            if(reverseProxyPath && !reverseProxyPath.startsWith("/")){
                reverseProxyPath = "/" + reverseProxyPath;
            }
            embed.invoke("hideUploadPanel", [true]);
            embed.invoke("checkCommonUploadForm");
            if(embed.invoke("isCrushShare") && embed.invoke("isElectron")){
                lineHeight = 105;
                listHeight = 540;
                invokeElectronEvent('ready-to-upload', {status: embed.invoke("hasWritePermission")});
                embed.invoke("electronInitFn");
                embed.showUploadPanel();
                embed.invoke("setCrushShare");
                $("body").addClass('crushshareapp');
                $(".remove-top-dropdown").addClass('dropup');
            }
            $("#tryReconnect").click(function(){
                var el = $(this);
                if(el.hasClass('disabled'))
                    return false;
                el.addClass('disabled');
                invoke("reconnect", [function(){
                    el.removeClass('disabled');
                }]);
                return false;
            })
        };

        function isElectron(){
            return ipcRenderer || embed.invoke("getIPCRenderer");
        }

        function invokeElectronEvent(name, data){
            ipcRenderer = isElectron();
            if(ipcRenderer){
                ipcRenderer.send(name,  data);
            }
        }

        function resize(progress){
            if(isEmbed){
                $('body').css("padding", "0px");
                mainContentHolder.css("padding", "0px").css("overflow", "hidden");
                embed.invoke("resizeiFramePanel",[listWidth, mainContentHolder.height(), progress]);//mainContentHolder.width() Hardcoded to 1000
            }
        };

        function browseFiles(){
            $("#selectFile").trigger('click');
        };

        function resizeList(width, height, dontRender){
            if(isEmbed){
                if(height){
                    if($('.global-progressbar:visible').length==0)
                        listHeight = height - 130;
                    else
                        listHeight = height - 200;
                    $('#queue').data("height", listHeight);
                }
                listWidth = width;
                if(!dontRender)
                    queue.renderList(true);
            }
        };

        function invoke(method, params){
            if(isEmbed && parent.window[method]){
                return parent.window[method].apply(this, params);
            }
        };

        function showUploadForm(items){
            items = items.filter(function(item){return !item.formProcessed})
            if(items.length==0)return;
            if(!invoke("isCommonFormShown")){
                invoke("showUploadFormAdvanced", [true, 0, items]);
                continueWithFileForm = items;
            }
            else
            {
                invoke("showUploadFormAdvanced", [false, 0, items]);
            }
        }

        function showUploadPanel(){
            invoke("showUploadPanel");
        }

        return {
            init : init,
            resize : resize,
            invoke : invoke,
            showUploadPanel : showUploadPanel,
            showUploadForm : showUploadForm,
            resizeList : resizeList,
            browseFiles: browseFiles,
            invokeElectronEvent: invokeElectronEvent
        }
    }());

    var action = (function(){
        function init(){
            var topButtonBar = $('#queue-top-buttons');
            scrollWithActivity = $('#scrollWithActivity');

            //Add files to queue as soon as they are selected
            topButtonBar.find('#file').change(function() {
                var fileList = $('#file').get(0).files;
                if (fileList && fileList.length > 0) {
                    var _files = [];
                    for(var i = 0; i < fileList.length; i++) {
                        var file = fileList[i];
                        _files.push(
                            queue.addFile(file)
                        );
                    }
                    embed.showUploadForm(_files);
                }
                //Remove file selection as its no longer required
                topButtonBar.find('#file').val("");
            });

            if(embed.invoke("isCrushShare") && embed.invoke("isElectron")){
                var fileSelectInput = topButtonBar.find('#file').get(0);
                fileSelectInput.onclick = onClick;
                function onClick()
                {
                    crushUpload.invokeElectronEvent('open-file-select', {});
                    document.body.onfocus = onBodyFocus;
                }
                function onBodyFocus()
                {
                    crushUpload.invokeElectronEvent('close-file-select', {});
                    document.body.onfocus = null;
                }
            }

            $("#infoServer").attr("title", "Server: " + window.location.host + "<br>" + "User: " + embed.invoke("loggedInUserName") + "<br>" + "Path: " + embed.invoke("currentPath"));

            topButtonBar.find("button:not(.dropdown-toggle), .button").unbind().click(function(e){
                e.stopPropagation();
                e.preventDefault();
                if($(this).is(":disabled") || $(this).hasClass('disabled'))
                {
                    return false;
                }
                if($(this).is('#infoServer') && e.detail === 3){
                    embed.invokeElectronEvent("dev-tools");
                };
                if($(this).is('#selectFile')){
                    //Selecting files on click of a link
                    $(this).parent().find("input").click();
                }
                else if($(this).is('#startUpload')){
                    //Upload All
                    if(queue.status() !== "all"){ //only if upload all is not ongoing
                        var isUploading = queue.status() != "idle";
                        queue.status("all");
                        upload.all(function(){
                            queue.status("");
                        }, isUploading);
                    }
                }
                else if($(this).is('#cancelUpload')){
                    //Cancel uploading
                    upload.cancel(false, function(ids){
                        queue.status("");
                        $.when(crush.data.ajax({
                            command: "blockUploads",
                            random: Math.random(),
                            c2f:crush.getAuth()
                        })).done(function(msg) {
                            upload.handleCancelFileAction(ids, function(){
                                embed.invoke("uploadCancelledNotify");
                            });
                        });
                        embed.invoke("uploadInProgress", [false]);
                    });
                }
                else if($(this).is('#uploadDetails')){
                    //Show details form
                    upload.showDetails();
                }
                else if($(this).is('#startUploadSelected')){
                    //Start uploading only selected items
                    if(retryInProgress>0)
                        return false;
                    var isUploading = queue.status() != "idle";
                    queue.status("selected");
                    upload.selected(function(){
                        queue.status("");
                    }, isUploading);
                }
                else if($(this).is('#reuploadAll')){
                    //Reupload all files that are already uploaded
                    if(retryInProgress>0)
                        return false;
                    bootbox.confirm(loc("reuploadConfirmation"), function(result) {
                      if(result){
                        var isUploading = queue.status() != "idle";
                        queue.status("selected");
                        upload.selected(function(){
                            queue.status("");
                        }, isUploading, true);
                      }
                    });
                    return false;
                }
                else if($(this).is('#removeSelected')){
                    //Remove selected items
                    queue.removeSelected();
                    $(this).closest(".remove-top-dropdown").removeClass('open');
                }
                else if($(this).is('#removeWithError')){
                    //Remove items with erro
                    queue.removeWithError();
                    $(this).closest(".remove-top-dropdown").removeClass('open');
                }
                else if($(this).is('#removeUploaded')){
                    //Remove uploaded items
                    queue.removeUploaded();
                    $(this).closest(".remove-top-dropdown").removeClass('open');
                }
                else if($(this).is('#removeCanceled')){
                    //Remove canceled items
                    queue.removeCanceled();
                    $(this).closest(".remove-top-dropdown").removeClass('open');
                }
                else if($(this).is('#removeSkipped')){
                    //Remove canceled items
                    queue.removeSkipped();
                    $(this).closest(".remove-top-dropdown").removeClass('open');
                }
                else if($(this).is('#removeAll')){
                    //Remove all items
                    queue.removeAll();
                    $(this).closest(".remove-top-dropdown").removeClass('open');
                }
                else if($(this).is('#overwriteAll')){
                    //Remove selected items
                    queue.overwrite();
                    addedFilesProcessed();
                    $(this).closest(".remove-top-dropdown").removeClass('open');
                }
                else if($(this).is('#resumeAll')){
                    //Remove selected items
                    queue.overwrite(false, true);
                    $(this).closest(".remove-top-dropdown").removeClass('open');
                }
                else if($(this).is('#shareUploaded')){
                    //Share uploaded items
                    embed.invoke("shareUploaded");
                }
                else if($(this).is('#shareSelected')){
                    //Share uploaded items
                    $("#shareDropdown", topButtonBar).toggle();
                    $(document).one("click", function(){
                        $("#shareDropdown", topButtonBar).hide();
                    })
                }
                else if($(this).is('#startShareSelected')){
                    //Share selected items
                    embed.invoke("shareSelected");
                }
                else if($(this).is('#refreshUIElectron')){
                    embed.invokeElectronEvent("refreshUIElectron");
                }
                else if($(this).is('#logoutElectron')){
                    embed.invokeElectronEvent("logoutElectron");
                }
                else if($(this).is('#shareHistory')){
                    showSharedItems();
                }
                else if($(this).is('#quitElectron')){
                    var isUploading = embed.invoke("isUploadingFile");
                    if(isUploading)
                    {
                        if(confirm("Are you sure you want to quit the app?")){
                            embed.invokeElectronEvent("quit-app");
                        }
                    }
                    else{
                        embed.invokeElectronEvent("quit-app");
                    }
                }

                $(this).blur();
                return false;
            });
        };

        return {
            init: init
        };
    }());

    var dnd = (function() {
        function toArray(list) {
            return Array.prototype.slice.call(list || [], 0);
        };

        function readDirectory(dirEntry, callback) {
            var dirReader = dirEntry.createReader(),
                _entries = [],
                readEntries = function() {
                    dirReader.readEntries(function(results) {
                        if (!results.length) {
                            callback(_entries, dirEntry.fullPath + "");
                        } else {
                            _entries = _entries.concat(toArray(results));
                            readEntries();
                        }
                    }, function() {
                    });
                };
            readEntries();
        };

        function processdir(dirEntry, cb) {
            var delay = (function () {
                var timer = 0;
                return function (callback, ms) {
                    clearTimeout(timer);
                    timer = setTimeout(callback, ms);
                };
            })();
            var files = [];
            var emptyDirs = [];
            readDirectory(dirEntry, function fileReadCallbackFn(entries, path) {
                if(entries.length==0 && emptyDirs.indexOf(path + "")<0){
                    emptyDirs.push(path + "");
                    var curPath = embed.invoke("currentPath") || "/";
                    var filePath = path;
                    if(curPath.endsWith("/") && filePath.startsWith("/")){
                        curPath = curPath.substr(0, curPath.length-1);
                    }
                    var f = {
                        size: 0,
                        name: filePath,
                        type: 'dir'
                    };
                    f.fullPath = curPath + filePath;
                    files.push(
                        queue.addFile(f, false, filePath)
                    );
                }
                entries.forEach(function(entry, i) {
                    if (entry.isFile) {
                        entry.file(function(f) {
                            var path = embed.invoke("currentPath") || "/";
                            var filePath = entry.fullPath;
                            if(path.endsWith("/") && filePath.startsWith("/")){
                                path = path.substr(0, path.length-1);
                            }
                            f.fullPath = path + filePath;
                            files.push(
                                queue.addFile(f, false, filePath)
                            );
                            delay(function(){
                                cb(files)
                            }, 500);
                        });
                    } else {
                        readDirectory(entry, fileReadCallbackFn);
                    }
                });
            });
        };

        function addFiles(e){
            var maxFilesInQueue = embed.invoke("maxFilesAllowedInQueue");
            var blockUploadingDirs = embed.invoke("disableUploadingDirs");
            if(maxFilesInQueue && queue.files().length>=maxFilesInQueue){
                embed.invoke("maxFilesReached");
                return false;
            }
            if(!embed.invoke("hasWritePermission")){
                return false;
            }
            if (e.dataTransfer.items) {
                var items = e.dataTransfer.items,
                    _files = e.dataTransfer.files,
                    fileList = [];
                var delay = (function () {
                    var timer = 0;
                    return function (callback, ms) {
                        clearTimeout(timer);
                        timer = setTimeout(callback, ms);
                    };
                })();
                for (var i = 0, item; item = items[i]; ++i) {
                    if (item.kind != 'file') {
                        continue;
                    }
                    var entry = item.webkitGetAsEntry();
                    if (entry.isDirectory) {
                        if(blockUploadingDirs){
                            embed.invoke("folderUploadNotAllowed");
                        }
                        else{
                            processdir(entry, function(items){
                                fileList = fileList.concat(items);
                                delay(function(){
                                    embed.showUploadForm(fileList);
                                }, 1000);
                            });
                        }
                    } else {
                        entry.file(function(file) {
                            var path = embed.invoke("currentPath") || "/";
                            file.fullPath = path + file.name;
                            fileList.push(
                                queue.addFile(file)
                            );
                            delay(function(){
                                embed.showUploadForm(fileList);
                            }, 1000);
                        });
                    }
                }
            } else {
                var _files = e.dataTransfer.files,
                    fileList = [];
                var filesProcessed = 0;
                for (var i = 0; i < _files.length; i++) {
                    var file = _files[i];
                    if (file.name != '') {
                        function continueToAddFile(f){
                            var path = embed.invoke("currentPath") || "/";
                            f.fullPath = path + f.name;
                            fileList.push(
                                queue.addFile(f)
                            );
                            filesProcessed++;
                            if(filesProcessed >= _files.length){
                                embed.showUploadForm(fileList);
                            }
                        }
                        if(navigator.userAgent.indexOf("Firefox") > 0)
                        {
                            (function isFile(f){
                                f.isLikelyFolder = null;
                                if (f.size > 1048576)
                                {
                                    f.isLikelyFolder = false;
                                }
                                else{
                                    var reader = new FileReader();
                                    reader.onload = function (result) {
                                        f.isLikelyFolder = false;
                                    };
                                    reader.onerror = function(){
                                        f.isLikelyFolder = true;
                                    };
                                    reader.readAsArrayBuffer(f);
                                }
                                var interval = setInterval(function() {
                                    if (f.isLikelyFolder != null){
                                        clearInterval(interval);
                                        if(!f.isLikelyFolder)
                                            continueToAddFile(f);
                                        else{
                                            queue.addFile(f, false, false, {
                                                message : loc("folderUploadNotSupported")
                                            });
                                            filesProcessed++;
                                            if(filesProcessed >= _files.length){
                                                embed.showUploadForm(fileList);
                                            }
                                        }
                                    }
                                }, 100);
                            })(file);
                        }
                        else{
                            continueToAddFile(file);
                        }
                    }
                }
            }
            embed.showUploadPanel();
        }

        function init() {
            var dropZone = $('#dropzone').get(0);
            var delay = (function () {
                var timer = 0;
                return function (callback, ms) {
                    clearTimeout(timer);
                    timer = setTimeout(callback, ms);
                };
            })();
            window.addEventListener("dragover", function(e) {
                if(embed.invoke("disableDragDropUpload")){
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
                e = e || event;
                $(dropZone).parent().addClass('drag-over');
                embed.invoke("closePopups");
                $(".modal-header>button.close").click();
                e.preventDefault();
            }, false);

            window.addEventListener("dragenter", function(e) {
                if(embed.invoke("disableDragDropUpload")){
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
                e = e || event;
                $(dropZone).parent().addClass('drag-over');
                embed.invoke("closePopups");
                $(".modal-header>button.close").click();
                e.preventDefault();
            }, false);

            window.addEventListener("dragleave", function(e) {
                if(embed.invoke("disableDragDropUpload")){
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
                e = e || event;
                if(!$(dropZone).hasClass('active'))
                    $(dropZone).parent().removeClass('drag-over');
                e.preventDefault();
            }, false);

            window.addEventListener("dragend", function(e) {
                if(embed.invoke("disableDragDropUpload")){
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
                e = e || event;
                $(dropZone).parent().removeClass('drag-over');
            }, false);

            window.addEventListener("drop", function(e) {
                if(embed.invoke("disableDragDropUpload")){
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
                e = e || event;
                $(dropZone).parent().removeClass('drag-over');
                e.preventDefault();
            }, false);

            dropZone.addEventListener('drop', function(e) {
                if(embed.invoke("disableDragDropUpload")){
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
                $(dropZone).removeClass('active').parent().removeClass('drag-over');
                e.preventDefault();
                e.stopPropagation();
                addFiles(e);
                e.target.classList.remove('active');
            });

            $('html').pasteImageReader(function(item){
                var file = item.file;
                file.name = "IMG_" + crush.random(4).toUpperCase() + "_" + moment().format("YYYYMMDDHHmm") + ".jpg";
                var path = embed.invoke("currentPath") || "/";
                file.fullPath = path + file.name;
                var fileList = [];
                fileList.push(
                    queue.addFile(file)
                );
                embed.showUploadForm(fileList);
            });

            dropZone.addEventListener('dragover', function(e) {
                if(embed.invoke("disableDragDropUpload")){
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
                e.target.classList.add('active');
                e.preventDefault();
            });

            dropZone.addEventListener('dragenter', function(e) {
                if(embed.invoke("disableDragDropUpload")){
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
                e.target.classList.add('active');
                e.preventDefault();
            });

            dropZone.addEventListener('dragleave', function(e) {
                if(embed.invoke("disableDragDropUpload")){
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
                e.target.classList.remove('active');
                $(dropZone).parent().removeClass('drag-over');
                e.preventDefault();
            });
            css_browser_selector(navigator.userAgent);
        }
        return {
            init: init,
            addFiles : addFiles
        }
    }());

    var queue = (function() {
        var files = [],
            queueStatus = "",
            queueStartTime = "",
            requests = [],
            size = 0,
            listItemTemplate = $('#tplQueueItem').html(),
            queueList = $('#queue'),
            queueLoader = $('#rendering-queue'),
            buttons = $('#queue-buttons'),
            queueInfo = $('#queue-info'),
            filter = buttons.find("#filter"),
            queueSelectedInfo = $('#queue-selected-info'),
            selectionButtons = $('.selection-button'),
            selectAll = $('#queue-buttons').find(".select-all"),
            uploadButton = $('#startUpload, #startUploadOpt'),
            topButtonBar = $('#queue-top-buttons'),
            shareButton = $('#shareUploaded,#shareSelected'),
            startUploadSelected = $('#startUploadSelected'),
            reuploadAll = $('#reuploadAll'),
            cancelUploadButton = $('#cancelUpload'),
            intervals = {},
            commonFormDataVal = "";

        var showNameInsteadOfFullPath = embed.invoke("uploadShowNameInsteadOfPath");
        if(showNameInsteadOfFullPath){
            listItemTemplate = listItemTemplate.replace(/fullPathEscaped/g, 'name');
        }

        function realFileStatus(){
            for (var i = 0; i < files.length; i++) {
                var curFile = files[i];
                if(curFile.status == "uploading" || curFile.status == "closing" || curFile.status == "init" || curFile.status == "paused" || curFile.status == "retrying")
                    return "progress";
            }
            return "idle";
        }

        function canUploadNextFile(){
            var flag = true;
            for (var i = 0; i < files.length; i++) {
                var curFile = files[i];
                if(curFile.status == "uploading" || curFile.status == "retrying" || curFile.status == "init")
                {
                    var fileId = curFile.id;
                    var fileInfo = fileList[fileId];
                    var chunks = fileInfo.chunks;
                    var pendingChunks = 0;
                    for (var j = 0; j < chunks.length; j++) {
                        if(chunks[j].status !== "done"){
                            pendingChunks++;
                        }
                    };
                    if(pendingChunks > 1 || !fileInfo.done){
                        return false;
                    }
                }
            }
            return flag;
        }

        function showReuploadButton(){
            var hasUploadedFile = false;
             for (var i = 0; i < files.length; i++) {
                var curFile = files[i];
                if(curFile.status == "done"){
                    hasUploadedFile = true;
                    i = files.length+1;
                }
            }
            if(hasUploadedFile)
            {
                reuploadAll.removeAttr('disabled');
            }
            else
            {
                reuploadAll.prop('disabled', 'disabled');
            }
        }

        function status(value){
            if(typeof value != "undefined")
            {
                value = $.trim(value);
                queueStatus = value;
                if(!value || value == "idle")
                {
                    cancelUploadButton.prop('disabled', 'disabled');
                    uploadButton.removeAttr('disabled');
                    shareButton.removeAttr('disabled');
                    topButtonBar.find("a#removeSelected, a#removeAll").removeClass('disabled');
                    startUploadSelected.removeAttr('disabled');
                    buttons.find("#filter").removeAttr('disabled');
                    $('#container').find(".global-progressbar").remove();
                    scrollWithActivity.closest("div").hide();
                    embed.resize();
                    showReuploadButton();
                }
                else
                {
                    scrollWithActivity.closest("div").show();
                    uploadButton.prop('disabled', 'disabled');
                    shareButton.prop('disabled', 'disabled');
                    topButtonBar.find("a#removeSelected, a#removeAll").addClass('disabled');
                    startUploadSelected.prop('disabled', 'disabled');
                    buttons.find("#filter").prop('disabled', 'disabled');
                    buttons.find(".filter-button").click();
                    cancelUploadButton.removeAttr('disabled');
                }
            }
            return queueStatus || "idle";
        };

        function startTime(value){
            if(typeof value != "undefined"){
                queueStartTime = value;
            }
            return queueStartTime;
        };

        var delay = (function () {
            var timer = 0;
            return function (callback, ms) {
                clearTimeout(timer);
                timer = setTimeout(callback, ms);
            };
        })();

        function addFileToQueue(file, path, folderName, error) {
            var maxFilesInQueue = embed.invoke("maxFilesAllowedInQueue");
            var defaultError;
            if(maxFilesInQueue && files.length>=maxFilesInQueue){
                defaultError = {
                    message : loc("maxFilesAllowedInQueueExceed").replace(/{x}/g, maxFilesInQueue)
                };
                for (var i = 0; i < files.length; i++) {
                    var curFile = files[i];
                    queue.updateFileMetaData(curFile.id, {
                        error: defaultError,
                        status: "error"
                    });
                };
                embed.invoke("maxFilesReached");
                if(!error){
                    error = defaultError;
                }
            }
            queueLoader.addClass('show');
            file.id = crush.random(12);
            path = path || embed.invoke("currentPath");
            if(!file.fullPath){
                file.fullPath = path + file.name;
            }
            var uploadingTo = file.fullPath.substring(0,file.fullPath.lastIndexOf("/")+1);
            if(path == uploadingTo){
                file.hasDir = true;
            }
            file._path = unescape(path);
            var noDir = false;
            if(folderName){
                if(folderName.startsWith("/"))
                    folderName = folderName.split("/")[1];
                else
                    folderName = folderName.split("/")[0];
            }
            if(file.relativePath && file.relativePath != "")
            {
                //TODO
                // if(window.blockUploadingDirs)
                // {
                //     noDir = true;
                //     file.error = "blockUploadingDirs";
                //     hasError = true;
                // }
                // else
                file._path = file._path + file.relativePath;
                if(!noDir)
                    file.fullPath = file._path + file.name;
            }
            file.error = error || validateFile(file, folderName);

            var fileRenamed;
            if(file.error.renameTo){
                fileRenamed = file.error.renameTo;
                delete file.error;
            }

            //Make a file list based on hash (ID)
            fileList[file.id] = {
                file: file,
                chunkPos: 0,
                chunkSize: MB * initChunkSize,
                chunkBeingUploaded: 0
            };
            var modified = false;
            if(file.lastModified)
                modified = moment(new Date(file.lastModified)).format("MM/DD/YYYY hh:mm A");
            var isReady;
            if(queue.status() === "all"){
                isReady = true;
            }
            //Add ids to queue
            files.push({
                id: file.id,
                name: (fileRenamed && fileRenamed.name) || file.name,
                fullPath: (fileRenamed && fileRenamed.fullPath) || file.fullPath,
                folderName: folderName,
                fullPathEscaped : (fileRenamed && fileRenamed.fullPathEscaped) || crush.textEncode(file.fullPath),
                path : file._path,
                size: file.size,
                sizeF: file.type == 'dir' ? '-' : crush.formatBytes(file.size),
                icon : crush.iconForFile(file.name, file.type),
                status: file.error ? "error" : "",
                error : file.error,
                ask : false,
                folderExists : folderExistsOnServer(folderName),
                selected : selectAll.hasClass('checked') ? "selected" : "",
                modified : modified,
                isReady : isReady,
                autoRenamed: fileRenamed && fileRenamed.name
            });
            size += file.size;
            delay(function(){
                renderList(false, true, true);
                showReuploadButton();
            }, 500);
            return {
                name : crush.textEncode(file.fullPath),
                id : file.id,
                formProcessed: file.formProcessed
            }
        };

        function removeSelected() {
            removeFiles({
                selected : true
            });
        }

        function removeWithError() {
            removeFiles({
                error : true
            });
        }

        function removeUploaded(){
            removeFiles({
                uploaded : true
            });
        }

        function removeCanceled(){
            removeFiles({
                canceled : true
            });
        }

        function removeSkipped(){
            removeFiles({
                skipped : true
            });
        }

        function removeAll(){
            removeFiles({
                all : true
            });
        }

        function showForm(id){
            var index = getFileIndex(id);
            var items = [];
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                items.push({
                    id : file.id,
                    name : file.fullPath,
                    formData : file.formData
                });
            }
            embed.invoke("showUploadFormAdvanced", [false, index, items, true]);
        }

        function overwrite(id, resume){
            if(id){
                var error = fileError(id);
                if((error && error.existsOnServer) || (error && error.exists)){
                    delete error.existsOnServer;
                    delete error.exists;
                    fileError(id, error, status()!="idle", resume);
                }
            }
            else{
                if(files && files.length>0){
                    for (var i = 0; i < files.length; i++) {
                        var error = files[i].error;
                        var id = files[i].id;
                        if(error && error.existsOnServer){
                            delete error.existsOnServer;
                            fileError(id, error, status()!="idle", resume);
                        }
                        var _status = "";
                        if(file.status=="failed" || file.status=="canceled")
                            _status = "resend";
                        queue.fileStatus(id, _status);
                    }
                }
            }
        }

        //ids, selected, error
        function removeFiles(params) {
            setTimeout(function(){
                $("#filter").click();
                embed.invoke("setFocus");
            });
            if(!params)
                return;
            var ids = params.ids;
            var selected = params.selected;
            var error = params.error;
            var uploaded = params.uploaded;
            var canceled = params.canceled;
            var skipped = params.skipped;
            var noFormData = params.noFormData;
            var all = params.all;
            if(files && files.length>0){
                var filterFiles = [];
                if(!all){
                    for (var i = 0; i < files.length; i++) {
                        if(selected){
                            if(!files[i].selected)
                                filterFiles.push(files[i]);
                            else
                                size -= files[i].size;
                        }
                        else if(error){
                            if(!files[i].error)
                                filterFiles.push(files[i]);
                            else
                                size -= files[i].size;
                        }
                        else if(uploaded){
                            if(files[i].status != "done")
                                filterFiles.push(files[i]);
                            else
                                size -= files[i].size;
                        }
                        else if(canceled){
                            if(files[i].status != "canceled")
                                filterFiles.push(files[i]);
                            else
                                size -= files[i].size;
                        }
                        else if(skipped){
                            if(files[i].status != "skipped")
                                filterFiles.push(files[i]);
                            else
                                size -= files[i].size;
                        }
                        else if(noFormData){
                            if(files[i].formData)
                                filterFiles.push(files[i]);
                            else
                                size -= files[i].size;
                        }
                        else
                        {
                            if(!ids.has(files[i].id))
                                filterFiles.push(files[i]);
                            else
                                size -= files[i].size;
                        }
                    }
                }
                else{
                    size = 0;
                }
                files = filterFiles;
                var curfilter = filter.val();
                renderList(true);
                if(curfilter){
                    filter.val(curfilter);
                    filter.parent().find(".fa-search").removeClass('fa-search').addClass('fa-remove');
                    filterQueue(curfilter);
                }
                var maxFilesInQueue = embed.invoke("maxFilesAllowedInQueue");
                if(maxFilesInQueue && files.length<=maxFilesInQueue){
                    for (var i = 0; i < files.length; i++) {
                        var curFile = files[i];
                        queue.updateFileMetaData(curFile.id, {
                            error: validateFile(curFile, curFile.folderName, curFile.id),
                            status: ""
                        });
                    };
                    addedFilesProcessed();
                }
                showReuploadButton();
            }
        }

        function validateFile(file, folder, id){
            var error = {};
            var path = file.fullPath;
            var autoRename = embed.invoke("autoRename");
            var autoRenameCrushDrop = embed.invoke("autoRenameCrushDrop");
            if(!autoRename && autoRenameCrushDrop){
                 autoRename = embed.invoke("isCrushShare") && embed.invoke("isElectron");
            }
            var fileExistsErr = fileExists(path, id) ? loc("fileAlreadySelected") : "";
            function autoRenameCurFile(){
                if(error.renameTo)
                    return;
                var name = file.name;
                var ext = getFileExtension(name);
                var nameToUse;
                if(ext){
                    var splts = name.split(".");
                    splts.pop();
                    var onlyName = splts.join(".");
                    nameToUse = onlyName + "_" + moment().format("MMDDYYYYHHmmss") + "." + ext;
                };
                var fullPath = file.fullPath.split("/");
                fullPath.pop();
                fullPath.push(nameToUse);
                fullPath = fullPath.join('/');
                error.renameTo = {
                    name: nameToUse,
                    fullPath: fullPath,
                    fullPathEscaped : crush.textEncode(fullPath)
                };
                queue.updateFileMetaData(file.id, {
                    name: nameToUse,
                    fullPath: fullPath,
                    fullPathEscaped : crush.textEncode(fullPath)
                });
            }
            if(!autoRename)
                error.exists = fileExistsErr;
            else{
                if(fileExistsErr)
                    autoRenameCurFile();
            }
            var fileName = file.name;
            var _path = path.split("/");
            _path.pop();
            _path = _path.join("/") + "/";
            if(!error.exists && (!folder  || folder === "/")){
                var fileOnServer = fileExistsOnServer(file.name, _path) ? loc("fileExistsOnServer") : "";
                if(!autoRename)
                    error.existsOnServer = fileOnServer;
                else
                {
                    if(fileOnServer)
                        autoRenameCurFile();
                }
            }
            error.sizeExceed = fileSizeAllowed(file.size) ? loc("fileSizeExceed") : "";
            if(!error.sizeExceed)
                error.sizeExceed = fileSizeOK(file.size) ? loc("fileSizeExceed") : "";

            error.fileExtenstionNotAllowed = fileExtensionAllowed(file.name) ? loc("fileTypeNotAllowed") : "";
            if(error.fileExtenstionNotAllowed){
                error.existsOnServer = undefined;
                error.sizeExceed = undefined;
            }

            if(folder){
                error.fileNameNotAllowed = fileNameInvalid((file.name + "").substring(1)) ? loc("fileNameNotAllowed") : "";
            }
            else
                error.fileNameNotAllowed = fileNameInvalid(file.name) ? loc("fileNameNotAllowed") : "";

            if(!error.fileNameNotAllowed){
                if(folder){
                    error.fileNameNotAllowed = fileNameInvalid(file.fullPath + "", true) ? loc("fileNameNotAllowed") : "";
                }
                else
                    error.fileNameNotAllowed = fileNameInvalid(file.fullPath, true) ? loc("fileNameNotAllowed") : "";
            }
            if(error.fileNameNotAllowed){
                error.existsOnServer = undefined;
                error.sizeExceed = undefined;
                error.fileExtenstionNotAllowed = undefined;
            }

            error.nameSizeExceed = !fileNameSizeAllowed(file.name) ? loc("fileNameSizeExceed").replace(/{x}/g, embed.invoke("maxFilesnameLength")) : "";
            if(error.fileExtenstionNotAllowed || error.nameSizeExceed || error.sizeExceed || error.fileNameNotAllowed){
                file.formProcessed = true;
            }

            var doesnotHaveError = !error.exists && !error.existsOnServer && !error.sizeExceed && !error.fileExtenstionNotAllowed && !error.nameSizeExceed && !error.fileNameNotAllowed;
            if(doesnotHaveError && folder && folderExistsOnServer(folder) && folder !== "/"){
                error.verifying = loc("pleaseWait");
                fileExistsOnServer(file.name, _path, true).then(function(data){
                    if(!autoRename){
                        queue.updateFileMetaData(file.id, {
                            error: {
                                existsOnServer : loc("fileExistsOnServer")
                            },
                            status: "error"
                        });
                    }
                    else{
                        queue.updateFileMetaData(file.id, {
                            error: false,
                            status: ""
                        });
                        autoRenameCurFile();
                    }
                }, function(err){
                    queue.updateFileMetaData(file.id, {
                        error: false,
                        status: ""
                    });
                });
            }
            if(doesnotHaveError && !error.verifying){
                if(error.renameTo)
                    return error;
                return false;
            }
            else{
                embed.invokeElectronEvent("upload-failed", {message: error.exists || error.existsOnServer || error.sizeExceed || error.fileExtenstionNotAllowed || error.nameSizeExceed});
                crushUpload.justRaisedAnError = true;
                return error;
            }
        }

        function fileSizeAllowed(size){
            return embed.invoke("doesFileSizeExceed", [size]);
        }

        function fileNameSizeAllowed(name){
            return embed.invoke("doesFileNameSizeExceed", [name]);
        }

        function fileSizeOK(size){
            return embed.invoke("doesFileSizeExceedAllowedSize", [size]);
        }

        function fileExtensionAllowed(name){
            return !embed.invoke("isFileTypeAllowed", [name]);
        }

        function fileNameInvalid(name, fullPath){
            return embed.invoke("hasUnsafeChars", [name, fullPath]);
        }

        function fileExistsOnServer(name, path, realCheck){
            return embed.invoke("fileExistsOnServer", [name, path, realCheck]);
        }

        function folderExistsOnServer(path){
            return embed.invoke("folderExistsOnServer", [path]);
        }

        function fileExists(path, id) {
            for (var i = 0; i < files.length; i++) {
                if(id){
                    if(files[i].id !== id){
                        if(files[i].fullPath === path)
                            return true;
                    }
                }
                else{
                    if(files[i].fullPath === path)
                        return true;
                }
            };
            return false;
        }

        function queueIn(selected){
            if(selected)
            {
                for (var i = 0; i < files.length; i++) {
                    if(files[i].selected && !files[i].error && !ignoreStatus.has(files[i].status))
                        files[i].isReady = true;
                    else
                        files[i].isReady = false;
                    renderSelectedItem(files[i]);
                };
            }
            else{
                for (var i = 0; i < files.length; i++) {
                    if(!ignoreStatus.has(files[i].status)){
                        files[i].isReady = true;
                        renderSelectedItem(files[i]);
                    }
                };
            }
        }

        function init(){
            buttons.find(".select-all").click(function(){
                if($(this).hasClass('checked')){
                    $(this).removeClass('checked');
                    handleUploadItemEvent({which : 65, metaKey : true, preventDefault:function(e){}, stopPropagation:function(e){}, selectAll : false}, "keydown");
                }
                else{
                    $(this).addClass('checked');
                    handleUploadItemEvent({which : 65, metaKey : true, preventDefault:function(e){}, stopPropagation:function(e){}, selectAll : true}, "keydown");
                }
                return false;
            });

            filter.unbind("textchange").bind("textchange", function(evt) {
                var delay = (function() {
                    var timer = 0;
                    return function(callback, ms) {
                        clearTimeout(timer);
                        timer = setTimeout(callback, ms);
                    };
                })();
                var that = $(this);
                var phrase = $.trim($(this).val());
                if (phrase) {
                    $(this).parent().find(".fa-search").removeClass('fa-search').addClass('fa-remove');
                } else {
                    $(this).parent().find(".fa-remove").removeClass('fa-remove').addClass('fa-search');
                }
                if (evt.keyCode == 27) {
                    $(this).val("").trigger('textchange');
                }
                delay(function() {
                    phrase = $.trim(that.val());
                    filterQueue(phrase);
                }, 500);
            }).bind("keydown", function(evt) {
                if (evt.keyCode == 27) {
                    $(this).val("").trigger('textchange');
                }
                if (evt.keyCode == 13) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    return false;
                }
            });
            buttons.find('.filter-button').unbind().click(function(){
                filter.val("").trigger('textchange');
            });
            renderList();
        }

        function filterQueue(phrase) {
            var dataTable = queueList.data("dataTable");
            function processBeforeRender(data) {
                var hideWithDot = false;
                var _data = [];
                var totalItems = 0, totalBytes = 0, totalSelectedItems = 0, totalSelectedBytes = 0;
                var allSelected = true;
                for (var i = 0; i < data.length; i++) {
                    var curItem = data[i];
                    curItem.selected = "";
                    if (curItem.fullPath.toLowerCase().indexOf(phrase) >= 0) {
                        if (!hideWithDot || curItem.name.indexOf(".") != 0){
                            _data.push(curItem);
                            totalItems++;
                            totalBytes+=curItem.size;
                            if(!curItem.selected){
                                allSelected = false;
                            }
                            else{
                                totalSelectedItems++;
                                totalSelectedBytes+=curItem.size;
                            }
                        }
                    }
                }
                queueInfo.find(".total-files").text(totalItems);
                queueInfo.find(".total-size").text(crush.formatBytes(totalBytes));
                queueInfo.find(".filtered-text").show();
                if(allSelected && _data.length>0){
                    buttons.find(".select-all").addClass('checked');
                }
                else
                {
                    buttons.find(".select-all").removeClass('checked');
                }
                if(totalSelectedItems>0){
                    queueSelectedInfo.show();
                    queueSelectedInfo.find(".total-selected-files").text(totalSelectedItems);
                    queueSelectedInfo.find(".total-selected-size").text(crush.formatBytes(totalSelectedBytes));
                    selectionButtons.removeAttr('disabled');
                }
                else
                {
                    queueSelectedInfo.hide();
                    selectionButtons.prop('disabled', 'disabled');
                }
                return _data;
            }
            if (dataTable && dataTable.options) {
                if (dataTable.options.originalDS) {
                    dataTable.options.dataSource = dataTable.options.originalDS;
                }
            }
            var items = dataTable && dataTable.options ? dataTable.options.dataSource : [];
            if (dataTable && dataTable.options && !dataTable.options.originalDS)
                dataTable.options.originalDS = dataTable.options.dataSource;
            phrase = $.trim(phrase);
            queueList.parent().find(".filter-info").remove();
            if (phrase) {
                queueList.parent().append('<span class="filter-info"><i class="fa fa-filter"></i> <span loc="filterApplied">'+ loc("filterApplied") +'</span> <i class="fa fa-remove"></i></span>');
                queueList.parent().find(".filter-info").click(function() {
                    buttons.find(".filter-button").click();
                });
                phrase = phrase.toLowerCase();
                items = processBeforeRender(items);
                dataTable.rebind({
                    dataSource: items,
                    emptyTemplate:'<p class="text-center no-files"><span loc="noMatchingItemAvailable">'+loc("noMatchingItemAvailable")+'</span></p>'
                }, true).scroll("up");
            } else {
                var data = dataTable.options.dataSource;
                delete dataTable.options.originalDS;
                var allSelected = data.length>0 ? true : false;
                var totalSelectedItems = 0, totalSelectedBytes = 0;
                for (var i = 0; i < data.length; i++) {
                    var curItem = data[i];
                    if(!curItem.selected){
                        allSelected = false;
                    }
                    else{
                        totalSelectedItems++;
                        totalSelectedBytes+=curItem.size;
                    }
                }
                if(allSelected){
                    buttons.find(".select-all").addClass('checked');
                }
                else
                {
                    buttons.find(".select-all").removeClass('checked');
                }
                if(totalSelectedItems>0){
                    queueSelectedInfo.show();
                    queueSelectedInfo.find(".total-selected-files").text(totalSelectedItems);
                    queueSelectedInfo.find(".total-selected-size").text(crush.formatBytes(totalSelectedBytes));
                    selectionButtons.removeAttr('disabled');
                }
                else
                {
                    selectionButtons.prop('disabled', 'disabled');
                    queueSelectedInfo.hide();
                }
                if (dataTable && dataTable.options) {
                    dataTable.rebind({
                        emptyTemplate: '<p class="text-center no-files"><span loc="addFilesToUpload">'+loc("addFilesToUpload")+'</span></p>'
                    }, true);
                }
                queueInfo.find(".total-files").text(files.length);
                queueInfo.find(".total-size").text(crush.formatBytes(size));
                queueInfo.find(".filtered-text").hide();
            }
        }

        function renderItem(tmp, params, index, isApp) {
            var str = tmp.replace(new RegExp('{{random}}', 'g'), crush.random(6));
            str = str.replace(new RegExp('{{index}}', 'g'), index);
            str = $(Mustache.render(str, params));
            str.find(".btn, .success-mark, .failure-mark, .speed, .progress, .closing, .processing, .canceled, .failed, .skipped, .copy").hide();
            if(!params.error && !params.isReady && !params.status)
                str.find(".upload").show();
            if(params.sharedURL && isApp)
                str.find(".copy").show();
            if(params.status=="uploading")
                str.find(".cancel, .pause, .speed").show();
            else
                str.find(".remove").show();

            if(params.status=="paused"){
                str.find(".resume").show();
            }

            if(params.status=="uploading" || params.status=="paused")
                str.find(".progress").show();

            if(params.status=="done"){
                str.find(".success-mark, .re-upload").show();
            }

            if(params.status=="error"){
                str.find(".failure-mark").show();
            }

            if(params.status=="failed" || params.status=="canceled" || params.status=="skipped"){
                str.find(".failure-mark, .re-upload").show();
            }

            if(typeof params.formData != "undefined"){
                str.find(".details").show();
            }

            if(params.status=="processing" || params.status=="pausing" || params.status=="retrying")
                str.find(".processing").show();

            if(params.status=="canceled")
                str.find(".canceled").show();

            if(params.status=="skipped")
                str.find(".skipped").show();

            if(params.status=="failed")
                str.find(".failed").show();

            if(params.status=="closing" || (params.status=="retrying" && params.uploadInfo && params.uploadInfo.closing)){
                str.find(".processing").hide();
                str.find(".closing, .progress").show();
                if(params.closeStarted && params.name.toLowerCase().endsWith(".zipstream")){
                    var startTime = params.closeStarted;
                    var now = new Date().getTime();
                    var closeTook = Math.ceil((now - startTime)/1000);
                    if(closeTook > 1 || params.status=="retrying"){
                        str.find(".closing").addClass('unzipping');
                    }
                }
            }

            if(params.isReady && params.status !== "canceled" && params.status !== "skipped")
                str.find(".waiting").show();

            if((params.error && params.error.existsOnServer) || (params.error && params.error.exists)){
                str.find(".overwrite, .resume-file").show();
            }
            applyLoc(str);
            return str;
        }

        function renderList(force, justAdded, scrollToEnd) {
            if(typeof scrollToEnd != "undefined")
                scrollToEnd = scrollToEnd;
            else
                scrollToEnd = justAdded;
            filter.val("").trigger('textchange');
            queueInfo.find(".total-files").text(files.length);
            queueInfo.find(".total-size").text(crush.formatBytes(size));
            var dataTable = queueList.data("dataTable");
            if (dataTable) {
                var dataTable = queueList.data("dataTable");
                dataTable.rebind({
                    emptyTemplate: '<p class="text-center no-files"><span loc="addFilesToUpload">'+loc("addFilesToUpload")+'</span></p>',
                    dataSource: files,
                    height: listHeight,
                    originalDS : false,
                    scrollToEnd : scrollToEnd
                }, force);
            } else {
                var showNameInsteadOfFullPath = embed.invoke("uploadShowNameInsteadOfPath");
                if(showNameInsteadOfFullPath){
                    listItemTemplate = listItemTemplate.replace(/fullPathEscaped/g, 'name');
                }
                var isApp = (embed.invoke("isCrushShare") && embed.invoke("isElectron"));
                queueList.dataTable({
                    dataSource: files,
                    height: listHeight,
                    lineHeight: lineHeight,
                    template: listItemTemplate,
                    emptyTemplate: '<p class="text-center no-files"><span loc="addFilesToUpload">'+loc("addFilesToUpload")+'</span></p>',
                    minLinesToShow: 100,
                    renderMethod : function(str, params, index){
                        return renderItem(str, params, index, isApp);
                    },
                    onRenderStart: function(evt){
                        var dataTable = queueList.data("dataTable");
                        var dataSource = dataTable.options.dataSource;
                        if (dataSource && dataSource.length > 0) {
                            var hasError = false;
                            var i = dataSource.length;
                            while (i--) {
                                if(dataSource[i].error){
                                    hasError = true;
                                    break;
                                }
                            }
                        }
                    },
                    onRender: function(evt){
                        setTimeout(function(){
                            embed.resize();
                        }, 100);

                        setTimeout(function(){
                            queueLoader.removeClass('show');
                        }, 1000);
                    },
                    onClick: function(evt) {
                        if(evt.target)
                        {
                            var target = $(evt.target);
                            if(target.parent().is(".btn"))
                                target = target.parent();
                            handleUploadItemActions(target, evt);
                        }
                        evt.stopPropagation();
                        evt.preventDefault();
                        return false;
                    },
                    onContext: function(evt) {
                        handleUploadItemEvent(evt, "context");
                    },
                    onKeyDown: function(evt) {
                        handleUploadItemEvent(evt, "keydown");
                    },
                    onKeyUp: function(evt) {
                        handleUploadItemEvent(evt, "keyup");
                    }
                });
            }
        };

        function handleUploadItemActions(target, evt){
            var row = target.closest(".queue-item-row");
            if(target.is(".remove"))
            {
                queue.removeFiles({
                    ids : [row.attr("_id")]
                });
            }
            else if(target.is(".upload") || target.is(".re-upload"))
            {
                if(target.is(".re-upload"))
                {
                    queue.fileStatus(row.attr("_id"), "resend", true);
                }
                if(row && row.length>0)
                {
                    selectItemById(row.attr("_id"), true, true);
                    if(queue.status()=="idle" || queue.status() == "")
                    {
                        if(retryInProgress>0)
                            return false;
                        row.find(".selection").trigger("click");
                        upload.selected(function(){
                            queue.status("");
                        });
                    }
                    else if(queue.status() == "selected"){
                        row.find(".selection").trigger("click");
                    }
                }
            }
            else if(target.is(".cancel"))
            {
                upload.cancel(row.attr("_id"), function(ids){
                    if(retryInProgress>0)
                        return false;
                    upload.handleCancelFileAction(ids, function(){
                        if(queue.status() == "selected")
                            upload.selected();
                        else if(queue.status() == "all")
                            upload.all();
                    });
                });
            }
            else if(target.is(".pause"))
            {
                upload.pause(row.attr("_id"), function(){

                });
            }
            else if(target.is(".resume"))
            {
                upload.resume(row.attr("_id"), function(){

                });
            }
            else if(target.is(".overwrite"))
            {
                queue.overwrite(row.attr("_id"));
                addedFilesProcessed();
            }
            else if(target.is(".resume-file"))
            {
                queue.overwrite(row.attr("_id"), true);
            }
            else if(target.is(".details"))
            {
                queue.showForm(row.attr("_id"));
            }
            else if(target.is(".copy"))
            {
                var queueID = row.attr("_id");
                var fileInfo = getFileById(queueID);
                if(fileInfo && fileInfo.sharedURL){
                    embed.invokeElectronEvent("copy-url", fileInfo.sharedURL);
                    embed.invoke("urlCopied");
                }
            }
            else{
                handleUploadItemEvent(evt, "click");
            }
            target.blur();
        }

        function handleUploadItemEvent(evt, type) {
            if (!evt)
                return;
            var delay = (function() {
                var timer = 0;
                return function(callback, ms) {
                    clearTimeout(timer);
                    timer = setTimeout(callback, ms);
                };
            })();
            crush.removeRangeSelection();
            var target = $(evt.target);
            var targetElem = target.hasClass('queue-item-row') ? target : target.closest('.queue-item-row');
            queueList.focus();
            if (type == "context") {
                // evt.preventDefault();
                // evt.stopPropagation();
            } else if (type == "dblClick") {

            } else if (type == "click") {
                var meta = evt.ctrlKey || evt.metaKey;
                if(evt && evt.target && $(evt.target).is(".selection"))
                {
                    meta = true;
                }
                else
                {
                    return false;
                }

                var start = parseInt(targetElem.attr("_index"));
                var end;
                if (evt.shiftKey) {
                    end = queueList.data("lastSelectedIndex");
                    if (typeof end != "undefined") {
                        if (end < start) {
                            var hold = start;
                            start = end;
                            end = hold;
                        }
                    }
                }
                makeItemSelection({
                    start: start,
                    end: end
                }, evt.shiftKey, meta);
            }
            else if (type == "keydown") {
                if (evt.which == 46) {
                    removeSelected();
                    evt.preventDefault();
                    evt.stopPropagation();
                    return false;
                }
                else if (evt.which == 65 && (evt.metaKey || evt.ctrlKey)) {
                    var dataTable = queueList.data("dataTable");
                    var dataSource = dataTable.options.dataSource;
                    makeItemSelection({
                        start: 0,
                        end: dataSource.length
                    }, false, false, evt);
                    queueList.data("lastSelectedIndex", 0);
                    queueList.data("selectAll", true);
                    evt.preventDefault();
                    evt.stopPropagation();
                    return false;
                }
                else if (evt.which == 38 || evt.which == 40) // On up/down arrows
                {
                    // queueList.removeData("selectAll");
                    // var item = queueList.data("lastSelectedIndex") || 0;
                    // if (typeof item !== "undefined") {
                    //     var dataTable = queueList.data("dataTable");
                    //     var dataSource = dataTable.options.dataSource;
                    //     var toSelect;
                    //     if (evt.which == 38) {
                    //         if (item - 1 >= 0)
                    //             toSelect = item - 1;
                    //     } else {
                    //         if (item + 2 <= dataSource.length)
                    //             toSelect = item + 1;
                    //     }
                    //     if (typeof toSelect != "undefined") {
                    //         makeItemSelection({
                    //             start: toSelect
                    //         }, evt.shiftKey, evt.shiftKey);
                    //         dataTable.scrollToIndex(item);
                    //     }
                    // }
                    evt.preventDefault();
                    evt.stopPropagation();
                    return false;
                } else if (evt.which == 32) // spcebar scroll stop
                {
                    queueList.removeData("selectAll");
                    evt.preventDefault();
                    evt.stopPropagation();
                    return false;
                } else {
                    queueList.removeData("selectAll");
                }
            }
        }

        function selectItemById(id, flag, deselect){
            var dataTable = queueList.data("dataTable");
            var dataSource = dataTable.options.dataSource;
            var i = dataSource.length;
            var allSelected = true;
            var selection = 0;
            var selectionSize = 0;
            while (i--) {
                var curItem = dataSource[i];
                if(deselect){
                    curItem.selected = "";
                }
                if(curItem.id == id)
                    curItem.selected = flag ? "selected" : "";
                if(curItem.selected != "selected"){
                    allSelected = false;
                }
                else{
                    selection++;
                    selectionSize += curItem.size;
                }
            }
            if(allSelected){
                buttons.find(".select-all").addClass('checked');
            }
            else
            {
                buttons.find(".select-all").removeClass('checked');
            }
            dataTable.options.dataSource = dataSource;
            dataTable.rebind({}, true);
            if(selection>0){
                queueSelectedInfo.show();
                queueSelectedInfo.find(".total-selected-files").text(selection);
                queueSelectedInfo.find(".total-selected-size").text(crush.formatBytes(selectionSize));
                selectionButtons.removeAttr('disabled');
            }
            else
            {
                selectionButtons.prop('disabled', 'disabled');
                queueSelectedInfo.hide();
            }
        }

        function makeItemSelection(range, shift, meta, evt) {
            var dataTable = queueList.data("dataTable");
            var dataSource = dataTable.options.dataSource;
            var selection = 0;
            var selectionSize = 0;
            if (dataSource && dataSource.length > 0) {
                var allSelected = true;
                if(evt && typeof evt.selectAll != "undefined"){
                    var i = dataSource.length;
                    while (i--) {
                        var curItem = dataSource[i];
                        if (evt.selectAll)
                            curItem.selected = "selected";
                        else
                            curItem.selected = "";

                        if (curItem.selected == "selected") {
                            selection++;
                            selectionSize+=curItem.size;
                            if(queue.status() == "selected" && !ignoreStatus.has(curItem.status)){
                                curItem.isReady = true;
                            }
                        }
                        else{
                            allSelected = false;
                            if(queue.status() == "selected" && !ignoreStatus.has(curItem.status)){
                                curItem.isReady = false;
                            }
                        }
                    }
                }
                else{
                    if (typeof range.end == "undefined") {
                        var i = dataSource.length;
                        while (i--) {
                            var curItem = dataSource[i];
                            if (!meta)
                                curItem.selected = "";
                            if (i === range.start) {
                                var selected = "";
                                if (meta && !shift)
                                    selected = curItem.selected ? "" : "selected";
                                else
                                    selected = "selected";
                                curItem.selected = selected;
                            }

                            if (curItem.selected == "selected") {
                                selection++;
                                selectionSize+=curItem.size;
                                if(queue.status() == "selected" && !ignoreStatus.has(curItem.status)){
                                    curItem.isReady = true;
                                }
                            }
                            else{
                                allSelected = false;
                                if(queue.status() == "selected" && !ignoreStatus.has(curItem.status)){
                                    curItem.isReady = false;
                                }
                            }
                        }
                        queueList.data("lastSelectedIndex", range.start);
                    } else {
                        var i = dataSource.length;
                        while (i--) {
                            var curItem = dataSource[i];
                            if (!meta)
                                curItem.selected = "";
                            if (i >= range.start && i <= range.end) {
                                var selected = "";
                                if (meta && !shift)
                                    selected = curItem.selected ? "" : "selected";
                                else
                                    selected = "selected";
                                curItem.selected = selected;
                            }
                            if (curItem.selected == "selected") {
                                selection++;
                                selectionSize+=curItem.size;
                                if(queue.status() == "selected" && !ignoreStatus.has(curItem.status)){
                                    curItem.isReady = true;
                                }
                            }
                            else{
                                allSelected = false;
                                if(queue.status() == "selected" && !ignoreStatus.has(curItem.status)){
                                    curItem.isReady = false;
                                }
                            }
                        }
                    }
                }
                if(allSelected){
                    buttons.find(".select-all").addClass('checked');
                }
                else
                {
                    buttons.find(".select-all").removeClass('checked');
                }
                dataTable.options.dataSource = dataSource;
                dataTable.rebind({}, true);
            }
            if(selection>0){
                queueSelectedInfo.show();
                queueSelectedInfo.find(".total-selected-files").text(selection);
                queueSelectedInfo.find(".total-selected-size").text(crush.formatBytes(selectionSize));
                selectionButtons.removeAttr('disabled');
            }
            else
            {
                selectionButtons.prop('disabled', 'disabled');
                queueSelectedInfo.hide();
            }
        }

        function nextItemAvailable(onlySelected){
            for (var i = 0; i < files.length; i++) {
                var curItem = files[i];
                if (!ignoreStatus.has(curItem.status) && curItem.isReady) {
                    if(onlySelected)
                    {
                        if(curItem.selected){
                            return true;
                        }
                    }
                    else{
                        return true;
                    }
                }
            }
            return false;
        }

        function nextFile(onlySelected) {
            if(ongoingRequests < requestsAllowedPerDomain)
            {
                for (var i = 0; i < files.length; i++) {
                    var curItem = files[i];
                    if (!ignoreStatus.has(curItem.status) && curItem.isReady) {
                        if(onlySelected)
                        {
                            if(curItem.selected){
                                return curItem;
                            }
                        }
                        else{
                            return curItem;
                        }
                    }
                }
            }
            else{
                if(crush.enableLogging)
                {
                    console.log("Queue stopped at next file", ongoingRequests);
                }
                for (var i = 0; i < files.length; i++) {
                    var curFile = files[i];
                    var fileInfo = fileList[curFile.id];
                    if((curFile.status == "closing" || curFile.status == "retrying" || curFile.status == "uploading" || curFile.status == "pausing" || curFile.status == "init") && fileInfo.callbackVoid)
                    {
                        delete fileInfo.callbackVoid;
                    }
                }
            }
            return false;
        };

        function renderSelectedItem(data, isApp){
            var row = queueList.find(".queue-item-row[_id='"+data.id+"']:first");
            if(row && row.length>0){
                var html = queue.renderItem(queue.listItemTemplate, data, row.attr("_index"), isApp);
                row.html($(html).html());
            }
        }
        function updateFileMetaData(id, params){
            var isApp = (embed.invoke("isCrushShare") && embed.invoke("isElectron"));
            for (var i = 0; i < files.length; i++) {
                var curItem = files[i];
                if (curItem.id == id) {
                    curItem = $.extend(curItem, params);
                    renderSelectedItem(curItem, isApp);
                    continue;
                }
            }
        }

        function fileError(id, error, isReady, resume){
            if(typeof error == "undefined"){
                for (var i = 0; i < files.length; i++) {
                    var curItem = files[i];
                    if (curItem.id == id) {
                        return curItem.error;
                    }
                }
            }
            else{
                for (var i = 0; i < files.length; i++) {
                    var curItem = files[i];
                    if (curItem.id == id) {
                        if(!error.exists && !error.existsOnServer && !error.sizeExceed && !error.fileExtenstionNotAllowed && !error.verifying && !error.nameSizeExceed)
                            error = false;
                        curItem.error = error;
                        if(error == false){
                            curItem.status = "";
                        }
                        if(typeof isReady != "undefined"){
                            if(curItem.status == "")
                                curItem.isReady = isReady;
                        }
                        if(typeof resume != "undefined"){
                            curItem.resumeTransfer = resume;
                            curItem.ask = false;
                        }
                        renderSelectedItem(curItem);
                        return curItem;
                    }
                }
            }
        }

        function fileOpts(id, resume, ask) {
            for (var i = 0; i < files.length; i++) {
                var curItem = files[i];
                if (curItem.id == id) {
                    if (typeof resume == "undefined" && typeof ask == "undefined") {
                        return {
                            resume : curItem.resumeTransfer,
                            ask : curItem.ask
                        };
                    }
                    else if(resume){
                        curItem.resumeTransfer = resume;
                    }
                    else if(ask){
                        curItem.ask = ask;
                    }
                    return {
                        resume : curItem.resumeTransfer,
                        ask : curItem.ask
                    };
                }
            }
        }

        function fileMessage(id, msg){
            for (var i = 0; i < files.length; i++) {
                var curItem = files[i];
                if (curItem.id == id) {
                    if(typeof msg != "undefined")
                    {
                        curItem.message = msg;
                        i = files.length+1;
                    }
                    else
                        return curItem.message;
                }
            }
        }

        function localizeErrorMessage(msg){
            if(msg){
                if(msg.toLowerCase().indexOf("access denied")>=0)
                    msg = locTop("FileUploadAccessDeniedErrorMsgText") || msg;
                else if(msg.toLowerCase().indexOf("content not allowed")>=0)
                    msg = locTop("FileUploadContentNotAllowedErrorMsgText") || msg;
                else if(msg.toLowerCase().indexOf("overwrite a file")>=0)
                    msg = locTop("FileUploadCanNotOverwriteErrorMsgText") || msg;
                msg = $("<div></div>").html(msg).text()
            }
            return unescape(msg);
        }

        function fileStatus(id, status, isReady, stats, msg, selected) {
            if (!status && !isReady) {
                for (var i = 0; i < files.length; i++) {
                    var curItem = files[i];
                    if (curItem.id == id) {
                        return curItem.status;
                    }
                }
            } else {
                for (var i = 0; i < files.length; i++) {
                    var curItem = files[i];
                    if (curItem.id == id) {
                        if(status)
                        {
                            curItem.status = status;
                            if(typeof msg != "undefined")
                            {
                                curItem.message = localizeErrorMessage(msg);
                                embed.invokeElectronEvent("upload-failed", {message: curItem.message});
                                crushUpload.justRaisedAnError = true;
                            }
                            if(status == "done"){
                                // curItem.selected = "";
                                if(stats)
                                    curItem.stats = stats;
                            }
                            else{
                                delete curItem.stats;
                            }
                            if(status == "uploading" && !queue.intervals["int_"+curItem.id]){
                                queue.intervals["int_"+curItem.id] = setInterval(function(){
                                    if(upload.checkProgress(id) == "done")
                                    {
                                        clearInterval(queue.intervals["int_"+curItem.id]);
                                        delete queue.intervals["int_"+curItem.id];
                                    }
                                }, 1000);
                            }
                            else if(status != "closing")
                            {
                                clearInterval(queue.intervals["int_"+curItem.id]);
                                delete queue.intervals["int_"+curItem.id];
                            }
                            if(status == "resend")
                            {
                                if(typeof selected != "undefined")
                                    curItem.selected = selected;
                                curItem.uploadInfo = {};
                                var fileInfo = fileList[curItem.id];
                                fileInfo.uploadInfo = {};
                                delete fileInfo.closing;
                                delete fileInfo.lastChunk;
                                fileInfo.chunkSize = MB * initChunkSize;
                                fileInfo.chunkBeingUploaded = 0;
                                fileInfo.chunkPos = 0;
                                delete fileInfo.callbackVoid;
                                delete fileInfo.chunks;
                                delete fileInfo.xhrs;
                                delete fileInfo.done;
                                delete fileInfo.startTime;
                                delete fileInfo.startingPoint;
                            }
                        }
                        if(typeof isReady != "undefined")
                            curItem.isReady = isReady;
                        renderSelectedItem(curItem);
                        return curItem;
                    }
                }
            }
        };

        function getItemsToShare(selected, isApp){
            isApp = isApp || (embed.invoke("isCrushShare") && embed.invoke("isElectron"));
            var paths = [];
            var names = [];
            var ids = [];
            for (var i = 0; i < files.length; i++) {
                if(files[i].status == "done"){
                    var invalid = false;
                    if(isApp)
                    {
                        if(files[i].shared){
                            invalid = true;
                        }
                    }
                    if(!invalid)
                    {
                        if(selected){
                            if(files[i].selected){
                                if(paths.indexOf(files[i].fullPath)<0){
                                    paths.push(files[i].fullPath);
                                    names.push(files[i].name);
                                    ids.push(files[i].id);
                                }
                            }
                        }
                        else{
                            if(paths.indexOf(files[i].fullPath)<0){
                                paths.push(files[i].fullPath);
                                names.push(files[i].name);
                                ids.push(files[i].id);
                            }
                        }
                    }
                }
            };
            return {
                paths : paths,
                files : names,
                ids: ids
            }
        };

        function fileFormData(data, item){
            for (var i = 0; i < files.length; i++) {
                var curItem = files[i];
                if (curItem.id == item.id) {
                    curItem.formData = data;
                    renderSelectedItem(curItem);
                    return curItem;
                }
            }
        };

        function getFileById(id){
            for (var i = 0; i < files.length; i++) {
                var curItem = files[i];
                if (curItem.id == id) {
                    return curItem;
                }
            }
            return false;
        };

        function getFileIndex(id){
            for (var i = 0; i < files.length; i++) {
                var curItem = files[i];
                if (curItem.id == id) {
                    return i;
                }
            }
            return false;
        };

        function commonFormData(data){
            if(typeof data == "undefined")
                return commonFormDataVal;
            else
                commonFormDataVal = data;
        };

        return {
            status : status,
            startTime : startTime,
            requests: requests,
            size: size,
            files: function(){return files},
            listItemTemplate : listItemTemplate,
            renderItem : renderItem,
            nextFile: nextFile,
            nextItemAvailable : nextItemAvailable,
            fileStatus: fileStatus,
            fileMessage : fileMessage,
            fileOpts: fileOpts,
            fileError : fileError,
            init : init,
            renderList: renderList,
            fileExists : fileExists,
            updateFileMetaData : updateFileMetaData,
            renderSelectedItem : renderSelectedItem,
            filterQueue : filterQueue,
            addFile : addFileToQueue,
            removeFiles : removeFiles,
            removeSelected: removeSelected,
            removeWithError: removeWithError,
            removeUploaded : removeUploaded,
            removeCanceled : removeCanceled,
            removeSkipped : removeSkipped,
            removeAll : removeAll,
            showForm : showForm,
            commonFormData : commonFormData,
            fileFormData : fileFormData,
            getFileIndex : getFileIndex,
            getFileById : getFileById,
            overwrite : overwrite,
            intervals: intervals,
            getItemsToShare : getItemsToShare,
            selected : function(){
                queueIn(true);
            },
            all : function(){
                queueIn();
            },
            realFileStatus : realFileStatus,
            canUploadNextFile : canUploadNextFile,
            showReuploadButton: showReuploadButton
        }
    }());

    var globalProgress = (function(){
        var template = $('#tplGlobalProgressbar').html();
        var isPaused = false, processing = false;
        var failedFilesCount = $('#failedFilesCount');

        function showLoading(val){
            processing = val;
            rebind();
        }

        function paused(){
            isPaused = true;
            rebind();
        };

        function resumed(){
            isPaused = false;
            rebind();
        };

        function rebind(force){
            var panelToUse = $('#container');
            if(!force)
            {
                if(queue.status() == "idle" || queue.status() == "")
                {
                    panelToUse.find(".global-progressbar").remove();
                    embed.resize(true);
                    return;
                }
            }
            var files = queue.files();
            var data = {
                perc : 0,
                totalSize : 0,
                uploadedSize : 0,
                uploaded : 0,
                failedItems : [],
                totalItems : 0,
                currentIndex : 0,
                fileName : "",
                currentSpeed : 0,
                averageSpeed : 0,
                speed : "-",
                elapsed : "-",
                remaining : "-",
                paused : isPaused,
                processing : processing
            };
            for (var i = 0; i < files.length; i++) {
                var curFile = files[i];
                data.totalItems++;
                data.totalSize += curFile.size;
                if(curFile.status == "done" || curFile.status == "canceled" || curFile.status == "error" || curFile.status == "skipped"){
                    data.uploaded++;
                    data.uploadedSize += curFile.size;
                }
                else if(curFile.status == "uploading" || curFile.status == "closing" || curFile.status == "init" || curFile.status == "paused" || curFile.status == "retrying"){
                    data.fileName = curFile.name;
                    if(curFile.uploadInfo){
                        var uploaded = curFile.uploadInfo.uploadedU || 0;
                        data.uploadedSize += uploaded;
                    }
                }
                else if(curFile.status == "failed" && curFile.message)
                {
                    data.failedItems.push(curFile);
                }
            };
            var startTime = queue.startTime();
            if(!startTime)
            {
                data.currentSpeed = 0;
                data.averageSpeed = 0;
            }
            else{
                var now = new Date().getTime();
                var elapsed = (now - startTime)/1000;
                var totalBytes = data.totalSize;
                var uploadedBytes = data.uploadedSize;
                var secs = ((totalBytes * elapsed) / uploadedBytes) - elapsed;
                var pendingItems = data.totalItems - (data.uploaded + data.failedItems.length);
                if(secs < pendingItems * 2){
                    secs = pendingItems * 2;
                }
                if(uploadedBytes==0)
                    secs = "-";
                var remaining = crush.formatTime(secs);//formatted time
                var elapsedTime = crush.formatTime(elapsed + "");// elapsed time formatted
                var speed = "";
                if ((totalBytes / uploadedBytes) == 0 || elapsed == 0) {// Still Calculating
                    speed = "-";
                    remaining = "-";
                } else {
                    speed = (uploadedBytes / elapsed);
                }
                data.elapsed = elapsedTime;
                data.remaining = remaining;
                data.currentSpeed = crush.formatBytes(speed);
            }
            data.perc = ((uploadedBytes / totalBytes) * 100.0).toFixed(2);
            data.totalSize = crush.formatBytes(data.totalSize);
            data.uploadedSize = crush.formatBytes(data.uploadedSize);
            data.currentIndex = data.uploaded + 1;
            render(data, panelToUse);
            bindEvents(panelToUse);
            if(force && (queue.status()=="idle" || queue.status() == ""))
            {
                panelToUse.find(".global-progressbar").remove();
                embed.resize(true);
                return;
            }
        }

        function render(data, panel, prepend){
            if(!crushUpload.justRaisedAnError){
                embed.invokeElectronEvent("upload-progress", data);
            }
            setTimeout(function(){
                crushUpload.justRaisedAnError = false;
            }, 1000);
            var len = panel.find(".global-progressbar").remove();
            embed.resize(true);
            if(!prepend)
                $(panel).append($(Mustache.render(template, data)));
            else
                $(panel).prepend($(Mustache.render(template, data)));
            applyLoc(panel.find(".global-progressbar"));
            embed.resize(true);
            if(data.failedItems && data.failedItems.length > 0){
                failedFilesCount.text(data.failedItems.length).parent().show().unbind().click(function(){
                    var msg = '<div class="row"><div class="col-sm-6 text-center"><strong><span loc="file">'+loc("file")+'</span></strong></div><div class="col-sm-6 text-center"><strong><span loc="reason">'+loc("reason")+'</span></strong></div></div></div><div class="failed-items-list">';
                    for (var i = 0; i < data.failedItems.length; i++) {
                        var curItem = data.failedItems[i];
                        msg += '<div class="row"><div class="col-sm-6">'+crush.textEncode(curItem.fullPath)+'</div><div class="col-sm-6">'+crush.textEncode(curItem.message)+'</div></div>';
                    }
                    msg += "</div>";
                    var queueStatus = queue.status();
                    var dialog = bootbox.dialog({
                        title : loc("failedItems"),
                        message: msg,
                        onEscape : true,
                        buttons: {
                            cancel: {
                                label: '<i class="fa fa-eraser"></i> <span loc="ignoreAll">' + loc("ignoreAll") + '</span>',
                                className: 'btn-danger',
                                callback: function() {
                                    for (var i = 0; i < data.failedItems.length; i++) {
                                        var curItem = data.failedItems[i];
                                        queue.fileMessage(curItem.id, "");
                                        rebind(true);
                                    }
                                }
                            },
                            confirm: {
                                label: '<i class="fa fa-refresh"></i> <span loc="retryAll">' + loc("retryAll") + '</span>',
                                className: 'btn-success',
                                callback: function() {
                                    for (var i = 0; i < data.failedItems.length; i++) {
                                        var curItem = data.failedItems[i];
                                        queue.fileStatus(curItem.id, "resend", true, undefined, "");
                                    }
                                    if(queue.realFileStatus()=="idle")
                                    {
                                        upload.all();
                                    }
                                    rebind(true);
                                }
                            }
                        }
                    });
                });
            }
            else
            {
                failedFilesCount.parent().hide();
            }
        }

        function bindEvents(panel){
            panel.find(".buttons").find("a").click(function(e){
                e.stopPropagation();
                e.preventDefault();
                if($(this).is(".skip")){
                    var files = queue.files();
                    var id;
                    for (var i = 0; i < files.length; i++) {
                        var curFile = files[i];
                        if(curFile.status == "uploading" || curFile.status == "paused" || curFile.status == "retrying"){
                            id = curFile.id;
                            continue;
                        }
                    }
                    if(id){
                        upload.cancel(id, function(ids){
                            processing =
                            isPaused = false;
                            rebind();
                            if(retryInProgress>0)
                                return false;
                            upload.handleCancelFileAction(ids, function(){
                                if(queue.status() == "selected")
                                    upload.selected();
                                else if(queue.status() == "all")
                                    upload.all();
                            });
                        });
                    }
                }
                else if($(this).is(".pause")){
                    var files = queue.files();
                    var id;
                    for (var i = 0; i < files.length; i++) {
                        var curFile = files[i];
                        if(curFile.status == "uploading"){
                            id = curFile.id;
                            continue;
                        }
                    }
                    globalProgress.showLoading(true);
                    upload.pause(id, function(){
                        globalProgress.showLoading(false);
                    });
                }
                else if($(this).is(".resume")){
                    var files = queue.files();
                    var id;
                    for (var i = 0; i < files.length; i++) {
                        var curFile = files[i];
                        if(curFile.status == "paused"){
                            id = curFile.id;
                            i = files.length;
                        }
                    }
                    globalProgress.showLoading(true);
                    upload.resume(id, function(){
                        globalProgress.showLoading(false);
                    });
                }
                else if($(this).is(".cancelAll")){
                    upload.cancel(false, function(ids){
                        upload.handleCancelFileAction(ids, function(){
                            queue.status("");
                            embed.invoke("uploadInProgress", [false]);
                        });
                    });
                }
            });
        }

        return {
            rebind : rebind,
            render : render,
            paused : paused,
            resumed : resumed,
            showLoading : showLoading
        }
    }());

    var upload = (function() {
        var pauseNext;
        var dirsCreated = [];
        var queueLoader = $('#rendering-queue');
        function completed(cb){
            ongoingRequests = 0;
            if(cb)
                cb();
        };

        //specify file id to start uploading that specific file
        function file(fileId, cb) {
            if(retryInProgress>0)
                return;
            queue.fileStatus(fileId, "init");
            var startTime = new Date().getTime();
            openFileStream(fileId, function(resume, error, cancel, msg) {
                if(cancel){
                    var status = msg ? "failed" : "skipped";
                    msg = crush.textEncode(msg) || loc("failedOpeningFile");
                    queue.fileStatus(fileId, status, false, undefined, msg);
                    if(status == "failed")
                        queue.fileOpts(fileId, true);
                    cb(true);
                    if(scrollWithActivity.is(":checked")){
                        setTimeout(function(){
                            scrollToItem(fileId);
                        }, 500);
                    }
                }
                else{
                    if (!error) {
                        start(fileId, cb, resume, startTime);
                    } else {
                        queue.fileStatus(fileId, "failed", false, undefined, loc("failedOpeningFile"));
                        queue.fileOpts(fileId, true);
                        var fileInfo = fileList[fileId];
                        var xhrs = fileInfo.xhrs || {};
                        for(var xhr in xhrs){
                            //decreaseRequestCount("xhrs aborted");
                            xhrs[xhr].abort();
                            delete xhrs[xhr];
                        }
                        cb(error);
                    }
                }
            });
        };

        function selected(cb, noStart, reupload){
            if(retryInProgress>0)
                return;
            if(reupload){
                var files = queue.files();
                for (var i = 0; i < files.length; i++) {
                    var curFile = files[i];
                    if(curFile.status == "done" || curFile.status == "failed" || curFile.status == "canceled" || curFile.status == "skipped"){
                        queue.fileStatus(curFile.id, "resend", true, undefined, "");
                        queue.updateFileMetaData(curFile.id, {
                            selected : "selected"
                        });
                    }
                    else{
                        queue.updateFileMetaData(curFile.id, {
                            selected : ""
                        });
                    }
                };
                overwriteAll = true;
            }
            queue.status("selected");
            queue.selected();
            var files = queue.files();
            var names = [];
            for (var i = 0; i < files.length; i++) {
                var curFile = files[i];
                if(curFile.selected){
                    names.push({
                        name: curFile.name,
                        uploading_to: curFile.fullPath,
                        size: curFile.size,
                        status: curFile.status
                    });
                }
            };
            embed.invoke("uploadNotifications", [{type:'uploadStarted', mode: 'selected-files', files: names}]);
            if(!noStart){
                dirsCreated = [];
                queue.startTime(new Date().getTime());
                embed.invoke("uploadInProgress", [true]);
                startQueue(function(dontNotify){
                    if(retryInProgress>0 || queue.realFileStatus()!=="idle")
                        return;
                    if(cb)
                        cb();
                    queue.status("");
                    embed.invoke("uploadInProgress", [false]);
                    queue.showReuploadButton();
                    $('#container').find(".global-progressbar").remove();
                    embed.resize(true);
                    var files = queue.files();
                    var names = [];
                    var allSucceed = true;
                    var errMsg = "";
                    for (var i = 0; i < files.length; i++) {
                        var curFile = files[i];
                        names.push({
                            name: curFile.name,
                            uploading_to: curFile.fullPath,
                            size: curFile.size,
                            status: curFile.status
                        });
                        if(curFile.status && curFile.status !== "done"){
                            allSucceed = false;
                            errMsg = curFile.message || "";
                        }
                    };
                    if(!dontNotify)
                    {
                        embed.invoke("uploadDoneNotify", [true, !allSucceed, errMsg]);
                    }
                    else{
                        embed.invoke("resetUploadFormStatus");
                    }

                    embed.invoke("uploadNotifications", [{type:'uploadCompleted', files: names}]);
                    overwriteAll = resumeAll = skipAll = false;
                });
            }
        };

        /*Look here*/
        function all(cb, noStart){
            if(retryInProgress>0)
                return;
            queue.status("all");
            queue.all();
            var files = queue.files();
            var names = [];
            for (var i = 0; i < files.length; i++) {
                var curFile = files[i];
                names.push({
                    name: curFile.name,
                    uploading_to: curFile.fullPath,
                    size: curFile.size,
                    status: curFile.status
                });
            };
            embed.invoke("uploadNotifications", [{type:'uploadStarted', mode: 'all-files', files: names}]);
            if(!noStart){
                dirsCreated = [];
                queue.startTime(new Date().getTime());
                embed.invoke("uploadInProgress", [true]);
                startQueue(function(dontNotify){
                    if(retryInProgress>0 || queue.realFileStatus()!=="idle")
                        return;
                    if(cb)
                        cb();
                    queue.status("");
                    embed.invoke("uploadInProgress", [false]);
                    queue.showReuploadButton();
                    $('#container').find(".global-progressbar").remove();
                    embed.resize(true);
                    //queue.renderList(true);
                    if(!dontNotify)
                    {
                        embed.invoke("uploadDoneNotify");
                    }
                    else{
                        embed.invoke("resetUploadFormStatus");
                    }
                    var files = queue.files();
                    var names = [];
                    for (var i = 0; i < files.length; i++) {
                        var curFile = files[i];
                        names.push({
                            name: curFile.name,
                            uploading_to: curFile.fullPath,
                            size: curFile.size,
                            status: curFile.status
                        });
                    };
                    embed.invoke("uploadNotifications", [{type:'uploadCompleted', files: names}]);
                    overwriteAll = resumeAll = skipAll = false;
                });
            }
        };

        function isPaused(){
            var files = queue.files();
            for (var i = 0; i < files.length; i++) {
                var curFile = files[i];
                if(curFile.status == "pausing" || curFile.status == "paused")
                    return true;
            };
            return false;
        }

        function startQueue(cb) {
            if(retryInProgress>0 || ongoingRequests >= maxRequests){
                if(crush.enableLogging)
                {
                    console.log("Queue stopped at start queue", ongoingRequests);
                }
                var files = queue.files();
                for (var i = 0; i < files.length; i++) {
                    var curFile = files[i];
                    var fileInfo = fileList[curFile.id];
                    if((curFile.status == "closing" || curFile.status == "retrying" || curFile.status == "uploading" || curFile.status == "pausing" || curFile.status == "init") && fileInfo.callbackVoid)
                    {
                        delete fileInfo.callbackVoid;
                    }
                }
                return;
            }
            prepareAltDomains(function(){
                var fileToUpload = queue.nextFile();
                if (fileToUpload) {
                    upload.file(fileToUpload.id, function(error) {
                        if(!isPaused()){
                            globalProgress.rebind();
                            if(!queue.canUploadNextFile()){
                                return;
                            }
                            var next = queue.nextFile();
                            if(pauseNext){
                                var fileInfo = fileList[next.id];
                                queue.fileStatus(next.id, "paused", false);
                                globalProgress.paused();
                                globalProgress.showLoading(false);
                                fileInfo.lastStatus = "unknown";
                                fileInfo.resume = function(){
                                    startQueue(cb);
                                }
                                pauseNext = false;
                            }
                            else{
                                globalProgress.resumed();
                                globalProgress.showLoading(false);
                                if(next){
                                    ongoingRequests = ongoingRequests < 0 ? 0 : ongoingRequests;
                                    if (ongoingRequests < maxRequests) {
                                        startQueue(cb);
                                    }
                                    else{
                                        if(crush.enableLogging)
                                        {
                                            console.log("Queue stopped at start queue for next", ongoingRequests);
                                        }
                                        var files = queue.files();
                                        for (var i = 0; i < files.length; i++) {
                                            var curFile = files[i];
                                            var fileInfo = fileList[curFile.id];
                                            if((curFile.status == "closing" || curFile.status == "retrying" || curFile.status == "uploading" || curFile.status == "pausing" || curFile.status == "init") && fileInfo.callbackVoid)
                                            {
                                                delete fileInfo.callbackVoid;
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    if(retryInProgress>0 || queue.realFileStatus()!=="idle")
                                    {
                                        var files = queue.files();
                                        for (var i = 0; i < files.length; i++) {
                                            var curFile = files[i];
                                            var fileInfo = fileList[curFile.id];
                                            if((curFile.status == "closing" || curFile.status == "retrying" || curFile.status == "uploading" || curFile.status == "pausing" || curFile.status == "init") && fileInfo.callbackVoid)
                                            {
                                                delete fileInfo.callbackVoid;
                                            }
                                        }
                                    }
                                    else{
                                        queue.status("");
                                        if (cb)
                                            cb();
                                        completed();
                                    }
                                }
                            }
                        }
                    });
                } else {
                    queue.status("");
                    if (cb)
                        cb(true);
                    completed();
                }
            });
        };

        //Cancel all or particular file
        function cancel(fileId, cb, noConfirm){
            var cancelledIds = [];
            if(!noConfirm)
            {
                if(fileId){
                    var fileInfo = fileList[fileId];
                    var fileName = fileInfo.file.fullPath;
                    if(!confirm(loc("cancelConfirmation") + "\""+fileName+"\"?"))
                        return false;
                }
                else{
                    if(!confirm(loc("cancelConfirmation") + "?"))
                        return false;
                }
            }
            if(fileId){
                (function(id) {
                    cancelUpload(id, function(){
                        $.when(crush.data.ajax({
                            command: "blockUploads",
                            fileId : fileId,
                            random: Math.random(),
                            c2f:crush.getAuth()
                        })).done(function(msg) {
                            if(cb)
                                cb([fileId]);
                        });
                    });
                })(fileId);
            }
            else{
                var toCancel = 0, totalCanceled = 0;
                for (var file in fileList) {
                    var status = queue.fileStatus(file);
                    if(cancellableStatus.has(status))
                    {
                        toCancel++;
                        if(status == "init" || status == "uploading" || status == "closing")
                            cancelledIds.push(file);
                        cancelUpload(file, function(){
                            totalCanceled++;
                            if(totalCanceled == toCancel && cb){
                                cb(cancelledIds);
                                cb = false;
                            }
                        });
                    }
                };
            }
            function cancelUpload(fileId, _cb){
                var fileInfo = fileList[fileId];
                queue.fileStatus(fileId, "processing", false);
                var xhrs = fileInfo.xhrs || {};
                for(var xhr in xhrs){
                    //decreaseRequestCount("Upload canceled");
                    xhrs[xhr].abort();
                    delete xhrs[xhr];
                }
                queue.fileStatus(fileId, "canceled", false);
                if(_cb)
                    _cb();
            }
        }

        //Pause all or particular file
        function pause(fileId, cb){
            if(fileId)
            {
                var fileInfo = fileList[fileId];
                fileInfo.paused = function(){
                    queue.fileStatus(fileId, "paused", false);
                    globalProgress.paused();
                    delete fileInfo.paused;
                    if(cb)
                        cb();
                }
                var status = queue.fileStatus(fileId);
                fileInfo.lastStatus = status;
                queue.fileStatus(fileId, "pausing", false);
            }
            else{
                pauseNext = true;
            }
        }

        //Resume all or particular file
        function resume(fileId, cb){
            $.when(isFileOpen(fileId)).done(function(){
                var fileInfo = fileList[fileId];
                var history = [];
                var uploadInfo = fileInfo.uploadInfo || {};
                var then = fileInfo.startTime;
                var now = new Date().getTime();
                var seconds = ((now - then)/1000);
                var elapsed = uploadInfo.timeElapsedU ? Math.round(uploadInfo.timeElapsedU) : 0;
                if(elapsed>0)
                    elapsed-=1;
                var startTime = moment(now).subtract(elapsed, 's').valueOf();
                var queueStartTime = queue.startTime();
                if(queueStartTime){
                    queue.startTime(moment(queueStartTime).add(seconds, "s").valueOf());
                }
                else{
                    queue.startTime(startTime);
                }
                fileInfo.startTime = startTime;
                var uploaded = uploadInfo.uploadedU || 0;
                uploadInfo.history = [{
                    now: startTime,
                    bytes: uploaded
                },{
                    now: now,
                    bytes: uploaded
                }];
                if(fileInfo.resume){
                    queue.fileStatus(fileId, fileInfo.lastStatus, false);
                    fileInfo.resume();
                    globalProgress.resumed();
                    delete fileInfo.lastStatus;
                    delete fileInfo.resume;
                    if(cb)
                        cb();
                }
            }).fail(function(err, msg){
                if(retryInProgress>0)
                    return;
                queue.fileStatus(fileId, "resend", true);
                if(queue.status() == "selected")
                    upload.selected();
                else if(queue.status() == "all")
                    upload.all();
            });
        }

        //Scroll to item being uploaded
        function scrollToItem(fileId){
            var row = queueList.find(".queue-item-row[_id='"+fileId+"']:first");
            var scrollTo;
            var files = queue.files();
            //if((row.length>0 && !crush.isVisibleOnScreen(row, queueList)) || row.length==0)
            {
                for (var i = 0; i < files.length; i++) {
                    if(files[i].id == fileId){
                        var dataTable = queueList.data("dataTable");
                        if(dataTable){
                            dataTable.scrollToIndex(i);
                        }
                        i = files.length+1;
                    }
                };
            }
        }

        //Internal method to start uploading the file
        function start(fileId, cb, resumeFlag, startTime) {
            if(typeof window.crushUpload.requestRetries != "undefined" && crush.isNumeric(window.crushUpload.requestRetries))
                requestRetries = window.crushUpload.requestRetries;
            var fileInfo = fileList[fileId];
            var chunkInfo = [];
            var uploadingFileSize = fileInfo.file.size;
            var fileSize, startFrom;
            resumeFlag = resumeFlag || 0;
            if(!crush.isNumeric(resumeFlag))
                resumeFlag = 0;
            else
                resumeFlag = parseInt(resumeFlag);
            if(resumeFlag){
                fileSize = uploadingFileSize - resumeFlag;
                if(fileSize<0)
                    fileSize = uploadingFileSize;
            }
            else
                fileSize = uploadingFileSize;

            if (fileSize < fileInfo.chunkSize) {
                fileInfo.lastChunk = true;
            }
            var chunksToCreate = maxRequests - ongoingRequests;
            // if(chunksToCreate<=0){
            //     chunksToCreate = 1;
            // }
            if(fileSize < fileInfo.chunkSize){
                chunksToCreate = 1;
                fileInfo.lastChunk = true;
            }
            else if(fileSize < fileInfo.chunkSize * chunksToCreate)
            {
                chunksToCreate = Math.round(fileSize/fileInfo.chunkSize);
                if(chunksToCreate<=0){
                    chunksToCreate = 1;
                    fileInfo.lastChunk = true;
                }
            }
            queue.updateFileMetaData(fileId, {
                uploadInfo : {
                    total : crush.formatBytes(uploadingFileSize),
                    uploaded : crush.formatBytes(resumeFlag)
                }
            });
            function createChunks(){
                fileInfo.chunkPos = resumeFlag;
                var fileSize = parseInt(fileInfo.file.size);
                for (var i = 0; i < chunksToCreate; i++) {
                    var totalSize = parseInt(fileInfo.chunkPos) + parseInt(fileInfo.chunkSize);
                    var chunkSize = fileInfo.chunkSize + 0;
                    var chunkPos = fileInfo.chunkPos + 0;
                    if(totalSize > fileSize)
                    {
                        if(chunkPos < fileSize){
                            chunkSize = fileSize - chunkPos;
                        }
                        else{
                            chunkSize = 0;
                        }
                    }
                    if(chunkSize)
                    {
                        if(chunkPos + chunkSize <= fileInfo.file.size)
                        {
                            chunkInfo.push({
                                index: i,
                                start: chunkPos,
                                size: chunkSize,
                                status: null
                            });
                            fileInfo.chunkPos += chunkSize;
                            fileInfo.chunkSize = chunkSize;
                        }
                        else{
                            if(crush.enableLogging)
                                console.log('Caught:', chunkPos, chunkSize, fileInfo.file.size);
                        }
                    }
                    if(crush.enableLogging)
                    {
                        console.log('Creating ' + chunksToCreate + ' chunks of size ' + crush.formatBytes(chunkSize), '|' + new Date().getTime());
                    }
                }
            }
            createChunks();
            fileInfo.chunks = chunkInfo;
            fileInfo.startTime = startTime || new Date().getTime();
            fileInfo.startingPoint = resumeFlag;
            queue.fileStatus(fileId, "uploading", false);
            fileInfo.startUpload = function(recreate){
                if(recreate){
                    if(fileInfo.chunks<=0){
                        chunksToCreate = 4;
                        createChunks();
                        if(crush.enableLogging)
                        {
                            console.log('Recreated chunks for the file ' + fileId, '|' + new Date().getTime());
                        }
                    }
                }
                uploadChunk(fileId, cb);
            };
            fileInfo.startUpload();
            if(scrollWithActivity.is(":checked")){
                setTimeout(function(){
                    scrollToItem(fileId);
                }, 500);
            }
        };

        //Get next chunk for the file being uploaded and send it
        function nextChunk(fileId, time, index, cb, resumeFlag) {
            var fileInfo = fileList[fileId];
            var file = fileInfo.file;
            var chunks = fileInfo.chunks;
            var status = queue.fileStatus(fileId);
            var uploadedBytes = 0;
            var allDone = fileInfo.chunkPos >= file.size;
            var pendingChunks = 0;
            var hasChunkRetrying;
            for (var i = 0; i < chunks.length; i++) {
                if(chunks[i].status !== "done"){
                    allDone = false;
                    pendingChunks++;
                    if(chunks[i].retrying)
                        hasChunkRetrying = true;
                }
                else{
                    uploadedBytes += chunks[i].size;
                }
            };
            if(hasChunkRetrying)
                return;
            if(status == "pausing"){
                if(fileInfo.paused){
                    fileInfo.paused();
                    fileInfo.resume = function(){
                        nextChunk(fileId, time, index, cb, true);
                    }
                }
                return;
            }
            if (allDone || uploadedBytes >= file.size) {
                fileInfo.chunkPos = file.size;
                fileInfo.done = true;
                if (fileInfo.chunkBeingUploaded == 0) {
                    if(status == "uploading" || status == "init")
                    {
                        queue.fileStatus(fileId, "closing", false);
                        var startTime = new Date().getTime();
                        closeFileStream(fileId, chunks.length, function(error, retry) {
                            if(retry){
                                queue.overwrite(fileId, true);
                                queue.fileStatus(fileId, "resend", true, undefined, "");
                                if(cb)
                                    cb();
                            }
                            else{
                                if (!error) {
                                    //$('#startUpload').removeAttr("disabled");
                                    var uploadInfo = fileInfo.uploadInfo || {};
                                    var stats = {
                                        time : "0 sec",
                                        speed : "N/A"
                                    };
                                    var elapsed = uploadInfo.timeElapsedU || 1;
                                    var now = new Date().getTime();
                                    var closeTook = Math.ceil((now - startTime)/1000);
                                    elapsed += closeTook;
                                    uploadInfo.timeElapsedU = elapsed;
                                    uploadInfo.timeElapsed = crush.formatTime((elapsed) + 1 + "");
                                    stats.time = uploadInfo.timeElapsed || loc("aMoment");
                                    var totalTime = elapsed || 1;
                                    var size = file.size;
                                    var speed = (size/totalTime);
                                    stats.speed = crush.formatBytes(speed) + "/s";
                                    queue.fileStatus(fileId, "done", false, stats);
                                    if (cb && !fileInfo.callbackVoid){
                                        cb();
                                    }
                                } else {
                                    error = error || "";
                                    var msg =  "" + error + "";
                                    queue.fileStatus(fileId, "failed", false, undefined, loc("failedClosingFile") + ' ' + msg);
                                    cb(error);
                                }
                            }
                        });
                        delete fileInfo.lastChunk;
                    }
                } else {
                    if (pendingChunks < requestsAllowedPerDomain && Math.abs(ongoingRequests - pendingChunks) < maxRequests && ongoingRequests < maxRequests && !fileInfo.callbackVoid && queue.nextItemAvailable()) {
                        if(crush.enableLogging)
                        {
                            console.log('Continuing with next file keeping this continue to finish', ongoingRequests, pendingChunks, '|' + new Date().getTime());
                        }
                        fileInfo.callbackVoid = true;
                        if (cb)
                            cb();
                    }
                    else{
                        if(crush.enableLogging)
                        {
                            console.log("Queue stopped at start next chunk", ongoingRequests);
                        }
                        delete fileInfo.callbackVoid;
                    }
                }
                return;
            }
            //If last chunk took less than 10 seconds, double the chunk size, make it half otherwise
            if (time <= 10) {
                fileInfo.chunkSize = fileInfo.chunkSize * 2;
            } else {
                fileInfo.chunkSize = fileInfo.chunkSize / 2;
            }

            if(window.crushUpload.maxChunkSize && crush.isNumeric(window.crushUpload.maxChunkSize) && window.crushUpload.maxChunkSize>1)
                maxChunkSize = window.crushUpload.maxChunkSize;

            //Chunk size should never exceed max chunk size and be lesser than init chunk size
            if (fileInfo.chunkSize > maxChunkSize * MB)
                fileInfo.chunkSize = maxChunkSize * MB;
            if (fileInfo.chunkSize < initChunkSize * MB)
                fileInfo.chunkSize = initChunkSize * MB;

            if(crush.enableLogging)
            {
                console.log('Last chunk uploaded in: ' + crush.formatTime(time) + ' Current chunk size:', crush.formatBytes(fileInfo.chunkSize), '|' + new Date().getTime());
            }
            var sizeToUse = fileInfo.chunkSize;
            if(fileInfo.chunkPos + fileInfo.chunkSize >= file.size)
            {
                sizeToUse = file.size - fileInfo.chunkPos;
            }

            if(sizeToUse){
                chunks.push({
                    index: chunks.length,
                    start: fileInfo.chunkPos,
                    size: sizeToUse,
                    status: null
                });
                fileInfo.chunkPos += sizeToUse;
            }
            else{
                if(crush.enableLogging)
                    console.log('Caught 2:', fileInfo.chunkPos, fileInfo.chunkSize, file.size);
            }
            //If its last chunk, when it finishes, close the file stream
            var isLastChunk;
            if (fileInfo.chunkPos >= file.size) //If its last chunk
            {
                fileInfo.chunkPos = file.size;
                if (!fileInfo.done) {
                    isLastChunk =
                    fileInfo.lastChunk = true;
                }
            }

            //Continue only if file has not finished uploading
            if (!fileInfo.done) {
                if (fileInfo.chunkPos < file.size || isLastChunk) {
                    uploadChunk(fileId, cb);
                    if (isLastChunk)
                        fileInfo.lastChunk = true;
                }
                if(!resumeFlag)
                {
                    if (ongoingRequests < maxRequests && isLastChunk && pendingChunks < 2) {
                        fileInfo.callbackVoid = queue.realFileStatus()=="idle";
                        if (cb)
                            cb();
                    }
                    else{
                        if(crush.enableLogging)
                        {
                            console.log("Queue stopped at start next chunk 2", ongoingRequests);
                        }
                        delete fileInfo.callbackVoid;
                    }
                }
                else{
                    for (var i = ongoingRequests; i < maxRequests; i++) {
                        setTimeout(function(){
                            nextChunk(fileId, time, index++, cb, true);
                        }, 100 * i);
                    };
                    ongoingRequests = maxRequests;
                }
            }
        };
        var queueList = $('#queue');
        var delay = (function () {
            var timer = 0;
            return function (callback, ms) {
                clearTimeout(timer);
                timer = setTimeout(callback, ms);
            };
        })();

        function updateFileProgress(fileId){
            var status = queue.fileStatus(fileId);
            if(status != "uploading" && status != "closing" && status != "retrying"){
                if(crush.enableLogging)
                {
                    console.log(status, '|' + new Date().getTime());
                }
                return "done";
            }
            var fileInfo = fileList[fileId];
            var file = fileInfo.file;
            var totalSize = file.size;
            if (!fileInfo.uploadInfo) fileInfo.uploadInfo = {};
            var uploadInfo = fileInfo.uploadInfo;
            if(status == "closing"){
                uploadInfo.closing = true;
                queue.updateFileMetaData(fileId, {
                    uploadInfo : uploadInfo
                });
                return "closing";
            }
            if(status == "paused")
                return;
            var chunks = fileInfo.chunks;
            var inProgress = 0;
            var idle = 0;
            var done = 0;
            var uploaded = fileInfo.startingPoint || 0;
            // if(crush.enableLogging)
            // {
            //     console.log(JSON.stringify(chunks), '|' + new Date().getTime());
            // }
            for (var i = 0; i < chunks.length; i++) {
                if(chunks[i].status == "done"){
                    done++;
                    uploaded += chunks[i].uploaded;
                }
                else if(chunks[i].status == "Progress" || chunks[i].status == "retrying")
                    inProgress++;
                else
                    idle++;
            }
            if(crush.enableLogging)
            {
                console.log(fileId, "Uploaded: " + crush.formatBytes(uploaded) + "/" + crush.formatBytes(totalSize), "("+uploaded+"/"+totalSize+")", (uploaded / totalSize) * 100.0, "Total : " + chunks.length, "Done : " + done, "In Progress : " + inProgress, "Idle : " + idle, '|' + new Date().getTime());

            }
            if(inProgress == 0){
                if(crush.enableLogging)
                    console.info('Reloading chunks', '|' + new Date().getTime());
                fileInfo.startUpload(true);
            }
            if(uploaded>totalSize)
                uploaded = totalSize;
            var now = new Date().getTime();
            if (!uploadInfo.history) uploadInfo.history = new Array();
            //calculate speeds using a rolling 10 interval window.  This provides a smoother speed calculation that doesn't bounce around so much to make the user concerned
            var history = uploadInfo.history;//Progressbar data history
            var currentSpeed = uploadInfo.currentSpeed;//Current upload/download speed
            var speedHistory = uploadInfo.speedHistory || [];
            history.push({
                now: now,
                bytes: uploaded
            });
            if (history.length > 1) {//Calculation and updating progressbar. Calculation of speed, percentages etc.
                var pivot = 0; //If history is for less than 5 seconds, use data of first second
                if (history.length > 5) {
                    pivot = history.length - 5; // Set pivot to be of previous five second
                }
                var elapsed = now - history[0].now; // Time elapsed
                var bytes = uploaded - history[pivot].bytes; // Bytes transferred in timeframe
                var lastElapsed = now - history[pivot].now;// Elapsed time for last transfer timeframe
                var originalBytes = uploaded - history[0].bytes; // total bytes transferred
                var secs = ((((totalSize - uploaded) / (originalBytes / elapsed)) / 1000) + 1) + ""; // total time remaining
                var remaining = crush.formatTime(secs);//formatted time
                var elapsedTime = crush.formatTime((elapsed / 1000) + 1 + "");// elapsed time formatted
                var speed = "";
                var currentActualSpeed = 0;
                if ((originalBytes / elapsed) == 0) {// Still Calculating
                    speed = "N/A";
                    remaining = "N/A";
                    uploadInfo.currentSpeed = speed;
                } else {
                    currentActualSpeed = (bytes / lastElapsed) * 1024.0;
                    speed = crush.formatBytes(currentActualSpeed) + "/s";// Based on data transferred in last timeframe (5 secs)
                    uploadInfo.currentSpeed = speed;
                }
                uploadInfo.percentDone = (uploaded / totalSize) * 100.0;
                uploadInfo.percent = uploadInfo.percentDone.toFixed(2);
                uploadInfo.uploadedU = uploaded;
                uploadInfo.uploaded = crush.formatBytes(uploaded);
                uploadInfo.total = crush.formatBytes(totalSize);
                uploadInfo.timeElapsed = elapsedTime;
                uploadInfo.timeElapsedU = (elapsed / 1000) + 1;
                uploadInfo.timeRemaining = remaining;
                if(elapsed/1000 >= 20)
                {
                    speedHistory.push(currentActualSpeed);
                    uploadInfo.speedHistory = speedHistory;
                    if(speedHistory.length>30)
                    {
                        while (speedHistory.length > 30) speedHistory.shift();
                    }
                    var avgSpeed = speedHistory.average();
                    if(avgSpeed>0)
                    {
                        uploadInfo.avgSpeed = crush.formatBytes(avgSpeed) + "/s";
                    }
                }
                queue.updateFileMetaData(fileId, {
                    uploadInfo : uploadInfo
                });
            }
            globalProgress.rebind();
        }

        function getAltServer(){
            var server = "";
            var lowest = requestsAllowedPerDomain;
            if(altDomains && altDomains.length>0){
                for(var key in altDomainsRequests){
                    if(altDomainsRequests[key] < lowest)
                    {
                        lowest = altDomainsRequests[key];
                        server = key;
                    }
                }
            }
            return server === "local" ? "" : server;
        }

        function uploadChunk(fileId, cb, retries, forceRetry) {
            var status = queue.fileStatus(fileId);
            if(!forceRetry && status == "retrying"){
                if(crush.enableLogging)
                {
                    console.log('next upload was rejected as some file is still retrying upload', '|' + new Date().getTime());
                }
                return;
            }

            var fileInfo = fileList[fileId];
            var file = fileInfo.file;
            var chunks = fileInfo.chunks;
            var xhrs = fileInfo.xhrs || {};
            var status = queue.fileStatus(fileId);
            if(status != "uploading")
            {
                if(crush.enableLogging)
                {
                    console.log("next upload was rejected as queue status is : " + status, '|' + new Date().getTime())
                }
                cb();
                return;
            }
            if(chunks.length ===0 && file.size === 0)
            {
                nextChunk(fileId, 0, 0, cb, false);
                return;
            }
            for (var i = 0; i < chunks.length; i++) {
                var chunk = chunks[i];
                if (!chunk.status || chunk.status == "retrying") {
                    (function(chunk) {
                        fileInfo.chunkBeingUploaded++;
                        var fileData = new FormData(),
                            xhr = new XMLHttpRequest();
                        try{
                            xhr.timeout = chunkTimeout;
                        }catch(ex){}
                        var index = chunk.index;
                        index += 1;
                        var url = "/U/" + file.uploadId + "~" + index;
                        var server = getAltServer();
                        if(server){
                            url = server + "/U/" + file.uploadId + "~" + altDomainToken;
                        }
                        else{
                            if(reverseProxyPath)
                                url = reverseProxyPath + "/U/" + file.uploadId + "~" + index;
                        }
                        if(altDomains && altDomains.length>0){
                            var key = server ? server : "local";
                            altDomainsRequests[key] += 1;
                        }
                        var chunkData = crush.getChunk(file, chunk.start, chunk.size);
                        if (!chunkData) {
                            if(crush.enableLogging)
                            {
                                console.log("Chunk data missing", file, chunk.start, chunk.size, index, '|' + new Date().getTime());
                            }
                        } else {
                            chunk.size = chunkData.size;
                            if(!server)
                                url += "~" + chunk.size;
                            fileData.append('CFCD', chunkData, file.name);
                            function handleUploadChunkError(fileId, evt){
                                if(crush.enableLogging)
                                {
                                    console.log('%c'+ongoingRequests + ' : Chunk upload failed ' + chunk.index + ' |' + new Date().getTime(), 'background:orange;color:white;padding:0px 5px;');
                                }
                                delete xhrs["chunk_"+chunk.index];
                                chunk.uploaded = 0;
                                fileInfo.chunkBeingUploaded--;
                                retries = retries || 0;
                                retries++;
                                if (retries > requestRetries) {
                                    chunk.status = "error";
                                    if(crush.enableLogging)
                                    {
                                        console.log('%c'+ongoingRequests + ' : Chunk upload failed all retries ' + chunk.index + ' |' + new Date().getTime(), 'background:red;color:white;padding:0px 5px;');
                                    }
                                    queue.fileStatus(fileId, "failed", false, undefined, loc("failedWileRetryingChunk"));
                                    cb(evt);
                                } else {
                                    var status = queue.fileStatus(fileId);
                                    if(status != "retrying")
                                    {
                                        function runRetryCounter(errmsg){
                                            if (retries > requestRetries) {
                                                chunk.status = "error";
                                                var _errmsg = errmsg || loc("failedWileRetryingChunk");
                                                queue.fileStatus(fileId, "failed", false, undefined, _errmsg + " ("+chunk.index+"/"+chunks.length+")");
                                                cb(evt);
                                                return;
                                            }
                                            var time = retries * retries;
                                            time = time.round5();
                                            if(retries == 1)
                                                time = 0;
                                            if(time == 0)
                                            {
                                                retrySendingChunk();
                                                return;
                                            }
                                            errmsg = crush.textEncode(errmsg) ? "<div class='failed text-center' style='padding:5px;'>" + crush.textEncode(errmsg) + "</div>" : "";
                                            var retryMsg = '<p class="text-center" style="margin-bottom:0px;">'+ errmsg + '<span loc="retryingFile">'+ loc("retryingFile")+'</span> <strong>'+crush.textEncode(file.fullPath)+'</strong>.... <span class="time-counter"><span loc="in">'+loc("in")+'</span> <span class="seconds">'+time+'</span> <span loc="seconds">'+loc("seconds")+'</span></span><div class="links"><hr/><div class="row"><div class="col-md-6 col-sm-6"><p class="text-right skip-link" style="cursor:pointer;border-right: 1px solid #eee;padding-right: 25px;"><a href="javascript:void(0);"><i class="fa fa-forward"></i>  <span loc="skipFile">'+loc("skipFile")+'</span></a></p></div><div class="col-md-6 col-sm-6"><p class="text-left retry-link" style="cursor:pointer;"><a href="javascript:void(0);"><i class="fa fa-refresh"></i>  <span loc="retryNow">'+loc("retryNow")+'</span></a></p></div></div></div></p>';
                                            var dialog = bootbox.dialog({
                                                message: retryMsg,
                                                closeButton: false
                                            });

                                            var retryTimer = setTimeout(function(){
                                                dialog.modal('hide');
                                                retrySendingChunk();
                                            }, 1000 * time);

                                            var timeCounter = dialog.find("span.time-counter");
                                            var seconds = dialog.find("span.seconds");
                                            var links = dialog.find("div.links");
                                            var retryLink = links.find("p.retry-link");
                                            var skipLink = links.find("p.skip-link");
                                            if(time>0)
                                            {
                                                var curTime = time;
                                                (function calculateTimeRemainig(){
                                                    setTimeout(function(){
                                                        curTime -= 1;
                                                        if(curTime>0)
                                                        {
                                                            seconds.text(curTime);
                                                            calculateTimeRemainig();
                                                        }
                                                    }, 1000);
                                                })();

                                                retryLink.click(function(){
                                                    curTime = -1;
                                                    clearTimeout(retryTimer);
                                                    dialog.modal('hide');
                                                    retrySendingChunk();
                                                });

                                                skipLink.click(function(){
                                                    curTime = -1;
                                                    clearTimeout(retryTimer);
                                                    dialog.modal('hide');
                                                    upload.cancel(fileId, function(ids){
                                                        retryInProgress -= 1;
                                                        if(retryInProgress<0)
                                                            retryInProgress = 0;
                                                        if(retryInProgress>0)
                                                            return false;
                                                        upload.handleCancelFileAction(ids, function(){
                                                            if(queue.realFileStatus() == "idle")
                                                            {
                                                                if(queue.status() == "selected")
                                                                    upload.selected();
                                                                else if(queue.status() == "all")
                                                                    upload.all();
                                                            }
                                                        });
                                                    });
                                                });
                                            }
                                            else{
                                                timeCounter.hide();
                                                links.hide();
                                            }
                                        }

                                        retryInProgress += 1;
                                        queue.fileStatus(fileId, "retrying", false);
                                        function retrySendingChunk(){
                                            $.when(isFileOpen(fileId, chunk)).done(function(){
                                                chunk.status = "retrying";
                                                chunk.retrying = true;
                                                retryInProgress -= 1;
                                                if(retryInProgress<0)
                                                    retryInProgress = 0;
                                                if(queue.fileStatus(fileId) !== "pausing")
                                                {
                                                    queue.fileStatus(fileId, "uploading", false);
                                                    if(crush.enableLogging)
                                                    {
                                                        console.log('%c'+ongoingRequests + ' : Chunk being resent ' + chunk.index + ' |' + new Date().getTime(), 'background:yellow;color:black;padding:0px 5px;');
                                                    }
                                                    uploadChunk(fileId, cb, retries, true);
                                                    if(ongoingRequests < maxRequests)
                                                    {
                                                        nextChunk(fileId, 30, chunk.index, cb);
                                                    }
                                                    else{
                                                        if(crush.enableLogging)
                                                        {
                                                           console.log("Queue stopped at retrying chunk", ongoingRequests);
                                                        }
                                                        delete fileInfo.callbackVoid;
                                                    }
                                                }
                                            }).fail(function(msg, err){
                                                retryInProgress -= 1;
                                                if(retryInProgress<0)
                                                    retryInProgress = 0;
                                                if(msg == "failure")
                                                {
                                                    if(queue.fileStatus(fileId) !== "pausing")
                                                    {
                                                        retries = requestRetries + 1;
                                                        runRetryCounter(err);
                                                    }
                                                }
                                                else
                                                {
                                                    queue.fileOpts(fileId, true);
                                                    //Handle resuming the file here
                                                    if(queue.fileStatus(fileId) == "pausing")
                                                    {
                                                        pauseNext = true;
                                                        upload.cancel(fileId, function(ids){
                                                            upload.handleCancelFileAction(ids, function(){
                                                                queue.fileStatus(fileId, "resend", true);
                                                                if(pauseNext){
                                                                    queue.fileStatus(fileId, "paused", false);
                                                                    globalProgress.paused();
                                                                    globalProgress.showLoading(false);
                                                                    fileInfo.lastStatus = "unknown";
                                                                    fileInfo.resume = function(){
                                                                        startQueue(cb);
                                                                    }
                                                                    pauseNext = false;
                                                                }
                                                                else{
                                                                    if(retryInProgress>0)
                                                                        return false;
                                                                    queue.fileStatus(fileId, "failed", false, undefined, loc("failedWileRetryingChunk") + " ("+chunk.index+"/"+chunks.length+")");
                                                                    if(queue.status() == "selected")
                                                                        upload.selected();
                                                                    else if(queue.status() == "all")
                                                                        upload.all();
                                                                }
                                                            });
                                                        }, true);
                                                    }
                                                    else
                                                    {
                                                        var fileInfo = fileList[fileId];
                                                        for(var xhr in xhrs){
                                                            decreaseRequestCount("Chunk upload aborted-2");
                                                            xhrs[xhr].abort();
                                                            delete xhrs[xhr];
                                                        }
                                                        queue.fileStatus(fileId, "resend", true);
                                                        startQueue(cb);
                                                    }
                                                }
                                            });
                                        }
                                        runRetryCounter();
                                    }
                                    else
                                    {
                                        chunk.status = "";
                                    }
                                }
                            }

                            xhr.addEventListener("load", function(evt) {
                                decreaseRequestCount("Chunk uploaded " + fileId + "/" + chunk.index);
                                if(altDomains && altDomains.length>0){
                                    var key = server ? server : "local";
                                    altDomainsRequests[key] -= 1;
                                }
                                var response = xhr.response || xhr.responseText;
                                var hasError;
                                if(response){
                                    response = response.toString();
                                    if(response.toLowerCase().indexOf("error:")>=0)
                                    {
                                        retries = requestRetries + 1;
                                        hasError = true;
                                    }
                                }
                                if(!hasError)
                                    retries = 0;
                                fileInfo.chunkBeingUploaded--;
                                delete xhrs["chunk_"+chunk.index];
                                if (xhr.readyState == 4 && xhr.status == 200) {
                                    if (fileInfo.chunkBeingUploaded < 0)
                                        fileInfo.chunkBeingUploaded = 0;
                                    var time = crush.timeDiff(chunk.startTime, new Date().getTime());
                                    chunk.status = "done";
                                    var resumeFlag = false;
                                    if(chunk.retrying){
                                        resumeFlag = true;
                                    }
                                    delete chunk.retrying;
                                    chunk.uploaded = chunk.size;
                                    var status = queue.fileStatus(fileId);
                                    if(status != "retrying")
                                    {
                                        nextChunk(fileId, time, chunk.index, cb, resumeFlag);
                                    }
                                } else {
                                    fileInfo.chunkBeingUploaded--;
                                    retries = retries || 0;
                                    retries++;
                                    if (retries > requestRetries) {
                                        chunk.status = "error";
                                        cb(evt);
                                    } else {
                                        handleUploadChunkError(fileId, evt);
                                    }
                                }
                            }, false);

                            xhr.addEventListener("error", function(evt) {
                                decreaseRequestCount("Chunk upload error " + fileId + "/" + chunk.index);
                                if(altDomains && altDomains.length>0){
                                    var key = server ? server : "local";
                                    altDomainsRequests[key] -= 1;
                                }
                                retries = retries || 0;
                                // retries++;
                                if (retries > requestRetries) {
                                    chunk.status = "error";
                                    cb(evt);
                                } else {
                                    handleUploadChunkError(fileId, evt);
                                }
                            }, false);

                            xhr.addEventListener("timeout", function(evt) {
                                decreaseRequestCount("Chunk upload Timeout " + fileId + "/" + chunk.index);
                                if(altDomains && altDomains.length>0){
                                    var key = server ? server : "local";
                                    altDomainsRequests[key] -= 1;
                                }
                                retries = 0;
                                handleUploadChunkError(fileId, evt)
                            }, false);

                            xhr.addEventListener("abort", function(evt) {
                                decreaseRequestCount("Chunk single abort");
                                if(altDomains && altDomains.length>0){
                                    var key = server ? server : "local";
                                    altDomainsRequests[key] -= 1;
                                }
                                delete xhrs["chunk_"+chunk.index];
                                fileInfo.chunkBeingUploaded--;
                            }, false);

                            xhr.addEventListener("progress", function(evt) {
                                if (evt.lengthComputable) {
                                    chunk.uploaded = evt.loaded;
                                    if(crush.enableLogging)
                                    {
                                        console.log(chunk.index, "Chunk upload progress", evt.loaded);
                                        var curTime = moment(new Date());
                                        var diff = curTime.diff(moment(chunk.lastProgressTime || chunk.startTime), 'seconds');
                                        chunk.lastProgressTime = curTime;
                                        if(diff)
                                            console.log(chunk.index, "Time taken since last progress update in seconds: ", diff);
                                    }
                                }
                                else{
                                    if(crush.enableLogging)
                                    {
                                        console.log(chunk.index, "Chunk awaiting upload", evt.loaded);
                                    }
                                }
                            }, false);

                            if(xhr.upload){
                                xhr.upload.addEventListener("progress", function(evt) {
                                    if (evt.lengthComputable) {
                                        chunk.uploaded = evt.loaded;
                                        if(crush.enableLogging)
                                        {
                                            console.log(chunk.index, "Chunk upload progress", evt.loaded);
                                            var curTime = moment(new Date());
                                            var diff = curTime.diff(moment(chunk.lastProgressTime || chunk.startTime), 'seconds');
                                            chunk.lastProgressTime = curTime;
                                            if(diff)
                                                console.log(chunk.index, "Time taken since last progress update in seconds: ", diff);
                                            }
                                    }
                                    else{
                                        if(crush.enableLogging)
                                        {
                                            console.log(chunk.index, "Chunk awaiting upload", evt.loaded);
                                        }
                                    }
                                }, false);
                            }

                            xhr.open("POST", url, true);
                            if(server){
                                xhr.setRequestHeader("X-TRANSFERSEGMENT", index + "~" + chunk.size);
                            }
                            increaseRequestCount("Chunk Sent " + fileId + "/" + chunk.index);
                            xhr.send(fileData);
                            chunk.status = 'Progress';
                            chunk.startTime = new Date().getTime();
                            xhrs["chunk_"+chunk.index] = xhr;
                            fileInfo.xhrs = xhrs;
                        }
                    })(chunk);
                }
            }
        };

        function handleCancelFileAction(cancelledIds, cb){
            var toCheck = 0, totalCanceled = 0;
            if(cancelledIds.length>0){
                queueLoader.addClass('show');
                for (var i = 0; i < cancelledIds.length; i++) {
                    var id = cancelledIds[0];
                    toCheck++;
                    (function verify(fileId){
                        totalCanceled++;
                        if(totalCanceled == toCheck && cb){
                            $.when(crush.data.ajax({
                                command: "unblockUploads",
                                random: Math.random(),
                                c2f:crush.getAuth()
                            })).done(function(msg) {
                                embed.invokeElectronEvent("upload-canceled", {});
                                queueLoader.removeClass('show');
                                if(cb)
                                    cb();
                                cb = false;
                            });
                        }
                    })(id);
                };
            }
        };

        function isFileOpen(fileId, chunk){
            var q = $.Deferred();
            var chunkInfo = chunk ? $.extend({},chunk, true) : {};
            if(chunkInfo.startTime)
            {
                chunkInfo.startedOn = moment(chunkInfo.startTime).format("MM/DD/YYYY hh:mm a");
            }
            $.when(crush.data.ajax({
                command: "isOpen",
                upload_id: fileId,
                random: Math.random(),
                chunkInfo : JSON.stringify(chunkInfo),
                c2f:crush.getAuth()
            })).done(function(msg) {
                var responseMsg = $(msg).find("response").text();
                if(responseMsg.toLowerCase() == "open")
                    q.resolve(msg);
                else if(responseMsg.toLowerCase().indexOf("error:")>=0)
                    q.reject("failure", responseMsg);
                else
                    q.reject(responseMsg);
            }).fail(function(err) {
                q.reject("failure", err);
            });
            return q;
        }

        function closeFileStream(fileId, totalChunks, callback, retries_d, cancel) {
            var curFileInfo = queue.getFileById(fileId);
            var fileData = new FormData();
            var fileInfo = fileList[fileId];
            var file = fileInfo.file;
            if(file.type === "dir"){
                callback();
                return;
            }
            fileData.append('command', 'closeFile');
            fileData.append('upload_id', fileId);
            fileData.append('total_chunks', totalChunks);
            fileData.append('total_bytes', file.size);
            fileData.append('filePath', curFileInfo.fullPath);
            fileData.append('lastModified', file.lastModified);
            fileData.append('c2f', crush.getAuth());
            if(cancel)
                fileData.append('cancel', "true");
            increaseRequestCount("Close file stream" + fileId);

            function retryClosefile(error, isDecompressing)
            {
                var fileInfo = fileList[fileId];
                error = error || "Error";
                fileInfo.closeRetries = fileInfo.closeRetries || 0;
                fileInfo.maxCloseRetries = fileInfo.maxCloseRetries || requestRetries;
                var retries = fileInfo.closeRetries;
                retries++;
                maxretry = fileInfo.maxCloseRetries;
                if (retries > maxretry) {
                    delete fileInfo.closeRetries;
                    delete fileInfo.maxCloseRetries;
                    callback(error);
                    return;
                } else {
                    function runRetryCounter(){
                        if (retries > maxretry) {
                            delete fileInfo.closeRetries;
                            delete fileInfo.maxCloseRetries;
                            callback(error);
                            return;
                        }
                        var time = retries * retries;
                        time = time.round5();
                        if(isDecompressing)
                            time = 0;
                        if(retries == 1)
                            time = 0;
                        if(isDecompressing){
                            retryInProgress -= 1;
                            if(retryInProgress<0)
                                retryInProgress = 0;
                            closeFileStream(fileId, totalChunks, callback, retries);
                        }
                        else{
                            var retryMsg = '<p class="text-center" style="margin-bottom:0px;"><span loc="retryingClosingFile">'+loc("retryingClosingFile")+'</span> <strong>'+crush.textEncode(file.fullPath)+'</strong>.... <span class="time-counter"><span loc="in">'+loc("in")+'</span> <span class="seconds">'+time+'</span> <span loc="seconds">'+loc("seconds")+'</span></span><div class="links"><hr/><div class="row"><div class="col-md-6 col-sm-6"><p class="text-right skip-link" style="cursor:pointer;border-right: 1px solid #eee;padding-right: 25px;"><a href="javascript:void(0);"><i class="fa fa-forward"></i>  <span loc="skipFile">'+loc("skipFile")+'</span></a></p></div><div class="col-md-6 col-sm-6"><p class="text-left retry-link" style="cursor:pointer;"><a href="javascript:void(0);"><i class="fa fa-refresh"></i>  <span loc="retryNow">'+loc("retryNow")+'</span></a></p></div></div></div></p>';
                            var dialog = bootbox.dialog({
                                message: retryMsg,
                                closeButton: false
                            });
                            var retryTimer = setTimeout(function(){
                                dialog.modal('hide');
                                retryInProgress -= 1;
                                if(retryInProgress<0)
                                    retryInProgress = 0;
                                closeFileStream(fileId, totalChunks, callback, retries);
                            }, 1000 * time);
                            var timeCounter = dialog.find("span.time-counter");
                            var seconds = dialog.find("span.seconds");
                            var links = dialog.find("div.links");
                            var retryLink = links.find("p.retry-link");
                            var skipLink = links.find("p.skip-link");
                            if(time>0)
                            {
                                var curTime = time;
                                (function calculateTimeRemainig(){
                                    setTimeout(function(){
                                        curTime -= 1;
                                        if(curTime>0)
                                        {
                                            seconds.text(curTime);
                                            calculateTimeRemainig();
                                        }
                                    }, 1000);
                                })();

                                retryLink.click(function(){
                                    curTime = -1;
                                    clearTimeout(retryTimer);
                                    dialog.modal('hide');
                                    retryInProgress -= 1;
                                    if(retryInProgress<0)
                                        retryInProgress = 0;
                                    closeFileStream(fileId, totalChunks, callback, retries);
                                    return false;
                                });

                                skipLink.click(function(){
                                    curTime = -1;
                                    clearTimeout(retryTimer);
                                    dialog.modal('hide');
                                    retryInProgress -= 1;
                                    if(retryInProgress<0)
                                        retryInProgress = 0;
                                    var fileInfo = fileList[fileId];
                                    delete fileInfo.closeRetries;
                                    delete fileInfo.maxCloseRetries;
                                    callback(error);
                                    return false;
                                });
                            }
                            else{
                                timeCounter.hide();
                                links.hide();
                            }
                        }
                    }
                    retryInProgress += 1;
                    queue.fileStatus(fileId, "retrying", false);
                    runRetryCounter();
                }
            }
            queue.updateFileMetaData(fileId, {
                closeStarted: new Date().getTime()
            });
            $.when(crush.data.ajax(fileData, {
                mimeType: "multipart/form-data",
                contentType: false,
                cache: false,
                processData: false,
                timeout : 610000
            })).done(function(xhr) {
                decreaseRequestCount("Close file done " + fileId);
                ongoingRequests = 0;
                var response = $.trim($(xhr).find("response").text());
                var fileInfo = fileList[fileId];
                if(response)
                {
                    fileInfo.closeRetries = fileInfo.closeRetries || 0;
                    fileInfo.maxCloseRetries = fileInfo.maxCloseRetries || requestRetries;
                    if (fileInfo.closeRetries>=fileInfo.maxCloseRetries || response.toLowerCase().indexOf("error")>=0) {
                        if(response.toLowerCase().indexOf("500")==0){
                            delete fileInfo.closeRetries;
                            delete fileInfo.maxCloseRetries;
                            callback(response);
                        }
                        else{
                            delete fileInfo.closeRetries;
                            delete fileInfo.maxCloseRetries;
                            callback(response, fileInfo.closeRetries<fileInfo.maxCloseRetries);
                        }
                        return;
                    }
                    else if(response.toLowerCase().indexOf("500")==0)
                    {
                        delete fileInfo.closeRetries;
                        delete fileInfo.maxCloseRetries;
                        callback(response);
                        return;
                    }
                    else{
                        var isDecompressing = false;
                        if(response.toLowerCase() === "decompressing...")
                        {
                            isDecompressing = true;
                            fileInfo.closeRetries = 0;
                        }
                        setTimeout(function(){
                            fileInfo.closeRetries++;
                            fileInfo.maxCloseRetries = 3
                            retryClosefile(response, isDecompressing);
                        }, 500);
                    }
                }
                else
                {
                    delete fileInfo.closeRetries;
                    delete fileInfo.maxCloseRetries;
                    if (callback)
                        callback();
                }
            }).fail(function(err) {
                decreaseRequestCount("Close file fail " + fileId);
                retryClosefile();
            });
        };

        function makedir(path, file){
            var q = $.Deferred();
            var folder = path.split("/");
            var customFolder = embed.invoke("hasCustomUploadLocation") || "";
            if((folder.length>2 && !file.hasDir) || customFolder){
                if(customFolder){
                    folder = customFolder;
                }
                else{
                    folder.pop();
                    folder = folder.join("/") + "/";
                    folder = crush.encodeURILocal(folder);
                }

                if(dirsCreated.has(folder))
                {
                    q.resolve("created");
                }
                else
                {
                    $.when(crush.data.ajax({
                        command: "makedir",
                        path: folder,
                        random: Math.random(),
                        c2f:crush.getAuth()
                    })).done(function(msg) {
                        dirsCreated.push(folder);
                        q.resolve(msg);
                    }).fail(function(err) {
                        q.reject(err);
                    });
                }
            }
            else
                q.resolve(true);
            return q;
        }

        function appendFormData(fileId, fileData){
            var file = queue.getFileById(fileId);
            var fileFormData = file.formData || "";
            var commonFormData = queue.commonFormData();
            if(commonFormData)
            {
                fileFormData += '&' + commonFormData;
            }
            if(fileFormData)
            {
                var items = fileFormData.split("&");
                var usedKeys = [];
                for(var i=0;i<items.length;i++)
                {
                    var curItem = items[i];
                    if(curItem && typeof curItem == "string")
                    {
                        var meta = curItem.split("=");
                        var key = false;
                        var val = false;
                        if(meta && meta.length>0)
                            key = meta[0];
                        if(meta && meta.length>1)
                            val = meta[1];
                        val = val || "";
                        if(key && !usedKeys.has(key))
                        {
                            usedKeys.push(key);
                            fileData.append(key,val);
                        }
                    }
                }
            }
            if(file.size + "" == "0")
            {
                fileData.append("zero_size","true");
            }
            var metaInfo = embed.invoke("getMetaInfo") || {};
            Object.keys(metaInfo).forEach(function(key) {
                fileData.append(key, metaInfo[key]);
            });
            return fileData;
        }

        function fileExistsCheck(fileId, callback){
            var fileInfo = fileList[fileId];
            var file = fileInfo.file;
            var fileOpts = queue.fileOpts(fileId);
            var fileResume = fileOpts.resume;
            var fileAsk = fileOpts.ask;
            if((!fileResume && !fileAsk)){
                callback();
                return;
            }
            var path = file.fullPath;
            try{
                path = crush.decodeURILocal(path);
                path = crush.encodeURILocal(unescape(unescape(path)));
            }
            catch(ex)
            {
                path = crush.encodeURILocal(path);
            }
            var temp_upload_ext = embed.invoke("tempFileExtensionWhileUploading");
            temp_upload_ext = temp_upload_ext || "";
            $.when(crush.data.ajax({
                command: "stat",
                path: path + "" + temp_upload_ext,
                random: Math.random(),
                c2f:crush.getAuth()
            })).done(function(msg) {
                var response = $(msg).find("response").text();
                if(response)
                {
                    var stats = response.split(" ")
                    stats = stats.cleanArray("");
                    var fileSize = stats[4];
                    var fileName = stats[8] || "";
                    if(crush.isNumeric(fileSize))
                        fileSize = parseInt(fileSize);
                    else
                        fileSize = undefined;
                    if(typeof fileSize != "undefined")
                    {
                        var curSize = file.size;
                        if(fileAsk)
                        {
                            if(resumeAll){
                                if(fileSize < curSize)
                                    callback(fileSize);
                                else
                                    callback();
                            }
                            else if(skipAll)
                            {
                                callback(0, true);
                            }
                            else if(overwriteAll){
                                callback();
                            }
                            else{
                                askForOverwriteResume(fileName, function(res){
                                    var result = res.split("|");
                                    var all = result[1] && result[1] == "all";
                                    if(result[0] == "resume"){
                                        if(all){
                                            resumeAll = true;
                                        }
                                        callback(fileSize);
                                    }
                                    else if(result[0] == "overwrite"){
                                        if(all){
                                            overwriteAll = true;
                                        }
                                        callback();
                                    }
                                    else if(result[0] == "skip"){
                                        if(all){
                                            skipAll = true;
                                        }
                                        callback(0, true);
                                    }
                                });
                            }
                        }
                        else
                        {
                            if(fileSize == curSize && !fileResume){
                                if(resumeAll){
                                    callback();
                                }
                                else if(skipAll)
                                {
                                    callback(0, true);
                                }
                                else if(overwriteAll){
                                    callback();
                                }
                                else
                                {
                                    bootbox.confirm(loc("fileExistConfirmation", [crush.textEncode(file.name)]), function(result) {
                                      if(result){
                                        callback();
                                      }
                                      else{
                                        callback(0, true);
                                      }
                                    });
                                }
                            }
                            else if(fileSize>curSize){
                                if(resumeAll){
                                    callback();
                                }
                                else if(skipAll)
                                {
                                    callback(0, true);
                                }
                                else if(overwriteAll){
                                    callback();
                                }
                                else
                                {
                                    bootbox.confirm(loc("bigFileOverwriteConfirmation", [crush.textEncode(file.name)]), function(result) {
                                      if(result){
                                        callback();
                                      }
                                      else{
                                        callback(0, true);
                                      }
                                    });
                                }
                            }
                            else
                            {
                                callback(fileSize);
                            }
                        }
                    }
                    else{
                        callback();
                    }
                }
                else{
                    callback();
                }
            }).fail(function(err) {
                callback();
                if(crush.enableLogging)
                {
                    console.log(err, '|' + new Date().getTime());
                }
            });
        }

        function askForOverwriteResume(name, callback){
            var dialog = bootbox.dialog({
                title: loc("fileExistsOnServerConfirmation", [name]),
                onEscape : false,
                closeButton : false,
                message: '<p><strong><span loc="fileActionTitle">'+loc("fileActionTitle")+'</span></strong></p><div class="row" style="padding: 18px 20px 0px 10px;border-top: 1px solid #eee;"><div class="pull-left"><label style="font-weight:normal;cursor:pointer;"><input type="checkbox" id="applyToall" /> <span loc="applyToAll">'+loc("applyToAll")+'</span></label></div><div class="pull-right"><button type="button" class="btn btn-default" rel="skip"><i class="fa fa-forward"></i> <span loc="skip">'+loc("skip")+'</span></button> <button type="button" class="btn btn-default" rel="overwrite"><i class="fa fa-copy"></i> <span loc="overwrite">'+loc("overwrite")+'</span></button> <button type="button" class="btn btn-default" rel="resume"><i class="fa fa-paste"></i> <span loc="resume">'+loc("resume")+'</span></button></div></div><div class="clear-fix"></div>'
            });
            dialog.init(function(){
                dialog.find(".modal-content").addClass('red-dialog').find('button').click(function(event) {
                    var applyToall = $(this).closest(".modal-content").find("#applyToall").is(":checked") ? "|all" : "";
                    callback($(this).attr("rel") + applyToall);
                    dialog.modal("hide");
                });;
            });
            embed.showUploadPanel();
        }

        function openFileStream(fileId, callback, retries) {
            var curFileInfo = queue.getFileById(fileId);
            var curStatus = queue.fileStatus(fileId);
            queue.fileStatus(fileId, "processing");
            function continueOpen(resumeLoc, cancel){
                resumeLoc = resumeLoc || 0;
                var fileInfo = fileList[fileId];
                var file = fileInfo.file;
                if(file.type === "dir"){
                    $.when(crush.data.ajax({
                        command: "makedir",
                        path: crush.encodeURILocal(file.fullPath),
                        random: Math.random(),
                        c2f:crush.getAuth()
                    })).done(function(msg) {
                        decreaseRequestCount("Open file done " + fileId);
                        if (callback) {
                            callback(resumeLoc);
                        }
                    }).fail(function(err) {
                        decreaseRequestCount("Make dir fail " + fileId);
                        retry();
                    });
                    return;
                }
                if(cancel)
                {
                    callback(0, false, true);
                    return;
                }
                var fileData = new FormData();
                fileData = appendFormData(fileId, fileData);
                fileData.append('command', 'openFile');
                fileData.append('upload_path', "" + curFileInfo.fullPath);
                fileData.append('upload_size', file.size);
                fileData.append('upload_id', file.id);
                fileData.append('start_resume_loc', resumeLoc);
                fileData.append('c2f', crush.getAuth());
                increaseRequestCount("Open file stream " + fileId);
                $.when(makedir(file.fullPath, file)).done(function(){
                    $.when(crush.data.ajax(fileData, {
                        mimeType: "multipart/form-data",
                        contentType: false,
                        cache: false,
                        processData: false
                    })).done(function(msg) {
                        queue.fileStatus(fileId, curStatus);
                        decreaseRequestCount("Open file done " + fileId);
                        // var fileCode = $(msg).find("response").text();
                        var xmlDocument = new DOMParser().parseFromString(msg, 'text/xml');
                        var fileCode = xmlDocument.getElementsByTagName('response')[0].textContent;
                        if (fileCode) {
                            if(fileCode.toLowerCase().indexOf("error")>=0)
                            {
                                if (callback) {
                                    callback(false, false, true, fileCode);
                                }
                                return;
                            }
                            file.uploadId = fileCode;
                            if (callback) {
                                callback(resumeLoc);
                            }
                        } else {
                            if (callback) {
                                callback(0, true);
                            }
                        }
                    }).fail(function() {
                        decreaseRequestCount("Open file fail " + fileId);
                        retry();
                    });
                }).fail(function(){
                    decreaseRequestCount("Make dir fail " + fileId);
                    retry();
                });

                function retry(){
                    retries = retries || 0;
                    retries++;
                    if (retries > requestRetries) {
                        callback(0, true);
                    } else {
                        function runRetryCounter(){
                            if (retries > requestRetries) {
                                callback(err);
                                return;
                            }
                            var time = retries * retries;
                            time = time.round5();
                            if(retries <= 1)
                                time = 0;
                            var retryMsg = '<p class="text-center" style="margin-bottom:0px;"><span loc="retryingOpeningFile">'+loc("retryingOpeningFile")+'</span> <strong>'+crush.textEncode(file.fullPath)+'</strong>.... <span class="time-counter"><span loc="in">'+loc("in")+'</span> <span class="seconds">'+time+'</span> <span loc="seconds">'+loc("seconds")+'</span></span><div class="links"><hr/><div class="row"><div class="col-md-6 col-sm-6"><p class="text-right skip-link" style="cursor:pointer;border-right: 1px solid #eee;padding-right: 25px;"><a href="javascript:void(0);"><i class="fa fa-forward"></i> <span loc="skipFile">'+loc("skipFile")+'</span></a></p></div><div class="col-md-6 col-sm-6"><p class="text-left retry-link" style="cursor:pointer;"><a href="javascript:void(0);"><i class="fa fa-refresh"></i>  <span loc="retryNow">'+loc("retryNow")+'</span></a></p></div></div></div></p>';
                            var dialog = bootbox.dialog({
                                message: retryMsg,
                                closeButton: false
                            });

                            var retryTimer = setTimeout(function(){
                                dialog.modal('hide');
                                retryInProgress -= 1;
                                if(retryInProgress<0)
                                    retryInProgress = 0;
                                openFileStream(fileId, callback, retries);
                            }, 1000 * time);

                            var timeCounter = dialog.find("span.time-counter");
                            var seconds = dialog.find("span.seconds");
                            var links = dialog.find("div.links");
                            var retryLink = links.find("p.retry-link");
                            var skipLink = links.find("p.skip-link");
                            if(time>0)
                            {
                                var curTime = time;
                                (function calculateTimeRemainig(){
                                    setTimeout(function(){
                                        curTime -= 1;
                                        if(curTime>0)
                                        {
                                            seconds.text(curTime);
                                            calculateTimeRemainig();
                                        }
                                    }, 1000);
                                })();

                                retryLink.click(function(){
                                    curTime = -1;
                                    clearTimeout(retryTimer);
                                    dialog.modal('hide');
                                    retryInProgress -= 1;
                                    if(retryInProgress<0)
                                        retryInProgress = 0;
                                    openFileStream(fileId, callback, retries);
                                    return false;
                                });

                                skipLink.click(function(){
                                    curTime = -1;
                                    clearTimeout(retryTimer);
                                    dialog.modal('hide');
                                    retryInProgress -= 1;
                                    if(retryInProgress<0)
                                        retryInProgress = 0;
                                    callback(0, true);
                                    return false;
                                });
                            }
                            else{
                                timeCounter.hide();
                                links.hide();
                            }
                        }
                        retryInProgress += 1;
                        queue.fileStatus(fileId, "retrying", false);
                        runRetryCounter();
                    }
                }
            }
            if(altDomains && altDomains.length>0)
            {
                if(altDomainsReady){
                    if(fileExistsCheck(fileId, function(resumeLoc, cancel){
                        continueOpen(resumeLoc, cancel);
                    }));
                }
                else{
                    onAltDomainsReady = function(){
                        if(fileExistsCheck(fileId, function(resumeLoc, cancel){
                            continueOpen(resumeLoc, cancel);
                        }));
                    }
                }
            }
            else{
                if(fileExistsCheck(fileId, function(resumeLoc, cancel){
                    continueOpen(resumeLoc, cancel);
                }));
            }

            // if(!retries)
            // {
            //     if(fileExistsCheck(fileId, function(resumeLoc, cancel){
            //         continueOpen(resumeLoc, cancel);
            //     }));
            // }
            // else{
            //     continueOpen();
            // }
        };

        function showDetails(){
            embed.invoke("showUploadFormAdvanced", [true]);
        };

        return {
            file: file,
            selected: selected,
            all: all,
            completed : completed,
            handleCancelFileAction : handleCancelFileAction,
            isFileOpen : isFileOpen,
            checkProgress : updateFileProgress,
            resume : resume,
            cancel : cancel,
            pause : pause,
            showDetails : showDetails
        }
    }());

    function addFiles(e){
        if(!embed.invoke("hasWritePermission")){
            return false;
        }
        if(e.dataTransfer && (e.dataTransfer.items || e.dataTransfer.files)){
            dnd.addFiles(e);
        }
        else{
            if (e && e.files) {
                var _files = e.files,
                    fileList = [];
                var filesProcessed = 0;
                for(var i = 0; i < _files.length; i++) {
                    var file = _files[i];
                    // (function isFile(f){
                    //     var reader = new FileReader();
                    //     reader.onload = function (result) {
                    //         fileList.push(
                    //             queue.addFile(f, embed.invoke("currentPath"))
                    //         );
                    //         filesProcessed++;
                    //         if(filesProcessed >= _files.length){
                    //             embed.showUploadForm(fileList);
                    //         }
                    //     };
                    //     reader.onerror = function(error){
                    //         queue.addFile(f, embed.invoke("currentPath"), false, {
                    //             message : loc("folderUploadNotSupported")
                    //         });
                    //         filesProcessed++;
                    //         if(filesProcessed >= _files.length){
                    //             embed.showUploadForm(fileList);
                    //         }
                    //     };
                    //     reader.readAsArrayBuffer(f);
                    // })(file);
                    fileList.push(
                        queue.addFile(file, embed.invoke("currentPath"))
                    );
                    filesProcessed++;
                    if(filesProcessed >= _files.length){
                        embed.showUploadForm(fileList);
                    }
                }
            }
        };
        embed.showUploadPanel();
    };

    var availableFileExtensionImages = ["ai", "avi", "bak", "bat", "bin", "bmp", "cab", "cmd", "css", "csv", "cue", "dat", "dic", "divx", "dll", "dmg", "doc", "docx", "dvd", "dwg", "exe", "file", "fla", "gif", "htm", "html", "ifo", "ini", "iso", "jpeg", "jpg", "js", "m4a", "mmf", "mov", "mp3", "mp4","m4v", "h264", "mpeg", "mpg", "otf", "pdf", "php", "png", "pps", "ppt", "pptx", "psd", "rar", "rtf", "swf", "sys", "tiff", "ttf", "txt", "vob", "wma", "wmv", "xls", "xlsx", "xml", "xmp", "zip", "sitx", "idml", "indd", "sit"];
    var imagePath = "/WebInterface/jQuery/images/fileExtensions/";
    //Get file extension from file name
    function getFileExtension(filename) {
        var ext = /^.+\.([^.]+)$/.exec(filename);
        return ext == null ? "" : ext[1].toLowerCase();
    }
    function showSharedItems(){
        var dialog = bootbox.dialog({
            title: "Share History",
            onEscape : true,
            closeButton : true,
            message: '<div id="shareHistoryPanel" style="width:100%;height:525px;overflow-x:hidden;"></div>'
        });
        dialog.init(function(){
            var sharedItemsHistory = embed.invoke("shareHistory");
            dialog.addClass("no-padding");
            var clearBtn = $("<span class='shared-remove-all-icon'><button class='btn remove'><i class='fa fa-trash'></i> <span loc='remove'>Clear local share history</span></button></span>");
            dialog.find(".modal-header").append(clearBtn);
            var tmp = $('#tplShareHistory').html();
            var source = sharedItemsHistory.reverse();
            if(source.length == 0){
                clearBtn.find("button").attr("disabled", "disabled");
            }
            var shareHistoryPanel = $("#shareHistoryPanel");
            shareHistoryPanel.before($('<input type="text" class="quick-filter-input" id="shareHistoryQuickFilter" placeholder="Search..." />'));
            var delay = (function () {
                var timer = 0;
                return function (callback, ms) {
                    clearTimeout(timer);
                    timer = setTimeout(callback, ms);
                };
            })();

            var historyDataTable = shareHistoryPanel.empty().dataTable({
                dataSource: source,
                height: 525,
                lineHeight: 165,
                template: tmp,
                minLinesToShow: 50,
                emptyTemplate : "<div class='text-center'>No items to display</div>",
                renderMethod : function(str, params, index){
                    var str = tmp.replace(new RegExp('{{random}}', 'g'), crush.random(6));
                    str = str.replace(new RegExp('{{index}}', 'g'), index);
                    // var ext = getFileExtension(params.sharedItems);
                    var totalItems = params.sharedItems.split("\n");
                    var count = totalItems.length;
                    var _items = [];
                    for(var i=0;i<count;i++){
                        _items.push(totalItems[i].split("/").pop());
                    }
                    params.sharedItems = _items.join("\n");
                    str = str.replace(new RegExp('{{itemCount}}', 'g'), count);
                    var timestamp = params.timestamp;
                    var momentText = "";
                    if(timestamp){
                        momentText = moment(timestamp).fromNow();
                    }
                    str = str.replace(new RegExp('{{moment}}', 'g'), momentText);
                    /*if(availableFileExtensionImages.indexOf(ext)>=0){
                        str = str.replace(new RegExp('{{icon}}', 'g'), imagePath + ext + "_48.png");
                    }
                    else{
                        str = str.replace(new RegExp('{{icon}}', 'g'), imagePath + "file_48.png");
                    }*/
                    str = $(Mustache.render(str, params));
                    return str;
                },
                onClick: function(evt) {
                    if(evt.target)
                    {
                        var target = $(evt.target);
                        if(target.parent().is(".btn"))
                            target = target.parent();
                        if(target.is(".copy")){
                            embed.invokeElectronEvent("copy-url", target.closest(".share-history-row").find(".shared-link:first").text());
                            embed.invoke("urlCopied");
                        }
                        else if(target.is(".remove")){
                            sharedItemsHistory = embed.invoke("shareHistoryRemove", [{id: target.closest(".share-history-row").attr("_id")}]);
                            var _dataTable = shareHistoryPanel.data("dataTable");
                            _dataTable.rebind({
                                dataSource: sharedItemsHistory.reverse()
                            }, true);
                        }
                    }
                    evt.stopPropagation();
                    evt.preventDefault();
                    return false;
                }
            });

            var _dataTable = shareHistoryPanel.data("dataTable");

            $("#shareHistoryQuickFilter").unbind("keyup").keyup(function (evt) {
                var elm = $(this);
                var evt = (evt) ? evt : ((event) ? event : null);
                var phrase = elm.val().toLowerCase();
                function startFilter()
                {
                    phrase = elm.val().toLowerCase();
                    var lastPhrase = elm.data("last_search");
                    if (lastPhrase && lastPhrase === phrase) {
                        return false;
                    }
                    if(phrase){
                        var newSource = [];
                        for (var i = 0; i < source.length; i++) {
                            var curItem = source[i];
                            if(curItem.message.toLowerCase().indexOf(phrase)>=0
                                || curItem.sharedItems.toLowerCase().indexOf(phrase)>=0
                                || curItem.url.toLowerCase().indexOf(phrase)>=0){
                                newSource.push(curItem);
                            }
                        }
                        _dataTable.rebind({
                            dataSource: newSource,
                            emptyTemplate : "<div class='text-center'>No matching items to display</div>"
                        }, true);
                    }else{
                        _dataTable.rebind({
                            dataSource: source,
                            emptyTemplate : "<div class='text-center'>No items to display</div>"
                        }, true);
                    }
                    elm.data("last_search", phrase);
                }
                if (evt.keyCode == 13) {
                    startFilter();
                } else if (evt.keyCode == 27) {
                    if(phrase){
                        elm.val("");
                        startFilter();
                        evt.preventDefault();
                        evt.stopPropagation();
                    }
                } else {
                    delay(function () {
                        startFilter();
                    }, 500);
                }
            });

            setTimeout(function(){
                $("#shareHistoryQuickFilter").focus();
            }, 500);

            clearBtn.click(function(){
                if($(this).find("button").is(":disabled"))return false;
                if(confirm("Are you sure you wish to clear all items from local share history? (Shared items and accounts will not be removed)")){
                    sharedItemsHistory = embed.invoke("shareHistoryRemoveAll");
                    var _dataTable = shareHistoryPanel.data("dataTable");
                    _dataTable.rebind({
                        dataSource: sharedItemsHistory.reverse()
                    }, true);
                    clearBtn.find("button").attr("disabled", "disabled");
                }
            })
        });
    }

    function formDataMissing(){
        var files = queue.files();
        var missing = [];
        for (var i = 0; i < files.length; i++) {
            var curFile = files[i];
            if(!curFile.formData){
                missing.push({
                    id : curFile.id,
                    name : curFile.fullPathEscaped
                });
            }
        }
        return missing;
    };

    function removeFormDataMissing(){
        queue.removeFiles({
            noFormData : true
        });
    };

    function commonUploadFormStatus(flag){
        if(flag){
            $('#uploadDetails').show();
        }
        else{
            $('#uploadDetails').hide();
        }
    };

    function saveCommonFormData(data){
        if(continueWithFileForm){
            embed.showUploadForm(continueWithFileForm);
            continueWithFileForm = false;
            queue.commonFormData(data);
        }
    };

    function savePerFileFormData(data, item){
        queue.fileFormData(data, item);
    };

    function addedFilesProcessed(){
        var autoStartUpload = embed.invoke("autoStartUpload");
        if(autoStartUpload){
            if(!$('#startUpload').is(":disabled"))
                $('#startUpload').trigger('click');
        }
    };

    return {
        init: boot,
        addFiles : addFiles,
        refreshLoc : reloadLoc,
        formDataMissing : formDataMissing,
        removeFormDataMissing : removeFormDataMissing,
        commonUploadFormStatus : commonUploadFormStatus,
        saveCommonFormData : saveCommonFormData,
        savePerFileFormData : savePerFileFormData,
        addedFilesProcessed : addedFilesProcessed,
        rebind : globalProgress.rebind,
        resizeList : embed.resizeList,
        resizeiFrame : embed.resize,
        browseFiles : embed.browseFiles,
        maxChunkSize : maxChunkSize,
        getItemsToShare : queue.getItemsToShare,
        refreshList : queue.renderList,
        removeUploaded : queue.removeUploaded,
        applyCustomizations : applyCustomizations,
        invokeElectronEvent: embed.invokeElectronEvent,
        updateFileMetaData: queue.updateFileMetaData,
        listWidth : function(val){
            if(val)
                listWidth = val;
            return listWidth;
        }
    }
}());

crushUpload.init();

if (!Array.prototype.filter){
  Array.prototype.filter = function(func, thisArg) {
    'use strict';
    if ( ! ((typeof func === 'Function' || typeof func === 'function') && this) )
        throw new TypeError();

    var len = this.length >>> 0,
        res = new Array(len), // preallocate array
        t = this, c = 0, i = -1;
    if (thisArg === undefined){
      while (++i !== len){
        // checks to see if the key was set
        if (i in this){
          if (func(t[i], i, t)){
            res[c++] = t[i];
          }
        }
      }
    }
    else{
      while (++i !== len){
        // checks to see if the key was set
        if (i in this){
          if (func.call(thisArg, t[i], i, t)){
            res[c++] = t[i];
          }
        }
      }
    }

    res.length = c; // shrink down array to proper size
    return res;
  };
}