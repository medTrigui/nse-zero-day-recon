(function($) {
  $.fn.extend({
    dragout: function() {
      var files = this;
      var is_MacOs = navigator.userAgent.indexOf('Mac') > -1;
      var dragUIInformationPopup = $("#dragUIInformationPopup");
      var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
      if (files.length > 0) {
        $(files).each(function() {
          if (this.addEventListener) {
            this.addEventListener("dragstart", function(e) {
              //var isfromBasket = ($(this).closest('div.filesSelectedInBasket').length>0);
              $("#cluetip").hide();
              if((is_MacOs && e.metaKey) || (!is_MacOs && e.ctrlKey))
              {
                var url = (this.dataset && this.dataset.downloadurl) || this.getAttribute("data-downloadurl");
                window.draggingOut = true;
                if(e.dataTransfer)
                {
                  e.dataTransfer.setData("DownloadURL", url);
                }
                if(is_chrome)
                  dragUIInformationPopup.slideDown('fast');
              }
              else
              {
                e.stopPropagation();
                e.preventDefault();
                return false;
              }
            },false);
            this.addEventListener("dragend", function(e) {
              window.draggingOut = false;
              if(is_chrome)
                dragUIInformationPopup.slideUp('fast');
            },false);
          }
        });
      }
    }
  });
})(jQuery);

(function($, undefined) {
  $.widget("ui.crushDraggables", $.ui.draggable, {
      options: $.extend({},$.ui.draggable.prototype.options,{rangeDrag:false}),
      _init: function(){
        this.element.data('draggable', this.element.data('crushDraggables'));
        return $.ui.draggable.prototype._init.apply(this, arguments);
      },
      _create: function() {
        $.ui.draggable.prototype._create.apply(this,arguments);
        this._rangeCapture = false;
      },
      _mouseDown : function(b){
          var is_MacOs = navigator.userAgent.indexOf('Mac') > -1;
          if((is_MacOs && b.metaKey) || (!is_MacOs && b.ctrlKey))
          {
            b._type = "dragout";
            this._trigger("crushdrag", b);
          }
          else
          {
              var a = $;
              b._type = "uidrag";
              this._trigger("crushdrag", b);
              this._mouseStarted && this._mouseUp(b), this._mouseDownEvent = b;
              var d = this,
                  e = b.which == 1,
                  f = typeof this.options.cancel == "string" && b.target.nodeName ? a(b.target).closest(this.options.cancel).length : !1;
              if (!e || f || !this._mouseCapture(b)) return !0;
              this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function () {
                  d.mouseDelayMet = !0
              }, this.options.delay));
              if (this._mouseDistanceMet(b) && this._mouseDelayMet(b)) {
                  this._mouseStarted = this._mouseStart(b) !== !1;
                  if (!this._mouseStarted) return b.preventDefault(), !0
              }
              return !0 === a.data(b.target, this.widgetName + ".preventClickEvent") && a.removeData(b.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function (a) {
                  return d._mouseMove(a)
              }, this._mouseUpDelegate = function (a) {
                  return d._mouseUp(a)
              }, a(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), b.preventDefault(), c = !0, !0
          }
      }
  });
})(jQuery);