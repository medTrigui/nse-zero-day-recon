/*!
 * CrushFTP File Revisions History
 *
 * http://crushFTP.com/
 *
 * Copyright @ CrushFTP
 *
 * Date: Wed, Dec 02 2015
 *
 * Author: Vipul Limbachiya
 *
 * http://urvatechlabs.com
 */
$(document).ready(function() {
    crushFTP.UI.initLoadingIndicator();
    crushFTP.userLogin.bindUserName(function(response, username) {
        crushFTP.UI.showLoadingIndicator({});
        css_browser_selector(navigator.userAgent);
        var curLang = crushFTP.methods.queryString("lang") || $.cookie("_i18n") || "";
        var curPath = crushFTP.methods.queryString("path") || "";
        var link = escape("/WebInterface/jQuery/revisions/index.html?lang="+curLang+"&path="+curPath);
        if (response == "failure") {
            window.location = "/WebInterface/login.html?link="+link;
        } else {
            var curLang = crushFTP.methods.queryString("lang") || $.cookie("_i18n");
            window.localizations = {};
            if (curLang) {
                $.getScript("/WebInterface/localizations/" + curLang + ".js", function() {
                    revisions.init();
                });
            } else
                revisions.init();
        }
    });
});
var revisions = {
    ajaxCallURL: "/WebInterface/function/",
    ajaxCallURLBase: "/WebInterface/function/",
    columnNames: {
    },
    init: function() {
        function formatBytesDynamic(bytes) {
            if(!bytes || bytes<0) return "*";
            bytes = parseFloat(bytes);
            if ((bytes / 1024).toFixed(0) == 0) return bytes.toFixed(1).toString() + " <span class='dataByClassFormatBytes'>bytes</span>";
            else if ((bytes / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024).toFixed(1).toString() + " <span class='dataByClassFormatKiloBytes'>KB</span>";
            else if ((bytes / 1024 / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024 / 1024).toFixed(1).toString() + " <span class='dataByClassFormatMegaBytes'>MB</span>";
            else if ((bytes / 1024 / 1024 / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024 / 1024 / 1024).toFixed(1).toString() + " <span class='dataByClassFormatGigaBytes'>GB</span>";
            else if ((bytes / 1024 / 1024 / 1024 / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024 / 1024 / 1024 / 1024).toFixed(1).toString() + " <span class='dataByClassFormatTeraBytes'>TB</span>";
        }
        $("body").show();
        var path = crushFTP.methods.queryString("path") || "";
        path = unescape(path);
        $('#pathName').text(path);
        crushFTP.UI.showLoadingIndicator({});
        revisions.getHistoryData(path, function(data){
            data = JSON.parse(data);
            crushFTP.UI.hideLoadingIndicator({});
            var manageRevisionlist = $('#manageRevisionlist').find("tbody").empty();
            if(data && data.listing && data.listing.length>0){
                for (var i = 0; i < data.listing.length; i++) {
                    var curItem = data.listing[i];
                    var timestamp = (parseInt(curItem.modified) / 1000);
                    var d = new Date(0);
                    d.setSeconds(timestamp);
                    var formatted = d.format("mm/dd/yyyy HH:MM:ss a/p");
                    var sizeFormatted = formatBytesDynamic(curItem.size);
                    manageRevisionlist.append("<tr><td style='text-align:center;'>"+curItem.crushftp_rev+"</td><td style='text-align:center;'>"+curItem.crushftp_user_name+"</td><td style='text-align:center;'>"+formatted+"</td><td style='text-align:center;'>"+sizeFormatted+"</td><td style='text-align:center;'><a class='download' rel='"+curItem.crushftp_rev+"' href='javascript:void(0)'>Download</a></td></tr>");
                }
                var fileName = crushFTPTools.encodeURILocal(path);
                manageRevisionlist.find("a.download").unbind().click(function(){
                    var rev = $(this).attr("rel");
                    revisions.submitAction({
                        '#command': "download",
                        'meta_downloadRevision' : rev,
                        '#random': Math.random(),
                        '#path': fileName
                    });
                    return false;
                });
            }
            else
            {
                manageRevisionlist.append("<tr><td colspan='5' style='text-align:center;'>No revisions available.</td></tr>");
            }
        });
        $('#refreshBtn').unbind().bind("click", function(){
            revisions.init();
        });
    },
    generateRandomPassword : function(length) {
        length = length || 8;
        var randomId = "";
        var possible = "ABCDEFGHKMNPQRTUVWXYZabcdefghkmnpqrtuvwxyz2346789";
        for (var i = 0; i < length; i++)
        randomId += possible.charAt(Math.floor(Math.random() * possible.length));
        return randomId;
    },
    submitAction : function(opt, requestType, toRemove) {
        var uniqueIFrameID = "i" + revisions.generateRandomPassword(8);
        var uniqueIFrame = $("<iframe id=\"" + uniqueIFrameID + "\" name=\"" + uniqueIFrameID + "\" src=\"javascript:false;\" style=\"display:none;\"></iframe>");
        $("body").append(uniqueIFrame);
        $("#crushftp_action").remove();
        $("body").append('<form id="crushftp_action" style=\"display:none;\" name="crushftp_action" enctype="multipart/form-data" method="post">' + '<input type="text" id="command" name="command" value="" />' + '<input type="text" id="path" name="path" value="" />' + '<input type="text" id="paths" name="paths" value="" />' + '<input type="text" id="random" name="random" value="" />' + '</form>');
        var formToSubmit = $("#crushftp_action");
        if(requestType)
        {
            formToSubmit.attr("method", requestType);
        }
        formToSubmit.attr("action", revisions.downloadURL).attr("target", uniqueIFrameID);
        formToSubmit.find("input").val("");
        for (var key in opt) {
            if (opt.hasOwnProperty(key)) {
                if(formToSubmit.find(key).attr("value", opt[key]).length==0)
                {
                    formToSubmit.append('<input type="text" id="'+key.replace("#", "")+'" name="'+key.replace("#", "")+'" value="'+opt[key]+'" />');
                }
            }
        }
        formToSubmit.append('<input type="text" id="c2f" name="c2f" value="'+crushFTPTools.getCrushAuth()+'" />');
        if(toRemove)
        {
            var items = toRemove.split(",");
            for (var i = 0; i < items.length; i++) {
                formToSubmit.find("#" + $.trim(items[i]) + "").remove();
            }
        }
        var agent = navigator.userAgent.toLowerCase();
        if (agent.indexOf('android') >= 0 && agent.indexOf('chrome') >= 0 && opt["#command"] && opt["#command"].indexOf("download")>=0)
        {
            formToSubmit.attr("target", "_blank");
        }
        formToSubmit.submit();
    },
    getHistoryData : function(path, callback){
        if(!path)
        {
            callback(false);
        }
        var obj = {
            command : "getHistory",
            path : crushFTPTools.encodeURILocal(unescape(path))
        };
        obj.c2f = crushFTPTools.getCrushAuth();
        $.ajax({
            type: "POST",
            url: revisions.ajaxCallURL,
            data: obj,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                callback(false);
            },
            success: function (data) {
                callback(data);
            }
        });
    }
};