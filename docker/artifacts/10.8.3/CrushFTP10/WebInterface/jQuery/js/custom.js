window.rumMOKey='c5860c405b8de338966458bc4ebf6aab';
(function()
{
	if(window.performance && window.performance.timing && window.performance.navigation)
		{
			var site24x7_rum_beacon=document.createElement('script');
			site24x7_rum_beacon.async=true;
			site24x7_rum_beacon.setAttribute('src','//static.site24x7rum.com/js/rum-beacon-min.js');
			document.getElementsByTagName('head')[0].appendChild(site24x7_rum_beacon);
	}
}
)(window);

window.ConPDS = (function() {
    var isContainerImagePreview = false,
        hasLogData = false,
        contacts = [];
    /*Init methods*/
    function init() {
        if (typeof window.manageShares != "undefined") {
            return false;
        }
        window.onMenuRendering = function(menus) {
            var path = hashListener.getHash();
            if (path.endsWith("/"))
                path = path.substring(0, path.length - 1);
            folderName = path.substring(path.lastIndexOf("/") + 1, path.length);
            validateFolder(folderName, "/", function(isValid) {
                if (isValid) {
                    $("a[href*='ConPDS.']").parent().show();
                    $("a[command*='ConPDS.']").parent().removeClass('custom-menu-disable');
                    $("#fileQueueInfo,#dndInfoTextHolder").show();
                } else {
                    $("a[href*='ConPDS.']").parent().hide();
                    $("a[command*='ConPDS.']").parent().addClass("custom-menu-disable");
                    if(currentFolderHasImage())
                    {
                        $("a[href*='ConPDS.photoPreview']").parent().show();
                        $("a[command*='ConPDS.photoPreview']").parent().removeClass("custom-menu-disable");
                    }
                    $("#fileQueueInfo,#dndInfoTextHolder").hide();
                    var privs = $(document).data("curDirPrivs") || "";
                    $(document).data("curDirPrivs", privs.replace(/(write)/g, ''));
                }
            }, true);
            checkLog();
            getAddressConfigs();
        }
        window.onImagePreviewExifFetch = function(exif) {
            if (isContainerImagePreview) {
                buildConPDSExifInfo(exif);
            }
        }

        window.onImagePreviewenter = function() {
            isContainerImagePreview = true;
        }

        window.onImagePreviewExit = function() {
            isContainerImagePreview = false;
        }
    }

    function checkLog() {
        var cb = function() {
            if (hasLogData) {
                $("a[href*='ConPDS.emailOverview'], a[href*='ConPDS.consolidatedEmailOverview']").parent().show();
                $("a[command*='ConPDS.emailOverview'], a[command*='ConPDS.consolidatedEmailOverview']").parent().removeClass('custom-menu-disable');
            } else {
                $("a[href*='ConPDS.emailOverview']").parent().hide();
                $("a[command*='ConPDS.emailOverview']").parent().addClass("custom-menu-disable");
            }
        }
        var path = crushFTPTools.encodeURILocal("/CONPDS/"+$(document).data("username")+"_photodist.log");
        if($.browser.msie && $.browser.version <= 12)
            path = crushFTPTools.encodeURILocal(unescape("/CONPDS/"+$(document).data("username")+"_photodist.log"));
        var obj = {
            command: "download",
            mimeType : "text-plain",
            path: path,
            random: Math.random(),
            c2f: crushFTPTools.getCrushAuth()
        };
        $.ajax({
            type: "GET",
            url: "/WebInterface/function/",
            data: obj,
            async: true,
            success: function(data) {
                if (data)
                    hasLogData = true;
            },
            complete: function() {
                cb();
            }
        });
    }

    function getAddressConfigs() {
        var path = crushFTPTools.encodeURILocal("/CONPDS/" + $(document).data("username") + "_email_addressbook.config");
        if($.browser.msie && $.browser.version <= 12)
            path = crushFTPTools.encodeURILocal(unescape("/CONPDS/" + $(document).data("username") + "_email_addressbook.config"));
        var obj = {
            command: "download",
            mimeType : "text-plain",
            path: path,
            random: Math.random(),
            c2f: crushFTPTools.getCrushAuth()
        };
        $.ajax({
            type: "GET",
            url: "/WebInterface/function/",
            data: obj,
            async: true,
            success: function(data) {
                if (data) {
                    contacts = data.split("\n");
                }
            }
        });
    }

    function buildConPDSExifInfo(exif) {
        var exifPanel = $("#exifPanel");
        var cb = $("#colorbox");
        exifPanel.draggable("destroy");
        exifPanel.css({
            "width": "100%",
            "position": "absolute",
            "top": "auto",
            "bottom": "18px",
            "height": "1px",
            "padding": "0px",
            "background-color": "transparent"
        }).find(".exifClose, .moveHandle").hide();
        //exifPanel.find(".exifContent").css({"width" : "780px", "position" : "relative", "left" : "50%", "margin-left" : "-390px"});
        var tbl = exifPanel.find(".exifInformationList").find("table").empty();
        var comment = exif.usercomment || "";
        comment = comment.split("|");
        var deviceID, version, ipv4;
        for (var i = 0; i < comment.length; i++) {
            var curItem = comment[i];
            var data = curItem.split(":");
            if (data.length > 1) {
                var name = $.trim(data[0].toLowerCase())
                if (name == "device id")
                    deviceID = data[1];
                else if (name == "version name")
                    version = data[1];
                else if (name == "ipv4")
                    ipv4 = data[1];
            }
        }
        var devieType = exif.model || "";
        var _location = exif.gpsposition || "";
        var _lat = _location.split(",")[0].match(/[0-9,.,N,S,E,W]+/g);
        var _long = _location.split(",")[1].match(/[0-9,.,N,S,E,W]+/g);

        function getDegree(data) {
            var d = data[0],
                m = data[1],
                s = data[2],
                dir = data[3];
            d = d - 0;
            m = m - 0;
            var sign = (dir == 'W' || dir == 'S') ? -1 : 1;
            return (((s / 60 + m) / 60) + d) * sign;
        }
        var latitude = getDegree(_lat);
        var longitude = getDegree(_long);

        function getImageHTML(size) {
            return "http://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=15&scale=1&size=" + size + "&maptype=roadmap&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:1%7C" + latitude + "," + longitude;
        }
        var _deviceID = getLocalizationKeyExternal("conPDSExifDeviceID") || "Device ID : ";
        var deviceType = getLocalizationKeyExternal("conPDSExifDeviceType") || "Device Tpe : ";
        var conPDSAppVersion = getLocalizationKeyExternal("conPDSAppVersion") || "ConPDS App Version : ";
        var _ipv4 = getLocalizationKeyExternal("conPDSIPv4") || "IPv4 : ";
        var gpsLocation = getLocalizationKeyExternal("conPDSGPSLocation") || "GPS Location : ";
        tbl.append("<tr><td style='text-align:center'><strong>" + _deviceID + "</strong>" + deviceID + "&nbsp;&nbsp;&nbsp;&nbsp;<strong>" + deviceType + "</strong>" + devieType + "&nbsp;&nbsp;&nbsp;&nbsp;<strong>" + conPDSAppVersion + "</strong>" + version + "&nbsp;&nbsp;&nbsp;&nbsp;<strong>" + gpsLocation + "</strong><a href='javascript:void(0);' style='color:#fff;' id='showPhotoGPSLocation'>" + _location + "</a></td></tr>");
        cb.append(exifPanel);
        $("#showPhotoGPSLocation").unbind('click').bind("click", function() {
            var pic = $("#cboxPhoto");
            if (pic.attr("_src")) {
                $("#cboxPhoto").parent().find("iframe").remove();
                pic.show();
                pic.attr("src", pic.attr("_src")).removeAttr("_src");
                $('.rotateImgCounterClockwise, .rotateImgClockwise', cb).show();
            } else {
                var width = $("#cboxPhoto").width();
                var height = $("#cboxPhoto").height();
                $("#cboxPhoto").before("<iframe width='"+width+"' height='"+height+"' frameborder='0' scrolling='no' marginheight='0' marginwidth='0' src='/WebInterface/jQuery/map.html?lat="+latitude+"&long="+longitude+"'></iframe>");
                pic.attr("_src", pic.attr("src")).hide();
                $('.rotateImgCounterClockwise, .rotateImgClockwise', cb).hide();
            }
        })
    }

    function confirmAction(title, desc, callback) {
        if ($("#dertConfirmPopup").length == 0) {
            var dertSharePopupTitle = getLocalizationKeyExternal("conPDSConfirmPopupTitle") || "Confirm";
            var buttonYes = getLocalizationKeyExternal("conPDSConfirmPopupYes") || "Yes";
            var buttonNo = getLocalizationKeyExternal("conPDSConfirmPopupNo") || "No";
            $("body").append('<div id="dertConfirmPopup" style="display:none;"><h2 id="conPDSConfirmPopupTitle" class="popupHeader">' + dertSharePopupTitle + '</h2><div id="conPDSConfirmPopupDesc" style="margin: 10px;font-size: 16px;margin-bottom: -15px;"></div><div class="buttonPanel"><br /> <br /> <div style="text-align: right; margin-top: 10px;"> <button style="padding:8px 20px;" class="btn submit-btn buttonYes">' + buttonYes + '</button>  <button  style="padding:8px 20px;" class="btn submit-btn buttonNo">' + buttonNo + '</button></div> </div> </div> ');
        }
        var dertSharePopupTitle = title || getLocalizationKeyExternal("conPDSConfirmPopupTitle") || "Confirm";
        $("#conPDSConfirmPopupTitle").html(dertSharePopupTitle);
        var dertSharePopupDesc = desc || getLocalizationKeyExternal("conPDSConfirmPopupDesc") || "Are you sure?";
        $("#conPDSConfirmPopupDesc").html(dertSharePopupDesc);
        var popup = $("#dertConfirmPopup");
        popup.find(".buttonNo").unbind().bind("click", function() {
            $.unblockUI();
            callback(false);
        });
        popup.find(".buttonYes").unbind().bind("click", function() {
            $.unblockUI();
            callback(true);
        });
        showPopup('dertConfirmPopup');
    }

    function customAlert(title, desc, callback) {
        if ($("#dertAlertPopup").length == 0) {
            var dertSharePopupTitle = getLocalizationKeyExternal("conPDSAlertPopupTitle") || "Alert";
            var buttonOK = getLocalizationKeyExternal("conPDSConfirmPopupOK") || "OK";
            $("body").append('<div id="dertAlertPopup" style="display:none;"><div id="conPDSAlertPopupDesc" style="margin: 10px;font-size: 16px;margin-bottom: -15px;"></div><br /> <br /> <div style="text-align: right; margin-top: 10px;"> <button style="padding:8px 20px;" tabindex="1" class="btn submit-btn buttonYes">' + buttonOK + '</button></div></div>');
        }
        var dertSharePopupTitle = title || getLocalizationKeyExternal("conPDSAlertPopupTitle") || "Alert";
        $("#conPDSAlertPopupTitle").html(dertSharePopupTitle);
        var dertSharePopupDesc = desc || getLocalizationKeyExternal("conPDSAlertPopupDesc") || "Alert";
        $("#conPDSAlertPopupDesc").html(dertSharePopupDesc);
        $('#dertAlertPopup').dialog({
            title: dertSharePopupTitle,
            width: 400,
            dialogClass : 'dertAlertDialog',
            resizable : false,
            modal: true,
            open : function(){
              var btn = $('#dertAlertPopup').find("button").unbind().bind("click", function(){
                  $('#dertAlertPopup').dialog('close');
                  callback(true);
              });
              $('#txtDERTDestination').attr("disabled", "disabled").blur();
              $(document).bind("keyup.alert", function(evt){
                if(evt.keyCode == 27 || evt.keyCode == 13){
                    btn.trigger("click");
                    $(document).unbind("keyup.alert");
                    evt.preventDefault();
                    evt.stopPropagation();
                    return false;
                }
              });
              $("#dertAlertPopup").parent().css("z-index", 1200).next().css("z-index", 1100);
            },
            close : function(){
                $('#txtDERTDestination').removeAttr("disabled").focus();
            }
        });
    }

    /*A proxy method to fire DERT Actions*/
    function action(context) {
        if (context.SendToDERT) {
            sendToDERT(context);
        } else if (context.sendEmail) {
            sendEmail(context);
        } else if (context.moveFiles) {
            moveFiles(context);
        } else if (context.sendToEmailDirect) {
            sendToEmailDirect(context);
        }
    };

    /*Gets all required details of selected items in WI*/
    function getSelectionDetails(context, callback) {
        var el = false;
        if (context) {
            el = currentContext();
        }
        var selectedItems = window.getSelectedItems(el);
        if (selectedItems.length == 0) {
            var selectAllFilesConfirm = getLocalizationKeyExternal("dertConfirmAllFileSelection") || "You don't have any items selected, do you want to select all items in current folder?";
            confirmAction(false, selectAllFilesConfirm, function(result) {
                if (result) {
                    selectDeselectAllItems(true);
                    selectedItems = window.getSelectedItems(false, true);
                    if (selectedItems.length == 0) {
                        var nothingToProcess = getLocalizationKeyExternal("dertNothingToProcess") || "There's no item to process";
                        $.growlUI("Error", nothingToProcess, 3000, "growlError");
                        return false;
                    }
                    window.getAllItemsListBeingShared(selectedItems, function(names, multiple, custItems) {
                        var fileName = "";
                        var fileNames = "";
                        if (custItems) {
                            multipleFiles = custItems.length > 1;
                            for (var i = 0; i < custItems.length; i++) {
                                var curItem = custItems[i];
                                var _fileName = unescape(curItem.name);
                                fileName += _fileName + "\r\n";
                                var name = _fileName.substring(_fileName.lastIndexOf("/", _fileName.length - 2) + 1);
                                if (name)
                                    fileNames += name + "\r\n";
                            }
                        }
                        callback({
                            fileName: fileName,
                            fileNames: fileNames,
                            selectedItems: selectedItems,
                            names: names,
                            custItems: custItems
                        });
                    });
                } else {
                    return false;
                }
            });
        } else {
            selectedItems = window.getSelectedItems(false);
            if (selectedItems.length == 0) {
                var nothingToProcess = getLocalizationKeyExternal("dertNothingToProcess") || "There's no item to process";
                $.growlUI("Error", nothingToProcess, 3000, "growlError");
                return false;
            }
            window.getAllItemsListBeingShared(selectedItems, function(names, multiple, custItems) {
                var fileName = "";
                var fileNames = "";
                if (custItems) {
                    multipleFiles = custItems.length > 1;
                    for (var i = 0; i < custItems.length; i++) {
                        var curItem = custItems[i];
                        var _fileName = unescape(curItem.name);
                        fileName += _fileName + "\r\n";
                        var name = _fileName.substring(_fileName.lastIndexOf("/", _fileName.length - 2) + 1);
                        if (name)
                            fileNames += name + "\r\n";
                    }
                }
                callback({
                    fileName: fileName,
                    fileNames: fileNames,
                    selectedItems: selectedItems,
                    names: names,
                    custItems: custItems
                });
            });
        }
    }

    function showPopup(id, css) {
        css = css || {};
        var defaultCSS = {
            padding: '20px 30px 0px 30px',
            'background-color': getPopupColorExternal(true),
            'border': "1px solid " + getPopupColorExternal(),
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            color: '#000',
            opacity: 0.9,
            top: '20%',
            left: '50%',
            width: '500px',
            'margin-left': '-250px',
            position: 'absolute'
        };
        css = $.extend(defaultCSS, css);
        $.blockUI({
            message: $("#" + id),
            css: css
        });
    }


    /*
    Desc :
    - If used it will show popup with text area.
    - When user will click ok, it will call customEvent and pass information of selected items and content of the text area as {conpds_email_body} to the event.
    - Cannot be combined with any other parameters
     */
    function sendToDERT(context, eventParams) {
        getSelectionDetails(context, function(data) {
            if ($("#sendToDERTPopup").length == 0) {
                var dertSharePopupTitle = getLocalizationKeyExternal("sendToDertPopupHeaderText") || " Remarks til Mercplus";
                var buttonSubmitDertPopupOK = getLocalizationKeyExternal("buttonSubmitPopupOKText") || "OK";
                var dertSharePopupDesc = getLocalizationKeyExternal("sendToDertPopupDescText") || "<p>Kommentarer i teksboksen herunder bliver automatisk overført som remarks i Mercplus</br>(dog max. 1000 karakterer)</br>Har du ingen kommentarer klikker du blot OK. </p>Du modtager selv en kopi af mailen til DERT og der kommer svar direkte til din mailboks</br>om billederne er blevet afleveret succesfuldt.";

                $("body").append('<div id="sendToDERTPopup" style="display:none;"> <img class="closeButton" alt="close" src="/WebInterface/Resources/customImages/cancel.png" onclick="$.unblockUI();selectDeselectAllItems(false);"/> <h2 id="sendToDertPopupHeaderText" class="popupHeader">' + dertSharePopupTitle + '</h2><div id="sendToDertPopupDescText" class="conPDSPopupText">' + dertSharePopupDesc + '</div><div class="buttonPanel"> <div style="width:100%;"> <textarea id="sendToDERTPopupEmailBody" style="width:99%;height:150px;" maxlength="1000"></textarea> </div> <br /> <br /> <div style="text-align: right; margin-top: 10px;"> <button style="padding:8px 20px;" class="btn submit-btn buttonYes buttonSubmitPopupOKText">' + buttonSubmitDertPopupOK + '</button> </div> </div> </div> ');
            }
            var popup = $("#sendToDERTPopup");
            popup.find("input[type!='button'], textarea").val("");
            popup.find(".submit-btn").unbind().bind("click", function() {
                var paths = data.fileName.split("\r\n");
                var itms = [];
                for (var i = 0; i < paths.length; i++) {
                    itms.push(paths[i]);
                }
                var obj = {
                    command: "customEvent",
                    paths: escape(itms.join(";")),
                    random: Math.random(),
                    c2f: crushFTPTools.getCrushAuth()
                };
                var loadingIndicator = $("#loadingIndicator");
                loading.init();
                loadingIndicator.dialog("option", "modal", true);
                loadingIndicator.dialog('open');
                var customBody = $("#sendToDERTPopupEmailBody").val();
                obj.conpds_command = "SendToDERT";
                obj.conpds_email_body = crushFTPTools.encodeURILocal(customBody);
                eventParams = eventParams || "";
                obj.conpds_customEventParam = crushFTPTools.encodeURILocal(eventParams);
                $.ajax({
                    type: "POST",
                    url: "/WebInterface/function/",
                    data: obj,
                    async: true,
                    success: function(data) {
                        loading.init();
                        loadingIndicator.dialog("option", "modal", false);
                        loadingIndicator.dialog('close');
                        selectDeselectAllItems(false);
                        $.unblockUI();
                    }
                });
            });
            showPopup('sendToDERTPopup', {
                width: "700px",
                "margin-left": "-350px"
            });
        });
    };

    /*
    Desc :
     - If used it will show popup with radio button to select Attach or Share, text areas to specify Email Addresses, Email Subject and Email Body.
     - When user will click ok, it will call customEvent and pass information of selected items and Attach/Share as {conpds_email_sharetype}, Email Addresses as {conpds_email_recipients}, Email Subject as {conpds_email_subject} and Email Body as {conpds_email_body} to the event.
     - Cannot be combined with any other parameters
     */
    function sendEmail(context, eventParams) {
        getSelectionDetails(context, function(data) {
            if ($("#sendEmailPopup").length == 0) {
                var dertSharePopupTitle = getLocalizationKeyExternal("sendEmailPopupTitleText") || " Remarks til Mercplus";
                var buttonSubmitDertPopupOK = getLocalizationKeyExternal("buttonSubmitPopupOKText") || "OK";
                var dertSharePopupDesc = getLocalizationKeyExternal("sendEmailPopupDescText") || "<p>Kommentarer i teksboksen herunder bliver automatisk overført som remarks i Mercplus</br>(dog max. 1000 karakterer)</br>Har du ingen kommentarer klikker du blot OK. </p>Du modtager selv en kopi af mailen til DERT og der kommer svar direkte til din mailboks</br>om billederne er blevet afleveret succesfuldt.";
                var customAttachTitle = getLocalizationKeyExternal("dertAttachPhotosLabel") || "Attach Photos";
                var customShareTitle = getLocalizationKeyExternal("dertSharePhotosLabel") || "Share Photos";
                var customEmailAdressTitle = getLocalizationKeyExternal("dertCustomEmailToLabel") || "Email Address : ";
                var customEmailSubjectTitle = getLocalizationKeyExternal("dertCustomEmailSubjectLabel") || "Email Subject : ";
                var customEmailBodyTitle = getLocalizationKeyExternal("dertCustomEmailBodyLabel") || "Email Body : ";
                var customizations = $(document).data("customizations") || [];
                var defaultSubject = "";
                var defaultEmail = "";
                var defaultEmailAttach = "";
                for (var i = 0; i < customizations.length; i++) {
                    if (customizations[i].key == "EMAILSUBJECT")
                        defaultSubject = customizations[i].value;
                    else if (customizations[i].key == "EMAILBODY")
                        defaultEmail = customizations[i].value;
                    else if (customizations[i].key == "CONPDSEMAILSUBJECT")
                        defaultSubject = customizations[i].value;
                }
                defaultEmailAttach = defaultEmail + "";
                defaultEmail = defaultEmail.replace(/\\r/g, '\r');
                defaultEmail = defaultEmail.replace(/\\n/g, '\n');
                var emailVal = crushFTPTools.decodeXML(defaultEmail);

                var containerID = "";
                var date = "";
                var path = "";
                try {
                    var hash = hashListener.getHash().split("/");
                    containerID = hash[2];
                    date = hash[3];
                    path = "/" + hash.splice(1).join("/");
                } catch (ex) {}
                defaultSubject = defaultSubject.replace(/\\r/g, '\r');
                defaultSubject = defaultSubject.replace(/\\n/g, '\n');
                defaultSubject = crushFTPTools.decodeXML(defaultSubject);
                defaultSubject = defaultSubject.replace(/\{1\}/g, containerID).replace(/\{2\}/g, date).replace(/\{3\}/g, path);

                defaultEmailAttach = defaultEmailAttach.replace(/\\r/g, '\r');
                defaultEmailAttach = defaultEmailAttach.replace(/\\n/g, '\n');
                defaultEmailAttach = crushFTPTools.decodeXML(defaultEmailAttach);
                defaultEmailAttach = defaultEmailAttach.replace(/\{1\}/g, containerID).replace(/\{2\}/g, date).replace(/\{3\}/g, path);
                $("body").append('<div id="sendEmailPopup" style="display:none;"> <img class="closeButton" alt="close" src="/WebInterface/Resources/customImages/cancel.png" onclick="$.unblockUI();selectDeselectAllItems(false);"/> <h2 id="sendEmailPopupTitleText" class="popupHeader">' + dertSharePopupTitle + '</h2><div id="sendEmailPopupDescText" class="conPDSPopupText">' + dertSharePopupDesc + '</div><hr style="border-bottom: 1px solid #eee;border-top: 0px;margin-top: 10px;"><div class="buttonPanel"><div class="showEmailPrompt"><div style="width:100%;margin-bottom:10px;"> <div style="width:100%;margin-bottom:5px;"></div> <label><input type="radio" name="photoSendType" checked id="attachPhotos" value="attach"><span id="customAttachTitle">' + customAttachTitle + '</span> </label> &nbsp; &nbsp;<label><input type="radio" id="sharePhotos" name="photoSendType" value="share"><span id="customShareTitle">' + customShareTitle + '</span> </label></div><div style="width:100%;margin-bottom:10px;"> <div style="width:100%;margin-bottom:5px;"><strong id="customEmailAdressTitle">' + customEmailAdressTitle + '</strong></div> <textarea id="sendEmailPopupAddress" style="width:99%;height:50px;"></textarea> </div><div style="width:100%;margin-bottom:10px;"> <div style="width:100%;margin-bottom:5px;"><strong id="customEmailSubjectTitle">' + customEmailSubjectTitle + '</strong></div> <input id="sendEmailPopupSubject" style="width:99%;" /></div><div style="width:100%;margin-bottom:5px;"><strong id="customEmailBodyTitle">' + customEmailBodyTitle + '</strong></div> <div style="width:100%;"> <textarea id="sendEmailPopupEmailBody" style="width:99%;height:150px;border-color:#D0C7C7;" maxlength="1000"></textarea> </div></div> <br /> <br /> <div style="text-align: right; margin-top: 10px;"> <button style="padding:8px 20px;" class="btn submit-btn buttonYes buttonSubmitPopupOKText">' + buttonSubmitDertPopupOK + '</button>  </div> </div> </div> ');

                $("#sendEmailPopupSubject").val(defaultSubject).data("defaultVal", defaultSubject);

                $("input[type='radio']").change(function() {
                    if ($(this).is("#attachPhotos:checked")) {
                        $("#sendEmailPopupEmailBody").val(defaultEmailAttach);
                    } else {
                        $("#sendEmailPopupEmailBody").val(defaultEmail);
                    }
                });
                var tags = contacts.length > 0 ? contacts : false;
                var recipientsTagI = $("#sendEmailPopupAddress").tagsInput({
                    'width': "97%",
                    'height': '100px',
                    'interactive': true,
                    'defaultText': '',
                    autocomplete_url: function(request, response) {
                        var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(request.term), "i");
                        response($.grep(tags, function(item) {
                            return matcher.test(item);
                        }));
                    },
                    'onAddTag': function(tag) {
                        var _tag = tag.toLowerCase();
                        var isTagValid = false;

                        function IsNumeric(input) {
                            return !isNaN(input) && !((input - 0) == input && input.length > 0);
                        }
                        if (window.isChagingPC) {
                            $('#sendEmailPopupAddress').removeTag(tag);
                            return;
                        }
                        //Validate emails
                        function validateEmail(email, strict) {
                            if (strict) {
                                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                return re.test(email);
                            } else {
                                return email.indexOf("@") > 0 && email.lastIndexOf(".") > email.indexOf("@");
                            }
                        }
                        if (_tag) {
                            if (IsNumeric(parseInt(_tag))) {
                                var accno = _tag;
                                if (IsNumeric(parseInt(accno)) && accno.length == 10) {
                                    isTagValid = true;
                                }
                            } else {
                                var email = _tag;
                                if (validateEmail(email, true)) {
                                    isTagValid = true;
                                }
                            }
                        }
                        if (!isTagValid) {
                            var customShareInvalidRecipientErrorText = getLocalizationKeyExternal("customShareInvalidRecipientErrorText") || "Entered Recipient is invalid";
                            $("#sendEmailPopupAddress").addClass("haserror");
                            customAlert(false, customShareInvalidRecipientErrorText, function() {
                                $('#sendEmailPopupAddress').removeTag(tag);
                                $("#sendEmailPopupAddress").removeClass("haserror");
                            });
                        }
                    },
                    'delimiter': [','],
                    'removeWithBackspace': false,
                    'minChars': 4,
                    'maxChars': 0,
                    'placeholderColor': '#666666'
                });
            }
            if ($("#sendEmailPopupCompletePopup").length == 0) {
                var dertShareInfoPopupTitle = getLocalizationKeyExternal("conPDSSentPhotosPopupTitle") || "PHOTOS SENT TO EMAIL";
                var buttonSubmitDertPopupOK = getLocalizationKeyExternal("buttonSubmitPopupOKText") || "OK";
                var dertShareInfoPopupDesc = getLocalizationKeyExternal("conPDSSentPhotosPopupDesc") || "Photos sent via email";
                $("body").append('<div id="sendEmailPopupCompletePopup" style="display:none;font-size:14px;"> <img class="closeButton" alt="close" src="/WebInterface/Resources/customImages/cancel.png" onclick="$.unblockUI();"/> <h2 class="popupHeader" id="dertShareInfoPopupTitle">' + dertShareInfoPopupTitle + '</h2><div id="dertShareInfoPopupDesc" class="conPDSPopupText" style="margin-top:30px;margin-bottom:-25px;">' + dertShareInfoPopupDesc + '</div><div class="buttonPanel"> <br /> <br /> <div style="text-align: right; margin-top: 10px;"><button onclick="$.unblockUI();" style="padding:8px 20px;" class="btn submit-btn buttonYes buttonSubmitPopupOKText">' + buttonSubmitDertPopupOK + '</button> </div> </div> </div> ');
            }
            var popup = $("#sendEmailPopup");
            popup.find("input[type!='button'], textarea").val("");
            popup.find("input[type='radio']:first").attr("checked", "checked").trigger("change");
            $("#sendEmailPopupSubject").val($("#sendEmailPopupSubject").data("defaultVal"));
            while ($("#sendEmailPopup").find(".tagsinput:visible").find("a").length) {
                $("#sendEmailPopup").find(".tagsinput:visible").find("a").trigger("click");
            }
            setTimeout(function(){
                while ($("#sendEmailPopup").find(".tagsinput:visible").find("a").length) {
                    $("#sendEmailPopup").find(".tagsinput:visible").find("a").trigger("click");
                }
            }, 100);
            setTimeout(function(){
                while ($("#sendEmailPopup").find(".tagsinput:visible").find("a").length) {
                    $("#sendEmailPopup").find(".tagsinput:visible").find("a").trigger("click");
                }
            }, 500);
            setTimeout(function(){
                while ($("#sendEmailPopup").find(".tagsinput:visible").find("a").length) {
                    $("#sendEmailPopup").find(".tagsinput:visible").find("a").trigger("click");
                }
            }, 1000);

            function sendAction(){
                var paths = data.fileName.split("\r\n");
                var itms = [];
                for (var i = 0; i < paths.length; i++) {
                    itms.push(paths[i]);
                }
                var obj = {
                    command: "customEvent",
                    paths: escape(itms.join(";")),
                    random: Math.random(),
                    c2f: crushFTPTools.getCrushAuth()
                };
                obj.conpds_command = crushFTPTools.encodeURILocal("SendEmail");
                obj.conpds_email_sharetype = $("#attachPhotos").is(":checked") ? "Attach" : "Share";
                obj.conpds_email_recipients = recipientsTagI ? crushFTPTools.encodeURILocal(recipientsTagI.val()) : "";
                obj.conpds_email_subject = crushFTPTools.encodeURILocal($("#sendEmailPopupSubject").val());
                obj.conpds_email_body = crushFTPTools.encodeURILocal($("#sendEmailPopupEmailBody").val());
                eventParams = eventParams || "";
                obj.conpds_customEventParam = crushFTPTools.encodeURILocal(eventParams);
                if(!obj.conpds_email_recipients)
                {
                    var val = $("#sendEmailPopup").find(".tagsinput:visible").find("input").val();
                    if(val){
                        recipientsTagI.addTag(val);
                        setTimeout(function(){
                            if(recipientsTagI && !recipientsTagI.hasClass('haserror')){
                                obj.conpds_email_recipients = recipientsTagI ? crushFTPTools.encodeURILocal(recipientsTagI.val()) : "";
                                if(obj.conpds_email_recipients)
                                    popup.find(".submit-btn").trigger("click");
                            }
                        }, 500);
                        return false;
                    }
                }
                if(!obj.conpds_email_recipients)
                {
                    if($("#sendEmailPopup").find(".tagsinput:visible").find(".tag").length>0)
                    {
                        var _recipients = [];
                        $("#sendEmailPopup").find(".tagsinput:visible").find(".tag").each(function(){
                            _recipients.push($.trim($(this).find("span").text()));
                        });
                        if(_recipients.length>0)
                            obj.conpds_email_recipients = _recipients.join(",");
                    }
                    if(!obj.conpds_email_recipients)
                    {
                        var emailRecipientsNotAddedMessage = getLocalizationKeyExternal("emailRecipientsNotAddedMessage") || "Please enter email recipients.";
                        customAlert(false, emailRecipientsNotAddedMessage, function() {
                            $("#txtDERTDestination").focus();
                        });
                        return false;

                    }
                }
                var loadingIndicator = $("#loadingIndicator");
                loading.init();
                loadingIndicator.dialog("option", "modal", true);
                loadingIndicator.dialog('open');
                $.ajax({
                    type: "POST",
                    url: "/WebInterface/function/",
                    data: obj,
                    async: true,
                    success: function(data) {
                        loading.init();
                        loadingIndicator.dialog("option", "modal", false);
                        loadingIndicator.dialog('close');
                        showPopup('sendEmailPopupCompletePopup', {
                            width: '600px',
                            'margin-left': '-300px'
                        });
                        selectDeselectAllItems(false);
                        checkLog();
                    }
                });
            }
            popup.find(".submit-btn").unbind().bind("click", function() {
                setTimeout(function(){
                    sendAction();
                }, 200);
            });
            showPopup('sendEmailPopup', {
                width: "700px",
                "margin-left": "-350px"
            });
        });
    };

    function currentFolderHasImage(){
        if(window.l && window.l.length>0){
            for (var i = 0; i < window.l.length; i++) {
                if(window.l[i].name.toLowerCase().endsWith(".jpg"))
                    return true;
            }
        }
        return false;
    }

    function validateFolder(folderName, path, callback, ignoreFailureCheck) {
        folderName = folderName.split("-");
        if (folderName.length != 3) {
            callback(false);
            return;
        }
        var date;
        try {
            date = new Date(parseInt(folderName[0], 10), parseInt(folderName[1], 10) - 1, parseInt(folderName[2], 10));
        } catch (ex) {
            callback(false);
            return;
        }
        if (date) {
            if (ignoreFailureCheck) {
                callback(true);
                return;
            }
            var obj = {
                command: "getXMLListing",
                format: "JSONOBJ",
                path: path,
                random: Math.random()
            };
            var loadingIndicator = $("#loadingIndicator");
            loading.init();
            loadingIndicator.dialog("option", "modal", true);
            loadingIndicator.dialog('open');
            obj.c2f = crushFTPTools.getCrushAuth();
            $.ajax({
                type: "POST",
                url: "/WebInterface/function/",
                data: obj,
                async: true,
                dataType: "json",
                beforeSend: function(x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                success: function(data) {
                    loading.init();
                    loadingIndicator.dialog("option", "modal", false);
                    loadingIndicator.dialog('close');
                    var fileItems = data.listing;
                    for (var i = 0; i < fileItems.length; i++) {
                        var curItem = fileItems[i];
                        if (curItem.name == "DERT_failure.txt") {
                            callback(true);
                            return;
                        }
                    }
                    callback(false);
                    return;
                }
            });
        }
    }

    function continueDERTPaste(curContainerNo, callback) {
        var containerName = $("#txtDERTDestination").val();
        var validator = new ContainerValidator();
        validator.validate(containerName)
        var errors = validator.getErrorMessages();
        if (errors.length == 0) {
            containerName = containerName.toUpperCase();
            var loadingIndicator = $("#loadingIndicator");
            loading.init();
            loadingIndicator.dialog("option", "modal", true);
            loadingIndicator.dialog('open');
            var toFolder = containerName.substr(0, 4)
            var destPath = $(document).data("CustomDERTCopyPathSelected");
            destPath = destPath + toFolder + "/" + containerName + "/";
            var customDERTCopy = $(document).data("CustomDERTCopy");
            var dateFolder = customDERTCopy.split("/")[3];
            var parentDir = $(document).data("CustomDERTCopyParentDir");
            var obj = {
                command: "getXMLListing",
                format: "JSONOBJ",
                path: destPath,
                random: Math.random()
            };
            var loadingIndicator = $("#loadingIndicator");
            loading.init();
            loadingIndicator.dialog("option", "modal", true);
            loadingIndicator.dialog('open');
            obj.c2f = crushFTPTools.getCrushAuth();
            $.ajax({
                type: "POST",
                url: "/WebInterface/function/",
                data: obj,
                async: true,
                dataType: "json",
                beforeSend: function(x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                success: function(data) {
                  var pathExists = false;
                  if (data && data.listing)
                  {
                    var fileItems = data.listing;
                    for (var i = 0; i < fileItems.length; i++) {
                        var curItem = fileItems[i];
                        if(curItem.name == dateFolder){
                          pathExists = true;
                          i = fileItems.length;
                        }
                    }
                  }
                  if(pathExists)
                  {
                    loading.init();
                    loadingIndicator.dialog("option", "modal", false);
                    loadingIndicator.dialog('close');
                    var dertContainerFolderExists = getLocalizationKeyExternal("dertContainerFolderExists") || "Selected container already available, please select another";
                    customAlert(false, dertContainerFolderExists, function() {
                        $("#txtDERTDestination").focus();
                    });
                    return false;
                  }
                  $.unblockUI();
                  $.ajax({
                      type: "POST",
                      url: "/WebInterface/function/",
                      data: {
                          command: "makedir",
                          path: crushFTPTools.encodeURILocal(destPath),
                          random: Math.random(),
                          c2f: crushFTPTools.getCrushAuth()
                      },
                      async: true,
                      complete: function(data) {
                          var objPaste = {
                              command: "cut_paste",
                              names: crushFTPTools.encodeURILocal(customDERTCopy),
                              destPath: crushFTPTools.encodeURILocal(destPath),
                              random: Math.random(),
                              c2f: crushFTPTools.getCrushAuth()
                          };
                          $.ajax({
                              type: "POST",
                              url: "/WebInterface/function/",
                              data: objPaste,
                              async: true,
                              success: function(data) {
                                  var dertCopyTitle = getLocalizationKeyExternal("dertCopyTitle") || "Custom Copy";
                                  var dertCopySuccessDesc = getLocalizationKeyExternal("dertCopySuccessDesc") || "Item moved successfully";
                                  $.growlUI(dertCopyTitle, dertCopySuccessDesc, 3000);
                                  var paths = customDERTCopy.split("/");
                                  var folderName = paths[paths.length - 1];
                                  destPath = destPath + folderName;
                                  if (!destPath.endsWith("/"))
                                      destPath = destPath + "/";
                                  hashListener.setHash(escape(destPath));
                                  var obj = {
                                      command: "getXMLListing",
                                      format: "JSONOBJ",
                                      path: crushFTPTools.encodeURILocal(destPath),
                                      random: Math.random(),
                                      c2f: crushFTPTools.getCrushAuth()
                                  };
                                  $.ajax({
                                      type: "POST",
                                      url: "/WebInterface/function/",
                                      data: obj,
                                      async: true,
                                      dataType: "json",
                                      beforeSend: function(x) {
                                          if (x && x.overrideMimeType) {
                                              x.overrideMimeType("application/j-son;charset=UTF-8");
                                          }
                                      },
                                      success: function(data) {
                                          var txtFiles = [];
                                          var items = [];
                                          var matchingItems = [];
                                          if (data && data.listing) {
                                              var fileItems = data.listing;
                                              for (var i = 0; i < fileItems.length; i++) {
                                                  var curItem = fileItems[i];
                                                  if (curItem.name.toLowerCase().endsWith(".txt")) {
                                                      txtFiles.push(destPath + curItem.name);
                                                  } else
                                                      items.push(destPath + curItem.name);

                                                  if (curItem.name.indexOf(curContainerNo) == 0) {
                                                      matchingItems.push(curItem.name);
                                                  }
                                              }
                                          }
                                          if (matchingItems.length > 0) {
                                              function renameFiles() {
                                                  if (matchingItems.length > 0) {
                                                      var file = matchingItems.pop();
                                                      var newName = file.replace(curContainerNo, containerName);
                                                      $.ajax({
                                                          type: "POST",
                                                          url: "/WebInterface/function/",
                                                          data: {
                                                              command: "rename",
                                                              names: crushFTPTools.encodeURILocal(txtFiles.join("\r\n")),
                                                              random: Math.random(),
                                                              path: crushFTPTools.encodeURILocal(unescape(destPath)),
                                                              name1: crushFTPTools.encodeURILocal(unescape(file)),
                                                              name2: crushFTPTools.encodeURILocal(unescape(newName)),
                                                              c2f: crushFTPTools.getCrushAuth()
                                                          },
                                                          async: true,
                                                          complete: function(data) {
                                                              renameFiles();
                                                          }
                                                      });
                                                  } else {
                                                      callback(containerName, destPath, items, txtFiles);
                                                  }
                                              }
                                              renameFiles();
                                          }
                                          else
                                            callback(containerName, destPath, items, txtFiles);
                                      }
                                  });
                              },
                              error: function() {
                                loading.init();
                                  loadingIndicator.dialog("option", "modal", false);
                                  loadingIndicator.dialog('close');
                                  var dertCopyTitle = getLocalizationKeyExternal("dertCopyTitle") || "Custom Copy";
                                  var dertCopyFailedDesc = getLocalizationKeyExternal("dertCopyFailedDesc") || "Item move failed";
                                  $.growlUI(dertCopyTitle, dertCopyFailedDesc, 3000, "growlError");
                              }
                          });
                      }
                  });
              }
            });
        } else {
            var dertContainerNameInvalidFormatWarning = getLocalizationKeyExternal("dertContainerNameInvalidFormatWarning") || "Please enter container name in valid format";
            var errs = [];
            for (var err in errors) {
                if (typeof errors[err] == "string"){
                    errs.push(localizeError(errors[err]));
                }
            }
            customAlert(false, dertContainerNameInvalidFormatWarning + "\r\n" + errs.join("\r\n"), function() {
                $("#txtDERTDestination").focus();
            });
        }
    };

    function localizeError(str){
        var toMatch = [
            "The container number is invalid",
            "The check digit does not match",
            "You must call validate or isValid first",
            "Invalid owner code or product group code",
            "Invalid container number",
            "The container number must be a string"
        ];
        var toUse = localizations.containerValidationErrors;
        if(toUse){
            return toUse[toMatch.indexOf(str)];
        }
        else
            return str;
    }

    /*Used for initiating generate previes event on server*/
    function generatePreviews(){
        var destPath = unescape(hashListener.getHash().toString().replace("#", ""));
        destPath = destPath || "/";
        var obj = {
            command: "customEvent",
            random: Math.random(),
            c2f: crushFTPTools.getCrushAuth()
        };
        var loadingIndicator = $("#loadingIndicator");
        loading.init();
        loadingIndicator.dialog("option", "modal", true);
        loadingIndicator.dialog('open');
        obj.conpds_command = "GeneratePreviews";
        obj.paths = destPath;
        $.ajax({
            type: "POST",
            url: "/WebInterface/function/",
            data: obj,
            async: true,
            success: function(data) {
                loading.init();
                loadingIndicator.dialog("option", "modal", false);
                loadingIndicator.dialog('close');
                $.unblockUI();
                var previewEventInvokedText = getLocalizationKeyExternal("previewEventInvokedText") || "Generate preview event invoked.";
                   customAlert(false, previewEventInvokedText, function() {
                });
            },
            error: function() {
                loading.init();
                loadingIndicator.dialog("option", "modal", false);
                loadingIndicator.dialog('close');
            }
        });
    }

    /*
    Desc :
     - If used it will show popup with text field to specify new Container Number.
     - When user will click ok, it will move all files in source folder into new target folder and show informational popup when finish. Will also call customEvent and pass information of new Container Number as {conpds_new_container_number} and path of new location {conpds_new_path} to the event.
     - Cannot be combined with any other parameters
     */
    function moveFiles(context, eventParams) {
        var el = false;
        var ignoreFailureCheck = true;
        if (context) {
            el = currentContext();
        }
        if (!el) {
            var selectedItems = window.getSelectedItems(el);
            if (selectedItems.length > 0) {
                el = $("[href='" + selectedItems[0].name + "']").closest('tr');
            }
            if (selectedItems.length == 0 || el.length == 0) {
                if ($("body").data("currentView") == "Thumbnail")
                    el = $("#thumbsviewContainer").find("li:first");
                else
                    el = $("#thumbnailView").find("tbody tr:first");
            }
        }
        var $curElem = $(el);
        if ($curElem.is("td"))
            $curElem = $curElem.closest('tr');
        var error = "";
        var path = $curElem.find("a:first").attr("rel");
        $(document).removeData("CustomDERTCopy");
        var data = $curElem.data("dataRow");
        var rootDir = $curElem.is("tr") ? $curElem.attr("rootdir") : $curElem.attr("root_dir");
        rootDir = rootDir || "/";
        rootDir = unescape(rootDir);
        var folderName = data.name;
        var fromFile = false;
        var curContainerNo;
        if ($curElem.hasClass("fileItemTR") || $curElem.hasClass("fileTR") || $curElem.hasClass("fileThumb")) {
            path = $curElem.is("tr") ? $curElem.attr("rootdir") : $curElem.attr("root_dir");
            fromFile = true;
            if (path.endsWith("/"))
                path = path.substring(0, path.length - 1);
            rootDir = path.substring(0, path.lastIndexOf("/") + 1);
            rootDir = rootDir || "/";
            rootDir = unescape(rootDir);
            curContainerNo = rootDir.split("/")[2];
            folderName = path.substring(path.lastIndexOf("/") + 1, path.length);
        }
        validateFolder(folderName, path, function(flag) {
            if (!flag) {
                var dertCopyTitle = getLocalizationKeyExternal("dertCopyTitle") || "Move Files";
                var dertInvalidFolderError = getLocalizationKeyExternal("dertInvalidFolderError") || "{1} is not a valid folder.";
                $.growlUI(dertCopyTitle, dertInvalidFolderError.replace("{1}", crushFTPTools.htmlEncode(folderName, false, true)), 3000, "growlError");
            } else {
                var destPath = unescape(hashListener.getHash().toString().replace("#", "")).split("/");
                if (destPath.length > 2) {
                    if (fromFile)
                        destPath = destPath.slice(0, destPath.length - 4);
                    else
                        destPath = destPath.slice(0, destPath.length - 3);
                    destPath = destPath.join("/") + "/";
                } else
                    destPath = "/";
                destPath = destPath || "/";
                $(document).data("CustomDERTCopy", path);
                $(document).data("CustomDERTCopyParentDir", rootDir);
                $(document).data("CustomDERTCopyPathSelected", destPath);
                $("#txtDERTDestination").val("");
                performAction('moveDERTFilesPopup');
                if ($("#moveDERTFilesPopup").length == 0) {
                    var dertContainerPopupTitle = getLocalizationKeyExternal("dertContainerPopupTitle") || "Destination";
                    var buttonSubmitDertPopupMove = getLocalizationKeyExternal("buttonSubmitDertPopupMove") || "Move";
                    var dertContainerPopupDesc = getLocalizationKeyExternal("dertContainerPopupDesc") || "<br />(Enter Container Number : AAAANNNNNNN)<br />";

                    $("body").append('<div style="display:none;" id="moveDERTFilesPopup"><img class="closeButton" alt="close" src="/WebInterface/Resources/customImages/cancel.png" onclick="$.unblockUI();"><h2 class="popupHeader" id="dertContainerPopupTitle">' + dertContainerPopupTitle + '</h2><div class="buttonPanel"><div style="width:100%;"><input id="txtDERTDestination" placeholder="AAAANNNNNNN" type="text" style="width:99%;text-transform:uppercase;" /><div id="dertContainerPopupDesc" class="conPDSPopupText">' + dertContainerPopupDesc + '</div></div><div style="text-align: right; margin-top: 10px;"><button style="padding:8px 20px;" class="btn submit-btn buttonYes MoveItems buttonSubmitDertPopupMove" id="buttonSubmitDertPopupMove">' + buttonSubmitDertPopupMove + '</button> </div></div></div>');
                }
                var popup = $("#moveDERTFilesPopup");
                var buttonSubmitDertPopupMove = $("#buttonSubmitDertPopupMove").unbind().click(function(event) {
                    continueDERTPaste(curContainerNo, function(containerNumber, path) {
                        var obj = {
                            command: "customEvent",
                            random: Math.random(),
                            c2f: crushFTPTools.getCrushAuth()
                        };
                        var loadingIndicator = $("#loadingIndicator");
                        loading.init();
                        loadingIndicator.dialog("option", "modal", true);
                        loadingIndicator.dialog('open');
                        obj.conpds_command = "MoveFiles";
                        obj.conpds_new_container_number = containerNumber;
                        eventParams = eventParams || "";
                        obj.conpds_customEventParam = crushFTPTools.encodeURILocal(eventParams);
                        obj.conpds_new_path = crushFTPTools.encodeURILocal(path);
                        obj.paths = crushFTPTools.encodeURILocal(path);
                        $.ajax({
                            type: "POST",
                            url: "/WebInterface/function/",
                            data: obj,
                            async: true,
                            success: function(data) {
                                loading.init();
                                loadingIndicator.dialog("option", "modal", false);
                                loadingIndicator.dialog('close');
                                $.unblockUI();
                            },
                            error: function() {
                                loading.init();
                                loadingIndicator.dialog("option", "modal", false);
                                loadingIndicator.dialog('close');
                            }
                        });
                        $(".refreshButton:first").click();
                    });
                    return false;
                });
                var closeButton = $(".closeButton", "#moveDERTFilesPopup").click(function(event) {
                    $.unblockUI();
                    $(document).removeData("CustomDERTCopyPathSelected");
                    return false;
                });
                $("#txtDERTDestination").keyup(function(evt) {
                    var evt = (evt) ? evt : ((event) ? event : null);
                    if (evt.keyCode == 13) {
                        buttonSubmitDertPopupMove.click();
                        return false;
                    } else if (evt.keyCode == 27) {
                        closeButton.click();
                        return false;
                    }
                });
                $("#txtDERTDestination").maskInput("AAAA9999999");
                popup.find("input[type!='button'], textarea").val("");
                showPopup('moveDERTFilesPopup');
            }
        }, ignoreFailureCheck);
    };

    /*
    Desc :
    - If used it will show popup with image preview of files inside Date Folder.
    - If exif information is available in photo exif info and link to Google Map is presented in buttom of image preview popup.
    - Cannot be combined with any other parameters
    */
    function photoPreview(context) {
        isContainerImagePreview = true;
        window.quickView(true);
    };

    /*
    Desc :
    - If used it will show popup records of shared photos. Cannot be combined with any other parameters
    */
    function emailOverview(context) {
        var loadingIndicator = $("#loadingIndicator");
        loading.init();
        loadingIndicator.dialog("option", "modal", true);
        loadingIndicator.dialog('open');
        var path = crushFTPTools.encodeURILocal("/CONPDS/"+$(document).data("username")+"_photodist.log");
        if($.browser.msie && $.browser.version <= 12)
            path = crushFTPTools.encodeURILocal(unescape("/CONPDS/"+$(document).data("username")+"_photodist.log"));
        var obj = {
            command: "download",
            mimeType : "text-plain",
            path: path,
            random: Math.random(),
            c2f: crushFTPTools.getCrushAuth()
        };
        $.ajax({
            type: "GET",
            url: "/WebInterface/function/",
            data: obj,
            async: true,
            success: function(data) {
                loading.init();
                loadingIndicator.dialog("option", "modal", false);
                loadingIndicator.dialog('close');
                var records = data.split("\n");
                if ($("#conPDSEmailOverview").length == 0) {
                    var conPDSEmailOverviewTitle = getLocalizationKeyExternal("conPDSEmailOverviewTitle") || "Email Overview";
                    $("body").append('<div id="conPDSEmailOverview" style="display:none;"><img class="closeButton" alt="close" src="/WebInterface/Resources/customImages/cancel.png" onclick="$.unblockUI();"/><h2 id="conPDSEmailOverviewTitle" class="popupHeader">' + conPDSEmailOverviewTitle + '</h2><div class="grid" style="margin:10px;"></div></div>');
                }
                var grid = $("#conPDSEmailOverview").find(".grid").empty();

                var date = getLocalizationKeyExternal("conPDSEmailOverviewDateTitle") || "Date";
                var time = getLocalizationKeyExternal("conPDSEmailOverviewTimeTitle") || "Time";
                var cname = getLocalizationKeyExternal("conPDSEmailOverviewContainerNameTitle") || "Container Name";
                var pdate = getLocalizationKeyExternal("conPDSEmailOverviewPhotoDateTitle") || "Photo Date";
                var recipients = getLocalizationKeyExternal("conPDSEmailOverviewRecipientsTitle") || "Recipients";
                var noOfPics = getLocalizationKeyExternal("conPDSEmailOverviewNoOfPhotosTitle") || "No. Photo";
                var shareType = getLocalizationKeyExternal("conPDSEmailOverviewShareTypeTitle") || "Share Type";
                var srch = getLocalizationKeyExternal("conPDSEmailOverviewSearchText") || "Search";

                grid.append('<table data-order=\'[[0, "desc"]]\' class="display" cellspacing="0" width="100%"><thead><tr><th style="width:100px;" data-order="desc" data-column-id="date" data-type="date">' + date + '</th><th data-column-id="time" data-type="time">' + time + '</th><th data-column-id="containerName">' + cname + '</th><th data-column-id="photo_date">' + pdate + '</th><th data-column-id="recipients">' + recipients + '</th><th data-column-id="total_photos">' + noOfPics + '</th><th data-column-id="type">' + shareType + '</th></tr></thead><tbody></tbody><tfoot><tr><th class="filter" data-order="desc" data-column-id="date" data-type="date">' + date + '</th><th data-column-id="time" data-type="time">' + time + '</th><th class="filter" data-column-id="containerName">' + cname + '</th><th data-column-id="photo_date">' + pdate + '</th><th class="filter" data-column-id="recipients">' + recipients + '</th><th data-column-id="total_photos">' + noOfPics + '</th><th data-column-id="type">' + shareType + '</th></tr></tfoot></table>');
                var tbl = grid.find("table").find("tbody");
                for (var i = 0; i < records.length; i++) {
                    var curRec = records[i].split(";");
                    if(curRec.length>1)
                    {
                        var times = curRec[0].split(" ")[1].split(":")
                        var data = {
                            date: new Date(curRec[0].split(" ")[0]),
                            time: new Date(curRec[0].split(" ")[0]),
                            command: curRec[1],
                            type: curRec[2],
                            recipients: curRec[3],
                            subject: curRec[4],
                            containerName: curRec[5],
                            photo_date: curRec[6],
                            total_photos: curRec[7],
                            items: curRec[8]
                        };
                        var hourFormat = localizations.currentLanguageName == "English" ? "hh:nn:ss aa" : "HH:MM:ss";
                        data.time.setHours(times[0],times[1],times[2]);
                        if (data.type) {
                            tbl.append('<tr><td>' + data.date.format("yyyy-mm-dd") + '</td><td>' + data.time.format(hourFormat) + '</td><td>' + data.containerName + '</td><td>' + data.photo_date + '</td><td><span class="restrict-width" style="width:250px">' + data.recipients + '</span></td><td>' + data.total_photos + '</td><td>' + data.type + '</td></tr>');
                        }
                    }
                }
                tbl.parent().find('tfoot th').each(function() {
                    if ($(this).hasClass("filter")) {
                        var title = tbl.parent().find('tfoot th').eq($(this).index()).text();
                        $(this).html('<label class="dataTables_filter"><input type="search" placeholder="' + srch + ' ' + title + '" /></label>');
                    } else {
                        $(this).html("-");
                    }
                });
                var dataTableLang = localizations.dataTableLoc || {
                    "sEmptyTable": "No data available in table",
                    "sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
                    "sInfoEmpty": "Showing 0 to 0 of 0 entries",
                    "sInfoFiltered": "(filtered from _MAX_ total entries)",
                    "sInfoPostFix": "",
                    "sInfoThousands": ",",
                    "sLengthMenu": "Show _MENU_ entries",
                    "sLoadingRecords": "Loading...",
                    "sProcessing": "Processing...",
                    "sSearch": "Search:",
                    "sZeroRecords": "No matching records found",
                    "oPaginate": {
                        "sFirst": "First",
                        "sLast": "Last",
                        "sNext": "Next",
                        "sPrevious": "Previous"
                    },
                    "oAria": {
                        "sSortAscending": ": activate to sort column ascending",
                        "sSortDescending": ": activate to sort column descending"
                    }
                };
                var table = tbl.parent().DataTable({
                    "paging": true,
                    "ordering": true,
                    language: dataTableLang,
                    columnDefs: [ {
                        targets: [ 0 ],
                        orderData: [ 0, 1 ]
                    }]
                });
                table.columns().every(function() {
                    var that = this;
                    $('input', this.footer()).on('keyup change textchange click', function() {
                        if (that.search() !== this.value) {
                            that.search(this.value).draw();
                        }
                    });
                });
                showPopup('conPDSEmailOverview', {
                    width: "1100px",
                    "margin-left": "-550px"
                });
            },
            error: function() {
                loading.init();
                loadingIndicator.dialog("option", "modal", false);
                loadingIndicator.dialog('close');
            }
        });
    }

    /*
    Desc :
    - If used it will show popup with image preview of files inside Date Folder.
    - If exif information is available in photo exif info and link to Google Map is presented in buttom of image preview popup.
    - Cannot be combined with any other parameters
    */
    function photoPreview(context) {
        isContainerImagePreview = true;
        window.quickView(true);
    };

    /*
    Desc :
    - If used it will show popup records of shared photos by all users. Cannot be combined with any other parameters
    */
    function consolidatedEmailOverview(context) {
        var loadingIndicator = $("#loadingIndicator");
        loading.init();
        loadingIndicator.dialog("option", "modal", true);
        loadingIndicator.dialog('open');
        function getAllShareData(callback){
            var items = [];
            var obj = {
                command: "getXMLListing",
                format: "JSONOBJ",
                path: crushFTPTools.encodeURILocal("/CONPDS/"),
                random: Math.random(),
                c2f: crushFTPTools.getCrushAuth()
            };
            $.ajax({
                type: "GET",
                url: "/WebInterface/function/",
                data: obj,
                async: true,
                success: function(data) {
                    var filesToFetch = [];
                    var files = data.listing;
                    var toMatch = "_photodist.json";
                    files.forEach(function(file){
                        if(file.name.toLowerCase().indexOf(toMatch)>=0)
                            filesToFetch.push(file.name);
                    });
                    var currentFileIndex = 0;
                    var fetched = 0;
                    function getFileContent(){
                        if(filesToFetch.length>currentFileIndex)
                        {
                            var fileName = filesToFetch[currentFileIndex];
                            var userName = fileName.replace("_photodist.json","");
                            var path = crushFTPTools.encodeURILocal("/CONPDS/"+fileName);
                            if($.browser.msie && $.browser.version <= 12)
                                path = crushFTPTools.encodeURILocal(unescape("/CONPDS/"+fileName));
                            var obj = {
                                command: "download",
                                mimeType : "json",
                                path: path,
                                random: Math.random(),
                                c2f: crushFTPTools.getCrushAuth()
                            };
                            $.ajax({
                                type: "GET",
                                url: "/WebInterface/function/",
                                data: obj,
                                async: true,
                                success: function(data) {
                                    data.forEach(function(item){
                                        item.splice(0,0,userName);
                                    });
                                    items =items.concat(data);
                                    fetched++;
                                    if(fetched === filesToFetch.length){
                                        callback(items);
                                    }
                                },
                                error: function(){
                                    fetched++;
                                    if(fetched === filesToFetch.length){
                                        callback(items);
                                    }
                                }
                            });
                            currentFileIndex++;
                            getFileContent();
                        }
                    }
                    getFileContent();
                }
            });
        }

        getAllShareData(function(records){
            loading.init();
            loadingIndicator.dialog("option", "modal", false);
            loadingIndicator.dialog('close');
            // var records = data.split("\n");
            if ($("#conPDSEmailOverview").length == 0) {
                var conPDSEmailOverviewTitle = getLocalizationKeyExternal("conPDSEmailOverviewTitle") || "Email Overview";
                $("body").append('<div id="conPDSEmailOverview" style="display:none;"><img class="closeButton" alt="close" src="/WebInterface/Resources/customImages/cancel.png" onclick="$.unblockUI();"/><h2 id="conPDSEmailOverviewTitle" class="popupHeader">' + conPDSEmailOverviewTitle + '</h2><div class="grid" style="margin:10px;"></div></div>');
            }

            var grid = $("#conPDSEmailOverview").find(".grid").empty();
            var date = getLocalizationKeyExternal("conPDSEmailOverviewDateTitle") || "Date";
            var userName = getLocalizationKeyExternal("conPDSEmailOverviewUserTitle") || "User";
            var time = getLocalizationKeyExternal("conPDSEmailOverviewTimeTitle") || "Time";
            var cname = getLocalizationKeyExternal("conPDSEmailOverviewContainerNameTitle") || "Container Name";
            var pdate = getLocalizationKeyExternal("conPDSEmailOverviewPhotoDateTitle") || "Photo Date";
            var recipients = getLocalizationKeyExternal("conPDSEmailOverviewRecipientsTitle") || "Recipients";
            var noOfPics = getLocalizationKeyExternal("conPDSEmailOverviewNoOfPhotosTitle") || "No. Photo";
            var shareType = getLocalizationKeyExternal("conPDSEmailOverviewShareTypeTitle") || "Share Type";
            var srch = getLocalizationKeyExternal("conPDSEmailOverviewSearchText") || "Search";

            grid.append('<table data-order=\'[[0, "desc"]]\' class="display" cellspacing="0" width="100%"><thead><tr><th style="width:100px;" data-order="desc" data-column-id="userName" data-type="string">' + userName + '</th><th style="width:100px;" data-order="desc" data-column-id="date" data-type="date">' + date + '</th><th data-column-id="time" data-type="time">' + time + '</th><th data-column-id="containerName">' + cname + '</th><th data-column-id="photo_date">' + pdate + '</th><th data-column-id="recipients">' + recipients + '</th><th data-column-id="total_photos">' + noOfPics + '</th><th data-column-id="type">' + shareType + '</th></tr></thead><tbody></tbody><tfoot><tr><th class="filter" data-order="desc" data-column-id="userName" data-type="string">' + userName + '</th><th class="filter" data-order="desc" data-column-id="date" data-type="date">' + date + '</th><th data-column-id="time" data-type="time">' + time + '</th><th class="filter" data-column-id="containerName">' + cname + '</th><th data-column-id="photo_date">' + pdate + '</th><th class="filter" data-column-id="recipients">' + recipients + '</th><th data-column-id="total_photos">' + noOfPics + '</th><th data-column-id="type">' + shareType + '</th></tr></tfoot></table>');
            var tbl = grid.find("table").find("tbody");
            for (var i = 0; i < records.length; i++) {
                var curRec = records[i];//.split(";");
                if(curRec.length>1)
                {
                    var times = curRec[1].split(" ")[1].split(":")
                    var data = {
                        userName: curRec[0],
                        date: new Date(curRec[1].split(" ")[0]),
                        time: new Date(curRec[1].split(" ")[0]),
                        command: curRec[2],
                        type: curRec[3],
                        recipients: curRec[4],
                        subject: curRec[5],
                        containerName: curRec[6],
                        photo_date: curRec[7],
                        total_photos: curRec[8],
                        items: curRec[9]
                    };
                    var hourFormat = localizations.currentLanguageName == "English" ? "hh:nn:ss aa" : "HH:MM:ss";
                    data.time.setHours(times[0],times[1],times[2]);
                    if (data.type) {
                        tbl.append('<tr><td>'+data.userName+'</td><td>' + data.date.format("yyyy-mm-dd") + '</td><td>' + data.time.format(hourFormat) + '</td><td>' + data.containerName + '</td><td>' + data.photo_date + '</td><td><span class="restrict-width" style="width:250px">' + data.recipients + '</span></td><td>' + data.total_photos + '</td><td>' + data.type + '</td></tr>');
                    }
                }
            }
            tbl.parent().find('tfoot th').each(function() {
                if ($(this).hasClass("filter")) {
                    var title = tbl.parent().find('tfoot th').eq($(this).index()).text();
                    $(this).html('<label class="dataTables_filter"><input type="search" placeholder="' + srch + ' ' + title + '" /></label>');
                } else {
                    $(this).html("-");
                }
            });
            var dataTableLang = localizations.dataTableLoc || {
                "sEmptyTable": "No data available in table",
                "sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
                "sInfoEmpty": "Showing 0 to 0 of 0 entries",
                "sInfoFiltered": "(filtered from _MAX_ total entries)",
                "sInfoPostFix": "",
                "sInfoThousands": ",",
                "sLengthMenu": "Show _MENU_ entries",
                "sLoadingRecords": "Loading...",
                "sProcessing": "Processing...",
                "sSearch": "Search:",
                "sZeroRecords": "No matching records found",
                "oPaginate": {
                    "sFirst": "First",
                    "sLast": "Last",
                    "sNext": "Next",
                    "sPrevious": "Previous"
                },
                "oAria": {
                    "sSortAscending": ": activate to sort column ascending",
                    "sSortDescending": ": activate to sort column descending"
                }
            };
            var table = tbl.parent().DataTable({
                "paging": true,
                "ordering": true,
                language: dataTableLang,
                columnDefs: [ {
                    targets: [ 0 ],
                    orderData: [ 0, 1 ]
                }]
            });
            table.columns().every(function() {
                var that = this;
                $('input', this.footer()).on('keyup change textchange click', function() {
                    if (that.search() !== this.value) {
                        that.search(this.value).draw();
                    }
                });
            });
            showPopup('conPDSEmailOverview', {
                width: "1200px",
                "margin-left": "-600px"
            });
        });
    }

    /*
    Desc :
     - If used it will show popup with text area.
     - When user will click ok, it will call customEvent and pass information of selected items and content of the text area as {conpds_email_body} to the event.
     - Cannot be combined with any other parameters
     */
    function sendToEmailDirect(context, eventParams) {
        getSelectionDetails(context, function(data) {
            if ($("#sendToEmailDirectPopup").length == 0) {
                var dertSharePopupTitle = getLocalizationKeyExternal("sendEmailDirectPopupTitleText") || " Remarks til Mercplus";
                var buttonSubmitDertPopupOK = getLocalizationKeyExternal("buttonSubmitPopupOKText") || "OK";
                var dertSharePopupDesc = getLocalizationKeyExternal("sendEmailDirectPopupDescText") || "<p>Kommentarer i teksboksen herunder bliver automatisk overført som remarks i Mercplus</br>(dog max. 1000 karakterer)</br>Har du ingen kommentarer klikker du blot OK. </p>Du modtager selv en kopi af mailen til DERT og der kommer svar direkte til din mailboks</br>om billederne er blevet afleveret succesfuldt.";
                var customEmailBodyTitle = getLocalizationKeyExternal("dertCustomEmailBodyLabel") || "Email Body : ";
                var customizations = $(document).data("customizations") || [];
                var defaultSubject = "";
                var defaultEmail = "";
                var defaultEmailAttach = "";
                for (var i = 0; i < customizations.length; i++) {
                    if (customizations[i].key == "EMAILBODY")
                        defaultEmail = customizations[i].value;
                }
                defaultEmailAttach = defaultEmail + "";
                defaultEmail = defaultEmail.replace(/\\r/g, '\r');
                defaultEmail = defaultEmail.replace(/\\n/g, '\n');
                var emailVal = crushFTPTools.decodeXML(defaultEmail);

                var containerID = "";
                var date = "";
                var path = "";
                try {
                    var hash = hashListener.getHash().split("/");
                    containerID = hash[2];
                    date = hash[3];
                    path = "/" + hash.splice(1).join("/");
                } catch (ex) {}
                $("body").append('<div id="sendToEmailDirectPopup" style="display:none;"> <img class="closeButton" alt="close" src="/WebInterface/Resources/customImages/cancel.png" onclick="$.unblockUI();selectDeselectAllItems(false);"/> <h2 id="sendEmailPopupTitleText" class="popupHeader">' + dertSharePopupTitle + '</h2><div id="sendEmailPopupDescText" class="conPDSPopupText">' + dertSharePopupDesc + '</div><hr style="border-bottom: 1px solid #eee;border-top: 0px;margin-top: 10px;"><div class="buttonPanel"><div class="showEmailPrompt"><div style="width:100%;margin-bottom:10px;"> <div style="width:100%;margin-bottom:5px;"></div> <div style="width:100%;margin-bottom:5px;"><strong id="customEmailBodyTitle">' + customEmailBodyTitle + '</strong></div> <div style="width:100%;"> <textarea id="sendEmailPopupEmailBody" style="width:99%;height:150px;border-color:#D0C7C7;" maxlength="1000"></textarea> </div></div> <br /> <br /> <div style="text-align: right; margin-top: 10px;"> <button style="padding:8px 20px;" class="btn submit-btn buttonYes buttonSubmitPopupOKText">' + buttonSubmitDertPopupOK + '</button>  </div> </div> </div> ');
            }
            $("#sendEmailPopupCompletePopup").remove();
            if ($("#sendEmailPopupCompletePopup").length == 0) {
                var dertShareInfoPopupTitle = getLocalizationKeyExternal("conPDSSentPhotosPopupTitle") || "PHOTOS SENT TO EMAIL";
                var buttonSubmitDertPopupOK = getLocalizationKeyExternal("buttonSubmitPopupOKText") || "OK";
                var dertShareInfoPopupDesc = getLocalizationKeyExternal("conPDSSentPhotosPopupDesc") || "Photos sent via email";
                $("body").append('<div id="sendEmailPopupCompletePopup" style="display:none;font-size:14px;"> <img class="closeButton" alt="close" src="/WebInterface/Resources/customImages/cancel.png" onclick="$.unblockUI();"/> <h2 class="popupHeader" id="dertShareInfoPopupTitle">' + dertShareInfoPopupTitle + '</h2><div id="dertShareInfoPopupDesc" class="conPDSPopupText" style="margin-top:30px;margin-bottom:-25px;">' + dertShareInfoPopupDesc + '</div><div class="buttonPanel"> <br /> <br /> <div style="text-align: right; margin-top: 10px;"><button onclick="$.unblockUI();" style="padding:8px 20px;" class="btn submit-btn buttonYes buttonSubmitPopupOKText">' + buttonSubmitDertPopupOK + '</button> </div> </div> </div> ');
            }
            var popup = $("#sendToEmailDirectPopup");
            popup.find("input[type!='button'], textarea").val("");
            popup.find(".submit-btn").unbind().bind("click", function() {
                var paths = data.fileName.split("\r\n");
                var itms = [];
                for (var i = 0; i < paths.length; i++) {
                    itms.push(paths[i]);
                }
                var obj = {
                    command: "customEvent",
                    paths: escape(itms.join(";")),
                    random: Math.random(),
                    c2f: crushFTPTools.getCrushAuth()
                };
                var loadingIndicator = $("#loadingIndicator");
                loading.init();
                loadingIndicator.dialog("option", "modal", true);
                loadingIndicator.dialog('open');
                obj.conpds_command = crushFTPTools.encodeURILocal("SendToEmailDirect");
                obj.conpds_email_body = crushFTPTools.encodeURILocal($("#sendEmailPopupEmailBody").val());
                eventParams = eventParams || "";
                obj.conpds_customEventParam = crushFTPTools.encodeURILocal(eventParams);
                $.ajax({
                    type: "POST",
                    url: "/WebInterface/function/",
                    data: obj,
                    async: true,
                    success: function(data) {
                        loading.init();
                        loadingIndicator.dialog("option", "modal", false);
                        loadingIndicator.dialog('close');
                        showPopup('sendEmailPopupCompletePopup', {
                            width: '600px',
                            'margin-left': '-300px'
                        });
                        selectDeselectAllItems(false);
                        checkLog();
                    },
                    error: function() {
                        loading.init();
                        loadingIndicator.dialog("option", "modal", false);
                        loadingIndicator.dialog('close');
                    }
                });
            });
            showPopup('sendToEmailDirectPopup', {
                width: "700px",
                "margin-left": "-350px"
            });
        });
    };

    window.customFileActionCallback_print = function(context, itemsInSelection, fileName, multipleFiles, fileNameOnly, item) {
        var mywindow = window.open('/WebInterface/jQuery/mosaicPrint.html', 'mosaicPrint', 'height=600,width=800,resizable=no,titlebar=no');
        window.selectedItems = itemsInSelection;
        var printFunction = function() {
            mywindow.print();
        }
        printFunction();
        return true;
    }

    function printItemsProxy() {
        customFileActionProxy('print');
    }

    return {
        init: init,
        printItems: printItemsProxy,
        action: action,
        sendToDERT: sendToDERT,
        sendToEmail: sendEmail,
        sendToEmailDirect: sendToEmailDirect,
        moveFiles: moveFiles,
        generatePreviews : generatePreviews,
        photoPreview: photoPreview,
        emailOverview: emailOverview,
        consolidatedEmailOverview: consolidatedEmailOverview
    }
})();

$(document).ready(function() {
    window.ConPDS.init();
    setTimeout(function(){
        $("#userOptions").find("ul:first").find("li:first").remove();
        $("#userOptions").find("#preferences").remove();
    }, 1000);
});
function ContainerValidator(){var t="STR_PAD_LEFT";this.alphabetNumerical={A:10,B:12,C:13,D:14,E:15,F:16,G:17,H:18,I:19,J:20,K:21,L:23,M:24,N:25,O:26,P:27,Q:28,R:29,S:30,T:31,U:32,V:34,W:35,X:36,Y:37,Z:38},this.pattern=/^([A-Z]{3})(U|J|Z)(\d{6})(\d)$/,this.patternWithoutCheckDigit=/^([A-Z]{3})(U|J|Z)(\d{6})$/,this.errorMessages=[],this.ownerCode=[],this.productGroupCode,this.registrationDigit=[],this.checkDigit,this.containerNumber,this.isValid=function(t){return valid=this.validate(t),this.empty(this.errorMessages)?!0:!1},this.validate=function(t){return matches=[],!this.empty(t)&&this.is_string(t)?(matches=this.identify(t),5!==this.count(matches)?this.errorMessages.push("The container number is invalid"):(checkDigit=this.buildCheckDigit(matches),this.checkDigit!=checkDigit&&(this.errorMessages.push("The check digit does not match"),matches=[]))):this.errorMessages={0:"The container number must be a string"},matches},this.getErrorMessages=function(){return this.errorMessages},this.getOwnerCode=function(){return this.empty(this.ownerCode)&&this.errorMessages.push("You must call validate or isValid first"),this.ownerCode},this.getProductGroupCode=function(){return this.empty(this.productGroupCode)&&this.errorMessages.push("You must call validate or isValid first"),this.productGroupCode},this.getRegistrationDigit=function(){return this.empty(this.registrationDigit)&&this.errorMessages.push("You must call validate or isValid first"),this.registrationDigit},this.getCheckDigit=function(){return this.empty(this.checkDigit)&&this.errorMessages.push("You must call validate or isValid first"),this.checkDigit},this.generate=function(e,n,a,r){if(a="undefined"!=typeof a?a:0,r="undefined"!=typeof r?r:999999,alphabetCode=this.strtoupper(e+n),containers_no=[],this.is_string(alphabetCode)&&3===this.strlen(e)&&1===this.strlen(n))if(containers_no=[],current_container_no="",current_container_check_digit="",a>=0&&1e6>r&&r-a>0)for(var i=a;r>=i;i++){if(current_container_no=alphabetCode+this.str_pad(i,6,"0",t),current_container_check_digit=this.createCheckDigit(current_container_no),current_container_check_digit<0)return this.errorMessages.push("Error generating container number at number "+i),containers_no;containers_no[i]=current_container_no+current_container_check_digit}else this.errorMessages.push("Invalid number to generate, minimal is 0 and maximal is 999999");else this.errorMessages.push("Invalid owner code or product group code");return containers_no},this.createCheckDigit=function(t){return checkDigit=-1,!this.empty(t)&&this.is_string(t)?(matches=this.identify(t,!0),4!==this.count(matches)||matches[4]?this.errorMessages.push("Invalid container number"):(checkDigit=this.buildCheckDigit(matches),checkDigit<0&&this.errorMessages.push("Invalid container number"))):this.errorMessages.push("Container number must be a string"),checkDigit},this.clearErrors=function(){this.errorMessages=[]},this.buildCheckDigit=function(t){t[1]&&(this.ownerCode=this.str_split(t[1])),t[2]&&(this.productGroupCode=t[2]),t[3]&&(this.registrationDigit=this.str_split(t[3])),t[4]&&(this.checkDigit=t[4]),numericalOwnerCode=[];for(var e=0;e<this.count(this.ownerCode);e++)numericalOwnerCode[e]=this.alphabetNumerical[this.ownerCode[e]];numericalOwnerCode.push(this.alphabetNumerical[this.productGroupCode]),numericalCode=this.array_merge(numericalOwnerCode,this.registrationDigit),sumDigit=0;for(var e=0;e<this.count(numericalCode);e++)sumDigit+=numericalCode[e]*Math.pow(2,e);return sumDigitDiff=11*Math.floor(sumDigit/11),checkDigit=sumDigit-sumDigitDiff,10==checkDigit?0:checkDigit},this.identify=function(t,e){return e="undefined"!=typeof e?e:!1,this.clearErrors(),matches=e?this.preg_match(this.patternWithoutCheckDigit,this.strtoupper(t)):this.preg_match(this.pattern,this.strtoupper(t)),matches},this.is_string=function(t){return"string"==typeof t?!0:!1},this.preg_match=function(t,e){var n=new RegExp(t);return n.exec(e)},this.strtoupper=function(t){return t.toUpperCase()},this.count=function(t){return null==t?0:t.length},this.strlen=function(t){return t.length},this.str_split=function(t,e){if(null==e&&(e=1),null==t||1>e)return!1;t+="";for(var n=[],a=0,r=t.length;r>a;)n.push(t.slice(a,a+=e));return n},this.str_pad=function(t,e,n,a){var r,i="",o=function(t,e){for(var n="";n.length<e;)n+=t;return n=n.substr(0,e)};return t+="",n=void 0!==n?n:" ","STR_PAD_LEFT"!==a&&"STR_PAD_RIGHT"!==a&&"STR_PAD_BOTH"!==a&&(a="STR_PAD_RIGHT"),(r=e-t.length)>0&&("STR_PAD_LEFT"===a?t=o(n,r)+t:"STR_PAD_RIGHT"===a?t+=o(n,r):"STR_PAD_BOTH"===a&&(i=o(n,Math.ceil(r/2)),t=i+t+i,t=t.substr(0,e))),t},this.array_merge=function(){var t,e=Array.prototype.slice.call(arguments),n=e.length,a={},r="",i=0,o=0,s=0,l=0,u=Object.prototype.toString,c=!0;for(s=0;n>s;s++)if("[object Array]"!==u.call(e[s])){c=!1;break}if(c){for(c=[],s=0;n>s;s++)c=c.concat(e[s]);return c}for(s=0,l=0;n>s;s++)if(t=e[s],"[object Array]"===u.call(t))for(o=0,i=t.length;i>o;o++)a[l++]=t[o];else for(r in t)t.hasOwnProperty(r)&&(parseInt(r,10)+""===r?a[l++]=t[r]:a[r]=t[r]);return a},this.empty=function(t){var e,n,a,r,i=[e,null,!1,0,"","0"];for(a=0,r=i.length;r>a;a++)if(t===i[a])return!0;if("object"==typeof t){for(n in t)return!1;return!0}return!1}}!function(t){var e=new Array,n=new Array;t.fn.doAutosize=function(e){var n=t(this).data("minwidth"),a=t(this).data("maxwidth"),r="",i=t(this),o=t("#"+t(this).data("tester_id"));if(r!==(r=i.val())){var s=r.replace(/&/g,"&").replace(/\s/g," ").replace(/</g,"<").replace(/>/g,">");o.html(s);var l=o.width(),u=l+e.comfortZone>=n?l+e.comfortZone:n,c=i.width(),d=c>u&&u>=n||u>n&&a>u;d&&i.width(u)}},t.fn.resetAutosize=function(e){var n=t(this).data("minwidth")||e.minInputWidth||t(this).width(),a=t(this).data("maxwidth")||e.maxInputWidth||t(this).closest(".tagsinput").width()-e.inputPadding,r=t(this),i=t("<tester/>").css({position:"absolute",top:-9999,left:-9999,width:"auto",fontSize:r.css("fontSize"),fontFamily:r.css("fontFamily"),fontWeight:r.css("fontWeight"),letterSpacing:r.css("letterSpacing"),whiteSpace:"nowrap"}),o=t(this).attr("id")+"_autosize_tester";!t("#"+o).length>0&&(i.attr("id",o),i.appendTo("body")),r.data("minwidth",n),r.data("maxwidth",a),r.data("tester_id",o),r.css("width",n)},t.fn.addTag=function(a,r){return r=jQuery.extend({focus:!1,callback:!0},r),this.each(function(){var i=t(this).attr("id"),o=t(this).val().split(e[i]);if(""==o[0]&&(o=new Array),a=jQuery.trim(a),r.unique){var s=t(this).tagExist(a);1==s&&t("#"+i+"_tag").addClass("not_valid")}else var s=!1;if(""!=a&&1!=s){if(t("<span>").addClass("tag").append(t("<span>").text(a).append("&nbsp;&nbsp;"),t("<a>",{href:"#",title:"Removing tag",text:"x"}).click(function(){return t("#"+i).removeTag(escape(a))})).insertBefore("#"+i+"_addTag"),o.push(a),t("#"+i+"_tag").val(""),r.focus?t("#"+i+"_tag").focus():t("#"+i+"_tag").blur(),t.fn.tagsInput.updateTagsField(this,o),r.callback&&n[i]&&n[i].onAddTag){var l=n[i].onAddTag;l.call(this,a)}if(n[i]&&n[i].onChange){var u=o.length,l=n[i].onChange;l.call(this,t(this),o[u-1])}}}),!1},t.fn.removeTag=function(a){return a=unescape(a),this.each(function(){var r=t(this).attr("id"),o=t(this).val().split(e[r]);for(t("#"+r+"_tagsinput .tag").remove(),str="",i=0;i<o.length;i++)o[i]!=a&&(str=str+e[r]+o[i]);if(t.fn.tagsInput.importTags(this,str),n[r]&&n[r].onRemoveTag){var s=n[r].onRemoveTag;s.call(this,a)}}),!1},t.fn.tagExist=function(n){var a=t(this).attr("id"),r=t(this).val().split(e[a]);return jQuery.inArray(n,r)>=0},t.fn.importTags=function(e){id=t(this).attr("id"),t("#"+id+"_tagsinput .tag").remove(),t.fn.tagsInput.importTags(this,e)},t.fn.tagsInput=function(r){var i=jQuery.extend({interactive:!0,defaultText:"add a tag",minChars:0,width:"300px",height:"100px",autocomplete:{selectFirst:!1},hide:!0,delimiter:",",unique:!0,removeWithBackspace:!0,placeholderColor:"#666666",autosize:!0,comfortZone:20,inputPadding:12},r);return this.each(function(){i.hide&&t(this).hide();var r=t(this).attr("id");(!r||e[t(this).attr("id")])&&(r=t(this).attr("id","tags"+(new Date).getTime()).attr("id"));var o=jQuery.extend({pid:r,real_input:"#"+r,holder:"#"+r+"_tagsinput",input_wrapper:"#"+r+"_addTag",fake_input:"#"+r+"_tag"},i);e[r]=o.delimiter,(i.onAddTag||i.onRemoveTag||i.onChange)&&(n[r]=new Array,n[r].onAddTag=i.onAddTag,n[r].onRemoveTag=i.onRemoveTag,n[r].onChange=i.onChange);var s='<div id="'+r+'_tagsinput" class="tagsinput"><div id="'+r+'_addTag">';if(i.interactive&&(s=s+'<input id="'+r+'_tag" value="" data-default="'+i.defaultText+'" />'),s+='</div><div class="tags_clear"></div></div>',t(s).insertAfter(this),t(o.holder).css("width",i.width),t(o.holder).css("min-height",i.height),t(o.holder).css("height",i.height),""!=t(o.real_input).val()&&t.fn.tagsInput.importTags(t(o.real_input),t(o.real_input).val()),i.interactive){if(t(o.fake_input).val(t(o.fake_input).attr("data-default")),t(o.fake_input).css("color",i.placeholderColor),t(o.fake_input).resetAutosize(i),t(o.holder).bind("click",o,function(e){t(e.data.fake_input).focus()}),t(o.fake_input).bind("focus",o,function(e){t(e.data.fake_input).val()==t(e.data.fake_input).attr("data-default")&&t(e.data.fake_input).val(""),t(e.data.fake_input).css("color","#000000")}),void 0!=i.autocomplete_url){autocomplete_options={source:i.autocomplete_url};for(attrname in i.autocomplete)autocomplete_options[attrname]=i.autocomplete[attrname];void 0!==jQuery.Autocompleter?(t(o.fake_input).autocomplete(i.autocomplete_url,i.autocomplete),t(o.fake_input).bind("result",o,function(e,n){n&&t("#"+r).addTag(n[0]+"",{focus:!0,unique:i.unique})})):void 0!==jQuery.ui.autocomplete&&(t(o.fake_input).autocomplete(autocomplete_options),t(o.fake_input).bind("autocompleteselect",o,function(e,n){return t(e.data.real_input).addTag(n.item.value,{focus:!0,unique:i.unique}),!1}))}else t(o.fake_input).bind("blur",o,function(e){var n=t(this).attr("data-default");return""!=t(e.data.fake_input).val()&&t(e.data.fake_input).val()!=n?e.data.minChars<=t(e.data.fake_input).val().length&&(!e.data.maxChars||e.data.maxChars>=t(e.data.fake_input).val().length)&&t(e.data.real_input).addTag(t(e.data.fake_input).val(),{focus:!0,unique:i.unique}):(t(e.data.fake_input).val(t(e.data.fake_input).attr("data-default")),t(e.data.fake_input).css("color",i.placeholderColor)),!1});t(o.fake_input).bind("keypress",o,function(e){return a(e)?(e.preventDefault(),e.data.minChars<=t(e.data.fake_input).val().length&&(!e.data.maxChars||e.data.maxChars>=t(e.data.fake_input).val().length)&&t(e.data.real_input).addTag(t(e.data.fake_input).val(),{focus:!0,unique:i.unique}),t(e.data.fake_input).resetAutosize(i),!1):void(e.data.autosize&&t(e.data.fake_input).doAutosize(i))}),o.removeWithBackspace&&t(o.fake_input).bind("keydown",function(e){if(8==e.keyCode&&""==t(this).val()){e.preventDefault();var n=t(this).closest(".tagsinput").find(".tag:last").text(),a=t(this).attr("id").replace(/_tag$/,"");n=n.replace(/[\s]+x$/,""),t("#"+a).removeTag(escape(n)),t(this).trigger("focus")}}),t(o.fake_input).blur(),o.unique&&t(o.fake_input).keydown(function(e){(8==e.keyCode||String.fromCharCode(e.which).match(/\w+|[áéíóúÁÉÍÓÚñÑ,/]+/))&&t(this).removeClass("not_valid")})}}),this},t.fn.tagsInput.updateTagsField=function(n,a){var r=t(n).attr("id");t(n).val(a.join(e[r]))},t.fn.tagsInput.importTags=function(a,r){t(a).val("");var o=t(a).attr("id"),s=r.split(e[o]);for(i=0;i<s.length;i++)t(a).addTag(s[i],{focus:!1,callback:!1});if(n[o]&&n[o].onChange){var l=n[o].onChange;l.call(a,a,s[i])}};var a=function(e){var n=!1;return 13==e.which&&(n=!0),t.each(e.data.delimiter,function(t,a){e.which==a.charCodeAt(0)&&(n=!0)}),n}}(jQuery),!function(t){"function"==typeof define&&define.amd?define(["jquery"],t):t("object"==typeof exports?require("jquery"):jQuery)}(function(t){var e,n=navigator.userAgent,a=/iphone/i.test(n),r=/chrome/i.test(n),i=/android/i.test(n);t.maskinput={definitions:{9:"[0-9]",a:"[A-Za-z]","*":"[A-Za-z0-9]"},autoclear:!0,dataName:"rawMaskFn",placeholder:"_"},t.fn.extend({caret:function(t,e){var n;return 0===this.length||this.is(":hidden")?void 0:"number"==typeof t?(e="number"==typeof e?e:t,this.each(function(){this.setSelectionRange?this.setSelectionRange(t,e):this.createTextRange&&(n=this.createTextRange(),n.collapse(!0),n.moveEnd("character",e),n.moveStart("character",t),n.select())})):(this[0].setSelectionRange?(t=this[0].selectionStart,e=this[0].selectionEnd):document.selection&&document.selection.createRange&&(n=document.selection.createRange(),t=0-n.duplicate().moveStart("character",-1e5),e=t+n.text.length),{begin:t,end:e})},unmask:function(){return this.trigger("unmask")},maskinput:function(n,o){var s,l,u,c,d,f,h,p;if(!n&&this.length>0){s=t(this[0]);var g=s.data(t.maskinput.dataName);return g?g():void 0}return o=t.extend({autoclear:t.maskinput.autoclear,placeholder:t.maskinput.placeholder,completed:null},o),l=t.maskinput.definitions,u=[],c=h=n.length,d=null,t.each(n.split(""),function(t,e){"?"==e?(h--,c=t):l[e]?(u.push(new RegExp(l[e])),null===d&&(d=u.length-1),c>t&&(f=u.length-1)):u.push(null)}),this.trigger("unmask").each(function(){function s(){if(o.completed){for(var t=d;f>=t;t++)if(u[t]&&A[t]===g(t))return;o.completed.call(I)}}function g(t){return o.placeholder.charAt(t<o.placeholder.length?t:0)}function b(t){for(;++t<h&&!u[t];);return t}function m(t){for(;--t>=0&&!u[t];);return t}function v(t,e){var n,a;if(!(0>t)){for(n=t,a=b(e);h>n;n++)if(u[n]){if(!(h>a&&u[n].test(A[a])))break;A[n]=A[a],A[a]=g(a),a=b(a)}w(),I.caret(Math.max(d,t))}}function S(t){var e,n,a,r;for(e=t,n=g(t);h>e;e++)if(u[e]){if(a=b(e),r=A[e],A[e]=n,!(h>a&&u[a].test(r)))break;n=r}}function D(){var t=I.val(),e=I.caret();if(t.length<p.length){for(x(!0);e.begin>0&&!u[e.begin-1];)e.begin--;if(0===e.begin)for(;e.begin<d&&!u[e.begin];)e.begin++;I.caret(e.begin,e.begin)}else{for(x(!0);e.begin<h&&!u[e.begin];)e.begin++;I.caret(e.begin,e.begin)}s()}function _(){x(),I.val()!=F&&I.change()}function y(t){if(!I.prop("readonly")){var e,n,r,i=t.which||t.keyCode;p=I.val(),8===i||46===i||a&&127===i?(e=I.caret(),n=e.begin,r=e.end,r-n===0&&(n=46!==i?m(n):r=b(n-1),r=46===i?b(r):r),C(n,r),v(n,r-1),t.preventDefault()):13===i?_.call(this,t):27===i&&(I.val(F),I.caret(0,x()),t.preventDefault())}}function T(e){if(!I.prop("readonly")){var n,a,r,o=e.which||e.keyCode,l=I.caret();if(!(e.ctrlKey||e.altKey||e.metaKey||32>o)&&o&&13!==o){if(l.end-l.begin!==0&&(C(l.begin,l.end),v(l.begin,l.end-1)),n=b(l.begin-1),h>n&&(a=String.fromCharCode(o),u[n].test(a))){if(S(n),A[n]=a,w(),r=b(n),i){var c=function(){t.proxy(t.fn.caret,I,r)()};setTimeout(c,0)}else I.caret(r);l.begin<=f&&s()}e.preventDefault()}}}function C(t,e){var n;for(n=t;e>n&&h>n;n++)u[n]&&(A[n]=g(n))}function w(){I.val(A.join(""))}function x(t){var e,n,a,r=I.val(),i=-1;for(e=0,a=0;h>e;e++)if(u[e]){for(A[e]=g(e);a++<r.length;)if(n=r.charAt(a-1),u[e].test(n)){A[e]=n,i=e;break}if(a>r.length){C(e+1,h);break}}else A[e]===r.charAt(a)&&a++,c>e&&(i=e);return t?w():c>i+1?o.autoclear||A.join("")===k?(I.val()&&I.val(""),C(0,h)):w():(w(),I.val(I.val().substring(0,i+1))),c?e:d}var I=t(this),A=t.map(n.split(""),function(t,e){return"?"!=t?l[t]?g(e):t:void 0}),k=A.join(""),F=I.val();I.data(t.maskinput.dataName,function(){return t.map(A,function(t,e){return u[e]&&t!=g(e)?t:null}).join("")}),I.one("unmask",function(){I.off(".mask").removeData(t.maskinput.dataName)}).on("focus.mask",function(){if(!I.prop("readonly")){clearTimeout(e);var t;F=I.val(),t=x(),e=setTimeout(function(){w(),t==n.replace("?","").length?I.caret(0,t):I.caret(t)},10)}}).on("blur.mask",_).on("keydown.mask",y).on("keypress.mask",T).on("input.mask paste.mask",function(){I.prop("readonly")||setTimeout(function(){var t=x(!0);I.caret(t),s()},0)}),r&&i&&I.off("input.mask").on("input.mask",D),x()})}})}),function(t,e,n){var a=function(a){function r(t){var e,n,i={};a.each(t,function(a){(e=a.match(/^([^A-Z]+?)([A-Z])/))&&-1!=="a aa ai ao as b fn i m o s ".indexOf(e[1]+" ")&&(n=a.replace(e[0],e[2].toLowerCase()),i[n]=a,"o"===e[1]&&r(t[a]))}),t._hungarianMap=i}function i(t,e,o){t._hungarianMap||r(t);var s;a.each(e,function(r){s=t._hungarianMap[r],s===n||!o&&e[s]!==n||("o"===s.charAt(0)?(e[s]||(e[s]={}),a.extend(!0,e[s],e[r]),i(t[s],e[s],o)):e[s]=e[r])})}function o(t){var e=qe.defaults.oLanguage,n=t.sZeroRecords;!t.sEmptyTable&&n&&"No data available in table"===e.sEmptyTable&&Le(t,t,"sZeroRecords","sEmptyTable"),!t.sLoadingRecords&&n&&"Loading..."===e.sLoadingRecords&&Le(t,t,"sZeroRecords","sLoadingRecords"),t.sInfoThousands&&(t.sThousands=t.sInfoThousands),(t=t.sDecimal)&&Be(t)}function s(t){if(hn(t,"ordering","bSort"),hn(t,"orderMulti","bSortMulti"),hn(t,"orderClasses","bSortClasses"),hn(t,"orderCellsTop","bSortCellsTop"),hn(t,"order","aaSorting"),hn(t,"orderFixed","aaSortingFixed"),hn(t,"paging","bPaginate"),hn(t,"pagingType","sPaginationType"),hn(t,"pageLength","iDisplayLength"),hn(t,"searching","bFilter"),"boolean"==typeof t.sScrollX&&(t.sScrollX=t.sScrollX?"100%":""),t=t.aoSearchCols)for(var e=0,n=t.length;n>e;e++)t[e]&&i(qe.models.oSearch,t[e])}function l(t){hn(t,"orderable","bSortable"),hn(t,"orderData","aDataSort"),hn(t,"orderSequence","asSorting"),hn(t,"orderDataType","sortDataType");var e=t.aDataSort;e&&!a.isArray(e)&&(t.aDataSort=[e])}function u(t){if(!qe.__browser){var e={};qe.__browser=e;var n=a("<div/>").css({position:"fixed",top:0,left:0,height:1,width:1,overflow:"hidden"}).append(a("<div/>").css({position:"absolute",top:1,left:1,width:100,overflow:"scroll"}).append(a("<div/>").css({width:"100%",height:10}))).appendTo("body"),r=n.children(),i=r.children();e.barWidth=r[0].offsetWidth-r[0].clientWidth,e.bScrollOversize=100===i[0].offsetWidth&&100!==r[0].clientWidth,e.bScrollbarLeft=1!==Math.round(i.offset().left),e.bBounding=n[0].getBoundingClientRect().width?!0:!1,n.remove()}a.extend(t.oBrowser,qe.__browser),t.oScroll.iBarWidth=qe.__browser.barWidth}function c(t,e,a,r,i,o){var s,l=!1;for(a!==n&&(s=a,l=!0);r!==i;)t.hasOwnProperty(r)&&(s=l?e(s,t[r],r,t):t[r],l=!0,r+=o);return s}function d(t,n){var r=qe.defaults.column,i=t.aoColumns.length,r=a.extend({},qe.models.oColumn,r,{nTh:n?n:e.createElement("th"),sTitle:r.sTitle?r.sTitle:n?n.innerHTML:"",aDataSort:r.aDataSort?r.aDataSort:[i],mData:r.mData?r.mData:i,idx:i});t.aoColumns.push(r),r=t.aoPreSearchCols,r[i]=a.extend({},qe.models.oSearch,r[i]),f(t,i,a(n).data())}function f(t,e,r){var e=t.aoColumns[e],o=t.oClasses,s=a(e.nTh);if(!e.sWidthOrig){e.sWidthOrig=s.attr("width")||null;var u=(s.attr("style")||"").match(/width:\s*(\d+[pxem%]+)/);u&&(e.sWidthOrig=u[1])}r!==n&&null!==r&&(l(r),i(qe.defaults.column,r),r.mDataProp!==n&&!r.mData&&(r.mData=r.mDataProp),r.sType&&(e._sManualType=r.sType),r.className&&!r.sClass&&(r.sClass=r.className),a.extend(e,r),Le(e,r,"sWidth","sWidthOrig"),r.iDataSort!==n&&(e.aDataSort=[r.iDataSort]),Le(e,r,"aDataSort"));var c=e.mData,d=w(c),f=e.mRender?w(e.mRender):null,r=function(t){return"string"==typeof t&&-1!==t.indexOf("@")};e._bAttrSrc=a.isPlainObject(c)&&(r(c.sort)||r(c.type)||r(c.filter)),e.fnGetData=function(t,e,a){var r=d(t,e,n,a);return f&&e?f(r,e,t,a):r},e.fnSetData=function(t,e,n){return x(c)(t,e,n)},"number"!=typeof c&&(t._rowReadObject=!0),t.oFeatures.bSort||(e.bSortable=!1,s.addClass(o.sSortableNone)),t=-1!==a.inArray("asc",e.asSorting),r=-1!==a.inArray("desc",e.asSorting),e.bSortable&&(t||r)?t&&!r?(e.sSortingClass=o.sSortableAsc,e.sSortingClassJUI=o.sSortJUIAscAllowed):!t&&r?(e.sSortingClass=o.sSortableDesc,e.sSortingClassJUI=o.sSortJUIDescAllowed):(e.sSortingClass=o.sSortable,e.sSortingClassJUI=o.sSortJUI):(e.sSortingClass=o.sSortableNone,e.sSortingClassJUI="")}function h(t){if(!1!==t.oFeatures.bAutoWidth){var e=t.aoColumns;be(t);for(var n=0,a=e.length;a>n;n++)e[n].nTh.style.width=e[n].sWidth}e=t.oScroll,(""!==e.sY||""!==e.sX)&&pe(t),Ne(t,null,"column-sizing",[t])}function p(t,e){var n=m(t,"bVisible");return"number"==typeof n[e]?n[e]:null}function g(t,e){var n=m(t,"bVisible"),n=a.inArray(e,n);return-1!==n?n:null}function b(t){return m(t,"bVisible").length}function m(t,e){var n=[];return a.map(t.aoColumns,function(t,a){t[e]&&n.push(a)}),n}function v(t){var e,a,r,i,o,s,l,u,c,d=t.aoColumns,f=t.aoData,h=qe.ext.type.detect;for(e=0,a=d.length;a>e;e++)if(l=d[e],c=[],!l.sType&&l._sManualType)l.sType=l._sManualType;else if(!l.sType){for(r=0,i=h.length;i>r;r++){for(o=0,s=f.length;s>o&&(c[o]===n&&(c[o]=y(t,o,e,"type")),u=h[r](c[o],t),u||r===h.length-1)&&"html"!==u;o++);if(u){l.sType=u;break}}l.sType||(l.sType="string")}}function S(t,e,r,i){var o,s,l,u,c,f,h=t.aoColumns;if(e)for(o=e.length-1;o>=0;o--){f=e[o];var p=f.targets!==n?f.targets:f.aTargets;for(a.isArray(p)||(p=[p]),s=0,l=p.length;l>s;s++)if("number"==typeof p[s]&&0<=p[s]){for(;h.length<=p[s];)d(t);i(p[s],f)}else if("number"==typeof p[s]&&0>p[s])i(h.length+p[s],f);else if("string"==typeof p[s])for(u=0,c=h.length;c>u;u++)("_all"==p[s]||a(h[u].nTh).hasClass(p[s]))&&i(u,f)}if(r)for(o=0,t=r.length;t>o;o++)i(o,r[o])}function D(t,e,r,i){var o=t.aoData.length,s=a.extend(!0,{},qe.models.oRow,{src:r?"dom":"data",idx:o});s._aData=e,t.aoData.push(s);for(var l=t.aoColumns,u=0,c=l.length;c>u;u++)l[u].sType=null;return t.aiDisplayMaster.push(o),e=t.rowIdFn(e),e!==n&&(t.aIds[e]=s),(r||!t.oFeatures.bDeferRender)&&P(t,o,r,i),o}function _(t,e){var n;return e instanceof a||(e=a(e)),e.map(function(e,a){return n=R(t,a),D(t,n.data,a,n.cells)})}function y(t,e,a,r){var i=t.iDraw,o=t.aoColumns[a],s=t.aoData[e]._aData,l=o.sDefaultContent,a=o.fnGetData(s,r,{settings:t,row:e,col:a});if(a===n)return t.iDrawError!=i&&null===l&&(Pe(t,0,"Requested unknown parameter "+("function"==typeof o.mData?"{function}":"'"+o.mData+"'")+" for row "+e,4),t.iDrawError=i),l;if(a!==s&&null!==a||null===l){if("function"==typeof a)return a.call(s)}else a=l;return null===a&&"display"==r?"":a}function T(t,e,n,a){t.aoColumns[n].fnSetData(t.aoData[e]._aData,a,{settings:t,row:e,col:n})}function C(t){return a.map(t.match(/(\\.|[^\.])+/g)||[""],function(t){return t.replace(/\\./g,".")})}function w(t){if(a.isPlainObject(t)){var e={};return a.each(t,function(t,n){n&&(e[t]=w(n))}),function(t,a,r,i){var o=e[a]||e._;return o!==n?o(t,a,r,i):t}}if(null===t)return function(t){return t};if("function"==typeof t)return function(e,n,a,r){return t(e,n,a,r)};if("string"==typeof t&&(-1!==t.indexOf(".")||-1!==t.indexOf("[")||-1!==t.indexOf("("))){var r=function(t,e,i){var o,s;if(""!==i){s=C(i);for(var l=0,u=s.length;u>l;l++){if(i=s[l].match(pn),o=s[l].match(gn),i){if(s[l]=s[l].replace(pn,""),""!==s[l]&&(t=t[s[l]]),o=[],s.splice(0,l+1),s=s.join("."),a.isArray(t))for(l=0,u=t.length;u>l;l++)o.push(r(t[l],e,s));t=i[0].substring(1,i[0].length-1),t=""===t?o:o.join(t);break}if(o)s[l]=s[l].replace(gn,""),t=t[s[l]]();else{if(null===t||t[s[l]]===n)return n;t=t[s[l]]}}}return t};return function(e,n){return r(e,n,t)}}return function(e){return e[t]}}function x(t){if(a.isPlainObject(t))return x(t._);if(null===t)return function(){};if("function"==typeof t)return function(e,n,a){t(e,"set",n,a)};if("string"==typeof t&&(-1!==t.indexOf(".")||-1!==t.indexOf("[")||-1!==t.indexOf("("))){var e=function(t,r,i){var o,i=C(i);o=i[i.length-1];for(var s,l,u=0,c=i.length-1;c>u;u++){if(s=i[u].match(pn),l=i[u].match(gn),s){if(i[u]=i[u].replace(pn,""),t[i[u]]=[],o=i.slice(),o.splice(0,u+1),s=o.join("."),a.isArray(r))for(l=0,c=r.length;c>l;l++)o={},e(o,r[l],s),t[i[u]].push(o);else t[i[u]]=r;return}l&&(i[u]=i[u].replace(gn,""),t=t[i[u]](r)),(null===t[i[u]]||t[i[u]]===n)&&(t[i[u]]={}),t=t[i[u]]}o.match(gn)?t[o.replace(gn,"")](r):t[o.replace(pn,"")]=r};return function(n,a){return e(n,a,t)}}return function(e,n){e[t]=n}}function I(t){return ln(t.aoData,"_aData")}function A(t){t.aoData.length=0,t.aiDisplayMaster.length=0,t.aiDisplay.length=0,t.aIds={}}function k(t,e,a){for(var r=-1,i=0,o=t.length;o>i;i++)t[i]==e?r=i:t[i]>e&&t[i]--;-1!=r&&a===n&&t.splice(r,1)}function F(t,e,a,r){var i,o=t.aoData[e],s=function(n,a){for(;n.childNodes.length;)n.removeChild(n.firstChild);n.innerHTML=y(t,e,a,"display")};if("dom"!==a&&(a&&"auto"!==a||"dom"!==o.src)){var l=o.anCells;if(l)if(r!==n)s(l[r],r);else for(a=0,i=l.length;i>a;a++)s(l[a],a)}else o._aData=R(t,o,r,r===n?n:o._aData).data;if(o._aSortData=null,o._aFilterData=null,s=t.aoColumns,r!==n)s[r].sType=null;else{for(a=0,i=s.length;i>a;a++)s[a].sType=null;L(t,o)}}function R(t,e,r,i){var o,s,l,u=[],c=e.firstChild,d=0,f=t.aoColumns,h=t._rowReadObject,i=i!==n?i:h?{}:[],p=function(t,e){if("string"==typeof t){var n=t.indexOf("@");-1!==n&&(n=t.substring(n+1),x(t)(i,e.getAttribute(n)))}},g=function(t){(r===n||r===d)&&(s=f[d],l=a.trim(t.innerHTML),s&&s._bAttrSrc?(x(s.mData._)(i,l),p(s.mData.sort,t),p(s.mData.type,t),p(s.mData.filter,t)):h?(s._setter||(s._setter=x(s.mData)),s._setter(i,l)):i[d]=l),d++};if(c)for(;c;)o=c.nodeName.toUpperCase(),("TD"==o||"TH"==o)&&(g(c),u.push(c)),c=c.nextSibling;else{u=e.anCells,o=0;for(var b=u.length;b>o;o++)g(u[o])}return(e=c?e:e.nTr)&&(e=e.getAttribute("id"))&&x(t.rowId)(i,e),{data:i,cells:u}}function P(t,n,a,r){var i,o,s,l,u,c=t.aoData[n],d=c._aData,f=[];if(null===c.nTr){for(i=a||e.createElement("tr"),c.nTr=i,c.anCells=f,i._DT_RowIndex=n,L(t,c),l=0,u=t.aoColumns.length;u>l;l++)s=t.aoColumns[l],o=a?r[l]:e.createElement(s.sCellType),f.push(o),(!a||s.mRender||s.mData!==l)&&(o.innerHTML=y(t,n,l,"display")),s.sClass&&(o.className+=" "+s.sClass),s.bVisible&&!a?i.appendChild(o):!s.bVisible&&a&&o.parentNode.removeChild(o),s.fnCreatedCell&&s.fnCreatedCell.call(t.oInstance,o,y(t,n,l),d,n,l);Ne(t,"aoRowCreatedCallback",null,[i,d,n])}c.nTr.setAttribute("role","row")}function L(t,e){var n=e.nTr,r=e._aData;if(n){var i=t.rowIdFn(r);i&&(n.id=i),r.DT_RowClass&&(i=r.DT_RowClass.split(" "),e.__rowc=e.__rowc?fn(e.__rowc.concat(i)):i,a(n).removeClass(e.__rowc.join(" ")).addClass(r.DT_RowClass)),r.DT_RowAttr&&a(n).attr(r.DT_RowAttr),r.DT_RowData&&a(n).data(r.DT_RowData)}}function j(t){var e,n,r,i,o,s=t.nTHead,l=t.nTFoot,u=0===a("th, td",s).length,c=t.oClasses,d=t.aoColumns;for(u&&(i=a("<tr/>").appendTo(s)),e=0,n=d.length;n>e;e++)o=d[e],r=a(o.nTh).addClass(o.sClass),u&&r.appendTo(i),t.oFeatures.bSort&&(r.addClass(o.sSortingClass),!1!==o.bSortable&&(r.attr("tabindex",t.iTabIndex).attr("aria-controls",t.sTableId),xe(t,o.nTh,e))),o.sTitle!=r[0].innerHTML&&r.html(o.sTitle),We(t,"header")(t,r,o,c);if(u&&W(t.aoHeader,s),a(s).find(">tr").attr("role","row"),a(s).find(">tr>th, >tr>td").addClass(c.sHeaderTH),a(l).find(">tr>th, >tr>td").addClass(c.sFooterTH),null!==l)for(t=t.aoFooter[0],e=0,n=t.length;n>e;e++)o=d[e],o.nTf=t[e].cell,o.sClass&&a(o.nTf).addClass(o.sClass)}function H(t,e,r){var i,o,s,l,u=[],c=[],d=t.aoColumns.length;if(e){for(r===n&&(r=!1),i=0,o=e.length;o>i;i++){for(u[i]=e[i].slice(),u[i].nTr=e[i].nTr,s=d-1;s>=0;s--)!t.aoColumns[s].bVisible&&!r&&u[i].splice(s,1);c.push([])}for(i=0,o=u.length;o>i;i++){if(t=u[i].nTr)for(;s=t.firstChild;)t.removeChild(s);for(s=0,e=u[i].length;e>s;s++)if(l=d=1,c[i][s]===n){for(t.appendChild(u[i][s].cell),c[i][s]=1;u[i+d]!==n&&u[i][s].cell==u[i+d][s].cell;)c[i+d][s]=1,d++;for(;u[i][s+l]!==n&&u[i][s].cell==u[i][s+l].cell;){for(r=0;d>r;r++)c[i+r][s+l]=1;l++}a(u[i][s].cell).attr("rowspan",d).attr("colspan",l)}}}}function M(t){var e=Ne(t,"aoPreDrawCallback","preDraw",[t]);if(-1!==a.inArray(!1,e))fe(t,!1);else{var e=[],r=0,i=t.asStripeClasses,o=i.length,s=t.oLanguage,l=t.iInitDisplayStart,u="ssp"==Ee(t),c=t.aiDisplay;t.bDrawing=!0,l!==n&&-1!==l&&(t._iDisplayStart=u?l:l>=t.fnRecordsDisplay()?0:l,t.iInitDisplayStart=-1);var l=t._iDisplayStart,d=t.fnDisplayEnd();if(t.bDeferLoading)t.bDeferLoading=!1,t.iDraw++,fe(t,!1);else if(u){if(!t.bDestroying&&!B(t))return}else t.iDraw++;if(0!==c.length)for(s=u?t.aoData.length:d,u=u?0:l;s>u;u++){var f=c[u],h=t.aoData[f];if(null===h.nTr&&P(t,f),f=h.nTr,0!==o){var p=i[r%o];h._sRowStripe!=p&&(a(f).removeClass(h._sRowStripe).addClass(p),h._sRowStripe=p)}Ne(t,"aoRowCallback",null,[f,h._aData,r,u]),e.push(f),r++}else r=s.sZeroRecords,1==t.iDraw&&"ajax"==Ee(t)?r=s.sLoadingRecords:s.sEmptyTable&&0===t.fnRecordsTotal()&&(r=s.sEmptyTable),e[0]=a("<tr/>",{"class":o?i[0]:""}).append(a("<td />",{valign:"top",colSpan:b(t),"class":t.oClasses.sRowEmpty}).html(r))[0];Ne(t,"aoHeaderCallback","header",[a(t.nTHead).children("tr")[0],I(t),l,d,c]),Ne(t,"aoFooterCallback","footer",[a(t.nTFoot).children("tr")[0],I(t),l,d,c]),i=a(t.nTBody),i.children().detach(),i.append(a(e)),Ne(t,"aoDrawCallback","draw",[t]),t.bSorted=!1,t.bFiltered=!1,t.bDrawing=!1}}function N(t,e){var n=t.oFeatures,a=n.bFilter;n.bSort&&Te(t),a?G(t,t.oPreviousSearch):t.aiDisplay=t.aiDisplayMaster.slice(),!0!==e&&(t._iDisplayStart=0),t._drawHold=e,M(t),t._drawHold=!1}function O(t){var e=t.oClasses,n=a(t.nTable),n=a("<div/>").insertBefore(n),r=t.oFeatures,i=a("<div/>",{id:t.sTableId+"_wrapper","class":e.sWrapper+(t.nTFoot?"":" "+e.sNoFooter)});t.nHolding=n[0],t.nTableWrapper=i[0],t.nTableReinsertBefore=t.nTable.nextSibling;for(var o,s,l,u,c,d,f=t.sDom.split(""),h=0;h<f.length;h++){if(o=null,s=f[h],"<"==s){if(l=a("<div/>")[0],u=f[h+1],"'"==u||'"'==u){for(c="",d=2;f[h+d]!=u;)c+=f[h+d],d++;"H"==c?c=e.sJUIHeader:"F"==c&&(c=e.sJUIFooter),-1!=c.indexOf(".")?(u=c.split("."),l.id=u[0].substr(1,u[0].length-1),l.className=u[1]):"#"==c.charAt(0)?l.id=c.substr(1,c.length-1):l.className=c,h+=d}i.append(l),i=a(l)}else if(">"==s)i=i.parent();else if("l"==s&&r.bPaginate&&r.bLengthChange)o=le(t);else if("f"==s&&r.bFilter)o=X(t);else if("r"==s&&r.bProcessing)o=de(t);else if("t"==s)o=he(t);else if("i"==s&&r.bInfo)o=ne(t);else if("p"==s&&r.bPaginate)o=ue(t);else if(0!==qe.ext.feature.length)for(l=qe.ext.feature,d=0,u=l.length;u>d;d++)if(s==l[d].cFeature){o=l[d].fnInit(t);break}o&&(l=t.aanFeatures,l[s]||(l[s]=[]),l[s].push(o),i.append(o))}n.replaceWith(i),t.nHolding=null}function W(t,e){var n,r,i,o,s,l,u,c,d,f,h=a(e).children("tr");for(t.splice(0,t.length),i=0,l=h.length;l>i;i++)t.push([]);for(i=0,l=h.length;l>i;i++)for(n=h[i],r=n.firstChild;r;){if("TD"==r.nodeName.toUpperCase()||"TH"==r.nodeName.toUpperCase()){for(c=1*r.getAttribute("colspan"),d=1*r.getAttribute("rowspan"),c=c&&0!==c&&1!==c?c:1,d=d&&0!==d&&1!==d?d:1,o=0,s=t[i];s[o];)o++;for(u=o,f=1===c?!0:!1,s=0;c>s;s++)for(o=0;d>o;o++)t[i+o][u+s]={cell:r,unique:f},t[i+o].nTr=n}r=r.nextSibling}}function E(t,e,n){var a=[];n||(n=t.aoHeader,e&&(n=[],W(n,e)));for(var e=0,r=n.length;r>e;e++)for(var i=0,o=n[e].length;o>i;i++)!n[e][i].unique||a[i]&&t.bSortCellsTop||(a[i]=n[e][i].cell);return a}function U(t,e,n){if(Ne(t,"aoServerParams","serverParams",[e]),e&&a.isArray(e)){var r={},i=/(.*?)\[\]$/;a.each(e,function(t,e){var n=e.name.match(i);n?(n=n[0],r[n]||(r[n]=[]),r[n].push(e.value)):r[e.name]=e.value}),e=r}var o,s=t.ajax,l=t.oInstance,u=function(e){Ne(t,null,"xhr",[t,e,t.jqXHR]),n(e)};if(a.isPlainObject(s)&&s.data){o=s.data;var c=a.isFunction(o)?o(e,t):o,e=a.isFunction(o)&&c?c:a.extend(!0,e,c);delete s.data}c={data:e,success:function(e){var n=e.error||e.sError;n&&Pe(t,0,n),t.json=e,u(e)},dataType:"json",cache:!1,type:t.sServerMethod,error:function(e,n){var r=Ne(t,null,"xhr",[t,null,t.jqXHR]);-1===a.inArray(!0,r)&&("parsererror"==n?Pe(t,0,"Invalid JSON response",1):4===e.readyState&&Pe(t,0,"Ajax error",7)),fe(t,!1)}},t.oAjaxData=e,Ne(t,null,"preXhr",[t,e]),t.fnServerData?t.fnServerData.call(l,t.sAjaxSource,a.map(e,function(t,e){return{name:e,value:t}}),u,t):t.sAjaxSource||"string"==typeof s?t.jqXHR=a.ajax(a.extend(c,{url:s||t.sAjaxSource})):a.isFunction(s)?t.jqXHR=s.call(l,e,u,t):(t.jqXHR=a.ajax(a.extend(c,s)),s.data=o)}function B(t){return t.bAjaxDataGet?(t.iDraw++,fe(t,!0),U(t,J(t),function(e){q(t,e)}),!1):!0}function J(t){var e,n,r,i,o=t.aoColumns,s=o.length,l=t.oFeatures,u=t.oPreviousSearch,c=t.aoPreSearchCols,d=[],f=ye(t);e=t._iDisplayStart,n=!1!==l.bPaginate?t._iDisplayLength:-1;var h=function(t,e){d.push({name:t,value:e})};h("sEcho",t.iDraw),h("iColumns",s),h("sColumns",ln(o,"sName").join(",")),h("iDisplayStart",e),h("iDisplayLength",n);var p={draw:t.iDraw,columns:[],order:[],start:e,length:n,search:{value:u.sSearch,regex:u.bRegex}};for(e=0;s>e;e++)r=o[e],i=c[e],n="function"==typeof r.mData?"function":r.mData,p.columns.push({data:n,name:r.sName,searchable:r.bSearchable,orderable:r.bSortable,search:{value:i.sSearch,regex:i.bRegex}}),h("mDataProp_"+e,n),l.bFilter&&(h("sSearch_"+e,i.sSearch),h("bRegex_"+e,i.bRegex),h("bSearchable_"+e,r.bSearchable)),l.bSort&&h("bSortable_"+e,r.bSortable);
return l.bFilter&&(h("sSearch",u.sSearch),h("bRegex",u.bRegex)),l.bSort&&(a.each(f,function(t,e){p.order.push({column:e.col,dir:e.dir}),h("iSortCol_"+t,e.col),h("sSortDir_"+t,e.dir)}),h("iSortingCols",f.length)),o=qe.ext.legacy.ajax,null===o?t.sAjaxSource?d:p:o?d:p}function q(t,e){var a=V(t,e),r=e.sEcho!==n?e.sEcho:e.draw,i=e.iTotalRecords!==n?e.iTotalRecords:e.recordsTotal,o=e.iTotalDisplayRecords!==n?e.iTotalDisplayRecords:e.recordsFiltered;if(r){if(1*r<t.iDraw)return;t.iDraw=1*r}for(A(t),t._iRecordsTotal=parseInt(i,10),t._iRecordsDisplay=parseInt(o,10),r=0,i=a.length;i>r;r++)D(t,a[r]);t.aiDisplay=t.aiDisplayMaster.slice(),t.bAjaxDataGet=!1,M(t),t._bInitComplete||oe(t,e),t.bAjaxDataGet=!0,fe(t,!1)}function V(t,e){var r=a.isPlainObject(t.ajax)&&t.ajax.dataSrc!==n?t.ajax.dataSrc:t.sAjaxDataProp;return"data"===r?e.aaData||e[r]:""!==r?w(r)(e):e}function X(t){var n=t.oClasses,r=t.sTableId,i=t.oLanguage,o=t.oPreviousSearch,s=t.aanFeatures,l='<input type="search" class="'+n.sFilterInput+'"/>',u=i.sSearch,u=u.match(/_INPUT_/)?u.replace("_INPUT_",l):u+l,n=a("<div/>",{id:s.f?null:r+"_filter","class":n.sFilter}).append(a("<label/>").append(u)),s=function(){var e=this.value?this.value:"";e!=o.sSearch&&(G(t,{sSearch:e,bRegex:o.bRegex,bSmart:o.bSmart,bCaseInsensitive:o.bCaseInsensitive}),t._iDisplayStart=0,M(t))},l=null!==t.searchDelay?t.searchDelay:"ssp"===Ee(t)?400:0,c=a("input",n).val(o.sSearch).attr("placeholder",i.sSearchPlaceholder).bind("keyup.DT search.DT input.DT paste.DT cut.DT",l?me(s,l):s).bind("keypress.DT",function(t){return 13==t.keyCode?!1:void 0}).attr("aria-controls",r);return a(t.nTable).on("search.dt.DT",function(n,a){if(t===a)try{c[0]!==e.activeElement&&c.val(o.sSearch)}catch(r){}}),n[0]}function G(t,e,a){var r=t.oPreviousSearch,i=t.aoPreSearchCols,o=function(t){r.sSearch=t.sSearch,r.bRegex=t.bRegex,r.bSmart=t.bSmart,r.bCaseInsensitive=t.bCaseInsensitive};if(v(t),"ssp"!=Ee(t)){for(Q(t,e.sSearch,a,e.bEscapeRegex!==n?!e.bEscapeRegex:e.bRegex,e.bSmart,e.bCaseInsensitive),o(e),e=0;e<i.length;e++)$(t,i[e].sSearch,e,i[e].bEscapeRegex!==n?!i[e].bEscapeRegex:i[e].bRegex,i[e].bSmart,i[e].bCaseInsensitive);z(t)}else o(e);t.bFiltered=!0,Ne(t,null,"search",[t])}function z(t){for(var e,n,r=qe.ext.search,i=t.aiDisplay,o=0,s=r.length;s>o;o++){for(var l=[],u=0,c=i.length;c>u;u++)n=i[u],e=t.aoData[n],r[o](t,e._aFilterData,n,e._aData,u)&&l.push(n);i.length=0,a.merge(i,l)}}function $(t,e,n,a,r,i){if(""!==e)for(var o=t.aiDisplay,a=Y(e,a,r,i),r=o.length-1;r>=0;r--)e=t.aoData[o[r]]._aFilterData[n],a.test(e)||o.splice(r,1)}function Q(t,e,n,a,r,i){var o,a=Y(e,a,r,i),r=t.oPreviousSearch.sSearch,i=t.aiDisplayMaster;if(0!==qe.ext.search.length&&(n=!0),o=K(t),0>=e.length)t.aiDisplay=i.slice();else for((o||n||r.length>e.length||0!==e.indexOf(r)||t.bSorted)&&(t.aiDisplay=i.slice()),e=t.aiDisplay,n=e.length-1;n>=0;n--)a.test(t.aoData[e[n]]._sFilterRow)||e.splice(n,1)}function Y(t,e,n,r){return t=e?t:Z(t),n&&(t="^(?=.*?"+a.map(t.match(/"[^"]+"|[^ ]+/g)||[""],function(t){if('"'===t.charAt(0))var e=t.match(/^"(.*)"$/),t=e?e[1]:t;return t.replace('"',"")}).join(")(?=.*?")+").*$"),RegExp(t,r?"i":"")}function Z(t){return t.replace(tn,"\\$1")}function K(t){var e,n,a,r,i,o,s,l,u=t.aoColumns,c=qe.ext.type.search;for(e=!1,n=0,r=t.aoData.length;r>n;n++)if(l=t.aoData[n],!l._aFilterData){for(o=[],a=0,i=u.length;i>a;a++)e=u[a],e.bSearchable?(s=y(t,n,a,"filter"),c[e.sType]&&(s=c[e.sType](s)),null===s&&(s=""),"string"!=typeof s&&s.toString&&(s=s.toString())):s="",s.indexOf&&-1!==s.indexOf("&")&&(bn.innerHTML=s,s=mn?bn.textContent:bn.innerText),s.replace&&(s=s.replace(/[\r\n]/g,"")),o.push(s);l._aFilterData=o,l._sFilterRow=o.join("  "),e=!0}return e}function te(t){return{search:t.sSearch,smart:t.bSmart,regex:t.bRegex,caseInsensitive:t.bCaseInsensitive}}function ee(t){return{sSearch:t.search,bSmart:t.smart,bRegex:t.regex,bCaseInsensitive:t.caseInsensitive}}function ne(t){var e=t.sTableId,n=t.aanFeatures.i,r=a("<div/>",{"class":t.oClasses.sInfo,id:n?null:e+"_info"});return n||(t.aoDrawCallback.push({fn:ae,sName:"information"}),r.attr("role","status").attr("aria-live","polite"),a(t.nTable).attr("aria-describedby",e+"_info")),r[0]}function ae(t){var e=t.aanFeatures.i;if(0!==e.length){var n=t.oLanguage,r=t._iDisplayStart+1,i=t.fnDisplayEnd(),o=t.fnRecordsTotal(),s=t.fnRecordsDisplay(),l=s?n.sInfo:n.sInfoEmpty;s!==o&&(l+=" "+n.sInfoFiltered),l+=n.sInfoPostFix,l=re(t,l),n=n.fnInfoCallback,null!==n&&(l=n.call(t.oInstance,t,r,i,o,s,l)),a(e).html(l)}}function re(t,e){var n=t.fnFormatNumber,a=t._iDisplayStart+1,r=t._iDisplayLength,i=t.fnRecordsDisplay(),o=-1===r;return e.replace(/_START_/g,n.call(t,a)).replace(/_END_/g,n.call(t,t.fnDisplayEnd())).replace(/_MAX_/g,n.call(t,t.fnRecordsTotal())).replace(/_TOTAL_/g,n.call(t,i)).replace(/_PAGE_/g,n.call(t,o?1:Math.ceil(a/r))).replace(/_PAGES_/g,n.call(t,o?1:Math.ceil(i/r)))}function ie(t){var e,n,a,r=t.iInitDisplayStart,i=t.aoColumns;n=t.oFeatures;var o=t.bDeferLoading;if(t.bInitialised){for(O(t),j(t),H(t,t.aoHeader),H(t,t.aoFooter),fe(t,!0),n.bAutoWidth&&be(t),e=0,n=i.length;n>e;e++)a=i[e],a.sWidth&&(a.nTh.style.width=_e(a.sWidth));Ne(t,null,"preInit",[t]),N(t),i=Ee(t),("ssp"!=i||o)&&("ajax"==i?U(t,[],function(n){var a=V(t,n);for(e=0;e<a.length;e++)D(t,a[e]);t.iInitDisplayStart=r,N(t),fe(t,!1),oe(t,n)},t):(fe(t,!1),oe(t)))}else setTimeout(function(){ie(t)},200)}function oe(t,e){t._bInitComplete=!0,(e||t.oInit.aaData)&&h(t),Ne(t,"aoInitComplete","init",[t,e])}function se(t,e){var n=parseInt(e,10);t._iDisplayLength=n,Oe(t),Ne(t,null,"length",[t,n])}function le(t){for(var e=t.oClasses,n=t.sTableId,r=t.aLengthMenu,i=a.isArray(r[0]),o=i?r[0]:r,r=i?r[1]:r,i=a("<select/>",{name:n+"_length","aria-controls":n,"class":e.sLengthSelect}),s=0,l=o.length;l>s;s++)i[0][s]=new Option(r[s],o[s]);var u=a("<div><label/></div>").addClass(e.sLength);return t.aanFeatures.l||(u[0].id=n+"_length"),u.children().append(t.oLanguage.sLengthMenu.replace("_MENU_",i[0].outerHTML)),a("select",u).val(t._iDisplayLength).bind("change.DT",function(){se(t,a(this).val()),M(t)}),a(t.nTable).bind("length.dt.DT",function(e,n,r){t===n&&a("select",u).val(r)}),u[0]}function ue(t){var e=t.sPaginationType,n=qe.ext.pager[e],r="function"==typeof n,i=function(t){M(t)},e=a("<div/>").addClass(t.oClasses.sPaging+e)[0],o=t.aanFeatures;return r||n.fnInit(t,e,i),o.p||(e.id=t.sTableId+"_paginate",t.aoDrawCallback.push({fn:function(t){if(r){var e,a=t._iDisplayStart,s=t._iDisplayLength,l=t.fnRecordsDisplay(),u=-1===s,a=u?0:Math.ceil(a/s),s=u?1:Math.ceil(l/s),l=n(a,s),u=0;for(e=o.p.length;e>u;u++)We(t,"pageButton")(t,o.p[u],u,l,a,s)}else n.fnUpdate(t,i)},sName:"pagination"})),e}function ce(t,e,n){var a=t._iDisplayStart,r=t._iDisplayLength,i=t.fnRecordsDisplay();return 0===i||-1===r?a=0:"number"==typeof e?(a=e*r,a>i&&(a=0)):"first"==e?a=0:"previous"==e?(a=r>=0?a-r:0,0>a&&(a=0)):"next"==e?i>a+r&&(a+=r):"last"==e?a=Math.floor((i-1)/r)*r:Pe(t,0,"Unknown paging action: "+e,5),e=t._iDisplayStart!==a,t._iDisplayStart=a,e&&(Ne(t,null,"page",[t]),n&&M(t)),e}function de(t){return a("<div/>",{id:t.aanFeatures.r?null:t.sTableId+"_processing","class":t.oClasses.sProcessing}).html(t.oLanguage.sProcessing).insertBefore(t.nTable)[0]}function fe(t,e){t.oFeatures.bProcessing&&a(t.aanFeatures.r).css("display",e?"block":"none"),Ne(t,null,"processing",[t,e])}function he(t){var e=a(t.nTable);e.attr("role","grid");var n=t.oScroll;if(""===n.sX&&""===n.sY)return t.nTable;var r=n.sX,i=n.sY,o=t.oClasses,s=e.children("caption"),l=s.length?s[0]._captionSide:null,u=a(e[0].cloneNode(!1)),c=a(e[0].cloneNode(!1)),d=e.children("tfoot");n.sX&&"100%"===e.attr("width")&&e.removeAttr("width"),d.length||(d=null),u=a("<div/>",{"class":o.sScrollWrapper}).append(a("<div/>",{"class":o.sScrollHead}).css({overflow:"hidden",position:"relative",border:0,width:r?r?_e(r):null:"100%"}).append(a("<div/>",{"class":o.sScrollHeadInner}).css({"box-sizing":"content-box",width:n.sXInner||"100%"}).append(u.removeAttr("id").css("margin-left",0).append("top"===l?s:null).append(e.children("thead"))))).append(a("<div/>",{"class":o.sScrollBody}).css({position:"relative",overflow:"auto",width:r?_e(r):null}).append(e)),d&&u.append(a("<div/>",{"class":o.sScrollFoot}).css({overflow:"hidden",border:0,width:r?r?_e(r):null:"100%"}).append(a("<div/>",{"class":o.sScrollFootInner}).append(c.removeAttr("id").css("margin-left",0).append("bottom"===l?s:null).append(e.children("tfoot")))));var e=u.children(),f=e[0],o=e[1],h=d?e[2]:null;return r&&a(o).on("scroll.DT",function(){var t=this.scrollLeft;f.scrollLeft=t,d&&(h.scrollLeft=t)}),a(o).css(i&&n.bCollapse?"max-height":"height",i),t.nScrollHead=f,t.nScrollBody=o,t.nScrollFoot=h,t.aoDrawCallback.push({fn:pe,sName:"scrolling"}),u[0]}function pe(t){var e,n,r,i,o,s=t.oScroll,l=s.sX,u=s.sXInner,c=s.sY,s=s.iBarWidth,d=a(t.nScrollHead),f=d[0].style,h=d.children("div"),g=h[0].style,b=h.children("table"),h=t.nScrollBody,m=a(h),v=h.style,S=a(t.nScrollFoot).children("div"),D=S.children("table"),_=a(t.nTHead),y=a(t.nTable),T=y[0],C=T.style,w=t.nTFoot?a(t.nTFoot):null,x=t.oBrowser,I=x.bScrollOversize,A=[],k=[],F=[],R=function(t){t=t.style,t.paddingTop="0",t.paddingBottom="0",t.borderTopWidth="0",t.borderBottomWidth="0",t.height=0};y.children("thead, tfoot").remove(),i=_.clone().prependTo(y),_=_.find("tr"),n=i.find("tr"),i.find("th, td").removeAttr("tabindex"),w&&(r=w.clone().prependTo(y),e=w.find("tr"),r=r.find("tr")),l||(v.width="100%",d[0].style.width="100%"),a.each(E(t,i),function(e,n){o=p(t,e),n.style.width=t.aoColumns[o].sWidth}),w&&ge(function(t){t.style.width=""},r),d=y.outerWidth(),""===l?(C.width="100%",I&&(y.find("tbody").height()>h.offsetHeight||"scroll"==m.css("overflow-y"))&&(C.width=_e(y.outerWidth()-s)),d=y.outerWidth()):""!==u&&(C.width=_e(u),d=y.outerWidth()),ge(R,n),ge(function(t){F.push(t.innerHTML),A.push(_e(a(t).css("width")))},n),ge(function(t,e){t.style.width=A[e]},_),a(n).height(0),w&&(ge(R,r),ge(function(t){k.push(_e(a(t).css("width")))},r),ge(function(t,e){t.style.width=k[e]},e),a(r).height(0)),ge(function(t,e){t.innerHTML='<div class="dataTables_sizing" style="height:0;overflow:hidden;">'+F[e]+"</div>",t.style.width=A[e]},n),w&&ge(function(t,e){t.innerHTML="",t.style.width=k[e]},r),y.outerWidth()<d?(e=h.scrollHeight>h.offsetHeight||"scroll"==m.css("overflow-y")?d+s:d,I&&(h.scrollHeight>h.offsetHeight||"scroll"==m.css("overflow-y"))&&(C.width=_e(e-s)),(""===l||""!==u)&&Pe(t,1,"Possible column misalignment",6)):e="100%",v.width=_e(e),f.width=_e(e),w&&(t.nScrollFoot.style.width=_e(e)),!c&&I&&(v.height=_e(T.offsetHeight+s)),l=y.outerWidth(),b[0].style.width=_e(l),g.width=_e(l),u=y.height()>h.clientHeight||"scroll"==m.css("overflow-y"),c="padding"+(x.bScrollbarLeft?"Left":"Right"),g[c]=u?s+"px":"0px",w&&(D[0].style.width=_e(l),S[0].style.width=_e(l),S[0].style[c]=u?s+"px":"0px"),m.scroll(),!t.bSorted&&!t.bFiltered||t._drawHold||(h.scrollTop=0)}function ge(t,e,n){for(var a,r,i=0,o=0,s=e.length;s>o;){for(a=e[o].firstChild,r=n?n[o].firstChild:null;a;)1===a.nodeType&&(n?t(a,r,i):t(a,i),i++),a=a.nextSibling,r=n?r.nextSibling:null;o++}}function be(e){var n,r,i,o=e.nTable,s=e.aoColumns,l=e.oScroll,u=l.sY,c=l.sX,d=l.sXInner,f=s.length,g=m(e,"bVisible"),v=a("th",e.nTHead),S=o.getAttribute("width"),D=o.parentNode,_=!1;for(i=e.oBrowser,l=i.bScrollOversize,(n=o.style.width)&&-1!==n.indexOf("%")&&(S=n),n=0;n<g.length;n++)r=s[g[n]],null!==r.sWidth&&(r.sWidth=ve(r.sWidthOrig,D),_=!0);if(l||!_&&!c&&!u&&f==b(e)&&f==v.length)for(n=0;f>n;n++)(g=p(e,n))&&(s[g].sWidth=_e(v.eq(n).width()));else{f=a(o).clone().css("visibility","hidden").removeAttr("id"),f.find("tbody tr").remove();var y=a("<tr/>").appendTo(f.find("tbody"));for(f.find("thead, tfoot").remove(),f.append(a(e.nTHead).clone()).append(a(e.nTFoot).clone()),f.find("tfoot th, tfoot td").css("width",""),v=E(e,f.find("thead")[0]),n=0;n<g.length;n++)r=s[g[n]],v[n].style.width=null!==r.sWidthOrig&&""!==r.sWidthOrig?_e(r.sWidthOrig):"";if(e.aoData.length)for(n=0;n<g.length;n++)_=g[n],r=s[_],a(Se(e,_)).clone(!1).append(r.sContentPadding).appendTo(y);if(_=a("<div/>").css(c||u?{position:"absolute",top:0,left:0,height:1,right:0,overflow:"hidden"}:{}).append(f).appendTo(D),c&&d?f.width(d):c?(f.css("width","auto"),f.width()<D.clientWidth&&f.width(D.clientWidth)):u?f.width(D.clientWidth):S&&f.width(S),c){for(n=d=0;n<g.length;n++)r=s[g[n]],u=i.bBounding?v[n].getBoundingClientRect().width:a(v[n]).outerWidth(),d+=null===r.sWidthOrig?u:parseInt(r.sWidth,10)+u-a(v[n]).width();f.width(_e(d)),o.style.width=_e(d)}for(n=0;n<g.length;n++)r=s[g[n]],(i=a(v[n]).width())&&(r.sWidth=_e(i));o.style.width=_e(f.css("width")),_.remove()}S&&(o.style.width=_e(S)),!S&&!c||e._reszEvt||(o=function(){a(t).bind("resize.DT-"+e.sInstance,me(function(){h(e)}))},l?setTimeout(o,1e3):o(),e._reszEvt=!0)}function me(t,e){var a,r,i=e!==n?e:200;return function(){var e=this,o=+new Date,s=arguments;a&&a+i>o?(clearTimeout(r),r=setTimeout(function(){a=n,t.apply(e,s)},i)):(a=o,t.apply(e,s))}}function ve(t,n){if(!t)return 0;var r=a("<div/>").css("width",_e(t)).appendTo(n||e.body),i=r[0].offsetWidth;return r.remove(),i}function Se(t,e){var n=De(t,e);if(0>n)return null;var r=t.aoData[n];return r.nTr?r.anCells[e]:a("<td/>").html(y(t,n,e,"display"))[0]}function De(t,e){for(var n,a=-1,r=-1,i=0,o=t.aoData.length;o>i;i++)n=y(t,i,e,"display")+"",n=n.replace(vn,""),n.length>a&&(a=n.length,r=i);return r}function _e(t){return null===t?"0px":"number"==typeof t?0>t?"0px":t+"px":t.match(/\d$/)?t+"px":t}function ye(t){var e,r,i,o,s,l,u=[],c=t.aoColumns;e=t.aaSortingFixed,r=a.isPlainObject(e);var d=[];for(i=function(t){t.length&&!a.isArray(t[0])?d.push(t):a.merge(d,t)},a.isArray(e)&&i(e),r&&e.pre&&i(e.pre),i(t.aaSorting),r&&e.post&&i(e.post),t=0;t<d.length;t++)for(l=d[t][0],i=c[l].aDataSort,e=0,r=i.length;r>e;e++)o=i[e],s=c[o].sType||"string",d[t]._idx===n&&(d[t]._idx=a.inArray(d[t][1],c[o].asSorting)),u.push({src:l,col:o,dir:d[t][1],index:d[t]._idx,type:s,formatter:qe.ext.type.order[s+"-pre"]});return u}function Te(t){var e,n,a,r,i=[],o=qe.ext.type.order,s=t.aoData,l=0,u=t.aiDisplayMaster;for(v(t),r=ye(t),e=0,n=r.length;n>e;e++)a=r[e],a.formatter&&l++,Ae(t,a.col);if("ssp"!=Ee(t)&&0!==r.length){for(e=0,n=u.length;n>e;e++)i[u[e]]=e;u.sort(l===r.length?function(t,e){var n,a,o,l,u=r.length,c=s[t]._aSortData,d=s[e]._aSortData;for(o=0;u>o;o++)if(l=r[o],n=c[l.col],a=d[l.col],n=a>n?-1:n>a?1:0,0!==n)return"asc"===l.dir?n:-n;return n=i[t],a=i[e],a>n?-1:n>a?1:0}:function(t,e){var n,a,l,u,c=r.length,d=s[t]._aSortData,f=s[e]._aSortData;for(l=0;c>l;l++)if(u=r[l],n=d[u.col],a=f[u.col],u=o[u.type+"-"+u.dir]||o["string-"+u.dir],n=u(n,a),0!==n)return n;return n=i[t],a=i[e],a>n?-1:n>a?1:0})}t.bSorted=!0}function Ce(t){for(var e,n,a=t.aoColumns,r=ye(t),t=t.oLanguage.oAria,i=0,o=a.length;o>i;i++){n=a[i];var s=n.asSorting;e=n.sTitle.replace(/<.*?>/g,"");var l=n.nTh;l.removeAttribute("aria-sort"),n.bSortable&&(0<r.length&&r[0].col==i?(l.setAttribute("aria-sort","asc"==r[0].dir?"ascending":"descending"),n=s[r[0].index+1]||s[0]):n=s[0],e+="asc"===n?t.sSortAscending:t.sSortDescending),l.setAttribute("aria-label",e)}}function we(t,e,r,i){var o=t.aaSorting,s=t.aoColumns[e].asSorting,l=function(t,e){var r=t._idx;return r===n&&(r=a.inArray(t[1],s)),r+1<s.length?r+1:e?null:0};"number"==typeof o[0]&&(o=t.aaSorting=[o]),r&&t.oFeatures.bSortMulti?(r=a.inArray(e,ln(o,"0")),-1!==r?(e=l(o[r],!0),null===e&&1===o.length&&(e=0),null===e?o.splice(r,1):(o[r][1]=s[e],o[r]._idx=e)):(o.push([e,s[0],0]),o[o.length-1]._idx=0)):o.length&&o[0][0]==e?(e=l(o[0]),o.length=1,o[0][1]=s[e],o[0]._idx=e):(o.length=0,o.push([e,s[0]]),o[0]._idx=0),N(t),"function"==typeof i&&i(t)}function xe(t,e,n,a){var r=t.aoColumns[n];He(e,{},function(e){!1!==r.bSortable&&(t.oFeatures.bProcessing?(fe(t,!0),setTimeout(function(){we(t,n,e.shiftKey,a),"ssp"!==Ee(t)&&fe(t,!1)},0)):we(t,n,e.shiftKey,a))})}function Ie(t){var e,n,r=t.aLastSort,i=t.oClasses.sSortColumn,o=ye(t),s=t.oFeatures;if(s.bSort&&s.bSortClasses){for(s=0,e=r.length;e>s;s++)n=r[s].src,a(ln(t.aoData,"anCells",n)).removeClass(i+(2>s?s+1:3));for(s=0,e=o.length;e>s;s++)n=o[s].src,a(ln(t.aoData,"anCells",n)).addClass(i+(2>s?s+1:3))}t.aLastSort=o}function Ae(t,e){var n,a=t.aoColumns[e],r=qe.ext.order[a.sSortDataType];r&&(n=r.call(t.oInstance,t,e,g(t,e)));for(var i,o=qe.ext.type.order[a.sType+"-pre"],s=0,l=t.aoData.length;l>s;s++)a=t.aoData[s],a._aSortData||(a._aSortData=[]),(!a._aSortData[e]||r)&&(i=r?n[s]:y(t,s,e,"sort"),a._aSortData[e]=o?o(i):i)}function ke(t){if(t.oFeatures.bStateSave&&!t.bDestroying){var e={time:+new Date,start:t._iDisplayStart,length:t._iDisplayLength,order:a.extend(!0,[],t.aaSorting),search:te(t.oPreviousSearch),columns:a.map(t.aoColumns,function(e,n){return{visible:e.bVisible,search:te(t.aoPreSearchCols[n])}})};Ne(t,"aoStateSaveParams","stateSaveParams",[t,e]),t.oSavedState=e,t.fnStateSaveCallback.call(t.oInstance,t,e)}}function Fe(t){var e,r,i=t.aoColumns;if(t.oFeatures.bStateSave){var o=t.fnStateLoadCallback.call(t.oInstance,t);if(o&&o.time&&(e=Ne(t,"aoStateLoadParams","stateLoadParams",[t,o]),-1===a.inArray(!1,e)&&(e=t.iStateDuration,!(e>0&&o.time<+new Date-1e3*e)&&i.length===o.columns.length))){for(t.oLoadedState=a.extend(!0,{},o),o.start!==n&&(t._iDisplayStart=o.start,t.iInitDisplayStart=o.start),o.length!==n&&(t._iDisplayLength=o.length),o.order!==n&&(t.aaSorting=[],a.each(o.order,function(e,n){t.aaSorting.push(n[0]>=i.length?[0,n[1]]:n)})),o.search!==n&&a.extend(t.oPreviousSearch,ee(o.search)),e=0,r=o.columns.length;r>e;e++){var s=o.columns[e];s.visible!==n&&(i[e].bVisible=s.visible),s.search!==n&&a.extend(t.aoPreSearchCols[e],ee(s.search))}Ne(t,"aoStateLoaded","stateLoaded",[t,o])}}}function Re(t){var e=qe.settings,t=a.inArray(t,ln(e,"nTable"));return-1!==t?e[t]:null}function Pe(e,n,a,r){if(a="DataTables warning: "+(e?"table id="+e.sTableId+" - ":"")+a,r&&(a+=". For more information about this error, please see http://datatables.net/tn/"+r),n)t.console&&console.log&&console.log(a);else if(n=qe.ext,n=n.sErrMode||n.errMode,e&&Ne(e,null,"error",[e,r,a]),"alert"==n)alert(a);else{if("throw"==n)throw Error(a);"function"==typeof n&&n(e,r,a)}}function Le(t,e,r,i){a.isArray(r)?a.each(r,function(n,r){a.isArray(r)?Le(t,e,r[0],r[1]):Le(t,e,r)}):(i===n&&(i=r),e[r]!==n&&(t[i]=e[r]))}function je(t,e,n){var r,i;for(i in e)e.hasOwnProperty(i)&&(r=e[i],a.isPlainObject(r)?(a.isPlainObject(t[i])||(t[i]={}),a.extend(!0,t[i],r)):t[i]=n&&"data"!==i&&"aaData"!==i&&a.isArray(r)?r.slice():r);return t}function He(t,e,n){a(t).bind("click.DT",e,function(e){t.blur(),n(e)}).bind("keypress.DT",e,function(t){13===t.which&&(t.preventDefault(),n(t))}).bind("selectstart.DT",function(){return!1})}function Me(t,e,n,a){n&&t[e].push({fn:n,sName:a})}function Ne(t,e,n,r){var i=[];return e&&(i=a.map(t[e].slice().reverse(),function(e){return e.fn.apply(t.oInstance,r)})),null!==n&&(e=a.Event(n+".dt"),a(t.nTable).trigger(e,r),i.push(e.result)),i}function Oe(t){var e=t._iDisplayStart,n=t.fnDisplayEnd(),a=t._iDisplayLength;e>=n&&(e=n-a),e-=e%a,(-1===a||0>e)&&(e=0),t._iDisplayStart=e}function We(t,e){var n=t.renderer,r=qe.ext.renderer[e];return a.isPlainObject(n)&&n[e]?r[n[e]]||r._:"string"==typeof n?r[n]||r._:r._}function Ee(t){return t.oFeatures.bServerSide?"ssp":t.ajax||t.sAjaxSource?"ajax":"dom"}function Ue(t,e){var n=[],n=Hn.numbers_length,a=Math.floor(n/2);return n>=e?n=cn(0,e):a>=t?(n=cn(0,n-2),n.push("ellipsis"),n.push(e-1)):(t>=e-1-a?n=cn(e-(n-2),e):(n=cn(t-a+2,t+a-1),n.push("ellipsis"),n.push(e-1)),n.splice(0,0,"ellipsis"),n.splice(0,0,0)),n.DT_el="span",n}function Be(t){a.each({num:function(e){return Mn(e,t)},"num-fmt":function(e){return Mn(e,t,en)},"html-num":function(e){return Mn(e,t,Ye)},"html-num-fmt":function(e){return Mn(e,t,Ye,en)}},function(e,n){Ve.type.order[e+t+"-pre"]=n,e.match(/^html\-/)&&(Ve.type.search[e+t]=Ve.type.search.html)})}function Je(t){return function(){var e=[Re(this[qe.ext.iApiIndex])].concat(Array.prototype.slice.call(arguments));return qe.ext.internal[t].apply(this,e)}}var qe,Ve,Xe,Ge,ze,$e={},Qe=/[\r\n]/g,Ye=/<.*?>/g,Ze=/^[\w\+\-]/,Ke=/[\w\+\-]$/,tn=RegExp("(\\/|\\.|\\*|\\+|\\?|\\||\\(|\\)|\\[|\\]|\\{|\\}|\\\\|\\$|\\^|\\-)","g"),en=/[',$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfk]/gi,nn=function(t){return t&&!0!==t&&"-"!==t?!1:!0},an=function(t){var e=parseInt(t,10);return!isNaN(e)&&isFinite(t)?e:null},rn=function(t,e){return $e[e]||($e[e]=RegExp(Z(e),"g")),"string"==typeof t&&"."!==e?t.replace(/\./g,"").replace($e[e],"."):t},on=function(t,e,n){var a="string"==typeof t;return nn(t)?!0:(e&&a&&(t=rn(t,e)),n&&a&&(t=t.replace(en,"")),!isNaN(parseFloat(t))&&isFinite(t))},sn=function(t,e,n){return nn(t)?!0:(nn(t)||"string"==typeof t)&&on(t.replace(Ye,""),e,n)?!0:null},ln=function(t,e,a){var r=[],i=0,o=t.length;if(a!==n)for(;o>i;i++)t[i]&&t[i][e]&&r.push(t[i][e][a]);else for(;o>i;i++)t[i]&&r.push(t[i][e]);return r},un=function(t,e,a,r){var i=[],o=0,s=e.length;if(r!==n)for(;s>o;o++)t[e[o]][a]&&i.push(t[e[o]][a][r]);else for(;s>o;o++)i.push(t[e[o]][a]);return i},cn=function(t,e){var a,r=[];e===n?(e=0,a=t):(a=e,e=t);for(var i=e;a>i;i++)r.push(i);return r},dn=function(t){for(var e=[],n=0,a=t.length;a>n;n++)t[n]&&e.push(t[n]);return e},fn=function(t){var e,n,a,r=[],i=t.length,o=0;n=0;t:for(;i>n;n++){for(e=t[n],a=0;o>a;a++)if(r[a]===e)continue t;r.push(e),o++}return r},hn=function(t,e,a){t[e]!==n&&(t[a]=t[e])},pn=/\[.*?\]$/,gn=/\(\)$/,bn=a("<div>")[0],mn=bn.textContent!==n,vn=/<.*?>/g;qe=function(t){this.$=function(t,e){return this.api(!0).$(t,e)},this._=function(t,e){return this.api(!0).rows(t,e).data()},this.api=function(t){return new Xe(t?Re(this[Ve.iApiIndex]):this)},this.fnAddData=function(t,e){var r=this.api(!0),i=a.isArray(t)&&(a.isArray(t[0])||a.isPlainObject(t[0]))?r.rows.add(t):r.row.add(t);return(e===n||e)&&r.draw(),i.flatten().toArray()},this.fnAdjustColumnSizing=function(t){var e=this.api(!0).columns.adjust(),a=e.settings()[0],r=a.oScroll;t===n||t?e.draw(!1):(""!==r.sX||""!==r.sY)&&pe(a)},this.fnClearTable=function(t){var e=this.api(!0).clear();(t===n||t)&&e.draw()},this.fnClose=function(t){this.api(!0).row(t).child.hide()},this.fnDeleteRow=function(t,e,a){var r=this.api(!0),t=r.rows(t),i=t.settings()[0],o=i.aoData[t[0][0]];return t.remove(),e&&e.call(this,i,o),(a===n||a)&&r.draw(),o},this.fnDestroy=function(t){this.api(!0).destroy(t)},this.fnDraw=function(t){this.api(!0).draw(t)},this.fnFilter=function(t,e,a,r,i,o){i=this.api(!0),null===e||e===n?i.search(t,a,r,o):i.column(e).search(t,a,r,o),i.draw()},this.fnGetData=function(t,e){var a=this.api(!0);if(t!==n){var r=t.nodeName?t.nodeName.toLowerCase():"";return e!==n||"td"==r||"th"==r?a.cell(t,e).data():a.row(t).data()||null}return a.data().toArray()},this.fnGetNodes=function(t){var e=this.api(!0);return t!==n?e.row(t).node():e.rows().nodes().flatten().toArray()},this.fnGetPosition=function(t){var e=this.api(!0),n=t.nodeName.toUpperCase();return"TR"==n?e.row(t).index():"TD"==n||"TH"==n?(t=e.cell(t).index(),[t.row,t.columnVisible,t.column]):null},this.fnIsOpen=function(t){return this.api(!0).row(t).child.isShown()},this.fnOpen=function(t,e,n){return this.api(!0).row(t).child(e,n).show().child()[0]},this.fnPageChange=function(t,e){var a=this.api(!0).page(t);(e===n||e)&&a.draw(!1)},this.fnSetColumnVis=function(t,e,a){t=this.api(!0).column(t).visible(e),(a===n||a)&&t.columns.adjust().draw()},this.fnSettings=function(){return Re(this[Ve.iApiIndex])},this.fnSort=function(t){this.api(!0).order(t).draw()},this.fnSortListener=function(t,e,n){this.api(!0).order.listener(t,e,n)},this.fnUpdate=function(t,e,a,r,i){var o=this.api(!0);return a===n||null===a?o.row(e).data(t):o.cell(e,a).data(t),(i===n||i)&&o.columns.adjust(),(r===n||r)&&o.draw(),0},this.fnVersionCheck=Ve.fnVersionCheck;var e=this,r=t===n,c=this.length;r&&(t={}),this.oApi=this.internal=Ve.internal;for(var h in qe.ext.internal)h&&(this[h]=Je(h));return this.each(function(){var h,p={},p=c>1?je(p,t,!0):t,g=0,b=this.getAttribute("id"),m=!1,v=qe.defaults,y=a(this);if("table"!=this.nodeName.toLowerCase())Pe(null,0,"Non-table node initialisation ("+this.nodeName+")",2);else{s(v),l(v.column),i(v,v,!0),i(v.column,v.column,!0),i(v,a.extend(p,y.data()));var T=qe.settings,g=0;for(h=T.length;h>g;g++){var C=T[g];if(C.nTable==this||C.nTHead.parentNode==this||C.nTFoot&&C.nTFoot.parentNode==this){if(g=p.bRetrieve!==n?p.bRetrieve:v.bRetrieve,r||g)return C.oInstance;if(p.bDestroy!==n?p.bDestroy:v.bDestroy){C.oInstance.fnDestroy();break}return void Pe(C,0,"Cannot reinitialise DataTable",3)}if(C.sTableId==this.id){T.splice(g,1);break}}(null===b||""===b)&&(this.id=b="DataTables_Table_"+qe.ext._unique++);var x=a.extend(!0,{},qe.models.oSettings,{sDestroyWidth:y[0].style.width,sInstance:b,sTableId:b});x.nTable=this,x.oApi=e.internal,x.oInit=p,T.push(x),x.oInstance=1===e.length?e:y.dataTable(),s(p),p.oLanguage&&o(p.oLanguage),p.aLengthMenu&&!p.iDisplayLength&&(p.iDisplayLength=a.isArray(p.aLengthMenu[0])?p.aLengthMenu[0][0]:p.aLengthMenu[0]),p=je(a.extend(!0,{},v),p),Le(x.oFeatures,p,"bPaginate bLengthChange bFilter bSort bSortMulti bInfo bProcessing bAutoWidth bSortClasses bServerSide bDeferRender".split(" ")),Le(x,p,["asStripeClasses","ajax","fnServerData","fnFormatNumber","sServerMethod","aaSorting","aaSortingFixed","aLengthMenu","sPaginationType","sAjaxSource","sAjaxDataProp","iStateDuration","sDom","bSortCellsTop","iTabIndex","fnStateLoadCallback","fnStateSaveCallback","renderer","searchDelay","rowId",["iCookieDuration","iStateDuration"],["oSearch","oPreviousSearch"],["aoSearchCols","aoPreSearchCols"],["iDisplayLength","_iDisplayLength"],["bJQueryUI","bJUI"]]),Le(x.oScroll,p,[["sScrollX","sX"],["sScrollXInner","sXInner"],["sScrollY","sY"],["bScrollCollapse","bCollapse"]]),Le(x.oLanguage,p,"fnInfoCallback"),Me(x,"aoDrawCallback",p.fnDrawCallback,"user"),Me(x,"aoServerParams",p.fnServerParams,"user"),Me(x,"aoStateSaveParams",p.fnStateSaveParams,"user"),Me(x,"aoStateLoadParams",p.fnStateLoadParams,"user"),Me(x,"aoStateLoaded",p.fnStateLoaded,"user"),Me(x,"aoRowCallback",p.fnRowCallback,"user"),Me(x,"aoRowCreatedCallback",p.fnCreatedRow,"user"),Me(x,"aoHeaderCallback",p.fnHeaderCallback,"user"),Me(x,"aoFooterCallback",p.fnFooterCallback,"user"),Me(x,"aoInitComplete",p.fnInitComplete,"user"),Me(x,"aoPreDrawCallback",p.fnPreDrawCallback,"user"),x.rowIdFn=w(p.rowId),u(x),b=x.oClasses,p.bJQueryUI?(a.extend(b,qe.ext.oJUIClasses,p.oClasses),p.sDom===v.sDom&&"lfrtip"===v.sDom&&(x.sDom='<"H"lfr>t<"F"ip>'),x.renderer?a.isPlainObject(x.renderer)&&!x.renderer.header&&(x.renderer.header="jqueryui"):x.renderer="jqueryui"):a.extend(b,qe.ext.classes,p.oClasses),y.addClass(b.sTable),x.iInitDisplayStart===n&&(x.iInitDisplayStart=p.iDisplayStart,x._iDisplayStart=p.iDisplayStart),null!==p.iDeferLoading&&(x.bDeferLoading=!0,g=a.isArray(p.iDeferLoading),x._iRecordsDisplay=g?p.iDeferLoading[0]:p.iDeferLoading,x._iRecordsTotal=g?p.iDeferLoading[1]:p.iDeferLoading);var I=x.oLanguage;a.extend(!0,I,p.oLanguage),""!==I.sUrl&&(a.ajax({dataType:"json",url:I.sUrl,success:function(t){o(t),i(v.oLanguage,t),a.extend(!0,I,t),ie(x)},error:function(){ie(x)}}),m=!0),null===p.asStripeClasses&&(x.asStripeClasses=[b.sStripeOdd,b.sStripeEven]);var g=x.asStripeClasses,A=y.children("tbody").find("tr").eq(0);if(-1!==a.inArray(!0,a.map(g,function(t){return A.hasClass(t)}))&&(a("tbody tr",this).removeClass(g.join(" ")),x.asDestroyStripes=g.slice()),T=[],g=this.getElementsByTagName("thead"),0!==g.length&&(W(x.aoHeader,g[0]),T=E(x)),null===p.aoColumns)for(C=[],g=0,h=T.length;h>g;g++)C.push(null);else C=p.aoColumns;for(g=0,h=C.length;h>g;g++)d(x,T?T[g]:null);if(S(x,p.aoColumnDefs,C,function(t,e){f(x,t,e)}),A.length){var k=function(t,e){return null!==t.getAttribute("data-"+e)?e:null};a(A[0]).children("th, td").each(function(t,e){var a=x.aoColumns[t];if(a.mData===t){var r=k(e,"sort")||k(e,"order"),i=k(e,"filter")||k(e,"search");(null!==r||null!==i)&&(a.mData={_:t+".display",sort:null!==r?t+".@data-"+r:n,type:null!==r?t+".@data-"+r:n,filter:null!==i?t+".@data-"+i:n},f(x,t))}})}var F=x.oFeatures;if(p.bStateSave&&(F.bStateSave=!0,Fe(x,p),Me(x,"aoDrawCallback",ke,"state_save")),p.aaSorting===n)for(T=x.aaSorting,g=0,h=T.length;h>g;g++)T[g][1]=x.aoColumns[g].asSorting[0];if(Ie(x),F.bSort&&Me(x,"aoDrawCallback",function(){if(x.bSorted){var t=ye(x),e={};a.each(t,function(t,n){e[n.src]=n.dir}),Ne(x,null,"order",[x,t,e]),Ce(x)}}),Me(x,"aoDrawCallback",function(){(x.bSorted||"ssp"===Ee(x)||F.bDeferRender)&&Ie(x)},"sc"),g=y.children("caption").each(function(){this._captionSide=y.css("caption-side")}),h=y.children("thead"),0===h.length&&(h=a("<thead/>").appendTo(this)),x.nTHead=h[0],h=y.children("tbody"),0===h.length&&(h=a("<tbody/>").appendTo(this)),x.nTBody=h[0],h=y.children("tfoot"),0===h.length&&0<g.length&&(""!==x.oScroll.sX||""!==x.oScroll.sY)&&(h=a("<tfoot/>").appendTo(this)),0===h.length||0===h.children().length?y.addClass(b.sNoFooter):0<h.length&&(x.nTFoot=h[0],W(x.aoFooter,x.nTFoot)),p.aaData)for(g=0;g<p.aaData.length;g++)D(x,p.aaData[g]);else(x.bDeferLoading||"dom"==Ee(x))&&_(x,a(x.nTBody).children("tr"));x.aiDisplay=x.aiDisplayMaster.slice(),x.bInitialised=!0,!1===m&&ie(x)}}),e=null,this};var Sn=[],Dn=Array.prototype,_n=function(t){var e,n,r=qe.settings,i=a.map(r,function(t){return t.nTable});return t?t.nTable&&t.oApi?[t]:t.nodeName&&"table"===t.nodeName.toLowerCase()?(e=a.inArray(t,i),-1!==e?[r[e]]:null):t&&"function"==typeof t.settings?t.settings().toArray():("string"==typeof t?n=a(t):t instanceof a&&(n=t),n?n.map(function(){return e=a.inArray(this,i),-1!==e?r[e]:null}).toArray():void 0):[]};Xe=function(t,e){if(!(this instanceof Xe))return new Xe(t,e);var n=[],r=function(t){(t=_n(t))&&(n=n.concat(t))};if(a.isArray(t))for(var i=0,o=t.length;o>i;i++)r(t[i]);else r(t);this.context=fn(n),e&&a.merge(this,e),this.selector={rows:null,cols:null,opts:null},Xe.extend(this,this,Sn)},qe.Api=Xe,a.extend(Xe.prototype,{any:function(){return 0!==this.count()},concat:Dn.concat,context:[],count:function(){return this.flatten().length},each:function(t){for(var e=0,n=this.length;n>e;e++)t.call(this,this[e],e,this);return this},eq:function(t){var e=this.context;return e.length>t?new Xe(e[t],this[t]):null},filter:function(t){var e=[];if(Dn.filter)e=Dn.filter.call(this,t,this);else for(var n=0,a=this.length;a>n;n++)t.call(this,this[n],n,this)&&e.push(this[n]);return new Xe(this.context,e)},flatten:function(){var t=[];return new Xe(this.context,t.concat.apply(t,this.toArray()))},join:Dn.join,indexOf:Dn.indexOf||function(t,e){for(var n=e||0,a=this.length;a>n;n++)if(this[n]===t)return n;return-1},iterator:function(t,e,a,r){var i,o,s,l,u,c,d,f=[],h=this.context,p=this.selector;for("string"==typeof t&&(r=a,a=e,e=t,t=!1),o=0,s=h.length;s>o;o++){var g=new Xe(h[o]);if("table"===e)i=a.call(g,h[o],o),i!==n&&f.push(i);else if("columns"===e||"rows"===e)i=a.call(g,h[o],this[o],o),i!==n&&f.push(i);else if("column"===e||"column-rows"===e||"row"===e||"cell"===e)for(d=this[o],"column-rows"===e&&(c=xn(h[o],p.opts)),l=0,u=d.length;u>l;l++)i=d[l],i="cell"===e?a.call(g,h[o],i.row,i.column,o,l):a.call(g,h[o],i,o,l,c),i!==n&&f.push(i)}return f.length||r?(t=new Xe(h,t?f.concat.apply([],f):f),e=t.selector,e.rows=p.rows,e.cols=p.cols,e.opts=p.opts,t):this},lastIndexOf:Dn.lastIndexOf||function(){return this.indexOf.apply(this.toArray.reverse(),arguments)},length:0,map:function(t){var e=[];if(Dn.map)e=Dn.map.call(this,t,this);else for(var n=0,a=this.length;a>n;n++)e.push(t.call(this,this[n],n));return new Xe(this.context,e)},pluck:function(t){return this.map(function(e){return e[t]})},pop:Dn.pop,push:Dn.push,reduce:Dn.reduce||function(t,e){return c(this,t,e,0,this.length,1)},reduceRight:Dn.reduceRight||function(t,e){return c(this,t,e,this.length-1,-1,-1)},reverse:Dn.reverse,selector:null,shift:Dn.shift,sort:Dn.sort,splice:Dn.splice,toArray:function(){return Dn.slice.call(this)},to$:function(){return a(this)},toJQuery:function(){return a(this)},unique:function(){return new Xe(this.context,fn(this))},unshift:Dn.unshift}),Xe.extend=function(t,e,n){if(n.length&&e&&(e instanceof Xe||e.__dt_wrapper)){var r,i,o,s=function(t,e,n){return function(){var a=e.apply(t,arguments);
return Xe.extend(a,a,n.methodExt),a}};for(r=0,i=n.length;i>r;r++)o=n[r],e[o.name]="function"==typeof o.val?s(t,o.val,o):a.isPlainObject(o.val)?{}:o.val,e[o.name].__dt_wrapper=!0,Xe.extend(t,e[o.name],o.propExt)}},Xe.register=Ge=function(t,e){if(a.isArray(t))for(var n=0,r=t.length;r>n;n++)Xe.register(t[n],e);else for(var i,o,s=t.split("."),l=Sn,n=0,r=s.length;r>n;n++){i=(o=-1!==s[n].indexOf("()"))?s[n].replace("()",""):s[n];var u;t:{u=0;for(var c=l.length;c>u;u++)if(l[u].name===i){u=l[u];break t}u=null}u||(u={name:i,val:{},methodExt:[],propExt:[]},l.push(u)),n===r-1?u.val=e:l=o?u.methodExt:u.propExt}},Xe.registerPlural=ze=function(t,e,r){Xe.register(t,r),Xe.register(e,function(){var t=r.apply(this,arguments);return t===this?this:t instanceof Xe?t.length?a.isArray(t[0])?new Xe(t.context,t[0]):t[0]:n:t})},Ge("tables()",function(t){var e;if(t){e=Xe;var n=this.context;if("number"==typeof t)t=[n[t]];else var r=a.map(n,function(t){return t.nTable}),t=a(r).filter(t).map(function(){var t=a.inArray(this,r);return n[t]}).toArray();e=new e(t)}else e=this;return e}),Ge("table()",function(t){var t=this.tables(t),e=t.context;return e.length?new Xe(e[0]):t}),ze("tables().nodes()","table().node()",function(){return this.iterator("table",function(t){return t.nTable},1)}),ze("tables().body()","table().body()",function(){return this.iterator("table",function(t){return t.nTBody},1)}),ze("tables().header()","table().header()",function(){return this.iterator("table",function(t){return t.nTHead},1)}),ze("tables().footer()","table().footer()",function(){return this.iterator("table",function(t){return t.nTFoot},1)}),ze("tables().containers()","table().container()",function(){return this.iterator("table",function(t){return t.nTableWrapper},1)}),Ge("draw()",function(t){return this.iterator("table",function(e){"page"===t?M(e):("string"==typeof t&&(t="full-hold"===t?!1:!0),N(e,!1===t))})}),Ge("page()",function(t){return t===n?this.page.info().page:this.iterator("table",function(e){ce(e,t)})}),Ge("page.info()",function(){if(0===this.context.length)return n;var t=this.context[0],e=t._iDisplayStart,a=t._iDisplayLength,r=t.fnRecordsDisplay(),i=-1===a;return{page:i?0:Math.floor(e/a),pages:i?1:Math.ceil(r/a),start:e,end:t.fnDisplayEnd(),length:a,recordsTotal:t.fnRecordsTotal(),recordsDisplay:r,serverSide:"ssp"===Ee(t)}}),Ge("page.len()",function(t){return t===n?0!==this.context.length?this.context[0]._iDisplayLength:n:this.iterator("table",function(e){se(e,t)})});var yn=function(t,e,n){if(n){var a=new Xe(t);a.one("draw",function(){n(a.ajax.json())})}if("ssp"==Ee(t))N(t,e);else{fe(t,!0);var r=t.jqXHR;r&&4!==r.readyState&&r.abort(),U(t,[],function(n){A(t);for(var n=V(t,n),a=0,r=n.length;r>a;a++)D(t,n[a]);N(t,e),fe(t,!1)})}};Ge("ajax.json()",function(){var t=this.context;return 0<t.length?t[0].json:void 0}),Ge("ajax.params()",function(){var t=this.context;return 0<t.length?t[0].oAjaxData:void 0}),Ge("ajax.reload()",function(t,e){return this.iterator("table",function(n){yn(n,!1===e,t)})}),Ge("ajax.url()",function(t){var e=this.context;return t===n?0===e.length?n:(e=e[0],e.ajax?a.isPlainObject(e.ajax)?e.ajax.url:e.ajax:e.sAjaxSource):this.iterator("table",function(e){a.isPlainObject(e.ajax)?e.ajax.url=t:e.ajax=t})}),Ge("ajax.url().load()",function(t,e){return this.iterator("table",function(n){yn(n,!1===e,t)})});var Tn=function(t,e,r,i,o){var s,l,u,c,d,f,h=[];for(u=typeof e,e&&"string"!==u&&"function"!==u&&e.length!==n||(e=[e]),u=0,c=e.length;c>u;u++)for(l=e[u]&&e[u].split?e[u].split(","):[e[u]],d=0,f=l.length;f>d;d++)(s=r("string"==typeof l[d]?a.trim(l[d]):l[d]))&&s.length&&(h=h.concat(s));if(t=Ve.selector[t],t.length)for(u=0,c=t.length;c>u;u++)h=t[u](i,o,h);return fn(h)},Cn=function(t){return t||(t={}),t.filter&&t.search===n&&(t.search=t.filter),a.extend({search:"none",order:"current",page:"all"},t)},wn=function(t){for(var e=0,n=t.length;n>e;e++)if(0<t[e].length)return t[0]=t[e],t[0].length=1,t.length=1,t.context=[t.context[e]],t;return t.length=0,t},xn=function(t,e){var n,r,i,o=[],s=t.aiDisplay;n=t.aiDisplayMaster;var l=e.search;if(r=e.order,i=e.page,"ssp"==Ee(t))return"removed"===l?[]:cn(0,n.length);if("current"==i)for(n=t._iDisplayStart,r=t.fnDisplayEnd();r>n;n++)o.push(s[n]);else if("current"==r||"applied"==r)o="none"==l?n.slice():"applied"==l?s.slice():a.map(n,function(t){return-1===a.inArray(t,s)?t:null});else if("index"==r||"original"==r)for(n=0,r=t.aoData.length;r>n;n++)"none"==l?o.push(n):(i=a.inArray(n,s),(-1===i&&"removed"==l||i>=0&&"applied"==l)&&o.push(n));return o};Ge("rows()",function(t,e){t===n?t="":a.isPlainObject(t)&&(e=t,t="");var e=Cn(e),r=this.iterator("table",function(r){var i=e;return Tn("row",t,function(t){var e=an(t);if(null!==e&&!i)return[e];var o=xn(r,i);return null!==e&&-1!==a.inArray(e,o)?[e]:t?"function"==typeof t?a.map(o,function(e){var n=r.aoData[e];return t(e,n._aData,n.nTr)?e:null}):(e=dn(un(r.aoData,o,"nTr")),t.nodeName&&-1!==a.inArray(t,e)?[t._DT_RowIndex]:"string"==typeof t&&"#"===t.charAt(0)&&(o=r.aIds[t.replace(/^#/,"")],o!==n)?[o.idx]:a(e).filter(t).map(function(){return this._DT_RowIndex}).toArray()):o},r,i)},1);return r.selector.rows=t,r.selector.opts=e,r}),Ge("rows().nodes()",function(){return this.iterator("row",function(t,e){return t.aoData[e].nTr||n},1)}),Ge("rows().data()",function(){return this.iterator(!0,"rows",function(t,e){return un(t.aoData,e,"_aData")},1)}),ze("rows().cache()","row().cache()",function(t){return this.iterator("row",function(e,n){var a=e.aoData[n];return"search"===t?a._aFilterData:a._aSortData},1)}),ze("rows().invalidate()","row().invalidate()",function(t){return this.iterator("row",function(e,n){F(e,n,t)})}),ze("rows().indexes()","row().index()",function(){return this.iterator("row",function(t,e){return e},1)}),ze("rows().ids()","row().id()",function(t){for(var e=[],n=this.context,a=0,r=n.length;r>a;a++)for(var i=0,o=this[a].length;o>i;i++){var s=n[a].rowIdFn(n[a].aoData[this[a][i]]._aData);e.push((!0===t?"#":"")+s)}return new Xe(n,e)}),ze("rows().remove()","row().remove()",function(){var t=this;return this.iterator("row",function(e,a,r){var i=e.aoData,o=i[a];i.splice(a,1);for(var s=0,l=i.length;l>s;s++)null!==i[s].nTr&&(i[s].nTr._DT_RowIndex=s);k(e.aiDisplayMaster,a),k(e.aiDisplay,a),k(t[r],a,!1),Oe(e),a=e.rowIdFn(o._aData),a!==n&&delete e.aIds[a]}),this.iterator("table",function(t){for(var e=0,n=t.aoData.length;n>e;e++)t.aoData[e].idx=e}),this}),Ge("rows.add()",function(t){var e=this.iterator("table",function(e){var n,a,r,i=[];for(a=0,r=t.length;r>a;a++)n=t[a],i.push(n.nodeName&&"TR"===n.nodeName.toUpperCase()?_(e,n)[0]:D(e,n));return i},1),n=this.rows(-1);return n.pop(),a.merge(n,e),n}),Ge("row()",function(t,e){return wn(this.rows(t,e))}),Ge("row().data()",function(t){var e=this.context;return t===n?e.length&&this.length?e[0].aoData[this[0]]._aData:n:(e[0].aoData[this[0]]._aData=t,F(e[0],this[0],"data"),this)}),Ge("row().node()",function(){var t=this.context;return t.length&&this.length?t[0].aoData[this[0]].nTr||null:null}),Ge("row.add()",function(t){t instanceof a&&t.length&&(t=t[0]);var e=this.iterator("table",function(e){return t.nodeName&&"TR"===t.nodeName.toUpperCase()?_(e,t)[0]:D(e,t)});return this.row(e[0])});var In=function(t,e){var a=t.context;a.length&&(a=a[0].aoData[e!==n?e:t[0]])&&a._details&&(a._details.remove(),a._detailsShow=n,a._details=n)},An=function(t,e){var n=t.context;if(n.length&&t.length){var a=n[0].aoData[t[0]];if(a._details){(a._detailsShow=e)?a._details.insertAfter(a.nTr):a._details.detach();var r=n[0],i=new Xe(r),o=r.aoData;i.off("draw.dt.DT_details column-visibility.dt.DT_details destroy.dt.DT_details"),0<ln(o,"_details").length&&(i.on("draw.dt.DT_details",function(t,e){r===e&&i.rows({page:"current"}).eq(0).each(function(t){t=o[t],t._detailsShow&&t._details.insertAfter(t.nTr)})}),i.on("column-visibility.dt.DT_details",function(t,e){if(r===e)for(var n,a=b(e),i=0,s=o.length;s>i;i++)n=o[i],n._details&&n._details.children("td[colspan]").attr("colspan",a)}),i.on("destroy.dt.DT_details",function(t,e){if(r===e)for(var n=0,a=o.length;a>n;n++)o[n]._details&&In(i,n)}))}}};Ge("row().child()",function(t,e){var r=this.context;if(t===n)return r.length&&this.length?r[0].aoData[this[0]]._details:n;if(!0===t)this.child.show();else if(!1===t)In(this);else if(r.length&&this.length){var i=r[0],r=r[0].aoData[this[0]],o=[],s=function(t,e){if(a.isArray(t)||t instanceof a)for(var n=0,r=t.length;r>n;n++)s(t[n],e);else t.nodeName&&"tr"===t.nodeName.toLowerCase()?o.push(t):(n=a("<tr><td/></tr>").addClass(e),a("td",n).addClass(e).html(t)[0].colSpan=b(i),o.push(n[0]))};s(t,e),r._details&&r._details.remove(),r._details=a(o),r._detailsShow&&r._details.insertAfter(r.nTr)}return this}),Ge(["row().child.show()","row().child().show()"],function(){return An(this,!0),this}),Ge(["row().child.hide()","row().child().hide()"],function(){return An(this,!1),this}),Ge(["row().child.remove()","row().child().remove()"],function(){return In(this),this}),Ge("row().child.isShown()",function(){var t=this.context;return t.length&&this.length?t[0].aoData[this[0]]._detailsShow||!1:!1});var kn=/^(.+):(name|visIdx|visible)$/,Fn=function(t,e,n,a,r){for(var n=[],a=0,i=r.length;i>a;a++)n.push(y(t,r[a],e));return n};Ge("columns()",function(t,e){t===n?t="":a.isPlainObject(t)&&(e=t,t="");var e=Cn(e),r=this.iterator("table",function(n){var r=t,i=e,o=n.aoColumns,s=ln(o,"sName"),l=ln(o,"nTh");return Tn("column",r,function(t){var e=an(t);if(""===t)return cn(o.length);if(null!==e)return[e>=0?e:o.length+e];if("function"==typeof t){var r=xn(n,i);return a.map(o,function(e,a){return t(a,Fn(n,a,0,0,r),l[a])?a:null})}var u="string"==typeof t?t.match(kn):"";if(!u)return a(l).filter(t).map(function(){return a.inArray(this,l)}).toArray();switch(u[2]){case"visIdx":case"visible":if(e=parseInt(u[1],10),0>e){var c=a.map(o,function(t,e){return t.bVisible?e:null});return[c[c.length+e]]}return[p(n,e)];case"name":return a.map(s,function(t,e){return t===u[1]?e:null})}},n,i)},1);return r.selector.cols=t,r.selector.opts=e,r}),ze("columns().header()","column().header()",function(){return this.iterator("column",function(t,e){return t.aoColumns[e].nTh},1)}),ze("columns().footer()","column().footer()",function(){return this.iterator("column",function(t,e){return t.aoColumns[e].nTf},1)}),ze("columns().data()","column().data()",function(){return this.iterator("column-rows",Fn,1)}),ze("columns().dataSrc()","column().dataSrc()",function(){return this.iterator("column",function(t,e){return t.aoColumns[e].mData},1)}),ze("columns().cache()","column().cache()",function(t){return this.iterator("column-rows",function(e,n,a,r,i){return un(e.aoData,i,"search"===t?"_aFilterData":"_aSortData",n)},1)}),ze("columns().nodes()","column().nodes()",function(){return this.iterator("column-rows",function(t,e,n,a,r){return un(t.aoData,r,"anCells",e)},1)}),ze("columns().visible()","column().visible()",function(t,e){return this.iterator("column",function(r,i){if(t===n)return r.aoColumns[i].bVisible;var o,s,l,u=r.aoColumns,c=u[i],d=r.aoData;if(t!==n&&c.bVisible!==t){if(t){var f=a.inArray(!0,ln(u,"bVisible"),i+1);for(o=0,s=d.length;s>o;o++)l=d[o].nTr,u=d[o].anCells,l&&l.insertBefore(u[i],u[f]||null)}else a(ln(r.aoData,"anCells",i)).detach();c.bVisible=t,H(r,r.aoHeader),H(r,r.aoFooter),(e===n||e)&&(h(r),(r.oScroll.sX||r.oScroll.sY)&&pe(r)),Ne(r,null,"column-visibility",[r,i,t]),ke(r)}})}),ze("columns().indexes()","column().index()",function(t){return this.iterator("column",function(e,n){return"visible"===t?g(e,n):n},1)}),Ge("columns.adjust()",function(){return this.iterator("table",function(t){h(t)},1)}),Ge("column.index()",function(t,e){if(0!==this.context.length){var n=this.context[0];if("fromVisible"===t||"toData"===t)return p(n,e);if("fromData"===t||"toVisible"===t)return g(n,e)}}),Ge("column()",function(t,e){return wn(this.columns(t,e))}),Ge("cells()",function(t,e,r){if(a.isPlainObject(t)&&(t.row===n?(r=t,t=null):(r=e,e=null)),a.isPlainObject(e)&&(r=e,e=null),null===e||e===n)return this.iterator("table",function(e){var i,o,s,l,u,c,d,f=t,h=Cn(r),p=e.aoData,g=xn(e,h),b=dn(un(p,g,"anCells")),m=a([].concat.apply([],b)),v=e.aoColumns.length;return Tn("cell",f,function(t){var r="function"==typeof t;if(null===t||t===n||r){for(o=[],s=0,l=g.length;l>s;s++)for(i=g[s],u=0;v>u;u++)c={row:i,column:u},r?(d=p[i],t(c,y(e,i,u),d.anCells?d.anCells[u]:null)&&o.push(c)):o.push(c);return o}return a.isPlainObject(t)?[t]:m.filter(t).map(function(t,e){if(e.parentNode)i=e.parentNode._DT_RowIndex;else for(t=0,l=p.length;l>t;t++)if(-1!==a.inArray(e,p[t].anCells)){i=t;break}return{row:i,column:a.inArray(e,p[i].anCells)}}).toArray()},e,h)});var i,o,s,l,u,c=this.columns(e,r),d=this.rows(t,r),f=this.iterator("table",function(t,e){for(i=[],o=0,s=d[e].length;s>o;o++)for(l=0,u=c[e].length;u>l;l++)i.push({row:d[e][o],column:c[e][l]});return i},1);return a.extend(f.selector,{cols:e,rows:t,opts:r}),f}),ze("cells().nodes()","cell().node()",function(){return this.iterator("cell",function(t,e,a){return(t=t.aoData[e].anCells)?t[a]:n},1)}),Ge("cells().data()",function(){return this.iterator("cell",function(t,e,n){return y(t,e,n)},1)}),ze("cells().cache()","cell().cache()",function(t){return t="search"===t?"_aFilterData":"_aSortData",this.iterator("cell",function(e,n,a){return e.aoData[n][t][a]},1)}),ze("cells().render()","cell().render()",function(t){return this.iterator("cell",function(e,n,a){return y(e,n,a,t)},1)}),ze("cells().indexes()","cell().index()",function(){return this.iterator("cell",function(t,e,n){return{row:e,column:n,columnVisible:g(t,n)}},1)}),ze("cells().invalidate()","cell().invalidate()",function(t){return this.iterator("cell",function(e,n,a){F(e,n,t,a)})}),Ge("cell()",function(t,e,n){return wn(this.cells(t,e,n))}),Ge("cell().data()",function(t){var e=this.context,a=this[0];return t===n?e.length&&a.length?y(e[0],a[0].row,a[0].column):n:(T(e[0],a[0].row,a[0].column,t),F(e[0],a[0].row,"data",a[0].column),this)}),Ge("order()",function(t,e){var r=this.context;return t===n?0!==r.length?r[0].aaSorting:n:("number"==typeof t?t=[[t,e]]:a.isArray(t[0])||(t=Array.prototype.slice.call(arguments)),this.iterator("table",function(e){e.aaSorting=t.slice()}))}),Ge("order.listener()",function(t,e,n){return this.iterator("table",function(a){xe(a,t,e,n)})}),Ge(["columns().order()","column().order()"],function(t){var e=this;return this.iterator("table",function(n,r){var i=[];a.each(e[r],function(e,n){i.push([n,t])}),n.aaSorting=i})}),Ge("search()",function(t,e,r,i){var o=this.context;return t===n?0!==o.length?o[0].oPreviousSearch.sSearch:n:this.iterator("table",function(n){n.oFeatures.bFilter&&G(n,a.extend({},n.oPreviousSearch,{sSearch:t+"",bRegex:null===e?!1:e,bSmart:null===r?!0:r,bCaseInsensitive:null===i?!0:i}),1)})}),ze("columns().search()","column().search()",function(t,e,r,i){return this.iterator("column",function(o,s){var l=o.aoPreSearchCols;return t===n?l[s].sSearch:void(o.oFeatures.bFilter&&(a.extend(l[s],{sSearch:t+"",bRegex:null===e?!1:e,bSmart:null===r?!0:r,bCaseInsensitive:null===i?!0:i}),G(o,o.oPreviousSearch,1)))})}),Ge("state()",function(){return this.context.length?this.context[0].oSavedState:null}),Ge("state.clear()",function(){return this.iterator("table",function(t){t.fnStateSaveCallback.call(t.oInstance,t,{})})}),Ge("state.loaded()",function(){return this.context.length?this.context[0].oLoadedState:null}),Ge("state.save()",function(){return this.iterator("table",function(t){ke(t)})}),qe.versionCheck=qe.fnVersionCheck=function(t){for(var e,n,a=qe.version.split("."),t=t.split("."),r=0,i=t.length;i>r;r++)if(e=parseInt(a[r],10)||0,n=parseInt(t[r],10)||0,e!==n)return e>n;return!0},qe.isDataTable=qe.fnIsDataTable=function(t){var e=a(t).get(0),n=!1;return a.each(qe.settings,function(t,r){var i=r.nScrollHead?a("table",r.nScrollHead)[0]:null,o=r.nScrollFoot?a("table",r.nScrollFoot)[0]:null;(r.nTable===e||i===e||o===e)&&(n=!0)}),n},qe.tables=qe.fnTables=function(t){var e=!1;a.isPlainObject(t)&&(e=t.api,t=t.visible);var n=a.map(qe.settings,function(e){return!t||t&&a(e.nTable).is(":visible")?e.nTable:void 0});return e?new Xe(n):n},qe.util={throttle:me,escapeRegex:Z},qe.camelToHungarian=i,Ge("$()",function(t,e){var n=this.rows(e).nodes(),n=a(n);return a([].concat(n.filter(t).toArray(),n.find(t).toArray()))}),a.each(["on","one","off"],function(t,e){Ge(e+"()",function(){var t=Array.prototype.slice.call(arguments);t[0].match(/\.dt\b/)||(t[0]+=".dt");var n=a(this.tables().nodes());return n[e].apply(n,t),this})}),Ge("clear()",function(){return this.iterator("table",function(t){A(t)})}),Ge("settings()",function(){return new Xe(this.context,this.context)}),Ge("init()",function(){var t=this.context;return t.length?t[0].oInit:null}),Ge("data()",function(){return this.iterator("table",function(t){return ln(t.aoData,"_aData")}).flatten()}),Ge("destroy()",function(e){return e=e||!1,this.iterator("table",function(n){var r,i=n.nTableWrapper.parentNode,o=n.oClasses,s=n.nTable,l=n.nTBody,u=n.nTHead,c=n.nTFoot,d=a(s),l=a(l),f=a(n.nTableWrapper),h=a.map(n.aoData,function(t){return t.nTr});n.bDestroying=!0,Ne(n,"aoDestroyCallback","destroy",[n]),e||new Xe(n).columns().visible(!0),f.unbind(".DT").find(":not(tbody *)").unbind(".DT"),a(t).unbind(".DT-"+n.sInstance),s!=u.parentNode&&(d.children("thead").detach(),d.append(u)),c&&s!=c.parentNode&&(d.children("tfoot").detach(),d.append(c)),n.aaSorting=[],n.aaSortingFixed=[],Ie(n),a(h).removeClass(n.asStripeClasses.join(" ")),a("th, td",u).removeClass(o.sSortable+" "+o.sSortableAsc+" "+o.sSortableDesc+" "+o.sSortableNone),n.bJUI&&(a("th span."+o.sSortIcon+", td span."+o.sSortIcon,u).detach(),a("th, td",u).each(function(){var t=a("div."+o.sSortJUIWrapper,this);a(this).append(t.contents()),t.detach()})),l.children().detach(),l.append(h),u=e?"remove":"detach",d[u](),f[u](),!e&&i&&(i.insertBefore(s,n.nTableReinsertBefore),d.css("width",n.sDestroyWidth).removeClass(o.sTable),(r=n.asDestroyStripes.length)&&l.children().each(function(t){a(this).addClass(n.asDestroyStripes[t%r])})),i=a.inArray(n,qe.settings),-1!==i&&qe.settings.splice(i,1)})}),a.each(["column","row","cell"],function(t,e){Ge(e+"s().every()",function(t){return this.iterator(e,function(a,r,i,o,s){t.call(new Xe(a)[e](r,"cell"===e?i:n),r,i,o,s)})})}),Ge("i18n()",function(t,e,r){var i=this.context[0],t=w(t)(i.oLanguage);return t===n&&(t=e),r!==n&&a.isPlainObject(t)&&(t=t[r]!==n?t[r]:t._),t.replace("%d",r)}),qe.version="1.10.9",qe.settings=[],qe.models={},qe.models.oSearch={bCaseInsensitive:!0,sSearch:"",bRegex:!1,bSmart:!0},qe.models.oRow={nTr:null,anCells:null,_aData:[],_aSortData:null,_aFilterData:null,_sFilterRow:null,_sRowStripe:"",src:null,idx:-1},qe.models.oColumn={idx:null,aDataSort:null,asSorting:null,bSearchable:null,bSortable:null,bVisible:null,_sManualType:null,_bAttrSrc:!1,fnCreatedCell:null,fnGetData:null,fnSetData:null,mData:null,mRender:null,nTh:null,nTf:null,sClass:null,sContentPadding:null,sDefaultContent:null,sName:null,sSortDataType:"std",sSortingClass:null,sSortingClassJUI:null,sTitle:null,sType:null,sWidth:null,sWidthOrig:null},qe.defaults={aaData:null,aaSorting:[[0,"asc"]],aaSortingFixed:[],ajax:null,aLengthMenu:[10,25,50,100],aoColumns:null,aoColumnDefs:null,aoSearchCols:[],asStripeClasses:null,bAutoWidth:!0,bDeferRender:!1,bDestroy:!1,bFilter:!0,bInfo:!0,bJQueryUI:!1,bLengthChange:!0,bPaginate:!0,bProcessing:!1,bRetrieve:!1,bScrollCollapse:!1,bServerSide:!1,bSort:!0,bSortMulti:!0,bSortCellsTop:!1,bSortClasses:!0,bStateSave:!1,fnCreatedRow:null,fnDrawCallback:null,fnFooterCallback:null,fnFormatNumber:function(t){return t.toString().replace(/\B(?=(\d{3})+(?!\d))/g,this.oLanguage.sThousands)},fnHeaderCallback:null,fnInfoCallback:null,fnInitComplete:null,fnPreDrawCallback:null,fnRowCallback:null,fnServerData:null,fnServerParams:null,fnStateLoadCallback:function(t){try{return JSON.parse((-1===t.iStateDuration?sessionStorage:localStorage).getItem("DataTables_"+t.sInstance+"_"+location.pathname))}catch(e){}},fnStateLoadParams:null,fnStateLoaded:null,fnStateSaveCallback:function(t,e){try{(-1===t.iStateDuration?sessionStorage:localStorage).setItem("DataTables_"+t.sInstance+"_"+location.pathname,JSON.stringify(e))}catch(n){}},fnStateSaveParams:null,iStateDuration:7200,iDeferLoading:null,iDisplayLength:10,iDisplayStart:0,iTabIndex:0,oClasses:{},oLanguage:{oAria:{sSortAscending:": activate to sort column ascending",sSortDescending:": activate to sort column descending"},oPaginate:{sFirst:"First",sLast:"Last",sNext:"Next",sPrevious:"Previous"},sEmptyTable:"No data available in table",sInfo:"Showing _START_ to _END_ of _TOTAL_ entries",sInfoEmpty:"Showing 0 to 0 of 0 entries",sInfoFiltered:"(filtered from _MAX_ total entries)",sInfoPostFix:"",sDecimal:"",sThousands:",",sLengthMenu:"Show _MENU_ entries",sLoadingRecords:"Loading...",sProcessing:"Processing...",sSearch:"Search:",sSearchPlaceholder:"",sUrl:"",sZeroRecords:"No matching records found"},oSearch:a.extend({},qe.models.oSearch),sAjaxDataProp:"data",sAjaxSource:null,sDom:"lfrtip",searchDelay:null,sPaginationType:"simple_numbers",sScrollX:"",sScrollXInner:"",sScrollY:"",sServerMethod:"GET",renderer:null,rowId:"DT_RowId"},r(qe.defaults),qe.defaults.column={aDataSort:null,iDataSort:-1,asSorting:["asc","desc"],bSearchable:!0,bSortable:!0,bVisible:!0,fnCreatedCell:null,mData:null,mRender:null,sCellType:"td",sClass:"",sContentPadding:"",sDefaultContent:null,sName:"",sSortDataType:"std",sTitle:null,sType:null,sWidth:null},r(qe.defaults.column),qe.models.oSettings={oFeatures:{bAutoWidth:null,bDeferRender:null,bFilter:null,bInfo:null,bLengthChange:null,bPaginate:null,bProcessing:null,bServerSide:null,bSort:null,bSortMulti:null,bSortClasses:null,bStateSave:null},oScroll:{bCollapse:null,iBarWidth:0,sX:null,sXInner:null,sY:null},oLanguage:{fnInfoCallback:null},oBrowser:{bScrollOversize:!1,bScrollbarLeft:!1,bBounding:!1,barWidth:0},ajax:null,aanFeatures:[],aoData:[],aiDisplay:[],aiDisplayMaster:[],aIds:{},aoColumns:[],aoHeader:[],aoFooter:[],oPreviousSearch:{},aoPreSearchCols:[],aaSorting:null,aaSortingFixed:[],asStripeClasses:null,asDestroyStripes:[],sDestroyWidth:0,aoRowCallback:[],aoHeaderCallback:[],aoFooterCallback:[],aoDrawCallback:[],aoRowCreatedCallback:[],aoPreDrawCallback:[],aoInitComplete:[],aoStateSaveParams:[],aoStateLoadParams:[],aoStateLoaded:[],sTableId:"",nTable:null,nTHead:null,nTFoot:null,nTBody:null,nTableWrapper:null,bDeferLoading:!1,bInitialised:!1,aoOpenRows:[],sDom:null,searchDelay:null,sPaginationType:"two_button",iStateDuration:0,aoStateSave:[],aoStateLoad:[],oSavedState:null,oLoadedState:null,sAjaxSource:null,sAjaxDataProp:null,bAjaxDataGet:!0,jqXHR:null,json:n,oAjaxData:n,fnServerData:null,aoServerParams:[],sServerMethod:null,fnFormatNumber:null,aLengthMenu:null,iDraw:0,bDrawing:!1,iDrawError:-1,_iDisplayLength:10,_iDisplayStart:0,_iRecordsTotal:0,_iRecordsDisplay:0,bJUI:null,oClasses:{},bFiltered:!1,bSorted:!1,bSortCellsTop:null,oInit:null,aoDestroyCallback:[],fnRecordsTotal:function(){return"ssp"==Ee(this)?1*this._iRecordsTotal:this.aiDisplayMaster.length},fnRecordsDisplay:function(){return"ssp"==Ee(this)?1*this._iRecordsDisplay:this.aiDisplay.length},fnDisplayEnd:function(){var t=this._iDisplayLength,e=this._iDisplayStart,n=e+t,a=this.aiDisplay.length,r=this.oFeatures,i=r.bPaginate;return r.bServerSide?!1===i||-1===t?e+a:Math.min(e+t,this._iRecordsDisplay):!i||n>a||-1===t?a:n},oInstance:null,sInstance:null,iTabIndex:0,nScrollHead:null,nScrollFoot:null,aLastSort:[],oPlugins:{},rowIdFn:null,rowId:null},qe.ext=Ve={buttons:{},classes:{},errMode:"alert",feature:[],search:[],selector:{cell:[],column:[],row:[]},internal:{},legacy:{ajax:null},pager:{},renderer:{pageButton:{},header:{}},order:{},type:{detect:[],search:{},order:{}},_unique:0,fnVersionCheck:qe.fnVersionCheck,iApiIndex:0,oJUIClasses:{},sVersion:qe.version},a.extend(Ve,{afnFiltering:Ve.search,aTypes:Ve.type.detect,ofnSearch:Ve.type.search,oSort:Ve.type.order,afnSortData:Ve.order,aoFeatures:Ve.feature,oApi:Ve.internal,oStdClasses:Ve.classes,oPagination:Ve.pager}),a.extend(qe.ext.classes,{sTable:"dataTable",sNoFooter:"no-footer",sPageButton:"paginate_button",sPageButtonActive:"current",sPageButtonDisabled:"disabled",sStripeOdd:"odd",sStripeEven:"even",sRowEmpty:"dataTables_empty",sWrapper:"dataTables_wrapper",sFilter:"dataTables_filter",sInfo:"dataTables_info",sPaging:"dataTables_paginate paging_",sLength:"dataTables_length",sProcessing:"dataTables_processing",sSortAsc:"sorting_asc",sSortDesc:"sorting_desc",sSortable:"sorting",sSortableAsc:"sorting_asc_disabled",sSortableDesc:"sorting_desc_disabled",sSortableNone:"sorting_disabled",sSortColumn:"sorting_",sFilterInput:"",sLengthSelect:"",sScrollWrapper:"dataTables_scroll",sScrollHead:"dataTables_scrollHead",sScrollHeadInner:"dataTables_scrollHeadInner",sScrollBody:"dataTables_scrollBody",sScrollFoot:"dataTables_scrollFoot",sScrollFootInner:"dataTables_scrollFootInner",sHeaderTH:"",sFooterTH:"",sSortJUIAsc:"",sSortJUIDesc:"",sSortJUI:"",sSortJUIAscAllowed:"",sSortJUIDescAllowed:"",sSortJUIWrapper:"",sSortIcon:"",sJUIHeader:"",sJUIFooter:""});var Rn="",Rn="",Pn=Rn+"ui-state-default",Ln=Rn+"css_right ui-icon ui-icon-",jn=Rn+"fg-toolbar ui-toolbar ui-widget-header ui-helper-clearfix";a.extend(qe.ext.oJUIClasses,qe.ext.classes,{sPageButton:"fg-button ui-button "+Pn,sPageButtonActive:"ui-state-disabled",sPageButtonDisabled:"ui-state-disabled",sPaging:"dataTables_paginate fg-buttonset ui-buttonset fg-buttonset-multi ui-buttonset-multi paging_",sSortAsc:Pn+" sorting_asc",sSortDesc:Pn+" sorting_desc",sSortable:Pn+" sorting",sSortableAsc:Pn+" sorting_asc_disabled",sSortableDesc:Pn+" sorting_desc_disabled",sSortableNone:Pn+" sorting_disabled",sSortJUIAsc:Ln+"triangle-1-n",sSortJUIDesc:Ln+"triangle-1-s",sSortJUI:Ln+"carat-2-n-s",sSortJUIAscAllowed:Ln+"carat-1-n",sSortJUIDescAllowed:Ln+"carat-1-s",sSortJUIWrapper:"DataTables_sort_wrapper",sSortIcon:"DataTables_sort_icon",sScrollHead:"dataTables_scrollHead "+Pn,sScrollFoot:"dataTables_scrollFoot "+Pn,sHeaderTH:Pn,sFooterTH:Pn,sJUIHeader:jn+" ui-corner-tl ui-corner-tr",sJUIFooter:jn+" ui-corner-bl ui-corner-br"});var Hn=qe.ext.pager;a.extend(Hn,{simple:function(){return["previous","next"]},full:function(){return["first","previous","next","last"]},numbers:function(t,e){return[Ue(t,e)]},simple_numbers:function(t,e){return["previous",Ue(t,e),"next"]},full_numbers:function(t,e){return["first","previous",Ue(t,e),"next","last"]},_numbers:Ue,numbers_length:7}),a.extend(!0,qe.ext.renderer,{pageButton:{_:function(t,n,r,i,o,s){var l,u,c,d=t.oClasses,f=t.oLanguage.oPaginate,h=0,p=function(e,n){var i,c,g,b,m=function(e){ce(t,e.data.action,!0)};for(i=0,c=n.length;c>i;i++)if(b=n[i],a.isArray(b))g=a("<"+(b.DT_el||"div")+"/>").appendTo(e),p(g,b);else{switch(l=null,u="",b){case"ellipsis":e.append('<span class="ellipsis">&#x2026;</span>');break;case"first":l=f.sFirst,u=b+(o>0?"":" "+d.sPageButtonDisabled);break;case"previous":l=f.sPrevious,u=b+(o>0?"":" "+d.sPageButtonDisabled);break;case"next":l=f.sNext,u=b+(s-1>o?"":" "+d.sPageButtonDisabled);break;case"last":l=f.sLast,u=b+(s-1>o?"":" "+d.sPageButtonDisabled);break;default:l=b+1,u=o===b?d.sPageButtonActive:""}null!==l&&(g=a("<a>",{"class":d.sPageButton+" "+u,"aria-controls":t.sTableId,"data-dt-idx":h,tabindex:t.iTabIndex,id:0===r&&"string"==typeof b?t.sTableId+"_"+b:null}).html(l).appendTo(e),He(g,{action:b},m),h++)}};try{c=a(n).find(e.activeElement).data("dt-idx")}catch(g){}p(a(n).empty(),i),c&&a(n).find("[data-dt-idx="+c+"]").focus()}}}),a.extend(qe.ext.type.detect,[function(t,e){var n=e.oLanguage.sDecimal;return on(t,n)?"num"+n:null},function(t){if(!(!t||t instanceof Date||Ze.test(t)&&Ke.test(t)))return null;var e=Date.parse(t);return null!==e&&!isNaN(e)||nn(t)?"date":null},function(t,e){var n=e.oLanguage.sDecimal;return on(t,n,!0)?"num-fmt"+n:null},function(t,e){var n=e.oLanguage.sDecimal;return sn(t,n)?"html-num"+n:null},function(t,e){var n=e.oLanguage.sDecimal;return sn(t,n,!0)?"html-num-fmt"+n:null},function(t){return nn(t)||"string"==typeof t&&-1!==t.indexOf("<")?"html":null}]),a.extend(qe.ext.type.search,{html:function(t){return nn(t)?t:"string"==typeof t?t.replace(Qe," ").replace(Ye,""):""},string:function(t){return nn(t)?t:"string"==typeof t?t.replace(Qe," "):t}});var Mn=function(t,e,n,a){return 0===t||t&&"-"!==t?(e&&(t=rn(t,e)),t.replace&&(n&&(t=t.replace(n,"")),a&&(t=t.replace(a,""))),1*t):-1/0};return a.extend(Ve.type.order,{"date-pre":function(t){return Date.parse(t)||0},"html-pre":function(t){return nn(t)?"":t.replace?t.replace(/<.*?>/g,"").toLowerCase():t+""},"string-pre":function(t){return nn(t)?"":"string"==typeof t?t.toLowerCase():t.toString?t.toString():""},"string-asc":function(t,e){return e>t?-1:t>e?1:0},"string-desc":function(t,e){return e>t?1:t>e?-1:0}}),Be(""),a.extend(!0,qe.ext.renderer,{header:{_:function(t,e,n,r){a(t.nTable).on("order.dt.DT",function(a,i,o,s){t===i&&(a=n.idx,e.removeClass(n.sSortingClass+" "+r.sSortAsc+" "+r.sSortDesc).addClass("asc"==s[a]?r.sSortAsc:"desc"==s[a]?r.sSortDesc:n.sSortingClass))})},jqueryui:function(t,e,n,r){a("<div/>").addClass(r.sSortJUIWrapper).append(e.contents()).append(a("<span/>").addClass(r.sSortIcon+" "+n.sSortingClassJUI)).appendTo(e),a(t.nTable).on("order.dt.DT",function(a,i,o,s){t===i&&(a=n.idx,e.removeClass(r.sSortAsc+" "+r.sSortDesc).addClass("asc"==s[a]?r.sSortAsc:"desc"==s[a]?r.sSortDesc:n.sSortingClass),e.find("span."+r.sSortIcon).removeClass(r.sSortJUIAsc+" "+r.sSortJUIDesc+" "+r.sSortJUI+" "+r.sSortJUIAscAllowed+" "+r.sSortJUIDescAllowed).addClass("asc"==s[a]?r.sSortJUIAsc:"desc"==s[a]?r.sSortJUIDesc:n.sSortingClassJUI))})}}}),qe.render={number:function(t,e,n,a,r){return{display:function(i){if("number"!=typeof i&&"string"!=typeof i)return i;var o=0>i?"-":"",i=Math.abs(parseFloat(i)),s=parseInt(i,10),i=n?e+(i-s).toFixed(n).substring(2):"";return o+(a||"")+s.toString().replace(/\B(?=(\d{3})+(?!\d))/g,t)+i+(r||"")}}}},a.extend(qe.ext.internal,{_fnExternApiFunc:Je,_fnBuildAjax:U,_fnAjaxUpdate:B,_fnAjaxParameters:J,_fnAjaxUpdateDraw:q,_fnAjaxDataSrc:V,_fnAddColumn:d,_fnColumnOptions:f,_fnAdjustColumnSizing:h,_fnVisibleToColumnIndex:p,_fnColumnIndexToVisible:g,_fnVisbleColumns:b,_fnGetColumns:m,_fnColumnTypes:v,_fnApplyColumnDefs:S,_fnHungarianMap:r,_fnCamelToHungarian:i,_fnLanguageCompat:o,_fnBrowserDetect:u,_fnAddData:D,_fnAddTr:_,_fnNodeToDataIndex:function(t,e){return e._DT_RowIndex!==n?e._DT_RowIndex:null},_fnNodeToColumnIndex:function(t,e,n){return a.inArray(n,t.aoData[e].anCells)},_fnGetCellData:y,_fnSetCellData:T,_fnSplitObjNotation:C,_fnGetObjectDataFn:w,_fnSetObjectDataFn:x,_fnGetDataMaster:I,_fnClearTable:A,_fnDeleteIndex:k,_fnInvalidate:F,_fnGetRowElements:R,_fnCreateTr:P,_fnBuildHead:j,_fnDrawHead:H,_fnDraw:M,_fnReDraw:N,_fnAddOptionsHtml:O,_fnDetectHeader:W,_fnGetUniqueThs:E,_fnFeatureHtmlFilter:X,_fnFilterComplete:G,_fnFilterCustom:z,_fnFilterColumn:$,_fnFilter:Q,_fnFilterCreateSearch:Y,_fnEscapeRegex:Z,_fnFilterData:K,_fnFeatureHtmlInfo:ne,_fnUpdateInfo:ae,_fnInfoMacros:re,_fnInitialise:ie,_fnInitComplete:oe,_fnLengthChange:se,_fnFeatureHtmlLength:le,_fnFeatureHtmlPaginate:ue,_fnPageChange:ce,_fnFeatureHtmlProcessing:de,_fnProcessingDisplay:fe,_fnFeatureHtmlTable:he,_fnScrollDraw:pe,_fnApplyToChildren:ge,_fnCalculateColumnWidths:be,_fnThrottle:me,_fnConvertToWidth:ve,_fnGetWidestNode:Se,_fnGetMaxLenString:De,_fnStringToCss:_e,_fnSortFlatten:ye,_fnSort:Te,_fnSortAria:Ce,_fnSortListener:we,_fnSortAttachListener:xe,_fnSortingClasses:Ie,_fnSortData:Ae,_fnSaveState:ke,_fnLoadState:Fe,_fnSettingsFromNode:Re,_fnLog:Pe,_fnMap:Le,_fnBindAction:He,_fnCallbackReg:Me,_fnCallbackFire:Ne,_fnLengthOverflow:Oe,_fnRenderer:We,_fnDataSource:Ee,_fnRowAttributes:L,_fnCalculateEnd:function(){}}),a.fn.dataTable=qe,a.fn.dataTableSettings=qe.settings,a.fn.dataTableExt=qe.ext,a.fn.DataTable=function(t){return a(this).dataTable(t).api()},a.each(qe,function(t,e){a.fn.DataTable[t]=e}),a.fn.dataTable};"function"==typeof define&&define.amd?define("datatables",["jquery"],a):"object"==typeof exports?module.exports=a(require("jquery")):jQuery&&!jQuery.fn.dataTable&&a(jQuery)}(window,document);


//custom.js
window.signOut = function (elem) {
    window.logoutInitiated = true;
    $.ajax({
        type: "POST",
        url: "/WebInterface/function/",
        data: {
            command: "logout",
            random: Math.random()
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            document.location = "https://sso.emu.dk/logout";
        },
        success: function (msg) {
            //Remove CrushAuth cookie and redirect to login page
            $.cookie("CrushAuth", "", {
                path: '/',
                expires: -1
            });
            document.location = "https://sso.emu.dk/logout";
        }
    });
};

//window.additionalCategories = ["/Linksamling/base.js", "/Linksamling/dansk.js"];
//window.additionalCategories = ["/Linksamling/base.js"];
window.defaultImagePath = "/WebInterface/Resources/customImages/";
window.customPaddedBreadCrumbs = true;
window.noStickyItems = true;
/*
    //Removed Vipul
    window.useContextMenuIconsInTopBar = true;
    window.useContextmenuHoverIconInTopBar = true;

*/
$("#fileQueueInfo").next().remove();
$("#FilterText,#FilterTextBasket").replaceWith('<img class="" alt="filter" src="/WebInterface/Resources/customImages/filter.png">');
$("#filter,#filterBasket,#filterShares").attr("placeholder", "Filter");
$(".select-by-criteria").prepend('<img class="" alt="select by criteria" src="/WebInterface/Resources/customImages/select-cat.png">');
$(".per-page").prepend('<span class="textmsg" id="ItemsPerPageText">Items per page</span>');
$(".filter-content").append($("#viewSelectorPanel"));
$("#viewSelectorPanel").prepend('<span id="LayoutChangeLabelText">View:</span>');
$(".thumbnailViewLink").each(function() {
    $(this).after($(this).parent().find(".treeViewLink"));
});
window.basketSizeLimiter = 210;
window.loadingIndicatorDialogWidth = 180;
$("#comments").prev().before($("#comments"));
var shareOptionDiv = $("#shareOptionDiv");
shareOptionDiv.find("fieldset").prepend('<table id="sharingCustomTable"><tr><td style="width:570px;vertical-align:top;" class="col1"><table width="100%" border="0" cellpadding="2" cellspacing="2"></table></td><td style="width:535px;vertical-align:top;" class="col2"><table width="100%" border="0" cellpadding="2" cellspacing="2"></table></td></tr></table>');
$("#sharingCustomTable").find("td.col1").find("table").append(shareOptionDiv.find("fieldset").find("tr.c1"));
$("#sharingCustomTable").find("td.col2").find("table").append(shareOptionDiv.find("fieldset").find("tr.c2"));
$("#sharingCustomTable").find("td.col2").find("table:first").prepend(shareOptionDiv.find("fieldset").find("#shareExpirationRow"));
$("#sharingCustomTable").find("td.col1").find("table").find("tr:first").after($(".directLink", shareOptionDiv));
window.shareWindowWidth = 1200;
if ($("#SSPage").length > 0) {
    $("#container").append("<div id='bottomBar'></div>");
    var photoIndex = $(".photo-index");
    photoIndex.prev().remove();
    $("#bottomBar").append(photoIndex);
    $("#bottomBar").append($("#caption"));
}
window.manageShareDetailspopupWidth = "95%";
if (typeof $.sessionChecker != "undefined")
   $.sessionChecker.defaultOptions.noteTextTemplate = "(Din session timer automatisk ud om %time%.)";

window.persistentLocalizationStrings = {
    PageSizeSelectionLinkText : "{0}",
    ThumbnailViewLinkText : "",
    TreeViewLinkText : "",
    ClearFilterLinkText : "x",
    ClearFilterLinkTextBasket : "x",
    ManageShareWindowClearFilterText : "x",
    popupOpenInSeparateWindowText : " ",
    ManageShareWindowFilterText : " ",
    ManageShareWindowPrevItemText :" ",
    ManageShareWindowNextItemText : " ",
    ManageShareWindowClearFilterText : "x"
}

//Group button icon
window.topMenuGroupItemIcon = "/WebInterface/Resources/customImages/buttonIcons/menudown.png";

window.rootDirectoryNameToDisplayInBreadcrumbs = "Data";

window.dateSeparator = "-";

if(window.changeMenuIcons)
{
    changeMenuIcons("/WebInterface/Resources/customImages/buttonIcons/", "-hover", function(style){
        style = style.replace(/.menuItem/g, ".topnav .menuItem").replace(/.png/g,"-hover.png");
        $("body").append('<style _id="customMenuIconsStyle">'+style+'</style>');
    }, function(style){
        style = style.replace(/.topnav .menuItem/g, "#myMenu .menuItem");
        $("body").append('<style _id="customMenuIconsStyle">'+style+'</style>');
    });
}

//Webinterface labels
localizations.PoweredByText = "<a target=\"_blank\" href=\"http://www.conpds.com/\">ConPDS</a> v.2017";
localizations.CopyrightText = "Powered by &copy; CrushFTP";

//Mosaic Print
window.PrintItems = function (data) {
  var mywindow = window.open('', 'mosaicPrint', 'height=400,width=600,resizable=no,titlebar=no');
  mywindow.document.write('<html><head><title>mosaicPrint</title>');
  mywindow.document.write('</head><body>');
  mywindow.document.write(data);
  mywindow.document.write('</body></html>');

  var printFunction = function(){
      mywindow.print();
      mywindow.document.close(); // necessary for IE >= 10
      mywindow.focus(); // necessary for IE >= 10
      mywindow.close();
      selectDeselectAllItems(false);
   }
   printFunction()
  return true;
}
window.customFileActionCallback_print = function(context, itemsInSelection, fileName, multipleFiles, fileNameOnly, item){
  window.open('/WebInterface/jQuery/mosaicPrint.html')
  window.selectedItems = itemsInSelection;
}

//Tags Input
!function(a){var b=new Array,c=new Array;a.fn.doAutosize=function(b){var c=a(this).data("minwidth"),d=a(this).data("maxwidth"),e="",f=a(this),g=a("#"+a(this).data("tester_id"));if(e!==(e=f.val())){var h=e.replace(/&/g,"&").replace(/\s/g," ").replace(/</g,"<").replace(/>/g,">");g.html(h);var i=g.width(),j=i+b.comfortZone>=c?i+b.comfortZone:c,k=f.width(),l=k>j&&j>=c||j>c&&d>j;l&&f.width(j)}},a.fn.resetAutosize=function(b){var c=a(this).data("minwidth")||b.minInputWidth||a(this).width(),d=a(this).data("maxwidth")||b.maxInputWidth||a(this).closest(".tagsinput").width()-b.inputPadding,e=a(this),f=a("<tester/>").css({position:"absolute",top:-9999,left:-9999,width:"auto",fontSize:e.css("fontSize"),fontFamily:e.css("fontFamily"),fontWeight:e.css("fontWeight"),letterSpacing:e.css("letterSpacing"),whiteSpace:"nowrap"}),g=a(this).attr("id")+"_autosize_tester";!a("#"+g).length>0&&(f.attr("id",g),f.appendTo("body")),e.data("minwidth",c),e.data("maxwidth",d),e.data("tester_id",g),e.css("width",c)},a.fn.addTag=function(d,e){return e=jQuery.extend({focus:!1,callback:!0},e),this.each(function(){var f=a(this).attr("id"),g=a(this).val().split(b[f]);if(""==g[0]&&(g=new Array),d=jQuery.trim(d),e.unique){var h=a(this).tagExist(d);1==h&&a("#"+f+"_tag").addClass("not_valid")}else var h=!1;if(""!=d&&1!=h){if(a("<span>").addClass("tag").append(a("<span>").text(d).append("&nbsp;&nbsp;"),a("<a>",{href:"#",title:"Removing tag",text:"x"}).click(function(){return a("#"+f).removeTag(escape(d))})).insertBefore("#"+f+"_addTag"),g.push(d),a("#"+f+"_tag").val(""),e.focus?a("#"+f+"_tag").focus():a("#"+f+"_tag").blur(),a.fn.tagsInput.updateTagsField(this,g),e.callback&&c[f]&&c[f].onAddTag){var i=c[f].onAddTag;i.call(this,d)}if(c[f]&&c[f].onChange){var j=g.length,i=c[f].onChange;i.call(this,a(this),g[j-1])}}}),!1},a.fn.removeTag=function(d){return d=unescape(d),this.each(function(){var e=a(this).attr("id"),f=a(this).val().split(b[e]);for(a("#"+e+"_tagsinput .tag").remove(),str="",i=0;i<f.length;i++)f[i]!=d&&(str=str+b[e]+f[i]);if(a.fn.tagsInput.importTags(this,str),c[e]&&c[e].onRemoveTag){var g=c[e].onRemoveTag;g.call(this,d)}}),!1},a.fn.tagExist=function(c){var d=a(this).attr("id"),e=a(this).val().split(b[d]);return jQuery.inArray(c,e)>=0},a.fn.importTags=function(b){id=a(this).attr("id"),a("#"+id+"_tagsinput .tag").remove(),a.fn.tagsInput.importTags(this,b)},a.fn.tagsInput=function(e){var f=jQuery.extend({interactive:!0,defaultText:"add a tag",minChars:0,width:"300px",height:"100px",autocomplete:{selectFirst:!1},hide:!0,delimiter:",",unique:!0,removeWithBackspace:!0,placeholderColor:"#666666",autosize:!0,comfortZone:20,inputPadding:12},e);return this.each(function(){f.hide&&a(this).hide();var e=a(this).attr("id");(!e||b[a(this).attr("id")])&&(e=a(this).attr("id","tags"+(new Date).getTime()).attr("id"));var g=jQuery.extend({pid:e,real_input:"#"+e,holder:"#"+e+"_tagsinput",input_wrapper:"#"+e+"_addTag",fake_input:"#"+e+"_tag"},f);b[e]=g.delimiter,(f.onAddTag||f.onRemoveTag||f.onChange)&&(c[e]=new Array,c[e].onAddTag=f.onAddTag,c[e].onRemoveTag=f.onRemoveTag,c[e].onChange=f.onChange);var h='<div id="'+e+'_tagsinput" class="tagsinput"><div id="'+e+'_addTag">';if(f.interactive&&(h=h+'<input id="'+e+'_tag" value="" data-default="'+f.defaultText+'" />'),h+='</div><div class="tags_clear"></div></div>',a(h).insertAfter(this),a(g.holder).css("width",f.width),a(g.holder).css("min-height",f.height),a(g.holder).css("height",f.height),""!=a(g.real_input).val()&&a.fn.tagsInput.importTags(a(g.real_input),a(g.real_input).val()),f.interactive){if(a(g.fake_input).val(a(g.fake_input).attr("data-default")),a(g.fake_input).css("color",f.placeholderColor),a(g.fake_input).resetAutosize(f),a(g.holder).bind("click",g,function(b){a(b.data.fake_input).focus()}),a(g.fake_input).bind("focus",g,function(b){a(b.data.fake_input).val()==a(b.data.fake_input).attr("data-default")&&a(b.data.fake_input).val(""),a(b.data.fake_input).css("color","#000000")}),void 0!=f.autocomplete_url){autocomplete_options={source:f.autocomplete_url};for(attrname in f.autocomplete)autocomplete_options[attrname]=f.autocomplete[attrname];void 0!==jQuery.Autocompleter?(a(g.fake_input).autocomplete(f.autocomplete_url,f.autocomplete),a(g.fake_input).bind("result",g,function(b,c){c&&a("#"+e).addTag(c[0]+"",{focus:!0,unique:f.unique})})):void 0!==jQuery.ui.autocomplete&&(a(g.fake_input).autocomplete(autocomplete_options),a(g.fake_input).bind("autocompleteselect",g,function(b,c){return a(b.data.real_input).addTag(c.item.value,{focus:!0,unique:f.unique}),!1}))}else a(g.fake_input).bind("blur",g,function(b){var c=a(this).attr("data-default");return""!=a(b.data.fake_input).val()&&a(b.data.fake_input).val()!=c?b.data.minChars<=a(b.data.fake_input).val().length&&(!b.data.maxChars||b.data.maxChars>=a(b.data.fake_input).val().length)&&a(b.data.real_input).addTag(a(b.data.fake_input).val(),{focus:!0,unique:f.unique}):(a(b.data.fake_input).val(a(b.data.fake_input).attr("data-default")),a(b.data.fake_input).css("color",f.placeholderColor)),!1});a(g.fake_input).bind("keypress",g,function(b){return d(b)?(b.preventDefault(),b.data.minChars<=a(b.data.fake_input).val().length&&(!b.data.maxChars||b.data.maxChars>=a(b.data.fake_input).val().length)&&a(b.data.real_input).addTag(a(b.data.fake_input).val(),{focus:!0,unique:f.unique}),a(b.data.fake_input).resetAutosize(f),!1):void(b.data.autosize&&a(b.data.fake_input).doAutosize(f))}),g.removeWithBackspace&&a(g.fake_input).bind("keydown",function(b){if(8==b.keyCode&&""==a(this).val()){b.preventDefault();var c=a(this).closest(".tagsinput").find(".tag:last").text(),d=a(this).attr("id").replace(/_tag$/,"");c=c.replace(/[\s]+x$/,""),a("#"+d).removeTag(escape(c)),a(this).trigger("focus")}}),a(g.fake_input).blur(),g.unique&&a(g.fake_input).keydown(function(b){(8==b.keyCode||String.fromCharCode(b.which).match(/\w+|[???????,/]+/))&&a(this).removeClass("not_valid")})}}),this},a.fn.tagsInput.updateTagsField=function(c,d){var e=a(c).attr("id");a(c).val(d.join(b[e]))},a.fn.tagsInput.importTags=function(d,e){a(d).val("");var f=a(d).attr("id"),g=e.split(b[f]);for(i=0;i<g.length;i++)a(d).addTag(g[i],{focus:!1,callback:!1});if(c[f]&&c[f].onChange){var h=c[f].onChange;h.call(d,d,g[i])}};var d=function(b){var c=!1;return 13==b.which&&(c=!0),a.each(b.data.delimiter,function(a,d){b.which==d.charCodeAt(0)&&(c=!0)}),c}}(jQuery);

/*
 Mask Input plugin for jQuery
 Licensed under the MIT license (https://github.com/shaungrady/jquery-mask-input/blob/master/LICENSE)
 Version: 1.5
 */
!function(a,b,c,d){function f(a){if(a.selectionStart!==d)return a.selectionStart;if(c.selection){a.focus();var b=c.selection.createRange();return b.moveStart("character",-a.value.length),b.text.length}}function g(a,b){if(a.setSelectionRange)a.focus(),a.setSelectionRange(b,b);else if(a.createTextRange){var c=a.createTextRange();c.collapse(!0),c.moveEnd("character",b),c.moveStart("character",b),c.select()}}function h(a){return a.selectionStart!==d?a.selectionEnd-a.selectionStart:c.selection?c.selection.createRange().text.length:void 0}var e={9:/\d/,A:/[a-zA-Z]/,"*":/[a-zA-Z0-9]/};a.fn.extend({maskInput:function(b,c,i){return this.length?(i=i||a.noop,c=c||a.noop,this.filter("input").each(function(j,k){function r(b){return a.inArray(b,n)>-1}function s(b){var c="",d=o.slice();return a.each(b.split(""),function(a,b){d.length&&d[0].test(b)&&(c+=b,d.shift())}),c}function t(b){var c="",d=n.slice();return a.each(p.split(""),function(a,e){b.length&&a===d[0]?(c+=b.charAt(0)||"_",b=b.substr(1),d.shift()):c+=e}),c}function u(b){var c=a(this);c.data("isUnmaskedValueValid")||(c.val(""),c.attr("value-unmasked","")),c.data("caretPositionPreinput",0),c.data("selectionLengthPreinput",0)}function v(b){var d=b.which,e=b.type;if(16==d||91==d)return!0;var m,j=a(this),k=j.val(),l=j.data("valuePreinput")||"",o=s(k),q=j.attr("value-unmasked")||"",u=!1,w=f(this)||0,x=j.data("caretPositionPreinput")||0,y=w-x,z=n[0],A=n[o.length]||n.slice().pop()+1,B=h(this),C=j.data("selectionLengthPreinput")||0,D=B>0,E=C>0,F=k.length>l.length||C&&k.length>l.length-C,G=k.length<l.length||C&&k.length==l.length-C,H=d>=37&&d<=40&&b.shiftKey,I=37==d,J=8==d||"keyup"!=e&&G&&y===-1,K=46==d||"keyup"!=e&&G&&0===y&&!E,L=(I||J||"click"==e)&&w>z;if(0==c({value:s(k),maskedValue:k,lastChar:s(k).substring(s(k).length-1,s(k).length),inputElement:j}))return j.val(t(q)),!0;if(j.data("selectionLengthPreinput",B),j.unbind("mouseout.mask").one("mouseout.mask",v),"mouseout"==e||H||D&&("click"==e||"keyup"==e))return!0;if(("input"==e||"propertychange"==e)&&G&&!E&&o===q){for(;J&&w>0&&!r(w);)w--;for(;K&&w<p.length&&a.inArray(w,n)==-1;)w++;var M=a.inArray(w,n);o=o.substring(0,M)+o.substring(M+1)}for(u=o.length===n.length-1,j.attr("value-unmasked",o),j.data("isUnmaskedValueValid",u),m=t(o),j.data("valuePreinput",m),j.val(m),F&&w<=z&&(w=z+1),L&&w--,w=w>A?A:w<z?z:w;!r(w)&&w>z&&w<A;)w+=L?-1:1;(L&&w<A||F&&!r(x))&&w++,j.data("caretPositionPreinput",w),g(this,w),"input"!=b.type&&i({isValid:u,value:o,maskedValue:m,inputElement:j})}var l=a(k),m=l.attr("mask")||b,n=[],o=[],p="",q=0;return m===d||(m instanceof Array?a.each(m,function(b,c){c instanceof RegExp?(n.push(q++),p+="_",o.push(c)):"string"==typeof c&&a.each(c.split(""),function(a,b){p+=b,q++})}):a.each(m.split(""),function(a,b){e[b]?(n.push(q),p+="_",o.push(e[b])):p+=b,q++}),n.length?(n.push(q),function(a){var b=s(a.val()),c=t(b),d=b.length===n.length-1,e=a.attr("maxlength");a.val(c),a.attr("value-unmasked",b),a.data("isUnmaskedValueValid",d),e&&a.attr("maxlength",parseInt(e,10)+1)}(l),l.attr("placeholder",p),l.unbind(".mask"),l.bind("blur.mask",u).triggerHandler("blur"),void l.bind("input propertychange.mask keyup.mask focus.mask",v)):this)})):this}})}(jQuery,window,document);

window.useStaticPathToSearch = "/";
window.useParentFolderNamesAsZipName = true;
window.useOriginalImageAsFallbackForQuickview = true;

window.quickviewMaxWidth = window.quickviewMaxHeight = '60%';
window.useCustomQuickView = true;