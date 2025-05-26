$.fn.media.defaults.bgColor = '#000';

// Extensions/file types ready for preview using media plugin
window.mediaFileExtensions = ["3gp","3gpp","3g2","aif","aifc","aiff","asf","avi","flv", "gif", "m4v","mid","mov","mp2","mp3","mp4","webm","mpa","mpe","mpeg","mpg","mpv2","swf","wav","wmv"];
window.availableFileExtensionImages = ["ai", "avi", "bak", "bat", "bin", "bmp", "cab", "cmd", "css", "csv", "cue", "dat", "dic", "divx", "dll", "dmg", "doc", "docx", "dvd", "dwg", "exe", "file", "fla", "gif", "htm", "html", "ifo", "ini", "iso", "jpeg", "jpg", "js", "m4a", "mmf", "mov", "mp3", "mp4", "mpeg", "mpg", "otf", "pdf", "php", "png", "pps", "ppt", "pptx", "psd", "rar", "rtf", "swf", "sys", "tiff", "ttf", "txt", "vob", "wma", "wmv", "xls", "xlsx", "xml", "xmp", "zip", "sitx", "idml", "indd", "sit"];
function resetDimensions()
{
	var h = window.innerHeight ? window.innerHeight : $(window).height();
	var w = $(window).width();
	var container_w = $("#container").width() - 80;
	var _h = h * 0.65;
	$("div.slideshow").css({"min-height":_h + "px"});
	$("div.slideshow").find("span").css({"height":_h + "px","width":"auto"});
	var img = $("div.slideshow").find("img");
	var curAngle = img.attr("curAngle") || 0;
	curAngle = parseInt(curAngle);
	if(curAngle == -360 || curAngle == 360) curAngle = 0;
	var imgH = img.height();
	var imgW = img.width();
	if(curAngle != 0 && curAngle != 180 && curAngle != -180 && imgH<imgW)
	{
		if(imgW<_h)
		{
			img.css({"height":"auto","width": "auto"});
			img.css("margin-top", (img.closest('span').height()/2) - (img.height()/2));
		}
		else
			img.css({"height":"auto","width": _h + "px", "margin-top":"70px"});
	}
	else
	{
		imgH = _h;
		if(imgH<_h)
		{
			img.css({"height" : "auto","width":"auto"});
			img.css("margin-top", (img.closest('span').height()/2) - (img.height()/2));
		}
		else
			img.css({"height":_h + "px","width":"auto", "margin-top":"auto"});
	}

	var thumb_w = 95;
	var thumbcount = (Math.round(container_w /thumb_w)) - 1;
	thumbcount = thumbcount <=0 ? 1: thumbcount;
	if(window.cfgallery && window.cfgallery.numThumbs){
		if(window.cfgallery.numThumbs!=thumbcount)
		{
			window.cfgallery.numThumbs = window.slideshowThumbsCount || thumbcount;
			window.cfgallery.rebuildThumbs();
		}
	}

	var thumbsContainer = $("#thumbs");
	var totalWidth = thumbcount * 95;
	var margin = (Math.round(totalWidth /2)) + 80;
	thumbsContainer.css({"left":"50%","margin-left":"-" + margin + "px"});
	var pageSize = Math.round(totalWidth / 45);
	if(!pageSize || pageSize<10)
		pageSize = 10;
	if(window.cfgallery && window.cfgallery.maxPagesToShow){
		if(window.cfgallery.maxPagesToShow!=pageSize)
		{
			window.cfgallery.maxPagesToShow = pageSize;
			window.cfgallery.rebuildThumbs();
		}
	}
	if($("#slideshow").find("video, object").length>0)
	{
		var imageWrapper = $("span.image-wrapper");
		var dim = {height:imageWrapper.height()-30, width:imageWrapper.width()-30};
		$("#slideshow").find("video, object").width(dim.width).height(dim.height);
	}
}

function resetHeightForSlideshowOnlyMode()
{
	var _ssOnly = (top != self);
	if(_ssOnly && window.parent && window.parent.slideshowOnly)
	{
		$("#footerss").hide();
	}
	else
	{
		$("#footerss").show();
	}
}

