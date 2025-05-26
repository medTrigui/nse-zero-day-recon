/*!
* CrushFTP DND integration in WebInterface
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
*/
$(function () {
    'use strict';
	if (!$.CrushFTP) {
        $.CrushFTP = new Object();
    };
	/* added by carlos*/
	$('#advanceduploadOptions, #javaLogButton').css('visibility', 'hidden');
	$('#javaLogButton').unbind().click(function(){
		if($("#javalogDialog").is(':visible')) {
			if(javalogTimer) {
				clearInterval(javalogTimer);
			}
			javalogTimer = setInterval(function(){
				var result = runAppletCommand(true, "COMMAND=LOG");
				$('#javalog_area').val($('#javalog_area').val()+result);
				$("#javalog_area").animate({
					scrollTop:$("#javalog_area")[0].scrollHeight - $("#javalog_area").height()
				},10);
			}, 5000);
			$("#javalogDialog").hide();
		} else {
			if(javalogTimer) {
				clearInterval(javalogTimer);
			}
			javalogTimer = setInterval(function(){
				var result = runAppletCommand(true, "COMMAND=LOG");
				$('#javalog_area').val($('#javalog_area').val()+result);
				$("#javalog_area").animate({
					scrollTop:$("#javalog_area")[0].scrollHeight - $("#javalog_area").height()
				},10);
			}, 1000);
			$("#javalogDialog").show();
		}
		return false;
	});
	var javalogTimer;
	$("#uploadOptionsDialog").dialog({
		title: getLocalizationKeyExternal("advancedUploadOptionsDialogTitle"),
		dialogClass: "no-close",
		autoOpen: false,
		closeOnEscape: false,
		modal: false,
		draggable: false,
		resizable: false,
		open : function(){
			$("#uploadOptionsDialog").dialog('option', 'title', getLocalizationKeyExternal("advancedUploadOptionsDialogTitle"));
			var uploadOptionsDialog_ow, uploadOptionsDialog_co;
			try{
			    if(typeof localStorage.uploadOptionsDialog_ow != "undefined"){
			    	uploadOptionsDialog_ow = localStorage.uploadOptionsDialog_ow;
			    }
			    if(typeof localStorage.uploadOptionsDialog_co != "undefined"){
			    	uploadOptionsDialog_co = localStorage.uploadOptionsDialog_co;
			    }
			}catch(ex){
				uploadOptionsDialog_ow = $.cookie("uploadOptionsDialog_ow");
				uploadOptionsDialog_co = $.cookie("uploadOptionsDialog_co");
			}
			if(typeof uploadOptionsDialog_ow != "undefined"){
		    	$("#uploadOptionsDialog_ow").val(uploadOptionsDialog_ow);
			}
		    if(typeof uploadOptionsDialog_co != "undefined"){
		    	$("#uploadOptionsDialog_co").val(uploadOptionsDialog_co);
		    }
		},
		position: { my: "left top", at: "left bottom", of: $('#advanceduploadOptions') },
		buttons: [{
		        text: getLocalizationKeyExternal("advancedUploadOptionsDialogSaveButtonText"),
		        click: function () {
		            $(this).dialog("close");
		            try{
			            if(typeof(Storage) !== "undefined") {
						    localStorage.uploadOptionsDialog_ow = $("#uploadOptionsDialog_ow").val();
						    localStorage.uploadOptionsDialog_co = $("#uploadOptionsDialog_co").val();
						}
		            }catch(ex){
		            	var options = {
	                        path: '/',
	                        expires: 60
	                    };
	                    $.cookie("uploadOptionsDialog_ow", $("#uploadOptionsDialog_ow").val(), options);
	                    $.cookie("uploadOptionsDialog_co", $("#uploadOptionsDialog_co").val(), options);
		            }
		        },
	    	},
	    	{
		        text: getLocalizationKeyExternal("advancedUploadOptionsDialogCancelButtonText"),
		        click: function () {
		        	//reset selects if cancel was selected
		            $( this ).dialog( "close" );
		        },
	    	}
	    ],
		create:function () {
	        $(this).closest(".ui-dialog").find(".ui-dialog-buttonset")
	            .find(".ui-button:first")
	            .addClass("advancedUploadOptionsDialogSaveButtonText").attr("id", "advancedUploadOptionsDialogSaveButtonText");

	        $(this).closest(".ui-dialog").find(".ui-dialog-buttonset")
	            .find(".ui-button:last")
	            .addClass("advancedUploadOptionsDialogCancelButtonText").attr("id", "advancedUploadOptionsDialogCancelButtonText");
	    }
	});
	var uploadOptionsDialog_ow,uploadOptionsDialog_co;
	try{
	    if(typeof localStorage.uploadOptionsDialog_ow != "undefined")
	    	uploadOptionsDialog_ow = localStorage.uploadOptionsDialog_ow;
	    if(typeof localStorage.uploadOptionsDialog_co != "undefined")
	    	uploadOptionsDialog_co = localStorage.uploadOptionsDialog_co;
	}catch(ex){
		uploadOptionsDialog_ow = $.cookie("uploadOptionsDialog_ow");
		uploadOptionsDialog_co = $.cookie("uploadOptionsDialog_co");

	}
	if(typeof uploadOptionsDialog_ow != "undefined")
    	$("#uploadOptionsDialog_ow").val(uploadOptionsDialog_ow);
    if(typeof uploadOptionsDialog_co != "undefined")
    	$("#uploadOptionsDialog_co").val(uploadOptionsDialog_co);
	$("#askDialog").dialog({
		title: getLocalizationKeyExternal("advancedUploadOptionsAskActionDialogTitle"),
		dialogClass: "no-close",
		autoOpen: false,
		closeOnEscape: false,
		open : function(){
			$("#askDialog").dialog('option', 'title', getLocalizationKeyExternal("advancedUploadOptionsAskActionDialogTitle"));
		},
		modal: false,
		minWidth: 450,
		draggable: false,
		resizable: false,
		position: { my: "center top", at: "center bottom", of: $('#fileRepo') },
		buttons: [{
			text: getLocalizationKeyExternal("advancedUploadOptionsAskActionDialogBtnText"),
			click: function() {
				runAppletCommand(true, "COMMAND=ASK_RESPONSE:::UID="+$('#ask_response_uid').val()+":::RESPONSE="+$('#ask_response').val());
				$('#ask_response_uid').val('');
				var item = $('.uploadProgress');
				$.CrushFTP.DNDUploadCallback("uploading", false, item.find("a.startUpload"), item);
				$( this ).dialog( "close" );
			}
		}]
	});
	$("#askDialogDownload").dialog({
		title: getLocalizationKeyExternal("advancedUploadOptionsAskActionDialogTitle"),
		open : function(){
			$("#askDialogDownload").dialog('option', 'title', getLocalizationKeyExternal("advancedUploadOptionsAskActionDialogTitle"));
		},
		dialogClass: "no-close",
		autoOpen: false,
		closeOnEscape: false,
		modal: false,
		minWidth: 450,
		draggable: false,
		resizable: false,
		position: { my: "center center", at: "center center", of: $('#filesBasket') },
		buttons: [{
			text: getLocalizationKeyExternal("advancedUploadOptionsAskActionDialogBtnText"),
			click: function() {
				runAppletCommand(true, "COMMAND=ASK_RESPONSE:::TYPE=DOWNLOAD:::UID="+$('#ask_responseDownload_uid').val()+":::RESPONSE="+$('#ask_responseDownload').val()+":::UNIQUE_KEY="+$('#ask_responseDownload_uniqueId').val());
				$('#ask_responseDownload_uid').val('');
				$('#ask_responseDownload_uniqueId').val('');
				$( this ).dialog( "close" );
			}
		}]
	});
	$('#advanceduploadOptions').unbind().click(function(){
		$("#uploadOptionsDialog").dialog( "option", "position", { my: "left top", at: "left bottom", of: $('#advanceduploadOptions') } ).dialog('open');
		return false;
	});
	var is_MacOs = navigator.userAgent.indexOf('Mac') > -1;
	$.CrushFTP.iOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false;
	$.CrushFTP.maxFileSizeAllowedInNormalUploadInMB = 500;
	$.CrushFTP.browserSupportsDND = function()
	{
		var flag = false;
		var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
		var is_explorer = navigator.userAgent.indexOf('MSIE') > -1 || navigator.appVersion.indexOf('Trident/') > 0;
		var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
		var is_safari = navigator.userAgent.indexOf("Safari") > -1;
		var is_Opera = navigator.userAgent.indexOf("Presto") > -1;

		if ((is_chrome)&&(is_safari)) {is_safari=false;}

		if(is_chrome)
		{
			flag = true;
		}
		else if(is_safari && is_MacOs)
		{
			flag = true;
		}
		else if(is_firefox)
		{
			var ua = navigator.userAgent;
			var version = /Firefox\/([0-9\.A-z]+)/.exec(ua)[1];
			if(version && parseInt(version))
			{
				if(parseInt(version)>3.5)
					flag = true;
			}
		}
		else if(is_explorer)
		{
			flag = parseInt(jQuery.browser.version) >= 10;
		}
		/*else if(is_Opera)
		{
			var version = $.browser.version;
			if(version && parseInt(version))
			{
				if(parseInt(version)>=11)
					flag = true;
			}
		}*/
		return flag;
	}

	$.CrushFTP.formatBytes = function(bytes) {
		/* added by carlos */
		bytes = parseFloat(bytes);
		if(bytes<0) return "*";
		else if ((bytes / 1024).toFixed(0) == 0) return bytes.toFixed(1) + " " + localizations.dataByClassFormatBytes;
		else if ((bytes / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024).toFixed(1) + " " + localizations.dataByClassFormatKiloBytes;
		else if ((bytes / 1024 / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024 / 1024).toFixed(1) + " " + localizations.dataByClassFormatMegaBytes;
		else if ((bytes / 1024 / 1024 / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024 / 1024 / 1024).toFixed(1) + " " + localizations.dataByClassFormatGigaBytes;
		else if ((bytes / 1024 / 1024 / 1024 / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024 / 1024 / 1024 / 1024).toFixed(1) + " " + localizations.dataByClassFormatTeraBytes;
	}

	var IsNumeric = function(input) {
		return !((input - 0) == input && input.length > 0);
	}

	$.CrushFTP.secondsToTime = function(secs)
	{
	    var hours = Math.floor(secs / (60 * 60));
	    var divisor_for_minutes = secs % (60 * 60);
	    var minutes = Math.floor(divisor_for_minutes / 60);
	    var divisor_for_seconds = divisor_for_minutes % 60;
	    var seconds = Math.ceil(divisor_for_seconds);
	    var obj = {
	        "h": hours,
	        "m": minutes,
	        "s": seconds
	    };
	    return obj;
	}

	function padNumber(number) {
	  if (number<=99) { number = ("0"+number).slice(-2); }
	  return number;
	}

	$.CrushFTP.formatTime = function(secs) {
		var remaining = "";
		if(!secs)return "";
		secs = secs.substring(0, secs.indexOf(".")) * 1;
		if (secs <= 0) {
			remaining = getLocalizationKeyExternal("BrowserUploaderSpeedTimeCalculatingText");
		} else {
			var secsToTime = $.CrushFTP.secondsToTime(secs);
			if(secsToTime.h !=0)
			{
				remaining = padNumber(secsToTime.h) + ":" + padNumber(secsToTime.m) + ":" + padNumber(secsToTime.s) + " hours"
			}
			else if(secsToTime.m !=0)
			{
				remaining = padNumber(secsToTime.m) + ":" + padNumber(secsToTime.s) + " mins"
			}
			else if(secsToTime.s !=0)
			{
				remaining = padNumber(secsToTime.s) + " secs"
			}
		}
		return remaining;
	}

	$.CrushFTP.formatFileSize = function (bytes) {
		return $.CrushFTP.formatBytes(bytes);
	}

	var fileRepo = $("#fileRepo");
	var fileQueueInfo = $("#fileQueueInfo");
	var browseFileButtonPanel = $("#browseFileButtonPanel");
	var javaAppletDiv = $("#javaAppletDiv");
	var overwriteAllLinkBtn = fileRepo.find("#overwriteAllLinkBtn");
	var clearUploadedAll = fileRepo.find("a.uploadedAll");
	var shareAllUploaded = fileRepo.find("a.shareAllUploaded").hide();
	var remvoeErrorAllLinkBtn = fileRepo.find("#remvoeErrorAllLinkBtn");
	var totalFilesText = fileRepo.find("span.totalFiles");
	var totalSizeText = fileRepo.find("span.totalSize");
	var viewFileQueue = fileQueueInfo.find("#viewFileQueue");
	var globalProgressBar = $("#globalProgressBar");
	var fileUploadBar = $("#fileUploadBar");
	var fileUploadBarHolder = $("#fileUploadBarHolder");

	if(!$.CrushFTP.browserSupportsDND())
	{
		totalSizeText.prev().remove();
		totalSizeText.remove();
	}

	$.CrushFTP.buildQueueInfo = function(){
		var itemsSelected = fileRepo.find("li");
		if(itemsSelected && itemsSelected.length>0)
		{
			var totalSize = 0;
			itemsSelected.each(function(){
				if($(this).find(".noCount").length==0)
					totalSize += parseFloat($(this).attr("size"));
			});
			totalFilesText.text(itemsSelected.length);
			totalSizeText.text($.CrushFTP.formatBytes(totalSize));
			if(window.disableFileQueueOnFileAdded){
				fileRepo.data("totalSize", totalSize);
			}
			else{
				fileRepo.show().trigger("visibilityChange").data("totalSize", totalSize);
			}
			viewFileQueue.show();
		}
		else
		{
			totalFilesText.text("");
			totalSizeText.text("");
			if(!$.CrushFTP.uploadBarHidden)
			{
				var isVisibleRepo = fileRepo.is(":visible");
				fileRepo.hide();
				if(window.fileWindowAsDialog && isVisibleRepo)
				{
					$("#toggleFileList").click();
				}
				fileRepo.trigger("visibilityChange");
				viewFileQueue.hide();
			}
		}
		$.CrushFTP.bindUploadItemEvents();
		if(fileRepo.find("ul").find("a.overwriteLink:visible").length>0)
			overwriteAllLinkBtn.show();
		else
			overwriteAllLinkBtn.hide();

		if(fileRepo.find("li.uploaded").length>0)
			clearUploadedAll.show();
		else
			clearUploadedAll.hide();

		if(fileRepo.find("ul").find("li.hasError").length>0)
			remvoeErrorAllLinkBtn.show();
		else
			remvoeErrorAllLinkBtn.hide();

		if($.CrushFTP.UploadProgressing && $.CrushFTP.uploadAllQueued)
			$.CrushFTP.getNextQueuedItem();

		if(fileRepo.find("a.shareUploadedItem:visible").length>0)
			shareAllUploaded.show();
		else
			shareAllUploaded.hide();
		if(window.hideStartButtonOnIndividualUploadItem)
		{
			fileRepo.find(".upload-buttons").find(".startUpload, .start").hide();
		}
	};

	var getFileExtension = function(filename) {
		var ext = /^.+\.([^.]+)$/.exec(filename);
		return ext == null ? "" : ext[1].toLowerCase();
	}

	$.CrushFTP.showIconsForFiles = function()
	{
		fileRepo.find("li:not(.appletItem)").each(function(){
			var item = $(this);
			if(item.hasClass("iconSet"))return;
			item.addClass("iconSet");
			var ext = getFileExtension(item.find("div.name").text());
			/*if(ext == "jpg" || ext == "jpeg" || ext == "gif" || ext == "png" || ext == "bmp")
				return;*/
			var imgSrc = "";
			if ($.CrushFTP.Options.availableFileExtensionImages.has(ext)) {
				imgSrc = $.CrushFTP.Options.FileExtensionImageFilePath + ext + "_32.png";
			} else {
				imgSrc = $.CrushFTP.Options.fileLarge + "_32.png";
			}
			if(imgSrc.length>0)
				item.find("div.previewIconUpload").find("span.fade").empty().append("<img style='margin-top:5px;' src='"+imgSrc+"'/>");
		});
	};

	$.CrushFTP.bindUploadEvents = function() {
		overwriteAllLinkBtn.unbind().bind("click", function(){
			fileRepo.find("ul").find("a.overwriteLink").trigger("click");
			$(this).hide();
			return false;
		});

		remvoeErrorAllLinkBtn.unbind().bind("click", function(){
			fileRepo.find("li.hasError").find("a.cancelUpload").trigger("click");
			$(this).hide();
			return false;
		});

		viewFileQueue.unbind().click(function(){
			if(!$("#browseTypeSelector").hasClass("advanced") && window.useNewUpload){
				window.showUploadPanel();
				return false;
			}
			var cluetipTitle = $("#cluetip-title");
			if($(this).hasClass("close"))
			{
				if(window.fileWindowAsDialog)
				{
					$.unblockUI();
				}
				setTimeout(function(){
					fileRepo.slideUp("fast", function(){
						fileRepo.trigger("visibilityChange");
					});
					$(this).removeClass("close");
				}, 100);
			}
			else
			{
				if(window.fileWindowAsDialog)
				{
					fileRepo.show().trigger("visibilityChange");
				}
				else
				{
					fileRepo.slideDown("fast", function(){
						fileRepo.trigger("visibilityChange");
					});
				}
				$(this).addClass("close");
			}
			$(this).blur();
			return false;
		}).hide();

		fileRepo.find("#toggleFileList").click(function(){
			viewFileQueue.trigger("click");
		});

		fileRepo.find("a.cancelUploading").unbind().click(function(){
			if($(this).hasClass("uploadedAll"))
			{
				fileRepo.find("li.uploaded").find("a.cancelUpload").trigger("click");
			}
			else
				$(fileRepo.find("li").get().reverse()).each(function(){
					$(this).find("a.cancelUpload").trigger("click");
				});
			return false;
		});

		fileRepo.find("a.startUploading").unbind().click(function(evt){
			if(evt.altKey)
			{
				try{
					performAction("delayedUpload");
				}catch(ex){}
			}
			else
			{
				var startBtn = $.CrushFTP.getNextQueuedItem();
				if(startBtn){
					startBtn.trigger("click", [{allInQueue:true}]);
					window.commonUploadFormShown = false;
				}
			}
			return false;
		});

		shareAllUploaded.unbind().click(function(){
			var itemsUploaded = fileRepo.find("a.shareUploadedItem");
			if(itemsUploaded.length==0)
			{
				$(this).hide();
				return false;
			}
			var paths = [];
			var files = [];
			itemsUploaded.each(function(){
				var elem = $(this).closest("li");
				var privs = elem.attr("privs");
				if(!privs || typeof window.shareFile == "undefined")return;
				privs = unescape(privs);
				if(privs.toLowerCase().indexOf("(share)")>=0)
				{
					var fileName = unescape(elem.attr("fileName"));
					paths.push(unescape(unescape(elem.attr("path"))) + fileName);
					files.push(fileName);
				}
			});
			var shareMethodUploadedItem = $(document).data("shareMethodUploadedItem");
			if(paths.length>0 && files.length>0)
			{
				var _continueShare = function() {
					fileRepo.trigger("visibilityChange");
					if(shareMethodUploadedItem && shareMethodUploadedItem.toLowerCase() == "quick")
					{
						window.quickShareFile(false, paths.join("\r\n"), false, files.join("\r\n"));
					}
					else
						window.shareFile(false, paths.join("\r\n"), files.join("\r\n"));
				}
				var isVisibleRepo = fileRepo.is(":visible");
				if(window.fileWindowAsDialog && isVisibleRepo)
				{
					$("#toggleFileList").click();
					setTimeout(_continueShare, 400);
				}
				else if(window.fileWindowAsDialog){
					setTimeout(_continueShare, 400);
				}
				else
				{
					setTimeout(_continueShare);
				}
			}
			else
				$(this).hide();
			return false;
		});
	}

	$.CrushFTP.getNextQueuedItem = function(notBatchUpload) {
		var startBtn = false;
		var hasBtns = false;
		if(!notBatchUpload)
		{
			fileRepo.find("li:not(.uploaded, .error, .skipped, .ui-state-highlight, .hasError, .warning, .waiting)").each(function(){
				var startUploadBtn = $(this).find("a.startUpload");
				if(startUploadBtn)
				{
					if(!startBtn)
						startBtn = startUploadBtn;
					else
					{
						startUploadBtn.text(window.locale.fileupload.waiting);
						hasBtns = true;
					}
				}
			});
			if($.CrushFTP.uploadAllQueued && !startBtn && !hasBtns)
			{
				if(!window.dontShowUploadQueueCompletedGrowlMessage)
					$.growlUI(locale.fileupload.uploadCompletedText, locale.fileupload.uploadedMultipleFilesText, $.CrushFTP.Options.GrowlTimeout);
				if(window.runBatchCompletedCommandAfterUploadQueueFinishes)
				{
					window.batchComplete();
				}
				if(typeof window.onUploadComplete == "function"){
					window.onUploadComplete();
				}
				if(window.hideUploadBarAfterUpload)
				{
					viewFileQueue.addClass("close").trigger("click");
				}
				fileRepo.find(".curQueue").removeClass("curQueue");
				$.CrushFTP.removeGlobalProgressInfo();
				var autoShareUploadedItem = $(document).data("autoShareUploadedItem");
				if(autoShareUploadedItem && autoShareUploadedItem.toLowerCase()=="true")
				{
					//Nothing to handle?
				}
				else
				{
					if(window.autoRemoveUploadedItemFromList)
					{
						fileRepo.find("a.clearCompleted:first").trigger('click');
					}
				}
			}
		}
		else
		{
			var fileItem = fileRepo.find("li.queued:not(.uploaded, .error, .skipped, .ui-state-highlight, .hasError, .warning, .waiting):first");
			if(fileItem.length>0)
			{
				fileItem.removeClass("queued");
				startBtn = fileItem.find("a.startUpload");
			}
		}
		return startBtn;
	}

	$.CrushFTP.bindUploadItemEvents = function()
	{
		//Native upload items
		var allItems = fileRepo.find("li");
		allItems.find("a.cancelUpload").unbind().click(function(){
			var that = this;
			if($(this).closest("li.template-upload").hasClass('waiting'))
				return false;
			var elem = $(this).closest("li");
			if(elem.hasClass("uploadProgress"))
			{
				var _confirm = getLocalizationKeyExternal("uploadConfirmCancelUploadText") || "Are you sure you wish to cancel this upload?";
				if(confirm(_confirm))
				{
					if(elem.hasClass("appletItem"))
					{
						var resume = elem.find("a.pause").hasClass("resume");
						var globalPBPauseBtn = globalProgressBar.find("a.pause");
						if(resume)
						{
							elem.find("a.pause").removeClass("resume").text("Pause");
							elem.find(".status").html("Cancelling..");
							elem.removeClass("paused");
							globalPBPauseBtn.removeClass("resume").text("Pause");
							globalProgressBar.find(".speed,.time").show();
							globalProgressBar.find(".statusPB").remove();
						}
						runAppletCommand(true, "COMMAND=ACTION:::TYPE=UPLOAD:::ACTION=CANCEL");
						elem.attr("status", "skipped");
						$.CrushFTP.DNDUploadCallback("skipped", false, elem.find("a.startUpload"), elem);
					}
					else{
						elem.addClass('aborting');
						$.CrushFTP.abortUploadRequest(elem, function(){
							$.CrushFTP.DNDUploadCallback("skipped", false, elem.find("a.startUpload"), elem);
						});
					}
				}
			}
			else
			{
				elem.remove();
				$.CrushFTP.buildQueueInfo();
			}
			return false;
		});

		allItems.find("a.startUpload").unbind().click(function(e, data){
			/* added by carlos close advanced options if the download is finished */
            if( $("#uploadOptionsDialog").dialog("isOpen") ) {
                $("#uploadOptionsDialog").dialog("close");
            }
			if($(this).hasClass('clicked') || $(this).closest("li.template-upload").hasClass('waiting')){
				var that = $(this);
				setTimeout(function(){
					that.removeClass('clicked')
				}, 500);
				return false;
			}
			if(data && data.allInQueue)
				$.CrushFTP.uploadAllQueued = true;
			var listElem = $(this).closest("li.formProcessed");
			if($.CrushFTP.UploadProgressing)
			{
				$(this).text(window.locale.fileupload.waiting);
				if(!dragEventsNotSupported)
				{
					if(listElem.hasClass("uploaded") || listElem.hasClass("skipped"))
					{
						var curSize = parseFloat(listElem.attr("size"));
						if(IsNumeric(curSize))
						{
							var guploadInfo = globalProgressBar.data("uploadInfo");
							if(guploadInfo)
							{
								guploadInfo.totalUploaded -= curSize;
								guploadInfo.curfile -= 1;
							}
							globalProgressBar.data("uploadInfo", guploadInfo);
						}
					}
				}
				if(!$.CrushFTP.uploadAllQueued)
				{
					listElem.addClass("queued curQueue").removeClass("uploaded error hasError skipped");
				}
				else
				{
					listElem.removeClass("uploaded error hasError skipped");
				}
				return false;
			}
			else
				$.CrushFTP.uploadAllQueued = data && data.allInQueue;
			if(listElem && listElem.length>0)
			{
				if(listElem.hasClass("skipped"))
					listElem.removeClass("skipped");

				listElem.addClass("curQueue").removeClass("hasError");
				if(listElem.hasClass("appletItem"))
				{
					listElem.find("a.start").trigger("click");
				}
				else
				{
					$.ajax({
						type: "POST",
						async: false,
						url: $.CrushFTP.Options.ajaxCallURL,
						data: "command=unblockUploads&random=" + Math.random()+"&c2f="+ crushFTPTools.getCrushAuth(),
						success: function (response) {
							listElem.find("a.start").trigger("click");
							listElem.find(".uploadNote").remove();
							listElem.find(".progressbar").progressbar({"value" : 0});
							var guploadInfo = globalProgressBar.data("uploadInfo");
							if(!dragEventsNotSupported && guploadInfo)
							{
								globalProgressBar.show();
							}
							else
								globalProgressBar.find(".progressbarMain").progressbar({"value" : 0});
						}
					});
				}
			}
			$(this).addClass('clicked');
			return false;
		});

		//Applet items
		var appletItems = fileRepo.find(".appletItem");
		appletItems.find("a.start").unbind().click(function(){
			if($(this).closest("li.template-upload").hasClass('waiting'))
				return;
			if(!$.CrushFTP.UploadProgressing)
			{
				var listElem = $(this).closest("li");
				$.ajax({
					type: "POST",
					async: false,
					url: $.CrushFTP.Options.ajaxCallURL,
					data: "command=unblockUploads&random=" + Math.random()+"&c2f="+ crushFTPTools.getCrushAuth(),
					success: function (response) {
						$.CrushFTP.startAppletItemUpload(listElem);
						listElem.find(".progressbar").progressbar({"value" : 0});
						globalProgressBar.find(".progressbarMain").progressbar({"value" : 0});
					}
				});
			}
			return false;
		});

		appletItems.find("a.pause").unbind().click(function(){
			var resume = $(this).hasClass("resume");
			var parentElem = $(this).closest("li");
			var globalPBPauseBtn = globalProgressBar.find("a.pause");
			if(resume)
			{
				$(this).removeClass("resume").text("Pause");
				parentElem.find(".status").html("Resuming..");
				parentElem.removeClass("paused");
				globalPBPauseBtn.removeClass("resume").text("Pause");
				globalProgressBar.find(".speed,.time").show();
				globalProgressBar.find(".statusPB").remove();
			}
			else
			{
				if(!parentElem.hasClass("uploadProgress"))return false;
				$(this).addClass("resume").text("Resume");
				parentElem.addClass("paused");
				globalPBPauseBtn.removeClass("resume").text("Resume");
				globalProgressBar.find(".speed,.time").hide();
				globalProgressBar.find(".progressInfoText").append('<span class="statusPB" style="float:left;font-weight:bolder;margin-top:3px;">Paused</span>');
			}
			$.CrushFTP.pauseResumeAppletItemUpload(parentElem, !resume);
			return false;
		});

		appletItems.each(function(){
			var item = $(this);
			var fileInfo = item.data("fileInfo");
			if(!fileInfo)return;
			var ext = getFileExtension(fileInfo.name);
			var imgSrc = "";
			if ($.CrushFTP.Options.availableFileExtensionImages.has(ext)) {
				imgSrc = $.CrushFTP.Options.FileExtensionImageFilePath + ext + "_32.png";
			} else {
				imgSrc = $.CrushFTP.Options.fileLarge + "_32.png";
				if(fileInfo.type && fileInfo.type == "dir")
				{
					imgSrc = $.CrushFTP.Options.fileFolder;
				}
			}
			if(imgSrc.length>0)
				item.find("div.previewIconUpload").find("span.fade").empty().append("<img style='margin-top:5px;' src='"+imgSrc+"'/>");
		});
	}

	$.CrushFTP.startAppletItemUpload = function(item)
	{
		if(!item || item.hasClass("uploadProgress"))return;
		var fileInfo = item.data("fileInfo");
		if(!fileInfo)return;
		item.find("a.pause").removeClass("resume").text("Pause");
		item.find(".status").html("Starting Upload..");
		item.removeClass("paused");
		var globalPBPauseBtn = globalProgressBar.find("a.pause");
		globalPBPauseBtn.removeClass("resume").text("Pause");
		globalProgressBar.find(".speed,.time").show();
		globalProgressBar.find(".statusPB").remove();
		var url = location.protocol + "//" + location.host + "" + $.CrushFTP.Options.proxy + "/";
		var _formData = item.data("formData") || "";
		if(_formData && _formData.length>0 && $.CrushFTP.commonUploadFormDataSerialized)
        {
            _formData += '&' + $.CrushFTP.commonUploadFormDataSerialized;
        }
        else if($.CrushFTP.commonUploadFormDataSerialized)
        {
        	_formData = $.CrushFTP.commonUploadFormDataSerialized;
        }
        var filteredFormData = [];
        if(_formData)
        {
            var items = _formData.split("&");
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
                        filteredFormData.push({
                            name : key,
                            value : val
                        });
                    }
                }
            }
        }
        var metaInfo = window.metaInfo || {};
    	Object.keys(metaInfo).forEach(function(key) {
        	filteredFormData.push({
                name : key,
                value : metaInfo[key]
            });
        });
        var formData = "";
		if(filteredFormData && filteredFormData.length>0)
		{
			for (var i = filteredFormData.length - 1; i >= 0; i--) {
				if(formData.length>0)
					formData += ":::" + filteredFormData[i].name + "=" + filteredFormData[i].value;
				else
					formData = filteredFormData[i].name + "=" + filteredFormData[i].value;
			};
		}
		/*added by carlos for dialog*/
		var overwriteUpload = '';
		var resumeUpload = '';
		var compressionUpload = '';
		if( $("#browseTypeSelector").hasClass("advanced") ) {
			var overwriteDialog = $('#uploadOptionsDialog_ow').val();
			var compressionDialog = $('#uploadOptionsDialog_co').val();
			compressionUpload = ":::NOCOMPRESSION=" + compressionDialog;
			overwriteUpload = ":::OVERWRITE=" + overwriteDialog;
		}
		/* end */
		var cmd = "COMMAND=UPLOAD:::URL="+url+":::UPLOADPATH=" + fileInfo.path + ":::P1=" + fileInfo.sourcePath + ":::" + formData + resumeUpload + compressionUpload + overwriteUpload;
		if(item.find("span.groupCount").length>0)
			cmd = "COMMAND=UPLOAD:::URL="+url+":::UPLOADPATH=" + fileInfo.path + fileInfo.sourcePath + ":::" + formData + resumeUpload + compressionUpload + overwriteUpload;
		if(window.UPLOAD_THREADS)
			cmd += ":::UPLOAD_THREADS=" + window.UPLOAD_THREADS;
		crushFTPTools.getCrushAuthToken(function(token){
			runAppletCommand(true, "COMMAND=AUTH:::CRUSHAUTH=" + token +"");
			runAppletCommand(true, cmd);
			$.CrushFTP.DNDUploadCallback("uploading", false, item.find("a.startUpload"), item);
		});
	}

	$.CrushFTP.pauseResumeAppletItemUpload = function(item, pause)
	{
		if(!item)return;
		var fileInfo = item.data("fileInfo");
		if(!fileInfo)return;

		var cmd = "COMMAND=ACTION:::TYPE=UPLOAD:::ACTION=RESUME";
		if(pause)
			cmd = "COMMAND=ACTION:::TYPE=UPLOAD:::ACTION=PAUSE";
		crushFTPTools.getCrushAuthToken(function(token){
			runAppletCommand(true, "COMMAND=AUTH:::CRUSHAUTH=" + token +"");
			runAppletCommand(true, cmd);
			if(pause)
			{
				item.attr("status", "paused");
				$.CrushFTP.DNDUploadCallback("paused", false, item.find("a.startUpload"), item);
			}
			else
			{
				item.removeAttr("status");
				$.CrushFTP.DNDUploadCallback("uploading", false, item.find("a.startUpload"), item);
			}
		});
	}

	$.CrushFTP.showCommonUploadForm = function(callback, elem){
		var uploadInfoForm = $("#uploadInfoForm");
		$.CrushFTP.uploadInfoFormDialog.data("commonForm", true);
		$.CrushFTP.showingCommonUploadForm = true;
		var formContent = uploadInfoForm.find(".formContent").replaceWith("<div class='formContent'>" + $(document).data("commonUploadFormHTML") + "</div>");
		setCustomFormFieldAttributes(uploadInfoForm);
		attachCalendarPopup(uploadInfoForm);
		if($.CrushFTP.onCommonUploadFormShown)
		{
			$.CrushFTP.onCommonUploadFormShown(uploadInfoForm, elem, function(cancel){
				if(cancel)
					uploadInfoForm.closest('div.ui-dialog').find("div.ui-dialog-buttonset").find("button:first").trigger('click');
				else
					uploadInfoForm.closest('div.ui-dialog').find("div.ui-dialog-buttonset").find("button:last").trigger('click');
			});
		}
		$.CrushFTP.uploadInfoFormDialog.find("#uploadFormDataCheckbox").show();
		window.commonUploadFormShown = true;
		if(fileRepo.is(":visible"))
		{
			$.unblockUI();
			$.CrushFTP.uploadInfoFormDialog.dialog("open").dialog("moveToTop");
			$.CrushFTP.showFileRepo = true;
		}
		else
		{
			$.CrushFTP.uploadInfoFormDialog.dialog("open").dialog("moveToTop");
			$.CrushFTP.showFileRepo = false;
		}
		$.CrushFTP.onCommonUploadFormSubmitted = function(formdata){
			$.CrushFTP.showingCommonUploadForm = false;
			$.CrushFTP.commonUploadFormDataSerialized = formdata;
			callback(formdata);
		};
		$.CrushFTP.uploadInfoFormDialog.data("commonForm", true);
	}

	$.CrushFTP.showUploadForm = function(elem)
	{
		if($.CrushFTP.fetchingUploadForm)return;
		if ($("#customUploadForm").length > 0) {
			$.CrushFTP.fetchingUploadForm = true;
			getUploadForm(function (data) {
				$.CrushFTP.fetchingUploadForm = false;
				if($(document).data("commonUploadFormHTML") && !window.commonUploadFormShown)
				{
					$.CrushFTP.showCommonUploadForm(function(formData){
						var newItems = fileRepo.find("li:not(.formProcessed)").addClass('per-file-form-new');
						$.CrushFTP.storeUploadFormDataToItems(formData);
						continueWithUploadForm(newItems.removeClass('formProcessed'));
						//$(newItems.get(0)).removeClass('per-file-form-new').addClass('being-edited').find(".editForm").click();
					}, elem);
					$("#showCommonUploadForm").show().unbind().click(function(){
						$.CrushFTP.showCommonUploadForm(function(){

						});
						return false;
					}, elem);
				}
				else
				{
					continueWithUploadForm();
				}
				function continueWithUploadForm(newItems)
				{
					$.CrushFTP.uploadInfoFormDialog.data("commonForm", false);
					$.CrushFTP.fetchingUploadForm = false;
					if(data && data.length>0)
					{
						data = $("<div class='formContent'>" + data + "</div>");
						//if($(document).data("commonUploadFormHTML"))
						{
							if(!elem){
								setTimeout(function(){
									var formdata = $.CrushFTP.commonUploadFormDataSerialized || "";
									newItems = newItems || fileRepo.find("li:not(.formProcessed)").addClass('per-file-form-new');
									$.CrushFTP.storeUploadFormDataToItems(formdata);
									if(newItems && newItems.length>0){
										if(!$(newItems.get(0)).hasClass('formProcessed'))
											$(newItems.get(0)).removeClass('per-file-form-new').addClass('being-edited').find(".editForm").click();
									}
								}, 100);
								return;
							}
							var itemName = elem.attr("fullPath");
							if(elem)
								elem.addClass('being-edited');
							var _formInfo = getLocalizationKeyExternal("uploadFormInfoTitleText") || "For item : ";
							if(itemName){
								var nxtItem = getLocalizationKeyExternal("pagingNextText") || "Next";
								var prevItem = getLocalizationKeyExternal("pagingPrevText") || "Previous";
								data.prepend('<div class="form-info">'+_formInfo+' <strong>'+unescape(itemName)+'</strong><span class="form-nav"><a href="javascript:void(0);" tabindex="-1" class="prevFormItem">'+prevItem+'</a> <a href="javascript:void(0);" tabindex="-1" class="nextFormItem">'+nxtItem+'</a></span></div>');
								if(elem.index()==0)
									data.find(".form-info").find(".prevFormItem").addClass('disabled');
								if(elem.index() == elem.parent().find("li").length-1)
									data.find(".form-info").find(".nextFormItem").addClass('disabled');
								data.find(".prevFormItem").click(function(){
									if($(this).hasClass('disabled'))
										return false;
									else
									{
										$.CrushFTP.customFormWindowClose = true;
										$.CrushFTP.uploadInfoFormDialog.parent().find(".ui-dialog-buttonpane").find("button:last").click();
										$.CrushFTP.customFormWindowClose = false;
										if(!$.CrushFTP.uploadInfoFormDialog.is(":visible"))
											elem.prev().find(".editForm").click();
									}
								});
								data.find(".nextFormItem").click(function(){
									if($(this).hasClass('disabled'))
										return false;
									else
									{
										$.CrushFTP.customFormWindowClose = true;
										$.CrushFTP.uploadInfoFormDialog.parent().find(".ui-dialog-buttonpane").find("button:last").click();
										$.CrushFTP.customFormWindowClose = false;
										if(!$.CrushFTP.uploadInfoFormDialog.is(":visible"))
											elem.next().find(".editForm").click();
									}
								});
							}
						}
						var checked = window.uploadFormAskAgainChecked;
						var hideAndChecked = window.uploadFormAskAgainHideAndChecked;
						var hideAndUnchecked = window.uploadFormAskAgainHideAndUnchecked;
						if(!$(document).data("commonUploadFormHTML"))
						{
							var check = $("<tr id='uploadFormDataCheckbox'><td colspan='2' style='border:none;'><p class='formOption ui-state-highlight'><input type='checkbox' id='useUploadFormForAll' /><label for='useUploadFormForAll'>Don't show form for additional files.</label></p></td></tr>");
							data.append(check);
							if(checked)
								check.find("input").attr("checked", "checked");
							if(hideAndChecked)
							{
								check.find("input").attr("checked", "checked");
								check.find("td").hide();
							}
							if(hideAndUnchecked)
							{
								check.find("input").removeAttr("checked");
								check.find("td").hide();
							}
						}
						var uploadInfoForm = $("#uploadInfoForm");
						var formContent = uploadInfoForm.find(".formContent").replaceWith(data);
						setCustomFormFieldAttributes(uploadInfoForm);
						attachCalendarPopup(uploadInfoForm);
						$.CrushFTP.uploadInfoFormDialog.data("elem", elem);
						$.CrushFTP.uploadInfoFormDialog.find("#uploadFormDataCheckbox").show();
						if(fileRepo.is(":visible"))
						{
							$.unblockUI();
							$.CrushFTP.uploadInfoFormDialog.dialog("open").dialog("moveToTop");
							$.CrushFTP.showFileRepo = true;
						}
						else
						{
							$.CrushFTP.uploadInfoFormDialog.dialog("open").dialog("moveToTop");
							$.CrushFTP.showFileRepo = false;
						}
						if($.CrushFTP.uploadFormShown)
						{
							$.CrushFTP.uploadFormShown(uploadInfoForm, elem, function(cancel){
								if(cancel)
									uploadInfoForm.closest('div.ui-dialog').find("div.ui-dialog-buttonset").find("button:first").trigger('click');
								else
									uploadInfoForm.closest('div.ui-dialog').find("div.ui-dialog-buttonset").find("button:last").trigger('click');
							});
						}
					}
					else
						$.CrushFTP.storeUploadFormDataToItems(undefined, undefined, true);
				}
			}, function(){
			});
		}
		else
		{
			$.CrushFTP.storeUploadFormDataToItems();
			$.CrushFTP.fetchingUploadForm = false;
		}
	};

	$.CrushFTP.storeUploadFormDataToItems = function(formData, elem, done){
		var items = elem;
		if(!items || items.length==0){
			items = fileRepo.find("li:not(.formProcessed)");
		}
		done = done || fileRepo.find("li:not(.formProcessed)").length == 0;
		if(done)
		{
			items = items.addClass("formProcessed");
		}
		if(typeof formData != "undefined" && !$.CrushFTP.uploadInfoFormDialog.data("commonForm"))
		{
			items.data("formData", formData);
			items.find(".editForm").parent().show().end().unbind("click").click(function(){
				var listElem = $(this).closest("li");
				if(listElem && listElem.length>0){
					$.CrushFTP.showUploadForm(listElem);
				}
				return false;
			});
		}
		else
		{
			items.find(".editForm").parent().hide();
		}

		if(done){
			if($.cookie($.CrushFTP.Options.CookieAutoUploadFlag) + "" == "true")
			{
				setTimeout(function() {
					fileRepo.find("a.startUploading:first").trigger("click");
				}, 100);
			}
			$.CrushFTP.uploadInfoFormDialog.dialog("close");
		}
	};

	var localdelay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    var _filesToCheck = [];
    function checkFileExistBatch(){
    	var filesToCheck = [].concat(_filesToCheck);
    	if(filesToCheck.length==0)
    		return;
    	_filesToCheck = [];
    	var paths = [];
    	var filesObj = {};
    	filesToCheck.map(function(file){
    		var path = encodeURIComponent(file._path + file.name);
    		filesObj[path] = file;
    		paths.push(path);
    	});
    	var obj = {
            command: "exists",
            paths: paths.join(";"),
            random: Math.random()
        };
        obj.c2f = crushFTPTools.getCrushAuth();
        $.ajax({
            type: "POST",
            url: $.CrushFTP.Options.ajaxCallURL,
            data: obj,
            success: function (data) {
            	var response = $(data).find("response").text() || "";
            	response = response.split("\n");
            	response.map(function(item){
            		var curItem = item.split(":");
            		var exists = curItem[1] == "true";
		    		var path = encodeURIComponent(curItem[0]);
		    		if(exists){
		    			filesObj[path].promise.resolve();
		    		}
		    		else{
		    			filesObj[path].promise.reject();
		    		}
		    	});
            },
            error: function(err){
            	filesToCheck.map(function(file){
		    		var path = encodeURIComponent(file._path + file.name);
		    		filesObj[path].promise.reject();
		    	});
            }
        });
    }

	$.CrushFTP.checkFileExistOnServer = function(name, _path, realCheck) {
		if(realCheck){
			var promise =  new Promise(function(resolve, reject){
				_filesToCheck.push({
					name: name,
					_path: _path,
					promise: {
						resolve: resolve,
						reject: reject
					}
				});
				if(_filesToCheck.length>=10000){
					checkFileExistBatch();
				}
			});
			localdelay(function(){
				checkFileExistBatch();
			}, 1000);
			return promise;
			// var obj = {
   //              command: "getXMLListing",
   //              format: "JSONOBJ",
   //              path: encodeURIComponent(_path),
   //              random: Math.random()
   //          };
   //          obj.c2f = crushFTPTools.getCrushAuth();
   //          return new Promise(function(resolve, reject){
	  //           $.ajax({
	  //               type: "POST",
	  //               url: $.CrushFTP.Options.ajaxCallURL,
	  //               data: obj,
	  //               dataType: "json",
	  //               beforeSend: function(x) {
	  //                   if(x && x.overrideMimeType) {
	  //                       x.overrideMimeType("application/j-son;charset=UTF-8");
	  //                   }
	  //               },
	  //               success: function (data) {
	  //                   if(data.listing)
	  //                   {
	  //                       for (var i = 0; i < data.listing.length; i++) {
	  //                           var curItem = data.listing[i];
	  //                           if(curItem.name.toLowerCase() === name.toLowerCase()){
	  //                           	i = data.listing.length;
	  //                           	resolve();
	  //                           	return;
	  //                           }
	  //                       }
	  //                   }
	  //                   reject();
	  //               },
	  //               error: function(err){
	  //               	reject();
	  //               }
	  //           });
   //          });
		}
		if(!name || !_path)
			return false;
		name = name.toLowerCase();
		var destinationPath;
		try{
			destinationPath = decodeURIComponent(hashListener.getHash().toString().replace("#", ""));
		}
		catch(ex){
			destinationPath = unescape(hashListener.getHash().toString().replace("#", ""));
		}
		var tempExtension = window.temp_upload_ext;
		destinationPath = destinationPath || "/";
		if(_path)
		    destinationPath = _path;
		if(_path != destinationPath) return false;
		var fileAvl = false;
		if (window.curTreeItems) {
			$.each(window.curTreeItems, function () {
				if ($.trim($(this)[0].name).toLowerCase() === $.trim(name) || $.trim($(this)[0].name).toLowerCase() === $.trim(name) + "" + tempExtension) {
					fileAvl = true;
					return fileAvl;
				}
			});
		}
		return fileAvl;
	};

	$.CrushFTP.checkFolderExistOnServer = function(_path) {
		if(!_path)
			return false;
		_path = _path.toLowerCase();
		var folderAvl = false;
		if (window.curTreeItems) {
			$.each(window.curTreeItems, function () {
				if ($.trim($(this)[0].name).toLowerCase() === $.trim(_path)) {
					folderAvl = true;
					return folderAvl;
				}
			});
		}
		return folderAvl;
	};

	var getFileExtension = function(filename) {
		var ext = /^.+\.([^.]+)$/.exec(filename);
		return ext == null ? "" : ext[1].toLowerCase();
	}

	$.CrushFTP.isFileTypeAllowed = function(name){
		if(typeof window.onlyAllowedExtensionsToUpload != "undefined")
		{
			var ext = getFileExtension(name);
			return window.onlyAllowedExtensionsToUpload.has("."+ext);
		}
		if(typeof window.notAllowedExtensionsToUpload != "undefined")
		{
			var ext = getFileExtension(name);
			return !window.notAllowedExtensionsToUpload.has("."+ext);
		}
		return true;
	};

	$.CrushFTP.hasUnsafeChars = function(name, fullPath){
		var unsafechars = (window.unsafe_filename_chars && (window.unsafe_filename_chars.indexOf(",")>0 ? window.unsafe_filename_chars.split(",") : window.unsafe_filename_chars.split(""))) || [];
		if(fullPath){
			unsafechars.removeByVal("/");
			unsafechars.removeByVal("\\");
		}
		if(unsafechars && unsafechars.length>0){
			var hasChar = false;
			unsafechars.forEach(function(cur){
				if(!hasChar && name.indexOf(cur)>=0){
					hasChar = true;
					return true;
				}
			});
			return hasChar;
		}
		else
			return false;
	}

	$.CrushFTP.handleWarnings = function() {
		/* added by carlos */
		if( $("#browseTypeSelector").hasClass("normal") ) {
			fileRepo.find(".fileExistOnServer").each(function(){
				var item = $(this).removeClass("fileExistOnServer").closest("li");
				item.addClass("ui-state-highlight");
				$(this).hide().after('<div class="overwrite" style="float:right;margin-top:17px;"><a href="javascript:void(0);" class="overwriteLink">'+window.locale.fileupload.overwrite+'</a></div>').parent().find("div.overwrite").click(function(){
					if($(this).closest("li.template-upload").hasClass('waiting'))
						return false;
					$(this).remove();
					item.removeClass("ui-state-highlight").find("div.startUpload").show().end().find(".error").remove();
					if($.cookie($.CrushFTP.Options.CookieAutoUploadFlag) + "" == "true")
					{
						setTimeout(function() {
							fileRepo.find("a.startUploading:first").trigger("click");
						}, 100);
					}
					if(fileRepo.find("ul").find("a.overwriteLink:visible").length>0)
						overwriteAllLinkBtn.show();
					else
						overwriteAllLinkBtn.hide();
					return false;
				}).parent().after("<span class='error'>"+window.locale.fileupload.error + ":" + window.locale.fileupload.errors.fileExistOnServer+"</span>");
			});
		}

		var bigFiles = [];
		fileRepo.find(".fileBiggerThanAllowed").each(function(){
			var item = $(this).removeClass("fileExistOnServer").closest("li");
			bigFiles.push(item.find("div.name").text());
		});
		var isLocalhost = window.location.hostname.toString().indexOf("127.0.0.1") >=0 || window.location.hostname.toString().indexOf("localhost")>=0;
		if(!isLocalhost && bigFiles.length>0 && typeof window.hideAdvancedUploader == "undefined" && typeof window.doNotAdviceAdvancedUploader == "undefined")
		{
			var _title = getLocalizationKeyExternal("uploadBiggerFileNoticeTitleText");
			var _desc = getLocalizationKeyExternal("uploadBiggerFileNoticeDescText");
			growl(_title, _desc, false, $.CrushFTP.Options.GrowlTimeout + 10000);
		}
		fileRepo.find("span.acceptFileTypes").each(function(){
			$(this).css("float","none");
		});
	};

	$.CrushFTP.fileCount = 0;

	var dragEventsNotSupported = !$.CrushFTP.browserSupportsDND();
	//Get val type
	$.CrushFTP.getType = function(val) {
		if (val === null) return "[object Null]";
		return Object.prototype.toString.call(val);
	}

	$.CrushFTP.getActionResponseText = function(msg) {
		var responseText = '';
		try {
			var msgs = msg.getElementsByTagName("commandResult");
			for (var x = 0; x < msgs.length; x++) {
				responseText += IE(msgs[x].getElementsByTagName("response")[0]).textContent;
			}
		} catch (ex) {}
		return responseText;
	}

	$.CrushFTP.attachDND = function(o)
	{
		$.CrushFTP.Options = o;
		css_browser_selector(navigator.userAgent);
		/* added by carlos */
		browseFileButtonPanel.find("#browseFileButton").unbind().click(function(){
			if (!$(document).data("appletLoaded")) return false;
			var curElem = $("<a>");
			curElem.crushFtpLocalFileBrowserPopup({
				type : 'both',
				singleSelection : false,
				useApplet : window["currentApplet"],
				callback : function(arr){
					window.handleAppletDNDCustom(arr);
					/* added by carlos */
					var overwriteDialog = $('#uploadOptionsDialog_ow').val();
					if( overwriteDialog == "OVERWRITE" || overwriteDialog == "ASK" ) {
						setTimeout(function () {
							fileRepo.find("ul").find("a.overwriteLink").trigger("click");
						}, 200);
					}
				}
			});
			return false;
		});
		/*if(is_MacOs)
		{
			browseFileButtonPanel.find("#browseFileButton").unbind().click(function(){
				if (!$(document).data("appletLoaded")) return false;
				var curElem = $("<a>");
	            curElem.crushFtpLocalFileBrowserPopup({
	                type : 'both',
	                singleSelection : false,
	                useApplet : window["currentApplet"],
	                callback : function(arr){
	                    window.handleAppletDNDCustom(arr);
	                }
	            });
	            return false;
	        });
		}
		else
		{
			browseFileButtonPanel.find("#browseFileButton").unbind().click(function(){
				if (!$(document).data("appletLoaded") || !$.CrushFTP.browseAdvanced) return false;
				window.command_id = runAppletCommand(true, "COMMAND=BROWSE:::TITLE=" + getLocalizationKeyExternal("advancedUploadItemsSelectionWindowTitle"), true);
				function getBrowseSelection() {
					var result = {};
					if (typeof window.currentApplet != "undefined") result = window.currentApplet.getASyncResult(window.command_id);
					else {
						alert(getLocalizationKeyExternal("AppletLoadingFailedMsgText"));
						return false;
					}
					if (result) {
						window.handleAppletDND(result);
						var overwriteDialog = $('#uploadOptionsDialog_ow').val();
						if( overwriteDialog == "OVERWRITE" || overwriteDialog == "ASK" ) {
							setTimeout(function () {
								fileRepo.find("ul").find("a.overwriteLink").trigger("click");
							}, 200);
						}
					} else {
						if ($.CrushFTP.getType(result).toLowerCase().indexOf("string") < 0) {
							setTimeout(function () {
								getBrowseSelection();
							}, 200);
						}
					}
				}
				getBrowseSelection();
			});
		}*/

		var browseTypeSelector = $("#browseTypeSelector").unbind().click(function(){
			var cluetipTitle = $("#cluetip-title");
			$("#cluetip").hide();
			if($(this).hasClass("normal"))
			{
				switchUploadType("advanced", $(this));
				var tipInfo = $(this).data('thisInfo');
				if(tipInfo)
				{
					var _title = locale.fileupload.SwitchToNormalUpload;
					$(this).data('thisInfo', {title: _title, zIndex: tipInfo.zIndex});
					cluetipTitle.html(_title);
				}
				if(window.useNewUpload)
				{
					var tgl = $("#toggleUploadPanel:visible").click();
					var tglF = $('#toggleFileList:visible').click();
					if(tgl.length>0){
						setTimeout(function(){
							viewFileQueue.click();
						}, 500);
					}
				}
			}
			else
			{
				var tglF = $('#toggleFileList:visible').click();
				if(window.useNewUpload)
				{
					var tgl = $("#toggleUploadPanel:visible").click();
				}
				switchUploadType("normal", $(this));
				var tipInfo = $(this).data('thisInfo');
				if(tipInfo)
				{
					var _title = locale.fileupload.SwitchToAdvancedUpload;
					$(this).data('thisInfo', {title: _title, zIndex: tipInfo.zIndex});
					cluetipTitle.html(_title);
				}
				if(window.useNewUpload)
				{
					var tgl = $("#toggleUploadPanel:visible").click();
					viewFileQueue.click();
					if(tgl.length>0){
						setTimeout(function(){
							window.showUploadPanel();
						}, 500)
					}
				}
			}
			$(this).blur();
			return false;
		});

		bindAppletDND();
		switchUploadType(browseTypeSelector.hasClass("normal") ? "normal" : "", browseTypeSelector);
		fileRepo.draggable({
			handle : ".fileListHeader"
		});

		$.CrushFTP.removeInvalidFiles = function()
		{
			setTimeout(function(){
				fileRepo.find("li:not(.formProcessed)").remove();
			}, 300);
		}

		var pos = $(document).width() < 1000 ? { at: "left top", of: window } : {};

		$.CrushFTP.uploadInfoFormDialog = $("#uploadInfoForm").dialog({
			autoOpen: false,
			width: 800,
			title: getLocalizationKeyExternal("UploadFormHeaderText"),
			zIndex : 1100,
			modal: true,
			resizable: false,
			// position: pos,
			closeOnEscape: false,
			buttons: [
				{
					id:"cancel",
					text: getLocalizationKeyExternal("UploadFormCancelButtonText"),
					click : function(){
						if(window.useNewUpload){
							var formDataMissing = crushUpload.formDataMissing();
							if(formDataMissing && formDataMissing.length>0){
								var _confirm = getLocalizationKeyExternal("uploadConfirmCancelUploadAfterFormText") || "Are you sure you wish to cancel upload for last selected {count} item(s)?";
								_confirm = _confirm.replace("{count}", formDataMissing.length);
								if(confirm(_confirm))
								{
									if(window.commonUploadFormShown)
										window.commonUploadFormShown = false;
									crushUpload.removeFormDataMissing();
									$(this).dialog("close");
								}
							}
							else{
								$(this).dialog("close");
							}
						}
						else{
							var notProcessed = fileRepo.find("li:not(.formProcessed)");
							var elem = $.CrushFTP.uploadInfoFormDialog.data("elem");
							if(!elem || (elem && elem.hasClass('being-edited') && !elem.hasClass('form-data-added')))
							{
								// if(elem && elem.hasClass('being-edited'))
								// {
								// 	notProcessed = fileRepo.find("li.being-edited");
								// }
								if(notProcessed.length>0)
								{
									var _confirm = getLocalizationKeyExternal("uploadConfirmCancelUploadAfterFormText") || "Are you sure you wish to cancel upload for last selected {count} item(s)?";
									_confirm = _confirm.replace("{count}", notProcessed.length);
									if(confirm(_confirm))
									{
										notProcessed.each(function(){
											$(this).find(".cancelUpload").trigger("click");
										});
										$(this).dialog("close");
										if(fileRepo.find("li").length==0)
											window.commonUploadFormShown = false;
										if(fileRepo.find(".per-file-form-new").length>0 && !$.CrushFTP.customFormWindowClose){
											fileRepo.find(".per-file-form-new:first").removeClass('per-file-form-new').addClass('being-edited').find(".editForm").click();
										}
									}
								}
								else
									$(this).dialog("close");
							}
							else
								$(this).dialog("close");
						}
						return false;
					}
				},
				{
					id:"ok",
					text: getLocalizationKeyExternal("UploadFormOkButtonText"),
					click: function() {
						var that = $(this);
						if (validateForm(false, $.CrushFTP.uploadInfoFormDialog.find(".customForm")))
						{
							var formData = serializeForm($.CrushFTP.uploadInfoFormDialog.find("form")[0], true);
							var elem = $.CrushFTP.uploadInfoFormDialog.data("elem");
							if($.CrushFTP.uploadInfoFormDialog.data("commonForm"))
							{
								$.CrushFTP.uploadInfoFormDialog.find("form").submit();
								$(this).dialog("close");
								$.CrushFTP.onCommonUploadFormSubmitted(formData);
							}
							else
							{
								if(window.useNewUpload){
									$.CrushFTP.savePerFileFormData(formData, $.CrushFTP.uploadInfoFormDialog.data("currentItem"));
									if($("#useUploadFormForAll", $.CrushFTP.uploadInfoFormDialog).is(":checked") && !$.CrushFTP.uploadFormInfo)
									{
										$.CrushFTP.uploadInfoFormDialog.removeData("currentItem");
										var currentItems = $.CrushFTP.uploadInfoFormDialog.data("currentItems");
										if(currentItems)
										{
											for (var i = 0; i < currentItems.length; i++) {
												var item = currentItems[i];
												if(!item.formData)
												{
													$.CrushFTP.savePerFileFormData(formData, item);
												}
											}
										}
										$.CrushFTP.uploadInfoFormDialog.removeData("currentItems");
										$(this).dialog("close");
									}
									$.CrushFTP.uploadInfoFormDialog.removeData("currentItem");
									var currentItems = $.CrushFTP.uploadInfoFormDialog.data("currentItems");
									var emptyItemIndex;
									if(currentItems)
									{
										for (var i = 0; i < currentItems.length; i++) {
											var item = currentItems[i];
											if(!item.formData)
											{
												emptyItemIndex = i;
												i = currentItems.length;
											}
										}
									}
									$.CrushFTP.uploadInfoFormDialog.find("form").submit();
									if(typeof emptyItemIndex != "undefined")
									{
										if($(document).data("commonUploadFormHTML"))
										{
											var nextItem = $.CrushFTP.uploadInfoFormDialog.find(".nextFormItem");
											if(!nextItem.hasClass('disabled'))
											{
												nextItem.trigger("click");
												setTimeout(function(){
													$.CrushFTP.uploadInfoFormDialog.find("input:visible:first").focus();
												});
												return false;
											}
											else{
												$.CrushFTP.uploadInfoFormDialog.removeData("currentItems");
												$(this).dialog("close");
											}
										}
										else{
											$.CrushFTP.uploadInfoFormDialog.removeData("currentItems");
											$(this).dialog("close");
											$.CrushFTP.showUploadFormAdvanced(false, emptyItemIndex, currentItems);
										}
									}
									else{
										$.CrushFTP.uploadInfoFormDialog.removeData("currentItems");
										$(this).dialog("close");
									}
								}
								else{
									if($("#useUploadFormForAll", $.CrushFTP.uploadInfoFormDialog).is(":checked") && !$.CrushFTP.uploadFormInfo)
									{
										$.CrushFTP.uploadFormInfo = formData;
										if($.CrushFTP.uploadFormInfo)
										{
											var elem = fileRepo.find("li:not(.formProcessed)").addClass("formProcessed");
											$.CrushFTP.storeUploadFormDataToItems($.CrushFTP.uploadFormInfo, elem, true);
										}
									}
									else{
										if(!$.CrushFTP.uploadInfoFormDialog.data("commonForm"))
										{
											$.CrushFTP.storeUploadFormDataToItems(formData, elem.addClass('formProcessed').removeClass('being-edited').addClass('form-data-added').removeClass('per-file-form-new'));
										}
										if($(document).data("commonUploadFormHTML"))
										{
											elem.removeClass('being-edited').addClass('form-data-added').removeClass('per-file-form-new');
										}
									}
									$.CrushFTP.uploadInfoFormDialog.removeData("elem");
									$.CrushFTP.uploadInfoFormDialog.find("form").submit();
									$(this).dialog("close");
									if($.CrushFTP.customFormWindowClose && elem)
									{
										elem.removeClass('being-edited');
									}

									if(fileRepo.find(".per-file-form-new").length>0 && !$.CrushFTP.customFormWindowClose && fileRepo.find("li:not(.formProcessed)").length>0){
										fileRepo.find(".per-file-form-new:first").removeClass('per-file-form-new').addClass('being-edited').find(".editForm").click();
									}
								}
							}
						}
					}
				}
			],
			open: function(){
				$(".ui-dialog-titlebar-close").hide();
				var dialogPrnt = $.CrushFTP.uploadInfoFormDialog.parent();
				dialogPrnt.css("zIndex", 1101).next().css("zIndex", 1100)
				dialogPrnt.find(".ui-dialog-title:first").text(getLocalizationKeyExternal("UploadFormHeaderText"));
				dialogPrnt.find("button#cancel").text(getLocalizationKeyExternal("UploadFormCancelButtonText"));
				dialogPrnt.find("button#ok").text(getLocalizationKeyExternal("UploadFormOkButtonText"));
				if(window.useNewUpload && $.CrushFTP.uploadInfoFormDialog.data("currentItem")){
					var formData = $.CrushFTP.getCurrentItemFormData($.CrushFTP.uploadInfoFormDialog.data("currentItem").id);
					if(formData)
					{
						window.bindDataToForm($.CrushFTP.uploadInfoFormDialog, formData);
					}
				}
				else{
					var elem = $.CrushFTP.uploadInfoFormDialog.data("elem");
					if(elem)
					{
						var formData = elem.data("formData");
						if(formData)
						{
							window.bindDataToForm($.CrushFTP.uploadInfoFormDialog, formData);
						}
						if(fileRepo.find("li:not(.formProcessed)").length<1)
							$.CrushFTP.uploadInfoFormDialog.find("#uploadFormDataCheckbox").hide();
					}
				}
				if($.CrushFTP.showingCommonUploadForm && $.CrushFTP.commonUploadFormDataSerialized)
				{
					var formData = $.CrushFTP.commonUploadFormDataSerialized;
					if(formData)
					{
						window.bindDataToForm($.CrushFTP.uploadInfoFormDialog, formData);
					}
				}
				setTimeout(function(){
					$.CrushFTP.uploadInfoFormDialog.find("input, select, textarea").unbind("change").change(function(){
						$.CrushFTP.uploadInfoFormDialog.find("#meta_unique_upload_id").val(generateRandomPassword(4));
					});
				}, 100);
				$.CrushFTP.uploadInfoFormDialog.parent().addClass("uploadDialog").find(".ui-widget-header").addClass("uploadFormHeader");
				if($(document).width() < 1000)
				{
					setTimeout(function(){
						$.CrushFTP.uploadInfoFormDialog.dialog("moveToTop");
						$.CrushFTP.uploadInfoFormDialog.dialog("option", "position", { at: "left top" });
					}, 100);
				}
			},
			close : function(){
				if($.CrushFTP.showFileRepo)
				{
					$.CrushFTP.showFileRepo = false;
					$("#fileRepo").show().trigger("visibilityChange");
				}

				setTimeout(function(){
					if(!$.CrushFTP.uploadInfoFormDialog.is(":visible")){
						if(window.crushUpload){
							window.crushUpload.addedFilesProcessed();
						}
					}
				}, 1000);

				//setTimeout(function(){
				$.CrushFTP.uploadInfoFormDialog.removeData("elem");
				//}, 1000);
			}
		});

		function switchUploadType(type, elm)
		{
			if(type == "normal")
			{
				// added by carlos
				$('#advanceduploadOptions, #javaLogButton').css('visibility', 'hidden');
				if(javalogTimer) {
					clearInterval(javalogTimer);
				}
				bindNativeDND();
				elm.removeClass("advanced").addClass("normal").find("span.type").text("Normal");
				browseFileButtonPanel.find("input").show();
				$.CrushFTP.browseAdvanced = false;
				if(dragEventsNotSupported)
				{
					 $(document).unbind('dragover');
				}
				window.cancelDropAction(true);
				javaAppletDiv.css({
					"position": "absolute",
					"left" : "-5000px"
				});
			}
			else
			{
				// added by carlos
				$('#advanceduploadOptions, #javaLogButton').css('visibility', 'visible');
				if(!javalogTimer) {
					javalogTimer = setInterval(function(){
						var result = runAppletCommand(true, "COMMAND=LOG");
						$('#javalog_area').val($('#javalog_area').val()+result);
						$("#javalog_area").animate({
							scrollTop:$("#javalog_area")[0].scrollHeight - $("#javalog_area").height()
						},10);
					}, 5000);
				}
				$(".appletNote").show();
				bindNativeDND(!is_MacOs);
				$.CrushFTP.browseAdvanced = true;
				elm.removeClass("normal").addClass("advanced").find("span.type").text("Advanced");
				browseFileButtonPanel.find("input").hide();
				if (!$.CrushFTP.appletDNDAdded)
				{
					$.CrushFTP.appletDNDAdded = true;
					elm.parent().append("<span class='spinner' style='display: inline-block;padding-left: 20px;float: left;top: 5px;position: relative;margin: 0px 6px;'>Loading...</span>");
					$("#javaAppletDiv").css({
							"right" : "10px",
							"left" : "auto"
						});
					loadApplet(true, function (pnl) {
						if(pnl)
						{
							elm.parent().find("span.spinner").remove();
							if (dragEventsNotSupported) {
								window.showDropArea();
								$(window).bind("resize", function () {
									window.showDropArea();
								});
								setTimeout(listenAppletDrop, 500);
							}
							else
								$("#javaAppletDiv").css("left", "-5000px");
						}
						else
						{
							elm.parent().find("span.spinner").remove();
							$.CrushFTP.appletDNDAdded = false;
							var linkSwitch = $("#browseTypeSelector");
							var tipInfo = $(this).data('thisInfo');
							var zIndex = 9999;
							if(tipInfo)
							{
								zIndex = tipInfo.zIndex;
							}
							linkSwitch.cluetip("destroy");
							var cluetipTitle = $("#cluetip-title");
							var _title = locale.fileupload.SwitchToAdvancedUpload;
							linkSwitch.attr("title", _title).data('thisInfo', {title: _title, zIndex: zIndex});
							cluetipTitle.html(_title);
							switchUploadType("normal", elm);
							setTimeout(function() {
								linkSwitch.cluetip({
									splitTitle: '^',
									showTitle: false,
									width: 'auto',
									cluetipClass: 'default',
			                        clickThrough : true,
									arrows: true,
									tracking: true,
									positionBy: 'mouse',
									mouseOutClose: true,
									dropShadowSteps: 0,
									dynamicLeftOffset: true
								});
							}, 100);
						}
					}, false, elm.parent());
				}
				else
				{
					if(dragEventsNotSupported && !is_MacOs)
					{
						window.showDropArea();
						javaAppletDiv.css({
							"position": "fixed",
							"margin": "0px",
							"padding": "0px",
							"right" : "0px",
							"left" : "auto"
						});
					}
				}
			}
		}

		function bindNativeDND(disableDragOver){
			if(disableDragOver)
			{
				if(!$.CrushFTP)
					$.CrushFTP = {};
				if($("#fileupload").crushftp_DNDUpload)
					$.CrushFTP.uploadElem = $("#fileupload").crushftp_DNDUpload({disableDragOver : true});
			}
			else
			{
				var dropItemsPanel = $("#dropItemsPanel");
				var fileQueueInfo = $("#fileQueueInfo");
				$.CrushFTP.uploadElem = $("#fileupload").crushftp_DNDUpload({
					fileuploaddropEvent : function(e, data)
					{
						var target = $(e.target);
						if(window.useNewUpload){
							// if(e && e.dataTransfer && window.crushUpload)
							// 	crushUpload.addFiles(data, e);
							// else
							// 	crushUpload.addFiles(data);
							e.stopPropagation();
							e.preventDefault();
							return false;
						}
						processAddedFiles(target, data, false, true);
						e.stopPropagation();
					},
					documentDragEvent : function(e)
					{
						if(window.disableDragDropUpload){
							e.stopPropagation();
							e.preventDefault();
							return false;
						}
						if(!detectIE())
						{
							try{
								var temp = (e.originalEvent || e).dataTransfer;
							    var hasFiles = (temp && (temp = temp.types) && temp.has('Files')) || (temp.files || temp.items);
							    if(!hasFiles)
							    	return;
							}catch(ex){}
						}
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
				            return;
				        }
						if(window.crushUpload){
							window.showUploadPanel();
							return;
						}
						if(!window.draggingOut)
						{
							dropItemsPanel.show();
							if(dropItemsPanel.hasClass("stick"))
								fileQueueInfo.css("z-index", 0);
						}
					},
					documentDropEvent : function(e)
					{
						if(window.disableDragDropUpload){
							e.stopPropagation();
							e.preventDefault();
							return false;
						}
						dropItemsPanel.hide();
						if(dropItemsPanel.hasClass("stick"))
							fileQueueInfo.css("z-index", 98);
					},
					fileuploadadded : function(e, data)
					{
						if(window.useNewUpload){
							return false;
						}
						$.CrushFTP.buildQueueInfo();
						fileRepo.find(".dirNoWritable").each(function(){
							$(this).closest("li").find("a.cancelUpload").trigger("click");
						});
						var dirsAddedButNotAllowed = false;
						fileRepo.find(".blockUploadingDirs").each(function(){
							dirsAddedButNotAllowed = true;
							$(this).closest("li").find("a.cancelUpload").trigger("click");
						});
						if(dirsAddedButNotAllowed)
						{
							$.growlUI(getLocalizationKeyExternal("AdvancedUploadDirNotAllowedText"), getLocalizationKeyExternal("AdvancedUploadDirNotAllowedDescText"), true, "growlError");
						}
						if(data.files[0] && !data.files[0].error && !$.CrushFTP.uploadFormInfo)
							$.CrushFTP.showUploadForm();

						if($.CrushFTP.uploadFormInfo)
						{
							var elem = fileRepo.find("li:not(.formProcessed)").addClass("formProcessed");
							$.CrushFTP.storeUploadFormDataToItems($.CrushFTP.uploadFormInfo, elem, true);
						}
						$.CrushFTP.showIconsForFiles();
						$.CrushFTP.handleWarnings();
					},
					fileuploadchange : function(e, data)
					{
						if(!data || !data.files)return;
						if(window.useNewUpload){
							if(e && e.dataTransfer && window.crushUpload)
								crushUpload.addFiles(e);
							else if(window.crushUpload)
								crushUpload.addFiles(data);
							return false;
						}
						processAddedFiles(false, data);
						$.CrushFTP.buildQueueInfo();
						e.stopPropagation();
					},
					fileuploaddestroyed : function(e, data)
					{
						$.CrushFTP.buildQueueInfo();
					}
				});
				if(window.useNewUpload){
					var dropZone = $('#dropItemsPanel').get(0);
					dropZone.addEventListener('drop', function(e) {
		                crushUpload.addFiles(e);
		            });
				}
			}
		}

		function bindAppletDND()
		{
			//Show drop area on upload window
			window.showDropArea = function () {
				if (!$(document).data("appletLoaded")) return false;
				if(dragEventsNotSupported || is_MacOs)return;
				javaAppletDiv.css({
					"position": "fixed",
					"margin": "0px",
					"padding": "0px",
					"right" : "0px",
					"left" : "auto"
				});
				javaAppletDiv.addClass('dragOver');
			}

			//Cancel drop action
			window.cancelDropAction = function (ignoreBrowser) {
				if (dragEventsNotSupported && !ignoreBrowser) return false; //IE issue fix
				javaAppletDiv.css({
					"position": "absolute",
					"left" : "-5000px"
				});
			}

			window.listenAppletDrop = function(){
				if($.CrushFTP.browseAdvanced)
				{
					var s = runAppletCommand(true, "COMMAND=DND:::");
					if (s && s != "") {
						handleAppletDND(s);
						while (s != "") {
							s = runAppletCommand(true, "COMMAND=DND:::");
							if (s && s != "") {
								handleAppletDND(s);
							}
						}
						window.cancelDropAction();
					}
				}
				if(!dragEventsNotSupported)
				{
					if (new Date() - $(document).data("dndActiveAt") > 1000)
						window.cancelDropAction();
					else
						setTimeout(listenAppletDrop, 500);
				}
				else
					setTimeout(listenAppletDrop, 500);
			}

			//Parse java properties
			window.parseJavaProps = function(s) {
				var o = {};
				if (s) {
					var item_props = s.split(":::");
					for (var xx = 0; xx < item_props.length; xx++) {
						o[item_props[xx].substring(0, item_props[xx].indexOf("="))] = item_props[xx].substring(item_props[xx].indexOf("=") + 1); //set the key, and value on the o object
					}
				}
				return o;
			}

			window.handleAppletDND = function(result)
			{
				result = result + ""; //need to conver this JavaRuntimeObject to a String
				var destinationPath = hashListener.getHash().toString().replace("#", "") || "/";
				var itemList = new Array();
				var items = result.split(";;;");
				for (var x = 0; x < items.length; x++) {
					var o = parseJavaProps(items[x]);
					if(o && o.name)
					{
						o.destinationPath = destinationPath;
						o.fromApplet = true;
						o.sourcePath = o.path;
						o.size = parseFloat(o.size);
						if(o.type && o.type.toLowerCase() == "dir" && window.blockUploadingDirs)
						{
							$.growlUI(getLocalizationKeyExternal("AdvancedUploadDirNotAllowedText"), getLocalizationKeyExternal("AdvancedUploadDirNotAllowedDescText"), true, "growlError");
						}
						else
						{
							itemList[itemList.length] = o;
						}
					}
				}
				if (itemList.length > 0) {
					processAddedFiles(fileRepo, {files : itemList}, true);
				}
			}

			window.handleAppletDNDCustom = function(items)
			{
				/* added by carlos close advanced options if the user select a file */
                if( $("#uploadOptionsDialog").dialog("isOpen") ) {
                    $("#uploadOptionsDialog").dialog("close");
                }
				var destinationPath = hashListener.getHash().toString().replace("#", "") || "/";
				var itemList = new Array();
				for (var x = 0; x < items.length; x++) {
					var o = items[x];
					if(o && o.name)
					{
						o.destinationPath = destinationPath;
						o.fromApplet = true;
						o.sourcePath = o.path;
						o.size = parseFloat(o.size);
						if(o.type && o.type.toLowerCase() == "dir" && window.blockUploadingDirs)
						{
							$.growlUI(getLocalizationKeyExternal("AdvancedUploadDirNotAllowedText"), getLocalizationKeyExternal("AdvancedUploadDirNotAllowedDescText"), true, "growlError");
						}
						else
						{
							itemList[itemList.length] = o;
						}
					}
				}
				if (itemList.length > 0) {
					processAddedFiles(fileRepo, {files : itemList}, true);
				}
			}

			if(!dragEventsNotSupported && !is_MacOs)
			{
				addEvent($(document), "dragenter", function (e) {
					if($.CrushFTP.browseAdvanced)
					{
						$(document).data("dndActiveAt", new Date() * 1);
						if (e.preventDefault) e.preventDefault();
						if (!$(document).data("appletLoaded")) {
							$.growlUI(getLocalizationKeyExternal("JavaAppletNotLoadedGrowlText"), getLocalizationKeyExternal("JavaAppletNotLoadedDescGrowlText"), o.GrowlTimeout, "growlError", o.GrowlWithCloseButton);
							return false;
						}
						window.showDropArea();
						setTimeout(listenAppletDrop, 500);
					}
					return false;
				});

				addEvent($(document), "dragover", function cancel(e) {
					if($.CrushFTP.browseAdvanced)
					{
						$(document).data("dndActiveAt", new Date() * 1);
						if (e.preventDefault) e.preventDefault();
					}
					return false;
				});

				addEvent($(document), "drop", function (e) {
					if($.CrushFTP.browseAdvanced)
					{
						if (e.preventDefault) e.preventDefault();
						window.cancelDropAction(true);
					}
					return false;
				});
			}
		}

		function isFileBigger(size) {
			if(!size) return false;
			var sizeInMB = size / 1024 / 1024;
			if(!$.CrushFTP.maxFileSizeAllowedInNormalUploadInMB) return false;

			if(sizeInMB<=$.CrushFTP.maxFileSizeAllowedInNormalUploadInMB)
				return false;
			else
				return true;
		}

		function doesFileSizeExceedAllowedSize(size) {
			if(!size) return false;
			var sizeInMB = size / 1024 / 1024;
			if(!window.maxFileSizeAllowed) return false;

			if(sizeInMB<=window.maxFileSizeAllowed)
				return false;
			else
				return true;
		}

		$.CrushFTP.doesFileSizeExceedAllowedSize = doesFileSizeExceedAllowedSize;
		$.CrushFTP.doesFileSizeExceed = hasReachedQuota;
		$.CrushFTP.doesFileNameSizeExceed = doesFileNameSizeExceed;

		function doesFileNameSizeExceed(name){
			if(!window.maxFileNameLengthInUpload)
				return true;
			return name.length <= window.maxFileNameLengthInUpload;
		}

		function hasReachedQuota(size)
		{
			if(!size) return false;
			var sizeInMB = size / 1024 / 1024;
			if(window.quotaBytes)
			{
				var availableMBs = window.quotaBytes / 1048576;
				if(availableMBs<0)
					availableMBs = 0;
				if(sizeInMB<=availableMBs)
					return false;
				else
					return true;
			}
			else
				return false;
		}

		function renderTemplate(func, files) {
            if (!func) {
                return $();
            }
            var result = func({
                files: files,
                formatFileSize: $.CrushFTP.formatBytes
            });
            if (result instanceof $) {
                return result;
            }
            return result;
        }

        function getAltNameForIOS(name, file)
        {
        	var postFix = 0;
        	if($.CrushFTP.checkFileExistOnServer(name, escape(file._path)))
        	{
        		if($.CrushFTP.lastDirCheckedForiOSIncrement != file._path)
        		{
        			$.CrushFTP.lastDirCheckedForiOSIncrement = file._path;
        			var items = [];
        			for (var i = l.length - 1; i >= 0; i--) {
        				if(l[i].name.indexOf("image")>=0)
        				{
        					var numb = l[i].name.match(/\d/g);
        					if(numb)
        					{
								numb = numb.join("");
	        					items.push(numb);
        					}
        				}
        			};
        			if(items.length>0)
        			{
        				items = items.sort(function(a,b){return b-a});
        				postFix = parseInt(items[0]) + 1;
        			}
        			else
        			{
        				if(typeof $.CrushFTP.lastiOSIncrement != "undefined")
        					postFix = $.CrushFTP.lastiOSIncrement + 1;
        			}
        		}
        		else
        		{
        			if(typeof $.CrushFTP.lastiOSIncrement != "undefined")
        				postFix = $.CrushFTP.lastiOSIncrement + 1;
        		}
        	}
        	else if(fileRepo.find("li[filename*='image']:first").length>0)
        	{
        		var items = [];
        		fileRepo.find("input[value='"+file._path+"']").closest("li[filename*='image']").each(function(){
					var numb = unescape($(this).attr("filename")).match(/\d/g);
					if(numb)
					{
						numb = numb.join("");
						items.push(numb);
					}
        		});
        		if(items.length>0)
    			{
    				items = items.sort(function(a,b){return b-a});
    				postFix = parseInt(items[0]) + 1;
    			}
    			else
    			{
    				if(typeof $.CrushFTP.lastiOSIncrement != "undefined")
    					postFix = $.CrushFTP.lastiOSIncrement + 1;
    			}
        	}
        	else if(typeof $.CrushFTP.lastiOSIncrement != "undefined")
    			postFix = $.CrushFTP.lastiOSIncrement + 1;
        	$.CrushFTP.lastiOSIncrement = postFix;
        	return postFix;
        }

		var tmplFn = tmpl("template-upload");
		function processAddedFiles(target, data, applet, isDropped)
		{
			var path = "";
			var privs = $(document).data("folderPrivs");
			if(!target) target = $();
			if(!target.hasClass("dropzone"))
			{
				target = target.closest(".dropzone");
			}
			if(target.hasClass("directoryThumb"))
			{
				path = target.find("a.imgLink").attr('rel').match(/.*\//);
				if(target.data("dataRow")){
					privs = target.data("dataRow").privs.toString();
				}
			}
			else if(target.hasClass("directoryTree"))
			{
				path = target.find("a:first").attr('rel').match(/.*\//);
				privs = target.attr("privs");
			}
			else{
				var destinationPath = encodeURIComponent(hashListener.getHash().toString().replace("#", ""));
				destinationPath = destinationPath || "/";
				path = destinationPath;
			}
			var _write = privs.indexOf("(write)")>=0;
			var hasError = false;
			var _count = fileRepo.find("li:not(.uploaded)").length;
			var _maxFilesInQueue = 0;
			var _maxQueueCountReached = false;
			if(typeof window.maxFilesInQueue != "undefined"){
				_maxFilesInQueue = parseInt(window.maxFilesInQueue);
			}
			$.each(data.files, function (index, file) {
				_count++;
				file.privs = privs;
				var _fileName = file.name;
				if(!applet)
				{
					file._path = unescape(unescape(path));
					var noDir = false;
					if(file.relativePath && file.relativePath != "")
					{
						if(window.blockUploadingDirs)
						{
							noDir = true;
							file.error = "blockUploadingDirs";
							hasError = true;
						}
						else
							file._path = file._path + file.relativePath;
					}
					if(!noDir)
						file.FullPath = escape(file._path + _fileName);
				}
				else
				{
					file._path = file.path = unescape(file.destinationPath);
					file.FullPath = escape(file.destinationPath + _fileName);
				}
				file.isDropped = isDropped;
				if($.CrushFTP.iOS)
				{
					if(_fileName.toLowerCase().indexOf("image")>=0)
					{
						var altName = getAltNameForIOS(_fileName, file);
						var name = _fileName;
						var arr = name.split(".");
						if(arr.length>1)
							arr[arr.length-2] = arr[arr.length-2] + "_" + altName;
						else
							arr[0] = arr[0] + "_" + altName;
						_fileName = file.altName = arr.join(".");
						file.FullPath = escape(file._path + file.altName);
					}
				}

				if(typeof file.curCount == "undefined")
				{
					file.curCount = $.CrushFTP.fileCount;
					$.CrushFTP.fileCount+=1;
				}
				if(!$.CrushFTP.iOS && fileRepo.find("li[fullPath='"+file.FullPath+"']").length>0)
				{
					file.error = "fileAvailableInSelectedFolder";
					hasError = true;
				}
				else if(!$.CrushFTP.isFileTypeAllowed(_fileName))
				{
					file.error = "acceptFileTypes";
					hasError = true;
				}
				else if($.CrushFTP.checkFileExistOnServer(_fileName, escape(file._path)))
				{
					if($.CrushFTP.browseAdvanced && $('#resumeUpload_AppletConfig').is(":checked"))
					{
						file.warning = false;
					}
					else
						file.warning = "fileExistOnServer";
				}
				if(!applet && file.size)
				{
					if(isFileBigger(file.size))
					{
						file.alert = "fileBiggerThanAllowed";
					}
				}
				if(file.size)
				{
					if(hasReachedQuota(file.size))
					{
						file.error = "hasReachedQuota";
						hasError = true;
					}
				}
				if(!_write)
				{
					file.error = "dirNoWritable";
					hasError = true;
				}
				if(_maxFilesInQueue)
				{
					if(_count>_maxFilesInQueue)
					{
						delete data.files[index];
						_maxQueueCountReached = true;
					}
				}

				if(!hasError && window.customFileValidationMethod)
				{
					file.waiting = true;
					window.customFileValidationMethod(file, function(error){
						var elem = fileRepo.find("li[fullPath='"+file.FullPath+"']")
						if(error){
							error = locale.fileupload.errors[error] || error;
							elem.removeClass('waiting ui-state-disabled').addClass('hasError ui-state-highlight');
							elem.find(".upload-buttons").find(".start, .startUpload, .formEdit, .overwrite").hide();
							elem.find(".error").remove();
							elem.find(".upload-buttons").append('<div class="clear"></div><span class="error">'+error+'</span>');
						}
						else
						{
							elem.removeClass('waiting ui-state-disabled');
						}
					});
				}
			});
			if(_maxQueueCountReached)
			{
				var maxQueueErrorTitle = getLocalizationKeyExternal("MaxUploadQueueCountReachedGrowlText") || "Max items count to upload in a queue reached";
				$.growlUI("Error", maxQueueErrorTitle, o.GrowlTimeout, "growlError");
			}
			if(!_write)
			{
				$.growlUI(getLocalizationKeyExternal("NoUploadInDirGrowlText"), getLocalizationKeyExternal("NoUploadInDirGrowlDesc") + "<br/>" + unescape(path), o.GrowlTimeout, "growlError");
			}
			else if(applet)
			{
				if(hasError)
					data.files.valid = false;
				else
					data.files.valid = true;
				var tempVar = [$.extend({}, data.files[0])];
				var names = [];
				var size = 0;
				var filePaths = "";
				for(var i=0;i<data.files.length;i++)
				{
					if(data.files[i])
					{
						if(data.files[i].name)
						{
							names.push(data.files[i].name);
						}
						if(data.files[i].size)
						{
							size += data.files[i].size;
						}
						if(data.files[i].sourcePath)
						{
							var j = i+1;
							filePaths += ":::P" + j + "=" + data.files[i].sourcePath;
						}
					}

				}
				names = names.join(", ");
				if(names.length>50)
					names = names.substr(0, 30) + "..." + names.substr(names.length-15, names.length);
				tempVar[0].name = names;
				tempVar[0].size = size;
				tempVar[0].isGroup = data.files.length>1;
				tempVar[0].totalCount = data.files.length;
				tempVar[0].sourcePath = filePaths;
				var html = $(renderTemplate(tmplFn, tempVar));
				var newItems = $(html);
				fileRepo.find("ul").append(newItems);
				var curIndex = 0;
				newItems.each(function(){
					if($(this).is("li"))
					{
						if(data.files.length == 1)
							$(this).data("fileInfo", data.files[curIndex]).attr("uid", generateRandomPassword(8));
						else
							$(this).data("fileInfo", tempVar[0]).attr("uid", generateRandomPassword(8));
						curIndex+=1;
					}
				});
				fileRepo.find(".dirNoWritable").each(function(){
					$(this).closest("li").find("a.cancelUpload").trigger("click");
				});
				if(!data.files[0].error && !$.CrushFTP.uploadFormInfo)
					$.CrushFTP.showUploadForm();

				if($.CrushFTP.uploadFormInfo)
				{
					var elem = fileRepo.find("li:not(.formProcessed)").addClass("formProcessed");
					$.CrushFTP.storeUploadFormDataToItems($.CrushFTP.uploadFormInfo, elem, true);
				}
				$.CrushFTP.handleWarnings();
				$.CrushFTP.buildQueueInfo();
			}
		}
		/*Init code*/
		$.CrushFTP.bindUploadEvents();
		viewFileQueue.hover(function() {
			if($(this).hasClass("close"))
	        	$(this).stop().animate({ top: "0px" }, 200);
	       	else
	       		$(this).stop().animate({ top: "10px" }, 200);
	    },function(){
	        $(this).stop().animate({ top: "4px" }, 300);
	    });
	    fileRepo.bind("visibilityChange", function(){
			if(fileRepo.is(":visible"))
			{
				viewFileQueue.addClass("close");
				fileQueueInfo.removeClass("ui-widget-content ui-corner-all");
				$("#dndInfoTextHolder").addClass('expand');
				if(fileRepo.find("#fileUploadBar").length==0)
				{
					fileRepo.find("div.fileListHeader").after("<div class='fileuploadBarHolder ui-widget-content ui-corner-all'></div>");
					fileRepo.find("div.fileuploadBarHolder").append(fileUploadBar);
					fileRepo.find("div.fileuploadBarHolder").append("<div class='clear'></div>");
				}
				if(window.fileWindowAsDialog)
				{
					fileRepo.hide();
					$.blockUI({
						message: fileRepo,
						css: {
							width: '0px',
							height : '0px',
							padding : '0px',
							border : 'none',
							position: 'absolute',
							top: '25%',
							left : '50%',
							'margin-left' : '-420px',
							opacity: 1,
							'background-color': getPopupColorExternal(true)
						}
					});
				}
			}
			else
			{
				viewFileQueue.removeClass("close");
				$("#dndInfoTextHolder").removeClass('expand');
				if(fileUploadBarHolder.find("#fileUploadBar").length==0)
				{
					fileUploadBarHolder.append(fileUploadBar);
					fileQueueInfo.addClass("ui-widget-content ui-corner-all");
					fileRepo.find("div.fileuploadBarHolder").remove();
				}
			}
	    });
	}

	$.CrushFTP.refreshProgressInfo = function(elem){
		if(elem.hasClass("skipped"))
		{
			$.CrushFTP.processStatusOfUpload(elem, "error");
			return;
		}
		var isApplet = elem.hasClass("appletItem");
		$.CrushFTP.getUploadProgress(function(result){
			$.CrushFTP.updateProgressBar(elem, isApplet, result);
			var status = elem.data("uploadInfo").status;
			if(isApplet) status = elem.data("uploadInfo").statusApplet;
			$.CrushFTP.processStatusOfUpload(elem, status, result);
		}, elem, isApplet);
	}

	$.CrushFTP.showShareOptionForUploadedItem = function(elem)
	{
		if(fileRepo.find("a.shareUploadedItem").length>0)
			shareAllUploaded.show();
		else
			shareAllUploaded.hide();

		var privs = elem.attr("privs");
		if(!privs || typeof window.shareFile == "undefined")return;
		privs = unescape(privs);
		if(privs.toLowerCase().indexOf("(share)")>=0 && elem.find("a.shareUploadedItem").length==0)
		{
			var disableShareForUploadedItem = $(document).data("disableShareForUploadedItem");
			var reuploadLink = elem.find("a.startUpload:first");
			if(!disableShareForUploadedItem)
			{
				reuploadLink.parent().before("<div class='share block'><a href='javascript:void(0)' class='shareUploadedItem'>"+ locale.fileupload.share +"</a></div>");
				$.CrushFTP.showShareOptionForUploadedItem(elem);
				elem.find("a.shareUploadedItem").unbind().click(function(){
					var fileName = unescape(elem.attr("fileName"));
					var shareMethodUploadedItem = $(document).data("shareMethodUploadedItem");
					if(shareMethodUploadedItem && shareMethodUploadedItem.toLowerCase() == "quick")
					{
						window.quickShareFile(false, unescape(unescape(elem.attr("path"))) + fileName);
					}
					else
						window.shareFile(false, unescape(unescape(elem.attr("path"))) + fileName, fileName);
					$(this).blur();
					return false;
				});
			}
			if(fileRepo.find("li.uploaded").length>0)
				clearUploadedAll.show();
			else
				clearUploadedAll.hide();
		}
	}

	$.CrushFTP.processStatusOfUpload = function(elem, status, result)
	{
		if($.CrushFTP.abortingOngoingUpload){
			$.CrushFTP.abortingStatusCallbackqueue = $.CrushFTP.abortingStatusCallbackqueue || [];
			$.CrushFTP.abortingStatusCallbackqueue.push(function(){
				$.CrushFTP.processStatusOfUpload(elem, status, result);
			});
			return;
		}
		var progressInfo = elem.find("div.progressInfo");
		if(status == "completed")
		{
			if(elem.hasClass("appletItem"))
			{
				elem.removeClass("uploadProgress").addClass("uploaded").find("a.startUpload").text(locale.fileupload.reupload).show();
				elem.find('.clicked').removeClass('clicked');
				setTimeout(function(){
					elem.removeClass("uploadProgress").addClass("uploaded").find("a.startUpload").text(locale.fileupload.reupload).show();
					elem.find('.clicked').removeClass('clicked');
					if(elem.data("formData"))
						elem.find("a.editForm").parent().show();
					$.CrushFTP.showShareOptionForUploadedItem(elem);
					elem.find("a.pause").parent().hide();
					progressInfo.hide();
				}, 200);
			}
			else
			{
				elem.removeClass("uploadProgress").addClass("uploaded").find("a.startUpload").text(locale.fileupload.reupload).show();
				elem.find('.clicked').removeClass('clicked');
				$.CrushFTP.showShareOptionForUploadedItem(elem);
				if(elem.data("formData"))
					elem.find("a.editForm").parent().show();
				progressInfo.hide();
			}
			elem.removeClass('unzipping');
			globalProgressBar.removeClass('unzipping');
			progressInfo.find(".time,.speed,.status,.uploadStatusLabel").remove();
			var progressInfoHistory = $(elem).data("uploadInfo");
			if(progressInfoHistory && progressInfoHistory.avgSpeed && progressInfoHistory.timeElapsed)
			{
				elem.find("div.name").find(".uploadNote").remove();
				if(progressInfoHistory.avgSpeed == getLocalizationKeyExternal("BrowserUploaderSpeedTimeCalculatingText"))
					progressInfoHistory.avgSpeed = progressInfoHistory.currentSpeed;
				if(progressInfoHistory.avgSpeed == getLocalizationKeyExternal("BrowserUploaderSpeedTimeCalculatingText"))
				{
					elem.find("div.name").append("<div class='uploadNote'>(" + locale.fileupload.uploadedInLabelText + "" +progressInfoHistory.timeElapsed+")</div>");
				}
				else
				{
					var totalSize = progressInfoHistory.part2;
					var totalTimeInSec = progressInfoHistory.totalTimeInSec;
					var avgSpeed = $.CrushFTP.formatBytes(totalSize / totalTimeInSec) + "/s";
					elem.find("div.name").append("<div class='uploadNote'>(" + locale.fileupload.uploadedInLabelText + "" +progressInfoHistory.timeElapsed+", "+locale.fileupload.atAvgSpeedOfLabelText +""+avgSpeed+")</div>");
				}
			}
			$(elem).data("uploadInfo", {part1 : 0, part2 : 0, status : "", history : new Array()});
			var btn = $.CrushFTP.getNextQueuedItem(!$.CrushFTP.uploadAllQueued);
			if($.CrushFTP.uploadAllQueued)
			{
				if(btn)
				{
					$.CrushFTP.UploadProgressing = false;
					btn.trigger("click", [{allInQueue:true}]);
				}
				else
				{
					$.CrushFTP.removeGlobalProgressInfo();
				}
			}
			else
			{
				$.CrushFTP.UploadProgressing = false;
				if(btn && btn.length>0)
				{
					btn.trigger("click");
				}
				else
				{
					var isVisibleRepo = fileRepo.is(":visible");
					if(!window.dontShowUploadQueueCompletedGrowlMessage)
					{
						if(window.noTimeoutUploadedNote)
							$.growlUI(locale.fileupload.uploadCompletedText, locale.fileupload.uploadedFileText, false, false, true);
						else
							$.growlUI(locale.fileupload.uploadCompletedText, locale.fileupload.uploadedFileText, $.CrushFTP.Options.GrowlTimeout);
					}
					if(fileRepo.find("li:visible").length == 1 && window.runBatchCompletedCommandAfterUploadQueueFinishes)
					{
						window.batchComplete();
					}
					if(typeof window.onUploadComplete == "function"){
						window.onUploadComplete();
					}
					if(window.hideUploadBarAfterUpload)
					{
						viewFileQueue.addClass("close").trigger("click");
					}
					if(window.fileWindowAsDialog)
					{
						if(isVisibleRepo)
							viewFileQueue.removeClass("close").trigger("click");
						else
							viewFileQueue.addClass("close").trigger("click");
					}
					fileRepo.find(".curQueue").removeClass("curQueue");
					$.CrushFTP.removeGlobalProgressInfo();
					var autoShareUploadedItem = $(document).data("autoShareUploadedItem");
					var autoShareUploadedItemNotify = $(document).data("autoShareUploadedItemNotify");
					if(autoShareUploadedItem && autoShareUploadedItem.toLowerCase()=="true")
					{
						setTimeout(function(){
							shareAllUploaded.trigger("click");
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
									fileRepo.find("a.clearCompleted:first").trigger('click');
								}
							}, 100);
						}, 100);
					}
				}
			}

			if(fileRepo.find("li.uploaded").length>0)
				clearUploadedAll.show();
			else
				clearUploadedAll.hide();
		}
		else if(status == "error")
		{
			elem.removeClass("uploadProgress").addClass("hasError").find("a.startUpload").text(locale.fileupload.reupload).show();
			elem.find('.clicked').removeClass('clicked');
			if(result && result.message)
			{
				var msg = $.trim(result.message);
				if(typeof window.localizations.FileUploadAccessDeniedErrorMsgText != "undefined" && msg == "ERROR: Access denied. (You do not have permission or the file extension is not allowed.)")
				{
					msg = window.localizations.FileUploadAccessDeniedErrorMsgText;
				}
				if(typeof window.localizations.FileUploadContentNotAllowedErrorMsgText != "undefined" && msg == "ERROR:550 Error: File content not allowed.")
				{
					msg = window.localizations.FileUploadContentNotAllowedErrorMsgText;
				}
				if(typeof window.localizations.FileUploadCanNotOverwriteErrorMsgText != "undefined" && msg == "ERROR:Cannot overwrite a file.")
				{
					msg = window.localizations.FileUploadCanNotOverwriteErrorMsgText;
				}
				elem.find("div.upload-buttons").after("<span class='error' style='color:red;'>"+msg+"</span>");
			}
			elem.removeClass('unzipping');
			globalProgressBar.removeClass('unzipping');
			if(elem.data("formData"))
				elem.find("a.editForm").parent().show();
			if($.CrushFTP.uploadAllQueued)
			{
				var btn = $.CrushFTP.getNextQueuedItem();
				if(btn)
				{
					$.CrushFTP.UploadProgressing = false;
					btn.trigger("click", [{allInQueue:true}]);
				}
				else
				{
					$.CrushFTP.removeGlobalProgressInfo();
				}
			}
			else
			{
				$.CrushFTP.UploadProgressing = false;
				var btn = $.CrushFTP.getNextQueuedItem(true);
				if(btn && btn.length>0)
				{
					btn.trigger("click");
				}
				else
				{
					$.CrushFTP.removeGlobalProgressInfo();
				}
			}
			progressInfo.hide();
			$(elem).data("uploadInfo", {part1 : 0, part2 : 0, status : "", history : new Array()});
			progressInfo.find(".time,.speed,.status,.uploadStatusLabel").remove();
		}
		else
		{
			if(!elem.hasClass("skipped"))
			{
				setTimeout(function(){
					$.CrushFTP.refreshProgressInfo(elem);
				}, 1000);
			}
		}
	}

	$.CrushFTP.abortUploadRequest = function(elem, callback){
		$.CrushFTP.abortingOngoingUpload = true;
		$.ajax({
			type: "POST",
			url: $.CrushFTP.Options.ajaxCallURL,
			data: "command=blockUploads&random=" + Math.random()+"&c2f="+ crushFTPTools.getCrushAuth(),
			success: function (response) {
				setTimeout(function(){
					callback();
					elem.removeClass('aborting');
					$.CrushFTP.abortingOngoingUpload = false;
					if($.CrushFTP.abortingStatusCallbackqueue){
						var queue = $.CrushFTP.abortingStatusCallbackqueue;
						for (var i = 0; i < queue.length; i++) {
							queue[i]();
						}
						delete $.CrushFTP.abortingStatusCallbackqueue;
					}
				}, 6000);
			}
		});
	};

	$.CrushFTP.getBatchInfo = function(isBatch)
	{
		var totalSize = 0;
		var totalFiles = 0;
		if(isBatch)
		{
			var itms = fileRepo.find("li:not(.error, .ui-state-highlight, .hasError, .warning, .waiting)").each(function(){
				var curSize = parseFloat($(this).attr("size"));
				if(IsNumeric(curSize))
				{
					totalSize += curSize;
				}
			});
			totalFiles = itms.length;
		}
		else
		{
			var itms = fileRepo.find("li.curQueue:not(.error, .ui-state-highlight, .hasError, .warning, .waiting)").each(function(){
				var curSize = parseFloat($(this).attr("size"));
				if(IsNumeric(curSize))
				{
					totalSize += curSize;
				}
			});
			totalFiles = itms.length;
		}
		return {
			size : totalSize,
			files : totalFiles
		};
	}

	$.CrushFTP.updateProgressBar = function(elem, isApplet, appletResult){
		var uploadInfo = elem.data("uploadInfo");
		var progressInfo = elem.find("div.progressInfo");
		if(!uploadInfo) return;
		var now = new Date().getTime();
		if (!uploadInfo.history) uploadInfo.history = new Array();
		//calculate speeds using a rolling 10 interval window.  This provides a smoother speed calculation that doesn't bounce around so much to make the user concerned
		var history = uploadInfo.history;//Progressbar data history
		var currentSpeed = uploadInfo.currentSpeed;//Current upload/download speed
		var speedHistory = uploadInfo.speedHistory || [];
		history.push({
			now: now,
			bytes: uploadInfo.part1
		});
		if (history.length > 1 && elem.hasClass("paused") == false) {//Calculation and updating progressbar. Calculation of speed, percentages etc.
			var pivot = 0; //If history is for less than 5 seconds, use data of first second
			if (history.length > 5) {
				pivot = history.length - 5; // Set pivot to be of previous five second
			}
			var elapsed = now - history[0].now; // Time elapsed
			var bytes = uploadInfo.part1 - history[pivot].bytes; // Bytes transferred in timeframe
			var lastElapsed = now - history[pivot].now;// Elapsed time for last transfer timeframe
			var originalBytes = uploadInfo.part1 - history[0].bytes; // total bytes transferred
			var secs = ((((uploadInfo.part2 - uploadInfo.part1) / (originalBytes / elapsed)) / 1000) + 1) + ""; // total time remaining
			var remaining = $.CrushFTP.formatTime(secs);//formatted time
			var percentDone = (uploadInfo.part1 / uploadInfo.part2) * 100.0;// percentages completed
			var rElapsed = $.CrushFTP.formatTime((elapsed / 1000) + 1 + "");// elapsed time formatted
			var nonFormattedElapseTime = (elapsed / 1000) + 1;
			var speed = "";
			var currentActualSpeed = 0;
			if ((originalBytes / elapsed) == 0) {// Still Calculating
				speed = getLocalizationKeyExternal("BrowserUploaderSpeedTimeCalculatingText");
				remaining = getLocalizationKeyExternal("BrowserUploaderSpeedTimeCalculatingText");
				uploadInfo.currentSpeed = speed;
			} else {
				currentActualSpeed = (bytes / lastElapsed) * 1024.0;
				speed = $.CrushFTP.formatBytes(currentActualSpeed) + "/s";// Based on data transferred in last timeframe (5 secs)
				uploadInfo.currentSpeed = speed;
			}
			var uploadedSize = $.CrushFTP.formatBytes(uploadInfo.part1);
			var originalSize = $.CrushFTP.formatBytes(uploadInfo.part2);
			if(isApplet)
			{
				var estimatedSize = parseFloat(elem.attr("size"));
				if(!IsNumeric(estimatedSize))
					estimatedSize = 0;
				if(IsNumeric(uploadInfo.part2) && uploadInfo.part2 > estimatedSize)
				{
					elem.attr("size", uploadInfo.part2);
					elem.find("div.size").text(originalSize);
					$.CrushFTP.buildQueueInfo();
				}
			}
			progressInfo.find(".time,.speed,.status,.uploadStatusLabel").remove();
			progressInfo.append('<span class="uploadStatusLabel">' + uploadedSize + ' of ' + originalSize + '</span>');
			var timeStampLabel = getLocalizationKeyExternal("BrowserUploaderAdvancedUploadingTimeText");
			timeStampLabel = timeStampLabel.replace("{0}", rElapsed);
			uploadInfo.timeElapsed = rElapsed;
			uploadInfo.totalTimeInSec = nonFormattedElapseTime;
			timeStampLabel = timeStampLabel.replace("{1}", remaining);
			progressInfo.append(timeStampLabel);
			uploadInfo.avgSpeed = speed;
			var fileName = elem.attr("filename");
			var ext = getFileExtension(fileName);
			if(ext == "zipstream" && history[history.length-2].bytes == history[history.length-1].bytes)
			{
				elem.addClass('unzipping');
				globalProgressBar.addClass('unzipping');
			}
			else
			{
				elem.removeClass('unzipping');
				globalProgressBar.removeClass('unzipping');
			}
			if(elapsed/1000 >= 20)
			{
				speedHistory.push(currentActualSpeed);
				uploadInfo.speedHistory = speedHistory;
				var getAverageSpeed = function()
				{
					if(speedHistory.length>30)
					{
						while (speedHistory.length > 30) speedHistory.shift();
					}
					var avgSpeed = speedHistory.average();
					if(avgSpeed>0)
					{
						uploadInfo.avgSpeed = $.CrushFTP.formatBytes(avgSpeed) + "/s";
						return getLocalizationKeyExternal("BrowserUploaderAdvancedUploadingAverageSpeedText") + uploadInfo.avgSpeed +", ";
					}
					else
						return "";
				}
				progressInfo.append("<div class='speed'>" + getAverageSpeed() + getLocalizationKeyExternal("BrowserUploaderAdvancedUploadingSpeedText") + speed + "</div>");
			}
			else
			{
				progressInfo.append("<div class='speed'>" + getLocalizationKeyExternal("BrowserUploaderAdvancedUploadingSpeedText") + speed + "</div>");
			}
			if(isApplet && appletResult && appletResult.status)
			{
				if(appletResult.status && (appletResult.status.indexOf("ERROR:") >= 0 || appletResult.status.indexOf("WARN:") >= 0))
				{
					progressInfo.find("div.speed").prepend("<span style='color:red'>" + appletResult.status + "</span><br>");
				}
				else
					progressInfo.find("div.speed").prepend(appletResult.status + "<br>");
				elem.removeClass('unzipping');
				globalProgressBar.removeClass('unzipping');
			}
			if(uploadInfo.part1>0)
				progressInfo.find(".progressbar").progressbar({"value" : percentDone});

			//Global Progressbar
			if(!dragEventsNotSupported)
			{
				var batchInfo = $.CrushFTP.getBatchInfo($.CrushFTP.uploadAllQueued);
				var totalSize = batchInfo.size;
				var guploadInfo = globalProgressBar.data("uploadInfo");
				var prevFileSize = 0;
				var lastFile = globalProgressBar.data("curFile");
				globalProgressBar.data("curFile", elem.attr("uid"));
				if(!guploadInfo)
				{
					guploadInfo = {part1 : 0, part2 : 0, totalUploaded : 0, curfile:1, status : "", history : new Array()};
				}
				if(lastFile && lastFile != elem.attr("uid"))
				{
					prevFileSize = globalProgressBar.data("curFileSize");
					guploadInfo.totalUploaded += prevFileSize;
					guploadInfo.curfile += 1;
				}
				else
				{
					globalProgressBar.data("curFileSize", uploadInfo.part2);
				}
				guploadInfo.part2 = totalSize;
				guploadInfo.part1 = guploadInfo.totalUploaded + uploadInfo.part1;
				guploadInfo.status = uploadInfo.status;
				globalProgressBar.data("uploadInfo", guploadInfo);
				$.CrushFTP.updateGlobalProgressBar(elem, batchInfo.files, guploadInfo.curfile, isApplet, appletResult);
			}
			else
			{
				var batchInfo = $.CrushFTP.getBatchInfo($.CrushFTP.uploadAllQueued);
				var totalSize = batchInfo.size;
				var lastFile = globalProgressBar.data("curFile");
				globalProgressBar.data("curFile", elem.attr("uid"));
				var curFileCount = globalProgressBar.data("curFileCount");
				if(!curFileCount)
					curFileCount = 1;
				if(lastFile && lastFile != elem.attr("uid"))
				{
					curFileCount += 1;
					globalProgressBar.data("curFileCount", curFileCount);
				}
				globalProgressBar.data("uploadInfo", uploadInfo);
				$.CrushFTP.updateGlobalProgressBar(elem, batchInfo.files, curFileCount, isApplet, appletResult);
			}
		}
		else
		{
			elem.removeClass('unzipping');
			globalProgressBar.removeClass('unzipping');
		}
		if(appletResult && appletResult.showLoader)
		{
			if(elem.find("div.barbershop-spinner").length==0)
				elem.append('<div class="barbershop-spinner">Uploading...</div>');
		}
		else
		{
			elem.find("div.barbershop-spinner").remove();
		}
	}

	$.CrushFTP.updateGlobalProgressBar = function(elem, totalFiles, curFile, isApplet, appletResult)
	{
		var uploadInfo = globalProgressBar.data("uploadInfo");
		if(!uploadInfo) return;
		var now = new Date().getTime();
		if (!uploadInfo.history) uploadInfo.history = new Array();
		//calculate speeds using a rolling 10 interval window.  This provides a smoother speed calculation that doesn't bounce around so much to make the user concerned
		var history = uploadInfo.history;//Progressbar data history
		var currentSpeed = uploadInfo.currentSpeed;//Current upload/download speed
		var speedHistory = uploadInfo.speedHistory || [];
		history.push({
			now: now,
			bytes: uploadInfo.part1
		});
		if (history.length > 1 && elem.hasClass("paused") == false) {//Calculation and updating progressbar. Calculation of speed, percentages etc.
			var pivot = 0; //If history is for less than 5 seconds, use data of first second
			if (history.length > 5) {
				pivot = history.length - 5; // Set pivot to be of previous five second
			}
			var elapsed = now - history[0].now; // Time elapsed
			var bytes = uploadInfo.part1 - history[pivot].bytes; // Bytes transferred in timeframe
			var lastElapsed = now - history[pivot].now;// Elapsed time for last transfer timeframe
			var originalBytes = uploadInfo.part1 - history[0].bytes; // total bytes transferred
			var secs = ((((uploadInfo.part2 - uploadInfo.part1) / (originalBytes / elapsed)) / 1000) + 1) + ""; // total time remaining
			var remaining = $.CrushFTP.formatTime(secs);//formatted time
			var percentDone = (uploadInfo.part1 / uploadInfo.part2) * 100.0;// percentages completed
			var titlePerc = Math.floor(percentDone);
			if(titlePerc>100)
				titlePerc = 100;
			if(!isNaN(titlePerc))
			{
				$.titleAlert(titlePerc + '% ' + locale.fileupload.uploadCompletedText, {
					originalTitleInterval:0,
					interval : 2000
				});
			}
			var rElapsed = $.CrushFTP.formatTime((elapsed / 1000) + 1 + "");// elapsed time formatted
			var speed = "";
			var currentActualSpeed = 0;
			if ((originalBytes / elapsed) == 0) {// Still Calculating
				speed = getLocalizationKeyExternal("BrowserUploaderSpeedTimeCalculatingText");
				remaining = getLocalizationKeyExternal("BrowserUploaderSpeedTimeCalculatingText");
				uploadInfo.currentSpeed = speed;
			} else {
				currentActualSpeed = (bytes / lastElapsed) * 1024.0;
				speed = $.CrushFTP.formatBytes(currentActualSpeed) + "/s";// Based on data transferred in last timeframe (5 secs)
				uploadInfo.currentSpeed = speed;
			}
			var uploadedSize = $.CrushFTP.formatBytes(uploadInfo.part1);
			var originalSize = $.CrushFTP.formatBytes(uploadInfo.part2);
			if(uploadInfo.part2<uploadInfo.part1)
				originalSize = $.CrushFTP.formatBytes(uploadInfo.part1);
			uploadInfo.originalSize = originalSize;
			var uploadStatusLabel = uploadedSize + ' of ' + originalSize;
			var timeStampLabel = getLocalizationKeyExternal("BrowserUploaderAdvancedUploadingTimeText");
			timeStampLabel = timeStampLabel.replace("{0}", rElapsed);
			timeStampLabel = timeStampLabel.replace("{1}", remaining);
			var speedInfo = "";
			if(elapsed/1000 >= 20)
			{
				speedHistory.push(currentActualSpeed);
				uploadInfo.speedHistory = speedHistory;
				var getAverageSpeed = function()
				{
					if(speedHistory.length>30)
					{
						while (speedHistory.length > 30) speedHistory.shift();
					}
					var avgSpeed = speedHistory.average();
					if(avgSpeed>0)
					{
						return getLocalizationKeyExternal("BrowserUploaderAdvancedUploadingAverageSpeedText") + $.CrushFTP.formatBytes(avgSpeed) + "/s , ";
					}
					else
						return "";
				}
				speedInfo = $("<div class='speed'>" + getAverageSpeed() + getLocalizationKeyExternal("BrowserUploaderAdvancedUploadingSpeedText") + speed + "</div>");
			}
			else
			{
				speedInfo = $("<div class='speed'>" + getLocalizationKeyExternal("BrowserUploaderAdvancedUploadingSpeedText") + speed + "</div>");
			}

			//Global Progressbar
			globalProgressBar.show();
			var curFileIndex = curFile || elem.index() + 1;
			if(curFileIndex<=0)
				curFileIndex = 1;
			totalFiles = totalFiles || fileRepo.find("li.formProcessed").length;
			var fileName = unescape(elem.attr("fileName"));
			if(fileName.length>50)
				fileName = fileName.substr(0, 30) + "..." + fileName.substr(fileName.length-15, fileName.length);
			globalProgressBar.find(".time,.speed").remove();
			globalProgressBar.find(".progressbarMain").progressbar({"value" : percentDone}).end()
			.find(".progressBarText").text(uploadStatusLabel).end()
			.find(".uploadInfo").html(window.locale.fileupload.uploading + "<strong>" + fileName + "</strong>, " + curFileIndex + " of " + " total " + totalFiles + " item(s)")
			.after(speedInfo).after(timeStampLabel);

			if(isApplet && appletResult && appletResult.status)
			{
				if(appletResult.status.indexOf("ERROR:") >= 0 || appletResult.status.indexOf("WARN:") >= 0)
				{
					globalProgressBar.find(".uploadInfo").append("<br>" + "<span style='color:red'>" + appletResult.status + "</span>");
				}
				else
					globalProgressBar.find(".uploadInfo").append("<br>" + appletResult.status);
			}

			if(elem.hasClass("appletItem"))
				globalProgressBar.find("a.pause").show();
			else
				globalProgressBar.find("a.pause").hide();

			globalProgressBar.find("a.pause").unbind().click(function(){
				elem.find("a.pause").trigger("click");
				return false;
			});

			globalProgressBar.find("a.skip").unbind().click(function(){
				elem.find("a.cancelUpload").trigger("click");
				return false;
			});

			globalProgressBar.find("a.stop").unbind().click(function(){
				fileRepo.find("a.cancelUploading").trigger("click");
				return false;
			});
		}
	}

	$.CrushFTP.removeGlobalProgressInfo = function(dontHide)
	{
		$.CrushFTP.UploadProgressing = false;
		$.CrushFTP.uploadAllQueued = false;
		if(!dontHide)
			globalProgressBar.fadeOut();
		globalProgressBar.removeData("uploadInfo");
		globalProgressBar.removeData("curFile");
		globalProgressBar.removeData("curFileSize");
		globalProgressBar.removeData("curFileCount");
		$("#mainContent").find("span.refreshButton").trigger("click");
		$.titleAlert("**"+locale.fileupload.uploadCompletedText+"**", {
			duration  : 2000
		});

		if(window.showUploadNotification)
        {
        	if(Notification.permission !== 'granted'){
				Notification.requestPermission();
			}
			var n = new Notification(locale.fileupload.uploadCompletedText, {
				body: locale.fileupload.uploadedMultipleFilesText
			});
        }
	}

	$.CrushFTP.DNDUploadCallback = function(status, data, button, template){
		if(status == "completed")
		{
			var result = data.result
			button = template.find("a.startUpload");
			if(result && result.responseText)
			{
				var response = result.responseText;
				response = $(response).find("response").text();
				if (response.toLowerCase() != "success")
	            {
	                template.addClass("ui-state-error").removeClass("uploadProgress");
	                template.find("div.upload-buttons").after("<span class='error'>"+response+"</span>");
	            }
				else
					template.removeClass("ui-state-error uploadProgress").effect("highlight", {}, 2000);
				button.addClass("uploaded");
				template.find('.clicked').removeClass('clicked');
			}
			else {
				template.removeClass("uploadProgress").addClass("ui-state-error").append("<span class='error'>File upload failed, please try again.</span>");
				button.addClass("uploaded");
			}
		}
		else if(status == "uploading")
		{
			$.CrushFTP.UploadProgressing = true;
			template.addClass("uploadProgress").find(".error, .uploadStatus").remove();
			$.CrushFTP.refreshProgressInfo(template);
			var startBtn = template.find("a.startUpload").hide();
			template.find("a.editForm").parent().hide();
			if(template.hasClass("appletItem"))
			{
				template.find("a.pause").parent().show();
			}
			template.find("div.progressInfo").show();
		}
		else if(status == "skipped")
		{
			template.removeClass("uploadProgress curQueue").addClass("skipped").find("a.startUpload").text(locale.fileupload.reupload).show();
			if(template.data("formData"))
				template.find("a.editForm").parent().show();
			template.find("a.pause").parent().hide();
			template.find("div.progressInfo").hide();
			template.find('.clicked').removeClass('clicked');
			if($.CrushFTP.uploadAllQueued)
			{
				var btn = $.CrushFTP.getNextQueuedItem();
				if(btn)
				{
					$.CrushFTP.UploadProgressing = false;
					btn.trigger("click", [{allInQueue:true}]);
				}
				else
				{
					$.CrushFTP.removeGlobalProgressInfo(true);
				}
			}
			else
			{
				$.CrushFTP.removeGlobalProgressInfo(true);
			}

			if(fileRepo.find("li.uploaded").length>0)
				clearUploadedAll.show();
			else
				clearUploadedAll.hide();
		}
		else if(status == "paused")
		{
			$.CrushFTP.UploadProgressing = true;
			//template.removeClass("uploadProgress");
			template.find("div.progressInfo").find("div.time, div.speed").remove().end().append("<div class='status'>"+getLocalizationKeyExternal("BrowserUploaderSelectedFilePausedStatusText")+"</div>");
		}
	}

	$.CrushFTP.getUploadProgress = function(callBack, elem, applet){
		var curData = $(elem).data("uploadInfo");
		if(!curData)
			curData = {part1 : 0, part2 : 0, status : "", history : new Array()};
		if(applet)
		{
			if(elem.attr("status") == "paused")
			{
				return "paused";
			}
			var result = runAppletCommand(true, "COMMAND=ACTION:::TYPE=UPLOAD:::ACTION=STATUS");
			var o = parseJavaProps(result);
			o.isApplet = true;
			if(typeof o.status == "string" && o.status.length == 0)
			{
				o.status = " ";
			}
			/* added by carlos */
			if(o.ask == "true")
			{
				$('#ask_response_uid').val(o.uid);
				var timestamp = (parseInt(o.modified) / 1000);
				var d = new Date(0);
				d.setSeconds(timestamp);
				//HH:MM:ss 140000000
				var formatted = d.format("mm/dd/yyyy - HH:MM:ss");
				var path = o.path;
				var fullFileName;
				while( path.indexOf("\\") !== -1 ){
				  path = path.replace("\\", "/");
				}
				fullFileName = path.split("/").pop();
				$('#ask_info').html('<div style="float: left; font-weight: bold; width: 20%; margin-bottom: 7px">Filename:</div><div style="float: left; font-weight: normal; width: 80%;">'+crushFTPTools.limitText(fullFileName, 50)+'</div><div style="clear: both"></div><div style="float: left; font-weight: bold; width: 20%; margin-bottom: 7px">Path:</div><div style="float: left; font-weight: normal; width: 80%;">'+crushFTPTools.limitText(path.replace(fullFileName, ''), 50)+'</div><div style="clear: both"></div><div style="float: left; font-weight: bold; width: 20%; margin-bottom: 7px">Modified:</div><div style="float: left; font-weight: normal; width: 80%;">'+crushFTPTools.limitText(formatted, 50)+'</div><div style="clear: both"></div><div style="float: left; font-weight: bold; width: 20%; margin-bottom: 7px">Size:</div><div style="float: left; font-weight: normal; width: 80%;">'+$.CrushFTP.formatFileSize(o.size)+'</div><div style="clear: both"></div>');
				$("#askDialog").dialog({title:getLocalizationKeyExternal("advancedUploadOptionsAskActionForFileDialogTitle")}).dialog('open');
				return;
			}
			/* end */
			if (!o || !o.status || o.status.toUpperCase().indexOf("CANCELLED:") == 0)
			{
				//If file upload/download is cancelled
				o.status= "cancelled";
			}
			else
			{
				o.part1 = o.transferedBytes * 1;
				o.part2 = o.totalBytes * 1;
			}
			if (o.part1 < o.part2)
			{
				o.statusApplet = "uploading";
			}
			else {
				if (o.status && o.status.toLowerCase().indexOf("error:") >= 0) {
					//If error while upload/download
					o.statusApplet = "error";
					o.message = o.status + "";
				} else {
					//If file upload/download completed
					o.statusApplet = "completed";
				}
			}
			if (o.status && o.status.toLowerCase().indexOf("error:") >= 0) {
				//If error while upload/download
				o.statusApplet = "error";
				o.message = o.status + "";
			}
			if(o.status.indexOf("Upload:Success")>=0)
			{
				o.statusApplet = "completed";
			}
			curData = $.extend(curData, o);
			$(elem).data("uploadInfo", curData);
			callBack(curData);
		}
		else
		{
			var fileName = $(elem).attr("uid");
			$.ajax({
				type: "POST",
				url: $.CrushFTP.Options.ajaxCallURL,
				data: "command=getUploadStatus&itemName=" + encodeURIComponent(fileName)+"&c2f="+ crushFTPTools.getCrushAuth(),
				success: function (response) {
					var responseData = response;
					if (responseData == null) responseData = "";
					responseData = $.CrushFTP.getActionResponseText(responseData);
					responseData = jQuery.trim(responseData.toString());
					var o = {};
					o.status = "uploading";
					o.showLoader = false;
					if (responseData.indexOf("PROGRESS:") >= 0) {
						var part1 = curData.part1 = responseData.substring("PROGRESS:".length, responseData.indexOf("/"));
						var part2 = curData.part2 = responseData.substring(responseData.indexOf("/") + 1, responseData.indexOf(";"));
						part1 = part1 * 1;
						part2 = part2 * 1;
						o.part1 = part1;
						o.part2 = part2;
					} else if (responseData.indexOf("DONE:") >= 0) {
						o.status = "completed";
					} else if (responseData == "null" || responseData == "") { //too quick, upload hasn't started up yet.
						if(curData.history.length>2 && parseInt(curData.totalTimeInSec)>10){
							if(!window.disableUploadTimeLimit)
							{
								o.status = "error";
								o.message = getLocalizationKeyExternal("BrowserUploaderProblemWhileTransferMsgText");
							}
							else
							{
								o.status = "starting";
								o.showLoader = true;
							}
						}
						else
							o.status = "starting";
					} else if (responseData.indexOf("ERROR:") >= 0) {
						o.status = "error";
						o.message = responseData;
					} else {
						o.status = "error";
						o.message = responseData;
					}
					curData = $.extend(curData, o);
					$(elem).data("uploadInfo", curData);
					callBack(curData);
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					var o = {};
					o.status = "error";
					o.message = getLocalizationKeyExternal("BrowserUploaderProblemWhileTransferMsgText");
					curData = $.extend(curData, o);
					$(elem).data("uploadInfo", curData);
					callBack(curData);
				}
			});
		}
	}

	$("#hideFileQueue").click(function(){
		$("#droppedFiles").hide();
		return false;
	});

	/*New upload mode stuff*/
	$.CrushFTP.checkUploadForm = function(){
		getUploadForm(function (data) {
			if($(document).data("commonUploadFormHTML"))
				$.CrushFTP.hasCommonUploadForm = true;
			else
				$.CrushFTP.hasCommonUploadForm = false;
			if(window.crushUpload)
			{
				crushUpload.commonUploadFormStatus($.CrushFTP.hasCommonUploadForm);
			}
		});
	}

	$.CrushFTP.showUploadFormAdvanced = function(showCommonForm, index, items, direct)
	{
		if($.CrushFTP.fetchingUploadForm)return;
		if ($("#customUploadForm").length > 0) {
			$.CrushFTP.fetchingUploadForm = true;
			getUploadForm(function (data) {
				$.CrushFTP.fetchingUploadForm = false;
				if(($(document).data("commonUploadFormHTML") && !window.commonUploadFormShown) || ($(document).data("commonUploadFormHTML") && showCommonForm))
				{
					$.CrushFTP.hasCommonUploadForm = true;
					$.CrushFTP.showCommonUploadForm(function(formData){
						$.CrushFTP.saveCommonFormData(formData);
					});
					if(window.crushUpload)
					{
						crushUpload.commonUploadFormStatus($.CrushFTP.hasCommonUploadForm);
					}
					if(direct){
						$.CrushFTP.uploadInfoFormDialog.find("#uploadFormDataCheckbox").remove();
					}
				}
				else
				{
					continueWithUploadForm();	
				}
				setTimeout(function(){
					if(window.resetUplodForm)
					{
						var uploadInfoForm = $("#uploadInfoForm");
			            $.CrushFTP.uploadInfoFormDialog.data("commonForm", true);
			            $.CrushFTP.showingCommonUploadForm = true;
			            var formContent = uploadInfoForm.find(".formContent").replaceWith("<div class='formContent'>" + $(document).data("commonUploadFormHTML") + "</div>");
			            setCustomFormFieldAttributes(uploadInfoForm);
			            attachCalendarPopup(uploadInfoForm);
			            window.resetUplodForm = false;
					}
				});
				function continueWithUploadForm()
				{
					$.CrushFTP.uploadInfoFormDialog.data("commonForm", false);
					$.CrushFTP.fetchingUploadForm = false;
					var curItem = items[index];
					if(data && data.length>0 && curItem)
					{
						data = $("<div class='formContent'>" + data + "</div>");
						//if($(document).data("commonUploadFormHTML"))
						{
							var _formInfo = getLocalizationKeyExternal("uploadFormInfoTitleText") || "For item : ";
							if(typeof index != "undefined"){
								var nxtItem = getLocalizationKeyExternal("pagingNextText") || "Next";
								var prevItem = getLocalizationKeyExternal("pagingPrevText") || "Previous";
								data.prepend('<div class="form-info">'+_formInfo+' <strong>'+unescape(curItem.name)+'</strong><span class="form-nav"><a href="javascript:void(0);" tabindex="-1" class="prevFormItem">'+prevItem+'</a> <a href="javascript:void(0);" tabindex="-1" class="nextFormItem">'+nxtItem+'</a></span></div>');
								if(index==0)
									data.find(".form-info").find(".prevFormItem").addClass('disabled');
								if(index == items.length-1)
									data.find(".form-info").find(".nextFormItem").addClass('disabled');
								data.find(".prevFormItem").click(function(){
									if($(this).hasClass('disabled'))
										return false;
									else
									{
										if (validateForm(false, $.CrushFTP.uploadInfoFormDialog.find(".customForm")))
										{
											var formData = serializeForm($.CrushFTP.uploadInfoFormDialog.find("form")[0], true);
											$.CrushFTP.savePerFileFormData(formData, $.CrushFTP.uploadInfoFormDialog.data("currentItem"));
										}
										else{
											return false;
										}
										$.CrushFTP.customFormWindowClose = true;
										$.CrushFTP.customFormWindowClose = false;
										index--;
										$.CrushFTP.showUploadFormAdvanced(showCommonForm, index, items, direct);
										var formData = $.CrushFTP.getCurrentItemFormData($.CrushFTP.uploadInfoFormDialog.data("currentItem").id);
										if(formData)
										{
											window.bindDataToForm($.CrushFTP.uploadInfoFormDialog, formData);
										}
									}
								});
								data.find(".nextFormItem").click(function(){
									if($(this).hasClass('disabled'))
										return false;
									else
									{
										if (validateForm(false, $.CrushFTP.uploadInfoFormDialog.find(".customForm")))
										{
											var formData = serializeForm($.CrushFTP.uploadInfoFormDialog.find("form")[0], true);
											$.CrushFTP.savePerFileFormData(formData, $.CrushFTP.uploadInfoFormDialog.data("currentItem"));
										}
										else{
											return false;
										}
										$.CrushFTP.customFormWindowClose = true;
										$.CrushFTP.customFormWindowClose = false;
										index++;
										$.CrushFTP.showUploadFormAdvanced(showCommonForm, index, items, direct);
										var formData = $.CrushFTP.getCurrentItemFormData($.CrushFTP.uploadInfoFormDialog.data("currentItem").id);
										if(formData)
										{
											window.bindDataToForm($.CrushFTP.uploadInfoFormDialog, formData);
										}
									}
								});
							}
						}
						var checked = window.uploadFormAskAgainChecked;
						var hideAndChecked = window.uploadFormAskAgainHideAndChecked;
						var hideAndUnchecked = window.uploadFormAskAgainHideAndUnchecked;
						if(!$(document).data("commonUploadFormHTML")){
							var check = $("<tr id='uploadFormDataCheckbox'><td colspan='2' style='border:none;'><p class='formOption ui-state-highlight'><input type='checkbox' id='useUploadFormForAll' /><label for='useUploadFormForAll'>Don't show form for additional files.</label></p></td></tr>");
							data.append(check);
							if(checked)
								check.find("input").attr("checked", "checked");
							if(hideAndChecked)
							{
								check.find("input").attr("checked", "checked");
								check.find("td").hide();
							}
							if(hideAndUnchecked)
							{
								check.find("input").removeAttr("checked");
								check.find("td").hide();
							}
						}
						var uploadInfoForm = $("#uploadInfoForm");
						var formContent = uploadInfoForm.find(".formContent").replaceWith(data);
						setCustomFormFieldAttributes(uploadInfoForm);
						attachCalendarPopup(uploadInfoForm);
						$.CrushFTP.uploadInfoFormDialog.data("currentItems", items);
						$.CrushFTP.uploadInfoFormDialog.data("currentItem", curItem);
						$.CrushFTP.uploadInfoFormDialog.dialog("open").dialog("moveToTop");
						if($.CrushFTP.uploadFormShown)
						{
							$.CrushFTP.uploadFormShown(uploadInfoForm, false, function(cancel){
								if(cancel)
									uploadInfoForm.closest('div.ui-dialog').find("div.ui-dialog-buttonset").find("button:first").trigger('click');
								else
									uploadInfoForm.closest('div.ui-dialog').find("div.ui-dialog-buttonset").find("button:last").trigger('click');
							});
						}
					}
					else{
						setTimeout(function(){
							if(!$.CrushFTP.uploadInfoFormDialog.is(":visible") && window.crushUpload){
								window.crushUpload.addedFilesProcessed();
							}
						}, 1000);
					}
				}
			}, function(){
				setTimeout(function(){
					if(!$.CrushFTP.uploadInfoFormDialog.is(":visible") && window.crushUpload){
						window.crushUpload.addedFilesProcessed();
					}
				}, 1000);
			});
		}
		else
		{
			$.CrushFTP.fetchingUploadForm = false;
			setTimeout(function(){
				if(!$.CrushFTP.uploadInfoFormDialog.is(":visible") && window.crushUpload){
					window.crushUpload.addedFilesProcessed();
				}
			}, 1000);
		}
	};

	$.CrushFTP.saveCommonFormData = function(data){
		if(window.useNewUpload){
			if(window.crushUpload)
				crushUpload.saveCommonFormData(data);
		}
		else{
		}
	};

	$.CrushFTP.getCurrentItemFormData = function(id){
		var currentItems = $.CrushFTP.uploadInfoFormDialog.data("currentItems");
		for (var i = 0; i < currentItems.length; i++) {
			var curItem = currentItems[i];
			if(id == curItem.id)
			{
				return curItem.formData;
			}
		}
	};

	$.CrushFTP.savePerFileFormData = function(data, item){
		if(window.useNewUpload && item){
			var currentItems = $.CrushFTP.uploadInfoFormDialog.data("currentItems");
			if(currentItems)
			{
				for (var i = 0; i < currentItems.length; i++) {
					var curItem = currentItems[i];
					if(item.id == curItem.id)
					{
						curItem.formData = data;
						i = currentItems.length;
					}
				}
				$.CrushFTP.uploadInfoFormDialog.data("currentItems", currentItems);
				if(window.crushUpload)
					crushUpload.savePerFileFormData(data, item);
			}
		}
	};
});

/**
 * detect IE
 * returns version of IE or false, if browser is not Internet Explorer
 */
function detectIE() {
  var ua = window.navigator.userAgent;

  // Test values; Uncomment to check result …

  // IE 10
  // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

  // IE 11
  // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

  // Edge 12 (Spartan)
  // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

  // Edge 13
  // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

  var msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  var trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    var rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  var edge = ua.indexOf('Edge/');
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

  // other browser
  return false;
}

Array.prototype.removeByVal = function() {
    var what, a = arguments,
        L = a.length,
        ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) != -1) {
            this.splice(ax, 1);
        }
    }
    return this;
}