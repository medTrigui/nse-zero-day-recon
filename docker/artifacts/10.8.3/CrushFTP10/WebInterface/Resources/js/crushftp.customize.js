/*To customize CrushFTP WebInterface*/
$.crushFtpCustomization = {
    currentSettings : {
        defaultName: "CrushFTP", //It will look for this name to replace
        appname: "CrushFTP" //It will replace to this name
    },
    replaceText: function(text){
        var _this = this;
        var regEx = new RegExp(_this.currentSettings.defaultName, "ig");
        return text.replace(regEx, _this.currentSettings.appname).replace(/xxxx-xxxx/gi,'<br>');
    },
    isValidElem: function(elem){
        if(elem.hasClass("ignoreAppname") || elem.is("input,select,textarea,script"))
            return false;
        var children = elem.find("*");
        var invalid = false;
        children.each(function(){
            if(!$(this).is("br"))
            {
                invalid = true;
            }
        });
        if(!invalid){
            elem.html(DOMPurify.sanitize(elem.html().replace(/<br\s*\/?>/gi,'xxxx-xxxx')));
        }
        return !invalid;
    },
    init : function(parentElem){
        try{
            parentElem = parentElem || $(document);
            var _this = this;
            _this.isInitiated = true;
            jQuery.expr[':'].icontains = function(a, i, m) {
              return jQuery(a).text().toUpperCase()
                  .indexOf(m[3].toUpperCase()) >= 0;
            };
            $("*:icontains('"+_this.currentSettings.defaultName+"')", parentElem).each(function(){
                if(_this.isValidElem($(this))){
                    var curTxt = $(this).text();
                    // console.log(curTxt);
                    $(this).html(DOMPurify.sanitize(_this.replaceText(curTxt)));
                }
            });
        }
        catch(ex){console.log(ex);}
    }
};

$(document).ready(function(){
    $.crushFtpCustomization.init();
})