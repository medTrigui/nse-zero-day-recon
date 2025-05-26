/*!
* CrushFTP DND upload module
*
* http://crushFTP.com/
*
* Copyright 2012, CrushFTP
*
* Date: Tue, Apr 17 2012
*
* Author: Vipul Limbachiya
*
* http://vipullimbachiya.com

* Requires :
-  jquery-1.7.2.min.js
-  jquery-ui-1.8.9.custom.min.js
-  jquery.tmpl.min.js
-  jquery.fileupload.js
-  jquery.fileupload-ui.js
-  jquery.iframe-transport.js

HTML to use for Upload File Listing Template :

	<script id="template-upload" type="text/x-jquery-tmpl">
		<li class="ui-widget-content template-upload{{if error}} ui-state-error{{/if}}" fullPath="${FullPath}">
			<div class="cancel"><button>Cancel</button></div>
			<div class="preview"><span class="noPreviewNote">No Preview</span></div>
			<div class="name">${name}</div>
			<div class="path">Upload to : ${path} </div>
			<div class="size">${sizef}</div>
			{{if error}}
				<div class="error" colspan="2">Error:
					{{if error === 'maxFileSize'}}File is too big
					{{else error === 'minFileSize'}}File is too small
					{{else error === 'acceptFileTypes'}}Filetype not allowed
					{{else error === 'maxNumberOfFiles'}}Max number of files exceeded
					{{else error === 'fileAvailableInSelectedFolder'}}File exist : Upload to :  ${path}, File Name : ${name}
					{{else}}${error}
					{{/if}}
				</div>
			{{else}}
			{{/if}}
			<div class="clear"></div>
		</li>
	</script>

*/
(function ($) {
    if (!$.CrushFTP) {
        $.CrushFTP = new Object();
    };
    $.CrushFTP.DNDUpload = function (el, options) {
        var base = this;
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        // Add a reverse reference to the DOM object
        base.$el.data("CrushFTP.DNDUpload", base);
        base.init = function () {
            base.options = $.extend({}, $.CrushFTP.DNDUpload.defaultOptions, options);
			var o = base.options;
			o.dropZone = $(o.dropZone);
            if(base.$el.data("fileUploadAdded"))
                base.$el.unbind().fileupload("destroy");
            if(!$.CrushFTP.browserSupportsDND() || $.CrushFTP.iOS)
            {
                base.$el.find("input[type='file']").removeAttr("multiple");
            }
            var opts = {
                dropZone: o.dropZone,
                callbackMethod : o.callbackMethod,
                forceIframeTransport : !$.CrushFTP.browserSupportsDND()
            };
            if(typeof window.uploadFileInChunksInModernBrowsers != "undefined")
            {
                var MB1 = 1048576;
                opts.crushFTPChunkedUpload = true;
                opts.maxSimultaneousXHRRequests = window.chunkUploadMaxXHRRequestsCount || 4;
                opts.crushChunkSize = MB1 * window.chunkUploadSize || 1;
            }
            base.$el.data("fileUploadAdded", true);
            base.$el.fileupload(opts).bind("fileuploadsubmit", function (e, data) {
                var template = $(data.context);
                if(!template) return;
                var count = 0;
                var size = 0;
                if(data.files && data.files.length>0)
                {
                    count = data.files[0].curCount;
                    if(typeof count == "undefined") count = 0;

                    size = data.files[0].size;
                    if(typeof size == "undefined" || size == null) size = 0;
                }
                // if(size==0)
                // {
                //     base.$el.fileupload("option", "forceIframeTransport", true);
                // }
                // else
                {
                    base.$el.fileupload("option","forceIframeTransport", !$.CrushFTP.browserSupportsDND());
                }
                data.paramName = "file_"+generateRandomPassword(4)+"_SINGLE_FILE_POST";
                template.attr("uid", data.paramName);
                data.formData = template.data("formData") || "";
                if(data.formData && data.formData.length>0 && $.CrushFTP.commonUploadFormDataSerialized)
                {
                    data.formData += '&' + $.CrushFTP.commonUploadFormDataSerialized;
                }
                else if($.CrushFTP.commonUploadFormDataSerialized){
                    data.formData += $.CrushFTP.commonUploadFormDataSerialized;
                }
                var formData = [];
                if(data.formData)
                {
                    var items = data.formData.split("&");
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
                                formData.push({
                                    name : key,
                                    value : val
                                });
                            }
                        }
                    }
                }
                var metaInfo = window.metaInfo || {};
                Object.keys(metaInfo).forEach(function(key) {
                    formData.push({
                        name : key,
                        value : metaInfo[key]
                    });
                });
                if(data.files[0].size == "0")
                {
                    formData.push({
                        name : "zero_size",
                        value : "true"
                    });
                }
                formData.push({
                    name : "uploadPath",
                    value : template.find("input[name='uploadPath']").val()
                });
                formData.push({
                    name : "the_action",
                    value : template.find("input[name='the_action']").val()
                });
                formData.push({
                    name : "c2f",
                    value : crushFTPTools.getCrushAuth()
                });
                if($.CrushFTP.iOS)
                {
                    var fileName = template.find("input[name='alt_name']").val();
                    if(fileName)
                    {
                        formData.push({
                            name : "alt_name",
                            value : fileName
                        });
                    }
                }
                data.formData = formData;
            }).bind("fileuploaddrop", function (e, data) {
                if($.CrushFTP.browseAdvanced && navigator.userAgent.indexOf('Mac') < 0){
                    $.growlUI("Drop file in drop zone", "Please drag and drop files in drop zone (green area above upload bar)", $.CrushFTP.Options.GrowlTimeout + 1500);
                    $.CrushFTP.removeInvalidFiles();
                    return;
                }
                if (o.fileuploaddropEvent) {
                    o.fileuploaddropEvent(e, data);
                }
            }).bind("fileuploadadded", function(e, data){
				if(o.fileuploadadded){
					o.fileuploadadded(e, data);
				}
			}).bind("fileuploadchange", function(e, data){
				if(o.fileuploadchange){
					o.fileuploadchange(e, data);
				}
			}).bind("fileuploaddestroyed", function(e, data){
				if(o.fileuploaddestroyed){
					o.fileuploaddestroyed(e, data);
				}
			});
            base.$el.find('.files a:not([target^=_blank])').live('click', function (e) {
                e.preventDefault();
                $('<iframe style="display:none;" id="dndUploadIframe"></iframe>').prop('src', this.href).appendTo('body');
            });
			if(!o.disableDragOver)
			{
				$(document).bind('dragover', function (e) {
					 e.stopPropagation();
					 e.preventDefault();
					var timeout = window.dropZoneTimeout;
					if (!timeout) {
						$(e.target).addClass('hover');
					} else {
						clearTimeout(timeout);
					}
					if (o.dropZone.has($(e.target))) {
						$(".hover").removeClass("hover");
						if($(e.target).hasClass("dropzone"))
						{
							$(e.target).addClass('hover');
						}
						else{
							$(e.target).closest(".dropzone").addClass('hover');
						}
					} else {
						$(".hover").removeClass("hover");
					}
					window.dropZoneTimeout = setTimeout(function () {
						window.dropZoneTimeout = null;
						$(".hover").removeClass("hover");
						if(o.documentDropEvent)
						{
							o.documentDropEvent(e);
						}
					}, 100);
					if(o.documentDragEvent)
					{
						o.documentDragEvent(e);
					}
				});
			}
			else
			{
				$(document).unbind('dragover');
			}
            $(document).bind('drop', function (e) {
                e.preventDefault();
            });
        };

        base.init();
        return base;
    };
    $.CrushFTP.DNDUpload.defaultOptions = {
        dropZone: ".dropzone", // Panels where droping files from desktop is allowed, jQuery selector	`
        fileuploaddropEvent: function (e, data) { // Event to call when files dropped from desktop
        },
        fileuploaddoneEvent: function (e, data) { //When upload of selected file completes
        },
		documentDragEvent : function(e) { //When drag enteres document
		},
		documentDropEvent : function(e) { //When drag ends
		},
		fileuploadadded : function(e, data) { //When files added
		},
		fileuploadchange : function(e, data) { //When selection changes
		},
		fileuploaddeleted : function(e, data) { //When removing files from download panel
		}
    };
    $.fn.crushftp_DNDUpload = function (options) {
        return this.each(function () {
            (new $.CrushFTP.DNDUpload(this, options));
        });
    };
})(jQuery);

// Check if specified array has item
if (!Array.prototype.has) {
    Array.prototype.has = function (value) {
        var i;
        for (var i = 0, loopCnt = this.length; i < loopCnt; i++) {
            if (this[i] === value) {
                return true;
            }
        }
        return false;
    };
}
