//Extract value from XML string
function extractValString(item, index, rep) {
    if (item.length >= index && item[index] && item[index].toString() != "undefined") {
        return item[index];
    } else {
        return rep || "";
    }
}

//Get XML text from an element
function XMLValue(val) {
    if (val && val.text) {
        return val.text;
    } else {
        return "";
    }
}
//General form field based on data passed
function generateFormField(data) {
    var html = '';
    var randomId = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)
    randomId += possible.charAt(Math.floor(Math.random() * possible.length)); //Generate random Id for field
    var requiredField = (data.required && XMLValue(data.required[0]) == "true") ? "<span class='requiredField'>*</span>" : "";
    if (!data.type || (data.type[0].text != 'label' && !data.name)) {
        return "";
    }
    var controlName = "";
    if(data.name)
    {
        controlName = crushFTPTools.textEncode(XMLValue(data.name[0]));
    }
    switch (data.type[0].text) {
    case "label":
        //Generate label, with value
        var labelL = DOMPurify.sanitize(XMLValue(data.label[0]));
        var labelR = DOMPurify.sanitize(XMLValue(data.value[0]));
        var labelName = "label_" + randomId;
        try{
            if(data.name && data.name.length>0)
                labelName = DOMPurify.sanitize(XMLValue(data.name[0]));
        }catch(ex){
            labelName = "label_" + randomId;
        }
        var loadPage = false;
        var loadLeft = false;
        if(labelL.indexOf("{get:")>=0)
        {
            var _index = labelL.indexOf("{get:");
            loadPage = labelL.substring(labelL.indexOf("{get:") + 5, labelL.length);
            loadPage = loadPage.substring(0, loadPage.indexOf("}"));
            loadLeft = true;
        }
        else if(labelR.indexOf("{get:")>=0)
        {
            var _index = labelR.indexOf("{get:");
            loadPage = labelR.substring(labelR.indexOf("{get:") + 5, labelR.length);
            loadPage = loadPage.substring(0, loadPage.indexOf("}"));
        }
        if(loadPage)
        {
            if(labelR.length==0)
                html = '<tr>' + '<td colspan="2" class="formValFull loadPage" page="'+loadPage+'"><label name="meta_'+labelName+'">' + XMLValue(data.label[0]) + '</label></td><tr>';
            else
            {
                if(loadLeft)
                    html = '<tr>' + '<td class="formLabel loadPage" page="'+loadPage+'">' + labelL + '</td>' + '<td class="formVal"><label name="meta_'+labelName+'">' + labelR + '</label></td> ' + requiredField + '<tr>';
                else
                    html = '<tr>' + '<td class="formLabel">' + labelL + ' ' + requiredField + '</td>' + '<td class="formVal loadPage" page="'+loadPage+'"><label name="meta_'+labelName+'">' + labelR + '</label></td>' + '<tr>';
            }
        }
        else
        {
            if(labelR.length==0)
                html = '<tr>' + '<td colspan="2" class="formValFull"><label name="meta_'+labelName+'">' + DOMPurify.sanitize(XMLValue(data.label[0])) + '</label></td><tr>';
            else
                html = '<tr>' + '<td class="formLabel">' + labelL + '</td>' + '<td class="formVal"><label name="meta_'+labelName+'">' + labelR + '</label>' + requiredField + '</td>' + '<tr>';
        }
        break;
    case "text":
        //Generate input text box, with value and applied size
        var size = crushFTPTools.textEncode(XMLValue(data.size[0]));
        var maxchars = crushFTPTools.textEncode(data.max_chars ? XMLValue(data.max_chars[0]) : "");
        var dateFieldClass = "";
        var validateEmail = "";
        var validatePass = "";
        var inputType = "text";
        if (controlName.lastIndexOf("_date1") >= 0) {
            dateFieldClass = "futureDateField";
        } else if (controlName.lastIndexOf("_date") >= 0) {
            dateFieldClass = "dateField";
        }
        if (controlName.lastIndexOf("_email") >= 0) {
            validateEmail = " validateEmail";
        }
        if (controlName.lastIndexOf("_password") >= 0) {
            validatePass = " validatePass";
            inputType = "password";
        }
        var maxlength = size ? size.toString().indexOf("%")>0 ? " style='width:"+size.toString()+";' " : " style='width:"+size.toString().split("px")[0]+"px;' " : "";
        maxchars = maxchars ? " maxlength='"+maxchars+"' " : "";
        html = '<tr>' + '<td class="formLabel"><label for="' + crushFTPTools.textEncode(XMLValue("meta_" + data.name[0])) + '">' + DOMPurify.sanitize(XMLValue(data.label[0])) + '</label></td>' + '<td class="formVal"><input  type="'+inputType+'"  id="' + "meta_" + controlName + randomId + '" name="' + "meta_" + controlName + '" value="' + XMLValue(data.value[0]) + '" ' + maxlength + maxchars + ' class="required_' + XMLValue(data.required[0]) + ' ' + dateFieldClass + validateEmail + validatePass + '" />' + requiredField + '</td>' + '<tr>';
        break;
    case "textarea":
        //Generate textarea, with value, cols provided
        var cols = parseInt(XMLValue(data.cols[0]));
        if (cols > 40) cols = 40;
        html = '<tr>' + '<td class="formLabel"><label for="' + "meta_" + controlName + '">' + DOMPurify.sanitize(XMLValue(data.label[0])) + '</label></td>' + '<td class="formVal"><textarea id="' + "meta_" + controlName + randomId + '" name="' + "meta_" + controlName + '" cols="' + cols + '" rows="' + XMLValue(data.rows[0]) + '" class="required_' + XMLValue(data.required[0]) + '">' + XMLValue(data.value[0]) + '</textarea>' + ' ' + requiredField + '</td>' + '<tr>';
        break;
    case "combo":
        //Generate dropdown list, with options provided, selected option
        var options = '';
        var opts = data.options[0].options_subitem;
        var itemCount = 0;
        var optgroupOpen = false;
        for (var item in opts) {
            if (typeof opts[item] == "object" || typeof opts[item] == "string") {
                var selected = itemCount == 0 ? "selected" : "";
                var curValue = typeof opts[item] == "string" ? opts[item] : opts[item].text;
                var nameValuePair = [curValue, curValue];
                if (curValue.indexOf(":") >= 0) {
                    nameValuePair = curValue.split(":");
                }
                var val = extractValString(nameValuePair, 1, extractValString(nameValuePair, 0));
                if(nameValuePair.length==3 && nameValuePair[2].toLowerCase() == val.toLowerCase())
                {
                    selected = "selected";
                }
                if(curValue.indexOf("---")==0)
                {
                    if(optgroupOpen)
                    {
                        options += '</optgroup>';
                    }
                    options += '<optgroup label="' + curValue.replace("---","") + '">';
                    optgroupOpen = true;
                }
                else
                    options += '<option ' + selected + ' value="' + extractValString(nameValuePair, 1, extractValString(nameValuePair, 0)) + '">' + nameValuePair[0] + '</option>';
                itemCount++;
            }
        }
        if(optgroupOpen)
        {
            options += '</optgroup>';
        }
        html = '<tr>' + '<td class="formLabel"><label for="' + "meta_" + controlName + '">' + DOMPurify.sanitize(XMLValue(data.label[0]))+ '</label></td class="formVal">' + '<td><select id="' + "meta_" + controlName + randomId + '" name="' + "meta_" + controlName + '" class=" required_' + XMLValue(data.required[0]) + '">' + options + '</select>' + ' ' + requiredField + '</td>' + '<tr>';
        break;
    case "checkbox":
        //Generate checkboxes, with value and default selection
        var options = '';
        var opts = data.options[0].options_subitem;
        for (var item in opts) {
            if (typeof (opts[item]) != "function") {
                var selected = ""; //item == 0 ? "checked" : "";
                var nameValuePair = " : ";
                if (opts[item].text) {
                    nameValuePair = opts[item].text.split(":");
                }
                var val = extractValString(nameValuePair, 2, extractValString(nameValuePair, 0)).split(",");
                if(nameValuePair.length==3 && val.has(extractValString(nameValuePair, 1, extractValString(nameValuePair, 0))))
                {
                    selected = "checked";
                }
                options += '<span class="chkBoxPanel"><input class="chkbox required_' + XMLValue(data.required[0]) + '" type="checkbox" id="' + "meta_" + controlName + '"  ' + selected + ' name="' + "meta_" + controlName + '"  value="' + extractValString(nameValuePair, 1, extractValString(nameValuePair, 0)) + '">' + nameValuePair[0] + '</input></span>';
            }
        }
        html = '<tr>' + '<td class="formLabel"><label for="' + "meta_" + controlName + randomId + '">' + DOMPurify.sanitize(XMLValue(data.label[0])) + '</label></td>' + '<td class="formVal">' + options + ' ' + requiredField+'</td>' + '<tr>';
        break;
    case "tags":
        //Generate checkboxes, with value and default selection
        var options = '';
        var opts = data.options[0].options_subitem;
        var itemCount = 0;
        var optgroupOpen = false;
        for (var item in opts) {
            if (typeof opts[item] == "object" || typeof opts[item] == "string") {
                var selected = "";
                var curValue = typeof opts[item] == "string" ? opts[item] : opts[item].text;
                var nameValuePair = " : ";
                if (opts[item].text) {
                    nameValuePair = opts[item].text.split(":");
                }
                var val = extractValString(nameValuePair, 2, extractValString(nameValuePair, 0)).split(",");
                if(nameValuePair.length==3 && val.has(extractValString(nameValuePair, 1, extractValString(nameValuePair, 0))))
                {
                    selected = "selected";
                }
                if(curValue.indexOf("---")==0)
                {
                    if(optgroupOpen)
                    {
                        options += '</optgroup>';
                    }
                    options += '<optgroup label="' + curValue.replace("---","") + '">';
                    optgroupOpen = true;
                }
                else
                    options += '<option ' + selected + ' value="' + extractValString(nameValuePair, 1, extractValString(nameValuePair, 0)) + '">' + nameValuePair[0] + '</option>';
                itemCount++;
            }
        }
        if(optgroupOpen)
        {
            options += '</optgroup>';
        }
        html = '<tr>' + '<td class="formLabel"><label for="' + "meta_" + controlName + '">' + DOMPurify.sanitize(XMLValue(data.label[0]))+ '</label></td class="formVal">' + '<td><select style="width:250px;" multiple id="' + "meta_" + controlName + randomId + '" name="' + "meta_" + controlName + '" class="chosen required_' + XMLValue(data.required[0]) + '">' + options + '</select>' + ' ' + requiredField + '</td>' + '<tr>';
        break;
    case "radio":
        //Generate radio buttons, with value and default selection
        var options = '';
        var opts = data.options[0].options_subitem;
        var item = 0;
        for (var item in opts) {
            if (opts[item].text) {
                var selected = item == 0 ? "checked" : "";
                var nameValuePair = opts[item].text.split(":");
                var val = extractValString(nameValuePair, 2, extractValString(nameValuePair, 0)).split(",");
                if(nameValuePair.length==3 && val.has(extractValString(nameValuePair, 1, extractValString(nameValuePair, 0))))
                {
                    selected = "checked";
                }
                options += '<input type="radio" id="' + "meta_" + controlName + randomId + '" ' + selected + ' name="' + "meta_" + controlName + '"  value="' + extractValString(nameValuePair, 1, extractValString(nameValuePair, 0)) + '">' + nameValuePair[0] + '</input>';
                item++;
            }
        }
        html = '<tr>' + '<td class="formLabel"><label for="' + "meta_" + controlName + '">' + DOMPurify.sanitize(XMLValue(data.label[0])) + '</label></td>' + '<td class="formVal">' + options + ' ' + requiredField+'</td>' + '<tr>';
        break;
    default:
        break;
    }
    return html; //Return current field
}
function isScrolledIntoView(elem) {
    if(!elem ||  elem.length ==0) return;
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();
    return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom));
}

