/**
Vertigo Tip by www.vertigo-project.com
Requires jQuery
*/

this.vtip = function(elem) {
    this.xOffset = -10; // x distance from mouse
    this.yOffset = 10; // y distance from mouse
    elem = elem || $(document);
	if(window.allItemsWithTitleHasVTip)
	{
		$("*[title]", elem).addClass("vtip");
	}
    function sanitizeTitle(title) {
        return window.DOMPurify ? DOMPurify.sanitize(title) : title.replace(/<script|<style|<link/gi, "").replace(/onerror|onload|onmouseover/gi, "");
      }
    function bindEvt(elems)
    {
        elems.unbind("hover").hover(
            function(e) {
                var _title = sanitizeTitle($(this).attr("title"));
                if(_title.length==0 && $(this).data("title").length>0)
                    _title = $(this).data("title");
                $(this).data("title", _title);
                $(this).attr("title", "");

                if($(this).hasClass("ui-state-disabled") || !_title || _title.length==0)return;
                this.top = (e.pageY + yOffset); this.left = (e.pageX + xOffset);

                var vtipElem = $("#vtip");
                if(vtipElem.length==0)
                {
                    $('body').append( '<p id="vtip"><img id="vtipArrow" /><span class="vtipTitle">' + _title + '</span></p>' );
                    vtipElem = $("#vtip");
                }
                else
                    vtipElem.find(".vtipTitle").html(_title);

                $('#vtipArrow', vtipElem).attr("src", '/WebInterface/Resources/images/vtip_arrow.png');
                vtipElem.css("top", this.top+"px").css("left", this.left+"px").show();
            },
            function() {
                $(this).attr("title", $(this).data("title"));
                $(this).removeData("title");
                if($(this).hasClass("ui-state-disabled"))return;
                $("p#vtip").hide();
            }
        ).mousemove(
            function(e) {
                this.top = (e.pageY + yOffset);
                this.left = (e.pageX + xOffset);
                $("p#vtip").css("top", this.top+"px").css("left", this.left+"px");
            }
        );
    }
    if(elem)
        bindEvt(elem.find(".vtip"));
    else
        bindEvt($(".vtip"));
};

jQuery(document).ready(function($){vtip();})