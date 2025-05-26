/*!
* CrushFTP Customized FileUpload UI Widget, It overrides methods from original widget to make it suitable to requirements
*
* http://crushFTP.com/
*
* Copyright 2012, CrushFTP
*
* Date: Fri, Apr 20 2012
*
* Author: Vipul Limbachiya
*
* http://vipullimbachiya.com

- Extension to jquery.fileupload-ui.js

*/
(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // Register as an anonymous AMD module:
        define(['jquery', 'tmpl', 'load-image', './jquery.fileupload-ip'], factory);
    } else {
        // Browser globals:
        factory(
        window.jQuery, window.tmpl, window.loadImage);
    }
}(function ($, tmpl, loadImage) {
    'use strict';
    var parentWidget = ($.blueimpIP || $.blueimp).fileupload;
    $.widget('crushFTPUI.fileupload', $.blueimpUI.fileupload, {
        options: {
            // The maximum width of the preview images:
            previewMaxWidth: 60,
            // The maximum height of the preview images:
            previewMaxHeight: 60,
			// Callback for failed (abort or error) uploads:
            fail: function (e, data) {
				var that = $(this).data('fileupload'),
                    template;
				var _e = e;
				var _data = data;
				var _this = $(this);
				var fileLength = 0;
				if(data && data.files) fileLength = data.files.length;
                that._adjustMaxNumberOfFiles(fileLength);
                if (data.context) {
                    data.context.each(function (index) {
                        if (data.errorThrown !== 'abort') {
                            var file = data.files[index];
                            file.error = file.error || data.errorThrown ||
                                true;
                        } else {
                            that._transition($(this)).done(
                                function () {
                                    $(this).remove();
                                    that._trigger('failed', e, data);
                                }
                            );
                        }
                    });
                } else if (data.errorThrown !== 'abort') {
                    that._adjustMaxNumberOfFiles(-data.files.length);
                } else {
                    that._trigger('failed', e, data);
                }
            }
        },
        _cancelHandler: function (e) {
            e.preventDefault();
            var template = $(this).closest('.template-upload'),
                data = template.data('data') || {};
            if (!data.jqXHR) {
                data.errorThrown = 'abort';
                e.data.fileupload._trigger('fail', e, data);
            } else {
                data.jqXHR.abort();
            }
            e.data.fileupload._trigger('change', e, data);
        },
        _deleteHandler: function (e) {
            e.preventDefault();
            var button = $(this);
            e.data.fileupload._trigger('destroy', e, {
                context: button.closest('.template-download'),
                url: button.attr('data-url'),
                type: button.attr('data-type') || 'DELETE',
                dataType: e.data.fileupload.options.dataType
            });
            e.data.fileupload._trigger('deleted', e, e.data);
        },
        _initButtonBarEventHandlers: function () {
            var fileUploadButtonBar = this.element.find('.fileupload-buttonbar'),
                filesList = this.options.filesContainer,
                ns = this.options.namespace;
            fileUploadButtonBar.find('.start').bind('click.' + ns, function (e) {
                e.preventDefault();
                filesList.find('.start a:not(.uploaded)').click();
            });
            fileUploadButtonBar.find('.cancel').bind('click.' + ns, function (e) {
                e.preventDefault();
                filesList.find('.cancel a').click();
            });
            fileUploadButtonBar.find('.delete').bind('click.' + ns, function (e) {
                e.preventDefault();
                filesList.find('.delete input:checked').siblings('a').click();
                fileUploadButtonBar.find('.toggle').prop('checked', false);
            });
            fileUploadButtonBar.find('.toggle').bind('change.' + ns, function (e) {
                filesList.find('.delete input').prop('checked', $(this).is(':checked'));
            });
        },
        _destroyButtonBarEventHandlers: function () {
            this.element.find('.fileupload-buttonbar a').unbind('click.' + this.options.namespace);
            this.element.find('.fileupload-buttonbar .toggle').unbind('change.' + this.options.namespace);
        },
        _initEventHandlers: function () {
            parentWidget.prototype._initEventHandlers.call(this);
            var eventData = {
                fileupload: this
            };
            this.options.filesContainer.delegate('.start a', 'click.' + this.options.namespace, eventData, this._startHandler).delegate('.cancel a', 'click.' + this.options.namespace, eventData, this._cancelHandler).delegate('.delete a', 'click.' + this.options.namespace, eventData, this._deleteHandler);
            this._initButtonBarEventHandlers();
        },
		_startHandler: function (e) {
            var options = e.data.fileupload.options;
            e.preventDefault();
            var button = $(this),
                template = button.closest('.template-upload'),
                data = template.data('data');
            if (data) {
                $.CrushFTP.curRequest = data.submit();
                if($.CrushFTP.DNDUploadCallback)
                    $.CrushFTP.DNDUploadCallback("uploading", data, button, template);
            }
        },
        _destroyEventHandlers: function () {
            var options = this.options;
            this._destroyButtonBarEventHandlers();
            options.filesContainer.undelegate('.start a', 'click.' + options.namespace).undelegate('.cancel a', 'click.' + options.namespace).undelegate('.delete a', 'click.' + options.namespace);
            parentWidget.prototype._destroyEventHandlers.call(this);
        },
        enable: function () {
            parentWidget.prototype.enable.call(this);
            //this.element.find('input, a').prop('disabled', false);
            this._enableFileInputButton();
        },
        disable: function () {
            //this.element.find('input, a').prop('disabled', true);
            this._disableFileInputButton();
            parentWidget.prototype.disable.call(this);
        }
    });
}));