function stickyRelocate() {
    if($(document).data("uploadOnly") || window.isMobileDevice || window.noStickyItems)return;
    var sticky = $('#mainNavigation, #fileQueueInfo, #dropItemsPanel, #javaAppletDiv');
    if($.CrushFTP.uploadBarInline)
        sticky = $('#mainNavigation, #dropItemsPanel');
    if (!isScrolledIntoView($('#mainNav-anchor'))) {
        if($(".blockUI.blockMsg.blockPage:visible").length==0)
            sticky.addClass('stick');
        else
            sticky.removeClass('stick');
        if($("#paddingPanel").length == 0)
            $("body").append("<div id='paddingPanel' style='height:100px'></div>");
        if(!$.CrushFTP.uploadBarInline)
        {
            var mainNavHeight = $("#mainNavigation").height();
            $("div#fileQueueInfo.stick").css("top", (mainNavHeight + 3) + "px");
        }
    }
    else {
        sticky.removeClass('stick');
        $("#paddingPanel").remove();
    }
}

$.blockUI.defaults.baseZ = 1111;

//Initialize tabs
function initTabs() {
    $('.customtabs').each(function () {
        $(this).siblings('div').children('div:gt(0)').hide();
        $(this).children('a:first').addClass('active');
        $(this).find('a').click(function () {
            setTabByHandler(this);
            return false;
        });
    });
}

