/*!
* CrushFTP Task Designer UI
*
* http://crushFTP.com/
*
* Copyright @ CrushFTP
*
* Date: Thu, Apr 4 2013
*
* Author: Vipul Limbachiya
*
* http://vipullimbachiya.com
*/
var taskDesigner = {
    defaultTemplateForSchedule : {
        scheduleType : "manually",
        weekDays : "",
        monthlyAmount : "1",
        weeklyAmount : "1",
        plugin : "CrushTask (User Defined)",
        scheduleName : "New Job",
        monthDays : "",
        scheduleTime : "8:00 AM",
        scheduleTimeList:[],
        dailyAmount : "1",
        minutelyAmount : "1",
        save_history : "true",
        single : "true",
        singleServer : "false",
        save_state : "true",
        max_runtime_hours : "00",
        max_runtime_minutes : "00"
    },
    data : {
        items : [],
        originalPos : false,
        add : function(id, type, position, formData)
        {
            if(type == "task")
            {
                var data = {
                    connectionID : id,
                    position : position
                };
                data = $.extend(formData, data);
                taskDesigner.data.items.push(data);
            }
            else if(type == "breakpoint")
            {
                var data = {
                    connectionID : id
                };
                taskDesigner.data.items.push(data);
            }
            else
            {
                if(position)
                {
                    if(type == "start")
                        taskDesigner.data.startPointPosition = position;
                    else if(type == "end")
                        taskDesigner.data.endPointPosition = position;
                }
            }
        },
        update : function(id, data)
        {
            var item = taskDesigner.data.get(id);
            if(item)
                item = data;
        },
        changeName : function(name, id){
            var item = taskDesigner.data.get(id);
            var oldName = item.name + "";
            if(item)
            {
                item.name = name;
            }
            audit.addLog("renamed a task from " + oldName + " to " + audit.getName(item));
        },
        remove : function(id)
        {
            var item = taskDesigner.data.get(id);
            var filteredItems = [];
            for(var i=0;i<taskDesigner.data.items.length;i++)
            {
                if(taskDesigner.data.items[i].connectionID != id)
                    filteredItems.push(taskDesigner.data.items[i]);
                else
                    toRemove = taskDesigner.data.items[i];
            }
            taskDesigner.data.items = filteredItems;
            if(item.name != "BreakPoint")
                audit.addLog("removed a task "+ audit.getName(item));
        },
        get : function(id)
        {
            for(var i=0;i<taskDesigner.data.items.length;i++)
            {
                if(taskDesigner.data.items[i].connectionID == id)
                    return taskDesigner.data.items[i];
            }
            return false;
        },
        updatePosition : function(id, position, type)
        {
            type = type || "task";
            if(type == "task")
            {
                var item = taskDesigner.data.get(id);
                var oldPosition = item.position + "";
                if(item && position)
                {
                    item.position = position;
                    if(oldPosition != position)
                        audit.addLog("repositioned a task " + audit.getName(item) + " from " + oldPosition + " to " + position);
                }
            }
            else
            {
                if(position)
                {
                    if(type == "start")
                        taskDesigner.data.startPointPosition = position;
                    else if(type == "end")
                        taskDesigner.data.endPointPosition = position;
                }
            }
        },
        updateZIndex : function(id)
        {
            var elem = taskDesigner.canvas.find("#task_"+id);
            if(elem.length>0)
            {
                var zIndex = elem.css("zIndex");
                var item = taskDesigner.data.get(id);
                item.zIndex = zIndex;
            }
        },
        addConnection : function(id, type, connectionID)
        {
            if(type == "start")
            {
                var startConnections = taskDesigner.data.startConnections;
                if(!startConnections)
                    startConnections = taskDesigner.data.startConnections = [];

                if(!startConnections.has(connectionID))
                    startConnections.push(connectionID);
            }
            else
            {
                var item = taskDesigner.data.get(id);
                if(item)
                {
                    if(!item.connections)
                        item.connections = {};
                    var connections = item.connections.connections_subitem;
                    if(!connections)
                        connections = item.connections.connections_subitem = [];
                    connections.push({
                        type : type,
                        connectionID : connectionID
                    });
                    item.connections.connections_subitem = connections;
                    var filteredItems = [];
                    for(var i=0;i<connections.length;i++)
                    {
                        if(connections[i].connectionID && connections[i].connectionID.toString() != "null")
                            filteredItems.push(connections[i]);
                    }
                    item.connections.connections_subitem = filteredItems;
                }
            }
            var startItem = taskDesigner.data.get(id);
            var endItem = connectionID != "EndPoint" ? taskDesigner.data.get(connectionID) : {name:"EndPoint", type:""};
            if(startItem.name != "BreakPoint" && endItem.name != "BreakPoint"){
                audit.addLog("added connection of type "+ type + " from " + audit.getName(startItem) + " to " + audit.getName(endItem));
            }
            taskDesigner.hasPendingChanges(true);
        },
        hasConnection : function(id, type, connectionID)
        {
            var hasConnection = false;
            var item = taskDesigner.data.get(id);
            if(item)
            {
                if(!item.connections)
                    item.connections = {};
                var connections = item.connections.connections_subitem;
                if(!connections)
                    connections = item.connections.connections_subitem = [];
                for(var i=0;i<connections.length;i++)
                {
                    if(connections[i].connectionID == connectionID && connections[i].type == type)
                    {
                        hasConnection = true;
                        i = connections.length;
                    }

                }
            }
            return hasConnection;
        },
        removeConnection : function(id, type, connectionID)
        {
            if(type == "start")
            {
                var startConnections = taskDesigner.data.startConnections;
                if(!startConnections)
                    startConnections = taskDesigner.data.startConnections = [];

                if(startConnections.has(connectionID))
                    startConnections.removeByVal(connectionID);

                var startConnectionsToDebug = taskDesigner.data.startConnectionsToDebug;
                if(!startConnectionsToDebug)
                    startConnectionsToDebug = taskDesigner.data.startConnectionsToDebug = [];
                if(startConnectionsToDebug.has(connectionID))
                    startConnectionsToDebug.removeByVal(connectionID);
            }
            else
            {
                var item = taskDesigner.data.get(id);
                if(item)
                {
                    if(item.type == "Jump" && type == "true")
                    {
                        item.jump_task_id = "";
                    }
                    else if(item.type == "Jump" && type == "jumpfail")
                    {
                        item.jump_false_task_id = "";
                    }
                    else if(item.type == "UsersList" && type == "true")
                    {
                        item.taskToCall = "";
                    }
                    if(!item.connections)
                        item.connections = {};
                    var connections = item.connections.connections_subitem;
                    if(!connections)
                        connections = item.connections.connections_subitem = [];
                    var filteredItems = [];
                    for(var i=0;i<connections.length;i++)
                    {
                        if(connections[i].connectionID != connectionID || connections[i].type != type)
                            filteredItems.push(connections[i]);
                    }
                    item.connections.connections_subitem = filteredItems;
                }
            }
            var startItem = taskDesigner.data.get(id);
            var endItem = connectionID != "EndPoint" ? taskDesigner.data.get(connectionID) : {name:"EndPoint", type:""};
            if(startItem.name != "BreakPoint" && endItem.name != "BreakPoint"){
                audit.addLog("removed connection of type "+ type + " from " + audit.getName(startItem) + " to " + audit.getName(endItem));
            }
        },
        bindValuesFromJson : function(form, curItem, attrToUse, ignoreUnderscore)
        {
            function elemNameWithoutUnderScore(name)
            {
                if(ignoreUnderscore && name.indexOf("_")>=0)
                {
                    name = name.substr(0, name.indexOf("_"));
                }
                return name;
            }

            attrToUse = attrToUse || "id";
            form.find("input[type='text']:not(.ignoreBind),input[type='password']:not(.ignoreBind), textarea:not(.ignoreBind), select:not(.ignoreBind)").each(function(){
                if($(this).attr(attrToUse))
                {
                    if(curItem)
                    {
                        var curData = crushFTP.data.getValueFromJson(curItem, elemNameWithoutUnderScore($(this).attr(attrToUse)));
                        var curVal = curData.value || curData;
                        $(this).val(curVal).trigger("change");
                    }
                    else
                    {
                        $(this).val("").trigger("change");
                    }
                }
            });
            form.find("input[type='checkbox']:not(.ignoreBind), input[type='radio']:not(.ignoreBind) ").each(function(){
                if($(this).attr(attrToUse))
                {
                    if(curItem)
                    {
                        var curData = crushFTP.data.getValueFromJson(curItem, elemNameWithoutUnderScore($(this).attr(attrToUse)));
                        var curVal = curData.value || curData;
                        if($(this).is(".reverse"))
                        {
                            crushFTP.UI.checkUnchekInput($(this), curVal != "true");
                        }
                        else
                        {
                            crushFTP.UI.checkUnchekInput($(this), curVal == "true");
                        }
                        $(this).trigger("change");
                    }
                    else
                    {
                        if($(this).is(".reverse"))
                        {
                            crushFTP.UI.checkUnchekInput($(this), true);
                        }
                        else
                        {
                            crushFTP.UI.checkUnchekInput($(this), false);
                        }
                        $(this).trigger("change");
                    }
                }
            });
            form.find(".liveData").each(function(){
                if($(this).attr(attrToUse))
                {
                    if(curItem)
                    {
                        var curVal = crushFTP.data.getValueFromJson(curItem, elemNameWithoutUnderScore($(this).attr(attrToUse)));
                        $(this).text(curVal);
                    }
                    else
                    {
                        $(this).text("");
                    }
                }
            });
        },
        buildXMLToSubmitForm : function(form, includeRadio, attrToUse, ignoreNullValue)
        {
            attrToUse = attrToUse || "id";
            var xmlString = [];
            form.find("input[type='text']:not(.ignoreBind, .excludeXML),input[type='password']:not(.ignoreBind, .excludeXML), textarea:not(.ignoreBind, .excludeXML), select:not(.ignoreBind, .excludeXML)").each(function(){
                if($(this).attr(attrToUse))
                {
                    var curVal = $(this).val();
                    if($(this).hasClass('urlWithParams'))
                    {
                        curVal = $(this).data("realURL") || $(this).val();
                    }
                    if(!ignoreNullValue)
                        xmlString.push("<"+$(this).attr(attrToUse)+">"+crushFTP.methods.htmlEncode(curVal)+"</"+$(this).attr(attrToUse)+">");
                    else if(curVal.length>0)
                        xmlString.push("<"+$(this).attr(attrToUse)+">"+crushFTP.methods.htmlEncode(curVal)+"</"+$(this).attr(attrToUse)+">");
                }
            });
            form.find("input[type='checkbox']:not(.ignoreBind, .excludeXML)").each(function(){
                if($(this).attr(attrToUse))
                {
                    if($(this).is(".reverse"))
                    {
                        xmlString.push("<"+$(this).attr(attrToUse)+">"+!$(this).is(":checked")+"</"+$(this).attr(attrToUse)+">");
                    }
                    else
                    {
                        xmlString.push("<"+$(this).attr(attrToUse)+">"+$(this).is(":checked")+"</"+$(this).attr(attrToUse)+">");
                    }
                }
            });
            if(includeRadio)
            {
                form.find("input[type='radio']:not(.ignoreBind, .excludeXML)").each(function(){
                    if($(this).attr(attrToUse))
                    {
                        xmlString.push("<"+$(this).attr(attrToUse)+">"+$(this).is(":checked")+"</"+$(this).attr(attrToUse)+">");
                    }
                });
            }
            return xmlString.join("\r\n");
        },
        availablePlugins : function()
        {
            //Bind available plugins
            var availablePlugins;
            if(taskDesigner.kioskData && window.parent)
            {
                if(window.parent.panelEvents)
                    availablePlugins = window.parent.$(window.parent.document).data("GUIXMLPrefs").plugins.plugins_subitem;
                else
                {
                    var prefs = $(document).data("prefs_processed");
                    if(!prefs)
                    {
                        var raw = window.parent.$(window.parent.document).data("GUIXMLPrefs_RAW");
                        if(raw)
                        {
                            prefs = $.xml2json(raw);
                        }
                    }
                    if(prefs)
                    {
                        availablePlugins = prefs.plugins.plugins_subitem;
                    }
                }
            }
            else
            {
                availablePlugins = $(document).data("GUIXMLPrefs").plugins.plugins_subitem;
            }
            crushFTP.methods.rebuildSubItems(availablePlugins, "plugins_subitem");
            var addedPlugins = [];
            function addPluginName(item)
            {
                if(jQuery.isArray(item) && item.length>0)
                {
                    for(var i=0;i<item.length;i++)
                    {
                        addPluginName(item[i]);
                    }
                }
                else
                {
                    var pluginName = item.pluginName;
                    if(pluginName == "CrushTask")
                    {
                        var pluginName = item.pluginName;
                        if(!addedPlugins.has(pluginName))
                        {
                            addedPlugins.push(pluginName + " (User Defined)");
                        }
                        if(item.subItem && item.subItem.length > 0)
                        {
                            pluginName = pluginName + ":" + item.subItem;
                        }
                        if(pluginName && pluginName.length > 0)
                        {
                            addedPlugins.push(pluginName);
                        }
                    }
                }
            }
            if(availablePlugins)
            {
                for(var i=0;i<availablePlugins.length;i++)
                {
                    addPluginName(availablePlugins[i].plugins_subitem_subitem);
                }
            }
            if(addedPlugins.length>1)
            {
                var first = addedPlugins[0];
                addedPlugins[0] = addedPlugins[1];
                addedPlugins[1] = first;
            }
            return addedPlugins;
        },
        verifyServerPath : function(type, itemProperties, name, newName, _fileName){
            var xml2 = '<?xml version="1.0" encoding="UTF-8"?><vfs_items type="vector"><vfs_item type="vector"><vfs_item_subitem type="properties">' +  unescape(itemProperties) + "<type>" + type + "</type>" + "</vfs_item_subitem></vfs_item></vfs_items>";
            var itemPropertiesJSON = $.xml2json("<item>" +  unescape(itemProperties) + "<type>" + type + "</type>" + "</item>");
            name = newName || name;
            var path = itemPropertiesJSON.path || "/";
            if(name)
                path = "/" + name + "/";
            var obj = {
                command : "getUserXMLListing",
                path: unescape(path).replace(/\+/g, "%2B"),
                format: "JSON",
                isTestCall : true,
                username : crushFTP.storage("username"),
                c2f : crushFTP.getCrushAuth(),
                serverGroup : $("#userConnectionGroups").val() || "MainUsers",
                random: Math.random()
            };
            if(_fileName){
                itemPropertiesJSON.url = itemPropertiesJSON.url.substring(0, itemPropertiesJSON.url.lastIndexOf(_fileName));
            }
            var item = itemPropertiesJSON;
            var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
            // VFS Items
            xml += "\r\n<vfs_items type=\"vector\">";
            var askUser, curUN, curPass;
            try{
                var url = URI(item.url);
                if(url.username().indexOf("{username}")>=0 || url.password().indexOf("{password}")>=0){
                    askUser = true;
                    curUN = url.username();
                    curPass = url.password();
                }
            }catch(ex){}
            if(!askUser)
            {
                afterUserPass();
            }
            else{
                var userpassDialog = $("#userpassDialog");
                userpassDialog.find("#option_user_name").val("");
                userpassDialog.find("#option_password").val("");
                userpassDialog.form().dialog({
                    autoOpen: true,
                    title : "Enter Credentials : ",
                    resizable: false,
                    width: 300,
                    closeOnEscape: false,
                    open: function(event, ui){
                        $(event.target).dialog('widget').css({ position: 'fixed' }).position({ my: 'center', at: 'center', of: window });
                    },
                    create: function(event, ui) {
                        $(event.target).parent().css('position', 'fixed');
                    },buttons : {
                        "OK" : function(){
                            var user = curUN.replace(/{username}/g, userpassDialog.find("#option_user_name").val());
                            var pass = curPass.replace(/{password}/g, userpassDialog.find("#option_password").val());
                            try{
                                var url = URI(item.url);
                                url.username(user);
                                url.password(pass);
                                item.url = unescape(url.toString());
                                afterUserPass();
                            }catch(ex){}
                            userpassDialog.dialog("close");
                        }
                    }
                });
            }
            function afterUserPass(){
                if(item && item.name)
                {
                    var path = item.path || "";
                    if(item.name.toLowerCase() == "vfs" && path == "" && item.url == "" && item.type.toLowerCase()=="dir")
                    {
                        xml += "";
                    }
                    else
                    {
                        xml += "\r\n<vfs_items_subitem type=\"properties\">";
                            xml += "\r\n<name>"+crushFTP.methods.htmlEncode(unescape(crushFTP.methods.decodeXML(item.name))).replace(/\+/g, "%2B")+"</name>";
                            xml += "\r\n<path>"+crushFTP.methods.htmlEncode(unescape(crushFTP.methods.decodeXML("/"))).replace(/\+/g, "%2B")+"</path>";
                            xml += "\r\n<vfs_item type=\"vector\">";
                                xml += "\r\n<vfs_item_subitem type=\"properties\">";
                                    for(var prop in item)
                                    {
                                        if(prop != "name" && prop != "path")
                                        {
                                            var val = crushFTP.methods.htmlEncode(unescape(crushFTP.methods.decodeXML(item[prop]))).replace(/\+/g, "%2B");
                                            if(prop == "type")
                                            {
                                                if(val.toLowerCase() == "properties")
                                                    val = "dir";
                                                xml += "\r\n<"+prop+">" + val.toUpperCase()+ "</"+prop+">";
                                            }
                                            else if(prop == "url")
                                            {
                                                if(val.indexOf("/////")>=0)
                                                {
                                                    val = val.replace("/////", "////");
                                                }
                                                xml += "\r\n<"+prop+">" + val.replace(/{percent}3E/g, "%3E").replace(/{percent}3C/g, "%3C") + "</"+prop+">";
                                            }
                                              else if (prop == "secure" && val == "false" && (item.url != null && (item.url.toLowerCase().startsWith("ftpes://") || item.url.toLowerCase().startsWith("ftps://"))))
                                            {
                                                     xml += "\r\n<"+prop+">" + "true" + "</"+prop+">";
                                            }
                                            else
                                                xml += "\r\n<"+prop+">" + val + "</"+prop+">";
                                        }
                                    }
                                xml += "\r\n</vfs_item_subitem>";
                            xml += "\r\n</vfs_item>";
                        xml += "\r\n</vfs_items_subitem>";
                    }
                }
                xml += "\r\n</vfs_items>";
                var perms = '<?xml version="1.0" encoding="UTF-8"?><VFS type="properties"><item name="/">(read)(view)(resume)</item></VFS>';
                if(perms)
                    obj.permissions = perms;
                obj.vfs_items = xml;
                crushFTP.UI.showIndicator(false, false, "Wait..");
                $.ajax({
                    type: "POST",
                    url: crushFTP.ajaxCallURL,
                    data: obj,
                    success : function (msg){
                        crushFTP.UI.hideIndicator();
                        if (msg && msg.childNodes && msg.childNodes.length > 0) {
                            var items = $(msg).find("listing").text();
                            if($(msg).find("error").text())
                            {
                                crushFTP.UI.growl("Error : ", "Connection failed. <br>" + DOMPurify.sanitize($(msg).find("error").text()), true, 5000);
                            }
                            else if(items)
                            {
                                items = items.replace(/\n/g,' ').replace(/\s/g,' ');
                                eval(items);
                                if(l && jQuery.isArray(l))
                                {
                                    if(_fileName){
                                        var hasMatch;
                                        for (var i = 0; i < l.length; i++) {
                                            var curItem = l[i];
                                            if(curItem.name == _fileName){
                                                hasMatch = true;
                                                crushFTP.UI.growl("Success : ", "Connection succeed", false, 3000);
                                                return;
                                            }
                                        }
                                        if(!hasMatch){
                                            crushFTP.UI.growl("Error : ", "Connection failed (or empty directory)", true, 5000);
                                        }
                                    }
                                    else{
                                        crushFTP.UI.growl("Success : ", "Connection succeed", false, 3000);
                                    }
                                }
                                else
                                {
                                    crushFTP.UI.growl("Error : ", "Connection failed (or empty directory)", true, 5000);
                                }
                            }
                        }
                    },
                    error : function(){
                        crushFTP.UI.growl("Error : ", "Connection failed (or empty directory)", true, 5000);
                        crushFTP.UI.hideIndicator();
                    }
                });
            }
        }
    },
    resizeCanvas : function(opt,useMax){
        var jobsCanvas = $("#jobsCanvas");
        if(!opt)
        {
            var winHeight = $(window).height();
            var headerHeight = $("#header").height() || 100;
            headerHeight += 40;
            var footerHeight = $("#footer").height() || 100;
            footerHeight += 15;
            var arbHeight = 0;
            var actHeight = winHeight - headerHeight - footerHeight - arbHeight;
            if(actHeight<700)
                actHeight = 700;
            if(actWidth>3000)
                actWidth = 3000;
            jobsCanvas.height(actHeight);

            var winWidth = $(window).innerWidth();
            var actWidth = winWidth - 50;
            if(actWidth<1200)
                actWidth = 1200;
            if(actWidth>3000)
                actWidth = 3000;
            jobsCanvas.width(actWidth);
        }
        else
        {
            if(parseInt(opt.height)>3000)
                opt.height = 3000;
            if(parseInt(opt.width)>3000)
                opt.width = 3000;
            var hasSizeChange = false;
            if(useMax)
            {
                if(opt.width>jobsCanvas.width())
                {
                    jobsCanvas.width(opt.width);
                    taskDesigner.canvas.width(opt.width);
                    hasSizeChange = true;
                }

                if(opt.height>jobsCanvas.height())
                {
                    jobsCanvas.height(opt.height);
                    taskDesigner.canvas.height(opt.height);
                    hasSizeChange = true;
                }
                if(hasSizeChange)
                {
                    setTimeout(function(){
                        if(taskDesigner.kioskData && taskDesigner.kioskData.resizeFrame)
                        {
                            taskDesigner.kioskData.resizeFrame(taskDesigner.canvas.width(), taskDesigner.canvas.height()+20);
                        }
                    }, 100);
                }
            }
            else
                jobsCanvas.height(opt.height).width(opt.width);
        }
    },
    resizeItems : function(){
        var winHeight = $(window).height();
        var winWidth = $(window).innerWidth();
        var sideMenuHeight = winHeight - 150;
        if(sideMenuHeight<300)sideMenuHeight=300;
        $("#existingJobsPanel").height(sideMenuHeight + 5);
        $("#jobsScheduleList").height(sideMenuHeight - 135);

        $("#activeJobs").height(sideMenuHeight - 25);
        $("#activeScheduleList").height(sideMenuHeight - 175);
    },
    init : function(controlData)
    {
        if(controlData)
        {
            taskDesigner.initUI();
            taskDesigner.showAvailableJobs(function(){
                crushFTP.UI.hideLoadingIndicator({});
                var item = crushFTP.methods.jsonToXML(controlData, false, false, false, true, false);
                var xml = "<item>"+item+"</item>";
                var data = $.xml2json(xml);
                taskDesigner.processJobData(data, xml,  function(){
                });
            });
            return false;
        }
        window.onbeforeunload = taskDesigner.confirmExit;
        $("#mainServerInstance").unbind().change(function(){
            localStorage.setItem("mainServerInstance", $(this).val());
            window.location = window.location;
        });
        var logoElem = $("#logo", "#header").hide();
        var mainServerInstance = localStorage.getItem("mainServerInstance");
        crushFTP.data.serverRequest({
            command: 'getServerItem',
                key: "server_settings/server_list",
                random: Math.random()
            },
            function(data){
                var _mainServerInstance = $("#mainServerInstance").empty();
                if(data)
                {
                    $(data).find("result_value_subitem").each(function(){
                        var type = $(this).find("serverType").text();
                        if(type.toLowerCase().indexOf("dmz") >= 0)
                        {
                            var instance = $(this).find("server_item_name").text();
                            if(!instance) instance = $(this).find("ip").text() + ":" + $(this).find("port").text();
                            if(instance && instance.length>0)
                            {
                                if(instance.toLowerCase() == "main")
                                    _mainServerInstance.append("<option value=''>"+instance+"</option>");
                                else
                                    _mainServerInstance.append("<option value='"+instance+"'>"+instance+"</option>");
                            }
                        }
                    });
                    if(_mainServerInstance.find("option").length>0)
                    {
                        _mainServerInstance.prepend("<option value=''>Main</option>");
                        if(mainServerInstance != null)
                        {
                            if(_mainServerInstance.find("option[value='"+mainServerInstance+"']").length>0)
                            {
                                if(mainServerInstance.length>0 && mainServerInstance.toLowerCase()!= "main")
                                {
                                    crushFTP.ajaxCallURL = adminPanel.ajaxCallURL = adminPanel.ajaxCallURL + mainServerInstance + "/";
                                }
                                _mainServerInstance.val(mainServerInstance);
                            }
                            else
                            {
                                crushFTP.ajaxCallURL = adminPanel.ajaxCallURL = adminPanel.ajaxCallURLBase;
                                _mainServerInstance.val("");
                                localStorage.setItem("mainServerInstance", "");
                            }
                        }
                    }
                    else
                    {
                        _mainServerInstance.parent().remove();
                    }
            }
            adminPanel.data.getXMLPrefsDataFromServer("GUIXMLPrefs", function(allPrefs){
                var plugins = taskDesigner.data.availablePlugins();
                for (var i = 0; i < plugins.length; i++) {
                    var curItem = plugins[i];
                    if(curItem!="CrushTask (User Defined)")
                    {
                        $("#plugin").append("<option vlaue='"+curItem+"'>"+curItem+"</option>");
                    }
                }
                $("#plugin").change(function(){
                    if(taskDesigner.loadedSchedule)
                    {
                        taskDesigner.loadedSchedule.plugin = $(this).val();
                        taskDesigner.hasPendingChanges(true);
                    }
                });
                /*Replication stuff*/
                var replicate_jobs = $(document).data("GUIXMLPrefs").replicate_jobs;
                if(replicate_jobs && replicate_jobs.toLowerCase() === "true")
                {
                    if(!crushFTP.Replication.initialized){
                        var replicateHosts = $(document).data("GUIXMLPrefs").replicate_session_host_port;

                        crushFTP.Replication.init({
                            replicateHosts:replicateHosts
                        }, "Jobs", $("#GUIAdmin"), "", ".saveJobsButton", function(prefs, _panelname){
                            crushFTP.replicationSavePrefs = prefs;
                            $("#saveChanges").trigger("click");
                            crushFTP.Replication.popupVisible(false);
                        });
                        crushFTP.Replication.initialized = true;
                    }
                }
            });

            crushFTP.data.serverRequest({
                command: 'getJobsSettings',
                random: Math.random()
            },
            function(data){
                var jsonData = $.xml2json($(data).find("job_settings")[0]);
                taskDesigner.audit_job_logs = jsonData.audit_job_logs == "true";
                taskDesigner.logFileLocation = jsonData.job_log_name;
            });

            taskDesigner.showAvailableJobs(function(){
                taskDesigner.initUI();
                crushFTP.UI.hideLoadingIndicator({});
            });

            adminPanel.dataRepo.getCurrentUserInformation(function(data){
                var customizations = [];
                var logo = "";
                $(data).find("customizations_subitem").each(function(){
                    var curObj = {
                        key : $(this).find("key").text(),
                        value : $(this).find("value").text()
                    };
                    customizations.push(curObj);
                    if(curObj.key && curObj.key.toLowerCase() == "logo")
                    {
                        logo = curObj.value;
                    }
                });
                if(logo)
                {
                    if(logo.toLowerCase().indexOf("http://")<0 && logo.toLowerCase().indexOf("https://")<0)
                    {
                        logo = "/WebInterface/images/" + logo;
                    }
                    if(logoElem.find("img").length>0)
                        logoElem.find("img").replaceWith("<img src='" + logo+ "' />");
                    else
                        logoElem.append("<img src='" + logo + "' />");
                }
                logoElem.show();
            });

            function fetchServerInfo(callback)
            {
                if(crushFTP.storage("serverInfo"))
                {
                    callback(crushFTP.storage("serverInfo"));
                    return;
                }
                var serverInfoItems = ["registration_name","rid", "machine_is_linux","machine_is_solaris","machine_is_unix","machine_is_windows","machine_is_x","machine_is_x_10_5_plus","sub_version_info_str","version_info_str"];
                var arr = {};
                crushFTP.data.serverRequest({
                    command: 'getServerInfoItems',
                    keys: serverInfoItems.join(",")
                }, function(data, XMLHttpRequest, textStatus, errorThrown){
                    var items = $(data);
                    for (var i = 0; i < serverInfoItems.length; i++) {
                        var key = serverInfoItems[i];
                        arr[key] = items.find(key).text();
                    }
                    callback(arr);
                });
            }
            fetchServerInfo(function(server_info){
                if(server_info)
                {
                    crushFTP.storage("serverInfo", server_info);
                    if(!adminPanel.expiredNoteShown)
                    {
                        var registration_name = server_info.registration_name;
                        var rid = server_info.rid;
                        if(registration_name && rid)
                        {
                            if(registration_name.toLowerCase() == "crush")
                            {
                                var seconds = parseInt(rid);
                                var days = Math.floor((seconds % 31536000) / 86400);
                                if(days>30)
                                {
                                    var date = new Date(seconds);
                                    $("#installationDate").text(date.format("mm/dd/yyyy"));
                                    adminPanel.expiredNoteShown = true;
                                    $("#expiredNote").dialog("open");
                                }
                            }
                        }
                    }
                    if(server_info)
                    {
                        var versionInfo = "";
                        if(server_info.version_info_str)
                            versionInfo = server_info.version_info_str;
                        if(server_info.sub_version_info_str)
                        {
                            var subversion = server_info.sub_version_info_str;
                            if(subversion.indexOf("_")==0)
                                subversion = subversion.substr(1, subversion.length);
                            versionInfo += " Build : " + subversion;
                            $("#crushVersionInfo").text(versionInfo);
                        }
                        if(server_info.machine_is_linux == "true")
                        {
                            $.CrushFTPOS = "linux";
                        }
                        else if(server_info.machine_is_solaris == "true")
                        {
                            $.CrushFTPOS = "solaris";
                        }
                        else if(server_info.machine_is_unix == "true")
                        {
                            $.CrushFTPOS = "unix";
                        }
                        else if(server_info.machine_is_windows == "true")
                        {
                            $.CrushFTPOS = "windows";
                        }
                        else if(server_info.machine_is_x == "true")
                        {
                            $.CrushFTPOS = "mac";
                        }
                    }
                }
            });
        });
    },
    initUI : function(){
        var canvasZoomSlider = $("#canvasZoomSlider").slider({
          value:100,
          min: 25,
          max: 100,
          step: 5,
          slide: function( event, ui ) {
            $("#zoomValue").text(ui.value + "%");
            var zoom = parseInt(ui.value)/100;
            //zoom fix by carlos
            var isIE = (navigator.userAgent.indexOf("MSIE") != -1 || navigator.appVersion.indexOf('Trident/') > 0);
            if(isIE){
                taskDesigner.scaleFactor = zoom;
                taskDesigner.canvas.css("zoom", zoom);
            }
            taskDesigner.canvas.css("-moz-transform-origin", "0 0");
            taskDesigner.canvas.css("-moz-transform", "scale("+zoom+")");
            taskDesigner.canvas.css("-webkit-transform", "scale("+zoom+")");
            taskDesigner.canvas.css("-webkit-transform-origin", " 0 0");
            jsPlumb.setZoom(zoom);
          }
        });

        canvasZoomSlider.parent().click(function(event) {
            if($(this).hasClass('hidden'))
            {
                $(this).removeClass('hidden');
            }
            return false;
        });

        $("#resetZoom").click(function(event) {
            canvasZoomSlider.slider("value", 100);
            $("#zoomValue").text("100%");
            var zoom = 1;
            //zoom fix by carlos
            var isIE = (navigator.userAgent.indexOf("MSIE") != -1 || navigator.appVersion.indexOf('Trident/') > 0);
            if(isIE){
                taskDesigner.scaleFactor = zoom;
                taskDesigner.canvas.css("zoom", zoom);
            }
            taskDesigner.canvas.css("-moz-transform-origin", "0 0");
            taskDesigner.canvas.css("-moz-transform", "scale("+zoom+")");
            taskDesigner.canvas.css("-webkit-transform", "scale("+zoom+")");
            taskDesigner.canvas.css("-webkit-transform-origin", " 0 0");
            jsPlumb.setZoom(zoom);
            return false;
        });

        taskDesigner.settingsDialog = $("#jobsSetupDialog", taskDesigner.panel).form().dialog({
            autoOpen: false,
            title : "Jobs Setup",
            modal: true,
            width: 500,
            maxHeight : 700,
            resizable: false,
            zIndex : 5001,
            closeOnEscape: true,
            show: {effect: 'fade', duration: 200},
            buttons : {
                "Cancel" : function(){
                    $(this).dialog("close");
                },
                "Save" : function(){
                    var that = $(this);
                    crushFTP.UI.showLoadingIndicator({});
                    var xmlString = adminPanel.data.buildXMLToSubmitForm(taskDesigner.settingsDialog, false, "_id");
                    var xmlData = '<server_prefs type="properties">'+xmlString+'</server_prefs>';
                    crushFTP.data.setXMLPrefs("server_settings/server_prefs/", "properties", "update", xmlData, function(data){
                        data = $.xml2json(data, true);
                        if(data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK")
                        {
                            crushFTP.UI.hideLoadingIndicator({});
                            crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
                            taskDesigner.audit_job_logs = $("#audit_job_logs", taskDesigner.settingsDialog).is(":checked");
                            taskDesigner.logFileLocation = $.trim($("#job_log_name", taskDesigner.settingsDialog).val());
                            that.dialog("close");
                        }
                        else
                        {
                            crushFTP.UI.hideLoadingIndicator({});
                            crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
                        }
                    });
                }
            },
            beforeClose : function(){
                return true;
            },
            open: function(){
                crushFTP.UI.showLoadingIndicator({});
                crushFTP.data.serverRequest({
                    command: 'getJobsSettings',
                    random: Math.random()
                },
                function(data){
                    crushFTP.UI.hideLoadingIndicator({});
                    var jsonData = $.xml2json($(data).find("job_settings")[0]);
                    adminPanel.data.bindValuesFromJson(taskDesigner.settingsDialog, jsonData, "_id");
                });
            }
        });

        $("#activejobTabs").tabs(
            {
                activate: function(event, ui) {
                  switch (ui.newTab.index()){
                    case 0:
                        {
                            $("#rdbDesigner").prop("checked","checked").trigger('change');
                            jsPlumb.repaintEverything();
                        }
                        break;
                    case 1:
                        {
                            $("#rdbLog").prop("checked","checked").trigger('change');
                            jsPlumb.repaintEverything();
                        }
                        break;
                    case 2:
                        {
                            $("#rdbUserLog").prop("checked","checked").trigger('change');
                            jsPlumb.repaintEverything();
                        }
                        break;
                  }
               }
        });

        $("#zoomCollapse").click(function(){
            $(this).parent().addClass('hidden');
            return false;
        });

        /*Session checker will get version information, based on it new features will be show/hide/initiated*/
        $(".enterpriseFeature").hide();
        $("#SessionSeconds").sessionChecker({
            callBack:function(){
                var versionNo = ($(document).data("app_version")+"").replace( /^\D+/g, '');
                versionNo = versionNo || 5;
                var crushVersion = parseInt(versionNo);
                if (crushVersion < 6) //show new features
                {
                    crushFTP.userLogin.userLoginStatusCheckThread();
                }
                if($(document).data("app_enterprise")) //show new features
                {
                    $(".enterpriseFeature").show();
                }
            },
            keepAliveOnMouseKeyboardActivity: true
        });

        var ignorePurchaseBtn = $("#ignorePurchase").click(function(){
            if($(this).attr("disabled"))return false;
            $("#expiredNote").dialog("close");
            return false;
        }).attr("disabled", "disabled");

        $("#rangeSelectorDialog").form().dialog({
            autoOpen: false,
            width: 350,
            title : "Range Selector : ",
            modal: true,
            resizable: false,
            closeOnEscape: true,
            beforeClose : function(){
                return true;
            },
            open: function(){
                var range = taskDesigner.rangeForActiveJobs;
                if(range)
                {
                    $("#jobstartDate").datetimepicker("setDate", new Date(range[0]));
                    $("#jobendDate").datetimepicker("setDate", new Date(range[1]));
                }
            },
            zIndex : 5001,
            show: {effect: 'fade', duration: 200},
            buttons : {
                "OK" : function(){
                    var rangeStart = $("#jobstartDate").datetimepicker("getDate");
                    var rangeEnd = $("#jobendDate").datetimepicker("getDate");
                    if(rangeStart != null && rangeEnd != null)
                    {
                        var startTime = rangeStart.getTime();
                        var endTime = rangeEnd.getTime();

                        if(endTime<startTime)
                        {
                            endTime = startTime;
                            startTime = rangeEnd.getTime();
                        }
                        taskDesigner.rangeForActiveJobs = [startTime, endTime];
                        $("#rangeSelector").val("custom");
                    }
                    taskDesigner.bindActiveJobs(false, false, true);
                    $("#rangeSelectorDialog").dialog("close");
                },
                "Cancel" : function(){
                    $("#rangeSelectorDialog").dialog("close");
                }
            }
        });

        $("#expiredNote").dialog({
            autoOpen: false,
            width: 400,
            title : "Trial Expired : ",
            modal: true,
            resizable: false,
            closeOnEscape: false,
            beforeClose : function(){
                return true;
            },
            open: function(){
                $(".ui-dialog-titlebar-close").hide();
                ignorePurchaseBtn.block({
                    message:  '10',
                    css: {
                        border: 'none',
                        padding: '0px',
                        backgroundColor: 'transparent',
                        opacity: .9,
                        color: '#fff',
                        'text-align':'center'
                    }
                });
                var msgText = $(".blockMsg");
                var counter = 0;
                var myInterval = setInterval(function () {
                  ++counter;
                  if(counter==10)
                    clearInterval(myInterval);
                  msgText.text(10-counter);
                }, 1000);

                setTimeout(function(){
                    ignorePurchaseBtn.unblock();
                    ignorePurchaseBtn.removeAttr("disabled");
                }, 10000);
            }
        });

        var dmzCustomOptions = $("#dmzCustomOptions");
        dmzCustomOptions.form().dialog({
            autoOpen: false,
            title : "Custom DMZ : ",
            resizable: false,
            width: 440,
            dialogClass : 'customShadow2',
            closeOnEscape: true,
            show: {effect: 'fade', duration: 500},
            hide: {effect: 'fade', duration: 500},
            open: function(event, ui){
                $(event.target).dialog('widget').css({ position: 'fixed' }).position({ my: 'center', at: 'center', of: window });
                setTimeout(function(){
                    dmzCustomOptions.find("#customDMZType").change();
                }, 100);
            },
            create: function(event, ui) {
                $(event.target).parent().css('position', 'fixed');
            },buttons : {
                "OK" : function(){
                    // if(dmzCustomOptions.find("#customDMZType").val() == "variable")
                    // {
                    //     var val = $("#customDMZVariable").val();
                    //     if(val.indexOf("{")!=0 && val.lastIndexOf("}")!= val.length)
                    //     {
                    //         alert("Enter valid variable.");
                    //         $("#customDMZVariable").select().focus();
                    //         return false;
                    //     }
                    // }
                    if(window.afterCustomDMZSelection)
                    {
                        window.afterCustomDMZSelection();
                        delete window.afterCustomDMZSelection;
                    }
                    $(this).dialog("close");
                },
                "Cancel" : function(){
                    if(window.afterCustomDMZSelection)
                        window.afterCustomDMZSelection(true);
                    $(this).dialog("close");
                }
            },
            close : function(){
                setTimeout(function(){
                    if(window.afterCustomDMZSelection)
                        window.afterCustomDMZSelection(true);
                },100);
            },
            resizeStop: function(event, ui) {
                var position = [(Math.floor(ui.position.left) - $(window).scrollLeft()),
                                 (Math.floor(ui.position.top) - $(window).scrollTop())];
                $(event.target).parent().css('position', 'fixed');
                $(dlg).dialog('option','position',position);
            }
        });

        dmzCustomOptions.find("#customDMZType").change(function(){
            dmzCustomOptions.find("div.socksOptions").hide();
            dmzCustomOptions.find("div.variableOptions").hide();
            if($(this).val() == "socks5"){
                dmzCustomOptions.find("div.socksOptions").show();
            }
            else if($(this).val() == "variable"){
                dmzCustomOptions.find("div.variableOptions").show();
            }
        });

        $("#taskSearchDialog").dialog({
            autoOpen: false,
            width: 300,
            height : 120,
            title : "Find Tasks : ",
            resizable: false,
            dialogClass : 'customShadow2',
            closeOnEscape: true,
            show: {effect: 'fade', duration: 500},
            hide: {effect: 'fade', duration: 500},
            open: function(event, ui){
                $(event.target).dialog('widget').css({ position: 'fixed' }).position({ my: 'center', at: 'center', of: window });
                $("#findInTasks").val("").focus();
            },
            create: function(event, ui) {
                $(event.target).parent().css('position', 'fixed');
            },
            close :function(){
                taskDesigner.canvas.find(".filteredTask").removeClass("filteredTask");
            },
            resizeStop: function(event, ui) {
                var position = [(Math.floor(ui.position.left) - $(window).scrollLeft()),
                                 (Math.floor(ui.position.top) - $(window).scrollTop())];
                $(event.target).parent().css('position', 'fixed');
                $(dlg).dialog('option','position',position);
            }
        });

        taskDesigner.resizeCanvas();
        taskDesigner.resizeItems();
        $.alerts.showEffects = true;
        taskDesigner.panel = $("#taskDesignerPanel");
        $(".button").button();
        $("#designerLogSwitch").buttonset();
        taskDesigner.panel.block({
            message:  'Loading..',
            css: {
                border: 'none',
                padding: '10px',
                width : '200px',
                backgroundColor: '#000',
                '-webkit-border-radius': '10px',
                '-moz-border-radius': '10px',
                opacity: .5,
                color: '#fff',
                'text-align':'left'
            }
        });
        taskDesigner.canvas = $("#jobsCanvas", taskDesigner.panel);
        taskDesigner.copyTasksButton = $("#copyTasks", taskDesigner.panel);
        taskDesigner.removeTasksButton = $("#removeTasks", taskDesigner.panel);
        taskDesigner.pasteTasksButton = $("#pasteTasks", taskDesigner.panel);
        taskDesigner.undopasteButton = $("#undoPasteTasks", taskDesigner.panel);
        taskDesigner.taskTemplate = $(".crushTaskItem", taskDesigner.panel);
        taskDesigner.breakpointTemplate = $(".breakPoint", taskDesigner.panel);
        taskDesigner.endActionTemplate = $(".crushEndActionItem", taskDesigner.panel);
        taskDesigner.startActionTemplate = $(".crushStartActionItem", taskDesigner.panel);
        taskDesigner.tasksFormTemplateHolder = $("#crushTaskTemplatesHolder", taskDesigner.panel);
        taskDesigner.bindData();
        taskDesigner.bindEvents();
        taskDesigner.bindActiveJobs();
        taskDesigner.bindActiveJobEvents();
        taskDesigner.setupPolling();
        if(!crushFTP.jobsKioskMode)
        {
            taskDesigner.loadTasksFormHTML(function(flag){
                if(flag)
                {
                    taskDesigner.panel.unblock();
                }
                else
                {
                    crushFTP.UI.growl("Error", "Failed while loading forms", true);
                }
            });
        }
        taskDesigner.initJSPlumb();
        taskDesigner.bindContextMenu();
        var op = {};
        op.top = $(taskDesigner.canvas).height();
        op.left = ($(taskDesigner.canvas).width());
        taskDesigner.addItemToCanvas($("<div class='end'>"), op);

        op.top = 50;
        op.left = 10;
        taskDesigner.addItemToCanvas($("<div class='start'>"), op);
        taskDesigner.canvas.bind("dblclick", function(evt){
            taskDesigner.clearRangeSelection();
            if(taskDesigner.monitoringActiveJob)
            {
                return false;
            }
            if(!taskDesigner.loadedSchedule)
            {
                jAlert("You must create a Job first", "Create Job", function(){
                    $("#newJobsSchedule").trigger("click");
                });
                return false;
            }
            var $el = $(taskDesigner.canvas), op = {
                top : evt.offsetY,
                left : evt.offsetX
            }, op2 = $el.offset();
            if(evt.offsetX==undefined)
            {
                op.top = evt.pageY - $el.offset().top;
                op.left = evt.pageX - $el.offset().left;
            }
            var clickPoint = $("<span class='clickPoint'></span>");
            taskDesigner.canvas.append(clickPoint);
            op.top  = op.top;
            op.left = op.left - op2.left;
            if(op.top<5)op.top=5;
            if(op.left<5)op.left=5;
            clickPoint.css("top", op.top).css("left", op.left).effect("explode", 500, function(){
                clickPoint.remove();
                taskDesigner.addItemToCanvas($("<div class='task'>"), op);
            });
        });
        $("#ui-datepicker-div").hide();
        $("ol.selectable").selectable({
            selected: function(event, ui) {
                var selected = $(ui.selected);
                selected.parent().find(".ui-widget-header").removeClass("ui-widget-header").removeClass('ui-selected');
                selected.addClass("ui-widget-header");
                if(selected.is("li"))
                {
                    try{
                        var events = $(this).data('events');
                        if(events && events.onSelect)
                        {
                            $(this).trigger("onSelect", [$(this), selected]);
                        }
                    }
                    catch(ex){
                        if(ex && ex.toString() != "")
                        {
                            crushFTP.UI.growl("Error", DOMPurify.sanitize(ex), true);
                        }
                    }
                }
                return false;
            }
        });
        if(!crushFTP.jobsKioskMode){
            if(!$("#existingJobsPanel").is(":visible"))
                $("#existingJobsBtn").trigger("click");
        }
        else
        {
            $("#existingJobsPanel").hide();
        }
        var show = "scale";
        if($.browser.opera){
            show = "none";
        }
        $("#jobLiveLogViewer").dialog({
            autoOpen: false,
            modal: true,
            show : show,
            height: 800,
            width: 1200,
            closeOnEscape : false
         });

        $('a#newJobButton').button().contextMenu({
                menu: "newJobContext",
                openOnClick : true,
                inSpeed : 0,
                outSpeed : 0
            },
            function(action, el, pos) {
                var users = [];
                if(action == "job"){
                    $("#newJobsSchedule").trigger("click");
                }
                else if(action == "folder"){
                    $("#newFolder").trigger("click");
                }
            }
        );
        $('a#copyJobsSchedule').button().contextMenu({
                menu: "copyJobContext",
                openOnClick : true,
                inSpeed : 0,
                outSpeed : 0
            },
            function(action, el, pos) {
                var users = [];
                if(action == "copy"){
                    taskDesigner.copySelectedJob();
                    // $("#newJobsSchedule").trigger("click");
                }
                else if(action == "move"){
                    taskDesigner.copySelectedJob(true);
                    // $("#newFolder").trigger("click");
                }
            }
        );
        $("#pasteJobsSchedule").addClass('ui-state-disabled');
    },
    sortJobs: function(data){
        var orderBy = $('#sortJobs').val();
        var folderOnTop = $('#sortFoldersFirst').is(":checked");
        var folderSort = function(obj){
            if(!folderOnTop) return obj;
            return _.sortBy(obj, function(o) { return o.children && o.children.length>0 || (o.type && o.type == "DIR") ? 0 : 1; });
        }
        var jobs;
        if(orderBy === "name_ascending")
         jobs = folderSort(_.sortBy(data, function(o) { return o.name.toLowerCase(); }));
        else if(orderBy === "name_descending")
         jobs = folderSort(_.sortBy(data, function(o) { return o.name.toLowerCase(); }).reverse());
        else if(orderBy === "created_ascending")
         jobs = folderSort(_.sortBy(data, function(o) { return o.created; }));
        else if(orderBy === "created_descending")
         jobs = folderSort(_.sortBy(data, function(o) { return o.created; }).reverse());
        else if(orderBy === "modified_ascending")
         jobs = folderSort(_.sortBy(data, function(o) { return o.modified; }));
        else if(orderBy === "modified_descending")
         jobs = folderSort(_.sortBy(data, function(o) { return o.modified; }).reverse());
        return jobs;
    },
    updateJobsLocal: function(op, obj){
        if(op === "add"){
            var availableJobs = taskDesigner.availableJobsFlat;
            availableJobs.push($.extend(true, {}, obj));
            taskDesigner.availableJobs = taskDesigner.sortJobs(taskDesigner.processJobList(availableJobs));
            taskDesigner.availableJobsFlat = taskDesigner.sortJobs(availableJobs);
            if(!taskDesigner.kioskData){
                const countJobs = taskDesigner.availableJobsFlat.filter(item => item.type !== "DIR").length;
                $("#totalJobCount").text(countJobs);
            }
            var jobsScheduleList = $("#jobsScheduleList");
            var name = (obj.name ? decodeURIComponent(unescape(obj.name)) : "");
            var path = (obj.path ? decodeURIComponent(unescape(obj.path)) : name);
            if(obj.type === "DIR"){
                jobsScheduleList.prepend("<li class='folder' _id='"+escape(path)+"' _index='"+taskDesigner.availableJobs.length+1+"' _name='"+name+"'><div><span class='checkItem'><input type=\"checkbox\" class=\"scheduleSelection\" /></span><span class='listText'>" + crushFTP.methods.htmlEncode(name) + "</span></div><div class='meta'><span class=''><strong>0 jobs</strong></span></div><span class='favorite'></span></li>");
            }
            else{
                jobsScheduleList.prepend("<li class='job' _id='"+escape(path)+"' _index='"+taskDesigner.availableJobs.length+1+"' _name='"+name+"'><div><span class='checkItem'><input type=\"checkbox\" class=\"scheduleSelection\" /></span><span class='listText'>" + crushFTP.methods.htmlEncode(name) + "</span></div><div class='meta "+obj.enabled+"'><span class='type'><strong>"+crushFTP.methods.textEncode(obj.type)+"</strong></span><span class='dates'></span></div><span class='favorite'></span></li>");
            }
        }
        if(op === "update"){
            var availableJobs = taskDesigner.availableJobsFlat;
            var jobs = [];
            var found;
            availableJobs.forEach(function(item){
                if(item.scheduleName === obj.scheduleName){
                    obj.name = obj.name || obj.scheduleName;
                    jobs.push($.extend(true, {}, obj));
                    found = true;
                }
                else{
                    jobs.push($.extend(true, {}, item));
                }
            })
            if(!found){
                obj.name = obj.name || obj.scheduleName;
                jobs.push($.extend(true, {}, obj));
            }
            taskDesigner.availableJobs = taskDesigner.sortJobs(taskDesigner.processJobList(jobs));
            taskDesigner.availableJobsFlat = taskDesigner.sortJobs(jobs);
            if(!taskDesigner.kioskData){
                const countJobs = taskDesigner.availableJobsFlat.filter(item => item.type !== "DIR").length;
                $("#totalJobCount").text(countJobs);
            }
            var enabled = obj.enabled == "true" ? "active" : "inactive";
            var jobsScheduleList = $("#jobsScheduleList");
            var name = (obj.name ? decodeURIComponent(unescape(obj.name)) : "");
            var path = (obj.path ? decodeURIComponent(unescape(obj.path)) : name);
            jobsScheduleList.find("li[_id='"+escape(path)+"']").find(".meta").removeClass("active inactive").addClass(enabled);
            jobsScheduleList.find("li[_id='"+escape(path)+"']").find(".type").text(obj.scheduleType);
        }
        else if(op === "rename"){
            var availableJobs = taskDesigner.availableJobsFlat;
            availableJobs.forEach(function(item){
                if(item.name === obj.oldName){
                    item.name = obj.name;
                    var name = (item.name ? decodeURIComponent(unescape(item.name)) : "");
                    var path = (item.path ? decodeURIComponent(unescape(item.path)) : name);
                    var jobsScheduleList = $("#jobsScheduleList");
                    jobsScheduleList.find("li[_id='"+escape(path)+"']").find(".listText").text(item.name);
                }
            })
            taskDesigner.availableJobs = taskDesigner.sortJobs(taskDesigner.processJobList(availableJobs));
            taskDesigner.availableJobsFlat = taskDesigner.sortJobs(availableJobs);
            if(!taskDesigner.kioskData){
                const countJobs = taskDesigner.availableJobsFlat.filter(item => item.type !== "DIR").length;
                $("#totalJobCount").text(countJobs);
            }
        }
        else if(op === "delete"){
            var newList = [];
            var jobsScheduleList = $("#jobsScheduleList");
            taskDesigner.availableJobsFlat.forEach(function(item){
                if(item.name !== obj.name)
                    newList.push(item);
                else{
                    var name = (item.name ? decodeURIComponent(unescape(item.name)) : "");
                    var path = (item.path ? decodeURIComponent(unescape(item.path)) : name);
                    jobsScheduleList.find("li[_id='"+escape(path)+"']").remove();
                }
            })
            taskDesigner.availableJobsFlat = newList;
            var availableJobs = taskDesigner.availableJobsFlat;
            taskDesigner.availableJobs = taskDesigner.sortJobs(taskDesigner.processJobList(availableJobs));
            taskDesigner.availableJobsFlat = taskDesigner.sortJobs(availableJobs);
            if(!taskDesigner.kioskData){
                const countJobs = taskDesigner.availableJobsFlat.filter(item => item.type !== "DIR").length;
                $("#totalJobCount").text(countJobs);
            }
        }
    },
    showAvailableJobs : function(callback){
        $("#loadingJobsList").show();
        taskDesigner.availableJobs = [];
        crushFTP.data.serverRequest({
            command: "getJob",
            schedule_info : true
        },
        function(data){
            $("#loadingJobsList").hide();
            var job_info = false;
            if(data && typeof data.getElementsByTagName != "undefined")
            {
                if(data.getElementsByTagName("result_value") && data.getElementsByTagName("result_value").length > 0)
                {
                    var availableJobs = [];
                    $(data).find("result_value_subitem").each(function(index, el) {
                        var type = $(this).find("scheduleType").text();
                        if(type =="false")
                            type = "manually";
                        var itmData = $.xml2json($(this)[0]);
                        itmData.type = itmData.scheduleType || itmData.type;
                        availableJobs.push(itmData);
                    });
                    taskDesigner.availableJobs = taskDesigner.sortJobs(taskDesigner.processJobList(availableJobs));
                    taskDesigner.availableJobsFlat = taskDesigner.sortJobs(availableJobs);
                    if(!taskDesigner.kioskData){
                        const countJobs = taskDesigner.availableJobsFlat.filter(item => item.type !== "DIR").length;
                        $("#totalJobCount").text(countJobs);
                    }
                }
                if(callback)
                    callback();
            }
        });
    },
    getListOfJobs: function(selected){
        var items = [];
        var jobsScheduleList = $("#jobsScheduleList");
        var filter = selected ? "input:checked" : "input";
        jobsScheduleList.find(filter).each(function(){
            if($(this).closest("li").is(".folder")){
                var selected = $(this).closest("li");
                var folderData = selected.data("controlData");
                var folderName = folderData.name || '';
                var folderPath = folderData.path || path || '';
                var levels = folderPath.split("/");
                var allJobs = taskDesigner.availableJobsFlat;
                var jobs = taskDesigner.sortJobs(taskDesigner.processJobList(allJobs));
                var curLevel = 0;
                function findJob(obj, name){
                    var filterdObj = _.filter(obj, function (item) {
                        return item.name === name;
                    });
                    curLevel++;
                    var nextItem = filterdObj && filterdObj.length>0 ? filterdObj[0].children : filterdObj;
                    if(curLevel >= levels.length){
                        return nextItem;
                    }
                    else
                        return findJob(nextItem, levels[curLevel]);
                }
                var subJobs = taskDesigner.sortJobs(findJob(jobs, levels[curLevel]));
                subJobs.forEach(function(rec){
                    if(rec.type !== "DIR" && (!rec.children || rec.children.length === 0))
                        items.push(unescape(rec.path));
                    else{
                        var path = rec.path || rec.name;
                        var subJobs = allJobs.reduce((matchingItems, item) => {
                            if (item.name.startsWith(path) && item.type !== "DIR" && (!item.children || item.children.length === 0)) {
                              matchingItems.push(item.name);
                            }
                            return matchingItems;
                          }, []);
                        items = items.concat(subJobs);
                    }
                });
            }
            else{
                items.push(unescape($(this).closest("li").attr("_id")));
            }
        });
        var uniqueItems = items.filter((value, index, self) => {
          return self.indexOf(value) === index;
        });
        return uniqueItems;
    },
    loadJobFolder: function(folderData, path, keepFilter, rebindlist){
        if(!keepFilter)
            $("#filterSchedules").val("").trigger('keyup');
        var folderName = folderData.name || '';
        var folderPath = folderData.path || path || '';
        taskDesigner.currentJobFolder = taskDesigner.currentJobFolder || "/";
        var sameFolder = taskDesigner.currentJobFolder === folderPath;
        taskDesigner.currentJobFolder = folderPath;
        var levels = folderPath.split("/");
        var allJobs = taskDesigner.availableJobsFlat;
        var jobs = taskDesigner.sortJobs(taskDesigner.processJobList(allJobs));
        if(!folderPath || folderPath === "/"){
            taskDesigner.availableJobs = jobs;
            taskDesigner.bindData(!sameFolder || rebindlist);
            var jobFolders = $("#jobFolders").empty();
            var prevLevel = "";
            for (var i = 0; i < levels.length; i++) {
                if(prevLevel)
                    prevLevel+="/";
                prevLevel = prevLevel + levels[i];
                jobFolders.append('<option value="'+prevLevel+'">/'+prevLevel+'</option>');
            }
            jobFolders.prepend('<option value="/">/</option>');
            jobFolders.val(crushFTP.methods.htmlEncode(folderPath));
            return;
        }
        var curLevel = 0;
        function findJob(obj, name){
            var filterdObj = _.filter(obj, function (item) {
                return item.name === name;
            });
            curLevel++;
            var nextItem = filterdObj && filterdObj.length>0 ? filterdObj[0].children : filterdObj;
            if(curLevel >= levels.length){
                return nextItem;
            }
            else
                return findJob(nextItem, levels[curLevel]);
        }
        taskDesigner.availableJobs = taskDesigner.sortJobs(findJob(jobs, levels[curLevel]));
        taskDesigner.bindData(!sameFolder || rebindlist);
        var jobFolders = $("#jobFolders").empty();
        var prevLevel = "";
        for (var i = 0; i < levels.length; i++) {
            if(prevLevel)
                prevLevel+="/";
            prevLevel = prevLevel + levels[i];
            jobFolders.append('<option value="'+crushFTP.methods.htmlEncode(prevLevel)+'">/'+crushFTP.methods.htmlEncode(prevLevel)+'</option>');
        }
        jobFolders.prepend('<option value="/">/</option>');
        jobFolders.val(crushFTP.methods.htmlEncode(folderPath));
    },
    processJobList: function(items){
        var _ref;
        var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
        var directories =_.filter(items, function(item){
            return item.type == "DIR";
        });
        var folderItems = _.filter(items, function (item) {
            return item.name.indexOf("/") >= 0;
        });
        var folders = {
        };
        _.map(folderItems, function (item) {
          var names = item.name.split("/");
          var count = 0;
          var curField = folders;
          function iterateChildren() {
            if (names.length - 1 < count) return;
            var curItem = names[count];
            curField[curItem] = curField[curItem] || {};
            curField[curItem].children = curField[curItem].children || {};
            curField[curItem].meta = curField.meta || item;
            curField = curField[curItem].children;
            count++;
            iterateChildren();
          }
          iterateChildren();
        });
        var treeItems = [];
        _.map(folders, function (folder, name) {
          function process(root, name) {
            var item = _extends({}, root.meta, {
                name: name,
            }, {
                children: []
            });
            if (Object.keys(root.children).length > 0) {
              item.children = item.children || [];
              _.map(root.children, function (subitem, name) {
                item.children.push(process(subitem, name));
              });
            }
            return item;
          }
          treeItems.push(process(folder, name));
        });
        var filteredArray = (_ref = _).without.apply(_ref, [items].concat(folderItems));
        var mergedItems = filteredArray.concat(treeItems);
        function buildPath(obj, parentFolder){
            for (var j = 0; j < obj.length; j++) {
                var curItem = obj[j];
                curItem.path = parentFolder ? parentFolder + "/" + curItem.name : curItem.name;
                if(curItem.children && curItem.children.length>0)
                    buildPath(curItem.children, curItem.path);
            }
        }
        _.map(directories, function (dir) {
            var existingDirs = {};
            if(_.filter(mergedItems, function(itm){
                var hasMatch = itm.name === dir.name;
                if(hasMatch){
                    existingDirs[itm.name] = existingDirs[itm.name] || 0;
                    existingDirs[itm.name]++;
                }
                return hasMatch;
            }).length>1)
            {
                mergedItems = _.filter(mergedItems, function(itm){
                    if(existingDirs[itm.name]>1)
                        return (itm.children && itm.children.length>0);
                    else
                        return true;
                });
            }
        });
        buildPath(mergedItems, "");
        return mergedItems;
    },
    drawJsPlumbLine : function(params){
        try{
            return jsPlumb.connect(params);
        }catch(ex){
            setTimeout(function(){
                if(params.source.length > 0 && params.target.length > 0)
                    jsPlumb.connect(params)
            },100);
        }
        return false;
    },
    showLoading : function(hide){
        if(hide)
        {
            taskDesigner.panel.unblock();
            return;
        }
        taskDesigner.panel.block({
            message:  '<img src="/WebInterface/Resources/images/loadingAnimationB.gif" />',
            css: {
                border: 'none',
                padding: '10px',
                width : '68px',
                backgroundColor: '#000',
                '-webkit-border-radius': '10px',
                '-moz-border-radius': '10px',
                opacity: .9,
                zIndex : 99999,
                color: '#fff',
                'text-align':'left'
            },
            overlayCSS : {
                zIndex : 99999
            }
        });
    },
    clearRangeSelection : function(){
        if (window.getSelection)
        {
            if (window.getSelection().empty)
            {
                window.getSelection().empty();
            }
            else if (window.getSelection().removeAllRanges)
            {
                window.getSelection().removeAllRanges();
            }
        }
        else if (document.selection)
        {
            document.selection.empty();
        }
    },
    copyLoadedJob : function(name, callback){
        var newSchedule = taskDesigner.defaultTemplateForSchedule;
        newSchedule = $.extend(true, {}, newSchedule);
        newSchedule.scheduleName = name;
        newSchedule.id = crushFTP.methods.generateRandomPassword(8);
        var controlData = newSchedule;
        if(controlData && controlData.tasks)
            delete controlData.tasks;
        var dataXML = $.json2xml(controlData, {rootTagName: 'schedules_subitem'});
        dataXML = dataXML.replace(/\<schedules_subitem>/g, "<schedules_subitem type=\"properties\">")
                    .replace(/\<type>properties<\/type>/g, "").replace(/\<\/schedules_subitem>/g, "");
        var xml = taskDesigner.generateXML();
        var rootConnections = [];
        var _connections = taskDesigner.data.startConnections;
        if(_connections && _connections.length>0)
        {
            rootConnections.push("<connections type=\"vector\">");
            for (var i = 0; i < _connections.length; i++) {
                var curConnection = _connections[i];
                rootConnections.push("<connections_subitem type=\"properties\"><type>start</type><connectionID>"+curConnection+"</connectionID></connections_subitem>");
            };
            rootConnections.push("</connections>");
        }
        else
        {
            rootConnections.push("<connections type=\"vector\"><connections_subitem type=\"properties\"><type>dummy</type></connections_subitem></connections>");
        }
        if(dataXML && dataXML.length>0)
        {
            xml = dataXML + xml + rootConnections.join("") + "</schedules_subitem>";
        }
        taskDesigner.showLoading();
        console.log("AddJob called from copyLoadedJob");
        crushFTP.data.serverRequest({
            command: "addJob",
            name : name,
            data : xml
        }, function(data){
            var status = $.trim($(data).find("response_status").text());
            if(status.toLowerCase().indexOf("failure")!=0)
            {
                crushFTP.UI.growl("New job added : " + crushFTP.methods.htmlEncode(name), "Success", false, 3000);
                taskDesigner.showLoading(true);
                if(callback)
                    callback(true);
            }
            else
            {
                crushFTP.UI.growl("Error while saving", "Your changes are not saved. " + DOMPurify.sanitize(status), true);
                taskDesigner.showLoading(true);
                if(callback)
                    callback(false);
            }
        });
    },
    setRemoveTimeCall:function(){
        $(".removefromtimelist").unbind("click").bind("click", function(){
            for (var i=0;i<taskDesigner.loadedSchedule.scheduleTimeList.length;i++)
            {
                if (taskDesigner.loadedSchedule.scheduleTimeList[i] == $(this).attr("_id"))
                {
                taskDesigner.loadedSchedule.scheduleTimeList.splice(i, 1);

                $("span[_id='"+$(this).attr("_id")+"']").remove();
                    $(this).remove();
                    //break; //remove this line to remove all occurrences
                }
            }
            taskDesigner.loadedSchedule.scheduleTime = "";
            var timearray = taskDesigner.loadedSchedule.scheduleTimeList;
            for(var i=0;i<timearray.length;i++)
            {
                if(i==0)
                    taskDesigner.loadedSchedule.scheduleTime+=timearray[i];
                else
                    taskDesigner.loadedSchedule.scheduleTime+=","+timearray[i];
            }
            $("#scheduleTime_jobs").val(taskDesigner.loadedSchedule.scheduleTime);
            taskDesigner.jobDetailsDialog.attr("hasChanges", "true");
        });
    },
    formatTime:function(time){
            var result = false, m,n;
            time=time.trim();
            //var re = /^\s*([01]?\d|2[0-3]):?([0-5]\d)\s*$/;
            var re = /^\s*([01]?\d|2[0-3]):?([0-5]\d) [APap][mM]$/;
            var re2 = /^\s*([01]?\d|2[0-3]):?([0-5]\d)[APap][mM]$/;
            var regex = /^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/;
            var regex2 = /^(0?[1-9]|1[012])(:[0-5]\d)[APap][mM]$/;
            if((regex.test(time) || regex2.test(time)) && time!='')
            {
                    if ((m = time.match(re)) || (n = time.match(re2))) {
                       time=time.trim().slice(-2);
                    if(!m==false)
                        result = (m[1].length === 2 ? "" : "0") + m[1] + ":" + m[2];
                    else if(!n==false)
                        result = (n[1].length === 2 ? "" : "0") + n[1] + ":" + n[2];

                    result=result+" "+time;
                }
            }
            if(result)
                return result;
            else
                return time;

    },
    checkIfArrayIsUnique:function(myarray){
            for (var i = 0; i < myarray.length; i++)
            {
                if(myarray[i]!='')
                {
                    if (myarray.indexOf(myarray[i]) !== myarray.lastIndexOf(myarray[i])) {
                        return false;
                    }
                }
            }
            return true;
    },
    checkIfArrayIsUniqueWithValue:function(myarray,value){
        for (var i = 0; i < myarray.length; i++)
        {
           if(myarray[i]!='')
           {
                if (taskDesigner.formatTime(myarray[i].toUpperCase())== taskDesigner.formatTime(value.toUpperCase())) {
                    return false;
                }
            }
        }
        return true;
    },
    getFavorites: function(id){
        return "";
        //return "<span class='ui-icon ui-icon-star'></span>";
    },
    bindData : function(empty){
        var scheduleList = $("#jobsScheduleList");
        scheduleList.isolatedScroll();
        var backbutton = $(".back-button", "#existingJobs").hide();
        var jobsScheduleList = $("#jobsScheduleList");
        var pathSelector = $(".path-selector", "#existingJobs").hide();
        taskDesigner.resizeItems();
        if(taskDesigner.currentJobFolder && taskDesigner.currentJobFolder !== "/"){
            var path = "/" + taskDesigner.currentJobFolder.substring(0, taskDesigner.currentJobFolder.lastIndexOf('/'));
            backbutton.html(path).show();
            pathSelector.show();
            var curHeight = jobsScheduleList.height();
            curHeight -= 60;
            jobsScheduleList.height(curHeight);
        }
        if(!taskDesigner.kioskData){
            const countJobs = taskDesigner.availableJobs.filter(item => item.type !== "DIR").length;
            $("#totalJobCountCurDir").text(countJobs);
        }
        if(taskDesigner.availableJobs && taskDesigner.availableJobs.length > 200 && !empty && scheduleList.find("li[_id]:first").length>0){
            // console.log("No render today");
            // return false;
        }
        else{
            // console.log("Render", taskDesigner.availableJobs.length, empty, scheduleList.find("li[_id]:first"));
        }
        var dataset = taskDesigner.availableJobs;//.slice(0, 200);
        if(dataset && dataset.length<100)
            empty = true;
        adminPanel.UI.multiOptionControlDataBind(dataset
            , false
            , scheduleList
            , function(curItem, index){
                var name = (curItem.name ? decodeURIComponent(unescape(curItem.name)) : "");
                var path = (curItem.path ? decodeURIComponent(unescape(curItem.path)) : name);
                var type = curItem.type ? decodeURIComponent(unescape(curItem.type)) : "";
                var created = curItem.created ? decodeURIComponent(unescape(curItem.created)) : "";
                var modified = curItem.modified ? decodeURIComponent(unescape(curItem.modified)) : "";
                created = created && crushFTP.methods.isNumeric(created) ? "<strong>Created:</strong> " + dateFormat(new Date(parseInt(created)), "yyyy-mm-dd HH:MM:ss") : '';
                modified = modified && crushFTP.methods.isNumeric(modified) ? ", <strong>Modified:</strong> " + dateFormat(new Date(parseInt(modified)), "yyyy-mm-dd HH:MM:ss") : '';
                var id = path || "";
                var existingItem = scheduleList.find("li[_id='"+escape(id)+"']");
                if(name && name != "undefined" && name.indexOf("_")!=0)
                {
                    if(type.toLowerCase() != "dir" && (!curItem.children || curItem.children.length==0))
                    {
                        var nextRun = curItem.nextRun || "";
                        try{
                            if(nextRun){
                                var dt = new Date(parseInt(nextRun));
                                if(dt.getFullYear()<=1980)
                                {
                                    nextRun = ", Next Run : calculating...";
                                }
                                else
                                    nextRun = ", Next Run : " + dateFormat(new Date(parseInt(nextRun)), "yyyy-mm-dd HH:MM:ss");
                            }
                        }catch(ex){
                            nextRun = "";
                        }
                        if(type == "manually")
                            nextRun = "";
                        var enabled = curItem.enabled == "true" ? "active" : "inactive";

                        if(existingItem.length){
                            // existingItem.html("<div><span class='listText'>" + crushFTP.methods.htmlEncode(name) + "</span></div><div class='meta "+enabled+"'><span class='type'><strong>"+crushFTP.methods.textEncode(type)+"</strong>"+ nextRun +"</span><span class='dates'>"+ created + modified +"</span></div><span class='favorite'>"+taskDesigner.getFavorites(id)+"</span>");
                            return false;
                        }
                        else
                            return $("<li class='job' _id='"+escape(id)+"' _index='"+index+"' _name='"+name+"'><div><span class='checkItem'><input type=\"checkbox\" class=\"scheduleSelection\" /></span><span class='listText'>" + crushFTP.methods.htmlEncode(name) + "</span></div><div class='meta "+enabled+"'><span class='type'><strong>"+crushFTP.methods.textEncode(type)+"</strong>"+ nextRun +"</span><span class='dates'>"+ created + modified +"</span></div><span class='favorite'>"+taskDesigner.getFavorites(id)+"</span></li>");
                    }
                    else{
                        var subItems = curItem.children || [];
                        var concat = [];
                        var count = subItems.length;
                        if(subItems.length>3){
                            count = 3;
                        }
                        for(var i=0;i<count;i++){
                            if(subItems[i].name)
                                concat.push(subItems[i].name);
                        }
                        if(subItems.length>3){
                            concat.push(" and " + (subItems.length - count) + " more...")
                        }
                        if(subItems.length==0)
                            concat.push("0 jobs")
                        if(existingItem.length){
                            // existingItem.html("<div><span class='listText'>" + name + "</span></div><div class='meta'><span class=''><strong>"+crushFTP.methods.textEncode(concat.join(','))+"</strong></span></div><span class='favorite'>"+taskDesigner.getFavorites(id)+"</span>");
                            return false;
                        }
                        else
                            return $("<li class='folder' _id='"+escape(id)+"' _index='"+index+"' _name='"+name+"'><div><span class='checkItem'><input type=\"checkbox\" class=\"scheduleSelection\" /></span><span class='listText'>" + name + "</span></div><div class='meta'><span class=''><strong>"+crushFTP.methods.textEncode(concat.join(','))+"</strong></span></div><span class='favorite'>"+taskDesigner.getFavorites(id)+"</span></li>");
                    }
                }
            }
            ,true
            ,undefined
            ,undefined
            ,!empty
        );
        if(!taskDesigner.availableJobs || taskDesigner.availableJobs.length==0){
            scheduleList.append('<li class="text-center no-item">No items available</li>');
        }

        // if(scheduleList.find("li").length == 1 && scheduleList.find("li.folder").length == 1){
        //     setTimeout(function(){
        //         scheduleList.find("li").trigger('click');
        //     });
        // }

        var backbutton = $(".back-button", "#existingJobs").unbind().click(function(){
            var curFolder = taskDesigner.currentJobFolder;
            var prevFolder = curFolder.substring(0, curFolder.lastIndexOf("/")) || "/";
            taskDesigner.loadJobFolder({}, prevFolder);
        });

        var jobFolders = $("#jobFolders").unbind().change(function(e, keepFilter){
            taskDesigner.loadJobFolder({}, $(this).val(), keepFilter);
        });

        $("#sortJobs, #sortFoldersFirst").unbind().change(function(){
            taskDesigner.loadJobFolder({}, jobFolders.val(), undefined, true);
            // jobFolders.trigger('change');
        });

        $("li" , scheduleList).unbind().hover(function(){
            if($(this).hasClass('no-item'))
                return;
            $(this).addClass("ui-state-hover");
        },function(){
            if($(this).hasClass('no-item'))
                return;
            $(this).removeClass("ui-state-hover");
        }).unbind("click").click(function(evt, data){
            if($(this).hasClass('no-item'))
                return;
            var selected = $(this);
            var trigger = data;
            if(selected.hasClass('folder')){
                var folderData = selected.data("controlData");
                taskDesigner.loadJobFolder(folderData);
                return false;
            }
            if(selected.hasClass("ui-state-focus"))
            {
                if(taskDesigner.activeJobToMonitor && !trigger)
                {
                    taskDesigner.clearActiveJobData();
                    $("#activeScheduleList").find("li.ui-widget-header").removeClass("ui-widget-header").removeClass('ui-selected');
                }
                else
                {
                    if($("#existingJobsPanel").is(":visible"))
                        $("#existingJobsBtn").trigger("click");
                }
            }
            var loadedScheduleId = unescape(selected.attr("_id"));
            var continueLoading = function()
            {
                if(window._curUserPrivs && (window._curUserPrivs.indexOf("(CONNECT)")<0 && window._curUserPrivs.indexOf("(JOB_VIEW)")<0 && window._curUserPrivs.indexOf("(JOB_MONITOR)")<0))
                {
                    crushFTP.UI.growl("Error", "You don't have rights to view job details.", true, 3000);
                    return;
                }
                if(taskDesigner.activeJobToMonitor)
                    $("#activeScheduleList").find("li.ui-widget-header").removeClass("ui-widget-header").removeClass('ui-selected');
                $(".ui-state-focus" , scheduleList).removeClass("ui-state-focus");
                $(".loadedSchedule" , scheduleList).removeClass("loadedSchedule");
                crushFTP.UI.checkUnchekInput(scheduleList.find("input"), false);
                crushFTP.UI.checkUnchekInput(selected.addClass("ui-state-focus loadedSchedule").find("input"), true);
                if($("#rdbLog").is(":checked"))
                    $("#activejobTabs").tabs({active: 0});
                if($("#rdbUserLog").is(":checked"))
                    $("#activejobTabs").tabs({active: 1});
                if(trigger && trigger.callback)
                    taskDesigner.loadJob(selected, trigger.callback);
                else
                    taskDesigner.loadJob(selected);
                if($("#existingJobsPanel").is(":visible"))
                    $("#existingJobsBtn").trigger("click");
            }
            if(taskDesigner.hasChanges && !taskDesigner.monitoringActiveJob)
            {
                jConfirm("If you navigate away, you will lose your unsaved changes. Do you want to continue?", "Confirm", function(value){
                    if(value)
                    {
                        taskDesigner.hasPendingChanges(false);
                        continueLoading();
                    }
                    else
                    {
                        if($("#existingJobsPanel").is(":visible"))
                            $("#existingJobsBtn").trigger("click");
                    }
                },
                {
                    prependButtons : [{
                        button : '<a href="javascript:void(0);" id="popup_continue" class="button" tabIndex="0" style="margin-right:10px;"><span style="display:inline-block;margin:-1px 3px 0px -7px;float:left;" class="pointer ui-icon ui-icon-disk"></span><span class="submitActionSaveAndContinue">Save & Continue</span></a>&nbsp;&nbsp;',
                        clickEvent : function(){
                            $("#saveChanges").trigger("click", [{fromSaveAndContinue:true, callBack : function(flag){
                                if(flag)
                                {
                                    $("#popup_cancel").click();
                                    $("#jobsScheduleList").find("li[_id='"+escape(loadedScheduleId)+"']").trigger("click").addClass("loadedSchedule ui-state-focus");
                                }
                                else
                                {
                                    $("#popup_cancel").click();
                                    if($("#existingJobsPanel").is(":visible"))
                                        $("#existingJobsBtn").trigger("click");
                                }
                            }}]);
                        }
                    }],
                    okButtonText : "Discard Changes",
                    okButtonClassAdd : "ui-icon-trash"
                });
                return false;
            }
            else
            {
                continueLoading();
                return false;
            }
        }).end().form().find("span.ui-state-default").click(function(evt){
            evt.stopPropagation();
            evt.preventDefault();
            return false;
        });

        var monthdays = $(".monthdays").empty();
        for(var i=1;i<=31;i++)
        {
            monthdays.append('<div class="ui-state-default" _day="'+i+'">'+i+'</div>');
        }

        $(".monthdays, .weekdays", taskDesigner.jobDetailsDialog).find("div").unbind().click(function(){
            if($(this).hasClass("ui-state-active"))
            {
                $(this).removeClass("ui-state-active");
            }
            else
            {
                $(this).addClass("ui-state-active");
            }
        });

        $("a#repeatEveryMinutesOn").unbind().click(function(event,value) {
            $('#fromTimeOnEveryMinutes').val("");
            $('#toTimeOnEveryMinutes').val("");
            $('#fromTimeOnEveryMinutesHdn').val("");
            $('#repeatEveryMinutesOnTxtbox').val("");
            $('#fromTimeOnEveryMinutes').timepicker({
                ampm: true,
                timeFormat: 'hh:mm tt',
                addSliderAccess: true,
                sliderAccessArgs: { touchonly: false },
                onShown : function(){
                    $('#ui-datepicker-div').find(".ui-datepicker-close").click(function(){
                        $('#addinTimeList').click();
                        $('#fromTimeOnEveryMinutes').val($('.ui_tpicker_time').html());
                    });
                },
                beforeShow: function(el, instance, timePicker) {
                    setTimeout(function(){
                        $('#ui-datepicker-div').find(".ui-priority-primary").unbind("click.custom").bind("click.custom", function() {
                            if(!$(el).val()){
                                $(el).val(timePicker.formattedTime);
                            }
                        });
                    }, 100);

                    $('#ui-datepicker-div').find(".ui-datepicker-close").click(function() {
                        $('#addinTimeList').click();
                    });
                }
            })
            $('#toTimeOnEveryMinutes').timepicker({
                ampm: true,
                timeFormat: 'hh:mm tt',
                onShown : function(){
                    $('#ui-datepicker-div').find(".ui-datepicker-close").click(function(){
                        $('#addinTimeList').click();
                        $('#toTimeOnEveryMinutes').val($('.ui_tpicker_time').html());
                    });
                },
                beforeShow: function(el, instance, timePicker) {
                    setTimeout(function(){
                        $('#ui-datepicker-div').find(".ui-priority-primary").unbind("click.custom").bind("click.custom", function() {
                            if(!$(el).val()){
                                $(el).val(timePicker.formattedTime);
                            }
                        });
                    }, 100);

                    $('#ui-datepicker-div').find(".ui-datepicker-close").click(function() {
                        $('#addinTimeList').click();
                    });
                }
            })
            $("#repeatEveryMinutesOnPanel").dialog({
                autoOpen: false,
                title : "Repeat Every X Minutes : ",
                modal: true,
                minWidth : 260,
                minHeight : 170,
                resizable: true,
                zIndex : 5002,
                closeOnEscape: true,
                show: {effect: 'fade', duration: 600},
                buttons : {
                    "OK" : function(){
                        if($("#repeatEveryMinutesOnTxtbox").val()=='')
                        {
                            alert("Please enter minute")
                            return false;
                        }
                        if($("#repeatEveryMinutesOnTxtbox").val()<=0)
                        {
                            alert("Invalid value")
                            return false;
                        }
                        if($("#fromTimeOnEveryMinutes").val()!="")
                            $("#fromTimeOnEveryMinutesHdn").val($("#fromTimeOnEveryMinutes").val());
                        else
                        {
                            $("#fromTimeOnEveryMinutesHdn").val("12:00 am");
                            $("#fromTimeOnEveryMinutes").val("12:00 am");
                        }
                        if($("#toTimeOnEveryMinutes").val()=="")
                            $("#toTimeOnEveryMinutes").val("11:59 pm");

                        var time1 = moment($("#fromTimeOnEveryMinutes").val(), "hh:mm a");
                        var time2 = moment($("#toTimeOnEveryMinutes").val(), "hh:mm a");
                        if(time2.isBefore(time1)){
                            time2.add(1, "days");
                        }
                        var interval = $("#repeatEveryMinutesOnTxtbox").val();;
                        var slots = [];

                        function addtime(){
                            time1.add(interval, "minutes");
                            if(time1.isBefore(time2) || time1.format("hh:mm a") == time2.format("hh:mm a")){
                                slots.push(time1.format("hh:mm a"));
                                addtime();
                            }
                        }
                        slots.push(time1.format("hh:mm a"));
                        addtime();

                        if(!$("#save_pastRepeatOnEvertMinutes").is(":checked"))
                        {
                            var timearray = taskDesigner.loadedSchedule.scheduleTimeList;
                            if(timearray && timearray.length>0){
                                for (i=0; i<timearray.length; i++)
                                {
                                    if(timearray[i]!='' && !slots.has(timearray[i]))
                                    {
                                        slots.push(timearray[i]);
                                    }
                                }
                            }
                        }
                        slots.sort(function(a,b) {
                            return moment(a, "hh:mm a").valueOf() - moment(b, "hh:mm a").valueOf();
                        });

                        var uniqueNames = [];
                        $.each(slots, function(i, el){
                            if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
                        });
                        slots = uniqueNames;

                        taskDesigner.loadedSchedule.scheduleTimeList = slots;
                        $(".time-list-fieldset").html("");
                        taskDesigner.loadedSchedule.scheduleTime = "";

                        for(var i=0;i<slots.length;i++)
                        {
                            var curTime = slots[i];
                            if(curTime!='')
                            {
                                var dt = moment(curTime, "hh:mm a");
                                curTime = dt.format("hh:mm A");
                                var timeliststr="<span type='text' class='time-list excludeXML' _index='1' value='"+curTime+"' style='' disabled _id='"+curTime+"'>"+curTime+"</span><span class='pointer ui-icon ui-icon-close removefromtimelist time-list-remove-icon' _id='"+curTime+"'></span>";
                                $(".time-list-fieldset").append(timeliststr);
                                if(i==0)
                                    taskDesigner.loadedSchedule.scheduleTime+=curTime;
                                else
                                    taskDesigner.loadedSchedule.scheduleTime+=","+curTime;
                                taskDesigner.setRemoveTimeCall();
                            }
                        }
                        $("#scheduleTime_jobs").val(taskDesigner.loadedSchedule.scheduleTime);
                        taskDesigner.setRemoveTimeCall();
                        taskDesigner.hasPendingChanges(true);

                        $(this).dialog("close");

                    },
                    "Cancel" : function(){
                        $(this).dialog("close");
                    }
                }
            }).dialog("open");
        });

        $("a#pasteTimeList").unbind().click(function(event,value) {
            var setPromptVal = taskDesigner.loadedSchedule.scheduleTime;
            if(value!=undefined)
                setPromptVal=value;
                jPrompt("Quick Edit Time : ",setPromptVal, "Input", function(val, key, extraItemVal, extVals){
                    //if (val)
                        {
                        var isvalid=true;
                        var isunique=true;
                        var timearray = val.split(",");
                        for (i=0; i<timearray.length; i++)
                        {
                            if(timearray[i]!='')
                            {
                                if(!taskDesigner.formatTime(timearray[i]))
                                {
                                    isvalid=false;
                                    break;
                                }
                            }
                        }
                        if(isvalid)
                        {
                            if(!taskDesigner.checkIfArrayIsUnique(timearray))
                            {
                                isunique=false;
                            }
                        }
                        if(isvalid && isunique)
                        {
                            var timearray = val.split(",");
                            timearray = timearray.clean("").clean(" ");
                            timearray.sort(function (a, b) {
                               return new Date('1970/01/01 ' + a) - new Date('1970/01/01 ' + b);
                            });
                            taskDesigner.loadedSchedule.scheduleTimeList=timearray;
                            $(".time-list-fieldset").html("");
                            taskDesigner.loadedSchedule.scheduleTime="";

                            for(var i=0;i<timearray.length;i++)
                            {
                                if(timearray[i]!='')
                                {
                                    timearray[i]=taskDesigner.formatTime(timearray[i].toUpperCase());
                                    var timeliststr="<span type='text' class='time-list excludeXML' _index='1' value='"+timearray[i]+"' style='' disabled _id='"+timearray[i]+"'>"+timearray[i]+"</span><span class='pointer ui-icon ui-icon-close removefromtimelist time-list-remove-icon' _id='"+timearray[i]+"'></span>";
                                    $(".time-list-fieldset").append(timeliststr);
                                    if(i==0)
                                        taskDesigner.loadedSchedule.scheduleTime+=timearray[i];
                                    else
                                        taskDesigner.loadedSchedule.scheduleTime+=","+timearray[i];
                                    taskDesigner.setRemoveTimeCall();
                                }
                            }
                            $("#scheduleTime_jobs").val(taskDesigner.loadedSchedule.scheduleTime);
                            taskDesigner.setRemoveTimeCall();
                            taskDesigner.hasPendingChanges(true);
                        }
                        else
                        {
                           $("a#pasteTimeList").trigger('click',val);
                            if(!isunique)
                                alert("There's problem with time formatting for one or more items(duplicate), please check.")
                            else
                                alert("There's problem with time formatting for one or more items, please check.")
                            return false;
                        }
                    }
                }, false, false, {
                isTextArea: true,
                appendAfterInput: '<small>Comma separated time values in format : "hh:mm am/pm"</small>'
            });
            return false;
        });

        var jobsContext = $("#jobsContext");
        scheduleList.find("li:not(.no-item)").contextMenu({
                menu: "jobsContext",
                topPadding : 0,
                leftPadding : 0
            },
            function(action, el, pos) {
                if(action == "runJob")
                {
                    taskDesigner.runJobByName(el.attr("_id"));
                }
                else if(action == "runJobs")
                {
                    taskDesigner.runSelectedJobs();
                }
                else if(action == "runJobAndMonitor")
                {
                    taskDesigner.runJobByName(el.attr("_id"), true);
                }
                else if(action == "editJob" || action == "openDir")
                {
                    el.trigger('click');
                }
                else if(action == "addDirHere")
                {
                    taskDesigner.addNewFolder(el.attr("_id"));
                }
                else if(action == "renameDir")
                {
                    taskDesigner.renameFolder(el.attr("_name"));
                }
                else if(action == "deleteDir")
                {
                    taskDesigner.deleteFolder(el.attr("_id"));
                }
        }).bind("onBeforeContextMenu", function(el){
            if($(el.target).is(".no-item")){
                return false;
            }
            else if($(el.target).is(".folder")){
                jobsContext.find(".job-items").hide();
                jobsContext.find(".dir-items").show();
            }
            else{
                jobsContext.find(".job-items").show();
                jobsContext.find(".dir-items").hide();
            }
            return false;
        });

        var jobAuditTrail = $("a#jobAuditTrail").unbind().click(function(){
            var controlData = taskDesigner.loadedSchedule;
            if(!controlData){
                crushFTP.UI.growl("Select Job first", "Load Job for editing", true, 3000);
                return false;
            }
            var audit_trail = crushFTP.methods.htmlEncode(controlData.audit_trail || "");
            var data = audit_trail.split("\n").reverse();
            $("<div><pre style='padding: 2px;margin: 2px;overflow-y: scroll;background: #f6f6f6;line-height:20px;'>"+data.join("<br>")+"</pre></div>").infoPopup({
                title: "Job Change Log",
                elemType: "pre",
                // maximized: true,
                width: "90%"
            });
            // jAlert("", "Job Change Log", function(){},
            //     {
            //         appendAfterInput : "<pre style='width: 690px;height: 500px;padding: 2px;margin: 2px;overflow-y: scroll;margin-left: -60px;z-index: 100;background: #f6f6f6;margin-top: -10px;line-height:20px;'>"+data.join("<br>")+"</pre>"
            //     }
            // );
            return false;
        });

        var jobDetails = $("a.jobDetails").unbind().click(function(evt){
            taskDesigner.clearRangeSelection();
            var controlData = taskDesigner.loadedSchedule;
            if(!controlData){
                crushFTP.UI.growl("Select Job first", "Load Job for editing", true, 3000);
                return false;
            }
            var scheduleType = controlData.scheduleType;
            var scheduleInfo = taskDesigner.jobDetailsDialog;

            var link = $("#schedule_link_after_start,#schedule_link_before_end", scheduleInfo).empty();
            // var plugins = taskDesigner.data.availablePlugins();
            // var loadedPlugin = taskDesigner.loadedPlugin || "";
            // loadedPlugin = "CrushTask:" + loadedPlugin;
            var items = "<option value=''>Please Select</option>";
            // items += '<optgroup label="Plugin">';
            // for (var i = 0; i < plugins.length; i++) {
            //     var curItem = crushFTP.methods.textEncode(plugins[i]);
            //     if(curItem!="CrushTask (User Defined)" && curItem != loadedPlugin)
            //     {
            //         items += "<option value='plugin:"+curItem+"'>"+curItem+"</option>";
            //     }
            // }
            // items += '</optgroup>';

            var loadedJob = taskDesigner.loadedSchedule.scheduleName;
            var jobs = taskDesigner.availableJobsFlat;
            items += '<optgroup label="Job">';
            for (var i = 0; i < jobs.length; i++) {
                var curItem = crushFTP.methods.textEncode(jobs[i].name);
                if(curItem!=loadedJob)
                {
                    items += "<option value='job:"+curItem+"'>"+curItem+"</option>";
                }
            }
            items += '</optgroup>';
            link.append(items);

            adminPanel.data.bindValuesFromJson(scheduleInfo, controlData, "_id");
            if(scheduleType)
            {
                crushFTP.UI.checkUnchekInput(scheduleInfo.find("input#"+scheduleType + "_jobs"), true);
                scheduleInfo.find("input#"+scheduleType + "_jobs").trigger("change");
            }
            var monthdaysPanel = $(".monthdays", scheduleInfo);
            monthdaysPanel.find(".ui-state-active").removeClass("ui-state-active");
            var monthDays = controlData.monthDays;
            if(monthDays)
            {
                monthDays = monthDays.split(")(").join("|");
                monthDays = monthDays.substr(0, monthDays.lastIndexOf(")"));
                monthDays = monthDays.substr(1, monthDays.length);
                monthDays = monthDays.split("|");
                for(var i=0; i<=monthDays.length;i++)
                {
                    monthdaysPanel.find("div[_day='"+monthDays[i]+"']").addClass("ui-state-active");
                }
            }

            var weekDaysPanel = $(".weekdays", scheduleInfo);
            weekDaysPanel.find(".ui-state-active").removeClass("ui-state-active");
            var weekDays = controlData.weekDays;
            if(weekDays)
            {
                weekDays = weekDays.split(")(").join("|");
                weekDays = weekDays.substr(0, weekDays.lastIndexOf(")"));
                weekDays = weekDays.substr(1, weekDays.length);
                weekDays = weekDays.split("|");
                for(var i=0; i<=weekDays.length;i++)
                {
                    weekDaysPanel.find("div[_day='"+weekDays[i]+"']").addClass("ui-state-active");
                }
            }
            taskDesigner.jobDetailsDialog.dialog({
                title : "Job Details : " + crushFTP.methods.htmlEncode(controlData.scheduleName),
                dialogClass : "customShadow2"
            }).dialog("open");
            return false;
        });

        $("#editingJobName, #editingJobName2").closest('div').unbind().bind('dblclick', function(event) {
            taskDesigner.clearRangeSelection();
            jobDetails.click();
            return false;
        });
    },
    runSelectedJobs: function () {
        var items = [];
        var jobsScheduleList = $("#jobsScheduleList");
        jobsScheduleList.find("input:checked").each(function(){
            items.push(unescape($(this).closest("li").attr("_id")));
        });
        if (items.length > 0) {
            var total = items.length;
            jConfirm("Are you sure you wish to run selected " + total + " schedule(s)?", "Confirm", function (value) {
                if (value) {
                    for (var index = 0; index < items.length; index++) {
                        var curItem = items[index];
                        taskDesigner.runJobByName(curItem);
                    }
                }
            });
        };
    },
    getServerTime : function(cb){
        if(crushFTP.storage("currentServerTime"))
        {
            cb(crushFTP.storage("currentServerTime"));
            return;
        }
        crushFTP.data.serverRequest(
            {
                command: 'getServerItem',
                key: "server_info/current_datetime_millis",
                random: Math.random()
            },
            function(msg){
                var time = parseInt($(msg).find("response_status").text() || new Date().getTime());
                if(isNaN(time))
                    time = new Date().getTime();
                // var myDate = new Date();
                // var myDateWithDiff = new Date();
                // if(time)
                // {
                //     var mm = parseInt(time.substr(0, 2), 0);
                //     var dd = parseInt(time.substr(2, 2), 0);
                //     var yyyy = parseInt(time.substr(4, 4), 0);
                //     var hh = parseInt(time.substr(8, 2), 0);
                //     var mmm = parseInt(time.substr(10, 2), 0);
                //     var ss = parseInt(time.substr(12, 2), 0);
                //     myDate = new Date(yyyy, mm-1, dd, hh, mmm, ss);
                //     myDateWithDiff = new Date(yyyy, mm-1, dd, hh, mmm, ss);
                // }
                // var timeDiff = Math.round((myDate.getTime() - new Date().getTime()) / 1000);
                crushFTP.storage("currentServerTime", time);
                // crushFTP.storage("currentServerTimeDiff", timeDiff);
                setTimeout(function(){
                    crushFTP.removeStorage("currentServerTime");
                }, 5000);
                cb(time);
            }
        );
    },
    runJobByName: function (scheduleName, monitor) {
        if(!scheduleName)
            return;
        crushFTP.UI.showIndicator(false, false, "Please wait..");
        var obj = {
            command : "testJobSchedule",
            scheduleName : scheduleName
        };
        crushFTP.data.serverRequest(obj
            , function(data){
                data = $.xml2json(data, true);
                crushFTP.UI.hideIndicator();
                if(data.response)
                {
                    try{
                        if(data && data.jobid && data.jobid[0] && data.jobid[0].text)
                        {
                            var jobID = unescape(data.jobid[0].text);
                            function showActiveJob(flag)
                            {
                                $("#rangeSelector").val("hour");
                                $("#jobStatusFilter").val("");
                                taskDesigner.bindActiveJobs(false, function(){
                                    taskDesigner.clearLoadedTaskData();
                                    var toLoad = $("#activeScheduleList").find("li[taskid='"+jobID+"']");
                                    if(toLoad.length>0 && monitor)
                                    {
                                        toLoad.trigger("click");
                                        $("#availableJobsTabs").tabs({active: 1});
                                    }
                                    else
                                    {
                                        crushFTP.UI.growl("Job Started", "Job is running now", false, 5000);
                                    }
                                }, true);
                            }
                            setTimeout(function() {
                                showActiveJob();
                            }, 100);
                        }
                    }catch(ex){}
                }
                else
                {
                    crushFTP.UI.growl("Error while testing the job schedule", "Error", true);
                }
            }
         , false, "POST");
    },
    activeSelectedAction: function (type) {
        var lstJobs = $("#activeScheduleList");
        var toActOn = [];
        lstJobs.find(".scheduleSelection:checked").each(function () {
            var item = $(this).closest("li");
            var data = item.data("controlData");
            var status = data.status;
            if (type == "resume") {
                if (status == "paused")
                {
                    toActOn.push(data);
                }
            }
            else if (type == "retry") {
                if (status == "completed-errors" || status == "cancelled" || status == "error")
                {
                    toActOn.push(data);
                }
            }
            else if (type == "pause") {
                if (status == "polling")
                {
                    toActOn.push(data);
                }
            }
            else if (type == "stop") {
                if (status == "polling" || status == "paused" || status == "running")
                {
                    toActOn.push(data);
                }
            }
            else if (type == "restart") {
                if (status == "completed" || status == "completed-errors" || status == "cancelled" || status == "error")
                {
                    toActOn.push(data);
                }
            }
        });
        var jobIds = toActOn.map(function(curItem){
            return curItem.id
        }).join(";");
        var schedules = toActOn.map(function(curItem){
            return curItem.settings.scheduleName
        }).join(";");
        if(jobIds || schedules)
        {
            if(type === "resume")
            {
                taskDesigner.updateJobsStatus(jobIds, schedules, "running");
            }
            else if(type === "pause")
            {
                taskDesigner.updateJobsStatus(jobIds, schedules, "paused");
            }
            else if(type === "stop")
            {
                taskDesigner.updateJobsStatus(jobIds, schedules, "cancelled");
            }
            else if(type === "retry")
            {
                taskDesigner.updateJobsStatus(jobIds, schedules, "restart");
            }
            else if(type === "restart")
            {
                taskDesigner.runJobByName(schedules, true);
            }
        }

        // for (var index = 0; index < toActOn.length; index++) {
        //     var curItem = toActOn[index];
        //     if(type === "resume")
        //     {
        //         taskDesigner.updateJobsStatus(curItem.id, curItem.settings.scheduleName, "running");
        //     }
        //     else if(type === "pause")
        //     {
        //         taskDesigner.updateJobsStatus(curItem.id, curItem.settings.scheduleName, "paused");
        //     }
        //     else if(type === "stop")
        //     {
        //         taskDesigner.updateJobsStatus(curItem.id, curItem.settings.scheduleName, "cancelled");
        //     }
        //     else if(type === "retry")
        //     {
        //         taskDesigner.updateJobsStatus(curItem.id, curItem.settings.scheduleName, "restart");
        //     }
        //     else if(type === "restart")
        //     {
        //         taskDesigner.runJobByName(curItem.settings.scheduleName, true);
        //     }
        // }
    },
    bindActiveJobs : function(statusFilter, callback, forced)
    {
        if(taskDesigner.fetchingActiveJobs && !forced)
        {
            return false;
        }
        taskDesigner.getServerTime(function(time){
            var curTime = parseInt(time);
            var endTime = parseInt(time);
            var dtTime = new Date(curTime);
            var startTime;
            var msInMinute = 60000;
            var range = $("#rangeSelector").val();
            var dateOffset = (24*60*60*1000);
            switch(range)
            {
                case "10mins" :
                    startTime = endTime - (10 * msInMinute);
                    break;
                case "hour" :
                    startTime = endTime - (60 * msInMinute);
                    break;
                case "24hour" :
                    startTime = endTime - (24 * 60 * msInMinute);
                    break;
                case "today" :
                    startTime = new Date(dtTime.getFullYear(), dtTime.getMonth(), dtTime.getDate(), 0, 0, 0, 0).getTime();
                    endTime = new Date(dtTime.getFullYear(), dtTime.getMonth(), dtTime.getDate(), 23, 59, 59, 59).getTime();
                    break;
                case "yesterday" :
                    startTime = new Date(dtTime.getFullYear(), dtTime.getMonth(), dtTime.getDate(), 0, 0, 0, 0).getTime() - dateOffset;
                    endTime = new Date(dtTime.getFullYear(), dtTime.getMonth(), dtTime.getDate(), 23, 59, 59, 59).getTime() - dateOffset;
                    break;
                case "last3days" :
                    startTime = new Date(dtTime.getFullYear(), dtTime.getMonth(), dtTime.getDate(), 0, 0, 0, 0).getTime() - (dateOffset * 3);
                    endTime = new Date(dtTime.getFullYear(), dtTime.getMonth(), dtTime.getDate(), 23, 59, 59, 59).getTime();
                    break;
                case "week" :
                    startTime = new Date(dtTime.getFullYear(), dtTime.getMonth(), dtTime.getDate(), 0, 0, 0, 0).getTime() - (dateOffset * 7);
                    endTime = new Date(dtTime.getFullYear(), dtTime.getMonth(), dtTime.getDate(), 23, 59, 59, 59).getTime();
                    break;
                case "month" :
                    startTime = new Date(dtTime.getFullYear(), dtTime.getMonth(), dtTime.getDate(), 0, 0, 0, 0).getTime() - (dateOffset * 30);
                    endTime = new Date(dtTime.getFullYear(), dtTime.getMonth(), dtTime.getDate(), 23, 59, 59, 59).getTime();
                    break;
                case "custom" :
                    if(taskDesigner.rangeForActiveJobs)
                    {
                        startTime = taskDesigner.rangeForActiveJobs[0];
                        endTime = taskDesigner.rangeForActiveJobs[1];
                    }
                    else
                    {
                        startTime = new Date(endTime - (60 * msInMinute)).getTime();
                    }
                    break;
                default:
                    break;
            }
            var lstJobs = $("#activeScheduleList");
            lstJobs.isolatedScroll();
            var lastJobListUpdatedTimestamp = $("#lastJobListUpdatedTimestamp");
            var selectedId = lstJobs.find(".ui-widget-header").attr("taskId");
            var loadingActiveJobs = $("#loadingActiveJobs").show();
            taskDesigner.fetchingActiveJobs = true;
            var data = {
                command: "getJobsSummary",
                start_time : startTime,
                end_time : endTime + 10000
            };
            var filter = $("#filterActiveSchedules").val();
            if(filter)
                data.filter = filter;
            var hideUserActiveSchedules = $("#hideUserActiveSchedules").is(":checked");
            data.hideUserActiveSchedules = hideUserActiveSchedules;
            crushFTP.data.serverRequest(data,
            function(response){
                taskDesigner.fetchingActiveJobs = false;
                var items = false;
                loadingActiveJobs.hide();
                if(response && $(response).find("response_data").length>0)
                {
                    if(response.getElementsByTagName("response_data") && response.getElementsByTagName("response_data").length > 0)
                    {
                        response = response.getElementsByTagName("response_data")[0];
                        items = $.xml2json(response);
                    }
                }
                var availableRunningJobs = [];
                var retrievedRunningJobs = [];
                var selectedJobs = [];
                lstJobs.find('li').each(function(index, el) {
                    availableRunningJobs.push($(this).attr("taskId"));
                    if ($(this).find(".scheduleSelection").is(":checked")) {
                        selectedJobs.push($(this).attr("taskId"));
                    }
                });
                lstJobs.empty();

                $("#totalActiveJobCount").text("0");
                if(items)
                {
                    var curIndex = 0;
                    adminPanel.UI.multiOptionControlDataBind(items
                        , "running_tasks"
                        , lstJobs
                        , function(curItem){
                            var status = curItem.status &&  curItem.status.length>0 ? curItem.status : false;
                            retrievedRunningJobs.push(curItem.id);
                            if(status && status != "undefined")
                            {
                                if(statusFilter && status.toLowerCase() != statusFilter.toLowerCase() && statusFilter.toLowerCase() != "all" && curItem.end != -1)
                                {
                                    return false;
                                }
                                else
                                {
                                    var start = curItem.start &&  curItem.start.length>0? new Date(parseFloat(curItem.start)) : false;
                                    var end =  curItem.end &&  curItem.end.length>0? new Date(parseFloat(curItem.end)) : false;
                                    var diff = "";
                                    if(start && end)
                                    {
                                        var dateDiff = (end.diff(start));
                                        function pad(n) {
                                            return (n < 10) ? ("0" + n) : n;
                                        }
                                        diff = " (" + dateDiff.hours + ":" + pad(dateDiff.minutes) + ":" + pad(dateDiff.seconds) + ") ";
                                    }
                                    var scheduleName = "";
                                    var pluginName = "";
                                    var subItemName = "";
                                    var curSettings = curItem.settings;
                                    if(hideUserActiveSchedules && curSettings.scheduleName.indexOf("_")==0)
                                        return false;
                                    if(curSettings)
                                    {
                                        if(curSettings.scheduleName && curSettings.scheduleName.length>0 && curSettings.scheduleName)
                                        {
                                            scheduleName = curSettings.scheduleName;
                                        }
                                        if(curSettings.pluginName && curSettings.pluginName.length>0 && curSettings.pluginName)
                                        {
                                            pluginName = " : " + curSettings.pluginName;
                                        }
                                        if(curSettings.subItem && curSettings.subItem.length>0 && curSettings.subItem)
                                        {
                                            subItemName = " : " + curSettings.subItem;
                                        }
                                    }
                                    curIndex += 1;
                                    var _start = start ? dateFormat(start, "yyyy-mm-dd HH:MM:ss") : "";
                                    var _end = end ? dateFormat(end, "yyyy-mm-dd HH:MM:ss") : "";
                                    //lstJobs.find('li[taskId="'+curItem.id+'"]').remove();
                                    return $("<li scheduleID='"+curSettings.id+"' scheduleName='"+crushFTP.methods.textEncode(unescape(curSettings.scheduleName))+"' taskId='"+crushFTP.methods.textEncode(curItem.id)+"' _index='"+curIndex+"' style=';line-height:17px;' logfile='"+crushFTP.methods.textEncode(curItem.log_file)+"'><div class='task_status task_"+status.toLowerCase()+"'><span class='schedule' style='top:0px;'></span><span class='listText'>" + status.toUpperCase() + " : " + crushFTP.methods.textEncode(scheduleName) + crushFTP.methods.textEncode(pluginName) + crushFTP.methods.textEncode(subItemName) + " <br><span class='jobsListInfo'>" + _start + " - " + _end + diff + '</span>' +"</span></div></li>");
                                }
                            }
                        }, false, false, true, true
                    );
                    $("#totalActiveJobCount").text(curIndex);

                    lstJobs.find("li").each(function(){
                        var checked = "";
                        if (selectedJobs.has($(this).attr("taskId")))
                            checked = "checked='checked'";
                        $(this).find("div:first").prepend("<span class='checkItem'><input type=\"checkbox\" "+checked+" class=\"scheduleSelection\" /></span>").form(true);
                    }).end().find("span.ui-state-default").click(function(evt){
                        evt.stopPropagation();
                        evt.preventDefault();
                        return false;
                    });

                    if(taskDesigner.jobsSummaryTimeLastEnd)
                    {
                        for (var i = 0; i < availableRunningJobs.length; i++) {
                             if(!retrievedRunningJobs.has(availableRunningJobs[i]))
                             {
                                lstJobs.find('li[taskId="'+availableRunningJobs[i]+'"]').remove();
                             }
                        };
                    }
                    taskDesigner.last_searched_running = false;
                    $("#filterActiveSchedules").trigger('keyup');
                    var now = new Date();
                    lastJobListUpdatedTimestamp.text(dateFormat(now, "mediumTime"));
                    var lastJobListUpdatedRange = $("#lastJobListUpdatedRange");

                    var startDt="", endDt="";
                    try{
                        startDt = dateFormat(new Date(startTime), "mixDateTime");
                    }catch(ex){
                        startDt = startTime;
                    }
                    try{
                        endDt = dateFormat(new Date(endTime), "mixDateTime");
                    }catch(ex){
                        endDt = endTime;
                    }
                    if(startDt && endDt)
                        lastJobListUpdatedRange.text("("+startDt + " to " + endDt+")");
                    else
                        lastJobListUpdatedRange.text("");
                    taskDesigner.bindActiveJobEvents(true);
                    var activeJob = taskDesigner.activeJobToMonitor;
                    if(activeJob)
                    {
                        activeJob = activeJob.split("||");
                        var jobID = activeJob[0];
                        if(jobID)
                            selectedId = jobID;
                    }
                    if(selectedId)
                    {
                        lstJobs.find('li.ui-widget-header').removeClass('ui-widget-header').removeClass('ui-selected');
                        var loaded = lstJobs.find("li[taskId='"+selectedId+"']:first").addClass("ui-widget-header");
                        if(loaded && loaded.length>0)
                        {
                            loaded.trigger("click.bindData");
                        }
                    }
                }
                if(callback)
                    callback();
                return;
            });
        });


    },
    bindActiveJobEvents : function(onlyListEvents){
        var lastJobLogUpdatedTimestamp = $("#lastJobLogUpdatedTimestamp");
        var lstJobs = $("#activeScheduleList");
        lstJobs.find("li").unbind("onSelect").bind("onSelect", function(){
            var selected = $(this);
            if(selected && selected.length>0)
            {
                var scheduleName = selected.attr("scheduleName");
                var taskId = false;
                if(scheduleName)
                {
                    function continueLoading(){
                        if(window._curUserPrivs && (window._curUserPrivs.indexOf("(CONNECT)")<0 && window._curUserPrivs.indexOf("(JOB_VIEW)")<0 && window._curUserPrivs.indexOf("(JOB_MONITOR)")<0))
                        {
                            crushFTP.UI.growl("Error", "You don't have rights to view job details.", true, 3000);
                            return;
                        }
                        lstJobs.find("li.ui-widget-header").removeClass('ui-widget-header').removeClass('ui-selected');
                        taskId = selected.addClass("ui-widget-header").attr("taskId");
                        if(taskId)
                        {
                            if(taskDesigner.activeJobToMonitor == taskId + "||" + scheduleName)
                            {
                                return false;
                            }
                            else if(taskDesigner.activeJobToMonitor)
                            {
                                taskDesigner.clearActiveJobData();
                            }
                            taskDesigner.isLogVisible = $("#rdbLog").is(":checked");
                            taskDesigner.isUserLogVisible = $("#rdbUserLog").is(":checked");
                            $("#rdbDesigner").attr("checked","checked");
                            $("#activejobTabs").tabs({active: 0});
                            if($("#existingJobsPanel").is(":visible"))
                                $("#existingJobsBtn").trigger("click");
                            $("#activejobTabsUserLogButton").hide();
                            var data = selected.data("controlData");
                            taskDesigner.activeJobToMonitor = taskId + "||" + scheduleName;
                            if (data) {
                                taskDesigner.activeJobLogFile = data.log_file;
                                taskDesigner.activeJobUserLogFile = data.user_log_path || taskDesigner.activeJobUserLogFile;
                                if(taskDesigner.activeJobUserLogFile)
                                    $("#activejobTabsUserLogButton").show();
                            }
                            taskDesigner.loadedActiveJobToMonitor =
                            taskDesigner.activeJobDataLoaded = false;
                            taskDesigner.notifyActiveJob();
                            taskDesigner.monitorActiveJob();
                        }
                        else
                        {
                            taskDesigner.clearActiveJobData();
                        }
                    }

                    if(taskDesigner.hasChanges && !taskDesigner.monitoringActiveJob)
                    {
                        jConfirm("If you navigate away, you will lose your unsaved changes. Do you want to continue?", "Confirm", function(value){
                            if(value)
                            {
                                taskDesigner.hasPendingChanges(false);
                                continueLoading();
                            }
                            else
                            {
                                if($("#existingJobsPanel").is(":visible"))
                                    $("#existingJobsBtn").trigger("click");
                            }
                        },
                        {
                            prependButtons : [{
                                button : '<a href="javascript:void(0);" id="popup_continue" class="button" tabIndex="0" style="margin-right:10px;"><span style="display:inline-block;margin:-1px 3px 0px -7px;float:left;" class="pointer ui-icon ui-icon-disk"></span><span class="submitActionSaveAndContinue">Save & Continue</span></a>&nbsp;&nbsp;',
                                clickEvent : function(){
                                    $("#saveChanges").trigger("click", [{fromSaveAndContinue:true, callBack : function(flag){
                                        if(flag)
                                        {
                                           $("#popup_cancel").click();
                                           continueLoading();
                                        }
                                        else
                                        {
                                            $("#popup_cancel").click();
                                            if($("#existingJobsPanel").is(":visible"))
                                                $("#existingJobsBtn").trigger("click");
                                        }
                                    }}]);
                                }
                            }],
                            okButtonText : "Discard Changes",
                            okButtonClassAdd : "ui-icon-trash"
                        });
                        return false;
                    }
                    else
                    {
                        continueLoading();
                        return false;
                    }
                }
            }
            return;
        });

        lstJobs.find("li").unbind("click").bind("click", function(){
            /*if($(this).hasClass("ui-widget-header"))
                return false;*/
            lstJobs.find("li.ui-widget-header").removeClass("ui-widget-header").removeClass('ui-selected');
            $(this).addClass("ui-widget-header").trigger("onSelect");
            return;
        });
        var context = $("#activeJobsContext");
        lstJobs.find("li").contextMenu({
                menu: "activeJobsContext",
                topPadding : 0,
                leftPadding : 20
            },
            function(action, el, pos) {
                var jobID = el.attr("taskid");
                var scheduleName = el.attr("scheduleName");
                if(action == "monitor")
                {
                    el.trigger('click');
                }
                else if(action == "resume")
                {
                    taskDesigner.updateJobsStatus(jobID, scheduleName, "running");
                }
                else if(action == "pause")
                {
                    taskDesigner.updateJobsStatus(jobID, scheduleName, "paused");
                }
                else if(action == "stop")
                {
                    taskDesigner.updateJobsStatus(jobID, scheduleName, "cancelled");
                }
                else if(action == "retry")
                {
                    taskDesigner.updateJobsStatus(jobID, scheduleName, "restart");
                }
                else if(action == "restart")
                {
                    taskDesigner.runJobByName(scheduleName, true);
                }
                else if(action == "resumeSelected")
                {
                    taskDesigner.activeSelectedAction("resume");
                }
                else if(action == "restartSelected")
                {
                    taskDesigner.activeSelectedAction("restart");
                }
                else if(action == "pauseSelected")
                {
                    taskDesigner.activeSelectedAction("pause");
                }
                else if(action == "stopSelected")
                {
                    taskDesigner.activeSelectedAction("stop");
                }
                else if(action == "viewlog")
                {
                    var logFile = el.attr("logFile");
                    var jobLiveLogViewer = $("#jobLiveLogViewer").html('<iframe id="jobLiveLogViewerFrame" width="99%" height="99%" marginWidth="0" marginHeight="0" frameBorder="0" style="margin:0px;padding:0px;" scrolling="auto"></iframe>');
                    $("#jobLiveLogViewerFrame").attr("src", "/WebInterface/admin/log.html?embed=true&file="+logFile);
                    jobLiveLogViewer.dialog("open");
                }
        }).bind("onBeforeContextMenu", function(){
            var data = $(this).data("controlData");
            var status = data.status;
            context.find(".single").show();
            if(status == "completed" || status == "completed-errors" || status == "polling" || status == "cancelled" || status == "error")
            {
                if(status == "completed" || status == "completed-errors" || status == "polling" || status == "cancelled")
                {
                    $(".resumeJob.single,.pauseJob.single,.stopJob.single", context).addClass('ui-state-disabled');
                    $(".restartJob.single", context).removeClass('ui-state-disabled');
                }
                if (status == "completed-errors" || status == "error" || status == "cancelled") {
                    $(".retryJob.single", context).removeClass('ui-state-disabled');
                }
                else {
                    $(".retryJob.single", context).addClass('ui-state-disabled');
                }
            }
            else
            {
                $(".pauseJob.single,.stopJob.single", context).removeClass('ui-state-disabled');
                $(".resumeJob.single,.restartJob.single", context).addClass('ui-state-disabled');
                if(status == "paused"){
                    $(".resumeJob.single", context).removeClass('ui-state-disabled');
                    $(".pauseJob.single", context).addClass('ui-state-disabled');
                }
            }
        });

        $("#batchActions").contextMenu({
                menu: "activeJobsContext",
                topPadding : -10,
                leftPadding : 20,
                openOnClick : true
            },
            function(action, el, pos) {
                if(action == "resumeSelected")
                {
                    taskDesigner.activeSelectedAction("resume");
                }
                else if(action == "retrySelected")
                {
                    taskDesigner.activeSelectedAction("retry");
                }
                else if(action == "restartSelected")
                {
                    taskDesigner.activeSelectedAction("restart");
                }
                else if(action == "pauseSelected")
                {
                    taskDesigner.activeSelectedAction("pause");
                }
                else if(action == "stopSelected")
                {
                    taskDesigner.activeSelectedAction("stop");
                }
        }).bind("onBeforeContextMenu", function(){
            context.find(".single").hide();
        });

        if(!onlyListEvents)
        {
            $("a#reloadActiveJobs").click(function(){
                taskDesigner.bindActiveJobs(false, false, true);
                return false;
            });
        }
    },
    setupPolling : function(){
        var iteration = 0;
        if (!taskDesigner.pollingThread) {
            var lstJobs = $("#activeScheduleList");
            taskDesigner.pollingThread = setInterval(
                function(){
                    if(lstJobs.is(":visible"))
                    {
                        var range = $("#rangeSelector").val();
                        if(range == "10mins" || range == "hour")
                        {
                            //Autorefresh only for 10 mins or last hour as it kills server with huge list
                            // if(range == "custom")
                            // {
                            //     if(taskDesigner.rangeForActiveJobs)
                            //     {
                            //         var endTime = new Date(taskDesigner.rangeForActiveJobs[1]);
                            //         var curDate = new Date();
                            //         if(parseInt((curDate.getTime() - endTime.getTime())/(24*3600*1000))<=1)
                            //             taskDesigner.bindActiveJobs();
                            //     }
                            // }
                            // else
                            taskDesigner.bindActiveJobs();
                        }
                    }
                    if(taskDesigner.activeJobToMonitor)
                    {
                        taskDesigner.activeJobStatus = taskDesigner.activeJobStatus || "completed";
                        taskDesigner.activeJobStatus = taskDesigner.activeJobStatus.toLowerCase();
                        var curStatus = taskDesigner.monitoringActiveJob;
                        taskDesigner.monitoringActiveJob = true;
                        if(taskDesigner.activeJobStatus == "running" || taskDesigner.activeJobStatus == "canceling" || taskDesigner.activeJobStatus == "cancelling")
                        {
                            setTimeout(function(){
                                taskDesigner.monitorActiveJob();
                            }, 1000);
                            iteration = 0;
                            taskDesigner.canvas.find(".ui-draggable").draggable("disable");
                        }
                        else
                        {
                            taskDesigner.canvas.find(".ui-draggable").draggable("enable");
                            if(taskDesigner.activeJobStatus == "paused")
                            {
                                //taskDesigner.monitoringActiveJob = false;
                                iteration++;
                                if(iteration==5)
                                {
                                    iteration = 0;
                                    setTimeout(function(){
                                        taskDesigner.monitorActiveJob();
                                    }, 1000);
                                }
                            }
                        }
                        taskDesigner.notifyActiveJob();
                        if(curStatus != taskDesigner.monitoringActiveJob)
                        {
                            taskDesigner.bindItemEvents();
                        }
                    }
                }
            , 1000);
        }
    },
    notifyActiveJob : function(end)
    {
        if(end)
        {
            $(".activeJobItem").hide();
            $("#runJob, #runJob2, #newTaskDragButton, #removeBreakpoints, #addBreakpointsAll").show();
            taskDesigner.showCopyTasksButton();
            taskDesigner.showPasteTasksButton();
            taskDesigner.canvas.removeClass("activeJob");
            $("#GUIAdmin").removeClass('monitoringActiveJob');
            if(!$("#saveChanges").hasClass('hidden-by-replication')){
                $(".saveJobsButton").show();
            }
            else{
                $(".replicationSaveHelper").show();
            }
            $("#runJob, #runJob2").removeClass('ui-state-disabled');
        }
        else
        {
            $(".activeJobItem").show();
            $("#runJob, #runJob2, #removeBreakpoints, #addBreakpointsAll, #copyTasks, #removeTasks #pasteTasks, #undoPasteTasks").hide();
            taskDesigner.canvas.addClass("activeJob");
            $("#GUIAdmin").addClass('monitoringActiveJob');
            if(taskDesigner.monitoringActiveJob)
            {
                $(".saveJobsButton").hide();
                setTimeout(function(){
                    $("#newTaskDragButton").hide();
                });
            }
            else
            {
                if(!$("#saveChanges").hasClass('hidden-by-replication')){
                    $(".saveJobsButton").show();
                }
                else{
                    $(".replicationSaveHelper").show();
                }
                setTimeout(function(){
                    $("#newTaskDragButton").show();
                });
            }
        }
    },
    monitorActiveJob : function(){
        var activeJob = taskDesigner.activeJobToMonitor;
        if(activeJob)
        {
            crushFTP.UI.checkUnchekInput($("#jobsScheduleList").find("input[type='checkbox']"), false);
            $("#jobsScheduleList").find(".ui-state-focus").removeClass('loadedSchedule ui-state-focus');
            if(taskDesigner.lastJobInfoRequestPending)
                return;
            if(taskDesigner.activeItemsCount)
            {
                for(var item in taskDesigner.activeItemsCount)
                {
                    if(item && item.endsWith && !item.endsWith("_con"))
                    {
                        taskDesigner.activeItemsCount[item] = -1;
                    }
                }
            }
            taskDesigner.lastJobInfoRequestPending = true;
            activeJob = activeJob.split("||");
            var jobID = activeJob[0];
            var scheduleName = activeJob[1];
            var loader = $("#activeJobNote").find(".loader").show();
            var isItFirstTime = taskDesigner.activeJobToMonitor != taskDesigner.loadedActiveJobToMonitor;
            var obj = {
                command: "getJobInfo",
                job_id : jobID,
                scheduleName : scheduleName
            };

            if(isItFirstTime)
            {
                taskDesigner.loadedActiveJobToMonitor = taskDesigner.activeJobToMonitor;
            }
            else
            {
                obj.extra_keys = "";
            }
            var xml;
            crushFTP.data.serverRequest(obj,
            function(response){
                loader.hide();
                var items = false, data;
                if(response && response.getElementsByTagName)
                {
                    if(response.getElementsByTagName("response_data") && response.getElementsByTagName("response_data").length > 0)
                    {
                        data = response.getElementsByTagName("response_data")[0];
                        xml = data;
                        items = $.xml2json(data);
                        if(isItFirstTime)
                        {
                            taskDesigner.activeJobAllData = items;
                        }
                    }
                }
                if(items.running_tasks && items.running_tasks.running_tasks_subitem)
                {
                    var now = new Date();
                    $("#lastUpdatedActiveJobStamp").text(dateFormat(now, "mediumTime"));
                    var dataItem = items.running_tasks.running_tasks_subitem;
                    var curJobSettings = dataItem.settings;

                    function continueMonitoring() {
                        var taskId = jobID;
                        if(taskId)
                        {
                            var data = curJobSettings;
                            taskDesigner.activeJobToMonitor = taskId + "||" + scheduleName;
                            if(!taskDesigner.activeJobUserLogFile)
                                $("#activejobTabsUserLogButton").hide();
                            if (data) {
                                taskDesigner.activeJobLogFile = dataItem.log_file;
                                taskDesigner.activeJobUserLogFile = dataItem.user_log_path || taskDesigner.activeJobUserLogFile;
                                if(taskDesigner.activeJobUserLogFile)
                                    $("#activejobTabsUserLogButton").show();
                            }

                            taskDesigner.notifyActiveJob();
                            if(taskDesigner.isLogVisible)
                            {
                                $("#rdbLog").attr("checked","checked");
                                $("#activejobTabs").tabs({active: 1});
                                taskDesigner.isLogVisible = false;
                            }
                        }
                        else
                        {
                            taskDesigner.clearActiveJobData();
                        }
                        if(dataItem.status.toLowerCase() == "polling")
                            $("#activeJobStatus").text("Completed ("+dataItem.status+")");
                        else
                            $("#activeJobStatus").text(dataItem.status);
                        taskDesigner.activeJobStatus = dataItem.status;
                        var activeItems = dataItem.active_items;
                        crushFTP.methods.rebuildSubItems(activeItems, "active_items");

                        var jobConnections = dataItem.connections;
                        crushFTP.methods.rebuildSubItems(jobConnections, "connections");
                        if(jobConnections && jobConnections.connections_subitem && jobConnections.connections_subitem.length)
                        {
                            for (var i = 0; i < jobConnections.connections_subitem.length; i++) {
                                var conId = jobConnections.connections_subitem[i].connectionID;
                                var type = jobConnections.connections_subitem[i].type;

                                if(type == "start")
                                {
                                    taskDesigner.drawLine(taskDesigner.canvas.find("#StartPointPanel").find(".taskSuccessActionPoint"), taskDesigner.canvas.find("#task_"+ conId), "true", true, "#E6ECD3", "1 2");
                                }
                            };
                        }
                        if(activeItems && activeItems.active_items_subitem && activeItems.active_items_subitem.length>0)
                        {
                            try{
                                activeItems =  activeItems.active_items_subitem;
                                for (var i = 0; i < activeItems.length; i++) {
                                    var isMiniature = false;
                                    var parentTaskId;
                                    var curItem = activeItems[i];
                                    var ID = curItem.connectionId || curItem.connectionID;
                                    var taskPanel = $("#task_" + ID);
                                    if(taskPanel.length==0)
                                    {
                                        taskPanel = $('[uid="'+ID+'"]');
                                        if(taskPanel.length>0 && taskPanel.hasClass('miniature')){
                                            isMiniature = true;
                                            try{
                                                parentTaskId = taskPanel.attr("id").split("_")[1];
                                            }catch(ex){}
                                        }
                                    }
                                    if(curItem.prefs && curItem.prefs.connections)
                                    {
                                        crushFTP.methods.rebuildSubItems(curItem.prefs.connections, "connections");
                                    }

                                    function getTask(_id){
                                        crushFTP.methods.rebuildSubItems(taskDesigner.activeJobAllData.running_tasks.running_tasks_subitem.settings.tasks, "tasks");
                                        var tasks = taskDesigner.activeJobAllData.running_tasks.running_tasks_subitem.settings.tasks.tasks_subitem;
                                        for (var i = 0; i < tasks.length; i++) {
                                            if(tasks[i].connectionID == _id)
                                            {
                                                return tasks[i];
                                            }
                                        }
                                        if(taskDesigner.linkedItemsTasks)
                                        {
                                            for (task in taskDesigner.linkedItemsTasks) {
                                                var curTask = taskDesigner.linkedItemsTasks[task];
                                                for (var i = 0; i < curTask.length; i++) {
                                                    if(curTask[i].connectionID == _id)
                                                    {
                                                        return curTask[i];
                                                    }
                                                }
                                            }
                                        }
                                        return false;
                                    }

                                    function getConnectionType(id)
                                    {
                                        var task = getTask(ID);
                                        if(!task)
                                            return "";
                                        var _type = task.type || "";
                                        _type = _type.toLowerCase();
                                        if(_type == "jump")
                                        {
                                            if(task.jump_task_id == id)
                                                return {type:"jumptrue", multiple:false};
                                            else if(task.jump_false_task_id == id)
                                                return {type:"jumpfalse", multiple:false};
                                        }
                                        else if(_type == "userslist")
                                        {
                                            if(task.taskToCall == id)
                                                return {type:"jumptrue", multiple:false};
                                        }
                                        var type = "";
                                        var multiple = false;
                                        if(task && task.connections && task.connections.connections_subitem)
                                        {
                                            crushFTP.methods.rebuildSubItems(task.connections, "connections");
                                            var cons = task.connections.connections_subitem;
                                            for (var j = 0; j < cons.length; j++) {
                                                if(cons[j].connectionID == id)
                                                {
                                                    if(type)
                                                        multiple = true;
                                                    type = cons[j].type;
                                                }
                                            };
                                        }
                                        return {
                                            type: type,
                                            multiple : multiple
                                        };
                                    }
                                    var nextIds = curItem.next_id ? curItem.next_id.split(",") : [];
                                    nextIds = nextIds.filter(function(item, pos, self) {
                                        return self.indexOf(item) == pos;
                                    });
                                    nextIds = nextIds.sort();
                                    for (var k = 0; k < nextIds.length; k++) {
                                        var nextId = nextIds[k];
                                        if(nextId && nextId.toString() != "null")
                                        {
                                            var nextConDetails = getConnectionType(nextId);
                                            var type = nextConDetails.type || "";
                                            if(typeof curItem.error !="undefined" && curItem.error){
                                                type = "failure";
                                                taskPanel.find(".errorMsg").remove();
                                                taskPanel.find("fieldset:first").before('<div class="errorMsg err">Error : '+curItem.error+'</div>');
                                            }
                                            else if(nextConDetails.multiple)
                                                type = "success";
                                            type = type.toLowerCase();
                                            var point = false;
                                            if(type == "success")
                                            {
                                                point = taskPanel.find("span.taskSuccessActionPoint:first:visible");
                                            }
                                            else if(type == "failure")
                                            {
                                                point = taskPanel.find("span.taskFailureActionPoint:first:visible");
                                            }
                                            else if(type == "jumptrue")
                                            {
                                                point = taskPanel.find("span.taskJumpTrueActionPoint:first:visible");
                                            }
                                            else if(type == "jumpfalse")
                                            {
                                                point = taskPanel.find("span.taskJumpFalseActionPoint:first:visible");
                                            }
                                            var nextTask = taskDesigner.canvas.find('[uid="'+nextId+'"]');
                                            if(nextId == "EndPoint"){
                                                if(isMiniature)
                                                {
                                                    nextTask = taskDesigner.canvas.find(".crushEndActionItem", point.closest(".linkTaskPreview"));
                                                }
                                            }
                                            if(point && point.length>0 && point.hasClass('miniature') && !nextTask.hasClass('miniature'))
                                            {
                                                if(type == "success")
                                                {
                                                    point = taskPanel.find("span.taskSuccessActionPoint:not(.miniature):first:visible");
                                                }
                                                else if(type == "failure")
                                                {
                                                    point = taskPanel.find("span.taskFailureActionPoint:not(.miniature):first:visible");
                                                }
                                                else if(type == "jumptrue")
                                                {
                                                    point = taskPanel.find("span.taskJumpTrueActionPoint:not(.miniature):first:visible");
                                                }
                                                else if(type == "jumpfalse")
                                                {
                                                    point = taskPanel.find("span.taskJumpFalseActionPoint:not(.miniature):first:visible");
                                                }
                                            }
                                            else if(point && point.length>0 && !point.hasClass('miniature') && nextTask.hasClass('miniature'))
                                            {
                                                var pnl = nextTask.closest(".linkTaskPreview");
                                                if(type == "success")
                                                {
                                                    point = pnl.find('[uid*="StartPoint"]');
                                                }
                                                else
                                                    point = false;
                                            }
                                            if(point && point.length>0  && point.hasClass("activeLink_" + nextId)){
                                                if(taskDesigner.activeItemsCount[nextId]){
                                                    if(taskDesigner.activeItemsCount[nextId]<0){
                                                        taskDesigner.activeItemsCount[nextId] = 0;
                                                    }
                                                    taskDesigner.activeItemsCount[nextId] ++
                                                }
                                                else
                                                    taskDesigner.activeItemsCount[nextId] = 1;
                                            }
                                            if(point && point.length>0 && !point.hasClass("activeLink_" + nextId))
                                            {
                                                point.addClass("activeLink_" + nextId);
                                                var label = false;
                                                if(taskDesigner.activeItemsCount[nextId]>1)
                                                    label = taskDesigner.activeItemsCount[nextId].toString();
                                                if(nextId == "EndPoint"){
                                                    if(point.hasClass('miniature'))
                                                    {
                                                        taskDesigner.resetLinkPreviewPanel(point.closest(".linkTaskPreview")[0], 1);
                                                        var canvas = point.closest(".linkTaskPreview");
                                                        jsPlumb.Defaults.Container = canvas;
                                                        taskDesigner.activeItemsCount[nextId+"_con"] = taskDesigner.drawLine(point, taskDesigner.canvas.find(".crushEndActionItem", point.closest(".linkTaskPreview")), "true", true, "#E6ECD3", "1 2", label ,canvas);
                                                        taskDesigner.resetLinkPreviewPanel(point.closest(".linkTaskPreview")[0]);
                                                        jsPlumb.Defaults.Container = taskDesigner.canvas;
                                                    }
                                                    else
                                                        taskDesigner.activeItemsCount[nextId+"_con"] = taskDesigner.drawLine(point, taskDesigner.canvas.find("#EndPoint"), "true", true, "#E6ECD3", "1 2", label);
                                                }
                                                else{
                                                    var nxtItm = taskDesigner.canvas.find('[uid="'+nextId+'"]');
                                                    if(point.hasClass('miniature'))
                                                    {
                                                        var canvas = point.closest(".linkTaskPreview");
                                                        jsPlumb.Defaults.Container = canvas;
                                                        taskDesigner.resetLinkPreviewPanel(point.closest(".linkTaskPreview")[0], 1);
                                                        taskDesigner.activeItemsCount[nextId+"_con"] = taskDesigner.drawLine(point, nxtItm, "true", true, "#E6ECD3", "1 2", label, canvas);
                                                        taskDesigner.resetLinkPreviewPanel(point.closest(".linkTaskPreview")[0]);
                                                        jsPlumb.Defaults.Container = taskDesigner.canvas;
                                                    }
                                                    else if(nxtItm.hasClass('miniature'))
                                                    {
                                                        var canvas = nxtItm.closest(".linkTaskPreview");
                                                        jsPlumb.Defaults.Container = canvas;
                                                        taskDesigner.resetLinkPreviewPanel(nxtItm.closest(".linkTaskPreview")[0], 1);
                                                        taskDesigner.activeItemsCount[nextId+"_con"] = taskDesigner.drawLine(point, nxtItm, "true", true, "#E6ECD3", "1 2", label, canvas);
                                                        taskDesigner.resetLinkPreviewPanel(nxtItm.closest(".linkTaskPreview")[0]);
                                                        jsPlumb.Defaults.Container = taskDesigner.canvas;
                                                    }
                                                    else
                                                        taskDesigner.activeItemsCount[nextId+"_con"] = taskDesigner.drawLine(point, nxtItm, "true", true, "#E6ECD3", "1 2", label);
                                                }
                                            }
                                            if(point && point.length>0 && point.hasClass("activeLink_" + nextId)){
                                                var label = false;
                                                if(taskDesigner.activeItemsCount[nextId]>1)
                                                    label = taskDesigner.activeItemsCount[nextId];
                                                if(label)
                                                {
                                                    var curCon = taskDesigner.activeItemsCount[nextId+"_con"];
                                                    if(curCon && typeof curCon.getOverlays != "undefined")
                                                    {
                                                        var overlays = curCon.getOverlays();
                                                        var hasLabel = false;
                                                        for (var l = 0; l < overlays.length; l++) {
                                                            if(overlays[l].type == "Label" && overlays[l].id == "loop-label")
                                                            {
                                                                overlays[l].setLabel(label.toString() + "");
                                                                hasLabel = true;
                                                            }
                                                        }
                                                        if(!hasLabel)
                                                        {
                                                            curCon.addOverlay([ "Label", { label:label+"", id:"loop-label", cssClass:"loop-label"} ])
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    };

                                    if(taskPanel.length>0)
                                    {
                                        if(curItem.status == "active")
                                        {
                                            taskPanel.highlightTaskItem();
                                        }
                                        else if(curItem.status == "done")
                                        {
                                            taskPanel.highlightTaskItem(true);
                                        }
                                    }
                                    if(curItem.items)
                                    {
                                        crushFTP.methods.rebuildSubItems(curItem.items, "items");
                                    }
                                    if(curItem.newItems)
                                    {
                                        crushFTP.methods.rebuildSubItems(curItem.newItems, "newItems");
                                    }
                                    var items = curItem.items ? curItem.items.items_subitem : [];
                                    var newItems = curItem.newItems ? curItem.newItems.newItems_subitem : [];

                                    (function(index, itm){
                                        var condId = itm.connectionId;
                                        var curActiveItem = $(response).find("connectionId:contains('"+condId+"'):first").parent();
                                        var _items = curActiveItem.find("items_subitem");
                                        var _newItems = curActiveItem.find("newItems_subitem");
                                        var _ind = 0;
                                        newItems.forEach(function(curRec){
                                            var curNI = _newItems.get(_ind);
                                            $(curNI).find("*").each(function(){
                                                var tagName = $(this).attr("name") || $(this)[0].tagName;
                                                var value = $(this).text();
                                                curRec[tagName] = value;
                                            });
                                            delete curRec.item;
                                            _ind++;
                                        });
                                        var _ind = 0;
                                        items.forEach(function(curRec){
                                            var curNI = _items.get(_ind);
                                            $(curNI).find("*").each(function(){
                                                var tagName = $(this).attr("name") || $(this)[0].tagName;
                                                var value = $(this).text();
                                                curRec[tagName] = value;
                                            });
                                            delete curRec.item;
                                            _ind++;
                                        });
                                    })(k, curItem);

                                    var itemsCount = parseInt(curItem.items_count) || 0;
                                    var newItemsCount = parseInt(curItem.newItems_count) || 0;
                                    if((itemsCount) || (newItemsCount))
                                    {

                                        var crushTaskItemInfo = taskPanel.find(".crushTaskItemInfo").show();
                                        crushTaskItemInfo.html('<span class="ui-icon ui-icon-arrowthick-1-s" style="display: inline-block;top: 2px;position: relative;"></span><span style="position: relative;">'+itemsCount+'</span>&nbsp;<span class="ui-icon ui-icon-arrowthick-1-n" style="display: inline-block;top: 2px;position: relative;"></span><span style="position: relative;">'+newItemsCount+'</span>');
                                        if(items.length>0 || newItems.length>0)
                                        {
                                            crushTaskItemInfo.data("itemsInfo", {
                                                items : items,
                                                newItems : newItems
                                            });
                                        }
                                    }
                                    else
                                    {
                                        var crushTaskItemInfo = taskPanel.find(".crushTaskItemInfo").hide();
                                        crushTaskItemInfo.removeData("itemsInfo");
                                    }
                                    var taskProcessPanel = taskPanel.find(".taskProcess");
                                    if(curItem.the_file_loc)
                                    {
                                        if(taskProcessPanel.length == 0)
                                        {
                                            taskProcessPanel = $('<div class="taskProcess"><div class="progressbar"></div><div class="info"></div></div>');
                                            taskPanel.prepend(taskProcessPanel);
                                        }
                                        taskProcessPanel.show();
                                        var perc = Math.round((curItem.the_file_loc*100)/curItem.the_file_size);
                                        taskProcessPanel.find(".progressbar").progressbar({
                                            value: perc
                                        });
                                        var info = curItem.the_file_loc_f + " of "+crushFTP.methods.formatBytes(curItem.the_file_size)+" @ " + curItem.the_file_transfer_speed_f + " <small>("+perc+"%)</small>";
                                        taskProcessPanel.find(".info").html(info);
                                    }
                                    else
                                    {
                                        taskProcessPanel.hide();
                                    }
                                };
                            }
                            catch(ex)
                            {
                                console.log(ex);
                            }
                            taskDesigner.lastJobInfoRequestPending = false;
                        }
                        else
                        {
                            taskDesigner.lastJobInfoRequestPending = false;
                        }
                        if(taskDesigner.activeJobStatus == "completed" || taskDesigner.activeJobStatus == "completed-errors" || taskDesigner.activeJobStatus == "polling" || taskDesigner.activeJobStatus == "cancelled" || taskDesigner.activeJobStatus == "error")
                        {
                            if(taskDesigner.activeJobStatus == "completed" || taskDesigner.activeJobStatus == "completed-errors" || taskDesigner.activeJobStatus == "polling" || taskDesigner.activeJobStatus == "cancelled")
                            {
                                $("#pauseResumeJob,#cancelJob").addClass('ui-state-disabled');
                                $("#rerunJob").removeClass('ui-state-disabled');
                            }
                            if (taskDesigner.activeJobStatus == "completed-errors" || taskDesigner.activeJobStatus == "error" || taskDesigner.activeJobStatus == "cancelled") {
                                $("#retryJob").removeClass('ui-state-disabled');
                            }
                            else{
                                $("#retryJob").addClass('ui-state-disabled');
                            }
                            taskDesigner.canvas.find(".isAnimating").each(function(index){
                                var that = $(this);
                                that.highlightTaskItem(true);
                            });
                        }
                        else
                        {
                            $("#pauseResumeJob,#cancelJob").removeClass('ui-state-disabled');
                            $("#rerunJob").addClass('ui-state-disabled');
                            $("#retryJob").addClass('ui-state-disabled');
                        }
                    }
                    if(!taskDesigner.activeJobDataLoaded)
                    {
                        taskDesigner.processJobData(curJobSettings, xml, function(){
                            taskDesigner.activeJobDataLoaded = true;
                            continueMonitoring();
                        });
                    }
                    else
                    {
                        continueMonitoring();
                    }
                }
                else
                {
                    $("#activeJobStatus").text("Completed");
                    taskDesigner.activeJobStatus = "completed";
                    $("#pauseResumeJob,#cancelJob").addClass('ui-state-disabled');
                    $("#rerunJob").removeClass('ui-state-disabled');
                    taskDesigner.canvas.find(".isAnimating").each(function(index){
                        var that = $(this);
                        that.highlightTaskItem(true);
                    });
                    taskDesigner.lastJobInfoRequestPending = false;
                    if(!taskDesigner.pollingGrowlShown){
                        crushFTP.UI.growl("Message", "Job ran as a polling job and has been removed from the active job list until it finds items on its next run.", true);
                        taskDesigner.pollingGrowlShown = true;
                        setTimeout(function(){
                            taskDesigner.pollingGrowlShown = false;
                        }, 5000);
                    }
                }
            });
        }
    },
    confirmExit : function(){
        if(taskDesigner.hasChanges)
        {
            return "If you navigate away, you will lose your unsaved changes. Do you want to continue?";
        }
    },
    hasPendingChanges : function(flag)
    {
        if(taskDesigner.kioskData)
        {
            if(taskDesigner.kioskData && taskDesigner.kioskData.dataChangeCallback)
            {
                taskDesigner.kioskData.dataChangeCallback(flag);
            }
            return false;
        }
        if(taskDesigner.monitoringActiveJob)
        {
            taskDesigner.hasChanges = false;
            $("#showChangesNote").hide();
            $(".saveJobsButton").removeClass("ui-state-hover");
            return false;
        }
        if(flag)
        {
            if(!taskDesigner.loadedSchedule)
            {
                jAlert("You must create a Job first", "Create Job", function(){
                    $("#newJobsSchedule").trigger("click");
                });
                return false;
            }
            taskDesigner.hasChanges = true;
            $(".saveJobsButton").addClass("ui-state-hover");
            $("#showChangesNote").show();
        }
        else
        {
            taskDesigner.hasChanges = false;
            $("#showChangesNote").hide();
            $(".saveJobsButton").removeClass("ui-state-hover");
        }
    },
    isJobNameInUse : function(scheduleName)
    {
        var data = taskDesigner.availableJobsFlat;
        for (var i = 0; i < data.length; i++) {
            if($.trim(data[i].name.toLowerCase()) == $.trim(scheduleName.toLowerCase()))
                return true;
        };
        return false;
    },
    copySelectedJob: function(move){
        var jobsScheduleList = $("#jobsScheduleList");
        var toCopy = jobsScheduleList.find("input:checked:first").closest("li");
        var action = move ? "Move" : "Copy";
        if(toCopy.length>0)
        {
            var _index = toCopy.attr("_index");
            var _id = unescape(toCopy.attr("_id"));
            if(toCopy.hasClass('folder')){
                crushFTP.UI.growl("Error", "Please select a job to "+crushFTP.methods.htmlEncode(action), true, 3000);
                return false;
            }
            if(typeof _index != "undefined")
            {
                var jobName = toCopy.data("controlData");
                if(jobName){
                    taskDesigner.copiedJobName = jobName;
                    taskDesigner.jobSelectedToMove = move;
                    $("#pasteJobsSchedule").removeClass('ui-state-disabled');
                    crushFTP.UI.growl("Job copied: " + crushFTP.methods.htmlEncode(jobName.name), "Click on paste button to copy the job to current location", false, 3000);
                }
            }
            else
                crushFTP.UI.growl("Error", "Please select a job to "+crushFTP.methods.htmlEncode(action), true, 3000);
        }
        else
            crushFTP.UI.growl("Error", "Please select a job to "+crushFTP.methods.htmlEncode(action), true, 3000);
    },
    clearLoadedTaskData : function(){
        taskDesigner.data.items = [];
        delete taskDesigner.loadedSchedule;
        delete taskDesigner.data.canvasSize;
        delete taskDesigner.data.endPointPosition;
        delete taskDesigner.data.endPointZIndex;
        delete taskDesigner.data.startConnections;
        delete taskDesigner.data.startPointPosition;
        delete taskDesigner.data.startPointZIndex;
        taskDesigner.activeItemsCount = {};
        taskDesigner.clearActiveJobData();
    },
    clearActiveJobData : function()
    {
        $("#activeScheduleList").find("li.ui-widget-header").removeClass('ui-widget-header');
        delete taskDesigner.activeJobToMonitor;
        delete taskDesigner.activeJobLogFile;
        delete taskDesigner.activeJobUserLogFile;
        delete taskDesigner.activeJobStatus;
        delete taskDesigner.activeJobDataLoaded;
        delete taskDesigner.monitoringActiveJob;
        delete taskDesigner.loadedActiveJobToMonitor;
        taskDesigner.activeItemsCount = {};
        taskDesigner.notifyActiveJob(true);
    },
    showJobsSettings: function(){
        taskDesigner.settingsDialog.dialog("open");
    },
    addNewFolder : function(parent){
        if(!$(document).data("app_enterprise"))
        {
            jAlert('<div style="text-align:center">To use this feature, an Enterprise license is required.<br><br> To get more information on features and pricing, see the following links: <br><br><a href="http://crushftp.com/pricing.html#enterprise" tabIndex="-1" target="_blank">Plans &amp; Pricing</a> | <a href="http://www.crushftp.com/crush6wiki/Wiki.jsp?page=Enterprise%20License%20Enhancements" tabIndex="-1" target="_blank">Enterprise License Enhancements</a></div>', "This is an Enterprise License feature");
            return false;
        }
        var folderName = "", folderNameDisplay = "";
        if(parent || (taskDesigner.currentJobFolder && taskDesigner.currentJobFolder !== "/"))
        {
            folderName = parent || taskDesigner.currentJobFolder + "";
            if(!folderName.endsWith("/")){
                folderName = folderName + "/";
            }
            folderNameDisplay = folderName + "";
            if(!folderNameDisplay.startsWith("/")){
                folderNameDisplay = "/" + folderNameDisplay;
            }
        }
        jPrompt("Folder Name: ", "", "Input", function(newFolderName){
            if(newFolderName != null && newFolderName.length>0)
            {
                newFolderName = $.trim(newFolderName);
                newFolderName = folderName + newFolderName;
                if(newFolderName.indexOf("__") == 0){
                    jAlert("Name starting with '__' is reserved for temporary jobs, please use another name", "Error", function(){
                        $("#newFolder").trigger('click');
                    });
                    return false;
                }
                // if(taskDesigner.isJobNameInUse(newFolderName))
                // {
                //     jAlert("Job name is already in use, please use another name", "Error", function(){
                //         $("#newFolder").trigger('click');
                //     });
                //     return false;
                // }
                function continueAdding(){
                    taskDesigner.showLoading();
                    var obj = {
                        command: "makedirJob",
                        item_name : crushFTP.methods.htmlEncode(newFolderName)
                    };
                    if(crushFTP.replicationSavePrefs){
                        obj.ui_save_preferences_item = crushFTP.replicationSavePrefs;
                    }
                    crushFTP.data.serverRequest(obj, function(data){
                        var status = $.trim($(data).find("response_status").text());
                        if(status.toLowerCase().indexOf("failure")!=0)
                        {
                            crushFTP.UI.growl("Success", crushFTP.methods.htmlEncode(status), false, 5000);
                            taskDesigner.showLoading(true);
                            var selected = $("#jobsScheduleList").find("li.loadedSchedule");
                            var _sch = false;
                            if(selected.length>0)
                                _sch = unescape(selected.attr("_id"));
                            taskDesigner.updateJobsLocal("add", {
                                type: "DIR",
                                name: newFolderName
                            })
                            taskDesigner.bindData(true);
                            var jobFolders = $("#jobFolders").trigger('change');
                            if(_sch)
                            {
                                $("#jobsScheduleList").find("li[_id='"+escape(_sch)+"']").addClass('loadedSchedule');
                            }
                            $("#filterSchedules").removeData("last_searched").trigger('keyup', [true]);
                            setTimeout(function(){
                                $("#filterSchedules").removeData("last_searched").trigger('keyup', [true]);
                            },100);
                            // taskDesigner.showAvailableJobs(function(){
                            // });
                        }
                        else
                        {
                            crushFTP.UI.growl("Error while creating a new folder", "" + crushFTP.methods.htmlEncode(status), true);
                            taskDesigner.showLoading(true);
                        }
                    });
                }
                crushFTP.Replication.showOptionsOrContinue(continueAdding);
            }
        }, false, false, {
            prependBeforeInput: $("<strong>"+crushFTP.methods.htmlEncode(folderNameDisplay)+"</strong>")
        });
    },
    renameFolder : function(currentName, parent, cb){
        var folderName = "", folderNameDisplay = "", curFolderName = "";
        if(parent || (taskDesigner.currentJobFolder && taskDesigner.currentJobFolder !== "/"))
        {
            folderName = parent || taskDesigner.currentJobFolder + "";
            if(!folderName.endsWith("/")){
                folderName = folderName + "/";
            }
            folderNameDisplay = folderName + "";
            curFolderName = folderNameDisplay + "";
            if(!folderNameDisplay.startsWith("/")){
                folderNameDisplay = "/" + folderNameDisplay;
            }
            if(curFolderName.startsWith("/")){
                curFolderName = curFolderName.slice(1);
            }
        }
        jPrompt("Folder Name: ", currentName, "Input", function(newFolderName){
            if(newFolderName != null && newFolderName.length>0)
            {
                newFolderName = $.trim(newFolderName);
                // newFolderName = folderName + newFolderName;
                if(newFolderName.indexOf("__") == 0){
                    jAlert("Name starting with '__' is reserved for temporary jobs, please use another name", "Error", function(){
                        $("#newFolder").trigger('click');
                    });
                    return false;
                }
                function continueRenaming(){
                    taskDesigner.showLoading();
                    var obj = {
                        command: "renamedirJob",
                        item_name1 : crushFTP.methods.htmlEncode(curFolderName + currentName),
                        item_name2 : crushFTP.methods.htmlEncode(newFolderName)
                    };
                    if(crushFTP.replicationSavePrefs){
                        obj.ui_save_preferences_item = crushFTP.replicationSavePrefs;
                    }
                    crushFTP.data.serverRequest(obj, function(data){
                        var status = $.trim($(data).find("response_status").text());
                        if(status.toLowerCase().indexOf("failure")!=0)
                        {
                            crushFTP.UI.growl("Success", DOMPurify.sanitize(status), false, 5000);
                            taskDesigner.showLoading(true);
                            var selected = $("#jobsScheduleList").find("li.loadedSchedule");
                            var _sch = false;
                            if(selected.length>0)
                                _sch = unescape(selected.attr("_id"));
                            taskDesigner.updateJobsLocal("rename",
                            {
                                oldName: curFolderName + currentName,
                                name: newFolderName
                            });
                            // taskDesigner.showAvailableJobs(function(){
                            // });
                            taskDesigner.bindData();
                            var jobFolders = $("#jobFolders").trigger('change');
                            if(_sch)
                            {
                                $("#jobsScheduleList").find("li[_id='"+escape(_sch)+"']").addClass('loadedSchedule');
                            }
                            $("#filterSchedules").removeData("last_searched").trigger('keyup', [true]);
                            setTimeout(function(){
                                $("#filterSchedules").removeData("last_searched").trigger('keyup', [true]);
                            },100);
                        }
                        else
                        {
                            crushFTP.UI.growl("Error while creating a new folder", "" + DOMPurify.sanitize(status), true);
                            taskDesigner.showLoading(true);
                        }
                    });
                }
                crushFTP.Replication.showOptionsOrContinue(continueRenaming);
            }
        }, false, false, {
            prependBeforeInput: $("<strong>"+folderNameDisplay+"</strong>")
        });
    },
    deleteFolder : function(currentName, cb){
        jConfirm("Are you sure you wish to delete folder \"" + crushFTP.methods.htmlEncode(currentName) + "\" and all jobs in the folder", "Confirm", function(flag){
            if(flag)
            {
                function continueRenaming(){
                    taskDesigner.showLoading();
                    var obj = {
                        command: "deletedirJob",
                        item_name : crushFTP.methods.htmlEncode(currentName)
                    };
                    if(crushFTP.replicationSavePrefs){
                        obj.ui_save_preferences_item = crushFTP.replicationSavePrefs;
                    }
                    crushFTP.data.serverRequest(obj, function(data){
                        var status = $.trim($(data).find("response_status").text());
                        if(status.toLowerCase().indexOf("failure")!=0)
                        {
                            crushFTP.UI.growl("Success", crushFTP.methods.htmlEncode(status), false, 5000);
                            taskDesigner.showLoading(true);
                            var selected = $("#jobsScheduleList").find("li.loadedSchedule");
                            var _sch = false;
                            if(selected.length>0)
                                _sch = unescape(selected.attr("_id"));
                            taskDesigner.updateJobsLocal("deleteDir",
                            {
                                name: currentName
                            });
                            taskDesigner.bindData();
                            var jobFolders = $("#jobFolders").trigger('change');
                            if(_sch)
                            {
                                $("#jobsScheduleList").find("li[_id='"+escape(_sch)+"']").addClass('loadedSchedule');
                            }
                            $("#filterSchedules").removeData("last_searched").trigger('keyup', [true]);
                            setTimeout(function(){
                                $("#filterSchedules").removeData("last_searched").trigger('keyup', [true]);
                            },100);
                            // taskDesigner.showAvailableJobs(function(){
                            // });
                        }
                        else
                        {
                            crushFTP.UI.growl("Error while creating a new folder", "" + crushFTP.methods.htmlEncode(status), true);
                            taskDesigner.showLoading(true);
                        }
                    });
                }
                crushFTP.Replication.showOptionsOrContinue(continueRenaming);
            }
        });
    },
    bindEvents : function()
    {
        $(document).unbind("scroll").bind("scroll", function(){
            delay(function () {
                taskDesigner.canvas.redraw();
            }, 500);
        });
        $(".sideDragable", taskDesigner.panel).draggable({revert: false,
            helper: function( event ) {
                if($(this).hasClass("task"))
                    return taskDesigner.taskTemplate.clone().addClass("task");
                else
                    return taskDesigner.endActionTemplate.clone().addClass("action");
            }, stack: "div.canvasPortlet", appendTo: "body", zIndex : 1000, stop: function(event, ui) {
            var elem = ui.helper;
            if(!taskDesigner.loadedSchedule)
            {
                jAlert("You must create a Job first", "Create Job", function(){
                    $("#newJobsSchedule").trigger("click");
                });
                elem.remove();
                return false;
            }
            var $el = $(taskDesigner.canvas), op = ui.offset, op2 = $el.offset();
            op.top  -= op2.top  - $el.scrollTop();
            op.left -= op2.left - $el.scrollLeft();
            if(op.top<5)op.top=5;
            if(op.left<5)op.left=5;
            taskDesigner.addItemToCanvas(elem, op);
            taskDesigner.hasPendingChanges(true);
        }}).bind("click", function(){
            var that = this;
            setTimeout(function() {
                var dblclick = parseInt($(that).data('double'), 10);
                if (dblclick > 0) {
                    $(that).data('double', dblclick-1);
                } else {
                    crushFTP.UI.growl("Error", "Drag this item to designer panel or double click on it to add", true, 3000);
                }
            }, 300);
        }).bind("dblclick", function(evt){
            $(this).data('double', 2);
            var op = {};
            var tasks = taskDesigner.data.items;
            var lastItem = tasks[tasks.length-1];
            if(lastItem.type == "task" && lastItem && lastItem.position)
            {
                op.top = lastItem.position.top + 20;
                op.left = lastItem.position.left + 20;
                var taskItem = $("#task_" + lastItem.id);
                op.top += taskItem.height();
                op.left += taskItem.width();
            }
            else
            {
                op.top = 100;
                op.left = 10;
            }
            taskDesigner.addItemToCanvas($(this), op);
            taskDesigner.hasPendingChanges(true);
            $(document).trigger("mouseup");
            evt.stopPropagation();
        }).hover(function(){
            $(this).find(".showHideText").show("slide");
        }, function(){
            $(this).find(".showHideText").hide("fast");
        });

        taskDesigner.formDialog = $("#taskFormDialog", taskDesigner.panel).dialog({
            autoOpen: false,
            title : "Crush Task : ",
            modal: true,
            maxHeight : 700,
            resizable: false,
            zIndex : 5001,
            closeOnEscape: true,
            show: {effect: 'fade', duration: 200},
            position: {my: "top", at: "top"},
            buttons : {
                "OK" : function(){
                    var pluginDetails = taskDesigner.formDialog;
                    taskDesigner.formDialog.find(".tabs").tabs({active:0});
                    if(pluginDetails.find(".ui-state-error:visible").length>0)
                    {
                        alert("Fix the error on form : \r\nYour form data has some error, please fix that first");
                        return false;
                    }
                    if(pluginDetails.find(".hasPendingCall").length>0)
                    {
                        window.pendingEncryptionCall = function(){
                            $($(".ui-dialog-buttonset:visible").find("button").get(0)).trigger("click");
                        };
                        pluginDetails.find(".hasPendingCall").trigger("blur");
                    }
                    else
                    {
                        // pluginDetails.find(".maskPasswordOnURL").trigger("blur");
                        // pluginDetails.find(".maskPasswordOnURL").trigger("blur.form");
                        taskDesigner.hasPendingChanges(true);
                        if(taskDesigner.rebuildCustomScripts)
                        {
                            taskDesigner.rebuildCustomScripts();
                            delete taskDesigner.rebuildCustomScripts;
                        }
                        var controlData = taskDesigner.openFormControlData;
                        var oldData = $.extend(true, {}, controlData);

                        if(controlData.type == "Exclude"){
                            var limit_size = pluginDetails.find("#limit_size").val();
                            // if(limit_size + "" !== "")
                            // {
                            //     alert("List count must be numeric or empty");
                            //     pluginDetails.find("#limit_size").focus();
                            //     return false;
                            // }
                        }
                        var taskName = $.trim(pluginDetails.find("#name").val()).toLowerCase();
                        if(taskName === "default failure" && taskDesigner.data.items){
                            for (var i = 0; i < taskDesigner.data.items.length; i++) {
                                var curItem = taskDesigner.data.items[i];
                                if($.trim(curItem.name).toLowerCase() === "default failure" && curItem.connectionID != controlData.connectionID)
                                {
                                    alert("Default failure task exists. Type: "+ curItem.type);
                                    pluginDetails.find("#name").focus();
                                    return false;
                                }
                            }
                        }
                        var openFormCrushTask = taskDesigner.openFormCrushTask;
                        var data = controlData;
                        var multiThreadUpload = ['s3_buffer', 's3_threads_upload'];
                        var multiThreadDownload = ['s3_buffer_download', 's3_threads_download', 's3_max_buffer_download'];
                        var isHTML = $("#emailBodyHTML", pluginDetails).is(":checked");
                        pluginDetails.find("input, select, textarea").filter(":not(.excludeXML)").each(function(){
                            if(data && $(this).attr("id"))
                            {
                                if($(this).is("textarea") && $.sceditor && $(this).sceditor("instance")){
                                    curVal = $(this).sceditor("instance").val();
                                    curVal = curVal.replace('<span id="sceditor-end-marker" class="sceditor-selection sceditor-ignore" style="line-height: 0; display: none;"> </span><span id="sceditor-start-marker" class="sceditor-selection sceditor-ignore" style="line-height: 0; display: none;"> </span>', "").replace('<span id="sceditor-start-marker" class="sceditor-selection sceditor-ignore" style="line-height: 0; display: none;"> </span><span id="sceditor-end-marker" class="sceditor-selection sceditor-ignore" style="line-height: 0; display: none;"> </span>', "");
                                    if(isHTML && crushFTP.methods.isHTML(curVal)){
                                        // if(curVal.indexOf("<html>")<0)
                                        //     curVal = '<!DOCTYPE html><html><body>' + curVal + '</body></html>';
                                    }
                                    else{
                                        isHTML = false;
                                    }
                                    data[$(this).attr("id")] = curVal;
                                }
                                else if($(this).attr("id") == "modified_comparison_newer" && $(this).is(":checked"))
                                {
                                    data["modified_comparison"] = "new";
                                }
                                else if($(this).attr("id") == "modified_comparison_older" && $(this).is(":checked"))
                                {
                                    data["modified_comparison"] = "old";
                                }
                                else if($(this).attr("id") == "cache_mode_read" && $(this).is(":checked"))
                                {
                                    data["cache_mode"] = "read";
                                }
                                else if($(this).attr("id") == "cache_mode_write" && $(this).is(":checked"))
                                {
                                    data["cache_mode"] = "write";
                                }
                                else if($(this).hasClass("maskPasswordOnURL"))
                                {
                                    var elem = $(this);
                                    var curVal = elem.val();
                                    var attrID = elem.attr("id");
                                    if(elem.hasClass("urlWithParams")){
                                        data[attrID] = (elem.data("realURL")) || elem.val();
                                    }
                                    else{
                                        var isFILE = curVal.toLowerCase().indexOf("file:/") == 0;
                                        if(curVal && curVal.indexOf(":")<0)
                                            isFILE = true;
                                        if(!isFILE)
                                        {
                                            var value = $(this).val();
                                            var url = value;
                                            try{
                                                url = URI(value);
                                            }catch(ex){
                                                url = URI(encodeURI(value));
                                            }
                                            if(url)
                                            {
                                                var pass = elem.data("password");
                                                if(pass)
                                                {
                                                    url.password(pass);
                                                }
                                                else
                                                {
                                                    url.password("");
                                                }
                                                var _val = url.toString();
                                                if(unescape(_val).length>value.length)
                                                    _val = _val.substr(0, _val.length-1);
                                                if(curVal.endsWith("?"))
                                                    _val = _val + "?";
                                                try{
                                                    data[attrID] = decodeURIComponent(_val);
                                                }
                                                catch(ex){
                                                    data[attrID] = (_val);
                                                }
                                            }
                                        }
                                        else
                                        {
                                            var url = elem.val();
                                            if(!elem.hasClass("notForcedURL") && url && url.indexOf(":")<0 && url.indexOf("{")!=0)
                                            {
                                                url = "FILE:/" + elem.val();
                                            }
                                            try{
                                                data[attrID] = decodeURIComponent(url);
                                            }
                                            catch(ex){
                                                data[attrID] = (url);
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    var recName = $(this).attr("recName");
                                    if(data.type == "FileParser" && (recName == "column_name" || recName == "column_size" || recName == "column_index"))
                                    {
                                        taskDesigner.buildFileParserColumns(pluginDetails);
                                    }
                                    else
                                    {
                                        var elemName = $(this).attr("id");
                                        if(elemName)
                                        {
                                            var tocnt = true;
                                            if(typeof data.multithreaded_s3 == "undefined" || data.multithreaded_s3 == "false"){
                                                if(multiThreadUpload.indexOf(elemName.toLowerCase())>=0){
                                                    tocnt = false;
                                                }
                                            }
                                            if(typeof data.multithreaded_s3_download == "undefined" || data.multithreaded_s3_download == "false"){
                                                if(multiThreadDownload.indexOf(elemName.toLowerCase())>=0){
                                                    tocnt = false;
                                                }
                                            }
                                            if(tocnt){
                                                var isBool = $(this).attr("type") == "radio" || $(this).attr("type") == "checkbox";
                                                data[elemName] = isBool ? $(this).is(":checked").toString() : $(this).val();
                                            }
                                            else{
                                                delete data[elemName];
                                            }
                                        }
                                    }
                                }
                            }
                        });
                        data["emailBodyHTML"] = isHTML ? "true" : "false";
                        data["emailBodyPlainText"] = isHTML ? "false" : "true";

                        if(controlData.type == "Jump")
                        {
                            taskDesigner.drawLine(taskDesigner.canvas.find("#task_"+ controlData.connectionID).find(".taskJumpTrueActionPoint"), taskDesigner.canvas.find("#task_"+ controlData.jump_task_id), "true");

                            taskDesigner.drawLine(taskDesigner.canvas.find("#task_"+ controlData.connectionID).find(".taskJumpFalseActionPoint"), taskDesigner.canvas.find("#task_"+ controlData.jump_false_task_id), "jumpfail");

                            var startItem = taskDesigner.data.get(controlData.connectionID);
                            if(controlData.jump_task_id){
                                var endItem = taskDesigner.data.get(controlData.jump_task_id);
                                if(endItem)
                                    audit.addLog("set to jump on success for task " + audit.getName(startItem) + " to " + audit.getName(endItem));
                            }
                            if(controlData.jump_false_task_id){
                                var endItem = taskDesigner.data.get(controlData.jump_false_task_id);
                                if(endItem)
                                    audit.addLog("set to jump on failure for task " + audit.getName(startItem) + " to " + audit.getName(endItem));
                            }
                        }
                        else if(controlData.type == "UsersList")
                        {
                            taskDesigner.drawLine(taskDesigner.canvas.find("#task_"+ controlData.connectionID).find(".taskJumpTrueActionPoint"), taskDesigner.canvas.find("#task_"+ controlData.taskToCall), "true");
                        }
                        else if(controlData.type == "UserVariable")
                        {
                            for (var item in controlData) {
                                if(item.toString().indexOf("varName")==0)
                                {
                                    if(item.toString() == "varName"){
                                        delete controlData.varName;
                                        delete controlData.varValue;
                                    }
                                    else{
                                        var index = parseInt(item.replace("varName", ""));
                                        delete controlData[item];
                                        delete controlData["varValue"+index];
                                    }
                                }
                            }
                            var itemIndex = 0;
                            taskDesigner.formDialog.find(".tabs").tabs({active:0});
                            taskDesigner.formDialog.find(".user-variables:visible").each(function(){
                                var key = $(this).find("input:first").val();
                                var val = $(this).find("textarea:last").val();
                                if(key)
                                {
                                    taskDesigner.openFormControlData["varName"+ (itemIndex == 0 ? "" : itemIndex)] = key;
                                    taskDesigner.openFormControlData["varValue"+ (itemIndex == 0 ? "" : itemIndex)] = val;
                                    itemIndex++;
                                }
                            });
                            if(typeof taskDesigner.openFormControlData["varName"] == "undefined")
                            {
                                taskDesigner.openFormControlData.varName = "";
                                taskDesigner.openFormControlData.varValue = "";
                            }
                        }
                        else if(controlData.type == "Java")
                        {
                            var prop_item = {
                                prop_item_subitem : []
                            };
                            taskDesigner.formDialog.find(".multipleItems:visible").each(function(){
                                var key = $(this).find("input.key").val();
                                var val = $(this).find("input.value").val();
                                if(key)
                                {
                                    prop_item.prop_item_subitem.push({key : key, val:val});
                                }
                            });
                            taskDesigner.openFormControlData.prop_item = prop_item;
                        }
                        else if(controlData.type == "Http")
                        {
                            var headers = {
                                headers_subitem : []
                            };
                            taskDesigner.formDialog.find(".multipleItems:visible").each(function(){
                                var key = $(this).find("input.key").val();
                                var val = $(this).find("input.value").val();
                                if(key)
                                {
                                    headers.headers_subitem.push({value : key + ":" + val});
                                }
                            });
                            taskDesigner.openFormControlData.headers = headers;
                            function getFileExtension(filename) {
                                var ext = /^.+\.([^.]+)$/.exec(filename);
                                return ext == null ? "" : ext[1].toLowerCase();
                            }
                            var selectedPath = taskDesigner.openFormControlData.save_result_file;
                            var isFile = getFileExtension(selectedPath).length>0;
                            if(selectedPath && !isFile)
                            {
                                const regex = /\{[^}]+\}/g;
                                if(!regex.test(selectedPath))
                                {
                                    if(selectedPath.lastIndexOf("/") == selectedPath.length-1)
                                        selectedPath += "response.txt";
                                    else
                                        selectedPath += "/response.txt";
                                }
                                taskDesigner.openFormControlData.save_result_file = selectedPath
                            }
                        }
                        else if(controlData.type == "Link")
                        {
                            taskDesigner.renderLinks(openFormCrushTask.closest(".crushTaskItem"));
                        }
                        else if(controlData.type == "Move" || controlData.type == "Copy")
                        {
                            taskDesigner.openFormCrushTask.parent().find(".taskHeaderLabel").text(taskDesigner.openFormControlData.type);
                        }
                        $(this).closest('div').find(".sftpOptions").find("input").val("").trigger('keyup');
                        var suggestions = pluginDetails.find(".suggested").find("#suggestedSettingsUsed").find("li");
                        if(suggestions && suggestions.length>0){
                            suggestions.each(function(){
                                if($(this).attr("key")){
                                    taskDesigner.openFormControlData[$(this).attr("key")] = $(this).attr("_value");
                                    controlData[$(this).attr("key")] = $(this).attr("_value");
                                }
                            });
                        }
                        var removedSuggestions = pluginDetails.find(".suggested").find("#suggestedSettingsAvailable").find("li");
                        if(removedSuggestions && removedSuggestions.length>0){
                            removedSuggestions.each(function(){
                                if($(this).attr("key")){
                                    delete taskDesigner.openFormControlData[$(this).attr("key")];
                                    delete controlData[$(this).attr("key")];
                                }
                            });
                        }
                        taskDesigner.previewSnippet(openFormCrushTask.closest(".crushTaskItem"));
                        delete taskDesigner.openFormControlData;
                        delete taskDesigner.openFormCrushTask;
                        var differences = crushFTP.methods.difference(controlData, oldData);
                        if(Object.keys(differences).length>0){
                            var items = [];
                            for(var item in differences){
                                var oldVal = oldData[item] || "";
                                var newVal = differences[item] || "";
                                if(oldVal != newVal){
                                    if(item.toLowerCase().indexOf("pass")>=0){
                                        oldVal = unescape(crushFTP.methods.maskPassword(oldVal, true));
                                        newVal = unescape(crushFTP.methods.maskPassword(newVal, true));
                                    }
                                    else if($("#"+item+":first").hasClass('maskPasswordOnURL')){
                                        oldVal = unescape(crushFTP.methods.maskPassword(oldVal));
                                        newVal = unescape(crushFTP.methods.maskPassword(newVal));
                                    }
                                    items.push(item + ": changed from '" + oldVal + "' to '" + newVal + "'");
                                }
                            }
                            audit.addLog("updated task " + audit.getName(controlData) + " " + items.join(", "));
                        }
                        $(this).dialog("close");
                    }
                },
                "Cancel" : function(){
                    $(this).dialog("close");
                }
            },
            beforeClose : function(){
                return true;
            },
            open: function(){
                taskDesigner.formDialog.find("#actionDetailsPopup").tabs({active: 0});
                if(taskDesigner.monitoringActiveJob || taskDesigner.openFormControlData.fromMiniature)
                {
                    taskDesigner.formDialog.parent().find(".ui-dialog-buttonset").find("button:first").hide();
                    taskDesigner.formDialog.find("input,textarea,select,button,a").attr("disabled", "disabled").addClass('ui-state-disabled');
                    taskDesigner.formDialog.find(".ui-tabs-nav").find("a").removeClass('ui-state-disabled');
                    setTimeout(function(){
                        taskDesigner.formDialog.find(".ui-icon-radio-off, .ui-icon-radio-on").addClass('ui-state-disabled');
                        taskDesigner.formDialog.find("span.ui-state-default.ui-corner-all").addClass('ui-state-disabled');
                    }, 500);
                }
                else
                {
                    taskDesigner.formDialog.parent().find(".ui-dialog-buttonset").find("button:first").show();
                }
                taskDesigner.formDialog.find(".advanced-options h3").unbind().click(function(){
                    $(this).closest(".advanced-options").toggleClass("open closed");
                });

                taskDesigner.formDialog.find(".advanced-options-all h3").unbind().click(function(){
                    $(this).closest(".advanced-options-all").toggleClass("open closed");
                });
                var curItemData = taskDesigner.openFormControlData;
                taskDesigner.formDialog.find(".sftp-suggested-settings").suggestedSettings({
                    suggestions : configSuggestions.sftp,
                    existing: curItemData
                });
            }
        });

        taskDesigner.formDialog.find("#actionDetailsPopup").form().tabs();

        taskDesigner.activeTaskItemsDialog = $("#activeTaskItemsInfoPanel").form().dialog({
            autoOpen: false,
            title : "Task Items : ",
            modal: true,
            minWidth : 800,
            minHeight : 300,
            resizable: false,
            zIndex : 5001,
            closeOnEscape: false,
            show: {effect: 'fade', duration: 600},
            buttons : {
                "OK" : function(){
                    $(this).dialog("close");
                }
            },
            open :function(){
                taskDesigner.activeTaskItemsDialog.find("#filterJobItems,#filterJobItemsNew").val("");
            }
        });

        var localDelay = (function () {
            var timer = 0;
            return function (callback, ms) {
                clearTimeout(timer);
                timer = setTimeout(callback, ms);
            };
        })();

        taskDesigner.activeTaskItemsDialog.find("#filterJobItems,#filterJobItemsNew").bind("textchange", function(){
            var filterItem = taskDesigner.activeTaskItemsDialog.find(".itemsTable");
            if($(this).is("#filterJobItemsNew"))
                filterItem = taskDesigner.activeTaskItemsDialog.find(".newItemsTable");

            var that = $(this);
            var oldSearch = that.data("lastFilterTerm");
            var phrase = that.val();
            if (oldSearch === phrase) {
                return false;
            }
            localDelay(function(){
                that.data("lastFilterTerm", phrase);
                filterItem.find("div.itemRow").hide();
                filterItem.find("div.itemRow:Contains('"+phrase+"')").each(function(){
                    $(this).show();
                });
                filterItem.find(".nomatchfound").remove();
                if(filterItem.find("div.itemRow:visible").length==0)
                {
                    filterItem.append('<div class="itemRow nomatchfound ui-widget-content ui-state-highlight"><div style="text-align:center;">No matching items available</div></div>');
                }
            }, 300);
        });

        taskDesigner.activeTaskItemsDialog.find(".clearFilter").click(function(){
            $(this).parent().find("input").val("").removeData("lastFilterTerm").trigger('textchange');
            return false;
        });

        taskDesigner.activeTaskItemsDetailsPanel = $("#activeTaskItemsDetailsPanel").dialog({
            autoOpen: false,
            title : "Job Item Details : ",
            modal: true,
            minWidth : 800,
            minHeight : 300,
            resizable: true,
            zIndex : 5002,
            closeOnEscape: true,
            show: {effect: 'fade', duration: 600},
            buttons : {
                "Save" : function(){
                    $(this).dialog("close");
                },
                "Cancel" : function(){
                    $(this).dialog("close");
                }
            }
        });

        $(".resizer", taskDesigner.canvas).live("click", function(evt){
            if($(this).hasClass("bottomTrigger"))
            {
                var curHeight = taskDesigner.canvas.height();
                if(evt.shiftKey)
                {
                    if(curHeight - 500 > 700)
                        taskDesigner.canvas.animate({height : curHeight - 500}, 500);
                }
                else
                    taskDesigner.canvas.animate({height : curHeight + 500}, 500);
            }
            else if($(this).hasClass("rightTrigger"))
            {
                var curWidth = taskDesigner.canvas.width();
                if(evt.shiftKey)
                {
                    if(curWidth - 500 > 1000)
                        taskDesigner.canvas.animate({width : curWidth - 500}, 500);
                }
                else
                    taskDesigner.canvas.animate({width : curWidth + 500}, 500);
            }
            setTimeout(function(){
                if(taskDesigner.kioskData && taskDesigner.kioskData.resizeFrame)
                {
                    taskDesigner.kioskData.resizeFrame(taskDesigner.canvas.width(), taskDesigner.canvas.height()+20);
                }
            }, 600);
        }).live("mouseenter", function(){
            $(this).addClass("hover");
        }).live("mouseleave", function(){
            $(this).removeClass("hover");
        });

        taskDesigner.canvas.click(function(){
            $(this).find(".highlighted").removeClass("highlighted");
            taskDesigner.showCopyTasksButton();
        });

        var saveChanges = $("#saveChanges, #saveChanges2").unbind("click").click(function(evt, evtData){
            if($(this).hasClass('ui-state-disabled'))
                return false;
            if(!taskDesigner.loadedSchedule)
            {
                crushFTP.UI.growl("Select Job first", "Load the Job you want to edit", true, 3000);
                if(!$("#existingJobsPanel").is(":visible"))
                    $("#existingJobsBtn").trigger("click");
                return false;
            }
            var elem = $(this);
            var fromSaveAndContinue = false;
            if(evtData)
            {
                fromSaveAndContinue = evtData.fromSaveAndContinue;
            }
            if($(".hasPendingCall").length>0)
            {
                window.pendingEncryptionCall = function(){
                    elem.trigger("click", evtData);
                };
            }
            else
            {
                if(taskDesigner.loadedSchedule)
                {
                    function continueSaving(reload, time){
                        var xml = taskDesigner.generateXML();
                        var controlData = taskDesigner.loadedSchedule;
                        if(controlData && controlData.tasks)
                            delete controlData.tasks;

                        controlData.startPointPosition = taskDesigner.data.startPointPosition;
                        controlData.endPointPosition = taskDesigner.data.endPointPosition;
                        controlData.startPointZIndex = taskDesigner.canvas.find("#StartPointPanel").css("zIndex");
                        controlData.endPointZIndex = taskDesigner.canvas.find("#EndPoint").css("zIndex");
                        var created = controlData.created || time;
                        var canWidth = taskDesigner.canvas.width();
                        var canHeight = taskDesigner.canvas.height();
                        controlData.canvasSize = canWidth.toString() + "," + canHeight.toString();
                        var log = controlData.audit_trail || "";
                        log += audit.getLog(taskDesigner.loadedSchedule.id);
                        controlData.audit_trail = log;
                        var dataXML = $.json2xml(controlData, {rootTagName: 'schedules_subitem'});
                        dataXML = dataXML.replace(/\<schedules_subitem>/g, "<schedules_subitem type=\"properties\"><created>"+created+"</created><modified>"+time+"</modified>").replace(/\<type>properties<\/type>/g, "").replace(/\<\/schedules_subitem>/g, "");
                        var rootConnections = [];
                        var _connections = taskDesigner.data.startConnections;
                        if(_connections && _connections.length>0)
                        {
                            rootConnections.push("<connections type=\"vector\">");
                            for (var i = 0; i < _connections.length; i++) {
                                var curConnection = _connections[i];
                                rootConnections.push("<connections_subitem type=\"properties\"><type>start</type><connectionID>"+curConnection+"</connectionID></connections_subitem>");
                            };
                            rootConnections.push("</connections>");
                        }
                        else
                        {
                            rootConnections.push("<connections type=\"vector\"><connections_subitem type=\"properties\"><type>dummy</type></connections_subitem></connections>");
                        }
                        if(dataXML && dataXML.length>0)
                        {
                            xml = dataXML + xml + rootConnections.join("") + "</schedules_subitem>";
                        }
                        if(xml && xml.length>0)
                        {
                            var schName = unescape(taskDesigner.loadedSchedule.scheduleName);
                            taskDesigner.showLoading();
                            var obj = {
                                command: "addJob",
                                name : taskDesigner.loadedSchedule.scheduleName,
                                data : xml
                            };
                            if(crushFTP.replicationSavePrefs){
                                obj.ui_save_preferences_item = crushFTP.replicationSavePrefs;
                            }
                            console.log("AddJob called from saveChanges");
                            crushFTP.data.serverRequest(obj, function(data){
                                var status = $.trim($(data).find("response_status").text());
                                if(status.toLowerCase().indexOf("failure")!=0)
                                {
                                    taskDesigner.bindData();
                                    $("#jobFolders").trigger('change');
                                    taskDesigner.hasPendingChanges(false);
                                    if(!evtData || !evtData.doNotClear)
                                        taskDesigner.clearLoadedTaskData();
                                    crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
                                    taskDesigner.showLoading(true);
                                    if(fromSaveAndContinue)
                                    {
                                        if(taskDesigner.loadedSchedule)
                                            schName = taskDesigner.loadedSchedule.scheduleName;
                                        else
                                            schName = "";
                                    }
                                    $("#jobsScheduleList").find("li[_id='"+escape(schName)+"']").addClass("loadedSchedule ui-state-focus");
                                    if(reload)
                                    {
                                        taskDesigner.updateJobsLocal("update", $.xml2json(xml));
                                        // taskDesigner.showAvailableJobs(function(){
                                        // });
                                        // taskDesigner.bindData();
                                        $("#jobFolders").trigger('change');
                                        if(!fromSaveAndContinue)
                                            $("#jobsScheduleList").find("li[_id='"+escape(schName)+"']").addClass("loadedSchedule ui-state-focus");
                                        if(fromSaveAndContinue)
                                        {
                                            if(evtData.callBack)
                                            {
                                                evtData.callBack(true);
                                            }
                                        }
                                        else
                                            $("#jobsScheduleList").find("li[_id='"+escape(schName)+"']").trigger("click");
                                    }
                                    else
                                    {
                                        taskDesigner.updateJobsLocal("update", $.xml2json(xml));
                                        //$("#reloadJobsList").trigger("click",[true]);
                                        if(fromSaveAndContinue)
                                        {
                                            if(evtData.callBack)
                                            {
                                                evtData.callBack(true);
                                            }
                                        }
                                        else{
                                            $("#jobsScheduleList").find("li[_id='"+escape(schName)+"']").trigger("click");
                                        }
                                    }
                                }
                                else
                                {
                                    crushFTP.UI.growl("Error while saving", "Your changes are not saved. " + crushFTP.methods.htmlEncode(status), true);
                                    taskDesigner.showLoading(true);
                                    if(reload)
                                    {
                                        // taskDesigner.showAvailableJobs(function(){
                                        // });
                                        taskDesigner.bindData();
                                        $("#jobsScheduleList").find("li[_id='"+escape(schName)+"']").addClass("loadedSchedule ui-state-focus");
                                        if(fromSaveAndContinue)
                                        {
                                            if(evtData.callBack)
                                            {
                                                evtData.callBack(false);
                                            }
                                        }
                                    }
                                    else
                                    {
                                        if(fromSaveAndContinue)
                                        {
                                            if(evtData.callBack)
                                            {
                                                evtData.callBack(false);
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    }
                    if(taskDesigner.renameJobData)
                    {
                        crushFTP.UI.showIndicator(false, false, "Please wait..");
                        var scheduleName = taskDesigner.renameJobData.name;
                        if(scheduleName.indexOf("__") == 0){
                            jAlert("Job name starting with '__' is reserved for temporary jobs, please use another name", "Error", function(){
                            });
                            return false;
                        }
                        var obj = {
                            command: "renameJob",
                            priorName: taskDesigner.renameJobData.priorName,
                            name : taskDesigner.renameJobData.name
                        };
                        if(crushFTP.replicationSavePrefs){
                            obj.ui_save_preferences_item = crushFTP.replicationSavePrefs;
                        }
                        crushFTP.data.serverRequest(obj,
                        function(data){
                            crushFTP.UI.hideIndicator();
                            var jobName = taskDesigner.renameJobData.name;
                            var oldName = taskDesigner.renameJobData.priorName;
                            taskDesigner.renameJobData = false;
                            if(data && typeof data.getElementsByTagName != "undefined")
                            {
                                var status = $.trim($(data).find("response_status").text());
                                if(status.toLowerCase().indexOf("success")>=0)
                                {
                                    taskDesigner.loadedSchedule.scheduleName = jobName;
                                    taskDesigner.updateJobsLocal("rename",
                                    {
                                        oldName: oldName + "",
                                        name: jobName
                                    });
                                    taskDesigner.getServerTime(function(curTime){
                                        continueSaving(false, curTime); // Update job name
                                    });
                                }
                                else
                                {
                                    crushFTP.UI.growl("Error", status || "Error while renaming schedule : " + crushFTP.methods.htmlEncode(oldName), true);
                                }
                            }
                        });
                        return false;
                    }
                    else{
                        taskDesigner.getServerTime(function(curTime){
                            continueSaving(false, curTime);
                        });
                    }
                }
            }
            return false;
        });

        $("#rerunJob").unbind('click').click(function(){
            if($(this).hasClass("ui-state-disabled"))
                return false;
            else
            {
                taskDesigner.clearActiveJobData();
                $("#runJob").trigger('click');
            }
            return false;
        });

        $("#retryJob").unbind('click').click(function(){
            if($(this).hasClass("ui-state-disabled"))
                return false;
            else
            {
                if (taskDesigner.loadedSchedule)
                {
                    taskDesigner.updateJobsStatus(taskDesigner.loadedSchedule.new_job_id_run, taskDesigner.loadedSchedule.scheduleName, "restart");
                }
            }
            return false;
        });

        $("#editJobTemplate").unbind('click').click(function(){
            if($(this).hasClass("ui-state-disabled"))
                return false;
            else
            {
                var activeJob = taskDesigner.activeJobToMonitor;
                if(activeJob)
                {
                    activeJob = activeJob.split("||");
                    var scheduleName = unescape(activeJob[1]);
                    if ($("#jobsScheduleList").find("li[_id='" + escape(scheduleName) + "']").length === 1) {
                      taskDesigner.clearActiveJobData();
                      $("#jobsScheduleList")
                        .find("li[_id='" + escape(scheduleName) + "']")
                        .trigger("click");
                    } else {
                      crushFTP.UI.growl("Job not loaded", "Matching job not found " + scheduleName, true, 3000);
                    }
                }
            }
            return false;
        });

        $("#removeBreakpoints,#addBreakpointsAll").unbind('click').click(function(){
            if($(this).hasClass("ui-state-disabled"))
                return false;
            else
            {
                if($(this).is("#removeBreakpoints"))
                {
                    var points = taskDesigner.canvas.find(".canvasPortlet.breakPoint");
                    points.each(function(){
                        if($(this).parent().is("#jobsCanvas")){
                            $(this).find(".closeBtn").trigger('click');
                        }
                    });
                    audit.addLog("removed all breakpoints");
                }
                else
                {
                    var cons = jsPlumb.getAllConnections();
                    cons = $.extend(true, [], cons.jsPlumb_DefaultScope);
                    var addedCon = [];
                    for (var i = 0; i < cons.length; i++) {
                        var curCon = cons[i];
                        if(curCon._type && curCon._type != "start")
                        {
                            if(!addedCon.has(curCon.id)){
                                taskDesigner.addBreakpoint(curCon);
                                addedCon.push(curCon.id);
                            }
                        }
                    }
                    audit.addLog("added breakpoint to each step");
                }
            }
            return false;
        });

        var runJob = $("#runJob, #runJob2").unbind("click").click(function(evt, evtData){
            if(!$(document).data("app_enterprise"))
            {
                jAlert('<div style="text-align:center">To use this feature, an Enterprise license is required.<br><br> To get more information on features and pricing, see the following links: <br><br><a href="http://crushftp.com/pricing.html#enterprise" tabIndex="-1" target="_blank">Plans &amp; Pricing</a> | <a href="http://www.crushftp.com/crush6wiki/Wiki.jsp?page=Enterprise%20License%20Enhancements" tabIndex="-1" target="_blank">Enterprise License Enhancements</a></div>', "This is an Enterprise License feature");
                return false;
            }
            if($(this).hasClass("ui-state-disabled"))
                return false;
            if(taskDesigner.loadedSchedule)
            {
                var  btns = $("#runJob, #runJob2").addClass("ui-state-disabled");
                function testRunJob()
                {
                    if(taskDesigner.loadedSchedule && taskDesigner.loadedSchedule.scheduleName)
                    {
                        $("#rangeSelector").val("hour");
                        $("#jobStatusFilter").val("");
                        crushFTP.UI.showIndicator(false, false, "Please wait..");

                        var scheduleName = encodeURIComponent(taskDesigner.loadedSchedule.scheduleName);
                        var lstJobs = $("#activeScheduleList");
                        var lastRunningJobs = lstJobs.find("li").length;
                        var obj = {
                            command : "testJobSchedule",
                            scheduleName : scheduleName
                        };
                        crushFTP.data.serverRequest(obj
                            , function(data){
                                data = $.xml2json(data, true);
                                crushFTP.UI.hideIndicator();
                                btns.removeClass("ui-state-disabled");
                                if(data.response)
                                {
                                    try{
                                        var fail = unescape(data.response[0].text).indexOf("FAILURE")==0;
                                        crushFTP.UI.growl("Message", crushFTP.methods.htmlEncode(unescape(data.response[0].text)), fail, 5000);
                                        if(data && data.jobid && data.jobid[0] && data.jobid[0].text)
                                        {
                                            var jobID = unescape(data.jobid[0].text);
                                            function showActiveJob(flag)
                                            {
                                                try{
                                                    $("#rangeSelector").val("hour");
                                                    $("#jobStatusFilter").val("");
                                                    taskDesigner.bindActiveJobs(false, function(){
                                                        taskDesigner.clearLoadedTaskData();
                                                        var toLoad = $("#activeScheduleList").find("li[taskid='"+jobID+"']");
                                                        if(toLoad.length>0)
                                                            toLoad.trigger("click");
                                                        else
                                                        {
                                                            if(!$("#existingJobsPanel").is(":visible"))
                                                                $("#existingJobsBtn").trigger("click");
                                                        }
                                                        $("#availableJobsTabs").tabs({active: 1});
                                                    }, true);
                                                }
                                                catch(ex){}
                                            }
                                            setTimeout(function() {
                                                showActiveJob();
                                            }, 100);
                                        }
                                    }
                                    catch(ex){}
                                }
                                else
                                {
                                    crushFTP.UI.growl("Error while testing the job schedule", "Error", true);
                                }
                            }
                         , false, "POST");
                    }
                }

                if(taskDesigner.hasChanges)
                {
                    $("a#saveChanges:first").trigger("click", [{callBack:function(flag){
                        if(flag)
                        {
                            testRunJob();
                        }
                    }, fromSaveAndContinue : true, doNotClear : true}]);
                }
                else
                    testRunJob();
            }
            return false;
        });

        //Quick jump, opens schedule list and quick filter, enter will open filtered Job quickly
        taskDesigner.canvas.bind("focus, click", function(){
            taskDesigner.isFocusOnCanvas = true;
        });
        $(document.documentElement).keydown(function (event) {
            if (event.keyCode == 74) { // alt+j on canvas opens jobs list
                //if(taskDesigner.isFocusOnCanvas)
                {
                    if(event.altKey)
                    {
                        if(!$("#existingJobsPanel").is(":visible"))
                            $("#existingJobsBtn").trigger("click");
                        event.preventDefault();
                        event.stopPropagation();
                        return false;
                    }
                }
             }
             else if(event.keyCode == 83) { // Ctrl/Cmd + s saves loaded job
                if(event.ctrlKey || event.metaKey || event.altKey)
                {
                    $("#saveChanges").trigger("click");
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                }
            }
             else if(event.keyCode == 70) { // Ctrl/Cmd + f opens find in job panel
                if(event.altKey)
                {
                    if(!taskDesigner.loadedSchedule)
                    {
                        crushFTP.UI.growl("Job not loaded", "Load Job to the editor to use this", true, 3000);
                    }
                    else
                    {
                        $("#taskSearchDialog").dialog("open");
                    }
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                }
            }
         }).bind("click", function(e){
            if(!$(e.target).closest(".canvas").length>0){
                taskDesigner.isFocusOnCanvas = false;
            }
        });

        /*Existing jobs panel*/
        var existingJobsPanel = $("#existingJobsPanel");
        $("#existingJobsBtn").click(function(){
            if(existingJobsPanel.is(":visible"))
            {
                if(taskDesigner.panel.hasClass('pinned-sidebar'))
                    return false;
                existingJobsPanel.slideUp("fast");
            }
            else
                existingJobsPanel.slideDown("fast", function(){
                    /* chrome and safari have a small bug on rendering the elements, we need set an small timer so this dont lose the focus added by carlos */
                    setTimeout(function(){
                        existingJobsPanel.find("#filterSchedules").focus();
                    }, 500);
                });
            return false;
        });

        existingJobsPanel.find(".closeBtn").click(function(){
            if(taskDesigner.panel.hasClass('pinned-sidebar'))
                return false;
            existingJobsPanel.slideUp();
            return false;
        });

        existingJobsPanel.find(".pinBtn").click(function(){
            taskDesigner.panel.toggleClass("pinned-sidebar");
            localStorage.setItem("pinJobsPanel", taskDesigner.panel.hasClass("pinned-sidebar") + "");
            return false;
        });

        if(localStorage.getItem("pinJobsPanel") == "true"){
            taskDesigner.panel.addClass("pinned-sidebar");
        }

        $("#jobsScheduleListActions").find("a").unbind().click(function(){
            if($(this).hasClass("selectAll"))
            {
                crushFTP.UI.checkUnchekInput($("#jobsScheduleList").find("input[type='checkbox']"), false);
                crushFTP.UI.checkUnchekInput($("#jobsScheduleList").find("li:visible").find("input[type='checkbox']"), true);
            }
            else if($(this).hasClass("deSelect"))
            {
                crushFTP.UI.checkUnchekInput($("#jobsScheduleList").find("input[type='checkbox']"), false);
            }
            return false;
        });

        var activeJobsList = $("#activeScheduleList");
        $("#jobsActiveScheduleListActions").find("a").unbind().click(function(){
            if($(this).hasClass("selectAll"))
            {
                crushFTP.UI.checkUnchekInput(activeJobsList.find("input[type='checkbox']"), false);
                crushFTP.UI.checkUnchekInput(activeJobsList.find("li:visible").find("input[type='checkbox']"), true);
            }
            else if($(this).hasClass("deSelect"))
            {
                crushFTP.UI.checkUnchekInput(activeJobsList.find("input[type='checkbox']"), false);
            }
            else
            {
                var that = $(this);
                crushFTP.UI.checkUnchekInput(activeJobsList.find("input[type='checkbox']"), false);
                activeJobsList.find("li").each(function () {
                    var item = $(this);
                    var data = item.data("controlData");
                    var status = data.status;
                    if(that.hasClass("selectRunning")) {
                        if (status == "polling")
                        {
                            crushFTP.UI.checkUnchekInput($(this).find("input[type='checkbox']"), true);
                        }
                    }
                    else if(that.hasClass("selectPaused")) {
                        if (status == "paused")
                        {
                            crushFTP.UI.checkUnchekInput($(this).find("input[type='checkbox']"), true);
                        }
                    }
                    else if(that.hasClass("selectCompleted")) {
                        if (status == "completed")
                        {
                            crushFTP.UI.checkUnchekInput($(this).find("input[type='checkbox']"), true);
                        }
                    }
                    else if(that.hasClass("selectWithError")) {
                        if (status == "completed-errors" || status == "error")
                        {
                            crushFTP.UI.checkUnchekInput($(this).find("input[type='checkbox']"), true);
                        }
                    }
                    else if(that.hasClass("selectCancelled")) {
                        if (status == "cancelled")
                        {
                            crushFTP.UI.checkUnchekInput($(this).find("input[type='checkbox']"), true);
                        }
                    }
                });
            }
            return false;
        });

        taskDesigner.jobDetailsDialog = $("#jobDetailsDialog", taskDesigner.panel);
        taskDesigner.jobDetailsDialog.form().dialog({
            autoOpen: false,
            title : "Job Details: ",
            modal: true,
            minWidth : 870,
            minHeight : 650,
            resizable: false,
            zIndex : 5001,
            closeOnEscape: true,
            show: {effect: 'fade', duration: 600},
            hide: {effect: 'fade', duration: 400},
            buttons : {
                "Cancel" : function(){
                    if(typeof $(this).data("curTimeList") != "undefined")
                        taskDesigner.loadedSchedule.scheduleTime = $(this).data("curTimeList");
                    $(this).removeData("curTimeList");
                    taskDesigner.scheduleInfoOpen = false;
                    $(this).dialog("close");
                },
                "OK" : function(){
                    var hasChanges = taskDesigner.jobDetailsDialog.attr("hasChanges");
                    var xmlString = adminPanel.data.buildXMLToSubmitForm(taskDesigner.jobDetailsDialog, false, "_id");
                    var weekDays = "";
                    $(".weekdays", taskDesigner.jobDetailsDialog).find(".ui-state-active").each(function(){
                        weekDays += "("+$(this).attr("_day")+")";
                    });
                    xmlString += "\n<weekDays>"+weekDays+"</weekDays>";
                    var nextRunDate = taskDesigner.jobDetailsDialog.find("#nextRun").datetimepicker("getDate");
                    var nextRun = nextRunDate ? nextRunDate.getTime() : '-1';
                    var monthDays = "";
                    $(".monthdays", taskDesigner.jobDetailsDialog).find(".ui-state-active").each(function(){
                        monthDays += "("+$(this).attr("_day")+")";
                    });
                    xmlString += "\n<monthDays>"+monthDays+"</monthDays>";
                    var selected = taskDesigner.jobDetailsDialog.find("input[name='scheduleType']:checked");
                    var scheduleType = false;
                    if(selected && selected.length>0)
                    {
                        scheduleType = selected.attr("_id");
                    }
                    xmlString += "\n<scheduleType>"+scheduleType+"</scheduleType>";
                    xmlString = "<root>" + xmlString + "</root>";
                    var items = $.xml2json(xmlString);
                    var controlData = $.extend(true, {}, taskDesigner.loadedSchedule);
                    var oldName = controlData.scheduleName;
                    controlData = $.extend(controlData, items);
                    if(controlData.nextRun != nextRun)
                        controlData.nextRun = nextRun;
                    else if(hasChanges)
                        controlData.nextRun = "-1";
                    if(controlData.max_runtime_hours == ""){
                        controlData.max_runtime_hours = "00";
                    }
                    if(controlData.max_runtime_minutes == ""){
                        controlData.max_runtime_minutes = "00";
                    }
                    if(typeof controlData.log_enabled == "undefined"){
                        controlData.log_enabled = "true";
                    }
                    for(var key in taskDesigner.loadedSchedule){
                        if(typeof taskDesigner.loadedSchedule[key] == "string" && taskDesigner.loadedSchedule[key] != controlData[key])
                            audit.addLog("Setting changed: " + (taskDesigner.jobDetailsDialog.find("[for='"+key+"']").text() || key) + " from '" + taskDesigner.loadedSchedule[key] + "' to '" + controlData[key] + "' ");
                    }
                    taskDesigner.loadedSchedule = controlData;
                    var newName = controlData.scheduleName;
                    var dlg = $(this);
                    if(oldName != newName)
                    {
                        if(newName.indexOf("__") == 0){
                            controlData.scheduleName = oldName;
                            jAlert("Job name starting with '__' is reserved for temporary jobs, please use another name", "Error", function(){
                                $("#scheduleName_jobs").focus().select();
                            });
                            return false;
                        }
                        taskDesigner.renameJob(oldName, newName, function(flag){
                            taskDesigner.loadedSchedule.scheduleName = oldName;
                            $("#editingJobName, #editingJobName2").text(decodeURIComponent(unescape(newName)));
                            taskDesigner.hasPendingChanges(true);
                            audit.addLog("Job name changed: from '" + oldName + "' to '" + newName + "'");
                            dlg.dialog("close");
                        });
                    }
                    else
                    {
                        if(hasChanges){
                           taskDesigner.hasPendingChanges(true);
                        }
                        $(this).dialog("close");
                    }
                }
            },
            open: function() {
                $(this).data("curTimeList", taskDesigner.loadedSchedule.scheduleTime);
                $('#pickUsers', taskDesigner.jobDetailsDialog).unbind().click(function(){
                    $("#schedule_allowed_usernames", taskDesigner.jobDetailsDialog).crushFtpPickUserPopup();
                    return false;
                })
                $('#timeValueadd').timepicker({
                    ampm: true,
                    timeFormat: 'hh:mm tt',
                    onShown : function(){
                        $('#ui-datepicker-div').find(".ui-datepicker-close").click(function(){
                            $('#addinTimeList').click();
                        });
                    },
                    beforeShow: function(el, instance, timePicker) {
                        setTimeout(function(){
                            $('#ui-datepicker-div').find(".ui-priority-primary").unbind("click.custom").bind("click.custom", function() {
                                if(!$(el).val()){
                                    $(el).val(timePicker.formattedTime);
                                }
                            });
                        }, 100);

                        $('#ui-datepicker-div').find(".ui-datepicker-close").click(function() {
                            $('#addinTimeList').click();
                        });
                    }
                });
                var nextRun = $("#nextRun").datetimepicker({
                    showOn: "both",
                    buttonImage: "/WebInterface/Resources/images/calendar.png",
                    buttonImageOnly: true,
                    minDate: new Date()
                });
                if(taskDesigner.loadedSchedule.nextRun && taskDesigner.loadedSchedule.nextRun != "-1"){
                    try{
                        var date = new Date(parseInt(taskDesigner.loadedSchedule.nextRun));
                        nextRun.datetimepicker("setDate", date);
                    }catch(ex){}
                }
                $('#addinTimeList').click(function(){
                    var timevalue = $.trim($("#timeValueadd").val());
                    if(!timevalue)
                        return false;
                    if(!taskDesigner.formatTime(timevalue) && timevalue!='')
                    {
                        $("#timeValueadd").val("");
                        alert(timevalue+" is invalid Time");
                        return false;
                    }
                    else if(!taskDesigner.checkIfArrayIsUniqueWithValue(taskDesigner.loadedSchedule.scheduleTimeList,timevalue))
                    {
                        $("#timeValueadd").val("");
                        alert(timevalue+" is already exists.");
                        return false;
                    }
                    else
                    {
                        timevalue=taskDesigner.formatTime(timevalue);
                        taskDesigner.loadedSchedule.scheduleTimeList.push(timevalue);
                        var timearray=taskDesigner.loadedSchedule.scheduleTimeList;
                        $(".time-list-fieldset").html("");
                        timearray.sort(function (a, b) {
                           return new Date('1970/01/01 ' + a) - new Date('1970/01/01 ' + b);
                        });
                        taskDesigner.loadedSchedule.scheduleTime="";
                        for(var i=0;i<timearray.length;i++)
                        {
                            if(timearray[i]!='')
                            {
                                timearray[i]=timearray[i].toUpperCase();
                                var timeliststr="<span class='time-list excludeXML' _index='1' value='"+timearray[i]+"' style='' disabled _id='"+timearray[i]+"'>"+timearray[i]+"</span><span class='pointer ui-icon ui-icon-close removefromtimelist time-list-remove-icon' _id='"+timearray[i]+"'></span>";
                                if(i==0)
                                    taskDesigner.loadedSchedule.scheduleTime+=timearray[i];
                                else
                                    taskDesigner.loadedSchedule.scheduleTime+=","+timearray[i];

                                $(".time-list-fieldset").append(timeliststr);
                                taskDesigner.setRemoveTimeCall();
                            }
                        }
                        $("#scheduleTime_jobs").val(taskDesigner.loadedSchedule.scheduleTime);
                        taskDesigner.setRemoveTimeCall();
                        $("#timeValueadd").val("");
                    }
                    return false;
                });


                for(var i=0;i<taskDesigner.loadedSchedule.scheduleTime.length;i++)
                {
                    if(taskDesigner.loadedSchedule.scheduleTime[i]!='')
                    {
                        taskDesigner.loadedSchedule.scheduleTime[i]=taskDesigner.formatTime(taskDesigner.loadedSchedule.scheduleTime[i])
                    }
                }

                var timearray = taskDesigner.loadedSchedule.scheduleTime.split(",");
                timearray.sort(function (a, b) {
                   return new Date('1970/01/01 ' + a) - new Date('1970/01/01 ' + b);
                });
                taskDesigner.loadedSchedule.scheduleTimeList = timearray;
                $(".time-list-fieldset").html("");
                for(var i=0;i<timearray.length;i++)
                {
                    if(timearray[i]!='')
                    {
                        timearray[i]=taskDesigner.formatTime(timearray[i].toUpperCase());
                        var timeliststr="<span type='text' class='time-list excludeXML' _index='1' value='"+timearray[i]+"' style='' disabled _id='"+timearray[i]+"'>"+timearray[i]+"</span><span class='pointer ui-icon ui-icon-close removefromtimelist time-list-remove-icon' _id='"+timearray[i]+"'></span>";
                        $(".time-list-fieldset").append(timeliststr);
                        taskDesigner.setRemoveTimeCall();
                    }
                }

                $('.ui-widget-overlay').addClass('custom-overlay');
                taskDesigner.jobDetailsDialog.removeAttr("hasChanges");
                taskDesigner.jobDetailsDialog.find("input, textarea").unbind("textchange.setup").bind("textchange.setup", function(){
                    taskDesigner.jobDetailsDialog.attr("hasChanges", "true");
                });
                taskDesigner.jobDetailsDialog.find("input, textarea").unbind("change.setup").bind("change.setup", function(){
                    taskDesigner.jobDetailsDialog.attr("hasChanges", "true");
                });
                taskDesigner.jobDetailsDialog.find("a.showXML").unbind().click(function(){
                    jAlert("", "Job's XML", function(){},
                        {
                            appendAfterInput : "<textarea style='width:590px;height:500px;padding:2px;margin:2px;'><?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<job type=\"properties\">"+$(taskDesigner.loadedScheduleXML).html()+"</job></textarea>"
                        }
                    );
                });
                taskDesigner.jobDetailsDialog.find(".batchJobSelector").each(function(){
                    var btn = $(this);
                    btn.button().contextMenu({
                            menu: "batchJobSelector",
                            openOnClick : true,
                            inSpeed : 0,
                            outSpeed : 0
                        },
                        function(action, el, pos) {
                        if(action == "current")
                        {
                            btn.find("span.current").removeClass("batch");
                            btn.removeClass("ui-state-hover");
                        }
                        else if(action == "batch" || action == "selectedBatch")
                        {
                            btn.addClass("ui-state-hover");
                            var confirmText = "Are you sure you wish to set all available jobs to override this setting?<br><br>";
                            var okBtnText = "Yes, to all available jobs";
                            if(action == "selectedBatch")
                            {
                                confirmText = "Are you sure you wish to set all selected jobs in the list to override this setting?<br><br>";
                                okBtnText = "Yes, to all selected jobs";
                            }

                            jConfirm(confirmText,"Confirm", function(flag){
                                if(!flag)
                                {
                                    return;
                                }
                                taskDesigner.saveBatchInfo(btn, action == "selectedBatch");
                            },{
                                okButtonText : okBtnText,
                                cancelButtonText : "No, only current Job"
                            });
                        }
                    });
                });
            },
            close: function() {
                $('.ui-widget-overlay').removeClass('custom-overlay');
            }
        });

        $(".monthdays, .weekdays", taskDesigner.jobDetailsDialog).find("div").unbind().click(function(){
            if($(this).hasClass("ui-state-active"))
            {
                $(this).removeClass("ui-state-active");
            }
            else
            {
                $(this).addClass("ui-state-active");
            }
            taskDesigner.jobDetailsDialog.attr("hasChanges", "true");
            //panelJobsSchedule.hasPendingChanges(true);
         });

        $("input[name='scheduleType']", taskDesigner.jobDetailsDialog).unbind().change(function(){
            var selected = $("input[name='scheduleType']:checked", taskDesigner.jobDetailsDialog);
            var scheduleType = false;
            if(selected && selected.length>0)
            {
                scheduleType = selected.attr("_id");
            }
            var periodOptions = $("div[_id='periodOptions']", taskDesigner.jobDetailsDialog).hide();
            if(scheduleType)
            {
                periodOptions.show();
                periodOptions.find("div.option").hide();
                periodOptions.find("div." + scheduleType).show();
            }
        });

        $(".jobsPanelButtons", existingJobsPanel).find("a").unbind().click(function(){
            if($(this).attr("id") == "newJobsSchedule")
            {
                if(!$(document).data("app_enterprise"))
                {
                    jAlert('<div style="text-align:center">To use this feature, an Enterprise license is required.<br><br> To get more information on features and pricing, see the following links: <br><br><a href="http://crushftp.com/pricing.html#enterprise" tabIndex="-1" target="_blank">Plans &amp; Pricing</a> | <a href="http://www.crushftp.com/crush6wiki/Wiki.jsp?page=Enterprise%20License%20Enhancements" tabIndex="-1" target="_blank">Enterprise License Enhancements</a></div>', "This is an Enterprise License feature");
                    return false;
                }
                var folderName = "", folderNameDisplay = "";
                if(taskDesigner.currentJobFolder && taskDesigner.currentJobFolder !== "/")
                {
                    folderName = taskDesigner.currentJobFolder + "";
                    if(!folderName.endsWith("/")){
                        folderName = folderName + "/";
                    }
                    folderNameDisplay = folderName + "";
                    if(!folderNameDisplay.startsWith("/")){
                        folderNameDisplay = "/" + folderNameDisplay;
                    }
                }
                jPrompt("Job Name: ", "", "Input", function(scheduleName){
                    if(scheduleName != null && scheduleName.length>0)
                    {
                        scheduleName = $.trim(scheduleName);
                        scheduleName = folderName + scheduleName;
                        if(scheduleName.indexOf("__") == 0){
                            jAlert("Job name starting with '__' is reserved for temporary jobs, please use another name", "Error", function(){
                                $("#newJobsSchedule").trigger('click');
                            });
                            return false;
                        }
                        if(taskDesigner.isJobNameInUse(scheduleName))
                        {
                            jAlert("Job name is already in use, please use another name", "Error", function(){
                                $("#newJobsSchedule").trigger('click');
                            });
                            return false;
                        }
                        var newSchedule = taskDesigner.defaultTemplateForSchedule;
                        newSchedule = $.extend(true, {}, newSchedule);
                        newSchedule.scheduleName = scheduleName;
                        newSchedule.id = crushFTP.methods.generateRandomPassword(8);

                        var controlData = newSchedule;
                        if(controlData && controlData.tasks)
                            delete controlData.tasks;

                        var canWidth = taskDesigner.canvas.width();
                        var canHeight = taskDesigner.canvas.height();
                        controlData.canvasSize = canWidth.toString() + "," + canHeight.toString();
                        var dataXML = $.json2xml(controlData, {rootTagName: 'schedules_subitem'});
                        dataXML = dataXML.replace(/\<schedules_subitem>/g, "<schedules_subitem type=\"properties\">")
                                    .replace(/\<type>properties<\/type>/g, "").replace(/\<\/schedules_subitem>/g, "");
                        var xml = "";
                        var rootConnections = [];
                        rootConnections.push("<connections type=\"vector\"><connections_subitem type=\"properties\"><type>dummy</type></connections_subitem></connections><enabled>true</enabled>");
                        if(dataXML && dataXML.length>0)
                        {
                            xml = dataXML + xml + rootConnections.join("") + "</schedules_subitem>";
                        }
                        function continueAdding(){
                            if(xml && xml.length>0)
                            {
                                taskDesigner.showLoading();
                                var obj = {
                                    command: "addJob",
                                    name : scheduleName,
                                    data : xml
                                };
                                if(crushFTP.replicationSavePrefs){
                                    obj.ui_save_preferences_item = crushFTP.replicationSavePrefs;
                                }
                                console.log("AddJob called from newJob");
                                crushFTP.data.serverRequest(obj, function(data){
                                    var status = $.trim($(data).find("response_status").text());
                                    if(status.toLowerCase().indexOf("failure")!=0)
                                    {
                                        crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
                                        taskDesigner.showLoading(true);
                                        var selected = $("#jobsScheduleList").find("li.loadedSchedule");
                                        var _sch = false;
                                        if(selected.length>0)
                                            _sch = unescape(selected.attr("_id"));
                                        taskDesigner.updateJobsLocal("add",
                                            {
                                                created: "",
                                                dailyAmount: "",
                                                enabled: "",
                                                minutelyAmount: "",
                                                modified: "",
                                                monthDays: "",
                                                monthlyAmount: "",
                                                name: scheduleName,
                                                nextRun: "",
                                                scheduleTime: "",
                                                scheduleType: "",
                                                type: "",
                                                weekDays: "",
                                                weeklyAmount: ""
                                            });
                                        taskDesigner.bindData(true);
                                        var jobFolders = $("#jobFolders").trigger('change');
                                        if(_sch)
                                        {
                                            $("#jobsScheduleList").find("li[_id='"+escape(_sch)+"']").addClass('loadedSchedule');
                                        }
                                        $("#jobsScheduleList").find("li[_id='"+escape(scheduleName)+"']").trigger("click");
                                        filterSchedules.removeData("last_searched").trigger('keyup', [true]);
                                        setTimeout(function(){
                                            filterSchedules.removeData("last_searched").trigger('keyup', [true]);
                                        },100);
                                        // taskDesigner.showAvailableJobs(function(){
                                        // });
                                    }
                                    else
                                    {
                                        crushFTP.UI.growl("Error while saving", "Your changes are not saved. " + crushFTP.methods.htmlEncode(status), true);
                                        taskDesigner.showLoading(true);
                                    }
                                });
                            }
                        }
                        crushFTP.Replication.showOptionsOrContinue(continueAdding);
                    }
                }, false, false, {
                    prependBeforeInput: $("<strong>"+folderNameDisplay+"</strong>")
                });
                return false;
            }
            else if($(this).attr("id") == "newFolder")
            {
                taskDesigner.addNewFolder();
                return false;
            }
            else if($(this).attr("id") == "jobsSetup")
            {
                taskDesigner.showJobsSettings();
                return false;
            }
            else if($(this).attr("id") == "importJob")
            {
                var pickingFor = "Import Job";
                var advancedBrowse = true;
                var existingData = {};
                var curPath = "";
                if(!existingData.timeout || typeof existingData.timeout == "undefined")
                {
                    existingData.timeout = "20000";
                }
                if(!existingData.write_timeout || typeof existingData.write_timeout == "undefined")
                {
                    existingData.write_timeout = "20000";
                }
                if(!existingData.read_timeout || typeof existingData.read_timeout == "undefined")
                {
                    existingData.read_timeout = "20000";
                }
                if(!existingData.onedriveTenant || typeof existingData.onedriveTenant == "undefined")
                {
                    existingData.onedriveTenant = "common";
                }
                if(typeof existingData.sharepoint_site_drive_name == "undefined")
                {
                    existingData.sharepoint_site_drive_name = "Documents";
                }
                $(this).crushFtpLocalFileBrowserPopup({
                    type : 'file',
                    pickingFor: pickingFor,
                    file_mode : 'local',
                    isFTPBrowse: false,
                    existingData : existingData || {},
                    urlWithParams: true,
                    importJob: true,
                    existingVal : "/",
                    callback : function(selectedPath){
                        if(selectedPath){
                            var obj = {
                                command: "importJob",
                                path: crushFTP.methods.htmlEncode(selectedPath)
                            };
                            crushFTP.UI.showLoadingIndicator({});
                            crushFTP.data.serverRequest(obj,
                                function(msg){
                                    var data = $.xml2json(msg, true);
                                    crushFTP.UI.hideLoadingIndicator({});
                                    if(data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && (crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK" || crushFTP.data.getTextValueFromXMLNode(data.response_status).toLowerCase().indexOf("success")>=0))
                                    {
                                        var message = crushFTP.data.getTextValueFromXMLNode(data.response_status);
                                        crushFTP.UI.growl("Job imported: " + message, "", false, 5000);
                                        $("#reloadJobsList").trigger("click",[true]);
                                        taskDesigner.onReloadList = function(){
                                            var jobName = message.split(":")[1] || "";
                                            $("#jobsScheduleList").find("li[_id='"+escape(jobName)+"']").trigger("click");
                                        }
                                    }
                                    else
                                    {
                                        crushFTP.UI.growl("Error while importing job", "Error: " + crushFTP.methods.htmlEncode($(msg).find("response_status").text()), true, 3000);
                                    }
                                }
                            , false, "POST");
                        }
                    }
                });
                return false;
            }
            else if($(this).attr("id") == "reloadJobsList")
            {
                var selected = $("#jobsScheduleList").find("li.loadedSchedule");
                var _sch = false;
                var curSearch = filterSchedules.val();
                if(selected.length>0)
                    _sch = unescape(selected.attr("_id"));
                taskDesigner.showAvailableJobs(function(){
                    taskDesigner.bindData();
                    if(_sch)
                    {
                        var itm = $("#jobsScheduleList").find("li[_id='"+escape(_sch)+"']").addClass('loadedSchedule ui-state-focus');
                        if(itm && itm.length>0)
                        {
                            crushFTP.UI.checkUnchekInput(itm.find("input"), true);
                        }
                    }
                    var jobFolders = $("#jobFolders").trigger('change', {keepFilter: true});
                    filterSchedules.removeData("last_searched").val(curSearch).trigger('keyup', [true]);
                    if(taskDesigner.onReloadList){
                        taskDesigner.onReloadList();
                        delete taskDesigner.onReloadList;
                    }
                });
            }
            else if($(this).attr("id") == "deleteJobsSchedule")
            {
                var items = [];
                var jobsScheduleList = $("#jobsScheduleList");
                jobsScheduleList.find("input:checked").each(function(){
                    items.push(unescape($(this).closest("li").attr("_id")));
                });
                if(items.length>0)
                {
                    var total = items.length;
                    jConfirm("Are you sure you wish to remove selected "+ total +" schedule(s)?", "Confirm", function(value){
                        if(value)
                        {
                            function removeSchedule()
                            {
                                crushFTP.UI.showIndicator(false, false, "Please wait..");
                                if(items.length>0)
                                {
                                    var curItem = items.pop();
                                    taskDesigner.removeSchedule(curItem, removeSchedule);
                                }
                                else
                                {
                                    var loadedID = false;
                                    if(taskDesigner.loadedSchedule && taskDesigner.loadedSchedule.scheduleName)
                                    {
                                        loadedID = taskDesigner.loadedSchedule.scheduleName;
                                    }
                                    // taskDesigner.showAvailableJobs(function(){
                                    // });
                                    taskDesigner.bindData();
                                    var jobFolders = $("#jobFolders").trigger('change');
                                    if(loadedID && jobsScheduleList.find("li[_id='"+escape(loadedID)+"']").addClass("loadedSchedule ui-state-focus").length == 0)
                                    {
                                        taskDesigner.hasPendingChanges(false);
                                        taskDesigner.clearLoadedTaskData();
                                        taskDesigner.resizeCanvas();
                                        $("#editingJobName, #editingJobName2").text("Untitled");
                                        taskDesigner.canvas.empty().append('<div class="bottomTrigger resizer ui-corner-all" title="Expand height"></div><div class="rightTrigger resizer ui-corner-all" title="Expand width"></div>');
                                        var op = {};
                                        op.top = $(taskDesigner.canvas).height();
                                        op.left = ($(taskDesigner.canvas).width());
                                        taskDesigner.addItemToCanvas($("<div class='end'>"), op);

                                        op.top = 50;
                                        op.left = 10;
                                        taskDesigner.addItemToCanvas($("<div class='start'>"), op);
                                    }
                                    crushFTP.UI.growl("Schedules removed", "Total "+ total +" schedule(s) removed", false, 5000);
                                    taskDesigner.showLoading(true);
                                }
                            }
                            crushFTP.Replication.showOptionsOrContinue(removeSchedule);
                        }
                    });
                }
            }
            // else if($(this).attr("id") == "copyJobsSchedule")
            // {
   //              taskDesigner.copySelectedJob();
            // }
            else if($(this).attr("id") == "pasteJobsSchedule")
            {
                if($(this).hasClass('ui-state-disabled') || !taskDesigner.copiedJobName)
                    return false;
                var jobName = taskDesigner.copiedJobName;
                var move = taskDesigner.jobSelectedToMove;
                taskDesigner.getJobDetailsByName(jobName, function(controlData, xml){
                    if(controlData)
                    {
                        var folderName = "", folderNameDisplay = "";
                        if(taskDesigner.currentJobFolder && taskDesigner.currentJobFolder !== "/")
                        {
                            folderName = taskDesigner.currentJobFolder + "";
                            if(!folderName.endsWith("/")){
                                folderName = folderName + "/";
                            }
                            folderNameDisplay = folderName + "";
                            if(!folderNameDisplay.startsWith("/")){
                                folderNameDisplay = "/" + folderNameDisplay;
                            }
                        }

                        function copyOrMoveJob(scheduleName){
                            if(scheduleName != null && scheduleName.length>0)
                            {
                                scheduleName = $.trim(scheduleName);
                                scheduleName = folderName + scheduleName;
                                if(scheduleName.indexOf("__") == 0){
                                    jAlert("Job name starting with '__' is reserved for temporary jobs, please use another name", "Error", function(){
                                        taskDesigner.copySelectedJob();
                                    });
                                    return false;
                                }
                                if(taskDesigner.isJobNameInUse(scheduleName))
                                {
                                    jAlert("Job name is already in use, please use another name", "Error", function(){
                                        taskDesigner.copySelectedJob();
                                    });
                                    return false;
                                }
                                function continueAddingJob(){
                                    taskDesigner.getServerTime(function(curTime){
                                        var uid = crushFTP.methods.generateRandomPassword(8);
                                        $(xml).find("connectionID").each(function(){
                                            var _uid = crushFTP.methods.generateRandomPassword(8);
                                            var curUID = $(this).text();
                                            if(curUID != "EndPoint" && curUID != "StartPoint"){
                                                $(this).text(_uid);
                                                $(xml).find("jump_false_task_id:contains('"+curUID+"'), connectionID:contains('"+curUID+"'), jump_task_id:contains('"+curUID+"')").each(function(){
                                                    $(this).text(_uid);
                                                });
                                            }
                                        });
                                        $(xml).find("audit_trail").remove();
                                        xml = getTextFromXML(xml);
                                        _id = controlData.id;
                                        xml = xml.replace(/\+/g, "%2B");
                                        if(!move){
                                            xml = xml.replace("<id>"+_id+"</id>", "<id>"+uid+"</id>").replace("<scheduleName>"+controlData.scheduleName+"</scheduleName>", "<scheduleName>"+scheduleName+"</scheduleName><nextRun>-1</nextRun>");
                                            xml = xml.replace("<created>"+controlData.created+"</created>", "<created>"+curTime+"</created>");
                                            xml = xml.replace("<modified>"+controlData.modified+"</modified>","<modified>"+curTime+"</modified>");
                                        }
                                        if(xml.indexOf("<created>")<0){
                                            xml = xml.replace("</scheduleName>", "</scheduleName><created>"+curTime+"</created>");
                                        }
                                        taskDesigner.showLoading();
                                        var obj = {
                                            command: "addJob",
                                            name : scheduleName,
                                            data : xml
                                        };
                                        if(crushFTP.replicationSavePrefs){
                                            obj.ui_save_preferences_item = crushFTP.replicationSavePrefs;
                                        }
                                        console.log("AddJob called from pasteJobs");
                                        crushFTP.data.serverRequest(obj, function(data){
                                            var status = $.trim($(data).find("response_status").text());
                                            if(status.toLowerCase().indexOf("failure")!=0)
                                            {
                                                function jobCopied(){
                                                    taskDesigner.showAvailableJobs(function(){
                                                        taskDesigner.bindData();
                                                        var jobFolders = $("#jobFolders").trigger('change');
                                                        taskDesigner.hasPendingChanges(false);
                                                        taskDesigner.clearLoadedTaskData();
                                                        crushFTP.UI.growl("Schedule Added", "Your changes are saved", false, 5000);
                                                        taskDesigner.showLoading(true);
                                                        $("#pasteJobsSchedule").addClass('ui-state-disabled');
                                                        delete taskDesigner.copiedJobName;
                                                        delete taskDesigner.jobSelectedToMove;
                                                        if(_id)
                                                        {
                                                            $("#jobsScheduleList").find("li[_id='"+escape(_id)+"']").addClass('loadedSchedule');
                                                        }
                                                        $("#jobsScheduleList").find("li[_id='"+escape(scheduleName)+"']").trigger("click");
                                                        filterSchedules.removeData("last_searched").trigger('keyup', [true]);
                                                        setTimeout(function(){
                                                            filterSchedules.removeData("last_searched").trigger('keyup', [true]);
                                                        },100);
                                                    });
                                                }
                                                if(move){
                                                    taskDesigner.removeSchedule(taskDesigner.copiedJobName.path, jobCopied);
                                                }
                                                else{
                                                    jobCopied();
                                                }
                                            }
                                            else
                                            {
                                                crushFTP.UI.growl("Error while saving", "Your changes are not saved. " + crushFTP.methods.htmlEncode(status), true);
                                                taskDesigner.showLoading(true);
                                            }
                                        });
                                    });
                                }
                                crushFTP.Replication.showOptionsOrContinue(continueAddingJob);
                            }
                        }

                        if(!move){
                            jPrompt("Job Name", "Copy Of " + crushFTP.methods.htmlEncode(taskDesigner.copiedJobName.name), "Input", function(scheduleName){
                                copyOrMoveJob(scheduleName);
                            }, false, false, {
                                prependBeforeInput: $("<strong>"+folderNameDisplay+"</strong>")
                            });
                        }
                        else{
                            copyOrMoveJob(taskDesigner.copiedJobName.name);
                        }
                    }
                });
            }
            return false;
         });
        var delay = (function () {
            var timer = 0;
            return function (callback, ms) {
                clearTimeout(timer);
                timer = setTimeout(callback, ms);
            };
        })();

        var filterInputSchedules = $("#filterSchedules", existingJobsPanel).unbind("keyup").keyup(function (evt, data) {
            var evt = (evt) ? evt : ((event) ? event : null);
            if (evt.keyCode == 27)
            {
                if($(this).val()=="")
                {
                    if($("#existingJobsPanel").is(":visible"))
                        $("#existingJobsBtn").trigger("click");
                }
                else
                {
                    $(this).val("").trigger("keyup");
                    existingJobsPanel.find("#jobsScheduleList").find(".ui-state-active").removeClass("ui-state-active");
                }
                return false;
            }
            else if(evt.keyCode == 13)
            {
                var active = existingJobsPanel.find("#jobsScheduleList").find(".ui-state-active");
                if(active.length>0)
                {
                    $(this).val("").trigger("keyup");
                    existingJobsPanel.find("#jobsScheduleList").find(".ui-state-active").removeClass("ui-state-active").trigger("click");
                }
                return false;
            }
            else if(evt.keyCode == 38 || evt.keyCode == 40)
            {
                evt.stopPropagation();
                evt.preventDefault();
                var active = existingJobsPanel.find("#jobsScheduleList").find(".ui-state-active");
                if(active.length==0)
                {
                    active = existingJobsPanel.find("#jobsScheduleList").find("li:visible:first").addClass("ui-state-active");
                    return;
                }
                var isUp = evt.keyCode == 38;
                if(isUp)
                {
                    if(active.prevAll(":visible").length>0)
                    {
                        existingJobsPanel.find("#jobsScheduleList").find(".ui-state-active").removeClass("ui-state-active");
                        active.prevAll(":visible:first").addClass("ui-state-active");
                    }
                }
                else
                {
                    if(active.nextAll(":visible").length>0)
                    {
                        existingJobsPanel.find("#jobsScheduleList").find(".ui-state-active").removeClass("ui-state-active");
                        active.nextAll(":visible:first").addClass("ui-state-active");
                    }
                }
                return false;
            }
            var phrase = $.trim($(this).val());
            if(phrase.length<1)
            {
                phrase = "";
            }
            if ($(this).data("last_searched") && $(this).data("last_searched") === phrase) {
                return false;
            }
            function startFilter()
            {
                filterInputSchedules.data("last_searched", phrase);
                var list = existingJobsPanel.find("#jobsScheduleList");
                list.find(".ui-state-active").removeClass("ui-state-active");
                list.find("li").hide();
                list.find("*:Contains('"+phrase+"')").each(function(){
                    $(this).closest("li").show();
                });
            }
            if(data)
            {
                startFilter();
            }
            else
            {
                delay(function () {
                    startFilter();
                }, 200);
            }
        });

        $(".clearSchedulesFilter", existingJobsPanel).unbind().click(function(){
            filterInputSchedules.val("").removeData("last_searched").trigger("keyup", ["noDelay"])
            return false;
        });

        var findInTasks = $("#findInTasks").unbind("keyup").keyup(function (evt, data) {
            var evt = (evt) ? evt : ((event) ? event : null);
            if (evt.keyCode == 27)
            {
                $(this).val("").trigger("keyup");
                return false;
            }
            else if(evt.keyCode == 13)
            {
                if($(this).val()!="")
                {
                    $(this).val("").trigger("keyup");
                }
                return false;
            }
            var phrase = $.trim($(this).val());
            if(phrase.length<1)
            {
                phrase = "";
            }
            if ($(this).data("last_searched") && $(this).data("last_searched") === phrase) {
                return false;
            }
            function startFilter()
            {
                taskDesigner.canvas.find(".filteredTask").removeClass("filteredTask");
                if(phrase && phrase.length>1)
                {
                    var items = taskDesigner.canvas.find(".crushTaskItem").find(".crushTask-header:Contains('"+phrase+"'), .taskName:Contains('"+phrase+"')").closest(".crushTaskItem").addClass("filteredTask");
                    if(!crushFTP.methods.isVisibleOnScreen($(items.get(0))))
                    {
                        var itemPos = $(items.get(0)).offset();
                        if(itemPos)
                        {
                            taskDesigner.canvas.parent().scrollLeft(itemPos.left - 10);
                            $("html, body").animate({
                                scrollTop: itemPos.top - 120,
                            }, 500);
                        }
                    }
                }
            }
            if(data)
            {
                startFilter();
            }
            else
            {
                delay(function () {
                    startFilter();
                }, 200);
            }
        });

        $("#rdbDesigner, #rdbLog, #rdbUserLog").change(function(){
            var logPlaceHolder = $("#logPlaceHolder");
            if(($(this).is("#rdbLog") || $(this).is("#rdbUserLog")) && $(this).is(":checked"))
            {
                $("#jobsCanvas,#newTaskDragButton,.zoomSlider").hide();
                $(".saveJobsButton").addClass("ui-state-disabled");
                var logFile = $(this).is("#rdbLog") ? taskDesigner.activeJobLogFile : taskDesigner.activeJobUserLogFile;
                if(!logFile)
                    return false;
                if(logPlaceHolder.data("logFile") != logFile)
                {
                    if(logPlaceHolder.find("#serverLoggingFrame").length==0)
                    {
                        logPlaceHolder.show().empty().append('<iframe id="serverLoggingFrame" onload="parent.taskDesigner.hideLogLoading();" width="100%" height="700" src="/WebInterface/admin/log.html?embed=true&file='+logFile+'" style="margin:0px;padding:0px;"  marginWidth="0" marginHeight="0" frameBorder="0" scrolling="no"></iframe>');
                        logPlaceHolder.data("logFile", logFile);
                        logPlaceHolder.block({
                            message:  'Please Wait..',
                            css: {
                                width:100,
                                border: 'none',
                                padding: '10px',
                                backgroundColor: '#000',
                                '-webkit-border-radius': '10px',
                                '-moz-border-radius': '10px',
                                opacity: .5,
                                color: '#fff',
                                'text-align':'left'
                            }
                        });
                        taskDesigner.hideLogLoading = function(){
                            logPlaceHolder.unblock();
                        }
                        $(window).resize(function(){
                            var winHeight = $(window).height() < 700 ? 700 : $(window).height();
                            var top = logPlaceHolder.find("#serverLoggingFrame").offset().top + 60;
                            logPlaceHolder.find("#serverLoggingFrame").attr("height", winHeight - top + "px");
                        });
                        $(window).trigger("resize");
                    }
                    else
                    {
                        logPlaceHolder.find("#serverLoggingFrame").get(0).contentWindow.serverLogging.changeLogFile(logFile);
                        logPlaceHolder.data("logFile", logFile);
                        logPlaceHolder.show();
                    }
                }
                else
                {
                    logPlaceHolder.show();
                }
            }
            else
            {
                $(".saveJobsButton").removeClass("ui-state-disabled");
                logPlaceHolder.hide();
                $("#jobsCanvas,#newTaskDragButton,.zoomSlider").show();
            }
            taskDesigner.canvas.redraw();
        });

        $("#refreshJobInfo").unbind().click(function(){
            if(taskDesigner.activeJobToMonitor)
            {
                taskDesigner.monitorActiveJob();
            }
            return false;
        });

        $("a#pauseResumeJob, a#cancelJob").click(function(){
            if($(this).hasClass("ui-state-disabled"))
                return false;
            if(taskDesigner.activeJobToMonitor && taskDesigner.loadedSchedule)
            {
                var curStatus = taskDesigner.activeJobStatus;
                var status = "";
                if($(this).is("#pauseResumeJob"))
                {
                    if(curStatus == "paused")
                    {
                        status = "running";
                    }
                    else if(curStatus == "running")
                    {
                        status = "paused";
                    }
                }
                else
                {
                    if(curStatus == "running" || curStatus == "paused")
                    {
                        status = "cancelled";
                    }
                }
                if(status.length>0)
                {
                    var activeJob = taskDesigner.activeJobToMonitor;
                    if(activeJob)
                    {
                        activeJob = activeJob.split("||");
                        var jobID = activeJob[0];
                        var scheduleName = activeJob[1];
                        taskDesigner.updateJobsStatus(jobID, scheduleName, status);
                    }
                }
                else
                {
                    var msg = "";
                    if($(this).is("#pauseResumeJob"))
                    {
                        msg = "Selected job can not be paused/resumed"
                    }
                    else
                    {
                        msg = "Selected job can not be cancelled"
                    }
                    crushFTP.UI.growl("No Action", crushFTP.methods.htmlEncode(msg), true, 2000);
                }
            }
            return false;
        });

        var delay = (function () {
            var timer = 0;
            return function (callback, ms) {
                clearTimeout(timer);
                timer = setTimeout(callback, ms);
            };
        })();

        function filterRunningJobs(phrase){
            var listToFilter = $("#activeScheduleList");
            listToFilter.find("li").hide();
            listToFilter.find("li:Contains('"+phrase+"')").each(function(){
                var that = $(this).show();
            });

            var filter = $("#jobStatusFilter").val();
            if(filter!="")
            {
                listToFilter.find("li:visible").each(function(){
                    if(!$(this).find("div.task_status").hasClass('task_'+ filter))
                        $(this).hide();
                });
            }
        }

        var filterActiveSchedules = $("#filterActiveSchedules").unbind("keyup").keyup(function (evt) {
            var evt = (evt) ? evt : ((event) ? event : null);
            var phrase = this.value;
            if (taskDesigner.last_searched_running && taskDesigner.last_searched_running === phrase) {
                return false;
            }
            /*delay(function(){*/
                filterRunningJobs(phrase);
                taskDesigner.last_searched_running = phrase;
            /*}, 500);*/
        });

        var jobStatusFilter = $("#jobStatusFilter").unbind("change").change(function (evt) {
            filterRunningJobs(taskDesigner.last_searched_running);
        });

        var rangeSelector = $("#rangeSelector").unbind("change").change(function (evt) {
            var oldSelection = taskDesigner.lastRangeSelector;
            if($(this).val() == "custom")
            {
                $(this).val(oldSelection);
                $("#rangeSelectorDialog").dialog("open");
            }
            else
            {
                taskDesigner.rangeForActiveJobs = false;
                taskDesigner.lastRangeSelector = $(this).val();
                taskDesigner.bindActiveJobs(false, false, true);
            }
        });
        taskDesigner.lastRangeSelector = rangeSelector.val();

        $(".clearActiveSchedulesFilter").click(function(event) {
            filterActiveSchedules.val("").trigger('keyup');
            return false;
        });

        function filterJobs(phrase){
            var listToFilter = $("#jobsScheduleList");
            listToFilter.find("li").hide();
            listToFilter.find("li:Contains('"+phrase+"')").each(function(){
                var that = $(this).show();
            });
        }

        var filterSchedules = $("#filterSchedules").unbind("keyup.filter").bind("keyup.filter", function (evt) {
            var evt = (evt) ? evt : ((event) ? event : null);
            var phrase = this.value;
            if (taskDesigner.last_searched_jobs && taskDesigner.last_searched_jobs === phrase) {
                return false;
            }
            delay(function(){
                filterJobs(phrase);
                taskDesigner.last_searched_jobs = phrase;
            }, 500);
        });

        $(".clearSchedulesFilter").click(function(event) {
            filterSchedules.val("").trigger('keyup');
            return false;
        });
        $( "#jobsCanvas" ).selectable({
          filter: ".canvasPortlet",
          delay: 150,
          distance: 30,
          selected: function( event, ui ) {
            $(ui.selected).addClass('highlighted');
            taskDesigner.showCopyTasksButton();
          },
          unselected: function( event, ui ) {
            if(!event.shiftKey)
                $(ui.unselected).removeClass('highlighted');
            taskDesigner.showCopyTasksButton();
          }
        });
        function getTask(id){
            if(!taskDesigner.loadedSchedule)
                return false;
            crushFTP.methods.rebuildSubItems(taskDesigner.loadedSchedule.tasks, "tasks");
            var tasks = taskDesigner.loadedSchedule.tasks.tasks_subitem;
            for (var i = 0; i < tasks.length; i++) {
                if(tasks[i].connectionID == id)
                {
                    var task = $.extend(true, {}, tasks[i]);
                    return task;
                }
            }
            return false;
        }
        taskDesigner.copyTasksButton.unbind().click(function(){
            var selectedTasks = taskDesigner.canvas.find(".highlighted");
            var tasks = [];
            selectedTasks.each(function(){
                var uid = $(this).attr("uid");
                var task = getTask(uid);
                if(task)
                    tasks.push(task);
            });
            taskDesigner.copyTasks(tasks);
            return false;
        });
        taskDesigner.removeTasksButton.unbind().click(function(){
            var selectedTasks = taskDesigner.canvas.find(".highlighted");
            var tasks = [];
            selectedTasks.each(function(){
                var uid = $(this).attr("uid");
                var task = getTask(uid);
                if(task)
                    tasks.push(task);
            });
            taskDesigner.removeTasks(tasks);
            return false;
        });
        taskDesigner.pasteTasksButton.unbind().click(function(){
            taskDesigner.pasteTasks();
            return false;
        });
        taskDesigner.undopasteButton.unbind().click(function(){
            taskDesigner.undopasteTasks();
            return false;
        });
        $(window).resize(function () {
            taskDesigner.resizeItems();
        });
        setTimeout(function(){
            if(taskDesigner.kioskData && taskDesigner.kioskData.resizeFrame)
            {
                taskDesigner.kioskData.resizeFrame(taskDesigner.canvas.width(), taskDesigner.canvas.height()+20);
            }
        }, 500);

        $("#hideUserActiveSchedules").unbind().bind("change", function(){
            taskDesigner.bindActiveJobs();
        });
    },
    undopasteTasks : function(){
        var points = taskDesigner.canvas.find(".highlighted");
        points.each(function(){
            if($(this).parent().is("#jobsCanvas")){
                $(this).find(".closeBtn").addClass('no-confirm').trigger('click');
            }
        });
        taskDesigner.undopasteButton.hide();
    },
    pasteTasks : function(tasks){
        if(!taskDesigner.copiedTasks)
            return false;
        jConfirm("Are you sure you wish to paste "+taskDesigner.copiedTasks.tasks.length+" task(s) copied from the job <strong>'"+crushFTP.methods.htmlEncode(taskDesigner.copiedTasks.job)+"'</strong>?", "Confirm", function(flag){
            if(flag)
            {
                var tasks = $.extend(true, [], taskDesigner.copiedTasks.tasks);
                var replaceIDs = {};
                for (var i = 0; i < tasks.length; i++) {
                    if(tasks[i].connectionID && tasks[i].connectionID != null && tasks[i].connectionID.toString() != "null" && tasks[i].connectionID.toString() != "undefined")
                        replaceIDs[tasks[i].connectionID] = crushFTP.methods.generateRandomPassword(8);
                }
                for (var i = 0; i < tasks.length; i++) {
                    var task = tasks[i];
                    task.connectionID = replaceIDs[task.connectionID];
                    if(task.jump_false_task_id && task.jump_false_task_id != null && task.jump_false_task_id.toString() != "null" && task.jump_false_task_id.toString() != "undefined")
                        task.jump_false_task_id = replaceIDs[task.jump_false_task_id];
                    if(task.jump_task_id && task.jump_task_id != null && task.jump_task_id.toString() != "null" && task.jump_task_id.toString() != "undefined")
                        task.jump_task_id = replaceIDs[task.jump_task_id];
                    task.copiedTask = true;
                    var connections = task.connections && task.connections.connections_subitem ? task.connections.connections_subitem : [];
                    for (var j = 0; j < connections.length; j++) {
                        if(connections[j].connectionID && connections[j].connectionID != null && connections[j].connectionID.toString() != "null" && connections[j].connectionID.toString() != "undefined")
                            connections[j].connectionID = replaceIDs[connections[j].connectionID];
                    }
                }
                taskDesigner.data.items = taskDesigner.data.items.concat(tasks);
                taskDesigner.renderTasks(true);
                taskDesigner.renderConnections(true);
                taskDesigner.renderLinks();
                taskDesigner.undopasteButton.show();
            }
        });
    },
    copyTasks : function(tasks){
        taskDesigner.copiedTasks = {tasks:tasks, job:taskDesigner.loadedSchedule.scheduleName};
        taskDesigner.showPasteTasksButton();
    },
    removeTasks: function(tasks){
        if(tasks && tasks.length){
            jConfirm("Are you sure you wish to remove selected "+tasks.length+" task(s)?", "Confirm", function(flag){
                if(flag)
                {
                    for (var i = 0; i < tasks.length; i++) {
                        var task = tasks[i];
                        var elm = $("#task_" + task.connectionID, taskDesigner.panel);
                        elm.find(".closeBtn").addClass("no-confirm").trigger("click");
                    };
                    setTimeout(function(){
                        taskDesigner.showCopyTasksButton();
                    }, 500);
                }
            });
        }
    },
    showPasteTasksButton : function(){
        var selectedTasks = taskDesigner.copiedTasks ? taskDesigner.copiedTasks.tasks : [];
        if(taskDesigner.loadedSchedule && selectedTasks.length>0)
        {
            taskDesigner.pasteTasksButton.show().find(".total").text(selectedTasks.length);
        }
        else
        {
            taskDesigner.pasteTasksButton.hide().find(".total").empty();
        }
    },
    showCopyTasksButton : function(){
        var selectedTasks = taskDesigner.canvas.find(".highlighted:not(.crushStartActionItem, .crushEndActionItem)");
        if(taskDesigner.loadedSchedule && selectedTasks.length>0)
        {
            taskDesigner.copyTasksButton.show().find(".total").text(selectedTasks.length);
            taskDesigner.removeTasksButton.show().find(".total").text(selectedTasks.length);
        }
        else
        {
            taskDesigner.copyTasksButton.hide().find(".total").empty();
            taskDesigner.removeTasksButton.hide().find(".total").empty();
            taskDesigner.undopasteButton.hide();
        }
    },
    saveBatchInfo : function(btn, selectedOnly){
        var jobs = taskDesigner.getListOfJobs(selectedOnly);
        if(jobs.length>0)
        {
            var total = jobs.length;
            var rel = btn.attr("rel");
            var elem = taskDesigner.jobDetailsDialog.find("#"+rel);
            var xmlString = adminPanel.data.buildXMLToSubmitForm(elem.parent(), false, "_id");
            if(rel==="scheduleType"){
                var weekDays = "";
                $(".weekdays", taskDesigner.jobDetailsDialog).find(".ui-state-active").each(function(){
                    weekDays += "("+$(this).attr("_day")+")";
                });
                xmlString += "\n<weekDays>"+weekDays+"</weekDays>";
                var nextRunDate = taskDesigner.jobDetailsDialog.find("#nextRun").datetimepicker("getDate");
                var nextRun = nextRunDate ? nextRunDate.getTime() : '-1';
                var monthDays = "";
                $(".monthdays", taskDesigner.jobDetailsDialog).find(".ui-state-active").each(function(){
                    monthDays += "("+$(this).attr("_day")+")";
                });
                xmlString += "\n<monthDays>"+monthDays+"</monthDays>";
                xmlString += "\n<nextRun>-1</nextRun>";
                var selected = taskDesigner.jobDetailsDialog.find("input[name='scheduleType']:checked");
                var scheduleType = false;
                if(selected && selected.length>0)
                {
                    scheduleType = selected.attr("_id");
                }
                xmlString += "\n<scheduleType>"+scheduleType+"</scheduleType>";
            }
            var xmlData = '<server_prefs type="properties">'+xmlString+'</server_prefs>';
            var obj = {
                command: "addToJobs",
                job_list: jobs.join(";"),
                job_fragment: xmlData
            };
            crushFTP.UI.showLoadingIndicator({});
            crushFTP.data.serverRequest(obj,
                function(msg){
                    var data = $.xml2json(msg, true);
                    crushFTP.UI.hideLoadingIndicator({});
                    if(data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && (crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK" || crushFTP.data.getTextValueFromXMLNode(data.response_status).indexOf("SUCCESS")>=0))
                    {
                        crushFTP.UI.growl("Jobs updated", "", false, 5000);
                    }
                    else
                    {
                        crushFTP.UI.growl("Error while updating jobs", "Error: " + crushFTP.methods.htmlEncode($(msg).find("response_status").text()), true, 3000);
                    }
                }
            , false, "POST");
        }
    },
    updateJobsStatus : function(jobID, scheduleName, status)
    {
        if(!jobID){
            if(taskDesigner.activeJobToMonitor){
                jobID = taskDesigner.activeJobToMonitor.split("||")[0];
            }
        }
        var obj = {
            command: "changeJobStatus",
            scheduleName: scheduleName,
            job_id: jobID,
            status: status
        };
        crushFTP.data.serverRequest(obj,
            function(msg){
                var data = $.xml2json(msg, true);
                if(data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && (crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK" || crushFTP.data.getTextValueFromXMLNode(data.response_status).indexOf("SUCCESS")>=0))
                {
                    taskDesigner.activeJobStatus = "waiting..";
                    var _status = crushFTP.data.getTextValueFromXMLNode(data.response_status).replace("SUCCESS:", "");
                    crushFTP.UI.growl("Status updated", "Status for job "+ crushFTP.methods.htmlEncode(scheduleName) + " updated to : " + _status, false, 5000);
                }
                else
                {
                    taskDesigner.activeJobStatus = "waiting..";
                    crushFTP.UI.growl("Error while updating status", "Status not updated. Job : " + crushFTP.methods.htmlEncode(scheduleName) + ", Status : " + crushFTP.methods.htmlEncode(status) + ", Error : " + crushFTP.methods.htmlEncode($(msg).find("response_status").text()), true, 3000);
                }
                taskDesigner.monitorActiveJob();
            }
        , false, "POST");
    },
    renameJob : function(oldName, newName, callback){
        taskDesigner.renameJobData = {
            priorName: oldName,
            name : newName
        }
        if(callback)
            callback(true);
        return;
        /*crushFTP.data.serverRequest({
            command: "renameJob",
            priorName: oldName,
            name : newName
        },
        function(data){
            crushFTP.UI.hideIndicator();
            if(data && typeof data.getElementsByTagName != "undefined")
            {
                var status = $.trim($(data).find("response_status").text().toLowerCase());
                if(status.indexOf("success")>=0)
                {
                    if(callback)
                        callback(true);
                }
                else
                {
                    crushFTP.UI.growl("Error", "Error while renaming schedule : " + oldName, true);
                    if(callback)
                        callback(false);
                }
            }
        });*/
    },
    removeSchedule : function(name, callback)
    {
        if(typeof name == "undefined")return;
        var obj = {
            command: "removeJob",
            name : name
        };
        if(crushFTP.replicationSavePrefs){
            obj.ui_save_preferences_item = crushFTP.replicationSavePrefs;
        }
        crushFTP.data.serverRequest(obj,
        function(data){
            if(data && typeof data.getElementsByTagName != "undefined")
            {
                var status = $.trim($(data).find("response_status").text());
                if(status.toLowerCase().indexOf("success")>=0)
                {
                    taskDesigner.updateJobsLocal("delete",
                        {
                            name: name
                        });
                    if(callback)
                        callback(true);
                }
                else
                {
                    crushFTP.UI.growl("Error", "Error while removing schedule : " + crushFTP.methods.htmlEncode(name), " " + crushFTP.methods.htmlEncode(status), true);
                    if(callback)
                        callback(false);
                }
            }
        });
    },
    getJobDetailsByName : function(name, callback){
        if(!name)return false;
        if(typeof name.path != "undefined")
            name = name.path;
        else if(typeof name.name != "undefined")
            name = name.name;
        crushFTP.data.serverRequest({
            command: "getJob",
            name : ($.trim(name))
        },
        function(data){
            var job_info = false;
            if(data && typeof data.getElementsByTagName != "undefined")
            {
                var status = $.trim($(data).find("response_status").text());
                if(status.toLowerCase() == "ok")
                {
                    if(data.getElementsByTagName("result_value") && data.getElementsByTagName("result_value").length > 0)
                    {
                        data = data.getElementsByTagName("result_value")[0];
                        var job_info = $.xml2json(data);
                        callback(job_info, data);
                    }
                }
                else
                {
                    crushFTP.UI.growl("Error", "Error while loading schedule : " + crushFTP.methods.htmlEncode(name), " " + crushFTP.methods.htmlEncode(status), true);
                    callback(false);
                }
            }
            else
                callback(false);
        }, false, "GET");
    },
    loadJob : function(selected, callback){
        if(!selected || selected.length == 0)
        {
            selected = $("#jobsScheduleList").find("li.ui-state-focus");
        }
        if(selected.length>0)
        {
            taskDesigner.showLoading();
            var jobName = selected.data("controlData");
            taskDesigner.renameJobData=false;
            taskDesigner.getJobDetailsByName(jobName, function(controlData, xml){
                if(!controlData)
                {
                    crushFTP.UI.growl("Job not loaded", "There was a problem in loading selected Job : " + crushFTP.methods.htmlEncode(jobName), true, 3000);
                    setTimeout(function(){
                        taskDesigner.showLoading(true);
                    }, 500);
                    return false;
                }
                delete crushFTP.replicationSavePrefs;
                taskDesigner.processJobData(controlData , xml, callback);
            });
        }
    },
    processJobData : function(controlData, xml, callback){
        taskDesigner.showLoading();
        taskDesigner.data.items = [];
        taskDesigner.canvas.empty().append('<div class="bottomTrigger resizer ui-corner-all" title="Expand height"></div><div class="rightTrigger resizer ui-corner-all" title="Expand width"></div>');
        var existingConnections = jsPlumb.getConnections();
        for (var i = 0; i < existingConnections.length; i++) {
            var connection = existingConnections[i];
            try{
                if(!connection._isDeleted && connection.isDetachable())
                    jsPlumb.detach(connection);
            }catch(ex){}
            connection._isDeleted = true;
        };
        taskDesigner.hasConnections = false;
        if(controlData)
        {
            if(controlData.scheduleName && controlData.scheduleName.indexOf("__")==0)
            {
                $("#editJobTemplate").addClass('ui-state-disabled');
            }
            else
            {
                $("#editJobTemplate").removeClass('ui-state-disabled');
            }
            taskDesigner.clearLoadedTaskData();
            if(typeof controlData.save_state == "undefined")
                controlData.save_state = "true";
            if(typeof controlData.save_history == "undefined")
                controlData.save_history = "true";
            if(typeof controlData.single == "undefined")
                controlData.single = "false";
            if(typeof controlData.singleServer == "undefined")
                controlData.singleServer = "false";
            if(typeof controlData.job_log_name == "undefined")
                controlData.job_log_name = taskDesigner.logFileLocation || "{scheduleName}_{id}.log";
            if(typeof controlData.log_enabled == "undefined"){
                controlData.log_enabled = "true";
            }
            if(controlData.tasks)
            {
                function getRandomInt (min, max) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }
                var tasks = controlData.tasks;
                crushFTP.methods.rebuildSubItems(tasks, "tasks");
                if(controlData.connections)
                    crushFTP.methods.rebuildSubItems(controlData.connections, "connections");
                if(controlData.position)
                    crushFTP.methods.rebuildSubItems(controlData.position, "position");
                if(tasks && tasks.tasks_subitem)
                    tasks = tasks.tasks_subitem;
                else
                    tasks = [];
                var maxH = $(taskDesigner.canvas).height();
                var maxW = $(taskDesigner.canvas).width();
                for(var i=0;i<tasks.length;i++)
                {
                    var curTask = tasks[i];
                    if(curTask.type && curTask.type != "properties")
                    {
                        var uid = crushFTP.methods.generateRandomPassword(8);
                        curTask.name = curTask.name || curTask.type;
                        var taskObj = {
                            connectionID : curTask.id || uid,
                            position : curTask.position,
                            name : curTask.name,
                            connections : curTask.connections
                        };
                        if(taskObj.connections && taskObj.connections.connections_subitem)
                            crushFTP.methods.rebuildSubItems(taskObj.connections, "connections");
                        taskObj = $.extend(taskObj, curTask);
                        taskObj = taskDesigner.applyDefaults(taskObj);
                        taskDesigner.data.items.push(taskObj);
                        if(taskObj.connections && taskObj.connections.connections_subitem && taskObj.connections.connections_subitem.length>0)
                            taskDesigner.hasConnections = true;
                    }
                }
            }
            taskDesigner.data.startPointPosition = controlData.startPointPosition;
            taskDesigner.data.endPointPosition = controlData.endPointPosition;
            taskDesigner.data.startPointZIndex = controlData.startPointZIndex;
            taskDesigner.data.endPointZIndex = controlData.endPointZIndex;
            if(controlData.canvasSize)
                taskDesigner.data.canvasSize = controlData.canvasSize;
            taskDesigner.data.startConnections = [];
            taskDesigner.data.startConnectionsToDebug = [];
            if(controlData.connections && controlData.connections.connections_subitem)
            {
                var connections = controlData.connections.connections_subitem;
                for(var i=0;i<connections.length;i++)
                {
                    if(connections[i].type != "dummy")
                    {
                        taskDesigner.data.startConnections.push(connections[i].connectionID);
                    }
                }
            }
            if(controlData.canvasSize)
            {
                var canvasSize = controlData.canvasSize.split(",");
                taskDesigner.canvas.width(canvasSize[0] + "px");
                if(parseInt(canvasSize[1])>2000)
                    canvasSize[1] = 2000;
                taskDesigner.canvas.height(canvasSize[1] + "px");
            }
            else
            {
                taskDesigner.resizeCanvas();
            }
            if(!controlData.id)
                controlData.id = crushFTP.methods.generateRandomPassword(8);
            $("#editingJobName, #editingJobName2").text(decodeURIComponent(unescape(controlData.scheduleName)));

            if(!controlData.plugin || (controlData.plugin && (controlData.plugin == "" || controlData.plugin == "CrushTask (User Defined)")))
            {
                $("#placeHolder").show();
                $("#newTaskDragButton").parent().show();
                $("#pluginSelector").hide();
                $(".job_enabled_flag").removeAttr("disabled").parent().next().removeClass("ui-state-disabled");
                $("#jobEnabledByPluginMsg").hide();
            }
            else
            {
                $("#placeHolder").hide();
                $("#newTaskDragButton").parent().hide();
                taskDesigner.data.bindValuesFromJson($("#pluginSelector").show(), controlData);
                setTimeout(function(){
                    taskDesigner.showLoading(true);
                }, 500);
                $(".job_enabled_flag").attr("disabled", "disabled").parent().next().addClass("ui-state-disabled");
                $("#jobEnabledByPluginMsg").show();
            }
        }
        if(controlData && typeof controlData.max_runtime_hours == "undefined"){
            controlData.max_runtime_hours = "00";
            $(xml).append('<max_runtime_hours>00</max_runtime_hours>');
        }
        if(typeof controlData.max_runtime_minutes == "undefined"){
            controlData.max_runtime_minutes = "00";
            $(xml).append('<max_runtime_minutes>00</max_runtime_minutes>');
        }
        taskDesigner.loadedSchedule = controlData;
        taskDesigner.loadedScheduleXML = xml;
        taskDesigner.renderTasks();
        taskDesigner.renderConnections();
        taskDesigner.renderLinks();
        taskDesigner.hasPendingChanges(false);
        try{
            $("#jobsScheduleList").find("li[_id='"+escape(taskDesigner.loadedSchedule.scheduleName)+"']").addClass("loadedSchedule ui-state-focus");
            crushFTP.UI.checkUnchekInput($("#jobsScheduleList").find("input"), false);
            crushFTP.UI.checkUnchekInput($("#jobsScheduleList").find(".loadedSchedule").find("input"), true);
            $("#activejobTabs").tabs({active: 0});
        }catch(ex){}
        taskDesigner.showCopyTasksButton();
        taskDesigner.showPasteTasksButton();
        if(callback)
            callback();
        setTimeout(function(){
            taskDesigner.showLoading(true);
        }, 500);
        setTimeout(function(){
            if(taskDesigner.kioskData && taskDesigner.kioskData.resizeFrame)
            {
                taskDesigner.kioskData.resizeFrame(taskDesigner.canvas.width(), taskDesigner.canvas.height()+20);
            }
        }, 500);
    },
    applyDefaults : function(obj){
        if(obj && obj.type)
        {
            var type = obj.type;
            var data = crushTask.defaultValues[type.toString().toLowerCase() + "Action"];
            data = $.extend(true, {}, data);
            for(var item in data)
            {
                if(typeof obj[item] == "undefined")
                {
                    obj[item] = data[item];
                }
            }
        }
        return obj;
    },
    renderTasks : function(onlyCopied){
        var items = taskDesigner.data.items;
        var lastPos = false;
        var firstOffset = {};
        var lastTaskItem = false;
        var firstTaskItem = false;
        var hasStartEndItems = false;
        var canvasHeight = taskDesigner.canvas.height();
        var canvasWidth = taskDesigner.canvas.width();
        var curMaxHeight = canvasHeight;
        var curMaxWidth = canvasWidth;
        var startTask = false;
        if(onlyCopied)
            taskDesigner.canvas.find(".highlighted").removeClass('highlighted');
        for (var i = 0; i < items.length; i++) {
            var curItem = items[i];
            if(onlyCopied && !curItem.copiedTask)
                continue;
            var taskItem = taskDesigner.taskTemplate.clone();
            if(curItem.type == "BreakPoint")
            {
                taskItem = taskDesigner.breakpointTemplate.clone();
            }
            if(curItem.copiedTask){
                taskItem.addClass('highlighted');
            }
            taskItem.find(".taskHeaderLabel").text(" "+ curItem.type);
            taskItem.find(".taskName").text(curItem.name);
            taskItem.removeClass('default-failure');
            if($.trim(curItem.name).toLowerCase() === "default failure"){
                taskItem.addClass('default-failure');
            }
            taskDesigner.canvas.append(taskItem);
            taskItem.addClass("nonProcessed");
            if(curItem.type == "Jump")
            {
                taskItem.find(".failurePanel").remove();
                taskItem.find(".trueJumpPanel,.falseJumpPanel").show();
            }
            else if(curItem.type == "UsersList")
            {
                taskItem.find(".trueJumpPanel").show();
                taskItem.find(".falseJumpPanel").remove();
            }
            else
            {
                taskItem.find(".trueJumpPanel,.falseJumpPanel").remove();
            }
            if(curItem.type == "Link")
            {
                taskItem.addClass('linktask').find(".crushTask-content").addClass("link-content").append("<div class='pluginPlaceHolder'></div>");
            }
            taskItem.find(".taskAction").each(function(){
                var uid = crushFTP.methods.generateRandomPassword(8);
                $(this).attr("uid", uid);
                $(this).attr("id", "taskAction_" + uid);
            });
            var _uid = curItem.connectionID;
            taskItem.attr("uid", _uid);
            taskItem.attr("id", "task_" + _uid);
            taskItem.effect("highlight", 1000);
            vtip(taskItem);
            taskDesigner.previewSnippet(taskItem);
            var op = {};
            var curPos = curItem.position;
            if(curPos)
            {
                var pos = curPos.split(",");
                op = {
                    top : parseInt(pos[0]),
                    left : parseInt(pos[1])
                };
                if(!lastPos)
                {
                    lastPos = {
                        left : parseInt(op.left),
                        top : parseInt(op.top)
                    };
                    firstOffset = {
                        left : parseInt(op.left),
                        top : parseInt(op.top)
                    };
                    firstTaskItem = taskItem;
                }
            }
            else
            {
                if(!lastPos)
                {
                    op.left = 180;
                    op.top = 10;
                    lastPos = {
                        left : parseInt(op.left),
                        top : parseInt(op.top)
                    };
                    firstOffset = {
                        left : parseInt(op.left),
                        top : parseInt(op.top)
                    };
                    firstTaskItem = taskItem;
                }
                else
                {
                    op.top = parseInt(lastPos.top) + 5;
                    op.left = parseInt(lastPos.left) + 20;
                    op.left += parseInt(lastTaskItem.width());
                    lastPos = {
                        left : parseInt(op.left),
                        top : parseInt(op.top)
                    };
                }
            }
            taskItem.css("left", op.left + "px");
            taskItem.css("top", op.top + "px");
            if(!taskDesigner.kioskData && taskItem.offset().left + taskItem.width() > canvasWidth + taskDesigner.canvas.scrollLeft())
            {
                if(firstOffset.left == 180)
                    firstOffset.left = 30;
                op.left = firstOffset.left;
                op.top += parseInt(firstTaskItem.height());
                lastPos = {
                    left : parseInt(op.left),
                    top : parseInt(op.top)
                };
                firstOffset = {
                    left : parseInt(op.left),
                    top : parseInt(op.top)
                };
                firstTaskItem = taskItem;
                taskItem.css("left", op.left);
                taskItem.css("top", op.top);
            }
            if(curItem.zIndex)
                taskItem.css("zIndex", curItem.zIndex);
            else
                taskItem.css("zIndex", i + 1);

            var topMax = parseInt(op.top) + taskItem.height() + 10;
            if(topMax > curMaxHeight)
                curMaxHeight = topMax;

            var leftMax = parseInt(op.left) + taskItem.width() + 10;
            if(leftMax > curMaxWidth)
                curMaxWidth = leftMax;

            if(!taskDesigner.hasConnections && !onlyCopied)
            {
                if(lastTaskItem && lastTaskItem.find(".taskAction").length>0)
                {
                    (function(a,b,c){
                        setTimeout(function(){
                            taskDesigner.drawLine(a,b,c);
                        }, 10);
                    })(lastTaskItem.find(".taskSuccessActionPoint"), taskItem, "success");
                }
                else
                {
                    startTask = taskItem;
                }
            }
            curItem.position = op.top +"," + op.left;
            lastTaskItem = taskItem;
        };
        if(onlyCopied)
        {
            taskDesigner.showCopyTasksButton();
            taskDesigner.bindItemEvents();
            return false;
        }
        if(curMaxHeight>canvasHeight)
        {
            canvasHeight = curMaxHeight + 50;
            if(canvasHeight>3000)
                canvasHeight = 3000;
            taskDesigner.canvas.height(canvasHeight);
        }
        if(curMaxWidth>canvasWidth)
        {
            canvasWidth = curMaxWidth + 50;
            if(canvasWidth>3000)
                canvasWidth = 3000;
            taskDesigner.canvas.width(canvasWidth);
        }

        var op = {};
        op.top = 50;
        op.left = 10;
        if(taskDesigner.data.startPointPosition)
        {
            var pos = taskDesigner.data.startPointPosition.split(",");
            op = {
                top : parseInt(pos[0]),
                left : parseInt(pos[1])
            };
        }
        else
        {
            taskDesigner.data.startPointPosition =  op.top +"," + op.left;
        }
        taskDesigner.addItemToCanvas($("<div class='start'>"), op);

        op.top = $(taskDesigner.canvas).height();
        op.left = ($(taskDesigner.canvas).width());
        if(taskDesigner.data.endPointPosition)
        {
            var pos = taskDesigner.data.endPointPosition.split(",");
            op = {
                top : parseInt(pos[0]),
                left : parseInt(pos[1])
            };
        }
        else
        {
            taskDesigner.data.endPointPosition =  op.top +"," + op.left;
        }
        taskDesigner.addItemToCanvas($("<div class='end'>"), op);

        if(!taskDesigner.hasConnections)
        {
            if(startTask)
            {
                setTimeout(function(){
                    taskDesigner.drawLine(taskDesigner.canvas.find("#StartPointPanel").find(".taskSuccessActionPoint"), startTask, "start");
                    if(taskDesigner.kioskData)
                    {
                        if(taskDesigner.kioskData && taskDesigner.kioskData.dataChangeCallback)
                        {
                            taskDesigner.kioskData.dataChangeCallback(true);
                        }
                    }
                }, 100);
            }
            if(lastTaskItem && lastTaskItem.find(".taskAction").length>0)
            {
                setTimeout(function(){
                    taskDesigner.drawLine(lastTaskItem.find(".taskSuccessActionPoint"), taskDesigner.canvas.find("#EndPoint"), "success");
                  if(taskDesigner.kioskData)
                    {
                        if(taskDesigner.kioskData && taskDesigner.kioskData.dataChangeCallback)
                        {
                            taskDesigner.kioskData.dataChangeCallback(true);
                        }
                    }
                }, 100);
            }
        }
        taskDesigner.bindItemEvents();
    },
    renderConnections : function(onlyCopied)
    {
        var startConnections = taskDesigner.data.startConnections;
        var startConnectionsToDebug =  taskDesigner.data.startConnectionsToDebug;
        var StartPoint = taskDesigner.canvas.find("#StartPoint");
        if(startConnections && startConnections.length>0)
        {
            for (var i = 0; i < startConnections.length; i++) {
                taskDesigner.drawLine(StartPoint, taskDesigner.canvas.find("#task_" + startConnections[i]), "start", true, startConnectionsToDebug.has(startConnections[i]));
            };
        }
        if(taskDesigner.data.items && taskDesigner.data.items.length>0)
        {
            for (var i = 0; i < taskDesigner.data.items.length; i++) {
                var item = taskDesigner.data.items[i];
                var _draw = true;
                if(onlyCopied && !item.copiedTask)
                    _draw = false;
                if(item.copiedTask){
                    delete item.copiedTask;
                    //console.log(item.connectionID, item.connections.connections_subitem);
                    //_draw = false;
                }
                if(_draw)
                {
                    if(item.type == "Jump")
                    {
                        var target = item.jump_task_id;
                        var source = item.connectionID;
                        var pnlId = target == "EndPoint" ? "#" + target : "#task_" + target;
                        var relTask = taskDesigner.canvas.find("#task_" + item.connectionID);
                        if(relTask && relTask.length>0 && target && target.length>0)
                        {
                            var taskSuccess = relTask.find(".taskJumpTrueActionPoint");
                            taskDesigner.drawLine(taskSuccess, taskDesigner.canvas.find(pnlId), "true");
                        }

                        var _target = item.jump_false_task_id;
                        var _pnlId = _target == "EndPoint" ? "#" + _target : "#task_" + _target;
                        if(relTask && relTask.length>0 && _target && _target.length>0)
                        {
                            var _taskSuccess = relTask.find(".taskJumpFalseActionPoint");
                            taskDesigner.drawLine(_taskSuccess, taskDesigner.canvas.find(_pnlId), "jumpfail");
                        }
                    }
                    else if(item.type == "UsersList")
                    {
                        var target = item.taskToCall;
                        var source = item.connectionID;
                        var pnlId = target == "EndPoint" ? "#"+target : "#task_" + target;
                        var relTask = taskDesigner.canvas.find("#task_" + item.connectionID);
                        if(relTask && relTask.length>0 && target && target.length>0)
                        {
                            var taskSuccess = relTask.find(".taskJumpTrueActionPoint");
                            taskDesigner.drawLine(taskSuccess, taskDesigner.canvas.find(pnlId), "true");
                        }
                    }
                    if(item.connections && item.connections.connections_subitem && item.connections.connections_subitem.length>0)
                    {
                        connections = item.connections.connections_subitem;
                        var relTask = taskDesigner.canvas.find("#task_" + item.connectionID);
                        if(relTask && relTask.length>0)
                        {
                            var taskFail = relTask.find(".taskFailureActionPoint");
                            var taskSuccess = relTask.find(".taskSuccessActionPoint");
                            if(relTask.hasClass('breakPoint'))
                                taskFail = relTask.find(".taskSuccessActionPoint");
                            for (var j = 0; j < connections.length; j++) {
                                var curConnection = connections[j];
                                var pnlId = "#task_" + curConnection.connectionID;
                                if(curConnection.connectionID == "EndPoint")
                                    pnlId = "#EndPoint";
                                if(curConnection.type == "failure" && item.type != "Jump")
                                    taskDesigner.drawLine(taskFail, taskDesigner.canvas.find(pnlId), curConnection.type, true);
                                else if(curConnection.type == "success")
                                    taskDesigner.drawLine(taskSuccess, taskDesigner.canvas.find(pnlId), curConnection.type, true);
                                else if(item.type == "BreakPoint" && (curConnection.type == "true" || curConnection.type == "jumpfail"))
                                {
                                    taskDesigner.drawLine(taskSuccess, taskDesigner.canvas.find(pnlId), curConnection.type, true);
                                }
                            };
                        }
                    }
                }
            };
        }
    },
    getJobPrefs : function(job, callback){
        taskDesigner.getJobDetailsByName(job, function(controlData){
            callback(controlData);
        });
    },
    getPluginPrefs : function(plugin)
    {
        if(!plugin) return false;
        var plugins;
        if(taskDesigner.kioskData && window.parent)
        {
            //plugins = window.parent.$(window.parent.document).data("GUIXMLPrefs").plugins;
            if(window.parent.panelEvents)
                plugins = window.parent.$(window.parent.document).data("GUIXMLPrefs").plugins;
            else
            {
                var prefs = $(document).data("prefs_processed");
                if(!prefs)
                {
                    var raw = window.parent.$(window.parent.document).data("GUIXMLPrefs_RAW");
                    if(raw)
                    {
                        prefs = $.xml2json(raw);
                    }
                }
                if(prefs)
                {
                    plugins = prefs.plugins;
                }
            }
        }
        else
        {
            plugins = $(document).data("GUIXMLPrefs").plugins;
        }
        var availablePlugins = [];
        if(plugins && plugins.plugins_subitem && plugins.plugins_subitem.length>0)
        {
            plugins = plugins.plugins_subitem;
            if(plugins)
            {
                for(var i=0;i<plugins.length;i++)
                {
                    var curItem = plugins[i];
                    curItem = curItem["plugins_subitem_subitem"];
                    if(curItem && curItem.length && curItem.length >0)
                    {
                        var pluginName = plugin.split(":")[0];
                        var subPlugin = plugin.split(":")[1] || "";
                        for(var l=0;l<curItem.length;l++)
                        {
                            if(curItem && curItem[l] && curItem[l].pluginName)
                            {
                                var name = curItem[l].pluginName;
                                if(pluginName == curItem[l].pluginName && subPlugin == curItem[l].subItem)
                                {
                                    availablePlugins.push(curItem[l]);
                                }
                            }
                        }
                    }
                }
            }
        }
        if(availablePlugins.length>0)
        {
            return availablePlugins[0];
        }
        else
        {
            return false;
        }
    },
    resetLinkPreviewPanel : function(el, zoom){
        zoom = zoom || 0.2;
        var instance = jsPlumb;
        var transformOrigin = [0, 0];
        el = el || instance.Defaults.Container;
        var p = [ "webkit", "moz", "ms", "o" ],
        s = "scale(" + zoom + ")",
        oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";

        for (var i = 0; i < p.length; i++) {
            el.style[p[i] + "Transform"] = s;
            el.style[p[i] + "TransformOrigin"] = oString;
        }
        el.style["transform"] = s;
        el.style["transformOrigin"] = oString;
    },
    renderLinks : function(elem){
        if(!taskDesigner.linkedPopupPlaceholder)
        {
            taskDesigner.linkedPopupPlaceholder = $("#linkedPopupPlaceholder").dialog({
                autoOpen: false,
                width: 1200,
                height : 700,
                title : "Linked Item",
                modal: true,
                resizable: true,
                closeOnEscape: false,
                beforeOpen : function(){
                    $("#linkedPopupPlaceholder").empty();
                },
                open : function(){
                    setTimeout(function(){
                        taskDesigner.repaintLinkedJobConnections(taskDesigner.maximizedLinkedItemID);
                    },100);
                },
                beforeClose : function(){
                    var placeholder = taskDesigner.linkedPopupPlaceholder.find(".pluginPlaceHolder");
                    if(placeholder && placeholder.data("currentParent")){
                        var prnt = placeholder.data("currentParent");
                        prnt.append(placeholder);
                        var curPH = prnt.find(".linkTaskPreview");
                        taskDesigner.resetLinkPreviewPanel(curPH[0]);
                        setTimeout(function(){
                            taskDesigner.maximizedLinkedItemID = false;
                        },100);
                    }
                    $("#linkedPopupPlaceholder").empty();
                }
            });
            //taskDesigner.linkedPopupPlaceholder.isolatedScroll();
        }
        taskDesigner.linkedItemsTasks = {};
        var isElem = elem;
        elem = elem || $(".pluginPlaceHolder");
        elem.each(function(index, el) {
            var curTask = $(this).closest(".crushTaskItem");
            var taskData = taskDesigner.data.get(curTask.attr("uid"));
            if(taskData && taskData.link)
            {
                var placeholder = curTask.find(".pluginPlaceHolder").show();
                placeholder.parent().find(".overlay-linkeditem").remove();
                placeholder.before("<div class='overlay-linkeditem'></div><div class='popOutButton' style='display: block;'></div>");
                placeholder.empty().append('<div class="linkTaskPreview"></div>');
                var linkTaskPreview = placeholder.find(".linkTaskPreview")
                if(taskData.link.indexOf("plugin:")==0)
                {
                    var pluginToLoad = taskData.link.replace("plugin:", "");
                    var pluginData = taskDesigner.getPluginPrefs(pluginToLoad);
                    var uid = crushFTP.methods.generateRandomPassword(8);
                    placeholder.closest(".crushTaskItem").attr("link_uid", uid);
                    taskDesigner.renderLinkedTasks(pluginData, linkTaskPreview, uid);
                    setTimeout(function() {
                        taskDesigner.resetLinkPreviewPanel(linkTaskPreview[0]);
                        taskDesigner.bindItemEvents();
                        if(taskDesigner.monitoringActiveJob)
                                taskDesigner.monitorActiveJob();
                    },2000);
                    linkTaskPreview.find(".taskAction, .crushTaskItem").addClass('miniature');
                    placeholder.find(".closeBtn, .crushTaskOptionsLink, .ui-icon-pencil").remove();
                }
                else if(taskData.link.indexOf("job:")==0)
                {
                    var jobToLoad = taskData.link.replace("job:", "");
                    var jobData = taskDesigner.getJobPrefs(jobToLoad, function(data){
                        var uid = crushFTP.methods.generateRandomPassword(8);
                        placeholder.closest(".crushTaskItem").attr("link_uid", uid);
                        taskDesigner.renderLinkedTasks(data, linkTaskPreview, uid);
                        setTimeout(function() {
                            taskDesigner.resetLinkPreviewPanel(linkTaskPreview[0]);
                            if(taskDesigner.monitoringActiveJob)
                                taskDesigner.monitorActiveJob();
                        },200);
                        linkTaskPreview.find(".taskAction, .crushTaskItem").addClass('miniature');
                        placeholder.find(".closeBtn, .crushTaskOptionsLink, .ui-icon-pencil").remove();
                    });
                }
                placeholder.parent().find(".popOutButton").click(function(){
                    taskDesigner.maximizedLinkedItemID = $(this).closest('.crushTaskItem').attr("link_uid");
                    placeholder.data("currentParent", placeholder.parent());
                    taskDesigner.linkedPopupPlaceholder.empty().append(placeholder);
                    taskDesigner.linkedPopupPlaceholder.dialog("open");
                    var curPH = taskDesigner.linkedPopupPlaceholder.find(".linkTaskPreview");
                    taskDesigner.resetLinkPreviewPanel(curPH[0], 1);
                });
            }
            else
            {
                $(this).find(".pluginPlaceHolder").hide();
            }
        });
        if(isElem)
        {
            taskDesigner.repaintConnections(elem);
        }
    },
    renderLinkedTasks : function(data, canvas, FPuid){
        canvas.empty();
        crushFTP.methods.rebuildSubItems(data.tasks, "tasks");
        var items = [];
        if(data && data.tasks && data.tasks.tasks_subitem)
            items = data.tasks.tasks_subitem;
        if(FPuid)
        {
            taskDesigner.linkedItemsTasks = taskDesigner.linkedItemsTasks || {};
            taskDesigner.linkedItemsTasks[FPuid] = items;
        }
        var lastPos = false;
        var firstOffset = {};
        var lastTaskItem = false;
        var firstTaskItem = false;
        var hasStartEndItems = false;
        var canvasHeight = 800;
        var canvasWidth = 1200;
        var curMaxHeight = canvasHeight;
        var curMaxWidth = canvasWidth;
        var startTask = false;
        var uniqueID = FPuid || "";
        for (var i = 0; i < items.length; i++) {
            var curItem = items[i];
            var taskItem = taskDesigner.taskTemplate.clone();
            if(curItem.type == "BreakPoint")
            {
                taskItem = taskDesigner.breakpointTemplate.clone();
            }
            taskItem.find(".taskHeaderLabel").html(" "+ curItem.type);
            taskItem.find(".taskName").html(curItem.name);
            taskItem.removeClass('default-failure');
            if($.trim(curItem.name).toLowerCase() === "default failure"){
                taskItem.addClass('default-failure');
            }
            canvas.append(taskItem);
            if(curItem.type == "Jump")
            {
                taskItem.find(".failurePanel").remove();
                taskItem.find(".trueJumpPanel,.falseJumpPanel").show();
            }
            else if(curItem.type == "UsersList")
            {
                taskItem.find(".trueJumpPanel").show();
                taskItem.find(".falseJumpPanel").remove();
            }
            else
            {
                taskItem.find(".trueJumpPanel,.falseJumpPanel").remove();
            }
            if(curItem.type == "Link")
            {
                taskItem.addClass('linktask').find(".crushTask-content").addClass("link-content").append("<div class='pluginPlaceHolder'></div>");
            }
            taskItem.find(".taskAction").each(function(){
                var uid = crushFTP.methods.generateRandomPassword(8);
                $(this).attr("uid", uid);
                $(this).attr("id", "taskAction_" + uniqueID + '_' + uid);
            });
            var _uid = curItem.connectionID;
            taskItem.attr("uid", _uid);
            taskItem.attr("id", "task_" + uniqueID + '_' + _uid);
            taskItem.effect("highlight", 1000);
            vtip(taskItem);
            taskDesigner.previewSnippet(taskItem, curItem);
            taskItem.addClass('nonProcessed').data("controlData", curItem);
            var op = {};
            var curPos = curItem.position;
            if(curPos)
            {
                var pos = curPos.split(",");
                op = {
                    top : parseInt(pos[0]),
                    left : parseInt(pos[1])
                };
                if(!lastPos)
                {
                    lastPos = {
                        left : parseInt(op.left),
                        top : parseInt(op.top)
                    };
                    firstOffset = {
                        left : parseInt(op.left),
                        top : parseInt(op.top)
                    };
                    firstTaskItem = taskItem;
                }
            }
            else
            {
                if(!lastPos)
                {
                    op.left = 180;
                    op.top = 10;
                    lastPos = {
                        left : parseInt(op.left),
                        top : parseInt(op.top)
                    };
                    firstOffset = {
                        left : parseInt(op.left),
                        top : parseInt(op.top)
                    };
                    firstTaskItem = taskItem;
                }
                else
                {
                    op.top = parseInt(lastPos.top) + 5;
                    op.left = parseInt(lastPos.left) + 20;
                    op.left += parseInt(lastTaskItem.width());
                    lastPos = {
                        left : parseInt(op.left),
                        top : parseInt(op.top)
                    };
                }
            }
            taskItem.css("left", op.left + "px");
            taskItem.css("top", op.top + "px");
            if(curItem.zIndex)
                taskItem.css("zIndex", curItem.zIndex);
            else
                taskItem.css("zIndex", i + 1);

            var topMax = parseInt(op.top) + taskItem.height() + 10;
            if(topMax > curMaxHeight)
                curMaxHeight = topMax;

            var leftMax = parseInt(op.left) + taskItem.width() + 10;
            if(leftMax > curMaxWidth)
                curMaxWidth = leftMax;

            if(!taskDesigner.hasConnections)
            {
                if(lastTaskItem && lastTaskItem.find(".taskAction").length>0)
                {
                    (function(a,b,c){
                        setTimeout(function(){
                            taskDesigner.drawLine(a,b,c,true);
                        }, 10);
                    })(lastTaskItem.find(".taskSuccessActionPoint"), taskItem, "success");
                }
                else
                {
                    startTask = taskItem;
                }
            }
            curItem.position = op.top +"," + op.left;
            lastTaskItem = taskItem;
        };

        if(curMaxHeight>canvasHeight)
        {
            canvasHeight = curMaxHeight + 50;
            if(canvasHeight>5000)
                canvasHeight = 3000;
            canvas.height(canvasHeight);
        }
        if(curMaxWidth>canvasWidth)
        {
            canvasWidth = curMaxWidth + 50;
            if(canvasWidth>5000)
                canvasWidth = 3000;
            canvas.width(canvasWidth);
        }
        var op = {};
        op.top = 50;
        op.left = 10;
        if(data.startPointPosition)
        {
            var pos = data.startPointPosition.split(",");
            op = {
                top : parseInt(pos[0]),
                left : parseInt(pos[1])
            };
        }
        else
        {
            data.startPointPosition =  op.top +"," + op.left;
        }
        taskDesigner.addItemToCanvas($("<div class='start'>"), op, function(){}, canvas, true, FPuid);

        op.top = $(canvas).height();
        op.left = ($(canvas).width());
        if(data.endPointPosition)
        {
            var pos = data.endPointPosition.split(",");
            op = {
                top : parseInt(pos[0]),
                left : parseInt(pos[1])
            };
        }
        else
        {
            data.endPointPosition =  op.top +"," + op.left;
        }
        taskDesigner.addItemToCanvas($("<div class='end'>"), op, function(){}, canvas, true, FPuid);

        if(!taskDesigner.hasConnections)
        {
            if(startTask)
            {
                setTimeout(function(){
                    taskDesigner.drawLine(canvas.find(".crushStartActionItem").find(".taskSuccessActionPoint"), startTask, "start", true);
                    if(taskDesigner.kioskData)
                    {
                        if(taskDesigner.kioskData && taskDesigner.kioskData.dataChangeCallback)
                        {
                            taskDesigner.kioskData.dataChangeCallback(true);
                        }
                    }
                }, 100);
            }
            if(lastTaskItem && lastTaskItem.find(".taskAction").length>0)
            {
                setTimeout(function(){
                  taskDesigner.drawLine(lastTaskItem.find(".taskSuccessActionPoint"), canvas.find(".crushEndActionItem"), "success", true);
                  if(taskDesigner.kioskData)
                    {
                        if(taskDesigner.kioskData && taskDesigner.kioskData.dataChangeCallback)
                        {
                            taskDesigner.kioskData.dataChangeCallback(true);
                        }
                    }
                }, 100);
            }
        }
        var startConnections = [];
        crushFTP.methods.rebuildSubItems(data.connections, "connections");
        if(data.connections && data.connections.connections_subitem && data.connections.connections_subitem.length>0)
        {
            for (var i = 0; i < data.connections.connections_subitem.length; i++) {
                var curCon = data.connections.connections_subitem[i].connectionID;
                if(curCon)
                {
                    startConnections.push(curCon);
                }
            }
        }
        if((!startConnections || startConnections.length==0) && items.length>0)
        {
            startConnections.push(items[0].connectionID);
        }
        var arrowCommon = { foldback:0.7, fillStyle:"green", width:18 };
        var overlays = [
            [ "Arrow", { location:0.7 }, arrowCommon ]
        ];
        jsPlumb.Defaults.Container = canvas;
        if(startConnections && startConnections.length>0)
        {
            for (var i = 0; i < startConnections.length; i++) {
                var div1 = canvas.find("#StartPointPanel" + FPuid).find(".taskAction");
                var div2 = canvas.find("#task_" + uniqueID + '_' + startConnections[i]);
                var connection = taskDesigner.drawJsPlumbLine({
                    source:div1,
                    target:div2,
                    container : canvas,
                    anchor:"TopLeft",
                    connector: ["StateMachine", {margin: 1, curviness: 20, proximityLimit:1}],
                    paintStyle:{ lineWidth:4, strokeStyle: "#33b5e5" , dashstyle: undefined},
                    overlays:overlays
                });
            };
        }
        if(items && items.length>0)
        {
            jsPlumb.Defaults.Container = canvas;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                /*if(item.type == "Jump")
                {
                    var target = item.jump_task_id;
                    var source = item.connectionID;
                    var pnlId = target == "EndPoint" ? "#" + target + FPuid  : "#task_" + uniqueID + '_' + target;
                    var relTask = canvas.find("#task_" + uniqueID + '_' + item.connectionID);
                    if(relTask && relTask.length>0 && target && target.length>0)
                    {
                        var taskSuccess = relTask.find(".taskJumpTrueActionPoint");
                        taskDesigner.drawLine(taskSuccess, canvas.find(pnlId), "true", true, "#D88D43", false, false, canvas);
                    }

                    var _target = item.jump_false_task_id;
                    var _pnlId = _target == "EndPoint" ? "#" + _target + FPuid : "#task_" + uniqueID + '_' + _target;
                    if(relTask && relTask.length>0 && _target && _target.length>0)
                    {
                        var _taskSuccess = relTask.find(".taskJumpFalseActionPoint");
                        taskDesigner.drawLine(_taskSuccess, canvas.find(_pnlId), "jumpfail", true, "#996633", false, false, canvas);
                    }
                }
                else */
                if(item.type == "UsersList")
                {
                    var target = item.taskToCall;
                    var source = item.connectionID;
                    var pnlId = target == "EndPoint" ? "#" + target + FPuid : "#task_" + uniqueID + '_' + target;
                    var relTask = canvas.find("#task_" + uniqueID + '_' + item.connectionID);
                    if(relTask && relTask.length>0 && target && target.length>0)
                    {
                        var taskSuccess = relTask.find(".taskJumpTrueActionPoint");
                        taskDesigner.drawLine(taskSuccess, canvas.find(pnlId), "true", true, false, false, false, canvas);
                    }
                }
                crushFTP.methods.rebuildSubItems(item.connections, "connections");
                if(item.connections && item.connections.connections_subitem && item.connections.connections_subitem.length>0)
                {
                    connections = item.connections.connections_subitem;
                    var relTask = canvas.find("#task_" + uniqueID + '_' + item.connectionID);
                    if(relTask && relTask.length>0)
                    {
                        var taskFail = relTask.find(".taskFailureActionPoint");
                        var taskSuccess = relTask.find(".taskSuccessActionPoint");
                        for (var j = 0; j < connections.length; j++) {
                            var curConnection = connections[j];
                            if(curConnection.connectionID && curConnection.connectionID != null && curConnection.connectionID != "null")
                            {
                                var pnlId = "#task_" + uniqueID + '_' + curConnection.connectionID;
                                if(curConnection.connectionID == "EndPoint")
                                    pnlId = "#EndPoint" + FPuid;
                                var div1;
                                var div2 = canvas.find(pnlId);
                                if(curConnection.type == "failure")
                                {
                                    div1 = taskFail;
                                }
                                else if(curConnection.type == "success")
                                {
                                    div1 = taskSuccess;
                                }

                                flag = curConnection.type;

                                var color = flag == "failure" ? "red" : "green";
                                if(flag=="start")
                                    color = "#33b5e5";

                                var connection = taskDesigner.drawJsPlumbLine({
                                    source:div1,
                                    target:div2,
                                    container : canvas,
                                    anchor:"TopLeft",
                                    connector: ["StateMachine", {margin: 1, curviness: 20, proximityLimit:1}],
                                    paintStyle:{ lineWidth:4, strokeStyle: color , dashstyle: undefined},
                                    overlays:overlays
                                });
                            }
                        };
                    }
                }
                if(item.type == "Jump")
                {
                    var taskFail = relTask.find(".taskJumpFalseActionPoint");
                    var taskSuccess = relTask.find(".taskJumpTrueActionPoint");

                    var falseTaskId = item.jump_false_task_id;
                    var pnlId = "#task_" + uniqueID + '_' + falseTaskId;
                    var div2 = canvas.find(pnlId);
                    if(div2.length>0)
                    {
                        color = "#D88D43";
                        var connection = taskDesigner.drawJsPlumbLine({
                            source:taskFail,
                            target:div2,
                            container : canvas,
                            anchor:"TopLeft",
                            connector: ["StateMachine", {margin: 1, curviness: 20, proximityLimit:1}],
                            paintStyle:{ lineWidth:4, strokeStyle: color , dashstyle: undefined},
                            overlays:overlays
                        });
                    }

                    var trueTaskId = item.jump_task;
                    pnlId = "#task_" + uniqueID + '_' + trueTaskId;
                    div2 = canvas.find(pnlId);
                    if(div2.length>0)
                    {
                        color = "#996633";
                        var connection = taskDesigner.drawJsPlumbLine({
                            source:taskSuccess,
                            target:div2,
                            container : canvas,
                            anchor:"TopLeft",
                            connector: ["StateMachine", {margin: 1, curviness: 20, proximityLimit:1}],
                            paintStyle:{ lineWidth:4, strokeStyle: color , dashstyle: undefined},
                            overlays:overlays
                        });
                    }
                }
                else if(item.type == "UsersList")
                {
                    var taskSuccess = relTask.find(".taskJumpTrueActionPoint");
                    var trueTaskId = item.taskToCall;
                    pnlId = "#task_" + uniqueID + '_' + trueTaskId;
                    div2 = canvas.find(pnlId);
                    if(div2.length>0)
                    {
                        color = "#996633";
                        var connection = taskDesigner.drawJsPlumbLine({
                            source:taskSuccess,
                            target:div2,
                            container : canvas,
                            anchor:"TopLeft",
                            connector: ["StateMachine", {margin: 1, curviness: 20, proximityLimit:1}],
                            paintStyle:{ lineWidth:4, strokeStyle: color , dashstyle: undefined},
                            overlays:overlays
                        });
                    }
                }
            };
        }
        setTimeout(function(){
            jsPlumb.Defaults.Container = taskDesigner.canvas;
        });
    },
    addItemToCanvas : function(elem, op, callback, canvas, fake, postfix)
    {
        canvas = canvas || taskDesigner.canvas;
        postfix = postfix || "";
        if(taskDesigner.monitoringActiveJob)
        {
            return false;
        }
        if(elem.hasClass("task"))
        {
            taskDesigner.addTask(function(data){
                if(data != null)
                {
                    var taskItem = taskDesigner.taskTemplate.clone();
                    taskItem.find(".taskHeaderLabel").html(" "+ data.type);
                    taskItem.find(".taskName").html(crushFTP.methods.htmlEncode(data.name));
                    taskItem.removeClass('default-failure');
                    if($.trim(data.name).toLowerCase() === "default failure"){
                        taskItem.addClass('default-failure');
                    }
                    if(data.type == "Jump")
                    {
                        taskItem.find(".failurePanel").remove();
                        taskItem.find(".trueJumpPanel,.falseJumpPanel").show();
                    }
                    else if(data.type == "UsersList")
                    {
                        taskItem.find(".trueJumpPanel").show();
                        taskItem.find(".falseJumpPanel").remove();
                    }
                    else
                    {
                        taskItem.find(".trueJumpPanel,.falseJumpPanel").remove();
                    }
                    if(data.type == "Link")
                    {
                        taskItem.addClass('linktask').find(".crushTask-content").append("<div class='pluginPlaceHolder'></div>");
                    }
                    canvas.append(taskItem);
                    taskItem.css("left", op.left + "px");
                    taskItem.css("top", op.top + "px");
                    if(!fake)
                    {
                       taskItem.addClass("nonProcessed");
                        if(taskItem.offset().left + taskItem.width() > canvas.width() + canvas.scrollLeft())
                            taskItem.css("left", canvas.width() - taskItem.width() - 10);
                        if(taskItem.offset().top + taskItem.height() > canvas.height() + canvas.scrollTop())
                            taskItem.css("top", canvas.height() - taskItem.height() - 60);
                    }
                    taskItem.find(".taskAction").each(function(){
                        var uid = crushFTP.methods.generateRandomPassword(8);
                        $(this).attr("uid", uid);
                        $(this).attr("id", "taskAction_" + uid);
                    });
                    var _uid = crushFTP.methods.generateRandomPassword(8);
                    taskItem.attr("uid", _uid);
                    taskItem.attr("id", "task_" + _uid);
                    if(!fake)
                       taskDesigner.bindItemEvents();
                    taskItem.effect("highlight", 1000);
                    op = taskItem.position();
                    if(!fake)
                       taskDesigner.data.add(_uid, "task", op.top +"," + op.left, data);
                    taskDesigner.previewSnippet(taskItem);
                    taskDesigner.renderLinks(taskItem);
                    setTimeout(function(){
                        taskItem.find(".crushTaskDetailsLink").trigger("click");
                        vtip(taskItem);
                    }, 600);
                    audit.addLog("added new task " + audit.getName(data) + " at position " + data.position);
                    if(callback)
                        callback(_uid);
                }
            });
        }
        else if(elem.hasClass("breakpoint"))
        {
            var data = crushTask.defaultValues["breakpointAction"];
            data = $.extend(true, {}, data);
            if(data != null)
            {
                var taskItem = taskDesigner.breakpointTemplate.clone();
                canvas.append(taskItem);
                taskItem.css("left", op.left + "px");
                taskItem.css("top", op.top + "px");
                if(!fake)
                {
                    taskItem.addClass("nonProcessed");
                    if(taskItem.offset().left + taskItem.width() > canvas.width() + canvas.scrollLeft())
                        taskItem.css("left", canvas.width() - taskItem.width() - 10);
                    if(taskItem.offset().top + taskItem.height() > canvas.height() + canvas.scrollTop())
                        taskItem.css("top", canvas.height() - taskItem.height() - 60);
                }
                taskItem.find(".taskAction").each(function(){
                    var uid = crushFTP.methods.generateRandomPassword(8);
                    $(this).attr("uid", uid);
                    $(this).attr("id", "taskAction_" + uid);
                });
                var _uid = crushFTP.methods.generateRandomPassword(8);
                taskItem.attr("uid", _uid);
                taskItem.attr("id", "task_" + _uid);
                if(!fake)
                    taskDesigner.bindItemEvents();
                taskItem.effect("highlight", 1000);
                op = taskItem.position();
                if(!fake)
                    taskDesigner.data.add(_uid, "task", op.top +"," + op.left, data);
                return _uid;
            }
        }
        else if(elem.hasClass("end"))
        {
            var data = {name : "End"};
            if(data != null)
            {
                var taskEndAction = taskDesigner.endActionTemplate.clone();
                taskEndAction.find(".endHeaderLabel").html("" + crushFTP.methods.htmlEncode(data.name) + "");
                canvas.append(taskEndAction);
                taskEndAction.css("left", op.left + "px");
                taskEndAction.css("top", op.top + "px");
                var uid = "EndPoint" + postfix;
                taskEndAction.attr("uid", uid).attr("id", uid);
                if(!fake)
                {
                    taskEndAction.addClass("nonProcessed");
                    if(taskEndAction.offset().left + taskEndAction.width() > canvas.width() + canvas.scrollLeft())
                        taskEndAction.css("left", canvas.width() - taskEndAction.width() - 8);
                    if(taskEndAction.offset().top + taskEndAction.height() > canvas.height() + canvas.scrollTop())
                        taskEndAction.css("top", canvas.height() - taskEndAction.height() - 8);
                }
                taskEndAction.effect("highlight", 1000);
                if(!fake)
                    taskDesigner.bindItemEvents(true);
                op = taskEndAction.position();
                if(!fake)
                    taskDesigner.data.add(uid, "end", op.top +"," + op.left);
                if(taskDesigner.data.endPointZIndex)
                    taskEndAction.css("zIndex", taskDesigner.data.endPointZIndex);
            }
        }
        else if(elem.hasClass("start"))
        {
            var data = {name : "Start"};
            if(data != null)
            {
                var taskStartAction = taskDesigner.startActionTemplate.clone();
                taskStartAction.find(".startHeaderLabel").html("" + crushFTP.methods.htmlEncode(data.name) + "");
                canvas.append(taskStartAction);
                taskStartAction.css("left", op.left + "px");
                taskStartAction.css("top", op.top + "px");
                taskStartAction.find(".taskAction").each(function(){
                    $(this).attr("uid", "StartPoint" + postfix).attr("id", "StartPoint" + postfix);
                });
                var uid = "StartPointPanel" + postfix;
                taskStartAction.attr("uid", uid).attr("id", uid);
                if(!fake)
                {
                    taskStartAction.addClass("nonProcessed");
                    if(taskStartAction.offset().left + taskStartAction.width() > canvas.width() + canvas.scrollLeft())
                        taskStartAction.css("left", canvas.width() - taskStartAction.width());
                    if(taskStartAction.offset().top + taskStartAction.height() > canvas.height() + canvas.scrollTop())
                        taskStartAction.css("top", canvas.height() - taskStartAction.height() - 5);
                }
                taskStartAction.effect("highlight", 1000);
                if(!fake)
                    taskDesigner.bindItemEvents(true);
                op = taskStartAction.position();
                if(!fake)
                    taskDesigner.data.add(uid, "start", op.top +"," + op.left);
                if(taskDesigner.data.startPointZIndex)
                    taskStartAction.css("zIndex", taskDesigner.data.startPointZIndex);
            }
        }
    },
    addTask : function(callback, actionType, actionName)
    {
        jPrompt("Choose a task type:", actionType, "Tasks", function(value){
            actionType = value;
            if(actionType!=null)
            {
                if(actionType.length == 0)
                {
                    $("#addNewLabel", taskForm).trigger("click");
                    return;
                }
                actionName = actionName || actionType;
                var data = crushTask.defaultValues[actionType.toString().toLowerCase() + "Action"];
                data = $.extend(true, {}, data);
                if(data)
                {
                    data.random_id = "true";
                    data.multithreaded_s3 = "false";
                    data.multithreaded_s3_download = "false";
                    data.s3_stat_head_calls = "true";
                    data.name = actionName;
                    if(data.type == "Glacier" && taskDesigner.loadedSchedule && taskDesigner.loadedSchedule.scheduleName){
                        data.cache_folder = "./jobs/"+taskDesigner.loadedSchedule.scheduleName + "/";
                    }
                    if(callback)
                        callback(data);
                }
            }
        }, ['As2',
                'CMS',
                'Copy',
                'Compress',
                'Decompress',
                'Delete',
                'Email',
                'Execute',
                'Exclude',
                'Find',
                'FileParser',
                'FindCache',
                'Glacier',
                'Java',
                'JMS',
                'Jump',
                'Kafka',
                'Kill',
                'HTTP',
                'Link',
                'MakeDirectory',
                'Move',
                'Pgp',
                'PopImap',
                'MicrosoftMails',
                'Preview',
                'Rename',
                'Sort',
                'SQL',
                'Tunnel',
                'UsersList',
                'UserVariable',
                'Unzip',
                'Wait',
                'WriteFile',
                'Zip',
                'Custom']
        );
    },
    loadTasksFormHTML : function(callback)
    {
        taskDesigner.tasksFormTemplateHolder.loadContent("/WebInterface/Preferences/panels/Plugins/CrushTask/index.html", function(response, status, xhr) {
            if(status != "error")
            {
                var serverTypeOptionsTemplate = $(taskDesigner.tasksFormTemplateHolder.find("#serverTypeOptionsTemplate").html());
                taskDesigner.tasksFormTemplateHolder.find("#serverTypeOptionsTemplate").remove();
                taskDesigner.tasksFormTemplateHolder.find("div.serverTypeOptions").replaceWith(serverTypeOptionsTemplate);
            }
            if(callback)
                callback(status != "error")
        });
    },
    previewSnippet : function(taskElem, data)
    {
        if(!taskElem)return;
        data = data || taskDesigner.data.get(taskElem.attr("uid"));
        if(!data)return;
        var type = data.type.toLowerCase();
        if(type=="move")
            type="copy";
        var panel = $("#"+type+"ActionConfig", taskDesigner.panel);
        if(panel && panel.length>0)
        {
            var processFirst = taskElem.find('.processFirst').hide();
            if(data.process_first && data.process_first == "true")
                processFirst.show();

            var taskDetails = taskElem.find(".taskDetails").empty();
            var taskHeader = taskElem.find(".crushTask-header");
            if(data.task_notes){
                taskHeader.find(".task-notes-icon").attr("title", "<div class='custom-vtip'>" + crushFTP.methods.htmlEncode(data.task_notes).replace(/\n/g, "<br>") + "</div>");
            }
            else{
                taskHeader.find(".task-notes-icon").hide();
            }
            if(type == "exclude")
            {
                var filter = data.sourceFilter;
                taskDetails.append("<div class='taskDetailsItem' style='margin:5px 0px;'><label>Filter: </label><div>"+crushFTP.methods.htmlEncode(filter)+"</div></div><div class='clear'></div>");
            }
            panel.find(".showInSnippet").each(function(){
                var id = $(this).attr("id");
                var lbl = panel.find("label[for='"+id+"']:first").text() || id;
                lbl = $.trim(lbl);
                if(lbl.lastIndexOf(":") != lbl.length-1)
                    lbl = lbl + " : ";
                var value = data[id] || "";
                if($(this).is("select"))
                {
                    if($(this).find('option[value="'+value+'"]').length>0)
                        value = $(this).find('option[value="'+value+'"]').text();
                }
                if($(this).hasClass("maskPasswordOnURL"))
                {
                    var url = value;
                    try{
                        url = URI(value);
                    }catch(ex){
                        url = URI(encodeURI(value));
                    }
                    if(url)
                    {
                        var pass = url.password();
                        if(pass)
                        {
                            var mask = new Array(pass.length+1).join('*');
                            url.password(mask);
                            var _val = url.toString();
                            if(value.length!=unescape(_val).length)
                                _val = _val.substr(0, _val.length-1);
                            value = decodeURIComponent(_val);
                        }
                    }
                }
                if($(this).hasClass('cachemode'))
                {
                    lbl = "Mode : ";
                    value = data["cache_mode"] || "";
                }
                if(type == "uservariable" && id == "varValue"){
                    var varType = data["varName"] || "";
                    if(varType.toLowerCase().indexOf("password")>=0)
                        value = value.replace(/./g, '*');
                }
                taskDetails.append("<div class='taskDetailsItem'><label>"+crushFTP.methods.htmlEncode(lbl)+"</label><div>"+crushFTP.methods.htmlEncode(value)+"</div></div><div class='clear'></div>");
            });
            if(type == "find")
            {
                taskDetails.prepend("<div class='taskDetailsItem' style='float: right;margin-top: -35px;width: 230px;'><label>Source Filter: </label><div>"+crushFTP.methods.htmlEncode(data.sourceFilter)+"</div></div><div class='clear'></div>");
            }
            else{
                taskDetails.prepend("<div class='taskDetailsItem' style='float: right;margin-top: -35px;width: 230px;'><label>Folder Traversal Filter: </label><div>"+crushFTP.methods.htmlEncode(data.sourceFilter)+"</div></div><div class='clear'></div>");
            }
            taskDetails.closest(".crushTask-content").find("span.taskName").text(data.name);
            if($.trim(data.name).toLowerCase() === "default failure"){
                taskDetails.closest(".crushTaskItem").addClass('default-failure');
            }
            else{
                taskDetails.closest(".crushTaskItem").removeClass('default-failure');
            }
            if(type == "uservariable")
            {
                var totalOther = 0;
                for (var item in data) {
                    if(item.toString() != "varName" && item.toString().indexOf("varName")==0)
                    {
                        totalOther++;
                    }
                }
                if(totalOther)
                {
                    taskDetails.append('<div style="padding-left:12px;">...and '+totalOther+' more</div>')
                }
            }
        }
    },
    repaintLinkedJobConnections : function(jobID){
        if(!jobID)
            return;
        var cons = jsPlumb.getAllConnections();
        cons = $.extend(true, [], cons.jsPlumb_DefaultScope);
        for (var i = 0; i < cons.length; i++) {
            var curCon = cons[i];
            try{
                if(curCon.targetId.indexOf(jobID)>=0)
                {
                    taskDesigner.repaintConnections($("#"+curCon.targetId));
                    curCon.setHover(true);
                    curCon.setHover(false);
                }
                else if(curCon.sourceId.indexOf(jobID)>=0)
                {
                    taskDesigner.repaintConnections($("#"+curCon.sourceId));
                    curCon.setHover(true);
                    curCon.setHover(false);
                }
            }catch(ex){}
        }
    },
    repaintConnections : function(elem)
    {
        jsPlumb.repaint(elem);
        if(elem.is(".crushTaskItem") || elem.is(".crushStartActionItem") || elem.is(".breakPoint"))
        {
            elem.find(".taskAction").filter(":not(.miniature)").each(function(){
                jsPlumb.repaint($(this));
            });
        }
    },
    moveTasks : function(elem, done)
    {
        var isDraggable = false;
        var otherItems = taskDesigner.canvas.find(".highlighted");
        var origDataX = false;
        if(otherItems.length==0)return;
        if(done)
        {
            if(!elem.hasClass('highlighted'))
                return;
            otherItems.each(function(){
                var curItem = $(this);
                if(curItem.attr("id") == elem.attr("id"))return;
                $(this).removeData("originalPosition");
                var type = "task";
                if(curItem.hasClass("crushStartActionItem"))
                    type = "start";
                else if(curItem.hasClass("crushEndActionItem"))
                    type = "end";
                taskDesigner.data.updatePosition(curItem.attr("id").replace("task_", ""), $(this).position().top +"," + $(this).position().left, type);
            });
            taskDesigner.clearRangeSelection();
            taskDesigner.hasPendingChanges(true);
        }
        else
        {
            if(!elem.helper.hasClass('highlighted'))
                return;
            //fix on draw for zoom by carlos
            var zoom = $("#canvasZoomSlider").slider("value");
            zoom = parseInt(zoom)/100;
            if(origDataX == false) { origDataX = elem.position; }
            var origPos = elem.originalPosition;
            var curPos = taskDesigner.data.originalPos;
            var diff = {
                top : curPos.top - origPos.top,
                left : curPos.left - origPos.left
            };
            otherItems.each(function(){
                var curItem = $(this);
                if(curItem.attr("id") == elem.helper.attr("id"))return;
                if(!$(this).data("originalPosition"))
                {
                    var origData = {
                        top : $(this).position().top,
                        left : $(this).position().left
                    }
                    $(this).data("originalPosition", origData);
                }
                //Math.round( / zoom)
                var oldPos = $(this).data("originalPosition");
                var newTop = oldPos.top + diff.top;
                var newLeft = (oldPos.left + diff.left);
                var maxLeft = taskDesigner.canvas.width() - curItem.width() - 5;
                var maxBottom = taskDesigner.canvas.height() - curItem.height() - 5;
                if(newTop > maxBottom) newTop = maxBottom - 5;
                if(newLeft > maxLeft) newLeft = maxLeft - 5;
                if(newTop <= 5) newTop = 5;
                if(newLeft <= 5) newLeft = 5;
                $(this).css("top", Math.round(newTop / zoom));
                $(this).css("left", Math.round(newLeft / zoom));
                taskDesigner.repaintConnections(curItem);
                taskDesigner.clearRangeSelection();
            });
            taskDesigner.hasPendingChanges(true);
        }
    },
    bindItemEvents : function(isAction){
        setTimeout(function(){
            taskDesigner.bindItemEventsProxy(isAction);
            if(taskDesigner.monitoringActiveJob)
            {
                taskDesigner.canvas.find(".closeBtn, .ui-icon-circle-triangle-s").css("visibility","hidden");
                taskDesigner.canvas.find(".crushTask-header, .taskAction").css("cursor","default");
                $("#jobDetails").hide();
            }
            else
            {
                taskDesigner.canvas.find(".closeBtn, .ui-icon-circle-triangle-s").css("visibility","visible");
                taskDesigner.canvas.find(".crushTask-header, .taskAction").css("cursor","move");
                $("#jobDetails").show();
            }
        }, 500);
    },
    getAgentList : function(){
        var obj = {
            command: "agentList",
            nonAsync : true
        };
        var items = [];
        crushFTP.data.serverRequest(obj, function(data){
            //data = '<agents type="vector"><agents_subitem>local:1474320111557</agents_subitem></agents>';
            $(data).find("agents_subitem").each(function(){
                items.push($(this).text().split(":")[0]);
            });
        });
        return items;
    },
    bindItemEventsProxy : function(isAction)
    {
        var selected = $([]), offset = {top:0, left:0};
        taskDesigner.canvas.find(".nonProcessed").each(function(){
            var that = $(this);
            if(!taskDesigner.monitoringActiveJob)
            {
                if(that.data("eventsAdded")==true)return;
                that.data("eventsAdded", true);
                that.draggable({
                    containment: taskDesigner.canvas,
                    stack : "div.canvasPortlet",
                    opacity: 0.7,
                    handle : ".ui-widget-header",
                    scroll: true,
                    start : function(ev, ui){
                        if(taskDesigner.activeJobToMonitor)
                            return false;
                        selected = $(".canvasPortlet.highlighted", taskDesigner.canvas).each(function() {
                           var el = $(this);
                            el.data("offset", el.offset());
                        });

                        if( !$(this).hasClass("ui-selected")) $(this).addClass("ui-selected");
                        offset = $(this).offset();
                    },
                    drag : function(ev, ui)
                    {
                        if(taskDesigner.activeJobToMonitor)
                            return false;
                        //fix on draw for zoom by carlos
                        var zoom = $("#canvasZoomSlider").slider("value");
                        zoom = parseInt(zoom)/100;
                        taskDesigner.data.originalPos = {
                            top: ui.position.top,
                            left: ui.position.left,
                        };

                        ui.position.top = Math.round(ui.position.top / zoom);
                        ui.position.left = Math.round(ui.position.left / zoom);

                        taskDesigner.moveTasks(ui);
                        taskDesigner.repaintConnections($(this));
                    },
                    stop: function( event, ui )
                    {
                        if(taskDesigner.activeJobToMonitor)
                            return false;
                        taskDesigner.moveTasks(ui.helper, true);
                        taskDesigner.repaintConnections(ui.helper);
                        var type = "task";
                        if(ui.helper.hasClass("crushStartActionItem"))
                            type = "start";
                        else if(ui.helper.hasClass("crushEndActionItem"))
                            type = "end";
                        taskDesigner.data.updatePosition(ui.helper.attr("uid"), ui.position.top +"," + ui.position.left, type);
                        taskDesigner.hasPendingChanges(true);

                        if(ui.helper.hasClass('highlighted'))
                        {
                            setTimeout(function() {
                                taskDesigner.canvas.find(".canvasPortlet.highlighted").removeClass('highlighted').removeClass('ui-state-hover');
                                taskDesigner.canvas.find(".highlighted").removeClass('highlighted').removeClass('ui-state-hover');
                                taskDesigner.showCopyTasksButton();
                            });
                        }
                    }
                });
            }

            if(that.hasClass('breakPoint'))
            {
                if(!taskDesigner.monitoringActiveJob)
                {
                    $(this).removeClass("nonProcessed");
                    $(this).find(".closeBtn").unbind("click").click(function(){
                        var prevTaskId, nextTaskId, type;
                        var uid = that.attr("uid");
                        var connections = jsPlumb.getConnections();
                        for(var i=0;i<connections.length;i++)
                        {
                            var curConnection = connections[i];
                            if(curConnection._targetID == uid || curConnection._sourceID == uid)
                            {
                                if(curConnection._sourceID == uid)
                                    nextTaskId = curConnection._targetID;
                                else if(curConnection._targetID == uid)
                                {
                                    prevTaskId = curConnection._sourceID;
                                    type = curConnection._type;
                                }
                                taskDesigner.data.removeConnection(curConnection._sourceID, curConnection._type, curConnection._targetID);
                                curConnection.setDetachable(true);
                                if(!curConnection._isDeleted && curConnection.isDetachable())
                                    jsPlumb.detach(curConnection);
                                curConnection._isDeleted = true;
                                taskDesigner.hasPendingChanges(true);
                            }
                        }
                        if(prevTaskId && nextTaskId && type)
                        {
                            audit.skipEntry = true;
                            if(type == "true" || type == "jumpfail")
                            {
                                if(type == "true")
                                {
                                    if(nextTaskId == "EndPoint")
                                        taskDesigner.drawLine($("#task_" + prevTaskId).find("span.taskJumpTrueActionPoint"), $("#EndPoint"), type);
                                    else
                                        taskDesigner.drawLine($("#task_" + prevTaskId).find("span.taskJumpTrueActionPoint"), $("#task_" + nextTaskId), type);
                                }
                                else
                                {
                                    if(nextTaskId == "EndPoint")
                                        taskDesigner.drawLine($("#task_" + prevTaskId).find("span.taskJumpFalseActionPoint"), $("#EndPoint"), type);
                                    else
                                        taskDesigner.drawLine($("#task_" + prevTaskId).find("span.taskJumpFalseActionPoint"), $("#task_" + nextTaskId), type);
                                }
                            }
                            else if(type == "success")
                            {
                                if(nextTaskId == "EndPoint")
                                    taskDesigner.drawLine($("#task_" + prevTaskId).find("span.taskSuccessActionPoint"), $("#EndPoint"), type);
                                else
                                    taskDesigner.drawLine($("#task_" + prevTaskId).find("span.taskSuccessActionPoint"), $("#task_" + nextTaskId), type);
                            }
                            else if(type == "failure")
                            {
                                if(nextTaskId == "EndPoint")
                                    taskDesigner.drawLine($("#task_" + prevTaskId).find("span.taskFailureActionPoint"), $("#EndPoint"), type);
                                else
                                    taskDesigner.drawLine($("#task_" + prevTaskId).find("span.taskFailureActionPoint"), $("#task_" + nextTaskId), type);
                            }
                            audit.skipEntry = false;
                            var startItem = prevTaskId !="StartPoint" ? taskDesigner.data.get(prevTaskId) : {name:"StartPoint", type:""};
                            var endItem = nextTaskId != "EndPoint" ? taskDesigner.data.get(nextTaskId) : {name:"EndPoint", type:""};
                            audit.addLog("removed breakpoint between " + audit.getName(startItem) + " and " + audit.getName(endItem));
                        }
                        setTimeout(function(){
                            taskDesigner.data.remove(uid);
                            that.remove();
                        }, 200);
                        return false;
                    });
                }
            }
            else
            {
                if(!taskDesigner.monitoringActiveJob)
                {
                    $(".taskAction", that).filter(":not(.miniature)").draggable({
                        revert: true,
                        opacity: 0.7,
                        helper : "clone",
                        stack: "div.canvasPortlet",
                        appendTo: "body",
                        zIndex : 1000,
                        drag:function(event, ui){
                            if(taskDesigner.activeJobToMonitor)
                                return false;
                            jsPlumb.repaint($(this));
                            // zoom fix
                            var zoom = taskDesigner.scaleFactor || 1;
                            if(zoom != 1)
                            {
                                ui.position.top = Math.round(event.originalEvent.clientY + 5);
                                ui.position.left = Math.round(event.originalEvent.clientX + 5);
                            }
                         },
                         stop: function( event, ui ) {
                            if(taskDesigner.activeJobToMonitor)
                                return false;
                            var type = "task";
                            if(ui.helper.hasClass("crushStartActionItem"))
                                type = "start";
                            else if(ui.helper.hasClass("crushEndActionItem"))
                                type = "end";
                            taskDesigner.data.updatePosition(ui.helper.attr("uid"), ui.position.top +"," + ui.position.left, type);
                            taskDesigner.hasPendingChanges(true);
                        }
                    });

                    $(".taskAction", that).filter(":not(.miniature)").unbind("click").click(function(){
                        if($(this).closest('div.breakPoint').length>0)
                            return false;
                        if(taskDesigner.activeJobToMonitor)
                            return false;
                        if(!$(this).hasClass("isFocused"))
                        {
                            taskDesigner.canvas.find(".isFocused").removeClass("isFocused");
                            taskDesigner.canvas.find(".attachConnection").removeClass("ui-state-focus attachConnection").data("stopAnimation", true);
                            $(this).addClass("isFocused");
                            taskDesigner.highlightJoins($(this));
                        }
                        else
                        {
                            taskDesigner.canvas.find(".isFocused").removeClass("isFocused");
                            taskDesigner.canvas.find(".attachConnection").removeClass("ui-state-focus attachConnection").data("stopAnimation", true);
                        }
                        return false;
                    });

                    $(".editTaskNameLink", that).unbind("click").click(function(){
                        if(taskDesigner.activeJobToMonitor)
                            return false;
                        var $this = $(this);
                        var curName = $this.parent().find(".taskName").text();
                        var uid = $this.closest(".crushTaskItem").attr("uid");
                        jPrompt("Task Name :", curName, "Input", function(value){
                            if(value!=null)
                            {
                                $this.parent().find(".taskName").text(value);
                                taskDesigner.data.changeName(value, uid);
                                taskDesigner.hasPendingChanges(true);
                            }
                        });
                        return false;
                    });

                    $(".crushTaskOptionsLink", that).unbind("click").click(function(evt){
                        evt.stopPropagation();
                        evt.preventDefault();
                        if(taskDesigner.monitoringActiveJob)
                            return false;
                        taskDesigner.showContextMenu($(this).closest(".crushTaskItem"), evt, $("#taskItemContextMenu"));
                        return false;
                    });

                    $(this).removeClass("nonProcessed");
                    $(this).find(".closeBtn").unbind("click").click(function(){
                        if(taskDesigner.activeJobToMonitor)
                            return false;
                        var title = $.trim($(this).parent().find('.taskHeaderLabel').text()) + " (" + $.trim($(this).closest(".crushTaskItem").find('span.taskName:first').text()) + ")";
                        function continueRemoval(){
                            var uid = that.attr("uid");
                            var connections = jsPlumb.getConnections();
                            for(var i=0;i<connections.length;i++)
                            {
                                var curConnection = connections[i];
                                if(curConnection._sourceID == uid || curConnection._targetID == uid)
                                {
                                    var target = $("#task_" + curConnection._targetID);
                                    taskDesigner.data.removeConnection(curConnection._sourceID, curConnection._type, curConnection._targetID);
                                    curConnection.setDetachable(true);
                                    if(!curConnection._isDeleted && curConnection.isDetachable()){
                                        curConnection._isDeleted = true;
                                        jsPlumb.detach(curConnection);
                                    }
                                    taskDesigner.hasPendingChanges(true);
                                    if(target.hasClass('breakPoint'))
                                    {
                                        target.find(".closeBtn").click();
                                    }
                                }
                            }
                            setTimeout(function(){
                                taskDesigner.data.remove(uid);
                                that.remove();
                            }, 200);
                        }
                        if(!$(this).hasClass('no-confirm'))
                        {
                            jConfirm("Are you sure you wish to remove this "+crushFTP.methods.htmlEncode(title)+"?", "Confirm", function(flag){
                                if(flag)
                                {
                                    continueRemoval();
                                }
                            });
                        }
                        else
                        {
                            continueRemoval();
                        }
                        return false;
                    });

                    $(this).find(".crushTask-header").unbind("dblclick").dblclick(function(){
                        $(this).closest(".crushTaskItem").find(".crushTaskDetailsLink").trigger("click");
                        return false;
                    });
                }

                $(this).find(".crushTaskDetailsLink").unbind("click").click(function(){
                    var dataItem = taskDesigner.data.get($(this).closest(".crushTaskItem").attr("uid"));
                    if($(this).closest(".miniature").length>0)
                    {
                        dataItem = $(this).closest(".crushTaskItem").data("controlData");
                        if(dataItem)
                            dataItem.fromMiniature = true;
                    }
                    if(dataItem)
                    {
                        var controlData = dataItem;
                        var type = controlData.type.toLowerCase();
                        var taskForm = type == "move" ? $("#copyActionConfig", taskDesigner.panel).clone().addClass("customForm") : $("#"+type+"ActionConfig", taskDesigner.panel).clone().addClass("customForm");
                        if(type == "move")
                        {
                            taskForm.find(".moveOnly").show();
                            taskForm.find(".copyOnly").hide();
                        }
                        else if(type == "copy")
                        {
                            taskForm.find(".copyOnly").show();
                            taskForm.find(".moveOnly").hide();
                        }
                        var that = $(this);
                        if(taskDesigner.formDialog)
                        {
                            taskDesigner.formDialog.find("#TaskConfig").html(taskForm.show());

                            var useDmzs = taskDesigner.formDialog.find('select[_name="use_dmz"]').empty();
                            if(crushFTP.jobsKioskMode)
                            {
                                $("#mainServerInstance", window.parent.document).find("option").each(function(){
                                    if($(this).text().toLowerCase() != "main")
                                        useDmzs.append("<option value='"+$(this).text()+"'>"+$(this).text()+"</option>");
                                });
                            }
                            else
                            {
                                $("#mainServerInstance").find("option").each(function(){
                                    if($(this).text().toLowerCase() != "main")
                                        useDmzs.append("<option value='"+$(this).text()+"'>"+$(this).text()+"</option>");
                                });
                            }
                            if(useDmzs.attr("rel") == "link_item")
                                useDmzs.prepend("<option value='true'>Any DMZ</option>");
                            else
                                useDmzs.prepend("<option value='true'>Any</option>");
                            useDmzs.prepend("<option value='false' selected>No</option>");
                            if(useDmzs.attr("rel") == "link_item")
                            {
                                useDmzs.append("<option value='All'>All</option>");
                                useDmzs.append("<option value='All DMZ'>All DMZ</option>");
                                useDmzs.append("<option value='All Internal'>All Internal</option>");
                                useDmzs.append("<option value='Opposite Internal'>Opposite Internal</option>");
                                useDmzs.append("<option value='All DMZ Recursive'>All DMZ Recursive</option>");
                                var agents = taskDesigner.getAgentList();
                                if(agents && agents.length>0){
                                    var agentList = $("<optgroup label='Agent'></optgroup>")
                                    for (var i = 0; i < agents.length; i++) {
                                        agentList.append("<option value='agent:"+agents[i]+"'>"+agents[i]+"</option>");
                                    }
                                    useDmzs.append(agentList);
                                }
                            }
                            else
                                useDmzs.append("<option value='false' _rel='custom'>Custom</option>");

                            taskDesigner.openFormCrushTask = that;
                            if(typeof controlData.proxyActivePorts == "undefined")
                                controlData.proxyActivePorts = "1025-65535";
                            if(controlData.type == "Find" || controlData.type == "Move" || controlData.type == "Copy")
                            {
                                var tasks = taskDesigner.data.items;
                                var findCacheOptions = $("<select recName='cache_name' id='cache_name'></select>");
                                for(var i=0;i<tasks.length;i++)
                                {
                                    if(tasks[i] && tasks[i].type == "FindCache" && findCacheOptions.find("option[value='"+tasks[i].cache_name+"']").length==0)
                                        findCacheOptions.append("<option refUid='"+tasks[i].cache_name+"' value='"+tasks[i].cache_name+"'>"+tasks[i].cache_name+"</option>");
                                }
                                findCacheOptions.prepend("<option value=''></option>");
                                var opt = $('<p><label for="cache_name" class="CrushTask">Find Cache Name: </label></p>');
                                opt.append(findCacheOptions);
                                opt.append('<span class="spacer"></span><input type="checkbox" id="add_cache" name="add_cache" /><label for="add_cache" class="CrushTask">Add To Cache</label>');
                                taskForm.prepend(opt);
                                taskForm.find("#changing").bind("change", function(){
                                    if($(this).is(":checked"))
                                        taskForm.find(".check-interval").show().find("#delay_check_interval").focus();
                                    else
                                        taskForm.find(".check-interval").hide();
                                }).trigger('change');
                                if(controlData.type == "Move" || controlData.type == "Copy")
                                {
                                    var findCacheOptionsWrite = $("<select recName='find_cache_write' id='find_cache_write'></select>");
                                    for(var i=0;i<tasks.length;i++)
                                    {
                                        if(tasks[i] && tasks[i].type == "FindCache" && findCacheOptionsWrite.find("option[value='"+tasks[i].connectionID+"']").length==0 && tasks[i].cache_mode == "write")
                                        {
                                            findCacheOptionsWrite.append("<option refUid='"+tasks[i].cache_name+"' value='"+tasks[i].connectionID+"'>"+tasks[i].name+"</option>");
                                        }
                                    }
                                    findCacheOptionsWrite.prepend("<option value=''></option>");
                                    opt.append('<div style="height:10px;"></div><label for="find_cache_write" class="CrushTask">FindCache Write Task: </label>');
                                    opt.append(findCacheOptionsWrite);
                                    taskForm.find(".convertToCopy,.convertToMove").unbind().click(function(){
                                        if($(this).is(".convertToMove"))
                                        {
                                            taskDesigner.openFormControlData.type = "Move";
                                            taskDesigner.openFormControlData.name = taskDesigner.openFormControlData.name.replace("Copy", "Move").replace("copy", "move");
                                            taskForm.find("#name").val(taskDesigner.openFormControlData.name);
                                            taskForm.find(".moveOnly").show();
                                            taskForm.find(".copyOnly").hide();
                                        }
                                        else
                                        {
                                            taskDesigner.openFormControlData.type = "Copy";
                                            taskDesigner.openFormControlData.name = taskDesigner.openFormControlData.name.replace("Move", "Copy").replace("move", "copy");
                                            taskForm.find("#name").val(taskDesigner.openFormControlData.name);
                                            taskForm.find(".moveOnly").hide();
                                            taskForm.find(".copyOnly").show();
                                        }
                                        taskDesigner.formDialog.dialog({title:"Task : " + taskDesigner.openFormControlData.type});
                                        return false;
                                    });
                                }
                                taskForm.find('.cacheNamePanel').remove();
                            }
                            else if(controlData.type == "Jump")
                            {
                                var tasks = taskDesigner.data.items;
                                var jumpTasksOptions = $("<select style='width:120px;' class='ignoreBind' name='jump_task_id' recName='jump_task_id' id='jump_task_id'></select>");
                                for(var i=0;i<tasks.length;i++)
                                {
                                    if(tasks[i].type!="BreakPoint" && controlData.connectionID != tasks[i].connectionID)
                                        jumpTasksOptions.append("<option value='"+tasks[i].connectionID+"'>"+tasks[i].name+"</option>");
                                }
                                jumpTasksOptions.prepend("<option value=''></option>");
                                jumpTasksOptions.append("<option value='EndPoint'>End Point</option>");
                                taskForm.find("#jump_task").replaceWith(jumpTasksOptions);

                                var jumpTasksOptionsFail = $("<select style='width:120px;' class='ignoreBind' name='jump_false_task_id' recName='jump_false_task_id' id='jump_false_task_id'></select>");
                                for(var i=0;i<tasks.length;i++)
                                {
                                    if(tasks[i].type!="BreakPoint" && controlData.connectionID != tasks[i].connectionID)
                                        jumpTasksOptionsFail.append("<option value='"+tasks[i].connectionID+"'>"+tasks[i].name+"</option>");
                                }
                                jumpTasksOptionsFail.prepend("<option value=''></option>");
                                jumpTasksOptionsFail.append("<option value='EndPoint'>End Point</option>");
                                taskForm.find("#jump_task_fail").replaceWith(jumpTasksOptionsFail);

                                var scheduleList = $("#jobsScheduleList");
                                var jumpJobsOptions = $("<select recName='jump_job' id='jump_job'></select>");
                                scheduleList.find("li").each(function(){
                                    jumpJobsOptions.append("<option value='"+$(this).attr("_name")+"'>"+$(this).attr("_name")+"</option>");
                                });
                                jumpJobsOptions.prepend("<option value=''></option>");
                                taskForm.find("#jump_job").replaceWith(jumpJobsOptions);
                            }
                            else if(controlData.type == "UsersList")
                            {
                                var tasks = taskDesigner.data.items;
                                var jumpTasksOptions = $("<select class='ignoreBind' name='taskToCall' recName='taskToCall' id='taskToCall'></select>");
                                for(var i=0;i<tasks.length;i++)
                                {
                                    if(tasks[i].type!="BreakPoint" && controlData.connectionID != tasks[i].connectionID)
                                        jumpTasksOptions.append("<option value='"+tasks[i].connectionID+"'>"+tasks[i].name+"</option>");
                                }
                                jumpTasksOptions.prepend("<option value=''></option>");
                                jumpTasksOptions.append("<option value='EndPoint'>End Point</option>");
                                taskForm.find("#taskToCall").replaceWith(jumpTasksOptions);
                            }
                            else if(controlData.type == "UserVariable")
                            {
                                var existingData = [];
                                if (controlData)
                                {
                                    existingData.push({
                                        name : controlData["varName"],
                                        value : controlData["varValue"],
                                        index : 0
                                    });
                                    for (var item in controlData) {
                                        if(item.toString() != "varName" && item.toString().indexOf("varName")==0)
                                        {
                                            var index = parseInt(item.replace("varName", ""));
                                            existingData.push({
                                                name : controlData[item],
                                                value : controlData["varValue"+index],
                                                index : index
                                            });
                                        }
                                    }
                                }
                                existingData = existingData.sort(function(a, b){
                                  return a.index == b.index ? 0 : +(a.index > b.index) || -1;
                                });
                                taskForm.find(".user-variables").EnableMultiField({
                                    confirmOnRemove: true,
                                    data: existingData,
                                    linkText : "",
                                    linkClass : "addItemFileParser2",
                                    removeLinkText : "",
                                    removeLinkClass : "removeItemFileParser2",
                                    showAddButtonOnAllElements: true,
                                    addEventCallback : function(newElem, clonnedFrom){
                                        newElem.form();
                                        newElem.addClass("added-item").find("input:first").focus();
                                        newElem.find("input,textarea").each(function(index, el) {
                                            $(this).removeAttr('id');
                                        });
                                        newElem.find(".varname").bind("textchange", function(){
                                            if($(this).val().toLowerCase().indexOf("password")>=0){
                                                newElem.find("textarea").hide();
                                                newElem.find(".password").show();
                                            }
                                            else{
                                                newElem.find("textarea").show();
                                                newElem.find(".password").hide();
                                            }
                                        });
                                        newElem.find(".password").bind("textchange", function(){
                                            newElem.find("textarea").val($(this).val());
                                        });
                                        newElem.find("textarea").bind("textchange", function(){
                                            newElem.find(".password").val($(this).val());
                                        });
                                    },
                                    beforeAddEventCallback: function(elem){
                                        elem.find(".varname").bind("textchange", function(){
                                            if($(this).val().toLowerCase().indexOf("password")>=0){
                                                elem.find("textarea").hide();
                                                elem.find(".password").show();
                                            }
                                            else{
                                                elem.find("textarea").show();
                                                elem.find(".password").hide();
                                            }
                                        });
                                        elem.find(".password").bind("textchange", function(){
                                            elem.find("textarea").val($(this).val());
                                        });
                                        elem.find("textarea").bind("textchange", function(){
                                            elem.find(".password").val($(this).val());
                                        });
                                        return true;
                                    },
                                    removeEventCallback : function(prev, self, uid){
                                    }
                                });
                                taskForm.find(".varname").trigger('textchange');
                            }
                            else if(controlData.type == "Wait")
                            {
                                $("#conditional_enabled", taskForm).change(function(){
                                    if($(this).is(":checked"))
                                    {
                                        $(".conditionalItems", taskForm).show().find("input:first").focus();
                                    }
                                    else
                                    {
                                        $(".conditionalItems", taskForm).hide();
                                    }
                                });
                            }
                            else if(controlData.type == "Link")
                            {
                                var link = $("#link", taskForm).empty();
                                var plugins = taskDesigner.data.availablePlugins();
                                var loadedPlugin = taskDesigner.loadedPlugin || "";
                                loadedPlugin = "CrushTask:" + loadedPlugin;
                                var items = "<option value=''>Please Select</option>";
                                items += '<optgroup label="Plugin">';
                                for (var i = 0; i < plugins.length; i++) {
                                    var curItem = crushFTP.methods.textEncode(plugins[i]);
                                    if(curItem!="CrushTask (User Defined)" && curItem != loadedPlugin)
                                    {
                                        items += "<option value='plugin:"+curItem+"'>"+curItem+"</option>";
                                    }
                                }
                                items += '</optgroup>';

                                var loadedJob = taskDesigner.loadedSchedule.scheduleName;
                                var jobs = taskDesigner.availableJobsFlat;
                                items += '<optgroup label="Job">';
                                for (var i = 0; i < jobs.length; i++) {
                                    var curItem = crushFTP.methods.textEncode(jobs[i].name);
                                    if(curItem!=loadedJob)
                                    {
                                        items += "<option value='job:"+curItem+"'>"+curItem+"</option>";
                                    }
                                }
                                items += '</optgroup>';
                                link.append(items);
                            }
                            else if(controlData.type == "Java")
                            {
                                var data = [];
                                crushFTP.methods.rebuildSubItems(controlData.prop_item, "prop_item");
                                if (controlData.prop_item)
                                {
                                    var params = controlData.prop_item.prop_item_subitem;
                                    if(params && params.length>0)
                                    {
                                        for (var i = 0; i < params.length; i++) {
                                            var curItem = params[i];
                                            if(data.length==0)
                                                data.push({key : "", value : ""});
                                            data.push({
                                                key : curItem.key,
                                                value : curItem.val
                                            })
                                        }
                                    }
                                }
                                var multipleItemsPanel = $(".multipleItems", taskForm);
                                var columnsFileParser = $(".multipleItems", taskForm).EnableMultiField({
                                    confirmOnRemove: false,
                                    linkText : "Add",
                                    linkClass : "addItemProxy",
                                    data : data,
                                    removeLinkText : "Remove",
                                    removeLinkClass : "removeItemProxy",
                                    addEventCallback : function(newElem, clonnedFrom){
                                        newElem.show().form();
                                    }
                                });
                                taskForm.find(".removeItemProxy:last").click()
                                multipleItemsPanel.hide();
                                $(".addParameter", taskForm).unbind().bind("click", function(){
                                    taskForm.find(".addItemProxy:not(.addParameter):first").trigger("click");
                                    return false;
                                });
                                var javaclassHelp = $("#javaclassHelp", taskForm).dialog({
                                    autoOpen: false,
                                    width: 700,
                                    title : "Example Task : ",
                                    modal: true,
                                    resizable: true,
                                    closeOnEscape: true
                                });
                                $(".javaClassInfo", taskForm).unbind().click(function(){
                                    javaclassHelp.dialog("open");
                                    return false;
                                });
                            }
                            else if(controlData.type == "Http")
                            {
                                var data = [];
                                crushFTP.methods.rebuildSubItems(controlData.headers, "headers");
                                if (controlData.headers)
                                {
                                    var headers = controlData.headers.headers_subitem;
                                    if(headers && headers.length>0)
                                    {
                                        for (var i = 0; i < headers.length; i++) {
                                            var curItem = headers[i].value;
                                            if(curItem && curItem.split(":").length>0)
                                            {
                                                if(data.length==0)
                                                    data.push({key : "", value : ""});
                                                data.push({
                                                    key : curItem.split(":")[0],
                                                    value : curItem.substring(curItem.indexOf(":")+1)
                                                })
                                            }
                                        }
                                    }
                                }
                                var multipleItemsPanel = $(".multipleItems", taskForm);
                                var columnsFileParser = $(".multipleItems", taskForm).EnableMultiField({
                                    confirmOnRemove: false,
                                    linkText : "Add",
                                    linkClass : "addItemProxy",
                                    data : data,
                                    removeLinkText : "Remove",
                                    removeLinkClass : "removeItemProxy",
                                    addEventCallback : function(newElem, clonnedFrom){
                                        newElem.show().form();
                                    },
                                    removeEventCallback : function(prev, self, uid, feText){
                                        try{

                                        }catch(ex){

                                        }
                                    }
                                });
                                multipleItemsPanel.hide();
                                $(".addParameter", taskForm).unbind().bind("click", function(){
                                    taskForm.find(".addItemProxy:not(.addParameter):first").trigger("click");
                                    return false;
                                });
                                setTimeout(function(){
                                    $("#destUrl", ".ui-dialog").trigger("textchange");
                                }, 500);
                            }
                            else if(controlData.type == "JMS")
                            {
                                var _panel = taskForm;
                                _panel.find("#jms_custom_message, #jms_send_file_message").unbind("change.custom").bind("change.custom", function(){
                                    if (_panel.find("#jms_custom_message").is(":checked"))
                                        _panel.find(".custom_message").show();
                                    else
                                        _panel.find(".custom_message").hide();
                                });
                                 _panel.find("#jms_producer_mode,#jms_consumer_mode").unbind("change.custom").bind("change.custom", function(){
                                    _panel.find(".producer,.consumer").hide();
                                    if (_panel.find("#jms_producer_mode").is(":checked")){
                                        _panel.find(".producer").show();
                                    }
                                    else{
                                        _panel.find(".consumer").show();
                                    }
                                });
                            }
                            else if(controlData.type == "Email")
                            {
                                if(typeof controlData.smtp_custom == "undefined")
                                    controlData.smtp_custom = "false";
                                var _panel = taskForm;
                                if(typeof controlData.smtp_custom == "true")
                                    _panel.find("#customSMTPSettings").show();
                                else
                                    _panel.find("#customSMTPSettings").hide();
                                _panel.find("#smtp_custom").unbind("change.custom").bind("change.custom", function(){
                                    if ($(this).is(":checked"))
                                        _panel.find("#customSMTPSettings").show();
                                    else
                                        _panel.find("#customSMTPSettings").hide();
                                });
                                var emailBody = _panel.find("#emailBody");
                                function showHTMLEditor(flag){
                                    setTimeout(function(){
                                        try{
                                            emailBody.sceditor("instance").destroy();
                                        }catch(ex){}
                                        if(!flag)
                                            return;
                                        try{
                                            emailBody.sceditor({
                                                width: "620px",
                                                emoticonsEnabled : false,
                                                toolbar : "bold,italic,underline|orderedlist,bulletlist|left,center,right|color|image|link,unlink|font,size|maximize|source",
                                                style: '/WebInterface/Resources/js/SCEditor/jquery.sceditor.default.min.css'

                                            });
                                        }catch(ex){}
                                    }, 100);
                                }
                                var plainTextBody = (!crushFTP.methods.isHTML(controlData.emailBody) || (controlData.emailBodyPlainText && controlData.emailBodyPlainText == "true"));
                                controlData.emailBodyPlainText = plainTextBody + "";
                                var htmlBody = controlData.emailBodyHTML && controlData.emailBodyHTML == "true";
                                controlData.htmlBody = (!plainTextBody) + "";
                                showHTMLEditor(!plainTextBody);
                                $("#emailBodyHTML,#emailBodyPlainText", _panel).change(function(){
                                    if($(this).is(":checked")){
                                        showHTMLEditor($(this).is("#emailBodyHTML"));
                                    }
                                });

                                $("a#testSMTPSettings", _panel).click(function() {
                                    if ($(this).attr("disabled")) return false;
                                    jPrompt("Please enter a 'From' email address : ", "", "From Address", function(fromEmail) {
                                        if (fromEmail && fromEmail.length > 0) {
                                            jPrompt("Please enter a 'To' email address : ", "", "To Address", function(toEmail) {
                                                if (toEmail && toEmail.length > 0) {
                                                    var obj = {
                                                        command: "testSMTP",
                                                        to: toEmail,
                                                        cc: "",
                                                        bcc: "",
                                                        from: fromEmail,
                                                        subject: "Email Test",
                                                        body: "This is the body of the test message.",
                                                        server: crushFTP.methods.htmlEncode($("#smtp_server", _panel).val()),
                                                        user: crushFTP.methods.htmlEncode($("#smtp_user", _panel).val()),
                                                        pass: crushFTP.methods.htmlEncode($("#smtp_pass", _panel).val()),
                                                        ssl: $("#smtp_ssl", _panel).is(":checked"),
                                                        html: $("#smtp_html", _panel).is(":checked")
                                                    };
                                                    $("a#testSMTPSettings", _panel).block({
                                                        message: 'Wait..',
                                                        css: {
                                                            border: 'none',
                                                            padding: '0px 10px',
                                                            backgroundColor: '#000',
                                                            '-webkit-border-radius': '10px',
                                                            '-moz-border-radius': '10px',
                                                            opacity: .5,
                                                            color: '#fff',
                                                            'text-align': 'left'
                                                        }
                                                    }).attr("disabled", "disabled");
                                                    crushFTP.data.serverRequest(obj, function(msg) {
                                                        $("a#testSMTPSettings", _panel).unblock().removeAttr("disabled");
                                                        crushFTP.UI.growl("Testing SMTP Settings", crushFTP.methods.htmlEncode(decodeURIComponent($(msg).text())), false, false);
                                                    });
                                                }
                                            }, false, false, {
                                                messageToAppend: '<div class="ui-corner-all warning left" style="padding:5px;display:block;margin:0px 0px 10px 100px;"><span style="float: left; margin-right: 0.3em;" class="ui-icon ui-icon-info"></span>Can not be blank</div>'
                                            });
                                        }
                                    }, false, false, {
                                        messageToAppend: '<div class="ui-corner-all warning left" style="padding:5px;display:block;margin:0px 0px 10px 100px;"><span style="float: left; margin-right: 0.3em;" class="ui-icon ui-icon-info"></span>Can not be blank</div>'
                                    });
                                    return false;
                                });
                            }
                            //taskForm.prepend('<div id="sourceFilterItemsTemplate"  style="float: right;margin-top: -32px;width: 230px;"></div>');
                            if(type == "move" || type == "copy" || type == "rename" || type == "delete")
                            {
                                taskForm.prepend('<div><p style="margin:7px 0px 5px -10px;"><label for="name">Task Name: </label> <input type="text" id="name" name="name" class="bigInputBox ignoreBind" style="width:400px;" /><span style="margin-left:5px;" class="process_first nowrap"><input type="checkbox" id="process_first" name="process_first" class="ignoreBind" /><label for="process_first" class="CrushTask">Process first item only</label></span></p><p><span style="margin-left:-10px;" id="sourceFilterItemsTemplate"><label class="vtip" title="* means any range of characters, and ? means any single character" for="sourceFilter">Source Filter :</label> <input class="vtip" title="* means any range of characters, and ? means any single character" style="width:570px" type="text" id="sourceFilter" name="sourceFilter" /></span></p></div><div><p style="margin:7px 0px 5px -10px;"><span style="margin-left:5px;" class="log_summary_only nowrap"><input type="checkbox" id="log_summary_only" name="log_summary_only" class="ignoreBind" /><label for="log_summary_only" class="CrushTask">Don\'t log individual actions</label></span></p></div>');
                            }
                            else if(type == "find"){
                                taskForm.prepend('<div><p style="margin:7px 0px 5px -10px;"><label for="name">Task Name: </label> <input type="text" id="name" name="name" class="bigInputBox ignoreBind" style="width:400px;" /><span style="margin-left:5px;" class="process_first nowrap"><input type="checkbox" id="process_first" name="process_first" class="ignoreBind" /><label for="process_first" class="CrushTask">Process first item only</label></span></p><p><span style="margin-left:-10px;" id="sourceFilterItemsTemplate"><label class="vtip" title="* means any range of characters, and ? means any single character" for="sourceFilter">Folder Traversal Filter:</label> <input class="vtip" title="* means any range of characters, and ? means any single character" style="width:525px" type="text" id="sourceFilter" name="sourceFilter" /></span></p></div><div><p style="margin:7px 0px 5px -10px;"><span style="margin-left:5px;" class="log_summary_only nowrap"><input type="checkbox" id="log_summary_only" name="log_summary_only" class="ignoreBind" /><label for="log_summary_only" class="CrushTask">Don\'t log individual actions</label></span></p></div>');
                            }
                            else{
                                taskForm.prepend('<div><p style="margin:7px 0px 5px -10px;"><label for="name">Task Name: </label> <input type="text" id="name" name="name" class="bigInputBox ignoreBind" style="width:145px;" /><span style="margin-left:5px;" id="sourceFilterItemsTemplate"><label class="vtip" title="* means any range of characters, and ? means any single character" for="sourceFilter">Source Filter :</label> <input class="vtip" title="* means any range of characters, and ? means any single character" style="width:75px" type="text" id="sourceFilter" name="sourceFilter" /></span><span style="margin-left:5px;" class="process_first nowrap"><input type="checkbox" id="process_first" name="process_first" class="ignoreBind" /><label for="process_first" class="CrushTask">Process first item only</label></span></p></div><div><p style="margin:7px 0px 5px -5px;"><span style="margin-left:5px;" class="log_summary_only nowrap"><input type="checkbox" id="log_summary_only" name="log_summary_only" class="ignoreBind" /><label for="log_summary_only" class="CrushTask">Don\'t log individual actions</label></span></p></div>');
                            }

                            if(type == "find" || type == "move" || type == "copy")
                            {
                                if(typeof controlData.add_cache == "undefined")
                                    controlData.add_cache = "true";
                            }
                            if(type == "move" || type == "copy")
                            {
                                if(typeof controlData.retry_delay == "undefined")
                                    controlData.retry_delay = "0";

                                $("#pgpDecryptVerify", taskForm).change(function(){
                                    if($(this).is(":checked"))
                                    {
                                        taskForm.find(".verify_item").show();
                                    }
                                    else
                                    {
                                        taskForm.find(".verify_item").hide();
                                    }
                                }).trigger("change");

                                $("#pgpSignUpload", taskForm).change(function(){
                                    if($(this).is(":checked"))
                                    {
                                        taskForm.find("[ref='pgpSignUpload']").show();
                                    }
                                    else
                                    {
                                        taskForm.find("[ref='pgpSignUpload']").hide();
                                    }
                                }).trigger("change");

                                // $("#pgpDecryptUpload", taskForm).change(function(){
                                //     var key_path = $("#pgpPrivateKeyUploadPath", taskForm);
                                //     var path = $.trim(key_path.val());
                                // }).trigger("change");
                            }
                            if(type == "find"){
                                if(typeof controlData.delay_check_interval == "undefined")
                                    controlData.delay_check_interval = "3";
                            }
                            if(type == "popimap")
                            {
                                if(typeof controlData.recurse_messages == "undefined")
                                    controlData.recurse_messages = "true";
                                if(typeof controlData.timeout == "undefined" || !controlData.timeout)
                                    controlData.timeout = "20000";
                            }

                            if(type == "Glacier" && taskDesigner.loadedSchedule && taskDesigner.loadedSchedule.scheduleName){
                                controlData.cache_folder = "./jobs/"+taskDesigner.loadedSchedule.scheduleName+"/";
                            }

                            if(type == "findcache" || type == "kill" || type == "wait" || type == "link" || type == "sort" || type == "tunnel" || type == "userslist")
                            {
                                taskForm.find(".process_first").remove();
                            }
                            if(type == "jump")
                            {
                                taskForm.find(".process_first").hide();
                            }
                            if(type == "email")
                            {
                                if(typeof controlData.loop_delay == "undefined")
                                    controlData.loop_delay = "1";
                            }
                            if(type == "delete")
                            {
                                if(typeof controlData.destPath == "undefined")
                                    controlData.destPath = "{url}";
                            }
                            if(type == "link")
                            {
                                if(typeof controlData.skip_link_on_empty == "undefined")
                                    controlData.skip_link_on_empty = "false";
                                if(typeof controlData.run_job == "undefined")
                                    controlData.run_job = "false";
                                if(typeof controlData.run_job_items == "undefined")
                                    controlData.run_job_items = "false";
                                if(typeof controlData.run_job_async == "undefined")
                                    controlData.run_job_async = "false";
                            }
                            if(typeof controlData.acceptAnyCert == "undefined" && taskDesigner.formDialog.find('input[_name="acceptAnyCert"]').length>0)
                            {
                                controlData.acceptAnyCert = "true";
                            }
                            taskDesigner.bindFormEvents(taskDesigner.formDialog, controlData);
                            taskDesigner.openFormControlData = controlData;
                            var modalWidth = taskForm.attr("modalSize") || 700;
                            taskDesigner.formDialog.dialog({title:"Task : " + controlData.type, width : modalWidth});
                            taskDesigner.formDialog.find("#TaskLogging").clearForm();
                            taskForm.form().find(".tabs").tabs().end().find(".button").button();

                            taskDesigner.formDialog.dialog("open");
                            that.effect("transfer", { to: taskDesigner.formDialog.dialog('widget'), className: "ui-effects-transfer" }, 400);
                            taskDesigner.formDialog.dialog({
                                beforeClose : function(){
                                    var $this = $(this);
                                    if(!$this.is(":visible"))return;
                                    $this
                                    .dialog("widget")
                                    .effect("transfer", {
                                        to: that.closest(".crushTaskItem"),
                                        className: "ui-effects-transfer"
                                    }, 500);
                                }
                            });
                            if(type == "tunnel")
                            {
                                /*var availableTunnels = $(document).data("GUIXMLPrefs").tunnels;
                                if(availableTunnels && availableTunnels.tunnels_subitem)
                                    crushFTP.methods.rebuildSubItems(availableTunnels, "tunnels");
                                var tunnel_name = taskForm.find("#tunnel_name");
                                for (var i = 0; i < availableTunnels.tunnels_subitem.length; i++) {
                                    var curItem = availableTunnels.tunnels_subitem[i];
                                    var newControl = $("<option value='"+curItem.name+"'>"+curItem.name+"</option>");
                                    tunnel_name.append(newControl);
                                };*/

                                taskForm.find(".httpOnly").each(function(){
                                    $(this).bind("textchange", function(){
                                        var text = $.trim($(this).val().toLowerCase());
                                        if(text.indexOf("{")==0 || text.indexOf("http://")>=0 || text.indexOf("https://")>=0)
                                        {
                                            $(this).removeClass("ui-state-error").closest("p").find(".errorMsg").hide();
                                        }
                                        else
                                        {
                                            $(this).addClass("ui-state-error").closest("p").find(".errorMsg").show();
                                        }
                                    });
                                    $(this).bind("change", function(){
                                        var val = $(this).val();
                                        if(!val.endsWith("/"))
                                            val = val + "/";
                                        $(this).val(val);
                                    });
                                });
                            }
                            taskForm.find(".remoteURLWithVariable").each(function(){
                                $(this).unbind("textchange.vaidation").bind("textchange.vaidation", function(){
                                    var text = $.trim($(this).val());
                                    if(text.lastIndexOf("/") == text.length-1)
                                    {
                                        $(this).addClass("ui-state-error").closest("div").find(".errorMsg").show();
                                    }
                                    else
                                    {
                                        $(this).removeClass("ui-state-error").closest("div").find(".errorMsg").hide();
                                    }
                                });
                            });
                            var encryption_method = $("#encryption_method, #cms_encryption_method", taskForm).change(function(){
                                if($(this).val() == "encrypt")
                                {
                                    taskForm.find(".decryptPanel").hide();
                                    taskForm.find(".encryptPanel").show();
                                    taskForm.find(".encryptPanel.subPanel").append(taskForm.find(".sign_key"));
                                    taskForm.find(".non-info").show();
                                    taskForm.find("#sign").change();
                                }
                                else if($(this).val() == "info")
                                {
                                    taskForm.find(".decryptPanel").hide();
                                    taskForm.find(".encryptPanel").hide();
                                    taskForm.find(".non-info").hide();
                                }
                                else
                                {
                                    taskForm.find(".decryptPanel").show();
                                    taskForm.find(".encryptPanel").hide();
                                    taskForm.find(".non-info").show();
                                    taskForm.find(".decryptPanel.subPanel").prepend(taskForm.find(".sign_key"));
                                    taskForm.find(".sign_key").show();
                                }
                            });
                            setTimeout(function() {
                                encryption_method.trigger("change");
                            }, 100);
                            var ignored = taskDesigner.formDialog.find(".ignoreBind").removeClass("ignoreBind");
                            taskDesigner.formDialog.find("#example").addClass('binding');
                            if(controlData.use_dmz && (controlData.use_dmz.indexOf("socks://") == 0 || controlData.use_dmz.indexOf("internal://") == 0 || controlData.use_dmz.indexOf("variable") == 0))
                            {
                                taskDesigner.formDialog.find("#use_dmz").find("option[_rel='custom']").attr("value", controlData.use_dmz).text(controlData.use_dmz + " (custom)");
                            }
                            taskDesigner.data.bindValuesFromJson(taskDesigner.formDialog, controlData);
                            $("#mail_host, #smtp_server", taskDesigner.formDialog).trigger("textchange");
                            if(controlData.use_dmz == "false" || controlData.use_dmz == "")
                            {
                                useDmzs.find("option:first").attr("selected", "selected");
                            }
                            useDmzs.unbind('change.custom').bind("change.custom", function(evt){
                                if(window.applyingChanges)return false;
                                var that = $(this);
                                if ($(this).find(":selected").attr("_rel") == "custom") {
                                    var dmzCustomOptions = $("#dmzCustomOptions").dialog("open");
                                    var val = that.val();
                                    if(that.val() != "")
                                    {
                                        if(val == "internal://")
                                        {
                                            dmzCustomOptions.find("#customDMZType").val("internal://").change();
                                            dmzCustomOptions.find("#customDMZHost").val("");
                                            dmzCustomOptions.find("#customDMZPort").val("");
                                            dmzCustomOptions.find("#customDMZVariable").val("");
                                        }
                                        else if(val.indexOf("variable")==0)
                                        {
                                            dmzCustomOptions.find("#customDMZType").val("variable").change();
                                            dmzCustomOptions.find("#customDMZHost").val("");
                                            dmzCustomOptions.find("#customDMZPort").val("");
                                            dmzCustomOptions.find("#customDMZVariable").val(val.replace("variable:", ""));
                                        }
                                        else if(val.indexOf("socks")==0)
                                        {
                                            var url = val.split("//");
                                            dmzCustomOptions.find("#customDMZType").val("socks5").change();
                                            if(url[1].indexOf(":")>0)
                                            {
                                                var items = url[1].split(":");
                                                dmzCustomOptions.find("#customDMZHost").val(items[0]);
                                                dmzCustomOptions.find("#customDMZPort").val(items[1]);
                                            }
                                            else
                                            {
                                                dmzCustomOptions.find("#customDMZHost").val(url[1]);
                                            }
                                        }
                                        else
                                        {
                                            dmzCustomOptions.find("#customDMZHost").val("");
                                            dmzCustomOptions.find("#customDMZPort").val("");
                                            dmzCustomOptions.find("#customDMZVariable").val("");
                                        }
                                    }
                                    window.afterCustomDMZSelection = function(canceled){
                                        if(canceled)
                                        {
                                            if(val == "custom" || val == "false")
                                                that.find("option:first").attr('selected', 'selected');
                                        }
                                        else
                                        {
                                            var type = dmzCustomOptions.find("#customDMZType").val();
                                            var host =  dmzCustomOptions.find("#customDMZHost").val();
                                            var variable = dmzCustomOptions.find("#customDMZVariable").val();
                                            var port =  dmzCustomOptions.find("#customDMZPort").val();
                                            var DMZValue = type;
                                            if(type == "socks5")
                                            {
                                                if(port.length>0)
                                                    DMZValue = "socks://" + host + ":" + port;
                                                else
                                                    DMZValue = "socks://" + host;
                                            }
                                            else if(type == "variable")
                                            {
                                                DMZValue = "variable:" + variable;
                                            }
                                            that.find(":selected").attr("value", DMZValue);
                                            that.find(":selected").text(DMZValue + " (custom)");
                                            that.trigger('change');

                                            dmzCustomOptions.find("#customDMZHost").val("");
                                            dmzCustomOptions.find("#customDMZPort").val("");
                                            dmzCustomOptions.find("#customDMZVariable").val("")
                                        }
                                    };
                                    evt.preventDefault();
                                    evt.stopPropagation();
                                    return false;
                                };
                            });

                            taskDesigner.formDialog.find("#example").removeClass('binding');
                            if(type == "zip")
                            {
                                if(controlData.internal_zip == "true")
                                {
                                    crushFTP.UI.checkUnchekInput(taskForm.find("#internal_zip"), true);
                                }
                                else if(controlData.external_zip == "true")
                                {
                                    crushFTP.UI.checkUnchekInput(taskForm.find("#external_zip"), true);
                                }
                            }
                            else if(type == "wait")
                            {
                                $("#conditional_enabled", taskForm).trigger("change");
                                $("#variableCondition", taskForm).unbind("change").bind("change", function(){
                                    if($(this).val() == "greater than datetime" || $(this).val() == "less than datetime")
                                    {
                                        $("#wait_datecondition_msg", taskForm).show();
                                    }
                                    else
                                    {
                                        $("#wait_datecondition_msg", taskForm).hide();
                                    }
                                }).trigger("change");
                            }
                            else if(type == "unzip")
                            {
                                if(controlData.internal_unzip == "true")
                                {
                                    crushFTP.UI.checkUnchekInput(taskForm.find("#internal_unzip"), true);
                                    taskForm.find(".forInternal").show();
                                }
                                else if(controlData.external_unzip == "true")
                                {
                                    crushFTP.UI.checkUnchekInput(taskForm.find("#external_unzip"), true);
                                    taskForm.find(".forInternal").hide();
                                }
                            }
                            else if(type == "find")
                            {
                                if(controlData)
                                {
                                    if(controlData.modified_comparison)
                                    {
                                        if(controlData.modified_comparison == "new")
                                        {
                                            crushFTP.UI.checkUnchekInput(taskForm.find("#modified_comparison_newer"), true);
                                        }
                                        else
                                        {
                                            crushFTP.UI.checkUnchekInput(taskForm.find("#modified_comparison_older"), true);
                                        }
                                    }

                                    if(typeof controlData.add_cache == "undefined")
                                        controlData.add_cache = true;

                                    if(typeof controlData.delay_check_interval == "undefined")
                                        controlData.delay_check_interval = "3";
                                }
                            }
                            else if(type == "uservariable")
                            {
                                if(controlData)
                                {
                                    if(typeof controlData.use_first !="undefined" && controlData.use_first == "true")
                                    {
                                        crushFTP.UI.checkUnchekInput(taskForm.find("#use_first:last"), true);
                                    }
                                    else
                                    {
                                        crushFTP.UI.checkUnchekInput(taskForm.find("#use_first:first"), true);
                                    }
                                }
                            }
                            else if(type == "findcache")
                            {
                                if(controlData && controlData.cache_mode)
                                {
                                    if(controlData.cache_mode == "write")
                                    {
                                        crushFTP.UI.checkUnchekInput(taskForm.find("#cache_mode_write"), true);
                                    }
                                    else
                                    {
                                        crushFTP.UI.checkUnchekInput(taskForm.find("#cache_mode_read"), true);
                                    }
                                }
                            }
                            else if(type == "fileparser")
                            {
                                if(controlData)
                                {
                                    var delimiter = $("#delimiter", taskForm).trigger("change");
                                    var column_override = $("#column_override", taskForm).val();
                                    var columnData = column_override.split(",");
                                    var existingData = [];
                                    if(columnData && columnData.length>0)
                                    {
                                        for(var i=0;i<columnData.length;i++)
                                        {
                                            var curColDetails = columnData[i].split(":");
                                            if(curColDetails && curColDetails.length>0)
                                            {
                                                var colInd, colSize, colName;
                                                if(curColDetails.length==3)
                                                {
                                                    colInd = curColDetails[0];
                                                    colName = curColDetails[1];
                                                    colSize = curColDetails[2];
                                                    existingData.push({
                                                        column_name : colName,
                                                        column_size : colSize,
                                                        column_index : colInd
                                                    });
                                                }
                                                else if(curColDetails.length==2)
                                                {
                                                    colInd = curColDetails;
                                                    colName = curColDetails[1];
                                                    existingData.push({
                                                        column_name : colName,
                                                        column_index : colInd
                                                    });
                                                }
                                            }
                                        }
                                    }
                                    function showIndexForFileParserColumns()
                                    {
                                        var visibleCols = $(".multipleColumnOptions:visible", taskForm).each(function(index){
                                            var _index = index+1;
                                            $(this).find(".indexOfColumn").text(_index);
                                            //if($(this).find(".column_index").val().length==0)
                                            $(this).find(".column_index").val(_index);
                                        });
                                        visibleCols.find(".moveItemUp.disabled, .moveItemDown.disabled").removeClass("disabled");
                                        $(".multipleColumnOptions:visible:first", taskForm).find(".moveItemUp").addClass("disabled");
                                        $(".multipleColumnOptions:visible:last", taskForm).find(".moveItemDown").addClass("disabled");
                                        if($(".multipleColumnOptions:visible", taskForm).length==0)
                                            $(".multipleColumnOptions", taskForm).show().find("input").val("");

                                        var column_headers = $("#column_headers", taskForm).is(":checked");
                                        if(!column_headers && $("#column_override", taskForm).val().length==0)
                                        {
                                            $("#fileParserColumnError", taskForm).show();
                                        }
                                        else
                                            $("#fileParserColumnError", taskForm).hide();
                                    }
                                    $(".removeItemFileParser").trigger("click");
                                    var delimiter = $("#delimiter", taskForm);
                                    if($("#column_headers", taskForm).is(":checked"))
                                    {
                                        $(".multipleColumnOptions", taskForm).find(".indexOfColumn").hide().end().find(".column_index").show();
                                    }
                                    else
                                    {
                                        $(".multipleColumnOptions", taskForm).find(".indexOfColumn").show().end().find(".column_index").hide();
                                    }
                                    var columnsFileParser = $(".multipleColumnOptions", taskForm).EnableMultiField({
                                        confirmOnRemove: false,
                                        linkText : "",
                                        linkClass : "addItemFileParser",
                                        removeLinkText : "",
                                        removeLinkClass : "removeItemFileParser",
                                        data: existingData,
                                        addEventCallback : function(newElem, clonnedFrom){
                                            taskDesigner.bindFileParserInputEvents(newElem);
                                            newElem.form();
                                            delimiter.trigger("change");
                                            showIndexForFileParserColumns();
                                            taskDesigner.buildFileParserColumns();
                                        },
                                        removeEventCallback : function(prev, self, uid){
                                            delimiter.trigger("change");
                                            showIndexForFileParserColumns();
                                            taskDesigner.buildFileParserColumns();
                                        }
                                    });

                                    taskDesigner.bindFileParserInputEvents(columnsFileParser);
                                    columnsFileParser.append('<a href="#" class="removeItemFileParser"></a>');
                                    columnsFileParser.find('.removeItemFileParser').unbind().click(function(){
                                        columnsFileParser.hide();
                                        showIndexForFileParserColumns();
                                        return false;
                                    })

                                    $(".moveItemUp, .moveItemDown").unbind().bind("click", function(){
                                        var curTR = $(this).closest("tr");
                                        if($(this).is(".moveItemUp"))
                                        {
                                            if(!curTR.prev().hasClass("ui-priority-primary"))
                                            {
                                                curTR.prev().before(curTR);
                                            }
                                        }
                                        else
                                        {
                                            curTR.next().after(curTR);
                                        }
                                        showIndexForFileParserColumns();
                                        return false;
                                    });

                                    $(".addMoreColumn").unbind().bind("click", function(){
                                        columnsFileParser.closest("table").find(".addItemFileParser:first").trigger("click");
                                        return false;
                                    });
                                    if(existingData && existingData.length>0)
                                    {
                                        $(".fileParserColumns").find(".removeItemFileParser:last").trigger("click");
                                    }
                                }
                            }
                            taskForm.find(".SSHOptionsHandle").trigger("textchange");
                            taskForm.find(".encryptionMode").trigger("change");
                            ignored.addClass("ignoreBind");
                            setTimeout(function(){
                                taskForm.find(".SSHOptionsHandle").trigger("textchange");
                                taskForm.find(".maskPasswordOnURL").removeData("password").trigger("blur");
                            }, 100);
                        }
                        if(type == "pgp")
                        {
                            function showHideItems(){
                                var method = $("#encryption_method", taskForm).val();
                                var sign = $("#sign", taskForm).is(":checked");
                                var path = $.trim($("#key_path", taskForm).val());
                                $(".sign_item", taskForm).hide();
                                if(method == "encrypt" && path.toLowerCase().indexOf("password:") == 0){
                                    $(".sign_item.sign_key", taskForm).show();
                                }
                                else{
                                    if(method !== "encrypt" || !sign){
                                        $(".sign_item", taskForm).hide();
                                    }
                                    if(method !== "encrypt"){
                                        $(".sign_key", taskForm).show();
                                    }
                                }
                                if(sign){
                                    taskForm.find(".sign_item").show();
                                    $("#private_key_path", taskForm).trigger("textchange");
                                }
                            }

                            $("#sign,#verify", taskForm).change(function(){
                                if($(this).is("#sign"))
                                {
                                    showHideItems();
                                }
                                else if($(this).is("#verify"))
                                {
                                    if($(this).is(":checked"))
                                    {
                                        taskForm.find(".verify_item").show();
                                    }
                                    else
                                    {
                                        taskForm.find(".verify_item").hide();
                                    }
                                }
                            }).trigger("change");

                            $("#key_path", taskForm).bind("textchange", function(){
                                showHideItems();
                            });

                        }
                        setTimeout(function(){
                            taskForm.find(".maskPasswordOnURL:visible").trigger("custevt");
                        }, 600);
                        $("#multithreaded_s3", taskForm).unbind("change").bind("change", function(){
                            if($(this).is(":checked")){
                                $(".multiThreadUploadOptions", taskForm).show();
                            }
                            else{
                                $(".multiThreadUploadOptions", taskForm).hide();
                            }
                        }).trigger("change");
                        $("#multithreaded_s3_download", taskForm).unbind("change").bind("change", function(){
                            if($(this).is(":checked")){
                                $(".multiThreadDownloadOptions", taskForm).show();
                            }
                            else{
                                $(".multiThreadDownloadOptions", taskForm).hide();
                            }
                        }).trigger("change");
                        taskForm.find(".validate").crushValidator();
                    }
                    return false;
                });
                $(this).find(".crushTaskItemInfo").unbind("click").click(function(evt, evtData){
                    var crushTaskItemInfo = $(this);
                    $('#vtip').hide();
                    var that = $(this);
                    var cTaskId = that.closest(".crushTaskItem").attr("uid");
                    var itemsInfo = crushTaskItemInfo.data("itemsInfo");
                    if(itemsInfo && evtData)
                    {
                        var dialogPanel = taskDesigner.activeTaskItemsDialog;
                        if(itemsInfo.items)
                            dialogPanel.find(".itemCount").text(itemsInfo.items.length);
                        if(itemsInfo.newItems)
                            dialogPanel.find(".newItemCount").text(itemsInfo.newItems.length);
                        var itemsTable = dialogPanel.find(".itemsTable");
                        itemsTable.find("div.itemRow").remove();
                        if(itemsInfo.items)
                        {
                            for (var i = 0; i < itemsInfo.items.length; i++) {
                                var curItem = itemsInfo.items[i];
                                var _item = $('<div class="itemRow editable ui-widget-content"><div class="key">'+curItem.type+': </div><div class="val">'+decodeURIComponent(unescape(curItem.url))+'</div><div class="remove"></div></div>');
                                _item.data("controlData", curItem);
                                itemsTable.append(_item);
                            };

                            if(itemsInfo.items.length==0)
                            {
                                itemsTable.append('<div class="itemRow ui-widget-content"><div style="text-align:center;">No items available</div></div>');
                            }
                        }

                        var newItemsTable = dialogPanel.find(".newItemsTable");
                        newItemsTable.find("div.itemRow").remove();
                        if(itemsInfo.newItems)
                        {
                            for (var i = 0; i < itemsInfo.newItems.length; i++) {
                                var curItem = itemsInfo.newItems[i];
                                var _item = $('<div class="itemRow editable ui-widget-content"><div class="key">'+curItem.type+': </div><div class="val">'+crushFTP.methods.xssEncode(curItem.url)+'</div><div class="remove"></div></div>');
                                _item.data("controlData", curItem);
                                newItemsTable.append(_item);
                            };

                            if(itemsInfo.newItems.length==0)
                            {
                                newItemsTable.append('<div class="itemRow ui-widget-content"><div colspan="2" style="text-align:center;">No items available</div></div>');
                            }
                        }
                        dialogPanel.find(".itemsTable,.newItemsTable").bind("click", function(e){
                            var _target = $(e.target);
                            var _that = $(this);
                            var isNewItems = _that.is(".newItemsTable");
                            if(_target.is(".key") || _target.is(".val"))
                            {
                                var data = _target.closest("div.itemRow").data("controlData");
                                var _div = $("<div></div>");
                                var hasData = false;
                                for(var j in data)
                                {
                                    if(j != "type")
                                    {
                                        if(typeof data[j] == "string")
                                        {
                                            var val = unescape(data[j]);
                                            try{
                                                val = decodeURIComponent(val);
                                            }
                                            catch(ex){

                                            }
                                            var _item = $('<div class="itemRow editable ui-widget-content"><div class="key">'+j+': </div><div class="val"><input type="text" value="'+val+'" /></div><div class="remove"></div></div>');
                                            _div.append(_item);
                                            hasData = true;
                                        }
                                        else if(typeof data[j] == "object")
                                        {
                                            var _item = $('<div class="itemRow ui-widget-content""><div class="subItems"><div style="text-align:center;"><strong>'+j+'</strong></div></div></div>');
                                            hasData = true;
                                            var curData = data[j];
                                            for(var k in curData)
                                            {
                                                if(k != "type")
                                                {
                                                    if(typeof curData[k] == "string")
                                                    {
                                                        var _val = unescape(curData[k]);
                                                        try{
                                                            _val = decodeURIComponent(_val);
                                                        }
                                                        catch(ex){

                                                        }
                                                        _item.find(".subItems").append('<div class="itemRow editable ui-widget-content"><div class="key">'+k+': </div><div class="val"><input type="text" value="'+_val+'" /></div><div class="remove"></div></div>');
                                                    }
                                                }
                                            }
                                            _div.append(_item);
                                        }
                                    }
                                }
                                if(hasData)
                                {
                                    taskDesigner.activeTaskItemsDetailsPanel.empty().append(_div).form().dialog("open");
                                    taskDesigner.activeTaskItemsDetailsPanel.find(".remove").click(function(event) {
                                        var that = $(this);
                                        jConfirm("Are you sure you want to remove this record from job's data?", "Confirm", function(val){
                                            if(val)
                                            {
                                                that.closest("div.itemRow").remove();
                                            }
                                        });
                                        return false;
                                    });
                                }
                            }
                            else if(_target.is(".remove"))
                            {
                                jConfirm("Are you sure you want to remove this record from job's data?", "Confirm", function(val){
                                    if(val)
                                    {
                                        _target.closest("div.itemRow").remove();
                                        if(isNewItems)
                                        {
                                            dialogPanel.find(".newItemCount").text(_that.find("div.itemRow.editable").length);
                                            dialogPanel.find("#filterJobItemsNew").removeData("lastFilterTerm").trigger('textchange');
                                        }
                                        else
                                        {
                                            dialogPanel.find(".itemCount").text(_that.find("div.itemRow.editable").length);
                                            dialogPanel.find("#filterJobItems").removeData("lastFilterTerm").trigger('textchange');
                                        }
                                    }
                                });
                            }

                        });
                        dialogPanel.dialog("open");
                    }
                    else
                    {
                        crushFTP.UI.showLoadingIndicator({});
                        var activeJob = taskDesigner.activeJobToMonitor;
                        activeJob = activeJob.split("||");
                        var jobID = activeJob[0];
                        var scheduleName = activeJob[1];
                        var obj = {
                            command: "getJobInfo",
                            job_id : jobID,
                            scheduleName : scheduleName
                        };
                        crushFTP.data.serverRequest(obj,
                        function(response){
                            crushFTP.UI.hideLoadingIndicator();
                            var items = false, data;
                            if(response)
                            {
                                if(response.getElementsByTagName("response_data") && response.getElementsByTagName("response_data").length > 0)
                                {
                                    data = response.getElementsByTagName("response_data")[0];
                                    items = $.xml2json(data);
                                }
                            }
                            if(items)
                            {
                                if(items.running_tasks && items.running_tasks.running_tasks_subitem)
                                {
                                    var dataItem = items.running_tasks.running_tasks_subitem;
                                    var curJobSettings = dataItem.settings;
                                    var activeItems = dataItem.active_items;
                                    crushFTP.methods.rebuildSubItems(activeItems, "active_items");
                                    if(activeItems && activeItems.active_items_subitem && activeItems.active_items_subitem.length>0)
                                    {
                                        try{
                                            activeItems =  activeItems.active_items_subitem;
                                            for (var i = 0; i < activeItems.length; i++) {
                                                var curItem = activeItems[i];
                                                var ID = curItem.connectionId || curItem.connectionID;
                                                if(cTaskId == ID)
                                                {
                                                    var taskPanel = $('[uid="'+ID+'"]');//$("#task_" + ID);
                                                    if(curItem.items)
                                                    {
                                                        crushFTP.methods.rebuildSubItems(curItem.items, "items");
                                                    }
                                                    if(curItem.newItems)
                                                    {
                                                        crushFTP.methods.rebuildSubItems(curItem.newItems, "newItems");
                                                    }

                                                    var items = curItem.items ? curItem.items.items_subitem : [];
                                                    var newItems = curItem.newItems ? curItem.newItems.newItems_subitem : [];

                                                    (function(index, itm){
                                                        var condId = itm.connectionId;
                                                        var curActiveItem = $(response).find("connectionId:contains('"+condId+"'):first").parent();
                                                        var _items = curActiveItem.find("items_subitem");
                                                        var _newItems = curActiveItem.find("newItems_subitem");
                                                        var _ind = 0;
                                                        newItems.forEach(function(curRec){
                                                            var curNI = _newItems.get(_ind);
                                                            $(curNI).find("*").each(function(){
                                                                var tagName = $(this).attr("name") || $(this)[0].tagName;
                                                                var value = $(this).text();
                                                                curRec[tagName] = value;
                                                            });
                                                            delete curRec.item;
                                                            _ind++;
                                                        });
                                                        var _ind = 0;
                                                        items.forEach(function(curRec){
                                                            var curNI = _items.get(_ind);
                                                            $(curNI).find("*").each(function(){
                                                                var tagName = $(this).attr("name") || $(this)[0].tagName;
                                                                var value = $(this).text();
                                                                curRec[tagName] = value;
                                                            });
                                                            delete curRec.item;
                                                            _ind++;
                                                        });
                                                    })(i, curItem);

                                                    var itemsCount = parseInt(curItem.items_count) || 0;
                                                    var newItemsCount = parseInt(curItem.newItems_count) || 0;

                                                    if((itemsCount) || (newItemsCount))
                                                    {
                                                        var crushTaskItemInfo = taskPanel.find(".crushTaskItemInfo").show();
                                                        crushTaskItemInfo.html('<span class="ui-icon ui-icon-arrowthick-1-s" style="display: inline-block;top: 2px;position: relative;"></span><span style="position: relative;">'+itemsCount+'</span>&nbsp;<span class="ui-icon ui-icon-arrowthick-1-n" style="display: inline-block;top: 2px;position: relative;"></span><span style="position: relative;">'+newItemsCount+'</span>');

                                                        //if(items.length>0 || newItems.length>0)
                                                        {
                                                            crushTaskItemInfo.data("itemsInfo", {
                                                                items : items,
                                                                newItems : newItems
                                                            });
                                                        }
                                                    }
                                                    else
                                                    {
                                                        var crushTaskItemInfo = taskPanel.find(".crushTaskItemInfo").hide();
                                                        crushTaskItemInfo.removeData("itemsInfo");
                                                    }
                                                    i = activeItems.length+1;
                                                }
                                            };
                                        }
                                        catch(ex)
                                        {
                                            console.log(ex);
                                        }
                                    }
                                }
                            }
                            that.trigger("click", [{origClick:true}]);
                        });
                    }
                    return false;
                });

                if(!taskDesigner.monitoringActiveJob)
                {
                    $(".crushTaskItem, #EndPoint, #StartPointPanel").droppable({
                      accept: ".taskAction",
                      activeClass: "ui-state-hover",
                      hoverClass: "ui-state-active",
                      tolerance : "pointer",
                      drop: function( event, ui ) {
                          var that = $(this);
                        var uid = $(ui.draggable).attr("uid");
                        var flag = $(ui.draggable).attr("_type");
                          that.data("connection", $(ui.draggable));
                          $(ui.draggable).data("connection", that);
                          taskDesigner.canvas.find(".isFocused").removeClass("isFocused");
                        taskDesigner.canvas.find(".attachConnection").removeClass("ui-state-focus attachConnection").data("stopAnimation", true);
                          setTimeout(function(){
                              taskDesigner.drawLine($(ui.draggable), that, flag);
                              taskDesigner.hasPendingChanges(true);
                          }, 500)
                      }
                    }).unbind("click").click(function(evt){
                        if($(this).hasClass("attachConnection"))
                        {
                            var isFocused = taskDesigner.canvas.find(".isFocused");
                            var flag = isFocused.attr("_type");
                            taskDesigner.drawLine(isFocused, $(this), flag);
                            isFocused.trigger("click");
                            return false;
                        }
                        else
                        {
                            if(evt.shiftKey)
                            {
                                if($(this).hasClass("ui-state-hover"))
                                    $(this).removeClass("highlighted");
                                else
                                    $(this).addClass("highlighted");
                                taskDesigner.clearRangeSelection();
                            }
                            else
                            {
                                $(this).removeClass("highlighted");
                                if(evt.altKey)
                                {
                                    $(this).find(".crushTaskDetailsLink").trigger("click");
                                }
                            }
                            taskDesigner.showCopyTasksButton();
                        }
                        evt.stopPropagation();
                        evt.preventDefault();
                    }).unbind("dblclick").bind("dblclick", function(evt){
                        evt.stopPropagation();
                    });
                }
            }
        });
    },
    bindFormEvents : function(form, controlData, callback){
        if(controlData && typeof controlData.random_id == "undefined")
            controlData.random_id = true;
        if(controlData && typeof controlData.multithreaded_s3 == "undefined")
            controlData.multithreaded_s3 = false;
        if(controlData && typeof controlData.multithreaded_s3_download == "undefined"){
            controlData.multithreaded_s3_download = controlData.multithreaded_s3;
        }
        if(controlData && typeof controlData.s3_stat_head_calls == "undefined")
            controlData.s3_stat_head_calls = true;
        vtip(form);
        $("#pgpPrivateKeyUploadPath, #pgpPublicKeyUploadPath, #upload_pgp_sign_private_key_path", form).each(function(){
            $(this).addClass('maskPasswordOnURL urlWithParams').closest('tr').find('.serverFilePickButton').removeClass('serverFilePickButton').addClass('serverFilePickWithParamsButton');
        });
        $("#key_path, #private_key_path, #public_key_path, #jms_message_store_url, #pgp_verify_public_key_path", form).each(function(){
            $(this).addClass('maskPasswordOnURL urlWithParams').closest('p').find('.serverFilePickButton').removeClass('serverFilePickButton').addClass('serverFilePickWithParamsButton');
        });
        var keyInput = $("#ssh_private_key, #ms_mails_download_url", form).each(function(){
            $(this).addClass('maskPasswordOnURL urlWithParams').closest('div').find('.serverFilePickButton').removeClass('serverFilePickButton').addClass('serverFilePickWithParamsButton');
        });
        $("#timeout, #write_timeout, #read_timeout", form).bind("textchange", function(){
            var id = $(this).attr("id");
            var val = $(this).val();
            var urlParams = keyInput.data("urlParams");
            if(urlParams){
                urlParams[id] = val;
                keyInput.data("urlParams", urlParams);
            }
        });
        form.find("input[type='text']").focus().keyup(function (e) {
            var keyCode = e.keyCode || e.which;
            if (keyCode == 13) {
                if (!$(this).hasClass("suggestVariables")) {
                    $($(".ui-dialog-buttonset").find("button").get(0)).trigger("click");
                };
                return false;
            }
        });

        form.find("#if_else_scenario").change(function(){
            if($(this).is(":checked"))
                form.find(".process_first").show();
            else
                crushFTP.UI.checkUnchekInput(form.find(".process_first").hide().find("input"), false);
            return false;
        });

        $("#mail_host, #smtp_server", form).bind("textchange", function() {
            if ($(this).val().indexOf('gmail.com')>=0) {
                $(".googleSMTPOptions").show();
                $(".microsoftSMTPOptions").hide();
                $(".nonGoogleSMTPOptions").hide();
            } else if ($(this).val().indexOf('office365')>=0 || $(this).val().indexOf('outlook')>=0) {
                $(".microsoftSMTPOptions").show();
                $(".googleSMTPOptions").hide();
                $(".nonmicrosoftSMTPOptions").hide();
            } else {
                $(".googleSMTPOptions").hide();
                $(".microsoftSMTPOptions").hide();
                $(".nonGoogleSMTPOptions").show();
            }
        });

        form.find(".customScriptBtn").click(function(){
            $(this).closest(".customScriptPanel").find(".customScriptsPanel").toggle();
            return false;
        });

        form.find("#save_result").change(function(){
            if($(this).is(":checked"))
                $(this).closest(".actionConfigPanel").find(".save_result_items").show();
            else
                $(this).closest(".actionConfigPanel").find(".save_result_items").hide();
            return false;
        });

        form.find("#onedrive_my_shares").change(function(){
            if($(this).is(":checked")){
                form.find(".actionConfigPanel").find(".onDriveShared").show();
            }
            else{
                form.find(".actionConfigPanel").find(".onDriveShared").hide();
            }
            return false;
        });

        var scriptType = form.find(".scriptType").change(function(){
            $(this).closest(".customScriptsPanel").find(".valPanel").hide();
            $(this).closest(".customScriptsPanel").find(".valPanel[rel='"+$(this).val()+"']").show();
            return false;
        });

        function bindCustomValEvents(elem)
        {
            elem.find("input.custVal").bind("textchange", function(){
                var prnt = $(this).closest("div.customVal");
                var val = $(this).val();
                if(val)
                {
                    var type = prnt.find(".customScriptType").val();
                    prnt.find("textarea.origVal").attr("id", type + "_" + val.replace(/ /g, "_").replace(/[^a-zA-Z 0-9]/g, '_') + "_script");
                }
                else
                {
                    prnt.find("textarea.origVal").removeAttr("id");
                }
            });

            elem.find("select.customScriptType").bind("change", function(){
                var prnt = $(this).closest("div.customVal");
                var type = $(this).val();
                var val = prnt.find("input.custVal").val();
                if(val)
                {
                    prnt.find("textarea.origVal").attr("id", type + "_" + val.replace(/ /g, "_").replace(/[^a-zA-Z 0-9]/g, '_') + "_script");
                }
                else
                {
                    prnt.find("textarea.origVal").removeAttr("id");
                }
            });

            elem.find("textarea.custVal").bind("textchange", function(){
                var prnt = $(this).closest("div.customVal");
                var val = $(this).val();
                prnt.find("textarea.origVal").val(val);
            });
        }
        var existingData = [];
        for(var item in controlData)
        {
            if(item.match("script$") && (item.match("^before") || item.match("^after")) && scriptType.find("option[value='"+item+"']").length==0)
            {
                var type = item.split("_")[0];
                existingData.push({
                    type : item.split("_")[0],
                    verb : item.replace(type+"_", "").replace("_script",""),
                    value : controlData[item],
                    id : item
                });
            }
        }
        taskDesigner.rebuildCustomScripts = function(){
            for (var i = existingData.length - 1; i >= 0; i--) {
                var id = existingData[i].id;
                if(form.find("textarea#"+id).length==0)
                {
                    try{
                        delete taskDesigner.openFormControlData[id];
                    }catch(ex){}
                }
            };
        }

        form.find(".customVal").EnableMultiField({
            confirmOnRemove: false,
            data: existingData,
            linkText : "",
            linkClass : "addItemFileParser2",
            removeLinkText : "",
            removeLinkClass : "removeItemFileParser2",
            addEventCallback : function(newElem, clonnedFrom){
                newElem.form();
                newElem.prepend("<hr style='margin: 3px 0px 10px 0px;border: 1px solid #ccc;border-width:0px 0px 1px 0px;' />");
                bindCustomValEvents(newElem);
            },
            removeEventCallback : function(prev, self, uid){
            }
        });

        if(existingData && existingData.length>0)
        {
            setTimeout(function(){
                form.find(".removeItemFileParser2:last").click();
            }, 100);
        }

        setTimeout(function(){
            bindCustomValEvents(form.find(".customVal"));
            form.find(".customVal").find("input, textarea").trigger('textchange');
            form.find(".customVal").find("select").trigger('change');
        }, 300);
        bindCustomValEvents(form.find(".customVal"));

        form.find("#mail_protocol").change(function(){
            var protocol = $(this).val();
            if(protocol=="imaps")
            {
                $("#mail_port", form).val("993").trigger("change");
            }
            else if(protocol=="imap")
            {
                $("#mail_port", form).val("143").trigger("change");
            }
            else if(protocol=="pop3s")
            {
                $("#mail_port", form).val("995").trigger("change");
            }
            else if(protocol=="pop3")
            {
                $("#mail_port", form).val("110").trigger("change");
            }
        })

        form.find("#example").change(function(){
            var val = $(this).val();
            if($(this).hasClass('binding'))return;
            if(val == "1")
            {
                $("#command", form).val("cp");
                $("#argument", form).val("{real_path};/archive/{name}");
            }
            else if(val == "2")
            {
                $("#command", form).val("mv");
                $("#argument", form).val("{real_path};/processing/new files/{name}");
            }
            else if(val == "3")
            {
                $("#command", form).val("/Applications/MyApp.app/Contents/MacOS/MyApp");
                $("#argument", form).val("{real_path}");
            }
            else if(val == "4")
            {
                $("#command", form).val("open");
                $("#argument", form).val("{real_path}");
            }
            else
            {
                $("#command, #argument", form).val("");
            }
            $("#command, #argument", form).trigger("change");
        });

        setTimeout(function(){
            form.find("#secure").change(function(){
                if($(this).val() == "true" && $(this).is(":visible"))
                {
                    form.find(".SSHOptionsHandle:visible").each(function(){
                        var url = $(this).val();
                        var itms = url.split(":");
                        itms[0] = "FTPES";
                        if(itms.length==1)
                            itms[0] = "FTPES://";
                        $(this).val(itms.join(":")).trigger("custevt").trigger("blur.form", [{password:$(this).data("password")}]);
                    });
                }
            });
        }, 500);

        form.find(".SSHOptionsHandle").each(function(){
            function change(elem)
            {
                var text = elem.val().toLowerCase();
                elem.closest("div.actionConfigPanel").find("div.advanced-options, .smbOption, .smbOnlyOption").hide();
                if(text.indexOf("http://")>=0 || text.indexOf("https://")>=0)
                {
                    elem.closest("div.actionConfigPanel").find(".httpOptions").show();
                    elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
                }
                else
                {
                    elem.closest("div.actionConfigPanel").find(".httpOptions").hide();
                }
                if(text.indexOf("webdav://")>=0 || text.indexOf("webdavs://")>=0)
                {
                    elem.closest("div.actionConfigPanel").find(".webdavOptions").show();
                    elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
                }
                else
                {
                    elem.closest("div.actionConfigPanel").find(".webdavOptions").hide();
                }
                if(text.indexOf("azure://")>=0)
                {
                    elem.closest("div.actionConfigPanel").find(".azureOptions").show();
                    elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
                }
                else
                {
                    elem.closest("div.actionConfigPanel").find(".azureOptions").hide();
                }
                if(text.indexOf("ftp://")>=0 || text.indexOf("sftp://")>=0)
                {
                    elem.closest("div.actionConfigPanel").find(".ftpSftpOptions").show();
                    elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
                }
                else
                {
                    elem.closest("div.actionConfigPanel").find(".ftpSftpOptions").hide();
                }
                if(text.indexOf("glacier://")>=0)
                {
                    elem.closest("div.actionConfigPanel").find(".glacierCredentials").show();
                    elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
                }
                else
                {
                    elem.closest("div.actionConfigPanel").find(".glacierCredentials").hide();
                }
                if(text.indexOf("ftps://")>=0 || text.indexOf("https://")>=0 || text.indexOf("webdavs://")>=0)
                {
                    elem.closest("div.actionConfigPanel").find(".sslOptions").show().find(".excludeXML").removeClass('excludeXML').addClass('tempallowXML');
                    elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
                }
                else
                {
                    elem.closest("div.actionConfigPanel").find(".sslOptions").hide().find(".tempallowXML").removeClass('tempallowXML').addClass('excludeXML');;
                }
                if(text.indexOf("smb://")==0 || text.indexOf("smb3://")==0 || text.indexOf("file:")==0 || text.indexOf("memory://")==0)
                {
                    elem.closest("div.actionConfigPanel").find(".dmzOption").hide();
                }
                else
                {
                    elem.closest("div.actionConfigPanel").find(".dmzOption").show();
                }
                if(text.indexOf("smb://")==0)
                {
                    elem.closest("div.actionConfigPanel").find(".smbOnlyOption").show();
                }
                if(text.indexOf("smb")==0)
                {
                    elem.closest("div.actionConfigPanel").find(".smbOption").show();
                }
                if(text.indexOf("smb3://")==0)
                {
                    elem.closest("div.actionConfigPanel").find(".smb3Option").show();
                    elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
                    elem.closest("div.actionConfigPanel").find(".dmzOption").show();
                }
                else
                {
                    elem.closest("div.actionConfigPanel").find(".smb3Option").hide();
                }
                if(text.indexOf("ftp://")>=0 || text.indexOf("sftp://")>=0)
                {
                    elem.closest("div.actionConfigPanel").find(".ftpSftpOptions").show();
                    elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
                }
                if(text.indexOf("ftp://")==0)
                {
                    elem.closest("div.actionConfigPanel").find(".ftpOptions").show();
                    elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
                }
                else
                {
                    elem.closest("div.actionConfigPanel").find(".ftpOptions").hide();
                }
                if(text.indexOf("hadoop://")==0)
                {
                    elem.closest("div.actionConfigPanel").find(".hadoopOptions, .hadoopOption2").show();
                    elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
                }
                else
                {
                    elem.closest("div.actionConfigPanel").find(".hadoopOptions").hide();
                }
                if(text.indexOf("box://")==0)
                {
                    elem.closest("div.actionConfigPanel").find(".boxOption").show();
                    elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
                }
                else{
                    elem.closest("div.actionConfigPanel").find(".boxOption").hide();
                }
                if(text.indexOf("ftp://")==0 || text.indexOf("ftps://")==0 || text.indexOf("ftpes://")==0)
                {
                    elem.closest("div.actionConfigPanel").find(".ftpSOptions").show();
                    if(text.indexOf("ftpes://")==0)
                        elem.closest("div.actionConfigPanel").find(".sslOptions").show().find(".excludeXML").removeClass('excludeXML').addClass('tempallowXML');;
                    if(text.indexOf("ftp://")==0)
                        elem.closest("div.actionConfigPanel").find("#secure").val("false");
                    elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
                }
                else
                {
                    elem.closest("div.actionConfigPanel").find(".ftpSOptions").hide();
                }
                if(text.indexOf("sftp://")==0 || text.indexOf("ftp://")==0 || text.indexOf("ftps://")==0 || text.indexOf("ftpes://")==0)
                {
                    elem.closest("div.actionConfigPanel").find(".allftpOptions").show();
                    elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
                }
                else
                {
                    elem.closest("div.actionConfigPanel").find(".allftpOptions").hide();
                }
                if(text.indexOf("ftps://")==0 || text.indexOf("ftpes://")==0)
                {
                    elem.closest("div.actionConfigPanel").find(".ftpesOptions").show();
                    elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
                }
                else
                {
                    elem.closest("div.actionConfigPanel").find(".ftpesOptions").hide();
                }
                if(text.indexOf("sftp://")>=0)
                {
                    elem.closest("div.actionConfigPanel").find(".sftpOptions").show();
                    elem.closest("div.actionConfigPanel").find(".nonSftpOptions").hide();
                    elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
                }
                else
                {
                    elem.closest("div.actionConfigPanel").find(".sftpOptions").hide();
                }
                if(text.indexOf("s3://")>=0 || text.indexOf("s3crush://")>=0)
                {
                    elem.closest("div.actionConfigPanel").find(".s3Credentials").show();
                    elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
                }
                else
                {
                    elem.closest("div.actionConfigPanel").find(".s3Credentials").hide();
                }
                if(text.indexOf("gstorage://")>=0){
                    // elem.closest("div.actionConfigPanel").find(".s3Credentials").show();
                    elem.closest("div.actionConfigPanel").find(".gstorageCredentials").show();
                    elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
                }
                else{
                    elem.closest("div.actionConfigPanel").find(".gstorageCredentials").hide();
                }
                if(text.indexOf("s3crush://")>=0)
                {
                    elem.closest("div.actionConfigPanel").find(".s3CrushCredentials").show();
                    elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
                }
                else
                {
                    elem.closest("div.actionConfigPanel").find(".s3CrushCredentials").hide();
                }
                if(text.indexOf("smb3://")==0 || text.indexOf("sftp://")==0){
                    elem.closest("div.actionConfigPanel").find(".sftpsmbCommonOption").show();
                }
                else{
                    elem.closest("div.actionConfigPanel").find(".sftpsmbCommonOption").hide();
                }
                if(text.indexOf("onedrive://")>=0)
                {
                    elem.closest("div.actionConfigPanel").find(".sharepointCredentials").hide();
                    elem.closest("div.actionConfigPanel").find(".onedriveCredentials, .onedriveCredentialsOnly").show();
                    elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
                }
                else
                {
                    elem.closest("div.actionConfigPanel").find(".onedriveCredentials, .onedriveCredentialsOnly").hide();
                }
                if(text.indexOf("sharepoint://")>=0)
                {
                    elem.closest("div.actionConfigPanel").find(".onedriveCredentials, .sharepointCredentials").show();
                    elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
                    elem.closest("div.actionConfigPanel").find(".onedriveCredentialsOnly").hide();
                }
                else
                {
                    elem.closest("div.actionConfigPanel").find(".sharepointCredentials").hide();
                }
                if(text.indexOf("onedrive://")>=0 || text.indexOf("sharepoint://")>=0){
                    elem.closest("div.actionConfigPanel").find(".sharepointCredentials.onedriveCredentials").show();
                }
                if(text.indexOf("sharepoint2://")>=0)
                {
                    elem.closest("div.actionConfigPanel").find(".sharepointCredentials").show();
                    elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
                    elem.closest("div.actionConfigPanel").find(".onedriveCredentialsOnly").hide();
                    elem.closest("div.actionConfigPanel").find(".allftpOptions").show();
                    elem.closest("div.actionConfigPanel").find(".sharepointCredentials.onedriveCredentials").hide();
                }
                if(text.indexOf("gdrive://")>=0)
                {
                    elem.closest("div.actionConfigPanel").find(".gdriveCredentials").show();
                    elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
                }
                if(text.indexOf("smb")>=0)
                {
                    elem.closest("div.actionConfigPanel").find(".gdriveCredentials").hide();
                    elem.closest("div.actionConfigPanel").find(".nonFileOption.smb").show();
                    elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
                }
                else{
                    elem.closest("div.actionConfigPanel").find(".nonFileOption").show();
                }
                if(text.indexOf("{")==0)
                {
                    elem.closest("div.actionConfigPanel").find(".gdriveCredentials").show();
                    elem.closest("div.actionConfigPanel").find(".s3CrushCredentials").show();
                    elem.closest("div.actionConfigPanel").find(".s3Credentials").show();
                    elem.closest("div.actionConfigPanel").find(".azureOptions").show();
                    elem.closest("div.actionConfigPanel").find(".ftpOptions").show();
                    elem.closest("div.actionConfigPanel").find(".hadoopOptions, .hadoopOption2").show();
                    elem.closest("div.actionConfigPanel").find(".ftpSOptions").show();
                    elem.closest("div.actionConfigPanel").find(".ftpesOptions").show();
                    elem.closest("div.actionConfigPanel").find(".webdavOptions").show();
                    elem.closest("div.actionConfigPanel").find(".allftpOptions").show();
                    elem.closest("div.actionConfigPanel").find(".boxOption").show();
                    elem.closest("div.actionConfigPanel").find(".dmzOption").show();
                    elem.closest("div.actionConfigPanel").find(".smbOption").show();
                    elem.closest("div.actionConfigPanel").find(".smbOnlyOption").show();
                    elem.closest("div.actionConfigPanel").find(".smb3Option").show();
                    elem.closest("div.actionConfigPanel").find(".sslOptions").show().find(".excludeXML").removeClass('excludeXML').addClass('tempallowXML');
                    elem.closest("div.actionConfigPanel").find(".sftpOptions").show();
                    elem.closest("div.actionConfigPanel").find(".httpOptions").show();
                    elem.closest("div.actionConfigPanel").find(".ftpSftpOptions").show();
                    elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
                }
                else
                {
                    elem.closest("div.actionConfigPanel").find(".gdriveCredentials").hide();
                }
                if(elem.closest("div.actionConfigPanel").find(".encryptionMode:visible").length>0)
                    elem.closest("div.actionConfigPanel").find(".encryptionMode:visible").trigger("change");

                if(controlData && controlData.name == "As2")
                {
                    elem.closest("div.actionConfigPanel").find(".noAS2").hide();
                }
            }
            $(this).bind("custevt", function(){
                change($(this));
            });
            $(this).bind("textchange", function(){
                change($(this));
            });
        });

        form.find(".httpOnly").each(function(){
            $(this).bind("textchange", function(){
                var text = $.trim($(this).val().toLowerCase());
                if(text.indexOf("{")==0 || text.indexOf("http://")>=0 || text.indexOf("https://")>=0)
                {
                    $(this).removeClass("ui-state-error").closest("p").find(".errorMsg").hide();
                }
                else
                {
                    $(this).addClass("ui-state-error").closest("p").find(".errorMsg").show();
                }
            });
        });

        form.find("#upload_blob_type").unbind().change(function(){
            var item_option_itemType = form.find("input.SSHOptionsHandle:first").val() || "";
            if((item_option_itemType.indexOf("{") == 0 || item_option_itemType.indexOf("azure") == 0) && $(this).val() == "blockblob")
            {
                form.find(".blockblob_option").show();
            }
            else
            {
                form.find(".blockblob_option").hide();
            }
        }).trigger("change");

        form.find("#findUrl").change(function(){
            var path = $(this).val();
            if(path.indexOf("{") >= 0 && path.indexOf("}") >= 0)
                return;
            if(path[path.length-1] != "/" && path[path.length-1] != "\\")
            {
                path += "/";
            }
            $(this).val(path);
        });

        form.find("#verifyHost").change(function(){
            if($(this).is(":checked"))
            {
                form.find(".onlyVerifyHost").show();
            }
            else
                form.find(".onlyVerifyHost").hide();
        }).trigger("change");

        form.find("#box_store_jwt_json").change(function(){
            if($(this).is(":checked"))
            {
                form.find(".JWT_JSON").show();
                form.find(".JWT_JSON_Reverse").hide();
            }
            else{
                form.find(".JWT_JSON").hide();
                form.find(".JWT_JSON_Reverse").show();
            }
        }).trigger("change");

        form.find("#kafka_costum_topic").change(function(){
            if($(this).is(":checked"))
            {
                form.find(".kafkaCustomTopic").show();
            }
            else
                form.find(".kafkaCustomTopic").hide();
        }).trigger("change");

        form.find("#kafka_ssl").change(function(){
            if($(this).is(":checked"))
            {
                form.find(".sslOptions").show();
            }
            else
                form.find(".sslOptions").hide();
        }).trigger("change");

        form.find("#kafka_custom_config").change(function(){
            if($(this).is(":checked"))
            {
                form.find(".nonCustom").hide();
                form.find(".customConfig").show();
            }
            else{
                form.find(".customConfig").hide();
                form.find(".nonCustom").show();
            }
        }).trigger("change");


        form.find("#internal_unzip").change(function(){
            if($(this).is(":checked"))
            {
                form.find(".forInternal").show();
            }
            else
                form.find(".forInternal").hide();
        }).trigger("change");

        setTimeout(function(){
            form.find("#gstorage_with_s3_api").change(function(){
                if($(this).is(":checked"))
                {
                    form.find(".s3Credentials").show();
                }
                else
                    form.find(".s3Credentials").hide();
            }).trigger("change");
        }, 400);

        form.find("#external_unzip").change(function(){
            if($(this).is(":checked"))
            {
                form.find(".forInternal").hide();
            }
        }).trigger("change");

        form.find(".encryptionMode").each(function(){
            $(this).bind("change", function(){
                var text = $(this).val() && $(this).val().toLowerCase();
                if(text == "true")
                {
                    $(this).closest("div.actionConfigPanel").find("div.sslOptions").show().find(".excludeXML").removeClass('excludeXML').addClass('tempallowXML');
                }
                else
                {
                    $(this).closest("div.actionConfigPanel").find("div.sslOptions").hide().find(".tempallowXML").removeClass('excludeXMLProxy').addClass('excludeXML');
                }
            });
        });

        function fixChars(val)
        {
            return val.replace(/@/g,"{at}").replace(/:/g,"{colon}").replace(/&/g,"{amp}").replace(/\?/g,"{question}").replace(/\//g,"{slash}").replace(/\\/g,"{backslash}").replace(/#/g,"{hash}").replace(/"/g,"{quote}").replace(/'/g,"{apos}").replace(/%/g,"{percent}").replace(/>/g,"{gt}").replace(/</g,"{lt}").replace(/\+/g,"%2B");
        }

        form.find(".maskPasswordOnURL").each(function(){
            $(this).bind("focus.form", function(){
                if($(this).hasClass('urlWithParams')){
                    if($(this).data("originalURL")){
                        $(this).val($(this).data("originalURL"));
                    }
                }
            }).unbind("blur.form").bind("blur.form", function(){
                $(this).trigger("applymask");
            }).unbind("applymask").bind("applymask", function(evt, evtData){
                var data = $.extend(true, {}, taskDesigner.openFormControlData);
                if(!data)return;
                var elem = $(this);
                var value = $(this).val();
                var origVal = value + "";
                try{
                    var urlArray = value.split(":");
                    if(urlArray && urlArray.length>2 && urlArray[2].indexOf("@")>0)
                    {
                        var psArray = urlArray[2].split("@");
                        if(value.toLowerCase().indexOf("file://")!=0){
                            psArray[0] = fixChars(psArray[0]);
                        }
                        urlArray[2] = psArray.join("@");
                        var tempURL = urlArray.join(":");
                        value = tempURL;
                        if(origVal.indexOf("}")>=0 && !origVal.endsWith("/") && value.endsWith("/")){
                            value = value.substr(0, value.length-1);
                        }
                        $(this).val(value);
                    }
                }catch(ex){console.log(ex);}
                if(value.indexOf("{") == 0){
                    if(elem.hasClass('urlWithParams')){
                        $(this).data("realURL",  decodeURIComponent(getFullURLWithParams($(this).val(), elem.data("urlParams")) || "", elem.data("password")));
                        elem.data("originalURL", decodeURIComponent(value));
                    }
                    return;
                }
                var url = value;
                var calcPass = false;
                try{
                    url = URI(value);
                }catch(ex){
                    url = URI(encodeURI(value));
                }
                var urlParams = getParamsFromURL($(this).val()) || {};
                if(elem.hasClass('urlWithParams') && Object.keys(urlParams.params).length != 0){
                    elem.data("urlParams", urlParams.params);
                    url.port(urlParams.port);
                    if(elem.is("#ssh_private_key")){
                       var advPnl = elem.closest(".advanced-options-content");
                       advPnl.find("#timeout").val(urlParams.params.timeout);
                       advPnl.find("#read_timeout").val(urlParams.params.read_timeout);
                       advPnl.find("#write_timeout").val(urlParams.params.write_timeout);
                    }
                }
                if(elem.hasClass('urlWithParams')){
                    $(this).data("realURL",  decodeURIComponent(getFullURLWithParams($(this).val(), elem.data("urlParams")) || "", elem.data("password")));
                    elem.data("originalURL", decodeURIComponent(url.toString()));
                }
                if(value.toLowerCase().indexOf("file://")!=0 && url)
                {
                    var pass = calcPass || url.password();
                    if(evtData){
                        pass = evtData.password;
                        elem.data("password", pass);
                    }
                    var mask = false;
                    var existingPass = elem.data("password");
                    if(pass != existingPass)
                    {
                        if(existingPass)
                        {
                            mask = new Array(existingPass.length+1).join('*');
                        }
                        if(existingPass && pass == mask)
                            pass = existingPass;
                        else
                            mask = new Array(pass.length+1).join('*');
                        if(!value.toLowerCase().startsWith("file:/"))
                        {
                            elem.data("password", pass);
                            url.password(mask);
                            var _val = url.toString();
                            // if(value.length!=unescape(_val).length)
                            //     _val = _val.substr(0, _val.length-1);
                            if(value.endsWith("?"))
                                _val = _val + "?";
                            if(origVal.indexOf("}")>=0 && !origVal.endsWith("/") && _val.endsWith("/")){
                                _val = _val.substr(0, _val.length-1);
                            }
                            elem.val(decodeURIComponent(_val));
                        }
                    }
                    else
                    {
                        pass = existingPass;
                        mask = new Array(pass.length+1).join('*');
                        url.password(mask);
                        var _val = url.toString();
                        // if(value.length!=unescape(_val).length)
                        //     _val = _val.substr(0, _val.length-1);
                        if(value.endsWith("?"))
                            _val = _val + "?";
                        if(origVal.indexOf("}")>=0 && !origVal.endsWith("/") && _val.endsWith("/")){
                            _val = _val.substr(0, _val.length-1);
                        }
                        try{
                            elem.val(decodeURIComponent(_val));
                        }
                        catch(ex){
                            elem.val(_val);
                        }
                    }
                    url.password(pass);
                    var _val = url.toString();
                    if(origVal.indexOf("}")>=0 && !origVal.endsWith("/") && _val.endsWith("/")){
                        _val = _val.substr(0, _val.length-1);
                    }
                    if(value.length!=unescape(_val).length)
                        _val = _val.substr(0, _val.length-1);
                    try{
                        data[$(this).attr("id")] = decodeURIComponent(_val);
                    }
                    catch(ex){
                        data[$(this).attr("id")] = _val;
                    }
                }
                else{
                    try{
                        data[$(this).attr("id")] = decodeURIComponent(value);
                    }
                    catch(ex){
                        data[$(this).attr("id")] = value;
                    }
                }
            });
        });

        $("a.serverFilePickTestButton", form).each(function(){
            $(this).unbind("click").click(function(evt){
                evt.stopPropagation();
                evt.preventDefault();
                var curElem = $(this);
                var urlField = $("#" + curElem.attr("rel"), form);
                var pathToVerify = $.trim(urlField.val());
                var isCacheFolder = curElem.attr("rel") == "cache_folder";
                function getFileExtension(filename) {
                    var ext = /^.+\.([^.]+)$/.exec(filename);
                    return ext == null ? "" : ext[1].toLowerCase();
                }
                var extension = getFileExtension(pathToVerify);
                var _fileName;
                if(extension){
                    _fileName = pathToVerify.substring(pathToVerify.lastIndexOf("/")+1);
                    if(_fileName.startsWith("{") && _fileName.indexOf("}")>=0){
                        _fileName = "";
                    }
                    pathToVerify = pathToVerify.substring(0, pathToVerify.lastIndexOf("/"));
                }
                if(urlField.hasClass("maskPasswordOnURL"))
                {
                    var elem = urlField;
                    if(urlField.hasClass("urlWithParams")){
                        pathToVerify = decodeURIComponent(elem.data("realURL"));
                    }
                    else{
                        var curVal = elem.val();
                        var attrID = elem.attr("id");
                        var isFILE = curVal.toLowerCase().indexOf("file:/") == 0;
                        if(curVal && curVal.indexOf(":")<0)
                            isFILE = true;
                        if(!isFILE)
                        {
                            var value = elem.val();
                            var url = value;
                            try{
                                url = URI(value);
                            }catch(ex){
                                url = URI(encodeURI(value));
                            }
                            if(url)
                            {
                                var pass = elem.data("password");
                                if(pass)
                                {
                                    url.password(pass);
                                }
                                else
                                {
                                    url.password("");
                                }

                                var urlPath = url.path();
                                var paths = urlPath.split("/").removeByVal("");
                                var pathToAdd = [];
                                for (var i = 0; i < paths.length; i++) {
                                    var curItem = paths[i];
                                    if(curItem && curItem.indexOf("{") >=0 && curItem.indexOf("{")>=0){
                                        i = paths.length + 1;
                                    }
                                    else{
                                        pathToAdd.push(curItem);
                                    }
                                }

                                if(pathToAdd && pathToAdd.length>0){
                                    pathToAdd.splice(0,0,"");
                                    pathToAdd.push("");
                                    url.path(pathToAdd.join('/'));
                                }
                                else{
                                    url.path("");
                                }

                                var _val = url.toString();
                                if(unescape(_val).length>value.length)
                                    _val = _val.substr(0, _val.length-1);
                                if(curVal.endsWith("?"))
                                    _val = _val + "?";
                                pathToVerify = decodeURIComponent(_val);
                            }
                        }
                        else
                        {
                            var url = elem.val();
                            if(!elem.hasClass("notForcedURL") && url && url.indexOf(":")<0 && url.indexOf("{")!=0)
                            {
                                url = "FILE:/" + elem.val();
                            }
                            pathToVerify = decodeURIComponent(url);
                        }
                    }

                }
                if(!urlField.hasClass("urlWithParams") && curElem.attr("isfile"))
                {
                    if(pathToVerify.toLowerCase().indexOf("file:/")!=0)
                        pathToVerify = "FILE:/" + pathToVerify;
                }
                if(isCacheFolder){
                    if(pathToVerify && pathToVerify.indexOf(":")<0 && pathToVerify.indexOf("{")!=0)
                    {
                        pathToVerify = "FILE:/" + pathToVerify;
                    }
                }
                if(!pathToVerify){
                    crushFTP.UI.growl("Nothing to validate", "Please enter valid path to verify", false, 3000);
                    return false;
                }
                else{
                    // adminPanel.data.buildXMLToSubmitForm();
                    var ignored = $(".advanced-options", "#taskFormDialog").find(".ignoreBind").removeClass("ignoreBind");
                    var itemProperties = adminPanel.data.buildXMLToSubmitForm($(".advanced-options", "#taskFormDialog"), true);
                    ignored.addClass('ignoreBind');
                    // if(!pathToVerify.endsWith("/"))
                    //     pathToVerify = pathToVerify + "/";
                    var suggestions = $(".suggested", "#taskFormDialog").find("#suggestedSettingsUsed").find("li");
                    if(suggestions && suggestions.length>0){
                        suggestions.each(function(){
                            if($(this).attr("key")){
                                itemProperties += "<"+$(this).attr("key")+">"+$(this).attr("_value")+"</"+$(this).attr("key")+">";
                            }
                        });
                    }
                    itemProperties += "<url>"+pathToVerify+"</url>";
                    itemProperties += "<name>Test</name>";
                    var useDMZ = $("#use_dmz", "#taskFormDialog").val() || "";
                    itemProperties += "<use_dmz>"+useDMZ+"</use_dmz>";
                    var urlPath = URI(pathToVerify).path() || "/";
                    if(urlPath && urlPath.indexOf("{") >=0 && urlPath.indexOf("{")>=0)
                    {
                        jPrompt("Please enter path to use : ", urlPath, "Input", function(val, key, extraItemVal, extVals){
                            urlPath = val;
                            itemProperties += "<path>"+urlPath+"</path>";
                            taskDesigner.data.verifyServerPath("DIR", itemProperties, "Test", false, _fileName);
                        });
                        return false;
                    }
                    itemProperties += "<path>"+urlPath+"</path>";
                    taskDesigner.data.verifyServerPath("DIR", itemProperties, "Test", false, _fileName);
                }
                return false;
            });
        });

        $("a.testPGPButton", form).each(function () {
            $(this).testPGPButton();
        });

        $("#getRefreshToken", form).click(function(){
            // var google_client_id = $.trim($("#google_client_id", form).val());
            // var google_client_secret = $.trim($("#google_client_secret", form).val());
            // if(!google_client_id){
            //     alert("Please enter Google Client ID");
            //     $("#google_client_id", form).focus();
            //     return false;
            // }
            // if(!google_client_secret){
            //     alert("Please enter Google Client Secret");
            //     $("#google_client_secret", form).focus();
            //     return false;
            // }
            // var googldId = google_client_id + "~" + google_client_secret;
            taskDesigner.refreshGoogleToken(form, $("#mail_user", form).val(), function(code, userName){
                $("#mail_pass", form).val(code).trigger("textchange");
                $("#mail_pass", form).trigger("blur");
                if($("#mail_user", form).is(":visible")){
                    $("#mail_user", form).val(userName);
                }
                else if($("#smtp_user", form).is(":visible")){
                    $("#smtp_user", form).val(userName)
                }
            });
            return false;
        })

        $("#getRefreshTokenSMTP", form).click(function(){
            // var googldId = $.trim($("#smtp_user", form).val());
            // if(!googldId){
            //     alert("Please enter Google Username");
            //     $("#smtp_user", form).focus();
            //     return false;
            // }
            taskDesigner.refreshGoogleToken(form, $("#smtp_user", form).val(), function(code, userName){
                $("#smtp_pass", form).val(code).trigger("textchange");
                $("#smtp_pass", form).trigger("blur");
                if($("#mail_user", form).is(":visible")){
                    $("#mail_user", form).val(userName);
                }
                else if($("#smtp_user", form).is(":visible")){
                    $("#smtp_user", form).val(userName)
                }
            });
            return false;
        });

        $("#getMSRefreshToken", form).click(function(){
            var userName = $("#smtp_user", form).val();
            var popImap = $(this).hasClass('popImap');
            var _name = "";
            var _secret = "";
            var _tenant = "";
            if(userName && userName.indexOf("~")>1){
                var vals = userName.split("~");
                _name = (vals.length>1) ? vals[1] : vals[0];
            }
            jPrompt("Client ID: ", _name, "Please enter OneDrive/Sharepoint Oauth", function(value, other, pass, tenant){
                if(value)
                {
                    value = value.split("~")[0];
                    crushFTP.data.encryptPass(pass, function(data){
                        if(data)
                        {
                            generatedPass = unescape(data.response[0].text);
                            taskDesigner.refreshMSToken(form, value, generatedPass, tenant[1] || "common", popImap);
                        }
                    });
                }
            }, false, false, {
                appendAfterInput : '<p><label for="ms_client_secret" style="display:block;">Client Secret: </label> <input type="password" placeholder="" class="extraItem" id="ms_client_secret" value="'+_secret+'" name="ms_client_secret" style="width: 500px;margin-top: 6px;" /></p><p><label for="ms_tenant" style="display:block;">Tenant: </label> <input type="text" placeholder="" class="extraItem" id="ms_tenant" value="'+_tenant+'" name="ms_tenant" style="width: 500px;margin-top: 6px;" /></p>',
                prependBeforeInput: '<span class="ui-state-highlight ui-corner-all googleSMTPOptions" style="padding:3px;display:inline-block;margin:0px 3px;width:auto;position: absolute;top: 30px;right:15px;"><span style="float: left; margin-right: 0.3em;" class="ui-icon ui-icon-info"></span><span><a target="_blank" href="https://www.crushftp.com/crush9wiki/Wiki.jsp?page=OneDrive%20Integration">Learn more : OneDrive Integration</a></span></span>'
            });
            return false;
        });

        $("#getMSAdminConsent", form).click(function(){
            var baseURL = window.location.protocol + "//" + window.location.host + "/";
            var curURL = encodeURIComponent(baseURL) + "register_microsoft_graph_api/";
            jPrompt("Client ID: ", "", "Please enter Client information", function(_ms_client_id, other, _tenant){
                _tenant = _tenant || "common";
                if(_ms_client_id && _tenant)
                {
                    taskDesigner.getMSConsent(form, _ms_client_id, _tenant || "common");
                }
            }, false, false, {
                appendAfterInput : '<p><label for="ms_tenant" style="display:block;">Tenant: </label> <input type="text" placeholder="" class="extraItem" id="ms_tenant" value="" name="ms_tenant" style="width: 500px;margin-top: 6px;" /></p>',
                prependBeforeInput: '<span class="ui-state-highlight ui-corner-all googleSMTPOptions" style="padding:3px;display:inline-block;margin:0px 3px;width:auto;position: absolute;top: 30px;right:15px;"><span style="float: left; margin-right: 0.3em;" class="ui-icon ui-icon-info"></span><span><a target="_blank" href="https://www.crushftp.com/crush10wiki/Wiki.jsp?page=MicrosoftMails">Learn more</a></span></span>'
            });
            return false;
        });

        $("#testMSAdminConsent", form).click(function(){
            form.block({
                message:  'Please Wait..',
                css: {
                    border: 'none',
                    padding: '10px 10px',
                    backgroundColor: '#000',
                    '-webkit-border-radius': '10px',
                    '-moz-border-radius': '10px',
                    opacity: .5,
                    color: '#fff',
                    'text-align':'left'
                }
            });
            var obj = {
                command : "testMicrosoftMail",
                ms_mails_client_id : encodeURIComponent($("#ms_mails_client_id", form).val()) || "",
                ms_mails_client_secret : encodeURIComponent($("#ms_mails_client_secret", form).val()) || "",
                ms_mails_tenant : encodeURIComponent($("#ms_mails_tenant", form).val()) || "",
                ms_mails_download_url : encodeURIComponent($("#ms_mails_download_url", form).data("realURL")) || ""
            };

            crushFTP.data.serverRequest(obj, function(msg){
                form.unblock();
                crushFTP.UI.growl("Testing Auth", crushFTP.methods.htmlEncode(decodeURIComponent($(msg).text())), false, false);
            });
            return false;
        });

        $("a.serverFilePickWithParamsButton", form).each(function(){
            $(this).unbind("click").click(function(){
                var curElem = $(this);
                var rel = curElem.attr("rel");
                var refElem = $("#" + rel, form);
                var pickingFor = curElem.parent().parent().parent().find("label[for='"+rel+"']").text() || "";
                pickingFor = $.trim(pickingFor).replace(":", "");
                var labelName = refElem.val() || "";
                var advancedBrowse = true;
                var existingData = refElem.data("urlParams") || {};
                var curPath = refElem.val();
                if(refElem.hasClass('maskPasswordOnURL')){
                    curPath = refElem.data("realURL") || refElem.val();
                }
                // curPath = getFullURLWithParams(curPath, existingData);
                var note = false;
                if(labelName.length>0)
                {
                    var text = labelName;
                    try{
                        var url = URI(text);
                        var pass = url.password();
                        if(url && pass)
                        {
                            var mask = new Array(pass.length+1).join('*');
                            url.password(mask);
                            text = unescape(url.toString());
                        }
                    }catch(ex){}
                    note = "Current selected directory : " + text;
                }
                if(!existingData.timeout || typeof existingData.timeout == "undefined")
                {
                    existingData.timeout = "20000";
                }
                if(!existingData.write_timeout || typeof existingData.write_timeout == "undefined")
                {
                    existingData.write_timeout = "20000";
                }
                if(!existingData.read_timeout || typeof existingData.read_timeout == "undefined")
                {
                    existingData.read_timeout = "20000";
                }
                if(!existingData.onedriveTenant || typeof existingData.onedriveTenant == "undefined")
                {
                    existingData.onedriveTenant = "common";
                }
                if(typeof existingData.sharepoint_site_drive_name == "undefined")
                {
                    existingData.sharepoint_site_drive_name = "Documents";
                }
                delete existingData.path;
                if(curPath){
                    existingData.url = existingData[refElem.attr("id")] = getURLWithoutParams(curPath);
                }
                curElem.crushFtpLocalFileBrowserPopup({
                    type : curElem.attr("PickType") || 'dir',
                    pickingFor: pickingFor,
                    file_mode : advancedBrowse ? "server" : curElem.attr("FileMode") || 'server',
                    note : note,
                    existingData : existingData || {},
                    urlWithParams: true,
                    existingVal : "/",
                    allowRootSelection : advancedBrowse,
                    isFTPBrowse : advancedBrowse,
                    callback : function(selectedPath){
                        $("#" + curElem.attr("rel"), form).val(selectedPath).removeData("urlParams").trigger('applymask');
                    }
                });
                return false;
            });
        });

        $("a.serverFilePickButton", form).each(function(){
            $(this).unbind("click").click(function(){
                var curElem = $(this);
                var rel = curElem.attr("rel");
                var pickingFor = curElem.parent().parent().parent().find("label[for='"+rel+"']").text() || "";
                pickingFor = $.trim(pickingFor).replace(":", "");
                var obj = {
                    type : curElem.attr("PickType") || 'dir',
                    existingVal : $.trim($("#" + rel, form).val()),
                    pickingFor: pickingFor,
                    callback : function(selectedPath, ftpServerInfo){
                        var type = taskDesigner.openFormControlData.type.toLowerCase();
                        var toAppend = (type === 'copy' || type === 'move') ? '{name}' : '';
                        var rel = curElem.attr("rel");
                        if(ftpServerInfo)
                        {
                            if(typeof ftpServerInfo[rel] != "undefined"){
                                if(ftpServerInfo[rel] != ftpServerInfo["url"])
                                    ftpServerInfo[rel] = ftpServerInfo["url"] + "";
                            }
                            selectedPath = selectedPath.replace("/home", "");
                            var isUNC = ftpServerInfo.path.indexOf("//") == 0;
                            if(ftpServerInfo.url.lastIndexOf("/") == ftpServerInfo.url.length-1 && selectedPath.indexOf("/")==0)
                            {
                                selectedPath = selectedPath.substr(1, selectedPath.length);
                            }
                            var path = ftpServerInfo.url + selectedPath;
                            if(isUNC && ftpServerInfo.url.indexOf("{")!=0){
                                if(!ftpServerInfo.url.toLowerCase().startsWith("file://")){
                                    if(ftpServerInfo.url.startsWith("/"))
                                        path = "FILE:/" + ftpServerInfo.url;
                                    else
                                        path = "FILE://" + ftpServerInfo.url;
                                }
                            }
                            if(path.indexOf("{")<0 && path.indexOf("}")<0)
                                ftpServerInfo[rel] = path + toAppend;
                            var taskForm = taskDesigner.formDialog;
                            var ignored = taskForm.find(".ignoreBind").removeClass("ignoreBind");
                            var tempControlData = $.extend(true, {}, taskDesigner.openFormControlData);
                            tempControlData = $.extend(tempControlData, ftpServerInfo);
                            if(tempControlData.use_dmz.indexOf("socks://") == 0 || tempControlData.use_dmz.indexOf("internal://") == 0 || tempControlData.use_dmz.indexOf("variable") == 0)
                            {
                                taskDesigner.formDialog.find("#use_dmz").find("option[_rel='custom']").attr("value", tempControlData.use_dmz).text(tempControlData.use_dmz + " (custom)");
                            }
                            window.applyingChanges = true;
                            adminPanel.data.bindValuesFromJson(taskForm, tempControlData);
                            if(tempControlData.use_dmz == "false" || tempControlData.use_dmz == "")
                            {
                                taskDesigner.formDialog.find("#use_dmz").find("option:first").attr("selected", "selected");
                            }
                            window.applyingChanges = false;
                            taskForm.find(".SSHOptionsHandle").trigger("textchange");
                            taskForm.find(".encryptionMode").trigger("change");
                            ignored.addClass("ignoreBind");
                            setTimeout(function(){
                                taskForm.find(".SSHOptionsHandle").trigger("textchange");
                                taskForm.find(".maskPasswordOnURL").trigger("blur");
                                $(".maskPasswordOnURL:visible").trigger("custevt");
                                taskDesigner.formDialog.find("#gstorage_with_s3_api").trigger("change");
                            }, 100);
                            taskDesigner.formDialog.find(".sftp-suggested-settings").suggestedSettings({
                                suggestions : configSuggestions.sftp,
                                existing: ftpServerInfo
                            });
                        }
                        else{
                            if(rel == "save_result_file")
                            {
                                function getFileExtension(filename) {
                                    var ext = /^.+\.([^.]+)$/.exec(filename);
                                    return ext == null ? "" : ext[1].toLowerCase();
                                }
                                var isFile = getFileExtension(selectedPath).length>0;
                                if(!isFile)
                                {
                                    const regex = /\{[^}]+\}/g;
                                    if(!regex.test(selectedPath))
                                    {
                                        if(selectedPath.lastIndexOf("/") == selectedPath.length-1)
                                            selectedPath += "response.txt";
                                        else
                                            selectedPath += "/response.txt";
                                    }
                                }
                            }
                            if(selectedPath.indexOf("{")<0 && selectedPath.indexOf("}")<0)
                                $("#" + rel, form).val(selectedPath + toAppend).trigger("change");
                            else
                                $("#" + rel, form).val(selectedPath).trigger("change");
                        }
                    }
                };
                if($(this).hasClass("ftpBrowse") && $(this).closest(".actionConfigPanel").length>0)
                {
                    obj.isFTPBrowse = true;
                    var pluginDetails = taskDesigner.formDialog;
                    function generateFormData(){
                        var openFormCrushTask = taskDesigner.openFormCrushTask;
                        var data = taskDesigner.openFormControlData;
                        pluginDetails.find("input, select, textarea").each(function(){
                            if(data)
                            {
                                if($(this).attr("id") == "modified_comparison_newer" && $(this).is(":checked"))
                                {
                                    data["modified_comparison"] = "new";
                                }
                                else if($(this).attr("id") == "modified_comparison_older" && $(this).is(":checked"))
                                {
                                    data["modified_comparison"] = "old";
                                }
                                else if($(this).attr("id") == "cache_mode_read" && $(this).is(":checked"))
                                {
                                    data["cache_mode"] = "read";
                                }
                                else if($(this).attr("id") == "cache_mode_write" && $(this).is(":checked"))
                                {
                                    data["cache_mode"] = "write";
                                }
                                else if($(this).hasClass("maskPasswordOnURL"))
                                {
                                    var elem = $(this);
                                    var curVal = elem.val();
                                    var attrID = elem.attr("id");
                                    if(elem.hasClass("urlWithParams")){
                                        data[attrID] = decodeURIComponent(elem.data("realURL"));
                                    }
                                    else{
                                        var isFILE = curVal.toLowerCase().indexOf("file:/") == 0;
                                        if(curVal && curVal.indexOf(":")<0)
                                            isFILE = true;
                                        if(!isFILE)
                                        {
                                            var value = curVal;
                                            var url = value;
                                            try{
                                                url = URI(value);
                                            }catch(ex){
                                                url = URI(encodeURI(value));
                                            }
                                            if(url)
                                            {
                                                var pass = elem.data("password");
                                                if(pass)
                                                {
                                                    url.password(pass);
                                                    var _val = url.toString();
                                                    if(value.length!=unescape(_val).length)
                                                        _val = _val.substr(0, _val.length-1);
                                                    data[attrID] = decodeURIComponent(_val);
                                                }
                                                else
                                                {
                                                    var _val = url.toString();
                                                    if(value.length!=unescape(_val).length)
                                                        _val = _val.substr(0, _val.length-1);
                                                    data[attrID] = decodeURIComponent(_val);
                                                }
                                            }
                                        }
                                        else
                                        {
                                            var url = curVal;
                                            if(url && url.indexOf(":")<0)
                                            {
                                                if(!elem.hasClass("notForcedURL") && elem.val().indexOf("{")!=0)
                                                    url = "FILE:/" + elem.val();
                                                else
                                                    url = elem.val();
                                            }
                                            data[attrID] = decodeURIComponent(url);
                                        }
                                    }

                                    if(attrID == curElem.attr("rel"))
                                    {
                                        obj.existingVal = data[attrID];
                                    }
                                }
                                else
                                {
                                    var recName = $(this).attr("recName");
                                    if(data.type == "FileParser" && (recName == "column_name" || recName == "column_size" || recName == "column_index"))
                                    {
                                        taskDesigner.buildFileParserColumns(pluginDetails);
                                    }
                                    else
                                    {
                                        var isBool = $(this).attr("type") == "radio" || $(this).attr("type") == "checkbox";
                                        data[$(this).attr("id")] = isBool ? $(this).is(":checked").toString() : $(this).val();
                                    }
                                }
                                taskDesigner.previewSnippet(openFormCrushTask.closest(".crushTaskItem"));
                            }
                        });
                        var suggestions = pluginDetails.find(".suggested:visible").find("#suggestedSettingsUsed").find("li");
                        if(suggestions && suggestions.length>0){
                            suggestions.each(function(){
                                data[$(this).attr("key")] = $(this).attr("_value");
                            });
                        }
                        obj.existingData = data;
                        obj.allowRootSelection = true;
                        curElem.crushFtpLocalFileBrowserPopup(obj);
                    }
                    if(pluginDetails.find(".hasPendingCall").length>0)
                    {
                        window.pendingEncryptionCall = function(){
                            generateFormData();
                        };
                        pluginDetails.find(".hasPendingCall").trigger("blur");
                    }
                    else
                    {
                        generateFormData();
                    }
                }
                else
                {
                    curElem.crushFtpLocalFileBrowserPopup(obj);
                }
                return false;
            });
        });

        $("a#testSettings", form).click(function(){
            var link = $(this);
            if(link.attr("disabled"))return false;
            if(form.find(".hasPendingCall").length>0)
            {
                window.pendingEncryptionCall = function(){
                    link.trigger("click");
                };
                form.find(".hasPendingCall").trigger("blur");
            }
            else
            {
                var obj = {
                    command : "testDB",
                    db_driver_file : encodeURIComponent($("#db_driver_file", form).val()) || "",
                    db_driver : encodeURIComponent($("#db_driver", form).val()) || "",
                    db_url : encodeURIComponent($("#db_url", form).val()) || "",
                    db_user : encodeURIComponent($("#db_user", form).val()) || "",
                    db_pass : encodeURIComponent($("#db_pass", form).val()) || ""
                };
                $("a#testDBSearch", form).block({
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
                }).attr("disabled", "disabled");

                crushFTP.data.serverRequest(obj, function(msg){
                    $("a#testDBSearch", form).unblock().removeAttr("disabled");
                    crushFTP.UI.growl("Testing Database", crushFTP.methods.htmlEncode(decodeURIComponent($(msg).text())), false, false);
                });
            }
            return false;
        });

        var delimiter = $("#delimiter", form).change(function(){
            if($(this).val() == "fixed")
            {
                form.find(".fixedTypeOptions").show();
                form.find(".otherTypeOptions").hide().find("#header_names").val("").trigger("change");
                crushFTP.UI.checkUnchekInput($("#column_headers", form), false);
                $("#column_headers", form).trigger("change").attr("disabled", "disabled").closest("p").addClass("ui-state-disabled");
            }
            else
            {
                form.find(".fixedTypeOptions").hide();
                form.find(".otherTypeOptions").show();
                $("#column_headers", form).trigger("change").removeAttr("disabled").closest("p").removeClass("ui-state-disabled");
            }
        });

        $("#column_headers", form).change(function(){
            if($(this).is(":checked"))
            {
                $(".multipleColumnOptions", form).find(".indexOfColumn").hide().end().find(".column_index").show().end().find(".moveItemUp, .moveItemDown").hide();
                taskDesigner.showIndexForFileParserColumns(form);
            }
            else
            {
                $(".multipleColumnOptions", form).find(".indexOfColumn").show().end().find(".column_index").hide().end().find(".moveItemUp, .moveItemDown").show();
                 taskDesigner.showIndexForFileParserColumns(form);
            }
            setTimeout(function(){
                taskDesigner.buildFileParserColumns(form);
            },100);
        });
        taskDesigner.buildFileParserColumns(form);
        focusTip(form);
    },
    bindFileParserInputEvents : function(elem)
    {
        if(!elem)return;
        $(elem).find("input").unbind("textchange").bind("textchange", function(){
            taskDesigner.buildFileParserColumns(elem);
        });
    },
    buildFileParserColumns  : function(form){
        var form = $("#taskFormDialog");
        if(form && form.find(".fileParserColumns").length>0)
        {
            var delimiter = $("#delimiter", form);
            var columns =[];
            var isFixed = delimiter.val() == "fixed";
            var column_headers = $("#column_headers", form).is(":checked");
            $(".ui-state-error", $(".multipleColumnOptions", form)).removeClass("ui-state-error");
            $(".multipleColumnOptions:visible", form).each(function(_index){
                var column_name = $(".column_name", $(this)).val();
                var index = _index + 1;
                if(column_name && column_name.length>0)
                {
                    if(isFixed)
                    {
                        var column_size = $.trim($(".column_size", $(this)).val());
                        if(!crushFTP.methods.isNumeric(column_size) || column_size.length==0)
                        {
                            $(".column_size", $(this)).addClass("ui-state-error");
                        }
                        else
                            columns.push(index+":"+column_name+":"+column_size);
                    }
                    else
                    {
                        if(column_headers)
                        {
                            index = $.trim($(this).find(".column_index").val());
                            if(!crushFTP.methods.isNumeric(index) || index.length==0)
                            {
                                $(".column_index", $(this)).addClass("ui-state-error");
                            }
                            else
                                columns.push(index+":"+column_name);
                        }
                        else
                            columns.push(index+":"+column_name);
                    }
                }
            });
            if(columns && columns.length>0)
                $("#column_override", form).val(columns.join(",")).trigger("change");
            else
                $("#column_override", form).val("").trigger("change");
            if(!column_headers && $("#column_override", form).val().length==0)
            {
                $("#fileParserColumnError", form).show();
            }
            else
                $("#fileParserColumnError", form).hide();
        }
    },
    showIndexForFileParserColumns : function(form)
    {
        var visibleCols = $(".multipleColumnOptions:visible", form).each(function(index){
            var _index = index+1;
            $(this).find(".indexOfColumn").text(_index);
            if($(this).find(".column_index").val().length==0)
                $(this).find(".column_index").val(_index);
        });
        visibleCols.find(".moveItemUp.disabled, .moveItemDown.disabled").removeClass("disabled");
        $(".multipleColumnOptions:visible:first", form).find(".moveItemUp").addClass("disabled");
        $(".multipleColumnOptions:visible:last", form).find(".moveItemDown").addClass("disabled");
        if($(".multipleColumnOptions:visible", form).length==0)
            $(".multipleColumnOptions", form).show().find("input").val("");

        var column_headers = $("#column_headers", form).is(":checked");
        if(!column_headers && $("#column_override", form).val().length==0)
        {
            $("#fileParserColumnError", form).show();
        }
        else
            $("#fileParserColumnError", form).hide();
    },
    highlightJoins : function(connectionPoint)
    {
        var _type = connectionPoint.attr("_type");
        var curParentUID = connectionPoint.closest(".canvasPortlet").attr("uid");
        var hasConnections = false;
        taskDesigner.canvas.find(".crushTaskItem, .crushEndActionItem").filter(":not(.miniature)").each(function(){
            var _uid = $(this).attr("uid");
            if(_uid != curParentUID && !taskDesigner.data.hasConnection(curParentUID, _type, _uid))
            {
                if(_type == "start" && $(this).hasClass("crushEndActionItem"))
                    return;
                var color = _type == "failure" ? "error" : "success";
                if(_type=="start")
                    color = "focus";
                $(this).addClass("ui-state-focus attachConnection").glowTaskItem(color);
                if($(this).is(".crushTaskItem"))
                    hasConnections = true;
            }
        });
        if(hasConnections)
            crushFTP.UI.growl("Choose Connection", "Now select the destination for selected action", false, 3000);
        else
        {
            crushFTP.UI.growl("Add task", "No other task available to add connection", true, 3000);
            if(taskDesigner.canvas.find(".attachConnection").length==0)
                connectionPoint.trigger("click");
        }
    },
    drawLine : function(div1, div2, flag, onlyDraw, _color, dashstyle, label, canvas)
    {
        canvas = canvas || taskDesigner.canvas;
        if(div1.length==0 || div2.length==0)return;
        var sourceID = div1.closest(".canvasPortlet").attr("uid");
        var targetID = div2.attr("uid");
        if(div1.closest(".canvasPortlet").hasClass("crushStartActionItem") && div2.hasClass("crushEndActionItem"))
        {
            return false;
        }
        if(sourceID == targetID)
        {
            return false;
        }
        var isJumpTask = false;
        var isJumpFail = false;
        if(!onlyDraw)
        {
            if(flag == "start")
            {
                var startConnections = taskDesigner.data.startConnections;
                if(!startConnections)
                    startConnections = taskDesigner.data.startConnections = [];

                if(startConnections.has(targetID))
                {
                    crushFTP.UI.growl("Error", "Connection to same task exists", true, 3000);
                    return false;
                }
            }
            else
            {
                var sourceInformation = taskDesigner.data.get(sourceID);
                if(sourceInformation.type == "Jump" && flag == "true")
                {
                    var existingConnections = jsPlumb.getConnections();
                    for (var i = 0; i < existingConnections.length; i++) {
                        var connection = existingConnections[i];
                        if(connection._sourceID == sourceID && connection._type == flag)
                        {
                            if(!connection._isDeleted && connection.isDetachable())
                                jsPlumb.detach(connection);
                            connection._isDeleted = true;
                        }
                    };
                    sourceInformation.jump_task_id = targetID;
                    isJumpTask = true;
                    if(div1.hasClass('breakPoint') && !div2.hasClass('taskJumpTrueActionPoint'))
                    {
                        div2 = div2.closest(".crushTaskItem").find(".taskJumpTrueActionPoint");
                    }

                    if(div2.hasClass('breakPoint') && !div1.hasClass('taskJumpTrueActionPoint'))
                    {
                        div1 = div1.closest(".crushTaskItem").find(".taskJumpTrueActionPoint");
                    }
                }
                else if(sourceInformation.type == "Jump" && flag == "jumpfail")
                {
                    var existingConnections = jsPlumb.getConnections();
                    for (var i = 0; i < existingConnections.length; i++) {
                        var connection = existingConnections[i];
                        if(connection._sourceID == sourceID && connection._type == flag)
                        {
                            if(!connection._isDeleted && connection.isDetachable())
                                jsPlumb.detach(connection);
                            connection._isDeleted = true;
                        }
                    };
                    sourceInformation.jump_false_task_id = targetID;
                    isJumpFail = isJumpTask = true;
                    if(div1.hasClass('breakPoint') && !div2.hasClass('taskJumpFalseActionPoint'))
                    {
                        div2 = div2.closest(".crushTaskItem").find(".taskJumpFalseActionPoint");
                    }

                    if(div2.hasClass('breakPoint') && !div1.hasClass('taskJumpFalseActionPoint'))
                    {
                        div1 = div1.closest(".crushTaskItem").find(".taskJumpFalseActionPoint");
                    }
                }
                else if(sourceInformation.type == "UsersList" && flag == "true")
                {
                    var existingConnections = jsPlumb.getConnections();
                    for (var i = 0; i < existingConnections.length; i++) {
                        var connection = existingConnections[i];
                        if(connection._sourceID == sourceID && connection._type == flag)
                        {
                            if(!connection._isDeleted && connection.isDetachable())
                                jsPlumb.detach(connection);
                            connection._isDeleted = true;
                        }
                    };
                    sourceInformation.taskToCall = targetID;
                    isJumpTask = true;
                }
                else
                {
                    if(sourceInformation.connections && sourceInformation.connections.connections_subitem)
                    {
                        var connections = sourceInformation.connections.connections_subitem;
                        for(var i=0;i<connections.length;i++)
                        {
                            if(connections[i].type == flag && connections[i].connectionID == targetID)
                            {
                                crushFTP.UI.growl("Error", "Connection to same task exists", true, 3000);
                                i = connections.length;
                                return false;
                            }
                        }
                    }
                }
            }
        }
        var color = flag == "failure" ? "red" : "green";
        if(flag=="start")
            color = "#33b5e5";
        if(isJumpTask)
            color = "#996633";
        if(isJumpFail)
            color = "#D88D43";
        if(_color)
        {
            color = _color;
        }
        var arrowCommon = { foldback:0.7, fillStyle:color, width:18 };
        var overlays = [
            [ "Arrow", { location:0.7 }, arrowCommon ]
        ];

        if(label)
        {
            overlays.push([ "Label", { label:"" + label.toString(), id:"loop-label", cssClass:"loop-label" } ]);
        }
        jsPlumb.Defaults.Container = canvas;
        var connection = taskDesigner.drawJsPlumbLine({
            source:div1,
            target:div2,
            container : canvas,
            anchor:"TopLeft",
            connector: ["StateMachine", {margin: 1, curviness: 20, proximityLimit:1}],
            paintStyle:{ lineWidth:4, strokeStyle: color , dashstyle: dashstyle},
            overlays:overlays
        });
        if(!onlyDraw && !isJumpTask)
            taskDesigner.data.addConnection(sourceID, flag, targetID);
        connection._sourceID = sourceID;
        connection._targetID = targetID;
        connection._type = flag;
        connection.bind("click", function(conn, evt) {
            taskDesigner.clearRangeSelection();
            if(!taskDesigner.monitoringActiveJob)
            {
                if(conn.labelClick)
                {
                    conn.labelClick = false;
                    return false;
                }
                if(evt.button == 2  || evt.ctrlKey )
                {
                    evt.stopPropagation();
                    evt.preventDefault();
                    taskDesigner.showContextMenu(conn, evt);
                    return false;
                }
                else if(evt.shiftKey)
                {
                    taskDesigner.addBreakpoint(conn, evt);
                    return false;
                }
                else
                {
                    evt.stopPropagation();
                    evt.preventDefault();
                    taskDesigner.showContextMenu(conn, evt);
                    return false;
                }
            }
        });

        connection.bind("addBreakpoint", function(conn, evt) {
            taskDesigner.addBreakpoint(conn, evt);
        });

        connection.bind("contextmenu", function(conn, evt) {
            if(!taskDesigner.monitoringActiveJob)
            {
                taskDesigner.showContextMenu(conn, evt);
            }
            evt.stopPropagation();
            evt.preventDefault();
            return false;
        });
        return connection;
    },
    bindContextMenu : function()
    {
        var connectionContextMenu = $("#connectionContextMenu").mouseleave(function(){
            $(this).hide("fast", function(){
                delete taskDesigner.contextConnection;
            });
        });
        connectionContextMenu.find("a").click(function(evt){
            if(!taskDesigner.contextConnection)
                return false;
            var action = $(this).attr('href').substr(1);
            if(action.indexOf("#")>=0)
            {
                action = action.substr(action.indexOf("#") + 1 , action.length - 1);
            }
            if(action=="delete")
            {
                var conn = taskDesigner.contextConnection;
                /*jConfirm("Are you sure you wish to remove this connection?", "Confirm", function(flag){
                    if(flag)*/
                    {
                        taskDesigner.data.removeConnection(conn._sourceID, conn._type, conn._targetID);
                        if(!conn._isDeleted && conn.isDetachable())
                            jsPlumb.detach(conn);
                        conn._isDeleted = true;
                        taskDesigner.hasPendingChanges(true);
                    }
                //});
            }
            else if(action=="addBreakpoint")
            {
                var conn = taskDesigner.contextConnection;
                taskDesigner.addBreakpoint(conn, evt);
            }
            else if(action=="addTaskHere")
            {
                var conn = taskDesigner.contextConnection;
                taskDesigner.clearRangeSelection();
                if(taskDesigner.monitoringActiveJob)
                {
                    return false;
                }
                if(!taskDesigner.loadedSchedule)
                {
                    jAlert("You must create a Job first", "Create Job", function(){
                        $("#newJobsSchedule").trigger("click");
                    });
                    return false;
                }
                var srcID = conn._sourceID;
                var targetID = conn._targetID;
                var type = conn._type;
                var prevTaskItem = $("#task_" + srcID);
                if(srcID == "StartPointPanel")
                    prevTaskItem = $("#StartPointPanel");
                var nextTaskItem = $("#task_" + targetID);
                if(targetID == "EndPoint")
                    nextTaskItem = $("#EndPoint");
                if(targetID == "EndPoint")
                    nextTaskItem = $("#" + targetID);
                var op = taskDesigner.getMiddleLocation(evt, prevTaskItem, nextTaskItem);
                var $el = $(taskDesigner.canvas);
                var op2 = $el.offset();
                op.top  = op.top;
                op.left = op.left - op2.left;
                if(op.top<5)op.top=5;
                if(op.left<5)op.left=5;
                taskDesigner.addItemToCanvas($("<div class='task'>"), op, function(taskID){
                    taskDesigner.data.removeConnection(srcID, type, targetID);
                    if(!conn._isDeleted && conn.isDetachable())
                        jsPlumb.detach(conn);
                    conn._isDeleted = true;
                    taskDesigner.hasPendingChanges(true);
                    var newTaskItem = $("#task_" + taskID);
                    taskDesigner.drawLine(prevTaskItem.find(".taskSuccessActionPoint"), newTaskItem, type);
                    if(type == "start")
                    {
                        taskDesigner.drawLine(newTaskItem.find(".taskSuccessActionPoint"), nextTaskItem, "success");
                    }
                    else
                    {
                        taskDesigner.drawLine(newTaskItem.find(".taskSuccessActionPoint"), nextTaskItem, type);
                    }
                });

            }
            connectionContextMenu.hide("fast", function(){
                delete taskDesigner.contextConnection;
            });
            evt.stopPropagation();
            evt.preventDefault();
            return false;
        });

        var taskItemContextMenu = $("#taskItemContextMenu").mouseleave(function(){
            $(this).hide("fast", function(){
                delete taskDesigner.contextConnection;
            });
        });

        taskItemContextMenu.find("a").click(function(evt){
            var action = $(this).attr('href').substr(1);
            if(action.indexOf("#")>=0)
            {
                action = action.substr(action.indexOf("#") + 1 , action.length - 1);
            }
            if(action=="delete")
            {
                var conn = taskDesigner.contextConnection;
                conn.find(".closeBtn").trigger("click");
            }
            else if(action=="details")
            {
                var conn = taskDesigner.contextConnection;
                conn.find(".crushTaskDetailsLink").trigger("click");
            }
            else if(action=="copy")
            {
                var conn = taskDesigner.contextConnection;
                var uid = conn.attr("uid");
                var item = taskDesigner.data.get(uid);
                if(item)
                {
                    var _uid = crushFTP.methods.generateRandomPassword(8);
                    var copy = $.extend(true, {}, item);
                    copy.name = "Copy of " + copy.name;
                    var op = {};
                    op.top = conn.position().top + 20;
                    op.left = conn.position().left + 20;
                    op.top += conn.height();
                    op.left += conn.width();
                    copy.position = "" + op.top + "," + op.left;
                    copy.connectionID = _uid;
                    if(copy.connections)
                        delete copy.connections;
                    taskDesigner.data.items.push(copy);

                    var taskItem = taskDesigner.taskTemplate.clone();
                    taskItem.find(".taskHeaderLabel").html(""+ copy.type);
                    taskItem.find(".taskName").html(copy.name);
                    taskItem.removeClass('default-failure');
                    if($.trim(copy.name).toLowerCase() === "default failure"){
                        taskItem.addClass('default-failure');
                    }
                    taskDesigner.canvas.append(taskItem);
                    taskItem.addClass("nonProcessed");
                    taskItem.css("left", op.left);
                    taskItem.css("top", op.top);
                    if(taskItem.offset().left + taskItem.width() > taskDesigner.canvas.width() + taskDesigner.canvas.scrollLeft())
                        taskItem.css("left", taskDesigner.canvas.width() - taskItem.width() - 10);
                    if(taskItem.offset().top + taskItem.height() > taskDesigner.canvas.height() + taskDesigner.canvas.scrollTop())
                        taskItem.css("top", taskDesigner.canvas.height() - taskItem.height() - 60);
                    taskItem.find(".taskAction").filter(":not(.miniature)").each(function(){
                        var uid = crushFTP.methods.generateRandomPassword(8);
                        $(this).attr("uid", uid);
                        $(this).attr("id", "taskAction_" + uid);
                    });
                    taskItem.attr("uid", _uid);
                    taskItem.attr("id", "task_" + _uid);
                    taskDesigner.bindItemEvents();
                    taskItem.effect("highlight", 1000);
                    taskDesigner.previewSnippet(taskItem);
                    if(copy.type == "Jump")
                    {
                        taskItem.find(".failurePanel").remove();
                        taskItem.find(".trueJumpPanel,.falseJumpPanel").show();
                    }
                    else if(copy.type == "UsersList")
                    {
                        taskItem.find(".trueJumpPanel").show();
                    }
                    else
                    {
                        taskItem.find(".trueJumpPanel,.falseJumpPanel").remove();
                    }
                }
            }
            taskItemContextMenu.hide("fast", function(){
                delete taskDesigner.contextConnection;
            });
            evt.stopPropagation();
            evt.preventDefault();
            return false;
        });
    },
    getMiddleLocation : function(evt, el1, el2){
        var op = {
            left : 0,
            top :0
        };
        if(evt)
        {
            var $el = $(taskDesigner.canvas), op = {
                top : evt.pageY,
                left : evt.pageX
            }, op2 = $el.offset();
            if(evt.pageX!=undefined)
            {
                op.left = op.left - op2.left;
                op.top = op.top - op2.top;
                if(op.top<5)op.top=5;
                if(op.left<5)op.left=5;
                return op;
            }
        }
        var srcOff = el1.offset();
        var targetOff = el2.offset();
        if(srcOff == null || targetOff == null)
            return false;
        if(op == null)
        {
            op = {};
        }
        op.top = Math.round((srcOff.top + el1.height() + targetOff.top + el2.height()) / 2);
        op.left = Math.round((srcOff.left + el1.width() + targetOff.left + el2.width()) / 2);

        if(op.top > targetOff.top)
        {
            op.top -= el2.height();
        }

        if(op.left > targetOff.left)
        {
            op.left -= el2.width()/2;
        }
        return op;
    },
    addBreakpoint : function(conn, evt){
        if(!conn || crushFTP.jobsKioskMode)
            return;
        taskDesigner.clearRangeSelection();
        var srcID = conn._sourceID;
        var targetID = conn._targetID;
        if(srcID=="StartPointPanel")
        {
            crushFTP.UI.growl("Error", "You can not add a breakpoint here.", true, 3000);
            return false;
        }
        var type = conn._type;
        var prevTaskItem = $("#task_" + srcID);
        var nextTaskItem = $("#task_" + targetID);
        if(prevTaskItem.hasClass('breakPoint') || nextTaskItem.hasClass('breakPoint'))
            return false;
        if(targetID == "EndPoint")
            nextTaskItem = $("#" + targetID);
        var op;
        if(type=="failure")
            op = taskDesigner.getMiddleLocation(evt, prevTaskItem.find(".taskFailureActionPoint"), nextTaskItem);
        else
            op = taskDesigner.getMiddleLocation(evt, prevTaskItem, nextTaskItem);
        if(!op)
            return;
        var bpID = taskDesigner.addItemToCanvas($("<div class='breakpoint'>"), op);
        taskDesigner.data.removeConnection(srcID, type, targetID);
        if(!conn._isDeleted && conn.isDetachable())
            jsPlumb.detach(conn);
        conn._isDeleted = true;
        taskDesigner.hasPendingChanges(true);
        var breakpointItem = $("#task_" + bpID);
        if(type == "success")
        {
            taskDesigner.drawLine(prevTaskItem.find(".taskSuccessActionPoint"), breakpointItem, type);
            taskDesigner.drawLine(breakpointItem.find(".taskSuccessActionPoint"), nextTaskItem, type);
        }
        else if(type=="failure")
        {
            taskDesigner.drawLine(prevTaskItem.find(".taskFailureActionPoint"), breakpointItem, type);
            taskDesigner.drawLine(breakpointItem.find(".taskSuccessActionPoint"), nextTaskItem, type);
        }
        else if(type=="true")
        {
            taskDesigner.drawLine(prevTaskItem.find(".taskJumpTrueActionPoint"), breakpointItem, type);
            taskDesigner.drawLine(breakpointItem.find(".taskSuccessActionPoint"), nextTaskItem, type);
        }
        else if(type=="jumpfail")
        {
            taskDesigner.drawLine(prevTaskItem.find(".taskJumpFalseActionPoint"), breakpointItem, type);
            taskDesigner.drawLine(breakpointItem.find(".taskSuccessActionPoint"), nextTaskItem, type);
        }
        var startItem = srcID !="StartPoint" ? taskDesigner.data.get(srcID) : {name:"StartPoint", type:""};
        var endItem = targetID != "EndPoint" ? taskDesigner.data.get(targetID) : {name:"EndPoint", type:""};
        audit.addLog("added breakpoint between " + audit.getName(startItem) + " and " + audit.getName(endItem));
    },
    showContextMenu : function(conn, e, menu)
    {
        menu = menu || $("#connectionContextMenu");
        if(conn)
            taskDesigner.contextConnection = conn;
        // Detect mouse position
        var d = {}, x, y;
        if( self.innerHeight ) {
            d.pageYOffset = self.pageYOffset;
            d.pageXOffset = self.pageXOffset;
            d.innerHeight = self.innerHeight;
            d.innerWidth = self.innerWidth;
        } else if( document.documentElement &&
            document.documentElement.clientHeight ) {
            d.pageYOffset = document.documentElement.scrollTop;
            d.pageXOffset = document.documentElement.scrollLeft;
            d.innerHeight = document.documentElement.clientHeight;
            d.innerWidth = document.documentElement.clientWidth;
        } else if( document.body ) {
            d.pageYOffset = document.body.scrollTop;
            d.pageXOffset = document.body.scrollLeft;
            d.innerHeight = document.body.clientHeight;
            d.innerWidth = document.body.clientWidth;
        }
        (e.pageX) ? x = e.pageX : x = e.clientX + d.scrollLeft;
        (e.pageY) ? y = e.pageY : y = e.clientY + d.scrollTop;

        // Show the menu
        x = x - 15;
        if(x + $(menu).width() > $(document).width())
        {
            x = $(document).width() - $(menu).width() - 20;
        }
        $(menu).css({ top: y-5, left: x}).fadeIn(200);
        $(document).unbind("click.context").bind("click.context", function(){
            menu.hide();
            $(document).unbind("click.context");
        });
    },
    animateConnection : function(connection, flag)
    {
        connection._timer = 1;
        var curInterval = setInterval(function(){
            connection.removeOverlay("progressLabel");
            if(connection._isDeleted)
            {
                clearInterval(curInterval);
                return
            }
            connection.addOverlay([ "Label", { label: " Users : " + connection._timer.toString() + ", ", id:"progressLabel", cssClass: "progressLabel", location : 0.5 } ]);
            connection._timer++;
            var color = flag == "failure" ? "red" : "green";
            if(flag=="start")
                color = "#33b5e5";
            if(!connection._altColor)
            {
                connection.setPaintStyle({ lineWidth:4, strokeStyle: color, dashstyle: "2 3"});
                connection._altColor = true;
            }
            else
            {
                connection.setPaintStyle({ lineWidth:4, strokeStyle: color, dashstyle:"4 3" });
                connection._altColor = false;
            }
        }, 500);
        return curInterval;
    },
    initJSPlumb : function()
    {
        jsPlumb.Defaults.Container = taskDesigner.canvas;
        jsPlumb.DefaultDragOptions = { cursor: "pointer", zIndex: 100 };
        jsPlumb.importDefaults({
            Connector : [ "Bezier", { curviness:50 } ],
            DragOptions : { cursor: "pointer", zIndex:100 },
            PaintStyle : { lineWidth:2 },
            EndpointStyle : { radius:1},
            HoverPaintStyle : {strokeStyle:"#ec9f2e" },
            EndpointHoverStyle : {fillStyle:"#ec9f2e" },
            Anchors :  [ "BottomCenter", "TopCenter" ],
            ConnectorZIndex : 100
        });
    },
    removeS3Options: function(){
        var curData = taskDesigner.data.items;
        for(var i=0;i<curData.length;i++){
            var curI = curData[i];
            if(!curI.multithreaded_s3 || curI.multithreaded_s3 == "false"){
                delete curI.s3_buffer;
                delete curI.s3_threads_upload;
            }
            if(!curI.multithreaded_s3_download || curI.multithreaded_s3_download == "false"){
                delete curI.s3_buffer_download;
                delete curI.s3_threads_download;
                delete curI.s3_max_buffer_download;
            }
        }
    },
    generateXML : function(isKiosk)
    {
        taskDesigner.canvas.find(".crushTaskItem").each(function(){
            taskDesigner.data.updateZIndex($(this).attr("uid"));
        });
        var xml = "";
        var zoom = $("#canvasZoomSlider").slider("value");
        zoom = parseInt(zoom)/100;
        var endPointPosition = $("#EndPoint").position();
        taskDesigner.removeS3Options();
        taskDesigner.data.endPointPosition = Math.round(endPointPosition.top / zoom) +"," + Math.round(endPointPosition.left / zoom);
        if(taskDesigner && taskDesigner.data && taskDesigner.data.items && taskDesigner.data.items.length>0)
        {
            try{
                xml = $.json2xml(taskDesigner.data.items, {rootTagName: 'tasks'});
            }
            catch(ex){}
        }
        xml = xml.replace(/\<tasks>/g, "<tasks type=\"vector\">")
            .replace(/\<tasks_subitem>/g, "<tasks_subitem type=\"properties\">")
            .replace(/\<undefined>/g, "")
            .replace(/\<\/undefined>/g, "")
            .replace(/\<connections>/g, "<connections type=\"vector\">")
            .replace(/\<connections_subitem>/g, "<connections_subitem type=\"properties\">")
            .replace(/\<type>properties<\/type>/g, "")
            .replace(/\<type>vector<\/type>/g, "")
            .replace(/\<connections type="vector">undefined<\/connections>/g, "")
            .replace(/\<connections type="vector"><connections_subitem\/><\/connections>/g, "<connections type=\"vector\"><connections_subitem type=\"properties\"><type>null</type><connectionID>null</connectionID></connections_subitem></connections>")
            .replace(/\<headers>/g, '<headers type="vector">')
            .replace(/\<headers_subitem>/g, '<headers_subitem type="properties">')
            .replace(/\<prop_item>/g, '<prop_item type="vector">')
            .replace(/\<prop_item_subitem>/g, '<prop_item_subitem type="properties">')
            .replace(/\<\nfunction item\(\) \{\n    \[native code\]\n\}\n>undefined<\/\nfunction item\(\) {\n    \[native code\]\n\}\n\>/g,"");
        if(isKiosk)
        {
            var _connections = taskDesigner.data.startConnections;
            if(_connections && _connections.length>0)
            {
                xml += "<connections type=\"vector\">";
                for (var i = 0; i < _connections.length; i++) {
                    var curConnection = _connections[i];
                    xml += "<connections_subitem type=\"properties\"><type>start</type><connectionID>"+curConnection+"</connectionID></connections_subitem>";
                };
                xml += "</connections>";
            }
            xml += "<startPointPosition>"+taskDesigner.data.startPointPosition+"</startPointPosition>"
            xml += "<endPointPosition>"+taskDesigner.data.endPointPosition+"</endPointPosition>";
            var canWidth = taskDesigner.canvas.width();
            var canHeight = taskDesigner.canvas.height();
            xml += "<canvasSize>"+canWidth.toString() + "," + canHeight.toString()+"</canvasSize>";
        }
        return xml;
    },
    refreshGoogleTokenProxy : function(_panel, googleId, cb, client_id, pass, encPass){
        var baseURL = window.location.protocol + "//" + window.location.host + "/";
        var curURL = encodeURIComponent(baseURL) + "%3Fcommand%3Dregister_google_mail_api";
        // var google_client_id = googleId.split("~")[0];
        var google_client_id = client_id + "~" + pass;
        var googleURL = 'https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A%2F%2Fmail.google.com%2F&redirect_uri='+curURL+'&response_type=code&access_type=offline&client_id='+client_id+'&prompt=consent';
        _panel.parent().block({ message: "Waiting... <a href='javascript:void(0);' class='cancel' style='color:#fff;'>Cancel</a> <div style='margin-top:20px;'>(If your browser has not opened a new window, you may need to unblock popups.)</div>", overlayCSS: { opacity: 0.7, cursor: 'normal'},css: {
            border: 'none',
            backgroundColor: 'transparent',
            color: '#fff',
            'text-align':'center',
            'font-weight' : 'normal',
            opacity : 0.8,
            width : '100%',
            cursor : 'normal'
        }});
        var popup = window.open(googleURL, "google", "width=800,height=600");
        var timer, stopPolling;

        function closePopup(){
            _panel.parent().unblock();
            popup.close();
            clearTimeout(timer);
            stopPolling = true;
        }

        _panel.parent().find("a.cancel").click(function(){
            closePopup();
        });

        function checkTokenStatus(){
            if(stopPolling){
                stopPolling = false;
                return false;
            }
            crushFTP.data.serverRequest({
                command: 'lookup_google_mail_api_code',
                google_client_info: google_client_id,
                serverGroup : $("#userConnectionGroups").val() || "MainUsers",
                server_url : curURL
            },
            function(data){
                var code = data ? $.trim($(data).find("response").text()) : "";
                if(data && code && code != "null")
                {
                    if(code.toLowerCase().indexOf("error")>=0){
                        closePopup();
                        crushFTP.UI.growl("Error: ", crushFTP.methods.htmlEncode(code), true);
                        return;
                    }
                    var smpt_user = "";
                    if($("#mail_user", _panel).is(":visible")){
                        smpt_user = $.trim($("#mail_user", _panel).val());
                    }
                    else if($("#smtp_user", _panel).is(":visible")){
                        smpt_user = $.trim($("#smtp_user", _panel).val());
                    }
                    var googlePassUser = smpt_user ?
                                    smpt_user + "~" + client_id + "~" + encPass
                                    :
                                    client_id + "~" + encPass;
                    if(cb)
                    {
                        cb(code, googlePassUser);
                    }

                    // $("#smtp_pass").val(code).trigger("textchange");
                    // $("#smtp_pass").trigger("blur");
                    closePopup();
                    crushFTP.UI.growl("Message : ", "Token Refreshed.", false, 3000);
                }
                else{
                    timer = setTimeout(function(){
                        checkTokenStatus();
                    }, 1000);
                }
            });
        }
        checkTokenStatus();
    },
    refreshGoogleToken : function(_panel, userName, cb){
        var _name = "";
        if(userName && userName.indexOf("~")>1){
            var vals = userName.split("~");
            _name = (vals.length>2) ? vals[1] : vals[0];
        }
        jPrompt("Client ID: ", _name, "Please enter Google Oauth", function(value, other, pass){
            if(value)
            {
                var username = (value);
                if(pass){
                    crushFTP.data.encryptPass(pass, function(data){
                        if(data)
                        {
                            var generatedPass = unescape(data.response[0].text);
                            taskDesigner.refreshGoogleTokenProxy(_panel, "", cb, username, pass, generatedPass);
                        }
                    });
                }
                else{
                    //
                }
            }
        }, false, false, {
            appendAfterInput : '<p><label for="google_client_secret" style="display:block;">Client Secret: </label> <input type="password" placeholder="" class="extraItem" id="google_client_secret" name="google_client_secret" style="width: 500px;margin-top: 6px;" /></p>',
            prependBeforeInput: '<span class="ui-state-highlight ui-corner-all googleSMTPOptions" style="padding:3px;display:inline-block;margin:0px 3px;width:auto;position: absolute;top: 30px;right:15px;"><span style="float: left; margin-right: 0.3em;" class="ui-icon ui-icon-info"></span><span><a target="_blank" href="https://www.crushftp.com/crush9wiki/Wiki.jsp?page=SMTP%20Google%20Mail%20Integration">Learn more : SMTP Google Mail Integration</a></span></span>'
        });
    },
    refreshMSToken: function(dialog, client_id, pass, tenant, popImap){
        var baseURL = window.location.protocol + "//" + window.location.host + "/";
        var curURL = encodeURIComponent(baseURL) + "register_microsoft_graph_api/";
        var scope = "offline_access https://outlook.office.com/SMTP.Send";
        if(popImap){
            var protocol = dialog.find("#mail_protocol").val();
            if(protocol.indexOf("imap")==0){
                scope = "offline_access https://outlook.office.com/IMAP.AccessAsUser.All";
            }
            else if(protocol.indexOf("pop")==0){
                scope = "offline_access https://outlook.office.com/POP.AccessAsUser.All";
            }
        }
        var ms_client_id = client_id + "~" + pass;
        var msURL = 'https://login.microsoftonline.com/'+tenant+'/oauth2/v2.0/authorize?client_id='+client_id+'&redirect_uri='+curURL+'&scope='+scope+'&response_type=code';
        dialog.parent().block({ message: "Waiting... <a href='javascript:void(0);' class='cancel' style='color:#fff;'>Cancel</a> <div style='margin-top:20px;'>(If your browser has not opened a new window, you may need to unblock popups.)</div>", overlayCSS: { opacity: 0.7, cursor: 'normal'},css: {
            border: 'none',
            backgroundColor: 'transparent',
            color: '#fff',
            'text-align':'center',
            'font-weight' : 'normal',
            opacity : 0.8,
            width : '100%',
            cursor : 'normal'
        }});
        var popup = window.open(msURL, "ms", "width=800,height=600");
        var timer, stopPolling;

        function closePopup(){
            dialog.parent().unblock();
            popup.close();
            clearTimeout(timer);
            stopPolling = true;
        }

        dialog.parent().find("a.cancel").click(function(){
            closePopup();
        });

        function checkTokenStatus(){
            if(stopPolling){
                stopPolling = false;
                return false;
            }
            crushFTP.data.serverRequest({
                command: 'lookup_microsoft_graph_api_code',
                scope: scope,
                server_url: curURL,
                client_id: ms_client_id,
                client_secret: pass,
                serverGroup : $("#userConnectionGroups").val() || "MainUsers",
                tenant : tenant
            },
            function(data){
                var code = data ? $.trim($(data).find("response").text()) : "";
                if(data && code && code != "null")
                {
                    if(code.toLowerCase().indexOf("error")>=0){
                        closePopup();
                        crushFTP.UI.growl("Error: ", crushFTP.methods.htmlEncode(code), true);
                        return;
                    }
                    if(popImap){
                        $("#mail_pass", dialog).val(code).trigger("textchange");
                        $("#mail_pass", dialog).trigger("blur");
                        $("#mail_user", dialog).val(client_id + "~" + pass).trigger("textchange");
                        $("#mail_user", dialog).trigger("blur");
                    }
                    else{
                        $("#smtp_pass", dialog).val(code).trigger("textchange");
                        $("#smtp_pass", dialog).trigger("blur");
                        $("#smtp_user", dialog).val(client_id + "~" + pass).trigger("textchange");
                        $("#smtp_user", dialog).trigger("blur");
                    }
                    taskDesigner.hasPendingChanges(true);
                    closePopup();
                    crushFTP.UI.growl("Message : ", "Token Refreshed.", false, 3000);
                }
                else{
                    timer = setTimeout(function(){
                        checkTokenStatus();
                    }, 1000);
                }
            });
        }
        checkTokenStatus();
    },
    getMSConsent: function(dialog, client_id, tenant){
        var baseURL = window.location.protocol + "//" + window.location.host + "/";
        var curURL = encodeURIComponent(baseURL) + "register_microsoft_graph_api/";
        var msURL = 'https://login.microsoftonline.com/'+tenant+'/adminconsent?client_id='+client_id+'&redirect_uri='+curURL;

        dialog.parent().block({ message: "Waiting... <a href='javascript:void(0);' class='cancel' style='color:#fff;'>Cancel</a> <div style='margin-top:20px;'>(If your browser has not opened a new window, you may need to unblock popups.)</div>", overlayCSS: { opacity: 0.7, cursor: 'normal'},css: {
            border: 'none',
            backgroundColor: 'transparent',
            color: '#fff',
            'text-align':'center',
            'font-weight' : 'normal',
            opacity : 0.8,
            width : '100%',
            cursor : 'normal'
        }});
        var popup = window.open(msURL, "ms", "width=800,height=600");
        var timer, stopPolling;

        function closePopup(){
            dialog.parent().unblock();
            popup.close();
            clearTimeout(timer);
            stopPolling = true;
        }

        dialog.parent().find("a.cancel").click(function(){
            closePopup();
        });

        function checkTokenStatus(){
            if(stopPolling){
                stopPolling = false;
                return false;
            }
            crushFTP.data.serverRequest({
                command: 'lookup_microsoft_graph_api_code',
                server_url: curURL,
                client_id: client_id,
                serverGroup : $("#userConnectionGroups").val() || "MainUsers",
                tenant : tenant
            },
            function(data){
                var code = data ? $.trim($(data).find("response").text()) : "";
                if(data && code && code != "null")
                {
                    if(code.toLowerCase().indexOf("error")>=0){
                        closePopup();
                        crushFTP.UI.growl("Error: ", crushFTP.methods.htmlEncode(code), true);
                        return;
                    }
                    taskDesigner.hasPendingChanges(true);
                    closePopup();
                    crushFTP.UI.growl("Message : ", crushFTP.methods.htmlEncode($.trim($(data).find("response").text())), false, 3000);
                }
                else{
                    timer = setTimeout(function(){
                        checkTokenStatus();
                    }, 1000);
                }
            });
        }
        checkTokenStatus();
    }
};

//crushFTP.defaultRequestType = "GET";
$(document).ready(function(){
    $(".tabs").tabs();
    $("#availableJobsTabs").tabs({
        select: function(event, ui) {
             if(ui.index == 1)
            {
                taskDesigner.bindActiveJobs();
            }
        }
    });

    crushFTP.UI.initLoadingIndicator();
    css_browser_selector(navigator.userAgent);
    crushFTP.UI.showLoadingIndicator({});
    $(".button").button();

    var jobsKioskMode = $.trim(crushFTP.methods.queryString("kiosk"));
    if(jobsKioskMode && jobsKioskMode.length>0)
        crushFTP.jobsKioskMode = jobsKioskMode;
    if(crushFTP.jobsKioskMode){
        $("#header, #footer, .jobButtons").hide();
        $("body").css("padding", "0px")
        $("#placeHolder").css("margin-top", "5px");
        $("#jobsCanvas").css("width", "99%");
        $(".addBreakPoint").remove();

        if(parent.crushFTP.kioskJobData)
        {
            crushFTP.UI.hideLoadingIndicator({});
            taskDesigner.kioskData = parent.crushFTP.kioskJobData;
            if(taskDesigner.kioskData.initCallback)
            {
                $("#taskDesignerPanel").block({
                    message:  'Loading..',
                    css: {
                        border: 'none',
                        padding: '10px',
                        width : '200px',
                        backgroundColor: '#000',
                        '-webkit-border-radius': '10px',
                        '-moz-border-radius': '10px',
                        opacity: .5,
                        color: '#fff',
                        'text-align':'left'
                    }
                });
                taskDesigner.tasksFormTemplateHolder = $("#crushTaskTemplatesHolder", taskDesigner.panel);
                taskDesigner.loadTasksFormHTML(function(flag){
                    if(flag)
                    {
                        $("#taskDesignerPanel").unblock();
                        taskDesigner.kioskData.initCallback(taskDesigner);
                    }
                    else
                    {
                        crushFTP.UI.growl("Error", "Failed while loading forms", true);
                    }
                });
            }
        }
    }
    else
    {
        crushFTP.userLogin.bindUserName(function (response, username) {
            if (response == "failure") {
                window.location = "/WebInterface/login.html?link=/WebInterface/Jobs/index.html";
            } else {
                crushFTP.data.serverRequest({
                    command: "getServerRoots"
                }, function(roots){
                    crushFTP.serverConfig = crushFTP.serverConfig || {};
                    crushFTP.serverConfig.userRoot = $(roots).find("user\\.root").text() || "/";
                    crushFTP.serverConfig.serverRoot = $(roots).find("server\\.root").text() || "/";
                    taskDesigner.init();
                });
            }
        });
    }
});

function doLogout()
{
    $.ajax({type: "POST",url: "/WebInterface/function/", data: {command: "logout",random: Math.random(), c2f:crushFTP.getCrushAuth()},
        error: function (XMLHttpRequest, textStatus, errorThrown)
        {
            $.cookie("currentAuth", "", {path: '/',expires: -1});
            document.location = "/WebInterface/login.html";
        },
        success: function (msg)
        {
            $.cookie("currentAuth", "", {path: '/',expires: -1});
            document.location = "/WebInterface/login.html";
        }
    });
    return false;
}

$.fn.glowTaskItem = function(color){
    var that = $(this);
    color = color || "default";
    var _interval = setInterval(function(){
        if(that.data("stopAnimation")==true)
        {
            that.removeData('stopAnimation');
            that.removeClass('isAnimating ' + color);
            clearInterval(_interval);
        }
        else if(!that.hasClass('isAnimating'))
        {
            that.addClass('isAnimating ' + color);
        }
    }, 500);
    return this;
};

$.fn.highlightTaskItem = function(done){
    var color = "focus";
    var that = $(this);
    if(that.hasClass("breakPoint"))
        color = "error";
    if(done)
    {
        that.removeClass('isAnimating ' + color);
        return;
    }
    if(!that.hasClass('isAnimating'))
    {
        that.addClass('isAnimating ' + color);
    }
    return that;
};

jQuery.fn.redraw = function() {
    return;
    if(!this || !$(this).is(":visible"))return;
    var stop = $(document).scrollTop();
    var sleft = $(document).scrollLeft();
    return this.hide(0, function() {
        $(this).show();
        $(document).scrollTop(stop);
        $(document).scrollLeft(sleft);
    });
};

window.addAutoSuggests = false;