/*Crush Dashboard*/
var crushDashboard = (function ($) {
    /*Global Variables*/
    var _defaultServerTypes;
    var _serverItems;
    var _container, _bubbleTree, _subItems;
    var _templates = {
        mainTree: "",
        bubble: "",
        subItem: "",
        countBadge: "",
        detailsBubble: "",
        serverTransfersStatus: ""
    };
    var _pollInterval = 3; //In Seconds
    var $utils;
    var $loader;
    var $service;
    /*End : Global Variables*/

    /*Render main html elements and placeholders, uses mustache for template rendering*/
    function renderMainServers() {
        _container = $('#mainContainer').empty();
        _bubbleTree = $(Mustache.render(_templates.mainTree, {
            title: "Servers"
        }));
        _defaultServerTypes.forEach(function (server) {
            _bubbleTree.append($(Mustache.render(_templates.bubble, {
                name: server,
                nameLower: server.toLowerCase()
            })));
        });
        _subItems = $(Mustache.render(_templates.subItem, {}));
        _container.append(_bubbleTree);
        _container.append(_subItems);
        var bubbles = _bubbleTree.find(".bubble");
        var rootElem = $('#server-root', _bubbleTree);
        var detailedItems = $('#sub-items', _container);
        $utils.ellipsify(bubbles, 250, 0, true);
        bubbles.each(function () {
            var that = $(this);
            setTimeout(function(){
                var rootline = $utils.drawline(rootElem, that);
                that.data("connectionLine", rootline);
            }, 500);
            that.on("click", function () {
                zoomOutServers(that.hasClass('active'));
                var childRootElem = _container.find(".child-root");
                var positions = childRootElem.offset();
                childRootElem.unbind();
                rootElem.unbind();
                var subItems = detailedItems.find(".details-bubble");
                subItems.filter("[rel!='" + that.attr("id") + "']").each(function () {
                    var con = $(this).hide().data("connectionLine");
                    if (con) {
                        con._isDeleted = true;
                        jsPlumb.detach(con);
                    }
                });

                var rootcon = rootElem.data("rootConnectionLine");
                if (rootcon) {
                    rootcon._isDeleted = true;
                    jsPlumb.detach(rootcon);
                }

                var rootConnectionLine = $utils.drawline(rootElem, childRootElem.find("span"));
                rootElem.data("rootConnectionLine", rootConnectionLine);
                var serverType = that.find(".server-name").text();
                childRootElem.find(".name").text(serverType);
                if (!that.hasClass('active')) {
                    bubbles.removeClass("active").addClass('inactive');
                    that.addClass('active').removeClass("inactive");
                } else {
                    bubbles.removeClass("active").removeClass('inactive');
                }

                if(that.hasClass('active')){
                    childRootElem.unbind().click(function(){
                        that.addClass('active').trigger("click");
                        return false;
                    });

                    rootElem.unbind().click(function(){
                        that.addClass('active').trigger("click");
                        return false;
                    });
                }

                var currentSubItems = subItems.filter("[rel='" + that.attr("id") + "']");
                if (currentSubItems.length > 0) {
                    currentSubItems.each(function (item, index) {
                        if ($(this).is(":visible")) {
                            var con = $(this).hide().data("connectionLine");
                            if (con) {
                                con._isDeleted = true;
                                jsPlumb.detach(con);
                            }
                        } else {
                            var pos = $utils.findNewPoint(item, currentSubItems.length, 300);
                            $(this).show().css("left", (positions.left + pos.y - 50)).css("top", (positions.top + pos.x - 25)).addClass('animate fade-in');
                            (function (elm) {
                                setTimeout(function () {
                                    if (elm.is(":visible")) {
                                        var line = $utils.drawline(childRootElem.find("span"), elm, "#99ccff");
                                        $utils.animateConnection(line, "flag");
                                        elm.data("connectionLine", line).removeClass('fade-in');
                                    }
                                }, 500);
                            })($(this));
                        }
                    });

                    $('body').animate({
                        scrollTop: currentSubItems.filter(":last").offset().top - 50
                    });

                    setTimeout(function () {
                        currentSubItems.removeClass('animate');
                    }, 2000);
                } else {
                    $('body').animate({
                        scrollTop: rootElem.offset().top - 350
                    });
                }
            }).addClass('animate-bubble');
        });
        setTimeout(function () {
            bubbles.removeClass('animate-bubble').addClass('shake');
        }, 1500);
    }

    function zoomOutServers(zoomOut){
        // $("body").addClass('hide-connections');
        if(zoomOut){
            _bubbleTree.removeClass('zoom-out');
            _container.find(".child-root").remove();
        }
        else{
            _bubbleTree.addClass('zoom-out');
            if(_container.find(".child-root").length==0)
                _container.append("<div class='child-root'><label class='name'></label><span></span></div>");
        }
        setTimeout(function(){
            // $("body").removeClass('hide-connections');
            if(zoomOut){
                jsPlumb.setZoom(1);
            }
            else{
                jsPlumb.setZoom(0.6);
            }
            jsPlumb.repaintEverything();
        }, 500);
    }

    /*Render sub items of the servers*/
    function renderSubItems() {
        _subItems.empty();
        _bubbleTree.find(".count").remove();
        for (var serverType in _serverItems) {
            var curItems = _serverItems[serverType] || [];
            var parentItem = _bubbleTree.find("#item-" + serverType.toLowerCase());
            if (curItems.length) {
                parentItem.append($(Mustache.render(_templates.countBadge, {
                    count: curItems.length
                })));
            }
            var totalRunning = 0,
                totalStopped = 0;
            curItems.forEach(function (subItem, index) {
                var dataItem = {
                    index: index,
                    itemIndex: subItem.itemIndex,
                    type: serverType.toLowerCase(),
                    name: subItem.name,
                    users: subItem.users,
                    "running-status": subItem.running,
                    running: subItem.running ? "running" : "stopped",
                    connections: subItem.connections,
                    displayText: serverType.toLowerCase() + '://' + subItem.ip + ':' + subItem.port,
                    meta: subItem
                };

                var server = $(Mustache.render(_templates.detailsBubble, dataItem));
                if (subItem.running)
                    totalRunning++;
                else
                    totalStopped++;
                parentItem.find(".status").find(".running").find(".legend").text(totalRunning);
                parentItem.find(".status").find(".stopped").find(".legend").text(totalStopped);
                server.data("dataItem", dataItem);
                _subItems.append(server);
            });
        }
    }

    /*Update sub items based on new server data*/
    function updateSubItems() {
        var subItems = $('#sub-items', _container);
        for (var serverType in _serverItems) {
            var curItems = _serverItems[serverType] || [];
            var parentItem = _bubbleTree.find("#item-" + serverType.toLowerCase());
            if (curItems.length)
                parentItem.find(".count").text(curItems.length);
            var totalRunning = 0,
                totalStopped = 0;
            curItems.forEach(function (subItem, index) {
                if (subItem.running)
                    totalRunning++;
                else
                    totalStopped++;
                var data = {
                    index: index,
                    itemIndex: subItem.itemIndex,
                    type: serverType.toLowerCase(),
                    name: subItem.name,
                    users: subItem.users,
                    "running-status": subItem.running,
                    running: subItem.running ? "running" : "stopped",
                    connections: subItem.connections,
                    displayText: serverType.toLowerCase() + '://' + subItem.ip + ':' + subItem.port,
                    meta: subItem
                };
                var currentSubItem = subItems.find("#detailsBubble-" + data.type + "-" + index + "");
                $('[data-toggle="tooltip"]', currentSubItem).tooltip('destroy');

                data.usersChanged = currentSubItem.find(".user-count").text() != data.users;
                data.connectionsChanged = currentSubItem.find(".connections-count").text() != data.connections;

                var server = $(Mustache.render(_templates.detailsBubble,
                    data
                ));
                currentSubItem.removeClass("running stopped").addClass(data.running);
                currentSubItem.find(".bubble-panel").replaceWith(server.find(".bubble-panel"));
                currentSubItem.data("dataItem", data);
            });
            parentItem.find(".status").find(".running").find(".legend").text(totalRunning);
            parentItem.find(".status").find(".stopped").find(".legend").text(totalStopped);
        }
        $('[data-toggle="tooltip"]', subItems).tooltip({
            container: "body"
        });
    }

    /*Bind events*/
    function bindEvents() {
        if (this.eventsAdded) {
            return;
        }
        $('[data-toggle="tooltip"]').tooltip({
            container: "body"
        });

        $(document).on("click", ".details-bubble", function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            // var statusPanel = $(Mustache.render(_templates.serverTransfersStatus, {}));
            // $(this).popover({
            //     html: true,
            //     content: function () {
            //         return statusPanel;
            //     },
            //     container: '#mainContainer'
            // }).popover("show");
        });

        $(window).focus(function(){
            jsPlumb.repaintEverything();
        });

        $(document).on("click", ".details-bubble .buttons a", function (evt) {
            if ($(this).is(".disabled") || $(this).closest(".details-bubble").hasClass("busy"))
                return;
            evt.stopPropagation();
            evt.preventDefault();
            var action = $(this).attr("type");
            var dataItem = $(this).closest(".details-bubble").data("dataItem");
            var index = dataItem.itemIndex;
            if (!action || index < 0) return;
            if (action == "diagnose") {
                var dialog = bootbox.dialog({
                    title: '<i class="fa fa-stethoscope"></i> Diagnose',
                    backdrop: true,
                    message: _templates.diagnoseDialog,
                    buttons: {
                        "Test": {
                            label: '<i class="fa fa-play"></i> Test',
                            className: 'btn-primary',
                            callback: function (result) {
                                var IP = dialog.find("#diag_HostAuto").is(":checked") ? "auto" : $.trim(dialog.find("#diag_IP").val());
                                var Port = $.trim(dialog.find("#diag_Port").val());
                                var Protocol = $.trim(dialog.find("#diag_Protocol").val());
                                var User = $.trim(dialog.find("#diag_UserName").val());
                                var Pass = $.trim(dialog.find("#diag_pass").val());

                                if (Port === "") {
                                    bootbox.alert({
                                        message: "Port is required",
                                        callback: function () {
                                            dialog.find("#diag_Port").focus();
                                        }
                                    });
                                    return false;
                                }
                                if (Protocol === "") {
                                    bootbox.alert({
                                        message: "Protocol is required",
                                        callback: function () {
                                            dialog.find("#diag_Protocol").focus();
                                        }
                                    });
                                    return false;
                                }
                                var obj = {
                                    ip: IP,
                                    port: Port,
                                    protocol: Protocol
                                };
                                if (Protocol.toLowerCase() == "ftp") {
                                    obj.user = User;
                                    obj.pass = Pass;
                                }
                                $loader.show();
                                crushDashboard.service.diagnoseServer(obj, function (data) {
                                    if (data) {
                                        if (data.indexOf("ERROR") >= 0) {
                                            var alertMsg = "";
                                            var e = data;
                                            if ((e + "").toUpperCase().indexOf("REFUSED") >= 0) {
                                                alertMsg = "We reached something...but no server was running, bad port?";
                                            } else if ((e + "").toUpperCase().indexOf("TIMEOUT") >= 0 && (e + "").toUpperCase().indexOf("CONNECT") >= 0) {
                                                alertMsg = "Probably a firewall blocked the connection, or the IP/host was wrong";
                                            } else if ((e + "").toUpperCase().indexOf("PLAINTEXT") >= 0) {
                                                alertMsg = "Probably HTTP or some other protocol port";
                                            } else if ((e + "").toUpperCase().indexOf("NOT_SSH") >= 0) {
                                                alertMsg = "Definitely not ssh...probably FTP";
                                            } else if ((e + "").toUpperCase().indexOf("SSH_NO_HEADER") >= 0) {
                                                alertMsg = "Connected so some other protocol port.";
                                            } else if ((e + "").toUpperCase().indexOf("NOT_FTP") >= 0) {
                                                alertMsg = "Definitely not FTP...probably sftp";
                                            } else if ((e + "").toUpperCase().indexOf("FTP_NO_HEADER") >= 0) {
                                                alertMsg = "Connected so some other protocol port.";
                                            } else if ((e + "").toUpperCase().indexOf("FTP_NOT_CRUSHFTP") >= 0) {
                                                alertMsg = "Some other vendor's server";
                                            } else if ((e + "").toUpperCase().indexOf("FTP_BAD_USER_PASS") >= 0) {
                                                alertMsg = "Couldn't login to verify PASV mode stuff";
                                            } else if ((e + "").toUpperCase().indexOf("FTP_PASV_BAD_PORT") >= 0) {
                                                alertMsg = "PASV port was blocked, not mapped correctly in router";
                                            } else if ((e + "").toUpperCase().indexOf("FTP_PASV_TIMEOUT") >= 0) {
                                                alertMsg = "PASV port was blocked, not mapped in router, or firewall, or pointed to wrong internal LAN address";
                                            } else if ((e + "").toUpperCase().indexOf("FTP_PASV_IP_BAD") >= 0) {
                                                alertMsg = "PASV IP seems to be wrong";
                                            }

                                            bootbox.alert({
                                                message: data + "<br>" + alertMsg
                                            });
                                        } else {
                                            bootbox.alert({
                                                message: "Success!! " + data,
                                                callback: function () {
                                                    dialog.modal('hide');
                                                }
                                            });
                                        }
                                        $loader.hide();
                                    } else {
                                        bootbox.alert({
                                            message: "Error occurred while testing server"
                                        });
                                    }
                                });
                                return false;
                            }
                        },
                        "Cancel": {
                            label: 'Cancel',
                            className: 'btn-link'
                        }
                    }
                });
                dialog.find("#diag_HostAuto").off("change").on("change", function () {
                    if ($(this).is(":checked")) {
                        dialog.find("#diag_IP").attr("disabled", "disabled");
                        dialog.find(".manualIP").hide();
                    } else {
                        dialog.find("#diag_IP").removeAttr("disabled");
                        dialog.find(".manualIP").show();
                    }
                });
                var data = dataItem.meta;
                dialog.find("#diag_Port").val(data.port).attr("readonly", "readonly");
                dialog.find("#diag_Protocol").val(dataItem.type).trigger('textchange');
                $.get("http://www.crushftp.com/ip.jsp", function (data) {
                    if (data) {
                        var elem = $(data);
                        var IP = $.trim(elem.text().replace("Current IP CheckCurrent IP Address: ", ""));
                        if (IP) {
                            dialog.find("#diag_publicIPAddress").text(IP);
                            dialog.find("#diag_IP").val(IP);
                        }
                    }
                });
                dialog.find("#diag_Protocol").bind("textchange", function () {
                    if ($.trim($(this).val().toLowerCase()) == "ftp")
                        dialog.find(".ftpItems").show();
                    else
                        dialog.find(".ftpItems").hide();
                }).trigger("textchange");

                dialog.find("#diag_Port").bind("dblclick", function () {
                    $(this).removeAttr('readonly').focus();
                });
                dialog.find(".telnet-btn").on("click", function () {
                    window.crushTelnet.show();
                    dialog.modal('hide');
                });
            } else {
                var busy = $(this).closest(".details-bubble").addClass('busy');
                $service.adminAction(action + "Server", index, function (data) {
                    var success = false;

                    if (data && $(data).find("response_status").text() == "OK")
                        success = true;

                    if (!success) {
                        $.bootstrapGrowl("Action " + action + " server failed for server " + dataItem.displayText, {
                            type: "danger",
                            width: "auto",
                            allow_dismiss: true
                        });
                    } else {
                        var msg = "Server " + dataItem.displayText + " started";
                        if (action == "stop")
                            msg = "Server " + dataItem.displayText + " stopped";
                        else if (action == "restart")
                            msg = "Server " + dataItem.displayText + " restarted";

                        $.bootstrapGrowl(msg, {
                            type: "success",
                            width: "auto",
                            allow_dismiss: true
                        });
                    }
                    busy.removeClass('busy');
                });
            }
            evt.stopPropagation();
            evt.preventDefault();
            return false;
        });
        this.eventsAdded = true;
    }

    /*Prepare all html templates to be used with mustache*/
    function prepareTemplates(callback) {
        $.get("templates/templates.html", function (tpls) {
            $('body').append(tpls);
            _templates.mainTree = $("#mainTreeTpl").html();
            _templates.bubble = $("#bubbleTpl").html();
            _templates.subItem = $("#subItemsTpl").html();
            _templates.countBadge = $("#countsBadgeTpl").html();
            _templates.detailsBubble = $("#detailsBubbleTpl").html();
            _templates.diagnoseDialog = $("#diagnoseDialogTpl").html();
            _templates.serverTransfersStatus = $("#serverStatusTpl").html();
            if (callback)
                callback();
        });
    }

    /*Poll server to get current status of the server*/
    function pollServer() {
        $service.fetchServerDetails(function (servers) {
            if(!_defaultServerTypes){
                var serverTypes = [];
                for(var type in servers){
                    serverTypes.push(type);
                }
                _defaultServerTypes = serverTypes;
                renderMainServers();
            }
            processServerData(servers);
            setTimeout(pollServer, _pollInterval * 1000);
        });
    }

    /*To reflect updated server info*/
    function processServerData(servers) {
        if (!_serverItems) {
            _serverItems = servers;
            renderSubItems();
            bindEvents();
        } else {
            _serverItems = servers;
            updateSubItems();
        }
    }

    /*Init dashboard*/
    function initDashboard() {
        //renderMainServers();
        pollServer();
    }

    /*Check if user is logged in, add dependencies and prepare templates, load dashboard*/
    function boot() {
        /*Dependency Injection*/
        $utils = crushDashboard.utils;
        $loader = crushDashboard.loader;
        $service = crushDashboard.service;

        $loader.init();
        $loader.show();
        $service.getUserName(function (validLogin) {
            if (!validLogin) {
                var path = "/WebInterface/dashboard/index.html";
                window.location = "/WebInterface/login.html?link=" + encodeURI(path);
                return false;
            } else {
                $loader.hide();
                prepareTemplates(initDashboard);
            }
        });
    }

    return {
        boot: boot
    };
})(jQuery);

$(document).ready(function () {
    crushDashboard.boot();
});