var crushFTPTools = {
    serverRequest: function(dataToSubmit, callback, url, requestType, dataType) {
        dataToSubmit.c2f = crushFTPTools.getCrushAuth();
        requestType = requestType || "POST";
        var obj = {
            type: requestType,
            url: url,
            data: dataToSubmit,
            success: function(msg) {
                // if(dataToSubmit.format != "JSONOBJ")
                // {
                //     var text = msg || '';
                //     if(text.indexOf("FAILURE")>=0 && text.toLowerCase().indexOf("access denied")<0){
                //     }
                // }
                callback(msg);
            },
            error: function(xhr, textStatus, errorThrown) {
                if (textStatus === 'error' || !xhr.responseText) {
                    callback(false, xhr, textStatus, errorThrown);
                    return;
                } else {
                    callback(xhr.responseText);
                    return;
                }
                if (xhr && xhr.statusText && xhr.statusText == "OK" && xhr.response)
                    callback(xhr.response);
                else
                    callback(false, xhr, textStatus, errorThrown);
            }
        };
        if (dataType)
            obj.dataType = dataType;
        if (dataToSubmit.nonAsync) {
            delete dataToSubmit.nonAsync;
            obj.async = false;
        }
        $.ajax(obj);
    },
    encryptPass: function(pass, callback, url) {
        var obj = {
            command: "encryptPassword",
            encrypt_type: "DES",
            password: encodeURIComponent(pass),
            c2f: crushFTPTools.getCrushAuth()
        };
        $.ajax({
            type: "POST",
            url: url,
            data: obj,
            success: function(data) {
                if (data) {
                    callback($.xml2json(data, true));
                } else {
                    callback(false);
                }
            },
            error: function() {
                callback(false);
            }
        });
    },
    queryString : function(name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        var param = match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        return param || "";
    },
    getCrushAuth : function(){
        var auth = $.cookie("currentAuth");
        if(auth && auth.length>0)
            return auth;//.substr(auth.length - 4);
        else
            return false;
    },
    getCrushAuthToken : function(callback){
        if($(document).data("appletAuth"))
        {
            callback($(document).data("appletAuth"));
            return false;
        }
        var obj = {
            command: "getCrushAuth",
            random: Math.random()
        };
        obj.c2f = crushFTPTools.getCrushAuth();
        $.ajax({
            type: "POST",
            url: "/WebInterface/function/",
            data: obj,
            async : false,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                callback(false);
            },
            success: function (msg) {
                var auth = unescape($(msg).find("auth").text());
                try {
                    if (callback) {
                        callback(auth.replace("CrushAuth=", ""));
                    }
                } catch (ex) {
                    if (callback) {
                        callback(false);
                        return false;
                    }
                }
            }
        });
    },
    xmlUnSafeCharsMapping : {
        '&': '&amp;',
        '"': '&quot;',
        "'" : '&apos;',
        '<': '&lt;',
        '>': '&gt;'
    },
    xmlUnSafeCharsMappingReverse : {
        '&amp;' : '&',
        '&quot;' : '"',
        '&apos;' : "'",
        '&lt;' : '<',
        '&gt;' : '>',
        '%2B' : '+',
        '%25' : '%'
    },
    xmlEncode : function(value,onlyHTML)
    {
        if (value == undefined || value.length == 0) return value;
        if(onlyHTML)
        {
            try{
                value = crushFTPTools.decodeURILocal(value);
            }
            catch(ex){
                value = value;
            }
            return value.replace(/([\&'"<>])/g, function(str, item) {
              return crushFTPTools.xmlUnSafeCharsMapping[item];
            });
        }
        else
        {
            return value.replace(/([\&'"<>])/g, function(str, item) {
                return crushFTPTools.xmlUnSafeCharsMapping[item];
            }).replace(/\%/g, "%25").replace(/\+/g, "%2B");
        }
    },
    decodeXML : function(value)
    {
        if (value == undefined || value.length == 0) return value;
         return value.replace(/(&quot;|&lt;|&gt;|&amp;|&apos;|%2B|%25)/g,
            function(str, item) {
                return crushFTPTools.xmlUnSafeCharsMappingReverse[item];
        });
    },
    htmlEncode : function(value, encodeVal, onlyHTML) {
        if(value != undefined && value.length>0)
        {
            var lines = value.split(/\r\n|\r|\n/);
            for (var i = 0; i < lines.length; i++) {
                if(lines[i] && typeof lines[i] == "string")
                lines[i] = crushFTPTools.xmlEncode(lines[i], onlyHTML);
            }
            if(encodeVal)
                return crushFTPTools.encodeURILocal(lines.join('\r\n'));
            else
                return lines.join('\r\n');
        }
        else
            return value;
    },
    decodeURILocal : function(val)
    {
        var _val = val;
        try{
            _val = decodeURIComponent(val);
        }
        catch(ex){
        }
        return _val;
    },
    /* added by carlos */
    limitText : function(val, limite)
    {
        var _val = (val.length > limite) ? val.substring(0,limite) + '...' : val;

        return _val;
    },
    encodeURILocal : function(val)
    {
        var _val = val;
        try{
            _val = encodeURIComponent(val);
        }
        catch(ex){}
        return _val;
    },
    textEncode : function(val){
        return $("<div>").text(val).html();
    },
    xssEncode : function(val){
        return crushFTPTools.htmlEncode(crushFTPTools.textEncode(unescape(val)));
    },
    sanitize : function(str){
        if(!str)return str;
        var tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';
        var tagOrComment = new RegExp(
            '<(?:'
            // Comment body.
            + '!--(?:(?:-*[^->])*--+|-?)'
            // Special "raw text" elements whose content should be elided.
            + '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*'
            + '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
            // Regular name
            + '|/?[a-z]'
            + tagBody
            + ')>',
            'gi');
        function removeTags(html) {
          var oldHtml;
          do {
            oldHtml = html;
            if(html && html.replace)
                html = html.replace(tagOrComment, '');
          } while (html !== oldHtml);
          return html.replace(/</g, '&lt;');
        }
        return removeTags(str);
    }
};

//Set current tab based on element
function setTabByHandler(elm) {
    if (elm && !$(elm).hasClass("disabledClick")) {
        var current_content_div = '#' + $(elm).attr('rel');
        $(elm).siblings().removeClass('active');
        $(elm).addClass('active');
        $(current_content_div).siblings().hide();
        $(current_content_div).show();
    }
    $(elm).blur();
    return false;
}

//Set current tab based on elem name
function setTabToElem(elm) {
    setTabByHandler($("a[rel='" + elm + "']:first"));
}

//Method to clear all items in current form
$.fn.clearForm = function () {
    return this.each(function () {
        var type = this.type,
            tag = this.tagName.toLowerCase();
        if (tag == 'form' || tag == 'div') return $(':input', this).clearForm();
        if (type == 'text' || type == 'password' || tag == 'textarea') this.value = '';
        else if (type == 'checkbox' || type == 'radio') this.checked = false;
        else if (tag == 'select') this.selectedIndex = -1;
    });
};

window.growl = function(title, content, warning, expires){
    $("#growlContainer").notify({
        speed: 500,
        expires: expires
    });
    var handler = $("#growlContainer")
        .notify({ custom:true })
        .notify("create", { title:title, text:content });
    $(handler.element).removeClass("ui-state-error ui-state-highlight");
    if(warning)
    {
        $(handler.element).addClass("ui-state-error");
    }
    else
    {
        $(handler.element).addClass("ui-state-highlight");
    }
}

window.keepSessionAlive = function(){
    if(window.delayedUploadSet && window.sessionLength)
    {
        function refrehsSession(callBack)
        {
            var obj = {
                command: "getUserInfo",
                path : "/",
                random: Math.random()
            };
            obj.c2f = crushFTPTools.getCrushAuth();
            $.ajax({
                type: "POST",
                url: "/WebInterface/function/",
                data: obj,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    callBack(false);
                },
                success: function (msg) {
                    var responseText = msg;
                    try {
                        if (callBack) {
                            callBack(msg);
                        }
                    } catch (ex) {
                        if (callBack) {
                            callBack(false);
                            return false;
                        }
                    }
                }
            });
        }
        refrehsSession(function(flag){

        });
        setTimeout(keepSessionAlive, (window.sessionLength/2)*1000);
    }
}

