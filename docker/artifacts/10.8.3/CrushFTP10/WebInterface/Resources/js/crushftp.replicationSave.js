crushFTP.Replication = {
    showOptionsOrContinue: function(cb){
        if(crushFTP.Replication.popup){
            crushFTP.Replication.popupVisible(true, true);
            crushFTP.Replication.overrideCB = function(prefs){
                delete crushFTP.Replication.overrideCB;
                crushFTP.Replication.popupVisible(false, true);
                crushFTP.replicationSavePrefs = prefs;
                cb();
            }
        }
        else
            cb();
    },
    savePreferenes: function(prefs, cb){
        prefs = prefs || "";
        crushFTP.data.setXMLPrefs("server_settings/ui_save_preferences"
            , "properties"
            , "reset"
            , "<ui_save_preferences>"+prefs+"</ui_save_preferences>"
            , function(data){
                data = $.xml2json(data, true);
                if(data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK")
                {
                    common.data.updateLocalPrefs(function(){
                        crushFTP.UI.hideIndicator();
                        cb(true);
                    });
                }
                else
                {
                    crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
                    cb(false);
                }
            }
        );
    },
    popupVisible: function(flag, dialog){
        if(!crushFTP.Replication.popup)
            return;
        if(flag){
            if(dialog){
                crushFTP.Replication.popup.dialog({
                    title: "Select additional Host(s) to save to",
                    autoOpen: true,
                    width: 700,
                    modal: true,
                    resizable: false,
                    closeOnEscape: true,
                    buttons: {
                    },
                    open : function(){
                    },
                    close: function(){
                        crushFTP.Replication.popup.dialog("destroy");
                        crushFTP.Replication.popup.show();
                    }
                });
            }
            else{
                crushFTP.Replication.popup.removeClass('hidden-custom');
            }
        }
        else{
            if(dialog){
                crushFTP.Replication.popup.dialog("destroy");
                crushFTP.Replication.popup.show();
            }
            else{
                crushFTP.Replication.popup.addClass('hidden-custom').removeAttr("style").removeClass('reverseButtons');;
            }
        }
    },
    init: function(prefs, prefix, panel, panelName, btnElem, onSave){
        var replicateHosts = crushFTP.data.getTextValueFromXMLNode(prefs.replicate_session_host_port, "") || prefs.replicateHosts || "";
        var currentSavedPrefs = crushFTP.data.getTextValueFromXMLNode(prefs.ui_save_preferences, "");
        var savedPrefs = currentSavedPrefs.split(";");
        var hosts = [];
        if(replicateHosts && replicateHosts.length>0){
            hosts = replicateHosts.split(",");
        }
        if(!hosts || hosts.length==0)
            return false;
        if($("#replicationHostPopup").length==0){
            $("body").append('<div id="replicationHostPopup"><h1 class="ui-widget-header">Select additional Host(s) to save to</h1><div class="content-panel"></div><div class="buttons"><a href="javascript:void(0);" class="button ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only cancel-btn" role="button" aria-disabled="false"><span class="ui-button-text"><span style="display:inline-block;margin:0px -3px 0px -5px;float:left;" class="pointer ui-icon ui-icon-cancel"></span><span class="submitActionCancel">&nbsp;Cancel&nbsp;</span></span></a>&nbsp;&nbsp;<a href="javascript:void(0);" class="button ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only save-btn" role="button" aria-disabled="false"><span class="ui-button-text"><span style="display:inline-block;margin:-2px 3px 0px -7px;float:left;" class="pointer ui-icon ui-icon-disk"></span><span class="submitActionOk">&nbsp;Save&nbsp;</span></span></a></div></div>');
        }
        var replicationHostPopup = $('#replicationHostPopup').addClass("hidden-custom").removeAttr("style").removeClass('reverseButtons');;
        crushFTP.Replication.popup = replicationHostPopup;
        var content = replicationHostPopup.find(".content-panel").empty();
        content.append('<ul class="nobg selectable single sideScroll"><li class="ui-widget-content all-items"><span class="ui-icon ui-icon-check checkmark"></span> All</li></ul>');
        var list = content.find("ul");
        for (var i = 0; i < hosts.length; i++) {
            var host = hosts[i].split(":")[0];
            list.append('<li class="ui-widget-content" host="'+host+'"><span class="ui-icon ui-icon-check checkmark"></span> '+host+'</li>');
        }
        var curPrefsName = panelName ? "" + prefix + ":" + panelName : prefix;
        var curItemName = curPrefsName + "=";
        var matchedItem = "";
        for (var i = 0; i < savedPrefs.length; i++) {
            var curItem = savedPrefs[i];
            if(curItem.indexOf(curItemName) == 0){
                matchedItem = curItem.replace(curItemName, "").split(",");
                i = savedPrefs.length;
            }
        }
        var selectNone = false;
        if(matchedItem && matchedItem.length>0){
            if(matchedItem[0] === "NONE")
            {
                list.find("li").removeClass('selected');
                selectNone = true;
            }
            else{
                for (var i = 0; i < matchedItem.length; i++) {
                    var curHost = matchedItem[i];
                    if(curHost)
                        list.find("li[host='"+curHost+"']").addClass('selected');
                }
            }
        }
        if(list.find('.selected').length==0){
            if(!selectNone)
                list.find("li").addClass('selected');
        }
        else{
            var selected = list.find("li.selected:not('.all-items')");
            if(selected.length == list.find("li").length-1){
                list.find(".all-items").addClass('selected');
            }
            else{
                list.find(".all-items").removeClass('selected');
            }
        }
        list.find("li").click(function(){
            $(this).toggleClass('selected');
            if($(this).is(".all-items")){
                if($(this).hasClass('selected'))
                    list.find("li").addClass('selected');
                else
                    list.find("li").removeClass('selected');
            }
            var selected = list.find("li.selected:not('.all-items')");
            if(selected.length == list.find("li").length-1){
                list.find(".all-items").addClass('selected');
            }
            else{
                list.find(".all-items").removeClass('selected');
            }
        });
        panel.find(btnElem).each(function(){
            var btn = $(this);
            var btnClone = btn.clone();
            btnClone.unbind();
            btnClone.removeAttr('id');
            btnClone.addClass("replicationSaveHelper");
            btnClone.find(".menu-icon").remove();
            btnClone.find(".ui-button-text span:last").append('<span class="menu-icon"></span>');
            btn.hide().addClass('hidden-by-replication');
            btn.after(btnClone);
            btnClone.click(function(e){
                curBtn = $(this);
                e.stopPropagation();
                e.preventDefault();
                replicationHostPopup.removeClass("hidden-custom")
                if(curBtn.hasClass('top-save-button')){
                    replicationHostPopup.attr("style", "bottom:auto;top: "+curBtn.offset().top+"px;").addClass('reverseButtons');
                }else{
                    replicationHostPopup.removeAttr("style").removeClass('reverseButtons');
                }
                function bindEscape(){
                    $(document).unbind("click.dismisspopup").one("click.dismisspopup", function(evt){
                        if($(evt.target).is("#replicationHostPopup") || $(evt.target).closest("#replicationHostPopup").length>0)
                        {
                            bindEscape();
                        }
                        else{
                            replicationHostPopup.addClass("hidden-custom").removeAttr("style").removeClass('reverseButtons');
                        }
                    });
                    $(document).unbind("keydown.dismisspopup").one("keydown.dismisspopup", function(evt){
                        if (evt.keyCode == 27){
                            replicationHostPopup.addClass("hidden-custom").removeAttr("style").removeClass('reverseButtons');
                        }
                        else
                        {
                            bindEscape();
                        }
                    });
                }
                bindEscape();
            });
        });
        replicationHostPopup.find(".save-btn").unbind().click(function(){
            var btn = $(this);
            var all = list.find(".all-items").hasClass('selected');
            var none = false;
            var items = [];
            if(!all){
                var selected = list.find('li.selected');
                selected.each(function(){
                    items.push($(this).attr("host"));
                });
                none = selected.length == 0;
            }
            var hosts = items.length>0 ? items.join(",") : '';
            var toSave = curItemName + hosts;
            var hasChanges = true;
            var hasMatch = false;
            for (var i = 0; i < savedPrefs.length; i++) {
                var curItem = savedPrefs[i];
                if(curItem.indexOf(curItemName) == 0){
                    if(curItem == toSave){
                        hasChanges = false;
                    }
                    if(all){
                        savedPrefs[i] = "";
                        hasChanges = true;
                    }
                    else if(none){
                        savedPrefs[i] = curItemName+"NONE";
                        hasChanges = true;
                    }
                    else
                        savedPrefs[i] = toSave;
                    i = savedPrefs.length;
                    hasMatch = true;
                }
            }
            if(!hasMatch && !all){
                if(none)
                    savedPrefs.push(toSave+"NONE");
                else
                    savedPrefs.push(toSave);
            }
            savedPrefs.removeByVal("");
            var callBack = crushFTP.Replication.overrideCB || onSave;
            if(prefix != "Jobs" && prefix != "UserManager" && hasChanges && savedPrefs.join(";") !== currentSavedPrefs){
                btn.block({
                    message:  'Wait..',
                    css: {
                        border: 'none',
                        padding: '0px 10px',
                        backgroundColor: '#000',
                        '-webkit-border-radius': '10px',
                        '-moz-border-radius': '10px',
                        opacity: .5,
                        color: '#fff',
                        'text-align':'left'
                    }
                }).attr("disabled", "disabled")
                crushFTP.Replication.savePreferenes(savedPrefs.join(";"), function(flag){
                    btn.unblock();
                    currentSavedPrefs = savedPrefs.join(";");
                    if(callBack){
                        callBack(savedPrefs.join(";"), curPrefsName);
                    }
                });
            }
            else{
                if(callBack){
                    callBack(savedPrefs.join(";"), curPrefsName);
                }
            }
        });
        replicationHostPopup.find(".cancel-btn").unbind().click(function(){
            replicationHostPopup.addClass("hidden-custom").removeAttr("style").removeClass('reverseButtons');
            if(replicationHostPopup.closest(".ui-dialog").length>0){
                crushFTP.Replication.popup.dialog("destroy");
                crushFTP.Replication.popup.show();
            }
        });
    }
};