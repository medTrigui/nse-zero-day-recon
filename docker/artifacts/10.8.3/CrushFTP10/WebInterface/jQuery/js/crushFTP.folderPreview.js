//To show icons stack over folder and file with multiple previews in WebInterface
function showFolderPreview(files, item) {
    if(window.quitPreviewCalls)
        return;
    if(files && item)
    {
        var preview =0;
        var parentElem = $("<div class='framePreviewBox'></div>");
        for(var i=0; i<files.length;i++)
        {
            var curFile = files[i];
            if(curFile.type == "FILE" && curFile.preview.toString() != "0")
            {
                preview+=1;
                parentElem.append("<div><img src='/WebInterface/function/?command=getPreview&size=1&path=" + crushFTPTools.encodeURILocal(unescape(curFile.href_path)) + "&frame=1&c2f="+crushFTPTools.getCrushAuth() + " /></div>");
                if(preview==4)
                    i=files.length
            }
        }
        item.find("div.framePreviewBox").remove();
        if(preview>0)
        {
            item.prepend(parentElem);
            parentElem.find("img").each(function(){
                var $curElem = $(this);
                $curElem.unbind().bind("load", function (e) {
                    var parentElem = $(this).parent();
                    var $this = $(this);
                    $(this).removeAttr("width").removeAttr("height").css({
                        width: "",
                        height: ""
                    });
                    var pic_real_width = this.width;
                    var pic_real_height = this.height;
                    var imgRatio = pic_real_width / pic_real_height;
                    var divRatio = parentElem.width() / parentElem.height();
                    // Calculate image's real width and height and fix it to fit to the image holder DIV
                    if (pic_real_width < parentElem.width() && pic_real_height < parentElem.height()) {
                        $this.css("height", "auto");
                        $this.css("width", "auto");
                    }
                    else if (imgRatio > divRatio) {
                        $this.css("width", "auto");
                        $this.css("height", parentElem.height());
                    } else {
                        $this.css("height", "auto");
                        $this.css("width", parentElem.width());
                    }
                    if(item.is("td"))
                    {
                        var _title = "<img src=\""+$(this).attr("src")+"\" border=\"0\" />"
                        $(this).addClass("vtip").attr("title", _title);
                        $(this).cluetip({
                            splitTitle: '^',
                            showTitle: false,
                            width: 'auto',
                            cluetipClass: 'default',
                            clickThrough : false,
                            arrows: false,
                            tracking: false,
                            positionBy: 'mouse',
                            mouseOutClose: true,
                            dropShadowSteps: 2,
                            leftOffset: 2,
                            topOffset: 2,
                            dynamicLeftOffset: false
                        });
                    }
                }).error(function(){
                    $(this).parent().remove();
                });
            });

        }
    }
}

function fetchFolderPreview()
{
    window.folderPreviewItems = window.folderPreviewItems || {};
    var previewItemsFiles = [];
    var previewItemsDirs = [];
    var items;
    if ($("body").data("currentView") == "Thumbnail") {
         items = $("#filesContainerDiv").find("li.directoryThumb:visible");
    } else {
        items = $("#filesContainer").find("td.directory:visible");
    }
    if(items && items.length>0)
    {
        for(var i=0;i<items.length;i++)
        {
            previewItemsDirs.push(items[i]);
        }
    }
    function fetchDirPreviews()
    {
        if(window.quitPreviewCalls)
        {
            previewItemsDirs = [];
        }
        if(previewItemsDirs.length>0)
        {
            var curDir = $(previewItemsDirs[0]);
            var path = curDir.find("a:first").attr("rel");
            var obj = {
                command: "getXMLListing",
                format: "JSONOBJ",
                path: path,
                random: Math.random()
            };
            obj.c2f = crushFTPTools.getCrushAuth();
            $.ajax({
                type: "POST",
                url: "/WebInterface/function/",
                data: obj,
                async: true,
                dataType: "json",
                beforeSend: function(x) {
                    if(x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                success: function (data) {
                    var msg = data.listing;
                    showFolderPreview(msg, curDir);
                    previewItemsDirs.remove(0);
                    fetchDirPreviews();
                }
            });
        }
    }
    fetchDirPreviews();
}

function roatateImagePreview(img){
    function changeImage(img){
        if (!jQuery.contains(document, img[0]))
        {
            return false;
        }
        var frames = img.data("frames");
        var curFrame = img.data("curFrame") || 0;
        if(curFrame==frames)
            curFrame = 0;
        else
            curFrame++;
        img.data("curFrame", curFrame);
        var _fileName = img.attr("src");
        _fileName= _fileName.replace(_fileName.substring(_fileName.lastIndexOf("&frame=",_fileName.length-7)), "&frame=" + curFrame);
        img.attr("src", _fileName + "&c2f="+crushFTPTools.getCrushAuth());
        setTimeout(function(){
            changeImage(img);
        }, 1000);
    }
    changeImage(img);
}