window.cancelDelayedUpload = function(flag){
    if(flag)
    {
        if(confirm(getLocalizationKeyExternal("DelayedUploadConfirmCancelText")))
        {
            window.cancelDelayedUpload();
        }
        return false;
    }
    if(window.delayedUploadTimer)
    {
        clearTimeout(window.delayedUploadTimer);
        window.delayedUploadTimer = false;
    }
    $("#delayedUploadIndicator").hide();
    window.delayedUploadSetAt =
    window.delayedUploadSet = false;
}

window.delayUploadCounter = function(){
    if(window.delayedUploadSet)
    {
        var setAt = window.delayedUploadSetAt;
        var now = new Date();
        var diff = now - setAt;
        var remaining = window.delayedUploadSet - diff;
        function padtime(time) {
            if (time<=99) { time = ("0"+time).slice(-2); }
            return time;
        }
        function secondsToString(seconds)
        {
            var numhours = padtime(Math.floor(((seconds % 31536000) % 86400) / 3600));
            var numminutes = padtime(Math.floor((((seconds % 31536000) % 86400) % 3600) / 60));
            var numseconds = padtime(Math.floor((((seconds % 31536000) % 86400) % 3600) % 60));
            return numhours + ":" + numminutes + ":" + numseconds;
        }
        $("#delayedUploadIndicator").find("span.remaining").text(secondsToString(remaining / 1000));
        setTimeout(window.delayUploadCounter, 1000);
    }
};

