//'use strict';
var crushDownload = (function() {
    //Initial variables
    var initChunkSize = 0.5,
        reverseProxyPath,
        maxChunkSize = 10,
        chunkTimeout = 120000, //in milliseconds
        MB = 1048576,
        minFileSizeToCheckForResume = MB * 1,
        requestsAllowedPerDomain = 4,
        maxRequests = 4,
        ongoingRequests = 0,
        requestRetries = 10,
        retryInProgress = 0,
        ignoreStatus = ["init", "error", "downloading", "done", "failed", "processing", "canceled", "pausing", "paused", "skipped"],
        cancellableStatus = ["", "init", "downloading", "resend", "retrying", "processing", "pausing", "paused", "closing"],
        server = "",
        baseurl = "/WebInterface/function/";

    function increaseRequestCount(msg){
        ongoingRequests++;
    }

    function decreaseRequestCount(msg){
        ongoingRequests--;
        ongoingRequests = ongoingRequests < 0 ? 0 : ongoingRequests;
    }

    function status(response) {
      if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
      } else {
        return Promise.reject(new Error(response.statusText))
      }
    }

    function getFileName(path) {
        return decodeURIComponent(path).replace(/^.*[\\\/]/, '');
    }

    //Format bytes to make it more readable
    function formatBytes(bytes, multiply) {
        if((!bytes || bytes<0) && !multiply) return "*";
        if(multiply)
            bytes = bytes*multiply;
        bytes = parseFloat(bytes);
        if ((bytes / 1024).toFixed(0) == 0) return bytes.toFixed(1) + " Bytes";
        else if ((bytes / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024).toFixed(1) + " KB";
        else if ((bytes / 1024 / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024 / 1024).toFixed(1) + " MB";
        else if ((bytes / 1024 / 1024 / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024 / 1024 / 1024).toFixed(1) + " GB";
        else if ((bytes / 1024 / 1024 / 1024 / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024 / 1024 / 1024 / 1024).toFixed(1) + " TB";
    }

    //Initialize events
    function boot() {
        bootbox.addLocale("custom", {
            OK : 'Yes',
            CANCEL : 'No',
            CONFIRM : "Yes"
        });
        bootbox.setLocale("custom");
        var statsDiv = $('#stats').hide();
        var statsBytes = $('#bytes');
        var statsChunks = $('#chunks');
        var statsStarted = $('#started');
        var statsElapsed = $('#elapsed');
        var statsSpeed = $('#speed');
        var defaultStats = {
            active:0,
            completed:0,
            failed:0,
            onhold:0,
            currentChunk:0,
            lastAddedChunk: 0,
            stitching: false,
            chunkCounts: 2000,
            bytesCompleted:0,
            started: null
        };
        embed.init();
        console.log('CrushDownload initialized.');
    }

    var download = (function() {
        function file(path){
            return Promise(function(resolve, reject){
                console.log(path);
                resolve(path)
            });
        }

        return {
            file: file
        }
    }());

    var myfetch = function(url, options){
        return new Promise((resolve, reject)=>{
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';

            xhr.onload = function(e) {
                if(!this.response || this.status !== 200){
                    reject("error");
                }
                else{
                    resolve(this.response);
                }
            };

            xhr.onerror = function(){
                reject("error");
            }
            xhr.send();
        });
    }

    var queue = (function(){
        var _defaultStats = {
            onholdChunks: {},
            activeCount:0,
            currentChunk:0,
            completedCount:0,
            failedCount:0,
            onholdCount:0,
            lastAddedChunk: 0,
            isStitching: false,
            chunkCounts: 5000000,
            bytesCompleted:0,
            started: null
        };

        var info = {
            queuedItems: [],
            completedItems: [],
            failedItems: [],
            currentItem: null
        };

        function addToDownloads(path){
            if(info.queuedItems.indexOf(path)<0){
                info.queuedItems.push(path);
                checkDownloads();
            }
        };

        function checkDownloads(){
            if(!info.currentItem && info.queuedItems.length>0){
                download(info.queuedItems.shift());
            }
            else{
                console.log(info);
            }
        }

        function download(path){
            console.log("Received: " + path + " to download");
            if(info.currentItem)
                return;
            info.currentItem = {
                path: path
            };
            getDownloadToken(path).then(function(meta){
                info.currentItem.downloadId = meta.key;
                info.currentItem.stats = $.extend({}, _defaultStats);
                info.currentItem.fileName = getFileName(path);
                setTimeout(()=>{
                    for(var i=0;i<4;i++){
                        info.currentItem.stats.currentChunk++
                        fetchFile(info.currentItem.stats.currentChunk);
                    }
                }, 200);
                // setInterval(()=>console.log(info), 1000);
            }).fail(function(){
                info.currentItem.failed = true;
                info.failedItems.push(info.currentItem);
                delete info.currentItem;
                checkDownloads();
            });
        }

        function fetchFile(chunk){
            var currentItem = info.currentItem;
            if(!currentItem){
                console.log('No current item');
                return;
            }
            if(currentItem.completed){
                console.log('Completed');
                checkDownloads();
                return;
            }
            var stats = currentItem.stats || {};
            if(chunk > stats.chunkCounts){
                console.log('Chunks over loaded', chunk, stats.chunkCounts);
                return;
            }
            if(chunk > stats.currentChunk)
                stats.currentChunk = chunk;
            stats.activeCount++;
            if(!stats.started){
                stats.started = moment();
            }

            console.log('Fetch asked for', chunk);
            myfetch(server + '/D/'+currentItem.downloadId+'~'+chunk, {
                method: "GET",
                credentials: "same-origin"
            })
            .catch(err => {
                stats.activeCount--;
                stats.failedCount++;
                console.log('retrying chunk:', chunk);
                setTimeout(() => fetchFile(chunk), 0);
            })
            .then(data => {
                if(data){
                    console.log('Stream:', data.byteLength, chunk);
                    stats.activeCount--;
                    stats.onholdCount++;
                    console.log('on hold:', chunk);
                    var onholdChunks = stats.onholdChunks;
                    if(onholdChunks)
                        onholdChunks[chunk] = data;
                    function checkQueue(){
                        stitchFile().then(hasData=>{
                            if(hasData){
                                checkQueue();
                            }
                        });
                    }
                    if(!stats.stitching){
                        checkQueue();
                    }
                    fetchFile(stats.currentChunk+1);
                }
                else{
                    console.log('no data', chunk);
                }
            },
            err => {
                // stats.activeCount--;
                // stats.failedCount++;
                // console.log('retrying chunk:', chunk);
                // setTimeout(() => fetchFile(chunk), 0);
            });
        }

        function stitchFile(){
            var currentItem = info.currentItem || {};
            var stats = currentItem.stats || {};
            console.log(stats);
            return new Promise((resolve, reject)=>{
                if(!currentItem){
                    resolve({});
                    return;
                }
                if(!currentItem.stats){
                    resolve(false);
                    return;
                }
                var onholdChunks = stats.onholdChunks;
                var {fileStream, writer} = currentItem;
                var lastAddedChunk = stats.lastAddedChunk;
                // console.log(lastAddedChunk);
                var chunkToCheck = lastAddedChunk + 1;
                if(onholdChunks[chunkToCheck]){
                    stats.stitching = true;
                    var nextChunk = onholdChunks[chunkToCheck];
                    if(!fileStream){
                        var fileName = currentItem.fileName;;
                        currentItem.fileStream = fileStream = streamSaver.createWriteStream(fileName);
                        currentItem.writer = writer = fileStream.getWriter();
                    }
                    function handleFileCompleted(){
                        writer.close();
                        stats.stitching = false;
                        currentItem.completed = true;
                        currentItem.ended = moment();
                        info.completedItems.push(currentItem);
                        delete currentItem.fileStream;
                        delete currentItem.writer;
                        delete info.currentItem;
                        closeFileStream(currentItem.downloadId, stats.chunkCounts, stats.bytesCompleted, false).then(function(){
                            checkDownloads();
                            resolve(false);
                        });
                    }
                    // nextChunk.arrayBuffer().then(buffer => {
                        var buffer = nextChunk;
                        if(buffer.byteLength && buffer.byteLength>0)
                        {
                            writer.write(new Uint8Array(buffer));
                            stats.bytesCompleted += buffer.byteLength;
                            var elapsedSecs = moment().diff(stats.started, "s");
                            var perSecondBytes = stats.bytesCompleted/elapsedSecs;
                            console.log('wrote chunk: ', chunkToCheck, " Bytes:", buffer.byteLength, 'Total:', stats.bytesCompleted);
                            stats.onholdCount--;
                            stats.completedCount++;
                            delete onholdChunks[chunkToCheck];
                            stats.lastAddedChunk = chunkToCheck;
                            if(chunkToCheck >= stats.chunkCounts){
                                console.log('%c All expected chunks received (NonZero)', 'background:red;color:white;', chunkToCheck, stats.chunkCounts, Object.assign(stats));
                                handleFileCompleted();
                            }
                            else
                                resolve(true);
                        }
                        else{
                            debugger
                            console.log('Received 0 bytes');
                            stats.onholdCount--;
                            stats.completedCount++;
                            delete onholdChunks[chunkToCheck];
                            stats.lastAddedChunk = chunkToCheck;
                            console.log('Finished download reported', 'total bytes done', stats.bytesCompleted);
                            stats.chunkCounts = stats.lastAddedChunk;
                            console.log(stats.chunkCounts, chunkToCheck);
                            if(stats.completedCount >= stats.chunkCounts){
                                console.log('%c All expected chunks received', 'background:red;color:white;', chunkToCheck, stats.chunkCounts, Object.assign(stats));
                                handleFileCompleted();
                            }
                            else
                                resolve(true);
                        }
                    // });
                }
                else{
                    stats.stitching = false;
                    resolve(false);
                }
            });
        }

        function getNextChunk(){

        };

        function closeFileStream(fileId, totalChunks, totalBytes, cancel) {
            var params = {
                command: 'closeFile',
                transfer_type: "download",
                download_id: fileId,
                total_chunks: totalChunks,
                total_bytes: totalBytes,
                c2f: crush.getAuth()
            };
            if(cancel)
                params.cancel = "true";
            console.log(params);

            var q = $.Deferred();
            var c2f = crush.getAuth();
            $.post(baseurl, params).then(function(data){
                console.log(data);
                q.resolve({
                    data : data
                });
            }).fail(function(){
                q.reject();
            });
            return q;
        };

        function getDownloadToken(path){
            var q = $.Deferred();
            var c2f = crush.getAuth();
            $.post(baseurl, {
                command: "download",
                path: path,
                transfer_type: "download",
                start_resume_loc: 0,
                c2f: crush.getAuth()
            }).then(function(data){
                console.log(data);
                var key = $(data).find("response").text();
                q.resolve({
                    key: key,
                    downloadId: key
                });
            }).fail(function(){
                q.reject();
            });
            return q;
        }

        return {
            info: info,
            download: addToDownloads
        }
    }());

    var embed = (function(){
        var mainContentHolder= $('.mainContentHolder');
        var isEmbed = crush.queryString("embed") == "true";

        function init(){
            reverseProxyPath = embed.invoke("getReverseProxyPath");
            if(reverseProxyPath && !reverseProxyPath.startsWith("/")){
                reverseProxyPath = "/" + reverseProxyPath;
            }
            embed.invoke("hideDownloadPanel", [true]);
            embed.invoke("resizeDownloadiFramePanel");
        };

        function invoke(method, params){
            if(isEmbed && parent.window[method]){
                return parent.window[method].apply(this, params);
            }
        };

        function showDownloadPanel(){
            invoke("showDownloadPanel");
        }

        return {
            init : init,
            invoke : invoke,
            showDownloadPanel : showDownloadPanel
        }
    }());

    return {
        init: boot,
        queue: queue
    }
}());

crushDownload.init();