function fetchItems(path, basket)
{
	var params = [['name', 'name'],
				  ['path', 'href_path'],
				  ['desc', 'keywords'],
				  ['date', 'dateformatted'],
				  ['size', 'sizeFormatted'],
				  ['preview', 'preview'],
				  ['privs', 'privs']];
	var basePath = '/WebInterface/function/';
	var image;

	/*$("body").ajaxError(function(event, request, settings){
		$("#pageLoadIndicator").replaceWith(window.slideshowLocalizations.noItemMessage);
		$("#container").hide();
		$.unblockUI();
	});*/
	var getFileExtension = function(filename) {
		var ext = /^.+\.([^.]+)$/.exec(filename);
		return ext == null ? "" : ext[1].toLowerCase();
	};
	var previewItems = ['flv','mp3','swf','mp4','h264','m4v','webm','ogg','mov','ogg'];
	if(basket)
	{
		var itemsInBasket = (window.parent && window.parent.getItemsFromBasket) ? window.parent.getItemsFromBasket() : [];
		$.unblockUI();
		$("#itemControls").find(".fullscreenButton").remove();
		if(itemsInBasket)
		{
			var _html = [];
			var _itemHTML="<li>###<a class=\"thumb\" name=\"NAME\" fullPath=\"FULLPATH\" privs=\"PRIVS\" previews=\"PREVIEWS\" href=\"HREF\" title=\"TITLE\"><img src=\"SRC\" alt=\"TITLE\" /></a><div class=\"caption\"><div class=\"image-title\">CAPTION</div></div></li>";
			for(var item = 0;item<itemsInBasket.length;item++)
			{
				var curItem = itemsInBasket[item];
				var _generatedHTML = _itemHTML;
				var _file = crushFTPTools.textEncode(unescape(curItem.file));
				if(curItem.preview != "0" || previewItems.has(getFileExtension(_file)))
				{
					_generatedHTML = _generatedHTML.replace(/NAME/g, crushFTPTools.textEncode(unescape(curItem.name)));
					_generatedHTML = _generatedHTML.replace(/HREF/g, basePath + '?command=getPreview&size=3&path=' + _file + '&c2f='+crushFTPTools.getCrushAuth() + '&frame=1');
					_generatedHTML = _generatedHTML.replace(/TITLE/g, encodeURI(crushFTPTools.textEncode(unescape(curItem.name))));
					_generatedHTML = _generatedHTML.replace(/CAPTION/g, crushFTPTools.textEncode(unescape(curItem.name)));
					_generatedHTML = _generatedHTML.replace(/SRC/g, basePath + '?command=getPreview&size=2&path=' + _file + '&c2f='+crushFTPTools.getCrushAuth() + '&frame=1');
					_generatedHTML = _generatedHTML.replace(/DESCRIPTION/g, crushFTPTools.textEncode(unescape(curItem.keywords)));
					_generatedHTML = _generatedHTML.replace(/PRIVS/g, escape(curItem.privs));
					_generatedHTML = _generatedHTML.replace(/PREVIEWS/g, curItem.preview);
					_generatedHTML = _generatedHTML.replace(/FULLPATH/g, escape(curItem.file));
					var previews = parseInt(curItem.preview);
					if(previews && previews!= NaN && previews>1)
						_generatedHTML = _generatedHTML.replace(/###/g, "<div class='multiImages'></div>");
					else
						_generatedHTML = _generatedHTML.replace(/###/g, "");

					_html.push(_generatedHTML);
				}
			}
			$("ul.thumbs").empty().append(_html.join(""));
			if(_html.length>0)
			{
				$("#pageLoadIndicator").hide();
				var parentElem = $("ul.thumbs");
				var elem = $("img", parentElem);
				// Loop through items and load preview icons, if icon not available generic icon will be shown
				elem.each(function () {
					var $curElem = $(this);
					// binds images' load event
					$curElem.unbind().bind("load", function (e) {
						var $this = $(this);
						$(this).removeAttr("width").removeAttr("height").css({
							width: "",
							height: ""
						});
						var pic_real_width = this.width;
						var pic_real_height = this.height;
                        var imgRatio = pic_real_width / pic_real_height;
                        var divRatio = $this.closest("a").width() / $this.closest("a").height();
						// Calculate image's real width and height and fix it to fit to the image holder DIV
						if (pic_real_width < $this.closest("a").width() && pic_real_height < $this.closest("a").height()) {
							$this.css("height", "auto");
							$this.css("width", "auto");
						}
                        else if (imgRatio > divRatio) {
							$this.css("height", "auto");
							$this.css("width", $this.closest("a").width());
						} else {
							$this.css("width", "auto");
							$this.css("height", $this.closest("a").height());
						}
						if(pic_real_height<$this.closest("a").height())
						{
							$this.css("top", "50%");
							$this.css("margin-top", "-" + this.height/2);
						}
					}).error(function(){
						var fileName = $(this).closest("a").attr("title");
						var ext = getFileExtension(fileName);
						var iconSize = 48;
						if (window.availableFileExtensionImages.has(ext)) {
							$(this).attr("src", "/WebInterface/jQuery/images/fileExtensions/" + ext + "_"+iconSize+".png");
						} else {
							$(this).attr("src", "/WebInterface/jQuery/images/fileExtensions/file" + "_"+iconSize+".png").attr("style", "border:0px;");
						}
					});
				});
				$.unblockUI();
				initSlideshow();
			}
			else
			{
				$("#pageLoadIndicator").replaceWith(window.slideshowLocalizations.noItemMessage).show();
				$("#container").hide();
				$.unblockUI();
				showActionControls();
			}
		}
	}
	else
	{
		$.post(basePath, {command: 'getXMLListing', path: path, c2f : crushFTPTools.getCrushAuth()}, function(data){
			$('div.mainProcessIndicator').hide();
			$.unblockUI();
			window.curTreeItems = [];
			var files = new Array();
			if(data)
			{
                var privs = data.getElementsByTagName("privs");
                privs = IE(privs[0]).textContent;
                $(document).data("folderPrivs", privs);
				$(data).find('listing_subitem').each(function(){
					if($(this).find('privs').text().search(/slideshow/i) == -1)
						return;

					row = new Object();

					for(i in params)
						row[params[i][0]] = $(this).find(params[i][1]).text();
					if($(this).find('preview').text() == 'false' && !previewItems.has(getFileExtension(row['path'])))
						return false;

					var _filePathPreview = crushFTPTools.encodeURILocal(unescape(row['path']));
					row['enabled'] = true;
					row['thumbSrc'] = basePath + '?command=getPreview&size=2&path=' + _filePathPreview + '&c2f='+crushFTPTools.getCrushAuth() + '&frame=1';
					row['imageSrc'] = basePath + '?command=getPreview&size=3&path=' + _filePathPreview + '&c2f='+crushFTPTools.getCrushAuth() + '&frame=1';
					row["fileName"] = row['path'];
					files.push(row);
				});
				var _html = [];
				var _itemHTML="<li>###<a class=\"thumb\" name=\"NAME\" fullPath=\"FULLPATH\" privs=\"PRIVS\" previews=\"PREVIEWS\" href=\"HREF\" title=\"TITLE\"><img _orig=\"ORIG\" src=\"SRC\" alt=\"TITLE\" /></a><div class=\"caption\"><div class=\"image-title\">CAPTION</div></div></li>";
				for(var item = 0;item<files.length;item++)
				{
					var curItem = files[item];
					window.curTreeItems.push(curItem);
					var fileName = curItem.name;
					var ext = getFileExtension(fileName);
					if(curItem.preview != "0" || previewItems.has(ext))
					{
						var _generatedHTML = _itemHTML;
						var iconSize = 48;
						var src = "";
						if (window.availableFileExtensionImages.has(ext)) {
							src = "/WebInterface/jQuery/images/fileExtensions/" + ext + "_"+iconSize+".png";
						} else {
							src = "/WebInterface/jQuery/images/fileExtensions/file" + "_"+iconSize+".png";
						}
						_generatedHTML = _generatedHTML.replace(/NAME/g, crushFTPTools.textEncode(unescape(curItem.name)));
						_generatedHTML = _generatedHTML.replace(/HREF/g, curItem.imageSrc);
						_generatedHTML = _generatedHTML.replace(/TITLE/g, encodeURI(crushFTPTools.textEncode(unescape(curItem.name))));
						_generatedHTML = _generatedHTML.replace(/CAPTION/g, crushFTPTools.textEncode(unescape(curItem.name)));
						_generatedHTML = _generatedHTML.replace(/SRC/g, src);
						_generatedHTML = _generatedHTML.replace(/ORIG/g, curItem.thumbSrc);
						_generatedHTML = _generatedHTML.replace(/DESCRIPTION/g, crushFTPTools.textEncode(unescape(curItem.desc)));
						_generatedHTML = _generatedHTML.replace(/PRIVS/g, escape(curItem.privs));
						_generatedHTML = _generatedHTML.replace(/PREVIEWS/g, curItem.preview);
						_generatedHTML = _generatedHTML.replace(/FULLPATH/g, escape(curItem.fileName));
						var previews = parseInt(curItem.preview);
						if(previews && previews!= NaN && previews>1)
							_generatedHTML = _generatedHTML.replace(/###/g, "<div class='multiImages'></div>");
						else
							_generatedHTML = _generatedHTML.replace(/###/g, "");
						_html.push(_generatedHTML);
					}
				}
				$("ul.thumbs").empty().append(_html.join("")).show();
				if(_html.length>0)
				{
					$("#pageLoadIndicator").hide();
					$.unblockUI();
					initSlideshow();
					setTimeout(function() {
						processImages();
						setTimeout(function() {
							processImages();
							setTimeout(function() {
								processImages();
							}, 500);
						}, 500);
					}, 300);
				}
				else
				{
					$("#pageLoadIndicator").replaceWith(window.slideshowLocalizations.noItemMessage).show();
					$("#container").hide();
					$.unblockUI();
					showActionControls(false, privs);
				}
			}
			else
			{
				$("#pageLoadIndicator").replaceWith(window.slideshowLocalizations.noItemMessage).show();
				$("#container").hide();
				$.unblockUI();
				showActionControls();
			}
		}, 'xml');
	}
	$(window).resize(function(){
		resetDimensions();
		setTimeout(function() {
			resetDimensions();
		}, 100);
	});
}

function processImages()
{
	var getFileExtension = function(filename) {
		var ext = /^.+\.([^.]+)$/.exec(filename);
		return ext === null ? "" : ext[1].toLowerCase();
	};
	var parentElem = $("ul.thumbs");
	var elem = $("img:visible", parentElem);
	// Loop through items and load preview icons, if icon not available generic icon will be shown
	elem.each(function () {
		var $curElem = $(this);
		var origSrc = $curElem.attr("_orig");
		if(!origSrc)
			return;
		$curElem.removeAttr("_orig");
		$curElem.attr("src", origSrc);
		// binds images' load event
		$curElem.unbind().bind("load", function (e) {
			var $this = $(this);
			$(this).removeAttr("width").removeAttr("height").css({
				width: "",
				height: ""
			});
			var pic_real_width = this.width;
			var pic_real_height = this.height;
            var imgRatio = pic_real_width / pic_real_height;
            var divH = $this.closest("li").height();
            var divW = $this.closest("li").width();
            var divRatio = divW / divH;
			// Calculate image's real width and height and fix it to fit to the image holder DIV
			if (pic_real_width < divW && pic_real_height < divH) {
				$this.css("height", "auto");
				$this.css("width", "auto");
			}
            else if (imgRatio > divRatio) {
				$this.css("height", "auto");
				$this.css("width", divW);
			} else {
				$this.css("width", "auto");
				$this.css("height", divH);
			}
			$this.unbind("load");
		}).error(function(){
			var fileName = $(this).closest("a").attr("title");
			var ext = getFileExtension(fileName);
			var iconSize = 48;
			if (window.availableFileExtensionImages.has(ext)) {
				$(this).attr("src", "/WebInterface/jQuery/images/fileExtensions/" + ext + "_"+iconSize+".png");
			} else {
				$(this).attr("src", "/WebInterface/jQuery/images/fileExtensions/file" + "_"+iconSize+".png").attr("style", "border:0px;");
			}
			if($(this).attr("defaultIco")){
				$(this).unbind("error");
				var src = $(this).attr("real-src") || $(this).attr("src");
				$(this).attr("real-src", src).attr("src", imagenotAvailable).attr("retry", "true");
			}
			else
				$(this).attr("defaultIco", "true");
			$(this).unbind("load");
		});
	});
}

function setSlideshowDelay(sec)
{
	if(window.cfgallery && window.cfgallery.delay){
		window.cfgallery.delay = sec * 1000;
	}
	window.delaySlider.parent().find(".delay").remove();
	window.delaySlider.parent().append("<div class='delay'>"+ window.slideshowLocalizations.delayText.replace("{x}", sec) +"</div>");
}

function bindMultipleFrameRolling()
{
	$('#thumbs ul.thumbs li').find(".multiImages").each(function(){
		var curElem = $(this).parent();
		curElem.bind("mousemove", function(evt){
			if($("a.quitPreview").length>0)return false;
			var totalFrames = parseInt(curElem.find("a.thumb").attr("previews"));
			if(!totalFrames || totalFrames == NaN || totalFrames<=1)return;
			var curImg = $(this).find("img");
			var mouse = {x:evt.clientX,y:evt.clientY};
			var div = {x:curElem.offset().left - $(window).scrollLeft(),y:curElem.offset().top - $(window).scrollTop()};
			var divWidth = curElem.width();
			var positionPerc = Math.round((100 * (mouse.x - div.x)) / divWidth);
			if(positionPerc > 100) positionPerc = 100;
			if(positionPerc <= 0) positionPerc = 1;
			var imageNo = Math.round((positionPerc * totalFrames) / 100);
			if(imageNo > totalFrames) imageNo = totalFrames;
			if(imageNo <= 0) imageNo = 1;
			var _fileName = curImg.attr("src");
			if(!_fileName)return;
			_fileName= _fileName.replace(_fileName.substring(_fileName.lastIndexOf("&frame=",_fileName.length-7)), "&frame=" + imageNo);
			curImg.unbind();
			curImg.attr("src", _fileName + '&c2f='+crushFTPTools.getCrushAuth());
			if(!curElem.hasClass("selected"))return;
			var previewImage = $("#slideshow").find("img");
			_fileName = previewImage.attr("src");
			if(!_fileName)return;
			_fileName= _fileName.replace(_fileName.substring(_fileName.lastIndexOf("&frame=",_fileName.length-7)), "&frame=" + imageNo);
			previewImage.attr("src", _fileName+ '&c2f='+crushFTPTools.getCrushAuth());
		}).mouseleave(function(){
			var curImg = $(this).find("img");
			var _fileName = curImg.attr("src");
			if(!_fileName)return;
			_fileName= _fileName.replace(_fileName.substring(_fileName.lastIndexOf("&frame=",_fileName.length-7)), "&frame=1");
			curImg.unbind();
			curImg.attr("src", _fileName+ '&c2f='+crushFTPTools.getCrushAuth());
			if(!curElem.hasClass("selected"))return;
			var previewImage = $("#slideshow").find("img");
			_fileName = previewImage.attr("src");
			if(!_fileName)return;
			_fileName= _fileName.replace(_fileName.substring(_fileName.lastIndexOf("&frame=",_fileName.length-7)), "&frame=1");
			previewImage.attr("src", _fileName+ '&c2f='+crushFTPTools.getCrushAuth());
		});
	});
}

function applySlideshowLocalizations()
{
	var itemControls = $("#itemControls");
	itemControls.find(".refreshButtonSS").text(window.slideshowLocalizations.refresh);
	itemControls.find(".fullscreenButton").text(window.slideshowLocalizations.fullscreen);
	itemControls.find(".downloadButton").text(window.slideshowLocalizations.download);
	itemControls.find(".uploadButton").text(window.slideshowLocalizations.upload);
	itemControls.find(".deleteButton").text(window.slideshowLocalizations.deleteText);
	itemControls.find(".rotateClockwise").text(window.slideshowLocalizations.rotateClockwise);
	itemControls.find(".rotateCounterClockwise").text(window.slideshowLocalizations.rotateCounterClockwise);
	$('.waitmsg').text(window.slideshowLocalizations.waitMessage);
}

function initSlideshow()
{
	if($.browser.msie && $.browser.version <= 8)
	{
		$("#itemControls").addClass("buggyBrowser");
	}
	// We only want these styles applied when javascript is enabled
	$('div.content').css('display', 'block');
	// Initially set opacity on thumbs and add
	// additional styling for hover effect on thumbs
	var onMouseOutOpacity = 0.67;

	$('#thumbs ul.thumbs li').opacityrollover({
		mouseOutOpacity:   onMouseOutOpacity,
		mouseOverOpacity:  1.0,
		fadeSpeed:         'fast',
		exemptionSelector: '.selected'
	});

	window.delaySlider = $("#slider").slider({
		min: 1,
		max: 15,
		value : 3,
		slide: function (event, ui) {
			setSlideshowDelay(ui.value);
		}
	});

	$("#slider").hide();
	var numThumbs = window.slideshowThumbsCount || 3;
	// Initialize Advanced Galleriffic Gallery
	window.cfgallery = $('#thumbs').galleriffic({
		delay:                     3000,
		numThumbs:                 numThumbs,
		preloadAhead:              -1,
		enableTopPager:            false,
		enableBottomPager:         true,
		maxPagesToShow:            10,
		imageContainerSel:         '#slideshow',
		controlsContainerSel:      '#controls',
		captionContainerSel:       '#caption',
		loadingContainerSel:       '#loading',
		renderSSControls:          true,
		renderNavControls:         true,
		playLinkText:              window.slideshowLocalizations.playSlideshow,
		pauseLinkText:             window.slideshowLocalizations.pauseSlideshow,
		prevLinkText:              window.slideshowLocalizations.previousItem,
		nextLinkText:              window.slideshowLocalizations.nextItem,
		nextPageLinkText:          window.slideshowLocalizations.nextPageText,
		prevPageLinkText:          window.slideshowLocalizations.prevPageText,
		autoStart:                 false,
		syncTransitions:           false,
		defaultTransitionDuration: 0,
		onSlideChange:             function(prevIndex, nextIndex) {
			// 'this' refers to the gallery, which is an extension of $('#thumbs')
			resetHeightForSlideshowOnlyMode();
			this.find('ul.thumbs').children()
				.eq(prevIndex).fadeTo(0, 1).end()
				.eq(nextIndex).fadeTo(0, 1);
			showActionControls(nextIndex);
			// Update the photo index display
			$('div.photo-index').html(window.slideshowLocalizations.itemCountText.replace("{x}", (nextIndex+1)).replace("{y}", this.data.length));
			resetHeightForSlideshowOnlyMode();
			resetDimensions();
		},
		onTransitionOut: function(slide, caption, isSync, callback) {
			resetHeightForSlideshowOnlyMode();
			slide.fadeTo(this.getDefaultTransitionDuration(isSync), 0.0, callback);
			caption.fadeTo(this.getDefaultTransitionDuration(isSync), 0.0);
			resetHeightForSlideshowOnlyMode();
		},
		onTransitionIn: function(slide, caption, isSync) {
			resetHeightForSlideshowOnlyMode();
			var duration = this.getDefaultTransitionDuration(isSync);
			slide.fadeTo(duration, 1.0, function(){
				resetDimensions();
			});
			// Position the caption at the bottom of the image and set its opacity
			var slideImage = slide.find('img');
			caption.width(slideImage.width())
				.css({
					'bottom' : Math.floor((slide.height() - slideImage.outerHeight()) / 2),
					'left' : Math.floor((slide.width() - slideImage.width()) / 2) + slideImage.outerWidth() - slideImage.width()
				})
				.fadeTo(duration, 1);
			resetHeightForSlideshowOnlyMode();
		},
		onPageTransitionOut:       function(callback) {
			this.fadeTo(0, 0.0, callback);
			resetHeightForSlideshowOnlyMode();
		},
		onPageTransitionIn:        function() {
			this.fadeTo(0, 1.0);
			resetHeightForSlideshowOnlyMode();
			processImages();
		}
	});

	resetDimensions();

	resetHeightForSlideshowOnlyMode();

	bindMultipleFrameRolling();

	var curImage = $(document).data("curImage");
	if(curImage)
	{
		try{
			var curElem = $("#thumbs").find("img[alt='"+curImage+"']").closest("a");
			if(!curElem.closest("li").hasClass("selected"))
			{
				curElem.click();
			}
		}catch(ex){}
	}

	/**************** Event handlers for custom next / prev page links **********************/

	cfgallery.find('a.prev').click(function(e) {
		cfgallery.previousPage();
		e.preventDefault();
	});

	cfgallery.find('a.next').click(function(e) {
		cfgallery.nextPage();
		e.preventDefault();
	});

	$('a.play').click(function(e) {
		$(this).blur();
		e.preventDefault();
	});
};

function bindActionControlsEvents()
{
	var itemControls = $("#itemControls");

	$(".refreshButtonSS",itemControls).unbind().click(function(){
		initSlideShowEvents();
	});

	$(".downloadButton",itemControls).unbind().click(function(){
		var elem = $(this).data("curItem");
		var curDir = $(document).data("curDir");
		var path = curDir + elem.attr("title");
		window.downloadItems(false,path);
	});

	$(".uploadButton",itemControls).unbind().click(function(){
		var elem = $(this).data("curItem");
		window.performAction("upload");
		return false;
	});

	$(".deleteButton",itemControls).unbind().click(function(){
		var elem = $(this).data("curItem");
		var curDir = $(document).data("curDir");
		var path = curDir + elem.attr("title");
		if(confirm("Are you sure you wish to delete " + path + " ?\n" + "Once deleted it can not revert back"))
		{
			window.performDeleteAction(path, function(error){
				if(error)
					alert("There was a problem while deleting selected item, try again");
				else
					initSlideShowEvents();
			});
		}
	});

	$(".fullscreenButton",itemControls).unbind().click(function(){
		var url = window.location;
		var w = screen.availWidth - 15;
		var h = screen.availHeight - 60;
		var opts = "location=no,menubar=no,scrollbars=no,status=no,toolbar=no,resizable=no,width=" + w +"px,height=" + h + "px";
		var curImg = $(".selected a").attr("href");
		if(curImg)
			curImg = curImg.replace(/#/g,"");
		if(url.toString().indexOf("#")>=0)
		{
			url = url + "^^^" + curImg;
		}
		else
		{
			url = url + "#/^^^" + curImg;
		}
		window.open(url, '', opts);
		if(window.parent.window.closeSlideshow)
			window.parent.window.closeSlideshow();
	});

	$(".rotateClockwise, .rotateCounterClockwise",itemControls).unbind().click(function(){
		rotateImage($(this).is(".rotateCounterClockwise"));
		$(this).blur();
		try{
			window.cfgallery.pause();
		}catch(ex){}
		return false;
	});
}

function rotateImage(flag)
{
	var imgControl = $("#slideshow").find("img");
	if($("#slideshow").find("div.previewPanel").length>0)return;
	var curAngle = imgControl.attr("curAngle") || 0;
	curAngle = parseInt(curAngle);
	var oldAngle = parseInt(curAngle);
	if(curAngle == -360 || curAngle == 360) curAngle=0;
	if(flag)
		curAngle -= 90;
	else
		curAngle += 90;
	if(curAngle == -360 || curAngle == 360) curAngle = 0;
	imgControl.rotate({
	    angle: oldAngle,
	    animateTo: curAngle
	});
	imgControl.attr("curAngle", curAngle);
	resetDimensions();
}

function showActionControls(nextIndex, privs)
{
	var itemControls = $("#itemControls");
	var item = [];
	if(!privs)
	{
		try{
			var $thumbs = $('ul.thumbs').children();
			item = $thumbs.eq(nextIndex);
			item = item.find("a");
			privs = unescape(item.attr("privs"));
		}
		catch(e){}
	}

	if(privs)
	{
		var _delete = privs.indexOf("(delete)")>=0;
		var _write = privs.indexOf("(write)")>=0;
		var _download = privs.indexOf("(read)")>=0;
		var _fullscreen = (top != self);
		itemControls.show();
		$(".downloadButton",itemControls).toggle(_download).data("curItem",item);
		$(".uploadButton",itemControls).toggle(_write).data("curItem",item);
		$(".deleteButton",itemControls).toggle(_delete).data("curItem",item);
		$(".fullscreenButton",itemControls).toggle(_fullscreen);
		if(!_write)
		{
			$("#fileQueueInfo").hide();
		}
		else
		{
			$("#fileQueueInfo").show();
		}
		if(!_fullscreen)
		{
			$("body").addClass("fullscreenSS");
		}
	}
	else
	{
		$(".downloadButton,.uploadButton,.deleteButton",itemControls).hide();
	}
}

function slideshowStatusChange(flag)
{
	if(!flag)
	{
		$("#slider").hide();
		window.delaySlider.parent().find(".delay").remove();
	}
	else
	{
		$("#slider").show();
		window.delaySlider.parent().append("<div class='delay'>"+ window.slideshowLocalizations.delayText.replace("{x}", window.delaySlider.slider("value")) +"</div>");
	}
}

function initSlideShowEvents()
{
	window.slideshowLocalizations = {
		waitMessage : "Please wait...",
		playSlideshow : "Play Slideshow",
		pauseSlideshow : "Pause Slideshow",
		refresh : "Refresh",
		fullscreen : "Fullscreen",
		download : "Download",
		upload : "Upload",
		deleteText : "Delete",
		rotateClockwise : "Rotate Clockwise",
		rotateCounterClockwise : "Rotate Counter-Clockwise",
		previousItem : "Previous Item",
		nextItem : "Next Item",
		delayText : "(Delay {x} seconds)",
		nextPageText : "Next &rsaquo;",
		prevPageText : "&lsaquo; Prev",
		itemCountText : "(Item {x} of {y})",
		noItemMessage : "<h3 style='text-align:center;'>No items available, or problem while fetching records.</h3>"
	};
	if(window.localizations && window.localizations.slideshow)
	{
		window.slideshowLocalizations = $.extend(window.slideshowLocalizations, window.localizations.slideshow);
	}
	if(window.persistentLocalizationStrings && window.persistentLocalizationStrings.slideshow)
	{
		window.slideshowLocalizations = $.extend({}, window.slideshowLocalizations, window.persistentLocalizationStrings.slideshow);
	}
	applySlideshowLocalizations();
	setTimeout(function(){
		applySlideshowLocalizations()
	}, 100);
	$.blockUI({
		message : "<h1 class='.waitmsg'>"+window.slideshowLocalizations.waitMessage+"</h1>",
		css: {
			border: 'none',
			padding: '15px',
			backgroundColor: '#fff',
			'-webkit-border-radius': '10px',
			'-moz-border-radius': '10px',
			opacity: .7,
			color: '#000',
			top : '5%'
	    }
	});

	var loc = unescape(document.location.hash);
	loc = loc.toString().replace("#", "") || "/";
	var curImageIndex = loc.indexOf("^^^");
	var fromBasket = document.location.toString().indexOf("fromBasket=true")>0;
	if(curImageIndex>=0)
	{
		var curImage = loc.substring(curImageIndex + 3, loc.length);
		$(document).data("curImage",curImage);
		loc = loc.replace("^^^"+curImage,"");
	}

	$(document).data("curDir",loc);
	var _path = "";
	try{
        _path = crushFTPTools.decodeURILocal(loc);
        _path = crushFTPTools.encodeURILocal(unescape(unescape(loc)));
    }
    catch(ex)
    {
        _path = crushFTPTools.encodeURILocal(loc);
    }
	fetchItems(_path, fromBasket);
	$(document).data("slideShowOnly",true);
	bindActionControlsEvents();
	$('#filesContainer').fileTree({
		root: loc,
		overrideFromHash: true,
		expandSpeed: 1000,
		collapseSpeed: 1000,
		multiFolder: true,
		customData: true
	}, function(link) {
		window.open(link);
	});
}