window.setDelayedUpload = function(){
    var time;
    if($("#delayUploadTypeMinute").is(":checked"))
    {
        try{
            time = parseFloat($("#txtUploadTimeout").val()) * 60 * 1000;
        }catch(ex){
            alert(getLocalizationKeyExternal("DelayedUploadNonNumericValAlertText"));
            return;
        }
    }
    else
    {
        var selectedTime = $("#delayedUploadTime").datepicker("getDate");
        if(selectedTime && selectedTime !== null)
        {
            var now = new Date();
            var diffMs = selectedTime - now;
            time = diffMs;
            if(time<=0)
            {
                alert(getLocalizationKeyExternal("DelayedUploadPastTimeAlertText"));
                return;
            }
        }
    }
    var overwrite = $("#chkOverwriteFilesForDelayedupload").is(":checked");
    if(time)
    {
        if(window.delayedUploadTimer)
        {
            clearTimeout(window.delayedUploadTimer);
        }
        var delayedUploadIndicator = $("#delayedUploadIndicator").show();
        var evtTime = new Date();
        evtTime = new Date(evtTime.getTime() + (time));
        delayedUploadIndicator.find("span.time").text(evtTime.format("hh:nn TT"));
        window.delayedUploadSet = time;
        window.delayedUploadSetAt = new Date();
        window.keepSessionAlive();
        window.delayedUploadTimer = setTimeout(function() {
            var fileRepo = $("#fileRepo");
            if(overwrite)
            {
                fileRepo.find(".overwriteLink").click();
                fileRepo.find("#overwriteAllLinkBtn").click();
            }

            fileRepo.find("a.startUploading").click();
            window.cancelDelayedUpload();
        }, time);
        window.delayUploadCounter();
        $.unblockUI();
    }
    else
    {
        alert(getLocalizationKeyExternal("DelayedUploadNonNumericValAlertText"));
        return;
    }
}

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
String.prototype.endsWith = function(str)
{
    return (this.match(str+"$")==str);
}
if(location.hostname.endsWith("."))
{
    location.hostname = location.hostname.substring(0, location.hostname.length-1);
}

