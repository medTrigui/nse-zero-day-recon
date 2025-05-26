/**
 * jQuery Galleriffic plugin
 *
 * Copyright (c) 2008 Trent Foley (http://trentacular.com)
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Much thanks to primary contributer Ponticlaro (http://www.ponticlaro.com)
 */
;(function($) {
	// Globally keep track of all images by their unique hash.  Each item is an image data object.
	var allImages = {};
	var imageCounter = 0;

	// Galleriffic static class
	$.galleriffic = {
		version: '2.0.1',

		// Strips invalid characters and any leading # characters
		normalizeHash: function(hash) {
			return hash.replace(/^.*#/, '').replace(/\?.*$/, '');
		},

		getImage: function(hash) {
			if (!hash)
				return undefined;

			hash = $.galleriffic.normalizeHash(hash);
			return allImages[hash];
		},

		// Global function that looks up an image by its hash and displays the image.
		// Returns false when an image is not found for the specified hash.
		// @param {String} hash This is the unique hash value assigned to an image.
		gotoImage: function(hash) {
			var imageData = $.galleriffic.getImage(hash);
			if (!imageData)
				return false;

			var gallery = imageData.gallery;
			gallery.gotoImage(imageData);
			return true;
		},

		// Removes an image from its respective gallery by its hash.
		// Returns false when an image is not found for the specified hash or the
		// specified owner gallery does match the located images gallery.
		// @param {String} hash This is the unique hash value assigned to an image.
		// @param {Object} ownerGallery (Optional) When supplied, the located images
		// gallery is verified to be the same as the specified owning gallery before
		// performing the remove operation.
		removeImageByHash: function(hash, ownerGallery) {
			var imageData = $.galleriffic.getImage(hash);
			if (!imageData)
				return false;

			var gallery = imageData.gallery;
			if (ownerGallery && ownerGallery != gallery)
				return false;

			return gallery.removeImageByIndex(imageData.index);
		}
	};

	var defaults = {
		delay:                     3000,
		numThumbs:                 20,
		preloadAhead:              -1, // Set to -1 to preload all images
		enableTopPager:            false,
		enableBottomPager:         true,
		maxPagesToShow:            7,
		imageContainerSel:         '',
		captionContainerSel:       '',
		controlsContainerSel:      '',
		loadingContainerSel:       '',
		renderSSControls:          true,
		renderNavControls:         true,
		playLinkText:              'Play',
		pauseLinkText:             'Pause',
		prevLinkText:              'Previous',
		nextLinkText:              'Next',
		nextPageLinkText:          'Next &rsaquo;',
		prevPageLinkText:          '&lsaquo; Prev',
		enableHistory:             false,
		enableKeyboardNavigation:  true,
		autoStart:                 false,
		syncTransitions:           false,
		defaultTransitionDuration: 1000,
		onSlideChange:             undefined, // accepts a delegate like such: function(prevIndex, nextIndex) { ... }
		onTransitionOut:           undefined, // accepts a delegate like such: function(slide, caption, isSync, callback) { ... }
		onTransitionIn:            undefined, // accepts a delegate like such: function(slide, caption, isSync) { ... }
		onPageTransitionOut:       undefined, // accepts a delegate like such: function(callback) { ... }
		onPageTransitionIn:        undefined, // accepts a delegate like such: function() { ... }
		onImageAdded:              undefined, // accepts a delegate like such: function(imageData, $li) { ... }
		onImageRemoved:            undefined  // accepts a delegate like such: function(imageData, $li) { ... }
	};

	// Primary Galleriffic initialization function that should be called on the thumbnail container.
	$.fn.galleriffic = function(settings) {
		//  Extend Gallery Object
		$.extend(this, {
			// Returns the version of the script
			version: $.galleriffic.version,

			// Current state of the slideshow
			isSlideshowRunning: false,
			slideshowTimeout: undefined,

			// This function is attached to the click event of generated hyperlinks within the gallery
			clickHandler: function(e, link) {
				this.pause();

				if (!this.enableHistory) {
					// The href attribute holds the unique hash for an image
					var hash = $.galleriffic.normalizeHash($(link).attr('href'));
					$.galleriffic.gotoImage(hash);
					e.preventDefault();
				}
			},

			// Appends an image to the end of the set of images.  Argument listItem can be either a jQuery DOM element or arbitrary html.
			// @param listItem Either a jQuery object or a string of html of the list item that is to be added to the gallery.
			appendImage: function(listItem) {
				this.addImage(listItem, false, false);
				return this;
			},

			// Inserts an image into the set of images.  Argument listItem can be either a jQuery DOM element or arbitrary html.
			// @param listItem Either a jQuery object or a string of html of the list item that is to be added to the gallery.
			// @param {Integer} position The index within the gallery where the item shouold be added.
			insertImage: function(listItem, position) {
				this.addImage(listItem, false, true, position);
				return this;
			},

			// Adds an image to the gallery and optionally inserts/appends it to the DOM (thumbExists)
			// @param listItem Either a jQuery object or a string of html of the list item that is to be added to the gallery.
			// @param {Boolean} thumbExists Specifies whether the thumbnail already exists in the DOM or if it needs to be added.
			// @param {Boolean} insert Specifies whether the the image is appended to the end or inserted into the gallery.
			// @param {Integer} position The index within the gallery where the item shouold be added.
			addImage: function(listItem, thumbExists, insert, position) {
				var $li = ( typeof listItem === "string" ) ? $(listItem) : listItem;
				var $aThumb = $li.find('a.thumb');
				var slideUrl = $aThumb.attr('href');
				var title = $aThumb.attr('title');
				var $caption = $li.find('.caption').remove();
				var hash = $aThumb.attr('name');
				var previews = parseInt($aThumb.attr('previews'));
				var fullPath = $aThumb.attr('fullPath');

				// Increment the image counter
				imageCounter++;

				// Autogenerate a hash value if none is present or if it is a duplicate
				if (!hash || allImages[''+hash]) {
					hash = imageCounter;
				}

				// Set position to end when not specified
				if (!insert)
					position = this.data.length;

				var imageData = {
					title:title,
					slideUrl:slideUrl,
					caption:$caption,
					hash:hash,
					gallery:this,
					index:position,
					previews:previews,
					fullPath:fullPath
				};

				// Add the imageData to this gallery's array of images
				if (insert) {
					this.data.splice(position, 0, imageData);

					// Reset index value on all imageData objects
					this.updateIndices(position);
				}
				else {
					this.data.push(imageData);
				}

				var gallery = this;

				// Add the element to the DOM
				if (!thumbExists) {
					// Update thumbs passing in addition post transition out handler
					this.updateThumbs(function() {
						var $thumbsUl = gallery.find('ul.thumbs');
						if (insert)
							$thumbsUl.children(':eq('+position+')').before($li);
						else
							$thumbsUl.append($li);

						if (gallery.onImageAdded)
							gallery.onImageAdded(imageData, $li);
					});
				}

				// Register the image globally
				allImages[''+hash] = imageData;

				// Setup attributes and click handler
				$aThumb.attr('rel', 'history')
					.attr('href', '#'+hash)
					.removeAttr('name')
					.click(function(e) {
						gallery.clickHandler(e, this);
					});

				return this;
			},

			// Removes an image from the gallery based on its index.
			// Returns false when the index is out of range.
			removeImageByIndex: function(index) {
				if (index < 0 || index >= this.data.length)
					return false;

				var imageData = this.data[index];
				if (!imageData)
					return false;

				this.removeImage(imageData);

				return true;
			},

			// Convenience method that simply calls the global removeImageByHash method.
			removeImageByHash: function(hash) {
				return $.galleriffic.removeImageByHash(hash, this);
			},

			// Removes an image from the gallery.
			removeImage: function(imageData) {
				var index = imageData.index;

				// Remove the image from the gallery data array
				this.data.splice(index, 1);

				// Remove the global registration
				delete allImages[''+imageData.hash];

				// Remove the image's list item from the DOM
				this.updateThumbs(function() {
					var $li = gallery.find('ul.thumbs')
						.children(':eq('+index+')')
						.remove();

					if (gallery.onImageRemoved)
						gallery.onImageRemoved(imageData, $li);
				});

				// Update each image objects index value
				this.updateIndices(index);

				return this;
			},

			// Updates the index values of the each of the images in the gallery after the specified index
			updateIndices: function(startIndex) {
				for (i = startIndex; i < this.data.length; i++) {
					this.data[i].index = i;
				}

				return this;
			},

			// Scraped the thumbnail container for thumbs and adds each to the gallery
			initializeThumbs: function() {
				this.data = [];
				var gallery = this;

				this.find('ul.thumbs > li').each(function(i) {
					gallery.addImage($(this), true, false);
				});

				return this;
			},

			isPreloadComplete: false,

			// Initalizes the image preloader
			preloadInit: function() {
				//if (this.preloadAhead == 0) return this;
				this.preloadStartIndex = this.currentImage.index;
				var nextIndex = this.getNextIndex(this.preloadStartIndex);
				return this.preloadRecursive(this.preloadStartIndex, nextIndex);
			},

			// Changes the location in the gallery the preloader should work
			// @param {Integer} index The index of the image where the preloader should restart at.
			preloadRelocate: function(index) {
				// By changing this startIndex, the current preload script will restart
				this.preloadStartIndex = index;
				return this;
			},

			// Recursive function that performs the image preloading
			// @param {Integer} startIndex The index of the first image the current preloader started on.
			// @param {Integer} currentIndex The index of the current image to preload.
			preloadRecursive: function(startIndex, currentIndex) {
				// Check if startIndex has been relocated
				if (startIndex != this.preloadStartIndex) {
					var nextIndex = this.getNextIndex(this.preloadStartIndex);
					return this.preloadRecursive(this.preloadStartIndex, nextIndex);
				}

				var gallery = this;

				// Now check for preloadAhead count
				var preloadCount = currentIndex - startIndex;
				if (preloadCount < 0)
					preloadCount = this.data.length-1-startIndex+currentIndex;
				if (this.preloadAhead >= 0 && preloadCount > this.preloadAhead)
				{
					// Do this in order to keep checking for relocated start index
					setTimeout(function() { gallery.preloadRecursive(startIndex, currentIndex); }, 500);
					return this;
				}

				var imageData = this.data[currentIndex];
				if (!imageData)
					return this;

				// If already loaded, continue
				if (imageData.image)
					return this.preloadNext(startIndex, currentIndex);

				// Preload the image
				var image = new Image();

				image.onload = function() {
					imageData.image = this;
					gallery.preloadNext(startIndex, currentIndex);
				};

				$(image).bind("error", function(){
					$(this).unbind("error");
					var src = $(this).attr("real-src") || $(this).attr("src");
					var alt = $(this).attr("alt");
					imageData.image = $("<img alt='"+alt+"' real-src='"+src+"' src='"+imagenotAvailable+"' retry='true' />").get(0);
					$(image).unbind("error");
					gallery.preloadNext(startIndex, currentIndex);
				});

				image.alt = imageData.title;
				image.src = imageData.slideUrl;

				return this;
			},

			// Called by preloadRecursive in order to preload the next image after the previous has loaded.
			// @param {Integer} startIndex The index of the first image the current preloader started on.
			// @param {Integer} currentIndex The index of the current image to preload.
			preloadNext: function(startIndex, currentIndex) {
				var nextIndex = this.getNextIndex(currentIndex);
				if (nextIndex == startIndex) {
					this.isPreloadComplete = true;
				} else {
					// Use setTimeout to free up thread
					var gallery = this;
					setTimeout(function() { gallery.preloadRecursive(startIndex, nextIndex); }, 100);
				}

				return this;
			},

			// Safe way to get the next image index relative to the current image.
			// If the current image is the last, returns 0
			getNextIndex: function(index) {
				var nextIndex = index+1;
				if (nextIndex >= this.data.length)
					nextIndex = 0;
				return nextIndex;
			},

			// Safe way to get the previous image index relative to the current image.
			// If the current image is the first, return the index of the last image in the gallery.
			getPrevIndex: function(index) {
				var prevIndex = index-1;
				if (prevIndex < 0)
					prevIndex = this.data.length-1;
				return prevIndex;
			},

			// Pauses the slideshow
			pause: function() {
				this.isSlideshowRunning = false;
				if (this.slideshowTimeout) {
					clearTimeout(this.slideshowTimeout);
					this.slideshowTimeout = undefined;
				}

				if (this.$controlsContainer) {
					this.$controlsContainer
						.find('div.ss-controls a').removeClass().addClass('play')
						.attr('title', this.playLinkText)
						.attr('href', '#play')
						.html(this.playLinkText);
				}
				slideshowStatusChange(this.isSlideshowRunning);
				return this;
			},

			// Plays the slideshow
			play: function() {
				this.isSlideshowRunning = true;

				if (this.$controlsContainer) {
					this.$controlsContainer
						.find('div.ss-controls a').removeClass().addClass('pause')
						.attr('title', this.pauseLinkText)
						.attr('href', '#pause')
						.html(this.pauseLinkText);
				}
				setTimeout(function(){
					if($("#slideshow").find(".previewIcon").length>0)
					{
						$("#slideshow").find(".previewIcon").click();
						window.slideshowMediaPlay = true;
					}
				}, 100);
				if (!this.slideshowTimeout) {
					var gallery = this;
					this.slideshowTimeout = setTimeout(function() { gallery.ssAdvance(); }, this.delay);
				}
				slideshowStatusChange(this.isSlideshowRunning);
				return this;
			},

			// Toggles the state of the slideshow (playing/paused)
			toggleSlideshow: function() {
				if (this.isSlideshowRunning)
				{
					window.slideshowMediaPlay = false;
					this.pause();
				}
				else
					this.play();

				return this;
			},

			// Advances the slideshow to the next image and delegates navigation to the
			// history plugin when history is enabled
			// enableHistory is true
			ssAdvance: function() {
				if (this.isSlideshowRunning && !window.slideshowMediaPlay)
					this.next(true);
				return this;
			},

			// Advances the gallery to the next image.
			// @param {Boolean} dontPause Specifies whether to pause the slideshow.
			// @param {Boolean} bypassHistory Specifies whether to delegate navigation to the history plugin when history is enabled.
			next: function(dontPause, bypassHistory) {
				this.gotoIndex(this.getNextIndex(this.currentImage.index), dontPause, bypassHistory);
				return this;
			},

			// Navigates to the previous image in the gallery.
			// @param {Boolean} dontPause Specifies whether to pause the slideshow.
			// @param {Boolean} bypassHistory Specifies whether to delegate navigation to the history plugin when history is enabled.
			previous: function(dontPause, bypassHistory) {
				this.gotoIndex(this.getPrevIndex(this.currentImage.index), dontPause, bypassHistory);
				return this;
			},

			// Navigates to the next page in the gallery.
			// @param {Boolean} dontPause Specifies whether to pause the slideshow.
			// @param {Boolean} bypassHistory Specifies whether to delegate navigation to the history plugin when history is enabled.
			nextPage: function(dontPause, bypassHistory) {
				var page = this.getCurrentPage();
				var lastPage = this.getNumPages() - 1;
				if (page < lastPage) {
					var startIndex = page * this.numThumbs;
					var nextPage = startIndex + this.numThumbs;
					this.gotoIndex(nextPage, dontPause, bypassHistory);
				}

				return this;
			},

			// Navigates to the previous page in the gallery.
			// @param {Boolean} dontPause Specifies whether to pause the slideshow.
			// @param {Boolean} bypassHistory Specifies whether to delegate navigation to the history plugin when history is enabled.
			previousPage: function(dontPause, bypassHistory) {
				var page = this.getCurrentPage();
				if (page > 0) {
					var startIndex = page * this.numThumbs;
					var prevPage = startIndex - this.numThumbs;
					this.gotoIndex(prevPage, dontPause, bypassHistory);
				}

				return this;
			},

			// Navigates to the image at the specified index in the gallery
			// @param {Integer} index The index of the image in the gallery to display.
			// @param {Boolean} dontPause Specifies whether to pause the slideshow.
			// @param {Boolean} bypassHistory Specifies whether to delegate navigation to the history plugin when history is enabled.
			gotoIndex: function(index, dontPause, bypassHistory) {
				if (!dontPause)
					this.pause();

				if (index < 0) index = 0;
				else if (index >= this.data.length) index = this.data.length-1;

				var imageData = this.data[index];

				if (!bypassHistory && this.enableHistory)
					$.historyLoad(String(imageData.hash));  // At the moment, historyLoad only accepts string arguments
				else
					this.gotoImage(imageData);
				setTimeout(function(){
					if($("#slideshow").find(".previewIcon").length>0 && !window.slideshowMediaPlay && index>0)
					{
						$("#slideshow").find(".previewIcon").click();
						window.slideshowMediaPlay = true;
					}
					gallery.preloadInit();
				}, 100);
				return this;
			},

			// This function is garaunteed to be called anytime a gallery slide changes.
			// @param {Object} imageData An object holding the image metadata of the image to navigate to.
			gotoImage: function(imageData) {
				var that = this;
				var index = imageData.index;
				if (this.onSlideChange)
					this.onSlideChange(this.currentImage.index, index);
				this.currentImage = imageData;
				this.preloadRelocate(index);
				this.refresh();
				var img = $("#slideshow").find("img");
				var selectedThumb = $('#thumbs').find("li.selected").find("img");
				function retryFail(elm, iconSize){
					var getFileExtension = function(filename) {
						var ext = /^.+\.([^.]+)$/.exec(filename);
						return ext == null ? "" : ext[1].toLowerCase();
					}
					var fileName = $(elm).attr("alt");
					var ext = getFileExtension(fileName);
					if (window.availableFileExtensionImages.has(ext)) {
						$(elm).attr("src", "/WebInterface/jQuery/images/fileExtensions/" + ext + "_"+iconSize+".png");
					} else {
						$(elm).attr("src", "/WebInterface/jQuery/images/fileExtensions/file" + "_"+iconSize+".png").attr("style", "border:0px;");
					}
					if($(elm).attr("defaultIco")){
						$(elm).unbind("error.retry");
						var src = $(elm).attr("real-src") || $(elm).attr("src");
						$(elm).attr("real-src", src).attr("src", imagenotAvailable).attr("retry", "true");
					}
					else
						$(elm).attr("defaultIco", "true");
				}
				if(img.attr("retry")){
					var src = img.attr("real-src");
					if(src)
					{
						$(img).attr("src", src);
						$(img).bind("error.retry", function(){
							retryFail($(this), 512);
							var imageData = that.currentImage;
							gallery.buildImage(imageData, true);
						}).bind("load.retry", function(){
							var imageData = that.currentImage;
							gallery.buildImage(imageData, true);
							$(this).unbind("load.retry");
						});
					}
				}
				if(selectedThumb.attr("retry")){
					var src = selectedThumb.attr("real-src");
					if(src)
					{
						$(selectedThumb).attr("src", src);
						$(selectedThumb).bind("error.retry", function(){
							retryFail($(this), 48);
							var imageData = that.currentImage;
							gallery.buildImage(imageData, true);
						});
					}
				}
				return this;
			},

			// Returns the default transition duration value.  The value is halved when not
			// performing a synchronized transition.
			// @param {Boolean} isSync Specifies whether the transitions are synchronized.
			getDefaultTransitionDuration: function(isSync) {
				if (isSync)
					return this.defaultTransitionDuration;
				return this.defaultTransitionDuration / 2;
			},

			// Rebuilds the slideshow image and controls and performs transitions
			refresh: function() {
				var imageData = this.currentImage;
				if (!imageData)
					return this;

				var index = imageData.index;

				// Update Controls
				if (this.$controlsContainer) {
					this.$controlsContainer
						.find('div.nav-controls a.prev').attr('href', '#'+this.data[this.getPrevIndex(index)].hash).end()
						.find('div.nav-controls a.next').attr('href', '#'+this.data[this.getNextIndex(index)].hash);
				}

				var previousSlide = this.$imageContainer.find('span.current').addClass('previous').removeClass('current');
				var previousCaption = 0;

				if (this.$captionContainer) {
					previousCaption = this.$captionContainer.find('span.current').addClass('previous').removeClass('current');
				}

				// Perform transitions simultaneously if syncTransitions is true and the next image is already preloaded
				var isSync = this.syncTransitions && imageData.image;

				// Flag we are transitioning
				var isTransitioning = true;
				var gallery = this;

				var transitionOutCallback = function() {
					// Flag that the transition has completed
					isTransitioning = false;

					// Remove the old slide
					previousSlide.remove();

					// Remove old caption
					if (previousCaption)
						previousCaption.remove();

					if (!isSync) {
						if (imageData.image && imageData.hash == gallery.data[gallery.currentImage.index].hash) {
							gallery.buildImage(imageData, isSync);
						} else {
							// Show loading container
							if (gallery.$loadingContainer) {
								gallery.$loadingContainer.show();
							}
						}
					}
				};

				if (previousSlide.length == 0) {
					// For the first slide, the previous slide will be empty, so we will call the callback immediately
					transitionOutCallback();
				} else {
					if (this.onTransitionOut) {
						this.onTransitionOut(previousSlide, previousCaption, isSync, transitionOutCallback);
					} else {
						previousSlide.fadeTo(this.getDefaultTransitionDuration(isSync), 0.0, transitionOutCallback);
						if (previousCaption)
							previousCaption.fadeTo(this.getDefaultTransitionDuration(isSync), 0.0);
					}
				}

				// Go ahead and begin transitioning in of next image
				if (isSync)
					this.buildImage(imageData, isSync);

				if (!imageData.image) {
					var image = new Image();

					// Wire up mainImage onload event
					image.onload = function(evt) {
						imageData.image = this;

						// Only build image if the out transition has completed and we are still on the same image hash
						if (!isTransitioning && imageData.hash == gallery.data[gallery.currentImage.index].hash) {
							gallery.buildImage(imageData, isSync);
						}
					};

					$(image).bind("error", function(){
						var getFileExtension = function(filename) {
							var ext = /^.+\.([^.]+)$/.exec(filename);
							return ext == null ? "" : ext[1].toLowerCase();
						}
						var fileName = $(this).attr("alt");
						var ext = getFileExtension(fileName);
						var iconSize = 512;
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
					});
					// set alt and src
					image.alt = imageData.title;
					image.src = imageData.slideUrl;
				}
				// This causes the preloader (if still running) to relocate out from the currentIndex
				this.relocatePreload = true;
				return this.syncThumbs();
			},

			// Called by the refresh method after the previous image has been transitioned out or at the same time
			// as the out transition when performing a synchronous transition.
			// @param {Object} imageData An object holding the image metadata of the image to build.
			// @param {Boolean} isSync Specifies whether the transitions are synchronized.
			buildImage: function(imageData, isSync) {
				var gallery = this;
				var nextIndex = this.getNextIndex(imageData.index);

				if(this.$imageContainer.find("span.image-wrapper").length>0)return;
				// Construct new hidden span for the image
				var newSlide = this.$imageContainer
					.append('<span class="image-wrapper current"><a class="advance-link" rel="history" href="#'+this.data[nextIndex].hash+'" title="'+imageData.title+'">&nbsp;</a></span>')
					.find('span.current').css('opacity', '0');

				newSlide.find('a')
					.append(imageData.image)
					.click(function(e) {
						gallery.clickHandler(e, this);
					});

				var newCaption = 0;
				if (this.$captionContainer) {
					// Construct new hidden caption for the image
					newCaption = this.$captionContainer
						.append('<span class="image-caption current"></span>')
						.find('span.current').css('opacity', '0')
						.append(imageData.caption)
						.data("nextIndex", nextIndex);
				}

				// Hide the loading conatiner
				if (this.$loadingContainer) {
					this.$loadingContainer.hide();
				}

				// Transition in the new image
				if (this.onTransitionIn) {
					this.onTransitionIn(newSlide, newCaption, isSync);
				} else {
					newSlide.fadeTo(this.getDefaultTransitionDuration(isSync), 1.0);
					if (newCaption)
						newCaption.fadeTo(this.getDefaultTransitionDuration(isSync), 1.0);
				}

				if (this.isSlideshowRunning) {
					if (this.slideshowTimeout)
						clearTimeout(this.slideshowTimeout);

					this.slideshowTimeout = setTimeout(function() { gallery.ssAdvance(); }, this.delay);
				}
				this.setupCrushFTPEvents(imageData, this.$imageContainer, this.find('ul.thumbs').find("li"), this);
				return this;
			},

			//Preview media files
			previewMedia: function(content, _fileName, ext, dim)
			{
				content.empty();
				var width = dim.width;
				var height = dim.height - 10;
				content.append("Please wait..");
				function showPreview()
                {
                    setTimeout(function(){
                        var mimeType = mimeTypes[ext] || mimeTypes["*"];
                        var path = "/WebInterface/function/?command=download&random="+Math.random()+"&mimeType="+crushFTPTools.encodeURILocal(mimeType) + "&path="+crushFTPTools.encodeURILocal(_fileName).replace(/\&/g, "%26")+"&c2f="+crushFTPTools.getCrushAuth();
					var hasPreview = false;
                        if(ext == "flv")
                        {
                            content.empty().append("<a href=\""+path+"\" class=\"media {flashvars: { flv: '"+encodeURIComponent(path)+"'}, width:"+width+", height:"+height+"}\">Preview : \""+ _fileName.replace(/\&/g, "%26") +"\"</a> ");
							content.find("a.media").media({
								params :{
									movie : '/WebInterface/jQuery/js/player_flv_maxi.swf',
									autoplay : '1',
									autoload : '1',
									showstop : '1',
									showvolume : '1',
									showtime : '2',
									showplayer : 'always',
									showloading : 'always',
									showfullscreen : '1',
                                    bgColor : "#000"
								}
							});
							hasPreview = true;
                        }
                        else if(ext == "mp3")
                        {
                            if(!window.dontuseHTML5Player && !!document.createElement('audio').canPlayType && !!document.createElement('audio').canPlayType("audio/mp3"))
                            {
                                var audioElem = '<audio  class="audio-js" controls preload id="preview_audio" style="width:90%;" data-setup=\'{"example_option":true}\'>';
                                    audioElem += '<source src="'+path+'" type="audio/mp3" />';
                                    audioElem += '<source src="'+path+'" type="audio/m4a" />';
                                    audioElem += '<p class="vjs-no-js">To play this audio please enable JavaScript, and consider upgrading to a web browser which supports HTML5 audio playback</p>';
                                    audioElem += '</audio>';

                                content.empty().append('<div>'+audioElem+'<h3 style="font-size:13px;font-weight:normal;margin:5px;padding:0px;">'+_fileName+'</h3></div><div style="margin-top:10px;font-size:11px;">Problem with playback? <a class="defaultPlayer" href="javascript:void(0)">Try flash player</a></div>');

                                content.find("a.defaultPlayer").click(function(){
                                    setTimeout(function(){
                                        content.height(200);
                                        $.colorbox.resize({width:740, height:230});
                                    }, 100);
                                    var _path = o.downloadURL + "?command=download&random="+Math.random()+"&mimeType="+decodeURIComponent(mimeType) + "&path="+crushFTPTools.textEncode(unescape(_fileName)).replace(/\&/g, "%26")+"&c2f="+crushFTPTools.getCrushAuth();
                                    content.empty().append("<a href=\""+crushFTPTools.encodeURILocal(_path)+"\" class=\"media {flashvars: { mp3: '"+crushFTPTools.encodeURILocal(_path)+"'}, width:700, height:60}\">Preview : \""+ crushFTPTools.textEncode(unescape(_fileName)).replace(/\&/g, "&amp;") +"\"</a> <div style='margin-top:10px;font-size:11px;'><a href='javascript:void(0)' class='html5player'>Switch to HTML5 Player</a></div>");
                                    content.find("a.media").media({
                                        params :{
                                            movie : o.FilePath + "js/player_mp3_maxi.swf",
                                            showstop : 1,
                                            showinfo : 1,
                                            showvolume : 1,
                                            bgColor : "#000"
                                        }
                                    });
                                    content.find("a.html5player").click(function(event) {
                                        showPreview();
                                    });
                                    if(window.disableRightClickOnHTML5Player)
							        {
							            $("video, audio").bind("contextmenu",function(){
							                return false;
							            });
							        }
                                });
								hasPreview = true;
                            }
                            else
                            {
                                content.empty().append("<a href=\""+path+"\" class=\"media {flashvars: { mp3: '"+escape(path)+"'}, width:"+width+", height:"+height+"}\">Preview : \""+ crushFTPTools.textEncode(unescape(_fileName)).replace(/\&/g, "&amp;") +"\"</a> ");
								content.find("a.media").media({
									params :{
										movie : o.FilePath + "js/player_mp3_maxi.swf",
										showstop : 1,
										showinfo : 1,
										showvolume : 1,
                                        bgColor : "#000"
									}
								});
								hasPreview = true;
                            }
                        }
                        else if(ext == "swf")
                        {
                            content.empty().append("<a href=\""+path+"\" class=\"media {width:"+width+", height:"+height+", type:'swf'}\">Preview : \""+ crushFTPTools.textEncode(unescape(_fileName)) +"\"</a> ");
							content.find("a.media").media();
							hasPreview = true;
                        }
                        else
                        {
                            if(!window.dontuseHTML5Player && !!document.createElement('video').canPlayType && !!document.createElement('video').canPlayType("video/"+ext+"") && (ext == "mp4" || ext == "h264" || ext == "webm" || ext == "ogg") || ext == "mov")
                            {
								hasPreview = true;
                                var _height = height-50;
                                var randomCode = "R_" + Math.random().toString(36).substring(2,7);
								var videoElem = '<video id="preview_video'+randomCode+'" class="video-js vjs-default-skin vjs-big-play-centered" controls preload="auto" width="'+width+'" height="'+_height+'" data-setup=\'{"example_option":true}\'>';
                                    videoElem += '<source src="'+path+'" type="video/mp4" />';
                                    if(ext === "webm")
                                    	videoElem += '<source src="'+path+'" type="video/webm" />';
                                    if(ext === "ogg")
                                    	videoElem += '<source src="'+path+'" type="video/ogg" />';
                                    videoElem += '<p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>';
                                    videoElem += '</video>';
                                content.empty().append('<div>'+videoElem+'<h3 style="font-size:13px;font-weight:normal;margin:5px;padding:0px;">'+crushFTPTools.textEncode(unescape(_fileName))+'</h3></div><div style="margin-top:10px;font-size:11px;color:#fff;">Problem with playback? <a class="defaultPlayer" href="javascript:void(0)">Try browser player</a></div>');

                                videojs("preview_video"+randomCode, {autoplay:true}, function(){
	                                this.on("ended", function(){
	                                	if(window.slideshowMediaPlay)
	                                	{
	                                		window.slideshowMediaPlay = false;
	                                		$("#controls").find("a.next").trigger("click");
	                                		$("#controls").find("a.play").trigger("click");
	                                	}
	                                });
                                });

                                content.find("a.defaultPlayer").click(function(){
                                	width += 30;
                                	height += 30;
                                    setTimeout(function(){
                                        content.height(height);
                                        $.colorbox.resize({width:width, height:height});
                                    }, 100);
                                    content.empty().append("<a href=\""+(path)+"\" class=\"media {width:"+width+", height:"+height+"}\">Preview : \""+ crushFTPTools.textEncode(unescape(_fileName)) +"\"</a> <div style='margin-top:10px;font-size:11px;'><a href='javascript:void(0)' class='html5player'>Switch to HTML5 Player</a></div>");
                                    content.find("a.media").media({
                                        params :{
                                            showcontrols : '1',
                                            showpositioncontrols : '1',
                                            showaudiocontrols : '2',
                                            showstatusbar : '1',
                                            showfullscreen : '1',
                                            autosize : '1',
                                            uiMode : 'full',
                                            scale : 'aspect',
                                            kioskmode : 'true',
                                            bgColor : "#000"
                                        }
                                    });
                                    content.find("a.html5player").click(function(event) {
                                        showPreview();
                                    });
                                });
								if(window.disableRightClickOnHTML5Player)
						        {
						            $("video, audio").bind("contextmenu",function(){
						                return false;
						            });
						        }
                            }
                            else
                            {
                                if(ext != "ogg")
                                {
                                    content.empty().append("<a href=\""+unescape(path)+"\" class=\"media {width:"+width+", height:"+height+"}\">Preview : \""+ crushFTPTools.textEncode(unescape(_fileName)) +"\"</a> ");
									content.find("a.media").media({
										params :{
											showcontrols : '1',
											showpositioncontrols : '1',
											showaudiocontrols : '2',
											showstatusbar : '1',
											showfullscreen : '1',
											autosize : '1',
											uiMode : 'full',
											scale : 'aspect',
                                            bgColor : "#000"
										}
									});
									content.find("a.media").media();
									if(window.disableRightClickOnHTML5Player)
							        {
							            $("video, audio").bind("contextmenu",function(){
							                return false;
							            });
							        }
									hasPreview = true;
                                }
                            }
                        }
                        if(hasPreview)
						{
							content.before("<a href='javascript:void(0);' class='quitPreview'>Quit Preview</a>");
							var imageWrapper = content.parent();
							imageWrapper.find("a.quitPreview").click(function(){
								$(this).remove();
								content.remove();
								imageWrapper.find("div.previewIcon").show();
								if($.browser.msie && $.browser.version <= 8)
								{
									imageWrapper.find(".advance-link").show();
								}
								return false;
							});
						}
                    });
                }
                showPreview();
			},

			//Events and functionalities for CrushFTP UI
			setupCrushFTPEvents: function(imageData, imageContainer, thumbs, obj){
				var imageWrapper = imageContainer.find("span.image-wrapper");
				imageWrapper.unbind("mousemove");
				var getFileExtension = function(filename) {
					var ext = /^.+\.([^.]+)$/.exec(filename);
					return ext == null ? "" : ext[1].toLowerCase();
				};
				var fileName = imageData.title;
				var ext = getFileExtension(fileName);
				var preview = false;
				if(ext.length>0)
				{
					if(window.mediaFileExtensions.has(ext))
					{
						imageWrapper.prepend("<div class='previewIcon'></div>");
						preview = true;
						var previewIcon = imageWrapper.find(".previewIcon");
						previewIcon.hover(function(){
							$(this).addClass("opq");
						}, function(){
							$(this).removeClass("opq");
						}).click(function(evt){
							evt.stopPropagation();
							//obj.$controlsContainer.find("a.pause").trigger("click");
							$(this).hide();
							imageWrapper.append("<div class='previewPanel'></div>");
							var previewPanel = imageWrapper.find("div.previewPanel");
							var dim = {height:imageWrapper.height(), width:imageWrapper.width()};
							previewPanel.css("height", dim.height).css("width", dim.width);
							obj.previewMedia(previewPanel, imageData.fullPath, ext, dim);
							imageWrapper.trigger("mouseleave");
							if($.browser.msie && $.browser.version <= 8)
							{
								imageWrapper.find(".advance-link").hide();
							}
							return false;
						});
					}
				}
				if(!preview)
				{
					imageWrapper.find("div.previewIcon").hide();
				}
				if(imageData.previews && imageData.previews>1)
				{
					imageWrapper.prepend("<div class='multiImages'></div>");
					var totalFrames = imageData.previews;
					imageWrapper.bind("mousemove", function(evt){
						if($("a.quitPreview").length>0)return false;
						var curImg = $(this).find("img");
						var imageNo = 1;
						if(!$(this).find(".media").length>0)
						{
							var mouse = {x:evt.clientX,y:evt.clientY};
							var div = {x:imageWrapper.offset().left - $(window).scrollLeft(),y:imageWrapper.offset().top - $(window).scrollTop()};
							var divWidth = imageWrapper.width();
							var positionPerc = Math.round((100 * (mouse.x - div.x)) / divWidth);
							if(positionPerc > 100) positionPerc = 100;
							if(positionPerc <= 0) positionPerc = 1;
							var imageNo = Math.round((positionPerc * totalFrames) / 100);
							if(imageNo > totalFrames) imageNo = totalFrames;
							if(imageNo <= 0) imageNo = 1;
						}
						var _fileName = curImg.attr("src");
						_fileName= _fileName.replace(_fileName.substring(_fileName.lastIndexOf("&frame=",_fileName.length-7)), "&frame=" + imageNo);
						curImg.unbind();
						curImg.attr("src", _fileName + "&c2f="+crushFTPTools.getCrushAuth());

						var previewImage = $(thumbs.get(imageData.index)).find("img");
						_fileName = previewImage.attr("src");
						_fileName= _fileName.replace(_fileName.substring(_fileName.lastIndexOf("&frame=",_fileName.length-7)), "&frame=" + imageNo);
						previewImage.attr("src", _fileName + "&c2f="+crushFTPTools.getCrushAuth());
					}).mouseleave(function(){
						var curImg = $(this).find("img");
						var _fileName = curImg.attr("src");
						_fileName= _fileName.replace(_fileName.substring(_fileName.lastIndexOf("&frame=",_fileName.length-7)), "&frame=1");
						curImg.unbind();
						curImg.attr("src", _fileName + "&c2f="+crushFTPTools.getCrushAuth());

						var previewImage = $(thumbs.get(imageData.index)).find("img");
						_fileName = previewImage.attr("src");
						_fileName= _fileName.replace(_fileName.substring(_fileName.lastIndexOf("&frame=",_fileName.length-7)), "&frame=1");
						previewImage.attr("src", _fileName + "&c2f="+crushFTPTools.getCrushAuth());
					});
				}
				else
				{
					imageWrapper.find("div.multiImages").remove();
				}
			},

			// Returns the current page index that should be shown for the currentImage
			getCurrentPage: function() {
				return Math.floor(this.currentImage.index / this.numThumbs);
			},

			// Applies the selected class to the current image's corresponding thumbnail.
			// Also checks if the current page has changed and updates the displayed page of thumbnails if necessary.
			syncThumbs: function() {
				var page = this.getCurrentPage();
				if (page != this.displayedPage)
					this.updateThumbs();

				// Remove existing selected class and add selected class to new thumb
				var $thumbs = this.find('ul.thumbs').children();
				$thumbs.filter('.selected').removeClass('selected');
				$thumbs.eq(this.currentImage.index).addClass('selected');

				return this;
			},

			// Performs transitions on the thumbnails container and updates the set of
			// thumbnails that are to be displayed and the navigation controls.
			// @param {Delegate} postTransitionOutHandler An optional delegate that is called after
			// the thumbnails container has transitioned out and before the thumbnails are rebuilt.
			updateThumbs: function(postTransitionOutHandler) {
				var gallery = this;
				var transitionOutCallback = function() {
					// Call the Post-transition Out Handler
					if (postTransitionOutHandler)
						postTransitionOutHandler();

					gallery.rebuildThumbs();

					// Transition In the thumbsContainer
					if (gallery.onPageTransitionIn)
						gallery.onPageTransitionIn();
					else
						gallery.show();
				};

				// Transition Out the thumbsContainer
				if (this.onPageTransitionOut) {
					this.onPageTransitionOut(transitionOutCallback);
				} else {
					this.hide();
					transitionOutCallback();
				}

				return this;
			},

			// Updates the set of thumbnails that are to be displayed and the navigation controls.
			rebuildThumbs: function() {
				var needsPagination = this.data.length > this.numThumbs;

				// Rebuild top pager
				if (this.enableTopPager) {
					var $topPager = this.find('div.top');
					if ($topPager.length == 0)
						$topPager = this.prepend('<div class="top pagination"></div>').find('div.top');
					else
						$topPager.empty();

					if (needsPagination)
						this.buildPager($topPager);
				}

				// Rebuild bottom pager
				if (this.enableBottomPager) {
					var $bottomPager = this.find('div.bottom');
					if ($bottomPager.length == 0)
						$bottomPager = this.append('<div class="bottom pagination"></div>').find('div.bottom');
					else
						$bottomPager.empty();

					if (needsPagination)
						this.buildPager($bottomPager);
				}

				var page = this.getCurrentPage();
				var startIndex = page*this.numThumbs;
				var stopIndex = startIndex+this.numThumbs-1;
				if (stopIndex >= this.data.length)
					stopIndex = this.data.length-1;

				// Show/Hide thumbs
				var $thumbsUl = this.find('ul.thumbs');
				$thumbsUl.find('li').each(function(i) {
					var $li = $(this);
					if (i >= startIndex && i <= stopIndex) {
						$li.show();
					} else {
						$li.hide();
					}
				});

				this.displayedPage = page;

				// Remove the noscript class from the thumbs container ul
				$thumbsUl.removeClass('noscript');

				var prevPageLink = this.find('a.prev').css('visibility', 'hidden');
				var nextPageLink = this.find('a.next').css('visibility', 'hidden');

				// Show appropriate next / prev page links
				if (this.displayedPage > 0)
					prevPageLink.css('visibility', 'visible');

				var lastPage = this.getNumPages() - 1;
				if(lastPage<0)lastPage=0;
				if (this.displayedPage < lastPage)
					nextPageLink.css('visibility', 'visible');
				if(initFirstImage)
				{
					if(typeof window.processImages != "undefined")
						window.processImages();
				}
				return this;
			},

			// Returns the total number of pages required to display all the thumbnails.
			getNumPages: function() {
				return Math.ceil(this.data.length/this.numThumbs);
			},

			// Rebuilds the pager control in the specified matched element.
			// @param {jQuery} pager A jQuery element set matching the particular pager to be rebuilt.
			buildPager: function(pager) {
				var gallery = this;
				var numPages = this.getNumPages();
				var page = this.getCurrentPage();
				var startIndex = page * this.numThumbs;
				var pagesRemaining = this.maxPagesToShow - 1;

				var pageNum = page - Math.floor((this.maxPagesToShow - 1) / 2) + 1;
				if (pageNum > 0) {
					var remainingPageCount = numPages - pageNum;
					if (remainingPageCount < pagesRemaining) {
						pageNum = pageNum - (pagesRemaining - remainingPageCount);
					}
				}

				if (pageNum < 0) {
					pageNum = 0;
				}

				// Prev Page Link
				if (page > 0) {
					var prevPage = startIndex - this.numThumbs;
					pager.append('<a class="special" rel="history" href="#'+this.data[prevPage].hash+'" title="'+this.prevPageLinkText+'">'+this.prevPageLinkText+'</a>');
				}

				// Create First Page link if needed
				if (pageNum > 0) {
					this.buildPageLink(pager, 0, numPages);
					if (pageNum > 1)
						pager.append('<span class="ellipsis">&hellip;</span>');

					pagesRemaining--;
				}

				// Page Index Links
				while (pagesRemaining > 0) {
					this.buildPageLink(pager, pageNum, numPages);
					pagesRemaining--;
					pageNum++;
				}

				// Create Last Page link if needed
				if (pageNum < numPages) {
					var lastPageNum = numPages - 1;
					if (pageNum < lastPageNum)
						pager.append('<span class="ellipsis">&hellip;</span>');

					this.buildPageLink(pager, lastPageNum, numPages);
				}

				// Next Page Link
				var nextPage = startIndex + this.numThumbs;
				if (nextPage < this.data.length) {
					pager.append('<a class="special" rel="history" href="#'+this.data[nextPage].hash+'" title="'+this.nextPageLinkText+'">'+this.nextPageLinkText+'</a>');
				}

				pager.find('a').click(function(e) {
					gallery.clickHandler(e, this);
				});

				return this;
			},

			// Builds a single page link within a pager.  This function is called by buildPager
			// @param {jQuery} pager A jQuery element set matching the particular pager to be rebuilt.
			// @param {Integer} pageNum The page number of the page link to build.
			// @param {Integer} numPages The total number of pages required to display all thumbnails.
			buildPageLink: function(pager, pageNum, numPages) {
				var pageLabel = pageNum + 1;
				var currentPage = this.getCurrentPage();
				if (pageNum == currentPage)
					pager.append('<span class="current">'+pageLabel+'</span>');
				else if (pageNum < numPages) {
					var imageIndex = pageNum*this.numThumbs;
					pager.append('<a rel="history" href="#'+this.data[imageIndex].hash+'" title="'+pageLabel+'">'+pageLabel+'</a>');
				}

				return this;
			}
		});

		// Now initialize the gallery
		$.extend(this, defaults, settings);

		// Verify the history plugin is available
		if (this.enableHistory && !$.historyInit)
			this.enableHistory = false;

		// Select containers
		if (this.imageContainerSel) this.$imageContainer = $(this.imageContainerSel);
		if (this.captionContainerSel) this.$captionContainer = $(this.captionContainerSel);
		if (this.loadingContainerSel) this.$loadingContainer = $(this.loadingContainerSel);

		// Initialize the thumbails
		this.initializeThumbs();

		if (this.maxPagesToShow < 3)
			this.maxPagesToShow = 3;

		this.displayedPage = -1;
		this.currentImage = this.data[0];
		var gallery = this;

		// Hide the loadingContainer
		if (this.$loadingContainer)
			this.$loadingContainer.hide();

		// Setup controls
		if (this.controlsContainerSel) {
			this.$controlsContainer = $(this.controlsContainerSel).empty();

			if (this.renderSSControls) {
				if (this.autoStart) {
					this.$controlsContainer
						.append('<div class="ss-controls"><a href="#pause" class="pause" title="'+this.pauseLinkText+'">'+this.pauseLinkText+'</a></div>');
				} else {
					this.$controlsContainer
						.append('<div class="ss-controls"><a href="#play" class="play" title="'+this.playLinkText+'">'+this.playLinkText+'</a></div>');
				}

				this.$controlsContainer.find('div.ss-controls a')
					.click(function(e) {
						gallery.toggleSlideshow();
						e.preventDefault();
						return false;
					});
			}

			if (this.renderNavControls) {
				this.$controlsContainer
					.append('<div class="nav-controls"><a class="prev" rel="history" title="'+this.prevLinkText+'">'+this.prevLinkText+'</a><a class="next" rel="history" title="'+this.nextLinkText+'">'+this.nextLinkText+'</a></div>')
					.find('div.nav-controls a')
					.click(function(e) {
						gallery.clickHandler(e, this);
					});
			}
		}

		var initFirstImage = !this.enableHistory || !location.hash;
		if (this.enableHistory && location.hash) {
			var hash = $.galleriffic.normalizeHash(location.hash);
			var imageData = allImages[hash];
			if (!imageData)
				initFirstImage = true;
		}

		// Setup gallery to show the first image
		if (initFirstImage)
			this.gotoIndex(0, false, true);

		// Setup Keyboard Navigation
		if (this.enableKeyboardNavigation) {
			$(document).keydown(function(e) {
				var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
				switch(key) {
					case 32: // space
						gallery.next();
						e.preventDefault();
						break;
					case 33: // Page Up
						gallery.previousPage();
						e.preventDefault();
						break;
					case 34: // Page Down
						gallery.nextPage();
						e.preventDefault();
						break;
					case 35: // End
						gallery.gotoIndex(gallery.data.length-1);
						e.preventDefault();
						break;
					case 36: // Home
						gallery.gotoIndex(0);
						e.preventDefault();
						break;
					case 37: // left arrow
						gallery.previous();
						e.preventDefault();
						break;
					case 39: // right arrow
						gallery.next();
						e.preventDefault();
						break;
				}
			});
		}

		// Auto start the slideshow
		if (this.autoStart)
			this.play();

		// Kickoff Image Preloader after 1 second
		setTimeout(function() { gallery.preloadInit(); }, 1000);

		return this;
	};
})(jQuery);


var imagenotAvailable = "data:image/jpg;base64,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";