jQuery.fn.insertAt = function(index, element) {
  var lastIndex = this.children().size()
  if (index < 0) {
    index = Math.max(0, lastIndex + 1 + index)
  }
  this.append(element)
  if (index < lastIndex) {
    this.children().eq(index).before(this.children().last())
  }
  return this;
}

window.Clipboard = (function(window, document, navigator) {
    var textArea,
        copy;

    function isOS() {
        return navigator.userAgent.match(/ipad|iphone/i);
    }

    function createTextArea(text) {
        textArea = document.createElement('textArea');
        textArea.value = text;
        document.body.appendChild(textArea);
    }

    function selectText() {
        var range,
            selection;

        if (isOS()) {
            range = document.createRange();
            range.selectNodeContents(textArea);
            selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            textArea.setSelectionRange(0, 999999);
        } else {
            $(textArea).select();
            setTimeout(function(){$(textArea).select().focus()});
        }
    }

    function copyToClipboard() {
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }

    copy = function(text) {
        createTextArea(text);
        selectText();
        if(navigator.appVersion.indexOf("Edge") != -1)
            copyToClipboard();
        setTimeout(copyToClipboard, 200);
    };

    return {
        copy: copy
    };
})(window, document, navigator);


var copyToClipboard = function(str, method){
    try{
        navigator.clipboard.writeText(str);
    }catch(ex){
        if(method){
            Clipboard.copy(str);
            return;
        }
        var el = document.createElement('textarea');  // Create a <textarea> element
        el.value = str;                                 // Set its value to the string that you want copied
        el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
        el.style.position = 'absolute';
        el.style.left = '-9999px';                      // Move outside the screen to make it invisible
        document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
        var selected =
        document.getSelection().rangeCount > 0        // Check if there is any content selected previously
          ? document.getSelection().getRangeAt(0)     // Store selection if found
          : false;                                    // Mark as false to know no selection existed before
        el.select();                                    // Select the <textarea> content
        document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
        document.body.removeChild(el);                  // Remove the <textarea> element
        if (selected) {                                 // If a selection existed before copying
            document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
            document.getSelection().addRange(selected);   // Restore the original selection
        }
    }
}

var loading = {
    init : function(){
        this.panel = $("#loadingIndicator").hide();
        if(this.panel.dialog("instance"))
            return;
        this.panel.dialog({
            autoOpen: false,
            dialogClass: "loadingIndicatorWindow",
            closeOnEscape: false,
            draggable: false,
            width: window.loadingIndicatorDialogWidth || 150,
            minHeight: 50,
            modal: false,
            buttons: {},
            resizable: false,
            open: function() {
                $('body').css('overflow','hidden');
            },
            close: function() {
                $('body').css('overflow','auto');
                $(this).dialog('destroy');
            }
        });
    },
    shown : false,
    count : 0,
    panel : $("#loadingIndicator"),
    modal : false,
    show : function(modal){
        this.init();
        if(modal && this.panel.dialog){
            this.modal = modal;
            this.panel.dialog("option", "modal", true);
        }
        if(!this.shown && this.panel.dialog){
            this.panel.dialog('open');
            this.shown = true;
        }
        this.count++;
    },
    hide : function(force){
        this.count--;
        this.count = this.count<0 ? 0 : this.count;
        if(force)
            this.count = 0;
        if(this.count == 0 && this.panel.dialog){
            try{
                if(!this.panel.dialog("instance"))
                    return;
                var that = this;
                setTimeout(function(){
                    that.init();
                    that.panel.dialog("option", "modal", false);
                    //that.panel.dialog('close');
                })
                this.shown = false;
                var that = this;
                setTimeout(function(){
                    if(!that.shown){
                        that.init();
                        if(that.panel.dialog("instance")){
                            that.panel.dialog("option", "modal", false);
                            that.panel.dialog('close');
                            that.panel.hide();
                        }
                    }
                }, 500);
            }catch(ex){}
        }
    }
};

function toggleFullscreen(elem) {
  elem = elem || document.documentElement;
  if (!document.fullscreenElement && !document.mozFullScreenElement &&
    !document.webkitFullscreenElement && !document.msFullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}